---
title: "Zalando 的 Agentic 工程实践：一份快照"
sourceTitle: "Agentic Engineering at Zalando: a snapshot"
sourceUrl: "https://engineering.zalando.com/posts/2026/08/agentic-engineering-at-zalando-a-snapshot.html"
sourceAuthor: "Bartosz Ocytko"
sourcePublishedAt: "2026-08-14"
sourceSiteName: "Zalando Engineering Blog"
summary: "Zalando 250+ 工程团队 2.5 年 agentic 工程实践的一手快照：LiteLLM 代理统一 API 访问与成本度量、坚持供应商独立不强制工具、四代码库对照量化 AI 编码对 PR 尺寸与圈复杂度的影响、LLM 按风险分级自动放行 33% 低风险 PR 使 lead time 降 20–40%，以及技能库、治理与规模化培训体系。"
sourceLanguage: "en"
language: "zh-CN"
translationMethod: "人工整理逐段翻译（cloud agent，对照原文全文）"
sourceFigureCount: 3
---


> 原文：[Agentic Engineering at Zalando: a snapshot](https://engineering.zalando.com/posts/2026/08/agentic-engineering-at-zalando-a-snapshot.html)
> 作者：Bartosz Ocytko（Executive Principal Engineer）
> 发布于 Zalando Engineering Blog，2026-08-14

行业环境每天都在快速变化，整个业界都还在摸索该如何对待 Agentic 工程（agentic engineering，智能体工程）。我们有超过 250 个工程团队在各业务线上开展创新，因此得以观察到 LLM 以不同形态、不同节奏产生的价值与影响。我们此前分享过一些早期成果：用 LLM 做[商品数据增强](https://engineering.zalando.com/posts/2024/09/content-creation-copilot-ai-assited-product-onboarding.html)、以 LLM-as-a-judge [提升搜索质量](https://engineering.zalando.com/posts/2026/03/search-quality-assurance-with-llm-judge.html)、做[商品搜索的相关性评估](https://engineering.zalando.com/posts/2024/11/llm-as-a-judge-relevance-assessment-paper-announcement.html)，以及[前端迁移](https://engineering.zalando.com/posts/2025/02/llm-migration-ui-component-libraries.html)。

最近，我们回顾了过去 2.5 年的进展，想分享几条对我们行之有效的做法。

## 从第一天起就用 LLM proxy 提供 API 化的 LLM 访问

早在 GitHub Copilot 只提供 IDE 内自动补全的年代，我们就是它的用户。为了补充这一产品并提供基于 API 的 LLM 访问，我们的 ML 平台团队在 2024 年 1 月部署了一个基于 [LiteLLM](http://docs.litellm.ai/) 的 API 代理，可访问多家供应商的模型（现为 OpenAI、AWS Bedrock 和 Google Vertex）。这样一来，工程师就能轻松地试验不同的工具和模型。平台团队也获得了一个统一的度量采纳情况的入口：MAU、WAU、模型、User-Agent。

我们喜欢 LiteLLM 的可扩展性。我们用 post-call hook 做匿名化的成本追踪，用 [pre-call hook](https://docs.litellm.ai/docs/proxy/call_hooks) 基于 User-Agent 请求头限制对代理的访问，从而强制客户端升级版本。对于自行安装管理的客户端，很遗憾，封禁访问是唯一有效的手段。下线模型时也一样——总有一批长尾用户既不调整本地配置，也不关注新模型的发布。我们还启用了 prompt caching 检查点的[自动注入](https://docs.litellm.ai/docs/tutorials/prompt_caching)，在自定义 agent 的作者还在学习 prompt caching 期间，就先降低了它们的成本。为了缓解 LiteLLM 的稳定性与内存泄漏问题，我们通过 `--max_requests_before_restart` 强制其每处理 2 万个请求后重启。这让我们只用六个小型 pod（2 CPU 核、4 GB 内存）就支撑起 2,000 MAU 的代理服务。我们期待其 Rust 重写版本带来性能与稳定性的提升。

### API 之外：Chat UI 与 CLI

在 API 之外，我们还提供一个简单的聊天 UI（fork 自一个如今已停止维护的开源代码库）和一个 CLI 工具（基于 pydantic-ai 自研）。令我们意外的是，尽管如今 IDE 插件和 CLI 已随处可见、用户有大把更强的替代品可选，Chat UI 的采纳率依然很高。CLI 诞生于 2024 年 8 月的一场 hackathon，那时 coding agent 还不存在。起初我们只是在维护脚本里用它在终端访问模型。随着时间推移，这个仓库聚起了一小群维护者，他们为其扩展了更多工具，帮助我们规模化地推广用 LLM 做编码任务：

- 生成图片，并支持简单的文件格式转换
- 多轮对话的交互模式，配有加载和保存文件的简单命令用于上下文管理
- 支持 MCP 的 agent 模式，并为内部托管的 MCP 服务器自动注入 Bearer token
- http 转 stdio 的 MCP 代理，让内部构建的 MCP 服务器可以在任何其他工具中轻松接入
- 内置 MCP 服务器配置，让首次接触 MCP 的用户几乎无摩擦地上手试验
- coding agent 配置命令，为 claude code、opencode、pi 安装安全配置，并附带用于模型自动发现的自定义插件

token 注入与 MCP 代理帮助我们推广了 MCP 服务器的安全配置方式——配置文件中无需硬编码任何机密。这使得内部部署的 MCP 服务器得以推广使用，而无需操心任何认证问题。随着 LLM 访问的用户群扩展到工程之外、各人安全直觉参差不齐，这一点尤其重要。各团队托管部署的 MCP 服务器会自动受到我们默认的 ingress OAuth 过滤器保护。

### LLM 工具链的挑战

有两个老问题在不同工具间高度一致。其一，工具太经常使用通用的 User-Agent 请求头，使得我们很难识别代理的客户端到底是哪个工具。对于我们自己的 LLM 应用（例如自定义代码评审 agent），我们确保在 User-Agent 里带上名称、来源仓库和版本。对于其他工具，我们向上游提需求（或直接贡献代码）。

其二，工具普遍不支持用自定义 auth 命令生成认证 token，只支持静态凭证，或默认只面向订阅制服务。依赖环境变量令用户沮丧：token 过期后需要手动刷新，还得重启应用。为弥补这个缺口，我们提供了一个注入 auth 请求头的本地代理，并为 coding agent 编写插件来处理模型访问、模型发现及其参数。这个代理逐渐演化出帮助实时调试自研 LLM 工具的功能：它自带一个 TUI，展示每个模型的当前成本、突出显示缓存 token 使用上的缺口，并展示每个请求的元数据（User-Agent、模型、成本、含缓存写入/读取的 token 统计）。未来的改进包括通过分析出站请求，给出更好使用 prompt caching 的提示（灵感来自 pi 的 [`showCacheMissNotices`](https://pi.dev/docs/latest/settings#model-thinking)）。

## 供应商独立

在快速变化的环境里，供应商独立是关键。我们的代理让我们有能力接入更多 LLM 供应商，而用户自行挑选最合拍的工具。我们从未在公司层面强制使用某个单一工具。用户根据可用的模型和自己的偏好（IDE 还是 CLI）来选择工具。从基于聊天的交互，自然演进到由 CLI 或桌面 UI 编排的 agentic 循环，也进一步推动了工具切换。

对一部分用户来说，[opencode](https://opencode.ai/) 和 [pi](https://pi.dev/) 正中甜点：它们允许在 GitHub Copilot 订阅和我们的 API 访问之间混用模型。这种向开放工具的迁移很可能继续推进，因为要脱离封闭权重模型，就必须切换到开放工具。不过，我们也看到用户对用惯了的 coding agent 过于依恋。模型偏好同样有影响——有用户就是偏爱供应商 X 而非 Y 的回答风格。尽管各工具能力大同小异、切换成本其实很低，这种心理层面的换工具迟疑依然存在。

我们为各款 coding agent 维护参考配置，也为模型供应商维护插件。虽然我们在探索面向开发者工具的设备管理（Device Management，此前我们从未需要过它），但工具配置目前可以用我们 CLI 里的一条专门命令来应用，它会从一个 git 仓库读取最新的配置状态。

## 识别 AI 编码的影响

### PR 与代码评审

两年来，我们在 PR 数据中都能看到 AI 编码的影响。除了 \([100,500)\) 尺寸段 PR 的持续增长之外，自 2025 年 Q2 Sonnet 4 发布以来，更高的尺寸段也在增长，尤其是 \([500,1k)\) 和 \([1k,2k)\)。

![PR 尺寸分布（按季度）](imgs/zalando-agentic-engineering/pr_size_distribution.png)

*PR 尺寸分布（按季度）*

认为大 PR 成了问题的团队，已在内部约定把 PR 限制在固定大小以内。通过 pre-commit hook 硬性强制的做法则不太流行。另一些团队习惯了更大的 PR，不再依赖精心编排的提交序列，转而依赖我们所用工具提供的便利，比如 GitHub PR 或 Linear Reviews 里对变更的语义化分组。

### 对代码复杂度的影响

我们也在代码库本身看到了 AI 编码的影响——好的和坏的实践都被放大了。我们观察了 Java 和 Golang 代码库中代码质量指标在 commit 级别的演化：把每个 commit 映射到几项指标，并绘制其随时间的变化。我们使用了四个代码库：

| 代码库 | 语言 | 库龄 | Agent 采纳情况 | 备注 |
|---|---|---|---|---|
| `go-agentic-only` | Go | 新库 | 从一开始就全量使用 | 第 0 天起就以规格驱动开发（spec-driven development）构建 |
| `go-reference` | Go | 10 年以上 | 自第 3000 个 commit 之后 | 开源代码库 |
| `java-with-agents` | Java | 4 年 | 自第 1600 个 commit 之后 | 逐步采纳 coding agent |
| `java-reference` | Java | 12 年以上 | 无 | 宏服务（macroservice），代码已陆续抽取到其他仓库 |

观察 commit 级别的总圈复杂度演化，我们能精确定位 coding agent 进场时代码复杂度出现的拐点。有些代码库带有能佐证这些拐点的标记（Co-authored-by）；另一些（尤其是开源库）则不那么一致，因为并非所有作者都披露自己使用了 coding agent。

对于从一开始就全量使用 agentic 编码的代码库，我们看到复杂度极快地堆积，随后增长逐渐消退。如果一个边界清晰的微服务的代码复杂度本就该趋于平台期，那我们希望这意味着构建时间被大幅缩短了。是否如此，时间会给出答案。图中还能看到其中一个代码库在一次重构之后复杂度出现下降。

![各代码库的总 CCN（圈复杂度数）](imgs/zalando-agentic-engineering/total_ccn.png)

*各代码库的总 CCN（圈复杂度数）*

值得注意的是，连提交信息都带着 coding agent 的足迹，典型地集中在 5,000 字符上下。一个极端案例里，我们发现某条提交信息竟包含了一份完整的单元测试执行日志。这类问题在代码评审中容易被漏掉，因此很适合作为约束加进 pre-commit hook。

![各代码库的提交信息大小分布](imgs/zalando-agentic-engineering/message_bytes.png)

*各代码库的提交信息大小分布*

## 基于风险的 PR 审批

为了守住 PR 的合并前置时间（lead time to merge），我们构建了一个基于风险的 PR 审批工具，在 PR 创建阶段触发。每个 PR 都会按其发布风险被评估为：低、中、高。我们 33% 的 PR 属于低风险，由 bot 自动批准。PR 作者因此可以自行选择合并，这在我们这里把 PR lead time 降低了 20–40%（与全部 PR 相比）。它也大大加速了那些构建原型或维护内部工具的个人——否则他们就得打断某位同事，请对方来给自己的变更"盖个章"。

审批 bot 的规则集建立在对我们生产事故及故障典型诱因的分析之上。这些规则高度特定于我们的技术栈、部署清单、配置文件等。会破坏配置的拼写错误被评为高风险（当年若有它，我们本可躲过 [metadpata 事故](https://engineering.zalando.com/posts/2024/01/tale-of-metadpata-the-revenge-of-the-supertools.html)）。破坏向后兼容性是中风险，需要另一个人来复核其业务上的合理性。纯文档变更是低风险。

坊间证据表明，这个 bot 正在影响工程师的行为，使其提高 PR 落入低风险的概率。例如，PR 开始被拆分成两类：可以快速发布的（低风险）向后兼容变更，以及不那么紧要、需要额外审批的中风险 PR（如删除未使用的字段）。过去我们观察到这类变更常被混在一起，既拉长了上市时间，也抬高了发布风险。

## 从会话数据中学习

审视 coding agent 的会话数据极具教育意义。除了发现那些白白消耗 token 的非必要流量（例如生成计划名称、终端窗口标题、给空闲会话写摘要），用户还能更了解自己的提示词模式。我们发现 [agentsview](https://www.agentsview.io/) 很适合跨多个工具检查会话数据，[codeburn](https://github.com/getagentseal/codeburn) 则提供了按项目/任务类型理解使用情况的手段。

会话数据带来的一个洞察是：某位用户在 opencode 上的缓存命中率极低（<30%，而预期应为 80% 以上）。为了定位这个低命中率的会话，我们写了一个简单的解析器来计算各会话的缓存命中率。所幸最终查明这并不是波及整个用户群的系统性 bug。

## Agent skills

我们有一个集中式的 agent skill 集合，按插件分组。这些技能覆盖组织内跨学科（如数据、工程、前端、SRE）或跨编程语言的常见任务与关注点。其中广受欢迎的一类是迁移技能，指导团队采纳新的平台工具或基础设施实践（例如多架构构建）。技能集合通过受管配置设置分发，或通过 CLI 命令安装所需的符号链接（例如 opencode 不支持插件市场）。

通过鼓励团队广泛贡献自己觉得有用的技能，我们获得了在组织内发现并传播最佳实践的机会，比如在 CI/CD 流水线中校验插件语法、技能与脚本之间的关注点分离（例如 OAuth token 的生成该放在哪里）。

自建技能的团队把这个集合当作参考和灵感来源，例如效仿其中对 [agent-skills-eval](https://github.com/darkrishabh/agent-skills-eval) 的使用。

## 治理

在超过 200 个团队各自创新、广泛探索生态的当下，一个问题随之而来：要不要收敛、何时收敛。我们认为现在还远远太早。在 agentic 工程实践仍处早期阶段之时，我们的核心目标是团队之间的透明与交流。我们借助结构化的知识分享（下文详述）和成熟的治理方法来创造透明度、促进跨团队分享。

其中一个机制是我们的 [Tech Radar](https://opensource.zalando.com/tech-radar/)。我们在内部版本中新增了 AI 分区，聚焦于为我们的服务、政策与指南提供概览和关键文档入口。过去 10 年里，类库选型早已下放给各语言的实践社区（communities of practice），不在 Tech Radar 的范畴内。然而，AI 工具的寒武纪大爆发和生态的迅速膨胀，让"哪些实践已被验证、哪些仍处早期"的清晰指引变得更加必要。因此我们认为，为 AI 用例追踪实践、工具与类库是有价值的。为提高透明度，雷达的 AI 分区在我们基于 Backstage 的开发者门户 [Sunrise](https://engineering.zalando.com/posts/2023/08/sunrise-zalandos-developer-platform-based-on-backstage.html) 中拥有独立入口。

对于早期项目，我们提供按用例逐一进行法务评估的入口，以确保合规。此外，我们通过扫描已部署的 Docker 镜像来自动检测 AI 模型的使用。相关系统会被自动注册进我们的开发者门户，其负责人会被要求补充所需文档，或接受一次额外的法务审查。

## 知识分享

知识分享必须顾及生态变化的速度。当最先进水平（state of the art）每天都在变时，早期采纳者与刚入场者的交流需求截然不同。越接近正在成型的最佳实践，越标准化、可规模化的培训形式就越有效。本节介绍在知识交流与培训上对我们行之有效的几种形式。

有一点值得指出：找到平衡很重要。工程领域里除了 AI，还有其他值得关注的事情。在我们一年一度的软件工程社区大会（Software Engineering Community Conference）上，我们把 Agentic 工程专题排在第 1 天，为了平衡，把工程基本功（Engineering Fundamentals）专题排在第 2 天。同样，我们还计划新增一门工程卓越（engineering excellence）培训，讲授在我们这种规模下运维系统学到的惨痛教训，推广工程最佳实践。

### LLM 公会

自 2024 年起，我们有一个聊天频道，用来分享和讨论行业新闻、我们 LLM 服务的相关公告，以及组队做实验。我们每周举办 1 小时的知识分享会，每场演讲或演示占 20 分钟。会议全程录像。

分享会设有主持人，负责编排议程、鼓励自己人脉网络中的同事来分享，或在频道里公开征集演讲。这种形式非常适合早期采纳者——他们渴求公司各处同侪最新的知识与实验结果。这些演讲也是重要的人才来源：为项目提供实操支持、探索新方法，并扩充我们的内部讲师储备。

我们也在为每周例会尝试不同的形式。比如有一期关于 agent skill 的会，我们把技能对映到开发者旅程的各个环节（构思、设计、编码、测试、监控、运维、维护），以此推广我们的全公司 agent skill 市场。先请与会者补充自己团队做过的、可以补充全局集合的技能示例；然后按旅程环节分组讨论（breakout rooms），各组汇总"尚不存在的技能"的机会陈述。

### 有引导的实验

秉持有引导的创新（guided innovation）精神，我们在 hackathon 上取得了成功：由组织团队预先选定约 10 个题目。题目包含明确的目标、值得考虑什么的提示、哪些不在范围内，以及与其他小组存在哪些潜在协同。

这些题目在一场 2–3 天、开放报名的 hackathon 中被逐一攻克：4–6 人的小组在既定约束下尝试达成设定的目标。活动期间，范围和约束可以与引导者协商调整。

早期，这种方式让我们得以并行探索多条路径，再决定投资哪些工具。其中一个以此形式探索的题目，是按模板构建 MCP 服务器——它孕育了 Zalando 第一批由社区维护的 MCP 服务器。另一个小组则被明确要求不要看 MCP，而是探索面向 API 的通用方案：先在我们的 API 定义目录中搜索，再根据用户提示词生成 API 调用。这项尝试很成功，构建在我们的内部 API 目录之上——如今该目录本身也作为一个 MCP 工具对外暴露。它还暴露了 API 规格质量的缺口，例如缺失主机名导致无法生成能用的 API 调用。

我们也举办以业务单元为范围的 hackathon，团队围绕业务目标组队，以快速原型、锤炼 agentic 工程技能等为目标。

### 从 Labs 到培训

我们用一种称作 *GenAI Labs* 的形式在组织内分享知识。Lab 是约 20 人的线下工作坊，由 1–2 名讲师主持，时长 1–4 小时。在简短的主题介绍之后，与会者两两结对完成一组练习。较长的场次会在中场休息时做小组分享。某个主题的首场 Lab，我们会用简短的报名表按与会者过往的 agentic 工程经验预先分组。这带来了时间上高效的探索：3 天之内我们能在多个办公地点开 6 场，覆盖约 120–150 名参与者。

打算更频繁举办的 Lab 场次会被转化为月度培训。讲师从此前 Lab 的学员中招募。讲师会根据学员反馈打磨内容。负责内部培训的 Tech Academy 团队协助组织引导，照看学员与讲师的体验。

我们每月固定开两场培训：使用 MCP 服务器，以及用 pydantic-ai 构建 agent。前者帮助所有人建立对 MCP 概念的认识，并推广我们的内部 MCP 服务器集合；后者讲解工具调用与 agent 循环的基本概念，让学员从原理上理解他们日常使用的 agent 到底是怎么运作的。我们打算在 agent 培训里加入 prompt caching 的教学，并新增几门课：使用 coding agent、agent skills，以及构建 agentic 循环。这三门课我们已在[年度工程大会](https://engineering.zalando.com/posts/2024/06/hosting-an-internal-engineering-conference.html)的工作坊里试讲过，验证了需求。

关于培训还有一条重要的指导原则：既然培训的目的是习得新技能，就要明确告知学员何时需要手写代码。我们观察到，参与者用 coding agent 抄近道出结果的诱惑非常大。然而，使用 coding agent 通常会抑制学习。

## 迈向下一个层级

放眼业界，许多 AI 战果和 PR 吞吐量的提升都来自杠杆效应最高的 monorepo。我们虽有若干 monorepo，但微服务大都采用独立仓库。我们将实现一个扫描器来评估每个仓库的 AI 就绪度（AI readiness），从而分析交付姿态与代码库健康度之间的关联。就绪度评估还有个不错的副作用：整体代码质量的提升，以及那些原本因 ROI（投资回报率）不足而不会被落实的工程最佳实践得到推广。

为了管理微服务舰队，我们有一个工具，可以定义在一组仓库上批量执行的变换（transformation）。这些变换如今已包含基于 AI 的调整——对代码库运行 coding agent CLI。在改进和标准化代码库的过程中，我们预计这个功能的使用量将显著增长。

## 接下来是什么？

和业内所有人一样，我们观察到 AI 会放大组织里好的和坏的实践。被 agentic 工程冲昏头脑的团队，最终会产出让评审者望而却步的大 PR，拖慢交付，直到团队调整自己的实践。

我们也确实看到平台投资在获得回报。我们的 Zalando web monorepo 会为每个 PR 建立一套接入真实数据的部署。这个机制如今不仅赋能了 agent，也赋能了非工程师——他们可以用提示词发起修改并轻松查看结果，然后再请工程师接手。其他前端团队也纷纷实现了类似的机制。我们的内部文档托管被用来安全地托管静态网站形式的应用与原型。在 coding agent 的加持下，工程师们发布了各种仪表盘、演示、数据可视化工具、带客户端逻辑的应用等等。为了让搭建原型更容易，我们将把这一流程向非工程师开放——今天他们还被要求从建仓库开始，而他们的需求通常只是把跑在 localhost 上的原型分享给同事。这方面我们受到了 [Shopify Quick](https://shopify.engineering/quick) 的启发。

和其他所有科技公司一样，我们也在构建一个 agent 平台。它旨在让团队轻松定义和部署 agent，而无需自行操心沙箱问题。我们用开源组件来组装这个平台，例如用 [kagent](https://kagent.dev/) 处理 agent 在 Kubernetes 上的运行时。我们还在构建一个 Identity Broker 组件：捕获 on-behalf-of（代表用户）流程中的委托链、在不同 OAuth2 基础设施之间做中介，并实现一个 token 保险库。它的设计定位是被基础设施网关使用，处在 agent 与 MCP 服务器之间、或 agent 与 agent 之间的调用路径上。我们的目标是同时简化 agent 与 MCP 服务器的开发，把 agentic 系统中最难的认证与授权问题在一处集中解决。我们的同事将在 2026 年 9 月 18 日于阿姆斯特丹举行的 [AGNTCon + MCPCon Europe](https://sched.co/2RBAI) 上分享更多关于 Identity Broker 的内容。

我们还有一长串待解决的问题，比如：管理用户设备上的工具与配置（或者把本地环境彻底搬上云端）、本地沙箱，以及跨模型（含开放权重模型）的自动路由——用户很少主动切换模型，除非被限额或报错推了一把。如果你所在的是一个正在攻克类似问题的非供应商工程团队，并且本文分享的经验让你感到似曾相识，欢迎联系我们。

---

*我们在招人！你喜欢在 Zalando 这样不断演进的组织中工作吗？欢迎加入我们，成为一名[机器学习工程师](https://jobs.zalando.com/en/jobs?category=Software+Engineering+-+Machine+Learning&utm_source=eng_blog&utm_content=agentic-engineering-at-zalando)！*
