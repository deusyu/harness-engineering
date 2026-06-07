# Agent-Native 科研项目结构：从 idea 到中稿的项目管理 Harness

## 核心论点

面向会议论文发表的科研项目，不应该再被看成简单的：

```text
paper repo + code repo
```

它更应该被看成一个持续演化的 **agent-native research project**：

```text
research project
  = management graph
  + epistemic graph
  + production artifacts
```

其中：

- **management graph** 管理项目推进：phase、action、deadline、risk、gate、decision；
- **epistemic graph** 管理研究是否成立：problem、hypothesis、experiment、evidence、claim、narrative、reviewer risk；
- **production artifacts** 承载真实产物：paper、code、experiments、reviews、rebuttal、artifact release。

一个好的科研项目管理 harness，不只是让 Agent “帮忙写论文”或“帮忙跑实验”，而是让 Agent 能在整个 `idea -> experiment -> evidence -> paper -> review -> rebuttal -> camera-ready / artifact release` 生命周期中可靠地理解项目、推进项目、写回状态、保存证据、暴露风险。

换句话说：

> **科研项目不是 paper repo，也不是 code repo，而是由项目推进图和研究认识图共同驱动的 agent-native research object graph。**

---

## 1. 为什么普通 repo 结构不够

传统科研项目通常围绕产物组织：

```text
paper/
code/
experiments/
figures/
```

这种结构适合人类专家在脑中维护上下文：

- 哪个实验支持哪个 claim；
- 哪个 negative result 改变了研究方向；
- 哪个 figure 来自哪个 commit；
- 哪个 reviewer risk 需要补实验；
- 哪个 rebuttal promise 必须在 camera-ready 兑现。

但对 Agent 来说，这些关系如果只存在于人脑、聊天记录、实验日志或散落的 README 中，就很难稳定恢复。

Agent 每次进入项目都会遇到几个问题：

```text
我应该先读哪里？
当前项目处于什么阶段？
哪些 claim 已经被证据支持？
哪些实验结果是失败但重要的？
哪些结论只是 AI 推断，还没有被确认？
哪些地方不能因为匿名投稿或 source visibility 被误改？
我完成任务后应该写回哪里？
```

因此，面向 Agent 的科研项目需要显式 harness：

- 给 Agent 固定入口；
- 给项目稳定对象模型；
- 给每次行动写回规则；
- 给 claim/evidence/provenance 可追踪关系；
- 给阶段推进机械化 gate；
- 给 human-in-the-loop 的确认点。

---

## 2. 从 `ml-research-skills` 继承什么

`ml-research-skills` 虽然以 skills 集合的形式出现，但它已经隐含了一个科研项目 harness。

它的重要贡献不只是提供局部技能，而是提出了很多横向项目对象：

```text
project root
component boundary
memory bus
current status
phase dashboard
claim board
evidence board
decision log
action board
source visibility policy
paper / code / slides / rebuttal / artifact lifecycle
```

这些对象不是某个单独 skill 的内部细节，而是整个项目的共享语义层。

因此，新的科研项目管理 harness 应该做一次“上升”：

```text
原来散落在 skills 里的全局规则
  -> 上升为 harness core schema / protocol / validator

原来局部可复用的操作流程
  -> 保留为 skills
```

可以用一句话概括：

```text
harness defines the world;
skills act inside the world.
```

### 应该上升为 harness core 的部分

- 项目控制根目录；
- paper/code/experiment/artifact 的组件边界；
- memory bus；
- hypothesis / claim / evidence / risk / action / decision 对象；
- phase dashboard；
- source visibility 和匿名投稿策略；
- 每次 Agent 工作后的写回规则；
- validation gates；
- submission / rebuttal / camera-ready 生命周期。

### 应该保留为 skills 的部分

- 初始化项目；
- 设计实验；
- 整理 evidence board；
- 做 baseline audit；
- 写 paper section；
- 做 reviewer simulation；
- 设计 rebuttal strategy；
- 准备 artifact release checklist。

