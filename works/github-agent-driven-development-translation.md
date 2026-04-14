---
sourceTitle: "Agent-driven development in Copilot Applied Science - The GitHub Blog"
sourceUrl: "https://github.blog/ai-and-ml/github-copilot/agent-driven-development-in-copilot-applied-science/"
sourceAuthor: "Tyler McGoffin"
sourceCoverImage: "https://github.blog/wp-content/uploads/2026/01/generic-mona-copilot-logo.png?fit=1920%2C1080"
sourceSiteName: "The GitHub Blog"
sourcePublishedAt: "2026-03-31"
sourceSummary: "I used coding agents to build agents that automated part of my job. Here's what I learned about working better with coding agents."
sourceLanguage: "en-US"
sourceCapturedAt: "2026-04-14T05:34:08.431Z"
title: "Copilot 应用科学团队的智能体驱动开发"
summary: "我用编码智能体构建了能自动完成部分工作的智能体。以下是我在与编码智能体协作过程中学到的经验。"
language: "zh-CN"
translatedAt: "2026-04-14"
---

# Copilot 应用科学团队的智能体驱动开发

我可能刚刚通过自动化，把自己推进了一份完全不同的工作……

这对软件工程师来说再熟悉不过了——出于灵感、沮丧，有时甚至是偷懒，我们构建系统来消除重复劳动（toil），把精力集中在更有创造性的工作上。到头来，我们反而要去维护这些系统，同时也让身边的人享受到了自动化带来的便利。

作为一名 AI 研究员，我最近把这件事推进到了前所未有的程度——我自动化掉了*智力上*的重复劳动。如今，我发现自己正在维护这个工具，帮助 Copilot 应用科学团队的所有同事也能做到同样的事。

