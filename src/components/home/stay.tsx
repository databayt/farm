import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { copy } from "./copy"
import { Render } from "./render"
import { SectionHead } from "./section-head"

function Specs({ rows }: { rows: string[][] }) {
  return (
    <dl className="divide-y border-y">
      {rows.map(([term, value]) => (
        <div key={term} className="grid grid-cols-[7.5rem_1fr] items-baseline gap-4 py-3">
          <dt className="text-muted-foreground font-mono text-[11px] tracking-[0.18em] uppercase">{term}</dt>
          <dd className="font-display text-xl leading-tight">{value}</dd>
        </div>
      ))}
    </dl>
  )
}

export function Stay() {
  const { eyebrow, title, rooms, studios } = copy.stay
  return (
    <section id="stay" aria-labelledby="stay-title" className="bg-background py-24 md:py-32">
      <SectionHead id="stay-title" eyebrow={eyebrow} title={title} />

      {/* Guest rooms: the joined 40 ft pair */}
      <div className="mx-auto mt-14 grid max-w-7xl gap-8 px-4 md:mt-20 md:px-8 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-12">
        <Render
          id="rooms"
          sizes="(min-width: 1024px) 66vw, 100vw"
          className="farm-reveal aspect-[16/10] rounded-2xl lg:col-span-8"
        />
        <div className="farm-reveal flex flex-col gap-5 lg:col-span-4 lg:self-end">
          <h3 className="font-display text-4xl leading-none font-normal text-balance md:text-5xl">{rooms.title}</h3>
          <p className="text-muted-foreground text-lg text-pretty">{rooms.text}</p>
        </div>
        <div className="farm-reveal lg:col-span-4">
          <Specs rows={rooms.specs} />
        </div>
        <Render
          id="room"
          sizes="(min-width: 1024px) 58vw, 100vw"
          className="farm-reveal aspect-[16/10] rounded-2xl lg:col-span-7 lg:col-start-6"
        />
      </div>

      {/* Studios: two of the three 20 ft units */}
      <div className="mx-auto mt-24 grid max-w-7xl gap-8 px-4 md:mt-32 md:px-8 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-12">
        <div className="farm-reveal flex flex-col gap-5 lg:col-span-4 lg:row-start-1 lg:self-end">
          <h3 className="font-display text-4xl leading-none font-normal text-balance md:text-5xl">{studios.title}</h3>
          <p className="text-muted-foreground text-lg text-pretty">{studios.text}</p>
        </div>
        <Render
          id="studios"
          sizes="(min-width: 1024px) 66vw, 100vw"
          className="farm-reveal aspect-[16/10] rounded-2xl lg:col-span-8 lg:col-start-5 lg:row-start-1"
        />
        <Render
          id="studio"
          sizes="(min-width: 1024px) 58vw, 100vw"
          className="farm-reveal aspect-[16/10] rounded-2xl lg:col-span-7"
        />
        <div className="farm-reveal flex flex-col gap-6 lg:col-span-5">
          <Specs rows={studios.specs} />
          <div className="bg-card rounded-2xl border p-3">
            <Render id="studio-cutaway" sizes="(min-width: 1024px) 38vw, 100vw" className="aspect-[16/10] rounded-xl" />
            <p className="text-muted-foreground px-2 pt-3 pb-1 text-sm text-pretty">{studios.design}</p>
          </div>
          <Link
            href="/en/studio"
            className="text-lake inline-flex items-center gap-1 self-start font-medium underline-offset-4 hover:underline"
          >
            {studios.link}
            <ArrowUpRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  )
}
