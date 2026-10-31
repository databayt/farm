import { railCards } from "@/components/page/sections"
import { D, m } from "@/components/volleyball/data"
import volleyball from "@/components/volleyball/volleyball.json"
import type { Rail } from "@/components/docs/rail-table"

// The volleyball's rails, moved off its page so that the page (/[lang]/volleyball) and its Materials page in the docs
// (D-059) read one list.
const { net: N, posts: P, benches: B, shade: SH, store: ST, surface: SF, build: BU, court: K } = volleyball

// The rails: each part rendered on its own by scripts/site/render/volleyball.html?item=<id>, from the model's own
// meshes or a cut-open sample. Nothing for the court is sourced or priced yet, so no card names a shop or a price.
// lines of tape: side and end lines, the centre line and the two attack lines, as the court draws them
const tapeM = 2 * K.l + 2 * K.w + 3 * K.w
export const kitRail = () => railCards(`${D}/render/item`, [
  { id: "ball", title: "Balls", size: "650 to 670 mm around, 260 to 280 g (rule 3.1)", note: "In a light colour or a mix of colours; kept in the ball store with a pump and a gauge." },
  { id: "tape", title: "Line tape", size: `${m(SF.tape)} mm white webbing, about ${tapeM} m, pinned every ${BU.pegs.every} m`, note: "Lines of solid materials are not allowed outdoors (rule 1.2.3): webbing tape pinned flat into the grass with steel U-pins, lifted to mow." },
  { id: "bench", title: `Benches × ${B.x.length}`, size: `${m(B.l)} × ${m(B.d)} mm, seat at ${m(B.h)} mm`, note: "Slatted timber on two trestles, 1 m back from the free zone, one each side of the centre line." },
  { id: "umbrella", title: `Thatched umbrellas × ${B.x.length}`, size: `${m(SH.r * 2)} across, eave at ${m(SH.eave)} mm, top ${m(SH.top)} mm`, note: "A timber pole behind each bench under a cone of thatch, like those on today's camping lawn." },
  { id: "store", title: "Ball store", size: `${m(ST.l)} × ${m(ST.d)} × ${m(ST.h)} mm`, note: "A lockable timber chest at the bench row's end toward the compound: the balls, a pump, the net and the pads between games. It seats two." },
])
export const netRail = () => railCards(`${D}/render/item`, [
  { id: "footing", title: "Footings and sleeves × 2", size: `${m(P.footing.w)} mm square, ${m(P.footing.depth)} mm deep, the sleeve cast in`, note: "S1, S2 · concrete, the top flush with the grass; a cap closes the sleeve when the post is out." },
  { id: "post", title: "Posts × 2", size: `${m(P.h)} mm high, ${m(P.d)} mm steel tube`, note: `P1, P2 · ${m(P.out)} mm outside the side lines, no guy wires (rule 2.5); padded to ${m(P.pad.h)} mm, the winch (W) on the near post at ${m(P.winch)} mm.` },
  { id: "net", title: "Net", size: `${m(N.l)} × ${m(N.d)} mm, ${m(N.mesh)} mm square mesh`, note: `N · black mesh with a ${m(N.top)} mm white band along its top over the cable, a ${m(N.foot)} mm band at its foot, and a white side band over each side line.` },
  { id: "antenna", title: "Antennae × 2", size: `${m(N.antenna.l)} mm long, ${m(N.antenna.d)} mm thick, the top ${m(N.antenna.above)} mm striped`, note: "A1, A2 · flexible rods at the side bands' outer edges, on opposite faces of the net, in 100 mm stripes of red and white (rule 2.4)." },
])

// every rail, as the Materials page lists them
export const rails: Rail[] = [
  { title: "Kit", items: kitRail() },
  { title: "Net and posts", items: netRail() },
]
