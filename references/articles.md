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
> 当前规模：**19 篇文章**（脉络一 16 + 脉络二 2 + 脉络三 1）+ **1 项已跟踪产品**（不计入文章数）。最近一次同步：2026-04-28。

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

> 注：Chachamaru127 / claude-code-harness 早期曾占据 #16 文章位，现已迁至本文末尾的"已跟踪产品 / 项目"段落（不计入文章数）。

---

## 脉络二：云原生时代的 Harness.io（交付与平台工程）

### 17. Harness.io 官方 — 全局架构

- **标题：** Understanding CI/CD Platforms: The backbone of modern DevOps
- **链接：** [harness.io](https://www.harness.io/blog/understanding-ci-cd-platforms-the-backbone-of-modern-devops)
- **核心：** 标准 CI/CD 平台介绍。8 大组件：SCM → Build → Test → Code Quality → Security Scan → Artifact → Deploy → Monitor
- **Harness 差异化：** 统一管线、Test Intelligence 智能测试、最少脚本、Policy-as-Code 治理

### 18. Google Cloud Architecture — 前沿场景结合

- **标题：** Harness CI/CD pipeline for RAG applications
- **链接：** [docs.cloud.google.com](https://docs.cloud.google.com/architecture/partners/harness-cicd-pipeline-for-rag-app)
- **作者：** Martin Ansong (Harness) | **日期：** 2025-04-11
- **核心：** 参考架构，Harness 全家桶（CI/CD/STO/SCS/CCM/FME）+ Google Cloud Run 部署 RAG 应用
- **9 步工作流：** Trigger → Compile & Test → Package → Dev Deploy → Staging → Approval → Production Canary → Feature Validation → Cost Tracking
- **附带 Terraform 模板：** [harness-community/harness-rag-ci-cd](https://github.com/harness-community/harness-rag-ci-cd)

---

## 脉络三：效率悖论与能力进化

### 19. YDD / Miss-you — 效率悖论的系统性拆解

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

## 已跟踪产品 / 项目（不计入文章数）

> 这里收录的是**开源产品 / 框架 / 工具**，不是文章。本段不参与"### N. ..." 的全局编号，不计入 19 篇的文章总数。
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
