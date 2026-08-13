/**
 * 站点导航与统计的唯一生成器 —— 一切从文件系统派生，杜绝手写漂移。
 *
 * 注意：本文件不能带 shebang——VitePress 用 esbuild 打包 config.ts 时会把
 * 本文件拼接进 bundle，`#!` 不在文件首字节即语法错误。
 *
 * 本仓库的方法论是机械化一致性检查（C1–C14），手写侧边栏会成为检查覆盖
 * 不到的漂移面。因此：
 *   - 侧边栏永远不手写。新增内容文件自动进入侧边栏；works/ 下未匹配到
 *     任何分组前缀的新文件落入「社区博客」兜底组 —— 宁可分组不准，
 *     不可静默丢失。
 *   - 站点源码不写裸计数。所有展示数字由 computeStats() 构建时统计。
 *   - `node .vitepress/sidebar.mjs --verify` 断言每个一等内容页在侧边栏
 *     恰好出现一次，是 scripts/check-consistency.sh C14 的机械化入口。
 *
 * 仅依赖 Node 标准库，可独立执行：
 *   node .vitepress/sidebar.mjs            # 打印生成的侧边栏 JSON
 *   node .vitepress/sidebar.mjs --verify   # 完整性校验（C14 调用）
 *   node .vitepress/sidebar.mjs --stats    # 打印构建时统计
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function readText(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8')
}

/** 列出目录下的内容 md 文件（排除 AGENTS.md），返回仓库相对路径，按文件名排序。 */
function listMd(dir, { recursive = false } = {}) {
  const abs = path.join(ROOT, dir)
  if (!fs.existsSync(abs)) return []
  const out = []
  for (const ent of fs.readdirSync(abs, { withFileTypes: true })) {
    if (ent.isDirectory()) {
      if (recursive) out.push(...listMd(path.join(dir, ent.name), { recursive }))
      continue
    }
    if (!ent.name.endsWith('.md') || ent.name === 'AGENTS.md') continue
    out.push(path.join(dir, ent.name))
  }
  return out.sort()
}

/** 子目录形态的作品/实验：以其 README.md 作为入口页。 */
function subdirReadmes(dir) {
  const abs = path.join(ROOT, dir)
  if (!fs.existsSync(abs)) return []
  const out = []
  for (const ent of fs.readdirSync(abs, { withFileTypes: true })) {
    if (!ent.isDirectory()) continue
    const rel = path.join(dir, ent.name, 'README.md')
    if (fs.existsSync(path.join(ROOT, rel))) out.push(rel)
  }
  return out.sort()
}

