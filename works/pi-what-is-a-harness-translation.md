---
title: "什么是 Harness？"
sourceTitle: "What is a Harness?"
sourceUrl: "https://earendil.com/posts/what-is-a-harness/"
sourceAuthor: "Earendil Product（Pi 团队，rfc@earendil.com）"
sourcePublishedAt: "2026-08-20"
sourceSiteName: "Earendil"
summary: "Pi 团队（Earendil）的 harness 入门定义文：从攀岩安全带类比切入，给出 agent harness 的核心定义——为 AI 模型提供运行环境的软件层，并拆解其四大职能：系统提示词、工具、agentic loop 与模型翻译层。文章进而主张中立、开源、本地运行的 harness 是用户保住能动性、对冲 AI 实验室权力集中的工具，并点名 Claude Code 为第一个流行但非中立的 agent harness。"
sourceLanguage: "en"
language: "zh-CN"
translationMethod: "人工整理逐段翻译（cloud agent，对照原文全文）"
sourceFigureCount: 1
---

# 什么是 Harness？

> 原文：[What is a Harness?](https://earendil.com/posts/what-is-a-harness/) · Earendil Product（Pi 团队）· 2026-08-20

**Harness**——剑桥词典的定义

*名词。*一种带有绳带和束带的装备，用于控制或固定人、动物或物体。

*动词。*控制某物，通常是为了利用它的力量。

——

说到 harness，我首先想到的是中学时爬学校岩壁前系上的那套绳带和束带。我充其量算个平庸的攀岩者。

![Royal Robbins 在 El Capitan 上，他的 harness 上挂满了攀登所需的工具。](imgs/pi-what-is-a-harness/royal-robbins-el-capitan-climbing-05.png)

*Royal Robbins 在 El Capitan（酋长岩）上，他的 harness 上挂满了攀登所需的工具。摄影：[Tom Frost](https://www.frostworksclimbing.com/cool_aid.htm)。*

不过，如果你最近成天泡在 AI 资讯流里，你心目中 harness 的原型可能早已是 agent harness 了。那么，这篇文章不是写给你的。

这篇文章写给那些好奇 agent harness 是什么、却又不好意思开口问的人。

我们先回到攀岩。

去攀岩时为什么要系上安全带（harness）？首先，它支撑你、保护你的安全。它通过主锁和绳索把你连接起来，防止你坠落、调节你的节奏、约束你的路线。你还可以往 harness 上挂其他工具，比如粉袋、岩塞钩和快挂。

而当你去攀不同的山、走不同的线路时，你可以带着你的 harness 一起走。根据地形不同，你甚至可以改装你的 harness，调整装备环上挂什么。攀岩安全带是可适配的。杂技演员和树艺师也在用它。拥有它的人可以把它变成自己的东西。

攀岩 harness 与 agent harness 在结构和功能上都有相似之处。

## Agent Harness

有人（简化地）写过：Agent = Model + Harness。这里的 Harness 指的就是 Agent Harness。但 agent harness 到底是什么？Agent harness 利用 AI 模型来构造 AI 智能体，它的第一个应用场景是编程。如今，agent harness 已经位于各类 AI 智能体的核心，理解 agent harness 如何工作，就能帮你理解 AI 智能体是什么。

Agent harness 是一层软件，它为 AI 模型提供一个运行于其中的环境。与大多数 AI 模型不同，作为终端用户，你可以拥有属于自己的 agent harness。

通常，软件工程师这样的用户会通过电脑上的终端（Terminal）应用直接与 [Pi](https://pi.dev/) 这样的 harness 交互。但像 [OpenClaw](https://openclaw.ai/) 这样的 harness 也会使用不同的用户界面，比如 iMessage、聊天应用或电子邮件。我们的 harness [Lefos](https://www.lefos.com/about) 就主要以电子邮件方式交互。无论界面如何，harness 通常做四件事：第一，提供一组指令，帮助约束 AI 模型如何作答，这组指令通常称为"系统提示词"（system prompt）。第二，描述并提供一组工具，供 AI 模型在响应用户请求时调用。第三，harness 建立一个约束模型行为方式的框架。这个框架做很多不同的事情，其中最主要的一件是建立"agentic loop"（智能体循环）。最后，大多数 harness 还提供一个关键的翻译层，让 harness 能与各种不同的 AI 模型协同工作。

### 一、系统提示词

大多数 AI 模型自带一套在训练过程中打磨、沉淀下来的内嵌规则与准则。最著名的例子是 Claude Opus 4.5 那份被广泛传播的"[灵魂文档](https://gist.github.com/Richard-Weiss/efe157692991535403bd7e7fb20b6695)"（soul document），它向 AI 模型解释它是什么、应当如何行事。AI harness 中的系统提示词与之类似，但内嵌程度更低。它更像新员工入职第一天拿到的一份工作守则：员工尚未把这些指令内化，但知道在做这份工作时应当遵守。系统提示词会随每一次用户请求一起注入对话，对确保 AI 模型在该 harness 语境下行为得当起着重要作用。

### 二、工具

工具是一组用代码写成、模型可以"调用"的能力。Harness 既描述这些工具，也提供作为工具本体的软件。这些工具的例子可能包括：网页搜索工具、允许模型编写并执行软件代码的工具，或允许模型撰写电子邮件的工具。关键在于，harness 通常并不规定 AI 模型应当何时、如何使用工具。它只是把工具备好、描述清楚，让 AI 模型自己决定何时以及如何使用它们。

### 三、Agentic Loop（智能体循环）

现在，我们有了一个坐落于 agent harness 之中、手握一组指令和一组工具的 AI 模型。假设我们的 harness 是为电子邮件场景构建的，拥有上文描述的那些工具（WebSearch、WriteCode、ComposeEmail），而用户请智能体对比本地小学的排名和考试成绩并给出推荐。智能体会怎么做？首先，它会尝试理解这个请求（即"提示词"）。它会动用预训练和模型权重去理解什么是"小学"、"本地"指哪里、用户可能关心哪些排名。然后它会构造网页搜索查询去获取最新数据。拿到结果后它做什么？身处 harness 之中的 AI 模型可以对照最初的请求来审视这些结果。它可能判断第一次搜索没有取到正确的信息，或取得不够，于是自行决定再搜一次。这个基于自我评估而再次调用工具的决定，就是"循环"（loop）的第一个清晰示例。现在假设它已收集齐所有相关数据。AI 模型决定用"写代码"工具制作一张电子表格——毕竟所有电子表格本质上都是代码。它可以用这个工具做计算、排版结果，使其清晰易读。接着它把电子表格与最初的提示词对照。如果数据不能令它满意，它可能会"循环"回去再搜一轮。当它认定信息足够时，就调用 ComposeEmail——这个工具让 AI 回顾发现、加以总结、撰写邮件，并附上电子表格这样的附件。模型审视这份最终成果，判定任务完成。"agentic loop"就此闭合。几秒钟内，用户就会收到一封邮件：正文是摘要和推荐，附件是呈现调研结果的电子表格。想看看 agentic loop 在实践中长什么样，可以在[这里](https://pi.dev/session/#b23f2459599f8439327f65c90ee95d06)浏览一个 Pi 会话。

### 四、翻译层

翻译层让 harness 得以与不同的 AI 模型协同工作。在某些情况下，harness 甚至可能在同一个 agentic loop 中使用不同的模型，因为不同的 AI 模型可能各擅胜场。翻译层之所以是 harness 的关键一环，还因为它把控制权交到了终端用户手里。这意味着一个人可以带着自己的 AI harness，配 Anthropic 的模型用，配 OpenAI 的模型用，或者去尝试那些往往极具性价比（以单任务成本 cost-per-task 衡量）的开放权重模型。

这个翻译层帮助把权力和杠杆从 AI 实验室手中拿走，交到终端用户手里。如果人们能在自己的电脑上本地拥有并运行自己的 harness，就意味着他们保住了自己的能动性。意味着他们保有把工具变成自己的东西的自由，保有那些会话的本地副本——这些会话日积月累，将构成他们与机器之间的通信档案。通过与一个 harness 建立关系并使用它，而不是使用某个 AI 实验室发布的应用，用户保住了自由与选择。在上面的示例 harness 中，用户本可以把同一封邮件分别发给一个 OpenAI 的模型、一个 Anthropic 的模型和一个开放权重模型，然后比较结果、比较结果的成本，并把所有答案留存在同一个地方，而不是让三个答案分别躺在三个应用里。

## 把 Harness 变成你自己的

与 AI 模型本身不同，harness 是你可以拥有并改造的。就像攀岩安全带一样，你可以把它变成自己的东西。人们喜欢 Pi 正是因为这一点。Pi 是一个极简的 agent harness：系统提示词很短，工具集很小，开箱即用的设计原则是"不挡路"。但随着人们使用 Pi，他们会以适合自己的方式扩展它、塑造它。他们修改系统提示词，或者设计一个契合自己工作流的[扩展](https://pi.dev/packages)，然后把这些扩展分享给他人。Pi 用户之间已经互相分享了超过 5,000 个扩展。Pi 也是免费且开源的，它就住在你自己的笔记本电脑上。这意味着人们如今拥有了一件属于自己的、运行在自己硬件上的、让自己得以驾驭 AI 的工具。

## 中立的开源 Harness：能动性之器

Harness 并非一开始就是开源或中立的。第一个流行起来的 agent harness——Claude Code——并不是为了提供一个模型无关的 AI 翻译层而建，而是作为一个让你在本地电脑上用 Claude 模型编程的应用而建。此后，OpenClaw、OpenCode、Hermes、Pi 等自由开源 agent harness 令人欣喜地不断涌现。在 Earendil，我们把 Pi 打造为中立的 harness，为 Pi 用户提供能力上的选择与自由。我们也在探索如何把 harness 带来的益处与能动性推及更广泛的人群。

眼下，许多人担忧越来越庞大的 AI 公司的权力与影响力。其中一些人可能会选择彻底远离 AI。而我们 Earendil 相信，可以通过打造弥合分裂与无知、培育持久喜悦与理解的软件和开放协议，来增强人类的能动性。做到这一点，靠的不是无视今天已经存在的技术，而是以清醒的眼睛和坚定的手去驾驭（harness）它们——确保是我们挥动锤子，而不是锤子挥动我们。
