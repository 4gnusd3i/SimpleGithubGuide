#!/bin/sh
set -eu

repo_root="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
cd "$repo_root"

mkdir -p data

branch="$(git rev-parse --abbrev-ref HEAD)"
head_sha="$(git rev-parse HEAD)"

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
  git log main --pretty=format:'%H%x09%h%x09%an%x09%ad%x09%s' --date=iso-strict |
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
  git log main --pretty=format:'%an' |
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
              file: $file,
              name: $file,
              verified: (($identities | index(($file | ascii_downcase))) != null)
            }
        )
    '
)"

jq -n \
  --arg branch "$branch" \
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
' > data/site-data.json

printf 'Updated %s\n' "data/site-data.json"
