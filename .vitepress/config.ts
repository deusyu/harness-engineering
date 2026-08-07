import { defineConfig } from 'vitepress'

// ─── 侧边栏 ──────────────────────────────────────────────────────────────────

const sidebar = [
  {
    text: '概念笔记',
    collapsed: false,
    items: [
      { text: '概念总览', link: '/concepts/00-overview' },
      { text: '仓库即记录系统', link: '/concepts/01-repo-as-source-of-truth' },
      { text: '机械化执行', link: '/concepts/02-mechanical-enforcement' },
      { text: '熵管理与垃圾回收', link: '/concepts/03-entropy-and-garbage-collection' },
      { text: '智能体可读性', link: '/concepts/04-agent-readability' },
      { text: '吞吐量改变合并理念', link: '/concepts/05-throughput-changes-merge' },
      { text: 'Harness 精确定义', link: '/concepts/06-harness-definition' },
      { text: '约束即产品', link: '/concepts/07-spec-as-product' },
    ],
  },
  {
    text: '独立思考',
    collapsed: false,
    items: [
      { text: '为什么有这个项目', link: '/thinking/why-this-project-exists' },
      { text: '跨文章深层洞见', link: '/thinking/cross-article-insights' },
      { text: 'AI 时代的软件项目复杂度', link: '/thinking/software-project-complexity-in-the-ai-era' },
      { text: '评估是房间里的大象', link: '/thinking/evaluation-elephant-in-the-room' },
      { text: '修流程，不修代码', link: '/thinking/fix-the-process-not-the-code' },
      { text: 'Böckeler 框架 vs claude-code-harness', link: '/thinking/guides-sensors-meets-claude-code-harness' },
      { text: 'Java 的可驾驭性', link: '/thinking/harnessability-and-java' },
      { text: '个人开发者的 Harness', link: '/thinking/harness-for-solo-developers' },
      { text: 'Meta-Harness 的五个张力', link: '/thinking/meta-harness-tensions' },
      { text: 'SE ↔ Agent 工程对照表', link: '/thinking/se-to-agent-engineering-mapping' },
      { text: 'Subagent 是 child runtime', link: '/thinking/subagent-is-child-runtime' },
    ],
  },
  {
    text: '动手实践',
    collapsed: false,
    items: [
      { text: 'Ralph Orchestrator 编排循环', link: '/practice/01-ralph-demo/README' },
    ],
  },
  {
    text: '反馈记录',
    collapsed: false,
    items: [
      { text: '翻译即 Harness', link: '/feedback/2026-04-14-translation-as-harness' },
    ],
  },
  {
    text: '翻译作品',
    collapsed: true,
    items: [
      {
        text: '原创分析',
        collapsed: true,
        items: [
          { text: '驭缰工程的隐秘叙事', link: '/works/harness-engineering-chinese-interpretation' },
        ],
      },
      {
        text: 'Martin Fowler 系列',
        collapsed: true,
        items: [
          { text: 'Harness Engineering 正式版', link: '/works/fowler-harness-engineering-full-translation' },
          { text: 'Harness Engineering 备忘录', link: '/works/fowler-harness-engineering-memo-translation' },
          { text: 'Encoding Team Standards', link: '/works/fowler-encoding-team-standards-translation' },
          { text: 'Feedback Flywheel', link: '/works/fowler-feedback-flywheel-translation' },
          { text: '可维护性传感器', link: '/works/fowler-sensors-translation' },
          { text: '结构化提示驱动开发 SPDD', link: '/works/fowler-spdd-translation' },
        ],
      },
      {
        text: 'Anthropic 系列',
        collapsed: true,
        items: [
          { text: 'Scaling Managed Agents', link: '/works/anthropic-managed-agents-translation' },
          { text: '动态工作流', link: '/works/anthropic-dynamic-workflows-translation' },
          { text: '如何遏制 Claude', link: '/works/anthropic-how-we-contain-translation' },
          { text: '质量回归复盘', link: '/works/anthropic-postmortem-translation' },
          { text: '上下文工程新规则', link: '/works/anthropic-context-engineering-claude5-translation' },
          { text: 'C 编译器', link: '/works/anthropic-c-compiler-translation' },
        ],
      },
      {
        text: 'LangChain 系列',
        collapsed: true,
        items: [
          { text: '智能体开发生命周期', link: '/works/langchain-adlc-translation' },
          { text: 'Agent 评估清单', link: '/works/langchain-agent-evaluation-checklist-translation' },
          { text: '持续学习', link: '/works/langchain-continual-learning-translation' },
          { text: 'ReviewBench', link: '/works/langchain-reviewbench-translation' },
          { text: 'Deep Agents 解释器', link: '/works/deep-agents-interpreter-translation' },
          { text: 'LangSmith Engine', link: '/works/langsmith-engine-translation' },
        ],
      },
      {
        text: '学术论文',
        collapsed: true,
        items: [
          { text: 'Meta-Harness 论文', link: '/works/meta-harness-paper-translation' },
          { text: 'Inside the Scaffold 论文', link: '/works/inside-the-scaffold-paper-translation' },
          { text: 'Agentic Harness Engineering', link: '/works/arxiv-agentic-harness-engineering-translation' },
          { text: '过度积极的编码智能体', link: '/works/arxiv-overeager-coding-agents-translation' },
        ],
      },
      {
        text: '工程实践',
        collapsed: true,
        items: [
          { text: 'Codex 编排 Symphony', link: '/works/openai-codex-symphony-translation' },
          { text: 'Agent-driven Development', link: '/works/github-agent-driven-development-translation' },
          { text: '规模化长时自主编码', link: '/works/cursor-scaling-agents-translation' },
          { text: 'METR 实验后续', link: '/works/metr-uplift-update-translation' },
          { text: '用 Rust 重写 Bun', link: '/works/bun-in-rust-translation' },
        ],
      },
      {
        text: '社区博客',
        collapsed: true,
        items: [
          { text: '渴望了八年', link: '/works/maganti-eight-years-building-ai-translation' },
          { text: '面向自我改进', link: '/works/weng-harness-self-improvement-translation' },
          { text: '循环工程', link: '/works/osmani-loop-engineering-translation' },
          { text: '正在到来的循环', link: '/works/ronacher-coming-loop-translation' },
          { text: '更好的模型：更差的工具', link: '/works/ronacher-better-models-worse-tools-translation' },
          { text: 'Claude Code 架构逆向', link: '/works/claude-code-architecture-reverse-translation' },
          { text: '我是如何用 AI 写代码的', link: '/works/chris-ai-code-translation' },
        ],
      },
      {
        text: '中文收录',
        collapsed: true,
        items: [
          { text: 'Agent Harness 解剖', link: '/works/dotey-pachaar-anatomy-zh-cn-repost' },
          { text: 'Subagent 系列', link: '/works/dongxi-subagent-original' },
        ],
      },
    ],
  },
  {
    text: '工具库',
    collapsed: false,
    items: [
      { text: '工具地图', link: '/tools/00-overview' },
      { text: 'Ralph Orchestrator', link: '/tools/harnesses/ralph-orchestrator' },
    ],
  },
  {
    text: '提示词',
    collapsed: false,
    items: [
      { text: '深度研究追踪', link: '/prompts/deep-research-tracker' },
    ],
  },
  {
    text: '资源索引',
    collapsed: false,
    items: [
      { text: '文章索引（74 篇深度摘要）', link: '/references/articles' },
    ],
  },
]

