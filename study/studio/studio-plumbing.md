# Studio plumbing and sanitation

Status: design intent; septic siting and soakage depend on the site plan and a percolation test (D-016: no guests until the system passes inspection).

## Water supply

![P-301 Site water and sanitation schematic](../../public/designs/studio/drawings/p-301.svg)

- WASAC water, the borehole and canopy rainwater all fill one storage tank. WASAC enters through an **air gap** (float valve above the overflow), so private water can never back-feed the main (D-016).
- Demand: 6 guests x 150 L/day = 900 L/day [A, AS-17]; the tank holds about 4 days (4 m3) because mains supply can be intermittent [E].
- A booster pump with a pressure vessel gives 2.5-3 bar to the three studios through buried HDPE; each studio has a stop valve, a filter and a check meter.
- Drinking water: an under-sink filter with its own faucet in every kitchen.

[Table: Site water and septic sizing](../../public/designs/studio/data/site-water.csv)

## Inside each studio

- Supply in PPR PN20, 20 and 25 mm (Pro Water makes PP-R in Kigali [V STU-23]).
- An 80 L electric storage heater in the kitchen's tall unit, out of the bathroom zones, with a temperature-and-pressure relief valve piped outside. Water is stored at 60 C; a thermostatic mixing valve sends 41-44 C to the shower and basin (guest scald safety); the kitchen sink gets direct hot water, labelled. Two back-to-back showers at 6-7 L/min need about 48-64 L of hot water, which is why the heater is 80 L, not 50 L (D-015) [E, AS-18].

![P-101 Plumbing layout plan](../../public/designs/studio/drawings/p-101.svg)

![P-201 Pipework isometric](../../public/designs/studio/drawings/p-201.svg)

## Drainage

The containers stand about 700 mm above the ground, so every trap and branch hangs in the void under the floor, with no step in the bathroom. Pipes pass through the plywood between the 122 mm cross-members, never through them [V STU-02].

| Fixture | Pipe | Trap seal | Fall |
|---|---|---|---|
| WC | 110 mm uPVC | 50 mm | at least 1:40 here (UK minimum about 1:55) |
| Shower tray | 50 mm | 50 mm | 1:40 |
| Basin | 40 mm | 75 mm | 1:40 |
| Kitchen sink | 50 mm, separate line | 75 mm | 1:40 |

Sizes and seals follow UK Approved Document H as a reference [V STU-09]. A 75 mm open vent rises up end B to 900 mm above the roof guardrail line (or an air admittance valve inside, with one open vent for the site). Rodding eyes at every bend.

[Table: Pipe runs, sizes and falls](../../public/designs/studio/data/pipes.csv)

## Septic system (new, shared)

- WC, shower and basin from all three studios drain to inspection chambers, then a two-chamber septic tank (2:1), then a soak pit or drain field.
- Size: the largest of the 2019 draft standard (3 m3 for up to 6 people plus 1 m3 per 2 more [V STU-10]), the 2012 rule (24 h or 2,000 L plus sludge at 0.04 m3/person/year for 3 years [V STU-11]) and a UK-style 180P + 2,000 L allowance, for 8 people [A, AS-16]: **4 m3**, chambers about 2.7 and 1.3 m3. Prefab septic tanks are sold in Kigali (Pro Water, Build Mart [V STU-23, STU-24]).
- **Kitchen sinks drain separately** to a grease trap and their own soak pit, as the 2012 rules require [V STU-11].
- Siting: at least 50 m from the borehole and the lake, at least 3-7 m from buildings and the boundary, downhill from the borehole, within 30 m of tanker access (see [site](studio-site.md)).
- Soak pits only where groundwater is more than 2.5 m down and percolation is 25-125 mm/h [V STU-10]. The Water Resources Board has called for soak pits to be phased out (2026, scope unclear) [V STU-57]: ask the district before building one; the fallback is a sealed tank emptied on a schedule.
- Desludge at least every 3 years [V STU-11].

## Tests

Pressure-test the PPR at 10 bar for an hour before the lining closes; fill-test every drain; smoke-test the vent; check the TMV setting with a thermometer at the shower.
