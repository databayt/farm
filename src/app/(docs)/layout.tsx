import type { Metadata } from "next"

import { metadataBase, RootDocument } from "@/components/site/root-document"

export const metadata: Metadata = { metadataBase }

// The docs keep /docs for one more step of the move under /[lang] (D-058); this root goes when they do.
export default function DocsRootLayout({ children }: LayoutProps<"/docs">) {
  return <RootDocument lang="en">{children}</RootDocument>
}
