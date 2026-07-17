---
title: "Deep Agents 中的解释器：工具调用和沙箱之间的代码层"
sourceTitle: "Interpreters in Deep Agents: Code Between Tool Calls and Sandboxes"
sourceUrl: "https://www.langchain.com/blog/give-your-agents-an-interpreter"
sourceAuthor: "Hunter Lovell"
sourcePublishedAt: "2026-05-20T18:00:00.000Z"
sourceCoverImage: "https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a0e02b3e38f745763e01969_7.png"
summary: "Deep Agents 现在支持解释器：一种小型嵌入式运行时，让智能体可以写代码来协调工具、保存工作状态，并决定什么进入模型上下文。"
sourceLanguage: "en"
language: "zh-CN"
translationMethod: "baoyu-translate skill"
sourceFigureCount: 8
---

# Deep Agents 中的解释器：工具调用和沙箱之间的代码层

[![Deep Agents 解释器文章首图](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a0e02b3e38f745763e01969_7.png)](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a0e02b3e38f745763e01969_7.png)

## 要点

- **解释器位于串行工具调用和完整沙箱之间。** 智能体获得了针对受限能力的代码级组合能力，而不必继承一整个环境。
- **解释器状态是第三类上下文承载面。** 消息历史用于模型当下推理，文件系统用于持久 artifact，解释器状态用于保存暂时还不需要成为模型输入的实时工作值。
- **程序化工具调用可以作为中间件接入。** allowlist（白名单）中的工具会出现在解释器里的 `tools` namespace 下，适用于任何模型，并且在早期测试中，某些任务最多少用了 35% token。

**TL;DR** 我们正在为 Deep Agents 添加解释器：一种小型嵌入式运行时，让智能体可以在智能体循环内部编写并执行代码。它为智能体提供了一个介于“一次一个工具调用”和“完整沙箱”之间的中间地带，让智能体可以表达多步工作，把中间状态留在模型上下文之外，并以更可预测的方式执行代码和动作。

## 什么是解释器？

解释器是一种小型嵌入式运行时，智能体工作时可以针对它写代码。从功能上看，它就像给智能体一个 Python 或 Node REPL：它可以定义变量、检查值、编写 helper 函数，并在多次调用之间复用状态。

[![解释器在智能体循环中执行代码的演示动图](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a0dfdc25672cab8c5974ca5_ScreenRecording2026-05-19at4.49.17PM-ezgif.com-speed.gif)](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a0dfdc25672cab8c5974ca5_ScreenRecording2026-05-19at4.49.17PM-ezgif.com-speed.gif)

今天，许多智能体已经会通过向宿主或沙箱环境发出命令来执行代码。当任务是环境层面的工作时，这非常有用：运行命令、安装依赖，或操作文件系统。解释器瞄准的是另一层：智能体写的代码运行在智能体循环内部，用来协调委派、组合工具调用、转换结构化数据，并决定哪些信息应该回到模型。

```typescript
// agent writes code like this

const rows = [

  { team: "support", tickets: 18 },

  { team: "infra", tickets: 7 },

  { team: "sales", tickets: 11 },

];

const total = rows.reduce((sum, row) => sum + row.tickets, 0);

const busiest = rows.sort((a, b) => b.tickets - a.tickets)[0];

\`${busiest.team} has the most tickets. ${total} tickets total.\`;
```

这给智能体一个新的地方，用来表达那些无法自然落入一串工具调用的行为。智能体获得了多步逻辑的工作空间，同时 harness 仍然控制这个工作空间能触达什么。解释器可以保存临时状态，并只返回重要部分。

## 解释器适合放在哪里

当你想到智能体时，通常会想到给它挂载工具。

最简单的智能体形式中，智能体在一个循环里使用这些工具：模型调用一个工具，检查观察结果，然后决定下一步做什么。这种一步一步的风格容易调试和评测，很多工作流也确实需要对即时观察进行推理。

沙箱在此基础上前进一步：它给智能体一个针对某个环境工作的 bash 工具，用来运行命令、安装依赖并处理文件。

但两端都有缺点：沙箱*可以*处理本地过程（因为它可以直接写代码来做），但可能更难配置和扩展；而纯串行工具循环在中间步骤主要只是喂给下一步时，会显得笨拙。

有些智能体工作正好位于这两个极端之间，解释器可以很好地嵌入其中。它们让智能体获得针对受限能力的代码级组合，而不提供一整个环境。模型可以写一个小程序来表达围绕现有能力的控制流，而 harness 决定哪些能力通过宿主暴露出来。

