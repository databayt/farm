# Docs

The docs site (`/en/docs`, `/rw/docs`): the farm study rendered as documentation. Ported from the
hogwarts docs block (`hogwarts/src/components/docs`), which mirrors the shadcn
docs block. It uses fumadocs-mdx and the upstream shadcn Radix primitives.

## How content flows

`guide/**/*.md`, `study/**/*.md` and `study/registers/*.csv` are the source of
truth. `scripts/sync-docs.mjs` generates `content/docs/en/*.mdx` and
`meta.json`, the Kinyarwanda pages (a guide's `X.rw.md`) at
`content/docs/rw/<same slug>.mdx`, and `public/_redirects` for the old
`/docs` URLs (D-058). It runs on `predev`, `prebuild` and `postinstall`, and
the output is git-ignored. The script:

- lifts each H1 into frontmatter;
- escapes MDX-unsafe `<` and `{` outside code;
- turns links between study files into `/docs` links without a language
  (the `a` in `src/mdx-components.tsx` adds the reader's), and a guide's link
  to its own translation into one that names its language (`hrefLang`);
- renders the CSV registers as tables.

`source.config.ts` compiles `content/docs` into the `docs` collection, which
`src/lib/source.ts` loads with fumadocs' i18n (`parser: "dir"`): one loader
for `/en/docs` and `/rw/docs`, where a page not yet in Kinyarwanda falls back
to the English one under a notice.

The sidebar is the places (D-059): Start here, one group per place in the
site menu's order (`src/components/site/places.json`), then the farm. A
place's pages are `guide/<place>/<kind>.md`: its execution plan (`plan.md`)
is the group's index at `/{lang}/docs/<place>`, the others follow at
`/{lang}/docs/<place>/<kind>` in the order of `KINDS` in
`scripts/sync-docs.mjs` (plan, today, master-plan, materials, electric,
lighting, net, plumbing, water, drainage), and a place has only the services
it needs. `sidebar-groups.ts` builds the groups on the server and names them
from the dictionaries (`places`, `docs.kinds`), so /rw shows them in
Kinyarwanda over English pages. Every other page (the study, the registers,
the archive) is listed in `PAGES` in `scripts/sync-docs.mjs` and renders off
the sidebar, reached from Start here and the places' pages.

A place's tables are React components in
`src/components/<place>/docs-sections.tsx`, reading the same data as its /en
page, whose tags link to their rows. A guide embeds one with a link on a line
of its own (below); the shared shapes are `rail-table.tsx` (materials),
`circuits-table.tsx`, `runs-table.tsx` and `points-table.tsx`.

## Files

| File | Purpose |
| --- | --- |
| `app/[lang]/docs/layout.tsx` | Sidebar shell (`SidebarProvider` + `DocsSidebar` in `<Suspense>`), the reader's language's tree |
| `app/[lang]/docs/[[...slug]]/page.tsx` | Page: title, description, copy-page, previous/next, MDX, table of contents; the English fallback and its notice |
| `sidebar-groups.ts` | The sidebar's groups: Start here, the places and the farm, named from the dictionaries |
| `docs-sidebar.tsx` | The groups, the one being read open; open/closed choices remembered |
| `rail-table.tsx`, `circuits-table.tsx`, `runs-table.tsx`, `points-table.tsx` | A place's materials, circuits, runs and points, as its docs pages show them |
| `toc.tsx`, `docs-copy-page.tsx`, `callout.tsx` | As in hogwarts |
| `src/mdx-components.tsx` | The shadcn docs typography, tables, code |

## Differences from hogwarts

- One loader with fumadocs' i18n instead of a loader per language: hogwarts'
  pair needs its proxy to add the locale, and the farm is a static export.
  The words come from `src/components/internationalization/{en,rw}.json`.
- No role grouping in the sidebar.
- No "View as Markdown" or v0 menu entries.
- No showcase atoms in the MDX map.
- With Cache Components and Partial Prefetching on, the page awaits `params`
  inside `<Suspense>` and the sidebar (`usePathname`) has its own boundary.
  This follows the Next 16 cache-components guide.

## Checks

`pnpm lint`, `npx tsc --noEmit`, and `pnpm build`, which prerenders all pages.

## Figures, 3D models and tables in study pages

A line on its own in a study Markdown file becomes a component (see the header of `scripts/sync-docs.mjs`):

- `![Caption](../../public/designs/x.svg)` renders `<Figure>` (a drawing on a white sheet card).
- `[Title](../../public/designs/x/studio.glb)` renders `<StudioViewer>` (three.js, loaded on demand; needs `parts.json` and `studio-poster.svg` beside the GLB).
- `[Table: Title](path/to/file.csv)` renders the CSV as a table, with a download link when the file is under `public/`.
- `[Title](../../src/components/<place>/docs-sections.tsx#Name)` renders `<Name title="Title" />`; the sync fails unless the file exports `Name` and `src/mdx-components.tsx` registers it.

In `guide/`, `{{studio.*}}`, `{{site.*}}` and `{{farming.*}}` are values from the generators' data
(the studio's `dims.json`, the master plan's `site-dims.json`, the field's `plan.json`); an unknown key fails the sync.

Other links into `public/` become downloads; a missing file fails the sync.
