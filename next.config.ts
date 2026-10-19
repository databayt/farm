import type { NextConfig } from "next"
import { createMDX } from "fumadocs-mdx/next"

const nextConfig: NextConfig = {
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  // The public website is Stage 6; until then the root opens the study.
  async redirects() {
    return [{ source: "/", destination: "/docs", permanent: false }]
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
}

// fumadocs-mdx compiles content/docs (generated from study/ by scripts/sync-docs.mjs).
const withMDX = createMDX()

export default withMDX(nextConfig)
