# thinking/ — 独立思考

读完 concepts/ 后，在这里写下你自己的理解、质疑和延伸思考。

## 文件约定

- 文件名：自由命名，建议用问题或论点作为文件名
- 例如：`harness-vs-vibe-coding.md`、`is-this-only-for-openai.md`
- 结构：问题/论点 → 自己的分析 → 结论或开放问题
- 鼓励质疑原文，提出反例

## 已有文章

| 文件 | 主题 | 核心论点 |
|------|------|---------|
| [cross-article-insights.md](cross-article-insights.md) | 跨文章深层洞见 | 8 个洞见：Harness 生命周期、四学派、评估之踵、人类角色消解 |
| [harnessability-and-java.md](harnessability-and-java.md) | Java 的可驾驭性 | Java/Spring 天然提供高 Harnessability 基线 |
| [meta-harness-tensions.md](meta-harness-tensions.md) | Meta-Harness 的五个张力 | Anthropic Managed Agents 与既有实践的矛盾 |
| [evaluation-elephant-in-the-room.md](evaluation-elephant-in-the-room.md) | 评估是房间里的大象 | 行为正确性验证是整个体系的阿喀琉斯之踵 |
| [harness-for-solo-developers.md](harness-for-solo-developers.md) | 个人开发者的 Harness | 六大概念的适用性分析：直接可用 vs 需要降级 vs 不适用 |
| [guides-sensors-meets-claude-code-harness.md](guides-sensors-meets-claude-code-harness.md) | Böckeler 框架 vs claude-code-harness v4.2 | 产品级实现暴露的五个张力：Advisor 装不进 2×2、guardrail 融合前馈反馈、行为 Harness 是结构性绕过、追上游占 95% 维护成本、harness 必带价值观锁定 |
| [software-project-complexity-in-the-ai-era.md](software-project-complexity-in-the-ai-era.md) | AI 时代的软件项目复杂度 | 6 维（上下文压力 / 可提示性 / 探索收敛 / 状态纠缠 / 暗知识 / 验证成本）+ 胶囊化分母 + 重构/复刻终局指标 |
| [subagent-is-child-runtime.md](subagent-is-child-runtime.md) | Subagent 是 child runtime | 与 Claude Code 架构逆向互证：subagent = tool-call-triggered child session + context projection + evidence-return contract |
| [why-this-project-exists.md](why-this-project-exists.md) | 为什么有这个项目 | 项目宗旨：把 Harness Engineering 从"概念集合"变成"可复刻的产品构建方法论"——借用《诡秘之主》"学徒途径"隐喻 |
| [target-and-harness-in-agent-first-repos.md](target-and-harness-in-agent-first-repos.md) | Target 与 Harness 的仓库边界 | AI Agent 时代的 repo 会从“代码/内容仓库”演化成“目标系统 + 驭缰系统”的复合体 |
| [harness-and-skills-two-dimensional-agent-design.md](harness-and-skills-two-dimensional-agent-design.md) | Harness 与 Skills 的二维设计 | 个人 Agent 系统应横向用 harness 管理领域，纵向用 skills 沉淀可复用工作流 |
| [agent-native-research-project-structure.md](agent-native-research-project-structure.md) | Agent-Native 科研项目结构 | 面向会议论文的科研项目应由 management graph、epistemic graph 与 production artifacts 共同驱动 |

## 写作方向参考

- 机械化执行的边界在哪？过度 lint 是否会限制智能体创造性？
- Harness Engineering vs Vibe Coding：本质区别是什么？
- "零手写代码"是刻意的实验约束，还是可推广的工程实践？
- Context Engineering vs Harness Engineering：边界与关系

## 下一步

有了自己的观点后，去 [practice/](../practice/) 用实验验证它。
