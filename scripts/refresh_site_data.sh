#!/bin/sh
set -eu

repo_root="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
cd "$repo_root"

mkdir -p data assets/js

site_branch="${SITE_DATA_BRANCH:-main}"
head_sha="$(git rev-parse "$site_branch")"

tmpdir="$(mktemp -d)"
trap 'rm -rf "$tmpdir"' EXIT HUP INT TERM

commits_file="$tmpdir/commits.txt"
authors_file="$tmpdir/authors.txt"
tags_file="$tmpdir/tags.txt"
visitors_file="$tmpdir/visitors.txt"

git log "$site_branch" --reverse --pretty=format:'%H%x1f%h%x1f%an%x1f%ad%x1f%s%x1e' --date=iso-strict > "$commits_file"
git log "$site_branch" --pretty=format:'%an' > "$authors_file"
git for-each-ref --format='%(refname:short)%1f%(objecttype)%1f%(*objectname)%1f%(objectname)%1e' refs/tags > "$tags_file"

: > "$visitors_file"
for path in Visitors/*; do
  [ -f "$path" ] || continue
  basename "$path"
done | LC_ALL=C sort > "$visitors_file"

awk \
  -v branch="$site_branch" \
  -v head_sha="$head_sha" \
  -v authors_file="$authors_file" \
  -v tags_file="$tags_file" \
  -v visitors_file="$visitors_file" '
  function json_escape(value,    out, i, ch) {
    out = ""
    for (i = 1; i <= length(value); i += 1) {
      ch = substr(value, i, 1)
      if (ch == "\\") {
        out = out "\\\\"
      } else if (ch == "\"") {
        out = out "\\\""
      } else if (ch == "\n") {
        out = out "\\n"
      } else if (ch == "\r") {
        out = out "\\r"
      } else if (ch == "\t") {
        out = out "\\t"
      } else {
        out = out ch
      }
    }
    return out
  }

  function add_label(label) {
    if (label_count > 0) {
      printf ", "
    }
    printf "\"%s\"", json_escape(label)
    label_count += 1
  }

  function normalize_commit_author(author_name, subject,    source_ref, source_parts) {
    if (subject ~ /^Merge pull request #[0-9]+ from /) {
      source_ref = subject
      sub(/^Merge pull request #[0-9]+ from /, "", source_ref)
      split(source_ref, source_parts, "/")
      if (length(source_parts[1]) > 0) {
        return source_parts[1]
      }
    }

    return author_name
  }

  BEGIN {
    FS = "\037"
    RS = "\n"

    while ((getline author < authors_file) > 0) {
      author = tolower(author)
      if (length(author) > 0) {
        identities[author] = 1
      }
    }
    close(authors_file)

    RS = "\036"
    while ((getline tag_record < tags_file) > 0) {
      split(tag_record, tag_parts, FS)
      tag_name = tag_parts[1]
      tag_type = tag_parts[2]
      tag_sha = (tag_type == "tag" ? tag_parts[3] : tag_parts[4])

      if (length(tag_name) == 0 || length(tag_sha) == 0) {
        continue
      }

      tag_count[tag_sha] += 1
      if (tag_count[tag_sha] <= 2) {
        tags[tag_sha, tag_count[tag_sha]] = tag_name
      }
    }
    close(tags_file)

    RS = "\n"
    while ((getline visitor_name < visitors_file) > 0) {
      if (length(visitor_name) == 0) {
        continue
      }
      if (toupper(visitor_name) ~ /^CREATE A FILE/) {
        continue
      }

      visitor_total += 1
      visitors[visitor_total] = visitor_name
      visitor_verified[visitor_total] = (tolower(visitor_name) in identities) ? "true" : "false"
    }
    close(visitors_file)

    RS = "\036"

    print "{"
    printf "  \"branch\": \"%s\",\n", json_escape(branch)
    print "  \"commits\": ["
    commit_total = 0
  }

  {
    if (NF < 5) {
      next
    }

    commit_total += 1
    if (commit_total > 1) {
      print ","
    }

    full_sha = $1
    short_sha = $2
    author = normalize_commit_author($3, $5)
    commit_time = $4
    message = $5

    print "    {"
    printf "      \"sha\": \"%s\",\n", json_escape(short_sha)
    printf "      \"author\": \"%s\",\n", json_escape(author)
    printf "      \"time\": \"%s\",\n", json_escape(commit_time)
    printf "      \"message\": \"%s\",\n", json_escape(message)
    printf "      \"labels\": ["

    label_count = 0
    if (full_sha == head_sha) {
      add_label("HEAD")
      add_label(branch)
    }
    max_labels = tag_count[full_sha]
    if (max_labels > 2) {
      max_labels = 2
    }
    for (label_index = 1; label_index <= max_labels; label_index += 1) {
      add_label(tags[full_sha, label_index])
    }

    print "]"
    printf "    }"
  }

  END {
    print ""
    print "  ],"
    print "  \"visitors\": ["

    for (visitor_index = 1; visitor_index <= visitor_total; visitor_index += 1) {
      if (visitor_index > 1) {
        print ","
      }

      print "    {"
      printf "      \"name\": \"%s\",\n", json_escape(visitors[visitor_index])
      printf "      \"verified\": %s\n", visitor_verified[visitor_index]
      printf "    }"
    }

    print ""
    print "  ]"
    print "}"
  }
' "$commits_file" > data/site-data.json

{
  printf 'window.SITE_DATA_FALLBACK = '
  cat data/site-data.json
  printf ';\n'
} > assets/js/site-data-fallback.js

printf 'Updated %s and %s\n' "data/site-data.json" "assets/js/site-data-fallback.js"
