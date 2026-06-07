# Target 与 Harness：AI Agent 时代的仓库边界

## 核心论点

AI Agent 时代的 repo 不再只是存放目标系统本身。它会逐渐演化成一个复合体：

```text
repo = target + harness
```

其中：

- **target** 是最终要交付、运行、展示或被用户使用的对象；
- **harness** 是围绕 target 建立的工程控制系统，用来让人类和 Agent 能可靠地理解、修改、验证和演化 target。

换句话说：

```text
Target 回答：我们要造什么？
Harness 回答：Agent 如何可靠地把它造出来、改下去、验明白？
```

这不是一个纯概念划分，而是 AI Agent 参与软件工程之后，repo 结构正在发生的实际变化。

---

## 1. 为什么需要重新区分 Target 与 Harness

过去我们看一个软件仓库，默认它主要承载“被开发对象”：业务代码、资源、配置、文档、测试等。

但 AI Agent 进入开发流程之后，问题发生了变化。

过去的核心问题是：

```text
人能不能写出代码？
```

现在越来越变成：

```text
Agent 能不能理解这个项目？
Agent 能不能找到正确入口？
Agent 能不能知道哪些地方不能动？
Agent 能不能在有限上下文里完成任务？
Agent 做完以后有没有外部反馈证明它做对了？
人类能不能低成本信任这个过程？
```

于是，repo 里开始出现越来越多不是“产品本体”，却会强烈影响 Agent 工作质量的工件：

- `AGENTS.md`；
- 目录级说明；
- 任务 SPEC；
- 架构约束；
- 自定义检查脚本；
- CI workflow；
- prompt 模板；
- review checklist；
- single source of truth 规则；
- 完成信号和交接规则。

这些东西的共同点是：它们不一定直接产生用户价值，但它们让 target 的生产和演化过程更可靠。

这就是 repo 中的 harness。

---

## 2. Target：最终要交付的对象

Target 是项目最终要产生的东西。

在不同项目里，target 可以是：

- 一个应用；
- 一个网站；
- 一个库；
- 一组 API；
- 一个命令行工具；
- 一套文档；
- 一篇文章；
- 一个研究档案；
- 一个可复用模板；
- 一个产品级系统。

它回答的是：

> 这个项目最终要给用户、读者或使用者什么？

在普通应用仓库中，target 往往是：

```text
src/
业务逻辑
数据模型
前端页面
API endpoint
运行时配置
```

在这个 `harness-engineering` 项目里，target 则更像是：

```text
concepts/      概念笔记
thinking/      独立思考
works/         翻译与原创作品
references/    文章索引
practice/      实验记录
README.md      对外展示入口
```

也就是说，target 不一定是代码。只要它是项目最终希望交付、展示或沉淀的对象，它就是 target。

---

## 3. Harness：让 Target 被可靠生产的系统

Harness 不是 target 本身，而是围绕 target 的“开发控制平面”。

它回答的是：

> 人和 Agent 应该怎样理解、修改、验证这个 target？

一个 harness 通常包含几类工件。

### 3.1 文档型 Harness

文档型 harness 给 Agent 提供地图和上下文。

例如：

- `README.md`；
- `AGENTS.md`；
- `architecture.md`；
- `SPEC.md`；
- `decisions/*.md`；
- `runbook.md`；
- `glossary.md`；
- 子目录说明文件。

它们告诉 Agent：

```text
这个项目是什么；
应该从哪里开始；
哪些目录负责什么；
哪些规则必须遵守；
什么结果才算完成；
遇到问题应该看哪里。
```

这类工件的作用是前馈：在 Agent 行动之前减少误解。

### 3.2 规则型 Harness

规则型 harness 定义边界。

例如：

- 模块依赖方向；
- 文件命名规范；
- 数据结构约定；
- single source of truth；
- “新增 X 必须同步更新 Y”；
- 哪些目录可以改；
- 哪些文件只读；
- 哪些改动必须经过 review。

规则可以先写在文档里，但如果它足够重要，最好继续机械化。

### 3.3 工具型 Harness

工具型 harness 把规则变成可执行反馈。

例如：

- test runner；
- linter；
- type checker；
- build script；
- consistency checker；
- dead link checker；
- API contract test；
- CI workflow。

它们让 Agent 做完以后可以知道：

```text
我是不是做对了？
哪里不一致？
哪里违反规则？
下一步应该修什么？
```

