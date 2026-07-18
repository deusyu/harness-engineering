# 开发 Agent 时，一个合适的 Repo 应该长什么样

## 核心论点

开发一个 Agent，尤其是 coding agent、research agent、workflow agent、tool-using assistant、multi-agent harness 这类项目，不应该被组织成简单的：

```text
agent/
evals/
traces/
```

这三个目录只能说明“这里有 Agent 代码、评估样例和运行记录”。它们不能稳定回答 Agent 开发真正困难的问题：

```text
这个 Agent 声称具备哪些能力？
这个能力声明来自哪个 eval run？
这个 run 用的是哪个 prompt、model route、tool permission 和 memory policy？
某个失败 trace 是否进入 regression？
docs 里的能力描述是否超过 evidence？
换模型、换工具、换部署环境后，这个结论还成立吗？
```

它更应该被组织成一个可运行、可验证、可复现、可接续、可发布的 Agent 工程系统：

```text
agent-development repo
  = lab system
  + human-facing deliverables
  + project memory
```

更具体地说：

```text
lab/           生成行为证据的工程系统
deliverables/  给用户、集成方、评审者看的最终表达
memory/        管理 Agent 能力事实如何走向发布承诺
```

这个结构的目标，不是为了让目录看起来整齐，而是为了让整个 Agent 项目围绕一条能力证据链运转：

```text
capability claim
  -> agent experiment
  -> lab infra target
  -> eval / trace replay / live trial
  -> run logs
  -> artifact index
  -> evidence ledger
  -> release note / docs / product behavior
```

如果这条链断了，项目就会退化成一堆 prompt、tool adapter、trace、eval report 和部署脚本。改了很多东西，但没人能稳定回答：

```text
这个 Agent 到底支持哪些能力？
这个能力声明来自哪个 run？
这个 run 用的是哪个 config？
这个 config 对应哪个 commit？
这个失败 trace 是否进入 regression？
tool permission 是否符合风险等级？
release package 里包含哪套 prompt / policy / tool schema？
```

一句话：

> 一个好的 Agent repo，不只是存放 Agent，而是让 Agent 的能力声明、运行配置、评估证据、失败记录、发布产物和项目记忆都能被追踪、验证和接续。

---

## 1. 推荐目录结构

一个较完整的 Agent development repo 可以长这样：

```text
<my_agent_repo>/
  README.md
  AGENTS.md
  PROJECT.md
  DECISIONS.md

  lab/
    code/
      src/
        my_agent/
          runtime/
          orchestration/
          tools/
          prompts/
          policies/
          memory/
          planning/
          observability/
          evaluation/
          utils/

      configs/
        defaults.yaml
        model/
        runtime/
        tool/
        prompt/
        policy/
        memory/
        eval/
        experiment/
        baseline/
        benchmark/
        infra/

      scripts/
        run_agent.py
        run_eval.py
        replay_trace.py
        collect_traces.py
        compare_runs.py
        package_release.py
        submit_job.py

      baselines/
        wrappers/
        configs/
        reproduction/

      benchmarks/
        tasks/
        metrics/
        protocols/
        runners/
        graders/

      tests/
        unit/
        smoke/
        regression/

    experiments/
      E001-baseline-agent/
      E002-tool-routing/
      E003-memory-policy/
      E004-model-route-upgrade/

    infra/
      README.md
      inventory.yaml
      targets/
        local.template.yaml
        sandbox.template.yaml
        staging.template.yaml
        production.template.yaml
      providers/
        model-providers.template.yaml
        tool-backends.template.yaml
        observability.template.yaml
      paths/
        logical-paths.yaml
        path-map.template.yaml
      environments/
        uv/
          pyproject.toml
          uv.lock
        docker/
          Dockerfile
          compose.yaml
      schedulers/
        local/
        tmux/
        queue/
        ci/
      launch/
        agent.template.sh
        eval.template.sh
        replay.template.sh
        deploy.template.sh
      storage/
        traces.yaml
        eval-results.yaml
        snapshots.yaml
        releases.yaml
      permissions/
        tool-permissions.yaml
        approval-policy.yaml
        data-access-policy.yaml
      dependencies.yaml
      external-scripts.yaml
      probes/
        check_model_access.py
        check_tool_permissions.py
        smoke_agent.py
        smoke_eval.py
        smoke_replay.py
      private/
        README.md

    research/
      BEHAVIOR.md
      CAPABILITIES.md
      SAFETY.md
      claims.yaml
      hypotheses.yaml
      evidence.yaml
      baselines.yaml
      experiment-ledger.yaml
      capability-matrix.yaml
      regression-matrix.yaml
      comparison-matrix.yaml
      failure-analysis.md
      reviewer-risks.md

    data/
      cards/
      task-sets/
      trace-corpora/
      labels/
      golden/
      manifests/
      privacy/
      checksums/

    runs/
      README.md
      .gitignore

    artifacts/
      README.md
      agent-snapshot-index.yaml
      eval-result-index.yaml
      trace-bundle-index.yaml
      release-index.yaml
      .gitignore

  deliverables/
    docs/
      usage.md
      deployment.md
      troubleshooting.md
      limitations.md

    reviews/
      behavior-review.md
      safety-review.md
      reliability-review.md
      cost-latency-review.md
      reviewer-risk-register.yaml

    demos/
      demo-script.md
      demo-cases.yaml

    integration/
      api-contract.md
      tool-contract.md
      deployment-contract.md

    release/
      release-notes.md
      release-checklist.yaml
      promises.yaml

  memory/
    current-status.md
    phase-dashboard.yaml
    change-control.yaml
    lab/
      active-experiments.yaml
      eval-queue.yaml
      trace-queue.yaml
      infra-status.yaml
      blockers.yaml
    product/
      docs-status.md
      demo-status.yaml
      integration-status.yaml
      release-status.yaml
      reviewer-risks.yaml
    bridge/
      claim-to-evidence.yaml
      evidence-to-release.yaml
      failure-to-regression.yaml
      promises.yaml
      handoff-log.md
    archive/
      lab/
      product/
      bridge/
      handoffs/
    gc/
      retention-policy.yaml
      compaction-log.md
      tombstones.yaml
```

