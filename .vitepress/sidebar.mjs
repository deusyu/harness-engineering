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
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const REAL_ROOT = fs.realpathSync(ROOT)

/** 站点对外域名——config.ts（页面渲染/llms 输出）与 verify-dist（副本校验）同源。 */
export const SITE_HOST = 'https://harness.dyu.sh'

/**
 * 站点不发布的源文件（VitePress srcExclude 的唯一事实源，config.ts 直接 import）。
 * collectPublishedFiles() 的排除规则与此保持同构；两者的最终一致性由
 * scripts/verify-dist.mjs 在构建产物上机械校验。
 */
export const SRC_EXCLUDE = [
  '**/AGENTS.md',
  'README.md',
  'README.en.md',
  'CLAUDE.md',
  'translate/**',
  'private/**',
  'output/**',
  '.claude/**',
]

/**
 * 安全解析内容文件：必须是仓库根内的普通文件。拒绝 symlink 与越界路径，
 * 防止仓库外内容（哪怕通过一个恶意/失误的软链）被读入并复制进公开产物。
 */
export function assertContentFile(rel) {
  const expected = path.join(REAL_ROOT, rel)
  if (!expected.startsWith(REAL_ROOT + path.sep)) throw new Error(`refusing path outside repo root: ${rel}`)
  const abs = path.join(ROOT, rel)
  const st = fs.lstatSync(abs, { throwIfNoEntry: false })
  if (!st || !st.isFile()) throw new Error(`refusing non-regular file (symlink/missing): ${rel}`)
  if (fs.realpathSync(abs) !== expected) throw new Error(`refusing symlinked path: ${rel}`)
  return abs
}

function readText(rel) {
  return fs.readFileSync(assertContentFile(rel), 'utf8')
}

/** 列出目录下的内容 md 文件（排除 AGENTS.md 与一切非普通文件），返回仓库相对路径
 *  （统一 `/` 分隔——排除规则与 URL 逻辑都以此为标识），按文件名排序。 */
function listMd(dir, { recursive = false } = {}) {
  const abs = path.join(ROOT, dir)
  if (!fs.existsSync(abs)) return []
  const out = []
  for (const ent of fs.readdirSync(abs, { withFileTypes: true })) {
    if (ent.isDirectory()) {
      if (recursive) out.push(...listMd(`${dir}/${ent.name}`, { recursive }))
      continue
    }
    if (!ent.isFile()) continue // symlink 一律不进内容集
    if (!ent.name.endsWith('.md') || ent.name === 'AGENTS.md') continue
    out.push(`${dir}/${ent.name}`)
  }
  return out.sort()
}

/** 子目录形态的作品/实验：以其 README.md 作为入口页（必须是普通文件，symlink 不算）。 */
function subdirReadmes(dir) {
  const abs = path.join(ROOT, dir)
  if (!fs.existsSync(abs)) return []
  const out = []
  for (const ent of fs.readdirSync(abs, { withFileTypes: true })) {
    if (!ent.isDirectory()) continue
    const rel = `${dir}/${ent.name}/README.md`
    const st = fs.lstatSync(path.join(ROOT, rel), { throwIfNoEntry: false })
    if (st?.isFile()) out.push(rel)
  }
  return out.sort()
}

/**
 * 遍历 Markdown 源里「真实导航」位置的链接——行内链接、图片、引用式定义——
 * 跳过围栏代码块（含 4+ 反引号嵌套围栏）与行内代码里的语法示例。
 * fn(kind, href) 返回字符串则把该链接目标替换为返回值，返回 null 保持原样。
 * 改写侧（config.ts transformCopy）用本函数；校验侧（scripts/verify-dist.mjs）
 * 用 VitePress 自带渲染器的 AST 独立提取——两条解析路径互为对方的探测器。
 *
 * 已知边界（逐行正则解析的固有限制，与生产解析器对拍基线 171/171 一致）：
 * 跨行行内代码、4 空格缩进代码块、打断段落的伪引用定义行会被当普通文本处理。
 * 这些形态改坏真实链接时会被 AST 校验以断链形式抓住；改坏代码示例属静默面，
 * 仓库内容约定不在正文用这些形态（现存内容为零）。
 */
