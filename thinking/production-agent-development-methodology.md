# 如何设计、开发一个生产级 Agent

## 核心论点

2025-2026 年，OpenAI、Anthropic、LangChain/LangGraph 对 Agent 的理解正在从：

```text
prompt + tools + memory
```

转向：

```text
controlled runtime
  + engineered context
  + explicit action boundary
  + trace-native eval loop
  + human-gated production control plane
```

也就是说，一个好 Agent 不是“模型更聪明一点、prompt 更长一点、tools 更多一点”。真正决定生产表现的是：

```text
它承诺什么行为；
它能采取哪些动作；
它每一步看到什么上下文；
它如何使用工具；
它失败后能否复现；
它改进后能否证明；
它上线后能否被观测、暂停、审批、回滚和继续学习。
```

一个更硬的定义是：

```text
Good Agent
  = narrow behavior contract
  + explicit action boundary
  + engineered context
  + constrained tool / skill interface
  + traceable runtime
  + human-gated side effects
  + regression-backed learning loop
  + production telemetry
```

这篇不是介绍“怎么调用某个 SDK”。它试图回答一个更上层的问题：

> 如何让 Agent 的开发过程可控、灵活，同时让最终上线的 Agent 在真实生产环境中效果好？

---

## 资料边界

这篇综合的是截至 2026-06-28 的一手资料，重点来自：

- OpenAI：Responses API、Agents SDK、Codex harness、trace grading、agent evals、Agent Improvement Loop、Macro Evals、Symphony。
- Anthropic：Claude Code、Managed Agents、context engineering、tool design、Agent Skills、long-running harness、agent evals、auto mode、agent autonomy telemetry。
- LangChain / LangGraph / LangSmith：LangGraph runtime、Deep Agents、Ambient Agents、context engineering、trajectory evals、observability、interrupts、persistence、Agent Inbox / Fleet oversight。

这里不把第三方观点当主证据。第三方文章可以启发语言，但不承担结论。

---

## 1. Agent 首先是 Runtime，不是 Prompt

OpenAI 的 current stack 已经很清楚：简单 agentic primitive 走 Responses API；当应用需要管理 orchestration、state、approval、handoff 和 tracing 时，进入 Agents SDK。LangGraph 的方向类似：把 Agent 建模成 state graph、node、edge、checkpoint、interrupt 和 task queue。Anthropic 的 Managed Agents 更进一步，把 session、harness、sandbox 拆开，提出“brain”和“hands”的解耦。

这说明一件事：

```text
Agent 的核心不是 prompt，
而是一个持续运行的受控状态机。
```

Prompt 只是其中一个输入面。一个生产级 Agent 至少还包括：

```text
runtime loop
state model
tool dispatcher
permission policy
context assembler
memory writer / reader
trace emitter
human approval gate
eval runner
rollback / repair path
```

如果这些东西没有显式设计，Agent 的行为就会被隐式 prompt、临时工具、聊天上下文和人的记忆共同决定。这种系统可以 demo，但很难生产化。

### 实践判断

如果一个 Agent 的关键行为只能通过“读懂 system prompt”来解释，而不能通过 runtime state、tool policy、trace 和 eval 复现，那么它还不是生产级 Agent。

---

## 2. 三条闭环

开发一个好 Agent，可以拆成三条闭环。

### 2.1 Design Loop

```text
behavior contract
  -> action boundary
  -> context policy
  -> tool / skill interface
  -> runtime topology
```

这条闭环回答：

```text
Agent 应该做什么？
不应该做什么？
遇到不确定性怎么处理？
可以调用什么工具？
哪些动作必须停下来问人？
每一步应该看到什么上下文？
```

Design Loop 的目标不是把 Agent 写死，而是把灵活性放在正确位置：

- 模型负责不确定判断；
- deterministic code 负责状态、权限、恢复、审批、日志；
- eval/harness 负责证明和回归。

### 2.2 Evidence Loop

```text
trace
  -> label / review
  -> eval dataset
  -> regression
  -> release gate
```

这条闭环回答：

```text
Agent 为什么被认为变好了？
失败能否复现？
修复是否防止复发？
release claim 是否有证据支撑？
```