这不是第一天必须全部实现的模板。

第一天最重要的是把层级关系想清楚：

```text
lab/           证据生成层：代码、实验、基础设施、数据、运行、产物、能力账本
deliverables/  人类表达层：文档、review、demo、集成契约、release
memory/        状态控制层：实验状态、产品状态、能力到发布的桥接状态
```

---

## 2. 顶层文件

### README.md

`README.md` 面向外部读者、新加入的人和潜在集成方，回答：

```text
这个 Agent 是什么？
解决什么问题？
如何快速跑一个 smoke test？
如何复现主要 eval？
当前 release / capability / integration 状态是什么？
```

不要把 README 写成调 prompt 日志。README 应该是入口，而不是事实数据库。

### AGENTS.md

`AGENTS.md` 面向 Agent，回答：

```text
进入项目后先读哪里？
哪些目录是 lab、deliverables、memory？
改 prompt / tool / policy / memory 后必须跑哪些 smoke checks？
新增失败 trace 后必须写回哪些 ledger？
哪些信息不能提交进公开 repo？
哪些节点必须 human approval？
```

对 Agent development project 来说，`AGENTS.md` 的关键价值是固定读写协议：

```text
进入时：
AGENTS.md -> memory/current-status.md -> lab/research/claims.yaml -> relevant lab/code config or lab/experiments entry

离开时：
update eval/run/result -> update evidence -> update memory/current-status.md -> report validation
```

### PROJECT.md

`PROJECT.md` 是项目简介，面向人和 Agent 都可读。

它应该写：

- Agent 的目标任务；
- 目标用户或目标集成场景；
- 核心能力简介；
- 工具和外部系统范围；
- 当前阶段；
- 成功标准；
- 不在范围内的内容。

### DECISIONS.md

`DECISIONS.md` 记录关键决策。

Agent 项目里，很多决定会在后期变成暗知识：

- 为什么选择这个 model provider，不选另一个；
- 为什么某个 tool 默认关闭；
- 为什么某个 action 需要 human approval；
- 为什么 memory 只保留某类事实；
- 为什么某个 eval suite 被认为有代表性；
- 为什么某个失败不修，而是写入能力边界。

这些都应该进入 decision log。否则几周后，人和 Agent 都会重新争论同一件事。

---

## 3. lab/code/：机器可执行的 Agent 系统

`lab/code/` 是工程主体。凡是可以被运行、测试、回放、打包、部署的东西，都应该在这里。

它回答：

```text
Agent 如何运行？
prompt / policy / tool / memory 如何组合？
eval 如何启动？
trace 如何回放？
release artifact 如何打包？
```

### lab/code/src/

`src/` 放 Agent 的核心运行逻辑。

一个 tool-using agent 可以拆成：

```text
lab/code/src/my_agent/
  runtime/        # session loop, state machine, stop condition
  orchestration/  # planner, router, subagent/team coordination
  tools/          # tool schema, adapter, permission wrapper
  prompts/        # prompt assembly, prompt bundle, few-shot selection
  policies/       # approval, safety, retry, budget, scope policy
  memory/         # memory schema, retrieval, writeback
  planning/       # task decomposition, plan validation
  observability/  # trace event, metrics, logging
  evaluation/     # evaluation helpers used by scripts/runners
  utils/          # seed, serialization, generic helpers
```

关键原则：prompt、tool、policy、memory 不要混成一团。

如果失败来自 tool permission，就不要用 prompt 补丁掩盖；如果失败来自 memory retrieval，就不要把规则硬塞进 system prompt。目录边界应该帮助人和 Agent 定位失败归因。

### lab/code/configs/

`configs/` 固定运行配置。

Agent 行为经常不是代码单独决定的，而是由：

```text
code + prompt + model + tool permission + memory + runtime policy + external state
```

共同决定。所以配置必须可追踪、可 diff、可回放。

典型结构：

```text
defaults.yaml
model/
runtime/
tool/
prompt/
policy/
memory/
eval/
experiment/
baseline/
benchmark/
infra/
```

