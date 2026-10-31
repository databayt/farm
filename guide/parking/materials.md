# Parking: materials

Status: design intent of 2026-10-31. Sizes and quantities come from parking.json and the plan; nothing at the way in is sourced or priced yet [A].

What the way in needs: its parts (the gate, the sign, the gravel and its edging, the setts, the stops and the trees), its solar lighting and its drainage, as its page shows them.

Kinyarwanda: [soma uru rutonde mu Kinyarwanda](materials.rw.md) · The way in drawn: [the parking page](/en/parking) · When it is needed: [the execution plan](plan.md)

## What to buy

[The parts, the lighting and the drainage](../../src/components/parking/docs-sections.tsx#ParkingMaterials)

The base, the gravel and the geotextile come by the quantities above once the builder confirms the depths (D-065).

## How a price becomes real

1. Start with the lines that move the total: the gravel and its base, the granite setts, the gate, the sign's solar kit.
2. Ask for three written quotes per line, with the same specification and the same quantity.
3. Record each quote in the [prices register](../../study/registers/prices.csv) with its date and supplier, and mark its line verified.
4. Write the price on its card in `src/components/parking/rails.ts`, so the page and this table show it.
