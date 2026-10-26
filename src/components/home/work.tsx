import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { copy } from "./copy"
import { Render } from "./render"
import { SectionHead } from "./section-head"

export function Work() {
  const { eyebrow, title, office, study, digital } = copy.work
  return (
    <section id="learn" aria-labelledby="learn-title" className="bg-background pb-24 md:pb-32">
      <SectionHead id="learn-title" eyebrow={eyebrow} title={title} />
      <div className="mx-auto mt-14 grid max-w-7xl gap-12 px-4 md:mt-20 md:grid-cols-2 md:gap-8 md:px-8">
        {[
          { id: "office" as const, text: office },
          { id: "study" as const, text: study },
        ].map(({ id, text }, i) => (
          <article key={id} className={i === 1 ? "farm-reveal md:mt-24" : "farm-reveal"}>
            <Render id={id} sizes="(min-width: 768px) 50vw, 100vw" className="aspect-[4/3] rounded-2xl" />
            <p className="text-leaf mt-6 font-mono text-xs tracking-[0.22em] uppercase">{text.tag}</p>
            <h3 className="font-display mt-2 text-4xl leading-none font-normal">{text.title}</h3>
            <p className="text-muted-foreground mt-3 max-w-lg text-lg text-pretty">{text.text}</p>
          </article>
        ))}
        <Render id="classroom" sizes="100vw" className="farm-reveal aspect-[16/9] rounded-2xl md:col-span-2 lg:aspect-[21/9]" />
      </div>

      <div className="mx-auto mt-24 max-w-7xl px-4 md:mt-32 md:px-8">
        <div className="bg-soil text-chalk farm-reveal grid gap-8 rounded-3xl p-8 md:grid-cols-12 md:p-14">
          <p className="text-saffron font-mono text-xs tracking-[0.22em] uppercase md:col-span-12">{digital.eyebrow}</p>
          <p className="font-display text-4xl leading-[1.02] text-balance md:col-span-7 md:text-6xl">{digital.title}</p>
          <div className="flex flex-col gap-6 md:col-span-5 md:self-end">
            <p className="text-chalk/80 text-lg text-pretty">{digital.text}</p>
            <Link
              href="/docs"
              className="text-saffron inline-flex items-center gap-1 self-start font-medium underline-offset-4 hover:underline"
            >
              {digital.link}
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
