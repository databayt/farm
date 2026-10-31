# Parking: lighting

Status: design intent of 2026-10-31. Nothing is sourced; the circuit's protection is at the compound's board, for a RURA class A electrician to design and certify [A].

Everything the electrician needs to light the way in after dark: the feed, the box on the sign wall, the letters and the lanterns, and every point.

Kinyarwanda: [soma iyi paji mu Kinyarwanda](lighting.rw.md) · The lighting drawn: [the parking page](/en/parking#lighting) · When it happens: [the execution plan](plan.md) · The farm's supply: [the farm's electric](../farm/electric.md)

## At a glance

| What | Design |
|---|---|
| The circuit | the farm's outdoor-lights circuit, one of the loads that must never stop; its RCD and breaker at the compound's board |
| The feed | a cable from the compound's board down the rock road in a buried duct, past the inner gate's lantern, to the box on the sign wall |
| The box | weatherproof, on the back of the sign wall: an isolator, a dusk-to-dawn photocell with a timer, the 24 V driver for the sign's letters |
| From the box | the sign panel, and a cable along the back of the hedge to the lantern on the outer gate's left pillar |
| Ducts | 50 mm, about 450 mm down under a warning tape, rising inside the pillars and the wall |

## Hold points

1. **The duct before the pavers.** The duct and its draw wire are in before the sub-base goes over the route.
2. **Before power-on.** The tests pass and the circuit is certified before it is fed.

## Steps

1. **Ducts:** dig the trench along the route, lay the 50 mm duct with its draw wire, the warning tape over it; bring it up inside the pillars and the wall.
2. **Cable:** pull the outdoor armoured cable through the ducts.
3. **Box and lights:** fix the box on the sign wall with its isolator, photocell and driver; connect the letters and both lanterns.
4. **Tests:** insulation and continuity; the photocell and the timer tried at dusk; the certificate.

## Points

[Lighting points](../../src/components/parking/docs-sections.tsx#ParkingLightingPoints)

## Open questions

1. The lanterns burn all night or go off at the timer? The photocell has a timer for either.
