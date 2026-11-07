# UI-1: Apply Mun Journal foundations and brand assets

GitHub issue: https://github.com/quangnd/mun-digital-garden/issues/11. Design and brand accepted on 2026-11-07; runtime implementation has not started.

## Problem and result

The site still looks like the Quartz default and uses its default icon. Establish the approved warm editorial palette, Vietnamese typography, restrained links, and Mun branding without changing navigation or publishing behavior.

## Scope

- Follow `DESIGN.md`, especially boundaries, type, colors, and brand sections.
- Respect the design-specific AGENTS.md update included in the preparation PR; retain every privacy/review rule.
- Use supported theme options and `quartz/styles/custom.scss`. Ensure `quartz-fonts` and theme typography agree and actual rendered fonts match.
- Install approved source assets through the installed Quartz 5 favicon/OG plugin's supported path/options; inspect plugin source/schema first. Do not assume Quartz 4 recipes.
- Provide light/dark colors, visible keyboard focus, stable image/code/table defaults, and no diagonal-arrow decoration. Preserve meaningful external-link indicators.
- Keep the site name Mun Digital Garden; use `mun.` as the wordmark only where a supported extension permits it. A styled text title is acceptable for the first pass if an image title would require replacing core behavior.

## Out of scope

Homepage curation, Search/Explorer/SPA rewrites, changing publish filters or `.github/workflows/`, dependencies, graph behavior, new PWA, custom OG generator.

## Acceptance

- Build succeeds and generated HTML references the intended icons under the Pages base path. Confirm no unintended duplicate/default icon tags win.
- Computed headings/body and downloaded font resources match Noto Serif/Be Vietnam Pro and render Vietnamese diacritics correctly.
- No page overflow at 320/375/390/768/1280 px; normal body text, metadata, links, and focus meet applicable AA contrast.
- Existing light/dark toggle, Search, Explorer, reader mode, and SPA links still work. No decorative diagonal arrows.
- Homepage and one public article have before/after desktop and mobile screenshots, at most eight unless a specific defect justifies more.
- Verify normal build output paths and asset dimensions. Recheck favicon caching with a fresh context; do not clear the user's profile or modify production.
- Diff preserves existing and in-flight privacy hardening. No vault access.

## Review and gate

Independent Reviewer evaluates the actual diff and reports findings. Keep code review distinct from visual acceptance. Open a focused PR only when GitHub writes are authorized; no merge/deploy. Update DESIGN.md only for approved design changes.
