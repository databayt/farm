"use client"

import * as React from "react"

import { SiteMenu } from "@/components/site-menu"
import type { Nav } from "@/components/site/nav"

// Fixed over the hero, and nothing in it but a short two-line hamburger at the start that opens the site menu full
// screen (components/site-menu.tsx; the docs link lives inside it). Light on the film while it fills
// the screen; once the hero has mostly scrolled away (#hero-sentinel) the button gets a chalk disc
// so it stays legible over the page, with no bar behind it.
export function Header({ nav }: { nav: Nav }) {
  const ref = React.useRef<HTMLElement>(null)

  React.useEffect(() => {
    const header = ref.current
    const sentinel = document.getElementById("hero-sentinel")
    if (!header || !sentinel) return
    const observer = new IntersectionObserver(([entry]) => {
      header.toggleAttribute("data-solid", !entry.isIntersecting && entry.boundingClientRect.top < 0)
    })
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  return (
    <header
      ref={ref}
      className="group/header text-chalk pointer-events-none fixed inset-x-0 top-0 z-50 h-(--header-height) transition-colors duration-300 data-[solid]:text-soil"
    >
      <div className="flex h-full w-full items-center justify-start px-4 md:px-10">
        <SiteMenu
          nav={nav}
          full
          className="pointer-events-auto -ms-2 size-11 transition-colors duration-300 group-data-[solid]/header:bg-chalk/90 group-data-[solid]/header:backdrop-blur-md"
        />
      </div>
    </header>
  )
}
