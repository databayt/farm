# Studio: materials

Status: revision {{studio.rev}}, {{studio.rev_date}}, {{studio.status}}. Every price is a placeholder until three quotes per line [A].

Everything one studio needs: the carpenter's sheets and battens, the full bill of materials kit by kit, and the files the workshop cuts from.

Kinyarwanda: [soma uru rutonde mu Kinyarwanda](materials.rw.md) · The studio drawn: [the studio page](/en/studio) · When it is needed: [the execution plan](plan.md)

## What to buy

### The carpenter's list, per studio

| Item | Quantity |
|---|---|
| Plywood 12, sheets 2440 × 1220, floor | {{studio.floor_sheets}} |
| Plywood 12, sheets 2440 × 1220, linings | {{studio.sheets_ply12}} |
| Plywood 18, sheets 2440 × 1220 | {{studio.sheets_ply18}} |
| Marine plywood 18, sheets 2440 × 1220 (bathroom) | {{studio.sheets_mply18}} |
| Worktop blank 38, 3050 × 650 | {{studio.sheets_wtop38}} |
| Treated battens 38 × 50, 2.4 m long | {{studio.battens}}, plus 10% spare |
| Polythene membrane 250 µm | {{studio.membrane_m2}} m² |
| Oak planks 5 with underlay | {{studio.plank_m2}} m² |
| Spray foam, by the contractor | {{studio.foam_m2}} m² |
| Winged screws 5.5 × 50 | {{studio.batten_screws}} |
| Wood screws 4 × 30, floor and linings | {{studio.floor_screws}} + {{studio.lining_screws}} |
| Concrete block stands 40 × 60 cm | 4 |

### The bill of materials

[Bill of materials](../../src/components/studio/docs-sections.tsx#StudioBom)

The full list with prices is the [bill of materials](../../public/designs/studio/data/bom.csv); every part's size is in the [cut list](../../public/designs/studio/data/cut-list.csv). What the two studios share with the farm (the septic tank, the storage tank and its booster, the site board) is on [the farm's materials](../farm/materials.md).

### Made in Kigali, the IKEA way

[Built the IKEA way](../../src/components/studio/docs-sections.tsx#StudioSteps)

[Files for the workshop](../../src/components/studio/docs-sections.tsx#StudioDownloads)

## How a price becomes real

1. Start with the lines that move the total: steel and polycarbonate (the roof kit), boards, sanitaryware, the water heater, labour.
2. Ask for three written quotes per line, with the same specification and the same quantity for two studios.
3. Record each quote in the [prices register](../../study/registers/prices.csv) with its date and supplier, and mark its line verified.
4. Rebuild the studio package (`pnpm studio:build`): the bill of materials and its totals update.
