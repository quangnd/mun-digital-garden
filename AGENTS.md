# Agent rules

- Scope: this repo publishes a Quartz v5 site. Only `content/` is published; keep it to intentional, original notes.
- Follow root `DESIGN.md` for the approved Mun Journal visual direction. Prefer `quartz.config.yaml` and `quartz/styles/custom.scss`; preserve native Quartz navigation and publishing behavior.
- Never commit secrets, `node_modules/`, `public/` or `.quartz/`.
- Do not read any Obsidian vault or touch other repositories.
- No remote GitHub actions (repo creation, push, PR, Pages settings) without explicit user approval.
- `docs/` is the upstream Quartz reference; leave it alone.

## Commands

```sh
npm ci
npx quartz plugin install
npx quartz build            # output in public/
npx quartz build --serve    # local preview on :8080
```

## Review policy

- An independent Reviewer is mandatory for privacy, security, the publishing pipeline (`quartz.config.yaml` publish filters/plugins, `.github/workflows/`, Pages/Actions settings), significant code changes, and complex UI/navigation.
- It is optional for small documentation, font, or straightforward configuration changes.
- When the Reviewer is skipped, the PR body records a brief reason.
- The user's "stop for my review" is the merge gate and does not replace the Reviewer.

## Verification

- Reports name the commit SHA that was checked.
- After each fix, rerun the checks the fix affects, not the whole suite by default. For broad changes, include the related regression checks.
- Visual QA means an agent actually opened and looked at the images.
- Reports keep three kinds of evidence apart: automated checks, screenshots viewed, real-device checks.

## Usage report

- Run `planning/usage-report.js` in codemode with `ROOT` set to the coordinator's conversation id. It sums the root and all descendants (each once) and lists input, output, cache read and cache write separately.
- Report the conversations counted and the snapshot time (ISO). Mark the result "partial" if any conversation could not be read; the report's own current turn may be missing from the snapshot, so say so.
- Label cost "estimated API cost at list prices". Amount actually paid through subscriptions: "unknown".
