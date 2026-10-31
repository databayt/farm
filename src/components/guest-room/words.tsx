import type * as React from "react"

import type { RoomPoint } from "@/components/docs/room-points"
import type { RoomCircuit } from "@/components/docs/room-wiring"
import type { Words } from "@/components/internationalization/words"

// Every word of the guest room's page, its drawings, its rails and its docs tables (D-058): the English, then its
// Kinyarwanda, a machine draft until a native speaker reviews it. guest-room.json keeps its English for the render
// scripts; `json` lays the Kinyarwanda over its rows by id (data.ts). A row with no entry keeps its English.
type L = (href: string, text: string) => React.ReactNode

const en = {
  meta: {
    title: "The guest room · Farm",
    description: "A room for two in the container block, with a double bed, its own shower and WC, and a timber veranda with lake views, at the Digital Farm near Kigali.",
  },
  hero: {
    title: "A quiet room, with the veranda for mornings",
    alt: "The guest-room block at sunset: two teal shipping containers joined into one long building on a fieldstone plinth, three rooms each with a cream door and a white-framed window lit warm onto a bed and lamps inside, a timber veranda under a slatted timber pergola along the front with two slatted chairs, a small table with a lantern and potted plants at each room, a step down to the lawn at each door, among avocado trees.",
  },
  plan: {
    title: "Plan: one guest room 4,064 mm wide and 4,876 mm deep, a third of the container block, with a 1,500 mm veranda in front. A 1,600 x 2,000 mm double bed against the back wall under a window, a bedside table each side and a bench at its foot on a rug; a wardrobe on the left wall and a 1,000 mm desk on the right, beside the bed; across the front-left corner an en-suite 2,400 x 1,350 mm behind a 700 mm sliding door, with a 900 x 900 mm walk-in shower, a WC and a basin under the front window; the 900 mm door on the front right opening in; coat hooks on the right wall; red steel posts at the joint across the middle; two chairs and a round table on the veranda.",
    labels: {
      bed: "BED", wardrobe: "WARDROBE", desk: "DESK", shower: "SHOWER", wc: "WC", basin: "BASIN", joint: "JOINT",
      door: "DOOR", veranda: "VERANDA", room: "GUEST ROOM", bathroom: "BATHROOM", window: "WINDOW", wayIn: "WAY IN",
    },
  },
  model: {
    lineAlt: "Line drawing of the guest room from the front with the front wall and ceiling off: the double bed with two pillows under the barred back window, bedside tables with lamps, a bench at the foot on a rug, the wardrobe on the left and the desk and chair on the right, the en-suite in the front-left corner with its walls cut low, showing the shower tray behind a glass screen, the WC and the basin on its console, the door open against the right, the joint's beam overhead, and two chairs and a table on the veranda with the step down.",
    realAlt: "The same view rendered: cream walls, an oak plank floor and Medium Oak furniture, white bedding with a mustard throw on a striped rug, the red-framed barred window, red steel posts and beam, the en-suite's white shower tray, WC and basin on grey tiles, the red door open, and timber chairs and a table with a lantern on the veranda over the lawn.",
  },
  sections: { bed: "Bed", room: "Room and veranda", bath: "Bathroom" },
  rails: {
    bed: { title: "Bed frame", size: (w: number, l: number, frame: number, head: number) => `${w} × ${l} m mattress, frame ${frame} m high, headboard ${head} m`,
      note: "A solid Medium Oak frame with its headboard on the back wall, under the barred window." },
    mattress: { title: "Mattress", size: (w: number, l: number, h: number) => `${w} × ${l} × ${h} cm`,
      where: "Not sourced yet (the studio's: Rwanda Foam Ltd, Kigali)", cost: (n: string) => `RWF ${n} (estimate, as the studio's)` },
    bedding: { title: "Bedding", size: (w: number, l: number) => `Duvet, two pillows and a cushion for ${w} × ${l} cm`, note: "White bedding with a mustard throw at the foot." },
    bedside: { title: "Bedside tables × 2", size: (w: number, d: number, h: number) => `${w} × ${d} m, ${h} m high`, note: "A top and a lower shelf on four legs, one each side of the bed." },
    lamp: { title: "Table lamps × 2", size: "Ø 0.26 m linen shade, 0.42 m high", cost: (n: string) => `RWF ${n} each × 2 (estimate, as the studio's)`,
      note: "One on each bedside table, plugged into the socket beside it (P1, P2): a lamp on both sides of the bed (D-029)." },
    bench: { title: "Luggage bench", size: (w: number, d: number, h: number) => `${w} × ${d} m, ${h} m high`, note: "Slatted, across the foot of the bed." },
    rug: { title: "Rug", size: (w: number, d: number) => `${w} × ${d} m`, note: "A flat-woven rug under the lower two thirds of the bed." },
    wardrobe: { title: "Wardrobe", size: (w: number, d: number, h: number) => `${w} × ${d} m, ${h} m high`, note: "Two doors, on the left wall beside the bed, short of the joint's post." },
    desk: { title: "Desk", size: (w: number, d: number, h: number) => `${w} × ${d} m, ${h} m high`, note: "On the right wall beside the bed, with a reading lamp and the socket P3 over it." },
    chair: { title: "Desk chair", size: (w: number, d: number, seat: number, back: number) => `${w} × ${d} m, seat ${seat} m, back ${back} m` },
    hooks: { title: "Coat hooks", size: (l: number, h: number) => `A ${l} m rail of four hooks at ${h} m`, note: "On the right wall, clear of the door's swing." },
    verandachair: { title: "Veranda chairs × 2", size: (w: number, d: number, seat: number, back: number) => `${w} × ${d} m, seat ${seat} m, back ${back} m`,
      note: "Slatted, under the front window, as on the camp's porch." },
    verandatable: { title: "Veranda table", size: (d: number, h: number) => `Ø ${d} m, ${h} m high`, note: "A pedestal table between the chairs, with a lantern." },
    shower: { title: "Walk-in shower", size: (w: number, d: number, h: number) => `${w} × ${d} m tray, a ${h} m fixed glass screen`,
      note: "A low tray with a centre drain, the glass screen beside the WC, a riser rail with the hand shower; the instant heater (H1) on the left wall, as the studio's (D-053)." },
    wc: { title: "WC", size: (w: number, d: number, seat: number, h: number) => `${w} × ${d} m, seat at ${seat} m, cistern ${h} m high`,
      note: "Floor-standing with a low close-coupled cistern, so it sits under the front window's sill." },
    basin: { title: "Basin and console", size: (w: number, d: number, h: number) => `${w} × ${d} m, top at ${h} m`,
      note: (w: number, h: number) => `A vessel basin on a timber console with a pillar tap; a ${w} × ${h} m mirror above it.` },
    isolators: "Isolators",
    heaterCost: (n: string) => `RWF ${n} (estimate, as the studio's)`,
  },
  electric: {
    board: "the room's 12-module board, by the bed",
    supply: { title: "Site board", sub: "the farm's, off the drawing", cable: "armoured cable, sized to its run" },
    notes: (designA: number, mainA: number): string[] => [
      `Design ${designA} A on a ${mainA} A main switch · one RCBO 30 mA type A per circuit · the studio's conventions (D-021)`,
      "Ratings are design intent until a RURA class A electrician designs the supply and certifies the room",
    ],
    figureAlt: "Line drawing of the guest room from the front with the ceiling and the joint's beam off: the unit board on the right wall by the bed, the circuits rising from its top along the ceiling edge and down to each point, in blue for the lights, the bathroom's switch and the wall fan, orange for the sockets beside the bedside tables, over the desk and by the bathroom, green for the AC isolator high on the back wall, and red for the shower heater on the bathroom's left wall and its isolator outside the bathroom door.",
    note: (link: L): React.ReactNode => <>
      Every run goes up into the ceiling, along it and straight down to its device, in conduit inside the linings.
      Each tag opens its row in the {link("/docs/guest-room/electric#points", "points table")}.
      The bedside lamps plug into P1 and P2, so the bed has a lamp on each side (D-029). The room&rsquo;s own bathroom
      ({link("/docs/decision-log", "D-061")}) puts the shower&rsquo;s
      instant heater on a circuit of its own, with a double-pole isolator outside the bathroom door, as the
      studio&rsquo;s; its pipes are on the {link("/docs/guest-room/plumbing", "plumbing page")}.
    </>,
    realAlt: "The same view rendered as finished: the white unit board on the right wall, sockets with USB-C beside both bedside tables, a double socket by the desk and on the right wall, a two-gang switch by the door, the wall fan high on the left wall, the red AC isolator high on the back wall, and slim ceiling lights and a smoke alarm.",
  },
  docs: [
    { href: "/docs/guest-room", title: "Execution plan", text: "Every step of fitting out the three rooms, in the studio's order, from the Day 1 survey to the first guest." },
    { href: "/docs/guest-room/materials", title: "Materials", text: "The bed, the room and the veranda, the bathroom, and each electric device, with its size, where to buy it and its cost." },
    { href: "/docs/guest-room/electric", title: "Electric", text: "The five circuits, the first and second fix, the tests and the certificate, and every light, switch and socket." },
    { href: "/docs/guest-room/plumbing", title: "Plumbing", text: "Each room's shower, WC and basin: the supply, the hot water, the drains and the vent, and the tests." },
  ],
  pointsDrawing: "guest room's electrical drawing",
  // guest-room.json's words, by row id
  json: {
    circuits: {} as Record<string, Partial<RoomCircuit>>,
    points: {} as Record<string, Partial<RoomPoint>>,
  },
}

