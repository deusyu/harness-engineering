---
sourceTitle: "Agentic Harness Engineering: Observability-Driven Automatic Evolution of Coding-Agent Harnesses"
sourceUrl: "https://arxiv.org/html/2604.25850v4"
sourceAuthor: "Jiahang Lin, Shichun Liu, Chengjun Pan, Lizhi Lin, Shihan Dou, Zhiheng Xi, Xuanjing Huang, Hang Yan, Zhenhua Han, Tao Gui, Yu-Gang Jiang"
sourcePublishedAt: "2026-05-18"
title: "Agentic Harness Engineering：可观测性驱动的编码智能体 Harness 自动演化"
summary: "本文提出 Agentic Harness Engineering（AHE）：一种让编码智能体在固定基础模型下，通过组件、经验和决策三类可观测性来自动演化 Harness 的闭环。AHE 将可编辑组件文件化，把轨迹压缩为可下钻证据，并让每次编辑附带可证伪预测；在 Terminal-Bench 2 上将 pass@1 从 69.7% 提升到 77.0%，并在 SWE-bench-verified 与跨模型迁移中保持收益。"
language: "zh-CN"
translationMethod: "baoyu-translate skill"
sourceFigureCount: 10
---

# Agentic Harness Engineering：可观测性驱动的编码智能体 Harness 自动演化

Jiahang Lin <sup>1</sup> <sup>∗‡</sup>, Shichun Liu <sup>1</sup> <sup>∗‡</sup>, Chengjun Pan <sup>2</sup> <sup>∗‡</sup>, Lizhi Lin <sup>3</sup>, Shihan Dou <sup>1</sup>, Zhiheng Xi <sup>1</sup>, Xuanjing Huang <sup>1</sup>, Hang Yan <sup>3</sup>, Zhenhua Han <sup>3</sup> <sup>†</sup>, Tao Gui <sup>1</sup> <sup>†</sup>, Yu-Gang Jiang <sup>1</sup>

