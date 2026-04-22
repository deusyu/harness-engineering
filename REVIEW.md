# 仓库 Review 计划

> 目标：为 `harness-engineering` 仓库建立一套可重复执行的 review 流程，优先发现会影响导航、事实一致性、可复现性和长期维护的缺陷。
>
> 本文同时记录当前已经确认的问题，后续可作为修复清单使用。

## 修复执行状态（2026-04-21 更新）

| ID | 问题 | 状态 | 处理方式 |
|----|------|------|---------|
| P1-1 | 文章索引 / 研究 Prompt 权威基线分叉 | ✅ 已修复 | `articles.md` 加权威头 + 定义计数规则；`deep-research-tracker.md` 内嵌清单维持权威基线但加同步纪律；`references/AGENTS.md` 概览表同步 18 篇 + 1 项产品的新结构；READMEs/AGENTS 中"5 篇 thinking"→"6 篇" |
| P1-2 | `practice/01-ralph-demo/` 不满足三件套约定 | 📌 TODO（已延期） | 用户决定（2026-04-22）暂不处理，留待后续批次。两个候选方案：A 补齐 `wc.py` / `test_wc.py` / `AGENTS.md` 让实验真的可复现；B 改 `practice/AGENTS.md` 把"代码 + AGENTS"改为可选并新增"实验报告 / 可复现实验"分类。**当下 `practice/` 不参与 `scripts/check-consistency.sh` 的 C3 检查**，避免阻塞主线 |
| P2 | README ↔ 根 AGENTS Phase 状态漂移 | ✅ 已修复 | 根 `AGENTS.md` 全部 `[ ]` → `[x]`，并加"以 README 为准"的快照说明 |
| P3 | `thinking/` 数量过期（5 → 6） | ✅ 已修复 | `README.md` / `README.en.md` 同步更新 |

**额外处理（不在原 4 项内，但属于本轮发现的伴生问题）：**

- ✅ `concepts/AGENTS.md` 契约松绑：从强制三段式 → 分层建议 + 2 条硬约束（演化为多源综合后的现实对齐）
- ✅ `prompts/AGENTS.md` 契约扩展：接受"单条 Prompt"和"Prompt 工作流"两种合法形态
- ✅ `works/`、`prompts/`、`references/` 的 `AGENTS.md` 补齐"下一步"段落，兑现根导航承诺
- ✅ `articles.md` 计数确定性：移除占位"未找到"条目、把产品级条目（Chachamaru127）迁出文章编号，使 `### N.` 数 = 18 = 文章总数

详细问题描述见下文（保留作为审计轨迹）。

## 1. Review 范围

### In Scope

- 仓库根文档：`README.md`、`README.en.md`、`AGENTS.md`
- 正式内容目录：
  - `concepts/`
  - `thinking/`
  - `practice/`
  - `feedback/`
  - `works/`
  - `prompts/`
  - `references/`

### Out of Scope

- `translate/`
  - 这是翻译工作区，不纳入正式内容仓库的 review 结论
- 临时或本地工作目录
  - 例如未纳入正式导航体系的隐藏目录或个人工作缓存

## 2. Review 目标

本仓库不是传统代码仓库，因此 review 的重点不是运行时 bug，而是以下四类问题：

1. **导航失真**
   - 根入口和子目录说明是否一致
   - “从哪里开始读、下一步去哪”是否稳定清晰

2. **事实漂移**
   - README、AGENTS、索引、Prompt 中的数量、状态、阶段描述是否一致
   - 是否存在多个“看起来像权威”的版本

3. **可复现性不足**
   - `practice/` 中的实验是否真的能被复跑
   - 仓库是否保存了完成实验所需的最小工件

4. **机械化维护不足**
   - 哪些问题现在只能靠人工发现
   - 哪些问题值得后续做成 lint / 自检脚本

## 3. Review 执行顺序

建议按下面 5 步执行，每一步都能独立产出问题清单。

### Step 1：冻结“权威来源”

先明确每类信息的唯一 source of truth，避免 review 本身继续放大漂移。

