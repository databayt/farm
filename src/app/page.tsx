import type { Metadata } from "next"

import { OG_IMAGE } from "@/components/home/assets.generated"
import { HomeContent } from "@/components/home/content"
import { copy } from "@/components/home/copy"

// The Digital Farm homepage (src/components/home): the planned compound in Gashora, shown with
// labelled concept renders (D-017, D-018). The study it grew from stays at /docs.
export const metadata: Metadata = {
  title: copy.meta.title,
  description: copy.meta.description,
  openGraph: {
    title: copy.meta.title,
    description: copy.meta.description,
    url: "/",
    siteName: "Digital Farm",
    type: "website",
    images: OG_IMAGE ? [{ url: OG_IMAGE, width: 1200, height: 630, alt: copy.meta.ogAlt }] : undefined,
  },
  twitter: { card: OG_IMAGE ? "summary_large_image" : "summary" },
}

export default function Home() {
  return <HomeContent />
}
