# Office: electric

Status: design intent of 2026-10-31. Every rating is design intent until a RURA-licensed electrician (class A) designs the supply and certifies the office; nothing for the network is sourced or priced yet.

Everything the electrician needs to wire the office, and the network the farm starts from: the circuits, the cabinet on its UPS, the first and second fix, the tests and every point.

The wiring and the network drawn: [the office page](/en/office#electrical) · When it happens: [the execution plan](plan.md) · The method in full: [the studio's electric](../studio/electric.md)

## At a glance

| What | Design |
|---|---|
| Supply | a cable from the farm's site board, sized by the electrician to its run ([the farm's electric](../farm/electric.md)) |
| Board | a surface unit board on the back wall: a double-pole 32 A main switch, type 2 surge protection, one RCBO (30 mA, type A) per circuit |
| Circuits | 4: the lights, the sockets, the network cabinet and its UPS, a spare |
| The network | a small wall cabinet: one 4G router with a second operator's SIM as failover, a PoE switch and the edge gateway, which also records the cameras |
| From the switch | a ceiling access point for the office, the big desk's data outlet, and outdoor cable to the access points and cameras elsewhere on the farm |

The cabinet and its UPS have a circuit of their own, so the farm's Wi-Fi and cameras ride through an outage on the battery.

## Hold points

1. **Battens first.** Start the first fix only when the battens are fixed and the floor sheets are down.
2. **Before the insulation.** Every conduit, box, cable and data cable is in, tested, photographed and signed before the walls close.
3. **Before power-on.** The tests pass and the RURA certificate is signed before the office is fed.
4. **No radio before the survey.** No router, access point or camera is bought before the signal survey.

## Steps

1. **First fix:** the board box on the back wall; conduit up into the ceiling, along it and straight down to each box; the cables circuit by circuit; the data cables from the cabinet to the access point and the big desk, and the entry for the outdoor cable.
2. **Tests before the linings:** continuity and insulation resistance on every cable; photograph each wall; sign the release.
3. **Second fix:** fit the board, the lights and the sockets; hang the cabinet with its router, switch, gateway and UPS.
4. **Certificate:** polarity, the RCBOs' trip times and the earth; the RURA certificate before the office is fed; then the network's first test.

## Circuits

[Circuits](../../src/components/office/docs-sections.tsx#OfficeCircuits)

## Points

[Electric points](../../src/components/office/docs-sections.tsx#OfficeElectricPoints)

## Network points

[Network points](../../src/components/office/docs-sections.tsx#OfficeNetworkPoints)

## Open questions

1. What signal does the site get? The router and the access points wait for the survey.
2. Does a cooling circuit come back on the spare (C4)?
