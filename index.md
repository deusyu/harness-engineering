---
layout: home

hero:
  name: Harness Engineering
  text: 驭缰工程学习指南
  tagline: 一个从概念理解到独立实践的增长型学习档案 — 人类掌舵，智能体执行
  actions:
    - theme: brand
      text: 开始阅读
      link: /concepts/00-overview
    - theme: alt
      text: 项目宗旨
      link: /thinking/why-this-project-exists
    - theme: alt
      text: 文章索引
      link: /references/articles

features:
  - icon: 📦
    title: 仓库即记录系统
    details: 不在仓库里的东西，对智能体不存在。一切决策、规范、计划都以版本化工件提交到仓库。
    link: /concepts/01-repo-as-source-of-truth
  - icon: 🗺️
    title: 地图而非手册
    details: AGENTS.md 是目录页，不是百科全书。渐进式披露：从小入口点开始，指向更深层文档。
    link: /concepts/00-overview
  - icon: ⚙️
    title: 机械化执行
    details: 文档会腐烂，lint 规则不会。自定义 linter + 结构测试 = 不变量的守护者。
    link: /concepts/02-mechanical-enforcement
  - icon: 🤖
    title: 智能体可读性
    details: 优先选择"无聊"技术（API 稳定、训练集覆盖好），为智能体的推理能力优化。
    link: /concepts/04-agent-readability
  - icon: 🚀
    title: 吞吐量改变合并理念
    details: 纠错成本低，等待成本高。PR 生命周期很短，测试偶发失败通过后续重跑解决。
    link: /concepts/05-throughput-changes-merge
  - icon: ♻️
    title: 熵管理 = 垃圾回收
    details: 智能体会复现仓库中已有的模式——包括坏模式。技术债是高息贷款。
    link: /concepts/03-entropy-and-garbage-collection
---
