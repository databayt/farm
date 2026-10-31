# Volleyball: execution plan

Status: design intent of 2026-10-31. The court, its lines, the net and the posts follow the FIVB Official Volleyball Rules; everything past them is an assumption in volleyball.json [A], until a groundsman sees the lawn.

Every step of making a full-size court on the lawn, where guests already play round a net, in the order its page builds it.

Kinyarwanda: [soma iyi gahunda mu Kinyarwanda](plan.rw.md) · The court drawn: [the volleyball page](/en/volleyball) · Its other pages: [materials](materials.md), [net and drainage](net.md) · Where it sits: [the master plan](../farm/master-plan.md)

## At a glance

[The court on the lawn from above: 18 × 9 m inside its 3 m free zone, the net across its middle, the benches and the ball store beyond](../../src/components/volleyball/volleyball-plan.tsx#VolleyballPlan)

| What | Design |
|---|---|
| The court | 18 × 9 m inside a free zone 3 m wide on every side, 24 × 15 m in all (FIVB rules 1.1 to 1.4) |
| Overhead | clear of anything to 7 m over the whole playing area; every tree kept 4 m off it |
| The surface | the lawn's own grass, mown short, levelled to one plane falling no more than 5 mm a metre (rules 1.2.1 and 1.2.3) |
| The net | 2.43 m for men, 2.24 m for women, on two padded steel posts 1.0 m outside the side lines, no guy wires (rules 2.1 to 2.5) |
| Beside it | two benches under thatched umbrellas beyond the far free zone, and a lockable ball store |

## Before you start

1. Peg out the 24 × 15 m on the lawn and check that nothing reaches over it below 7 m.
2. Read on site which way the lawn falls: the court falls the same way, at most 5 mm a metre.
3. Have a builder see the soil before the footings' size is fixed.

## Steps

1. **Groundsman:** level the playing area: cut the bumps and fill the hollows with about 20 mm of sandy topsoil, rolled to one plane.
2. **Builder:** cast the two footings with their sleeves, the tops flush with the grass ([net and drainage](net.md)).
3. **Groundsman:** seed the bare patches and mow the whole short in passes, the lawn round it left longer; let it settle a few weeks before play.
4. **Groundsman:** pin the 5 cm white tape for the lines every metre, and at every corner and crossing: the side and end lines, the centre line and an attack line 3 m each side.
5. **Builder:** drop the posts into their sleeves, hang the net and fit an antenna over each side line.
6. **Carpenter:** the two benches, their thatched umbrellas and the ball store ([materials](materials.md)).

## Hold points

1. **The plane first.** No footing is cast before the playing area is levelled and its fall read.
2. **No play on wet grass.** It is slippery: the court closes after rain.
3. **Play stops at sunset.** There are no floodlights at first.

## Done when

1. The court is level, grassed and lined to the rules, and the net stands at the right height over the centre line.
2. The rain runs off across the grass after the first heavy shower, with no water lying on the court.
3. The benches, the umbrellas and the ball store are in, with the balls, a pump and a gauge.

## Open questions

1. Floodlights later: at least 300 lux on the court (rule 1.6), on poles outside the free zone, sized in [the farm's electric](../farm/electric.md).
2. A tennis court on the same net line: the page's 2D switches to one; does the lawn have room for it, and can its grass be kept firm enough?
