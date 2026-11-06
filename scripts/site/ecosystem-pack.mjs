// The ecosystem pictures (D-075, D-076): new outlooks of the farm as one system, made like the scene masters (D-070).
// The look comes from what is already mastered: every place's photo on one sheet, the lake picture's light, and the
// A1 picture as "the farm" (its buildings, lawn, trees and fruit trees, D-071). The founder's own photos of the land
// (2026-10-25) give only the positions: the camera's spot and direction, the slope, which side the lake is on and how
// far things are (founder, 2026-11-07). On the hill the rain is held by a swale, contour hedges and grass channels;
// the vegetable field lies on low terraces across the slope with the goats' and sheep's yard above it; the lake plot
// stays natural. Claude makes the pictures through Gemini on the founder's account and saves each beside its photo
// as NN-after.jpg; prompt.txt is the record and his way to make one himself, pack.json the same jobs for kun's
// runner. A rerun keeps the results: it first copies each into assets/ecosystem/masters/<id>.jpg, then rewrites the
// photos, the references and the prompts. `--boards` sets each result above its spot, captioned (D-018).
//   node scripts/site/ecosystem-pack.mjs [--boards] [dir]   (default ~/Desktop/farm-ecosystem-nano-banana)

import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { homedir } from "node:os"
import { join } from "node:path"
import sharp from "sharp"

import { ROOT } from "./chrome.mjs"
import { LIGHT, PLACES, TREES } from "./film/scenes.mjs"

const args = process.argv.slice(2)
const BOARDS = args.includes("--boards")
const DIR = args.find((a) => !a.startsWith("--")) ?? join(homedir(), "Desktop", "farm-ecosystem-nano-banana")
const MASTERS = join(ROOT, "assets/ecosystem/masters")
const abs = (p) => (p.startsWith("/") ? p : join(ROOT, p))
const today = new Date().toISOString().slice(0, 10)

// ------------------------------------------------------------ the mastered references
// places is built here, the same sheet as the scene pack's 2-places.jpg; the others are copied
const REFS = {
  places: { name: "places.jpg", what: "every place's photo, named (the names are labels only)" },
  field: { name: "the-field.jpg", file: "public/designs/farming/render/field-hero.jpg", what: "the field's photo (D-054)" },
  yard: { name: "the-yard.jpg", file: "public/designs/livestock/render/livestock-hero.jpg", what: "the yard's photo (D-045)" },
  light: { name: "the-light.jpg", file: LIGHT, what: "the lake picture: the light every scene shares" },
  farm: { name: "the-farm.jpg", file: "assets/film/masters/A1-front.jpg", what: "the A1 picture: the same farm, trees and fruit trees" },
}

// ------------------------------------------------------------ the ecosystem's parts, named the same in every prompt
const HEDGE =
  "contour hedges (lines that follow the slope's contour exactly, each a low earth bank faced with the hill's own " +
  "loose stones, with a dense strip of tall Napier grass along its top and a row of leafy fodder shrubs, Calliandra " +
  "and Gliricidia, behind it)"
const SWALE =
  "a swale (a level, shallow, grass-lined ditch across the slope with a planted bank on its downhill side, which " +
  "catches the hill's rain and lets it soak in)"
const CHANNEL = "a grass channel (wide, shallow and grass-lined, with low steps of fieldstones across it to slow the water)"
const MULCH = "dry cut-grass mulch over every bare patch (no bare red earth left except the paths)"
const BEDS =
  "raised vegetable beds (1.2 metres wide, 20 cm high, 0.5 metre paths between them) running across the slope, each " +
  "with two thin black drip lines and dry-grass mulch"

