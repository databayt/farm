import type * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { BlurImg } from "@/components/atom/blur-img"
import { Button } from "@/components/ui/button"

// The three sections every /en page opens on, in /en/studio's pattern: a full-screen hero photo, the 2D and the 3D.
// One copy here keeps the twelve pages identical in spacing, type and dark-mode handling.

// The first screen. `className` sets the box's colour while the photo loads, `imgClassName` its focus
// (object-[x_y]); the words sit bottom-left, so the photo keeps its subject centre-right. The sentinel tells the
// header (components/home/header.tsx) when the hero has mostly scrolled away.
export function PageHero({ src, width, height, alt, title, className, imgClassName }: {
  src: string; width: number; height: number; alt: string; title: React.ReactNode; className?: string; imgClassName?: string
}) {
  return (
    <section className={cn("relative h-svh min-h-[520px] w-full overflow-hidden", className)}>
      <BlurImg src={src} width={width} height={height} fetchPriority="high" alt={alt}
        className={cn("absolute inset-0 size-full object-cover", imgClassName)} />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/45 to-transparent" />
      <div id="hero-sentinel" aria-hidden className="pointer-events-none absolute inset-x-0 top-[60%] h-px" />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/35 to-transparent">
        <div className="w-full px-4 pt-24 pb-10 md:px-10 md:pb-14">
          <p className="text-sm text-white/80">Digital Farm</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-balance text-white md:text-6xl">{title}</h1>
          <Button asChild className="mt-6">
            <Link href="/#enquire">Book it now</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

// A full-screen drawing under a plain title: the 2D plan, or any drawing in its pattern. The drawing is black on
// transparent (an SVG in currentColor, or an image inverted in dark mode). `full`: the drawing takes the section's
// full width and the section grows to fit it, for a drawing too square to fill the width within one screen.
export function DrawingSection({ id, title, children, after, full = false }: {
  id: string; title: string; children: React.ReactNode; after?: React.ReactNode; full?: boolean
}) {
  return (
    <section id={id}>
      <div className={cn("flex flex-col px-4 pt-10 pb-6 md:px-10", !full && "lg:h-svh lg:min-h-[560px]")}>
        <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>
        <div className="mt-6 flex min-h-0 flex-1 items-center justify-center">{children}</div>
      </div>
      {after}
    </section>
  )
}

// The 3D: the model's line drawing full screen, then the same view rendered with materials.
export function ModelSection({ line, real, width, height, lineAlt, realAlt, caption = "Rendered from the design model" }: {
  line: string; real: string; width: number; height: number; lineAlt: string; realAlt: string; caption?: React.ReactNode
}) {
  return (
    <DrawingSection id="model" title="3D" after={
      <figure className="px-4 pb-10 md:px-10">
        <div className="overflow-hidden">
          <BlurImg src={real} width={width} height={height} loading="lazy" alt={realAlt} className="h-auto w-full" />
        </div>
        <figcaption className="text-muted-foreground mt-2 text-sm">{caption}</figcaption>
      </figure>
    }>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={line} width={width} height={height} alt={lineAlt} className="w-full object-contain lg:max-h-full dark:invert" />
    </DrawingSection>
  )
}
