// 首页统计的数据加载器：构建/开发时执行 computeStats()，
// 让首页数字与仓库文件系统永远同步（C14 禁止站点源码手写计数）。
import { computeStats } from '../sidebar.mjs'

export default {
  watch: [
    '../../references/articles.md',
    '../../works/*.md',
    '../../concepts/*.md',
    '../../thinking/*.md',
    '../../scripts/check-consistency.sh',
  ],
  load() {
    return computeStats()
  },
}
