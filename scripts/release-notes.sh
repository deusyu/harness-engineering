#!/usr/bin/env bash
# release-notes.sh — print the numbers section of a monthly Release body.
#
# Releases are date snapshots tagged vYYYY.MM (one per month, only when the
# archive grew). This script never counts the library itself: it checks out
# the target commit into a throwaway worktree, runs scripts/check-consistency.sh
# there with CONSISTENCY_EXPORT set, and reads back the authority values the
# checks already guard (C1 article N, C3 concepts/thinking/feedback, C4
# translations, C7 per-track split, number of checks). A red check aborts —
# numbers from a tree that fails C1–C14 are not authoritative.
#
# A few figures no check covers (practice projects, originals, external
# captures, deck pages, extended reading) are counted here from the same
# worktree and labelled "补充统计" in the output.
#
# The previous release is the greatest vYYYY.MM tag below the target tag. With
# one, the output adds per-count deltas plus the translations and numbered
# entries added since that tag. Entry titles are printed without their
# "source / author —" prefix, and translations by Chinese title only, so the
# output carries no personal names; when a name-guard pattern file exists
# (RELEASE_NAME_GUARD, default ~/.config/git/realname-guard.patterns) any
# match aborts the run.
#
# Locale: no multibyte characters inside bracket expressions (see the pitfall
# note in check-consistency.sh); bash 3.2 compatible (no assoc arrays/mapfile).
#
# Usage (repo root):
#   bash scripts/release-notes.sh                  # next release: HEAD, tag v<UTC year.month>
#   bash scripts/release-notes.sh --ref v2026.11   # recompute a published tag
#   bash scripts/release-notes.sh --if-changed     # exit 3 if no content changed since previous tag
#                                                  # (or this month's tag already exists)
# Options:
#   --ref REF        commit to snapshot (default HEAD)
#   --tag vYYYY.MM   tag name (default: REF itself if it is such a tag, else current UTC month)
#   --prev TAG       previous release tag (default: greatest vYYYY.MM tag below --tag; "" = none)
# Exits 0 on success, 2 on usage/check errors, 3 for --if-changed with nothing new.

set -u
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

REF="HEAD"
TAG=""
PREV=""
PREV_SET=0
IF_CHANGED=0
TAG_RE='^v[0-9]{4}\.(0[1-9]|1[0-2])$'
CONTENT_PATHS="concepts thinking practice feedback works tools prompts references README.md README.en.md"

die() { echo "release-notes: $*" >&2; exit 2; }

while [ $# -gt 0 ]; do
  case "$1" in
    --ref)        [ $# -ge 2 ] || die "--ref needs a value"; REF="$2"; shift 2 ;;
    --tag)        [ $# -ge 2 ] || die "--tag needs a value"; TAG="$2"; shift 2 ;;
    --prev)       [ $# -ge 2 ] || die "--prev needs a value"; PREV="$2"; PREV_SET=1; shift 2 ;;
    --if-changed) IF_CHANGED=1; shift ;;
    -h|--help)    sed -n '2,/^$/p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *)            die "unknown argument: $1 (see --help)" ;;
  esac
done

# ─── Resolve target, tag, previous tag ─────────────────────────────────
SHA=$(git rev-parse --verify -q "${REF}^{commit}") || die "unknown ref: $REF"
if [ -z "$TAG" ]; then
  if echo "$REF" | grep -qE "$TAG_RE"; then TAG="$REF"; else TAG="v$(date -u +%Y.%m)"; fi
fi
echo "$TAG" | grep -qE "$TAG_RE" || die "tag must look like vYYYY.MM: $TAG"

TAG_SHA=$(git rev-parse --verify -q "refs/tags/${TAG}^{commit}" || true)
if [ -n "$TAG_SHA" ] && [ "$TAG_SHA" != "$SHA" ]; then
  if [ "$IF_CHANGED" -eq 1 ]; then
    echo "release-notes: $TAG is already released (${TAG_SHA:0:7}); nothing to draft" >&2
    exit 3
  fi
  die "tag $TAG already exists at ${TAG_SHA:0:7}; recompute it with --ref $TAG, or pass --tag for a new one"
fi

if [ "$PREV_SET" -eq 0 ]; then
  PREV=$(git tag -l 'v*' | grep -E "$TAG_RE" | awk -v t="$TAG" '$0 < t' | LC_ALL=C sort | tail -1)
