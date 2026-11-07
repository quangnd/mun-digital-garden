# UI-3: Refine reading layout and verify mobile interactions

GitHub issue: https://github.com/quangnd/mun-digital-garden/issues/13. Design and brand accepted on 2026-11-07; runtime implementation has not started.

## Problem and result

Secondary controls compete with reading, and visual responsive checks do not establish iPhone behavior. Refine the article layout while preserving native Quartz interactions and accurately report device verification.

## Scope

- Apply article/mobile requirements in DESIGN.md with supported slots and scoped styles.
- Keep a restrained left navigation, readable article measure and metadata, and TOC where there is room.
- Put backlinks after the article if supported. Evaluate Graph's secondary placement without adding a custom collapsing widget. If native placement cannot meet the proposal, record a small compromise; do not rewrite the component.
- Verify long Vietnamese headings and paragraphs, small and wide images, code, tables, callouts, anchors, footnotes, and links using a temporary local public fixture when needed. Do not publish QA filler.
- Keep the native mobile Search/Explorer flow. No custom keyboard management or sticky navigation.

## Acceptance

- No full-page horizontal overflow at 320/375/390/768/1280 px; code and wide tables overflow only inside their own containers.
- Clear hierarchy, useful line length, comfortable body size, correct image aspect ratios, and legible light/dark states.
- Search open/close, keyboard focus, results selection, Explorer navigation, popovers, anchors, reader mode, browser back, and SPA transitions retain expected behavior.
- Before/after desktop and narrow-mobile article screenshots plus one dark-mode view; bounded set, expanded only for specific failures.
- Real iPhone Safari: show keyboard in Search, scroll results, open a note, dismiss Search, use back navigation, and scroll the article. Record device/browser and observations. If no device is available, mark this pending and hand the short checklist to the owner; do not claim desktop emulation proves it.
- Build passes; no privacy/publish/deploy changes. Remove temporary QA fixtures before commit.

## Review and gate

Independent Reviewer is required for responsive/layout/navigation changes. Document unresolved limitations. Owner visual approval and required real-device verification are separate from code review. Stop for owner review; no merge/deploy or automatic follow-up phase.
