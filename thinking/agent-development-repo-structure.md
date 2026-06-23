# 开发 Agent 时，一个合适的 Repo 应该长什么样

## 核心论点

开发一个 Agent 时，repo 不应该只是普通代码仓库。

它更应该被设计成：

```text
agent repo
  = agent target
  + development harness
  + evaluation memory
```

其中：

- **agent target** 是真正要交付的 Agent：runtime、tools、prompts、policies、orchestration、memory schema；
- **development harness** 是让人类和 Agent 能持续、安全、可验证地改进这个 Agent 的工程控制系统；
- **evaluation memory** 是围绕能力、失败、trace、eval、decision 持续积累的项目记忆。

一句话：

> 一个好的 Agent repo，不只是存放 Agent，而是让 Agent 的能力边界、失败记录、评估证据和改进路径都能被追踪、验证和接续。

这延续了 [Target 与 Harness：AI Agent 时代的仓库边界](./target-and-harness-in-agent-first-repos.md) 的判断：

```text
repo = target + harness
```

也借用了 [Agent-Native 科研项目结构](./agent-native-research-project-structure.md) 中的 `memory/` 思路：把项目推进状态放进 repo，而不是散落在聊天记录、人脑和临时日志里。

---

## 1. 为什么普通代码仓库不够

普通应用 repo 通常围绕产物组织：

```text
src/
tests/
docs/
scripts/
```

这对传统软件足够，但对 Agent 不够。

因为 Agent 的质量不只取决于代码能不能跑，还取决于：

```text
它能完成哪些任务？
它不能完成哪些任务？
它在哪些场景下会自信地错？
它为什么选择某个 tool？
它的 prompt / policy 改动是否真的提高了能力？
一次失败应该沉淀成 eval、trace、policy，还是 tool fix？
```

如果这些信息不进 repo，Agent 开发就会退化成 prompt 手工作坊：

- 这次调好了，下次不知道为什么又坏了；
- 某个失败只存在于一次 chat transcript；
- prompt 改动没有回归测试；
- tool routing 改了，但没有 trace replay；
- 人类记得某个能力边界，但 Agent 和后续维护者不知道；
- 每次接手都要重新问“这个 Agent 到底现在能干什么”。

所以 Agent repo 必须同时记录三类东西：

```text
implementation      Agent 如何运行
evaluation          Agent 是否有效
development memory  Agent 如何被持续改进
```

---

## 2. 推荐目录结构

一个较完整的 Agent repo 可以长这样：

```text
my-agent/
  README.md
  AGENTS.md
  SPEC.md
  ARCHITECTURE.md
  DECISIONS.md

  agent/
    core/
    runtime/
    orchestration/
    tools/
    prompts/
    policies/
    memory/

  skills/
    search/
    summarize/
    code-review/
    report-writing/

  evals/
    README.md
    datasets/
    cases/
    graders/
    rubrics/
    regression/
    reports/

  traces/
    examples/
    failures/
    replay/

  memory/
    current-status.md
    phase-dashboard.yaml
    phase-dashboard.md
    boards/
      hypotheses.yaml
      capabilities.yaml
      evals.yaml
      traces.yaml
      risks.yaml
      actions.yaml
      decisions.yaml
      handoffs.yaml
    reports/

  experiments/
    E001-baseline/
    E002-tool-routing/
    E003-memory-policy/

  tests/
    unit/
    integration/
    golden/

  scripts/
    run-agent.sh
    run-evals.sh
    replay-trace.sh
    validate-harness.py
    render-dashboard.py

  docs/
    usage.md
    deployment.md
    threat-model.md
    troubleshooting.md

  .github/
    workflows/
      test.yml
      eval.yml
```

这不是第一天必须全部建完的模板，而是说明一个成熟 Agent repo 应该同时有：

- 可运行的 Agent；
- 可复用的 skills；
- 可回归的 evals；
- 可复盘的 traces；
- 可接续的 development memory；
- 可验证的 scripts / tests / CI。

---

## 3. 顶层文件：给人和 Agent 的入口

### README.md

面向使用者，回答：

```text
这个 Agent 是什么？
解决什么问题？
怎么运行？
当前能力边界是什么？
```

README 不应该只写安装方式。对 Agent 项目来说，README 还应该明确：

- 主要使用场景；
- 不适用场景；
- 安全边界；
- 当前 eval 概况；
- 已知失败类型。

### AGENTS.md

面向开发 Agent 的 Agent，回答：

```text
进入这个 repo 后先读哪里？
哪些目录是 target？
哪些目录是 harness？
改 prompt / tool / policy 后必须跑什么检查？
失败 trace 应该写回哪里？
哪些决策必须 human review？
```

`AGENTS.md` 应该是地图，不是百科全书。它的价值在于固定读取顺序和写回规则。

