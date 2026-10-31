import { getLocale } from "@/components/internationalization/locale"
import { getNav } from "@/components/site/nav"

import { copy } from "./copy"
import { Header } from "./header"
import { Hero } from "./hero"
import { Model } from "./model"
import { Plans } from "./plans"
import { References } from "./references"

// The Digital Farm homepage: the hero, then the compound in 2D and 3D, as /en/studio shows the
// studio (D-022), and an index of every page and guide. data-theme="farm" scopes the palette in globals.css.
export async function HomeContent() {
  const lang = await getLocale()
  const nav = await getNav(lang)
  return (
    <div data-theme="farm" className="bg-background text-foreground flex flex-1 flex-col">
      <a
        href="#plans"
        className="bg-chalk text-soil sr-only z-[60] rounded-full px-4 py-2 text-sm font-medium focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        {copy.skip}
      </a>
      <Header nav={nav} />
      {/* the homepage's words are English until their Kinyarwanda is written (the hero's notice says so on /rw) */}
      <main lang={lang === "en" ? undefined : "en"}>
        <Hero />
        <Plans />
        <Model />
        <References />
      </main>
    </div>
  )
}
