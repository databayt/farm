import type * as React from "react"

import { cn } from "@/lib/utils"
import { BlurImage } from "@/components/atom/blur-image"

import { ASSETS, TONES, type AssetId, type Kind } from "./assets"
import { IMAGES } from "./assets.generated"
import { copy } from "./copy"

const CAPTION: Record<Kind, string> = {
  render: copy.captions.render,
  today: copy.captions.today,
  design: copy.captions.design,
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
  const asset = ASSETS[id]
  return (
    <figure className={cn("bg-muted relative overflow-hidden", className)}>
      {image ? (
        <BlurImage
          src={image.src}
          alt={asset.alt}
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
          <Caption>{CAPTION[asset.kind]}</Caption>
        </figcaption>
      ) : null}
    </figure>
  )
}
