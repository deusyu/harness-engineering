#!/usr/bin/env python3
"""Check an ML research repo for harness drift.

This is a deterministic structural validator. It does not judge whether a
research claim is true; it checks that the repo still exposes the links needed
for a human or agent to audit that claim.
"""

from __future__ import annotations

import argparse
import re
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Any

try:
    import yaml  # type: ignore
except Exception:  # pragma: no cover - dependency is optional by design.
    yaml = None


REQUIRED_DIRS = [
    "code",
    "infra",
    "research",
    "deliverables",
    "data",
    "artifacts",
    "memory",
]

REQUIRED_FILES = [
    "README.md",
    "AGENTS.md",
    "PROJECT.md",
    "DECISIONS.md",
    "research/claims.yaml",
    "research/evidence.yaml",
    "research/experiment-ledger.yaml",
    "artifacts/result-index.yaml",
    "memory/current-status.md",
]

EXPERIMENT_REQUIRED_FILES = [
    "experiment-card.md",
    "config.yaml",
    "linked-claims.yaml",
]

PRIVATE_PATTERNS = [
    re.compile(r"(?i)\b(token|password|passwd|secret|api[_-]?key)\s*[:=]\s*['\"]?[^'\"\s]+"),
    re.compile(r"-----BEGIN (RSA |OPENSSH |EC |DSA )?PRIVATE KEY-----"),
]

ABSOLUTE_PATH_PATTERN = re.compile(r"(?<![A-Za-z0-9_])/(Users|home|mnt|scratch|data|private|Volumes)/[^\s'\"`]+")
ID_PATTERN = re.compile(r"\b(?:CLM|HYP|EVD|ACT|RSK|BASE|RUN|CKPT|ART|EXP)-[A-Za-z0-9_.-]+\b")
EXPERIMENT_DIR_PATTERN = re.compile(r"^E[0-9]{3}[-_].+")
EXCLUDED_PARTS = {
    ".git",
    ".hg",
    ".svn",
    ".venv",
    "venv",
    "node_modules",
    "__pycache__",
    ".mypy_cache",
    ".pytest_cache",
    ".ruff_cache",
    ".omx",
    ".lingtai",
}


@dataclass
class Finding:
    severity: str
    code: str
    path: str
    message: str


