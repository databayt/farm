import type * as React from "react"
import { getImageProps } from "next/image"

import { cn } from "@/lib/utils"
import { BlurImage } from "@/components/atom/blur-image"

import { ASSETS, CLIPS, TONES, type Asset, type AssetId, type ClipId, type Kind } from "./assets"
import { IMAGES, VIDEOS, type SiteImage, type Source } from "./assets.generated"
import { copy } from "./copy"

const CAPTION: Record<Kind, string> = {
  render: copy.captions.render,
  today: copy.captions.today,
  design: copy.captions.design,
}

/** What a picture is decides its label: a render shows the plan, a footage frame shows today. */
export function captionFor(source: Source | undefined, film = false) {
  if (source === "today") return copy.captions.today
  if (source === "design") return copy.captions.design
  return film ? copy.captions.film : copy.captions.render
}

/** A footage frame standing in for a render (D-019) is described as it is, not as planned. */
export function imageAlt(id: AssetId, source: Source) {
  const asset: Asset = ASSETS[id]
  return source === "today" && asset.kind === "render" ? (asset.today ?? asset.alt) : asset.alt
}

function clipAlt(id: ClipId, source: Source) {
  return source === "today" ? CLIPS[id].today : ASSETS[CLIPS[id].still].alt
}

/** The still a clip plays over: its first frame, or its image slot when there is no clip. */
export function stillFor(id: ClipId): { image: SiteImage; alt: string } | null {
  const video = VIDEOS[id]
  if (video) return { image: video.poster, alt: clipAlt(id, video.source) }
  const slot = CLIPS[id].still
  const image = IMAGES[slot]
  return image ? { image, alt: imageAlt(slot, image.source) } : null
}

export function Caption({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "bg-soil/70 text-chalk pointer-events-none inline-block rounded-full px-2.5 py-1 font-mono text-[10px] tracking-[0.18em] uppercase backdrop-blur-sm",
        className,
      )}
    >
      {children}
    </span>
  )
}

/** Stands in for a render that hasn't been made yet (study/website/render-brief.md). */
export function Pending({ id, className }: { id: AssetId; className?: string }) {
  const asset = ASSETS[id]
  return (
    <div
      role="img"
      aria-label={`${copy.captions.pending}: ${asset.subject}`}
      className={cn(
        "absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center",
        asset.tone === "dusk" ? "text-chalk" : "text-soil",
        className,
      )}
      style={{
        backgroundImage: `repeating-linear-gradient(135deg, rgb(255 255 255 / 0.09) 0 1px, transparent 1px 14px), ${TONES[asset.tone]}`,
      }}
    >
      <span className="font-mono text-[10px] tracking-[0.22em] uppercase opacity-80">
        {copy.captions.pending} · {id}
      </span>
      <span className="font-display max-w-xs text-xl leading-snug text-balance md:text-2xl">{asset.subject}</span>
    </div>
  )
}

/** A homepage image in a box the parent sizes, with its "planned" or "today" caption. */
export function Render({
  id,
  sizes,
  preload,
  caption = true,
  className,
  captionClassName,
}: {
  id: AssetId
  sizes: string
  preload?: boolean
  caption?: boolean
  className?: string
  captionClassName?: string
}) {
  const image = IMAGES[id]
  return (
    <figure className={cn("bg-muted relative overflow-hidden", className)}>
      {image ? (
        <BlurImage
          src={image.src}
          alt={imageAlt(id, image.source)}
          fill
          sizes={sizes}
          preload={preload}
          blurDataURL={image.blurDataURL}
          // The blur placeholder reads object-fit from the inline style, not the class.
          style={{ objectFit: "cover" }}
        />
      ) : (
        <Pending id={id} />
      )}
      {caption ? (
        <figcaption className={cn("absolute bottom-3 left-3", captionClassName)}>
          <Caption>{image ? captionFor(image.source) : CAPTION[ASSETS[id].kind]}</Caption>
        </figcaption>
      ) : null}
    </figure>
  )
}

// The still under a full-bleed clip, as an art-directed <picture>: the upright cut's first frame
// on portrait screens. getImageProps can't carry a blur placeholder, so the LQIP is the wrapper's
// background and the photo fades in when the root layout's listener stamps data-loaded. With
// `preload` it is the hero: fetched early at high priority and shown as soon as it decodes, no
// fade. (Chrome treats a full-viewport image as background, so the LCP is the header's text.)
export function ClipPicture({
  clip,
  upright,
  preload,
  pendingClassName,
}: {
  clip: ClipId
  upright?: ClipId
  preload?: boolean
  pendingClassName?: string
}) {
  const land = stillFor(clip)
  if (!land) return <Pending id={CLIPS[clip].still} className={pendingClassName} />
  const up = upright ? stillFor(upright) : null
  const uprightSet = up
    ? getImageProps({ src: up.image.src, width: up.image.width, height: up.image.height, alt: up.alt, sizes: "100vw" })
        .props.srcSet
    : undefined
  const { props } = getImageProps({
    src: land.image.src,
    width: land.image.width,
    height: land.image.height,
    alt: land.alt,
    sizes: "100vw",
    ...(preload ? ({ loading: "eager", fetchPriority: "high" } as const) : {}),
  })
  return (
    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${land.image.blurDataURL}")` }}>
      <picture>
        {uprightSet ? <source media="(orientation: portrait)" srcSet={uprightSet} sizes="100vw" /> : null}
        <img
          {...props}
          alt={land.alt}
          data-blur-up="plain"
          // The pre-paint listener may stamp data-loaded before hydration.
          suppressHydrationWarning
          className={cn(
            "absolute inset-0 size-full object-cover",
            preload
              ? "farm-settle"
              : "opacity-0 transition-opacity duration-700 data-[loaded]:opacity-100 motion-reduce:opacity-100",
          )}
        />
      </picture>
    </div>
  )
}
