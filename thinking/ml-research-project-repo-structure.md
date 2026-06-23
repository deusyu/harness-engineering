# 经典 ML Research Project 的 Repo 应该长什么样

## 核心论点

一个经典 ML research project，尤其是 diffusion model、new method、new dataset、new benchmark 这类项目，不应该被组织成简单的：

```text
paper/
src/
train.py
```

它更应该被组织成一个可运行、可验证、可复现、可接续的研究系统：

```text
ml-research repo
  = code system
  + infra system
  + research ledger
  + human-facing deliverables
  + project memory
```

更具体地说：

```text
code/          怎么跑
infra/         在哪里跑
research/      为什么跑、证明什么
deliverables/  给人看的最终表达
data/          数据资产与数据契约
runs/          运行时产生的日志
artifacts/     可追溯的大产物索引
memory/        当前项目推进状态
```

这个结构的目标，不是为了让目录看起来整齐，而是为了让整个研究项目围绕一条证据链运转：

```text
research claim
  -> code experiment
  -> infra target
  -> run logs
  -> artifact index
  -> evidence ledger
  -> deliverable table / figure
```

如果这条链断了，项目就会退化成一堆脚本、日志、checkpoint 和论文草稿。跑了很多实验，但没人能稳定回答：

```text
这个数字来自哪个 run？
这个 run 用的是哪个 config？
这个 config 对应哪个 commit？
这个实验支持哪个 claim？
这个 claim 进了论文哪张表？
baseline 是否公平？
换一台服务器还能不能复现？
```

---

## 1. 推荐目录结构

一个较完整的 diffusion / ML research repo 可以长这样：

```text
my-diffusion-project/
  README.md
  AGENTS.md
  PROJECT.md
  DECISIONS.md

  code/
    src/
      my_method/
        models/
        diffusion/
        data/
        training/
        sampling/
        evaluation/
        metrics/
        utils/

    configs/
      defaults.yaml
      model/
      data/
      train/
      eval/
      sampler/
      experiment/
      baseline/
      benchmark/
      infra/

    scripts/
      train.py
      sample.py
      evaluate.py
      compare_baselines.py
      prepare_data.py
      submit_job.py
      collect_results.py

    baselines/
      wrappers/
      configs/
      reproduction/

    benchmarks/
      tasks/
      metrics/
      protocols/
      runners/

    experiments/
      E001-baseline-reproduction/
      E002-main-method/
      E003-ablation-no-x/

    tests/
      unit/
      smoke/
      regression/

  infra/
    README.md
    inventory.yaml
    targets/
      local-mac.template.yaml
      workstation.template.yaml
      gpu-server.template.yaml
      cluster.template.yaml
    paths/
      logical-paths.yaml
      path-map.template.yaml
    environments/
      uv/
        pyproject.toml
        uv.lock
      conda/
        cuda121-torch.yml
        cuda124-torch.yml
      docker/
        Dockerfile
        compose.yaml
    schedulers/
      local/
      slurm/
      runai/
      tmux/
    launch/
      train.template.sh
      eval.template.sh
      sample.template.sh
      submit.template.sh
    storage/
      datasets.yaml
      checkpoints.yaml
      artifacts.yaml
      logs.yaml
    probes/
      check_cuda.py
      check_dataset.py
      smoke_train.py
      smoke_sample.py
    private/
      README.md

  research/
    METHOD.md
    DATASET.md
    BENCHMARK.md
    claims.yaml
    hypotheses.yaml
    evidence.yaml
    baselines.yaml
    experiment-ledger.yaml
    ablation-matrix.yaml
    comparison-matrix.yaml
    negative-results.md
    reviewer-risks.md

  deliverables/
    paper/
      main.tex
      sections/
      figures/
      tables/
      appendix/

    reviews/
      technical-review.md
      novelty-review.md
      reproducibility-review.md
      reviewer-risk-register.yaml

    rebuttal/
      reviews.yaml
      response-plan.md
      promises.yaml
      final-response.md

    slides/
    project-page/
    artifact-release/

  data/
    cards/
    splits/
    manifests/
    preprocessing/
    checksums/

  runs/
    README.md
    .gitignore

  artifacts/
    README.md
    model-index.yaml
    result-index.yaml
    sample-index.yaml
    .gitignore

  memory/
    current-status.md
    phase-dashboard.yaml
    boards/
      claims.yaml
      experiments.yaml
      evidence.yaml
      infra.yaml
      risks.yaml
      actions.yaml
      decisions.yaml
      handoffs.yaml
```