配置文件至少应该能回答：

```text
这次 run 用哪个 model？
允许哪些 tool？
哪些 action 需要 approval？
memory 从哪里读，写回哪里？
eval runner 使用哪些覆盖项？
```

### lab/code/scripts/

`scripts/` 是稳定入口，不是一次性 shell 草稿。

```text
run_agent.py
run_eval.py
replay_trace.py
collect_traces.py
compare_runs.py
package_release.py
submit_job.py
```

每个脚本都应该声明：

- 输入是什么；
- 输出写到哪里；
- 是否会调用外部服务；
- 是否会产生副作用；
- 失败时如何区分 infra 问题和 Agent 行为问题。

### lab/code/baselines/

Agent 项目也需要 baseline。

baseline 可以是：

- 无 tool 的 simple assistant；
- 旧 prompt bundle；
- 单模型版本；
- 无 memory 版本；
- 纯规则 workflow；
- 人工流程。

如果没有 baseline，项目很容易把“跑起来了”误判成“变好了”。

`baselines/` 可以包含：

```text
wrappers/        统一调用接口
configs/         baseline-specific configs
reproduction/    复现旧版本/竞品/人工流程的记录
```

### lab/code/benchmarks/

`benchmarks/` 定义可重复比较的任务集合和评估协议。

对 Agent 来说，benchmark 不只是输入输出，还应该包括：

```text
tasks/
metrics/
protocols/
runners/
graders/
```

其中 `protocols/` 很重要。它应该写清楚：

- 是否允许访问工具；
- 是否允许写入外部系统；
- 是否允许使用 memory；
- 是否允许多轮澄清；
- 是否需要 human approval；
- 成功标准看最终输出、过程动作，还是状态变化。

### lab/experiments/

`lab/experiments/` 保存实验卡。

例如：

```text
lab/experiments/E002-tool-routing/
  experiment.md
  config.yaml
  runs.yaml
  results.md
  decision.md
```

每个实验至少回答：

```text
改了什么？
想验证哪个 hypothesis？
跑了哪些 eval / replay / live trial？
结果支持哪个 claim？
失败是否进入 regression？
下一步是什么？
```

### lab/code/tests/

`tests/` 验证实现，不替代 eval。

```text
unit/         小函数、小模块
smoke/        tiny agent run / tiny eval / tiny replay
regression/   已经踩过的 deterministic bug
```

它适合检查：

- tool schema parsing；
- permission wrapper；
- prompt assembly；
- memory serialization；
- runtime state transition；
- budget/timeout handling；
- deterministic helper。

它不适合证明“Agent 能胜任某类任务”。那是 `lab/research/` 和 eval/benchmark 的职责。

---

## 4. lab/infra/：运行基底和计算目标

`lab/infra/` 记录 Agent 在哪里运行、依赖哪些外部能力、哪些路径和权限是本地事实、哪些东西不能进入公开 repo。

Agent 项目如果没有 infra 层，模型、工具、密钥、沙箱、权限、observability、trace storage 会散落在 README、环境变量、脚本和人的脑子里。

### lab/infra/inventory.yaml

`inventory.yaml` 描述项目可用的运行目标：

```yaml
targets:
  local:
    kind: local
    purpose: development
    side_effect_level: low
  sandbox:
    kind: sandbox
    purpose: eval_and_replay
    side_effect_level: controlled
  staging:
    kind: staging
    purpose: integration_test
    side_effect_level: medium
  production:
    kind: production
    purpose: live_agent
    side_effect_level: high
    human_gate_required: true
```

它不保存密钥，只记录环境类别、用途和风险等级。

### lab/infra/targets/

`targets/` 记录不同运行目标的模板：

```text
local.template.yaml
sandbox.template.yaml
staging.template.yaml
production.template.yaml
```

每个 target 应该声明：

- 可用模型；
- 可用工具；
- side effect 级别；
- observability 后端；
- trace 保存位置；
- 是否允许 live external write；
- 是否需要 human gate。

### lab/infra/providers/

Agent 项目特别依赖外部 provider：

```text
model-providers.template.yaml
tool-backends.template.yaml
observability.template.yaml
```

模型升级、tool API 变化、browser 行为变化，都可能改变 Agent 行为。provider contract 必须进入 repo，否则 evidence 失去上下文。

### lab/infra/paths/

路径不要写死在脚本里。

```text
logical-paths.yaml
path-map.template.yaml
```

建议使用逻辑路径：

```yaml
paths:
  trace_corpus: "${AGENT_TRACE_ROOT}/cleaned"
  eval_results: "${AGENT_ARTIFACT_ROOT}/eval-results"
  release_packages: "${AGENT_ARTIFACT_ROOT}/releases"
```

然后在本地 private path map 中映射到实际机器。

### lab/infra/environments/

`environments/` 固定运行环境：

```text
uv/
  pyproject.toml
  uv.lock
docker/
  Dockerfile
  compose.yaml
```

Agent 项目需要明确：

- SDK 版本；
- provider client 版本；
- browser / sandbox 依赖；
- evaluator 依赖；
- replay 依赖。

