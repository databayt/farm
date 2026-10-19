import { defineConfig, defineDocs } from "fumadocs-mdx/config"

export default defineConfig()

// content/docs is generated from study/ by scripts/sync-docs.mjs; edit the study, not the MDX.
export const docs = defineDocs({
  dir: "content/docs",
})
