---
name: research-repo-auditor
description: Audit ML research repositories for harness drift, claim/evidence traceability, experiment-contract violations, infra reproducibility gaps, baseline fairness risks, paper-number provenance, and agent handoff quality. Use when asked to review or validate a diffusion, benchmark, dataset, or ML research project repo structure; check whether experiments follow the repo harness; or design/operate a research-repo audit before submission, release, or long-running agent work.
---

# Research Repo Auditor

Use this skill to audit whether an ML research repo still behaves like a claim-driven, infra-aware, reproducible research system.

## Workflow

1. Read `AGENTS.md`, `PROJECT.md`, `memory/current-status.md`, and the relevant `research/*.yaml` files first.
2. Run the deterministic validator if present:

   ```bash
   python3 scripts/check-research-harness.py
   ```

3. Treat validator failures as structural defects, then perform a semantic audit of the research links.
4. Produce a short audit report with findings first, ordered by severity, with file references.

## Mechanical Checks

Verify these contracts:

- `code/experiments/E###-*` has `experiment-card.md`, `config.yaml`, and `linked-claims.yaml`.
- Every experiment links to at least one `CLM-*` or `HYP-*`.
- `research/evidence.yaml` links evidence to experiment, config, run, artifact, commit, data split, and metric.
- `artifacts/result-index.yaml` links results back to evidence and source experiment/config/commit.
- `deliverables/paper/` does not introduce untracked numbers; paper tables and figures point back to evidence IDs.
- Configs and ledgers use logical paths instead of bare machine-specific absolute paths.
- `infra/private/`, run logs, and local overlays are ignored by git.
- `memory/current-status.md` states current goal, blocker/risk, and next smallest action.

## Semantic Audit

Ask these questions after the mechanical pass:

- Does each experiment actually test the claim it claims to support?
- Has partial evidence been promoted to a supported claim too early?
- Are baseline comparisons fair on data split, metric, training budget, sampling budget, and checkpoint source?
- Are negative results reflected in claim status, risks, or next actions?
- Are reviewer risks connected to concrete actions?
- Can a new agent reproduce the next run without relying on shell history or private memory?

## Output Shape

Use this structure:

```text
Findings
- [Severity] file:line — issue, evidence, and required fix.

Open Questions
- Only include questions that block a correct audit.

Validation
- Command run and result, or why it could not run.

Residual Risk
- What the audit could not prove mechanically.
```

Prefer concrete defects over general advice. Do not mark the repo healthy if paper numbers, evidence, artifacts, and configs cannot be traced end to end.
