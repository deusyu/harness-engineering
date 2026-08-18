<script setup>
import { data } from './home-stats.data.mjs'
import { homeCopy } from './home-copy.mjs'

// 结构与叙事吸收自用户以 Claude Design 产出的探索稿（2026-08-14）：
// 语义化缰绳图、§ 卷宗分节、台账式档案总目、暗色自指章节、五阶段路线。
// 与探索稿的关键差异：稿内硬编码的计数全部改回构建时从文件系统统计
// （C14 纪律），联系方式等事实以仓库 README 为准。
//
// 文案唯一事实源在 home-copy.mjs——config.ts buildEnd 用同一份文案生成
// /index.md 机器可读副本与 llms-full.txt 首页条目，人读与机读永不漂移。

const c = homeCopy(data)
const ledger = c.ledgerSection.rows
const concepts = c.conceptsSection.cards
const pillars = c.band.pillars
const phases = c.routeSection.phases
</script>

<template>
  <div class="ha" lang="zh">
    <!-- 卷首 -->
    <section class="ha-hero">
      <p class="ha-kicker ha-reveal ha-d0">{{ c.hero.kicker }}</p>
      <h1 class="ha-title ha-reveal ha-d1">{{ c.hero.titleLead }}<em>{{ c.hero.titleEm }}</em></h1>
      <p class="ha-lede ha-reveal ha-d2">{{ c.hero.lede }}</p>
      <div class="ha-actions ha-reveal ha-d3">
        <a v-for="(a, i) in c.hero.actions" :key="a.text" class="ha-btn" :class="{ 'ha-btn-ghost': i > 0 }" :href="a.link">{{ a.text }}<sup v-if="a.sup != null"> {{ a.sup }}</sup></a>
      </div>

      <!-- 语义化缰绳图（文案同源 home-copy.mjs）：从人类的约束设计到智能体的如约交付 -->
      <svg class="ha-rein ha-reveal ha-d4" viewBox="0 0 960 250" fill="none" :aria-label="c.hero.rein.aria">
        <path d="M60 212 C 250 208, 460 180, 620 136 C 720 108, 800 86, 862 68"
          stroke="var(--he-rein)" stroke-width="3" stroke-linecap="round" />
        <path d="M874 64 l-26 -2 M874 64 l-10 22" stroke="var(--he-rein)" stroke-width="3.5" stroke-linecap="round" />

        <circle cx="60" cy="212" r="7" fill="var(--he-ink)" />
        <text x="78" y="218" class="ha-rein-t">{{ c.hero.rein.start.title }}</text>
        <text x="78" y="236" class="ha-rein-s">{{ c.hero.rein.start.sub }}</text>

        <circle cx="330" cy="199" r="4.5" fill="var(--he-rein)" />
        <text x="322" y="182" class="ha-rein-s">{{ c.hero.rein.milestones[0] }}</text>

        <circle cx="540" cy="161" r="4.5" fill="var(--he-rein)" />
        <text x="532" y="144" class="ha-rein-s">{{ c.hero.rein.milestones[1] }}</text>

        <circle cx="700" cy="114" r="4.5" fill="var(--he-rein)" />
        <text x="692" y="97" class="ha-rein-s">{{ c.hero.rein.milestones[2] }}</text>

        <text x="826" y="34" class="ha-rein-t ha-rein-end">{{ c.hero.rein.end.title }}</text>
        <text x="826" y="52" class="ha-rein-s">{{ c.hero.rein.end.sub }}</text>
      </svg>
    </section>

    <!-- § 01 一句话理解 -->
    <section class="ha-sec">
      <header class="ha-sec-head">
        <h2 class="ha-sec-title"><span class="ha-sec-num">§ 01</span>{{ c.shift.title }}</h2>
        <span class="ha-sec-en">{{ c.shift.en }}</span>
      </header>
      <div class="ha-shift">
        <div v-for="row in c.shift.rows" :key="row.label" class="ha-shift-row">
          <span class="ha-shift-label" :class="{ 'ha-shift-label-hot': row.hot }">{{ row.label }}</span>
          <template v-for="(chip, i) in row.chips" :key="chip">
            <span v-if="i > 0" class="ha-shift-arrow">→</span>
            <span class="ha-chip" :class="{ 'ha-chip-hot': row.hot && i === 0 }">{{ chip }}</span>
          </template>
        </div>
      </div>
      <p class="ha-shift-note">
        {{ c.shift.noteLead }}<em>{{ c.shift.noteEm }}</em>{{ c.shift.noteTail }}
      </p>
    </section>

    <!-- § 02 六大核心概念 -->
    <section class="ha-sec">
      <header class="ha-sec-head">
        <h2 class="ha-sec-title"><span class="ha-sec-num">§ 02</span>{{ c.conceptsSection.title }}</h2>
        <span class="ha-sec-en">{{ c.conceptsSection.en }}</span>
      </header>
      <p class="ha-sec-intro">{{ c.conceptsSection.intro }}</p>
      <div class="ha-grid">
        <a v-for="c in concepts" :key="c.num" class="ha-card" :href="c.link">
          <span class="ha-card-top"><span class="ha-card-num">{{ c.num }}</span><span class="ha-card-tag">{{ c.tag }}</span></span>
          <span class="ha-card-title">{{ c.title }}</span>
          <span class="ha-card-desc">{{ c.desc }}</span>
          <span class="ha-card-foot"><span>{{ c.path }}</span><span class="ha-card-arrow">→</span></span>
        </a>
      </div>
    </section>

    <!-- § 03 档案总目 -->
    <section class="ha-sec" id="ledger">
      <header class="ha-sec-head">
        <h2 class="ha-sec-title"><span class="ha-sec-num">§ 03</span>{{ c.ledgerSection.title }}</h2>
        <span class="ha-sec-en">{{ c.ledgerSection.en }}</span>
      </header>
      <p class="ha-sec-intro">{{ c.ledgerSection.intro }}</p>
      <div class="ha-ledger">
        <a v-for="row in ledger" :key="row.title" class="ha-ledger-row" :href="row.link">
          <span class="ha-ledger-main">
            <span class="ha-ledger-title">{{ row.title }}</span>
            <span class="ha-ledger-sub">{{ row.sub }}</span>
          </span>
          <span class="ha-ledger-value" :class="{ 'ha-ledger-hot': row.accent }">{{ row.value }}</span>
          <span class="ha-ledger-unit">{{ row.unit }}</span>
        </a>
      </div>
    </section>

    <!-- § 04 仓库即 harness · 自我指涉（通栏暗色） -->
    <section class="ha-band">
      <div class="ha-band-in">
        <header class="ha-sec-head">
          <h2 class="ha-sec-title ha-sec-title-dark"><span class="ha-sec-num">§ 04</span>{{ c.band.title }}</h2>
          <span class="ha-sec-en ha-sec-en-dark">{{ c.band.en }}</span>
        </header>
        <p class="ha-band-title">{{ c.band.leadLead }}<em>{{ c.band.leadEm }}</em>{{ c.band.leadTail }}</p>
        <div class="ha-band-grid">
          <div v-for="p in pillars" :key="p.tag" class="ha-band-card">
            <span class="ha-band-tag">{{ p.tag }}</span>
            <span class="ha-band-card-title">{{ p.title }}</span>
            <span class="ha-band-card-desc">{{ p.desc }}</span>
          </div>
        </div>
        <p class="ha-band-note">
          {{ c.band.noteLead }}<a :href="c.band.noteLink">{{ c.band.noteLinkText }}</a>{{ c.band.noteTail }}
        </p>
        <span class="ha-seal" aria-hidden="true">驭缰</span>
      </div>
    </section>

    <!-- § 05 从哪里开始 -->
    <section class="ha-sec ha-last">
      <header class="ha-sec-head">
        <h2 class="ha-sec-title"><span class="ha-sec-num">§ 05</span>{{ c.routeSection.title }}</h2>
        <span class="ha-sec-en">{{ c.routeSection.en }}</span>
      </header>
      <div class="ha-route">
        <a v-for="p in phases" :key="p.n" class="ha-phase" :href="p.link">
          <span class="ha-phase-n" :class="{ 'ha-phase-n-filled': p.last }">{{ p.n }}</span>
          <span class="ha-phase-body">
            <span class="ha-phase-meta">PHASE {{ p.n }} · {{ p.meta }}</span>
            <span class="ha-phase-title">{{ p.title }}</span>
            <span class="ha-phase-desc">{{ p.desc }}</span>
          </span>
        </a>
      </div>
    </section>
  </div>
