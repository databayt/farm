import type { Metadata } from "next"
import { Suspense } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { mdxComponents } from "@/mdx-components"
import { findNeighbour } from "fumadocs-core/page-tree"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { docsSource } from "@/lib/source"
import { hasLocale, i18n } from "@/components/internationalization/config"
import { getDictionary } from "@/components/internationalization/dictionaries"
import { Button } from "@/components/ui/button"
import { sidebarGroups } from "@/components/docs/sidebar-groups"
import { DocsCopyPage } from "@/components/docs/docs-copy-page"
import { DocsTableOfContents } from "@/components/docs/toc"

// Ported from hogwarts app/[lang]/(saas-marketing)/docs/[[...slug]]/page.tsx: same layout, neighbours, copy-page,
// table of contents and English fallback (D-058).
const ORIGIN = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

// The page in the reader's language. fumadocs fills /rw with the English pages not yet in Kinyarwanda; such a
// fallback is the English file itself, shown under a notice so a link from a Kinyarwanda page never 404s.
function resolvePage(lang: string, slug: string[] | undefined) {
  if (!hasLocale(lang)) return null
  const page = docsSource.getPage(slug, lang)
  if (!page) return null
  const english = lang === i18n.defaultLocale ? page : docsSource.getPage(slug, i18n.defaultLocale)
  return { page, lang, fallback: lang !== i18n.defaultLocale && page.absolutePath === english?.absolutePath, english }
}

export function generateStaticParams({ params }: { params: { lang: string } }) {
  return docsSource.getPages(params.lang).map((page) => ({ slug: page.slugs }))
}

export async function generateMetadata(props: PageProps<"/[lang]/docs/[[...slug]]">): Promise<Metadata> {
  const { lang, slug } = await props.params
  const resolved = resolvePage(lang, slug)
  if (!resolved) notFound()
  const { page, fallback, english } = resolved
  const t = await getDictionary(resolved.lang)
  return {
    title: `${page.data.title} · ${t.docs.title}`,
    description: page.data.description,
    // a page shown in English under /rw points search at the English one
    alternates: fallback && english ? { canonical: english.url } : undefined,
  }
}

// With Partial Prefetching on, params are awaited inside <Suspense> (Next 16 cache-components guide); every slug is
// still prerendered via generateStaticParams.
export default function DocsPage({ params }: PageProps<"/[lang]/docs/[[...slug]]">) {
  return (
    <Suspense fallback={<div className="min-h-svh" />}>
      <DocsArticle params={params} />
    </Suspense>
  )
}

async function DocsArticle({ params }: Pick<PageProps<"/[lang]/docs/[[...slug]]">, "params">) {
  const { lang, slug } = await params
  const resolved = resolvePage(lang, slug)
  if (!resolved) notFound()
  const { page, fallback } = resolved
  const t = await getDictionary(resolved.lang)

  const doc = page.data
  const MDX = doc.body
  const tree = docsSource.getPageTree(resolved.lang)
  const neighbours = findNeighbour(tree, page.url)
  const raw = (await doc.getText("raw")) ?? ""
  // A place's page (D-059) is headed by its kind ("Electric"), under the place it belongs to; the pager names pages
  // as the sidebar does, in the reader's language.
  const places = t.places as Record<string, string>
  const kinds = t.docs.kinds as Record<string, string>
  const named = new Map(sidebarGroups(tree, t).flatMap((g) =>
    g.items.map((i) => [i.url, g.place ? `${g.label} · ${i.name}` : i.name] as const)))
  const title = doc.place && doc.kind ? (kinds[doc.kind] ?? doc.title) : doc.title

  return (
    <div className="flex items-stretch text-[1.05rem] sm:text-[15px] xl:w-full">
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="h-(--top-spacing) shrink-0" />
        <div className="text-foreground mx-auto flex w-full max-w-3xl min-w-0 flex-1 flex-col gap-8 py-6 lg:py-8">
          <div className="flex flex-col gap-2">
            {doc.place && (
              <Link href={doc.place === "farm" ? `/${resolved.lang}#plans` : `/${resolved.lang}/${doc.place}`}
                className="text-muted-foreground hover:text-foreground w-fit text-sm font-medium">
                {places[doc.place] ?? doc.place}
              </Link>
            )}
            <div className="flex items-start justify-between gap-4">
              <h1 className="scroll-m-24 text-3xl font-semibold tracking-tight" lang={fallback && !doc.place ? "en" : undefined}>{title}</h1>
              <div className="docs-nav print:hidden bg-background/80 border-border/50 fixed inset-x-0 bottom-0 isolate z-50 flex items-center gap-2 border-t px-6 py-4 backdrop-blur-sm sm:static sm:z-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:pt-1.5 sm:backdrop-blur-none">
                <DocsCopyPage page={raw} url={`${ORIGIN}${page.url}`}
                  labels={{ copy: t.docs.copyPage, chatgpt: t.docs.openInChatGPT, claude: t.docs.openInClaude }} />
                {neighbours.previous && (
                  <Button variant="secondary" size="icon" className="extend-touch-target ms-auto size-8 shadow-none md:size-7" asChild>
                    <Link href={neighbours.previous.url}>
                      <ArrowLeft className="rtl:rotate-180" />
                      <span className="sr-only">{t.docs.previous}</span>
                    </Link>
                  </Button>
                )}
                {neighbours.next && (
                  <Button variant="secondary" size="icon" className="extend-touch-target size-8 shadow-none md:size-7" asChild>
                    <Link href={neighbours.next.url}>
                      <span className="sr-only">{t.docs.next}</span>
                      <ArrowRight className="rtl:rotate-180" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
            {doc.description && (
              <p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base" lang={fallback ? "en" : undefined}>{doc.description}</p>
            )}
          </div>
          {fallback && (
            <p role="note" className="bg-muted text-muted-foreground rounded-lg px-4 py-3 text-sm">
              {t.notice.notTranslated}
            </p>
          )}
          <div lang={fallback ? "en" : undefined} className="w-full flex-1 *:data-[slot=alert]:first:mt-0">
            <MDX components={mdxComponents} />
          </div>
        </div>
        <div className="mx-auto hidden h-16 w-full max-w-3xl items-center gap-2 sm:flex print:hidden">
          {neighbours.previous && (
            <Button variant="secondary" size="sm" asChild className="shadow-none">
              <Link href={neighbours.previous.url}>
                <ArrowLeft className="rtl:rotate-180" /> {named.get(neighbours.previous.url) ?? neighbours.previous.name}
              </Link>
            </Button>
          )}
          {neighbours.next && (
            <Button variant="secondary" size="sm" className="ms-auto shadow-none" asChild>
              <Link href={neighbours.next.url}>
                {named.get(neighbours.next.url) ?? neighbours.next.name} <ArrowRight className="rtl:rotate-180" />
              </Link>
            </Button>
          )}
        </div>
      </div>
      <div className="sticky top-[calc(var(--header-height)+2rem)] z-30 ms-auto hidden h-[calc(100vh-var(--header-height)-4rem)] w-72 flex-col gap-4 overflow-hidden pb-8 xl:flex">
        <div className="h-(--top-spacing) shrink-0" />
        {doc.toc?.length ? (
          <div className="no-scrollbar overflow-y-auto px-8">
            <DocsTableOfContents toc={doc.toc} label={t.docs.onThisPage} />
            <div className="h-12" />
          </div>
        ) : null}
      </div>
    </div>
  )
}
