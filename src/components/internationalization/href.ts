import { hasLocale, type Locale } from "./config"
import site from "@/components/site/places.json"

const PLACES = new Set(site.places)

// One rule for every internal link (D-058): a page path gets the reader's language in front (the homepage and its
// anchors, a place page, the docs), and a path that already carries /en or /rw has it swapped. Files under public/
// (/designs, /guides, /site …), external links and bare #anchors are left alone.
export function localeHref(lang: Locale, href: string): string {
  if (!href.startsWith("/") || href.startsWith("//")) return href
  const path = href.split(/[?#]/)[0]
  const first = path.split("/")[1] ?? ""
  if (hasLocale(first)) return `/${lang}${href.slice(first.length + 1)}`
  if (path === "/") return `/${lang}${href.slice(1)}`
  if (first === "docs" || PLACES.has(first)) return `/${lang}${href}`
  return href
}
