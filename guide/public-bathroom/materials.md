# Public bathroom: materials

Status: design intent of 2026-10-31. Sizes come from public-bathroom.json, for the plumber and the electrician to confirm; nothing is sourced or priced yet [A].

What the bathroom needs: its fixtures, its electric devices and its plumbing parts with their pipe, as its page shows them.

Kinyarwanda: [soma uru rutonde mu Kinyarwanda](materials.rw.md) · The bathroom drawn: [the public bathroom page](/en/public-bathroom) · When it is needed: [the execution plan](plan.md)

## What to buy

[The fixtures, the electric devices and the plumbing](../../src/components/public-bathroom/docs-sections.tsx#PublicBathroomMaterials)

The tiles, the cement board and the studs come from the page's build-up; the septic tank is the farm's ([the farm's materials](../farm/materials.md)).

## How a price becomes real

1. Start with the lines that move the total: the WCs and the urinal, the basin counter, the tiles.
2. Ask for three written quotes per line, with the same specification and the same quantity.
3. Record each quote in the [prices register](../../study/registers/prices.csv) with its date and supplier, and mark its line verified.
4. Write the price on its card in `src/components/public-bathroom/rails.ts`, so the page and this table show it.
