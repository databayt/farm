// The founder's folder for the ecosystem pictures (D-075): his own photos of the land (2026-10-25), numbered, and
// one prompt.txt that has Gemini (Nano Banana) remake each one from the same spot, as the land looks once it works
// as one system. The hill holds its rain on a swale, contour hedges and grass channels; the vegetable field lies on
// low terraces across the slope with the goats' and sheep's yard above it; the lake plot stays natural. The
// buildings stay as they stand (founder, 2026-11-06). He saves each result beside its photo as NN-after.jpg. A rerun
// keeps those: it first copies each into assets/ecosystem/masters/<id>.jpg, then rewrites the photos and the prompt.
// `--boards` sets each result beside its photo, captioned (D-018), for the owner and the team.
//   node scripts/site/ecosystem-pack.mjs [--boards] [dir]   (default ~/Desktop/farm-ecosystem-nano-banana)

import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { homedir } from "node:os"
import { join } from "node:path"
import sharp from "sharp"

import { ROOT } from "./chrome.mjs"
import { TREES } from "./film/scenes.mjs"

const args = process.argv.slice(2)
const BOARDS = args.includes("--boards")
const DIR = args.find((a) => !a.startsWith("--")) ?? join(homedir(), "Desktop", "farm-ecosystem-nano-banana")
const MASTERS = join(ROOT, "assets/ecosystem/masters")
const abs = (p) => (p.startsWith("/") ? p : join(ROOT, p))
const today = new Date().toISOString().slice(0, 10)

