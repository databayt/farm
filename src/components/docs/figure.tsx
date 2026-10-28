// A drawing from public/designs on a white "sheet" card, so it reads in light and dark mode.
// Emitted by scripts/sync-docs.mjs for an image alone on a line in study Markdown. Guide pages pass
// `eager`: they are printed to PDF, and a lazy image below the fold would print blank.
export function Figure({
  src,
  alt,
  caption,
  width,
  height,
  eager,
}: {
  src: string
  alt?: string
  caption?: string
  width?: number
  height?: number
  eager?: boolean
}) {
  return (
    <figure className="my-6 break-inside-avoid">
      <a href={src} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-lg border bg-white p-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt ?? caption ?? ""} width={width} height={height} loading={eager ? "eager" : "lazy"} decoding="async"
          className="h-auto w-full" />
      </a>
      {caption ? (
        <figcaption className="text-muted-foreground mt-2 text-sm">
          {caption} · <a href={src} target="_blank" rel="noreferrer" className="underline underline-offset-4">open full size</a>
        </figcaption>
      ) : null}
    </figure>
  )
}
