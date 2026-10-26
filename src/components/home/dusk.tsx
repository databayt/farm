import { AmbientVideo } from "./ambient-video"
import { VIDEOS } from "./assets.generated"
import { copy } from "./copy"
import { EDGE_LEFT, EDGE_RIGHT } from "./edges"
import { Caption, Render } from "./render"

export function Dusk() {
  const { label, line, film } = copy.dusk
  return (
    <section aria-label={label} className="bg-soil text-chalk relative isolate h-[90svh] min-h-[520px] overflow-hidden">
      <Render id="dusk" sizes="100vw" caption={false} className="absolute inset-0" />
      <AmbientVideo
        landscape={VIDEOS.evening?.src}
        label={film}
        controlsClassName={`absolute bottom-5 z-10 ${EDGE_RIGHT}`}
      />
      <div aria-hidden className="from-soil/85 via-soil/10 to-soil/30 pointer-events-none absolute inset-0 bg-gradient-to-t" />
      <p className={`absolute top-6 ${EDGE_LEFT}`}>
        <Caption>{VIDEOS.evening ? copy.captions.film : copy.captions.render}</Caption>
      </p>
      <div className="relative mx-auto flex h-full max-w-7xl items-end px-4 pb-20 md:px-8">
        <p className="font-display farm-reveal max-w-4xl text-4xl leading-[1.02] text-balance md:text-7xl">{line}</p>
      </div>
    </section>
  )
}
