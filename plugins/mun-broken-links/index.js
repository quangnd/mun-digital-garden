import { unresolvedLinksTransform } from "./links.js"
import { noticeScript } from "./notice.js"

const DEFAULT_MESSAGE = "Ghi chép này chưa có trên website."

// Links to notes that are not on the published site (private, unwritten, filtered out) must not
// navigate, and their slugs must not be published. This is a page type that never matches a page: it
// exists to add a render-time tree transform, and its body component carries the client script, which
// the dispatcher collects with the other layout components. Option: `message`, the notice text; it
// also replaces the "Transclude of <slug>" text of an embed of an unpublished note.
export default function MunBrokenLinks(opts) {
  const message = opts?.message ?? DEFAULT_MESSAGE
  const Script = () => null
  Script.afterDOMLoaded = noticeScript(message)
  return {
    name: "mun-broken-links",
    match: () => false,
    layout: "mun-broken-links",
    body: () => Script,
    treeTransforms: () => [unresolvedLinksTransform(message)],
  }
}