否则 eval pass/fail 可能只是环境漂移。

### lab/infra/schedulers/ 和 lab/infra/launch/

Agent eval 和 replay 也需要调度：

```text
schedulers/
  local/
  tmux/
  queue/
  ci/

launch/
  agent.template.sh
  eval.template.sh
  replay.template.sh
  deploy.template.sh
```

不要让每个人手写不同的 eval 命令。评估命令本身就是 evidence chain 的一部分。

### lab/infra/storage/

`storage/` 记录大对象位置：

```text
traces.yaml
eval-results.yaml
snapshots.yaml
releases.yaml
```

这些文件不存密钥，只存逻辑位置、命名规则、保留策略和公开/私有边界。

### lab/infra/permissions/

Agent repo 比普通 ML repo 多一个关键层：权限。

`permissions/` 应该写清楚：

```text
tool-permissions.yaml
approval-policy.yaml
data-access-policy.yaml
```

例如：

```yaml
tools:
  search_docs:
    side_effect: none
    approval: never
  create_github_issue:
    side_effect: external_write
    approval: required
  refund_payment:
    side_effect: financial
    approval: required
    allowed_targets:
      - sandbox
```

Agent 错误的严重程度，常常取决于 tool permission，而不是最终文本。

### lab/infra/dependencies.yaml

`dependencies.yaml` 记录外部依赖：

```yaml
python:
  manager: uv
  lockfile: lab/infra/environments/uv/uv.lock
models:
  - name: gpt-5.5
    role: primary_agent
tools:
  - name: github
    side_effect: external_write
    permission_file: lab/infra/permissions/tool-permissions.yaml
observability:
  - name: langsmith
    optional: true
```

它的作用是让 Agent 知道哪些依赖是项目边界的一部分，哪些只是本地便利。

### lab/infra/external-scripts.yaml

很多 Agent 项目依赖外部脚本或 CLI：

- GitHub CLI；
- browser automation；
- sandbox launcher；
- eval runner；
- release packager；
- internal workflow scripts。

这些都应该登记：

```yaml
scripts:
  - name: replay-prod-like-trace
    source: external
    location: ~/tools/replay-prod-like-trace
    required: false
    replacement: lab/code/scripts/replay_trace.py
```

如果脚本只存在某个人电脑上，就不能成为 project invariant。

### lab/infra/probes/

Agent 或人接手项目前，应该能先跑 probe：

```bash
python lab/infra/probes/check_model_access.py
python lab/infra/probes/check_tool_permissions.py
python lab/infra/probes/smoke_agent.py
python lab/infra/probes/smoke_eval.py
python lab/infra/probes/smoke_replay.py
```

probe 的目标不是证明 Agent 很强，而是确认当前环境能不能产生可信证据。

### lab/infra/private/

`private/` 存模板说明，不存秘密。

真正的密钥、真实用户 trace、生产路径、本地 token 不应该提交进公开 repo。

`private/README.md` 应该说明：

```text
哪些配置必须本地提供？
哪些路径只允许 template？
哪些 trace 禁止提交？
如何脱敏？
```

---

## 5. lab/research/：行为事实和能力证据账本

`lab/research/` 是 Agent 项目的事实源。它不只是“研究文档”，而是能力、行为、失败和证据的账本。

它回答：

```text
我们声称 Agent 会什么？
证据在哪里？
哪些能力只是 hypothesis？
哪些能力已经 regression-protected？
哪些失败尚未关闭？
哪些风险需要发布前处理？
```

### lab/research/BEHAVIOR.md

`BEHAVIOR.md` 描述 Agent 的目标行为和不变量。

它应该写：

- 正常任务流程；
- 不确定时如何澄清；
- 何时停止；
- 何时请求 human approval；
- 哪些动作绝不自动执行；
- 如何处理外部系统副作用。

### lab/research/CAPABILITIES.md

`CAPABILITIES.md` 用人类可读语言描述能力边界：

```text
Supported:
- Can triage GitHub issues using labels and recent repo context.
- Can draft replies without sending them.

Not supported:
- Cannot autonomously merge PRs.
- Cannot execute production payment actions.

Conditional:
- Can update documentation when tests are local and deterministic.
- Needs human approval before external writes.
```

能力边界必须比 marketing copy 更保守。

### lab/research/SAFETY.md

`SAFETY.md` 记录安全边界：

- tool side effect；
- approval gate；
- sensitive data handling；
- prompt injection 风险；
- external write 风险；
- model/provider 风险；
- sandbox 逃逸风险。

### lab/research/claims.yaml

机器可读的能力声明：

```yaml
claims:
  - id: cap.issue_triage.basic
    statement: "Agent can classify GitHub issues into bug/feature/question with evidence."
    status: supported
    evidence:
      - eval.issue_triage.v3
      - trace.live_review.2026-06-18
    regression:
      - suite.issue_triage_core
    release_visible: true
```

没有 evidence 的 claim 不应该出现在 release note 或 README 的能力承诺里。

### lab/research/hypotheses.yaml

还没有被证实的想法放这里：

