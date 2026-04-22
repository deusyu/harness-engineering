# 分阶段 Review 执行报告

> 执行依据：`REVIEW.md`
> 执行日期：2026-04-21
> 范围：仅覆盖正式内容仓库；`translate/` 明确排除在外

## 修复执行状态（同日更新）

本报告原定为"问题发现报告"。同日已对其中 7 项中的 6 项做了修复；下表为状态映射，详情见 `REVIEW.md` 头部的执行状态段。

| 问题 # | 描述 | 状态 |
|--------|------|------|
| 1 | 文章索引基线分叉 | ✅ 已修复（`articles.md` 加权威头 + 计数规则；`deep-research-tracker.md` 内嵌清单维持外部可用性 + 加同步纪律；`references/AGENTS.md` 同步） |
| 2 | 根导航承诺"下一步"未兑现 | ✅ 已修复（`works/`、`prompts/`、`references/` 的 AGENTS 都补了"下一步"） |
| 3 | `practice/` 不满足最小结构要求 | 📌 TODO（已延期，2026-04-22 用户决定暂不处理；详见 `REVIEW.md` 状态表 P1-2） |
| 4 | README ↔ AGENTS Phase 状态漂移 | ✅ 已修复（根 AGENTS 对齐 README） |
| 5 | `thinking/` 数量过期 | ✅ 已修复（中英文 README 同步 6 篇） |
| 6 | `concepts/` 文件骨架与约定不一致 | ✅ 已修复（松绑 `concepts/AGENTS.md` 契约：早期单源 vs 后期多源） |
| 7 | `prompts/` 文件不满足字段约定 | ✅ 已修复（扩展 `prompts/AGENTS.md` 契约：单条 Prompt + Prompt 工作流两种形态） |

**Phase 5 建议的 6 条机械检查仍待落地**——这是下一步真正要补的能力（避免本类漂移再次发生）。

下文保留原报告内容作为审计轨迹。

## 总览

本轮按 `REVIEW.md` 的 5 个阶段执行了 review。

| 阶段 | 目标 | 状态 | 结论 |
|------|------|------|------|
| Phase 1 | 冻结权威来源 | 已完成 | “哪份文件说了算”仍未统一，尤其是文章索引与研究 Prompt |
| Phase 2 | 结构与导航审查 | 已完成 | 主干结构清晰，但导航闭环没有完全落地 |
| Phase 3 | 元数据一致性审查 | 已完成 | Phase 状态、数量统计、badge 数字存在漂移 |
| Phase 4 | 内容约定审查 | 已完成 | `concepts/`、`practice/`、`prompts/` 都有“规范已写，但文件未完全遵守”的问题 |
| Phase 5 | 机械化检查建议 | 已完成 | 已整理为一组适合脚本化的最小检查项 |

## Phase 1：权威来源审查

### 当前观察到的事实基线

- `concepts/`：7 篇概念笔记
- `thinking/`：6 篇独立思考
- `practice/`：1 个实验目录
- `feedback/`：1 篇反馈记录
- `works/`：12 篇作品
  - 其中 11 篇翻译
  - 1 篇原创综合文章
- `prompts/`：1 个 Prompt 文件
- `references/`：1 个主索引文件 `articles.md`

### 结论

“文章数量”和“资料分类”的权威来源还没有冻结下来。

#### 已确认问题 1：文章索引基线分叉

这仍然是当前最严重的问题。

#### 证据

- `README.md:3-5` 显示 badge：`articles-18`、`translations-11`
- `README.md:130-136` 将资料库描述为三条脉络，但分项数字本身不可互相推出统一总数
- `README.en.md:4` 与 `README.en.md:131-137` 延续了同样的问题
- `references/AGENTS.md:12` 仍写“18 篇文章的深度摘要”
- `prompts/deep-research-tracker.md:60-78` 把 Prompt A 的去重权威写成“约 18 篇”，并手写为 15 / 2 / 1
- `references/articles.md:445-470` 已经明确存在独立的“脉络二”和“脉络三”

#### 判断

目前仓库里至少同时存在三套“看起来像权威”的说法：

1. README / README.en 的展示口径
2. `references/AGENTS.md` 的索引口径
3. `prompts/deep-research-tracker.md` 的研究去重口径

这会直接影响后续资料收录和研究提示词的准确性。

## Phase 2：结构与导航审查

### 结论

仓库的主干目录是清楚的，但“渐进式披露”的导航承诺没有完全闭环。

#### 已确认问题 2：根导航承诺了“下一步”，但并非所有子目录都真的提供

#### 证据

- 根 `AGENTS.md:27-30` 写明：
  - 每个子目录都有自己的 `AGENTS.md`
  - 从任何一个目录开始，都能找到下一步该看什么
- `concepts/AGENTS.md`、`thinking/AGENTS.md`、`practice/AGENTS.md`、`feedback/AGENTS.md` 都有明确“下一步”段落
- 但以下目录没有显式“下一步”：
  - `works/AGENTS.md:1-39`
  - `prompts/AGENTS.md:1-19`
  - `references/AGENTS.md:1-70`

#### 判断

这不是严重 bug，但属于导航契约没有完全兑现。对人类读者问题不大，对智能体则意味着“有些目录是流程节点，有些目录是终点站”没有被明确表达。

#### 已确认问题 3：`practice/` 的实验目录没有满足自己的最小结构要求

