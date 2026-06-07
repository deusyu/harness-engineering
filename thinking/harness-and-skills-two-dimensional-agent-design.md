# Harness 与 Skills：个人 Agent 系统的二维设计

## 核心论点

个人 Agent 系统的积累不应该只沿一个方向展开。

更合理的结构是同时沿两个维度生长：

```text
横向：Harness
  围绕一个特定领域 / 项目 / 专门 Agent 的长期治理与演化。

纵向：Skills
  围绕一类可复用工作流 / 操作能力的持续沉淀与迁移。
```

换句话说：

> **Harness 让 Agent 在一个领域里长期稳定工作；Skills 让具体工作流跨领域复用。**

如果只有 harness，没有 skills，每个领域都会重复造流程。

如果只有 skills，没有 harness，就会有很多能力包，却缺少领域身份、长期状态、边界和目标约束。

真正可积累的个人 Agent 系统，需要二者同时存在。

---

## 1. 为什么需要二维视角

在讨论如何开发自己的轻薄 harness 时，很容易把所有东西都放进一个大框里：

```text
mission
boundaries
state
workflows
ledgers
templates
checks
eval
```

这在单个专门 Agent 的早期很有效。

但当一个人开始持续开发多个专门 Agent 时，例如：

- Wealth-Manager-Agent；
- Research-Manager-Agent；
- ML-Project-Manager-Agent；
- Writing-Agent；
- Ops-Agent；
- Codebase-Maintainer-Agent；

就会发现两类东西混在一起。

第一类是领域本身的长期上下文：

```text
这个 Agent 的目标是什么？
边界是什么？
当前状态是什么？
长期账本是什么？
这个领域有哪些特定规则？
```

第二类是跨领域反复出现的工作流：

```text
如何做 Git 版本管理？
如何操作远程服务器？
如何写周报？
如何统一图表风格？
如何做 incident review？
如何写 proposal？
如何做 self-evaluation？
```

前者适合作为 harness 的横向结构。

后者适合沉淀成 skills 的纵向能力。

---

## 2. Harness 是横向的：领域工作面

Harness 面向的是一个特定领域、项目或专门 Agent。

它回答的问题是：

> **这个 Agent 在这个领域里如何长期工作？**

一个 harness 通常包含：

```text
mission          领域目标
boundaries       权限与安全边界
state            当前状态
ledgers          长期账本
domain rules     领域规则
project rules    项目约定
cadence          工作节奏
eval             评价机制
skill manifest   常用 skills 列表与配置
```

因此，harness 更像一个“领域工作面”或“领域操作系统”。

它不一定规定每个具体动作的细节，但它定义这个专门 Agent 的：

```text
身份、目标、边界、上下文、状态、节奏、治理方式。
```

例如 ML 项目管理 harness 可能关心：

```text
项目基准；
研究目标；
实验周期；
数据集版本；
模型 checkpoint；
评估指标；
算力预算；
远程环境；
报告目标；
团队约定。
```

这些都是横向的、领域性的、长期持续演化的内容。

---

## 3. Skills 是纵向的：工作流能力包

Skills 面向的是某一类可复用工作流。

它回答的问题是：

> **这类任务具体应该怎么做？**

一个 skill 不一定绑定某一个领域。

例如：

```text
Git 版本管理
远程服务器操作
实验结果归档
绘图风格统一
表格风格统一
周报生成
incident analysis
proposal writing
self-evaluation
代码审查
```

这些能力可以穿过多个 harness。

同一个 `git-workflow` skill 可以被这些 harness 同时使用：

- ML-Project-Manager-Agent 用它管理实验代码；
- Writing-Agent 用它管理文章版本；
- Wealth-Manager-Agent 用它管理报告和账本变更；
- Codebase-Maintainer-Agent 用它管理开发分支。

所以 skills 是纵向的：它们跨领域、跨项目、跨 Agent 复用具体流程。

---

## 4. 二维矩阵：横向领域 × 纵向能力

可以把个人 Agent 系统想象成一个矩阵：

```text
                    Skills（纵向工作流能力）

                 Git   Server   Plot   Table   Review   Report   Eval
                  │      │       │       │       │        │       │
Harness           │      │       │       │       │        │       │
──────────────────┼──────┼───────┼───────┼───────┼────────┼───────┤
ML Project         ✓      ✓       ✓       ✓       ✓        ✓       ✓
Wealth Manager     ✓      -       ✓       ✓       ✓        ✓       ✓
Writing Agent      ✓      -       -       ✓       ✓        ✓       ✓
Ops Agent          ✓      ✓       -       -       ✓        ✓       ✓
Research Agent     ✓      ✓       ✓       ✓       ✓        ✓       ✓
```