OpenAI 的 Agent Improvement Loop、LangSmith trajectory evals、Anthropic agent evals 都指向同一件事：Agent 不能只评 final answer，必须评 trajectory。

### 2.3 Production Loop

```text
runtime state
  -> observability
  -> human approval
  -> memory update
  -> rollback / repair
```

这条闭环回答：

```text
上线后出了问题能不能看见？
高风险动作能不能停住？
生产失败能不能回流成 eval？
memory 会不会污染未来行为？
```

生产 Agent 的质量，不来自上线前一次性调参，而来自这条长期闭环。

---

## 3. Behavior Contract：Agent 的最小设计单元

Agent 开发的最小单位不应该是 prompt，也不应该是 tool，而应该是：

```text
behavior contract
```

一个 behavior contract 至少包括：

```yaml
id: cap.issue_triage.basic
user: "repo maintainer"
task: "triage GitHub issues"
can_do:
  - read issue body, labels, linked PRs, and recent repo context
  - suggest labels with evidence
  - draft a reply
cannot_do:
  - close issue
  - assign reviewer
  - push commits
must_escalate:
  - security vulnerability
  - user data exposure
  - ambiguous ownership
success:
  - correct label
  - cited evidence
  - no unsafe external write
evidence:
  - eval.issue_triage.v3
  - trace.live_review.2026-06-18
```

这比“做一个 issue triage agent”硬得多。

它把 Agent 的开发对象从一个模糊功能，变成一组可测试、可审批、可回归的行为承诺。

### 为什么这重要

没有 behavior contract，就会出现三个问题：

1. Prompt 改动没有锚点；
2. Eval 不知道该评什么；
3. Release note 很容易夸大能力。

生产级 Agent 必须能回答：

```text
哪个 claim 被哪个 trace 支撑？
哪个 failure 改变了哪个 claim？
哪个 release promise 来自哪个 evidence？
```

---

## 4. Action Boundary：能力来自动作边界，而不是工具数量

很多 Agent 项目的直觉是“多接工具，Agent 就更强”。2025-2026 的资料给出的结论更谨慎：

```text
工具越多，action space 越大；
action space 越大，错误代价和评估难度越高。
```

OpenAI 的 guardrails / approvals、Anthropic 的 sandboxing / auto mode、LangGraph interrupts、AWS AgentCore policy 都指向同一原则：

> Tool access 必须被 deterministic policy 包住。

一个生产级 Agent 的 tool policy 不应该只是 allowlist，而应该至少包含：

```yaml
tools:
  search_docs:
    side_effect: none
    approval: never
    logging: required
  create_github_issue:
    side_effect: external_write
    approval: required
    allowed_targets:
      - sandbox
      - staging
  refund_payment:
    side_effect: financial
    approval: required
    allowed_targets:
      - sandbox
    production: forbidden
```

### 2026 的新信号

Anthropic 的 Claude Code auto mode 不是简单“跳过权限提示”，而是尝试用分类器区分安全动作与危险动作。这个方向说明：human-in-the-loop 不是永远弹窗，而是要从粗糙 permission prompt 进化成分层控制系统。

```text
low-risk deterministic action -> auto
medium-risk reversible action -> logged / sampled review
high-risk external side effect -> interrupt / approval
irreversible or regulated action -> explicit human gate
```

这比“全自动”或“全手动”都更像生产系统。

---

## 5. Context Engineering：每一步给模型什么

LangChain 把 context engineering 拆成：

```text
write
select
compress
isolate
```

Anthropic 也强调 context 是有限资源，不是越多越好。OpenAI 的 memory/compaction cookbook、Codex agent loop、long-running agent harness 都在处理同一个问题：

```text
Agent 运行越久，上下文越容易变成垃圾场。
```

生产 Agent 需要显式 context policy：

```yaml
context_policy:
  always_include:
    - behavior contract
    - current task
    - current permissions
  retrieve_on_demand:
    - prior traces
    - repo docs
    - customer history
  compress:
    - long tool outputs
    - old conversation turns
    - repeated logs
  isolate:
    - subagent scratchpads
    - untrusted tool output
    - private user data
  never_include:
    - secrets
    - raw production trace with PII
```

### 一个重要区别

Prompt engineering 问：

```text
system prompt 怎么写？
```

Context engineering 问：

