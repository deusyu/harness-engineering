# 实验 01：用 Ralph Orchestrator 跑一个完整的编排循环

> 验证概念：帽子系统、背压门控、迭代循环、持久记忆
> 日期：2026-03-31
> 耗时：321 秒 | 费用：$0.31 | 迭代：4 次

## 目标

用 Ralph Orchestrator（Harness Engineering 的开源实现）从零完成一个编码任务，观察编排循环的实际运行过程。

## 环境

- Ralph Orchestrator v2.8.1（`npm install -g @ralph-orchestrator/ralph-cli`）
- 后端：Claude Code（claude-opus-4-6）
- Hat collection：`builtin:code-assist`

## 步骤

### 1. 安装 Ralph

```bash
npm install -g @ralph-orchestrator/ralph-cli
```

### 2. 初始化项目

```bash
mkdir -p /tmp/ralph-demo && cd /tmp/ralph-demo
ralph init --backend claude
```

生成 `ralph.yml`，核心配置：

```yaml
cli:
  backend: "claude"
event_loop:
  prompt_file: "PROMPT.md"
  completion_promise: "LOOP_COMPLETE"
  max_iterations: 100
```

### 3. 编写任务描述

人类唯一的产出——`PROMPT.md`：

```markdown
# Task: Build a CLI word counter

Create a simple Python CLI tool called `wc.py` that:
1. Accepts a filename as argument
2. Counts lines, words, and characters
3. Prints the result in a formatted table

Include a test file `test_wc.py` using pytest.

When all tests pass, output LOOP_COMPLETE.
```

### 4. 启动编排循环

```bash
ralph run -c ralph.yml -H builtin:code-assist
```

## 循环过程

Ralph 自动完成了 4 轮迭代，每轮戴不同的"帽子"：

| 迭代 | 帽子 | 做了什么 |
|------|------|---------|
| 1 | **Planner** | 分析 PROMPT.md → 拆解任务 → 创建 task → 写入 scratchpad → 交给 Builder |
| 2 | **Builder** | 先写 `test_wc.py`（7 个测试，全红）→ 写 `wc.py` 实现 → 修 char count bug → 7/7 全绿 |
| 3 | **Critic** | 独立重跑 pytest → 手动验证 5 种 CLI 路径（正常/无参数/文件缺失/空文件/无换行符） |
| 4 | **Finalizer** | 确认无遗留任务 → 更新 scratchpad → emit `LOOP_COMPLETE` → 循环终止 |

## 产出

### wc.py（49 行）

```python
#!/usr/bin/env python3
"""CLI word counter — counts lines, words, and characters in a file."""

import sys

def count(text: str) -> tuple[int, int, int]:
    lines = text.count("\n")
    words = len(text.split())
    chars = len(text)
    return lines, words, chars

def format_table(filename: str, lines: int, words: int, chars: int) -> str:
    col_w = max(len(str(v)) for v in (lines, words, chars, "Lines", "Words", "Chars"))
    sep = "+" + "-" * (col_w + 2) + "+" + "-" * (col_w + 2) + "+"
    row = lambda label, val: f"| {label:<{col_w}} | {val:>{col_w}} |"
    return "\n".join([
        f"File: {filename}",
        sep,
        row("Lines", lines),
        row("Words", words),
        row("Chars", chars),
        sep,
    ])

def main() -> int:
    if len(sys.argv) < 2:
        print("Usage: wc.py <filename>", file=sys.stderr)
        return 1
    filename = sys.argv[1]
    try:
        with open(filename) as f:
            text = f.read()
    except FileNotFoundError:
        print(f"Error: file not found: {filename}", file=sys.stderr)
        return 1
    lines, words, chars = count(text)
    print(format_table(filename, lines, words, chars))
    return 0

if __name__ == "__main__":
    sys.exit(main())
```

### test_wc.py（7 个测试）

| 测试类 | 测试 | 验证 |
|--------|------|------|
| TestNormalFile | counts_lines_words_chars | 计数正确性 |
| TestNormalFile | output_is_formatted_table | 输出格式 |
| TestEmptyFile | empty_file_all_zeros | 边界：空文件 |
| TestMissingFile | missing_file_exits_nonzero | 错误退出码 |
| TestMissingFile | missing_file_prints_error | 错误信息 |
| TestNoArgs | no_args_exits_nonzero | 无参数退出码 |
| TestNoArgs | no_args_prints_usage | 使用说明 |

### CLI 运行效果

```
$ python3 wc.py wc.py
File: wc.py
+-------+-------+
| Lines |    49 |
| Words |   166 |
| Chars |  1339 |
+-------+-------+
```

## scratchpad.md（跨迭代的持久记忆）

Ralph 在 `.ralph/agent/scratchpad.md` 中记录了每轮迭代的决策和结果，供后续迭代读取：

```
## Iteration 1 — Planner: Initial Decomposition
Objective: Build CLI word counter (wc.py + test_wc.py).
Plan: 2 steps. Step 1 covers both implementation and tests. Step 2 is manual verification.

## Iteration 2 — Builder: Implement wc.py + test_wc.py
- Wrote test_wc.py first (TDD)
- Fixed test char count (24 not 23)
- All 7 tests pass. Emitting review.ready.

## Iteration 3 — Critic: Fresh-Eyes Review
- 7/7 pytest tests pass (re-verified independently)
- All CLI paths verified
- Verdict: PASSED

## Iteration 4 — Finalizer: Whole-Prompt Gate
- All objective requirements met
- Verdict: LOOP_COMPLETE
```

## 映射到 Harness Engineering 核心概念

| 观察到的行为 | 对应概念 |
|-------------|---------|
| PROMPT.md 是唯一的人类输入 | **仓库即记录系统** — 任务描述必须在文件中，不在脑子里 |
| Planner/Builder/Critic/Finalizer 角色分离 | **帽子系统** — 每个角色有独立职责，不越界 |
| Builder 写完代码 → 必须测试通过才能继续 | **背压门控** — 不规定怎么做，但拒绝坏结果 |
| Critic 独立重跑测试 + 手动验证 CLI | **机械化执行** — 自动化验证，不靠自我评估 |
| scratchpad.md 跨迭代传递上下文 | **持久记忆** — 磁盘是状态，Git 是记忆 |
| `LOOP_COMPLETE` 触发循环终止 | **完成信号** — 明确的退出条件，不靠猜测 |
| Builder 在第 2 轮自己发现并修了 char count bug | **迭代自愈** — 测试失败 → 自动修复 → 重新验证 |
