# Galley: materials

Status: design intent of 2026-10-31. Sizes come from galley.json; nothing is sourced or priced yet [A].

What the galley needs: its equipment, its electric devices and its plumbing parts, as its page shows them.

The galley drawn: [the galley page](/en/galley) · When it is needed: [the execution plan](plan.md)

## What to buy

[The equipment, the electric devices and the plumbing](../../src/components/galley/docs-sections.tsx#GalleyMaterials)

The floor, the battens and the linings follow the studio's list, scaled to the 40 ft box ([the studio's materials](../studio/materials.md)).

## How a price becomes real

1. Start with the lines that move the total: the cooking line and its hood, the cold store, the stainless worktop.
2. Ask for three written quotes per line, with the same specification and the same quantity, once gas or electric is decided.
3. Record each quote in the [prices register](../../study/registers/prices.csv) with its date and supplier, and mark its line verified.
4. Write the price on its card in `src/components/galley/rails.ts`, so the page and this table show it.
