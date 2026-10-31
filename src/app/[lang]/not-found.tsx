import { NotFoundContent } from "@/components/site/not-found-content"

// A page missing under a language (notFound() in a page, or an unknown docs slug).
export default function NotFound() {
  return (
    <NotFoundContent
      title="This page doesn't exist"
      text="It may have moved when the study was reorganised. Start from the farm or the study."
      home={{ href: "/", label: "Digital Farm" }}
      docs={{ href: "/docs", label: "The open study" }}
    />
  )
}
