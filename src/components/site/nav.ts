import type { Locale } from "@/components/internationalization/config"
import { getDictionary } from "@/components/internationalization/dictionaries"
import site from "@/components/site/places.json"

// What the headers and the site menu show, in the reader's language (D-058): the farm's pages in the founder's
// order, then the docs. Built on the server and handed to the client headers, which have no dictionary of their own.
export type Nav = {
  lang: Locale
  title: string
  menu: { open: string; close: string; pages: string }
  pages: { href: string; label: string }[]
  docs: { href: string; label: string }
}

export async function getNav(lang: Locale): Promise<Nav> {
  const t = await getDictionary(lang)
  return {
    lang,
    title: t.site.name,
    menu: t.menu,
    pages: site.places.map((id) => ({ href: `/${lang}/${id}`, label: t.places?.[id as keyof typeof t.places] ?? id })),
    docs: { href: `/${lang}/docs`, label: t.site.docs },
  }
}
