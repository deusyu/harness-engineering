# DSH 的三层读法：插件商店、训练分布、攻击面

> 触发：DeepSeek 于 2026-08-13 开源 DeepSeek Harness（dsh）v0.1 开发者预览版（[官网](https://www.deepseek.com/harness/zh/) / [github](https://github.com/deepseek-ai/deepseek-harness)，MIT）。观察项条目见 [references/articles.md](../references/articles.md)。
> 对照对象：#31/#40 HaaS、#37 "harness 拥有 loop"、#50 遏制、#57 harness 一等对象、#60/#62 训练分布机制、#2 Harnessability 与模板分叉。
> 日期：2026-08-14。发稿时点的事实快照：`dsh-plugin` topic 上线次日约 1.5k 仓库、主仓约 8 万 star——数字会变，判断不押在数字上。

---

## 论点

dsh 至少要用三层来读，三层是同心圆：**插件商店**是外环（拉开发者），**训练分布**是轴心（锁模型-harness 配对），**攻击面**是账单（商店架构的安全代价）。"旧瓶新酒"的第一直觉成立——瓶子甚至比想象的更旧——但酒有两种，第二种才是厂商真正在酿的。

---

## 读法一：商店论——瓶子考古

这一层先由直觉得出，后被证据字面证实：dsh 首先是一个市场。

- **瓶子的年轮。** Cordis（2022）是国内聊天机器人框架 Koishi（2019）抽出的内核，插件市场剧本在 Koishi 生态跑了多年；HN 讨论里有人直接点破"Cordis 已经在 Koishi 里用了四年（v3），今天随 dsh 一起发的是 v4 论文"。DeepSeek 2026 年 3 月挖来 Cui Tianyi（前 Jane Street）组建 harness 团队（SCMP 报道），发布前先跑了一轮**插件开发者内测**、允许内测插件迁到个人账号公开——生态是种好了才开门的。
- **市场机制清单。** `dsh-plugin` GitHub topic（次日约 1.5k 仓库，含明显蹭 tag 的——蹭 tag 本身就是市场引力的证据）、内置百余官方插件、预留 Plugin Store、半官方 `dsh-external` org、社区自发的 awesome 清单×2、每 8 小时对 mainline 跑一轮接口漂移检查的兼容性雷达。
- **剧本对号。** 量子位的定性是"Agent 时代的安卓"。结构与 VSCode 相同：运行时免费开源，市场是护城河。

商店论解释"为什么开源"：DeepSeek 没有 Cursor / Claude Code 那样的分发面，垂直整合拼不过，把长尾外包给生态是弱势方的最优解。

## 读法二：训练分布论——商店只是外环

但商店论解释不了一个细节：为什么把 **Minimal 模式**（bash + `str_replace_editor` 双工具）做成一等公民，而且 V4-Flash 的官方发布分数（Terminal-Bench 2.1 82.7 等，厂商口径）就是用它跑的——harness 在模型发布公告里先当了两周的"to be released soon"脚注。把三件已知的事连起来：

1. **#62（Ronacher）**：在某个宽容 harness 里做 RL，新模型对替代 schema 的表现反而更差——工具 schema 不是中立的；
2. **#60（Cursor）**：按训练分布供给工具格式，是 harness 运维的明规则；
3. **Codex 侧先例**（经 Simon Willison 记录的 OpenAI 内部说法）："Codex models are trained in the presence of the harness."

推论：如果 DeepSeek 下一代模型对着 dsh 的 schema 与事件环做 RL，dsh 就是 DeepSeek 模型表现最好的地方。用户侧已有印象级证据——量子位实测的结论是"DSH 驾驭下，模型的长程任务能力会强非常非常多；自家模型肯定优先搭配自家 Harness"。此时插件生态的每个开发者都在**无偿加固这个训练分布**：商店拉来的流量，最终沉淀成模型-harness 配对的私有闭环。这一层 Koishi 剧本里没有，是真正的新酒。

顺带一个对 #37 的修正。#37 说"Model 在 loop 里，harness 拥有 loop"；dsh 把 loop 本身也做成插件，loop 的所有权下放到配置层。这不是推翻 #37，而是把"谁拥有 loop"从产品问题改写成市场治理问题：官方 loop 只是默认件，但默认件正是训练分布所在——你可以换掉它，换掉的代价是离开模型的舒适区。可替换性与配对锁定并不矛盾，反而互为掩护。

## 读法三：商店即攻击面——检索捞出的账单

第三方安全审计（40 条攻击路径、96 处 file:line 引证、13 个可复现 demo，[Discussion #454](https://github.com/deepseek-ai/deepseek-harness/discussions/454)）的结论几乎为商店论量身定做：dsh 的信任结构**双轴不对称**——

| 信任轴 | 现状 |
|---|---|
| Axis A：agent 行为 | 生产级——fail-closed 审批、进程沙箱、凭据引用模型、append-only 审计、浏览器混淆代理人围栏 |
| Axis B：插件代码 | 零安全设计——宿主进程内执行、boot 期可改写 approval/sandbox 策略、安装/更新/热载全程无签名与来源校验、卸载不清持久化后门 |

对**模型**的防御认真做过（这正是 harness engineering 的正题），对**插件供应链**的防御还不存在。[Discussion #587](https://github.com/deepseek-ai/deepseek-harness/discussions/587) 的对照更扎眼：Codex / Claude Code / Gemini CLI 普遍把可执行扩展放进程外、显式审批门控；dsh 是当下唯一让第三方代码在核心进程内加载、且能在运行时防护激活前改写安全配置树的主流 harness。

"可逆插件脊柱"的架构收益（任何一层都能换）与这个攻击面是**同一枚硬币**：市场的开放度就是攻击面的开放度。#50 的表述在此完全适用——白名单是能力授予，而一个无签名的插件市场是批发式的能力授予。

## 工程实质盘点（防止读成纯商业动作）

- "There is no privileged core to patch"；"model-visible means logged" 是运行时不变量（模型看到的任何东西必须能从 append-only log 重建）
- capability seam 设计：换一个 filesystem/subprocess provider，Bash/PTY/LSP 整体迁进远程沙箱，无需 fork provider
- Minimal 模式 = #35/#59/#67 一直想要的"固定最小 harness"评测对照组，第一次由厂商内置且用于自家发布分数；与之对照，仓库里的 `BENCHMARK.md` 只有三行、全树零 eval 主张——克制还是缺口，两读都成立
- 第三方代码阅读的测量：约 453K 行 TypeScript、约 219 个 workspace 包；replay-driven testing 与 fail-closed sandbox 被点名"值得偷"
- 黑色幽默一则：社区从提交记录扒出 dsh 相当比例的 commit/PR 出自 Codex 工作树（未独立核实）——DeepSeek 的 harness 有一部分是 OpenAI 的 agent 写的

## 可证伪清单

1. **60 天插件存活率**：topic 数是噪声，接口漂移下还活着的插件数才是信号（社区兼容性雷达是现成的测量仪）
2. **schema 收敛**：如果插件作者逐渐收敛到模仿官方 schema 形状，训练分布论的惩罚机制（#62）就在现场发生
3. **dsh 内外分差**：DeepSeek 模型在 dsh 与 Codex CLI / Claude Code 下的分差若随版本拉大，训练分布论坐实
4. **安全 P0 的落地速度**：插件签名/进程外扩展若三个月内不落地，说明商店增长优先级高于安全——商店论的反向实证
5. **熵能否真的甩掉**：插件卸载"回卷副作用"是 dsh 对熵管理的架构赌注；对照 #2 对 harness 模板分叉/同步成本的预言，兼容雷达的存在本身已经是分叉成本的实证

## 开放问题

- 商店的治理权在哪？Koishi 剧本里市场靠社区自治；dsh 的 Plugin Store 若官方运营，审核标准就是新的 guardrail——**谁给插件写 harness？**
- 训练分布论的反问：如果 dsh 生态足够大、schema 足够多样，会不会反而逼出对 schema 变化鲁棒的模型——#62 的解药而非毒药？
- 对本仓库：Minimal 模式值不值得做成 practice/ 的下一个实验——同一任务对比 dsh Minimal vs Standard，把"harness 增量"实测出来？

---

## 检索来源（2026-08-14 快照）

- [SCMP：DeepSeek beefs up agentic AI with 'harness'](https://www.scmp.com/tech/tech-trends/article/3362792/chinas-deepseek-beefs-agentic-ai-harness-tests-v4-model-jolts-silicon-valley)（团队与招聘背景）
- [HN 讨论](https://news.ycombinator.com/item?id=49285244)（作者在场；Cordis/Koishi 血统；可逆副作用）
- [量子位实测](https://www.qbitai.com/2026/08/472208.html)（"Agent 时代的安卓"；自家模型配自家 harness）
- [王若风：拆 dsh 插件底座](https://wangruofeng007.com/blog/2026-08/deepseek-harness-plugin-architecture/)（"可逆插件脊柱"命名；选型建议）
- [Developers Digest 代码阅读](https://www.developersdigest.tech/blog/deepseek-harness-dsh-first-look)（453K 行测量；BENCHMARK.md 三行stub）
- [插件安全审计 #454](https://github.com/deepseek-ai/deepseek-harness/discussions/454) / [#587](https://github.com/deepseek-ai/deepseek-harness/discussions/587)（双轴不对称；与主流 harness 的进程外对照）
