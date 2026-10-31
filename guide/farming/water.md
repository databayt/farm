# Farming: water

Status: design intent of 2026-10-31. The layout is generated (`scripts/site/farming.mjs`); the tank, the pump and the source are the farm's, and wait for the borehole's test [A].

How the water reaches every bed: from the farm's source, tank and pump through the filter, the main and the supply to one valve per block, then each block's header and two drip lines down every planted bed.

The drip drawn: [the field page](/en/farming#water) · When it happens: [the execution plan](plan.md) · Where the water comes from: [the farm's water](../farm/water.md)

## At a glance

| What | Design |
|---|---|
| Source | the farm's tank and pump, waiting for the borehole's test ([the farm's water](../farm/water.md)) |
| Filter and main | a 1 inch disc filter, then a 40 mm main to the field's gate |
| Supply | a 32 mm supply along the main path and the aisles, to one valve per block |
| Beds | each block's header across its gate-side bed ends, and two drip lines down every planted bed |
| Need | {{farming.water.dryLow}} to {{farming.water.dryHigh}} m³ a day in the driest months, about {{farming.water.wet}} m³ in the wet [E] |

## Hold points

1. **The borehole tested first.** The tank and the pump are sized only once the borehole's test shows what it gives.
2. **Every emitter checked.** The drip runs for an hour and every emitter is checked before anything is planted.

## Steps

1. **Main:** from the farm's tank and pump, through the disc filter, the 40 mm main to the gate.
2. **Supply:** the 32 mm supply along the main path and the aisles, a valve at each block.
3. **Headers:** each block's header across its gate-side bed ends.
4. **Drip:** two drip lines down every planted bed, from its header.
5. **Test:** run it for an hour, check every emitter, then mulch the beds.

## Points

[Water points](../../src/components/farming/docs-sections.tsx#FarmingWaterPoints)

## Open questions

1. Does the field draw on the borehole or on the mains, and how much does the borehole give through June to August?
