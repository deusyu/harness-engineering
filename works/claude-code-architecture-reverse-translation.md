---
title: "Claude Code 架构（逆向工程版）"
sourceTitle: "Claude Code Architecture (Reverse Engineered)"
sourceUrl: "https://vrungta.substack.com/p/claude-code-architecture-reverse"
sourceRequestedUrl: "https://vrungta.substack.com/p/claude-code-architecture-reverse?__readwiseLocation="
sourceAuthor: "Vikash Rungta"
sourceCoverImage: "imgs/claude-code-architecture-reverse/img-001-8910c57f-5022-4dde-8613-26e7baf5e7d3_1536x1024.png"
sourcePublishedAt: "2025-11-01T14:14:04.317Z"
sourceSummary: "We are entering the third era of LLM applications. We started with Chatbots (stateless Q&A), moved to Workflows (rigid, code-driven chains like n8n or LangChain), and are now arriving at Autonomous Agents (model-driven loops). Claude Code is the first mass-market example of this new architecture. I call these “Superagents”"
sourceAdapter: "generic"
sourceCapturedAt: "2026-06-11T04:09:07.384Z"
sourceConversionMethod: "legacy:readability"
sourceFallbackReason: "Readability/Turndown produced higher-quality markdown than Defuddle"
sourceKind: "generic/article"
sourceLanguage: "en"
summary: "我们正在进入 LLM 应用的第三个时代：从无状态问答的聊天机器人，到 n8n、LangChain 这类代码驱动的刚性工作流，再到由模型驱动循环的自主智能体。Claude Code 是这种新架构第一个走向大众市场的样板。作者称它们为“超级智能体”。"
language: "zh-CN"
translationMethod: "baoyu-translate skill (refined mode)"
translatorAudience: "technical"
translatorStyle: "storytelling"
sourceFigureCount: 18
---

# Claude Code 架构（逆向工程版）

我们正在进入大语言模型（LLM）应用的第三个时代。第一阶段是**聊天机器人**：无状态的问答。第二阶段是**工作流**：像 n8n 或 LangChain 这样由代码驱动的刚性链路。现在，我们来到第三阶段：**自主智能体**，也就是由模型驱动循环的系统。Claude Code 是这种新架构第一个走向大众市场的例子。我把它们称为“**超级智能体**”。

**TL;DR：6 个架构转向**

- **从工作流到循环**：从“代码控制模型”（DAG）转向“模型控制循环”（TAOR）。运行时很笨，模型才是 CEO。

- **运行外壳就是身体**：AI 不只是一段提示词，它被包在本地的 **Harness（运行外壳）**里。这个外壳给“大脑”（LLM）配上“身体”（Shell、文件系统、记忆），让它能在真实世界里行动。

- **原语大于集成**：智能体不是依赖 100 个脆弱的“Jira 插件”，而是使用 **原语工具**（Bash、Grep、Edit），组合出任何人类工程师能执行的工作流。

- **上下文经济性**：架构把上下文窗口当成稀缺资源，通过**自动压缩**、**子智能体**和**语义搜索**保护它，避免“上下文坍缩”。

- **解决普遍失败模式**：失控循环、健忘、权限轮盘赌不是 bug，而是结构性约束。这个设计把它们变成了可管理的产品能力。

- **共同演化**：运行外壳被设计成会逐渐“变薄”。模型越聪明，硬编码脚手架（例如规划步骤）就越该被删除，架构也会随之变得更轻。

![Claude Code 架构逆向工程封面](imgs/claude-code-architecture-reverse/img-001-8910c57f-5022-4dde-8613-26e7baf5e7d3_1536x1024.png)

_我出于好奇，逆向工程了一份深度分析：Anthropic 这款 CLI 智能体背后的设计支柱、原语工具和容错策略。_

Claude Code 是 Anthropic 的自主 CLI 智能体。它是一个终端原生工具，直接接入你的本地 shell、文件系统和开发环境。它内置的是一小组能力原语，不是 80 个专用工具，更不是 800 个。可它却能持续击败那些拥有数百个定制集成的智能体。

这篇指南把 Claude Code 当作案例，解释为什么大多数 AI 智能体会失败，以及你可以从中借走哪些架构决策，放进自己的产品里。

