// The site's languages, after databayt's marketing kit (D-058). Kinyarwanda reads left to right like English.
// `reviewed` turns true once a native speaker has checked rw.json and the Kinyarwanda pages
// (study/website/implementation-plan.md §9); until then the /rw pages are kept out of search.
export const i18n = {
  defaultLocale: "en",
  locales: ["en", "rw"],
} as const

export type Locale = (typeof i18n)["locales"][number]

export const localeConfig = {
  en: { name: "English", nativeName: "English", dir: "ltr", reviewed: true },
  rw: { name: "Kinyarwanda", nativeName: "Ikinyarwanda", dir: "ltr", reviewed: false },
} as const

export function hasLocale(value: string | undefined): value is Locale {
  return (i18n.locales as readonly string[]).includes(value ?? "")
}
