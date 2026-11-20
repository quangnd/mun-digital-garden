import test from "node:test"
import assert from "node:assert/strict"
import { render } from "preact-render-to-string"
import { h } from "preact"
import { Explorer } from "./components.js"

const renderExplorer = (opts) => render(h(Explorer(opts), { cfg: {} }))

// Rebuild filterFn the way the browser does: take the string from `data-data-fns` and run it with
// `new Function` in a fresh scope. Calling the returned function directly would hide a closure bug.
const filterFnFromRender = (opts) => {
  const html = renderExplorer(opts)
  const match = html.match(/data-data-fns="([^"]*)"/)
  const dataFns = JSON.parse(match[1].replace(/&quot;/g, '"').replace(/&amp;/g, "&"))
  return new Function("node", `return (${dataFns.filterFn})(node)`)
}

test("excludeSlugs hides the listed slug and the tags folder after the string round trip", () => {
  const filterFn = filterFnFromRender({ excludeSlugs: ["about"] })
  assert.equal(filterFn({ slug: "about", slugSegment: "about" }), false)
  assert.equal(filterFn({ slug: "tags/index", slugSegment: "tags" }), false)
  assert.equal(filterFn({ slug: "garden-map", slugSegment: "garden-map" }), true)
})

test("only an exact full-slug match is excluded", () => {
  const filterFn = filterFnFromRender({ excludeSlugs: ["about"] })
  assert.equal(filterFn({ slug: "notes/about", slugSegment: "about" }), true)
})

test("without excludeSlugs only the tags folder is hidden", () => {
  const filterFn = filterFnFromRender()
  assert.equal(filterFn({ slug: "tags/index", slugSegment: "tags" }), false)
  assert.equal(filterFn({ slug: "about", slugSegment: "about" }), true)
})

test("other options pass through to the community Explorer", () => {
  const html = renderExplorer({
    title: "Ghi chép",
    folderClickBehavior: "collapse",
    excludeSlugs: ["about"],
  })
  assert.match(html, /Ghi chép/)
  assert.match(html, /data-behavior="collapse"/)
})
