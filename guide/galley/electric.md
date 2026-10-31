# Galley: electric

Status: design intent of 2026-10-31, the cooking line on LPG (D-065). Every rating is a design value for the chosen model's rating plate, until a RURA class A electrician designs and certifies the installation [A].

Everything the electrician needs to wire the galley: the single-phase supply, the circuits, the first fix before the linings close, the second fix, the tests and every point.

Kinyarwanda: [soma aya mabwiriza mu Kinyarwanda](electric.rw.md) · The wiring drawn: [the galley page](/en/galley#electrical) · When it happens: [the execution plan](plan.md) · The method in full: [the studio's electric](../studio/electric.md)

## At a glance

| What | Design |
|---|---|
| Supply | 230 V single-phase, a buried cable from the farm's site board ([the farm's electric](../farm/electric.md)) |
| Board | on the front wall by the staff door: a 63 A double-pole main switch with surge protection, one RCBO per circuit |
| Circuits | 9; the line cooks on LPG ([the farm's gas](../farm/gas.md)), so one small circuit feeds only the range's ignition, its oven light and the gas valve, with its isolator beside the line |
| Safety | an emergency stop by the service door shuts the gas valve and the ignition through one contactor; the line runs only while the extract fan runs, an interlock in the hood control |
| Demand | about 8 kWh a day and about 13 kW connected with the line on gas [E, the circuits below]; the cooking itself is the gas guide's about 2.2 kg of LPG a day |

## Hold points

1. **Battens first.** Start the first fix only when the battens are fixed and the floor sheets are down.
2. **Before the insulation.** Every conduit, box and cable is in, tested, photographed and signed before the walls close.
3. **Before power-on.** The tests pass and the RURA certificate is signed before the galley is fed.

## Steps

1. **First fix:** the board box by the staff door; conduit up into the ceiling, along it and straight down to each box; the cables circuit by circuit, the range's to its isolator beside the line.
2. **Tests before the linings:** continuity and insulation resistance on every cable; photograph each wall; sign the release.
3. **Second fix:** the board, the isolators, the emergency stop and its contactor on the gas valve, the hood control and the roof fan, the IP44 sockets, the IP65 battens and the heat alarm.
4. **Certificate:** polarity, the RCBOs' trip times, the earth rod, the emergency stop and the fan interlock tried; the RURA certificate before the galley is fed.

## Circuits

[Circuits](../../src/components/galley/docs-sections.tsx#GalleyCircuits)

## Points

[Electric points](../../src/components/galley/docs-sections.tsx#GalleyElectricPoints)

