/**
 * 首页文案的唯一事实源 —— HomeArchive.vue（渲染层）与 config.ts buildEnd
 * （/index.md 机器可读副本 + llms-full.txt 首页正文）共同消费本模块，
 * 保证「人看到的首页」与「智能体读到的首页」永不漂移。
 *
 * 纪律（C14）：本模块不得出现任何硬编码计数——数字一律来自入参 stats
 * （computeStats() 的返回值）。纯数据模块，可被 Node 与浏览器两端打包。
 */

/** 首页标题——/index.md 副本 frontmatter 与 llms-full 首页条目共用，避免三处硬编码。 */
export const HOME_TITLE = '驭缰工程 · 中文学习档案'

export function homeCopy(stats) {
  return {
    hero: {
      kicker: 'HARNESS ENGINEERING —— 学习档案 · 中文',
      titleLead: '人类掌舵，',
      titleEm: '智能体执行',
      lede: '一座从概念理解到独立实践的 Harness Engineering 深度学习档案。工程师不再逐行写代码——设计约束、明确意图、构建反馈回路，让智能体可靠地交付。',
      actions: [
        { text: '从概念开始', link: '/concepts/00-overview' },
        { text: '读一手翻译', link: '/works/harness-engineering-chinese-interpretation', sup: stats.translations },
        { text: '浏览档案总目', link: '#ledger' },
      ],
      // 语义化缰绳图：从人类的约束设计到智能体的如约交付
      rein: {
        aria: '从人类设计约束到智能体如约交付的路径',
        start: { title: '人类', sub: '设计约束 · 握住缰绳' },
        milestones: ['AGENTS.md', '自定义 linter', 'CI 反馈回路'],
        end: { title: '智能体', sub: '如约交付' },
      },
    },
    shift: {
      title: '一句话理解',
      en: 'THE PARADIGM SHIFT',
      rows: [
        { label: '传统工程', chips: ['人类写代码', '机器执行代码'], hot: false },
        { label: 'HARNESS ENG.', chips: ['人类设计约束', '智能体写代码', '机器执行代码'], hot: true },
      ],
      noteLead: '核心转变：工程师的产出，从「代码」变成了',
      noteEm: '「约束系统」',
      noteTail: '——AGENTS.md、架构规则、自定义 linter、反馈回路。',
    },
    conceptsSection: {
      title: '六大核心概念',
      en: 'SIX CORE CONCEPTS',
      intro: '像档案卡一样编号归档——每一张都指向仓库里一篇可追溯的概念笔记。',
      cards: [
        { num: '01', tag: 'REPO = RECORD', title: '仓库即记录系统', desc: '不在仓库里的东西，对智能体不存在。决策、规范、计划一律以版本化工件入库。', path: 'concepts/01', link: '/concepts/01-repo-as-source-of-truth' },
        { num: '02', tag: 'MAP, NOT MANUAL', title: '地图而非手册', desc: 'AGENTS.md 是目录页，不是百科全书。渐进式披露，从小入口点指向更深的文档。', path: 'concepts/00', link: '/concepts/00-overview' },
        { num: '03', tag: 'MECHANICAL', title: '机械化执行', desc: '文档会腐烂，lint 规则不会。自定义 linter 与结构测试，是不变量的守护者。', path: 'concepts/02', link: '/concepts/02-mechanical-enforcement' },
        { num: '04', tag: 'AGENT READABLE', title: '智能体可读性', desc: '优先为智能体的推理优化。选「无聊」的稳定技术，让应用可按 worktree 隔离启动。', path: 'concepts/04', link: '/concepts/04-agent-readability' },
        { num: '05', tag: 'THROUGHPUT', title: '吞吐量改变合并理念', desc: '纠错成本低、等待成本高。PR 生命周期很短，偶发失败靠续跑重跑解决。', path: 'concepts/05', link: '/concepts/05-throughput-changes-merge' },
        { num: '06', tag: 'ENTROPY & GC', title: '熵管理 = 垃圾回收', desc: '技术债是高息贷款。把「黄金规则」编码进仓库，后台任务定期扫描并修复偏差。', path: 'concepts/03', link: '/concepts/03-entropy-and-garbage-collection' },
      ],
    },
    ledgerSection: {
      title: '档案总目',
      en: 'BUILD-TIME · 自动清点',
      intro: `导航与下面每一个数字，都在构建时由脚本从仓库文件系统清点生成，再由 C1–C${stats.checks} 一致性检查守护，不随文档腐烂而漂移。这不是营销数据，是一座档案馆的总目。`,
      rows: [
        { title: '文章索引', sub: 'references/articles.md · 深度摘要', value: stats.articles, unit: '篇', link: '/references/articles' },
        { title: '一手翻译', sub: 'works/*-translation.md', value: stats.translations, unit: '篇', link: '/works/harness-engineering-chinese-interpretation' },
        { title: '概念笔记', sub: 'concepts/', value: stats.concepts, unit: '篇', link: '/concepts/00-overview' },
        { title: '独立思考', sub: 'thinking/', value: stats.thinking, unit: '篇', link: '/thinking/why-this-project-exists' },
        {
          title: '一致性检查',
          sub: `scripts/check-consistency.sh · C1–C${stats.checks}`,
          value: stats.checks,
          unit: '项',
          accent: true,
          link: 'https://github.com/deusyu/harness-engineering/blob/main/scripts/check-consistency.sh',
        },
      ],
    },
    band: {
      title: '仓库即 harness · 自我指涉',
      en: 'THE ARCHIVE RUNS ON WHAT IT RECORDS',
      leadLead: '这个仓库，',
      leadEm: '开始策展自己了',
      leadTail: '。',
      pillars: [
        { tag: 'HUMAN GATE', title: '人类闸门', desc: '「收不收进来」始终是一道人类闸门。人类掌舵，决定什么值得进入档案。' },
        { tag: 'MECHANICAL RAIL', title: '机械护栏', desc: `C1–C${stats.checks} 一致性检查守着计数与保真，不让任何数字悄悄腐烂。` },
        { tag: 'FEEDBACK LOOP', title: '反馈回路', desc: '外部调研的评审，由智能体沿一条固化成 skill 的流水线自动完成。' },
      ],
      noteLead: '于是约束本身成了产品——正是',
      noteLinkText: '「约束即产品」',
      noteLink: '/concepts/07-spec-as-product',
      noteTail: '讲的东西，只不过这一次，实验的对象是仓库自己。',
    },
    routeSection: {
      title: '从哪里开始',
      en: 'A READING ROUTE · 5 PHASES',
      phases: [
        { n: '1', meta: `concepts/ · ${stats.concepts} 篇`, title: '理解核心概念', desc: '覆盖 OpenAI 六大概念，加上控制论扩展与「约束即产品」的延伸。', link: '/concepts/00-overview' },
        { n: '2', meta: `thinking/ · ${stats.thinking} 篇`, title: '形成自己的观点', desc: '质疑、延伸与跨文章洞察——把别人的范式变成自己能用的判断（持续中）。', link: '/thinking/why-this-project-exists' },
        { n: '3', meta: 'practice/ · Ralph Demo', title: '选一个小项目实践', desc: '跑通一个自主循环：321 秒 · $0.31——用最小成本亲手验证方法论。', link: '/practice/01-ralph-demo/README' },
        { n: '4', meta: `feedback/ · ${stats.feedback} 篇`, title: '记录反馈迭代', desc: '把踩坑与修正留成轨迹——「翻译即 harness」是第一篇（持续中）。', link: '/feedback/2026-04-14-translation-as-harness' },
        { n: '5', meta: `works/ · ${stats.translations} 篇翻译 + 原创`, title: '输出可展示的作品', desc: '专业一手翻译加原创综合分析——学习闭环在这里交付。', link: '/works/harness-engineering-chinese-interpretation', last: true },
      ],
    },
  }
}

