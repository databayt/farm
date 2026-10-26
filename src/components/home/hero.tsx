import { getImageProps } from "next/image"
import { ArrowDown } from "lucide-react"

import { AmbientVideo } from "./ambient-video"
import { ASSETS } from "./assets"
import { IMAGES, VIDEOS } from "./assets.generated"
import { copy } from "./copy"
import { EDGE_LEFT, EDGE_RIGHT } from "./edges"
import { Caption, Pending } from "./render"

// The LCP image: an art-directed <picture> (the upright still on portrait phones) fetched with
// high priority. getImageProps can't carry a blur placeholder, so the LQIP is the wrapper's
// background and the photo fades in when the root layout's listener stamps data-loaded.
function HeroPicture() {
  const land = IMAGES.gate
  if (!land) return <Pending id="gate" className="items-end justify-start pt-28 pr-6 text-right md:pr-10" />
  const upright = IMAGES["gate-portrait"]
  const alt = ASSETS.gate.alt
  const uprightSet = upright
    ? getImageProps({ src: upright.src, width: upright.width, height: upright.height, alt, sizes: "100vw" }).props.srcSet
    : undefined
  const { props } = getImageProps({
    src: land.src,
    width: land.width,
    height: land.height,
    alt,
    sizes: "100vw",
    loading: "eager",
    fetchPriority: "high",
  })
  return (
    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${land.blurDataURL}")` }}>
      <picture>
        {uprightSet ? <source media="(orientation: portrait)" srcSet={uprightSet} sizes="100vw" /> : null}
        <img
          {...props}
          alt={alt}
          data-blur-up="plain"
          className="farm-settle absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-700 data-[loaded]:opacity-100 motion-reduce:opacity-100"
        />
      </picture>
    </div>
  )
}

export function Hero() {
  const { eyebrow, title, lead, walk, film } = copy.hero
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="bg-soil text-chalk relative isolate flex h-[100svh] min-h-[600px] flex-col justify-end overflow-hidden"
    >
      <HeroPicture />
      <AmbientVideo
        landscape={VIDEOS.hero?.src}
        portrait={VIDEOS["hero-portrait"]?.src}
        attach="load"
        label={film}
        controlsClassName={`absolute bottom-5 z-10 ${EDGE_RIGHT}`}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgb(43_42_38/0.7)_0%,rgb(43_42_38/0)_28%,rgb(43_42_38/0.1)_50%,rgb(43_42_38/0.88)_100%)]"
      />
      {/* The header turns solid once this line scrolls past the top. */}
      <div id="hero-sentinel" aria-hidden className="pointer-events-none absolute inset-x-0 top-[60%] h-px" />

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-24 md:px-8 md:pb-28">
        <p className="farm-intro text-chalk/80 font-mono text-xs tracking-[0.25em] uppercase">{eyebrow}</p>
        <h1
          id="hero-title"
          className="farm-intro font-display mt-4 text-[clamp(4.5rem,14vw,11rem)] leading-[0.82] font-normal tracking-tight"
        >
          {title}
        </h1>
        <p className="farm-intro-2 text-chalk/90 mt-6 max-w-xl text-lg text-pretty md:text-xl">{lead}</p>
        <div className="farm-intro-3 mt-8 flex flex-wrap gap-3">
          <a
            href="#way-in"
            className="bg-chalk text-soil inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-medium transition-colors hover:bg-white"
          >
            {walk}
            <ArrowDown className="size-4" aria-hidden />
          </a>
          <a
            href="#enquire"
            className="ring-chalk/50 hover:bg-chalk/10 inline-flex h-12 items-center rounded-full px-6 text-sm font-medium ring-1 transition-colors ring-inset"
          >
            {copy.cta}
          </a>
        </div>
      </div>
      <p className={`absolute bottom-7 ${EDGE_LEFT}`}>
        <Caption>{VIDEOS.hero ? copy.captions.film : copy.captions.render}</Caption>
      </p>
    </section>
  )
}
