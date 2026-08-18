import { defineConfig } from 'vitepress'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
// @ts-ignore — 纯 ESM 生成器（Node 标准库，无类型声明）
import {
  ROOT,
  SRC_EXCLUDE,
  assertContentFile,
  buildSidebar,
  collectPages,
  collectPublishedPages,
  computeStats,
  findForbiddenSymlinks,
  mapMarkdownLinks,
  SITE_HOST,
} from './sidebar.mjs'
// @ts-ignore — 首页文案唯一事实源（HomeArchive.vue 消费同一模块）
import { HOME_TITLE, homeMarkdown } from './theme/home-copy.mjs'

const HOST = SITE_HOST
const REPO_URL = 'https://github.com/deusyu/harness-engineering'
const RAW_URL = 'https://raw.githubusercontent.com/deusyu/harness-engineering/main'
const SITE_TITLE = 'Harness Engineering'
const SITE_DESC = '驭缰工程中文学习档案——概念笔记、独立思考、系统性翻译与实践记录'

// 门闩：config 一被加载（dev 与 build 皆然）就拒绝任何 symlink。Vite 会解引用
// public/ 下的软链，Markdown 图片管线会读取链接目标——参与发布的每一个字节都
// 必须来自仓库本身。
const forbiddenSymlinks = findForbiddenSymlinks()
if (forbiddenSymlinks.length) {
  throw new Error(
    `symlinks are forbidden in this repo (they can leak external files into the published site): ${forbiddenSymlinks.join(', ')}`
  )
}

// git 跟踪集：只有跟踪中的目标才配改写成 GitHub/raw 链接——本地存在但未跟踪
// 的文件改写过去只会得到 404。git 不可用（如脱离仓库的裸目录）时放行兜底。
const TRACKED = (() => {
  try {
    const files = new Set(
      execFileSync('git', ['ls-files', '-z'], {
        cwd: ROOT,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
        maxBuffer: 32 * 1024 * 1024,
      })
        .split('\0')
        .filter(Boolean)
    )
    const dirs = new Set<string>()
    for (const f of files) {
      let d = path.posix.dirname(f)
      while (d !== '.' && !dirs.has(d)) {
        dirs.add(d)
        d = path.posix.dirname(d)
      }
    }
    return { files, dirs } as { files: Set<string> | null; dirs: Set<string> }
  } catch {
    return { files: null, dirs: new Set<string>() }
  }
})()

const isTracked = (rel: string, isDir: boolean) =>
  TRACKED.files === null || (isDir ? TRACKED.dirs.has(rel) : TRACKED.files.has(rel))

/** URL 路径段编码（CJK/空格/& 等合法文件名安全；'#'/'?' 文件名被 C14 verify 禁止）。
 *  括号等 RFC3986 sub-delims 也强制编码——它们会截断 Markdown 行内链接语法。 */