/**
 * 首页的 Markdown 渲染（/index.md 副本正文与 llms-full.txt 首页条目）：
 * 与 HomeArchive.vue 消费同一份 homeCopy，站内路由输出为 host 绝对链接，
 * 让抓走这份 Markdown 的智能体拿到可直接跟进的 URL。
 * 不含 frontmatter——/index.md 副本的 frontmatter 由 buildEnd 统一加
 * （llms-full 里该内容紧跟生成的元数据块，再带 frontmatter 会形成歧义双块）。
 */
export function homeMarkdown(stats, host) {
  const c = homeCopy(stats)
  const abs = (link) =>
    link.startsWith('/') ? `${host}${link}` : link.startsWith('#') ? `${host}/${link}` : link
  const rein = c.hero.rein
  const lines = [
    `# ${c.hero.titleLead}${c.hero.titleEm}`,
    '',
    c.hero.kicker,
    '',
    c.hero.lede,
    '',
    ...c.hero.actions.map((a) => `- [${a.text}${a.sup != null ? `（${a.sup} 篇）` : ''}](${abs(a.link)})`),
    '',
    `${rein.aria}：${rein.start.title}（${rein.start.sub}）→ ${rein.milestones.join(' → ')} → ${rein.end.title}（${rein.end.sub}）`,
    '',
    `## § 01 ${c.shift.title}（${c.shift.en}）`,
    '',
    ...c.shift.rows.map((r) => `- ${r.label}：${r.chips.join(' → ')}`),
    '',
    `${c.shift.noteLead}${c.shift.noteEm}${c.shift.noteTail}`,
    '',
    `## § 02 ${c.conceptsSection.title}（${c.conceptsSection.en}）`,
    '',
    c.conceptsSection.intro,
    '',
    ...c.conceptsSection.cards.map(
      (card) => `- **${card.num} ${card.title}**（${card.tag}）：${card.desc}（[${card.path}](${abs(card.link)})）`
    ),
    '',
    `## § 03 ${c.ledgerSection.title}（${c.ledgerSection.en}）`,
    '',
    c.ledgerSection.intro,
    '',
    ...c.ledgerSection.rows.map(
      (row) => `- [${row.title}](${abs(row.link)})（${row.sub}）：${row.value} ${row.unit}`
    ),
    '',
    `## § 04 ${c.band.title}（${c.band.en}）`,
    '',
    `${c.band.leadLead}${c.band.leadEm}${c.band.leadTail}`,
    '',
    ...c.band.pillars.map((p) => `- **${p.title}**（${p.tag}）：${p.desc}`),
    '',
    `${c.band.noteLead}[${c.band.noteLinkText}](${abs(c.band.noteLink)})${c.band.noteTail}`,
    '',
    `## § 05 ${c.routeSection.title}（${c.routeSection.en}）`,
    '',
    ...c.routeSection.phases.map(
      (p) => `${p.n}. **${p.title}**（PHASE ${p.n} · ${p.meta}）：${p.desc}（[阅读](${abs(p.link)})）`
    ),
    '',
  ]
  return lines.join('\n')
}