</template>

<style>
.ha {
  max-width: 1104px;
  margin: 0 auto;
  padding: 0 32px;
}

.ha a {
  text-decoration: none;
  color: inherit;
}

/* ── 卷首 ─────────────────────────────────────────────────── */

.ha-hero {
  padding: 80px 0 8px;
}

.ha-kicker {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.24em;
  color: var(--he-rein);
  margin: 0 0 22px;
}

.ha-title {
  font-family: var(--he-serif);
  font-weight: 900;
  font-size: clamp(42px, 6.4vw, 78px);
  line-height: 1.16;
  letter-spacing: 0.01em;
  color: var(--he-ink);
  margin: 0 0 24px;
}

.ha-title em {
  font-style: normal;
  color: var(--he-rein);
}

.ha-lede {
  font-size: 16.5px;
  line-height: 1.95;
  color: var(--he-ink-2);
  max-width: 36em;
  margin: 0 0 34px;
}

.ha-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 14px;
}

.ha-btn {
  display: inline-block;
  background: var(--he-ink);
  border: 1px solid var(--he-ink);
  color: var(--he-paper) !important;
  font-size: 14.5px;
  font-weight: 600;
  letter-spacing: 0.06em;
  padding: 12px 26px;
  transition: background 0.25s ease, color 0.25s ease, border-color 0.25s ease;
}

