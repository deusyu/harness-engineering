---
title: "Pi 中的 Compaction 是如何工作的"
sourceTitle: "How Compaction Works in Pi"
sourceUrl: "https://earendil.com/posts/compaction-in-pi/"
sourceAuthor: "Earendil Engineering（Pi 团队）"
sourcePublishedAt: "2026-08-13"
sourceSiteName: "Earendil"
summary: "Pi 团队一手拆解编码智能体的 compaction 机制：会话逐 turn 膨胀直至溢出上下文窗口后，用一次独立 LLM 请求把旧历史压缩成'交接班简报'式结构化摘要（目标/进展/关键决策），默认保留 20K token 近期消息（约 5–20 turns）；独立请求可换便宜模型、摘要以纯文本存储保证跨模型可移植，代价是打破 prompt cache 需全量重算。"
sourceLanguage: "en"
language: "zh-CN"
translationMethod: "人工整理逐段翻译（cloud agent，对照原文全文）"
sourceFigureCount: 0
sourceFigureAudit: "2026-08-27 curl 原文 HTML grep 核对，正文无配图（logo/头像/图标不计）"
---

# Pi 中的 Compaction 是如何工作的

如果你曾在 [Pi](https://pi.dev)、Claude Code 或 Codex 这类编码智能体（coding agent）里进行过一次很长的编码会话，那么你一定触发过一次压缩（compaction，把会话历史压缩成摘要以腾出上下文空间；下文保留英文 compaction）。在这篇文章中，我们解释 compaction 是如何工作的，以及 Pi 在什么时候需要进行 compaction。

## 一次 LLM 对话

大语言模型（LLM）的[上下文窗口（context window）](https://en.wikipedia.org/wiki/Context_window)是有限的。上下文窗口就是模型在生成响应时所能"看到"的内容。LLM 所采用的 [Transformer 架构](https://en.wikipedia.org/wiki/Transformer_(deep_learning))限制了它们能处理的输入量。一次编码智能体会话的输入包括之前所有的消息和工具调用，而且随着你不断工作，它会持续增长。一旦超出上下文窗口，LLM 就会拒绝该请求。

当你与 Pi 这样的编码智能体交互式协作时，智能体向 LLM 发送请求并接收响应。每个请求包含系统提示词（system prompt）、加载的文件（例如 [`AGENTS.md`](https://agents.md/)）、工具定义，以及会话历史。

编码智能体的第一个 LLM 请求包含这份初始上下文，外加第一条用户消息。

```text
请求 1：
[system][tools][user]
```

这就开启了一个轮次（turn；下文保留英文）。LLM 可能先返回一条包含工具调用的 assistant 消息。智能体程序执行这些工具调用，然后向 LLM 发送一个新请求，其中包含完整的会话内容——现在还包括了工具结果。我们再收到一条 assistant 消息。当 assistant 完成输出生成时，这个 turn 就结束了。

```text
请求 1 之后：
[system][tools][user][assistant: tool call][tool result][assistant]
                     <------------------->     ^        <--------->
                       由 LLM 返回             |          由 LLM 返回
                                               |
                                        由智能体程序产生
```

我们继续工作，再发送一条消息。

```text
请求 2：
[system][tools][user][assistant: tool call][tool result][assistant][user]
                                                                     ^
                                                               新的用户消息
```

每个 turn 都会让会话继续膨胀。最终，历史会超出上下文限制。下一个请求就会返回类似 `Request exceeds the maximum size` 的错误。

```text
[system][tools][user][assistant][....][tool result][user]
                                                      ^
                                              超出上下文窗口
```

## 处理上下文溢出

当我们无法原样继续现有会话时，有两个选择。

1. 我们可以开启一个全新的空会话，抛掉累积的上下文。这会丢弃历史，包括之前的决策和未完成的工作。但这样做也未必是坏事，因为 [LLM 输出的表现会随上下文变大而下降](https://www.trychroma.com/research/context-rot)。
2. 我们可以为会话上下文创建一个更小的表示，因为我们想让这次会话继续下去。这正是 compaction 所做的事。

## Compaction

理论上，实现 compaction 的方式有很多。比如，我们可以写一个确定性函数，保留会话中的一部分内容并丢弃其余部分。但在实践中，各家的 compaction 实现都是用一次 LLM 请求来对会话历史做摘要。

Compaction 用一份压缩后的表示替换掉一部分历史，为后续的消息和工具调用腾出空间。

```text
[system][tools][compaction result][user]
                                    ^
                                 新消息
```

## Pi 的实现

我们来仔细看看 Pi 具体是[如何实现 compaction 的](https://pi.dev/docs/latest/compaction#summary-format)。

当会话变得太长时，Pi 用 compaction 来摘要较早的内容，同时保留最近的工作。当上下文用量逼近上下文窗口的总大小时，compaction 会被触发。也可以用 `/compact` 命令手动触发。

Pi 在一个 turn 结束后检查是否需要自动 compaction。在那之前，每个请求都是在现有 prompt 的基础上扩展，因此可以复用其缓存前缀（cached prefix）。如果在 turn 进行中遇到上下文溢出错误，Pi 也可能在 turn 中途进行 compaction。

进行 compaction 时，Pi 会原样保留一定数量的最近消息。

```text
compaction 之前：
[system + tools][较早的 turns][保留的最近消息]
```

保留消息的数量是变化的，因为 Pi 使用一个[可配置的 token 预算](https://pi.dev/docs/latest/compaction#when-it-triggers)。Pi 当前默认值是 2 万（20K）token，大约相当于 5 到 20 个 turn。在这个切分点之前的所有消息会被提取并序列化，然后交给摘要处理。

## Pi 的 compaction 提示词

对编码智能体而言，一次好的摘要的理想结果，就像一份从上一班交给下一班的交接班简报。Pi 的 compaction 提示词紧扣一个事实：现有上下文中有大量内容已经不再相关。我们应当只保留对下一个 LLM 请求仍然重要的上下文。

因此，Pi 为 compaction 发送的请求与常规对话请求是不同的。

1. 这个独立 compaction 请求所用的系统提示词不同。我们不再告诉 LLM"你是一位专家级编码助手"，而是告诉它 ["you are a context summarization assistant."（你是一个上下文摘要助手）](https://github.com/earendil-works/pi/blob/47610217098d9ba8f22d223fa7c1413f9f5fd759/packages/coding-agent/src/core/compaction/utils.ts#L152-L158)
2. Compaction 请求中的用户消息也不同。它要求生成 ["a structured summary of this conversation branch for context when returning later."（对这条会话分支的结构化摘要，供之后回来时作为上下文使用）](https://github.com/earendil-works/pi/blob/47610217098d9ba8f22d223fa7c1413f9f5fd759/packages/coding-agent/src/core/compaction/compaction.ts#L463-L498) 提示词规定了目标（goal）、进展（progress）和关键决策（key decisions）几个小节。
3. 这是一个独立请求，不携带任何现有会话历史，这意味着它可以使用另一个 LLM 模型而不产生任何不必要的成本。

Compaction 的结果会作为一条 compaction 条目追加到 Pi 会话中，然后会话就可以继续了。经过这次 compaction 请求，上下文已被压缩。

```text
compaction 之后：
[system][tools][summary][最近的 turns][新的用户消息]
```

现在，会话上下文里又有了容纳许多新消息的空间。

Pi 把 compaction 摘要以纯文本形式存储在会话中。这让压缩后的上下文保持可读且[可移植](https://earendil.com/posts/session-portability)——因为我们可以在 Pi 中切换模型，并继续使用这份摘要。

## Compaction 与 prompt caching

LLM 提供商用 [prompt caching](https://earendil.com/posts/prompt-caching) 来降低同一会话中重复请求的成本。在一次活跃的编码会话中，我们为模型已经生成过的上下文支付更少的费用。这种缓存要求前缀精确匹配，所以对会话做 compaction 会打破 prompt cache。

```text
compaction 之前的缓存：
[system][tools][较早的历史][保留的最近 turns]
<-------------------- 缓存前缀 -------------------->

compaction 之后的第一个请求：
[system][tools][summary][保留的最近 turns][新的用户消息]
<--- 可复用 --->^
                |
          第一个变化的 token
                |
                +-- 此点之后的一切都必须重新计算
```

保留下来的 turns 包含的 token 与之前完全相同，但它们现在跟在一个不同的前缀后面。因此它们之前的缓存状态无法被复用。

Compaction 之后的新请求将重新受益于 prompt caching。

## 动手实验

由于 Pi 是可扩展、可塑造的，你可以用自己的实现替换它的 compaction。要测试一种不同的 compaction 机制，可以让 Pi 创建一个带有自定义 compaction 提示词的扩展。
