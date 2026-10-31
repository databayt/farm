import { frw } from "@/lib/format"
import { NOT_BUDGETED, NOT_SOURCED, railCards } from "@/components/page/sections"
import { type RailItem } from "@/components/docs/item-rail"
import { D, tank, yardM } from "@/components/livestock/data"
import livestock from "@/components/livestock/livestock.json"
import type { Rail } from "@/components/docs/rail-table"

// The livestock yard's rails, moved off its page so that the page (/[lang]/livestock) and its Materials page in the
// docs (D-059) read one list.
const ITEM = `${D}/render/item`
const { animals: AN, pens: PN, tank: TK, fittings: FT, compost: CO, dogs: DG, friends: FR } = livestock

// The Animals and Yard rails, in the studio's Bed rail's pattern: each rendered on its own from the 3D's own meshes
// (scripts/site/render/livestock.html?item=<id>), its numbers from livestock.json. Prices only where a source gives one.
// An animal's card tells its head count and where it comes from, not its size.
export function animalRail(): RailItem[] {
  const animal = (id: string, title: string, head: string, from: string, cost: string, alt: string, note: string): RailItem => ({
    src: `${ITEM}/${id}.webp`, alt, title, note,
    details: [{ label: "Head", value: head }, { label: "Where from", value: from }, { label: "Cost", value: cost }],
  })
  return [
    animal("goat", "Goats", `${AN.goats.length} local goats`, "Several small farms with health records, then the vet’s quarantine",
      "About RWF 40,000 for a medium goat in Bugesera (2022, LVS-01)", "A brown local goat, standing.",
      "Browsers: hay stays in the racks, off the ground, against worms. Their mineral box hangs high, out of the sheep’s reach."),
    animal("sheep", "Sheep", `${AN.sheep.length} fat-tailed hair sheep`, "Not sourced yet: no breeder with stock found",
      "About RWF 100,000 for a 30–35 kg sheep at Mukamira (2024, LVS-56)", "A white fat-tailed sheep with a black face.",
      "Copper in the goats’ minerals is toxic to sheep (LVS-26), so theirs sits low and apart. Both carry the same worms (LVS-46)."),
    animal("dog", "Guard dogs", `${AN.dogs.length}, in their own run`, NOT_SOURCED, NOT_BUDGETED, "A tan guard dog.",
      "Against theft at night (LVS-01). Vaccinated against rabies and walked on the lead past the small animals."),
    animal("cat", "Cats", `${FR.cats.head}, neutered`, NOT_SOURCED, NOT_BUDGETED, "A grey cat.",
      "Farm friends for the guests. The hay and the feed stay covered: cat droppings can carry toxoplasmosis, which makes ewes and does abort (to check with the vet)."),
    animal("doves", "Doves", "Free-flying; the number is open", NOT_SOURCED, NOT_BUDGETED, "A dovecote on a tall pole, doves on its ledge.",
      `A dovecote ${FR.dovecote.s} m square on a ${FR.dovecote.h} m pole in the yard.`),
  ]
}
const m = (a: number, b: number) => `${frw(Math.round(Math.abs(b - a) * 100) / 100)}`
export function yardRail(): RailItem[] {
  const t = PN.table, n = PN.bin, b = PN.bale, k = DG.kennels[0], h = FR.cats.house, x = PN.minerals[0]
  return railCards(ITEM, [
    { id: "table", title: "Feed table and crate", size: `Table ${m(t.x0, t.x1)} × ${m(t.y0, t.y1)} m, top at ${t.h} m; crate ${m(n.x0, n.x1)} × ${m(n.y0, n.y1)} m, lidded`,
      alt: "A plank table with a basket of hay on it over a lidded crate.", note: "The hay in a basket off the floor, the feed in a crate that locks.",
      where: "Built on the farm from boards" },
    { id: "minerals", title: "Mineral boxes × 2", size: `${m(x.x0, x.x1)} × ${m(x.y0, x.y1)} m each; goats’ at ${PN.minerals[0].z} m, sheep’s at ${PN.minerals[1].z} m`,
      alt: "Two small mineral boxes on the shed’s back boards, one high and one low.", note: "Goat minerals high, sheep minerals low (LVS-26).",
      where: "Built on the farm; the minerals not sourced yet", cost: "Minerals RWF 2,500 a head a year (the model’s placeholder)" },
    { id: "bale", title: "Straw bale", size: `${m(b.x0, b.x1)} × ${m(b.y0, b.y1)} × 0.45 m`, alt: "A straw bale.",
      note: "Bedding and a seat for the herd; the litter goes to the compost.", where: "Not sourced yet: RAB stations sell some hay (LVS-50)" },
    { id: "kennel", title: `Kennels × ${DG.kennels.length}`, size: `${m(k.x0, k.x1)} × ${m(k.y0, k.y1)} m, raised on bearers, pitched roof`,
      alt: "A raised plank kennel with a pitched roof and a round door.", note: `In the dogs’ run, ${m(DG.x0, DG.x1)} × ${m(DG.y0, DG.y1)} m, fenced, in the back east corner.`,
      where: "Built on the farm from boards" },
    { id: "cathouse", title: "Cats’ house", size: `${h.s} × ${h.s} m on a ${h.h} m post`, alt: "A small plank house with a ledge on a post.",
      note: "Out of the dogs’ reach, by the fence.", where: "Built on the farm from boards" },
  ])
}

