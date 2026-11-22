#!/usr/bin/env node
// 首页缰绳插图的版式守卫（Node 标准库，零依赖）：
//   1. 每个文字标签的保守外框与曲线/箭头描边之间至少留 MIN_GAP 个 viewBox 单位；
//   2. 曲线上的节点圆心必须落在曲线上（偏差 ≤ MAX_DOT_OFFSET）；
//   3. 标签互不重叠，且不越出 viewBox。
// 字宽按保守上限估算（CJK 1em、ASCII 0.66em，另加 letter-spacing），浏览器实测
// 字宽都小于估算值，所以这里通过 ⇒ 真实渲染只会离曲线更远。
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const VUE = path.join(ROOT, '.vitepress/theme/HomeArchive.vue')
const MIN_GAP = 6
const MAX_DOT_OFFSET = 1.5

const { homeCopy } = await import(path.join(ROOT, '.vitepress/theme/home-copy.mjs'))
const stats = new Proxy({}, { get: () => 0 })
const c = homeCopy(stats)

const src = fs.readFileSync(VUE, 'utf8')
const svg = src.match(/<svg class="ha-rein[\s\S]*?<\/svg>/)?.[0]
if (!svg) fail('ha-rein <svg> not found in HomeArchive.vue')
const [, , vbW, vbH] = svg.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number)

const style = (cls, prop) => {
  const m = src.match(new RegExp(`\\.${cls}\\s*\\{([^}]*)\\}`))
  const v = m?.[1].match(new RegExp(`${prop}:\\s*([\\d.]+)(px|em)`))
  return v ? Number(v[1]) : 0
}

// 曲线与箭头：支持 M / L / l / C（绝对），按描边半宽扩张。
const strokes = []
for (const m of svg.matchAll(/<path d="([^"]+)"[^>]*stroke-width="([\d.]+)"/g)) {
  const half = Number(m[2]) / 2
  const tok = m[1].match(/[MLlC]|-?[\d.]+/g)
  let cur = [0, 0]
  let cmd = ''
  const num = () => Number(tok.shift())
  while (tok.length) {
    if (/[MLlC]/.test(tok[0])) cmd = tok.shift()
    if (cmd === 'M') cur = [num(), num()]
    else if (cmd === 'L' || cmd === 'l') {
      const p = cmd === 'L' ? [num(), num()] : [cur[0] + num(), cur[1] + num()]
      for (let i = 0; i <= 50; i++) strokes.push({ x: cur[0] + ((p[0] - cur[0]) * i) / 50, y: cur[1] + ((p[1] - cur[1]) * i) / 50, half })
      cur = p
    } else if (cmd === 'C') {
      const [p1, p2, p3] = [[num(), num()], [num(), num()], [num(), num()]]
      for (let i = 0; i <= 400; i++) {
        const t = i / 400
        const k = [(1 - t) ** 3, 3 * (1 - t) ** 2 * t, 3 * (1 - t) * t ** 2, t ** 3]
        strokes.push({ x: k[0] * cur[0] + k[1] * p1[0] + k[2] * p2[0] + k[3] * p3[0], y: k[0] * cur[1] + k[1] * p1[1] + k[2] * p2[1] + k[3] * p3[1], half, curve: true })
      }
      cur = p3
    } else fail(`unsupported path command near "${tok.slice(0, 3).join(' ')}"`)
  }
}
const curve = strokes.filter((p) => p.curve)

const resolve = (expr) =>
  expr.replace(/^c\./, '').split(/\.|\[(\d+)\]/).filter(Boolean).reduce((o, k) => o?.[k], c)

const textWidth = (s, fs, ls) =>
  [...s].reduce((w, ch) => w + (ch.charCodeAt(0) > 0x2e7f ? 1 : 0.66) * fs + ls * fs, 0)

const labels = []
for (const m of svg.matchAll(/<text x="([\d.]+)" y="([\d.]+)" class="([^"]+)">\{\{\s*([^}]+?)\s*\}\}<\/text>/g)) {
  const text = resolve(m[4])
  if (typeof text !== 'string') fail(`cannot resolve label expression ${m[4]}`)
  const cls = m[3].split(/\s+/).find((k) => style(k, 'font-size'))
  const fs = style(cls, 'font-size')
  const x = Number(m[1])
  const y = Number(m[2])
  labels.push({ text, x0: x, y0: y - fs, x1: x + textWidth(text, fs, style(cls, 'letter-spacing')), y1: y + 0.35 * fs })
}
if (!labels.length) fail('no labels parsed from ha-rein <svg>')

const errors = []
const report = []
for (const l of labels) {
  let gap = Infinity
  for (const p of strokes) {
    const dx = Math.max(l.x0 - p.x, 0, p.x - l.x1)
    const dy = Math.max(l.y0 - p.y, 0, p.y - l.y1)
    gap = Math.min(gap, Math.hypot(dx, dy) - p.half)
  }
  report.push(`${l.text}: ${gap.toFixed(1)}`)
  if (gap < MIN_GAP) errors.push(`label "${l.text}" is ${gap.toFixed(1)} units from the curve (min ${MIN_GAP})`)
  if (l.x0 < 0 || l.y0 < 0 || l.x1 > vbW || l.y1 > vbH) errors.push(`label "${l.text}" overflows the viewBox`)
}
for (let i = 0; i < labels.length; i++)
  for (let j = i + 1; j < labels.length; j++) {
    const [a, b] = [labels[i], labels[j]]
    if (a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1) errors.push(`labels "${a.text}" and "${b.text}" overlap`)
  }
for (const m of svg.matchAll(/<circle cx="([\d.]+)" cy="([\d.]+)"/g)) {
  const [cx, cy] = [Number(m[1]), Number(m[2])]
  const off = Math.min(...curve.map((p) => Math.hypot(p.x - cx, p.y - cy)))
  if (off > MAX_DOT_OFFSET) errors.push(`node (${cx}, ${cy}) is ${off.toFixed(1)} units off the curve`)
}

if (errors.length) fail(errors.join('\n'))
console.log(`verify-rein-labels: ${labels.length} labels clear the curve by ≥ ${MIN_GAP} (${report.join('; ')}); all nodes on the curve`)

function fail(msg) {
  console.error(`verify-rein-labels: FAIL\n${msg}`)
  process.exit(1)
}
