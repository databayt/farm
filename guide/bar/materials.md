# Bar: materials

Status: design intent of 2026-10-31. Sizes come from bar.json; nothing is sourced or priced yet [A].

What the bar needs: its equipment, its electric devices and its plumbing parts, as its page shows them.

Kinyarwanda: [soma uru rutonde mu Kinyarwanda](materials.rw.md) · The bar drawn: [the bar page](/en/bar) · When it is needed: [the execution plan](plan.md)

## What to buy

[The equipment, the electric devices and the plumbing](../../src/components/bar/docs-sections.tsx#BarMaterials)

The floor, the battens and the linings follow the studio's list, scaled to the bar ([the studio's materials](../studio/materials.md)).

## How a price becomes real

1. Start with the lines that move the total: the coffee machine, the fridges, the counters.
2. Ask for three written quotes per line, with the same specification and the same quantity, once what the bar serves is decided.
3. Record each quote in the [prices register](../../study/registers/prices.csv) with its date and supplier, and mark its line verified.
4. Write the price on its card in `src/components/bar/rails.ts`, so the page and this table show it.
