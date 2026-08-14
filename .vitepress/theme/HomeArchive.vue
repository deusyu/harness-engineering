<script setup>
import { data } from './home-stats.data.mjs'

const stats = [
  { value: data.articles, label: '编目文章', link: '/references/articles' },
  { value: data.translations, label: '一手翻译', link: '/works/harness-engineering-chinese-interpretation' },
  { value: data.concepts, label: '概念笔记', link: '/concepts/00-overview' },
  { value: data.thinking, label: '独立思考', link: '/thinking/why-this-project-exists' },
  {
    value: data.checks,
    label: '一致性检查',
    link: 'https://github.com/deusyu/harness-engineering/blob/main/scripts/check-consistency.sh',
  },
]

const concepts = [
  { num: '01', title: '仓库即记录系统', desc: '不在仓库里的东西，对智能体不存在。决策、规范、计划一律以版本化工件入库。', link: '/concepts/01-repo-as-source-of-truth' },
  { num: '02', title: '地图而非手册', desc: 'AGENTS.md 是目录页，不是百科全书。小入口点加渐进式披露，指向更深层文档。', link: '/concepts/00-overview' },
  { num: '03', title: '机械化执行', desc: '文档会腐烂，检查不会。自定义 linter 与结构测试是不变量的守护者。', link: '/concepts/02-mechanical-enforcement' },
  { num: '04', title: '智能体可读性', desc: '为智能体的推理能力优化技术选型——偏爱 API 稳定、训练集覆盖好的「无聊」技术。', link: '/concepts/04-agent-readability' },
  { num: '05', title: '吞吐量改变合并理念', desc: '纠错成本低、等待成本高时，短 PR 生命周期是理性选择，偶发失败靠重跑解决。', link: '/concepts/05-throughput-changes-merge' },
  { num: '06', title: '熵管理即垃圾回收', desc: '智能体会复现仓库中已有的一切模式——包括坏模式。技术债是高息贷款。', link: '/concepts/03-entropy-and-garbage-collection' },
]

const harness = [
  { num: '一', title: '内容即仓库', desc: '每个页面就是 GitHub 仓库里的一个 Markdown 文件，站点只是它的一种渲染。' },
  { num: '二', title: '导航与计数不手写', desc: '侧边栏和本页数字在构建时从文件系统生成，由一致性检查（C14）机械化守护——新内容合入即出现。' },
  { num: '三', title: '对智能体可读', desc: '任意页面 URL 追加 .md 即得纯文本版；/llms.txt 提供站点索引，/feed.xml 提供订阅。' },
]

const starts = [
  { title: '概念总览', desc: '六大核心概念，一页建立框架', link: '/concepts/00-overview' },
  { title: '为什么有这个项目', desc: '从复杂度评估到产品级复刻的动机', link: '/thinking/why-this-project-exists' },
  { title: '翻译与作品', desc: '按来源系列分组的社区关键文章中译', link: '/works/harness-engineering-chinese-interpretation' },
  { title: '文章索引', desc: '每篇附深度摘要与来源信息', link: '/references/articles' },
]
</script>

