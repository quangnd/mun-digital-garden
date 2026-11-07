# Mun brand assets · accepted v1

The identity continues the existing mockup's lowercase `mun.` wordmark. The dot is a small editorial punctuation mark. The icon simplifies it to `m` for small-size legibility. The owner approved these source assets on 2026-11-07. They are not installed into production by this preparation PR.

## Files

| File | Size | Use |
| --- | --- | --- |
| `wordmark-light.svg` | 266 × 136 viewBox, transparent | Ink wordmark and clay dot on light backgrounds |
| `wordmark-dark.svg` | Same, transparent | Paper wordmark and lighter clay dot on dark backgrounds |
| `wordmark-mono.svg` | Same, transparent | One-color mark |
| `favicon.svg` | 64 × 64 viewBox | Scalable icon master |
| `favicon.ico` | 16/32/48 px | Legacy/browser fallback |
| `favicon-16.png`, `favicon-32.png`, `favicon-48.png` | Named sizes | Exact-size verification or supported plugin input |
| `apple-touch-icon.png` | 180 × 180 | iOS bookmark/home-screen image |
| `icon-192.png`, `icon-512.png` | Named sizes | Larger icon exports; not a reason to add a PWA |
| `wordmark-light.png`, `wordmark-dark.png` | 798 × 408 / 532 × 272 | Raster previews; use SVG on the site |
| `social-card.svg`, `social-card.png` | 1200 × 630 | Generic share-card source/export |
| `brand-preview.png` | 1400 × 1010 | Review sheet with actual 16/32/48 px exports |
| `FONT-LICENSES.txt` | Text | Noto package copyright and license notices |

The favicon has a rounded clay background. The Apple touch icon export has transparent corners; iOS controls its final masking/background. Verify actual iOS appearance before final acceptance; do not claim install/home-screen behavior from a desktop preview.

All SVG text is converted to paths, has a viewBox, and includes an accessible title. There are no remote resources, embedded scripts, font files, or filter effects. Supply meaningful site-name alt text when used as an image; avoid duplicate spoken branding next to the same text label.

## Usage

- Keep proportions. Leave breathing room around the wordmark; do not stretch it to fill a container.
- Use the light wordmark on paper and the dark wordmark on the dark palette.
- Keep the compact icon as one consistent design across sizes; do not add the word “mun” at favicon scale.
- No shadow, gradient, animation, diagonal arrow, or extra symbol.
- Use these as source assets. Verify the installed Quartz 5 favicon/OG plugin options and generated HTML before copying or configuring runtime assets. Respect `/mun-digital-garden/` paths.
- The generic social card must not replace per-note titles or metadata if Quartz already supports them. Prefer a supported template/brand source; keep existing OG behavior intact unless the owner approves a scoped change.

## Editing

Noto Serif Regular is used for the wordmark; Noto Serif Bold for the compact mark; Noto Sans for share-card supporting text. The website body choice remains Be Vietnam Pro. These are typographic brand assets, not an AI-generated illustration or a custom typeface. Font notices are retained alongside sources.

`build_brand.py` regenerates masters and PNG/ICO derivatives from installed Noto fonts using Python, fontTools, Pillow, and Inkscape. Font paths may need adapting on macOS. Regeneration is optional; it is not a runtime or CI dependency. Use the committed SVG masters as the design source for routine edits.

## Validation

- SVG exports rendered with Inkscape; review sheet inspected.
- PNG dimensions and ICO embedded sizes checked programmatically.
- Preview includes actual-size 16/32/48 px exports.
- No production favicon tags, cache behavior, browser tab, or iOS home-screen installation has been verified yet.
