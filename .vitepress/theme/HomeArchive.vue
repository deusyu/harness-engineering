<script setup>
import { data } from './home-stats.data.mjs'

// 结构与叙事吸收自用户以 Claude Design 产出的探索稿（2026-08-14）：
// 语义化缰绳图、§ 卷宗分节、台账式档案总目、暗色自指章节、五阶段路线。
// 与探索稿的关键差异：稿内硬编码的计数（74/34/C1–C13 等）全部改回
// 构建时从文件系统统计（C14 纪律），联系方式等事实以仓库 README 为准。

const ledger = [
  { title: '文章索引', sub: 'references/articles.md · 深度摘要', value: data.articles, unit: '篇', link: '/references/articles' },
  { title: '一手翻译', sub: 'works/*-translation.md', value: data.translations, unit: '篇', link: '/works/harness-engineering-chinese-interpretation' },
  { title: '概念笔记', sub: 'concepts/', value: data.concepts, unit: '篇', link: '/concepts/00-overview' },
  { title: '独立思考', sub: 'thinking/', value: data.thinking, unit: '篇', link: '/thinking/why-this-project-exists' },
  {
    title: '一致性检查',
    sub: `scripts/check-consistency.sh · C1–C${data.checks}`,
    value: data.checks,
    unit: '项',
    accent: true,
    link: 'https://github.com/deusyu/harness-engineering/blob/main/scripts/check-consistency.sh',
  },
]

const concepts = [
  { num: '01', tag: 'REPO = RECORD', title: '仓库即记录系统', desc: '不在仓库里的东西，对智能体不存在。决策、规范、计划一律以版本化工件入库。', path: 'concepts/01', link: '/concepts/01-repo-as-source-of-truth' },
  { num: '02', tag: 'MAP, NOT MANUAL', title: '地图而非手册', desc: 'AGENTS.md 是目录页，不是百科全书。渐进式披露，从小入口点指向更深的文档。', path: 'concepts/00', link: '/concepts/00-overview' },
  { num: '03', tag: 'MECHANICAL', title: '机械化执行', desc: '文档会腐烂，lint 规则不会。自定义 linter 与结构测试，是不变量的守护者。', path: 'concepts/02', link: '/concepts/02-mechanical-enforcement' },
  { num: '04', tag: 'AGENT READABLE', title: '智能体可读性', desc: '优先为智能体的推理优化。选「无聊」的稳定技术，让应用可按 worktree 隔离启动。', path: 'concepts/04', link: '/concepts/04-agent-readability' },
  { num: '05', tag: 'THROUGHPUT', title: '吞吐量改变合并理念', desc: '纠错成本低、等待成本高。PR 生命周期很短，偶发失败靠续跑重跑解决。', path: 'concepts/05', link: '/concepts/05-throughput-changes-merge' },
  { num: '06', tag: 'ENTROPY & GC', title: '熵管理 = 垃圾回收', desc: '技术债是高息贷款。把「黄金规则」编码进仓库，后台任务定期扫描并修复偏差。', path: 'concepts/03', link: '/concepts/03-entropy-and-garbage-collection' },
]

const pillars = [
  { tag: 'HUMAN GATE', title: '人类闸门', desc: '「收不收进来」始终是一道人类闸门。人类掌舵，决定什么值得进入档案。' },
  { tag: 'MECHANICAL RAIL', title: '机械护栏', desc: `C1–C${data.checks} 一致性检查守着计数与保真，不让任何数字悄悄腐烂。` },
  { tag: 'FEEDBACK LOOP', title: '反馈回路', desc: '外部调研的评审，由智能体沿一条固化成 skill 的流水线自动完成。' },
]

const phases = [
  { n: '1', meta: `concepts/ · ${data.concepts} 篇`, title: '理解核心概念', desc: '覆盖 OpenAI 六大概念，加上控制论扩展与「约束即产品」的延伸。', link: '/concepts/00-overview' },
  { n: '2', meta: `thinking/ · ${data.thinking} 篇`, title: '形成自己的观点', desc: '质疑、延伸与跨文章洞察——把别人的范式变成自己能用的判断（持续中）。', link: '/thinking/why-this-project-exists' },
  { n: '3', meta: 'practice/ · Ralph Demo', title: '选一个小项目实践', desc: '跑通一个自主循环：321 秒 · $0.31——用最小成本亲手验证方法论。', link: '/practice/01-ralph-demo/README' },
  { n: '4', meta: `feedback/ · ${data.feedback} 篇`, title: '记录反馈迭代', desc: '把踩坑与修正留成轨迹——「翻译即 harness」是第一篇（持续中）。', link: '/feedback/2026-04-14-translation-as-harness' },
  { n: '5', meta: `works/ · ${data.translations} 篇翻译 + 原创`, title: '输出可展示的作品', desc: '专业一手翻译加原创综合分析——学习闭环在这里交付。', link: '/works/harness-engineering-chinese-interpretation', last: true },
]
</script>

