// Renders one of the three.js pages (scripts/site/render/*.html, scripts/studio/render/*.html) to an image, as
// their headers say: serve the repo root, open the page in headless Chrome, wait for body[data-ready], save the
// data URL in #out. One render at a time (a lock in the temp dir): the Mac has 16 GB and other sessions render too.
//   node scripts/site/render.mjs scripts/site/render/office.html "mode=line" public/designs/office/render/office-line.png
// .png keeps the page's PNG as it is (and its transparency); .webp and .jpg are encoded with sharp. A fourth
// argument saves the page's window.TAGS (each tagged point's spot in the frame) with the image's aspect, as JSON,
// for a tagged figure.
import { spawn } from "node:child_process"
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs"
import { createServer } from "node:http"
import { tmpdir } from "node:os"
import { dirname, extname, join, normalize, resolve } from "node:path"
import sharp from "sharp"

const [page, query = "", out, tagsOut] = process.argv.slice(2)
if (!page || !out) {
  console.error('usage: node scripts/site/render.mjs <page.html> "<query>" <out.png|webp|jpg>')
  process.exit(2)
}
const ROOT = resolve(import.meta.dirname, "../..")
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
const TIMEOUT_MS = 240_000

// ------------------------------------------------------------ one render at a time
const LOCK = join(tmpdir(), "farm-render.lock")
async function lock() {
  for (let waited = 0; ; waited += 1000) {
    try {
      mkdirSync(LOCK)
      return
    } catch {
      if (Date.now() - statSync(LOCK, { throwIfNoEntry: false })?.mtimeMs > 10 * 60_000) rmSync(LOCK, { recursive: true, force: true })
      if (waited % 30_000 === 0) console.error("waiting for another render to finish…")
      await new Promise((r) => setTimeout(r, 1000))
    }
  }
}

// ------------------------------------------------------------ the repo root, served
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".json": "application/json",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".svg": "image/svg+xml",
  ".glb": "model/gltf-binary", ".hdr": "application/octet-stream", ".wasm": "application/wasm", ".csv": "text/csv" }
function serve() {
  const server = createServer((req, res) => {
    const path = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname))
    const file = join(ROOT, path)
    if (!file.startsWith(ROOT) || !existsSync(file) || statSync(file).isDirectory()) return res.writeHead(404).end()
    res.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream" }).end(readFileSync(file))
  })
  return new Promise((r) => server.listen(0, "127.0.0.1", () => r(server)))
}

// ------------------------------------------------------------ headless Chrome over the DevTools protocol
function launch() {
  const profile = mkdtempSync(join(tmpdir(), "farm-render-"))
  const chrome = spawn(CHROME, ["--headless=new", "--remote-debugging-port=0", `--user-data-dir=${profile}`,
    "--no-first-run", "--no-default-browser-check", "--hide-scrollbars", "--enable-unsafe-swiftshader",
    "--window-size=2400,1800", "about:blank"], { stdio: ["ignore", "ignore", "pipe"] })
  const ws = new Promise((ok, fail) => {
    let log = ""
    chrome.stderr.on("data", (d) => {
      log += d
      const m = log.match(/DevTools listening on (ws:\/\/\S+)/)
      if (m) ok(m[1])
    })
    chrome.on("exit", (code) => fail(new Error(`Chrome exited (${code}): ${log.slice(-400)}`)))
  })
  return { chrome, profile, ws }
}

function cdp(url) {
  const socket = new WebSocket(url)
  let id = 0
  const pending = new Map()
  const listeners = []
  socket.onmessage = ({ data }) => {
    const msg = JSON.parse(data)
    if (msg.id && pending.has(msg.id)) {
      const { ok, fail } = pending.get(msg.id)
      pending.delete(msg.id)
      msg.error ? fail(new Error(msg.error.message)) : ok(msg.result)
    } else for (const l of listeners) l(msg)
  }
  const send = (method, params = {}, sessionId) => new Promise((ok, fail) => {
    pending.set(++id, { ok, fail })
    socket.send(JSON.stringify({ id, method, params, sessionId }))
  })
  return new Promise((r) => (socket.onopen = () => r({ send, on: (l) => listeners.push(l), close: () => socket.close() })))
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
