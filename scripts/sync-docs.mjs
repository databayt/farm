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
//   X.rw.md       beside X.md is its Kinyarwanda (D-058): the same page at /rw/docs/<slug>, checked against the
//                 English for the same sections, steps, numbers and links
//
// The docs are in two languages (src/lib/source.ts): English pages go to content/docs/en, each Kinyarwanda page to
// content/docs/rw at its English slug, and /rw shows the English page wherever there is none. Links between pages
// are written without a language, so the page adds the reader's (src/mdx-components.tsx); a guide's link to its own
// translation names the other language (hrefLang). Old URLs reach their pages through public/_redirects (MOVED).
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { basename, dirname, join, relative, resolve, sep } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const OUT = join(ROOT, "content", "docs")
const PUBLIC = join(ROOT, "public")
// the site's languages, as src/components/internationalization/config.ts lists them
const LANGS = ["en", "rw"]

// Every docs page, grouped by kind ("---" lines are labels for the reader of this file). The sidebar
// shows only SIDEBAR, below; the rest render off the sidebar, like the Kinyarwanda twins.
const PAGES = [
  { slug: "index", src: "guide/start.md", title: "Start here" },
  "---Grow---",
  { slug: "vegetables", src: "guide/grow/vegetables.md" },
  { slug: "livestock", src: "guide/grow/livestock.md" },
  "---How the farm runs---",
  { slug: "operations", src: "guide/operations.md" },
  { slug: "film", src: "guide/film.md" },
  "---Business---",
  { slug: "business-model", src: "guide/business/model.md" },
  { slug: "marketing", src: "guide/business/marketing.md" },
  { slug: "digital", src: "guide/business/digital.md" },
  "---Studio package---",
  { slug: "studio-package", src: "study/studio/studio.md" },
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
  // Every other place's reference, moved off its /en page as the studio's was: its points tables and status (the
  // components in src/components/<place>/docs-sections.tsx). Off the sidebar; each page's docs cards and tags link here.
  "---The places---",
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
    slug: "farming-plan", title: "Farming: plate, calendar, water and materials",
    description: "What the galley needs from the field, the planting calendar, the drip's water points, the bill of materials to start, and where the plan stands.",
    sections: [["Water points", "FarmingWaterPoints"], ["What the galley needs", "FarmingPlate"],
      ["Planting so the harvest never stops", "FarmingCalendar"], ["Bill of materials", "FarmingBom"], ["Status", "FarmingStatus"]],
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
  "---Start the field---",
  "vegetables",
  "livestock",
]
const fail = (slug) => { throw new Error(`sync-docs: SIDEBAR lists "${slug}", which is not in PAGES`) }

// The docs by place (D-059): every place of the site menu, then the farm as a whole, is a folder of the same pages,
// each from guide/<place>/<kind>.md: its execution plan (plan.md, the folder's index at /docs/<place>), its
// materials and the services it has. KINDS is their order in the sidebar, where their names come from the
// dictionaries (docs.kinds); a folder's title is the place's English name.
const KINDS = ["plan", "today", "master-plan", "materials", "electric", "lighting", "net", "plumbing", "water", "drainage"]
const PLACES = [...JSON.parse(readFileSync(join(ROOT, "src", "components", "site", "places.json"), "utf8")).places, "farm"]
const PLACE_NAMES = JSON.parse(readFileSync(join(ROOT, "src", "components", "internationalization", "en.json"), "utf8")).places
const placePages = PLACES.flatMap((place) => {
  const dir = join(ROOT, "guide", place)
  if (!existsSync(dir)) return []
  const kinds = readdirSync(dir).filter((f) => f.endsWith(".md") && !f.endsWith(".rw.md")).map((f) => f.slice(0, -3))
  for (const kind of kinds) if (!KINDS.includes(kind)) throw new Error(`sync-docs: guide/${place}/${kind}.md is not a kind of page (KINDS)`)
  if (!kinds.includes("plan")) throw new Error(`sync-docs: guide/${place} has no plan.md, its execution plan`)
  return KINDS.filter((kind) => kinds.includes(kind)).map((kind) => ({
    slug: kind === "plan" ? place : `${place}/${kind}`, file: kind === "plan" ? `${place}/index` : `${place}/${kind}`,
    src: `guide/${place}/${kind}.md`, place, kind,
  }))
})
const placesIn = [...new Set(placePages.map((p) => p.place))]

