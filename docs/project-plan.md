# Portfolio redesign

Objective: implement the approved review with a responsive, accessible, distinctive frontend portfolio. Preserve verified content and the existing GitHub Pages entrypoint.

## Decisions

- Keep buildless HTML/CSS/JavaScript. There is no application feature requiring a framework migration.
- Use locally served Manrope and Space Grotesk fonts with their OFL licenses, warm light backgrounds, dark text, and restrained green accents.
- Replace the reactor-first hero with a name-led layout and the existing portrait.
- Explain projects using verified source documents; preserve the IoT thesis adviser attribution.
- Remove external scripts, font/icon CDNs, and tracking. Use a small reviewed navigation script and native disclosure elements.
- Keep deployment outside this implementation task.

## Work and ownership

| Task | Role | Status |
| --- | --- | --- |
| Review existing source and security findings | Frontend | Done |
| Rebuild semantic content and responsive layout | Frontend | Done |
| Add local licensed fonts and source records | Frontend | Done |
| Review new execution paths before browser preview | Frontend | Done; manifest in `.claude/security/website-redesign.json` |
| Verify viewport layouts, keyboard/menu behavior, project disclosures, no-JS content, and text resizing | Frontend | Done; Chrome checks passed |
| Capture final screenshots and record verification | Frontend | Done; `.jez/artifacts/redesign/` |

## Acceptance

- All projects and meaningful descriptions remain visible from 320px through desktop.
- No unintentional horizontal overflow, overlapping text, or distorted images.
- Identity and the primary action are present without JavaScript.
- Mobile menu supports keyboard activation, Escape, correct expanded state, and resizing.
- Project documents can be opened without JavaScript. Contact links use real mail/phone destinations.
- Normal text contrast, focus indicators, font loading, and reduced motion are checked.
- Runtime page requests stay local. New code is reviewed before execution; no deployment occurs.

## Content constraints

Keep the existing experience dates; do not invent more recent employment. Project outcomes and authorship beyond the supplied documents remain unspecified. No live demo or source links are invented. A future content pass can add current experience, real project photos, and detailed contributions when supplied by Marc.

## Verification limits

Automated checks and screenshot inspection used installed Chrome with emulated screen widths. Doubled default text size was checked at 320px and 768px; this is not a claim of manual browser-zoom testing. Screen-reader testing, real-device touch testing, Safari, and Firefox remain future validation. Publishing is outside this task.


## Content and motion follow-up

Completed: four additional roles at Gomaterials, LPU Cavite, and CvSU CCAT; Master in Computer Engineering at CvSU CAPS (2024-Present, academic units completed); Google Data Analytics certification; Power Query, data analytics, AI, and automation skills. Existing earlier experience retained. Added a locally drawn arc reactor with original concept attribution, pause/resume control, brief section entrances, and link transitions. Reduced-motion settings disable animation; content remains available without JavaScript. Verified six widths and browser interactions using the reviewed local verification script.


Reactor refinement: restored original portfolio HTML/CSS reactor appearance and three-second coil rotation, replacing the SVG reinterpretation. Retained responsive sizing, credit, pause/resume, and reduced-motion support. Browser checks pass.


Header and credentials refinement: added a one-time local CSS character reveal and finite caret animation for the header wordmark, retaining the accessible home-link name and reduced-motion fallback. Removed the motion button and related event handling at the user's request. The original reactor continues with reduced-motion support. Licenses now follow Certification in the same credentials column. Reviewed changes introduce no external execution paths; six-width browser checks, text sizing, and final wordmark visibility pass.


Selected Work expansion: added the four user-provided work areas (Supplier Chain Dashboards, Web App, Desktop App, Data Analytics Automation) in a responsive editorial list above the retained engineering/academic projects. No specific client, results, screenshots, destinations, or technologies were invented. HTML/CSS-only changes reviewed before browser execution; six-width, contrast, text-resize, and interaction checks pass.


Continuous header motion: at the user's explicit request, changed the local CSS wordmark animation to a repeating four-second typing, hold, and erase cycle. Width stays reserved and reduced-motion users see the complete static wordmark. Reviewed CSS-only runtime change; browser checks verify visible, erased, and repeated states across cycles, plus existing responsive checks.
