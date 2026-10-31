# Dining area: materials

Status: design intent of 2026-10-31 (D-069). Sizes come from dining.json, read off the founder's photos (AS-31); nothing is sourced or priced yet [A].

What the dining area needs: its structure and its furniture, part by part, as its page shows them. The wall and the arches stand today, and the mesh is going on.

Kinyarwanda: [soma uru rutonde mu Kinyarwanda](materials.rw.md) · The dining area drawn: [the dining page](/en/dining) · When it is needed: [the execution plan](plan.md)

## What to buy

[The structure and the furniture](../../src/components/dining/docs-sections.tsx#DiningMaterials)

Wire for tying the mesh and the thatch, and laterite for the floor, go with them.

## How a price becomes real

1. Start with the lines that move the total: the thatch and its labour, the tables and benches.
2. Ask for three written quotes per line, with the same specification and the quantity.
3. Record each quote in the [prices register](../../study/registers/prices.csv) with its date and supplier, and mark its line verified.
4. Write the price on its card in `src/components/dining/rails.ts`, so the page and this table show it.
