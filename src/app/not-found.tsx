import Link from "next/link"

import { SiteHeader } from "@/components/site-header"

// The root layout no longer draws a header, so the 404 page brings its own way back.
export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-4 px-6 py-24">
        <p className="text-muted-foreground font-mono text-sm">404</p>
        <h1 className="text-3xl font-semibold tracking-tight text-balance">This page doesn&apos;t exist</h1>
        <p className="text-muted-foreground text-lg text-balance">
          It may have moved when the study was reorganised. Start from the farm or the study.
        </p>
        <div className="flex flex-wrap gap-6 text-sm font-medium">
          <Link href="/" className="underline underline-offset-4">
            Digital Farm
          </Link>
          <Link href="/docs" className="underline underline-offset-4">
            The open study
          </Link>
        </div>
      </main>
    </>
  )
}
