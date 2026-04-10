# Simple Git and GitHub Guide

### The easiest way to create your own repository is to start by making a GitHub repository and then cloning it into a local repository. That way, you dont run into issues with different branch names like Main and Master.

1. Create a repository on GitHub
   - Decide on a suitable name
   - Decide if you want your repository to be public or private
   - Decide what license you want to use
2. From your repository, click the green code button and copy the HTTPS link
3. On your local computer open CMD and navigate to where you want your folder to be
   - Run _git clone \<link to your repository on github\>_
   - A folder for your repository will be created
   - Navigate into the folder
4. Now you have a local git repository that is tied to your GitHub repository.
   - Here you can:
     - Add your files
     - Create branches
     - Merge branches
     - Commit
     - Push changes to GitHub
     - Pull changes from GitHub

### Usefull commands:

**Local repository related commands**

- Initialise an empty local repository
  - _git init_
- See status of the git repository
  - _git status_
- Add files for staging
  - _git add \<filename\>_ ||| add single file
  - _git add -A_ ||| add all files
- Commit changes
  - _git commit -m "\<describe change\>"_
- See branches
  - _git branch_ ||| for local branches
  - _git branch -r_ ||| for remote branches
  - _git branch -a_ ||| for all branches
- Change branch
  - _git checkout \<branch you want to change to\>_
- See commit log
  - _git log_
- Merge two branches
  - _git merge <branch you want to merge into the branch you are in>_

**Remote repository related commands**

- Add a remote repository to a local repository
  - _git add remote origin \<remote repository link\>_
- Clone a remote repository into a local repository
  - _git clone \<remote repository link\>_
- Pull changes from remote repository (combination of _fetch_ and _merge_)
  - _git pull_
- Push changes to remote repository
  - _git push_

**GitHub specific actions**
- Forking a repository means that you make a copy of someone else's repository and save the copy as a repository that you *own*
- If you make changes to your fork of a repository, in order to submit those changes to the original repository. You have to create a pull request.
