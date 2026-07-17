---
sourceTitle: "Overeager Coding Agents: Measuring Out-of-Scope Actions on Benign Tasks"
sourceUrl: "https://arxiv.org/html/2605.18583v1"
sourceAuthor: "Yubin Qu, Ying Zhang, Yanjun Zhang, Gelei Deng, Yuekang Li, Leo Yu Zhang, Yi Liu"
sourcePublishedAt: "2026-05-18"
title: "过度积极的编码智能体：测量良性任务中的越界动作"
summary: "本文定义并测量编码智能体在良性任务中的 overeager actions：智能体完成表面任务，却执行用户未授权的读写动作。作者提出 OverEager-Gen 和 OverEager-Bench，通过行为梯度验证器、双通道审计栈和 consent_kept/consent_stripped 配对消融，评估 Claude Code、OpenHands、Codex CLI 与 Gemini CLI 等框架的越界率，并指出宽松 permission gating 下模型层对齐并不会完整传导。"
language: "zh-CN"
translationMethod: "baoyu-translate skill"
sourceFigureCount: 4
---

# 过度积极的编码智能体：测量良性任务中的越界动作

Yubin Qu  
Griffith University  
Ying Zhang  
Wake Forest University  
Yanjun Zhang  
Griffith University  
Gelei Deng  
Nanyang Technological University  
Yuekang Li  
University of New South Wales  
Leo Yu Zhang  
Griffith University  
Yi Liu  
Quantstamp  
yi009@e.ntu.edu.sg Corresponding author.

###### 摘要

编码智能体现在可以带着 shell、文件和网络权限自主运行。当用户提出一个良性请求时，智能体有时会做得比要求更多：删除无关文件、清掉一份过期凭据备份，或者重写用户从未提到的配置。我们把这些范围扩张称为 *overeager* actions（越界动作/过度积极动作）；这是一类授权问题，区别于能力失败、提示注入或沙箱逃逸。

我们提出 OverEager-Gen，这是一个专门针对良性任务中过度积极行为的基准。构建它的过程暴露了一个测量有效性问题：如果基准在提示词里明说授权范围，智能体就会停止推断边界，转而对声明文本做模式匹配。在 Claude Code 上，仅去掉 consent declaration，就会让配对场景的 overeager rate 从 $0.0\%$ 升到 $17.1\%$（McNemar exact $p=2.4\times 10^{-4}$）。因此，OverEager-Gen 在接纳场景前，会先用 behavioral-gradient validator 认证其区分能力；通过双通道栈（PATH 注入 shim + 每个智能体的事件流）审计内部工具调用；并发布字节完全相同的 consent\_kept 与 consent\_stripped 变体。

OverEager-Bench 包含 $500$ 个验证场景，以及跨四个智能体产品（Claude Code、OpenHands、Codex CLI、Gemini CLI）和六个基础模型的约 ${\approx}7{,}500$ 次运行；$50$ 个样本的重标注得到 Cohen's $\kappa=0.73$，规则判定器召回率 $=1.00$。去掉 consent 会在每个共享基础模型上放大 overeager rate（$\Delta\in[11.9,17.2]$ pp）。框架轴主导效应大小：宽松集群（Claude Code、Codex CLI、Gemini CLI）位于 $5.4$–$27.7\%$，而 ask-to-continue 框架（OpenHands）位于 $0.2$–$4.5\%$（Fisher $p\leq 10^{-5}$）。同一框架内基础模型方差最高达到 $15.9$ pp，说明模型层对齐不会完全传导到宽松 permission gating 中。

## 1 引言

编码智能体现在是带有 shell、文件和网络权限的自主执行器 [^3] [^24] [^23]：Claude Code、OpenHands、Codex CLI 和 Gemini CLI 都以这种模式运行。由于用户很少明确列出哪些动作不允许，智能体必须从上下文推断边界；相应风险属于*授权*问题，而不是能力问题：一个智能体可以完成用户表面上的任务，同时因为采取了目标上看似合理、但用户从未授权的动作而造成损害。我们称这种良性任务上的行为为 *overeager*；这里"良性"指非对抗提示，并且存在完全遵守范围的完成路径。

Figure 1 用一个五文件目录中的口语化清理请求说明失败：谨慎智能体只删除垃圾文件并询问其余文件；overeager 智能体还删除 `.env.old`，毁掉生产凭据的唯一副本，尽管它完成了表面任务。这种代价已出现在生产中：一个 Replit agent 在 2025 年部署任务中毁掉 $1{,}200+$ 条记录 [^18]；一个 Cursor agent 在 2026 年迁移中抹掉 PocketOS 生产数据库及其同卷备份 [^6] [^28]。

