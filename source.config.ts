import { defineConfig, defineDocs, frontmatterSchema } from "fumadocs-mdx/config"
import { z } from "zod"

export default defineConfig()

// content/docs is generated from guide/ and study/ by scripts/sync-docs.mjs; edit those, not the MDX. A place's
// pages (D-059) also carry which place and which kind of page they are, for the sidebar and the page's header.
export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    schema: frontmatterSchema.extend({
      place: z.string().optional(),
      kind: z.string().optional(),
    }),
  },
})
