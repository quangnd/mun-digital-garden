import { h } from "preact"

// Same rule as Quartz's pathToRoot: "." on the root page, ".." per folder level below it.
const pathToRoot = (slug) => {
  const up = slug
    .split("/")
    .filter((segment) => segment !== "")
    .slice(0, -1)
    .map(() => "..")
  return up.length === 0 ? "." : up.join("/")
}

// Options: `text` is the personal line; `links` maps a label to a URL. RSS and the Quartz
// attribution are added here. The feed (content-index, enableRSS) is emitted as index.xml at the
// site root, so a root-relative path follows the base path (/mun-digital-garden/) on its own.
export const MunFooter = (opts) => {
  const MunFooter = ({ displayClass, fileData, ctx, cfg }) => {
    // 404.html is served from any URL depth, so it needs the absolute base path (as dispatcher.ts does).
    const root =
      fileData.slug === "404"
        ? ctx?.argv?.serve
          ? ""
          : new URL(`https://${cfg?.baseUrl ?? "example.com"}`).pathname.replace(/\/$/, "")
        : pathToRoot(fileData.slug)
    const links = Object.entries(opts?.links ?? {})
    return h("footer", { class: displayClass ?? "" }, [
      opts?.text && h("p", null, opts.text),
      h("ul", null, [
        ...links.map(([label, href]) => h("li", null, h("a", { href }, label))),
        // A feed is not a page: skip the SPA router so the browser opens the XML directly.
        h("li", null, h("a", { href: `${root}/index.xml`, "data-router-ignore": "" }, "RSS")),
        h("li", null, ["Made with ", h("a", { href: "https://quartz.jzhao.xyz/" }, "Quartz")]),
      ]),
    ])
  }
  return MunFooter
}
