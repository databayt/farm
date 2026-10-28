# Studio bill of materials

Status: quantities from the model (rev A); prices are mostly placeholders [A, AS-21]. Only about 2% of the value rests on published prices (the fridge and the REG connection, STU-P03 and STU-P05). Nothing here is a quote.

## Summary

[Table: Cost by category, one studio and both](../../public/designs/studio/data/bom-summary.csv)

[Table: Shared site works (both studios and the office)](../../public/designs/studio/data/shared-works.csv)

USD figures use the BNR reference rate of 1,475.91 RWF on 2026-10-23 [V STU-36]: about USD {{studio.all_units_usd_k}},000 for both studios at the placeholder prices [E].

## Where the money goes

- **Roof terrace kit** is the largest single item per studio (about RWF {{studio.roof_rwf_m}}M [A]): fabricated steel, decking, polycarbonate and the stair. It is also the easiest to defer: the interior works without it, and a simple shade roof is cheaper.
- **Labour** (about RWF 2.1M per studio [A]): workshop, site crew, licensed electrician, plumber, tiler, welder, transport.
- **Boards** (about RWF 1.4M per studio [A]): {{studio.sheets_ply18}} + {{studio.sheets_ply12}} + {{studio.sheets_mply18}} sheets and the worktop for the kits, {{studio.floor_sheets}} for the floor.

## Detail

The full line list, per studio, with quantities, unit prices, labels and sources, is in [bom.csv](../../public/designs/studio/data/bom.csv) and the [workbook](../../public/designs/studio/data/bom.xlsx); the table page `studio-bom-table` renders it.

## How to make it real: three quotes per line

1. Start with the lines that move the total: steel and polycarbonate (roof kit), boards, sanitaryware, the water heater, labour.
2. Ask for three written quotes per line, same specification, same quantity for two studios.
3. Record each quote in `study/registers/prices.csv` (price type `quote`, date, supplier) and change the label in `scripts/studio/prices.py` from A to V with the price id.
4. Rebuild (`pnpm studio:build`); the summary and the workbook update.
