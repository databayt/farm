// Renders one of the three.js pages (scripts/site/render/*.html, scripts/studio/render/*.html) to an image, as
// their headers say: serve the repo root, open the page in headless Chrome, wait for body[data-ready], save the
// data URL in #out. One render at a time (a lock in the temp dir): the Mac has 16 GB and other sessions render too.
//   node scripts/site/render.mjs scripts/site/render/office.html "mode=line" public/designs/office/render/office-line.png
// .png keeps the page's PNG as it is (and its transparency); .webp and .jpg are encoded with sharp. A fourth
// argument saves the page's window.TAGS (each tagged point's spot in the frame) with the image's aspect, as JSON,
// for a tagged figure.
import { mkdirSync, rmSync, statSync, writeFileSync } from "node:fs"
import { dirname, extname, resolve } from "node:path"
import sharp from "sharp"

import { cdp, launch, lock, LOCK, serve, TIMEOUT_MS } from "./chrome.mjs"

const [page, query = "", out, tagsOut] = process.argv.slice(2)
if (!page || !out) {
  console.error('usage: node scripts/site/render.mjs <page.html> "<query>" <out.png|webp|jpg>')
  process.exit(2)
}
await lock()
const server = await serve()
const { chrome, profile, ws } = launch()
try {
  const browser = await cdp(await ws)
  const { targetId } = await browser.send("Target.createTarget", { url: "about:blank" })
  const { sessionId } = await browser.send("Target.attachToTarget", { targetId, flatten: true })
  const send = (m, p) => browser.send(m, p, sessionId)
  const errors = []
  browser.on((msg) => {
    if (msg.sessionId !== sessionId) return
    if (msg.method === "Runtime.exceptionThrown") errors.push(msg.params.exceptionDetails.exception?.description ?? msg.params.exceptionDetails.text)
    if (msg.method === "Runtime.consoleAPICalled" && msg.params.type === "error") errors.push(msg.params.args.map((a) => a.value ?? a.description).join(" "))
  })
  await send("Runtime.enable")
  await send("Emulation.setDeviceMetricsOverride", { width: 2400, height: 1800, deviceScaleFactor: 1, mobile: false })
  const url = `http://127.0.0.1:${server.address().port}/${page.replace(/^\//, "")}${query ? `?${query.replace(/^\?/, "")}` : ""}`
  await send("Page.navigate", { url })
  const started = Date.now()
  let data = null
  while (!data) {
    if (errors.length) throw new Error(`the page failed: ${errors.join(" | ")}`)
    if (Date.now() - started > TIMEOUT_MS) throw new Error(`no body[data-ready] after ${TIMEOUT_MS / 1000} s`)
    await new Promise((r) => setTimeout(r, 500))
    const { result } = await send("Runtime.evaluate", {
      expression: "document.body && document.body.dataset.ready ? document.getElementById('out').src : null", returnByValue: true })
    data = result.value
  }
  const tags = tagsOut
    ? JSON.parse((await send("Runtime.evaluate", { expression: "JSON.stringify(window.TAGS ?? null)", returnByValue: true })).result.value)
    : null
  if (tagsOut && !tags) throw new Error("the page set no window.TAGS")
  const png = Buffer.from(data.slice(data.indexOf(",") + 1), "base64")
  mkdirSync(dirname(resolve(out)), { recursive: true })
  const ext = extname(out).toLowerCase()
  if (ext === ".png") writeFileSync(out, await sharp(png).png({ compressionLevel: 9, adaptiveFiltering: true }).toBuffer())
  else if (ext === ".webp") await sharp(png).webp({ quality: 80 }).toFile(out)
  else if (ext === ".jpg" || ext === ".jpeg") await sharp(png).flatten({ background: "#ffffff" }).jpeg({ quality: 82, mozjpeg: true }).toFile(out)
  else throw new Error(`unknown output type ${ext}`)
  const meta = await sharp(out).metadata()
  if (tags) writeFileSync(tagsOut, JSON.stringify({ aspect: meta.width / meta.height, tags }, null, 1) + "\n")
  console.log(`${out}  ${meta.width} x ${meta.height}  ${Math.round(statSync(out).size / 1024)} kB  ${((Date.now() - started) / 1000).toFixed(1)} s`)
  browser.close()
} finally {
  rmSync(LOCK, { recursive: true, force: true })
  server.close()
  // Chrome writes to its profile until it has gone, so wait for it before clearing the profile
  const gone = new Promise((r) => (chrome.exitCode !== null ? r() : chrome.once("exit", r)))
  chrome.kill()
  await gone
  rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 })
}
