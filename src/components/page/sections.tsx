import type * as React from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { BlurImg } from "@/components/atom/blur-img"
import { ItemRail, type RailItem } from "@/components/docs/item-rail"
import { Button } from "@/components/ui/button"

// The sections of every /en page, in /en/studio's pattern: a full-screen hero photo, the 2D and the 3D, then the
// rails, the services and the docs cards. One copy here keeps the twelve pages identical in spacing, type and
// dark-mode handling. No page carries a table: each place's points, schedules and status live on its docs pages
// (src/components/<place>/docs-sections.tsx), linked from its tags and its docs cards.

// The first screen. `className` sets the box's colour while the photo loads, `imgClassName` its focus
// (object-[x_y]); the words sit bottom-left, so the photo keeps its subject centre-right. The sentinel tells the
// header (components/home/header.tsx) when the hero has mostly scrolled away.
export function PageHero({ src, width, height, alt, title, className, imgClassName }: {
  src: string; width: number; height: number; alt: string; title: React.ReactNode; className?: string; imgClassName?: string
}) {
  return (
    <section className={cn("relative h-svh min-h-[520px] w-full overflow-hidden", className)}>
      <BlurImg src={src} width={width} height={height} fetchPriority="high" alt={alt}
        className={cn("absolute inset-0 size-full object-cover", imgClassName)} />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/45 to-transparent" />
      <div id="hero-sentinel" aria-hidden className="pointer-events-none absolute inset-x-0 top-[60%] h-px" />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/35 to-transparent">
        <div className="w-full px-4 pt-24 pb-10 md:px-10 md:pb-14">
          <p className="text-sm text-white/80">Digital Farm</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-balance text-white md:text-6xl">{title}</h1>
          <Button asChild className="mt-6">
            <Link href="/#enquire">Book it now</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

// A full-screen drawing under a plain title: the 2D plan, or any drawing in its pattern. The drawing is black on
// transparent (an SVG in currentColor, or an image inverted in dark mode). `full`: the drawing takes the section's
// full width and the section grows to fit it, for a drawing too square to fill the width within one screen.
export function DrawingSection({ id, title, children, after, full = false }: {
  id: string; title: string; children: React.ReactNode; after?: React.ReactNode; full?: boolean
}) {
  return (
    <section id={id}>
      <div className={cn("flex flex-col px-4 pt-10 pb-6 md:px-10", !full && "lg:h-svh lg:min-h-[560px]")}>
        <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>
        <div className="mt-6 flex min-h-0 flex-1 items-center justify-center">{children}</div>
      </div>
      {after}
    </section>
  )
}

// A rail card's placeholders, in the studio's words, until the piece is sourced or quoted.
export const NOT_SOURCED = "Not sourced yet"
export const NOT_BUDGETED = "Not in the budget yet"

// A rail's cards in the studio's Bed rail pattern: each piece rendered on its own (`dir`/<id>.webp), with its size,
// where to buy it and what it costs.
export type RailCard = { id: string; title: string; size: string; where?: string; cost?: string; note?: string; alt?: string }
export function railCards(dir: string, rows: RailCard[]): RailItem[] {
  return rows.map((x) => ({
    src: `${dir}/${x.id}.webp`, alt: x.alt ?? x.title, title: x.title, note: x.note,
    details: [{ label: "Dimensions", value: x.size }, { label: "Where to buy", value: x.where ?? NOT_SOURCED },
      { label: "Cost", value: x.cost ?? NOT_BUDGETED }],
  }))
}

// A rail of product cards under a plain title (the studio's Bed, Seating, Galley and Bath; the field's Crops):
// the card in focus shows its size, source and cost below.
export function RailSection({ id, title, items }: { id: string; title: string; items: RailItem[] }) {
  return (
    <section id={id} className="pt-10 pb-10">
      <h2 className="px-4 text-3xl font-semibold tracking-tight md:px-10">{title}</h2>
      <div className="mt-6">
        <ItemRail items={items} />
      </div>
    </section>
  )
}

// A service in the studio's Electric and Plumbing pattern: a plain title over the system drawn inline full width
// (`diagram`), then the installation in the 3D view's camera with every point tagged (`figure`, a TaggedFigure,
// and `note` under it), the finished view rendered (`real`), then each part on its own (`rail`).
export function ServiceSection({ id, title, diagram, figure, note, real, rail }: {
  id: string; title: string; diagram: React.ReactNode; figure?: React.ReactNode; note?: React.ReactNode
  real?: { src: string; width: number; height: number; alt: string; caption: React.ReactNode }; rail?: RailItem[]
}) {
  return (
    <section id={id} className="scroll-mt-20 border-t">
      <div className="px-4 pt-10 pb-10 md:px-10">
        <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>
        <div className="mt-6 overflow-x-auto">{diagram}</div>
      </div>
      {figure ? (
        <div className="px-4 pb-6 md:px-10">
          <div className="overflow-x-auto">
            <div className="min-w-[960px]">{figure}</div>
          </div>
          {note ? <p className="text-muted-foreground mt-3 max-w-4xl text-sm text-balance">{note}</p> : null}
        </div>
      ) : null}
      {real ? (
        <figure className="px-4 pb-10 md:px-10">
          <div className="overflow-hidden">
            <BlurImg src={real.src} width={real.width} height={real.height} loading="lazy" alt={real.alt} className="h-auto w-full" />
          </div>
          <figcaption className="text-muted-foreground mt-2 text-sm">{real.caption}</figcaption>
        </figure>
      ) : null}
      {rail ? (
        <div className="pb-10">
          <ItemRail items={rail} />
        </div>
      ) : null}
    </section>
  )
}

// The page's last section: the execution plan, then a card for each docs page that holds the reference behind it,
// the place's own first. Five at most, so they keep to one row.
export type DocCard = { href: string; title: string; text: string }
const PLAN: DocCard = { href: "/docs/first-90-days", title: "Execution plan", text: "The first 90 days, gate by gate and week by week, then the five-year roadmap." }
export function DocsSection({ cards: own }: { cards: DocCard[] }) {
  const cards = [PLAN, ...own]
  return (
    <section id="docs" className="scroll-mt-20 border-t py-16">
      <div className="w-full px-4 md:px-10">
        <h2 className="text-3xl font-semibold tracking-tight">In the docs</h2>
        <div className={cn("mt-6 grid gap-4 sm:grid-cols-2", cards.length >= 5 ? "lg:grid-cols-5" : cards.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3")}>
          {cards.map((d) => (
            <Link key={d.href} href={d.href} className="group hover:bg-muted/40 rounded-xl border p-5 transition-colors">
              <h3 className="font-medium">
                {/* the arrow keeps to the title's last word, so it never wraps onto a line of its own */}
                {d.title.split(" ").slice(0, -1).join(" ")}{" "}
                <span className="whitespace-nowrap">
                  {d.title.split(" ").at(-1)}{" "}
                  <ArrowRight className="text-muted-foreground inline size-4 align-[-3px] transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
                </span>
              </h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{d.text}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// The 3D: the model's line drawing full screen, then the same view rendered with materials.
export function ModelSection({ id = "model", title = "3D", line, real, width, height, lineAlt, realAlt, caption = "Rendered from the design model" }: {
  id?: string; title?: string; line: string; real: string; width: number; height: number; lineAlt: string; realAlt: string; caption?: React.ReactNode
}) {
  return (
    <DrawingSection id={id} title={title} after={
      <figure className="px-4 pb-10 md:px-10">
        <div className="overflow-hidden">
          <BlurImg src={real} width={width} height={height} loading="lazy" alt={realAlt} className="h-auto w-full" />
        </div>
        <figcaption className="text-muted-foreground mt-2 text-sm">{caption}</figcaption>
      </figure>
    }>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={line} width={width} height={height} alt={lineAlt} className="w-full object-contain lg:max-h-full dark:invert" />
    </DrawingSection>
  )
}
