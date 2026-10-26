import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  metadataBase: new URL("https://farm.databayt.org"),
  title: "Farm study",
  description: "Feasibility study and plan for a technology-enabled integrated farm in Rwanda.",
}

// The header lives with its routes now (components/site-header.tsx for the study, components/home
// for the homepage), and TooltipProvider moved into /docs: it was ~38 kB of JS on every route.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
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
