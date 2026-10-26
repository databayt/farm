#!/usr/bin/env node
// Turn the homepage's masters into the files the site serves, and the manifest that points at them.
//
//   pnpm site:assets
//
// Inputs (gitignored; see study/website/render-brief.md):
//   assets/renders/<id>.png|jpg|jpeg|webp   concept renders made from the brief
//   assets/renders/<id>.mp4|mov             concept clips made from the brief
//   assets/today/<id>.png                   real stills from the footage (pnpm site:refs)
// plus the studio design renders in public/designs/studio/render.
//
// Outputs (committed; the build never runs this script):
//   public/site/img/<id>-<w>.webp           every width in src/lib/image-loader.ts, no metadata
//   public/site/video/<id>.mp4              H.264, no audio, faststart, the loop seam crossfaded
//   public/site/og.jpg                      1200×630 share card cut from the gate render
//   src/components/home/assets.generated.ts sizes, blur placeholders and content-hashed URLs
import { execFileSync } from "node:child_process"
import { createHash } from "node:crypto"
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs"
import { basename, dirname, extname, join } from "node:path"
import { fileURLToPath } from "node:url"
import sharp from "sharp"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..")
const RENDERS = join(ROOT, "assets", "renders")
const TODAY = join(ROOT, "assets", "today")
const OUT_IMG = join(ROOT, "public", "site", "img")
const OUT_VIDEO = join(ROOT, "public", "site", "video")
const MANIFEST = join(ROOT, "src", "components", "home", "assets.generated.ts")

// Keep in step with WIDTHS in src/lib/image-loader.ts and images.deviceSizes in next.config.ts.
const WIDTHS = [640, 960, 1280, 1920]
const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg", ".webp"])
const VIDEO_EXT = new Set([".mp4", ".mov"])
const DESIGN = {
  "studio-exterior": join(ROOT, "public", "designs", "studio", "render", "studio-exterior.jpg"),
  "studio-cutaway": join(ROOT, "public", "designs", "studio", "render", "studio-cutaway.jpg"),
}

const files = (dir, exts) =>
  existsSync(dir) ? readdirSync(dir).filter((f) => exts.has(extname(f).toLowerCase())).map((f) => join(dir, f)) : []
const id = (file) => basename(file, extname(file))
const hash = (buf) => createHash("sha1").update(buf).digest("hex").slice(0, 8)
const sh = (cmd, args) => execFileSync(cmd, args, { stdio: ["ignore", "pipe", "pipe"] }).toString().trim()

const sources = new Map()
for (const [name, file] of Object.entries(DESIGN)) if (existsSync(file)) sources.set(name, file)
for (const file of files(TODAY, IMAGE_EXT)) sources.set(id(file), file)
for (const file of files(RENDERS, IMAGE_EXT)) sources.set(id(file), file)

rmSync(OUT_IMG, { recursive: true, force: true })
mkdirSync(OUT_IMG, { recursive: true })
const images = {}
for (const [name, file] of [...sources].sort(([a], [b]) => a.localeCompare(b))) {
  // .rotate() applies the EXIF orientation before sharp drops the metadata (GPS included).
  const { data, info } = await sharp(file).rotate().toBuffer({ resolveWithObject: true })
  const scale = Math.min(1, WIDTHS[WIDTHS.length - 1] / info.width)
  for (const w of WIDTHS) {
    // Every width is written, even past the master's size, so no srcset entry 404s.
    // Wider files carry more pixels per screen pixel on most displays, so they can take a lower quality.
    const quality = { 640: 78, 960: 76, 1280: 72, 1920: 68 }[w]
    await sharp(data).resize({ width: w, withoutEnlargement: true }).webp({ quality, effort: 6, smartSubsample: true })
      .toFile(join(OUT_IMG, `${name}-${w}.webp`))
  }
  const lqip = await sharp(data).resize({ width: 20 }).webp({ quality: 40 }).toBuffer()
  images[name] = {
    src: `/site/img/${name}.webp?v=${hash(data)}`,
    width: Math.round(info.width * scale),
    height: Math.round(info.height * scale),
    blurDataURL: `data:image/webp;base64,${lqip.toString("base64")}`,
  }
  console.log(`image ${name} ${info.width}×${info.height}`)
}

let og = null
if (sources.has("gate")) {
  const card = await sharp(sources.get("gate")).rotate().resize(1200, 630, { fit: "cover" }).jpeg({ quality: 82, mozjpeg: true })
    .toBuffer()
  mkdirSync(dirname(join(ROOT, "public", "site", "og.jpg")), { recursive: true })
  writeFileSync(join(ROOT, "public", "site", "og.jpg"), card)
  og = `/site/og.jpg?v=${hash(card)}`
} else {
  rmSync(join(ROOT, "public", "site", "og.jpg"), { force: true })
}

rmSync(OUT_VIDEO, { recursive: true, force: true })
const videos = {}
for (const file of files(RENDERS, VIDEO_EXT).sort()) {
  mkdirSync(OUT_VIDEO, { recursive: true })
  const name = id(file)
  const [w, h] = sh("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height",
    "-of", "csv=p=0", file]).split(",").map(Number)
  const duration = Number(sh("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file]))
  const portrait = h > w
  const target = portrait ? "scale='min(720,iw)':-2" : "scale='min(1920,iw)':-2"
  // Crossfade the last moment into the first, so the loop has no visible jump.
  const f = Math.min(0.8, duration / 6)
  const graph = `[0:v]split[a][b];[a]trim=start=${f},setpts=PTS-STARTPTS[main];[b]trim=end=${f},setpts=PTS-STARTPTS[head];` +
    `[main][head]xfade=transition=fade:duration=${f}:offset=${(duration - 2 * f).toFixed(3)},${target},format=yuv420p[v]`
  const out = join(OUT_VIDEO, `${name}.mp4`)
  sh("ffmpeg", ["-v", "error", "-y", "-i", file, "-filter_complex", graph, "-map", "[v]", "-an", "-map_metadata", "-1",
    "-c:v", "libx264", "-preset", "slow", "-crf", "26", "-pix_fmt", "yuv420p", "-movflags", "+faststart", out])
  const [ow, oh] = sh("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height",
    "-of", "csv=p=0", out]).split(",").map(Number)
  videos[name] = { src: `/site/video/${name}.mp4?v=${hash(readFileSync(out))}`, width: ow, height: oh }
  console.log(`video ${name} ${ow}×${oh} ${(duration - f).toFixed(1)} s`)
}

writeFileSync(MANIFEST, `// Generated by scripts/site/build-assets.mjs from assets/ and public/designs. Do not edit; run pnpm site:assets.
// Import from Server Components only, so the blur placeholders stay out of client JavaScript.
export type SiteImage = { src: string; width: number; height: number; blurDataURL: string }
export type SiteVideo = { src: string; width: number; height: number }

export const IMAGES: Partial<Record<string, SiteImage>> = ${JSON.stringify(images, null, 2)}

export const VIDEOS: Partial<Record<string, SiteVideo>> = ${JSON.stringify(videos, null, 2)}

export const OG_IMAGE: string | null = ${JSON.stringify(og)}
`)
console.log(`${Object.keys(images).length} images, ${Object.keys(videos).length} videos → src/components/home/assets.generated.ts`)
