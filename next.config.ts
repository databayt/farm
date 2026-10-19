import type { NextConfig } from "next"
import { createMDX } from "fumadocs-mdx/next"

// CF_STATIC=1 builds a static export (out/) for Cloudflare Workers Static Assets,
// as in thmanyah: no database, auth or API routes, every page is prerendered.
const STATIC = Boolean(process.env.CF_STATIC)

const nextConfig: NextConfig = {
  ...(STATIC ? { output: "export" as const, trailingSlash: false } : {}),
  experimental: {
    agentFeedback: true,
  },
  // A static export cannot partially prerender, so the export turns these off.
  cacheComponents: !STATIC,
  partialPrefetching: !STATIC,
  reactCompiler: true,
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
