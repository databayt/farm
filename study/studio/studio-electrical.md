# Studio electrical

Status: design intent. Every rating is an assumption [A, AS-19] until a RURA-licensed electrician (class A covers homes [V STU-15]) designs, installs and certifies the installation to RS 565-1:2011, the wiring standard RURA's regulations require [V STU-14]. Kigali has enforced certified installers since 2020 [V STU-52].

## Supply

- REG grid at 230 V, 50 Hz [V STU-18]. A new low-voltage connection within 37 m of the network was listed at 56,000 Frw [V STU-P05, undated].
- A site board at the REG meter feeds the three studios through buried armoured cable; one studio per phase if REG can give a three-phase supply.
- REG installs and owns the meters [V STU-16], and re-selling power may need a licence, so the per-unit meters are **check meters for monitoring only**; electricity is included in the room rate.
- Ask REG whether the supply covers three studios plus the borehole and booster pumps (about 3 x 33 A diversified plus pumps) [E].

![E-201 Single-line diagram](../../public/designs/studio/drawings/e-201.svg)

## Unit board and circuits

Main switch 40 A double-pole, a type 2 surge protection device, and a 30 mA type A RCD covering every circuit (or one RCBO per circuit). The induction hob and the water heater share a priority relay: the heater pauses while the hob runs, which keeps the diversified demand near 33 A [E].

[Table: Circuits (design current, derated capacity, run length, voltage drop)](../../public/designs/studio/data/circuits.csv)

[Table: Diversified maximum demand per studio](../../public/designs/studio/data/demand.csv)

The generator checks every circuit for design current within the breaker within the derated cable capacity, and a voltage drop under 3% for lighting and 5% for the rest, including the 10 mm2 feeder from the site board (30 m assumed) [E]. Cable data are typical IEC values for PVC copper in conduit, derated for a warm steel box; confirm them against the cable actually bought (Legend Cables makes cable in Kigali [V STU-34]).

![E-202 Circuit schedule, earthing and bonding](../../public/designs/studio/drawings/e-202.svg)

## Points

![E-101 Electrical layout plan](../../public/designs/studio/drawings/e-101.svg)

[Table: Points, circuits and mounting heights](../../public/designs/studio/data/points.csv)

## Earthing, bonding and lightning

- TT earthing with one earth rod per container. Bond the container body, the front deck, the stair and the roof steelwork to the unit's main earthing terminal. A steel box with a chafed live cable is lethal; bonding is not optional. UK guidance for steel units says to avoid a combined neutral-earth (PME) supply unless under skilled supervision [V STU-37].
- Rwanda has a high lightning risk; the study's electrical page already calls for surge protection and one equipotential system (`electrical-system.md`). Each unit board has a type 2 SPD; the site board a type 1+2.
- Bathroom: lights IP65, no sockets, the fan switched from outside, every circuit on the 30 mA RCD; zone 1 covers the tray area up to 2.25 m [V STU-38].

## Tests before power-on

Continuity of protective conductors, insulation resistance, polarity, earth-electrode resistance (record it), RCD trip times, SPD status, then the electrician's certificate. Smoke and heat alarms are tested at handover (see [permits, safety and handover](studio-permits.md)).
