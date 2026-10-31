import type { Metadata } from "next"
import Link from "next/link"

import { homeMetadata } from "@/components/home/metadata"

// `/` picks a language and moves on (D-058): the reader's last choice (the language switch stores it), else
// Kinyarwanda when the browser prefers it, else English. A static page does it, because the export has no server
// to redirect from; without JavaScript the meta refresh goes to English. Link previews read this page's card.
export const metadata: Metadata = {
  ...homeMetadata("/"),
  alternates: { canonical: "/en", languages: { en: "/en", rw: "/rw" } },
}

const PICK =
  "(function(){var l;try{l=localStorage.getItem('farm-lang')}catch(e){}" +
  "if(l!=='en'&&l!=='rw'){var w=navigator.languages||[navigator.language];" +
  "l=w.some(function(x){return /^rw\\b/i.test(x||'')})?'rw':'en'}" +
  "location.replace('/'+l+location.search+location.hash)})()"

export default function PickLanguage() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: PICK }} />
      <noscript>
        <meta httpEquiv="refresh" content="0;url=/en" />
      </noscript>
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-4 px-6 py-24">
        <p className="text-2xl font-semibold tracking-tight">Digital Farm</p>
        <div className="flex flex-wrap gap-6 text-sm font-medium">
          <Link href="/en" hrefLang="en" className="underline underline-offset-4">
            English
          </Link>
          <Link href="/rw" hrefLang="rw" className="underline underline-offset-4">
            Ikinyarwanda
          </Link>
        </div>
      </main>
    </>
  )
}
