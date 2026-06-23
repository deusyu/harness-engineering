# Subagent 不是小号智能体，而是 child runtime

马东锡 NLP 的《Harness 系列文章之 7：关于 subagent》补上了一个此前容易被产品描述遮住的层次：subagent 在外层表现为一次 tool call，在内层却意味着 Harness 新开了一个 child runtime。这个说法与 [Claude Code 架构（逆向工程版）](../works/claude-code-architecture-reverse-translation.md) 的 subagent 描述高度相关，但两者站在不同抽象层。

## 相关性在哪里

Claude Code 逆向文把 subagent 放在“上下文经济性”里：主智能体把探索、研究、评审这类重任务委派出去，child 在自己的 TAOR 循环里消耗 token，最后只把摘要返回给 parent。它回答的是产品架构问题：**subagent 解决什么失败模式？** 答案是上下文坍缩、单体上下文和单线程瓶颈。

马东锡这篇则把同一个机制拆到 Harness runtime 层：subagent 的启动入口是一次 tool call（原文用 `spawn_agent` / `/delegate` 作示意，Claude Code 里对应的是 Task 工具），但 tool call 完成后，世界状态里多了一个 child session。它回答的是运行时语义问题：**subagent 究竟是什么？** 答案不是一个“小一点的智能体”，而是 parent session 下的 managed child runtime。

两篇放在一起，能形成一组上下对应：

| Claude Code 逆向文 | 马东锡 subagent 文 |
|---|---|
| 子智能体在隔离上下文窗口里运行自己的 TAOR 循环 | subagent 是 parent session 下新开的 child session |
| 主窗口只收到 summary，避免 transcript 污染 | shared resources 不代表 shared transcript |
| Explore / Plan / General-purpose 是不同产品角色 | fresh / forked / partial fork 描述 child 拿到多少 context（实际多为 prompt 构造，见下文质疑二） |
| skills、agents、agent teams 构成成本与隔离度光谱 | session、context、subagent 区分 runtime container 与 model-call projection |

## 真正关键的区分

这篇最有价值的句子是：**shared resources 不代表 shared transcript**。

这句话解释了为什么“给 subagent 同样的 tools、cwd、permissions、AGENTS.md”并不等于“它知道 parent 知道的一切”。资源继承只是能力边界，transcript 投影才是认知边界。一个 child 可以在同一个仓库、同一个 sandbox、同一套工具里工作，却只拿到 parent 精心裁剪过的一段 context slice。

这也把 session 和 context 的混淆拆开了：

- session 是 runtime container，负责 thread、transcript、tools、permissions、resources、status、artifacts。
- context 是某次 model call 可见的 projection，包含 instructions、skills、AGENTS.md、recent turns、summaries、tool results、file state。
- subagent 是 parent session 下面的新 child session，它继承一部分资源，但不自动继承完整 transcript。

所以，subagent 的设计难点不是“是否并行”这么简单，而是 parent 如何回答三个问题：给它什么资源、投影什么上下文、回收什么 evidence。

## 对 Harness Engineering 的补充

此前几篇文章已经把 subagent 放进 Harness 组件清单：

- LangChain 的 Anatomy 把 sub-agents 列为编排逻辑的一部分。
- HumanLayer 把 sub-agent 视为防 context rot 的上下文防火墙。
- Claude Code 逆向文把 subagent 放在技能、forked context、agent teams 之间，作为隔离度和成本的中间层。

马东锡这篇的贡献，是把它从“组件”进一步改写为“runtime state expansion”。每启动一个 subagent，Harness 不是简单多了一个工作者，而是多了一组需要管理的状态：child session 的目标、上下文来源、工具权限、执行痕迹、修改范围、完成条件和 evidence 回流方式。

这也解释了为什么“更多 agents 不保证更好的工作”。更多 agents 增加的是 runtime state，不是自动增加的智能。Harness 如果不能追踪谁在工作、知道什么、改了什么、什么时候完成、结果如何进入 parent 的证据链，多智能体只会把单体上下文问题换成分布式状态问题。

## 这篇的边界：三处我会摁住质疑的地方

上面是顺着原文把它讲透。但 `thinking/` 的职责是摁住质疑，所以以它自己锚定的 Claude Code 逆向文为尺子，这篇至少有三处没说到位：

**一、真正的硬约束是「投影 / 回传」的不对称，原文只把它当成清单一项。** parent 可以向 child 富投影（goal、files、instructions、一段被裁剪的 context slice），child 回来的却只有它**主动 emit 的那一段**。更精确地说：逆向文 L296 写明 subagent transcript 其实持久化在磁盘、可 resume——所以不是「child 的工作被丢了」，而是 **parent 的 context 默认只拿到 summary，看不见 child 的过程**。盘上有全量、parent 只见摘要，这个张力才是 subagent 设计的定义性约束。原文结尾「results 如何变成 evidence」说的就是它，却没和开头「tool call」的框架接上。设计 subagent 的难点不在「投什么进去」，而在「parent 如何只凭一段回传的 evidence 合并 child 的世界状态」。

**二、fresh / forked / partial 不是 parent 自由旋的旋钮，多数时候是「prompt 构造」。** 原文（以及上面的对应表）把三者讲得像 parent 能任选的投影模式。但逆向文 L199 自己写的是「子智能体 **fork 隔离的** TAOR 循环」——Claude Code 的 child 默认就是**隔离 / fresh** 的，并不会继承 parent 的活 transcript。所谓 forked child / partial fork，实际是你**把多少 context 塞进 spawn prompt 去模拟**出来的，不是一个真实存在的内存 fork 开关。这把实践重心从「选哪种 fork」挪回到「怎么给 child 写 prompt」——后者才是可练的技能。

**三、「subagent workflow」一节原文是空的，恰恰是增量最大的地方。** 原文写到「如何组织多个 subagent 非常有挑战」就停了。而本仓库已有的材料能把这块填实：逆向文的 agent teams（同级进程、共享文件系统、双向通信，区别于子进程式的 subagent）、Anthropic #4 的 Planner/Generator/Evaluator 三体 GAN、Inside the Scaffold 的五种 loop 原语。编排的难点不是「开几个 agent」，而是**谁是子进程、谁是同级、证据怎么汇流、文件写入怎么不打架**（这也是 worktree 隔离存在的原因）。

一句话：原文（和 codex 这版的阐释）让 subagent 这套说法**显得更对**；而上面三点想让它**显得更可疑**——可疑之处正是它最该往下挖的地方。

## 我的判断

这篇适合接在 Claude Code 逆向文之后读。Claude Code 逆向文告诉我们 subagent 在产品里长什么样，马东锡这篇则告诉我们它在 Harness 里意味着什么。

对这个仓库来说，它最值得沉淀的不是“subagent 可以并行”这个常识，而是一个更硬的定义：

> Subagent = tool-call-triggered child session + selected context projection + scoped resource inheritance + evidence-return contract。

如果要把它变成实践规则，我会写成一句话：

> 不要问“要不要开 subagent”，先问“这个 child runtime 需要继承什么资源、看到什么上下文、产出什么证据，以及 parent 如何合并它的世界状态”。
