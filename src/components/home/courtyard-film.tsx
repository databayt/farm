import { AmbientVideo } from "./ambient-video"
import { IMAGES, VIDEOS } from "./assets.generated"
import { copy } from "./copy"
import { EDGE_LEFT, EDGE_RIGHT } from "./edges"
import { Caption, ClipPicture, captionFor } from "./render"

// The courtyard on film between the way in and the rooms: the orbit clip over its first frame, or the
// aerial still, labelled planned or today like every picture on the page.
export function CourtyardFilm() {
  const { band, film } = copy.courtyard
  const shown = (VIDEOS.orbit ?? IMAGES.aerial)?.source
  return (
    <div id="film" className="bg-soil text-chalk relative isolate scroll-mt-14 h-[80svh] min-h-[480px] overflow-hidden">
      <ClipPicture clip="orbit" upright="orbit-portrait" />
      <AmbientVideo
        landscape={VIDEOS.orbit?.src}
        portrait={VIDEOS["orbit-portrait"]?.src}
        label={film}
        controlsClassName={`absolute bottom-5 z-10 ${EDGE_RIGHT}`}
      />
      <div aria-hidden className="from-soil/80 pointer-events-none absolute inset-0 bg-gradient-to-t via-transparent to-transparent" />
      <p className={`absolute top-6 ${EDGE_LEFT}`}>
        <Caption>{captionFor(shown, Boolean(VIDEOS.orbit))}</Caption>
      </p>
      <div className="relative mx-auto flex h-full max-w-7xl items-end px-4 pb-20 md:px-8">
        <p className="font-display farm-reveal max-w-3xl text-3xl leading-[1.05] text-balance md:text-5xl">
          {shown === "today" ? band.today : band.planned}
        </p>
      </div>
    </div>
  )
}