.ha-btn:hover {
  background: var(--he-rein);
  border-color: var(--he-rein);
  color: #fff !important;
}

.ha-btn-ghost {
  background: transparent;
  border-color: var(--he-hairline);
  color: var(--he-ink) !important;
}

.ha-btn-ghost:hover {
  background: transparent;
  border-color: var(--he-rein);
  color: var(--he-rein) !important;
}

.ha-btn sup {
  font-size: 10px;
  color: var(--he-rein);
  margin-left: 2px;
}

.ha-btn:hover sup {
  color: inherit;
}

/* 语义化缰绳图 */

.ha-rein {
  display: block;
  width: 100%;
  height: auto;
  margin: 30px 0 0;
}

.ha-rein-t {
  font-family: var(--vp-font-family-base);
  font-size: 15px;
  font-weight: 700;
  fill: var(--he-ink);
}

.ha-rein-end {
  fill: var(--he-rein);
}

.ha-rein-s {
  font-family: var(--vp-font-family-base);
  font-size: 11.5px;
  letter-spacing: 0.06em;
  fill: var(--he-ink-3);
}

@media (max-width: 640px) {
  .ha-rein {
    display: none;
  }
}

/* ── 分节标头 ─────────────────────────────────────────────── */

.ha-sec {
  padding: 84px 0 0;
}

.ha-last {
  padding-bottom: 112px;
}

.ha-sec-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.ha-sec-title {
  font-family: var(--he-serif);
  font-weight: 900;
  font-size: clamp(24px, 3vw, 32px);
  color: var(--he-ink);
  margin: 0;
  border: none;
  padding: 0;
}

.ha-sec-num {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--he-rein);
  margin-right: 14px;
  vertical-align: 3px;
}

.ha-sec-en {
  font-size: 10.5px;
  letter-spacing: 0.28em;
  color: var(--he-ink-3);
  white-space: nowrap;
}

.ha-sec-intro {
  font-size: 14px;
  line-height: 1.9;
  color: var(--he-ink-2);
  max-width: 44em;
  margin: 0 0 30px;
}

/* ── § 01 范式转变 ───────────────────────────────────────── */

.ha-shift {
  display: grid;
  gap: 14px;
  border-top: 2px solid var(--he-ink);
  padding-top: 26px;
  margin-top: 26px;
}

.ha-shift-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.ha-shift-label {
  width: 118px;
  font-size: 11px;
  letter-spacing: 0.18em;
  color: var(--he-ink-3);
  white-space: nowrap;
}

.ha-shift-label-hot {
  color: var(--he-rein);
  font-weight: 700;
}

.ha-chip {
  border: 1px solid var(--he-hairline);
  padding: 9px 16px;
  font-size: 13.5px;
  color: var(--he-ink);
  background: var(--he-paper);
}

.ha-chip-hot {
  border-color: var(--he-rein);
  color: var(--he-rein);
  font-weight: 600;
}

