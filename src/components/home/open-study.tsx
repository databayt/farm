import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { copy } from "./copy"
import { SectionHead } from "./section-head"

export function OpenStudy() {
  const { eyebrow, title, text, links, note } = copy.open
  return (
    <section aria-labelledby="open-title" className="bg-muted py-24 md:py-32">
      <SectionHead id="open-title" eyebrow={eyebrow} title={title} lead={text} />
      <div className="mx-auto mt-12 grid max-w-7xl gap-4 px-4 md:mt-16 md:grid-cols-2 md:px-8">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group bg-card hover:border-soil/30 farm-reveal flex items-start justify-between gap-6 rounded-2xl border p-6 transition-colors md:p-8"
          >
            <span>
              <span className="font-display block text-3xl leading-tight">{link.title}</span>
              <span className="text-muted-foreground mt-2 block">{link.text}</span>
            </span>
            <ArrowUpRight
              className="size-6 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden
            />
          </Link>
        ))}
      </div>
      <p className="text-muted-foreground mx-auto mt-8 max-w-7xl px-4 text-sm text-pretty md:px-8">{note}</p>
    </section>
  )
}
