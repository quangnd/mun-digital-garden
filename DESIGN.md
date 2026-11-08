# Mun Digital Garden: design direction

Version: 0.1 · 2026-11-07

## Status and source of truth

This file is the primary design reference for the Mun Journal UI. The owner accepted direction A and the revised treatment without diagonal arrows as a starting point, not a frozen design system. Brand exports in `design/brand/` were approved by the owner on 2026-11-07. Approval covers this design/assets preparation PR and issues; it does not authorize runtime UI implementation, merge, or deployment.

Update this file in the same PR when an approved design decision changes. Issues describe delivery scope and acceptance criteria; they must reference this file rather than repeat a competing design specification. Record substantive changes in the decision log below. Small spacing fixes within these constraints need no new design phase.

## Intent

A personal, editorial digital garden: warm, quiet, readable, and connected. It should feel authored by a person, not a default documentation site or a marketing landing page. Reading and following meaningful links come first.

- Platform: Quartz 5, with Obsidian + Quartz Syncer authoring.
- Name: Mun Garden is the name shown in the header (settled with owner, UI-4). The repository and the published path keep `mun-digital-garden`. “Mun Journal” names the visual direction, not a second brand.
- Language: Vietnamese and English, with Vietnamese diacritics treated as first-class content.
- Audience: a new visitor discovering themes, and a returning reader searching for a note.
- Scope: a small first version, designed to evolve.

## Boundaries

- Preserve Quartz Search, Explorer, Graph, popovers, dark-mode behavior, and SPA navigation. Restyle or reposition supported components; do not copy the mockup's simulated implementations. Reader mode is switched off (UI-4, wording and removal pending owner review; see "Header, sidebar and footer").
- Preserve `explicit-publish`, publishing exclusions, Syncer behavior, base URL, deployment workflow, and content-index behavior. Privacy hardening can progress separately; rebase onto its accepted result.
- Do not read or edit any private Obsidian vault. Work only with this repository's intentional public content.
- Keep upstream `docs/` unchanged. Project design references live under `design/`; implementation instructions live under `planning/ui/`.
- Prefer `quartz.config.yaml` for supported theme/layout settings and `quartz/styles/custom.scss` for project styles. Inspect the installed Quartz 5 plugin schema before choosing asset and layout options. Do not assume Quartz 4 APIs apply.
- Avoid edits to plugin/core JavaScript, `base.scss`, or frame registries. If a concrete requirement needs one, explain the limitation and isolate the smallest change for review before proceeding. The exceptions so far are two small local plugins in plain JavaScript (no build step). The footer: the installed `@quartz-community/footer` only renders "Created with Quartz" plus a link map, so `plugins/mun-footer` replaces it. Links to unpublished notes: `plugins/mun-broken-links`, see "Links to unpublished notes". Nothing under `node_modules/`, `quartz/` core or `base.scss` changed.
- No diagonal-arrow decorations, repeated arrow affordances, gradients, ornamental textures, automatic animations, decorative emoji, or dashboard-style card grids.
- No automatic metadata workflow such as seedling/evergreen status, note counts, “recently updated” feeds, or filters in this first version.

## Visual language

### Colors

| Token | Light starting value | Purpose |
| --- | --- | --- |
| Paper | `#F7F3EB` | Page background |
| Ink | `#292724` | Reading text and headings |
| Clay | `#9B4937` | Links, restrained accents, favicon |
| Muted | `#6D655C` | Secondary text and metadata |
| Rule | `#DCD4C8` | Quiet separators; not body text |
| Wash | `#EEE7DA` | Occasional callout/example surface |

Do not add a colored background to every internal link. Use a thin underline to make links recognizable without hover. Hover and keyboard focus may strengthen underline and use clay. Maintain a clear focus outline. Color alone must not identify an action.

Keep dark mode available. Initial candidates are paper `#24211E`, ink `#F2EDE3`, muted `#C0B6A8`, clay `#D98C73`, rule `#51483F`, and wash `#302B25`. These are proposed values, not an approved dark-mode mockup. Check actual contrast and component states in implementation; primary text, links, and secondary text require WCAG AA text contrast. Avoid bright panels inherited from plugin defaults.

