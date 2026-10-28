# Repository security review

Date: 2026-10-28

Status: source review completed for the installed subset. Three scoped local skills are installed. Whole upstream plugins remain disabled. The findings below describe the original source revision. The subsequent redesign removes those external execution paths; see the current implementation review at the end of this report.

## Exact source revisions

| Repository | Ref | Commit |
| --- | --- | --- |
| z00mj/z00mj.github.io | main | 0baaea7ab5351a72f7ba6ce2b192b7f46ee1d328 |
| jezweb/claude-skills | main | 1260fa7439b36b18dbf16648ccc7fb44783f6c23 |
| Jeffallan/claude-skills | plugin | 28bbf8954db78669f1cdb07f96693b5ee7664fee |

The earlier browser-only review is superseded by this commit-based inspection. Repositories were cloned without checkout, with Git hooks disabled for cloning. Tracked content was read with Git as data. Selected regular files were exported explicitly, without invoking upstream scripts, filters, package installation, or checkout hooks. The website's files and Git metadata were then copied into the project root without overwriting local guidance.

Complete tracked tree inventories and the installed skill file hashes are recorded under `security/`. No symlinks or submodules were present in the inspected trees. Git tree metadata was examined across all three repositories; content review is limited to the website source, relevant configuration, and the selected skill materials described below. This is not a full audit of every skill, command, dependency, binary, or historical commit.

## Findings

### High: upstream prompt hook invokes an unavailable external script

Source: `jezweb/claude-skills`, `.claude/settings.json`, lines 3-11 at the recorded commit.

A `UserPromptSubmit` command hook invokes `/Users/marcuswebb/Documents/virtual-team/shared/hooks/heartbeat-context.sh`. The absolute path is outside the repository and the script's contents are unavailable. Loading that repository as a trusted Claude project could attempt to run that command on each prompt. This is an unsafe configuration to import, though the file alone does not prove malicious intent.

Mitigation applied: no upstream settings or hooks were copied, and the repository was not opened as a Claude project. Only individually selected skill files were installed. No hook, MCP server, permission bypass, agent, or command directory was installed.

### Medium: unsafe or incomplete Next.js example patterns

Source: `Jeffallan/claude-skills`, `skills/nextjs-developer/references/server-actions.md`, the file-upload section; and `references/server-components.md`, the client-island section.

The upload example joins an unchecked client-supplied filename into a filesystem path and writes bytes without shown filename containment, type/size restrictions, or authentication. The client-island example renders `post.content` using `dangerouslySetInnerHTML` without shown sanitization. These are unsafe examples if copied into a real service or used with untrusted content; they are not evidence of a prompt-injection attack.

Mitigation applied: the upload/Server Action reference was not installed. The HTML-injection example was excluded from the retained frontend excerpts. The local Next.js skill explicitly uses JSX text and prohibits backend and Server Action implementations in this project.

### Medium: website loads mutable and duplicate executable dependencies

Source: website `index.html`, lines 186-188 (line numbers confirmed from this checkout).

The page loads `typewriter-effect@latest` from unpkg and loads jQuery 3.3.1 twice from separate CDNs, without integrity attributes. These scripts execute with page privileges; the mutable latest reference prevents reproducible review. The downloaded script bodies and their transitive behavior were not audited. This review does not claim a particular dependency exploit is reachable.

Required before preview/execution: replace these with reviewed native/local behavior or review exact pinned dependency contents and relevant advisories. No package manifest or lockfile exists in this checkout, so there is no npm dependency tree to audit. These website files were preserved unchanged for the later website update.

### External tracking/resources: review before carrying forward

Source: website `index.html` lines 5-12 and 31; `style.css` line 1.

Google Analytics executes a remote script; Boxicons CSS and Google Fonts also introduce external requests. These are recognizable external services, not evidence of malware. Confirm whether tracking is wanted and review the exact external content before executing it, or remove/self-host the applicable resources. No remote scripts, CSS, or fonts were executed as part of this review.

### Compatibility: skill examples need project-specific adaptation

