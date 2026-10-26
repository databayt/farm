#!/usr/bin/env node
// Pull the render references and the "today" stills out of the founder's site footage.
//
//   pnpm site:refs
//
// public/footage holds the phone originals (gitignored, never deployed). The MOVs are 10-bit HLG
// HDR stored rotated, so frames are tone-mapped to BT.709 and turned upright on the GPU
// (VideoToolbox): a plain decode washes the red soil out to tan. HEIC photos go through sips,
// because sharp cannot decode them. sharp then re-encodes everything without metadata (no GPS).
//
//   assets/reference/<render-id>/<nn>-<source>.jpg   attach these when rendering (study/website/render-brief.md)
//   assets/today/<id>.png                            the real halves of the before/after sliders
//   assets/reference/contact-sheet.jpg               every reference on one page, labelled
import { execFileSync } from "node:child_process"
import { existsSync, mkdirSync, mkdtempSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { basename, dirname, extname, join } from "node:path"
import { fileURLToPath } from "node:url"
import sharp from "sharp"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..")
const FOOTAGE = join(ROOT, "public", "footage")
const OUT = join(ROOT, "assets")
// The studio design renders (scripts/studio/render, from studio.glb): the finished exterior and a cutaway.
const STUDIO_EXTERIOR = join(ROOT, "public", "designs", "studio", "render", "studio-exterior.jpg")
const STUDIO_CUTAWAY = join(ROOT, "public", "designs", "studio", "render", "studio-cutaway.jpg")

// Frames named in the render brief. `t` is seconds into a clip; photos and renders have none.
// `crop` takes [left, top, width, height] as fractions of the upright frame.
const REFS = {
  gate: [{ src: "IMG_3159.MOV", t: 0 }, { src: "IMG_3160.MOV", t: 8.9 }],
  parking: [{ src: "IMG_3160.MOV", t: 3 }, { src: "IMG_3160.MOV", t: 0 }],
  road: [{ src: "IMG_3195.MOV", t: 2.3 }, { src: "IMG_3194.MOV", t: 38.3 }],
  "inner-gate": [{ src: "IMG_3159.MOV", t: 0 }, { src: "IMG_3163.MOV", t: 0 }, { src: "IMG_3171.HEIC" }],
  aerial: [
    { src: "IMG_3191.MOV", t: 0 },
    { src: "IMG_3191.MOV", t: 5.6 },
    { src: "IMG_3164 2.HEIC" },
    { src: STUDIO_EXTERIOR },
  ],
  rooms: [{ src: "IMG_3195.MOV", t: 0 }, { src: "IMG_3171.HEIC" }],
  room: [{ src: "IMG_3185.HEIC" }, { src: "IMG_3188.HEIC" }, { src: "IMG_3182.HEIC" }],
  studios: [
    { src: "IMG_3164 2.HEIC" },
    { src: "IMG_3163.MOV", t: 0 },
    { src: "IMG_3196.MOV", t: 29.3 },
    { src: STUDIO_EXTERIOR },
  ],
  studio: [{ src: STUDIO_CUTAWAY }, { src: "IMG_3161.MOV", t: 0 }],
  office: [{ src: "IMG_3188.HEIC" }, { src: STUDIO_CUTAWAY }],
  study: [{ src: "IMG_3195.MOV", t: 0 }, { src: "IMG_3196.MOV", t: 5.9 }],
  classroom: [{ src: STUDIO_CUTAWAY }],
  dusk: [{ src: "IMG_3199.MOV", t: 12.3 }, { src: "IMG_3197.MOV", t: 0 }, { src: "IMG_3200.MOV", t: 23.4 }],
}

// The real halves of the before/after sliders. Each "-planned" render is an edit of exactly
// this frame, so the frame is also copied into that render's reference folder as its base.
const TODAY = {
  "rooms-today": { src: "IMG_3195.MOV", t: 0, crop: [0, 0.078, 1, 0.703], planned: "rooms-planned" }, // 4:5
  "studios-today": { src: "IMG_3164 2.HEIC", planned: "studios-planned" }, // 4:3
  "arrival-today": { src: "IMG_3160.MOV", t: 3, planned: "arrival-planned" }, // 16:9
}

const sh = (cmd, args) => execFileSync(cmd, args, { stdio: ["ignore", "pipe", "pipe"] }).toString().trim()
const tmp = mkdtempSync(join(tmpdir(), "farm-refs-"))

// An upright, tone-mapped PNG of one frame or photo, still carrying metadata (stripped later).
function decode({ src, t }) {
  const path = src.startsWith("/") ? src : join(FOOTAGE, src)
  if (!existsSync(path)) throw new Error(`missing ${path}`)
  const ext = extname(path).toLowerCase()
  if (ext === ".jpg" || ext === ".png") return path
  const out = join(tmp, `${basename(path, extname(path)).replace(/\W+/g, "-")}-${t ?? 0}.png`)
  if (ext === ".heic") {
    sh("sips", ["-s", "format", "png", path, "--out", out])
    return out
  }
  const rotation = Number(
    sh("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream_side_data=rotation",
      "-of", "csv=p=0", path]).replace(/[^-\d]/g, "") || 0,
  )
  const turn = rotation === -90 ? "transpose_vt=dir=clock," : rotation === 90 ? "transpose_vt=dir=cclock," : ""
  sh("ffmpeg", ["-v", "error", "-y", "-display_rotation:v:0", "0", "-hwaccel", "videotoolbox",
    "-hwaccel_output_format", "videotoolbox_vld", "-ss", String(t ?? 0), "-i", path, "-frames:v", "1",
    "-map_metadata", "-1", "-vf",
    `${turn}scale_vt=color_matrix=bt709:color_primaries=bt709:color_transfer=bt709,hwdownload,format=p010le,format=rgb24`,
    out])
  return out
}

