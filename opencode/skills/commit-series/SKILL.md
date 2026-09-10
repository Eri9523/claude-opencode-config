---
name: commit-series
description: Use when creating commits, splitting local changes, opening pull requests, merging to develop, or deploying through repository workflows.
---

# Commit Series and Pull Requests

Use this workflow for repository changes that contain more than one logical unit.

## Commit Rules

- Write commit messages in English.
- Use Conventional Commits: `type(scope): imperative subject`.
- Keep each commit focused on one functional or documentation change.
- Do not combine infrastructure, application behavior, migrations, tests, and documentation when they can be reviewed independently.
- Run `git status`, `git diff`, and `git log --oneline -10` before committing.
- Stage only files belonging to the commit being created.

## Pull Request Rules

- Work from a feature branch; do not push implementation commits directly to `develop` or `main`.
- Always open a pull request with `gh` targeting `develop`.
- Use the `pull-request-quality` skill before creating or updating the pull request.
- Include a concise English summary, test results, deployment notes, and known failures.
- Wait for required checks before merging.
- Merge the pull request into `develop` with the repository's configured merge method, preserving the reviewed commit series when possible.
- After merging, fast-forward the local `develop` branch and verify it matches `origin/develop`.

## Deployment Rules

- Do not run `cdk deploy` manually for normal development or production deployments.
- The GitHub Actions workflow deploys `develop` to the development environment and `main` to production after the corresponding branch update.
- After merging, verify the deployment workflow with `gh run list` or `gh run watch` and report its result.
- Use `cdk synth` only for local validation; deployment credentials and rollout stay in CI.

## Recovery

If a multi-purpose commit was created locally and has not been pushed, create a branch if needed, reset that commit to its parent while keeping the working tree, and rebuild the history as focused commits. Never rewrite commits already pushed to a shared branch without explicit approval.
