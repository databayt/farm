// The film's previz (D-070): the walk of scripts/site/film/shots.mjs through the homepage's 3D model
// (scripts/site/render/compound.html?walk=1), so every shot's geometry follows the 2D. It writes, into assets/film
// (gitignored, local working space):
//   previz/<shot>/start.jpg, end.jpg   1280 x 720, the founder's layout reference for a shot's Nano Banana still
//   previz.mp4                         a timing animatic of the shots the model can show, 12 fps, 640 x 360
//   scenes/<id>.jpg                    with --scenes: 1920 x 1080 layout references for the scene images
//                                      (film/scenes.mjs: the whole farm's views and the walk)
//   node scripts/site/walk.mjs [--no-animatic] [--scenes] [shot-id …]
// The model has no lake, road or sky: what lies beyond it is a flat pale sky.
import { spawnSync } from "node:child_process"
import { mkdirSync, rmSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import sharp from "sharp"

import { cdp, launch, lock, LOCK, openPage, quit, ROOT, serve } from "./chrome.mjs"
import { SCENES, VIEWS } from "./film/scenes.mjs"
import { SHOTS } from "./film/shots.mjs"

const args = process.argv.slice(2)
const scenes = args.includes("--scenes")
const animatic = !args.includes("--no-animatic") && !scenes
const only = args.filter((a) => !a.startsWith("--"))
const shots = SHOTS.filter((s) => s.cam && (!only.length || only.includes(s.id)))
const OUT = join(ROOT, "assets/film")
const SKY = "#e3e8e6"
const FPS = 12

const ease = (t) => t * t * (3 - 2 * t)
const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t)
const at = ([from, to], t) => {
  const k = ease(t)
  return [mix(from[0], to[0], k), mix(from[1], to[1], k), from[2] + (to[2] - from[2]) * k]
}

async function frame(page, [pos, look, fov], width, height, file, fit = false) {
  const url = await page.evaluate(`window.shoot(${JSON.stringify(pos)}, ${JSON.stringify(look)}, ${fov}, ${fit})`)
  const png = Buffer.from(url.slice(url.indexOf(",") + 1), "base64")
  await sharp(png).resize(width, height).flatten({ background: SKY }).jpeg({ quality: 86, mozjpeg: true }).toFile(file)
}

await lock()
const server = await serve()
const browser$ = launch()
try {
  const browser = await cdp(await browser$.ws)
  // the scene images' layout references, 1920 x 1080
  if (scenes) {
    const page = await openPage(browser, server, "scripts/site/render/compound.html", "mode=real&walk=1&w=1920&h=1080", { width: 1920, height: 1080 })
    const dir = join(OUT, "scenes")
    mkdirSync(dir, { recursive: true })
    for (const s of [...VIEWS, ...SCENES].filter((x) => x.cam && (!only.length || only.includes(x.id)))) {
      await frame(page, s.cam, 1920, 1080, join(dir, `${s.id}.jpg`), !!s.fit)
      console.log(`scenes/${s.id}.jpg`)
    }
  }
  // stills at 1280 x 720
  if (!scenes) {
    const page = await openPage(browser, server, "scripts/site/render/compound.html", "mode=real&walk=1&w=1280&h=720", { width: 1280, height: 720 })
    for (const s of shots) {
      const dir = join(OUT, "previz", s.id)
      mkdirSync(dir, { recursive: true })
      await frame(page, s.cam[0], 1280, 720, join(dir, "start.jpg"))
      await frame(page, s.cam[1], 1280, 720, join(dir, "end.jpg"))
      console.log(`${s.id}: start.jpg, end.jpg`)
    }
  }
  // the animatic at 640 x 360
  if (animatic) {
    const page = await openPage(browser, server, "scripts/site/render/compound.html", "mode=real&walk=1&w=640&h=360", { width: 640, height: 360 })
    const tmp = join(OUT, "previz", "_frames")
    rmSync(tmp, { recursive: true, force: true })
    mkdirSync(tmp, { recursive: true })
    let n = 0
    const started = Date.now()
    for (const s of shots) {
      const count = Math.round(s.seconds * FPS)
      for (let i = 0; i < count; i++) await frame(page, at(s.cam, i / (count - 1)), 640, 360, join(tmp, `${String(n++).padStart(5, "0")}.jpg`))
    }
    const out = join(OUT, "previz.mp4")
    const r = spawnSync("ffmpeg", ["-v", "error", "-y", "-framerate", String(FPS), "-i", join(tmp, "%05d.jpg"),
      "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "23", "-movflags", "+faststart", out], { stdio: "inherit" })
    if (r.status !== 0) throw new Error("ffmpeg failed on the animatic")
    rmSync(tmp, { recursive: true, force: true })
    console.log(`${out}: ${n} frames, ${(n / FPS).toFixed(1)} s, rendered in ${((Date.now() - started) / 1000).toFixed(0)} s`)
  }
  if (!scenes) writeFileSync(join(OUT, "previz", "shots.json"), JSON.stringify(shots.map(({ id, seconds, cam }) => ({ id, seconds, cam })), null, 1) + "\n")
  browser.close()
} finally {
  rmSync(LOCK, { recursive: true, force: true })
  server.close()
  await quit(browser$)
}