这不是第一天必须全部实现的模板。

第一天最重要的是把层级关系想清楚：

```text
code/          机器执行层
infra/         运行基底层
research/      研究证据层
deliverables/  人类表达层
memory/        项目状态层
```

---

## 2. 顶层文件

### README.md

`README.md` 面向外部读者和新加入的人，回答：

```text
这个项目研究什么？
核心贡献是什么？
如何快速跑一个 smoke test？
如何复现主要结果？
当前 release / paper / benchmark 状态是什么？
```

不要把 README 写成实验日志。README 应该是入口，而不是事实数据库。

### AGENTS.md

`AGENTS.md` 面向 Agent，回答：

```text
进入项目后先读哪里？
哪些目录是 code、infra、research、deliverables、memory？
改代码后必须跑哪些 smoke checks？
新增实验后必须写回哪些 ledger？
哪些信息不能提交进公开 repo？
哪些节点必须 human approval？
```

对 ML research project 来说，`AGENTS.md` 的关键价值是固定读写协议：

```text
进入时：
AGENTS.md -> memory/current-status.md -> research/claims.yaml -> relevant code/config/experiment

离开时：
update experiment/result -> update evidence -> update memory/current-status.md -> report validation
```

### PROJECT.md

`PROJECT.md` 是项目简介，面向人和 Agent 都可读。

它应该写：

- 研究问题；
- 目标会议或目标产出；
- 主方法简介；
- 数据集和 benchmark 范围；
- 当前阶段；
- 成功标准；
- 不在范围内的内容。

### DECISIONS.md

`DECISIONS.md` 记录关键决策。

ML research 项目里，很多决定会在后期变成暗知识：

- 为什么选这个 baseline，不选另一个；
- 为什么放弃某个 metric；
- 为什么数据 split 这样划；
- 为什么某个 ablation 不再跑；
- 为什么从 conda 转向 uv 或 Docker；
- 为什么某台服务器不再用于主实验。

这些都应该进入 decision log。否则几周后，人和 Agent 都会重新争论同一件事。

---

## 3. code/：机器可执行的研究系统

`code/` 是工程主体。凡是可以被运行、测试、复现、提交到服务器的东西，都应该在这里。

它回答：

```text
这个方法如何实现？
这个实验如何跑？
baseline 如何接入？
benchmark 如何评估？
```

### code/src/

`src/` 放核心算法和训练逻辑。

对 diffusion project，可以拆成：

```text
code/src/my_method/
  models/       # UNet, DiT, VAE, text encoder adapters
  diffusion/    # noise schedule, denoising objective, sampler internals
  data/         # dataset, transforms, dataloader
  training/     # train loop, loss, optimizer, checkpoint
  sampling/     # sampler, guidance, generation pipeline
  evaluation/   # eval loop, evaluator wrappers
  metrics/      # FID, IS, CLIPScore, task-specific metrics
  utils/        # seed, logging, distributed helpers
```

原则：

1. **训练入口要薄。** `train.py` 不应该承载全部逻辑，它只负责加载 config、初始化组件、调用训练循环。
2. **代码要 device-agnostic。** 不要在模块里到处写 `.cuda()`，统一由 runtime / trainer 控制 device。
3. **seed 要可控。** 每个 run 的 seed 应该写入 config 和 result summary。
4. **checkpoint 要可 resume。** 只保存权重不够，optimizer、scheduler、epoch、global step、scaler 都要可恢复。
5. **shape 和数据契约要显式。** diffusion 项目里的 tensor shape、latent space、conditioning 格式非常容易变成隐式假设。

### code/configs/

`configs/` 是实验组合层。

一个实验应该能由 config 完整描述，而不是靠 shell history 复原。

