# 深度研究追踪 Prompt

> 用途：定期（每 1-2 周）运行，发现 harness engineering / AI 编程领域的高价值新内容
> 推荐工具：ChatGPT Deep Research（广度搜索）→ Claude（深度分析 + 项目关联）

---

## Prompt A：ChatGPT Deep Research — 广度发现

```
你是一个技术情报分析师。请对以下领域进行深度网络搜索，找出过去 2 周内（{START_DATE} 至 {END_DATE}）发布的高价值内容。

### 搜索领域

核心主题：
1. Harness Engineering — AI 编码智能体的约束、引导、反馈系统设计
2. Context Engineering — 上下文窗口管理、compaction、渐进式披露
3. AI Coding Agents — 编码智能体的架构、编排、评估
4. Agent Infrastructure — 沙箱、会话管理、多智能体协作
5. AI-assisted Software Engineering — AI 辅助开发的效率、流程、组织影响

相关关键词（中英文）：
- harness engineering, agent harness, coding agent, AI coding
- context engineering, context window, compaction, progressive disclosure
- AGENTS.md, CLAUDE.md, agent readability, agent-first
- managed agents, meta-harness, multi-agent orchestration
- AI code review, mutation testing, structural testing, fitness functions
- vibe coding, AI-native development, agentic workflow
- 智能体工程, AI 编程, 上下文工程, 护栏工程

### 搜索范围

必须覆盖的信源（按优先级）：

**Tier 1 — 高权重（模型厂商 + 顶级技术博客）：**
- Anthropic Engineering Blog (anthropic.com/engineering)
- OpenAI Blog (openai.com)
- Google DeepMind / Google AI Blog
- Martin Fowler (martinfowler.com)
- Mitchell Hashimoto (mitchellh.com)
- LangChain Blog (blog.langchain.com)
- Simon Willison (simonwillison.net)

**Tier 2 — 中权重（社区 + 行业）：**
- Hacker News (前 100 讨论)
- GitHub Trending (相关仓库)
- X/Twitter 技术社区 (#harness-engineering, #ai-coding, #context-engineering)
- Dev.to, Medium 技术专栏
- HumanLayer, Cursor, Windsurf, Codex 相关博客
- 中文社区：少数派、掘金、知乎专栏

**Tier 3 — 低权重但可能有惊喜：**
- arXiv (cs.SE, cs.AI 交叉)
- 个人技术博客
- YouTube 技术频道
- Reddit (r/LocalLLaMA, r/ChatGPT, r/programming)

### 我们已知的内容（用于去重和关联）

> **本节是 Prompt 的去重权威**——给外部搜索器（ChatGPT Deep Research 等）使用。
> 它必须自包含，因为搜索器无法访问 `references/articles.md`。
>
> **维护纪律：** 当 `references/articles.md` 新增/删除条目时，**同一次提交中**必须同步更新本节。两份内容的口径（脉络划分、篇数、产品/项目清单）应保持完全一致。
> 本节最近一次同步：2026-08-27（与 `articles.md` 当前内容对齐：79 篇文章 + 1 项已跟踪产品）。

**核心文章 79 篇，分布于三条脉络：**

- **脉络一 — AI 时代 Harness Engineering（75 篇）：**
  - OpenAI "Harness engineering"（原点，2026-02-11）/ "An open-source spec for Codex orchestration: Symphony"（2026-04-27，任务跟踪器作为控制平面）
  - Fowler/Böckeler "Harness engineering for coding agent users"（2026-04-02）+ 前传备忘录（2026-02-17）
  - LangChain "The Anatomy of an Agent Harness"（2026-03）/ "Continual Learning for AI Agents"（2026-04-05）/ "Agent Evaluation Readiness Checklist"
  - Anthropic "Harness design for long-running application development"（2026-03-24）
  - Anthropic / Lance Martin "Harnessing Claude's intelligence"（2026-04-02，三大模式与性能数据）
  - Anthropic "Scaling Managed Agents"（2026-02-04，meta-harness 与基础设施解耦）
  - HumanLayer "Skill Issue"（2026-03，六杠杆与避坑）
  - Fowler / Rahul Garg "Encoding team standards"（2026-03）/ "Feedback flywheel"（2026-03）
  - Meta-Harness 论文（自动化 Harness 优化）
  - GitHub / Tyler McGoffin "Agent-Driven Development"（实战）
  - "Inside the Scaffold" 论文（编码智能体脚手架的源代码级分类法）
  - Lalit Maganti "渴望八年，用 AI 三个月造出来"
  - Vikash Rungta "Claude Code Architecture (Reverse Engineered)"（2025-11-01，Claude Code 运行外壳、TAOR 循环、工具原语、权限与上下文管理的外部逆向分析）
  - 马东锡 NLP "Harness 系列文章之 7：关于 subagent"（2026-06-22，subagent = tool call 入口 + child runtime，区分 session/context/subagent，与 Claude Code 逆向互证）
  - Fowler/Böckeler "Maintainability sensors for coding agents"（2026-05-20，计算性 vs 推理性传感器谱系 + 失败案例 + AI 评审作为垃圾回收）
  - Fowler "Structured-Prompt-Driven Development (SPDD)"（2026-04-28，REASONS Canvas 七维 + prompt 即一等交付物 + 双向闭环）
  - LangChain / Harrison Chase "The Agent Development Lifecycle (ADLC)"（2026-05-09，framework/runtime/harness 三分类的生命周期）
  - LangChain / Hunter Lovell "Interpreters in Deep Agents"（2026-05-20，interpreter 是第三类上下文表面 + 35% token 节省）
  - Anthropic 工程团队 "An update on recent Claude Code quality reports"（2026-04-23，三起独立变更叠加成质量退化的第一手复盘）
  - Agentic Harness Engineering 论文（arXiv 2604.25850，复旦/北大/奇绩，可观测性驱动的 Harness 自动演化 + 可证伪契约）
  - Overeager Coding Agents 论文（arXiv 2605.18583，越界动作测量 + 提示声明授权反而降低边界推断）
  - Chris Parsons "How I Use AI to Code"（2026-05，四要素 Harness + 从批准者到训练者 + 反馈是新瓶颈；含译者注，2026 数据未独立核实）
  - LangChain / Palash Shah "How we built LangSmith Engine"（2026-05-19，用智能体改进智能体，trace→轨迹骨架 + screener/investigator 两阶段闭环）
  - Geoffrey Huntley "Ralph Wiggum as a software engineer"（2025-07）+ "everything is a ralph loop"（2026-01-17，bash 循环 + 干净上下文 + 背压 + 单体反多智能体论）
  - Mitchell Hashimoto "My AI Adoption Journey"（2026-02-05，六步采纳路线 + "harness engineering" 命名出处）
  - Claude Code 源码泄漏事件（2026-03-31，v2.1.88 npm source map 泄 512K 行 TypeScript；聚合分析 pankaj28843/understanding-claude-code：QueryEngine ~46K 行、60+ 门控工具、KAIROS/AutoDream/Undercover Mode）
  - Addy Osmani "Agent Harness Engineering"（2026-04-19，O'Reilly 转载；学科汇流综合 + 约束加减法纪律 + hooks 分界论 + HaaS）
  - Thoughtworks / Böckeler & Ford "Exploring AI coding sensors"（2026-05-13，有/无传感器对照实验 + harness 模板展望）
  - HarnessAudit 论文（arXiv 2605.14271，harness 安全审计：中途轨迹违规是输出级评估盲区，210 任务基准）
  - Harness-Bench 论文（arXiv 2605.27922，配置级 harness 效应：106 任务 / 5194 轨迹 + 执行对齐失败）
  - "How good is your harness?"（CTB@ICML 2026，Terminal-Bench 2.0 榜单方差统计归因：harness 效应 ≈ 模型效应且异质）
  - Anthropic/Claude "A harness for every task: dynamic workflows in Claude Code"（2026-06-02，模型现场写自己的编排 harness + 对抗验证 + ultracode 触发）
  - 马东锡 NLP "Harness 才是产品"（2026-06，Model 在 loop 里 harness 拥有 loop + 六组件 + 症状→组件 debug 表）
  - Position 论文 "Coding Benchmarks Are Misaligned with Agentic SE"（arXiv 2606.17799，基准折叠 model/harness/环境的三症状）
  - OpenAI "Unrolling the Codex agent loop"（2026-01-23，Codex harness 解剖·上：prompt 构造 / 二次方与 prompt caching / compaction 端点化）
  - OpenAI "Unlocking the Codex harness"（2026-02-04，Codex harness 解剖·下：App Server 双向 JSON-RPC + Item/Turn/Thread 原语 + HaaS）
  - Addy Osmani "Loop Engineering"（2026-06-08，loop 定调文：五构件 + 记忆脊柱；上游为 Steinberger 推文与 Boris Cherny "我的工作是写循环"）
  - Armin Ronacher "The Coming Loop"（2026-06-23，怀疑派回应：agent loop vs harness loop + 防御式编码放大 + 软件作为有机体）
  - Anthropic/Claude Code 团队 "Loop engineering: Getting started with loops"（2026-06-30，官方四类循环 turn/goal/time/proactive + `/goal` 独立判停）
  - Self-Harness 论文（arXiv 2606.09498，智能体自改 harness：弱点挖掘→提议→回归验证，三模型 held-out +14~21pp）
  - Lilian Weng "Harness Engineering for Self-Improvement"（2026-07-04，RSI 综述：三设计模式 + 优化对象递进链 + 七项未来挑战）
  - Aria 论文 "Harnessing Code Agents for Automatic Software Verification"（arXiv 2607.06341，声明式 HHL 包裹通用智能体做 Coq 证明，行为 harness 极限形态）
  - Anthropic "Demystifying evals for AI agents"（2026-01-09，智能体评测官方方法论：outcome≠transcript、pass@k/pass^k、CORE-Bench 42%→95% 基准病理）
  - Cursor / Wilson Lin "Scaling long-running autonomous coding"（2026-01-14，数百并发智能体 × 数周：planner/worker/judge + FastRender 百万行浏览器）
  - Anthropic / Nicholas Carlini "Building a C compiler with a team of parallel Claudes"（2026-02-05，16 agent 无编排者 + GCC oracle + $20k 成本账本）
  - Anthropic "How we contain Claude across products"（2026-05-25，三隔离模式 + 五起漏掉的风险：白名单是能力授予、先环境层遏制）
  - LangChain "Introducing Dynamic Subagents in Deep Agents"（2026-06-29）+ "How to Use RLMs in Deep Agents"（2026-07-01，模型写编排脚本 + RLM 递归上下文）
  - Fowler/Böckeler 本地模型双备忘录（2026-07 上旬，Qwen3.6 35B MoE 甜点 + 工具调用是智能体化分水岭）
  - Harness Handbook 论文（arXiv 2607.13285，2026-07-14，行为定位是 harness 演化瓶颈：行为中心表示 + BGPD）
  - Fowler / Unmesh Joshi "DSLs Enable Reliable Use of LLMs"（2026-07-14，DSL 工具集即 harness：语言层约束 + 确定性验证器）
  - Addy Osmani "Own the Outer Loop"（2026-07-15，AIE 闭幕演讲：智能体跑内环、工程师拥有外环问责 + back-pressure 调速）
  - Jarred Sumner "Rewriting Bun in Rust"（2026-07-08，50 dynamic workflows × 峰值 64 Claude × 11 天机械移植 53.5 万行 Zig→Rust；语言无关测试套件作 oracle + 1 实现者/2 对抗评审者/1 修复者 + "修流程不修代码"；$165k API 成本账本）
  - HarnessX 论文（arXiv 2606.14249，小米 Darwin Agent Team，2026-06：harness 一等类型化对象（processor × 8 hooks × 九维分类）+ AEGIS 四阶段演化 + cross-harness GRPO 共演化；+14.5% 均值（最高 +44.0%）、共演化再 +4.7%、弱模型受益最大）
  - Anthropic / Justin Young "Effective harnesses for long-running agents"（2025-11-26，存量回扫补录：initializer + coding 两段式、200+ 条 feature_list.json、claude-progress.txt + git、Puppeteer 端到端自验；#4/#7 的上游）
  - Anthropic / Gian Segato "Quantifying infrastructure noise in agentic coding evals"（2026-02-05，存量回扫补录：只改资源配额 Terminal-Bench 2.0 摆动 6pp；1x–3x 修可靠性、3x 以上改变被测对象；建议每任务声明保底分配 + 硬杀阈值）
  - Cursor / Stefan Heule & Jediah Katz "Continually improving our agent harness"（2026-04-30，存量回扫补录：Keep Rate、LLM 读用户回复判满意、CursorBench + 线上 A/B、错误分类与按工具按模型基线、每周 Automation 修 harness、按训练分布供给工具格式、context anxiety）
  - Cursor / Naman Jain "Reward hacking is swamping model intelligence gains"（2026-06-25，存量回扫补录：审计 731 条轨迹，SWE-bench Pro 上 63% 成功解是检索答案；封 git + 断网后 Opus 4.8 Max 87.1%→73.0%、Composer 2.5 74.7%→54.0%）
  - Armin Ronacher "Better Models: Worse Tools"（2026-07-04，工具 schema 不是中立的：Claude Code 的宽容客户端 + 在其中做 RL → 新模型对替代 schema 更差；strict 模式可清零）
  - Dex Horthy / HumanLayer "Why Software Factories Fail — harness engineering is not enough"（2026-07，AIE World's Fair 主题演讲 + wsff.md：熄灯工厂第一手失败实录、可维护性没有快 oracle、产品/架构/程序设计/垂直切片四阶段前移）
  - Addy Osmani "Software Factories, Light and Dark"（2026-07-20，loop→harness→factory 三层 + 唯一昂贵的评审闸门 + 背压规则 + "什么样的循环配得上熄灯"准入清单 + loops vs graphs）
  - Cursor / Wilson Lin "Agent swarms and the new model economics"（2026-07-20，#48 续篇：835 页手册重造 SQLite，账单 $1,339–$10,565；规划/执行分层、自建 VCS 1000 提交/秒、五种蜂群失效、去相关评审、Field Guide）
  - Anthropic / Thariq Shihipar "The new rules of context engineering for Claude 5 generation models"（2026-07-24，删掉 Claude Code 系统提示词 80%+ 无可测损失；七组 then/now + `claude doctor`）
  - Don't Blame the LLM 论文（arXiv 2607.03691，Queen's University，首个固定模型只变 harness 的受控纵向研究：Qwen Code CLI 35 个连续版本 × 50 个 SWE-bench Verified 任务）
  - Rethinking Harness Evolution 论文（arXiv 2607.12227，自动 harness 演化的第一份系统性负面结果：同等预算下不稳定优于 test-time scaling、泛化有限）
  - LangChain "How We Benchmark Deep Agents"（2026-07-23）+ "IssueBench"（2026-07-20）——Harbor 评测栈：Harbor-Index 82 任务 / lite 冻结子集 / capability suite；IssueBench 15 类失败分类法与 issue 集层面判分
  - LangChain / Nick Hollon "Evaluating code review agents with ReviewBench"（2026-07-31，真实 PR 评审意见策展成 59 任务 / 64 基线问题；裸 harness 最强召回 ~30%，prompt-only 调优 Luna 0.13→0.32 反超 Opus/Kimi）
  - Fowler / Birgitta Böckeler "TDD inside the agent loop - theater or actual value?"（2026-08-10，agent loop 内 TDD 实证否定：盲评质量无差异、mutation score 无差异、token 3–8.5 倍；别规定过程，度量结果）
  - Addy Osmani "Practical Loop Engineering"（2026-08-14，loop 系列日常落地环：踩坑实录 + 80K star 仓库分诊循环 + fine print 运维细则）
  - Zalando / Bartosz Ocytko "Agentic Engineering at Zalando: A Snapshot"（2026-08-14，250+ 团队非供应商组织级快照：事故分析→PR 风险分级→33% 自动放行→lead time -20~40%）
  - Earendil / Pi 团队双篇 "What Is a Harness?" + "How Compaction Works in Pi"（2026-08-20 / 08-13，harness 定义+用户侧中立主张 / compaction 白盒实现，与 Codex 端点化对照）
  - StarHarness 论文（arXiv 2608.24804，ServiceNow/Mila，2026-08-25，冻结 harness 工件跨 GPT/Qwen 迁移 12 行全正 +10.7~+46.3pp；跨模型可移植性首个正面证据）
- **脉络二 — 云原生 Harness.io（2 篇）：** Harness.io 官方全局架构 / Google Cloud 集成场景
- **脉络三 — 效率悖论（2 篇）：** YDD/Miss-you "效率悖论的系统性拆解"（2026-03-03）/ METR 实验后续 + 自报调查（2026-02-24 + 2026-05-11，"慢 19%"的官方后续：弱证据转向加速 + RCT 方法论危机）

**已跟踪的开源项目/产品：**
- Ralph Loop 实验链：snarktank/ralph、ralph-orchestrator、bmad-ralph
- Chachamaru127/claude-code-harness（v4.2 "Hokage"，Claude Code 五动词工作流 + Go 原生 guardrail R01–R13；2026-04-21 收录）

**请重点发现：**
- 上述未覆盖的新作者 / 新视角 / 新组织
- 对上述文章的**深度回应或反驳**（不是简单转述）
- 与上述项目**互补或竞争**的新工具 / harness / 框架
- 中文社区针对上述材料的原创分析（少数派、掘金、知乎专栏等）

### 输出格式

请按以下格式输出，每条内容一个条目：

---

#### [编号]. {标题}

- **类型：** 文章 / 开源项目 / 工具 / 演讲 / 论文
- **链接：** {URL}
- **作者/组织：** {作者}
- **日期：** {发布日期}
- **信源层级：** Tier 1 / Tier 2 / Tier 3
- **推荐指数：** ⭐⭐⭐⭐⭐（1-5 星）

**一句话摘要：** {50 字以内}

**核心洞察（3-5 条）：**
1. ...
2. ...
3. ...

**与已知内容的关联：**
- 支持/挑战/扩展了哪篇已有文章的观点
- 填补了哪个已知缺口

**值得收录的理由 / 不值得的理由：**
{判断}

---

### 质量过滤标准

**必须满足（全部）：**
- 有实质性的技术内容（不是纯营销或产品公告）
- 有原创洞察或数据（不是对已有文章的简单转述）
- 来源可信（有署名，有技术背景）

**加分项（满足越多越好）：**
- 有实际数据或实验结果
- 有代码示例或可复现的方案
- 挑战了主流观点
- 来自一线实践者（不是纯理论）
- 有中文社区尚未覆盖的视角

**排除：**
- 纯产品发布/营销内容
- 对已有文章的简单翻译或摘要（没有新观点）
- 过于初级的入门教程
- 与 harness engineering 只有表面关联

### 输出数量

- 文章类：推荐 5-10 篇，按推荐指数排序
- 开源项目类：推荐 3-5 个
- 其他（工具/演讲/论文）：如有高质量内容，不限数量
```

