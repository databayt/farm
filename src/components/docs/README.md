# Docs

The `/docs` site: the farm study rendered as documentation. Ported from the
hogwarts docs block (`hogwarts/src/components/docs`), which mirrors the shadcn
docs block. It uses fumadocs-mdx and the upstream shadcn Radix primitives.

## How content flows

`study/**/*.md` and `study/registers/*.csv` are the source of truth.
`scripts/sync-docs.mjs` generates `content/docs/*.mdx` and `meta.json`. It runs
on `predev`, `prebuild` and `postinstall`, and the output is git-ignored. The
script:

- lifts each H1 into frontmatter;
- escapes MDX-unsafe `<` and `{` outside code;
- turns links between study files into `/docs` links;
- renders the CSV registers as tables.

`source.config.ts` compiles `content/docs` into the `docs` collection, which
`src/lib/source.ts` loads.

To add a page, add the study file to `PAGES` in `scripts/sync-docs.mjs`. A
`"---Label---"` entry starts a sidebar group.

## Files

| File | Purpose |
| --- | --- |
| `app/docs/layout.tsx` | Sidebar shell (`SidebarProvider` + `DocsSidebar` in `<Suspense>`) |
| `app/docs/[[...slug]]/page.tsx` | Page: title, description, copy-page, previous/next, MDX, table of contents |
| `docs-sidebar.tsx` | Groups from `meta.json` separators; open/closed choices remembered |
| `toc.tsx`, `docs-copy-page.tsx`, `callout.tsx` | As in hogwarts |
| `src/mdx-components.tsx` | The shadcn docs typography, tables, code |

## Differences from hogwarts

- No `[lang]` segment and no dictionary. The study is English-only until the
  website's languages are decided in Stage 6.
- No role grouping in the sidebar.
- No "View as Markdown" or v0 menu entries.
- No showcase atoms in the MDX map.
- With Cache Components and Partial Prefetching on, the page awaits `params`
  inside `<Suspense>` and the sidebar (`usePathname`) has its own boundary.
  This follows the Next 16 cache-components guide.

## Checks

`pnpm lint`, `npx tsc --noEmit`, and `pnpm build`, which prerenders all pages.
