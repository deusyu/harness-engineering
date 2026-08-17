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
} from './sidebar.mjs'

const HOST = 'https://harness.dyu.sh'
const REPO_URL = 'https://github.com/deusyu/harness-engineering'
const SITE_TITLE = 'Harness Engineering'
const SITE_DESC = '驭缰工程中文学习档案——概念笔记、独立思考、系统性翻译与实践记录'

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
      // （published 在渲染器创建时快照一次；dev 模式新增页面需重启才会进集合，
      // 生产构建每次全新快照，不受影响。）
      const published = new Set(collectPublishedPages().map((p) => p.file))
      // 只有 git 跟踪的目标才配得到 GitHub 链接——本地存在但未跟踪的文件改写
      // 过去只会得到 404；这类链接留给死链检查大声报错。git 不可用时放行兜底。
      let trackedFiles: Set<string> | null = null
      const trackedDirs = new Set<string>()
      try {
        trackedFiles = new Set(
          execFileSync('git', ['ls-files', '-z'], {
            cwd: ROOT,
            encoding: 'utf8',
            stdio: ['ignore', 'pipe', 'ignore'],
            maxBuffer: 32 * 1024 * 1024,
          })
            .split('\0')
            .filter(Boolean)
        )
        for (const f of trackedFiles) {
          let d = path.posix.dirname(f)
          while (d !== '.' && !trackedDirs.has(d)) {
            trackedDirs.add(d)
            d = path.posix.dirname(d)
          }
        }
      } catch {
        trackedFiles = null
      }
      const isTracked = (rel: string, isDir: boolean) =>
        trackedFiles === null || (isDir ? trackedDirs.has(rel) : trackedFiles.has(rel))
      md.core.ruler.push('ha_rewrite_repo_links', (state) => {
        const pagePath = (state.env as { relativePath?: string })?.relativePath
        if (!pagePath) return
        for (const block of state.tokens) {
          if (block.type !== 'inline' || !block.children) continue
          for (const token of block.children) {
            if (token.type !== 'link_open') continue
            const href = token.attrGet('href')
            // 只处理相对链接；协议链接、锚点、站内绝对路径原样保留。
            if (!href || /^(?:[a-z][a-z0-9+.-]*:|\/\/|#|\/)/i.test(href)) continue
            const hash = href.indexOf('#')
            const target = hash === -1 ? href : href.slice(0, hash)
            const anchor = hash === -1 ? '' : href.slice(hash)
            if (!target) continue
            let decoded = target
            try {
              decoded = decodeURI(target)
            } catch {
              /* 非法转义序列：按原文处理 */
            }
            const rel = path.posix
              .normalize(path.posix.join(path.posix.dirname(pagePath), decoded))
              .replace(/\/+$/, '')
            if (rel.startsWith('..')) continue // 仓库外相对路径：留给死链检查报错
            if (published.has(rel)) continue // 已发布页面：VitePress 自会路由
            let stat
            try {
              stat = fs.statSync(path.join(ROOT, rel))
            } catch {
              continue // 目标不存在：留给死链检查报错
            }
            if (stat.isDirectory() && published.has(path.posix.join(rel, 'README.md'))) {
              token.attrSet('href', `/${rel}/README${anchor}`)
            } else if (isTracked(rel, stat.isDirectory())) {
              const kind = stat.isDirectory() ? 'tree' : 'blob'
              token.attrSet('href', `${REPO_URL}/${kind}/main/${rel}${anchor}`)
            }
            // 未跟踪的本地目标不改写：留给死链检查报错，胜过发布一个 404 链接
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
      ['meta', { property: 'og:url', content: `${HOST}/${cleanPath}` }],
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

    // 1) 每个发布页面伴生同路径 Markdown 副本（首页 → /index.md）。
    //    与产物的一一对应由 scripts/verify-dist.mjs 在构建后机械校验。
    for (const p of published) {
      const dest = path.join(out, p.link === '/' ? 'index.md' : `${p.link.slice(1)}.md`)
      fs.mkdirSync(path.dirname(dest), { recursive: true })
      fs.copyFileSync(assertContentFile(p.file), dest)
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
        ? ['## 附属页面', '', ...extras.map((p) => `- [${p.text}](${HOST}${p.link}.md)`), '']
        : []),
      '## 完整内容',
      '',
      `- [llms-full.txt](${HOST}/llms-full.txt)：全站正文合并版`,
      '',
    ].join('\n')
    fs.writeFileSync(path.join(out, 'llms.txt'), llms)

    // 全文 = 侧栏内容页（按分区顺序）+ 附属页；首页是纯组件壳，无正文可并。
    const full = [...pages, ...extras]
      .map((p) => {
        const raw = fs.readFileSync(assertContentFile(p.file), 'utf8')
        return `\n\n---\ntitle: ${p.text}\nurl: ${HOST}${p.link}\n---\n\n${raw}`
      })
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
          `      <link>${HOST}${p.link}</link>`,
          `      <guid>${HOST}${p.link}</guid>`,
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
    sections.get(key)!.push(`- [${p.text}](${HOST}${p.link}.md)`)
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
