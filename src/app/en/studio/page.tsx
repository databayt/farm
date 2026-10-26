import type { Metadata } from "next"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Figure } from "@/components/docs/figure"
import { StudioViewer } from "@/components/docs/studio-viewer"
import totals from "../../../../public/designs/studio/data/totals.json"

// Public showcase of the container-studio design package (study/studio, D-014..D-016).
// Every number here comes from the generated package; the docs hold the evidence.

export const metadata: Metadata = {
  title: "Container studios · Farm",
  description:
    "Three identical farm-stay guest studios in 20 ft containers near Kigali, built IKEA-style from flat-pack parts made in Kigali.",
}

const D = "/designs/studio"
const rwf = (n: number) => `RWF ${(n / 1e6).toFixed(1)}M`

const FEATURES = [
  { title: "Sleep", text: "Queen bed up to 1.6 × 2.0 m across the quiet end, with drawers, a headboard shelf, reading lights and USB-C." },
  { title: "Cook", text: "A 2.17 m kitchen: under-counter fridge, two-zone induction hob, sink, drinking-water filter. No gas indoors." },
  { title: "Wash", text: "A 1.2 m walk-in shower, WC and basin. Hot water from an 80 L heater through a thermostatic mixer." },
  { title: "Live", text: "Table and stools by the 3 m sliding glass wall that opens onto the deck. Wall fan, split-AC ready." },
  { title: "Roof", text: "A roof terrace with lounge chairs under a tinted transparent canopy, and a second canopy over the deck." },
  { title: "Stay cool", text: "Ventilated double roof, EPS insulation sealed to the steel, insect mesh on every opening." },
]

const STEPS = [
  { n: "1", title: "Measure", text: "Survey all three containers; the model regenerates every drawing from the real numbers." },
  { n: "2", title: "Cut in Kigali", text: "A Gisozi workshop rips and crosscuts sheets on a panel saw, following the cutting diagrams." },
  { n: "3", title: "Drill and number", text: "Holes on the 32 mm grid from 1:1 templates; every part labelled, like K3-H-07." },
  { n: "4", title: "Pack flat", text: "One kit per studio, bundles under 25 kg, hardware in bags A to L." },
  { n: "5", title: "Assemble", text: "Two people, one tool set, 27 wordless steps, from insulation to the roof terrace." },
]

const SHEETS = [
  ["a-103", "Furniture and dimension plan"],
  ["a-201", "Interior elevations"],
  ["s-101", "Roof terrace, canopies and stair"],
  ["e-201", "Single-line diagram"],
  ["p-301", "Site water and sanitation"],
  ["j-103", "Kitchen kit, exploded"],
  ["j-104", "Bed kit, exploded"],
  ["c-101", "Cutting diagrams for a panel saw"],
]

