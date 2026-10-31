import type { Metadata } from "next"

import type { Locale } from "@/components/internationalization/config"

import { OG_IMAGE } from "./assets.generated"
import { stillFor } from "./render"
import { words } from "./words"

// The homepage's title and share card, for /en and /rw and for the bare `/` that picks between them (link
// previews read `/` without running its script), in the page's language (`/` is English). The card is cut from
// the opening still.
export function homeMetadata(url: string, lang: Locale = "en"): Metadata {
  const { meta } = words[lang]
  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      url,
      siteName: "Digital Farm",
      type: "website",
      images: OG_IMAGE ? [{ url: OG_IMAGE, width: 1200, height: 630, alt: stillFor("hero", lang)?.alt }] : undefined,
    },
    twitter: { card: OG_IMAGE ? "summary_large_image" : "summary" },
  }
}
