import { copy } from "./copy"
import { Header } from "./header"
import { Hero } from "./hero"
import { Model } from "./model"
import { Plans } from "./plans"
import { References } from "./references"

// The Digital Farm homepage: the hero, then the compound in 2D and 3D, as /en/studio shows the
// studio (D-022), and an index of every page and guide. data-theme="farm" scopes the palette in globals.css.
export function HomeContent() {
  return (
    <div data-theme="farm" className="bg-background text-foreground flex flex-1 flex-col">
      <a
        href="#plans"
        className="bg-chalk text-soil sr-only z-[60] rounded-full px-4 py-2 text-sm font-medium focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        {copy.skip}
      </a>
      <Header title={copy.hero.title} menu={copy.menu} />
      <main>
        <Hero />
        <Plans />
        <Model />
        <References />
      </main>
    </div>
  )
}