这类工件的作用是反馈：在 Agent 行动之后检查结果。

### 3.4 流程型 Harness

当任务需要多轮迭代时，harness 会变成流程。

例如：

```text
Planner → Builder → Critic → Finalizer
```

或者：

```text
读取任务 → 制定计划 → 修改文件 → 运行检查 → 根据失败修正 → 输出报告 → 等待确认
```

Ralph Orchestrator 就是这种流程型 harness：它不只是给 Agent 一个 prompt，而是定义角色、交接、失败重试、完成信号和退出条件。

### 3.5 环境型 Harness

完整 harness 还包括 Agent 的执行环境：

- 文件系统沙箱；
- git worktree；
- terminal；
- browser；
- mock server；
- database fixture；
- MCP 工具；
- 权限边界；
- 日志系统。

这决定 Agent 能看见什么、能执行什么、不能碰什么、如何观察结果。

所以 harness 不只是“告诉 Agent 怎么做”，也是“给 Agent 一个可控的工作环境”。

---

## 4. Target 与 Harness 的边界判断

Target 和 harness 不一定能按目录或文件类型干净二分。

更可靠的判断方式，是看一个工件在当前场景中承担什么角色。

### 4.1 它是否直接产生最终价值？

如果一个工件直接面向用户、读者或产品运行，它更接近 target。

例如：

- 用户页面；
- 业务 API；
- 数据模型；
- 文章正文；
- 翻译作品；
- 研究成果。

如果它主要服务开发者、Agent、CI 或 review 流程，它更接近 harness。

例如：

- `AGENTS.md`；
- 检查脚本；
- CI 配置；
- 架构规则；
- 任务 SPEC；
- review checklist。

### 4.2 删除它后，产品是否还能运行或展示？

如果删除一个文件后，产品本身不能运行或内容缺失，它多半是 target。

如果删除后产品还能运行或展示，但开发、维护、验证、Agent 接管能力显著下降，它多半是 harness。

例如：

```text
删除业务 service → 产品坏了。
删除 consistency check → 产品仍能展示，但长期一致性风险上升。
```

### 4.3 它改变的是产品行为，还是开发行为？

如果一个文件主要改变产品运行时行为，它更接近 target。

如果它主要改变 Agent、开发者或 CI 如何工作，它更接近 harness。

例如：

```text
修改 checkout.ts → 改变用户结账行为。
修改 AGENTS.md → 改变 Agent 如何理解项目。
修改 test_checkout.py → 改变验证行为。
修改 ci.yml → 改变交付门控。
```

---

## 5. 边界不是绝对的：同一工件可以兼具两种身份

真实 repo 中，很多工件不是纯 target，也不是纯 harness。

README 就是典型例子。

对读者来说，README 是项目展示页面，属于 target 的一部分。

对 Agent 来说，README 又是理解项目的入口，承担 harness 职能。

`references/articles.md` 在本项目里也有双重身份：

- 它是研究资料库的一部分，因此是 target；
- 它又是文章计数的 single source of truth，因此是 harness。

测试也是如此：

- 对最终用户来说，测试不是产品；
- 对开发过程来说，测试是最重要的 sensor；
- 对 Agent 来说，测试定义了可验证的完成边界。

因此，target / harness 的边界应按“功能角色”判断，而不是按“文件类型”判断。

---

## 6. Repo as System of Record 的扩展

AI Agent 时代，“repo as system of record” 的含义会变得更强。

过去 repo 主要记录：

```text
系统当前是什么样子。
```

现在 repo 还需要记录：

```text
Agent 应该如何理解这个系统；
Agent 应该如何修改这个系统；
Agent 应该如何验证自己做对了；
人类如何低成本信任这个过程。
```

这意味着，repo 不再只是存放代码或内容，而是要存放 Agent 的工作条件。

如果关键知识只存在于：

- 人脑；
- Slack；
- 飞书文档；
- 一次性聊天；
- 老工程师的习惯；
- 未记录的历史事故；

那么 Agent 就无法稳定利用。

但如果这些知识进入 repo，它们就可以被：

- Agent 读取；
- git 版本化；
- PR 审查；
- CI 验证；
- 多个 Agent 共享；
- 后续维护者继承。

因此，agent-friendly repo 的核心趋势是：

```text
repo 从“代码/内容仓库”变成“目标系统 + 驭缰系统”的复合体。
```

