import { cn } from "@/lib/utils"

import { Arrival } from "./arrival"
import { copy } from "./copy"
import { Dusk } from "./dusk"
import { Enquire } from "./enquire"
import { display } from "./fonts"
import { Footer } from "./footer"
import { Header } from "./header"
import { Hero } from "./hero"
import { Location } from "./location"
import { OpenStudy } from "./open-study"
import { SitePlan } from "./site-plan"
import { Stay } from "./stay"
import { Today } from "./today"
import { Work } from "./work"

// The Digital Farm homepage: a walk from the public road into the courtyard, then the plan in
// the open (D-017, D-018). data-theme="farm" scopes the palette in globals.css; images come
// from assets.generated.ts and fall back to labelled placeholders until each render exists.
export function HomeContent() {
  return (
    <div data-theme="farm" className={cn(display.variable, "bg-background text-foreground flex flex-1 flex-col")}>
      <a
        href="#way-in"
        className="bg-chalk text-soil sr-only z-[60] rounded-full px-4 py-2 text-sm font-medium focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        {copy.skip}
      </a>
      <Header title={copy.hero.title} nav={copy.nav} cta={copy.cta} menu={copy.menu} />
      <main>
        <Hero />
        <Arrival />
        <SitePlan />
        <Stay />
        <Work />
        <Dusk />
        <Today />
        <Location />
        <OpenStudy />
        <Enquire />
      </main>
      <Footer />
    </div>
  )
}
