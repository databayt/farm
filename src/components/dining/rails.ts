import { railCards } from "@/components/page/sections"
import { type RailItem } from "@/components/docs/item-rail"
import dining from "@/components/dining/dining.json"
import { words } from "@/components/dining/words"
import type { Locale } from "@/components/internationalization/config"
import type { Rail } from "@/components/docs/rail-table"

// The dining area's rails, off its page so that the page (/[lang]/dining) and its Materials page in the docs (D-059)
// read one list; their words are in words.tsx. Each part is rendered on its own by
// scripts/site/render/dining.html?item=<id> (the 3D's own meshes), its size from dining.json. Nothing is sourced or
// priced yet.
const D = "/designs/dining"
const cm = (m: number) => Math.round(m * 100)
const mm = (m: number) => Math.round(m * 1000)
const { wall, frame, mesh, thatch, tables, bench, counter, lights } = dining

export function structureRail(lang: Locale = "en"): RailItem[] {
  return railCards(`${D}/render/item`, words[lang].rails.structure({
    length: wall.length, width: wall.width, h: wall.h, t: wall.t, crown: frame.crown, arches: frame.arches,
    grid: mm(mesh.grid), thatch: mm(thatch.t), eave: mm(thatch.eave),
  }), lang)
}

export function furnitureRail(lang: Locale = "en"): RailItem[] {
  return railCards(`${D}/render/item`, words[lang].rails.furniture({
    tl: cm(tables.l), tw: cm(tables.w), th: cm(tables.h), seats: tables.seats * 2, bw: cm(bench.w), bh: cm(bench.h),
    cl: cm(counter.l), cw: cm(counter.w), ch: cm(counter.h), lamps: lights.count,
  }), lang)
}

// every rail, as the Materials page lists them
export function rails(lang: Locale): Rail[] {
  const s = words[lang].sections
  return [{ title: s.structure, items: structureRail(lang) }, { title: s.furniture, items: furnitureRail(lang) }]
}
