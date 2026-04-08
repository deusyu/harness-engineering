# references/ — 外部资源索引

相关文章、仓库、工具的统一索引。这里是指针，不是内容本身。

## 文件约定

- 按主题分文件，如 `articles.md`、`repos.md`、`tools.md`
- 每条记录包含：链接、一句话说明、与 Harness Engineering 的关联

## 文章

详见 [articles.md](articles.md) — 完整的文章索引，含三条脉络 10 篇文章的深度摘要。

### 脉络一：AI 时代的 Harness Engineering

| # | 文章 | 作者 | 核心贡献 |
|---|------|------|---------|
| 1 | [OpenAI 原文](https://openai.com/zh-Hans-CN/index/harness-engineering/) | Ryan Lopopolo | 原点：六大概念 |
| 2 | [Martin Fowler](https://martinfowler.com/articles/exploring-gen-ai/harness-engineering.html) | Birgitta Böckeler | 三层框架 + 四个假说 |
| 3 | [LangChain](https://blog.langchain.com/the-anatomy-of-an-agent-harness/) | Vivek Trivedy | 精确定义 + 组件清单 |
| 4 | [Anthropic](https://www.anthropic.com/engineering/harness-design-long-running-apps) | Prithvi Rajasekaran | GAN 三智能体 + Harness 瘦身 |
| 5 | [HumanLayer](https://www.humanlayer.dev/blog/skill-issue-harness-engineering-for-coding-agents) | Kyle | 六个杠杆 + 实战避坑 |
| 6 | [Anthropic/Claude Platform](https://claude.com/blog/harnessing-claudes-intelligence) | Lance Martin | 三大构建模式 + BrowseComp 数据 |

### 脉络二：云原生 Harness.io

| # | 文章 | 核心贡献 |
|---|------|---------|
| 5 | [Harness.io 官方](https://www.harness.io/blog/understanding-ci-cd-platforms-the-backbone-of-modern-devops) | CI/CD 平台全局架构 |
| 6 | Medium 实战 | 未找到，待补充 |
| 7 | [Google Cloud Architecture](https://docs.cloud.google.com/architecture/partners/harness-cicd-pipeline-for-rag-app) | Harness + GCP 部署 RAG |

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

- [ ] Geoffrey Huntley 的 Ralph 原始文章
- [ ] OpenAI 相关文章：Codex App Server、Responses API
- [ ] Medium 实战专栏（标题待确认）
