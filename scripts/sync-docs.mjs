#!/usr/bin/env node
// Generate content/docs/*.mdx from the study, so the site renders the study as docs.
//
//   node scripts/sync-docs.mjs          # regenerate content/docs
//
// study/**/*.md and the CSV registers stay the source of truth; content/docs is
// derived (never edit it by hand). Each page gets frontmatter from its H1 and
// status line, MDX-unsafe characters are escaped outside code, links between
// study files become /docs links, and the registers become tables.
//
// Directives (a line on its own, so the study stays readable on GitHub):
//   ![Caption](../../public/designs/x.svg)       -> <Figure> (drawing on a white sheet)
//   [Title](../../public/designs/x/studio.glb)   -> <StudioViewer> (needs parts.json + studio-poster.svg beside it)
//   [Table: Title](../../public/designs/x.csv)   -> a Markdown table plus a download link
// Other links into public/ become /designs/... downloads; a missing file fails the sync.
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { basename, dirname, join, relative, resolve, sep } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const OUT = join(ROOT, "content", "docs")
const PUBLIC = join(ROOT, "public")

// Sidebar order. A string starting with "---" is a group label (fumadocs separator).
const PAGES = [
  { slug: "index", src: "PROJECT_STATUS.md", title: "Overview", description: "Where the farm study stands: what is done, what we know, and the questions for the founder." },
  "---Research---",
  { slug: "preliminary-report", src: "study/research/preliminary-report.md" },
  { slug: "location", src: "study/research/location.md" },
  { slug: "market", src: "study/research/rwanda-agriculture-market.md" },
  { slug: "crops", src: "study/research/crop-market-research.md" },
  { slug: "livestock", src: "study/research/livestock-market-research.md" },
  { slug: "buyers", src: "study/research/buyer-database.md" },
  { slug: "regulations", src: "study/research/regulations.md" },
  "---Sourcing---",
  { slug: "plant-suppliers", src: "study/research/plant-and-seed-suppliers.md" },
  { slug: "livestock-suppliers", src: "study/research/livestock-suppliers.md" },
  "---Discovery---",
  { slug: "questionnaire", src: "study/discovery/farm-questionnaire.md" },
  { slug: "site-inspection", src: "study/discovery/site-inspection-checklist.md", description: "One structured site visit that turns the farm from an unknown into a measured baseline." },
  { slug: "soil-water", src: "study/discovery/soil-water-testing-plan.md" },
  { slug: "zoning", src: "study/discovery/zoning-concept.md" },
  "---Feasibility---",
  { slug: "decision-matrix", src: "study/feasibility/decision-matrix.md" },
  { slug: "financial-model", src: "study/feasibility/financial-model-notes.md" },
  { slug: "risk-register", src: "study/feasibility/risk-register.md" },
  "---Farm design---",
  { slug: "integrated-design", src: "study/design/integrated-farm-design.md" },
  { slug: "crop-plan", src: "study/design/crop-plan.md" },
  { slug: "livestock-plan", src: "study/design/livestock-plan.md" },
  { slug: "feed-and-pasture", src: "study/design/feed-and-pasture-plan.md" },
  { slug: "water-and-soil", src: "study/design/water-and-soil-plan.md" },
  "---Engineering---",
  { slug: "technology-strategy", src: "study/engineering/technology-strategy.md" },
  { slug: "electrical-system", src: "study/engineering/electrical-system.md" },
  { slug: "irrigation-automation", src: "study/engineering/irrigation-automation.md" },
  { slug: "iot-architecture", src: "study/engineering/iot-architecture.md" },
  { slug: "software-architecture", src: "study/engineering/software-architecture.md" },
  { slug: "commissioning", src: "study/engineering/commissioning-plan.md" },
  "---Container studios---",
  { slug: "studio", src: "study/studio/studio.md" },
  { slug: "studio-site", src: "study/studio/studio-site.md" },
  { slug: "studio-design", src: "study/studio/studio-design.md" },
  { slug: "studio-envelope", src: "study/studio/studio-envelope.md" },
  { slug: "studio-roof", src: "study/studio/studio-roof.md" },
  { slug: "studio-flatpack", src: "study/studio/studio-flatpack.md" },
  { slug: "studio-kits", src: "study/studio/studio-kits.md" },
  { slug: "studio-electrical", src: "study/studio/studio-electrical.md" },
  { slug: "studio-plumbing", src: "study/studio/studio-plumbing.md" },
  { slug: "studio-sourcing", src: "study/studio/studio-sourcing.md" },
  { slug: "studio-fabrication", src: "study/studio/studio-fabrication.md" },
  { slug: "studio-assembly", src: "study/studio/studio-assembly.md" },
  { slug: "studio-bom", src: "study/studio/studio-bom.md" },
  { slug: "studio-budget", src: "study/studio/studio-budget.md" },
  { slug: "studio-permits", src: "study/studio/studio-permits.md" },
  {
    slug: "studio-cut-list", csv: "public/designs/studio/data/cut-list.csv", title: "Studio cut list",
    description: "Every sheet part of one studio: size, material, edge banding and machining counts.",
    columns: ["id", "name", "material", "length_mm", "width_mm", "thickness_mm", "edges", "step"],
  },
  {
    slug: "studio-bom-table", csv: "public/designs/studio/data/bom.csv", title: "Studio bill of materials",
    description: "Every line of one studio's bill of materials, with the price label and source.",
    columns: ["kit", "category", "item", "qty_per_unit", "unit", "unit_price_rwf", "label", "source", "total_per_unit_rwf"],
  },
  "---Go to market---",
  { slug: "buyer-strategy", src: "study/go-to-market/buyer-strategy.md" },
  { slug: "sales-plan", src: "study/go-to-market/sales-plan.md" },
  { slug: "outreach-templates", src: "study/go-to-market/outreach-templates.md" },
  { slug: "brand", src: "study/brand/brand.md" },
  "---Investment---",
  { slug: "financing-strategy", src: "study/investment/financing-strategy.md" },
  { slug: "pitch-deck", src: "study/investment/pitch-deck.md" },
  { slug: "speaker-notes", src: "study/investment/speaker-notes.md" },
  { slug: "one-pager", src: "study/investment/executive-one-pager.md" },
  "---Website---",
  { slug: "website-sitemap", src: "study/website/sitemap.md" },
  { slug: "website-copy", src: "study/website/website-copy.md" },
  { slug: "website-plan", src: "study/website/implementation-plan.md" },
  { slug: "website-render-brief", src: "study/website/render-brief.md" },
  "---Execution---",
  { slug: "first-90-days", src: "study/execution/first-90-days.md" },
  { slug: "five-year-roadmap", src: "study/execution/five-year-roadmap.md" },
  { slug: "decision-log", src: "study/execution/decision-log.md" },
  "---Operations---",
  { slug: "sops", src: "study/operations/standard-operating-procedures.md" },
  { slug: "livestock-management", src: "study/operations/livestock-management.md" },
  { slug: "crop-management", src: "study/operations/crop-management.md" },
  { slug: "maintenance", src: "study/operations/maintenance.md" },
  { slug: "recordkeeping", src: "study/operations/recordkeeping.md" },
  "---Registers---",
  { slug: "assumptions", src: "study/registers/assumptions.md", description: "The assumptions that shape the study and the model, with how each will be validated." },
  {
    slug: "register-sources", csv: "study/registers/sources.csv", title: "Sources register",
    description: "Every source cited in the study, with its organization, date and reliability grade.",
    columns: ["id", "claim", "organization", "url", "published", "reliability"],
  },
  {
    slug: "register-prices", csv: "study/registers/prices.csv", title: "Prices register",
    description: "Observed prices in RWF with unit, price type, market, date, source and evidence label.",
    columns: ["id", "product", "unit", "price_rwf", "price_type", "market_location", "observed", "source_id", "label"],
  },
  {
    slug: "register-suppliers", csv: "study/registers/suppliers.csv", title: "Suppliers register",
    description: "Plant, seed, input and livestock supplier leads from public information. A listing is not confirmed stock.",
    columns: ["id", "name", "category", "location", "offerings", "url", "verified"],
  },
  {
    slug: "register-buyers", csv: "study/registers/buyers.csv", title: "Buyers register",
    description: "Kigali buyer prospects from public information. Every row is a prospect, not a customer.",
    columns: ["id", "name", "category", "location", "buys", "direct_from_farms", "url"],
  },
]

