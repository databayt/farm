import type { Metadata } from "next"

import { NotFoundContent } from "@/components/site/not-found-content"
import { RootDocument } from "@/components/site/root-document"

// out/404.html, for a miss outside /en and /rw. The site has a root layout per language and one for `/`, so the
// 404 above them all draws its own document (experimental.globalNotFound in next.config.ts), in English.
export const metadata: Metadata = {
  title: "404 · Digital Farm",
  robots: { index: false, follow: false },
}

export default function GlobalNotFound() {
  return (
    <RootDocument lang="en">
      <NotFoundContent lang="en" />
    </RootDocument>
  )
}