const listed = [...placePages, ...PAGES.filter((p) => typeof p !== "string")].map((p) => ({ file: p.slug, ...p, lang: "en" }))
for (const p of listed) {
  if (!p.place && placesIn.includes(p.slug)) throw new Error(`sync-docs: "${p.slug}" is a place's folder; rename the page (MOVED)`)
}
const toPosix = (p) => p.split(sep).join("/")
// A Kinyarwanda page X.rw.md beside a listed X.md: the same slug in content/docs/rw (D-058). fumadocs lists only
// what the English meta.json lists, so a Kinyarwanda page always has an English one.
const twins = listed
  .filter((p) => p.src?.endsWith(".md") && existsSync(join(ROOT, p.src.replace(/\.md$/, ".rw.md"))))
  .map((p) => ({ ...p, lang: "rw", src: p.src.replace(/\.md$/, ".rw.md"), twinOf: p.src }))
const entries = [...listed, ...twins]
const twinned = new Set(twins.map((t) => t.twinOf))
// one page per slug and language: a repeated slug would silently overwrite the earlier page's .mdx
const seenSlugs = new Set()
for (const { slug, lang } of entries) {
  if (seenSlugs.has(`${lang}:${slug}`)) throw new Error(`sync-docs: slug "${slug}" is used twice in PAGES`)
  seenSlugs.add(`${lang}:${slug}`)
}
const pageByPath = new Map(entries.map((p) => [p.src ?? p.csv, p]))

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

/**
 * Links to other study files become /docs links, without a language (the page adds the reader's), links into
 * public/ become downloads, site pages stay links, others become code. A link across languages (an English guide's
 * link to its Kinyarwanda, and a Kinyarwanda page's link back) names its language: JSX, handed to `keep` so that
 * escapeProse leaves it alone.
 */
function rewriteLinks(line, page, keep) {
  const { src } = page
  return line.replace(/(!?)\[([^\]]+)\]\(([^)\s]+)\)/g, (match, bang, text, target) => {
    if (bang) throw new Error(`${src}: put images on their own line (${target})`)
    if (/^(https?:|mailto:|#)/.test(target)) return match
    // the site's own pages (/en/farming, the homepage's /#plans) stay links
    if (/^\/(en\/|#|$)/.test(target)) return match
    const [path, hash] = target.split("#")
    const abs = resolveTarget(src, path)
    const to = pageByPath.get(toPosix(relative(ROOT, abs)))
    if (to) {
      const url = `/docs${to.slug === "index" ? "" : `/${to.slug}`}${hash ? `#${hash}` : ""}`
      if (to.lang !== page.lang && (to.lang !== "en" || to.slug === page.slug))
        return keep(`<a href=${attr(`/${to.lang}${url}`)} hrefLang=${attr(to.lang)}>${escapeProse(text)}</a>`)
      return `[${text}](${url})`
    }
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
  // a component of the site's (a points table, a drawing): <Name title="…" />, the link text its title
  mm = line.match(COMPONENT)
  if (mm) {
    const abs = resolveTarget(src, mm[2])
    if (!abs.startsWith(join(ROOT, "src", "components") + sep) || !existsSync(abs)) throw new Error(`${src}: no component file ${mm[2]}`)
    if (!new RegExp(`export (async )?function ${mm[3]}\\b|export const ${mm[3]}\\b`).test(readFileSync(abs, "utf8")))
      throw new Error(`${src}: ${mm[2]} does not export ${mm[3]}`)
    if (!new RegExp(`\\b${mm[3]}\\b`).test(MDX_COMPONENTS)) throw new Error(`${src}: register ${mm[3]} in src/mdx-components.tsx`)
    return `<${mm[3]} title=${attr(mm[1])} />`
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

// [Title](../../src/components/x/docs-sections.tsx#Name) on a line of its own: the component Name, as the docs show it
const COMPONENT = /^\s*\[([^\]]+)\]\(([^)\s]+\.tsx)#([A-Z]\w*)\)\s*$/
const MDX_COMPONENTS = readFileSync(join(ROOT, "src", "mdx-components.tsx"), "utf8")

const isDirective = (l) => COMPONENT.test(l) || /^\s*!\[[^\]]*\]\([^)]+\)\s*$/.test(l) || /^\s*\[(Table:[^\]]*|[^\]]+)\]\([^)\s]+\.(csv|glb)\)\s*$/.test(l)

