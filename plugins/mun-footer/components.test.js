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
      h(MunFooter({ links: { "About me": "about" } }), {
        fileData: { slug: "404" },
        ctx: { argv: { serve } },
        cfg: { baseUrl: "quangnd.github.io/mun-digital-garden" },
      }),
    )
  assert.match(render404(false), /href="\/mun-digital-garden\/index\.xml"/)
  assert.match(render404(true), /href="\/index\.xml"/)
  assert.match(render404(false), /href="\/mun-digital-garden\/about"/)
  assert.match(render404(true), /href="\/about"/)
})

test("a bare link resolves from the site root at every page depth", () => {
  const opts = { links: { "About me": "about" } }
  assert.match(footer("index", opts), /<a href="\.\/about">About me<\/a>/)
  assert.match(footer("tags/meta", opts), /<a href="\.\.\/about">About me<\/a>/)
  assert.match(footer("a/b/c", opts), /<a href="\.\.\/\.\.\/about">About me<\/a>/)
})

test("an absolute link is rendered as-is, without a root prefix", () => {
  const html = footer("a/b/c", { links: { Source: "https://example.com/repo" } })
  assert.match(html, /<a href="https:\/\/example\.com\/repo">Source<\/a>/)
  assert.doesNotMatch(html, /\.\.\/https/)
})
