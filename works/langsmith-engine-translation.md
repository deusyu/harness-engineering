---
title: "我们如何构建 LangSmith Engine：一个用于改进智能体的智能体"
sourceTitle: "How We Built LangSmith Engine, Our Agent for Improving Agents"
sourceUrl: "https://www.langchain.com/blog/how-we-built-langsmith-engine-our-agent-for-improving-agents"
sourceAuthor: "Palash Shah"
sourcePublishedAt: "2026-05-19T16:00:00.000Z"
summary: "拆解 LangSmith Engine 的实现方式：它如何从智能体 trace 中发现重复问题，生成 issue、评测器和回归样本，并把修复交接给独立智能体。"
sourceCoverImage: "https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a0c7cab710767bbc0f61dc9_Screenshot%202026-05-19%20at%208.05.40%E2%80%AFAM.png"
sourceLanguage: "en"
language: "zh-CN"
translationMethod: "baoyu-translate skill"
sourceFigureCount: 5
---

# 我们如何构建 LangSmith Engine：一个用于改进智能体的智能体

[![LangSmith Engine 文章首图](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a0c7cab710767bbc0f61dc9_Screenshot%202026-05-19%20at%208.05.40%E2%80%AFAM.png)](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a0c7cab710767bbc0f61dc9_Screenshot%202026-05-19%20at%208.05.40%E2%80%AFAM.png)

上周我们发布了 LangSmith Engine。Engine 是一个位于你的智能体 trace 之上的智能体：它发现重复出现的问题，并建议下一步该做什么。

这篇文章会深入介绍我们如何构建它：为什么要构建 Engine，它处理哪些输入和输出，以及哪些架构决策让它能够分析大量 trace。

## 为什么构建 Engine

LangSmith 是智能体改进循环的家。构建、测试、部署和监控，是驱动智能体开发的四个支柱。

随着你部署的智能体数量增加，它们生成的 trace 数量也会增加。结果是，你会花越来越多时间梳理 trace，弄清楚智能体在哪里出错。

基础工具错误相对容易捕捉。整体轨迹也可以从 trace 视图中看到。但许多智能体问题很难发现，除非你逐条 trace 做细粒度检查：

- 智能体在同样的工具调用中循环。
- 它使用了错误的工具参数。
- 它执行效率低。
- 它漏掉了本应使用的工具。
- 它在不同运行（run）中反复失败于同一种请求。

在 LangChain 内部遇到这个问题后，我们开始构建 LangSmith Engine。

Engine 有三个任务：

1. 在 trace 中发现重复失败。
2. 把这些失败转化为可行动的 issue。
3. 把这些 issue 转化为持久改进：评测器、数据集样本和修复。

Engine 本身就是一个智能体：一个使用专门组件端到端运行改进循环的编排器。它拉取 trace，在连接了仓库时读取代码，把失败归类成 issue，提出评测器和数据集样本，并随时间更新它对你的智能体的理解。

[![LangSmith Engine 从 trace 中发现问题并提出改进](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a0c7cc1e8a99f7c78059582_Screenshot%202026-05-19%20at%208.05.26%E2%80%AFAM.png)](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a0c7cc1e8a99f7c78059582_Screenshot%202026-05-19%20at%208.05.26%E2%80%AFAM.png)

## Engine 产出什么：issue

Engine 的核心产物是 issue。

一个 issue 是一种重复失败模式，有证据 trace 支撑，并带有建议的后续动作。Issue 会在 Issue Board（问题看板）中呈现给用户：它是一组 Engine 在追踪项目中发现的问题列表。

一个 issue 包含：

- **名称（Name）：** issue 标题。
- **描述（Description）：** 对 issue 的段落式描述。
- **类别（Category）：** 预定义智能体失败类别之一。
- **严重程度（Severity）：** low、medium 或 high。
- **证据 trace（Traces）：** 与 issue 相关、能提供发生证据的 trace。
- **建议动作（Proposed actions）：** 防止 issue 再次发生的建议下一步。
- **标签（Tags）：** 用于驱动后续工作流的元数据，例如 `needs_fix`。

建议动作可以包括：

- **建议的在线评测器（Proposed online evaluator）：** 如果 issue 再次发生，会标记它的评测器。
- **建议的数据集样本（Proposed dataset examples）：** 加入离线数据集的样本，代表这个 issue。
- **建议的修复（Proposed fix）：** 修复底层问题的代码或 prompt 变更。

