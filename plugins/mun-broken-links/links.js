import { posix } from "node:path"
import { isRelativeURL, simplifySlug } from "@quartz-community/utils"

// A file extension that marks an attachment (image, pdf, ...). A note name may contain a dot, so the
// extension must start with a letter ("v1.2" is a note); .md and .html are note extensions.
const FILE_EXTENSION = /\.(?!(?:md|html?)$)[a-z][a-z0-9]{0,4}$/i

// Same target alias-redirects writes the redirect page to (`<target>.html`).
const aliasSlug = (slug, alias) => {
  const target = isRelativeURL(alias)
    ? posix.normalize(posix.join(simplifySlug(slug), "..", alias))
    : alias
  return target.replace(/^\/+|\/+$/g, "")
}

/**
 * The note slugs that exist on the published site. `allFiles` is what renderPage receives: the
 * published markdown pages plus the virtual folder, tag and canvas pages. Notes dropped by the
 * publish filters are not in it, which is why ctx.allSlugs (every file on disk) is not used.
 */
export function publishedSlugs(allFiles) {
  const known = new Set()
  for (const file of allFiles) {
    const slug = file.slug
    if (typeof slug !== "string") continue
    known.add(slug)
    // `[[folder]]` links to `folder`, which the host serves from `folder/index.html`.
    if (slug.endsWith("/index")) known.add(slug.slice(0, -"/index".length))
    for (const alias of file.aliases ?? []) known.add(aliasSlug(slug, alias))
  }
  return known
}

/** True for a link target that looks like a note and is not on the published site. */
export function isUnresolved(slug, known) {
  if (!slug || known.has(slug)) return false
  return !FILE_EXTENSION.test(slug.slice(slug.lastIndexOf("/") + 1))
}

// crawl-links sets `data-slug` as a literal key; a parsed tree would carry it as `dataSlug`.
const slugOf = (props) => props["data-slug"] ?? props.dataSlug

/**
 * Turns every internal link to an unpublished note into an inert, labelled element: no href and no
 * data-slug (so the SPA router, the popover and a middle click have nothing to follow, and the
 * unpublished slug is not in the HTML). The link text stays as the author wrote it.
 */
export function markUnresolvedLinks(root, known) {
  const visit = (node) => {
    if (node.type === "element" && node.tagName === "a" && node.properties) {
      const props = node.properties
      const classes = props.className ?? []
      const slug = slugOf(props)
      if (classes.includes("internal") && typeof slug === "string" && isUnresolved(slug, known)) {
        delete props.href
        delete props["data-slug"]
        delete props.dataSlug
        props.className = [
          ...classes.filter((c) => c !== "internal" && c !== "internal-link"),
          "unresolved-link",
        ]
        props["data-unresolved"] = "true"
        props["data-no-popover"] = "true"
        props.role = "link"
        props.tabIndex = 0
        props.ariaDisabled = "true"
      }
    }
    for (const child of node.children ?? []) visit(child)
  }
  visit(root)
}

/** A render-time tree transform (see TreeTransform in quartz/plugins/types.ts). */
export function unresolvedLinksTransform() {
  const cache = new WeakMap()
  return (root, _slug, { allFiles }) => {
    let known = cache.get(allFiles)
    if (!known) cache.set(allFiles, (known = publishedSlugs(allFiles)))
    markUnresolvedLinks(root, known)
  }
}
