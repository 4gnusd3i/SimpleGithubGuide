# Excellence308's Vibecoded GitHub Guide

This repository is a classroom-friendly Git and GitHub playground built around the fork workflow.

Instead of acting like a generic starter template, it turns the distributed contribution process into something visual and interactive:

- a presentation-style landing page
- an interactive commit-history viewer
- a visitor starmap generated from the `Visitors/` folder
- a repo structure designed to support pull requests and classroom demos

## Project Purpose

The goal of this project is to make core GitHub concepts easier to understand through a real repository and a polished front end.

It is meant to help students practice:

- forking an upstream repository
- cloning their own copy
- creating focused branches
- committing with meaningful metadata
- pushing changes to a fork
- opening pull requests back to the original repository

## Project Structure

- [`index.html`](index.html): main page markup
- [`style.css`](style.css): page styling and animation
- [`assets/js/site.js`](assets/js/site.js): interactive commit and visitor visualizers
- [`data/site-data.json`](data/site-data.json): generated snapshot used by the site
- [`assets/js/site-data-fallback.js`](assets/js/site-data-fallback.js): generated fallback for local file preview
- [`scripts/refresh_site_data.sh`](scripts/refresh_site_data.sh): cross-platform snapshot generator
- [`.github/workflows/refresh-site-data.yml`](.github/workflows/refresh-site-data.yml): workflow that refreshes generated site data on `main`

## Local Preview

Open [`index.html`](index.html) in a browser.

The site will:

- load live static snapshot data from [`data/site-data.json`](data/site-data.json)
- fall back to [`assets/js/site-data-fallback.js`](assets/js/site-data-fallback.js) when the page is opened directly from disk

## Refreshing Site Data

The visualizers are driven by generated data, not browser-side GitHub API calls.

That means the site avoids API rate limits while still showing current repository history and visitor information.

To refresh the snapshot locally, run:

```sh
sh scripts/refresh_site_data.sh
```

This script is written to work across:

- Linux
- macOS
- Windows through Git Bash

By default it generates data for `main`.

If you intentionally want a snapshot for another branch, run:

```sh
SITE_DATA_BRANCH=<branch-name> sh scripts/refresh_site_data.sh
```

## Automation

On pushes to `main`, GitHub Actions automatically regenerates:

- [`data/site-data.json`](data/site-data.json)
- [`assets/js/site-data-fallback.js`](assets/js/site-data-fallback.js)

This keeps the deployed site and the local-file fallback in sync.

## Core Git Workflow

1. Fork the upstream repository.
2. Clone your fork locally.
3. Create a branch for your change.
4. Edit, test, and inspect the result.
5. Commit with a clear message.
6. Push the branch to your fork.
7. Open a pull request back to upstream.

## Useful Commands

- `git status`
  Inspect modified, staged, and untracked files.

- `git checkout -b <branch-name>`
  Create and switch to a new branch.

- `git add <file>`
  Stage a specific file.

- `git commit -m "message"`
  Record one meaningful change in history.

- `git push origin <branch-name>`
  Publish your branch to your fork.

- `git log --oneline --decorate`
  View recent history in a compact format.

## Classroom Pitch

Fork the repo, make it yours, and send your best version back with a pull request.
