#!/usr/bin/env node
// The homepage film (D-070): the cut of scripts/site/film/shots.mjs, which the hero plays in place when someone
// clicks "Watch film" (src/components/home/watch-film.tsx).
//
//   pnpm site:film [--no-publish]
//
// Inputs (gitignored), the founder's videos in ~/Desktop/farm-film (packs.mjs), copied into assets/film/clips:
//   film.mp4                       the whole film, made from all the photos: it plays between the opening and the close
//   03.mp4, 03-upright.mp4 …       or one clip per photo, by its number (an upright one for phones, if made)
//   assets/film/music.(mp3|m4a|wav)  an optional music bed with a free licence
// Without the whole film, each shot plays its clip where one exists, and a slow push on its photo where none does (the
// founder's scene images in assets/film/masters, or a place's hero); a shot with neither is left out, so the film
// works at every step and each clip swaps in with no code change.
//
// The film opens and closes on the hero's own picture, resized exactly as scripts/site/hero.mjs serves it, and is cut
// at the hero's aspect (1920 x 1072 wide; 1080 x 2332 upright, the mobile picture's shape), so the hero's object-cover
// crops both alike and the picture starts to move with no visible jump. Colour goes through BT.709 and is tagged so.
//
// Outputs:
//   assets/film/film.mp4, film-portrait.mp4    H.264, faststart (video stays out of git and the Worker), copied into
//                                              ~/Desktop/farm-film as digital-farm-film(-phone).mp4
//   cdn.databayt.org/farm/home/film.mp4 …      published with media.sh, which needs the CDN's AWS credentials
//   src/components/home/film.generated.ts      the URLs (content-hashed), sizes and which shots are clips
import { execFileSync } from "node:child_process"
import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs"
import { homedir } from "node:os"
import { join } from "node:path"
import sharp from "sharp"

import { ROOT } from "../chrome.mjs"
import { DISSOLVE, SHOTS } from "./shots.mjs"

const PUBLISH = !process.argv.includes("--no-publish")
const FPS = 24
const OPEN = { hold: 1.1, fade: 0.5 } // the hero's picture, still, then into the first shot
const CLOSE = { fade: 1.2, hold: 2.0 } // back to the picture at the end
const FORMS = {
  // still: the hero's picture as the page serves it (scripts/site/hero.mjs), so the film's first frame is what the
  // reader is looking at when they click, compression and all
  // rate: the most a second may take, so the film streams on a phone's connection (it loads only from the button)
  landscape: { size: [1920, 1072], up: 3, still: "public/site/hero/desktop-1920.webp", crf: 28, rate: 3 },
  portrait: { size: [1080, 2332], up: 2, still: "public/site/hero/mobile-1920.webp", crf: 30, rate: 2.5 },
}
const DESK = join(homedir(), "Desktop", "farm-film")
const FILM = join(ROOT, "assets", "film")
const WORK = join(FILM, "cut")
const MEDIA_SH = process.env.MEDIA_SH ?? join(homedir(), ".claude", "skills", "edit", "scripts", "media.sh")
const MANIFEST = join(ROOT, "src", "components", "home", "film.generated.ts")
const BT709 = ["-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-color_range", "tv"]

const run = (args) => execFileSync("ffmpeg", ["-v", "error", "-y", ...args], { stdio: ["ignore", "inherit", "inherit"] })
const probe = (file, entries) =>
  execFileSync("ffprobe", ["-v", "error", ...entries, "-of", "json", file]).toString()
const hasAudio = (file) => JSON.parse(probe(file, ["-select_streams", "a", "-show_entries", "stream=index"])).streams?.length > 0