建议拆成：

```text
code/configs/
  defaults.yaml
  model/
  data/
  train/
  eval/
  sampler/
  experiment/
  baseline/
  benchmark/
  infra/
```

`experiment/` 里可以有：

```text
E002-main-method.yaml
E003-ablation-no-x.yaml
E004-low-data-regime.yaml
```

这些 config 应该引用 model/data/train/eval/sampler/baseline/infra 的组件配置。

关键原则：

```text
实验身份 = code commit + config + data split + infra target + seed
```

缺一项，复现链就不完整。

### code/scripts/

`scripts/` 是可执行入口。

典型脚本：

```text
train.py
sample.py
evaluate.py
compare_baselines.py
prepare_data.py
submit_job.py
collect_results.py
```

这些脚本应该稳定、薄、可组合。不要把一次性实验逻辑写死在脚本里；一次性变化应该通过 config 表达。

### code/baselines/

`baselines/` 单独治理 baseline。

baseline 是论文可信度的核心，不应该散落在 notebook、外部 repo clone、临时 shell 脚本里。

建议包含：

```text
code/baselines/
  wrappers/        # 统一调用接口
  configs/         # baseline-specific configs
  reproduction/    # 复现原论文/官方数字的记录
```

每个 baseline 至少记录：

- 来源 repo；
- commit / release；
- 原始环境要求；
- 是否修改过代码；
- 使用的数据 split；
- 复现的原论文指标；
- 与本方法比较时是否共享数据处理、metric、采样预算。

核心原则：

> baseline 不是“能跑就行”，而是要能证明比较是公平的。

### code/benchmarks/

如果项目提出新 benchmark，`benchmarks/` 会成为核心代码产物。

它可以包含：

```text
benchmarks/
  tasks/
  metrics/
  protocols/
  runners/
```

其中：

- `tasks/` 定义任务；
- `metrics/` 定义评估指标；
- `protocols/` 定义输入输出、数据 split、评估预算；
- `runners/` 统一运行本方法和 baseline。

如果 benchmark 规则只写在论文里，不写成代码和 protocol，后续很难复现。

### code/experiments/

`code/experiments/` 放可复现实验定义，不是最终结果仓库。

每个实验目录可以有：

```text
code/experiments/E002-main-method/
  experiment-card.md
  config.yaml
  expected-outputs.yaml
  linked-claims.yaml
  notes.md
```

`experiment-card.md` 应该回答：

```text
这个实验验证什么？
对应哪个 claim？
用哪个 dataset / split？
比较哪些 baseline？
跑几个 seed？
成功标准是什么？
预计产出哪张表或图？
```

实验目录不是为了替代 `research/evidence.yaml`，而是给“怎么跑”一个稳定入口。

### code/tests/

`tests/` 保障代码本身不坏。

建议分三类：

```text
tests/
  unit/         # 小函数、小模块
  smoke/        # tiny dataloader / tiny train / tiny sample
  regression/   # 已经踩过的 bug
```

对 diffusion 项目，smoke test 很重要：

- 数据集能否读取一个 batch；
- 模型 forward 是否 shape 正确；
- loss 是否 finite；
- 训练 2-10 steps 是否能跑通；
- sampler 是否能产出正确 shape；
- eval runner 是否能消费生成结果。

不要等主实验跑 20 小时后才发现 config 或 dataloader 坏了。

---

## 4. infra/：运行基底和计算目标

`infra/` 回答：

```text
这个项目在哪里跑？
每台机器有什么能力？
路径如何映射？
用什么 Python / CUDA / Docker 环境？
用什么 scheduler 提交任务？
数据、checkpoint、log 放哪里？
当前 target 能不能跑？
```

把它叫 `infra/`，而不是 `envs/`，是因为这里的问题远远超过 Python 环境。

一个 ML 项目可能同时有：

- 本地 Mac：写代码、跑 tiny smoke test；
- 本地 workstation：单卡 debug；
- GPU server：主训练；
- SLURM 集群：多 seed ablation；
- RunAI / Kubernetes：批量任务；
- 不同 CUDA / torch / xformers / flash-attn 组合；
- 不同数据挂载路径；
- 不同 checkpoint 和 log 存储策略。

