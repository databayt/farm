// next/image loader for the static export. CF_STATIC builds have no image optimiser, so
// scripts/site/build-assets.mjs writes every width ahead of time and this picks the file:
// /site/img/<id>.webp?v=<hash> at width w → /site/img/<id>-<w>.webp?v=<hash>. The hero's photos
// (scripts/site/hero.mjs) sit in /site/hero/ under the same scheme.
// No "use client" here: getImageProps loads this file on the server too.
export const WIDTHS = [640, 960, 1280, 1920]

export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }) {
  const [path, query] = src.split("?")
  if (!path.startsWith("/site/img/") && !path.startsWith("/site/hero/")) {
    // Anything else is served as is; the width only keeps next/image from warning.
    return `${src}${query === undefined ? "?" : "&"}w=${width}`
  }
  const w = WIDTHS.find((size) => size >= width) ?? WIDTHS[WIDTHS.length - 1]
  return `${path.replace(/\.webp$/, `-${w}.webp`)}${query === undefined ? "" : `?${query}`}`
}
