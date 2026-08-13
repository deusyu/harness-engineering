import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import HomeStats from './HomeStats.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('HomeStats', HomeStats)
  },
} satisfies Theme