关键在于，Engine 不只是指向一条坏 trace。它试图把生产失败转化为你的团队未来可以行动和测试的东西。

## Engine 消费什么

Engine 接收或能够获取四类主要输入。

###### 指令（Instructions）

Engine 由 Agent Overview 引导。这类似于一个 `AGENTS.md` 文件：它是一份活的说明，描述你的智能体做什么、应该期待什么 trace 结构、需要关注哪些失败模式，以及你的团队表达过哪些偏好。

第一次运行会由上手引导（onboarding）回答和项目上下文启动。在初始运行期间，Engine 分析 trace，并使用学到的内容创建第一版 Agent Overview。后续运行中，Agent Overview 会成为 Engine 读取并更新的持久输入。

你也可以随时手动编辑 Agent Overview。

###### 轨迹数据（Traces）

Engine 通过 LangSmith CLI 从相关 LangSmith 追踪项目拉取 trace。

完整 trace 包括一次智能体运行（run）的消息和轨迹。为了扩展，Engine 并不总是一开始就加载每条 trace 的完整内容。它通常从紧凑的轨迹摘要开始，然后只在某条 trace 需要更深入调查时，有选择地加载完整 trace 内容。

###### 现有 issue（Existing issues）

Engine 会获取当前 Issue Board，包括开放 issue 和之前关闭的 issue。

这让 Engine 能看到项目当前状态。它可以避免重复创建已知 issue，把证据添加到既有 issue，并理解哪些内容已经被解决或关闭。

###### 代码库（Codebase，可选）

你可以选择把 Engine 连接到代码库。这让 Engine 能更精确地诊断问题，并启用一个独立的修复智能体来提出变更。

如果连接了仓库，仓库会被检出到沙箱中。设置期间，你可以指定 Engine 应该使用哪个分支或子目录。

## Engine 更新什么

Engine 运行时可以更新几个输出。

###### Issue Board

Engine 的主要角色是更新 Issue Board。它可以创建新 issue、更新现有 issue、附加证据 trace、修改 issue 元数据。

对于每个 issue，Engine 可以提出一个评测器，用来在未来 trace 中捕捉同一模式。它还可以根据证据 trace 提出回归样本，让生产中观察到的失败变成离线测试覆盖。它也可以建议 prompt 或代码变更来修复底层问题。

###### Agent Overview

Engine 可以记录它发现的内容，并更新 Agent Overview 供未来运行使用。

这就是 Engine 随时间记住项目特定信息的方式：常见失败模式、trace 模式、工具行为和用户偏好。

## 高层架构

Engine 构建在 Deep Agents 之上，并连接到一个沙箱，在那里它可以写文件、检查 trace、执行代码，并处理已经检出的仓库。

[![LangSmith Engine 架构概览](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a0c7cab710767bbc0f61dc9_Screenshot%202026-05-19%20at%208.05.40%E2%80%AFAM.png)](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a0c7cab710767bbc0f61dc9_Screenshot%202026-05-19%20at%208.05.40%E2%80%AFAM.png)

在高层，Engine 由以下部分驱动：

- **系统 prompt 和指令：** 包括 Agent Overview。
- **沙箱：** Engine 工作的环境。
- **LangSmith CLI：** Engine 用来获取数据并把更新推回 LangSmith 的主要接口。
- **自定义工具：** 尤其是测试评测器和提出回归样本的工具。
- **子智能体：** 用来筛查 trace，并调查可能的问题，而不会撑爆主智能体上下文。
- **记忆：** 通过 Agent Overview 维护，并根据用户动作更新。

本文剩余部分会走过核心循环：

1. 准备智能体上下文。
2. 大规模筛查 trace。
3. 调查可能的 issue。
4. 创建 issue、评测器和数据集样本。
5. 需要时把修复交接给独立智能体。
6. 为下一次运行更新记忆。

## 1\. 准备智能体上下文

在 Engine 能分析 trace 之前，它需要一个工作环境，以及足够理解被检查智能体的上下文。

### 沙箱设置

Engine 连接到沙箱运行。我们使用 LangSmith Sandboxes。

运行 Engine 之前，我们会设置智能体环境。首先，我们拉取基础 Engine Docker 镜像。这个镜像包含所需库和 LangSmith CLI，Engine 用它与 LangSmith 数据交互。

