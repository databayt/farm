import type { RailCard } from "@/components/page/sections"
import type { Words } from "@/components/internationalization/words"

// Every word of the dining area's page, its drawing, its rails and its docs table (D-058): the English, then its
// Kinyarwanda, a machine draft until a native speaker reviews it. dining.json shows no words of its own.
type S = string | number
export type BuildValues = { length: S; width: S; h: S; t: S; arches: S; crown: S; grid: S; thatch: S; eave: S; floor: S; seats: S }
export type StructureValues = { length: S; width: S; h: S; t: S; crown: S; arches: S; grid: S; thatch: S; eave: S }
export type FurnitureValues = { tl: S; tw: S; th: S; seats: S; bw: S; bh: S; cl: S; cw: S; ch: S; lamps: S }

const en = {
  meta: {
    title: "The dining area · Farm",
    description: "A dining area for 24 under a thatched arch on a low mud-brick wall, two long tables and a serving counter, at the Digital Farm near Kigali.",
  },
  hero: {
    title: "Dinner for the whole house, under one thatch",
    alt: "A stand-in render of the dining area: a long thatched barrel vault on eucalyptus arches over a low red mud-brick wall, seen from outside the door at the east end, two long tables and benches inside, a string of lamps along the ridge and a serving counter at the far end, on red earth with eucalyptus behind.",
  },
  plan: {
    title: "Plan: a low mud-brick wall 9.2 by 5.8 m with a door in the east end; overhead, six arches and a ridge pole carry the thatch, its eave outside the long walls; inside, two long tables each with a bench either side, 24 seats, and a serving counter against the west wall.",
    labels: { table: "TABLE", counter: "SERVING", door: "DOOR", dining: "DINING", tableDim: "table", insideDim: "inside" },
  },
  model: {
    lineAlt: "Line drawing of the dining area from the front with the front half of its roof off: the low brick wall with its courses, the arches, ridge and purlins bare in front, the mesh and the thatch over the back half, two long tables with benches, the serving counter at the west end and the lamps along the ridge.",
    realAlt: "The same view rendered in daylight on red earth: red mud-brick walls, peeled eucalyptus arches, rusty steel mesh and grass thatch over the back half, timber tables and benches with cloth runners and clay jugs, clay pots on the serving counter.",
  },
  build: {
    title: "Build",
    baseAlt: "The levelled red ground where the dining area stands, seen from the south-east.",
    builds: [
      "The mud-brick wall laid course by course.",
      "The eucalyptus arches set into the wall, the ridge pole and the purlins tied on.",
      "The steel mesh tied over the arches.",
      "The grass thatch tied to the mesh, course by course.",
      "The floor compacted, then the tables, benches, counter and lamps.",
    ],
    stages: (v: BuildValues) => [
      { title: "The ground", text: "A level patch beside the rooms, cleared of roots and topsoil, so the wall stands on firm ground." },
      { title: "Step 1 · Wall · stands today", text: `Sun-dried mud brick in earth mortar, ${v.length} × ${v.width} m outside, ${v.t} m thick and ${v.h} m high, a door gap in the east end. Standing in the photos of 2026-10-31.` },
      { title: "Step 2 · Frame · stands today", text: `${v.arches} eucalyptus arches across the width, rising to ${v.crown} m at the crown, a ridge pole along the top and a purlin each side tying them. Standing in the photos.` },
      { title: "Step 3 · Mesh · going on today", text: `Welded steel mesh, about ${v.grid} mm square, tied to every arch and pole with wire. Being tied on in the photos.` },
      { title: "Step 4 · Thatch", text: `Grass thatch tied to the mesh in courses from the eaves up, ${v.thatch} mm thick, its eave ${v.eave} mm past the wall so the rain drips clear of the earth. The two ends stay open above the wall, for the air and the view.` },
      { title: "Step 5 · Furnished", text: `The floor compacted laterite, ${v.floor} mm, falling to the door; two long tables and four benches for ${v.seats}, the serving counter at the west end and the lamps along the ridge.` },
    ],
  },
  sections: { structure: "Structure", furniture: "Furniture" },
  rails: {
    structure: (v: StructureValues): RailCard[] => [
      { id: "wall", title: "Mud-brick wall", size: `${v.length} × ${v.width} m outside, ${v.t} m thick, ${v.h} m high`,
        note: "Sun-dried mud brick (rukarakara) in earth mortar, standing today. Sizes are read off the photos against the people in them, to be measured (AS-31)." },
      { id: "arch", title: `Eucalyptus arches × ${v.arches}`, size: `Across the ${v.width} m width, ${v.crown} m high at the crown`,
        note: "Peeled eucalyptus poles bent into arches and set into the top of the long walls, a ridge pole and two purlins along them. Standing today." },
      { id: "mesh", title: "Steel mesh", size: `About ${v.grid} mm square, over the whole vault`,
        note: "Welded steel mesh tied to the arches and poles with wire; it carries the thatch. Being tied on in the photos." },
      { id: "thatch", title: "Grass thatch", size: `${v.thatch} mm thick, its eave ${v.eave} mm past the long walls`,
        note: "Grass tied to the mesh in courses, the ends open above the wall. Which grass, and who thatches, is not decided." },
    ],
    furniture: (v: FurnitureValues): RailCard[] => [
      { id: "table", title: "Long tables × 2", size: `${v.tl} × ${v.tw} cm, ${v.th} cm high, ${v.seats} seats each`,
        note: "Plank tops on four square legs, a cloth runner down the middle. Sizes are the design's, not sourced." },
      { id: "bench", title: "Benches × 4", size: `${v.tl} × ${v.bw} cm, ${v.bh} cm high`,
        note: "A plain timber bench each side of each table, six to a bench." },
      { id: "counter", title: "Serving counter", size: `${v.cl} × ${v.cw} cm, ${v.ch} cm high`,
        note: "A timber case with an oiled top and a shelf below, against the west wall: the galley's dishes set out as a buffet." },
      { id: "lights", title: `String of lamps × ${v.lamps}`, size: "Along the ridge, each on a short drop",
        note: "Warm lamps hung from the ridge pole. Where their power comes from (the grid, or a small solar kit) is not designed yet." },
    ],
  },
  docs: [
    { href: "/docs/dining", title: "Execution plan", text: "Every step from the wall that stands today to a dinner for 24 under the thatch." },
    { href: "/docs/dining/materials", title: "Materials", text: "The structure and the furniture, part by part, with its size, where to buy it and its cost." },
  ],
}