const entries = PAGES.filter((p) => typeof p !== "string")
const toPosix = (p) => p.split(sep).join("/")
const slugByPath = new Map(entries.map((p) => [p.src ?? p.csv, p.slug]))

/** Resolve a link target written in a study file to an absolute path. */
const resolveTarget = (src, target) => resolve(ROOT, dirname(src), decodeURI(target))

/** /designs/... URL for a file under public/, or null; a missing file is an error. */
function publicUrl(abs, where) {
  if (!abs.startsWith(PUBLIC + sep)) return null
  if (!existsSync(abs)) throw new Error(`${where}: missing file ${toPosix(relative(ROOT, abs))}`)
  return "/" + toPosix(relative(PUBLIC, abs))
}

const attr = (v) => `{${JSON.stringify(v)}}`

/** RFC 4180 CSV → array of objects keyed by the header row. */
function parseCsv(text) {
  const rows = []
  let row = [], field = "", quoted = false
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { field += '"'; i++ }
      else if (ch === '"') quoted = false
      else field += ch
    } else if (ch === '"') quoted = true
    else if (ch === ",") { row.push(field); field = "" }
    else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++
      row.push(field); field = ""
      if (row.some((c) => c !== "")) rows.push(row)
      row = []
    } else field += ch
  }
  if (field || row.length) { row.push(field); rows.push(row) }
  const [header, ...body] = rows
  return body.map((r) => Object.fromEntries(header.map((h, i) => [h.trim(), (r[i] ?? "").trim()])))
}

