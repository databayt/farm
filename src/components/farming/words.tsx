import type * as React from "react"

import type { Words } from "@/components/internationalization/words"

// Every word of the field's page, its drawings, its rails and its docs tables (D-058): the English, then its
// Kinyarwanda, a machine draft until a native speaker reviews it. plan.json (written by scripts/site/farming.mjs) keeps
// its English for the render scripts; `json` lays the Kinyarwanda over its crops and its bill of materials (data.ts).
type L = (href: string, text: string) => React.ReactNode
type Crop = { name: string; spacing: string; watch: string; yieldNote: string }
type Bom = { item: string }

const en = {
  meta: {
    title: "The field · Farm",
    description: "Every vegetable on the guests' plates grown on the farm: raised beds on drip by the galley, at the Digital Farm near Kigali.",
  },
  hero: {
    title: "Everything on the plate, grown here",
    alt: "A kitchen-garden field on a Rwandan hillside under a soft grey sky: raised beds of red-brown soil with staked tomatoes, flowering potatoes, carrots, onions, cabbages, red amaranth, kale and chard on drip lines, a rail fence of barked poles with a gate on the main path, a wheelbarrow of compost and baskets of tomatoes, carrots, potatoes and greens in front, a shade-net nursery at the right, and bananas, papaya and eucalyptus before terraced green hills.",
  },
  plan: {
    title: (total: number, needed: number) => `Plan, seen from the gate: the field as it starts, the two rows of blocks nearest the gate, ${total} raised beds 1.2 by 10 m in blocks of ten either side of a 2 m main path inside a fence 53,500 by 22,500 mm; ${needed} planted this season (solid) and the rest resting (dashed); the gate at the front onto the garden walk to the galley; the nursery up the yard.`,
    labels: { nursery: "NURSERY ↑", gate: "GATE · TO THE GALLEY", beds: "BEDS", path: "PATH" },
  },
  model: {
    caption: "Rendered from the design model: the field as it starts, one season, the fruit row behind",
    lineAlt: "Line drawing of the whole field from its gate end: two rows of blocks of raised beds either side of the main path, each bed planted with its crop or resting, the wire fence on barked posts with the gate in front, and the fruit row of banana mats and fruit trees behind the back fence.",
    realAlt: "The same view rendered on the white page: dark beds of tomatoes, beans, cabbages, kale, amaranth, onions, carrots, potatoes and the rest on sandy paths, four resting beds, the fence, and behind it bananas, avocado, mango, lemon and papaya.",
  },
  nursery: {
    section: "Nursery",
    section3d: "Nursery 3D",
    title: "Plan of the seedling nursery: a shade-net house 8,000 by 4,000 mm on eucalyptus poles every 2 m, two benches 7 m long along its long sides, each holding 48 seedling trays, a 1.2 m path between them, the door at the end toward the field and a tap beside it.",
    labels: { trays: "SEEDLING TRAYS", door: "DOOR", path: "PATH", tap: "TAP" },
    lineAlt: "Line drawing of the seedling nursery seen level from the front with its front and roof off: eucalyptus poles every 2 m along the back under a flat frame, two waist-high benches of seedling trays, the door frame at the right end and a tap by it.",
    realAlt: "The same view rendered: eucalyptus poles, grey-green shade net at the back and the ends, timber benches holding black trays of green seedlings, and a steel tap by the door.",
  },
  field: {
    title: "Field",
    baseAlt: "One block of the field from straight above: bare sandy ground, pegged out for ten beds.",
    builds: [
      "Ten beds dug and raised 20 cm, each 1.2 m wide and 10 m long.",
      "Compost spread over each bed.",
      "Two drip lines along each bed, fed from the header.",
      "Seedlings from the nursery planted, and seed sown straight into the beds.",
    ],
    stages: (needed: number, total: number) => [
      { title: "The bare ground", text: "Fenced, tested and marked out: soil samples to RAB, the borehole's flow measured over 6 hours, and the beds pegged across the slope." },
      { title: "Step 1 · Beds", text: `1.2 m wide, 10 m long, raised 20 cm, with 0.5 m paths between them and 1 m between blocks of ten. The start plants ${needed} of its ${total}.` },
      { title: "Step 2 · Compost", text: "About 250 kg of compost or manure per 100 m² dug into each bed, and lime only if the soil test asks for it." },
      { title: "Step 3 · Drip", text: "Two drip lines per bed from a header pipe and a filter at the tank. Run it for an hour and check every emitter before planting." },
      { title: "Step 4 · Planting", text: "Kale, cabbage, onion, tomato, pepper, eggplant and spinach come from the nursery after 4 to 6 weeks; beans, carrots, amaranth, cucumber and herbs are sown in place." },
    ],
  },
  crops: {
    title: "Crops",
    alt: (name: string, rows: number) => `Three metres of a bed of ${name.toLowerCase()} in ${rows} ${rows === 1 ? "row" : "rows"} on drip.`,
    forGalley: "For the galley",
    kg: (kg: number, avg: number) => `${kg} kg a week on a full house, ${avg} kg on an average one`,
    beds: "Beds",
    bedsValue: (planted: number, beds: number, batch: number, every: number) =>
      `${planted} at the start (${beds} for a full house), planted ${batch} at a time every ${every === 1 ? "week" : `${every} weeks`}`,
    firstHarvest: "First harvest",
    first: (weeks: number, nursery: number, harvest: number) =>
      `${weeks} weeks ${nursery ? `after transplanting (${nursery} weeks in the nursery first)` : "after sowing"}, then ${harvest} weeks of picking`,
    note: (spacing: string, watch: string, yieldNote: string) => `Spacing ${spacing} cm. Watch for ${watch}. Yield: ${yieldNote}.`,
  },
  water: {
    title: "Water",
    figureAlt: "Line drawing of the whole field from its gate end with the crops left out: the main in dark blue coming in through the gate, the supply in blue along the main path and the aisles, an orange valve where each block's header leaves it, the headers across the bed ends, and two light-blue drip lines down every planted bed.",
    note: (link: L): React.ReactNode => <>
      The main comes in through the gate from the farm&rsquo;s tank and pump by the compound (T, with the disc filter F,
      off the drawing). Inside, the supply runs along the main path and up and down each column&rsquo;s end; every block
      has its own valve, so a short flow waters one block at a time. Each tag opens its row in the{" "}
      {link("/docs/farming/water#points", "points table")}. Water at dawn or dusk, mulch the
      beds with dry grass, and plant season C only to the flow the borehole test proves. Under 1 ha of irrigation needs no permit.
    </>,
    caption: "Rendered from the design model: the beds before planting, so the drip shows",
    realAlt: "The same view rendered: dark compost beds on sandy paths, two black drip lines down each planted bed, the black supply along the main path and the bed ends with orange valve boxes, the main coming in at the gate, the fence, and the fruit row behind.",
    estimate: (rwf: string) => `RWF ${rwf} (estimate)`,
    each: (rwf: string, n: number) => `RWF ${rwf} each × ${n} (estimate)`,
    greentech: "Not sourced yet: Holland Greentech sells drip (not contacted)",
    rail: {
      tank: { title: "Tank and pump", size: "Sized to the borehole's tested flow", where: "The farm's, by the compound", cost: "Not in the field's budget: the farm's water",
        note: (lo: number, hi: number) => `T · the farm's tank and booster pump, shared with the compound. The field takes ${lo} to ${hi} m³ a day in the driest months.` },
      filter: { title: "Disc filter", size: "1 inch, at the tank", note: "F · stops the grit that blocks emitters. Open and rinse its discs every week." },
      main: { title: "Main pipe", size: (m: number, dn: number) => `${m} m of ${dn} mm PE`, note: "M1 · from the tank down to the garden walk and along it to the field's gate, buried 30 cm." },
      valve: { title: (n: number) => `Block valves × ${n}`, size: "A 32 mm ball valve on a tee, in a valve box",
        note: (ids: string) => `${ids} · each block waters on its own, so a short flow can run them one after another.` },
      header: { title: "Supply and headers", size: (m: number) => `${m} m of 32 mm PE, with start connectors`,
        note: "S1 and H · along the main path and the aisles, then across each block's gate-side end, a start connector for every drip line." },
      drip: { title: "Drip lines", size: (m: string) => `${m} m of 16 mm tape, two lines a bed`,
        note: (n: number) => `DL · ${n} lines, 10 m each, down every planted bed; an end closure on each, flushed open once a month.` },
    },
    // the water diagram (water-diagram.tsx)
    diagram: {
      label: (dn: number, m: number, n: number) => `Water diagram: the farm's source fills the tank by the compound; its pump pushes the water through a disc filter into a ${dn} mm main, ${m} m to the field's gate; inside, a 32 mm supply runs along the main path to a valve for each of the ${n} blocks, and each block's header feeds two drip lines down every planted bed`,
      source: { title: "Source", sub: "borehole or mains" },
      tank: { title: "Tank + pump", sub: "the farm's, by the compound" },
      filter: { title: "Disc filter", sub: "F · 1 inch" },
      main: (dn: number, m: number) => `${dn} mm PE · ${m} m, down to the garden walk and along it`,
      key: { main: "Main 40 mm", supply: "Supply and headers 32 mm", drip: "Drip line 16 mm", valve: "Block valve" },
      gate: { title: "Gate", sub: "the field" },
      supply: "32 mm · along the main path and the aisles",
      block: (id: string) => `Block ${id}`,
      onDrip: (n: number, of: number) => `${n} of ${of} beds on drip`,
      notes: (lines: number, drip: string, pipe: number, lo: number, hi: number): [string, string] => [
        `${lines} drip lines, ${drip} m in all · ${pipe} m of 32 mm supply and headers · in the driest months the beds drink ${lo} to ${hi} m³ a day, run at dawn or dusk, one block at a time if the flow is short`,
        "Flush the lines and check every emitter before planting · the source and its flow wait for the 6-hour borehole test · design intent",
      ],
    },
  },
  docs: [
    { href: "/docs/farming", title: "Execution plan", text: "The seasons, the beds, the crops and the first month step by step, from the soil test to the first harvest." },
    { href: "/docs/farming/materials", title: "Materials", text: "The bill of materials for the first beds: the ground, the water, the fence, the nursery, the seed and the tools." },
    { href: "/docs/farming/water", title: "Water", text: "How the drip is laid from the farm's tank to every bed, what the field drinks, and every point." },
  ],
  // the water points (data.ts), for the tags and the docs table
  points: {
    T: { what: "Tank and booster pump", where: "The farm's, by the compound, off the drawing", size: "To the borehole test" },
    F: { what: "Disc filter", where: "At the tank, off the drawing", size: "1 inch" },
    M1: { what: "Main", where: "From the tank to the gate", size: (dn: number, m: number) => `${dn} mm PE, ${m} m` },
    S1: { what: "Supply", where: "Along the main path to the middle aisle, then up and down each column's end", size: "32 mm PE" },
    V: { what: (b: string) => `Valve, block ${b}`, where: (b: string) => `Where block ${b}'s header leaves the supply`, size: (n: number) => `32 mm ball valve, ${n} beds on drip` },
    H: { what: "Headers", where: "Across each block's gate-side end", size: "32 mm PE, 16.5 m a block" },
    DL: { what: "Drip lines", where: "Two down every planted bed", size: (n: number) => `16 mm tape, ${n} lines of 10 m` },
    drawing: "field's water drawing",
  },
  // the docs tables (docs-sections.tsx)
  plate: {
    lead: (p: { eaters: number; kgWeek: number; bedsFull: number; bedsTotal: number; bedsNeeded: number; plantedM2: string; grownKgWeek: number; coverFull: number; averageKgWeek: number }) =>
      `A full house every day is ${p.eaters} people at the galley’s table, 22 guests and the team, about ${p.kgWeek} kg of vegetables a week, and would take ${p.bedsFull} beds. The field starts smaller: the two rows of blocks nearest the gate, ${p.bedsTotal} beds, ${p.bedsNeeded} of them planted, about ${p.plantedM2} m² of growing area with a quarter more than the plate needs for pests and a failed planting. They give about ${p.grownKgWeek} kg a week: ${p.coverFull} % of a full house and more than an average week (${p.averageKgWeek} kg), whose surplus is sold. On the busiest weeks the galley buys the rest; the other two rows follow the bookings. Behind the field a row of bananas and fruit trees (avocado, mango, lemon, papaya) gives the table its fruit.`,
    crop: "Crop", perGuest: "Per guest a day", fullWeek: "Full house, a week", averageWeek: "Average week", bedsStart: "Beds at the start", fullHouse: "Full house",
    all: "All vegetables",
    of: (a: number, b: number) => `${a} of ${b}`,
    foot: "Grams on the plate are assumed until the cook writes the menu. Eggs come from the hens; events buy what the field can’t give.",
  },
  calendar: {
    lead: "A few beds of each crop go in every few weeks, so something is always ready to pick. Each family moves to another family’s beds the next season, so no bed grows the same family twice running.",
    crop: "Crop", plant: "Plant", nursery: "Nursery", toFirst: "To first harvest", picking: "Picking",
    every: (batch: number, every: number) => `${batch} ${batch === 1 ? "bed" : "beds"} every ${every === 1 ? "week" : `${every} weeks`}`,
    wk: (n: number) => `${n} wk`,
    inPlace: "sown in place",
    seasons: [
      { title: "Season A · September to February", text: "Raise seedlings for 3 to 8 weeks, transplant with the rains, drip through the January–February lull." },
      { title: "Season B · March to June", text: "Transplant in February and March; the raised beds carry the April rains; drip again from late May." },
      { title: "Season C · July to September", text: "Drip only: plant only what the borehole's proven flow can carry." },
    ],
  },
  bom: {
    lead: (beds: number, fence: number, total: string) => `Everything to start the ${beds} beds, the ${fence} m fence and the nursery: about ${total} with a 15 % contingency. Prices are placeholders until three quotes come in for each line.`,
    contingency: "Contingency (15 %)",
    total: "The field, to start",
    data: "Data:",
    sections: {} as Record<string, string>,
    units: {} as Record<string, string>,
  },
  // plan.json's words: the crops by id, the bill of materials by its English item
  json: {
    crops: {} as Record<string, Partial<Crop>>,
    bom: {} as Record<string, Partial<Bom>>,
  },
}

