import { copy } from "./copy"

// Under the 3D: an index of every page the plan links to, with each guide and its printed PDFs. Plain links,
// no client code, so the homepage's JS budget is untouched; they don't prefetch, as the site menu's don't.
export function References() {
  const { title, lead, groups } = copy.references
  return (
    <section id="references" aria-labelledby="references-title" className="px-4 pt-6 pb-16 md:px-10">
      <h2 id="references-title" className="text-3xl font-semibold tracking-tight">
        {title}
      </h2>
      <p className="text-muted-foreground mt-3 max-w-2xl text-sm">{lead}</p>
      <div className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-5">
        {groups.map((group) => (
          <div key={group.title}>
            <h3 className="text-xs font-semibold tracking-widest uppercase">{group.title}</h3>
            <ul className="mt-3 space-y-3">
              {group.rows.map((row) => (
                <li key={row.name}>
                  <p className="text-sm font-medium">{row.name}</p>
                  <p className="text-muted-foreground mt-0.5 flex flex-wrap gap-x-3 text-sm">
                    {row.links.map((link) => (
                      <a key={link.href} href={link.href} className="hover:text-foreground underline underline-offset-4">
                        {link.label}
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
