import type { Metadata } from "next"
import Link from "next/link"
import { Geist, Geist_Mono } from "next/font/google"

import { TooltipProvider } from "@/components/ui/tooltip"
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
  title: "Farm study",
  description: "Feasibility study and plan for a technology-enabled integrated farm in Rwanda.",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col [--header-height:3.5rem]">
        <TooltipProvider>
          <header className="bg-background/90 sticky top-0 z-40 flex h-(--header-height) items-center border-b px-4 backdrop-blur lg:px-6">
            <Link href="/docs" className="text-sm font-semibold">
              Farm study
            </Link>
          </header>
          {children}
        </TooltipProvider>
      </body>
    </html>
  )
}