const encodePath = (rel: string) =>
  rel
    .split('/')
    .map((seg) =>
      encodeURIComponent(seg).replace(/[()!'*]/g, (ch) => `%${ch.charCodeAt(0).toString(16).toUpperCase()}`)
    )
    .join('/')

/** 容错解码：非法转义序列按原文返回（幂等编码的前置步骤）。 */
const safeDecode = (s: string) => {
  try {
    return decodeURIComponent(s)
  } catch {
    return s
  }
}

/** 锚点编码：改写产出的 URL 若透传原始锚点，空格等字符会截断 Markdown 链接。
 *  先解码再编码保证幂等——源里已写成 %20 / UTF-8 转义的锚点不会被二次编码。 */
const encodeAnchor = (anchor: string) => (anchor ? `#${encodeURIComponent(safeDecode(anchor.slice(1)))}` : '')

/** 站内页面路由 → 对外绝对 URL（llms/RSS/og 的唯一出口，统一做路径段编码）。 */
const pageUrl = (link: string) => `${HOST}${encodePath(link)}`

const PUBLISHED_FILES = new Set(collectPublishedPages().map((p) => p.file))

type LinkClass =
  | { kind: 'skip' } // 协议链接/锚点/站内绝对路径/无法解析 —— 原样保留
  | { kind: 'published'; rel: string; anchor: string } // 相对链接指向已发布 md
  | { kind: 'dir-readme'; rel: string; anchor: string } // 目录且其 README 已发布
  | { kind: 'github'; rel: string; anchor: string; isDir: boolean } // 已跟踪的仓库资产
  | { kind: 'unknown' } // 不存在/未跟踪 —— 留给死链检查大声报错

/** 站点渲染与 .md 副本共用的链接判定：一个决策表，两个消费端。 */
function classifyLink(pageRel: string, href: string): LinkClass {
  if (!href || /^(?:[a-z][a-z0-9+.-]*:|\/\/|#|\/)/i.test(href)) return { kind: 'skip' }
  const hash = href.indexOf('#')
  const anchor = hash === -1 ? '' : href.slice(hash)
  let target = hash === -1 ? href : href.slice(0, hash)
  // query string 不是文件路径的一部分（仓库文件对 query 无语义，解析时剥离）。
  const q = target.indexOf('?')
  if (q !== -1) target = target.slice(0, q)
  if (!target) return { kind: 'skip' }
  // 按路径段 decodeURIComponent（decodeURI 不解 %26/%3A 等保留字符，源里写
  // 成 a%26b.md 的链接会匹配不上文件名含 & 的已发布页）。
  const decoded = target.split('/').map(safeDecode).join('/')
  const rel = path.posix
    .normalize(path.posix.join(path.posix.dirname(pageRel), decoded))
    .replace(/\/+$/, '')
  if (!rel || rel.startsWith('..')) return { kind: 'skip' }
  if (PUBLISHED_FILES.has(rel)) return { kind: 'published', rel, anchor }
  let stat
  try {
    stat = fs.statSync(path.join(ROOT, rel))
  } catch {
    return { kind: 'unknown' }
  }
  if (stat.isDirectory() && PUBLISHED_FILES.has(path.posix.join(rel, 'README.md'))) {
    return { kind: 'dir-readme', rel, anchor }
  }
  if (!isTracked(rel, stat.isDirectory())) return { kind: 'unknown' }
  return { kind: 'github', rel, anchor, isDir: stat.isDirectory() }
}

export default defineConfig({
  lang: 'zh-CN',
  base: '/',
  title: SITE_TITLE,
  description: SITE_DESC,

  cleanUrls: true,
  lastUpdated: true,

  // 站点只发布内容页：智能体导航文件（AGENTS.md）、仓库门面（根 README）、
  // 本地过程稿（translate/、output/）与私密资料（private/）都不属于站点。
  // 排除清单的唯一事实源在 sidebar.mjs（SRC_EXCLUDE），与发布页面模型同源。
  srcExclude: SRC_EXCLUDE,

  // 死链阻断保持开启：仓库内为 GitHub 浏览而写的交叉链接（目录链接、指向
  // .py/AGENTS.md 的链接）由下方 markdown.config 的构建期改写规则统一转成
  // GitHub 链接，站内不应残留任何死链。
  sitemap: { hostname: HOST },

  markdown: {
    image: { lazy: true },
    config(md) {
      // 构建期链接改写：相对链接若指向站点未发布的目标（AGENTS.md、源码文件、
      // 目录……），改写为 GitHub 链接，内容在站点与 GitHub 两个语境下都可读；
      // 指向的目录若有已发布的 README，则直接路由到站内该页。改写发生在 parse
      // 阶段，VitePress 的死链检查看到的已是改写后的链接，因此无需关闭检查。
      // 判定逻辑与 .md 副本改写共用 classifyLink 一张决策表。
      // （PUBLISHED_FILES 在 config 加载时快照一次；dev 模式新增页面需重启才
      // 会进集合，生产构建每次全新快照，不受影响。）
      md.core.ruler.push('ha_rewrite_repo_links', (state) => {
        const pagePath = (state.env as { relativePath?: string })?.relativePath
        if (!pagePath) return
        for (const block of state.tokens) {
          if (block.type !== 'inline' || !block.children) continue
          for (const token of block.children) {
            if (token.type !== 'link_open') continue
            const href = token.attrGet('href')
            if (!href) continue
            const c = classifyLink(pagePath, href)
            if (c.kind === 'dir-readme') {
              token.attrSet('href', `/${c.rel}/README${encodeAnchor(c.anchor)}`)
            } else if (c.kind === 'github') {
              token.attrSet(
                'href',
                `${REPO_URL}/${c.isDir ? 'tree' : 'blob'}/main/${encodePath(c.rel)}${encodeAnchor(c.anchor)}`
              )
            }
            // skip/published/unknown：原样保留（unknown 留给死链检查大声报错）
          }
        }
      })
    },
  },

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    // 标题衬线（Noto Serif SC）：Google Fonts 按 unicode-range 切片按需加载，
    // 不可达时回退系统宋体（Songti SC / STSong）。
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@600;700;900&display=swap' }],
    ['meta', { name: 'theme-color', content: '#f5f1e8' }],
    ['meta', { property: 'og:site_name', content: SITE_TITLE }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['link', { rel: 'alternate', type: 'application/rss+xml', title: `${SITE_TITLE} RSS`, href: `${HOST}/feed.xml` }],
  ],

  transformPageData(pageData) {
    const cleanPath = pageData.relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '')
    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.push(
      ['meta', { property: 'og:title', content: pageData.title ? `${pageData.title} | ${SITE_TITLE}` : `${SITE_TITLE} 学习档案` }],
      ['meta', { property: 'og:description', content: pageData.description || SITE_DESC }],
      ['meta', { property: 'og:url', content: pageUrl(`/${cleanPath}`) }],
      ['meta', { name: 'twitter:card', content: 'summary' }],
    )
    // 构建时估算阅读时长（中文按字数计），供 DocMeta 文档页头使用。
    if (pageData.relativePath !== 'index.md') {
      try {
        const raw = fs
          .readFileSync(assertContentFile(pageData.relativePath), 'utf8')
          .replace(/^---[\s\S]*?\n---/, '')
          .replace(/```[\s\S]*?```/g, '')
        const cjk = (raw.match(/[\u4e00-\u9fff]/g) ?? []).length
        const words = (raw.match(/[A-Za-z0-9]+/g) ?? []).length
        pageData.frontmatter.haReadingTime = Math.max(1, Math.round((cjk + words * 1.5) / 400))
      } catch {
        /* 文件不可读时跳过阅读时长 */
      }
    }
  },

  themeConfig: {
    logo: '/favicon.svg',
    siteTitle: '驭缰工程',

    nav: [
      { text: '概念', link: '/concepts/00-overview' },
      { text: '思考', link: '/thinking/why-this-project-exists' },
      { text: '实践', link: '/practice/01-ralph-demo/README' },
      { text: '作品', link: '/works/harness-engineering-chinese-interpretation' },
      { text: '资料库', link: '/references/articles' },
    ],

    // 侧边栏由 .vitepress/sidebar.mjs 从文件系统生成（C14 守卫），不手写。
    sidebar: buildSidebar(),

    outline: { label: '本页目录 · ON THIS PAGE', level: [2, 3] },

    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索', buttonAriaLabel: '搜索文档' },
          modal: {
            noResultsText: '未找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' },
          },
        },
      },
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/deusyu/harness-engineering' }],

    footer: {
      message: '人类掌舵，智能体执行 · Released under the MIT License',
      copyright: 'Copyright © 2026 deusyu',
    },

    lastUpdated: { text: '最后更新于' },
    docFooter: { prev: '上一篇', next: '下一篇' },

    editLink: {
      pattern: 'https://github.com/deusyu/harness-engineering/edit/main/:path',
      text: '在 GitHub 上编辑此页',
    },

    externalLinkIcon: true,
  },

  /**
   * 构建尾钩子（Node 标准库实现，零运行时依赖）：
   *   1. 每个内容页生成同路径 .md 纯文本副本（URL + `.md` 即得）；
   *   2. /llms.txt 与 /llms-full.txt —— 面向智能体的站点索引与全文（llms.txt 约定）;
   *   3. /feed.xml —— RSS 2.0，条目时间取自 git 提交历史。
   */
  async buildEnd(siteConfig) {
    const out = siteConfig.outDir
    const pages = collectPages() // 侧栏内容页：llms 分组索引与 RSS 用
    const published = collectPublishedPages() // 发布全集（含首页与附属页）：md 副本与全文用
    const stats = computeStats()

    // 首页的 Markdown 版本由 home-copy.mjs（与 HomeArchive.vue 同源）生成——
    // index.md 源文件只是组件壳，直接复制对机器不可读。副本带 frontmatter；
    // llms-full 用无 frontmatter 的正文（那里已有生成的元数据块）。
    const homeMd = homeMarkdown(stats, HOST)
    const copyOf = (p: { file: string; link: string }) =>
      p.file === 'index.md'
        ? `---\ntitle: ${JSON.stringify(HOME_TITLE)}\n---\n\n${homeMd}`
        : transformCopy(p.file, fs.readFileSync(assertContentFile(p.file), 'utf8'))

    // 1) 每个发布页面伴生同路径 Markdown 副本（首页 → /index.md）。副本内的
    //    仓库专用链接与图片同步改写为 GitHub/raw 绝对地址，保证脱离仓库语境
    //    也能解析。与产物的一一对应由 scripts/verify-dist.mjs 在构建后机械校验。
    const copies = new Map<string, string>()
    for (const p of published) copies.set(p.file, copyOf(p))
    for (const p of published) {
      const dest = path.join(out, p.link === '/' ? 'index.md' : `${p.link.slice(1)}.md`)
      fs.mkdirSync(path.dirname(dest), { recursive: true })
      fs.writeFileSync(dest, copies.get(p.file)!)
    }

    // 2) llms.txt / llms-full.txt
    const sidebarFiles = new Set(pages.map((p) => p.file))
    const extras = published.filter((p) => p.file !== 'index.md' && !sidebarFiles.has(p.file))
    const model = groupedForLlms(pages)
    const llms = [
      `# ${SITE_TITLE} 学习档案`,
      '',
      `> 中文 Harness Engineering（驭缰工程）知识库：${stats.concepts} 篇概念笔记、${stats.thinking} 篇独立思考、${stats.translations} 篇一手翻译，以及收录 ${stats.articles} 篇文章的深度摘要索引。人类掌舵，智能体执行。`,
      '',
      '本站每个页面都有同路径的 Markdown 版本：在页面 URL 后追加 `.md` 即可获取纯文本（首页为 `/index.md`）。',
      '',
      ...model,
      ...(extras.length
        ? ['## 附属页面', '', ...extras.map((p) => `- [${p.text}](${pageUrl(p.link)}.md)`), '']
        : []),
      '## 完整内容',
      '',
      `- [llms-full.txt](${HOST}/llms-full.txt)：全站正文合并版`,
      '',
    ].join('\n')
    fs.writeFileSync(path.join(out, 'llms.txt'), llms)

    // 全文 = 首页 + 侧栏内容页（按分区顺序）+ 附属页。合并文档没有「所在
    // 目录」，因此不能复用同路径副本的内容：改用 absolute 模式重新改写
    //（相对链接 → 各页 .md 副本的绝对 URL），并剥离源 frontmatter——生成的
    // 元数据块后紧跟第二个 --- 块会让按块解析的消费端产生歧义。标题经
    // JSON.stringify 保证元数据块是合法 YAML。
    const fullEntries = [
      { text: HOME_TITLE, link: '/', content: homeMd },
      ...[...pages, ...extras].map((p) => ({
        text: p.text,
        link: p.link,
        content: stripFrontmatter(
          transformCopy(p.file, fs.readFileSync(assertContentFile(p.file), 'utf8'), true)
        ),
      })),
    ]
    const full = fullEntries
      .map((p) => `\n\n---\ntitle: ${JSON.stringify(p.text)}\nurl: ${pageUrl(p.link)}\n---\n\n${p.content}`)
      .join('')
    fs.writeFileSync(path.join(out, 'llms-full.txt'), `# ${SITE_TITLE} 学习档案 — 全站正文\n${full}`)

    // 3) RSS（feed.xml）
    const dated = pages
      .map((p) => ({ ...p, date: gitDate(p.file) }))
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 30)
    const items = dated
      .map((p) =>
        [
          '    <item>',
          `      <title>${xmlEscape(p.text)}</title>`,
          `      <link>${xmlEscape(pageUrl(p.link))}</link>`,
          `      <guid>${xmlEscape(pageUrl(p.link))}</guid>`,
          `      <pubDate>${p.date.toUTCString()}</pubDate>`,
          '    </item>',
        ].join('\n')
      )
      .join('\n')
    const rss = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<rss version="2.0">',
      '  <channel>',
      `    <title>${SITE_TITLE} 学习档案</title>`,
      `    <link>${HOST}</link>`,
      `    <description>${xmlEscape(SITE_DESC)}</description>`,
      '    <language>zh-cn</language>',
      `    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
      items,
      '  </channel>',
      '</rss>',
      '',
    ].join('\n')
    fs.writeFileSync(path.join(out, 'feed.xml'), rss)
  },
})

const IMAGE_EXT_RE = /\.(png|jpe?g|gif|svg|webp|avif)$/i

/**
 * .md 副本 / llms-full.txt 的构建期改写：链接解析共用 sidebar.mjs 的
 * mapMarkdownLinks（围栏/行内代码/嵌套徽章/引用式定义都在那里统一处理），
 * 判定共用 classifyLink 决策表。
 *   - 图片：已跟踪的仓库图片改写为 raw.githubusercontent 绝对地址——站点把
 *     图片打包成哈希资产，原相对路径在副本语境是死的；引用式定义按目标扩展名
 *     判定是否图片（定义处看不到使用侧语法）；
 *   - 链接：指向已发布 md 的相对链接在同路径副本里原样保留（副本目录结构与
 *     站点一致，依然成立）；目录改写为其 README 副本；其余已跟踪资产改写为
 *     GitHub 链接。
 *   - absolute 模式（llms-full.txt 专用）：合并文档没有「所在目录」，任何
 *     相对/根相对链接都无从解析——已发布页改写为其 .md 副本的绝对 URL，
 *     根相对路由补上 host。
 */
function transformCopy(pageRel: string, raw: string, absolute = false): string {
  return mapMarkdownLinks(raw, (kind: 'image' | 'link' | 'def', href: string) => {
    const c = classifyLink(pageRel, href)
    const asImage = kind === 'image' || (kind === 'def' && c.kind === 'github' && IMAGE_EXT_RE.test(c.rel))
    if (asImage) {
      if (c.kind === 'github' && !c.isDir) return `${RAW_URL}/${encodePath(c.rel)}`
      if (absolute && /^\/[^/]/.test(href)) return `${HOST}${href}` // 根相对图片同样要补 host
      return null
    }
    if (c.kind === 'dir-readme') return `${HOST}/${encodePath(c.rel)}/README.md${encodeAnchor(c.anchor)}`
    if (c.kind === 'github') {
      return `${REPO_URL}/${c.isDir ? 'tree' : 'blob'}/main/${encodePath(c.rel)}${encodeAnchor(c.anchor)}`
    }
    if (absolute) {
      if (c.kind === 'published') {
        return `${pageUrl(`/${c.rel.replace(/\.md$/, '')}`)}.md${encodeAnchor(c.anchor)}`
      }
      if (/^\/[^/]/.test(href)) return `${HOST}${href}` // 根相对路由补 host
    }
    return null // skip/published/unknown：原样保留
  })
}

/** 剥离源 frontmatter（llms-full 专用——生成的元数据块后再跟一个 --- 块会产生解析歧义）。 */
const stripFrontmatter = (raw: string) => raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '')

function groupedForLlms(pages: Array<{ text: string; link: string; file: string }>): string[] {
  const sections = new Map<string, string[]>()
  const sectionOf = (file: string) => {
    const top = file.split('/')[0]
    const names: Record<string, string> = {
      concepts: '概念笔记',
      thinking: '独立思考',
      practice: '动手实践',
      feedback: '反馈记录',
      works: '翻译与作品',
      tools: '工具库',
      prompts: '提示词',
      references: '资源索引',
    }
    return names[top] ?? top
  }
  for (const p of pages) {
    const key = sectionOf(p.file)
    if (!sections.has(key)) sections.set(key, [])
    sections.get(key)!.push(`- [${p.text}](${pageUrl(p.link)}.md)`)
  }
  const lines: string[] = []
  for (const [name, links] of sections) {
    lines.push(`## ${name}`, '', ...links, '')
  }
  return lines
}

function gitDate(file: string): Date {
  try {
    // 参数数组 + `--` 分隔符：文件名永远只是参数，不进 shell，杜绝命令注入。
    const iso = execFileSync('git', ['log', '-1', '--format=%cI', '--', file], {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
    if (iso) return new Date(iso)
  } catch {
    /* 无 git 历史（浅克隆/未跟踪文件）时回退到构建时间 */
  }
  return new Date()
}

function xmlEscape(s: string): string {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}
