#!/usr/bin/env bash
# check-consistency.sh — guard against drift between articles.md and downstream caches.
#
# Seven checks:
#   C1 — articles.md heading numbering is contiguous 1..N
#   C2 — that N matches every downstream count claim
#        (README.md / README.en.md / prompts/deep-research-tracker.md / references/AGENTS.md)
#        Files containing a standalone "<!-- check-consistency: skip-count -->" line
#        are exempted (C2 only — C4/C7 ignore the marker).
#   C3 — *.md count (excluding AGENTS.md) matches the README "X 篇" claim for
#        concepts/, thinking/, feedback/.
#   C4 — works/*-translation.md file count matches every translation count claim
#        (README badges, table summaries, table row counts, Phase 5 mentions, AGENTS snapshot).
#   C5 — README structure tree's concepts/ subtree exposes every concepts/*.md file.
#   C6 — articles.md tracked-products exclusion note ("不计入 N 篇") matches AUTHORITY.
#   C7 — per-track counts (脉络一/二/三) declared in articles.md header agree with
#        every downstream restatement (README × 2, references/AGENTS.md, deep-research-tracker.md).
#
# Usage:  bash scripts/check-consistency.sh        (run from repo root)
# Exits 0 on all-pass, 1 on any failure.

set -u
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

FAIL=0
SKIP_MARK="<!-- check-consistency: skip-count -->"
# Skip marker only counts when it appears as a standalone HTML comment line,
# not when it's embedded in inline backtick documentation describing the syntax.
has_skip_mark() { grep -qE "^${SKIP_MARK}\$" "$1"; }

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
    if has_skip_mark "$file"; then
      echo "  $(yellow SKIP) — $label ($file): skip-count marker present"
      return
    fi
    local found
    found=$(grep -oE "$pattern" "$file" | head -1 | grep -oE '[0-9]+' | head -1 || true)
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

# ─── C4 ────────────────────────────────────────────────────────────────
# Translation count: works/*-translation.md is the source of truth.
# All claim sites (badges, summaries, Phase 5 mentions, AGENTS snapshot,
# and the actual table row counts in both READMEs) must match.
echo "[C4] translation count claims match works/*-translation.md file count"
TRANSLATIONS=$(find works -maxdepth 1 -type f -name '*-translation.md' | wc -l | tr -d ' ')

check_against() {
  # NOTE: deliberately does NOT honor has_skip_mark — the skip marker is
  # documented as opt-out for C2 article counts only. C4/C7 must always run.
  local file="$1" pattern="$2" label="$3" expected="$4"
  local found
  found=$(grep -oE "$pattern" "$file" | head -1 | grep -oE '[0-9]+' | head -1 || true)
  if [ -z "$found" ]; then
    echo "  $(red FAIL) — $label ($file): pattern '$pattern' not found"
    FAIL=1
  elif [ "$found" = "$expected" ]; then
    echo "  $(green PASS) — $label ($file): $found"
  else
    echo "  $(red FAIL) — $label ($file): claims $found, expected $expected"
    FAIL=1
  fi
}

check_table_rows() {
  local file="$1" expected="$2"
  local rows
  rows=$(grep -cE '\(works/[^)]+-translation\.md\)' "$file" || true)
  if [ "$rows" = "$expected" ]; then
    echo "  $(green PASS) — $file translation table rows: $rows"
  else
    echo "  $(red FAIL) — $file translation table: $rows rows, $expected files"
    FAIL=1
  fi
}

check_against "README.md"    'translations-[0-9]+-' "README.md translations badge" "$TRANSLATIONS"
check_against "README.en.md" 'translations-[0-9]+-' "README.en.md translations badge" "$TRANSLATIONS"
check_against "README.md"    '<b>[0-9]+ 篇核心文章的中文翻译' "README.md translation summary" "$TRANSLATIONS"
check_against "README.en.md" '<b>[0-9]+ Chinese translations of key articles' "README.en.md translation summary" "$TRANSLATIONS"
check_against "README.md"    '[0-9]+ 篇翻译 \+ [0-9]+ 篇原创' "README.md Phase 5 mention" "$TRANSLATIONS"
check_against "README.en.md" '[0-9]+ translations \+ [0-9]+ original' "README.en.md Phase 5 mention" "$TRANSLATIONS"
check_against "README.en.md" '[0-9]+ professional translations' "README.en.md roadmap" "$TRANSLATIONS"
check_against "AGENTS.md"    'works/，[0-9]+ 篇翻译' "AGENTS.md Phase 5 snapshot" "$TRANSLATIONS"
check_table_rows "README.md"    "$TRANSLATIONS"
check_table_rows "README.en.md" "$TRANSLATIONS"

# ─── C5 ────────────────────────────────────────────────────────────────
# README structure tree must list every concepts/*.md file (excluding AGENTS).
# Tree extraction: from "├── concepts/" line until the next blank "│" separator,
# then count item lines matching "│   [├└]── ".
echo "[C5] README structure tree exposes every concepts/*.md"
CONCEPTS_FILES=$(find concepts -maxdepth 1 -type f -name '*.md' ! -name 'AGENTS.md' | wc -l | tr -d ' ')

