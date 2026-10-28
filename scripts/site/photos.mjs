#!/usr/bin/env node
// The farm as it is: curated real photos for the docs, one web size each.
//
//   node scripts/site/photos.mjs            # scripts/site/photos.json -> public/photos/<date>/<slug>.webp
//
// Each entry names a private original (assets/, gitignored), the date (taken, or received when the
// file came through WhatsApp without one), a slug and a caption. Only people-free, plate-free photos
// go in (D-018, D-019); sharp drops all metadata, GPS included. A photo here is never a render.
import { existsSync, mkdirSync, readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import sharp from "sharp"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..")
const list = JSON.parse(readFileSync(join(ROOT, "scripts", "site", "photos.json"), "utf8"))
for (const { src, date, slug } of list) {
  const from = join(ROOT, src)
  if (!existsSync(from)) throw new Error(`missing original ${src}`)
  const dir = join(ROOT, "public", "photos", date)
  mkdirSync(dir, { recursive: true })
  const info = await sharp(from).rotate().resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 78 }).toFile(join(dir, `${slug}.webp`))
  console.log(`${date}/${slug}.webp ${info.width}x${info.height} ${(info.size / 1024).toFixed(0)} KB`)
}
