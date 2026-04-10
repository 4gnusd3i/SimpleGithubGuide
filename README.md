# Forks, Branches & Pull Requests

This repository is a fork-workflow playground for learning Git and GitHub in a more visual, hands-on way.

It is not meant to be a generic starter template. It is meant to be a safe place to practice the distributed workflow:

- fork someone else's repository
- clone your copy locally
- create branches for focused changes
- commit and push your work
- open a pull request back to the original repository

## Why this repo exists

Git becomes much easier to understand once you stop thinking of it as "files in a folder" and start thinking of it as a shared history made by many people in many places.

This project is built around that idea. The page in [`index.html`](index.html) turns the fork workflow into something you can present on a projector, while the repository itself stays useful as a practice space for:

- distributed version control
- remotes and forks
- branches and commits
- collaboration through pull requests

## Local preview

Open [`index.html`](index.html) in a browser to view the animated landing page.

The styling lives in [`style.css`](style.css).

## Fork workflow at a glance

1. Find the original repository.
2. Fork it to your own GitHub account.
3. Clone your fork to your local machine.
4. Create a branch for your change.
5. Edit files, then check your work with `git status`.
6. Stage the files with `git add`.
7. Commit with a clear message.
8. Push the branch to your fork.
9. Open a pull request from your fork back to the original repository.

## Useful commands

### Local repository commands

- `git init`
  Create a new local Git repository.

- `git status`
  See what changed, what is staged, and what still needs attention.

- `git add <filename>`
  Stage one file.

- `git add -A`
  Stage all current changes.

- `git commit -m "describe change"`
  Save one meaningful step in the project's history.

- `git branch`
  Show local branches.

- `git branch -r`
  Show remote branches.

- `git branch -a`
  Show all branches.

- `git checkout <branch-name>`
  Move to another branch.

- `git checkout -b <branch-name>`
  Create a new branch and switch to it.

- `git log`
  Read the commit history.

- `git merge <branch-name>`
  Merge another branch into the one you are currently on.

### Remote repository commands

- `git clone <remote-repository-link>`
  Copy a remote repository to your local machine.

- `git remote add origin <remote-repository-link>`
  Connect your local repository to a remote one.

- `git pull`
  Fetch and merge changes from the remote repository.

- `git push`
  Send your commits to the remote repository.

## GitHub ideas behind the repo

- A fork is your own copy of someone else's repository on GitHub.
- Your fork lets you experiment without changing the original project directly.
- A pull request is how you propose your changes back to the original repository.
- Review is part of the workflow, not an interruption of it.

## Classroom version

If this gets projected in class, the main pitch is simple:

> Fork the repo, make the idea yours, and send your best version back with a pull request.