check_concepts_tree() {
  local file="$1"
  local tree_count
  tree_count=$(sed -n '/^├── concepts\//,/^│$/p' "$file" | grep -cE '^│   [├└]── ' || true)
  if [ "$tree_count" = "$CONCEPTS_FILES" ]; then
    echo "  $(green PASS) — $file concepts tree: $tree_count entries"
  else
    echo "  $(red FAIL) — $file concepts tree: $tree_count entries, $CONCEPTS_FILES files"
    FAIL=1
  fi
}

check_concepts_tree "README.md"
check_concepts_tree "README.en.md"

# ─── C6 ────────────────────────────────────────────────────────────────
# articles.md's tracked-products exclusion note must reference the current total.
echo "[C6] articles.md tracked-products exclusion note matches authority"
if [ -z "$AUTHORITY" ]; then
  echo "  $(yellow SKIP) — C1 failed, authority count unknown"
else
  EXCLUDED=$(grep -oE '不计入 [0-9]+ 篇' references/articles.md | head -1 | grep -oE '[0-9]+' || true)
  if [ -z "$EXCLUDED" ]; then
    echo "  $(red FAIL) — references/articles.md: '不计入 N 篇' note not found"
    FAIL=1
  elif [ "$EXCLUDED" = "$AUTHORITY" ]; then
    echo "  $(green PASS) — references/articles.md: 不计入 $EXCLUDED 篇"
  else
    echo "  $(red FAIL) — references/articles.md: 不计入 $EXCLUDED 篇, AUTHORITY says $AUTHORITY"
    FAIL=1
  fi
fi

# ─── C7 ────────────────────────────────────────────────────────────────
# Per-track counts. The articles.md authoritative header declares the split
# (脉络一 N1 + 脉络二 N2 + 脉络三 N3); every site that re-states the split
# must agree. README "Research Library" tables, references/AGENTS.md track
# headings, and prompts/deep-research-tracker.md track lines are the four
# downstream caches.
echo "[C7] per-track counts match articles.md authority"
TRACK1=$(grep -oE '脉络一 [0-9]+' references/articles.md | head -1 | grep -oE '[0-9]+' | head -1 || true)
TRACK2=$(grep -oE '脉络二 [0-9]+' references/articles.md | head -1 | grep -oE '[0-9]+' | head -1 || true)
TRACK3=$(grep -oE '脉络三 [0-9]+' references/articles.md | head -1 | grep -oE '[0-9]+' | head -1 || true)
if [ -z "$TRACK1" ] || [ -z "$TRACK2" ] || [ -z "$TRACK3" ]; then
  echo "  $(red FAIL) — references/articles.md header missing per-track counts (脉络一/二/三)"
  FAIL=1
else
  echo "  authority: 脉络一=$TRACK1, 脉络二=$TRACK2, 脉络三=$TRACK3"
  # README research library table
  check_against "README.md"    'AI 时代的 Harness Engineering \| [0-9]+ 篇' "README.md 脉络一" "$TRACK1"
  check_against "README.md"    '云原生 Harness\.io \| [0-9]+ 篇'           "README.md 脉络二" "$TRACK2"
  check_against "README.md"    '效率悖论与能力进化 \| [0-9]+ 篇'           "README.md 脉络三" "$TRACK3"
  check_against "README.en.md" 'AI-Era Harness Engineering \| [0-9]+ articles?'   "README.en.md 脉络一" "$TRACK1"
  check_against "README.en.md" 'Cloud-Native Harness\.io \| [0-9]+ articles?'     "README.en.md 脉络二" "$TRACK2"
  check_against "README.en.md" 'Efficiency Paradox[^|]*\| [0-9]+ articles?'       "README.en.md 脉络三" "$TRACK3"
  # references/AGENTS.md track headings
  check_against "references/AGENTS.md" '脉络一：AI 时代的 Harness Engineering（[0-9]+ 篇' "references/AGENTS.md 脉络一" "$TRACK1"
  check_against "references/AGENTS.md" '脉络二：云原生 Harness\.io（[0-9]+ 篇'           "references/AGENTS.md 脉络二" "$TRACK2"
  check_against "references/AGENTS.md" '脉络三：效率悖论与能力进化（[0-9]+ 篇'           "references/AGENTS.md 脉络三" "$TRACK3"
  # prompts/deep-research-tracker.md track summary lines
  check_against "prompts/deep-research-tracker.md" '脉络一 — AI 时代 Harness Engineering（[0-9]+ 篇' "deep-research-tracker.md 脉络一" "$TRACK1"
  check_against "prompts/deep-research-tracker.md" '脉络二 — 云原生 Harness\.io（[0-9]+ 篇'         "deep-research-tracker.md 脉络二" "$TRACK2"
  check_against "prompts/deep-research-tracker.md" '脉络三 — 效率悖论（[0-9]+ 篇'                   "deep-research-tracker.md 脉络三" "$TRACK3"
fi

# ─── Summary ───────────────────────────────────────────────────────────
echo
if [ "$FAIL" -eq 0 ]; then
  echo "$(green '✓ all consistency checks passed')"
  exit 0
else
  echo "$(red '✗ consistency checks failed') — fix the entries above and re-run"
  exit 1
fi
