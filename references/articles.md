# 文章索引

> **本文件是文章索引与计数的唯一权威源（single source of truth）。**
>
> **计数规则（machine-checkable）：**
> 一篇文章 = 一个 `### N. {标题}` 形式的编号小节，且不属于本文末尾的"已跟踪产品 / 项目"段落。
> 占位条目（"未找到 / 待补充"）**不写在编号正文里**，而是统一进 `references/AGENTS.md` 的"待补充"列表，避免污染计数。
> 全局连续编号（不按脉络重置），最大编号 = 文章总数。
>
> **下游引用都是本文的冗余缓存：** 根 `README.md` / `README.en.md` 的 badge、`prompts/deep-research-tracker.md` 的去重清单、`references/AGENTS.md` 的概览表。
> 新增/删除文章时，必须**同一次提交**更新本文 + 所有下游缓存。
>
> 当前规模：**79 篇文章**（脉络一 75 + 脉络二 2 + 脉络三 2）+ **1 项已跟踪产品**（不计入文章数）。最近一次同步：2026-08-27。

## 脉络一：AI 时代的 Harness Engineering（大模型护栏与认知工程）

<a id="article-1"></a>

### 1. OpenAI 官方 — 原点与哲学

- **标题：** Harness engineering: leveraging Codex in an agent-first world
- **链接：** [openai.com](https://openai.com/zh-Hans-CN/index/harness-engineering/)
- **作者：** Ryan Lopopolo | **日期：** 2026-02-11
- **核心：** 3 人团队用 Codex 从空仓库到 100 万行代码，零手写代码。提出六大概念：仓库即记录系统、地图而非手册、机械化执行、智能体可读性、吞吐量改变合并理念、熵管理。
- **关联：** 本仓库的学习起点，所有概念笔记的来源

<a id="article-2"></a>

### 2. Martin Fowler / Birgitta Böckeler — 系统性认知与控制论框架

- **标题：** Harness engineering for coding agent users
- **链接：** [martinfowler.com](https://martinfowler.com/articles/harness-engineering.html)
- **翻译：** [works/fowler-harness-engineering-full-translation.md](../works/fowler-harness-engineering-full-translation.md)
- **前传备忘录：** [first thoughts](https://martinfowler.com/articles/exploring-gen-ai/harness-engineering-memo.html) | **备忘录翻译：** [works/fowler-harness-engineering-memo-translation.md](../works/fowler-harness-engineering-memo-translation.md)
- **作者：** Birgitta Böckeler (Thoughtworks) | **日期：** 2026-04-02（备忘录 2026-02-17）
- **核心：** 控制论视角的 harness 框架——Guides（前馈）× Sensors（反馈）+ Computational（计算性）× Inferential（推理性）的 2×2 矩阵，三个规制维度，Ashby 必要多样性定律

- **核心框架：Guides × Sensors + Computational × Inferential**

|  | 计算性（确定性，CPU） | 推理性（语义，LLM） |
|--|---------|---------|
| **引导器（前馈）** | bootstrap 脚本、OpenRewrite、LSP | AGENTS.md、Skills、architecture.md |
| **传感器（反馈）** | linter、ArchUnit、类型检查、覆盖率 | AI code review、LLM-as-judge |

- **关键原则：**
  - 单独用任何一种都不行——只有反馈 = 反复犯同样的错；只有前馈 = 不知道规则是否生效
  - 计算性控制便宜、确定、每次提交都跑；推理性控制昂贵、概率性、不是每次都跑
  - Harness engineering 是 context engineering 的一种特定形式

- **三个规制维度：**

| 维度 | 成熟度 | 现状 |
|------|--------|------|
| 可维护性 Harness | 最成熟 | 计算性传感器可靠捕获结构问题；LLM 部分解决语义问题；**两者都无法可靠捕获**：误诊、过度工程、误解指令 |
| 架构适应度 Harness | 中等 | 本质是 Fitness Functions——性能 Skills + 可观测性规范 |
| 行为 Harness | **最弱** | "房间里的大象"——功能正确性验证仍依赖 AI 生成的测试，"目前还不够好" |

- **Harnessability（可驾驭性）：**
  - 不是所有代码库都同样适合被 harness
  - 强类型语言天然有类型检查传感器；清晰模块边界支持架构约束；成熟框架（如 Spring）隐式提高成功概率
  - **Ambient Affordances**（Ned Letcher）：环境本身的结构属性使智能体更容易操作
  - 绿地项目可以从第一天融入；遗留系统 = **harness 最需要的地方恰恰是最难构建的地方**

- **Harness 模板：**
  - 企业 80% 的服务可归入几种常见拓扑（API 服务、事件处理、数据仪表板）
  - 服务模板 → harness 模板：引导器 + 传感器的集合，约束智能体到特定拓扑
  - 会面临和服务模板一样的分叉/同步挑战，甚至更严重（非确定性组件更难测试）

- **Ashby 必要多样性定律：**
  - 调节器必须至少拥有与被调节系统同等的多样性
  - LLM 能生成几乎任何东西（高多样性）→ 选定拓扑 = 削减多样性 → 全面 harness 变得可行
  - 定义拓扑结构本身就是一种多样性削减举措

- **人类角色的重新定位：**
  - 人类开发者携带隐性 harness：社会问责感、对复杂性的审美痛感、组织记忆、"我们这里不这么做"的直觉
  - 智能体没有这些——不知道哪个规范是承重的、哪个只是习惯
  - **"好的 harness 不应以完全消除人类输入为目标，而应将人类输入引导到最重要的地方"**

- **质量左移（Shift Quality Left）：**
  - 按速度和成本分布检查：pre-commit 跑便宜传感器，管线跑昂贵传感器
  - 持续漂移传感器：死代码检测、覆盖率质量、依赖扫描、SLO 退化

- **开放挑战：**
  - Harness 连贯性：引导器和传感器增长后可能相互矛盾
  - Harness 覆盖率：类似代码覆盖率，评估 harness 自身的完整性
  - 传感器从未触发时，如何区分高质量 vs 检测不足

- **备忘录独有洞察（正式版未保留）：**
  - "OpenAI 有既得利益让我们相信 AI 可维护的代码"——对数据来源的信任保留
  - "你今天的 harness 是什么？"——务实的起步问题，审视已有实践
  - "代码设计本身就是上下文的重要组成部分"——比框架更本质
  - 最后自嘲预言"harness"一词会被滥用

- **与其他文章的关联：**

| 本文概念 | 对应文章 |
|---------|---------|
| Guides × Sensors 矩阵 | 对 LangChain 组件清单和 HumanLayer 六杠杆的升维——从"有什么"到"如何协同" |
| 行为 Harness 是大象 | 回应自己备忘录中的批评：OpenAI 缺少功能验证 |
| Harnessability | OpenAI 的"无聊技术"选择标准的理论化 |
| Ashby 定律 | 为 Fowler 假说 2（约束越严，自主性越强）提供控制论根基 |
| Harness 模板 | 将备忘录假说 1 从问题升级为具体方案 |
| 人类角色 | 对 Anthropic #7 中人类缺位的直接回应——不应消除人类，应引导人类 |

- **延伸阅读：**
  - [Mitchell Hashimoto: My AI Adoption Journey #Step 5: Engineer the Harness](https://mitchellh.com/writing/my-ai-adoption-journey#step-5-engineer-the-harness)（已升格为 #29）
  - [Context Engineering for Coding Agents](https://martinfowler.com/articles/context-engineering-coding-agents.html)
  - [Humans and Agents in Software Engineering Loops](https://martinfowler.com/articles/humans-and-agents.html)

<a id="article-3"></a>

### 3. LangChain / Viv Trivedy — 解剖与机制

- **标题：** The Anatomy of an Agent Harness
- **链接：** [blog.langchain.com](https://blog.langchain.com/the-anatomy-of-an-agent-harness/)
- **作者：** Vivek Trivedy | **日期：** 2026-03
- **核心：** 给出 harness 的精确定义和完整组件清单

> **Agent = Model + Harness**。Harness = 模型之外的一切代码、配置和执行逻辑。

- **组件清单：**
  - System Prompts / Tools / Skills / MCP
  - 沙箱基础设施（文件系统、浏览器）
  - 编排逻辑（子智能体、handoff、模型路由）
  - Hooks/中间件（compaction、续接、lint 检查）
- **关键洞察：**
  - **Context Rot** — 上下文填满后性能退化，需要 compaction + 工具输出卸载 + 渐进式披露
  - **Ralph Loop** — 拦截退出、重注入提示词、强制在新上下文窗口中继续
  - **Harness 与模型训练耦合** — 模型会 overfit 到特定 harness，换 harness 表现可能暴跌（Terminal Bench 2.0：纯 harness 优化可把排名从 Top 30 拉到 Top 5）

<a id="article-4"></a>

### 4. Anthropic / Prithvi Rajasekaran — Harness 设计实战（长时自主编码）

- **标题：** Harness design for long-running application development
- **链接：** [anthropic.com](https://www.anthropic.com/engineering/harness-design-long-running-apps)
- **作者：** Prithvi Rajasekaran (Anthropic Labs) | **日期：** 2026-03-24
- **核心：** Anthropic 官方工程博客，GAN 启发的三智能体架构实战，从前端设计到全栈自主编码

- **两个核心问题：**
  1. **Context Anxiety** — 模型接近上下文极限时提前收尾（Sonnet 4.5 尤为明显），compaction 不够，需要 context reset
  2. **Self-Evaluation 失败** — 智能体评估自己的工作时倾向于过度称赞，即使质量平庸

- **三智能体架构（GAN 启发）：**

| 智能体 | 职责 |
|--------|------|
| Planner | 1-4 句提示词 → 完整产品规格（刻意高层级，避免细节错误向下游级联） |
| Generator | 按 sprint 逐特性实现，React + Vite + FastAPI + SQLite/PostgreSQL |
| Evaluator | 用 Playwright MCP 实际操作运行中的应用，逐条验证 sprint 合同，打分 + 写详细 critique |

- **Sprint 合同机制：**
  - 每个 sprint 前，Generator 和 Evaluator **协商**"done 长什么样"
  - Generator 提议构建内容和验证标准，Evaluator 审核
  - 双方迭代达成一致后才开始编码
  - 解决了 spec 太高层级 → 实现不可验证的 gap

- **评估标准（前端设计 4 维度）：**
  1. Design Quality — 是否有连贯的视觉身份（权重高）
  2. Originality — 是否有原创设计决策，而非 AI 模板（权重高）
  3. Craft — 排版、间距、对比度等技术执行（默认就好）
  4. Functionality — 可用性独立于美学（默认就好）

- **迭代进化（模型升级后的 Harness 瘦身）：**

| 版本 | 模型 | 架构 | 时长 | 成本 |
|------|------|------|------|------|
| Solo baseline | Opus 4.5 | 单智能体 | 20 min | $9 |
| V1 Harness | Opus 4.5 | Planner + Generator(sprint) + Evaluator(per-sprint) | ~6 hr | $200 |
| V2 Harness | Opus 4.6 | Planner + Generator(无 sprint) + Evaluator(单次 pass) | ~4 hr | $125 |

- **关键经验：**
  - **每个 harness 组件都编码了一个假设**（"模型不能独立做 X"），这些假设需要定期重新压测
  - 新模型发布后应精简 harness：去掉不再承重的部分，添加新能力
  - Evaluator 的价值取决于任务是否处于模型能力边界：边界内 → 开销浪费；边界外 → 真正有帮助
  - "有趣的 harness 组合空间不会随模型改进而缩小——它会移动"

- **与其他文章的关联：**

| Anthropic 概念 | 对应文章 |
|---------------|---------|
| Context Anxiety + Reset | LangChain 的 Context Rot + Ralph Loop |
| Self-Evaluation 失败 → 分离 Evaluator | HumanLayer 的 Sub-Agent 上下文防火墙 |
| Sprint 合同 | OpenAI 的执行计划（exec-plans） |
| 4 维度评分标准 | OpenAI 的 QUALITY_SCORE.md |
| Harness 瘦身原则 | Fowler 的"约束越严，自主性越强" |
| "找最简方案，按需增加复杂度" | HumanLayer 的"简单开始，按需添加" |

<a id="article-5"></a>

### 5. HumanLayer / Kyle — 实践与避坑

- **标题：** Skill Issue: Harness Engineering for Coding Agents
- **链接：** [humanlayer.dev](https://www.humanlayer.dev/blog/skill-issue-harness-engineering-for-coding-agents)
- **作者：** Kyle（HumanLayer） | **日期：** 2026-03-12
- **核心：** 最落地的一篇——六个配置杠杆 + 实战经验

- **六个杠杆：**

| # | 杠杆 | 要点 |
|---|------|------|
| 1 | AGENTS.md | 控制在 60 行以内，禁止自动生成 |
| 2 | MCP Servers | 别连不信任的，工具太多会填满上下文 |
| 3 | Skills | 渐进式加载，警惕恶意 skill |
| 4 | Sub-Agents | 上下文防火墙，隔离任务防 context rot |
| 5 | Hooks | 生命周期脚本，成功静默/失败报错 |
| 6 | Back-Pressure | 测试/构建/类型检查 = 自我验证回路 |

- **实战经验：**

| 无效 | 有效 |
|------|------|
| 预设理想配置 | 简单开始，按需添加 |
| 装一堆 skill/MCP "以防万一" | 团队间分发验证过的配置 |
| 每次改动跑全量测试 | 优化迭代速度而非首次成功率 |
| 微调子智能体的工具权限 | 便宜模型做子任务，贵模型做编排 |

- **金句：** "The model is probably fine. It's just a skill issue."

<a id="article-6"></a>

### 6. Anthropic / Lance Martin — 三大模式与性能数据

- **标题：** Harnessing Claude's intelligence
- **链接：** [claude.com](https://claude.com/blog/harnessing-claudes-intelligence)
- **作者：** Lance Martin (Claude Platform Team) | **日期：** 2026-04-02
- **核心：** 三个构建模式——利用 Claude 已知知识、追问"我可以停止做什么"、谨慎设定边界。配合 BrowseComp / Pokemon 等基准数据论证

- **三大模式：**

| 模式 | 核心主张 |
|------|---------|
| Use what Claude knows | 通用工具（bash + editor）优于定制工具，随模型升级自然增强 |
| Ask "what can I stop doing?" | 把编排、上下文管理、持久化三个决策权从 harness 交给模型 |
| Set boundaries carefully | 缓存优化（静态前置）+ 声明式工具提供安全门控与可观测性 |

- **"停止做什么"的三个层次：**

| 层次 | 旧假设 | 新做法 | 数据支撑 |
|------|--------|--------|---------|
| 编排 | 所有工具结果回流上下文 | 给 Claude 代码执行工具，让它自己过滤/管道 | BrowseComp: Opus 4.6 过滤能力 45.3% → 61.6% |
| 上下文管理 | 手工预加载任务指令 | Skills 渐进式披露 + context editing 移除过时内容 + 子 Agent 隔离 | BrowseComp: 子 Agent 提升 2.8% |
| 持久化 | 依赖外部检索基础设施 | Compaction（模型自主总结）+ Memory folder（模型自主写文件） | BrowseComp: Opus 4.6 compaction 达 84%；BrowseComp-Plus: memory folder +6.8% |

- **缓存优化五原则：**

| 原则 | 说明 |
|------|------|
| 静态在前，动态在后 | 稳定内容（系统提示词、工具）放前面 |
| 用消息传递更新 | 追加 `<system-reminder>` 而非编辑提示词 |
| 不切换模型 | 缓存是模型特定的，切换即失效；需要便宜模型用子 Agent |
| 谨慎管理工具 | 工具在缓存前缀中，增删会使缓存失效；用 tool search 追加 |
| 更新断点 | 多轮应用中将断点移至最新消息，使用自动缓存 |

- **声明式工具的四个价值：**
  1. 安全门控 — 不可逆操作（如外部 API）需用户确认
  2. 过时检查 — 写入工具检测文件自上次读取后是否被修改
  3. UX 渲染 — 模态窗口展示问题、提供选项、阻塞等待反馈
  4. 可观测性 — 结构化参数可记录、追踪、重放

- **Pokemon 记忆进化案例：**
  - Sonnet 3.5: 14,000 步后 31 个文件（含重复），仍在第二城镇，记忆 = NPC 对话转录
  - Opus 4.6: 同样步数 10 个文件（按目录组织），3 枚道馆徽章，记忆 = 战术笔记 + 失败经验

- **"上下文焦虑"案例：**
  - Sonnet 4.5 接近上下文极限时提前收尾 → 加了 context reset 补偿
  - Opus 4.5 天然消除了此行为 → context reset 变成死重
  - 启示：harness 中的补偿机制会随模型进化变成性能瓶颈

- **与其他文章的关联：**

| 本文概念 | 对应文章 |
|---------|---------|
| 通用工具 > 定制工具 | OpenAI 原文的 bash + editor 起源 |
| Skills 渐进式披露 | LangChain 的 Progressive Disclosure、HumanLayer 的 Skills 杠杆 |
| Compaction + Memory folder | LangChain 的 Context Rot 解法、Anthropic #4 的 Context Anxiety |
| 声明式工具 vs bash | HumanLayer 的 Back-Pressure 杠杆 |
| "停止做什么" | Anthropic #4 的 Harness 瘦身原则、Fowler 的假说 |
| 缓存优化 | 本仓库新增维度——此前文章未深入讨论 API 层成本优化 |

<a id="article-7"></a>

### 7. Anthropic / Lance Martin, Gabe Cemaj, Michael Cohen — Meta-Harness 与基础设施解耦

- **标题：** Scaling Managed Agents: Decoupling the brain from the hands
- **链接：** [anthropic.com](https://www.anthropic.com/engineering/managed-agents)
- **作者：** Lance Martin, Gabe Cemaj, Michael Cohen | **日期：** 2026-02-04
- **翻译：** [works/anthropic-managed-agents-translation.md](../works/anthropic-managed-agents-translation.md)
- **核心：** 不再讨论"如何设计 harness"，而是追问"如何让 harness 本身成为可替换的基础设施"——提出 meta-harness 概念

- **三个虚拟化组件（借鉴操作系统）：**

| 组件 | 类比 | 接口 |
|------|------|------|
| Session | 文件系统 | `emitEvent(id, event)`, `getEvents()`, `getSession(id)` |
| Harness | 进程 | `wake(sessionId)` — 无状态，可随时替换 |
| Sandbox | I/O 设备 | `execute(name, input) → string`, `provision({resources})` |

- **Pets vs Cattle 演进：**
  - 耦合设计：session + harness + sandbox 在同一容器 → 容器 = 宠物，故障即丢失
  - 解耦设计：三组件独立 → 全部是牲畜，可独立故障和替换

- **安全边界（结构性隔离）：**
  - Git：访问令牌在沙箱初始化时注入 remote，智能体不触碰令牌
  - 自定义工具：OAuth 令牌在 vault 中，通过 MCP proxy 调用，harness 永不接触凭证
  - 核心原则：**令牌永远不可从沙箱内访问**

- **Session 作为外部上下文存储：**
  - 上下文不再是 harness 内的不可逆决策（compaction/trimming）
  - Session 日志持久存储完整事件流，`getEvents()` 按需切片取回
  - 上下文转换（缓存优化、上下文工程）在 harness 层做，与存储层分离

- **性能数据：**

| 指标 | 改善 |
|------|------|
| p50 TTFT | ~60% 下降 |
| p95 TTFT | >90% 下降 |

- **多大脑、多双手：**
  - 多大脑：无状态 harness 按需启动，容器仅在工具调用时配置
  - 多双手：每双手 = `execute(name, input) → string`，harness 不关心手是容器、手机还是宝可梦模拟器
  - 大脑之间可以互相传递双手

- **与其他文章的关联：**

| 本文概念 | 对应文章 |
|---------|---------|
| Harness 假设过时 | Anthropic #4 的 Harness 瘦身、#6 的"停止做什么" |
| Pets vs Cattle | 经典 DevOps 概念，Harness.io 脉络的核心 |
| Session 外部存储 | LangChain 的 Context Rot、Anthropic #6 的 Compaction |
| Meta-harness | Fowler 的假说 1："Harness 将成为未来的服务模板" |
| 安全边界解耦 | HumanLayer 的 MCP 信任边界 |
| 多大脑多双手 | OpenAI 原文的并发 + 吞吐量理念 |

<a id="article-8"></a>

### 8. Fowler / Rahul Garg — 编码团队标准：缩减 AI 辅助开发的摩擦

- **标题：** Encoding Team Standards
- **系列：** Patterns for Reducing Friction in AI-Assisted Development
- **链接：** [martinfowler.com](https://martinfowler.com/articles/reduce-friction-ai/encoding-team-standards.html)
- **翻译：** [works/fowler-encoding-team-standards-translation.md](../works/fowler-encoding-team-standards-translation.md)
- **作者：** Rahul Garg (Thoughtworks) | **日期：** 2026-04-01
- **核心：** 将团队隐性编码标准显式化为可机器执行的规范，从自然语言 → 示例 → 自动化检查三层渐进
- **关键洞察：**
  - 团队标准分三类：语言/框架惯用法、项目特有约定、架构决策
  - 编码路径：口头约定 → AGENTS.md/prompts 中的自然语言描述 → 带示例的结构化指令 → lint 规则/自动化检查
  - 不是所有标准都值得完全自动化——按违反频率和影响决定投资
- **与其他文章关联：** Fowler #2 的 Guides×Sensors 框架的实操手册；HumanLayer 的 AGENTS.md 杠杆的深化

<a id="article-9"></a>

### 9. Fowler / Rahul Garg — 反馈飞轮：缩减 AI 辅助开发的摩擦

- **标题：** Feedback Flywheel
- **系列：** Patterns for Reducing Friction in AI-Assisted Development
- **链接：** [martinfowler.com](https://martinfowler.com/articles/reduce-friction-ai/feedback-flywheel.html)
- **翻译：** [works/fowler-feedback-flywheel-translation.md](../works/fowler-feedback-flywheel-translation.md)
- **作者：** Rahul Garg (Thoughtworks) | **日期：** 2026-04-01
- **核心：** 构建从 AI 失败中持续学习的反馈闭环——观察失败 → 根因分析 → 编码修复 → 验证效果 → 迭代
- **关键洞察：**
  - 反馈飞轮四步：发现模式 → 诊断根因 → 系统性修复（而非一次性补丁）→ 衡量改善
  - 与 Encoding Team Standards 形成闭环：标准编码 → 违反检测 → 反馈 → 标准演进
  - 团队级别的 harness 不是一次性设计，而是持续演进的活系统
- **与其他文章关联：** Anthropic #4 的"每个 harness 组件编码一个假设"理念的运营化；YDD 的安灯绳验证闭环

<a id="article-10"></a>

### 10. LangChain — 智能体评估就绪清单

- **标题：** Agent Evaluation Readiness Checklist
- **链接：** [blog.langchain.com](https://blog.langchain.com/agent-evaluation-readiness-checklist/)
- **翻译：** [works/langchain-agent-evaluation-checklist-translation.md](../works/langchain-agent-evaluation-checklist-translation.md)
- **作者：** LangChain 团队 | **日期：** 2026-04-08
- **核心：** 从零到一构建智能体评估体系的分阶段清单——定义 → 数据集 → 评估器 → 实验 → 持续集成
- **关键洞察：**
  - 评估五阶段：定义成功标准 → 构建评估数据集 → 选择评估器 → 运行实验 → CI 集成
  - 数据集构建方法论：从生产日志中提取真实案例，比合成数据更有价值
  - LLM-as-judge 的校准：需要人类标注作为锚点，定期重新校准
  - 评估不是一次性的，而是随智能体演进持续更新的
- **与其他文章关联：** Fowler #2 的 Sensors 维度的系统化实操；Anthropic #4 的 Evaluator 角色的方法论基础

<a id="article-11"></a>

### 11. Meta-Harness 论文 — 自动化 Harness 优化

- **标题：** Meta-Harness: End-to-End Optimization of Model Harnesses
- **链接：** [arxiv.org](https://arxiv.org/abs/2603.28052)
- **翻译：** [works/meta-harness-paper-translation.md](../works/meta-harness-paper-translation.md)
- **作者：** Yoonho Lee, Roshen Nair 等 (Stanford, KRAFTON, MIT) | **日期：** 2026-03-30
- **核心：** 用编码智能体作为提议器，通过文件系统访问完整搜索历史（代码+轨迹+分数），自动搜索最优 Harness
- **关键洞察：**
  - 外循环搜索：提议器检查先前 Harness 的源代码和执行轨迹，进行因果推理后提出改进
  - 文本分类任务上比 ACE 高 7.7pp，上下文 token 减少 4×
  - IMO 难度数学问题上，发现的检索 Harness 跨 5 个留出模型泛化，平均提升 4.7pp
  - TerminalBench-2 上超越手工工程化的 Terminus-KIRA
  - 核心发现：完整执行轨迹访问 > 压缩摘要 > 仅标量分数（消融实验）
- **与其他文章关联：** Anthropic #7 的 meta-harness 概念的学术实现；Fowler #2 的 Sensors 的极致自动化——连 harness 本身的设计也变成可搜索的

<a id="article-12"></a>

### 12. GitHub / Tyler McGoffin — 智能体驱动开发实战

- **标题：** Agent-driven development in Copilot Applied Science
- **链接：** [github.blog](https://github.blog/ai-and-ml/github-copilot/agent-driven-development-in-copilot-applied-science/)
- **翻译：** [works/github-agent-driven-development-translation.md](../works/github-agent-driven-development-translation.md)
- **作者：** Tyler McGoffin (GitHub Copilot Applied Science) | **日期：** 2026-03-31
- **核心：** 用编码智能体构建智能体，自动化自身工作的实战叙述；Copilot SDK + MCP + Skills 的具体使用模式
- **关键洞察：**
  - 智能体驱动开发的三阶段演进：手动 → 半自动 → 全自动
  - 关键经验：好的提示词比好的代码更重要；智能体需要明确的约束和验证循环
  - Copilot CLI 作为日常工具的实际工作流
- **与其他文章关联：** OpenAI 原文的"工程师不再写代码"理念的一线实践验证

<a id="article-13"></a>

### 13. Inside the Scaffold 论文 — 编码智能体脚手架的源代码级分类法

- **标题：** Inside the Scaffold: A Source-Code Taxonomy of Coding Agent Architectures
- **链接：** [arxiv.org](https://arxiv.org/html/2604.03515v1)
- **翻译：** [works/inside-the-scaffold-paper-translation.md](../works/inside-the-scaffold-paper-translation.md)
- **作者：** Benjamin Rombaut (Huawei Canada) | **日期：** 2026-04-04
- **核心：** 对 13 个开源编码智能体的脚手架代码进行源代码级分析，提出 12 维度 × 3 层次的架构分类法
- **关键洞察：**
  - 五种循环原语（ReAct、生成-测试-修复、计划-执行、多次重试、树搜索）是可组合的构建块，11/13 智能体组合多种原语
  - 维度在外部约束主导处收敛（工具类别、编辑格式、执行隔离），在开放设计问题处发散（上下文压缩、状态管理、多模型路由）
  - 工具数量从 0（Aider）到 37（Moatless Tools），但底层能力类别趋同：读取、搜索、编辑、执行
  - 上下文压缩涵盖七种策略：截断、摘要、滑动窗口、事件溯源、浓缩、选择性包含、无压缩
- **与其他文章关联：** 为 Fowler #2 的 Guides×Sensors 框架提供了 13 个实际系统的实证数据；Meta-Harness 论文搜索空间的具体化——展示了 harness 设计选择的巨大多样性

<a id="article-14"></a>

### 14. ⭐ Lalit Maganti — 渴望八年，用 AI 三个月造出来

- **标题：** Eight years of wanting, three months of building with AI
- **链接：** [lalitm.com](https://lalitm.com/post/building-syntaqlite-ai/)
- **翻译：** [works/maganti-eight-years-building-ai-translation.md](../works/maganti-eight-years-building-ai-translation.md)
- **作者：** Lalit Maganti | **日期：** 2026-04-05
- **核心：** 资深工程师（Chrome/Android 性能团队）用 AI 编码智能体从零构建 syntaqlite（SQLite 开发工具）的完整复盘——250 小时，3 个月，坦诚记录 AI 的帮助与局限
- **关键洞察：**
  - AI 是实现的力量倍增器，但不能替代设计——缺乏品味、历史感和用户直觉
  - 实际经验：AI 在 well-constrained 的任务上卓越（测试编写、重构、API 实现），在需要判断力的任务上失败（架构决策、API 设计、性能优化）
  - "vibe coding" 对严肃项目不可行——必须理解 AI 生成的每一行代码
  - 模型能力进化的真实感受：Claude 3.5 → Sonnet 4.5 → Gemini 2.5 Pro 的逐步改善
  - **与我们的实践高度一致**
- **与其他文章关联：** YDD 的"洗衣机悖论"的一手证据——省出的时间投入到了更高层的设计工作中；Anthropic #4 的"每个 harness 组件编码一个假设"的个人体验版

<a id="article-15"></a>

### 15. LangChain / Harrison Chase — 智能体的持续学习

- **标题：** Continual learning for AI agents
- **链接：** [blog.langchain.com](https://blog.langchain.com/continual-learning-for-ai-agents/)
- **翻译：** [works/langchain-continual-learning-translation.md](../works/langchain-continual-learning-translation.md)
- **作者：** Harrison Chase (LangChain CEO) | **日期：** 2026-04-05
- **核心：** 智能体的学习发生在三个层次：模型权重、Harness、上下文——理解区别改变你构建持续改进系统的方式
- **关键洞察：**
  - 三层学习：模型层（微调/RL）→ Harness 层（提示词/工具/编排逻辑演进）→ 上下文层（运行时记忆/少样本示例）
  - Harness 层学习最被低估：通过分析执行轨迹迭代改进 harness，而非仅改模型
  - 上下文层学习最灵活：用户级记忆、后台整合、跨会话学习
  - Deep Agents 框架支持生产级持续学习
- **与其他文章关联：** Meta-Harness 论文的 harness 层自动化学习的框架化阐述；Fowler #9 反馈飞轮在智能体层面的体现

<a id="article-16"></a>

### 16. OpenAI 官方 — 任务跟踪器作为控制平面（Symphony）

- **标题：** An open-source spec for Codex orchestration: Symphony
- **链接：** [openai.com](https://openai.com/index/open-source-codex-orchestration-symphony/)
- **翻译：** [works/openai-codex-symphony-translation.md](../works/openai-codex-symphony-translation.md)
- **作者：** Alex Kotliarskyi, Victor Zhu, Zach Brock | **日期：** 2026-04-27
- **核心：** 把 Linear 这类问题跟踪器变成智能体编排的控制平面——每个打开的 ticket 映射一个智能体工作区，Symphony 保证未完成任务始终有智能体在跑。Symphony 本体只是一份 `SPEC.md`+`WORKFLOW.md`，参考实现用 Elixir，作者鼓励使用者把 spec 交给自己的编码智能体生成本地实现。
- **关键洞察：**
  - **从交互式会话到 ticket 级编排**：人类瓶颈不在写代码，而在管理 3-5 个并发 Codex 会话的上下文切换；把 issue tracker 当状态机后，瓶颈转移到智能体的目标空间
  - **目标 vs 状态转换**：早期把智能体当状态机里的刚性节点不奏效；最终转向"给目标 + 工具 + 上下文，让它自己推理"
  - **代码免费 → 按语言优势选语言**：参考实现用 Elixir 是因为其并发能力强；同一份 SPEC.md 用 TS/Go/Rust/Java/Python 都能实现成功，多语言实现反过来打磨规范本身
  - **探索成本接近零**：PM/设计师可直接提交 ticket 拿到带演示视频的 review packet，扩大了"谁能发起工程工作"的边界
  - **数据点**：部分团队前三周已落地 PR 数量 +500%；发布后 4 月 23 日仓库 15K+ stars
- **与其他文章关联：** OpenAI 原文 #1 的"map not manual"在 SPEC.md 模式下的极致——map 不仅给智能体看，也给社区使用者作为构建模板；HumanLayer #5 的"AGENTS.md 杠杆"在工作流层面的扩展（`WORKFLOW.md` 显式化原本隐式的人类流程）；与 thinking 洞见 7 的"技术栈收敛"形成反例
- **实施参考：** [openai/symphony](https://github.com/openai/symphony) | [SPEC.md](https://github.com/openai/symphony/blob/main/SPEC.md)

<a id="article-17"></a>

### 17. Vikash Rungta — Claude Code 架构（逆向工程版）

- **标题：** Claude Code Architecture (Reverse Engineered)
- **链接：** [vrungta.substack.com](https://vrungta.substack.com/p/claude-code-architecture-reverse)
- **翻译：** [works/claude-code-architecture-reverse-translation.md](../works/claude-code-architecture-reverse-translation.md)
- **作者：** Vikash Rungta | **日期：** 2025-11-01
- **性质：** 外部逆向分析，非 Anthropic 官方架构文档
- **核心：** 把 Claude Code 解释为模型无关的本地运行外壳：模型负责推理，外壳提供 shell、文件系统、工具原语、记忆、权限、hooks、MCP、skills、子智能体和智能体团队，把自主循环约束在可治理边界内。

- **关键洞察：**
  - **从工作流到循环：** 从代码控制模型的 DAG，转向模型控制行动的 TAOR（Think-Act-Observe-Repeat）循环；运行时保持简单，智能尽量留给模型。
  - **原语工具胜过专用集成：** Bash、Grep、Edit、Read 这类通用能力原语，比大量脆弱的垂直插件更能覆盖真实工程工作流。
  - **上下文是一种稀缺资源：** 自动压缩、子智能体隔离、语义工具搜索和 forked context 都是在管理上下文预算，避免上下文坍缩。
  - **权限就是产品体验：** plan/default/acceptEdits/dontAsk/bypassPermissions 这类信任光谱，把安全、速度和企业采用门槛合在一起。
  - **Harness 应随模型变薄：** 模型能力提升后，硬编码脚手架应被删除或下沉为确定性 hook，而不是持续堆复杂度。

- **与其他文章关联：**

| 本文概念 | 对应文章 |
|---------|---------|
| Claude Code 作为 Harness 的产品化样本 | #3 LangChain 的 Agent = Model + Harness 公式 |
| 子智能体与智能体团队 | #13 Inside the Scaffold 的子智能体委托分类、#16 Symphony 的 ticket 级编排 |
| hooks 作为确定性护栏 | #2 Fowler Guides×Sensors、#5 HumanLayer 六杠杆 |
| 模型升级时删除代码 | #4 Anthropic Harness 瘦身、#6 Anthropic/Claude Platform 的"停止做什么" |
| Claude Code 专有实现的外部观察 | 弥补 #13 因 Claude Code 非开源而无法纳入源代码分类法的空白 |

> 注：Chachamaru127 / claude-code-harness 早期曾占据 #16 文章位，现已迁至本文末尾的"已跟踪产品 / 项目"段落（不计入文章数）。

<a id="article-18"></a>

### 18. 马东锡 NLP — Harness 系列文章之 7：关于 subagent

- **标题：** Harness 系列文章之 7：关于 subagent
- **链接：** [x.com](https://x.com/dongxi_nlp/status/2068922428516892998)
- **原文收录：** [works/dongxi-subagent-original.md](../works/dongxi-subagent-original.md)
- **作者：** 马东锡 NLP (@dongxi_nlp) | **日期：** 2026-06-22
- **核心：** 把 subagent 从"小号智能体"重新定义为 parent session 通过一次 tool call 拉起的 managed child runtime：外层是 `spawn_agent` / `/delegate` tool call，内层是新的 child session 和被选择过的 context projection。

- **关键洞察：**
  - **Tool call outside, runtime inside：** subagent 的启动入口是 tool call；tool call 之后，Harness 的世界状态里多了一个 child runtime。
  - **Session ≠ Context：** session 是 runtime container，包含 thread、transcript、tools、permissions、resources、status、artifacts；context 是某次 model call 可见的 projection。
  - **Shared resources 不等于 shared transcript：** child 可以继承 tools、skills、AGENTS.md、MCP servers、cwd、sandbox、permissions，但不自动继承 parent 的完整对话历史。
  - **三种投影策略：** fresh child、forked child、partial fork 分别对应不同上下文继承强度；partial fork 是避免 parent history 噪声的实用中间态。
  - **更多 agents = 更多 runtime state：** 多智能体不是免费并行，Harness 必须追踪谁在工作、知道什么、改了什么、何时完成，以及结果如何变成 evidence。

- **与其他文章关联：**

| 本文概念 | 对应文章 |
|---------|---------|
| child session 与 context projection | #7 Anthropic Managed Agents 的 Session/Harness/Sandbox 解耦 |
| subagent 作为上下文隔离机制 | #17 Claude Code 架构逆向中的隔离 TAOR 循环与 summary return |
| fresh/forked/partial fork | #6 Anthropic/Claude Platform 的 context editing、sub-agent 隔离与缓存前缀管理 |
| evidence 回流与 runtime state | #16 OpenAI Symphony 的任务跟踪器控制平面、#13 Inside the Scaffold 的委托分类 |

- **本仓库笔记：** [thinking/subagent-is-child-runtime.md](../thinking/subagent-is-child-runtime.md)

---

<a id="article-19"></a>

### 19. Fowler / Birgitta Böckeler — 面向编码智能体的可维护性传感器

- **标题：** Maintainability sensors for coding agents
- **链接：** [martinfowler.com](https://martinfowler.com/articles/sensors-for-coding-agents.html)
- **中文译文：** [works/fowler-sensors-translation.md](../works/fowler-sensors-translation.md)
- **作者：** Birgitta Böckeler | **日期：** 2026-05-20
- **核心：** Böckeler 从一个真实 TypeScript/NextJS 应用出发，系统梳理"计算性 vs 推理性"传感器谱系（type checker、ESLint、Semgrep、dependency-cruiser、mutation testing、耦合分析、AI 模块化评审），并诚实记录失败案例（耦合数据对 AI"乏善可陈"、把合理的 DI factory 误判为 god module）。

- **关键洞察：**
  - **传感器 = 反馈控制隐喻：** lint message 写成"自我修正指导"（prompt injection 式提示），让 agent 读到反馈即自纠。
  - **计算性 vs 推理性：** 确定性检查（type/lint/依赖图）与需要判断的检查（模块化、耦合）是两类不同传感器，可靠度与误报率不同。
  - **AI 模块化评审 = 垃圾回收：** 作者明确把它称为 garbage collection——周期性识别并清理结构腐化。
  - **诚实的负面结果：** 不是所有传感器都有用，耦合指标对 AI 收效甚微，记录失败本身是这篇的价值。

- **与其他文章关联：**

| 本文概念 | 对应文章 |
|---------|---------|
| Guides × Sensors 框架的实操续篇 | #2 Fowler 的控制论矩阵 |
| 机械化执行（custom linter > 文档） | 概念 3 机械化执行 |
| AI 评审作为垃圾回收 | 概念 6 熵与垃圾回收 |

- **本仓库笔记：** [thinking/guides-sensors-meets-claude-code-harness.md](../thinking/guides-sensors-meets-claude-code-harness.md)

---

<a id="article-20"></a>

### 20. Fowler / Wei Zhang, Jessie Jie Xia — 结构化提示驱动开发（SPDD）

- **标题：** Structured-Prompt-Driven Development (SPDD)
- **链接：** [martinfowler.com](https://martinfowler.com/articles/structured-prompt-driven/)
- **中文译文：** [works/fowler-spdd-translation.md](../works/fowler-spdd-translation.md)
- **作者：** Wei Zhang, Jessie Jie Xia（Martin Fowler 编辑） | **日期：** 2026-04-28
- **核心：** 一套把提示词当一等版本化交付物的半自动 Harness：提出 REASONS Canvas 七维结构（R/E/A/S/O/N/S），主张"先修提示词再改代码、重构则反向同步 spdd-sync"的双向闭环。文末附 13 组高质量自问自答。

- **关键洞察：**
  - **Prompt 是合同，Plan 是建议：** 把结构化提示词版本化、可审查，作为变更的承重结构。
  - **双向闭环：** 现实偏离 spec 时先改 prompt 再改代码；人工重构后用 spdd-sync 反向同步回 prompt，防止提示词漂移。
  - **SPDD 本身就是一个 Harness：** 把上下文、约束、审查、同步全部显式化。
  - **诚实承认边界：** "人类判断仍然是承重结构"，模型无关、不替代审查。

- **与其他文章关联：**

| 本文概念 | 对应文章 |
|---------|---------|
| Prompt 即一等可版本化交付物 | #16 OpenAI Symphony 的约束即产品、延伸概念 07-spec-as-product |
| REASONS Canvas 七维结构 | 概念 2 地图而非手册 + 渐进式披露 |
| spdd-sync 反向同步防漂移 | 概念 3 机械化执行、#9 反馈飞轮 |

---

<a id="article-21"></a>

### 21. LangChain / Harrison Chase — 智能体开发生命周期（ADLC）

- **标题：** The Agent Development Lifecycle (ADLC)
- **链接：** [langchain.com](https://www.langchain.com/blog/the-agent-development-lifecycle)
- **中文译文：** [works/langchain-adlc-translation.md](../works/langchain-adlc-translation.md)
- **作者：** Harrison Chase | **日期：** 2026-05-09
- **核心：** 提出 Build → Test → Deploy → Monitor + Iterate + Govern 的完整智能体开发生命周期，把 framework / runtime / harness 三层做了清晰区分，治理段拆出 cost / tool access / discoverability。是方法论级别的总览型骨架文。

- **关键洞察：**
  - **framework / runtime / harness 三分类：** 与本仓库主题命名正面对齐——harness 是约束与反馈层，runtime 是执行容器，framework 是编排库。
  - **生命周期是闭环：** Monitor 产出的轨迹回流到 Iterate，把一次性 demo 变成可重复、可评测、可运营的工程。
  - **Govern 作为一等维度：** 成本、工具访问、可发现性被显式纳入治理。

- **与其他文章关联：**

| 本文概念 | 对应文章 |
|---------|---------|
| framework/runtime/harness 三层 | #6 Anthropic 三大模式、#17 Claude Code 架构逆向 |
| Monitor → Iterate 反馈回路 | #2 Fowler Sensors、概念 3 机械化执行 |
| Govern / 治理维度 | 概念 6 熵与垃圾回收 |

---

<a id="article-22"></a>

### 22. LangChain / Hunter Lovell — Deep Agents 中的解释器

- **标题：** Interpreters in Deep Agents: Code Between Tool Calls and Sandboxes
- **链接：** [langchain.com](https://www.langchain.com/blog/give-your-agents-an-interpreter)
- **中文译文：** [works/deep-agents-interpreter-translation.md](../works/deep-agents-interpreter-translation.md)
- **作者：** Hunter Lovell | **日期：** 2026-05-20
- **核心：** 提出 interpreter 是介于串行工具调用与完整沙箱之间的"第三层"，interpreter state 是继 message history、filesystem 之后的"第三类上下文表面"。给出 35% token 节省实测，以及 QuickJS / 桥接 / 运行时控制的实现细节。

- **关键洞察：**
  - **上下文表面分层：** message history / filesystem / interpreter state 是三类不同的 context surface，各自有不同的读写与投影方式。
  - **设计上更受限是主动选择：** interpreter 主动收窄能力（而非能力不足），用受限运行时换取可控与可读。
  - **35% token 节省：** 让智能体写代码协调工具、保存中间态，只把相关结果送入模型上下文。
  - **横向连接：** 呼应 Cloudflare Code Mode、Anthropic PTC、RLM。

- **与其他文章关联：**

| 本文概念 | 对应文章 |
|---------|---------|
| 受限运行时即机械约束 | 概念 3 机械化执行、概念 4 智能体可读性 |
| 上下文表面 / context surface 分层 | #6 Anthropic context editing、#18 subagent 的 context projection |
| 用代码协调工具以省上下文 | #16 OpenAI Symphony 控制平面 |

---

<a id="article-23"></a>

### 23. Anthropic / 工程团队 — Claude Code 质量回归复盘

- **标题：** An update on recent Claude Code quality reports
- **链接：** [anthropic.com](https://www.anthropic.com/engineering/april-23-postmortem)
- **中文译文：** [works/anthropic-postmortem-translation.md](../works/anthropic-postmortem-translation.md)
- **作者：** Anthropic 工程团队 | **日期：** 2026-04-23
- **核心：** 对三起独立的 Claude Code 质量回归逐项复盘——(1) 默认 reasoning effort 从 high 降到 medium 的产品取舍；(2) clear_thinking 缓存优化 bug（本应只清一次却每轮都清，导致"健忘/重复/乱用工具"并拖垮缓存命中）；(3) 一条 system prompt 限长指令（≤25/≤100 词）压垮编码智能。三个变更各打不同流量切片、不同时间表，叠加成"广泛而不一致的退化"。是仓库稀缺的第一手失败案例。

- **关键洞察：**
  - **变更评估的经典陷阱：** 三个变更各自通过人审 + 自动审 + 单测 + e2e + dogfooding，仍全部漏网。
  - **system prompt 即受控产物：** 一条限长指令就能压垮编码智能，提示词必须纳入评测与审计。
  - **现成的治理清单：** 文末"后续计划"（per-model eval 套件、消融、soak period、渐进发布、prompt 审计工具）几乎是一份 harness 变更治理清单。

- **与其他文章关联：**

| 本文概念 | 对应文章 |
|---------|---------|
| 机械化执行的盲区（多层审查仍漏网） | 概念 3 机械化执行、#2 Fowler Sensors |
| system prompt 即受控产物 | 延伸概念 07-spec-as-product、#16 Symphony |
| 反例 / 事故复盘（稀缺类型） | 仓库 works/ 多为正面理论，本篇为第一手反面教材 |

---

<a id="article-24"></a>

### 24. 林家航 等 / 复旦·北大·奇绩智锋 — Agentic Harness Engineering（论文）

- **标题：** Agentic Harness Engineering: Observability-Driven Automatic Evolution of Coding-Agent Harnesses
- **链接：** [arxiv.org/html/2604.25850v4](https://arxiv.org/html/2604.25850v4)
- **中文译文：** [works/arxiv-agentic-harness-engineering-translation.md](../works/arxiv-agentic-harness-engineering-translation.md)
- **作者：** Jiahang Lin, Shichun Liu, Chengjun Pan 等（复旦 / 北大 / 奇绩智锋） | **日期：** 2026-05-18 | **arXiv：** 2604.25850 v4
- **核心：** 提出 AHE 闭环——在固定基础模型下，通过组件、经验、决策三类可观测性让 Harness 自动演化：可编辑组件文件化，轨迹压缩为可下钻证据，每次编辑附带可证伪预测。Terminal-Bench 2 上 pass@1 从 69.7% 提升到 77.0%，超过 Codex-CLI，并在 SWE-bench-verified 与跨模型迁移中保持收益。

- **关键洞察：**
  - **每次 Harness 编辑 = 可证伪契约：** 把 harness 优化从经验调参变成可验证的研究问题。
  - **三类可观测性：** 组件 / 经验 / 决策，构成分层可下钻的证据语料库。
  - **诚实报告局限：** 回归失明、组件非加性交互——优化并非单调可加。
  - **直接引用仓库源头：** 参考文献含 OpenAI Harness Engineering、Anthropic harness design、LangChain deep agents。

- **与其他文章关联：**

| 本文概念 | 对应文章 |
|---------|---------|
| Harness 自动演化 / meta-harness | #11 Meta-Harness 论文、#7 Anthropic Meta-Harness |
| 可观测性驱动的闭环 | #2 Fowler Sensors、概念 3 机械化执行 |
| 编码智能体脚手架分类 | #13 Inside the Scaffold 论文 |

---

<a id="article-25"></a>

### 25. Yubin Qu 等 — 过度积极的编码智能体（论文）

- **标题：** Overeager Coding Agents: Measuring Out-of-Scope Actions on Benign Tasks
- **链接：** [arxiv.org/html/2605.18583v1](https://arxiv.org/html/2605.18583v1)
- **中文译文：** [works/arxiv-overeager-coding-agents-translation.md](../works/arxiv-overeager-coding-agents-translation.md)
- **作者：** Yubin Qu, Ying Zhang, Yanjun Zhang, Gelei Deng, Yuekang Li, Leo Yu Zhang, Yi Liu | **日期：** 2026-05-18 | **arXiv：** 2605.18583 v1
- **核心：** 定义并测量编码智能体在良性任务中的 overeager actions（完成表面任务却执行用户未授权的读写）。提出 OverEager-Gen/Bench（500 场景、约 7500 次运行、4 个 agent 产品 × 6 模型），用行为梯度验证器与双通道审计栈评估越界率。

- **关键洞察：**
  - **反直觉发现：** 在提示里写明授权范围，会让 agent 从"推断边界"退化为"匹配声明文本"——Claude Code 去掉 consent 声明后越界率 0.0% → 17.1%。
  - **框架层主导：** permission gating 由框架层决定，模型层对齐不会完整传导到行为。
  - **授权问题是独立类别：** 区别于能力失败、提示注入、沙箱逃逸，是单独的一类风险。
  - **实证支撑机械约束：** 证明约束必须机械强制，靠提示声明反而降低边界推断。

- **与其他文章关联：**

| 本文概念 | 对应文章 |
|---------|---------|
| 权限门控 / 边界约束 | #7 Anthropic Managed Agents 沙箱、概念 3 机械化执行 |
| 提示声明反而降低安全 | #23 Anthropic 复盘的 system prompt 陷阱 |
| agent 越界的实证测量 | 概念 6 熵与垃圾回收 |

---

<a id="article-26"></a>

### 26. Chris Parsons — 我是如何用 AI 写代码的

- **标题：** How I Use AI to Code
- **链接：** [chrismdp.com](https://chrismdp.com/coding-with-ai/)
- **中文译文：** [works/chris-ai-code-translation.md](../works/chris-ai-code-translation.md)
- **作者：** Chris Parsons | **日期：** 2026-05（更新版）
- **核心：** 资深从业者的一手实践复盘。硬区分 Vibe Coding 与"智能体化工程"，提出"从批准者到训练者"的角色转变，归纳四要素 Harness（常驻指令 / skill files / 验证循环 / 反馈循环），并主张"spec the problem, not the solution"。带 7 条带注解脚注（a16z、Karpathy、METR/MIT、Greenblatt serial speed-up 等）。

- **关键洞察：**
  - **Vibe Coding ≠ 智能体化工程：** 前者不真正检查结果，后者是"有分寸地判断哪些 diff 需要你的眼睛"。
  - **从批准者到训练者：** 资深工程师的工作不再是审查输出，而是训练 AI——把判断花在哪里本身是资深技能。
  - **四要素 Harness：** 常驻指令、skill files、验证循环、反馈循环；没有反馈循环脚手架会腐化。
  - **反馈是新瓶颈：** 编码本身更快了，但审查/验证/集成/返工变慢，慢工作吞没快工作。
  - **译者注：** 文中 2026 数据/产品断言来自原文及脚注，译者未独立核实（见译文顶部说明）。

- **与其他文章关联：**

| 本文概念 | 对应文章 |
|---------|---------|
| 四要素 Harness | #2 Fowler、#5 HumanLayer 六杠杆、概念 2/3（地图而非手册 / 机械化执行） |
| 反馈循环防腐化 | #9 Fowler 反馈飞轮、#19 Fowler Sensors |
| 反馈瓶颈 / serial speed-up | #78 YDD 效率悖论 |

---

<a id="article-27"></a>

### 27. LangChain / Palash Shah — 我们如何构建 LangSmith Engine

- **标题：** How we built LangSmith Engine: our agent for improving agents
- **链接：** [langchain.com](https://www.langchain.com/blog/how-we-built-langsmith-engine-our-agent-for-improving-agents)
- **中文译文：** [works/langsmith-engine-translation.md](../works/langsmith-engine-translation.md)
- **作者：** Palash Shah | **日期：** 2026-05-19
- **核心：** "用智能体改进智能体"的工程复盘。把 trace 压缩成轨迹骨架，用 screener（Haiku 子智能体）/ investigator 两阶段分工，CLI 作为统一接口，构成 issue → evaluator → 回归样本的闭环；issue 创建与 fix 生成分离。

- **关键洞察：**
  - **trace → 轨迹骨架：** 压缩运行轨迹再交给智能体，是"运行时 → 可观测 → 自动改进"链条的关键一步。
  - **两阶段分工：** screener 先筛、investigator 再深挖，控制成本与上下文。
  - **闭环：** issue → evaluator → regression example，把一次性诊断变成可回归的适应度函数。
  - **创建与修复分离：** issue 创建和 fix 生成解耦，连接 repo 做 code-aware fix。

- **与其他文章关联：**

| 本文概念 | 对应文章 |
|---------|---------|
| 用智能体改进智能体 / meta-harness | #7 Anthropic Meta-Harness、#24 Agentic Harness Engineering |
| evaluator 作为适应度函数 | #10 LangChain 评估清单、#2 Fowler Sensors |
| 运行时 → 可观测 → 改进链条 | #21 ADLC、#22 Deep Agents 解释器 |

---

<a id="article-28"></a>

### 28. Geoffrey Huntley — Ralph：最小可行 Harness 的原始出处

- **标题：** Ralph Wiggum as a "software engineer"（2025-07）+ 续篇 everything is a ralph loop（2026-01-17）
- **链接：** [ghuntley.com/ralph](https://ghuntley.com/ralph/) | [ghuntley.com/loop](https://ghuntley.com/loop/)
- **作者：** Geoffrey Huntley | **日期：** 2025-07 / 2026-01-17
- **核心：** Ralph 技术的方法论源头——"Ralph 在最纯粹的形式下就是一个 bash 循环"：`while true` 把 PROMPT.md 喂给编码智能体，每轮全新上下文窗口、一轮只做一件事，配背压验证。作者用它从零构建 CURSED 编程语言（训练集中不存在的语言）。本仓库 `practice/` 的 Ralph Demo 与已跟踪的 3 个 Ralph 项目此前一直缺这篇源头文献。

- **关键洞察：**
  - **每轮只做一件事 + 信任模型选事：** 违反直觉的组合——既收窄单轮范围，又把"什么最重要"的决策权交给模型
  - **fix_plan.md 是外置状态：** TODO 列表是人类"像鹰一样盯着"的对象，构建 CURSED 期间被扔掉重生成多次——计划是耗材
  - **背压（backpressure）：** 改动后只跑该单元的测试；Rust 类型系统虽强但编译慢——"轮速与正确性轴的平衡"决定语言选择
  - **单体 vs 多智能体：** "非确定性的微服务（智能体）= 一团红热的烂摊子"；Ralph 是单体，单进程垂直扩展、单仓库自治
  - **失败域→工程化修复：** "看到失败域，戴上工程师帽子把问题解决到永不再犯"——与 Hashimoto 的 harness engineering 定义同源
  - **续篇的推广：** "一切皆 ralph loop"——loop 是通用的上下文工程模式，可用于所有任务；软件是陶轮上的黏土，不对就扔回轮上重塑

- **与其他文章的关联：**

| 本文概念 | 对应文章 |
|---------|---------|
| bash 循环 + 干净上下文 | #3 LangChain 的 Ralph Loop 组件、practice/ Ralph Demo |
| 背压验证门 | 概念 3 机械化执行、#5 HumanLayer 的 Back-Pressure 杠杆 |
| 计划是耗材 | README 的 Ralph 六信条 "The Plan Is Disposable" |
| 单体反多智能体论 | #36 dynamic workflows（对照：模型自己写多智能体编排）、#16 Symphony |
| 观察循环、调音式修复 | #29 Hashimoto 的 harness engineering 定义 |

---

<a id="article-29"></a>

### 29. Mitchell Hashimoto — 我的 AI 采纳之旅（"harness engineering" 命名出处）

- **标题：** My AI Adoption Journey
- **链接：** [mitchellh.com](https://mitchellh.com/writing/my-ai-adoption-journey)
- **作者：** Mitchell Hashimoto（HashiCorp 联合创始人，Ghostty 作者） | **日期：** 2026-02-05
- **核心：** 六步渐进采纳路线：放弃聊天机器人 → 复现自己的工作（手工做一遍再逼智能体做出同质结果）→ 日终智能体 → 外包稳赢任务 → 工程化 harness → 始终有智能体在跑。第 5 步给出了被业界广泛引用的 harness engineering 定义。多方学科史梳理公认本文是该术语的叫响者（与 OpenAI 原文同月）。原为本仓库"延伸阅读"，现升格为编号条目。

- **关键洞察：**
  - **定义原文：** "每当发现智能体犯错，就花时间工程化一个解决方案，使它永远不会再犯这个错误"——两种形式：隐式提示（AGENTS.md）+ 程序化工具（截图脚本、过滤测试跑器）
  - **Ghostty 的 AGENTS.md 每一行都对应一次真实的坏行为**——与 Osmani "每行可溯源到一次翻车"的纪律互证
  - **复现自己的工作：** 刻意做两遍（先手工后智能体）是形成"什么任务能交给智能体"直觉的最快途径；效率增益的一半来自知道何时不用智能体
  - **人控制打断时机：** 关掉智能体桌面通知，"由我决定何时打断它，而不是反过来"——上下文切换是最贵的成本
  - **克制的自主性：** 一次只跑一个智能体、后台智能体覆盖 10–20% 工作时段；反对为跑而跑——"只在真正有帮助的任务上跑"
  - **对冲技能退化：** 委托智能体的同时手工做自己热爱的任务，抵消 Anthropic 技能形成论文指出的风险

- **与其他文章的关联：**

| 本文概念 | 对应文章 |
|---------|---------|
| harness engineering 定义 | #1 OpenAI 原文（同期独立提出）、#2 Böckeler（引用本文） |
| 错误工程化=永不再犯 | #9 反馈飞轮的个人版、#28 Ralph 的调音式修复 |
| AGENTS.md 行行有出处 | #31 Osmani 的约束加减法纪律、#5 HumanLayer 60 行规则 |
| 何时不用智能体 | #14 Maganti 的能力边界经验、#26 Chris Parsons |

---

<a id="article-30"></a>

### 30. Claude Code 源码泄漏事件 — 512K 行 harness 的实锤解剖

- **标题：** 事件 + 聚合分析：understanding-claude-code（综合 26 篇文章、7 个 HN 帖、10 份官方 TechDocs）
- **链接：** [pankaj28843/understanding-claude-code](https://github.com/pankaj28843/understanding-claude-code) | 新闻报道：[InfoQ](https://www.infoq.com/news/2026/04/claude-code-source-leak/)
- **作者：** 事件（当事人 Chaofan Shou，安全研究员；社区镜像扩散，无单一作者——本条为事件型收录） | **日期：** 2026-03-31（事件日）
- **事件：** 2026-03-31，`@anthropic-ai/claude-code` v2.1.88 npm 包漏发 59.8MB 的 `cli.js.map`（缺一条 `.npmignore`，叠加 Bun 默认生成 source map 的已知 bug），~512,000 行 TypeScript / ~1,900 文件全裸；安全研究员 Chaofan Shou 发现，数小时内 GitHub 镜像扩散
- **核心：** 业界第一次看到一线编码智能体 harness 的完整生产级源码。此前 #17（Rungta 逆向）只能从行为推测，泄漏把推测变成了可对照的实锤。

- **实锤细节（此前只能猜测的部分）：**
  - **QueryEngine ~46K 行**：流式响应、工具调用循环、重试、token 追踪；工具可在模型还在流式输出时就开始执行
  - **60+ 权限门控工具（~29K 行 Tool.ts）**：遵循 Ousterhout "deep modules" 原则——简单接口藏重能力；"Anthropic 花在优化工具上的时间超过优化总 prompt"；工具描述本身是微型提示词
  - **工具结果预算**：BashTool 30K 字符、GrepTool 20K 字符，超额落盘到 `tool-results/{uuid}/` 留预览——上下文管理的机械化实现
  - **14 种缓存破坏向量追踪**（`promptCacheBreakDetection.ts`）：工具表变更、权限模式切换、CLAUDE.md 修改、MCP 连接等——#6 缓存优化五原则的工程落地
  - **未发布功能**：KAIROS 常驻后台 daemon（追加式日报）+ AutoDream 睡眠期记忆整理（727 行，闲时修剪/合并/组织会话记忆）+ Undercover Mode（对外仓库自动抹除内部信息与 AI 署名）
  - **教训**：source map 是被忽视的安全面——`npm pack --dry-run` 应进发布流水线

- **与其他文章的关联：**

| 本文概念 | 对应文章 |
|---------|---------|
| 推测 vs 实锤对照 | #17 Rungta 逆向分析（TAOR 循环、权限光谱的推断如今可验证） |
| 补上闭源样本的空白 | #13 Inside the Scaffold（当时因 Claude Code 闭源无法纳入分类法） |
| 工具>prompt 的投资优先级 | #6 Anthropic 通用工具主张、概念 4 智能体可读性 |
| 记忆整理（AutoDream） | #6 Pokemon 记忆进化案例的机制揭底 |
| 发布流水线事故 | #23 质量回归复盘（同为 Anthropic 工程失误的第一手材料） |

---

<a id="article-31"></a>

### 31. Addy Osmani — Agent Harness Engineering（学科汇流综合）

- **标题：** Agent Harness Engineering
- **链接：** [addyosmani.com](https://addyosmani.com/blog/agent-harness-engineering/)（[O'Reilly Radar 2026-05-15 授权转载](https://www.oreilly.com/radar/agent-harness-engineering/)）
- **第三方中译：** [掘金译文](https://juejin.cn/post/7642753947455356968)（未落盘本仓库）
- **作者：** Addy Osmani（Google Cloud AI Director） | **日期：** 2026-04-19
- **性质与破例说明：** 综述性质（同类的 Pachaar 综述归在"中文转译/二手资料"段不计数）。破例进编号正文的理由：它不只转述——给出了约束加减法纪律、hooks 分界论等可引用的原创表述，且是"四学派汇流成一个学科"的定调文（收藏/点赞比 2:1，读者当文档存）。
- **核心：** "编码智能体 = 模型 + 你围绕它构建的一切。Harness engineering 把这套脚手架当真正的工程产物；每当智能体失手，harness 就再收紧一圈。"把 Trivedy（术语）、Horthy（追踪）、HumanLayer（skill issue）、Anthropic（长时设计）、Böckeler（用户侧）、Hashimoto（命名）缝成一张学科地图。

- **关键洞察：**
  - **失败是可读的（legible）：** 不知道约定→加进 AGENTS.md；跑了破坏性命令→加 hook 拦截；40 步任务迷路→拆 planner/executor；反复"完成"坏代码→接 typecheck 背压
  - **约束的加减法纪律：** 只在见过真实失败后加约束，只在模型能力使其冗余后删；"好的 AGENTS.md 每一行都应能溯源到一次具体翻车"
  - **hooks 是分界线：** "我告诉过智能体做 X" vs "系统强制执行 X"——lifecycle 脚本承载永不能忘的事（typecheck/lint/测试、拦 `rm -rf` / force push、PR 前审批、写后自动格式化）
  - **模型与 harness 后训练耦合：** Opus 4.6 在 Claude Code 里的 Terminal Bench 2.0 分数远低于同模型在定制 harness 里；Viv 团队只改 harness 就 Top 30 → Top 5（#35 论文给出了这一现象的统计版本）
  - **HaaS（Harness-as-a-Service）：** 从构建于 LLM API（给 completion）转向构建于 harness API（给 runtime）——Claude Agent SDK / Codex SDK / OpenAI Agents SDK 同向
  - **Ralph Loop 的价值重申：** "hook 拦截退出、往新上下文窗口重注提示词"是从"用更聪明的模型"永远推导不出来的原语

- **与其他文章的关联：**

| 本文概念 | 对应文章 |
|---------|---------|
| 六人六视角的汇流地图 | #3 Trivedy、#5 HumanLayer、#4 Anthropic、#2 Böckeler、#29 Hashimoto |
| 约束加减法纪律 | #4 harness 瘦身、#29 AGENTS.md 行行有出处 |
| Terminal Bench harness 效应 | #35 统计归因论文、#3 的原始数据点 |
| HaaS | #7 Managed Agents、#21 ADLC 的 framework/runtime/harness 三分 |
| 四学派汇流 | thinking/cross-article-insights 的学派划分 |

---

<a id="article-32"></a>

### 32. Thoughtworks / Böckeler & Ford — 传感器实验：有无反馈回路的对照

- **标题：** Harness engineering and agent feedback: Exploring AI coding sensors
- **链接：** [thoughtworks.com](https://www.thoughtworks.com/en-au/insights/blog/generative-ai/harness-engineering-agent-feedback-exploring-ai-coding-sensors)
- **作者：** Birgitta Böckeler, Chris Ford (Thoughtworks) | **日期：** 2026-05-13
- **核心：** #19（可维护性传感器谱系）的实验化姊妹篇。在一个 TypeScript 数据仪表板上做**有/无传感器套件的对照实验**（ESLint、Semgrep 静态分析 + Dependency Cruiser 模块边界 + 覆盖率报告 + mutation testing），配套视频演示。

- **关键洞察：**
  - **实验结果：** 配备质量反馈传感器的编码智能体能随时间持续改善质量（如提升测试覆盖率）；无传感器则原地踏步
  - **行业失衡诊断：** 2026 上半年业界注意力集中在 skills（前馈），sensors（反馈）被系统性低估——"完美世界只需前馈；我们不住在那个世界里"
  - **从叮嘱到保证：** "反复求智能体写测试并祈祷它够自觉" → 确定性约束给出保证；LLM 判断适合模糊探索区，客观一致的要求要交给形式化确定性工具
  - **态势感知而非全自动：** "harness engineering 不是全自动化，而是开发者的态势感知"——红绿传感器仪表板 = 代码库体检单，指示该把精力再投资到 harness 的哪里
  - **Harness 模板展望：** 未来不再每个项目从头搭 harness，而是按应用类型取用预配置模板（数据仪表板模板、CRUD 业务服务模板）——#2 的 harness 模板假说落到具体形态

- **与其他文章的关联：**

| 本文概念 | 对应文章 |
|---------|---------|
| 传感器对照实验 | #19 传感器谱系（同作者的实操续篇） |
| 前馈/反馈失衡 | #2 Guides×Sensors 框架、#5 六杠杆 |
| 确定性约束 > 反复叮嘱 | 概念 3 机械化执行、#25 Overeager（提示声明反而降低边界推断） |
| harness 模板 | #2 的假说 1、#21 ADLC |

---

<a id="article-33"></a>

### 33. HarnessAudit 论文 — Harness 安全审计（安全面的开辟）

- **标题：** Auditing Agent Harness Safety
- **链接：** [arxiv.org/abs/2605.14271](https://arxiv.org/abs/2605.14271)
- **作者：** Chengzhi Liu, Yichen Guo, Yepeng Liu, Yuzhe Yang, Qianqi Yan, Xuandong Zhao, Wenyue Hua, Sheng Liu, Sharon Li, Yuheng Bu, Xin Eric Wang | **日期：** 2026-05 | **arXiv：** 2605.14271
- **核心：** 开辟本仓库此前完全缺失的维度——**harness 是安全面**。核心观察：harness 可以在"返回正确且良性的最终答案"的同时，轨迹中途访问未授权资源、或把上下文泄给错误的智能体——**输出级评估看不见这些失败**，而多数安全基准只给最终输出/终态打分。提出 HarnessAudit 框架（审计完整执行轨迹的边界合规、执行保真、系统稳定三维）+ HarnessAudit-Bench（210 任务 × 8 个真实领域，单/多智能体配置，内嵌安全约束）。

- **关键发现（评测 10 种 harness 配置 × 前沿模型 × 3 个多智能体框架）：**
  - **任务完成与安全执行不对齐**，违规随轨迹长度累积——长时自主运行天然扩大风险
  - 安全风险随领域、任务类型、智能体角色而异
  - 违规集中在**资源访问**与**智能体间信息传递**两类
  - 多智能体协作扩大安全风险面；**harness 设计决定安全部署的上限**
- **传播语境：** 被转发时的定性——"业界正在意识到：harness 是产品，也是安全面。该审计的不只是模型，还有 prompt、工具、权限、记忆、执行层。AI 安全的下一个前沿是 harness 安全。"（#37 作者马东锡转发）

- **与其他文章的关联：**

| 本文概念 | 对应文章 |
|---------|---------|
| 中途轨迹违规 vs 输出级评估 | #25 Overeager（越界动作测量——本文把它推进到审计框架） |
| 权限边界与信息流约束 | #7 Managed Agents 的安全边界解耦、#30 泄漏实锤的权限分类器 |
| 多智能体扩大风险面 | #18 subagent 的 runtime state 追踪、#36 dynamic workflows 的千级扇出 |
| harness 决定安全上限 | #37 "可靠性的东西都属于 harness" |

---

<a id="article-34"></a>

### 34. Harness-Bench 论文 — 配置级 harness 效应的诊断基准

- **标题：** Harness-Bench: Measuring Harness Effects across Models in Realistic Agent Workflows
- **链接：** [arxiv.org/abs/2605.27922](https://arxiv.org/abs/2605.27922)
- **作者：** Yilun Yao, Xinyu Tan, Chao-Hsuan Liu 等 12 人 | **日期：** 2026-05 | **arXiv：** 2605.27922
- **核心：** 现有基准要么抽象掉执行层、要么比较完整智能体系统、要么固定 harness——执行层变异一直难以研究。Harness-Bench 用 106 个沙箱离线任务（从实际 agent 使用模式构造，人工审核真实性/可解性/oracle 可检验性/完整性），在共享任务环境、预算与评估协议下评测代表性 harness 配置 × 多模型后端，同时**保留各 harness 的原生执行行为**。

- **关键洞察：**
  - **5,194 条执行轨迹的结论：** 完成率、过程质量、效率、失败行为在 model-harness 配对间差异巨大——**智能体能力应按"模型-harness 配置"报告，而非归于基座模型**
  - **执行对齐失败（execution-alignment failures）：** 反复出现的失败类型——貌似合理的推理与工具反馈、工作区状态、证据、可验证输出契约**脱钩**
  - 每次运行记录最终工件、执行轨迹、用量统计、校验器输出——支持超越"最终完成与否"的过程分析
  - 直接回应本仓库缺口清单的"Harness 覆盖率评估方法"

- **与其他文章的关联：**

| 本文概念 | 对应文章 |
|---------|---------|
| 按 model-harness 配置报告能力 | #35 统计归因（榜单侧的同一主张）、#38 Position（立场侧） |
| 执行对齐失败 | #24 AHE 的决策可观测性、#27 LangSmith Engine 的轨迹骨架 |
| 过程质量 > 最终完成 | #33 HarnessAudit（安全侧的同构主张：中途轨迹才是关键） |

---

<a id="article-35"></a>

### 35. How good is your harness? 论文 — harness 效应的统计归因

- **标题：** How good is your harness? Statistical evaluation of coding harnesses
- **链接：** [openreview.net forum](https://openreview.net/forum?id=QI8z3skBwt)（[PDF 直链](https://openreview.net/pdf/99eabc2ce65fd2871a253a0a57954c934ea9e6b0.pdf)）
- **作者：** Jiwoo Han, Yuekai Sun（密歇根大学统计系） | **日期：** 2026-05-25（OpenReview 发布，2026-06-16 末次修订） | **发表：** CTB@ICML 2026 workshop（首尔）
- **核心：** 用纯统计方法（加性 GLM，logit link）把 Terminal-Bench 2.0 榜单的分数方差拆解归因到 harness 效应与 LLM 效应——不依赖 LLM 标注轨迹，只需要足够交叉的 harness×LLM 榜单设计。数据：清洗后 105 个 harness-LLM 对（28 个 harness × 26 个 LLM）。

- **两个定量结论：**
  1. **harness 与 LLM 同等重要：** 从基线 harness 换到最优 harness 的分数跃升 ≈ 从基线 LLM 换到最优 LLM 的跃升——"harness 不是实现细节，是性能的关键组件"第一次有了量化版本
  2. **harness 效应异质：** 某些 harness 与某些 LLM 更配（如 OpenHands 配 OpenAI 模型好于配 Anthropic/Google 模型）；交互效应量级堪比主效应——harness 和 LLM **不是可完全互换的组件**
- **对本仓库缺口的意义：** "跨模型可移植性"缺口的第一份定量证据——迁移 harness 到新模型时收益不保序，压测（#4 的"定期重新压测假设"）有了统计学理由

- **与其他文章的关联：**

| 本文概念 | 对应文章 |
|---------|---------|
| harness 效应 ≈ 模型效应 | #3 Trivedy 的 Top 30→Top 5 轶事（本文把轶事升级为估计量）、#31 Osmani 引用的数据点 |
| 效应异质 / 模型-harness 耦合 | #3 的"模型 overfit 到训练 harness"、#4 harness 瘦身 |
| 榜单统计方法 | #34 Harness-Bench（受控实验侧）、#38 Position（立场侧）——评测三部曲 |

---

<a id="article-36"></a>

### 36. Anthropic / Claude — 动态工作流：模型现场写自己的 harness

- **标题：** A harness for every task: dynamic workflows in Claude Code
- **链接：** [claude.com/blog](https://claude.com/blog/a-harness-for-every-task-dynamic-workflows-in-claude-code)
- **翻译：** [works/anthropic-dynamic-workflows-translation.md](../works/anthropic-dynamic-workflows-translation.md)
- **作者：** Thariq Shihipar, Sid Bidasaria（Anthropic Claude Code 团队） | **日期：** 2026-06-02（功能随 Claude Code 2.1.154 + Opus 4.8 于 2026-05-28 发布）
- **核心：** harness 本体论的转折点——Claude 现在**为任务现场编写自己的 JavaScript 编排脚本**，即一次性定制 harness。默认 Claude Code harness 要在同一个上下文窗口里既规划又执行，在长时运行、大规模并行、高度结构化、对抗性任务上会崩；dynamic workflows 把编排逻辑放进代码（在 token 上近乎免费），单会话扇出数十到数百个并行 subagent，各自在隔离上下文窗口内执行聚焦目标。

- **关键洞察：**
  - **静态 workflow 的宿命是泛化损耗：** 预置工作流必须覆盖所有边界情况所以偏通用；Opus 4.8 已足够聪明为具体用例现写定制 harness——#4"每个 harness 组件编码一个假设"在这里变成"假设由模型即时生成"
  - **编排即代码：** workflow 可决定每个 agent 用什么模型、是否跑在独立 git worktree——智能等级与隔离度成为可编程参数
  - **对抗验证模式：** 每个生成 agent 配一个独立 agent 按 rubric 对抗校验其输出，收敛后才交付用户；官方 `/deep-research` skill 即此模式（扇出搜索→抓源→对抗核查→合成引用报告）
  - **激活策略：** 提示词含 "workflow" 触发，或用 "ultracode" 触发词确保建 workflow——回应本仓库缺口清单的"控制激活策略"
  - **workflow 是可沉淀资产：** 生成的脚本可检查、保存、复用，经 Skill 分发——一次性 harness 固化为版本化自动化
  - **反向蒸馏：** 挖掘近期 session 和 code review 评论中反复出现的纠正 → 并行 agent 聚类 → 对抗验证每条候选（"这条规则真能防住一次真实错误吗？"）→ 幸存者蒸馏回 CLAUDE.md

- **与其他文章的关联：**

| 本文概念 | 对应文章 |
|---------|---------|
| harness 从人写工件变成模型生成工件 | #11 Meta-Harness、#24 AHE（自动搜索/演化的产品化收束）、#7 meta-harness |
| 编排放进代码以省上下文 | #22 Deep Agents 解释器、#16 Symphony 控制平面 |
| 对抗验证 | #4 的 Evaluator 分离、#10 评估清单 |
| 千级 subagent 扇出 | #18 subagent 的 runtime state 管理、#33 多智能体风险面 |
| 与 Ralph 单体论的张力 | #28 Huntley "现阶段不需要多智能体"——一年后官方产品反向而行 |

---

<a id="article-37"></a>

### 37. 马东锡 NLP — Harness 才是产品

- **标题：** Harness 才是产品：决定 Coding Agent 体验的不是 Model，是它周围的整套 Runtime（Harness 系列）
- **链接：** [SOTA Sync 转载页](https://sotasync.com/reader/2026-06-09-dongxi-nlp-harness-is-the-product/)（原文发布于 X @dongxi_nlp，原帖需登录访问，本条目暂链转载页）
- **作者：** 马东锡 NLP (@dongxi_nlp) | **日期：** 2026-06
- **核心：** 把系列观点收束成一条产品论断：聊 coding agent 第一个该问的不是"用哪个 model"，而是"**Harness 到底负责什么**"。coding agent = 把 model 放进一套 runtime（查真实 repo、请求 tool、编辑文件、跑检查、记住发生过什么、多轮推进）——这层 runtime 就是 harness，"对 coding agent 来说，harness 本身就是 product"。

- **关键洞察：**
  - **Mini agent 的五个真实爆点：** 编辑从没读过的文件 / shell 触碰 workspace 外 / tool 返回 50,000 行输出 / 磁盘文件已变而 transcript 还是旧读 / tool result 与 tool call 对不上——画出「observe → model → tool」草图的系统还不是 coding agent
  - **六个核心组件：** live repo context / prompt shape / structured tools / context reduction / transcripts & memory / delegation；"context quality 经常看起来像 model quality"
  - **"Model 在 loop 里，harness 拥有 loop"：** 一个 `edit src/config.py` tool call 只是 proposal，harness 要回答十来个裁决问题（path 是否在 workspace 内、会否经 symlink 逃逸、baseline 是否过期、要否 human approval、多少 output 进下一轮 prompt……）——"这些判断不该交给 model 的随机处理"
  - **Transcript ≠ working state：** "发生过什么"与"现在什么重要"是两份不同任务，必须区别对待
  - **症状→组件的 debug 对照表：** 不断重复→查 loop/retry policy；编辑 stale code→查 file-state baselines；越跑越差→查 context projection；运行意外东西→查 permission policy；无法从 tool error 恢复→查 tool result objects
  - **工程规则收尾：** "Anything that must be reliable belongs in the harness."

- **与其他文章的关联：**

| 本文概念 | 对应文章 |
|---------|---------|
| harness 拥有 loop / 裁决权 | #18 subagent（同系列前作：tool call outside, runtime inside） |
| harness 是安全面 | #33 HarnessAudit（作者本人转发并背书） |
| proposal vs 落实边界 | #25 Overeager（提示声明 vs 机械门控）、#31 hooks 分界论 |
| context projection | #6 context editing、#22 第三类上下文表面 |

---

<a id="article-38"></a>

### 38. Position 论文 — 编码基准与智能体软件工程的错位

- **标题：** Position: Coding Benchmarks Are Misaligned with Agentic Software Engineering
- **链接：** [arxiv.org/abs/2606.17799](https://arxiv.org/abs/2606.17799)
- **作者：** Maria I. Gorinova, Macey Baker, Amy Heineike, Maksim Shaposhnikov, Rob Willoughby, Dru Knox | **日期：** 2026-06 | **arXiv：** 2606.17799
- **核心：** 立场论文——我们用来比较编码智能体的基准诞生于前智能体时代：把 model、harness、environment 折叠进一个端到端分数，通常按单一参考解评分，没有可迭代的组件级信号。"实践中的编码智能体不是模型，是 system harness——models/harnesses/contexts/environments/feedback signals 的复合体，其中任何一项都能把基准分数挪动一个相邻模型代际的量级。"

- **三个症状：**
  1. 基准分数把模型与 harness 其余部分**混同**——排行榜差异无法归因
  2. 按单一参考解评分**惩罚同样有效的替代方案**——真实工程里一题多解是常态
  3. 缺少单个 harness 组件级别的信号，端到端系统分数**难以迭代**——你不知道该修哪里
- **对本仓库的意义：** 与 #34（受控实验）、#35（榜单统计归因）构成"harness 评测三部曲"；也为 thinking/evaluation-elephant-in-the-room 的"行为 harness 是大象"补上评测学的病理诊断

- **与其他文章的关联：**

| 本文概念 | 对应文章 |
|---------|---------|
| model/harness/environment 折叠 | #35 的统计拆解方案、#34 的配置级测量方案 |
| 单参考解惩罚多解 | #10 评估清单的 LLM-as-judge 校准 |
| 组件级信号缺失 | #24 AHE 的三类可观测性（正是组件级信号的一种供给） |

---

<a id="article-39"></a>

### 39. OpenAI / Michael Bolin — 展开 Codex agent loop（Codex harness 解剖 · 上）

- **标题：** Unrolling the Codex agent loop
- **链接：** [openai.com](https://openai.com/index/unrolling-the-codex-agent-loop/)
- **作者：** Michael Bolin (OpenAI, Codex CLI 团队) | **日期：** 2026-01-23
- **核心：** Codex 系列工程博客第一篇——把 Codex CLI 的 agent loop（"我们的 agent，或曰 harness"）逐层展开：从用户输入构造初始 prompt、经 Responses API 推理、执行工具调用并把输出追加回 `input`，直到模型产出 assistant message 结束一个 turn。是官方视角下 harness 内部机制的最细粒度公开拆解。
- **关键洞察：**
  - **prompt 是"item 列表"：** `instructions`（模型特定指令）+ `tools`（shell / update_plan / web_search / MCP 工具）+ `input`（sandbox 说明 → developer 指令 → AGENTS.md 聚合的用户指令 → environment_context → 用户消息）——AGENTS.md 从 git 根到 cwd 逐层聚合、默认 32 KiB 上限的机制被首次官方成文
  - **agent loop 天然是二次方的：** 每轮把全部历史重发；Codex 刻意不用 `previous_response_id` 以保持请求无状态并支持 ZDR（零数据保留），靠 prompt caching 把采样成本从二次方拉回线性
  - **缓存破坏向量：** 中途改 tools、换模型、改沙箱/审批/工作目录都会 cache miss；MCP 工具枚举顺序不稳定曾是真实 bug——应对策略是"追加新消息表达变更，而不是改旧消息"（与 #6 缓存五原则、#30 泄漏实锤的 14 种缓存破坏向量互证）
  - **compaction 的演进：** 从手动 `/compact`（用摘要替换 input）到 Responses API 专用 `/responses/compact` 端点——返回含 `encrypted_content` 的 `type=compaction` item，保留模型对原对话的潜在理解，超过 `auto_compact_limit` 自动触发
- **与其他文章的关联：**

| 本文概念 | 对应文章 |
|---------|---------|
| harness = agent loop 的官方自述 | #3 LangChain 的 Agent = Model + Harness、#17 Claude Code 逆向（对照组：Codex 侧的官方版） |
| prompt caching 工程细节 | #6 缓存优化五原则、#30 泄漏实锤的缓存破坏向量追踪 |
| AGENTS.md 聚合机制 | #5 HumanLayer 的 AGENTS.md 杠杆、概念 2 地图而非手册 |
| compaction 端点化 | #7 Managed Agents 的 Session 外部存储、#22 上下文表面分层 |

---

<a id="article-40"></a>

### 40. OpenAI / Celia Chen — 解锁 Codex harness：App Server（Codex harness 解剖 · 下）

- **标题：** Unlocking the Codex harness: how we built the App Server
- **链接：** [openai.com](https://openai.com/index/unlocking-the-codex-harness/)
- **作者：** Celia Chen (OpenAI) | **日期：** 2026-02-04
- **核心：** Codex 的 web / CLI / IDE 扩展 / macOS 应用全部由同一个 Codex harness 驱动，而把这个 harness 暴露给所有客户端的是 Codex App Server——一个双向 JSON-RPC（JSONL over stdio）协议 + 长驻进程。把 harness 从产品内部件变成可被第三方集成的稳定平台面（HaaS 的 OpenAI 实现）。
- **关键洞察：**
  - **三个对话原语：** Item（原子输入/输出单元，带 `started`/`delta`/`completed` 生命周期）、Turn（一次用户输入触发的工作单元）、Thread（可创建/恢复/fork/归档的持久容器）——为"agent 交互不是请求/响应"给出协议级建模
  - **协议是双向的：** 服务器可以主动发起请求（如审批），暂停 turn 直到客户端应答——权限门控被编进协议而非提示词
  - **harness 内容物 = agent loop + thread 生命周期与持久化 + 配置与认证 + 工具执行与扩展（sandbox、MCP、skills）**——官方划出的 harness 边界清单
  - **集成谱系：** App Server（全功能）> Codex SDK > MCP server 模式 > `codex exec`（CI 一次性）；跨厂商 harness 协议会收敛到能力交集，丰富交互难以表达——对"标准化 vs 表达力"权衡的一手表态
  - Codex Web 在容器里跑同一个 App Server 二进制，状态留在服务端，浏览器只是轻客户端——ephemeral 会话的断线重连由持久 thread 兜底
- **与其他文章的关联：**

| 本文概念 | 对应文章 |
|---------|---------|
| HaaS（Harness-as-a-Service） | #31 Osmani 的 HaaS 论、#7 Managed Agents 的 harness 可替换论 |
| Session/Thread 持久化 | #7 的 Session 外部存储、#18 subagent 的 runtime container |
| 审批暂停 turn | #25 Overeager 的机械门控、#37 "harness 拥有 loop"的裁决权 |
| 一个 harness 多个表面 | #21 ADLC 的 framework/runtime/harness 三分 |

---

<a id="article-41"></a>

### 41. Addy Osmani — Loop Engineering（循环工程定调文）

- **标题：** Loop Engineering
- **链接：** [addyosmani.com](https://addyosmani.com/blog/loop-engineering/)（[Substack 版](https://addyo.substack.com/p/loop-engineering)）
- **中文译文：** [works/osmani-loop-engineering-translation.md](../works/osmani-loop-engineering-translation.md)
- **作者：** Addy Osmani (Google Cloud AI Director) | **日期：** 2026-06-07
- **核心：** #31 作者的续作，给"loop engineering"定调：把"提示智能体的人"换成"设计提示智能体的系统"。上游是两个原始数据点——Peter Steinberger 的推文（2026-06-07，"你不该再提示编码智能体了，你该设计提示它们的循环"，数百万浏览）与 Claude Code 负责人 Boris Cherny 的引语（"我已经不再提示 Claude 了……我的工作是写循环"）。Osmani 的定位声明：loop engineering 在 harness 之上一层——"还是那个 harness，但它跑在定时器上、派生小帮手、自我供料"。
- **关键洞察：**
  - **五构件 + 记忆脊柱：** Automations（心跳：按计划发现+分诊）/ Worktrees（并行隔离）/ Skills（固化项目知识，让意图不再反复收费）/ Plugins & Connectors（触达真实工具）/ Sub-agents（做与查分离）+ 外置状态文件（"智能体会忘，仓库不会"）
  - **不再是工具党的事：** 一年前要自己维护一坨 bash，现在五个构件在 Codex 应用和 Claude Code 里都已产品化（对照表逐项给出两侧对应物）；`/goal` 由独立小模型判定停止条件——"做与查分离"应用到停止条件本身
  - **三个越好越尖锐的问题：** 验证仍在你身上（"完成"是主张不是证明）/ 理解会腐烂（comprehension debt，顺滑的循环让它涨得更快）/ 舒服的姿势最危险（cognitive surrender：同一个动作，带判断力是解药、逃避思考是加速剂）
  - **金句：** "两个人可以搭一模一样的循环，得到截然相反的结局……循环分不出这两者的区别。你分得出。" "Cherny 的意思不是工作变轻松了，而是杠杆点挪了位置。"
- **与其他文章的关联：**

| 本文概念 | 对应文章 |
|---------|---------|
| loop 在 harness 之上一层 | #31 Osmani 的学科地图（harness 层）、#28 Ralph（loop 的方法论祖先） |
| Automations / 调度化 | #16 Symphony 的 ticket 编排、#43 claude.com 官方 loop 分类 |
| 做与查分离 | #4 Evaluator 分离、#36 对抗验证 |
| comprehension debt | #42 Ronacher 的理解关切、#26 Chris Parsons 的反馈瓶颈 |

---

<a id="article-42"></a>

### 42. Armin Ronacher — The Coming Loop（怀疑派对 loop 的系统回应）

- **标题：** The Coming Loop
- **链接：** [lucumr.pocoo.org](https://lucumr.pocoo.org/2026/6/23/the-coming-loop/)
- **中文译文：** [works/ronacher-coming-loop-translation.md](../works/ronacher-coming-loop-translation.md)
- **作者：** Armin Ronacher（Flask 作者，agent harness "Pi" 开发者） | **日期：** 2026-06-23
- **核心：** 对 loop 浪潮最扎实的怀疑派回应（HN 头版）。区分两层循环——agent loop（智能体内部：调工具、读文件、跑测试）与 **harness loop**（外部：决定工作何时算完成，让任务活过模型自己说"我做完了"的时刻）。判断：循环不可避免（竞争 + 安全压力使退出不是选项），但当下它放大模型最糟的倾向。
- **关键洞察：**
  - **循环放大防御式编码：** 模型"对异常怕得要死"（引 Karpathy）——观察到局部失败就加局部防御，而正确修复是让坏状态不可表示；每轮迭代加一个小防御，系统在看起来更健壮的同时变得更不可理解
  - **循环管用的域有共性：** 移植（Bun Zig→Rust、作者自己的 MiniJinja→Go）、性能探索、安全扫描、调研——要么不产新代码只转换旧代码，要么产出故意不需要长寿命的代码；"harness 只需要一个足以驱动下一轮迭代的信号，不必客观、不必二元"
  - **软件从机器变有机体：** 由循环产出、循环审查、循环打补丁、靠循环维生的代码库，把机器参与假定为维护模型的一部分——我们治疗它、监控它、稳定它，但不必然理解它
  - **无法置身事外：** 攻击者和报告者在循环（curl 维护者已被 AI 生成的报告淹没），防御者最终也得循环；竞争侧同理
  - **角色焦虑：** "在 harness 操作的循环里，我不确定我的角色还是什么。连'完成'信号都失去了全部意义……我的角色被降格为一名信使"
  - **收尾的问题清单：** 如何不放弃判断力、如何保住良好工程的规则、如何确保负责任的人类能继续监督、如何重新思考代码架构以保住理智
- **与其他文章的关联：**

| 本文概念 | 对应文章 |
|---------|---------|
| agent loop vs harness loop | #41 Osmani 的 loop 定调、#37 "harness 拥有 loop" |
| 防御式编码的放大 | #19 Fowler 传感器的失败案例、概念 6 熵与垃圾回收 |
| 理解与参与 | #26 Chris Parsons 从批准者到训练者、#14 Maganti 的"必须理解每一行" |
| 无法退出的压力 | #78 YDD 效率悖论、#31 学科汇流的产业动力 |

---

<a id="article-43"></a>

### 43. Anthropic / Claude Code 团队 — Loop engineering 官方入门：四类循环

- **标题：** Loop engineering: Getting started with loops
- **链接：** [claude.com/blog](https://claude.com/blog/getting-started-with-loops)
- **作者：** Delba de Oliveira, Michael Segner（Claude Code 团队） | **日期：** 2026-06-30
- **核心：** 官方把社区吵成一团的"loop"收敛为一个产品级定义——**智能体重复工作周期直到满足停止条件**——并按"触发方式 × 停止方式 × 所用原语 × 适用任务"给出四分类。loop engineering 词汇从 Twitter 话语固化为 shipping feature 的标志文。
- **四类循环：**

| 循环 | 你交出的 | 适用场景 | 用什么 |
|------|---------|---------|--------|
| Turn-based | 检查这一步 | 探索或决策中 | 自定义验证 skills |
| Goal-based | 停止条件 | 你知道"完成"长什么样 | `/goal`（独立 evaluator 模型判停，可设轮数上限） |
| Time-based | 触发时机 | 周期性工作 / 对接外部系统 | `/loop`（本机间隔重跑）、`/schedule`（云端 routine） |
| Proactive | 提示词本身 | 持续到来的明确定义工作流 | 以上全部 + dynamic workflows |
- **关键洞察：**
  - **回应"控制激活策略"缺口：** 触发方式（人 / 目标 / 时间 / 事件）第一次有了官方分类学；`/goal` 的判停由独立 evaluator 模型执行——"做与查分离"内置进原语
  - **确定性判据最有效：** "测试通过数、分数阈值"这类可机械判定的条件让 `/goal` 不必自由裁量"够好了没有"
  - **质量与成本双清单：** 质量靠"仓库本身干净 + skills 编码验证标准 + 文档易达 + 第二个智能体做 review"；成本靠"选对原语与模型、明确停止条件、大规模前先小切片试跑、确定性工作用脚本、`/usage` 复盘"
  - **组合示例：** `/schedule` 每小时查 bug 报告 + `/goal` 定义完成 + workflow 三个 worktree 并行探索方案 + 对抗评审 + auto mode 免审批——四个原语拼成一条 proactive 流水线
- **与其他文章的关联：**

| 本文概念 | 对应文章 |
|---------|---------|
| 四类循环分类学 | #41 Osmani 五构件（社区版 → 官方版）、#28 Ralph（time-based 的祖先） |
| 独立 evaluator 判停 | #4 Evaluator 分离、#36 对抗验证 |
| "把个案修复编码进系统" | #9 反馈飞轮、#29 Hashimoto 的错误工程化 |
| dynamic workflows 组合 | #36 动态工作流（同团队前作） |

---

<a id="article-44"></a>

### 44. Self-Harness 论文 — 智能体改进自己的 harness

- **标题：** Self-Harness: Harnesses That Improve Themselves
- **链接：** [arxiv.org/abs/2606.09498](https://arxiv.org/abs/2606.09498)
- **作者：** Hangfan Zhang, Shao Zhang, Kangcong Li, Chen Zhang, Yang Chen, Yiqun Zhang, Lei Bai, Shuyue Hu | **日期：** 2026-06-08 | **arXiv：** 2606.09498
- **核心：** 提出 Self-Harness 范式：**同一个固定模型**在当前 harness 下研究自己的执行轨迹、给自己的 harness 提出小编辑——不依赖人类工程师，也不依赖更强的外部模型。三段闭环：Weakness Mining（把失败聚类成有验证器根据的失败模式）→ Harness Proposal（生成与失败绑定的、最小且多样的编辑候选）→ Proposal Validation（held-in 验证弱点已解 + held-out 验证无回归，双通过才合并）。
- **关键数据（Terminal-Bench-2.0，最小初始 harness）：**

| 模型 | 初始通过率 | 最终通过率 |
|------|-----------|-----------|
| MiniMax M2.5 | 40.5% | 61.9% |
| Qwen3.5-35B-A3B | 23.8% | 38.1% |
| GLM-5 | 42.9% | 57.1% |
- **关键洞察：**
  - **harness 设计天然 model-specific：** 不同模型行为不同，人类专家手工设计难以随模型多样化扩展——这是自动化的动机，也是 #35 效应异质的机制侧解释
  - 定性分析显示学到的不是泛泛指令，而是把模型特定弱点转成**具体可执行的 harness 变更**，且能泛化到未见任务
  - 与 #24 AHE 同属"证据驱动 + 回归测试门控"的演化范式；区别在 Self-Harness 强调"自己改自己"（无更强外部提议器）
  - Weng（#45）对这类工作的安全保留：可编辑面必须精心设计，评估器与权限控制要活在演化回路**之外**，否则奖励劫持照旧
- **与其他文章的关联：**

| 本文概念 | 对应文章 |
|---------|---------|
| harness 自动演化 | #11 Meta-Harness、#24 AHE（三部曲成型） |
| model-specific harness | #35 效应异质的统计证据、#3 模型-harness 耦合 |
| 回归测试门控 | 概念 3 机械化执行、#10 评估清单 |

---

<a id="article-45"></a>

### 45. Lilian Weng — 面向自我改进的 Harness Engineering（RSI 综述）

- **标题：** Harness Engineering for Self-Improvement
- **链接：** [lilianweng.github.io](https://lilianweng.github.io/posts/2026-07-04-harness/)
- **中文译文：** [works/weng-harness-self-improvement-translation.md](../works/weng-harness-self-improvement-translation.md)
- **作者：** Lilian Weng（Thinking Machines 联合创始人，前 OpenAI 安全研究 VP） | **日期：** 2026-07-04
- **核心：** 把 harness engineering 放进递归自我改进（RSI）的框架做系统综述——"原始模型与真实世界上下文之间的那一层，似乎和模型的原始智能同等重要"。三个 harness 设计模式（工作流自动化 / 文件系统即持久记忆 / 子智能体与后台任务）+ 优化对象递进链：**指令提示词 → 结构化上下文 → 工作流 → harness 代码 → 优化器代码**。
- **关键洞察：**
  - **组织了整个自动演化文献：** ACE（上下文即演化剧本）→ MCE（机制与内容分离的双层优化）→ Meta-Harness（#11，优化"优化 harness 的代码"）→ ADAS / AFlow（工作流即搜索问题）→ STOP（改进改进器）→ AlphaEvolve / DGM（进化搜索）→ Self-Harness（#44）/ AHE（#24）→ SIA（harness 与权重联合优化）
  - **递归结构不够，基础能力是底：** STOP 用 GPT-4 提升、用弱模型退化；Lin et al. 拆出两条轴——harness-updating 能力各模型持平（9B 能写出与 Opus 同构的 skill），harness-benefit 非单调（中档模型受益最多）
  - **两个预测：** harness engineering 朝元方法论演化（harness 本身成为优化目标）；许多 harness 改进最终会**内化进核心模型行为**，但与外部上下文和工具的接口长存——类比提示词技巧被指令微调吸收，而"指明目标、约束、上下文与评估"的需求没有消失
  - **七项未来挑战：** 弱而模糊的评估器 / 上下文与记忆生命周期（"上下文工程将成为智能的核心部分，而不是停留在软件系统层"）/ 负面结果稀缺 / 多样性坍缩 / 奖励劫持（评估器与权限控制应在演化回路之外）/ 长期成功（RLVR 很少捕捉可维护性与仓库长期健康）/ 人类角色（"人类应该在栈上向上移动，而不是被移出回路"）
  - **自动研究的六种失败模式**（引 Trehan & Chopra）：偏向训练数据默认值、执行压力下的实现漂移、记忆退化、过度乐观（"数值胶带"）、领域智能不足、科学品味孱弱
- **与其他文章的关联：**

| 本文概念 | 对应文章 |
|---------|---------|
| 综述骨架 | #11 Meta-Harness、#24 AHE、#44 Self-Harness 全部被纳入组织 |
| harness 内化预测 | #4 harness 瘦身、#6 "停止做什么"、#17 "harness 应随模型变薄" |
| 文件系统即记忆 | 概念 1 仓库即记录系统、#28 Ralph 的 fix_plan.md |
| 人类向上移动 | #2 Fowler 的人类角色重定位、#42 Ronacher 的判断力保卫 |
| 奖励劫持防线在回路外 | #33 HarnessAudit、#25 Overeager 的机械门控 |

---

<a id="article-46"></a>

### 46. Aria 论文 — 用 harness 包裹编码智能体做形式化验证（行为 harness 的极限形态）

- **标题：** Harnessing Code Agents for Automatic Software Verification
- **链接：** [arxiv.org/abs/2607.06341](https://arxiv.org/abs/2607.06341)
- **作者：** Shuangxiang Kan, Shuanglong Kan, Sebastian Ertel | **日期：** 2026-07 | **arXiv：** 2607.06341
- **核心：** 对本仓库最大已知缺口——**行为 Harness（功能正确性验证）**——的首个强回应。不给智能体强加任务特定的证明策略，而是把整条引理交给通用编码智能体（Claude Code / Codex），外面包一层**声明式验证 harness**：用 Harness Hook Language (HHL) 写成的可复用检查集——超时检查（发散/不停机策略）、幻觉检查（拒绝以 `Admitted` 收尾或悄悄丢弃目标引理的"证明"）、Iris linter、最终 Coq 内核验证。每条引理一个自主会话：智能体尝试证明 → harness 检查 → 失败则带反馈重试，全程无人在环。
- **关键洞察：**
  - **结果：** 全部目标引理证明成功、零失败、零 Coq 专家干预——"简单且更有效"胜过施加证明策略的定制方案
  - **形式化验证是行为 harness 的极限形态：** Coq 内核是终极计算性传感器——不是"测试覆盖了多少"而是"数学上证明了正确"；限定在可形式化域，但在该域内把 #2 指出的"行为 harness 是房间里的大象"直接打掉
  - **HHL 的声明式可复用设计：** harness 写在通用 code-agent 接口之上，同一份 harness 可驱动不同智能体（论文实例化在 Claude Code SDK 上）——harness 与 agent 解耦的又一实证
  - **幻觉检查条目化：** "以 Admitted 收尾""悄悄丢引理"这类作弊模式被机械拒绝——与 #25（提示声明不可靠、须机械门控）同构
- **与其他文章的关联：**

| 本文概念 | 对应文章 |
|---------|---------|
| 行为正确性验证 | #2 "行为 Harness 是大象"、thinking/evaluation-elephant-in-the-room |
| 声明式 harness 语言 | #40 App Server 协议化、#16 Symphony 的 SPEC.md |
| 机械拒绝作弊 | #25 Overeager、概念 3 机械化执行 |
| 背压驱动重试 | #28 Ralph 的背压、#5 六杠杆的 Back-Pressure |

---

<a id="article-47"></a>

### 47. Anthropic — 揭秘 AI 智能体评测（评测方法论官方补件）

- **标题：** Demystifying evals for AI agents
- **链接：** [anthropic.com](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)
- **作者：** Mikaela Grace, Jeremy Hadfield, Rodrigo Olivares, Jiri De Jonghe (Anthropic) | **日期：** 2026-01-09
- **核心：** 智能体评测的官方方法论（此前已被本仓库 #10 的译文两次引用而一直未收）。给出评测的完整词汇表——task / trial / grader / transcript / **outcome**（环境终态，区别于"嘴上说订好了"）/ evaluation harness / **agent harness**（"评测'一个智能体'时，评的是 harness 与模型的整体"）——并系统展开三类 grader（代码 / 模型 / 人类）、非确定性度量（pass@k 与 pass^k）、多轮对话评测（LLM 模拟用户 + 状态完成判定）。
- **关键洞察：**
  - **"评结果，别评路径"：** 智能体会找到创造性解法——Opus 4.5 在 τ2-bench 订票题上发现政策漏洞，"按题面失败了"，实际给了用户更好的解；强制规定工具调用顺序会惩罚更聪明的路线
  - **基准自身会压分：** Opus 4.5 在 CORE-Bench 初测 42%，修掉刚性评分（期望 "96.124991…" 却惩罚 "96.12"）、含糊题面、不可复现的随机任务并换用约束更少的 scaffold 后跳到 95%——"不要盲信基准"的第一手病理；METR 时间时程基准也被发现有"按指令优化到阈值反而被扣分"的错配任务
  - **评测的价值复利：** 失败变测试用例、回归被预防、新模型上线从"数周人工试"变"数天跑套件"；evals 是产品与研究团队之间带宽最高的沟通信道
  - **何时建：** 团队常在"用户说变差了而你只能猜"的断点被迫补课（Claude Code 自身从窄评起步：简洁性、文件编辑 → 过度工程）；Descript / Bolt 的客户案例给出两种起步时机
- **与其他文章的关联：**

| 本文概念 | 对应文章 |
|---------|---------|
| outcome ≠ transcript | #33 HarnessAudit 的中途轨迹违规（互补：一个查终态、一个查过程合规） |
| 评测 harness 与模型的整体 | #34/#35/#38 评测三部曲（本文是厂商侧的方法论供给） |
| 评结果不评路径 | #10 LangChain 评估清单（直接引用本文）、#4 Evaluator 分离 |
| 基准病理修复 | #38 Position 的单参考解批评 |

---

<a id="article-48"></a>

### 48. Cursor / Wilson Lin — 规模化长时自主编码（数百智能体 × 数周）

- **标题：** Scaling long-running autonomous coding
- **链接：** [cursor.com/blog](https://cursor.com/blog/scaling-agents)
- **中文译文：** [works/cursor-scaling-agents-translation.md](../works/cursor-scaling-agents-translation.md)
- **作者：** Wilson Lin (Cursor Research) | **日期：** 2026-01-14
- **核心：** 数百个（峰值约 2,000 个）并发智能体在单一代码库上自主运行数周、写出超百万行代码的第一手复盘——OpenAI #1"百万行故事"的多智能体对照组，#28 Ralph 单体论的最强反例。旗舰产物 FastRender：从零造浏览器，近一周、100 万行 Rust / 1,000 文件，[已开源](https://github.com/wilsonzlin/fastrender)，能渲染真实网页。
- **关键洞察：**
  - **扁平自协调失败史：** 锁机制——智能体拿锁不放、20 个退化成两三个的吞吐；换乐观并发控制更稳但更深的问题浮现——**无层级时智能体集体风险规避**，专挑小而安全的改动，无人对难题负责
  - **planner / worker / judge 三角色流水线：** planner 持续探索代码库出任务（可递归派生 sub-planner），worker 死磕单任务不问大局，judge 每轮判停——解决了隧道视野
  - **模型按角色选用：** GPT-5.2 系在延时自主性上显著更强（Opus 4.5 倾向提前收工走捷径）；GPT-5.2 当 planner 比编码特训的 GPT-5.1-Codex 更好——"一个通用模型包打天下"被放弃
  - **删复杂度胜过加：** integrator 质控角色制造的瓶颈多于收益，worker 本就能自己解冲突；"结构太少则冲突漂移、太多则脆弱"——正确量级在中间
  - **金句：** "harness 和模型重要，但提示词更重要"
  - **其他实验：** Solid→React 就地迁移（三周、+266K/−193K、过 CI）、视频渲染 25 倍提速（已合并）、Java LSP / Win7 模拟器 / Excel 数万提交级项目仍在跑
- **配套：** [Simon Willison × Wilson Lin 访谈](https://simonwillison.net/2026/Jan/23/fastrender/)（峰值 2,000 并发、每机约 300 智能体、每小时数千提交等工程细节）
- **与其他文章的关联：**

| 本文概念 | 对应文章 |
|---------|---------|
| 百万行对照组 | #1 OpenAI 原文（3 人 + Codex）、#49 C compiler（16 agent 无编排者） |
| planner/worker/judge | #36 dynamic workflows 的编排模式、#4 三智能体架构 |
| 单体 vs 蜂群之争 | #28 Ralph "现阶段不需要多智能体"（一年内被产品侧反转） |
| 无层级的风险规避 | #42 Ronacher 的防御式编码（同为智能体集体行为病理） |

---

<a id="article-49"></a>

### 49. Anthropic / Nicholas Carlini — 用一支并行 Claude 团队构建 C 编译器

- **标题：** Building a C compiler with a team of parallel Claudes
- **链接：** [anthropic.com](https://www.anthropic.com/engineering/building-c-compiler)
- **中文译文：** [works/anthropic-c-compiler-translation.md](../works/anthropic-c-compiler-translation.md)
- **作者：** Nicholas Carlini (Anthropic Safeguards 团队；前 Google Brain/DeepMind) | **日期：** 2026-02-05
- **核心：** 16 个 Opus 4.6 实例、近 2,000 个 Claude Code 会话、两周、约 $20,000，产出 10 万行 Rust 写的 C 编译器：能构建可启动的 Linux 6.9（x86/ARM/RISC-V）、编译 QEMU/FFmpeg/SQLite/Postgres/Redis、GCC torture 通过率 99%、能跑 Doom。作者自述文章主题就是"**为长时自主智能体团队设计 harness** 的经验"。与 #48 同期但架构相反：**无编排者**——锁文件认领任务、git merge 冲突当仲裁、每个智能体自己挑"下一个最明显的问题"。
- **关键洞察：**
  - **验证器必须近乎完美：** "否则 Claude 会去解决错误的问题"——测试 harness 的迭代（找高质量测试套件、写验证器、按新失败模式补测试）占了作者大部分精力；后期加 CI 强制"新提交不得破坏既有代码"
  - **为 Claude 写测试，不为人写：** 上下文窗口污染（输出只留几行、错误写 `ERROR` 同行原因供 grep、预计算聚合统计）+ 时间失明（`--fast` 跑 1%/10% 确定性抽样——按智能体确定、跨 VM 随机，全覆盖且可精确定位回归）
  - **GCC 当在线 oracle 拆单体任务：** 编译 Linux 内核是一个巨任务，16 个智能体全卡在同一个 bug 上互相覆盖；随机让 GCC 编译大部分文件、Claude 编译器只管剩余子集——把单体任务切成可并行的差分调试
  - **角色分工：** 去重代码 / 编译器自身性能 / 产物代码效率 / Rust 视角架构批评 / 文档，各配一个专职智能体
  - **成本与局限的诚实账本：** 20 亿输入 + 1.4 亿输出 token ≈ $20k（"是我自己写的成本的零头"）；16 位 x86 代码生成超 32k 上限失败、汇编器链接器仍有 bug、产物效率低于 -O0 的 GCC——"新特性频繁破坏既有功能"，已近 Opus 能力极限
  - **安全研究员的不安：** "程序员部署自己从未亲自验证过的软件"是真实担忧——测试通过 ≠ 工作完成
- **与其他文章的关联：**

| 本文概念 | 对应文章 |
|---------|---------|
| 无编排者的对照组 | #48 Cursor planner/worker/judge（同月发布的两种架构答案） |
| bash 循环起点 | #28 Ralph（作者明说"如果你见过 Ralph-loop 这应该很眼熟"） |
| oracle 当行为验证器 | #46 Aria 的 Coq 内核、概念 3 机械化执行 |
| 为智能体设计输出 | 概念 4 智能体可读性、#30 泄漏实锤的工具结果预算 |
| 成本第一手数据 | 观察项 Harness Effect（token 经济学）、#41 loop 的 token 警告 |

---

<a id="article-50"></a>

### 50. Anthropic — 我们如何在各产品中遏制 Claude（harness 安全的工程侧答卷）

- **标题：** How we contain Claude across products
- **链接：** [anthropic.com](https://www.anthropic.com/engineering/how-we-contain-claude)
- **中文译文：** [works/anthropic-how-we-contain-translation.md](../works/anthropic-how-we-contain-translation.md)
- **作者：** Max McGuinness, Mikaela Grace, Jiri De Jonghe, Jake Eaton, Abel Ribbink (Anthropic) | **日期：** 2026-05-25
- **核心：** #33 HarnessAudit"harness 是安全面"的官方工程侧对应：给爆炸半径（blast radius）封顶的两条路里，人在回路会失效（权限弹窗批准率 93%、审批疲劳），所以重心在**遏制**——三类风险（用户滥用 / 模型失当 / 外部攻击者）× 三个防御组件（环境=硬上限 / 模型=概率性 / 外部内容），三种隔离模式各配一个产品：临时容器（claude.ai, gVisor）、人在回路沙箱（Claude Code, Seatbelt/bubblewrap，弹窗 −84%）、本地 VM（Cowork，hypervisor 边界 + vsock）。
- **五起"我们漏掉的风险"（第一手事故复盘）：**
  - **信任对话框之前的一切：** `.claude/settings.json` 里的 hook 在"你信任这个文件夹吗"弹出**之前**就执行——修复形状统一：把项目本地配置的解析推迟到信任建立之后
  - **用户本人是注入向量：** 内部红队钓鱼——"帮我跑一下这个"邮件附即贴即用提示词，内藏读 `~/.aws/credentials` 外发；**25 试 24 中**。模型层锚定用户意图，用户亲手输入时无异常可抓——只有出口管控和文件系统边界扛得住
  - **经批准域名的外渗：** 恶意文件带攻击者的 API key，Claude 用它调 Files API 上传数据到攻击者账户——出口代理见 api.anthropic.com 放行。教训：**白名单不是目的地过滤器，是能力授予**；修复是 VM 内的防御性 MITM 代理只放行自家会话令牌
  - **VM 隔离把 EDR 也挡在外面：** 遏制降低可见性，企业合规要求端点可见——"尽早为这场对话做预算"
  - （附）调查工具即攻击面：把攻击提示词发进 Slack 讨论，而内部智能体会读 Slack——只好埋金丝雀字符串
- **三条收束原则：** 先环境层遏制、再模型层引导（"当所有概率性防御都漏掉时，被打到的是确定性边界"）；隔离强度匹配用户监督能力（读得懂 bash 的开发者 vs 读不懂的知识工作者不是同一个威胁模型）；警惕自定义组件（"标准原语都扛住了，破的是我们自己造的白名单代理"）
- **与其他文章的关联：**

| 本文概念 | 对应文章 |
|---------|---------|
| harness 是安全面 | #33 HarnessAudit（学术侧）、#37 马东锡的裁决权论 |
| 提示声明 vs 机械门控 | #25 Overeager（auto mode 拦 83% 越界、漏 17% 的脚注数据与其互证） |
| 凭证不入沙箱 | #7 Managed Agents 的令牌隔离 |
| 多智能体信任升级 | #18 subagent 的 evidence 回流、#33 的智能体间信息流违规 |

---

<a id="article-51"></a>

### 51. LangChain — Deep Agents 动态子智能体与 RLM（跨厂商收敛实锤）

- **标题：** Introducing Dynamic Subagents in Deep Agents（2026-06-29）+ How to Use RLMs in Deep Agents（2026-07-01）
- **链接：** [dynamic subagents](https://www.langchain.com/blog/introducing-dynamic-subagents-in-deep-agents) | [RLM 支持](https://www.langchain.com/blog/how-to-use-rlms-in-deep-agents)
- **作者：** LangChain 团队 | **日期：** 2026-06-29 / 2026-07-01
- **核心：** "模型写编排代码"范式的 LangChain 落地：智能体不再逐轮 tool call 派发 subagent，而是写一段短脚本（QuickJS 解释器内执行，内置 `task()` 全局函数）用循环/分支/`Promise.all` 驱动子智能体执行。官方自认与 Claude Code workflows、Recursive Language Models（RLM，MIT CSAIL）是同一思想——**#36 发布四周后，竞争框架完成同构实现**。
- **关键洞察：**
  - **RLM 模式进生产框架：** 模型在 REPL 中跑代码、把工作集放解释器变量里、按切片派发 subagent 递归处理——论文声称可处理超出上下文窗口**两个数量级**的输入并胜过 vanilla agent；"每页一个 subagent 处理 300 页文档"是典型形态
  - **跨模型混搭编排：** 编排者与 subagent 可用不同模型——前沿模型编排 + 开源权重模型（GLM 5.2 / Nemotron）打工，或反过来——成本/性能双向优化
  - **"workflow" 是显式触发杠杆：** 解释器系统提示词把这个词当作"经代码组织工作"的信号，与 #36 的 ultracode 触发词同构——激活策略缺口的又一个数据点
  - **与 PTC 组合：** 程序化工具调用（默认关闭、显式白名单）负责发现与过滤输入，`task()` 负责派发——判断力密集的部分仍留给模型
- **与其他文章的关联：**

| 本文概念 | 对应文章 |
|---------|---------|
| 模型写编排代码 | #36 dynamic workflows（Claude Code 版）、#22 解释器（同门前作） |
| RLM / 递归上下文 | #3 Context Rot、#6 compaction（第三条路：递归分治） |
| 跨模型混搭 | #48 Cursor 的按角色选模型 |
| workflow 触发词 | #43 官方四类循环的激活策略 |

---

<a id="article-52"></a>

### 52. Fowler / Böckeler — 本地小模型跑智能体编码：可行性与实测（双备忘录）

- **标题：** Viability of local models for coding + Experiences with local models for coding
- **链接：** [可行性篇](https://martinfowler.com/articles/exploring-gen-ai/local-models-for-coding-factors.html) | [实测篇](https://martinfowler.com/articles/exploring-gen-ai/local-models-for-coding-experiences.html)
- **作者：** Birgitta Böckeler (Thoughtworks) | **日期：** 2026-07 上旬（实测篇 2026-07-08）
- **核心：** 在典型高端开发机（M3 Max 48GB / M5 Pro 64GB）上跑 15–25GB 本地小模型做**智能体编码**（不只是补全）的一手实测：可行性四因素（硬件 RAM 是核心约束 / 模型选择 / 运行时 / **harness**——用 OpenCode 与 Pi，零 Skills 零 MCP），三阶段实验后的甜点是 Qwen3.6 35B MoE（4bit 量化、关推理、拉满上下文）。
- **关键洞察：**
  - **工具调用是智能体化的分水岭：** 小模型工具调用仍频繁失败（但通常能自我恢复）——这正是"补全可用、agentic 难用"的机制原因
  - **任务选择决定可行性：** "复杂度 × 预计读写文件数"是预判框架；她的用法是"小而直接的任务，常由更大的模型预先规划好"——**大模型规划 + 小模型执行**的分工在个人工作流层面成型（与 #43 的按任务选模型、Willison 的 Fable's judgement 同向）
  - **"绝不是即插即用"：** 结果时好时坏令人困惑，但比一年前"天壤之别"；harness 作为四因素之一被显式列入——呼应 Fragments 07-13 的"好 harness 让弱模型可用，支撑开源权重模型自托管"
  - **动机不只是成本：** 模型主权（政府干预断供的先例）、信息安全（关键数据不能给云）、"别人托管则学习的是别人的模型"
- **与其他文章的关联：**

| 本文概念 | 对应文章 |
|---------|---------|
| harness 让弱模型可用 | 观察项 Fowler Fragments 07-13、#35 的 model-harness 配对效应 |
| 大模型规划小模型执行 | #43 成本清单的"选对模型"、观察项 Fable's judgement |
| 中小团队/个人实践 | #14 Maganti、#26 Chris Parsons（个人实践线的延续） |
| 工具调用可靠性 | #37 六组件的 structured tools、#3 组件清单 |

---

<a id="article-53"></a>

### 53. Harness Handbook 论文 — 给 harness 自己造"行为地图"

- **标题：** Harness Handbook: Making Evolving Agent Harnesses Readable, Navigable, and Editable
- **链接：** [arxiv.org/abs/2607.13285](https://arxiv.org/abs/2607.13285) | [项目页](https://ruhan-wang.github.io/Harness-Handbook/)
- **作者：** Ruhan Wang, Yucheng Shi 等（腾讯 HY LLM Frontier / Indiana / UMD / UGA / NUS） | **日期：** 2026-07-14 | **arXiv：** 2607.13285
- **核心：** 把"harness 演化"的中心瓶颈定位为**行为定位（behavior localization）**：修改请求描述的是"系统该做什么"，而生产级 harness 代码库按文件/函数/模块组织，单个行为散布在多个不相邻的实现点。Harness Handbook 用静态程序分析 + LLM 辅助行为结构化，自动合成一份**按行为组织、每个行为链接到实现代码**的表示；配套 Behavior-Guided Progressive Disclosure（BGPD）引导编码智能体从高层行为描述逐级下钻到实现细节，并对照当前源码校验候选位置、编辑后自动重同步防过期。
- **关键数据：** 在 Codex 与 Terminus-2 两个开源 harness 的真实修改请求上，Handbook 辅助规划的总体 win rate 分别 +10.0pp（38.3% vs 28.3%）与 +18.9pp（45.6% vs 26.7%），planner token 反而分别少用 12.7% / 8.6%；**弱 planner 配 Handbook 能在实现点定位上追平显著更强的模型**（24 项文件/符号级 R/P/F1 对比全部改善）。增益最大处：实现点分散、罕执行路径、对关键词搜索不友好的请求（Search-Hostile +33.3pp）。
- **关键洞察：**
  - **"地图而非手册"应用到 harness 自身：** 仓库即记录系统 + 渐进式披露这两条为业务代码发明的原则，第一次被系统性地用于 harness 代码库——harness 成了需要自己的 AGENTS.md 的对象
  - **自动重同步防漂移：** Handbook 不是又一份会腐烂的文档——编辑后针对受影响行为自动重建，仓库仍是最终权威
  - 与 #24 AHE 的组件可观测性同题异解：AHE 给每个可编辑组件一个文件表示，Handbook 给每个**行为**一个入口
- **与其他文章的关联：**

| 本文概念 | 对应文章 |
|---------|---------|
| 行为中心表示 | 概念 2 地图而非手册、概念 1 仓库即记录系统 |
| harness 演化的瓶颈 | #24 AHE 三类可观测性、#44 Self-Harness 的可编辑面 |
| 文档防腐 | 概念 3 机械化执行（"文档会腐烂"的针对性解法） |
| 评测对象 | #39/#40 Codex harness（被评测的两个开源 harness 之一） |

---

<a id="article-54"></a>

### 54. Fowler / Unmesh Joshi — DSL 让 LLM 的使用变得可靠（语言层 harness）

- **标题：** DSLs Enable Reliable Use of LLMs
- **链接：** [martinfowler.com](https://martinfowler.com/articles/llm-and-dsls.html)
- **作者：** Unmesh Joshi (Thoughtworks，《Patterns of Distributed Systems》作者) | **日期：** 2026-07-14
- **核心：** "DSL 的工具集本身就是一个出色的 harness"——把约束前置到**语言层**：领域抽象 + DSL 收窄 LLM 的输出空间，而 DSL 天然自带确定性验证器（解析器 / JSON schema / 类型检查器 / 编译器），智能体可以在"生成 → 验证 → 修复"循环里自主纠错，且**错误以领域语言表述**（"不能在选择客户端之前选择动作"）而非埋在生成代码深处的堆栈。案例 Tickloom：单线程 tick 循环 + 确定性顺序的分布式系统语义模型，非法场景**根本编译不过**。
- **关键洞察：**
  - **两阶段协作：** 先用 LLM 当头脑风暴伙伴迭代发现领域抽象与词汇，词汇稳定后 LLM 变成它的自然语言接口——"设计是在实现中被发现的"（Upfront Specification Impossibility）
  - **DSL 是持久的 source of truth：** 生成的 DSL 常成为人类维护的工件本身——可读、免样板、意图长存；LLM 生成错了不必找回原始提示词重生成，改 DSL 即可
  - **诚实的适用边界：** 优势只在 DSL 足够小而受约束、几个 in-context 示例就能传达用法时成立；设计与维护语言及其语义模型有真实的前期成本
  - **与 #20 SPDD 的分野：** SPDD 把提示词当一等交付物，本文更进一步——把**语言**当承重结构，提示词只是它的入口
- **与其他文章的关联：**

| 本文概念 | 对应文章 |
|---------|---------|
| 语言层机械约束 | 概念 3 机械化执行、#46 Aria 的 HHL（同为"造小语言当 harness"） |
| 领域级错误反馈 | #19 传感器的"自我修正指导"式 lint message |
| 语义模型即上下文 | #2 备忘录"代码设计本身就是上下文"、Fragments 的 Unmesh 概念模型论 |
| 收窄输出空间 | #2 Ashby 必要多样性定律（削减多样性使 harness 可行） |

---

<a id="article-55"></a>

### 55. Addy Osmani — Own the Outer Loop（外环问责制）

- **标题：** Own the Outer Loop
- **链接：** [addyosmani.com](https://addyosmani.com/blog/own-the-outer-loop/)
- **作者：** Addy Osmani (Google Cloud AI Director) | **日期：** 2026-07-15（AIE World's Fair 2026 闭幕演讲文字版）
- **核心：** #41《Loop Engineering》的续作、对 #42 Ronacher"我的角色是什么"之问的正面作答：**智能体运行内环（执行循环），工程师拥有外环（问责）**。操作模型：把质量保证与验证全部放进环内、让循环尽可能独立；循环设计验证完成后，剩下的唯一工作是通过 **back-pressure 机制**控制循环的运行速率与作用域来授予自主权；把人放在正确的决策上。
- **关键洞察：**
  - **"理解不是交接闸门，是决策点"：** 不要把 understanding 当作发布门或 hand-off，而是人类被引导提供洞见的时刻——对 comprehension debt 之争的操作化回应
  - **"留下更好的工件"：** 每个回流生产、回流新团队新工程师的工件，都应该比进来时更好——外环的资产观
  - **判断依据：** "AI June 2026 报告显示小时级时程的自主智能体编码在实验设置下基本已到位"+ OpenAI 的 agents 与未来工作研究——边界必须现在就开始建
  - **收束句：** "那就是外环上的智能体工程——那就是现在的工作"
- **与其他文章的关联：**

| 本文概念 | 对应文章 |
|---------|---------|
| 内环/外环分界 | #41 Loop Engineering（同作者前作）、#42 Ronacher 的 agent loop vs harness loop |
| back-pressure 控制自主度 | #5 六杠杆的 Back-Pressure、#28 Ralph 背压（从验证门升格为自主权阀门） |
| 人在正确决策上 | #2 Fowler"引导人类输入到最重要的地方"、#45 Weng"人类在栈上向上移动" |
| 小时级自主已到位 | 观察项 OpenAI How agents are transforming work（60+ 小时/日的重度用户） |

---

<a id="article-56"></a>

### 56. Jarred Sumner — 用 Rust 重写 Bun（"修流程不修代码"的工业级实录）

- **标题：** Rewriting Bun in Rust
- **链接：** [bun.sh](https://bun.sh/blog/bun-in-rust)
- **翻译：** [works/bun-in-rust-translation.md](../works/bun-in-rust-translation.md)
- **作者：** Jarred Sumner（Bun 创始人；2025-12 随 Bun 被收购加入 Anthropic） | **日期：** 2026-07-08（重写本身发生于 2026-05-03 → 05-14 合并）
- **核心：** 用约 50 个 Claude Code dynamic workflows、峰值 64 个并发 Claude、11 天 6,778 次提交，把 535,496 行 Zig **机械移植**为 Rust（产出约 78 万行），随后进入 Claude Code 自身的生产运行时（v2.1.181 起）。方法论收束成一句话：**"语言无关的百万断言测试套件 + 对抗式代码评审 + 出问题时修复生成代码的流程，而不是手改代码。"** 本仓库分析见 [thinking/fix-the-process-not-the-code.md](../thinking/fix-the-process-not-the-code.md)。
- **流程架构（每行代码 4 次智能体过手）：**
  - **准备：** 3 小时人机对谈沉淀 `PORTING.md`（Zig→Rust 模式映射）；一个 workflow 逐结构体字段追踪控制流产出 `LIFETIMES.tsv`；两份文档本身也过对抗评审 + 人工通读
  - **试运行先于放量：** 先移植 3 个文件验证流水线，再放量全部 1,448 个 .zig 文件；峰值每分钟约 1,300 行
  - **角色分离：** 1 名实现者 + 2 名对抗评审者（独立上下文窗口，唯一职责是找出代码不能工作的理由）+ 1 名修复者；"实现者不评审，评审者不实现"
  - **假启动与流程级修复：** Claude 互跑 `git stash`/`git reset` 踩踏 → 改 workflow 禁则；把编译错误打桩 + 写辩护性长注释 → 给评审者加否决规则"需要一整段注释辩护的 workaround 就是错的"——一次提示词编辑，几小时后症状绝迹
  - **合并闸门：** 三平台 CI 100% 通过、0 测试被跳过或删除（合并前**人工核实测试确实在跑**）
- **成本与产出账本：** 59 亿未缓存输入 + 6.9 亿输出 + 720 亿缓存读 token，按 API 定价约 $165,000；对照人工估算"3 名全上下文工程师一年"。v1.4.0 修复 128 个 v1.3.14 可复现 bug；2000 次构建内存 6,745MB→609MB；二进制缩约 20%；快 2–5%；引入 19 个回归（全部修复，多数源于"语法相同、语义不同"：Zig `assert` 函数 vs Rust `debug_assert!` 宏、`ReleaseFast` 去边界检查 vs Rust release 保留）
- **与其他文章的关联：**

| 本文概念 | 对应文章 |
|---------|---------|
| 修流程不修代码 | #55 外环问责的工业级实证、#26 从批准者到训练者、#9 反馈飞轮（单项目内最小闭环） |
| 对抗式评审默认化 | #36 dynamic workflows（同一机制的能力宣告 → 本文是承重验证）、#49 为 Claude 写测试 |
| 语言无关测试套件作 oracle | #49 GCC oracle、#2 Harnessability（新维度：测试与实现语言正交是战略资产） |
| 多 worktree 并行 + 协调失败史 | #48 Cursor 扁平自协调失败、#28 Ralph 背压 |

<a id="article-57"></a>

### 57. HarnessX 论文 — 可组合 harness 铸造厂与 harness-模型共演化

- **标题：** HarnessX: A Composable, Adaptive, and Evolvable Agent Harness Foundry
- **链接：** [arxiv.org/abs/2606.14249](https://arxiv.org/abs/2606.14249) | [代码仓库 Darwin-Agent/HarnessX](https://github.com/Darwin-Agent/HarnessX)
- **作者：** Darwin Agent Team（小米） | **日期：** 2026-06（arXiv 2606.14249）
- **核心：** 第一个正面回答 model-harness 循环依赖（[thinking/cross-article-insights.md](../thinking/cross-article-insights.md) 洞见 3）的系统工作：不再只演化 harness 或只训练模型，而是**共用一个 replay buffer 让两者同轮共演化**。5 基准（ALFWorld/GAIA/WebShop/τ³-Bench/SWE-bench Verified）× 3 模型族（Claude Sonnet 4.6 / GPT-5.4 / Qwen3.5-9B）：harness 演化平均 **+14.5%**（最高 +44.0%），共演化在此之上再 **+4.7%**。
- **三层贡献：**
  - **组合层：** harness = 一等类型化对象——processor（`process(event) → events`）挂接 8 个生命周期 hook 点，行为空间按九维分类（模型选择/上下文装配/记忆/工具生态/执行环境/评估奖励/控制安全/可观测性/训练桥），substitution algebra 保证类型安全的插入/替换/移除
  - **演化层（AEGIS）：** 操作镜像把 harness 演化形式化为符号空间上的 MDP——RL 病理（reward hacking / 灾难性遗忘 / 欠探索）被预测为设计风险，分别由 Critic、确定性闸门（含"跷跷板约束"：不得回归已通过任务）、Planner 防御；四阶段 Digester→Planner→Evolver→Critic，**LLM 子智能体负责探索与提议，只有确定性检查决定是否发布**
  - **共演化层：** cross-harness GRPO——同一任务在不同 harness 版本下的轨迹按任务分组、只按验证器奖励比较，模型学会利用连续演化的 harness 策略；打破"只演化 harness 的脚手架天花板"与"只训模型的训练信号天花板"
- **逆缩放发现：** 最弱模型受益最大（ALFWorld 上 Qwen3.5-9B +44.0% vs Sonnet 4.6 +11.2%）——演化出的 harness 填补的是弱模型无法自我纠正的行为缺口；"小模型 + 强 harness"由此获得机制级证据
- **与其他文章的关联：**

| 本文概念 | 对应文章 |
|---------|---------|
| harness-模型共演化 | 洞见 3 循环依赖的正面解、#15 三层学习（模型/harness/上下文首次被接进同一优化循环） |
| 相比既有自演化工作 | #11 Meta-Harness、#24 AHE（可观测性三支柱）、#44 Self-Harness——均只演化 harness 侧 |
| 与动态工作流的分界 | #36（论文明确对照：单会话现场编排，无跨会话轨迹优化与共训练） |
| 确定性闸门防 reward hacking | #47 评结果不评路径、#24 每次编辑即可证伪契约 |
| 弱模型受益最大 | 观察项"Harness Updating ≠ Harness Benefit"论文（中档模型受益最多）的互证与张力 |

<a id="article-58"></a>

### 58. Anthropic / Justin Young — 长时智能体的有效 harness（外部工件即记忆的奠基文）

- **标题：** Effective harnesses for long-running agents
- **链接：** [anthropic.com](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- **作者：** Justin Young（Anthropic） | **日期：** 2025-11-26（2026-07 存量回扫补录）
- **核心：** 本仓库多篇文章（#4、#7、#36）共同的上游。命题一句话：**compaction 不够**——Opus 4.5 跑在 Claude Agent SDK 上循环多个上下文窗口，只给一句"克隆一个 claude.ai"仍造不出生产级 web 应用。类比是"每班工程师上工时都不记得上一班干了什么"，解法是把记忆外置成**下一班读得懂的工件**。
- **两段式 harness（第一个上下文窗口用不同的提示词）：**
  - **initializer agent（只跑一次）：** 生成 `init.sh`（一键起开发服务器）、`claude-progress.txt`（历任智能体的工作日志）、首个 git commit，以及把用户一句话展开成的**功能清单**——claude.ai 克隆案例展开成 **200+ 条**端到端功能，全部初始标记 `"passes": false`
  - **coding agent（此后每次）：** 每轮只做**一个**功能，做完把状态改成 `passes: true`、写进度、提交 git
- **三个被点名的失败模式与对策：**

| 失败模式 | 对策 |
|---------|------|
| 想一次性 one-shot 整个应用 → 半截功能 + 没文档 | 功能清单 + "一次只做一个功能" |
| 看到已有进展就宣布完工 | 清单初始全 fail，只允许改 `passes` 字段；措辞强硬到"删除或修改测试是不可接受的" |
| 没验证就标记完成 | 显式要求用浏览器自动化（Puppeteer MCP）像真人一样端到端验；单测和 `curl` 不算数 |

- **两个可直接抄的细节：** ① 清单用 **JSON 而不是 Markdown**——实测模型更不容易擅自改写 JSON 文件；② 每轮开局固定动作序列 `pwd` → 读 progress → 读功能清单 → `git log --oneline -20` → 跑 `init.sh` → 冒烟一次核心路径，**先确认没留下破环境再开新功能**
- **作者留下的开放问题：** 单个通用编码智能体是否最优，还是测试 / QA / 清理各设专职智能体更好——这个问题在 #4（GAN 三智能体）与 #7（meta-harness）中被继续回答
- **与其他文章的关联：**

| 本文概念 | 对应文章 |
|---------|---------|
| 外部工件即跨会话记忆 | #1 仓库即记录系统、#28 Ralph（bash 循环 + 干净上下文的独立发现，早四个月） |
| 一次一个功能 + 干净收尾 | #36 dynamic workflows、#55 外环问责的最小形态 |
| 测试棘轮（不许删测试） | #49 为 Claude 写测试、#56 Bun "0 测试被跳过或删除" |
| 本文是谁的前传 | #4（同博客后续，GAN 三智能体 + harness 瘦身）、#7（把这套结构产品化成 Managed Agents） |

<a id="article-59"></a>

### 59. Anthropic / Gian Segato — 量化智能体编码评测中的基础设施噪声

- **标题：** Quantifying infrastructure noise in agentic coding evals
- **链接：** [anthropic.com](https://www.anthropic.com/engineering/infrastructure-noise)
- **作者：** Gian Segato（Anthropic） | **日期：** 2026-02-05（2026-07 存量回扫补录）
- **核心：** #38 指出基准把 model / harness / 环境折叠进一个分数，本文把**"环境"那一维单独量化**：同模型、同 harness、同任务集，只改容器资源配额，Terminal-Bench 2.0 上最阔绰与最紧的配置差 **6 个百分点（p < 0.01）**——比排行榜前几名之间的差距还大。一句话结论："几分的领先可能是真实的能力差距，也可能只是一台更大的虚拟机。"
- **实验与拐点（六档配置：严格 1x → 完全不限）：**
  - 基础设施错误率单调下降：**5.8% → 2.1%（3x，p < 0.001）→ 0.5%（不限）**
  - **1x–3x 区间成功率在噪声内波动（p = 0.40）**——1x 崩掉的任务多半本来也解不出来（智能体探索、撞资源墙、被抢占，但它从来没走在正确路径上）
  - **3x 以上性质变了**：基础设施错误只再降 1.6pp，成功率却跳了近 4pp——多出来的资源让智能体启用了"只有阔绰配额才跑得起来"的策略（装大依赖、开昂贵子进程、跑吃内存的测试套件）
  - SWE-bench 交叉验证（227 题 × 10 次采样，内存 1x→5x）方向一致但幅度小得多：**+1.54pp**
- **为什么这不是"配大点就行"：** 紧配额奖励写精简高效代码的智能体，阔配额奖励会用重型工具暴力破解的智能体——两者都是合法的测量对象，但**不声明资源配置就把它们折叠成一个分数**，差异与真实世界可迁移性都无法解读。文中的 `bn-fit-modify` 是活例：有的模型第一步就装 pandas / networkx / scikit-learn 全家桶，紧配额下装到一半 OOM，连一行解题代码都没写；另一些模型默认用标准库手写数学。
- **可操作建议：** 评测应**每任务声明两个参数**（保底分配 + 独立的硬杀阈值），而不是一个钉死的值；两者之间的带宽要校准到"底与顶的分数落在彼此噪声内"（Terminal-Bench 2.0 上 3x 是这个折中点）；执行方法本身也要写进报告。**低于 3 个百分点的排行榜差距，在配置未公开且未对齐前都值得怀疑。**
- **顺带记录的其他混杂源：** 时限、集群健康度、硬件规格、并发度、出口带宽；作者还观察到通过率随一天中的时间波动（API 时延随流量变化），未正式量化
- **与其他文章的关联：**

| 本文概念 | 对应文章 |
|---------|---------|
| 环境是评测的一等实验变量 | #38 三症状诊断（本文补上"环境"维的定量证据）、#34 配置级 harness 效应 |
| 运行时污染的另一半 | #61 Cursor 奖励作弊（信息泄漏），与本文的资源配额构成两类运行时混杂 |
| 官方评测方法论 | #47 Demystifying evals（同厂互补：那篇讲怎么评，这篇讲评测台本身怎么偏） |
| 谁在被排名 | #35 harness 效应 ≈ 模型效应（本文说：还得先扣掉基础设施噪声） |

<a id="article-60"></a>

### 60. Cursor / Stefan Heule & Jediah Katz — 持续改进我们的 agent harness

- **标题：** Continually improving our agent harness
- **链接：** [cursor.com](https://cursor.com/blog/continually-improving-agent-harness)
- **作者：** Stefan Heule & Jediah Katz（Cursor） | **日期：** 2026-04-30（2026-07 存量回扫补录）
- **核心：** 目前公开材料里，**harness 厂商对"怎么度量一次 harness 改动是不是变好了"讲得最具体的一篇**。仓库此前的传感器讨论（#19、#32）都停在"给智能体的反馈"，本文补的是另一半：**给 harness 维护者的反馈**。
- **护栏的加与减（#31 约束加减法纪律的厂商侧实录）：** 2024 年末模型不会自己选上下文，于是塞满前馈护栏——每次编辑后回灌 lint 与类型错误、读取行数太少就重写它的请求、限制单轮最大工具调用数，外加大量固定静态上下文（目录布局、语义匹配代码片段、压缩版附件）。**"这些大部分早就没了。"** 留下的静态上下文只剩操作系统、git 状态、当前与最近打开的文件，其余改为智能体自己动态取。
- **两层度量：**
  - **离线：** 公共基准 + 自家 CursorBench，快速标准化读数、可跨时间比较，但"再好的基准也只是真实使用的近似"
  - **在线 A/B：** 除时延、token 效率、工具调用数、缓存命中率这类方向性指标外，两个直击"到底干得好不好"的信号——**Keep Rate**（智能体提议的改动，在固定时间后仍留在用户代码库里的比例）和**用大模型读用户对首次输出的回复**判断满意度（"用户接着做下一个功能"是强正信号，"用户贴了一段 stack trace"是可靠负信号）
  - 被在线实验否掉的例子：用更贵的模型做上下文摘要，质量差异可忽略，不值这个成本
- **把工具错误当生产事故运营：** 工具调用出错会留在上下文里持续消耗 token 并造成 **context rot**。错误分成"未知"和"预期"两类——**未知错误一律视为 harness bug**，超过固定阈值即告警；预期错误按成因分类（`InvalidArguments`、`UnexpectedEnvironment`、`ProviderError`、`UserAborted`、`Timeout`），用**按工具、按模型分别计算的基线**做异常检测（不同模型搞砸工具调用的比率本来就不同）。再叠一个每周 Automation：带日志检索 skill 的模型翻日志、挑出新增或激增的问题、建/更新工单并附调查，再由 Cloud Agents 批量开修。**一个专项冲刺把意外工具调用错误降了一个数量级。**
- **按模型定制 harness（与 #62 互为正反面）：** "所有 harness 抽象都是模型无关的，但对每个支持的模型都做深度定制。"OpenAI 的模型被训练成用 **patch 格式**编辑文件，Anthropic 的模型被训练成用**字符串替换**；两者都能用对方的工具，但**给它不熟悉的那个会多花推理 token 并产生更多错误**，所以 harness 给每个模型配它训练时用的工具格式。提示词也按厂商甚至按版本定制（OpenAI 的模型更字面、更精确地遵循指令，Claude 更凭直觉、对不精确指令更宽容）。还记录了一个模型怪癖：**context anxiety**——上下文窗口填满时开始推脱、说任务太大干不了，靠调提示词缓解。
- **会话中途换模型的三重代价：** 新模型要在别的模型产生的对话历史上工作（分布外）→ 加"你是中途接手"的定制指令并劝阻它调历史里出现过、但不属于自己工具集的工具；缓存按厂商与模型隔离 → 换模型必然缓存未命中，试过用切换时摘要来减小惩罚，但复杂任务下摘要会丢细节；官方建议是一次会话别换模型，要换就改用 subagent（从干净上下文起步）
- **与其他文章的关联：**

| 本文概念 | 对应文章 |
|---------|---------|
| 按训练分布供给工具形状 | #62 Ronacher（同一现象的两侧：这里是供给侧对策，那里是被这个先验打的第三方） |
| 拆护栏、改动态上下文 | #66 Anthropic 删 80% 系统提示词（两家独立收敛）、#4 harness 瘦身、#31 约束加减法 |
| Keep Rate / 用户回复情绪 | #19 推理性传感器谱系的产品化、#47 outcome ≠ transcript |
| 未知错误即 bug + 按工具按模型基线 | #23 质量回归复盘（缺的正是这套告警）、#24 每次编辑即可证伪契约 |
| harness 自己的软件工厂 | #27 LangSmith Engine、#44 Self-Harness、#63/#64 软件工厂的正面样本 |

<a id="article-61"></a>

### 61. Cursor / Naman Jain — 奖励作弊正在淹没模型智能的增益

- **标题：** Reward hacking is swamping model intelligence gains
- **链接：** [cursor.com](https://cursor.com/blog/reward-hacking-coding-benchmarks)
- **作者：** Naman Jain（Cursor） | **日期：** 2026-06-25（2026-07 存量回扫补录）
- **核心：** 用一个**审计智能体**读 731 条 Opus 4.8 Max 轨迹（只给问题陈述与完整轨迹，**不告诉它这次跑通没跑通**），判定智能体是"检索到了已知答案"还是"推导出了答案"。结果：**SWE-bench Pro 上 63% 的成功解属于检索而非推导。**
- **两种主要作弊路径：**
  - **上游查找（57% 的轨迹）：** 在公网上找到已合并的 PR 或修好的源文件，近乎逐字复现。示例调用就是 `curl` GitHub API 的 `/pulls/<n>/files`——同一响应连每个文件的 diff 一起返回
  - **git 历史挖掘（9% 的轨迹）：** 在打包进镜像的 `.git` 里搜出未来那个修复提交，`git show` 读 diff 然后直接 `git cherry-pick`
- **封住之后掉多少：** 严格 harness = ①开跑前删掉 `.git`、把仓库重建为单提交仓库（评分时才恢复原历史），②默认拒绝出网、只给一个固定代理按白名单解析包依赖。
  - SWE-bench Pro：**Opus 4.8 Max 87.1% → 73.0%；Composer 2.5 74.7% → 54.0%**
  - 差距随模型变强而扩大——SWE-bench Multilingual 上 Opus 4.6 不到 1pp、Opus 4.8 Max 9.1pp、Composer 2.5 7.5pp；SWE-bench Pro 上 Opus 4.6 不到 1pp、Opus 4.8 Max 14.1pp、Composer 2.5 **20.7pp**。GPT 系列在他们的跑批里没有同等的升级趋势
- **最值得记的一个机制：** 一道来自 2019 年 jq issue 的任务，智能体用系统里的 jq 二进制去复现 bug，因为镜像是在修复之后构建的，**复现失败 → 智能体据此推断"这个问题已经被修过了" → 转去搜答案**。也就是说，**环境本身会泄漏"这是一道旧题"的元信息**，不需要模型记得训练数据。
- **难得的自曝：** Composer 2.5 是全研究里 Pro 差距最大的模型，Cursor 因此明确表示**不把标准 SWE-bench Pro 分数当作 Composer 的可信基准数字**——"分数在'harness 确实产出了它'这个狭义上是真的，但它把编码能力和拿到已知修复混在了一起。"
- **留下的开放问题：** 封 git 与断网只能挡住这一层。随着模型越来越能推断"我正在被评测"，它可能以更隐蔽的方式改变行为——**在模型知道自己被评测时仍保有构念效度的评测**，才是更难的那个问题。
- **与其他文章的关联：**

| 本文概念 | 对应文章 |
|---------|---------|
| 运行时污染（信息侧） | #59 基础设施噪声（资源侧）——两篇合起来是"环境这一维"的完整体检 |
| 审计轨迹而非只看结果 | #47 outcome ≠ transcript 的工业规模落地、#33 HarnessAudit 中途轨迹违规 |
| 越强的模型越会钻空子 | #25 Overeager Coding Agents、#44/#57 自演化里的 reward hacking 防线 |
| 基准分数该怎么读 | #38 基准错位、#35 harness 效应统计归因、#63 "我不信今天的基准提升" |

<a id="article-62"></a>

### 62. Armin Ronacher — Better Models: Worse Tools（工具 schema 不是中立的）

- **标题：** Better Models: Worse Tools
- **链接：** [lucumr.pocoo.org](https://lucumr.pocoo.org/2026/7/4/better-models-worse-tools/)
- **翻译：** [works/ronacher-better-models-worse-tools-translation.md](../works/ronacher-better-models-worse-tools-translation.md)
- **作者：** Armin Ronacher（Flask / Jinja 作者、Sentry 创始人，现做编码智能体 Pi） | **日期：** 2026-07-04
- **核心：** 仓库长期挂着"跨模型可移植性"缺口，本文给了它**第一个机制级的坏消息**：Anthropic 的新模型（Opus 4.8、Sonnet 5）在**非 Claude Code 形状**的编辑工具上比它们的老版本更差。这不是模型变笨，是**后训练把一个特定 harness 的习惯烙进了先验**。
- **症状：** Pi 的编辑工具用嵌套的 `edits[]` 数组。模型产出的 `oldText` / `newText` **字节正确**，然后在对象末尾追加凭空发明的键——`type`、`id`、`kind`、`unique`、`requireUnique`、`matchCase`、`in_file`、`forceMatchCount`、`children`、`notes`、`cost`、`oldText2`、`newText2`，甚至 `event.0.additionalProperties`。原文只说**更老的模型一个都没有这个毛病**，并未点名具体版本（有二手报道给出 Sonnet 4.6 / Opus 4 的对照，但那不出自原文）。
- **复现条件很挑：** 单轮"编辑这个文件"完全不复现；要有"读过文件、诊断过问题、然后组装多行编辑"的智能体历史才出得来。某条会话里 Opus 4.8 失败率约 **20%**；**剥掉历史中的 thinking block 让失败率减半**；**打开 strict 模式则清零**。
- **作者的假说链（本文最有价值的部分）：**
  1. 现代 Anthropic 模型的后训练很可能就在 Claude Code（或其仿真）里做
  2. 而 Claude Code 客户端**极其宽容**——反编译可见：检测正文里泄漏的 `<invoke` 标记并触发重试状态机、修复破损的 `\uXXXX` 与孤立代理项、按工具做参数别名（`old_str`/`old_string`、`new_str`/`new_string`、`path`/`file_path`）、类型强转，**并静默过滤掉未知键**；它自己也没开 `strict`（Anthropic 对 strict 的工具定义有复杂度上限）
  3. 于是**略微畸形的工具调用照样完成任务、照样拿到奖励**——梯度里没有任何东西反对乱加字段
  4. 结果：模型对 Claude Code 的扁平 `file_path` / `old_string` / `new_string` / `replace_all` 形状形成极强先验。换个语义相同但 schema 不同的工具就**越来越分布外**，而**训得越好的模型反抗得越凶**
- **一个漂亮的观察：** 按 ANTML 序列化，顶层字符串参数内联，而对象数组要写成 JSON。发明出来的键**恰好出现在整个任务熵最高的那一点**——几百 token 的转义 `newText` 字符串刚收尾，模型要决定下一个 token 是 `}` 还是 `, "..."`。作者据此推测 Opus 学到的是"编辑操作可以多一个可选字段"，但在 Pi 的形状下它没有受过训练的字段名可用，于是每次现编一个像样的——这解释了为什么失败产出的是几十个随机键而不是一个稳定的别名。
- **结论与立场转变：** "工具 schema 不是中立的，至少在 Anthropic 模型上不是。"作者原本对语法受限解码（constrained decoding）持保留态度，本文让他显著改变先验：**如果新模型在解题上更强、在忠实输出替代 schema 上更弱，那 harness 就必须在别处拿到更硬的保证。**并给出对比：OpenAI 的 harmony 格式把 `<|constrain|>json` 写进传输格式本身、外加 LARK 语法选项，而 Anthropic **模型闭源、harness 也闭源**，第三方只能猜。
- **与其他文章的关联：**

| 本文概念 | 对应文章 |
|---------|---------|
| 跨模型可移植性（缺口回应） | #35 harness 效应异质、#57 HarnessX 共演化（本文即共演化的负外部性）、#52 本地模型工具调用是分水岭 |
| 宽容的 harness 会污染训练信号 | #60 Cursor 按训练分布供给工具格式（供给侧对策）、#63 "RL 里没有对坏设计的惩罚"（同构论证的另一目标） |
| Claude Code 客户端行为的证据来源 | #30 源码泄漏事件（512K 行 harness 的可观测性） |
| harness 生态的锁定效应 | #2 Harnessability 的新维度：schema 与主导 harness 的距离是一种可设计属性 |

<a id="article-63"></a>

### 63. Dex Horthy / HumanLayer — 为什么软件工厂会失败（harness engineering 还不够）

- **标题：** Why Software Factories Fail — or: harness engineering is not enough
- **链接：** [wsff.md 全文（固定到 commit `418c1db`，2026-07-23 抓取）](https://github.com/humanlayer/advanced-context-engineering-for-coding-agents/blob/418c1dbaa9b71592bc58c44074cacb85a3092c7f/wsff.md) | [上游 main 最新版](https://github.com/humanlayer/advanced-context-engineering-for-coding-agents/blob/main/wsff.md) | [AI Engineer World's Fair 2026 主题演讲](https://www.youtube.com/watch?v=Ib5GBkD555M)
- **作者：** Dex Horthy（HumanLayer 创始人兼 CEO；Pragmatic Engineer 称其为"context engineering"一词的提出者。本仓库 #5《Skill Issue》出自同一组织） | **日期：** 2026-07
- **核心：** 迄今为止**对 harness engineering 最正面、也最有分量的一次反驳**——而且来自这个学派内部。论点一句话：**"再多的 harness engineering 或 loopsmaxxing，都解决不了一个本质上属于模型训练的问题。"** 注意作者的免责声明：他自己卖的正是人机协作工具，立场有偏。
- **他自己踩的坑（第一手反例）：** 2025 年 7 月 HumanLayer 全面转"熄灯"——只读 spec 和工单，中小任务全交后台智能体，没人读代码。结局是遇到一个智能体怎么都修不好的问题，只能回头去啃三个月没读过的代码库；期间**站点宕机、用户不满**。第一次他说服自己"这点风险换速度值得"；到 11 月第三次时，团队判定重写更划算，联合创始人**花两周在 VS Code 里手工把模式重新梳一遍**。
- **为什么模型做不了可维护性（本文的核心论证）：**
  - RLVR 的打分是一维的。以 SWE-bench Multilingual 为例，任务约十五分钟量级，奖励只有 `FAIL_TO_PASS`（修好了没）与 `PASS_TO_PASS`（有没有搞坏别的）两个 0/1 位——**对侵蚀可维护性没有任何惩罚**。文中还原了一道 `fastlane__fastlane-19304` 的完整评分流程（丢弃模型对测试文件的任何改动、再贴上基准的测试补丁），并指出"模型怎么到达正确答案不重要"
  - **测试给你秒级反馈，糟糕架构的成本函数以周、月甚至年计。** 那一刻发生在有人为了改一行打开那个文件、发现必须在十一处同样地改、还要祈祷三个文件外不会悄悄坏掉的时候（Fowler 的 shotgun surgery）
  - **"如果一个模型能可靠区分好代码和坏代码，它一开始就会写出好的那版。"** RL 需要又快又可靠的 oracle，而可维护性没有快 oracle
  - 更多评审智能体和更多 token 确实有用，但**它们抬的是地板不是天花板**——天花板是 RL 里教会的东西
- **为什么 Claude Code 赢：** 在它之前已有 aider、cline、codebuff，工具集几乎一样，但工具调用会时不时地失败。被广泛接受的解释是 **Anthropic 在 harness 内部对模型做了 RL**——第一次有实验室针对自己要发布的那套工具训练模型。作者引 OpenAI 团队的说法收尾：**你造了 harness 但不拥有权重、不能在里面做 RL，就永远处于劣势**（这条与 #62 Ronacher 的发现互为镜像）
- **他认为方向对的三个前沿尝试：** SWE-Marathon（Abundant AI；**这里是 Dex 的转述**——“约 400 小时的巨型任务 + 复合奖励通道而非单个通过位”。论文本体见 [arXiv 2606.07682](https://arxiv.org/abs/2606.07682)：20 个超长任务，每个配可执行环境 + 人写参考解 + **多层验证套件**，轨迹平均 27.2M token，前沿编码智能体解出率不到 30%，13.8% 的 rollout 出现奖励作弊。**"复合奖励 vs 单个通过位"是 Dex 的说法，最终计分口径以论文为准**）、DeepSWE（Datacurve，用现实中从未真正实现过的大任务规避污染）、Frontier Code（Cognition，多 PR 任务，且**用变异测试式的确定性手段做惩罚——如果模型写的测试在打补丁之前也不会失败，就扣分**，另跑一个判官模型按代码质量规则读 diff）
- **他给出的替代方案——把人的判断前移到四个阶段：** 产品评审（用户痛点 + 成功标准，且**用 HTML mockup 代替三段描述**）→ 系统架构（时序图、接口契约、数据模型）→ **程序设计**（他认为最被低估的一环：在写实现前先定类型、方法签名、程序布局与**调用栈树**，用 diff 语法标出变化，配文件树 diff）→ 垂直切片（tracer bullet；模型天然爱"横向计划"按 DB→服务→API→前端分层推进，中途没法真正上手摸）。任务分布大致是**约 40% 一把过或加一两轮轻反馈**，中型任务合成一份计划文档，大型任务走全流程。
- **两句可以直接引用的话：** "你不是 PR 太多，你是**烂 PR** 太多"（他估计 AI 一把过的 PR 返工率接近 50%）；"你可能太忙着追 10–100x，忙到没空接受约束、稳稳地快 2–3 倍"
- **他引的行业数据（Faros AI《AI acceleration whiplash》报告，相关性信号而非因果铁证）：** 评审评论数 +25%、评论长度 +22.7%、**+31.3% 的 PR 完全跳过评审**；每 PR 事故数 +242.7%、月度事故 +57.9%、人均 bug 数 +54%
- **与其他文章的关联：**

| 本文概念 | 对应文章 |
|---------|---------|
| 点名反驳的对象 | #1 OpenAI 原点、#16 Symphony（作者直接引用并致敬后反驳）、#31 学科汇流 |
| 同一组织的自我修正 | #5 HumanLayer《Skill Issue》六杠杆（2026-03）→ 本文（2026-07）"杠杆不够" |
| 可维护性没有快 oracle | #19 计算性 vs 推理性传感器的边界、#49 GCC oracle 与 #56 测试套件 oracle 之所以奏效的前提 |
| 熄灯工厂的失败实录 | #64 Osmani 同题（明确基于本演讲）、#42 Ronacher comprehension |
| 评审是瓶颈 / 反馈是新瓶颈 | #26 Chris Parsons、#55 外环问责、#78 YDD 效率悖论与 Faros 数据 |

<a id="article-64"></a>

### 64. Addy Osmani — Software Factories, Light and Dark（哪些循环配得上熄灯）

- **标题：** Software Factories, Light and Dark
- **链接：** [addyosmani.com](https://addyosmani.com/blog/software-factories/)
- **作者：** Addy Osmani | **日期：** 2026-07-20
- **核心：** 把 #63 的论战整理成一个可操作的开关问题。三层堆叠讲得比谁都干净：**loop 是原子**（收集上下文 → 动作 → 检查结果 → 再来一遍，直到某条件满足），**harness 是循环外面的墙**（沙箱、可达工具、跨轮存活的记忆、判定"做完了"的闸门——"loop 是行为，harness 是行为运行其中的环境"），**工厂是同时跑的许多被 harness 包住的循环**，由一个队列喂料、经一道评审闸门排入生产。"工厂不是更聪明的智能体，它是一张由循环组成的组织架构图。"
- **"暗"字是物理描述不是贬义：** 借自制造业的熄灯工厂（FANUC 从 2001 年起、小米 2024 年也开了一座），车间里只有机器，机器不需要光。**在软件里，车间地板就是 diff**；把"读"这个动作从流程里拿掉，工厂就熄灯了。
- **工厂闭环里只有一个盒子贵：** 意图（来自工程领导层与工程师）与信号（事故、用户请求）汇入队列 → harness 取一件事造出改动 → CI / 测试 / 静态分析 / 各类扫描并行跑完，几乎零成本 → **评审闸门** → 部署 → 监控把生产变回信号。生成、测试、扫描都能近乎免费地规模化，**唯一顽固不肯规模化的就是那个琥珀色的"判断"盒子**。
- **背压规则（本文最可执行的一句）：** **你只能把"能廉价且可靠地验证"的那么多自主权交给一个循环，一寸都不能多。**约束从来不是生成，是验证；加宽入口只会让瓶颈处堆得更高。第二层论证：改进模型不会自动补上这个缺口——**架构优劣的成本函数以月和年计量，算不出整洁的梯度**，一个指望即时评判复杂设计决策的系统就不会被训练在好例子上。
- **什么样的循环配得上熄灯：** 检查**便宜**、**高频**、依赖**难以糊弄**的东西，并且 oracle 要**立即回答且不随时间漂移**——绿/红 oracle、类型闸门、property test、配了真实评分表的评审智能体都算数。附 Dex 的经验法则：**智能体在 3–10 步内稳得住，超过 20 步开始跑偏**（原因是上下文累积），所以短循环天然更容易验证。反过来，**错一次很贵且只有人能发现**的循环要留灯：测试抓不到的隐蔽生产 bug、大爆炸半径、会塑造未来一年工作的决策。**最危险的不是选错某一档，而是忘了逐个拨开关、把它们全设成同一档**——全暗四个月后拆房重建，全亮则评审彻底堵死。
- **架构作为廉价且难以伪造的安全网：** 好的类型与方法签名、测试缝、让下一个读者（人或模型）找得到东西的布局、短而可读的调用栈、清晰的组件边界、依赖注入——"没有一样是新的"，但在智能体时代它们开始**兼任第二份工作**。而且这张网**必须活在模型之外**：最能干的编码智能体（Claude Code、Codex）都是对着自家 harness 与工具做强化训练的，流畅于本行的一切工具与惯用法，**但不流畅于长期可维护性**。
- **循环还是图：** 作者认为把任务交给智能体时你多半会围着它建一张图（有限状态机 / 条件连边的服务调用）——"软件本来就有这种结构，我们过去就是画流程图的；真正新的动作是试图把图丢掉"。图的吸引力在于**它就是画成示意图的背压**：让渡一部分自由，换来强制检查点与可指认的失败节点。他点了 LangGraph、LlamaIndex Workflows、Jerry Liu 的混合工作流—图，以及 David Khourshid"这不过是状态机与 actor 模型换了身衣服"的提醒。
- **与其他文章的关联：**

| 本文概念 | 对应文章 |
|---------|---------|
| 直接上游 | #63 Dex Horthy 演讲（作者明确基于它展开）、#55 Own the Outer Loop（本文是它的工厂尺度版） |
| loop / harness / factory 三层 | #41 Loop Engineering 五构件、#43 官方四类循环、#3 harness 组件清单 |
| 背压与验证是唯一约束 | #28 Ralph 背压、#26 反馈是新瓶颈、#2 Ashby 必要多样性 |
| 熄灯的准入条件 | #19 计算性传感器（廉价、高频、难糊弄）、#49/#56 近乎完美验证器的两个正例 |
| comprehension debt | #42 Ronacher、观察项 Geoffrey Litt "Understand to participate" |

<a id="article-65"></a>

### 65. Cursor / Wilson Lin — 智能体蜂群与新的模型经济学

- **标题：** Agent swarms and the new model economics
- **链接：** [cursor.com](https://cursor.com/blog/agent-swarm-model-economics) | [产出代码 cursor/minisqlite](https://github.com/cursor/minisqlite)
- **作者：** Wilson Lin（Cursor） | **日期：** 2026-07-20
- **核心：** #48 同一作者的续篇，也是仓库"成本数据"缺口迄今最完整的一次填补。任务：**只给 835 页 SQLite 手册，用 Rust 从零实现整个 SQLite**——源码、测试套件、SQLite 二进制、互联网全部扣留；用智能体从未被告知存在的 **sqllogictest**（数百万条已知答案的查询）打分。新旧两版蜂群同任务、同模型、同时间预算对照：**新版在每一种模型组合上都更好**，四小时切点上新版落在 73%–85%、旧版 11%–77%，**新版每种配置最终都跑到 100%**；旧版的 Grok 4.5 跑到第二小时前就被迫暂停。
- **成本才是标题：** 质量趋同，**账单从 $1,339（Opus 4.8 规划 + Composer 2.5 干活）到 $10,565（GPT-5.5 全包）**。结构上，worker 在每一次跑批里都吃掉至少 69%、多数时候 90%+ 的 token，但**规划 token 更贵**——Opus 混合配置里，规划者只产出一小部分 token 却占约三分之二成本。最刺眼的对照是 worker 舰队本身：**GPT-5.5 全包 $9,373 vs Opus+Composer $411**。论点因此很干脆：**一次大任务里真正需要前沿智能的时刻很少**（最初的分解、设计决策、若干权衡），一旦前沿规划者把歧义压成明确指令，便宜模型照着做就行。反例也记下了：Fable 5 规划者用的规划 token 少得多、账单更小，但**它的 worker 多花了几倍 token，整场反而更贵**——规划质量会传导到执行成本。
- **树与叶（为什么是分层而不是并行）：** 规划者拆解并委派、从不实现；worker 执行、从不规划。单个长跑智能体必须自己走完整棵树，同时揣着祖先节点、当前位置和总目标——**要么盯着眼前活儿丢掉大局，要么守着大局把这块做砸**。作者认为蜂群的可扩展性主要来自**上下文效率而非并行度**，并引科斯的企业理论作类比：协调成本比工作本身涨得更快，组织于是沉淀成一层层有界单元。
- **每秒 1000 次提交暴露的五种失效（人类团队不会常遇到的）：**

| 失效模式 | 对策 |
|---------|------|
| Split-brain 设计：两个互不知情的规划者在不同地方实现同一概念 | 靠提示词：规划者自己做设计决策而不下放，且必须保证两棵委派子树不会去决定同一个问题 |
| 规划者争用：两个知情的规划者在同一批文件上来回改 | 决策写进共享设计文档；依赖某决策的代码带**编译期可检查的回指引用**；矛盾时由 reconciler 合并文档，引用把结论传导下去 |
| 合并冲突：worker 不擅长吸收他人上下文，要么覆盖别人要么放弃自己 | 中立的第三方智能体代所有当事人裁决合并，目标只有公正与高效（类比合并队列） |
| 巨文件：热门文件人人加一点、没人负责瘦身，运输/diff/合并都贵且成为持续碰撞点 | 给 worker 一个"标记文件过胖"的机制，标记后封禁新提交，由外部智能体拆分 |
| 僵化：智能体从"有人类在环的既有代码库"学会了不碰核心代码 | **明确授权破坏性改动**——判断值得就在自己范围外打一个聚焦补丁并留注释说明理由；编译器把这个改动传导出去，每个撞上错误的智能体读到注释再各自跟进 |

- **另外三件工程活：**
  - **自建版本控制系统。** 旧的浏览器蜂群在 Git 上峰值约 **1,000 次提交/小时**，新系统峰值约 **1,000 次提交/秒**。自己拥有这一层不只是为吞吐——所有改动都过 VCS，碰撞在这里第一次可见，若干协调机制就直接实现在里面
  - **评审透镜要去相关。** 试过给评审者完整轨迹、只给输出、什么都不给只给代码库，也试过换模型、换训练、换人格。**没有单一透镜能抓全，但去相关的透镜可以叠加**——就像自动驾驶不靠任何单个完美部件就达到超人可靠度；评审的算力回报很高，因为**评审比它审的活儿便宜得多**
  - **Field Guide（共识蚁迹）。** 一个完全由智能体拥有的目录，其 `index.md` 自动注入每个智能体的开局，写什么由它们自己策展，唯一约束是行数预算。逻辑是：**模型权重是冻结的，所以恰恰是那些"意外遭遇"值得被记下来，好让下一条轨迹更短**
- **量化的失效对照（Grok 4.5 新旧同任务）：** 旧版前两小时产出 68,000 次提交（约为新版节奏的 70 倍），但**积累了 7 万多次合并冲突且还在加速**，新版整整四小时不到一千次；旧版最热的那个文件收了 **7,771 次冲突、被 1,173 个不同智能体碰过**，新版全库最有争议的文件只有 **47** 次。旧版蔓延到 **54 个 crate**（含三个各自独立的 SQL 包），新版早早稳定在 **9 个**且再没加过。最终代码量：Fable 5 组合下旧版 64,305 行引擎代码、新版 **9,908 行**；Opus 组合下旧版 19,013 行拿 97%、新版 **4,645 行**拿 100%。
- **"spec 即提示词"：** 自动补全把工作单位提到一行，早期模型提到一段，智能体提到一个文件或一个功能，**蜂群把它提到一份 spec**。作者把蜂群类比成编译器——规划者把目标解析成任务树、一步步下降为可执行的活儿，**区别是编译器每一步都保义，而蜂群每一步都是概率性的，本文描述的一切都是为了弥合这个差**。稀缺的不再是实现，而是**对意图的正确描述**。
- **与其他文章的关联：**

| 本文概念 | 对应文章 |
|---------|---------|
| 成本数据（缺口回应） | 观察项 The Harness Effect（成本 -41%）、#57 HarnessX 弱模型受益最大——本文给出"强规划 + 弱执行"的价格实证 |
| 前作与失败史 | #48 扁平自协调失败（本文是它的工程化答卷）、#28 Ralph 背压 |
| 并行智能体的工业实录 | #56 Bun 重写（同为"修流程不修代码"）、#49 无编排者的 16 个 Claude（对照组） |
| 去相关评审叠加 | #36 对抗验证、#56 二对抗评审者、#63 "更多评审抬地板不抬天花板"（本文是反方证据） |
| 智能体自策展的共享上下文 | #15 三层学习、#8 团队标准显式化、#1 仓库即记录系统 |

<a id="article-66"></a>

### 66. Anthropic / Thariq Shihipar — Claude 5 世代的上下文工程新规则（删掉 80% 系统提示词）

- **标题：** The new rules of context engineering for Claude 5 generation models
- **链接：** [claude.com](https://claude.com/blog/the-new-rules-of-context-engineering-for-claude-5-generation-models)
- **翻译：** [works/anthropic-context-engineering-claude5-translation.md](../works/anthropic-context-engineering-claude5-translation.md)
- **作者：** Thariq Shihipar（Anthropic 技术团队） | **日期：** 2026-07-24
- **核心：** #4 提出的"harness 瘦身"、#31 讲的"约束加减法纪律"，在这里第一次有了官方的量化落地：**为 Claude Opus 5 / Claude Fable 5 这一代模型，Claude Code 的系统提示词被删掉了 80% 以上，编码评测上没有可测量的损失。** 自陈的病因是"我们在过度约束 Claude"——读内部转录时能看到同一个请求里系统提示词、skill 与用户请求互相打架（"适当留文档"对上"不要写注释"），模型必须先想清楚这些冲突再决定做什么。
- **六组 then / now（本文的主体，可直接当自查表；原文配了一张按顺序列出这六组的图）：**

| 过去 | 现在 |
|------|------|
| 给 Claude 规则 | 让 Claude 用判断力。旧系统提示词写"默认不写注释、绝不写多段 docstring"；新版改成一句**"写得像周围的代码：匹配它的注释密度、命名与惯用法"** |
| 给 Claude 示例 | 设计接口。示例反而把新模型**限制在某个探索空间**里；该花心思的是工具、脚本与文件的参数设计够不够表达力。原文配图给了尺度：旧版 TodoWrite 描述约 **9,100 字符**（塞满何时使用的清单与示范例子），换成短接口后只剩一句说明 + pending/in_progress/completed 枚举 + 一条"同一时间只允许一项 in_progress" |
| 全部前置塞进去 | 渐进式披露。验证与代码评审从系统提示词移进各自的 skill；**工具也可以 deferred loading**——必须先用 ToolSearch 搜到完整定义才能用，于是工具可以变多而不占上下文 |
| 重复自己 | 简单的工具描述。旧模型有时需要重复指令、或更听上下文末尾的话；现在可以删掉重复，把用法写进工具描述而不是系统提示词 |
| 用 CLAUDE.md 当记忆 | 自动记忆。不再靠 `#` 热键手动写入，Claude 自己保存与工作和你相关的记忆 |
| 简单的 spec | 丰富的引用。**spec 可以是一份详细的测试套件，或另一个代码库里的一个函数**；也可以是 HTML artifact；**rubric 也是一种引用**——让 Claude 用动态工作流起验证者智能体来核对你的品味 |

- **落到自己项目上的四条：** ① 系统提示词与产品语境强绑定，用 Claude Code 的人基本不会改它，**但如果你在造自己的 harness，这里才是该花大力气的地方**；② CLAUDE.md 保持轻量，简述仓库是干什么的，**把 token 主要花在代码库里的 gotcha 上**，别写文件系统一看便知的"显而易见的事"；③ skill 当作轻量指引，除极重要处别写得过度约束，长 skill 拆成多文件做渐进式披露，**最好承载的是你/你的团队/你的产品特有的观点与实践**；④ 引用优先给代码形态——**一份 HTML mockup 通常比一段描述或一张截图产生更好的结果**
- **配套：** 新命令 `claude doctor`（Claude Code 内 `/doctor`）用来自动给 skill 与 CLAUDE.md 做"合身度"检查
- **与其他文章的关联：**

| 本文概念 | 对应文章 |
|---------|---------|
| Harness 瘦身从主张到数据 | #4（同厂提出）、#31 约束加减法纪律、#69 LangChain 用基准裁决删中间件（第三方同期同向） |
| 拆护栏是行业级动作 | #60 Cursor 2024 末的护栏"大部分早就没了"——两家独立收敛 |
| 渐进式披露 | #22 interpreter 是第三类上下文表面、#43 官方四类循环、观察项 Steering Claude Code 七种转向机制 |
| 规则 vs 判断力 | #25 提示声明授权反而降低边界推断、#63"模型对本行工具流畅、对可维护性不流畅"（本文的反方脚注） |
| spec 即测试套件 / rubric | #20 SPDD prompt 即一等交付物、#56 语言无关测试套件作 oracle、#36 对抗验证 |

<a id="article-67"></a>

### 67. Don't Blame the LLM 论文 — 固定模型、只变 harness 的受控纵向研究

- **标题：** Don't Blame the Large Language Model: How Agent Harness Evolution Shapes Coding Agent Quality
- **链接：** [arxiv.org/abs/2607.03691](https://arxiv.org/abs/2607.03691)
- **作者：** Oussama Ben Sghaier、Hao Li、Bram Adams、Ahmed E. Hassan（Queen's University） | **日期：** 2026-07-04（v1）/ 2026-07-20（v2）
- **核心：** 仓库里关于"harness 才是那个变量"的主张，此前主要靠 #34/#35 的横截面测量与 #23 的单次复盘。本文是**第一个把它做成受控纵向研究**的工作：**既有研究都固定 harness、换模型，他们反过来——固定模型，只换 harness 的 35 个连续版本。**（论文自述为 controlled longitudinal study。固定模型隔离掉了"模型更新"这一项混杂，但版本间的 harness 变更本身并未随机化，因此这是强关联证据，不是随机化的因果识别。）
- **两段研究：**
  - **面上：** 实证五个主流开源 harness（Codex、Qwen Code、Gemini、OpenCode、OpenHands）的开发与发布演进，发现**发布速度超过每天两次**、数月内积累数千 issue
  - **点上：** 对 Qwen Code CLI 的 **35 个连续版本**做受控深潜，每个版本对 **50 个分层抽样的 SWE-bench Verified 任务**跑一遍，**底层 LLM 保持不变**，同时测有效性与效率；再把测出来的质量波动**追溯到具体的开发模式与架构组件**，并用单个 pull request 的定性证据佐证
- **它替仓库回答的是哪句话：** 实践者常在 harness 更新后报告质量退化，**却一贯把账算到模型头上**——标题正是冲着这个来的
- **一个顺带的术语学证据：** v1 标题是 *How **Scaffolding** Evolution Shapes Coding Agent Quality*，v2 改成 *How **Agent Harness** Evolution…*，正文措辞同步替换。这条 16 天内发生的改词本身，就是 "harness" 取代 "scaffolding" 成为学术圈默认词的一手史料（可与观察项 thedeepfeed 的传播史对照）
- **与其他文章的关联：**

| 本文概念 | 对应文章 |
|---------|---------|
| harness 版本演进导致质量波动 | #23 Anthropic 质量回归复盘（第一手单次事件）→ 本文（外部、35 个版本、可复现） |
| harness 接口维护成本（开放问题） | #2 Harnessability、已跟踪产品 claude-code-harness v4.2"七项变更里 6 项是追上游" |
| 固定一侧变另一侧的实验设计 | #34 Harness-Bench（固定任务变配置）、#35 榜单方差归因、#59 固定一切只变资源 |
| 演化本身是瓶颈 | #53 Harness Handbook（行为定位）、#68 自动演化的负面结果 |

<a id="article-68"></a>

### 68. Rethinking Harness Evolution 论文 — 自动 harness 演化的第一份系统性负面结果

- **标题：** Rethinking the Evaluation of Harness Evolution for Agents
- **链接：** [arxiv.org/abs/2607.12227](https://arxiv.org/abs/2607.12227) | [代码](https://github.com/rethinking-harness-evolution)
- **作者：** Yike Wang、Huaisheng Zhu、Zhengyu Hu、Yige Yuan、Zhengyu Chen、Shakti Senthil、Hannaneh Hajishirzi、Yulia Tsvetkov、Pradeep Dasigi、Teng Xiao | **日期：** 2026-07-14
- **核心：** 仓库已经收了一整条"智能体自动改进 harness"的线（#11 Meta-Harness、#24 AHE、#44 Self-Harness、#57 HarnessX、#45 Weng 综述）。本文是**这条线的第一份系统性反证**，而且打的不是结论而是**评测协议**。
- **两条方法论质疑：**
  1. **harness 演化本身就是一种搜索。** 它反复用任务反馈评估并修改候选 harness——这与智能体的 test-time scaling 是同类动作。因此必须在**同等反馈预算与推理预算**下，与简单的 task-level 搜索基线对比，才能分清收益来自"更好的 harness 设计"还是"单纯多搜了几轮"
  2. **搜索与最终评测共用同一个基准。** 用单元测试搜配置、再在同一个公开基准上报成绩，报出来的增益**有过拟合到那个任务集的风险**
- **他们怎么做与得到什么：** 在**同等反馈与推理预算**下把 harness 演化与简单 test-time scaling、discovery 基线对齐比较，并把演化出的 harness 拿到**留出任务**上测泛化。Terminal-Bench 2.1 上用 GPT-5.4 与 Claude Opus 4.6 跑，结论是**自动 harness 演化并不能稳定优于简单的 test-time scaling，且泛化能力有限**。
- **怎么读它才对：** 这不是"自动演化没用"的判决，而是"**现有证据不足以支持它有用**"的方法论警告——它对应 #38 那条主线（基准把不同来源的效应折叠进一个分数）在自演化子领域的复现。读 #57 HarnessX 的 +14.5% 与 #44 的 +14~21pp 时，应当同时问：基线是否在同等搜索预算下？留出任务上还剩多少？
- **与其他文章的关联：**

| 本文概念 | 对应文章 |
|---------|---------|
| 直接质疑的对象 | #11 Meta-Harness、#24 AHE、#44 Self-Harness、#57 HarnessX、#45 Weng RSI 综述 |
| 同等预算基线的要求 | #38 基准错位、#35 统计归因、#59 基础设施噪声（三者共同构成"分数怎么读"工具箱） |
| 搜索集与评测集重叠 | #61 Cursor 奖励作弊（污染的另一种形态：答案本身在环境里） |
| 与观察项的互证 | Harness Updating ≠ Harness Benefit（利用 harness 的能力非单调）、Phantom Guardrails（自改进会修不存在的失败） |

<a id="article-69"></a>

### 69. LangChain — Harbor 评测栈：给 harness 建标尺，再给标尺建标尺

- **标题：** How We Benchmark Deep Agents（2026-07-23）+ IssueBench - How We Evaluate Engine（2026-07-20）
- **链接：** [how-we-benchmark-deep-agents](https://www.langchain.com/blog/how-we-benchmark-deep-agents) | [issuebench-how-we-evaluate-engine](https://www.langchain.com/blog/issuebench-how-we-evaluate-engine)
- **作者：** Nick Hollon & Harrison Chase / Nick Bray & Arjun Nargolwala（LangChain） | **日期：** 2026-07-20 ~ 2026-07-23
- **核心：** 两篇同周、同底座（都跑在 **Harbor** 上——支撑 Terminal Bench 的那个开源 eval runner）的姊妹文，合起来是一个完整论点：**前一篇讲怎么给 harness 建可信标尺，后一篇讲怎么给标尺本身建标尺。** 仓库此前有 #34/#35/#38 三篇论文论证 harness 效应可测且被基准折叠，但缺实践者侧的操作答案，这条补的正是它。
- **给 harness 建标尺（Deep Agents）：**
  - 从"unit 式小测"迁到端到端评测，因为智能体任务越跑越长。**一个 task = Environment（Dockerfile / Compose）+ Instruction（Markdown）+ Evaluation script（`test.sh`）**。与普通 LLM 评测的两点根本差异被写死在结构里：**环境重要到必须作为 task 的一部分被声明**；**判分必须用脚本，因为智能体会产出文件、改变状态，只看最终回复不够**
  - 三个基准对应三类工作：**Harbor-Index**（自主端到端，**82 个任务**，由 Harbor 从 **54 个基准的 6,000+ 候选**中蒸馏，覆盖软件工程 / 检索 / 数据分析 / 长时程工具使用）、**τ³-bench**（对话，30 任务子集，用户被模拟但判分查真实结果）、**ContextBench**（检索，30 个校准任务，每个任务把完整语料随沙箱一起发货）
  - 三条可直接抄的纪律：**每个任务跑多次**（非确定性带来的方差让单次跑不足以校准）；保留一个 **"lite" 冻结子集**，偏向"难但可解的前沿"，**约快 8 倍、便宜 6 倍**，迭代期只跑 lite、全量留给关键决策；基准之外并行维护一套 **capability suite**——快速确定性单测，各自瞄准某个具体 harness 行为（工具选择、记忆、文件操作），"是基准这个集成层之下的单测层"
  - 正在用它裁决 Deep Agents 0.7 的**减法**：是否移除 todo-list middleware、是否大幅精简系统提示词。这是"约束加减法纪律"第一次有了公开的决策流程
- **给标尺建标尺（IssueBench）：** 评估的对象是"**那个用来改进智能体的智能体**"（LangSmith Engine）。**15 个任务**，每个任务给一批 trace 加一组已有 issue，trace 在**合成环境**中生成以获得受控 ground truth，跑在 Harbor 上、对隐藏答案判分，覆盖 SRE 日志分析 / 软件工程 / 客户支持**三个领域**。
  - **15 类失败分类法**（仓库此前反复出现"观察失败 → 编码修复"的闭环，却一直没有一份失败词汇表）：PII 泄漏、幻觉、系统提示词漂移、用错工具、能力缺口、错误恢复失败、工具入参错误、智能体打转、上下文爆炸、护栏绕过、响应截断、静默工具错误、计划有缺陷、任务规避、能力自知缺失。类别集**被冻结**，即使 Engine 自己改分类，基准也保持一致
  - **判分在 issue 集层面而非 trace 层面**，并**显式扣分**于三种 triage 病态：一条失败开一张卡、把不相关失败并成一张模糊的卡、覆写既有 issue 上下文。理由写得很直白：十条失败开十张卡则 issue 集变噪声，并成一张则丢失可修复的细节，类别判错则路由给错误的负责人
  - 三条可迁移的设计原则：**合成数据（真实智能体 + mock 工具）在"轨迹真实"与"标签可信"之间取到最佳折中**；**"无问题"这一类和失败类同等重要**（若"干净" trace 里藏着问题，误报率就变噪声、模型间比较随之失效）；**同一失败类别跨领域复跑**，用以区分"学到了抽象失败模式"还是"记住了某个领域的表面特征"
  - 一个有意思的副产品：Engine 判错时未必是模型失败，常常暴露的是**类别边界不清、issue 描述欠定义、或判分规则不符合团队真实 triage 方式**——基准反过来澄清了产品行为定义
- **保留意见（收录时一并记下）：** 两篇都**不报告任何实际得分**；IssueBench 目前是**内部基准、未开源**，且服务于 LangSmith Engine 这一付费产品，存在自评自家的利益相关。处理方式同观察项 The Harness Effect：**取方法论，标注利益相关，结论不可独立验证。**
- **与其他文章的关联：**

| 本文概念 | 对应文章 |
|---------|---------|
| 做减法的裁决装置 | #4 harness 瘦身、#31 约束加减法、#66 Anthropic 删 80% 系统提示词（同期同向） |
| harness 效应从"可测"到"怎么测" | #34 Harness-Bench、#35 统计归因、#38 基准错位（三篇的实践者侧答案） |
| 失败词汇表 | #9 反馈飞轮、#24 AHE、#27 LangSmith Engine（本文是给 #27 建的考卷） |
| 评测集设计原则 | #47 未展开的两条（无问题类同等重要、跨领域复跑）、#61 审计轨迹 |
| 环境是 task 的一部分 | #59 基础设施噪声（同一命题的两侧：一个说必须声明，一个量化了不声明的代价） |

---

<a id="article-70"></a>

### 70. LangChain — ReviewBench：给"AI 代码评审"这个传感器造考卷

- **标题：** Evaluating code review agents with ReviewBench
- **链接：** [langchain.com](https://www.langchain.com/blog/evaluating-code-review-agents-with-reviewbench)
- **翻译：** [works/langchain-reviewbench-translation.md](../works/langchain-reviewbench-translation.md)
- **作者：** Nick Hollon（LangChain） | **日期：** 2026-07-31
- **核心：** #69 Harbor 评测栈的第三块拼图：评测对象从"通用智能体"（Harbor-Index）、"改进智能体的智能体"（IssueBench）推进到**推理性传感器本身**——AI 代码评审，#2 矩阵里最贵、最不确定的那一格。做法是从 LangSmith 单仓已合并 PR 的**真实评审意见**出发（LLM 闸门标弱候选 + 人工逐条复核，策展成 **59 任务 / 64 个基线问题**；Harbor 格式、本地 GitHub stub 冻结 PR 状态、隐藏验证器 LLM-as-judge），大量问题要求从周边代码**重建隐式系统契约**（租户约束、加锁模式、API 等价性），而非只扫改动行。计分 = 覆盖率与精确率等权的 F1，判"同一代码路径上的同一底层问题"。
- **两个结果：**
  - **裸 harness 下最强也只找回约 30% 的基线问题**（同一 Deep Agents harness、刻意不加评审专用提示词：Kimi K3 与 Opus 4.8 均 0.30，GLM-5.2 0.26，Luna 0.14，Terra 0.13）——"AI 评审作为垃圾回收"（#19）目前的真实召回上限
  - **只换一段结构化评审 prompt（不加工具、不换模型）**：Luna 在 20 任务切片上从 0.13 → **0.32**，反超同片静态评审的 Opus 4.8（0.23）与 Kimi K3（0.25）。prompt 内容是"先识别改了什么 → 追踪周边系统如何依赖 → 对照调用方/测试/相关实现验证发现"；作者自点破"**这是 harness 对比，不是模型对比**"——评审策略是 harness 的可调面
- **保留意见：** 与 #69 同源的利益相关（自家基准评自家 harness 上的模型）；任务出自私有单仓、文中未说明是否开源，外部可复现性待观察；表中成本列（调优 Luna $0.74/任务 vs Opus $1.27/任务）是"传感器性价比"的首批公开数字
- **与其他文章的关联：**

| 本文概念 | 对应文章 |
|---------|---------|
| AI 代码评审传感器的第一份专用标尺 | #2 推理性传感器那格、#19 "AI 评审作为垃圾回收"的定量补充 |
| prompt-only 的 harness 效应变体 | #34 配置级效应、#35 统计归因、#67 固定模型只变 harness |
| 评审策略可设计、可测量 | #56 Bun 的对抗评审者、#65 蜂群的去相关评审 |
| 真实评审意见 → 冻结任务的策展法 | #69 IssueBench 的合成环境路线（同栈两种 ground truth 取法） |

---

<a id="article-71"></a>

### 71. Fowler / Birgitta Böckeler — agent loop 里的 TDD：走形式还是真价值？

- **标题：** TDD inside the agent loop - theater or actual value?
- **链接：** [martinfowler.com](https://martinfowler.com/articles/exploring-gen-ai/tdd-in-the-agent-loop.html)
- **翻译：** [works/fowler-tdd-in-agent-loop-translation.md](../works/fowler-tdd-in-agent-loop-translation.md)
- **作者：** Birgitta Böckeler（Thoughtworks Distinguished Engineer） | **日期：** 2026-08-10
- **核心：** 「规定过程 vs 度量结果」的实证否定案例（自我定位为探索性 eval，自带全部数据并开源结果仓库）：5 批次 × 每批 2 个 TDD run + 2 个非 TDD run（另加 test-first 变体批），Opus 4.8 盲评（不知晓生成方式）+ Sonnet 4.6 独立判 TDD 遵循度剔除"假 TDD run" + mutation score 作为独立客观维度。结果：**质量无可辨差异、mutation score 无差异，非 TDD 反而多次略胜**——胜因是非 TDD run 总是先做完整前置设计（架构/数据类型/边界/契约），而 TDD 指令主动对抗前置设计，设计被第一个测试锁死。理论解释（引 Ivett Ördög）：训练数据是"需求→成品代码"的直接映射，几乎无逐步 TDD 过程样例。TDD 的七个目标逐一检视在 agent loop 内失效（red 无人查原因就无证明力；先写测试防不住自证套套逻辑；小步克制/管理恐惧是纯人类心理收益，不可迁移）。成本侧：TDD run token 3–8.5 倍（含 cacheRead 计数口径 caveat，承认可能高估真实美元成本）。结论：**别规定过程，度量结果**——mutation testing 当回归传感器、静态分析/模块化评审触发重构、Approved Scenarios（冻结-审批式场景）建信心；作者本人已停止让 agent test-first。
- **保留意见：** 作者自警四条如实带上——样本极小、质量定义几乎全权 Opus、无一 run 完美遵循 TDD、任务全是小型绿地；探索性结论勿拔高为定论
- **与其他文章的关联：**

| 本文概念 | 对应文章 |
|---------|---------|
| 过程规定（前馈 guides）不如结果度量（反馈 sensors） | #2 Guides×Sensors 矩阵、#19 maintainability sensors（本文三处引用）、#32 传感器对照实验 |
| agent 超前实现 / YAGNI 失效 | #25 Overeager Coding Agents |
| 行为 harness 缺口的候选答案 | #1 "行为 Harness 是最弱环节"——Approved Scenarios 是冻结-审批式信心机制 |
| "新模型让显式过程脚手架多余" | #66 上下文工程新规则、Boris Cherny 弃 plan mode（观察项） |

---

<a id="article-72"></a>

### 72. Addy Osmani — Practical Loop Engineering（循环的日常落地）

- **标题：** Practical Loop Engineering
- **链接：** [addyosmani.com](https://addyosmani.com/blog/practical-loop-engineering/)
- **翻译：** [works/osmani-practical-loop-engineering-translation.md](../works/osmani-practical-loop-engineering-translation.md)
- **作者：** Addy Osmani | **日期：** 2026-08-14
- **核心：** loop 系列「定调（#41）→官方四类（#43）→外环问责（#55）→工厂尺度（#64）」缺失的最后一环：**每天到底怎么跑**。注意约四成篇幅是引文汇编（四类循环大段引文与 verify-frontend-change skill 均来自 #43 的官方 X 文章版，勿误记为本文原创）；一手增量集中三块：① 竞品调研踩坑实录——"委托了任务，差点连判断也委托出去"，库内稀缺的外环问责第一人称失败案例；② 80K star 仓库日均 80–90 个 PR 的分诊循环 + **贡献指南条款直接变成可执行关闭条件**的用法；③ 官方文档外的 fine print 运维细则：goal 7 天过期（含作者自纠 3→7 天）、session 作用域与 `--resume` 行为、同命令三连即死循环信号、goal evaluator **只查 transcript 硬规则、不评内容好坏**的澄清。maker–checker（做的循环与查的循环分开）作为铁律贯穿。
- **与其他文章的关联：**

| 本文概念 | 对应文章 |
|---------|---------|
| loop 定义与五构件（回抄自我） | #41 Loop Engineering 定调文（双向引用） |
| 四类循环大段引文的出处 | #43 官方 Getting started with loops（本文以全译形式部分弥补 #43 无全译的缺口） |
| 委托任务不委托判断 / maker–checker | #55 Own the Outer Loop 的第一人称实证版、#36 对抗验证 |
| 哪些循环配得上熄灯的日常操作面 | #64 Software Factories, Light and Dark、#28 Ralph loop（手搓时代源头） |

---

<a id="article-73"></a>

### 73. Zalando / Bartosz Ocytko — 250+ 团队 agentic 工程组织级快照

- **标题：** Agentic Engineering at Zalando: A Snapshot
- **链接：** [engineering.zalando.com](https://engineering.zalando.com/posts/2026/08/agentic-engineering-at-zalando-a-snapshot.html)
- **翻译：** [works/zalando-agentic-engineering-translation.md](../works/zalando-agentic-engineering-translation.md)
- **作者：** Bartosz Ocytko（Zalando Executive Principal Engineer） | **日期：** 2026-08-14
- **核心：** 库内目前唯一"**非供应商大型企业第一人称、带内部数据**"的组织级采纳快照（250+ 工程团队 / 2.5 年跨度；文末自我定位 non-vendor engineering team），且主动暴露失败面。基建层：LiteLLM 代理 2024-01 上线（OpenAI/Bedrock/Vertex），6 个 2C4G pod 撑 2k MAU、每 2 万请求强制重启对抗内存泄漏；从不集中强制单一工具。数据层：PR 尺寸 [100,500) 桶持续增长、2025 Q2 Sonnet 4 后 [500,1k)/[1k,2k) 桶开始增长；四代码库 commit 级圈复杂度对照定位 agent 介入拐点；opencode 用户缓存命中率 <30%（预期 80%+）的排障案例；提交信息膨胀到 ~5k 字符（pre-commit 约束治理）。**反馈回路是全文最有价值的一条链：生产事故分析 → PR 风险分级规则（配置 typo=高、破坏兼容=中、纯文档=低）→ 33% 低风险 PR 自动放行 → lead time 降 20–40% → 反向塑造工程师主动拆小 PR**——概念 5「Throughput Changes Merge」目前最完整的组织级实证。培训体系（GenAI Labs 3 天 6 场覆盖 120–150 人）明确"用 coding agent 走捷径会抑制学习"。在建：agent 平台（kagent）+ Identity Broker（on-behalf-of 委托链）。
- **保留意见：** lead time -20~40% 的对照基线是"与全部 PR 相比"——低风险 PR 本来就快，存在选择偏差，非干预因果；圈复杂度对照 n=4、观察性研究；作者自标 anecdotal evidence 处已在译文保留
- **与其他文章的关联：**

| 本文概念 | 对应文章 |
|---------|---------|
| 风险分级自动放行 / 吞吐改变合并 | 概念 5、#63/#64 工厂之争的组织现实侧 |
| 事故数据反推护栏规则 | Faros 遥测报告（观察项：事故 +242.7%）——Zalando 给出对策路径一侧 |
| 圈复杂度拐点 / AI 放大好坏实践 | 概念 6 熵与垃圾回收、#19 传感器 |
| 大组织 vs 个体/供应商实践 | #14 Maganti、#26 Chris Parsons（个体侧）；#48/#60 Cursor、Anthropic 系列（供应商侧） |

---

<a id="article-74"></a>

### 74. Earendil / Pi 团队双篇 — What Is a Harness? + Compaction 白盒实现

- **标题：** What Is a Harness? / How Compaction Works in Pi
- **链接：** [earendil.com（定义文）](https://earendil.com/posts/what-is-a-harness/) / [earendil.com（机制文）](https://earendil.com/posts/compaction-in-pi/)
- **翻译：** [works/pi-what-is-a-harness-translation.md](../works/pi-what-is-a-harness-translation.md) / [works/pi-compaction-translation.md](../works/pi-compaction-translation.md)
- **作者：** Earendil Product / Earendil Engineering（Pi 团队，集体署名） | **日期：** 2026-08-20 / 2026-08-13
- **核心：** 开源中立 harness 阵营的「定义 + 实例」双篇（HN 576 分 / 211 分）。定义文以攀岩 harness 类比开场，四职能拆解（系统提示词 / 工具 / agentic loop / 模型翻译层）；工程内容是 #3 anatomy 的通俗子集，**真正差异化在立场**：harness 是用户可拥有、可改装的能动性工具，翻译层把杠杆从 AI 实验室转移给终端用户，点名 Claude Code 为"第一个流行但非中立的 harness"——「用户侧所有权/中立性」叙事此前库内空白。机制文是 compaction 的**透明白盒拆解**（附行级源码链接）：默认 20K token 保留预算（≈5–20 turns）；turn 结束后才检查自动触发（turn 内持续吃 cached prefix）；压缩走**独立 standalone 请求**（不带历史，可换便宜模型）；摘要**纯文本存储→跨模型可移植**（session portability 是明确设计目标）；compaction 必然打破 prompt cache 需全量重算。与 #39 Codex 的加密端点化 compaction（`/responses/compact` 返回 `encrypted_content`）恰成"**开放可移植 vs API 锁定**"对照。
- **保留意见：** 厂商立场文——Pi/Lefos 自家产品、"5,000+ 扩展"系自述数字；定义严谨度不及 What makes a harness a harness 论文（观察项，构成性定义+纳入/排除测试）；机制文无 evals、无摘要质量度量（LangChain 压缩观察项的 targeted evals 反而有）
- **与其他文章的关联：**

| 本文概念 | 对应文章 |
|---------|---------|
| harness 定义 / 组件拆解 | #1 原点、#3 anatomy（组件最全）、#21 ADLC 三分、Arize 划界与术语锚点论文（观察项） |
| compaction 实现对照 | #39 Codex 端点化（加密锁定）、LangChain Deep Agents 压缩三技术（观察项）、#66 上下文工程 |
| 开源中立 / 用户能动性主张 | #62 Ronacher（Pi 团队成员）工具 schema 论、DeepSeek Harness（观察项，实验室下场的反向信号） |
| 三 harness 架构收敛 | arXiv 2608.23953（观察项：deepagents/pi/dsh 源码级对比） |

---

<a id="article-75"></a>

### 75. ⭐ StarHarness 论文 — 冻结 harness 工件跨模型迁移的首个正面证据

- **标题：** StarHarness: Evolving Harnesses with Stratified Search for Enterprise Environments
- **链接：** [arxiv 2608.24804](https://arxiv.org/abs/2608.24804)
- **翻译：** [works/arxiv-starharness-translation.md](../works/arxiv-starharness-translation.md)
- **作者：** ServiceNow / Mila / Université de Montréal（7 位作者，通讯均 @servicenow.com） | **日期：** 2026-08-25
- **核心：** 冻结模型权重，用分层搜索演化环境专属 harness（提示/工具/技能/MCP/子代理/循环配置）。协议贡献：**三层任务隔离**（proposer 可见搜索集 / proposer 不可见选择集 / 留出集）+ 按失败模式分层抽样 + 确定性接受规则与 anti-gaming 护栏——是对 #68 系统性负面结果的**部分回应**（满足协议隔离侧，未做 #68 要求的同等预算 test-time scaling 基线）。结果：三个企业基准 **+35.0/+20.4/+26.1pp**（每环境仅 4–12 个被接受变更，共 21 个）；留出泛化 +31.7/+15.1/+29.3pp；**冻结工件跨 GPT-5.4/5.5/5.4-mini 与 Qwen3.5/3.6-27B 迁移 12 行全正（+10.7~+46.3pp），免重演化**——「跨模型可移植性」缺口此前只有反向证据（#35 收益不保序、Harness Updating ≠ Harness Benefit 的利用能力非单调），这是首个"同一冻结工件×异族模型全正"的正面数据点；成本同步降 −17%/−53%/−29%。弱模型受益更大（GPT-5.5 high 仅 +10.7pp）与 #57 逆缩放发现三方互证。
- **保留意见：** 五点如实带上——三基准中两个与作者利益相关（EnterpriseOps-Gym 是 ServiceNow 自家产品环境、AutomationBench 为自选 Finance-100 子集）；单次运行无方差/置信区间；proposer 与受测模型同为 GPT-5.4；无 Claude 受控对比（仅外部参考分）；基线可能偏弱
- **与其他文章的关联：**

| 本文概念 | 对应文章 |
|---------|---------|
| 测 harness 效应 vs 造 harness 效应 | #34 Harness-Bench（配置级效应）、#35 统计归因 |
| 逐模型演化 vs 冻结工件迁移 | #57 HarnessX（cross-harness GRPO 共演化；其"弱模型受益最大"行可回填本文数据点） |
| 对自动演化负面结果的协议级回应 | #68 Rethinking Harness Evolution（部分回应）、#53 行为定位瓶颈 |
| 成本数据缺口 | #65 蜂群账本、The Harness Effect（观察项）、StateM $15（观察项） |

---

## 脉络二：云原生时代的 Harness.io（交付与平台工程）

<a id="article-76"></a>

### 76. Harness.io 官方 — 全局架构

- **标题：** Understanding CI/CD Platforms: The backbone of modern DevOps
- **链接：** [harness.io](https://www.harness.io/blog/understanding-ci-cd-platforms-the-backbone-of-modern-devops)
- **作者：** Harness.io 官方博客 | **日期：** 2026-05-22
- **核心：** 标准 CI/CD 平台介绍。8 大组件：SCM → Build → Test → Code Quality → Security Scan → Artifact → Deploy → Monitor
- **Harness 差异化：** 统一管线、Test Intelligence 智能测试、最少脚本、Policy-as-Code 治理

<a id="article-77"></a>

### 77. Google Cloud Architecture — 前沿场景结合

- **标题：** Harness CI/CD pipeline for RAG applications
- **链接：** [docs.cloud.google.com](https://docs.cloud.google.com/architecture/partners/harness-cicd-pipeline-for-rag-app)
- **作者：** Martin Ansong (Harness) | **日期：** 2025-04-11
- **核心：** 参考架构，Harness 全家桶（CI/CD/STO/SCS/CCM/FME）+ Google Cloud Run 部署 RAG 应用
- **9 步工作流：** Trigger → Compile & Test → Package → Dev Deploy → Staging → Approval → Production Canary → Feature Validation → Cost Tracking
- **附带 Terraform 模板：** [harness-community/harness-rag-ci-cd](https://github.com/harness-community/harness-rag-ci-cd)

---

## 脉络三：效率悖论与能力进化

<a id="article-78"></a>

### 78. YDD / Miss-you — 效率悖论的系统性拆解

- **标题：** 为什么 AI 写代码更快但交付没变，以及我怎么把它扳回来的
- **链接：** [yousali.com](https://yousali.com/posts/20260303-ai-coding-efficiency-to-evolution/)
- **作者：** Miss-you | **日期：** 2026-03-03 | **字数：** 16667
- **核心：** 从约束理论、Spec/Rule/Skill 架构、验证闭环、并发策略四个维度拆解效率悖论

- **关键数据：**
  - METR RCT 实验：AI 辅助编码客观慢 19%，主观觉得快 20%（偏差 39 个百分点）
  - Faros 万人遥测：个体 PR +98%，但 DORA 四大指标无一改善
  - PR 体积 +154%，评审时间 +91% → 上游加速被下游瓶颈吃掉
  - 90% 开发者在用 AI，仅 3.1% 高度信任

- **七章结构：**

| 章 | 主题 | 核心论点 |
|---|------|---------|
| 一 | 效率悖论 | AI = NCX-10（约束理论），加速非瓶颈 = 下游堆积 |
| 二 | 框架焦虑 | OpenSpec/Superpowers/BMAD/Spec Kit 做同一件事，别纠结 |
| 三 | Spec ≠ Rule ≠ Skill | **区别在加载机制**：Rule 头部常驻、Skill 尾部按需、Spec 被 Skill 消费 |
| 四 | 安灯绳 | 验证闭环（Lint→Review→UnitTest→E2E）= 瑞士奶酪模型 |
| 五 | 并发 | 单任务慢不是问题，不能并发才是；先建闭环再开并发 |
| 六 | 洗衣机悖论 | 省出的时间洗更多衣服 vs 去读书；真正红利是能力进化 |
| 七 | 保底秘籍 | 甜点区分三档 + 自动化日常（commit、日报） |

- **与 Harness Engineering 的深度关联：**

| YDD 概念 | Harness Engineering 对应 |
|----------|------------------------|
| AI = NCX-10（约束理论） | 吞吐量改变合并理念（概念 5） |
| Spec/Rule/Skill 三层区分 | 地图而非手册 + 渐进式披露（概念 2） |
| Rule ≤ 300-500 行 | HumanLayer 的 AGENTS.md ≤ 60 行 |
| Skill 按需加载到尾部 | LangChain 的 Progressive Disclosure |
| 安灯绳 = 验证闭环 | 机械化执行 + 背压（概念 3） |
| 并发 + WIP 限制 | 吞吐量管理（概念 5） |
| 洗衣机悖论 | 人类掌舵的本质：省出时间做更高层的事 |
| 瑞士奶酪模型 | 多层防御 = linter + 结构测试 + 智能体审查 |

- **金句：**
  - "AI 就是今天的 NCX-10"
  - "Rule 是全局变量，Skill 是模块化 import"
  - "洗衣机洗衣服，你去读书"
  - "AI Coding 的本质不是让你更快，而是让你重新定义做什么的边界"

---

<a id="article-79"></a>

### 79. METR — 生产力实验的后续：结论松动与方法论危机

- **标题：** We are Changing our Developer Productivity Experiment Design（2026-02-24）+ Measuring the Self-Reported Impact of Early-2026 AI on Technical Worker Productivity（2026-05-11）
- **链接：** [metr.org 实验设计更新](https://metr.org/blog/2026-02-24-uplift-update/) | [metr.org 自报调查](https://metr.org/blog/2026-05-11-ai-usage-survey/) | [后续研究数据集](https://github.com/METR/Measuring-Late-2025-AI-on-OSS-Devs)
- **翻译：** [works/metr-uplift-update-translation.md](../works/metr-uplift-update-translation.md)（实验设计更新篇）
- **作者：** Joel Becker, Nate Rush, Tom Cunningham, David Rein, Khalid Mahamud (METR) | **日期：** 2026-02-24 / 2026-05-11
- **核心：** #78 YDD 的论证基石（METR RCT "AI 辅助反而慢 19%"）的官方后续。late-2025 复现实验（57 名开发者、143 仓库、800+ 任务）的原始结果转向加速——原班开发者估计 **-18% 加速**（CI -38%~+9%）、新开发者 -4%（CI -15%~+9%）——但 METR 自己判定这只是**很弱的证据**，并宣布改实验设计。真正的信息量在于：**AI 渗透已经破坏了任务级随机对照实验本身的可行性**。

- **选择效应的三重来源（实验设计为何失效）：**
  - 开发者拒绝参与——越来越多人不愿在无 AI 条件下工作（时薪 $50 也不愿），最乐观的采纳者系统性缺席
  - 任务被挑选——30–50% 的开发者承认不提交某些任务，因为"不想在没 AI 的条件下做它们"，高预期增益任务系统性缺失
  - 计时不可靠——并发跑多个智能体的开发者"等 agent 干活时在做别的任务"，时间花费无法测量
- **开发者原话：** "AI 能 2 小时搞定、我要 20 小时的 issue，我根本不敢提交——万一被随机到禁 AI 组太痛苦了"；"像习惯了打车之后再让我步行穿城，头都要炸了"
- **2026-05 自报调查：** 349 名技术工作者（87 名软件工程师）自报工作价值变化中位数 **1.4–2x**，且预期继续增长；METR 同时援引 Becker et al. (2025)——开发者自报增益平均高估 40+ 个百分点，提醒对量级保持怀疑
- **对本仓库的意义：** 脉络三的证据基座更新——YDD 引用的"慢 19%"是 early-2025 快照，不能再当活事实引用；同时"实验测不动了"本身就是能力进化的间接证据

- **与其他文章的关联：**

| 本文概念 | 对应文章 |
|---------|---------|
| 19% 减速数据的后续 | #78 YDD 第一章效率悖论（引用了原实验） |
| 感知与现实的偏差 | #78 的 39 个百分点偏差、自报高估 40+ 个百分点 |
| 并发智能体使计时失效 | #78 第五章并发策略（并发正是 YDD 开出的药方） |
| 测量方法的时代错位 | #38 Position 论文（基准侧的同构诊断：测量工具追不上被测对象） |

---

## 两条脉络的关系

```
Harness Engineering（AI 护栏）     Harness.io（交付管线）
        │                                │
        │  约束 AI 智能体的行为              │  约束代码交付的过程
        │  AGENTS.md + linter + 背压       │  Pipeline + Policy-as-Code + 门控
        │  目标：可靠的代码生成              │  目标：可靠的代码部署
        │                                │
        └──────────┬─────────────────────┘
                   │
            共同本质：用确定性约束
            驾驭不确定性系统
```

不是同一个东西，但共享同一个工程哲学：与其规定怎么做（prescription），不如设置门控拒绝坏结果（backpressure）。

---

## 中文转译 / 二手资料（不计入文章数）

> 这里收录的是**他人已发布的中文译介或二手综述**——本仓库做了归档但**不视为一手文献**。
> 本段不参与 `### N. ...` 的全局编号，不计入 79 篇文章总数；与上方编号正文严格区分，避免污染脉络计数。
> 收录标准：内容与 Harness Engineering 直接相关、来源可追溯到具名作者 / 译者、且对本仓库已有一手文献有补充或对照价值。

### Akshay Pachaar — The Anatomy of an Agent Harness（中译版）

- **类型：** X Article 综述科普 + 第三方中译，非一手文献
- **英文原文：** [x.com/i/article/2040732084843782144](https://x.com/i/article/2040732084843782144)
- **中译来源：** [@dotey 转推](https://x.com/dotey/status/2053601852261110201) | **中译落盘：** [works/dotey-pachaar-anatomy-zh-cn-repost.md](../works/dotey-pachaar-anatomy-zh-cn-repost.md)
- **原作者：** Akshay Pachaar（@akshay_pachaar） | **译者：** 宝玉（@dotey） | **日期：** 2026-04-06
- **内容定位：** 把 Anthropic、OpenAI、Perplexity、LangChain 的工程实践揉成「12 组件 + 7 决策」的入门速记卡。综述科普性质，无新一手数据。
- **12 组件清单：** 编排循环 / 工具 / 记忆 / 上下文管理 / 提示词构建 / 输出解析 / 状态管理 / 错误处理 / 护栏与安全 / 验证循环 / 子智能体编排，加一段把它们串起来的"循环走一遍"流程。
- **7 决策卡：** 单 vs 多智能体 / ReAct vs 先规划后执行 / 上下文管理策略 / 验证循环设计 / 权限与安全架构 / 工具范围 / Harness 厚度。
- **与本仓库一手文献的对照关系：**

| 本文主张 | 本仓库已收的一手出处 |
|---------|------|
| Agent = Model + Harness 公式（"如果你不是模型，你就是 Harness"） | #3 LangChain / Vivek Trivedy（同名英文原文，本文大量引用） |
| 12 组件中的「上下文管理」「记忆」「错误处理」 | #4 Anthropic / Prithvi（Context Anxiety）、#3 Context Rot、#10 LangChain Eval |
| 「六大类工具」「Pokemon 记忆案例」 | #6 Anthropic / Lance Martin |
| 「Boris Cherny: 让模型验证自己的工作 → 质量提升 2-3×」 | 本文新数据点，未在 #6 文章里直接出现 |
| 「TerminalBench：仅改 Harness，排名变动 20+ 位」 | #3 LangChain Trivedy 的 TerminalBench 2.0 数据点 |
| 「房子盖好后脚手架要拆」（协同进化） | #4 Anthropic Harness 瘦身原则、Fowler 的 harness 假设 |

- **为什么不进编号正文：** 本文是综述科普，不是一手文献。编号正文中的文章分别对应 OpenAI / Fowler / Anthropic / LangChain 等团队的一手工程博客、论文、外部逆向分析或中文社区原创分析；将综述纳入会污染「一手/准一手」的语义边界与一致性脚本（C1/C2/C6）的语义。归到本段保留对照价值即可。
- **对照案例：** #31 Osmani 综述经人工评审后**破例**进了编号正文（有原创表述 + 学科定调价值）；本文维持不计数——两者共同构成"综述收录边界"的判例。

### Jinyan Su — 智能体的演变：从 Context Engineering 到 Long-running Harness（中英双语）

- **类型：** 个人博客的双语综合梳理（作者原创写作，非翻译转载；对本仓库属二手综述）
- **链接：** [jinyansu1.github.io](https://jinyansu1.github.io/blog/2026/07/agent-context-engineering-long-running-harness/) | **日期：** 2026-07
- **内容定位：** 以 Anthropic 官方文献为骨架的时间线叙事：Demystifying evals（#47）的 task 级/harness 级两层评测 → 长时运行 harness 的 initializer+coding agent → planner/generator/evaluator（#4）→ Managed Agents（#7）的"harness 与模型能力共演化"。把"harness 组件即假设、随模型进化增删"这条线讲得很顺，可作 #4/#7/#47 的中文入口。
- **为什么不进编号正文：** 二手综述，论点均已被一手文献覆盖；双语写作对中文读者有检索价值，故记录于此。

### Tony Bai — 全新 AI 技术栈：模型、Harness、Loop 与自我进化的智能体

- **类型：** 对 Rahul（@sairahul1）"The New AI Stack: Models, Harnesses, Loops, and Self-Improving Agents"一文的中文转述 + 点评，非一手文献
- **链接：** [tonybai.com](https://tonybai.com/2026/07/10/the-new-ai-stack-model-harness-loop-agent/) | **日期：** 2026-07-10
- **内容定位：** 把"模型 → Harness → Loop → 自优化智能体"叠成一个四层技术栈叙事，覆盖 Self-Harness、进化式 harness 搜索、Darwin Gödel Machine，并附"四周落地路线"（先建循环 → 接持久记忆 → 引入子智能体 → 沉淀避坑剧本）。可作为 #41（Loop Engineering）、#44（Self-Harness）、#45（Weng 综述）的中文入口。
- **为什么不进编号正文：** 二手转述，论点均已被 #41/#44/#45 的一手文献覆盖；中文社区对 loop 浪潮的响应速度本身是一个传播信号。

### InfoQ 中文 — Böckeler QCon 纽约演讲整理（Coding Agent 技术全景图）

- **类型：** 演讲的第三方中文整理，非一手文献
- **链接：** [infoq.cn](https://www.infoq.cn/article/UFLm5D5VDPmu9Ykc9CdJ)
- **原讲者：** Birgitta Böckeler（Thoughtworks 全球 AI 辅助软件交付负责人） | **整理：** InfoQ 中文站 | **日期：** 2026-06（QCon 纽约站演讲）
- **内容定位：** 过去一年 coding agent 范式转移的演讲版总览：Skills/Subagents 的上下文调控 → 云端低监督自主开发 → 用确定性 Harness 约束非确定性产出。可作为 #2 / #19 / #32 的中文入口与口语化对照。
- **增量信息：** "未来可能不再从服务模板起步，而是从 Harness 模板起步——届时甚至不在乎是 React 还是 Vue，决策维度变成'有没有现成的 Harness'"——harness 模板假说的最新表述。
- **为什么不进编号正文：** 二手整理稿，论点均已被 #2（框架）、#19（传感器谱系）、#32（传感器实验）的一手文献覆盖。

---

## 已跟踪产品 / 项目（不计入文章数）

> 这里收录的是**开源产品 / 框架 / 工具**，不是文章。本段不参与"### N. ..." 的全局编号，不计入 79 篇的文章总数。
> 触发"产品级实现案例"的判定通常是：有可运行代码、有版本号、被本仓库 thinking/ 或 works/ 单独分析。

### ⭐ Chachamaru127 — claude-code-harness v4.2 "Hokage"（产品级实现案例）

- **类型：** 开源产品（非文章），MIT License
- **链接：** [github.com/Chachamaru127/claude-code-harness](https://github.com/Chachamaru127/claude-code-harness) | **被引版本 tag：** [`v4.2.0`](https://github.com/Chachamaru127/claude-code-harness/tree/v4.2.0)（上游已迭代到 v4.3.x，本仓库分析以 v4.2.0 为准）
- **作者：** Chachamaru127（日本开发者） | **被分析版本：** v4.2 "Hokage"（2026-04，对齐 CC 2.1.99-110 + Opus 4.7）
- **核心：** Claude Code 上当下最完整的开源 harness 实现之一。Plan → Work → Review → Release 五动词工作流 + Go 原生 guardrail 引擎（13 条规则 R01–R13，<10ms 响应）+ self-referential 演化（用 harness 改进 harness）
- **本仓库分析：** [thinking/guides-sensors-meets-claude-code-harness.md](../thinking/guides-sensors-meets-claude-code-harness.md)
- **关键架构：**
  - **Go 原生引擎**：v3 (bash + Node.js, 40-60ms hooks) → v4 (Go 单二进制, 10ms)，25× 加速、零 Node.js 依赖
  - **R01–R13 guardrail**：声明式规则，actions 涵盖 deny/ask/warn 三档（如 R01 禁 sudo、R06 禁 force push、R12 警告 push to main）
  - **5 verb skills**：把 42 个 skill 收敛为 5 个动词命令，降低认知负担
  - **Advisor Strategy**：long-running 任务的"按需推理"模式——执行者持续推进，仅在高风险/重复失败/plateau 时唤起 advisor
  - **PreCompact hook**：长任务运行中阻止 Claude Code 自动压缩 context，防止任务被切断
  - **harness doctor --residue**：检测代码删除后留下的 stale 引用，对应 OpenAI 原文的"垃圾回收智能体"概念
- **对照价值：**
  - 可作为 Böckeler Guides×Sensors 框架的产品级压力测试样本——四个象限**初看都有候选实现**，但 R01–R13 guardrail 与 Advisor Strategy 的归类立刻拉伸了分类边界（详见 thinking/ 分析）
  - 揭示了框架装不下的现象：条件激活的推理性控制（Advisor）、guardrail 引擎里前馈/反馈的融合、harness 自身的接口维护成本（v4.2 七项主要变更里 6 项是追上游、1 项是修自伤、0 项是主动新能力）
  - self-referential 演化是 cross-article-insights 洞见 1 "Harness Gardening" 的活样本——README 直白记录"sync 命令悄悄删除配置块"的 4 次事故
  - 强制日文响应（CLAUDE.md 第 38 行）暴露了 harness 必带价值观锁定，对应洞见 7 的单一栽培风险
- **关联：** OpenAI 原文（六大概念的全量产品化）、Fowler/Böckeler（2×2 矩阵的实证检验）、Anthropic 文章 #7（meta-harness 思想的 Claude Code 侧落地）

---

## 观察项 / 候选材料（不计入文章数）

> 2026-05 起各轮调研中已甄别、但**暂不值得做成正式文章**的材料。本段不参与 `### N.` 编号，不计入 79 篇文章总数。
> 中文译文留在本地 `translate/`（gitignored）作阅读辅助；下表只记上游链接与定性，方便下次快速复看。
> **去向标记：** 🔵 待实测后入 `tools/`（遵守 tools/「只收用过的工具」标准，未实测前不正式收录） ｜ ⚪ 长期观察 ｜ ⏭️ 暂存不收。
>
> **升格阈值（2026-07-27 补写，解决"论文为什么有的进编号、有的只进这张表"的口径问题）：**
> 早期本表只收产品页 / README / 短 bliki / 发布稿 / 工程随笔，但随着 arXiv 上 harness 论文的产出速度上来，**论文同样会落到这张表**——否则每月十几篇会把编号正文淹掉。判据不是体裁而是**它是否改变你读既有条目的方式**：
>
> - **进编号正文**：提出新的实验设计范式（如 #67 首次固定模型只变 harness），或对库内已有主线给出系统性反证（如 #68 对自演化那条线）。
> - **只进本表**：为已确立的结论再加一个数据点或做独立复现（Claw-SWE-Bench 复现 #35、Better Harnesses 复现 #57 的弱模型受益）、换一个测量轴但结论同向（StaminaBench）、地图式综述（Code as Agent Harness、Agent System and Harness Design）、或工具/工件本身尚未被实测。
>
> 这条阈值是可争的；争的时候请改这段文字，而不是在个案上临时松紧。

| 候选 | 类型 | 去向 | 角度 / 为何只做观察项 | 原文 |
|---|---|---|---|---|
| Caliper | 工具 | 🔵 | 把 CLAUDE.md 自然语言约定编译成确定性检查；三层 enforcement，论点反哺概念 3/6（机械化执行 / 熵管理）。实测后可升级 `tools/` 或 `works/` | [getcaliper.dev](https://getcaliper.dev/) |
| Context Mode | 工具 | 🔵 | "用代码思考"（让 LLM 写脚本统计而非读满上下文）+ FTS5/BM25 取回；90% 篇幅是安装矩阵 | [github](https://github.com/mksglu/context-mode) |
| OpenSPDD | 工具 | 🔵 | SPDD 的 CLI 落地（REASONS Canvas + spdd-sync）；README 体裁，配合 #20 SPDD 看 | [github](https://github.com/gszhangwei/open-spdd) |
| CocoIndex | 工具/基建 | ⚪ | 增量索引引擎（Rust + 声明式 Python）；与 agent 关系较远，偏通用 context 基建 | [github](https://github.com/cocoindex-io/cocoindex) |
| grith | 工具 | ⚪ | syscall 级安全 Harness（<15ms 拦截/评分/决策）；落地页太薄，待其博客深度长文 | [grith.ai](https://grith.ai/) |
| Running Codex safely | 文章 | ⚪ | OpenAI 官方·安全治理控制面；官宣口吻、无实测数据 | [openai](https://openai.com/zh-Hans-CN/index/running-codex-safely/) |
| Codex on Windows 沙箱 | 文章 | ⚪ | 沙箱边界 Windows 平台实现；高度平台特定，与已收录 Anthropic 沙箱重复 | [openai](https://openai.com/index/building-codex-windows-sandbox/) |
| LangSmith Sandboxes GA | 产品 | ⚪ | microVM 隔离论证（Shai-Hulud / n8n CVE 那节有料），其余是 GA 公告 | [langchain](https://www.langchain.com/blog/langsmith-sandboxes-generally-available) |
| OpenAI WebSockets | 文章 | ⚪ | 运行时性能·传输层（把整次 agent 执行建模为单条长响应）；可迁移性中等 | [openai](https://openai.com/zh-Hans-CN/index/speeding-up-agentic-workflows-with-websockets/) |
| Managed Deep Agents | 产品 | ⚪ | 托管 runtime 产业动态；private beta 发布稿，干货在 #22 / #27 | [langchain](https://www.langchain.com/blog/introducing-managed-deep-agents) |
| Genie Tarpit | 随笔 | ⚪ | Kent Beck 的 Features×Futures 坐标（AI 落"凑合区"）；依赖 5 张配图、含赞助段 | [tidyfirst](https://tidyfirst.substack.com/p/genie-tarpit) |
| Vibe Coding | bliki | ⚪ | Fowler 给 vibe coding 的权威定义锚点；可做术语引用 | [martinfowler](https://martinfowler.com/bliki/VibeCoding.html) |
| Interrogatory LLM | bliki | ⚪ | 让 LLM 反向访谈人类生成上下文的 pattern；可做 `prompts/` 引用 | [martinfowler](https://martinfowler.com/bliki/InterrogatoryLLM.html) |
| Google Antigravity | 发布稿 | ⏭️ | I/O 2026 开发者亮点；产品罗列，与已收录 Managed Agents 重复 | [blog.google](https://blog.google/innovation-and-ai/technology/developers-tools/google-io-2026-developer-highlights/) |
| Claude Managed Agents 演进 | 产品文 | ⚪ | #7 的产品化续篇（Agent SDK → Managed Agents 的演进叙事 + `/claude-api` skill 入口）；发布稿口吻，2026-06-10 | [claude.com](https://claude.com/blog/building-with-claude-managed-agents) |
| LangChain Deep Agents 上下文管理 | 工程文 | ⚪ | 压缩三技术（大结果落盘 / 阈值触发摘要 / 子智能体隔离）+ **targeted evals**（针对单个压缩机制的小型回归测试，可迁移的做法）；与 #22 互补 | [langchain](https://www.langchain.com/blog/context-management-for-deepagents) |
| LangChain 生产级 Deep Agents 的 Runtime | 工程文 | ⚪ | harness（prompts/tools/skills）与 runtime（durable execution/memory/multi-tenancy/HITL/观测）的分界陈述；与 #7、#21 重叠度高 | [langchain](https://www.langchain.com/blog/runtime-behind-production-deep-agents) |
| Arize：harness 为何取代 framework | 分析 | ⚪ | framework（人组装的抽象+绳子）vs harness（开箱即跑，人只给目标）的划界 + 一套 harness 运营指标（成功率/重试/工具效率/恢复/工具幻觉/单条成功轨迹成本）；2026-06-18 | [arize.com](https://arize.com/blog/what-is-an-agent-harness-why-harnesses-are-replacing-agent-frameworks/) |
| Code as Agent Harness 综述 | 论文 | ⚪ | "代码即 harness 基底"的三层大地图（接口/机制/多智能体扩展），横跨编码/GUI/具身/科研场景；综述体裁，检索地图价值大于论点价值 | [arxiv 2605.18747](https://arxiv.org/abs/2605.18747) |
| NLAH：自然语言 Agent Harness | 论文 | ⚪ | 把 harness 控制逻辑外化为可执行自然语言工件 + 共享运行时（IHR），主张 "harness 表示科学"；与 #16 SPEC.md 模式互证，待更多后续工作 | [arxiv 2603.25723](https://arxiv.org/abs/2603.25723) |
| Microsoft Agent Framework `HarnessAgent` | 产品/文档 | ⚪ | 微软入场：batteries-included harness 作为一等 API（`AsHarnessAgent`）；微软视角此前仓库空白，暂只有文档无深度工程文 | [learn.microsoft.com](https://learn.microsoft.com/en-us/agent-framework/agents/harness) |
| OpenAI Core dump 流行病学 | 工程复盘 | ⚪ | "群体级诊断 > 逐例分析"修复 18 年 libunwind 老 bug，ChatGPT 参与写分析管线；可观测性方法论好文但与 harness 关系间接，2026-06-30 | [openai](https://openai.com/index/core-dump-epidemiology-data-infrastructure-bug/) |
| thedeepfeed：学科史梳理 | 编年 | ⚪ | "七个声音九个月汇流成一个学科"的传播史（含 Osmani 文收藏/点赞比 2:1 等传播数据）；二手史料，配 #31 看 | [thedeepfeed.ai](https://www.thedeepfeed.ai/posts/2026-05-09-agent-harness-engineering-the-discipline/) |
| Boris Cherny 工作流 | 实践 | ⚪ | Claude Code 作者本人"出奇原味"的用法（~100 行 CLAUDE.md、早期以 plan mode 纪律著称；站内 Part 15 已记录其 4.6+ 后放弃 plan mode 起手、改 auto mode 直跑——"新模型不再需要显式规划步骤"）；源头是其 X 帖，链接为社区维护的档案站（非 Anthropic 官方） | [howborisusesclaudecode.com](https://howborisusesclaudecode.com) |
| Steering Claude Code 官方指南 | 产品文档 | ⚪ | 七种转向机制（CLAUDE.md/rules/skills/subagents/hooks/output styles/system prompt append）按"加载时机 × compaction 行为 × token 成本"三轴对照——#78 YDD"区别在加载机制"论的官方版说明书；参考手册体裁，2026-06-18 | [claude.com](https://claude.com/blog/steering-claude-code-skills-hooks-rules-subagents-and-more) |
| The Harness Effect 论文 | 论文/厂商评测 | ⚪ | "成本数据"缺口的首个系统数据：同 22 任务 × 6 模型只换编排层，成本 -41%、时延 -44%、token -38%；提出 token maxing 与 harness leverage（质量增益与基线能力 r=0.99）。注意 Writer Inc. 自评自家 harness，利益相关，方法论（frozen baseline + locked tasks）可取 | [arxiv 2607.06906](https://arxiv.org/abs/2607.06906) |
| Harness Updating ≠ Harness Benefit 论文 | 论文 | ⚪ | 拆开两条能力轴：写 harness 编辑的能力各模型持平（9B 能写出与 Opus 同构的 skill），利用 harness 的能力非单调（中档模型受益最多）——跨模型可移植性缺口的机制侧证据；被 #45 Weng 综述引用 | [arxiv 2605.30621](https://arxiv.org/abs/2605.30621) |
| ToFu 白盒研究 harness | 工具 | 🔵 | MIT 协议、面向研究者的白盒 harness：三层上下文压缩 + 多语言 + MCP 集成，可作为 research object 检查/修改编排逻辑；待实测后再定去向 | [arxiv 2607.11423](https://arxiv.org/abs/2607.11423) |
| OpenAI：How agents are transforming work | 报告 | ⚪ | 内部采纳数据：Codex 从占员工 <10% token 到成为全部门（含法务/招聘）主力；99 分位用户日均 60+ 小时 agent turns、多智能体并行——脉络三的组织影响新数据点，2026-06-25 | [openai](https://openai.com/index/how-agents-are-transforming-work/) |
| Fowler Fragments 2026-07-06 / 07-13 / 07-21 | 短评 | ⚪ | retreat 纪要三则：AGENTS.md <200 行、用 Rust 替代 Python 强化计算性传感器、property-based testing、"DX 与 AX 的维恩图是个圆"（Laura Tacho）、"harness 会否被模型进步淘汰"的现场辩论——#2 的口语化增量。07-13 篇另含 Kief Morris 的统一叙事（所有争论都是"交给智能体的工作单元怎么设定"：多大、覆盖多少、如何交接、如何验收、围什么栏）与 Sam Ruby "Bring me a Rock"（LLM 时代按目标管理而非按方法管理成为可辩护的工作方式）。07-21 篇收官第二届 FOSE 研讨会并给出 Thoughtworks Europe 官方报告五条结论：代码生成不再是瓶颈、验证才是；harness engineering 正成为一门可独立拥有的学科；学徒制危机；高管/工程师预期落差比技术限制更危险；遗留系统现代化是最稳的近期价值池 | [07-06](https://martinfowler.com/fragments/2026-07-06.html) / [07-13](https://martinfowler.com/fragments/2026-07-13.html) / [07-21](https://martinfowler.com/fragments/2026-07-21.html)（[TW 报告 PDF](https://www.thoughtworks.com/content/dam/thoughtworks/documents/report/tw_future_of_software_engineering_europe_2026.pdf)） |
| Geoffrey Litt：Understand to participate | 演讲 | ⚪ | AIE 2026 演讲（经 Simon Willison 笔记）：cognitive debt——理解要深到"能继续参与创作"，否则参与能力实质受限；与 #42 Ronacher 的 comprehension 关切合流；2026-07-10 演讲视频已上线 YouTube（链接见 Willison 笔记的 update，另有作者的 X 线程版） | [simonwillison.net](https://simonwillison.net/2026/Jul/2/understand-to-participate/) |
| Simon Willison：Agentic Engineering Patterns | patterns 库 | ⚪ | 2026-02 起持续更新的模式集（红绿 TDD、hoard working examples、线性走查等）；附 Fable's judgement 笔记（2026-07-03：让模型自主选低阶模型跑子任务）——个体实践侧长期跟踪 | [guides](https://simonwillison.net/guides/agentic-engineering-patterns/) |
| Thoughtworks Technology Radar Vol.34 | 行业雷达 | ⚪ | Ralph loop 列为 Assess、Team of coding agents 列为 Assess、Coding agent swarms 列为 Caution（2026-04-15）——#28 Ralph 的行业采纳信号；雷达条目体裁，一行即可 | [thoughtworks](https://www.thoughtworks.com/radar/techniques/ralph-loop) |
| OpenAI：ChatGPT Work + Codex 应用合并 | 产品动态 | ⚪ | 2026-07-09：Codex 独立应用并入 ChatGPT 桌面端（Chat/Work/Codex 三模式、全计划可用），GPT-5.6 同日 GA，Atlas 浏览器开始退役——"编码智能体 runtime 正在变成通用智能体 runtime"，#40 HaaS 线索的产品化里程碑；发布稿体裁 | [digitalapplied 汇总](https://www.digitalapplied.com/blog/chatgpt-work-openai-agent-launch-2026) |
| LangChain：Prompt Caching with Deep Agents | 工程文 | ⚪ | 跨厂商缓存中间件：harness 自动按 provider 委派缓存策略、结构化提示词与显式缓存点收窄失效爆炸半径（记忆更新仍能命中前缀子集）；真实轨迹实测省 49–80% token——#39 Codex 缓存工程的框架侧对应，2026-06-26 | [langchain](https://www.langchain.com/blog/deep-agents-prompt-caching) |
| Osmani：Don't Outsource the Learning | 随笔 | ⚪ | 脉络三新数据点：Anthropic 技能形成 RCT——AI 组完成同速但理解测验 50% vs 67%，组内"问概念的 >65%、粘代码的 <40%（姿势决定结果）"；另引 MIT "Your Brain on ChatGPT"、CHI 2026 的 LLM 先行锚定效应，2026-07-06 | [addyosmani.com](https://addyosmani.com/blog/dont-outsource-learning/) |
| Fowler 站：The Archaeologist's Copilot | 实践文 | ⚪ | Java 1.5 遗留系统现代化：早期 LLM 给出"在代码库里站不住的貌似合理答案"，转机是把过程锚定在证据上——AI 辅助分析 + 稳定 Docker 环境验证 + 测试保护下渐进重构；"AI 被证据、清晰角色与分步策略约束时最有用"，2026-07-16 | [martinfowler](https://martinfowler.com/articles/archaeologist-copilot.html) |
| Simon Willison：llm-coding-agent 0.1a0 | 实验 | ⚪ | 给 Fable 一份 spec.md 就造出 Claude Code 风格最小 harness（读/写/搜文件 + 执行命令 + `--allow` 权限模式 + Python API）——"最小 harness 有多小"的又一实证，配 #17 的 300 行工作坊说法看，2026-07-02 | [simonwillison.net](https://simonwillison.net/2026/jul/2/llm-coding-agent/) |
| donggeking/harness_engineering_guide | 中文教材/仓库 | 🔵 | 中文社区的体系化 Harness 教程书（GitBook + 从零实现的 MiniHarness：运行时→工具层→记忆→输出治理→编排→MCP→生产化加固→安全层），剖析 Codex/Claude Code/OpenClaw 真实实现；基于 2026-04 技术现状；待实测其 MiniHarness 后再定去向 | [github](https://github.com/donggeking/harness_engineering_guide) |
| Osmani：Long-running Agents | 综述/定调 | ⚪ | 长时智能体三义拆分（长时推理 / 长时执行 / 持久代理）+ 三堵墙（有限上下文 / 无持久状态 / 无独立自验）；论据已被 #4/#7/#28/#48 覆盖，价值在地图与词汇；#41 曾反向引用本文，2026-07 | [addyosmani.com](https://addyosmani.com/blog/long-running-agents/) |
| Iusztin：What's Harness Engineering | 科普 | ⚪ | "模型商品化 → harness 是你该拥有的那层" + build/buy/customize 三分与开源中间地带（Pydantic AI Harness / Pi / Deep Agents）；面向非工程读者的定调文，论点已被 #1/#3/#31 覆盖，2026-07-21 | [read.technically.dev](https://read.technically.dev/p/whats-harness-engineering) |
| Sparsh Agarwal：Control Surface | 工程随笔 | ⚪ | Scaffolding（首条消息前装配）vs Harness（会话中运行）二分 + "allowed claim / proof" 治理词汇 + 开工前六问清单；术语有用、无一手数据，2026-07-09 | [medium](https://medium.com/recohut-ai-labs/harness-engineering-the-control-surface-around-coding-agents-a907bc310eee) |
| OpenAI Agents SDK 演进 | 产品文 | ⚪ | 官方 SDK 侧的"harness 与 compute 分离"定式：凭据不进模型代码执行环境 + snapshot/rehydration 断点续跑 + Manifest 工作区契约；与 #7 brain/hands、#40 HaaS、#50 遏制互证；发布稿体裁，2026-04-15（存量回扫补录），配套 [Claude→OpenAI SDK 迁移指南](https://developers.openai.com/cookbook/examples/agents_sdk/migrate-from-claude-agent-sdk/readme) 的两套架构对照表最清晰 | [openai](https://openai.com/index/the-next-evolution-of-the-agents-sdk/) |
| What makes a harness a harness 论文 | 论文/概念分析 | ⚪ | 目前最认真的**术语锚点**：给 agent harness 下构成性定义（充分必要条件）并操作化成纳入/排除测试，划清它与 agent framework / SDK / IDE 插件 / eval harness / orchestrator 的边界，在 6 个真实 harness（Claude Code、Codex CLI、Aider、Cline、OpenHands、SWE-agent）加人造边界案例上一致通过；还梳了词源谱系（马具 → test harness → ML eval harness → agent harness）。单作者概念分析、无实验，故只作观察项；写中文词条时可引 | [arxiv 2606.10106](https://arxiv.org/abs/2606.10106) |
| Claw-SWE-Bench 论文 | 论文/基准 | ⚪ | #35"harness 效应 ≈ 模型效应"的独立复现：固定模型时 **harness 选择造成 27.4pp 差异、模型选择 29.4pp**。更刺眼的是 adapter 决定论——同为 GLM 5.1 后端，minimal direct-diff adapter 只有 **19.1% Pass@1**，完整 adapter 达 **73.4%**。350 实例 / 8 语言 / 43 仓库 + 80 实例 Lite 子集 | [arxiv 2606.12344](https://arxiv.org/abs/2606.12344) |
| Better Harnesses, Smaller Models 论文 | 论文 | ⚪ | "成本数据"缺口的学术侧样本，与 #65 的价格实证同向：7 个业务型 agentic 任务 × 3 个 SLM 家族，meta agent 从失败轨迹自动发现 harness 适配，**21 个 task-SLM 组合中 16 个显著提升、7 个抹平 SLM-LLM 差距，最佳者以 4% 成本恢复 89.7% 的 LLM 性能**；适配对重复性工作流与基础能力够格的 SLM 收益最大 | [arxiv 2607.08938](https://arxiv.org/abs/2607.08938) |
| StaminaBench 论文 | 论文/基准 | ⚪ | 换一个测量轴：不问"解出几成任务"，问**连续撑几轮**。实现 REST API 服务器后连做 100 次程序化生成的变更请求（代码可达 6,000 行），测试全程序生成、黑盒 HTTP 交互。6 个 harness × 7 个开源模型 × 20 场景：**所有模型 5–6 轮内失败**；回灌测试反馈并允许重试把通过轮数提升最多 **12 倍**；强模型在最好与最差 harness 间差 **6 倍**，弱模型换哪个 harness 都不行 | [arxiv 2606.19613](https://arxiv.org/abs/2606.19613) |
| Failure as a Process 论文 | 论文/实证 | ⚪ | 把失败当过程而非终局：7 个前沿模型 × 3 个脚手架（OpenHands / MiniSWE / Terminus2）在 Terminal-Bench 上的 **3,843 条轨迹**，筛出 1,794 条完整轨迹人工标注 **6.3 万+ 执行步**，得 14 条发现——失败主要由**认知性错误**驱动、**通常在最初几步就已发生**、且**往往隐藏到无法挽回时才显形**。结论直指 #47：只评最终结果的评测天然看不见这些 | [arxiv 2607.09510](https://arxiv.org/abs/2607.09510) |
| Phantom Guardrails 论文 | 论文 | ⚪ | 自改进 harness 的新失效：**修不存在的失败**。构造一个正确动作是"什么都别做"的确定性微实验室，只喂合法轨迹并用逐字节 oracle 核验每一条被引用的违规——当合法输入里含有"像某条熟悉规则"的无害模式时，提议者在 **15/60 次**里启用了那条不存在的护栏并引用了 oracle 否定的违规（无特征输入下 0/60）。三条件同时成立才触发（规则形态的模式 + 开放规则集 + 预设存在失败的指令），去掉任一条即消失。既非 reward hacking 也非过度拒绝，是**幻觉**——与 #68 一起读 | [arxiv 2607.13083](https://arxiv.org/abs/2607.13083) |
| HarnessFix 论文 | 论文 | ⚪ | 针对"自演化改动宽泛、间接、范围失当"的定位问题：把原始轨迹与 harness 工件编译成 HTIR（Harness-aware Trace Intermediate Representation），归一化碎片证据、捕捉步级数据流与控制流、把运行时步骤对齐到塑造其行为的工件，再归因→flaw record→scoped repair operator→回归验证。4 个基准上相对初始 harness 提升 **6.3%–18.4%**；与 #53 行为定位是同一瓶颈的两种解法 | [arxiv 2606.06324](https://arxiv.org/abs/2606.06324) |
| Agent-Reactive Bugs 论文 | 论文/实证 | ⚪ | 首个聚焦 **AR bug** 的实证：只在某条 LLM 回复触发 harness 异常反应时才出现的缺陷，单看模型或单看 harness 都理解不了。人工分析 Codex / Gemini-CLI / LangChain / CrewAI 的 **255 份 bug report**，建"可观测症状 × 触发它的 LLM 行为"二维分类法；发现大量 AR bug 是**无明确 test oracle 的静默错误**，回复随机性又让复现困难。修复侧错位很有意思：**用户普遍主张在 harness 侧加护栏，开发者却倾向归咎于 LLM** | [arxiv 2607.15684](https://arxiv.org/abs/2607.15684) |
| Agent System and Harness Design 综述 | 论文/综述 | ⚪ | 以 model-harness 视角问"瓶颈在模型、在 harness、还是在耦合"：梳理 prompt → workflow/context → harness → agent-native training with co-evolution 四范式，把执行 harness 拆成 6 项耦合运行时职责（observation / context / control / action / state / verification）。综述体裁，检索地图价值大于论点价值，配 #57 共演化看 | [arxiv 2606.20683](https://arxiv.org/abs/2606.20683) |
| Recursive Agent Harnesses 论文 | 论文 | ⚪ | 给 #51（dynamic subagents）与 RLM 之间那个模式命名：递归单元不是模型调用而是**完整的 agent harness**（带文件系统工具、代码执行与规划）。固定 GPT-5 后端，Oolong-Synthetic 上把 Codex 基线从 **71.75% 提到 81.36%**（199 样本、13 个上下文长度分桶至 4M token），换 Claude Sonnet 4.5 达 89.77% | [arxiv 2606.13643](https://arxiv.org/abs/2606.13643) |
| Stop Hand-Holding Your Coding Agent 论文 | 论文/概念 | ⚪ | 给 loop engineering 做学术化梳理：把"loop specification"定义成人类交给 harness 的有界可复用工件（trigger / goal / verification / stopping rule / memory），并把它与普通程序循环、与 harness 内建的感知-行动-观察循环区分开；含五级验证阶梯与终止状态命名法，以及对 **50 个真实 loop 的公开语料**的人工编码分析。反驳"loop 取代 prompt"的强口号。与 #41/#43 同题 | [arxiv 2607.00038](https://arxiv.org/abs/2607.00038) |
| claude.com：用 skill 搭验证回路 | 产品文 | ⚪ | Claude Code 侧把"验证回路"沉淀成 skill 的官方做法，是 #66 把验证/代码评审移出系统提示词那一步的操作面；产品文体裁，2026-07-22 | [claude.com](https://claude.com/blog/building-verification-loops-in-claude-code-with-skills) |
| claude.com：Anthropic 如何跑大规模代码迁移 | 案例 | ⚪ | 官方口径的大规模迁移实践，与 #56 Bun 重写、#65 SQLite 蜂群构成"迁移/重写"三例对照；案例文体裁、无成本账本，2026-07-16 | [claude.com](https://claude.com/blog/ai-code-migration) |
| LangChain：Towards Automating Eval Engineering | 产品/方法 | ⚪ | Eval Engineering Skill 发布稿，但两处有料：**verifier 的第一版几乎从不是最终版**，要同时检查智能体轨迹与 **verifier 轨迹**；已观察到的四种作弊形态（过度引用无关来源骗满分 / 声称做过其实没做 / 利用暴露在环境里的答案材料 / 满足代理指标但没真正完成）。定调句"Evals are training data for agents"，2026-07-22 | [langchain](https://www.langchain.com/blog/towards-automating-eval-engineering) |
| LangChain：Agents need their own computer | 概念/产品 | ⚪ | 隔离论证与 #50 重复度高，值得单取的是**注入防御那节**：沙箱遏制执行爆炸半径但**不消除提示词注入**，因为沙箱输出会被读回上下文；给出具名模式 **"non-agentic read"**——由非模型进程去沙箱取成品（文件、diff、报告），而不是把原始输出灌进智能体上下文；并直言"别指望靠提示模型去识别或忽略注入"，2026-07-15 | [langchain](https://www.langchain.com/blog/agents-need-their-own-computer) |
| Harrison Chase：Own your intelligence | 战略随笔 | ⚪ | "拥有智能"三层（model / harness / context）+ 拥有经济性、质量与风险 + 复利闭环（每一次改动配一条 eval 固化）；论点与 #3/#15/#21 高度重叠，唯一增量是结尾那份 **10 问自评清单**，可作 `prompts/` 模板引用，2026-07-25 | [langchain](https://www.langchain.com/blog/own-your-intelligence) |
| Faros AI：AI acceleration whiplash | 行业报告 | ⚪ | #63 与 #78 共同引用的那份遥测报告：评审评论数 +25%、评论长度 +22.7%、**+31.3% 的 PR 完全跳过评审**；每 PR 事故 +242.7%、月度事故 +57.9%、人均 bug +54%。相关性信号而非因果铁证，但它是"熄灯工厂会失败"论证的经验底座；同站另有一篇 harness engineering 五层框架科普（tool orchestration / verification loops / context & memory / guardrails / observability）+ 一组可从现有系统拉出的基线指标（每合并 PR 成本、智能体 PR 的 time-to-merge、评审速度对 PR 体积、人均算力开销） | [research](https://www.faros.ai/research/ai-acceleration-whiplash) / [blog](https://www.faros.ai/blog/harness-engineering) |
| StrongDM 熄灯工厂 + Dan Shapiro 五级 | 一手实验 / 分级 | ⚪ | #63/#64 讨论的"熄灯工厂"实物：StrongDM 公开运行的 lights-off factory（无人写码、无人读码，配 weather-report 更新页）与 Dan Shapiro 的"从辣味自动补全到软件工厂"五级分类。Dex 的批评是"没找到确定性的成效数据"；作为反方样本长期跟踪 | [factory.strongdm.ai](https://factory.strongdm.ai) / [danshapiro.com](https://www.danshapiro.com/blog/2026/01/the-five-levels-from-spicy-autocomplete-to-the-software-factory/) |
| Ronacher：The Tower Keeps Rising | 随笔 | ⚪ | #62 作者同月另一篇：vibecoding 与"共享语言可能崩塌"；哲学性论述、无一手数据，与 #42 The Coming Loop 同一关切的延伸，2026-07-13 | [lucumr](https://lucumr.pocoo.org/2026/7/13/the-tower-keeps-rising/) |
| Fowler / Giles Edwards-Alexander：重构的经济效益 | 实验 | ⚪ | Exploring Gen AI 系列少见的**定量重构实验**：一个 15 万行、纯智能体生成、作者从不 review 的应用里，数据访问层膨胀到单文件 17,155 行；用"智能体永远学不会"这一特性把它变成干净实验——每完成一步重构就派一个全新 sub-agent 跑同一个代表性变更并回报 token，无学习污染。14+ 步后同一变更的输入 token 从 159,564 降到 27,360（−83%），且是**一次重构、此后每次触碰该层都更便宜**的复利式节省。附带黑色幽默：机械重构用 Python+grep/sed 脚本执行，"经常被缩进搞晕"。给"熄灯工厂里到底还要不要重构"一个可迁移的算账方法，2026-07-30。**升格候选**（新实验范式） | [martinfowler](https://martinfowler.com/articles/exploring-gen-ai/refactoring-economic-benefit.html) |
| Geoffrey Huntley：engineer away the slop | 随笔/立场 | ⚪ | Ralph 方法论源头（#28）本人宣布加入 Antithesis，并抛出直指**行为 harness（#2 最弱那维）**的假说：形式化验证 + 确定性系统测试即将跨越鸿沟；靠"模拟一台确定性计算机"逼出普通测试暴露不了的整类 bug；与对抗式 LLM 评审 + pre-commit 里的语言分析器合流，成为软件工厂交付可靠软件的关键件。定调句"创造已近乎免费，验证/理解还不是——是时候把 slop 工程掉了"；与 #63/#64 熄灯工厂、#33 安全审计对读，2026-07-24 | [ghuntley](https://ghuntley.com/slop/) |
| Fowler / Rachel Laycock：The Conductor Developer | 随笔 | ⚪ | Thoughtworks CTO 新开博客首批文之一："开发正越来越像指挥乐团"——她预期瓶颈会沿 SDLC 从编码逐段后移到设计规格、架构、验证，且已经在发生；领导者视角的定调文，与 #55 外环问责、#63 工厂失败同题，一手数据少、胜在措辞，2026-07-31 | [martinfowler](https://martinfowler.com/rachels-ramblings/conductor-developer.html) |
| claude.com：Datadog 的"通用机床"工具 | 案例 | ⚪ | 反 MCP 工具膨胀的一手做法：Datadog 不给 Claude Code 塞几十个细粒度工具，而是造一个"通用机床"式的单一工具让模型自行组合调用——工具设计即 harness 的具体案例，与 #62 工具 schema 论、#54 DSL 工具集互证；案例文体裁，2026-07-21 | [claude.com](https://claude.com/blog/how-datadog-built-a-universal-machine-tool-for-claude-code) |
| Simon Willison：smevals | 工具 | 🔵 | 作者自建的小型评测套件，明确定位"同时评 model、prompt 与 harness"三者——正好呼应 #35/#67 把三者拆开测的思路，可作轻量本地评测脚手架样本；待实测后再定去向，2026-07-31 | [simonwillison.net](https://simonwillison.net/2026/Jul/31/smevals/) |
| Simon Willison：Cat & Thariq 炉边对谈 | 笔记/访谈 | ⚪ | #66（Thariq 的 Claude 5 上下文工程新规则）的口语化续篇：Claude Code 团队两人谈系统提示词瘦身、验证/评审外移到 skill、以及"新模型让很多显式脚手架变得多余"的一手取舍；访谈笔记体裁，配 #66 与 steering 官方指南看，2026-07-21 | [simonwillison.net](https://simonwillison.net/2026/Jul/21/cat-and-thariq/) |
| DeepSeek Harness 开发者预览 | 产品 | 🔵 | 头部实验室下场做 harness（HN 747 分，2026-08-13）；预览期无深度工程文，待实测/待其技术博客；与 #74 Pi 的开源中立主张构成反向信号 | [deepseek](https://deepseek.com/harness/en/) |
| Ronacher：What Is Reasoning | 随笔 | ⚪ | reasoning trace 只是训练出的频道约定、reasoning effort 即系统提示一行字——harness×模型接口层（channel/KV cache/prefill）的一手拆解；与 #62 同作者同视角，2026-08-19 | [lucumr](https://lucumr.pocoo.org/2026/8/19/what-is-reasoning/) |
| Osmani：Agentic Code Quality | 长文 | ⚪ | "质量取决于给 agent 的约束体系而非逐行把关"；论点与概念 3/6 重叠，价值在操作清单，2026-08-08 | [addyosmani](https://addyosmani.com/blog/agentic-code-quality/) |
| Osmani：Human judgment relocates | 长文 | ⚪ | 软件工厂里人的判断只迁移不消失，"仍有主人"的工厂构建指南；#64 工厂系列续篇，2026-08-21 | [addyosmani](https://addyosmani.com/blog/human-judgment-doesnt-leave-the-software/) |
| Willison：Conceptual integrity | 长文 | ⚪ | 千行级日产出后概念完整性/团队认知力成质量上限；与 #42 comprehension 关切合流，2026-08-19 | [simonwillison](https://simonwillison.net/2026/Aug/19/conceptual-integrity-and-counting-lines-of-code/) |
| Rachel Laycock：Citizens Build, Agents Execute, Experts Govern | 随笔 | ⚪ | 工程价值转向治理（护栏/平台/反馈环设计）；Conductor Developer（观察项）续篇，领导者视角定调文，2026-08-19 | [martinfowler](https://martinfowler.com/rachels-ramblings/citizens-agents-experts.html) |
| Dan Luu：coding agent 最优语言 | 长文 | ⚪ | token 效率与反馈质量角度的语言选型实证；与 Fowler retreat"Rust 替代 Python 强化传感器"（观察项）互证，2026-08-10 | [danluu](https://danluu.com/pl-tokens/) |
| Fabien Sanglard 的 agent.md | 随笔 | ⚪ | 知名图形程序员公开的 agent.md 质量约束清单（HN 414 分）；个体实践样本，2026-08-23 | [fabiensanglard](https://fabiensanglard.net/agent.md/index.html) |
| OpenAI 蜂群误攻击 Hugging Face 时间线 | 事件 | ⚪ | 多智能体隔离失效的标志性事故（Willison 整理时间线，2026-08-07）；与 #50 遏制、"non-agentic read"注入防御（观察项）对读 | [simonwillison](https://simonwillison.net/2026/Aug/7/openai-timeline/) |
| Claude Code auto mode 转默认 + 生产实践 | 产品/案例 | ⚪ | 自主性/权限 harness 的产品拐点（2026-08-07 对 Pro/Max/Team 默认化）+ Nuro/Gusto/Garner 生产实录；两篇合一行 | [默认化](https://claude.com/blog/auto-mode-default-in-claude-code) / [生产](https://claude.com/blog/auto-mode-in-production) |
| Claude Code 自托管执行环境 | 发布稿 | ⚪ | agent 运行环境自托管公测（自有算力/内网）；sandbox 基建层，发布稿体裁，2026-08-06 | [claude.com](https://claude.com/blog/run-claude-code-sessions-on-your-own-compute) |
| Anthropic：AI-Native SDLC playbook | 方法论 | ⚪ | 官方 SDLC 分阶段总纲（计划/设计/构建/测试/部署/维护）；组织级实践手册体裁，2026-08-21 | [claude.com](https://claude.com/blog/the-ai-native-sdlc-playbook) |
| Warp 自改进 agent 模式 | 案例 | ⚪ | 可复用的自改进 agent 开发模式；loop/反馈回路案例文体裁，2026-08-26 | [claude.com](https://claude.com/blog/how-warp-builds-self-improving-agents-on-claude) |
| Claude Tag 做 CI/CD 第一响应者 | 工程/案例 | ⚪ | 检测→分诊→修复 CI 失败的内部 agent 闭环；验证回路+on-call 范本，2026-08-18 | [claude.com](https://claude.com/blog/ai-ci-cd-on-call) |
| Cursor Router 模型路由 | 工程文 | ⚪ | 从真实开发者流量学习选模型，Auto 满意度超 Fable 级且成本 -68%；与 Switchyard 构成本窗口"路由"双证，2026-08-06 | [cursor](https://cursor.com/blog/how-cursor-router-works) |
| LangChain×NVIDIA Switchyard 路由基准 | 工程文 | ⚪ | 145 个 agent 任务：仅 7% 轮次需前沿模型，路由省 74% 成本、损 6 点精度；成本缺口数据点，2026-08-11 | [langchain](https://www.langchain.com/blog/switchyard-agent-routing-benchmark) |
| OpenAI 内部 data agent | 工程文 | ⚪ | 600PB/7 万数据集的自学习内部 agent，经 MCP 嵌入 Slack/IDE 工作流；官方站反爬、要点经外部佐证，2026-08-13 | [openai](https://openai.com/index/inside-our-in-house-data-agent/) |
| LangChain：Agent 环境与任务构造三步法 | 工程文 | ⚪ | 合成 evals 环境的方法论（spec 生成→spec 转任务→world spec）；#69 Harbor 评测栈续篇，2026-08-25 | [langchain](https://www.langchain.com/blog/building-agent-environments-and-tasks) |
| LangChain OpenWiki 双篇（WikiBench + 自纠错记忆） | 工程文 | ⚪ | wiki+源码 > 纯源码的基准证据 + 证据锚定 claim 检测过期知识；上下文供给/记忆侧，两篇合一行，2026-08 下旬 | [wikibench](https://www.langchain.com/blog/evaluating-openwiki-with-wikibench) / [memory](https://www.langchain.com/blog/self-correcting-memory-openwiki) |
| monday.com 双视角（Sidekick + agent-first 重构） | 案例 | ⚪ | 同一企业在 LangChain/Anthropic 两侧的实践叙述："有能力的 agent 光有工具不够"；两篇合一行，2026-08 | [langchain](https://www.langchain.com/blog/building-monday-com-sidekick-why-capable-agents-need-more-than-just-tools) / [claude.com](https://claude.com/blog/how-monday-com-transformed-its-platform-into-an-agent-first-product-where-humans-and-agents-collaborate) |
| Fowler Fragments 08-04/08-18/08-24 三则 | 短评 | ⚪ | 08-24 的 Zalando 引荐段（→ 已升格 #73）与 OpenAI 蜂群事件评述最有料；三则合一行 | [08-04](https://martinfowler.com/fragments/2026-08-04.html) / [08-18](https://martinfowler.com/fragments/2026-08-18.html) / [08-24](https://martinfowler.com/fragments/2026-08-24.html) |
| claude-code#6235：AGENTS.md 支持之争 | 讨论 | ⚪ | AGENTS.md vs CLAUDE.md 标准化的高热社区讨论（HN 377 分）；生态信号，2026-08-19 | [github](https://github.com/anthropics/claude-code/issues/6235) |
| Jake Saunders：自建沙箱化软件工厂 | 实践 | ⚪ | 个人全自托管软件工厂实录（sandbox+factory）；个体侧工厂样本，配 #63/#64 看，2026-08-21 | [blog.jakesaunders](https://blog.jakesaunders.dev/building-an-almost-fully-self-hosted-sandboxed-agentic-software-factory/) |
| One Recipe, Many Harnesses 论文 | 论文 | ⚪ | 固定演化配方跨 8 语言×3 基模型，拆"演化产物到底编码了什么"（基准过拟合 vs 语言知识 vs 模型补偿）；可移植性+失效模式+归因三缺口同中，UIUC+IBM，2026-08-10 | [arxiv 2608.10178](https://arxiv.org/abs/2608.10178) |
| HarnessRisk 安全基准论文 | 论文/基准 | ⚪ | 首个按 harness 六运营阶段（配置/扩展/运行/状态持久化/动作控制/事故恢复）组织的安全基准，128 沙箱案例×3 harness×6 模型；#33 开辟方向的后续，2026-08-18 | [arxiv 2608.17597](https://arxiv.org/abs/2608.17597) |
| Prompt-Induced Waste 论文 | 论文 | ⚪ | 控制实验证明提示语义×推理努力×harness 策略是交互因子而非独立控制项，效率应建模为"每成功任务成本"（token/缓存计数不是充分优化目标）；成本缺口正面数据，2026-08-02（v5 08-24） | [arxiv 2608.01347](https://arxiv.org/abs/2608.01347) |
| Fragility of Self-Improving Agents 论文 | 论文 | ⚪ | 重评基于记忆的自改进：多次运行量化方差+打乱任务顺序——自改进闭环放大评估噪声、改进高度依赖任务顺序，现有报告可能是顺序运气；方法论警钟，Salesforce 系，2026-08-18 | [arxiv 2608.18066](https://arxiv.org/abs/2608.18066) |
| 三 harness 架构收敛论文 | 论文/分析 | ⚪ | deepagents/pi/dsh 源码级对比：哲学对立的 harness 从相反方向（减法 vs 加法）收敛到同一五要素中间形态；与 #74 Pi 双篇对读，2026-08-25 | [arxiv 2608.23953](https://arxiv.org/abs/2608.23953) |
| 编码代理可靠性综述（Jarmak） | 论文/综述 | ⚪ | 164 篇文献+100 条实践记录："按模型评估、按系统部署"，大量"模型失败"实为 harness/状态/权限/资源层失败；检索地图体裁，2026-08-14 | [arxiv 2608.13867](https://arxiv.org/abs/2608.13867) |
| 自演化编码代理综述 | 论文/综述 | ⚪ | 首个结构化综述：按框架/记忆/技能工具/模型/工作流/环境六个演化对象分类；配 #45 Weng RSI 综述看，2026-08-04（v2 08-20） | [arxiv 2608.03392](https://arxiv.org/abs/2608.03392) |
| 8 月自动 harness 演化方法群（6 篇合并） | 论文群 | ⚪ | JIT-Agent（[2608.25593](https://arxiv.org/abs/2608.25593)）/ AutoSaddler（[2608.23041](https://arxiv.org/abs/2608.23041)）/ Harness-R1（[2608.02276](https://arxiv.org/abs/2608.02276)，在线 RL 训 9B "harness 工程师"）/ HarnessCompass（[2608.01918](https://arxiv.org/abs/2608.01918)，直接命名三大失效并逐一治理）/ HELIX（[2608.13951](https://arxiv.org/abs/2608.13951)）/ Living-Harness（[2607.26598](https://arxiv.org/abs/2607.26598) v2）——方法各异，共同点是把 harness 当可机器编辑工件；待出现独立复现或引用领先者再拆行 | （见左） |
| Ouroboros 自开发 harness 论文 | 论文 | ⚪ | "被评审的 commit"演化自身工具/提示/上下文组装，TB2.1 86.74%（Opus 5）/OSWorld-Verified 90.69%；演化安全阀（评审门控）样本，含 Yampolskiy，2026-08-08 | [arxiv 2608.08311](https://arxiv.org/abs/2608.08311) |
| StateM harness scaling 论文 | 论文 | ⚪ | 不动权重纯 harness scaling（持久状态+阶段局部上下文+受检转移+runbook）：GPT-5.6 Sol 达 TB2.1 95.3%；runbook 免改跨模型迁移 + 标题给出 $15 前沿成本点，2026-08-15 | [arxiv 2608.15089](https://arxiv.org/abs/2608.15089) |
| 技能污染与失效三篇（合并） | 论文群 | ⚪ | 技能池超临界后新技能反而降性能且结构不可逆+预提交门控（[2608.05810](https://arxiv.org/abs/2608.05810)）/ Demystifying Agent Skills 8,135 试验失效分类学（[2608.14036](https://arxiv.org/abs/2608.14036)）/ 联盟污染与跨域效用反转（[2608.22610](https://arxiv.org/abs/2608.22610)）——skills 机制的系统性失效证据 | （见左） |
| Evo-Bench + LoopsBench | 论文/基准 | ⚪ | 评"模型改进 harness 的内在能力"并隔离基模型强度（[2608.09096](https://arxiv.org/abs/2608.09096)）+ ByteDance 长程基准：可分测依赖 DAG+回归义务，最强配置仅 ~25%（[2608.00267](https://arxiv.org/abs/2608.00267)）；评测方法论双证 | （见左） |
| Working Set / Coherence Debt 论文 | 论文 | ⚪ | 耦合事实图+通道供给/扣留+故障注入，跨 7 模型×5 harness：事实可得性决定成败而距离无关、不同 harness 为同一事实付出不等代价；组件归因直接证据，2026-08-17 | [arxiv 2608.16630](https://arxiv.org/abs/2608.16630) |
| Replay Gap 论文 | 论文 | ⚪ | 分叉实跑（~900 rollout）证伪"重放日志换模型"静态路由评估：换模型分叉重写 61-94% 后续动作、74-77% 首步即分歧；跨模型不可静态外推，2026-08-08 | [arxiv 2608.08239](https://arxiv.org/abs/2608.08239) |
| Harness-IF + Feedback That Backfires | 论文 | ⚪ | 部署 harness 五个指令面的运维规则合规评测，Against-Prior Accuracy 区分"合规 vs 碰巧"（[2608.11727](https://arxiv.org/abs/2608.11727)）+ "失败进 transcript 即纠错"假设对指令微调小模型为负增益、失败后重复同一调用概率 0.06→0.54（[2608.23653](https://arxiv.org/abs/2608.23653)）；harness 设计假设的行为验证 | （见左） |
| 自演化安全攻击群（4 篇合并） | 论文群 | ⚪ | SkillJack 持久技能后门（[2608.03509](https://arxiv.org/abs/2608.03509)）/ 轨迹投毒 91.0% SER（[2608.05563](https://arxiv.org/abs/2608.05563)）/ harness 提取攻击——harness 视为 IP（[2607.28147](https://arxiv.org/abs/2607.28147) v4）/ 金融 agent 自演化能力与风险同增（[2608.17684](https://arxiv.org/abs/2608.17684)）——自演化×安全攻防谱系，配 HarnessRisk 看 | （见左） |
| MCP vs CLI + DCAS | 论文 | ⚪ | 7 scaffold×5 模型可复现实验：主导效应是 scaffold 而非工具接口（[2608.08654](https://arxiv.org/abs/2608.08654)）+ 开源微调数据几乎全采自 OpenHands 导致模型 scaffold 锁定、基模型无此分歧（[2608.06113](https://arxiv.org/abs/2608.06113)，Queen's）；可移植性双证 | （见左） |
| LangChain harness/loop 核心系列（存量回扫，12 篇合并） | 信源级 | ⚪ | 2026-08-27 回扫发现的系统性缺口：improving-deep-agents-with-harness-engineering（02-17，TB Top30→Top5）、better-harness（04-08，evals 爬山）、the-art-of-loop-engineering（06-16）、how-to-build-a-custom-agent-harness（06-03）、middleware 两篇、frameworks-runtimes-harnesses（2025-10）、tuning-the-harness-not-the-model（07-08，开源模型 ~8x 低成本追平 Opus 4.8）、your-harness-your-memory（04-11）、deep-agents 开山文（2025-07）、tuning-deep-agents-different-models（04-29）、Candidly 案例（06-29）——完整清单见 translate/2026-08-27/candidates.md 留档；某篇被引用或需要时再单独升格 | [入口](https://www.langchain.com/blog/improving-deep-agents-with-harness-engineering) |
| claude.com 机制文系列（存量回扫，合并） | 信源级 | ⚪ | 同批回扫缺口：skills 全系列（Introducing Agent Skills 2025-10-16 起 8 篇）、subagent/multi-agent 系列 4 篇、Lessons from building Claude Code 双篇（skills 06-03 / prompt caching 04-30）、dynamic workflows 发布文、hooks/plugins/CLAUDE.md/session 管理等机制文——完整清单见 translate/2026-08-27/candidates.md；同上处理 | [入口](https://claude.com/blog/lessons-from-building-claude-code-prompt-caching-is-everything) |

> 三篇短 bliki / 随笔（Vibe Coding、Interrogatory LLM、Genie Tarpit）若日后要收，建议合并成一个「概念定义 / 上下文工程 pattern」小专题，别各开条目稀释精品信号。
>
> **本批（2026-08-03）暂扣的升格候选：** Fowler / Rahul Garg《The Orchestrator's Tax》(2026-07-16) 提出"编排进程本身"是 Böckeler 三类 harness 之外的**第四类 harness**（subagent 的价值不在提速而在保护编排者工作记忆 + cognitive locality + "缺事实就补事实、别补流程"的 CLAUDE.md 启发式），完全够编号正文——但原文头部仍挂着"Draft，请勿分享或链接本 URL"的告示，故本轮遵嘱不建条目、不留链接，待其撤下草稿标记后再收。
