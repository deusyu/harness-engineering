---
sourceTitle: "Eight years of wanting, three months of building with AI - Lalit Maganti"
sourceUrl: "https://lalitm.com/post/building-syntaqlite-ai/"
sourceRequestedUrl: "https://lalitm.com/post/building-syntaqlite-ai/"
sourceAuthor: "Lalit Maganti"
sourceSiteName: "Lalit Maganti"
sourcePublishedAt: "2026-04-05T13:00:00+01:00"
sourceSummary: |-
  For eight years, I've wanted a high-quality set of devtools for working with
  SQLite. Given how important SQLite is to the industry, I've long been puzzled that no one has invested in building
  a really good developer experience for it.
  A couple of weeks ago, after ~250 hours of effort over three months on evenings, weekends, and vacation days, I finally
  released syntaqlite
  (GitHub), fulfilling this
  long-held wish. And I believe the main reason this happened was because of AI
  coding agents.
sourceAdapter: "generic"
sourceCapturedAt: "2026-04-14T05:34:07.062Z"
sourceConversionMethod: "defuddle"
sourceKind: "generic/article"
sourceLanguage: "en"
title: "渴望了八年，用 AI 三个月造出来"
author: "Lalit Maganti"
summary: |-
  八年来，我一直想要一套高质量的 SQLite 开发工具。考虑到 SQLite 在业界的重要性，我始终困惑为什么没人愿意在上面投入，打造真正优秀的开发体验。
  几周前，经过三个月里约 250 小时的业余投入，我终于发布了 syntaqlite，实现了这个多年的心愿。我认为这件事能成，主要归功于 AI 编码智能体。
language: "zh-CN"
---

# 渴望了八年，用 AI 三个月造出来

八年来，我一直想要一套高质量的 SQLite 开发工具。SQLite 对整个行业如此重要 <sup><a href="https://lalitm.com/post/building-syntaqlite-ai/#sn-sqlite-industry">1</a></sup>，我始终困惑，为什么没人愿意在上面投入，打造真正优秀的开发体验 <sup><a href="https://lalitm.com/post/building-syntaqlite-ai/#sn-devtools">2</a></sup>。

