import type { Metadata } from "next"

import { OG_IMAGE } from "@/components/home/assets.generated"
import { HomeContent } from "@/components/home/content"
import { copy } from "@/components/home/copy"
import { stillFor } from "@/components/home/render"
import { LoadingWrapper } from "@/components/loading"

// The Digital Farm homepage (src/components/home): the planned compound in Gashora, shown with
// labelled concept renders and, until they exist, labelled frames of the footage (D-017 to D-019).
// The study it grew from stays at /docs. The share card is cut from the opening still.
export const metadata: Metadata = {
  title: copy.meta.title,
  description: copy.meta.description,
  openGraph: {
    title: copy.meta.title,
    description: copy.meta.description,
    url: "/",
    siteName: "Digital Farm",
    type: "website",
    images: OG_IMAGE ? [{ url: OG_IMAGE, width: 1200, height: 630, alt: stillFor("hero")?.alt }] : undefined,
  },
  twitter: { card: OG_IMAGE ? "summary_large_image" : "summary" },
}

export default function Home() {
  return (
    <LoadingWrapper>
      <HomeContent />
    </LoadingWrapper>
  )
}
