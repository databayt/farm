@AGENTS.md

# Farm — a technology-enabled integrated farm in Rwanda

This repo holds two things:

1. `study/` — the feasibility study and business plan for developing an existing 2–10 ha farm near a lake in the broader Kigali region. Internal working documents, built in stages per the brief at `study/brief/master-prompt.txt`.
2. `src/` — the Next.js 16 app, in English and Kinyarwanda under `/en` and `/rw` (D-058): the homepage, the place pages, and the docs at `/en/docs` and `/rw/docs` (generated from `guide/` and `study/` by `scripts/sync-docs.mjs`; never edit `content/docs` by hand). Shared words live in `src/components/internationalization/{en,rw}.json`; `rw` is a machine draft until a native review.

Current stage, open questions and next actions: `PROJECT_STATUS.md`. Why things changed: `study/execution/decision-log.md`.

## Evidence rules

Every factual claim, number, price and legal requirement carries one label:

- `[V]` verified: a cited, credible source states it. Give its source ID.
- `[E]` estimate: derived. Show the method and inputs.
- `[A]` assumption: a placeholder. Give its ID in `study/registers/assumptions.md` and how it will be validated.
- `[U]` unknown: becomes a founder or field question.

Cite with topic-prefixed source IDs (`LOC-07`, `MKT-03`, `CRP-12`, `LVS-04`, `BUY-09`; later `REG-`, `ENG-`, `FIN-`). Each must resolve in `study/registers/sources.csv`.

- Never fabricate prices, suppliers, contacts, quotes, customers, interviews, yields or site observations. If something can't be found, write `not found (searched: …)`.
- A price is `[V]` only when a primary or institutional source shows it. Record the unit, the price type (farm-gate, wholesale, retail, producer or FOB), the market and the observation date.
- A prospect is not a customer. A listed supplier is not confirmed stock.
- The location is unconfirmed until the founder sends a pin or the land-title UPI. Until then, make no site-specific claims and frame findings by candidate zone.
- Export potential is not export readiness. Generic African data does not prove anything for Rwanda.

## Units and dates

- RWF is the main currency. Quote USD only together with the rate and its date, preferring the BNR reference rate.
- Hectares, with acres in brackets where useful. Tree yields are per tree per year at a stated tree age.
- Every observation carries the date it was accessed or observed, as `YYYY-MM-DD`.

## No outreach

Do not contact suppliers, buyers or government offices, and send no email, Slack or WhatsApp messages on the founder's behalf. The exception is a specific contact he has explicitly authorized. Outreach templates are drafts.

## Registers (`study/registers/`)

| File | Columns |
|---|---|
| `sources.csv` | id, claim, title, organization, url, published, accessed, reliability, notes |
| `prices.csv` | id, product, unit, price_rwf, price_type, market_location, observed, source_id, label, notes |
| `suppliers.csv` | id, name, category, location, offerings, public_contact, url, prices_published, certification, source_id, verified, notes |
| `buyers.csv` | id, name, category, location, buys, direct_from_farms, public_contact, url, approach, source_id, status, notes |
| `assumptions.md` | ID, assumption, value, basis, impact if wrong, validation, status |
| `media.csv` | id, file, kind, taken, source, place, zone, evidence, people, plates, use, confidence, same_as, notes |

Source reliability grades: `A` official primary · `B` institutional or research · `C` reputable media or business · `D` weak.

`media.csv` says where every photo and clip was taken. `place` is `land` (with the landmark seen in `evidence`), `neighbour`, `elsewhere: <where>`, `reference`, `generated` (AI) or `unknown`. Only a `land` row with high confidence and no recognisable person or plate is shown as "Today"; an `unknown` row is never "the farm" until the founder confirms it. Add each new batch before using any of it.

## Layout

```
study/brief        the master prompt (verbatim)
study/discovery    questionnaire, site inspection, soil/water testing, zoning concept
study/research     desk research by topic + the preliminary report
study/registers    sources, prices, suppliers, buyers, assumptions
study/feasibility  decision matrix, financial model (+ notes)
study/studio       container studios (generated assets in public/designs/studio)
study/execution    first 90 days, decision log
guide/             the docs by place (D-059): guide/<place>/<kind>.md, its execution plan (plan.md), materials and
                   services, + its Kinyarwanda <kind>.rw.md (/rw/docs); numbers are {{studio.*}}, {{site.*}} and
                   {{farming.*}} tokens from the generators' data
scripts/           generators (financial model, studio package, site assets, contact sheets, docs sync)
```

Regenerate the container-studio package (drawings, model, CNC, BOM) with `pnpm studio:build` (add `--pdf` for a revision's PDFs); inputs are `scripts/studio/params.py` and `study/studio/survey.csv`.

Regenerate the financial model with `uv run --with openpyxl python scripts/build_financial_model.py`. Edit the inputs in the script or on the workbook's Assumptions sheet, and record the change in the decision log.

## Repo workflow

Work on `main` only. Make small conventional commits with explicit paths. The remote is the public repo databayt/farm (D-013).
