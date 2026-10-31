# Guest room: electric

Status: design intent of 2026-10-31. Every rating is design intent until a RURA-licensed electrician (class A) designs the supply and certifies the room.

Everything the electrician needs to wire one guest room: the circuits, the first fix before the linings close, the second fix, the tests and every point.

The three rooms are wired the same, so one page serves all three.

The wiring drawn: [the guest room page](/en/guest-room#electrical) · When it happens: [the execution plan](plan.md) · The method in full: [the studio's electric](../studio/electric.md)

## At a glance

| What | Design |
|---|---|
| Supply | a cable from the farm's site board, sized by the electrician to its run ([the farm's electric](../farm/electric.md)) |
| Board | the room's own 12-module surface board by the bed: a double-pole 32 A main switch, type 2 surge protection, one RCBO (30 mA, type A) per circuit |
| Circuits | 4: the lights and the wall fan, the sockets, the AC provision, a spare |
| Cable route | conduit in the linings: up into the ceiling, along it, then straight down to each device |
| Bedside | the lamps plug into P1 and P2, so the bed has a lamp on each side (D-029) |

## Hold points

1. **Battens first.** Start the first fix only when the battens are fixed and the floor sheets are down.
2. **Before the insulation.** Every conduit, box and cable is in, insulation-tested, photographed and signed before the walls close.
3. **Before power-on.** The tests pass and the RURA certificate is signed before the room is fed.

## Steps

1. **First fix:** set the board box by the bed; run the conduit up from it into the ceiling, along it and straight down to each box; pull the cables circuit by circuit.
2. **Tests before the linings:** continuity and insulation resistance on every cable; photograph each wall; sign the release.
3. **Second fix:** fit the board, then the lights, the wall fan, the sockets, the AC isolator and the smoke alarm.
4. **Certificate:** polarity, the RCBOs' trip times and the earth; the RURA certificate before the room is fed.

## Circuits

[Circuits](../../src/components/guest-room/docs-sections.tsx#GuestRoomCircuits)

## Points

[Electric points](../../src/components/guest-room/docs-sections.tsx#GuestRoomElectricPoints)

## Open questions

1. An en-suite (D-029) would add a water-heater circuit and the plumbing: the [execution plan](plan.md) decides it first.
2. The supply cable's size waits for its run's length, from the survey.