/** Escape characters MDX would parse as JSX or expressions, outside inline code. */
function escapeProse(line) {
  return line
    .split(/(`[^`]*`)/)
    .map((part) =>
      part.startsWith("`") ? part : part.replace(/</g, "&lt;").replace(/\{/g, "&#123;").replace(/\}/g, "&#125;")
    )
    .join("")
}

/** Links to other study files become /docs links, links into public/ become downloads, others become code. */
function rewriteLinks(line, src) {
  return line.replace(/(!?)\[([^\]]+)\]\(([^)\s]+)\)/g, (match, bang, text, target) => {
    if (bang) throw new Error(`${src}: put images on their own line (${target})`)
    if (/^(https?:|mailto:|#)/.test(target)) return match
    const [path, hash] = target.split("#")
    const abs = resolveTarget(src, path)
    const slug = slugByPath.get(toPosix(relative(ROOT, abs)))
    if (slug) return `[${text}](/docs${slug === "index" ? "" : `/${slug}`}${hash ? `#${hash}` : ""})`
    const url = publicUrl(abs, src)
    if (url) return `[${text}](${url})`
    return text.includes("`") ? text : `\`${text}\``
  })
}

const yaml = (s) => JSON.stringify(s)

function csvCell(key, value) {
  const v = (value ?? "").replace(/\s+/g, " ").replace(/\|/g, "\\|")
  if (key === "url" && /^https?:\/\//.test(v)) {
    const host = new URL(v).hostname.replace(/^www\./, "")
    return `[${host}](${v})`
  }
  return escapeProse(v)
}

function csvTable(rows, columns) {
  return [
    `| ${columns.join(" | ")} |`,
    `| ${columns.map(() => "---").join(" | ")} |`,
    ...rows.map((r) => `| ${columns.map((c) => csvCell(c, r[c])).join(" | ")} |`),
  ].join("\n")
}

