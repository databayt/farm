import type * as React from "react"
import { Geist, Geist_Mono } from "next/font/google"

import "@/app/globals.css"

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

// Every root layout resolves share-card images and canonical links against the live site.
export const metadataBase = new URL("https://farm.databayt.org")

// The <html> and <body> every root layout shares (D-058): the site under /[lang], the bare `/` that picks a
// language, and the global 404. The header lives with its routes (components/site-header.tsx for the docs,
// components/home for the homepage and the place pages).
export function RootDocument({ lang, children }: { lang: string; children: React.ReactNode }) {
  return (
    <html lang={lang} className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col [--header-height:3.5rem]">
        {/* Pre-paint blur-up (components/atom/blur-image.tsx): a photo sharpens the moment its
            bytes land, not when React hydrates later on a slow phone. Image load events don't
            bubble, so one capturing listener, registered before any <img> is parsed, sees them all. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.addEventListener('load',function(e){var t=e.target;if(t&&t.hasAttribute&&t.hasAttribute('data-blur-up'))t.setAttribute('data-loaded','')},true)",
          }}
        />
        {children}
      </body>
    </html>
  )
}