/** github-slugger's way: lower case, drop punctuation, a dash for every space; repeats get -1, -2 … */
function headingIds(src) {
  const seen = new Map()
  let inFence = false
  const ids = []
  for (const line of readFileSync(join(ROOT, src), "utf8").split("\n").map((l) => tokens(l, src))) {
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence
    const m = !inFence && line.match(/^#{2,3} (.+)$/)
    if (!m) continue
    const text = m[1].replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/[*_`]/g, "")
    const base = text.toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu, "").trim().replace(/\s/g, "-")
    const n = seen.get(base) ?? 0
    seen.set(base, n + 1)
    ids.push(n ? `${base}-${n}` : base)
  }
  return ids
}

function fromMarkdown(page) {
  const { src, title, description: fixed } = page
  // A page and its translation share their anchors, the English headings' (D-058), so a link or the language
  // switch lands on the same section in either language.
  const ids = page.twinOf ? headingIds(page.twinOf) : twinned.has(src) ? headingIds(src) : null
  let heading_ = 0
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
  const kept = []
  const keep = (jsx) => `\u0000${kept.push(jsx) - 1}\u0000`
  const out = body.map((line, i) => {
    if (i === lead && leadText === description) return ""
    if (/^\s*(```|~~~)/.test(line)) { inFence = !inFence; return line }
    if (inFence) return line
    const block = blockDirective(line, src)
    if (block !== null) return `\n${block}\n`
    const out = escapeProse(rewriteLinks(line, page, keep))
    if (ids && /^#{2,3} /.test(line)) { const id = ids[heading_++]; return id ? `${out} [#${id}]` : out }
    return out
  })
  const where = page.place ? `place: ${yaml(page.place)}\nkind: ${yaml(page.kind)}\n` : ""
  return `---\ntitle: ${yaml(title ?? heading)}\ndescription: ${yaml(description)}\n${where}---\n\n` +
    `{/* Generated by scripts/sync-docs.mjs from ${src}. Edit the source, not this file. */}\n` +
    out.join("\n").replace(/^\n+/, "\n").replace(/\u0000(\d+)\u0000/g, (_, n) => kept[n])
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
        const [path, hash] = t.split("#")
        const file = toPosix(relative(ROOT, resolveTarget(src, path))).replace(/\.(en|rw)\.svg$/, ".svg")
        const rel = file.endsWith(".tsx") ? `${file}#${hash}` : file
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

// Old URLs (D-058): the docs moved from /docs to /en/docs (and the Kinyarwanda pages from /docs/<slug>-rw to
// /rw/docs/<slug>), and a renamed page keeps its old link. One map, so a redirect can't point at a page that is
// gone: each old slug and the page it became.
const MOVED = {
  // the farm as a whole is now a group of its own (D-059): its today, master plan and electric pages
  "farm-today": "farm/today", "master-plan": "farm/master-plan", power: "farm/electric",
  // the studio's trade guides and reference pages, now its execution plan, materials, electric and plumbing (D-059)
  carpenter: "studio", "studio-features": "studio", "studio-materials": "studio/materials",
  electrician: "studio/electric", "studio-circuits": "studio/electric",
  plumber: "studio/plumbing", "studio-pipes": "studio/plumbing",
  // each place's points page (D-057), now its Electric page with its points, circuits and plan beside it
  "guest-room-points": "guest-room/electric", "office-points": "office/electric", "study-room-points": "study-room/electric",
  "galley-points": "galley/electric", "public-bathroom-points": "public-bathroom/electric", "bar-points": "bar/electric",
}
// printed guides renamed with their pages: public/guides/<old>[-rw].pdf is now <new>[-rw].pdf
const MOVED_PDFS = { carpenter: "studio-plan", electrician: "studio-electric", plumber: "studio-plumbing", power: "farm-electric" }

/** public/_redirects for Cloudflare: static rules first, the catch-all last (the first matching rule wins). */
function redirects() {
  const live = new Set(listed.map((p) => p.slug))
  const rules = [["/docs", "/en/docs"]]
  for (const [old, now] of Object.entries(MOVED)) {
    if (!live.has(now)) throw new Error(`sync-docs: MOVED sends "${old}" to "${now}", which is not a page`)
    if (live.has(old)) throw new Error(`sync-docs: MOVED moves "${old}", which is still a page`)
    // its URL before the languages, its Kinyarwanda twin's, and its URLs under /en and /rw before it moved
    rules.push([`/docs/${old}`, `/en/docs/${now}`], [`/docs/${old}-rw`, `/rw/docs/${now}`],
      [`/en/docs/${old}`, `/en/docs/${now}`], [`/rw/docs/${old}`, `/rw/docs/${now}`])
  }
  for (const { slug } of twins.filter((t) => !t.place)) rules.push([`/docs/${slug}-rw`, `/rw/docs/${slug}`])
  for (const [old, now] of Object.entries(MOVED_PDFS)) {
    for (const rw of ["", "-rw"]) {
      if (!existsSync(join(PUBLIC, "guides", `${now}${rw}.pdf`))) throw new Error(`sync-docs: MOVED_PDFS sends ${old}${rw}.pdf to ${now}${rw}.pdf, which is not in public/guides`)
      rules.push([`/guides/${old}${rw}.pdf`, `/guides/${now}${rw}.pdf`])
    }
  }
  rules.push(["/docs/*", "/en/docs/:splat"])
  return "# Generated by scripts/sync-docs.mjs from MOVED. Old docs URLs and the pages they became.\n" +
    rules.map(([from, to]) => `${from} ${to} 301`).join("\n") + "\n"
}

rmSync(OUT, { recursive: true, force: true })
for (const lang of LANGS) mkdirSync(join(OUT, lang), { recursive: true })
for (const page of entries) {
  let mdx = page.sections ? fromSections(page) : page.csv ? fromCsv(page) : fromMarkdown(page)
  if (page.twinOf) {
    const gaps = parity(page.twinOf, page.src)
    if (gaps.length) {
      console.warn(`sync-docs: ${page.src} differs from ${page.twinOf}: ${gaps.join("; ")}`)
      mdx = mdx.replace("\n\n", `\n\n> **Behind the English page:** ${escapeProse(gaps.join("; "))}. Use the English until this is fixed.\n\n`)
    }
  }
  mkdirSync(dirname(join(OUT, page.lang, page.file)), { recursive: true })
  writeFileSync(join(OUT, page.lang, `${page.file}.mdx`), mdx)
}
// a place's folder: its pages after the execution plan (the folder's index), in KINDS order
for (const place of placesIn) {
  const pages = placePages.filter((p) => p.place === place && p.kind !== "plan").map((p) => p.kind)
  writeFileSync(join(OUT, "en", place, "meta.json"), JSON.stringify({ title: PLACE_NAMES[place], pages }, null, 2) + "\n")
}
// The sidebar: Start here, the places in the menu's order, then whatever SIDEBAR still lists beside them.
const pages = ["index", ...placesIn, ...SIDEBAR.filter((s) => s !== "index" && (s.startsWith("---") || seenSlugs.has(`en:${s}`) || fail(s)))]
// One meta.json, the English one: fumadocs builds the Kinyarwanda tree on the English pages.
writeFileSync(join(OUT, "en", "meta.json"), JSON.stringify({ title: "Farm docs", pages }, null, 2) + "\n")
writeFileSync(join(PUBLIC, "_redirects"), redirects())
console.log(`synced ${listed.length} English and ${twins.length} Kinyarwanda pages to content/docs`)