// Decode, orient, crop, and drop every metadata block (sharp writes none unless asked).
async function still(ref) {
  const { data, info } = await sharp(decode(ref)).rotate().toBuffer({ resolveWithObject: true })
  if (!ref.crop) return sharp(data)
  const [l, t, w, h] = ref.crop
  return sharp(data).extract({
    left: Math.round(l * info.width),
    top: Math.round(t * info.height),
    width: Math.round(w * info.width),
    height: Math.round(h * info.height),
  })
}

const slug = ({ src, t }) =>
  [basename(src, extname(src)).toLowerCase().replace(/\W+/g, "-"), t !== undefined && `t${t}`].filter(Boolean).join("-")

if (!existsSync(FOOTAGE)) {
  console.error(`No footage at ${FOOTAGE}. Copy the founder's site footage there first.`)
  process.exit(1)
}

const tiles = []
for (const [id, refs] of Object.entries(REFS)) {
  const dir = join(OUT, "reference", id)
  rmSync(dir, { recursive: true, force: true })
  mkdirSync(dir, { recursive: true })
  for (const [i, ref] of refs.entries()) {
    const file = join(dir, `${String(i + 1).padStart(2, "0")}-${slug(ref)}.jpg`)
    await (await still(ref)).jpeg({ quality: 90, mozjpeg: true }).toFile(file)
    tiles.push({ file, label: `${id} · ${basename(file, ".jpg")}` })
  }
}

mkdirSync(join(OUT, "today"), { recursive: true })
for (const [id, ref] of Object.entries(TODAY)) {
  const file = join(OUT, "today", `${id}.png`)
  await (await still(ref)).png().toFile(file)
  const dir = join(OUT, "reference", ref.planned)
  rmSync(dir, { recursive: true, force: true })
  mkdirSync(dir, { recursive: true })
  const base = join(dir, `01-base-${slug(ref)}.jpg`)
  await sharp(file).jpeg({ quality: 95, mozjpeg: true }).toFile(base)
  tiles.push({ file: base, label: `${ref.planned} · base (edit this frame)` })
}

// Contact sheet: 6 labelled tiles a row, so one look confirms the frames and that no one is recognisable.
const W = 320, H = 320, LABEL = 28, COLS = 6
const rows = Math.ceil(tiles.length / COLS)
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;")
const composites = []
for (const [i, { file, label }] of tiles.entries()) {
  const left = (i % COLS) * W, top = Math.floor(i / COLS) * (H + LABEL)
  composites.push({ input: await sharp(file).resize(W, H, { fit: "contain", background: "#ffffff" }).toBuffer(), left, top })
  composites.push({
    input: Buffer.from(`<svg width="${W}" height="${LABEL}"><rect width="100%" height="100%" fill="#2B2A26"/>` +
      `<text x="8" y="19" font-family="Helvetica, Arial, sans-serif" font-size="13" fill="#F7F5EF">${esc(label)}</text></svg>`),
    left, top: top + H,
  })
}
await sharp({ create: { width: COLS * W, height: rows * (H + LABEL), channels: 3, background: "#ffffff" } })
  .composite(composites).jpeg({ quality: 82 }).toFile(join(OUT, "reference", "contact-sheet.jpg"))

rmSync(tmp, { recursive: true, force: true })
console.log(`${tiles.length} references in assets/reference, ${Object.keys(TODAY).length} today stills in assets/today`)
console.log("contact sheet: assets/reference/contact-sheet.jpg")