<template>
  <div class="ha" lang="zh">
    <!-- 卷首 -->
    <section class="ha-hero">
      <div class="ha-hero-text">
        <p class="ha-kicker ha-reveal ha-d0">HARNESS ENGINEERING · 驭缰工程中文学习档案</p>
        <h1 class="ha-title ha-reveal ha-d1">
          人类掌舵，<br /><em>智能体执行</em>。
        </h1>
        <p class="ha-lede ha-reveal ha-d2">
          从概念拆解、独立思考到系统性翻译与动手实践——把「驭缰工程」学透的完整过程，全程以仓库为记录系统。
        </p>
        <div class="ha-actions ha-reveal ha-d3">
          <a class="ha-btn" href="/concepts/00-overview">开始阅读</a>
          <a class="ha-link" href="/thinking/why-this-project-exists">为什么有这个项目</a>
          <a class="ha-link" href="/references/articles">文章索引</a>
        </div>
      </div>
      <div class="ha-hero-art ha-reveal ha-d2" aria-hidden="true">
        <!-- 缰绳曲线：墨色锚点是人类，箭头指向智能体（与仓库海报同一视觉 DNA） -->
        <svg class="ha-rein" viewBox="0 0 420 320" fill="none">
          <circle cx="46" cy="252" r="9" fill="var(--he-ink)" />
          <path d="M46 252 C 120 120, 250 96, 352 128" stroke="var(--he-ink)" stroke-width="5" stroke-linecap="round" />
          <path d="M352 128 l-30 -6 M352 128 l-11 26" stroke="var(--he-rein)" stroke-width="5" stroke-linecap="round" />
          <path d="M46 252 C 130 160, 240 150, 330 176" stroke="var(--he-hairline)" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="1 7" />
        </svg>
        <span class="ha-seal">驭缰</span>
      </div>
    </section>

    <!-- 档案总目 -->
    <section class="ha-stats ha-reveal ha-d4" aria-label="档案总目">
      <a v-for="s in stats" :key="s.label" class="ha-stat" :href="s.link">
        <span class="ha-stat-value">{{ s.value }}</span>
        <span class="ha-stat-label">{{ s.label }}</span>
      </a>
      <p class="ha-stats-note">总目数字在每次构建时从仓库文件系统统计——没有手写计数，也就没有漂移。</p>
    </section>

    <!-- 六大核心概念 -->
    <section class="ha-section">
      <p class="ha-kicker">六大核心概念</p>
      <div class="ha-grid">
        <a v-for="c in concepts" :key="c.num" class="ha-card" :href="c.link">
          <span class="ha-card-num">{{ c.num }}</span>
          <span class="ha-card-title">{{ c.title }}<span class="ha-card-arrow">↗</span></span>
          <span class="ha-card-desc">{{ c.desc }}</span>
        </a>
      </div>
    </section>

    <!-- 自指 -->
    <section class="ha-section">
      <p class="ha-kicker">这个站本身也是一个 harness</p>
      <div class="ha-rows">
        <div v-for="h in harness" :key="h.num" class="ha-row">
          <span class="ha-row-num">{{ h.num }}</span>
          <div>
            <p class="ha-row-title">{{ h.title }}</p>
            <p class="ha-row-desc">{{ h.desc }}</p>
          </div>
        </div>
      </div>
      <p class="ha-fineprint">
        源码与全部内容在
        <a href="https://github.com/deusyu/harness-engineering">GitHub 仓库</a>；智能体入口见
        <a href="/llms.txt">/llms.txt</a>，订阅见 <a href="/feed.xml">/feed.xml</a>。
      </p>
    </section>

    <!-- 导览 -->
    <section class="ha-section ha-last">
      <p class="ha-kicker">从哪里开始</p>
      <div class="ha-starts">
        <a v-for="s in starts" :key="s.title" class="ha-start" :href="s.link">
          <span class="ha-start-title">{{ s.title }}</span>
          <span class="ha-start-desc">{{ s.desc }}</span>
          <span class="ha-start-arrow">→</span>
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
  display: grid;
  grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
  align-items: center;
  gap: 24px;
  padding: 88px 0 72px;
}

.ha-kicker {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.22em;
  color: var(--he-rein);
  margin: 0 0 20px;
}

.ha-title {
  font-family: var(--he-serif);
  font-weight: 900;
  font-size: clamp(44px, 6.2vw, 74px);
  line-height: 1.18;
  letter-spacing: 0.01em;
  color: var(--he-ink);
  margin: 0 0 26px;
}

.ha-title em {
  font-style: normal;
  color: var(--he-rein);
}

.ha-lede {
  font-size: 17px;
  line-height: 1.9;
  color: var(--he-ink-2);
  max-width: 34em;
  margin: 0 0 36px;
}

.ha-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 28px;
}

.ha-btn {
  display: inline-block;
  background: var(--he-ink);
  color: var(--he-paper) !important;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.08em;
  padding: 13px 34px;
  transition: background 0.25s ease;
}

.ha-btn:hover {
  background: var(--he-rein);
  color: #fff !important;
}

.ha-link {
  font-size: 14.5px;
  color: var(--he-ink-2) !important;
  border-bottom: 1px solid var(--he-hairline);
  padding-bottom: 3px;
  transition: color 0.2s ease, border-color 0.2s ease;
}

.ha-link:hover {
  color: var(--he-rein) !important;
  border-color: var(--he-rein);
}

.ha-hero-art {
  position: relative;
  min-height: 240px;
}

.ha-rein {
  width: 100%;
  height: auto;
  display: block;
}

.ha-seal {
  position: absolute;
  right: 8%;
  bottom: 4%;
  width: 76px;
  height: 76px;
  display: grid;
  place-items: center;
  background: var(--he-rein);
  color: #f5f1e8;
  font-family: var(--he-serif);
  font-weight: 900;
  font-size: 26px;
  letter-spacing: 0.14em;
  writing-mode: vertical-rl;
  transform: rotate(3deg);
}

