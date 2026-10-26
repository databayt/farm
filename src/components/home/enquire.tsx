import { MessageCircle } from "lucide-react"

import { whatsappHref } from "./config"
import { copy } from "./copy"
import { SectionHead } from "./section-head"

// No form and nothing stored on the site: interest goes to WhatsApp (D-018). Until the number
// is set the live page says the line opens soon, and development builds flag the gap.
export function Enquire() {
  const { eyebrow, title, text, button, later, missing } = copy.enquire
  return (
    <section id="enquire" aria-labelledby="enquire-title" className="bg-soil text-chalk py-24 md:py-32">
      <SectionHead id="enquire-title" eyebrow={eyebrow} title={title} lead={text} dark />
      <div className="mx-auto mt-10 max-w-7xl px-4 md:mt-14 md:px-8">
        {whatsappHref ? (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener"
            className="bg-saffron text-soil inline-flex h-14 items-center gap-3 rounded-full px-7 text-base font-medium transition-[filter] hover:brightness-110"
          >
            <MessageCircle className="size-5" aria-hidden />
            {button}
          </a>
        ) : process.env.NODE_ENV === "development" ? (
          <p className="border-saffron/60 text-saffron inline-flex rounded-full border border-dashed px-4 py-2 font-mono text-xs">
            {missing}
          </p>
        ) : (
          <p className="text-chalk/75 text-lg">{later}</p>
        )}
      </div>
    </section>
  )
}
