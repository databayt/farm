# Studio: plumbing

Status: revision {{studio.rev}}, {{studio.rev_date}}, {{studio.status}}. No guest stays before the septic system passes its inspection (D-016).

Everything the plumber needs for one container studio: supply, hot water, drains, the tests, and what the studio needs from the farm.

The two studios are piped the same, so one page serves both.

Kinyarwanda: [soma aya mabwiriza mu Kinyarwanda](plumbing.rw.md) · Print: [this page as a PDF](../../public/guides/studio-plumbing.pdf) · The pipes drawn: [the studio page](/en/studio#plumbing) · When it happens: [the execution plan](plan.md)

## At a glance

- **End A**: the closed end wall, by the bed. **End B**: the cargo-door end, by the bathroom.
- **Back wall**: the long wall with no openings. **Front wall**: the long wall with the sliding glass door.
- Positions in the fittings table are millimetres from the finished end-A wall (x), from the finished back wall (y) and up from the finished floor (z).

| What | Design |
|---|---|
| Supply pipe | PPR PN20, 25 mm for the main, 20 mm inside |
| Main in | under the floor at end B, up into the sink base: stop valve, Y-filter, check meter (SV) |
| Hot water | an instant heater, {{studio.heater_kw}} kW, IPX4, on end wall B inside the shower, beside the hand shower; no tank. It heats about 4 L/min to 40 °C, set on its own display, for the shower only. The sink and the basin are cold (D-053) |
| Drains | WC 110 mm, shower 50 mm, kitchen sink 50 mm on its own line to a grease trap; all at 1:40 or steeper |
| Vent | 75 mm open vent up end B, ending 900 mm above the roof guardrail |
| Shower tray | {{studio.tray_l}} × {{studio.tray_w}} |
| Pressure | 2.5 to 3 bar from the farm's booster pump |

| When | What | Step |
|---|---|---|
| After the battens (S03) | First fix: main in, every supply and drain run, the 10 bar test | S04 |
| With the bathroom | Tray (S09), WC and heater (S10) | S09, S10 |
| With the kitchen | Sink, tap and filter | S13 |

### From the farm

- One cold supply at 2.5 to 3 bar from the farm's storage tank and booster pump. Mains water enters that tank through an air gap, so private water never flows back into the main (D-016).
- A soil connection from the inspection chamber outside end B to the farm's septic tank, and the kitchen line to a grease trap with its own soak pit.
- The septic tank sits at least 50 m from the borehole, 3 to 7 m from buildings and the boundary, downhill of the borehole, within 30 m of tanker access, and only after a percolation test.

[Table: Site water and septic sizing for the two studios](../../public/designs/studio/data/site-water.csv)

## Hold points

1. **Battens first.** Start the first fix only when the battens (S03) are fixed and the floor sheets are down.
2. **The 10 bar test.** Fill the PPR, hold 10 bar for one hour with no drop, write it down and sign it before the spray foam (S05). The foam buries the pipes.
3. **Before guests.** The drains are fill-tested, the vent smoke-tested, the shower measured with a thermometer, and the farm's septic system inspected.

## Steps

### S04: first fix

1. Bring the cold main (W1, 25 mm) in under the floor at end B and up into the sink base through the stop valve, Y-filter and check meter, where it can be shut off without tools.
2. Run the cold inside the units and the walls: through the partition, the back wall's lining and end wall B to the WC cistern (W4) and up to the heater's foot in the shower (W2). Keep cold 300 mm above the floor.
3. No hot pipes: the only hot water is the hand shower's hose from the top of the heater (H1).
4. Every run goes straight: along the wall, then straight up to its outlet. No diagonal legs.
5. Hang the drains in the void under the floor (the container stands about 700 mm up): WC 110 mm and shower 50 mm to the inspection chamber; the kitchen sink 50 mm on its own line to the grease trap. Pass between the 122 mm cross-members, never through them.
6. Fall at 1:40 or steeper; rodding eyes at every bend; the 75 mm vent up end B.
7. Pressure-test at 10 bar for one hour, photograph every wall, sign the release for the foam.

### S09, S10 and S13: second fix

1. S09: set the shower tray ({{studio.tray_l}} × {{studio.tray_w}}) on its 90 mm waste, wall to wall between the partition and end wall B, with the fixed glass screen on the end-wall side.
2. S10: hang the wall-hung WC on its slim concealed cistern (80 mm frame in end wall B, 30 mm build-out, dual-flush plate).
3. S10: hang the {{studio.heater_kw}} kW instant heater (200 × 330 × 90) on end wall B inside the shower, between the slide rail and the glass, its display about 1.3 m up; connect the cold at its foot and the hand shower's hose at its top. It has no tank, so it needs no relief valve.
4. S10: fit the slide rail and the hand shower on end wall B. There is no basin: hands are washed at the galley sink.
5. S13: the kitchen tap (cold) on its angle valve, and the drinking-water filter in the sink base with its own faucet by the tap.

### Tests

1. PPR at 10 bar for one hour, before the foam (S04).
2. Fill-test every drain and check every trap holds its seal.
3. Smoke-test the vent.
4. Run the shower at full flow and measure it with a thermometer: about 40 °C. If it is hotter, turn the heater's display down.
5. Run a long shower: the water stays hot, since the heater has no tank to empty.

## Runs

[Pipe runs: system, size, length and fall](../../src/components/studio/docs-sections.tsx#StudioPipes)

## Points

[Fittings: what, where and how high](../../src/components/studio/docs-sections.tsx#StudioFittings)

## Open questions

1. Where does the farm's septic tank go, and has its percolation test passed? The studios' drains and their first guests wait on both ([the farm's water](../farm/water.md)).

## Drawings

![P-101 Plumbing layout plan](../../public/designs/studio/drawings/p-101.svg)

![P-201 Pipework isometric](../../public/designs/studio/drawings/p-201.svg)

![P-301 Site water and sanitation schematic](../../public/designs/studio/drawings/p-301.svg)