// ─── 主配置 ────────────────────────────────────────────────────────────────────

export default defineConfig({
  lang: 'zh-CN',
  base: '/harness-engineering/',
  title: 'Harness Engineering',
  description: '从概念理解到独立实践的 Harness Engineering 深度学习档案',

  lastUpdated: true,
  srcExclude: ['**/.claude/**'],
  ignoreDeadLinks: true,

  sitemap: {
    hostname: 'https://doraemonblogs.github.io',
  },

  markdown: {
    lineNumbers: false,
    image: { lazy: true },
  },

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '概念笔记', link: '/concepts/00-overview' },
      { text: '独立思考', link: '/thinking/why-this-project-exists' },
      { text: '翻译作品', link: '/works/harness-engineering-chinese-interpretation' },
      { text: '文章索引', link: '/references/articles' },
    ],

    sidebar,

    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' },
          },
        },
      },
    },

    outline: {
      label: '本页目录',
      level: [2, 3],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Doraemonblogs/harness-engineering' },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026 deusyu',
    },

    lastUpdated: {
      text: '最后更新于',
    },

    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },

    editLink: {
      pattern: 'https://github.com/Doraemonblogs/harness-engineering/edit/main/:path',
      text: '在 GitHub 上编辑此页',
    },

    externalLinkIcon: true,
  },
})
