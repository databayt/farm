import Link from "next/link"

// The study's header, for /docs, /en and the 404 page. The homepage draws its own
// (components/home/header.tsx), so this left the root layout.
export function SiteHeader() {
  return (
    <header className="bg-background/90 sticky top-0 z-40 flex h-(--header-height) items-center gap-4 border-b px-4 backdrop-blur lg:px-6">
      <Link href="/docs" className="text-sm font-semibold">
        Farm study
      </Link>
      <Link href="/" className="text-muted-foreground hover:text-foreground ml-auto text-sm">
        Digital Farm
      </Link>
    </header>
  )
}