```text
在 agent trajectory 的第 N 步，模型应该看到哪些事实、工具、记忆、约束和证据？
```

后者才是生产 Agent 的主问题。

---

## 6. Memory：持久状态不是聊天历史

LangGraph 区分 checkpointer 和 store：前者服务 thread continuity，后者服务跨 thread 长期记忆。Google Agent Platform 也区分 session、event、state、memory。LangChain 2026 的 memory 文章强调从 traces 派生 durable context，而不是把历史隐藏进 prompt。

Agent memory 至少应该分层：

```text
session state       当前 run / 当前 thread 的短期状态
working memory      当前任务内的中间计划、待办、约束
episodic memory     过去 trace / failure / user correction
semantic memory     用户偏好、领域事实、组织规则
policy memory       不应被模型自由改写的规则
```

生产风险在于：

```text
memory 一旦写错，会改变未来行为。
```

所以 memory 需要：

- schema；
- write policy；
- retention policy；
- human-edit path；
- deletion / tombstone；
- eval coverage；
- drift audit。

### 实践判断

如果 memory 无法回答“谁写入、为什么写入、何时过期、是否影响了哪个失败”，它就不是工程 memory，而是隐式 prompt 污染。

---

## 7. Tool / Skill 是能力接口

Anthropic 的 tool-writing 文章和 Agent Skills，OpenAI 的 Skills eval，SWE-agent 对 agent-computer interface 的经验，都说明：

```text
工具接口本身就是 Agent 能力的一部分。
```

一个好 tool 不只是函数：

```text
name
description
schema
side_effect
latency / cost
output format
failure modes
permission level
examples
eval cases
```

### 工具设计的几个原则

1. **工具名要可发现**  
   模型靠 name/description 决定是否调用。模糊名字会导致漏调或误调。

2. **输出要面向 Agent 消费**  
   不要把 5000 行 JSON 直接塞回模型。工具应该返回摘要、关键字段、下一步建议和原始引用。

3. **大工具库要可搜索，不要全量注入**  
   Anthropic 的 advanced tool use 和 code execution with MCP 都指向 tool discovery / programmatic tool calling：工具多时，预加载所有 schema 会拖垮上下文。

4. **skill 要可测试**  
   OpenAI 的 skill eval 思路是：prompt -> trace/artifacts -> checks -> score。Skill 不是“说明书”，而是可触发、可运行、可回归的工作流单元。

---

## 8. Runtime Topology：从单 Agent 到 Deep / Ambient / Managed

不要一开始就上 multi-agent。OpenAI 和 Anthropic 都倾向于先用简单 workflow，复杂度真的需要时再拆。

可以把 runtime topology 分成几层：

```text
L0 single model call
L1 single agent loop with tools
L2 workflow + agent islands
L3 graph/state runtime with checkpoints
L4 long-running deep agent
L5 ambient/background agent with inbox
L6 managed agents: session / harness / sandbox decoupled
```

### Deep Agent

LangChain 的 Deep Agents 指长时间、多步骤、有计划、有文件系统/子任务/上下文管理的 agent。它不是“更会聊天”，而是更像一个能维护外部工作区的长任务执行者。

Deep Agent 需要：

- plan tool；
- durable scratchpad；
- file / artifact workspace；
- subagent isolation；
- checkpoint；
- compaction；
- resume；
- eval over trajectory。

### Ambient Agent

Ambient Agent 不再只是被用户一句话触发，而是在后台监听事件、处理任务，并通过 inbox 请求人类确认。

它需要：

- event source；
- task queue；
- notification；
- inbox；
- approval / edit / reject；
- audit log；
- stale task cleanup。

Ambient Agent 的 UX 不再是 chat，而是“持续工作的代理 + 人类审核队列”。

### Managed Agent

Anthropic 的 Managed Agents 关键是解耦：

```text
brain    model reasoning
hands    sandbox / tools / computer
session  long-running task state
harness  orchestration and policy
```

这个方向说明：未来 Agent 系统的稳定接口可能不是某个 prompt，而是 session、sandbox、tool protocol、trace 和 resume contract。

---

## 9. Eval：从 Output Eval 到 Trace-Native Eval

Agent eval 和普通 LLM eval 的区别在于：

