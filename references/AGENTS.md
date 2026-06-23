# references/ — 外部资源索引

相关文章、仓库、工具的统一索引。这里是指针，不是内容本身。

## 文件约定

- 按主题分文件，如 `articles.md`、`repos.md`、`tools.md`
- 每条记录包含：链接、一句话说明、与 Harness Engineering 的关联

## 文章

详见 [articles.md](articles.md) — 完整的文章索引，含三条脉络 **21 篇文章 + 1 项已跟踪产品** 的深度摘要。
权威计数与编号规则以 `articles.md` 头部为准；本表是它的概览缓存。

### 脉络一：AI 时代的 Harness Engineering（18 篇）

| # | 文章 | 作者 | 核心贡献 |
|---|------|------|---------|
| 1 | [OpenAI 原文](https://openai.com/zh-Hans-CN/index/harness-engineering/) | Ryan Lopopolo | 原点：六大概念 |
| 2 | [Martin Fowler](https://martinfowler.com/articles/harness-engineering.html) | Birgitta Böckeler | Guides×Sensors 控制论框架 + Harnessability + Ashby 定律 |
| 3 | [LangChain](https://blog.langchain.com/the-anatomy-of-an-agent-harness/) | Vivek Trivedy | 精确定义 + 组件清单 |
| 4 | [Anthropic](https://www.anthropic.com/engineering/harness-design-long-running-apps) | Prithvi Rajasekaran | GAN 三智能体 + Harness 瘦身 |
| 5 | [HumanLayer](https://www.humanlayer.dev/blog/skill-issue-harness-engineering-for-coding-agents) | Kyle | 六个杠杆 + 实战避坑 |
| 6 | [Anthropic/Claude Platform](https://claude.com/blog/harnessing-claudes-intelligence) | Lance Martin | 三大构建模式 + BrowseComp 数据 |
| 7 | [Anthropic/Managed Agents](https://www.anthropic.com/engineering/managed-agents) | Lance Martin 等 | Meta-harness + 基础设施解耦 |
| 8 | [Fowler/Encoding Team Standards](https://martinfowler.com/articles/reduce-friction-ai/encoding-team-standards.html) | Rahul Garg | 团队标准显式化三层路径 |
| 9 | [Fowler/Feedback Flywheel](https://martinfowler.com/articles/reduce-friction-ai/feedback-flywheel.html) | Rahul Garg | 从 AI 失败中持续学习的反馈闭环 |
| 10 | [LangChain/Agent Evaluation Checklist](https://blog.langchain.com/agent-evaluation-readiness-checklist/) | LangChain 团队 | 智能体评估五阶段清单 |
| 11 | [Meta-Harness 论文](https://arxiv.org/abs/2603.28052) | Yoonho Lee 等 (Stanford) | 自动化 Harness 搜索优化 |
| 12 | [GitHub/Agent-driven Development](https://github.blog/ai-and-ml/github-copilot/agent-driven-development-in-copilot-applied-science/) | Tyler McGoffin | 智能体驱动开发实战 |
| 13 | [Inside the Scaffold 论文](https://arxiv.org/html/2604.03515v1) | Benjamin Rombaut (Huawei) | 13 个编码智能体脚手架源代码分类法 |
| 14 | ⭐ [Eight years of wanting](https://lalitm.com/post/building-syntaqlite-ai/) | Lalit Maganti | AI 构建真实项目的坦诚复盘 |
| 15 | [Continual learning for AI agents](https://blog.langchain.com/continual-learning-for-ai-agents/) | Harrison Chase | 三层学习：模型/Harness/上下文 |
| 16 | [OpenAI Symphony](https://openai.com/index/open-source-codex-orchestration-symphony/) | Kotliarskyi 等 | 任务跟踪器作为控制平面 + SPEC/WORKFLOW 即产品 |
| 17 | [Claude Code Architecture](https://vrungta.substack.com/p/claude-code-architecture-reverse) | Vikash Rungta | Claude Code 运行外壳、TAOR 循环、工具原语、权限与上下文管理的外部逆向分析 |
| 18 | [Harness 系列文章之 7：关于 subagent](https://x.com/dongxi_nlp/status/2068922428516892998) | 马东锡 NLP | Subagent = tool call 入口 + child runtime；区分 session/context/subagent 与 evidence 回流 |

### 脉络二：云原生 Harness.io（2 篇）

| # | 文章 | 核心贡献 |
|---|------|---------|
| 19 | [Harness.io 官方](https://www.harness.io/blog/understanding-ci-cd-platforms-the-backbone-of-modern-devops) | CI/CD 平台全局架构 |
| 20 | [Google Cloud Architecture](https://docs.cloud.google.com/architecture/partners/harness-cicd-pipeline-for-rag-app) | Harness + GCP 部署 RAG |

### 脉络三：效率悖论与能力进化（1 篇）

| # | 文章 | 核心贡献 |
|---|------|---------|
| 21 | [YDD / Miss-you](https://yousali.com/posts/20260303-ai-coding-efficiency-to-evolution/) | 效率悖论的系统性拆解：约束理论 + Spec/Rule/Skill + 验证闭环 + 并发 |

### 已跟踪产品 / 项目（不计入文章数）

| 项 | 项目 | 说明 |
|---|------|------|
| ⭐ | [Chachamaru127 / claude-code-harness v4.2 "Hokage"](https://github.com/Chachamaru127/claude-code-harness/tree/v4.2.0) | Claude Code 上当下最完整的开源 harness 实现之一；Plan→Work→Review→Release 五动词 + Go 原生 R01–R13 guardrail。本仓库分析见 `thinking/guides-sensors-meets-claude-code-harness.md` |

## 项目

### Ralph 系列

| 项目 | Stars | 说明 | 关联概念 |
|------|-------|------|---------|
| [snarktank/ralph](https://github.com/snarktank/ralph) | 13.6k | 原版 Ralph 循环：bash + PRD + 每次清空上下文 | 全部六大概念的最小实现 |
| [ralph-orchestrator](https://mikeyobrien.github.io/ralph-orchestrator/) | 2.3k | Rust 版：Hat 角色 + 事件驱动 + 背压 | 机械化执行、熵管理 |
| [bmad-ralph](https://github.com/qianxiaofeng/bmad-ralph) | 2 | BMAD + Ralph：并行 worktree + 三层自愈 | 自主水平提升、吞吐量 |

### 社区

| 资源 | 说明 | 关联 |
|------|------|------|
| [vibe-coding-cn](https://github.com/tukuaiai/vibe-coding-cn) | 中文 Vibe Coding 社区 | 仓库组织方式、AGENTS.md 分级 |

### 延伸阅读

| 资源 | 说明 |
|------|------|
| [Mitchell Hashimoto: Engineer the Harness](https://mitchellh.com/writing/my-ai-adoption-journey#step-5-engineer-the-harness) | "Harness" 概念的另一个起源 |
| [Martin Fowler: Context Engineering for Coding Agents](https://martinfowler.com/articles/context-engineering-coding-agents.html) | Context Engineering 专题 |
| [Martin Fowler: Humans and Agents in SE Loops](https://martinfowler.com/articles/humans-and-agents.html) | 人类与智能体的协作模式 |

## 待补充

> 占位条目统一收在这里，**不进 `articles.md` 的编号正文**，避免污染文章计数。

- [ ] Geoffrey Huntley 的 Ralph 原始文章
- [ ] OpenAI 相关文章：Codex App Server、Responses API
- [ ] Medium 实战专栏 — "Beyond Migration: How We Engineered a Secure & Intelligent Delivery Platform with Harness CICD"（标题可能已变更或文章已下架）

## 下一步

读完一篇资料后：
- 想对它的论点做独立分析或质疑 → [thinking/](../thinking/)
- 想翻译为中文输出 → [works/](../works/)
- 想用它的方法做实验 → [practice/](../practice/)
- 想沉淀其中的提示词模板 → [prompts/](../prompts/)
