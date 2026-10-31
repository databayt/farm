# Public bathroom: electric

Status: design intent of 2026-10-31. Every device, rating and size is a design choice for the electrician to confirm; the feeder's size waits for the site board's design [A].

Everything the electrician needs to wire the public bathroom: the board and its circuits, the first fix, the second fix, the tests and every point.

The wiring drawn: [the public bathroom page](/en/public-bathroom#electrical) · When it happens: [the execution plan](plan.md) · The method in full: [the studio's electric](../studio/electric.md)

## At a glance

| What | Design |
|---|---|
| Supply | a feeder from the farm's site board ([the farm's electric](../farm/electric.md)) |
| Board | a small lockable unit board on the corridor's back wall beside the cleaner's cupboard: a main switch, surge protection, one 30 mA type A RCBO per circuit; TT earthing on the building's own rod |
| Circuits | 4: the indoor lights and the extract fan, the light over the door, the cleaner's socket, a spare |
| Lights | LED ceiling lights with a built-in motion sensor in every room; the urinal room's fan runs with its light and for 15 minutes after |
| The door | its light is on a photocell and a time switch in the board, on with the path lights from 18:00 |

## Hold points

1. **Before the tiles.** Every conduit, box and cable is in and tested before the linings and the tiles close over them.
2. **Before power-on.** The tests pass and the RURA certificate is signed before the bathroom is fed.

## Steps

1. **First fix:** the board box by the cleaner's cupboard; conduit up into the ceiling void, along it and straight down to each device; the cables circuit by circuit.
2. **Tests before the tiles:** continuity and insulation resistance on every cable; photograph each wall; sign the release.
3. **Second fix:** the board, the ceiling lights with their sensors, the urinal room's fan, the light over the door and its time switch, the cleaner's socket.
4. **Certificate:** polarity, the RCBOs' trip times and the earth rod; the RURA certificate before the bathroom is fed.

## Circuits

[Circuits](../../src/components/public-bathroom/docs-sections.tsx#PublicBathroomCircuits)

## Points

[Electric points](../../src/components/public-bathroom/docs-sections.tsx#PublicBathroomElectricPoints)

## Open questions

1. The spare way waits for a shower heater or a hand dryer: does the founder add either?