```text
Agent 错误常常发生在过程里，不在最终答案里。
```

一个 Agent 可能最终答案看起来对，但过程中：

- 调用了不该调用的工具；
- 读了不该读的数据；
- 跳过了 approval；
- 写入了错误 memory；
- 进行了过多无效重试；
- 在不确定时没有澄清；
- 把 untrusted tool output 当成 instruction。

所以 eval 要看 trajectory：

```text
messages
tool calls
tool args
tool outputs
handoffs
guardrail events
state changes
memory writes
human interrupts
cost / latency
final output
```

### Eval 分层

```text
unit checks          tool schema、parser、policy wrapper
smoke eval           能否完整跑通
trajectory eval      tool sequence、handoff、approval、state
capability eval      claim 是否成立
regression eval      历史 failure 是否复发
macro eval           整个 agentic system 的系统性问题
production eval      真实 trace、抽样、人类标注、线上指标
```

OpenAI 的 Macro Evals 很重要：它提醒我们，agentic system 的失败常常不是单个 response，而是跨许多 traces 的系统模式：

```text
handoff too late
review triggered for wrong cases
specialist misses same signal
policy gate fires too often or too late
```

这类问题不能只靠单例 eval 发现。

---

## 10. LLM Judge 可以用，但不能当真理

OpenAI evaluation best practices、LangSmith eval concepts、Anthropic evals 都承认 LLM-as-judge 有用，但必须校准。

生产级使用方式应该是：

```text
deterministic checks first
LLM judge for fuzzy criteria
human labels for calibration
pairwise / classification preferred over open-ended scoring
periodic drift audit
```

不要只留一个：

```text
score: 8/10
```

更好的输出是：

```yaml
verdict: fail
failure_category: unsafe_tool_use
evidence:
  - "called create_issue before approval"
  - "approval_policy.yaml requires approval for external_write"
severity: critical
requires_regression: true
```

Judge 的价值不是给分，而是帮助把 trace 变成可行动的 failure label。

---

## 11. Infrastructure Noise 也是 Agent 质量问题

Anthropic 的 infrastructure noise 文章很关键：Agent eval 分数可能因为 infra headroom、pod kill、latency、环境抖动而变化。

这对 Agent 开发有一个直接含义：

```text
不要把所有 eval 波动都解释成模型或 prompt 的变化。
```

每次 eval 应该记录：

```text
model
prompt bundle
tool versions
runtime version
sandbox image
resource limits
latency
timeout
retry policy
external service status
grader version
dataset version
```

否则你不知道一个 regression 是：

- Agent 变差了；
- eval 变了；
- grader 变了；
- tool 变了；
- infra 变了；
- model route 变了。

生产 Agent 的 evidence ledger 必须包含 infra context。

---

## 12. Production Control Plane

上线后的 Agent 不应该只是“API endpoint”。它需要 control plane。

最小 control plane 包括：

```text
trace viewer
run state
tool call log
approval queue
feedback capture
memory editor
eval dashboard
release gate
rollback path
cost / latency monitor
security alerts
```

LangSmith 的 observability + feedback、OpenAI tracing/trace grading、Anthropic autonomy telemetry 都说明：生产 Agent 的核心指标不能只有 success rate。

更合理的指标包括：

```text
task completion rate
unsafe action rate
approval request rate
approval rejection rate
human correction rate
escalation rate
regression recurrence rate
tool error rate
memory write error rate
latency
cost per successful task
tail turn duration
auto-approve rate
interrupt rate
```

### 一个判断

如果一个 Agent 上线后没有 trace、没有人工反馈通道、没有 approval/reject 统计、没有 failure-to-eval 回流，它就不是生产系统，只是部署了一个 demo。

---

## 13. 开发顺序

综合这些资料，我会把 Agent 开发顺序定为：

### Step 1：定义任务域和错误代价

```text
用户是谁？
任务是什么？
错误代价是什么？
哪些动作不可逆？
哪些动作只允许草稿？
哪些场景必须拒绝或升级？
```

### Step 2：写 Behavior Contract

不是写“Agent 会什么”，而是写：

```text
能做什么；
不能做什么；
必须问人的是什么；
成功标准是什么；
证据在哪里。
```

### Step 3：设计 Action Space