横向一行，是一个 harness。

纵向一列，是一个 skill。

一个专门 Agent 的能力，来自：

```text
这个 harness 的领域上下文
  +
它挂载、配置、维护的 skills
```

---

## 5. Harness 与 Skills 的关系

两者不是彼此替代，而是互相支撑。

可以这样定义：

```text
Harness 负责选择、组合、配置、约束 skills。
Skills 负责把高频工作流沉淀成可复用能力。
```

也就是说：

> **Harness 负责横向一致性，Skills 负责纵向复用性。**

横向一致性指：

```text
这个领域里的目标、状态、边界、账本、节奏是否一致。
```

纵向复用性指：

```text
同一种工作流是否能跨领域沉淀、复用、改进。
```

例如 ML 项目管理 harness 可以维护这些 skills：

```text
skills/
  git-workflow/
  remote-server-ops/
  experiment-tracking/
  plotting-style/
  table-style/
  model-evaluation-report/
  paper-claim-check/
```

其中 `plotting-style` 可能最初来自 ML 项目的实践，但成熟后可以被科研写作、数据分析、财富管理报告等其他 harness 复用。

这形成一条抽象路径：

```text
具体项目里的重复做法
  ↓
某个 harness 的局部规则
  ↓
稳定 workflow
  ↓
抽象为 skill
  ↓
被其他 harness 复用
```

---

## 6. 什么时候留在 Harness，什么时候沉淀成 Skill

区分 harness 与 skill 的关键，不是看它是不是一个文档，而是看它是否具有跨领域复用性。

### 6.1 留在 Harness：领域特定内容

如果一个规则、状态或流程强绑定当前领域，就应该留在 harness 中。

例如：

- 这个财富管理 Agent 的风险偏好；
- 这个 ML 项目的实验命名规范；
- 这个科研项目的研究问题；
- 这个 repo 的目录约定；
- 这个用户的隐私边界；
- 当前项目状态；
- 当前任务队列；
- 当前决策账本。

这些内容不适合抽象成通用 skill，因为它们是某个领域的横向上下文。

### 6.2 沉淀成 Skill：可复用流程

如果一个流程可以跨领域重复使用，就适合沉淀为 skill。

例如：

- 如何做 Git 分支管理；
- 如何操作远程服务器；
- 如何写实验报告；
- 如何统一图表风格；
- 如何检查表格一致性；
- 如何做 weekly review；
- 如何做 incident review；
- 如何写 proposal；
- 如何做 self-evaluation。

这些是纵向工作流能力。

### 6.3 实践规则：重复三次再抽象

避免过早抽象，可以采用一个简单规则：

```text
第一次：写在当前 harness 的 workflow/rules 里。
第二次：复制到另一个场景时，标记它可能可复用。
第三次：抽象成 skill。
```

这样能避免一开始制造大量无人使用的 skill。

---

## 7. Skill Manifest：Harness 如何管理 Skills

一个 harness 不应该隐式地“知道”自己有哪些 skills。

更好的方式是维护一个 skill manifest：

```text
harnesses/ml-project-manager/skill-manifest.md
```

示例：

```markdown
# Skill Manifest: ML Project Manager

## Active skills

- git-workflow
- remote-server-ops
- experiment-tracking
- plotting-style
- table-style
- weekly-review
- self-evaluation

## Domain-specific overrides

### plotting-style

- 默认输出论文级图表
- 所有图必须登记 experiment id
- 禁止无来源图表进入 paper/

### remote-server-ops

- 禁止删除远程数据目录
- 长任务必须写入 run log
- GPU 任务必须记录资源占用
```

这样 skill 本身保持通用，harness 可以对它做领域配置。

这很重要，因为同一个 skill 在不同 harness 中可能需要不同约束。

例如 `remote-server-ops`：

- 在 ML harness 中关心 GPU、数据集、checkpoint；
- 在 Ops harness 中关心服务进程、日志、回滚；
- 在 Research harness 中关心实验复现和数据保存。

---

## 8. Core Protocol、Domain Pack、Skill Library、Eval Loop

一个可扩展的个人 Agent 系统，可以拆成四层：

