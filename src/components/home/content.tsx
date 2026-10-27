import { Arrival } from "./arrival"
import { copy } from "./copy"
import { CourtyardFilm } from "./courtyard-film"
import { Dusk } from "./dusk"
import { Enquire } from "./enquire"
import { Footer } from "./footer"
import { Header } from "./header"
import { Hero } from "./hero"
import { Location } from "./location"
import { Model } from "./model"
import { OpenStudy } from "./open-study"
import { Plans } from "./plans"
import { Stay } from "./stay"
import { Today, todayPairs } from "./today"
import { Work } from "./work"

// The Digital Farm homepage: the compound in 2D and 3D under the hero, as /en/studio shows the
// studio (D-022), then a walk from the public road into the courtyard and the plan in the open
// (D-017, D-018). data-theme="farm" scopes the palette in globals.css; images come
// from assets.generated.ts: concept renders where they exist, frames of the footage labelled
// "Today" where they don't yet (D-019), and labelled placeholders where neither exists.
export function HomeContent() {
  // The Today section waits for the "-planned" renders, and its link with it.
  const nav = copy.nav.filter((link) => link.href !== "#today" || todayPairs.length > 0)
  return (
    <div data-theme="farm" className="bg-background text-foreground flex flex-1 flex-col">
      <a
        href="#plans"
        className="bg-chalk text-soil sr-only z-[60] rounded-full px-4 py-2 text-sm font-medium focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        {copy.skip}
      </a>
      <Header title={copy.hero.title} nav={nav} menu={copy.menu} cta={{ href: "#enquire", label: copy.cta }} />
      <main>
        <Hero />
        <Plans />
        <Model />
        <Arrival />
        <CourtyardFilm />
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
