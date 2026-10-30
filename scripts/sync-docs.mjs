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
// A PAGES entry with `sections` instead of `src` is a page of the studio's React sections
// (src/components/studio/docs-sections.tsx, registered in src/mdx-components.tsx): each [heading, component]
// becomes an MDX heading, so the table of contents lists it, then the component, which reads the generator's CSVs.
// Other links into public/ become /designs/... downloads; a missing file fails the sync, except a printed
// guide (public/guides/*.pdf), which stays plain text until scripts/print-docs.mjs has made it.
//
// guide/ holds the maintained execution guides. In them:
//   {{studio.l}}  a value from public/designs/studio/data/dims.json (the studio generator), {{site.*}} from
//                 public/designs/site/site-dims.json (scripts/site/master-plan.mjs); unknown keys fail
//   X.rw.md       beside X.md becomes <slug>-rw, the Kinyarwanda twin: rendered, linked, kept out of the
//                 sidebar, and checked against the English for the same sections, steps, numbers and links
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { basename, dirname, join, relative, resolve, sep } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const OUT = join(ROOT, "content", "docs")
const PUBLIC = join(ROOT, "public")

// Every docs page, grouped by kind ("---" lines are labels for the reader of this file). The sidebar
// shows only SIDEBAR, below; the rest render off the sidebar, like the Kinyarwanda twins.
const PAGES = [
  { slug: "index", src: "guide/start.md", title: "Start here" },
  "---Trades---",
  { slug: "carpenter", src: "guide/trades/carpenter.md" },
  { slug: "electrician", src: "guide/trades/electrician.md" },
  { slug: "plumber", src: "guide/trades/plumber.md" },
  { slug: "power", src: "guide/trades/power.md" },
  "---Grow---",
  { slug: "vegetables", src: "guide/grow/vegetables.md" },
  { slug: "livestock", src: "guide/grow/livestock.md" },
  "---The farm---",
  { slug: "farm", src: "guide/farm.md" },
  { slug: "master-plan", src: "guide/master-plan.md" },
  { slug: "operations", src: "guide/operations.md" },
  { slug: "film", src: "guide/film.md" },
  "---Business---",
  { slug: "business-model", src: "guide/business/model.md" },
  { slug: "marketing", src: "guide/business/marketing.md" },
  { slug: "digital", src: "guide/business/digital.md" },
  "---Studio package---",
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
    slug: "studio-materials", title: "Studio: bill of materials",
    description: "Everything one studio needs, section by section, and the water and sanitation the studios share with the farm.",
    sections: [["", "StudioBom"], ["Shared with the farm", "StudioShared"]],
  },
  {
    slug: "studio-circuits", title: "Studio: circuits and points",
    description: "The eight circuits, each checked against its breaker, cable and voltage drop, and every light, switch and socket.",
    sections: [["Circuits", "StudioCircuits"], ["Points", "StudioElectricPoints"]],
  },
  {
    slug: "studio-pipes", title: "Studio: pipe runs and points",
    description: "Every pipe run with its size, length and fall, and every valve, tap and drain.",
    sections: [["Pipe runs", "StudioPipes"], ["Points", "StudioFittings"]],
  },
  {
    slug: "studio-features", title: "Studio: features and downloads",
    description: "What the studio has, how it is built the IKEA way, the drawing set to download, and where it stands.",
    sections: [["What the studio has", "StudioFeatures"], ["Built the IKEA way", "StudioSteps"],
      ["Downloads", "StudioDownloads"], ["Status", "StudioStatus"]],
  },
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
  // Every other place's reference, moved off its /en page as the studio's was: its points tables and status (the
  // components in src/components/<place>/docs-sections.tsx). Off the sidebar; each page's docs cards and tags link here.
  "---The places---",
  {
    slug: "guest-room-points", title: "Guest room: circuits and points",
    description: "Every light, switch and socket in the guest room, with its circuit, height and load, and where the design stands.",
    sections: [["Electric points", "GuestRoomElectricPoints"], ["Status", "GuestRoomStatus"]],
  },
  {
    slug: "office-points", title: "Office: electric and network points",
    description: "Every light, socket and network point in the office, with its circuit or cable, and where the design stands.",
    sections: [["Electric points", "OfficeElectricPoints"], ["Network points", "OfficeNetworkPoints"], ["Status", "OfficeStatus"]],
  },
  {
    slug: "study-room-points", title: "Study room: circuits and points",
    description: "Every light, socket and Wi-Fi point in the study room, with its circuit, height and load, and where the design stands.",
    sections: [["Electric points", "StudyRoomElectricPoints"], ["Status", "StudyRoomStatus"]],
  },
  {
    slug: "galley-points", title: "Galley: electric and plumbing points",
    description: "Every socket, light, tap and drain in the galley, the pipe runs, and where the design stands.",
    sections: [["Electric points", "GalleyElectricPoints"], ["Plumbing points", "GalleyPlumbingPoints"], ["Status", "GalleyStatus"]],
  },
  {
    slug: "public-bathroom-points", title: "Public bathroom: electric and plumbing points",
    description: "Every light, socket, tap and drain in the public bathroom, with its circuit or its pipes, and where the design stands.",
    sections: [["Electric points", "PublicBathroomElectricPoints"], ["Plumbing points", "PublicBathroomPlumbingPoints"], ["Status", "PublicBathroomStatus"]],
  },
  {
    slug: "volleyball-points", title: "Volleyball: net points",
    description: "The footings, the posts, the winch, the net and the antennae, where each is and its size, and where the design stands.",
    sections: [["Net points", "VolleyballNetPoints"], ["Status", "VolleyballStatus"]],
  },
  {
    slug: "parking-points", title: "Parking: lighting and drainage points",
    description: "Every lamp, duct, fall, trench and pit at the way in, where each is and its size, and where the design stands.",
    sections: [["Lighting points", "ParkingLightingPoints"], ["Drainage points", "ParkingDrainagePoints"], ["Status", "ParkingStatus"]],
  },
  {
    slug: "bar-points", title: "Bar: electric and plumbing points",
    description: "Every socket, light, tap and drain in the bar, the pipe runs, and where the design stands.",
    sections: [["Electric points", "BarElectricPoints"], ["Plumbing points", "BarPlumbingPoints"], ["Status", "BarStatus"]],
  },
  {
    slug: "livestock-points", title: "Livestock: water points and needs",
    description: "Every valve, line and trough in the yard, what the herd and the farm friends drink a day, and where the design stands.",
    sections: [["Water points", "LivestockWaterPoints"], ["What the yard drinks", "LivestockWaterNeed"], ["Status", "LivestockStatus"]],
  },
  "---Reference---",
  { slug: "decision-log", src: "study/execution/decision-log.md" },
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
  "---Archive · Research---",
  { slug: "status", src: "PROJECT_STATUS.md", title: "Study overview", description: "Where the farm study stands: what is done, what we know, and the questions for the founder." },
  { slug: "preliminary-report", src: "study/research/preliminary-report.md" },
  { slug: "location", src: "study/research/location.md" },
  { slug: "market", src: "study/research/rwanda-agriculture-market.md" },
  { slug: "crops", src: "study/research/crop-market-research.md" },
  { slug: "livestock-research", src: "study/research/livestock-market-research.md" },
  { slug: "buyers", src: "study/research/buyer-database.md" },
  { slug: "regulations", src: "study/research/regulations.md" },
  { slug: "plant-suppliers", src: "study/research/plant-and-seed-suppliers.md" },
  { slug: "livestock-suppliers", src: "study/research/livestock-suppliers.md" },
  "---Archive · Farm design---",
  { slug: "questionnaire", src: "study/discovery/farm-questionnaire.md" },
  { slug: "site-inspection", src: "study/discovery/site-inspection-checklist.md", description: "One structured site visit that turns the farm from an unknown into a measured baseline." },
  { slug: "soil-water", src: "study/discovery/soil-water-testing-plan.md" },
  { slug: "zoning", src: "study/discovery/zoning-concept.md" },
  { slug: "integrated-design", src: "study/design/integrated-farm-design.md" },
  { slug: "crop-plan", src: "study/design/crop-plan.md" },
  { slug: "livestock-plan", src: "study/design/livestock-plan.md" },
  { slug: "feed-and-pasture", src: "study/design/feed-and-pasture-plan.md" },
  { slug: "water-and-soil", src: "study/design/water-and-soil-plan.md" },
  "---Archive · Engineering and operations---",
  { slug: "technology-strategy", src: "study/engineering/technology-strategy.md" },
  { slug: "electrical-system", src: "study/engineering/electrical-system.md" },
  { slug: "irrigation-automation", src: "study/engineering/irrigation-automation.md" },
  { slug: "iot-architecture", src: "study/engineering/iot-architecture.md" },
  { slug: "software-architecture", src: "study/engineering/software-architecture.md" },
  { slug: "commissioning", src: "study/engineering/commissioning-plan.md" },
  { slug: "sops", src: "study/operations/standard-operating-procedures.md" },
  { slug: "livestock-management", src: "study/operations/livestock-management.md" },
  { slug: "crop-management", src: "study/operations/crop-management.md" },
  { slug: "maintenance", src: "study/operations/maintenance.md" },
  { slug: "recordkeeping", src: "study/operations/recordkeeping.md" },
  "---Archive · Plan and business---",
  { slug: "decision-matrix", src: "study/feasibility/decision-matrix.md" },
  { slug: "financial-model", src: "study/feasibility/financial-model-notes.md" },
  { slug: "risk-register", src: "study/feasibility/risk-register.md" },
  { slug: "first-90-days", src: "study/execution/first-90-days.md", title: "First 90 days",
    description: "2026-10-19 to 2027-01-17: the decision gates, the work week by week, the tasks and the risks." },
  { slug: "five-year-roadmap", src: "study/execution/five-year-roadmap.md", title: "Five-year roadmap",
    description: "2026-10 to 2031-10: the phases on the calendar, the decision gates, the critical path and the milestones year by year." },
  { slug: "buyer-strategy", src: "study/go-to-market/buyer-strategy.md" },
  { slug: "sales-plan", src: "study/go-to-market/sales-plan.md" },
  { slug: "outreach-templates", src: "study/go-to-market/outreach-templates.md" },
  { slug: "brand", src: "study/brand/brand.md" },
  { slug: "financing-strategy", src: "study/investment/financing-strategy.md" },
  { slug: "pitch-deck", src: "study/investment/pitch-deck.md" },
  { slug: "speaker-notes", src: "study/investment/speaker-notes.md" },
  { slug: "one-pager", src: "study/investment/executive-one-pager.md" },
  { slug: "website-sitemap", src: "study/website/sitemap.md" },
  { slug: "website-copy", src: "study/website/website-copy.md" },
  { slug: "website-plan", src: "study/website/implementation-plan.md" },
  { slug: "website-render-brief", src: "study/website/render-brief.md" },
]