- 目录用途：以各目录的 `AGENTS.md` 为准
- 文章索引：以 `references/articles.md` 为准
- 对外展示文案：以 `README.md` / `README.en.md` 为准
- 研究 prompt 的去重基线：不得手写复制，应从索引同步

### Step 2：做结构与导航审查

检查以下内容：

- 根 README 与根 `AGENTS.md` 是否描述了同一套正式目录
- 各子目录 `AGENTS.md` 是否真的能回答：
  - 这里放什么
  - 文件如何命名
  - 下一步看哪里
- 是否存在“目录已存在，但导航体系没承认”或“导航承诺了，但目录内容未兑现”

### Step 3：做元数据一致性审查

重点检查：

- Phase 勾选状态
- 文档数量统计
- badge 数字
- 中英文 README 的同步性
- Prompt 中引用的资料统计是否与 `references/articles.md` 一致

### Step 4：做内容约定审查

按目录逐一检查：

- `concepts/`：编号、顺序、概念覆盖是否完整
- `thinking/`：文章数、主题描述是否与 README 一致
- `practice/`：实验是否符合“README + AGENTS + 代码”的约定
- `feedback/`：是否真正形成反馈闭环并回链到其他目录
- `works/`：展示型内容是否可独立理解
- `prompts/`：是否只收录已验证内容
- `references/`：是否仍然扮演“索引”而不是“第二内容库”

### Step 5：把高频问题变成机械检查

适合后续自动化的检查项：

- README/AGENTS/索引中的数量是否一致
- 正式内容目录是否都出现在根导航
- `practice/*` 是否都包含规定文件
- `references/articles.md` 更新后，相关 prompt 是否同步更新

## 4. 当前已确认的问题

以下问题已通过本次审查确认。

### P1：文章索引和研究 Prompt 的“权威基线”已经分叉

这是当前最重要的问题，因为它会影响后续研究、去重和收录判断。

#### 证据

- `README.md` 写“跨 15 篇核心文章 + 3 篇延伸阅读”，但表格分项又写成：
  - AI 时代 Harness Engineering：15 篇
  - 云原生 Harness.io：3 篇
  - 延伸阅读：3 篇
- 对应位置：
  - `README.md:130-136`
  - `README.en.md:131-137`
- `references/AGENTS.md` 仍写“18 篇文章的深度摘要”
  - `references/AGENTS.md:12`
- `prompts/deep-research-tracker.md` 的 Prompt A 又写成：
  - 脉络一：15 篇
  - 脉络二：2 篇
  - 脉络三：1 篇
  - `prompts/deep-research-tracker.md:60-78`
- 但 `references/articles.md` 实际已经有独立的：
  - 脉络二：云原生时代的 Harness.io
  - 脉络三：效率悖论与能力进化
  - `references/articles.md:445-470`

#### 风险

- Deep Research 去重基线会错
- README 对外展示的数据不可信
- 后续新增资料时，不知道应该更新哪一处

#### 修复建议

1. 明确 `references/articles.md` 是文章分类与数量的唯一权威来源
2. README 和 Prompt 不再手写分项数量，改为引用式描述
3. 如果必须保留数字，统一由一次脚本生成

### P1：`practice/` 的实际内容没有满足自己的目录约定

这是“方法论一致性”问题，不是格式细节。

#### 证据

- `practice/AGENTS.md` 规定每个实验应包含：
  - `README.md`
  - `AGENTS.md`
  - 代码
  - `practice/AGENTS.md:7-9`
- 当前仓库中的 `practice/01-ralph-demo/` 只有 `README.md`
- `practice/01-ralph-demo/README.md` 描述的实验还是在 `/tmp/ralph-demo` 中执行：
  - `practice/01-ralph-demo/README.md:27-30`
- README 中展示了 `wc.py`、`test_wc.py` 和 `.ralph/agent/scratchpad.md` 片段，但这些工件没有作为仓库文件保存：
  - `practice/01-ralph-demo/README.md:79-171`

#### 风险

- 读者无法真正复跑实验
- “repo as system of record”的实践说服力被削弱
- 后续新增实验时，不知道是按“案例记录”还是按“可复现实验”来做

#### 修复建议

二选一即可：