这些都属于 infra。

### infra/inventory.yaml

记录计算目标清单。

示例：

```yaml
targets:
  local_mac:
    role: control_plane_and_smoke_test
    gpu: none
    suitable_for:
      - config_validation
      - dataloader_smoke_test
      - tiny_model_test

  gpu_server_a:
    role: single_node_training
    gpu: A100
    scheduler: tmux
    suitable_for:
      - main_training
      - sampling
      - baseline_reproduction

  cluster_b:
    role: batch_experiments
    scheduler: slurm
    suitable_for:
      - ablations
      - multi_seed_benchmark_runs
```

公开 repo 中建议用逻辑名，不要提交真实内网地址、账号或 token。

### infra/targets/

`targets/` 描述不同类型机器的模板。

```text
targets/
  local-mac.template.yaml
  workstation.template.yaml
  gpu-server.template.yaml
  cluster.template.yaml
```

每个 target template 可以描述：

- device type；
- GPU 数量和显存；
- CUDA / driver 约束；
- scheduler；
- storage mount；
- 是否允许长任务；
- 适合运行哪些实验；
- 禁止事项。

### infra/paths/

`paths/` 解决路径差异。

代码和 config 不应该到处写绝对路径。应该用逻辑路径：

```yaml
logical_paths:
  project_root: "{PROJECT_ROOT}"
  data_root: "{DATA_ROOT}"
  checkpoint_root: "{CHECKPOINT_ROOT}"
  run_root: "{RUN_ROOT}"
  artifact_root: "{ARTIFACT_ROOT}"
```

然后每台机器用 path map overlay 映射。

公开 repo 里放：

```text
infra/paths/path-map.template.yaml
```

真实路径可以放在 gitignored 的：

```text
infra/private/local-mac.yaml
infra/private/gpu-server-a.yaml
infra/private/cluster-b.yaml
```

如果项目是完全私有的，也可以记录真实路径。但如果将来要开源、投稿 artifact、或多人协作，最好从一开始就区分 template 和 private overlay。

### infra/environments/

这里才是原来狭义的 `envs/`。

```text
environments/
  uv/
    pyproject.toml
    uv.lock
  conda/
    cuda121-torch.yml
    cuda124-torch.yml
  docker/
    Dockerfile
    compose.yaml
```

它回答：

```text
Python 依赖是什么？
torch / CUDA 组合是什么？
是否有 Docker 复现路径？
本地测试和服务器训练是否用同一套锁文件？
```

原则：

- 环境规格进 repo；
- 真实虚拟环境目录不进 repo；
- 可重建比“我机器上能跑”重要；
- 如果多服务器环境不同，要显式记录差异。

### infra/schedulers/ 和 infra/launch/

`schedulers/` 记录调度方式：

```text
schedulers/
  local/
  slurm/
  runai/
  tmux/
```

`launch/` 记录启动模板：

```text
launch/
  train.template.sh
  eval.template.sh
  sample.template.sh
  submit.template.sh
```

这能避免每次靠临时命令启动长实验。

一个实验启动应该尽量由这几件事组成：

```text
experiment config
  + infra target
  + launch template
  + path map
```

### infra/storage/

`storage/` 记录数据、checkpoint、artifact、log 的存储策略。

```text
storage/
  datasets.yaml
  checkpoints.yaml
  artifacts.yaml
  logs.yaml
```

ML 项目通常有大量不能进 git 的东西：

- 原始数据；
- 预处理数据；
- checkpoint；
- 生成样本；
- tensorboard / wandb logs；
- 大表格；
- artifact release 包。

这些不进 git，但必须有索引和路径策略。

### infra/probes/

`probes/` 是 infra 的传感器。

```text
probes/
  check_cuda.py
  check_dataset.py
  smoke_train.py
  smoke_sample.py
```

Agent 或人接手项目前，应该能先跑 probe：

```text
当前 target 可用吗？
CUDA / torch / xformers 是否匹配？
dataset manifest 能读吗？
能跑 10 step tiny training 吗？
能生成一个 tiny sample 吗？
```

