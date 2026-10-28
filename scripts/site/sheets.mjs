#!/usr/bin/env node
// Numbered contact sheets for a pulled media batch, so the founder can pick by number.
//
//   node scripts/site/sheets.mjs assets/library/whatsapp          # -> assets/sheets/whatsapp/sheet-NN.jpg
//
// Reads <dir>/manifest.jsonl (from wa-pull.py) when present, else every jpg/png/heic/mp4/mov under <dir>.
// Numbers the unique files 1..n in time order, 20 to a sheet (5 x 4, labelled "#n · time · kind"),
// and writes <out>/index.json (number -> file). Videos show their middle frame; audio gets a blank tile.
// Near-duplicates (a re-sent photo that WhatsApp re-encoded) are flagged by a 64-bit difference hash.
import { execFileSync } from "node:child_process"
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { basename, dirname, extname, join, relative } from "node:path"
import { fileURLToPath } from "node:url"
import sharp from "sharp"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..")
const SRC = join(ROOT, process.argv[2] ?? "assets/library/whatsapp")
const OUT = join(ROOT, "assets", "sheets", basename(SRC))
const W = 360, H = 360, LABEL = 28, COLS = 5, ROWS = 4, PER = COLS * ROWS
const STILL = new Set([".jpg", ".jpeg", ".png", ".webp", ".heic"])
const VIDEO = new Set([".mp4", ".mov"])

function list() {
  const manifest = join(SRC, "manifest.jsonl")
  if (existsSync(manifest)) {
    return readFileSync(manifest, "utf8").trim().split("\n").map((l) => JSON.parse(l))
      .filter((r) => !r.dupe_of && !r.error)
      .map((r) => ({ file: join(SRC, r.file), when: r.date, kind: r.type, from: r.from, seconds: r.seconds }))
  }
  const walk = (d) => readdirSync(d).flatMap((n) => (statSync(join(d, n)).isDirectory() ? walk(join(d, n)) : [join(d, n)]))
  return walk(SRC).filter((f) => STILL.has(extname(f).toLowerCase()) || VIDEO.has(extname(f).toLowerCase()))
    .sort().map((file) => ({ file, when: statSync(file).mtime.toISOString(), kind: VIDEO.has(extname(file).toLowerCase()) ? "video" : "image" }))
}

const tmp = mkdtempSync(join(tmpdir(), "sheets-"))
async function tile(item, i) {
  const ext = extname(item.file).toLowerCase()
  let input = null
  if (VIDEO.has(ext)) {
    const frame = join(tmp, `${i}.png`)
    const mid = Math.max(0, (item.seconds ?? 2) / 2)
    execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", String(mid), "-i", item.file, "-frames:v", "1", frame])
    input = frame
  } else if (ext === ".heic") {
    const jpg = join(tmp, `${i}.jpg`)
    execFileSync("sips", ["-s", "format", "jpeg", item.file, "--out", jpg], { stdio: "ignore" })
    input = jpg
  } else if (STILL.has(ext)) input = item.file
  return input
}

// 64-bit difference hash: 9x8 greyscale, one bit per left/right comparison.
async function dhash(input) {
  const px = await sharp(input).rotate().greyscale().resize(9, 8, { fit: "fill" }).raw().toBuffer()
  let h = 0n
  for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) h = (h << 1n) | (px[y * 9 + x] > px[y * 9 + x + 1] ? 1n : 0n)
  return h
}
const hamming = (a, b) => { let x = a ^ b, n = 0; while (x) { n += Number(x & 1n); x >>= 1n } return n }

const items = list()
rmSync(OUT, { recursive: true, force: true })
mkdirSync(OUT, { recursive: true })
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;")
const index = []
const hashes = []
for (let s = 0; s * PER < items.length; s++) {
  const page = items.slice(s * PER, (s + 1) * PER)
  const composites = []
  for (const [j, item] of page.entries()) {
    const n = s * PER + j + 1
    const input = await tile(item, n)
    const left = (j % COLS) * W, top = Math.floor(j / COLS) * (H + LABEL)
    const img = input
      ? await sharp(input).rotate().resize(W, H, { fit: "contain", background: "#ffffff" }).toBuffer()
      : await sharp({ create: { width: W, height: H, channels: 3, background: "#d9d4c7" } }).png().toBuffer()
    composites.push({ input: img, left, top })
    const time = item.when ? item.when.slice(11, 16) : ""
    const label = `#${n} · ${time} · ${item.kind}${item.kind === "video" && item.seconds ? ` ${Math.round(item.seconds)}s` : ""}`
    composites.push({
      input: Buffer.from(`<svg width="${W}" height="${LABEL}"><rect width="100%" height="100%" fill="#2B2A26"/>` +
        `<text x="8" y="19" font-family="Helvetica, Arial, sans-serif" font-size="15" fill="#F7F5EF">${esc(label)}</text></svg>`),
      left, top: top + H,
    })
    index.push({ n, file: relative(ROOT, item.file), kind: item.kind, when: item.when, sheet: s + 1 })
    if (input) hashes.push({ n, h: await dhash(input) })
  }
  const rows = Math.ceil(page.length / COLS)
  await sharp({ create: { width: COLS * W, height: rows * (H + LABEL), channels: 3, background: "#ffffff" } })
    .composite(composites).jpeg({ quality: 80 }).toFile(join(OUT, `sheet-${String(s + 1).padStart(2, "0")}.jpg`))
}
const near = []
for (let i = 0; i < hashes.length; i++)
  for (let j = i + 1; j < hashes.length; j++)
    if (hamming(hashes[i].h, hashes[j].h) <= 6) near.push([hashes[i].n, hashes[j].n])
writeFileSync(join(OUT, "index.json"), JSON.stringify({ source: relative(ROOT, SRC), items: index, near }, null, 1) + "\n")
rmSync(tmp, { recursive: true, force: true })
console.log(`${index.length} items on ${Math.ceil(index.length / PER)} sheets -> ${relative(ROOT, OUT)}; ${near.length} near-duplicate pairs`)
