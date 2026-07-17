---
title: "循环工程（Loop Engineering）：从提示智能体到设计提示智能体的系统"
sourceTitle: "Loop Engineering"
sourceUrl: "https://addyosmani.com/blog/loop-engineering/"
sourceAuthor: "Addy Osmani (Google Cloud AI Director)"
sourcePublishedAt: "2026-06-07"
sourceSiteName: "AddyOsmani.com"
summary: "Osmani 给'loop engineering'定调：不再由你提示智能体，而是设计一个替你提示智能体的系统。五个构件（Automations / Worktrees / Skills / Plugins-Connectors / Sub-agents）加一条外置记忆脊柱，在 Codex 与 Claude Code 里都已产品化。文末三重警告：验证仍在你身上、理解会腐烂、舒服的姿势最危险。"
sourceLanguage: "en"
language: "zh-CN"
translationMethod: "人工整理逐段翻译（cloud agent，对照原文全文）"
sourceFigureCount: 0
---

# 循环工程（Loop Engineering）

**循环工程就是把"提示智能体的那个人"从系统里换掉——换成一个由你设计、替你提示智能体的系统。** 这里的循环（loop）可以理解为一个递归的目标：你定义一个目的，AI 迭代直到完成。我相信这可能是我们与编码智能体协作方式的未来。不过现在还早，我自己持保留态度，而且你绝对要[小心](https://x.com/weswinder/status/2063700289710964906) token 成本（取决于你是"token 富人"还是"token 穷人"，用量模式会差得离谱）。所以我想把它拆开讲清楚：它是什么，意味着什么。

Peter Steinberger 最近[说](https://x.com/steipete/status/2063697162748260627)："你不应该再提示（prompt）编码智能体了。你应该设计提示你的智能体的循环。" 类似地，Anthropic 的 Claude Code 负责人 Boris Cherny [说](https://x.com/rohanpaul_ai/status/2063289804708835412)："我已经不再提示 Claude 了。我有一批循环在跑，它们负责提示 Claude、决定接下来做什么。我的工作是写循环。"

好，这些话到底是什么意思？

过去差不多两年里，你从编码智能体那里拿到产出的方式是：写一个好提示词、给足上下文。你打一段话，读它返回什么，再打下一段。智能体是一件工具，而你全程握着它，一轮接一轮。这个阶段差不多结束了——至少有些人认为它将要结束。

现在你构建一个小系统：它自己发现工作、分发工作、检查结果、记下已完成的事、再决定下一件事——然后你让这个系统去"捅"智能体，而不是你亲自上。我此前写过它的表亲——[agent harness engineering](https://addyosmani.com/blog/agent-harness-engineering/)（为单个智能体打造运行环境）和[工厂模型](https://addyosmani.com/blog/factory-model/)（构建软件的系统）。循环工程比 harness 高一层楼：还是那个 harness，但它跑在定时器上、会派生小帮手、还会自我供料。

让我意外的是，这已经不再是"工具党"的事了。一年前你想要一个循环，就得写一坨 bash，然后永远维护那坨东西，它只属于你。现在这些零件直接内置在产品里。Steinberger 列的清单几乎精确映射到 Codex 应用上，又几乎原样映射到 Claude Code 上。一旦你注意到两边的形状是一样的，你就不再争论用哪个工具，而是去设计一个不管你坐在哪个工具里都照样能跑的[循环](https://x.com/reach_vb/status/2063713960495558940)。

## 五个零件，然后是注意事项

一个循环需要五样东西，外加一个记东西的地方。先列清单，再映射到对照表：

1. **Automations（自动化）**——按计划自动触发，自己做发现（discovery）和分诊（triage）。
2. **Worktrees（工作树）**——让两个并行工作的智能体不互相踩脚。
3. **Skills（技能）**——把项目知识写下来，否则智能体只能靠猜。
4. **Plugins 和 connectors（插件与连接器）**——把智能体接进你已经在用的工具。
5. **Sub-agents（子智能体）**——一个出主意，另一个来检查。

然后是第六样东西：**记忆**。一个 markdown 文件，或者一个 Linear 看板——任何活在单次对话之外、记录"什么已完成、下一步是什么"的东西。听起来蠢到不值一提，但这是每一个长时运行智能体都依赖的同一个把戏。我在讲[长时运行智能体](https://addyosmani.com/blog/long-running-agents/)时展开过：模型在两次运行之间忘掉一切，所以记忆必须落在磁盘上而不是上下文里。**智能体会忘，仓库不会。**

两个产品现在五样都有了。

| 原语 | 在循环中的职责 | Codex 应用 | Claude Code |
| --- | --- | --- | --- |
| Automations | 按计划做发现 + 分诊 | [Automations 标签页](https://developers.openai.com/codex/app/automations)：选项目、提示词、频率、环境；结果进 Triage 收件箱；`/goal` 跑到完成为止 | 计划任务与 cron、`/loop`、`/goal`、hooks、GitHub Actions |
| Worktrees | 隔离并行的特性开发 | 每个线程内置 worktree | `git worktree`、`--worktree` 参数、subagent 上的 `isolation: worktree` |
| Skills | 固化项目知识 | [Agent Skills](https://developers.openai.com/codex/skills)（`SKILL.md`），用 `$name` 调用或隐式触发 | [Agent Skills](https://addyosmani.com/blog/agent-skills/)（`SKILL.md`） |
| Plugins / connectors | 接入你的工具 | Connectors（MCP）+ 用于分发的 plugins | MCP servers + plugins |
| Sub-agents | 出主意与做验证 | [Subagents](https://developers.openai.com/codex/subagents)：`.codex/agents/` 里的 TOML 定义 | `.claude/agents/` 里的 Task subagents、agent teams |
| 状态 | 跟踪什么已完成 | Markdown 或经 connector 连 Linear | Markdown（`AGENTS.md`、进度文件）或经 MCP 连 Linear |

名字略有出入，能力是同一回事。下面逐个说，因为老实讲，细节决定一个循环是站得住，还是悄悄到处漏。

## Automations：这是心跳

Automations 让一个循环成为真正的循环，而不是你跑过一次的一次性任务。在 Codex 应用里，你在 Automations 标签页新建一个：选项目、它要跑的提示词、多久跑一次、跑在本地 checkout 还是后台 worktree。有发现的运行进入 Triage 收件箱，一无所获的运行自动归档——这点很贴心。OpenAI 内部用它做那些无聊的事：每日 issue 分诊、总结 CI 失败、写提交简报、追捕上周谁埋进去的 bug。而且 automation 可以调用一个 skill，这样你能维护住这个周期性任务——你触发 `$skill-name`，而不是把一大坨指令糊进一个永远没人更新的计划任务里。

Claude Code 走另一条路到达同一个地方：调度与 hooks。你可以用 `/loop` 按间隔重复跑一个提示词或命令，可以调度 cron 任务，可以用 hooks 在智能体生命周期的特定节点触发 shell 命令，或者把整个东西推到 GitHub Actions 上，让它在你合上笔记本之后继续跑。思路完全相同：你定义一个自主任务，给它一个节奏，然后发现物送到你面前——而不是你四处巡查。

还有第二个会话内原语值得了解，它更贴近本文的主题：`/loop` 按节奏重复运行；**`/goal` 则一直干到你写的条件真正为真为止**——而且每一轮之后由一个独立的小模型检查是否完成，写代码的智能体不给自己打分。你给它类似"test/auth 下所有测试通过且 lint 干净"的条件，然后走人。Codex 有同样的东西，也叫 `/goal`：跨轮持续工作，直到一个可验证的停止条件成立，支持暂停、恢复、清除。同一个原语，两个工具都有——这差不多就是本文通篇的模式。

所以这部分负责把工作**浮上来**。循环的其余部分负责对它**采取行动**。

## Worktrees：让并行不变成灾难

你一跑多于一个智能体，文件就开始互相冲突，这就是失败的起点。两个智能体写同一个文件，和两个工程师往同几行代码提交、事先谁也没跟谁说话，是一模一样的头疼。git worktree 解决它：那是同一仓库历史下、各自分支上的独立工作目录，一个智能体的编辑在物理上碰不到另一个的 checkout。

Codex 把 worktree 支持直接做进产品，多个线程同时打同一个仓库互不相撞。Claude Code 给你同样的隔离：`git worktree`、用 `--worktree` 参数在独立 checkout 里开会话、以及在 subagent 上加 `isolation: worktree` 配置，让每个帮手拿到一个用完自动清理的全新 checkout。这件事的人类侧我在"编排税"（[the orchestration tax](https://addyosmani.com/blog/orchestration-tax/)）里写过：worktree 消除了机械碰撞，但**天花板仍然是你**——决定你能并行跑多少个的，是你的 review 带宽，不是工具。

## Skills：让你不用每个会话都把项目重新解释一遍

Skill 是让你不再像金鱼一样每个会话重讲一遍项目背景的方法。两个工具用同一个格式：一个文件夹，里面一个 `SKILL.md` 装指令和元数据，外加可选的脚本、参考资料、资产。Codex 在你用 `$` 或 `/skills` 调用时运行 skill，或者当任务匹配 skill 描述时自动运行——这就是为什么一段克制、无聊的描述胜过一段机灵的。Claude Code 同理，我在 [agent skills](https://addyosmani.com/blog/agent-skills/) 一文里写过这个模式。

Skills 也是"意图不再反复收费"的地方。我在"意图债"（[the intent debt](https://addyosmani.com/blog/intent-debt/)）里论证过：智能体每个会话都是冷启动，它会用一个自信的猜测填上你意图里的每个洞。Skill 就是把意图写在外面：约定、构建步骤、"我们不这么做，因为那次事故"——写一次，智能体每次运行都读。没有 skills，循环每个周期都从零重推你的整个项目；有了 skills，它会复利。

一件事要分清：skill 是**编写格式**，plugin 是**发行方式**。当你想跨仓库共享一个 skill、或把几个打包在一起时，就把它们打包成 plugin。Codex 如此，Claude Code 也如此。

## Plugins 与 connectors：循环触到你的真实工具

只能看见文件系统的循环是个小循环。Connectors（构建在 MCP 之上）让智能体能读你的 issue 跟踪器、查数据库、打 staging API、往 Slack 发消息。Codex 和 Claude Code 都说 MCP，所以你为其中一个写的 connector 通常在另一个里直接能用。而 plugins 把 connectors 和 skills 捆在一起，你的队友一键安装你的整套配置，不用凭记忆重建。

这就是"给你一个修复方案"的智能体和"自己开 PR、链上 Linear 工单、CI 转绿后去频道里知会一声"的循环之间的差别。connectors 是循环能在你的真实环境里**行动**、而不只是告诉你"如果它能的话它会怎么做"的原因。

## Sub-agents：让做的人离查的人远点

循环里最有用的结构性设计，遥遥领先的一条，是**把写的和查的分开**。写了代码的模型给自己的作业打分时太仁慈了。第二个智能体带着不同的指令、有时是不同的模型，能抓住第一个自我说服后放过的东西。

Codex 只在你要求时才派生 subagent，并行运行它们，然后把结果折叠回一个答案。你在 `.codex/agents/` 里用 TOML 文件定义自己的智能体，各有名字、描述、指令，以及可选的模型和推理力度（reasoning effort）——你的安全审查员可以是高力度的强模型，而你的探索者可以是某个只读的快模型。Claude Code 用 `.claude/agents/` 里的 subagents 和互相传递工作的 agent teams 做同样的事。两边常见的分工都是：一个探索、一个实现、一个对照 spec 验证。

这个论点我已经讲过两次：一次是"代码智能体交响乐团"（[the code agent orchestra](https://addyosmani.com/blog/code-agent-orchestra/)），一次是"对抗式代码审查"（[adversarial code review](https://addyosmani.com/blog/adversarial-code-review/)）。它在循环里格外要紧的原因是：**循环在你不看着的时候跑**，一个你真正信任的验证者，是你敢走开的唯一理由。Subagents 确实更烧 token——每个都要自己跑模型和工具——所以把它们花在值得买第二意见的地方。这其实也是 Claude Code 的 `/goal` 在底下做的事：由一个新鲜的模型来判定循环是否完成，而不是干活的那个——"做与查分离"应用到了停止条件本身。

## 一个循环长什么样

拼起来，一个线程就变成一块小控制台。这是我反复在用的一种形状：

一个 automation 每天早晨在仓库上运行。它的提示词调用一个分诊 skill：读昨天的 CI 失败、打开的 issue、最近的提交，把发现写进一个 markdown 文件或 Linear 看板。对每个值得做的发现，线程开一个隔离的 worktree，派一个 sub-agent 起草修复，再派第二个 sub-agent 对照项目 skills 和现有测试审查那份草稿。

Connectors 让循环开 PR、更新工单。循环处理不了的东西落进分诊收件箱等我。**状态文件是整套东西的脊柱**：它记住试过什么、什么通过了、什么还开着，所以明早的运行从今天停下的地方接着来。

回头看看你实际做了什么：你设计了它，一次。那些步骤你一个都没提示过。这就是 Steinberger 那句话的落地——而且在 Codex 还是 Claude Code 里都是同一个循环，因为零件就是同一批零件。

## 循环仍然不替你做的事

循环改变了工作，但没有把你从工作里删掉。而且有三个问题会随着循环变好而变得**更尖锐**，不是更轻松：

**验证仍然在你身上。** 一个无人值守运行的循环，也是一个无人值守犯错的循环。把验证者 sub-agent 从制作者手里拆出来，就是为了让循环的"完成了"有点分量——即便如此，"完成"仍是一个主张，不是一个证明。我把"[AI 时代的代码审查](https://addyosmani.com/blog/code-review-ai/)"里那句话再说一遍：你的工作是交付你**确认过能用**的代码。

**你的理解仍然会腐烂——如果你放任的话。** 循环交付你没写过的代码越快，"存在的东西"和"你实际理解的东西"之间的沟壑就越大。这就是理解债（[comprehension debt](https://addyosmani.com/blog/comprehension-debt/)），一个顺滑的循环只会让它涨得更快——除非你去读循环产出的东西。

**舒服的姿势是危险的姿势。** 当循环自己转起来，你会非常想放弃持有观点、来什么收什么。我把这叫"认知投降"（[cognitive surrender](https://addyosmani.com/blog/cognitive-surrender/)）。设计循环这件事，带着判断力去做时是解药，为了逃避思考去做时是加速剂——同一个动作，相反的结果。

## 建你的循环。留在工程师的位置上。

我认为这是我们工作方式演化的一个预览。话虽如此，如果我不亲自 review 代码，或者完全依赖自动化循环去修它，我的产品质量会受损。我大概率会陷进一个向下的螺旋，把自己越埋越深。

话虽如此，去搭你的循环吧——但别忘了，直接提示你的智能体也依然有效。关键在于找到平衡。

循环还会因人而异地产出完全不同的结果。两个人可以搭建一模一样的循环，得到截然相反的结局：一个用它在自己深刻理解的工作上跑得更快，另一个用它彻底逃避理解工作。**循环分不出这两者的区别。你分得出。**

这正是循环设计比提示词工程更难而非更容易的原因。Cherny 的意思不是工作变轻松了，而是杠杆点挪了位置。

建你的循环。但要像一个打算留在工程师位置上的人那样去建它，而不是只当那个按下开始键的人。
