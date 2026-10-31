# Bar: materials

Status: design intent of 2026-10-31. Every quantity comes from bar.json [E]; a line carries a price only where the studio prices the same part, a placeholder under AS-21 [A], and the rest wait for quotes.

What the bar needs, in one bill: its equipment, its joinery, the linings of the box, the deck and its lounge, the electrics and the water.

Kinyarwanda: [soma uru rutonde mu Kinyarwanda](materials.rw.md) · The bar drawn: [the bar page](/en/bar) · When it is needed: [the execution plan](plan.md)

## What to buy

[The bill of materials](../../src/components/bar/docs-sections.tsx#BarMaterials)

The linings follow the studio's ([the studio's materials](../studio/materials.md)), measured on the bar's box.

## How a price becomes real

1. Start with the lines that move the total: the linings' foam, the coffee machine, the fridges, the joinery, the deck and its chairs.
2. Ask for three written quotes per line, with the same specification and the same quantity.
3. Record each quote in the [prices register](../../study/registers/prices.csv) with its date and supplier, and mark its line verified.
4. Give the line its price in `src/components/bar/bom.ts`, or the part its price in `scripts/studio/prices.py` when every place buys it (then run `python3 scripts/site/prices.py`), so this bill and the farm's show it.
