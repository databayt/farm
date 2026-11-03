// The homepage film with motion graphics (D-070; founder 2026-11-03: "add motion graphics and make good video"): a
// HyperFrames project (HTML rendered to video, free and local) built from the 21 photos of ~/Desktop/farm-film
// (packs.mjs). Camera moves on each photo, moves between them that have a cause on screen (a whip as the camera
// turns, a push through the gate, a rise into the drone), the place names as lower thirds, the plan's places
// labelled on the aerial view, and an opening title and an end card in the site's own type (Cormorant Garamond,
// Geist). A concept film (film.md rule 2): it says so on screen throughout.
//
//   node scripts/site/film/motion.mjs              writes the project to assets/film/motion (gitignored)
//   cd assets/film/motion && npx hyperframes check --json && npx hyperframes render --quality delivery -o out.mp4
// The founder's copy is ~/Desktop/farm-film/digital-farm-film.mp4. The project keeps the site's two font files (the
// Latin subsets from the static export's _next/static/media) in assets/fonts.
import { copyFileSync, existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs"
import { homedir } from "node:os"
import { join } from "node:path"

import { ROOT } from "../chrome.mjs"

const OUT = join(ROOT, "assets/film/motion")
const PHOTOS = join(homedir(), "Desktop/farm-film")
const FONTS = join(OUT, "assets/fonts") // cormorant-garamond-500.woff2, geist.woff2: the site's Latin subsets

// ------------------------------------------------------------ the film, shot by shot (seconds are global)
// kb: the camera move on the photo, [scale, focus x, focus y] from and to. in/out: the move between shots.
// at: a point in the photo (fractions) that a push-through or a label aims at.
const SCENES = [
  {
    id: "arrival",
    shots: [
      { n: "01", start: 0, end: 6.0, kb: [[1, 0.5, 0.5], [1.06, 0.58, 0.52]], out: { kind: "whip", dir: -1, at: 5.6 } },
      { n: "02", start: 5.7, end: 10.3, kb: [[1, 0.5, 0.55], [1.16, 0.46, 0.52]], in: { kind: "whip", dir: -1 }, out: { kind: "through", at: 9.85, to: [0.42, 0.5] },
        lt: { at: 6.4, end: 9.4, num: "02", name: "The road", sub: "To the farm, five minutes from the lake" } },
      { n: "03", start: 10.3, end: 20.6, kb: [[1.7, 0.6, 0.8], [1, 0.5, 0.5]], kbEnd: 14.0, out: { kind: "through", at: 20.1, to: [0.71, 0.555] }, map: { at: 14.1, end: 19.7 } },
    ],
    title: { at: 1.0, end: 4.8 },
  },
  {
    id: "courtyard",
    shots: [
      { n: "04", start: 20.6, end: 25.8, kb: [[1, 0.5, 0.55], [1.32, 0.52, 0.48]], in: { kind: "settle" }, out: { kind: "whip", dir: -1, at: 25.5 },
        lt: { at: 21.4, end: 24.7, num: "04", name: "The inner gate", sub: "Into the courtyard" } },
      { n: "05", start: 25.6, end: 30.8, kb: [[1.12, 0.36, 0.55], [1.12, 0.64, 0.52]], in: { kind: "whip", dir: -1 }, out: { kind: "whip", dir: -1, at: 30.5 },
        lt: { at: 26.3, end: 29.7, num: "05", name: "Camping", sub: "Tents round the fire pit" } },
      { n: "06", start: 30.6, end: 35.8, kb: [[1, 0.5, 0.55], [1.14, 0.5, 0.5]], in: { kind: "whip", dir: -1 }, out: { kind: "rise", at: 35.5 },
        lt: { at: 31.3, end: 34.7, num: "06", name: "Studios", sub: "Two studios with roof terraces" } },
      { n: "07", start: 35.6, end: 41.0, kb: [[1, 0.5, 0.55], [1.2, 0.42, 0.47]], in: { kind: "rise" }, out: { kind: "through", at: 40.5, to: [0.39, 0.45] },
        lt: { at: 36.3, end: 39.8, num: "07", name: "The courtyard", sub: "From above" } },
    ],
  },
  {
    id: "places",
    // ten places, three seconds each, the camera whipping between them; one label rolls through their names
    shots: [
      ["08", "Office", [[1, 0.5, 0.55], [1.08, 0.5, 0.55]]],
      ["09", "Bar", [[1, 0.5, 0.5], [1.1, 0.5, 0.45]]],
      ["10", "Guest rooms", [[1.04, 0.35, 0.55], [1.08, 0.65, 0.55]]],
      ["11", "Study room", [[1, 0.5, 0.5], [1.07, 0.5, 0.5]]],
      ["12", "Galley", [[1, 0.5, 0.5], [1.07, 0.56, 0.5]]],
      ["13", "Public bathroom", [[1, 0.5, 0.5], [1.07, 0.5, 0.5]]],
      ["14", "Volleyball", [[1.02, 0.4, 0.55], [1.08, 0.6, 0.55]]],
      ["15", "Dining area", [[1, 0.5, 0.55], [1.08, 0.5, 0.6]]],
      ["16", "Vegetable field", [[1, 0.5, 0.6], [1.08, 0.5, 0.45]]],
      ["17", "Livestock", [[1, 0.5, 0.55], [1.07, 0.5, 0.55]]],
    ].map(([n, name, kb], i, all) => {
      const start = 41.0 + i * 3
      const last = i === all.length - 1
      return {
        n, name, start: i ? start - 0.15 : start, end: start + 3 + (last ? 0 : 0.15), kb,
        in: i ? { kind: "whip", dir: i % 2 ? -1 : 1 } : { kind: "settle" },
        out: last ? { kind: "rise", at: 70.7 } : { kind: "whip", dir: (i + 1) % 2 ? -1 : 1, at: start + 2.85 },
      }
    }),
    roll: { at: 41.4, end: 70.5, header: "The places" },
  },
  {
    id: "above",
    shots: [
      { n: "18", start: 71.0, end: 75.6, kb: [[1, 0.5, 0.5], [1.12, 0.42, 0.45]], in: { kind: "rise" }, out: { kind: "dissolve", at: 75.2 } },
      { n: "19", start: 75.2, end: 80.4, kb: [[1.06, 0.5, 0.5], [1.12, 0.52, 0.48]], turn: [0, 3], in: { kind: "dissolve" }, out: { kind: "dissolve", at: 80.0 } },
      { n: "20", start: 80.0, end: 84.6, kb: [[1.12, 0.45, 0.55], [1.12, 0.55, 0.5]], in: { kind: "dissolve" }, out: { kind: "dissolve", at: 84.2 } },
      { n: "21", start: 84.2, end: 89.0, kb: [[1, 0.5, 0.5], [1.3, 0.62, 0.25]], in: { kind: "dissolve" }, out: { kind: "through", at: 88.55, to: [0.6, 0.12] } },
    ],
    chapter: { at: 71.6, end: 74.6, text: "The whole farm" },
  },
  {
    id: "end",
    shots: [{ n: "01", start: 89.0, end: 96.0, kb: [[1, 0.5, 0.5], [1.04, 0.52, 0.52]], in: { kind: "settle" } }],
    card: { at: 89.9 },
  },
]
const LENGTH = 96

// The places on the aerial view (03, the farm from above the gate), measured on a 5% grid of the photo: pin, then
// where its label sits (fractions of the frame), in the order the walk meets them
const MAP = [
  ["Gate", [0.69, 0.81], [0.79, 0.9]],
  ["Parking", [0.58, 0.74], [0.82, 0.7]],
  ["Inner gate", [0.71, 0.555], [0.83, 0.6]],
  ["Camping", [0.59, 0.5], [0.47, 0.6]],
  ["Studios", [0.645, 0.38], [0.72, 0.26]],
  ["Office", [0.53, 0.37], [0.53, 0.235]],
  ["Bar", [0.385, 0.36], [0.31, 0.265]],
  ["Guest rooms", [0.35, 0.46], [0.2, 0.48]],
  ["Study room", [0.415, 0.32], [0.43, 0.185]],
  ["Galley", [0.65, 0.32], [0.62, 0.155]],
  ["Public bathroom", [0.82, 0.33], [0.86, 0.2]],
  ["Volleyball", [0.27, 0.58], [0.17, 0.66]],
  ["Vegetable field", [0.14, 0.41], [0.12, 0.3]],
]

// ------------------------------------------------------------ markup
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;")
const words = (s, cls) => esc(s).split(" ").map((w) => `<span class="${cls}">${w}</span>`).join(" ")
const letters = (s, cls) => [...s].map((c) => (c === " " ? " " : `<span class="${cls}">${esc(c)}</span>`)).join("")

const STYLE = `
  @font-face { font-family: "Cormorant Garamond"; font-weight: 500; src: url("assets/fonts/cormorant-garamond-500.woff2") format("woff2"); }
  @font-face { font-family: "Geist"; font-weight: 100 900; src: url("assets/fonts/geist.woff2") format("woff2"); }
  #root { position: absolute; inset: 0; overflow: hidden; background: #0d0d0b; color: #f4efe4; font-family: "Geist"; }
  .shot { position: absolute; inset: 0; overflow: hidden; }
  .whip, .cam { position: absolute; inset: 0; }
  .cam img { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; object-fit: cover; }
  .shade { position: absolute; inset: 0; background: linear-gradient(to top, rgba(8,8,6,0.74) 0%, rgba(8,8,6,0.4) 24%, rgba(8,8,6,0) 48%); }
  .shade-top { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(8,8,6,0.38) 0%, rgba(8,8,6,0) 18%); }
  .tag { position: absolute; left: 192px; top: 112px; font-size: 28px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; padding: 8px 18px 7px; border-radius: 999px; background: rgba(16,15,12,0.6); }
  .lt { position: absolute; left: 192px; bottom: 150px; }
  .lt-num { font-size: 28px; font-weight: 600; letter-spacing: 0.24em; color: #d6cfbe; }
  .lt-name { font-family: "Cormorant Garamond"; font-size: 76px; line-height: 1; text-transform: uppercase; letter-spacing: 0.02em; margin-top: 10px; text-shadow: 0 2px 22px rgba(0,0,0,0.45); }
  .lt-rule { width: 120px; height: 2px; background: #d6cfbe; margin: 18px 0 16px; transform-origin: 0 50%; }
  .lt-sub { font-size: 30px; letter-spacing: 0.02em; color: #ebe5d8; text-shadow: 0 1px 14px rgba(0,0,0,0.55); }
  .w, .ch { display: inline-block; }
  .title { position: absolute; left: 192px; bottom: 190px; }
  .title-big { font-family: "Cormorant Garamond"; font-size: 168px; line-height: 0.92; text-transform: uppercase; letter-spacing: 0.015em; }
  .title-sub { font-size: 30px; font-weight: 500; letter-spacing: 0.32em; text-transform: uppercase; margin-top: 26px; color: #ebe5d8; }
  .pin { position: absolute; width: 18px; height: 18px; margin: -9px 0 0 -9px; border-radius: 50%; background: #f4efe4; box-shadow: 0 0 0 4px rgba(13,13,11,0.45); }
  .label { position: absolute; transform-origin: 50% 50%; }
  .label-in { font-size: 28px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; padding: 9px 16px 8px; border-radius: 999px; background: rgba(16,15,12,0.72); white-space: nowrap; }
  .leaders { position: absolute; inset: 0; }
  .roll { position: absolute; left: 160px; bottom: 130px; padding: 22px 34px 18px 32px; border-radius: 6px; background: linear-gradient(to right, rgba(12,11,9,0.62), rgba(12,11,9,0.38) 70%, rgba(12,11,9,0)); }
  .roll-head { font-size: 28px; font-weight: 600; letter-spacing: 0.24em; text-transform: uppercase; color: #d6cfbe; }
  .roll-win { height: 80px; overflow: hidden; margin-top: 8px; }
  .roll-strip .row { height: 80px; display: flex; align-items: center; gap: 28px; }
  .roll-strip .num { font-size: 30px; font-weight: 600; letter-spacing: 0.2em; color: #d6cfbe; width: 56px; text-shadow: 0 1px 14px rgba(0,0,0,0.6); }
  .roll-strip .name { font-family: "Cormorant Garamond"; font-size: 76px; text-transform: uppercase; letter-spacing: 0.02em; text-shadow: 0 2px 22px rgba(0,0,0,0.55); }
  .chapter { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
  .chapter-in { font-family: "Cormorant Garamond"; font-size: 132px; text-transform: uppercase; letter-spacing: 0.04em; text-shadow: 0 2px 30px rgba(0,0,0,0.35); }
  .card { position: absolute; left: 192px; bottom: 190px; }
  .card-big { font-family: "Cormorant Garamond"; font-size: 168px; line-height: 0.92; text-transform: uppercase; letter-spacing: 0.015em; }
  .card-url { font-size: 34px; font-weight: 500; letter-spacing: 0.06em; margin-top: 30px; }
  .card-note { font-size: 28px; letter-spacing: 0.04em; margin-top: 14px; color: #d9d2c3; }
`

function scene(sc) {
  const id = sc.id
  const sStart = Math.min(...sc.shots.map((s) => s.start))
  const sEnd = Math.max(...sc.shots.map((s) => s.end))
  const t = (g) => +(g - sStart).toFixed(3) // global → scene time
  const els = []
  let z = 1
  for (const s of sc.shots) {
    els.push(
      `<div id="${id}-p${s.n}" class="clip shot" data-start="${t(s.start)}" data-duration="${+(s.end - s.start).toFixed(3)}" data-track-index="1" style="z-index:${z++}">` +
        `<div class="whip" id="${id}-w${s.n}"><div class="cam" id="${id}-c${s.n}"><img src="assets/photos/${s.n}.jpg" alt="" /></div></div></div>`,
    )
  }
  const dur = +(sEnd - sStart).toFixed(3)
  els.push(`<div id="${id}-shade" class="clip shade" data-start="0" data-duration="${dur}" data-track-index="2" style="z-index:50" data-layout-ignore></div>`)
  els.push(`<div id="${id}-shadetop" class="clip shade-top" data-start="0" data-duration="${dur}" data-track-index="2" style="z-index:50" data-layout-ignore></div>`)
  // the concept tag, always on screen (film.md rule 2)
  els.push(`<div id="${id}-tag" class="clip tag" data-start="0" data-duration="${dur}" data-track-index="3" style="z-index:60">Concept film</div>`)
  for (const s of sc.shots.filter((x) => x.lt)) {
    const { lt } = s
    els.push(
      `<div id="${id}-lt${s.n}" class="clip lt" data-start="${t(lt.at)}" data-duration="${+(lt.end - lt.at + 0.3).toFixed(3)}" data-track-index="4" style="z-index:70">` +
        `<div class="lt-num">${lt.num}</div><div class="lt-name">${words(lt.name, "w")}</div><div class="lt-rule"></div><div class="lt-sub">${words(lt.sub, "w")}</div></div>`,
    )
  }
  if (sc.title)
    els.push(
      `<div id="${id}-title" class="clip title" data-start="${t(sc.title.at)}" data-duration="${+(sc.title.end - sc.title.at + 0.3).toFixed(3)}" data-track-index="4" style="z-index:70">` +
        `<div class="title-big">${letters("Digital Farm", "ch")}</div><div class="title-sub">${words("Gashora · Rwanda", "w")}</div></div>`,
    )
  for (const s of sc.shots.filter((x) => x.map)) {
    const { map } = s
    const d = +(map.end - map.at + 0.4).toFixed(3)
    const lines = MAP.map(([, [px, py], [lx, ly]], i) =>
      `<line class="leader" id="${id}-ld${i}" x1="${px * 1920}" y1="${py * 1080}" x2="${lx * 1920}" y2="${ly * 1080}" stroke="#f4efe4" stroke-opacity="0.9" stroke-width="2" pathLength="100" stroke-dasharray="100 120" stroke-dashoffset="110" />`).join("")
    els.push(
      `<div id="${id}-map" class="clip" data-start="${t(map.at)}" data-duration="${d}" data-track-index="5" style="position:absolute;inset:0;z-index:65" data-layout-allow-overlap>` +
        `<svg class="leaders" width="1920" height="1080" viewBox="0 0 1920 1080">${lines}</svg>` +
        MAP.map(([name, [px, py], [lx, ly]], i) =>
          `<div class="pin" id="${id}-pin${i}" style="left:${px * 1920}px;top:${py * 1080}px"></div>` +
          `<div class="label" id="${id}-lb${i}" style="left:${lx * 1920}px;top:${ly * 1080}px"><div class="label-in" style="transform:translate(-50%,-50%)">${esc(name)}</div></div>`).join("") +
        `</div>`,
    )
  }
  if (sc.roll) {
    const rows = sc.shots.map((s, i) => `<div class="row" id="${id}-row${i}"><div class="num">${s.n}</div><div class="name">${esc(s.name)}</div></div>`).join("")
    els.push(
      `<div id="${id}-roll" class="clip roll" data-start="${t(sc.roll.at)}" data-duration="${+(sc.roll.end - sc.roll.at + 0.3).toFixed(3)}" data-track-index="4" style="z-index:70">` +
        `<div class="roll-head">${esc(sc.roll.header)}</div><div class="roll-win"><div class="roll-strip" id="${id}-strip">${rows}</div></div></div>`,
    )
  }
  if (sc.chapter)
    els.push(
      `<div id="${id}-chapter" class="clip chapter" data-start="${t(sc.chapter.at)}" data-duration="${+(sc.chapter.end - sc.chapter.at + 0.3).toFixed(3)}" data-track-index="4" style="z-index:70">` +
        `<div class="chapter-in">${words(sc.chapter.text, "w")}</div></div>`,
    )
  if (sc.card)
    els.push(
      `<div id="${id}-card" class="clip card" data-start="${t(sc.card.at)}" data-duration="${+(sEnd - sc.card.at).toFixed(3)}" data-track-index="4" style="z-index:70">` +
        `<div class="card-big" id="${id}-cardbig">Digital Farm</div><div class="card-url" id="${id}-cardurl">farm.databayt.org</div>` +
        `<div class="card-note">${words("A concept film, made with AI from the plan", "w")}</div></div>`,
    )

  // ---------------------------------------------------------- the timeline
  const js = []
  for (const s of sc.shots) {
    const c = `#${id}-c${s.n}`, w = `#${id}-w${s.n}`
    const a = t(s.start), b = t(s.kbEnd ?? s.end)
    js.push(`kb("${c}", ${JSON.stringify(s.kb[0])}, ${JSON.stringify(s.kb[1])}, ${a}, ${+(b - a).toFixed(3)}, ${s.kbEnd ? '"power2.inOut"' : '"sine.inOut"'}, ${JSON.stringify(s.turn ?? null)});`)
    if (s.in?.kind === "whip") js.push(`tl.fromTo("${w}", { x: ${-s.in.dir * 760} }, { x: 0, duration: 0.34, ease: "power3.out" }, ${a});`)
    if (s.in?.kind === "rise") js.push(`tl.fromTo("${w}", { y: -620 }, { y: 0, duration: 0.38, ease: "power3.out" }, ${a});`)
    if (s.in?.kind === "settle") js.push(`tl.fromTo("${w}", { scale: 1.12 }, { scale: 1, duration: 0.7, ease: "expo.out" }, ${a});`)
    if (s.in?.kind === "dissolve") js.push(`tl.fromTo("${w}", { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power1.inOut" }, ${a});`)
    if (s.out?.kind === "whip") js.push(`tl.fromTo("${w}", { x: 0 }, { x: ${s.out.dir * 760}, duration: 0.3, ease: "power3.in", immediateRender: false }, ${t(s.out.at)});`)
    if (s.out?.kind === "rise") js.push(`tl.fromTo("${w}", { y: 0 }, { y: 620, duration: 0.3, ease: "power3.in", immediateRender: false }, ${t(s.out.at)});`)
    if (s.out?.kind === "through")
      js.push(`through("${c}", "${w}", ${JSON.stringify(s.kb[1])}, ${JSON.stringify(s.out.to)}, ${t(s.out.at)}, ${+(s.end - s.out.at).toFixed(3)});`)
  }
  for (const s of sc.shots.filter((x) => x.lt)) {
    const L = `#${id}-lt${s.n}`, a = t(s.lt.at), e = t(s.lt.end)
    js.push(
      `tl.fromTo("${L} .lt-num", { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" }, ${a});`,
      `tl.fromTo("${L} .lt-name .w", { opacity: 0, filter: "blur(6px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.16, stagger: 0.07, ease: "power4.out" }, ${a + 0.08});`,
      `tl.fromTo("${L} .lt-rule", { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: "expo.out" }, ${a + 0.2});`,
      `tl.fromTo("${L} .lt-sub .w", { opacity: 0, color: "#8f897c" }, { opacity: 1, color: "#ebe5d8", duration: 0.2, stagger: 0.08, ease: "power2.out" }, ${a + 0.35});`,
      `tl.fromTo("${L} > *", { opacity: 1, filter: "blur(0px)" }, { opacity: 0, filter: "blur(6px)", duration: 0.2, stagger: 0.04, ease: "power2.in", immediateRender: false }, ${e});`,
    )
  }
  if (sc.title) {
    const T = `#${id}-title`, a = t(sc.title.at), e = t(sc.title.end)
    js.push(
      `tl.fromTo("${T} .ch", { opacity: 0.0, filter: "blur(8px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.5, stagger: 0.07, ease: "power3.out" }, ${a});`,
      `tl.fromTo("${T} .title-sub .w", { opacity: 0, color: "#8f897c" }, { opacity: 1, color: "#ebe5d8", duration: 0.25, stagger: 0.1, ease: "power2.out" }, ${a + 1.1});`,
      `tl.fromTo("${T} > *", { opacity: 1, filter: "blur(0px)" }, { opacity: 0, filter: "blur(8px)", duration: 0.25, stagger: 0.06, ease: "power2.in", immediateRender: false }, ${e});`,
    )
  }
  for (const s of sc.shots.filter((x) => x.map)) {
    const a = t(s.map.at), e = t(s.map.end)
    MAP.forEach((_, i) => {
      const k = +(a + i * 0.2).toFixed(3)
      js.push(
        `tl.fromTo("#${id}-pin${i}", { scale: 0 }, { scale: 1, duration: 0.4, ease: "expo.out" }, ${k});`,
        `tl.fromTo("#${id}-ld${i}", { attr: { "stroke-dashoffset": 110 } }, { attr: { "stroke-dashoffset": 0 }, duration: 0.45, ease: "power2.out" }, ${k + 0.05});`,
        `tl.fromTo("#${id}-lb${i}", { opacity: 0, filter: "blur(6px)", scale: 0.92 }, { opacity: 1, filter: "blur(0px)", scale: 1, duration: 0.3, ease: "power4.out" }, ${k + 0.3});`,
      )
    })
    js.push(`tl.fromTo("#${id}-map > *", { opacity: 1 }, { opacity: 0, duration: 0.25, ease: "power2.in", immediateRender: false }, ${e});`)
  }
  if (sc.roll) {
    const R = `#${id}-roll`, a = t(sc.roll.at), e = t(sc.roll.end)
    js.push(
      `tl.fromTo("${R} .roll-head", { opacity: 0 }, { opacity: 1, duration: 0.3 }, ${a});`,
      `tl.fromTo("${R} .roll-win", { opacity: 0, filter: "blur(8px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.2, ease: "power4.out" }, ${a + 0.1});`,
    )
    // only the current name is on screen: the others wait, unseen, above and below the window
    js.push(`tl.set("#${id}-strip .row", { opacity: 0 }, 0);`, `tl.set("#${id}-row0", { opacity: 1 }, 0);`)
    sc.shots.slice(1).forEach((s, i) => {
      const at = +(t(s.start + 0.15) - 0.14).toFixed(3) // each place's cut, the roll a little ahead of it
      js.push(
        `tl.fromTo("#${id}-strip", { y: ${-80 * i} }, { y: ${-80 * (i + 1)}, duration: 0.34, ease: "power3.inOut", immediateRender: false }, ${at});`,
        `tl.fromTo("#${id}-row${i}", { opacity: 1 }, { opacity: 0, duration: 0.24, ease: "power2.in", immediateRender: false }, ${at});`,
        `tl.fromTo("#${id}-row${i + 1}", { opacity: 0 }, { opacity: 1, duration: 0.24, ease: "power2.out", immediateRender: false }, ${+(at + 0.1).toFixed(3)});`,
      )
    })
    js.push(`tl.fromTo("${R} > *", { opacity: 1 }, { opacity: 0, duration: 0.2, ease: "power2.in", immediateRender: false }, ${e});`)
  }
  if (sc.chapter) {
    const C = `#${id}-chapter`, a = t(sc.chapter.at), e = t(sc.chapter.end)
    js.push(
      `tl.fromTo("${C} .w", { opacity: 0, color: "#a8a194" }, { opacity: 1, color: "#f4efe4", duration: 0.3, stagger: 0.09, ease: "power2.out" }, ${a});`,
      `tl.fromTo("${C} .w", { opacity: 1, filter: "blur(0px)" }, { opacity: 0, filter: "blur(8px)", duration: 0.2, stagger: 0.05, ease: "power2.in", immediateRender: false }, ${e});`,
    )
  }
  if (sc.card) {
    const C = `#${id}-card`, a = t(sc.card.at)
    js.push(
      `tl.fromTo("#${id}-cardbig", { opacity: 0, filter: "blur(8px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.2, ease: "power4.out" }, ${a});`,
      `tl.fromTo("#${id}-cardurl", { opacity: 0, filter: "blur(6px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.18, ease: "power4.out" }, ${a + 0.55});`,
      `tl.fromTo("${C} .card-note .w", { opacity: 0, color: "#8f897c" }, { opacity: 1, color: "#d9d2c3", duration: 0.2, stagger: 0.07, ease: "power2.out" }, ${a + 0.95});`,
    )
  }

  return `<template>
  <style>${STYLE}</style>
  <div id="root" data-composition-id="${id}" data-width="1920" data-height="1080">
    ${els.join("\n    ")}
  </div>
  <script>
    const tl = gsap.timeline({ paused: true });
    const W = 1920, H = 1080;
    // the camera on a photo: [scale, focus x, focus y], the focus brought to the centre, never past the photo's edge
    const pose = ([s, fx, fy]) => {
      const mx = ((s - 1) * W) / 2, my = ((s - 1) * H) / 2;
      return { scale: s, x: Math.max(-mx, Math.min(mx, (0.5 - fx) * W * s)), y: Math.max(-my, Math.min(my, (0.5 - fy) * H * s)) };
    };
    const kb = (sel, from, to, at, dur, ease, turn) => {
      const a = pose(from), b = pose(to);
      if (turn) { a.rotation = turn[0]; b.rotation = turn[1]; }
      tl.fromTo(sel, a, { ...b, duration: dur, ease }, at);
    };
    // a push through a point of the photo into the next shot: where the point sits in the frame at the shot's end
    const through = (cam, whip, end, to, at, dur) => {
      const p = pose(end);
      const ox = W / 2 + p.x + p.scale * (to[0] * W - W / 2), oy = H / 2 + p.y + p.scale * (to[1] * H - H / 2);
      tl.set(whip, { transformOrigin: ox + "px " + oy + "px" }, at);
      tl.fromTo(whip, { scale: 1 }, { scale: 2.6, duration: dur, ease: "power3.in", immediateRender: false }, at);
    };
    ${js.join("\n    ")}
    window.__timelines["${id}"] = tl;
  </script>
</template>
`
}

function index() {
  const hosts = SCENES.map((sc, i) => {
    const s = Math.min(...sc.shots.map((x) => x.start)), e = Math.max(...sc.shots.map((x) => x.end))
    return `<div id="${sc.id}" data-composition-id="${sc.id}" data-composition-src="compositions/${sc.id}.html" data-start="${s}" data-duration="${+(e - s).toFixed(3)}" data-track-index="${i + 1}" data-track-kind="graphics" data-width="1920" data-height="1080" style="z-index:${i + 1}"></div>`
  })
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { margin: 0; width: 1920px; height: 1080px; overflow: hidden; background: #0d0d0b; }
      #root { width: 100%; height: 100%; position: relative; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${LENGTH}" data-width="1920" data-height="1080" data-motion-blur="on">
      ${hosts.join("\n      ")}
    </div>
    <script>
      window.__timelines["main"] = gsap.timeline({ paused: true });
    </script>
  </body>
</html>
`
}

// ------------------------------------------------------------ write
mkdirSync(join(OUT, "compositions"), { recursive: true })
mkdirSync(join(OUT, "assets/photos"), { recursive: true })
const have = readdirSync(PHOTOS)
for (let i = 1; i <= 21; i++) {
  const n = String(i).padStart(2, "0")
  const src = have.find((f) => f.startsWith(`${n}-`) && f.endsWith(".jpg"))
  if (!src) throw new Error(`no photo ${n} in ${PHOTOS}: run node scripts/site/film/packs.mjs`)
  copyFileSync(join(PHOTOS, src), join(OUT, "assets/photos", `${n}.jpg`))
}
if (!existsSync(join(FONTS, "cormorant-garamond-500.woff2"))) throw new Error(`the fonts go in ${FONTS} (the site's Latin subsets)`)
for (const sc of SCENES) writeFileSync(join(OUT, "compositions", `${sc.id}.html`), scene(sc))
writeFileSync(join(OUT, "index.html"), index())
console.log(`${OUT}: ${SCENES.length} scenes, ${LENGTH} s`)