class Checker:
    def __init__(self, root: Path, *, warn_only_privacy: bool = False) -> None:
        self.root = root.resolve()
        self.warn_only_privacy = warn_only_privacy
        self.findings: list[Finding] = []
        self.claim_ids: set[str] = set()
        self.evidence_ids: set[str] = set()
        self.experiment_ids: set[str] = set()

    def error(self, code: str, path: str, message: str) -> None:
        self.findings.append(Finding("FAIL", code, path, message))

    def warn(self, code: str, path: str, message: str) -> None:
        self.findings.append(Finding("WARN", code, path, message))

    def rel(self, path: Path) -> str:
        try:
            return str(path.relative_to(self.root))
        except ValueError:
            return str(path)

    def exists(self, rel_path: str) -> bool:
        return (self.root / rel_path).exists()

    def text(self, rel_path: str) -> str:
        path = self.root / rel_path
        try:
            return path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            return path.read_text(errors="replace")

    def load_yaml(self, rel_path: str) -> Any:
        path = self.root / rel_path
        if not path.exists():
            return None
        if yaml is None:
            self.warn(
                "YAML001",
                rel_path,
                "PyYAML is not installed; using regex-only checks for this file",
            )
            return None
        try:
            return yaml.safe_load(path.read_text(encoding="utf-8"))
        except Exception as exc:
            self.error("YAML002", rel_path, f"YAML parse failed: {exc}")
            return None

    def collect_ids_from_yaml_or_text(self, rel_path: str, prefix: str) -> set[str]:
        ids: set[str] = set()
        data = self.load_yaml(rel_path)
        if data is not None:
            for item in walk(data):
                if isinstance(item, dict) and isinstance(item.get("id"), str):
                    value = item["id"]
                    if value.startswith(prefix + "-"):
                        ids.add(value)
            if ids:
                return ids
        if self.exists(rel_path):
            ids.update(match for match in ID_PATTERN.findall(self.text(rel_path)) if match.startswith(prefix + "-"))
        return ids

    def check_structure(self) -> None:
        for dirname in REQUIRED_DIRS:
            if not (self.root / dirname).is_dir():
                self.error("S1", dirname, "required top-level directory is missing")
        for filename in REQUIRED_FILES:
            if not (self.root / filename).is_file():
                self.error("S1", filename, "required harness file is missing")

    def check_gitignore(self) -> None:
        gitignore = self.root / ".gitignore"
        if not gitignore.exists():
            self.warn("S1", ".gitignore", "missing .gitignore; private overlays and run logs may drift into git")
            return
        text = gitignore.read_text(encoding="utf-8", errors="replace")
        for pattern in ["infra/private/", "runs/", "*.log"]:
            if pattern not in text:
                self.warn("S1", ".gitignore", f"recommended ignore pattern missing: {pattern}")

    def check_experiment_contracts(self) -> None:
        experiments = self.root / "code" / "experiments"
        if not experiments.exists():
            self.error("S4", "code/experiments", "experiment directory is missing")
            return
        for child in sorted(experiments.iterdir()):
            if not child.is_dir() or not EXPERIMENT_DIR_PATTERN.match(child.name):
                continue
            self.experiment_ids.add(child.name.split("-", 1)[0])
            for filename in EXPERIMENT_REQUIRED_FILES:
                if not (child / filename).is_file():
                    self.error("S4", self.rel(child / filename), "experiment is missing required file")
            linked_claims = child / "linked-claims.yaml"
            if linked_claims.exists() and not ID_PATTERN.search(linked_claims.read_text(encoding="utf-8", errors="replace")):
                self.error("S4", self.rel(linked_claims), "experiment has no linked claim or hypothesis id")

    def check_references(self) -> None:
        self.claim_ids = self.collect_ids_from_yaml_or_text("research/claims.yaml", "CLM")
        self.evidence_ids = self.collect_ids_from_yaml_or_text("research/evidence.yaml", "EVD")

        if self.exists("research/claims.yaml") and not self.claim_ids:
            self.error("S3", "research/claims.yaml", "no CLM-* claim ids found")
        if self.exists("research/evidence.yaml") and not self.evidence_ids:
            self.warn("S3", "research/evidence.yaml", "no EVD-* evidence ids found yet")

        self.check_unknown_refs("research/evidence.yaml", "CLM", self.claim_ids)
        self.check_unknown_refs("research/claims.yaml", "EVD", self.evidence_ids)
        self.check_unknown_refs("artifacts/result-index.yaml", "EVD", self.evidence_ids)
        self.check_unknown_refs("memory/phase-dashboard.yaml", "CLM", self.claim_ids, required=False)
        self.check_required_fields(
            "research/evidence.yaml",
            ["id", "experiment", "config", "run", "artifact", "commit", "data_split", "metric"],
            "S3",
        )
        self.check_required_fields(
            "artifacts/result-index.yaml",
            ["id", "source_experiment", "source_config", "source_commit"],
            "S3",
        )

        ledger = self.load_yaml("research/experiment-ledger.yaml")
        if isinstance(ledger, list):
            for idx, item in enumerate(ledger):
                if not isinstance(item, dict):
                    continue
                label = f"research/experiment-ledger.yaml[{idx}]"
                if not any(key in item for key in ["experiment", "id"]):
                    self.error("S3", label, "ledger row lacks experiment/id")
                if not item.get("claims") and not item.get("hypotheses"):
                    self.error("S3", label, "ledger row is not linked to claims or hypotheses")
                if not item.get("infra_target"):
                    self.warn("S3", label, "ledger row does not declare infra_target")

    def check_required_fields(self, rel_path: str, fields: list[str], code: str) -> None:
        data = self.load_yaml(rel_path)
        if data is None:
            return
        rows = data if isinstance(data, list) else [data]
        for idx, item in enumerate(rows):
            if not isinstance(item, dict):
                self.error(code, f"{rel_path}[{idx}]", "row is not a mapping")
                continue
            missing = [field for field in fields if not item.get(field)]
            if missing:
                self.error(code, f"{rel_path}[{idx}]", "missing required field(s): " + ", ".join(missing))

    def check_unknown_refs(self, rel_path: str, prefix: str, known: set[str], *, required: bool = True) -> None:
        if not self.exists(rel_path):
            if required:
                self.error("S3", rel_path, "reference source file is missing")
            return
        refs = {match for match in ID_PATTERN.findall(self.text(rel_path)) if match.startswith(prefix + "-")}
        unknown = sorted(refs - known)
        for ref in unknown:
            self.error("S3", rel_path, f"references unknown {prefix} id: {ref}")

    def check_paths_and_privacy(self) -> None:
        for path in sorted(self.root.rglob("*")):
            if not path.is_file() or any(part in EXCLUDED_PARTS for part in path.parts):
                continue
            rel = self.rel(path)
            if path.stat().st_size > 2_000_000:
                continue
            text = path.read_text(encoding="utf-8", errors="replace")
            for pattern in PRIVATE_PATTERNS:
                if pattern.search(text):
                    message = "possible secret or private key committed"
                    if self.warn_only_privacy:
                        self.warn("S8", rel, message)
                    else:
                        self.error("S8", rel, message)
            if rel.startswith(("code/configs/", "code/experiments/", "research/", "artifacts/", "deliverables/paper/")):
                for match in ABSOLUTE_PATH_PATTERN.findall(text):
                    self.error("S5", rel, f"contains bare absolute path rooted at /{match}; use infra/paths logical paths")

    def check_memory(self) -> None:
        status = self.root / "memory" / "current-status.md"
        if not status.exists():
            return
        text = status.read_text(encoding="utf-8", errors="replace").strip()
        if len(text) < 120:
            self.warn("S9", "memory/current-status.md", "status file is very short; handoff state may be incomplete")
        lowered = text.lower()
        for needle in ["next", "下一步", "blocked", "阻塞", "risk", "风险"]:
            if needle in lowered:
                return
        self.warn("S9", "memory/current-status.md", "status file does not mention next step, blocker, or risk")

    def run(self) -> int:
        self.check_structure()
        self.check_gitignore()
        self.check_experiment_contracts()
        self.check_references()
        self.check_paths_and_privacy()
        self.check_memory()
        return self.report()

    def report(self) -> int:
        for finding in self.findings:
            print(f"[{finding.severity}] {finding.code} {finding.path}: {finding.message}")
        failures = [finding for finding in self.findings if finding.severity == "FAIL"]
        warnings = [finding for finding in self.findings if finding.severity == "WARN"]
        print()
        if failures:
            print(f"research harness check failed: {len(failures)} failure(s), {len(warnings)} warning(s)")
            return 1
        print(f"research harness check passed: 0 failure(s), {len(warnings)} warning(s)")
        return 0


def walk(value: Any) -> list[Any]:
    items = [value]
    if isinstance(value, dict):
        for child in value.values():
            items.extend(walk(child))
    elif isinstance(value, list):
        for child in value:
            items.extend(walk(child))
    return items


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(description="Check an ML research repo for harness drift.")
    parser.add_argument("--root", default=".", help="repository root to check")
    parser.add_argument(
        "--warn-only-privacy",
        action="store_true",
        help="report possible secrets as warnings instead of failures",
    )
    args = parser.parse_args(argv)

    root = Path(args.root)
    if not root.exists():
        print(f"root does not exist: {root}", file=sys.stderr)
        return 2
    if not (root / ".git").exists():
        print(f"warning: {root} does not look like a git repository", file=sys.stderr)
    return Checker(root, warn_only_privacy=args.warn_only_privacy).run()


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
