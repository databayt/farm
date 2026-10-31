import type * as React from "react"

import { type BomGroup, type BomLine, type BomSection, BomTable } from "@/components/docs/bom-table"
import { Figure } from "@/components/docs/figure"
import type { Locale } from "@/components/internationalization/config"
import { dictionary } from "@/components/internationalization/dictionaries"
import { getLocale } from "@/components/internationalization/locale"
import { bomItem, D, degC, frw, mm, readCsv, rwf, studioCsv } from "@/components/studio/data"
import { words } from "@/components/studio/words"

// The studio's reference sections, on its docs pages (D-059: guide/studio/*.md embeds them; scripts/sync-docs.mjs
// renders each as <Name />). Every number is the generator's, read from public/designs/studio/data on the server; the
// words are the reader's (words.tsx `ref` and `json`): a group or a line with no Kinyarwanda keeps its English.

const POINT_GROUP: Record<string, string> = {
  db: "Board and protection", light: "Lights", switch: "Switches", usb: "Sockets and outlets",
  socket: "Sockets and outlets", outlet: "Sockets and outlets", fan: "Fans", inlet: "Board and protection",
  alarm: "Alarms", earth: "Earthing and bonding",
}
const ELEC_GROUPS = ["Board and protection", "Earthing and bonding", "Cable and conduit", "Lights", "Switches",
  "Sockets and outlets", "Fans", "Alarms", "Appliances", "Labour"]

const bomLine = (lang: Locale, r: Record<string, string>, item = r.item): BomLine => ({
  item: bomItem(r.item, lang) ?? item, qty: Number(r.qty_per_unit), unit: words[lang].json.units[r.unit] ?? r.unit,
  price: Number(r.unit_price_rwf), total: Number(r.total_per_unit_rwf), label: r.label,
})

const tally = (lang: Locale, groups: Map<string, BomLine[]>): BomGroup[] =>
  [...groups].filter(([, l]) => l.length).map(([name, lines]) => ({ name: words[lang].json.groups[name] ?? name, lines, total: lines.reduce((n, l) => n + (l.total ?? 0), 0) }))

// The electrician's lines, sorted into the groups an electrician buys by.
function electricalGroups(lang: Locale, rows: Record<string, string>[], points: Record<string, string>[]) {
  const kindOf = new Map(points.map((p) => [p.description, p.kind]))
  const groups = new Map<string, BomLine[]>(ELEC_GROUPS.map((g) => [g, []]))
  for (const r of rows) {
    const kind = kindOf.get(r.item)
    const group = r.category === "labour" ? "Labour"
      : r.category === "appliances" ? "Appliances"
      : r.category === "safety" ? "Alarms"
      : /earth|bonding/i.test(r.item) ? "Earthing and bonding"
      : /cable|conduit/i.test(r.item) ? "Cable and conduit"
      : kind ? POINT_GROUP[kind]
      : /light|LED/i.test(r.item) ? "Lights"
      : "Board and protection"
    groups.get(group)!.push(bomLine(lang, r, cable(lang, r.item)))
  }
  return tally(lang, groups)
}

const PLUMB_GROUPS = ["Sanitaryware", "Hot water", "Supply pipe", "Drain and vent pipe", "Valves and fittings",
  "Drinking water", "Labour"]

// The plumber's lines, sorted the same way: what is fixed to the wall, then what runs behind it.
function plumbingGroups(lang: Locale, rows: Record<string, string>[]) {
  const groups = new Map<string, BomLine[]>(PLUMB_GROUPS.map((g) => [g, []]))
  for (const r of rows) {
    const group = r.category === "labour" ? "Labour"
      : r.category === "sanitaryware" ? "Sanitaryware"
      : /heater|hand-shower/i.test(r.item) ? "Hot water"
      : /^PPR/.test(r.item) ? "Supply pipe"
      : /^uPVC/.test(r.item) ? "Drain and vent pipe"
      : /drinking/i.test(r.item) ? "Drinking water"
      : "Valves and fittings"
    groups.get(group)!.push(bomLine(lang, r, degC(r.item)))
  }
  return tally(lang, groups)
}