如果 Engine 连接到了 GitHub 仓库，我们也会拉取相关代码产物（artifact）。用户可以在设置时指定要使用哪个分支或子目录。

沙箱很重要，因为 Engine 经常需要检查 trace 数据、写中间文件、测试评测器代码，并迭代建议输出。给智能体一个受控工作环境，可以让这个工作流可靠得多。

### Agent Overview

Agent Overview 既是指令文件，也是记忆层。

设置 Engine 时，你会回答一组基础的上手引导（onboarding）问题。Engine 使用这些回答，以及它在第一次运行中发现的内容，创建初始 Agent Overview。

这份 Agent Overview 帮助 Engine 维护一份连续记录：

- 你的智能体做什么。
- 应该期待什么 trace 结构。
- 需要关注哪些常见陷阱。
- 项目特定上下文。
- 用户偏好。

Engine 会在连续运行中读取并更新这个文件。

### LangSmith CLI

Engine 与 LangSmith 交互的主要方式是 LangSmith CLI。

大多数情况下，相比为每个 LangSmith 操作创建一个自定义工具，我们更偏好这种方式。CLI 为 Engine 提供了一个通用接口，用来拉取 trace、查询 issue、创建 issue、附加 trace、更新 issue 元数据，并提出产物（artifact）。

它也让 Engine 更容易调试和复现。CLI 是同一个可下载接口，也可以交给本地编码智能体使用。如果 Engine 通过 CLI 做了某件事，通常也可以在 Engine 之外理解并复现这个操作。

## 2\. 大规模筛查 trace

构建 Engine 最大的架构挑战是 trace 量。

让一个智能体一次调查和整理 50 条 trace 相对容易。但当我们把系统连接到生产智能体后，在这个量级可行的技术开始失效。生产项目在一个回看窗口中可能有几千甚至几万条 trace。

把所有完整 trace 内容加载进主智能体上下文不可行。即使是 10 条长时间运行智能体的 trace，也可能包含数百次工具调用和消息。

所以我们把问题拆成两个阶段：

1. 宽筛阶段，快速识别可疑 trace。
2. 深入调查阶段，只为可能重要的 trace 加载完整上下文。

[![LangSmith Engine 的 trace 筛选和深入调查流程](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a0c7ce1e5b1d0aaeb6996c9_Screenshot%202026-05-19%20at%208.05.58%E2%80%AFAM.png)](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a0c7ce1e5b1d0aaeb6996c9_Screenshot%202026-05-19%20at%208.05.58%E2%80%AFAM.png)

### 轨迹格式

为了让筛查成为可能，我们需要每条 trace 的压缩表示。

问题是：

如何压缩 trace 中的信息，同时保留导航回 trace 所需的信息？

答案是智能体轨迹：trace 的紧凑骨架。

[![智能体轨迹的紧凑骨架格式](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a0c7cec8be3af470cc3b7dc_Screenshot%202026-05-19%20at%208.06.23%E2%80%AFAM.png)](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a0c7cec8be3af470cc3b7dc_Screenshot%202026-05-19%20at%208.06.23%E2%80%AFAM.png)

一条轨迹每轮有一个条目，包含角色、可选工具名、延迟和内容大小。它不包括完整内容。

```bash
{ role: "human", chars: 142 }

{ role: "ai", latency_ms: 1820, chars: 89 }

{ role: "tool", tool_name: "search_db", latency_ms: 340, chars: 2100 }

{ role: "tool", tool_name: "search_db", latency_ms: 312, chars: 1980 }

{ role: "tool", tool_name: "search_db", latency_ms: 298, chars: 2040 }

{ role: "ai", latency_ms: 2100, chars: 210 }
```

轨迹充当导航工具。它让筛查器能快速发现可疑形状，然后在完整 trace 周围 grep，只把需要的信息加载进上下文。

### 筛查子智能体

核心筛查问题是：

给定这条 trace，其中是否存在值得进一步调查的 issue？

Engine 使用一个专门的筛查子智能体来做这件事。筛查器是一个基于 Haiku 的子智能体，主智能体会把它分派到每组约 20 条 trace 上。

筛查器的工作刻意保持狭窄。它不创建 issue。它不诊断根因。它只是在表层判断一条 trace 是干净的，还是可能包含 issue。