这比文档里写“服务器可用”可靠。

### infra/private/

`private/` 是 gitignored 的真实机器 overlay。

它可以存：

- 真实路径；
- 本地机器特定配置；
- 私有服务器别名；
- 本地 cache 位置；
- 非公开 storage mount。

但不要存：

- token；
- password；
- 私钥；
- 不该共享的数据路径；
- 会泄露服务器内部结构的敏感信息。

---

## 5. research/：研究事实和证据账本

`research/` 不是论文目录，也不是代码目录。

它是研究是否成立的账本，回答：

```text
我们到底提出了什么？
核心 hypothesis 是什么？
哪些 claim 已经被 evidence 支持？
哪些实验只是 partial？
哪些 baseline 还不公平？
哪些 negative result 改变了研究方向？
reviewer 可能攻击哪里？
```

### research/METHOD.md

描述新方法。

它应该比论文方法部分更直接：

- 方法解决什么问题；
- 与 baseline 的关键差异；
- 核心机制；
- 预期优势；
- 已知限制；
- 需要哪些实验支持。

### research/DATASET.md

如果项目提出新数据集，`DATASET.md` 是数据集的研究说明。

它回答：

- 数据集来源；
- 构造方法；
- 规模；
- split；
- 标注或生成流程；
- 潜在 bias；
- 许可和使用限制；
- 为什么这个数据集能支撑研究问题。

### research/BENCHMARK.md

如果项目提出新 benchmark，`BENCHMARK.md` 描述 benchmark 的任务和协议。

它回答：

- benchmark 衡量什么能力；
- 任务输入输出；
- metric；
- baseline set；
- 评估预算；
- 防止 overfitting 的设计；
- 与已有 benchmark 的区别。

### research/claims.yaml

这是核心文件。

论文里的每个主张都应该有 claim ID。

示例：

```yaml
- id: CLM-002
  claim: "The proposed diffusion training objective improves sample quality in low-data regimes."
  status: partial
  evidence:
    - EVD-014
    - EVD-018
  paper_locations:
    - deliverables/paper/sections/experiments.tex
    - deliverables/paper/tables/table2.tex
  risks:
    - RSK-006
  next_actions:
    - ACT-021
```

没有 claim ID，实验和论文就很容易脱节。

### research/hypotheses.yaml

记录尚未被证明的研究假设。

Hypothesis 和 claim 的区别：

```text
hypothesis 是待验证的研究判断；
claim 是准备写进论文、需要证据支持的主张。
```

### research/evidence.yaml

记录证据。

证据可以来自：

- 实验结果；
- ablation；
- baseline comparison；
- 数据集统计；
- human study；
- 理论分析；
- failure analysis。

每条 evidence 应该能追溯到：

```text
experiment id
config
run id
artifact
commit
data split
metric
```

### research/baselines.yaml

记录 baseline 状态。

它回答：

```text
哪些 baseline 已经复现？
哪些 baseline 只是引用数字？
哪些 baseline 使用官方 checkpoint？
哪些 baseline 重新训练？
哪些 comparison 可能不公平？
```

Baseline 状态应该直接影响 reviewer risk。

### research/experiment-ledger.yaml

连接实验和研究对象。

示例：

```yaml
- experiment: E004-low-data-regime
  claims:
    - CLM-002
  hypotheses:
    - HYP-003
  baselines:
    - BASE-001
    - BASE-004
  status: running
  infra_target: gpu_server_a
  result_summary: null
```

### research/ablation-matrix.yaml

记录 ablation 维度。

它防止这种情况：

```text
论文里说 component X 很重要，但其实没有控制其他变量。
```

### research/comparison-matrix.yaml

记录方法对比矩阵。

它应该包含：

- method；
- dataset；
- split；
- metric；
- sampling budget；
- training budget；
- checkpoint source；
- status；
- paper table。

### research/negative-results.md

记录负结果和失败路线。

这非常重要。

失败如果不记录，后面会发生两件事：

1. 人或 Agent 重复跑已经失败过的方向；
2. 论文叙事会不自觉忽略真实边界。

