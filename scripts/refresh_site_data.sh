#!/bin/sh
set -eu

repo_root="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
cd "$repo_root"

if ! command -v jq >/dev/null 2>&1; then
  printf '%s\n' "jq is required to generate site data." >&2
  exit 1
fi

mkdir -p data assets/js

site_branch="${SITE_DATA_BRANCH:-main}"
head_sha="$(git rev-parse "$site_branch")"

tags_json="$(
  git for-each-ref --format='%(refname:short)%09%(objecttype)%09%(*objectname)%09%(objectname)' refs/tags |
    jq -R -s '
      split("\n")
      | map(select(length > 0) | split("\t"))
      | map({
          name: .[0],
          sha: (if .[1] == "tag" then .[2] else .[3] end)
        })
    '
)"

commits_json="$(
  git log "$site_branch" --pretty=format:'%H%x09%h%x09%an%x09%ad%x09%s' --date=iso-strict |
    jq -R -s '
      split("\n")
      | map(select(length > 0) | split("\t"))
      | map({
          fullSha: .[0],
          sha: .[1],
          author: .[2],
          time: .[3],
          message: .[4]
        })
    '
)"

identities_json="$(
  git log "$site_branch" --pretty=format:'%an' |
    jq -R -s '
      split("\n")
      | map(select(length > 0) | ascii_downcase)
      | unique
    '
)"

visitors_json="$(
  find Visitors -maxdepth 1 -type f -printf '%f\n' | sort |
    jq -R -s --argjson identities "$identities_json" '
      split("\n")
      | map(select(length > 0 and ((ascii_upcase | startswith("CREATE A FILE")) | not)))
      | map(
          . as $file
          | {
              name: $file,
              verified: (($identities | index(($file | ascii_downcase))) != null)
            }
        )
    '
)"

snapshot_json="$(
jq -n \
  --arg branch "$site_branch" \
  --arg headSha "$head_sha" \
  --argjson tags "$tags_json" \
  --argjson commits "$commits_json" \
  --argjson visitors "$visitors_json" '
  {
    branch: $branch,
    commits: (
      $commits
      | reverse
      | map(
          . as $commit
          | {
              sha: .sha,
              author: .author,
              time: .time,
              message: .message,
              labels: (
                (if .fullSha == $headSha then ["HEAD", $branch] else [] end)
                + ($tags | map(select(.sha == $commit.fullSha) | .name)[:2])
              )
            }
        )
    ),
    visitors: $visitors
  }
'
)"

printf '%s\n' "$snapshot_json" > data/site-data.json
printf 'window.SITE_DATA_FALLBACK = %s;\n' "$snapshot_json" > assets/js/site-data-fallback.js

printf 'Updated %s and %s\n' "data/site-data.json" "assets/js/site-data-fallback.js"
