#!/usr/bin/env node
// Print docs pages to A4 PDFs with headless Chrome, from a static build.
//
//   node scripts/print-docs.mjs en/studio rw/studio/electric             # -> assets/guides/studio-plan.pdf, studio-electric-rw.pdf
//   node scripts/print-docs.mjs --site <out dir> --publish en/studio     # also copy to public/guides/
//
// A page is named by its docs path, its language first: en/studio is /en/docs/studio, the studio's execution plan
// (a place folder's index), and prints as studio-plan.pdf; rw/studio/electric is /rw/docs/studio/electric and prints
// as studio-electric-rw.pdf, the names the guides link to (D-059).
// Serves the export (default: out/, from `pnpm build:cf`) on a spare port and prints <lang>/docs/<path>.html.
// The page's print CSS hides the header, nav and pager; guide figures load eagerly. Publish only at a
// revision: once public/guides/<name>.pdf exists, sync-docs turns the guide's "print" line into a link.
import { execFileSync, spawn } from "node:child_process"
import { copyFileSync, existsSync, mkdirSync, statSync } from "node:fs"
import { createServer } from "node:net"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
const LANGS = ["en", "rw"]
const args = process.argv.slice(2)
const flag = (name) => { const i = args.indexOf(name); return i < 0 ? null : args.splice(i, 2)[1] }
const site = resolve(flag("--site") ?? join(ROOT, "out"))
const publish = args.includes("--publish") && args.splice(args.indexOf("--publish"), 1)
const pages = args
if (!pages.length) throw new Error("name at least one docs path, e.g. en/studio or rw/studio/electric")
if (!existsSync(CHROME)) throw new Error(`Chrome not found at ${CHROME}`)

// en/studio -> studio-plan, rw/studio/electric -> studio-electric-rw: a place folder's index (content/docs/en/<place>/
// index.mdx, from sync-docs) is its execution plan; any other page keeps its path
function pdfName(lang, path) {
  const index = existsSync(join(ROOT, "content", "docs", "en", ...path, "index.mdx"))
  return [...path, ...(index ? ["plan"] : [])].join("-") + (lang === "en" ? "" : `-${lang}`)
}

const port = await new Promise((ok) => { const s = createServer().listen(0, () => { const p = s.address().port; s.close(() => ok(p)) }) })
const server = spawn("python3", ["-m", "http.server", String(port), "-d", site, "--bind", "127.0.0.1"], { stdio: "ignore" })
await new Promise((ok) => setTimeout(ok, 800))
try {
  mkdirSync(join(ROOT, "assets", "guides"), { recursive: true })
  for (const page of pages) {
    const [lang, ...path] = page.split("/").filter(Boolean)
    if (!LANGS.includes(lang) || !path.length) throw new Error(`${page}: name a docs path as <${LANGS.join("|")}>/<page>`)
    const url = `${lang}/docs/${path.join("/")}.html`
    if (!existsSync(join(site, url))) throw new Error(`${site}/${url}: not built`)
    const name = pdfName(lang, path)
    const pdf = join(ROOT, "assets", "guides", `${name}.pdf`)
    // a blank page prints to about 1 KB: Chrome sometimes prints before the page has loaded, so it tries again
    for (let tries = 1; ; tries++) {
      execFileSync(CHROME, ["--headless=new", "--disable-gpu", "--no-pdf-header-footer", "--virtual-time-budget=15000",
        `--print-to-pdf=${pdf}`, `http://127.0.0.1:${port}/${url}`], { stdio: "ignore", timeout: 180_000 })
      if (statSync(pdf).size >= 10_000) break
      if (tries === 3) throw new Error(`${page}: printed blank three times`)
    }
    console.log(`${page}: ${(statSync(pdf).size / 1024).toFixed(0)} KB -> ${pdf.slice(ROOT.length + 1)}`)
    if (publish) {
      mkdirSync(join(ROOT, "public", "guides"), { recursive: true })
      copyFileSync(pdf, join(ROOT, "public", "guides", `${name}.pdf`))
      console.log(`  published public/guides/${name}.pdf`)
    }
  }
} finally {
  server.kill()
}