```yaml
hypotheses:
  - id: hyp.tool_router.confidence_gate
    claim: "Adding a confidence gate before external writes reduces unsafe actions."
    experiment: lab/experiments/E002-tool-routing/
    status: testing
```

### lab/research/evidence.yaml

证据账本连接 claim、run、artifact 和 deliverable：

```yaml
evidence:
  - id: eval.issue_triage.v3
    claim: cap.issue_triage.basic
    run: lab/runs/2026-06-20/eval-issue-triage-v3/
    artifact: lab/artifacts/eval-result-index.yaml#issue-triage-v3
    config: lab/code/configs/eval/issue-triage.yaml
    commit: abc1234
    result:
      pass_rate: 0.86
      critical_failures: 0
    reviewed_by: human
```

关键是把“我觉得变好了”改成“哪个 run 支持哪个 claim”。

### lab/research/baselines.yaml

记录 baseline：

```yaml
baselines:
  - id: baseline.no_tools.v1
    description: "Assistant without tool access."
    config: lab/code/baselines/configs/no-tools.yaml
    evidence: eval.issue_triage.baseline_v1
```

没有 baseline，很难判断 Agent 变更是否真的带来增益。

### lab/research/experiment-ledger.yaml

实验总账：

```yaml
experiments:
  - id: E002
    title: tool routing confidence gate
    hypothesis: hyp.tool_router.confidence_gate
    status: completed
    runs:
      - lab/runs/2026-06-20/eval-tool-routing-v2/
    decision: keep
```

### lab/research/capability-matrix.yaml

能力矩阵回答：

```text
哪个能力在哪些场景下有效？
哪些能力只是 demo 成功？
哪些能力 release-visible？
哪些能力需要 human approval？
```

### lab/research/regression-matrix.yaml

回归矩阵回答：

```text
哪个历史失败被哪个 suite 守住？
哪个 critical failure 还没有 regression？
哪些 regression 依赖 LLM judge？
```

### lab/research/comparison-matrix.yaml

对比矩阵可以比较：

- 当前 Agent vs baseline；
- 新模型 vs 旧模型；
- 新 prompt bundle vs 旧 prompt bundle；
- tool-enabled vs no-tool；
- memory-enabled vs no-memory；
- 竞品或人工流程。

### lab/research/failure-analysis.md

失败分析不应该只放在 issue 或聊天里。

每个重要失败至少记录：

- 失败现象；
- 触发条件；
- 归因：prompt / tool / policy / model / memory / infra / eval；
- 修复动作；
- 是否加入 regression；
- 如果不修，是否写入能力边界。

### lab/research/reviewer-risks.md

Agent release 前最容易被 reviewer 质疑：

- eval 只覆盖 happy path；
- docs 夸大能力；
- tool permission 过宽；
- trace 有隐私风险；
- LLM judge 不稳定；
- live trial 样本太少；
- 成本/延迟不可接受。

这些风险应该提前写出来，而不是等发布后才解释。

---

## 6. deliverables/：给人看的最终产出

`deliverables/` 是给用户、集成方、评审者和发布流程看的最终表达。

它不应该成为事实源。事实源在 `lab/research/`。`deliverables/` 应该引用证据，而不是发明证据。

```text
deliverables/
  docs/
  reviews/
  demos/
  integration/
  release/
```

### deliverables/docs/

文档面向使用者：

```text
usage.md
deployment.md
troubleshooting.md
limitations.md
```

如果 docs 声称某能力稳定，应该能回链到 `lab/research/claims.yaml`。

### deliverables/reviews/

Agent 发布前至少需要几类 review：

```text
behavior-review.md
safety-review.md
reliability-review.md
cost-latency-review.md
reviewer-risk-register.yaml
```

review 不等于“再让一个模型夸一下”。它应该引用 evidence、trace、failure 和 gate。

### deliverables/demos/

demo 是展示，不是证据本身。

`demo-cases.yaml` 应该标记：

- demo 对应哪个 claim；
- demo 使用哪个 agent config；
- demo 是否使用真实外部系统；
- demo 是否经过脱敏；
- demo 是否可 replay。

### deliverables/integration/

集成契约包括：

```text
api-contract.md
tool-contract.md
deployment-contract.md
```

Agent 经常嵌入别人的 workflow。集成方真正关心的不是“prompt 写得多好”，而是输入、输出、副作用、失败模式、审批边界和日志接口。

### deliverables/release/

release note 不应该只写“improved tool routing”。

它应该写：

```text
changed:
  - tool routing policy v3
  - memory retrieval threshold

evidence:
  - eval.tool-routing.v4 improved pass rate from 0.71 to 0.83
  - no critical approval-boundary regression

known limits:
  - still fails multi-account ambiguity cases
```

Agent release 是能力承诺的外化。没有 evidence 的 release note 会把项目推向自我欺骗。

---

## 7. lab/data/：任务、Trace 和评估数据契约

`lab/data/` 保存相对稳定的数据资产。它不是 `lab/runs/`。

```text
lab/data/
  cards/
  task-sets/
  trace-corpora/
  labels/
  golden/
  manifests/
  privacy/
  checksums/
```