// A section's lines by what they are (the BOM's categories), labour last.
function categoryGroups(lang: Locale, rows: Record<string, string>[]) {
  const groups = new Map<string, BomLine[]>()
  for (const r of [...rows].sort((a, b) => Number(a.category === "labour") - Number(b.category === "labour"))) {
    const name = r.category === "plumbing" ? "Water" : r.category[0].toUpperCase() + r.category.slice(1)
    groups.set(name, [...(groups.get(name) ?? []), bomLine(lang, r, degC(r.item))])
  }
  return tally(lang, groups)
}

// The bill of materials for one studio, grouped by the sections of this page in their order: each line goes with
// the section that shows its kit. The bathroom's wet walls and vinyl go with the floor and wall lining, as the Wall
// and Floor sections build them; the frame's bonding goes with the electrics; then what no section shows (the
// boards and hardware every kit is cut from, the steel and glazing, the roof terrace) and the labour.
const SECTIONS: [string, string][] = [["lining", "Floor and wall lining"], ["bed", "Bed"], ["seating", "Seating"],
  ["galley", "Galley"], ["bath", "Bath"], ["kits", "Boards, edging and hardware"], ["electric", "Electric"],
  ["plumbing", "Plumbing"], ["steel", "Steel, window and doors"], ["roof", "Roof terrace, canopy and stair"],
  ["labour", "Labour and transport"]]
const KIT_SECTION: Record<string, string> = { K1: "lining", K2: "bath", K3: "galley", K4: "bed", K5: "bed", K6: "seating",
  K7: "kits", "K1-K7": "kits", "K2-K7": "kits", K8: "electric", K9: "plumbing", K10: "steel", K11: "roof", labour: "labour" }
const sectionOf = (r: Record<string, string>) => (r.kit === "K2" && /wet walls|timber/.test(r.category)) || /vinyl/i.test(r.item)
  ? "lining" : r.category === "electrical" ? "electric" : KIT_SECTION[r.kit] ?? "kits"
function studioBom(lang: Locale, points: Record<string, string>[]): BomSection[] {
  const parts = new Map<string, Record<string, string>[]>(SECTIONS.map(([k]) => [k, []]))
  for (const r of readCsv("bom.csv")) parts.get(sectionOf(r))!.push(r)
  const name = Object.fromEntries(SECTIONS)
  return [...parts].filter(([, rows]) => rows.length).map(([k, rows]) => {
    const groups = k === "electric" ? electricalGroups(lang, rows, points) : k === "plumbing" ? plumbingGroups(lang, rows) : categoryGroups(lang, rows)
    return { name: words[lang].json.sections[name[k]] ?? name[k], groups, total: groups.reduce((n, g) => n + g.total, 0), lines: rows.length }
  })
}

// a cable line, named after its circuit: "Cable 1.5 mm², Indoor lights and fans", the circuit in the reader's words
function cable(lang: Locale, item: string): string {
  const m = item.match(/^Cable ([\d.]+) mm2 T\+E\/singles in conduit, (.*)$/)
  if (!m) return item
  const c = readCsv("circuits.csv").find((r) => r.serves === m[2])
  return words[lang].ref.bom.cable(m[1], (c && words[lang].json.circuits[c.circuit]) || m[2])
}

const points = () => readCsv("points.csv")

export async function StudioBom(): Promise<React.JSX.Element> {
  const lang = await getLocale(), t = words[lang]
  const summary = readCsv("bom-summary.csv")
  const extra = summary.find((r) => r.category.startsWith("contingency"))!
  const contingency = { label: t.json.contingency(extra.category), rwf: Number(extra.per_unit_rwf) }
  const total = Number(summary.find((r) => r.category === "TOTAL")!.per_unit_rwf)
  return (
    <>
      <p className="text-muted-foreground">{t.ref.bom.lead(rwf(total))}</p>
      <BomTable sections={studioBom(lang, points())} contingency={contingency} total={{ label: t.ref.bom.one, rwf: total }} />
    </>
  )
}