.ha-shift-arrow {
  color: var(--he-ink-3);
  font-size: 14px;
}

.ha-shift-note {
  margin: 26px 0 0;
  font-size: 14.5px;
  line-height: 1.9;
  color: var(--he-ink-2);
  max-width: 44em;
}

.ha-shift-note em {
  font-style: normal;
  color: var(--he-rein);
  font-weight: 600;
}

/* ── § 02 概念档案卡 ─────────────────────────────────────── */

.ha-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1px;
  background: var(--he-hairline);
  border: 1px solid var(--he-hairline);
}

.ha-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: var(--he-paper);
  padding: 24px 24px 20px;
  transition: background 0.25s ease;
}

.ha-card:hover {
  background: var(--he-paper-2);
}

.ha-card-top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}

.ha-card-num {
  font-family: var(--he-serif);
  font-weight: 900;
  font-size: 30px;
  color: var(--he-rein);
  line-height: 1;
}

.ha-card-tag {
  font-size: 9.5px;
  letter-spacing: 0.22em;
  color: var(--he-ink-3);
  white-space: nowrap;
}

.ha-card-title {
  font-family: var(--he-serif);
  font-weight: 700;
  font-size: 19px;
  color: var(--he-ink);
  transition: color 0.2s ease;
}

.ha-card:hover .ha-card-title {
  color: var(--he-rein);
}

.ha-card-desc {
  font-size: 13px;
  line-height: 1.85;
  color: var(--he-ink-2);
  flex: 1;
}

.ha-card-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--he-hairline-soft);
  padding-top: 12px;
  font-size: 11px;
  letter-spacing: 0.1em;
  color: var(--he-ink-3);
}

.ha-card-arrow {
  color: var(--he-rein);
  transform: translateX(-4px);
  opacity: 0.4;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.ha-card:hover .ha-card-arrow {
  transform: none;
  opacity: 1;
}

/* ── § 03 台账 ───────────────────────────────────────────── */

.ha-ledger {
  border-top: 2px solid var(--he-ink);
}

.ha-ledger-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  align-items: baseline;
  column-gap: 10px;
  padding: 22px 4px;
  border-bottom: 1px solid var(--he-hairline);
  transition: background 0.2s ease, padding 0.2s ease;
}

.ha-ledger-row:hover {
  background: var(--he-paper-2);
  padding-left: 14px;
  padding-right: 14px;
}

.ha-ledger-main {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ha-ledger-title {
  font-family: var(--he-serif);
  font-weight: 700;
  font-size: 19px;
  color: var(--he-ink);
}

.ha-ledger-sub {
  font-size: 11px;
  letter-spacing: 0.08em;
  color: var(--he-ink-3);
}

.ha-ledger-value {
  font-family: var(--he-serif);
  font-weight: 900;
  font-size: clamp(36px, 4.6vw, 52px);
  line-height: 1;
  color: var(--he-ink);
  font-variant-numeric: tabular-nums;
  transition: color 0.2s ease;
}

.ha-ledger-row:hover .ha-ledger-value {
  color: var(--he-rein);
}

.ha-ledger-hot {
  color: var(--he-rein);
}

.ha-ledger-unit {
  font-size: 12px;
  color: var(--he-ink-3);
}

/* ── § 04 通栏暗色自指 ───────────────────────────────────── */

.ha-band {
  width: 100vw;
  margin: 92px 0 0 calc(50% - 50vw);
  background: #17130e;
  color: #f0eadf;
}

.dark .ha-band {
  background: #100d09;
}

.ha-band-in {
  position: relative;
  max-width: 1104px;
  margin: 0 auto;
  padding: 72px 32px 76px;
}

.ha-sec-title-dark {
  color: #f0eadf;
}

.ha-sec-en-dark {
  color: rgba(240, 234, 223, 0.5);
}

.ha-band-title {
  font-family: var(--he-serif);
  font-weight: 900;
  font-size: clamp(32px, 4.6vw, 52px);
  line-height: 1.3;
  color: #f0eadf;
  margin: 26px 0 40px;
  max-width: 15em;
}

.ha-band-title em {
  font-style: normal;
  color: #e0602f;
}

.ha-band-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1px;
  background: rgba(240, 234, 223, 0.18);
  border: 1px solid rgba(240, 234, 223, 0.18);
}

