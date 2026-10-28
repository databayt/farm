# Studio plumbing and sanitation

Status: design intent; septic siting and soakage depend on the site plan and a percolation test (D-016: no guests until the system passes inspection).

## Water supply

![P-301 Site water and sanitation schematic](../../public/designs/studio/drawings/p-301.svg)

- WASAC water, the borehole and canopy rainwater all fill one storage tank. WASAC enters through an **air gap** (float valve above the overflow), so private water can never back-feed the main (D-016).
- Demand: {{studio.persons}} guests x 150 L/day = {{studio.daily_l}} L/day [A, AS-17]; the tank holds about 4 days ({{studio.tank_m3}} m3) because mains supply can be intermittent [E].
- A booster pump with a pressure vessel gives 2.5-3 bar to the two studios through buried HDPE; each studio has a stop valve, a filter and a check meter.
- Drinking water: an under-sink filter with its own faucet in every kitchen.

[Table: Site water and septic sizing](../../public/designs/studio/data/site-water.csv)

## Inside each studio

- Supply in PPR PN20, 20 and 25 mm (Pro Water makes PP-R in Kigali [V STU-23]).
- A 30 L electric storage heater, a box about 450 x 450 x 300 mm (2 kW, IPX4), on end wall B above the WC, with a temperature-and-pressure relief valve piped outside (D-024, replacing D-015's 80 L heater in the galley's overhead cabinet). Water is stored at 60 C; a thermostatic mixing valve sends 41-44 C to the shower and basin (guest scald safety); the kitchen sink gets direct hot water, labelled. 30 L gives one shower at a time at 6-7 L/min, then about 40 minutes to heat up again; D-015 sized 80 L for two back-to-back showers (48-64 L) [E, AS-18].
- Routes (D-023), every run drawn leg by leg in `scripts/studio/services.py`:
  - The main comes in under the floor at end B and rises into the sink base through the stop valve, Y-filter and check meter (SV), where it can be shut off without tools.
  - From there, the cold runs inside the units and the walls: through the partition, the back wall's lining and end wall B to the WC cistern, the basin and up to the heater. The hot comes down from the heater to the mixing valve and back along the same walls to the sink. Cold runs 300 mm above the floor, hot 360 mm, then each goes straight up to its outlet.
  - The mixing valve (TMV) sits in end wall B behind a tiled access panel between the shower and the WC. Both mixed-water runs are 1.2 m, under the 2 m the model allows for a mixed-water dead leg.
- `fittings.csv` lists the 11 plumbing points; /en/studio draws every run in 3D with the sink base cut open and the bathroom's wet walls stripped to the foam, dashed where a wall or the floor still hides it (`scripts/studio/render/room.html?view=plumbing`).

![P-101 Plumbing layout plan](../../public/designs/studio/drawings/p-101.svg)

![P-201 Pipework isometric](../../public/designs/studio/drawings/p-201.svg)

## Drainage

The containers stand about 700 mm above the ground, so the shower's trap and every branch hang in the void under the floor, with no step in the bathroom; the sink and the basin have bottle traps under their bowls. Pipes pass through the plywood between the 122 mm cross-members, never through them [V STU-02].

| Fixture | Pipe | Trap seal | Fall |
|---|---|---|---|
| WC | 110 mm uPVC | 50 mm | at least 1:40 here (UK minimum about 1:55) |
| Shower tray | 50 mm | 50 mm | 1:40 |
| Basin | 40 mm | 75 mm | 1:40 |
| Kitchen sink | 50 mm, separate line | 75 mm | 1:40 |

Sizes and seals follow UK Approved Document H as a reference [V STU-09]. A 75 mm open vent rises up end B to 900 mm above the roof guardrail line (or an air admittance valve inside, with one open vent for the site). Rodding eyes at every bend.

[Table: Pipe runs, sizes and falls](../../public/designs/studio/data/pipes.csv)

## Septic system (new, shared)

- WC, shower and basin from both studios drain to inspection chambers, then a two-chamber septic tank (2:1), then a soak pit or drain field.
- Size: the largest of the 2019 draft standard (3 m3 for up to 6 people plus 1 m3 per 2 more [V STU-10]), the 2012 rule (24 h or 2,000 L plus sludge at 0.04 m3/person/year for 3 years [V STU-11]) and a UK-style 180P + 2,000 L allowance, for {{studio.septic_pop}} people [A, AS-16]: **{{studio.septic_m3}} m3**, chambers about {{studio.septic_c1_m3}} and {{studio.septic_c2_m3}} m3. Prefab septic tanks are sold in Kigali (Pro Water, Build Mart [V STU-23, STU-24]).
- **Kitchen sinks drain separately** to a grease trap and their own soak pit, as the 2012 rules require [V STU-11].
- Siting: at least 50 m from the borehole and the lake, at least 3-7 m from buildings and the boundary, downhill from the borehole, within 30 m of tanker access (see [site](studio-site.md)).
- Soak pits only where groundwater is more than 2.5 m down and percolation is 25-125 mm/h [V STU-10]. The Water Resources Board has called for soak pits to be phased out (2026, scope unclear) [V STU-57]: ask the district before building one; the fallback is a sealed tank emptied on a schedule.
- Desludge at least every 3 years [V STU-11].

## Tests

Pressure-test the PPR at 10 bar for an hour at the first fix (S04), before the spray foam; fill-test every drain; smoke-test the vent; check the TMV setting with a thermometer at the shower.