const rw: typeof en = {
  meta: {
    title: "Umurima · Ifamu",
    description: "Imboga zose ziri ku masahani y'abashyitsi zihingwa ku ifamu: uturima tuzamuye twuhirwa n'ibitonyanga hafi y'igikoni gikuru, kuri Digital Farm hafi ya Kigali.",
  },
  hero: {
    title: "Ibiri ku isahani byose, bihingwa hano",
    alt: "Umurima w'imboga ku musozi wo mu Rwanda munsi y'ikirere cy'ibicu byoroheje: uturima tuzamuye tw'ubutaka butukura-bwijimye turimo inyanya zishingiwe ibiti, ibirayi birabije indabo, karoti, ibitunguru, amashu, dodo itukura, sukuma na bette ku matiyo y'ibitonyanga, uruzitiro rw'inkingi zifite ibishishwa n'irembo ku nzira nkuru, ingorofani y'ifumbire n'ibiseke by'inyanya, karoti, ibirayi n'imboga z'amababi imbere, ubuhumbikiro butwikiriwe n'urushundura rw'igicucu iburyo, n'insina, ipapayi n'inturusu imbere y'imisozi y'amaterasi itoshye.",
  },
  plan: {
    title: (total, needed) => `Igishushanyo, kirebwa uturutse ku irembo: umurima uko utangira, imirongo ibiri y'amatsinda y'uturima yegereye irembo, uturima tuzamuye ${total} twa m 1.2 kuri 10 mu matsinda y'uturima icumi ku mpande zombi z'inzira nkuru ya m 2, imbere y'uruzitiro rwa mm 53,500 kuri 22,500; ${needed} muri two duterwa muri iki gihembwe (umurongo wuzuye) n'utundi turuhuka (utudomo); irembo imbere rigana ku nzira y'ubusitani ijya ku gikoni gikuru; ubuhumbikiro hejuru mu rugo.`,
    labels: { nursery: "UBUHUMBIKIRO ↑", gate: "IREMBO · KU GIKONI GIKURU", beds: "UTURIMA", path: "INZIRA" },
  },
  model: {
    caption: "Byakozwe uhereye ku gishushanyo mbonera: umurima uko utangira, igihembwe kimwe, umurongo w'ibiti by'imbuto inyuma",
    lineAlt: "Igishushanyo cy'imirongo cy'umurima wose kirebwa uturutse ku ruhande rw'irembo: imirongo ibiri y'amatsinda y'uturima tuzamuye ku mpande zombi z'inzira nkuru, buri karima kateyemo igihingwa cyako cyangwa karuhuka, uruzitiro rw'insinga ku nkingi zifite ibishishwa n'irembo imbere, n'umurongo w'insina n'ibiti by'imbuto inyuma y'uruzitiro rw'inyuma.",
    realAlt: "Ishusho imwe yakozwe nk'ifoto ku rupapuro rwera: uturima twijimye tw'inyanya, imiteja, amashu, sukuma, dodo, ibitunguru, karoti, ibirayi n'ibindi ku nzira z'umucanga, uturima tune turuhuka, uruzitiro, n'inyuma yarwo insina, avoka, imyembe, indimu n'amapapayi.",
  },
  nursery: {
    section: "Ubuhumbikiro",
    section3d: "Ubuhumbikiro 3D",
    title: "Igishushanyo cy'ubuhumbikiro bw'ingemwe: inzu y'urushundura rw'igicucu ya mm 8,000 kuri 4,000 ku nkingi z'inturusu buri m 2, intebe ebyiri z'ingemwe za m 7 ku mpande zayo ndende, buri imwe ifite udusanduku tw'ingemwe 48, inzira ya m 1.2 hagati yazo, urugi ku mpera yerekeye umurima na robine iruhande rwarwo.",
    labels: { trays: "INGEMWE", door: "URUGI", path: "INZIRA", tap: "ROBINE" },
    lineAlt: "Igishushanyo cy'imirongo cy'ubuhumbikiro bw'ingemwe kirebwa imbere ku rugero rumwe, uruhande rw'imbere n'igisenge byakuweho: inkingi z'inturusu buri m 2 inyuma munsi y'ikadiri iringaniye, intebe ebyiri zigeze mu rukenyerero ziriho udusanduku tw'ingemwe, ikadiri y'urugi ku mpera y'iburyo na robine iruhande rwayo.",
    realAlt: "Ishusho imwe yakozwe nk'ifoto: inkingi z'inturusu, urushundura rw'igicucu rw'icyatsi kijya ku ivu inyuma no ku mpera, intebe z'imbaho ziriho udusanduku tw'umukara turimo ingemwe zitoshye, na robine y'icyuma hafi y'urugi.",
  },
  field: {
    title: "Umurima",
    baseAlt: "Itsinda rimwe ry'uturima ry'umurima rirebwa uturutse hejuru neza: ubutaka bw'umucanga butariho ikintu, bwashyizweho ibimenyetso by'uturima icumi.",
    builds: [
      "Uturima icumi ducukuwe kandi tuzamuwe cm 20, buri kamwe ubugari bwa m 1.2 n'uburebure bwa m 10.",
      "Ifumbire y'imborera isasa kuri buri karima.",
      "Amatiyo abiri y'ibitonyanga ku burebure bwa buri karima, ahabwa amazi n'itiyo nkuru y'itsinda.",
      "Ingemwe zivuye mu buhumbikiro ziterwa, n'imbuto zibibwa ako kanya mu turima.",
    ],
    stages: (needed, total) => [
      { title: "Ubutaka butariho ikintu", text: "Buzitiwe, bwapimwe kandi bushyizweho ibimenyetso: ingero z'ubutaka zoherezwa muri RAB, amazi borehole itanga apimwa mu masaha 6, n'uturima dushyirwaho ibimenyetso dutambitse ku buhaname." },
      { title: "Intambwe 1 · Uturima", text: `Ubugari bwa m 1.2, uburebure bwa m 10, tuzamuwe cm 20, inzira za m 0.5 hagati yatwo na m 1 hagati y'amatsinda y'uturima icumi. Igihe cyo gutangira hateranwa ${needed} muri ${total}.` },
      { title: "Intambwe 2 · Ifumbire", text: "Hafi kg 250 z'ifumbire y'imborera cyangwa iy'amatungo kuri 100 m² ivangwa muri buri karima, n'ishwagara gusa iyo igerageza ry'ubutaka ribisabye." },
      { title: "Intambwe 3 · Ibitonyanga", text: "Amatiyo abiri y'ibitonyanga kuri buri karima ava ku itiyo nkuru y'itsinda n'akayunguruzo kari ku kigega. Fungura amazi isaha imwe maze ugenzure buri kenge gatonyanga mbere yo gutera." },
      { title: "Intambwe 4 · Gutera", text: "Sukuma, ishu, igitunguru, inyanya, puwavuro, intoryi na epinari biva mu buhumbikiro nyuma y'ibyumweru 4 kugeza 6; imiteja, karoti, dodo, concombre n'ibirungo bibibwa aho bizakurira." },
    ],
  },
  crops: {
    title: "Ibihingwa",
    alt: (name, rows) => `Metero eshatu z'akarima ka ${name.toLowerCase()} ku mirongo ${rows} y'ibitonyanga.`,
    forGalley: "Ku gikoni gikuru",
    kg: (kg, avg) => `kg ${kg} mu cyumweru iyo amacumbi yose yuzuye, kg ${avg} mu cyumweru gisanzwe`,
    beds: "Uturima",
    bedsValue: (planted, beds, batch, every) =>
      `${planted} mu gutangira (${beds} iyo amacumbi yose yuzuye), haterwa ${batch} icyarimwe buri ${every === 1 ? "cyumweru" : `byumweru ${every}`}`,
    firstHarvest: "Isarura rya mbere",
    first: (weeks, nursery, harvest) =>
      `Ibyumweru ${weeks} ${nursery ? `nyuma yo kwimura ingemwe (zibanza kumara ibyumweru ${nursery} mu buhumbikiro)` : "nyuma yo kubiba"}, hanyuma ibyumweru ${harvest} byo gusarura`,
    note: (spacing, watch, yieldNote) => `Intera cm ${spacing}. Witondere ${watch}. Umusaruro: ${yieldNote}.`,
  },
  water: {
    title: "Amazi",
    figureAlt: "Igishushanyo cy'imirongo cy'umurima wose kirebwa uturutse ku ruhande rw'irembo, ibihingwa byakuweho: umuyoboro mukuru mu bururu bwijimye winjira unyuze mu irembo, umuyoboro ugabura mu bururu ku nzira nkuru no mu nzira zo hagati, valve y'icunga aho itiyo nkuru ya buri tsinda ivira, amatiyo makuru y'amatsinda atambitse ku mpera z'uturima, n'amatiyo abiri y'ibitonyanga y'ubururu bworoshye muri buri karima kateyemo.",
    note: (link) => <>
      Umuyoboro mukuru winjira unyuze mu irembo uvuye ku kigega cy&rsquo;ifamu no kuri pompe biri hafi y&rsquo;ikigo (T, hamwe
      n&rsquo;akayunguruzo F, hanze y&rsquo;igishushanyo). Imbere, umuyoboro ugabura ukurikira inzira nkuru ukazamuka ukamanuka ku
      mpera ya buri nkingi; buri tsinda rifite valve yaryo, ku buryo amazi make yuhira itsinda rimwe icyarimwe. Buri
      kimenyetso gifungura umurongo wacyo mu {link("/docs/farming/water#points", "mbonerahamwe y'ahantu")}. Uhire mu
      museke cyangwa nimugoroba, usasire uturima ibyatsi byumye, kandi mu gihembwe C utere gusa ibyo amazi yemejwe
      n&rsquo;igerageza rya borehole ashobora kuhira. Kuhira ubuso buri munsi ya ha 1 ntibisaba uruhushya.
    </>,
    caption: "Byakozwe uhereye ku gishushanyo mbonera: uturima mbere yo gutera, kugira ngo ibitonyanga bigaragare",
    realAlt: "Ishusho imwe yakozwe nk'ifoto: uturima twijimye tw'ifumbire ku nzira z'umucanga, amatiyo abiri y'umukara y'ibitonyanga muri buri karima kateyemo, umuyoboro ugabura w'umukara ku nzira nkuru no ku mpera z'uturima ufite udusanduku twa valve tw'icunga, umuyoboro mukuru winjira ku irembo, uruzitiro, n'umurongo w'ibiti by'imbuto inyuma.",
    estimate: (rwf) => `RWF ${rwf} (igereranyo)`,
    each: (rwf, n) => `RWF ${rwf} imwe × ${n} (igereranyo)`,
    greentech: "Ntibiraboneka aho kugurwa: Holland Greentech icuruza ibikoresho by'ibitonyanga (ntiravugishwa)",
    rail: {
      tank: { title: "Ikigega na pompe", size: "Bingana n'amazi borehole yerekanye itanga mu igerageza", where: "By'ifamu, hafi y'ikigo", cost: "Ntibiri mu ngengo y'imari y'umurima: ni amazi y'ifamu",
        note: (lo, hi) => `T · ikigega cy'ifamu na pompe yacyo, bisangiwe n'ikigo. Umurima ukenera m³ ${lo} kugeza ${hi} ku munsi mu mezi y'izuba ryinshi.` },
      filter: { title: "Akayunguruzo ka disiki", size: "Santimetero 1, ku kigega", note: "F · gahagarika umucanga ufunga utwenge dutonyanga. Gafungure woze disiki zako buri cyumweru." },
      main: { title: "Umuyoboro mukuru", size: (m, dn) => `m ${m} za PE ya mm ${dn}`, note: "M1 · uva ku kigega umanuka ku nzira y'ubusitani ukayikurikira ugera ku irembo ry'umurima, ushyinguye cm 30." },
      valve: { title: (n) => `Valve z'amatsinda × ${n}`, size: "Valve y'umupira ya mm 32 kuri té, mu gasanduku ka valve",
        note: (ids) => `${ids} · buri tsinda ryuhirwa ukwaryo, ku buryo amazi make ashobora kuyuhira imwe ikurikira indi.` },
      header: { title: "Umuyoboro ugabura n'amatiyo makuru y'amatsinda", size: (m) => `m ${m} za PE ya mm 32, zifite imihuza yo gutangiriraho`,
        note: "S1 na H · ku nzira nkuru no mu nzira zo hagati, hanyuma utambitse ku mpera ya buri tsinda yerekeye irembo, umuhuza umwe kuri buri tiyo y'ibitonyanga." },
      drip: { title: "Amatiyo y'ibitonyanga", size: (m) => `m ${m} z'itiyo y'ibitonyanga ya mm 16, amatiyo abiri kuri buri karima`,
        note: (n) => `DL · amatiyo ${n}, buri rimwe m 10, muri buri karima kateyemo; buri rimwe rifunze ku mpera, rifungurwa rikozwa rimwe mu kwezi.` },
    },
    diagram: {
      label: (dn, m, n) => `Igishushanyo cy'amazi: isoko y'amazi y'ifamu yuzuza ikigega kiri hafi y'ikigo; pompe yacyo isunika amazi anyura mu kayunguruzo ka disiki ajya mu muyoboro mukuru wa mm ${dn}, m ${m} kugera ku irembo ry'umurima; imbere, umuyoboro ugabura wa mm 32 ukurikira inzira nkuru ugera kuri valve ya buri tsinda muri ${n}, kandi itiyo nkuru ya buri tsinda iha amazi amatiyo abiri y'ibitonyanga muri buri karima kateyemo`,
      source: { title: "Isoko", sub: "borehole cyangwa umuyoboro rusange" },
      tank: { title: "Ikigega + pompe", sub: "by'ifamu, hafi y'ikigo" },
      filter: { title: "Akayunguruzo", sub: "F · santimetero 1" },
      main: (dn, m) => `PE ya mm ${dn} · m ${m}, umanuka ku nzira y'ubusitani ukayikurikira`,
      key: { main: "Umuyoboro mukuru mm 40", supply: "Ugabura n'amatiyo y'amatsinda mm 32", drip: "Itiyo y'ibitonyanga mm 16", valve: "Valve y'itsinda" },
      gate: { title: "Irembo", sub: "umurima" },
      supply: "mm 32 · ku nzira nkuru no mu nzira zo hagati",
      block: (id) => `Itsinda ${id}`,
      onDrip: (n, of) => `Uturima ${n} muri ${of} ku bitonyanga`,
      notes: (lines, drip, pipe, lo, hi) => [
        `Amatiyo y'ibitonyanga ${lines}, m ${drip} zose hamwe · m ${pipe} z'umuyoboro ugabura n'amatiyo y'amatsinda ya mm 32 · mu mezi y'izuba ryinshi uturima tunywa m³ ${lo} kugeza ${hi} ku munsi, byuhirwa mu museke cyangwa nimugoroba, itsinda rimwe icyarimwe iyo amazi ari make`,
        "Kogesha amatiyo no kugenzura buri kenge gatonyanga mbere yo gutera · isoko n'amazi itanga bitegereje igerageza rya borehole ry'amasaha 6 · ibyateganyijwe",
      ],
    },
  },
  docs: [
    { href: "/docs/farming", title: "Gahunda y'imirimo", text: "Ibihembwe, uturima, ibihingwa n'ukwezi kwa mbere intambwe ku yindi, kuva ku gupima ubutaka kugeza ku isarura rya mbere." },
    { href: "/docs/farming/materials", title: "Ibikoresho", text: "Urutonde rw'ibikoresho by'uturima twa mbere: ubutaka, amazi, uruzitiro, ubuhumbikiro, imbuto n'ibikoresho by'intoki." },
    { href: "/docs/farming/water", title: "Amazi", text: "Uko ibitonyanga bishyirwaho kuva ku kigega cy'ifamu kugeza kuri buri karima, ibyo umurima unywa, na buri hantu." },
  ],
  points: {
    T: { what: "Ikigega na pompe", where: "By'ifamu, hafi y'ikigo, hanze y'igishushanyo", size: "Bikurikije igerageza rya borehole" },
    F: { what: "Akayunguruzo ka disiki", where: "Ku kigega, hanze y'igishushanyo", size: "Santimetero 1" },
    M1: { what: "Umuyoboro mukuru", where: "Uva ku kigega ugana ku irembo", size: (dn, m) => `PE ya mm ${dn}, m ${m}` },
    S1: { what: "Umuyoboro ugabura", where: "Ku nzira nkuru kugeza ku nzira yo hagati, hanyuma uzamuka ukamanuka ku mpera ya buri nkingi", size: "PE ya mm 32" },
    V: { what: (b) => `Valve, itsinda ${b}`, where: (b) => `Aho itiyo nkuru y'itsinda ${b} iva ku muyoboro ugabura`, size: (n) => `Valve y'umupira ya mm 32, uturima ${n} ku bitonyanga` },
    H: { what: "Amatiyo makuru y'amatsinda", where: "Atambitse ku mpera ya buri tsinda yerekeye irembo", size: "PE ya mm 32, m 16.5 kuri buri tsinda" },
    DL: { what: "Amatiyo y'ibitonyanga", where: "Abiri muri buri karima kateyemo", size: (n) => `Itiyo y'ibitonyanga ya mm 16, amatiyo ${n} ya m 10` },
    drawing: "gishushanyo cy'amazi cy'umurima",
  },
  plate: {
    lead: (p) =>
      `Iyo amacumbi yose yuzuye buri munsi, ku meza y'igikoni gikuru haba abantu ${p.eaters}, abashyitsi 22 n'abakozi, bakenera hafi kg ${p.kgWeek} z'imboga mu cyumweru, zasaba uturima ${p.bedsFull}. Umurima utangira ari muto: imirongo ibiri y'amatsinda y'uturima yegereye irembo, uturima ${p.bedsTotal}, muri two ${p.bedsNeeded} duterwa, hafi m² ${p.plantedM2} z'ubuso buhingwa, harimo kimwe cya kane kirenze ibyo isahani ikenera kubera ibyonnyi n'igihingwa gishobora kunanirwa. Bitanga hafi kg ${p.grownKgWeek} mu cyumweru: ${p.coverFull} % by'ibikenewe iyo amacumbi yose yuzuye, kandi birenze icyumweru gisanzwe (kg ${p.averageKgWeek}), ibisagutse bikagurishwa. Mu byumweru biba byuzuye cyane, igikoni gikuru kigura ibisigaye; indi mirongo ibiri izakurikira uko abashyitsi biyandikisha. Inyuma y'umurima, umurongo w'insina n'ibiti by'imbuto (avoka, umwembe, indimu, ipapayi) uha ameza imbuto zayo.`,
    crop: "Igihingwa", perGuest: "Ku mushyitsi ku munsi", fullWeek: "Amacumbi yuzuye, mu cyumweru", averageWeek: "Icyumweru gisanzwe", bedsStart: "Uturima mu gutangira", fullHouse: "Amacumbi yuzuye",
    all: "Imboga zose",
    of: (a, b) => `${a} muri ${b}`,
    foot: "Garama ziri ku isahani ni ibyakekwa kugeza umutetsi yanditse ifunguro. Amagi ava ku nkoko; ibirori bigura ibyo umurima udashobora gutanga.",
  },
  calendar: {
    lead: "Uturima duke twa buri gihingwa duterwa nyuma y'ibyumweru bike, ku buryo buri gihe haba hari icyo gusarura. Buri muryango w'ibihingwa wimukira mu turima tw'undi muryango mu gihembwe gikurikira, ku buryo nta karima gahinga umuryango umwe kabiri gakurikiranye.",
    crop: "Igihingwa", plant: "Gutera", nursery: "Ubuhumbikiro", toFirst: "Kugeza ku isarura rya mbere", picking: "Gusarura",
    every: (batch, every) => `Uturima ${batch} buri ${every === 1 ? "cyumweru" : `byumweru ${every}`}`,
    wk: (n) => `ibyumweru ${n}`,
    inPlace: "bibibwa aho bizakurira",
    seasons: [
      { title: "Igihembwe A · Nzeri kugeza Gashyantare", text: "Kurera ingemwe mu byumweru 3 kugeza 8, kuzimura imvura itangiye, kuhira hakoreshejwe ibitonyanga igihe imvura ihagaze muri Mutarama na Gashyantare." },
      { title: "Igihembwe B · Werurwe kugeza Kamena", text: "Kwimura ingemwe muri Gashyantare no muri Werurwe; uturima tuzamuye twihanganira imvura ya Mata; kongera kuhira hakoreshejwe ibitonyanga guhera mu mpera za Gicurasi." },
      { title: "Igihembwe C · Nyakanga kugeza Nzeri", text: "Kuhira hakoreshejwe ibitonyanga gusa: gutera gusa ibyo amazi yemejwe ya borehole ashobora kuhira." },
    ],
  },
  bom: {
    lead: (beds, fence, total) => `Ibikenewe byose kugira ngo hatangire uturima ${beds}, uruzitiro rwa m ${fence} n'ubuhumbikiro: hafi ${total} harimo 15 % by'ingoboka. Ibiciro ni iby'agateganyo kugeza ibiciro bitatu bitanzwe n'abacuruzi bibonetse kuri buri murongo.`,
    contingency: "Ingoboka (15 %)",
    total: "Umurima, wo gutangira",
    data: "Amakuru:",
    sections: {
      "Ground and beds": "Ubutaka n'uturima", Water: "Amazi", Fence: "Uruzitiro", Nursery: "Ubuhumbikiro",
      "Seed and plants": "Imbuto n'ingemwe", Tools: "Ibikoresho by'intoki", People: "Abakozi",
    },
    units: { test: "igerageza", bed: "uturima", set: "iseti", months: "amezi" },
  },
  json: {
    crops: {
      tomato: { name: "Inyanya", watch: "Tuta absoluta, late blight (indwara yumisha amababi n'imbuto vuba), bacterial wilt (kuraba guterwa na bagiteri)",
        yieldNote: "t 20/ha ku bitonyanga n'ibiti byo gushingira [E]; impuzandengo y'igihugu mu murima ni hafi t 8/ha [V CRP-17]" },
      onion: { name: "Igitunguru", watch: "thrips (udusimba duto cyane twonona amababi), downy mildew (uruhumbu munsi y'amababi)",
        yieldNote: "t 25/ha [E]; abacuruza amoko amwe bavuga kugeza kuri t 60/ha" },
      cabbage: { name: "Ishu", watch: "diamondback moth (ikinyugunyugu gito, inyo zacyo zirya amababi), black rot (indwara ya bagiteri yirabuza amababi)",
        yieldNote: "t 25 kugeza 30/ha [V CRP-68]" },
      carrot: { name: "Karoti", spacing: "imirongo 20, hanyuma hagasigara 6", watch: "carrot fly (isazi, inyo zayo zicukura karoti), leaf blight (indwara yumisha amababi)",
        yieldNote: "t 20 kugeza 30/ha [V CRP-68]" },
      pepper: { name: "Puwavuro", watch: "whitefly (udusimba duto tw'umweru tuguruka), thrips, bacterial wilt",
        yieldNote: "t 20/ha [E]; hafi t 40/ha mu mirima isanzwe myiza kurusha iyindi [V CRP-68]" },
      eggplant: { name: "Intoryi", watch: "fruit borer (inyo yinjira mu ntoryi), bacterial wilt",
        yieldNote: "kg 10 kugeza 12 ku murongo wa m 10 [V CRP-70]" },
      amaranth: { name: "Dodo", watch: "aphids (udusimba duto tunyunyuza ibimera)",
        yieldNote: "kugeza kuri t 10/ha z'amababi kuri buri cyiciro cyo gusarura [V CRP-71]; t 15/ha mu isarura esheshatu za buri cyumweru [E]" },
      kale: { name: "Sukuma", watch: "diamondback moth, black rot",
        yieldNote: "hafi t 15/acre isarurwa ibibabi ku kindi [V CRP-69]" },
      beans: { name: "Imiteja", watch: "bean fly (isazi ntoya, inyo zayo zangiza uruti), rust (ingese ku mababi)",
        yieldNote: "imiteja migufi t 5 kugeza 6/ha [V CRP-68]" },
      cucumber: { name: "Concombre", spacing: "100 × 50, ku giti cyo kuzamukiraho", watch: "aphids, downy mildew",
        yieldNote: "ku giti cyo kuzamukiraho t 25/ha [E]; kg 8 kugeza 10 ku murongo wa m 10 iyo ziri hasi [V CRP-70]" },
      spinach: { name: "Epinari na bette", watch: "leaf miners (inyo nto zicukura imbere mu mababi)",
        yieldNote: "t 20/ha isarurwa ibibabi ku kindi [E]" },
      herbs: { name: "Ibirungo", spacing: "persil 40 × 15, coriandre imirongo 15", watch: "aphids",
        yieldNote: "t 10/ha [E]" },
      potato: { name: "Ibirayi", watch: "late blight, bacterial wilt, tuber moth (ikinyugunyugu inyo zacyo zicukura ibirayi)",
        yieldNote: "t 15/ha [A AS-26], iby'agateganyo: nta musaruro w'ibirayi wo mu Rwanda uri mu bitabo by'amakuru. Ibirayi byera neza mu misozi miremire ikonje; ahantu hano hari hasi kandi hashyushye, byitezwe ko byera bike kandi bikarwara late blight kenshi [U]" },
      chilli: { name: "Urusenda", watch: "thrips, mites (udusimba duto cyane), bacterial wilt",
        yieldNote: "t 10/ha rubisi [A AS-27], iby'agateganyo: nta musaruro w'urusenda wo mu Rwanda uri mu bitabo by'amakuru; ni urw'igikoni, si urwo kugurisha (urusenda rwo kugurisha rusaba umuguzi wanditse [CRP-26])" },
    },
    bom: {
      "Soil test at RAB (10 spots, one mixed sample)": { item: "Gupimisha ubutaka muri RAB (ahantu 10, urugero rumwe ruvanze)" },
      "Compost or manure, about 250 kg per 100 m² of bed": { item: "Ifumbire y'imborera cyangwa iy'amatungo, hafi kg 250 kuri 100 m² z'akarima" },
      "Agricultural lime, only if the test asks (about 200 kg per 1,000 m²)": { item: "Ishwagara, gusa iyo igerageza ribisabye (hafi kg 200 kuri 1,000 m²)" },
      "Labour to dig and raise the beds": { item: "Abakozi bo gucukura no kuzamura uturima" },
      "Drip tape, 16 mm, two lines a bed": { item: "Itiyo y'ibitonyanga, mm 16, amatiyo abiri kuri buri karima" },
      "Supply and header pipe, 32 mm PE": { item: "Umuyoboro ugabura n'amatiyo makuru y'amatsinda, PE ya mm 32" },
      "Valve and fittings at each block": { item: "Valve n'imihuza kuri buri tsinda" },
      "Disc filter, 1 inch, at the tank": { item: "Akayunguruzo ka disiki, santimetero 1, ku kigega" },
      "Main pipe from the tank, 40 mm PE": { item: "Umuyoboro mukuru uva ku kigega, PE ya mm 40" },
      "Wire mesh, 1.5 m high": { item: "Urushundura rw'insinga, uburebure bwa m 1.5" },
      "Treated timber posts": { item: "Inkingi z'ibiti byatewe imiti" },
      "Gate onto the garden walk": { item: "Irembo rigana ku nzira y'ubusitani" },
      "Shade net, 50 %": { item: "Urushundura rw'igicucu, 50 %" },
      "Poles and wire for the shade house": { item: "Inkingi n'insinga by'inzu y'igicucu" },
      "Seedling trays, 128 cells": { item: "Udusanduku tw'ingemwe, utwobo 128" },
      "Benches for the trays": { item: "Intebe z'udusanduku tw'ingemwe" },
      "Seed for a year (Holland Greentech), all twelve crops": { item: "Imbuto z'umwaka (Holland Greentech), ibihingwa byose cumi na bibiri" },
      "Stakes and string for tomatoes, trellis for cucumbers": { item: "Ibiti n'imigozi by'inyanya, ibiti byo kuzamukiraho bya concombre" },
      "Pheromone traps for Tuta absoluta": { item: "Imitego ya feromone ya Tuta absoluta" },
      "Hoes, rakes, forks, watering cans, wheelbarrows, knapsack sprayer, crates, a scale": { item: "Amasuka, amarato, amasuka y'amenyo, amarozwari, ingorofani, pompe yo gutera imiti ihekwa, udusanduku, umunzani" },
      "Gardeners for the first three months": { item: "Abahinzi mu mezi atatu ya mbere" },
    },
  },
}

export const words: Words<typeof en> = { en, rw }