好的 negative result 记录应该写：

```text
尝试了什么？
为什么当时认为可行？
失败现象是什么？
它反驳了哪个 hypothesis，还是只说明实现/预算不够？
下一步是 drop、narrow，还是 rerun？
```

### research/reviewer-risks.md

记录 reviewer 可能攻击的问题。

例如：

- baseline 不够强；
- 数据集规模太小；
- metric 不合适；
- 新方法只是工程 trick；
- 计算预算不公平；
- diffusion sampling steps 不一致；
- 没有跨数据集泛化；
- 新 benchmark 可能过拟合本方法。

这些风险应该连接到 action，而不是停留在担忧。

---

## 6. deliverables/：给人看的最终产出

`deliverables/` 是表达层，不是真相源头。

它包含：

```text
deliverables/
  paper/
  reviews/
  rebuttal/
  slides/
  project-page/
  artifact-release/
```

这个目录名比把 `paper/`、`reviews/` 平铺在 repo 根目录更准确，因为它们本质上都是面向人的产出。

### deliverables/paper/

论文是最终表达，不是唯一事实来源。

```text
paper/
  main.tex
  sections/
  figures/
  tables/
  appendix/
```

论文里的数字和 claim 应该能回溯到：

```text
deliverables/paper/table
  -> research/evidence.yaml
  -> artifacts/result-index.yaml
  -> runs/
  -> code/experiments/
  -> code/configs/
  -> commit
```

不要让论文草稿成为事实源头。论文可以改叙事，但不能偷偷改变实验事实。

### deliverables/reviews/

内部 review 也属于 human-facing deliverable。

```text
reviews/
  technical-review.md
  novelty-review.md
  reproducibility-review.md
  reviewer-risk-register.yaml
```

这些文件的作用是把人类判断结构化：

- 技术是否成立；
- novelty 是否足够；
- 实验是否公平；
- 复现是否可信；
- reviewer 可能如何质疑。

### deliverables/rebuttal/

投稿后阶段单独放。

```text
rebuttal/
  reviews.yaml
  response-plan.md
  promises.yaml
  final-response.md
```

`promises.yaml` 很关键。rebuttal 中承诺 camera-ready 会补的东西，必须可追踪。

### deliverables/slides/

放 presentation、talk、poster。

Slides 经常会生成新的图和简化叙事。它们同样应该引用 research/evidence，而不是产生孤立数字。

### deliverables/project-page/

项目主页、demo 页面、可视化说明。

如果项目包含 diffusion samples，project page 很容易变成选择性展示。最好让展示样例连接到 artifacts/sample-index.yaml。

### deliverables/artifact-release/

开源或 artifact evaluation 包。

它应该包含：

- release checklist；
- package manifest；
- reproducibility instructions；
- environment requirements；
- model / data license notes。

---

## 7. data/：数据资产与数据契约

`data/` 不一定存原始数据，尤其大数据通常不进 git。

它应该存数据说明和可复现契约：

```text
data/
  cards/
  splits/
  manifests/
  preprocessing/
  checksums/
```

### data/cards/

Dataset card。

记录：

- 数据来源；
- 许可；
- 字段；
- 规模；
- 采集或生成流程；
- bias；
- 使用限制；
- 与研究问题的关系。

### data/splits/

固定 train / val / test 划分。

如果 split 不固定，baseline comparison 就不可信。

### data/manifests/

记录文件列表、样本 ID、版本。

Manifest 是跨服务器复现的关键。不同服务器上的真实路径可以不同，但 manifest 应该一致。

### data/preprocessing/

记录预处理流程。

预处理如果只存在于一次性脚本或 notebook，后续很难解释实验差异。

### data/checksums/

用于确认不同服务器上的数据一致。

这和 `infra/paths/` 配合：

```text
same logical dataset
  -> different physical paths on different machines
  -> same manifest / checksum
```

---

## 8. runs/：运行时日志，不做长期事实源

`runs/` 是训练和评估过程产生的临时运行记录，通常 gitignored。

它可以包含：

```text
runs/
  2026-06-23_E002_seed0/
    stdout.log
    train.log
    tensorboard/
    wandb/
    samples/
```

