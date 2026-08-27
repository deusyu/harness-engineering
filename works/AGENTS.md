# works/ — 作品输出

可展示的成果：文章、工具、模板、教程等。

## 文件约定

- 每个作品一个子目录或单独文件
- 作品应该是**可独立理解的**，不依赖仓库其他部分的上下文
- 适合放到博客、GitHub、求职作品集中展示

## 已有作品

### 翻译

**元信息头约定**：每篇 `*-translation.md` 以 YAML frontmatter 开头（不再使用早期的引用块头），必备字段：

```yaml
title:             # 中文标题
sourceTitle:       # 原文标题
sourceUrl:         # 原文链接
sourceAuthor:      # 原作者（可含所属机构）
sourcePublishedAt: # 原文日期（未知可为 null）
translationMethod: # 翻译方式，如 "baoyu-translate skill (refined mode)"
language: "zh-CN"
sourceFigureCount: # 原文插图数（数字；null = 原文不可得、未审计。C10 据此校验正文嵌图数）
sourceFigureAudit: # 仅当 sourceFigureCount 为 0 时必填：核对留痕，值里必须含 YYYY-MM-DD（C13）
```

可选字段（抓取流水线的溯源元数据）：`sourceCoverImage`、`sourceSiteName`、`sourceSummary`、`summary`、`sourceLanguage`、`sourceAdapter`、`sourceCapturedAt`、`sourceConversionMethod`、`sourceKind`、`sourceRequestedUrl`、`translatedAt`、`translatorAudience`、`translatorStyle` 等。封面图字段统一用 `sourceCoverImage`（不用 `coverImage`）。

**插图与外链约定**：

- 新收录译文的原文插图应下载到 `works/imgs/<slug>/`，以本地相对路径嵌入（`imgs/<slug>/<文件名>`，先例见 [claude-code-architecture-reverse-translation.md](claude-code-architecture-reverse-translation.md)）；存量条目的远程嵌图暂容忍，不强制回迁。
- 译文正文保留原文中的超链接，不得在翻译时丢弃。
- `scripts/check-consistency.sh` C10 会校验 `sourceFigureCount` 与正文嵌图数（嵌图数 ≥ 声明数），并对本地嵌图路径做文件存在性检查。
- **声明 `sourceFigureCount: 0` 时另需 `sourceFigureAudit`（C13）。** 原因是 C10 只能证伪"多报"——它的判据是"嵌图数 < 声明数"，所以 0 在本地**永远为真**，不管你有没有真去数过原文。2026-07-27 就有一篇靠这个洞蒙混过关（声明 0，原文实有 4 张配图）。审计值要写清**怎么核对的**并带上核对日期，例如：

  ```yaml
  sourceFigureCount: 0
  sourceFigureAudit: "2026-07-27 抓原文 HTML 核对：<article> 区内 <figure> 与 <img> 计数均为 0"
  ```

  判定口径：**只算正文配图。** 站点 logo、作者头像、页脚图标、推荐位缩略图、社交分享卡片、系列导航卡片都不计入——但如果你据此判 0，就把这个判断写进审计值里，别只写"没有图"。