/** A directive line becomes JSX or a table; anything else returns null. */
function blockDirective(line, src) {
  let mm = line.match(/^\s*!\[([^\]]*)\]\(([^)\s]+)\)\s*$/)
  if (mm) {
    const abs = resolveTarget(src, mm[2])
    const url = publicUrl(abs, src)
    if (!url || !/\.(svg|png|jpe?g|webp)$/i.test(url)) throw new Error(`${src}: images must be files under public/ (${mm[2]})`)
    let size = ""
    if (url.endsWith(".svg")) {
      const vb = readFileSync(abs, "utf8").match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/)
      if (vb) size = ` width={${Math.round(vb[1] * 4)}} height={${Math.round(vb[2] * 4)}}`
    }
    return `<Figure src=${attr(url)} caption=${attr(mm[1])}${size} />`
  }
  mm = line.match(/^\s*\[Table:\s*([^\]]+)\]\(([^)\s]+\.csv)\)\s*$/)
  if (mm) {
    const abs = resolveTarget(src, mm[2])
    const url = publicUrl(abs, src)
    if (!existsSync(abs)) throw new Error(`${src}: missing table ${mm[2]}`)
    const rows = parseCsv(readFileSync(abs, "utf8"))
    const columns = rows.length ? Object.keys(rows[0]) : []
    const where = url ? `[download CSV](${url})` : `source \`${toPosix(relative(ROOT, abs))}\``
    return `**${escapeProse(mm[1])}** · ${where}\n\n${csvTable(rows, columns)}`
  }
  mm = line.match(/^\s*\[([^\]]+)\]\(([^)\s]+\.glb)\)\s*$/)
  if (mm) {
    const abs = resolveTarget(src, mm[2])
    const url = publicUrl(abs, src)
    const dir = dirname(abs)
    const parts = publicUrl(join(dir, "parts.json"), src)
    const poster = publicUrl(join(dir, "studio-poster.svg"), src)
    return `<StudioViewer src=${attr(url)} parts=${attr(parts)} poster=${attr(poster)} title=${attr(mm[1])} />`
  }
  return null
}

const isDirective = (l) => /^\s*!\[[^\]]*\]\([^)]+\)\s*$/.test(l) || /^\s*\[(Table:[^\]]*|[^\]]+)\]\([^)\s]+\.(csv|glb)\)\s*$/.test(l)

function fromMarkdown({ src, title, description: fixed }) {
  const lines = readFileSync(join(ROOT, src), "utf8").split("\n")
  const h1 = lines.findIndex((l) => l.startsWith("# "))
  const heading = h1 >= 0 ? lines[h1].slice(2).trim() : basename(src, ".md")
  const body = lines.slice(h1 + 1)
  const meta = /^(\s*[-*]\s+)?(\*\*)?(Status|Researched|Location dependency|Updated|Created|File|Inputs|Date|Spending rule|Purpose|Labels|Evidence labels)\b/
  const status = body.find((l) => /^(Status|Updated):/.test(l))
  const firstText = body.find((l) => l.trim() && !meta.test(l) && !isDirective(l) && !/^(#|\||>|```|---)/.test(l.trim()))
  const sentence = firstText?.replace(/^\s*([-*]|\d+\.)\s+/, "").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
  const description = fixed ?? (sentence ?? status ?? heading)
    .replace(/[*_`]/g, "").replace(/\s+/g, " ").trim()
    .replace(/^(.{0,180}?[.!?])\s.*$/, "$1").slice(0, 200)
  let inFence = false
  const out = body.map((line) => {
    if (/^\s*(```|~~~)/.test(line)) { inFence = !inFence; return line }
    if (inFence) return line
    const block = blockDirective(line, src)
    return block !== null ? `\n${block}\n` : escapeProse(rewriteLinks(line, src))
  })
  return `---\ntitle: ${yaml(title ?? heading)}\ndescription: ${yaml(description)}\n---\n\n` +
    `{/* Generated by scripts/sync-docs.mjs from ${src}. Edit the source, not this file. */}\n` +
    out.join("\n").replace(/^\n+/, "\n")
}

function fromCsv({ csv, title, description, columns }) {
  const rows = parseCsv(readFileSync(join(ROOT, csv), "utf8"))
  const url = publicUrl(join(ROOT, csv), csv)
  const file = url ? `[\`${csv}\`](${url})` : `\`${csv}\``
  return `---\ntitle: ${yaml(title)}\ndescription: ${yaml(description)}\n---\n\n` +
    `{/* Generated by scripts/sync-docs.mjs from ${csv}. Edit the source, not this file. */}\n\n` +
    `${rows.length} rows · source file ${file} (all columns there; selected columns here).\n\n${csvTable(rows, columns)}\n`
}

rmSync(OUT, { recursive: true, force: true })
mkdirSync(OUT, { recursive: true })
for (const page of entries) {
  writeFileSync(join(OUT, `${page.slug}.mdx`), page.csv ? fromCsv(page) : fromMarkdown(page))
}
const pages = PAGES.map((p) => (typeof p === "string" ? p : p.slug))
writeFileSync(join(OUT, "meta.json"), JSON.stringify({ title: "Farm study", pages }, null, 2) + "\n")
console.log(`synced ${entries.length} pages to content/docs`)
