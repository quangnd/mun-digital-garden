# Mun UI handoff · local review package

Prepared on 2026-11-07 for https://github.com/quangnd/mun-digital-garden.

This package contains a design source of truth, accepted source/export brand assets, the visual reference, three issue references, and an Ultimate prompt. The owner accepted the design and brand on 2026-11-07 and authorized a preparation draft PR plus issues #11, #12 and #13. This does not modify production or authorize merge/deploy.

## Start here

1. Read root `DESIGN.md`; `design/brand/brand-preview.png` shows the accepted v1 assets.
2. Place the package contents at the repository root, preserving existing files and local work. No existing production file is replaced by the package as supplied. The preparation PR incorporates the theme-only AGENTS.md update. The patch is archival; do not reapply it blindly.
3. Give Ultimate `planning/ui/ULTIMATE_PROMPT.md`. It starts with inspection and local preparation, then UI-1 only once the user explicitly starts implementation.

## Important distinctions

- DESIGN.md records design decisions. Issues track delivery; they must not evolve into a competing design document.
- Source assets belong under `design/brand/`; runtime copies/configuration are a later implementation step.
- `design/reference/mun-journal.html` is a discussion reference, not application source or a theme package.
- `docs/` in this repo is upstream Quartz documentation, so this package intentionally does not place project documents there.
- The existing default-theme rule conflicts with the owner's new approved direction. A minimal patch is provided; privacy and review rules remain intact.
- Current AGENTS.md requires explicit approval before remote GitHub actions. Preparation writes were authorized; implementation writes still follow the current session authorization.

Observed repo context: PR #8 was merged and the heading font was verified in production earlier in this session. PR #10 (privacy exclusions/attachments) is now merged; the preparation branch is based on main at e3fbc0b76690d8906768f2531c5a0ad5bcef1427. These are observations, not a required base revision; inspect current main before implementing.
