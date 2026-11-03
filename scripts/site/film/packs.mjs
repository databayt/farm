// The founder's folders for the homepage film's clips (D-070): one per shot of shots.mjs on the Desktop. Each holds
// the picture the clip starts on (1-start.jpg), for a joined shot the picture it ends on (2-end.jpg, the next shot's
// start, so the clips join into one walk), and prompt.txt; the founder makes the clip in Flow ("Frames to video") or
// the Gemini app (Veo) and saves it beside them as clip.mp4. film.mjs collects the clips. The pictures are the scene
// images (assets/film/masters, from film/scenes-pack.mjs) and the place heroes, cut to each shot's frame.
// A rerun rewrites the pictures and prompts and keeps every clip; a folder no shot uses any more goes, unless it holds
// a clip.
//   node scripts/site/film/packs.mjs [dir]   (default ~/Desktop/film-walk)
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs"
import { homedir } from "node:os"
import { join } from "node:path"
import sharp from "sharp"

import { ROOT } from "../chrome.mjs"
import { endOf, SHOTS, VEO } from "./shots.mjs"

const DIR = process.argv[2] ?? join(homedir(), "Desktop", "film-walk")
const isClip = (f) => /^clip.*\.(mp4|mov)$/i.test(f)

// a shot's picture as a JPEG, cut to its frame
async function picture(src, frame, out) {
  let img = sharp(join(ROOT, src)).rotate()
  if (frame) {
    const { width, height } = await sharp(join(ROOT, src)).metadata()
    const [x0, y0, x1, y1] = frame
    img = img.extract({ left: Math.round(width * x0), top: Math.round(height * y0), width: Math.round(width * (x1 - x0)), height: Math.round(height * (y1 - y0)) })
  }
  await img.flatten({ background: "#ffffff" }).jpeg({ quality: 93 }).toFile(out)
}

const FOLLOW_UPS = [
  "The buildings changed. Keep every building exactly as in the pictures: the same colours, materials, windows and doors.",
  "Too fast. Make the camera move half as fast, perfectly smooth.",
  "Something appeared that is not in the pictures (a person, a car, text). Remove it and keep only what they show.",
]

// the folders of an earlier shot list go, unless the founder saved a clip in one
mkdirSync(DIR, { recursive: true })
const ids = new Set(SHOTS.map((s) => s.id))
for (const d of readdirSync(DIR, { withFileTypes: true }).filter((e) => e.isDirectory() && !ids.has(e.name))) {
  if (readdirSync(join(DIR, d.name)).some(isClip)) console.log(`kept ${d.name}: it holds a clip`)
  else rmSync(join(DIR, d.name), { recursive: true, force: true })
}

const missing = []
for (const [n, s] of SHOTS.entries()) {
  const dir = join(DIR, s.id)
  mkdirSync(dir, { recursive: true })
  for (const f of readdirSync(dir)) if (!isClip(f)) rmSync(join(dir, f), { recursive: true, force: true })
  const end = endOf(s)
  const need = [s.start, end?.start, s.portrait].filter(Boolean).filter((p) => !existsSync(join(ROOT, p)))
  if (need.length) {
    missing.push(`${s.id}: ${need.join(", ")}`)
    continue
  }
  await picture(s.start, s.frame, join(dir, "1-start.jpg"))
  if (end) await picture(end.start, end.frame, join(dir, "2-end.jpg"))
  if (s.portrait) await picture(s.portrait, null, join(dir, "1-start-portrait.jpg"))

  const lines = [`${s.id}: ${s.title}`, ""]
  if (end)
    lines.push(
      `It runs from this picture into the next shot's (${end.id}), so the clips join into one walk.`,
      "",
      "IN FLOW (labs.google/flow): choose Frames to Video, 16:9.",
      "  First frame: 1-start.jpg    Last frame: 2-end.jpg",
      "Then paste:",
      "",
      VEO(s),
      "",
      "OR IN THE GEMINI APP (one picture only): choose Video, attach 1-start.jpg, then paste:",
      "",
      VEO(s, { joined: false }),
    )
  else lines.push("IN FLOW OR THE GEMINI APP: choose Video (Veo), 16:9, attach 1-start.jpg, then paste:", "", VEO(s))
  lines.push("", "Save the best result in this folder as clip.mp4 (1080p if offered).")
  if (s.portrait)
    lines.push(
      "",
      "THEN THE UPRIGHT ONE, FOR PHONES",
      "Choose 9:16, attach 1-start-portrait.jpg, then paste:",
      "",
      VEO({ ...s, move: s.portraitMove }, { joined: false }),
      "",
      "Save it in this folder as clip-portrait.mp4.",
    )
  lines.push("", "---", "FOLLOW-UPS (paste one if it drifts):", ...FOLLOW_UPS.map((f) => `- ${f}`), "")
  writeFileSync(join(dir, "prompt.txt"), lines.join("\n"))
  console.log(`${String(n + 1).padStart(2)}. ${s.id}${end ? `  -> ${end.id}` : ""}`)
}

const first = ["01-lake", "02-road", "03-arrival", "04-inner-gate", "05-camp", "21-to-the-lake"]
writeFileSync(
  join(DIR, "README.txt"),
  `Digital Farm — the homepage film, clip by clip                                ${new Date().toISOString().slice(0, 10)}

The film is the homepage hero: the lake picture starts to move when someone clicks "Watch film". The camera
turns from the lake onto the road, rises over the gate to show the whole farm, comes down through the inner gate,
walks the courtyard past every place, then flies over the farm from every side and back to the lake (D-070).
One folder per shot, in the film's order. Every shot is a concept (AI-made), never "today".

The pictures are your scene images and the place heroes. A folder with a 2-end.jpg is a joined shot: its clip
ends on the next folder's first picture, so the clips run on into each other like one camera walking.

For each folder:
  1. Flow (labs.google/flow) is best: choose "Frames to Video", 16:9. First frame 1-start.jpg, last frame
     2-end.jpg (when there is one). Paste the prompt from prompt.txt.
     In the Gemini app (one picture only): choose Video, attach 1-start.jpg, paste the second prompt.
  2. Download the best one (1080p if offered) and save it in the same folder as clip.mp4.
  3. If it drifts (the buildings change, a person appears, text appears), paste one FOLLOW-UP and try again.

01-lake matters most: it starts from the homepage picture itself, so the hero seems to come alive. It has a
second, upright version for phones (1-start-portrait.jpg -> clip-portrait.mp4).

Best order: ${first.join(", ")}, then the rest.
Until a clip exists, its shot plays as a slow camera move on its picture, so the film works at every step.

When some are done, say "the film clips are ready": Claude collects them (pnpm site:film) and puts the new
cut on the homepage.

Rules: no recognisable person, no number plates, no text made by the AI. The DIGITAL FARM sign is already in
the pictures; it must stay as it is.
${missing.length ? `\nWaiting for a picture (no folder yet):\n${missing.map((m) => `  ${m}`).join("\n")}\n` : ""}`,
)
console.log(`\n${DIR}${missing.length ? `\nwaiting for a picture:\n  ${missing.join("\n  ")}` : ""}`)
