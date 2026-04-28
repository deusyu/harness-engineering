中文 | [English](README.en.md)

![License: MIT](https://img.shields.io/badge/license-MIT-blue)
![Articles](https://img.shields.io/badge/articles-19-green)
![Translations](https://img.shields.io/badge/translations-12-orange)

# Harness Engineering 学习指南

> 一个从概念理解到独立实践的 Harness Engineering 深度学习档案

## 前言

这是一个不断生长的学习项目。**Harness Engineering**（驭缰工程）是 OpenAI 在 2026 年 2 月提出的工程范式：工程师不再写代码，而是设计环境、明确意图、构建反馈回路，让 AI 智能体可靠地完成工作。

> **人类掌舵，智能体执行。**

本仓库记录了从阅读原文、拆解概念、形成思考、动手实践到输出作品的完整学习过程。希望对同样关注 AI 工程化的朋友有所帮助。

来源：[OpenAI — Harness Engineering: Harnessing Codex in an Agent-First World](https://openai.com/zh-Hans-CN/index/harness-engineering/)

> **注意：** 以下经验分享并非普遍适用，请在具体实践中结合场景，辩证采纳。

## ⚡ 一句话理解

```
传统工程：人类写代码 → 机器执行代码
Harness Engineering：人类设计约束 → 智能体写代码 → 机器执行代码
```

核心转变：**工程师的产出从代码变成了约束系统**——AGENTS.md、架构规则、自定义 linter、反馈回路。

## 🧭 六大核心概念

<details>
<summary><b>1. 仓库即记录系统</b> — 不在仓库里的东西，对智能体不存在</summary>

Slack 讨论、Google Docs、脑子里的知识 = 对智能体不可见。一切决策、规范、计划都必须以版本化工件提交到仓库。

→ 详见 [concepts/01-repo-as-source-of-truth.md](concepts/01-repo-as-source-of-truth.md)
</details>

<details>
<summary><b>2. 地图而非手册</b> — AGENTS.md 是目录页，不是百科全书</summary>

~100 行的入口文件，指向更深层的文档。渐进式披露：智能体从小入口点开始，被指导下一步该看什么。巨型指令文件的三个死因：挤占上下文、无法维护、无法机械验证。

→ 详见 [concepts/00-overview.md](concepts/00-overview.md)
</details>

<details>
<summary><b>3. 机械化执行</b> — 文档会腐烂，lint 规则不会</summary>

自定义 linter + 结构测试 = 不变量的守护者。lint 错误信息里内嵌修复指令，智能体可以自我纠正。在中央层面强制执行边界，在本地层面允许自主权。

→ 详见 [concepts/02-mechanical-enforcement.md](concepts/02-mechanical-enforcement.md)
</details>

<details>
<summary><b>4. 智能体可读性</b> — 优先为智能体的推理能力优化</summary>

选"无聊"技术（API 稳定、训练集覆盖好）。有时重新实现子集比包装不透明的上游行为更划算。让应用可以按 git worktree 启动。

→ 详见 [concepts/04-agent-readability.md](concepts/04-agent-readability.md)
</details>

<details>
<summary><b>5. 吞吐量改变合并理念</b> — 纠错成本低，等待成本高</summary>

PR 生命周期很短。测试偶发失败通过后续重跑解决。在智能体吞吐量远超人类注意力的系统中，这通常是正确的选择。

→ 详见 [concepts/05-throughput-changes-merge.md](concepts/05-throughput-changes-merge.md)
</details>

<details>
<summary><b>6. 熵管理 = 垃圾回收</b> — 技术债是高息贷款</summary>

智能体会复现仓库中已有的模式——包括坏模式。将"黄金规则"编码进仓库，定期后台任务扫描偏差、更新质量评分、发起重构 PR。

→ 详见 [concepts/03-entropy-and-garbage-collection.md](concepts/03-entropy-and-garbage-collection.md)
</details>

## 🔑 关键数据点

| 指标 | 数据 |
|------|------|
| 团队规模 | 3 人 → 7 人 |
| 时间跨度 | 5 个月 |
| 代码量 | ~100 万行 |
| PR 数量 | ~1,500 个 |
| 人均日 PR | 3.5 个（扩展后仍在增长） |
| 单次运行时长 | 6+ 小时（通常在人类睡眠时间） |
| 效率估算 | 手工编写的 ~1/10 时间 |

## 📂 仓库结构

```
harness-engineering/
├── README.md              ← 你在这里
├── AGENTS.md              ← 仓库导航入口（给智能体看的）
│
├── concepts/              # Phase 1：概念笔记（8 篇）
│   ├── 00-overview.md     #   六大核心概念总览
│   ├── 01-repo-as-...     #   仓库即记录系统
│   ├── 02-mechanical-...  #   机械化执行
│   ├── 03-entropy-...     #   熵管理与垃圾回收
│   ├── 04-agent-...       #   智能体可读性
│   ├── 05-throughput-...  #   吞吐量改变合并理念
│   ├── 06-harness-...     #   Harness 精确定义（Fowler 控制论扩展）
│   └── 07-spec-as-product.md #   约束即产品（Symphony 延伸）
│
├── thinking/              # Phase 2：独立思考与质疑（6 篇）
├── practice/              # Phase 3：小项目实验（1 个 Ralph Demo）
├── feedback/              # Phase 4：踩坑与迭代心得（1 篇）
├── works/                 # Phase 5：可展示的作品（12 篇翻译 + 1 篇原创）
├── prompts/               # 验证有效的提示词积累
└── references/            # 外部资源索引（19 篇文章深度摘要）
```

每个子目录都有自己的 `AGENTS.md`，说明该目录的用途和写作约定。这本身就是原文「渐进式披露」的实践。

## 🚀 学习路线

- [x] **Phase 1：理解核心概念** — 8 篇概念笔记，覆盖 OpenAI 六大概念 + Fowler 控制论扩展 + Symphony 约束即产品
- [x] **Phase 2：形成自己的观点** — 6 篇独立思考（持续中）
- [x] **Phase 3：选一个小项目实践** — Ralph Demo 完成（321 秒，$0.31）
- [x] **Phase 4：记录反馈迭代** — 1 篇（持续中）
- [x] **Phase 5：输出可展示的作品** — 12 篇专业翻译 + 1 篇原创综合分析

## 📚 研究资料库

跨三条知识脉络 19 篇文章 + 3 篇延伸阅读：

| 脉络 | 覆盖 | 核心视角 |
|------|------|---------|
| AI 时代的 Harness Engineering | 16 篇 | OpenAI → Fowler → Anthropic → LangChain → Stanford |
| 云原生 Harness.io | 2 篇 | CI/CD 平台架构（同名不同义的参照） |
| 效率悖论与能力进化 | 1 篇 | YDD 系统性拆解：约束理论 + Spec/Rule/Skill |
| 延伸阅读 | 3 篇 | Mitchell Hashimoto、Context Engineering、人机协作 |

详见 [references/articles.md](references/articles.md) — 每篇文章含核心论点、关键数据、跨文章关联的深度摘要。

## 📖 翻译作品

<details>
<summary><b>12 篇核心文章的中文翻译</b>（点击展开）</summary>

| 作品 | 原作者 | 来源 |
|------|--------|------|
| ⭐ [渴望了八年，用 AI 三个月造出来](works/maganti-eight-years-building-ai-translation.md) | Lalit Maganti | 个人博客 |
| [Inside the Scaffold 论文](works/inside-the-scaffold-paper-translation.md) | Benjamin Rombaut | Huawei / arXiv |
| [Meta-Harness 论文](works/meta-harness-paper-translation.md) | Yoonho Lee 等 | Stanford / arXiv |
| [Harness Engineering 正式版](works/fowler-harness-engineering-full-translation.md) | Birgitta Böckeler | Martin Fowler |
| [Harness Engineering 备忘录](works/fowler-harness-engineering-memo-translation.md) | Birgitta Böckeler | Martin Fowler |
| [Encoding Team Standards](works/fowler-encoding-team-standards-translation.md) | Rahul Garg | Martin Fowler |
| [Feedback Flywheel](works/fowler-feedback-flywheel-translation.md) | Rahul Garg | Martin Fowler |
| [Scaling Managed Agents](works/anthropic-managed-agents-translation.md) | Lance Martin 等 | Anthropic |
| [Agent Evaluation Checklist](works/langchain-agent-evaluation-checklist-translation.md) | LangChain 团队 | LangChain |
| [Agent-driven Development](works/github-agent-driven-development-translation.md) | Tyler McGoffin | GitHub |
| [Continual Learning](works/langchain-continual-learning-translation.md) | Harrison Chase | LangChain |
| [Codex 编排开源规范 Symphony](works/openai-codex-symphony-translation.md) | Kotliarskyi 等 | OpenAI |

</details>

## 🔗 相关项目与资源

### 原始来源

| 资源 | 说明 |
|------|------|
| [OpenAI 原文（中文）](https://openai.com/zh-Hans-CN/index/harness-engineering/) | Harness Engineering 的完整阐述 |

### Ralph 系列 — Harness Engineering 的实战框架

「Ralph Wiggum 循环」是 Harness Engineering 的核心实现模式：让智能体在循环中自主工作直到任务完成。

| 项目 | Stars | 说明 |
|------|-------|------|
| [snarktank/ralph](https://github.com/snarktank/ralph) | 13.6k | 原版 Ralph：bash 脚本反复启动 AI，每次迭代清空上下文，直到 PRD 全部完成。6 条核心信条（Fresh Context、Backpressure、Plan Is Disposable 等） |
| [ralph-orchestrator](https://mikeyobrien.github.io/ralph-orchestrator/) | 2.3k | Rust 进化版：Hat 角色系统 + 事件驱动协调 + 多后端（Claude/Kiro/Gemini/Codex）+ 背压门控 + 持久化记忆 |
| [bmad-ralph](https://github.com/qianxiaofeng/bmad-ralph) | 2 | BMAD 方法论 + Ralph：并行 Claude Code worktree + 三层自愈（retry → restart → diagnose）+ SQLite 状态机 |

### Ralph 六条信条（与 Harness Engineering 的映射）

| Ralph 信条 | Harness Engineering 对应概念 |
|-----------|---------------------------|
| Fresh Context Is Reliability | 智能体可读性 — 每次迭代重新读取 |
| Backpressure Over Prescription | 机械化执行 — 不规定怎么做，但门控拒绝坏结果 |
| The Plan Is Disposable | 熵管理 — 重新生成的成本只是一次 planning loop |
| Disk Is State, Git Is Memory | 仓库即记录系统 — 文件是交接机制 |
| Steer With Signals, Not Scripts | 人类掌舵 — 加路标，不加脚本 |
| Let Ralph Ralph | 智能体执行 — 坐在循环上，不坐在循环里 |

### 社区与延伸

| 资源 | 说明 |
|------|------|
| [vibe-coding-cn](https://github.com/tukuaiai/vibe-coding-cn) | 中文 Vibe Coding 社区指南 |
| [Mitchell Hashimoto: Engineer the Harness](https://mitchellh.com/writing/my-ai-adoption-journey#step-5-engineer-the-harness) | "Harness" 概念的另一个起源 |

## 🛠️ 开发须知

仓库自带一致性检查脚本 `scripts/check-consistency.sh`，守护数量类漂移，覆盖七层校验：

- **C1-C2** — `references/articles.md` 文章数 + 下游 4 处引用（README × 2 badges、`prompts/deep-research-tracker.md` 头部、`references/AGENTS.md` 概览）
- **C3** — `concepts/` / `thinking/` / `feedback/` 三个目录的 `*.md` 实际数与 README "X 篇" 声明一致
- **C4** — `works/*-translation.md` 文件数与各处翻译计数声明一致（badges、表格摘要、Phase 5 注释、AGENTS 快照、表格行数）
- **C5** — README 结构树的 `concepts/` 子树列出每一个 `concepts/*.md` 文件
- **C6** — `references/articles.md` 末尾"不计入 N 篇"的 N 与 C1 权威值一致
- **C7** — 三脉络（脉络一/二/三）的 per-track 计数在 4 处下游声明（READMEs 资料库表 × 2、`references/AGENTS.md` 三脉络小标题、`prompts/deep-research-tracker.md` 三脉络明细）保持一致

**首次 clone 后启用 pre-commit hook：**

```bash
git config core.hooksPath .githooks
```

启用后，每次 commit 涉及 README、`AGENTS.md`、`references/articles.md`、`references/AGENTS.md`、`prompts/deep-research-tracker.md`、或 `concepts/` / `thinking/` / `feedback/` / `works/` 中的 `*.md` 时会自动跑检查；不涉及则不打扰。

**手动跑：** `bash scripts/check-consistency.sh`

**CI 兜底：** 即使本地未启用 hook，GitHub Actions（`.github/workflows/consistency.yml`）会在每次 push / PR 触及受控文件时跑同一脚本。本地 hook 是开发期反馈，CI 才是真正的合并门。

详情见根 `AGENTS.md` 的"机械化检查"段。

## 🤝 参与贡献

欢迎通过 Issue 和 PR 参与：
- 补充概念笔记（`concepts/` 中还有待补充的概念）
- 分享你的独立思考（`thinking/`）
- 贡献实践案例（`practice/`）
- 推荐相关资源（`references/`）

## 📞 联系方式

| 渠道 | 链接 |
|------|------|
| GitHub | [@deusyu](https://github.com/deusyu) |
| X (Twitter) | [@0xdeusyu](https://x.com/0xdeusyu) |
| Telegram | [@DeusThink](https://t.me/DeusThink) |
| Telegram 交流群 | [@talkdeusyu](https://t.me/talkdeusyu) |
| Telegram 频道 | [@lovedesuyu](https://t.me/lovedesuyu) |
| Email | [rainman.deus@gmail.com](mailto:rainman.deus@gmail.com) |

## Star History

如果这个项目对您有帮助，请考虑为其点亮一颗 Star ⭐！

[![Star History Chart](https://api.star-history.com/svg?repos=deusyu/harness-engineering&type=Date)](https://star-history.com/#deusyu/harness-engineering&Date)

## 📄 License

MIT
