import { Suspense } from "react"

import { docsSource } from "@/lib/source"
import { getLocale } from "@/components/internationalization/locale"
import { getNav } from "@/components/site/nav"
import { SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { DocsSidebar } from "@/components/docs/docs-sidebar"
import { SiteHeader } from "@/components/site-header"

// The hogwarts docs shell (sidebar + page), per language (D-058): the sidebar shows the reader's language's tree,
// which fumadocs fills with the English pages not yet in Kinyarwanda.
// TooltipProvider sits here, not in the root layout: only the sidebar uses tooltips.
export default async function DocsLayout({ children }: LayoutProps<"/[lang]/docs">) {
  const lang = await getLocale()
  const nav = await getNav(lang)
  return (
    <TooltipProvider>
      <SiteHeader nav={nav} />
      <div className="container-wrapper flex flex-1 flex-col">
        <SidebarProvider className="min-h-min flex-1 items-start px-4 [--sidebar-width:220px] [--top-spacing:0] lg:grid lg:grid-cols-[var(--sidebar-width)_minmax(0,1fr)] lg:px-6 lg:[--sidebar-width:calc(var(--spacing)*64)] lg:[--top-spacing:calc(var(--spacing)*4)]">
          {/* usePathname suspends while the [[...slug]] shell prerenders. */}
          <Suspense fallback={<div className="hidden lg:block" />}>
            <DocsSidebar tree={docsSource.getPageTree(lang)} />
          </Suspense>
          <div className="h-full w-full">{children}</div>
        </SidebarProvider>
      </div>
    </TooltipProvider>
  )
}