/* ── 档案总目 ─────────────────────────────────────────────── */

.ha-stats {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  border-top: 2px solid var(--he-ink);
  border-bottom: 1px solid var(--he-hairline);
  padding: 26px 0 22px;
}

.ha-stat {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 2px 22px;
  border-left: 1px solid var(--he-hairline-soft);
}

.ha-stat:first-child {
  border-left: none;
  padding-left: 0;
}

.ha-stat-value {
  font-family: var(--he-serif);
  font-weight: 900;
  font-size: clamp(30px, 3.4vw, 42px);
  line-height: 1.1;
  color: var(--he-ink);
  font-variant-numeric: tabular-nums;
  transition: color 0.2s ease;
}

.ha-stat:hover .ha-stat-value {
  color: var(--he-rein);
}

.ha-stat-label {
  font-size: 12.5px;
  letter-spacing: 0.18em;
  color: var(--he-ink-3);
}

.ha-stats-note {
  grid-column: 1 / -1;
  margin: 18px 0 0;
  font-size: 12.5px;
  color: var(--he-ink-3);
}

/* ── 区块通用 ─────────────────────────────────────────────── */

.ha-section {
  padding: 72px 0 0;
}

.ha-last {
  padding-bottom: 104px;
}

/* ── 概念档案卡 ───────────────────────────────────────────── */

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
  padding: 26px 24px 30px;
  transition: background 0.25s ease;
}

.ha-card:hover {
  background: var(--he-paper-2);
}

.ha-card-num {
  font-family: var(--he-serif);
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.1em;
  color: var(--he-rein);
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

.ha-card-arrow {
  display: inline-block;
  margin-left: 6px;
  font-size: 14px;
  opacity: 0;
  transform: translate(-3px, 3px);
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.ha-card:hover .ha-card-arrow {
  opacity: 1;
  transform: none;
}

.ha-card-desc {
  font-size: 13.5px;
  line-height: 1.85;
  color: var(--he-ink-2);
}

/* ── 自指三条 ─────────────────────────────────────────────── */

.ha-rows {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 40px;
}

.ha-row {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.ha-row-num {
  font-family: var(--he-serif);
  font-weight: 900;
  font-size: 20px;
  line-height: 1.4;
  color: var(--he-rein);
}

.ha-row-title {
  font-family: var(--he-serif);
  font-weight: 700;
  font-size: 16.5px;
  color: var(--he-ink);
  margin: 0 0 6px;
}

.ha-row-desc {
  font-size: 13.5px;
  line-height: 1.85;
  color: var(--he-ink-2);
  margin: 0;
}

.ha-fineprint {
  margin: 36px 0 0;
  font-size: 13px;
  color: var(--he-ink-3);
}

.ha-fineprint a {
  color: var(--he-rein) !important;
  border-bottom: 1px solid var(--he-rein-soft);
}

/* ── 导览 ─────────────────────────────────────────────────── */

.ha-starts {
  border-top: 2px solid var(--he-ink);
}

.ha-start {
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr) auto;
  align-items: baseline;
  gap: 20px;
  padding: 20px 4px;
  border-bottom: 1px solid var(--he-hairline);
  transition: background 0.2s ease, padding 0.2s ease;
}

.ha-start:hover {
  background: var(--he-paper-2);
  padding-left: 12px;
  padding-right: 12px;
}

.ha-start-title {
  font-family: var(--he-serif);
  font-weight: 700;
  font-size: 17px;
  color: var(--he-ink);
}

.ha-start-desc {
  font-size: 13.5px;
  color: var(--he-ink-3);
}

.ha-start-arrow {
  font-size: 16px;
  color: var(--he-rein);
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
  .ha-d4 { animation-delay: 0.34s; }
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
    grid-template-columns: 1fr;
    padding: 56px 0 48px;
  }
  .ha-hero-art {
    order: -1;
    min-height: 0;
    max-width: 320px;
  }
  .ha-seal {
    width: 60px;
    height: 60px;
    font-size: 20px;
  }
  .ha-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    row-gap: 20px;
  }
  .ha-stat {
    padding: 2px 16px;
  }
  .ha-stat:nth-child(odd) {
    border-left: none;
    padding-left: 0;
  }
  .ha-grid {
    grid-template-columns: 1fr;
  }
  .ha-rows {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  .ha-start {
    grid-template-columns: minmax(0, 1fr) auto;
  }
  .ha-start-desc {
    grid-column: 1 / -1;
    order: 3;
  }
}
</style>
