/**
 * 构建产物契约校验（C14 在产物侧的延伸）—— 对 .vitepress/dist 断言五件事：
 *
 *   1. 页面一一对应：dist 中的 .html 页面集合与发布页面模型
 *      （sidebar.mjs collectPublishedPages）完全一致。多出的页面意味着源目录
 *      泄露（例如某个本地目录忘了进 srcExclude），缺失意味着构建不完整。
 *   2. 机器可读副本：每个页面都有同路径 .md 副本（llms.txt 对外承诺的
 *      「URL + .md」契约，首页对应 /index.md）。
 *   3. 副本自足：.md 副本内的相对图片与相对 .md 链接必须在 dist 内可达
 *      ——改写管线漏掉的断链在这里现形。
 *   4. dist 内不得存在任何 symlink（防止上传产物间接携带仓库外文件）。
 *   5. 智能体出口存在：llms.txt / llms-full.txt / feed.xml / sitemap.xml。
 *
 * 用法：npm run docs:build && node scripts/verify-dist.mjs
 * CI 在 build 与 upload 之间调用；任何断言失败都以非零码阻断部署。
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const { collectPublishedPages, SITE_HOST } = await import(
  new URL('../.vitepress/sidebar.mjs', import.meta.url).href
)
// 独立解析路径：校验器用 VitePress 自带的 markdown 渲染器（生产站点同款）提取
// 副本里的链接，与构建期改写器（sidebar.mjs mapMarkdownLinks 的正则）不共享
// 实现——改写器的解析盲区会在这里以断链形式现形，而不是被同一套盲区放行。
const { createMarkdownRenderer } = await import('vitepress')

const DIST = path.resolve(HERE, '../.vitepress/dist')
if (!fs.existsSync(DIST)) {
  console.error('verify-dist: .vitepress/dist not found — run `npm run docs:build` first')
  process.exit(1)
}

const problems = []
const pages = collectPublishedPages()
const htmlOf = (p) => (p.link === '/' ? 'index.html' : `${p.link.slice(1)}.html`)
const mdOf = (p) => (p.link === '/' ? 'index.md' : `${p.link.slice(1)}.md`)

const expected = new Set(pages.map(htmlOf))
expected.add('404.html')

const actual = []
const symlinks = []
const walk = (dir) => {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, ent.name)
    if (ent.isSymbolicLink()) {
      symlinks.push(path.relative(DIST, abs))
      continue
    }
    if (ent.isDirectory()) walk(abs)
    else if (ent.name.endsWith('.html')) actual.push(path.relative(DIST, abs))
  }
}
walk(DIST)

for (const s of symlinks) problems.push(`symlink in dist (would upload external content): ${s}`)

const actualSet = new Set(actual)
for (const h of actual) {
  if (!expected.has(h)) problems.push(`unexpected page in dist (source leak?): ${h}`)
}
for (const h of expected) {
  if (h !== '404.html' && !actualSet.has(h)) problems.push(`page missing from dist: ${h}`)
}

// .md 副本存在性 + 自足性：副本内的相对链接/图片，以及指向本站的绝对链接
// （生成式首页副本与目录改写都输出 host 绝对 URL），都必须在 dist 内可达。
// 围栏与行内代码里的语法示例由 markdown 解析天然排除在校验之外。
const MD = await createMarkdownRenderer(path.resolve(HERE, '..'))
const extractLinks = (raw) => {
  const found = []
  const walk = (tokens) => {
    for (const t of tokens) {
      if (t.type === 'link_open') found.push({ kind: 'link', href: t.attrGet('href') })
      if (t.type === 'image') found.push({ kind: 'image', href: t.attrGet('src') })
      // 裸 HTML 标签里的 src/href/srcset 不产出 link/image token——改写器也
      // 看不见它们，必须在这里补上校验面，否则两侧同盲。属性值带引号或不带
      // 引号都要认；srcset 是逗号分隔的 "URL 描述符" 对，逐项取 URL。
      if ((t.type === 'html_inline' || t.type === 'html_block') && t.content) {
        for (const m of t.content.matchAll(
          /(?:src|href)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/gi
        )) {
          found.push({ kind: 'html', href: m[1] ?? m[2] ?? m[3] })
        }
        for (const m of t.content.matchAll(/srcset\s*=\s*(?:"([^"]*)"|'([^']*)')/gi)) {
          for (const entry of (m[1] ?? m[2]).split(',')) {
            const url = entry.trim().split(/\s+/)[0]
            if (url) found.push({ kind: 'html', href: url })
          }
        }
      }
      if (t.children) walk(t.children)
    }
  }
  walk(MD.parse(raw, {}))
  return found
}

/**
 * href 分类：{ scope: 'external' } 不校验；{ scope: 'site', target } 在 dist 内
 * 校验；{ scope: 'relative', target } 相对链接（target 相对 baseDir 已解析，
 * baseDir 为 null 表示无所在目录的语境——llms-full——此时相对链接本身即违规）。
 * query 与锚点都不是文件路径的一部分，解析前剥离。
 */
