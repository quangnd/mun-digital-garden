# Ultimate handoff prompt

Use this prompt in the project's Ultimate conversation. Design and brand are already accepted. Issues #11, #12 and #13 already exist; do not create duplicates.

---

Continue Mun Digital Garden using the Lean Coordinator workflow. The owner accepted the initial Mun Journal visual direction and wants root DESIGN.md as its design source of truth. The owner approved design and brand v1 plus the preparation branch/draft PR and issues #11, #12, #13 on 2026-11-07. Runtime implementation, implementation PRs, merge and deployment were not authorized by that approval. Do not re-ask for accepted design/brand choices. If the current user prompt explicitly starts UI-1, that is the implementation start authorization; otherwise inspect, prepare the file/config mapping, and stop before runtime UI edits.

Read root AGENTS.md, DESIGN.md, design/brand/README.md, and planning/ui/01-foundation.md through 03-reading-mobile.md. `design/reference/mun-journal.html` is a visual reference only. Do not ship its simulated Search, menu, routing, sample content, filtering, or mockup breakpoints.

1. Inspect the current working tree and latest main safely. Preserve local edits and in-flight work, including privacy hardening. Syncer commits directly to main, so do not assume the handoff's observed revision is still current. Do not stash/reset/clean or touch another repo/vault.
2. Check the design preparation PR and the updated AGENTS.md in its branch. The theme-only rule is replaced there; all other boundaries remain. Do not overwrite newer AGENTS.md or reapply the archival AGENTS.patch blindly. Use an isolated local branch/worktree appropriate to current project state.
3. Use the accepted brand exports under design/brand. They are not yet wired into runtime assets/config. Check the local source set matches the accepted v1; raise only a concrete discrepancy or new design choice.
4. Identify installed Quartz 5 plugin extension points for fonts, favicon/OG, homepage-specific layout and backlinks. Prefer supported config + custom.scss. Provide a short concrete mapping and any unavoidable mismatch; do not start an architecture redesign.
5. Use existing delivery issues #11 (foundations and branding), #12 (homepage), and #13 (reading/mobile). Do not create duplicates. The existing approval covers the design preparation branch/PR and these issues only. For implementation pushes/PRs, honor the authorization present in the current user session; prepare concrete local work before asking for any missing remote-write approval. No merge/deploy authorization is implied.
6. Once the brand proposal and implementation start are accepted, implement UI-1 only. Request a coding worker under the project's existing Lean Coordinator setup. Do not modify Ultimate core/global settings or add a new orchestration framework.
7. Run the build and proportionate checks from UI-1. Record actual computed fonts, asset links/base path, before/after views, and limitations. Do not write tests that mirror straightforward CSS. Run repository-required checks relevant to touched files; do not add unrelated reformatting/dependency upgrades to make broad checks green.
8. Explicitly invoke an independent Reviewer on the completed implementation diff, following the current review policy. Do not assume a Reviewer runs automatically. Report who/what reviewed and findings/resolutions. Never describe visual screenshots as independent code review or real-device Safari testing.
9. Stop for owner review after UI-1 and its authorized PR. Do not merge, deploy, or automatically begin UI-2/UI-3. If a requested custom layout needs core/plugin JavaScript changes, explain the exact need and smallest alternative before expanding scope.

Preserve publishing behavior: explicit-publish, privacy exclusions, public attachment rules, Quartz Syncer and deployment pipeline. Never read the Obsidian vault. Leave upstream docs/ alone. Maintain DESIGN.md when an approved design decision changes. Do not introduce diagonal-arrow decorations, decorative emoji, gradients, animations, dynamic homepage feeds, or generic card dashboards.

Report briefly: changed behavior and files, validation evidence, independent review outcome, open limitations, and the exact next owner decision. The visual reference is a direction, not a demand for pixel-perfect duplication of its structure or JavaScript.
