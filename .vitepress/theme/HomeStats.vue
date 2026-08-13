<script setup>
import { data } from './home-stats.data.mjs'

const items = [
  { value: data.articles, label: '篇文章深度摘要', link: '/references/articles' },
  { value: data.translations, label: '篇一手翻译', link: '/works/harness-engineering-chinese-interpretation' },
  { value: data.concepts, label: '篇概念笔记', link: '/concepts/00-overview' },
  { value: data.thinking, label: '篇独立思考', link: '/thinking/why-this-project-exists' },
  {
    value: data.checks,
    label: '项机械化一致性检查',
    link: 'https://github.com/deusyu/harness-engineering/blob/main/scripts/check-consistency.sh',
  },
]
</script>

<template>
  <section class="home-stats" aria-label="仓库实时统计">
    <a v-for="item in items" :key="item.label" class="home-stats-card" :href="item.link">
      <span class="home-stats-value">{{ item.value }}</span>
      <span class="home-stats-label">{{ item.label }}</span>
    </a>
  </section>
  <p class="home-stats-note">以上数字在每次构建时从仓库文件系统自动统计——没有手写计数，也就没有漂移。</p>
</template>