但长期要保留的结论不应该只躺在 `runs/`。

关键结果应该汇总到：

```text
code/experiments/E###/result-summary.md
research/evidence.yaml
artifacts/result-index.yaml
```

否则三个月后你会有一堆日志，但不知道哪些可信、哪些进了论文。

---

## 9. artifacts/：大产物索引

`artifacts/` 通常不直接存大文件，而是存索引。

```text
artifacts/
  model-index.yaml
  result-index.yaml
  sample-index.yaml
```

它记录：

- checkpoint；
- generated samples；
- metrics；
- tables；
- figures；
- artifact release packages；
- storage location；
- hash；
- source experiment；
- source config；
- source commit。

例如：

```yaml
- id: CKPT-018
  experiment: E002-main-method
  run: RUN-2026-06-23-001
  config: code/configs/experiment/E002-main-method.yaml
  commit: abc1234
  storage: logical:checkpoint_root/E002/seed0/step100000.pt
  sha256: "..."
  supports:
    - EVD-014
```

核心链路是：

```text
checkpoint -> experiment -> config -> commit -> dataset split -> claim
```

这条链必须可追溯。否则论文里的一个数字来自哪个 checkpoint 会变成谜。

---

## 10. memory/：项目推进状态

`memory/` 是给人和 Agent 接续项目用的。

它不替代 `research/`，而是记录当前项目推进状态：

```text
memory/
  current-status.md
  phase-dashboard.yaml
  boards/
    claims.yaml
    experiments.yaml
    evidence.yaml
    infra.yaml
    risks.yaml
    actions.yaml
    decisions.yaml
    handoffs.yaml
```

### memory/current-status.md

短文件，Agent 进入项目时优先读。

回答：

```text
现在做到哪？
当前目标是什么？
最近完成了什么？
当前阻塞是什么？
下一步最小动作是什么？
哪些风险不能忽略？
```

### memory/phase-dashboard.yaml

机器可读项目状态。

例如：

```yaml
active_phase: evidence_accumulation
target_venue: CVPR
next_gate: main_table_ready
active_claims:
  - CLM-002
  - CLM-004
open_actions: 12
high_risks:
  - RSK-006
active_infra_target: gpu_server_a
```

### memory/boards/actions.yaml

任务板，但 action 不应该是孤立 todo。

每个 action 应该连接到 claim、experiment、risk 或 infra blocker：

```yaml
- id: ACT-021
  title: "Rerun E004 low-data ablation with 3 seeds"
  related_claim: CLM-002
  related_risk: RSK-006
  experiment: E004-low-data-regime
  infra_target: cluster_b
  status: blocked
  blocker: "cluster_b dataset path not validated"
```

### memory/boards/infra.yaml

记录当前 infra 状态。

它不替代 `infra/`，而是记录项目推进中的 infra 事实：

```yaml
active_target: gpu_server_a
validated_targets:
  - local_mac
  - gpu_server_a
blocked_targets:
  - cluster_b
open_infra_risks:
  - RSK-007
last_probe_report: infra/reports/probe-2026-06-23.md
```

### memory/boards/decisions.yaml

记录关键选择。

例如：

- drop 某个 baseline；
- freeze dataset split；
- 改主 metric；
- 改训练预算；
- 改投稿目标；
- 某台服务器不再跑主实验。

### memory/boards/handoffs.yaml

记录交接。

每次 Agent 或人结束一个阶段，应该留下：

- 改了什么；
- 跑了什么；
- 哪些检查通过；
- 哪些检查没跑；
- 哪些假设不能当事实；
- 下一步最小动作。

---

## 11. 核心链路：从 Claim 到 Paper Table

这套结构真正的价值在于链路。

一个理想状态下的实验证据链应该是：

```text
CLM-002: 新方法在低数据 regime 下提升 FID
  -> research/claims.yaml
  -> code/experiments/E004-low-data/
  -> code/configs/experiment/E004-low-data.yaml
  -> infra target: gpu_server_a
  -> runs/2026-06-23_E004_seed{0,1,2}
  -> artifacts/result-index.yaml
  -> research/evidence.yaml
  -> deliverables/paper/tables/table2.tex
```

