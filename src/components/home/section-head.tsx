import { cn } from "@/lib/utils"

// The opening of each homepage section: a numbered eyebrow, a display title and a short lead.
export function SectionHead({
  id,
  eyebrow,
  title,
  lead,
  dark = false,
  className,
}: {
  id: string
  eyebrow: string
  title: string
  lead?: string
  dark?: boolean
  className?: string
}) {
  return (
    <header className={cn("mx-auto grid max-w-7xl gap-6 px-4 md:px-8 lg:grid-cols-12 lg:gap-x-8", className)}>
      <p
        className={cn(
          "font-mono text-xs tracking-[0.22em] uppercase lg:col-span-12",
          // Clay is too light for small text on chalk (3.9:1); Leaf passes (5.7:1), Saffron on soil (6.2:1).
          dark ? "text-saffron" : "text-leaf",
        )}
      >
        {eyebrow}
      </p>
      <h2
        id={id}
        className="font-display farm-reveal text-5xl leading-[0.95] font-normal tracking-tight text-balance md:text-7xl lg:col-span-8"
      >
        {title}
      </h2>
      {lead ? (
        <p
          className={cn(
            "farm-reveal max-w-xl text-lg text-pretty lg:col-span-4 lg:self-end",
            dark ? "text-chalk/75" : "text-muted-foreground",
          )}
        >
          {lead}
        </p>
      ) : null}
    </header>
  )
}
