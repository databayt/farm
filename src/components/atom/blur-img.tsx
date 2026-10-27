import type * as React from "react"

import { cx } from "@/lib/cx"
import { DESIGN_BLUR } from "@/lib/design-blur.generated"

/**
 * Blur-up for a photo served as is (the design renders in public/designs), where BlurImage's
 * next/image would only add a srcset of the same file. A server component, no JS of its own.
 *
 * The LQIP from scripts/site/design-blur.mjs is the <img>'s own background, and the filter blurs
 * it with the photo, so the box shows the photo's colours from the first byte and the photo
 * sharpens through it. The root layout's pre-paint listener stamps data-loaded when the bytes
 * land. The parent clips the box (`overflow-hidden`) so `scale-105` never spills.
 */
export function BlurImg({ src, alt, className, style, ...props }: React.ImgHTMLAttributes<HTMLImageElement> & { src: string; alt: string }) {
  const blur = DESIGN_BLUR[src]
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      src={src}
      alt={alt}
      decoding="async"
      data-blur-up={blur ? "blur" : "plain"}
      // The pre-paint listener may stamp data-loaded before hydration.
      suppressHydrationWarning
      style={blur ? { backgroundImage: `url("${blur}")`, ...style } : style}
      className={cx(
        "bg-cover bg-center transition-[filter,scale,opacity] duration-700 ease-out motion-reduce:transition-none",
        // Tailwind v4 has no `blur-0`; `blur-none` is the sharp end state.
        blur
          ? "scale-105 blur-xl data-loaded:scale-100 data-loaded:blur-none motion-reduce:scale-100 motion-reduce:blur-none"
          : "opacity-0 data-loaded:opacity-100 motion-reduce:opacity-100",
        className,
      )}
    />
  )
}
