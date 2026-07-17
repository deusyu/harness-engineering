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
> 当前规模：**50 篇文章**（脉络一 46 + 脉络二 2 + 脉络三 2）+ **1 项已跟踪产品**（不计入文章数）。最近一次同步：2026-07-15。

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
| 反馈瓶颈 / serial speed-up | #49 YDD 效率悖论 |

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
| 无法退出的压力 | #49 YDD 效率悖论、#31 学科汇流的产业动力 |

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

## 脉络二：云原生时代的 Harness.io（交付与平台工程）

<a id="article-47"></a>

### 47. Harness.io 官方 — 全局架构

- **标题：** Understanding CI/CD Platforms: The backbone of modern DevOps
- **链接：** [harness.io](https://www.harness.io/blog/understanding-ci-cd-platforms-the-backbone-of-modern-devops)
- **作者：** Harness.io 官方博客 | **日期：** 2026-05-22
- **核心：** 标准 CI/CD 平台介绍。8 大组件：SCM → Build → Test → Code Quality → Security Scan → Artifact → Deploy → Monitor
- **Harness 差异化：** 统一管线、Test Intelligence 智能测试、最少脚本、Policy-as-Code 治理

<a id="article-48"></a>

### 48. Google Cloud Architecture — 前沿场景结合

- **标题：** Harness CI/CD pipeline for RAG applications
- **链接：** [docs.cloud.google.com](https://docs.cloud.google.com/architecture/partners/harness-cicd-pipeline-for-rag-app)
- **作者：** Martin Ansong (Harness) | **日期：** 2025-04-11
- **核心：** 参考架构，Harness 全家桶（CI/CD/STO/SCS/CCM/FME）+ Google Cloud Run 部署 RAG 应用
- **9 步工作流：** Trigger → Compile & Test → Package → Dev Deploy → Staging → Approval → Production Canary → Feature Validation → Cost Tracking
- **附带 Terraform 模板：** [harness-community/harness-rag-ci-cd](https://github.com/harness-community/harness-rag-ci-cd)

---

## 脉络三：效率悖论与能力进化

<a id="article-49"></a>

### 49. YDD / Miss-you — 效率悖论的系统性拆解

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

<a id="article-50"></a>

### 50. METR — 生产力实验的后续：结论松动与方法论危机

- **标题：** We are Changing our Developer Productivity Experiment Design（2026-02-24）+ Measuring the Self-Reported Impact of Early-2026 AI on Technical Worker Productivity（2026-05-11）
- **链接：** [metr.org 实验设计更新](https://metr.org/blog/2026-02-24-uplift-update/) | [metr.org 自报调查](https://metr.org/blog/2026-05-11-ai-usage-survey/) | [后续研究数据集](https://github.com/METR/Measuring-Late-2025-AI-on-OSS-Devs)
- **翻译：** [works/metr-uplift-update-translation.md](../works/metr-uplift-update-translation.md)（实验设计更新篇）
- **作者：** Joel Becker, Nate Rush, Tom Cunningham, David Rein, Khalid Mahamud (METR) | **日期：** 2026-02-24 / 2026-05-11
- **核心：** #49 YDD 的论证基石（METR RCT "AI 辅助反而慢 19%"）的官方后续。late-2025 复现实验（57 名开发者、143 仓库、800+ 任务）的原始结果转向加速——原班开发者估计 **-18% 加速**（CI -38%~+9%）、新开发者 -4%（CI -15%~+9%）——但 METR 自己判定这只是**很弱的证据**，并宣布改实验设计。真正的信息量在于：**AI 渗透已经破坏了任务级随机对照实验本身的可行性**。

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
| 19% 减速数据的后续 | #49 YDD 第一章效率悖论（引用了原实验） |
| 感知与现实的偏差 | #49 的 39 个百分点偏差、自报高估 40+ 个百分点 |
| 并发智能体使计时失效 | #49 第五章并发策略（并发正是 YDD 开出的药方） |
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
> 本段不参与 `### N. ...` 的全局编号，不计入 50 篇文章总数；与上方编号正文严格区分，避免污染脉络计数。
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

> 这里收录的是**开源产品 / 框架 / 工具**，不是文章。本段不参与"### N. ..." 的全局编号，不计入 50 篇的文章总数。
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

> 2026-05 起各轮调研中已甄别、但**暂不值得做成正式文章**的产品页 / README / 短 bliki / 发布稿 / 工程随笔。本段不参与 `### N.` 编号，不计入 50 篇文章总数。
> 中文译文留在本地 `translate/`（gitignored）作阅读辅助；下表只记上游链接与定性，方便下次快速复看。
> **去向标记：** 🔵 待实测后入 `tools/`（遵守 tools/「只收用过的工具」标准，未实测前不正式收录） ｜ ⚪ 长期观察 ｜ ⏭️ 暂存不收。

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
| Steering Claude Code 官方指南 | 产品文档 | ⚪ | 七种转向机制（CLAUDE.md/rules/skills/subagents/hooks/output styles/system prompt append）按"加载时机 × compaction 行为 × token 成本"三轴对照——#49 YDD"区别在加载机制"论的官方版说明书；参考手册体裁，2026-06-18 | [claude.com](https://claude.com/blog/steering-claude-code-skills-hooks-rules-subagents-and-more) |
| The Harness Effect 论文 | 论文/厂商评测 | ⚪ | "成本数据"缺口的首个系统数据：同 22 任务 × 6 模型只换编排层，成本 -41%、时延 -44%、token -38%；提出 token maxing 与 harness leverage（质量增益与基线能力 r=0.99）。注意 Writer Inc. 自评自家 harness，利益相关，方法论（frozen baseline + locked tasks）可取 | [arxiv 2607.06906](https://arxiv.org/abs/2607.06906) |
| Harness Updating ≠ Harness Benefit 论文 | 论文 | ⚪ | 拆开两条能力轴：写 harness 编辑的能力各模型持平（9B 能写出与 Opus 同构的 skill），利用 harness 的能力非单调（中档模型受益最多）——跨模型可移植性缺口的机制侧证据；被 #45 Weng 综述引用 | [arxiv 2605.30621](https://arxiv.org/abs/2605.30621) |
| ToFu 白盒研究 harness | 工具 | 🔵 | MIT 协议、面向研究者的白盒 harness：三层上下文压缩 + 多语言 + MCP 集成，可作为 research object 检查/修改编排逻辑；待实测后再定去向 | [arxiv 2607.11423](https://arxiv.org/abs/2607.11423) |
| OpenAI：How agents are transforming work | 报告 | ⚪ | 内部采纳数据：Codex 从占员工 <10% token 到成为全部门（含法务/招聘）主力；99 分位用户日均 60+ 小时 agent turns、多智能体并行——脉络三的组织影响新数据点，2026-06-25 | [openai](https://openai.com/index/how-agents-are-transforming-work/) |
| Fowler Fragments 2026-07-06 / 07-13 | 短评 | ⚪ | retreat 纪要两则：AGENTS.md <200 行、用 Rust 替代 Python 强化计算性传感器、property-based testing、"DX 与 AX 的维恩图是个圆"（Laura Tacho）、"harness 会否被模型进步淘汰"的现场辩论——#2 的口语化增量 | [07-06](https://martinfowler.com/fragments/2026-07-06.html) / [07-13](https://martinfowler.com/fragments/2026-07-13.html) |
| Geoffrey Litt：Understand to participate | 演讲 | ⚪ | AIE 2026 演讲（经 Simon Willison 笔记）：cognitive debt——理解要深到"能继续参与创作"，否则参与能力实质受限；与 #42 Ronacher 的 comprehension 关切合流，待官方视频/文字稿 | [simonwillison.net](https://simonwillison.net/2026/Jul/2/understand-to-participate/) |
| Simon Willison：Agentic Engineering Patterns | patterns 库 | ⚪ | 2026-02 起持续更新的模式集（红绿 TDD、hoard working examples、线性走查等）；附 Fable's judgement 笔记（2026-07-03：让模型自主选低阶模型跑子任务）——个体实践侧长期跟踪 | [guides](https://simonwillison.net/guides/agentic-engineering-patterns/) |
| Thoughtworks Technology Radar Vol.34 | 行业雷达 | ⚪ | Ralph loop 列为 Assess、Team of coding agents 列为 Assess、Coding agent swarms 列为 Caution（2026-04-15）——#28 Ralph 的行业采纳信号；雷达条目体裁，一行即可 | [thoughtworks](https://www.thoughtworks.com/radar/techniques/ralph-loop) |

> 三篇短 bliki / 随笔（Vibe Coding、Interrogatory LLM、Genie Tarpit）若日后要收，建议合并成一个「概念定义 / 上下文工程 pattern」小专题，别各开条目稀释精品信号。
