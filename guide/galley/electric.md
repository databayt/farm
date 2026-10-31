# Galley: electric

Status: design intent of 2026-10-31, drawn for electric cooking. Every rating is a design value for the chosen model's rating plate, until a RURA class A electrician designs and certifies the installation [A].

Everything the electrician needs to wire the galley: the three-phase supply, the circuits, the first fix before the linings close, the second fix, the tests and every point.

Kinyarwanda: [soma aya mabwiriza mu Kinyarwanda](electric.rw.md) · The wiring drawn: [the galley page](/en/galley#electrical) · When it happens: [the execution plan](plan.md) · The method in full: [the studio's electric](../studio/electric.md)

## At a glance

| What | Design |
|---|---|
| Supply | 400 V three-phase, a buried cable from the farm's site board ([the farm's electric](../farm/electric.md)) |
| Board | on the front wall by the staff door: a 63 A four-pole main switch with surge protection, one RCBO per circuit |
| Circuits | 11; the range, the griddle and the fryer each on a three-phase circuit with its own isolator beside the line |
| Safety | an emergency stop by the service door drops the whole line through one contactor; the line runs only while the extract fan runs, an interlock in the hood control |
| Demand | the power guide's 25 kWh a day and 14 kW peak assume electric cooking; about 8 kWh a day if the line cooks on gas |

## Hold points

1. **Battens first.** Start the first fix only when the battens are fixed and the floor sheets are down.
2. **Before the insulation.** Every conduit, box and cable is in, tested, photographed and signed before the walls close.
3. **Before power-on.** The tests pass and the RURA certificate is signed before the galley is fed.

## Steps

1. **First fix:** the board box by the staff door; conduit up into the ceiling, along it and straight down to each box; the cables circuit by circuit, the three-phase ones to the line's isolators.
2. **Tests before the linings:** continuity and insulation resistance on every cable; photograph each wall; sign the release.
3. **Second fix:** the board, the isolators, the emergency stop and its contactor, the hood control and the roof fan, the IP44 sockets, the IP65 battens and the heat alarm.
4. **Certificate:** polarity, the RCBOs' trip times, the earth rod, the emergency stop and the fan interlock tried; the RURA certificate before the galley is fed.

## Circuits

[Circuits](../../src/components/galley/docs-sections.tsx#GalleyCircuits)

## Points

[Electric points](../../src/components/galley/docs-sections.tsx#GalleyElectricPoints)

## Open questions

1. Gas or electric cooking? On gas, the range, the griddle and the fryer lose their three-phase circuits, and the galley's day falls from about 25 kWh to about 8.