筛查器会向主智能体返回结构化响应。响应中每条被标记的 trace 占一行，包含 trace ID、类别和一句简短原因，最后跟上干净 trace 的数量。

```bash
<trace_id> | <category> | <one-line reason>

CLEAN: 47
```

这一步会缩小搜索空间。我们不是要求主智能体完整推理每条 trace，而是使用并行筛查器识别值得深入关注的 trace。

## 3\. 调查可能的 issue

筛查结束后，主智能体读取筛查器输出，并分派更深入的调查。

### 调查子智能体

调查器会接收被标记的 trace，拉取完整 trace 内容，在可用时读取代码库，并对潜在 issue 做更深入分析。

我们鼓励主智能体为此使用子智能体，因为完整 trace 内容可能很大。把几条完整 trace 和相关代码加载进主智能体上下文窗口，很快就会溢出。

不同于筛查器，调查器不是一个带固定系统 prompt 的专用子智能体。它是由主智能体针对具体调查动态提示的通用子智能体。这给了主智能体灵活性：不同 issue 类型可能需要不同调查策略。

调查器的任务是判断被标记 trace 是否代表真实 issue、这些 trace 是否应该被分组，以及 issue 上应该记录什么。

### issue 类别（Issue categories）

Engine 为每个 issue 设计了类别概念。

我们识别了一组预定义的常见智能体失败模式，并提示 Engine 主要寻找这些类型的问题。列表包括：

- `pii_leak`
- `agent_looping`
- `incorrect_tool_args`
- `missing_tool`

把 Engine 约束在已知类别中，有助于控制它发现的问题，并在把这些 issue 类型介绍给客户之前先评估它们。这也让输出更容易被用户理解。

用户仍然可以通过 Agent Overview 自定义 Engine 应该关注什么。如果团队关心特定 issue 类型，可以在那里描述这些优先级。

随着我们识别并验证新的重复智能体失败模式，我们会持续扩展这个类别列表。

## 4\. 创建 issue、评测器和数据集样本

一旦 Engine 识别出真实 issue，主智能体会创建或更新 issue，并附加证据 trace。

主智能体负责 issue 创建以及围绕 issue 的评测产物。它不负责直接修复底层代码或 prompt。

对于每个 issue，Engine 可以产出：

1. issue 本身，带证据 trace。
2. 一个建议评测器。
3. 建议回归样本。
4. 如果应该启动独立修复智能体，则添加 `needs_fix` 标签。

### 评测器（Evaluators）

Engine 会被提示为每个 issue 提出一个评测器。

思路很简单：一旦发现失败模式，你就想要一个检查，在未来 trace 中再次发生时捕捉同一模式。

Engine 支持两类评测器。

**代码评测器（Code evaluators）** 是检查 trace 结构的 JavaScript 函数，例如字段值、工具输出、步骤数量和错误模式。当失败不需要读取内容就能检测时，它们是合适选择。

**LLM 充当评判（LLM-as-judge evaluators）** 处理需要理解的问题：幻觉、事实依据（grounding）缺失、无帮助的拒答、错误建议。

智能体会根据 issue 选择评测器类型。结构性失败使用代码评测器。语义性失败使用评判评测器。

在 Engine 呈现建议评测器之前，它会调用 `test_evaluator` 工具。

### test\_evaluator 工具

`test_evaluator` 工具让 Engine 在向用户建议评测器之前，先在证据 trace 上测试建议评测器。

这很重要，因为评测器可能看起来合理，却没有捕捉到实际 issue。Engine 使用评测器定义和它想运行评测器的 trace 调用该工具。工具执行评测器，并返回 trace ID 到结果的映射。

```bash
def test_evaluator(evaluator, traces) -> {run_id: PASS | FAIL | SKIPPED}
```

其中：

```bash
PASS     caught issue

FAIL     missed issue, or evaluator errored

SKIPPED  evaluator did not apply to this trace
```

如果评测器没有捕捉到正确 trace，Engine 可以迭代代码或 prompt。目标是交付最能捕捉证据 trace 所代表失败模式的版本。

### 回归样本和断言

每当创建 issue，或有新 trace 添加到 issue 时，Engine 都会被指示对每条证据 trace 调用一次 `propose_regression_example`。

这会为该 trace 创建一个建议回归样本。样本由智能体原始输入以及对预期输出的断言组成。