<sup>1</sup> 复旦大学   <sup>2</sup> 北京大学   <sup>3</sup> 上海奇绩智锋有限公司  
[china-qijizhifeng/agentic-harness-engineering](https://github.com/china-qijizhifeng/agentic-harness-engineering)

###### 摘要

Harness 现在已经成为智能体性能的核心：它调节模型如何与工具和执行环境交互。然而，Harness Engineering 仍然主要是一门手工技艺，因为要自动化它会同时遇到三个难点：可编辑组件之间的动作空间异构；海量轨迹会掩埋真正可行动的信号；一次编辑造成的效果也难以归因。本文提出 Agentic Harness Engineering（AHE），这是一个闭环，通过三类相互匹配的可观测性支柱解决这些问题：❶ *组件可观测性* 为每个可编辑 Harness 组件提供文件级表示，使动作空间显式且可回滚；❷ *经验可观测性* 将数百万个原始轨迹 token 提炼成分层、可下钻的证据语料库，使演化智能体真的能够消费这些经验；❸ *决策可观测性* 把每次编辑与自我声明的预测配对，并在下一轮任务级结果中验证。三者合在一起，把每次编辑都变成一个可证伪契约，使 Harness 演化能够自主推进，而不会退化为盲目试错。实验上，十轮 AHE 迭代将 Terminal-Bench 2 上的 pass@1 从 69.7% 提升到 77.0%，超过人工设计的 Harness Codex（71.9%）以及自演化基线 ACE 和 Training-Free GRPO。冻结后的 Harness 无需重新演化也能迁移：在 SWE-bench-verified 上，它以比种子版本少 $12\%$ 的 token 达到最高总体成功率；在 Terminal-Bench 2 上，它让三个替代模型家族获得 $+5.1$ 到 $+10.1$ pp 的跨家族增益，说明演化出的组件编码的是通用工程经验，而不是针对单个基准的调参。消融进一步把收益定位到工具、中间件和长期记忆，而不是系统提示词。这些结果说明，可观测性驱动的演化，是让编码智能体 Harness 随基础模型一起持续改进的一条实用路径。

[![AHE 将 bash 种子 Harness 演化到超过人工设计和自演化基线](https://arxiv.org/html/2604.25850v4/x1.png)](https://arxiv.org/html/2604.25850v4/x1.png)

Figure 1：AHE 将一个只有 bash 的种子 Harness 演化到超过 Terminal-Bench 2 上所有人工设计和自演化基线。三个角色智能体共享同一个基础模型，因此收益可以归因于 Harness 编辑，而不是分析器或编辑器能力差异。

## 1 引言

编码智能体越来越多地被部署到长程软件工程任务中，在真实代码仓库的问题修复 [^14] [^46] [^7] 和多步终端工作流 [^21] 上都取得了可测量进展。实践中，这类进展不仅依赖底层语言模型，也同样依赖模型周围的工程组件：塑造工作方式的系统提示词、暴露文件系统和 shell 的工具，以及控制上下文、执行和恢复的中间件。这组模型外部、可编辑的组件，统称为智能体的 *Harness* [^30] [^18] [^42] [^45] [^33] [^31]。

在长程编码基准上，即便保持基础模型不变，Harness 设计也会实质性改变任务完成率 [^40] [^42]，因此 Harness Engineering 应该被视为提升编码智能体的一等杠杆。此外，最优 Harness 往往是模型特定的：为一个基础模型调好的 Harness，换到另一个模型上常常表现变差，并且基础模型变化后也需要重新适配。当前这种适配主要靠人工完成：开发者检查轨迹，识别反复出现的失败模式，然后在提示词、工具、中间件和 Skills 之间手工编辑。随着基础模型快速进步 [^39] [^38] [^44] [^6] [^36] [^35]，这条手工循环越来越难跟上，模型能力与释放这些能力所需 Harness 之间的差距也在扩大 [^33]。

直觉上，可以用一个演化智能体根据经验来优化 Harness 组件，从而自动化这条循环 [^1] [^49] [^4]。但已有方法很少共同演化完整的可编辑组件集合 [^16]；多数只关注一个组件，通常是提示词 [^32] [^50] [^20]、Skills [^19] [^43] 或上下文内 playbook [^49]。端到端共同演化多个组件会遇到两个结构性障碍：长而无结构的轨迹几乎不给出可行动信号；紧耦合的 Harness 框架又让提示词之外的编辑容易出错。因此，智能体驱动 Harness 演化的核心问题仍然开放：一个演化智能体怎样才能联合且稳定地演化编码智能体 Harness 的所有可编辑组件？

我们的核心洞察是，这个问题的瓶颈不在智能体能力，而在*可观测性*：只要演化智能体拿到关于清晰动作空间的结构化上下文，它就能可靠地收敛到更好的 Harness 设计 [^34] [^53]。我们在 Agentic Harness Engineering（AHE，Figure 2）中实现这一点。AHE 是一个由三类可观测性支柱驱动的闭环：❶ 通过解耦 Harness 将七类可编辑组件暴露为文件，实现*组件可观测性*，让每类失败模式都能清楚映射到单一组件类别；❷ 通过从数百万原始轨迹 token 中提炼分层、可下钻的证据语料库，实现*经验可观测性*，让演化器消费结构化根因，而不是原始日志；❸ 通过变更 manifest 将每次编辑与自我声明的预测配对，并在下一轮任务级结果中验证，实现*决策可观测性*，让每次编辑成为可证伪契约，低效编辑则按文件粒度回滚。

我们在 Terminal-Bench 2 [^21] 上验证 AHE：十轮迭代将 pass@1 从 69.7% 提升到 77.0%，超过人工设计的 Codex [^25] 以及自演化基线 ACE [^49] 和 Training-Free GRPO [^4]。无需进一步演化，冻结后的 Harness 可迁移到 SWE-bench-verified [^14]；跨三个替代基础模型家族也带来 $+5.1$ 到 $+10.1$ pp 的稳定 pass@1 增益，且越远离饱和的基础模型收益越大。这说明 AHE 编码的是低饱和模型更依赖的协作模式。组件消融进一步显示收益的位置：工具、中间件和长期记忆各自都能单独承载改进，而单独替换系统提示词反而回退，表明事实性的 Harness 结构能跨任务与模型迁移，纯文本策略则不能。

本文贡献如下：

- 我们形式化了编码智能体的*智能体驱动 Harness 演化*问题，并提出 AHE。AHE 将组件、轨迹和决策层面的可观测性确定为设计枢纽，通过解耦组件底座、分层轨迹蒸馏流水线，以及由下一轮任务差值验证自我预测的变更 manifest，把每次 Harness 编辑变成文件级、可证伪的契约。
- 我们实证表明，AHE 将 Terminal-Bench 2 上的 pass@1 从 69.7% 提升到 77.0%，超过人工设计与自动化基线，并产生一个可跨基准和基础模型家族迁移的冻结 Harness。
- 我们的分析揭示了智能体驱动演化的两个限制：Harness 组件之间存在非加性交互，因此堆叠有效编辑会限制总收益；循环的自归因对修复较可靠，但对回归近乎失明，因此回归预见能力是未来自演化循环最清晰的改进方向。

## 2 相关工作

### 2.1 编码智能体的 Harness Engineering 与评估

Harness Engineering 指设计模型周围系统的实践，包括工具、接口、记忆、执行约束和反馈循环；这些要素共同决定智能体能在长程任务上做什么 [^30] [^18] [^40] [^3] [^33] [^31]。具体来说，Harness 介导模型如何感知并作用于环境：它暴露工具增强推理所需的动作与观察接口 [^3]，提供用于代码仓库导航、文件编辑和命令执行的定制 agent-computer interface [^45]，并提供沙箱执行和编排能力，以保持长程运行可复现 [^42]。

验证这些系统是否真的有帮助，推动了编码智能体评估沿两个轴成熟：任务长度和环境真实性。覆盖面从短程函数级基准（重视污染与新鲜度控制）[^52] [^12]，扩展到代码仓库级可执行补丁修复 [^14] [^46] [^7]，再到多小时、终端驱动、贴近真实执行的长程工作流 [^22] [^5] [^21]。与之平行的基础设施路线围绕这些基准打包可执行运行时和验证器 [^28] [^13] [^47]；它们对可复现、可追踪、可验证执行的关注，直接启发了 AHE 构建的观察系统。

### 2.2 LLM 智能体的自动优化

自动化智能体优化方法的差异，主要在于优化器能观察什么证据、能编辑什么对象。有些方法通过情景式批评和反思修改智能体自身输出 [^20] [^32] [^9]。另一些方法面向提示词和指令 [^15]：结构化 playbook [^49]、语义优势先验 [^4]、多阶段程序的指令-示范联合优化流水线 [^27]，以及由 Pareto 前沿轨迹驱动的反思式更新 [^1]。还有一条路线直接编辑程序结构，例如 Skill 库 [^41]、通过变异演化的打分程序和智能体 archive [^24] [^11]，以及从 rollout 搜索或学习得到的图结构工作流 [^48] [^51]。

AHE 调优的是完整 Harness 这个组合整体，而不是单一可编辑表面，因此优化器可以看见跨组件权衡。它也尽量减少人类先验，让方法论从 rollout 中被优化器发现，而不是由人手固定。下面描述实现这些选择的底座、轨迹分析和迭代流程。

## 3 方法

AHE 将 Harness 优化变成由另一个智能体驱动的闭环，基础模型保持固定，只编辑显式 Harness。我们的设计原则是：这个循环的每个阶段都必须*可观测*。AHE 忠实记录每个阶段产生的制品，包括一次迭代写入的 Harness 组件、生成的 rollout 轨迹、提交的编辑决策，并把它们表示成另一个智能体可以读取和行动的结构化分层形式。

三层可观测性落实这一原则。组件可观测性（§3.1）由一个解耦、文件级的 Harness 底座实现，它把每种失败模式映射到单一组件类别。经验可观测性（§3.2）由从原始 rollout 蒸馏并可下钻索引的分层证据语料库实现。决策可观测性（§3.3）由一个变更 manifest 实现，每次编辑都附带下一轮要验证的自我预测。这三层组合成 Algorithm 1 的迭代，并可无人值守地一轮轮运行。

### 3.1 NexAU：可编辑、解耦的 Harness 底座

[![AHE 流水线连接组件、rollout 经验和编辑决策三个可观测表面](https://arxiv.org/html/2604.25850v4/x2.png)](https://arxiv.org/html/2604.25850v4/x2.png)

Figure 2：AHE 流水线将三个可观测表面连接成一个闭环。组件、rollout 经验和编辑决策都以结构化制品的形式暴露给另一个智能体读取；每次编辑都会成为下一轮验证的可证伪预测。

我们在 NexAU 框架 [^23] [^37] 上实例化 Harness $H$。NexAU 在一个工作区内以固定挂载点暴露七类正交组件：系统提示词、工具描述、工具实现、中间件、Skill、子智能体配置和长期记忆。组件类型之间松耦合，因此添加中间件不需要编辑系统提示词，添加 Skill 也不需要触碰任何工具。

这种解耦实现了组件可观测性：每种失败模式都能映射到单一组件类别，给演化智能体一个清晰动作空间，并把每次 pass-rate 变化定位到一个文件，而不是散落在数百行非结构化提示词中。每次逻辑编辑都会成为工作区 git 历史上的一个提交，自然得到文件级 diff 和回滚粒度。

我们的种子 Harness $H_{0}$ 刻意保持最小：只有一个 shell 执行工具，没有中间件、没有 Skills、没有子智能体。若种子已经贴合目标基准，就会污染后续每次编辑的归因，因为我们无法判断收益来自循环，还是来自种子本身。最小种子迫使 AHE 添加的每个组件都必须在测量 rollout 中证明自己值得存在。

### 3.2 Agent Debugger：分层轨迹证据

对一个基准中的每个任务，我们使用 Harness $H$ 生成 $k$ 条轨迹。轨迹中可能包含由 Harness 缺陷造成、可被行动修复的错误，但这些错误散布在数百万 token 的原始消息中。为从智能体轨迹中提取洞察并实现经验可观测性，我们应用 Agent Debugger [^17] 框架：用一个智能体探索轨迹，把轨迹表示成可导航、基于文件的环境，每条消息都放在自己的文件中，并可通过通用 shell 与脚本工具访问。同一 query 的轨迹放入同一个环境，debugger 需要分析失败根因或成功模式，并为每个任务生成 *per-task analysis* 报告。报告也包括任务的通过/失败状态，为 Evolve Agent 提供 grounding。最后，每个报告被聚合成一个 *benchmark-level overview*，作为每轮迭代的入口。

除了这些报告，我们还提供*原始*轨迹，以便智能体在需要时验证报告中的主张。轨迹以原始形式和轻量清理形式同时提供，去除不必要内容。所有内容都作为文件提供，支持渐进式披露 [^29]，节省 token 并改善智能体决策。

### 3.3 Evolve Agent：证据驱动、可审计的编辑

Evolve Agent 关闭 AHE 循环。每一轮它读取 Agent Debugger 产生的分层证据语料库，决定添加、修改或删除哪些 Harness 组件，对工作区应用编辑，并记录每次编辑背后的推理。两条约束支配这些编辑，也共同实现决策可观测性：每次编辑都成为版本化 manifest 中记录的可证伪、文件级主张；下一轮结论会确认它，或将它回滚。

第一条约束是可控性。Evolve Agent 只能写 Harness 工作区；runs 目录、tracer、verifier 和 LLM 配置都是只读的，种子系统提示词（Appendix B.1）也标记为不可删除。这些限制阻止无约束自修改器可能采取的捷径，例如禁用 verifier、替换模型或提高 reasoning budget，并确保每个记录到的收益都可归因于 Harness 编辑。

第二条约束是每次变更都必须由证据驱动，并附带记录下来的预测。每次编辑都会附加一条 manifest 记录，写明失败证据、推断根因、目标修复，以及预测影响；预测影响同时包含预期修复和存在风险的回归。这个 manifest 是循环的证据账本（见 Appendix B.2）。下一轮循环会把 predicted-fix 和 predicted-regression 集合与观察到的任务级差值相交，得到每次编辑的 verdict。这样，每次编辑都能被下一次评估证伪，用可测量的轮间契约替代理由驱动的自我辩护。

Algorithm 1 AHE 外循环。

seed harness $H_{0}$, base model $M$, benchmark $D$, rollouts per task $k$, max iterations $N$

$H_{\text{best}}\leftarrow H_{0}$

for $t=1$ to $N$ do

  $T_{t}\leftarrow\textsc{Rollout}(M,H_{t-1},D,k)$ $\triangleright$ 阶段 1：每个任务 $k$ 条 rollout

  $\widetilde{T}_{t}\leftarrow\textsc{Clean}(T_{t})$ $\triangleright$ 阶段 2：将轨迹标准化为规范形式

  if $t\geq 2$ then $\triangleright$ 阶段 3：归因上一轮 manifest，然后回滚

   $V_{t}\leftarrow\textsc{Attribute}(C_{t-1},T_{t-1},T_{t})$    $H_{t-1}\leftarrow\textsc{Rollback}(H_{t-1},V_{t})$

  else

   $V_{t}\leftarrow\emptyset$

  end if

  $R_{t}\leftarrow\textsc{AgentDebugger}(\widetilde{T}_{t})$ $\triangleright$ 阶段 4：分层蒸馏

  $(H_{t},C_{t})\leftarrow\textsc{Evolve}(H_{t-1},R_{t},V_{t})$ $\triangleright$ 阶段 5：工作区编辑 + 新 manifest

  $\textsc{Commit}(H_{t},C_{t},t)$ $\triangleright$ 阶段 6：在 git 中标记迭代

  if $\textsc{Pass@1}(T_{t})>\textsc{Pass@1}(H_{\text{best}})$ then $H_{\text{best}}\leftarrow H_{t}$

  end if

end for

return $H_{\text{best}}$

Algorithm 1 将三类底座组合成一次迭代：rollout、清理、归因上一轮 manifest 并回滚被拒绝编辑、蒸馏、编辑、提交。我们对每个任务运行 $k\geq 2$ 条 rollout，使每个任务都有 pass-rate 信号，从而稳定 pass@1，并让部分通过的任务可以锚定比较诊断。归因发生在蒸馏*之前*，因此 verdict 会进入证据语料库，把上一轮 manifest 的每个条目绑定为契约，而不是事后理由。一个一次性的 explore agent（Appendix B.3）与第 1 轮并行运行，从 NexAU 源码和公开编码智能体参考中播种少量可复用 Skills。这些 Skills 没有特殊保护：从第 2 轮开始，Evolve Agent 可以根据观察到的 rollout 保留、细化或移除它们。

## 4 实验

我们围绕三个问题组织实证研究：AHE 在既有 Harness 设计方法版图中的位置；它产出的东西是否能迁移到优化目标之外；循环内部到底是什么带来收益。

1. RQ1（§4.2）：为什么需要 Agentic Harness Engineering，而不是人工工程化 Harness 或其他自动化方法？
2. RQ2（§4.3）：Agentic Harness Engineering 会不会过拟合其优化目标？
3. RQ3（§4.4）：AHE 内部是什么驱动收益？循环的自归因有多可靠？

### 4.1 设置

##### 评估。

我们在 Terminal-Bench 2 [^21] 的完整 89 个任务上驱动演化，其中 easy 4 个、medium 55 个、hard 30 个，每个任务 timeout 延长到 1 小时。跨基准迁移时，我们在 SWE-bench-verified [^14] 上评估 AHE Harness，覆盖 7 个代码仓库的 500 个任务。每个配置报告两个指标：pass@1，即每个任务 $k$ 条 rollout 的平均二元成功率；tokens/trial，即所有 LLM 调用中 prompt 与 completion token 总量的单次试验均值，以千为单位。基础设施中止或 timeout 的试验在 pass@1 下记为失败（与官方 terminal-bench leaderboard 一致），但在 token 均值中排除，以免截断数字。运行基础设施（框架、dispatcher、sandbox、tracer、并发）详见 Appendix A。

##### 模型。

在演化循环和 §4.2 主实验中，三个角色智能体（Code Agent、Agent Debugger、Evolve Agent）共享同一个基础模型：GPT-5.4 [^26]，high reasoning 设置。跨模型迁移（§4.3）中，我们在五个替代基础模型上重新评估 Code Agent：GPT-5.4 [^26] medium 与 xhigh reasoning、qwen-3.6-plus [^38] [^44]、gemini-3.1-flash-lite-preview [^8] 和 deepseek-v4-flash [^6]。

### 4.2 RQ1：主要结果

Table 1：Terminal-Bench 2 共 89 个任务上的 pass@1，按官方难度拆分。NexAU <sub>0</sub> 是共享种子；ACE、Training-Free GRPO 和 AHE 是叠在其上的三种自演化循环。粗体表示每列最佳；并列最佳都加粗。

<table><tbody><tr><th>Method</th><td>All</td><td>Easy</td><td>Med.</td><td>Hard</td></tr><tr><th></th><td>89</td><td>4</td><td>55</td><td>30</td></tr><tr><th colspan="5">Human-designed harness</th></tr><tr><th>OpenCode</th><td>47.2%</td><td>75.0%</td><td>52.7%</td><td>33.3%</td></tr><tr><th>Terminus-2</th><td>62.9%</td><td>75.0%</td><td>74.5%</td><td>40.0%</td></tr><tr><th>Codex</th><td>71.9%</td><td>75.0%</td><td>80.0%</td><td>56.7%</td></tr><tr><th colspan="5">Self-evolved from NexAU <sub>0</sub></th></tr><tr><th>NexAU <sub>0</sub></th><td>69.7%</td><td>87.5%</td><td>78.2%</td><td>51.7%</td></tr><tr><th>ACE</th><td>68.9%</td><td>91.7%</td><td>78.2%</td><td>48.9%</td></tr><tr><th>TF-GRPO</th><td>72.3%</td><td>100.0%</td><td>79.4%</td><td>55.6%</td></tr><tr><th>AHE</th><td>77.0%</td><td>100.0%</td><td>88.2%</td><td>53.3%</td></tr></tbody></table>

我们从只有 bash 的 NexAU <sub>0</sub> 种子（§3.1）出发，在 Terminal-Bench 2 上运行一次十轮 AHE campaign，约 32 小时完成；最佳结果配置报告为 AHE。两个自演化基线 ACE [^49] 和 Training-Free GRPO（TF-GRPO）[^4] 使用同一个 NexAU <sub>0</sub> 种子。

##### AHE 同时超过人工设计和自演化基线。

AHE 超过了面板中的所有基线：三个人工设计 Harness（OpenCode [^2]、Terminus-2 [^10] 和 Codex [^25]）以及两个自演化基线。Figure 1 显示收益跨迭代累积，持续演化把 pass@1 推到 NexAU <sub>0</sub> 种子之上。按难度看，唯一例外是 Hard 层，AHE 略低于 Codex。我们将这个缺口追踪到 AHE 组件在长程任务上的相互干扰，而不是缺少能力：只把 AHE 的长期记忆换入 NexAU <sub>0</sub> 种子，不带其他 AHE 组件，就已经在 Hard 上超过 Codex（§4.4.1）。

##### 只演化提示词会错过承载 AHE 收益的组件。

AHE 与 ACE、TF-GRPO 的差距来自层次错配。ACE 蒸馏智能体在上下文中读取的自然语言 playbook；TF-GRPO 是 GRPO 的轨迹反馈变体，强化成功工具序列。二者都不打开周围 scaffolding 供编辑。AHE 则共同演化系统提示词、工具、中间件和长期记忆；§4.4.1 显示收益集中在后三层，也正是 ACE 和 TF-GRPO 没有触碰的层。

### 4.3 RQ2：迁移到未见任务和基础模型

AHE 的 Harness 是在 Terminal-Bench 2 上用 GPT-5.4 high 演化得到的。我们考察它编码的是通用编码智能体经验，还是对优化目标过拟合：把演化后的 Harness 原样冻结，不再进一步演化，迁移到两个目标外设置：不同任务表面（SWE-bench-verified）和三个替代基础模型。

Table 2：SWE-bench-verified 上的跨基准迁移。ACE、Training-Free GRPO（TF-GRPO）和 AHE 共享 NexAU <sub>0</sub> 种子，只是自演化循环不同；四列都运行在 GPT-5.4 上。AHE 和两个自演化基线均在 Terminal-Bench 2 上演化，并在没有领域内再演化的情况下评估。每列粗体表示最佳；并列最佳都加粗。

<table><tbody><tr><td></td><th></th><th colspan="4">Success rate <math><semantics><mo>↑</mo> <annotation>\uparrow</annotation></semantics></math></th><th colspan="4">Tokens k <math><semantics><mo>↓</mo> <annotation>\downarrow</annotation></semantics></math></th></tr><tr><th>Repo</th><th><math><semantics><mi>N</mi> <annotation>N</annotation></semantics></math></th><th>ACE</th><th>TF-GRPO</th><th>NexAU <sub>0</sub></th><th>AHE</th><th>ACE</th><th>TF-GRPO</th><th>NexAU <sub>0</sub></th><th>AHE</th></tr><tr><th>All</th><th>500</th><th>74.6%</th><th>74.2%</th><th>75.2%</th><th>75.6%</th><th>679</th><th>582</th><th>526</th><th>461</th></tr><tr><td>django</td><td>231</td><td>79.2%</td><td>78.8%</td><td>79.2%</td><td>81.0%</td><td>707</td><td>583</td><td>527</td><td>484</td></tr><tr><td>sympy</td><td>75</td><td>69.3%</td><td>68.0%</td><td>70.7%</td><td>70.7%</td><td>602</td><td>572</td><td>494</td><td>479</td></tr><tr><td>sphinx-doc</td><td>44</td><td>61.4%</td><td>65.9%</td><td>68.2%</td><td>70.5%</td><td>990</td><td>848</td><td>731</td><td>656</td></tr><tr><td>matplotlib</td><td>34</td><td>70.6%</td><td>70.6%</td><td>73.5%</td><td>73.5%</td><td>622</td><td>530</td><td>486</td><td>391</td></tr><tr><td>scikit-learn</td><td>32</td><td>93.8%</td><td>93.8%</td><td>93.8%</td><td>87.5%</td><td>451</td><td>378</td><td>307</td><td>257</td></tr><tr><td>pydata</td><td>22</td><td>77.3%</td><td>77.3%</td><td>77.3%</td><td>72.7%</td><td>563</td><td>516</td><td>386</td><td>338</td></tr><tr><td>astropy</td><td>22</td><td>59.1%</td><td>59.1%</td><td>54.5%</td><td>50.0%</td><td>546</td><td>470</td><td>667</td><td>277</td></tr></tbody></table>

##### 跨基准迁移。

我们在相同基础设施下，将 AHE Harness 与种子及两个自演化基线（NexAU <sub>0</sub>、ACE、TF-GRPO）一起评估到 SWE-bench-verified（Table 2）。

ACE 和 TF-GRPO 的总体成功率都低于 NexAU <sub>0</sub> 种子，同时比种子多花 $11\%$ 到 $29\%$ token：ACE 注入的 playbook 和 TF-GRPO 强化的轨迹分布都来自 Terminal-Bench 2 轨迹，并且每次模型调用都挂在提示词里；迁移到不同任务表面时，这些文本增加了成本，却没有改变底层策略。

AHE 则取得最高总体成功率，种子相对增益集中在 django 和 sphinx-doc 这两个最大、也最耗 token 的代码仓库；它们的多步编辑-验证循环，与 AHE 在 Terminal-Bench 2 上由工具、中间件和长期记忆压缩出的结构相匹配。边际回退只出现在三个最小仓库上，与小仓库上 pass@1 方差超过单仓库增益一致。AHE 还把总体 token 相对 ACE 降低 $32\%$、相对 TF-GRPO 降低 $21\%$、相对种子降低 $12\%$：把行为编码进工具、中间件和记忆，避免了提示词基线每次调用都要重新推导的成本。

[![Terminal-Bench 2 上 AHE 的跨模型迁移结果](https://arxiv.org/html/2604.25850v4/x3.png)](https://arxiv.org/html/2604.25850v4/x3.png)

Figure 3：Terminal-Bench 2 89 个任务上的跨模型迁移。用 GPT-5.4 high 演化出的 AHE 工作区，不经进一步演化，直接在每个基础模型上重新评估，并与同一基础模型上的 NexAU 0 种子配对比较。所有基础模型都超过种子，跨家族模型的收益大于同家族模型。

##### 跨模型迁移。

我们在 §4.1 列出的五个替代基础模型上重新评估 NexAU <sub>0</sub> 种子和 AHE。Figure 3 报告五个正向 pass@1 增益，范围为 $+2.3$ 到 $+10.1$ pp。

跨家族收益大于同家族收益：deepseek-v4-flash 从 $51.7\%$ 到 $61.8\%$，提升 $+10.1$ pp；qwen-3.6-plus 从 $56.2\%$ 到 $62.5\%$，提升 $+6.3$ pp；gemini-3.1-flash-lite-preview 从 $36.5\%$ 到 $41.6\%$，提升 $+5.1$ pp，都高于 GPT-5.4 medium 和 xhigh 上的 $+2.3$ pp。我们的解读是，越远离饱和的基础模型，越依赖 AHE 固定在工具、中间件和长期记忆里的协作模式；更强的基础模型则能以较低边际成本从提示词中重新推导同类协调。

同一模型家族内部呈非单调分布：medium $+2.3$ pp，§4.2 的 high $+7.3$ pp，xhigh $+2.3$ pp。AHE 的步数预算和每任务 timeout 是在 GPT-5.4 high 演化时拟合出来的；medium 每步时间余量更大但少一个 reasoning tier 的原始能力，xhigh 则让更多试验越过每任务 timeout，而我们的 pass@1 约定（§4.1）把它们计为失败。两个方向都会折损收益。

关键结论是五个收益都为正：AHE 工作区不是某个供应商习惯或某个 reasoning depth 的特定产物。收益幅度跟随演化操作点，而不是原始基础模型能力，因此我们把 timeout-budget 耦合视为 Limitations 中讨论的一类泛化风险。

### 4.4 RQ3：分析

我们沿 §3 强调的两个架构选择分析循环：组件分解（§4.4.1）与自我声明归因（§4.4.2）。

#### 4.4.1 RQ3a：价值在哪些组件上积累

Table 3 在组件层面对 AHE 收益做分解：隔离四个演化层中的一个，即长期记忆、工具、中间件或系统提示词，同时让其他三个保持种子默认。四个单组件变体中有三个超过种子；系统提示词替换是唯一回退。

Table 3：Terminal-Bench 2 上的组件级消融。每个 "+ X only" 行只把一个 AHE 组件换入 NexAU <sub>0</sub> 种子；每列最佳加粗。多数单组件替换已经超过种子，且单组件收益超过完整 AHE 的总收益，说明组件之间存在非加性交互，而不是可以干净叠加。

| Variant | All | Easy | Medium | Hard |
| --- | --- | --- | --- | --- |
|  | 89 tasks | 4 tasks | 55 tasks | 30 tasks |
| NexAU <sub>0</sub> | 69.7% | 87.5% | 78.2% | 51.7% |
| \+ memory only | 75.3% | 50.0% | 83.6% | 63.3% |
| \+ tool only | 73.0% | 75.0% | 87.3% | 46.7% |
| \+ middleware only | 71.9% | 100.0% | 81.8% | 50.0% |
| \+ system\_prompt only | 67.4% | 75.0% | 78.2% | 46.7% |
| AHE full | 77.0% | 100.0% | 88.2% | 53.3% |

##### 每个组件拥有不同的失败表面。

记忆添加了 12 条边界案例经验（性能余量、queued-over-limit 取消、evaluator 风格收尾、源码打包布局）；在 Hard 上，这些经验把它推到完整 AHE 之上，而在 Easy 上则退化为多余复验。工具变成一个 1364 行 shell，会从每条命令附近文件中自动浮现 contract hints；在 Medium 上，它距离完整 AHE 只有 $0.9$ pp，而 Hard 上内建 publish guard 过早关闭循环。中间件添加 finish-hook，强制执行一次 evaluator-isomorphic 收尾检查；Easy 上清空所有任务，Hard 上则增加 turn count。系统提示词编码 79 行通用纪律，但其可执行性依赖其他三层；单独插入时总体 $-2.3$ pp。

##### 组件之间非加性互动，限制总收益。

三个正向单组件收益相加，相对完整 AHE 的 $+7.3$ pp 是 $+11.1$ pp；Hard 上 memory-only 甚至超过完整 AHE。原因是记忆、中间件和系统提示词都推向同一种 closure-style 验证，叠加后会在长程预算内花费 turn 做冗余复查。由于 Evolve Agent 优化的是由 55 个 Medium 任务主导的总体指标，它收敛到偏 Medium 的权衡，并交还了部分 Hard 记忆效果；交互感知演化留给未来工作。

#### 4.4.2 RQ3b：循环自归因与现实有多一致

每一轮演化中，我们的 evolve model 都会生成一个 change manifest，说明它预计下一轮会修复哪些 Terminal-Bench 2 任务，以及哪些任务存在回归风险。我们将第 $N{-}1$ 轮预测与第 $N$ 轮 ground truth 比较，分别对修复与回归计算 89 个任务上的标准 precision 和 recall。

##### 证据驱动的定位。

Figure 4 的修复面板显示，evolve model 的定位不是猜测，而是证据驱动。跨迭代 fix-precision 为 33.7%，fix-recall 为 51.4%，约为随机预测基线 6.5% 和 10.6% 的 5 倍。因此，每次 Harness 编辑不是落在任意任务子集上，而是命中了真实且被智能体预期到的目标。

[![AHE 循环中修复和回归预测的 precision 与 recall](https://arxiv.org/html/2604.25850v4/x4.png)](https://arxiv.org/html/2604.25850v4/x4.png)

[![AHE 循环中回归预测的 precision 与 recall（右面板）](https://arxiv.org/html/2604.25850v4/x5.png)](https://arxiv.org/html/2604.25850v4/x5.png)

Figure 4：GPT-5.4 AHE 循环在 Terminal-Bench 2 上 9 个评估轮次中的跨迭代平均 precision 与 recall，并与随机预测基线比较。左：修复预测。右：回归预测。

##### 回归失明。

回归面板呈现相反图景：跨迭代 regression-precision 为 11.8%，regression-recall 为 11.1%，只约为随机基线 5.6% 和 5.4% 的 2 倍。因此，大多数即将出现的回归都没有被预见。智能体可以解释为什么某个编辑应该有帮助，但无法可靠说出同一个编辑将破坏哪些任务，这正是 §4.2 中演化曲线非单调的来源。弥合这个缺口，是未来自演化循环最清晰的方向。Appendix D 给出逐轮分解。

## 5 结论

本文提出 Agentic Harness Engineering（AHE）：一个可观测性驱动的循环，它把编码智能体的 Harness 变成基础模型固定时可学习的适配表面。AHE 将组件暴露为文件，把 rollout 蒸馏成分层证据语料库，并把每次编辑绑定到下一轮可证伪预测；十轮迭代把 Terminal-Bench 2 上的 pass@1 从 69.7% 提升到 77.0%，冻结后的 Harness 还可迁移到 SWE-bench-verified 和三个替代模型家族。我们认为 Harness 层演化是模型侧训练之外的互补轴：这是一个外部化、可审计的表面，编码智能体经验可以在这里积累。

## 局限性

本文研究的是一个有前景但高方差的设置，结论范围应据此理解。

##### 基准范围。

我们的评估在 Terminal-Bench 2 上驱动演化，并在 SWE-bench-verified 上探测迁移。虽然冻结后的 Harness 可迁移到第二个任务表面和三个替代基础模型家族，但更广泛的编程语言、代码仓库级部署和 human-in-the-loop 工作流仍未测试。

##### 演化操作点。

AHE 的步数预算和每任务 timeout 是在 GPT-5.4 high 演化时拟合的，因此跨模型迁移数字混合了 Harness 可移植性与操作点耦合；在同一模型家族中，收益随 reasoning tier 非单调变化（§4.3）。拆开这些因素需要在多个操作点下重新运行循环。

##### 自修改治理。

AHE 将编辑限制在工作区内，在版本化 manifest 中归因每次变更，并按文件粒度回滚无效编辑，但它并不提供完整 guardrail stack。长程 Harness 清理和更强误用防护仍不完整；AHE 应被视为受控研究原型，而不是成熟的自主自改进系统。

## 参考文献

参考文献与脚注保留原始编号和链接，以确保正文引用可追溯。

[^1]: L. A. Agrawal 等 (2025-10) GEPA: reflective prompt evolution can outperform reinforcement learning. In The Fourteenth International Conference on Learning Representations. External Links: [Link](https://openreview.net/forum?id=RQm2KQTM5r). Cited by: §1, §2.2.
[^2]: Anomaly (2025) Opencode: the open source coding agent. External Links: [Link](https://github.com/anomalyco/opencode). Cited by: §4.2.
[^3]: Anthropic (2025) Claude-code. External Links: [Link](https://github.com/anthropics/claude-code). Cited by: §2.1.
[^4]: Y. Cai 等 (2025-10) Training-free group relative policy optimization. arXiv. External Links: 2510.08191, [Document](https://dx.doi.org/10.48550/arXiv.2510.08191), [Link](http://arxiv.org/abs/2510.08191). Cited by: §1, §2.2, §4.2.
[^5]: J. S. Chan 等 (2024-10) MLE-bench: evaluating machine learning agents on machine learning engineering. In The Thirteenth International Conference on Learning Representations. External Links: [Link](https://openreview.net/forum?id=6s5uXNWGIh). Cited by: §2.1.
[^6]: DeepSeek-AI (2026-04) DeepSeek-v4: towards highly efficient million-token context intelligence. External Links: [Link](https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro/blob/main/DeepSeek_V4.pdf). Cited by: §1, §4.1.
[^7]: X. Deng 等 (2025-10) SWE-bench pro: can ai agents solve long-horizon software engineering tasks? External Links: [Link](https://openreview.net/forum?id=9R2iUHhVfr). Cited by: §1, §2.1.
[^8]: Google (2026-03) Gemini-3-1-flash-lite-model-card. External Links: [Link](https://storage.googleapis.com/deepmind-media/Model-Cards/Gemini-3-1-Flash-Lite-Model-Card.pdf). Cited by: §4.1.
[^9]: H. Guo 等 (2025-07) CritiQ: mining data quality criteria from human preferences. ACL 2025. External Links: [Document](https://dx.doi.org/10.18653/v1/2025.acl-long.792), [Link](https://aclanthology.org/2025.acl-long.792/). Cited by: §2.2.
[^10]: Harbor (2026) Terminus-2. External Links: [Link](https://www.harborframework.com/docs/agents/terminus-2). Cited by: §4.2.
[^11]: S. Hu, C. Lu, and J. Clune (2024-10) Automated design of agentic systems. In The Thirteenth International Conference on Learning Representations. External Links: [Link](https://openreview.net/forum?id=t9U3LW7JVX). Cited by: §2.2.
[^12]: N. Jain 等 (2024-10) LiveCodeBench: holistic and contamination free evaluation of large language models for code. External Links: [Link](https://openreview.net/forum?id=chfJJYC3iL). Cited by: §2.1.
[^13]: N. Jain 等 (2025-08) R2E-gym: procedural environment generation and hybrid verifiers for scaling open-weights swe agents. External Links: [Link](https://openreview.net/forum?id=7evvwwdo3z#discussion). Cited by: §2.1.
[^14]: C. E. Jimenez 等 (2023-10) SWE-bench: can language models resolve real-world github issues? External Links: [Link](https://openreview.net/forum?id=VTF8yNQM66). Cited by: §1, §2.1, §4.1.
[^15]: O. Khattab 等 (2023-10) DSPy: compiling declarative language model calls into self-improving pipelines. arXiv. External Links: 2310.03714, [Document](https://dx.doi.org/10.48550/arXiv.2310.03714), [Link](http://arxiv.org/abs/2310.03714). Cited by: §2.2.
[^16]: Y. Lee 等 (2026-03) Meta-harness: end-to-end optimization of model harnesses. arXiv. External Links: 2603.28052, [Document](https://dx.doi.org/10.48550/arXiv.2603.28052), [Link](http://arxiv.org/abs/2603.28052). Cited by: §1.
[^17]: L. Lin (2026-02) Agent debugger: understanding agent trajectory with agentic workflows - dawning road. External Links: [Link](https://dawning-road.github.io/blog/agent-debugger). Cited by: §3.2.
[^18]: R. Lopopolo (2026-02) Harness engineering: leveraging codex in an agent-first world. External Links: [Link](https://openai.com/zh-Hans-CN/index/harness-engineering/). Cited by: §1, §2.1.
[^19]: Z. Ma 等 (2026-04) SkillClaw: let skills evolve collectively with agentic evolver. arXiv. External Links: 2604.08377, [Document](https://dx.doi.org/10.48550/arXiv.2604.08377), [Link](http://arxiv.org/abs/2604.08377). Cited by: §1.
[^20]: A. Madaan 等 (2023-11) Self-refine: iterative refinement with self-feedback. NeurIPS. External Links: [Link](https://openreview.net/forum?id=S37hOerQLB). Cited by: §1, §2.2.
[^21]: M. A. Merrill 等 (2026-01) Terminal-bench: benchmarking agents on hard, realistic tasks in command line interfaces. arXiv. External Links: 2601.11868, [Document](https://dx.doi.org/10.48550/arXiv.2601.11868), [Link](http://arxiv.org/abs/2601.11868). Cited by: §1, §2.1, §4.1.
[^22]: S. Miserendino 等 (2025-06) SWE-lancer: can frontier llms earn $1 million from real-world freelance software engineering? ICML. External Links: [Link](https://openreview.net/forum?id=xZXhFg43EI). Cited by: §2.1.
[^23]: Nex-AGI (2025) NexAU (au for agent universe), a general-purpose agent framework for building intelligent agents with tool capabilities. External Links: [Link](https://github.com/nex-agi/NexAU). Cited by: §3.1.
[^24]: A. Novikov 等 (2025-06) AlphaEvolve: a coding agent for scientific and algorithmic discovery. arXiv. External Links: 2506.13131, [Document](https://dx.doi.org/10.48550/arXiv.2506.13131), [Link](http://arxiv.org/abs/2506.13131). Cited by: §2.2.
[^25]: OpenAI (2025) Codex cli. External Links: [Link](https://developers.openai.com/codex/cli). Cited by: §1, §4.2.
[^26]: OpenAI (2026-03) Introducing gpt-5.4. External Links: [Link](https://openai.com/index/introducing-gpt-5-4/). Cited by: §4.1.
[^27]: K. Opsahl-Ong 等 (2024-11) Optimizing instructions and demonstrations for multi-stage language model programs. EMNLP 2024. External Links: [Document](https://dx.doi.org/10.18653/v1/2024.emnlp-main.525), [Link](https://aclanthology.org/2024.emnlp-main.525/). Cited by: §2.2.
[^28]: J. Pan 等 (2025-06) Training software engineering agents and verifiers with swe-gym. ICML. External Links: [Link](https://openreview.net/forum?id=Cq1BNvHx74). Cited by: §2.1.
[^29]: P. Rajasekaran 等 (2025-09) Effective context engineering for ai agents. External Links: [Link](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents). Cited by: §3.2.
[^30]: P. Rajasekaran (2026-03) Harness design for long-running application development. External Links: [Link](https://www.anthropic.com/engineering/harness-design-long-running-apps). Cited by: §1, §2.1.
[^31]: N. Research (2026) Hermes agent — the agent that grows with you. External Links: [Link](https://hermes-agent.nousresearch.com/). Cited by: §1, §2.1.
[^32]: N. Shinn 等 (2023-11) Reflexion: language agents with verbal reinforcement learning. NeurIPS. External Links: [Link](https://openreview.net/forum?id=vAElhFcKW6). Cited by: §1, §2.2.
[^33]: P. Steinberger (2026-02) OpenClaw — personal ai assistant. External Links: [Link](https://openclaw.ai/). Cited by: §1, §2.1.
[^34]: R. Sutton (2019-03) The bitter lesson. External Links: [Link](https://www.cs.utexas.edu/%CB%9Ceunsol/courses/data/bitter_lesson.pdf). Cited by: §1.
[^35]: K. Team 等 (2026-02) Kimi k2.5: visual agentic intelligence. arXiv. External Links: 2602.02276, [Document](https://dx.doi.org/10.48550/arXiv.2602.02276), [Link](http://arxiv.org/abs/2602.02276). Cited by: §1.
[^36]: K. Team (2026-04) Kimi k2.6 tech blog: advancing open-source coding. External Links: [Link](https://www.kimi.com/blog/kimi-k2-6). Cited by: §1.
[^37]: N. Team 等 (2025-12) Nex-n1: agentic models trained via a unified ecosystem for large-scale environment construction. arXiv. External Links: 2512.04987, [Document](https://dx.doi.org/10.48550/arXiv.2512.04987), [Link](http://arxiv.org/abs/2512.04987). Cited by: §3.1.
[^38]: Q. Team (2026-04) Qwen3.6-plus: towards real world agents. External Links: [Link](https://qwenlm.github.io/blog/qwen3.6/). Cited by: §1, §4.1.
[^39]: X. M. Team (2026-04) MiMo-v2.5-pro. External Links: [Link](https://huggingface.co/XiaomiMiMo/MiMo-V2.5-Pro). Cited by: §1.
[^40]: V. Trivedy (2026-02) Improving deep agents with harness engineering. External Links: [Link](https://www.langchain.com/blog/improving-deep-agents-with-harness-engineering). Cited by: §1, §2.1.
[^41]: G. Wang 等 (2023-10) Voyager: an open-ended embodied agent with large language models. arXiv. External Links: 2305.16291, [Document](https://dx.doi.org/10.48550/arXiv.2305.16291), [Link](http://arxiv.org/abs/2305.16291). Cited by: §2.2.
[^42]: X. Wang 等 (2025-04) OpenHands: an open platform for ai software developers as generalist agents. arXiv. External Links: 2407.16741, [Document](https://dx.doi.org/10.48550/arXiv.2407.16741), [Link](http://arxiv.org/abs/2407.16741). Cited by: §1, §2.1.
[^43]: P. Xia 等 (2026-02) SkillRL: evolving agents via recursive skill-augmented reinforcement learning. arXiv. External Links: 2602.08234, [Document](https://dx.doi.org/10.48550/arXiv.2602.08234), [Link](http://arxiv.org/abs/2602.08234). Cited by: §1.
[^44]: A. Yang 等 (2025-05) Qwen3 technical report. arXiv. External Links: 2505.09388, [Document](https://dx.doi.org/10.48550/arXiv.2505.09388), [Link](http://arxiv.org/abs/2505.09388). Cited by: §1, §4.1.
[^45]: J. Yang 等 (2024-11) SWE-agent: agent-computer interfaces enable automated software engineering. NeurIPS. External Links: [Link](https://openreview.net/forum?id=mXpq6ut8J3&referrer=%5Bthe%20profile%20of%20Shunyu%20Yao%5D\(%2Fprofile%3Fid%3D%CB%9CShunyu_Yao1\)). Cited by: §1, §2.1.
[^46]: J. Yang 等 (2024-10) SWE-bench multimodal: do ai systems generalize to visual software domains? External Links: [Link](https://openreview.net/forum?id=riTiq3i21b). Cited by: §1, §2.1.
[^47]: Y. Zeng 等 (2026-02) SWE-hub: a unified production system for scalable, executable software engineering tasks. arXiv. External Links: 2603.00575, [Document](https://dx.doi.org/10.48550/arXiv.2603.00575), [Link](http://arxiv.org/abs/2603.00575). Cited by: §2.1.
[^48]: J. Zhang 等 (2024-10) AFlow: automating agentic workflow generation. ICLR. External Links: [Link](https://openreview.net/forum?id=z5uVAKwmjf). Cited by: §2.2.
[^49]: Q. Zhang 等 (2025-10) Agentic context engineering: evolving contexts for self-improving language models. ICLR. External Links: [Link](https://openreview.net/forum?id=eC4ygDs02R). Cited by: §1, §2.2, §4.2.
[^50]: A. Zhao 等 (2024-12) ExpeL: llm agents are experiential learners. arXiv. External Links: 2308.10144, [Document](https://dx.doi.org/10.48550/arXiv.2308.10144), [Link](http://arxiv.org/abs/2308.10144). Cited by: §1.
[^51]: W. Zhou 等 (2024-06) Symbolic learning enables self-evolving agents. arXiv. External Links: 2406.18532, [Document](https://dx.doi.org/10.48550/arXiv.2406.18532), [Link](http://arxiv.org/abs/2406.18532). Cited by: §2.2.
[^52]: T. Y. Zhuo 等 (2024-10) BigCodeBench: benchmarking code generation with diverse function calls and complex instructions. ICLR. External Links: [Link](https://openreview.net/forum?id=YrycTjllL0). Cited by: §2.1.
[^53]: G. Zunic (2026-04) The bitter lesson of agent harnesses. External Links: [Link](https://browser-use.com/posts/bitter-lesson-agent-harnesses). Cited by: §1.

## Appendix A 实验设置：完整细节

本附录展开 §4.1 中压缩呈现的设置，包括形式化指标定义和运行基础设施。种子配置 NexAU <sub>0</sub> 是建立在 §3.1 NexAU 框架上的简单代码智能体，只向模型暴露 bash 工具，没有 Skills、中间件或长期记忆。AHE 外循环的每次迭代都会编辑这个工作区，因此所有报告的收益都以 NexAU <sub>0</sub> 为共同起点。

所有运行都使用 NexAU 框架实例化编码智能体。Harbor 分发任务、隔离每条 rollout 并验证通过/失败，每个任务 timeout 为 3600 秒。每条 rollout 都在全新的 E2B 远程沙箱中运行，因此 shell 副作用不会在任务间泄漏。InMemoryTracer 记录轨迹并镜像到 Langfuse。Agent Debugger 以并发 16 执行，每个任务 timeout 为 600 秒。

Table 4 汇总参考 AHE 运行的超参数：Code Agent、Agent Debugger、Evolve Agent 和 Explore Agent 都以 GPT-5.4 为 backing model，只在 reasoning tier、采样和每组件限制上不同；外循环共 10 轮，每任务 $k=2$ 条 rollout，并发 rollout 96，沙箱生命周期 3600 秒，数据集为 Terminal-Bench 2 的 89 个任务。

Terminal-Bench 2 官方 leaderboard 将 89 个任务划分为 4 个 easy、55 个 medium 和 30 个 hard。对任务集 $D$ 和每任务 $k$ 条 rollout，设 $r_{i,j}\in\{0,1\}$ 为任务 $i$ 的第 $j$ 条 rollout 的二元奖励，则

$$
\mathrm{pass@1}=\frac{1}{k|D|}\sum_{i=1}^{|D|}\sum_{j=1}^{k}r_{i,j}.
$$

因基础设施异常（如沙箱崩溃或 API timeout）终止的试验记为 $r=0$，而不是丢弃。token 成本统计每次 rollout 中所有 LLM 调用的 prompt + completion，并在完成试验上取均值，以千 token 报告。Succ/Mtok 定义为

$$
\mathrm{Succ/Mtok}=\frac{\mathrm{pass@1}\times 10^{6}}{\mathrm{mean\ tokens\ per\ trial}},
$$

即每百万 token 的期望成功数。Table 5 将 Table 2 的 pass@1 和 Tokens k 折叠为 SWE-bench-verified 各仓库的 Succ/Mtok，数值为 $\mathrm{pass@1}\times 10^{3}/\text{Tokens k}$。

## Appendix B 提示词与配置

本附录汇总驱动 AHE 外循环的提示词，以及种子 Code Agent 的系统提示词。原论文中的五个块复现了公开仓库 [https://github.com/china-qijizhifeng/agentic-harness-engineering](https://github.com/china-qijizhifeng/agentic-harness-engineering) 在产生 Section 4 实验的提交上的字面文件内容。Jinja 风格的 `{{ var }}` 占位符在 Harness 运行时填充。

### B.1 Code Agent 种子系统提示词

NexAU <sub>0</sub> 在第 1 轮加载的种子系统提示词有意保持最小：一个工具、三条行为规则和三个运行时注入变量。第 1 轮之后，每次迭代都可以向该文件追加规则；Appendix C 的案例研究追踪了第一次这样的追加。

### B.2 Evolve Agent 提示词

Evolve Agent 的系统提示词编码了 Section 3 描述的三条硬契约：只在 workspace 内可控编辑、证据驱动变更、交付 change manifest。它还嵌入了智能体必须推理的目录布局，以及 manifest 的 JSON 形状。

### B.3 Explore Agent 提示词

Explore Agent 在第 1 轮并行运行，用于从 NexAU 源码和公开编码智能体材料中提取少量初始 Skills。源码探索 agent 读取本地代码，Web 研究 agent 读取外部参考；二者的产物并不被特殊保护，后续 Evolve Agent 可以保留、修改或删除。

## Appendix C 定性案例研究

Figure 5 展示三个 Evolve Agent 编辑示例，分别位于三个可控性层级：新增中间件文件、系统提示词追加、shell 工具编辑。下面四条轨迹和八项变更说明这些编辑如何改变任务结果。

[![三个可控性层级上的 Evolve Agent 编辑示例](https://arxiv.org/html/2604.25850v4/x6.png)](https://arxiv.org/html/2604.25850v4/x6.png)

Figure 5：三个 Evolve Agent 编辑示例，分别位于三个可控性层级：新增中间件文件、系统提示词追加、shell 工具编辑。

### C.1 轨迹：失败 rollout 与通过 rollout

#### C.1.1 轨迹 1：db-wal-recovery

任务要求从 SQLite WAL 恢复数据。失败 rollout 在同一随机种子的前三步后分叉：智能体信任缓存 stdout、根据少量可见行猜测缺失行、用 guessed values 覆盖数据，并用行数检查替代 verifier 契约。第 2 轮的 chg-1 追加了八条系统提示词规则，其中"先读契约"、"不要从可见样本过拟合"、"完成前镜像 evaluator"等规则分别截获这些失败步骤。通过 rollout 会重新阅读任务说明，把 WAL changes 当作已有行的变更，定位并恢复原始字节，最后用与 verifier 同构的检查收尾。chg-1 是对 `workspace/systemprompt.md` 的 68 行追加，不包含 SQLite、WAL 或 db-wal-recovery 字样。

#### C.1.2 轨迹 2：path-tracing

path-tracing 要求智能体实现一个 path tracer，把场景描述渲染到 `/app/reconstructed.ppm`。失败 rollout 已经渲染出正确文件，并通过自检，却在最后执行清理命令删除 `/app/reconstructed.ppm`，随后以清理命令退出码提交，导致 verifier 找不到输出。第 5 轮引入 publish-state guard 后，同样的清理命令会被 shell guard 拦截，并明确指出该文件已受保护；智能体收到提示后停止，不再重跑清理，verifier 能在磁盘上找到正确文件。

#### C.1.3 轨迹 3：mcmc-sampling-stan

mcmc-sampling-stan 要求安装 rstan 2.32.7，拟合层次 beta-binomial 模型，并把 alpha 与 beta 的 posterior mean 写入两个文本文件。失败模式是 proxy-then-skip：智能体先用独立网格积分估计 posterior，把这些数作为交付物，随后启动真正 MCMC 采样，却为了"保留已创建交付物"提前 kill 掉采样，最后只检查文件存在且能解析为数字。verifier 从头运行 `analysis.R`，未收敛链产生约 `1e19` 的值而失败。第 6 轮的两个组件共同修复：工具级 publish-state guard 保护脚本入口点，中间件 ExecutionRiskHintsMiddleware 识别"用代理验证器替代具名 evaluator"、"浅层验证"等模式，促使智能体运行 `analysis.R` 到 `iter = 100000` 完成，并在 `/tmp` 中独立复跑交叉检查。

#### C.1.4 轨迹 4：configure-git-webserver

configure-git-webserver 展示第 8 轮如何修补第 5、6 轮架构的薄弱点。此前智能体在成功部署检查后，带着 override token 删除已验证的 live deliverable 或重置 live root，导致 verifier 404。第 8 轮 chg-1 将两类软原因升级为 hard block：删除任何非 `/tmp` 的受保护输出，或把任何非 `/tmp` 的受保护 root 重置为空，都不再能被 `ALLOW_POST_SUCCESS_RESET` 覆盖。chg-2 则把上一步中间件发出的风险提示提升为下一轮 model turn 顶部的 FRAMEWORK reminder，并添加针对 clean-layout、single-file delivery、official-wrapper 和 named-revision contract 的启发式提醒。

### C.2 四个获胜轮次交付的变更

第 2 轮交付 prompt rules 和 shell-timeout argument；第 5 轮交付 publish-state 机制，包括提示词/工具描述规则与 shell guard；第 6 轮把 publish-state guard 扩展到脚本入口点，并引入跨步骤 ExecutionRiskHintsMiddleware；第 8 轮交付 hard blocks 和 FRAMEWORK reminders。所有变更都以相同 JSON manifest 形状记录，并在下一轮 Phase 3 中接受自动归因与回滚。

### C.3 阅读 change-manifest 图

change manifest 将每个编辑连同 predicted fixes、predicted regressions 和 constraint level 带入下一轮 Phase 3，由 attribution check 决定保留或回滚。Figure 8 到 Figure 11 分别展示四个获胜轮次的 manifest 条目，覆盖 prompt、tool implementation 和 middleware 三个约束层级。

## Appendix D 逐轮自归因分解

本附录展开 §4.4.2 的总体自归因结果。Figures 12 和 13 展示修复/回归的 precision/recall 四个面板。柱状图把每个分母拆成深蓝 TP 和浅色 FP 或 FN；虚线在右侧 $0$ 到 $100\%$ 轴上标出指标，实线叠加同期 pass@1。Fix-precision 和 fix-recall 跨轮从接近 0 摆到接近饱和，说明 evolve model 对自身改进的因果归因虽有噪声但包含信息。回归预测则多轮低于 $25\%$：9 轮中智能体给出 43 个唯一回归预测，只有 5 个命中，累计 $P=11.6\%$；同时还有 40 个实际回归未被预见，累计 $R=11.1\%$。

[![逐轮修复预测的 precision 与 recall](https://arxiv.org/html/2604.25850v4/x7.png)](https://arxiv.org/html/2604.25850v4/x7.png)

[![逐轮修复预测的 recall（右面板）](https://arxiv.org/html/2604.25850v4/x8.png)](https://arxiv.org/html/2604.25850v4/x8.png)

Figure 12：逐轮修复预测。左：precision。右：recall。柱状图把分母拆成 TP 与 FP 或 FN；线条叠加指标和同期 pass@1。

[![逐轮回归预测的 precision 与 recall](https://arxiv.org/html/2604.25850v4/x9.png)](https://arxiv.org/html/2604.25850v4/x9.png)

[![逐轮回归预测的 recall（右面板）](https://arxiv.org/html/2604.25850v4/x10.png)](https://arxiv.org/html/2604.25850v4/x10.png)

Figure 13：逐轮回归预测。左：precision。右：recall。编码方式同 Figure 12。

## Appendix E 更广泛影响

本文引入 *agentic harness engineering*（AHE）：一个自演化循环，编码智能体可以从执行反馈中编辑自身 scaffolding（系统提示词、工具、中间件和长期记忆）。AHE 降低了产出有竞争力编码智能体的人类工程成本：没有专门 Harness 团队的实践者，也能从同一基础模型获得比 prompt-only 自演化基线更高的 pass@1 和更低的单试验 token 成本，从而让学术团队、小组织和教育场景更容易获得能力较强的编码助手。由于循环把反复出现的协调模式编码进工具、中间件和记忆，而不是越来越长的提示词，它降低了每次调用的计算量及推理阶段相关能耗。它也支持快速 Harness 迭代，使周围 scaffolding 能跟上基础模型发布节奏。负面社会影响和相应泛化风险见 Limitations。
