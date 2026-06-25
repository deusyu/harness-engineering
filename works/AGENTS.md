# works/ — 作品输出

可展示的成果：文章、工具、模板、教程等。

## 文件约定

- 每个作品一个子目录或单独文件
- 作品应该是**可独立理解的**，不依赖仓库其他部分的上下文
- 适合放到博客、GitHub、求职作品集中展示

## 已有作品

### 翻译

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

## 作品方向参考

- 一个 AGENTS.md 模板（适用于中小团队）
- 一套自定义 linter 的最小可行示例
- 一个"从零到发布"的 Harness Engineering 实践教程

## 下一步

作品发出后，把外部读者的反馈（评论、转发、质疑）回流到 [feedback/](../feedback/)；
新出现的洞见、被挑战的论点回到 [thinking/](../thinking/) 继续打磨。
