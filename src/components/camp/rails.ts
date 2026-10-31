import { railCards } from "@/components/page/sections"
import { type RailItem } from "@/components/docs/item-rail"
import camp from "@/components/camp/camp.json"
import { words } from "@/components/camp/words"
import type { Locale } from "@/components/internationalization/config"
import type { Rail } from "@/components/docs/rail-table"

// The camp's rails, moved off its page so that the page (/[lang]/camp) and its Materials page in the docs
// (D-059) read one list; their words are in words.tsx.
const D = "/designs/camp"
const cm = (m: number) => Math.round(m * 100)

// The Kit rail: each piece rendered on its own by scripts/site/render/camp.html?item=<id> (the 3D's own meshes),
// its size from camp.json, which reads the furniture off the render. Nothing is sourced or priced yet.
export function kitRail(lang: Locale = "en"): RailItem[] {
  const { tent, futon, pillow, floorChair: chair, cushions, rug, throw: wrap, tray, lantern } = camp
  return railCards(`${D}/render/kit`, words[lang].rails.kit({
    across: tent.r * 2, top: tent.top.h, shoulder: tent.shoulder.h,
    fw: cm(futon.w), fl: cm(futon.y1 - futon.y0), fh: cm(futon.h), pw: cm(pillow.w), ph: cm(pillow.h),
    cw: cm(chair.w), cd: cm(chair.d), seat: cm(chair.seat), back: cm(chair.back),
    count: cushions.count, kw: cm(cushions.w), kd: cm(cushions.d), kh: cm(cushions.h),
    rw: cm(rug.w), rd: cm(rug.d), tw: cm(wrap.w), td: cm(wrap.d), bw: cm(tray.w), bd: cm(tray.d), lh: cm(lantern.h),
  }), lang)
}

// every rail, as the Materials page lists them
export function rails(lang: Locale): Rail[] {
  return [{ title: words[lang].kit, items: kitRail(lang) }]
}