| 文件 | 原文 | 来源 |
|------|------|------|
| [fowler-harness-engineering-full-translation.md](fowler-harness-engineering-full-translation.md) | Harness Engineering for Coding Agent Users | Martin Fowler / Böckeler |
| [fowler-harness-engineering-memo-translation.md](fowler-harness-engineering-memo-translation.md) | Harness Engineering (Memo) | Martin Fowler / Böckeler |
| [anthropic-managed-agents-translation.md](anthropic-managed-agents-translation.md) | Scaling Managed Agents | Anthropic |
| [fowler-encoding-team-standards-translation.md](fowler-encoding-team-standards-translation.md) | Encoding Team Standards | Fowler / Rahul Garg |
| [fowler-feedback-flywheel-translation.md](fowler-feedback-flywheel-translation.md) | Feedback Flywheel | Fowler / Rahul Garg |
| [langchain-agent-evaluation-checklist-translation.md](langchain-agent-evaluation-checklist-translation.md) | Agent Evaluation Readiness Checklist | LangChain |
| [meta-harness-paper-translation.md](meta-harness-paper-translation.md) | Meta-Harness: End-to-End Optimization | Stanford/KRAFTON/MIT |
| [github-agent-driven-development-translation.md](github-agent-driven-development-translation.md) | Agent-driven Development in Copilot | GitHub / Tyler McGoffin |
| [inside-the-scaffold-paper-translation.md](inside-the-scaffold-paper-translation.md) | Inside the Scaffold (源代码分类法) | Huawei / Benjamin Rombaut |
| ⭐ [maganti-eight-years-building-ai-translation.md](maganti-eight-years-building-ai-translation.md) | Eight Years of Wanting | Lalit Maganti |
| [langchain-continual-learning-translation.md](langchain-continual-learning-translation.md) | Continual Learning for AI Agents | LangChain / Harrison Chase |
| [openai-codex-symphony-translation.md](openai-codex-symphony-translation.md) | An Open-Source Spec for Codex Orchestration: Symphony | OpenAI / Kotliarskyi, Zhu, Brock |
| [claude-code-architecture-reverse-translation.md](claude-code-architecture-reverse-translation.md) | Claude Code Architecture (Reverse Engineered) | Vikash Rungta / Substack |
| [fowler-sensors-translation.md](fowler-sensors-translation.md) | Maintainability sensors for coding agents | Martin Fowler / Böckeler |
| [fowler-spdd-translation.md](fowler-spdd-translation.md) | Structured-Prompt-Driven Development (SPDD) | Fowler / Wei Zhang, Jessie Jie Xia |
| [langchain-adlc-translation.md](langchain-adlc-translation.md) | The Agent Development Lifecycle (ADLC) | LangChain / Harrison Chase |
| [deep-agents-interpreter-translation.md](deep-agents-interpreter-translation.md) | Interpreters in Deep Agents | LangChain / Hunter Lovell |
| [anthropic-postmortem-translation.md](anthropic-postmortem-translation.md) | An update on recent Claude Code quality reports | Anthropic 工程团队 |
| [arxiv-agentic-harness-engineering-translation.md](arxiv-agentic-harness-engineering-translation.md) | Agentic Harness Engineering (论文) | 复旦/北大/奇绩 · Jiahang Lin 等 / arXiv |
| [arxiv-overeager-coding-agents-translation.md](arxiv-overeager-coding-agents-translation.md) | Overeager Coding Agents (论文) | Yubin Qu 等 / arXiv |
| [chris-ai-code-translation.md](chris-ai-code-translation.md) | How I Use AI to Code | Chris Parsons / 个人博客 |
| [langsmith-engine-translation.md](langsmith-engine-translation.md) | How we built LangSmith Engine | LangChain / Palash Shah |
| [anthropic-dynamic-workflows-translation.md](anthropic-dynamic-workflows-translation.md) | A harness for every task: dynamic workflows in Claude Code | Anthropic / Claude · Thariq Shihipar, Sid Bidasaria |
| [metr-uplift-update-translation.md](metr-uplift-update-translation.md) | We are Changing our Developer Productivity Experiment Design | METR / Joel Becker 等 |
| [weng-harness-self-improvement-translation.md](weng-harness-self-improvement-translation.md) | Harness Engineering for Self-Improvement | Lil'Log / Lilian Weng |
| [osmani-loop-engineering-translation.md](osmani-loop-engineering-translation.md) | Loop Engineering | Addy Osmani / 个人博客 |
| [ronacher-coming-loop-translation.md](ronacher-coming-loop-translation.md) | The Coming Loop | Armin Ronacher / 个人博客 |
| [anthropic-c-compiler-translation.md](anthropic-c-compiler-translation.md) | Building a C compiler with a team of parallel Claudes | Anthropic / Nicholas Carlini |
| [cursor-scaling-agents-translation.md](cursor-scaling-agents-translation.md) | Scaling long-running autonomous coding | Cursor / Wilson Lin |
| [anthropic-how-we-contain-translation.md](anthropic-how-we-contain-translation.md) | How we contain Claude across products | Anthropic / Max McGuinness 等 |
| [bun-in-rust-translation.md](bun-in-rust-translation.md) | Rewriting Bun in Rust | Bun Blog / Jarred Sumner |
| [ronacher-better-models-worse-tools-translation.md](ronacher-better-models-worse-tools-translation.md) | Better Models: Worse Tools | Armin Ronacher / 个人博客 |
| [anthropic-context-engineering-claude5-translation.md](anthropic-context-engineering-claude5-translation.md) | The new rules of context engineering for Claude 5 generation models | Anthropic / Claude · Thariq Shihipar |
| [langchain-reviewbench-translation.md](langchain-reviewbench-translation.md) | Evaluating code review agents with ReviewBench | LangChain / Nick Hollon |
| [fowler-tdd-in-agent-loop-translation.md](fowler-tdd-in-agent-loop-translation.md) | TDD inside the agent loop - theater or actual value? | Birgitta Böckeler |
| [osmani-practical-loop-engineering-translation.md](osmani-practical-loop-engineering-translation.md) | Practical Loop Engineering | Addy Osmani |
| [zalando-agentic-engineering-translation.md](zalando-agentic-engineering-translation.md) | Agentic Engineering at Zalando: A Snapshot | Bartosz Ocytko |
| [pi-what-is-a-harness-translation.md](pi-what-is-a-harness-translation.md) | What Is a Harness? | Earendil / Pi 团队 |
| [pi-compaction-translation.md](pi-compaction-translation.md) | How Compaction Works in Pi | Earendil / Pi 团队 |
| [arxiv-starharness-translation.md](arxiv-starharness-translation.md) | StarHarness: Evolving Harnesses with Stratified Search for Enterprise Environments | ServiceNow / Mila 等 |

