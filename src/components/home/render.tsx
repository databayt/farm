import type { Locale } from "@/components/internationalization/config"

import { ASSETS, CLIPS, type Asset, type AssetId, type ClipId } from "./assets"
import { IMAGES, VIDEOS, type SiteImage, type Source } from "./assets.generated"
import { words } from "./words"

// What a homepage picture is called, in the reader's language: assets.ts keeps the English, words.ts lays the
// Kinyarwanda over it by id (a picture with no entry keeps its English).

/** A footage frame standing in for a render (D-019) is described as it is, not as planned. */
export function imageAlt(id: AssetId, source: Source, lang: Locale = "en"): string {
  const asset: Asset = ASSETS[id]
  const over = words[lang].assets[id]
  const alt = over?.alt ?? asset.alt
  return source === "today" && asset.kind === "render" ? (over?.today ?? asset.today ?? alt) : alt
}

function clipAlt(id: ClipId, source: Source, lang: Locale): string {
  return source === "today" ? (words[lang].clips[id]?.today ?? CLIPS[id].today) : imageAlt(CLIPS[id].still, "render", lang)
}

/** The still a clip plays over: its first frame, or its image slot when there is no clip. */
export function stillFor(id: ClipId, lang: Locale = "en"): { image: SiteImage; alt: string } | null {
  const video = VIDEOS[id]
  if (video) return { image: video.poster, alt: clipAlt(id, video.source, lang) }
  const slot = CLIPS[id].still
  const image = IMAGES[slot]
  return image ? { image, alt: imageAlt(slot, image.source, lang) } : null
}
