import { Explorer as CommunityExplorer } from "@quartz-community/explorer"

// Options: everything the community Explorer takes, plus `excludeSlugs`, a list of full slugs
// (e.g. `["about"]`) to hide from the tree. The page itself is still built and linked.
//
// The community Explorer calls `filterFn.toString()` at build time, writes it into the
// `data-data-fns` attribute, and the browser rebuilds it with `new Function("node", ...)`. That
// runs in a fresh global scope, so a closure over `excludeSlugs` would throw "excludeSlugs is not
// defined" and the filter would silently do nothing. Build `filterFn` with `new Function` and put
// the list into its source as a JSON literal, so the string round trip keeps working. Do not
// "simplify" this into an arrow function that reads a variable from this module.
export const Explorer = (opts) => {
  const excludeSlugs = JSON.stringify(opts?.excludeSlugs ?? [])
  const { excludeSlugs: _omit, ...passthrough } = opts ?? {}
  const filterFn = new Function(
    "node",
    `var excludeSlugs = ${excludeSlugs}; return node.slugSegment !== "tags" && excludeSlugs.indexOf(node.slug) === -1`,
  )
  return CommunityExplorer({ ...passthrough, filterFn })
}
