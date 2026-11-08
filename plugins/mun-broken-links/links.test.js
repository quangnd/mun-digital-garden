import test from "node:test"
import assert from "node:assert/strict"
import vm from "node:vm"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { Backlinks } from "@quartz-community/backlinks"
import { ContentIndex } from "@quartz-community/content-index"
import { render } from "preact-render-to-string"
import MunBrokenLinks from "./index.js"
import { filterPublishedLinks, isUnresolved, markUnresolvedLinks, publishedSlugs } from "./links.js"

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

// Slugs of unpublished notes must not be published in attributes or in contentIndex `links`.
// `site()` is a small published site as crawl-links leaves it: `links` holds simplified slugs
// ("/" is the home page, a trailing "/" a folder or index page). Fresh objects per call because the
// transform edits them in place.
const attachments = ["attachments/doc.pdf", "pic.png"]
const site = () => [
  { slug: "index", frontmatter: { title: "Home" }, links: ["note-a", "folder", "private-note"] },
  {
    slug: "note-a",
    frontmatter: { title: "Note A" },
    links: [
      "private-note",
      "public-b",
      "an-alias",
      "folder",
      "folder/",
      "/",
      "unlisted-page",
      "attachments/doc.pdf",
      "ghi-chép-chưa-viết",
      "missing/",
    ],
  },
  {
    slug: "public-b",
    aliases: ["an-alias"],
    frontmatter: { title: "Public B" },
    links: ["note-a", "private-note"],
  },
  { slug: "unlisted-page", unlisted: true, frontmatter: { title: "Unlisted" }, links: ["note-a"] },
  { slug: "folder/index", frontmatter: { title: "Folder" }, links: [] },
  { slug: "tags/index", frontmatter: { title: "Tags" } },
]
const published = new Set(["index", "note-a", "public-b", "unlisted-page", "folder/index"])
const isPrivate = (link) => ["private-note", "ghi-chép-chưa-viết", "missing/"].includes(link)

/** What the PageTypeDispatcher does before ContentIndex: the transform runs on a page of `data`. */
const runTransform = (data) => {
  const [transform] = MunBrokenLinks().treeTransforms({})
  transform({ type: "root", children: [] }, "note-a", {
    allFiles: data,
    ctx: {
      allFiles: ["note-a.md", "pic.png", "attachments/doc.pdf"],
      allSlugs: ["note-a", ...attachments],
    },
  })
}

test("data.links keeps published pages, aliases, folders, the home page and attachments only", () => {
  const data = site()
  runTransform(data)
  const bySlug = Object.fromEntries(data.map((d) => [d.slug, d]))
  assert.deepEqual(bySlug["note-a"].links, [
    "public-b",
    "an-alias",
    "folder",
    "folder/",
    "/",
    "unlisted-page",
    "attachments/doc.pdf",
  ])
  assert.deepEqual(bySlug["index"].links, ["note-a", "folder"])
  assert.deepEqual(bySlug["public-b"].links, ["note-a"])
  assert.deepEqual(bySlug["folder/index"].links, [])
  assert.equal("links" in bySlug["tags/index"], false, "a page without links gains none")
})

test("the home page link goes when there is no published home page", () => {
  const data = site().filter((d) => d.slug !== "index")
  filterPublishedLinks(data, publishedSlugs(data, attachments))
  assert.equal(data.find((d) => d.slug === "note-a").links.includes("/"), false)
})

test("a rebuild filters again from the first list, so a note published later gets its links back", () => {
  const data = site()
  filterPublishedLinks(data, publishedSlugs(data, attachments))
  assert.equal(data[0].links.includes("private-note"), false)
  const later = [...data, { slug: "private-note", links: [] }]
  filterPublishedLinks(later, publishedSlugs(later, attachments))
  assert.deepEqual(data[0].links, ["note-a", "folder", "private-note"])
})

const emitIndex = async (data) => {
  const output = fs.mkdtempSync(path.join(os.tmpdir(), "mun-links-"))
  const ctx = {
    argv: { output },
    cfg: { configuration: { baseUrl: "example.com/x", pageTitle: "T", locale: "en-US" } },
  }
  const content = data.map((d) => [
    { type: "root", children: [] },
    { data: { relativePath: `${d.slug}.md`, text: `Body of ${d.slug}`, ...d } },
  ])
  await ContentIndex({ enableSiteMap: false, enableRSS: false }).emit(ctx, content, {})
  const index = JSON.parse(fs.readFileSync(path.join(output, "static/contentIndex.json"), "utf8"))
  fs.rmSync(output, { recursive: true })
  return index
}

test("Search data: every entry is unchanged except that unpublished slugs leave `links`", async () => {
  const before = await emitIndex(site())
  const data = site()
  runTransform(data)
  const after = await emitIndex(data)
  assert.deepEqual(Object.keys(after), Object.keys(before))
  assert.equal("unlisted-page" in after, false, "unlisted pages stay out of the index")
  for (const [slug, entry] of Object.entries(before)) {
    assert.deepEqual(
      after[slug],
      { ...entry, links: entry.links.filter((l) => !isPrivate(l)) },
      slug,
    )
  }
  assert.equal(JSON.stringify(after).includes("private-note"), false)
})

