---
sourceTitle: "Harness 系列文章之 7：关于 subagent"
sourceUrl: "https://x.com/dongxi_nlp/status/2068922428516892998"
sourceAuthor: "马东锡 NLP (@dongxi_nlp)"
sourcePublishedAt: "2026-06-22"
sourceKind: "x/status"
sourceLanguage: "zh-CN"
sourceCapturedAt: "2026-06-23"
sourceCaptureMethod: "user-provided markdown"
---

# Harness 系列文章之 7：关于 subagent

**作者**：马东锡 NLP (@dongxi_nlp)  
**原文链接**：https://x.com/dongxi_nlp/status/2068922428516892998  
**发布时间**：2026年6月22日  
**互动数据**：Likes=13 (更新中), Reposts=13, Quotes=3, Replies=2, Bookmarks=186, Views=27281+

---

Subagent 是一次 tool call，为 coding agent 会打开一个新的 work context。

在启动一次 subagent 的过程中，发生了什么？

**简要回答**：Tool call outside, runtime inside。

## 先看 tool call

为什么说，subagent 的启动其实是一次 tool call。

比如，用户说：“Use a verifier subagent to audit webhook retries。”

如果 Harness 支持，可以直接使用 slash command `/delegate` 完成 spawn_agent 的 tool call。

tool 跑完以后，parent 会拿到 child handle。

## 再看 run time

在 harness 文章 3 中，提到，每次 tool call，都改变了 coding agent 的世界状态。

那么 subagent 这次启动的 tool call 之后，发生了什么？来看 runtime inside。

Tool call 是入口，深入一层，Harness 会打开一个新的 work context。

subagent 的 context 与 coding agent 的 context 有什么关系？

## Session、Context、Subagent

这三个词容易混在一起。

- **session** 是 runtime container：thread、transcript、tools、permissions、resources、status、artifacts。
- **context** 是某次 model call 能看到的 projection：instructions、skills、AGENTS.md、recent turns、summaries、tool results、file state。
- **subagent** 是 parent session 下面新开的 child session。它可以继承 resources，也会拿到一段被选择过的 context slice。

## Tool Call Outside, Runtime Inside

Subagent 这个词有点容易误导，它听起来像一个小一点的智能体。

在 harness 里，它更像一个 managed child runtime。subagent 可以使用很多 parent 也能使用的 Harness resources。例如 tools、skills、AGENTS.md，MCP servers、cwd、sandbox、permissions。

但 shared resources 不代表 shared transcript。child 有自己的 work context。parent 选择投影多少 context 给它。

## Fresh Agent、Forked Agent 或 Partial Fork？

parent 选择投射多少 context 给 sub agent，由 subagent 的类型决定。常见的 subagent 有三种 pattern：

- **fresh child**：它需要收到 goal、relevant files、已尝试过什么、exact output，以及回答深度。
- **forked child**：已经继承了 surrounding context，prompt 应该直接给下一步 directive。
- **partial fork**：是最实用的中间方案。它给 child 足够的 local memory 去工作，同时避免 parent history 变成 inherited noise。

这里给出一些例子，我们可以想想，什么样的 subagent 适合对应的 task？

- **Parallelism Agent**：一个 subagent 查 database migration，一个 subagent 看 frontend state，一个 subagent 跑 verification
- **Role Specialization**：Explorer、Planner、Verifier、Worker、reviewer ...
- **Background Work**：例如多个 subagent 完成大型重构、长测试

## Subagent workflow

一个实用的 subagent workflow：

如何组织好多个 subagent 完成工作，其实非常具有挑战性。越清晰地定义 subagent 的 role、context、tool 越好。

## 最后

更多 agents 不保证更好的工作，更多 agents 会制造更多 runtime state。

Harness 必须知道谁在工作、它知道什么、改了什么、什么时候完成、结果如何变成 evidence。

subagent 会为 coding agent 拓展世界，而 harness 则关于新世界是否更好还是更混沌。