// ------------------------------------------------------------ the founder's videos, collected
mkdirSync(join(FILM, "clips"), { recursive: true })
const newer = (from, to) => existsSync(from) && (!existsSync(to) || statSync(from).mtimeMs > statSync(to).mtimeMs)
const collect = (name, to) => {
  if (!newer(join(DESK, name), join(FILM, "clips", to))) return
  copyFileSync(join(DESK, name), join(FILM, "clips", to))
  console.log(`collected ${name}`)
}
const videos = existsSync(DESK) ? readdirSync(DESK).filter((f) => /\.(mp4|mov)$/i.test(f)) : []
const whole = videos.find((f) => /^film\.(mp4|mov)$/i.test(f))
if (whole) collect(whole, "film.mp4")
for (const [i, s] of SHOTS.entries()) {
  const n = String(i + 1).padStart(2, "0")
  const mine = videos.filter((f) => new RegExp(`^${n}([-_ .]|$)`).test(f))
  const up = mine.find((f) => /upright|portrait/i.test(f))
  const wide = mine.find((f) => f !== up)
  if (wide) collect(wide, `${s.id}.mp4`)
  if (up) collect(up, `${s.id}-portrait.mp4`)
}
const WHOLE = whole ? join(FILM, "clips", "film.mp4") : null
const clipOf = (s, form) => {
  const own = join(FILM, "clips", `${s.id}${form === "portrait" ? "-portrait" : ""}.mp4`)
  if (existsSync(own)) return own
  const wide = join(FILM, "clips", `${s.id}.mp4`)
  return existsSync(wide) ? wide : null // an upright cut crops the wide clip
}
const stillOf = (s, form) => {
  const own = join(ROOT, form === "portrait" && s.portrait ? s.portrait : s.start)
  return existsSync(own) ? own : null // a scene image not made yet (or not on this machine): the shot waits
}

// ------------------------------------------------------------ one segment per shot
// The hero's picture as the page serves it, at the film's size.
async function heroStill(form, out) {
  const { size: [w, h], still } = FORMS[form]
  await sharp(join(ROOT, still)).rotate().resize(w, h, { fit: "cover", kernel: "lanczos3" }).png().toFile(out)
  return out
}
function hold(png, seconds, out) {
  run(["-loop", "1", "-framerate", String(FPS), "-i", png, "-t", seconds.toFixed(3),
    "-vf", "scale=out_color_matrix=bt709:out_range=tv,format=yuv444p", "-c:v", "libx264", "-crf", "10", "-preset", "fast", ...BT709, "-an", out])
}
// The part of a picture a shot uses (frame), then the film's shape cut from it, centred at px across (an upright cut
// takes a narrow slice of a wide picture: px says which).
const crop = (W, H, frame, px = 0.5) =>
  (frame ? `crop=iw*${frame[2] - frame[0]}:ih*${frame[3] - frame[1]}:iw*${frame[0]}:ih*${frame[1]},` : "") +
  `scale=${W}:${H}:force_original_aspect_ratio=increase:flags=lanczos,crop=${W}:${H}:'max(0,min(iw-ow,${px}*iw-ow/2))':'(ih-oh)/2'`
// A slow push on a still, smooth because zoompan works on a copy several times the film's size.
function push(file, seconds, [from, to], form, out, { frame, px } = {}) {
  const { size: [w, h], up } = FORMS[form]
  const [W, H] = [w * up, h * up]
  const n = Math.round(seconds * FPS)
  const p = `(on/${n - 1})`
  const lerp = (a, b) => `(${a}+(${b}-${a})*${p})`
  const z = lerp(from[0], to[0])
  const x = `max(0\\,min(iw-iw/zoom\\,${lerp(from[1], to[1])}*iw-iw/zoom/2))`
  const y = `max(0\\,min(ih-ih/zoom\\,${lerp(from[2], to[2])}*ih-ih/zoom/2))`
  run(["-i", file, "-vf",
    `${crop(W, H, frame, form === "portrait" ? px : 0.5)},` +
      `zoompan=z='${z}':x='${x}':y='${y}':d=${n}:s=${w}x${h}:fps=${FPS},` +
      "scale=out_color_matrix=bt709:out_range=tv,format=yuv444p",
    "-frames:v", String(n), "-c:v", "libx264", "-crf", "10", "-preset", "fast", ...BT709, "-an", out])
}
// A clip: its first seconds, at the film's frame rate and size (cover), held on its last frame if it runs short.
function clip(file, seconds, form, out, px = 0.5) {
  const { size: [w, h] } = FORMS[form]
  run(["-i", file, "-vf",
    `fps=${FPS},${crop(w, h, null, form === "portrait" ? px : 0.5)},setsar=1,` +
      `tpad=stop_mode=clone:stop_duration=${seconds},format=yuv444p`,
    "-t", seconds.toFixed(3), "-c:v", "libx264", "-crf", "10", "-preset", "fast", ...BT709, "-an", out])
}
// Each segment's sound: the clip's own (Veo's ambience), or silence, at the same length.
function sound(file, seconds, out) {
  if (file && hasAudio(file)) run(["-i", file, "-vn", "-af", `apad,atrim=0:${seconds},aresample=48000`, "-ac", "2", out])
  else run(["-f", "lavfi", "-i", "anullsrc=r=48000:cl=stereo", "-t", seconds.toFixed(3), out])
}