`ml-research-skills` 的问题不是“没有 harness”，而是 **harness 是隐式的，skills 是显式的**。下一版应该把 harness 显式化。

---

## 3. 从 ARA 引入什么

`Agent-Native-Research-Artifact` 的关键价值不在普通项目管理，而在研究成果的 agent-native 表达。

它提醒我们：论文不应该只是最后生成的 PDF。一个科研项目在进行过程中，就应该持续维护一个可被 Agent 按需读取、验证、扩展的研究知识包。

这可以称为：

```text
shadow paper
shadow artifact
agent-native research artifact
```

ARA 值得引入科研项目管理 harness 的思想包括：

- **progressive disclosure**：先读 overview / index，再按需深入；
- **cross-layer binding**：paper、claim、experiment、code、trace、evidence 之间互相连接；
- **dead-end preservation**：失败路线和负结果也保留；
- **provenance tags**：区分原始事实、实验结果、AI 推断、人工确认；
- **progressive crystallization**：不要把临时观察过早升级成 durable claim；
- **end-of-turn recorder / epilogue**：每次 Agent 任务结束后写回项目过程；
- **epistemic review**：不仅检查格式，还检查 claim 是否真的被证据支持。

但 ARA 不能替代项目管理 harness。

因为项目管理还需要处理：

```text
deadline
owner / agent role
compute budget
experiment queue
worktree / branch
submission target
source visibility
review / rebuttal
camera-ready
artifact release
```

所以更合理的关系是：

```text
memory/              # 项目管理层：phase, action, risk, gate, decision
research-artifact/   # ARA-inspired 研究本体层：problem, claim, evidence, trace, provenance
paper/ code/ ...     # 真实产物层
```

ARA 应该作为科研项目运行时的 epistemic substrate，而不是只作为发表后的归档格式。

---

## 4. 三层项目结构

一个支持从 idea 到中稿 / 录用的科研项目，可以分成三层。

### 4.1 Project Management Layer

这一层负责项目推进。

它回答：

```text
当前项目处于什么阶段？
下一步做什么？
哪些 gate 没过？
哪些 risk 会导致拒稿？
哪些 action 阻塞？
哪些 decision 已经做出？
哪些地方需要 human approval？
```

建议结构：

```text
memory/
  current-status.md
  phase-dashboard.yaml
  phase-dashboard.md
  boards/
    hypotheses.yaml
    claims.yaml
    evidence.yaml
    experiments.yaml
    provenance.yaml
    risks.yaml
    actions.yaml
    decisions.yaml
    handoffs.yaml
    source-visibility.yaml
  reports/
    weekly-review-YYYY-MM-DD.md
    readiness-review-YYYY-MM-DD.md
```

这里 `*.yaml` 是机器可验证的 canonical state，`*.md` 是人类和 Agent 友好的投影。

### 4.2 Research Artifact Layer

这一层负责研究本体。

它回答：

```text
问题是什么？
hypothesis 如何演化？
哪些 claim 成立？
哪些 evidence 支持它？
哪些实验失败但改变了判断？
哪些内容只是 staging，还没有 crystallized？
```

建议结构：

```text
research-artifact/
  PAPER.md
  logic/
    problem.md
    assumptions.md
    contribution-map.md
    claim-graph.md
  evidence/
    literature/
    experiments/
    figures/
    tables/
  trace/
    idea-evolution.md
    dead-ends.md
    negative-results.md
    session-events/
  provenance/
    claim-evidence-links.yaml
    source-map.yaml
  staging/
    unverified-claims.md
    agent-observations.md
```

这一层不是最终论文，而是最终论文背后的 agent-native knowledge package。

### 4.3 Production Layer

这一层负责真实产物。

它回答：