fi
PREV_SHA=""
if [ -n "$PREV" ]; then
  PREV_SHA=$(git rev-parse --verify -q "refs/tags/${PREV}^{commit}") || die "previous tag not found: $PREV"
fi

# shellcheck disable=SC2086  # CONTENT_PATHS is a word list of pathspecs
if [ "$IF_CHANGED" -eq 1 ] && [ -n "$PREV_SHA" ] && git diff --quiet "$PREV_SHA" "$SHA" -- $CONTENT_PATHS; then
  echo "release-notes: no content change since $PREV (${PREV_SHA:0:7}..${SHA:0:7}); nothing to draft" >&2
  exit 3
fi

# ─── Measure: run check-consistency.sh in a clean worktree ─────────────
TMP=$(mktemp -d "${TMPDIR:-/tmp}/release-notes.XXXXXX")
cleanup() {
  for wt in "$TMP"/wt-*; do
    [ -d "$wt" ] && git worktree remove --force "$wt" >/dev/null 2>&1
  done
  rm -rf "$TMP"
  git worktree prune >/dev/null 2>&1
}
trap cleanup EXIT

measure() {  # $1 = label, $2 = commit → $TMP/$1.env ; returns the check's exit code
  local label="$1" sha="$2" wt="$TMP/wt-$1" env="$TMP/$1.env" rc
  git worktree add --detach "$wt" "$sha" >/dev/null 2>&1 || die "cannot create worktree for $sha"
  CONSISTENCY_ROOT="$wt" CONSISTENCY_EXPORT="$env" bash "$ROOT/scripts/check-consistency.sh" >"$TMP/$label.log" 2>&1
  rc=$?
  [ -f "$env" ] || return 2
  (
    cd "$wt" || exit 1
    practice=$(find practice -mindepth 1 -maxdepth 1 -type d 2>/dev/null | wc -l | tr -d ' ')
    original=0
    external=0
    for f in works/*.md; do
      case "$f" in *-translation.md|works/AGENTS.md) continue ;; esac
      # External captures carry source frontmatter; the original synthesis does not.
      if awk 'NR==1 && !/^---/ {exit 1} NR>1 && /^---/ {exit 1} /^sourceUrl:/ {found=1; exit} END {exit !found}' "$f"; then
        external=$((external + 1))
      else
        original=$((original + 1))
      fi
    done
    deck=$(find works/harness-engineering-intro-deck/deck/pages -name '*.page' 2>/dev/null | wc -l | tr -d ' ')
    poster=$(find works/harness-engineering-intro-deck/poster/pages -name '*.page' 2>/dev/null | wc -l | tr -d ' ')
    extended=$(awk '/^#+ / {inside = ($0 ~ /^### 延伸阅读/); next} inside && /^\| \[/ {c++} END {print c+0}' references/AGENTS.md)
    echo "PRACTICE=$practice"
    echo "ORIGINAL=$original"
    echo "EXTERNAL=$external"
    echo "DECK=$deck"
    echo "POSTER=$poster"
    echo "EXTENDED=$extended"
  ) >>"$env"
  return "$rc"
}

val() { sed -n "s/^$2=//p" "$TMP/$1.env" | head -1; }

measure cur "$SHA"
cur_rc=$?
if [ "$cur_rc" -ne 0 ]; then
  echo "release-notes: check-consistency.sh fails at ${SHA:0:7}; numbers are not authoritative:" >&2
  grep -E 'FAIL' "$TMP/cur.log" >&2 || tail -20 "$TMP/cur.log" >&2
  exit 2
fi

HAVE_PREV=0
if [ -n "$PREV_SHA" ]; then
  if measure prev "$PREV_SHA"; then
    HAVE_PREV=1
  else
    echo "release-notes: warning — check-consistency.sh fails at $PREV; deltas omitted" >&2
  fi
fi

# ─── Additions since previous tag ──────────────────────────────────────
new_translations() {
  git diff --name-only --diff-filter=A "$PREV_SHA" "$SHA" -- works \
    | grep -E '^works/[^/]+-translation\.md$' || true
}
translation_title() {  # Chinese title from frontmatter, falling back to sourceTitle
  awk 'NR==1 && !/^---/ {exit} NR>1 && /^---/ {exit}
       /^title:/       { t = $0; sub(/^title:[ \t]*/, "", t) }
       /^sourceTitle:/ { s = $0; sub(/^sourceTitle:[ \t]*/, "", s) }
       END { v = (t != "") ? t : s; gsub(/^"|"$/, "", v); print (v != "") ? v : "(无标题)" }' "$1"
}
entry_titles() {  # numbered headings without "### N. " and the star marker
  grep -E '^### [0-9]+\.' | sed -E 's/^### [0-9]+\. +//; s/^⭐ *//'
}

