import { getImageProps } from "next/image"
import { Cormorant_Garamond } from "next/font/google"
import { ArrowDown, MoveRight, Play } from "lucide-react"

import { copy } from "./copy"
import { HERO } from "./hero.generated"

// The guide's headline face: a fine, high-contrast serif in capitals. Only the hero uses it.
const display = Cormorant_Garamond({ subsets: ["latin"], weight: "500", display: "swap" })

const ALT = "The lawn above the lake under tall pines and a palm, the far shore wooded in late light"

// One photo per shape, as an art-directed <picture>: the upright cut on portrait screens. The LQIP
// is the wrapper's background, and the photo shows as soon as it decodes (it is the first image).
function HeroPicture() {
  const { desktop, mobile } = HERO
  const upright = getImageProps({ src: mobile.src, width: mobile.width, height: mobile.height, alt: ALT, sizes: "100vw" })
  const { props } = getImageProps({
    src: desktop.src,
    width: desktop.width,
    height: desktop.height,
    alt: ALT,
    sizes: "100vw",
    loading: "eager",
    fetchPriority: "high",
  })
  return (
    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${desktop.blurDataURL}")` }}>
      <picture>
        <source media="(orientation: portrait)" srcSet={upright.props.srcSet} sizes="100vw" />
        <img {...props} alt={ALT} className="farm-settle absolute inset-0 size-full object-cover" />
      </picture>
    </div>
  )
}

export function Hero() {
  const { headline, walk, watch, scroll } = copy.hero
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="bg-soil text-chalk relative isolate flex h-[100svh] min-h-[600px] flex-col justify-end overflow-hidden"
    >
      <HeroPicture />
      {/* A little shade at the top for the header; the words get theirs from the band below. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/45 to-transparent"
      />
      {/* The header turns solid once this line scrolls past the top. */}
      <div id="hero-sentinel" aria-hidden className="pointer-events-none absolute inset-x-0 top-[60%] h-px" />

      {/* Placed as on /en/studio: bottom left, on a band that darkens toward the foot, at the page's
          edge padding (px-4, md:px-10), not in a centred column. */}
      <div className="relative w-full bg-gradient-to-t from-black/70 via-black/35 to-transparent px-4 pt-24 pb-10 md:px-10 md:pb-14">
        <h1
          id="hero-title"
          className={`${display.className} farm-intro text-[clamp(3rem,7vw,6rem)] leading-[0.95] font-medium tracking-[0.01em] uppercase drop-shadow-[0_2px_24px_rgb(0_0_0/0.25)]`}
        >
          {headline.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
        <div className="farm-intro-3 mt-8 flex flex-wrap items-center gap-x-10 gap-y-5 text-[15px] tracking-[0.02em] uppercase">
          <a
            href="#way-in"
            className="text-soil inline-flex h-14 items-center gap-5 bg-[rgb(214_207_190/0.92)] px-7 backdrop-blur-sm transition-colors hover:bg-[rgb(226_220_205)]"
          >
            {walk}
            <MoveRight className="size-6" strokeWidth={1.5} aria-hidden />
          </a>
          <a href="#film" className="group inline-flex items-center gap-3">
            <span className="decoration-chalk/70 group-hover:decoration-chalk underline decoration-1 underline-offset-[7px]">
              {watch}
            </span>
            <Play className="size-3.5" strokeWidth={1.5} aria-hidden />
          </a>
        </div>
      </div>

      <a
        href="#plans"
        className="farm-intro-3 absolute inset-x-0 bottom-8 mx-auto hidden w-fit items-center gap-2 text-xs tracking-[0.12em] uppercase opacity-90 transition-opacity hover:opacity-100 lg:inline-flex"
      >
        {scroll}
        <ArrowDown className="size-3.5" aria-hidden />
      </a>
    </section>
  )
}
