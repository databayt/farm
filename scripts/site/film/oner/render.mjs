#!/usr/bin/env node
// Renders the one-take film (D-074): oner.html in headless Chrome, frame by frame, piped to ffmpeg.
//
//   node scripts/site/film/oner/render.mjs [--form landscape|portrait] [--proxy] [--from s] [--to s]
//   node scripts/site/film/oner/render.mjs --stills 12,40.5,88 [--form …]   one PNG per time, for checking by eye
//
// Writes assets/film/oner/out/<form>[-proxy].mp4 (video only; finish.mjs adds the song and makes the deliverables).
// One render at a time (chrome.mjs's lock): the Mac has 16 GB and other sessions render too.
import { spawn } from "node:child_process"
import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import sharp from "sharp"

import { cdp, launch, lock, LOCK, openPage, quit, ROOT, serve } from "../../chrome.mjs"
import { FPS, LENGTH } from "./legs.mjs"

const arg = (name, d) => {
  const i = process.argv.indexOf(`--${name}`)
  return i < 0 ? d : process.argv[i + 1]
}
const FORM = arg("form", "landscape")
const PROXY = process.argv.includes("--proxy")
const STILLS = arg("stills", null)
const SPEED = process.argv.includes("--speed") // the camera's speed on every frame, from the cameras (no pixels)
const SIZE = FORM === "portrait" ? (PROXY ? [540, 1166] : [1080, 2332]) : PROXY ? [960, 536] : [1920, 1072]
const STEP = PROXY ? 2 : 1
const OUT = join(ROOT, "assets", "film", "oner", "out")
mkdirSync(OUT, { recursive: true })

// the hero's own picture, exactly as the page serves it (film.mjs's heroStill), for the film's first and last frames
for (const [key, still, w, h] of [["01", "public/site/hero/desktop-1920.webp", 1920, 1072], ["01p", "public/site/hero/mobile-1920.webp", 1080, 2332]]) {
  const dir = join(ROOT, "assets", "film", "oner", "scenes", key)
  await sharp(join(ROOT, still)).rotate().resize(w, h, { fit: "cover", kernel: "lanczos3" }).png().toFile(join(dir, "photo.png"))
  const meta = JSON.parse(readFileSync(join(dir, "meta.json"), "utf8"))
  writeFileSync(join(dir, "meta.json"), JSON.stringify({ ...meta, photo: "photo.png", width: w, height: h }) + "\n")
}

await lock()
const server = await serve()
const browser$ = launch()
let ffmpeg = null
try {
  const browser = await cdp(await browser$.ws)
  const [w, h] = SIZE
  const page = await openPage(browser, server, "scripts/site/film/oner/oner.html", `form=${FORM}&w=${w}&h=${h}`, { width: w, height: h })
  console.log(`renderer: ${await page.evaluate("window.RENDERER")}`)
  const shot = async (n) => {
    const on = await page.evaluate(`window.frame(${n})`)
    // the cuts go through PNG (lossless, RGB); the quick proxy through JPEG
    const { data } = await page.send("Page.captureScreenshot", { format: STILLS || !PROXY ? "png" : "jpeg", quality: 95, captureBeyondViewport: false })
    return { on, buf: Buffer.from(data, "base64") }
  }
  if (SPEED) {
    const prof = await page.evaluate("window.speedProfile(1)")
    const csv = join(OUT, `speed-${FORM}.csv`)
    writeFileSync(csv, "t,speed\n" + prof.map(([t, v]) => `${t.toFixed(3)},${v === null ? "" : v.toFixed(5)}`).join("\n") + "\n")
    // between the hero's still opening and its final settle, the frame must always be moving
    const inner = prof.filter(([t, v]) => v !== null && t > 2.0 && t < LENGTH - 2.2) // the hero's still opening, and its landing at the end
    const sorted = inner.map(([, v]) => v).sort((a, b) => a - b)
    const q = (f) => sorted[Math.floor(f * (sorted.length - 1))]
    const FLOOR = Number(arg("floor", 0.03))
    const slow = []
    for (const [t, v] of inner) {
      if (v >= FLOOR) continue
      const last = slow[slow.length - 1]
      if (last && t - last[1] < 0.1) { last[1] = t; last[2] = Math.min(last[2], v) } else slow.push([t, t, v])
    }
    console.log(`speed (frame heights a second): min ${q(0).toFixed(3)}  p10 ${q(0.1).toFixed(3)}  median ${q(0.5).toFixed(3)}  p90 ${q(0.9).toFixed(3)}  max ${q(1).toFixed(3)}`)
    console.log(slow.length ? `FAIL  steady: below ${FLOOR} at ` + slow.map(([a, b, v]) => `${a.toFixed(1)}–${b.toFixed(1)}s (${v.toFixed(3)})`).join(", ") : `PASS  steady: never below ${FLOOR}`)
    console.log(csv)
  } else if (STILLS) {
    for (const t of STILLS.split(",").map(Number)) {
      const { on, buf } = await shot(Math.round(t * FPS))
      const file = join(OUT, `still-${FORM}-${t.toFixed(2)}.png`)
      writeFileSync(file, buf)
      console.log(`${t.toFixed(2)} s  ${on}  ${file}`)
    }
  } else {
    const from = Math.round(Number(arg("from", 0)) * FPS)
    const to = Math.min(Math.round(LENGTH * FPS), Math.round(Number(arg("to", LENGTH)) * FPS))
    const file = join(OUT, `${FORM}${PROXY ? "-proxy" : ""}${arg("from", null) ? `-${arg("from")}-${arg("to")}` : ""}.mp4`)
    // RGB (or the proxy's full-range BT.601 JPEG) into BT.709 studio range, converted, not only tagged
    const into = PROXY ? "scale=in_color_matrix=bt601:in_range=full:out_color_matrix=bt709:out_range=tv,format=yuv420p" : "scale=out_color_matrix=bt709:out_range=tv,format=yuv420p"
    ffmpeg = spawn("ffmpeg", ["-v", "error", "-y", "-f", "image2pipe", "-framerate", String(FPS / STEP), "-c:v", PROXY ? "mjpeg" : "png", "-i", "-",
      "-vf", into, "-c:v", "libx264", "-preset", PROXY ? "veryfast" : "slow", "-crf", PROXY ? "20" : "12", "-pix_fmt", "yuv420p",
      "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-color_range", "tv", "-movflags", "+faststart", file],
      { stdio: ["pipe", "inherit", "inherit"] })
    const done = new Promise((ok, fail) => ffmpeg.on("exit", (c) => (c === 0 ? ok() : fail(new Error(`ffmpeg exited ${c}`)))))
    const started = Date.now()
    for (let n = from; n < to; n += STEP) {
      const { buf } = await shot(n)
      if (!ffmpeg.stdin.write(buf)) await new Promise((r) => ffmpeg.stdin.once("drain", r))
      if ((n - from) % (FPS * 10) === 0) {
        const done = (n - from) / (to - from)
        const el = (Date.now() - started) / 1000
        console.log(`${(n / FPS).toFixed(1)} s  ${(done * 100).toFixed(0)}%  ${el.toFixed(0)} s in, ~${done > 0 ? ((el / done) * (1 - done)).toFixed(0) : "?"} s left`)
      }
    }
    ffmpeg.stdin.end()
    await done
    console.log(`${file}  ${((Date.now() - started) / 1000).toFixed(0)} s`)
  }
} finally {
  if (ffmpeg && ffmpeg.exitCode === null) ffmpeg.kill()
  server.close()
  await quit(browser$)
  ;(await import("node:fs")).rmSync(LOCK, { recursive: true, force: true })
}