如果你想看 `.md` 文件版本（而且更详细），可以去 [https://github.com/vkr11/ChainOfThought/blob/main/claude_code_architecture.md](https://github.com/vkr11/ChainOfThought/blob/main/claude_code_architecture.md)（或者把它放进你的提示词里，让模型基于它构建）。

我计划之后发布一套基于这些经验的“SuperAgent”架构。可以关注一下。

预警：这是一篇很长的文章。

**方法论：我是怎么知道的**

这套架构来自对运行时 transcript、文件系统痕迹（`~/.claude`）、行为压力测试、Anthropic 公开文档与演讲，以及我自己构建智能体系统经验的逆向分析。

> **免责声明**：这是一份外部分析。实际内部架构可能不同。欢迎指正。

在看 Claude Code 的架构之前，先理解它为什么存在。下面这些失败模式困扰着**所有**智能体系统：客服机器人、研究助手、内部 copilot 都逃不开。

![智能体系统的八个常见失败模式](imgs/claude-code-architecture-reverse/img-002-cb1e6587-68a3-4e46-9a50-d1c2b7bdf29a_3300x3160.png)

从“失控循环”让智能体烧钱却不创造价值，到“上下文坍缩”让记忆退化并引发幻觉，这些都不只是 bug，而是每个 AI 团队迟早都会撞上的结构性瓶颈。

Claude Code 用五个核心设计支柱回应这些失败模式。产品里的每个功能，至少都能映射回其中一个支柱。

![Claude Code 回应失败模式的五个核心设计支柱](imgs/claude-code-architecture-reverse/img-003-fef18db9-dd6f-48a1-887b-93311d21b4b1_3100x2960.png)

1. **模型驱动的自主性**：下一步由模型决定，而不是由硬编码脚本决定。

2. **上下文是一种资源**：自动压缩和语义搜索保护最稀缺的资源：上下文窗口。

3. **分层记忆**：会话启动时加载 6 层记忆，让智能体永远不是从零开始。

4. **声明式扩展**：技能、智能体和钩子通过 `.md` 与 `.json` 配置，而不是通过代码扩展。

5. **可组合权限**：工具级 allow/deny/ask，从“所有动作都问我”扩展到“全部绕过”。

Claude Code 代表了 LLM 成熟度的第三阶段：从刚性的代码驱动工作流，走向自主的模型驱动循环。

![从聊天机器人到工作流再到自主智能体的架构演进](imgs/claude-code-architecture-reverse/img-004-22593a2b-2b29-4832-a0e8-070cf0f66cb8_3920x1560.png)

在传统工作流里，决定 LLM 下一步做什么的是_代码_。在智能体里，决定权交给_模型_。这是最根本的架构选择：运行时只是一个“笨循环”，所有智能都存在于模型里。

Claude Code 是一个 **Harness（运行外壳）**：一个本地运行时 shell，把 LLM、工具、记忆和编排包在一起。

![Claude Code 作为本地运行外壳连接模型工具记忆与编排](imgs/claude-code-architecture-reverse/img-005-f3abf9e1-ecdb-4944-bd2b-d346ac044732_3892x3440.png)

系统的核心是 **TAOR 循环（Think-Act-Observe-Repeat，思考-行动-观察-重复）**。编排器并不懂代码或文件，它只负责运行这个循环，让模型自己决定什么时候停下。

![TAOR 思考行动观察重复循环示意图](imgs/claude-code-architecture-reverse/img-006-57718e15-e488-4769-a050-bd008dfdec32_3840x2124.png)

Claude Code 使用**能力原语**：读、写、执行和连接。`Bash` 扮演通用适配器，让模型可以使用人类开发者会用的任何工具，比如 git、npm、docker。

![读写执行连接四类能力原语](imgs/claude-code-architecture-reverse/img-007-4ddff393-6bcc-4012-8ef6-b4b7157801c5_3036x3640.png)

静态分析层会把每一次工具调用拿去和多层白名单比对。这个解析器，正是“把 shell 交给 AI”仍然能保持安全的关键。

![静态分析层对工具调用进行权限检查](imgs/claude-code-architecture-reverse/img-008-305ba660-5c7d-458e-9e30-70e1cf4ae478_2960x2362.png)

会话启动时，智能体会加载从组织策略到个人偏好的所有信息。**自动记忆**循环甚至允许智能体学习你的模式，并把它们写入 `MEMORY.md`，供未来会话使用。

![会话启动时加载组织项目用户与自动记忆](imgs/claude-code-architecture-reverse/img-009-1273e759-0f76-4a98-ac92-7b8040575714_4000x2540.png)

为了避免“上下文坍缩”，系统会在 transcript 接近限制时自动压缩：把原始轮次替换成摘要，释放空间，同时保留决策。

![自动压缩通过摘要保留决策并释放上下文窗口](imgs/claude-code-architecture-reverse/img-010-ea67121b-7a40-4ad3-8021-7d9b90b74123_3372x2658.png)

会话不是一次性用品。它们像 git 分支一样工作：你可以 checkpoint、rollback，也可以把探索 fork 到新的路径。

![会话支持 checkpoint rollback 与 fork](imgs/claude-code-architecture-reverse/img-011-9e6c5b2a-db34-4687-8d8a-34446a552737_2932x1640.png)

UX 采用三层模型：默认减少噪音，但从不隐藏信息。用户看到的，模型也能看到，从而保证完全对齐。

![Claude Code 的三层用户体验模型](imgs/claude-code-architecture-reverse/img-012-c3627ff2-941a-422b-ae8b-efdb3ad03b2b_2496x2400.png)

Claude Code 是一个平台，任何人都能在不写一行 TypeScript 或 Python 的情况下给它添加能力。

![从 CLAUDE.md 到智能体团队的声明式扩展模型](imgs/claude-code-architecture-reverse/img-013-775b06fd-674b-4597-ae56-9e02e03da697_2796x2760.png)

从简单的 `CLAUDE.md` 指令，到完整的**智能体团队**，它的扩展模型都是声明式的。这让非工程师也能扩展系统，同时给产品团队提供了一种“需求感知”机制，用来发现未来应该产品化的能力。

子智能体提供上下文隔离：它们可以把重型研究任务挪出去做，而不污染主窗口。

![子智能体通过隔离上下文返回摘要](imgs/claude-code-architecture-reverse/img-014-967e14d7-f92d-4416-b8af-6c30bde71c8a_3532x2080.png)

同级进程通过共享任务列表协作，并行实现不同模块。

![智能体团队通过共享任务列表并行协作](imgs/claude-code-architecture-reverse/img-015-f644cb3e-ee85-465f-8975-c0b29a6d8ab7_2968x2160.png)

确定性脚本会在每个生命周期事件触发：保存时 lint、shell 调用时审计、部署时设门禁。

![生命周期钩子在 LLM 循环之外执行确定性脚本](imgs/claude-code-architecture-reverse/img-016-d84b353d-68f1-4b15-9255-2f77099e6d46_2132x2920.png)

模型上下文协议（MCP）提供了一座通往外部服务和工具的通用桥梁。

![模型上下文协议连接本地和远程工具服务](imgs/claude-code-architecture-reverse/img-017-0ea86586-b2d5-4d47-b28e-3cf085b4bf27_3200x1560.png)

从技能（同一上下文）到智能体团队（独立进程），这套架构提供了一条成本与隔离度之间的权衡光谱。

![技能子智能体和智能体团队在成本与隔离度上的取舍](imgs/claude-code-architecture-reverse/img-018-eff966f2-f06e-4b3a-b26e-b9e4a114a2bd_4000x1400.png)

不管你是使用 Claude Code、构建竞争产品，还是在自己的产品里设计智能体能力，这些模式都可以迁移。

| 模式 | 为什么有效 |
| --- | --- |
| **TAOR 循环 + 原语工具** | 大约 50 行循环逻辑加一个 shell，就能获得近乎无限的操作表面积。不要构建 100 个工具。 |
| **用子智能体做隔离** | 不要强迫一个上下文同时做研究和实现。它解决了 **#2（上下文坍缩）** 和 **#5（单体上下文）**。 |
| **Todo 工具做任务跟踪** | 防止上下文腐烂。模型管理自己的 scratchpad，而不是被一个刚性 planner 牵着走。 |
| **上下文文件（CLAUDE.md）** | 每一轮都注入项目专属事实。体验会从令人沮丧变成像魔法一样顺手。 |
| **分层记忆** | 不要让用户反复解释。启动时加载组织 -> 项目 -> 用户 -> 自动学习的上下文。 |
| **用钩子做确定性保证** | 保存时 lint、shell 调用时审计、部署时设门禁，全部可以在 LLM 之外完成。需要保证的地方就用确定性。 |

把 8 个失败模式当作一张**记分卡**：

| 失败模式 | 要问的问题 |
| --- | --- |
| 失控循环 | 工具有轮次上限吗？我能杀掉卡住的会话吗？ |
| 上下文坍缩 | 它会管理上下文窗口大小吗？怎么管理？ |
| 权限轮盘赌 | 我能把安全命令加入白名单，并阻止危险命令吗？ |
| 健忘 | 它能跨会话记住我的项目吗？ |
| 单体上下文 | 它能把子任务委派给隔离上下文吗？ |
| 硬编码行为 | 我能不写代码就扩展它吗？ |
| 黑箱 | 我能拦截、审计或 hook 它的行为吗？ |
| 单线程 | 它能并行运行任务吗？ |

| 洞察 | 对你的产品意味着什么 |
| --- | --- |
| **权限就是 UX** | 信任光谱（只读 -> 询问 -> 自动 -> 绕过）决定了你能不能把 AI 卖给企业。没有它，你只能停留在 demo 模式。 |
| **记忆是一项产品功能** | 用户期待智能体会学习。自动记忆不是过度工程，而是留存的基本门槛。 |
| **“模型升级时删除代码”** | 模型越聪明，你的脚手架越应该收缩。如果每次模型发布，你的产品都变得_更_复杂，那就是架构方向错了。 |

| 洞察 | 为什么重要 |
| --- | --- |
| **模型是大脑，运行外壳是身体** | 你可以替换大脑（模型），而不必重建身体（工具、记忆、权限）。一开始就要为模型无关性做准备。 |
| **通用胜过专用** | 一小组能力原语胜过 100 个专用工具。投资组合能力，而不是覆盖率。 |
| **记忆是一项产品功能** | 用户期待智能体记得自己。6 层记忆系统不是过度工程，而是基本门槛。 |
| **权限就是 UX** | 信任光谱（plan -> default -> dontAsk -> bypass）决定了产品是“玩具”还是“可进生产”。 |
| **扩展性就是采用率** | 声明式配置（`.md` 文件，而不是代码）意味着非工程师也能扩展系统。这会显著扩大用户群。 |

| 洞察 | 为什么重要 |
| --- | --- |
| **构建一个笨循环，而不是聪明编排器** | TAOR 循环大约只有 50 行逻辑。所有智能都在模型和提示词里。这样维护和调试容易得多。 |
| **Bash 是你最强大的工具** | 不要给 `npm test` 或 `git commit` 写工具包装器。给模型一个 shell，让它自己组合。 |
| **上下文是最硬的约束** | 每一个架构决策：子智能体、压缩、fork 出来的上下文、工具搜索，本质上都是为了管理一个 200K token 的预算。第一天就要为它设计。 |
| **按层思考，不要建单体** | 记忆（6 层）、权限（工具 + specifier + scope）、扩展（skill -> agent -> team），模式永远是分层组合。 |
| **钩子被低估了** | 生命周期事件里的确定性脚本，给你 lint、审计、安全门禁和遥测，而且不需要碰 LLM。 |
| **模型进步时删除代码** | 如果每次发布你都在增加脚手架，那你是在和模型作对。运行外壳应该随着时间变得_更薄_。 |

还记得第一部分的 8 个普遍失败模式吗？下面是每一个在哪里被解决：

| # | 失败模式 | 由什么解决 | 章节 |
| --- | --- | --- | --- |
| 1 | **失控循环** | `maxTurns` 上限 + 模型驱动的停止信号（不是硬编码退出） | §4.1 TAOR 循环 |
| 2 | **上下文坍缩** | 约 50% 时自动压缩 + 具有隔离上下文窗口的子智能体 | §4.5 + D2 |
| 3 | **权限轮盘赌** | 6 种权限模式 + 工具级 allow/deny/ask + glob 模式 | §4.3 权限 |
| 4 | **健忘** | 6 层记忆系统在会话启动时加载；自动记忆持久化学到的模式 | §4.4 记忆 |
| 5 | **单体上下文** | 子智能体 fork 隔离的 TAOR 循环；智能体团队并行运行同级进程 | D2 + D3 |
| 6 | **硬编码行为** | 声明式扩展（技能、智能体、钩子、MCP、插件），无需改代码 | §Part 5 |
| 7 | **黑箱** | 钩子在每个生命周期事件触发；确定性脚本负责审计、lint 和门禁 | D4 钩子 |
| 8 | **单线程** | 子智能体（子任务委派）+ 智能体团队（并行同级进程） | D2 + D3 |

这篇指南里的每个架构选择，都在解决一个或多个问题。如果你在任何领域构建自己的智能体，都可以把这张表当作 checklist。

> **一个模型无关的运行外壳：它给任何支持工具调用的 LLM 提供文件系统访问、shell、分层记忆和声明式扩展，并把这一切限制在一个有边界的自主循环里，由可组合权限治理。**

_下面的章节会更细地解释每种扩展机制。如果主文告诉你“是什么”和“为什么”，这一节讲的是“怎么做”。_

技能是一种可复用的指令包，可以通过 `/slash-commands` 注入上下文或触发工作流。

```
  my-skill/
  ├── SKILL.md            # 指令（必需）
  ├── reference.md        # 额外文档
  ├── examples/           # 示例输出
  └── scripts/            # 可执行脚本

  Invoke:   /deploy                    (slash command)
            /review my-file.ts         (with arguments)
            Auto-triggered by Claude   (reads description field)
```

| 关键字段 | 用途 |
| --- | --- |
| `disable-model-invocation: true` | 纯上下文注入，零 LLM 成本 |
| `context: fork` | 在隔离上下文里运行，不污染主上下文 |
| `allowed-tools` | 限制执行期间可用的工具 |

子智能体在单独的上下文窗口里运行自己的 TAOR 循环，然后返回摘要。它们是实现**上下文隔离**的主要机制：把重型研究、测试或探索任务移出去，不污染主对话。

Claude Code 内置三个子智能体，每个都针对不同工作优化：

| 内置智能体 | 模型 | 工具 | 使用场景 |
| --- | --- | --- | --- |
| **Explore** | Haiku（快） | 只读（Read、Grep、Glob） | 文件发现、代码库探索 |
| **Plan** | 继承 | 只读（Read、Grep、Glob） | 为规划做代码库研究 |
| **General-purpose** | 继承 | 全部工具 | 复杂研究、多步骤操作 |

下面的图展示了**上下文隔离**：主智能体把任务（例如“explore”）委派给子智能体。子智能体在自己的隔离 TAOR 循环里运行，消耗 token，最后只把_摘要_返回给父级，从而保护主上下文窗口不被污染。

```
  MAIN AGENT                          SUB-AGENT (isolated)
  ┌────────────────┐                  ┌──────────────────────┐
  │                │   Task(explore)  │                      │
  │  "I need to    │────────────────▶│  Own TAOR loop        │
  │   explore the  │                 │  Scoped tools         │
  │   codebase"    │                 │  Own maxTurns         │
  │                │                 │  Own compaction       │
  │                │                 │  Own MEMORY.md        │
  │                │   summary only  │                      │
  │  "Found 3      │◀────────────────│  20 turns of work     │
  │   files..."    │                 │  (stays inside)       │
  └────────────────┘                  └──────────────────────┘
  Context cost:                       Full context used,
  just the summary                    then discarded
```

- **前台**：阻塞主对话。权限提示和问题会传递给用户。

- **后台**：并发运行，用户可以继续工作。权限会在启动前一次性收集；未预先批准的动作会被自动拒绝。后台智能体不能提出澄清问题，工具调用会直接失败，然后智能体继续。后台模式下 MCP 工具不可用。

按 `Ctrl+B` 可以把正在运行的前台智能体送到后台。

自定义子智能体通过带 YAML frontmatter 的 `.md` 文件定义：

```
---
name: code-reviewer
description: Expert code reviewer. Use proactively after code changes.
tools: Read, Glob, Grep, Bash
disallowedTools: Write, Edit
model: sonnet            # or opus, haiku, inherit
permissionMode: default  # or acceptEdits, dontAsk, plan, delegate, bypassPermissions
maxTurns: 25
skills:
  - api-conventions
  - error-handling-patterns
memory: user             # or project, local
---

You are a senior code reviewer. When invoked:
1. Run git diff to see recent changes
2. Focus on modified files
3. Provide feedback by priority: Critical -> Warnings -> Suggestions
```

**存储范围**：`~/.claude/agents/`（用户级）、`.claude/agents/`（项目级），也可以通过 `--agents` CLI flag 指定。

| 功能 | 工作方式 |
| --- | --- |
| **持久记忆** | 设置 `memory: user` -> 智能体会把学到的模式写入 `~/.claude/agent-memory/<name>/MEMORY.md`。下次调用时自动加载前 200 行。 |
| **技能预加载** | 设置 `skills: [api-conventions]` -> 在子智能体启动前，把技能指令注入它的上下文。 |
| **工具作用域** | `tools` 白名单和 `disallowedTools` 黑名单。一种子智能体可以限制另一种：`tools: Task(worker, researcher)`。 |
| **链式调用** | _“Use code-reviewer to find issues, then use optimizer to fix them.”_ 顺序委派。 |
| **可恢复性** | transcript 持久化在 `~/.claude/projects/{project}/{session}/subagents/`。让 Claude “continue that code review”，它就能带着完整历史恢复。 |
| **自动压缩** | 子智能体在接近上下文限制时独立压缩。主对话的压缩不会影响子智能体 transcript。 |

智能体团队是完全独立的 Claude Code 实例，通过共享文件系统协作。不同于子智能体（主智能体的子进程），队友是**同级进程**，可以双向通信。

> **状态**：智能体团队目前仍是实验功能。可通过环境变量 `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` 或 `settings.json` 启用。

| 维度 | 子智能体 | 智能体团队 |
| --- | --- | --- |
| **进程模型** | 主智能体的子进程 | 独立同级进程 |
| **通信** | 结束时返回摘要 | 持续消息/广播 IPC |
| **上下文** | 隔离，用完丢弃 | 独立，持久 |
| **协调** | 顺序委派 | 共享任务列表，自主认领 |
| **最适合** | 研究、探索、评审 | 跨模块并行实现 |

不同于子智能体，**智能体团队**以并行同级进程运行。如下所示，**Lead Agent** 通过共享任务列表分配工作，而独立智能体（Auth、Tests、Docs）在不同终端 pane 中同时执行，并通过消息传递协作。

```
  ┌─────────────────────────────────────────────────────────────────┐
  │                        LEAD AGENT                                │
  │                     (Delegate Mode)                              │
  │                                                                 │
  │   "Implement auth, tests, and docs"                             │
  │        │              │              │                           │
  │        ▼              ▼              ▼                           │
  │   ┌─────────┐   ┌─────────┐   ┌─────────┐                      │
  │   │  Auth   │   │  Tests  │   │  Docs   │  ◀── Shared Task List │
  │   └────┬────┘   └────┬────┘   └────┬────┘  ~/.claude/tasks/     │
  └────────┼──────────────┼──────────────┼──────────────────────────┘
           │              │              │
     ┌─────┴─────┐  ┌─────┴─────┐  ┌────┴──────┐
     │  tmux #1  │  │  tmux #2  │  │  tmux #3  │
     │  Claude   │◀─┤  Claude   │◀─┤  Claude   │ ◀── Peer messaging
     │  Instance │─▶│  Instance │─▶│  Instance │
     │  Own ctx  │  │  Own ctx  │  │  Own ctx  │ ◀── Independent
     └───────────┘  └───────────┘  └───────────┘
```

**配置**：`~/.claude/teams/{team-name}/config.json`

| 模式 | 工作方式 | 要求 |
| --- | --- | --- |
| **In-process** | 所有队友都在你的终端里。`Shift+Up/Down` 选择，输入文字发送消息。 | 任意终端 |
| **Split panes** | 每个队友都有自己的 pane，完全可见。点击某个 pane 即可交互。 | `tmux` 或 iTerm2 |

通过 `settings.json` 设置：`{ "teammateMode": "in-process" }`，或者使用 `claude --teammate-mode in-process`。

- **共享任务列表**：所有智能体都能看到任务状态。队友完成一个任务后，会**自主认领**下一个未分配、未阻塞的任务。

- **Message**：给某个指定队友发消息。

- **Broadcast**：同时给所有队友发消息（谨慎使用，成本会随团队规模增长）。

- **自动空闲通知**：队友完成并停止时，会自动通知 lead。

- **计划审批**：你可以要求队友在修改前先获得计划审批：_“Spawn an architect teammate. Require plan approval before they make any changes.”_

两个团队专属钩子在不调用 LLM 的情况下执行质量约束：

| 钩子 | 触发时机 | 使用场景 |
| --- | --- | --- |
| `TeammateIdle` | 队友即将进入空闲 | 退出码 2 -> 发送反馈，让它继续工作 |
| `TaskCompleted` | 任务即将被标记完成 | 退出码 2 -> 阻止完成，要求修复 |

**熵管理**：对长期运行的项目来说，“垃圾回收”智能体是一个强大的_架构模式_，由团队智能体启用。你可以配置一个低成本后台队友，扫描架构漂移（例如废弃模式、TODO、过期文档），并自动打开重构 PR。这能阻止纯生成式工作流常见的“AI 垃圾”堆积。

- **并行功能实现**：Auth、tests、docs 分别由不同队友负责。

- **用竞争假设做研究**：三个队友测试不同理论，再汇聚结论。

- **跨层协作**：前端、后端、基础设施并行修改。

- **并行代码评审**：多个 reviewer 同时检查不同维度。

钩子是在 **LLM 循环之外**运行的脚本：零 AI，纯确定性。它们是可观测性和护栏层。

```
  ┌──────────────────────────────────────────────────────────────────┐
  │                       HOOK INJECTION POINTS                       │
  │                                                                  │
  │   ○ SessionStart ─────────────────────────────────────────┐      │
  │                                                           ▼      │
  │   User message ──▶ ○ UserPromptSubmit (can transform)     │      │
  │                               │                           │      │
  │                          ┌────┴────┐                      │      │
  │                          │  THINK  │                      │      │
  │                          └────┬────┘                      │      │
  │               ○ PreToolUse ◀──┘  (can block/modify)       │      │
  │               ○ PermissionRequest (can auto-approve/deny) │      │
  │                          ┌────┴────┐                      │      │
  │                          │   ACT   │                      │      │
  │                          └────┬────┘                      │      │
  │              ○ PostToolUse ◀──┤                            │      │
  │              ○ PostToolUseFailure ◀──┘                     │      │
  │               ○ PreCompact (can inject context)            │      │
  │                          ┌────┴────┐                      │      │
  │                          │ DECIDE  │── tool_use ──▶ loop   │      │
  │                          └────┬────┘                      │      │
  │                          ○ Stop                           │      │
  │                          ○ SessionEnd ◀───────────────────┘      │
  └──────────────────────────────────────────────────────────────────┘

  Example: Auto-lint after every file write
  ┌──────────────────────────────────────────┐
  │  "PostToolUse": [{                       │
  │    "matcher": { "tool_name": "Write" },  │
  │    "command": "eslint --fix $FILE"       │
  │  }]                                      │
  └──────────────────────────────────────────┘
```

上图展示了钩子在执行流中的位置。重点看它们在哪里发挥作用：`PreToolUse` 可以在动作发生之前拦截（安全），`PostToolUse` 可以在动作之后响应（可观测性）。`SessionStart` 和 `SessionEnd` 钩子则负责环境设置和清理。

> **专业提示：用 linter 驱动修复。** 不要只是让构建失败。编写自定义 linter，把_修复指令_直接输出进智能体上下文。不要只输出“Error: Line 14”，而是输出“Error: Line 14 uses a deprecated API. Replace `foo()` with `bar()`.” 这样 linter 就成了老师。

MCP（Model Context Protocol，模型上下文协议）让智能体可以通过标准协议连接任何外部服务：数据库、API、SaaS 工具。

```
  ┌──────────────────────────────────────────────────────────────────┐
  │                          CLAUDE CODE                              │
...
  │   100+ tools?  ──▶  Semantic Tool Search  ──▶  Only inject relevant defs
  └──────────────────────────────────────────────────────────────────┘
```

MCP 把各类工具的专有 API 抽象掉。如图所示，它根据工具所在位置支持三种传输模式：

1. **Stdio**：用于本地工具（数据库、CLI 应用）。

2. **HTTP**：用于远程服务器（SaaS 集成）。

3. **SSE**：用于流式更新（日志、实时 feed）。

> **杀手级用例：运行时检查。** MCP 最强大的应用之一，是“Chrome DevTools MCP”或“LogQL MCP”。这给了智能体一双_眼睛_：它能检查正在运行的 localhost 服务的 DOM、抓取 console error，或者查询结构化日志。没有它，智能体是在盲写代码。有了它，智能体就能验证自己的修复。

插件把技能、智能体、钩子和 MCP server 打包成可分发、可安装的单元。

```
  my-plugin/
  ├── plugin.json         # 元数据、版本、依赖
  ├── skills/             # /my-plugin:deploy, /my-plugin:review
  ├── agents/             # 自定义子智能体
  ├── hooks/              # 生命周期脚本
  └── mcp-servers/        # 服务连接器
```

这种结构带来了“One-Click DevOps”的体验。你不必让开发者分别配置 ESLint、pre-commit hook 和数据库连接器，只要发布一个 `standard-compliance` 插件，一次性把这些都配置好。

Marketplace 让人可以发现和安装社区插件。插件技能会带命名空间（`my-plugin:deploy`），避免冲突。

Claude Code 那种“有品味”又“主动”的性格，是通过系统提示词结构精心设计出来的，不是靠模型微调。

**大声强调仍然有效。** 阻止坏行为最有效的方式，就是在提示词里强调：

- `IMPORTANT: DO NOT ADD ***ANY*** COMMENTS unless asked`

- `VERY IMPORTANT: You MUST avoid using search commands like find...`

**语气和风格是一段提示词章节。** 一个专门的 markdown 小节会定义 persona：

- _“If you cannot help, do not explain why — it comes across as preachy.”_

- _“No emojis unless explicitly requested.”_

**用 XML 标签做结构。** 巨大的系统提示词使用 XML 做语义解析：

- `<system-reminder>`：注入到轮次末尾，用来强化规则

- `<good-example>` / `<bad-example>`：few-shot 启发式训练，例如“使用绝对路径，不要 `cd`”

| 模式 | 行为 | 信任级别 |
| --- | --- | --- |
| `plan` | 只读，不写任何东西 | 最低 |
| `default` | 编辑和 shell 前先询问 | 标准 |
| `acceptEdits` | 自动批准文件编辑，shell 仍需询问 | 中等 |
| `dontAsk` | 自动批准 allow list 内的一切 | 高 |
| `bypassPermissions` | 跳过所有检查（仅限受管组织） | 最高 |

```
  Strategy              How It Works                         When to Use
  ─────────────────     ──────────────────────────────       ──────────────────────
  Auto-Compaction       LLM summarizes at ~50% usage         Always on (automatic)
  Manual Compact        /compact <focus area>                 User wants targeted trim
  Sub-Agent             Offload to isolated context           Heavy research/exploration
  Forked Context        context: fork in skill                Skill that would pollute ctx
  Logic-Only Skill      disable-model-invocation: true        Pure instruction injection
  MCP Tool Search       Semantic search for relevant tools    Servers with 100+ tools
```

当同一个功能在多个层级定义时，解析策略取决于功能类型：

```
  CLAUDE.md files         Skills / Subagents         MCP Servers         Hooks
  ────────────────        ──────────────────         ───────────         ─────
  ┌─── Managed ───┐      ┌─── Managed ────┐  WIN   ┌── Local ──┐ WIN  All sources
  ├─── Project ───┤      ├─── CLI Flag ───┤   │    ├── Proj ───┤  │   fire for
  ├─── Rules ─────┤ ALL  ├─── Project ────┤   │    └── User ───┘  │   matching
  ├─── User ──────┤ ADD  ├─── User ───────┤   │                   │   events.
  ├─── Local ─────┤  UP  └─── Plugin ─────┘   ▼    Override by    ▼
  └─── Auto ──────┘                                 name           MERGE
                          Override by name                         (all run)
  LLM resolves            (highest priority
  conflicts               scope wins)
```

这张逻辑图很复杂，但非常关键。它解释了为什么你的 `CLAUDE.md` 指令可能会和某个插件冲突。

- **CLAUDE.md**：所有内容都会被加入上下文（累加）。

- **Skills/Agents/MCP**：同名冲突按优先级解决（Project > User > Plugin）。

- **Hooks**：_所有人_都会运行。如果一个插件添加了 pre-commit hook，而你也添加了一个，两者都会执行。

```
                        SAME CONTEXT              ISOLATED CONTEXT
                    ┌─────────────────┐      ┌──────────────────────┐
  SAME PROCESS      │                 │      │                      │
                    │     SKILLS      │      │    SUB-AGENTS        │
                    │  (inject here)  │      │  (separate loop)     │
                    │  Zero overhead  │      │  Return summary      │
                    └─────────────────┘      └──────────────────────┘

                                             ┌──────────────────────┐
  SEPARATE PROCESS                           │                      │
  (tmux)                                     │    AGENT TEAMS       │
                                             │  (separate sessions) │
                                             │  Task board + IPC    │
                                             └──────────────────────┘

  Cost:            Low ◀──────────────────────────────────────▶ High
  Isolation:       None ◀─────────────────────────────────────▶ Full
```

这张图可以帮你选对工具。需要简单的指令宏？用**技能**，便宜，而且在同一上下文里。需要研究一个主题，但不想填满主窗口？用**子智能体**，上下文隔离。需要并行实现多个功能？用**智能体团队**，独立进程。
