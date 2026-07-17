#!/usr/bin/env bash
# check-consistency.sh — guard against drift between articles.md and downstream caches.
#
# Twelve checks:
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
#   C8 — local translate-pipeline guard: a 01-analysis.md must not keep claiming
#        "abstract-only / fetch full text later" once sources/<slug>/source-full.md
#        exists. translate/ is gitignored, so this SKIPs on CI / clean clones.
#   C9 — authored prose in concepts/ thinking/ feedback/ must not restate library
#        counts ("N 篇文章 / N 篇翻译 / N 大概念") as live facts. Such counts rot
#        silently (C2/C7 only watch declared claim sites). A count mention is only
#        allowed when the line carries a dated-snapshot qualifier (写作时点 / 当时 /
#        此前 / 首批 / 首轮 / 截至 / 快照); otherwise drop the number and link to
#        references/articles.md instead.
#   C10 — figure fidelity (purely local, zero network): every works/*-translation.md
#         frontmatter must declare sourceFigureCount (null = 原文不可得、未审计 →
#         SKIP). The body must embed at least that many image lines (![ or <img),
#         and every local embed target (imgs/...) must exist on disk.
#   C11 — markdown table shape: in README.md / README.en.md / references/AGENTS.md /
#         references/articles.md / works/AGENTS.md, every table row must carry the
#         same cell count as its header row (separator rows skipped).
#   C12 — entry field completeness: every numbered entry (### N.) in
#         references/articles.md must carry the **作者：** and **日期：** field lines.
#
# Locale pitfall (do NOT reintroduce): bracket expressions containing multibyte
# characters — e.g. [├└] or [^。] — silently break under LC_ALL=C with BSD grep:
# the pattern is compiled byte-wise, the UTF-8 sequences fall apart inside the
# brackets, and the expression never (or wrongly) matches. Use alternation of
# literal strings instead — (├|└) — or split sentences to lines first (see C8).
# Literal multibyte strings OUTSIDE brackets match byte-wise and are safe in
# every locale.
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
  # (├|└) not [├└]: multibyte chars inside a bracket expression break under
  # LC_ALL=C + BSD grep (byte-wise compilation) — see header locale pitfall.
  tree_count=$(sed -n '/^├── concepts\//,/^│$/p' "$file" | grep -cE '^│   (├|└)── ' || true)
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

# ─── C8 ────────────────────────────────────────────────────────────────
# Local translate-pipeline guard: a translation's 01-analysis.md must not keep
# claiming "abstract-only / fetch the full text later" once the full-text source
# (source-full.md) has actually been captured and the works-ready translation
# was produced from it. Catches the analysis↔works-ready drift that let two
# arXiv analyses lie about being abstract-only while the full paper was translated.
#
# translate/ is gitignored, so this check SKIPs cleanly on CI checkouts (and any
# clone without local pipeline drafts) — it only fires where the drafts exist.
echo "[C8] translate analysis files don't falsely claim abstract-only when full text exists"
shopt -s nullglob
analyses=(translate/*/translations/*/01-analysis.md)
if [ "${#analyses[@]}" -eq 0 ]; then
  echo "  $(yellow SKIP) — no translate/ candidate drafts present (CI checkout or clean clone)"
