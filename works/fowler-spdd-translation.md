---
sourceTitle: "Structured-Prompt-Driven Development (SPDD)"
sourceUrl: "https://martinfowler.com/articles/structured-prompt-driven/"
sourceAuthor: "Wei Zhang; Jessie Jie Xia"
sourcePublishedAt: "2026-04-28T00:00:00+00:00"
title: "Structured-Prompt-Driven Development（SPDD）"
summary: "一种用结构化提示词引导 AI 辅助编程的方法，让 LLM 辅助的变更更可治理、可审查、可复用。"
language: "zh-CN"
translationMethod: "baoyu-translate skill"
sourceFigureCount: 9
---

# Structured-Prompt-Driven Development（SPDD）

如何让 LLM 辅助的变更可治理、可审查、可复用

一旦团队采用 AI 编码助手，最早显现的收益通常出现在个人层面：一个开发者可以比过去更快地起草、修改和重构代码。但交付速度很少受限于打字。当你审视从需求到发布的完整交付生命周期时，新的摩擦会出现：

- 模糊需求会迅速变成代码，误解也随之放大。
- 评审必须处理更多变更，也更容易引入不一致。
- 更多集成和测试问题会浮现，因为"生成出来"并不等于"对齐了"。
- 当变更量上升时，生产风险更难推理。

所以，是的，局部速度提高了。但这不会自动转化为系统层面的吞吐。这就像买了一辆法拉利，却把它开在泥泞道路上：发动机很强，但到达时间由路况和交通决定。根据我们的经验，真正的问题不是"我们如何生成更多代码？"而是：我们如何让 AI 生成的变更可治理、可审查、可复用，从而让团队更快也更安全？

这引导 Thoughtworks 内部 IT 团队（Global IT Services）形成了一套方法和工作流，我们现在称之为 Structured Prompt-Driven Development（SPDD，结构化提示驱动开发）。SPDD 旨在把 AI 辅助从个人效率转化为可扩展的组织级能力，同时不牺牲质量。

