#!/usr/bin/env node
// Print docs pages to A4 PDFs with headless Chrome, from a static build.
//
//   node scripts/print-docs.mjs carpenter carpenter-rw              # -> assets/guides/<slug>.pdf
//   node scripts/print-docs.mjs --site <out dir> --publish carpenter # also copy to public/guides/
//
// Serves the export (default: out/, from `pnpm build:cf`) on a spare port and prints /docs/<slug>.html.
// The page's print CSS hides the header, nav and pager; guide figures load eagerly. Publish only at a
// revision: once public/guides/<slug>.pdf exists, sync-docs turns the guide's "print" line into a link.
import { execFileSync, spawn } from "node:child_process"
import { copyFileSync, existsSync, mkdirSync, statSync } from "node:fs"
import { createServer } from "node:net"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
const args = process.argv.slice(2)
const flag = (name) => { const i = args.indexOf(name); return i < 0 ? null : args.splice(i, 2)[1] }
const site = resolve(flag("--site") ?? join(ROOT, "out"))
const publish = args.includes("--publish") && args.splice(args.indexOf("--publish"), 1)
const slugs = args
if (!slugs.length) throw new Error("name at least one docs slug")
if (!existsSync(CHROME)) throw new Error(`Chrome not found at ${CHROME}`)

const port = await new Promise((ok) => { const s = createServer().listen(0, () => { const p = s.address().port; s.close(() => ok(p)) }) })
const server = spawn("python3", ["-m", "http.server", String(port), "-d", site, "--bind", "127.0.0.1"], { stdio: "ignore" })
await new Promise((ok) => setTimeout(ok, 800))
try {
  mkdirSync(join(ROOT, "assets", "guides"), { recursive: true })
  for (const slug of slugs) {
    if (!existsSync(join(site, "docs", `${slug}.html`))) throw new Error(`${site}/docs/${slug}.html: not built`)
    const pdf = join(ROOT, "assets", "guides", `${slug}.pdf`)
    execFileSync(CHROME, ["--headless=new", "--disable-gpu", "--no-pdf-header-footer", "--virtual-time-budget=15000",
      `--print-to-pdf=${pdf}`, `http://127.0.0.1:${port}/docs/${slug}.html`], { stdio: "ignore", timeout: 180_000 })
    console.log(`${slug}: ${(statSync(pdf).size / 1024).toFixed(0)} KB -> ${pdf.slice(ROOT.length + 1)}`)
    if (publish) {
      mkdirSync(join(ROOT, "public", "guides"), { recursive: true })
      copyFileSync(pdf, join(ROOT, "public", "guides", `${slug}.pdf`))
      console.log(`  published public/guides/${slug}.pdf`)
    }
  }
} finally {
  server.kill()
}
