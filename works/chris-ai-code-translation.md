---
sourceTitle: "How I Use AI to Code"
sourceUrl: "https://chrismdp.com/coding-with-ai/"
sourceRequestedUrl: "https://www.chrismdp.com/coding-with-ai/"
sourceAuthor: "Chris Parsons"
sourceCoverImage: "https://chrismdp.com/assets/img/ai-coding-superbikes-motif.jpg"
sourceSiteName: "Chris Parsons"
sourcePublishedAt: null
sourceSummary: "If you are still tied to your IDE, whether Cursor or Copilot, you are working a year behind. Coding turned out to be AI’s home territory. The best tooling ha..."
sourceAdapter: "generic"
sourceCapturedAt: "2026-05-22T07:29:23.823Z"
sourceConversionMethod: "defuddle"
sourceKind: "generic/article"
sourceLanguage: "en-US"
title: "我是如何用 AI 写代码的"
summary: |-
  Chris Parsons 认为，2026 年的 AI 编码已经从 IDE 里的补全和对话，转向 Claude Code、Codex CLI 等命令行智能体 Harness。真正的分水岭不是会不会提示模型，而是能否把经验沉淀进 AGENTS.md、CLAUDE.md、Skills、验证循环和反馈机制，让团队的 AI 下周写出的代码比这周更好。
language: "zh-CN"
translationMethod: "baoyu-translate skill"
sourceFigureCount: 8
---

# 我是如何用 AI 写代码的

> **译者注：** 本文为忠实翻译，保留原作者 Chris Parsons 的全部观点与表述。文中大量 2026 年的产品时间线（如 Opus 4.5 发布节点）、市场数据（a16z 企业 AI 采用比例）与研究结论（"AI 让交付慢 20%"、Greenblatt 的 serial speed-up ≈1.6x 等）均来自原文及其脚注所引来源，**译者未独立核实**，请读者循脚注链接自行查证。其中"慢 20%"一项原作者归因于 MIT，与社区常引的 METR RCT 实验（客观慢约 19%）口径相近但出处不同，引用时请注意区分。

如果你仍然被 IDE 绑住，无论是 Cursor 还是 Copilot，你的工作方式都落后了一年。编码已经证明自己是 AI 的主场。最好的工具已经从编辑器里走出来，进入了命令行；资深工程师的工作也不再是审查 AI 的输出，而是训练 AI。