<template>
  <div class="ha" lang="zh">
    <!-- 卷首 -->
    <section class="ha-hero">
      <p class="ha-kicker ha-reveal ha-d0">HARNESS ENGINEERING —— 学习档案 · 中文</p>
      <h1 class="ha-title ha-reveal ha-d1">人类掌舵，<em>智能体执行</em></h1>
      <p class="ha-lede ha-reveal ha-d2">
        一座从概念理解到独立实践的 Harness Engineering 深度学习档案。工程师不再逐行写代码——设计约束、明确意图、构建反馈回路，让智能体可靠地交付。
      </p>
      <div class="ha-actions ha-reveal ha-d3">
        <a class="ha-btn" href="/concepts/00-overview">从概念开始</a>
        <a class="ha-btn ha-btn-ghost" href="/works/harness-engineering-chinese-interpretation">读一手翻译 <sup>{{ data.translations }}</sup></a>
        <a class="ha-btn ha-btn-ghost" href="#ledger">浏览档案总目</a>
      </div>

      <!-- 语义化缰绳图：从人类的约束设计到智能体的如约交付 -->
      <svg class="ha-rein ha-reveal ha-d4" viewBox="0 0 960 250" fill="none" aria-label="从人类设计约束到智能体如约交付的路径">
        <path d="M60 212 C 250 208, 460 180, 620 136 C 720 108, 800 86, 862 68"
          stroke="var(--he-rein)" stroke-width="3" stroke-linecap="round" />
        <path d="M874 64 l-26 -2 M874 64 l-10 22" stroke="var(--he-rein)" stroke-width="3.5" stroke-linecap="round" />

        <circle cx="60" cy="212" r="7" fill="var(--he-ink)" />
        <text x="78" y="218" class="ha-rein-t">人类</text>
        <text x="78" y="236" class="ha-rein-s">设计约束 · 握住缰绳</text>

        <circle cx="330" cy="199" r="4.5" fill="var(--he-rein)" />
        <text x="322" y="182" class="ha-rein-s">AGENTS.md</text>

        <circle cx="540" cy="161" r="4.5" fill="var(--he-rein)" />
        <text x="532" y="144" class="ha-rein-s">自定义 linter</text>

        <circle cx="700" cy="114" r="4.5" fill="var(--he-rein)" />
        <text x="692" y="97" class="ha-rein-s">CI 反馈回路</text>

        <text x="826" y="34" class="ha-rein-t ha-rein-end">智能体</text>
        <text x="826" y="52" class="ha-rein-s">如约交付</text>
      </svg>
    </section>

    <!-- § 01 一句话理解 -->
    <section class="ha-sec">
      <header class="ha-sec-head">
        <h2 class="ha-sec-title"><span class="ha-sec-num">§ 01</span>一句话理解</h2>
        <span class="ha-sec-en">THE PARADIGM SHIFT</span>
      </header>
      <div class="ha-shift">
        <div class="ha-shift-row">
          <span class="ha-shift-label">传统工程</span>
          <span class="ha-chip">人类写代码</span>
          <span class="ha-shift-arrow">→</span>
          <span class="ha-chip">机器执行代码</span>
        </div>
        <div class="ha-shift-row">
          <span class="ha-shift-label ha-shift-label-hot">HARNESS ENG.</span>
          <span class="ha-chip ha-chip-hot">人类设计约束</span>
          <span class="ha-shift-arrow">→</span>
          <span class="ha-chip">智能体写代码</span>
          <span class="ha-shift-arrow">→</span>
          <span class="ha-chip">机器执行代码</span>
        </div>
      </div>
      <p class="ha-shift-note">
        核心转变：工程师的产出，从「代码」变成了<em>「约束系统」</em>——AGENTS.md、架构规则、自定义 linter、反馈回路。
      </p>
    </section>

    <!-- § 02 六大核心概念 -->
    <section class="ha-sec">
      <header class="ha-sec-head">
        <h2 class="ha-sec-title"><span class="ha-sec-num">§ 02</span>六大核心概念</h2>
        <span class="ha-sec-en">SIX CORE CONCEPTS</span>
      </header>
      <p class="ha-sec-intro">像档案卡一样编号归档——每一张都指向仓库里一篇可追溯的概念笔记。</p>
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
        <h2 class="ha-sec-title"><span class="ha-sec-num">§ 03</span>档案总目</h2>
        <span class="ha-sec-en">BUILD-TIME · 自动清点</span>
      </header>
      <p class="ha-sec-intro">
        导航与下面每一个数字，都在构建时由脚本从仓库文件系统清点生成，再由 C1–C{{ data.checks }} 一致性检查守护，不随文档腐烂而漂移。这不是营销数据，是一座档案馆的总目。
      </p>
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
          <h2 class="ha-sec-title ha-sec-title-dark"><span class="ha-sec-num">§ 04</span>仓库即 harness · 自我指涉</h2>
          <span class="ha-sec-en ha-sec-en-dark">THE ARCHIVE RUNS ON WHAT IT RECORDS</span>
        </header>
        <p class="ha-band-title">这个仓库，<em>开始策展自己了</em>。</p>
        <div class="ha-band-grid">
          <div v-for="p in pillars" :key="p.tag" class="ha-band-card">
            <span class="ha-band-tag">{{ p.tag }}</span>
            <span class="ha-band-card-title">{{ p.title }}</span>
            <span class="ha-band-card-desc">{{ p.desc }}</span>
          </div>
        </div>
        <p class="ha-band-note">
          于是约束本身成了产品——正是<a href="/concepts/07-spec-as-product">「约束即产品」</a>讲的东西，只不过这一次，实验的对象是仓库自己。
        </p>
        <span class="ha-seal" aria-hidden="true">驭缰</span>
      </div>
    </section>

    <!-- § 05 从哪里开始 -->
    <section class="ha-sec ha-last">
      <header class="ha-sec-head">
        <h2 class="ha-sec-title"><span class="ha-sec-num">§ 05</span>从哪里开始</h2>
        <span class="ha-sec-en">A READING ROUTE · 5 PHASES</span>
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