### SPEC.md

定义 Agent 的目标，不定义所有实现细节。

至少回答：

- Agent 的使命；
- 用户输入和输出；
- 关键能力；
- 不做什么；
- 成功标准；
- 约束和安全边界。

### ARCHITECTURE.md

定义 Agent 的内部结构。

重点不是画漂亮图，而是说清楚：

- runtime loop；
- tool abstraction；
- prompt / policy layering；
- memory model；
- orchestration flow；
- error handling；
- logging / trace capture；
- eval integration。

### DECISIONS.md

记录关键决策。

Agent 项目很容易出现“今天改 prompt、明天换 tool、后天改 memory policy”的频繁漂移。没有 decision log，三周后就没人知道为什么某个约束存在。

---

## 4. agent/：真正的 Agent Target

`agent/` 是最终要交付的对象。

建议按 Agent 的运行结构组织，而不是按技术框架随意堆文件：

```text
agent/
  core/             # domain model, task objects, shared types
  runtime/          # main loop, session lifecycle, execution state
  orchestration/    # planner / executor / reviewer / router
  tools/            # tool adapters and MCP wrappers
  prompts/          # prompt modules, system instructions, examples
  policies/         # safety, permissions, routing, escalation rules
  memory/           # runtime memory schema, migrations, fixtures
```

几个原则：

1. **prompt 也是代码。** prompt 应该版本化、可 review、可测试，不要只藏在某个 SaaS 配置里。
2. **policy 和 prompt 分开。** prompt 负责引导，policy 负责边界；安全、权限、human gate 不应该只靠措辞维持。
3. **tool adapter 要薄。** tool 的真实行为、权限边界和失败模式要被文档和测试覆盖。
4. **runtime memory 不等于 project memory。** 如果 Agent 的真实记忆在数据库、向量库或外部服务里，repo 里应该存 schema、fixture、migration 和脱敏样例，而不是提交真实私密数据。

---

## 5. evals/：Agent Repo 的核心 Harness

对 Agent 来说，`evals/` 不是附属品，而是核心。

没有 evals，Agent 开发无法区分：

```text
这次改动真的变好了
只是这个 demo 看起来更顺了
只是 prompt 输出更会自夸了
```

推荐结构：

```text
evals/
  README.md
  datasets/
  cases/
  graders/
  rubrics/
  regression/
  reports/
```

### cases/

存放具体评估用例。

每个 case 最好有：

- 输入；
- 期望行为；
- 不接受行为；
- 所需 tools；
- 评估方式；
- 对应能力 ID；
- 对应风险 ID。

### rubrics/

定义“好”的标准。

Agent 很多输出不能只用 pass/fail 判断，需要 rubric：

```text
correctness
completeness
grounding
tool use
safety
format
user value
```

### graders/

放自动评估器。

grader 可以是：

- deterministic checker；
- schema validator；
- unit test；
- golden comparison；
- LLM-as-judge；
- human review form。

其中 deterministic checker 优先，LLM-as-judge 必须有校准样例和失败记录。

### regression/

放历史失败变成的回归用例。

这是 evals 最重要的部分。每次发现 Agent 犯了有代表性的错误，都应该问：

```text
这是一次性失败，还是应该变成 regression case？
```

### reports/

保存评估报告。

不要只看最新分数。Agent 项目需要趋势：

- 哪些能力在变好；
- 哪些能力被 prompt 改动破坏；
- 哪些失败反复出现；
- 哪些 eval 已经过时。

---

## 6. traces/：把失败变成训练材料

`traces/` 记录真实交互。

推荐结构：

```text
traces/
  examples/
  failures/
  replay/
```

### examples/

保存高质量成功样例。

这些样例可以用于：

- few-shot prompt；
- docs；
- eval fixture；
- onboarding；
- regression baseline。

### failures/

保存代表性失败。

失败 trace 应该记录：

```text
task
input
agent output
tool calls
observed failure
root cause hypothesis
linked eval case
linked fix action
```

关键是不要只写“失败了”，而要写清楚失败应该流向哪里：

```text
prompt fix?
tool fix?
policy fix?
eval gap?
human gate?
out of scope?
```

### replay/

保存可重放 trace 或重放脚本。

Agent 开发最怕“当时坏了，现在复现不了”。可 replay 的 trace 能把失败变成工程对象。

---

## 7. memory/：开发项目的 Repo-Native Memory

这里的 `memory/` 不是 Agent 的 runtime memory，而是开发这个 Agent 的项目管理 memory。

它回答：

```text
这个 Agent 当前处于什么阶段？
我们认为它有哪些能力？
哪些能力还只是 hypothesis？
哪些 eval 支持这些能力？
哪些失败最危险？
下一步 action 是什么？
哪些决策已经做出？
handoff 给下一个 Agent 时应该知道什么？
```