// ------------------------------------------------------------ the cut
async function cut(form) {
  const dir = join(WORK, form)
  rmSync(dir, { recursive: true, force: true })
  mkdirSync(dir, { recursive: true })
  const still = await heroStill(form, join(dir, "hero.png"))
  const parts = [] // { video, audio, seconds, fade (into this part) }
  const add = (name, seconds, fade, make, audioFrom) => {
    const video = join(dir, `${name}.mp4`)
    const audio = join(dir, `${name}.wav`)
    make(video)
    sound(audioFrom, seconds, audio) // cheap, so made even when the film turns out silent
    parts.push({ name, video, audio, seconds, fade, from: audioFrom ? "clip" : "still", audioFrom })
  }
  add("00-open", OPEN.hold, 0, (o) => hold(still, OPEN.hold, o), null)
  const used = []
  // the founder's whole film, made from all the photos, plays in full between the opening and the close
  if (WHOLE) {
    const len = Number(JSON.parse(probe(WHOLE, ["-show_entries", "format=duration"])).format.duration)
    add("film", len, OPEN.fade, (o) => clip(WHOLE, len, form, o), WHOLE)
    used.push({ id: "film", source: "clip" })
  }
  for (const s of WHOLE ? [] : SHOTS) {
    const c = clipOf(s, form)
    const f = c ? null : stillOf(s, form)
    if (!c && !f) continue
    const fade = parts.length === 1 ? OPEN.fade : DISSOLVE
    // the first shot's start is the hero's master, so its push opens on the picture the film fades from; an upright
    // clip of its own is already upright (px only places a slice of a wide one)
    const own = form === "portrait" && c?.endsWith("-portrait.mp4")
    if (c) add(s.id, s.seconds, fade, (o) => clip(c, s.seconds, form, o, own ? 0.5 : (s.px ?? 0.5)), c)
    else add(s.id, s.seconds, fade, (o) => push(f, s.seconds, s.push, form, o, { frame: f === join(ROOT, s.start) ? s.frame : null, px: s.px }), null)
    used.push({ id: s.id, source: c ? "clip" : "still" })
  }
  add("99-close", CLOSE.hold, CLOSE.fade, (o) => hold(still, CLOSE.hold, o), null)

  // join with dissolves: each fade starts where the film so far ends, less the fade; the sound (when any shot has
  // some, or there is music) crossfades in step
  const music = ["mp3", "m4a", "wav"].map((e) => join(FILM, `music.${e}`)).find(existsSync)
  const anySound = parts.some((p) => p.from === "clip" && hasAudio(p.audioFrom)) || !!music
  const inputs = parts.flatMap((p) => ["-i", p.video])
  const audios = anySound ? parts.flatMap((p) => ["-i", p.audio]) : []
  let v = "[0:v]", a = `[${parts.length}:a]`, length = parts[0].seconds
  const graph = []
  for (let i = 1; i < parts.length; i++) {
    const { fade, seconds } = parts[i]
    graph.push(`${v}[${i}:v]xfade=transition=fade:duration=${fade}:offset=${(length - fade).toFixed(3)}[v${i}]`)
    if (anySound) graph.push(`${a}[${parts.length + i}:a]acrossfade=d=${fade}:c1=tri:c2=tri[a${i}]`)
    v = `[v${i}]`
    a = `[a${i}]`
    length += seconds - fade
  }
  const audioArgs = []
  if (anySound) {
    if (music) {
      graph.push(`[${2 * parts.length}:a]aloop=loop=-1:size=2e9,atrim=0:${length.toFixed(3)},volume=0.35,afade=t=out:st=${(length - 3).toFixed(3)}:d=3[m]`)
      graph.push(`${a}[m]amix=inputs=2:duration=first:normalize=0[mix]`)
      a = "[mix]"
    }
    graph.push(`${a}loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000[aout]`)
    audioArgs.push("-map", "[aout]", "-c:a", "aac", "-b:a", "160k")
  }
  // the frames carry BT.709 all the way, so the browser draws them in the colours of the picture underneath
  graph.push(`${v}setparams=colorspace=bt709:color_primaries=bt709:color_trc=bt709:range=tv[vout]`)
  const { crf, rate } = FORMS[form]
  const out = join(FILM, form === "portrait" ? "film-portrait.mp4" : "film.mp4")
  // the opening frames near-lossless, so the swap from the picture to the film shows nothing (the buffer holds six
  // seconds at the cap, so the first frame can take what it needs: at twice, frame 0 drifted to 4.9/255 upright)
  const opening = Math.round(OPEN.hold * FPS)
  run([...inputs, ...audios, ...(music ? ["-i", music] : []), "-filter_complex", graph.join(";"),
    "-map", "[vout]", "-c:v", "libx264", "-preset", "slow", "-crf", String(crf), "-maxrate", `${rate}M`, "-bufsize", `${rate * 6}M`,
    "-x264-params", `zones=0,${opening},q=12`,
    "-profile:v", "high", "-pix_fmt", "yuv420p", "-g", String(FPS * 2), ...BT709, ...audioArgs, "-movflags", "+faststart", out])
  const [w, h] = FORMS[form].size
  console.log(`${form}: ${out}  ${w}×${h}  ${length.toFixed(1)} s  ${(statSync(out).size / 1e6).toFixed(1)} MB  sound: ${anySound ? "yes" : "none"}`)
  return { out, width: w, height: h, seconds: Number(length.toFixed(2)), bytes: statSync(out).size, sound: !!anySound, used }
}

