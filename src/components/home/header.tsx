"use client"

import * as React from "react"
import { Menu, X } from "lucide-react"

type NavLink = { href: string; label: string }

// Fixed over the hero: light text on the film while it fills the screen, a solid bar once the
// hero has mostly scrolled away (#hero-sentinel). The phone menu is a native popover, so the
// homepage loads no dialog library.
export function Header({
  title,
  nav,
  cta,
  menu,
}: {
  title: string
  nav: NavLink[]
  cta: string
  menu: { open: string; close: string }
}) {
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

  const closeMenu = () => document.getElementById("farm-menu")?.hidePopover()

  return (
    <header
      ref={ref}
      className="group/header text-chalk fixed inset-x-0 top-0 z-50 h-(--header-height) transition-[background-color,color,box-shadow] duration-300 data-[solid]:bg-chalk/90 data-[solid]:text-soil data-[solid]:shadow-[0_1px_0_var(--border)] data-[solid]:backdrop-blur-md"
    >
      <div className="mx-auto flex h-full max-w-7xl items-center gap-8 px-4 md:px-8">
        <a href="#top" className="font-display text-2xl leading-none">
          {title}
        </a>
        <nav aria-label="Sections" className="ml-auto hidden items-center gap-6 text-sm lg:flex">
          {nav.map((link) => (
            <a key={link.href} href={link.href} className="opacity-80 transition-opacity hover:opacity-100">
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href="#enquire"
          className="bg-chalk text-soil hidden h-9 items-center rounded-full px-4 text-sm font-medium transition-colors group-data-[solid]/header:bg-soil group-data-[solid]/header:text-chalk lg:inline-flex"
        >
          {cta}
        </a>
        <button
          type="button"
          popoverTarget="farm-menu"
          aria-label={menu.open}
          className="ml-auto inline-grid size-10 place-items-center rounded-full lg:hidden"
        >
          <Menu className="size-5" aria-hidden />
        </button>
      </div>

      <div id="farm-menu" popover="auto" className="bg-chalk text-soil inset-x-0 top-0 m-0 h-auto w-full max-w-none border-0 p-0 shadow-xl">
        <div className="flex h-(--header-height) items-center justify-between px-4">
          <span className="font-display text-2xl leading-none">{title}</span>
          <button
            type="button"
            popoverTarget="farm-menu"
            popoverTargetAction="hide"
            aria-label={menu.close}
            className="inline-grid size-10 place-items-center rounded-full"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>
        <nav aria-label="Sections" className="flex flex-col px-4 pb-6">
          {nav.map((link) => (
            <a key={link.href} href={link.href} onClick={closeMenu} className="font-display border-b py-3 text-3xl">
              {link.label}
            </a>
          ))}
          <a
            href="#enquire"
            onClick={closeMenu}
            className="bg-leaf text-chalk mt-6 inline-flex h-12 items-center justify-center rounded-full font-medium"
          >
            {cta}
          </a>
        </nav>
      </div>
    </header>
  )
}
