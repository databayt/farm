# Farm

This repo plans the development of an existing 2–10 ha farm near a lake in the broader Kigali region, Rwanda. The aim is a productive, commercially sustainable integrated farm (fruit trees, goats and sheep, pasture and agroforestry), with engineering and software used only where they earn their cost.

It holds the study that decides what to build and, later, the farm's website.

> **Stage 1 — discovery and desk research** (started 2026-10-19). The farm's exact location is not confirmed yet, so nothing here is site-specific. Current state: [`PROJECT_STATUS.md`](PROJECT_STATUS.md).

## What's where

| Path | Contents |
|---|---|
| [`PROJECT_STATUS.md`](PROJECT_STATUS.md) | Stage, done / open, the founder's questions, next actions |
| `study/brief/` | The master brief the study follows (verbatim) |
| `study/discovery/` | Farm questionnaire, site inspection checklist, soil and water testing plan, zoning concept |
| `study/research/` | Desk research (location, markets and institutions, crops, livestock, suppliers, buyers) and the preliminary report |
| `study/registers/` | Sources, prices, suppliers, buyers (CSV) and the assumptions register |
| `study/feasibility/` | Decision matrix, financial model (`.xlsx`) and its notes |
| `study/execution/` | First 90 days, decision log |
| `scripts/` | `build_financial_model.py` regenerates the financial model |
| `src/` | The website (Next.js 16), built in Stage 6 |

## How to read the study

Every claim carries a label:

- **[V]** verified, with a source ID from `study/registers/sources.csv`
- **[E]** estimate, with the method shown
- **[A]** assumption, to be validated
- **[U]** unknown

Prices are in RWF and always come with a unit, a price type, a market and a date. A prospect is not a customer, and a listed supplier is not confirmed stock. The full rules are in [`CLAUDE.md`](CLAUDE.md).

## Stages

1. **Discovery and location** — now
2. Market research and field validation
3. Feasibility: compare the farm models, complete the financial model
4. Farm design: land use, crops, livestock, water, soil, pasture
5. Engineering: priority systems and their commissioning
6. Commercial launch: go-to-market, brand, pitch, website
7. Execution: schedule, operating procedures, decision gates

## Financial model

```bash
uv run --with openpyxl python scripts/build_financial_model.py
```

This writes `study/feasibility/financial-model.xlsx`. The inputs are on the `Assumptions` and `Models` sheets. A scenario switch (downside / base / upside) and a farm-model switch (M1 / M2 / M3) sit on the `Control` sheet.

## Website (Stage 6)

Next.js 16 · React 19 · Tailwind CSS 4:

```bash
pnpm install
pnpm dev   # http://localhost:3000
```