#### 证据

- `practice/AGENTS.md:7-9` 规定每个实验包含：
  - `README.md`
  - `AGENTS.md`
  - 代码
- 但 `practice/01-ralph-demo/` 当前只有：
  - `README.md`
- `practice/01-ralph-demo/README.md:27-30` 明确实验是在 `/tmp/ralph-demo` 里运行
- `practice/01-ralph-demo/README.md:79-171` 只保留了 `wc.py`、`test_wc.py`、`scratchpad.md` 的展示片段，没有把最小可复现工件纳入仓库

#### 判断

这里的问题不是“少了几个文件”，而是仓库对 `practice/` 的定义还没定下来：

- 是“实验报告”目录
- 还是“可复现实验”目录

现在两种意图混在了一起。

## Phase 3：元数据一致性审查

### 结论

这部分的问题不在内容本身，而在“状态描述”和“数量描述”开始漂移。

#### 已确认问题 4：README 与 AGENTS 的 Phase 状态不一致

#### 证据

- `README.md:122-126` 将 5 个 Phase 全部标记为完成
- 根 `AGENTS.md:21-25` 仍将 5 个 Phase 全部标记为未完成

#### 判断

这是面向人类和面向智能体的双轨状态漂移。对普通读者只是小瑕疵，对智能体则会影响其对仓库成熟度的判断。

#### 已确认问题 5：`thinking/` 的数量说明已经过期

#### 证据

- `thinking/AGENTS.md:16-21` 已列出 6 篇文章
- `README.md:110` 与 `README.md:123` 仍写 5 篇
- `README.en.md:111` 与 `README.en.md:124` 也仍写 5 篇

#### 判断

这是最典型的“文档会腐烂”案例：目录本身已更新，但总览页没有同步。

## Phase 4：内容约定审查

### 结论

当前最明显的问题不是“内容差”，而是“目录约定写出来了，但文件结构没有稳定遵守”。

#### 已确认问题 6：`concepts/` 的文件骨架与目录约定不一致

#### 证据

- `concepts/AGENTS.md:7-9` 规定结构应为：
  - 原文要点
  - 关键实践
  - 原文引用
- `concepts/01-repo-as-source-of-truth.md:3-42` 只有“原文要点 / 文档结构 / 关键实践”，没有显式“原文引用”
- `concepts/02-mechanical-enforcement.md:3-44` 连一级标题命名也已偏离约定，使用的是“核心思想 / 两类约束 / 哲学”
- 从全目录检查结果看，只有少数文件保留了“原文要点 / 关键实践”的显式骨架，而“原文引用”几乎没有落成统一模板

#### 判断

这会削弱 `concepts/` 的“可预期性”。当智能体进入这个目录时，`AGENTS.md` 承诺的是一种稳定骨架，但实际文件在逐步自由生长。

#### 已确认问题 7：`prompts/` 的文件没有满足自己的字段约定

#### 证据

- `prompts/AGENTS.md:7-9` 规定每个提示词文件包含：
  - 用途
  - 提示词正文
  - 效果评价（好 / 中 / 差）
  - 改进记录
- `prompts/deep-research-tracker.md:1-240` 实际是一个三段式工作流文档：
  - Prompt A
  - Prompt B
  - Prompt C
  - 工作流总结
- 文档中虽然有“用途”和完整 prompt 正文，但没有显式“效果评价”与“改进记录”段落

#### 判断

这说明 `prompts/` 目前更像“高价值 Prompt 工作流仓库”，而不是 `AGENTS.md` 里定义的“只收录已验证 Prompt 卡片”的目录。

## Phase 5：适合机械化的检查项

基于前 4 个阶段，建议后续最先脚本化下面 6 条检查：

1. 根 `README.md`、`README.en.md`、`AGENTS.md` 的 Phase 勾选状态是否一致
2. `thinking/`、`works/`、`references/` 的数量声明是否仍与实际文件匹配
3. `references/articles.md` 更新后，`prompts/deep-research-tracker.md` 中的研究基线是否同步
4. `practice/*` 是否都满足最小目录结构要求
5. `concepts/*` 是否都满足统一骨架要求
6. `prompts/*` 是否都包含“效果评价”和“改进记录”

## 建议的修复批次

为了降低改动风险，建议按下面顺序做：

### Batch 1：先修“权威来源”

- 收敛文章数量和分类口径
- 统一 README / Prompt / references 的资料基线

### Batch 2：再修“目录约定”

- 先决定 `practice/` 到底是“实验报告”还是“可复现实验”
- 再决定 `prompts/` 到底是“Prompt 卡片库”还是“Prompt 工作流库”
- 再统一 `concepts/` 的文件骨架

### Batch 3：最后修“导航体验”

- 统一 Phase 状态
- 修正 README 中的数量漂移
- 补齐 `works/`、`prompts/`、`references/` 是否需要显式“下一步”

## 本轮 Review 结论

仓库现在最需要的不是“继续加内容”，而是先把这些内容的元结构稳住。

更具体地说，当前已经出现了两类典型漂移：

1. **事实漂移**
   - 数量、Phase、资料分类开始各写各的

2. **结构漂移**
   - 目录规范已经写出来，但具体文件没有稳定遵守

这两类问题都很适合下一步做成机械检查。对一个专门研究 Harness Engineering 的仓库来说，这反而是很值得补的一环。
