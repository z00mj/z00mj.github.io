# Marc Joshua Prudente — Portfolio

A responsive, buildless portfolio for electronics engineering, software development, and technical education. The production entrypoint remains `index.html`, suitable for GitHub Pages.

## Preview locally

From the repository root:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Open http://127.0.0.1:4173. Stop the server with Ctrl+C. No package installation or build step is required. Use an HTTP server rather than opening the file directly so local font loading and content-security rules behave consistently.

## Browser verification

Requires Node.js 22+ and installed Chrome or Edge:

```powershell
node scripts/verify-site.mjs
```

Set `CHROME_PATH` to the browser executable if it is not found automatically. The check starts an isolated loopback server and headless browser, verifies responsive and keyboard behavior, and stops both afterward. Results and screenshots are written to `.jez/artifacts/redesign/`.

Coverage includes six screen widths, local font loading, project visibility, horizontal overflow, text contrast on current solid surfaces, keyboard navigation, native project disclosures, reduced motion, doubled default text size, and essential content without JavaScript. This is not a substitute for real-device testing, a screen-reader audit, or verification in Safari and Firefox.

## Files and content

- `index.html`: semantic page content, project documents, metadata, and local resource policy.
- `style.css`: responsive layouts, design tokens, locally served typography, and reduced-motion styles.
- `script.js`: progressive enhancement for mobile navigation and section entrances. No tracking, storage, or external service calls.
- `images/`: original portfolio assets. Project documents retain their original proportions and attribution.
- `assets/fonts/`: Manrope and Space Grotesk Latin WOFF2 files, original OFL licenses, and source/hash records.
- `.claude/`: project rules, local agents, reviewed skills, and security records.

The redesigned page makes no automatic third-party runtime requests. External social links are ordinary user-initiated links. Existing experience dates and documented roles are preserved; the smart energy meter thesis identifies Marc as adviser.

Local review screenshots and results are generated under `.jez/`, which is excluded from Git along with temporary `.repo/` and `.repo-review/` directories. GitHub Pages publishes the root of `main` at https://z00mj.github.io/.