// The Water rail, in the studio's Plumbing rail's pattern: each part on its own (livestock.html?item=<id>); nothing is
// sourced or priced yet
export function waterRail(): RailItem[] {
  const tr = FT.troughs[0]
  return railCards(ITEM, [
    { id: "tank", title: "Tank", size: `${frw(tank)} L, Ø ${TK.r * 2} m, ${TK.h} m high, on a stone base ${TK.stand} m high`,
      alt: "A round earth-brown tank on a square stone base.", note: "T · filled from the farm’s line, never from the thatch: grass roofs do not give clean rain." },
    { id: "float", title: "Float valves × 3", size: "½ inch, low-pressure", alt: "A brass float valve with its arm and a white float.",
      note: "FV on the tank, W1 and W2 in the troughs: the head from the tank is only about 1.2 m, so a mains float would barely open." },
    { id: "pipe", title: "Yard line", size: `About ${yardM} m of 20 mm PE, buried 30 cm`, alt: "A coil of black 20 mm PE pipe.",
      note: "S1 · from the tank’s foot past the shed’s east end and along the front of the eaves, a riser up to each trough." },
    { id: "valve", title: "Outlet valve", size: "20 mm ball valve", alt: "A brass ball valve with a red lever on black pipe.",
      note: "V1 · shuts the yard line for a repair without emptying the tank." },
    { id: "tap", title: "Bucket tap", size: "½ inch bib tap", alt: "A brass bib tap on a board.", note: "TP · fills the buckets for the dogs’ bowl and the cats." },
    { id: "trough", title: `Troughs × ${FT.troughs.length}`, size: `${m(tr.x0, tr.x1)} × ${FT.trough.d} m, ${FT.trough.h} m high`,
      alt: "A plank trough on two legs, full of water.", note: "W1 and W2 · in the shade of the eaves; scrubbed out every week." },
    { id: "buckets", title: `Buckets × ${TK.buckets.length}`, size: "Black, by the tank", alt: "Three black buckets.", note: "For water and feed, by the tank." },
    { id: "bowl", title: "Dogs’ bowl", size: `Ø ${DG.bowl.r * 2} m`, alt: "A low round bowl.", note: "B · in the dogs’ run, filled twice a day from TP." },
  ])
}

export function manureRail(): RailItem[] {
  return railCards(ITEM, [
    { id: "compost", title: `Compost bays × ${CO.n}`, size: `${CO.bay} × ${CO.bay} m each, pole sides, a removable front rail`,
      alt: "Three pole bays in a row: fresh litter, a turning heap and finished compost.",
      note: "By the tank, on the path past the shed’s east end. Fresh in the first, turning in the second, finished in the third.",
      where: "Built on the farm from poles" },
    { id: "basket", title: "Fodder baskets", size: "Woven, about 0.5 m high", alt: "A woven basket of green fodder.",
      note: "The field’s residues and the cut fodder come back to the herd in these.", where: "Not sourced yet: woven locally" },
  ])
}

// every rail, as the Materials page lists them
export const rails: Rail[] = [
  { title: "Animals", items: animalRail() },
  { title: "Yard", items: yardRail() },
  { title: "Water", items: waterRail() },
  { title: "Manure", items: manureRail() },
]
