import type * as React from "react"

import type { RoomPoint } from "@/components/docs/room-points"
import type { RoomCircuit } from "@/components/docs/room-wiring"
import type { Words } from "@/components/internationalization/words"

// Every word of the study room's page, its drawings, its rails and its docs tables (D-058): the English, then its
// Kinyarwanda, a machine draft until a native speaker reviews it. study-room.json keeps its English for the render
// scripts; `json` lays the Kinyarwanda over its rows by id (data.ts).
type L = (href: string, text: string) => React.ReactNode

const en = {
  meta: {
    title: "The study room · Farm",
    description: "A room for eight to meet, train or work on a project together, glazed onto a deck with lake views, at the Digital Farm near Kigali.",
  },
  hero: {
    title: "A room to meet, train and build",
    alt: "A long teal shipping container seen square-on at golden hour, its front glazed with white-framed sliding doors, the middle pair open: inside, a long oak table with eight oak chairs and a few laptops under three rattan pendants, a big screen and a lectern on the left, two ochre armchairs before a full-height bookshelf on the right, fig plants between; a wide honey-coloured timber deck with a broad step on a stone plinth, on a lawn among banana plants and trees.",
  },
  plan: {
    title: "Plan: a 40 ft container 12.2 m long and 2.4 m wide, glazed doors behind timber louvres along its front onto a 2 m deck with a broad step; inside, a big screen on the left end wall with a cabinet under it and a lectern, one long table down the middle with four chairs along each side, then a reading corner with two armchairs, a side table, a lamp and a rug, and a bookshelf wall across the right end.",
    labels: {
      screen: "SCREEN", seats: "8 SEATS", reading: "READING", books: "BOOKS", room: "STUDY ROOM",
      glazing: "GLAZED DOORS BEHIND LOUVRES", deck: "DECK", step: "STEP",
    },
  },
  model: {
    lineAlt: "Line drawing of the study room from the deck with the front wall off: a big screen on the left end wall, a long table in the middle with eight chairs, three pendant lights over it, two wall fans, two armchairs on a rug by a floor lamp, and a full-height bookshelf at the right end, the wide deck and its step in front.",
    realAlt: "The same view rendered: a teal container with an oak plank floor and off-white walls, a long oak table with eight oak chairs on oat seat pads and a few laptops, rattan pendants, a big black screen on the end wall, ochre armchairs on a striped rug, shelves full of books, green plants, and a honey-coloured eucalyptus deck on the lawn.",
  },
  sections: { table: "Table and screen", reading: "Reading corner" },
  rails: {
    table: { title: "Long table", size: (l: number, w: number, h: number) => `${l} × ${w} m, ${h} m high`,
      note: (n: number) => `Down the middle of the room, ${n} seats along each side; a double socket on the back wall behind each pair.` },
    chair: { title: (n: number) => `Chairs × ${n}`, size: (w: number, d: number, seat: number, back: number) => `${w} × ${d} m, seat ${seat} m, back ${back} m`,
      note: "Oak with an oat seat pad, facing each other across the table." },
    screen: { title: "Screen", size: (w: number, h: number, y: number) => `65 inch, ${w} × ${h} m, its foot at ${y} m`,
      note: "Flat on the east end wall on a low-profile bracket; it casts over the Wi-Fi, with P5 and the data outlet D1 behind its cabinet." },
    cabinet: { title: "Screen cabinet", size: (l: number, d: number, h: number) => `${l} × ${d} m, ${h} m high` },
    lectern: { title: "Lectern", size: (w: number, d: number, h: number) => `${w} × ${d} m, ${h} m high`, note: "A standing table for whoever is presenting or teaching." },
    shelves: { title: "Bookshelf wall", size: (w: number, d: number) => `${w} m wide, ${d} m deep, full height`,
      note: (bays: number, rows: number) => `${bays} bays of ${rows} shelves across the west end wall.` },
    armchair: { title: "Armchairs × 2", size: (w: number, d: number, seat: number) => `${w} × ${d} m, seat ${seat} m`, note: "Upholstered, angled toward the glazing." },
    sidetable: { title: "Side table", size: (d: number, h: number) => `Ø ${d} m, ${h} m high` },
    floorlamp: { title: "Floor lamp", size: (h: number) => `${h} m high`, note: "Plugged into the socket P6 in the corner." },
    rug: { title: "Rug", size: (a: number, b: number) => `${a} × ${b} m`, note: "Woven, under the reading corner." },
    pendant: "Ø 380 mm dome on a cord, 1.95 m above the floor",
    wallfan: "Ø 400 mm, on a short arm",
  },
  electric: {
    board: "the room's 12-module board, by the reading corner",
    supply: { title: "Site board", sub: "the farm's, off the drawing", cable: "armoured cable, sized to its run" },
    notes: (designA: number, mainA: number): string[] => [
      `Design ${designA} A on a ${mainA} A main switch · one RCBO 30 mA type A per circuit · the studio's conventions (D-021)`,
      "Ratings are design intent until a RURA class A electrician designs the supply and certifies the room",
    ],
    figureAlt: "Line drawing of the study room from the deck: the unit board on the back wall by the reading corner, the circuits running along the ceiling edge, in blue down to the five pendants, the switches and the two wall fans, orange to a double socket low on the back wall behind each pair of seats, the screen wall and the reading corner, the Wi-Fi's cable in purple from the entry box to the ceiling access point, and magenta to the screen's data outlet.",
    note: (link: L): React.ReactNode => <>
      Every run goes up into the ceiling, along it and straight down to its device, in conduit inside the linings. A double
      socket sits low on the back wall behind each pair of seats, so each of the eight has its own. The Wi-Fi comes from the office&rsquo;s
      switch: the outdoor cable enters at NE and powers the access point AP1 over its cable. Each tag opens its row in
      the {link("/docs/study-room/electric#points", "points table")}.
    </>,
    realAlt: "The same view rendered as finished: the white unit board on the back wall by the reading corner, a double socket behind each pair of seats, the rattan pendants in a row, the two wall fans, and the access point and smoke alarm on the ceiling line.",
  },
  docs: [
    { href: "/docs/study-room", title: "Execution plan", text: "Every step of fitting out the study room, in the studio's order, from the survey to the first workshop." },
    { href: "/docs/study-room/materials", title: "Materials", text: "The table and the screen, the reading corner and each electric device, with its size, source and cost." },
    { href: "/docs/study-room/electric", title: "Electric", text: "The four circuits with the Wi-Fi, the first and second fix, the tests and every point." },
  ],
  pointsDrawing: "study room's electrical drawing",
  wifiAmong: "The Wi-Fi’s points are among them.",
  // study-room.json's words, by row id
  json: {
    circuits: {} as Record<string, Partial<RoomCircuit>>,
    points: {} as Record<string, Partial<RoomPoint>>,
  },
}

