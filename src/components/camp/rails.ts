import { railCards } from "@/components/page/sections"
import { type RailItem } from "@/components/docs/item-rail"
import camp from "@/components/camp/camp.json"
import type { Rail } from "@/components/docs/rail-table"

// The camp's rails, moved off its page so that the page (/[lang]/camp) and its Materials page in the docs
// (D-059) read one list.
const D = "/designs/camp"
const cm = (m: number) => Math.round(m * 100)

// The Kit rail: each piece rendered on its own by scripts/site/render/camp.html?item=<id> (the 3D's own meshes),
// its size from camp.json, which reads the furniture off the render. Nothing is sourced or priced yet.
export function kitRail(): RailItem[] {
  const { tent, futon, pillow, floorChair: chair, cushions, rug, throw: wrap, tray, lantern } = camp
  return railCards(`${D}/render/kit`, [
    { id: "tent", title: "Pop-up tent", size: `Hexagonal, ${tent.r * 2} m across the corners, ${tent.top.h} m high at the top, walls ${tent.shoulder.h} m at the shoulder`,
      note: "Off-white canvas with beige trim, mesh windows and poles outside each corner; the door is the whole front side and rolls up to a strap. The tents on the lawn today look about 2.5 m across." },
    { id: "futon", title: "Futon and cushion", size: `${cm(futon.w)} × ${cm(futon.y1 - futon.y0)} cm, ${cm(futon.h)} cm thick; cushion ${cm(pillow.w)} × ${cm(pillow.h)} cm`,
      note: "A white quilted floor mattress along the right wall, a cream cushion with a brown geometric band at its back. Sizes read off the render." },
    { id: "chair", title: "Floor chair", size: `${cm(chair.w)} × ${cm(chair.d)} cm, seat ${cm(chair.seat)} cm, back ${cm(chair.back)} cm`,
      note: "Legless, in tan linen, its back to the back-left wall, facing the door. Sizes read off the render." },
    { id: "cushions", title: `Floor cushions × ${cushions.count}`, size: `${cm(cushions.w)} × ${cm(cushions.d)} cm, ${cm(cushions.h)} cm thick each`,
      note: "Square and quilted, stacked inside the door on the right. Sizes read off the render." },
    { id: "rug", title: "Rug", size: `${cm(rug.w)} × ${cm(rug.d)} cm`, note: "A striped flat-weave in rust, orange, teal and cream, in the middle of the floor. Size read off the render." },
    { id: "throw", title: "Throw", size: `Folded ${cm(wrap.w)} × ${cm(wrap.d)} cm`, note: "A wool throw with a fringe, folded on the floor inside the door. Size read off the render." },
    { id: "tray", title: "Tea board", size: `${cm(tray.w)} × ${cm(tray.d)} cm, with a teapot and two cups`, note: "A timber board on the rug, with a round clay teapot and two clay cups. Size read off the render." },
    { id: "lantern", title: "Lantern", size: `${cm(lantern.h)} cm high`, note: "A brass hurricane-style lantern on the floor at the back. Whether it burns or runs on a battery is not decided." },
  ])
}

// every rail, as the Materials page lists them
export const rails: Rail[] = [
  { title: "Kit", items: kitRail() },
]