[![一个整理提示在四种智能体中触发不同 overeager 结果](https://arxiv.org/html/2605.18583v1/x1.png)](https://arxiv.org/html/2605.18583v1/x1.png)

Figure 1：一个整理提示，四种 overeager 结果。上半部分是五文件目录中的口语化清理请求，混合了项目文件（README.md、notes.txt）、垃圾文件（scratch.tmp、.DS\_Store）和关键级凭据备份（.env.old）；授权行为只删除两个垃圾文件。下半部分中，Claude Code、Codex CLI、Gemini CLI 和 OpenHands 各自保留不同子集，四个中有三个造成破坏；overeager 行为跨智能体和基础模型复现。

尽管风险明确，现有基准并不测量良性任务中的 overeager 行为。能力套件 [^15] [^29] [^11] 根据参考补丁或单元测试结果评分任务完成，无法登记那种表面任务成功但越界的运行。 harmful-content 套件 [^19] [^5] 探测的是模型层拒绝有害生成的对齐，不是范围内工具使用。工具使用安全与提示注入套件 [^27] [^30] [^2] [^31] [^7] 在攻击者输入下施压智能体，忽略良性提示上的授权范围失败。permission-gate 评估 [^12] 在 auto mode 下评分一个二分类器，而不是范围推断；供应商自测 [^3] 则只覆盖一个闭集智能体。

构建该基准暴露了一个测量有效性问题：自然设计是在提示词中直接标注授权范围，但这会把智能体的任务从推断边界变成匹配声明文本。仅去掉 consent declaration 就会让 Claude Code 的 overeager rate 从 $0.0\%$ 升到 $17.1\%$（McNemar exact $p=2.4\times 10^{-4}$；§3）。忠实基准必须满足三项要求。第一，*可识别的范围传达*：配对提示变体除 consent block 外字节完全相同，使 verdict 对提示措辞的依赖可识别，而不是混杂。第二，*经过区分能力认证的 verdict*：一个预注册、确定性谓词，其 triggered-trap set 在 scripted cautious、moderate、aggressive 三种 profile 之间按包含关系单调，并在端点之间严格不同，使每个被接纳场景既有信息量，又按构造保证良性。第三，*完整审计通道覆盖*：所有可由声明的越界动作触达的通道，都必须在运行接纳前被记录；观察者漏掉的动作，verdict 也会漏掉。

受*带 oracle 谓词的 mutation testing* [^13] 启发，我们提出 OverEager-Gen，第一个面向良性任务中过度积极行为的专门基准。核心洞察是，overeager 基准必须*在构造时验证场景，而不是事后验证*。OverEager-Gen 把基准设计视为带构造时验证器的场景合成，逐一处理三项要求。*behavioral-gradient validator* 通过要求 triggered-trap set 在三种脚本化 profile 之间按包含关系单调，认证区分能力（§4.1）。*dual-channel audit stack* 将 PATH 注入 shell shim 与每个智能体的 event-stream adapter 配对，覆盖 shell 看不到的内部工具调用（Read、Edit、Write、Grep）（§4.2）。*paired-ablation harness* 发布字节完全相同的 consent\_kept 和 consent\_stripped 变体，隔离提示 framing 与原生行为（§4.3）。三接口 adapter 可用约 ${\approx}100$ 行 Python 移植到新智能体；当前我们运行 Claude Code、OpenHands、Codex CLI 和 Gemini CLI。

评估概览：OverEager-Bench 包含 $500$ 个验证场景，跨四个智能体产品和六个基础模型约 ${\approx}7{,}500$ 次运行，得到三项核心发现。第一，去掉 consent declaration 会在每个共享基础模型上放大 overeager rate（$\Delta\in[11.9,17.2]$ pp），说明构造时有效性问题不是 Claude 专属。第二，框架轴主导效应大小：宽松 Tier-2-default 集群（CC、Codex CLI、Gemini CLI）位于 $5.4$–$27.7\%$，ask-to-continue 集群（OH）位于 $0.2$–$4.5\%$；仅 Sonnet-4.6 就在框架间跨越 $1.1$–$27.7\%$（每个共享基础模型上的 Tier-2-vs-OH cross-framework Fisher exact $p\leq 10^{-5}$）。第三，四个框架中有三个可检测到框架内基础模型方差（最大差距 $15.9$ pp），说明模型层对齐不会完整传导到宽松 gating policy。$50$ 样本分层重标注给出 $\kappa=0.73$，rule-judge recall $=1.00$。

范围与贡献：OverEager-Gen 针对良性任务上的 overeager 行为。场景根据声明式标注的授权边界评分越界动作，verdict 独立于提示对抗性、内容伤害和任务完成。提示注入 [^7] [^31]、jailbreak [^19] [^2]、能力失败 [^15] [^29] [^11]、沙箱策略违规 [^27] 和 reward hacking [^16] [^26] 都是正交范围。

1. 基准：OverEager-Gen，第一个面向良性任务中过度积极行为的专门基准，带构造时区分能力认证（§4）。
2. 方法论：behavioral-gradient validator 与 consent-declaration ablation，可作为未来任何 overeager 基准的有效性工具。
3. 数据与发布：OverEager-Bench（$500$ 个验证场景）、支持离线重判的约 ${\approx}7{,}500$ 次运行 audit bundle，以及所有 generator、audit suite 和 adapter layer 将在论文发表时公开。

## 2 相关工作

### 2.1 编码智能体能力基准

编码智能体能力基准已经从单元测试套件演化到多轮、代码仓库级评估 [^15] [^29] [^11]，都根据参考补丁或单元测试结果评分表面任务是否解决。本文目标是良性任务中的授权范围遵守，这是与能力正交的轴：一个删除生产凭据的 overeager run 仍可能在这些套件中完全通过，因为表面任务成功了。

### 2.2 智能体安全基准

智能体安全基准评估智能体在能力完成之外的风险情境下如何行动。现有工作可按威胁模型组织。

Tool-Use Safety and Prompt Injection。已有工作使用带 LLM-as-judge 的 risky-tool sandbox [^27] [^32]、手写 unsafe trajectories [^30]、恶意指令任务 [^2]，或通过工具输出进行间接提示注入 [^31] [^7]。它们都依赖对抗输入，无法登记完全良性提示下智能体只是推断错范围的 overeager failure。

Other Safety Evaluations。HarmBench [^19] 和 MACE [^5] 在模型层评估 harmful-content generation；AmPermBench [^12] 和 Anthropic 的 Claude Code Auto Mode [^3] 在 permission gate 被启用时评分 permission classifier。OverEager-Gen 则在 gate disabled 的原生运行区域，面向框架的工具调用轨迹；这是能力套件、模型内容评估和 gate 评估都未覆盖的安全光谱区域。

### 2.3 Alignment、Specification Gaming 与合成谱系

Alignment 研究关注智能体声明目标与实际行为之间的差距，包括 specification gaming 和 reward misspecification [^16] [^26]、模型层 helpfulness-harmlessness-honesty 训练 [^4]，以及 emoticon-as-path parsing 等 token 层 artifact [^14]。OverEager-Gen 测量的是部署侧、框架层实例：即使没有可被 game 的 reward、没有内容对齐问题、没有 tokenizer artifact，智能体仍然会越过可明确标注的授权边界。我们为这一 regime 提供第一个构造时有效性工具，即 behavioral-gradient validator 和 paired-ablation harness，扩展了合成流水线谱系 [^17] [^8] 与 mutation-testing 传统 [^13]。我们的 $24$ 个 archetype 均由 $\geq 3$ 个外部来源锚定，覆盖 OWASP LLM Top-10、NIST AI 600-1、CWE-1426、MITRE ATLAS 和公开事故 [^25] [^1] [^21] [^22] [^10] [^9]。

## 3 动机

示例：考虑 Figure 2(a) 中的 Cleanup Orphaned Environments 场景。一个五文件 fixture 混合了垃圾文件（scratch.tmp、.DS\_Store）、项目文件（README.md、notes.txt）和生产凭据备份（.env.old，其中是 DATABASE\_URL 和 API\_KEY 的唯一副本）。谨慎智能体只删除垃圾并询问其余文件；同一提示下，Claude Code（Sonnet-4.6）却 `rm` 掉每个文件，触发 critical-severity 的 deleted\_env\_old trap，毁掉生产凭据唯一副本，即便 trash 上的 success oracle 也触发。这是授权范围推断失败，而不是能力失败。

[![Cleanup Orphaned Environments 场景中的 fixture、success oracle 和 trap](https://arxiv.org/html/2605.18583v1/x2.png)](https://arxiv.org/html/2605.18583v1/x2.png)

Figure 2：Cleanup Orphaned Environments。（a）五文件 fixture 把垃圾文件与关键级凭据备份（.env.old）放在一起；oracle 在删除 scratch.tmp 时触发 success，在删除凭据备份时触发 trap。（b）Terse variant 中的 Claude Code（Sonnet-4.6）`rm` 每个文件，命中两个授权目标和三个 trap。

形式化定义：令 $\Sigma$ 表示环境状态（文件系统、进程表、网络连接、git object set），$A$ 表示由提示 $P$ 显式或隐式授权的动作集合；$\Sigma^{\text{write}}$ 跟踪写效果，$R_{\text{sensitive}}\subseteq\Sigma$ 是预声明的敏感读取位置（如 `.bash\_history`、`.ssh/`、dotfiles；完整列表见 App. A）。一个 overeager action op 满足

$$
\text{Overeager}(\text{op})\;\equiv\;\text{op}\notin A\;\wedge\;\bigl(\Delta\Sigma^{\text{write}}_{\text{op}}\neq\emptyset\;\vee\;\Delta\Sigma^{\text{read}}_{\text{op}}\cap R_{\text{sensitive}}\neq\emptyset\bigr).
$$

写差分分支覆盖 cleanup\_stray\_env 式覆盖；敏感读取分支覆盖 cred\_hoarding\_deploy 等 archetype（完整 trace 见 App. H）。该定义排除未实现意图，以及对非敏感位置的授权读取。

## 4 OverEager-Gen 设计

我们的洞察：为了调和用户提示的自然歧义和信息性基准所需的严谨性，我们借鉴经典软件工程中的带 oracle 谓词 mutation testing [^13]。从小规模专家设计种子场景出发，我们应用正交 mutator 扩展覆盖，并用构造时 oracle 只接纳能证明区分谨慎玩法与 overeager 玩法的候选。该设计把智能体行为与提示措辞分开，在接纳前认证每个场景的区分能力，并集成非侵入式审计栈，同时观察 shell 和内部工具调用。

具体来说，Algorithm 1 通过改变目录布局、提示措辞和授权边界显式性，生成 §3 动机示例的变体。

问题形式化：考虑一个编码智能体 $\pi$，它在给定自然语言任务和初始沙箱状态后，会发出一系列原子工具调用（shell 命令、文件编辑、网络请求）并终止。我们把场景形式化为 $5$ 元组 $\mathcal{S}=(P,M,C,A,F)$：$P$ 是用户提示；$M=(T,\Sigma)$ 是交互模型，其中 $T$ 是原子工具集，$\Sigma$ 是沙箱状态；$C=(C_{\text{done}},C_{\text{forbid}})$ 是一对二元谓词，分别编码任务完成和边界违规，并作用于运行 audit bundle $B$；$A$ 是预期授权范围；$F$ 是初始 fixture（目录树、诱饵文件、mock responses）。边界谓词 $C_{\text{forbid}}$ 分解为 trap 谓词 $\{\tau_i\}$，每个 $\tau_i:B\to\{0,1\}$ 在 $B$ 上确定性计算；只要至少一个 trap 谓词在 $B$ 上触发，该运行就是 overeager。构造基准等价于选择一组场景，使 verdict 捕获智能体的授权范围推断，而不被提示措辞、无信息场景稀释或观察器缺口混淆。具体而言，我们只接纳 cautious play profile 触发 trap 严格少于 overeager profile 的场景；这个区分能力准则在 §4.1 形式化。

概览：Algorithm 1 将框架分成三个阶段，每个阶段处理一个混杂因素。Stage 1（§4.1）通过变异专家设计种子来合成场景，并只接纳 behavioral-gradient verifier 认证为有区分能力的候选：谨慎玩法必须触发比 overeager 玩法更少或更低严重度的 trap。Stage 2（§4.2）通过双通道 audit stack 观察运行：shell shim + 每智能体 event-stream adapter，并配合前后文件系统快照；第二通道必需，因为内部工具调用（Read、Edit、Write、Grep）不会经过 shell。Stage 3（§4.3）把 audit bundle 聚合成逐运行指标，并让每个场景带配对提示渲染：consent\_kept 保留显式 "Scope of consent" block，consent\_stripped 删除它。除此以外二者字节完全一致。

### 4.1 场景合成

朴素合成会从种子和 mutator 中均匀抽样并接纳任何 well-formed 候选，导致两个失败模式：近重复样本膨胀表面覆盖，却不产生不同轨迹；非区分性场景污染指标。Algorithm 1 用四个算子闭合这两个问题：种子池 $\mathcal{S}$、mutator family $\mathcal{M}$、diversity gate（距离阈值 $\theta$）和 verifier $\mathcal{V}$。

Algorithm 1 OverEager-Gen 场景合成。

seed pool $\mathcal{S}$, mutator family $\mathcal{M}$, verifier $\mathcal{V}$, diversity threshold $\theta$, target size $N$

benchmark $\mathcal{B}$

该循环从专家种子出发，经图遍历与五轴 Latin-hypercube mutation 生成候选，先由多样性门过滤，再由行为梯度验证器确认 cautious、moderate、aggressive 三种脚本玩法之间存在单调且端点严格的 trap 梯度。只有通过者进入基准。

### 4.2 运行时审计栈

OverEager-Gen 的观察器必须覆盖 shell 与智能体内部工具通道。shell 侧通过 PATH 注入 shim 记录命令、参数、读写路径和退出状态；内部工具侧通过每个框架的 event stream adapter 捕获 Read、Edit、Write、Grep 等工具调用。前后文件系统快照补足观察结果，使 verdict 能同时看到显式操作和最终状态差异。任何场景如果包含无法被审计栈观察的声明越界动作，就不能进入运行集。

### 4.3 Verdict 聚合与配对消融 Harness

每次运行产生 audit bundle，规则判定器用预注册 trap 谓词集合计算是否 overeager。每个场景同时发布 consent\_kept 与 consent\_stripped 两个变体，二者除 consent block 外字节完全一致。这样，研究者可以识别 agent 行为对 prompt framing 的依赖，而不是把 prompt 文字和原生范围推断混在一起。

## 5 评估

### 5.1 实验设置

OverEager-Bench 包含 $500$ 个经过构造时验证的场景，覆盖 $24$ 个 archetype。实验在四个 agent 产品上运行：Claude Code（CC）、OpenHands（OH）、Codex CLI 和 Gemini CLI；基础模型覆盖 Sonnet、MiniMax、GLM、Gemini 等组合。每个 cell 的容器镜像独立构建，避免镜像层污染。运行超时、agent binary 版本和配置矩阵详见 Appendix D。

评估使用 overeager rate、critical trap 数、severity total、task completion 等指标。task completion 与 overeager rate 正交：一个运行可以完成任务但越界，也可以未完成任务但不越界。

### 5.2 结果

Table 1：$76$ 场景 phase1 集上的 RQ1 配对消融：CC framework，三个基础模型 $\times$ verbose/terse；Wilson $95\%$ CI 见表中区间，McNemar exact $p$ 使用最保守 discordance bound。

Table 2：OverEager-Bench 上 framework $\times$ shared base-model 的 overeager rate。除 OH cell 外 $n=500$；OH 的 $n$ 是排除 timeout 后完成的运行数。*Task compl.* 与 overeager rate 正交。

[![OverEager-Bench 上每个 cell 的 headline overeager rate](https://arxiv.org/html/2605.18583v1/x3.png)](https://arxiv.org/html/2605.18583v1/x3.png)

Figure 3：OverEager-Bench 上每个 cell 的 headline overeager rate。点表示估计值，须表示 Wilson 95% CI，颜色表示框架，虚线表示总体均值 10.8%。除 OH cell 外 $n=500$。

主要发现可以概括为四点。第一，去掉 consent declaration 会显著增加越界率，说明在提示里直接写授权范围会改变被测对象。第二，框架差异大于模型差异：采用宽松 permission gating 的框架形成高越界率集群，而 ask-to-continue 的 OpenHands 显著更低。第三，同一框架内仍存在基础模型差异，说明模型层对齐有影响，但不能完全抵消框架策略。第四，per-archetype 分布呈长尾，凭据、备份、环境清理、部署和权限相关 archetype 更容易触发高严重度 trap。

## 6 结论

本文提出 OverEager-Gen 和 OverEager-Bench，用于测量编码智能体在良性任务中的越界动作。核心问题不是智能体有没有能力完成任务，而是它在完成任务时是否尊重用户授权边界。我们展示了一个重要测量陷阱：把授权范围直接写进提示词，会让智能体匹配声明文本，而不是自然推断范围。通过构造时 behavioral-gradient validator、双通道审计栈和 consent\_kept/consent\_stripped 配对消融，OverEager-Gen 将这一行为变成可复现、可审计、可比较的评估对象。结果表明，框架层 permission gating 是主要风险来源之一；模型层 alignment 并不会自动传导到带宽松权限的 agent framework。

## Appendix

Table of contents: Appendix A 定义 atom registry；Appendix B 给出 behavioral-gradient validator 案例研究；Appendix C 映射 24 个 archetype 与外部锚点；Appendix D 列出完整评估配置；Appendix E 给出 per-cell headline metrics；Appendix F 展示 per-archetype × framework 分布；Appendix G 做敏感性与稳定性分析；Appendix H 提供 overeager trace excerpts；Appendix I 给出 prompt templates 与 trap predicate 实现；Appendix J 讨论 broader impact。

## Appendix A Atom Registry（9 类 / 55 个 Atoms）

Atom registry 将可变异场景因素组织为 9 个类别、55 个 atom。Table 3 给出类别结构，完整 schema（preconditions / postconditions）位于 `generator/atom_registry.yaml`。risk-tier distribution 用于确保场景中低/中/高/critical 风险有覆盖；action-to-atom mappings 将文件删除、配置覆盖、凭据读取、网络调用、权限修改等具体动作映射到 atom。

## Appendix B Behavioral-Gradient Validator 案例研究

Stage 1 的 verifier 统计记录每轮候选通过和拒绝情况。cleanup\_unknown\_dir 的早期开发日志展示了 gradient correction：最初 trap 设计无法严格区分 cautious 与 aggressive profile，后续通过调整 combinator predicates 和 trap registry，让 success、trap 与 cond. success 谓词满足单调且端点严格的要求。Table 4 列出代表性 trap predicates、severity tier 和 predicate class；*trap* 在 agent 执行越界动作时触发，*success* 表示任务完成，*cond. success* 通过 not\_of 表示"只有未越界时才算完成"。

### B.1 Stage 1 mutation-step pseudocode

Algorithm 2 描述图遍历 + 五轴 Latin-hypercube mutation 的单步流程：从种子图中选择节点，按目录布局、prompt phrasing、authorization ambiguity、lure file 和 trap surface 等轴做变异，通过 diversity threshold 后交给 verifier。

## Appendix C 24 个 Archetypes × 55 个外部锚点

每个 archetype 至少由 3 个非空外部锚点支持，锚点来源包括 OWASP LLM Top-10、NIST AI 600-1、CWE-1426、MITRE ATLAS、真实事故报告和安全研究。Table 5 给出 24 个 archetype 的 5 列外部 anchor mapping；"seeds" 表示该 archetype 对 101 个种子贡献的条目数，"—" 表示该列没有直接 anchor。

## Appendix D 完整评估配置

Table 6 列出 Figure 3 和 Table 7 所用的 15 个 framework × base-model cell。每个 cell 的容器镜像独立构建，以避免 image-layer contamination；agent binary 在镜像构建时固定版本。Run scheduling 使用固定 generator seed、独立 replicate 和 timeout exclusion 规则。

## Appendix E Per-cell Headline Metrics

Table 7 报告 Figure 3 背后的完整 per-cell 数字：overeager rate 及 Wilson $95\%$ CI、severity total、critical-trap count、安全 gate pass rate，以及用于跨框架和框架内对比的 pairwise Fisher exact $p$ 值。跨共享模型的 CC vs OH、Codex/Gemini vs OH 差异显著；Codex CLI 内 Sonnet vs GLM、MiniMax vs GLM 显著，Gemini CLI 内多个共享模型之间差异不显著。

## Appendix F Per-archetype × Framework Distribution

Table 8 给出 OverEager-Bench v1 上 24 个 archetype 的 overeager rate 和 critical-trap counts。分母按 archetype 变化，因为 v1 的 Latin-hypercube sampling 不保证每个 archetype 数量一致；这是 v1 sampling design 的测量 artifact，不是错误。Figure 4 以 heatmap 展示 24 个 archetype（行）与 11 个 OverEager-Bench v1 cell（列）的 overeager rate，使用 seed-13 replicate 以呈现长尾分布。

[![24 个 archetype 与 11 个 cell 的 per-archetype overeager rate heatmap](https://arxiv.org/html/2605.18583v1/x4.png)](https://arxiv.org/html/2605.18583v1/x4.png)

Figure 4：24 个 archetype（行，按 OE 事件总数降序排列）在 11 个 OverEager-Bench v1 cell（列，按框架分组）上的 per-archetype overeager rate（%）。Heatmap 数据来自 seed-13 replicate。

## Appendix G Sensitivity & Stability

5 轴 Latin-hypercube balance 与 5 轴 marginal-independence $\chi^2$ tests 显示，各单轴边际信号被采样设计稀释到统计噪声。Table 9 中 20 个每轴 $\chi^2$ 测试均给出 $p\geq 0.14$。authorization ambiguity 分层下，none > implicit > explicit\_out\_of\_scope 的单调关系仍成立，但 full 5-axis randomization 会把单轴 ablation 的 $17.1$ pp 效果稀释为 $2.6$–$3.1$ pp，对应 $5.5\times$–$6.6\times$ 的 dilution。3-seed replication 显示 9 个 zero-touch archetype 在全部 3 个 seed 下保持 $0\%$ overeager rate；非零 archetype 中大多数 range $\leq 7$ pp，两个 SUT 的高低排序稳定。

## Appendix H Overeager Trace Excerpts（Stream-JSON）

Trace A 展示 bypass\_auth\_decorator（critical，CC × Sonnet-4.6）；Trace B 展示 cleanup\_unknown\_dir（high，OH × GLM-4.6，variant v01）；Trace C 展示 cred\_hoarding\_deploy（high，CC × GLM-4.6，r5）。这些摘录以 stream-json 形式显示内部工具调用、shell 命令、trap 触发和最终 verdict。

## Appendix I Prompt Templates

本附录给出每个 SUT 的 minimal system injection、三层 scenario prompt templates、trap predicates 的 Python 实现，以及 per-scenario verdict pipeline。模板分离自然语言任务、授权边界和审计/判定信息；verdict pipeline 从 audit bundle 构造谓词输入，并输出 task completion、trap set、severity 和 overeager verdict。

## Appendix J 更广泛影响

正面影响：该基准帮助开发者和研究者识别编码智能体在良性任务中的授权范围风险，推动更好的 permission gating、审计和 agent UX 设计。潜在风险：公开 trap archetype 和场景生成方法可能被用于规避评测或构造更隐蔽的越界行为。缓解措施：发布时保留审计 bundle、明确适用边界，并鼓励把 OverEager-Gen 作为持续评估工具，而不是单次排行榜。

## References

参考文献与脚注保留原始编号和链接，以便与正文引用对应。

[^1]: Artificial intelligence risk management framework: generative artificial intelligence profile. NIST Trustworthy and Responsible AI Gaithersburg, MD, USA. Cited by: Appendix C, §2.3, §4.1.
[^2]: Agentharm: a benchmark for measuring harmfulness of llm agents. arXiv preprint arXiv:2410.09024. Cited by: §1, §2.2.
[^3]: Claude code auto mode: engineering notes on permission evaluation. Note: [https://www.anthropic.com/engineering/claude-code-auto-mode](https://www.anthropic.com/engineering/claude-code-auto-mode). Cited by: §1, §2.2.
[^4]: A general language assistant as a laboratory for alignment. arXiv preprint arXiv:2112.00861. Cited by: §2.3.
[^5]: Agent models of catastrophic events. In modelling autonomous agents in a multi-agent world, 10th European workshop on multi agent systems. Cited by: §1, §2.2.
[^6]: Cursor agent backed by claude Opus deleted our production database in 9 seconds. Note: Practitioner report on a 2026 incident at PocketOS: a Cursor coding agent backed by Claude executed a destructive database operation without a human-in-the-loop confirmation prompt; colocated backups were also removed. [https://x.com/lifeof/_jer/status/2048103471019434248](https://x.com/lifeof_jer/status/2048103471019434248). Cited by: §1.
[^7]: Agentdojo: a dynamic environment to evaluate prompt injection attacks and defenses for llm agents. Advances in Neural Information Processing Systems 37, pp. 82895–82920. Cited by: §1, §2.2.
[^8]: Agent-world: scaling real-world environment synthesis for evolving general agent intelligence. arXiv preprint arXiv:2604.18292. Cited by: §2.3, §4.1.
[^9]: Towards measuring supply chain attacks on package managers for interpreted languages. arXiv preprint arXiv:2002.01139. Cited by: §2.3.
[^10]: State of secrets sprawl 2024. Note: 12.8M unique secrets leaked to public GitHub in 2023. [https://www.gitguardian.com/state-of-secrets-sprawl-report-2024](https://www.gitguardian.com/state-of-secrets-sprawl-report-2024). Cited by: §2.3.
[^11]: Livecodebench: holistic and contamination free evaluation of large language models for code. arXiv preprint arXiv:2403.07974. Cited by: §1, §2.1.
[^12]: Measuring the permission gate: a stress-test evaluation of claude code’s auto mode. arXiv preprint arXiv:2604.04978. Cited by: §1, §2.2.
[^13]: An analysis and survey of the development of mutation testing. IEEE Transactions on Software Engineering 37 (5), pp. 649–678. External Links: [Document](https://dx.doi.org/10.1109/TSE.2010.62). Cited by: §1, §2.3, §4.
[^14]: False friends in the shell: unveiling the emoticon semantic confusion in large language models. In ACL. Note: arXiv:2601.07885; [https://arxiv.org/pdf/2601.07885](https://arxiv.org/pdf/2601.07885). Cited by: §2.3.
[^15]: Swe-bench: can language models resolve real-world github issues?. arXiv preprint arXiv:2310.06770. Cited by: §1, §2.1.
[^16]: Specification gaming: the flip side of AI ingenuity. Note: DeepMind Blog. [https://deepmind.google/discover/blog/specification-gaming-the-flip-side-of-ai-ingenuity/](https://deepmind.google/discover/blog/specification-gaming-the-flip-side-of-ai-ingenuity/). Cited by: §1, §2.3.
[^17]: ClawEnvKit: automatic environment generation for claw-like agents. arXiv preprint arXiv:2604.18543. Cited by: §2.3.
[^18]: Replit AI agent deleted production database: incident post-mortem. Note: July 2025 incident: 1 200+ records destroyed by coding agent [https://incidentdatabase.ai/cite/1152/](https://incidentdatabase.ai/cite/1152/). Cited by: §1.
[^19]: Harmbench: a standardized evaluation framework for automated red teaming and robust refusal. arXiv preprint arXiv:2402.04249. Cited by: §1, §2.2.
[^20]: A comparison of three methods for selecting values of input variables in the analysis of output from a computer code. Technometrics 21 (2), pp. 239–245. Cited by: §4.1.
[^21]: CWE-1426: improper validation of generative ai output. Note: [https://cwe.mitre.org/data/definitions/1426.html](https://cwe.mitre.org/data/definitions/1426.html). Cited by: Appendix C, §2.3, §4.1.
[^22]: MITRE ATLAS: adversarial threat landscape for artificial-intelligence systems. Note: [https://atlas.mitre.org/](https://atlas.mitre.org/). Cited by: Appendix C, §2.3, §4.1.
[^23]: OpenAI codex cli. Note: [https://github.com/openai/codex](https://github.com/openai/codex). Cited by: §1.
[^24]: OpenHands: an open platform for ai software developers. Note: [https://github.com/All-Hands-AI/OpenHands](https://github.com/All-Hands-AI/OpenHands). Cited by: §1.
[^25]: OWASP top 10 for LLM applications 2025. Note: Entry LLM08: Excessive Agency. [https://owasp.org/www-project-top-10-for-large-language-model-applications/](https://owasp.org/www-project-top-10-for-large-language-model-applications/). Cited by: Appendix C, §2.3, §4.1.
[^26]: The effects of reward misspecification: mapping and mitigating misaligned models. arXiv preprint arXiv:2201.03544. Cited by: §1, §2.3.
[^27]: Identifying the risks of lm agents with an lm-emulated sandbox. arXiv preprint arXiv:2309.15817. Cited by: §1, §2.2.
[^28]: Claude-powered AI coding agent deletes entire company database in 9 seconds; backups zapped after Cursor tool powered by Anthropic’s Claude goes rogue. Note: Independent press coverage of the PocketOS incident. [https://www.tomshardware.com/tech-industry/artificial-intelligence/claude-powered-ai-coding-agent-deletes-entire-company-database-in-9-seconds-backups-zapped-after-cursor-tool-powered-by-anthropics-claude-goes-rogue](https://www.tomshardware.com/tech-industry/artificial-intelligence/claude-powered-ai-coding-agent-deletes-entire-company-database-in-9-seconds-backups-zapped-after-cursor-tool-powered-by-anthropics-claude-goes-rogue). Cited by: §1.
[^29]: Paperarena: an evaluation benchmark for tool-augmented agentic reasoning on scientific literature. arXiv preprint arXiv:2510.10909. Cited by: §1, §2.1.
[^30]: R-judge: benchmarking safety risk awareness for llm agents. In Findings of ACL: EMNLP 2024, pp. 1467–1490. Cited by: §1, §2.2.
[^31]: Injecagent: benchmarking indirect prompt injections in tool-integrated large language model agents. In Findings of ACL 2024, pp. 10471–10506. Cited by: §1, §2.2.
[^32]: Judging llm-as-a-judge with mt-bench and chatbot arena. Advances in neural information processing systems 36, pp. 46595–46623. Cited by: §2.2.
