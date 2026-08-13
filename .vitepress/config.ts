import { defineConfig } from 'vitepress'
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
// @ts-ignore — 纯 ESM 生成器（Node 标准库，无类型声明）
import { ROOT, buildSidebar, collectPages, computeStats } from './sidebar.mjs'

const HOST = 'https://harness.dyu.sh'
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
  // 本地过程稿（translate/）与私密资料（private/）都不属于站点。
  srcExclude: [
    '**/AGENTS.md',
    'README.md',
    'README.en.md',
    'CLAUDE.md',
    'translate/**',
    'private/**',
    '.claude/**',
  ],

  // 仓库内多数交叉链接为 GitHub 浏览而写（目录链接、指向 .py/AGENTS.md 的链接），
  // VitePress 天然无法解析，故关闭死链阻断。站内导航完整性由 C14 的
  // sidebar --verify 从文件系统侧守护。
  ignoreDeadLinks: true,

  sitemap: { hostname: HOST },

  markdown: {
    image: { lazy: true },
  },

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#0f766e' }],
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
  },

  themeConfig: {
    logo: '/favicon.svg',

    nav: [
      { text: '首页', link: '/' },
      { text: '概念笔记', link: '/concepts/00-overview' },
      { text: '独立思考', link: '/thinking/why-this-project-exists' },
      { text: '翻译与作品', link: '/works/harness-engineering-chinese-interpretation' },
      { text: '文章索引', link: '/references/articles' },
    ],

    // 侧边栏由 .vitepress/sidebar.mjs 从文件系统生成（C14 守卫），不手写。
    sidebar: buildSidebar(),

    outline: { label: '本页目录', level: [2, 3] },

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
    const pages = collectPages()
    const stats = computeStats()

    // 1) 每页伴生 Markdown 副本
    for (const p of pages) {
      const dest = path.join(out, `${p.link.slice(1)}.md`)
      fs.mkdirSync(path.dirname(dest), { recursive: true })
      fs.copyFileSync(path.join(ROOT, p.file), dest)
    }

    // 2) llms.txt / llms-full.txt
    const model = groupedForLlms(pages)
    const llms = [
      `# ${SITE_TITLE} 学习档案`,
      '',
      `> 中文 Harness Engineering（驭缰工程）知识库：${stats.concepts} 篇概念笔记、${stats.thinking} 篇独立思考、${stats.translations} 篇一手翻译，以及收录 ${stats.articles} 篇文章的深度摘要索引。人类掌舵，智能体执行。`,
      '',
      '本站每个页面都有同路径的 Markdown 版本：在页面 URL 后追加 `.md` 即可获取纯文本。',
      '',
      ...model,
      '## 完整内容',
      '',
      `- [llms-full.txt](${HOST}/llms-full.txt)：全站正文合并版`,
      '',
    ].join('\n')
    fs.writeFileSync(path.join(out, 'llms.txt'), llms)

    const full = pages
      .map((p) => {
        const raw = fs.readFileSync(path.join(ROOT, p.file), 'utf8')
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
    const iso = execSync(`git log -1 --format=%cI -- "${file}"`, {
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
