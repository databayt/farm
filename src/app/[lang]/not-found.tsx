import { getLocale } from "@/components/internationalization/locale"
import { NotFoundContent } from "@/components/site/not-found-content"

// A page missing under a language (notFound() in a page, or an unknown docs slug).
export default async function NotFound() {
  const lang = await getLocale()
  return <NotFoundContent lang={lang} />
}