// ------------------------------------------------------------ the eight pictures
// before: the photo that gives the positions (a crop is [left, top, width, height] in its pixels); attach: what
// Gemini gets, in order; see(n): what this spot shows, n(key) being a reference's image number
const SPOTS = [
  {
    id: "01-from-the-hill",
    title: "The whole farm from the hill",
    before: "assets/reference/aerial/01-img_3191-t0.jpg",
    attach: ["photo", "places", "light", "farm"],
    farmInView: true,
    note:
      "A swale just above the farm catches the hill's rain. Above it, contour hedges of Napier grass and fodder " +
      "shrubs on stone-faced banks, and mulch on every bare patch.",
    see: () =>
      `In the foreground the hill works with the farm: just above the farm, ${SWALE}; above it the first ${HEDGE}; ` +
      `between them ${MULCH}. The tree line and the lake beyond.`,
  },
  {
    id: "02-the-slope",
    title: "The slope down to the farm",
    before: "assets/survey-2026-10-25/IMG_3193_v09.jpg",
    attach: ["photo", "places", "light", "farm"],
    farmInView: true,
    note:
      "Contour hedges every 15 to 25 m down the slope, the vegetable field on low terraces near the farm, and the " +
      "swale above the farm spilling into a grass channel to the lawn.",
    see: () =>
      `The stony slope in front is a hillside that holds its rain. Across it run ${HEDGE}, one every 15 to 25 metres ` +
      `down the slope, with ${MULCH} between them. Further down, nearer the farm, the vegetable field lies on low ` +
      `terraces across the slope. Just above the farm, ${SWALE}; its overflow runs into ${CHANNEL} to the lawn's ` +
      `edge. The farm below and the lake beyond.`,
  },
  {
    id: "03-the-gully",
    title: "The gully by the track",
    before: "assets/survey-2026-10-25/IMG_3194_v06.jpg",
    crop: [180, 200, 780, 1387], // leaves out a distant figure by the left container
    attach: ["photo", "field", "light", "farm"],
    note:
      "The track edged with fieldstones and gravelled. The cut trench becomes a grass channel with fieldstone " +
      "steps, and the field's first raised beds, 1.2 m wide with two drip lines each.",
    see: (n) =>
      `The dirt track on the left stays a track, edged with a line of fieldstones and covered in fine gravel. The cut ` +
      `trench beside it becomes ${CHANNEL}, running along the hedge down toward the farm. The tilled plot on the right ` +
      `becomes the field's first beds, with the crops and timber of image ${n("field")} (the field) but laid as the ` +
      `plan has them: ${BEDS}. The farm's buildings below, as on image ${n("farm")}.`,
  },
  {
    id: "04-the-hedge",
    title: "A contour hedge, close",
    before: "assets/survey-2026-10-25/IMG_3194_v00.jpg",
    attach: ["photo", "light", "farm"],
    note:
      "One contour hedge: an earth bank faced with the hill's own stones, Napier grass along its top, Calliandra " +
      "and Gliricidia behind it, and a level mulched strip above.",
    see: () =>
      `Seen close, the stony ridge in front becomes one grown contour hedge: a low earth bank faced with the hill's ` +
      `own loose stones, a dense strip of tall Napier grass along its top and a row of leafy fodder shrubs (Calliandra ` +
      `and Gliricidia) behind it. Above it, a level strip of ground under dry cut-grass mulch. The bushes already ` +
      `there have grown.`,
  },
  {
    id: "05-the-field",
    title: "The field on the slope",
    before: "assets/survey-2026-10-25/IMG_3192_v01.jpg",
    attach: ["photo", "field", "light", "farm"],
    note:
      "Raised beds 1.2 m wide with 0.5 m paths and two drip lines each, a 1.5 m wire-mesh fence on posts every 3 m, " +
      "and a fruit row along the far side.",
    see: (n) =>
      `The tilled red earth becomes the farm's vegetable field, with the crops, timber and baskets of image ` +
      `${n("field")} (the field), but laid as the plan has it, on low terraces across the slope: ${BEDS}, growing ` +
      `staked tomatoes, cucumbers on a trellis, cabbages, onions, kale, amaranth and herbs. Round the beds a 1.5 metre ` +
      `wire-mesh fence on timber posts every 3 metres (not image ${n("field")}'s rails), and along its far side a row ` +
      `of fruit: banana, avocado, mango, lemon and papaya. The farm's buildings beyond, as on image ${n("farm")}.`,
  },
  {
    id: "06-the-yard",
    title: "The yard on the upper field",
    before: "assets/survey-2026-10-25/IMG_3193_v13.jpg",
    attach: ["photo", "yard", "light", "farm"],
    animals: true,
    note:
      "The thatched shed on a plinth of the field's stones, the rail yard with 6 goats and 4 sheep, compost bays, a " +
      "1,000 L tank, and the paddock with a Gliricidia live fence.",
    see: (n) =>
      `The stony upper field becomes the yard for the farm's goats and sheep, exactly as image ${n("yard")} (the ` +
      `yard) shows it: the small shed with its steep, shaggy grass-thatch roof, dark weathered upright boards and ` +
      `heavy barked corner posts, open at the front, on a low plinth of this field's own stones; the yard of crooked ` +
      `eucalyptus posts with three rope-lashed rails, straw on the ground, big stones to climb and one shade tree in ` +
      `a pole guard; inside it six goats (brown, black, tan and white) and four fat-tailed hair sheep (white coats, ` +
      `dark heads). Beside it, three small pole compost bays, a 1,000-litre water tank on a fieldstone base and woven ` +
      `baskets of cut fodder. Beyond, the fenced grass paddock with shade trees at its corners, edged by a live fence ` +
      `of Gliricidia; below, the farm and the lake.`,
  },
  {
    id: "07-the-lake-plot",
    title: "The lake plot, kept natural",
    before: "assets/survey-2026-10-25/IMG_3156_v00.jpg",
    attach: ["photo", "light", "farm"],
    note:
      "The lake strip kept natural: the tree row, native shrubs and tall grass, and reeds at the water. Nothing is " +
      "built or farmed here.",
    see: () =>
      `This is our plot on the lake shore, kept natural: the row of tall trees stays, the tilled strip under them ` +
      `becomes native shrubs and tall natural grass, reeds grow at the water's edge, and the lawn in front is mown. ` +
      `Nothing is built and nothing is farmed here: no huts, benches, boats or animals.`,
  },
  {
    id: "08-from-above",
    title: "From above (made after 01)",
    from: "01-from-the-hill", // no photo: made from the 01 result
    attach: ["from", "light", "farm"],
    farmInView: true,
    note:
      "The whole system from the air: the yard at the top of the hill, the hedges and terraced field, the grass " +
      "channels and the swale, then the farm and the lake.",
    see: () =>
      `Image 1 is our farm seen from the hill's edge (a concept picture). Make the same farm from the air: the camera ` +
      `pulled back up the hill and raised about 60 metres, looking down the slope toward the lake. In the foreground, ` +
      `the hill: at its top the yard for the goats and sheep with its small thatched shed, below it the contour hedges ` +
      `of tall Napier grass and fodder shrubs, then the vegetable field on its low terraces across the slope, the ` +
      `grass channels down the old gullies and the swale just above the farm. Beyond, the farm's buildings, tents and ` +
      `lawn exactly as image 1 shows them, then the tree line and the lake.`,
  },
]