const classifyHref = (baseDir, href) => {
  if (!href) return { scope: 'external' }
  const strip = (s) => s.split('#')[0].split('?')[0]
  if (href.startsWith(`${SITE_HOST}/`) || href === SITE_HOST) {
    return { scope: 'site', target: strip(href.slice(SITE_HOST.length + 1)) }
  }
  if (href.startsWith('/') && !href.startsWith('//')) {
    return { scope: 'site', target: strip(href.slice(1)) }
  }
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(href)) return { scope: 'external' }
  const t = strip(href)
  if (!t) return { scope: 'external' }
  return {
    scope: 'relative',
    target: baseDir === null ? null : path.posix.normalize(path.posix.join(baseDir, t)),
  }
}
for (const p of pages) {
  const copyRel = mdOf(p)
  const copyAbs = path.join(DIST, copyRel)
  if (!fs.existsSync(copyAbs)) {
    problems.push(`page has no same-path markdown copy: ${p.link} (expected /${copyRel})`)
    continue
  }
  checkLinks(fs.readFileSync(copyAbs, 'utf8'), path.posix.dirname(copyRel), `/${copyRel}`)
}

// llms-full.txt：合并文档没有所在目录，其中不允许任何相对链接（baseDir=null
// 时 classifyHref 直接判违规）；站内绝对链接照常在 dist 内校验。
const llmsFullPath = path.join(DIST, 'llms-full.txt')
if (fs.existsSync(llmsFullPath)) {
  checkLinks(fs.readFileSync(llmsFullPath, 'utf8'), null, '/llms-full.txt')
}

// 代码完整性：构建期链接改写是逐行正则实现，理论上存在把缩进代码块/复杂
// code span 里的链接语法当真实导航改写的盲区（AST 校验器恰恰会忽略代码，
// 发现不了这种损坏）。这里用生产解析器对比源文件与副本的全部代码 token
// 序列——改写器动了任何代码内容，就在这儿大声失败，静默面清零。
const ROOT = path.resolve(HERE, '..')
const codeTokens = (raw) => {
  const out = []
  const walk = (tokens) => {
    for (const t of tokens) {
      if (t.type === 'fence' || t.type === 'code_block' || t.type === 'code_inline') {
        out.push(t.content)
      }
      if (t.children) walk(t.children)
    }
  }
  walk(MD.parse(raw, {}))
  return out.join('\u0000')
}
for (const p of pages) {
  if (p.file === 'index.md') continue // 首页副本为生成物，无源可比
  const srcAbs = path.join(ROOT, p.file)
  const copyAbs = path.join(DIST, mdOf(p))
  if (!fs.existsSync(srcAbs) || !fs.existsSync(copyAbs)) continue // 存在性已由前面断言
  if (codeTokens(fs.readFileSync(srcAbs, 'utf8')) !== codeTokens(fs.readFileSync(copyAbs, 'utf8'))) {
    problems.push(`copy rewrite corrupted a code region: /${mdOf(p)} (differs from ${p.file})`)
  }
}

function checkLinks(raw, baseDir, label) {
  for (const { kind, href } of extractLinks(raw)) {
    const c = classifyHref(baseDir, href)
    if (c.scope === 'external') continue
    if (c.scope === 'relative' && c.target === null) {
      problems.push(`llms-full.txt must not contain relative links (no base dir): ${href}`)
      continue
    }
    // 按路径段 decodeURIComponent——与编码出口（config.ts encodePath 的
    // encodeURIComponent）互为逆运算；decodeURI 不解码 %26 等保留字符，会把
    // 含 & 等合法文件名误报为 unreachable。
    const target = c.target
      .split('/')
      .map((seg) => {
        try {
          return decodeURIComponent(seg)
        } catch {
          return seg // 非法转义：按原文校验
        }
      })
      .join('/')
    // 页面路由（无扩展名）对应 .html；带扩展名的按文件本体校验；根 → index.html。
    const cand = target === '' ? 'index.html' : /\.[a-z0-9]+$/i.test(target) ? target : `${target}.html`
    // 解码后重新锁定 DIST 边界：编码过的 ../ 在解码后才现形，statSync 在
    // 仓库根找到文件不等于部署后可达——目标必须严格位于 dist 内。
    const abs = path.resolve(DIST, cand)
    const relToDist = path.relative(DIST, abs)
    let st = null
    try {
      st = fs.statSync(abs)
    } catch {
      /* missing */
    }
    if (relToDist.startsWith('..') || path.isAbsolute(relToDist) || !st || !st.isFile()) {
      problems.push(`unreachable ${kind}: ${label} → ${href}`)
    }
  }
}

for (const f of ['llms.txt', 'llms-full.txt', 'feed.xml', 'sitemap.xml']) {
  if (!fs.existsSync(path.join(DIST, f))) problems.push(`missing agent-facing output: /${f}`)
}

if (problems.length) {
  for (const p of problems) console.error(`verify-dist FAIL — ${p}`)
  process.exit(1)
}
console.log(
  `verify-dist: ${pages.length} published pages ↔ ${actual.length - 1} html pages (+404); every page has a self-contained same-path .md copy; no symlinks in dist; llms/feed/sitemap present`
)
