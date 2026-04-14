# Meta-Harness：模型 Harness 的端到端优化

> 原文：[Meta-Harness: End-to-End Optimization of Model Harnesses](https://arxiv.org/abs/2603.28052)
> 作者：Yoonho Lee, Roshen Nair, Qizheng Zhang, Kangwook Lee, Omar Khattab, Chelsea Finn (Stanford, KRAFTON, MIT)
> 日期：2026-03-30
> 翻译方式：baoyu-translate skill (refined mode)

---

###### 摘要

大语言模型（LLM）系统的性能不仅取决于模型权重，还取决于其 Harness：决定存储、检索和呈现给模型哪些信息的代码。然而，Harness 在很大程度上仍然依赖手工设计，而现有的文本优化器（text optimizer）与该场景匹配不佳，因为它们对反馈的压缩过于激进：要么无记忆，要么仅依赖标量分数，要么将反馈限制在简短模板或摘要中。我们提出 Meta-Harness，一个通过搜索 LLM 应用的 Harness 代码来进行优化的外循环（outer loop）系统。它使用一个智能体式提议器（agentic proposer），通过文件系统（filesystem）访问所有先前候选方案的源代码、分数和执行轨迹（execution traces）。在在线文本分类（online text classification）任务上，Meta-Harness 比最先进的上下文工程（Context Engineering）管理系统提高了 7.7 个百分点，同时使用的上下文 token（context tokens）减少了 4 ×。在检索增强数学推理（retrieval-augmented math reasoning）任务上，单个发现的 Harness 在 200 道 IMO 难度的问题上平均提高了 4.7 个百分点的准确率，该结果在五个未参与搜索的模型上保持一致。在智能体编码（agentic coding）任务上，发现的 Harness 超越了最佳的手工工程化基线（baseline）。总之，这些结果表明，更丰富的先验经验访问能够赋能自动化 Harness Engineering。

项目页面及交互式演示：[https://yoonholee.com/meta-harness/](https://yoonholee.com/meta-harness/)

优化后的 Harness：[https://github.com/stanford-iris-lab/meta-harness-tbench2-artifact](https://github.com/stanford-iris-lab/meta-harness-tbench2-artifact)

![Refer to caption](https://arxiv.org/html/2603.28052v1/x1.png)

Figure 1：（左）在文本分类任务上，Meta-Harness 优于现有最佳的手工设计 Harness（ACE）和现有文本优化器（TTT-Discover、OpenEvolve），仅经过 4 次评估即达到次优方法的最终准确率。（右）在 TerminalBench-2 上，Meta-Harness 优于所有已报告的 Claude Haiku 4.5 Harness。

## 1 引言

对于同一基准测试（benchmark），在固定大语言模型（LLM）周围更换 Harness 可以产生 6 × 的性能差距 [^46]。Harness——决定存储、检索和向模型展示什么内容的代码——其重要性往往与模型本身不相上下。这种敏感性引发了人们对 Harness Engineering 日益增长的兴趣，即通过改进 LLM 周围代码来提升整体系统性能的实践 [^35] [^20] [^9] [^8]。但尽管 Harness Engineering 十分重要，它在很大程度上仍然依赖手工操作：从业者检查失败案例、调整启发式规则，并在少量设计方案中反复迭代。在本文中，我们探讨这一过程本身是否可以实现自动化。

一个自然的出发点是近期在文本优化（text optimization）方面的工作，因为 Harness Engineering 同样涉及利用先前尝试的反馈来迭代改进文本和代码制品 [^37] [^38] [^34] [^25] [^1]。然而，这些方法与 Harness Engineering 的匹配度较差，因为它们通常采用短视或高度压缩的反馈：有些仅基于当前候选方案进行优化 [^30] [^50] [^52]，有些主要依赖标量分数 [^34] [^11]，还有一些将反馈限制在简短模板或 LLM 生成的摘要中 [^1] [^25]。这是一种务实的可扩展性选择，而非长程依赖无信息的证据。Harness 作用于长时间跨度：关于存储什么、何时检索、如何呈现的单一决策，可能在许多推理步骤之后才影响行为。压缩反馈往往会移除将下游失败追溯到早期 Harness 决策所需的信息。在若干代表性文本优化器所研究的任务中，每个优化步骤的可用上下文仅为 100 至 30,000 个 token（Table 1），远低于 Harness 搜索的诊断信息足迹。更广泛地说，检索和记忆增强语言模型的相关工作表明，有用的上下文通常应该自适应地访问，而非整体打包到单个提示中 [^27] [^47] [^36] [^55]。

![Refer to caption](https://arxiv.org/html/2603.28052v1/x3.png)

Figure 2：Meta-Harness 搜索循环。(1) 一个智能体读取包含所有先前候选方案源代码、执行轨迹和分数的文件系统，并提出新的 Harness。(2) 在评估任务上评估所提出的 Harness。(3) 所有日志（提出的代码、推理轨迹、评估分数）存储在文件系统的新目录中，循环继续。

| 方法 | 历史记录 | 日志内容 | MTok/轮 |
| --- | --- | --- | --- |
| OPRO [^50] | 窗口 | 过去的（方案，分数）对 | 0.002 |
| TextGrad [^52] | 最新 | 对当前制品的文本反馈 | 0.015 |
| AlphaEvolve [^34] | 窗口 | 程序数据库 + 评估分数 | 0.022 |
| GEPA [^1] | 摘要 | Rollout 轨迹的反思性反馈 | 0.008 |
| Feedback Descent [^25] | 摘要 | 比较 + 文本反馈 | 0.012 |
| TTT-Discover [^54] | 窗口 | 先前方案片段 | 0.026 |
| Meta-Harness | 完整 | 所有日志和分数 | 10.0 |

Table 1：文本优化方法及其设置的比较。每行代表一种方法，跨任务进行汇总。MTok/轮是我们对每篇论文所考虑的最大设置下，单次文本制品评估生成的完整上下文的最佳估计值。本文考虑的设置在每次制品评估时产生数量级更多的上下文。

我们通过 Meta-Harness 来解决这一局限性——这是一个通过端到端搜索来优化 Harness 的智能体式 Harness（Figure 2）。其提议器（proposer）是一个编码智能体（coding agent），即一个基于语言模型的系统，能够调用开发者工具并修改代码。选择编码智能体（而非原始 LLM）至关重要，因为经验积累量很快就会超出上下文窗口（context window）的限制，因此提议器必须自主决定检查什么内容，并通过与代码库的直接交互来验证编辑。其关键设计选择是通过文件系统暴露完整历史，使得提议器能够选择性地诊断原始的先前代码和执行轨迹，而非从压缩的逐候选摘要中进行优化。对于每个先前的候选 Harness（candidate harness），文件系统存储了源代码、评估分数和执行轨迹，提议器通过标准操作（如 grep 和 cat）进行检索，而非将它们作为单个提示来消化。在实践中，在我们最高要求的设置中，提议器每次迭代中位数读取 82 个文件，每步引用超过 20 个先前候选方案（Appendix A）。在我们研究的设置中，单次评估可以产生多达 10,000,000 个 token 的诊断信息，大约比先前文本优化设置中使用的最大反馈预算高三个数量级（Table 1）。

我们在在线文本分类、数学推理和智能体编码三个任务上评估 Meta-Harness。在在线文本分类任务上，Meta-Harness 发现的 Harness 比 Agentic Context Engineering（ACE，[^58]）提高了 7.7 个百分点，同时使用的上下文 token 减少了 4 ×，并且在次优文本优化器经过 60 次提议后达到的最终性能，Meta-Harness 仅用四次即可匹配（Figure 1）。在检索增强数学推理任务上，单个发现的 Harness 在 200 道 IMO 难度的问题上平均提高了 4.7 个百分点的准确率，该结果在五个未参与搜索的模型上保持一致。在 TerminalBench-2 上，发现的 Harness 超越了 Terminus-KIRA，在所有 Haiku 4.5 智能体中排名第一。

## 2 相关工作

在高层面上，Meta-Harness 将信用分配（credit assignment）和元学习（meta-learning）[^39] [^45] [^2] [^16] [^43] 等更广泛文献中的思想引入了一个由近期编码智能体（coding agent）进展所开启的新领域。该系统不是更新模型权重，而是在 Harness 层面分配信用：它利用过去 Rollout 的经验来审慎推理哪些步骤和组件导致了失败，然后重写控制未来行为的外部代码。更具体地说，该方法位于几个近期研究主线的交汇处；它与自适应外部上下文访问、可执行代码搜索和文本优化的工作最为直接相关。

外部记忆与自适应访问。若干先前工作指出，将大型知识源或长输入作为语言模型自适应访问的外部资源来处理，比单次消化更有益。具体而言，检索增强生成（retrieval-augmented generation）[^27]、交错检索与推理 [^47]、基于记忆的智能体 [^36] 或递归语言模型 [^55] 都是自适应访问外部上下文的机制。Meta-Harness 使用类似的访问模式，但处于 Harness Engineering 这一更具挑战性的场景中，其中提议器选择性地检查由代码、分数和执行轨迹组成的大规模外部历史，以改进上下文管理程序本身。

可执行代码搜索。近期方法在可执行代码空间中搜索函数、工作流或智能体设计。早期工作提出使用大模型作为演化程序搜索中的变异和交叉算子 [^26]。后续方法在固定程序框架内演化指定函数 [^38]、使用元智能体从先前发现中编程新智能体 [^19]，或为智能体系统搜索工作流图 [^57]。另一方向的工作在持续学习智能体的记忆设计空间中搜索，其中记忆跨任务流持续存在 [^56] [^49]。相比之下，Meta-Harness 搜索的是领域特定的 Harness，包括提示构造、检索和状态更新策略——这些策略在任务之间会重置。其外循环刻意保持最小化：不依赖固定框架、先前发现的存档或持久记忆机制，而是赋予提议器对先验经验的无限制文件系统访问权限。这使得智能体能够自主决定检查哪些信息，并能够在完整的 Harness 实现空间中搜索，而非在预定义的上下文管理程序空间中搜索。

文本优化方法。Meta-Harness 还与 ProTeGi、TextGrad、OPRO、GEPA、AlphaEvolve/OpenEvolve 和 Feedback Descent 等方法密切相关，这些方法利用先前尝试的反馈来迭代改进提示或其他文本制品 [^37] [^30] [^52] [^50] [^1] [^34] [^42] [^25]。然而，这些方法对 Harness Engineering 的适用性较差——在该场景中，优化目标是一个完整的可执行程序，且相关的环境反馈分布在代码、分数和执行轨迹中，难以预先进行摘要。Meta-Harness 中的提议器不是仅对聚合分数或摘要做出反应，而是能够对失败样本及其执行轨迹进行推理，从而提出有针对性的编辑。Table 1 比较了这些论文和我们的论文所考虑的问题规模，Figures 1 和 4 提供了与 OpenEvolve、GEPA 和 TTT-Discover 在我们问题设置中的直接比较。

## 3 Meta-Harness：优化 Harness 的 Harness

本节描述 Meta-Harness，即我们用于搜索任务特定 Harness 的外循环程序。Meta-Harness 建立在这样一个理念之上：Harness 优化受益于允许提议器通过文件系统访问来选择性地检查先前代码和执行轨迹，而非从有损摘要或额外的手工设计搜索结构中进行优化。在高层面上，它反复提出、评估和记录新的 Harness。

Meta-Harness 本身在广义上也是一种 Harness（因此得名），因为它决定了提议器模型在搜索过程中看到哪些信息。除非另有说明，我们使用 *Harness* 指代正在被优化的任务特定程序。

**目标。** Harness 是一个有状态的程序，它包装语言模型并决定模型在每一步看到什么上下文。目标很简单：找到使底层模型在目标任务分布上表现最佳的 Harness。形式化地，设 M 为一个固定的语言模型，𝒳 为一个任务分布。对于 Harness H 和任务实例 x∼𝒳，我们执行一条 Rollout 轨迹 τ∼p_M(H,x)。Harness 为 M 构造提示，模型做出响应，Harness 在每次交互后更新其状态。一个任务特定的奖励函数（reward function）r(τ,x) 对该轨迹进行评分。Harness 优化的目标是找到使期望最终奖励最大化的 Harness：

$$
H^{*}=\operatorname*{arg\,max}_{H}\mathbb{E}_{x\sim\mathcal{X},\tau\sim p_{M}(H,x)}\;r(\tau,x),
$$

当存在多个目标（例如准确率和上下文代价）时，我们在 Pareto 支配关系下评估候选方案并报告由此产生的前沿。在实践中，这种搜索传统上由人类工程师和研究人员执行，他们手动迭代改进提示、上下文管理规则和工具使用逻辑。

**Meta-Harness 搜索循环。** Meta-Harness 使用单个编码智能体提议器，该提议器可以访问一个不断增长的文件系统 𝒟，作为其反馈通道 ^1^。这里，编码智能体是一个基于语言模型的系统，能够调用开发者工具并修改代码。与先前将改进逻辑外化到手工设计搜索循环中的系统不同，Meta-Harness 将诊断和提议委托给编码智能体本身：由它决定检查哪些先前制品、解决哪些失败模式，以及是进行局部编辑还是更大规模的重写。等价地说，提议器不是一个在由外循环组装的固定提示上运行的原始 next-token 模型；它是一个智能体，能够检索信息、浏览先前制品、并作为搜索过程的一部分来编辑代码。每个已评估的 Harness 贡献一个目录，包含其源代码、分数和执行轨迹（如提示、工具调用、模型输出和状态更新）。文件系统通常远大于提议器的上下文窗口，因此提议器通过终端工具（如 grep 和 cat）查询文件系统，而非将其作为单个提示来消化。在每次迭代中，提议器首先检查先前的代码、分数和执行轨迹，然后推理可能的失败模式，最后生成新的 Harness。

Meta-Harness 维护一个种群 ℋ 和已评估 Harness 上的 Pareto 前沿，但不施加父代选择规则：提议器在提出新 Harness 时可以自由检查任何先前的 Harness 及其执行轨迹。我们运行固定次数的演化迭代，并对 Pareto 前沿进行最终的测试集评估。这种简洁性是刻意为之的：通过将诊断和编辑决策留给提议器，而非硬编码搜索启发式规则，Meta-Harness 可以随着编码智能体能力的增强而自动改进。提议器永远不会看到测试集结果；其唯一反馈来自搜索集——即在搜索过程中用于评估候选 Harness 并为改进生成反馈信号的任务实例子集——以及这些搜索运行期间记录的执行轨迹。

**代码空间搜索的优势。** Harness 优化发生在代码空间中，其中检索、记忆或提示构造逻辑的微小变化可能在许多步骤之后才影响行为，使得局部搜索启发式方法与该问题匹配不佳。通过检查执行轨迹，提议器通常可以推断 Harness *为何*失败以及哪些早期设计选择可能导致了失败，而不仅仅是*它失败了*，正如 Appendices A 和 A.2 中的搜索轨迹所示。在那里，我们看到提议器广泛阅读先前的代码和日志，然后利用这些轨迹来识别混淆编辑、隔离可能的因果变化，并在反复回退后转向更安全的修改。因此，提议器可以在算法结构层面修改 Harness——从检索、记忆或提示构造逻辑的变更到完整的程序重写——而非填充模板或应用预定义的变异算子。在实践中，它通常从一个强大的先验 Harness 开始，但这是一种涌现策略而非硬编码规则。尽管搜索空间很大，但将 Harness 表示为程序提供了一种自然的正则化偏差：编码模型倾向于提出连贯的算法而非脆弱的硬编码解决方案，这使搜索偏向于可复用的上下文管理程序。这种动作空间与前沿编码助手所训练的读-写-执行工作流紧密对齐。

**实际实现。** 在我们的实验中，每个 Harness 是一个单文件 Python 程序，修改特定任务的提示、检索、记忆和编排逻辑。在我们的实验中，提议器 P 是配备 Opus-4.6 的 Claude Code [^4]。提议器由一个最小化的领域特定技能（skill）引导，该技能描述了在哪里写入新 Harness、如何检查先前 Harness 及其执行轨迹，以及哪些文件可以修改、哪些不可以。基础模型 M 因领域而异，始终保持冻结；详见 Section 4。在我们的实验中，典型的一次运行在 20 次迭代中大约评估 60 个 Harness。我们在 Appendix D 中提供了在新领域实现 Meta-Harness 的额外建议。

Algorithm 1 Meta-Harness Harness 外循环

输入：任务 𝒳，LLM M，提议器 P，迭代次数 N

初始化：种群 ℋ ▷ 有效 Harness 的初始集合

初始化：文件系统 𝒟 ← ∅ ▷ 存储代码、分数、轨迹

for H ∈ ℋ do

   E_H ← Evaluate(H, M, 𝒳)    𝒟 ← 𝒟 ∪ {(H, E_H)}

for t = 1…N do

  提议器 P 查询文件系统 𝒟 ▷ 检查先前 Harness 和分数

  提议器 P 提出 k 个新 Harness {H₁, …, Hₖ}

  for H in {H₁, …, Hₖ} do

   if H 通过接口验证 then

      𝒟 ← 𝒟 ∪ {(H, Evaluate(H, M, 𝒳))}

返回 𝒟 中存储的 Harness 的 Pareto 前沿

## 4 实验

我们在三个任务领域评估 Meta-Harness：在线文本分类、数学推理和智能体编码。在每个领域中，我们使用标准评估指标，将搜索发现的 Harness 与领域适当的基线进行比较。请参阅各小节了解详细的实验设置。

我们与两大类方法进行比较。(1) 人工设计的策略：这些是每个领域的手工制作 Harness，代表上下文构造方面的当前最先进水平。我们在相应小节中描述这些基线。(2) 程序搜索方法：这些方法使用反馈和奖励信号在候选 Harness 上进行搜索，但设计用于比 Harness Engineering 更小规模的场景。

### 4.1 在线文本分类

我们遵循 [^58] [^51] 的在线文本分类设置：LLM 逐条接收带标签的样本，更新其记忆，然后在留出的测试集上进行评估。我们使用 GPT-OSS-120B 作为 LLM 文本分类器，并考虑为文本分类设计 Harness 的问题。我们使用三个数据集，根据难度和领域多样性选取：LawBench (Law) [^15] 从案例描述中预测刑事指控（215 个类别）；Symptom2Disease (S2D) [^18] 从症状描述中预测疾病（22 个类别）；USPTO-50k [^40] 从产物分子中预测前体反应物（180 个类别）。我们从该设置中的主要基线 Harness 初始化搜索种群 ℋ：零样本（zero-shot）、少样本（few-shot）、ACE 和 MCE。我们运行了 20 次演化迭代，每次迭代两个候选方案，共产生 40 个候选 Harness。

![Refer to caption](https://arxiv.org/html/2603.28052v1/x4.png)

Table 2：三个数据集上所有 Harness 的测试集指标。Ctx 表示上下文中的额外输入 token（千）。†：来自 [^51] 的实现。↓：越低越好。Meta-Harness 在使用更少输入上下文的同时提高了在线文本分类准确率。

**与文本优化器的比较。** 我们将 Meta-Harness 与代表性的文本优化方法进行比较。为了公平比较，我们使用相同的提议器配置（配备最大推理的 Opus-4.6），仅基于搜索集性能选择候选方案，并将测试集保留到最终评估时才使用。由于评估是主要的计算瓶颈，我们为每种方法提供相同的提议 Harness 评估预算。我们考虑以下比较对象：

- Best-of-N：从种子进行独立采样，无搜索结构；一个计算量匹配的对照，用于验证搜索是否有价值。
- OpenEvolve [^42]：使用 LLM 变异的程序演化搜索。
- TTT-Discover [^53]：我们仅使用其方法中的文本优化组件，即通过 PUCT 复用规则进行提议选择。

在此设置中，Meta-Harness 以 0.1× 的评估次数匹配了最佳先前文本优化器（OpenEvolve、TTT-Discover）的性能，且其最终准确率超出它们 10 个百分点以上（Figures 1 和 4）。我们将这种加速归因于对外循环施加最小必要结构的刻意设计选择（Section 3）。具体而言，Meta-Harness 使用文件系统保留完整的经验历史，并允许提议器检查任何必要的内容，而 OpenEvolve 和 TTT-Discover 的提议器输入则比完整文件系统访问更加结构化且受限得多。我们注意到，在线文本分类是我们研究的最小上下文设置（Table 1），因此如果结构化程度较高的文本优化器在这里就已经落后，那么它们的局限性在更困难的场景中可能只会更加突出。

> **Meta-Harness 快 10 × 且收敛到更好的 Harness**
>
> 在此设置中，Meta-Harness 以 10× 更少的完整评估次数匹配了最佳先前文本优化器（OpenEvolve、TTT-Discover）的性能，且其最终准确率超出它们 10 个百分点以上。

| 方法 | 分数 | 代码 | 摘要 | 轨迹 | 中位数 ↑ | 最佳准确率 ↑ | > ZS |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 仅分数 | ✓ | ✓ | × | × | 34.6 | 41.3 | 26 |
| 分数 + 摘要 | ✓ | ✓ | ✓ | × | 34.9 | 38.7 | 23 |
| Meta-Harness（完整） | ✓ | ✓ | \- | ✓ | 50.0 | 56.7 | 39 |

Table 3：在线文本分类中提议器可用信息的消融实验（ablation）。> ZS：准确率超过零样本基线的运行次数。完整的 Meta-Harness 接口显著优于仅分数和分数加摘要的消融配置。对原始执行轨迹的访问是赋能 Harness 搜索的关键要素。

为了隔离提议器接口中哪些部分最为重要，我们在在线文本分类中比较了三种条件：仅分数条件、分数加摘要条件（提议器接收 LLM 生成的摘要但没有原始轨迹），以及具有执行轨迹访问权限的完整 Meta-Harness 接口（Table 3）。结果显示完整接口具有显著优势：仅分数达到 34.6 的中位数和 41.3 的最佳准确率，分数加摘要达到 34.9 的中位数和 38.7 的最佳准确率。相比之下，Meta-Harness 达到 50.0 的中位数和 56.7 的最佳准确率，即使其中位候选方案也优于两种消融条件下找到的最佳候选方案。我们将此解释为完整执行轨迹访问是接口中最重要组件的证据：摘要无法恢复缺失的信号，甚至可能因压缩掉诊断性有用的细节而产生负面影响。

| 方法 | 中位数 | 最佳 |
| --- | --- | --- |
| GEPA [^1] | 32.6 | 40.2 |
| Best-of-N | 34.0 | 44.2 |
| OpenEvolve [^42] | 39.1 | 43.3 |
| TTT-Discover [^53] | 34.1 | 45.6 |
| Meta-Harness | 50.0 | 56.7 |

Table 4：不同文本优化器提出的 Harness 的文本分类准确率（搜索集）。Meta-Harness 在 Harness 优化方面显著更有效。

**与最先进 Harness 的比较。** 我们的主要比较对象是针对此问题设置的手工设计 Harness：Agentic Context Engineering（ACE，[^58]），使用反思性记忆策展来逐步构建上下文；Meta Context Engineering（MCE，[^51]），维护并演化一个用于上下文构造的自然语言技能库。作为额外基线，我们评估零样本提示和 N∈{4,8,16,32,all} 示例的少样本提示。Table 2 的结果表明，Meta-Harness 相比先前的手工设计 Harness 有了显著改进。所选的 Meta-Harness ^2^ 达到 48.6% 的准确率，比 ACE 高出 7.7 个百分点，比 MCE 高出 8.6 个百分点。这些增益并非来自使用更多上下文：Meta-Harness 仅使用 11.4K 上下文 token，而 ACE 使用 50.8K，MCE 使用 28.5K。

**准确率-上下文权衡。** 由于 Meta-Harness 对 Harness 代码执行自由形式的优化，我们可以同时表达对准确率和上下文代价的联合偏好，而不是预先承诺单一的标量目标。仅给出当前指标和期望的权衡，提议器就能够在前沿的广泛范围内发现 Harness，在 Figure 3 中产生一条平滑的准确率-上下文 Pareto 曲线。这使我们能够以可控的方式用额外的上下文换取更高的测试准确率，而非承诺于单一的手工设计操作点。

**分布外（OOD）任务评估。** 我们评估发现的 Harness 是否能泛化到搜索过程中完全未见的新数据集。我们考虑九个多样化的数据集，在 Section C.1 中详细描述。所选的 Meta-Harness 系统达到了最佳的平均准确率（73.1%），优于 ACE（70.2%）和所有少样本基线（Table 5）。值得注意的是，我们观察到朴素地增加超过 32 个少样本示例在 7/9 个任务中反而损害了性能。Meta-Harness 在 6/9 个数据集上表现最佳，这表明发现的 Harness 捕获了文本分类的普遍有效策略，而非过拟合到搜索过程中使用的特定数据集。

| Harness | SciC | FiNER | Amz5 | FPB | GoEmo | Bank77 | News | SciT | TwHate | 平均准确率 | Ctx ↓ |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Zero-shot | 32.7 | 56.0 | 52.7 | 90.0 | 42.0 | 80.7 | 84.7 | 89.3 | 75.3 | 67.0 | \- |
| Few-shot (8) | 34.0 | 63.0 | 54.0 | 90.0 | 44.0 | 82.7 | 84.7 | 91.3 | 76.7 | 68.9 | 2.2 |
| Few-shot (32) | 38.7 | 62.0 | 53.3 | 90.7 | 43.3 | 86.0 | 85.3 | 90.7 | 76.7 | 69.6 | 5.2 |
| Few-shot (all) | 35.3 | 61.0 | 50.0 | 93.3 | 42.7 | 80.7 | 84.0 | 90.0 | 76.7 | 68.2 | 7.4 |
| ACE [^58] | 40.7 | 74.0 | 48.0 | 96.7 | 44.0 | 83.3 | 86.0 | 90.7 | 68.7 | 70.2 | 11.7 |
| Meta-Harness | 53.3 | 67.0 | 60.0 | 94.0 | 46.0 | 82.7 | 86.7 | 91.3 | 77.3 | 73.1 | 7.3 |

Table 5：分布外文本分类数据集评估。我们报告每个数据集的测试准确率以及九个数据集的平均额外上下文 token。Meta-Harness 在这 9 个先前未见的任务上比次优方法高出 2.9 个百分点。

### 4.2 检索增强推理的 Harness

我们研究了一种较为非标准的奥林匹克数学解题设置：赋予模型从大型语料库中检索示例的能力。原则上有充分理由期望检索有助于数学推理，因为解题方案经常共享可复用的证明模式，因此先前的推理轨迹包含模型在推理时可以利用的信息。然而，检索尚未成为该设置中的标准组件，先前工作表明，与更注重事实的领域相比，检索在推理密集型数学基准测试上的成功远不如预期 [^41] [^48] [^5]。困难在于朴素检索很少能以正确的形式呈现正确的轨迹。这表明成功不取决于是否添加检索，而取决于发现正确的检索策略。我们不是手工设计该策略，而是给 Meta-Harness 一组高难度的奥林匹克问题，允许检索行为本身从搜索中涌现。

检索语料库包含来自八个开源数据集的 ≥ 500,000 道已解决问题。我们针对两个评估基准测试和搜索集进行了仔细的去重和去污染，确认留出的问题在我们基于字符串的过滤器下没有精确前缀匹配，并手动检查了留出样本的 BM25 检索结果（Section C.2）。我们使用 Meta-Harness 在 250 道奥林匹克难度数学问题（OlympiadBench + Omni-MATH hard）的搜索集上优化 Harness，进行 40 次迭代，产生 109 个候选检索 Harness。我们从该设置中的主要基线 Harness 初始化搜索种群 ℋ：零样本、少样本和 ACE。我们基于 GPT-OSS-20B 的搜索集性能选择单个 Harness（Section B.2）。我们在 200 道先前未见的 IMO 难度问题上评估该 Harness，这些问题来自 IMO-AnswerBench、IMO-ProofBench 和 ArXivMath [^29] [^5]。除 GPT-OSS-20B 外，我们还在搜索期间未见的四个模型上评估相同的检索 Harness：GPT-5.4-nano、GPT-5.4-mini、Gemini-3.1-Flash-Lite 和 Gemini-3-Flash。我们遵循先前工作的标准评估协议 [^29]，报告每题三次采样的平均准确率。

**结果。** Table 6 将发现的 Harness 与无检索、使用独立嵌入模型 text-embedding-3-small 的稠密检索、随机少样本提示和 BM25 检索进行比较。相比之下，Meta-Harness 完全在代码空间中运行，基于与稀疏基线相同的 BM25 词法检索栈，而非引入额外的稠密编码器。发现的检索 Harness 在所有五个留出模型上都优于无检索基线，平均增益为 4.7 个百分点。它在平均水平上也匹配或超过了最强的固定基线，比 BM25 检索整体高出 1.3 个百分点，同时避免了稠密检索和随机少样本提示在多个模型上观察到的性能回退。

| 方法 | GPT-5.4n | GPT-5.4m | Gem-3.1FL | Gem-3F | GPT-20B | 平均 |
| --- | --- | --- | --- | --- | --- | --- |
| 无检索器 | 23.0 | 28.8 | 28.6 | 42.6 | 47.6 | 34.1 |
| 稠密检索 (k=1) | 27.1 (+4.1) | 24.5 (-4.3) | 31.3 (+2.7) | 42.3 (-0.3) | 46.9 (-0.7) | 34.4 (+0.3) |
| 稠密检索 (k=5) | 31.1 (+8.1) | 28.3 (-0.5) | 37.1 (+8.5) | 47.2 (+4.6) | 46.7 (-0.9) | 38.1 (+4.0) |
| 随机少样本 | 23.1 (+0.1) | 24.5 (-4.3) | 31.0 (+2.4) | 40.4 (-2.2) | 41.8 (-5.8) | 32.2 (-1.9) |
| BM25 检索 | 30.2 (+7.2) | 29.2 (+0.4) | 32.8 (+4.2) | 46.6 (+4.0) | 48.9 (+1.3) | 37.5 (+3.4) |
| Meta-Harness | 31.7 (+8.7) | 30.4 (+1.6) | 34.9 (+6.3) | 46.3 (+3.7) | 50.6 (+3.0) | 38.8 (+4.7) |

Table 6：200 道 IMO 难度数学问题上的检索增强数学解题。我们报告每题三次采样的平均 pass@1，括号内为相对基线的绝对提升。发现的 Meta-Harness 检索策略在所有五个留出模型上改进了这些 IMO 难度问题的推理，相比无检索器平均增益 4.7 个百分点。

> **Meta-Harness 改进了 IMO 难度数学问题的推理**
>
> 在检索增强数学推理中，单个发现的检索 Harness 跨五个留出模型泛化，平均准确率比无检索提高 4.7 个百分点，在所有比较方法中产生了最强的整体平均表现。

### 4.3 在 TerminalBench-2 上评估智能体编码 Harness

TerminalBench-2 [^32] 在 89 个高难度任务上评估 LLM 智能体，这些任务要求长程、完全自主的执行，涉及复杂的依赖关系和大量的领域知识。先前工作已表明，智能体 Harness 的选择对该基准测试的性能有重大影响。我们从两个强大的开源基线 Terminus 2 [^32] 和 Terminus-KIRA [^24] 开始初始化搜索。在本实验中，我们在相同的 89 个任务基准测试上执行搜索和最终评估。我们将此基准测试作为一个发现问题（discovery problem）[^54] 使用，其目标是发现一种能够在高难度、公开竞争的基准测试上提升性能的 Harness 配置。这是标准做法：公开文章已经描述了在 TerminalBench 本身上进行的反复针对基准测试的 Harness 迭代 [^17] [^33] [^24]，且该基准测试规模小、评估代价高，引入单独的分割将实质性地削弱搜索信号。我们还通过人工检查和基于正则表达式的审计来检查任务特定字符串是否泄露到演化出的 Harness 中，以此检测过拟合。我们注意到，尽管由此产生的 Harness 专门针对 TerminalBench-2 的场景，但从单条指令自主完成困难的长程任务是一项核心能力，且该基准测试由许多前沿模型和高度工程化 Harness 都难以完成的任务组成。

| Harness | 自动 | 通过率 (%) |
| --- | --- | --- |
| Claude Opus 4.6 |  |  |
| Claude Code | × | 58.0 |
| Terminus 2 | × | 62.9 |
| Mux | × | 66.5 |
| Droid | × | 69.9 |
| TongAgents | × | 71.9 |
| MAYA-V2 | × | 72.1 |
| Terminus-KIRA | × | 74.7 |
| Capy | × | 75.3 |
| ForgeCode | × | 81.8 |
| Meta-Harness | ✓ | **76.4** |
| Claude Haiku 4.5 |  |  |
| OpenHands | × | 13.9 |
| Claude Code | × | 27.5 |
| Terminus 2 | × | 28.3 |
| Mini-SWE-Agent | × | 29.8 |
| Terminus-KIRA | × | 33.7 |
| Goose | × | 35.5 |
| Meta-Harness | ✓ | **37.6** |

Table 7：TerminalBench-2 上的通过率。其他结果来自官方排行榜。Meta-Harness 在所有 Opus-4.6 智能体中排名第二，在所有 Haiku-4.5 智能体中排名第一。

**结果。** 我们在 Table 7 中报告了完整基准测试的结果，使用两个基础模型进行评估：Claude Opus 4.6 和 Claude Haiku 4.5。在 Opus 4.6 上，Meta-Harness 发现了一个达到 76.4% 通过率的 Harness，超越了手工工程化的 Terminus-KIRA（74.7%），在 TerminalBench-2 排行榜上所有 Opus 4.6 智能体中排名第二。唯一得分更高的 Opus 4.6 智能体是 ForgeCode（81.8%）；然而，我们无法仅从公开可用的代码复现其报告结果，这表明其排行榜分数依赖于已发布仓库之外的组件。在较弱的 Haiku 4.5 模型上，改进更为显著：Meta-Harness 达到 37.6%，比排名次优的已报告智能体（Goose，35.5%）高出 2.1 个百分点。TerminalBench-2 是一个被多个团队积极争夺、直接针对其进行优化的基准测试，因此自动搜索方法能够在这一前沿取得收益，对于长程文本优化循环而言是令人鼓舞的。

**提议器的定性行为。** Harness 搜索轨迹有助于解释 Meta-Harness 为何取得这些收益；我们在 Appendix A 中提供了详细总结。在早期迭代中，提议器将合理的结构性修复与提示模板编辑相结合，并观察到两个候选方案都出现了性能回退。然后它明确假设回退是由共享的提示干预所混淆的，将结构性变更从提示重写中隔离出来，并最终转向一种更安全的加性修改，该修改成为本轮运行中的最佳候选方案。这提供了定性证据，表明文件系统访问使提议器能够以足够的细节检查先前经验，从而形成因果假设并据此修订 Harness。

> **Meta-Harness 在 TerminalBench-2 上超越手工工程化智能体**
>
> 在 TerminalBench-2 上，Meta-Harness 自动发现的 Harness 在 Opus 4.6 上超越了 Terminus-KIRA，并在所有 Haiku 4.5 智能体中排名第一。

## 5 讨论

除了优于现有 Harness 之外，Meta-Harness 还具有若干实际优势。发现的 Harness 能够泛化到分布外分类数据集（Table 5）以及数学设置中未见的基础模型（Table 6）。一次搜索运行在几小时的墙钟时间内完成，却能产生可读的、可迁移的策略，可在不同模型之间复用，包括未来更强大的模型。代码空间中的过拟合也更具可检查性：脆弱的 if 链或硬编码的类别映射在检查时是可见的，而权重空间中的过拟合则不然。更广泛地说，我们的结果表明 Meta-Harness 的主要优势不仅在于代码搜索，更在于具有*选择性先验诊断经验访问*的搜索。提议器不受限于标量奖励或固定摘要；它可以检查原始代码、执行轨迹和先前失败，然后利用这些信息来形成和检验关于改变什么的假设。Section A.2 中的定性搜索轨迹直接说明了这种行为。

我们的发现反映了机器学习中一个反复出现的模式 [^44]：一旦搜索空间变得可访问，更强的通用智能体就能超越手工工程化的解决方案。未来工作的一个自然下一步是协同演化 Harness 和模型权重，让策略塑造模型学习的内容，反之亦然。虽然我们在三个多样化的领域上进行了评估，但我们的实验证明 Harness 搜索可以与一个特别强大的编码智能体提议器（Claude Code）配合工作；更广泛地研究该效果如何随提议器智能体变化而变化仍然是未来工作。

## 致谢

我们感谢 KRAFTON AI 提供的 API 信用支持。本工作由 OpenAI、KFAS 和 Schmidt Sciences AI2050 支持。我们感谢 Anikait Singh 和 Jubayer Ibn Hamid 提供的宝贵反馈和建议，并感谢 Sienna J. Lee 在本工作早期阶段耐心倾听 YL 尚未成形的想法。

## 参考文献

![Refer to caption](https://arxiv.org/html/2603.28052v1/x5.png)

Figure 4：在线文本分类中所有比较文本优化器的搜索集准确率随评估次数的变化。每个点是一个候选 Harness；折线跟踪当前最优。单数据集曲线与聚合曲线一同展示。Meta-Harness 在前 4 次评估内即达到 OpenEvolve 和 TTT-Discover 的最终准确率，并持续改进，最终比所有基线高出 10 个百分点以上。

## 附录 A 提议器的定性行为

本节考察提议器在搜索过程中如何使用文件系统，基于 TerminalBench-2 运行（10 次迭代，Claude Opus 4.6）。

### A.1 文件访问统计

为验证提议器确实实质性地使用了文件系统，而非默认进行局部编辑，我们记录了每次迭代的所有文件读取操作。

Table 8 总结了结果。提议器每次迭代中位数读取 82 个文件（范围 69-99），大致均匀分布在先前 Harness 源代码（41%）和执行轨迹（40%）之间，其余为分数摘要（6%）和其他文件（13%）。这证实了提议器的访问模式是非马尔可夫的：它通常检查大部分可用历史，而非仅基于最近的父代进行优化。

| 统计量 | 值 |
| --- | --- |
| 每次迭代读取文件数（中位数） | 82 |
| 每次迭代读取文件数（范围） | 69-99 |
| 文件类型分布 |  |
| Harness 源代码 | 41% |
| 执行轨迹 | 40% |
| 分数/摘要文件 | 6% |
| 其他 | 13% |

Table 8：TerminalBench-2 搜索运行中的提议器文件访问统计（10 次迭代，Claude Opus 4.6）。提议器广泛读取文件系统，对先前源代码和执行轨迹的关注大致相当。

### A.2 定性行为：对先前失败的因果推理

TerminalBench-2 搜索日志揭示了一条清晰的叙事弧线，其中提议器从自身的回退中学习。它不是在局部编辑中随机游走，而是形成了关于早期候选方案为何失败的明确诊断，然后转向更安全的设计模式。下方日志框内的所有文字均为提议器在每次迭代中记录的推理的原文引用（强调为我们所加）。

**迭代 1-2：有前景的 bug 修复被提示编辑所混淆。** 前两次迭代都将合理的结构性修复与提示模板修改捆绑在一起，且两者都相对 64.4% 的 Terminus-KIRA 基线大幅回退。迭代 1 针对泄露的终端标记导致的观测损坏问题，并添加了一个循环断路器：

> 假设：__CMDEND__ 标记片段在长时间运行的任务中泄露到 LLM 的观测中，导致模型混淆并进入无限的无工具调用循环。剥离这些标记 + 添加循环断路器将恢复被浪费的步骤。

该候选方案还引入了一个新的面向清理的提示模板和一个验证检查表。迭代 2 提出了一种不同的状态机修复：

> 双重确认完成机制导致验证螺旋。在轨迹中观察到智能体早期就解决了任务，但因每次验证命令重置 _pending_completion 而额外浪费了 15-40+ 步，需要再次执行 task_complete → checklist → verify 循环。

该第二个候选方案完全移除了 pending-completion 机制，同时也保留了标记剥离和新提示。它仍然出现了回退，这使得提议器拥有了两个失败的候选方案——它们有不同的结构性变更但共享同一个提示干预。

**迭代 3：提议器识别出混淆因素。** 到迭代 3 时，提议器明确推断出回退主要不是由结构性 bug 修复本身导致的：

> 先前尝试：evo_marker_fix (58.9%, -5.6pp)，evo_single_confirm (57.8%, -6.7pp) --- 两者均回退。回退的根本原因：提示模板变更（清理指令）导致智能体在任务完成前删除了必要的状态。结构性 bug 修复被有害的提示变更所混淆。evo_strip_only 隔离了两个已验证的结构性修复。

这是轨迹中的关键因果步骤。提议器注意到前两次失败的共同因素不是特定的 bug 修复，而是面向清理的提示重写。因此，它恢复了原始提示，仅测试标记剥离和循环断路器。由此产生的候选方案仍然略有不足（63.3%，-1.1pp），但其损失远小于早期版本，这支持了混淆因素的诊断。

**迭代 4-6：对已诊断失败模式的直接修复仍然回退。** 接下来的三次迭代继续探索同一设计空间区域，但现在对完成逻辑为何脆弱有了更明确的理论。迭代 4 将失败归因于一个具体的状态机 bug，其中验证命令重置完成标志并将智能体困在重复的检查表循环中：

> 移除两行将完成标志重置的 self._pending_completion = False 代码，这些代码在中间命令运行时重置了完成标志。这修复了一个状态机 bug：(1) 智能体调用 task_complete → 看到 QA 检查表，_pending_completion = True (2) 智能体运行验证命令 → _pending_completion = False（bug！）(3) 智能体再次调用 task_complete → 再次看到检查表 → 无限循环。

提议器甚至引用了具体的轨迹证据，指出 configure-git-webserver 产生了基线失败，智能体在有效解决任务后陷入了 30-60 步的验证螺旋。迭代 5 尝试在保留确认的同时弱化清理语言，但仍然编辑了提示并严重回退。迭代 6 回到更安全的 evo\_strip\_only 基础，并提出了一项系统级优化：

> 当终端输出未变化时，空命令轮次浪费了完整的 LLM 往返。智能等待（在下一次 LLM 调用前最多轮询窗格 3 × 5 秒）可在长时间运行的任务上节省 5-15 个轮次。

该变更也出现了回退。至此，提议器已经学到了一个具体的经验教训：即使局部假设看似合理，对提示和完成流程的修改仍然具有高风险。

**迭代 7：获胜候选方案。** 在连续六次回退之后，提议器将策略从修改控制循环转变为在循环开始之前添加信息：

> 所有 6 次先前迭代都从 64.4% 基线回退，因为它们修改了完成流程、提示模板或观测处理。evo_env_bootstrap 采取了不同的方法——纯加性。它在第一次 LLM 调用前通过单个 shell 命令收集环境快照，并将其附加到初始提示。不修改任何其他方法。这应该能在依赖关系密集的任务上消除 3-5 个浪费的探索轮次，同时不会在已经通过的任务上产生回退风险。

该候选方案是迄今为止的最佳结果。重要的不仅是迭代 7 获胜，而是提议器清楚地阐述了*为何*它应该更安全：它避免触碰先前脆弱的完成机制，而是添加了主要在困难任务上有用的信息。

**迭代 8：组合。** 找到一个加性改进后，提议器接下来尝试将其与一个早期的结构性修复组合：

> 组合两个正交修复——环境快照（节省早期探索轮次）+ 带无工具调用循环断路器的标记剥离——将产生 +1-3pp 的提升，因为它们解决的是独立的失败模式，不触碰提示或确认流程（在先前 7 次迭代中有 5 次导致了回退）。

**迭代 10：跨运行迁移。** 提议器引用了一次先前独立搜索运行的结果：

> 演化历史显示"不清理服务制品"带来了 +18pp 的提升。迭代 9 (evo_no_cleanup_directive) 针对相同的思路，但在评估前崩溃了。

**总结。** 搜索轨迹表明提议器所做的不仅仅是随机变异。在前七次迭代中，它识别出一个混淆因素，直接测试了隔离混淆因素的假设，观察到控制流和提示编辑仍然脆弱，然后刻意转向一种纯加性修改——该修改成为本轮运行中的最佳候选方案。随后它尝试将该获胜思路与早期修复组合，甚至跨运行迁移经验教训。这种对先前失败的因果推理正是完整历史文件系统访问所赋能的，也是压缩反馈优化器无法支持的。

## 附录 B 发现的 Harness

Meta-Harness 发现的是特定于当前问题设置的可执行推理时程序。这些 Harness 是结构化的、领域特定的策略，通常具有非平凡的控制流（如路由、过滤和条件性上下文构造），仅通过是否改进搜索集性能来进行选择。本节呈现代表性 Harness 的紧凑方法级抽象，总结驱动推理时行为的主要行为和控制流决策。作为参考，每个发现的 Harness 的完整实现大约为 100-1000 行代码。

### B.1 文本分类 Harness

在在线文本分类中，Meta-Harness 发现了一系列基于记忆的 Harness，而非单一的规范策略。Table 9 报告了主搜索中非支配变体的 Pareto 前沿，所有变体均仅通过搜索集性能进行选择。我们在此重点介绍两个代表性端点：Meta-Harness (Draft Verification)——最低上下文的前沿点，以及 Meta-Harness (Label-Primed Query)——正文中使用的最高准确率前沿点。

#### 概述。

两种 Harness 都维护一个不断增长的过去带标签样本的记忆，并在推理时从该记忆中构建提示。区别在于用于查询记忆的控制流。Meta-Harness (Draft Verification) 使用两次简短调用，明确地将模型的初始猜测与检索到的反例进行测试；而 Meta-Harness (Label-Primed Query) 将更大的单次调用预算用于明确标签空间和局部决策边界。Figures 5 和 6 总结了这两个程序。

#### Meta-Harness（草稿验证）

对应的发现文件为 draft\_verification.py。这一轻量变体将预测转化为两次调用的过程。它首先检索 5 个最相似的已标注样本并进行草稿预测（draft prediction）。随后基于该草稿标签重新查询同一记忆库，检索 5 个具有相同标签的*确认样本*（confirmers）和 5 个具有不同标签的*挑战样本*（challengers），并询问模型是否维持或修正其初始答案。该方案发现的关键行为是：第二次检索同时依赖于查询和草稿预测，因此 Harness 能够针对模型当前猜测浮现有针对性的反例，而非仅仅是通用的近邻样本。如果累积的已标注样本数量不足，程序将回退为标准的单次调用少样本提示（few-shot prompt）。


Figure 5：草稿验证分类 Harness。第一次调用根据短检索上下文产生草稿标签。第二次调用检索支持和反对该草稿的证据，然后返回最终预测。

- 阶段 1：草稿。检索 5 个最近邻的已标注样本，请求初始预测。
- 阶段 2：验证。基于草稿标签进行条件检索，然后同时展示支持和挑战性样本，再做出最终预测。
- 冷启动。如果可用的已标注样本少于 5 个，跳过两阶段流程，使用标准的单次调用少样本提示。
- 低成本原因。两次调用均使用短检索上下文，因此即使进行两次模型调用，整体上下文开销仍接近前沿方案的低端水平。

#### Meta-Harness（标签引导查询）

对应的发现文件为 label\_primed\_query\_anchored.py。这一最强变体使用由三部分构建的单次较大调用。它首先以*标签引导*（label primer）列出有效的输出标签，然后构建一个*覆盖*（coverage）部分——每个标签包含一个与查询相关的示例，最后添加*查询锚定的对比对*（query-anchored contrastive pairs），将高度相似但标签不同的示例并排放置。覆盖模块暴露了完整的标签空间，而对比模块则锐化了当前查询周围的局部决策边界。在代码实现中，该 Harness 使用 TF-IDF 检索过往已标注样本，并采用查询锚定的配对规则从相同的局部邻域中选取对比样本。


Figure 6：标签引导查询锚定分类 Harness。该程序构建一个暴露标签空间的单一提示，然后用与查询相关的覆盖示例和局部对比对填充。

- 标签引导。在展示任何示例之前先列出有效的输出标签，使模型预先看到完整的答案空间。
- 覆盖模块。对每个已知标签，检索与查询最相关的已标注样本，每个类别包含一个代表性示例。
- 对比模块。构建高度相似但标签不同的示例对，使提示暴露当前查询附近的局部决策边界。
- 检索规则。使用 TF-IDF 相似度和查询锚定的配对选择，而非标签无关的最近邻方法。

|  | 数据集 |  |  | 平均指标 |  |
| --- | --- | --- | --- | --- | --- |
| 变体 | USPTO ↑ | Symptom ↑ | LawBench ↑ | Avg ↑ | Ctx ↓ |
| Meta-Harness (Draft Verification) | 18.0 | 85.4 | 17.0 | 40.1 | 5.4 |
| Meta-Harness (Error-Annotated) | 9.0 | 87.7 | 24.0 | 40.2 | 22.3 |
| Meta-Harness (CoT Replay) | 13.0 | 88.2 | 25.0 | 42.1 | 23.3 |
| Meta-Harness (Cluster Coverage) | 12.0 | 86.8 | 33.0 | 43.9 | 31.2 |
| Meta-Harness (Cascade Retrieval) | 12.0 | 86.8 | 36.0 | 44.9 | 39.2 |
| Meta-Harness (RRF + Contrastive) | 18.0 | 89.6 | 35.0 | 47.5 | 41.4 |
| Meta-Harness (Relevance + Contrastive) | 18.0 | 90.6 | 36.0 | 48.2 | 43.9 |
| Meta-Harness (Label-Primed Query) | 14.0 | 86.8 | 45.0 | 48.6 | 45.5 |

Table 9：主文本分类搜索中发现的帕累托最优变体，在平均准确率和上下文开销之间进行权衡。正文中选定的系统为 Meta-Harness (Label-Primed Query)。Ctx 表示输入上下文中额外字符的平均数量（单位：千字符）。

![Refer to caption](https://arxiv.org/html/2603.28052v1/figures/val_vs_test_by_dataset.png)

Figure 7：各数据集上搜索集与测试集准确率的对比。每个粉色点代表一个发现的策略；基线（Baseline）已标注。虚线对角线为 y=x。

### B.2 数学检索 Harness

本小节描述 Meta-Harness 为数学推理（第 4.2 节）发现的检索 Harness。最终的 Harness 是一个紧凑的四路由 BM25 程序，其结构通过搜索涌现而非事后手动指定。以下所有设计选择——路由谓词、重排序项、去重阈值和每条路由的示例数量——均由外循环在 40 轮进化迭代中选定。

#### 概述

在推理时，该 Harness 将每个问题精确分配到四条路由之一：组合数学、几何、数论，或用于代数及其他问题的默认路由。路由门（gates）实现为对问题陈述的轻量级词法谓词（lexical predicates），包括关键词集合和少量用于几何符号的正则表达式特征。该 Harness 不跨路由聚合输出：一旦选定某条路由，仅该路由为最终提示检索示例。所有路由均使用 BM25 作为底层检索机制，检索范围为上述经过筛选的语料库。BM25 索引使用数学感知的分词器（math-aware tokenizer），将 LaTeX token（如 \\frac, ˆ{2}）作为原子单元保留。选定的 Harness 是两条成功搜索谱系的合并，由提议器（Proposer）在搜索过程中自主组合：一条贡献了基于原始 BM25 的更强几何路由，另一条贡献了基于去重和难度重排序的更强组合数学路由。Figure 8 给出了最终程序的紧凑流程图。


Figure 8：发现的数学检索 Harness。词法路由器将每个查询分配到四个学科专属检索策略之一。选定的策略检索示例，并将其插入最终提示中。

- 组合数学：获取 20 个 BM25 候选项，去重至 8 个，按词法分数和难度重排序，然后返回前 3 个。这是 Harness 显式权衡多样性与高难度问题匹配的主要路由。
- 几何：返回 1 个高难度 NuminaMath 参考题和 2 个原始 BM25 近邻。搜索过程中一致地偏好原始结构匹配而非难度重排序。
- 数论：获取 12 个 BM25 候选项，使用词法分数、难度和对在解答开头就陈述解题技巧的解答给予小额加分进行重排序。这有利于选取证明策略明确的示例。
- 默认：获取 10 个 BM25 候选项，按词法分数和难度重排序，并根据检索分数的集中程度自适应地选择示例数量。

### B.3 TerminalBench-2 Harness

发现的 TerminalBench-2 Harness 基于 Terminus-KIRA [^24] 构建，继承了其原生工具调用（取代 Terminus 2 基于 ICL 的 JSON 解析）、30KB 输出上限和多视角完成检查清单。Meta-Harness 发现的主要修改是环境引导（environment bootstrapping）：在智能体循环开始之前，Harness 运行一条复合 shell 命令来收集沙箱环境的快照，并将其注入初始提示中。提议器的假设——逐字记录自搜索日志——如下：

> Hypothesis: ''Injecting an environment snapshot (OS, installed languages, package managers, /app contents) before the first LLM turn will reduce wasted exploration episodes by 3--5 turns on dependency-heavy tasks'' Changes: ''Added _gather_env_snapshot() that runs a single compound shell command to collect working directory, /app listing, available languages (python, gcc, node, java, rustc, go), package managers (pip, apt) […] and injects as [Environment Snapshot] block''

该快照包含：工作目录、/app 的文件列表（大目录截断为 20 个条目）、可用的编程语言及其版本（Python、GCC、G++、Node、Java、Rust、Go）、已安装的包管理器（pip、apt-get），以及可用内存。这消除了智能体通常需要花费 2-4 轮探索性回合来发现可用工具和文件的过程，使模型能够立即开始有效工作。引导命令受 15 秒超时保护且静默失败，因此不会在异常环境中导致智能体崩溃。完整实现在 Terminus-KIRA 基础上增加了约 80 行代码。Figure 9 总结了 Harness 的结构。

#### 逐任务分析

与 Terminus-KIRA 相比，发现的 Harness 在 89 个任务中的 7 个上取得了提升，最大的改进出现在 protein-assembly 和 path-tracing 任务上。取得提升的任务有一个共同特征：它们需要特定领域的工具链，而这些工具链的可用性无法提前假定（生物信息学库、渲染管线、国际象棋引擎、密码学工具、CoreWars 模拟器）。没有引导机制时，智能体会在前 2-4 轮探测环境；在回合预算紧张或早期错误假设会产生级联效应的任务上，这些浪费的回合可能就是通过与失败之间的差距。这表明引导机制在环境不明显、且任务要求智能体根据实际安装的工具匹配策略时价值最大。


Figure 9：发现的 TerminalBench-2 Harness。该 Harness 继承了 Terminus-KIRA 的原生工具调用、输出上限和完成检查清单（绿色部分）。环境引导（红色部分）是 Meta-Harness 发现的组件：它在智能体循环开始前收集沙箱快照，消除了早期探索性回合。

## 附录 C 数据集详情

### C.1 分布外文本分类数据集

- SciCite 是由 [^13] 提出的 3 分类引用意图分类基准测试。每个样本由科学论文中的引用上下文组成，按引用的修辞功能进行标注，如背景、方法或结果。该任务测试模型能否从局部科学上下文中推断一篇论文引用另一篇论文的原因。
- FiNER-139 是由 [^28] 提出的金融数字实体识别基准测试。它由金融文件中的词级标注组成，包含 139 种细粒度 XBRL 实体类型，使其比标准的句子级分类任务具有更高的细粒度。该基准测试测试模型能否从上下文中识别和分类金融数字实体。
- Amazon Reviews 是由 [^21] 提出的多语言 Amazon 评论语料库的英语部分。在我们的设置中，它被用作 5 分类评分预测任务，标签对应评论的星级评分。该基准测试评估从产品评论文本进行通用领域情感和评分预测的能力。
- Financial PhraseBank 是由 [^31] 提出的 3 分类金融情感基准测试。它由金融新闻和相关经济文本中的句子组成，按市场情感标注为正面、中性或负面。该任务评估金融领域的特定领域情感分类能力。
- GoEmotions 是由 [^14] 提出的细粒度情绪分类基准测试。它包含以 27 个情绪类别加一个中性类别标注的英语 Reddit 评论，通常被视为 28 分类任务。该基准测试测试超越粗粒度正面-负面情感的细腻情感识别能力。
- Banking77 是由 [^10] 提出的细粒度意图分类基准测试。它包含标注有 77 种意图的在线银行用户话语，涵盖广泛的客户服务请求。该任务评估具有大标签空间的单领域意图检测能力。
- AG News 是通常与 [^59] 的文本分类设置相关联的 4 分类新闻主题分类基准测试。样本以世界、体育、商业和科技等宽泛新闻类别标注。它是主题分类的标准通用领域基准测试。
- SciTail 是一个科学领域的文本蕴含基准测试，其任务是在科学推理场景中预测前提句是否蕴含假设句 [^23]。
- TweetEval (Hate) 是由 [^6] 提出的 TweetEval 基准测试中的仇恨言论子集。它是一个二分类推文分类任务，用于在统一的社交媒体评估套件中检测仇恨与非仇恨内容。该基准测试测试在嘈杂的短文本社交媒体中进行稳健分类的能力。

### C.2 数学检索语料库

Table 10 列出了第 4.2 节中使用的检索语料库所包含的数据集。原始数据源包含的问题数量多于最终语料库；在合并前进行了若干筛选步骤。NuminaMath-1.5 被筛选至竞赛数学子集（AMC/AIME、奥林匹克参考题、数论、不等式及相关来源），丢弃了质量较低的网络爬取条目。OpenMathReasoning 进行了每题保留一个解答的去重（保留在独立验证器上通过率最高的解答），并在去重前移除了源匹配任何评估基准测试系列（IMO、AIME、HMMT、SMT、USAMO、Putnam）的问题。随后对整个语料库相对于所有评估基准测试和 Harness 搜索中使用的搜索集进行了数据去污染（decontamination），使用精确前缀匹配和模糊 Jaccard 相似度（阈值 0.8）；任何在两种标准下匹配评估问题的语料库问题均被丢弃。OpenMathReasoning 和 DeepMath 的解答被截断至 5,000 个字符以限制检索上下文长度。在运行时，选定的 Harness 进一步将检索限制为解答非空且短于 4,000 个字符的条目。检索到的解答在插入提示时再次被截断至 3,000 个字符。对于几何路由，Harness 还从难度大于 6 的 NuminaMath 问题中构建了一个单独的高难度参考索引。

| 数据集 | 问题数 | 解答长度 | 证明 |
| --- | --- | --- | --- |
| [OpenMathReasoning](https://huggingface.co/datasets/nvidia/OpenMathReasoning) | 281,743 | 5,000 ^†^ | 34% |
| [DeepMath-103K](https://huggingface.co/datasets/zwhe99/DeepMath-103K) | 103,021 | 5,000 ^†^ | 0% |
| [NuminaMath-1.5](https://huggingface.co/datasets/AI-MO/NuminaMath-1.5) | 129,520 | 1,376 | 13% |
| [PolyMath](https://huggingface.co/datasets/AIMO-Corpus/PolyMath) | 11,083 | 363 | 0% |
| [Omni-MATH](https://huggingface.co/datasets/KbsdJames/Omni-MATH) | 4,289 | 829 | 0% |
| [FineProofs-SFT](https://huggingface.co/datasets/SPIderman5/FineProofs-SFT) | 4,275 | 3,977 | 100% |
| [AIME 1983–2024](https://huggingface.co/datasets/gneubig/aime-1983-2024) | 933 | — | 0% |
| [Putnam-AXIOM](https://huggingface.co/datasets/Putnam-AXIOM/putnam-axiom-dataset-v1) | 492 | 888 | 100% |
| 合计 | 535,356 | 5,000 ^†^ | 22% |

^†^ 截断至 5,000 个字符；实际解答更长。

Table 10：数学检索语料库中的数据集（共 535K 个问题）。解答长度为解答的中位数字符长度。证明表示数据集是否包含证明类问题（按答案或问题类型字段判断）。

### C.3 数学 IMO 级别测试集

正文将结果聚合为从 IMO-AnswerBench、IMO-ProofBench、ArXivMath 2025 年 12 月和 ArXivMath 2026 年 1 月中抽取的 200 道 IMO 级别问题。200 道问题的评估集由 IMO-AnswerBench 的 100 道分层子集以及其他三个基准测试的所有问题组成。按基准测试分项汇报是有用的，因为这四个数据集混合了答案型、证明型和研究型问题，在正文中为简洁起见被汇总在一起。如果包含此表，本节应分别报告五个留出模型上 Base 和 Meta-Harness 在各基准测试上的结果。

| 数据集 | 问题数 |
| --- | --- |
| IMO-AnswerBench | 100 |
| IMO-ProofBench | 60 |
| ArXivMath Dec. 2025 | 17 |
| ArXivMath Jan. 2026 | 23 |
| 合计 | 200 |

Table 11：200 道 IMO 级别评估集的分项构成。

## 附录 D 实践实施建议

Meta-Harness 在很大程度上与领域无关：我们预期它适用于任何语言模型被任务专属 Harness 包装的场景。然而，将其应用于新领域需要在一个相对较新的 LLM 辅助编码范式中操作——提议器需要基于长时间跨度的先前运行历史进行条件生成，并编写效果可能在多步之后才显现的程序。在使这一工作流程可靠运行的过程中，我们发现了一小组在本文研究的三个领域中始终重要的实践选择。以下指南本身并非关于该方法的科学论断；它们是构建和运行系统过程中的工程经验，我们希望能帮助未来的工作更容易地将 Meta-Harness 应用于其他领域。

- 编写一个好的技能描述（skill）。技能文本是引导搜索的主要接口，其质量是决定循环能否成功的最强杠杆。提议器接收一段自然语言技能描述 [^3]，定义其角色、目录布局、CLI 命令和输出格式。在实践中，技能描述应约束输出和安全相关行为，而非约束提议器的诊断过程：它应指定哪些行为被禁止、需要产出哪些制品（artifacts）、需要优化哪些目标，同时让模型自由地检查分数、执行轨迹和先前代码。我们从检查 Meta-Harness 运行日志中获得的直觉是，经过足够多的迭代后，累积的执行轨迹对提议器行为的塑造往往超过技能描述本身。根据我们的经验，迭代修改技能文本比改变迭代次数或种群大小对搜索质量的影响更大。建议专门运行几次短进化（每次 3-5 轮迭代）来调试和完善技能描述，然后再执行完整的运行。
- 从基线 Harness 和一个对其而言较难的搜索集开始。编写一个简单的基线（如少样本提示），然后通过筛选基线做错的样本或选择多样化的高难度实例来构建搜索集。如果基线已经使评估饱和，搜索将没有多少可优化的空间。保持搜索集足够小，使每次运行大约可进行 50 次完整评估（在我们的分类实验中为 50-100 个样本，数学检索为 88 个问题）；一个快速且具区分度的评估比一个大规模评估更有价值。
- 以易于浏览的格式记录所有内容。评估代码应以提议器可以可靠查询的形式写入代码、分数和执行轨迹。在实践中，这意味着使用机器可读格式如 JSON，按层次结构组织制品，选择合理且一致的文件名，以及采用使正则表达式搜索等简单工具能良好工作的命名方案。
- 通过小型 CLI 使日志可查询（可选但有帮助）。每个 Harness 有一个包含源代码、分数和执行轨迹的目录，但随着历史记录的增长，仅靠原始文件系统访问会变得繁琐。一个能列出帕累托前沿、显示 top-k Harness、以及对比两次运行之间的代码和结果差异的短 CLI 可以使经验存储更易于使用，而且查询此类 CLI 与编码智能体训练时的工作流程高度一致。如果存在相关的离线经验（来自其他模型的 Rollout、已解决的问题语料库、相关论文），将其转换为相同的目录结构也可以帮助热启动探索和锚定新思路。这一层帮助提议器节省可能在导航上浪费的 token。
- 在昂贵的基准测试之前进行轻量验证。编写一个小型验证测试，导入模块、实例化类，并在一小组样本上调用两个方法。搜索过程中提出的 Harness 应先通过此测试再进行完整评估。一个简单的测试脚本可以在几秒内捕获大多数格式错误或无法运行的候选方案，并将失败的代价保持在接近零的水平。
- 将评估自动化，放在提议器之外。运行评估足够简单，不值得让提议器来执行。应由单独的 Harness 对候选方案评分并将结果写入文件系统。

## 附录 E 扩展相关工作

本附录扩展了第 2 节中的简要讨论，并将 Meta-Harness 与若干相邻研究方向进行了定位，这些方向在正文中无法详细涵盖。一个反复出现的区分是：Meta-Harness 优化的是可执行的 Harness 实现，并通过文件系统为提议器提供对先前代码、分数和执行轨迹的选择性访问。

#### AlphaEvolve / OpenEvolve

AlphaEvolve [^34] 和 OpenEvolve [^42] 通过 LLM 引导的变异和结构化反馈来进化代码：提议器接收一个包含标量分数的程序数据库（每步 4-22K token；Table 1），并对锦标赛选择的父代应用固定的变异策略。这些方法专为算法发现和优化而设计（数学猜想、调度启发式、硬件内核），搜索目标是具有清晰标量目标的单一无状态函数，变异是局部的。Harness Engineering 是一个不同的范式：Harness 是跨多个样本累积经验的有状态程序，单个设计选择（如在记忆中存储什么）可以级联影响整个评估序列。Meta-Harness 通过给予非结构化编码智能体完整的文件系统访问权限来解决这一问题，使其能选择性地读取任何先前候选方案的源代码、执行轨迹和分数。

#### GEPA

GEPA [^1] 在反馈丰富度方面是最接近的文本优化器（text optimizer），为每个候选方案提供 Rollout 轨迹。它专为具有短反馈循环的提示优化任务设计（数学问题、指令遵循、代码优化），其中每次 Rollout 是单次 LLM 调用或短流水线。在这一范式中，逐候选反思效果良好：一个提示、一个答案、一个分数。Harness Engineering 需要同时跨多个样本和多个候选方案进行推理：理解为什么某个检索策略在一类问题上有效但在另一类问题上退化，需要跨整个种群比较执行轨迹。GEPA 每次操作一个候选方案（每步 2-8K token；Table 1），使用必须预先预测哪些信息相关的固定批评格式。Meta-Harness 让提议器同时访问所有先前候选方案，并让智能体自行决定检查什么。

#### 提示编排框架

若干系统为组合多阶段 LLM 程序提供了结构化抽象。LMQL [^7]、LangChain [^12] 和 DSPy [^22] 通过为提示模板、控制流和模块化 LLM 流水线提供更高层次的接口，使提示工程更加系统化。这些框架帮助开发者指定和组织 LLM 程序，但它们通常仍需要手动设计检索策略、记忆更新和编排逻辑。Meta-Harness 在不同的层次上运作：它在可执行代码中搜索这些策略的*实现*，将 Harness 本身作为优化目标。

[^1]: L. A. Agrawal, S. Tan, D. Soylu, N. Ziems, R. Khare, K. Opsahl-Ong, A. Singhvi, H. Shandilya, M. J. Ryan, M. Jiang, et al. (2025) Gepa: reflective prompt evolution can outperform reinforcement learning. arXiv preprint arXiv:2507.19457. Cited by: Appendix E, Table 1, §1, §2, Table 4.

[^2]: M. Andrychowicz, M. Denil, S. Gomez, M. W. Hoffman, D. Pfau, T. Schaul, B. Shillingford, and N. De Freitas (2016) Learning to learn by gradient descent by gradient descent. Advances in neural information processing systems 29. Cited by: §2.

[^3]: Anthropic and community contributors Agentskills/agentskills. Note: GitHub repository [https://github.com/agentskills/agentskills](https://github.com/agentskills/agentskills) Specification and documentation for Agent Skills, accessed March 27, 2026 Cited by: 1st item.

[^4]: Anthropic (2025) Claude code: an agentic coding tool. Note: [https://www.anthropic.com/claude-code](https://www.anthropic.com/claude-code) Cited by: §3.

[^5]: M. Balunović, J. Dekoninck, I. Petrov, N. Jovanović, and M. Vechev (2025-02) MathArena: evaluating llms on uncontaminated math competitions. SRI Lab, ETH Zurich. External Links: [Link](https://matharena.ai/) Cited by: §4.2, §4.2.

[^6]: F. Barbieri, J. Camacho-Collados, L. Neves, and L. Espinosa-Anke (2020) TweetEval: unified benchmark and comparative evaluation for tweet classification. External Links: 2010.12421, [Link](https://arxiv.org/abs/2010.12421) Cited by: 9th item.

[^7]: L. Beurer-Kellner, M. Fischer, and M. Vechev (2023-06) Prompting is programming: a query language for large language models. Proceedings of the ACM on Programming Languages 7 (PLDI), pp. 1946–1969. External Links: ISSN 2475-1421, [Link](http://dx.doi.org/10.1145/3591300), [Document](https://dx.doi.org/10.1145/3591300) Cited by: Appendix E.

[^8]: B. Böckeler (2026-03) Harness engineering. Note: [https://martinfowler.com/articles/exploring-gen-ai/harness-engineering.html](https://martinfowler.com/articles/exploring-gen-ai/harness-engineering.html) martinfowler.com Cited by: §1.

[^9]: C. Bölük (2026-02) I improved 15 LLMs at coding in one afternoon. only the harness changed.. Note: [https://blog.can.ac/2026/02/12/the-harness-problem/](https://blog.can.ac/2026/02/12/the-harness-problem/) Cited by: §1.

[^10]: I. Casanueva, T. Temčinas, D. Gerz, M. Henderson, and I. Vulić (2020) Efficient intent detection with dual sentence encoders. External Links: 2003.04807, [Link](https://arxiv.org/abs/2003.04807) Cited by: 6th item.

[^11]: M. Cemri, S. Agrawal, A. Gupta, S. Liu, A. Cheng, Q. Mang, A. Naren, L. E. Erdogan, K. Sen, M. Zaharia, et al. (2026) AdaEvolve: adaptive llm driven zeroth-order optimization. arXiv preprint arXiv:2602.20133. Cited by: §1.

[^12]: LangChain Note: Software, released 2022-10-17 External Links: [Link](https://github.com/langchain-ai/langchain) Cited by: Appendix E.

[^13]: A. Cohan, W. Ammar, M. van Zuylen, and F. Cady (2019) Structural scaffolds for citation intent classification in scientific publications. External Links: 1904.01608, [Link](https://arxiv.org/abs/1904.01608) Cited by: 1st item.

[^14]: D. Demszky, D. Movshovitz-Attias, J. Ko, A. Cowen, G. Nemade, and S. Ravi (2020) GoEmotions: a dataset of fine-grained emotions. External Links: 2005.00547, [Link](https://arxiv.org/abs/2005.00547) Cited by: 5th item.

[^15]: Z. Fei, X. Shen, D. Zhu, F. Zhou, Z. Han, A. Huang, S. Zhang, K. Chen, Z. Yin, Z. Shen, et al. (2024) Lawbench: benchmarking legal knowledge of large language models. In Proceedings of the 2024 conference on empirical methods in natural language processing, pp. 7933–7962. Cited by: §4.1.

[^16]: C. Finn, P. Abbeel, and S. Levine (2017) Model-agnostic meta-learning for fast adaptation of deep networks. In International Conference on Machine Learning, Cited by: §2.

[^17]: ForgeCode (2025) Benchmarks don't matter. External Links: [Link](https://forgecode.dev/blog/benchmarks-dont-matter/) Cited by: §4.3.

[^18]: Gretel AI (2023) Symptom to diagnosis dataset. Note: [https://huggingface.co/datasets/gretelai/symptom/_to/_diagnosis](https://huggingface.co/datasets/gretelai/symptom_to_diagnosis) Accessed: 2026-01-22 Cited by: §4.1.

[^19]: S. Hu, C. Lu, and J. Clune (2025) Automated design of agentic systems. In The Thirteenth International Conference on Learning Representations, External Links: [Link](https://openreview.net/forum?id=t9U3LW7JVX) Cited by: §2.

[^20]: A. Justin Young (2025-11) Effective harnesses for long-running agents. Note: [https://anthropic.com/engineering/effective-harnesses-for-long-running-agents](https://anthropic.com/engineering/effective-harnesses-for-long-running-agents) Anthropic Engineering Blog Cited by: §1.

[^21]: P. Keung, Y. Lu, G. Szarvas, and N. A. Smith (2020) The multilingual amazon reviews corpus. External Links: 2010.02573, [Link](https://arxiv.org/abs/2010.02573) Cited by: 3rd item.

[^22]: O. Khattab, A. Singhvi, P. Maheshwari, Z. Zhang, K. Santhanam, S. Vardhamanan, S. Haq, A. Sharma, T. T. Joshi, H. Moazam, H. Miller, M. Zaharia, and C. Potts (2023) DSPy: compiling declarative language model calls into self-improving pipelines. External Links: 2310.03714, [Link](https://arxiv.org/abs/2310.03714) Cited by: Appendix E.

[^23]: T. Khot, A. Sabharwal, and P. Clark (2018-Apr.) SciTaiL: a textual entailment dataset from science question answering. Proceedings of the AAAI Conference on Artificial Intelligence 32 (1). External Links: [Link](https://ojs.aaai.org/index.php/AAAI/article/view/12022), [Document](https://dx.doi.org/10.1609/aaai.v32i1.12022) Cited by: 8th item.

[^24]: KRAFTON AI and Ludo Robotics (2026) Terminus-kira: boosting frontier model performance on terminal-bench with minimal harness. External Links: [Link](https://github.com/krafton-ai/kira) Cited by: §B.3, §4.3.

[^25]: Y. Lee, J. Boen, and C. Finn (2025) Feedback descent: open-ended text optimization via pairwise comparison. In arXiv preprint arXiv:2511.07919, Cited by: Table 1, §1, §2.

[^26]: J. Lehman, J. Gordon, S. Jain, K. Ndousse, C. Yeh, and K. O. Stanley (2022) Evolution through large models. External Links: 2206.08896, [Link](https://arxiv.org/abs/2206.08896) Cited by: §2.

[^27]: P. Lewis, E. Perez, A. Piktus, F. Petroni, V. Karpukhin, N. Goyal, H. Küttler, M. Lewis, W. Yih, T. Rocktäschel, et al. (2020) Retrieval-augmented generation for knowledge-intensive nlp tasks. Advances in neural information processing systems 33, pp. 9459–9474. Cited by: §1, §2.

[^28]: L. Loukas, M. Fergadiotis, I. Chalkidis, E. Spyropoulou, P. Malakasiotis, I. Androutsopoulos, and G. Paliouras (2022) FiNER: financial numeric entity recognition for xbrl tagging. In Proceedings of the 60th Annual Meeting of the Association for Computational Linguistics (Volume 1: Long Papers), pp. 4419–4431. External Links: [Link](http://dx.doi.org/10.18653/v1/2022.acl-long.303), [Document](https://dx.doi.org/10.18653/v1/2022.acl-long.303) Cited by: 2nd item.

[^29]: T. Luong, D. Hwang, H. H. Nguyen, G. Ghiasi, Y. Chervonyi, I. Seo, J. Kim, G. Bingham, J. Lee, S. Mishra, A. Zhai, C. H. Hu, H. Michalewski, J. Kim, J. Ahn, J. Bae, X. Song, T. H. Trinh, Q. V. Le, and J. Jung (2025) Towards robust mathematical reasoning. In Proceedings of the 2025 Conference on Empirical Methods in Natural Language Processing, External Links: [Link](https://aclanthology.org/2025.emnlp-main.1794/) Cited by: §4.2.

[^30]: A. Madaan, N. Tandon, P. Gupta, S. Hallinan, L. Gao, S. Wiegreffe, U. Alon, N. Dziri, S. Prabhumoye, Y. Yang, et al. (2023) Self-refine: iterative refinement with self-feedback. Advances in neural information processing systems 36, pp. 46534–46594. Cited by: §1, §2.

[^31]: P. Malo, A. Sinha, P. Takala, P. Korhonen, and J. Wallenius (2013) Good debt or bad debt: detecting semantic orientations in economic texts. External Links: 1307.5336, [Link](https://arxiv.org/abs/1307.5336) Cited by: 4th item.

[^32]: M. A. Merrill, A. G. Shaw, N. Carlini, B. Li, H. Raj, I. Bercovich, L. Shi, J. Y. Shin, T. Walshe, E. K. Buchanan, et al. (2026) Terminal-bench: benchmarking agents on hard, realistic tasks in command line interfaces. arXiv preprint arXiv:2601.11868. Cited by: §4.3.

[^33]: J. Nichols (2025-06) How we scored #1 on terminal-bench (52%). External Links: [Link](https://www.warp.dev/blog/terminal-bench) Cited by: §4.3.

[^34]: A. Novikov, N. Vũ, M. Eisenberger, E. Dupont, P. Huang, A. Z. Wagner, S. Shirobokov, B. Kozlovskii, F. J. Ruiz, A. Mehrabian, et al. (2025) Alphaevolve: a coding agent for scientific and algorithmic discovery. arXiv preprint arXiv:2506.13131. Cited by: Appendix E, Table 1, §1, §2.

[^35]: OpenAI (2026-02) Harness engineering: leveraging Codex in an agent-first world. Note: [https://openai.com/index/harness-engineering/](https://openai.com/index/harness-engineering/) OpenAI Blog Cited by: §1.

[^36]: C. Packer, V. Fang, S. Patil, K. Lin, S. Wooders, and J. Gonzalez (2023) MemGPT: towards llms as operating systems.. Cited by: §1, §2.

[^37]: R. Pryzant, D. Iter, J. Li, Y. T. Lee, C. Zhu, and M. Zeng (2023) Automatic prompt optimization with "gradient descent" and beam search. arXiv preprint arXiv:2305.03495. Cited by: §1, §2.

[^38]: B. Romera-Paredes, M. Barekatain, A. Novikov, M. Balog, M. P. Kumar, E. Dupont, F. J. Ruiz, J. S. Ellenberg, P. Wang, O. Fawzi, et al. (2024) Mathematical discoveries from program search with large language models. Nature 625 (7995), pp. 468–475. Cited by: §1, §2.

[^39]: J. Schmidhuber (1993) A neural network that embeds its own meta-levels. In IEEE International Conference on Neural Networks, Cited by: §2.

[^40]: N. Schneider, N. Stiefl, and G. A. Landrum (2016) What's what: the (nearly) definitive guide to reaction role assignment. Journal of chemical information and modeling 56 (12), pp. 2336–2346. Cited by: §4.1.

[^41]: S. Shakya, A. Hartl, S. Hochreiter, and K. Pöppel (2026) Adaptive retrieval helps reasoning in llms – but mostly if it's not used. External Links: 2602.07213, [Link](https://arxiv.org/abs/2602.07213) Cited by: §4.2.

[^42]: A. Sharma (2025) OpenEvolve: an open-source evolutionary coding agent. Note: [https://github.com/algorithmicsuperintelligence/openevolve](https://github.com/algorithmicsuperintelligence/openevolve) GitHub repository External Links: [Link](https://github.com/algorithmicsuperintelligence/openevolve) Cited by: Appendix E, §2, 2nd item, Table 4.

[^43]: J. Snell, K. Swersky, and R. S. Zemel (2017) Prototypical networks for few-shot learning. In Advances in Neural Information Processing Systems, Cited by: §2.

[^44]: R. Sutton (2019) The bitter lesson, 2019. URL http://www./ incompleteideas. net/IncIdeas/BitterLesson. html. Cited by: §5.

[^45]: S. Thrun and L. Pratt (1998) Learning to learn: introduction and overview. In Learning to learn, pp. 3–17. Cited by: §2.

[^46]: M. Tian, Z. Wang, B. Yang, Z. Tang, K. Zhu, H. Dong, H. Li, X. Xie, G. Wang, and J. You (2026) SWE-bench mobile: can large language model agents develop industry-level mobile applications?. In arXiv preprint, External Links: [Link](https://api.semanticscholar.org/CorpusID:285462974) Cited by: §1.

[^47]: H. Trivedi, N. Balasubramanian, T. Khot, and A. Sabharwal (2023) Interleaving retrieval with chain-of-thought reasoning for knowledge-intensive multi-step questions. External Links: 2212.10509, [Link](https://arxiv.org/abs/2212.10509) Cited by: §1, §2.

[^48]: C. Xiao, G. T. Hudson, and N. A. Moubayed (2024) RAR-b: reasoning as retrieval benchmark. External Links: 2404.06347, [Link](https://arxiv.org/abs/2404.06347) Cited by: §4.2.

[^49]: Y. Xiong, S. Hu, and J. Clune (2026) Learning to continually learn via meta-learning agentic memory designs. In OpenReview, External Links: [Link](https://api.semanticscholar.org/CorpusID:285454009) Cited by: §2.

[^50]: C. Yang, X. Wang, Y. Lu, H. Liu, Q. V. Le, D. Zhou, and X. Chen (2023) Large language models as optimizers. In The Twelfth International Conference on Learning Representations, Cited by: Table 1, §1, §2.

[^51]: H. Ye, X. He, V. Arak, H. Dong, and G. Song (2026) Meta context engineering via agentic skill evolution. arXiv preprint arXiv:2601.21557. Cited by: Table 2, §4.1, §4.1, Table 2.

[^52]: M. Yuksekgonul, F. Bianchi, J. Boen, S. Liu, Z. Huang, C. Guestrin, and J. Zou (2024) TextGrad: automatic "differentiation" via text. External Links: 2406.07496, [Link](https://arxiv.org/abs/2406.07496) Cited by: Table 1, §1, §2.

[^53]: M. Yuksekgonul, D. Koceja, X. Li, F. Bianchi, J. McCaleb, X. Wang, J. Kautz, Y. Choi, J. Zou, C. Guestrin, et al. (2026) Learning to discover at test time. arXiv preprint arXiv:2601.16175. Cited by: 3rd item, Table 4.

[^54]: M. Yuksekgonul, D. Koceja, X. Li, F. Bianchi, J. McCaleb, X. Wang, J. Kautz, Y. Choi, J. Zou, C. Guestrin, and Y. Sun (2026) Learning to discover at test time. External Links: 2601.16175, [Link](https://arxiv.org/abs/2601.16175) Cited by: Table 1, §4.3.

[^55]: A. L. Zhang, T. Kraska, and O. Khattab (2026) Recursive language models. External Links: 2512.24601, [Link](https://arxiv.org/abs/2512.24601) Cited by: §1, §2.

[^56]: G. Zhang, H. Ren, C. Zhan, Z. Zhou, J. Wang, H. Zhu, W. Zhou, and S. Yan (2025) Memevolve: meta-evolution of agent memory systems. arXiv preprint arXiv:2512.18746. Cited by: §2.

[^57]: J. Zhang, J. Xiang, Z. Yu, F. Teng, X. Chen, J. Chen, M. Zhuge, X. Cheng, S. Hong, J. Wang, B. Zheng, B. Liu, Y. Luo, and C. Wu (2025) AFlow: automating agentic workflow generation. External Links: 2410.10762, [Link](https://arxiv.org/abs/2410.10762) Cited by: §2.

[^58]: Q. Zhang, C. Hu, S. Upasani, B. Ma, F. Hong, V. Kamanuru, J. Rainton, C. Wu, M. Ji, H. Li, U. Thakker, J. Zou, and K. Olukotun (2025) Agentic context engineering: evolving contexts for self-improving language models. In arXiv preprint arXiv:2510.04618, Cited by: §1, Table 2, §4.1, §4.1, Table 5.

[^59]: X. Zhang, J. Zhao, and Y. LeCun (2016) Character-level convolutional networks for text classification. External Links: 1509.01626, [Link](https://arxiv.org/abs/1509.01626) Cited by: 7th item.
