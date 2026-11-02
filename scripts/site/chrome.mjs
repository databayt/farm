// Headless Chrome for the three.js pages (scripts/site/render/*.html, scripts/studio/render/*.html): the repo root
// served on a free port, Chrome over the DevTools protocol, and one render at a time (a lock in the temp dir: the Mac
// has 16 GB and other sessions render too). Used by render.mjs (one image) and walk.mjs (the film's previz).
import { spawn } from "node:child_process"
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync } from "node:fs"
import { createServer } from "node:http"
import { tmpdir } from "node:os"
import { extname, join, normalize, resolve } from "node:path"

export const ROOT = resolve(import.meta.dirname, "../..")
export const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
export const TIMEOUT_MS = 240_000

// ------------------------------------------------------------ one render at a time
export const LOCK = join(tmpdir(), "farm-render.lock")
export async function lock() {
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
export function serve() {
  const server = createServer((req, res) => {
    const path = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname))
    const file = join(ROOT, path)
    if (!file.startsWith(ROOT) || !existsSync(file) || statSync(file).isDirectory()) return res.writeHead(404).end()
    res.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream" }).end(readFileSync(file))
  })
  return new Promise((r) => server.listen(0, "127.0.0.1", () => r(server)))
}

// ------------------------------------------------------------ headless Chrome over the DevTools protocol
export function launch() {
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

export function cdp(url) {
  const socket = new WebSocket(url)
  let id = 0
  const pending = new Map()
  const listeners = []
  socket.onmessage = ({ data }) => {
    const msg = JSON.parse(data)
    if (msg.id && pending.has(msg.id)) {
      const { ok, fail } = pending.get(msg.id)
      pending.delete(msg.id)
      if (msg.error) fail(new Error(msg.error.message))
      else ok(msg.result)
    } else for (const l of listeners) l(msg)
  }
  const send = (method, params = {}, sessionId) => new Promise((ok, fail) => {
    pending.set(++id, { ok, fail })
    socket.send(JSON.stringify({ id, method, params, sessionId }))
  })
  return new Promise((r) => (socket.onopen = () => r({ send, on: (l) => listeners.push(l), close: () => socket.close() })))
}

// Opens a page of the repo in a fresh tab at the given size and waits for body[data-ready]. Page errors fail the wait.
export async function openPage(browser, server, page, query = "", { width = 2400, height = 1800 } = {}) {
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
  await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: false })
  const url = `http://127.0.0.1:${server.address().port}/${page.replace(/^\//, "")}${query ? `?${query.replace(/^\?/, "")}` : ""}`
  await send("Page.navigate", { url })
  const evaluate = async (expression) => {
    const { result, exceptionDetails } = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true })
    if (exceptionDetails) throw new Error(exceptionDetails.exception?.description ?? exceptionDetails.text)
    return result.value
  }
  const started = Date.now()
  for (;;) {
    if (errors.length) throw new Error(`the page failed: ${errors.join(" | ")}`)
    if (Date.now() - started > TIMEOUT_MS) throw new Error(`no body[data-ready] after ${TIMEOUT_MS / 1000} s`)
    if (await evaluate("!!(document.body && document.body.dataset.ready)")) break
    await new Promise((r) => setTimeout(r, 500))
  }
  return { send, evaluate, errors }
}

// Stops Chrome, then clears its profile (Chrome writes to it until it has gone).
export async function quit({ chrome, profile }) {
  const gone = new Promise((r) => (chrome.exitCode !== null ? r() : chrome.once("exit", r)))
  chrome.kill()
  await gone
  rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 })
}
