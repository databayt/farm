import type { Metadata } from "next"
import { Suspense } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { mdxComponents } from "@/mdx-components"
import { findNeighbour } from "fumadocs-core/page-tree"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { docsSource } from "@/lib/source"
import { Button } from "@/components/ui/button"
import { DocsCopyPage } from "@/components/docs/docs-copy-page"
import { DocsTableOfContents } from "@/components/docs/toc"

// Ported from hogwarts app/[lang]/(saas-marketing)/docs/[[...slug]]/page.tsx:
// same layout, neighbours, copy-page and table of contents; no locale fallback.
const ORIGIN = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

export function generateStaticParams() {
  return docsSource.generateParams()
}

export async function generateMetadata(props: PageProps<"/docs/[[...slug]]">): Promise<Metadata> {
  const { slug } = await props.params
  const page = docsSource.getPage(slug)
  if (!page) notFound()
  return {
    title: `${page.data.title} · Farm study`,
    description: page.data.description,
  }
}

// With Partial Prefetching on, params are awaited inside <Suspense> (Next 16
// cache-components guide); every slug is still prerendered via generateStaticParams.
export default function DocsPage({ params }: PageProps<"/docs/[[...slug]]">) {
  return (
    <Suspense fallback={<div className="min-h-svh" />}>
      <DocsArticle params={params} />
    </Suspense>
  )
}

async function DocsArticle({ params }: Pick<PageProps<"/docs/[[...slug]]">, "params">) {
  const { slug } = await params
  const page = docsSource.getPage(slug)
  if (!page) notFound()

  const doc = page.data
  const MDX = doc.body
  const neighbours = findNeighbour(docsSource.pageTree, page.url)
  const raw = (await doc.getText("raw")) ?? ""

  return (
    <div className="flex items-stretch text-[1.05rem] sm:text-[15px] xl:w-full">
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="h-(--top-spacing) shrink-0" />
        <div className="text-foreground mx-auto flex w-full max-w-3xl min-w-0 flex-1 flex-col gap-8 py-6 lg:py-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-start justify-between gap-4">
              <h1 className="scroll-m-24 text-3xl font-semibold tracking-tight">{doc.title}</h1>
              <div className="docs-nav print:hidden bg-background/80 border-border/50 fixed inset-x-0 bottom-0 isolate z-50 flex items-center gap-2 border-t px-6 py-4 backdrop-blur-sm sm:static sm:z-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:pt-1.5 sm:backdrop-blur-none">
                <DocsCopyPage page={raw} url={`${ORIGIN}${page.url}`} />
                {neighbours.previous && (
                  <Button variant="secondary" size="icon" className="extend-touch-target ms-auto size-8 shadow-none md:size-7" asChild>
                    <Link href={neighbours.previous.url}>
                      <ArrowLeft className="rtl:rotate-180" />
                      <span className="sr-only">Previous</span>
                    </Link>
                  </Button>
                )}
                {neighbours.next && (
                  <Button variant="secondary" size="icon" className="extend-touch-target size-8 shadow-none md:size-7" asChild>
                    <Link href={neighbours.next.url}>
                      <span className="sr-only">Next</span>
                      <ArrowRight className="rtl:rotate-180" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
            {doc.description && (
              <p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">{doc.description}</p>
            )}
          </div>
          <div className="w-full flex-1 *:data-[slot=alert]:first:mt-0">
            <MDX components={mdxComponents} />
          </div>
        </div>
        <div className="mx-auto hidden h-16 w-full max-w-3xl items-center gap-2 sm:flex print:hidden">
          {neighbours.previous && (
            <Button variant="secondary" size="sm" asChild className="shadow-none">
              <Link href={neighbours.previous.url}>
                <ArrowLeft className="rtl:rotate-180" /> {neighbours.previous.name}
              </Link>
            </Button>
          )}
          {neighbours.next && (
            <Button variant="secondary" size="sm" className="ms-auto shadow-none" asChild>
              <Link href={neighbours.next.url}>
                {neighbours.next.name} <ArrowRight className="rtl:rotate-180" />
              </Link>
            </Button>
          )}
        </div>
      </div>
      <div className="sticky top-[calc(var(--header-height)+2rem)] z-30 ms-auto hidden h-[calc(100vh-var(--header-height)-4rem)] w-72 flex-col gap-4 overflow-hidden pb-8 xl:flex">
        <div className="h-(--top-spacing) shrink-0" />
        {doc.toc?.length ? (
          <div className="no-scrollbar overflow-y-auto px-8">
            <DocsTableOfContents toc={doc.toc} />
            <div className="h-12" />
          </div>
        ) : null}
      </div>
    </div>
  )
}
