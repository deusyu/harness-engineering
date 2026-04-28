---
sourceTitle: "An open-source spec for Codex orchestration: Symphony."
sourceUrl: "https://openai.com/index/open-source-codex-orchestration-symphony/"
sourceRequestedUrl: "https://openai.com/index/open-source-codex-orchestration-symphony/"
sourceAuthor: "Alex Kotliarskyi, Victor Zhu, and Zach Brock"
sourceCoverImage: "https://images.ctfassets.net/kftzwdyauwt9/1lLb8Tk8Ht0kZC0UzoJysb/bac9e34838a4f94afd44b1c9adfa8780/Symphony_SEO_card__1_.png?w=1600&h=900&fit=fill"
sourceSiteName: "OpenAI"
sourcePublishedAt: "2026-04-27"
sourceSummary: |-
  Learn how Symphony, an open-source spec for Codex orchestration, turns issue trackers into always-on agent systems—boosting engineering output and reducing context switching.
sourceAdapter: "generic"
sourceCapturedAt: "2026-04-28T06:27:43.694Z"
sourceConversionMethod: "defuddle"
sourceKind: "generic/article"
sourceLanguage: "en-US"
title: "Codex 编排的开源规范：Symphony"
summary: |-
  当 OpenAI 让团队在"不写一行人类代码"的前提下交付内部工具，下一个瓶颈不是模型，而是人类的上下文切换。Symphony 是他们的回应：一份极简的 SPEC.md 规范，把 Linear 这样的问题跟踪器变成智能体的控制平面——每个打开的任务都有一个智能体在自己的工作区中运行。这套机制让部分团队前三周已落地 PR 数量增长 500%，也把"谁能发起工程工作"扩展到了 PM 和设计师。
language: "zh-CN"
---

# Codex 编排的开源规范：Symphony

<audio src="https://cdn-azalea-tts-achmg6dqbafjaxcr.a01.azurefd.net/tts-prod/pZLTj5Gfz83hwUiFBtcOh/ember/fcf644938282be596bd1cb76488759e5.mp3"></audio>

六个月前，在开发一个内部生产力工具时，我们团队做了一个当时颇有争议的决定：这个仓库里不写任何人类手写代码。项目仓库里的每一行代码，都必须由 Codex 生成。