const photoOf = (s) => `${s.id}.jpg`
const afterOf = (id) => `${id.slice(0, 2)}-after.jpg`
const AFTER = /^(\d\d)-after\.(jpe?g|png|webp)$/i
const findAfter = (id) => readdirSync(DIR).find((f) => AFTER.test(f) && f.startsWith(id.slice(0, 2)))
const nameOf = (s, key) => (key === "photo" ? photoOf(s) : key === "from" ? afterOf(s.from) : REFS[key].name)

// ------------------------------------------------------------ one prompt per picture, in the scene masters' words
function text(s) {
  const n = (key) => s.attach.indexOf(key) + 1
  const lines = []
  if (!s.from) {
    lines.push(
      `Make a photorealistic photograph of our farm in Gashora, Rwanda, as it will look about three years after the ` +
        `work, from exactly the spot of image 1, as a wide 16:9 view.`,
      `Image 1 is the real land, photographed there on 2026-10-25: keep its camera position, height and direction, ` +
        `the slope and the lie of the ground, which side the lake is on, the far hills, and how far away everything ` +
        `is. Take only positions and distances from image 1, never its look: its red containers and tents are ` +
        `today's, and the farm stands there as designed.`,
    )
    if (s.attach.includes("places")) {
      lines.push(
        `Where image 1 shows today's containers and tents stands the farm of image ${n("farm")}: every building and ` +
          `tent looks exactly like its photo on image ${n("places")} (the names on image ${n("places")} are labels ` +
          `only; never write them in the picture).`,
      )
    }
  }
  lines.push(s.see(n))
  lines.push(
    s.farmInView || s.attach.includes("places")
      ? `The same warm late-afternoon light and colours as image ${n("light")} (the light), and the same farm as ` +
          `image ${n("farm")} (the farm from above): its buildings, lawn, shade trees, flowers and fruit trees ` +
          `(${TREES} on the whole farm).`
      : `The same warm late-afternoon light and colours as image ${n("light")} (the light), and the same greens and ` +
          `trees as image ${n("farm")} (the farm from above).`,
    s.from ? "Photorealistic, like a real drone photograph." : "Photorealistic, like a photograph in a high-end travel magazine.",
    `No people, ${s.animals ? "no animals outside the yard" : "no animals"}, no cars, no text or letters anywhere, ` +
      `not even on the stone sign wall by the gate, which stays blank. 16:9.`,
  )
  return lines.join(" ")
}

