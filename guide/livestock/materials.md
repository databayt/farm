# Livestock: materials

Status: design intent of 2026-10-31. Sizes come from livestock.json; prices appear only where a source gives one (a goat about RWF 40,000 [LVS-01], a sheep about RWF 100,000 [LVS-56]), the rest are placeholders or not yet sourced [A].

What the yard needs: its animals, the yard's fittings, its water and its manure loop, as its page shows them.

Kinyarwanda: [soma uru rutonde mu Kinyarwanda](materials.rw.md) · The yard drawn: [the livestock page](/en/livestock) · When it is needed: [the execution plan](plan.md)

## What to buy

[The animals, the yard, the water and the manure](../../src/components/livestock/docs-sections.tsx#LivestockMaterials)

The shed's poles, boards and thatch come by the quantities a builder takes off the page's build-up.

## How a price becomes real

1. Start with the lines that move the total: the animals, the tank, the shed's poles and thatch.
2. Ask for three written quotes per line, with the same specification and the same quantity; the animals through the vet.
3. Record each quote in the [prices register](../../study/registers/prices.csv) with its date and supplier, and mark its line verified.
4. Write the price on its card in `src/components/livestock/rails.ts`, so the page and this table show it.
