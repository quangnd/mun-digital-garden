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