export function mapMarkdownLinks(raw, fn) {
  // 目标形态：<尖括号目标>（可含空格）或普通目标（允许一层平衡括号）。
  const DEST = /(?:<([^<>\n]*)>|((?:\([^()\s]*\)|[^()\s])+?))/.source
  const TITLE = /( +("[^"]*"|'[^']*'))?/.source
  const IMG_RE = new RegExp(`!\\[([^\\]]*)\\]\\(${DEST}${TITLE}\\)`, 'g')
  // 链接文本允许嵌套一个图片（徽章形态 [![alt](img)](target)）；(?<!!) 防止把
  // 图片语法自身再当链接匹配一次。
  const LINK_RE = new RegExp(
    `(?<!!)\\[((?:[^[\\]]|!\\[[^\\]]*\\]\\([^()]*\\))*)\\]\\(${DEST}${TITLE}\\)`,
    'g'
  )
  // 引用式链接定义 [ref]: target（排除脚注 [^n]:）。
  const DEF_RE = /^(\s*\[(?!\^)[^\]]+\]:\s*)(?:<([^<>\n]*)>|(\S+))(.*)$/
  const mapSeg = (seg) =>
    seg
      .replace(IMG_RE, (m, text, angle, plain, titlePart) => {
        const r = fn('image', angle ?? plain)
        return r == null ? m : `![${text}](${r}${titlePart ?? ''})`
      })
      .replace(LINK_RE, (m, text, angle, plain, titlePart) => {
        const r = fn('link', angle ?? plain)
        return r == null ? m : `[${text}](${r}${titlePart ?? ''})`
      })
  let fence = null
  return raw
    .split('\n')
    .map((line) => {
      if (fence) {
        const close = line.match(/^\s*(`{3,}|~{3,})\s*$/)
        if (close && close[1][0] === fence[0] && close[1].length >= fence.length) fence = null
        return line
      }
      const open = line.match(/^\s*(`{3,}|~{3,})/)
      if (open) {
        fence = open[1]
        return line
      }
      // 行内代码先挖空成占位符：`...` 里的链接是语法示例、不参与解析，
      // 但链接文本里的行内代码（[\`file.md\`](path) 形态）不能阻断链接识别，
      // 所以不能按代码段切开整行——挖空后整行统一匹配，最后回填。
      // 行内已含 NUL 的病态输入（文本文件不该有）直接跳过挖空，防止占位符冲突。
      const codes = []
      const masked = line.includes('\x00')
        ? line
        : line.replace(/`+[^`\n]*`+/g, (m) => `\x00${codes.push(m) - 1}\x00`)
      const def = masked.match(DEF_RE)
      let mapped
      if (def) {
        // 定义处看不到使用侧是链接还是图片，交给消费端按 'def' 自行判定
        //（config.ts 按目标扩展名区分 raw 图片地址与 GitHub 页面地址）。
        const r = fn('def', def[2] ?? def[3])
        mapped = r == null ? masked : `${def[1]}${r}${def[4]}`
      } else {
        mapped = mapSeg(masked)
      }
      return mapped.replace(/\x00(\d+)\x00/g, (_, i) => codes[+i])
    })
    .join('\n')
}

/**
 * 全仓库禁止 symlink（构建产物与依赖目录除外）：Vite 会解引用 public/ 下的
 * symlink，Markdown 图片管线会读取链接目标，随后整个 dist 被原样发布——
 * 一条恶意或失误的软链即可把仓库外文件带进公开站点。本仓库没有任何合法
 * symlink，因此一律拒绝，而不是逐目录白名单。
 */
export function findForbiddenSymlinks() {
  const found = new Set()
  // 第一道：git index。被跟踪的 symlink（mode 120000）无论藏在哪个路径——
  // 包括下面工作树扫描豁免的目录（有人 git add -f node_modules/x 也逃不掉）
  // ——都会出现在 CI 的 checkout 里，必须从索引侧兜住。git 不可用时退化为
  // 纯工作树扫描。
  try {
    for (const line of execFileSync('git', ['ls-files', '-s', '-z'], {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      maxBuffer: 32 * 1024 * 1024,
    })
      .split('\0')
      .filter(Boolean)) {
      if (line.startsWith('120000 ')) found.add(line.split('\t')[1])
    }
  } catch {
    /* 非 git 环境：仅工作树扫描 */
  }
  // 第二道：工作树扫描，抓未跟踪的 symlink。豁免只认精确的仓库根路径——
  // 按目录名任意层级豁免会留出 public/node_modules/ 这类被 Vite 原样复制、
  // 却躲过扫描的死角。
  const SKIP_REL = new Set([
    '.git',
    'node_modules',
    '.vitepress/dist',
    '.vitepress/cache',
    '.vitepress/.temp',
  ])
  const walk = (dir) => {
    for (const ent of fs.readdirSync(path.join(ROOT, dir || '.'), { withFileTypes: true })) {
      const rel = dir ? `${dir}/${ent.name}` : ent.name
      if (ent.isSymbolicLink()) {
        found.add(rel)
        continue
      }
      if (ent.isDirectory()) {
        if (SKIP_REL.has(rel)) continue
        walk(rel)
      }
    }
  }
  walk('')
  return [...found].sort()
}

/** SRC_EXCLUDE 的谓词形式：collectPublishedFiles 用它判断一个文件是否被站点排除。 */
function isExcludedFromSite(rel) {
  if (path.basename(rel) === 'AGENTS.md') return true
  if (rel === 'README.md' || rel === 'README.en.md' || rel === 'CLAUDE.md') return true
  return ['translate/', 'private/', 'output/', '.claude/'].some((p) => rel.startsWith(p))
}

/**
 * 站点实际发布的全部 md 源文件（含首页、PROMPT.md、poster/style.md 等不进侧栏的
 * 附属页）。遍历规则与 VitePress 的源扫描一致：跳过点目录与 node_modules，再应用
 * SRC_EXCLUDE。md 副本、llms 输出与产物校验共享这一个模型，杜绝「发布了却没有
 * 机器可读副本」的缝隙。
 */
export function collectPublishedFiles() {
  const out = []
  const walk = (dir) => {
    for (const ent of fs.readdirSync(path.join(ROOT, dir || '.'), { withFileTypes: true })) {
      const rel = dir ? `${dir}/${ent.name}` : ent.name
      if (ent.isDirectory()) {
        // 与 VitePress 源扫描的忽略规则对齐：点目录、node_modules、任意层级的 dist
        if (ent.name.startsWith('.') || ent.name === 'node_modules' || ent.name === 'dist') continue
        walk(rel)
        continue
      }
      if (!ent.isFile() || !ent.name.endsWith('.md')) continue
      if (ent.name.startsWith('.')) continue // glob dot:false，点文件不被 VitePress 构建
      if (/\[\w+?\]/.test(rel)) continue // VitePress 视作动态路由，无 .paths 时不产出 html
      if (isExcludedFromSite(rel)) continue
      out.push(rel)
    }
  }
  walk('')
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
 * works/ 分组规则：按文件名（子目录作品按目录名）前缀归入来源系列（分组式信息
 * 架构吸收自 PR #21，by @Doraemonblogs）。match 按数组顺序生效，最后一组恒真
 * 兜底——未匹配任何前缀的新作品落入「社区博客」，宁可分组不准，不可静默丢失。
 */
const WORKS_GROUPS = [
  {
    text: '原创分析',
    match: (n) =>
      n === 'harness-engineering-chinese-interpretation.md' || n === 'harness-engineering-intro-deck',
  },
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
    groups.find((g) => g.match(path.basename(rel))).items.push(page(rel))
  }
  // 子目录作品与平铺文件走同一套匹配规则（按目录名），同样受兜底组保护。
  for (const rel of subdirReadmes('works')) {
    groups.find((g) => g.match(path.basename(path.dirname(rel)))).items.push(page(rel))
  }
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
    { text: '概念笔记', en: 'CONCEPTS', collapsed: false, items: listMd('concepts').map(page) },
    { text: '独立思考', en: 'THINKING', collapsed: false, items: listMd('thinking').map(page) },
    { text: '动手实践', en: 'PRACTICE', collapsed: false, items: subdirReadmes('practice').map(page) },
    { text: '反馈记录', en: 'FEEDBACK', collapsed: false, items: listMd('feedback').map(page) },
    { en: 'WORKS', ...worksSection() },
    { text: '工具库', en: 'TOOLS', collapsed: false, items: listMd('tools', { recursive: true }).map(page) },
    { text: '提示词', en: 'PROMPTS', collapsed: false, items: listMd('prompts').map(page) },
    {
      text: '资料库',
      en: 'REFERENCES',
      countValue: articlesCount(),
      collapsed: false,
      items: [{ ...page('references/articles.md'), text: '文章深度摘要' }],
    },
  ]
}

function countLinks(nodes) {
  let n = 0
  for (const node of nodes) {
    if (node.link) n += 1
    if (node.items) n += countLinks(node.items)
  }
  return n
}

/** 展示层装饰（仅 buildSidebar 使用，collectPages/llms/RSS 拿到的仍是干净文本）：
 *  顶级分组加英文微标签 + 右对齐计数徽标；带数字前缀的文件名在条目前显示编号。 */
function decorateItem(node) {
  if (node.items) {
    return { text: node.text, collapsed: node.collapsed, items: node.items.map(decorateItem) }
  }
  const m = node.file.match(/(?:^|\/)(\d+)-[^/]*\.md$/)
  const text = m ? `<span class="ha-side-num">${m[1]}</span>${node.text}` : node.text
  return { text, link: node.link }
}

/** VitePress themeConfig.sidebar 直接消费的形态。 */
export function buildSidebar() {
  return buildModel().map((section) => ({
    text: `${section.text}<span class="ha-side-en">${section.en}</span><span class="ha-side-count">${
      section.countValue ?? countLinks(section.items)
    }</span>`,
    collapsed: section.collapsed,
    items: section.items.map(decorateItem),
  }))
}

/** 展平出侧栏全部页面节点（含 file），供 --verify、llms.txt 分组索引与 RSS 使用。 */
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

/**
 * 发布页面全集的页面对象（含首页与附属页），供 buildEnd 生成 .md 副本与
 * llms 全文使用——「每个页面都有同路径 Markdown 版本」这句对外承诺以此为准。
 */
export function collectPublishedPages() {
  return collectPublishedFiles().map((rel) =>
    rel === 'index.md' ? { text: '首页', link: '/', file: rel } : page(rel)
  )
}

/** 首页与 llms.txt 使用的构建时统计 —— 站点里出现的每个数字都来自这里。 */
export function computeStats() {
  return {
    articles: articlesCount(),
    translations: listMd('works').filter((f) => f.endsWith('-translation.md')).length,
    concepts: listMd('concepts').length,
    thinking: listMd('thinking').length,
    feedback: listMd('feedback').length,
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
  // 侧栏页必须是发布全集的子集——srcExclude 误伤侧栏页会在这里现形。
  const published = new Set(collectPublishedFiles())
  const unpublished = files.filter((f) => !published.has(f))
  const symlinks = findForbiddenSymlinks()
  // '#'/'?' 在 URL 中是定界符：VitePress 对这类文件名会静默产出 NotFound 壳页
  //（fail-open），对外出口的 URL 也无法与文件一一对应，机械禁止。
  const badNames = [...published].filter((f) => /[#?]/.test(f))
  const problems = []
  if (badNames.length)
    problems.push(`publishable filenames must not contain '#' or '?': ${badNames.join(', ')}`)
  if (missing.length) problems.push(`missing from generated sidebar: ${missing.join(', ')}`)
  if (dups.length) problems.push(`duplicated in generated sidebar: ${dups.join(', ')}`)
  if (orphans.length) problems.push(`sidebar links to nonexistent files: ${orphans.join(', ')}`)
  if (unpublished.length) problems.push(`sidebar links to files excluded from the site: ${unpublished.join(', ')}`)
  if (symlinks.length)
    problems.push(`symlinks are forbidden in this repo (they can leak external files into the published site): ${symlinks.join(', ')}`)
  return {
    ok: problems.length === 0,
    problems,
    pageCount: files.length,
    requiredCount: req.size,
    publishedCount: published.size,
  }
}

const invokedDirectly =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (invokedDirectly) {
  const mode = process.argv[2]
  if (mode === '--verify') {
    const r = verify()
    if (r.ok) {
      console.log(
        `sidebar derives ${r.pageCount} pages from the filesystem; all ${r.requiredCount} first-class content files present exactly once; site publishes ${r.publishedCount} markdown sources`
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