先设计工具和权限，而不是先写 prompt。

```text
read tools
write tools
external side-effect tools
approval-required tools
forbidden tools
```

### Step 4：设计 Context / Memory Policy

```text
哪些上下文 always include？
哪些按需 retrieve？
哪些压缩？
哪些隔离？
哪些永不进入上下文？
哪些 memory 可以写？
谁能改 memory？
```

### Step 5：实现最薄 vertical slice

先跑通一条真实任务链：

```text
input -> context -> tool -> decision -> trace -> eval -> output
```

不要一开始做多 agent、长期 memory、复杂 planner。

### Step 6：建立 Trace-first Eval

第一批 eval 不要追求大而全，而要能回答：

```text
是否调用了正确工具？
是否越权？
是否在不确定时澄清？
是否写了错误 memory？
是否能复现历史 failure？
```

### Step 7：用 Failure 驱动迭代

每个重要 failure 要进入：

```text
failure-analysis
  -> root cause
  -> fix
  -> regression
  -> evidence update
```

不要只改 prompt。

### Step 8：扩大到 Long-running / Deep / Ambient

只有当单轮/短流程稳定后，再引入：

- checkpoint；
- resume；
- inbox；
- subagents；
- durable memory；
- background event processing；
- managed sandbox。

### Step 9：上线后持续学习

生产 trace 不是日志垃圾，而是下一轮 eval dataset 的来源。

```text
production trace
  -> human feedback
  -> labeled dataset
  -> regression suite
  -> harness change
  -> release gate
```

---

## 14. Repo 里的落点

如果把这套方法落到前一篇 `agent-development-repo-structure.md`，对应关系是：

```text
behavior contract         -> lab/research/claims.yaml, CAPABILITIES.md
action boundary           -> lab/infra/permissions/, lab/code/configs/tool/
context policy            -> lab/code/configs/prompt/, memory/
tool / skill interface    -> lab/code/src/*/tools/, skills or scripts
runtime topology          -> lab/code/src/*/runtime/, orchestration/
trace-native eval         -> lab/code/benchmarks/, lab/runs/, lab/artifacts/
failure loop              -> lab/research/failure-analysis.md, regression-matrix.yaml
production control plane  -> deliverables/release/, memory/bridge/, observability docs
```

也就是说，那个 repo structure 不是“文件夹模板”，而是为了支持这套开发方法。

---

## 15. 需要警惕的反模式

### 反模式 1：Prompt-first

先写一个大 prompt，再不断补规则。

问题：行为边界、工具权限、eval 标准都被埋在自然语言里。

### 反模式 2：Tool-maxing

接入大量工具，认为 Agent 自己会选择。

问题：action space 爆炸，tool selection 和 safety 都变难。

### 反模式 3：Final-answer eval

只评最终回答。

问题：过程里的越权、错 tool、错 memory、错 handoff 全都漏掉。

### 反模式 4：Memory hoarding

把所有历史都塞进 memory。

问题：旧事实污染未来行为，且很难解释为什么 Agent 做了某个决定。

### 反模式 5：No human gate

一开始追求全自动。

问题：真实生产里，关键风险通常来自少数高副作用动作。

### 反模式 6：Benchmark worship

只看 aggregate score。

问题：Agent 的真实问题常常是分布尾部、长流程、工具失败、审批边界和 infra noise。

---

## 16. 我的判断

2026 年 Agent 开发的主线，不是“更强模型自动解决一切”，而是：

```text
模型能力上升以后，
工程问题从生成能力转向治理能力。
```

Agent 越强，越需要：

- 更清晰的 action boundary；
- 更严肃的 trace；
- 更好的 context/memory policy；
- 更可靠的 eval；
- 更可审计的 release gate；
- 更细粒度的 human approval；
- 更强的 runtime / sandbox / checkpoint。

所以，一个好的 Agent 开发方法，不是把模型关得越死越好，也不是把一切交给模型。

它应该是：

```text
让模型在高价值、不确定、需要判断的地方发挥弹性；
让代码、策略、工具、trace、eval 和人类审批在高风险、可定义、可验证的地方提供硬边界。
```

这就是我现在对“设计、开发一个好 Agent”的定义：