### lab/data/cards/

每个 task set 或 trace corpus 应该有 data card：

- 来源；
- 覆盖能力；
- 是否含真实用户数据；
- 脱敏方式；
- 允许用途；
- 已知偏差；
- 更新频率。

### lab/data/task-sets/

`task-sets/` 保存 curated eval tasks。

每个 task 不只是 prompt，还应该包括：

```text
initial state
available tools
expected behavior
forbidden behavior
success criteria
risk level
human review requirement
```

### lab/data/trace-corpora/

`trace-corpora/` 保存清洗后的 trace。

trace 是最好的 debug/eval 材料，也是最容易泄漏隐私和密钥的材料。进入 repo 前必须经过 privacy/redaction 规则。

### lab/data/labels/

人工标签应该独立保存：

- success/failure；
- failure category；
- severity；
- root cause；
- whether regression required。

### lab/data/golden/

Agent 的 golden 不一定是单一字符串。它可能是：

```text
expected_outputs/
expected_actions/
expected_state/
expected_files/
expected_noop/
expected_handoff/
```

尤其要保留 `expected_noop` 和 `expected_handoff`。很多高质量 Agent 行为不是“多做事”，而是在风险超过权限时停止。

### lab/data/manifests/

manifest 记录每个 task set / trace corpus 的版本、来源和 checksum。

### lab/data/privacy/

privacy 规则必须明确：

- 哪些 trace 可以提交；
- 哪些只能本地保存；
- 哪些必须脱敏；
- 哪些只保存 hash 或摘要；
- 哪些禁止进入模型上下文。

### lab/data/checksums/

checksum 用来保证 eval 数据没有悄悄变化。

```text
如果 task set 变了，历史 eval 分数就不再可比。
```

---

## 8. lab/runs/：运行时日志，不做长期事实源

`lab/runs/` 记录每次执行、eval、replay、trial 的原始结果。

它通常应该被 `.gitignore`，只提交 README、schema 或小样例：

```text
lab/runs/
  2026-06-20_eval_issue_triage_v3/
    config.snapshot.yaml
    metrics.json
    traces.jsonl
    failures/
```

原则：

- 原始 run 可以很大；
- run 可以被删除或归档；
- run 不是长期事实源；
- 进入长期事实源的是 `lab/research/evidence.yaml` 和 `lab/artifacts/*-index.yaml`。

也就是说，`lab/runs/` 是证据原料，`lab/research/` 才是证据账本。

---

## 9. lab/artifacts/：大产物索引

Agent 项目的产物可能包括：

- packaged agent snapshot；
- prompt bundle；
- policy bundle；
- tool schema bundle；
- eval result；
- trace bundle；
- demo recording；
- release package；
- deployment manifest。

这些产物不一定适合直接提交进 Git。`lab/artifacts/` 的职责是索引：

```yaml
releases:
  - id: release.2026-06-20.v0.3
    commit: abc1234
    agent_snapshot: s3://...
    eval_result: s3://...
    trace_bundle: s3://...
    release_notes: deliverables/release/release-notes.md
    claims:
      - cap.issue_triage.basic
```

没有 artifact index，几周后就会出现这种情况：

```text
这个 demo 用的是哪个版本？
这个 eval result 是不是最新的？
release package 里到底包含哪套 prompt？
```

---

## 10. memory/：项目状态控制面板

`memory/` 是给人和 Agent 接续项目用的。

它不是把所有资料都堆进去，而是回答：

```text
现在项目处于什么阶段？
下一步是什么？
哪些 claim 正在验证？
哪些 eval 还没跑？
哪些 failure 还没关闭？
哪些 release promise 还没证据？
哪些旧记忆已经过期？
```

建议结构：

```text
memory/
  current-status.md
  phase-dashboard.yaml
  change-control.yaml
  lab/
  product/
  bridge/
  archive/
  gc/
```

### memory/current-status.md

短文件，Agent 进入项目时优先读。

建议固定结构：

```text
Current phase
Current goal
Recently changed
Next action
Validation status
Open blockers
Do not do
```

它应该指向事实源，而不是复制所有事实。

### memory/phase-dashboard.yaml

用机器可读方式记录阶段：

```yaml
phase: "stabilize-eval-harness"
active_claims:
  - cap.issue_triage.basic
active_runs:
  - lab/runs/2026-06-20_eval_issue_triage_v3/
required_gates:
  - approval_boundary
  - privacy_redaction
next_actions:
  - add replay case for ambiguous account selection
```

### memory/change-control.yaml

Agent 项目特别容易出现“改了行为控制面，但没人更新证据”的漂移。`change-control.yaml` 记录影响行为的变化：

```yaml
changes:
  - id: change.2026-06-20.prompt-router-v3
    touched:
      - lab/code/src/my_agent/prompts/router.md
      - lab/code/configs/tool/defaults.yaml
    expected_impact:
      - cap.tool_routing
    required_validation:
      - lab/code/benchmarks/tasks/tool-routing.yaml
      - lab/code/benchmarks/tasks/approval-boundary.yaml
    status: validated
```