const FOLLOW_UPS = [
  "Keep the camera of image 1: the same spot, height and direction, the same slope, and the lake on the same side.",
  "Each building and tent must look exactly like its photo on the places sheet: the same colour, materials, windows and doors. Add no building the farm does not have.",
  "Keep the light of the lake picture: warm late-afternoon sun, soft long shadows.",
  "Remove anything not asked for: people, cars, signs, writing.",
  "Only goats and sheep, and only inside their yard.",
]

// ------------------------------------------------------------ the look board: every place's photo, named
async function placesSheet(out) {
  const [cw, ch, label, cols] = [640, 357, 44, 4]
  const rows = Math.ceil(PLACES.length / cols)
  const tiles = await Promise.all(
    PLACES.map(async ([name, file], i) => {
      const img = await sharp(abs(file)).resize(cw, ch, { fit: "cover" }).toBuffer()
      const words = Buffer.from(
        `<svg width="${cw}" height="${label}"><rect width="100%" height="100%" fill="#111"/>` +
          `<text x="16" y="30" font-family="Helvetica, Arial, sans-serif" font-size="24" font-weight="700" fill="#fff">${name}</text></svg>`,
      )
      const x = (i % cols) * cw, y = Math.floor(i / cols) * (ch + label)
      return [{ input: img, left: x, top: y + label }, { input: words, left: x, top: y }]
    }),
  )
  await sharp({ create: { width: cols * cw, height: rows * (ch + label), channels: 3, background: "#111" } })
    .composite(tiles.flat())
    .jpeg({ quality: 88 })
    .toFile(out)
}

// ------------------------------------------------------------ the boards
// the picture across the top under D-018's "Concept render · planned"; below it the spot as it is today, which gave
// the picture its positions, and in plain words what is built there, for the team
const [TITLE, LABEL, GAP, W, FOOT] = [80, 52, 12, 1600, 420]
const FONT = "Helvetica, Arial, sans-serif"
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;")
const bar = (width, height, size, words) =>
  Buffer.from(
    `<svg width="${width}" height="${height}"><rect width="100%" height="100%" fill="#111"/>` +
      `<text x="24" y="${Math.round(height / 2 + size * 0.36)}" font-family="${FONT}" ` +
      `font-size="${size}" font-weight="700" fill="#fff">${esc(words)}</text></svg>`,
  )
