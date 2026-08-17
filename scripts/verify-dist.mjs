/**
 * 构建产物契约校验（C14 在产物侧的延伸）—— 对 .vitepress/dist 断言三件事：
 *
 *   1. 页面一一对应：dist 中的 .html 页面集合与发布页面模型
 *      （sidebar.mjs collectPublishedPages）完全一致。多出的页面意味着源目录
 *      泄露（例如某个本地目录忘了进 srcExclude），缺失意味着构建不完整。
 *   2. 机器可读副本：每个页面都有同路径 .md 副本（llms.txt 对外承诺的
 *      「URL + .md」契约，首页对应 /index.md）。
 *   3. 智能体出口存在：llms.txt / llms-full.txt / feed.xml / sitemap.xml。
 *
 * 用法：npm run docs:build && node scripts/verify-dist.mjs
 * CI 在 build 与 upload 之间调用；任何断言失败都以非零码阻断部署。
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const { collectPublishedPages } = await import(
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
const walk = (dir) => {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, ent.name)
    if (ent.isDirectory()) walk(abs)
    else if (ent.name.endsWith('.html')) actual.push(path.relative(DIST, abs))
  }
}
walk(DIST)

const actualSet = new Set(actual)
for (const h of actual) {
  if (!expected.has(h)) problems.push(`unexpected page in dist (source leak?): ${h}`)
}
for (const h of expected) {
  if (h !== '404.html' && !actualSet.has(h)) problems.push(`page missing from dist: ${h}`)
}

for (const p of pages) {
  if (!fs.existsSync(path.join(DIST, mdOf(p)))) {
    problems.push(`page has no same-path markdown copy: ${p.link} (expected /${mdOf(p)})`)
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
  `verify-dist: ${pages.length} published pages ↔ ${actual.length - 1} html pages (+404); every page has a same-path .md copy; llms/feed/sitemap present`
)
