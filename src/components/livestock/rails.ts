import { frw } from "@/lib/format"
import { railCards } from "@/components/page/sections"
import { type RailItem } from "@/components/docs/item-rail"
import { D, tank, yardM } from "@/components/livestock/data"
import livestock from "@/components/livestock/livestock.json"
import { words } from "@/components/livestock/words"
import type { Locale } from "@/components/internationalization/config"
import type { Rail } from "@/components/docs/rail-table"

// The livestock yard's rails, moved off its page so that the page (/[lang]/livestock) and its Materials page in the
// docs (D-059) read one list, in the reader's language (words.tsx).
const ITEM = `${D}/render/item`
const { animals: AN, pens: PN, tank: TK, fittings: FT, compost: CO, dogs: DG, friends: FR } = livestock

// The Animals and Yard rails, in the studio's Bed rail's pattern: each rendered on its own from the 3D's own meshes
// (scripts/site/render/livestock.html?item=<id>), its numbers from livestock.json. Prices only where a source gives one.
// An animal's card tells its head count and where it comes from, not its size.
export function animalRail(lang: Locale): RailItem[] {
  const t = words[lang].rails
  const animal = (id: string, title: string, head: string, from: string, cost: string, alt: string, note: string): RailItem => ({
    src: `${ITEM}/${id}.webp`, alt, title, note,
    details: [{ label: t.head, value: head }, { label: t.whereFrom, value: from }, { label: t.cost, value: cost }],
  })
  return [
    animal("goat", t.goat.title, t.goat.head(AN.goats.length), t.goat.from, t.goat.cost, t.goat.alt, t.goat.note),
    animal("sheep", t.sheep.title, t.sheep.head(AN.sheep.length), t.sheep.from, t.sheep.cost, t.sheep.alt, t.sheep.note),
    animal("dog", t.dog.title, t.dog.head(AN.dogs.length), t.notSourced, t.notBudgeted, t.dog.alt, t.dog.note),
    animal("cat", t.cat.title, t.cat.head(FR.cats.head), t.notSourced, t.notBudgeted, t.cat.alt, t.cat.note),
    animal("doves", t.doves.title, t.doves.head, t.notSourced, t.notBudgeted, t.doves.alt, t.doves.note(FR.dovecote.s, FR.dovecote.h)),
  ]
}
const m = (a: number, b: number) => `${frw(Math.round(Math.abs(b - a) * 100) / 100)}`
export function yardRail(lang: Locale): RailItem[] {
  const w = words[lang].rails
  const t = PN.table, n = PN.bin, b = PN.bale, k = DG.kennels[0], h = FR.cats.house, x = PN.minerals[0]
  return railCards(ITEM, [
    { id: "table", title: w.table.title, size: w.table.size(m(t.x0, t.x1), m(t.y0, t.y1), t.h, m(n.x0, n.x1), m(n.y0, n.y1)),
      alt: w.table.alt, note: w.table.note, where: w.boards },
    { id: "minerals", title: w.minerals.title, size: w.minerals.size(m(x.x0, x.x1), m(x.y0, x.y1), PN.minerals[0].z, PN.minerals[1].z),
      alt: w.minerals.alt, note: w.minerals.note, where: w.minerals.where, cost: w.minerals.cost },
    { id: "bale", title: w.bale.title, size: `${m(b.x0, b.x1)} × ${m(b.y0, b.y1)} × 0.45 m`, alt: w.bale.alt, note: w.bale.note, where: w.bale.where },
    { id: "kennel", title: w.kennel.title(DG.kennels.length), size: w.kennel.size(m(k.x0, k.x1), m(k.y0, k.y1)),
      alt: w.kennel.alt, note: w.kennel.note(m(DG.x0, DG.x1), m(DG.y0, DG.y1)), where: w.boards },
    { id: "cathouse", title: w.cathouse.title, size: w.cathouse.size(h.s, h.h), alt: w.cathouse.alt, note: w.cathouse.note, where: w.boards },
  ], lang)
}

// The Water rail, in the studio's Plumbing rail's pattern: each part on its own (livestock.html?item=<id>); nothing is
// sourced or priced yet
export function waterRail(lang: Locale): RailItem[] {
  const w = words[lang].rails
  const tr = FT.troughs[0]
  return railCards(ITEM, [
    { id: "tank", title: w.tank.title, size: w.tank.size(frw(tank), TK.r * 2, TK.h, TK.stand), alt: w.tank.alt, note: w.tank.note },
    { id: "float", title: w.float.title, size: w.float.size, alt: w.float.alt, note: w.float.note },
    { id: "pipe", title: w.pipe.title, size: w.pipe.size(yardM), alt: w.pipe.alt, note: w.pipe.note },
    { id: "valve", title: w.valve.title, size: w.valve.size, alt: w.valve.alt, note: w.valve.note },
    { id: "tap", title: w.tap.title, size: w.tap.size, alt: w.tap.alt, note: w.tap.note },
    { id: "trough", title: w.trough.title(FT.troughs.length), size: w.trough.size(m(tr.x0, tr.x1), FT.trough.d, FT.trough.h), alt: w.trough.alt, note: w.trough.note },
    { id: "buckets", title: w.buckets.title(TK.buckets.length), size: w.buckets.size, alt: w.buckets.alt, note: w.buckets.note },
    { id: "bowl", title: w.bowl.title, size: w.bowl.size(DG.bowl.r * 2), alt: w.bowl.alt, note: w.bowl.note },
  ], lang)
}

export function manureRail(lang: Locale): RailItem[] {
  const w = words[lang].rails
  return railCards(ITEM, [
    { id: "compost", title: w.compost.title(CO.n), size: w.compost.size(CO.bay), alt: w.compost.alt, note: w.compost.note, where: w.compost.where },
    { id: "basket", title: w.basket.title, size: w.basket.size, alt: w.basket.alt, note: w.basket.note, where: w.basket.where },
  ], lang)
}

// every rail, as the Materials page lists them
export function rails(lang: Locale): Rail[] {
  const t = words[lang].sections
  return [
    { title: t.animals, items: animalRail(lang) },
    { title: t.yard, items: yardRail(lang) },
    { title: t.water, items: waterRail(lang) },
    { title: t.manure, items: manureRail(lang) },
  ]
}
