# Bar: electric

Status: design intent of 2026-10-31. Every rating is a design value for the chosen model's rating plate, until a RURA class A electrician designs and certifies the installation [A].

Everything the electrician needs to wire the bar: the supply, the circuits, the first fix before the linings close, the second fix, the tests and every point, inside and out.

The wiring drawn: [the bar page](/en/bar#electrical) · When it happens: [the execution plan](plan.md) · The method in full: [the studio's electric](../studio/electric.md)

## At a glance

| What | Design |
|---|---|
| Supply | 230 V single-phase, a buried cable from the farm's site board ([the farm's electric](../farm/electric.md)) |
| Board | on the back wall by the way in: a 40 A double-pole main switch with surge protection, one RCBO per circuit |
| Circuits | 7: the lights inside, the back bar's sockets, the coffee machine on its own with a switched spur beside it, the fridges, the water heater, outside (the flap's light and the counter's socket), a spare |
| Demand | the power guide gives the bar 5 kWh a day and a 2 kW peak; with a two-group coffee machine of about 3 to 4 kW it peaks nearer 5 kW [E] |

## Hold points

1. **Battens first.** Start the first fix only when the battens are fixed and the floor sheets are down.
2. **Before the insulation.** Every conduit, box and cable is in, tested, photographed and signed before the walls close.
3. **Before power-on.** The tests pass and the RURA certificate is signed before the bar is fed.

## Steps

1. **First fix:** the board box by the way in; conduit up into the ceiling, along it and straight down to each box; the cables circuit by circuit; the outside circuit through a gland to the flap's light and the counter's socket.
2. **Tests before the linings:** continuity and insulation resistance on every cable; photograph each wall; sign the release.
3. **Second fix:** the board, the coffee machine's spur, the sockets, the fridges' sockets, the heater's connection, the lights inside and out.
4. **Certificate:** polarity, the RCBOs' trip times and the earth; the RURA certificate before the bar is fed.

## Circuits

[Circuits](../../src/components/bar/docs-sections.tsx#BarCircuits)

## Points

[Electric points](../../src/components/bar/docs-sections.tsx#BarElectricPoints)

## Open questions

1. Which coffee machine? Its rating sets the coffee circuit and the bar's peak, about 5 kW against the power guide's 2.
