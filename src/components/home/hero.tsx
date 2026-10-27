import { ArrowDown } from "lucide-react"

import { AmbientVideo } from "./ambient-video"
import { VIDEOS } from "./assets.generated"
import { copy } from "./copy"
import { ClipPicture } from "./render"

export function Hero() {
  const { headline, walk, film } = copy.hero
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="bg-soil text-chalk relative isolate flex h-[100svh] min-h-[600px] flex-col justify-end overflow-hidden"
    >
      <ClipPicture
        clip="hero"
        upright="hero-portrait"
        preload
        pendingClassName="items-end justify-start pt-28 pr-6 text-right md:pr-10"
      />
      <AmbientVideo
        landscape={VIDEOS.hero?.src}
        portrait={VIDEOS["hero-portrait"]?.src}
        attach="load"
        label={film}
        controls={false}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgb(43_42_38/0.7)_0%,rgb(43_42_38/0)_28%,rgb(43_42_38/0.1)_50%,rgb(43_42_38/0.88)_100%)]"
      />
      {/* The header turns solid once this line scrolls past the top. */}
      <div id="hero-sentinel" aria-hidden className="pointer-events-none absolute inset-x-0 top-[60%] h-px" />

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-24 md:px-8 md:pb-28">
        <h1
          id="hero-title"
          className="farm-intro font-mono text-[clamp(3.5rem,11vw,9rem)] leading-[0.95] font-bold tracking-[-0.05em]"
        >
          {headline.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
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
    </section>
  )
}
