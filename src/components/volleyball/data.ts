import type { Locale } from "@/components/internationalization/config"
import { FOOTING_COLOUR } from "@/components/volleyball/net-diagram"
import volleyball from "@/components/volleyball/volleyball.json"
import { words, type NetValues, type PointValues } from "@/components/volleyball/words"

// The court's net points (volleyball.json `net`, `posts`), read by /[lang]/volleyball (the tags) and by its docs page
// (/docs/volleyball/net, the points table) alike, as src/components/studio/data.ts is the studio's. Their words are
// in words.tsx, in the reader's language.

export const D = "/designs/volleyball"
const { net: N, posts: P } = volleyball
// metres as millimetres, grouped: 1.2 becomes "1,200"
export const m = (n: number) => Math.round(n * 1000).toLocaleString("en-US")

// the net's and posts' sizes, formatted once for the points, the net rail and the net diagram
export const netValues: NetValues & PointValues = {
  men: m(N.men), women: m(N.women), fw: m(P.footing.w), fd: m(P.footing.depth), h: m(P.h), d: m(P.d), out: m(P.out),
  pad: m(P.pad.h), winch: m(P.winch), nl: m(N.l), nd: m(N.d), mesh: m(N.mesh), top: m(N.top), foot: m(N.foot),
  al: m(N.antenna.l), ad: m(N.antenna.d), above: m(N.antenna.above),
}

type NetPoint = { id: string; what: string; where: string; size: string; colour?: string }
const IDS = ["S1", "S2", "P1", "P2", "W", "N", "A1", "A2"]
// the net's points, for the tags on the drawing and the table on the docs page; a footing's dot is the drawing's orange
export function netPoints(lang: Locale): NetPoint[] {
  const rows = words[lang].points(netValues)
  return IDS.map((id) => ({ id, ...rows[id], colour: id.startsWith("S") ? FOOTING_COLOUR : undefined }))
}
// the English, for code that has no language
export const NET_POINTS: NetPoint[] = netPoints("en")
