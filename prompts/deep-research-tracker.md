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
> 本节最近一次同步：2026-04-28（与 `articles.md` 当前内容对齐：19 篇文章 + 1 项已跟踪产品）。

**核心文章 19 篇，分布于三条脉络：**

- **脉络一 — AI 时代 Harness Engineering（16 篇）：**
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
- **脉络二 — 云原生 Harness.io（2 篇）：** Harness.io 官方全局架构 / Google Cloud 集成场景
- **脉络三 — 效率悖论（1 篇）：** YDD/Miss-you "效率悖论的系统性拆解"（2026-03-03）

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
   - 对**已有约 19 篇文章 + 已收录开源产品**（完整清单见 Prompt A 的"已知内容"段落或 `references/articles.md`）的补充价值
   - 对 thinking/ 中已有洞见的验证或挑战（含 cross-article-insights 的 8 个洞见 + guides-sensors-meets-claude-code-harness 的 5 个张力）
   - 对开放问题清单的回答程度

2. **缺口分析**：这批内容覆盖了我们的哪些知识缺口？还有哪些缺口未被触及？
   当前已知缺口：
   - 行为 Harness（功能正确性验证）
   - Harness 覆盖率评估方法
   - 跨模型可移植性
   - 成本数据
   - 中小团队实践案例
   - Harness 接口维护成本（追宿主升级在总维护中的占比）
   - 控制的"激活策略"（always-on / per-commit / conditional / human-summoned 的分类与适用场景）

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