// What the sidebar shows: this month's work only (November 2026). Every page in PAGES still renders at
// its /docs URL and stays linked from the guides and Start here; add a slug back when it is needed again.
const SIDEBAR = [
  "index",
  "---Build the studios---",
  "carpenter",
  "electrician",
  "plumber",
  "power",
  "---The studio---",
  "studio-materials",
  "studio-circuits",
  "studio-pipes",
  "studio-features",
  "---Start the field---",
  "vegetables",
  "livestock",
  "---The land---",
  "farm",
  "master-plan",
  "---Execution plan---",
  "first-90-days",
  "five-year-roadmap",
]
const fail = (slug) => { throw new Error(`sync-docs: SIDEBAR lists "${slug}", which is not in PAGES`) }

const listed = PAGES.filter((p) => typeof p !== "string")
const toPosix = (p) => p.split(sep).join("/")
// A Kinyarwanda twin X.rw.md beside a listed X.md: its own page, off the sidebar (meta.json lists only `listed`).
const twins = listed
  .filter((p) => p.src?.endsWith(".md") && existsSync(join(ROOT, p.src.replace(/\.md$/, ".rw.md"))))
  .map((p) => ({ slug: `${p.slug}-rw`, src: p.src.replace(/\.md$/, ".rw.md"), twinOf: p.src }))
