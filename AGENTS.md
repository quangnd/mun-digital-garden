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