// ------------------------------------------------------------ the references every picture can lean on
const REFS = {
  // the farm's look and light: the founder's A1 picture (D-071, D-072); only its light and greens are taken,
  // never its buildings, since the buildings here stay as they stand
  A: { name: "A-the-farm.jpg", file: "assets/film/masters/A1-front.jpg" },
  // the yard's look (D-045, D-046)
  B: { name: "B-the-yard.jpg", file: "public/designs/livestock/render/livestock-hero.jpg" },
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

// ------------------------------------------------------------ the eight pictures (the plan's table, D-075)
// before: the photo remade (a crop is [left, top, width, height] in its pixels); attach: what Gemini gets, in order
const SPOTS = [
  {
    id: "01-from-the-hill",
    title: "The whole land from the hill",
    before: "assets/reference/aerial/01-img_3191-t0.jpg",
    attach: ["photo", "A"],
    see:
      `The bare red slope in the foreground becomes the top of a working hillside: just above the containers, ${SWALE}; ` +
      `above it the first ${HEDGE}; between them ${MULCH}. Below, the containers, the tents, the fire pit and the lawn ` +
      `stay as they are, except that some of the lawn's young trees have grown into fruit trees: mango, orange and ` +
      `banana (the farm has ${TREES} in all). The tree line and the lake beyond.`,
  },
  {
    id: "02-the-slope",
    title: "The slope down to the compound",
    before: "assets/survey-2026-10-25/IMG_3193_v09.jpg",
    attach: ["photo", "A"],
    see:
      `The stony slope becomes a hillside that holds its rain. Across it run ${HEDGE}, one every 15 to 25 metres down ` +
      `the slope, with ${MULCH} between them. Further down, nearer the containers, the vegetable field lies on low ` +
      `terraces across the slope. Just above the containers, ${SWALE}; its overflow runs into ${CHANNEL} to the ` +
      `lawn's edge. The compound below and the lake beyond stay as they are.`,
  },
  {
    id: "03-the-gully",
    title: "The gully by the track",
    before: "assets/survey-2026-10-25/IMG_3194_v06.jpg",
    crop: [180, 200, 780, 1387], // leaves out a distant figure by the left container
    attach: ["photo", "A"],
    see:
      `The dirt track on the left stays a track, edged with a line of fieldstones and covered in fine gravel. The cut ` +
      `trench beside it becomes ${CHANNEL}, running along the existing hedge down toward the containers. The tilled ` +
      `plot on the right becomes the field's first beds: ${BEDS}. The containers below stay as they are.`,
  },
  {
    id: "04-the-hedge",
    title: "A contour hedge, close",
    before: "assets/survey-2026-10-25/IMG_3194_v00.jpg",
    attach: ["photo", "A"],
    see:
      `Seen close, the stony ridge becomes one grown contour hedge: a low earth bank faced with the hill's own loose ` +
      `stones, a dense strip of tall Napier grass along its top and a row of leafy fodder shrubs (Calliandra and ` +
      `Gliricidia) behind it. Above it, a level strip of ground under dry cut-grass mulch. The bushes already there ` +
      `stay and have grown.`,
  },
  {
    id: "05-the-field",
    title: "The field on the slope",
    before: "assets/survey-2026-10-25/IMG_3192_v01.jpg",
    attach: ["photo", "A"],
    see:
      `The tilled red earth becomes the farm's vegetable field on low terraces across the slope: ${BEDS}, growing ` +
      `staked tomatoes, cucumbers on a trellis, cabbages, onions, kale, amaranth and herbs. Around the field a 1.5 ` +
      `metre wire-mesh fence on timber posts, and along its far fence a row of fruit: banana, avocado, mango, lemon and ` +
      `papaya. The long yellow container, the hedge line and the row of tall slim trees stay exactly as they are.`,
  },
  {
    id: "06-the-yard",
    title: "The yard on the upper field",
    before: "assets/survey-2026-10-25/IMG_3193_v13.jpg",
    attach: ["photo", "B", "A"],
    animals: true,
    builds: "the goats' and sheep's yard described below", // the only new building in the set
    see:
      `The stony upper field becomes the yard for the farm's goats and sheep, looking as in image 2: a small shed with ` +
      `a steep, shaggy grass-thatch roof, walls of dark weathered upright boards and heavy barked corner posts, open ` +
      `at the front, on a low plinth built from this field's own stones; around it a yard of crooked eucalyptus posts ` +
      `with three rope-lashed rails, straw on the ground, a few big stones to climb and one shade tree in a pole guard. ` +
      `Inside the yard, six goats (brown, black, tan and white) and four fat-tailed hair sheep (white coats, dark ` +
      `heads). Beside it, three small pole compost bays, a 1,000-litre water tank on a fieldstone base and woven ` +
      `baskets of cut fodder. Beyond, the fenced grass paddock with shade trees at its corners, edged by a live fence ` +
      `of Gliricidia. The yellow container at the field's edge stays exactly as it is.`,
  },
  {
    id: "07-the-lake-plot",
    title: "The lake plot, kept natural",
    before: "assets/survey-2026-10-25/IMG_3156_v00.jpg",
    attach: ["photo", "A"],
    see:
      `This is our plot on the lake shore. The strip along the water is kept natural: the row of tall trees stays, ` +
      `the tilled strip under them becomes native shrubs and tall natural grass, reeds grow at the water's edge, and ` +
      `the lawn in front is mown. Nothing is built and nothing is farmed here: no huts, benches, boats or animals.`,
  },
  {
    id: "08-from-above",
    title: "From above (make it after 01)",
    from: "01-from-the-hill", // no photo: Gemini makes it from the founder's 01 result
    attach: ["from", "A"],
    see:
      `Image 1 is the farm seen from the hill's edge. Make the same farm from the air: the camera pulled back up the ` +
      `hill and raised about 60 metres, looking down the slope toward the lake. In the foreground, the hill: at its ` +
      `top the yard for the goats and sheep with its small thatched shed, below it the contour hedges of tall Napier ` +
      `grass and fodder shrubs, then the vegetable field on its low terraces across the slope, the grass channels ` +
      `down the old gullies and the swale just above the containers. Beyond, the containers, the tents and the lawn ` +
      `exactly as image 1 shows them, then the tree line and the lake.`,
  },
]

const photoOf = (s) => `${s.id}.jpg`
const afterOf = (id) => `${id.slice(0, 2)}-after.jpg`
const AFTER = /^(\d\d)-after\.(jpe?g|png|webp)$/i
const findAfter = (id) => readdirSync(DIR).find((f) => AFTER.test(f) && f.startsWith(id.slice(0, 2)))

// ------------------------------------------------------------ one prompt per picture, in one prompt.txt
async function wide(file) {
  const { width, height } = await sharp(file).metadata()
  return width > height
}
async function text(s, names) {
  const n = (key) => names.indexOf(REFS[key].name) + 1
  const landscape = s.from ? true : await wide(join(DIR, photoOf(s)))
  return [
    s.from
      ? ""
      : `Edit image 1, a photograph of our farm's land in Gashora, Rwanda, taken on 2026-10-25.`,
    s.from
      ? ""
      : "Keep exactly: the camera's position, height and angle, the lens and the framing; the horizon, the lake and " +
        "the far hills; every building already there, where it stands, at its size and in its colour today (do not " +
        "repaint or rebuild any); and every tree and hedge already there. Change only the ground and the planting" +
        (s.builds ? `, and build ${s.builds}` : "") +
        ", as the land looks about three years after the work." +
        (s.builds ? "" : " Add no new buildings."),
    s.see,
    `Light and colours as in image ${n("A")}: warm late-afternoon sun, soft long shadows, lush greens and red earth. ` +
      `Take only its light and its greens, not its buildings.`,
    s.from
      ? "Photorealistic, like a real drone photograph."
      : "Photorealistic, like a real photograph taken from the same spot a few years later.",
    `No people, ${s.animals ? "no animals outside the yard" : "no animals"}, no cars, no text, letters or signs. ` +
      (landscape ? "Keep the wide 16:9 shape" : "Keep the tall 9:16 portrait shape") +
      `${s.from ? "" : " of image 1"}.`,
  ].filter(Boolean).join(" ")
}

const FOLLOW_UPS = [
  "Keep image 1 exactly: the same camera, horizon, lake, hills, buildings and trees. Change only the ground and the planting.",
  "Keep the buildings exactly as they are in image 1: the same colours, no new paint, and no new buildings (in picture 06, only the yard's shed).",
  "Keep the light of image 1.",
  "Remove anything not asked for: people, cars, signs, writing.",
  "Only goats and sheep, and only inside their yard.",
]

// ------------------------------------------------------------ the before → after boards
// a title bar across the board, then each picture under its own caption: "Today" for the photo, D-018's
// "Concept render · planned" for the result
const [TITLE, LABEL, GAP] = [80, 52, 12]
const bar = (width, height, size, words) =>
  Buffer.from(
    `<svg width="${width}" height="${height}"><rect width="100%" height="100%" fill="#111"/>` +
      `<text x="24" y="${Math.round(height / 2 + size * 0.36)}" font-family="Helvetica, Arial, sans-serif" ` +
      `font-size="${size}" font-weight="700" fill="#fff">${words}</text></svg>`,
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
    const parts = []
    let W, H
    if (s.from) {
      const img = await sharp(join(DIR, after)).resize({ width: 1600 }).toBuffer()
      const { height } = await sharp(img).metadata()
      ;[W, H] = [1600, TITLE + LABEL + height]
      parts.push(
        { input: bar(W, LABEL, 24, "Concept render · planned"), left: 0, top: TITLE },
        { input: img, left: 0, top: TITLE + LABEL },
      )
    } else {
      const before = join(DIR, photoOf(s))
      if (!existsSync(before)) throw new Error(`no ${photoOf(s)} in ${DIR}: run without --boards first`)
      const landscape = await wide(before)
      // both halves at the photo's own shape, so the spot lines up
      const [w, h] = landscape ? [1600, 900] : [900, 1600]
      const a = await sharp(before).resize(w, h, { fit: "cover" }).toBuffer()
      const b = await sharp(join(DIR, after)).resize(w, h, { fit: "cover" }).toBuffer()
      const second = landscape ? { left: 0, top: TITLE + LABEL + h + GAP } : { left: w + GAP, top: TITLE }
      ;[W, H] = landscape ? [w, TITLE + 2 * (LABEL + h) + GAP] : [2 * w + GAP, TITLE + LABEL + h]
      parts.push(
        { input: bar(w, LABEL, 24, "Today · 2026-10-25"), left: 0, top: TITLE },
        { input: a, left: 0, top: TITLE + LABEL },
        { input: bar(w, LABEL, 24, "Concept render · planned"), left: second.left, top: second.top },
        { input: b, left: second.left, top: second.top + LABEL },
      )
    }
    await sharp({ create: { width: W, height: H, channels: 3, background: "#111" } })
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

// the founder's results first: into the repo's masters, and kept where they are
mkdirSync(MASTERS, { recursive: true })
for (const s of SPOTS) {
  const after = findAfter(s.id)
  if (after) await sharp(join(DIR, after)).flatten({ background: "#ffffff" }).jpeg({ quality: 92 }).toFile(join(MASTERS, `${s.id}.jpg`))
}

if (BOARDS) {
  await boards()
  process.exit(0)
}

// only what this script writes is rewritten: his results, his other tries and the boards stay
const OWN = [...SPOTS.filter((s) => s.before).map(photoOf), ...Object.values(REFS).map((r) => r.name), "prompt.txt"]
for (const f of OWN) rmSync(join(DIR, f), { force: true })

for (const key of Object.keys(REFS)) {
  const { name, file } = REFS[key]
  if (!existsSync(abs(file))) throw new Error(`missing reference ${file}`)
  await sharp(abs(file)).flatten({ background: "#ffffff" }).jpeg({ quality: 92 }).toFile(join(DIR, name))
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
for (const s of SPOTS) {
  const names = s.attach.map((k) => (k === "photo" ? photoOf(s) : k === "from" ? afterOf(s.from) : REFS[k].name))
  blocks.push(
    [RULE, `${s.id.slice(0, 2)} · ${s.title}`, `Attach: ${names.join(", ")}  (in that order)`, "Paste:", "",
      await text(s, names), "", `Save as: ${afterOf(s.id)}`].join("\n"),
  )
}

const head = `Digital Farm — the land as one ecosystem${" ".repeat(32)}${today}

Eight pictures. Each one remakes one of your own photos of the land (2026-10-25) from the same spot, as the land
looks once it works as one system (D-075): the hill holds its rain on a swale, contour hedges and grass channels;
the vegetable field lies on low terraces across the slope, with the goats' and sheep's yard above it; the lake plot
stays natural. The buildings stay exactly as they stand. Every result is a concept picture, never "today".

For each picture:
  1. Open Gemini and choose the image model (Nano Banana).
  2. Attach the files it names, in that order.
  3. Paste its text.
  4. If it drifts, paste one follow-up from the bottom.
  5. Save the best result in this folder under its "Save as" name (the largest size offered).
Make 01 before 08: picture 08 is made from your 01-after.jpg.

  A-the-farm.jpg   your A1 picture: only its light and its greens are used, never its buildings.
  B-the-yard.jpg   the yard's page picture: the shed, the rails and the herd of picture 06.

When the pictures are ready, say "the ecosystem pictures are ready": Claude sets each one beside its photo,
captioned, ready to send to the owner and the team.
`
const tail = [RULE, "FOLLOW-UPS (paste one if it drifts):", ...FOLLOW_UPS.map((f) => `- ${f}`), ""].join("\n")
writeFileSync(join(DIR, "prompt.txt"), [head, ...blocks, tail].join("\n\n"))

// self-check: every file the prompt names is in the folder, or is a result the founder saves first
const named = [...readFileSync(join(DIR, "prompt.txt"), "utf8").matchAll(/^Attach: (.+?)\s+\(in that order\)$/gm)]
  .flatMap((m) => m[1].split(", "))
const saved = new Set(SPOTS.map((s) => afterOf(s.id)))
const lacking = named.filter((f) => !existsSync(join(DIR, f)) && !saved.has(f))
if (lacking.length) throw new Error(`prompt.txt names files the folder lacks: ${lacking.join(", ")}`)

for (const s of SPOTS) console.log(`${s.id}${findAfter(s.id) ? "  (result kept)" : ""}`)
console.log(`\n${DIR}`)