推荐结构：

```text
memory/
  current-status.md
  phase-dashboard.yaml
  phase-dashboard.md
  boards/
    hypotheses.yaml
    capabilities.yaml
    evals.yaml
    traces.yaml
    risks.yaml
    actions.yaml
    decisions.yaml
    handoffs.yaml
  reports/
    weekly-review-YYYY-MM-DD.md
    readiness-review-YYYY-MM-DD.md
```

### current-status.md

Agent 进入项目时第二个要读的文件，排在 `AGENTS.md` 后面。

它应该短，回答：

- 当前阶段；
- 当前目标；
- 最近完成了什么；
- 当前阻塞；
- 必须注意的风险；
- 下一步建议。

### phase-dashboard.yaml / phase-dashboard.md

`yaml` 是机器可验证状态，`md` 是人类可读投影。

例如：

```yaml
active_phase: eval_hardening
next_gate: regression_suite_green
open_actions: 7
high_risks: 2
last_eval_report: evals/reports/2026-06-23.md
```

### boards/hypotheses.yaml

记录尚未完全证明的能力假设。

例如：

```yaml
- id: HYP-004
  claim: "The agent can safely summarize long research traces without losing blocking risks."
  status: partial
  evidence:
    - evals/reports/2026-06-20.md
  risk:
    - RSK-003
  next_action: ACT-012
```

### boards/capabilities.yaml

记录已支持、部分支持、暂不支持的能力。

这比 README 里的“功能列表”更重要，因为它需要绑定 eval evidence：

```text
Capability -> Eval -> Trace -> Risk -> Next Action
```

### boards/risks.yaml

记录 Agent 的风险，不只是项目管理风险。

例如：

- hallucinated citations；
- unsafe tool call；
- context loss after compaction；
- overconfident self-evaluation；
- prompt regression；
- hidden dependency on one model。

### boards/actions.yaml

action 不应该是孤立 todo，而应该连接到 capability、risk、eval 或 trace。

例如：

```yaml
- id: ACT-019
  title: "Add regression case for failed tool-routing trace T-008"
  source_trace: traces/failures/T-008.md
  related_risk: RSK-002
  target_eval: evals/regression/tool-routing.yaml
```

### boards/decisions.yaml

记录关键设计决策。

例如：

- 为什么选择某个 memory policy；
- 为什么禁用某个 tool；
- 为什么某类任务必须 human gate；
- 为什么某个 eval 暂时不自动化。

### boards/handoffs.yaml

让下一个 Agent 或未来的自己快速接手。

handoff 应该包含：

- 上次做到哪里；
- 哪些文件刚改过；
- 哪些检查已跑；
- 哪些检查还没跑；
- 哪些假设不能当事实；
- 下一步最小动作。

---

## 8. experiments/：把 Agent 改动当实验

Agent 项目里的很多改动都不是普通 feature，而是实验：

- prompt 改写；
- tool routing 策略；
- memory policy；
- evaluator 选择；
- model routing；
- planner / executor 分离；
- trace replay 策略。

这些应该进 `experiments/`：

```text
experiments/
  E001-baseline/
    experiment-card.md
    config.yaml
    result-summary.md
    linked-evals.yaml

  E002-tool-routing/
    experiment-card.md
    config.yaml
    result-summary.md
    linked-traces.yaml
```

每个 experiment 至少回答：

```text
改了什么？
为什么改？
预期提升什么能力？
用哪些 eval 判断？
结果如何？
是否进入主线？
是否产生新风险？
```

这样 prompt engineering 才从“凭感觉调参”变成可复盘实验。

---

## 9. skills/：可复用工作流，不要全塞进 Agent

如果某个能力只服务当前 Agent 的核心行为，放在 `agent/`。

如果某个能力是可跨 Agent 复用的工作流，放在 `skills/`。

例如：

```text
skills/
  search/
  summarize/
  code-review/
  report-writing/
```

这对应 [Harness 与 Skills：个人 Agent 系统的二维设计](./harness-and-skills-two-dimensional-agent-design.md)：

```text
Harness 负责横向一致性；
Skills 负责纵向复用性。
```

实践规则：

```text
第一次：写在当前 Agent 的 prompt / workflow 里。
第二次：复制到另一个场景时，标记为可能复用。
第三次：抽象成 skill。
```

避免过早抽象，也避免每个 Agent 重复造同一个流程。

---

## 10. tests/ 与 evals/ 的区别

`tests/` 验证代码行为。

`evals/` 验证 Agent 能力。

二者都需要，但不要混为一谈。