const rw: typeof en = {
  meta: {
    title: "Aho kurira · Ifamu",
    description: "Aho kurira h'abantu 24 munsi y'igisenge cy'ibyatsi kimeze nk'umuheto ku rukuta rugufi rw'amatafari ya rukarakara, ameza abiri maremare n'aho bategurira amafunguro, kuri Digital Farm hafi ya Kigali.",
  },
  hero: {
    title: "Ifunguro ry'abashyitsi bose, munsi y'igisenge kimwe",
    alt: "Ishusho y'agateganyo y'aho kurira: igisenge kirekire cy'ibyatsi kimeze nk'umuheto ku mitiba y'inturusu hejuru y'urukuta rugufi rw'amatafari ya rukarakara atukura, kirebwa hanze y'urugi ku ruhande rw'iburasirazuba, imbere ameza abiri maremare n'intebe ndende, amatara ku murongo munsi y'igisenge n'aho bategurira amafunguro ku mpera, ku butaka butukura hari inturusu inyuma.",
  },
  plan: {
    title: "Igishushanyo: urukuta rugufi rw'amatafari ya rukarakara rwa m 9.2 kuri 5.8 rufite urugi ku ruhande rw'iburasirazuba; hejuru, imiheto itandatu n'igiti cyo hagati bifata ibyatsi, ibyatsi birenga inkuta ndende; imbere, ameza abiri maremare buri yose afite intebe ndende ku mpande zombi, imyanya 24, n'aho bategurira amafunguro ku rukuta rw'iburengerazuba.",
    labels: { table: "AMEZA", counter: "GUTEGURA", door: "URUGI", dining: "AHO KURIRA", tableDim: "ameza", insideDim: "imbere" },
  },
  model: {
    lineAlt: "Igishushanyo cy'imirongo cy'aho kurira kirebwa imbere, igice cy'imbere cy'igisenge cyakuweho: urukuta rugufi n'imirongo y'amatafari yarwo, imiheto, igiti cyo hagati n'ibiti bifatanya byambaye ubusa imbere, akayunguruzo k'ibyuma n'ibyatsi ku gice cy'inyuma, ameza abiri maremare n'intebe ndende, aho bategurira amafunguro ku mpera y'iburengerazuba n'amatara munsi y'igisenge.",
    realAlt: "Ishusho imwe yakozwe nk'ifoto ku manywa ku butaka butukura: inkuta z'amatafari ya rukarakara atukura, imiheto y'inturusu yakuweho igishishwa, akayunguruzo k'ibyuma karimo ingese n'ibyatsi ku gice cy'inyuma, ameza n'intebe ndende by'ibiti biriho imyenda n'ibibindi by'ibumba, inkono z'ibumba aho bategurira amafunguro.",
  },
  build: {
    title: "Kubaka",
    baseAlt: "Ubutaka butukura bwaringaniye aho aho kurira hubakwa, burebwa uturutse mu majyepfo y'iburasirazuba.",
    builds: [
      "Urukuta rw'amatafari ya rukarakara rwubakwa umurongo ku wundi.",
      "Imiheto y'inturusu ishingwa mu rukuta, igiti cyo hagati n'ibiti bifatanya biraziritswe.",
      "Akayunguruzo k'ibyuma kaziritswe hejuru y'imiheto.",
      "Ibyatsi biziritswe ku kayunguruzo, umurongo ku wundi.",
      "Hasi harasindagirwa, hanyuma ameza, intebe ndende, aho gutegurira n'amatara.",
    ],
    stages: (v) => [
      { title: "Ubutaka", text: "Agace kangana iruhande rw'ibyumba, gakuweho imizi n'ubutaka bwo hejuru, kugira ngo urukuta ruhagarare ku butaka bukomeye." },
      { title: "Intambwe ya 1 · Urukuta · ruhari uyu munsi", text: `Amatafari ya rukarakara yumishijwe n'izuba mu byondo, m ${v.length} × ${v.width} inyuma, ubunini bwa m ${v.t} n'uburebure bwa m ${v.h}, umwanya w'urugi ku ruhande rw'iburasirazuba. Ruri mu mafoto yo ku wa 2026-10-31.` },
      { title: "Intambwe ya 2 · Imiheto · iriho uyu munsi", text: `Imiheto ${v.arches} y'inturusu ku bugari bwose, igera kuri m ${v.crown} hejuru, igiti cyo hagati hejuru n'igiti gifatanya kuri buri ruhande. Biri mu mafoto.` },
      { title: "Intambwe ya 3 · Akayunguruzo · kariho kaziritswa uyu munsi", text: `Akayunguruzo k'ibyuma gasudiwe, kangana na mm ${v.grid} kuri buri kazu, kaziritswe kuri buri muheto n'igiti n'urutsinga. Kari kuziritswa mu mafoto.` },
      { title: "Intambwe ya 4 · Ibyatsi", text: `Ibyatsi biziritswe ku kayunguruzo umurongo ku wundi uhereye hasi ujya hejuru, ubunini bwa mm ${v.thatch}, birenga urukuta mm ${v.eave} kugira ngo imvura igwe kure y'urukuta rw'ibyondo. Impera zombi zisigara zifunguye hejuru y'urukuta, ku mwuka no kureba hanze.` },
      { title: "Intambwe ya 5 · Hatunganyijwe", text: `Hasi ni laterite isindagiye, mm ${v.floor}, imanuka igana ku rugi; ameza abiri maremare n'intebe ndende enye z'abantu ${v.seats}, aho gutegurira ku mpera y'iburengerazuba n'amatara munsi y'igisenge.` },
    ],
  },
  sections: { structure: "Inyubako", furniture: "Ibikoresho byo mu nzu" },
  rails: {
    structure: (v) => [
      { id: "wall", title: "Urukuta rw'amatafari ya rukarakara", size: `m ${v.length} × ${v.width} inyuma, ubunini m ${v.t}, uburebure m ${v.h}`,
        note: "Amatafari ya rukarakara yumishijwe n'izuba mu byondo, ruhari uyu munsi. Ingano zasomwe ku mafoto zigereranywa n'abantu bariho, zigomba gupimwa (AS-31)." },
      { id: "arch", title: `Imiheto y'inturusu × ${v.arches}`, size: `Ku bugari bwa m ${v.width}, m ${v.crown} hejuru`,
        note: "Ibiti by'inturusu byakuweho igishishwa bihetamye nk'umuheto bishinzwe hejuru y'inkuta ndende, igiti cyo hagati n'ibiti bibiri bifatanya. Biriho uyu munsi." },
      { id: "mesh", title: "Akayunguruzo k'ibyuma", size: `Hafi mm ${v.grid} kuri buri kazu, ku gisenge cyose`,
        note: "Akayunguruzo k'ibyuma gasudiwe kaziritswe ku miheto no ku biti n'urutsinga; ni ko gafata ibyatsi. Kari kuziritswa mu mafoto." },
      { id: "thatch", title: "Ibyatsi byo gusakara", size: `Ubunini mm ${v.thatch}, birenga inkuta ndende mm ${v.eave}`,
        note: "Ibyatsi biziritswe ku kayunguruzo umurongo ku wundi, impera zifunguye hejuru y'urukuta. Ubwoko bw'ibyatsi n'uzasakara ntibiremezwa." },
    ],
    furniture: (v) => [
      { id: "table", title: "Ameza maremare × 2", size: `cm ${v.tl} × ${v.tw}, uburebure cm ${v.th}, imyanya ${v.seats} kuri buri meza`,
        note: "Imbaho hejuru ku maguru ane, umwenda hagati. Ingano ni iz'igishushanyo, ntiziraboneka ku isoko." },
      { id: "bench", title: "Intebe ndende × 4", size: `cm ${v.tl} × ${v.bw}, uburebure cm ${v.bh}`,
        note: "Intebe ndende y'igiti yoroheje kuri buri ruhande rw'ameza, abantu batandatu kuri imwe." },
      { id: "counter", title: "Aho bategurira amafunguro", size: `cm ${v.cl} × ${v.cw}, uburebure cm ${v.ch}`,
        note: "Akabati k'igiti gafite hejuru hasizwe amavuta n'urubaho munsi, ku rukuta rw'iburengerazuba: amafunguro y'igikoni ashyirwaho abantu bakiyarurira." },
      { id: "lights", title: `Amatara ku murongo × ${v.lamps}`, size: "Munsi y'igiti cyo hagati, buri rimwe rimanitse gato",
        note: "Amatara y'urumuri rushyushye amanitse ku giti cyo hagati. Aho amashanyarazi yayo azaturuka (REG cyangwa agace k'imirasire y'izuba) ntibirategurwa." },
    ],
  },
  docs: [
    { href: "/docs/dining", title: "Gahunda y'imirimo", text: "Buri ntambwe kuva ku rukuta ruhari uyu munsi kugeza ku ifunguro ry'abantu 24 munsi y'ibyatsi." },
    { href: "/docs/dining/materials", title: "Ibikoresho", text: "Inyubako n'ibikoresho byo mu nzu, kimwe kimwe, n'ingano yacyo, aho kukigura n'igiciro cyacyo." },
  ],
}

export const words: Words<typeof en> = { en, rw }