.ha-band-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #17130e;
  padding: 24px;
}

.dark .ha-band-card {
  background: #100d09;
}

.ha-band-tag {
  font-size: 9.5px;
  letter-spacing: 0.24em;
  color: #e0602f;
}

.ha-band-card-title {
  font-family: var(--he-serif);
  font-weight: 700;
  font-size: 18px;
  color: #f0eadf;
}

.ha-band-card-desc {
  font-size: 13px;
  line-height: 1.85;
  color: rgba(240, 234, 223, 0.72);
}

.ha-band-note {
  margin: 34px 0 0;
  font-size: 14px;
  line-height: 1.9;
  color: rgba(240, 234, 223, 0.72);
  max-width: 44em;
}

.ha-band-note a {
  color: #e0602f !important;
  border-bottom: 1px solid rgba(224, 96, 47, 0.4);
}

.ha-seal {
  position: absolute;
  top: 68px;
  right: 40px;
  width: 72px;
  height: 72px;
  display: grid;
  place-items: center;
  background: #c2481d;
  color: #f5f1e8;
  font-family: var(--he-serif);
  font-weight: 900;
  font-size: 24px;
  letter-spacing: 0.14em;
  writing-mode: vertical-rl;
  transform: rotate(3deg);
}

/* ── § 05 阅读路线 ───────────────────────────────────────── */

.ha-route {
  border-top: 2px solid var(--he-ink);
  display: grid;
}

.ha-phase {
  display: grid;
  grid-template-columns: 46px minmax(0, 1fr);
  gap: 18px;
  padding: 24px 4px;
  border-bottom: 1px solid var(--he-hairline);
  transition: background 0.2s ease, padding 0.2s ease;
}

.ha-phase:hover {
  background: var(--he-paper-2);
  padding-left: 14px;
  padding-right: 14px;
}

.ha-phase-n {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border: 1.5px solid var(--he-rein);
  border-radius: 50%;
  font-family: var(--he-serif);
  font-weight: 700;
  font-size: 14px;
  color: var(--he-rein);
  margin-top: 4px;
}

.ha-phase-n-filled {
  background: var(--he-rein);
  color: #f5f1e8;
}

.ha-phase-body {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.ha-phase-meta {
  font-size: 10.5px;
  letter-spacing: 0.18em;
  color: var(--he-rein);
}

.ha-phase-title {
  font-family: var(--he-serif);
  font-weight: 700;
  font-size: 19px;
  color: var(--he-ink);
  transition: color 0.2s ease;
}

.ha-phase:hover .ha-phase-title {
  color: var(--he-rein);
}

.ha-phase-desc {
  font-size: 13.5px;
  line-height: 1.85;
  color: var(--he-ink-2);
}

/* ── 入场动效（尊重减少动态偏好） ────────────────────────── */

@media (prefers-reduced-motion: no-preference) {
  .ha-reveal {
    opacity: 0;
    transform: translateY(14px);
    animation: ha-up 0.7s cubic-bezier(0.2, 0.7, 0.3, 1) forwards;
  }
  .ha-d0 { animation-delay: 0.04s; }
  .ha-d1 { animation-delay: 0.1s; }
  .ha-d2 { animation-delay: 0.18s; }
  .ha-d3 { animation-delay: 0.26s; }
  .ha-d4 { animation-delay: 0.38s; }
}

@keyframes ha-up {
  to {
    opacity: 1;
    transform: none;
  }
}

/* ── 响应式 ───────────────────────────────────────────────── */

@media (max-width: 860px) {
  .ha {
    padding: 0 24px;
  }
  .ha-hero {
    padding: 52px 0 0;
  }
  .ha-sec {
    padding-top: 64px;
  }
  .ha-grid {
    grid-template-columns: 1fr;
  }
  .ha-band-grid {
    grid-template-columns: 1fr;
  }
  .ha-band-in {
    padding: 56px 24px 60px;
  }
  .ha-seal {
    top: 52px;
    right: 24px;
    width: 58px;
    height: 58px;
    font-size: 19px;
  }
  .ha-shift-label {
    width: 100%;
  }
  .ha-ledger-value {
    font-size: 34px;
  }
  .ha-sec-en {
    display: none;
  }
}
</style>
