import Link from "next/link"

import { SiteHeader } from "@/components/site-header"

// The 404's words and its way back. Root layouts draw no header, so the page brings its own (D-058: the same body
// serves /[lang]'s not-found, the /[lang]/404 pages Cloudflare serves for a miss under a language, and the global 404).
export function NotFoundContent({ title, text, home, docs }: {
  title: string; text: string; home: { href: string; label: string }; docs: { href: string; label: string }
}) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-4 px-6 py-24">
        <p className="text-muted-foreground font-mono text-sm">404</p>
        <h1 className="text-3xl font-semibold tracking-tight text-balance">{title}</h1>
        <p className="text-muted-foreground text-lg text-balance">{text}</p>
        <div className="flex flex-wrap gap-6 text-sm font-medium">
          <Link href={home.href} className="underline underline-offset-4">
            {home.label}
          </Link>
          <Link href={docs.href} className="underline underline-offset-4">
            {docs.label}
          </Link>
        </div>
      </main>
    </>
  )
}