const entries = [...listed, ...twins]
// one page per slug: a repeated slug would silently overwrite the earlier page's .mdx
const seenSlugs = new Set()
for (const { slug } of entries) {
  if (seenSlugs.has(slug)) throw new Error(`sync-docs: slug "${slug}" is used twice in PAGES`)
  seenSlugs.add(slug)
}
const slugByPath = new Map(entries.map((p) => [p.src ?? p.csv, p.slug]))

// {{ns.key}} values: the studio generator's measurements, read only when a page uses one.
const TOKEN_FILES = {
  studio: join(PUBLIC, "designs", "studio", "data", "dims.json"),
  site: join(PUBLIC, "designs", "site", "site-dims.json"), // scripts/site/master-plan.mjs
}
const tokenCache = {}
function tokens(line, src) {
  return line.replace(/\{\{([a-z]+)\.([a-z0-9_]+)\}\}/g, (match, ns, key) => {
    if (!TOKEN_FILES[ns]) throw new Error(`${src}: unknown token namespace ${match}`)
    tokenCache[ns] ??= JSON.parse(readFileSync(TOKEN_FILES[ns], "utf8"))
    const v = tokenCache[ns][key]
    if (v === undefined || typeof v === "object") throw new Error(`${src}: unknown token ${match}`)
    return String(v)
  })
}

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

