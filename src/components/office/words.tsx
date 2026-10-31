import type * as React from "react"

import type { RoomPoint } from "@/components/docs/room-points"
import type { RoomCircuit } from "@/components/docs/room-wiring"
import type { Words } from "@/components/internationalization/words"

// Every word of the office's page, its drawings, its rails and its docs tables (D-058): the English, then its
// Kinyarwanda, a machine draft until a native speaker reviews it. office.json keeps its English for the render
// scripts; `json` lays the Kinyarwanda over its rows by id (data.ts).
type L = (href: string, text: string) => React.ReactNode

const en = {
  meta: {
    title: "The office · Farm",
    description: "The farm's office, a lounge and a programmer's workroom: a saffron container on a raised deck by the courtyard, at the Digital Farm near Kigali.",
  },
  hero: {
    title: "An office on the deck, by the courtyard",
    alt: "A navy-blue shipping container on a low red steel frame with a timber deck in front, its front a wall of white-framed glass doors: inside, a grey L sofa with an oak coffee table and a desk with a monitor and a black gaming chair, lit warm; on the deck, a marble-topped bistro table with a glass of tea and two rush-seated wooden chairs, on a mown lawn before a eucalyptus wood at golden hour.",
  },
  plan: {
    title: "Plan: a 20 ft container 6,058 by 2,438 mm with a 1,500 mm deck in front and a stair off its corner; inside, one L sofa across the whole cargo-door end and along the back wall, round a low table, and one big programmer's and gamer's desk across the whole far end wall, with a single Studio Display, a Mac Studio and a gaming chair; on the deck, a round ahwa table with two chairs, as in an Egyptian cafe.",
    labels: {
      desk: "DESK", mac: "MAC STUDIO", display: "STUDIO DISPLAY", sofa: "SOFA", table: "TABLE", cafe: "CAFE", glazing: "SLIDING GLAZING",
      deck: "DECK", stair: "STAIR", office: "OFFICE", cargo: "CARGO", doors: "DOORS",
    },
  },
  model: {
    lineAlt: "Line drawing of the office from the front with the front wall off: the container raised on its frame, the deck with railings and the stair, an L sofa across the cargo-door end and along the back wall with a low table, and a big desk across the far end wall with a Studio Display, a Mac Studio and a gaming chair, and on the deck, an Egyptian ahwa table with two chairs.",
    realAlt: "The same view rendered: saffron corrugated steel, off-white walls and an oak floor, a stone-grey L sofa and a Medium Oak table, a Medium Oak desk with a silver Studio Display and Mac Studio, a black gaming chair, a marble-topped ahwa table with two rush-seated wooden chairs on the deck, on red steel posts with a eucalyptus deck and red railings over the lawn.",
  },
  sections: { furniture: "Furniture and equipment", network: "Network" },
  rails: {
    sofa: { title: "L sofa", size: (a: number, b: number, d: number) => `${a} × ${b} m, ${d} m deep`,
      note: "One piece: its short leg across the whole cargo-door end, its long leg along the back wall, a corner seat between." },
    sofatable: { title: "Low table", size: (a: number, b: number) => `${a} × ${b} m, 0.41 m high`, note: "Medium Oak, in front of the sofa." },
    bigdesk: { title: "Big desk", size: (a: number, b: number) => `${a} × ${b} m, 0.75 m high`,
      note: "Across the whole far end wall, for a programmer and gamer; panel ends and a modesty panel." },
    display: { title: "Studio Display", size: (w: number, foot: number) => `${w} m wide, its stand foot ${foot} m deep`, note: "One, centred on the desk. Apple's size from memory [A], not yet sourced." },
    macstudio: { title: "Mac Studio", size: (w: number) => `${w} × ${w} m, 0.095 m high`, note: "On the desk beside the display. Apple's size from memory [A], not yet sourced." },
    keyboard: { title: "Keyboard and mouse", size: "About 0.44 × 0.13 m", note: "In front of the display." },
    gamingchair: { title: "Gaming chair", size: "Five-star base on castors, a tall winged back with a headrest", note: "Facing the desk and the wall." },
    cafetable: { title: "Ahwa table", size: (d: number, h: number) => `Ø ${d} m, ${h} m high`, note: "Marble top on a cast-iron pedestal, as in a traditional Egyptian cafe; on the deck." },
    cafechair: { title: "Ahwa chairs × 2", size: (w: number, d: number, seat: number) => `${w} × ${d} m, seat ${seat} m`,
      note: "Dark wood with woven rush seats, either side of the table, looking out over the garden." },
  },
  electric: {
    board: "the office's 12-module board, on the back wall",
    supply: { title: "Site board", sub: "the farm's, off the drawing", cable: "armoured cable, sized to its run" },
    notes: (designA: number, mainA: number): string[] => [
      `Design ${designA} A on a ${mainA} A main switch · one RCBO 30 mA type A per circuit · the studio's conventions (D-021)`,
      "C3 feeds only the network cabinet's UPS · ratings are design intent until a RURA class A electrician designs the supply and certifies",
    ],
    figureAlt: "Line drawing of the office from the front: the unit board on the back wall over the sofa, its circuits rising along the ceiling edge and down to each point, in blue for the three ceiling lights and the switch, orange for the sockets at the big desk, over the sofa, on the back wall and for the network cabinet's UPS.",
    note: (link: L): React.ReactNode => <>
      Every run goes up into the ceiling, along it and straight down to its device, in conduit inside the linings.
      Each tag opens its row in the {link("/docs/office/electric#points", "points table")}.
    </>,
    realAlt: "The same view rendered as finished: the white unit board on the back wall over the sofa, three slim ceiling lights, a two-gang switch by the glazing, sockets over the big desk, over the sofa's end and on the back wall, and the UPS socket under the network cabinet.",
  },
  network: {
    figureAlt: "Line drawing of the office from the front: the black wall cabinet on the back wall beside the big desk with the router on top, the PoE switch and the gateway inside and the UPS on the floor under it; a purple cable along the ceiling to the access point, and a magenta cable to the data outlet over the big desk.",
    note: (link: L): React.ReactNode => <>
      The router, the switch and the gateway sit in one small cabinet on their own circuit (C3) and UPS, so the farm&rsquo;s
      Wi-Fi, its cameras and its sensors keep working through a cut. Cables run with the power, along the ceiling and
      down to each outlet. Each tag opens its row in the {link("/docs/office/electric#network-points", "points table")}.
      Signal at the site is unknown until a survey of both networks; buy no radio hardware before it.
    </>,
    diagram: {
      label: (n: number) => `Network diagram: two 4G networks into the router, the router into an 8-port PoE switch in the office's cabinet, with the edge gateway and a UPS, then a drop for each of ${n} access points, outlets and cameras`,
      networks: { title: "4G networks", sub: "two SIMs, two operators" },
      router: { title: "R1 · Router", sub: "4G, failover" },
      switch: { title: "SW · Switch", sub: "8 ports, PoE" },
      gateway: { title: "GW · Gateway", sub: "MQTT, dashboard, recorder" },
      ups: { title: "UPS", sub: "from C3" },
      battery: "battery power to the cabinet (dashed)",
      cabinet: "All in the wall cabinet (RK) on the back wall",
      ports: "the switch’s ports",
      ap: "Access points in the study room and by the guest rooms",
      cam: "Cameras at the gate and the store, recorded on the gateway",
      cable: "Cat 6 inside; outdoor-rated cable in duct, with surge protection at each end, to the access points and cameras outside (dashed)",
      signal: "The signal at the site is unknown until the survey of both networks; the edge gateway keeps working when the link is down",
    },
  },
  docs: [
    { href: "/docs/office", title: "Execution plan", text: "Every step of fitting out the office and the network that starts in it, from the survey to the certificate." },
    { href: "/docs/office/materials", title: "Materials", text: "The furniture and the equipment, each electric device and the network gear, with its size, source and cost." },
    { href: "/docs/office/electric", title: "Electric", text: "The four circuits with the network cabinet on its UPS, the tests, and every electric and network point." },
  ],
  pointsDrawing: { electric: "office's electrical drawing", network: "office's network drawing" },
  // office.json's words, by row id
  json: {
    circuits: {} as Record<string, Partial<RoomCircuit>>,
    points: {} as Record<string, Partial<RoomPoint>>,
    netCircuits: {} as Record<string, { serves?: string }>,
    netPoints: {} as Record<string, Partial<RoomPoint>>,
  },
}