### 中文转译 / 二手资料

> 这一区收录**他人已发布的中译版**（非本仓库原创翻译），不计入上方"翻译"表的统计与 README badge。
> 文件命名以 `*-zh-cn-repost.md` 结尾，主动避开 `scripts/check-consistency.sh` C4 的 `*-translation.md` 计数 glob。

| 文件 | 原文 / 来源 | 中译者 |
|------|------|------|
| [dotey-pachaar-anatomy-zh-cn-repost.md](dotey-pachaar-anatomy-zh-cn-repost.md) | The Anatomy of an Agent Harness（Akshay Pachaar 的 X Article） | 宝玉（@dotey） |

### 中文原文收录 / 社区文章

> 这一区收录中文社区对 Harness Engineering 的原创短文或帖子原文。它们不是本仓库原创，也不计入上方"翻译"表的统计与 README badge。

| 文件 | 原文 / 来源 | 作者 |
|------|------|------|
| [dongxi-subagent-original.md](dongxi-subagent-original.md) | Harness 系列文章之 7：关于 subagent（X status） | 马东锡 NLP（@dongxi_nlp） |

### 原创文章

| 文件 | 主题 | 说明 |
|------|------|------|
| ⭐ [harness-engineering-chinese-interpretation.md](harness-engineering-chinese-interpretation.md) | 驭缰工程的隐秘叙事 | 15 篇核心文章的综合分析：四学派、生命周期、共演化陷阱、评估之踵、人类角色消解 |

### 演示与海报

| 目录 | 主题 | 说明 |
|------|------|------|
| [harness-engineering-intro-deck/](harness-engineering-intro-deck/) | 项目介绍 PPT + 竖版海报 | open-kimi-ppt skill 生成：10 页 deck 与 1 页海报，PPTD 可编辑源 + 嵌字体 PPTX 成品各一份，内容计数为 2026-08 快照 |

## 作品方向参考

- 一个 AGENTS.md 模板（适用于中小团队）
- 一套自定义 linter 的最小可行示例
- 一个"从零到发布"的 Harness Engineering 实践教程

## 下一步

作品发出后，把外部读者的反馈（评论、转发、质疑）回流到 [feedback/](../feedback/)；
新出现的洞见、被挑战的论点回到 [thinking/](../thinking/) 继续打磨。