```text
论文在哪里？
代码在哪里？
实验配置和结果在哪里？
review 和 rebuttal 在哪里？
artifact release 在哪里？
```

建议结构：

```text
paper/
  main.tex
  sections/
  figures/
  tables/
  appendix/

code/
  src/
  configs/
  scripts/
  tests/

experiments/
  E001-baseline/
    experiment-card.md
    config.yaml
    result-summary.md
    artifacts.yaml
  E002-ablation/
    ...

literature/
  papers/
  related-work-matrix.yaml
  citation-risks.md

reviews/
  technical-review.md
  novelty-review.md
  reproducibility-review.md
  reviewer-risk-register.yaml

rebuttal/
  reviews.yaml
  response-plan.md
  promises.yaml
  final-response.md

artifact-release/
  checklist.yaml
  README.md
  package-manifest.yaml
```

这一层可以逐步接入 MLflow、W&B、DVC、CML 等工具，但第一版不应该强依赖 SaaS 或重平台。

---

## 5. 完整目录草案

综合三层，一个科研项目可以长成这样：

```text
research-project/
  harness.yaml                         # schema version, venue, deadline, active phase
  PROJECT.md                           # 人类可读项目简介
  AGENTS.md                            # Agent 入口协议

  memory/                              # 项目管理层
    current-status.md
    phase-dashboard.yaml
    phase-dashboard.md
    boards/
      hypotheses.yaml
      claims.yaml
      evidence.yaml
      experiments.yaml
      provenance.yaml
      risks.yaml
      actions.yaml
      decisions.yaml
      handoffs.yaml
      source-visibility.yaml
    reports/
      weekly-review-YYYY-MM-DD.md
      readiness-review-YYYY-MM-DD.md

  research-artifact/                   # ARA-inspired 研究本体层
    PAPER.md
    logic/
      problem.md
      assumptions.md
      contribution-map.md
      claim-graph.md
    evidence/
      literature/
      experiments/
      figures/
      tables/
    trace/
      idea-evolution.md
      dead-ends.md
      negative-results.md
      session-events/
    provenance/
      claim-evidence-links.yaml
      source-map.yaml
    staging/
      unverified-claims.md
      agent-observations.md

  paper/                               # 真实论文产物
    main.tex
    sections/
    figures/
    tables/
    appendix/

  code/                                # 真实代码产物
    src/
    configs/
    scripts/
    tests/

  experiments/                         # 实验卡与结果索引
    E001-baseline/
      experiment-card.md
      config.yaml
      result-summary.md
      artifacts.yaml

  literature/                          # 文献笔记与 related work matrix
    papers/
    related-work-matrix.yaml
    citation-risks.md

  reviews/                             # 内部评审和 Agent reviewer 输出
    technical-review.md
    novelty-review.md
    reproducibility-review.md
    reviewer-risk-register.yaml

  rebuttal/                            # 投稿后阶段
    reviews.yaml
    response-plan.md
    promises.yaml
    final-response.md

  artifact-release/                    # 录用 / 开源 / 复现包
    checklist.yaml
    README.md
    package-manifest.yaml

  skills/                              # 项目本地 skills 或 skill overrides
    new-experiment/
    paper-readiness/
    reviewer-simulator/
    repro-check/

  scripts/
    validate-harness.py
    render-dashboard.py
    link-check.py
```

这不是一开始必须全部实现的模板，而是说明一个科研项目的“长相”：它同时有项目推进、有研究本体、有真实产物。

---

## 6. 两个核心图

这个结构背后的关键不是目录，而是两个图。

### 6.1 Management Graph

```text
Phase -> Milestone -> Action -> Owner/Agent -> Deadline -> Gate -> Decision
```

它关心项目如何推进。

例如：

```text
Phase 3: Evidence Accumulation
  -> Action ACT-014: rerun ablation with 5 seeds
  -> Owner: experiment-agent
  -> Deadline: 2026-07-10
  -> Gate: evidence for CLM-003 reaches supported
  -> Decision: keep / narrow / drop claim
```

