import { Suspense } from "react"

import { docsSource } from "@/lib/source"
import { SidebarProvider } from "@/components/ui/sidebar"
import { DocsSidebar } from "@/components/docs/docs-sidebar"

// The hogwarts docs shell (sidebar + page), without the [lang] segment: the
// study is English-only until the website's languages are decided in Stage 6.
export default function DocsLayout({ children }: LayoutProps<"/docs">) {
  return (
    <div className="container-wrapper flex flex-1 flex-col">
      <SidebarProvider className="min-h-min flex-1 items-start px-4 [--sidebar-width:220px] [--top-spacing:0] lg:grid lg:grid-cols-[var(--sidebar-width)_minmax(0,1fr)] lg:px-6 lg:[--sidebar-width:calc(var(--spacing)*64)] lg:[--top-spacing:calc(var(--spacing)*4)]">
        {/* usePathname suspends while the [[...slug]] shell prerenders. */}
        <Suspense fallback={<div className="hidden lg:block" />}>
          <DocsSidebar tree={docsSource.pageTree} />
        </Suspense>
        <div className="h-full w-full">{children}</div>
      </SidebarProvider>
    </div>
  )
}