---

## Prompt B：Claude — 深度分析与项目关联

> 在 ChatGPT 返回结果后，将结果喂给 Claude（在本项目中），做深度分析

```
以下是最近 2 周的技术情报搜索结果。请基于我们项目的已有内容，做以下分析：

{粘贴 ChatGPT 的输出}

### 请分析：

1. **优先级排序**：哪些内容最值得我们收录？考虑因素：
   - 对**已收录文章 + 已跟踪开源产品**（完整清单见 Prompt A 的"已知内容"段落或 `references/articles.md`，不在此重复计数）的补充价值
   - 对 thinking/ 中已有洞见的验证或挑战（含 cross-article-insights 的 8 个洞见 + guides-sensors-meets-claude-code-harness 的 5 个张力）
   - 对开放问题清单的回答程度

2. **缺口分析**：这批内容覆盖了我们的哪些知识缺口？还有哪些缺口未被触及？
   当前已知缺口：
   - 行为 Harness（功能正确性验证）
   - Harness 覆盖率评估方法（#34/#35/#38 评测三部曲已部分回应，组件级信号供给仍开放）
   - 跨模型可移植性（#35 给出首个定量异质性证据，迁移指南仍缺）
   - 成本数据
   - 中小团队实践案例
   - Harness 接口维护成本（追宿主升级在总维护中的占比）
   - 控制的"激活策略"（always-on / per-commit / conditional / human-summoned 的分类与适用场景；#36 的 workflow/ultracode 触发是一个数据点）
   - Harness 安全审计（#33 开辟：中途轨迹违规、多智能体信息流、harness 决定安全上限——后续跟踪该方向的评测与工具）
   - 评测方法论（基准如何拆分 model/harness/环境的组件级归因——跟踪 #34/#35/#38 的后续工作）

3. **趋势信号**：这批内容中是否有新的趋势或方向？与我们已有的四个学派（约束派、控制论派、架构派、怀疑派）是否一致？

4. **收录建议**：对每条推荐内容给出具体建议：
   - 收录到 references/articles.md（哪个脉络）
   - 值得翻译到 works/
   - 值得在 thinking/ 中写分析
   - 暂不收录，持续观察
```

