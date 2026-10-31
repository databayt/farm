"use client"

import type { Locale } from "./config"

// The other language, on the same page with its query and anchor (D-058); every page exists in both, the docs
// falling back to English. Without JavaScript the link opens that language's homepage. The choice is stored for
// the bare `/` (app/(root)/page.tsx), which sends a returning reader straight to it.
export function LanguageSwitch({ to, label, className }: { to: Locale; label: string; className?: string }) {
  return (
    <a
      href={`/${to}`}
      hrefLang={to}
      lang={to}
      className={className}
      onClick={(e) => {
        e.preventDefault()
        try {
          localStorage.setItem("farm-lang", to)
        } catch {}
        const { pathname, search, hash } = window.location
        const path = /^\/(en|rw)(?=\/|$)/.test(pathname) ? pathname.replace(/^\/(en|rw)/, `/${to}`) : `/${to}`
        window.location.assign(path + search + hash)
      }}
    >
      {label}
    </a>
  )
}