几周前，经过三个月里下班后、周末和假期大约 250 小时的投入 <sup><a href="https://lalitm.com/post/building-syntaqlite-ai/#sn-hours">3</a></sup>，我终于[发布了 syntaqlite](https://lalitm.com/post/syntaqlite/)（[GitHub](https://github.com/LalitMaganti/syntaqlite)），实现了这个多年的心愿。我相信这件事能成，主要归功于 AI 编码智能体（coding agents）<sup><a href="https://lalitm.com/post/building-syntaqlite-ai/#sn-codingtools">4</a></sup>。

当然，宣称 AI 一次性搞定整个项目的帖子满天飞，反过来说 AI 全是垃圾的声音也不少。我打算走一条完全不同的路：系统地拆解我用 AI 构建 syntaqlite 的经历，既讲它*帮上忙*的地方，也讲它*帮倒忙*的地方。

在这个过程中，我会交代项目背景和我自己的技术经历，方便你自行判断这段经验有多大的普适性。每当我做出某个论断，我都会尽量用项目日志、编码记录或提交历史来佐证 <sup><a href="https://lalitm.com/post/building-syntaqlite-ai/#sn-evidence">5</a></sup>。

## 为什么我想做这件事

在 [Perfetto](https://docs.perfetto.dev/) 项目中，我负责维护一门基于 SQLite 的查询语言，叫做 [PerfettoSQL](https://perfetto.dev/docs/analysis/perfetto-sql-getting-started)，专门用于查询性能 trace。它基本就是 SQLite，只是加了一些扩展来提升 trace 查询体验。Google 内部有大约 10 万行 PerfettoSQL 代码，使用范围涵盖许多团队。

一门语言一旦有了用户基础，用户自然就会期望配套的格式化器（formatter）、代码检查器（linter）和编辑器扩展。我本来希望能从开源社区找到现成的 SQLite 工具来适配，但调研越深越失望。找到的工具要么不够可靠，要么不够快 <sup><a href="https://lalitm.com/post/building-syntaqlite-ai/#sn-speed-comparison">6</a></sup>，要么不够灵活，无法适配 PerfettoSQL。从零开始构建显然有机会，但它从来不是"最重要的事"。我们一直勉强使用着现有的工具，心里却始终想要更好的。

另一方面，*确实*有个选项：用业余时间来做。我十几岁的时候做过不少开源项目 <sup><a href="https://lalitm.com/post/building-syntaqlite-ai/#sn-holoirc">7</a></sup>，但上大学后就渐渐没了热情。当维护者远不止"把代码丢出去"看看会怎样。你得处理 bug 报告、排查崩溃、写文档、建社区，最重要的是，为项目把握方向。

但开源那股劲儿从来没消散过——准确地说，是那种自由地做自己想做的事、同时帮到别人的感觉。SQLite 开发工具这个项目一直盘踞在我脑子里，是"总有一天想做的事"。但我迟迟没动手还有一个原因：它既*难*又*枯燥*，两者兼具。

## 难在哪里，又枯燥在哪里

如果我要投入个人时间做这个项目，我不想只做一个只对 Perfetto 有用的东西——我想让它对*所有* SQLite 用户都有用 <sup><a href="https://lalitm.com/post/building-syntaqlite-ai/#sn-ambition">8</a></sup>。这意味着必须*完全*按照 SQLite 的方式来解析 SQL。

任何语言类开发工具的核心都是解析器（parser）。它负责把源代码转化为解析树（parse tree），这是一切上层功能的基础数据结构。如果解析器不准确，格式化器和代码检查器就必然继承这些偏差。我找到的很多工具正是吃了这个亏——它们的解析器只是近似地表示了 SQLite 语言，而不是精确还原。

不幸的是，和其他很多语言不同，SQLite 没有描述其解析方式的正式规范。它也没有暴露稳定的解析器 API。事实上，相当独特的是，SQLite 在其实现中根本不构建解析树 <sup><a href="https://lalitm.com/post/building-syntaqlite-ai/#sn-no-parse-tree">9</a></sup>！在我看来，唯一合理的做法是仔细提取 SQLite 源代码中的相关部分，改造成我需要的解析器 <sup><a href="https://lalitm.com/post/building-syntaqlite-ai/#sn-extraction">10</a></sup>。

这意味着要深入 SQLite 源代码的细节——一个极其难以理解的代码库。整个项目用 C 语言编写，风格[极其密集](https://sqlite.org/src/file?name=src/vdbe.c&ci=trunk)；光是理解虚拟表（virtual table）的 [API](https://www.sqlite.org/vtab.html) <sup><a href="https://lalitm.com/post/building-syntaqlite-ai/#sn-vtab-nuance">11</a></sup> 和[实现](https://sqlite.org/src/file?name=src/vtab.c&ci=trunk)，我就花了好几天。试图弄清整个解析器栈，让人望而却步。

还有一个事实：SQLite 有超过 400 条语法规则，覆盖了其语言的全部范围。我需要在每一条"语法规则"中指定该语法片段如何映射到解析树中的对应节点。这是极其重复的工作——每条规则都和周围的规则相似，但从定义上又各不相同。

而且不光是规则本身，还有设计和编写测试来确保正确性、出错时的调试、以及用户提交的 bug 分类处理和修复……

多年来，这个想法就是死在这一步。作为业余项目太难了 <sup><a href="https://lalitm.com/post/building-syntaqlite-ai/#sn-complexity">12</a></sup>，太枯燥以至于无法维持动力，投入数月最终可能白费的风险又太大。

## 事情是怎么发生的

我从 2025 年初开始使用编码智能体（先是 Aider、Roo Code，然后从 7 月起用 Claude Code），它们确实有用，但从来不是那种让我敢把正经项目交给它们的工具。但到 2025 年底，模型似乎在质量上有了显著突破 <sup><a href="https://lalitm.com/post/building-syntaqlite-ai/#sn-agents-got-good">13</a></sup>。与此同时，我在 Perfetto 里不断遇到原本可以靠一个可靠的解析器轻松解决的问题。每次绕过去之后，脑子里都会冒出同一个念头：也许真的该动手了。

圣诞假期里我有了些时间来思考和沉淀，于是决定真正压力测试一下 AI 的极限版本：能不能仅用 Claude Code 的 Max 计划（200 英镑/月）把整个东西 vibe-code（凭直觉写代码）出来？

整个一月份，我都在迭代，充当半技术的管理者角色，几乎把所有设计和全部实现都委派给 Claude。从功能上说，最终的结果还算不错：一个用 C 语言编写的解析器（从 SQLite 源代码中通过一堆 Python 脚本提取出来）、一个基于其上的格式化器、同时支持 SQLite 语言和 PerfettoSQL 扩展，全部暴露在一个 Web 演练场中。

但当我在一月底仔细审查代码库时，问题暴露无遗：代码库完全是一团意大利面 <sup><a href="https://lalitm.com/post/building-syntaqlite-ai/#sn-spaghetti">14</a></sup>。Python 源码提取流水线有大量我看不懂的部分，函数散落在各个文件里毫无章法，有几个文件膨胀到了数千行。代码*极其*脆弱——它解决了眼前的问题，*但*永远无法承载我更大的愿景，更别提集成到 Perfetto 工具链里了。唯一的收获是它证明了这条路行得通，并且生成了 500 多个测试，其中不少我觉得可以复用。

我决定全部扔掉，从零开始，同时把大部分代码库切换到 Rust <sup><a href="https://lalitm.com/post/building-syntaqlite-ai/#sn-rust-not-c">15</a></sup>。我能预见到 C 语言会让构建验证器（validator）和语言服务器（language server）这样的上层组件变得困难。而且换成 Rust 还有一个好处：可以用同一门语言来做提取和运行时，不用在 C 和 Python 之间来回切换。

更重要的是，我彻底改变了自己在项目中的角色。我把所有决策权拿了回来 <sup><a href="https://lalitm.com/post/building-syntaqlite-ai/#sn-took-control">16</a></sup>，把 AI 当作"打了鸡血的自动补全"来用，嵌入到一个更加紧凑的流程里：先做有主见的设计、逐一仔细审查每个变更、发现问题立刻修、投入脚手架建设（如代码检查、验证和有深度的测试 <sup><a href="https://lalitm.com/post/building-syntaqlite-ai/#sn-scaffolding">17</a></sup>）来自动检查 AI 的产出。

核心功能在二月份逐步成型，最后冲刺阶段（上游测试验证、编辑器扩展、打包、文档）推动了三月中旬 0.1 版本的发布。

但在我看来，这条时间线是整个故事里最不值得展开讲的部分。我真正想聊的，是没有 AI 就不可能发生的事，以及使用 AI 给我带来的代价。

## AI 是这个项目存在的原因，也是它如此完整的原因

### 克服惰性

我[之前写过](https://lalitm.com/llm-motivation-via-emotions/)，作为软件工程师，我最大的弱点之一就是面对一个大的新项目时倾向于拖延。虽然当时没有意识到，但这句话用在构建 syntaqlite 上再恰当不过。

AI 基本上让我把所有的技术顾虑、对是否在做正确的事的不确定、对迈出第一步的犹豫——统统搁置了，取而代之的是非常具体的待解决问题。不再是"我需要弄懂 SQLite 的解析原理"，而是"我需要让 AI 给我建议一个方案，然后我来推翻它、构建更好的" <sup><a href="https://lalitm.com/post/building-syntaqlite-ai/#sn-inertia-journal">18</a></sup>。比起在脑子里无休止地推演设计，我更擅长拿到具体的原型来把玩、对着代码来思考。AI 让我以前所未有的速度到达那个起点。而一旦迈出第一步，后面的每一步都容易得多。

### 代码产出更快

AI 在写代码这件事上确实比我快——前提是代码本身是显而易见的。如果我能把问题拆解成"写一个具有这些行为和参数的函数"或"写一个实现这个接口的类"，AI 会比我更快地实现它，而且关键是，写出来的风格对未来的读者可能更直观。它会给我跳过的地方写文档，按照项目其余部分的风格一致地组织代码，并且坚持使用你在任何语言中都会称为"标准方言"的写法 <sup><a href="https://lalitm.com/post/building-syntaqlite-ai/#sn-standard-dialect">19</a></sup>。

但这种标准化是把双刃剑。对于任何项目中的绝大多数代码来说，标准化正是你想要的：可预测、可读、不意外。但每个项目都有其核心竞争力所在的部分——价值恰恰来自做一些不那么显然的事情。对 syntaqlite 来说，那就是提取流水线和解析器架构。AI 的"归一化"本能在这些地方反而有害，这些部分我不得不深入设计，很多时候干脆自己写。

但硬币的另一面是：让 AI 擅长写简单代码的那种速度，同样让它擅长重构。如果你在用 AI 以工业化规模生成代码，你就*必须*持续不断地重构 <sup><a href="https://lalitm.com/post/building-syntaqlite-ai/#sn-refactoring-journal">20</a></sup>。不重构的话，代码库立刻就会失控。这是 vibe-coding 那个月的核心教训：我重构得不够，代码库变成了我无法理解的东西，最终只能全部推翻。在重写阶段，重构成为了我工作流的核心。每完成一大批生成的代码后，我都会退后一步问自己："这段代码丑吗？"有时 AI 可以清理它。有时是 AI 看不到但我能看到的大尺度抽象问题；我给出方向，让它执行 <sup><a href="https://lalitm.com/post/building-syntaqlite-ai/#sn-refactor-pattern">21</a></sup>。如果你有品味，走错路的代价会大幅降低，因为你可以快速重构 <sup><a href="https://lalitm.com/post/building-syntaqlite-ai/#sn-refactor-taste">22</a></sup>。

### 教学助手

在我使用 AI 的所有方式中，研究学习的投入产出比是最高的。

我之前接触过解释器和解析器，但从未听说过 Wadler-Lindig 美化打印（Wadler-Lindig pretty printing）<sup><a href="https://lalitm.com/post/building-syntaqlite-ai/#sn-wadler-lindig">23</a></sup>。当我需要构建格式化器时，AI 从我能理解的角度给了我一堂具体且可操作的课，并指引我去阅读相关论文。我自己最终也能找到这些内容，但 AI 把原本可能需要一两天阅读的过程压缩成了一次聚焦的对话，让我可以不断追问"这到底为什么能行？"直到真正搞懂。

这种能力延伸到了我从未涉足过的整个领域。我有深厚的 C++ 和 Android 性能分析经验，但几乎没碰过 Rust 工具链或编辑器扩展 API。有了 AI，这不是问题：基本原理相通，术语体系相似，AI 补上了中间的差距 <sup><a href="https://lalitm.com/post/building-syntaqlite-ai/#sn-lateral-moves">24</a></sup>。VS Code 扩展如果让我自己做，光是学习 API 就要一两天才能动手。有了 AI，一个小时内我就有了一个能用的扩展。

AI 在帮我重新熟悉已经好几天没看的项目部分时也极为有用 <sup><a href="https://lalitm.com/post/building-syntaqlite-ai/#sn-context-reacquisition">25</a></sup>。我可以控制深入程度："给我讲讲这个组件"用于快速回顾，"给我一个详细的线性走读"用于深入了解，"审查这个仓库中的 unsafe 用法"用于主动排查问题。当你频繁切换上下文时，丢失上下文的速度很快。AI 让我可以按需恢复。

除了让这个项目得以存在之外，AI 也是它能以如此完整的面貌发布的原因。每个开源项目都有一长串重要但不紧急的功能——那些你理论上知道怎么做，但因为核心工作更紧迫而一再推迟的事情。对 syntaqlite 来说，这个清单很长：编辑器扩展、Python 绑定、WASM 演练场、文档站点、多生态系统的打包 <sup><a href="https://lalitm.com/post/building-syntaqlite-ai/#sn-last-mile-list">26</a></sup>。AI 把这些事情的成本压得足够低，低到跳过它们反而说不过去。

AI 还释放了我在用户体验上的心力 <sup><a href="https://lalitm.com/post/building-syntaqlite-ai/#sn-ux-focus">27</a></sup>。不用把所有时间花在实现上，我可以去思考用户的第一次体验应该是什么样的：什么样的错误信息能真正帮用户修好他们的 SQL，格式化器默认输出应该长什么样，CLI 的参数是否直观。这些才是决定一个工具"用户试一次就丢"还是"长期使用"的关键，而 AI 给了我关注这些的余裕。如果没有 AI，我会做一个小得多的东西，可能没有编辑器扩展，也没有文档站点。AI 不只是让同一个项目做得更快，它改变了这个项目*本身*。

## AI 的代价

### 上瘾

使用 AI 编码工具和玩老虎机之间有一个令人不安的相似之处 <sup><a href="https://lalitm.com/post/building-syntaqlite-ai/#sn-addiction">28</a></sup>。你发一个提示词，等着，然后要么得到很好的结果，要么完全没用。我发现自己深夜还在想"再来一个提示词就好"，明知道可能不会有用还是忍不住让 AI 试试看。沉没成本谬误也开始作祟：即使面对 AI 明显不擅长的任务，我也会不停尝试，告诉自己"也许换个说法就行了"。

越累越差的恶性循环加剧了这个问题 <sup><a href="https://lalitm.com/post/building-syntaqlite-ai/#sn-tiredness-loop">29</a></sup>。精力充沛的时候，我能写出精确、范围明确的提示词，效率真的很高。但累了以后，提示词变得含糊，输出质量下降，然后我再试一次，结果更累。在这种情况下，AI 可能比自己动手写还慢，但要跳出这个循环太难了 <sup><a href="https://lalitm.com/post/building-syntaqlite-ai/#sn-ai-slower">30</a></sup>。

### 失去掌控

项目进行期间，我好几次失去了对代码库的心智模型 <sup><a href="https://lalitm.com/post/building-syntaqlite-ai/#sn-losing-touch">31</a></sup>。不是对整体架构或各部分如何配合的理解，而是日常细节层面的：什么代码在哪个文件里、哪个函数调哪个函数、那些累积起来才能形成一个可工作系统的小决策。一旦这些丢了，就会冒出莫名其妙的问题，而我发现自己对到底哪里出了错完全摸不着头脑。我痛恨那种感觉。

更深层的问题是，失去掌控会导致沟通崩溃 <sup><a href="https://lalitm.com/post/building-syntaqlite-ai/#sn-communication-breakdown">32</a></sup>。当你脑子里没有代码的脉络时，就不可能和智能体进行有效沟通。每次交互都变得更长、更啰嗦。你没法说"把 FooClass 改成做 X"，而是得说"把那个做 Bar 的东西改成做 X"。然后智能体还得搞清楚 Bar 是什么、它怎么对应到 FooClass，有时候它会搞错 <sup><a href="https://lalitm.com/post/building-syntaqlite-ai/#sn-manager-analogy">33</a></sup>。这和工程师们一直抱怨的那种情况一模一样——不懂代码的管理者提出天马行空甚至不可能实现的要求。只不过现在，你自己变成了那个管理者。

解决办法是刻意为之的：我养成了一个习惯，在代码生成后立即通读一遍，积极地去想"如果是我，会怎么做不同的选择？"

当然，从某种意义上说，上面这些对于我几个月前自己写的代码也同样成立（所以才有了["AI 代码从诞生之日起就是遗留代码"](https://text-incubation.com/AI+code+is+legacy+code+from+day+one)的说法），但 AI 让这种漂移发生得更快，因为你没有从自己敲出代码的过程中积累起同样的肌肉记忆。

### 缓慢的腐蚀

还有一些问题，是我在这三个月中逐渐发现的。

我发现 AI 让我在关键设计决策上变得更加拖延 <sup><a href="https://lalitm.com/post/building-syntaqlite-ai/#sn-procrastination">34</a></sup>。因为重构很便宜，我总是可以说"以后再处理"。又因为 AI 重构的规模和它生成代码的规模一样大，推迟的代价看起来也很低。但其实不低：推迟决策侵蚀了我清晰思考的能力，因为在这期间代码库始终处于混乱状态。vibe-coding 那个月是最极端的例子。是的，我理解了问题，但如果我能更有纪律地更早做出艰难的设计决策，本可以更快地收敛到正确的架构。

测试也带来了类似的虚假安全感 <sup><a href="https://lalitm.com/post/building-syntaqlite-ai/#sn-tests-insufficient">35</a></sup>。有 500 多个测试让人觉得安心，AI 又让生成更多测试变得很容易。但无论是人还是 AI，都没有创造力去预见未来会遇到的所有边界情况。在 vibe-coding 阶段有好几次，我想到一个测试用例后才发现某个组件的设计是完全错误的，需要彻底重做。这是我失去信心、决定推倒重来的重要原因。

归根结底，我学到的是：软件工程的"老规矩"在 AI 时代依然适用。如果你没有坚实的根基（清晰的架构、明确的边界），你就会永远在追着 bug 跑。

### 没有时间感

我反复回想到的一件事是 AI 对时间流逝的理解有多么匮乏 <sup><a href="https://lalitm.com/post/building-syntaqlite-ai/#sn-no-sense-of-time">36</a></sup>。它看到的是某个状态下的代码库，但它不会像人类那样*感受*时间。我可以告诉你使用某个 API 的真实体感、它在几个月或几年里是怎么演变的、为什么某些决策先做后撤。

这种时间理解的缺失带来的自然后果是：你要么重犯过去的错误、不得不重新学习那些教训，*要么*掉进一些新坑——而这些坑上一次被成功绕过了——长远来看反而拖慢了你。在我看来，这和团队失去一名优秀的资深工程师是同一种伤害：他们携带着别处不存在的历史和上下文，是周围人的向导。

理论上，你可以尝试通过保持规格文档和设计文档的更新来保存这些上下文。但 AI 出现之前我们就没怎么做这件事，是有原因的：穷尽地记录隐含的设计决策太昂贵、太耗时。AI 可以帮你起草这些文档，但因为无法自动验证它是否准确地捕捉了关键内容，人类仍然需要手动审查结果。这依然耗时。

还有上下文污染的问题。你永远不知道关于 API A 的设计笔记什么时候会在 API B 中产生影响。一致性是代码库能良好运作的关键所在，为此你不仅需要当前工作的上下文，还需要其他以类似方式设计的东西的上下文。判断什么是相关的，恰恰需要机构知识本身所提供的那种判断力。

## 相对论

回顾上述内容，AI 在什么时候帮了忙、什么时候帮倒忙，有一个相当一致的规律。

当我在做自己已经深入理解的事情时，AI 表现出色。我可以立刻审查它的输出，在问题落地之前就抓住它们，并以靠自己永远达不到的速度推进。解析器规则生成是最清晰的例子 <sup><a href="https://lalitm.com/post/building-syntaqlite-ai/#sn-parser-rules">37</a></sup>：我确切地知道每条规则应该产生什么，所以一两分钟内就能审查完 AI 的输出并快速迭代。

当我在做自己能描述但还不了解的事情时，AI 表现不错但需要更多关注。学习 Wadler-Lindig 来构建格式化器就是这种情况：我能说清楚我想要什么，能判断输出是否在正确的方向上，也能从 AI 的解释中学习。但我必须保持参与，不能直接接受它给我的东西。

当我在做自己连想要什么都不清楚的事情时，AI 介于帮不上忙和帮倒忙之间。项目架构是最明显的例子：我在早期花了好几周跟着 AI 走了不少弯路，探索一些在当下感觉很有成效但经不起推敲的设计。事后想想，我不禁怀疑如果完全不用 AI、自己想清楚是否会更快。

但光有专业能力还不够。即使我对一个问题有深入理解，当任务没有客观可检验的答案时，AI 仍然力不从心 <sup><a href="https://lalitm.com/post/building-syntaqlite-ai/#sn-verifiability">38</a></sup>。实现至少在局部层面有正确答案：代码能编译、测试能通过、输出符合预期。但设计没有。面向对象编程问世几十年了，争论到现在都没停。

具体来说，我发现设计 syntaqlite 的公开 API 是这个问题最痛的地方。三月初我花了好几天什么都没做，只是在重构 API——手动修复那些任何有经验的工程师本能上会避免、但 AI 搞得一团糟的问题。没有任何测试或客观指标能衡量"这个 API 是否用起来舒服"和"这个 API 是否能帮用户解决他们的问题"，而这恰恰是编码智能体在这方面表现*如此糟糕*的原因。

这把我带回了曾经痴迷物理学、尤其是相对论的那些日子。物理定律在任何一个小的局部区域看起来都简单而符合牛顿力学，但放大视野，时空以你无法从局部图景预测的方式弯曲。代码也是一样：在一个函数或一个类的层面，通常有明确的正确答案，AI 在这个层面表现出色。但架构，是所有这些局部组件交互时产生的东西，你无法通过拼接局部正确的组件得到良好的全局行为。

在任何给定时刻知道自己处于这些坐标轴的什么位置——在我看来，这是有效使用 AI 的核心技能。

## 总结

在脑子里酝酿一个项目酝酿了八年，这是很长的时间。看到这些 SQLite 工具在仅仅三个月的工作后真正存在并运行起来，是一个巨大的胜利，我完全清楚没有 AI 它们不会在这里。

但这个过程并不是人们通常发帖描述的那种干净、线性的成功故事。我在 vibe-coding 上浪费了整整一个月。我掉进了管理一个自己其实并不理解的代码库的陷阱，并为此付出了全面重写的代价。

我的收获很简单：AI 是实现层面令人难以置信的力量倍增器，但在设计层面却是危险的替代品。它擅长给出具体技术问题的正确答案，但它没有历史感、没有品味，也不知道人类使用你的 API 时的真实感受。如果你在软件的"灵魂"上依赖它，你只会以前所未有的速度撞墙。

我希望看到更多人做我在这里尝试做的事：诚实、详细地讲述用这些工具构建真实软件的经历。不是周末玩具，不是一次性脚本，而是那种需要经受用户使用、bug 报告和你自己不断变化的想法考验的软件。