export async function StudioShared(): Promise<React.JSX.Element> {
  const lang = await getLocale(), t = words[lang]
  const water = Object.fromEntries(readCsv("site-water.csv").map((r) => [r.item, r.value]))
  const shared = readCsv("shared-works.csv").filter((w) => !/site board|REG/i.test(w.item))
  return (
    <>
      <p className="text-muted-foreground">
        {t.ref.shared.lead(water.tank_m3, mm(Number(water.daily_L)), water.persons, water.pump_lpm, water.septic_m3, water.chamber1_m3, water.chamber2_m3)}
      </p>
      <Figure src={`${D}/drawings/p-301.svg`} caption={t.ref.shared.figure} />
      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <tbody>
            {shared.map((w) => (
              <tr key={w.item} className="border-t first:border-0">
                <td className="px-3 py-2">{t.json.shared[w.item] ?? w.item}</td>
                <td className="px-3 py-2 text-end tabular-nums">{frw(Number(w.rwf))}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2">
              <th className="px-3 py-3 text-start font-semibold">{t.ref.shared.total}</th>
              <td className="px-3 py-3 text-end font-semibold tabular-nums">
                {frw(shared.reduce((n, w) => n + Number(w.rwf), 0))}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <p className="text-muted-foreground mt-3 text-sm">
        {t.ref.shared.full} <a href={`${D}/data/bom.xlsx`} download className="underline underline-offset-4">bom.xlsx</a>
        {["bom.csv", "circuits.csv", "points.csv", "pipes.csv", "fittings.csv", "site-water.csv"].map((f) => (
          <span key={f}>{" · "}<a href={`${D}/data/${f}`} download className="underline underline-offset-4">{f}</a></span>
        ))}
      </p>
    </>
  )
}

export async function StudioCircuits(): Promise<React.JSX.Element> {
  const lang = await getLocale(), t = words[lang].ref.circuits, h = dictionary(lang).table
  const circuits = studioCsv("circuits.csv", lang)
  return (
    <>
      <p className="text-muted-foreground">{t.lead}</p>
      <div className="mt-6 overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="text-muted-foreground bg-muted/40">
            <tr>
              {[h.circuit, h.serves, h.breaker, h.cable, t.design, h.run, t.drop, t.points].map((x) => (
                <th key={x} className="px-3 py-2 text-start font-medium whitespace-nowrap">{x}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {circuits.map((c) => (
              <tr key={c.circuit} className="border-t">
                <td className="px-3 py-2 font-medium">{c.circuit}</td>
                <td className="px-3 py-2">{c.serves}</td>
                <td className="px-3 py-2 tabular-nums">{c.device}</td>
                <td className="px-3 py-2 whitespace-nowrap tabular-nums">{c.cable_mm2} mm²</td>
                <td className="px-3 py-2 tabular-nums">{c.design_A ? `${c.design_A} A` : "–"}</td>
                <td className="px-3 py-2 tabular-nums">{c.run_m ? `${c.run_m} m` : "–"}</td>
                <td className="px-3 py-2 tabular-nums">{c.drop_pct ? `${c.drop_pct} %` : "–"}</td>
                <td className="text-muted-foreground px-3 py-2">{c.points || t.spare}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Figure src={`${D}/drawings/e-202.svg`} caption={t.figure} />
    </>
  )
}

// Each row's id (pt-L1, pt-S1…) is where a tag on /en/studio's electrical drawing links.
export async function StudioElectricPoints(): Promise<React.JSX.Element> {
  const lang = await getLocale(), t = words[lang].ref.points, h = dictionary(lang).table, kind = words[lang].json.kinds
  const pts = studioCsv("points.csv", lang)
  return (
    <>
      <p className="text-muted-foreground">{t.lead(pts.length)}</p>
      <Figure src={`${D}/drawings/e-101.svg`} caption={t.figure} />
      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="text-muted-foreground bg-muted/40">
            <tr>
              {[h.point, h.what, t.type, h.circuit, t.height, t.load].map((x) => (
                <th key={x} className="px-3 py-2 text-start font-medium whitespace-nowrap">{x}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pts.map((p) => (
              <tr key={p.point} id={`pt-${p.point}`} className="target:bg-muted scroll-mt-24 border-t">
                <td className="px-3 py-2 font-medium">{p.point}</td>
                <td className="px-3 py-2">{p.description}</td>
                <td className="text-muted-foreground px-3 py-2">{kind[p.kind] ?? p.kind}</td>
                <td className="px-3 py-2">{p.circuit || "–"}</td>
                <td className="px-3 py-2 whitespace-nowrap tabular-nums">{mm(Number(p.z_mm))} mm</td>
                <td className="px-3 py-2 whitespace-nowrap tabular-nums">{Number(p.watts) ? `${mm(Number(p.watts))} W` : "–"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export async function StudioPipes(): Promise<React.JSX.Element> {
  const lang = await getLocale(), t = words[lang].ref.pipes, h = dictionary(lang).table, sys = words[lang].json.systems
  const pipes = studioCsv("pipes.csv", lang)
  return (
    <>
      <p className="text-muted-foreground">{t.lead}</p>
      <div className="mt-6 overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="text-muted-foreground bg-muted/40">
            <tr>
              {[h.run, h.system, h.size, h.length, t.fall, h.whatItDoes].map((x) => (
                <th key={x} className="px-3 py-2 text-start font-medium whitespace-nowrap">{x}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pipes.map((p) => (
              <tr key={p.run} className="border-t">
                <td className="px-3 py-2 font-medium whitespace-nowrap">
                  <span className="me-2 inline-block size-2 rounded-full" style={{ background: p.colour }} />{p.run}
                </td>
                <td className="px-3 py-2">{sys[p.system] ?? p.system}</td>
                <td className="px-3 py-2 whitespace-nowrap tabular-nums">DN{p.dn}</td>
                <td className="px-3 py-2 whitespace-nowrap tabular-nums">{p.length_m} m</td>
                <td className="px-3 py-2 tabular-nums">{p.fall || "–"}</td>
                <td className="text-muted-foreground px-3 py-2">{degC(p.note)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Figure src={`${D}/drawings/p-201.svg`} caption={t.figure} />
    </>
  )
}

// Each row's id (pt-SV, pt-WH…) is where a tag on /en/studio's plumbing drawing links.
export async function StudioFittings(): Promise<React.JSX.Element> {
  const lang = await getLocale(), t = words[lang].ref.fittings, h = dictionary(lang).table, kind = words[lang].json.fitKinds
  const fittings = studioCsv("fittings.csv", lang)
  return (
    <>
      <p className="text-muted-foreground">{t.lead(fittings.length)}</p>
      <Figure src={`${D}/drawings/p-101.svg`} caption={t.figure} />
      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="text-muted-foreground bg-muted/40">
            <tr>
              {[h.point, h.what, words[lang].ref.points.type, t.pipes, words[lang].ref.points.height, t.rating].map((x) => (
                <th key={x} className="px-3 py-2 text-start font-medium whitespace-nowrap">{x}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fittings.map((f) => (
              <tr key={f.point} id={`pt-${f.point}`} className="target:bg-muted scroll-mt-24 border-t">
                <td className="px-3 py-2 font-medium">{f.point}</td>
                <td className="px-3 py-2">{f.description}</td>
                <td className="text-muted-foreground px-3 py-2">{kind[f.kind] ?? f.kind}</td>
                <td className="px-3 py-2 whitespace-nowrap">{f.runs}</td>
                <td className="px-3 py-2 whitespace-nowrap tabular-nums">{mm(Number(f.z_mm)).replace("-", "−")} mm</td>
                <td className="px-3 py-2 whitespace-nowrap">{degC(f.rating)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export async function StudioFeatures(): Promise<React.JSX.Element> {
  const FEATURES = words[await getLocale()].ref.features
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      {FEATURES.map((f) => (
        <div key={f.title} className="rounded-xl border p-5">
          <h3 className="font-medium">{f.title}</h3>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{f.text}</p>
        </div>
      ))}
    </div>
  )
}

export async function StudioSteps(): Promise<React.JSX.Element> {
  const STEPS = words[await getLocale()].ref.steps
  return (
    <ol className="mt-6 grid gap-4 sm:grid-cols-2">
      {STEPS.map((s) => (
        <li key={s.n} className="rounded-xl border p-4">
          <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-full text-sm font-semibold">
            {s.n}
          </div>
          <h3 className="mt-3 font-medium">{s.title}</h3>
          <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{s.text}</p>
        </li>
      ))}
    </ol>
  )
}

export async function StudioDownloads(): Promise<React.JSX.Element> {
  const label = words[await getLocale()].ref.downloads
  return (
    <ul className="mt-4 space-y-2">
      {[
        [label[0], `${D}/pdf/studio-drawing-set-A3.pdf`],
        [label[1], `${D}/pdf/studio-assembly-manual-A4.pdf`],
        [label[2], `${D}/pdf/studio-drilling-templates-1to1.pdf`],
        [label[3], `${D}/data/bom.xlsx`],
        [label[4], `${D}/data/cut-list.csv`],
        [label[5], `${D}/model/studio.glb`],
      ].map(([l, h]) => (
        <li key={h}>
          <a href={h} download className="font-medium underline underline-offset-4">{l}</a>
        </li>
      ))}
    </ul>
  )
}
