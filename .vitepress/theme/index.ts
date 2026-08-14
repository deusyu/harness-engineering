import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import HomeArchive from './HomeArchive.vue'
import DocMeta from './DocMeta.vue'
import AsideMark from './AsideMark.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      'doc-before': () => h(DocMeta),
      'aside-outline-after': () => h(AsideMark),
    }),
  enhanceApp({ app }) {
    app.component('HomeArchive', HomeArchive)
  },
} satisfies Theme
