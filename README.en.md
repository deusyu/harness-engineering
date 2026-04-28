[中文](README.md) | English

![License: MIT](https://img.shields.io/badge/license-MIT-blue)
![Articles](https://img.shields.io/badge/articles-19-green)
![Translations](https://img.shields.io/badge/translations-12-orange)

# Harness Engineering Study Guide

> A deep-dive learning archive on Harness Engineering — from concept to practice

## Introduction

This is an evolving learning project. **Harness Engineering** is an engineering paradigm proposed by OpenAI in February 2026: engineers stop writing code and instead design environments, clarify intent, and build feedback loops so AI agents can work reliably.

> **Humans steer. Agents execute.**

This repository documents the full learning journey — from reading the original article, breaking down concepts, forming independent thoughts, hands-on experiments, to producing shareable work. We hope it helps others exploring AI-native engineering.

Source: [OpenAI — Harness Engineering: Harnessing Codex in an Agent-First World](https://openai.com/zh-Hans-CN/index/harness-engineering/)

> **Note:** The insights shared here are not universally applicable. Please adapt them to your own context.

## ⚡ In One Sentence

```
Traditional:          Humans write code → Machines run code
Harness Engineering:  Humans design constraints → Agents write code → Machines run code
```

The core shift: **an engineer's output moves from code to constraint systems** — AGENTS.md, architecture rules, custom linters, and feedback loops.

## 🧭 Six Core Concepts

<details>
<summary><b>1. Repo as System of Record</b> — If it's not in the repo, it doesn't exist for the agent</summary>

Slack threads, Google Docs, knowledge in people's heads = invisible to the agent. All decisions, specs, and plans must be committed as versioned artifacts.

→ See [concepts/01-repo-as-source-of-truth.md](concepts/01-repo-as-source-of-truth.md)
</details>

<details>
<summary><b>2. Map, Not Manual</b> — AGENTS.md is a table of contents, not an encyclopedia</summary>

A ~100-line entry file pointing to deeper docs. Progressive disclosure: the agent starts from a small, stable entry point and is guided where to look next. Three ways a giant instruction file fails: crowds out context, impossible to maintain, can't be mechanically verified.

→ See [concepts/00-overview.md](concepts/00-overview.md)
</details>

<details>
<summary><b>3. Mechanical Enforcement</b> — Docs rot; lint rules don't</summary>

Custom linters + structural tests = invariant guardians. Lint error messages embed fix instructions so agents can self-correct. Enforce boundaries centrally, allow autonomy locally.

→ See [concepts/02-mechanical-enforcement.md](concepts/02-mechanical-enforcement.md)
</details>

<details>
<summary><b>4. Agent Readability</b> — Optimize for the agent's ability to reason</summary>

Prefer "boring" technologies (stable APIs, well-represented in training data). Sometimes re-implementing a focused subset is cheaper than wrapping opaque upstream behavior. Make the app launchable per git worktree.

→ See [concepts/04-agent-readability.md](concepts/04-agent-readability.md)
</details>

<details>
<summary><b>5. Throughput Changes Merge Philosophy</b> — Correction is cheap; waiting is expensive</summary>

Short PR lifecycles. Flaky tests resolved by re-runs rather than blocking indefinitely. In a system where agent throughput far exceeds human attention, this is usually the right call.

→ See [concepts/05-throughput-changes-merge.md](concepts/05-throughput-changes-merge.md)
</details>

<details>
<summary><b>6. Entropy Management = Garbage Collection</b> — Tech debt is a high-interest loan</summary>

Agents reproduce existing patterns in the repo — including bad ones. Codify "golden rules" into the repo. Run periodic background tasks to scan for drift, update quality scores, and open targeted refactoring PRs.

→ See [concepts/03-entropy-and-garbage-collection.md](concepts/03-entropy-and-garbage-collection.md)
</details>

## 🔑 Key Data Points

| Metric | Data |
|--------|------|
| Team size | 3 → 7 engineers |
| Time span | 5 months |
| Codebase | ~1 million lines |
| PRs merged | ~1,500 |
| PRs per engineer per day | 3.5 (still growing after scaling) |
| Single run duration | 6+ hours (often during human sleep) |
| Efficiency estimate | ~1/10 of manual coding time |

## 📂 Repository Structure

```
harness-engineering/
├── README.md              ← Chinese (primary)
├── README.en.md           ← You are here
├── AGENTS.md              ← Repo navigation entry (for agents)
│
├── concepts/              # Phase 1: Concept notes (8 articles)
│   ├── 00-overview.md     #   Overview of all six concepts
│   ├── 01-repo-as-...     #   Repo as source of truth
│   ├── 02-mechanical-...  #   Mechanical enforcement
│   ├── 03-entropy-...     #   Entropy & garbage collection
│   ├── 04-agent-...       #   Agent readability
│   ├── 05-throughput-...  #   Throughput changes merge philosophy
│   ├── 06-harness-...     #   Harness definition (Fowler control-theory extension)
│   └── 07-spec-as-product.md #   Spec as product (Symphony extension)
│
├── thinking/              # Phase 2: Independent analysis (6 articles)
├── practice/              # Phase 3: Hands-on experiments (1 Ralph Demo)
├── feedback/              # Phase 4: Lessons learned (1 article)
├── works/                 # Phase 5: Shareable outputs (12 translations + 1 original)
├── prompts/               # Validated prompts collection
└── references/            # External resource index (19 articles with deep summaries)
```

Each subdirectory has its own `AGENTS.md` explaining its purpose and conventions — a direct practice of the "progressive disclosure" principle from the original article.

## 🚀 Learning Path

- [x] **Phase 1: Understand core concepts** — 8 concept notes covering OpenAI's six concepts + Fowler's control-theory extension + Symphony's spec-as-product
- [x] **Phase 2: Form your own opinions** — 6 independent analyses (ongoing)
- [x] **Phase 3: Pick a small project to practice** — Ralph Demo completed (321s, $0.31)
- [x] **Phase 4: Record feedback & iterations** — 1 article (ongoing)
- [x] **Phase 5: Produce shareable work** — 12 professional translations + 1 original synthesis

## 📚 Research Library

19 articles across three knowledge tracks + 3 extended readings:

| Track | Coverage | Perspectives |
|-------|----------|-------------|
| AI-Era Harness Engineering | 16 articles | OpenAI → Fowler → Anthropic → LangChain → Stanford |
| Cloud-Native Harness.io | 2 articles | CI/CD platform architecture (same name, different meaning) |
| Efficiency Paradox & Capability Evolution | 1 article | YDD systematic teardown: TOC + Spec/Rule/Skill |
| Extended Reading | 3 articles | Mitchell Hashimoto, Context Engineering, Human-Agent collaboration |

See [references/articles.md](references/articles.md) — each article includes core thesis, key data, and cross-article connections.

## 📖 Translations

<details>
<summary><b>12 Chinese translations of key articles</b> (click to expand)</summary>

| Translation | Original Author | Source |
|-------------|----------------|--------|
| ⭐ [Eight Years of Wanting](works/maganti-eight-years-building-ai-translation.md) | Lalit Maganti | Personal blog |
| [Inside the Scaffold](works/inside-the-scaffold-paper-translation.md) | Benjamin Rombaut | Huawei / arXiv |
| [Meta-Harness](works/meta-harness-paper-translation.md) | Yoonho Lee et al. | Stanford / arXiv |
| [Harness Engineering (full)](works/fowler-harness-engineering-full-translation.md) | Birgitta Böckeler | Martin Fowler |
| [Harness Engineering (memo)](works/fowler-harness-engineering-memo-translation.md) | Birgitta Böckeler | Martin Fowler |
| [Encoding Team Standards](works/fowler-encoding-team-standards-translation.md) | Rahul Garg | Martin Fowler |
| [Feedback Flywheel](works/fowler-feedback-flywheel-translation.md) | Rahul Garg | Martin Fowler |
| [Scaling Managed Agents](works/anthropic-managed-agents-translation.md) | Lance Martin et al. | Anthropic |
| [Agent Evaluation Checklist](works/langchain-agent-evaluation-checklist-translation.md) | LangChain Team | LangChain |
| [Agent-driven Development](works/github-agent-driven-development-translation.md) | Tyler McGoffin | GitHub |
| [Continual Learning](works/langchain-continual-learning-translation.md) | Harrison Chase | LangChain |
| [Codex Orchestration Spec: Symphony](works/openai-codex-symphony-translation.md) | Kotliarskyi et al. | OpenAI |

</details>

## 🔗 Related Projects & Resources

### Source Material

| Resource | Description |
|----------|-------------|
| [OpenAI Original Article](https://openai.com/zh-Hans-CN/index/harness-engineering/) | The full Harness Engineering exposition |

### Ralph Series — Harness Engineering in Practice

The "Ralph Wiggum Loop" is the core implementation pattern of Harness Engineering: agents work autonomously in a loop until the task is complete.

| Project | Stars | Description |
|---------|-------|-------------|
| [snarktank/ralph](https://github.com/snarktank/ralph) | 13.6k | Original Ralph: bash script that repeatedly spawns AI with fresh context until all PRD items pass. 6 core tenets |
| [ralph-orchestrator](https://mikeyobrien.github.io/ralph-orchestrator/) | 2.3k | Rust evolution: Hat-based personas + event-driven coordination + multi-backend (Claude/Kiro/Gemini/Codex) + backpressure gates + persistent memory |
| [bmad-ralph](https://github.com/qianxiaofeng/bmad-ralph) | 2 | BMAD method + Ralph: parallel Claude Code worktrees + three-layer self-healing (retry → restart → diagnose) + SQLite state machine |

### Ralph Tenets ↔ Harness Engineering Mapping

| Ralph Tenet | Harness Engineering Concept |
|-------------|----------------------------|
| Fresh Context Is Reliability | Agent Readability — re-read everything each iteration |
| Backpressure Over Prescription | Mechanical Enforcement — don't prescribe how; gate bad output |
| The Plan Is Disposable | Entropy Management — regeneration costs one planning loop |
| Disk Is State, Git Is Memory | Repo as System of Record — files are the handoff mechanism |
| Steer With Signals, Not Scripts | Humans Steer — add signs, not scripts |
| Let Ralph Ralph | Agents Execute — sit on the loop, not in it |

### Community & Extended

| Resource | Description |
|----------|-------------|
| [vibe-coding-cn](https://github.com/tukuaiai/vibe-coding-cn) | Chinese Vibe Coding community guide |
| [Mitchell Hashimoto: Engineer the Harness](https://mitchellh.com/writing/my-ai-adoption-journey#step-5-engineer-the-harness) | Another origin of the "Harness" concept |

## 🤝 Contributing

Contributions via Issues and PRs are welcome:
- Add concept notes (`concepts/` has gaps to fill)
- Share your independent thinking (`thinking/`)
- Contribute practice cases (`practice/`)
- Recommend related resources (`references/`)

## 📞 Contact

| Channel | Link |
|---------|------|
| GitHub | [@deusyu](https://github.com/deusyu) |
| X (Twitter) | [@0xdeusyu](https://x.com/0xdeusyu) |
| Telegram | [@DeusThink](https://t.me/DeusThink) |
| Telegram Group | [@talkdeusyu](https://t.me/talkdeusyu) |
| Telegram Channel | [@lovedesuyu](https://t.me/lovedesuyu) |
| Email | [rainman.deus@gmail.com](mailto:rainman.deus@gmail.com) |

## Star History

If you find this project helpful, please consider giving it a Star ⭐!

[![Star History Chart](https://api.star-history.com/svg?repos=deusyu/harness-engineering&type=Date)](https://star-history.com/#deusyu/harness-engineering&Date)

## 📄 License

MIT
