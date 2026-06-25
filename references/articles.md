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
> 当前规模：**30 篇文章**（脉络一 27 + 脉络二 2 + 脉络三 1）+ **1 项已跟踪产品**（不计入文章数）。最近一次同步：2026-06-25。

## 脉络一：AI 时代的 Harness Engineering（大模型护栏与认知工程）

### 1. OpenAI 官方 — 原点与哲学

- **标题：** Harness engineering: leveraging Codex in an agent-first world
- **链接：** [openai.com](https://openai.com/zh-Hans-CN/index/harness-engineering/)
- **作者：** Ryan Lopopolo | **日期：** 2026-02-11
- **核心：** 3 人团队用 Codex 从空仓库到 100 万行代码，零手写代码。提出六大概念：仓库即记录系统、地图而非手册、机械化执行、智能体可读性、吞吐量改变合并理念、熵管理。
- **关联：** 本仓库的学习起点，所有概念笔记的来源

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
  - [Mitchell Hashimoto: My AI Adoption Journey #Step 5: Engineer the Harness](https://mitchellh.com/writing/my-ai-adoption-journey#step-5-engineer-the-harness)
  - [Context Engineering for Coding Agents](https://martinfowler.com/articles/context-engineering-coding-agents.html)
  - [Humans and Agents in Software Engineering Loops](https://martinfowler.com/articles/humans-and-agents.html)

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

### 5. HumanLayer / Kyle — 实践与避坑

- **标题：** Skill Issue: Harness Engineering for Coding Agents
- **链接：** [humanlayer.dev](https://www.humanlayer.dev/blog/skill-issue-harness-engineering-for-coding-agents)
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
| Prompt 即一等可版本化交付物 | #16 OpenAI Symphony 的约束即产品、概念 07 spec-as-product |
| REASONS Canvas 七维结构 | 概念 2 地图而非手册 + 渐进式披露 |
| spdd-sync 反向同步防漂移 | 概念 3 机械化执行、#9 反馈飞轮 |

---

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
| system prompt 即受控产物 | 概念 07 spec-as-product、#16 Symphony |
| 反例 / 事故复盘（稀缺类型） | 仓库 works/ 多为正面理论，本篇为第一手反面教材 |

---

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
| 四要素 Harness | #2 Fowler、#5 HumanLayer 六杠杆、概念 2/3 |
| 反馈循环防腐化 | #9 Fowler 反馈飞轮、#19 Fowler Sensors |
| 反馈瓶颈 / serial speed-up | #28 YDD 效率悖论 |

---

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

## 脉络二：云原生时代的 Harness.io（交付与平台工程）

### 28. Harness.io 官方 — 全局架构

- **标题：** Understanding CI/CD Platforms: The backbone of modern DevOps
- **链接：** [harness.io](https://www.harness.io/blog/understanding-ci-cd-platforms-the-backbone-of-modern-devops)
- **核心：** 标准 CI/CD 平台介绍。8 大组件：SCM → Build → Test → Code Quality → Security Scan → Artifact → Deploy → Monitor
- **Harness 差异化：** 统一管线、Test Intelligence 智能测试、最少脚本、Policy-as-Code 治理

### 29. Google Cloud Architecture — 前沿场景结合

- **标题：** Harness CI/CD pipeline for RAG applications
- **链接：** [docs.cloud.google.com](https://docs.cloud.google.com/architecture/partners/harness-cicd-pipeline-for-rag-app)
- **作者：** Martin Ansong (Harness) | **日期：** 2025-04-11
- **核心：** 参考架构，Harness 全家桶（CI/CD/STO/SCS/CCM/FME）+ Google Cloud Run 部署 RAG 应用
- **9 步工作流：** Trigger → Compile & Test → Package → Dev Deploy → Staging → Approval → Production Canary → Feature Validation → Cost Tracking
- **附带 Terraform 模板：** [harness-community/harness-rag-ci-cd](https://github.com/harness-community/harness-rag-ci-cd)

---

## 脉络三：效率悖论与能力进化

### 30. YDD / Miss-you — 效率悖论的系统性拆解

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
> 本段不参与 `### N. ...` 的全局编号，不计入 30 篇文章总数；与上方编号正文严格区分，避免污染脉络计数。
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

- **为什么不进编号正文：** 本文是综述科普，不是一手文献。21 篇编号文章分别对应 OpenAI / Fowler / Anthropic / LangChain 等团队的一手工程博客、论文、外部逆向分析或中文社区原创分析；将综述纳入会污染「21 篇一手/准一手」的语义边界与一致性脚本（C1/C2/C6）的语义。归到本段保留对照价值即可。

---

## 已跟踪产品 / 项目（不计入文章数）

> 这里收录的是**开源产品 / 框架 / 工具**，不是文章。本段不参与"### N. ..." 的全局编号，不计入 30 篇的文章总数。
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