---

## Prompt C：Manus / OpenClaw — 自动化监控

> 用于设置定时监控的固定信源

```
定时任务：每日检查以下信源的更新

监控列表：
1. https://www.anthropic.com/engineering — RSS 或页面变化
2. https://openai.com/index/ — 新文章
3. https://martinfowler.com/articles/ — 新文章
4. https://blog.langchain.com/ — 新文章
5. https://github.com/trending?since=weekly — AI/agent 相关项目
6. https://simonwillison.net/ — 新文章
7. https://mitchellh.com/writing — 新文章
8. https://claude.com/blog — 新文章（Anthropic 产品侧博客；2026-06 的 dynamic workflows / Managed Agents 两篇重磅均发于此，工程博客不覆盖）
9. https://addyosmani.com/blog/ — 新文章
10. https://ghuntley.com/ — 新文章（Ralph 方法论源头）

匹配关键词：harness, agent, coding agent, context engineering, 
            AGENTS.md, compaction, multi-agent, sandbox

输出：
- 有更新时，发送通知（标题 + 链接 + 匹配的关键词）
- 无更新时，静默
```

---

## 工作流总结

```
┌─────────────────────────────────────────────────┐
│  Layer 1: 自动化监控（每日）                       │
│  工具：OpenClaw / Manus                          │
│  输出：固定信源的新内容通知                         │
└──────────────────────┬──────────────────────────┘
                       ↓ 有新内容时触发
┌─────────────────────────────────────────────────┐
│  Layer 2: 广度搜索（每 1-2 周）                    │
│  工具：ChatGPT Deep Research                     │
│  输入：Prompt A                                   │
│  输出：5-10 篇文章 + 3-5 个项目的结构化摘要         │
└──────────────────────┬──────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────┐
│  Layer 3: 深度分析（按需）                         │
│  工具：Claude（本项目内）                          │
│  输入：Prompt B + ChatGPT 输出                    │
│  输出：优先级排序 + 缺口分析 + 收录建议              │
└──────────────────────┬──────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────┐
│  Layer 4: 人工确认                                │
│  你决定：收录 / 翻译 / 写分析 / 跳过               │
└─────────────────────────────────────────────────┘
```