> Agent engineering = 在真实任务分布中，把模型判断力放进一个可观测、可回放、可审批、可持续改进的行为系统。

---

## 参考资料

### OpenAI

- [Migrate to the Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses)
- [Agents SDK](https://developers.openai.com/api/docs/guides/agents)
- [Running agents](https://developers.openai.com/api/docs/guides/agents/running-agents)
- [Integrations and observability](https://developers.openai.com/api/docs/guides/agents/integrations-observability)
- [Guardrails and human review](https://developers.openai.com/api/docs/guides/agents/guardrails-approvals)
- [Trace grading](https://developers.openai.com/api/docs/guides/trace-grading)
- [Evaluate agent workflows](https://developers.openai.com/api/docs/guides/agent-evals)
- [Build an Agent Improvement Loop with Traces, Evals, and Codex](https://developers.openai.com/cookbook/examples/agents_sdk/agent_improvement_loop)
- [Build iterative repair loops with Codex](https://developers.openai.com/cookbook/examples/codex/build_iterative_repair_loops_with_codex)
- [Macro Evals for Agentic Systems](https://developers.openai.com/cookbook/examples/partners/macro_evals_for_agentic_systems/macro_evals_for_agentic_systems)
- [Testing Agent Skills Systematically with Evals](https://developers.openai.com/blog/eval-skills)
- [Unrolling the Codex agent loop](https://openai.com/index/unrolling-the-codex-agent-loop/)
- [Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/)
- [An open-source spec for Codex orchestration: Symphony](https://openai.com/index/open-source-codex-orchestration-symphony/)
- [The next evolution of the Agents SDK](https://openai.com/index/the-next-evolution-of-the-agents-sdk/)

### Anthropic

- [The "think" tool](https://www.anthropic.com/engineering/claude-think-tool)
- [Claude Code: Best practices for agentic coding](https://code.claude.com/docs/en/best-practices)
- [How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system)
- [Writing effective tools for AI agents](https://www.anthropic.com/engineering/writing-tools-for-agents)
- [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)
- [Making Claude Code more secure and autonomous with sandboxing](https://www.anthropic.com/engineering/claude-code-sandboxing)
- [Code execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp)
- [Introducing advanced tool use](https://www.anthropic.com/engineering/advanced-tool-use)
- [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)
- [Quantifying infrastructure noise in agentic coding evals](https://www.anthropic.com/engineering/infrastructure-noise)
- [Measuring AI agent autonomy in practice](https://www.anthropic.com/research/measuring-agent-autonomy)
- [How we built Claude Code auto mode](https://www.anthropic.com/engineering/claude-code-auto-mode)
- [Scaling Managed Agents](https://www.anthropic.com/engineering/managed-agents)

### LangChain / LangGraph / LangSmith

- [Introducing ambient agents](https://www.langchain.com/blog/introducing-ambient-agents)
- [LangGraph Platform is now Generally Available](https://www.langchain.com/blog/langgraph-platform-ga)
- [Context Engineering](https://www.langchain.com/blog/context-engineering-for-agents)
- [Deep Agents](https://www.langchain.com/blog/deep-agents)
- [Building LangGraph](https://www.langchain.com/blog/building-langgraph)
- [LangChain and LangGraph Agent Frameworks Reach v1.0 Milestones](https://www.langchain.com/blog/langchain-langgraph-1dot0)
- [How we build evals for Deep Agents](https://www.langchain.com/blog/how-we-build-evals-for-deep-agents)
- [Agent observability needs feedback to power learning](https://www.langchain.com/blog/agent-observability-needs-feedback-to-power-learning)
- [How To Give Your Agent Memory](https://www.langchain.com/blog/how-to-give-your-agent-memory)
- [Prompt Caching with Deep Agents](https://www.langchain.com/blog/deep-agents-prompt-caching)
- [LangSmith observability concepts](https://docs.langchain.com/langsmith/observability-concepts)
- [Trajectory evaluations](https://docs.langchain.com/langsmith/trajectory-evals)
- [LangGraph interrupts](https://docs.langchain.com/oss/python/langgraph/interrupts)
- [LangGraph persistence](https://docs.langchain.com/oss/python/langgraph/persistence)
- [LangSmith access & oversight](https://docs.langchain.com/langsmith/fleet/access-and-oversight)
