# references/ — 外部资源索引

相关文章、仓库、工具的统一索引。这里是指针，不是内容本身。

## 文件约定

- 按主题分文件，如 `articles.md`、`repos.md`、`tools.md`
- 每条记录包含：链接、一句话说明、与 Harness Engineering 的关联

## 文章

详见 [articles.md](articles.md) — 完整的文章索引，含三条脉络 **79 篇文章 + 1 项已跟踪产品** 的深度摘要。
权威计数与编号规则以 `articles.md` 头部为准；本表是它的概览缓存。

### 脉络一：AI 时代的 Harness Engineering（75 篇）

| # | 文章 | 作者 | 核心贡献 |
|---|------|------|---------|
| 1 | [OpenAI 原文](https://openai.com/zh-Hans-CN/index/harness-engineering/) | Ryan Lopopolo | 原点：六大概念 |
| 2 | [Martin Fowler](https://martinfowler.com/articles/harness-engineering.html) | Birgitta Böckeler | Guides×Sensors 控制论框架 + Harnessability + Ashby 定律 |
| 3 | [LangChain](https://blog.langchain.com/the-anatomy-of-an-agent-harness/) | Vivek Trivedy | 精确定义 + 组件清单 |
| 4 | [Anthropic](https://www.anthropic.com/engineering/harness-design-long-running-apps) | Prithvi Rajasekaran | GAN 三智能体 + Harness 瘦身 |
| 5 | [HumanLayer](https://www.humanlayer.dev/blog/skill-issue-harness-engineering-for-coding-agents) | Kyle | 六个杠杆 + 实战避坑 |
| 6 | [Anthropic/Claude Platform](https://claude.com/blog/harnessing-claudes-intelligence) | Lance Martin | 三大构建模式 + BrowseComp 数据 |
| 7 | [Anthropic/Managed Agents](https://www.anthropic.com/engineering/managed-agents) | Lance Martin 等 | Meta-harness + 基础设施解耦 |
| 8 | [Fowler/Encoding Team Standards](https://martinfowler.com/articles/reduce-friction-ai/encoding-team-standards.html) | Rahul Garg | 团队标准显式化三层路径 |
| 9 | [Fowler/Feedback Flywheel](https://martinfowler.com/articles/reduce-friction-ai/feedback-flywheel.html) | Rahul Garg | 从 AI 失败中持续学习的反馈闭环 |
| 10 | [LangChain/Agent Evaluation Checklist](https://blog.langchain.com/agent-evaluation-readiness-checklist/) | LangChain 团队 | 智能体评估五阶段清单 |
| 11 | [Meta-Harness 论文](https://arxiv.org/abs/2603.28052) | Yoonho Lee 等 (Stanford) | 自动化 Harness 搜索优化 |
| 12 | [GitHub/Agent-driven Development](https://github.blog/ai-and-ml/github-copilot/agent-driven-development-in-copilot-applied-science/) | Tyler McGoffin | 智能体驱动开发实战 |
| 13 | [Inside the Scaffold 论文](https://arxiv.org/html/2604.03515v1) | Benjamin Rombaut (Huawei) | 13 个编码智能体脚手架源代码分类法 |
| 14 | ⭐ [Eight years of wanting](https://lalitm.com/post/building-syntaqlite-ai/) | Lalit Maganti | AI 构建真实项目的坦诚复盘 |
| 15 | [Continual learning for AI agents](https://blog.langchain.com/continual-learning-for-ai-agents/) | Harrison Chase | 三层学习：模型/Harness/上下文 |
| 16 | [OpenAI Symphony](https://openai.com/index/open-source-codex-orchestration-symphony/) | Kotliarskyi 等 | 任务跟踪器作为控制平面 + SPEC/WORKFLOW 即产品 |
| 17 | [Claude Code Architecture](https://vrungta.substack.com/p/claude-code-architecture-reverse) | Vikash Rungta | Claude Code 运行外壳、TAOR 循环、工具原语、权限与上下文管理的外部逆向分析 |
| 18 | [Harness 系列文章之 7：关于 subagent](https://x.com/dongxi_nlp/status/2068922428516892998) | 马东锡 NLP | Subagent = tool call 入口 + child runtime；区分 session/context/subagent 与 evidence 回流 |
| 19 | [Fowler/Maintainability sensors](https://martinfowler.com/articles/sensors-for-coding-agents.html) | Birgitta Böckeler | 计算性 vs 推理性传感器谱系 + 失败案例 + AI 评审作为垃圾回收 |
| 20 | [Fowler/SPDD](https://martinfowler.com/articles/structured-prompt-driven/) | Wei Zhang, Jessie Jie Xia | REASONS Canvas 七维 + prompt 即一等交付物 + 双向闭环 |
| 21 | [LangChain/ADLC](https://www.langchain.com/blog/the-agent-development-lifecycle) | Harrison Chase | 智能体开发生命周期 + framework/runtime/harness 三分类 |
| 22 | [LangChain/Interpreters in Deep Agents](https://www.langchain.com/blog/give-your-agents-an-interpreter) | Hunter Lovell | interpreter 是第三类上下文表面 + 35% token 节省 |
| 23 | [Anthropic/质量回归复盘](https://www.anthropic.com/engineering/april-23-postmortem) | Anthropic 工程团队 | 三起独立变更叠加成质量退化 + 变更治理清单（第一手反例） |
| 24 | [Agentic Harness Engineering 论文](https://arxiv.org/html/2604.25850v4) | Jiahang Lin 等（复旦/北大/奇绩） | 可观测性驱动的 Harness 自动演化 + 每次编辑即可证伪契约 |
| 25 | [Overeager Coding Agents 论文](https://arxiv.org/html/2605.18583v1) | Yubin Qu 等 | 越界动作测量 + 提示声明授权反而降低边界推断 |
| 26 | [How I Use AI to Code](https://chrismdp.com/coding-with-ai/) | Chris Parsons | 四要素 Harness + 从批准者到训练者 + 反馈是新瓶颈 |
| 27 | [How we built LangSmith Engine](https://www.langchain.com/blog/how-we-built-langsmith-engine-our-agent-for-improving-agents) | Palash Shah | 用智能体改进智能体 + trace→轨迹骨架 + screener/investigator 两阶段闭环 |
| 28 | [Ralph 原始文章 + 续篇](https://ghuntley.com/ralph/) | Geoffrey Huntley | Ralph = bash 循环 + 每轮干净上下文 + 背压；单体反多智能体论（还上 practice/ Ralph Demo 的理论债） |
| 29 | [My AI Adoption Journey](https://mitchellh.com/writing/my-ai-adoption-journey) | Mitchell Hashimoto | 六步采纳路线 + "harness engineering" 命名出处（由延伸阅读升格） |
| 30 | [Claude Code 源码泄漏事件](https://github.com/pankaj28843/understanding-claude-code) | Chaofan Shou 发现 / 社区聚合分析 | 512K 行 harness 实锤解剖：QueryEngine/60+ 门控工具/KAIROS/AutoDream，#17 推测的对照组 |
| 31 | [Agent Harness Engineering](https://addyosmani.com/blog/agent-harness-engineering/) | Addy Osmani | 学科汇流综合 + 约束加减法纪律 + hooks 分界论 + HaaS（综述破例进编号正文） |
| 32 | [Exploring AI coding sensors](https://www.thoughtworks.com/en-au/insights/blog/generative-ai/harness-engineering-agent-feedback-exploring-ai-coding-sensors) | Böckeler & Ford | 有/无传感器对照实验 + 态势感知论 + harness 模板展望 |
| 33 | [HarnessAudit 论文](https://arxiv.org/abs/2605.14271) | Chengzhi Liu 等 | harness 安全审计：中途轨迹违规是输出级评估的盲区 + 210 任务基准 |
| 34 | [Harness-Bench 论文](https://arxiv.org/abs/2605.27922) | Yilun Yao 等 | 配置级 harness 效应测量（106 任务/5194 轨迹）+ 执行对齐失败分类 |
| 35 | [How good is your harness? 论文](https://openreview.net/forum?id=QI8z3skBwt) | Jiwoo Han, Yuekai Sun | Terminal-Bench 2.0 榜单方差统计归因：harness 效应 ≈ 模型效应，且效应异质 |
| 36 | [Dynamic workflows in Claude Code](https://claude.com/blog/a-harness-for-every-task-dynamic-workflows-in-claude-code) | Anthropic / Claude | 模型现场写自己的编排 harness + 对抗验证 + workflow 沉淀为 Skill |
| 37 | [Harness 才是产品](https://sotasync.com/reader/2026-06-09-dongxi-nlp-harness-is-the-product/) | 马东锡 NLP | "Model 在 loop 里，harness 拥有 loop" + 六组件 + 症状→组件 debug 对照表 |
| 38 | [Position: 基准错位论文](https://arxiv.org/abs/2606.17799) | Maria I. Gorinova 等 | 基准把 model/harness/环境折叠进一个分数的三症状诊断 |
| 39 | [Unrolling the Codex agent loop](https://openai.com/index/unrolling-the-codex-agent-loop/) | Michael Bolin (OpenAI) | Codex harness 解剖·上：prompt 构造 / 二次方问题与 prompt caching / compaction 端点化 |
| 40 | [Unlocking the Codex harness](https://openai.com/index/unlocking-the-codex-harness/) | Celia Chen (OpenAI) | Codex harness 解剖·下：App Server 双向 JSON-RPC + Item/Turn/Thread 原语 + HaaS 落地 |
| 41 | [Loop Engineering](https://addyosmani.com/blog/loop-engineering/) | Addy Osmani | loop 定调文：五构件 + 记忆脊柱；"循环分不出两种用法的区别，你分得出" |
| 42 | [The Coming Loop](https://lucumr.pocoo.org/2026/6/23/the-coming-loop/) | Armin Ronacher | 怀疑派回应：agent loop vs harness loop + 防御式编码放大 + 软件作为有机体 |
| 43 | [Loop engineering: Getting started with loops](https://claude.com/blog/getting-started-with-loops) | Claude Code 团队 | 官方四类循环（turn/goal/time/proactive）+ `/goal` 独立判停 + 用量治理清单 |
| 44 | [Self-Harness 论文](https://arxiv.org/abs/2606.09498) | Hangfan Zhang 等 | 智能体自改 harness：弱点挖掘→提议→回归验证；三模型 held-out +14~21pp |
| 45 | [Harness Engineering for Self-Improvement](https://lilianweng.github.io/posts/2026-07-04-harness/) | Lilian Weng | RSI 综述：三设计模式 + 优化对象递进链 + 七项未来挑战 + "harness 终将内化"预测 |
| 46 | [Aria：自动软件验证论文](https://arxiv.org/abs/2607.06341) | Shuangxiang Kan 等 | 行为 harness 极限形态：声明式 HHL 包裹通用智能体做 Coq 证明，全引理零人工通过 |
| 47 | [Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) | Mikaela Grace 等 (Anthropic) | 智能体评测官方方法论：outcome≠transcript、pass@k/pass^k、评结果不评路径、CORE-Bench 42%→95% 基准病理 |
| 48 | [Scaling long-running autonomous coding](https://cursor.com/blog/scaling-agents) | Wilson Lin (Cursor) | 数百并发智能体 × 数周：扁平自协调失败史 → planner/worker/judge；FastRender 百万行浏览器 |
| 49 | [Building a C compiler with parallel Claudes](https://www.anthropic.com/engineering/building-c-compiler) | Nicholas Carlini (Anthropic) | 16 agent 无编排者造 10 万行 C 编译器（$20k/两周）：近乎完美验证器 + GCC oracle + 为 Claude 写测试 |
| 50 | [How we contain Claude across products](https://www.anthropic.com/engineering/how-we-contain-claude) | Max McGuinness 等 (Anthropic) | 三隔离模式 × 五起漏掉的风险：白名单是能力授予；先环境层遏制再模型层引导 |
| 51 | [Deep Agents 动态子智能体 + RLM](https://www.langchain.com/blog/introducing-dynamic-subagents-in-deep-agents) | LangChain 团队 | 模型写编排脚本驱动 subagent（QuickJS + `task()`）；RLM 处理超上下文两个数量级的输入 |
| 52 | [Böckeler 本地模型双备忘录](https://martinfowler.com/articles/exploring-gen-ai/local-models-for-coding-factors.html) | Birgitta Böckeler | 高端开发机跑本地小模型做智能体编码实测：Qwen3.6 35B MoE 甜点、工具调用是分水岭 |
| 53 | [Harness Handbook 论文](https://arxiv.org/abs/2607.13285) | Ruhan Wang 等（腾讯等） | 行为定位是 harness 演化瓶颈：行为中心表示 + BGPD，win rate +10.0/+18.9pp 且省 12.7%/8.6% token |
| 54 | [DSLs Enable Reliable Use of LLMs](https://martinfowler.com/articles/llm-and-dsls.html) | Unmesh Joshi | "DSL 工具集本身就是出色的 harness"：语言层约束 + 确定性验证器 + 领域级错误反馈 |
| 55 | [Own the Outer Loop](https://addyosmani.com/blog/own-the-outer-loop/) | Addy Osmani | 智能体跑内环、工程师拥有外环问责；back-pressure 调节循环速率与作用域来授予自主权 |
| 56 | [Rewriting Bun in Rust](https://bun.sh/blog/bun-in-rust) | Jarred Sumner | "修流程不修代码"工业级实录：50 dynamic workflows × 64 Claude × 11 天移植 53.5 万行 Zig；语言无关测试套件作 oracle + 对抗评审默认化 |
| 57 | [HarnessX 论文](https://arxiv.org/abs/2606.14249) | Darwin Agent Team（小米） | harness 一等类型化对象 + AEGIS 轨迹演化 + cross-harness GRPO 共演化：+14.5%（共演化再 +4.7%），弱模型受益最大 |
| 58 | [Anthropic/长时智能体的有效 harness](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) | Justin Young | 外部工件即记忆的奠基文：initializer + coding 两段式、200+ 条 feature_list.json、progress 文件 + git、Puppeteer 端到端自验（存量回扫补录） |
| 59 | [Anthropic/基础设施噪声](https://www.anthropic.com/engineering/infrastructure-noise) | Gian Segato | 只改资源配额，Terminal-Bench 2.0 摆动 6pp；1x–3x 修可靠性、3x 以上改变被测对象；"低于 3pp 的榜单差距都该怀疑" |
| 60 | [Cursor/持续改进 agent harness](https://cursor.com/blog/continually-improving-agent-harness) | Stefan Heule & Jediah Katz | harness 运维的度量学：Keep Rate、LLM 读用户回复判满意、错误分类与按工具按模型基线、每周 Automation 修 harness；按训练分布供给工具格式 |
| 61 | [Cursor/奖励作弊淹没智能增益](https://cursor.com/blog/reward-hacking-coding-benchmarks) | Naman Jain | 审计 731 条轨迹：SWE-bench Pro 上 63% 的成功解是检索答案而非推导；封 git+断网后 Opus 4.8 Max 87.1%→73.0% |
| 62 | [Better Models: Worse Tools](https://lucumr.pocoo.org/2026/7/4/better-models-worse-tools/) | Armin Ronacher | 工具 schema 不是中立的：在宽容 harness 里做 RL，新模型对替代 schema 反而更差；跨模型可移植性的机制级坏消息 |
| 63 | [为什么软件工厂会失败](https://github.com/humanlayer/advanced-context-engineering-for-coding-agents/blob/main/wsff.md) | Dex Horthy (HumanLayer) | "harness engineering 还不够"：可维护性没有快 oracle，RL 不惩罚坏设计；熄灯工厂第一手失败实录 + 四阶段前移方案 |
| 64 | [Software Factories, Light and Dark](https://addyosmani.com/blog/software-factories/) | Addy Osmani | loop→harness→factory 三层 + 唯一昂贵的评审闸门 + 背压规则 + "什么样的循环配得上熄灯"准入清单 |
| 65 | [智能体蜂群与新的模型经济学](https://cursor.com/blog/agent-swarm-model-economics) | Wilson Lin (Cursor) | 从 835 页手册重造 SQLite：质量趋同、账单从 $1,339 到 $10,565；规划/执行分层、自建 VCS（1000 提交/秒）、去相关评审、Field Guide |
| 66 | [Claude 5 世代的上下文工程新规则](https://claude.com/blog/the-new-rules-of-context-engineering-for-claude-5-generation-models) | Thariq Shihipar (Anthropic) | 删掉 Claude Code 系统提示词 80%+ 而编码评测无可测损失；七组 then/now 对照 + `claude doctor` |
| 67 | [Don't Blame the LLM 论文](https://arxiv.org/abs/2607.03691) | Oussama Ben Sghaier 等（Queen's） | 首个固定模型、只变 harness 的受控纵向研究：Qwen Code CLI 35 个连续版本 × 50 个 SWE-bench Verified 任务 |
| 68 | [Rethinking Harness Evolution 论文](https://arxiv.org/abs/2607.12227) | Yike Wang 等 | 自动 harness 演化的第一份系统性负面结果：同等预算下不稳定优于简单 test-time scaling，泛化有限 |
| 69 | [LangChain/Harbor 评测栈](https://www.langchain.com/blog/how-we-benchmark-deep-agents) | Nick Hollon, Harrison Chase 等 | 给 harness 建标尺（Harbor-Index 82 任务 / lite 子集 / capability suite），再给标尺建标尺（IssueBench 15 类失败分类法） |
| 70 | [LangChain/ReviewBench](https://www.langchain.com/blog/evaluating-code-review-agents-with-reviewbench) | Nick Hollon | 给"AI 代码评审"传感器造考卷：真实 PR 评审意见策展成 59 任务；裸 harness 最强召回 ~30%，prompt-only 调优 0.13→0.32 反超 |
| 71 | [Fowler/TDD in the agent loop](https://martinfowler.com/articles/exploring-gen-ai/tdd-in-the-agent-loop.html) | Birgitta Böckeler | agent loop 内 TDD 的实证否定：盲评质量无差异、token 3–8.5 倍；别规定过程，度量结果 |
| 72 | [Osmani/Practical Loop Engineering](https://addyosmani.com/blog/practical-loop-engineering/) | Addy Osmani | loop 系列日常落地环：踩坑实录（差点连判断也委托）+ 分诊循环 + fine print 运维细则 |
| 73 | [Zalando 组织级快照](https://engineering.zalando.com/posts/2026/08/agentic-engineering-at-zalando-a-snapshot.html) | Bartosz Ocytko | 250+ 团队非供应商第一人称：事故分析→风险分级→33% 自动放行→lead time -20~40% 的组织级反馈回路 |
| 74 | [Earendil/Pi 双篇](https://earendil.com/posts/what-is-a-harness/) | Pi 团队 | harness 定义+用户侧中立主张 / compaction 白盒实现（20K 预算、独立请求、纯文本可移植）——与 #39 端点化恰成对照 |
| 75 | [⭐ StarHarness 论文](https://arxiv.org/abs/2608.24804) | ServiceNow/Mila | 冻结 harness 工件跨 GPT/Qwen 迁移 12 行全正（+10.7~+46.3pp）；跨模型可移植性缺口首个正面证据 |

### 脉络二：云原生 Harness.io（2 篇）

| # | 文章 | 核心贡献 |
|---|------|---------|
| 76 | [Harness.io 官方](https://www.harness.io/blog/understanding-ci-cd-platforms-the-backbone-of-modern-devops) | CI/CD 平台全局架构 |
| 77 | [Google Cloud Architecture](https://docs.cloud.google.com/architecture/partners/harness-cicd-pipeline-for-rag-app) | Harness + GCP 部署 RAG |

### 脉络三：效率悖论与能力进化（2 篇）

| # | 文章 | 核心贡献 |
|---|------|---------|
| 78 | [YDD / Miss-you](https://yousali.com/posts/20260303-ai-coding-efficiency-to-evolution/) | 效率悖论的系统性拆解：约束理论 + Spec/Rule/Skill + 验证闭环 + 并发 |
| 79 | [METR 实验后续 + 自报调查](https://metr.org/blog/2026-02-24-uplift-update/) | "慢 19%" 的官方后续：弱证据转向加速 + AI 渗透破坏 RCT 可行性本身 |

### 已跟踪产品 / 项目（不计入文章数）

| 项 | 项目 | 说明 |
|---|------|------|
| ⭐ | [Chachamaru127 / claude-code-harness v4.2 "Hokage"](https://github.com/Chachamaru127/claude-code-harness/tree/v4.2.0) | Claude Code 上当下最完整的开源 harness 实现之一；Plan→Work→Review→Release 五动词 + Go 原生 R01–R13 guardrail。本仓库分析见 `thinking/guides-sensors-meets-claude-code-harness.md` |

## 项目

### Ralph 系列

| 项目 | Stars | 说明 | 关联概念 |
|------|-------|------|---------|
| [snarktank/ralph](https://github.com/snarktank/ralph) | 13.6k | 原版 Ralph 循环：bash + PRD + 每次清空上下文 | 全部六大概念的最小实现 |
| [ralph-orchestrator](https://mikeyobrien.github.io/ralph-orchestrator/) | 2.3k | Rust 版：Hat 角色 + 事件驱动 + 背压 | 机械化执行、熵管理 |
| [bmad-ralph](https://github.com/qianxiaofeng/bmad-ralph) | 2 | BMAD + Ralph：并行 worktree + 三层自愈 | 自主水平提升、吞吐量 |

### 社区

| 资源 | 说明 | 关联 |
|------|------|------|
| [vibe-coding-cn](https://github.com/tukuaiai/vibe-coding-cn) | 中文 Vibe Coding 社区 | 仓库组织方式、AGENTS.md 分级 |

### 延伸阅读

| 资源 | 说明 |
|------|------|
| [Martin Fowler: Context Engineering for Coding Agents](https://martinfowler.com/articles/context-engineering-coding-agents.html) | Context Engineering 专题 |
| [Martin Fowler: Humans and Agents in SE Loops](https://martinfowler.com/articles/humans-and-agents.html) | 人类与智能体的协作模式 |

> Mitchell Hashimoto 的 My AI Adoption Journey 原在此表，2026-07 已升格为编号条目 #29。

## 待补充

> 占位条目统一收在这里，**不进 `articles.md` 的编号正文**，避免污染文章计数。

- [x] Geoffrey Huntley 的 Ralph 原始文章 → 已收录为 #28（2026-07）
- [x] OpenAI Codex harness 解剖二部曲 → 已收录为 #39（Unrolling the Codex agent loop）+ #40（Unlocking the Codex harness / App Server）（2026-07-15）
- [ ] 马东锡 Harness 系列其余篇目（仓库已收 #18 之 7、#37 才是产品；2026-07 系列新帖包括"Model 可以请求，Harness 负责裁决——这就是契约""模型记住的是 transcript，Harness 必须记住 truth（File State 是合格 harness 的基本功）"；X 原帖需本地工具抓取）
- [ ] Medium 实战专栏 — "Beyond Migration: How We Engineered a Secure & Intelligent Delivery Platform with Harness CICD"（标题可能已变更或文章已下架）

## 下一步

读完一篇资料后：
- 想对它的论点做独立分析或质疑 → [thinking/](../thinking/)
- 想翻译为中文输出 → [works/](../works/)
- 想用它的方法做实验 → [practice/](../practice/)
- 想沉淀其中的提示词模板 → [prompts/](../prompts/)