[![SPDD 把 AI 辅助从个人效率扩展为组织能力](https://martinfowler.com/articles/structured-prompt-driven/spdd-overview.svg)](https://martinfowler.com/articles/structured-prompt-driven/spdd-overview.svg)

提示词作为一等交付物

## 什么是 SPDD？

Structured Prompt-Driven Development（SPDD）是一种工程方法，它把提示词视为一等交付物。

SPDD 不依赖临时聊天，而是把提示词变成可以版本控制、审查、复用并持续改进的资产。团队使用结构化提示词来捕捉需求、领域语言、设计意图、约束和任务拆解。然后，LLM 在定义好的边界内生成代码，使输出更可预测，也更容易验证。

它有两个核心组成部分。

### REASONS Canvas

REASONS Canvas 是一种生成提示词的结构。它强制围绕需求、领域模型、解决方案方法、系统结构、任务拆解、可复用规范和护栏建立清晰性。因此，LLM 是由意图引导，而不是靠猜测。

REASONS Canvas 是一个七部分结构，引导提示词从意图 → 设计 → 执行 → 治理。

[![REASONS Canvas 的七个提示词结构部分](https://martinfowler.com/articles/structured-prompt-driven/spdd-reason-canvas.svg)](https://martinfowler.com/articles/structured-prompt-driven/spdd-reason-canvas.svg)

**抽象部分（意图与设计）**

- R — Requirements：我们要解决什么问题，DoD 是什么？
- E — Entities：领域实体及其关系。
- A — Approach：我们将如何满足需求的策略。
- S — Structure：变更放在系统中的哪里；组件和依赖。

**具体部分（执行）**

- O — Operations：把抽象策略拆成具体、可测试的实现步骤。

**通用标准部分（治理）**

- N — Norms：横切工程规范（命名、可观测性、防御式编码等）。
- S — Safeguards：不可协商的边界（不变量、性能限制、安全规则等）。

Canvas 在生成代码之前对齐意图和边界，把不确定性左移。由于结构化提示词捕捉了完整规格，评审者可以围绕单一工件推理，而不是在分散的聊天记录和零散 diff 中来回寻找。通过遵循同一种结构，每个提示词都能以同样方式被治理。随着领域知识和设计决策在每个提示词中累积，它们会在迭代中复合个人经验，并降低团队内部的变异性。

### SPDD 工作流

这个工作流把提示词带入与代码相同的纪律：提交历史、评审和质量门。它还强制一条简单但强有力的规则：

当现实发生偏离，先修提示词，再更新代码。

随着时间推移，这会改变团队的工作方式。评审从"找 bug"转向"检查意图"。返工变得更可控。成功模式自然积累成可复用的提示词库，支撑 AI-First Software Delivery（AIFSD）。

如果你了解过 [Spec-Driven Development](https://en.wikipedia.org/wiki/Spec-driven_development)，会认出相同的起点：先把 spec 写清楚，再让模型实现。SPDD 采取了不同角度。它把结构化提示词视为受治理、可复用、版本化的团队资产（REASONS + workflow），并让它随代码一起演进。这是一种 Birgitta Böckeler 归类为 [spec-anchored](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html) 的方法。

SPDD 工作流的目标，是把业务输入 → 抽象 → 执行 → 验证 → 发布转化为一个*闭环* 1，并确保提示词资产和代码一起演进，而不是分离演进。

1：在单向流水线中，需求产生代码，流程到此结束；任何后续调整都只发生在代码中，原始意图会逐渐过期。在 SPDD 中，闭环发生在两个尺度上。在一次迭代内，反馈会回流：逻辑修正先更新提示词，再更新代码；重构则从代码同步回提示词，这样两边都不会悄悄偏离。跨迭代时，累积的提示词资产（领域模型、设计决策、规范等）会成为下一次增强的起始上下文，因此每个周期都建立在受治理的基线之上，而不是从零开始。

[![SPDD 闭环工作流：提示词、代码和反馈同步演进](https://martinfowler.com/articles/structured-prompt-driven/spdd-workflow.svg)](https://martinfowler.com/articles/structured-prompt-driven/spdd-workflow.svg)

SPDD 工作流

这个工作流的目标，是把协作锚定在提示词上，让开发者和产品负责人避免反复对齐。提示词为代码生成设定明确边界，减少 LLM 非确定性的随机性，使其更容易治理。通过把结构化提示词作为版本控制中的一等工件，我们把成功实践转化为可复用资产，提高一致性，减少重复发明。

在实践中，这些步骤通过 [openspdd](https://github.com/gszhangwei/open-spdd) 提供的命令执行。openspdd 是一个实现 SPDD 工作流的命令行工具。下表总结了每个命令。

| 命令 | 类型 | 用途 |
| --- | --- | --- |
| [/spdd-story](https://github.com/gszhangwei/open-spdd/blob/v0.4.9/internal/templates/data/optional/spdd-story.md) | 可选 | 按 INVEST 原则把大型需求拆成独立、可交付的用户故事。 |
| [/spdd-analysis](https://github.com/gszhangwei/open-spdd/blob/v0.4.9/internal/templates/data/core/spdd-analysis.md) | 核心 | 从需求中提取领域关键词，扫描相关代码，并生成涵盖领域概念、风险和设计方向的战略分析。 |
| [/spdd-reasons-canvas](https://github.com/gszhangwei/open-spdd/blob/v0.4.9/internal/templates/data/core/spdd-reasons-canvas.md) | 核心 | 生成完整 REASONS Canvas，即从高层理由到方法级操作的可执行蓝图。 |
| [/spdd-generate](https://github.com/gszhangwei/open-spdd/blob/v0.4.9/internal/templates/data/core/spdd-generate.md) | 核心 | 读取 Canvas 并逐任务生成代码，严格遵循提示词中定义的操作、规范和护栏。 |
| [/spdd-api-test](https://github.com/gszhangwei/open-spdd/blob/v0.4.9/internal/templates/data/optional/spdd-api-test.md) | 可选 | 生成基于 cURL 的 API 测试脚本，包含覆盖正常、边界和错误场景的结构化测试用例。 |
| [/spdd-prompt-update](https://github.com/gszhangwei/open-spdd/blob/v0.4.9/internal/templates/data/core/spdd-prompt-update.md) | 核心 | 当需求变化时增量更新 Canvas（需求 → 提示词 → 代码）。 |
| [/spdd-sync](https://github.com/gszhangwei/open-spdd/blob/v0.4.9/internal/templates/data/core/spdd-sync.md) | 核心 | 把代码侧变更（重构、修复）同步回 Canvas，让提示词保持为当前代码的准确记录（代码 → 提示词）。 |

## 用 SPDD 增强 billing engine

复杂工作流很难抽象理解，所以我们准备了一个增强既有软件系统的示例工作流。这个系统及其增强必然很小，才能在教程文章中保持可理解。即便如此，这个增强示例仍是完整的端到端示例：从创建初始需求，到分析业务需求，到生成和审查结构化提示词，再到生成并验证代码，最后清理和测试。

你可以在自己的环境中安装 [openspdd](https://github.com/gszhangwei/open-spdd)，跟着这个示例操作。

### 当前系统

当前系统是一个简单的 billing engine，用于计算大语言模型使用费用。它接受一条记录，记录某个会话使用了多少 token，并据此计算账单。

这个初始版本的完整代码库[可在 GitHub 获取](https://github.com/gszhangwei/token-billing/tree/iteration-1-end)。仓库包含[初始需求故事](https://github.com/gszhangwei/token-billing/blob/iteration-1-start/requirements/token-usage-billing-story.md)以及[用于生成它的全部 SPDD 工件](https://github.com/gszhangwei/token-billing/compare/iteration-1-start...iteration-1-end)。为简洁起见，我们不描述那次初始生成；它本质上遵循与本次增强相同的步骤。我们重点描述增强，因为系统上的大多数工作都是增强。

### 增强需求

受不断演进的业务需求和直接用户反馈驱动，我们正在增强 billing engine，使其从静态定价模型转向更复杂、更灵活的基础设施。本次更新旨在通过以下关键变更支持多样化订阅策略和按模型变化的定价：

- API 增强：更新现有 `POST /api/usage` endpoint，使其接受新的必填 `modelId` 参数（例如 "fast-model"、"reasoning-model"）。
- 模型感知定价：从单一全局费率转向动态定价，即费用取决于调用的具体 AI 模型。
- 多套餐 billing 逻辑：根据客户订阅层级引入不同 billing 行为：
- Standard plan（优化）：保留全局月度配额，但任何超额使用现在按模型特定费率计算。
	- Premium plan（新增）：没有配额限制。引入拆分 billing，prompt tokens 和 completion tokens 根据所用模型以不同费率分别计费。
- 架构可扩展性：实现可扩展设计模式（例如 Strategy 或 Factory），干净地隔离不同套餐的计算公式，确保系统可以轻松容纳未来定价模型。

*由于这个新部分同时包含业务需求和技术细节，它通常需要在 PO（或 BA）与开发者之间通过结对会话协作完成。*

### 第 1 步：创建初始需求

为了快速启动流程，我们可以使用 `/spdd-story` 2 命令，直接基于增强想法生成用户故事。一般来说，用户故事由 PO 或 BA 提供。不过，在我们的工作流中，可以把任何形式的故事转化为一致的格式和维度。只要最终验收标准达成共同对齐，这一步就可以由 PO、BA 或开发者执行，取决于团队灵活的分工。

2：由于这是一个可选命令，如果你的本地环境中没有，可以运行 `openspdd generate spdd-story` 来生成它。

Instruction:

### spdd-story 如何工作

这个命令按 INVEST 原则（每个故事 1-5 天工作量）把大型需求拆成独立、可交付的用户故事。每个故事都包含用业务语言写成的验收标准，可以直接作为 `/spdd-analysis` 的输入。

它的目的是让大型需求可管理，并为后续步骤确保标准化、可预测的格式。

/spdd-story @ [idea-of-the-enhancement.md](https://github.com/gszhangwei/token-billing/blob/spdd-article-snapshot/requirements/idea-of-the-enhancement.md)

AI 分析了增强描述，并把它拆成两个用户故事：

- [Story 1-1（Standard Plan 与模型感知定价）](https://github.com/gszhangwei/token-billing/blob/spdd-article-snapshot/requirements/%5BUser-story-1-1-initial%5DMulti-Plan-Billing-Foundation-%26-Standard-Plan-Model-Aware-Pricing.md)
- [Story 1-2（Premium Plan 拆分费率 billing）](https://github.com/gszhangwei/token-billing/blob/spdd-article-snapshot/requirements/%5BUser-story-1-2-initial%5DPremium-Plan-Split-Rate-Billing.md)

自动生成的故事足够详细，可以作为正式项目的基线。为了让这个 walkthrough 保持自包含，我们把它们合并成一个简化故事。

Instruction:

把下面两个用户故事合并成一个简化的单一故事：
@\[User-story-1-1-initial\]Multi-Plan-Billing-Foundation-&-Standard-Plan-Model-Aware-Pricing.md
@\[User-story-1-2-initial\]Premium-Plan-Split-Rate-Billing.md

Requirements:
1\. 合并两个套餐（Standard 和 Premium），形成一个连贯故事。
2\. 只保留这些章节：Background、Business Value、Scope In、Scope Out 和 Acceptance Criteria。
3\. 去除实现层细节，关注系统应该做什么，而不是如何做。
4\. Acceptance Criteria 必须使用 Given/When/Then 格式，并包含具体数字示例。
5\. 保持结果简洁，不超过一页。
6\. 只保留三个高层 AC。

这类指令很少在每次运行时产生完全相同的文本；模型和采样会引入小差异。因此，在把输出视为最终版本前，我们仍然会审查和微调。下面的合并故事，是我们为这个 walkthrough 精修后的版本：它有意简化了两个初始故事。

### 第 2 步：澄清分析

在跳入实现之前，开发者审查用户故事，以建立对其实际含义的共同理解。如果存在明显的业务层问题，这就是与 BA 或 PO 对齐的时机。在这个案例中，故事已经足够清晰，所以我们直接沿三个维度拆解：核心逻辑、范围边界和完成定义。

**核心逻辑**

API 上新增一个必填字段：`modelId`。客户现在会告诉我们他们使用了哪个 AI 模型，这是解锁正确价格的关键。

- *Standard Plan:* 客户有月度 token 配额。配额内使用免费。超额按模型特定费率收费（例如 fast-model $0.01/1K vs. reasoning-model $0.03/1K）。既有配额逻辑保留；只有费率查找发生变化。
- *Premium Plan:* 没有配额。每个 token 从第一个开始计费。Prompt tokens 和 completion tokens 分别按模型特定费率收费。Bill = prompt charge + completion charge。这个套餐是全新的。
- *Routing:* 系统确定客户套餐，并分派到匹配的 billing 公式。设计必须易于扩展，Enterprise plan（Story 2）会是下一步。

**范围边界**

我们只计算当前账单。我们不构建客户 CRUD，不查询历史账单，不管理订阅，也不增删模型。

**完成定义**

下面的场景用实现细节重述故事的验收标准，以便团队验证。第四项（Response format）不是新的业务 AC，而是开发者添加的非功能契约，用来让标准可端到端测试。

- *Validation:* 缺少 `modelId` → HTTP 400。未知客户 → HTTP 404。负 token → HTTP 400。所有既有验证保持不变。
- *Standard Plan billing:* 一个客户有 100K 配额，已经使用 90K，提交 30K tokens 给 fast-model（$0.01/1K）。预期结果：10K 被配额覆盖，20K 超额，收费 $0.20。同一请求使用 reasoning-model（$0.03/1K）得到 $0.60，同样的配额逻辑，不同费率。
- *Premium Plan billing:* 一个客户为 reasoning-model 提交 10K prompt tokens + 20K completion tokens（prompt $0.03/1K，completion $0.06/1K）。预期结果：$0.30 + $1.20 = $1.50。没有配额，没有超额；prompt 和 completion 分别计费。
- *Response format:* HTTP 201 返回 bill ID、customer ID、token counts、timestamp、`modelId`，以及适合套餐的 charge breakdown。

如果所有这些场景都通过，我们就征服了这个故事。

### 第 3 步：生成分析上下文

有了澄清后的需求和范围，我们使用 `/spdd-analysis` 命令。通过把业务需求喂给它，我们指示 AI 生成一份全面的分析上下文。

### spdd-analysis 如何工作

这个命令从业务需求中提取领域关键词（例如 "billing"、"quota"、"plan"），并用它们只扫描代码库中的相关部分，而不是全部代码。它识别既有概念、新概念、关键业务规则和技术风险。

输出是一份上下文丰富的文档，涵盖领域概念识别、战略方向和风险分析。它作为下一步生成 REASONS Canvas 的输入。

Instruction:

/spdd-analysis @\[User-story-1\]Multi-Plan-Billing-Foundation-&-Model-Aware-Pricing.md

生成工件：[初始分析上下文文档](https://github.com/gszhangwei/token-billing/blob/after-enhancement/spdd/analysis/GGQPA-001-202603191100-%5BAnalysis%5D-multi-plan-billing-model-aware-pricing.md)。

这个命令生成一份基于实际代码库探索的战略级分析。输出完全关注 "what" 和 "why"，刻意避免在这个阶段进入细粒度实现细节。它通常覆盖：

- 领域概念：既有 vs. 新增、关系、业务规则
- 战略方法：解决方向、设计决策、取舍
- 风险与缺口：歧义、边界场景、技术风险、验收标准覆盖

#### 审查并精修分析上下文

带着我们自己对业务需求的理解，审查生成的分析文档，重点关注 [alignment](https://martinfowler.com/articles/structured-prompt-driven/alignment.html) skill 中强调的区域。这次审查有两个目的：确认我们的理解与 AI 的解释一致，以及发现 AI 可能提出而我们尚未考虑的边界场景或边缘案例。

在这个具体案例中，审查聚焦于几个关键区域：

- 是否恰当地考虑了 Strategy Pattern。
- 是否遵守既有系统中确立的 OOP 原则，特别是 ISP 和 SRP。
- 新字段添加策略是否有效。
- 识别此前未预料到的边界场景。
- 暴露潜在技术风险。

完成审查后，AI 的分析基本与我们的架构意图一致；事实上，在某些区域，它的考虑比我们更全面。

[![AI 分析文档中的边界场景和风险审查](https://martinfowler.com/articles/structured-prompt-driven/example-analysis-review.png)](https://martinfowler.com/articles/structured-prompt-driven/example-analysis-review.png)

来自[分析文档](https://github.com/gszhangwei/token-billing/blob/after-enhancement/spdd/analysis/GGQPA-001-202603191100-%5BAnalysis%5D-multi-plan-billing-model-aware-pricing.md#edge-cases)的边界场景和风险

坦率地说，在这个阶段，我们只有高层概念对齐。对于熟悉的部分，我们可以快速想象实现方式；但对于不熟悉的部分，还无法完全映射出所有细粒度技术细节。

不过，这完全没问题。总体方向已经对齐。我们可以进入下一步：观察 AI 如何在我们已建立的框架和上下文中"模拟"具体实现细节。一旦有了这些可触摸的细节，我们就能发现更深、更隐蔽的问题，并根据实际场景做出有根据的取舍，采用收益大于缺点的做法，丢弃其余部分。

Decision: 接受分析原样，并继续。

### 第 4 步：生成结构化提示词

### spdd-reasons-canvas 如何工作

这个命令读取业务上下文（`/spdd-analysis` 的输出，或直接需求描述），并结合代码库当前状态。然后，它跨七个 REASONS 维度生成设计规格，从"为什么做这件事"到"必须不能做什么"。

输出是一份可执行蓝图。Operations 部分精确到方法签名、参数类型和执行步骤。

Instruction:

/spdd-reasons-canvas @GGQPA-001-202603191100-\[Analysis\]-multi-plan-billing-model-aware-pricing.md

生成工件：[初始结构化提示词](https://github.com/gszhangwei/token-billing/blob/after-enhancement/spdd/prompt/GGQPA-001-202603191105-%5BFeat%5D-multi-plan-billing-model-aware-pricing.md)。

到这里，我们已经在分析阶段完成了高层策略，因此审查结构化提示词时，并不是从零开始。相反，我们是在检查 AI 是否把我们的共同理解忠实地翻译进 REASONS Canvas 结构：从策略，到抽象，再到具体细节。

可以把它看成一个递进过程：分析阶段给了我们战略清晰性；现在我们检查这种清晰性是否被贯彻到架构抽象和实现细节中。这是在更深层次上做意图对齐，确保在生成任何代码之前，AI 已经在我们定义的框架中有效"模拟"了整个解决方案。我们可以从全局视角审查，而不是一开始就陷入细节。

审查重点放在 [abstraction-first](https://martinfowler.com/articles/structured-prompt-driven/abstraction-first.html) skill 强调的区域。在这个案例中，基础上下文已经嵌入代码库和[之前的结构化提示词](https://github.com/gszhangwei/token-billing/blob/after-enhancement/spdd/prompt/GGQPA-XXX-202603131758-%5BFeat%5D-api-token-usage-billing.md)。因此，在为本次迭代生成结构化提示词时，AI 自然会考虑这些架构指南和 OO 原则。结果是，尽管生成内容高度复杂，重大问题却非常少。我们可以选择先用这个结构化提示词生成代码，然后再进行更深入的审查，识别潜在代码级异常。

到目前为止，我们已经在意图层面达成强共识，明确了核心问题和解决路径。虽然细节上可能略有遗漏，但这不值得担心；只要我们已经和 AI 对齐了整体范围，局部优化就非常可控。现在，我们进入代码生成阶段。

### 第 5 步：生成代码

这一步更复杂，因为我们会生成产品代码、测试，而评审会有两种不同结果。

#### 生成产品代码

一旦结构化提示词锁定，就用它生成产品代码。

### spdd-generate 如何工作

这个命令读取 REASONS Canvas，并按照 Operations 中定义的顺序逐任务生成代码。它严格遵守 Norms 中的编码标准和 Safeguards 中的约束，不即兴发挥，也不添加 spec 之外的功能。

核心原则是：提示词捕捉意图，代码是该意图的实现。生成代码必须与这份规格一一对应。

Instruction:

/spdd-generate @GGQPA-001-202603191105-\[Feat\]-multi-plan-billing-model-aware-pricing.md

生成工件：[基于结构化提示词生成的代码](https://github.com/gszhangwei/token-billing/commit/ac3e07b396e3ee8ab54b5a5ab838ff07a6bdd64b)。

由于前面几轮使用结构化提示词完成了多轮逻辑推演，我们在代码审查时会有清晰的重点和优先级：

1. 架构：代码是否严格遵循预期的三层架构？
2. 业务逻辑：Service 层实现是否完美对齐我们的初始意图？
3. 变更范围：修改是否严格限制在结构化提示词定义的边界内，避免无关变更或范围蔓延？

在这个具体案例中，由于上下文非常精确，生成代码基本满足我们的预期，除了一些潜在"魔法数字"。我们会在功能验证完成后优化掉这些问题。

这里的关键收获是：不要害怕犯错，也不要紧张于第一遍就抓住每个细节。只要我们持续通过 SPDD 工作流迭代和推进，就有很多机会校正方向。小的 code smell 暂时没关系，我们先验证核心功能，再回头优化。

#### 功能验证

在功能验证期间，SPDD 工作流提供 `/spdd-api-test` 命令来生成功能测试脚本。3

3：由于这是一个可选命令，如果你的本地环境中没有，可以运行 `openspdd generate spdd-api-test` 来生成它。

### spdd-api-test 如何工作

这个命令从代码实现或验收标准中提取 API endpoint 信息，并生成一个基于 cURL 的测试脚本。脚本包含结构化测试用例表，覆盖正常场景、边界条件和错误场景。执行时，它会输出 expected-vs-actual 对比结果。

Instruction:

/spdd-api-test

生成工件：[API 测试脚本](https://github.com/gszhangwei/token-billing/blob/after-enhancement/scripts/test-api.sh)。

在命令定义的规则引导下，AI 生成了一个脚本，用 curl 命令表达必要测试场景。我们可以在脚本的 "TEST CASE OVERVIEW" 部分审查这些 AI 生成的场景。

[![AI 生成的 API 测试脚本概览](https://martinfowler.com/articles/structured-prompt-driven/example-script-generation.png)](https://martinfowler.com/articles/structured-prompt-driven/example-script-generation.png)

生成的 API 测试脚本

执行：脚本生成后，运行它：

`sh scripts/test-api.sh`

结果：所有功能测试成功通过。

[![API 测试结果全部通过](https://martinfowler.com/articles/structured-prompt-driven/example-test-results.png)](https://martinfowler.com/articles/structured-prompt-driven/example-test-results.png)

API 测试结果

#### 代码审查与最终调整

由于前几个步骤已经完成严格的意图对齐，重活已经完成。在这个阶段，剩下的问题通常是小的逻辑偏差或表层 code smell。

为了保持工程实践的精确性，我们把最终调整分为两类，依据是它们是否改变系统的可观察行为，并在 SPDD 工作流中使用不同策略处理：

[![代码审查变更的两种响应策略](https://martinfowler.com/articles/structured-prompt-driven/code-review.svg)](https://martinfowler.com/articles/structured-prompt-driven/code-review.svg)

对代码审查变更的两种响应

#### 逻辑修正（行为变化）

策略：先更新提示词，再生成代码。对于业务规则或逻辑不匹配的问题（它们天然会改变软件的可观察行为），必须先更新结构化提示词，锁定正确意图，然后再触碰代码。这是一次更新或 bug 修复，不是重构。

例如，在持久化 `modelId` 到 bill 时，我们当前允许这个字段为 nullable。底层原因是需要保持与历史数据的向后兼容性，因此这个 workaround 是一个合理的架构决策。

[![需要回写提示词的架构决策示例](https://martinfowler.com/articles/structured-prompt-driven/example-prompt-update-a.png)](https://martinfowler.com/articles/structured-prompt-driven/example-prompt-update-a.png)

提示词需要更新

不过，还有另一种选择。如果业务干系人能确认这次变更之前 `modelId` 应该是什么值，我们就可以统一系统行为，并消除这项潜在技术债。假设与业务确认后，所有历史 bill 的 `modelId` 都应设置为 `fast-model`。

有了这个明确意图后，我们与 AI 交互：

### spdd-prompt-update 如何工作

这个命令会增量更新现有 Canvas。它只修改受变更影响的章节，并保留其他所有内容。根据变更类型（新需求、架构调整或约束变化），它会自动判断哪些 REASONS 维度需要更新。

这与 `/spdd-sync` 不同：当代码已经变化时，sync 从代码流向 spec；当需求变化时，prompt-update 从需求流向 spec。

Instruction:

/spdd-prompt-update @GGQPA-001-202603191105-\[Feat\]-multi-plan-billing-model-aware-pricing.md

model\_id 是必填字段，默认值为 fast-model。基于这个决策，更新结构化提示词中的相应部分。

AI 基于这条指令更新结构化提示词。

更新后的工件：[更新后的结构化提示词](https://github.com/gszhangwei/token-billing/commit/904747b35d4888c51ec46faa533c6605e340cdf5)。

确认后，使用 `/spdd-generate` 命令根据新更新的结构化提示词更新对应代码：

/spdd-generate @GGQPA-001-202603191105-\[Feat\]-multi-plan-billing-model-aware-pricing.md

AI 在 `/spdd-generate` 命令定义的规则引导下，理解必要变更，并只在受影响的代码库上执行目标更新。

更新后的工件：[更新后的代码](https://github.com/gszhangwei/token-billing/commit/d140a0a2ed01387714f4ecc74604f570c05fb86e)。

需要注意的是，我们不会重新生成整个代码库。我们继续使用既有结构化提示词，由 AI 处理目标 diff：

1. 识别不匹配：注意到持久化 `modelId` 时的行为与新业务需求不一致（它必须必填，并带默认值）。
2. 定位提示词片段：复制结构化提示词中定义过期逻辑的具体部分。
3. 更新提示词：把摘取的片段和修订后的业务规则一起粘贴到聊天中，指示 AI 先更新结构化提示词。
4. 生成目标代码更新：一旦提示词反映了新的事实，运行 `/spdd-generate` 指向更新后的文件。AI 会自动只在受影响的代码库上执行目标 diff，而不是从头重新生成全部内容。

#### 重构（干净代码与风格）

> "在不改变软件可观察行为的前提下，对软件内部结构所做的修改，使其更容易理解，也更便宜地修改。"
>
> \-- Martin Fowler

策略：先重构代码，再同步回提示词。对于不改变可观察行为的结构或风格问题，直接指示 AI 重构代码，然后使用 sync 命令更新提示词文档。

例如，AI 生成的 `BillingServiceImpl` 类包含一些硬编码魔法数字，需要提取为有意义的常量。

```
private int calculateRemainingQuota(String customerId, PricingPlan plan) {
        if (plan.getMonthlyQuota() == null || plan.getMonthlyQuota() == 0) {
            return 0;
        }

        LocalDate currentDate = LocalDate.now(ZoneOffset.UTC);
        LocalDateTime monthStart = currentDate.withDayOfMonth(1).atStartOfDay();
        LocalDateTime monthEnd = currentDate.plusMonths(1).withDayOfMonth(1).atStartOfDay();

        Integer currentMonthUsage = billRepository.sumIncludedTokensUsedForMonth(customerId, monthStart, monthEnd);
        return plan.getMonthlyQuota() - currentMonthUsage;
    }
```

Instruction 1:

@BillingServiceImpl.java In the calculateRemainingQuota method, there are some magic numbers that need to be processed as constants

AI 根据这条指令执行代码重构（记住黄金规则：始终以小的、增量步骤重构）。如果输出符合预期，我们使用 `/spdd-sync` 命令，把这些新更新的代码细节同步回结构化提示词中的相应位置。

Instruction 2:

### spdd-sync 如何工作

这个命令比较当前代码与 Canvas 规格，然后把代码侧变更（重构、bug 修复、新组件）同步回 Canvas。

目标是让 Canvas 成为当前代码的准确设计文档，而不是过期的历史记录。

/spdd-sync

AI 根据 `/spdd-sync` 命令中定义的规则总结变更。然后，它遵循 REASONS Canvas 的结构要求，把详细代码描述更新写回结构化提示词的对应章节。

两个命令都执行后，我们可以在[这里](https://github.com/gszhangwei/token-billing/commit/56cc47e1ab6d4ec75528be276c92e0e93209bb84)看到全部提示词和代码变更。

对于更深层或隐藏的 code smell，只需重复这些步骤。黄金规则是：始终保持结构化提示词与最新代码库同步。

#### 回归测试

所有优化完成后，重启服务，再运行一次 API 测试脚本，确保清理过程中没有破坏核心功能。

结果：全部通过。

[![回归测试结果全部通过](https://martinfowler.com/articles/structured-prompt-driven/example-regression-results.png)](https://martinfowler.com/articles/structured-prompt-driven/example-regression-results.png)

回归测试结果

### 第 6 步：生成单元测试

功能测试本身不足以实现稳健验证；它主要是一种辅助检查，也不会计入代码覆盖率指标。核心逻辑的最终签收需要全面的单元测试。目前，SPDD 工作流还没有最终定稿的专用测试命令（未来迭代会引入）。作为临时方案，我们使用模板驱动方法生成单元测试的结构化提示词。

#### 生成初始测试提示词

我们首先把实现细节与标准测试模板组合起来，生成一份基线测试提示词。

Instruction:

Based on the implementation details prompt @GGQPA-001-202603191105-\[Feat\]-multi-plan-billing-model-aware-pricing.md, combined with the template [@TEST-SCENARIOS-TEMPLATE.md](https://github.com/gszhangwei/token-billing/blob/after-enhancement/spdd/template/TEST-SCENARIOS-TEMPLATE.md), please generate a test prompt file.

#### 去重并精修场景

生成初始结构化测试提示词后，一些提出的测试场景与既有测试重复。为解决这一点，我们继续对话，指示 AI 将生成的提示词与现有测试套件交叉比对，识别真正新增的场景，并移除冗余项。

Instruction:

@GGQPA-001-202603191105-\[Test\]-multi-plan-billing-model-aware-pricing.md There are tests that are duplicated with existing ones, compare the relevant tests that exist, and then only add tests for new scenarios

更新后的工件：[测试结构化提示词](https://github.com/gszhangwei/token-billing/commit/c910aede947bfeae12eedeff7991b506d2e015db)。

#### 生成单元测试代码

一旦精修后的测试场景被审查并确认，就使用最终测试提示词驱动实际代码生成。

Instruction:

Based on the generated test prompt @GGQPA-001-202603191105-\[Test\]-multi-plan-billing-model-aware-pricing.md, please generate the corresponding unit test code.

结果：所有测试通过。[测试 commit](https://github.com/gszhangwei/token-billing/commit/6461da90fffcff94ab9e1f57c6fb4476dd122922)。

### 这个示例交付了什么

到这里，一个完整的 SPDD 工作流结束了。通过这个标准化流程，我们成功交付了以下关键结果：

1. 一个具有极高意图对齐度（约 99%）的业务逻辑实现。
2. 完整工程透明度，包括清楚理解实现路径、技术决策和已接受取舍。
3. 一个与当前代码库紧密同步的结构化提示词资产，为未来迭代打下坚实基础。
4. 复合的人类专业能力，在我们与 AI 协作迭代时，持续积累开发者经验和心智模型。

在 GitHub 上[查看这个增强的完整代码 diff](https://github.com/gszhangwei/token-billing/compare/before-enhancement...after-enhancement)。

我们还准备了一个 bonus 增强功能：[Enterprise Plan Volume-Based Tiered Billing](https://github.com/gszhangwei/token-billing/blob/after-enhancement/requirements/%5BUser-story-2%5DEnterprise-Plan-Volume-Based-Tiered-Billing.md)。如果你有兴趣动手练习，我们非常鼓励你用上面介绍的 SPDD 工作流来完成它。

## 三项核心技能

SPDD 实质性改变了开发者构建软件的方式。在我们的工作中，我们识别出开发者为了有效工作而需要的三项核心技能。这些技能反映了 AI 辅助世界中开发者价值的迁移方向。

### 抽象优先

先设计，再生成

在生成任何代码之前，你需要清楚有哪些对象、它们如何协作、边界在哪里。没有这些，AI 往往会冲向实现细节，而结构会崩塌。职责不清、重复逻辑、接口不一致，成本会在后续评审和返工中显现。

[阅读全文…](https://martinfowler.com/articles/structured-prompt-driven/abstraction-first.html)

### 对齐

写代码前先锁定意图

在实现之前，你需要明确"我们会做什么 / 不会做什么"，并提前就标准和硬约束达成一致。否则，你会得到快速输出和缓慢返工。

[阅读全文…](https://martinfowler.com/articles/structured-prompt-driven/alignment.html)

### 迭代式评审

把输出变成受控循环

你希望 AI 辅助像工程过程一样运行，而不是一次性草稿。没有有纪律的评审和迭代循环，团队要么不断强迫模型打补丁直到方案漂移，要么反复重启并失去对成本和时间的控制。

[阅读全文…](https://martinfowler.com/articles/structured-prompt-driven/iterative-review.html)

## SPDD 适合哪里

### 适应度评估

SPDD 是一项工程投资。下表按场景评估它的回报，从强烈推荐（5 星）到不适合（1 星）。

| 评分 | 场景 | 说明 |
| --- | --- | --- |
| ★★★★★ | 规模化、标准化交付 | 需要长期可维护性的高重复业务逻辑（例如构建许多类似 API，自动化核心业务工作流）。 |
| ★★★★★ | 高合规与硬约束 | 必须遵守法规、安全标准或严格架构规则的环境（例如金融核心系统、多渠道 / 多客户端部署）。 |
| ★★★★☆ | 团队协作与可审计性 | 多人交付，变更必须端到端完全可追踪、可审查。 |
| ★★★★☆ | 横切一致性工作 | 复杂重构，逻辑必须在多个微服务或不同语言之间保持紧密同步。 |
| ★★☆☆☆ | 救火式 hotfix | "止血"型生产修复，速度比架构纪律更重要。 |
| ★★☆☆☆ | 探索性 spike | 目标是快速验证想法，而不是发布生产质量软件时，SPDD 的治理开销无法回本。 |
| ★★☆☆☆ | 一次性脚本 | 一次性数据清理或临时脚本，SPDD 的前置成本相对价值过高。 |
| ★☆☆☆☆ | 上下文黑洞 | 领域定义很差、业务规则不清楚时，你无法为模型设置有意义边界。 |
| ★☆☆☆☆ | 纯创意 / 视觉工作 | 由品味和美学驱动，而不是由逻辑驱动的任务（例如 UI 视觉探索、营销文案）。 |

### 需要考虑的取舍

**投资回报**

| 收益 | 影响 | 速度 | 得到什么 |
| --- | --- | --- | --- |
| 确定性 | 高 | 立即 | 把逻辑编码进精确 spec，显著降低幻觉和"创造性"解释。 |
| 可追踪性 | 高 | 立即 | 每个有意义的变更都能追溯到结构化提示词，闭合审计循环。 |
| 更快评审 | 高 | 短期 | 代码"到达"时更接近团队标准，因此评审关注逻辑和设计，而不是格式和清理。 |
| 可解释性 | 中高 | 渐进 | 意图和行为在自然语言层面可见，降低理解和维护的认知负担。 |
| 更安全演进 | 高 | 长期 | 明确定义的边界和分步实现，让目标变更风险更低，也更容易迭代。 |

**前置投资**

| 领域 | 门槛 | 性质 | 需要什么 |
| --- | --- | --- | --- |
| 心智转变 | 高 | 持续训练 | 团队必须从"代码优先"适应到"设计优先"。 |
| 前置资深经验 | 中高 | 每个 feature | 能把业务规则翻译成清晰抽象和设计约束的工程师。 |
| 自动化工具 | 中 | 基础设施设置 | 没有自动化，SPDD 会遇到吞吐上限，并难以保持提示词一致。[openspdd](https://github.com/gszhangwei/open-spdd) 把本文中的工作流作为可重复 CLI 步骤运行，从分析和结构化 REASONS 提示词，到代码和可选测试支持，让工件保持版本化和可审查，而不是困在聊天中。大型组织可能仍会在其上叠加知识平台，以规模化管理和复用资产。 |

## 结语

通过使用 REASONS Canvas、澄清意图、建立正确抽象、把工作拆成具体任务并锁定边界，我们给了 AI 一个定义良好的操作空间。在这个空间里，SPDD 也许不是"快速生成代码"的最短路径，但它是带着信心交付正确变更的最可靠方式之一。

也可以公平地说，SPDD 在逻辑密集领域最闪光。在由审美判断驱动的领域，例如前端样式，我们仍在探索能像纯逻辑构造一样稳定的工程模式。

这篇文章中的框架只是"招式"。真正优势来自它背后的元技能打磨：抽象与建模、系统性分析，以及对整体业务的深刻理解。这些人类强项最终决定了我们能从 AI 中获得多少价值。

在 AI 时代，软件开发不是模型 IQ 的比赛，而是工程师认知带宽的比赛：我们能多清楚地思考、界定问题并做出决策。

我们用一句体现 SPDD 精神的话收尾：

> "在科学中，如果你知道自己在做什么，你就不应该做它。在工程中，如果你不知道自己在做什么，你就不应该做它。"
>
> \-- [Richard W. Hamming](https://www.amazon.com/gp/product/9056995014/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=9056995014&linkCode=as2&tag=martinfowlerc-20)

---

## 致谢

我们衷心感谢 Martin Fowler。尽管日程繁忙，他仍深度投入了这篇文章，从打磨叙事结构、澄清关键概念，到通过改进和新增图表提升视觉叙事。他对细节的敏锐眼光和对精确性的坚持，深刻塑造了最终结果。

我们也非常感谢 Eric (Ke) Zhou、Wei Sun、Sara Michelazzo、Rebecca Parsons、Matteo Vaccari、May (Ping) Xu、Zhi Wang、Feng Chen 和 Da Cheng 的深思熟虑的批评和洞见。你们的输入帮助我们澄清了支撑这套方法论的几个关键概念。

我们也想认可早期实践者：Jie Wang、Jian Gao、Yixuan Feng、Siyuan Li、Yixuan Li、Biao Tian、Wei Cheng、Qi Huang 和 Yulong Li。感谢你们在真实项目中验证 SPDD，也感谢你们在这个方法成熟过程中保持耐心。你们的一线反馈是让 SPDD 变得实用和稳健的基础。

最后，本着实践我们所倡导之事的精神，这篇文章本身也在大语言模型的辅助下成形，包括 Claude 4.5 Sonnet、Claude 4.6 Opus、Gemini 3.1 Pro 和 ChatGPT 5.4。我们依赖它们进行行文润色、结构评审、综合建议，并把它们作为持续学习的思考伙伴。它们的贡献正好印证了本文所描述的方法。

## 一些问题的回答

在本文发布后，我们收到了许多问题。下面是一些回答。

有了已经治理 AI 输出的规则、工作流定义和执行 hooks，SPDD 实际填补了什么缺口？是提示词和代码之间更紧密的耦合，是防止随时间漂移的版本化，还是两者都有？

两者都有，而且它们会相互强化。全局规则和 hooks 是有价值的高层安全网，但在日常工程中，它们所处的抽象层级仍然让实际生成步骤保持不透明。SPDD 填补了高层护栏无法闭合的几个缺口：

- *对意图的更细粒度控制。* 高层规则描述宽泛策略和边界，但它们把生成代码留成黑盒。SPDD 通过 REASONS Canvas 把问题求解步骤显式化，包括意图、设计、执行、治理，因此评审者可以在代码之前推理计划，人类也留在真正重要的位置。
- *可复用的意图资产。* 临时提示词是一次性的。SPDD 把结构化提示词转化为随代码同行的版本控制工件，捕捉业务意图、设计决策和约束。这正是随时间闭合提示词和代码之间循环、防止只维护代码时慢性漂移的机制。
- *人类学习框架。* 如果我们让模型无监督地产生代码，我们自己的建模和抽象技能会随时间弱化。SPDD 迫使开发者与工具一起推理问题，因此领域知识和设计判断会跨迭代复合，而不是每次聊天后丢失。

这与放在项目 / solution 中、使用渐进式披露的传统 instruction sets 有什么不同？

核心差异在于，SPDD 把结构化提示词视为一个被维护的、版本控制的文件：

- *固定结构，而不是自由文本规则。* 我们不是给模型开放式指令，而是使用 REASONS Canvas：一个固定的七部分模板，覆盖意图、设计、执行和治理。AI 必须在这个形状里规划，这让计划在团队中以一致方式可读、可审查。
- *先意图，后代码。* 命令在生成任何东西之前澄清需求、领域和方法，把不确定性左移。分歧在提示词层解决，那里修复成本低，而不是等到代码中暴露。
- *通过 Operations 拆解任务。* Canvas 的 `O — Operations` 维度把抽象策略拆成具体、可测试的实现步骤，精确到方法签名和执行顺序。评审者在写任何代码之前检查这些步骤，因此生成变成对已达成计划的忠实翻译。
- *双向同步，而不是交接。* 传统项目内指令和设计文档会在代码继续前进时立刻过期。在 SPDD 中，提示词和代码绑在一起：业务规则变化时，`/spdd-prompt-update` 按需求 → 提示词 → 代码流动；代码重构时，`/spdd-sync` 按代码 → 提示词流动。spec 保持为当前系统的准确记录，而不是历史快照。

人类通过讨论和累积上下文构建决策背后的"为什么"，而不只是通过最终代码。SPDD 是用自动化学习闭合这个循环，还是"为什么"仍由人类承载？

这取决于我们如何理解"闭合循环"。如果问题是 SPDD 是否拥有一个闭合的 AI 学习循环，即每次聊天都会悄悄教会模型，系统会自行变聪明，那么坦率地说，还没有，而且我们是有意如此。`openspdd` 是一个半自动、人类主导的框架，所有核心决策仍由人类把关。

但"为什么"本身不会被锁在人类脑子里，也不会散落在聊天记录中。它会被捕捉到结构化提示词这个一等工件中：

- *Canvas 编码了理由。* R（Requirements with DoD）、A（Approach）以及第 3 步分析上下文，会明确记录我们在解决什么、为什么解决，以及接受了哪些取舍，而不只是要构建什么。
- *版本控制让它持久。* 因为提示词和代码一起提交，"为什么"会跨人和时间随系统同行，而不是在聊天窗口关闭或开发者离开团队时丢失。
- *双向同步让它保持当前。* 当意图变化时，`/spdd-prompt-update` 按需求 → 提示词 → 代码流动；当实现变化时，`/spdd-sync` 按代码 → 提示词流动。这个工件保持为当前系统的准确记录，而不是历史快照。
- *每次迭代都从累积资产开始。* 下一次增强以既有 Canvas 作为上下文起点，因此领域知识和设计决策会复合，而不是每个周期重新发现。

所以，这个循环由工作流和工件闭合，而不是由自治学习机制闭合。评审者从"找 bug"转向"检查意图"，因为意图现在位于他们可以检查的地方。这是一个有意的人类主导设计，我们认为目前这是正确的选择，直到资产层自动验证成熟到足以承担更多负载。

如果两个开发者写同一个 Canvas 会产生不同 spec，而且没有"好"的正式定义，SPDD 不就是把变异性问题上移了一层，而不是解决它吗？

坦率地说，这确实公平地描述了我们今天所在的位置。Canvas 相比自由形式提示缩窄了变异范围，但没有消除它。两个开发者围绕同一个需求仍可能产生不同 Canvas；同一个开发者在不同日子也可能写出更薄的版本。我们还没有形成一个结晶化、客观的标准来定义什么是"好的" Canvas。

目前这个框架依赖一组基线标准，包括结构、粒度、抽象层级和任务拆解，这些标准被编码进 `openspdd` 命令。每个命令都编码了一种思考策略，把输出拉向一致形状，这提高了经验较少实践者的下限，也给评审者一个固定对象来回应。这是有意义的变异降低，但它不同于外部、自动化检查。

闭合剩余缺口，是治理下一步需要前进的方向：在资产层（analysis、Canvas、prompt artifacts）进行自动验证，让框架本身能捕捉 Canvas 结构完整但实质上规格不足的情况。在那之前，诚实的答案是：人类判断仍然是承重结构。

当 SPDD 扩展到多项目、多学科、多领域工作时表现如何？真正的天花板在哪里：AI 能力，还是问题本身能被多干净地界定？

限制主要在问题侧，而不是模型侧。即使有更强模型或更好的学习循环，我们也不建议一次性把一个庞大的、多项目、跨领域范围交给 AI。更重要的是问题边界有多清楚，以及团队已经积累了多少先前上下文；原始模型能力很少是瓶颈。原因有三点：

- *必须拆解。* 大型或跨领域范围最好拆成更小、自包含的单元，逐个准确建模。没有这种纪律，即使强模型也会随着范围扩大而失去连贯性。
- *不清晰边界会限制成功率。* 在"上下文黑洞"中，也就是领域业务规则不清、边界很弱的地方，SPDD 的成功率会下降，因为模型没有有意义的约束可依赖。更强 AI 不会修复这一点，只会更自信地失败。
- *决策资产会随时间提供帮助。* 端到端组合级工作并不是我们今天会自治交给 AI 的东西。一旦足够多的"决策资产"积累起来，包括历史上下文、架构选择、规范模式，成功率可以提升到可接受水平，情况就会改变。在那之前，人类主导、逐单元的方法是默认选择。

SPDD 是否与模型无关？累积提示词在 Claude、GPT 和 Gemini 之间表现等价吗？或者迭代之间更换模型，比如切换供应商、本地离线 vs 远程在线、供应商更新改变推理行为，会引入提示词漂移或代码分歧吗？真正的工件是 prompt-as-spec，还是 prompt + model configuration？

SPDD 的目标是模型无关，而且我们从 Claude 3.5 Sonnet 时代以来，已经跨模型世代应用过它。这个工作流不依赖任何单一模型。也就是说，原始能力仍然重要：更强推理模型会产生更好的 Canvas。

从实践经验看，在重型分析和 REASONS Canvas 生成步骤上，Claude（尤其 Opus）通常领先，其次是 GPT Codex 和 Gemini 3.x Pro。不过，一旦意图被锁入结构化提示词，下一阶段主要是遵循指令，因此切换到稍弱模型带来的意图漂移风险是可管理的。从这个角度看，工件是 spec；模型是执行这个 spec 的执行器。

关于本地离线 vs 远程在线：今天我们不推荐把本地离线 LLM 用于 SPDD。能在本地硬件上运行的小模型缺少分析和 Canvas 生成步骤所需的能力，而本地部署足够强的大模型很少具有成本效益。

所以，SPDD 不保证绝对确定性，我们也不声称它能做到。它所做的是把 LLM 非确定性的随机性控制在可控边界内。你把工件视为 prompt-as-spec，还是 prompt + model configuration，是一个与你的成本、算力和合规约束相关的战略选择，团队应该有意识地做出这个选择。

随着 LLM 能力提升，SPDD 方法本身发生了变化，还是只是应用它变得更实际？

方法没有发生根本变化。核心循环仍然相同：把一切锚定在结构化提示词上，并用它逐步澄清意图。

变化的是，我们能把多少手工工作交给构建在 LLM 之上的可重复工具。随着模型更擅长遵循结构化提示词，并能在更丰富上下文上推理，我们把工作流的每一步提炼成可复用的思考策略，也就是 `/spdd-analysis`、`/spdd-reasons-canvas`、`/spdd-generate`、`/spdd-sync` 这样的命令。这带来了三件事：

- *从模板驱动到策略驱动。* 早期，SPDD 很依赖 solution templates：如果一开始没有总结良好的模板，输出质量会下降，这让进入新领域变得困难。现在，每个命令都编码了思考策略本身，因此即使没有模板，LLM 也能遵循策略产生一个合理初稿。我们再从那里精修；当足够多案例经过同一策略后，模板会作为副产品出现，所以资产是在使用中建立起来的，而不是开始之前就必须存在。
- *更高自动化。* 过去需要用临时提示词手工驱动的步骤，现在可以作为命令调用，因此工作流需要的手把手指导少得多。
- *更稳定输出。* 因为每个命令每次都编码同一种思考策略，它产生的工件，包括 analysis、REASONS Canvas、生成代码，运行之间一致性高得多，因此更容易治理和评审。

作为人类 "lead"，你如何判断在同一个 portfolio 范围内什么时候需要额外 prompt engineering？

我依赖三个具体触发器，它们直接映射到 SPDD 工作流中的评审步骤：

- *行为不匹配。* 在功能测试期间（通常使用 `/spdd-api-test`），我关注系统行为而不是实现细节。如果输出偏离定义好的验收标准，这说明提示词没有足够精确地捕捉意图。这是典型逻辑修正场景：先更新提示词，再更新代码。
- *逻辑过度复杂。* 审查关键代码时，如果 AI 设计出的方案比问题本身需要的更复杂，通常是提示词的 Approach 或 Operations 部分规格不足。收紧这些约束通常会简化下一次生成。
- *指令失败。* 当 AI 未能遵循显式指令，或违反 Canvas 中的 Norm 或 Safeguard，我把这视为约束需要在提示词中变得更突出或更明确的信号，而不是在聊天里反复打同一场仗。

为什么 SPDD 工作流有六个步骤，而不是更简单的 plan-then-code 模式？难道不能在计划生成后只做一次单一评审来确认意图吗？

简短回答是认知负担。意图确认必须分布在整个工作流中，因为把它压缩到计划生成后的单次评审，会一次性给评审者太多内容。在实践中，人无法持续保持那种注意力；他们会浏览、推迟，或默认批准，于是即使纸面上一切看起来正确，意图漂移也不可避免。

六个步骤存在，是为了让每个检查点足够小，小到人真的能投入其中：

- *第 1 步* 把原始想法塑造成用户故事（可选地借助 AI），*第 2 步* 是人类审查并澄清这个故事在业务层到底意味着什么，也就是在任何设计工作开始前锚定正确问题。
- *第 3 步* 确认领域理解、风险和战略方向，也就是 "why" 和 "what"。
- *第 4 步* 在分析达成一致之后，确认结构化提示词，也就是设计和操作。
- *第 5 步* 在意图锁定后，确认行为和代码。
- *第 6 步* 在实现稳定后，最后生成单元测试。

等评审者开始看代码时，需求、领域模型和设计已经签收，因此注意力可以放在该阶段真正重要的决策上。重点不是为了步骤而增加步骤，而是每一步决策更窄，让人类能够留在循环中。

SPDD 在代码审查前跑 API 测试，但在代码审查后才做单元测试，这几乎与 TDD 相反。为什么这样排序？

这个顺序是有意设计的。经典 TDD 用测试澄清行为、防止回归，并通过快速反馈塑造设计。SPDD 仍然希望实现这三个结果，只是把它们分布在工作流的不同位置：

- *API 测试先行，因为生成代码很便宜。* 深入审查一段可能连预期业务行为都不满足的代码价值不大。`/spdd-api-test` 会快速在系统边界验证 "what"，所以我们在投入人类评审精力前，知道自己评审的是确实能工作的东西。
- *代码审查随后聚焦于只有人类能判断的东西。* 一旦 API 测试通过，评审就集中在逻辑、架构、取舍和非功能关注点，而不是基本行为是否正确。
- *单元测试最后作为回归安全网。* 到达单元测试阶段时，意图已经通过结构化提示词显式化，实现也已经通过 API 验证和评审稳定下来。此时生成单元测试，可以避免在重大评审驱动变更之后重写它们。

所以，在 SPDD 中测试并不更不重要。变化在于，意图更早通过结构化提示词显式化，而测试可以应用在最有杠杆的位置。

如果 hotfix 被评为不适合 SPDD，那么来自生产的最高信号反馈，也就是触发修复的 bug、边界场景和失败模式，是否会永久绕过 spec，永远不会回到方法论中？

如果工作流在修复处停止，那确实会发生。适应度表中的 1 星评级，说的是事故当下的前置适配度：在实时生产事故中，系统恢复必须优先，停下来写 Canvas 是错误选择。但治理不会被跳过，而是延后一步。在实践中，我们把 hotfix 分成两个场景：

- *场景 A：已有上下文。* 如果 bug 落在已经由结构化提示词覆盖的区域，我们用 AI 分析失败、识别根因，然后以压缩形式应用标准 SPDD 循环：先更新提示词，再更新代码。这让 spec 和实现保持同步，修复也成为受治理资产的永久组成部分。
- *场景 B：遗留代码或没有先前上下文。* 对于从未纳入 SPDD 的代码中的紧急修复，务实做法是让 AI 分析日志并直接修复问题。收尾步骤是一场有意的 post-mortem：把修复、失败模式和相关上下文综合成新的文档资产。治理循环在这里为遗留代码闭合，这也是 SPDD 覆盖在代码库中有机增长的方式。

关键点是，生产信号会反馈回来，但它需要一个明确的人类主导文档化步骤，而不是自动发生。跳过这一步，才会造成问题中描述的 spec/code 差异；把它视为工作流的一部分，才能防止这种差异。

你们是否考虑过让智能体自己做 prompt/spec review？不是人类审查 Canvas，而是一个智能体同时读取 REASONS Canvas 和 code diff，并验证它们是否对齐？

是的，这基本上就是 [`/spdd-code-review`](https://github.com/gszhangwei/open-spdd/blob/v0.4.9/internal/templates/data/optional/spdd-code-review.md) 命令已经在做的事。它一起读取 REASONS Canvas 和 code diff，并标记代码偏离既定意图的位置，因此你可以在需要时把对齐检查交给这个命令。

取舍在于你放弃了什么。这个命令可以检查对齐，但人类在评审中带来两样智能体无法替代的东西：

- *捕捉意图漂移。* 智能体可以检查代码是否匹配 Canvas，但只有人类能判断 Canvas 本身是否仍然匹配真实业务意图。没有这项检查，完全由智能体驱动的评审可能在自己的条件下看起来正确，却仍然错过真实目标。
- *让人类学习。* 评审也是人类从 AI 选择中学习的地方，包括模式、取舍、他们没有想到的选项。把人类排除出去会加快速度，但会阻断 SPDD 旨在保护的长期技能成长。

所以，当你想使用它时，这个命令已经存在，但它被设计为处理评审中的机械部分，而不是接管评审。现在，人类仍按设计留在循环中。等足够多决策规则积累起来，让我们有真正信心之后，我们可能逐步把更多评审转给智能体，但人类从 AI 中学习的那部分，是我们计划保留的。

SPDD 下一步是什么？路线图将如何减少它对个人专业能力的依赖？

四个方向正在塑造这项实践的演进，它们都指向同一方向：减少对个人手艺的依赖，提高可重复的组织级能力。

- *把更多重复工作流捕捉为命令。* 从 `/spdd-analysis`、`/spdd-reasons-canvas` 和 `/spdd-generate` 开始的模式远未结束。随着我们在真实项目中遇到重复模式，会持续把它们提取成新命令，让每个成功工作流变得可复用，而不是停留在个人知识中。
- *资产层自动验证。* 我们正在探索自动验证，不是在代码层，而是在 SPDD 资产本身，也就是 analysis、REASONS Canvas 和 prompt artifacts 上。目标是在这些意图层资产之上叠加自动检查，并随着时间推移加入一些自动决策，让框架能捕捉今天完全依赖人类评审的缺口、不一致和常规判断。
- *逐步提高自动化比例。* SPDD 本身已经是一个 Harness，只是一个半自动 Harness，在重要决策处有人类参与。方向是在这个 Harness 内逐步提高自动化比例，节奏取决于 AI 在实践中能可靠处理什么任务；只有当模型在某类任务上证明可靠时，更多工作流才会在没有手把手指导的情况下运行。
- *面向"决策记忆"的记忆机制。* 目标是让历史决策，包括过去的 Canvas、取舍和已接受模式，成为持久上下文，让智能体能在给定情境中检索正确的先前推理，而不是每次重新发现。具体形式将由实践反馈塑造。

这些方向共同推动 SPDD 从一套奖励熟练实践者的方法，演进为一个由框架自身承担更多重量的系统。

所有这些都反映了我们当前的理解和经验，并且很可能会随着我们持续学习和实践而调整。

## 脚注

1：在单向流水线中，需求产生代码，流程到此结束；任何后续调整都只发生在代码中，原始意图会逐渐过期。在 SPDD 中，闭环发生在两个尺度上。在一次迭代内，反馈会回流：逻辑修正先更新提示词，再更新代码；重构则从代码同步回提示词，这样两边都不会悄悄偏离。跨迭代时，累积的提示词资产（领域模型、设计决策、规范等）会成为下一次增强的起始上下文，因此每个周期都建立在受治理的基线之上，而不是从零开始。

2：由于这是一个可选命令，如果你的本地环境中没有，可以运行 `openspdd generate spdd-story` 来生成它。

3：由于这是一个可选命令，如果你的本地环境中没有，可以运行 `openspdd generate spdd-api-test` 来生成它。

重要修订

*2026 年 5 月 4 日：* 新增问答

*2026 年 4 月 28 日：* 首次发布