### Type and spacing

| Role | Starting choice |
| --- | --- |
| Wordmark | Outlined Noto Serif “mun.”; see brand README |
| Page titles and section headings | Noto Serif, regular/medium |
| Body and navigation | Be Vietnam Pro, regular/medium |
| Code | IBM Plex Mono |

- Body: start at 17–18 CSS px; line height around 1.75–1.9. Tune using real Vietnamese paragraphs, lists, and tables.
- Reading measure: aim for 65–75 characters per line on desktop; use the actual font to validate. Approximately 640–720 px is a starting range, not a required width.
- Mobile: 20–24 px side gutters when space permits; preserve 17 px body text around 375 px width. At 320 px, reduce gutters before reducing reading size.
- Titles may be approximately 32–36 px mobile and 38–46 px desktop. Let long Vietnamese titles wrap naturally.
- Use spacing and typography for hierarchy. Minimal radius, no routine card shadows, no drop caps, no all-caps long headings, no letter spacing applied to normal Vietnamese text.
- Ensure Vietnamese glyphs load in every used weight/style. Check actual computed font and loaded resources: `quartz-fonts` can override the theme's typography settings. Both sources must agree.
- Avoid extra font families and unused weights. Use sensible fallbacks and no font-dependent layout shifts that obscure navigation.

## Homepage

Order:

1. Compact personal introduction explaining the garden.
2. A clear “start here” link to a real published note or MOC.
3. A few intentional subject paths, each with a short description and a real destination.
4. A small list of selected notes with title, description, and optional subject label.
5. A quiet personal footer: one personal line, then Source, RSS and a small "Made with Quartz" attribution, so the framework credit stays without the default community links dominating.

Use a simple row/list treatment with hairline separators. Subject groups may use columns on desktop and stack on mobile. Avoid a large hero illustration and large empty marketing hero area. Graph is not a primary homepage feature.

The reference names AI & tools, learning & thinking, and work & projects as examples. They are not confirmed taxonomy or approved copy. First inspect intentional public notes. Do not invent articles, fake note counts, broken MOC links, dates, or “recent” activity to fill the homepage. An initially sparse homepage is acceptable. Record provisional wording for owner review.

Prefer an explicit-published homepage note and ordinary Markdown links, plus scoped styling. Avoid a CMS, dynamic curation layer, or mandatory metadata additions. If Syncer would overwrite an in-repo homepage edit, document the owner action required rather than edit the vault.

## Article page

- Reading column is the visual center. Show title, concise metadata, and content with clear heading rhythm.
- Optional description is a short deck, not a raw YAML/properties panel. Do not expose authoring properties simply because they exist.
- Desktop: left navigation remains restrained. A right TOC may remain if there is enough room; otherwise use Quartz's existing responsive behavior.
- Prefer backlinks after the article when the existing layout slot supports it. Keep them recognizable as incoming links. Do not invent a “related notes” algorithm or label curated recommendations as backlinks.
- Graph is secondary: first prefer removing it from the initial reading area through supported layout configuration. A custom collapsible graph is not required for v1. Retain access through a supported existing component/page if practical; record any tradeoff.
- Keep internal links underlined and external-link identification meaningful. Remove decorative arrows introduced by this design; do not indiscriminately hide all external-link indicators or accessibility labels.
- Images retain aspect ratio and fit the column. Respect useful authored image widths; do not stretch small screenshots to full width. Tables and code can scroll horizontally within their own containers without making the entire page overflow.
- Preserve headings/anchors, footnotes, callouts, lists, Markdown images, embeds, and syntax highlighting.

## Header, sidebar and footer

UI-4 refines the chrome around the reading column. Navigation behavior, the navigation tree and the mobile menu are native Quartz and unchanged.

Settled with owner:

- The header name is "Mun Garden", plain text in the title font, linking to the homepage. It comes from `configuration.pageTitle`, which Quartz also uses as the RSS feed title and `og:site_name`.
- No emoji, tree icon or other symbol beside the name.
- The favicon stays the compact `m`; colours and fonts do not change.

Wording pending owner review (provisional; it lives in `quartz.config.yaml` and `content/index.md`, so changing it needs no code):

