# Khin Mg San — Digital Engineering Portfolio

Public site source for **https://khinmgsan271.github.io/**.

## Projects and scope

| Project | Demonstrates | Status |
| --- | --- | --- |
| WalletScope | Synthetic browser demo with filters/CSV; separate opt-in C#/.NET WPF wallet-software metadata inventory | Original, AI-assisted learning demo; fictional data; Windows build not validated |
| CartCraft Storefront | Responsive web interface, catalog, search, sorting, basket calculations | Original, AI-assisted learning demo; fictional products, no payments |
| QualityDeck | JavaScript QA assertions, local test results, SVG trends | Original, AI-assisted learning demo; fictional analytics |
| MemoryOrbit | Browser game state, matching pairs, timers, keyboard/touch buttons | Original, AI-assisted learning demo |
| CartCraft Local API | Read-only Node.js HTTP API, SQLite relational schema and queries | Original, AI-assisted local-only source demo; not deployed on Pages |
| Binance P2P MMK Calculator | User's prior project in a [separate repository](https://github.com/Khinmgsan271/Binance-P2P-MMK) | Previous personal project; separate project may have independent history |
| Recursive Savings Goal Planner | MATLAB recursion, projections, validations | Academic/self-directed, source not included here |

All new sample projects were designed specifically for this portfolio and created with AI assistance. **They are not professional client deliveries, security scanners, financial analytics products, or production-grade banking/e-commerce systems. The Windows WPF project includes a limited, explicitly user-authorized local-only metadata inventory mode; the hosted browser demo remains synthetic.** No external authored source code or screenshots were copied.

### Privacy and safety
- No client user accounts, checkout, payment collection, wallet connections, private keys, seed phrases, transaction signing, or tracking scripts.
- The public WalletScope web demo uses fictional records and cannot scan devices. The separate Windows WPF source has an opt-in local metadata-only scan; it never reads wallet contents or connects to the network.
- Pages hosts HTML/CSS/JS only; the backend/ source is not remotely executable on GitHub Pages.

## Run tests locally

Requires Node.js 18+:

    node walletscope/tests/test_demo.js
    node backend/test.js
    node --check commerce/app.js
    node --check quality/app.js
    node --check arcade/app.js

For optional sample SQL queries with SQLite 3:

    sqlite3 :memory: < backend/db/schema.sql

## Run the backend locally

    node backend/server.js

Then visit \`http://127.0.0.1:8765/api/health\`. This API binds only to localhost and cannot process real orders.

## Learning references (attributed, not copied)
- [Microsoft WPF samples](https://github.com/microsoft/WPF-Samples) — desktop UI examples
- [WPF Inventory App](https://github.com/KTLaughter/WPF-Inventory-App) — sample inventory patterns
- [Windows Inventory Lite](https://github.com/didimozg/windows-inventory-lite) — local software inventory concepts
- [Argus](https://github.com/Surge77/argus) — read-only web3 dashboard concepts
- [GitHub Pages documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site) — deployment
- General interaction patterns used by e-commerce storefronts, analytics dashboards, browser games and software engineering test suites (not reproductions of any specific product's source code)

## LaborX skills

**Hands-on or academic experience:** Python, JavaScript, HTML/CSS, beginner front end, AutoCAD, MATLAB, entry-level QA, technical documentation and data work.

**Areas explored through these AI-assisted prototypes:** responsive mobile interfaces, Node.js backend basics, SQLite database design, e-commerce demo UIs, browser game development, SVG-based data analytics, and Windows WPF source with opt-in software-metadata inventory (Windows build status tracked by GitHub Actions).

**Additional service interests:** translation, transcription checking, proofreading, and review feedback. No unverified customer work or advanced expertise is claimed.

© 2026 Khin Mg San.