function wrap(words, max) {
  const lines = [""]
  for (const w of words.split(" ")) {
    if ((lines.at(-1) + " " + w).trim().length > max) lines.push(w)
    else lines[lines.length - 1] = (lines.at(-1) + " " + w).trim()
  }
  return lines
}
const notes = (width, height, body, foot) =>
  Buffer.from(
    `<svg width="${width}" height="${height}"><rect width="100%" height="100%" fill="#111"/>` +
      `<text x="0" y="44" font-family="${FONT}" font-size="30" font-weight="700" fill="#fff">What is built here</text>` +
      wrap(body, Math.floor(width / 15))
        .map((l, i) => `<text x="0" y="${96 + i * 42}" font-family="${FONT}" font-size="28" fill="#ddd">${esc(l)}</text>`)
        .join("") +
      `<text x="0" y="${height - 20}" font-family="${FONT}" font-size="22" fill="#999">${esc(foot)}</text></svg>`,
  )
async function boards() {
  const out = join(DIR, "boards")
  rmSync(out, { recursive: true, force: true })
  mkdirSync(out, { recursive: true })
  let made = 0
  for (const s of SPOTS) {
    const after = findAfter(s.id)
    if (!after) continue
    const title = `${s.id.slice(0, 2)} · ${s.title.replace(/ \(.*\)$/, "")}`
    const h = Math.round((W * 9) / 16)
    const img = await sharp(join(DIR, after)).resize(W, h, { fit: "cover" }).toBuffer()
    const top = TITLE + LABEL + h + GAP
    const parts = [
      { input: bar(W, LABEL, 24, "Concept render · planned"), left: 0, top: TITLE },
      { input: img, left: 0, top: TITLE + LABEL },
    ]
    let left = 24
    if (!s.from) {
      const before = join(DIR, photoOf(s))
      if (!existsSync(before)) throw new Error(`no ${photoOf(s)} in ${DIR}: run without --boards first`)
      const small = await sharp(before).resize({ height: FOOT }).toBuffer()
      const { width } = await sharp(small).metadata()
      parts.push({ input: small, left: 0, top })
      left = width + 32
    }
    const foot = s.from ? `Made from picture ${s.from.slice(0, 2)}.` : "Left: the spot today, 2026-10-25. It gave the picture its positions."
    parts.push({ input: notes(W - left - 24, FOOT, s.note, foot), left, top })
    await sharp({ create: { width: W, height: top + FOOT, channels: 3, background: "#111" } })
      .composite([{ input: bar(W, TITLE, 34, title), left: 0, top: 0 }, ...parts])
      .jpeg({ quality: 88 })
      .toFile(join(out, `${s.id}.jpg`))
    made++
    console.log(`board  ${s.id}`)
  }
  console.log(made ? `\n${out}` : "no NN-after picture yet: nothing to board")
}

// ------------------------------------------------------------ the folder
mkdirSync(DIR, { recursive: true })

// the results first: into the repo's masters, and kept where they are
mkdirSync(MASTERS, { recursive: true })
for (const s of SPOTS) {
  const after = findAfter(s.id)
  if (after) await sharp(join(DIR, after)).flatten({ background: "#ffffff" }).jpeg({ quality: 92 }).toFile(join(MASTERS, `${s.id}.jpg`))
}

if (BOARDS) {
  await boards()
  process.exit(0)
}

// only what this script writes is rewritten: the results, other tries and the boards stay
const OWN = [
  ...SPOTS.filter((s) => s.before).map(photoOf),
  ...Object.values(REFS).map((r) => r.name),
  "A-the-farm.jpg", // the first pack's names (2026-11-06)
  "B-the-yard.jpg",
  "prompt.txt",
  "pack.json",
]
for (const f of OWN) rmSync(join(DIR, f), { force: true })

