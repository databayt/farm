import { cn } from "@/lib/utils"

import { getDictionary } from "./dictionaries"
import { getLocale } from "./locale"

// One line under a page's hero on /rw while the page's own words are still English (D-058): the homepage and the
// place pages keep their copy in English until a Kinyarwanda version is written. Nothing on /en.
export async function NotTranslated({ className }: { className?: string }) {
  const lang = await getLocale()
  if (lang === "en") return null
  const t = await getDictionary(lang)
  return (
    <p lang={lang} className={cn("max-w-xl text-sm text-balance normal-case", className)}>
      {t.notice.notTranslated}
    </p>
  )
}