在这个过程中，我学到了很多关于如何高效使用 [GitHub Copilot](https://github.com/features/copilot) 进行创建和协作的经验。将这些经验付诸实践，不仅为我自己解锁了一个极快的开发循环（development loop），也让团队成员能够构建符合各自需求的解决方案。

在具体解释我如何实现这一切之前，先交代一下催生这个项目的背景，这样你能更好地理解 GitHub Copilot 到底能做到什么。

## 缘起

我的大部分工作是分析编码智能体（coding agent）在标准化评估基准（evaluation benchmark）上的表现，比如 [TerminalBench2](https://www.tbench.ai/) 或 [SWEBench-Pro](https://scale.com/leaderboard/swe_bench_pro_public)。这意味着我要翻阅大量的"轨迹"（trajectory）——本质上就是智能体在执行任务时的思考过程和操作行为的详细记录。

评估数据集中的每个任务都会产生各自的轨迹，展示智能体如何尝试解决该任务。这些轨迹通常是包含数百行内容的 `.json` 文件。再乘以一个基准测试集中的数十个任务，以及每天需要分析的多次基准测试运行——我们说的可是数十万行内容需要分析。

独自完成这项工作根本不可能，所以我通常会借助 AI。在分析新的基准测试运行时，我发现自己一直在重复同一个循环：先用 GitHub Copilot 从轨迹中提取模式，再自己深入调查——把需要阅读的代码行数从数十万缩减到几百行。

然而，我心中的工程师看到这个重复性任务后说："我要把它自动化。"智能体为我们提供了自动化这类智力工作的手段，于是 `eval-agents` 就此诞生。

## 计划

工程团队和科研团队合作效果更好。这是我着手应对这个新挑战时的指导原则。

因此，我在这个项目的设计和实施策略上，心中有几个目标：

1. 让这些智能体易于分享和使用
2. 让创建新智能体变得简单
3. 让编码智能体成为贡献代码的主要方式

前两点深植于 GitHub 的 DNA，也是我在整个职业生涯中积累的价值观和技能——特别是我担任 GitHub CLI 开源维护者那段时间。

然而，第三个目标对项目的影响最大。我发现，当我让 GitHub Copilot 能够高效地帮我构建工具时，项目本身也变得更易用、更易协作。这段经历教会了我几个关键教训，最终以我意想不到的方式推动了前两个目标的实现。

## 让编码智能体成为你的主要贡献者

先说一下我的编码智能体开发环境：

- **编码智能体**：Copilot CLI
- **使用的模型**：Claude Opus 4.6
- **IDE**：VSCode

值得一提的是，我使用了 Copilot SDK 来加速智能体的创建，它底层由 Copilot CLI 驱动。这让我能直接使用现有工具和 MCP 服务器，注册新的工具和 Skills，还有大量开箱即用的智能体能力——无需自己从零搭建。

说完这些背景，我发现只要遵循几个核心原则，就能迅速简化整个开发流程：

- **提示词策略**：智能体在你采用对话式、详尽描述，并且在进入智能体模式前先使用规划模式（planning mode）时，效果最好。
- **架构策略**：频繁重构、频繁更新文档、频繁清理代码。
- **迭代策略**：从"信任但验证"转变为"责怪流程，而非智能体"。

发现并遵循这些策略带来了一个不可思议的现象：添加新智能体和功能变得又快又简单。五个人第一次加入这个项目，总共在不到三天内创建了 11 个新智能体、4 个新 Skills，以及 eval-agent 工作流的概念（类似于科学家的推理流程）。总计代码变更 **+28,858/-2,884 行**，涉及 345 个文件。

太疯狂了！

下面我将详细介绍这三个原则，以及它们如何促成了这次令人惊叹的协作与创新。

## 提示词策略

我们知道，AI 编码智能体非常擅长解决范围明确的问题，但面对那些你只会交给资深工程师处理的复杂问题时，就需要手把手地引导。

所以，如果你想让智能体像工程师一样工作，就像对待工程师一样对待它。引导它的思考，充分解释你的假设，并利用它的研究速度在动手修改之前先做规划。我发现，把我对一个正在反复琢磨的问题的意识流式想法写进提示词，然后在规划模式下与 Copilot 协作，远比给它一个简短的问题陈述或解决方案有效得多。

以下是我为工具添加更健壮的回归测试时写的提示词示例：

```
> /plan I've recently observed Copilot happily updating tests to fit its new paradigms even though those tests shouldn't be updated. How can I create a reserved test space that Copilot can't touch or must reserve to protect against regressions?
```

这引发了一系列来回讨论，最终产出了一套类似于契约测试（contract testing）的护栏（guardrails），只有人类才能修改。我对自己想要什么有一个大致的想法，通过对话，Copilot 帮我找到了正确的解决方案。

事实证明，让人类工程师在工作中最高效的那些要素，同样也是让这些智能体高效工作的要素。

## 架构策略

工程师们，好消息来了！还记得那些你一直想做的重构来提高代码可读性吗？从来没时间写的测试？你入职时多希望就已经存在的文档？在构建智能体优先（agent-first）的仓库时，这些现在变成了你最应该投入精力的工作。

为了赶新功能而不得不搁置这些工作的日子一去不复返了。当你拥有一个维护良好的智能体优先项目时，用 Copilot 交付功能变得轻而易举。

在这个项目中，我大部分时间都花在了重构命名和文件结构、记录新功能或模式、以及为发现的问题添加测试用例上。我甚至专门花时间去清理那些智能体（就像你的初级工程师一样）在实现新功能和修改时可能遗漏的无用代码。

这些工作让 Copilot 能够轻松浏览代码库并理解其中的模式，就像对任何其他工程师一样有效。

我甚至可以问自己："如果现在重新来过，我会怎样设计？"然后我就有充分的理由回去重新架构整个项目（当然，在 Copilot 的帮助下）。

简直是梦想成真！

这也引出了我最后一条建议。

## 迭代策略

随着智能体和模型的不断进步，我已经从"信任但验证"的心态转变为更偏向信任而非怀疑。这与行业对待人类团队的方式一脉相承："责怪流程，而非个人。"最高效的团队就是这样运作的——人会犯错，所以我们围绕这个现实构建系统。

这种[无责文化](https://circleci.com/blog/value-of-blameless-culture/)（blameless culture）为团队提供了心理安全感，让成员可以放心地迭代和创新，不用担心犯错后被追责。核心原则是：我们通过流程和护栏来防范错误；如果错误确实发生了，我们从中学习，引入新的流程和护栏，确保团队不会再犯同样的错误。

将这套哲学应用到智能体驱动开发（agent-driven development），是解锁极速迭代管线的关键。具体来说，我们添加流程和护栏来帮助防止智能体犯错；但当它确实犯了错，我们就追加额外的护栏和流程——比如更健壮的测试和更好的提示词——确保智能体不会再犯同样的错误。更进一步，这意味着践行良好的 [CI/CD 原则](https://github.com/resources/articles/ci-cd)是必须的。

严格类型检查（strict typing）等实践确保智能体遵守接口规范。健壮的代码检查工具（linter）对智能体施加实现规则，使其保持良好的编码模式和实践。而集成测试、端到端测试和契约测试——手动构建成本很高——在智能体的辅助下变得便宜得多，同时还能让你确信新变更不会破坏现有功能。

当 Copilot 在开发循环中拥有这些工具时，它可以自己检查自己的工作。你是在为它的成功创造条件，就像你为项目中的初级工程师创造成功条件一样。

## 融会贯通

当你的代码库为智能体驱动开发做好准备后，整个开发循环将变成这样：

1. 使用 `/plan` 与 Copilot 一起规划新功能。
	- 反复迭代计划。
		- 确保计划中包含测试方案。
		- 确保计划中包含文档更新，并且在代码实现之前完成。这些文档可以作为计划之外的补充指引。
2. 让 Copilot 在 `/autopilot` 模式下实现功能。
3. 提示 Copilot 发起与 Copilot Code Review 智能体的审查循环。我通常这样提示：`request Copilot Code Review, wait for the review to finish, address any relevant comments, and then re-request review. Continue this loop until there are no more relevant comments.`
4. 人工审查。这是我执行前面几节讨论的那些模式的环节。

此外，在功能开发循环之外，确保你经常用以下提示词驱动 Copilot：

- `/plan Review the code for any missing tests, any tests that may be broken, and dead code`
- `/plan Review the code for any duplication or opportunities for abstraction`
- `/plan Review the documentation and code to identify any documentation gaps. Be sure to update the copilot-instructions.md to reflect any relevant changes`

我设置了每周自动运行一次这些检查，但随着新功能和修复不断提交，我经常在一周内多次手动运行，以维护我的智能体驱动开发环境。

## 写在最后

最初只是对一项令人抓狂的重复分析任务的不满，最终却演变成了更有意思的东西：一种关于我们如何构建软件、如何协作、如何作为工程师成长的全新思维方式。

以编码智能体优先的思维来构建智能体，从根本上改变了我的工作方式。这不仅仅关乎自动化带来的效率提升——尽管看着四位科学家在不到三天内交付 11 个智能体、4 个 Skills 和一个全新概念，确实堪称非凡。更关键的是，这种开发方式迫使你优先关注这些东西：清晰的架构、完善的文档、有意义的测试和深思熟虑的设计——我们一直知道它们很重要，却从来没时间去做。

初级工程师的类比不断得到印证。你为他们做好入职引导，给他们清晰的上下文，构建护栏让他们的错误不会酿成灾难，然后信任他们去成长。如果出了问题，你责怪流程，而不是智能体。如果我希望你从这篇文章中带走一样东西，那就是：让你成为优秀工程师和优秀队友的那些能力，同样也是让你擅长用 Copilot 构建软件的能力。技术是新的，但原则不是。

所以，去清理那个代码库吧，写掉你一直拖延的文档，开始把你的 Copilot 当作团队的新成员来对待。你可能会发现，自动化反而让你做上了职业生涯中最有趣的工作。

觉得我疯了？那就试试看：

1. 下载 [Copilot CLI](https://github.com/features/copilot/cli)
2. 在任意仓库中激活 Copilot CLI：`cd <repo_path> && copilot`
3. 输入以下提示词：`/plan Read <link to this blog post> and help me plan how I could best improve this repo for agent-first development`