我在 2025 年 3 月写过[这篇文章的上一版](https://www.chrismdp.com/coding-with-ai-march-2025/)，8 月又更新过一次。此后，我几乎所有关于 AI 工程的文章都会链接到它。那篇文章里的基本原则仍然成立：保持改动小，建立护栏，毫不吝惜地写文档，并确保每次变更在发布前都经过验证。唯一必须随着吞吐量一起变化的是“验证”的含义。过去，“已验证”意味着“你亲自读过”。在现代智能体的吞吐量下，它必须意味着“已经由测试、类型检查器、自动化门禁检查过，或者在真正需要你判断力的地方由你检查过”。检查仍然会发生，只是不总是在你的脑子里发生。

过去一年里，一个区分变得越来越清晰，而且它对后文很重要：Vibe Coding 和智能体化工程是两种不同的实践。Vibe Coding 是你其实并不真正检查结果，只是看看输出；只要你不把它发到生产环境，这没问题。智能体化工程是另一回事。它不是说你要读每一个 diff，而是说你要有分寸地判断哪些 diff 需要你的眼睛，哪些不需要。我通常会快速扫 UI diff，但会认真阅读安全和数据库相关 diff。

这种判断，也就是把注意力花在哪里，本身就是一项资深技能，而且值得刻意练习。每个 diff 仍然会被检查，只是不总是由你检查。测试、类型检查器和自动化门禁会接住其余部分，而你是在训练智能体，让真正来到你眼前的 diff 都是值得你投入注意力的 diff。把这两件事混为一谈，才会让人把 Vibe Coding 出来的东西发进生产环境，然后被现实烫伤。

## 编码原来是 AI 的主场

[![漫画标题为“我迟早会做的事”：一块板上贴满便签，全部被划掉。开发者看着拿着笔的 AI 机器人说：“等等……这些全是你做的？！”机器人微笑着。](https://www.chrismdp.com/assets/img/things-ill-get-to-eventually.jpg)](https://www.chrismdp.com/assets/img/things-ill-get-to-eventually.jpg)

a16z 在 2026 年 4 月对 Fortune 500 和 Global 2000 合同的分析，确认了我们大多数人在工作内部已经感受到的事实：编码是企业 AI 中占主导地位的用例，领先程度接近一个数量级 [^1]。Cursor 的增长、Claude Code 的爬坡、Codex 的采用数字，所有这些都超出了 2024 年最乐观的预测。

这些增长数字确认了采用已经落在编码上，但并不证明端到端吞吐量也同步提高。[很多组织发现自己的编码团队变快了，但业务并没有变快](https://www.chrismdp.com/why-ai-fast-teams-still-ship-slowly/)，这正是 Goldratt 约束理论在起作用：加速一个原本不是瓶颈的环节，队列就会在其他地方堆起来。采用数据证明了转变，不证明生产力。

对认真做这件事的人来说，体感版本是：那些你拖了好几年的 backlog，突然变得可以处理了。我一直告诉自己“迟早会做”的事，现在已经做完了。能力确实迈上了一个台阶。在所有保留意见到来之前，值得先停一下，感受你现在一周能构建的东西，比一年前多出了多少。

如果一定要我指出那个时刻，我会说是 2025 年 11 月下旬：Claude Opus 4.5 与 Anthropic 那篇关于长期运行智能体的文章一起出现，我之前一直手工苦磨的事情开始自己跑起来。一年前，大约在 2024 年末，Cursor 的 agent mode 对 IDE 这一代工具也做过同样的事。这两个时刻形状相同：能力跨过阈值，然后工具链在接下来的几周跟上来，其他人开始弄明白该拿它做什么。如果你对 AI 编码能力的校准还停留在 2025 年 11 月之前，那已经过时了。

原因是机械性的，不是文化性的。代码信息密度高、精确、基于文本，最重要的是可验证。你可以运行它，并知道它是否有效。这给模型提供了紧密的反馈循环来改进，也给人类提供了紧密的反馈循环来建立信任。Andrej Karpathy 敦促我们把智能体拴在短绳上：许多小的“生成-验证”循环，每一轮里开发者先读并接受 diff，然后下一轮才在它之上继续构建 [^2]。下游的一切，Harness、智能体循环、Skills 生态，都是在“可验证”这个属性之上复利增长。

## 2026 年的工具链

对今天刚起步的合格开发者，诚实建议是：安装 [Claude Code](https://claude.com/claude-code) 或 Codex CLI，而不是 Copilot。两者之间的选择现在很大程度上是个人偏好；它们都运行当前的前沿模型，Pi [^3] 和其他严肃的 Harness 也都能很好地配合最新 Claude 或 Codex 模型。其他组合都会感觉落后一两步。Cursor 是 2025 年 3 月的正确答案，我当时也推荐它。到 2025 年 5 月，我转向 Claude Code，并一直用到现在；但今天开始的开发者完全可以合理地选择其中任意一个，而且都在正确区域里。原因在 Harness，而不是模型。底层用 Opus 的 GitHub Copilot 也不会产出 Claude Code 的结果，因为包在每次请求外面的东西至少和模型本身一样重要。文件如何切分，上下文如何选择，智能体循环如何组织，CLAUDE.md 如何优先于任意文档，这些都是 Harness 决策，而且会复利。

当然，这个建议不可能适用于每个采购部门。很多组织被去年买下的 Copilot 席位锁住，被合规姿态拖进六个月的新供应商引入流程，或者有托管要求，导致商业 CLI 完全不可用。如果你处在这种情况里，请把下文读成“应该瞄准的方向”，而不是“周五前安装这个”。原则是可迁移的：Harness 比模型更重要，AGENTS.md 和 skill files 可以配合任何 agent CLI，reset 纪律与工具无关。2026 年，能把任何东西推进采购流程，本身就是一项资深技能！

开源模型可以跟上，但你得下功夫，而且它们需要一个干净的代码库才能发光。相比 Claude 或 Codex，你应该预期在 Harness 上花更多时间，在提示词上花更少时间；也要预期“智能体做错了”和“智能体不再这样做错”之间的反馈循环会更长。对有动力也有耐心的团队来说值得投入，但我不会建议新人从这里开始。

在这个 Harness 之上，有三个实用组成部分。

**AGENTS.md 或 CLAUDE.md 里的黄金规则。** 这些是智能体在某个文件夹里开始每个会话时读取的常驻指令。Claude Code、Codex CLI 和 Cursor 现在都会读取这两个文件名，所以我保留一个文件，再把另一个做成符号链接，它们就都会读到同一套规则。我让这个文件保持短小、具体，并持续精炼。每次有意义的变更之后，我都会让智能体根据“如果一开始知道就好了”的内容更新它。一年下来，这种复利效应是我提升代码质量的最大杠杆。

**Skill files。** `.claude/skills/` 里的一个 [skill file](https://www.chrismdp.com/skills-are-claude-codes-secret-weapon/) 介于严格规则和背景文档之间。AGENTS.md 或 CLAUDE.md 中的规则会在每个会话开始时加载，理论上总会被遵守；实践中遵守程度取决于 Harness。但它们仍然比你交给智能体的其他任何东西权重更高，这迫使它们保持简短。`docs/` 下的文档可以装很多内容，但关键时刻很少会被读到。Skills 会在工作需要时被拉进来，而且可以容纳比规则多得多的细节。你的编码约定、API 规则和测试标准就属于这个甜点区，Claude 也可以在学到新东西时更新它们。我现在在各个项目里运行将近 70 个这样的 Skills。有少数是公开的；如果你想找一个起步形状，可以看 [airskills.ai/chrismdp](https://airskills.ai/chrismdp)。

**一个可携带的 vault。** 所有这些都以 Markdown 形式存在，[放在自己的仓库里](https://www.chrismdp.com/build-an-ai-knowledge-base-from-scratch/)，与任何单一项目分开。它保存了那些本来会碎片化散落在十几个项目仓库里的上下文：概念笔记、决策轨迹、人物、先前思考、运行中的项目状态。Skills 可以直接调用它，所以一个代码库里的智能体可以拉取我写下或捕获的关于这个问题空间的一切，而不必把这些知识放进代码仓库本身。工具无关的 Markdown，是面对工具比工作流变化更快的世界时的一种对冲。关于上下文窗口、如何组织 brief、何时 reset 的结晶化知识，会坚持多年；关于某个具体工具键盘快捷键的流动知识不会。投资前者，不要投资后者。

## 从批准者到训练者

我最希望工程领导者带走的单一转变是：你们最资深的工程师应该训练 AI 写出更好的代码，而不是自己写代码，或者手工审查每一个 diff。

[![漫画：一个开心的机器人把一大股 PR 纸张冲向坐在“CODE REVIEW”桌前、筋疲力尽的开发者，并说：“如果你愿意，我还可以更快。”PR 纸张铺满地面。](https://www.chrismdp.com/assets/img/code-review-is-dying-comic.jpg)](https://www.chrismdp.com/assets/img/code-review-is-dying-comic.jpg)

我们原本正走向这样一个未来：人类坐在十个智能体组成的流水线末端，盖章批准那些自己没写、也几乎不理解的 diff。那不是职业生涯，那是 Cory Doctorow 所说的反向半人马：人类成了生成真实工作的机器上的有机附肢 [^4]。我见过太多团队，资深工程师正在悄悄变成房间里最慢、最疲惫的人，[被生成速度超过阅读速度的 PR 埋起来](https://www.chrismdp.com/code-review-is-dying/)。

请把资深智能体化工程师和基础 AI 提示者区分开：

1. **察觉智能体什么时候走偏了**，往往在它变成 diff 里的明显问题前三个 prompt 就能看出来。这种模式识别来自真实工作，不是一个下午就能教会的东西。
2. **把教训提取到正确的位置。** 项目特定规则属于这个仓库的 CLAUDE.md。通用规则应该重构成 skill file，并在各处复用。
3. **把未来智能体需要的规则和模式编码下来**，变成 skill files。今天的一次临时修复，会变成明天的 skill file；再往后，它就是每个未来会话的常驻指令。Harness 变得更聪明，是因为你把教训放到了一个耐久的位置。
4. **教别人如何与 AI 一起工作。** 这种纪律不会通过耳濡目染自动传播。如果你已经找到了节奏，你最值得投入时间的事，就是坐在还没找到节奏的同事旁边一起做。

围绕你的代码库训练 Harness，现在和为代码库创建良好架构一样重要。两者都会影响未来的每一个决策；两者拖得越久都越难改；两者都是一个团队干净交付、另一个团队陷在返工里的安静原因。

过去我期待资深程序员删除的代码多于写下的代码。现在我期待资深程序员添加的 Skills 和规则文件多于代码。

我们过去把这叫品味。它现在仍然是品味，只是这种品味不再锁在一个人的脑袋里，而是复利进入 Harness。衡量一个好资深工程师的标准，现在是：因为他们留下的 Markdown，他们团队的 AI 下周写出的代码是否比这周更好。

## Harness 胜过 Prompt

[![三格漫画。第 1 天：经理告诉智能体“就用 PostgreSQL”，然后放松。六个月后，同一个经理淹没在一队智能体的问题中：“用 tab 还是空格？”与此同时，另一个团队给自己的智能体一本“我们如何做决策”的书，工作得很愉快。](https://www.chrismdp.com/assets/img/treat-agent-blocks-as-context-failures.jpg)](https://www.chrismdp.com/assets/img/treat-agent-blocks-as-context-failures.jpg)

刚起步的团队通常会问我某种版本的“我该怎么开始给 AI 写 prompt？”他们中很多人来时已经半信半疑地觉得自己首先需要规格驱动开发，因为他们听说那才是正确入口。我并不喜欢它，至少不喜欢它通常出现的那种形式，稍后我会解释原因。

当一个智能体卡在本该微不足道的事情上时，把它视为上下文失败，而不是 prompt 失败。答案在请求周围的 Harness 里，不在于重新措辞你问了什么。早早意识到这一点的团队，会停止和 prompt 较劲，转而投资 CLAUDE.md、skill files，以及智能体需要独立做决策时所需的一小套决策本体。

一个好的 Harness 有四样东西。CLAUDE.md 中一组清晰的**常驻指令**。一组既能执行规则、又能在智能体需要时拉入额外上下文的 **skill files**。一个智能体可以对自己运行的**验证循环**，无论它是测试、类型检查器、linter，还是一个点击应用的无头浏览器。还有一个**反馈循环**，在智能体犯错时把教训喂回前三者。没有反馈循环，脚手架会腐化，Rahul Garg 在 Martin Fowler 网站上那篇反馈飞轮文章里很好地描述了这一点 [^5]。

一旦 Harness 就位，prompt 本身几乎可以无聊。大多数时候，我只需要说类似这样的话：“这里有几个文件可以看，我大概想要这个，剩下的你自己弄明白。”智能体知道约定，会伸手拿正确的工具，并验证自己的工作。这时，AI 编码开始感觉像你想要的学徒，而不是那个你总要返工的、自信但错误的实习生。

有一个具体模式一夜之间改变了我的可靠性：在要求任何新东西之前，先问代码库这东西是否已经存在。AI 已经把这个问题的成本降到近乎为零。我最近一次培训中，有个开发者就在这件事上用三十秒省下了三周估算时间，因为他以为必须构建的功能，其实已经在代码库里了，只是在一次旧重构中被注释掉。先发现，再生成。

## 规格化问题，而不是解决方案

[![两个机器人建筑工站在悬崖边，其中一个在半截悬索桥旁说：“抱歉，另一头到底在哪？”漫画：Spec the problem, not the solution.](https://www.chrismdp.com/assets/img/spec-the-problem-not-the-solution.jpg)](https://www.chrismdp.com/assets/img/spec-the-problem-not-the-solution.jpg)

这就回到了规格驱动开发。它是我最常看到团队采用的模式，也是我最常反对的模式。它的想法是，在 AI 写下一行代码之前，先把一切都预先规格化：每个 endpoint、每个 schema、每个 flow。2025 年 3 月，我自己也曾把人们往更多前置规格的方向推。现在我想收回这点。

几个月的 [Ralph 循环](https://www.chrismdp.com/ralph-loops-aie-europe/)改变了我的看法。如果你预先规格化解决方案，你就是把所有思考都前置，好让机器可以无人监督地运行。这在 1986 年叫瀑布式开发，当时也没成功。你提前钉死的东西越多，现实发生变化时计划破裂的位置就越多，而现实总会变化。

[![两格漫画。1986 年：经理们把一大摞 REQUIREMENTS 堆给压力巨大的软件开发者。2026 年：同样的经理们把一大摞 AGENT SPECIFICATIONS 堆给黑暗工厂里的机器人。错误重复上演。](https://www.chrismdp.com/assets/img/dark-factories-specify-everything-upfront.jpg)](https://www.chrismdp.com/assets/img/dark-factories-specify-everything-upfront.jpg)

新鲜之处在于，这个瀑布式错误有了新的外衣。“黑暗工厂”式软件开发承诺：自主智能体并行运行在一队你一次性完美写好的规格上。每个跃迁到更自主智能体的团队都会撞上这个问题。一旦学会看见它的形状，你会到处发现它：在人们给智能体纠错时打下的循环里，在他们从来没告诉模型如何思考问题时提出的含糊问题里。失败总是比人们以为的更早发生。它很少是模型问题，几乎总是输入问题。

正确动作是规格化问题，而不是解决方案。问题是稳定的，需要被正确理解。解决方案在一开始是未知的，应该随着智能体学习而演化。把问题描述得足够清楚，让智能体可以在不丢失目标的情况下迭代解决方案；然后给它一个反馈循环，让它能判断自己是否解决了问题。

实践中，这意味着 brief 要说明约束、用户、系统现有形状，以及什么标准会让一次改动算得上好，同时把实现决策留开放。“我们需要给每次写操作做审计日志，能按用户搜索，保留七年，并且不能拖慢热路径”，这给了智能体足够信息，让它提出设计、反驳你显而易见的第一个想法，并带回两三个它能自圆其说的选项。“添加一张名为 audit_log 的 Postgres 表，包含这八列和这个索引”则不会。第一个版本让机器参与思考。第二个版本让它做你的速记员。

不要盲目使用 Ralph 循环或智能体流水线。[我本月早些时候在 AI Engineer Europe workshop 上更详细地讲过这个问题](https://www.chrismdp.com/ralph-loops-aie-europe/)。要么一起弄清楚应该构建什么，要么给智能体足够上下文，让它自己做出好决策。可行的是这两种模式。陷阱是两者都不做：过早写下太多细节，把它交给机器，然后假设这些细节会承载思考。它不会。

## 上下文甜点区

[![一张图表展示输出质量随上下文数量变化的曲线。上下文太少时（没有上下文、缺少关键细节），得到的是泛泛的垃圾输出。Full spec 位于曲线顶端的甜点区。把你拥有的一切都塞进去时，质量会随着模型淹没在噪声里而急剧下降。](https://www.chrismdp.com/assets/img/context-sweet-spot.png)](https://www.chrismdp.com/assets/img/context-sweet-spot.png)

知道什么时候 reset，其实是一项早期且重要的技能，是位于上述四项技能之下的一种具体平衡。输出质量和上下文之间是一条曲线。太少，你会得到泛泛的垃圾输出。太多，模型会淹没在被喂进去的东西里，输出同时变得更含糊、更自信。完整规格，加上正确的关键细节，并且没有多余内容，这就是甜点区。

Claude Code 和当前这一代 Harness 比一年前更不需要频繁 reset。不过，这种纪律仍然重要；当你转向更便宜或开源的 Harness，而模型不那么宽容时，它会更加重要。学会感受这条曲线是可迁移的，即使今天某个具体 Harness 已经替你吸收了大部分工作。

做了一段时间的人都知道自己何时偏离了峰值：二十分钟前还正常工作的函数被第三次无用重构；智能体兴高采烈地用不同说法重复同一个错误假设；你开始隐约觉得被牵着兜圈子。正确动作是停下，扔掉这段对话，用更干净的 brief 和更小的块重新开始。智能体不会疲惫，也不会尴尬，所以你也不用。Reset 几乎每次都比纠正便宜。

研究已经确认了从业者每天感受到的事情：LLM 在多轮对话中的表现显著差于单轮对话，而且一旦走错路，往往会继续迷路 [^6]。这一结构性属性在更便宜和开源的模型上更强，而未来一年越来越多编码工作会运行在这些模型上。学会感受这条曲线，比掌握任何特定 Harness 的具体行为更可迁移。

## 反馈是新的瓶颈

一旦循环跑起来，智能体开始产出，约束就会移动。一年前，瓶颈是代码生成。现在瓶颈是[验证](https://www.chrismdp.com/feedback-is-the-new-bottleneck/)：你能多快判断生成出来的东西是正确的？

不时髦的答案是基本功。自动化测试、持续交付、基础设施即代码、linting、类型检查，所有这些都是 2015 年你本来就应该拥有的东西。没有它们，智能体就没有办法在明显失败时停下来，你就又回到了靠眼睛批准 diff 的状态，而这正是 AI 本该消除的工作。那些保持 CI pipeline 敏锐的团队在 2026 年飞快前进；那些没有这么做的团队，则卡在给智能体上一次生成的东西盖章批准里。如果有人告诉你基本功已经过时，他是在卖你东西。

一个团队如果能在一下午生成五种方案并验证全部五种，就会超过另一个生成一种方案、然后等一周反馈的团队。现在的游戏不再是“我们构建得有多快”，而是“我们能多快判断这是否正确”。这改变了投资方向。构建更好的 review surface，而不是更好的 prompt。在可以的时候，让智能体先对真实环境进行验证，再请求人类，从而让反馈变得不必要；在不能的时候，让反馈变成即时的。MIT 测得开发者认为自己用 AI 快了 20%，但交付实际慢了 20% [^7]，这正是反馈瓶颈体现在数字上。编码本身无疑更快了。编码周围的一切，审查、验证、集成、智能体出错后的返工，都可测量地变慢了；开发者并不把那部分算作“慢的部分”，因为编码感觉如此快速。慢工作最终吞没了快工作。

我在[别处写过更多](https://www.chrismdp.com/feedback-is-the-new-bottleneck/)，但对编码来说，简短版本是：如果验证一项 AI 生成的变更几乎和你自己写它一样耗时，那么要么智能体输出需要以不同方式呈现，要么验证需要移动到自动化门禁，要么这个具体任务本来就不该被委派。

## 仍然会出错的地方

[![漫画：四名工程师坐在一艘小木船里，漂浮在碎片中，一道标着“CLOUD AGENTS”的巨浪在他们身后卷起。其中一名工程师说：“幸好结束了。”但巨浪正在逼近。](https://www.chrismdp.com/assets/img/your-engineers-think-theyve-survived-ai.jpg)](https://www.chrismdp.com/assets/img/your-engineers-think-theyve-survived-ai.jpg)

**意外的 Vibe Coding** 仍然是刚起步团队的主要失败模式。安装 Claude Code，给它宽泛指令，让它运行，然后把出来的东西发掉。它看起来很快，直到撞上生产环境。如果你的代码库是一团没有测试的意大利面，AI 只会更快地产生更多意大利面。你的护栏现在更重要，不是更不重要。

第二种失败模式是**审查疲劳**。质量直觉强的团队会最先耗尽最尽责的审查者，因为他们是那些读完一切、而不是扫一眼的人。如果你的资深工程师整天都在批准 diff，你就已经在结构上建出了“审查批准猴”这份工作，而且应该预期人们会离开它。修复几乎总是在上游：为 review 中反复浮现的问题写 skill files，这样大多数 diff 就不再需要人眼。

第三种是**隐形依赖**。你的 AI 正在悄悄做一些你没有要求它做的事：注意异常，校对数字，二次判断含糊表述。下一代模型发布时，其中一些隐藏依赖会毫无预警地断掉，而你的 playbook 里没有任何东西提醒你它们曾经存在。升级前，审计你的 AI 在明确请求之外做了什么，不要只审计那些你显式要求的东西。

第四种是**过早松一口气**。如果你已经熬过了第一波基于 IDE 的 AI 编码，并且团队正在使用 Claude Code 或 Codex，不要以为调整已经结束。云端智能体和自主编排，是 2025 年末那次能力跃迁所释放出的下一波浪潮，而且每一波的生存策略都不一样。一年前觉得“幸好结束了”的团队，往往正是现在最挣扎的团队。

## 训练下一代

[![漫画：一个紧张的软件工程师站在舞台上，手里拿着一把标着 Claude Code、价格为 1,999.99 美元的吉他。侧幕里的舞台工作人员低声说：“直接弹！”观众在黑暗中等待。](https://www.chrismdp.com/assets/img/practice-with-your-team-not-just-licences.jpg)](https://www.chrismdp.com/assets/img/practice-with-your-team-not-just-licences.jpg)

今年我最常被问到、也仍然没有完全回答的问题是：当传统的“手写越来越复杂的代码”这条阶梯正在消失，我们如何培养下一代资深工程师？

一年之后，我对答案的一部分更清楚了。和初级工程师结对，向他们展示你如何与 AI 一起工作，是你时间的最佳用途。坐在他们旁边，让他们驾驶 Claude Code，并教他们何时 reset、CLAUDE.md 里应该放什么、何时把一条教训提升成 skill file、如何规格化问题而不是解决方案、如何感受上下文甜点区。他们具体产出的代码没有那么重要；重要的是他们建立起这些直觉：智能体什么时候快要走错，以及走错时该怎么办。

购买 licence 不等于一起练习。把一款昂贵工具塞进未经训练的工程师手里，还让他站在真实 deadline 的聚光灯下，产生的正是你会预期的怯场。投资结对、内部培训和安全环境中明确练习的团队，会超过那些买了席位然后寄希望于自然发生的团队。Licence 很便宜，练习才是价值所在。

第二部分是：现在最重要的技能，恰恰是传统职业路径里最晚才出现的那些技能：架构品味，知道何时丢弃工作，识别需求何时没有被充分说明，找到问题中真正起作用的部分。如果初级工程师能更早发展这些能力，他们会更快变成资深。如果不能，AI 会在他们过去靠来谋生的那些部分上无限期地超过他们。

这就是我在 [AI training for engineering teams](https://www.chrismdp.com/training/) 中教授的内容：结对形状、直觉，以及有意识地执行 skill-file 纪律，而不是靠偶然摸索。

## 下一步做什么

如果你在 2026 年 4 月从零开始：

**安装 Claude Code 或 Codex CLI**，并在一个你已经熟悉的仓库里运行它。写一个简短的 AGENTS.md，记录这个仓库的约定，以及一个新工程师第一天会想知道的事情。用它交付一个小改动，阅读 diff，并记下它让你意外的地方。那就是你的第一个 skill file。

**每周交付一个 skill file。** 选择一个反复出现的烦恼，一个智能体不断漏掉的约定，一个代码库里的坑，一个你已经写过三次的 review comment，把它写进 `.claude/skills/`。随着智能体使用它，不断迭代。月底你应该有十个，Harness 会明显因此变聪明。

**开始和领先你几步的同事结对。** 看他们如何 reset。看他们如何捕捉漂移。看他们选择不委派什么。大多数值得学习的东西，都藏在博客文章里不会出现的小判断里。

**自动化一个每周循环。** 选择一件你每周手工做的事：每周 release notes、backlog grooming、重复性的 code review pass，然后把它写成一个 skill 加一个 Ralph 风格的循环。第一次不必完全自主。目标是让反馈循环跑起来，这样下周你可以改进它。

**写在 Markdown 里**，不要写在某个工具里。工具会变，你的笔记应该比它们活得更久。

如果你是一名资深工程师，担心自己的工作正在悄悄变成批准 diff：是的，确实如此。出路是训练 AI，让 diff 第一次就正确；让自己成为团队中塑造 Harness 的人，并让这项工作成为你被衡量的可见成果。这种角色会复利，而审查不会。

## 结论

2025 年 3 月那篇文章的核心论点没有改变。使用 AI 编写生产代码，会放大人类判断，而不是取代它。改变的是这种判断被用在什么地方。真正带来回报的工作，是塑造 Harness、训练智能体、构建反馈循环，让接下来一百个 diff 比上一个更好，而不是逐个审查每一个 diff。

用 AI 编码现在已经是默认。问题是：你是在以审查者、提示者，还是训练者的身份做这件事。训练者角色会复利。你留下 Markdown、CLAUDE.md、一组 skill files，以及智能体可以用来验证自己的测试，让每一个未来 diff 都变得更好。另外两个角色会收缩。相应地选择。

感谢 Rob Bowley 和 Willem van den Ende 对本文早期版本的反馈。

[^1]: Kimberly Tan, [Where Enterprise AI is Actually Working](https://www.a16z.news/p/ai-adoption-by-the-numbers), a16z, 2026 年 4 月。Fortune 500 中 29%、Global 2000 中约 19% 已经是领先 AI 初创公司的活跃付费客户。编码以接近一个数量级的优势占据主导，因为它可验证、文本密集，并且有紧密反馈循环。

[^2]: Andrej Karpathy, [Software in the Era of AI](https://www.youtube.com/watch?v=LCEmiRjPEtQ), YC AI Startup School, 2025。“我总是害怕 diff 变得太大。我总是按小的增量块推进。我想确保一切都没问题。我想非常非常快地转动这个循环。”循环频率比循环大小更重要。

[^3]: [Pi](https://pi.dev/) 是 Mario Zechner 制作的一个极简、可高度定制的编码 Harness，适用于任何模型。它也驱动 OpenClaw，所以当我想看清活动部件，而不是把它们藏在一个打磨精致的 CLI 后面时，我会在这个抽象层级上使用它。

[^4]: Cory Doctorow, [Revenge of the Chef](https://pluralistic.net/2022/04/17/revenge-of-the-chef/#boss-babbage), Pluralistic, 2022 年 4 月。“反向半人马”这个框架指的是：人类被拴在机器的节奏上，成为有机附肢，而不是让机器成为人类的放大器。

[^5]: Rahul Garg, [The Feedback Flywheel](https://martinfowler.com/articles/reduce-friction-ai/feedback-flywheel.html), martinfowler.com。文章认为，AI 辅助工程中的持久杠杆来自把学到的教训喂回脚手架（CLAUDE.md、skill files、测试），而不是在对话中逐个修复每次失败。

[^6]: Laban, P., Hayashi, H., Zhou, Y., & Neville, J. (2025). [LLMs Get Lost In Multi-Turn Conversation](https://arxiv.org/abs/2505.06120). arXiv:2505.06120。模型在多轮对话中的表现显著差于单轮对话，而且一旦走错路，往往会继续迷路。

[^7]: 20% 变慢这一发现归因于 MIT 在 2024/2025 年的一项研究，并在 2026 年 3 月 CTO Craft Con 上由两场独立演讲相互印证；这两场演讲衡量的是端到端交付，而不是自我报告的速度：[Will Lytle (Plandek)](https://plandek.com/) 和 [Yigit Darcin (Trendyol)](https://trendyol.com/)。两者都观察到，尽管工程师报告自己感觉更快，团队交付却大约慢了 20%，开销落在 code review 队列、测试覆盖缺口、需求含糊和部署 pipeline 上。Redwood Research 的 Ryan Greenblatt 提供了一个互补框架：不要衡量感知到的加速，而是衡量“serial speed-up”，也就是如果失去 AI 工具，你需要工作得多快才会无差别。他估计 2026 年 4 月 Anthropic/OpenAI 的这个数字约为 1.6x，而人们通常感知到的是 3x 到 20x。这个差距就是反馈瓶颈。
