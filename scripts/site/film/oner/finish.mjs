#!/usr/bin/env node
// The one-take film's last step (D-074): the song under the picture, and the files.
//
//   node scripts/site/film/oner/finish.mjs
//
// Reads assets/film/oner/out/{landscape,portrait}.mp4 (render.mjs: picture only, near-lossless) and the song,
// assets/film/oner/music/track.mp3 (173.09 s, the length of the film). Writes:
//   assets/film/oner/out/film-landscape.mp4, film-portrait.mp4   the masters with sound (film.mjs --oner encodes them
//                                                                 for the homepage and publishes them)
//   ~/Desktop/farm-film/digital-farm-film.mp4                     the founder's copy, wide, with sound (one file, kept
//                                                                 in place: a new cut overwrites it)
// The song is levelled to -16 LUFS (-1.5 dBTP) and lets its last word down over 1.2 s, as the film settles on the hero.
import { execFileSync } from "node:child_process"
import { existsSync, statSync } from "node:fs"
import { homedir } from "node:os"
import { join } from "node:path"

import { ROOT } from "../../chrome.mjs"
import { LENGTH } from "./legs.mjs"

const OUT = join(ROOT, "assets", "film", "oner", "out")
const SONG = join(ROOT, "assets", "film", "oner", "music", "track.mp3")
const DESK = join(homedir(), "Desktop", "farm-film", "digital-farm-film.mp4")
const BT709 = ["-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-color_range", "tv"]
const run = (args) => execFileSync("ffmpeg", ["-v", "error", "-y", ...args], { stdio: ["ignore", "inherit", "inherit"] })

for (const f of [SONG, join(OUT, "landscape.mp4")]) if (!existsSync(f)) throw new Error(`missing ${f}`)
// the song to the end of its singing, its last word let down over 1.2 s (the instrumental comes in loud just after)
const audio = ["-af", `atrim=0:${LENGTH},afade=t=out:st=${(LENGTH - 1.2).toFixed(2)}:d=1.2,loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000`, "-c:a", "aac", "-b:a", "192k"]

for (const form of ["landscape", "portrait"]) {
  const pic = join(OUT, `${form}.mp4`)
  if (!existsSync(pic)) { console.log(`${form}: not rendered, skipped`); continue }
  const out = join(OUT, `film-${form}.mp4`)
  run(["-i", pic, "-i", SONG, "-map", "0:v", "-map", "1:a", "-c:v", "copy", ...audio, "-t", String(LENGTH), "-movflags", "+faststart", out])
  console.log(`${out}  ${(statSync(out).size / 1e6).toFixed(1)} MB`)
}
// the founder's copy: the wide cut, at a size that plays anywhere and still looks like the master
run(["-i", join(OUT, "film-landscape.mp4"), "-map", "0", "-c:v", "libx264", "-preset", "slow", "-crf", "20", "-maxrate", "8M", "-bufsize", "16M",
  "-pix_fmt", "yuv420p", "-profile:v", "high", ...BT709, "-c:a", "copy", "-movflags", "+faststart", DESK])
console.log(`${DESK}  ${(statSync(DESK).size / 1e6).toFixed(1)} MB`)
