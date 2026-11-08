import test from "node:test"
import assert from "node:assert/strict"
import { render } from "preact-render-to-string"
import { h } from "preact"
import { MunFooter } from "./components.js"

const footer = (slug, opts) => render(h(MunFooter(opts), { fileData: { slug } }))

test("RSS points at the site root feed from every page depth", () => {
  assert.match(footer("index"), /href="\.\/index\.xml"/)
  assert.match(footer("garden-map"), /href="\.\/index\.xml"/)
  assert.match(footer("tags/meta"), /href="\.\.\/index\.xml"/)
  assert.match(footer("a/b/c"), /href="\.\.\/\.\.\/index\.xml"/)
})

test("renders the personal line, configured links, RSS and Quartz attribution", () => {
  const html = footer("index", {
    text: "Dòng riêng.",
    links: { Source: "https://example.com/repo" },
  })
  assert.match(html, /<p>Dòng riêng\.<\/p>/)
  assert.match(html, /<a href="https:\/\/example\.com\/repo">Source<\/a>/)
  assert.match(html, /data-router-ignore/)
  assert.match(html, /Made with <a href="https:\/\/quartz\.jzhao\.xyz\/">Quartz<\/a>/)
})

test("404 uses the absolute base path, or the root when serving", () => {
  const render404 = (serve) =>
    render(
      h(MunFooter({}), {
        fileData: { slug: "404" },
        ctx: { argv: { serve } },
        cfg: { baseUrl: "quangnd.github.io/mun-digital-garden" },
      }),
    )
  assert.match(render404(false), /href="\/mun-digital-garden\/index\.xml"/)
  assert.match(render404(true), /href="\/index\.xml"/)
})