else
  c8_checked=0
  for analysis in "${analyses[@]}"; do
    slug=$(basename "$(dirname "$analysis")")
    base=${analysis%%/translations/*}
    fulltext="$base/sources/$slug/source-full.md"
    [ -f "$fulltext" ] || continue
    c8_checked=$((c8_checked + 1))
    # Split sentences to lines first (。→ newline), then keep the "same
    # sentence" constraint as plain .* — the original [^。]* bracket form is a
    # multibyte bracket expression and breaks under LC_ALL=C (header pitfall).
    if awk '{gsub(/。/, "\n"); print}' "$analysis" | grep -qE '非全文|补抓.*全文|只抓.*摘要|只是摘要页'; then
      echo "  $(red FAIL) — $analysis: still claims abstract-only, but $fulltext exists"
      FAIL=1
    else
      echo "  $(green PASS) — $slug: analysis consistent with captured full text"
    fi
  done
  [ "$c8_checked" -eq 0 ] && echo "  $(yellow SKIP) — no slug has a source-full.md to check against"
fi

# ─── C9 ────────────────────────────────────────────────────────────────
# Authored analysis dirs must not restate library counts as live facts.
# Counts belong to articles.md + the claim sites C2/C3/C4/C7 already watch;
# anywhere else they silently rot. Historical mentions are fine when the line
# marks itself as a dated snapshot.
echo "[C9] no bare library-count claims in concepts/ thinking/ feedback/"
C9_PATTERN='[0-9]+ ?篇(文章|翻译)|[0-9]+ ?大概念'
C9_QUALIFIER='写作时点|当时|此前|首批|首轮|截至|快照'
c9_hits=0
c9_fails=0
while IFS= read -r hit; do
  [ -z "$hit" ] && continue
  c9_hits=$((c9_hits + 1))
  c9_file=${hit%%:*}
  c9_rest=${hit#*:}
  c9_line=${c9_rest%%:*}
  c9_text=${c9_rest#*:}
  if ! echo "$c9_text" | grep -qE "$C9_QUALIFIER"; then
    echo "  $(red FAIL) — $c9_file:$c9_line: bare count claim without snapshot qualifier"
    echo "    fix: drop the number (link references/articles.md) or qualify the line (写作时点/当时/此前/首批/首轮/截至/快照)"
    FAIL=1
    c9_fails=$((c9_fails + 1))
  fi
done <<EOF
$(grep -rnE "$C9_PATTERN" concepts thinking feedback --include='*.md' 2>/dev/null || true)
EOF
if [ "$c9_fails" -eq 0 ]; then
  echo "  $(green PASS) — $c9_hits count mention(s), all snapshot-qualified or none present"
fi

# ─── C10 ───────────────────────────────────────────────────────────────
# Figure fidelity, purely local (zero network). Every works/*-translation.md
# must declare sourceFigureCount in its frontmatter:
#   - field missing            → FAIL (new entries must audit the source's figures)
#   - value null               → SKIP (原文不可得，图数未审计)
#   - numeric N                → body (after the closing ---) must contain at
#                                least N image-embed lines (a line counts when
#                                it contains ![ or <img)
# Additionally, every local embed target (imgs/...) must exist on disk —
# remote embeds (https://...) are tolerated for legacy entries and not fetched.
echo "[C10] translation figure fidelity (sourceFigureCount vs embedded images)"
c10_pass=0
c10_skip=0
c10_fail=0
for tf in works/*-translation.md; do
  declared=$(awk '
    NR==1 { if ($0 !~ /^---[ \t]*$/) exit; next }
    /^---[ \t]*$/ { exit }
    /^sourceFigureCount:/ { sub(/^sourceFigureCount:[ \t]*/, ""); sub(/[ \t]*$/, ""); print; exit }
  ' "$tf")
  if [ -z "$declared" ]; then
    echo "  $(red FAIL) — $tf: frontmatter missing sourceFigureCount"
    FAIL=1; c10_fail=$((c10_fail + 1))
    continue
  fi
  if [ "$declared" = "null" ]; then
    echo "  $(yellow SKIP) — $tf: sourceFigureCount null（原文不可得，图数未审计）"
    c10_skip=$((c10_skip + 1))
    continue
  fi
  case "$declared" in
    *[!0-9]*)
      echo "  $(red FAIL) — $tf: sourceFigureCount '$declared' is neither a number nor null"
      FAIL=1; c10_fail=$((c10_fail + 1))
      continue ;;
  esac
  embedded=$(awk '/^---[ \t]*$/{d++; next} d>=2 && (/!\[/ || /<img/){c++} END{print c+0}' "$tf")
  if [ "$embedded" -lt "$declared" ]; then
    echo "  $(red FAIL) — $tf: declares $declared figure(s), body embeds only $embedded"
    FAIL=1; c10_fail=$((c10_fail + 1))
    continue
  fi
  # Local-path embeds must resolve (paths are relative to works/, per the
  # claude-code-architecture-reverse-translation.md precedent).
  c10_missing=0
  while IFS= read -r img; do
    [ -z "$img" ] && continue
    if [ ! -f "works/$img" ]; then
      echo "  $(red FAIL) — $tf: local embed target missing on disk: works/$img"
      FAIL=1; c10_missing=1
    fi
  done <<C10EOF