- Explorer title "Ghi chép" (desktop). The mobile menu is an icon button; its accessible label is hard-coded to "Explorer" by the installed plugin.
- Footer: "Ghi chép của Quang (Mun)." plus Source (the repository), RSS and "Made with Quartz". The RSS link is relative to the site root (`index.xml`, emitted by content-index), so it follows the `/mun-digital-garden/` base path, and it skips the SPA router so the browser opens the feed directly.
- Homepage title and headings: "Vườn ghi chép", "Bắt đầu", "Ghi chép chọn lọc". The links, descriptions and intro sentence are unchanged.
- Reader mode removed (`enabled: false`). Search and dark mode stay; Search takes the free width, so the toolbar has no gap.

## Links to unpublished notes

An internal link (wikilink or Markdown link) to a note that is not on the published site (`publish: false`, not yet written, or removed by a publish filter) does not navigate and shows no 404 page or popover.

- Look: muted text (`--gray`, 5.2:1 on paper in light mode, 8.0:1 in dark) with a dashed underline instead of the clay solid underline. It stays keyboard-focusable with the normal focus ring and is announced as a disabled link.
- Behavior: click, tap or Enter shows a short notice, "Ghi chép này chưa có trên website." (provisional wording, option `message` in `quartz.config.yaml`). It sits at the bottom centre, or at the top when the link is in the bottom of the viewport, so it never covers the link. It is a polite live region (`role="status"`), never takes focus, hides after about 3 seconds (activating again restarts the time), shows once at a time, is removed on navigation and has no fade with reduced motion. The wording does not say whether the note is private or unwritten.
- Not affected: published pages (including unlisted ones), aliases, folder and tag pages, attachments, external links and same-page anchors. Direct visits to a missing URL still show the 404 page.
- Implementation: `plugins/mun-broken-links`, a local plugin like the footer. A render-time tree transform compares each internal link with the pages actually published and, for an unpublished one, removes `href` and `data-slug` so the router, the popover and a middle click have nothing to follow and the unpublished slug is not in the link attributes. Quartz's own `disableBrokenWikilinks` is not used: it checks every file on disk, so it misses `publish: false` notes. The decision is made at build time, so a note published later turns its links live on the next deploy. Attachments are recognised from the files on disk, not from a name pattern. While `quartz build --serve` runs, publishing or unpublishing a note does not refresh the links in other pages until a full rebuild (restart the server).
- Limits: the link text stays as the author typed it. `static/contentIndex.json` still lists unpublished slugs in each page's `links`, and an embed of an unpublished note keeps its slug in `data-url`; both come from upstream plugins and are not handled here.

## Mobile

- Design for 320, 375/390, and wider mobile sizes as well as desktop. Existing Quartz breakpoints are the starting point, not the mockup's container breakpoints.
- One reading column. Search and navigation stay easy to find using existing Quartz components. Do not ship the mockup's custom menu, search overlay, or routing code.
- No new sticky bottom navigation, custom keyboard handling, or nested full-screen scroll containers.
- If mobile TOC needs a new wrapper or interaction, defer it until the native option has been evaluated. A custom accordion is not required to match the reference.
- Reading, navigation, and primary controls must work without hover. Interactive targets should have about 44 × 44 px effective touch space.
- Desktop responsive screenshots are visual evidence only. Real iPhone Safari checks cover opening search, keyboard shown, scrolling results, opening a note, closing search, and back navigation. Never report these as passed without observing them on the real device.

## Brand assets: accepted v1

- Wordmark: lowercase `mun` in Noto Serif with a clay dot. Light, dark, and monochrome outlined SVG masters; no runtime font dependency inside the SVGs.
- Compact mark: a bold lowercase `m` on a clay rounded square. Omit the dot in the compact mark to preserve clarity at 16 px.
- No Quartz crystal, leaf/brain/network illustration, diagonal arrow, or elaborate mascot.
- Exports and exact dimensions are listed in `design/brand/README.md`.
- Approved assets are sources for implementation, not installed into Quartz by this handoff. Inspect favicon and OG plugin behavior before mapping outputs to runtime paths. Existing static candidates are `quartz/static/icon.png` and `quartz/static/og-image.png`, not proof that replacing those alone is sufficient.
- SVG masters are editable. Raster and ICO outputs are derived. Do not redraw the logo separately in each component or fabricate a new version per PR.

