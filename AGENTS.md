# Harness Engineering 学习档案

> 记录我学习「Harness Engineering」的完整过程：从概念理解到独立实践。
>
> 来源：[OpenAI — Harness Engineering: Harnessing Codex in an Agent-First World](https://openai.com/zh-Hans-CN/index/harness-engineering/)

## 仓库结构

| 目录 | 内容 | 说明 |
|------|------|------|
| `concepts/` | 概念笔记 | 原文核心概念的拆解与整理 |
| `thinking/` | 独立思考 | 自己的理解、质疑、延伸思考 |
| `practice/` | 动手实践 | 小项目实验，验证文章中的方法论 |
| `feedback/` | 反馈记录 | 实践中的踩坑、修正、迭代心得 |
| `works/` | 作品输出 | 可展示的成果（文章、工具、模板等） |
| `prompts/` | 提示词积累 | 学习过程中验证有效的提示词 |
| `references/` | 外部资源 | 相关文章、仓库、工具的索引 |

## 学习路线（进度）

- [x] Phase 1：理解核心概念（concepts/，8 篇）
- [x] Phase 2：形成自己的观点（thinking/，6 篇，持续中）
- [x] Phase 3：选一个小项目实践（practice/，1 个 Ralph Demo）
- [x] Phase 4：记录反馈迭代（feedback/，1 篇，持续中）
- [x] Phase 5：输出可展示的作品（works/，12 篇翻译 + 1 篇原创）

> 进度详情以人类向 README.md 的"学习路线"段为准；本节是给智能体的快照。

## 导航

每个子目录都有自己的 AGENTS.md，说明该目录的用途、内容组织方式和写作约定。
从任何一个目录开始，都能找到下一步该看什么。

## 机械化检查

`scripts/check-consistency.sh` 守护"漂移"问题：

- **C1** — `references/articles.md` 编号 1..N 连续
- **C2** — N 与下游 4 处声明同步（README badge × 2、`prompts/deep-research-tracker.md` 头部、`references/AGENTS.md` 概览）。文件含独立行 `<!-- check-consistency: skip-count -->` 时豁免
- **C3** — `concepts/`、`thinking/`、`feedback/` 的 `*.md` 实际数与 README 中"X 篇"声明一致
- **C4** — `works/*-translation.md` 文件数 ≡ 翻译计数所有声明（badges、`<details>` 摘要、Phase 5 注释、本文件 Phase 5 快照、READMEs 表格行数）
- **C5** — README 结构树中 `concepts/` 子树的 item 行数 ≡ `concepts/*.md` 文件数（防止"计数对了但树漏了"）
- **C6** — `references/articles.md` 末尾"不计入 N 篇"中的 N ≡ C1 权威值
- **C7** — 三脉络 per-track 计数（脉络一/二/三）在 4 处下游声明保持一致：READMEs 资料库表、`references/AGENTS.md` 三脉络小标题、`prompts/deep-research-tracker.md` 三脉络明细

执行：`bash scripts/check-consistency.sh`（仓库根目录）
启用 pre-commit 阻断：`git config core.hooksPath .githooks`

**CI 兜底**：`.github/workflows/consistency.yml` 在每次 push / PR 触及受控文件时跑同一脚本。
本地 hook 是开发反馈，CI 是合并门——两层独立，本地未启用 hook 不会绕过检查。