### 6.2 Epistemic Graph

```text
Problem -> Hypothesis -> Experiment/Literature -> Evidence -> Claim -> Narrative -> Reviewer Risk
```

它关心研究是否成立。

例如：

```text
HYP-002
  -> EXP-011, EXP-012
  -> EVD-018
  -> CLM-003
  -> paper:introduction:contribution-2
  -> RSK-006: baseline may be unfair
```

真正好的科研 harness，是让这两个图互相连接。

一个 action 不是孤立 todo，而是为了修复某个 claim 的 evidence gap。

一个 reviewer risk 不是泛泛意见，而是指向某个 claim / experiment / paper section。

一个 experiment 失败后不是消失，而是更新 hypothesis graph 和 dead-end trace。

一个 paper section 不是自由写作，而是 claim-evidence graph 的 projection。

---

## 7. 主生命周期：从 idea 到中稿 / 录用

会议论文项目可以分成 8 个 phase。它们不是严格瀑布，而是有 gate 的循环。

### Phase 0：Seed / Problem Framing

目标：把模糊 idea 变成可讨论的问题。

核心对象：

- problem statement；
- initial hypothesis；
- related work seed；
- feasibility / risk note。

Gate：这个 idea 值不值得进入正式研究项目？

### Phase 1：Positioning / Hypothesis Formation

目标：明确 novelty、claim 空间，以及和已有工作的差异。

核心对象：

- hypothesis graph；
- literature notes；
- related-work matrix；
- expected contribution map。

Gate：是否有足够清楚的 research gap 和可验证 hypothesis？

### Phase 2：Experiment Design

目标：设计能支持或否定核心 claim 的实验。

核心对象：

- experiment cards；
- baseline plan；
- ablation plan；
- metrics plan；
- compute budget。

Gate：实验设计是否足以支撑未来论文 claim？

### Phase 3：Execution / Evidence Accumulation

目标：跑实验、记录结果、保留失败。

核心对象：

- experiment result；
- evidence board；
- negative results；
- provenance；
- action board。

Gate：是否有足够 evidence 进入 narrative construction？

### Phase 4：Narrative Construction

目标：把 evidence graph 投影成 paper narrative。

核心对象：

- claim-evidence matrix；
- figure / table plan；
- paper outline；
- contribution bullets。

Gate：paper 的每个主 claim 是否都有证据？

### Phase 5：Submission Readiness

目标：面向具体会议做投稿准备。

核心对象：

- venue checklist；
- anonymity / source visibility；
- reproducibility checklist；
- reviewer-risk register；
- internal reviews。

Gate：是否可以投稿？

### Phase 6：Review / Rebuttal

目标：管理 reviews、response、promise。

核心对象：

- review issue graph；
- response plan；
- promise tracker；
- additional experiments。

Gate：rebuttal 是否闭环所有高风险问题？

### Phase 7：Camera-ready / Artifact Release

目标：录用后最终交付。

核心对象：

- final paper；
- artifact package；
- release checklist；
- public / private source audit。

Gate：是否可以公开发布？

---

## 8. Agent 进入项目时如何读

Harness 化的关键之一，是 Agent 不应该一进项目就读整个 repo。

它应该有固定的 progressive disclosure 入口：

```text
AGENTS.md
  -> memory/current-status.md
  -> memory/phase-dashboard.md
  -> relevant boards
  -> research-artifact/
  -> raw paper/code/experiment files
```

这个顺序解决的是上下文预算问题。

Agent 先知道：

```text
我是谁？
这个项目在什么阶段？
当前任务和阻塞是什么？
哪些对象与我的任务相关？
哪些文件才需要深入读取？
```

而不是一开始就把论文、代码、实验日志、聊天记录全部塞进上下文。

---

## 9. Agent 离开项目时如何写回