为了让这件事可行，我们从头重新设计了工程工作流。我们搭建了一个对智能体友好的仓库，在自动化测试和护栏上投入了大量精力，并把 Codex 当成一名完整的队友。我们在此前那篇关于 [harness engineering 的博客文章](https://openai.com/index/harness-engineering/)中记录了这段经历。

这套方式确实跑通了，但很快，我们撞上了下一个瓶颈：上下文切换。

为了解决这个新问题，我们构建了一个叫 *Symphony* 的系统。[Symphony](https://github.com/openai/symphony) 是一个智能体编排器，它能把 Linear 这类项目管理看板变成编码智能体的控制平面。每一个打开的任务都会分配到一个智能体，智能体持续运行，人类负责审查结果。

这篇文章会说明我们如何创建 Symphony，如何让它在一些团队中带来已落地 pull request 数量 500% 的增长，以及你如何用它把自己的问题跟踪器变成一个持续运行的智能体编排器。

## 交互式编码智能体的天花板

即使编码智能体变得越来越易用，无论是通过 Web 应用还是 CLI 访问，它们本质上仍然是交互式工具。

随着 OpenAI 内部智能体化工作的规模扩大，我们发现了一种新的负担。每位工程师会打开几个 Codex 会话，分配任务，审查输出，引导智能体，然后不断重复。实际使用中，大多数人可以比较舒适地同时管理三到五个会话；再多一点，上下文切换就开始变得痛苦。超过这个范围后，生产力会下降。我们会忘记哪个会话在做什么，会在不同终端之间来回跳转，提醒智能体回到正轨，还要调试那些跑到一半卡住的长任务。

智能体很快，但我们的系统瓶颈变成了人类注意力。我们等于组建了一支能力极强的初级工程师团队，然后让人类工程师去微管理他们。这无法扩展。

## 视角的转变

我们意识到，自己一直在优化错误的对象。我们把系统围绕编码会话和已合并 PR 来组织，但 PR 和会话其实都只是达成目标的手段。软件工作流大体上是围绕交付物组织的：issue、task、ticket、milestone。

于是我们开始问自己：如果我们不再直接监督智能体，而是让它们从任务跟踪器里领取工作，会发生什么？

这个想法后来成为 Symphony。它是一份书面规范，承担监督者的角色，用来编排智能体化工作。

## 把问题跟踪器变成智能体编排器

Symphony 从一个简单概念开始：任何打开的任务都应该由一个智能体接手并完成。我们不再在多个标签页里管理 Codex 会话，而是把问题跟踪器变成控制平面。

在这套配置中，每个打开的 Linear issue 都映射到一个专属的智能体工作区。Symphony 持续观察任务看板，并确保每个活跃任务在完成之前，循环中始终有一个智能体在运行。如果智能体崩溃或停滞，Symphony 会重启它。如果出现新工作，Symphony 会接手并开始组织。

我们基于 ticket 状态构建工作流，把任务管理工具 Linear 当成状态机使用。

![编码智能体使用 Linear 作为状态机，与我们协同工作。](https://images.ctfassets.net/kftzwdyauwt9/4R4WJRvBnzXiSSKRyMHzgc/29c6b5957cb7b074e4b968f1c6512ccf/Coworking-Desktop-Dark-Symphony__1_.svg?w=3840&q=80)

实践中，Symphony 将工作与会话、与 pull request 解耦。有些 issue 会在多个仓库里产出多个 PR；另一些则是纯调查或分析，完全不会触碰代码库。

> 一旦工作被这样抽象出来，ticket 就可以代表大得多的工作单元。

我们经常用 Symphony 编排复杂功能和基础设施迁移。举个例子，我们可能会提交一个任务，让智能体分析代码库、Slack 或 Notion，并产出一份实施计划。等我们认可这份计划后，智能体会生成一棵任务树，把工作拆成不同阶段，并定义任务之间的依赖关系。

智能体只会开始处理未被阻塞的任务，所以对这个 DAG（一系列执行步骤）来说，执行过程会自然地、近乎最优地并行展开。例如，我们把 React 升级标记为受 Vite 迁移阻塞。结果也符合预期：只有在 Vite 迁移完成之后，智能体才开始升级 React。

智能体也可以自己创建工作。在实现或 review 过程中，它们经常会注意到超出当前任务范围的改进点：性能问题、重构机会，或更好的架构。发生这种情况时，它们会直接创建一个新 issue，供我们之后评估和排期，其中很多后续任务也会被智能体接手。我们监督这个过程，同时智能体保持组织性，让工作继续向前推进。

这种工作方式显著降低了启动模糊工作的认知成本。如果智能体做错了，那仍然是有用信息，而且对我们的成本几乎为零。我们可以非常低成本地创建 ticket，让智能体去原型验证和探索，然后丢弃任何我们不喜欢的探索结果。

因为编排器运行在开发机上，而且永不休眠，所以我们可以从任何地方添加任务，并知道会有智能体接手。例如，我们团队的一位工程师曾经在一个 Wi-Fi 很差的小屋里，用手机上的 Linear 应用完成了三项重要变更。

## 这种工作方式带来了更多探索

观察 Symphony 带来的影响时，最明显的变化是产出。在 OpenAI 的一些团队中，我们看到前三周已落地 PR 数量增长了 500%。在 OpenAI 之外，Linear 创始人 Karri Saarinen 也提到，随着我们发布 Symphony，[创建的 workspace 数量出现激增](https://x.com/karrisaarinen/status/2031773828284919878)。不过，更深层的变化是团队思考工作的方式。

当工程师不再花时间监督 Codex 会话时，代码变更的经济性就完全改变了。每次变更的感知成本下降，因为我们不再把人力投入到驱动实现本身。

这改变了我们的行为。在 Symphony 中启动一个探索性任务已经变得微不足道。试一个想法，探索一次重构，验证一个假设，然后只保留那些看起来有价值的结果。

它也扩大了谁可以发起工作的范围。我们的产品经理和设计师现在可以直接向 Symphony 提交功能请求。他们不需要 checkout 仓库，也不需要管理 Codex 会话。他们描述想要的功能，然后拿到一份 review packet，其中包含该功能在真实产品中运行的视频演示。

Symphony 在大型 monorepo 中也很有价值，比如 OpenAI 自己的 monorepo。在这类仓库里，PR 落地的最后一公里往往缓慢而脆弱。系统会观察 CI，在需要时 rebase，解决冲突，重试 flaky 检查，并总体上护送变更通过流水线。当一个 ticket 到达 **Merging** 状态时，我们已经高度确信这项变更会进入主分支，不需要人一直盯着照看。

![Symphony 前后对比网格](https://images.ctfassets.net/kftzwdyauwt9/1b9kasE3gNR3Gkv3D2ZEdW/02afe997b586e3f8f21309d076d0de8c/BeforeAndAfter-Desktop-Dark-Symphony.svg?w=3840&q=80)

实现 Symphony 之后，我们把更多工作委托给智能体，把精力集中在更困难、更具探索性的任务上。

## 进展也带来了新的、不同的问题

在这个层级上运行会有取舍。当我们从交互式引导智能体，转向在 ticket 层级给它们分配工作时，就失去了在中途不断提醒它们、随时纠偏的能力。有时智能体会产出完全偏离目标的东西。这其实很有用，因为这些失败暴露了系统里的缺口，帮助我们把系统做得更稳健。

我们没有手动修补结果，而是增加护栏和 skills，让智能体下次能自己成功。随着时间推移，这促使我们给 harness 加入新的能力，例如运行端到端测试、通过 Chrome DevTools 驱动应用，以及管理 QA smoke tests。我们也大幅改进了文档，并更清楚地定义了什么才算做好。

并不是每个任务都适合 Symphony 这种工作方式。有些问题仍然需要工程师直接使用交互式 Codex 会话，尤其是那些模糊、需要强判断力和专业经验的问题。实践中，这些通常也是工程师最感兴趣、最享受的任务。

差别在于，Symphony 可以处理大量常规实现工作。这让工程师能一次专注于一个困难问题，而不是不断在较小任务之间切换上下文。

我们还学到，把智能体当作状态机里的刚性节点并不好用。模型会变得更聪明，也能解决比我们预设框架更大的问题。我们早期的智能体化工作只是要求 Codex 实现任务。这个方式后来被证明太受限了。Codex 完全有能力创建多个 PR，也能阅读 review 反馈并处理它。因此我们给它工具，比如 `gh` CLI、读取 CI 日志的 skills 等等。现在我们可以让 Codex 做更多事，例如关闭旧 PR，或者拉取已完成工作与已放弃工作的报告。这类任务远远超出了最初"实现功能"的盒子。

所以，我们最终转向给智能体设定*目标*，而不是规定严格的状态转换。这很像一位优秀经理给团队成员分配目标。模型的力量来自它们的推理能力，所以要给它们工具和上下文，然后让它们放手去做。

## 用 Symphony 构建 Symphony

当你打开 [Symphony 仓库](https://github.com/openai/symphony)时，第一眼会注意到，严格来说 Symphony 只是一个 `SPEC.md` 文件：它定义了问题和预期解决方案。我们没有构建一个复杂的监督系统，而是定义问题和目标解法，给智能体提供高层引导。

参考实现使用 Elixir 编写，因为当代码实际上接近免费时，你终于可以根据语言优势来选择语言，比如 Elixir 的并发能力。但核心思想可以用一份简单的 Markdown 文档表达。我们鼓励你把这份规范交给自己喜欢的编码智能体，让它实现自己的版本。

Symphony 的第一个版本只是一个运行在 `tmux` 里的 Codex 会话，它轮询 Linear，并为新任务生成子智能体。它能工作，但并不特别可靠。第二个版本存在于我们的主项目仓库中，而这个仓库本来就是围绕智能体构建的。我们已经搭好了智能体 harness，为智能体提供在这个仓库中高质量工作的 skills 和上下文，所以 Symphony 只是把这些能力连接起来。

基本功能存在之后，我们就开始用 Symphony 构建 Symphony。

当我们在内部演示这个系统如何管理任务并附上工作证明视频时，反馈极其积极：我们的 Symphony 项目频道开始增长，整个组织里的团队也开始自发使用它。对 OpenAI 来说，内部产品市场匹配是对外发布的前提。基于我们在 OpenAI 内部看到的使用情况，我们清楚地意识到，应该把 Symphony 分享到公司之外。

于是我们把这个想法抽取成一个独立的 `SPEC.md`，并让 Codex 来实现它。参考实现选择了 Elixir，这是一门相对小众但非常擅长编排和监督并发进程的语言。Codex 一次性构建出了 Elixir 实现，之后我们继续在规范和实现上迭代。为了打磨规范，我们甚至让 Codex 用另外几种语言实现它，包括 TypeScript、Go、Rust、Java、Python，并用这些实现结果来找出歧义、简化系统。它在每种语言上都成功了。

在构建 Symphony 的过程中，我们移除了大量偶然复杂性，比如对特定仓库或 Linear MCP 的依赖。Symphony 不再依赖我们的内部仓库或工作流。核心方法变得很简单：

> 对每一个打开的任务，保证都有一个智能体在自己的工作区中运行。

除了帮助处理活跃工作之外，开发工作流本身现在也成为智能体知道并遵循的东西。这个开发工作流，包括处理一个 issue、checkout 仓库、把它移到进行中以便 PM 知道有人在做、添加 PR、移动到 **Review** 状态、附上视频等等，现在都被捕获在一个简单的 `WORKFLOW.md` 文件里。这些原本都是人类遵循的流程，但从未被文档化。现在我们不再依赖这些隐式步骤，而是把它们写下来，并由 Symphony 确保智能体遵循。这让我们能构建真正和我们一起工作的智能体。如果我们决定智能体也应该在完成工作时附上自我反思，那就把这一步加入 `WORKFLOW.md`，Symphony 会引导智能体走到那一步。

我们还使用了 Codex 的 [App Server 模式](https://developers.openai.com/codex/app-server/)，这是 Codex 内置的 headless 模式。这个模式允许我们运行 Codex，并通过文档完善的 JSON-RPC API 与它进行程序化通信，例如启动一个 thread，或响应 turns。相比试图通过 CLI 或实时 `tmux` 会话与 Codex 交互，这种方式更方便，也更容易扩展。

Codex App Server 非常适合我们的用例：我们可以利用 Codex 提供的 harness，同时又有旋钮和钩子可以接入。例如，为了避免把 Linear access token 暴露给子智能体，我们使用 [dynamic tool calls](https://developers.openai.com/codex/app-server/#dynamic-tool-calls-experimental) 暴露原始的 `linear_graphql` 函数，让它可以对 Linear 执行任意请求，而不依赖 MCP，也不把 access token 暴露给容器。

## 接下来

Symphony 是一个有意保持最小化的编排层。我们将它开源，是为了展示 Codex App Server 与 Linear 这类不同工作流工具结合时的能力。因此，我们不打算把 Symphony 作为一个独立产品来维护。请把它看作参考实现。就像许多开发者会把 harness engineering 那篇文章交给编码智能体，用来搭建自己的仓库一样，我们也希望你把 Symphony 的 [spec](https://github.com/openai/symphony/blob/main/SPEC.md) 和 [repository](https://github.com/openai/symphony) 交给你喜欢的编码智能体，让它构建适合你自己环境的版本。

力量来自 Codex 以及它的 app server。Symphony 只是把 Codex 和 Linear 连接起来的一种方式，而这两者都是我们已经在使用的东西，用来解决工作管理问题。随着编码智能体越来越擅长推理和遵循指令，我们怀疑其他公司的瓶颈也会从写代码转向管理智能体化工作。令人兴奋的是，尝试这些编码智能体系统的门槛现在已经低得惊人。你可以直接用 Codex 构建东西。

## 社区致谢

我们很高兴看到工程社区在 Symphony 发布后的几周里使用它。截至 4 月 23 日，它已经获得了超过 [15K GitHub stars](https://github.com/openai/symphony)。
