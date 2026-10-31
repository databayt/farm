import type * as React from "react"

import type { RailCard } from "@/components/page/sections"
import type { Words } from "@/components/internationalization/words"

// Every word of the camp's page, its drawings, its rail and its docs table (D-058): the English, then its
// Kinyarwanda, a machine draft until a native speaker reviews it. camp.json shows no words of its own; the lawn's
// drawing labels the compound's buildings, whose English stays in compound.json and whose Kinyarwanda is `json.units`.
type S = string | number
export type KitValues = {
  across: S; top: S; shoulder: S; fw: S; fl: S; fh: S; pw: S; ph: S; cw: S; cd: S; seat: S; back: S
  count: S; kw: S; kd: S; kh: S; rw: S; rd: S; tw: S; td: S; bw: S; bd: S; lh: S
}

const en = {
  meta: {
    title: "The camp · Farm",
    description: "A hexagonal pop-up tent for two pitched on the camping lawn, furnished as a floor lounge by the fire pit, at the Digital Farm near Kigali.",
  },
  hero: {
    title: "A tent with lake views and fire-pit nights",
    alt: "A hexagonal pop-up tent in off-white canvas with beige trim at golden hour, its door open on a low cushioned chair, floor cushions, a striped rug, a lantern and a tea tray, on a green lawn with more tents, trees and the lake behind.",
  },
  plan: {
    title: "Plan: a hexagonal tent 2.8 m across, its door rolled up; inside, a floor chair and a folded throw on the left, a futon with a cushion and two stacked cushions on the right, a striped rug in the middle with a tea board, and a lantern at the back.",
    labels: { floorChair: "FLOOR CHAIR", futon: "FUTON", rug: "RUG", door: "DOOR", tent: "TENT", doorDim: "door", futonDim: "futon" },
  },
  model: {
    lineAlt: "Line drawing of the camp from the front with the front walls off: the floor chair, the futon with its cushion, the stacked cushions, the throw, the tea board on the rug and the lantern at the back.",
    realAlt: "The same view rendered in golden-hour light on the lawn: off-white canvas with beige trim and mesh windows, a tan floor chair, a white futon with a patterned cushion, a striped rug with a clay teapot and cups on a tea board, and a lit lantern.",
  },
  build: {
    title: "Pitch",
    baseAlt: "A patch of mown lawn from straight above.",
    builds: [
      "A groundsheet laid where the tent will stand.",
      "The tent popped up over it and pegged at each corner, its door rolled up.",
      "The rug, then the futon, the floor chair, the cushions and the throw.",
      "The tea board on the rug and the lantern at the back.",
    ],
    stages: {
      lawn: { title: "The lawn", text: "A level patch of the camping lawn, mown short, with nothing under it: the tent stands straight on the grass, with no deck or platform." },
      sheet: { title: "Step 1 · Groundsheet", text: (across: S) => `A groundsheet a little smaller than the tent's floor, ${across} m across the corners, so rain runs off rather than under.` },
      tent: { title: "Step 2 · Tent", text: (shoulder: S, top: S) => `The pop-up opens over it, its six poles pegged outside the corners, the walls up to ${shoulder} m and the top at ${top} m. The door rolls up to a strap.` },
      furnished: { title: "Step 3 · Furnished", text: "The rug in the middle, the futon along the right wall, the floor chair at the back left, the cushions and the throw inside the door." },
      ready: { title: "Step 4 · Ready", text: "The tea board on the rug and the lantern at the back, for a guest arriving at dusk." },
    },
  },
  kit: "Kit",
  lawn: {
    title: "The lawn",
    text: (l: { tents: S; pitNear: S; pitFar: S; bathNear: S; bathFar: S }): React.ReactNode => <>
      The {l.tents} tents stand on a camping lawn between the guest rooms and the fire pit, {l.pitNear} to {l.pitFar} m
      from its edge. Campers use the public bathroom&rsquo;s two toilet rooms, urinal and basins, {l.bathNear} to{" "}
      {l.bathFar} m from the tents to its door in a straight line. The design brings no power and no water to the pitches:
      light is the lantern, and there are no showers yet (whether the public bathroom takes one is an open question). The
      guest kitchen and BBQ (D-028) are on the master plan&rsquo;s lawn, not yet placed on the compound plan. Distances are
      from the provisional plan, not surveyed.
    </>,
    drawing: (near: S, far: S) => `Plan of the camping lawn: six hexagonal tents in three rows of two between the guest rooms and the stone fire pit with its eight stools, the cluster ending at the pit's west edge; the public bathroom in the far row of containers, its door ${near} to ${far} m from the tents in a straight line.`,
    labels: {
      bathroom: "PUBLIC BATHROOM", door: "DOOR", firePit: "FIRE PIT", campingLawn: "CAMPING LAWN",
      toToilets: (near: S, far: S) => `${near}–${far} m to the toilets, in a straight line`,
      fromTents: (near: S, far: S) => `${near}–${far} m from the tents`,
    },
  },
  rails: {
    kit: (v: KitValues): RailCard[] => [
      { id: "tent", title: "Pop-up tent", size: `Hexagonal, ${v.across} m across the corners, ${v.top} m high at the top, walls ${v.shoulder} m at the shoulder`,
        note: "Off-white canvas with beige trim, mesh windows and poles outside each corner; the door is the whole front side and rolls up to a strap. The tents on the lawn today look about 2.5 m across." },
      { id: "futon", title: "Futon and cushion", size: `${v.fw} × ${v.fl} cm, ${v.fh} cm thick; cushion ${v.pw} × ${v.ph} cm`,
        note: "A white quilted floor mattress along the right wall, a cream cushion with a brown geometric band at its back. Sizes read off the render." },
      { id: "chair", title: "Floor chair", size: `${v.cw} × ${v.cd} cm, seat ${v.seat} cm, back ${v.back} cm`,
        note: "Legless, in tan linen, its back to the back-left wall, facing the door. Sizes read off the render." },
      { id: "cushions", title: `Floor cushions × ${v.count}`, size: `${v.kw} × ${v.kd} cm, ${v.kh} cm thick each`,
        note: "Square and quilted, stacked inside the door on the right. Sizes read off the render." },
      { id: "rug", title: "Rug", size: `${v.rw} × ${v.rd} cm`, note: "A striped flat-weave in rust, orange, teal and cream, in the middle of the floor. Size read off the render." },
      { id: "throw", title: "Throw", size: `Folded ${v.tw} × ${v.td} cm`, note: "A wool throw with a fringe, folded on the floor inside the door. Size read off the render." },
      { id: "tray", title: "Tea board", size: `${v.bw} × ${v.bd} cm, with a teapot and two cups`, note: "A timber board on the rug, with a round clay teapot and two clay cups. Size read off the render." },
      { id: "lantern", title: "Lantern", size: `${v.lh} cm high`, note: "A brass hurricane-style lantern on the floor at the back. Whether it burns or runs on a battery is not decided." },
    ],
  },
  docs: [
    { href: "/docs/camp", title: "Execution plan", text: "Every step of pitching and furnishing a tent on the camping lawn, for a guest arriving at dusk." },
    { href: "/docs/camp/materials", title: "Materials", text: "The tent and its kit, piece by piece, with its size, where to buy it and its cost." },
  ],
  json: {
    units: {} as Record<string, string>, // compound.json units' labels, by id; English keeps the JSON's own
  },
}

