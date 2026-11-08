import { unresolvedLinksTransform } from "./links.js"
import { noticeScript } from "./notice.js"

const DEFAULT_MESSAGE = "Ghi chép này chưa có trên website."

// Links to notes that are not on the published site (private, unwritten, filtered out) must not
// navigate. This is a page type that never matches a page: it exists to add a render-time tree
// transform, and its body component carries the client script, which the dispatcher collects with
// the other layout components. Option: `message`, the notice text.
export default function MunBrokenLinks(opts) {
  const Script = () => null
  Script.afterDOMLoaded = noticeScript(opts?.message ?? DEFAULT_MESSAGE)
  return {
    name: "mun-broken-links",
    match: () => false,
    layout: "mun-broken-links",
    body: () => Script,
    treeTransforms: () => [unresolvedLinksTransform()],
  }
}
