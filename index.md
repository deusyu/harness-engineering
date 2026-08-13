---
layout: home

hero:
  name: Harness Engineering
  text: 驭缰工程 · 中文学习档案
  tagline: 从概念拆解、独立思考到系统性翻译与动手实践——人类掌舵，智能体执行
  actions:
    - theme: brand
      text: 开始阅读
      link: /concepts/00-overview
    - theme: alt
      text: 为什么有这个项目
      link: /thinking/why-this-project-exists
    - theme: alt
      text: 文章索引
      link: /references/articles

features:
  - icon: 📦
    title: 仓库即记录系统
    details: 不在仓库里的东西，对智能体不存在。决策、规范、计划一律以版本化工件入库。
    link: /concepts/01-repo-as-source-of-truth
  - icon: 🗺️
    title: 地图而非手册
    details: AGENTS.md 是目录页，不是百科全书。小入口点 + 渐进式披露，指向更深层文档。
    link: /concepts/00-overview
  - icon: ⚙️
    title: 机械化执行
    details: 文档会腐烂，检查不会。自定义 linter 与结构测试是不变量的守护者。
    link: /concepts/02-mechanical-enforcement
  - icon: 🤖
    title: 智能体可读性
    details: 为智能体的推理能力优化技术选型——偏爱 API 稳定、训练集覆盖好的「无聊」技术。
    link: /concepts/04-agent-readability
  - icon: 🚀
    title: 吞吐量改变合并理念
    details: 纠错成本低、等待成本高时，短 PR 生命周期是理性选择，偶发失败靠重跑解决。
    link: /concepts/05-throughput-changes-merge
  - icon: ♻️
    title: 熵管理即垃圾回收
    details: 智能体会复现仓库中已有的一切模式——包括坏模式。技术债是高息贷款。
    link: /concepts/03-entropy-and-garbage-collection
---

<HomeStats />

## 这个站本身也是一个 harness {#self-harness}

本站遵循它所记录的方法论运转：

- **内容即仓库**：每个页面就是 [GitHub 仓库](https://github.com/deusyu/harness-engineering)里的一个 Markdown 文件，站点只是它的一种渲染。
- **导航与计数不手写**：侧边栏和首页统计在构建时从文件系统生成，由一致性检查（C14）机械化守护——新内容合入即出现，无需任何人记得去更新菜单。
- **对智能体可读**：任意页面 URL 追加 `.md` 即得纯文本版；[/llms.txt](/llms.txt) 提供站点索引，[/feed.xml](/feed.xml) 提供 RSS 订阅。

## 从哪里开始 {#start}

- 想快速建立框架：[概念总览](/concepts/00-overview)，六大核心概念一页看完。
- 想看批判性视角：[独立思考](/thinking/why-this-project-exists)，包括对评估短板、个人开发者适用性的质疑。
- 想读一手材料：[翻译与作品](/works/harness-engineering-chinese-interpretation)，按来源系列分组的社区关键文章中译。
- 想按图索骥：[文章索引](/references/articles)，每篇附深度摘要与来源信息。