$({ grep -oE '\]\(imgs/[^)]+\)' "$tf" | sed -E 's/^\]\((imgs\/[^)" ]+).*/\1/'
    grep -oE '<img[^>]*src="imgs/[^"]+"' "$tf" | sed -E 's/.*src="(imgs\/[^"]+)".*/\1/'
  } 2>/dev/null || true)
C10EOF
  if [ "$c10_missing" -eq 0 ]; then
    c10_pass=$((c10_pass + 1))
  else
    c10_fail=$((c10_fail + 1))
  fi
done
if [ "$c10_fail" -eq 0 ]; then
  echo "  $(green PASS) — $c10_pass file(s) at/above declared figure count ($c10_skip null-skipped), all local embeds resolve"
fi

# ─── C11 ───────────────────────────────────────────────────────────────
# Markdown table shape: every table row must have the same cell count as its
# header row. Parsing rules — kept deliberately narrow, verified zero false
# positives against the current repo:
#   - a table row is a line starting with '|' outside ``` fences (all tables
#     in the checked files start at column 0 and are '|'-terminated);
#   - escaped \| and pipes inside single-backtick inline code are stripped
#     before counting, so they never split a cell;
#   - separator rows (only | - : space) are skipped;
#   - multi-line backtick spans / HTML tables are NOT handled — none exist in
#     the checked files; if one is ever introduced, revisit these rules.
echo "[C11] markdown table rows match header column count"
C11_FILES="README.md README.en.md references/AGENTS.md references/articles.md works/AGENTS.md"
c11_fail=0
for cf in $C11_FILES; do
  c11_errors=$(awk '
    /^[ \t]*```/ { fence = !fence; next }
    fence { next }
    /^\|/ {
      line = $0
      gsub(/\\\|/, "", line)          # escaped pipes do not delimit cells
      gsub(/`[^`]*`/, "", line)       # pipes inside inline code do not delimit
      n = gsub(/\|/, "|", line) - 1   # cells = pipes - 1 (rows are |-terminated)
      if (!intab) { intab = 1; header = n; hline = NR; next }
      if (line ~ /^[|: \t-]+$/) next  # separator row
      if (n != header) print "line " NR " has " n " cells, header (line " hline ") has " header
      next
    }
    { intab = 0 }
  ' "$cf")
  if [ -n "$c11_errors" ]; then
    while IFS= read -r c11_err; do
      echo "  $(red FAIL) — $cf: $c11_err"
    done <<C11EOF
$c11_errors
C11EOF
    FAIL=1
    c11_fail=1
  fi
done
if [ "$c11_fail" -eq 0 ]; then
  echo "  $(green PASS) — every table row matches its header across: $C11_FILES"
fi

# ─── C12 ───────────────────────────────────────────────────────────────
# Entry field completeness: every numbered entry (### N.) in articles.md must
# carry the standard field lines, written repo-wide as
#   - **作者：** X | **日期：** Y
# (both fields may share one line; C12 only requires each label to appear
# somewhere inside the entry block). A block ends at the next #/##/### heading.
echo "[C12] articles.md numbered entries carry 作者/日期 fields"
c12_errors=$(awk '
  function flush() {
    if (head != "") {
      if (!a) print head " (line " hline "): missing **作者：** field"
      if (!d) print head " (line " hline "): missing **日期：** field"
    }
  }
  /^# / || /^## / || /^### / {
    flush(); head = ""; a = 0; d = 0
    if ($0 ~ /^### [0-9]+\./) { head = $0; hline = NR }
    next
  }
  head != "" && /\*\*作者：\*\*/ { a = 1 }
  head != "" && /\*\*日期：\*\*/ { d = 1 }
  END { flush() }
' references/articles.md)
c12_total=$(grep -cE '^### [0-9]+\.' references/articles.md)
if [ -n "$c12_errors" ]; then
  while IFS= read -r c12_err; do
    echo "  $(red FAIL) — references/articles.md: $c12_err"
  done <<C12EOF
$c12_errors
C12EOF
  FAIL=1
else
  echo "  $(green PASS) — all $c12_total numbered entries carry 作者/日期"
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
