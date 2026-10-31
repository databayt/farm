import { localeHref } from "@/components/internationalization/href"
import { getLocale } from "@/components/internationalization/locale"

import { words } from "./words"

// Under the 3D: an index of every page the plan links to, with each guide and its printed PDFs. Plain links,
// no client code, so the homepage's JS budget is untouched; they don't prefetch, as the site menu's don't.
// The hrefs are here and the names in words.ts, by key. Page paths take the reader's language when rendered.
type Label = keyof (typeof words)["en"]["references"]["links"]
type RefLink = { label: Label; href: string; hrefLang?: string }
type Row = keyof (typeof words)["en"]["references"]["rows"]
type Group = keyof (typeof words)["en"]["references"]["groups"]

const page = (href: string): RefLink => ({ label: "page", href })
const docs = (place: string): RefLink => ({ label: "docs", href: `/docs/${place}` })
// A printed docs page, its Kinyarwanda and both PDFs, named as scripts/print-docs.mjs names them: studio is
// studio-plan.pdf, studio/electric is studio-electric.pdf. Each language's link names its own, so /rw's English
// link still opens the English.
const printed = (path: string): RefLink[] => {
  const pdf = path.includes("/") ? path.replace("/", "-") : `${path}-plan`
  return [
    { label: "english", href: `/en/docs/${path}`, hrefLang: "en" },
    { label: "kinyarwanda", href: `/rw/docs/${path}`, hrefLang: "rw" },
    { label: "pdf", href: `/guides/${pdf}.pdf` },
    { label: "pdfRw", href: `/guides/${pdf}-rw.pdf` },
  ]
}

const GROUPS: { id: Group; rows: { id: Row; links: RefLink[] }[] }[] = [
  {
    id: "buildings",
    rows: [
      { id: "studio", links: [page("/en/studio"), docs("studio")] },
      { id: "guest-room", links: [page("/en/guest-room"), docs("guest-room")] },
      { id: "office", links: [page("/en/office"), docs("office")] },
      { id: "study-room", links: [page("/en/study-room"), docs("study-room")] },
      { id: "galley", links: [page("/en/galley"), docs("galley")] },
      { id: "public-bathroom", links: [page("/en/public-bathroom"), docs("public-bathroom")] },
      { id: "bar", links: [page("/en/bar"), docs("bar")] },
    ],
  },
  {
    id: "outside",
    rows: [
      { id: "camp", links: [page("/en/camp"), docs("camp")] },
      { id: "parking", links: [page("/en/parking"), docs("parking")] },
      { id: "volleyball", links: [page("/en/volleyball"), docs("volleyball")] },
      { id: "master-plan", links: [{ label: "docs", href: "/docs/farm/master-plan" }, { label: "drawing", href: "/designs/site/master-plan.svg" }] },
    ],
  },
  {
    id: "land",
    rows: [
      { id: "farming", links: [page("/en/farming"), docs("farming")] },
      { id: "livestock", links: [page("/en/livestock"), docs("livestock")] },
    ],
  },
  {
    id: "printed",
    rows: [
      { id: "print-studio", links: printed("studio") },
      { id: "print-studio-electric", links: printed("studio/electric") },
      { id: "print-studio-plumbing", links: printed("studio/plumbing") },
      { id: "print-farming", links: printed("farming") },
      { id: "print-livestock", links: printed("livestock") },
      { id: "print-farm-electric", links: printed("farm/electric") },
    ],
  },
  {
    id: "farm",
    rows: [
      { id: "start", links: [{ label: "docs", href: "/docs" }] },
      { id: "farm-plan", links: [docs("farm")] },
      { id: "today", links: [{ label: "docs", href: "/docs/farm/today" }] },
    ],
  },
]

export async function References() {
  const lang = await getLocale()
  const { title, lead, links, groups, rows } = words[lang].references
  return (
    <section id="references" aria-labelledby="references-title" className="px-4 pt-6 pb-16 md:px-10">
      <h2 id="references-title" className="text-3xl font-semibold tracking-tight">
        {title}
      </h2>
      <p className="text-muted-foreground mt-3 max-w-2xl text-sm">{lead}</p>
      <div className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-5">
        {GROUPS.map((group) => (
          <div key={group.id}>
            <h3 className="text-xs font-semibold tracking-widest uppercase">{groups[group.id]}</h3>
            <ul className="mt-3 space-y-3">
              {group.rows.map((row) => (
                <li key={row.id}>
                  <p className="text-sm font-medium">{rows[row.id]}</p>
                  <p className="text-muted-foreground mt-0.5 flex flex-wrap gap-x-3 text-sm">
                    {row.links.map((link) => (
                      <a key={link.href} href={link.hrefLang ? link.href : localeHref(lang, link.href)} hrefLang={link.hrefLang}
                        className="hover:text-foreground underline underline-offset-4">
                        {links[link.label]}
                      </a>
                    ))}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
