import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { hasLocale, i18n, localeConfig } from "@/components/internationalization/config"
import { metadataBase, RootDocument } from "@/components/site/root-document"

// The site in each language (D-058): /en and /rw, every page prerendered for both. This is the root layout, so
// every exported page carries its own <html lang>. Any other first segment is not a page.
export function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params
  return {
    metadataBase,
    title: "Farm study",
    description: "Feasibility study and plan for a technology-enabled integrated farm in Rwanda.",
    // The Kinyarwanda is a machine draft until a native speaker reviews it (§9 of the website plan): keep it out
    // of search until then.
    robots: hasLocale(lang) && !localeConfig[lang].reviewed ? { index: false, follow: true } : undefined,
  }
}

export default async function LangLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  return <RootDocument lang={lang}>{children}</RootDocument>
}
