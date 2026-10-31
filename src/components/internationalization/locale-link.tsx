import type * as React from "react"
import Link from "next/link"

import { localeHref } from "./href"
import { getLocale } from "./locale"

// next/link for server components, with the reader's language put in front of a page path (localeHref). A link
// that names its language (hrefLang) is a deliberate switch and is left as written.
export async function LocaleLink({ href, hrefLang, ...props }: Omit<React.ComponentProps<typeof Link>, "href"> & { href: string }) {
  const lang = await getLocale()
  return <Link href={hrefLang ? href : localeHref(lang, href)} hrefLang={hrefLang} {...props} />
}