### memory/lab/

`memory/lab/` 记录证据生成层的状态：

```text
active-experiments.yaml
eval-queue.yaml
trace-queue.yaml
infra-status.yaml
blockers.yaml
```

它回答：

```text
哪些实验正在跑？
哪些 eval 等待执行？
哪些 trace 等待清洗？
当前 infra 是否可用？
哪些 blocker 会影响证据可信度？
```

### memory/product/

`memory/product/` 记录人类表达层的状态：

```text
docs-status.md
demo-status.yaml
integration-status.yaml
release-status.yaml
reviewer-risks.yaml
```

它回答：

```text
哪些 docs 已经跟 evidence 对齐？
哪些 demo 可以公开？
哪些 integration contract 等待确认？
release checklist 还缺什么？
```

### memory/bridge/

`memory/bridge/` 是 Agent 项目最关键的接续层：

```text
claim-to-evidence.yaml
evidence-to-release.yaml
failure-to-regression.yaml
promises.yaml
handoff-log.md
```

它连接：

```text
能力声明 -> 证据
证据 -> release/docs
失败 -> regression
承诺 -> gate
```

没有 bridge，lab 跑出来的结果很容易进不了 docs/release；docs/release 也很容易写出没有证据支撑的承诺。

### decisions 和 handoffs

关键交接必须进入 repo：

```text
谁改了什么？
为什么改？
哪些 eval 跑过？
哪些没跑？
哪些失败需要下一个人接着看？
```

handoff 不应该只存在于聊天记录。

### memory/gc/：记忆遗忘机制

旧记忆会误导 Agent。

需要定期标记：

- 哪些 status 已过期；
- 哪些 decision 被新 decision 覆盖；
- 哪些 action 已关闭；
- 哪些 failure 已进入 regression；
- 哪些 claim 被降级或撤销。

建议结构：

```text
retention-policy.yaml
compaction-log.md
tombstones.yaml
```

没有 memory GC，Agent 会读到旧事实，并按旧目标行动。

---

## 11. 核心链路：从 Capability Claim 到 Release

Agent repo 的核心链路应该是：

```text
lab/research/claims.yaml
  -> lab/code/benchmarks/tasks/
  -> lab/code/configs/
  -> lab/infra/targets + lab/infra/permissions
  -> lab/runs/
  -> lab/artifacts/
  -> lab/research/evidence.yaml
  -> deliverables/release/
```

举例：

```yaml
claim: cap.safe_issue_triage
task_set: lab/data/task-sets/github-issue-triage-v3.yaml
agent_config: lab/code/configs/eval/issue-triage.yaml
permissions: lab/infra/permissions/tool-permissions.yaml
run: lab/runs/2026-06-20_eval_issue_triage_v3/
artifact: lab/artifacts/eval-result-index.yaml#issue-triage-v3
evidence: lab/research/evidence.yaml#eval.issue_triage.v3
release_note: deliverables/release/release-notes.md
```

这条链路让人能从一句能力声明一路追到运行证据。

如果追不到，就说明它还不是能力事实，只是项目愿望。

---

## 12. 主工作流

### 新增能力

```text
write hypothesis
  -> add task set / benchmark protocol
  -> implement agent change
  -> run eval / replay
  -> inspect failures
  -> update evidence
  -> promote or reject claim
```

关键点：先有 claim/hypothesis，再有 eval，再承诺能力。

### 修复失败

```text
capture failure trace
  -> classify root cause
  -> add replay/regression
  -> modify prompt/tool/policy/code
  -> run targeted validation
  -> update failure-analysis and evidence
```

关键点：失败不能只被“修掉”。它要变成项目记忆。

### 发布版本

```text
freeze agent config
  -> run release eval suite
  -> check approval/privacy gates
  -> package artifact
  -> update release index
  -> write release notes from evidence
```

关键点：release 是 evidence 的外化，不是 commit hash 的别名。

---

## 13. Human Gate 应该放在哪里

Agent 项目里，有些节点不应该让 Agent 自动越过：

```text
external write
financial action
user-visible message
production deploy
permission broadening
memory retention change
claim promotion to release-visible
privacy rule relaxation
```

这些 gate 应该写进 `AGENTS.md`、`memory/phase-dashboard.yaml`、`lab/infra/permissions/approval-policy.yaml`、`deliverables/release/release-checklist.yaml` 或 launch/release 流程，而不是每次靠临时提醒。

---

## 14. 第一版先守住什么

第一版不用建完整目录。

先守住：

```text
README.md
AGENTS.md
PROJECT.md
DECISIONS.md

lab/code/
lab/experiments/
lab/infra/
lab/research/claims.yaml
lab/research/evidence.yaml
lab/research/failure-analysis.md
lab/data/task-sets/
lab/data/privacy/
lab/runs/
lab/artifacts/

deliverables/docs/
deliverables/release/

memory/current-status.md
memory/phase-dashboard.yaml
memory/bridge/
```

第一版要守住四件事：

