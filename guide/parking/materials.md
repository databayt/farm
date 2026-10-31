# Parking: materials

Status: design intent of 2026-10-31. Every quantity comes from parking.json and the plan [E]; a line carries a price only where the studio prices the same part, a placeholder under AS-21 [A], so most of the way in waits for quotes.

What the way in needs, in one bill: the gate, the sign wall and the hedge; the gravel parking in its timber edging; the turn and the rock road; the solar lights; the drainage and the trees.

Kinyarwanda: [soma uru rutonde mu Kinyarwanda](materials.rw.md) · The way in drawn: [the parking page](/en/parking) · When it is needed: [the execution plan](plan.md)

## What to buy

[The bill of materials](../../src/components/parking/docs-sections.tsx#ParkingMaterials)

The base, the gravel and the geotextile come by the quantities above once the builder confirms the depths (D-065).

## How a price becomes real

1. Start with the lines that move the total: the gravel and its base, the granite setts, the gate, the sign's solar kit.
2. Ask for three written quotes per line, with the same specification and the same quantity.
3. Record each quote in the [prices register](../../study/registers/prices.csv) with its date and supplier, and mark its line verified.
4. Give the line its price in `src/components/parking/bom.ts`, or the part its price in `scripts/studio/prices.py` when every place buys it (then run `python3 scripts/site/prices.py`), so this bill and the farm's show it.
