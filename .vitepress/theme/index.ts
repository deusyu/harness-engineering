import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import HomeArchive from './HomeArchive.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('HomeArchive', HomeArchive)
  },
} satisfies Theme
