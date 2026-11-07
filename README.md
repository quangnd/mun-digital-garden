# Mun Digital Garden

A [Quartz](https://quartz.jzhao.xyz/) v5 digital garden with the default theme and layout. Only the notes in `content/` are published, to https://quangnd.github.io/mun-digital-garden.

## Local development

```sh
npm ci
npx quartz plugin install
npx quartz build --serve   # http://localhost:8080
```

Requires Node >= 22 and npm >= 10.9.2.

## Deploy

Every push to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages.

One-time setup: repository Settings -> Pages -> Source: GitHub Actions.

`docs/` is the upstream Quartz reference and is not published.

## Daily workflow (Obsidian + Quartz Syncer)

- **Publish / update:** put `publish: true` in the note's frontmatter, then run Syncer "Publish". It commits to `main` and the deploy runs on its own (1-2 min). Check the Actions tab is green.
- **Unpublish:** removing `publish: true` locally is not enough on its own, because the file stays in the repo. Explicitly remove the note through Quartz Syncer, then verify on GitHub that `content/<note>.md` is gone (a "Deleted via Quartz Syncer" commit) and that the deploy is green. Syncer does not delete images, so remove sensitive ones from `content/` yourself.
- **Images and links:** `![[Attachments/name.png]]` and `[[Note name]]`. Link and embed only published notes.
- **Verify:** open the page in a private window. GitHub Pages caches for 10 min.
- **Stale or deleted note still visible:** hard refresh (Cmd+Shift+R) or wait 10 min. Quartz loads its note index once per session, so an open tab does not update.
- **Deploy red:** open the failed run's log. Usual causes are broken frontmatter YAML or a plugin install error.
- **Missing image:** check the file exists in `content/` on GitHub and the embed path matches.

### Privacy

`explicit-publish` is on: only notes with `publish: true` are rendered on the site. It does not make the repo private. Any file committed to this public repo (notes without the flag, images) is readable on GitHub and stays in git history after deletion. Never sync sensitive files. If one slips through, rotate any secret and ask the owner about a history rewrite (force push).

Syncer pushes straight to `main`, so `git pull` before local edits and expect `main` to move while a PR is open.
