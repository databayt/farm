import { Droplets, Flame, Trash2, Zap } from "lucide-react"

import { localeHref } from "@/components/internationalization/href"
import { getLocale } from "@/components/internationalization/locale"

import { words } from "./words"

// The farm's four services (D-062): one card each, its advice in a line, a few facts, and its guide under /docs/farm.
// Plain links and no client code, as the index below; the words are in words.ts, the facts sourced in each guide.
const SERVICES = [
  { id: "electric", icon: Zap, href: "/docs/farm/electric" },
  { id: "water", icon: Droplets, href: "/docs/farm/water" },
  { id: "waste", icon: Trash2, href: "/docs/farm/waste" },
  { id: "gas", icon: Flame, href: "/docs/farm/gas" },
] as const

export async function Services() {
  const lang = await getLocale()
  const { title, lead, guide, note, cards } = words[lang].services
  return (
    <section id="services" aria-labelledby="services-title" className="px-4 pt-10 pb-6 md:px-10">
      <h2 id="services-title" className="text-3xl font-semibold tracking-tight">
        {title}
      </h2>
      <p className="text-muted-foreground mt-3 max-w-2xl text-sm">{lead}</p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map(({ id, icon: Icon, href }) => {
          const card = cards[id]
          return (
            <li key={id} className="border-border flex flex-col rounded-lg border p-5">
              <Icon aria-hidden className="size-6" strokeWidth={1.5} />
              <h3 className="mt-4 text-lg font-semibold">{card.title}</h3>
              <p className="mt-2 text-sm">{card.line}</p>
              <ul className="text-muted-foreground mt-4 flex-1 space-y-2 text-sm">
                {card.facts.map((fact) => (
                  <li key={fact} className="border-border border-t pt-2">
                    {fact}
                  </li>
                ))}
              </ul>
              <a href={localeHref(lang, href)} className="mt-5 text-sm font-medium underline underline-offset-4">
                {guide}
              </a>
            </li>
          )
        })}
      </ul>
      <p className="text-muted-foreground mt-4 text-sm">{note}</p>
    </section>
  )
}