/** Links to other study files become /docs links, links into public/ become downloads, site pages stay links, others become code. */
function rewriteLinks(line, src) {
  return line.replace(/(!?)\[([^\]]+)\]\(([^)\s]+)\)/g, (match, bang, text, target) => {
    if (bang) throw new Error(`${src}: put images on their own line (${target})`)
    if (/^(https?:|mailto:|#)/.test(target)) return match
    // the site's own pages (/en/farming, the homepage's /#plans) stay links
    if (/^\/(en\/|#|$)/.test(target)) return match
    const [path, hash] = target.split("#")
    const abs = resolveTarget(src, path)
    const slug = slugByPath.get(toPosix(relative(ROOT, abs)))
    if (slug) return `[${text}](/docs${slug === "index" ? "" : `/${slug}`}${hash ? `#${hash}` : ""})`
    if (abs.startsWith(join(PUBLIC, "guides") + sep) && !existsSync(abs)) return `${text} (not printed yet)`
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
    return `<Figure src=${attr(url)} caption=${attr(mm[1])}${size}${src.startsWith("guide/") ? " eager" : ""} />`
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
  const lines = readFileSync(join(ROOT, src), "utf8").split("\n").map((l) => tokens(l, src))
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
  // a guide's lead sentence is its subtitle (the page shows the description under the title): don't repeat it
  const lead = !fixed && src.startsWith("guide/") && firstText ? body.indexOf(firstText) : -1
  const leadText = lead < 0 ? "" : sentence.replace(/[*_`]/g, "").replace(/\s+/g, " ").trim()
  let inFence = false
  const out = body.map((line, i) => {
    if (i === lead && leadText === description) return ""
    if (/^\s*(```|~~~)/.test(line)) { inFence = !inFence; return line }
    if (inFence) return line
    const block = blockDirective(line, src)
    return block !== null ? `\n${block}\n` : escapeProse(rewriteLinks(line, src))
  })
  return `---\ntitle: ${yaml(title ?? heading)}\ndescription: ${yaml(description)}\n---\n\n` +
    `{/* Generated by scripts/sync-docs.mjs from ${src}. Edit the source, not this file. */}\n` +
    out.join("\n").replace(/^\n+/, "\n")
}

function fromSections({ slug, title, description, sections }) {
  const body = sections.map(([heading, component]) => `${heading ? `## ${heading}\n\n` : ""}<${component} />\n`)
  return `---\ntitle: ${yaml(title)}\ndescription: ${yaml(description)}\n---\n\n` +
    `{/* Generated by scripts/sync-docs.mjs (the "${slug}" entry). Edit the components, not this file. */}\n\n` +
    body.join("\n")
}

function fromCsv({ csv, title, description, columns }) {
  const rows = parseCsv(readFileSync(join(ROOT, csv), "utf8"))
  const url = publicUrl(join(ROOT, csv), csv)
  const file = url ? `[\`${csv}\`](${url})` : `\`${csv}\``
  return `---\ntitle: ${yaml(title)}\ndescription: ${yaml(description)}\n---\n\n` +
    `{/* Generated by scripts/sync-docs.mjs from ${csv}. Edit the source, not this file. */}\n\n` +
    `${rows.length} rows · source file ${file} (all columns there; selected columns here).\n\n${csvTable(rows, columns)}\n`
}

/** What a twin must share with its English page: sections, numbered steps, numbers and linked files. */
function parity(enSrc, rwSrc) {
  const pair = new Set([enSrc, rwSrc])
  const facts = (src) => {
    const lines = readFileSync(join(ROOT, src), "utf8").split("\n").map((l) => tokens(l, src))
    const links = new Set()
    const numbers = new Set()
    for (const l of lines) {
      for (const [, t] of l.matchAll(/\]\(([^)\s]+)\)/g)) {
        // a drawing drawn per language (x.en.svg / x.rw.svg) counts as one file
        const rel = toPosix(relative(ROOT, resolveTarget(src, t.split("#")[0]))).replace(/\.(en|rw)\.svg$/, ".svg")
        // each language links its own printed PDF
        if (!pair.has(rel) && !rel.startsWith("public/guides/") && !/^(https?:|mailto:|#)/.test(t)) links.add(rel)
      }
      for (const [n] of l.replace(/\]\([^)]*\)/g, "]").matchAll(/\d+(?:[.,]\d+)*/g)) numbers.add(n)
    }
    return {
      sections: lines.filter((l) => /^#{2,3} /.test(l)).length,
      steps: lines.filter((l) => /^\s*\d+\.\s/.test(l)).length,
      links, numbers,
    }
  }
  const en = facts(enSrc), rw = facts(rwSrc)
  const gaps = []
  if (en.sections !== rw.sections) gaps.push(`${rw.sections} of ${en.sections} sections`)
  if (en.steps !== rw.steps) gaps.push(`${rw.steps} of ${en.steps} numbered steps`)
  const missing = (a, b) => [...a].filter((x) => !b.has(x))
  const nums = missing(en.numbers, rw.numbers)
  if (nums.length) gaps.push(`numbers missing: ${nums.slice(0, 12).join(", ")}${nums.length > 12 ? " …" : ""}`)
  const extra = missing(rw.numbers, en.numbers)
  if (extra.length) gaps.push(`numbers not in the English: ${extra.slice(0, 12).join(", ")}`)
  const files = missing(en.links, rw.links)
  if (files.length) gaps.push(`links missing: ${files.join(", ")}`)
  return gaps
}

rmSync(OUT, { recursive: true, force: true })
mkdirSync(OUT, { recursive: true })
for (const page of entries) {
  let mdx = page.sections ? fromSections(page) : page.csv ? fromCsv(page) : fromMarkdown(page)
  if (page.twinOf) {
    const gaps = parity(page.twinOf, page.src)
    if (gaps.length) {
      console.warn(`sync-docs: ${page.src} differs from ${page.twinOf}: ${gaps.join("; ")}`)
      mdx = mdx.replace("\n\n", `\n\n> **Behind the English page:** ${escapeProse(gaps.join("; "))}. Use the English until this is fixed.\n\n`)
    }
  }
  writeFileSync(join(OUT, `${page.slug}.mdx`), mdx)
}
const pages = SIDEBAR.filter((s) => s.startsWith("---") || seenSlugs.has(s) || fail(s))
writeFileSync(join(OUT, "meta.json"), JSON.stringify({ title: "Farm docs", pages }, null, 2) + "\n")
console.log(`synced ${entries.length} pages to content/docs`)
