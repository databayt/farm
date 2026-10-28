"use client"

import * as React from "react"
import Link from "next/link"

import { DOCS, SiteMenu } from "@/components/site-menu"

// Fixed over the hero: light text on the film while it fills the screen, a solid bar once the
// hero has mostly scrolled away (#hero-sentinel). The wordmark left; the docs and the site menu
// right, the same menu as on every other page (components/site-menu.tsx).
export function Header({ title, menu }: { title: string; menu: { open: string; close: string } }) {
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
      className="group/header text-chalk fixed inset-x-0 top-0 z-50 h-(--header-height) transition-[background-color,color] duration-300 data-[solid]:bg-chalk/90 data-[solid]:text-soil data-[solid]:backdrop-blur-md"
    >
      <div className="flex h-full w-full items-center gap-2 px-4 md:px-10">
        <a href="#top" className="font-display me-auto text-2xl leading-none">
          {title}
        </a>
        <Link
          href={DOCS.href}
          className="px-2 text-[13px] tracking-[0.08em] uppercase opacity-85 transition-opacity hover:opacity-100"
        >
          {DOCS.label}
        </Link>
        <SiteMenu title={title} menu={menu} className="-me-2" />
      </div>
    </header>
  )
}
