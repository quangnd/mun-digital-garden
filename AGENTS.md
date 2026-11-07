# Agent rules

- Scope: this repo publishes a Quartz v5 site. Only `content/` is published; keep it to intentional, original notes.
- Keep the default theme, navigation and layout. Config changes go in `quartz.config.yaml`.
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