// The graph (@quartz-community/graph, graph inline script) draws a link only when its target is
// itself a key of contentIndex.json, after simplifying both ends.
const simplify = (slug) => {
  if (slug === "index" || slug.endsWith("/index")) slug = slug.slice(0, -"index".length)
  slug = slug.replace(/^\//, "")
  return slug.length === 0 ? "/" : slug
}
const graphEdges = (index) => {
  const keys = new Set(Object.keys(index).map(simplify))
  return Object.entries(index).flatMap(([slug, { links }]) =>
    links.filter((l) => keys.has(simplify(l))).map((l) => `${simplify(slug)} -> ${simplify(l)}`),
  )
}

test("Graph: the edges drawn from contentIndex.json are the same before and after", async () => {
  const before = graphEdges(await emitIndex(site()))
  const data = site()
  runTransform(data)
  const after = graphEdges(await emitIndex(data))
  assert.deepEqual(after, before)
  assert.ok(after.includes("/ -> note-a"))
  assert.ok(after.includes("note-a -> public-b"))
  assert.ok(after.includes("note-a -> folder/"))
})

// The component numbers its list ids from a counter shared by all renders.
const backlinks = (data, slug) =>
  render(
    Backlinks()({
      fileData: { slug },
      allFiles: data,
      cfg: { locale: "en-US" },
      ctx: {},
      externalResources: {},
      tree: {},
      children: [],
      displayClass: "",
    }),
  ).replace(/list-\d+/g, "list")

test("Backlinks: every page lists the same pages before and after; public-b still lists note-a", () => {
  const data = site()
  const before = [...published].map((slug) => backlinks(data, slug))
  runTransform(data)
  const after = [...published].map((slug) => backlinks(data, slug))
  assert.deepEqual(after, before)
  assert.match(backlinks(data, "public-b"), /<a href="\.\/note-a" class="internal">Note A<\/a>/)
  assert.doesNotMatch(backlinks(data, "note-a"), /Unlisted/)
})

const embed = (url, block, { camel = true, children } = {}) => {
  const keys = camel
    ? { dataUrl: url, dataBlock: block, dataEmbedAlias: "" }
    : { "data-url": url, "data-block": block, "data-embed-alias": "" }
  return {
    type: "element",
    tagName: "blockquote",
    properties: { className: ["transclude"], ...keys },
    children: children ?? [
      link(
        {
          href: `./${url}${block}`,
          className: ["transclude-inner", "internal", "internal-link", "alias"],
          "data-slug": url,
        },
        `Transclude of ${url}${block}`,
      ),
    ],
  }
}

test("an embed of an unpublished note loses data-url, data-block, data-embed-alias and its slug text", () => {
  const kebab = embed("private-note", "#heading", { camel: false })
  const camel = embed("folder/sub/missing", "#^block")
  markUnresolvedLinks({ type: "root", children: [kebab, camel] }, known, "Chưa có.")
  for (const el of [kebab, camel]) {
    assert.deepEqual(el.properties, { className: ["transclude"] })
    const [inner] = el.children
    assert.equal(el.children.length, 1)
    assert.deepEqual(inner.properties, {
      className: ["transclude-inner", "alias", "unresolved-link"],
      "data-unresolved": "true",
      "data-no-popover": "true",
      role: "link",
      tabIndex: 0,
      ariaDisabled: "true",
    })
    assert.deepEqual(inner.children, [{ type: "text", value: "Chưa có." }])
  }
})

test("an unresolved embed keeps its text when no label is given", () => {
  const el = embed("private-note", "")
  markUnresolvedLinks({ type: "root", children: [el] }, known)
  assert.equal(el.children[0].children[0].value, "Transclude of private-note")
  assert.equal(el.properties.dataUrl, undefined)
})

test("a public embed keeps data-url, data-block, data-embed-alias and its transcluded content", () => {
  // renderTranscludes has replaced the children of a valid embed before the transform runs.
  const children = () => [
    {
      type: "element",
      tagName: "h1",
      properties: {},
      children: [{ type: "text", value: "Public B" }],
    },
    link({
      href: "./public-b#section-one",
      className: ["internal", "internal-link", "transclude-src"],
    }),
  ]
  const page = embed("public-b", "#section-one", { children: children() })
  const alias = embed("an-alias", "")
  const unlisted = embed("unlisted-page", "")
  const pdf = embed("attachments/doc.pdf", "")
  const root = { type: "root", children: [page, alias, unlisted, pdf] }
  const snapshot = JSON.stringify(root)
  markUnresolvedLinks(root, known, "Chưa có.")
  assert.equal(JSON.stringify(root), snapshot)
  assert.equal(page.properties.dataUrl, "public-b")
  assert.equal(page.properties.dataBlock, "#section-one")
  assert.equal(page.properties.dataEmbedAlias, "")
})
