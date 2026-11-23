# 驭缰工程 · 项目介绍 PPT 与海报

用 [open-kimi-ppt skill](https://github.com/deusyu/open-kimi-ppt-skill)（deusyu fork）为本仓库生成的一套可编辑演示物料：**10 页介绍 PPT** + **1 页竖版海报**。每份交付物都包含两种形态——可继续编辑的 PPTD 项目（YAML 源）和开箱即用的 PPTX 成品（嵌入字体 + 淡入淡出切换）。

> 内容里的篇数 / 计数均为 **2026-11 快照**，最新进度以仓库 README 与 `references/articles.md` 为准。

## 目录

| 路径 | 说明 |
|------|------|
| `deck/deck.pptd` + `deck/pages/` | PPT 的 PPTD 源（10 页，16:9） |
| `deck/deck.pptx` | PPT 成品（嵌入字体，可直接演示） |
| `poster/poster.pptd` + `poster/pages/` | 海报的 PPTD 源（1 页，3:4 竖版） |
| `poster/poster.pptx` | 海报成品 |
| `poster/style.md` | 海报的设计简报（按 skill 的 general-poster 规范） |
| `cover.jpg` | 封面渲染图（1600×900，供根 README 引用；由 deck 封面页导出） |
| `lo-render.py` | LibreOffice 核对渲染脚本（UNO；关闭中西文自动间距，见 2026-11-23 修订） |

## 页面结构（deck）

封面（缰绳曲线主视觉）→ 01 范式转变 → 02 六大核心概念 → 03 OpenAI 实证数据 → 04 学习闭环 → 05 仓库地图 → 06 机械化检查 C1–C14 → 07 仓库即 harness（自指）→ 08 研究资料库 → 封底。

## 视觉系统

- 配色：暖纸底 `#F5F1E8` × 深墨 `#1F1C17` × 缰绳橙红 `#C2481D`（唯一强调色）
- 字体：标题/数字 **得意黑**、正文 **MiSans**、拉丁 **Liter**（三者均已嵌入 PPTX；得意黑为斜体-only 设计）
- 视觉 DNA：一条「缰绳」曲线贯穿封面与封底——起点墨色锚点是人类，箭头指向智能体

## 如何继续编辑

```bash
npx open-kimi-ppt-skills serve
# 打开 http://127.0.0.1:55173/ ，选择 deck/ 或 poster/ 目录即可在浏览器中编辑并手动导出 PPTX
```

或直接改 `pages/*.page`（YAML）后重新导出：

```bash
python3 ~/.agents/skills/open-kimi-ppt/scripts/export_pptx.py deck/deck.pptd --output deck/deck.pptx --force
```

> 注：该命令依赖 Kimi 前端的 PPT 下载通道，2026-08-13 起对本地宿主静默失效（详见下方"管线现状"）；失效期间可用编辑器手动导出，或参照本轮做法对现有 PPTX 打结构补丁。

## 生成说明

- 初版 2026-08-06，优化版 2026-08-13；工具链：open-kimi-ppt skill（PPTD DSL + Kimi 公开编辑器的浏览器端 OOXML writer）
- 数据事实来源：仓库 README、`practice/01-ralph-demo/`、`references/articles.md` 与 [OpenAI 原文](https://openai.com/zh-Hans-CN/index/harness-engineering/)，未虚构数据
- 已做视觉质检（skill 的 export_images 整页核查）与 PPTX 校验（ZIP 完整性、每页根级 fade 切换、字体嵌入部件），并用 LibreOffice 以真实字体逐页比对渲染
- 一个已知取舍：标题字体原选阿里妈妈数黑体，但官方 writer 不支持嵌入该字体，为保证"任何机器打开都一致"换成可嵌入的得意黑

### 2026-08-13 优化与管线现状

- 优化内容：标题内拉丁字符统一为得意黑（消除直立/斜体混排）；封面缰绳曲线挂上三个约束节点（AGENTS.md · 自定义 linter · CI 反馈）；概念页条目与环上节点之间加引导细线
- 管线现状：skill 上游仓库已于 2026-08-07 因版权原因清空，同期 Kimi 前端的 **PPT 格式下载对本地宿主静默失效**（图片导出通道仍可用，本轮质检即走该通道）
- 因此本轮 PPTX 由上一版官方导出成品打结构补丁得到（python-pptx：字体统一 + 新增矢量元素，无任何文字改动），并重新通过 fade 切换 / 字体部件 / ZIP 完整性校验；PPTD 源仍是唯一权威内容源
- 后续如需从 PPTD 全量重导 PPTX，可在 `npx open-kimi-ppt-skills serve` 的浏览器编辑器里手动导出验证通道是否恢复

### 2026-11-22 修订：封面起点标签不再压线

- 摆放规则：曲线向右上升，所以标签一律放在点的右下方（曲线不经过的一侧），与上方曲线保持约 10px。三个约束节点原本就是这样摆的，唯独起点标签「人类 · 设计约束，握住缰绳」压在曲线上，本轮把它移到锚点右下方（`01_cover.page` 的 `anchor-label`）
- `cover.jpg` 由修改后的 PPTD 源经图片导出通道重新渲染（1600×900，保留「档案快照 · 2026-08」）
- PPT 下载通道仍失效，`deck.pptx` 按上一轮做法打补丁：只把 slide1 里该文本框的坐标改成与 PPTD 源一致，其余部件逐字节不变
- 同轮逐页核查了其余 9 页幻灯片与海报，没有发现文字与线条重叠

### 2026-11-23 修订：内容更新到 2026-11，排版按根因统一修正

内容（PPTD 源、`deck.pptx`、海报三处同步）：

- 计数按 `scripts/check-consistency.sh` 与当前文件取值：79 篇文章（脉络一 75 · 脉络二 2 · 脉络三 2）、40 篇全文中译 + 1 篇原创、根 `AGENTS.md` 58 行
- 06 护栏页（第 7 页）：C1–C13 改为 C1–C14，补「C14 站点防漂移」一行，页脚 CI 列表写全 consistency（合并门）· docs-build · deploy-docs
- 05 结构页（第 6 页）：目录树补 `index.md · .vitepress/`（文档站源）与 `.claude/skills/`（策展流水线 skill）
- 文档站 harness.dyu.sh：封面页脚与 GitHub 地址并列，封底与海报页脚各一处
- 封面快照时点改为 2026-11，`cover.jpg` 经图片导出通道重新渲染（1600×900）

排版：以图片导出通道（浏览器渲染）为设计基准，与 LibreOffice 渲染逐页对照，偏差归为以下根因，按类统一修正而不是逐个挪位置：

| 根因 | 表现 | 修法 |
|------|------|------|
| LibreOffice 导入 PPTX 时对每个段落打开「中西文自动间距」（`ParaIsCharacterDistance`），OOXML 没有对应属性可关 | 中英文之间多出一截空白（如「合并的 PR」），并连带改变换行 | 源文字里的单个空格是对的，不改；核对渲染用 `lo-render.py --no-autospace` 关闭该选项（PowerPoint 不做这种自动间距） |
| 行距：设计稿是 CSS 行高（行距 = L × 字号，余量上下平分），PPTX 用的是百分比行距（L × 字体自然行高，余量全压在上方） | 文字整体下沉，字号越大越明显：小字 4pt、34pt 标题 10pt、96pt 主标题 25pt；第 4 页大数字因此压到说明文字 | 百分比行距一律换成固定行距（L × 字号）；多行文本再按设计稿实测行距固定（混排行在浏览器里会被撑高），PPTD 源同步改为 `lineHeightPx`，文本框高度改为「行数 × 行距」 |
| 第 1 页节点标签是不换行 + 自动缩框（`spAutoFit`） | LibreOffice 以框中心收缩，三个标签右移 41–48pt | 去掉自动缩框，固定宽度 |
| 固定行距下 LibreOffice 把余量全放在首行上方 | 行距大的多行框首行再下沉 4–7pt | 这些框的 PPTX 坐标按实测上移（只改 PPTX，PPTD 源不动） |
| 树形符号 `├─ └─` 三种字体都不含，各渲染器回退字形宽度不同 | 第 6 页目录名随符号宽度左右错位 | 拆成独立的符号列与名称列，名称列固定 x |
| 浏览器把行尾全角标点压半宽，同宽能多排几个字 | 第 5 页「实践一例」正文换行位置不同 | 加宽文本框并在「全绿，」后显式换行 |
| 导出器给超链接写死了 Office 默认蓝 | LibreOffice / PowerPoint 里链接呈蓝色，设计稿为灰色 | 链接文字改用同段颜色，主题超链接色改为 `#6E675B` |

修后残差：全部文本相对设计稿在 ±2.5pt 内（单行小字整体 +1.5pt、标题 −2.8pt 是渲染器基线差，同类元素一致，不影响相互对齐）；「——」等破折号因字体回退宽度略有不同。PowerPoint 本机未验证。

- PPT 下载通道仍失效，`deck.pptx` / `poster.pptx` 按 PPTD 源逐项打补丁（lxml），docProps、嵌入字体（完整字体，非子集）与每页 fade 切换逐字节保留
- 核对渲染命令（需安装上方三种字体与 LibreOffice）：

```bash
python3 lo-render.py deck/deck.pptx /tmp/deck.pdf --no-autospace
python3 lo-render.py poster/poster.pptx /tmp/poster.pdf --no-autospace
pdftoppm -r 144 -png /tmp/deck.pdf /tmp/deck
```
