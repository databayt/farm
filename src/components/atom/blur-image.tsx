"use client"

import * as React from "react"
import Image, { type ImageProps } from "next/image"

import { cx } from "@/lib/cx"

/**
 * Blur-up image, a drop-in for `next/image` (the databayt blur pattern, cloned from mkan's atom).
 *
 * The photo arrives as a soft, blurred version of itself (its LQIP, painted by next/image from
 * the first HTML byte) and sharpens into place over about 700 ms. The parent owns the box:
 * `relative overflow-hidden` plus an aspect ratio for `fill` images, so `scale-105` never spills.
 *
 * The sharpen keys off `data-loaded`, not React state alone: the pre-paint listener in the root
 * layout stamps it the moment the bytes land, so a photo is sharp while the page is still
 * hydrating. React's own onLoad stamps it too, for images mounted after hydration.
 */

/** Neutral 16×10 LQIP for images with no stored blur. */
export const NEUTRAL_BLUR =
  "data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoQAAwAA4BaJaQAA3AA/vEAgAA="

export type BlurImageProps = ImageProps & {
  /** Skip the blur-up (fade only, no placeholder), for small icons and logos. */
  plain?: boolean
}

export function BlurImage({ className, onLoad, plain = false, placeholder, blurDataURL, alt, ...props }: BlurImageProps) {
  const [loaded, setLoaded] = React.useState(false)

  // Static imports carry their own blurDataURL; everything else uses the given one or the neutral.
  const staticBlur = typeof props.src === "object" && "blurDataURL" in props.src
  const blur = blurDataURL ?? (staticBlur ? undefined : NEUTRAL_BLUR)

  return (
    <Image
      {...props}
      alt={alt}
      placeholder={placeholder ?? (plain ? "empty" : "blur")}
      blurDataURL={plain ? undefined : blur}
      data-blur-up={plain ? "plain" : "blur"}
      data-loaded={loaded ? "" : undefined}
      // The pre-paint listener may stamp data-loaded before hydration.
      suppressHydrationWarning
      onLoad={(e) => {
        setLoaded(true)
        onLoad?.(e)
      }}
      className={cx(
        "transition-[filter,scale,opacity] duration-700 ease-out",
        "motion-reduce:transition-none",
        // Tailwind v4 has no `blur-0`; `blur-none` is the sharp end state.
        plain
          ? "opacity-0 data-loaded:opacity-100"
          : "scale-105 blur-xl data-loaded:scale-100 data-loaded:blur-none motion-reduce:scale-100 motion-reduce:blur-none",
        className,
      )}
    />
  )
}