```text
tests/
  unit/          函数、adapter、parser、policy helper
  integration/   runtime + tool + storage
  golden/        stable formatting / deterministic outputs

evals/
  cases/         end-to-end agent task
  graders/       capability-level evaluation
  regression/    historical failures
```

测试回答：

```text
这个函数 / 模块 / adapter 是否按预期工作？
```

评估回答：

```text
这个 Agent 在真实任务上是否可靠地产生了有价值的行为？
```

Agent repo 的常见错误是只有 tests，没有 evals。这样只能证明代码没有坏，不能证明 Agent 有用。

---

## 11. Agent 进入项目时如何读

一个开发 Agent 不应该一进 repo 就读全部文件。

推荐 progressive disclosure：

```text
AGENTS.md
  -> memory/current-status.md
  -> memory/phase-dashboard.md
  -> relevant boards
  -> SPEC.md / ARCHITECTURE.md
  -> relevant agent/ files
  -> relevant evals/ and traces/
```

这个顺序让 Agent 先知道：

```text
我应该做什么？
项目现在处于什么状态？
哪些能力和风险相关？
哪些文件才需要深入读取？
完成后要写回哪里？
```

而不是先陷入 runtime、prompt、trace、eval 报告的细节海洋。

---

## 12. Agent 离开项目时如何写回

每次 Agent 开发任务结束后，必须写回。

推荐 epilogue：

```text
After each agent-development task:
1. update touched implementation files
2. update or add tests / evals
3. preserve meaningful failure traces
4. link trace -> risk -> action -> eval
5. record decisions or open questions
6. update memory/current-status.md
7. run relevant validators / evals
8. produce next-step briefing
```

如果一次失败没有写回，它就只存在于 transcript。

如果一次成功没有 eval，它就只是 demo。

如果一次设计判断没有 decision record，它就会变成未来的暗知识。

---

## 13. Human Gate 应该放在哪里

Agent 可以自动推进很多改动，但某些节点应该 human-gated：

- 扩大 tool 权限；
- 改变安全 policy；
- 引入长期 memory；
- 删除或弱化 eval；
- 宣称某个 capability 已经 supported；
- 改变用户可见行为；
- 改变外部 API / integration；
- 发布新版本；
- 处理真实用户数据。

这些 gate 应该写进 harness，而不是靠临时提醒。

例如：

```yaml
human_gates:
  - gate: approve_tool_permission_expansion
    trigger: "agent/tools/** or agent/policies/permissions.yaml"
  - gate: confirm_supported_capability
    trigger: "memory/boards/capabilities.yaml status supported"
  - gate: approve_release
    trigger: "docs/deployment.md or release workflow"
```

---

## 14. 最小可行版本

第一版不需要完整目录。

最小可行 Agent repo 可以是：

```text
my-agent/
  README.md
  AGENTS.md
  SPEC.md

  agent/
    runtime/
    tools/
    prompts/
    policies/

  evals/
    cases/
    regression/
    reports/

  traces/
    failures/

  memory/
    current-status.md
    boards/
      capabilities.yaml
      risks.yaml
      actions.yaml
      decisions.yaml

  scripts/
    run-agent.sh
    run-evals.sh

  tests/
```

最小循环：

```text
改 agent
  -> 跑 tests
  -> 跑 evals
  -> 失败写入 traces/failures
  -> 更新 eval / prompt / tool / policy
  -> 关键判断写入 decisions
  -> 更新 current-status
```

如果只能守住三件事，我会选：

1. `AGENTS.md` 固定读写协议；
2. `evals/regression/` 保存历史失败；
3. `memory/current-status.md` 让项目可接续。

---

## 15. 适用边界

这套结构适合：

- 正在持续开发的专门 Agent；
- 有多个 prompt / tool / policy 迭代的 Agent；
- 需要长期 eval 和 trace 积累的 Agent；
- 多人或多 Agent 协作开发的 Agent；
- 有安全、权限、用户数据边界的 Agent。

它不适合：

- 一次性 demo；
- 很薄的脚本包装；
- 只有一个 prompt、没有长期维护目标的小工具；
- 尚未验证需求是否成立的探索性原型。

对早期原型，先保留最小版本。等失败开始重复出现，再把失败沉淀成 trace、eval、risk 和 action。

---

## 结论

开发 Agent 的 repo，核心不是“目录越全越好”，而是让四件事持续成立：

```text
能力可声明；
声明有证据；
失败可回放；
改进可接续。
```

普通代码仓库只关心实现是否存在。

Agent-native repo 还必须关心：

```text
这个 Agent 为什么可信？
哪里不可信？
怎么知道它变好了？
谁能在三周后接着改？
```

因此，一个合适的 Agent repo 应该同时是：

- Agent 的实现仓库；
- Agent 的评估实验室；
- Agent 的失败档案；
- Agent 的项目记忆；
- Agent 的 harness。

