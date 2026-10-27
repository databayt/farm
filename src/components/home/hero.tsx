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
  const { headline, walk, scroll } = copy.hero
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="bg-soil text-chalk relative isolate flex h-[100svh] min-h-[600px] flex-col justify-center overflow-hidden"
    >
      <HeroPicture />
      {/* As in the guide: a shade along the left where the words sit, and a little at the top for
          the header. The rest of the photo stays as it is. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgb(20_20_16/0.45)_0%,rgb(20_20_16/0)_22%,rgb(20_20_16/0)_70%,rgb(20_20_16/0.35)_100%),linear-gradient(to_right,rgb(20_20_16/0.55)_0%,rgb(20_20_16/0.25)_45%,rgb(20_20_16/0)_70%)]"
      />
      {/* The header turns solid once this line scrolls past the top. */}
      <div id="hero-sentinel" aria-hidden className="pointer-events-none absolute inset-x-0 top-[60%] h-px" />

      <div className="relative mx-auto w-full max-w-7xl px-4 pt-16 md:px-8">
        <h1
          id="hero-title"
          className={`${display.className} farm-intro text-[clamp(3rem,8vw,7rem)] leading-[0.95] font-medium tracking-[0.01em] uppercase drop-shadow-[0_2px_24px_rgb(0_0_0/0.25)]`}
        >
          {headline.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
        <div className="farm-intro-3 mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 text-sm tracking-[0.08em] uppercase">
          <a
            href="#way-in"
            className="text-soil inline-flex h-12 items-center gap-4 bg-[rgb(214_207_190/0.92)] px-6 backdrop-blur-sm transition-colors hover:bg-[rgb(226_220_205)]"
          >
            {walk}
            <MoveRight className="size-5" strokeWidth={1.5} aria-hidden />
          </a>
          <a href="#enquire" className="group inline-flex items-center gap-2.5">
            <span className="decoration-chalk/70 group-hover:decoration-chalk underline underline-offset-[6px]">
              {copy.cta}
            </span>
            <Play className="size-3.5" strokeWidth={1.5} aria-hidden />
          </a>
        </div>
      </div>

      <a
        href="#plans"
        className="farm-intro-3 absolute inset-x-0 bottom-8 mx-auto inline-flex w-fit items-center gap-2 text-xs tracking-[0.12em] uppercase opacity-90 transition-opacity hover:opacity-100"
      >
        {scroll}
        <ArrowDown className="size-3.5" aria-hidden />
      </a>
    </section>
  )
}
