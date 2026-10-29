// A drawing with a tag on every point (L1, S1, P1…, or SV, WH…), each linking to its row in a points table: on
// the same page, or on the page `table` names.
// The tags sit in a box with the picture's own aspect ratio, so they stay on their device at any width; the spots
// come from scripts/studio/render/room.html (window.TAGS, saved as render/electric-tags.json and
// render/plumbing-tags.json). A tag sits just above and to the right of its device, so the device stays in view;
// its dot is its circuit's colour, or the colour of the water at a fitting.

export type Tag = { id: string; x: number; y: number; edge: string }

export function TaggedFigure({ src, alt, aspect, tags, info, table = "" }: {
  src: string
  alt: string
  aspect: number
  tags: Tag[]
  info: Record<string, { label: string; colour?: string }>
  table?: string
}) {
  return (
    <div className="relative mx-auto w-full" style={{ aspectRatio: aspect, maxWidth: `calc((100svh - 8rem) * ${aspect})` }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} width={2400} height={Math.round(2400 / aspect)} loading="lazy"
        className="absolute inset-0 size-full dark:invert dark:hue-rotate-180" />
      {tags.map((t) => (
        <a key={t.id} href={`${table}#pt-${t.id}`} title={info[t.id]?.label}
          className="group absolute size-0" style={{ left: `${t.x * 100}%`, top: `${t.y * 100}%` }}>
          <span className="bg-foreground absolute -top-[3px] -left-[3px] size-1.5 rounded-full" />
          <span className="bg-background/90 text-foreground ring-border group-hover:ring-foreground absolute bottom-1 left-1 flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[11px] leading-none font-medium whitespace-nowrap shadow-sm ring-1">
            <span className="size-1.5 rounded-full" style={{ background: info[t.id]?.colour ?? "currentColor" }} />
            {t.id}
          </span>
        </a>
      ))}
    </div>
  )
}
