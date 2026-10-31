"use client"

import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { LanguageSwitch } from "@/components/internationalization/language-switch"
import { SiteMenu } from "@/components/site-menu"
import type { Nav } from "@/components/site/nav"

// The header on the docs and the 404 (the homepage and /en/* use components/home/header.tsx): the farm's name, the
// docs and the site menu. On a page that opens on a full-screen hero (overlay), it sits on the picture in white,
// steps out of the way while the reader scrolls down and comes back, solid, as soon as they scroll up.
export function SiteHeader({ nav, overlay = false }: { nav: Nav; overlay?: boolean }) {
  const ref = React.useRef<HTMLElement>(null)

  React.useEffect(() => {
    const header = ref.current
    if (!overlay || !header) return
    let last = window.scrollY
    let frame = 0
    const update = () => {
      const y = window.scrollY
      const onHero = y < window.innerHeight - header.offsetHeight
      header.toggleAttribute("data-over", onHero)
      if (Math.abs(y - last) < 4) return
      header.toggleAttribute("data-away", !onHero && y > last)
      last = y
    }
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(frame)
    }
  }, [overlay])

  return (
    <header
      ref={ref}
      data-over={overlay ? "" : undefined}
      className={cn(
        "bg-background/90 top-0 z-40 flex h-(--header-height) items-center gap-2 border-b px-4 backdrop-blur print:hidden lg:px-6",
        overlay
          ? "fixed inset-x-0 transition-[translate,background-color,color,border-color] duration-300 data-[away]:not-focus-within:-translate-y-full data-[over]:border-transparent data-[over]:bg-transparent data-[over]:bg-origin-border data-[over]:bg-gradient-to-b data-[over]:from-black/35 data-[over]:to-transparent data-[over]:text-white data-[over]:backdrop-blur-none"
          : "sticky",
      )}
    >
      <Link href={`/${nav.lang}`} className="me-auto text-sm font-semibold">
        {nav.title}
      </Link>
      <Link href={nav.docs.href} className="px-2 text-sm font-medium transition-opacity hover:opacity-70">
        {nav.docs.label}
      </Link>
      <LanguageSwitch to={nav.language.to} label={nav.language.label}
        className="px-2 text-sm font-medium transition-opacity hover:opacity-70" />
      <SiteMenu nav={nav} className="-me-2" />
    </header>
  )
}
