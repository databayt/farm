import type { Metadata } from "next"

import { OG_IMAGE } from "./assets.generated"
import { copy } from "./copy"
import { stillFor } from "./render"

// The homepage's title and share card, for /en and /rw and for the bare `/` that picks between them (link
// previews read `/` without running its script). The card is cut from the opening still.
export function homeMetadata(url: string): Metadata {
  return {
    title: copy.meta.title,
    description: copy.meta.description,
    openGraph: {
      title: copy.meta.title,
      description: copy.meta.description,
      url,
      siteName: "Digital Farm",
      type: "website",
      images: OG_IMAGE ? [{ url: OG_IMAGE, width: 1200, height: 630, alt: stillFor("hero")?.alt }] : undefined,
    },
    twitter: { card: OG_IMAGE ? "summary_large_image" : "summary" },
  }
}
