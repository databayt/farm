import Link from "next/link"

import { copy } from "./copy"

export function Footer() {
  const { place, note, links, credit } = copy.footer
  return (
    <footer className="bg-soil text-chalk/70 border-chalk/10 border-t">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-12 md:px-8">
        <div className="md:col-span-5">
          <p className="font-display text-chalk text-4xl leading-none">{copy.hero.title}</p>
          <p className="mt-3 font-mono text-[11px] tracking-[0.2em] uppercase">{place}</p>
        </div>
        <nav aria-label="More from the farm" className="flex flex-col gap-2 text-sm md:col-span-3">
          {links.map((link) =>
            link.href.startsWith("http") ? (
              <a key={link.href} href={link.href} target="_blank" rel="noopener" className="hover:text-chalk w-fit">
                {link.label}
              </a>
            ) : (
              <Link key={link.href} href={link.href} className="hover:text-chalk w-fit">
                {link.label}
              </Link>
            ),
          )}
        </nav>
        <div className="flex flex-col gap-3 text-sm md:col-span-4">
          <p className="text-pretty">{note}</p>
          <p>{credit}</p>
        </div>
      </div>
    </footer>
  )
}