The inspected Jezweb Tailwind skill assumes Vite, requests unpinned CLI execution, and includes config deletion commands. It was excluded. The installed React patterns skill still contains Vite/Cloudflare and optional CLI suggestions; a local preface overrides those with the project's Next.js and review-before-execution rules. The design-review skill refers to an uninstalled ux-audit skill; its local preface makes available local browser tooling sufficient and requires website security review first.

The Next.js skill was adapted to static frontend work; original backend, deployment, raw HTML, and unsafe upload workflows were excluded. Retained examples include older Next.js API shapes and are illustrative only. Verify installed-version behavior before implementation. No third-party helper command in any skill is pre-approved for execution.

## Reviewed and installed scope

- Jezweb: complete tracked-tree inventory; root `CLAUDE.md`, `.claude/settings.json`, root and frontend plugin manifests, marketplace manifest, LICENSE; complete `design-review/SKILL.md` and `react-patterns/SKILL.md`. The Tailwind entrypoint was read for selection and excluded; its remaining assets were not approved.
- Jeffallan: complete `plugin` branch tracked-tree inventory, plugin manifest, LICENSE, Next.js skill entrypoint and its five reference documents. Only an adapted entrypoint and frontend excerpts from `app-router.md` and `server-components.md` were installed. The React expert entrypoint was inspected for selection but not installed; its reference documents were not reviewed or approved. Unrelated skills and workflow commands were excluded.
- Website: all three tracked text files (`README.md`, `index.html`, `style.css`) read in full, complete tracked-tree inventory, and signatures plus basic active-content marker inspection of all seven image files. The images have expected PNG/GIF/ICO signatures. This is not an antivirus scan or proof that binary decoders are free from risk.

No obvious secret-exfiltration directive, instruction to conceal actions, or malicious instruction override was identified in the installed material. Keyword checks and manual inspection cannot establish that an entire upstream repository is safe. Approval is limited to using the installed adapted Markdown guidance as instructions under the root project rules; it does not authorize executing its sample commands blindly.

## Validation and next use

Validation passed for skill frontmatter structure, names/descriptions, entrypoint reference targets, included licenses, all eight recorded file hashes, JSON configuration parsing, and the absence of imported executable configuration. Git working-tree and staged diffs confirm original website content is unchanged. The skill-creator YAML validator was attempted but could not run because this environment lacks PyYAML; the fallback checks were structural checks, not a full YAML parser. No repository code, dependency lifecycle scripts, builds, tests, or browser previews were run. There is no application package manifest and this task does not migrate or redesign the site.

Before running the existing website, resolve or review the external scripts and resources listed above. Before future package installation/builds, inspect the exact new scripts, executable configuration, dependency versions, and lifecycle hooks. Re-review installed skill changes before updating recorded hashes or source revisions. The remaining upstream bundles stay disabled and are not approved by this report.

## Subsequent safe design preview, 2026-10-28

A later design review rendered a sanitized local copy at six screen widths. The locally written capture tool removes scripts, inline event handlers, remote links, and the font import before navigation, embeds the reviewed layout CSS, adds a restrictive content policy, disables page JavaScript, and blocks HTTP(S) requests in Chrome. Only reviewed local images remain. The original site and its remote execution paths were not run or cleared. Screenshots use fallback fonts and omit external icon glyphs and script-dependent behavior. Evidence and limitations are recorded in `.jez/artifacts/design-review.md`; tooling and the sanitized copy are in ignored `.repo-review/`. This does not change the unresolved findings above.

## Current implementation review, 2026-10-28

The authorized redesign replaces the original page/CSS and adds a small local DOM-only navigation script. The original Analytics, duplicate jQuery, typewriter script, remote icon CSS, and Google Fonts import have been removed from the page. The redesign uses local font files and images, native disclosure controls, direct contact links, and ordinary external social anchors. There is no package install/build pipeline, storage, form submission endpoint, dynamic HTML injection, or script-initiated network request.

