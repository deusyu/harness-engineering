---
name: curate-research
description: 把一批 Harness Engineering 调研候选（文章/论文/工具的 URL）走完「抓取→翻译→评审→收录→清理」流水线，整合进本仓库 works/ 与 references/articles.md，并保持 C1–C8 计数一致。当用户说"处理这批调研候选 / 收录这些链接 / 整理 translate / 把这几篇翻译收进来"时使用。这是仓库给自己用的策展 harness。
---

# curate-research —— 仓库自我策展 harness

> 一个讲 Harness Engineering 的仓库，用一个 harness 来策展自己。本 skill 把外部调研候选可控地整合进 tracked 档案。
>
> **核心约束：评审全自动；收录是人类闸门，必须停下来和用户来回讨论后才动 `works/` 与 `articles.md`。**

## 何时用

- 用户给出一批候选 URL（文章 / 论文 / 工具 / 项目），希望整合进仓库
- 用户说「处理 / 收录 / 整理」`translate/` 暂存区的翻译
- 已有 `translate/<batch>/works-ready/` 候选译文，要决定去向

## 输入与产物路径

暂存区（gitignored，本地过程区）：`translate/<batch>/`
- `sources/<slug>/source.md`（原文快照；论文额外抓 `source-full.md`）
- `translations/<slug>/{01-analysis,02-prompt,translation}.md`（过程三件套）
- `works-ready/<slug>-translation.md`（发布候选）+ `works-ready/README.md`（状态表，本批权威）

正式档案（tracked）：`works/<slug>-translation.md` + `references/articles.md` 条目。

## 流水线 6 阶段

```
①抓取 ──②翻译 ──③评审[全自动] ──🚧人类闸门🚧──④收录 ──⑤校验 ──⑥清理
```

### ① 抓取
用 `baoyu-url-to-markdown` 把每个 URL 存到 `sources/<slug>/source.md`。**论文/长文必须额外抓 HTML 全文到 `source-full.md`**（否则只有摘要页，C8 会拦谎报）。

### ② 翻译
按 baoyu-translate 配置生成 `translations/<slug>/` 三件套 → `works-ready/<slug>-translation.md`。`01-analysis.md` 要含收录建议；`source-full.md` 存在时，分析稿不得声称「仅摘要页」。

### ③ 评审（全自动并行扇出）
对每篇候选派一个评审 agent（一批 3–4 篇，并行多个 agent）。统一打分维度，吐结构化定性。**标准评审 prompt 模板：**

> 你是 Harness Engineering 中文知识库的内容评审。仓库主题：人类设计约束与反馈回路、AI agent 写代码。
> 读 `sources/<slug>/source.md`(+`source-full.md`)、`works-ready/<slug>-translation.md`、`translations/<slug>/01-analysis.md`，逐篇回答：
> - **原文价值**：原创洞察密度 / 长文实质 vs 产品页·发布稿·摘要。高/中/低
> - **翻译质量**：完整逐译 / 压缩摘要 / 首轮粗稿；通顺度、术语到位度。精品/合格/需返工
> - **与仓库契合度**：补薄弱环节还是重复
> - **一句话定性 + 建议去向**：works/ 正式收录 / articles.md 观察项一行 / tools/ / 暂不收录
> 基于实际内容，紧凑中文，结构化输出即为最终产出。

汇总成一张「候选 × 定性 × 去向」表。

### 🚧 人类闸门（不可跳过）
把评审表交给用户，**来回讨论收录决策**。精品 vs 边角的边界判断、是否返工、哪些合并成专题——都由人定。**未经用户确认，不得进入 ④。**

### ④ 收录（按减熵分流规则）
- **实质原创长文 / 论文 → `works/`**：`cp` 到 `works/<slug>-translation.md`，在 `articles.md` 加一个 `### N.` 编号条目（脉络一末尾，旧编号顺移），并**同步全部计数缓存**（见下）。
- **边角材料**（产品页 / README / 发布稿 / 短 bliki）**→ articles.md「观察项 / 候选材料（不计入文章数）」表一行**，链上游 URL，不做编号条目（文章数不变）。
- **工具类 → 只在用户实际用过后才进 `tools/`**；未实测前在观察项表标 🔵「待实测后入 tools/」。
- **需返工的长文**：先润色（事实核查加译者注 / 术语统一）再进 `works/`。

### ⑤ 校验 + 提交
- 跑 `bash scripts/check-consistency.sh`，C1–C8 必须全绿再提交。
- commit 匿名：无 `Co-Authored-By`，作者用 noreply `deusyu@users.noreply.github.com`（依赖全局 git 配置，勿覆盖）。
- push 仅在用户要求时。

### ⑥ 清理
- 删已收录 slug 的 `works-ready/<slug>-translation.md`（works/ 是权威源）。
- 删已收录 slug 的 `sources/<slug>/` + `translations/<slug>/`（过程稿，works/ 已留最终版）。
- **保留**：观察项 slug 的全部译文（articles.md 标明「留作阅读辅助」）+ 状态 README。
- 更新 `works-ready/README.md` 状态表。`translate/` 是 gitignored，清理仅本地。

## 计数同步清单（④ 的硬要求）

`references/articles.md` 是文章数与编号的**唯一权威源**。每加一个 `### N.` 条目，必须同次更新所有下游缓存，否则 `check-consistency.sh` 报错：
- README.md / README.en.md：`articles-N` badge、`translations-N` badge、目录树、脉络表（脉络一计数）、翻译 `<details>` 摘要数、翻译表格行、Phase 5 提及
- references/AGENTS.md：概览「N 篇文章」、脉络一小标题计数、文章表加行
- prompts/deep-research-tracker.md：「核心文章 N 篇」、脉络一计数、去重清单加行
- AGENTS.md：Phase 5 快照「N 篇翻译」
- works/AGENTS.md：翻译表加行
- articles.md 自身：header「N 篇（脉络一 …）」、两处「不计入 N 篇」
- **观察项一行不触发以上**（不计入 N，无 `### N.` 编号）——这是减熵分流的关键收益。

## 相关
- 减熵分流约定：见 auto-memory `feedback-harness-low-entropy-curation`
- C8 lint：`source-full.md` 存在时禁止 analysis 谎报摘要页（`scripts/check-consistency.sh`）
- 历史首批实例：articles.md #19–27（2026-06 收录的 9 篇）+ 末尾观察项表 14 行
