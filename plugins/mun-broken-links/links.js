import { posix } from "node:path"
import { isRelativeURL, simplifySlug } from "@quartz-community/utils"

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
export function publishedSlugs(allFiles, attachments = []) {
  // Attachments (images, pdf, ...) are files on disk that are not notes; they are served as is.
  const known = new Set(attachments)
  for (const file of allFiles) {
    const slug = file.slug
    if (typeof slug !== "string") continue
    known.add(slug)
    // `[[folder]]` links to `folder`, which the host serves from `folder/index.html`.
    if (slug.endsWith("/index")) known.add(slug.slice(0, -"/index".length))
    for (const alias of file.aliases ?? []) {
      const target = aliasSlug(slug, alias)
      known.add(target)
      if (target.endsWith("/index")) known.add(target.slice(0, -"/index".length))
    }
  }
  return known
}

/** Slugs of the non-markdown files on disk (ctx.allSlugs is parallel to ctx.allFiles). */
export function attachmentSlugs(ctx) {
  const slugs = []
  ctx.allFiles.forEach((fp, i) => {
    if (!fp.endsWith(".md")) slugs.push(ctx.allSlugs[i])
  })
  return slugs
}

/** True for an internal link target that is neither a published page nor an attachment. */
export function isUnresolved(slug, known) {
  if (!slug || known.has(slug)) return false
  return true
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
  return (root, _slug, { allFiles, ctx }) => {
    let known = cache.get(allFiles)
    if (!known) cache.set(allFiles, (known = publishedSlugs(allFiles, attachmentSlugs(ctx))))
    markUnresolvedLinks(root, known)
  }
}