## Reference and limits

`design/reference/mun-journal.html` captures the accepted visual direction after removing decorative diagonal arrows. It contains sample content and locally simulated search/menu interactions solely to explain appearance. It is not application source, a tested Quartz theme, or a complete implementation specification. Use this document to resolve conflicts with the reference.

Static brand exports were rendered and inspected. The reference UI has only syntax/structure checks in this environment; browser execution was blocked. No real-device Safari behavior has been validated. Do not claim otherwise.

## Delivery and review

| Slice | Result | Scope boundaries |
| --- | --- | --- |
| UI-1 | Typography, colors, link treatment, approved brand assets | No navigation rewrite or homepage curation |
| UI-2 | Curated homepage using real published content | No dynamic feeds, filters, or taxonomy engine |
| UI-3 | Reading layout, responsive refinement, interaction verification | Preserve native component behavior; no automatic JS rewrite |
| UI-4 | Header name, Explorer title, personal footer, homepage headings, no reader mode | No navigation rewrite; homepage change limited to headings; publishing, privacy, base URL unchanged |

One PR per slice. Verify the build and relevant interactions; collect a bounded set of before/after views rather than an open-ended screenshot campaign. Each PR reports what changed, evidence, review outcome, and remaining limitations. Update this file if an owner-approved decision changes.

The independent Reviewer is required by the repository policy for publishing/privacy changes, significant code, and complex UI/navigation. For this UI effort, request independent review on each implementation PR. A code review is distinct from visual acceptance and real-device testing. Owner review is the final merge gate. Never merge/deploy or modify Ultimate core/global configuration without separate owner authorization.

The owner explicitly approved the preparation branch, draft PR, and three issues on 2026-11-07. Delivery issues: UI-1 #11, UI-2 #12, UI-3 #13. Runtime implementation, implementation PRs, merge, and deployment remain separate gates under `AGENTS.md`. Do not request renewed approval for the already accepted design/brand proposal.

## Decision log

| Date | Decision | Status |
| --- | --- | --- |
| 2026-11-07 | Direction A, editorial personal garden, is enough to start | Accepted by owner |
| 2026-11-07 | Remove decorative diagonal arrows; use restrained title-link treatment | Accepted as starting point |
| 2026-11-07 | Keep design decisions in root `DESIGN.md` | Requested by owner |
| 2026-11-07 | `mun.` wordmark and compact `m` favicon exports | Accepted by owner |
| 2026-11-07 | Three implementation slices and dark palette | Proposed implementation starting point |
| 2026-11-07 | UI-2 homepage: Vietnamese intro sentence supplied with the task; "Start here" -> Garden map; selected rows (Spaced repetition, First post garden) with descriptions copied from the notes; no subject-path section until more than one subject has real notes; Graph, backlinks, TOC and content-meta hidden on the homepage via `condition: not-index`; footer links reduced to the repository | Provisional wording, for owner review |
| 2026-11-08 | UI-3 reading layout: article column capped at 40rem (~75 Vietnamese characters per line at 17px); backlinks, then a compact Graph, move to `afterBody` (Graph stays reachable, no longer in the reading area; TOC stays right); homepage drops its empty right track so navigation and column centre together; mobile header uses ~44px targets with an icon-only (still labelled) Search at 480px and below | Provisional, for owner review |
| 2026-11-08 | UI-4 header and footer. Settled with owner: the header name is "Mun Garden" as plain text, no emoji or tree icon, the `m` favicon, colours and fonts, header links to home. Provisional, for owner review: Explorer title "Ghi chép"; footer line "Ghi chép của Quang (Mun).", Source, RSS and "Made with Quartz" via the local `plugins/mun-footer`; homepage title and headings in Vietnamese; reader mode removed | Mixed: see "Header, sidebar and footer" |
| 2026-11-08 | Links to unpublished notes are inert, with a dashed muted style and a short notice instead of a 404, via the local `plugins/mun-broken-links` | Provisional, for owner review |