---

## 7. 好 Harness 的几个特征

一个好的 harness 不只是“很多文档”或“很多检查”。它应该降低 Agent 成功完成任务的成本。

可以用下面几个问题判断。

### 7.1 Agent 能不能快速知道项目是什么？

如果 Agent 进入仓库后需要随机搜索很久，说明地图不足。

### 7.2 Agent 能不能知道当前任务该看哪里？

如果所有知识都散落在各处，没有入口和分层，说明渐进式披露不足。

### 7.3 Agent 能不能知道哪些地方不能动？

如果边界不清楚，Agent 很容易做出局部合理、全局破坏的改动。

### 7.4 Agent 做完后有没有外部反馈？

如果只能靠 Agent 自评，结果就不可靠。

测试、lint、CI、一致性检查、review gate 都是必要反馈。

### 7.5 反馈失败后，Agent 能不能修正？

好的 sensor 不只是说“错了”，还应该让错误可定位、可理解、可修复。

### 7.6 人类是否从重复劳动中解放出来？

如果人类还要反复提醒同一条规则，说明规则没有真正 harness 化。

### 7.7 新知识能否沉淀进系统？

如果每次踩坑都只停留在聊天里，下次 Agent 还会再踩。

好的 harness 会把经验沉淀成文档、规则、脚本或测试。

---

## 8. Harness 的设计目标：任务胶囊化

一个好的 harness 最终应该提升项目的 **胶囊化能力**。

所谓胶囊化能力，就是：

> 能否把复杂系统切成 Agent 可以独立理解、修改、验证的小任务单元。

一个适合 Agent 接管的任务胶囊，至少应该有：

- 清楚目标；
- 有限上下文；
- 明确输入输出；
- 明确允许修改范围；
- 明确禁止修改范围；
- 可运行验证；
- 完成信号。

如果一个小改动会牵动全局状态、隐式配置、历史 hack、外部服务和未知业务规则，那它就不是好胶囊。

Harness 的意义，就是把原本纠缠的项目逐步整理成更容易被 Agent 局部接管的结构。

---

## 9. Harness 不是消灭人类，而是重新安排人类位置

好的 harness 不是为了把人类从工程中完全移除。

它的目标是把人类从重复、机械、低杠杆的工作中解放出来，让人类出现在真正需要判断的位置。

人类不应该反复做：

- 口头提醒同一条规则；
- 手动检查机械一致性；
- 解释每个目录；
- 指出显而易见的测试失败；
- 重复传递已经可以写进 repo 的背景知识。

这些应该交给 harness。

人类应该负责：

- 定义目标；
- 判断取舍；
- 设定边界；
- 提供隐性业务知识；
- 审查关键决策；
- 决定什么才算有价值。

所以更准确的说法不是“无人化开发”，而是：

> 让人类掌舵，让 Agent 在 harness 中执行。

---

## 10. 对本项目的回看

`harness-engineering` 这个项目本身就是一个很好的例子。

它的 target 包括：

```text
concepts/      概念笔记
thinking/      独立思考
works/         翻译与原创作品
references/    文章索引
practice/      实验记录
README.md      对外展示入口
```

它的 harness 包括：

```text
AGENTS.md                       项目地图
子目录 AGENTS.md                局部导航
scripts/check-consistency.sh     一致性 sensor
.githooks/pre-commit             本地 gate
.github/workflows/consistency.yml CI gate
references/articles.md           single source of truth 规则
prompts/                         可复用提示词
README 中的维护说明              开发约束
```

这个项目一边研究 Harness Engineering，一边用 repo 结构、AGENTS.md、single source of truth 和一致性检查实践 Harness Engineering。

这说明 harness 不是一个额外装饰，而是一种组织项目的方式。

---

## 11. 结论

AI Agent 时代的软件工程，不只是写 target，也要设计 target 周围的 harness。

谁能把目标、上下文、约束、工具、反馈和人类判断组织进 repo，谁就更能让 Agent 可靠地工作。

因此，未来的高质量 repo 很可能会同时具备两种可读性：

```text
对用户可读：知道这个项目提供什么价值；
对 Agent 可读：知道如何安全、可靠、可验证地修改这个项目。
```

最终可以把这件事概括为：

> **Target 是要交付的对象；harness 是让交付持续可靠发生的系统。AI Agent 时代的 repo，会越来越成为二者的共生体。**
