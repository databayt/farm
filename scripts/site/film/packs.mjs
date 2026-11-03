// The founder's folder for the homepage film (D-070): the photos of shots.mjs, numbered in the film's order, and one
// prompt (prompt.txt) to make the film from them in Gemini or Flow (Veo). He saves what he makes in the same folder:
// the whole film as film.mp4, or one clip per photo named by its number (03.mp4); film.mjs collects them. The photos
// are the scene images (assets/film/masters, from film/scenes-pack.mjs) and the place heroes, cut to each shot's
// frame. A rerun rewrites the photos and the prompt and keeps every video.
//   node scripts/site/film/packs.mjs [dir]   (default ~/Desktop/farm-film)
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs"
import { homedir } from "node:os"
import { join } from "node:path"
import sharp from "sharp"

import { ROOT } from "../chrome.mjs"
import { SHOTS } from "./shots.mjs"

const DIR = process.argv[2] ?? join(homedir(), "Desktop", "farm-film")
const isVideo = (f) => /\.(mp4|mov)$/i.test(f)
const number = (i) => String(i + 1).padStart(2, "0")
const slug = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")

// a shot's photo as a JPEG, cut to its frame
async function photo(src, frame, out) {
  let img = sharp(join(ROOT, src)).rotate()
  if (frame) {
    const { width, height } = await sharp(join(ROOT, src)).metadata()
    const [x0, y0, x1, y1] = frame
    img = img.extract({ left: Math.round(width * x0), top: Math.round(height * y0), width: Math.round(width * (x1 - x0)), height: Math.round(height * (y1 - y0)) })
  }
  await img.flatten({ background: "#ffffff" }).jpeg({ quality: 90 }).toFile(out)
}

mkdirSync(DIR, { recursive: true })
for (const f of readdirSync(DIR)) if (!isVideo(f)) rmSync(join(DIR, f), { recursive: true, force: true })
const missing = []
for (const [i, s] of SHOTS.entries()) {
  if (!existsSync(join(ROOT, s.start))) missing.push(`${number(i)} ${s.title}: ${s.start}`)
  else await photo(s.start, s.frame, join(DIR, `${number(i)}-${slug(s.title)}.jpg`))
}

const last = number(SHOTS.length - 1)
const prompt = [
  `Digital Farm: the film                                                       ${new Date().toISOString().slice(0, 10)}`,
  "",
  `Attach the photos in this folder in order, 01 to ${last}, then paste the prompt below.`,
  "Save the film in this folder as film.mp4 (1080p if offered).",
  "",
  "---",
  "",
  "Make a cinematic walkthrough film of Digital Farm, a small farm with guest studios, rooms and a camp near a lake in Gashora, Rwanda. The attached photos are the film's scenes, in order: the camera passes through each one exactly as it looks, so every building, colour, tree and path stays as in the photos.",
  "",
  "One camera on one continuous journey, like a cameraman walking with a gimbal, and a drone for the views from above. Slow, smooth, steady moves; each scene flows into the next with a gentle camera move or a soft dissolve, never a hard jump. Warm late-afternoon light all the way, long soft shadows, a light breeze in the leaves, the grass and the water.",
  "",
  ...SHOTS.map((s, i) => `${number(i)}  ${s.title}: ${s.brief}.`),
  "",
  "No people, no cars, no text or letters added; the DIGITAL FARM sign stays exactly as it is in the photos. Natural sound only: birdsong, a light breeze, distant water; no music, no voices. 16:9.",
  "",
  "---",
  "",
  "If the app takes only some of the photos, or makes one short clip at a time, make it photo by photo: attach one",
  "photo, paste the two paragraphs of the prompt and that photo's line, and save the clip here with the photo's",
  "number (03.mp4 for photo 03). Then say \"the film is ready\": Claude puts it on the homepage hero.",
  "",
  "Every scene is a concept (AI-made), never \"today\". No recognisable person, no number plates, no text made by the AI.",
  "",
].join("\n")
writeFileSync(join(DIR, "prompt.txt"), prompt)
console.log(`${DIR}: ${SHOTS.length - missing.length} photos + prompt.txt`)
if (missing.length) console.log(`waiting for a photo:\n  ${missing.join("\n  ")}`)
