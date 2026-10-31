# Studio: electric

Status: revision {{studio.rev}}, {{studio.rev_date}}, {{studio.status}}. Every rating is design intent until a RURA-licensed electrician (class A) designs, installs and certifies the installation to RS 565-1:2011.

Everything the electrician needs to wire one container studio: the first fix before the walls close, the second fix, the tests and the certificate.

The two studios are wired the same, so one page serves both.

Kinyarwanda: [soma aya mabwiriza mu Kinyarwanda](electric.rw.md) · Print: [this page as a PDF](../../public/guides/studio-electric.pdf) · The circuits drawn: [the studio page](/en/studio#electrical) · When it happens: [the execution plan](plan.md)

## At a glance

- **End A**: the closed end wall, by the bed. **End B**: the cargo-door end, by the bathroom.
- **Back wall**: the long wall with no openings. **Front wall**: the long wall with the sliding glass door.
- Positions in the points table are millimetres from the finished end-A wall (x), from the finished back wall (y) and up from the finished floor (z).

| What | Design |
|---|---|
| Supply | one inlet 63 A, IP67, IEC 60309 blue (2P+E), outside the back wall straight behind the board; any 230 V source |
| Main | 63 A double-pole breaker (C curve) and a DIN kWh check meter; tails 16 mm² through a gland |
| Board | 24 modules in two rows of 12: main, check meter, type 2 SPD, priority relay and its contactor, one RCBO (30 mA, type A) per circuit |
| Circuits | 8, C1 to C8 (table below) |
| Maximum demand | 45.3 A diversified: lights 0.3 + fans 0.3 + sockets 16.4 + the larger of the hob 11.6 or the instant shower heater 23.9 with the AC 4.3 (D-053) |
| Earthing | TT: one earth rod per container; never a combined neutral-earth (PME) supply |
| Cable route | 20 mm conduit in the batten cavities, buried in spray foam after the first fix |

| When | What | Step |
|---|---|---|
| After the battens (S03) | First fix: earth rod, conduits, boxes, cables | S04 |
| After the lining and the kitchen | Second fix: board, devices, tests, certificate | S19 |

The kWh meter in each studio is a check meter for monitoring only: electricity is in the room rate.

## Hold points

1. **Battens first.** Start the first fix only when the battens (S03) are fixed and the floor sheets are down.
2. **Before the foam.** Every conduit, box and cable is in, insulation-tested, photographed wall by wall and signed before the spray foam (S05). The foam buries the conduits: nothing can be added later except by pulling through them.
3. **Before power-on.** The tests pass and the RURA certificate is signed before the inlet is ever fed.

## Steps

### S04: first fix

1. Set the board box on the back wall at the galley, and the inlet outside straight behind it: positions DB and PI in the points table.
2. Drive the earth rod (E1) outside end B and run its conductor to the board's earth bar; measure its resistance later, at the tests.
3. Run 20 mm conduit up from the board into the ceiling void, along it, then straight down to each box. No diagonal runs; fix every box to a batten.
4. Pull the cables per circuit: 1.5 mm² for C1 and C6, 2.5 mm² for C2, C3, C7 and C8, 4 mm² for C4, 6 mm² for C5 (the instant shower heater).
5. Take C6, the outdoor lights, out through one gland in the solid front strip at the bed end, then in UV-stable conduit outside.
6. Bathroom: an IP65 light and an IPX4 extract fan (zone 1, above the tray and below 2.25 m), no sockets, switched from outside the door.
7. Write each point's id on the steel beside its box, so the carpenter cuts the lining panels in the right places.
8. Test continuity and insulation resistance on every cable, photograph each wall, and only then sign the release for the foam.

### S19: second fix

1. Fit the board: the main breaker and check meter, the SPD, the priority relay and contactor, and the RCBOs (B6 for C1 and C6, B16 for C2, C3, C7 and C8, B20 for C4, B25 for C5).
2. Fit the devices: lights, fans, sockets, the hob outlet (P9, isolated at its RCBO on the board, in sight), the smoke and heat alarms (AL1, AL2).
3. Bond the container body, the front deck, the stair and the roof steelwork to the main earthing terminal.
4. Check the priority relay: with the hob on, the shower heater (C5) and the AC (C7) must drop out. The contactor is 40 A: it carries the heater's 23.9 A.

### Tests before power-on

1. Continuity of every protective conductor.
2. Insulation resistance of every circuit.
3. Polarity at every socket and light.
4. Earth-electrode resistance of E1: write the value down.
5. The trip time of every RCBO.
6. The SPD status window, and the priority relay once more.
7. The RURA certificate, before the inlet is fed.

## Circuits

[Circuits: cable, breaker, run length and voltage drop](../../src/components/studio/docs-sections.tsx#StudioCircuits)

## Points

[Points: what, where and how high](../../src/components/studio/docs-sections.tsx#StudioElectricPoints)

## Open questions

1. Which source feeds the inlet: the site board, a generator or a solar inverter? Any 230 V, 50 Hz source can, if it protects its own cable at 63 A or less; the farm's [electric](../farm/electric.md) page decides.

## Drawings

![E-101 Electrical layout plan](../../public/designs/studio/drawings/e-101.svg)

![E-201 Single-line diagram: inlet and unit board](../../public/designs/studio/drawings/e-201.svg)

![E-202 Circuit schedule, earthing and bonding](../../public/designs/studio/drawings/e-202.svg)
