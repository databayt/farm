# Study room: electric

Status: design intent of 2026-10-31. Every rating is design intent until a RURA-licensed electrician (class A) designs the supply and certifies the room.

Everything the electrician needs to wire the study room with its Wi-Fi: the circuits, the first fix before the linings close, the second fix, the tests and every point.

The wiring drawn: [the study room page](/en/study-room#electrical) · When it happens: [the execution plan](plan.md) · The method in full: [the studio's electric](../studio/electric.md)

## At a glance

| What | Design |
|---|---|
| Supply | a cable from the farm's site board, sized by the electrician to its run ([the farm's electric](../farm/electric.md)) |
| Board | a surface unit board on the back wall: a double-pole 32 A main switch, type 2 surge protection, one RCBO (30 mA, type A) per circuit |
| Circuits | 4: the pendants and the wall fans, the table's sockets for all eight seats, the screen wall and the reading corner, a spare |
| Seats | a double socket on the back wall behind each pair of seats, so every seat has its own |
| Wi-Fi | one ceiling access point, powered over its cable from the office's PoE switch; the screen casts over the Wi-Fi, with a data outlet as a fallback |

There is no air conditioning: two wall fans instead.

## Hold points

1. **Battens first.** Start the first fix only when the battens are fixed and the floor sheets are down.
2. **Before the insulation.** Every conduit, box, cable and data cable is in, tested, photographed and signed before the walls close.
3. **Before power-on.** The tests pass and the RURA certificate is signed before the room is fed.

## Steps

1. **First fix:** the board box on the back wall; conduit up into the ceiling, along it and straight down to each box; the cables circuit by circuit; the access point's cable, the screen's data outlet and the entry box low on the back wall for the cable from the office.
2. **Tests before the linings:** continuity and insulation resistance on every cable; photograph each wall; sign the release.
3. **Second fix:** fit the board, the pendants, the wall fans, the sockets and the access point.
4. **Certificate:** polarity, the RCBOs' trip times and the earth; the RURA certificate before the room is fed.

## Circuits

[Circuits](../../src/components/study-room/docs-sections.tsx#StudyRoomCircuits)

## Points

[Electric and Wi-Fi points](../../src/components/study-room/docs-sections.tsx#StudyRoomElectricPoints)

## Open questions

1. The screen's socket is sized for a 65-inch screen, the page's is 86 inches: the load follows the screen that is bought.