1. **能力声明可追溯**：claim 能追到 evidence；
2. **失败可沉淀**：failure 能进入 replay/regression 或能力边界；
3. **副作用可控**：tool permission 和 human gate 明确；
4. **状态可接续**：任何人或 Agent 三天后回来都知道下一步是什么。

---

## 15. 防漂移机制：Agent Harness Drift Control

上面的结构如果只停留在文档里，长期开发后一定会漂移。

Agent 项目尤其容易出现几类漂移：

```text
structure drift
dependency / script drift
goal / scope drift
memory drift
```

这些名字和 ML research repo 类似，但在 Agent 项目里有更具体的表现：capability、eval、permission、trace、release promise 都会漂。

### 15.1 Structure Drift

典型问题：

```text
README 说有 eval，但 lab/code/benchmarks/ 没有对应 suite；
lab/research/claims.yaml 引用的 evidence 不存在；
lab/research/evidence.yaml 引用的 run/artifact 不存在；
deliverables/release/release-notes.md 写了没有 claim 支撑的能力；
memory/current-status.md 指向旧 phase；
AGENTS.md 的读写协议和实际目录不一致。
```

validator 应检查：

```text
required files exist
required directories exist
YAML references resolve
claim -> evidence -> run/artifact chain exists
release-visible claim has evidence
failure -> regression or boundary exists
```

### 15.2 Dependency / Script Drift

Agent 项目的 dependency drift 不只是包版本漂移，还包括：

```text
model provider 版本或行为变化；
tool API schema 变化；
approval policy 被脚本绕过；
eval runner 版本变化；
LLM judge prompt 变化；
browser / sandbox 行为变化；
external CLI 只存在某个人机器上。
```

需要记录：

```text
lab/infra/dependencies.yaml
lab/infra/external-scripts.yaml
lab/infra/providers/
lab/infra/permissions/
lab/code/configs/
```

validator 应检查：

```text
every tool has side_effect level
external write tools require approval policy
production target cannot be default eval target
permission broadening requires decision entry
eval runner and grader versions are pinned
```

### 15.3 Goal / Scope Drift

Agent 项目的目标很容易越写越大：

```text
本来只做 issue triage，后来变成自动修 PR；
本来只 draft email，后来变成自动发送；
本来只在 sandbox 测试，后来默认连 production；
本来 claim 只是 internal，后来写进 public docs。
```

需要防止：

```text
PROJECT.md 的 scope 和 README/docs/release 不一致；
claims.yaml 中 hypothesis 被误写成 supported；
release-visible claim 没有 human-reviewed evidence；
out-of-scope action 没有 gate。
```

`memory/change-control.yaml` 应记录会改变行为边界的变化。

### 15.4 Memory Drift

典型问题：

```text
memory/current-status.md 过期；
old decision 仍被 AGENTS.md 引用；
action 已完成但还在 next action；
failure 已修但没有进入 regression；
memory policy 改了但 eval 没重跑；
stale memory 继续影响 Agent 行为。
```

解决方式：

```text
current-status 必须短；
phase-dashboard 机器可读；
memory/bridge 维护 claim/evidence/release 的关系；
stale-memory audit 定期执行；
superseded decisions 显式标记；
memory writeback 进入 eval/replay。
```

### 15.5 确定性 validator

第一版 validator 不需要理解语义，先守住结构和引用：

```bash
python scripts/validate-agent-harness.py
```

它可以检查：

- 必需目录和文件；
- YAML schema；
- claim/evidence/run/artifact 引用；
- release-visible claim 是否有 evidence；
- tool permission 是否声明 side effect；
- human gate 是否覆盖高风险动作；
- privacy manifest 是否存在；
- memory/current-status 是否引用当前 phase；
- `lab/infra/private`、`lab/runs`、raw trace、secret-like token 是否被正确忽略或拦截。

### 15.6 语义审核 Skill

确定性 validator 只能防止明显断链，不能判断 claim 是否夸大、eval 是否代表真实能力、failure 是否被错误归因。

所以还需要一个语义审核流程，专门问：

```text
README/docs/release 的能力承诺是否超过 lab/research evidence？
eval suite 是否只覆盖 happy path？
critical failure 是否真的被 regression 保护？
tool permission 是否与风险等级匹配？
release note 是否诚实表达边界？
memory/current-status 是否会误导下一个 Agent？
```

这类审核可以由人做，也可以由 reviewer Agent 做，但必须引用具体文件和证据，不能只给泛泛建议。

---

## 16. 结论

一个 Agent repo 的核心，不是把 `agent/`、`evals/`、`traces/` 摆出来，而是建立一条从能力声明到行为证据再到发布承诺的链：

```text
claim
  -> experiment / eval / trace
  -> config / permission / memory
  -> run
  -> artifact
  -> evidence
  -> release / docs
```

这条链让 Agent 开发从“调 prompt 的经验”变成“可审计的工程系统”。

好的 Agent repo 应该让任何接手的人或 Agent 能快速回答：

```text
现在这个 Agent 到底会什么？
凭什么说它会？
哪些失败已经被守住？
哪些风险还不能自动越过？
下一步应该改哪里，改完如何验证？
```

如果 repo 能回答这些问题，它才真正适合 Agent 开发。
