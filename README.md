# Farm

This repo plans and documents Digital Farm: about 5 ha in Gashora, Bugesera, an hour from Kigali, with the lake in view across a neighbour's plot. Guests stay in converted containers, eat what the field grows and work in the study room; a small herd and the compost loop join later.

It holds the site at https://farm.databayt.org (each place drawn, with its execution plan, materials and services) and the study behind it.

> **Building the first phase** (from 2026-10-29): every place at its minimum, the studios and the guest rooms first. The land is known from the founder's sketch and footage; the land title (UPI) and the soil and water tests are still open. Current state: [`PROJECT_STATUS.md`](PROJECT_STATUS.md).

## What's where

| Path | Contents |
|---|---|
| [`PROJECT_STATUS.md`](PROJECT_STATUS.md) | Where each place stands, what is still open |
| `guide/` | The docs by place: each place's execution plan, materials and services (D-059) |
| `study/brief/` | The master brief the study follows (verbatim) |
| `study/discovery/` | Farm questionnaire, site inspection checklist, soil and water testing plan, zoning concept |
| `study/research/` | Desk research (location, markets and institutions, crops, livestock, suppliers, buyers) and the preliminary report |
| `study/registers/` | Sources, prices, suppliers, buyers, the media register (CSV) and the assumptions register |
| `study/feasibility/` | Decision matrix, financial model (`.xlsx`) and its notes |
| `study/design/`, `study/engineering/`, `study/operations/` | Farm design, engineering systems, operating procedures |
| `study/studio/` | The two container studios: the design package and the survey sheet |
| `study/execution/` | First 90 days, five-year roadmap, decision log |
| `scripts/` | `build_financial_model.py` regenerates the financial model; `studio/` generates the container-studio package (`pnpm studio:build`) |
| `public/designs/studio/` | Generated studio drawings, 3D model, CNC files, tables and PDFs |
| `src/` | The website (Next.js 16): the homepage, a page per place, the docs; `src/components/drawing` dimensions every 2D as the studio's plan |

## How to read the study

Every claim carries a label:

- **[V]** verified, with a source ID from `study/registers/sources.csv`
- **[E]** estimate, with the method shown
- **[A]** assumption, to be validated
- **[U]** unknown

Prices are in RWF and always come with a unit, a price type, a market and a date. A prospect is not a customer, and a listed supplier is not confirmed stock. The full rules are in [`CLAUDE.md`](CLAUDE.md).

## Stages

1. Discovery and location — done but for the land title (UPI)
2. Market research and field validation
3. Feasibility: compare the farm models, complete the financial model
4. Farm design: land use, crops, livestock, water, soil, pasture
5. Engineering: priority systems and their commissioning
6. Commercial launch: go-to-market, brand, pitch, website
7. **Execution — now:** each place built at its minimum, gated by the septic, the electrical certificate and the RDB licence

## Financial model

```bash
uv run --with openpyxl python scripts/build_financial_model.py
```

This writes `study/feasibility/financial-model.xlsx`. The inputs are on the `Assumptions` and `Models` sheets. A scenario switch (downside / base / upside) and a farm-model switch (M1 / M2 / M3) sit on the `Control` sheet.

## The docs

`pnpm dev` and open http://localhost:3000/en/docs (or /rw/docs in Kinyarwanda). The docs are grouped by place, each opening on its execution plan, then its materials and its services (D-059); `scripts/sync-docs.mjs` generates them from `guide/` on every dev and build. Only the first phase is published: the study (research, registers, decision log, business) stays in the repo, and the docs link to it on GitHub. See `src/components/docs/README.md`.

## Deploy (public)

Live at https://farm.databayt.org: a static export served by Cloudflare Workers Static Assets (Worker `farm`, `wrangler.jsonc`), as in thmanyah.

```bash
pnpm deploy:cf   # CF_STATIC=1 next build → out/ → wrangler deploy
```

## Website

Next.js 16 · React 19 · Tailwind CSS 4:

```bash
pnpm install
pnpm dev   # http://localhost:3000
```
