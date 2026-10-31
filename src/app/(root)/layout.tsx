import type { Metadata } from "next"

import { metadataBase, RootDocument } from "@/components/site/root-document"

export const metadata: Metadata = { metadataBase }

// The bare `/` has no language of its own (D-058): its page only sends the reader on to /en or /rw.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return <RootDocument lang="en">{children}</RootDocument>
}
