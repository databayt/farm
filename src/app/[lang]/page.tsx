import type { Metadata } from "next"

import { HomeContent } from "@/components/home/content"
import { homeMetadata } from "@/components/home/metadata"
import { hasLocale, i18n } from "@/components/internationalization/config"
import { LoadingWrapper } from "@/components/loading"

// The Digital Farm homepage (src/components/home): the planned compound in Gashora, shown with
// labelled concept renders and, until they exist, labelled frames of the footage (D-017 to D-019).
// The study it grew from stays in the docs.
export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params
  return homeMetadata(`/${lang}`, hasLocale(lang) ? lang : i18n.defaultLocale)
}

export default function Home() {
  return (
    <LoadingWrapper>
      <HomeContent />
    </LoadingWrapper>
  )
}
