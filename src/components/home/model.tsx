import { copy } from "./copy"

const R = "/designs/compound/render"

// 3D, in /en/studio's pattern and across the full width like the 2D: the compound as a line drawing,
// then the same view rendered with materials and sun. Both come from scripts/site/render/compound.html, built from compound.json like
// the 2D plan; /designs is not cached for good, so a new render keeps its URL.
export function Model() {
  const { title, line, real, caption } = copy.model
  return (
    <section id="model" aria-labelledby="model-title">
      <div className="px-4 pt-10 pb-6 md:px-10">
        <h2 id="model-title" className="text-3xl font-semibold tracking-tight">
          {title}
        </h2>
        <div className="mt-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${R}/compound-line.png`}
            width={2400}
            height={1800}
            alt={line}
            loading="lazy"
            decoding="async"
            className="h-auto w-full"
          />
        </div>
      </div>
      <figure className="px-4 pb-10 md:px-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${R}/compound-real.webp`}
          width={2400}
          height={1800}
          alt={real}
          loading="lazy"
          decoding="async"
          className="h-auto w-full"
        />
        <figcaption className="text-muted-foreground mt-2 text-sm">{caption}</figcaption>
      </figure>
    </section>
  )
}