我们提出断言，而不是完整参考答案，因为断言更简单也更灵活。正确回复可以有很多不同措辞。重要的是它是否满足 trace 所暗示的关键主张。

每个断言包含：

- **`key`：** 反馈标识符，写成短 slug。
- **`comment`：** 一句人类可读的声明，描述正确回复应该满足什么。

```bash
{

  "key": "must_cite_max_connections_4096",

  "comment": "Response cites the max_connections value of 4096 returned by the get_config tool call."

}

{

  "key": "must_not_reference_strict_mode_flag",

  "comment": "Response must not suggest enabling strict_mode, which was deprecated in this version."

}
```

这些建议样本会显示在前端的 issue 上。审查者随后可以把它们提升进数据集。

这就闭合了从生产失败到离线测试覆盖的循环。

## 5\. 把修复交接给独立智能体

一个关键设计决策是把 issue 创建与修复生成分离。

在早期版本中，我们尝试让主智能体同时识别 issue 并提出 prompt 或代码修复。这让智能体任务过宽。它必须扫描 trace、决定什么重要、分组失败、创建 issue、生成评测器、提出数据集样本，还要推理正确修复。

我们看到，当所有这些都在一轮中发生时，主智能体很难可靠提出修复。

所以我们拆分了工作流：

1. 主 Engine 智能体识别并记录 issue。
2. 它创建数据集和评测器产物。
3. 如果 issue 需要修复，它留下 `needs_fix` 标签。
4. 一个独立修复智能体被启动，提出实际代码或 prompt 变更。

这让主智能体更简单，也给了修复智能体一个更聚焦的任务。修复智能体可以从 issue、证据 trace 和已连接仓库上下文出发，而不需要同时执行完整 trace 筛查工作流。

## 架构决策和经验

有几个架构决策最终特别重要。

### 使用 CLI 作为主要 LangSmith 接口

Engine 做的大多数事情都通过 LangSmith CLI 完成。这比为每个操作创建狭窄自定义工具更灵活，也让 Engine 行为更容易复现和调试。

### 阅读前先压缩 trace

完整 trace 太大，无法在生产规模上筛查。轨迹让 Engine 能根据许多 trace 的形状推理，然后有选择地加载重要细节。

### 拆分筛查和调查

筛查器优化的是规模。调查器优化的是深入分析。

这种拆分让 Engine 可以处理大量 trace，而不必把每条 trace 都送进昂贵的完整调查。

### 使用专用筛查器，但保留灵活调查器

筛查器的任务狭窄且可重复，因此受益于专门 prompt 和结构。

调查更加多样。有些需要读代码，有些需要理解评测器失败，有些需要比较 trace。因此，我们使用由主智能体动态提示的通用调查子智能体。

### 约束 issue 类别

让智能体发明任意 issue 类别，会让输出更难评估，也更难信任。预定义分类体系让我们可以控制质量、衡量性能，并有意识地扩展覆盖范围。

### 更偏好断言，而不是完整预期输出

对于回归样本，断言通常比完整参考答案更合适。它们捕捉“必须为真”的内容，而不会过度约束正确回复的具体措辞。

### 让主智能体聚焦 issue

主智能体只创建 issue 以及相关数据集/评测器产物。它不直接尝试修复 prompt 或代码。

当 issue 需要修复时，主智能体用 `needs_fix` 标记它。独立修复智能体随后处理修复建议。

这个拆分来自我们的观察：当一个智能体必须在同一轮中同时识别 issue 和提出修复时，它会变得吃力。

## 结论

Engine 是我们对自动化更多智能体改进循环的尝试。

智能体可观测性的难点不只是看见一条 trace 中发生了什么。难点是跨许多 trace 找到重复模式，判断哪些模式重要，并把这些模式转化为 issue、评测器、数据集样本和修复。

架构反映了这个循环。Engine 准备上下文，大规模筛查 trace，调查可能 issue，创建 issue 产物，在需要时把修复交接给独立智能体，并为下一次运行更新记忆。

它已经改变了我们内部改进智能体的方式。我们不再手动挖 trace、再单独写评测，而是可以把生产行为直接转化为 issue、修复和测试。

你可以在 LangSmith 追踪项目的 Issues 标签页中找到 Engine。如果你想要具备代码感知的修复建议，可以连接仓库；也可以只从 trace 开始，看看 Engine 发现了哪些重复模式。
