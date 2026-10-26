#!/usr/bin/env node
// Turn the homepage's masters into the files the site serves, and the manifest that points at them.
//
//   pnpm site:assets
//
// Inputs (gitignored; see study/website/render-brief.md):
//   assets/renders/<id>.png|jpg|jpeg|webp   concept renders made from the brief
//   assets/renders/<id>.mp4|mov             concept clips made from the brief
//   assets/today/<id>.png|mp4               real stills and clips from the footage (pnpm site:refs)
// plus the studio design renders in public/designs/studio/render. A render replaces the footage
// standing in for it (D-019), and a clip from the footage stays out once its still is rendered.
// Only ids registered in src/components/home/assets.ts are published; anything else is skipped.
//
// Outputs (committed; the build never runs this script):
//   public/site/img/<id>-<w>.webp           every width in src/lib/image-loader.ts, no metadata
//   public/site/img/<clip>-poster-<w>.webp  each clip's first frame, the still it plays over
//   cdn.databayt.org/farm/home/<clip>.mp4   H.264, no audio, faststart, the loop seam crossfaded.
//                                           Video stays out of git and the Worker (the media-guard
//                                           hook): it is encoded into assets/web/video and published
//                                           with media.sh, which needs the CDN's AWS credentials.
//   public/site/og.jpg                      1200×630 share card cut from the opening still
//   src/components/home/assets.generated.ts sizes, sources, blur placeholders and content-hashed URLs
import { execFileSync } from "node:child_process"
import { createHash } from "node:crypto"
import { existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from "node:fs"
import { homedir, tmpdir } from "node:os"
import { basename, dirname, extname, join } from "node:path"
import { fileURLToPath } from "node:url"
import sharp from "sharp"

import { ASSETS, CLIPS } from "../../src/components/home/assets.ts"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..")
const RENDERS = join(ROOT, "assets", "renders")
const TODAY = join(ROOT, "assets", "today")
const OUT_IMG = join(ROOT, "public", "site", "img")
const OUT_VIDEO = join(ROOT, "assets", "web", "video")
const MEDIA_SH = process.env.MEDIA_SH ?? join(homedir(), ".claude", "skills", "edit", "scripts", "media.sh")
const OG = join(ROOT, "public", "site", "og.jpg")
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
const tmp = mkdtempSync(join(tmpdir(), "farm-assets-"))

// media.sh publish puts a clip on a stable CDN key, skips bytes it already holds, checks the URL
// answers 200 with the right type, and returns it with ?v=<sha8> so a new encode is a new URL.
function publish(name, file) {
  if (!existsSync(MEDIA_SH)) throw new Error(`clips publish with media.sh, not found at ${MEDIA_SH}; set MEDIA_SH`)
  const result = JSON.parse(sh(MEDIA_SH, ["publish", "--ns", "farm", "--key", `home/${name}`, "--id", name, file]))
  return result.uploads[0].url
}

// Later sources win: a design render, then a footage stand-in, then a concept render.
function collect(registered, exts) {
  const found = new Map()
  const add = (name, file, source) => {
    if (name in registered) found.set(name, { file, source })
    else console.warn(`skip ${basename(file)}: not a homepage slot in src/components/home/assets.ts`)
  }
  if (exts === IMAGE_EXT) for (const [name, file] of Object.entries(DESIGN)) if (existsSync(file)) add(name, file, "design")
  for (const file of files(TODAY, exts)) add(id(file), file, "today")
  for (const file of files(RENDERS, exts)) add(id(file), file, "render")
  return found
}

// Every width (even past the master's size, so no srcset entry 404s), a 20 px blur placeholder,
// and a URL hashed on the files served, so a new encode is a new URL under the immutable cache.
// .rotate() applies the EXIF orientation before sharp drops the metadata, GPS included. Wider
// files carry more pixels per screen pixel on most displays, so they can take a lower quality.
// A clip's poster takes less again: it sits under a gradient and the film, and the hero's is the
// first image a phone downloads.
async function writeImage(name, input, source, { poster = false } = {}) {
  const { data, info } = await sharp(input).rotate().toBuffer({ resolveWithObject: true })
  const scale = Math.min(1, WIDTHS[WIDTHS.length - 1] / info.width)
  const served = []
  for (const w of WIDTHS) {
    const quality = { 640: 78, 960: 76, 1280: 72, 1920: 68 }[w] - (poster ? 14 : 0)
    const file = await sharp(data).resize({ width: w, withoutEnlargement: true })
      .webp({ quality, effort: 6, smartSubsample: true }).toBuffer()
    writeFileSync(join(OUT_IMG, `${name}-${w}.webp`), file)
    served.push(file)
  }
  const lqip = await sharp(data).resize({ width: 20 }).webp({ quality: 40 }).toBuffer()
  return {
    src: `/site/img/${name}.webp?v=${hash(Buffer.concat(served))}`,
    width: Math.round(info.width * scale),
    height: Math.round(info.height * scale),
    blurDataURL: `data:image/webp;base64,${lqip.toString("base64")}`,
    source,
  }
}

rmSync(OUT_IMG, { recursive: true, force: true })
mkdirSync(OUT_IMG, { recursive: true })
const stills = collect(ASSETS, IMAGE_EXT)
const images = {}
for (const [name, { file, source }] of [...stills].sort(([a], [b]) => a.localeCompare(b))) {
  images[name] = await writeImage(name, file, source)
  console.log(`image ${name} (${source}) ${images[name].width}×${images[name].height}`)
}

rmSync(OUT_VIDEO, { recursive: true, force: true })
rmSync(join(ROOT, "public", "site", "video"), { recursive: true, force: true })
const clips = collect(CLIPS, VIDEO_EXT)
const videos = {}
const posterFrames = {}
for (const [name, { file, source }] of [...clips].sort(([a], [b]) => a.localeCompare(b))) {
  // A stand-in clip would play over the rendered still and contradict it, so the render wins.
  if (source === "today" && stills.get(CLIPS[name].still)?.source === "render") {
    console.log(`clip ${name}: footage left out, ${CLIPS[name].still} is rendered`)
    continue
  }
  mkdirSync(OUT_VIDEO, { recursive: true })
  const [w, h] = sh("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height",
    "-of", "csv=p=0", file]).split(",").map(Number)
  const duration = Number(sh("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file]))
  const portrait = h > w
  const target = portrait ? "scale='min(720,iw)':-2" : "scale='min(1920,iw)':-2"
  // Crossfade the last moment into the first, so the loop has no visible jump. The output starts
  // f seconds into the master, so that frame is the poster.
  const f = Math.min(0.8, duration / 6)
  const graph = `[0:v]split[a][b];[a]trim=start=${f},setpts=PTS-STARTPTS[main];[b]trim=end=${f},setpts=PTS-STARTPTS[head];` +
    `[main][head]xfade=transition=fade:duration=${f}:offset=${(duration - 2 * f).toFixed(3)},${target},format=yuv420p[v]`
  const out = join(OUT_VIDEO, `${name}.mp4`)
  sh("ffmpeg", ["-v", "error", "-y", "-i", file, "-filter_complex", graph, "-map", "[v]", "-an", "-map_metadata", "-1",
    "-c:v", "libx264", "-preset", "slow", "-crf", "26", "-pix_fmt", "yuv420p", "-movflags", "+faststart", out])
  const [ow, oh] = sh("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height",
    "-of", "csv=p=0", out]).split(",").map(Number)
  const frame = join(tmp, `${name}-poster.png`)
  sh("ffmpeg", ["-v", "error", "-y", "-ss", String(f), "-i", file, "-frames:v", "1", frame])
  posterFrames[name] = frame
  videos[name] = {
    src: publish(name, out),
    width: ow,
    height: oh,
    source,
    poster: await writeImage(`${name}-poster`, frame, source, { poster: true }),
  }
  console.log(`video ${name} (${source}) ${ow}×${oh} ${(duration - f).toFixed(1)} s`)
}

// The share card is the opening still: the hero clip's first frame, or the gate when there is no clip.
const opening = posterFrames.hero ?? stills.get("gate")?.file
let og = null
if (opening) {
  const card = await sharp(opening).rotate().resize(1200, 630, { fit: "cover" }).jpeg({ quality: 82, mozjpeg: true })
    .toBuffer()
  mkdirSync(dirname(OG), { recursive: true })
  writeFileSync(OG, card)
  og = `/site/og.jpg?v=${hash(card)}`
} else {
  rmSync(OG, { force: true })
}
rmSync(tmp, { recursive: true, force: true })

writeFileSync(MANIFEST, `// Generated by scripts/site/build-assets.mjs from assets/ and public/designs. Do not edit; run pnpm site:assets.
// Import from Server Components only, so the blur placeholders stay out of client JavaScript.
// source: "render" is a concept render of the plan, "today" a frame of the footage standing in
// for one (D-019), "design" a render from the studio design package.
export type Source = "render" | "today" | "design"
export type SiteImage = { src: string; width: number; height: number; blurDataURL: string; source: Source }
export type SiteVideo = { src: string; width: number; height: number; source: Source; poster: SiteImage }

export const IMAGES: Partial<Record<string, SiteImage>> = ${JSON.stringify(images, null, 2)}

export const VIDEOS: Partial<Record<string, SiteVideo>> = ${JSON.stringify(videos, null, 2)}

export const OG_IMAGE: string | null = ${JSON.stringify(og)}
`)
console.log(`${Object.keys(images).length} images, ${Object.keys(videos).length} videos → src/components/home/assets.generated.ts`)
