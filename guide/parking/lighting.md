# Parking: lighting

Status: design intent of 2026-10-31. Every light is solar (D-065): no cable runs from the farm's board, so the way in adds no load to its circuits; nothing is sized or sourced yet [A].

Everything the electrician needs to light the way in after dark: the solar bollards, the solar lanterns, the sign's own panel and battery, and every point.

Kinyarwanda: [soma iyi paji mu Kinyarwanda](lighting.rw.md) · The lighting drawn: [the parking page](/en/parking#lighting) · When it happens: [the execution plan](plan.md)

## At a glance

| What | Design |
|---|---|
| The bollards | 4, about 0.8 m high, each with its panel, battery and dusk sensor, on a small footing past the parking's far edge, clear of the trees' crowns |
| The lanterns | the two pillar lanterns, solar, each with its panel on the top: L1 on the outer gate, L2 on the inner gate |
| The sign | a 100 W panel on the wall's cap charges a battery in a weatherproof box on the wall's back; its charge controller and timer feed the 24 V driver for the LED letters |
| Cables | none in the ground: only the sign's short runs, down and through its wall |

## Hold points

1. **The panels in the sun.** Each panel sees the open sky through the middle of the day, clear of the trees' crowns.
2. **Tried at dusk.** Every light comes on by itself at dusk before the way in is used at night.

## Steps

1. **Footings:** a small concrete footing for each bollard, 0.35 m past the far edge.
2. **Bollards and lanterns:** fix the bollards on their footings and the lanterns on the pillars' caps.
3. **The sign's kit:** fix the panel on the cap and the box on the wall's back; run the panel's lead down the wall to the box and the letters' link through the wall; connect the battery, the controller and the driver.
4. **Trial:** let them charge for a day, then watch every light come on at dusk; set the sign's timer.

## Points

[Lighting points](../../src/components/parking/docs-sections.tsx#ParkingLightingPoints)

## Open questions

1. The letters burn all night or go off at the timer? The sign's controller has a timer for either.
2. Bays 1 and 2 stand under a shade tree's crown, where a solar bollard would not charge: is the light from B1 enough there?