export default function StudioPage() {
  const sheets = Object.values(totals.sheets as Record<string, number>).reduce((a, b) => a + b, 0)
  return (
    <main className="w-full flex-1">
      {/* First screen: the finished studio outside, full bleed (swap studio-exterior.jpg for a photoreal render
          when one exists; same name and size). Rendered from studio.glb by scripts/studio/render/hero.html. */}
      <section className="relative h-[calc(100svh-var(--header-height))] min-h-[520px] w-full overflow-hidden bg-[#a9c8df]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${D}/render/studio-exterior.jpg`} width={1600} height={1000} fetchPriority="high"
          alt="The finished studio: a container on its deck with a sliding glass wall, a transparent canopy over the deck, and a roof terrace with chairs under a second canopy."
          className="absolute inset-0 size-full object-cover object-[50%_45%]" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/35 to-transparent">
          <div className="mx-auto w-full max-w-5xl px-4 pt-24 pb-10 md:px-6 md:pb-14">
            <p className="text-sm text-white/80">Farm · container studios · rev A</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-balance text-white md:text-6xl">
              Three guest studios, built like flat-pack furniture
            </h1>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <a href="#inside">See inside</a>
              </Button>
              <Button asChild variant="outline" className="border-white/60 bg-white/10 text-white hover:bg-white/20">
                <a href="#model">Explore the 3D model</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-5xl px-4 pb-12 md:px-6 md:pb-16">
      <section id="inside" className="mt-14 grid scroll-mt-20 items-center gap-8 md:grid-cols-[1fr_1.15fr] md:gap-12">
        <div className="space-y-5">
          <h2 className="text-3xl font-semibold tracking-tight text-balance">Everything a guest needs in 13 m²</h2>
          <p className="text-muted-foreground text-lg text-balance">
            Three 20 ft containers already on the farm become identical farm-stay studios: bed, kitchen,
            shower and a roof terrace. Every part is cut, drilled and numbered in Kigali, then assembled
            on site, the IKEA way.
          </p>
          <Button asChild variant="outline">
            <Link href="/docs/studio">Read the design package</Link>
          </Button>
        </div>
        <div className="overflow-hidden rounded-xl border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${D}/render/studio-cutaway.jpg`} width={1600} height={1000} loading="lazy"
            alt="Cutaway with the roof and front wall removed: queen bed, kitchen with induction hob and sink, table and stools, and the bathroom with a walk-in shower."
            className="h-auto w-full" />
        </div>
      </section>

      <section className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border md:grid-cols-4">
        {[
          ["13.1 m²", "net floor per studio"],
          ["11 kits", `${sheets} sheets per studio`],
          ["56 sheets", "drawings, generated"],
          [rwf(totals.unit_with_contingency), "per studio, placeholder prices"],
        ].map(([v, l]) => (
          <div key={l} className="bg-background p-5">
            <div className="text-2xl font-semibold tracking-tight">{v}</div>
            <div className="text-muted-foreground mt-1 text-sm">{l}</div>
          </div>
        ))}
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold tracking-tight">What each studio has</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-xl border p-5">
              <h3 className="font-medium">{f.title}</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="model" className="mt-16 scroll-mt-20">
        <h2 className="text-2xl font-semibold tracking-tight">The studio in 3D</h2>
        <p className="text-muted-foreground mt-2">
          Switch layers, pull the kits apart, replay the assembly step by step, and tap a part to see its number.
        </p>
        <StudioViewer src={`${D}/model/studio.glb`} parts={`${D}/model/parts.json`} poster={`${D}/model/studio-poster.svg`}
          title="Container studio, Layout A" />
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold tracking-tight">Built the IKEA way</h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-5">
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
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold tracking-tight">Drawings</h2>
        <div className="mt-2 grid gap-x-6 md:grid-cols-2">
          {SHEETS.map(([id, title]) => (
            <Figure key={id} src={`${D}/drawings/${id}.svg`} caption={`${id.toUpperCase()} · ${title}`} />
          ))}
        </div>
      </section>

      <section className="mt-16 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border p-6">
          <h2 className="text-xl font-semibold tracking-tight">Downloads</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              ["A3 drawing set (PDF)", `${D}/pdf/studio-drawing-set-A3.pdf`],
              ["A4 assembly manual (PDF)", `${D}/pdf/studio-assembly-manual-A4.pdf`],
              ["1:1 drilling templates (PDF)", `${D}/pdf/studio-drilling-templates-1to1.pdf`],
              ["Bill of materials (XLSX)", `${D}/data/bom.xlsx`],
              ["Cut list (CSV)", `${D}/data/cut-list.csv`],
              ["3D model (GLB)", `${D}/model/studio.glb`],
            ].map(([l, h]) => (
              <li key={h}>
                <a href={h} download className="font-medium underline underline-offset-4">{l}</a>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border p-6">
          <h2 className="text-xl font-semibold tracking-tight">Status</h2>
          <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
            Preliminary. Openings are scaled from a photo, so nothing is cut until all three containers are
            measured. Prices are placeholders until three quotes per line: about {rwf(totals.three_units_total)} for
            all three studios with the shared septic, water and power works. A structural engineer signs the roof
            terrace before guests use it.
          </p>
          <Button asChild variant="outline" className="mt-4">
            <Link href="/docs/studio-site">See the survey sheet</Link>
          </Button>
        </div>
      </section>
      </div>
    </main>
  )
}