每一层都有自己的职责：

| 层 | 负责的问题 |
|---|---|
| `research/claims.yaml` | 为什么要跑 |
| `code/experiments/` | 怎么定义实验 |
| `code/configs/` | 实验参数是什么 |
| `infra/` | 在哪里跑、怎么跑 |
| `runs/` | 运行时发生了什么 |
| `artifacts/` | 产物在哪里 |
| `research/evidence.yaml` | 结果证明了什么 |
| `deliverables/paper/` | 如何表达给读者 |

这能防止一个常见问题：

```text
实验越跑越多，但 claim 越来越不清楚。
```

---

## 12. 主工作流

一个健康的 ML research repo 应该围绕以下循环运转：

```text
提出 hypothesis / claim
  -> 设计 experiment card
  -> 绑定 config
  -> 选择 infra target
  -> 跑 probe
  -> 提交训练 / 评估
  -> 收集 run logs
  -> 登记 artifacts
  -> 写 result summary
  -> 更新 evidence
  -> 更新 claim status
  -> 投影到 paper table / figure
  -> 更新 memory/current-status.md
```

如果某一步失败，也要写回：

```text
failure
  -> negative-results.md
  -> risks.yaml
  -> actions.yaml
  -> maybe revise hypothesis
```

失败不是噪音。失败是研究图的一部分。

---

## 13. Human Gate 应该放在哪里

ML research 项目里，有些节点不应该让 Agent 自动越过。

建议 human-gated 的节点包括：

- 确认核心 research claim；
- drop / add 关键 baseline；
- 更改 benchmark protocol；
- 更改 dataset split；
- 更改主 metric；
- 采用新数据集或公开数据集；
- 使用大规模计算预算；
- 把 partial evidence 升级为 supported claim；
- 投稿；
- rebuttal strategy；
- artifact release；
- 公开 checkpoint / dataset。

这些 gate 应该写进 `AGENTS.md`、`memory/phase-dashboard.yaml` 或 `infra/launch` 流程，而不是每次靠临时提醒。

---

## 14. 最小可行版本

第一版不用全量目录。

最小可行 ML research repo 可以是：

```text
my-diffusion-project/
  README.md
  AGENTS.md
  PROJECT.md
  DECISIONS.md

  code/
    src/
    configs/
    scripts/
    experiments/
    tests/

  infra/
    inventory.yaml
    paths/
    environments/
    launch/
    probes/
    private/

  research/
    METHOD.md
    claims.yaml
    evidence.yaml
    experiment-ledger.yaml
    negative-results.md

  deliverables/
    paper/

  data/
    cards/
    splits/
    manifests/

  artifacts/
    result-index.yaml

  memory/
    current-status.md
    boards/
      actions.yaml
      decisions.yaml
      infra.yaml
```

如果只能先守住三件事：

1. **claim/evidence 链路**：每个实验必须知道自己服务哪个 claim；
2. **infra/path 可复现**：每个实验必须知道在哪个 target、哪个环境、哪个逻辑路径下跑；
3. **current-status 可接续**：任何人或 Agent 三天后回来都知道下一步是什么。

---

## 15. 结论

一个经典 ML research project 的 repo，不应该只服务“写代码”和“写论文”。

它应该同时服务五件事：

```text
实现方法；
运行实验；
管理基础设施；
积累证据；
表达成果。
```

因此，`paper/`、`reviews/` 这类目录不应该和 `src/`、`experiments/` 平铺成同级概念。它们是 human-facing deliverables。

实验、baseline、benchmark runner、训练脚本、核心算法，应该属于 `code/`。

服务器、路径、conda/uv/Docker、scheduler、storage、probe，应该属于 `infra/`。

研究主张、证据、负结果、comparison matrix，应该属于 `research/`。

当前状态、下一步、风险、决策、交接，应该属于 `memory/`。

这套结构的核心价值可以概括为：

> 把 ML research 从一堆脚本、日志和论文草稿，变成一个 claim-driven、infra-aware、可复现、可接续的研究系统。

