# CartCraft demo backend — Node.js + SQLite source

**Status:** Original AI-assisted educational prototype, not a hosted production API or paid customer delivery. This backend code is intentionally not deployed on GitHub Pages (which is static hosting).

## Run locally

Node.js 18+:

    node server.js

Browse [http://127.0.0.1:8765/api/health](http://127.0.0.1:8765/api/health) for a JSON health check. Endpoints: \`/api/products\`, \`/api/products?q=notebook\`, \`/api/products?category=Homeware\`, and \`/api/analytics\`.

Run API tests:

    node test.js

## Database example

SQLite 3 is optional. Run:

    sqlite3 /tmp/cartcraft-demo.sqlite < db/schema.sql
    sqlite3 -header -column /tmp/cartcraft-demo.sqlite < db/queries.sql

All records are fictional. No customer details, payments, private keys, personal addresses, or credentials. The demo binds to local loopback, refuses write methods, and does not access the real wallet or computer software inventory.

Skills demonstrated: learning-level Node.js backend API, REST routing, validation basics, database design and SQL analytics. No real production deployments or client experience are claimed.
