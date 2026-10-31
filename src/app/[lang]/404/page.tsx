import type { Metadata } from "next"

import NotFound from "../not-found"

// out/en/404.html and out/rw/404.html: Cloudflare serves the nearest 404.html up the path (wrangler.jsonc
// "404-page"), so a miss under /en or /rw gets its own language's page.
export const metadata: Metadata = {
  title: "404 · Digital Farm",
  robots: { index: false, follow: false },
}

export default function NotFoundPage() {
  return <NotFound />
}