/** 标题优先级：frontmatter title > 首个 H1 > 文件名；去掉结尾全角括注以适配侧边栏宽度。 */
export function extractTitle(rel) {
  const text = readText(rel)
  let title = null
  const fm = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (fm) {
    const m = fm[1].match(/^title:\s*(.+)\s*$/m)
    if (m) title = m[1].trim().replace(/^["'](.*)["']$/, '$1')
  }
  if (!title) {
    const h1 = text.match(/^# (.+)$/m)
    if (h1) title = h1[1].trim()
  }
  if (!title) title = path.basename(rel, '.md')
  return title.replace(/（[^（）]*）\s*$/, '').trim()
}

function page(rel) {
  return { text: extractTitle(rel), link: '/' + rel.replace(/\.md$/, ''), file: rel }
}

/**
 * works/ 分组规则：按文件名前缀归入来源系列（分组式信息架构吸收自 PR #21，
 * by @Doraemonblogs）。match 按数组顺序生效，最后一组恒真兜底。
 */
const WORKS_GROUPS = [
  { text: '原创分析', match: (n) => n === 'harness-engineering-chinese-interpretation.md' },
  { text: 'Martin Fowler 系列', match: (n) => n.startsWith('fowler-') },
  { text: 'Anthropic 系列', match: (n) => n.startsWith('anthropic-') },
  { text: 'LangChain 系列', match: (n) => /^(langchain|langsmith|deep-agents)-/.test(n) },
  { text: '学术论文', match: (n) => /^(arxiv-|meta-harness-paper|inside-the-scaffold-paper)/.test(n) },
  { text: '工程实践', match: (n) => /^(openai|github|cursor|metr|bun)-/.test(n) },
  { text: '中文收录', match: (n) => /-(zh-cn-repost|original)\.md$/.test(n) },
  { text: '社区博客', match: () => true },
]

function worksSection() {
  const groups = WORKS_GROUPS.map((g) => ({ text: g.text, match: g.match, items: [] }))
  for (const rel of listMd('works')) {
    const name = path.basename(rel)
    groups.find((g) => g.match(name)).items.push(page(rel))
  }
  for (const rel of subdirReadmes('works')) groups[0].items.push(page(rel))
  return {
    text: '翻译与作品',
    collapsed: true,
    items: groups
      .filter((g) => g.items.length > 0)
      .map((g) => ({ text: g.text, collapsed: true, items: g.items })),
  }
}

export function articlesCount() {
  return (readText('references/articles.md').match(/^### \d+\./gm) ?? []).length
}

/** 内部模型：与最终侧边栏同构，但每个页面节点额外带 file 字段供校验/构建用。 */
export function buildModel() {
  return [
    { text: '概念笔记', collapsed: false, items: listMd('concepts').map(page) },
    { text: '独立思考', collapsed: false, items: listMd('thinking').map(page) },
    { text: '动手实践', collapsed: false, items: subdirReadmes('practice').map(page) },
    { text: '反馈记录', collapsed: false, items: listMd('feedback').map(page) },
    worksSection(),
    { text: '工具库', collapsed: false, items: listMd('tools', { recursive: true }).map(page) },
    { text: '提示词', collapsed: false, items: listMd('prompts').map(page) },
    {
      text: '资源索引',
      collapsed: false,
      items: [{ ...page('references/articles.md'), text: `文章索引（${articlesCount()} 篇深度摘要）` }],
    },
  ]
}

function stripFile(nodes) {
  return nodes.map(({ file, items, ...rest }) => ({
    ...rest,
    ...(items ? { items: stripFile(items) } : {}),
  }))
}

/** VitePress themeConfig.sidebar 直接消费的形态。 */
export function buildSidebar() {
  return stripFile(buildModel())
}

/** 展平出全部页面节点（含 file），供 --verify 与 buildEnd（md 副本 / llms / RSS）使用。 */
export function collectPages() {
  const out = []
  const walk = (nodes) => {
    for (const n of nodes) {
      if (n.link) out.push(n)
      if (n.items) walk(n.items)
    }
  }
  walk(buildModel())
  return out
}

/** 首页与 llms.txt 使用的构建时统计 —— 站点里出现的每个数字都来自这里。 */
export function computeStats() {
  return {
    articles: articlesCount(),
    translations: listMd('works').filter((f) => f.endsWith('-translation.md')).length,
    concepts: listMd('concepts').length,
    thinking: listMd('thinking').length,
    checks: (readText('scripts/check-consistency.sh').match(/^echo "\[C\d+\]/gm) ?? []).length,
  }
}

/** 一等内容页集合：这些文件必须出现在侧边栏中（PROMPT.md、style.md 等附属材料不在此列）。 */
function requiredPages() {
  const req = new Set()
  for (const d of ['concepts', 'thinking', 'feedback', 'prompts', 'works']) {
    for (const f of listMd(d)) req.add(f)
  }
  for (const f of listMd('tools', { recursive: true })) req.add(f)
  for (const f of subdirReadmes('practice')) req.add(f)
  for (const f of subdirReadmes('works')) req.add(f)
  req.add('references/articles.md')
  return req
}

export function verify() {
  const files = collectPages().map((p) => p.file)
  const seen = new Set()
  const dups = []
  for (const f of files) (seen.has(f) ? dups.push(f) : seen.add(f))
  const req = requiredPages()
  const missing = [...req].filter((f) => !seen.has(f))
  const orphans = files.filter((f) => !fs.existsSync(path.join(ROOT, f)))
  const problems = []
  if (missing.length) problems.push(`missing from generated sidebar: ${missing.join(', ')}`)
  if (dups.length) problems.push(`duplicated in generated sidebar: ${dups.join(', ')}`)
  if (orphans.length) problems.push(`sidebar links to nonexistent files: ${orphans.join(', ')}`)
  return { ok: problems.length === 0, problems, pageCount: files.length, requiredCount: req.size }
}

const invokedDirectly =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (invokedDirectly) {
  const mode = process.argv[2]
  if (mode === '--verify') {
    const r = verify()
    if (r.ok) {
      console.log(
        `sidebar derives ${r.pageCount} pages from the filesystem; all ${r.requiredCount} first-class content files present exactly once`
      )
      process.exit(0)
    }
    for (const p of r.problems) console.error(p)
    process.exit(1)
  } else if (mode === '--stats') {
    console.log(JSON.stringify(computeStats(), null, 2))
  } else {
    console.log(JSON.stringify(buildSidebar(), null, 2))
  }
}
