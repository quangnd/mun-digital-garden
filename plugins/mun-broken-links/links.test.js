import test from "node:test"
import assert from "node:assert/strict"
import vm from "node:vm"
import MunBrokenLinks from "./index.js"
import { isUnresolved, markUnresolvedLinks, publishedSlugs } from "./links.js"

const files = [
  { slug: "index" },
  { slug: "note-a" },
  { slug: "unlisted-page", frontmatter: { unlisted: true } },
  { slug: "folder/index" },
  { slug: "folder/sub/nested-note", aliases: ["./sibling"] },
  { slug: "tags/alpha" },
  { slug: "public-b", aliases: ["an-alias", "tên-khác", "/permalink/", "legacy/index"] },
  { slug: "ghi-chép-có-thật" },
]
const known = publishedSlugs(files, [
  "attachments/doc.pdf",
  "pic.png",
  "a/b/photo.jpeg",
  "map.geojson",
  "a/doc.pdf",
])

test("published pages, folder pages, tags and unlisted pages resolve", () => {
  for (const slug of [
    "note-a",
    "unlisted-page",
    "folder/index",
    "folder",
    "folder/sub/nested-note",
    "tags/alpha",
    "ghi-chép-có-thật",
    "index",
  ]) {
    assert.equal(isUnresolved(slug, known), false, slug)
  }
})

test("a note that is not published is unresolved, including diacritics and nesting", () => {
  for (const slug of [
    "private-note",
    "missing",
    "ghi-chép-chưa-viết",
    "folder/sub/missing",
    "v1.2",
  ]) {
    assert.equal(isUnresolved(slug, known), true, slug)
  }
})

test("alias targets resolve, including relative, Vietnamese and permalink aliases", () => {
  for (const slug of ["an-alias", "tên-khác", "permalink", "folder/sub/sibling", "legacy"]) {
    assert.equal(isUnresolved(slug, known), false, slug)
  }
})

test("attachments on disk resolve; an unpublished note with a dot in its name does not", () => {
  for (const slug of [
    "attachments/doc.pdf",
    "pic.png",
    "a/b/photo.jpeg",
    "map.geojson",
    "a/doc.pdf",
  ]) {
    assert.equal(isUnresolved(slug, known), false, slug)
  }
  assert.equal(isUnresolved("node.js-notes", known), true)
  assert.equal(isUnresolved("draft.final", known), true)
  assert.equal(isUnresolved("v1.2", known), true)
  assert.equal(isUnresolved("", known), false)
})

const link = (properties, text = "x") => ({
  type: "element",
  tagName: "a",
  properties,
  children: [{ type: "text", value: text }],
})

test("an unresolved link loses href and data-slug and becomes inert; the rest is untouched", () => {
  const unresolved = link(
    {
      href: "./private-note",
      className: ["internal", "internal-link", "alias"],
      "data-slug": "private-note",
    },
    "Private",
  )
  const resolved = link({
    href: "./note-a",
    className: ["internal", "internal-link"],
    "data-slug": "note-a",
  })
  const external = link({ href: "https://example.com", className: ["external", "external-link"] })
  const anchor = link({ href: "#h", className: ["internal", "internal-link"] })
  const pdf = link({ href: "./a/doc.pdf", className: ["internal"], "data-slug": "a/doc.pdf" })
  const root = {
    type: "root",
    children: [
      {
        type: "element",
        tagName: "p",
        properties: {},
        children: [unresolved, resolved, external, anchor, pdf],
      },
    ],
  }

  markUnresolvedLinks(root, known)

  assert.deepEqual(unresolved.properties, {
    className: ["alias", "unresolved-link"],
    "data-unresolved": "true",
    "data-no-popover": "true",
    role: "link",
    tabIndex: 0,
    ariaDisabled: "true",
  })
  assert.equal(unresolved.children[0].value, "Private")
  assert.equal(resolved.properties.href, "./note-a")
  assert.equal(resolved.properties["data-slug"], "note-a")
  assert.equal(external.properties.href, "https://example.com")
  assert.equal(anchor.properties.href, "#h")
  assert.equal(pdf.properties.href, "./a/doc.pdf")
})

test("the data-slug key may also arrive as dataSlug", () => {
  const a = link({ href: "./x", className: ["internal"], dataSlug: "private-note" })
  markUnresolvedLinks({ type: "root", children: [a] }, known)
  assert.equal(a.properties.href, undefined)
  assert.equal(a.properties.dataSlug, undefined)
})

test("the page type never matches a page, adds one tree transform and ships a valid script", () => {
  const plugin = MunBrokenLinks({ message: "Chưa có." })
  assert.equal(plugin.match({ slug: "note-a", fileData: {}, cfg: {} }), false)
  assert.equal(plugin.treeTransforms({}).length, 1)
  const script = plugin.body().afterDOMLoaded
  assert.match(script, /"Chưa có\."/)
  assert.doesNotThrow(() => new vm.Script(script))
  assert.match(MunBrokenLinks().body().afterDOMLoaded, /Ghi chép này chưa có trên website\./)
})

test("the transform reads allFiles once per build and rewrites the tree it is given", () => {
  const [transform] = MunBrokenLinks().treeTransforms({})
  const a = link({ href: "./private-note", className: ["internal"], "data-slug": "private-note" })
  transform({ type: "root", children: [a] }, "note-a", {
    allFiles: files,
    ctx: { allFiles: ["a.md", "pic.png"], allSlugs: ["a", "pic.png"] },
  })
  assert.equal(a.properties.href, undefined)
  assert.equal(a.properties.role, "link")
})