await placesSheet(join(DIR, REFS.places.name))
for (const r of Object.values(REFS).filter((x) => x.file)) {
  if (!existsSync(abs(r.file))) throw new Error(`missing reference ${r.file}`)
  await sharp(abs(r.file)).flatten({ background: "#ffffff" }).jpeg({ quality: 92 }).toFile(join(DIR, r.name))
}
for (const s of SPOTS.filter((x) => x.before)) {
  if (!existsSync(abs(s.before))) throw new Error(`missing photo ${s.before}`)
  let img = sharp(abs(s.before))
  if (s.crop) {
    const [left, top, width, height] = s.crop
    img = img.extract({ left, top, width, height })
  }
  await img.jpeg({ quality: 92 }).toFile(join(DIR, photoOf(s)))
}

const RULE = "═".repeat(72)
const blocks = []
const jobs = [] // the same eight, for kun's runner
for (const s of SPOTS) {
  const names = s.attach.map((k) => nameOf(s, k))
  const prompt = text(s)
  blocks.push(
    [RULE, `${s.id.slice(0, 2)} · ${s.title}`, `Attach: ${names.join(", ")}  (in that order)`, "Paste:", "", prompt, "",
      `Save as: ${afterOf(s.id)}`].join("\n"),
  )
  jobs.push({ id: s.id.slice(0, 2), title: s.title, attach: names, prompt, ratio: "16:9", save: afterOf(s.id) })
}

const legend = Object.values(REFS)
  .map((r) => `  ${r.name.padEnd(15)}  ${r.what}`)
  .join("\n")
const head = `Digital Farm — the land as one ecosystem${" ".repeat(32)}${today}

Eight new outlooks of the farm as one system (D-075): the hill holds its rain on a swale, contour hedges and grass
channels; the vegetable field lies on low terraces across the slope, with the goats' and sheep's yard above it; the
lake plot stays natural. They are made like the scene masters: the look from what is mastered, the positions from
your photos of the land (2026-10-25). Every result is a concept picture, never "today".

Claude makes these pictures itself, in Gemini on your account (D-076), checks each one and sends you the boards.
This text is the record, and your way to make one yourself:
  1. Open Gemini, choose Create image and the 16:9 shape.
  2. Attach the files it names, in that order.
  3. Paste its text.
  4. If it drifts, paste one follow-up from the bottom.
  5. Save the best result in this folder under its "Save as" name (the largest size offered).
Make 01 before 08: picture 08 is made from 01-after.jpg.

  NN-<spot>.jpg    your photo of the spot: only its positions are used, the camera, the slope, the lake's side.
${legend}
`
const tail = [RULE, "FOLLOW-UPS (paste one if it drifts):", ...FOLLOW_UPS.map((f) => `- ${f}`), ""].join("\n")
writeFileSync(join(DIR, "prompt.txt"), [head, ...blocks, tail].join("\n\n"))
writeFileSync(
  join(DIR, "pack.json"),
  JSON.stringify({ title: "Digital Farm — the land as one ecosystem", date: today, jobs, followUps: FOLLOW_UPS }, null, 2) + "\n",
)

// self-check: every file the prompt names is in the folder, or is a result made first
const named = [...readFileSync(join(DIR, "prompt.txt"), "utf8").matchAll(/^Attach: (.+?)\s+\(in that order\)$/gm)]
  .flatMap((m) => m[1].split(", "))
const saved = new Set(SPOTS.map((s) => afterOf(s.id)))
const lacking = named.filter((f) => !existsSync(join(DIR, f)) && !saved.has(f))
if (lacking.length) throw new Error(`prompt.txt names files the folder lacks: ${lacking.join(", ")}`)

for (const s of SPOTS) console.log(`${s.id}${findAfter(s.id) ? "  (result kept)" : ""}`)
console.log(`\n${DIR}`)