# ─── Render ────────────────────────────────────────────────────────────
DATE=$(git log -1 --format=%cd --date=format:%Y-%m-%d "$SHA")
YEAR=${TAG:1:4}
MONTH=$((10#${TAG:6:2}))
TITLE="$TAG · 驭缰工程学习档案 $YEAR 年 $MONTH 月快照"

plural() { [ "$1" = "1" ] && echo "$1 $2" || echo "$1 $3"; }

row() {  # label, location, key, unit, source
  local cur prev delta
  cur=$(val cur "$3")
  if [ "$HAVE_PREV" -eq 1 ]; then
    prev=$(val prev "$3")
    delta=$((cur - prev))
    [ "$delta" -gt 0 ] && delta="+$delta"
    [ "$delta" = "0" ] && delta="—"
    echo "| $1 | $2 | $cur $4 | $prev $4 | $delta | $5 |"
  else
    echo "| $1 | $2 | $cur $4 | $5 |"
  fi
}

OUT="$TMP/out.md"
{
  echo "<!-- release-notes.sh tag=$TAG commit=$SHA prev=${PREV:-none} -->"
  echo "## $TAG Release 数字部分"
  echo
  echo "| 项 | 值 |"
  echo "|----|----|"
  echo "| Tag | \`$TAG\` |"
  echo "| 建议标题 | \`$TITLE\` |"
  echo "| 目标提交 | \`$SHA\` |"
  echo "| 快照日期 | $DATE（目标提交的提交日期，正文写「截至 $DATE」） |"
  if [ -n "$PREV" ]; then
    echo "| 上一版 | \`$PREV\`（\`${PREV_SHA:0:7}\`） |"
  else
    echo "| 上一版 | 无（首个 Release） |"
  fi
  echo "| 一致性检查 | \`bash scripts/check-consistency.sh\` 在目标提交上全绿（$(val cur CHECKS) 项） |"
  echo
  echo "### 档案计数（截至 $DATE）"
  echo
  echo "来源列：C1/C3/C4/C7 为 \`check-consistency.sh\` 的权威值；「补充统计」为本脚本按文件统计，一致性检查不覆盖。"
  echo
  if [ "$HAVE_PREV" -eq 1 ]; then
    echo "| 部分 | 位置 | 本版 | $PREV | 变化 | 来源 |"
    echo "|------|------|------|------|------|------|"
  else
    echo "| 部分 | 位置 | 本版 | 来源 |"
    echo "|------|------|------|------|"
  fi
  row "概念笔记" "\`concepts/\`" CONCEPTS "篇" "C3"
  row "独立思考" "\`thinking/\`" THINKING "篇" "C3"
  row "反馈记录" "\`feedback/\`" FEEDBACK "篇" "C3"
  row "翻译" "\`works/*-translation.md\`" TRANSLATIONS "篇" "C4"
  row "研究资料库" "\`references/articles.md\`" ARTICLES "篇" "C1"
  row "脉络一：AI 时代的 Harness Engineering" "\`references/articles.md\`" TRACK1 "篇" "C7"
  row "脉络二：云原生 Harness.io" "\`references/articles.md\`" TRACK2 "篇" "C7"
  row "脉络三：效率悖论与能力进化" "\`references/articles.md\`" TRACK3 "篇" "C7"
  row "机械化检查" "\`scripts/check-consistency.sh\`" CHECKS "项" "检查脚本自身"
  row "动手实践" "\`practice/\`" PRACTICE "个项目" "补充统计"
  row "原创" "\`works/\`" ORIGINAL "篇" "补充统计"
  row "外部中文收录" "\`works/\`" EXTERNAL "篇" "补充统计"
  row "演示物料（PPT）" "\`works/harness-engineering-intro-deck/deck/\`" DECK "页" "补充统计"
  row "演示物料（海报）" "\`works/harness-engineering-intro-deck/poster/\`" POSTER "页" "补充统计"
  row "延伸阅读（不计入资料库）" "\`references/AGENTS.md\`" EXTENDED "篇" "补充统计"
  echo
  echo "### 可直接套用的数字句"
  echo
  echo "- 研究资料库：$(val cur ARTICLES) 篇文章的深度摘要（另有 $(val cur EXTENDED) 篇延伸阅读不计入），分三条脉络：AI 时代的 Harness Engineering $(val cur TRACK1) 篇、云原生 Harness.io $(val cur TRACK2) 篇、效率悖论与能力进化 $(val cur TRACK3) 篇"
  echo "- 演示物料：$(val cur DECK) 页项目介绍 PPT + $(val cur POSTER) 页海报"
  echo "- 仓库维护：\`scripts/check-consistency.sh\` 的 $(val cur CHECKS) 项机械化检查"
  echo "- English: As of $DATE it contains $(plural "$(val cur CONCEPTS)" "concept note" "concept notes"), $(plural "$(val cur THINKING)" essay essays), $(plural "$(val cur PRACTICE)" "hands-on project" "hands-on projects"), $(plural "$(val cur FEEDBACK)" retrospective retrospectives), $(val cur TRANSLATIONS) Chinese translations of key articles, $(plural "$(val cur ORIGINAL)" "original synthesis" "original syntheses"), $(plural "$(val cur EXTERNAL)" "curated Chinese repost" "curated Chinese reposts"), an intro deck, and in-depth summaries of $(val cur ARTICLES) articles."
  echo
  if [ -z "$PREV" ]; then
    echo "### 自上一版以来新增"
    echo
    echo "无上一版 tag（首个 Release），不列增量。"
  else
    echo "### 自 $PREV 以来新增"
    echo
    added=$(new_translations)
    n_added=0
    [ -n "$added" ] && n_added=$(echo "$added" | wc -l | tr -d ' ')
    echo "#### 译文（新增 $n_added 篇）"
    echo
    if [ "$n_added" -eq 0 ]; then
      echo "无。"
    else
      echo "$added" | while IFS= read -r f; do
        echo "- $(translation_title "$TMP/wt-cur/$f")"
      done
    fi
    echo
    git show "$PREV_SHA:references/articles.md" 2>/dev/null | entry_titles | LC_ALL=C sort -u >"$TMP/prev-titles"
    grep -E '^### [0-9]+\.' "$TMP/wt-cur/references/articles.md" >"$TMP/cur-headings"
    : >"$TMP/new-entries"
    while IFS= read -r h; do
      t=$(echo "$h" | entry_titles)
      if ! grep -qxF -- "$t" "$TMP/prev-titles"; then
        num=$(echo "$h" | sed -E 's/^### ([0-9]+)\..*/\1/')
        topic="$t"
        case "$t" in *" — "*) topic="${t#* — }" ;; esac
        echo "- #$num $topic" >>"$TMP/new-entries"
      fi
    done <"$TMP/cur-headings"
    n_new=$(wc -l <"$TMP/new-entries" | tr -d ' ')
    echo "#### 资料库编号条目（新增 $n_new 条）"
    echo
    if [ "$n_new" -eq 0 ]; then echo "无。"; else cat "$TMP/new-entries"; fi
    if [ "$HAVE_PREV" -eq 1 ]; then
      n_delta=$(( $(val cur ARTICLES) - $(val prev ARTICLES) ))
      if [ "$n_new" -ne "$n_delta" ]; then
        echo
        echo "> 注意：按标题比对新增 $n_new 条，但 C1 计数变化为 $n_delta——有条目改了标题或被删除，发布前请人工核对。"
      fi
    fi
  fi
} >"$OUT"

GUARD="${RELEASE_NAME_GUARD:-$HOME/.config/git/realname-guard.patterns}"
if [ -f "$GUARD" ]; then
  grep -vE '^[[:space:]]*(#|$)' "$GUARD" >"$TMP/guard"
  if [ -s "$TMP/guard" ] && grep -qiE -f "$TMP/guard" "$OUT"; then
    die "output matches a pattern in $GUARD; refusing to print it"
  fi
fi

cat "$OUT"
