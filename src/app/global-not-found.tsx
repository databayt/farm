import type { Metadata } from "next"

import { NotFoundContent } from "@/components/site/not-found-content"
import { RootDocument } from "@/components/site/root-document"

// out/404.html, for a miss outside /en and /rw. The site has a root layout per language and one for `/`, so the
// 404 above them all draws its own document (experimental.globalNotFound in next.config.ts).
export const metadata: Metadata = {
  title: "404 · Digital Farm",
  robots: { index: false, follow: false },
}

export default function GlobalNotFound() {
  return (
    <RootDocument lang="en">
      <NotFoundContent
        title="This page doesn't exist"
        text="It may have moved when the study was reorganised. Start from the farm or the study."
        home={{ href: "/", label: "Digital Farm" }}
        docs={{ href: "/docs", label: "The open study" }}
      />
    </RootDocument>
  )
}