Harness 化的另一个关键，是每次 Agent 任务结束后必须写回项目状态。

可以借鉴 ARA 的 epilogue 思想：

```text
After each agent task:
1. update touched objects
2. update evidence / claim / action links
3. record decisions or open questions
4. preserve failed attempts / dead ends if meaningful
5. update current-status.md
6. run validator
7. produce next-step briefing
```

这能避免 Agent 做过的事情散落在：

- chat transcript；
- git diff；
- shell output；
- 实验日志；
- 临时 markdown；
- 人类记忆。

对科研项目来说，失败和不确定性也必须被写回。

例如：

```text
EXP-014 failed because memory overflow.
This does not refute HYP-003.
It creates ACT-021: reduce batch size and rerun.
It updates RSK-005: compute budget may be insufficient.
```

这类记录比“实验失败了”更有价值，因为它连接了 hypothesis、action 和 risk。

---

## 10. Claim-centered，而不是 task-centered

普通项目管理常常以 task list 为中心。

但科研项目不能只 task-centered，因为完成任务不等于研究成立。

科研项目更应该 claim-centered：

```text
Claim
  -> supporting evidence
  -> contradicting evidence
  -> paper location
  -> reviewer risk
  -> next action
```

一个核心矩阵可以是：

```text
| Claim ID | Claim | Evidence | Status | Paper Location | Risk | Next Action |
|---|---|---|---|---|---|---|
| CLM-003 | Method improves X under Y | EVD-012, LIT-007 | partial | intro.contrib.2 / table.2 | baseline weak | ACT-014 |
```

这意味着：

- 写作不能脱离 evidence；
- 实验不能脱离 claim；
- risk 不能脱离 reviewer 视角；
- action 不能脱离 evidence gap。

这也是科研项目 harness 与普通 project management harness 最大的差异。

---

## 11. Human gate 应该放在哪里

Agent 可以推进很多工作，但科研项目有一些关键节点不应该自动越过。

建议 human-gated 的节点包括：

- 是否正式立项；
- 是否 pivot 研究方向；
- 是否确认核心 claim；
- 是否投入大规模实验预算；
- 是否选择投稿会议；
- 是否提交论文；
- 是否采用 rebuttal strategy；
- 是否公开代码 / 数据 / artifact；
- 是否 camera-ready finalization。

这些 gate 应该写入 harness，而不是每次靠临时提醒。

例如：

```yaml
human_gates:
  - gate: confirm_core_claims
    phase: narrative_construction
    required_before:
      - paper_readiness
      - submission
  - gate: approve_rebuttal_strategy
    phase: rebuttal
    required_before:
      - final_response
```

---

## 12. MVP 不应做什么

第一版科研项目管理 harness 应该轻薄，不应该一开始变成巨型平台。

不建议 MVP 做：

- 完整自动科学家系统；
- 全自动论文生成；
- 强依赖 SaaS dashboard；
- 复杂多 Agent runtime；
- 过多 skills；
- 把 Markdown prose 当作唯一机器真相；
- 把 chat transcript 当作项目状态；
- 忽视 negative results；
- 忽视 source visibility 和匿名投稿约束。

MVP 应该先实现：

```text
核心对象模型
  +
轻量目录结构
  +
固定读写协议
  +
少量高价值 skills
  +
validator
```

---

## 13. 一句话总结

面向会议论文的科研项目管理 harness，不应该只是“任务管理器”，也不应该只是“论文写作助手”。

它应该是一个 repo-native 的研究控制系统：

```text
用 management graph 管推进，
用 epistemic graph 管研究是否成立，
用 production artifacts 承载真实产物，
用 ARA-inspired shadow artifact 保存可被 Agent 继续理解的研究知识，
用 skills 执行局部工作流，
用 validators 和 human gates 保持可靠性。
```

这就是一个从 idea 到中稿 / 录用都能被 Agent 长期可靠参与的科研项目应该具有的结构。