const pair = (n: number) => ({ description: `Priza ebyiri ku rukuta rw'inyuma inyuma y'itsinda rya ${n} ry'intebe ebyiri: iy'intebe iri imbere yayo n'iy'iri hakurya y'ameza` })

const rw: typeof en = {
  meta: {
    title: "Icyumba cyo kwigiramo · Ifamu",
    description: "Icyumba abantu umunani bahuriramo, bigiramo cyangwa bakoreramo umushinga hamwe, gifite ibirahure bireba ku rubaho n'ikiyaga, kuri Digital Farm hafi ya Kigali.",
  },
  hero: {
    title: "Icyumba cyo guhura, kwiga no kubaka",
    alt: "Ikontineri ndende y'ibara ry'icyatsi-ubururu irebwa uyiteganye ku zuba rirenga, uruhande rwayo rw'imbere ari inzugi z'ibirahure zinyerera zifite amakadiri y'umweru, izo hagati zifunguye: imbere, ameza maremare ya oak n'intebe umunani za oak na mudasobwa nke munsi y'amatara atatu amanitse y'imigano, ecran nini n'ameza y'uwigisha ibumoso, intebe ebyiri z'amaboko z'umuhondo wijimye imbere y'akabati k'ibitabo kageze ku gisenge iburyo, ibimera by'imitini hagati yabyo; urubaho runini rw'imbaho z'ibara ry'ubuki rufite intambwe ngari ku musingi w'amabuye, ku byatsi hagati y'insina n'ibiti.",
  },
  plan: {
    title: "Igishushanyo: ikontineri ya ft 40, ireshya na m 12.2 z'uburebure na m 2.4 z'ubugari, inzugi z'ibirahure inyuma y'imbaho zikinga ku ruhande rwayo rw'imbere zireba ku rubaho rwa m 2 rufite intambwe ngari; imbere, ecran nini ku rukuta rw'impera y'ibumoso ifite akabati munsi yayo n'ameza y'uwigisha, ameza maremare amwe hagati afite intebe enye kuri buri ruhande, hanyuma inguni yo gusomeramo ifite intebe ebyiri z'amaboko, ameza mato yo ku ruhande, itara n'itapi, n'urukuta rw'ibitabo ku mpera y'iburyo.",
    labels: {
      screen: "ECRAN", seats: "INTEBE 8", reading: "GUSOMA", books: "IBITABO", room: "ICYUMBA CYO KWIGIRAMO",
      glazing: "INZUGI Z'IBIRAHURE INYUMA Y'IMBAHO ZIKINGA", deck: "URUBAHO", step: "INTAMBWE",
    },
  },
  model: {
    lineAlt: "Igishushanyo cy'imirongo cy'icyumba cyo kwigiramo kirebwa uturutse ku rubaho, urukuta rw'imbere rwakuweho: ecran nini ku rukuta rw'impera y'ibumoso, ameza maremare hagati afite intebe umunani, amatara atatu amanitse hejuru yayo, fani ebyiri zo ku rukuta, intebe ebyiri z'amaboko ku itapi hafi y'itara rihagaze, n'akabati k'ibitabo kageze ku gisenge ku mpera y'iburyo, urubaho runini n'intambwe yarwo imbere.",
    realAlt: "Ishusho imwe yakozwe nk'ifoto: ikontineri y'ibara ry'icyatsi-ubururu ifite igorofa ry'imbaho za oak n'inkuta z'umweru wijimye, ameza maremare ya oak n'intebe umunani za oak ziriho udusego tw'ibara ry'ingano na mudasobwa nke, amatara amanitse y'imigano, ecran nini y'umukara ku rukuta rw'impera, intebe z'amaboko z'umuhondo wijimye ku itapi y'imirongo, utubati twuzuye ibitabo, ibimera bibisi, n'urubaho rw'inturusu rw'ibara ry'ubuki ku byatsi.",
  },
  sections: { table: "Ameza na ecran", reading: "Inguni yo gusomeramo" },
  rails: {
    table: { title: "Ameza maremare", size: (l, w, h) => `m ${l} × ${w}, uburebure m ${h}`,
      note: (n) => `Hagati mu cyumba, intebe ${n} kuri buri ruhande; priza ebyiri ku rukuta rw'inyuma inyuma ya buri ntebe ebyiri.` },
    chair: { title: (n) => `Intebe × ${n}`, size: (w, d, seat, back) => `m ${w} × ${d}, aho bicara kuri m ${seat}, umugongo kuri m ${back}`,
      note: "Oak ifite agasego k'ibara ry'ingano, zirebana hakurya y'ameza." },
    screen: { title: "Ecran", size: (w, h, y) => `inch 65, m ${w} × ${h}, hasi hayo kuri m ${y}`,
      note: "Ifashe ku rukuta rw'impera y'iburasirazuba ku cyuma kigufi; yerekana ibiri kuri mudasobwa binyuze kuri Wi-Fi, P5 na priza ya data D1 biri inyuma y'akabati kayo." },
    cabinet: { title: "Akabati ka ecran", size: (l, d, h) => `m ${l} × ${d}, uburebure m ${h}` },
    lectern: { title: "Ameza y'uwigisha", size: (w, d, h) => `m ${w} × ${d}, uburebure m ${h}`, note: "Ameza yo guhagararaho y'uwerekana cyangwa wigisha." },
    shelves: { title: "Urukuta rw'ibitabo", size: (w, d) => `Ubugari m ${w}, ubujyakuzimu m ${d}, rugera ku gisenge`,
      note: (bays, rows) => `Ibice ${bays} bifite utubati ${rows} buri kimwe, ku rukuta rw'impera y'iburengerazuba.` },
    armchair: { title: "Intebe z'amaboko × 2", size: (w, d, seat) => `m ${w} × ${d}, aho bicara kuri m ${seat}`, note: "Zipfutse, zihindukiriye ibirahure." },
    sidetable: { title: "Ameza mato yo ku ruhande", size: (d, h) => `Ø m ${d}, uburebure m ${h}` },
    floorlamp: { title: "Itara rihagaze", size: (h) => `Uburebure m ${h}`, note: "Ricometse kuri priza P6 iri mu nguni." },
    rug: { title: "Itapi", size: (a, b) => `m ${a} × ${b}`, note: "Iboshye, munsi y'inguni yo gusomeramo." },
    pendant: "Igikombe cya Ø mm 380 kimanitse ku mugozi, m 1.95 hejuru y'hasi",
    wallfan: "Ø mm 400, ku kaboko kagufi",
  },
  electric: {
    board: "ikibaho cy'icyumba cya modile 12, hafi y'inguni yo gusomeramo",
    supply: { title: "Ikibaho cy'ifamu", sub: "cy'ifamu, hanze y'igishushanyo", cable: "umugozi ukingiwe, ungana n'uburebure bw'inzira yawo" },
    notes: (designA, mainA) => [
      `Ingufu zateganyijwe A ${designA} kuri disijonkitere nkuru ya A ${mainA} · RCBO imwe ya mA 30 ubwoko A kuri buri muzunguruko · amategeko ya sitidiyo (D-021)`,
      "Ibipimo ni ibyateganyijwe kugeza umutekinisiye w'amashanyarazi wo mu cyiciro A cya RURA ateguye umuriro akanemeza icyumba",
    ],
    figureAlt: "Igishushanyo cy'imirongo cy'icyumba cyo kwigiramo kirebwa uturutse ku rubaho: ikibaho ku rukuta rw'inyuma hafi y'inguni yo gusomeramo, imizunguruko ikurikira inkombe y'igisenge, mu bururu ikamanuka ku matara atanu amanitse, kuri switch no kuri fani ebyiri zo ku rukuta, mu icunga ku priza ebyiri iri hasi ku rukuta rw'inyuma inyuma ya buri ntebe ebyiri, ku rukuta rwa ecran no ku nguni yo gusomeramo, umugozi wa Wi-Fi mu ibara rya move uva ku gasanduku winjiriramo ujya kuri access point yo ku gisenge, na magenta ugana kuri priza ya data ya ecran.",
    note: (link) => <>
      Buri muyoboro uzamuka mu gisenge, ukagikurikira ukamanuka ugororotse ku gikoresho cyawo, muri conduit iri mu nkuta. Priza
      ebyiri iri hasi ku rukuta rw&rsquo;inyuma inyuma ya buri ntebe ebyiri, ku buryo buri wese muri umunani agira iye. Wi-Fi ituruka kuri switch
      y&rsquo;ibiro: umugozi wo hanze winjirira kuri NE ugaha access point AP1 umuriro unyuze mu mugozi wayo. Buri kimenyetso gifungura
      umurongo wacyo mu {link("/docs/study-room/electric#points", "mbonerahamwe y'ahantu")}.
    </>,
    realAlt: "Ishusho imwe yakozwe nk'ifoto, irangiye: ikibaho cy'umweru ku rukuta rw'inyuma hafi y'inguni yo gusomeramo, priza ebyiri inyuma ya buri ntebe ebyiri, amatara amanitse y'imigano ari ku murongo, fani ebyiri zo ku rukuta, na access point n'icyuma kimenyesha umwotsi ku murongo w'igisenge.",
  },
  docs: [
    { href: "/docs/study-room", title: "Gahunda y'imirimo", text: "Buri ntambwe yo gutunganya icyumba cyo kwigiramo, ku murongo wa sitidiyo, kuva ku bipimo kugeza ku mahugurwa ya mbere." },
    { href: "/docs/study-room/materials", title: "Ibikoresho", text: "Ameza na ecran, inguni yo gusomeramo na buri gikoresho cy'amashanyarazi, n'ingano yacyo, aho kigurwa n'igiciro cyacyo." },
    { href: "/docs/study-room/electric", title: "Amashanyarazi", text: "Imizunguruko ine na Wi-Fi, icyiciro cya mbere n'icya kabiri cyo gushyiraho, ibizamini na buri hantu." },
  ],
  pointsDrawing: "gishushanyo cy'amashanyarazi cy'icyumba cyo kwigiramo",
  wifiAmong: "Ahantu ha Wi-Fi na ho harimo.",
  json: {
    circuits: {
      C1: { serves: "Amatara amanitse na fani zo ku rukuta" }, C2: { serves: "Priza z'ameza, intebe zose uko ari umunani" },
      C3: { serves: "Urukuta rwa ecran n'inguni yo gusomeramo" }, C4: { serves: "Uw'inyongera" },
      N1: { serves: "PoE ijya kuri access point" }, N2: { serves: "Data ijya kuri ecran" },
    },
    points: {
      DB: { description: "Ikibaho cy'amashanyarazi, modile 12, ku rukuta rw'inyuma hagati y'ameza n'inguni yo gusomeramo" },
      L1: { description: "Itara rimanitse, hejuru y'ameza, ku ruhande rwa ecran" },
      L2: { description: "Itara rimanitse, hejuru y'ameza" },
      L3: { description: "Itara rimanitse, hejuru y'ameza, ku ruhande rwo gusomeramo" },
      L4: { description: "Itara rimanitse, hejuru y'inguni yo gusomeramo, ibumoso" },
      L5: { description: "Itara rimanitse, hejuru y'inguni yo gusomeramo, iburyo" },
      S1: { description: "Switch hafi y'ibirahure ku ruhande rwa ecran: ameza, L1 kugeza L3" },
      S2: { description: "Switch munsi y'ikibaho: inguni yo gusomeramo, L4 na L5" },
      F1: { description: "Fani yo ku rukuta, hejuru ku rukuta rw'inyuma hejuru y'inguni yo gusomeramo" },
      F2: { description: "Fani yo ku rukuta, hejuru ku rukuta rw'inyuma hejuru y'ameza" },
      P1: pair(1), P2: pair(2), P3: pair(3), P4: pair(4),
      P5: { description: "Priza ebyiri inyuma y'akabati ka ecran, iya ecran n'iya mudasobwa" },
      P6: { description: "Priza + USB-C mu nguni yo gusomeramo, iy'itara rihagaze n'iya telefoni" },
      A1: { description: "Icyuma kimenyesha umwotsi, bateri y'imyaka 10, ku gisenge hagati mu cyumba" },
      NE: { description: "Agasanduku k'injiriro: umugozi wo hanze uva kuri switch y'ibiro winjirira aha" },
      AP1: { description: "Access point ya Wi-Fi ku gisenge, hagati mu cyumba" },
      D1: { description: "Priza ya data inyuma y'akabati ka ecran, iya ecran" },
    },
  },
}

export const words: Words<typeof en> = { en, rw }
