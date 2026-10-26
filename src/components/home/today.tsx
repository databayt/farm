import { cn } from "@/lib/utils"

import { Compare } from "./compare"
import { copy } from "./copy"
import { Render } from "./render"
import { SectionHead } from "./section-head"

const LAYOUT = [
  { span: "lg:col-span-5", sizes: "(min-width: 1024px) 40vw, 100vw" },
  { span: "lg:col-span-7 lg:self-end", sizes: "(min-width: 1024px) 58vw, 100vw" },
  { span: "lg:col-span-12", sizes: "100vw" },
]

// The real photographs, each against the plan from the same viewpoint (D-018).
export function Today() {
  const { eyebrow, title, lead, planned, pairs } = copy.today
  return (
    <section id="today" aria-labelledby="today-title" className="bg-muted py-24 md:py-32">
      <SectionHead id="today-title" eyebrow={eyebrow} title={title} lead={lead} />
      <div className="mx-auto mt-14 grid max-w-7xl gap-12 px-4 md:mt-20 md:px-8 lg:grid-cols-12 lg:gap-8">
        {pairs.map((pair, i) => (
          <figure key={pair.today} className={cn("farm-reveal", LAYOUT[i].span)}>
            <Compare
              className={pair.ratio}
              label={`${pair.title}: today and as planned`}
              beforeLabel={copy.captions.today}
              afterLabel={planned}
              before={<Render id={pair.today} sizes={LAYOUT[i].sizes} caption={false} className="absolute inset-0" />}
              after={<Render id={pair.planned} sizes={LAYOUT[i].sizes} caption={false} className="absolute inset-0" />}
            />
            <figcaption className="mt-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <span className="font-display text-2xl">{pair.title}</span>
              <span className="text-muted-foreground font-mono text-[11px] tracking-[0.18em] uppercase">
                {copy.captions.today} · {copy.captions.render}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