[![解释器位于简单工具调用和完整沙箱之间](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a0dff8f939404780ec29e82_Screenshot%202026-05-20%20at%209.39.22%E2%80%AFAM.png)](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a0dff8f939404780ec29e82_Screenshot%202026-05-20%20at%209.39.22%E2%80%AFAM.png)

## 设计上更受限

我们称它为解释器，而不只是代码运行时，因为解释器是刻意受限的。默认情况下，它没有你会从普通编程环境中期待的 API：没有文件系统、没有网络、没有 shell、不能安装包，也不能访问 wall-time。智能体一开始只拥有基本控制流和对象操作：对象、数组、map、JSON，以及小型语言运行时中的其他内容。

这些能力通过到宿主运行时的显式桥接暴露出来。如果智能体需要调用工具、从受限文件系统 API 读取、获取 URL，或委派给子智能体，harness 必须有意暴露这个能力。比如，下面这个脚本只有在我们明确把 `fetch`、`read_file` 和 `task` 工具直接桥接到解释器时才能工作：

```typescript
// calls the \`fetch\` tool to make a network request

const response = tools.fetch("https://docs.langchain.com/");

// calls the \`readFile\` tool to fetch files from the agents filesystem

const file = tools.readFile("SPEC.md");

// calls the \`task\` tool to spawn a subagent

const subagentOutput = tools.task({

  description: "Do you know the muffin man?"

});
```

宿主运行时，也就是运行 harness 的同一个运行时，包含智能体可以通过解释器采取的所有动作，并明确决定解释器代码可以调用哪些动作。解释器是智能体在这条边界上的可编程一侧。

默认情况下，解释器只从语言特性开始，而不是像沙箱那样拥有通用宿主访问。任何触达外部世界的东西，都必须跨过你指定的显式桥接。

[![解释器通过显式桥接限制外部世界访问](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a0dfe0d8e859cd9a79567c9_Screenshot%202026-05-20%20at%2011.22.23%E2%80%AFAM.png)](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a0dfe0d8e859cd9a79567c9_Screenshot%202026-05-20%20at%2011.22.23%E2%80%AFAM.png)

我们这样做有几个原因：

- **更小的动作表面：** 使用 bash 或沙箱时，起点很宽：智能体拥有一个类似计算机的东西，然后你再限制它能做什么。使用解释器时，起点很窄：智能体拥有一个语言运行时，而能力被有意加回来。当你的威胁模型需要进程或 VM 隔离时，这并不能取代沙箱，但它确实意味着智能体默认不会继承宽泛的宿主访问。
- **可预测性：** 小而固定的运行时让智能体行为更容易预期和评测。如果解释器拥有宽泛宿主访问或丰富库表面，同一个目标可以通过许多不同策略实现，这会让输出不那么一致，也更难测试。通过保持默认环境最小，并强制额外能力通过显式桥接进入，你会让智能体动作空间更窄、失败模式更清晰、结果更可重复。

你可以在 Figma、Shopify、AWS 等系统中看到同样的架构形态：受约束的代码在一侧运行，宿主在另一侧暴露受控 API 边界。

## 解释器解锁了什么

