#!/usr/bin/env bash
# check-commit-hygiene.sh — commit metadata hygiene for a revision range.
#
# Every commit in the range must satisfy two rules:
#   1. Author and committer emails are GitHub noreply addresses
#      (…@users.noreply.github.com), or noreply@github.com, which GitHub itself
#      uses as committer for web-UI and server-side commits.
#   2. The message carries no Co-authored-by trailer line. Only trailer lines
#      count; mentioning the word in prose is fine.
#
# The rules name no particular person, so they hold for anyone working on a
# branch of this repo. Which noreply address an agent should use is the
# business of the person running it (their own agent rules), not of this repo.
#
# Usage:  bash scripts/check-commit-hygiene.sh [<revision-range>]
#         default range: origin/main..HEAD
# CI:     .github/workflows/commit-hygiene.yml runs this on PRs whose head branch
#         lives in this repo; PRs from forks are skipped.
#
# Output lands in public CI logs, so offending emails are printed masked:
# the check must not leak the address it exists to keep out of the history.

set -u

red()   { printf '\033[31m%s\033[0m' "$1"; }
green() { printf '\033[32m%s\033[0m' "$1"; }

mask() {
  local email="$1"
  case "$email" in
    *@*) printf '%s***@%s' "${email:0:1}" "${email#*@}" ;;
    *)   printf '***' ;;
  esac
}

is_noreply() {
  local email
  email=$(printf '%s' "$1" | tr '[:upper:]' '[:lower:]')
  case "$email" in
    *@users.noreply.github.com | noreply@github.com) return 0 ;;
    *) return 1 ;;
  esac
}

range="${1:-origin/main..HEAD}"

if ! shas=$(git rev-list "$range" 2>/dev/null); then
  echo "$(red ERROR) — cannot resolve revision range: $range"
  exit 2
fi

total=0
FAIL=0
echo "[commit-hygiene] range $range"

for sha in $shas; do
  total=$((total + 1))
  short=$(git rev-parse --short "$sha")
  author=$(git log -1 --format='%ae' "$sha")
  committer=$(git log -1 --format='%ce' "$sha")

  if ! is_noreply "$author"; then
    echo "  $(red FAIL) — $short: author email is not a GitHub noreply address ($(mask "$author"))"
    FAIL=1
  fi
  if ! is_noreply "$committer"; then
    echo "  $(red FAIL) — $short: committer email is not a GitHub noreply address ($(mask "$committer"))"
    FAIL=1
  fi
  if git log -1 --format='%B' "$sha" | grep -qiE '^[[:space:]]*co-authored-by:'; then
    echo "  $(red FAIL) — $short: message carries a Co-authored-by trailer"
    FAIL=1
  fi
done

echo
if [ "$FAIL" -eq 0 ]; then
  echo "$(green '✓ commit hygiene passed') — $total commit(s), noreply identities only, no Co-authored-by trailers"
  exit 0
else
  echo "$(red '✗ commit hygiene failed') — rewrite the commits above before merging;"
  echo "  see \"Cursor Cloud specific instructions\" in AGENTS.md for the filter-branch recipe"
  exit 1
fi
