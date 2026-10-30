import { FOOTING_COLOUR } from "@/components/volleyball/net-diagram"
import volleyball from "@/components/volleyball/volleyball.json"

// The court's net points (volleyball.json `net`, `posts`), read by /en/volleyball (the tags) and by its docs page
// (/docs/volleyball-points, the points table) alike, as src/components/studio/data.ts is the studio's.

export const D = "/designs/volleyball"
const { net: N, posts: P } = volleyball
// metres as millimetres, grouped: 1.2 becomes "1,200"
export const m = (n: number) => Math.round(n * 1000).toLocaleString("en-US")

// the net's points, for the tags on the drawing and the table on the docs page; a footing's dot is the drawing's orange
export const NET_POINTS: { id: string; what: string; where: string; size: string; colour?: string }[] = [
  { id: "S1", what: "Footing and sleeve, near post", where: `${m(P.out)} mm outside the near side line, on the centre line`, size: `${m(P.footing.w)} mm square, ${m(P.footing.depth)} mm deep`, colour: FOOTING_COLOUR },
  { id: "S2", what: "Footing and sleeve, far post", where: "The same outside the far side line", size: `${m(P.footing.w)} mm square, ${m(P.footing.depth)} mm deep`, colour: FOOTING_COLOUR },
  { id: "P1", what: "Near post", where: "In S1, toward the open lawn", size: `${m(P.h)} mm, padded to ${m(P.pad.h)} mm` },
  { id: "P2", what: "Far post", where: "In S2, toward the benches", size: `${m(P.h)} mm, padded to ${m(P.pad.h)} mm` },
  { id: "W", what: "Winch", where: "On P1's outer face", size: `At ${m(P.winch)} mm; tensions the top cable` },
  { id: "N", what: "Net", where: "Over the centre line", size: `${m(N.l)} × ${m(N.d)} mm, top at ${m(N.men)} mm (men) or ${m(N.women)} mm (women)` },
  { id: "A1", what: "Antenna, near side line", where: "At the side band's outer edge", size: `${m(N.antenna.l)} mm, ${m(N.antenna.above)} mm above the net` },
  { id: "A2", what: "Antenna, far side line", where: "On the net's other face", size: `${m(N.antenna.l)} mm, ${m(N.antenna.above)} mm above the net` },
]
