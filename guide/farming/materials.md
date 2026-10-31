# Farming: materials

Status: placeholders of 2026-10-31: every price is an assumption until three quotes per line [A]. The field's tank, pump and source are the farm's ([the farm's water](../farm/water.md)).

Everything the first {{farming.bedsTotal}} beds need to start: the ground and the beds, the water, the fence, the nursery, the seed and plants, the tools and the people.

The field drawn: [the field page](/en/farming) · When it is needed: [the execution plan](plan.md)

## What to buy

[Bill of materials](../../src/components/farming/docs-sections.tsx#FarmingBom)

## How a price becomes real

1. Start with the lines that move the total: the drip and its pipe, the fence, the compost and the seed.
2. Ask for three written quotes per line, with the same specification and the quantity for the {{farming.bedsTotal}} beds.
3. Record each quote in the [prices register](../../study/registers/prices.csv) with its date and supplier, and mark its line verified.
4. Change the line's price in `src/components/farming/farming.json` and rerun the field's generator (`scripts/site/farming.mjs`), so the bill and the page update.