const rw: typeof en = {
  meta: {
    title: "Ibiro · Ifamu",
    description: "Ibiro by'ifamu, aho kuruhukira n'icyumba cy'akazi cy'umuporogaramu: ikontineri y'ibara rya saffron ku rubaho ruzamuye hafi y'urugo rwo hagati, kuri Digital Farm hafi ya Kigali.",
  },
  hero: {
    title: "Ibiro ku rubaho, hafi y'urugo rwo hagati",
    alt: "Ikontineri y'ubururu bwijimye iri ku ikadiri y'icyuma itukura igufi, imbere yayo urubaho rw'imbaho, uruhande rwayo rw'imbere ari urukuta rw'inzugi z'ibirahure zifite amakadiri y'umweru: imbere, sofa y'ivu imeze nka L n'ameza mato y'igiti cya oak, n'ameza y'akazi ariho ecran n'intebe y'imikino y'umukara, bimurikiwe n'urumuri rushyushye; ku rubaho, ameza mato afite hejuru ha marbre ariho ikirahure cy'icyayi n'intebe ebyiri z'igiti zicaraho imiseke, ku byatsi byogoshe imbere y'ishyamba ry'inturusu ku zuba rirenga.",
  },
  plan: {
    title: "Igishushanyo: ikontineri ya ft 20, mm 6,058 kuri 2,438, ifite urubaho rwa mm 1,500 imbere yayo n'ingazi ku nguni yayo; imbere, sofa imwe imeze nka L ifata impera yose y'inzugi z'ikontineri igakomeza ku rukuta rw'inyuma, izengurutse ameza magufi, n'ameza manini y'umuporogaramu n'uw'imikino afata urukuta rwose rw'impera ya kure, ariho Studio Display imwe, Mac Studio n'intebe y'imikino; ku rubaho, ameza y'ahwa y'uruziga n'intebe ebyiri, nko muri kafe yo mu Misiri.",
    labels: {
      desk: "AMEZA", mac: "MAC STUDIO", display: "STUDIO DISPLAY", sofa: "SOFA", table: "AMEZA MATO", cafe: "KAFE", glazing: "IBIRAHURE BINYERERA",
      deck: "URUBAHO", stair: "INGAZI", office: "IBIRO", cargo: "INZUGI", doors: "Z'IKONTINERI",
    },
  },
  model: {
    lineAlt: "Igishushanyo cy'imirongo cy'ibiro kirebwa uturutse imbere, urukuta rw'imbere rwakuweho: ikontineri izamuye ku ikadiri yayo, urubaho rufite uruzitiro n'ingazi, sofa imeze nka L ku mpera y'inzugi z'ikontineri no ku rukuta rw'inyuma ifite ameza magufi, n'ameza manini ku rukuta rw'impera ya kure ariho Studio Display, Mac Studio n'intebe y'imikino, naho ku rubaho, ameza y'ahwa yo mu Misiri n'intebe ebyiri.",
    realAlt: "Ishusho imwe yakozwe nk'ifoto: amabati y'icyuma y'ibara rya saffron, inkuta z'umweru wijimye n'igorofa ry'imbaho za oak, sofa y'ibara ry'ivu ry'ibuye imeze nka L n'ameza ya Medium Oak, ameza y'akazi ya Medium Oak ariho Studio Display na Mac Studio z'ifeza, intebe y'imikino y'umukara, ameza y'ahwa afite hejuru ha marbre n'intebe ebyiri z'igiti zicaraho imiseke ku rubaho, ku nkingi z'icyuma zitukura, urubaho rw'inturusu n'uruzitiro rutukura hejuru y'ibyatsi.",
  },
  sections: { furniture: "Intebe, ameza n'ibikoresho", network: "Urusobe" },
  rails: {
    sofa: { title: "Sofa imeze nka L", size: (a, b, d) => `m ${a} × ${b}, ubujyakuzimu m ${d}`,
      note: "Igice kimwe: akaguru kayo kagufi gafata impera yose y'inzugi z'ikontineri, akaguru kayo karekare gakurikira urukuta rw'inyuma, intebe y'inguni hagati yabyo." },
    sofatable: { title: "Ameza magufi", size: (a, b) => `m ${a} × ${b}, uburebure m 0.41`, note: "Medium Oak, imbere ya sofa." },
    bigdesk: { title: "Ameza manini", size: (a, b) => `m ${a} × ${b}, uburebure m 0.75`,
      note: "Afata urukuta rwose rw'impera ya kure, ay'umuporogaramu n'uw'imikino; impande z'imbaho n'urubaho rw'imbere rupfuka amaguru." },
    display: { title: "Studio Display", size: (w, foot) => `Ubugari m ${w}, ikirenge cyayo gifite ubujyakuzimu bwa m ${foot}`, note: "Imwe, hagati ku meza. Ingano ya Apple ivuye mu kwibuka [A], ntiraboneka aho kugurwa." },
    macstudio: { title: "Mac Studio", size: (w) => `m ${w} × ${w}, uburebure m 0.095`, note: "Ku meza iruhande rwa ecran. Ingano ya Apple ivuye mu kwibuka [A], ntiraboneka aho kugurwa." },
    keyboard: { title: "Keyboard na mouse", size: "Hafi m 0.44 × 0.13", note: "Imbere ya ecran." },
    gamingchair: { title: "Intebe y'imikino", size: "Ikirenge cy'amaguru atanu kiriho uduziga, umugongo muremure ufite amababa n'aho kwegamiza umutwe", note: "Ireba ameza n'urukuta." },
    cafetable: { title: "Ameza y'ahwa", size: (d, h) => `Ø m ${d}, uburebure m ${h}`, note: "Hejuru ha marbre ku nkingi y'icyuma gishongeshejwe, nko muri kafe gakondo yo mu Misiri; ku rubaho." },
    cafechair: { title: "Intebe z'ahwa × 2", size: (w, d, seat) => `m ${w} × ${d}, aho bicara kuri m ${seat}`,
      note: "Igiti cyijimye gifite intebe ziboshye mu miseke, ku mpande zombi z'ameza, zireba ubusitani." },
  },
  electric: {
    board: "ikibaho cy'ibiro cya modile 12, ku rukuta rw'inyuma",
    supply: { title: "Ikibaho cy'ifamu", sub: "cy'ifamu, hanze y'igishushanyo", cable: "umugozi ukingiwe, ungana n'uburebure bw'inzira yawo" },
    notes: (designA, mainA) => [
      `Ingufu zateganyijwe A ${designA} kuri disijonkitere nkuru ya A ${mainA} · RCBO imwe ya mA 30 ubwoko A kuri buri muzunguruko · amategeko ya sitidiyo (D-021)`,
      "C3 igaburira UPS y'akabati ka network gusa · ibipimo ni ibyateganyijwe kugeza umutekinisiye w'amashanyarazi wo mu cyiciro A cya RURA ateguye umuriro akanabyemeza",
    ],
    figureAlt: "Igishushanyo cy'imirongo cy'ibiro kirebwa uturutse imbere: ikibaho ku rukuta rw'inyuma hejuru ya sofa, imizunguruko yacyo izamuka ikurikira inkombe y'igisenge ikamanuka kuri buri hantu, mu bururu ku matara atatu yo ku gisenge na switch, mu icunga ku priza zo ku meza manini, hejuru ya sofa, ku rukuta rw'inyuma n'iya UPS y'akabati ka network.",
    note: (link) => <>
      Buri muyoboro uzamuka mu gisenge, ukagikurikira ukamanuka ugororotse ku gikoresho cyawo, muri conduit iri mu nkuta.
      Buri kimenyetso gifungura umurongo wacyo mu {link("/docs/office/electric#points", "mbonerahamwe y'ahantu")}.
    </>,
    realAlt: "Ishusho imwe yakozwe nk'ifoto, irangiye: ikibaho cy'umweru ku rukuta rw'inyuma hejuru ya sofa, amatara atatu yoroheje yo ku gisenge, switch y'imfunguzo ebyiri hafi y'ibirahure, priza hejuru y'ameza manini, hejuru y'impera ya sofa no ku rukuta rw'inyuma, na priza ya UPS munsi y'akabati ka network.",
  },
  network: {
    figureAlt: "Igishushanyo cy'imirongo cy'ibiro kirebwa uturutse imbere: akabati k'umukara ku rukuta rw'inyuma iruhande rw'ameza manini, router hejuru yako, switch ya PoE na gateway imbere muri ko na UPS hasi munsi yako; umugozi w'ibara rya move ukurikira igisenge ugana kuri access point, n'umugozi wa magenta ugana kuri priza ya data hejuru y'ameza manini.",
    note: (link) => <>
      Router, switch na gateway biri mu kabati gato kamwe, ku muzunguruko wabyo bwite (C3) no kuri UPS, kugira ngo Wi-Fi
      y'ifamu, kamera zayo na sensori zayo bikomeze gukora n'iyo umuriro wabuze. Imigozi ijyana n'iy'amashanyarazi, ku
      gisenge ikamanuka kuri buri priza. Buri kimenyetso gifungura umurongo wacyo mu{" "}
      {link("/docs/office/electric#network-points", "mbonerahamwe y'ahantu")}. Uko itumanaho rigera aho hantu ntiharamenyekana
      kugeza hakozwe isuzuma ry'imiyoboro yombi; ntimugure ibikoresho bya radiyo mbere yaryo.
    </>,
    diagram: {
      label: (n) => `Igishushanyo cy'urusobe: imiyoboro ibiri ya 4G ijya kuri router, router ijya kuri switch ya PoE y'imyanya 8 mu kabati k'ibiro, hamwe na edge gateway na UPS, hanyuma umugozi umwe kuri buri kimwe muri ${n}: access points, priza na kamera`,
      networks: { title: "Imiyoboro ya 4G", sub: "SIM ebyiri, sosiyete ebyiri" },
      router: { title: "R1 · Router", sub: "4G, isimburana" },
      switch: { title: "SW · Switch", sub: "imyanya 8, PoE" },
      gateway: { title: "GW · Gateway", sub: "MQTT, dashboard, ifata amashusho" },
      ups: { title: "UPS", sub: "ivuye kuri C3" },
      battery: "umuriro wa bateri ujya ku kabati (utudomo)",
      cabinet: "Byose biri mu kabati ko ku rukuta (RK), ku rukuta rw'inyuma",
      ports: "imyanya ya switch",
      ap: "Access points mu cyumba cyo kwigiramo no hafi y'ibyumba by'abashyitsi",
      cam: "Kamera ku irembo no ku bubiko, zifatirwa kuri gateway",
      cable: "Cat 6 imbere; umugozi wagenewe hanze mu muyoboro, ufite uburinzi bw'umuriro mwinshi ku mpera zombi, ujya kuri access points na kamera zo hanze (utudomo)",
      signal: "Uko itumanaho rigera aho hantu ntiharamenyekana kugeza hakozwe isuzuma ry'imiyoboro yombi; edge gateway ikomeza gukora n'iyo itumanaho ryacitse",
    },
  },
  docs: [
    { href: "/docs/office", title: "Gahunda y'imirimo", text: "Buri ntambwe yo gutunganya ibiro n'urusobe rutangirira muri byo, kuva ku bipimo kugeza ku cyemezo." },
    { href: "/docs/office/materials", title: "Ibikoresho", text: "Intebe, ameza n'ibikoresho, buri gikoresho cy'amashanyarazi n'ibikoresho by'urusobe, n'ingano yabyo, aho bigurwa n'igiciro." },
    { href: "/docs/office/electric", title: "Amashanyarazi", text: "Imizunguruko ine, akabati ka network kari kuri UPS yako, ibizamini, na buri hantu h'amashanyarazi n'h'urusobe." },
  ],
  pointsDrawing: { electric: "gishushanyo cy'amashanyarazi cy'ibiro", network: "gishushanyo cy'urusobe cy'ibiro" },
  json: {
    circuits: {
      C1: { serves: "Amatara" }, C2: { serves: "Priza: ameza manini, sofa n'urukuta rw'inyuma" },
      C3: { serves: "Akabati ka network na UPS" }, C4: { serves: "Uw'inyongera" },
    },
    points: {
      DB: { description: "Ikibaho cy'amashanyarazi, modile 12, ku rukuta rw'inyuma hejuru ya sofa" },
      L1: { description: "Itara ryo ku gisenge, hejuru y'inguni ya sofa" },
      L2: { description: "Itara ryo ku gisenge, hagati mu cyumba" },
      L3: { description: "Itara ryo ku gisenge, hejuru y'ameza manini" },
      S1: { description: "Switch y'imfunguzo ebyiri ku mpera y'inzugi z'ikontineri hejuru ya sofa, hafi y'ibirahure: L1, na L2 hamwe na L3" },
      P1: { description: "Priza + USB-C hejuru y'ameza manini, inyuma ya Mac Studio" },
      P2: { description: "Priza ebyiri hejuru y'ameza manini, iya Studio Display n'iya chargeur" },
      P3: { description: "Priza ebyiri ku mpera y'inzugi z'ikontineri hejuru ya sofa, iya telefoni n'iy'itara" },
      P4: { description: "Priza ebyiri ku rukuta rw'inyuma, hirya y'ukuboko kwa sofa" },
      P5: { description: "Priza ebyiri ya UPS, iruhande rwayo munsi y'akabati ka network" },
    },
    netCircuits: { N1: { serves: "PoE ijya kuri access point" }, N2: { serves: "Data ijya ku meza manini" } },
    netPoints: {
      RK: { description: "Akabati ko ku rukuta 9U, gafunguye imbere, hejuru ku rukuta rw'inyuma iruhande rw'ameza manini" },
      R1: { description: "Router ya 4G ifite SIM ebyiri, hejuru y'akabati" },
      SW: { description: "Switch ya PoE, imyanya 8, mu kabati" },
      GW: { description: "Edge gateway: MQTT broker, store-and-forward, dashboard yo hafi, ifata amashusho ya kamera" },
      UPS: { description: "UPS y'akabati, hasi munsi yako" },
      AP1: { description: "Access point ya Wi-Fi ku gisenge, ihabwa umuriro n'umugozi wayo" },
      D1: { description: "Priza ya data hejuru y'ameza manini, iruhande rwa P1, ya Mac Studio" },
    },
  },
}

export const words: Words<typeof en> = { en, rw }