## 核心信源存量回扫（每批必做一步）

> 教训来自 2026-07-21 批次：只按"最近 2 周"时间窗扫描，导致 4 篇 1–5 月的重量级官方件
> （Cursor scaling-agents、Anthropic C compiler / how-we-contain / demystifying-evals）漏网数月。
> 时间窗抓增量，回扫补存量——两者缺一不可。

每轮调研除时间窗扫描外，**轮换抽取 1–2 个 Tier 1 信源，翻其全年归档目录**（archive / blog 列表页），
对照 `references/articles.md`（含观察项表）逐条核对是否已收录或已甄别。优先轮换顺序：

1. anthropic.com/engineering（工程博客，全量列表）
2. cursor.com/blog（research 分类）
3. openai.com/index（Engineering 分类）
4. martinfowler.com/tags（GenAI 标签 + exploring-gen-ai 系列）
5. langchain.com/blog、claude.com/blog、addyosmani.com/blog、simonwillison.net 月归档

发现漏网存量时，与本批增量一起进「候选 × 定性 × 去向」评审表，注明"存量补课"。

### 轮换记录

| 批次 | 回扫信源 | 捞回的存量 |
|------|---------|-----------|
| 2026-07-21 | （教训来源，未做系统回扫） | 事后补收 #48 / #49 / #50 / #47 |
| 2026-07-27 | ① anthropic.com/engineering 全量列表 ② cursor.com/blog 全量 slug 清单 | #58 Effective harnesses（2025-11）、#59 基础设施噪声（2026-02）、#60 持续改进 agent harness（2026-04）、#61 奖励作弊（2026-06）——四篇均为 harness 主题正中靶心却漏网数月 |
| 2026-08-03 | ① openai.com/sitemap.xml/engineering 全量 URL+lastmod ② martinfowler.com/feed.atom（GenAI 归档） | 无漏网存量：OpenAI Engineering 分类的 harness 主题件（harness-engineering / unrolling / unlocking / symphony / windows-sandbox / core-dump / websockets / how-agents-transforming-work）均已在编号正文或观察项；其余 gpt-5.6 / atlas / sora-android / tax-agents / data-agent 为产品·基建，非 harness。Fowler 侧捞出的是增量而非存量（重构经济效益 / Conductor Developer / Fragments 07-21 / Orchestrator's Tax 草稿）——已进本批观察项 |
| 2026-08-27 | ① langchain.com/blog sitemap 全量（507 slug）② claude.com/blog sitemap 全量（228 slug，去 locale 变体） | **非零星漏网而是系统性缺口**：langchain 相关约 115 篇/此前仅收 19（漏网详查 48，含 12 篇标题直接带 harness/loop 的核心文：improving-deep-agents-with-harness-engineering、better-harness、the-art-of-loop-engineering、deep-agents 开山文等）；claude.com 相关约 80/仅收 9（漏网详查 41：skills 全系列、subagent 系列、Lessons from building Claude Code 双篇等）。处置：不逐篇消化，观察项表加 2 个"信源级"合并行，完整清单留档 translate/2026-08-27/candidates.md。方法论教训：两站列表页对 curl 均不完整**必须走 sitemap.xml**；claude.com 的 lastmod 批量刷新不可作发布日期，需逐页取 JSON-LD datePublished |

> 下一轮建议轮换：addyosmani.com/blog + simonwillison.net 月归档（个人博客侧尚未系统回扫过）；cursor.com/blog 可顺带复扫（本批已全量取 sitemap 115 slug 逐页核过日期，短期内干净）。openai.com/index 用 `curl https://openai.com/sitemap.xml/engineering/` 拿到带 lastmod 的全量 URL 最省事（2026-08-03 验证有效，比抓列表页首屏可靠）。
> 回扫技巧（2026-07-27 验证有效）：列表页只渲染最近若干条时，直接抓 `curl <blog>|grep -oE '/blog/[a-z0-9-]+'|sort -u` 拿全量 slug，
> 再逐个取 `datePublished` 与标题——Cursor 那四条里有两条（`continually-improving-agent-harness`、`reward-hacking-coding-benchmarks`）就是这样发现的，它们不在列表页首屏。