```text
Core Protocol
  所有专门 Agent 共用的基本工作协议。

Domain Harness
  某个领域 / 项目的横向治理结构。

Skill Library
  跨领域复用的纵向工作流能力。

Eval Loop
  评价 harness 与 skills 是否有效，并推动迭代。
```

更具体地说：

```text
core/
  protocol.md
  state-format.md
  eval-loop.md

harnesses/
  ml-project-manager/
    mission.md
    boundaries.md
    state.md
    domain-rules.md
    skill-manifest.md
    ledgers/

  wealth-manager/
    mission.md
    boundaries.md
    state.md
    domain-rules.md
    skill-manifest.md
    ledgers/

skills/
  git-workflow/
    SKILL.md
  remote-server-ops/
    SKILL.md
  plotting-style/
    SKILL.md
  table-style/
    SKILL.md
  weekly-review/
    SKILL.md
  incident-analysis/
    SKILL.md
```

这个结构的好处是：

```text
新增一个 Agent = 复用 core + 新建 harness + 挂载现有 skills + 补少量 domain rules
```

随着 skills 增多，创建新专门 Agent 的成本会越来越低。

---

## 9. ML 项目管理示例

机器学习项目很适合展示这个二维模型。

### 9.1 ML Project Harness 横向管理什么

一个 ML project harness 可能维护：

```text
研究目标；
baseline；
实验周期；
数据集版本；
模型 checkpoint；
评估指标；
算力预算；
远程环境；
实验命名约定；
报告节奏；
论文或产品目标。
```

这些内容是项目级、领域级、长期状态。

### 9.2 它挂载哪些纵向 Skills

它可能使用：

```text
Git 版本管理 skill
远程服务器操作 skill
实验启动 skill
实验结果归档 skill
绘图风格 skill
表格风格 skill
模型评估 skill
论文 claim 检查 skill
weekly review skill
incident analysis skill
```

这些 skill 不只服务 ML 项目。

例如 `table-style` 可以被：

- ML 实验报告；
- 科研论文；
- 财富管理月报；
- 运营分析报告；

共同使用。

这就是纵向复用。

---

## 10. Harness Factory：个人 Agent 系统的复利结构

如果持续沿这个二维模型积累，最终会得到一个 harness factory。

它不是一个厚平台，而是一组可组合资产：

```text
harness-factory/
  core/
  harness-templates/
  domain-packs/
  skills/
  eval-patterns/
  scripts/
```

每次创建新专门 Agent 时，不再从零开始，而是组合：

```text
core protocol
  +
domain harness
  +
selected skills
  +
eval loop
```

例如创建 Health-Tracker-Agent：

```text
复用：weekly-review
复用：report-generation
复用：chart-style
复用：incident-analysis
新增：health domain rules
新增：privacy boundaries
新增：health-specific eval metrics
```

这就是个人知识与工作流的复利。

每个新 harness 会产生新经验。

每个成熟 skill 会降低未来所有 harness 的开发成本。

---

## 11. 二维模型的风险

这个结构也有风险。

### 11.1 过早抽象 Skills

如果还没在真实 harness 中反复使用，就急着写 skill，会产生大量空泛文档。

解决方式：重复三次再抽象。

### 11.2 Harness 过度领域化，无法复用

如果每个 harness 都把所有流程写死，skills 就无法沉淀。

解决方式：定期检查哪些 workflow 可以抽成 skill。

### 11.3 Skills 过度通用，无法落地

如果 skill 写得太抽象，它在任何 harness 中都不好用。

解决方式：允许 harness 对 skill 做 domain-specific overrides。

### 11.4 没有 Eval Loop

如果没有定期评估，harness 和 skills 都会腐烂。

解决方式：每个 harness 都需要 review loop，每个 skill 也需要维护记录。

---

## 12. 结论

个人 Agent 系统的关键，不只是“写一个 harness”，也不是“积累一堆 skills”。

更重要的是同时理解两个维度：

```text
Harness：横向领域治理
Skills：纵向流程复用
```

Harness 让 Agent 在一个领域里有身份、目标、边界、状态和长期节奏。

Skills 让具体工作流能够跨领域沉淀、迁移和持续改进。

二者结合，才会形成真正可复利的个人 Agent 工程体系。

最终可以总结为：

> **Harness 提供上下文和治理，Skills 提供可复用能力。一个成熟的个人 Agent 系统，应该让 harness 横向生长，让 skills 纵向沉淀，并通过 eval loop 持续修正二者的关系。**
