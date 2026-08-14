<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'

const { page, frontmatter } = useData()

const SECTION_LABELS = {
  concepts: '概念 · CONCEPTS',
  thinking: '思考 · THINKING',
  practice: '实践 · PRACTICE',
  feedback: '反馈 · FEEDBACK',
  works: '作品 · WORKS',
  tools: '工具 · TOOLS',
  prompts: '提示词 · PROMPTS',
  references: '资料库 · REFERENCES',
}

const crumb = computed(() => {
  const top = page.value.relativePath.split('/')[0]
  return SECTION_LABELS[top] ?? null
})

const num = computed(() => {
  const m = page.value.relativePath.match(/(?:^|\/)(\d+)-[^/]*\.md$/)
  return m ? m[1] : null
})

const updated = computed(() => {
  const ts = page.value.lastUpdated
  if (!ts) return null
  const d = new Date(ts)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
})
</script>

<template>
  <div v-if="crumb" class="ha-docmeta">
    <span class="ha-crumb-root">档案</span>
    <span class="ha-crumb-sep">·</span>
    <span>{{ crumb }}</span>
    <template v-if="num">
      <span class="ha-crumb-sep">·</span>
      <span class="ha-crumb-num">{{ num }}</span>
    </template>
    <span class="ha-docmeta-right">
      <span v-if="frontmatter.haReadingTime">约 {{ frontmatter.haReadingTime }} 分钟</span>
      <span v-if="updated">最近更新 {{ updated }}</span>
    </span>
  </div>
</template>

<style>
.ha-docmeta {
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-size: 11.5px;
  letter-spacing: 0.14em;
  color: var(--he-ink-3);
  margin: 0 0 26px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--he-hairline-soft);
}

.ha-crumb-root {
  color: var(--he-rein);
  font-weight: 600;
}

.ha-crumb-sep {
  color: var(--he-hairline);
}

.ha-crumb-num {
  font-variant-numeric: tabular-nums;
}

.ha-docmeta-right {
  margin-left: auto;
  display: flex;
  gap: 16px;
  letter-spacing: 0.08em;
  white-space: nowrap;
}

@media (max-width: 640px) {
  .ha-docmeta-right {
    display: none;
  }
}
</style>
