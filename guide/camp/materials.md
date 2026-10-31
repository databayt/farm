# Camping: materials

Status: design intent of 2026-10-31. Sizes come from camp.json, read off the render; nothing is sourced or priced yet [A].

What one camp needs: the tent and its kit, piece by piece, as its page shows them.

Kinyarwanda: [soma uru rutonde mu Kinyarwanda](materials.rw.md) · The camp drawn: [the camping page](/en/camp) · When it is needed: [the execution plan](plan.md)

## What to buy

[The tent and its kit](../../src/components/camp/docs-sections.tsx#CampMaterials)

A groundsheet for each tent, a little smaller than its floor, goes with it.

## How a price becomes real

1. Start with the lines that move the total: the tent, the futon, the rug.
2. Ask for three written quotes per line, with the same specification and the quantity for six tents.
3. Record each quote in the [prices register](../../study/registers/prices.csv) with its date and supplier, and mark its line verified.
4. Write the price on its card in `src/components/camp/rails.ts`, so the page and this table show it.