Before executing the redesigned site, the HTML/CSS/JavaScript execution paths and local verification tool were inspected. Static checks confirmed local runtime resource targets, existing anchor/asset paths, no inline handlers, and no `javascript:` URLs. Font binaries were downloaded over verified HTTPS from the recorded Google Fonts static URLs, checked for WOFF2 signatures, and stored with original OFL licenses. Signature checks and file hashes do not constitute a full binary-decoder audit.

`security/website-redesign.json` records the current runtime files and hashes. The page has a restrictive self-only content policy with connections, objects, base overrides, and form submissions disabled. It was then exercised using the locally written `scripts/verify-site.mjs` against an isolated loopback HTTP server and temporary headless Chrome profile. No external runtime requests, failed resources, JavaScript exceptions, or browser error logs were observed. Checks and actual browser details are recorded in `.jez/artifacts/redesign/verification.json`.

The original source findings are mitigated by replacement in the working tree; this does not approve the original remote scripts or unrelated upstream bundles. External social destinations were not security-audited, and this local verification is not a comprehensive penetration test or cross-browser certification. The changes have not been pushed or deployed.


## Portfolio content and motion update, 2026-10-28

Reviewed the original CSS reactor as source data before adapting its visual concept into local SVG/CSS, retaining Kunal Sarkar attribution. New browser code uses only event listeners, class/ARIA updates, and IntersectionObserver; it does not fetch, evaluate code, inject HTML, access storage, or add dependencies. Content additions come directly from the user; no certification date/link or degree award was invented. Master study is explicitly marked academic units completed, 2024-Present.

Browser checks passed at six widths, including text contrast, doubled default text size, no-JavaScript content, keyboard controls, reactor pause/resume, and reduced-motion behavior. No external requests, failed resources, or browser errors were observed. Runtime hashes were refreshed after source review and verification. Changes remain local.


### Original reactor restored

At the user's request, replaced the SVG reinterpretation with the original reviewed HTML/CSS reactor: cyan glow, concentric layers, eight coils, and three-second rotation. Only positioning and proportional sizing were adapted for the current responsive layout. No original remote scripts were restored. Pause/resume and reduced-motion checks, six viewport widths, and doubled text-size checks pass. Runtime hashes refreshed.


Header and credentials refinement: added a one-time local CSS character reveal and finite caret animation for the header wordmark, retaining the accessible home-link name and reduced-motion fallback. Removed the motion button and related event handling at the user's request. The original reactor continues with reduced-motion support. Licenses now follow Certification in the same credentials column. Reviewed changes introduce no external execution paths; six-width browser checks, text sizing, and final wordmark visibility pass.


Selected Work expansion: added the four user-provided work areas (Supplier Chain Dashboards, Web App, Desktop App, Data Analytics Automation) in a responsive editorial list above the retained engineering/academic projects. No specific client, results, screenshots, destinations, or technologies were invented. HTML/CSS-only changes reviewed before browser execution; six-width, contrast, text-resize, and interaction checks pass.


Continuous header motion: at the user's explicit request, changed the local CSS wordmark animation to a repeating four-second typing, hold, and erase cycle. Width stays reserved and reduced-motion users see the complete static wordmark. Reviewed CSS-only runtime change; browser checks verify visible, erased, and repeated states across cycles, plus existing responsive checks.


Cursor alignment refinement: reviewed CSS-only character width changes make the caret follow typing and erasing while reserving header link space. Browser checks confirm the cursor retreats at each erased character; existing responsive and reduced-motion checks pass. No new external resources or execution paths.


## Release preparation

The user authorized committing and pushing the completed portfolio to origin/main. Fetched remote state with hooks disabled; no intervening remote commits. Confirmed GitHub Pages publishes main at the repository root. Final browser verification passed after the additional database and delivery skills. Reviewed files contain no identified private-key/token patterns. Local screenshots/results and source-review workspaces under .jez/, .repo/, and .repo-review/ are excluded from the release as requested. Historical statements above describe the state at each review; release status is recorded by Git history and GitHub Pages.
