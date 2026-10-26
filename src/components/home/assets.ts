// What each homepage image is, independent of whether its file exists yet. The files come from
// scripts/site/build-assets.mjs (assets.generated.ts); a missing one renders as a placeholder.
// Renders are made from study/website/render-brief.md (D-018).

export type Kind = "render" | "today" | "design"
type Tone = "golden" | "dusk" | "interior" | "aerial"

type Asset = { kind: Kind; alt: string; subject: string; tone: Tone }

export const ASSETS = {
  gate: {
    kind: "render",
    tone: "golden",
    subject: "The gate and the Digital Farm sign",
    alt: "The entrance at golden hour: fieldstone gateposts, open farm gates and a low stone wall carrying the sign Digital Farm",
  },
  "gate-portrait": {
    kind: "render",
    tone: "golden",
    subject: "The gate and the sign, upright",
    alt: "The entrance at golden hour: fieldstone gateposts, open farm gates and a low stone wall carrying the sign Digital Farm",
  },
  parking: {
    kind: "render",
    tone: "golden",
    subject: "Green parking under shade trees",
    alt: "A parking lawn of grass pavers under young shade trees, with two cars and a cobbled road leaving the far corner",
  },
  road: {
    kind: "render",
    tone: "golden",
    subject: "The rock road to the inner gate",
    alt: "A hand-laid stone road curving between low hedges toward the inner gate, with container roofs beyond",
  },
  "inner-gate": {
    kind: "render",
    tone: "golden",
    subject: "The inner gate opening onto the courtyard",
    alt: "An open gate of timber slats on a red steel frame, with the courtyard lawn, the fire pit and the coloured containers beyond",
  },
  aerial: {
    kind: "render",
    tone: "aerial",
    subject: "The whole compound from the air",
    alt: "The compound from the air: gate, parking, road, the courtyard with its fire pit, the yellow guest block, the red studios and yellow office, the teal study room and the lake beyond",
  },
  rooms: {
    kind: "render",
    tone: "golden",
    subject: "The guest-room block and its veranda",
    alt: "The long yellow guest-room block with three red doors onto a timber veranda, at golden hour",
  },
  room: {
    kind: "render",
    tone: "interior",
    subject: "Inside a guest room",
    alt: "A guest room with a double bed, a timber headboard wall, two red steel posts where the containers join, and a frosted door to the bathroom",
  },
  studios: {
    kind: "render",
    tone: "golden",
    subject: "The two studios and the office on their decks",
    alt: "Two red studios and the yellow office on raised decks with red railings, the studios with roof terraces under clear canopies",
  },
  studio: {
    kind: "render",
    tone: "interior",
    subject: "Inside a studio",
    alt: "Inside a studio: a bed across the far end, a plywood kitchenette, a small table and stools by the open glass wall",
  },
  office: {
    kind: "render",
    tone: "interior",
    subject: "The farm office",
    alt: "The farm office: two plywood desks by the window, shelves of storage boxes and seed jars, a wall screen with a map of the plots",
  },
  study: {
    kind: "render",
    tone: "golden",
    subject: "The study room and its deck",
    alt: "The long teal study room with tall glass doors behind timber louvres, opening onto a wide timber deck",
  },
  classroom: {
    kind: "render",
    tone: "interior",
    subject: "A training day in the study room",
    alt: "People at long tables in the study room, seen from behind, listening beside a wall screen",
  },
  dusk: {
    kind: "render",
    tone: "dusk",
    subject: "The courtyard at dusk, the fire pit lit",
    alt: "The courtyard at dusk: the stone fire pit burning, guests around it, warm light in the containers and the lake beyond the trees",
  },
  "rooms-planned": {
    kind: "render",
    tone: "golden",
    subject: "The guest-room block, finished",
    alt: "As planned: the yellow block repainted, with a timber veranda and a lawn where the bare soil is",
  },
  "studios-planned": {
    kind: "render",
    tone: "golden",
    subject: "The studio row, finished",
    alt: "As planned: the red studios and the yellow office on new timber decks, with roof terraces and the clutter cleared",
  },
  "arrival-planned": {
    kind: "render",
    tone: "golden",
    subject: "The arrival yard, finished",
    alt: "As planned: the concrete yard turned into a grass parking lawn, with a stone road toward the compound",
  },
  "rooms-today": {
    kind: "today",
    tone: "golden",
    subject: "The joined containers today",
    alt: "Today: the yellow joined containers with red doors and barred windows, on bare red soil",
  },
  "studios-today": {
    kind: "today",
    tone: "golden",
    subject: "The studio row today",
    alt: "Today: two red containers and a yellow one on raised steel decks, with an unfinished timber platform and garden furniture on the lawn",
  },
  "arrival-today": {
    kind: "today",
    tone: "golden",
    subject: "The arrival yard today",
    alt: "Today: a cracked concrete yard beside the lawn, with young trees along an earth bank",
  },
  "studio-exterior": {
    kind: "design",
    tone: "golden",
    subject: "The studio, design render",
    alt: "Design render: the studio on its raised deck, with a roof terrace and clear canopies",
  },
  "studio-cutaway": {
    kind: "design",
    tone: "interior",
    subject: "The studio cutaway, design render",
    alt: "Design render: a cutaway of the studio with the bed, the plywood kitchenette, the table and the shower room",
  },
} satisfies Record<string, Asset>

export type AssetId = keyof typeof ASSETS

// Placeholder washes, one per light, so a missing render still sits in the page's rhythm.
export const TONES: Record<Tone, string> = {
  golden: "linear-gradient(160deg, #eadbb8 0%, #cfae74 55%, #8f6c3f 100%)",
  dusk: "linear-gradient(165deg, #2d3651 0%, #5f4a5d 55%, #c48a5c 100%)",
  interior: "linear-gradient(160deg, #f1e9da 0%, #dccaa9 60%, #b99d72 100%)",
  aerial: "linear-gradient(160deg, #d4dfc7 0%, #a5b98e 55%, #6c8a5e 100%)",
}
