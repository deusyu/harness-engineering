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
const { collectPublishedPages, mapMarkdownLinks, SITE_HOST } = await import(
  new URL('../.vitepress/sidebar.mjs', import.meta.url).href
)

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
// 链接解析与构建期改写共用 sidebar.mjs 的 mapMarkdownLinks——围栏与行内
// 代码里的语法示例天然不进校验，改写器看得见的链接校验器同样看得见。
for (const p of pages) {
  const copyRel = mdOf(p)
  const copyAbs = path.join(DIST, copyRel)
  if (!fs.existsSync(copyAbs)) {
    problems.push(`page has no same-path markdown copy: ${p.link} (expected /${copyRel})`)
    continue
  }
  mapMarkdownLinks(fs.readFileSync(copyAbs, 'utf8'), (kind, href) => {
    let target
    if (href.startsWith(`${SITE_HOST}/`) || href === SITE_HOST) {
      target = href.slice(SITE_HOST.length + 1).split('#')[0]
    } else if (href.startsWith('/')) {
      target = href.slice(1).split('#')[0]
    } else if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(href)) {
      return null // 站外链接/锚点不校验
    } else {
      const t = href.split('#')[0]
      if (!t) return null
      target = path.posix.normalize(path.posix.join(path.posix.dirname(copyRel), t))
    }
    try {
      target = decodeURI(target)
    } catch {
      /* 非法转义：按原文校验 */
    }
    // 页面路由（无扩展名）对应 .html；带扩展名的按文件本体校验；根 → index.html。
    const cand = target === '' ? 'index.html' : /\.[a-z0-9]+$/i.test(target) ? target : `${target}.html`
    let st = null
    try {
      st = fs.statSync(path.join(DIST, cand))
    } catch {
      /* missing */
    }
    if (target.startsWith('..') || !st || !st.isFile()) {
      problems.push(`markdown copy has unreachable ${kind}: /${copyRel} → ${href}`)
    }
    return null // 只校验，不改写
  })
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
