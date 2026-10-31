"use client"

import { useParams } from "next/navigation"

import { hasLocale, i18n, type Locale } from "./config"

// The reader's language in a client component, from the [lang] segment; English outside it.
export function useLocale(): Locale {
  const { lang } = useParams<{ lang?: string }>()
  return hasLocale(lang) ? lang : i18n.defaultLocale
}
