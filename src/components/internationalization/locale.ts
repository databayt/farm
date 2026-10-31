import { lang } from "next/root-params"

import { hasLocale, i18n, type Locale } from "./config"

// The reader's language in any server component, from the root segment (app/[lang]), without passing it down.
// Outside /[lang] (the bare `/` and the global 404) there is none, so English.
export async function getLocale(): Promise<Locale> {
  const value = await lang()
  return hasLocale(value) ? value : i18n.defaultLocale
}
