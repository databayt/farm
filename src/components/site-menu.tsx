"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

import { cn } from "@/lib/utils"

// Every page of the site, in the founder's order (2026-10-28), then the docs. The homepage's header
// (components/home/header.tsx) and every other page's (site-header.tsx) open this one menu.
export const PAGES = [
  { href: "/en/studio", label: "Studio" },
  { href: "/en/guest-room", label: "Guest room" },
  { href: "/en/office", label: "Office" },
  { href: "/en/study-room", label: "Study room" },
  { href: "/en/galley", label: "Galley" },
  { href: "/en/public-bathroom", label: "Public bathroom" },
  { href: "/en/volleyball", label: "Volleyball" },
  { href: "/en/parking", label: "Parking" },
  { href: "/en/camp", label: "Camping" },
  { href: "/en/bar", label: "Bar" },
  { href: "/en/farming", label: "Farming" },
  { href: "/en/livestock", label: "Livestock" },
]
export const DOCS = { href: "/docs", label: "Docs" }

// A hamburger on phones and desktops alike, opening a panel from the right. It is a native popover, so it needs
// no dialog library: Escape, a click outside and the top layer come with it. The page you are on is underlined.
// The links don't prefetch: opening the menu would otherwise preload every page's hero and drawings at once.
export function SiteMenu({
  title,
  menu = { open: "Open the menu", close: "Close the menu" },
  className,
}: {
  title: string
  menu?: { open: string; close: string }
  className?: string
}) {
  const id = React.useId()
  const panel = React.useRef<HTMLDivElement>(null)
  const [here, setHere] = React.useState("")
  const close = () => panel.current?.hidePopover()
  const row =
    "flex items-center py-2 transition-opacity hover:opacity-60 aria-[current=page]:underline aria-[current=page]:decoration-2 aria-[current=page]:underline-offset-8"

  return (
    <>
      <button
        type="button"
        popoverTarget={id}
        aria-label={menu.open}
        className={cn("inline-grid size-10 place-items-center rounded-full", className)}
      >
        <Menu className="size-5" aria-hidden />
      </button>
      <div
        ref={panel}
        id={id}
        popover="auto"
        onToggle={(e) => e.newState === "open" && setHere(location.pathname)}
        className="bg-background text-foreground fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-none w-full translate-x-full overflow-y-auto border-0 p-0 shadow-2xl transition-[translate,overlay,display] transition-discrete duration-300 ease-out backdrop:bg-black/40 open:translate-x-0 starting:open:translate-x-full motion-reduce:transition-none sm:max-w-sm sm:border-l"
      >
        <div className="flex h-(--header-height) items-center justify-between border-b px-4">
          <Link href="/" onClick={close} className="font-display text-lg font-semibold">
            {title}
          </Link>
          <button
            type="button"
            popoverTarget={id}
            popoverTargetAction="hide"
            aria-label={menu.close}
            className="-me-2 inline-grid size-10 place-items-center rounded-full"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>
        <nav aria-label="Pages" className="flex flex-col px-4 py-4 text-xl font-medium tracking-tight">
          {PAGES.map((page) => (
            <Link
              key={page.href}
              href={page.href}
              prefetch={false}
              onClick={close}
              aria-current={here === page.href ? "page" : undefined}
              className={row}
            >
              {page.label}
            </Link>
          ))}
          <Link
            href={DOCS.href}
            prefetch={false}
            onClick={close}
            aria-current={here.startsWith(DOCS.href) ? "page" : undefined}
            className={cn(row, "text-muted-foreground mt-4 border-t pt-4 text-base")}
          >
            {DOCS.label}
          </Link>
        </nav>
      </div>
    </>
  )
}
