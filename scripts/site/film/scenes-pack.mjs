// The founder's folders for the scene images (film/scenes.mjs): one per image on the Desktop, in the Nano Banana
// briefs' shape (~/Desktop/<place>-nano-banana): numbered references and prompt.txt; he saves the result beside them
// as master.jpg. Part A is the whole farm from six angles, part B the walk at eye level. Run
// `node scripts/site/walk.mjs --scenes` first: the layout references come from the 3D.
//   node scripts/site/film/scenes-pack.mjs [dir]   (default ~/Desktop/farm-scenes-nano-banana)
import { copyFileSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs"
import { homedir } from "node:os"
import { extname, join } from "node:path"
import sharp from "sharp"

import { ROOT } from "../chrome.mjs"
import { LIGHT, PLACES, SCENES, SITE, VIEWS } from "./scenes.mjs"

const DIR = process.argv[2] ?? join(homedir(), "Desktop", "farm-scenes-nano-banana")
const LAYOUTS = join(ROOT, "assets/film/scenes")
const abs = (p) => (p.startsWith("/") ? p : join(ROOT, p))
const jpeg = async (src, out) => {
  if ([".jpg", ".jpeg"].includes(extname(src).toLowerCase())) copyFileSync(src, out)
  else await sharp(src).flatten({ background: "#ffffff" }).jpeg({ quality: 92 }).toFile(out)
}

// ------------------------------------------------------------ the look board: every place's photo, named
async function board(out) {
  const [cw, ch, label, cols] = [640, 357, 44, 4]
  const rows = Math.ceil(PLACES.length / cols)
  const tiles = await Promise.all(
    PLACES.map(async ([name, file], i) => {
      const img = await sharp(abs(file)).resize(cw, ch, { fit: "cover" }).toBuffer()
      const text = Buffer.from(
        `<svg width="${cw}" height="${label}"><rect width="100%" height="100%" fill="#111"/>` +
          `<text x="16" y="30" font-family="Helvetica, Arial, sans-serif" font-size="24" font-weight="700" fill="#fff">${name}</text></svg>`,
      )
      const x = (i % cols) * cw, y = Math.floor(i / cols) * (ch + label)
      return [{ input: img, left: x, top: y + label }, { input: text, left: x, top: y }]
    }),
  )
  await sharp({ create: { width: cols * cw, height: rows * (ch + label), channels: 3, background: "#111" } })
    .composite(tiles.flat())
    .jpeg({ quality: 88 })
    .toFile(out)
}

const FOLLOW_UPS = [
  "Keep the layout of image 1 exactly: the same buildings in the same places, the same paths, the same number of tents.",
  "Each building must look exactly like its photo: the same colour, materials, windows and doors.",
  "Remove anything not asked for: people, cars, animals, signs, writing.",
]
const prompt = (title, lines) =>
  [title, "", ...lines, "", "Save the best result in this folder as master.jpg (the largest size offered).", "", "---",
    "FOLLOW-UPS (paste one if it drifts):", ...FOLLOW_UPS.map((f) => `- ${f}`), ""].join("\n")

rmSync(DIR, { recursive: true, force: true })
mkdirSync(DIR, { recursive: true })
const places = join(DIR, "places.jpg")
await board(places)

// ------------------------------------------------------------ part A: the whole farm
for (const v of VIEWS) {
  const dir = join(DIR, v.id)
  mkdirSync(dir, { recursive: true })
  const layout = join(LAYOUTS, `${v.id}.jpg`)
  if (!existsSync(layout)) throw new Error(`no layout for ${v.id}: run node scripts/site/walk.mjs --scenes`)
  await jpeg(layout, join(dir, "1-layout.jpg"))
  copyFileSync(places, join(dir, "2-places.jpg"))
  await jpeg(abs(SITE), join(dir, "3-the-land.jpg"))
  await jpeg(abs(LIGHT), join(dir, "4-the-light.jpg"))
  writeFileSync(join(dir, "prompt.txt"), prompt(`${v.id}: ${v.title}`, ["Attach 1-layout.jpg, 2-places.jpg, 3-the-land.jpg and 4-the-light.jpg, in that order, then paste:", "", v.prompt]))
  console.log(`A  ${v.id}`)
}

// ------------------------------------------------------------ part B: the walk
for (const s of SCENES) {
  const dir = join(DIR, `B${s.id}`)
  mkdirSync(dir, { recursive: true })
  if (s.id === "01-lake") {
    await jpeg(abs(LIGHT), join(dir, "master.jpg"))
    writeFileSync(join(dir, "prompt.txt"), `B${s.id}: ${s.title}\n\nNothing to make: this is the homepage picture, where the walk starts. It is already saved here as master.jpg.\n\nNext: ${s.move}\n`)
    console.log(`B  ${s.id} (the hero itself)`)
    continue
  }
  const files = []
  const layout = join(LAYOUTS, `${s.id}.jpg`)
  if (s.cam) {
    if (!existsSync(layout)) throw new Error(`no layout for ${s.id}: run node scripts/site/walk.mjs --scenes`)
    files.push(["layout", layout])
  }
  for (const r of s.refs) files.push(["photo", abs(r)])
  files.push(["the-light", abs(LIGHT)])
  const names = []
  for (const [i, [kind, file]] of files.entries()) {
    const name = `${i + 1}-${kind}.jpg`
    await jpeg(file, join(dir, name))
    names.push(name)
  }
  const n = names.length
  const photos = names.map((x, i) => [x, i + 1]).filter(([x]) => x.includes("photo")).map(([, i]) => `image ${i}`)
  const animals = s.id === "19-livestock"
  const text = [
    `Make a photorealistic photograph, as if a cameraman is walking through the farm with a steady camera: ${s.see}.`,
    s.cam
      ? "Keep exactly what image 1 shows (a 3D model): which buildings are in view, where they stand and how far away they are, and the camera's height and angle."
      : "",
    photos.length ? `Every building and object looks exactly like the photo${photos.length > 1 ? "s" : ""} (${photos.join(", ")}): the same colours, materials, windows and doors.` : "",
    `The same warm late-afternoon light and colours as image ${n} (the light), and the same farm as the A1-front picture (the last image).`,
    `Lush lawn, big shade trees, flowers. No people, ${animals ? "" : "no animals, "}no cars, no text or letters${s.id === "03-gate" ? " except the sign wall's own DIGITAL FARM letters" : ""}. 16:9.`,
  ].filter(Boolean).join(" ")
  writeFileSync(
    join(dir, "prompt.txt"),
    prompt(`B${s.id}: ${s.title}`, [
      `Attach ${names.join(", ")}, in that order, and then your A1-front master.jpg as the last image (so every scene is the same farm). Then paste:`,
      "",
      text,
      "",
      `Next in the film: ${s.move}`,
    ]),
  )
  console.log(`B  ${s.id}`)
}

writeFileSync(
  join(DIR, "README.txt"),
  `Digital Farm — the scene images                                                ${new Date().toISOString().slice(0, 10)}

The film is edited from these pictures (D-070). Part A shows the whole farm from six angles: the full area and
every place in it. Part B is the walk at eye level, a cameraman's stops from the lake plot to the livestock, in one
light. Every picture is a concept (AI-made), never "today".

For each folder:
  1. Open Gemini and choose the image model (Nano Banana).
  2. Attach the numbered images in that folder, in order (part B: then your A1-front master.jpg last).
  3. Paste the prompt from prompt.txt (the part above "Save the best result").
  4. If it drifts, paste one FOLLOW-UP from the bottom of prompt.txt.
  5. Save the best result in the same folder as master.jpg (the largest size offered).

Start with A1-front: it fixes the look of the whole farm, and every part B picture is matched to it.
Then A2 to A6, then B02 to B19 in order (B01 is the homepage picture itself, already saved).

The references:
  1-layout.jpg     the homepage 3D, in each place's colours: where everything stands. Keep it.
  2-places.jpg     every place's photo, named. The names are labels only; they must not appear in the picture.
  the-land         the real farm from the hill (2026-10-25): the earth, the tree line, the lake beyond.
  the-light        the lake picture: the light every scene shares, where the film starts.

The dining area and the livestock are not on the plan yet, so they appear only in their own scenes (B17, B19).

When the pictures are ready, say "the scenes are ready": Claude edits them into the film.
`,
)
console.log(`\n${DIR}`)
