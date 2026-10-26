import { AmbientVideo } from "./ambient-video"
import { VIDEOS } from "./assets.generated"
import { copy } from "./copy"
import { EDGE_LEFT, EDGE_RIGHT } from "./edges"
import { PlanExplorer } from "./plan-explorer"
import { Caption, Render } from "./render"
import { SectionHead } from "./section-head"
import { SitePlanMap } from "./site-plan-map"

export function SitePlan() {
  const { eyebrow, title, lead, note, mapLabel, items, band, film } = copy.compound
  const cards = items.map((item) => (
    <article key={item.id}>
      <Render id={item.image} sizes="(min-width: 1024px) 34vw, 100vw" className="aspect-[4/3] rounded-2xl" />
      <p className="text-leaf mt-6 font-mono text-xs tracking-[0.22em] uppercase">
        {item.n.padStart(2, "0")} · {item.tag}
      </p>
      <h3 className="font-display mt-2 text-4xl leading-none font-normal">{item.title}</h3>
      <p className="text-muted-foreground mt-3 text-lg text-pretty">{item.text}</p>
    </article>
  ))

  return (
    <section id="compound" aria-labelledby="compound-title" className="bg-muted pt-24 md:pt-32">
      <SectionHead id="compound-title" eyebrow={eyebrow} title={title} lead={lead} />
      <div className="mx-auto mt-12 max-w-7xl px-4 md:mt-16 md:px-8">
        <PlanExplorer
          spots={items.map(({ id, n, title, x, y }) => ({ id, n, title, x, y }))}
          cards={cards}
          map={<SitePlanMap title={mapLabel} />}
          note={note}
          initial={items.findIndex((item) => item.id === "courtyard")}
        />
      </div>

      <div className="bg-soil text-chalk relative isolate mt-24 h-[80svh] min-h-[480px] overflow-hidden md:mt-32">
        <Render id="aerial" sizes="100vw" caption={false} className="absolute inset-0" />
        <AmbientVideo
          landscape={VIDEOS.orbit?.src}
          label={film}
          controlsClassName={`absolute bottom-5 z-10 ${EDGE_RIGHT}`}
        />
        <div aria-hidden className="from-soil/80 pointer-events-none absolute inset-0 bg-gradient-to-t via-transparent to-transparent" />
        <p className={`absolute top-6 ${EDGE_LEFT}`}>
          <Caption>{VIDEOS.orbit ? copy.captions.film : copy.captions.render}</Caption>
        </p>
        <div className="relative mx-auto flex h-full max-w-7xl items-end px-4 pb-20 md:px-8">
          <p className="font-display farm-reveal max-w-3xl text-3xl leading-[1.05] text-balance md:text-5xl">{band}</p>
        </div>
      </div>
    </section>
  )
}
