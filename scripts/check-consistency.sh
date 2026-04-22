#!/usr/bin/env bash
# check-consistency.sh — guard against drift between articles.md and downstream caches.
#
# Three checks:
#   C1 — articles.md heading numbering is contiguous 1..N
#   C2 — that N matches every downstream count claim
#        (README.md / README.en.md / prompts/deep-research-tracker.md / references/AGENTS.md)
#        Files containing "<!-- check-consistency: skip-count -->" are exempted.
#   C3 — *.md count (excluding AGENTS.md) matches the README "X 篇" claim for
#        concepts/, thinking/, feedback/.
#
# Usage:  bash scripts/check-consistency.sh        (run from repo root)
# Exits 0 on all-pass, 1 on any failure.

set -u
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

FAIL=0
SKIP_MARK="<!-- check-consistency: skip-count -->"

red()    { printf '\033[31m%s\033[0m' "$1"; }
green()  { printf '\033[32m%s\033[0m' "$1"; }
yellow() { printf '\033[33m%s\033[0m' "$1"; }

# ─── C1 ────────────────────────────────────────────────────────────────
echo "[C1] articles.md numbering is contiguous 1..N"
nums=$(grep -nE '^### [0-9]+\.' references/articles.md | sed -E 's/^[0-9]+:### ([0-9]+)\..*/\1/')
sorted=$(echo "$nums" | sort -n)
n=$(echo "$sorted" | wc -l | tr -d ' ')
expected=$(seq 1 "$n")
if [ "$sorted" = "$expected" ]; then
  echo "  $(green PASS) — $n contiguous entries (1..$n)"
  AUTHORITY="$n"
else
  echo "  $(red FAIL) — numbering not contiguous"
  echo "  actual:   $(echo "$sorted" | tr '\n' ' ')"
  echo "  expected: $(echo "$expected" | tr '\n' ' ')"
  FAIL=1
  AUTHORITY=""
fi

# ─── C2 ────────────────────────────────────────────────────────────────
echo "[C2] downstream count claims match articles.md"
if [ -z "$AUTHORITY" ]; then
  echo "  $(yellow SKIP) — C1 failed, authority count unknown"
else
  check_count() {
    local file="$1" pattern="$2" label="$3"
    if grep -qF "$SKIP_MARK" "$file"; then
      echo "  $(yellow SKIP) — $label ($file): skip-count marker present"
      return
    fi
    local found
    found=$(grep -oE "$pattern" "$file" | head -1 | grep -oE '[0-9]+' || true)
    if [ -z "$found" ]; then
      echo "  $(red FAIL) — $label ($file): pattern '$pattern' not found"
      FAIL=1
    elif [ "$found" = "$AUTHORITY" ]; then
      echo "  $(green PASS) — $label ($file): $found"
    else
      echo "  $(red FAIL) — $label ($file): claims $found, articles.md says $AUTHORITY"
      FAIL=1
    fi
  }

  check_count "README.md"                        'articles-[0-9]+-'  "README.md badge"
  check_count "README.en.md"                     'articles-[0-9]+-'  "README.en.md badge"
  check_count "prompts/deep-research-tracker.md" '核心文章 [0-9]+ 篇' "deep-research-tracker.md header"
  check_count "references/AGENTS.md"             '[0-9]+ 篇文章'      "references/AGENTS.md overview"
fi

# ─── C3 ────────────────────────────────────────────────────────────────
echo "[C3] subdirectory file counts match README claims"
check_dir_count() {
  local dir="$1" claim_pattern="$2"
  local actual
  actual=$(find "$dir" -maxdepth 1 -type f -name '*.md' ! -name 'AGENTS.md' | wc -l | tr -d ' ')
  local claim
  claim=$(grep -oE "$claim_pattern" README.md | head -1 | grep -oE '[0-9]+' || true)
  if [ -z "$claim" ]; then
    echo "  $(red FAIL) — $dir: README claim pattern '$claim_pattern' not found"
    FAIL=1
  elif [ "$actual" = "$claim" ]; then
    echo "  $(green PASS) — $dir: $actual files = README claim $claim"
  else
    echo "  $(red FAIL) — $dir: $actual *.md files, README claims $claim 篇"
    FAIL=1
  fi
}

check_dir_count "concepts" '概念笔记（[0-9]+ 篇'
check_dir_count "thinking" '独立思考与质疑（[0-9]+ 篇'
check_dir_count "feedback" '踩坑与迭代心得（[0-9]+ 篇'

# ─── Summary ───────────────────────────────────────────────────────────
echo
if [ "$FAIL" -eq 0 ]; then
  echo "$(green '✓ all consistency checks passed')"
  exit 0
else
  echo "$(red '✗ consistency checks failed') — fix the entries above and re-run"
  exit 1
fi