最近一些系统已经收敛到相似模式：给模型一个小型、受限运行时，让它可以写一点代码来管理控制流和中间状态。Cloudflare 的 [Code Mode](https://blog.cloudflare.com/code-mode/)、Anthropic 的 [Programmatic Tool Calling (PTC)](https://platform.claude.com/docs/en/agents-and-tools/tool-use/programmatic-tool-calling)，以及 [RLM](https://hang13.github.io/blog/2025/rlm/) 风格工作流，都从不同角度指向这个想法。在 Deep Agents 中，解释器让你以模型无关的方式获得这种模式。下面是它已经有用的几个地方：

### 作为上下文承载面的解释器状态

智能体 harness 已经会在几个承载面上组织上下文：

- 消息历史是模型当下可用的上下文。
	- 它昂贵且受注意力约束：模型可以接受一百万 token，并不意味着它会同等有效地推理每个 token。（例如 [context rot](https://www.trychroma.com/research/context-rot)）
- 文件系统给智能体一个地方，用来存储持久 artifact、笔记、中间文件和更长期的工作记忆。
	- 它持久且灵活，但会迫使智能体把工作状态序列化成文件，并在之后重新构建。
		- Harness 的一部分工作，就是控制上下文在文件系统和消息历史之间的流动。

解释器状态给了智能体另一种选择。值可以作为数组、对象、map、计数器、队列和 helper 函数保留在运行时中。模型不需要把每个中间值都看成 prompt 文本，但之后仍然可以要求解释器检查或复用这些值。

[![解释器状态保存数组、对象、map、计数器和 helper 函数](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a0dfe2755b8bef3e1c91b95_Screenshot%202026-05-20%20at%2012.58.08%E2%80%AFAM.png)](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a0dfe2755b8bef3e1c91b95_Screenshot%202026-05-20%20at%2012.58.08%E2%80%AFAM.png)

这类似于为什么 REPL 和一次性命令感觉不同。如果你在 REPL 中定义了变量，下一次提交命令时它仍然在那里。你不需要把它变成 stdout、写入文件，或在做下一件事之前重新构建。当智能体多次调用解释器时，同样的原则也适用，因为它可以直接复用上一次调用留下的值。

这让解释器对智能体循环状态很有用。消息历史用于模型当下需要推理的内容，文件系统用于持久 artifact 和环境层面的工作，解释器状态用于保存可能之后有用、但暂时不需要成为模型输入的实时工作值。

### 程序化工具调用

Anthropic 的 [Programmatic Tool Calling (PTC)](https://platform.claude.com/docs/en/agents-and-tools/tool-use/programmatic-tool-calling) 是这个模式的另一个版本：工具调用发生在智能体写的代码内部，而不是作为一串由模型中介的动作发生。

如果模型调用工具、收到完整结果、推理结果、再调用下一个工具，每个小步骤都会变成另一次模型往返。如果智能体可以写代码直接调用工具，它就可以把中间输出保留在运行时里，只返回最终结果或被选择的证据。

在 Deep Agents 中，PTC 被实现为中间件，而不是模型提供商行为。开发者传入 allowlist（白名单），其中的工具会出现在全局 `tools` namespace 下，每个工具都作为 async function 暴露，解释器可以用 `await` 调用。这意味着你可以为*任何*模型启用 PTC，包括开源模型。

```typescript
const topics = ["retrieval", "memory", "evaluation"];

const reports = await Promise.all(

  topics.map((topic) =>

    tools.task({

      description: \`Research ${topic} in Deep Agents and return three concise findings.\`,

      subagent_type: "general-purpose",

    }),

  ),

);

reports.join("\\n\\n");
```

[![工具调用逻辑在解释器中组合执行](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a0dfe6ac7c5a73114406515_Screenshot%202026-05-20%20at%201.21.15%E2%80%AFAM.png)](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a0dfe6ac7c5a73114406515_Screenshot%202026-05-20%20at%201.21.15%E2%80%AFAM.png)

在我们的一些早期测试中，这种工具调用方式在某些任务上最多少用了 35% token。（我们在从 [OOLONG](https://huggingface.co/datasets/oolongbench/oolong-synth/viewer/default/validation) `trec-coarse` 数据集收集的一组任务上评估了这一点。）

[![解释器方式减少工具调用任务的 token 使用](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a0dfe965ae396c35adb7edd_Screenshot%202026-05-20%20at%201.17.19%E2%80%AFAM.png)](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a0dfe965ae396c35adb7edd_Screenshot%202026-05-20%20at%201.17.19%E2%80%AFAM.png)

### 处理大型数据集

以文档密集型任务为例：一个智能体需要从 10000 份文档中分类、抽取或综合信息。

使用标准工具调用智能体时，自然形态是一长串由模型中介的动作。模型搜索，拿到结果并放入上下文，决定下一步检查什么，再调用另一个工具，拿回更多结果，如此重复。对于小任务，这个循环足够。但到了规模化时，它会开始失效：

- 很难验证智能体是否真的遵循了预期流程。
- 太多中间上下文被路由回模型。
- 很容易遇到延迟、上下文或工具调用限制。
- 响应可能退化，因为模型被迫通过历史管理太多工作状态。

解释器形态的版本会不同。模型可以写代码，把文档和搜索状态保留在运行时中，以编程方式迭代批次，给候选项打分或过滤，并只在选定切片上调用子智能体。解释器不是把每个中间结果都返回给模型，而是返回一个紧凑证据集：匹配的文档、抽取出的字段、未解决案例，或少数值得推理的摘要。

解释器并不会神奇地推理全部 10000 份文档。它给了智能体一种更好的方式来控制搜索空间，并决定什么应该进入模型上下文。

```typescript
const candidates = documents

  .map((doc) => ({ doc, score: scoreDocument(doc, query) }))

  .filter(({ score }) => score > 0.75)

  .sort((a, b) => b.score - a.score)

  .slice(0, 10);

const reports = await Promise.all(

  candidates.map(({ doc }) =>

    tools.task({

      description: \`Extract evidence from ${doc.id} for: ${query}\`,

      subagent_type: "general-purpose",

    }),

  ),

);

reports.join("\n\n");
```

### 递归编排

另一个相关想法是 [Recursive Language Models (RLMs)](https://alexzhang13.github.io/blog/2025/rlm/)。RLM 把长 prompt 视为外部 REPL 环境的一部分，然后让模型写代码来检查、分解，并围绕选定片段递归调用模型。

Deep Agents 解释器并不是在模型层实现 RLM，但在 harness 层仍然存在相关联系：代码可以把工作状态保留在模型上下文之外，选择该状态的一个切片，并只把这个切片传给下一次模型或子智能体调用。

在 Deep Agents 中，`tools.task` 就是这方面的桥接。解释器代码可以选择一片工作，把这片工作委派给子智能体，把结果与既有运行时状态结合，并只把综合后的输出返回给主模型。

## 它在 Deep Agents 中如何工作

在 harness 层，解释器是智能体循环和小型运行时之间的中间件。中间件会：

- 给智能体添加一个 `eval` 工具。
- 创建并维护 QuickJS context。
- 执行智能体的 TypeScript 代码。
- 在配置后捕获 `console.log` 输出。
- 把最终表达式返回到模型上下文。

`eval` 工具不是“在宿主上运行任意代码”。代码运行在解释器 context 内。如果它需要和外部世界通信，必须通过宿主运行时暴露的桥接来完成。

程序化工具调用就是这些宿主桥接之一。开发者传入 `ptc` allowlist（白名单），其中的工具会出现在解释器里的 `tools` namespace 下（例如 `tools.getWeather(...)`），每个工具都作为 async function 暴露，解释器可以用 `await` 调用。宿主运行时仍然执行真实工具调用。

大致流程如下：

1. 模型写代码并调用 `eval`。
2. QuickJS 在解释器 context 中评估代码。
3. 解释器代码可选地调用 allowlist（白名单）中的工具。
4. 宿主运行时执行真实工具调用。
5. 结果跨回解释器。
6. 最终表达式跨回模型上下文。

一次 run 中重复的 eval 调用可以共享同一个实时解释器 context，这就是让值像 REPL 状态一样行为的原因。跨对话轮次的快照也可用，但应该把它视为保存可序列化工作数据的方式，而不是保存 live handles 或宿主资源的方式。

运行时控制也位于这条边界上：

- 内存限制。
- 每次 eval 的超时。
- 最大程序化工具调用次数。
- 最大结果大小。
- console 捕获。
- 轮次之间的快照。

[![解释器工具的接口、状态和权限边界](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a0e00713295e73c634f2a77_Screenshot%202026-05-20%20at%2011.41.48%E2%80%AFAM.png)](https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6a0e00713295e73c634f2a77_Screenshot%202026-05-20%20at%2011.41.48%E2%80%AFAM.png)

## 如何在 Deep Agents 中使用它

你可以安装解释器，并使用 `create_deep_agent` 添加中间件：

```bash
uv add "deepagents[quickjs]"
```

```python
from deepagents import create_deep_agent

from langchain_quickjs import CodeInterpreterMiddleware

agent = create_deep_agent(

    model="openai:gpt-5.5",

    middleware=[CodeInterpreterMiddleware()],

)
```

（TypeScript 中则是）

```bash
pnpm install deepagents @langchain/quickjs
```

```typescript
import { createDeepAgent } from "deepagents";

import { createCodeInterpreterMiddleware } from "@langchain/quickjs";

const agent = createDeepAgent({

  model: "openai:gpt-5.5",

  middleware: [createCodeInterpreterMiddleware()],

});
```

要让解释器代码调用智能体工具，需要用 allowlist（白名单）启用程序化工具调用。工具不会自动暴露给解释器代码；你必须选择哪些工具可以跨过宿主运行时桥接。

```python
agent = create_deep_agent(

    model="openai:gpt-5.5",

    middleware=[CodeInterpreterMiddleware(ptc=["task"])],

)
```

```typescript
const agent = createDeepAgent({

  model: "openai:gpt-5.5",

  middleware: [createCodeInterpreterMiddleware({ ptc: ["task"] })],

});
```

启用 PTC 后，allowlist（白名单）中的工具会出现在全局 `tools` namespace 下。每个工具都是 async function，模型收到的是最终解释器输出，而不是每个中间工具结果。

Deep Agents 提供 [Python](https://github.com/langchain-ai/deepagents) 和 [TypeScript](https://github.com/langchain-ai/deepagentsjs) 版本。更多信息请查看关于[解释器](https://docs.langchain.com/oss/python/deepagents/interpreters)的文档，以及完整中间件选项和运行时控制。