const rw: typeof en = {
  meta: {
    title: "Aho bakambika · Ifamu",
    description: "Ihema rya mpandeshatu-ebyiri (hexagone) ry'abantu babiri ryubakwa vuba, rishinze ku byatsi byo gukambika, ritunganyijwe nk'icyumba cyo kwicaramo hasi hafi y'aho bacana umuriro, kuri Digital Farm hafi ya Kigali.",
  },
  hero: {
    title: "Ihema rireba ikiyaga n'amajoro ku muriro",
    alt: "Ihema rya mpandeshatu-ebyiri ryubakwa vuba, ry'umwenda w'umweru ujya gusa n'ikigina ufite imitako y'ikigina, ku zuba rirenga, urugi rwaryo rufunguye rureba intebe ngufi ifite umusego, imisego yo hasi, itapi y'imirongo, itara n'isahani y'icyayi, ku byatsi bibisi hari andi mahema, ibiti n'ikiyaga inyuma.",
  },
  plan: {
    title: "Igishushanyo: ihema rya mpandeshatu-ebyiri rya m 2.8 z'umurambararo, urugi rwaryo ruzingiye hejuru; imbere, intebe yo hasi n'igitambaro cyo kwiyorosa gizinze ibumoso, matela ifite umusego n'imisego ibiri igeretse iburyo, itapi y'imirongo hagati iriho urubaho rw'icyayi, n'itara inyuma.",
    labels: { floorChair: "INTEBE YO HASI", futon: "MATELA", rug: "ITAPI", door: "URUGI", tent: "IHEMA", doorDim: "umuryango", futonDim: "matela" },
  },
  model: {
    lineAlt: "Igishushanyo cy'imirongo cy'aho bakambika kirebwa imbere, inkuta z'imbere zakuweho: intebe yo hasi, matela n'umusego wayo, imisego igeretse, igitambaro cyo kwiyorosa, urubaho rw'icyayi ku itapi n'itara inyuma.",
    realAlt: "Ishusho imwe yakozwe nk'ifoto mu rumuri rw'izuba rirenga ku byatsi: umwenda w'umweru ujya gusa n'ikigina ufite imitako y'ikigina n'amadirishya y'akayunguruzo, intebe yo hasi y'ikigina, matela y'umweru ifite umusego ufite amashusho, itapi y'imirongo iriho isafuriya y'icyayi y'ibumba n'ibikombe ku rubaho rw'icyayi, n'itara ryaka.",
  },
  build: {
    title: "Aho rishingwa",
    baseAlt: "Agace k'ibyatsi byakaswe karebwa uturutse hejuru neza.",
    builds: [
      "Isashe yo hasi irambikwa aho ihema rizashingwa.",
      "Ihema ryubakwa hejuru yayo rigafatishwa imambo kuri buri nguni, urugi rwaryo ruzingiye hejuru.",
      "Itapi, hanyuma matela, intebe yo hasi, imisego n'igitambaro cyo kwiyorosa.",
      "Urubaho rw'icyayi ku itapi n'itara inyuma.",
    ],
    stages: {
      lawn: { title: "Ibyatsi", text: "Agace kangana k'ibyatsi byo gukambika, byakaswe bigufi, nta kintu munsi yabyo: ihema rihagarara ku byatsi ubwabyo, nta rubaho cyangwa urubuga." },
      sheet: { title: "Intambwe ya 1 · Isashe yo hasi", text: (across) => `Isashe yo hasi nto gato ugereranyije n'hasi h'ihema, m ${across} hagati y'inguni, kugira ngo imvura itembe hejuru yayo aho kunyura munsi.` },
      tent: { title: "Intambwe ya 2 · Ihema", text: (shoulder, top) => `Ihema ryubakwa vuba rifunguka hejuru yayo, inkingi zaryo esheshatu zigafatishwa imambo hanze y'inguni, inkuta zikagera kuri m ${shoulder} naho hejuru hakagera kuri m ${top}. Urugi ruzingirwa hejuru rugafatishwa umukandara.` },
      furnished: { title: "Intambwe ya 3 · Ritunganyijwe", text: "Itapi hagati, matela ku rukuta rw'iburyo, intebe yo hasi inyuma ibumoso, imisego n'igitambaro cyo kwiyorosa imbere y'urugi." },
      ready: { title: "Intambwe ya 4 · Riteguye", text: "Urubaho rw'icyayi ku itapi n'itara inyuma, ku mushyitsi uhagera bwije." },
    },
  },
  kit: "Ibikoresho",
  lawn: {
    title: "Ibyatsi byo gukambika",
    text: (l) => <>
      Amahema {l.tents} ari ku byatsi byo gukambika hagati y&rsquo;ibyumba by&rsquo;abashyitsi n&rsquo;aho bacana umuriro, kuri m {l.pitNear} kugeza
      kuri {l.pitFar} uvuye ku nkombe yaho. Abakambitse bakoresha ubwiherero bubiri, aho kunyarira n&rsquo;aho gukarabira by&rsquo;ubwiherero
      rusange, kuri m {l.bathNear} kugeza kuri {l.bathFar} uvuye ku mahema ujya ku rugi rwabwo mu murongo ugororotse. Igishushanyo
      ntikigeza amashanyarazi cyangwa amazi aho amahema ashingwa: urumuri ni itara, kandi nta douche irahaba (niba ubwiherero
      rusange buzashyirwamo imwe ni ikibazo kitarasubizwa). Igikoni cy&rsquo;abashyitsi n&rsquo;aho kotsa inyama (D-028) biri ku
      byatsi by&rsquo;igishushanyo rusange, ntibirashyirwa ku gishushanyo cy&rsquo;inzu. Intera zavuye ku gishushanyo cy&rsquo;agateganyo,
      ntizapimwe.
    </>,
    drawing: (near, far) => `Igishushanyo cy'ibyatsi byo gukambika: amahema atandatu ya mpandeshatu-ebyiri ku mirongo itatu y'abiri abiri hagati y'ibyumba by'abashyitsi n'aho bacana umuriro h'amabuye hafite intebe umunani, itsinda rirangirira ku nkombe y'iburengerazuba yaho; ubwiherero rusange mu murongo wa kure w'ikontineri, urugi rwabwo kuri m ${near} kugeza kuri ${far} uvuye ku mahema mu murongo ugororotse.`,
    labels: {
      bathroom: "UBWIHERERO RUSANGE", door: "URUGI", firePit: "AHO BACANA UMURIRO", campingLawn: "IBYATSI BYO GUKAMBIKA",
      toToilets: (near, far) => `m ${near}–${far} ugana ku bwiherero, mu murongo ugororotse`,
      fromTents: (near, far) => `m ${near}–${far} uvuye ku mahema`,
    },
  },
  rails: {
    kit: (v) => [
      { id: "tent", title: "Ihema ryubakwa vuba", size: `Mpandeshatu-ebyiri, m ${v.across} hagati y'inguni, uburebure bwa m ${v.top} hejuru, inkuta za m ${v.shoulder}`,
        note: "Umwenda w'umweru ujya gusa n'ikigina ufite imitako y'ikigina, amadirishya y'akayunguruzo n'inkingi hanze ya buri nguni; urugi ni uruhande rwose rw'imbere kandi ruzingirwa hejuru rugafatishwa umukandara. Amahema ari ku byatsi uyu munsi asa n'afite hafi m 2.5." },
      { id: "futon", title: "Matela n'umusego", size: `cm ${v.fw} × ${v.fl}, ubunini cm ${v.fh}; umusego cm ${v.pw} × ${v.ph}`,
        note: "Matela y'umweru idodeshejwe iri hasi ku rukuta rw'iburyo, umusego w'umweru ujya gusa n'ikigina ufite umurongo w'amashusho y'ikigina kijimye inyuma yayo. Ingano zasomwe ku ishusho." },
      { id: "chair", title: "Intebe yo hasi", size: `cm ${v.cw} × ${v.cd}, aho kwicara cm ${v.seat}, aho kwegamira cm ${v.back}`,
        note: "Idafite amaguru, y'umwenda wa lin w'ikigina, yegamiye urukuta rw'inyuma ibumoso, ireba urugi. Ingano zasomwe ku ishusho." },
      { id: "cushions", title: `Imisego yo hasi × ${v.count}`, size: `cm ${v.kw} × ${v.kd}, ubunini cm ${v.kh} buri umwe`,
        note: "Ifite impande enye zingana kandi idodeshejwe, igeretse imbere y'urugi iburyo. Ingano zasomwe ku ishusho." },
      { id: "rug", title: "Itapi", size: `cm ${v.rw} × ${v.rd}`, note: "Itapi iboshye ifite imirongo y'ibara ry'ingese, oranje, ubururu bujya gusa n'icyatsi n'umweru, hagati y'hasi. Ingano yasomwe ku ishusho." },
      { id: "throw", title: "Igitambaro cyo kwiyorosa", size: `Kizinze cm ${v.tw} × ${v.td}`, note: "Igitambaro cy'ubwoya gifite udushumi ku mpera, kizinze hasi imbere y'urugi. Ingano yasomwe ku ishusho." },
      { id: "tray", title: "Urubaho rw'icyayi", size: `cm ${v.bw} × ${v.bd}, ruriho isafuriya y'icyayi n'ibikombe bibiri`, note: "Urubaho rw'igiti ku itapi, ruriho isafuriya y'icyayi y'ibumba iburungushuye n'ibikombe bibiri by'ibumba. Ingano yasomwe ku ishusho." },
      { id: "lantern", title: "Itara", size: `Uburebure cm ${v.lh}`, note: "Itara ry'umuringa rimeze nk'irya peteroli riri hasi inyuma. Niba rizaka peteroli cyangwa bateri ntibiremezwa." },
    ],
  },
  docs: [
    { href: "/docs/camp", title: "Gahunda y'imirimo", text: "Buri ntambwe yo gushinga no gutunganya ihema ku byatsi byo gukambika, ku mushyitsi uhagera bwije." },
    { href: "/docs/camp/materials", title: "Ibikoresho", text: "Ihema n'ibikoresho byaryo, kimwe kimwe, n'ingano yacyo, aho kukigura n'igiciro cyacyo." },
  ],
  json: {
    units: {
      bar: "AKABARI", rooms: "IBYUMBA BY'ABASHYITSI", office: "IBIRO", "studio-one": "SITIDIYO", "studio-two": "SITIDIYO",
      study: "ICYUMBA CYO KWIGIRAMO", galley: "IGIKONI", bath: "UBWIHERERO RUSANGE",
    },
  },
}

export const words: Words<typeof en> = { en, rw }
