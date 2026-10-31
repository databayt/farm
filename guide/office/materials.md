# Office: materials

Status: design intent of 2026-10-31. Sizes come from office.json; the electrical costs shown are the studio's placeholder prices (AS-21), and the furniture and the network gear are neither sourced nor priced [A].

What the office needs: its furniture and equipment, its electric devices and the network gear, as its page shows them.

The office drawn: [the office page](/en/office) · When it is needed: [the execution plan](plan.md)

## What to buy

[The furniture and equipment, the electric devices and the network](../../src/components/office/docs-sections.tsx#OfficeMaterials)

The floor, the battens and the linings follow the studio's list, scaled to the office ([the studio's materials](../studio/materials.md)).

## How a price becomes real

1. Start with the lines that move the total: the computer and the screen, the network gear, the L sofa and the big desk.
2. Ask for three written quotes per line, with the same specification and the same quantity.
3. Record each quote in the [prices register](../../study/registers/prices.csv) with its date and supplier, and mark its line verified.
4. Write the price on its card in `src/components/office/rails.ts`, so the page and this table show it.
