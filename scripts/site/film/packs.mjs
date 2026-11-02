// The founder's folders for the homepage film (D-070): one per shot of shots.mjs on the Desktop, in the Nano Banana
// briefs' shape (~/Desktop/<place>-nano-banana). Each holds the frame to animate (1-start.jpg), the references a
// still needs when the shot has no frame yet, and prompt.txt; the founder makes the clip in the Gemini app or Flow
// (Veo) and saves it beside them as clip.mp4. film.mjs collects the clips. Run walk.mjs first: the layout sketches
// come from the previz.
//   node scripts/site/film/packs.mjs [dir]   (default ~/Desktop/film-walk)
import { copyFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs"
import { homedir } from "node:os"
import { extname, join } from "node:path"
import sharp from "sharp"

import { ROOT } from "../chrome.mjs"
import { SHOTS, VEO } from "./shots.mjs"

const DIR = process.argv[2] ?? join(homedir(), "Desktop", "film-walk")
const jpeg = async (src, out) => {
  if (extname(src).toLowerCase() === ".jpg" || extname(src).toLowerCase() === ".jpeg") copyFileSync(src, out)
  else await sharp(src).flatten({ background: "#ffffff" }).jpeg({ quality: 92 }).toFile(out)
}

const FOLLOW_UPS = [
  "The buildings changed. Keep every building exactly as in the start image: same colours, same materials, same windows and doors.",
  "Too fast. Make the camera move half as fast and keep it perfectly smooth.",
  "Something appeared that is not in the image (a person, a car, text). Remove it and keep only what the image shows.",
]

mkdirSync(DIR, { recursive: true })
for (const [n, s] of SHOTS.entries()) {
  const dir = join(DIR, s.id)
  mkdirSync(dir, { recursive: true })
  const lines = [`${s.id}: ${s.title}  (${s.seconds} s in the film)`, ""]
  if (s.start) {
    await jpeg(join(ROOT, s.start), join(dir, "1-start.jpg"))
    if (s.portrait) await jpeg(join(ROOT, s.portrait), join(dir, "1-start-portrait.jpg"))
  } else {
    // the still comes first: the references, then the previz frame as the layout sketch
    const refs = [...s.refs]
    const sketch = join(ROOT, "assets/film/previz", s.id, "start.jpg")
    if (existsSync(sketch)) refs.push(sketch)
    for (const [i, r] of refs.entries()) await jpeg(r.startsWith("/") ? r : join(ROOT, r), join(dir, `ref-${i + 1}.jpg`))
    lines.push(
      "STEP 1 — THE STILL (Nano Banana, in the Gemini app)",
      `Attach ref-1.jpg to ref-${refs.length}.jpg, in order, then paste:`,
      "",
      `${s.still} Photorealistic, 16:9, no people, no text, no logos, no number plates.`,
      "",
      "Save the best result in this folder as 1-start.jpg (the largest size offered).",
      "",
    )
  }
  lines.push(
    s.start ? "THE CLIP (Veo, in the Gemini app or Flow)" : "STEP 2 — THE CLIP (Veo, in the Gemini app or Flow)",
    "Attach 1-start.jpg, choose 16:9 (and 1080p if offered), then paste:",
    "",
    VEO(s),
    "",
    "Save the best result in this folder as clip.mp4.",
  )
  if (s.portrait)
    lines.push(
      "",
      "THEN THE UPRIGHT ONE (for phones)",
      "Attach 1-start-portrait.jpg, choose 9:16, then paste:",
      "",
      VEO({ ...s, move: s.portraitMove }),
      "",
      "Save the best result in this folder as clip-portrait.mp4.",
    )
  lines.push("", "---", "FOLLOW-UPS (paste one if it drifts):", ...FOLLOW_UPS.map((f) => `- ${f}`), "")
  writeFileSync(join(dir, "prompt.txt"), lines.join("\n"))
  console.log(`${String(n + 1).padStart(2)}. ${s.id}${s.start ? "" : "  (still first)"}`)
}

const order = ["01-lake", "03-gate", "06-camp", "07-studios", "09-guest-rooms", "10-bar", "18-aerial", "02-road", "05-inner-gate", "04-parking"]
writeFileSync(
  join(DIR, "README.txt"),
  `Digital Farm — the homepage film, shot by shot                                ${new Date().toISOString().slice(0, 10)}

The film is the homepage hero: the lake picture starts to move when someone clicks "Watch film", then the
camera takes the road to the farm, goes through the gate and walks past every place (D-070). One folder per
shot, in the film's order. Every shot is a concept (AI-made), never "today".

For each folder:
  1. If prompt.txt starts with STEP 1, make the still first: open Gemini, choose the image model (Nano Banana),
     attach the ref images in order, paste the prompt, and save the best result here as 1-start.jpg.
  2. The clip: in the Gemini app choose Video (Veo), or in Flow (labs.google/flow) use "Frames to video".
     Attach 1-start.jpg, choose 16:9, paste the clip prompt.
  3. Download the best one (1080p if offered) and save it in the same folder as clip.mp4.
  4. If it drifts (the buildings change, a person appears, text appears), paste one FOLLOW-UP and try again.

01-lake matters most: it starts from the homepage picture itself, so the hero seems to come alive. It has a
second, upright version for phones (1-start-portrait.jpg -> clip-portrait.mp4).

Best order: ${order.join(", ")}, then the rest. Shots without a clip still play as a slow push on their
picture, so the film works at every step.

When some are done, say "the film clips are ready": Claude collects them (pnpm site:film) and puts the new
cut on the homepage.

Rules: no recognisable person, no number plates, no text made by the AI. The DIGITAL FARM sign in 03-gate is
already in the picture; it must stay as it is.
`,
)
console.log(`\n${DIR}`)
