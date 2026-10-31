import { docs } from "@/.source"
import { loader } from "fumadocs-core/source"

import { i18n } from "@/components/internationalization/config"

// One loader for both languages (D-058): scripts/sync-docs.mjs writes content/docs/en/** and, for the pages that
// have one, their Kinyarwanda at content/docs/rw/<same path>. fumadocs fills /rw with every English page, so a
// page not yet in Kinyarwanda falls back to the English one at its /rw URL. (Hogwarts runs a loader per language
// behind its proxy; a static export has no proxy to add the locale.)
export const docsSource = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
  i18n: { languages: [...i18n.locales], defaultLanguage: i18n.defaultLocale, parser: "dir" },
})