const rw: typeof en = {
  meta: {
    title: "Icyumba cy'abashyitsi · Ifamu",
    description: "Icyumba cy'abantu babiri mu nyubako y'amakontineri, gifite igitanda cy'abantu babiri, douche na WC byacyo bwite, n'urubaraza rw'imbaho rureba ikiyaga, kuri Digital Farm hafi ya Kigali.",
  },
  hero: {
    title: "Icyumba gituje, n'urubaraza rwo mu gitondo",
    alt: "Inyubako y'ibyumba by'abashyitsi ku zuba rirenga: amakontineri abiri y'ibara ry'icyatsi-ubururu afatanye abaye inyubako imwe ndende ku musingi w'amabuye, ibyumba bitatu buri kimwe gifite urugi rw'ibara rya kirimu n'idirishya rifite ikadiri y'umweru rimurikiwe n'urumuri rushyushye rureba igitanda n'amatara imbere, urubaraza rw'imbaho munsi y'igisenge cy'imbaho zitandukanye imbere y'inyubako, gifite intebe ebyiri z'imbaho, ameza mato ariho itara n'inkono z'ibimera kuri buri cyumba, intambwe imanuka ku byatsi kuri buri rugi, hagati y'ibiti bya avoka.",
  },
  plan: {
    title: "Igishushanyo: icyumba kimwe cy'abashyitsi gifite mm 4,064 z'ubugari na mm 4,876 z'ubujyakuzimu, kimwe cya gatatu cy'inyubako y'amakontineri, gifite urubaraza rwa mm 1,500 imbere. Igitanda cy'abantu babiri cya mm 1,600 x 2,000 ku rukuta rw'inyuma munsi y'idirishya, akameza kuri buri ruhande n'intebe ndende ku birenge byacyo ku itapi; akabati k'imyenda ku rukuta rw'ibumoso n'ameza ya mm 1,000 iburyo, iruhande rw'igitanda; mu nguni y'imbere ibumoso ubwiherero bwa mm 2,400 x 1,350 inyuma y'urugi runyerera rwa mm 700, bufite douche yo kwinjiramo ya mm 900 x 900, WC na lavabo munsi y'idirishya ry'imbere; urugi rwa mm 900 imbere iburyo rufungukira imbere; udufashi tw'imyenda ku rukuta rw'iburyo; inkingi z'icyuma zitukura aho amakontineri ahurira hagati; intebe ebyiri n'ameza y'uruziga ku rubaraza.",
    labels: {
      bed: "IGITANDA", wardrobe: "AKABATI K'IMYENDA", desk: "AMEZA", shower: "DOUCHE", wc: "WC", basin: "LAVABO", joint: "IHURIRO",
      door: "URUGI", veranda: "URUBARAZA", room: "ICYUMBA CY'ABASHYITSI", bathroom: "UBWIHERERO", window: "IDIRISHYA", wayIn: "AHO BINJIRIRA",
    },
  },
  model: {
    lineAlt: "Igishushanyo cy'imirongo cy'icyumba cy'abashyitsi kirebwa uturutse imbere, urukuta rw'imbere n'igisenge byakuweho: igitanda cy'abantu babiri gifite imisego ibiri munsi y'idirishya ry'inyuma rifite ibyuma, udukameza turiho amatara, intebe ndende ku birenge ku itapi, akabati k'imyenda ibumoso n'ameza n'intebe iburyo, ubwiherero mu nguni y'imbere ibumoso inkuta zabwo zaciwe hasi, bwerekana tray ya douche inyuma y'ikirahure, WC na lavabo ku meza yayo, urugi rufunguye rwegamiye iburyo, igiti cy'ihuriro hejuru, n'intebe ebyiri n'ameza ku rubaraza n'intambwe imanuka.",
    realAlt: "Ishusho imwe yakozwe nk'ifoto: inkuta z'ibara rya kirimu, igorofa ry'imbaho za oak n'ibikoresho bya Medium Oak, amashuka y'umweru n'ikiringiti cy'umuhondo ku itapi y'imirongo, idirishya rifite ibyuma n'ikadiri itukura, inkingi n'igiti by'icyuma bitukura, tray ya douche y'umweru, WC na lavabo by'ubwiherero ku makaro y'ivu, urugi rutukura rufunguye, n'intebe z'imbaho n'ameza ariho itara ku rubaraza hejuru y'ibyatsi.",
  },
  sections: { bed: "Igitanda", room: "Icyumba n'urubaraza", bath: "Ubwiherero" },
  rails: {
    bed: { title: "Ikadiri y'igitanda", size: (w, l, frame, head) => `Matela ya m ${w} × ${l}, ikadiri ya m ${frame} z'uburebure, umutwe wa m ${head}`,
      note: "Ikadiri ikomeye ya Medium Oak ifite umutwe wayo ku rukuta rw'inyuma, munsi y'idirishya rifite ibyuma." },
    mattress: { title: "Matela", size: (w, l, h) => `cm ${w} × ${l} × ${h}`,
      where: "Ntiharaboneka aho kuyigura (iya sitidiyo: Rwanda Foam Ltd, Kigali)", cost: (n) => `RWF ${n} (igereranya, nk'iya sitidiyo)` },
    bedding: { title: "Ibiryamirwa", size: (w, l) => `Duvet, imisego ibiri n'agasego bya cm ${w} × ${l}`, note: "Amashuka y'umweru n'ikiringiti cy'umuhondo ku birenge." },
    bedside: { title: "Udukameza two ku buriri × 2", size: (w, d, h) => `m ${w} × ${d}, uburebure m ${h}`, note: "Hejuru n'akabati ko hasi ku maguru ane, kamwe kuri buri ruhande rw'igitanda." },
    lamp: { title: "Amatara yo ku meza × 2", size: "Igipfuko cy'umwenda wa Ø m 0.26, uburebure m 0.42", cost: (n) => `RWF ${n} kuri rimwe × 2 (igereranya, nk'aya sitidiyo)`,
      note: "Rimwe kuri buri kameza, ricometse kuri priza iri iruhande rwako (P1, P2): itara ku mpande zombi z'igitanda (D-029)." },
    bench: { title: "Intebe y'imizigo", size: (w, d, h) => `m ${w} × ${d}, uburebure m ${h}`, note: "Y'imbaho zitandukanye, ku birenge by'igitanda." },
    rug: { title: "Itapi", size: (w, d) => `m ${w} × ${d}`, note: "Itapi iboshye iringaniye munsi y'ibice bibiri bya gatatu by'igitanda byo hasi." },
    wardrobe: { title: "Akabati k'imyenda", size: (w, d, h) => `m ${w} × ${d}, uburebure m ${h}`, note: "Inzugi ebyiri, ku rukuta rw'ibumoso iruhande rw'igitanda, mbere y'inkingi y'ihuriro." },
    desk: { title: "Ameza", size: (w, d, h) => `m ${w} × ${d}, uburebure m ${h}`, note: "Ku rukuta rw'iburyo iruhande rw'igitanda, hejuru yayo itara ryo gusomeraho na priza P3." },
    chair: { title: "Intebe y'ameza", size: (w, d, seat, back) => `m ${w} × ${d}, aho bicara kuri m ${seat}, umugongo kuri m ${back}` },
    hooks: { title: "Udufashi tw'imyenda", size: (l, h) => `Umurongo wa m ${l} ufite udufashi tune kuri m ${h}`, note: "Ku rukuta rw'iburyo, kure y'aho urugi rufungukira." },
    verandachair: { title: "Intebe z'urubaraza × 2", size: (w, d, seat, back) => `m ${w} × ${d}, aho bicara kuri m ${seat}, umugongo kuri m ${back}`,
      note: "Z'imbaho zitandukanye, munsi y'idirishya ry'imbere, nko ku rubaraza rw'aho bakambika." },
    verandatable: { title: "Ameza y'urubaraza", size: (d, h) => `Ø m ${d}, uburebure m ${h}`, note: "Ameza ku nkingi imwe hagati y'intebe, ariho itara." },
    shower: { title: "Douche yo kwinjiramo", size: (w, d, h) => `Tray ya m ${w} × ${d}, ikirahure gifashe cya m ${h}`,
      note: "Tray ngufi ifite aho amazi asohokera hagati, ikirahure iruhande rwa WC, umurongo uzamuka ufite douche y'intoki; icyuma gishyushya amazi ako kanya (H1) ku rukuta rw'ibumoso, nk'icya sitidiyo (D-053)." },
    wc: { title: "WC", size: (w, d, seat, h) => `m ${w} × ${d}, aho bicara kuri m ${seat}, ikigega cya m ${h} z'uburebure`,
      note: "Ihagaze hasi ifite ikigega kigufi kiyifatanyeho, ku buryo ijya munsi y'idirishya ry'imbere." },
    basin: { title: "Lavabo n'ameza yayo", size: (w, d, h) => `m ${w} × ${d}, hejuru kuri m ${h}`,
      note: (w, h) => `Lavabo iteretse ku meza y'imbaho ifite robine ihagaze; indorerwamo ya m ${w} × ${h} hejuru yayo.` },
    isolators: "Isolators",
    heaterCost: (n) => `RWF ${n} (igereranya, nk'icya sitidiyo)`,
  },
  electric: {
    board: "ikibaho cy'icyumba cya modile 12, hafi y'igitanda",
    supply: { title: "Ikibaho cy'ifamu", sub: "cy'ifamu, hanze y'igishushanyo", cable: "umugozi ukingiwe, ungana n'uburebure bw'inzira yawo" },
    notes: (designA, mainA) => [
      `Ingufu zateganyijwe A ${designA} kuri disijonkitere nkuru ya A ${mainA} · RCBO imwe ya mA 30 ubwoko A kuri buri muzunguruko · amategeko ya sitidiyo (D-021)`,
      "Ibipimo ni ibyateganyijwe kugeza umutekinisiye w'amashanyarazi wo mu cyiciro A cya RURA ateguye umuriro akanemeza icyumba",
    ],
    figureAlt: "Igishushanyo cy'imirongo cy'icyumba cy'abashyitsi kirebwa uturutse imbere, igisenge n'igiti cy'ihuriro byakuweho: ikibaho ku rukuta rw'iburyo hafi y'igitanda, imizunguruko izamuka iva hejuru yacyo ikurikira inkombe y'igisenge ikamanuka kuri buri hantu, mu bururu ku matara, kuri switch y'ubwiherero no kuri fani yo ku rukuta, mu icunga ku priza ziri iruhande rw'udukameza, hejuru y'ameza no hafi y'ubwiherero, mu cyatsi kuri isolator ya AC iri hejuru ku rukuta rw'inyuma, no mu mutuku ku cyuma gishyushya amazi ya douche ku rukuta rw'ibumoso rw'ubwiherero na isolator yacyo hanze y'urugi rw'ubwiherero.",
    note: (link) => <>
      Buri muyoboro uzamuka mu gisenge, ukagikurikira ukamanuka ugororotse ku gikoresho cyawo, muri conduit iri mu nkuta.
      Buri kimenyetso gifungura umurongo wacyo mu {link("/docs/guest-room/electric#points", "mbonerahamwe y'ahantu")}.
      Amatara yo ku buriri acomekwa kuri P1 na P2, ku buryo igitanda gifite itara kuri buri ruhande (D-029). Ubwiherero
      bw&rsquo;icyumba ubwacyo ({link("/docs/decision-log", "D-061")}) bushyira icyuma gishyushya amazi ya douche ako kanya
      ku muzunguruko wacyo bwite, gifite isolator y&rsquo;impande zombi hanze y&rsquo;urugi rw&rsquo;ubwiherero, nk&rsquo;icya
      sitidiyo; imiyoboro yabwo iri ku {link("/docs/guest-room/plumbing", "paji y'imiyoboro y'amazi")}.
    </>,
    realAlt: "Ishusho imwe yakozwe nk'ifoto, irangiye: ikibaho cy'umweru ku rukuta rw'iburyo, priza zifite USB-C iruhande rw'udukameza twombi, priza ebyiri hafi y'ameza no ku rukuta rw'iburyo, switch y'imfunguzo ebyiri hafi y'urugi, fani yo ku rukuta hejuru ku rukuta rw'ibumoso, isolator ya AC itukura hejuru ku rukuta rw'inyuma, n'amatara yoroheje yo ku gisenge n'icyuma kimenyesha umwotsi.",
  },
  docs: [
    { href: "/docs/guest-room", title: "Gahunda y'imirimo", text: "Buri ntambwe yo gutunganya ibyumba bitatu, ku murongo wa sitidiyo, kuva ku bipimo by'Umunsi wa 1 kugeza ku mushyitsi wa mbere." },
    { href: "/docs/guest-room/materials", title: "Ibikoresho", text: "Igitanda, icyumba n'urubaraza, ubwiherero, na buri gikoresho cy'amashanyarazi, n'ingano yacyo, aho kukigura n'igiciro cyacyo." },
    { href: "/docs/guest-room/electric", title: "Amashanyarazi", text: "Imizunguruko itanu, icyiciro cya mbere n'icya kabiri cyo gushyiraho, ibizamini n'icyemezo, na buri tara, switch na priza." },
    { href: "/docs/guest-room/plumbing", title: "Imiyoboro y'amazi", text: "Douche, WC na lavabo bya buri cyumba: amazi yinjira, amazi ashyushye, imiyoboro y'umwanda n'iy'umwuka, n'ibizamini." },
  ],
  pointsDrawing: "gishushanyo cy'amashanyarazi cy'icyumba cy'abashyitsi",
  json: {
    circuits: {
      C1: { serves: "Amatara na fani yo ku rukuta" }, C2: { serves: "Priza: igitanda, ameza na priza yo gukora isuku" },
      C3: { serves: "Iteganyirizwa rya AC" }, C4: { serves: "Icyuma gishyushya amazi ya douche kW 5.5" }, C5: { serves: "Uw'inyongera" },
    },
    points: {
      DB: { description: "Ikibaho cy'amashanyarazi, modile 12, ku rukuta rw'iburyo hafi y'igitanda" },
      L1: { description: "Itara ryo ku gisenge, hejuru y'igitanda" },
      L2: { description: "Itara ryo ku gisenge, hafi y'urugi n'ameza" },
      S1: { description: "Switch y'imfunguzo ebyiri hafi y'urugi, hirya y'aho rufungukira: L1 na L2" },
      L3: { description: "Itara ryo ku gisenge cy'ubwiherero, IP44" },
      S2: { description: "Switch y'itara ry'ubwiherero, hanze y'urugi rwabwo" },
      F1: { description: "Fani yo ku rukuta mm 300, hejuru ku rukuta rw'ibumoso hejuru y'igitanda" },
      P1: { description: "Priza + USB-C iruhande rw'akameza k'ibumoso, iy'itara ryako n'iya telefoni" },
      P2: { description: "Priza + USB-C iruhande rw'akameza k'iburyo, iy'itara ryako n'iya telefoni" },
      P3: { description: "Priza ebyiri hejuru y'ameza, iy'itara ryayo n'iya mudasobwa" },
      P4: { description: "Priza ebyiri ku rukuta rw'ibumoso hafi y'ubwiherero: isuku, bouilloire" },
      P5: { description: "Iteganyirizwa rya AC: isolator hejuru ku rukuta rw'inyuma, ya split unit izaza nyuma" },
      P6: { description: "Isolator y'impande zombi y'icyuma gishyushya amazi ya douche, hanze y'ubwiherero" },
      H1: { description: "Icyuma gishyushya amazi ya douche ako kanya kW 5.5, IPX4, ku rukuta rw'ibumoso rwa douche" },
      A1: { description: "Icyuma kimenyesha umwotsi, bateri y'imyaka 10, ku gisenge hafi y'urugi" },
    },
  },
}

export const words: Words<typeof en> = { en, rw }
