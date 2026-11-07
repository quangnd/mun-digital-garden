# UI-2: Curate a simple Mun Journal homepage

GitHub issue: https://github.com/quangnd/mun-digital-garden/issues/12. Design and brand accepted on 2026-11-07; runtime implementation has not started.

## Problem and result

The current homepage introduces sample content but does not guide new visitors. Add a short personal introduction, a real starting note, a few subject paths, and a small selection of published notes.

## Scope

- Follow homepage requirements in DESIGN.md. Use only actual intentional public repository content.
- Prefer a Markdown homepage and scoped project styling. Do not build a feed, CMS, filtering UI, or new required metadata scheme.
- The HTML reference's labels/articles are examples. Check destinations; fewer real sections are preferable to invented notes or empty topic cards.
- Check whether Syncer owns `content/index.md`. Record any required owner action for keeping the public source aligned; do not access the vault or silently change the author's publishing workflow.
- Reduce secondary Graph/metadata prominence on the homepage using supported conditional layout options; do not globally hide useful article components.
- Replace default community footer links with intentional personal links only when their destinations are known. Framework attribution can remain quiet.

## Acceptance

- Introduction, start link, subject paths, and selected rows are clear at desktop and 375 px. Empty sections are omitted.
- Every internal destination resolves on the built site with the Pages prefix; no invented titles/counts/update dates or placeholder links.
- Selected title links are visibly identifiable without hover, with subtle underline and clear focus. No repeated arrows.
- The homepage remains `explicit-publish` compatible; unflagged notes do not become public through homepage changes.
- Search, Explorer, popovers, browser back, and SPA navigation work across homepage/article transitions.
- Build succeeds; collect one desktop and one mobile before/after pair. No screenshot expansion without a specific defect.

## Review and gate

Independent Reviewer checks the actual diff, link accuracy, Syncer ownership risk, and preserved publishing behavior. Stop at an authorized focused PR for owner review. No merge/deploy; no new JavaScript solely to match the mockup.
