import Link from "next/link"

import type { Locale } from "@/components/internationalization/config"
import { getDictionary } from "@/components/internationalization/dictionaries"
import { SiteHeader } from "@/components/site-header"
import { getNav } from "@/components/site/nav"

// The 404's words and its way back, in the reader's language. Root layouts draw no header, so the page brings its
// own (D-058: the same body serves /[lang]'s not-found, the /[lang]/404 pages Cloudflare serves for a miss under a
// language, and the global 404, in English).
export async function NotFoundContent({ lang }: { lang: Locale }) {
  const t = await getDictionary(lang)
  const nav = await getNav(lang)
  return (
    <>
      <SiteHeader nav={nav} />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-4 px-6 py-24">
        <p className="text-muted-foreground font-mono text-sm">404</p>
        <h1 className="text-3xl font-semibold tracking-tight text-balance">{t.notFound.title}</h1>
        <p className="text-muted-foreground text-lg text-balance">{t.notFound.text}</p>
        <div className="flex flex-wrap gap-6 text-sm font-medium">
          <Link href={`/${lang}`} className="underline underline-offset-4">
            {t.notFound.home}
          </Link>
          <Link href={`/${lang}/docs`} className="underline underline-offset-4">
            {t.notFound.docs}
          </Link>
        </div>
      </main>
    </>
  )
}