const made = {}
for (const form of Object.keys(FORMS)) made[form] = await cut(form)
// a copy of the cut in the founder's folder, beside the photos it is made from (named so it is never collected as his)
if (existsSync(DESK)) {
  copyFileSync(made.landscape.out, join(DESK, "digital-farm-film.mp4"))
  copyFileSync(made.portrait.out, join(DESK, "digital-farm-film-phone.mp4"))
}

// ------------------------------------------------------------ publish + the manifest
const url = (form) => {
  const { out } = made[form]
  if (!PUBLISH) return `/__film/${form === "portrait" ? "film-portrait" : "film"}.mp4` // dev only: never committed
  if (!existsSync(MEDIA_SH)) throw new Error(`the film publishes with media.sh, not found at ${MEDIA_SH}; set MEDIA_SH`)
  const key = form === "portrait" ? "film-portrait" : "film"
  const result = JSON.parse(execFileSync(MEDIA_SH, ["publish", "--ns", "farm", "--key", `home/${key}`, "--id", key, out]).toString().trim())
  return result.uploads[0].url
}
const manifest = {}
for (const form of Object.keys(made)) {
  const { width, height, seconds, bytes, sound: hasSound } = made[form]
  manifest[form] = { src: url(form), width, height, seconds, bytes, sound: hasSound }
}
manifest.shots = made.landscape.used
writeFileSync(
  MANIFEST,
  `// Generated by scripts/site/film/film.mjs (pnpm site:film). Do not edit.\n` +
    `export const FILM = ${JSON.stringify(manifest, null, 2)} as const\n`,
)
console.log(`${MANIFEST}: ${manifest.shots.filter((s) => s.source === "clip").length} clips, ${manifest.shots.filter((s) => s.source === "still").length} stills${PUBLISH ? "" : " (not published)"}`)
