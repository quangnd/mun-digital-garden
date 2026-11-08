import test, { before, after } from "node:test"
import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"

// A real `quartz build` of a small fixture kept outside the repository (never the real content).
// It checks the whole pipeline, including that the transform runs before the content-index emitter.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..")
const SECRET = "zz-private-canary-7f3"
const note = (title, body, extra = "") =>
  `---\npublish: true\ntitle: ${title}\n${extra}---\n${body}\n`
const fixture = {
  "index.md": note("Home", "See [[note-a]] and [[folder]]."),
  "folder/index.md": note("Folder", "Folder index."),
  [`${SECRET}.md`]: "---\npublish: false\ntitle: Hidden\n---\nHidden body.\n",
  "note-a.md": note(
    "Note A",
    [
      `Typed [[${SECRET}]] and [[${SECRET}|alias text]] and [md](${SECRET}).`,
      `Embed: ![[${SECRET}]]`,
      `Embed block: ![[${SECRET}#heading]]`,
      "Public: [[public-b]] [[an-alias]] [[folder]] [[folder/index]] [[/]] [[unlisted-c]]",
      "Public embed: ![[public-b]]",
      "Public block embed: ![[public-b#Section One]]",
      "Attachment: [doc](attachments/doc.pdf) ![[attachments/pic.png]]",
    ].join("\n\n"),
  ),
  "public-b.md": note(
    "Public B",
    "Public body.\n\n## Section One\n\nSection text. [[note-a]]",
    "aliases: [an-alias]\n",
  ),
  "unlisted-c.md": note("Unlisted C", "Unlisted body.", "unlisted: true\n"),
  "attachments/doc.pdf": "%PDF-1.4\n",
  "attachments/pic.png": "x",
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "mun-links-build-"))
const content = path.join(tmp, "content")
const out = path.join(tmp, "out")
let build
const read = (file) => fs.readFileSync(path.join(out, file), "utf8")
const outputFiles = () =>
  fs.readdirSync(out, { recursive: true }).filter((f) => fs.statSync(path.join(out, f)).isFile())

before(() => {
  for (const [file, text] of Object.entries(fixture)) {
    fs.mkdirSync(path.dirname(path.join(content, file)), { recursive: true })
    fs.writeFileSync(path.join(content, file), text)
  }
  build = spawnSync(
    process.execPath,
    ["quartz/bootstrap-cli.mjs", "build", "-d", content, "-o", out],
    { cwd: root, encoding: "utf8" },
  )
})
after(() => fs.rmSync(tmp, { recursive: true, force: true }))

test("the fixture builds and the hidden note is not published", () => {
  assert.equal(build.status, 0, build.stdout + build.stderr)
  assert.equal(fs.existsSync(path.join(out, `${SECRET}.html`)), false)
})

test("contentIndex.json lists no unpublished slug in `links` and keeps the valid ones", () => {
  const index = JSON.parse(read("static/contentIndex.json"))
  assert.deepEqual(index["note-a"].links, [
    "public-b",
    "an-alias",
    "folder",
    "folder/",
    "/",
    "unlisted-c",
    "attachments/doc.pdf",
  ])
  assert.deepEqual(index["public-b"].links, ["note-a"])
  assert.deepEqual(index["index"].links, ["note-a", "folder"])
  assert.equal("unlisted-c" in index, false, "unlisted pages stay out of the index")
})

test("no href, src or data-* attribute and no json `links` array carries the unpublished slug", () => {
  const attribute = new RegExp(`\\s(?:href|src|data-[\\w-]+)="[^"]*${SECRET}`)
  for (const rel of outputFiles()) {
    if (/\.(html|xml|js|txt|css)$/.test(rel)) {
      assert.doesNotMatch(read(rel), attribute, rel)
    } else if (rel.endsWith(".json")) {
      for (const entry of Object.values(JSON.parse(read(rel)))) {
        if (Array.isArray(entry?.links)) assert.equal(entry.links.includes(SECRET), false, rel)
      }
    }
  }
})

test("an embed of an unpublished note has no data-url, data-block or data-embed-alias", () => {
  const tags = read("note-a.html").match(/<blockquote class="transclude"[^>]*>/g)
  assert.equal(tags.filter((tag) => tag === '<blockquote class="transclude">').length, 2)
})

test("backlinks: public-b still lists note-a", () => {
  assert.match(
    read("public-b.html"),
    /<div class="backlinks">.*<a href="\.\/note-a" class="internal">Note A<\/a>/,
  )
})

test("public embeds keep data-url and data-block and still transclude", () => {
  const html = read("note-a.html")
  assert.match(
    html,
    /<blockquote class="transclude" data-url="public-b" data-block data-embed-alias><h1>Public B<\/h1>/,
  )
  assert.match(
    html,
    /<blockquote class="transclude" data-url="public-b" data-block="#section-one" data-embed-alias><h2 id="section-one">/,
  )
  assert.match(html, /<a href="\.\/public-b" class="internal internal-link transclude-src">/)
})