1. **走可复现实验路线**
   - 给 `practice/01-ralph-demo/` 补上 `AGENTS.md`
   - 将最小可复现工件纳入仓库
   - 明确哪些文件是生成物，哪些是手写约束

2. **走案例记录路线**
   - 修改 `practice/AGENTS.md` 的目录约定
   - 明说当前内容是“实验报告”，不是“完整可复现实验目录”

### P2：面向人类的 README 与面向智能体的 AGENTS 状态不同步

#### 证据

- `README.md` 已将 5 个 Phase 全部标记为完成：
  - `README.md:122-126`
- 根 `AGENTS.md` 仍将 5 个 Phase 全部标记为未完成：
  - `AGENTS.md:21-25`

#### 风险

- 人类读者和智能体看到的是两套不同状态
- 智能体可能据此错误判断仓库成熟度或下一步动作

#### 修复建议

- 统一 Phase 状态
- 若二者服务不同目的，应在文档中明确说明差异，而不是默默漂移

### P3：`thinking/` 的数量说明已经过期

#### 证据

- `thinking/AGENTS.md` 已列出 6 篇文章：
  - `thinking/AGENTS.md:16-21`
- 但 `README.md` 仍写：
  - “Phase 2：独立思考与质疑（5 篇）”
  - “5 篇独立思考”
  - `README.md:110`
  - `README.md:123`
- `README.en.md` 也仍写 5 篇：
  - `README.en.md:111`
  - `README.en.md:124`

#### 风险

- README 的统计口径不再可信
- 中英文 README 会持续积累微漂移

#### 修复建议

- 同步更新中英文 README
- 若未来数量会频繁变化，建议改成不写死数量

## 5. 建议的修复优先级

推荐按下面顺序处理：

1. **先修 P1：权威基线分叉**
   - 这是全仓库最容易继续扩散的问题

2. **再修 P1：`practice/` 约定与现实不一致**
   - 这是方法论可信度问题

3. **再修 P2：Phase 状态漂移**
   - 这是导航和语义层的不一致

4. **最后修 P3：README 数量过期**
   - 成本低，但应和前面一起顺手收敛

## 6. 建议补充的机械检查

如果后续要把 review 变成仓库能力，建议新增一个最小自检脚本，检查：

- `README.md` / `README.en.md` / `AGENTS.md` 中的 Phase 状态是否一致
- `thinking/`、`works/`、`references/` 的数量声明是否与实际文件匹配
- `practice/*` 是否满足目录约定
- `prompts/deep-research-tracker.md` 中的资料基线是否与 `references/articles.md` 同步

### 落地状态（2026-04-22 更新）

`scripts/check-consistency.sh` 已落地，覆盖三条最高频的"数字漂移"检查：

| 检查 | 范围 | 状态 |
|------|------|------|
| C1 | `articles.md` 编号 1..N 连续 | ✅ 已落地 |
| C2 | `articles.md` 的 N 与 README badge × 2 + `deep-research-tracker.md` 头部 + `references/AGENTS.md` 概览同步（含 `<!-- check-consistency: skip-count -->` 豁免） | ✅ 已落地 |
| C3 | `concepts/`、`thinking/`、`feedback/` 的 `*.md` 数与 README "X 篇"声明一致 | ✅ 已落地 |
| — | Phase 状态一致性（README ↔ AGENTS） | ⏳ 未落地，留待 v2 |
| — | `practice/*` 目录约定检查 | ⏳ 未落地（依赖 P1-2 决策） |
| — | `works/` / `references/` 的篇数声明（结构复杂，分类多元） | ⏳ 未落地，留待 v2 |

**启用方式：** `git config core.hooksPath .githooks`（pre-commit hook 在涉及上述受控文件时自动触发）。
**手动执行：** `bash scripts/check-consistency.sh`。

## 7. 本次 Review 的结论

当前仓库的主要问题不是“内容缺失”，而是“内容越来越多后，索引和约定开始漂移”。

这很像 Harness Engineering 本身要解决的那个问题：

- 内容已经不少
- 结构也基本成型
- 但还缺少一层机械化的自校验

换句话说，这个仓库最值得补的，不是再多写一篇文章，而是先把“仓库如何保持自洽”这件事编码进去。
