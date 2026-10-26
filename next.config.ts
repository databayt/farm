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
  // No optimiser on Workers Static Assets: the homepage's widths are pre-built by
  // scripts/site/build-assets.mjs and src/lib/image-loader.ts picks one (both builds).
  images: {
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    deviceSizes: [640, 960, 1280, 1920],
    imageSizes: [],
  },
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
