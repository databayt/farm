import type * as React from "react"

import type { Words } from "@/components/internationalization/words"

// Every word of the way in's page, its drawings, its rails and its docs tables (D-058): the English, then its
// Kinyarwanda, a machine draft until a native speaker reviews it. parking.json carries no words the page shows; the
// points (data.ts) are built here.
type L = (href: string, text: string) => React.ReactNode

const en = {
  meta: {
    title: "Parking · Farm",
    description: "Five bays on gravel under shade trees, just inside the gate and the DIGITAL FARM sign wall, lit by solar bollards, at the Digital Farm near Kigali.",
  },
  hero: {
    title: "Parking just inside the gate",
    alt: "A fieldstone wall under a timber cap lettered DIGITAL FARM at golden hour, a bed of orange cannas, blue agapanthus and yellow lantana at its foot, beside two fieldstone pillars with lanterns and a honey timber gate braced in an X standing open; a fan of grey granite setts from the red dirt road through the gate onto grass pavers, a white four-by-four parked under broad acacia trees, and a sett road leading on to a second gate among tall eucalyptus.",
  },
  plan: {
    title: "Plan: a parking of compacted gravel 22,000 by 6,000 mm in a timber edging; along its west end five bays of 2,600 mm, timber strips 4,000 mm long between them and a log wheel stop in each, cars in bays 1 and 3, and four solar bollards past its far edge; 3,400 mm behind the strips the 7,600 mm sign wall, lettered DIGITAL FARM on its road face, and beside it the 4,400 mm gate, its leaves opening inward; a hedge along the boundary, a turn of setts from the public road through the gate, four shade trees, and the rock road, 4,000 mm wide, leaving the far edge for the inner gate.",
    labels: {
      stop: "WHEEL STOP", parking: "PARKING", gravel: "GRAVEL", road: "ROCK ROAD", inner: "TO THE INNER GATE", gate: "GATE",
      wall: "SIGN WALL", letters: "DIGITAL FARM IN LED LETTERS", hedge: "HEDGE", tree: "SHADE TREE", public: "PUBLIC ROAD", bollard: "SOLAR BOLLARD",
    },
  },
  model: {
    lineAlt: "Line drawing of the way in from beyond the public road: the hedge along the boundary, the sign wall lettered DIGITAL FARM with a solar panel on its cap, the gate shut between its pillars, the turn of setts, the gravel parking in its timber edging with its five bays, strips and wheel stops, two cars in their bays, solar bollards past its far edge, four shade trees and the start of the rock road.",
    realAlt: "The same view rendered in daylight: a red dirt road, a clipped green hedge, a fieldstone sign wall with DIGITAL FARM glowing in warm-white LED letters on dark steel, a timber gate braced in an X between fieldstone pillars, grey granite setts, a parking of pale grey gravel in a timber edging with timber strips and eucalyptus wheel stops, a white four-by-four and a silver hatchback, dark solar bollards past its far edge, and young shade trees casting shadows on the grass.",
  },
  build: {
    title: "Parking",
    baseAlt: "The parking's place from straight above: the turf lifted and a box of red-brown subsoil dug out, 22 by 6 m with rounded corners, pegged at its corners and strung.",
    builds: [
      "Geotextile rolled out over the box, and the timber edging pegged round it.",
      "Murram or crushed stone with its fines, compacted in two layers.",
      "Angular gravel spread over it and rolled in.",
      "Timber strips between the bays, and a wheel stop in each.",
    ],
    stages: (s: { dig: string; w: number; d: number; base: string; m3: number; edging: string; eh: string; gravel: string; strips: string }) => [
      { title: "The ground, dug out", text: `The turf lifted and the box dug ${s.dig} mm down to firm subsoil, ${s.w} × ${s.d} m with rounded corners, pegged and strung, its floor shaped to the lot's fall.` },
      { title: "Step 1 · Geotextile and edging", text: `A geotextile over the dug floor, so the stone never sinks into the clay; round it, treated eucalyptus boards ${s.eh} × ${s.edging} mm on edge, pegged every metre, their tops 10 mm above the finished gravel.` },
      { title: "Step 2 · Base", text: `${s.base} mm of murram or crushed stone with its fines, about ${s.m3} m³ compacted, rolled in two layers. It carries the cars.` },
      { title: "Step 3 · Gravel", text: `${s.gravel} mm of 6 to 14 mm angular gravel spread and rolled into the base, so it locks and does not roll under the tyres.` },
      { title: "Step 4 · Strips and stops", text: `A timber strip 100 mm wide between neighbouring bays, ${s.strips} mm long, pegged flush with the gravel, and a eucalyptus log pinned in each bay.` },
    ],
  },
  sections: { parts: "Parts", lighting: "Lighting", drainage: "Drainage" },
  lighting: {
    figureAlt: "Line drawing of the way in from beyond the road with its lights tagged: four solar bollards past the parking's far edge, the solar lantern on the gate's left pillar, and on the sign wall its solar panel, the box on its back face with the panel's lead in dark blue, and the letters' link in orange through the wall.",
    note: (link: L): React.ReactNode => <>
      Every light is solar (D-065): no cable crosses the ground and no trench is dug. Each bollard and each lantern
      carries its own panel, battery and dusk sensor; only the sign has a kit of parts, its panel on the wall&rsquo;s
      cap charging the box on the wall&rsquo;s back, which feeds the letters through the wall. Each tag opens its row
      in the {link("/docs/parking/lighting#points", "points table")}. Outside the drawing: the inner gate&rsquo;s
      lantern (L2).
    </>,
    caption: "Rendered from the design model, at dusk: the bollards, the letters and the outer gate's lantern lit",
    realAlt: "The same view after sunset: the lawn and the trees dark, warm pools of light round the four bollards past the parking, DIGITAL FARM glowing warm white on the sign wall and the lantern on the gate's left pillar lighting the pillar, the setts and the road in front.",
    diagram: {
      label: (n: number, watts: number) => `Lighting diagram: no cable and no trench. ${n} solar bollards past the parking's far edge and the two pillar lanterns, each with its own panel, battery and dusk sensor; for the sign, a ${watts} W panel on the wall's cap charges a battery in a weatherproof box on the wall's back, whose charge controller and timer feed the 24 V driver for the LED letters.`,
      key: { solar: "Panel to box", sign: "Letters, 24 V" },
      bollards: { title: (n: number) => `B1–B${n} · bollards × ${n}`, sub: "panel, battery, dusk sensor, LED", sub2: "past the parking's far edge" },
      l1: { title: "L1 · lantern", sub: "outer gate, left pillar" },
      l2: { title: "L2 · lantern", sub: "inner gate, right pillar" },
      own: "each with its own panel, battery and dusk sensor: nothing to wire",
      sp: { title: (w: number) => `SP · panel, ${w} W`, sub: "on the sign wall's cap" },
      dc: "down the wall",
      box: "EB · box on the sign wall",
      parts: ["Charge controller + timer", "Battery", "24 V LED driver"],
      sg: { title: "SG · sign letters", sub: "DIGITAL FARM, LED, 24 V" },
      wall: "through the wall",
      notes: [
        "On at dusk, each by its own sensor; the sign's timer can put the letters out late at night while the bollards and the lanterns stay on.",
        "Design intent: no lamp, panel or battery is sized or sourced yet; the letters' wattage sizes the sign's panel and battery",
      ] as [string, string],
    },
  },
  drainage: {
    figureAlt: "Line drawing of the way in from beyond the road with arrows of fall: three long arrows along the parking to its west end, two through the gate back to the road and four across the rock road to its edges, the gravel trench in dark blue across the west end and the soakaway pit by the hedge in light blue.",
    note: (link: L): React.ReactNode => <>
      The gravel takes some of the rain where it falls; its compacted base sheds the rest along the lot to its west end,
      into the trench and on to the soakaway. The turn sheds back to the road, so the road&rsquo;s water stays out. Each
      tag opens its row in the {link("/docs/parking/drainage#points", "points table")}. The soil&rsquo;s soakage is
      not tested yet: a percolation test on site sizes the pit, or says the trench must run on to a ditch.
    </>,
    caption: "Rendered from the design model: the trench's stone and the pit's cover are all that show",
    realAlt: "The same view rendered in daylight: the gravel parking in its timber edging, a strip of grey stone across the lawn at its west end and a square concrete cover by the hedge, the sign wall, the gate and the start of the rock road.",
    diagram: {
      label: (gravel: number, base: number, fall: number, w: number, d: number, pipe: number, size: number, depth: number) => `Drainage section along the parking: rain falls on ${gravel} mm of gravel over ${base} mm of compacted base on a geotextile; the surface falls 1 in ${fall} to the west end, where a gravel trench ${w} mm wide and ${d} mm deep, round a ${pipe} mm perforated pipe, takes the run-off to a soakaway pit ${size} m square and ${depth} m deep.`,
      layers: ["Gravel, 6 to 14 mm", "Compacted base", "Geotextile"],
      f1: (fall: number, mm: number, m: number) => `F1 · the lot falls 1 in ${fall}, ${mm} mm over its ${m} m, to the west end`,
      p: "the gravel takes some of the rain; its compacted base sheds the rest along the fall to the trench",
      t1: (w: number, d: number, pipe: number) => `trench ${w} × ${d} mm, stone in geotextile, ${pipe} mm perforated pipe`,
      sk: (size: number, depth: number) => `soakaway ${size} × ${size} × ${depth} m`,
      notes: (turn: number, road: number): [string, string] => [
        `Off the section: F2 · the turn of setts falls 1 in ${turn} back to the public road, so the road’s water never runs in through the gate · F3 · the rock road is crowned, 1 in ${road} to its edgings and the grass`,
        "Heights drawn about four times the length scale · the soakaway is sized again after a percolation test on site · design intent, not surveyed",
      ],
    },
  },
  docs: [
    { href: "/docs/parking", title: "Execution plan", text: "Every step of building the way in: the gravel parking, its timber edging and strips, the solar lights and the drain." },
    { href: "/docs/parking/materials", title: "Materials", text: "The gate, the sign, the gravel and its edging, the setts and the trees, the solar lights and the drainage, each with its size." },
    { href: "/docs/parking/lighting", title: "Lighting", text: "The solar bollards, the lanterns and the sign's own panel and battery, with every point." },
    { href: "/docs/parking/drainage", title: "Drainage", text: "The gravel and its base, the falls, the trench and the soakaway, with every point." },
  ],
  rails: {
    gate: { title: "Outer gate", size: (w: string, h: string) => `${w} between the pillars, leaves ${h} high`,
      note: "Two timber leaves of vertical boards on a frame braced in an X, black iron strap hinges and a latch, opening inward; fieldstone pillars 600 mm square under timber caps." },
    sign: { title: "Sign wall", size: (l: string, h: string, t: string) => `${l} long, ${h} high, ${t} thick`,
      note: "Fieldstone under a timber cap; on its road face a dark steel panel with DIGITAL FARM in warm-white LED capitals, its solar panel on the cap." },
    gravel: { title: "Gravel and base", size: (m2: number, base: number, top: number) => `${m2} m² inside the edging: about ${base} m³ of compacted base and ${top} m³ of gravel`,
      note: "Murram or crushed stone with its fines, compacted in two layers, under 6 to 14 mm angular gravel rolled into it; on a geotextile over the dug floor." },
    edging: { title: "Timber edging", size: (h: string, w: string, l: number, pegs: number) => `Boards ${h} × ${w} mm, about ${l} m with the strips, ${pegs} pegs`,
      note: "Treated eucalyptus on edge round the gravel, pegged every metre, its top 10 mm above the gravel; laid flat between the bays as the strips." },
    setts: { title: "Granite setts", size: "About 100 mm, for the turn and the rock road",
      note: "Grey granite in mixed tones, laid by hand on sand in segmental arcs: from the road through the gate, and the rock road to the inner gate." },
    stop: { title: (n: number) => `Wheel stops × ${n}`, size: (l: string, d: string) => `${l} long, ${d} across`,
      note: "Barked and oiled eucalyptus logs, pinned to the ground 450 mm from the far edge." },
    tree: { title: (n: number) => `Shade trees × ${n}`, size: (h: number, c: number) => `About ${h} m tall at planting, the crown from ${c} m`,
      note: "Young broad-canopied trees; the species is not chosen yet (the render brief names neem and acacia)." },
    bollard: { title: (n: number) => `Solar bollards × ${n}`, size: (h: string, d: string) => `${h} mm high, ${d} mm across, on a small footing`,
      note: "B1 to B4 · a panel on top, a battery, a dusk sensor and a warm LED inside; past the parking's far edge, clear of the trees' crowns, between the bays and across the rock road's mouth." },
    lanterns: { title: "Solar lanterns × 2", size: "About 140 mm square, 260 mm high, a panel on the top",
      note: "L1 on the outer gate's left pillar, L2 on the inner gate's right one: each with its own panel, battery and dusk sensor." },
    solar: { title: "The sign's solar kit", size: (pw: string, pd: string, watts: number, bw: string, bh: string) => `Panel ${pw} × ${pd} mm, ${watts} W; box ${bw} × ${bh} mm, IP65`,
      note: "SP, EB · the panel on the wall's cap; in the box on its back face the battery, the charge controller with its timer and the 24 V driver for the letters." },
    letters: { title: "Sign letters", size: (w: string, h: string) => `Panel ${w} × ${h} mm`,
      note: "SG · DIGITAL FARM in warm-white LED capitals at 24 V from the driver in the box." },
    layers: { title: "The build-up", size: (g: string, b: string, m2: number) => `Gravel ${g}, base ${b} mm, geotextile ${m2} m²`,
      note: "P · the parking cut open: the gravel rolled into its compacted base, on a geotextile over the clay, held by the timber edging." },
    trench: { title: "Gravel trench", size: (w: string, d: string, l: string, pipe: string) => `${w} × ${d} mm, ${l} m long, a ${pipe} mm perforated pipe`,
      note: "T1 · across the west end, 400 mm outside the edging: clean 20 to 40 mm stone in geotextile, falling 1 in 100 to the pit." },
    soakaway: { title: "Soakaway pit", size: (s: number, d: number) => `${s} × ${s} m, ${d} m deep, a slab cover`,
      note: "SK · stone in a geotextile wrap; sized again after a percolation test on site." },
  },
  // the points (data.ts), for the tags and the docs tables
  points: {
    lightDrawing: "way in's lighting drawing",
    drainDrawing: "way in's drainage drawing",
    B: { what: "Solar bollard", between: (a: number, b: number) => `Past the far edge, between bays ${a} and ${b}`, open: "Past the far edge, at bay 5's open side",
      road: "Across the rock road's mouth", size: (h: string, d: string) => `${h} mm high, ${d} mm across; its own panel and battery` },
    L1: { what: "Solar lantern, outer gate", where: "On the left pillar's cap", size: "Its own panel on the top" },
    L2: { what: "Solar lantern, inner gate", where: "On the right pillar, off the drawing", size: "As L1" },
    SP: { what: "The sign's solar panel", where: "On the sign wall's cap, over the box, tilted toward the farm", size: (w: string, d: string, watts: number) => `${w} × ${d} mm, ${watts} W` },
    EB: { what: "Box on the sign wall", where: "On the wall's back face at its east end, out of the guests' way", size: (w: string, h: string) => `${w} × ${h} mm, IP65; battery, charge controller and timer, 24 V driver` },
    SG: { what: "Sign letters", where: "The wall's road face", size: "LED, 24 V from the driver" },
    P: { what: "Gravel and base", where: "The whole lot", size: (g: string, b: string) => `${g} mm of gravel on ${b} mm of compacted base: some of the rain soaks in, the rest runs to the trench` },
    F1: { what: "The lot's fall", where: "Along its length, east to west", size: (f: number, mm: string, m: number) => `1 in ${f}, ${mm} mm over ${m} m` },
    F2: { what: "The turn's fall", where: "From the gate back to the public road", size: (f: number) => `1 in ${f}` },
    F3: { what: "The rock road's crown", where: "To the fieldstone edgings each side", size: (f: number) => `1 in ${f}` },
    T1: { what: "Gravel trench", where: "Across the west end, outside the edging", size: (w: string, d: string, pipe: string) => `${w} × ${d} mm, ${pipe} mm perforated pipe` },
    SK: { what: "Soakaway pit", where: "At the trench's south end, by the hedge", size: (s: number, d: number) => `${s} m square, ${d} m deep; sized after a percolation test` },
  },
}

const rw: typeof en = {
  meta: {
    title: "Parikingi · Ifamu",
    description: "Imyanya itanu ku mabuye mato munsi y'ibiti bitanga igicucu, imbere gato y'irembo n'urukuta ruriho icyapa DIGITAL FARM, imurikiwe n'amatara y'izuba, kuri Digital Farm hafi ya Kigali.",
  },
  hero: {
    title: "Parikingi imbere gato y'irembo",
    alt: "Urukuta rw'amabuye rufite umutwe w'igiti, ruriho inyuguti DIGITAL FARM ku zuba rirenga, akarima k'indabo za canna z'icunga, agapanthe z'ubururu na lantana z'umuhondo munsi yarwo, iruhande rw'inkingi ebyiri z'amabuye ziriho amatara n'irembo ry'igiti cy'ibara ry'ubuki rikomejwe na X rifunguye; amabuye ya granite y'ivu atatanye nk'umufana kuva ku muhanda w'itaka utukura anyura mu irembo agera ku mapave y'ibyatsi, imodoka y'umweru ya 4×4 iparitse munsi y'imishishi migari, n'umuhanda w'amabuye ugana ku irembo rya kabiri hagati y'inturusu ndende.",
  },
  plan: {
    title: "Igishushanyo: parikingi y'amabuye mato asindagiye ya mm 22,000 kuri 6,000 izengurutswe n'imbaho; ku mpera yayo y'iburengerazuba imyanya itanu ya mm 2,600, imirongo y'imbaho ya mm 4,000 hagati yayo n'igiti gihagarika imodoka muri buri mwanya, imodoka mu myanya 1 na 3, n'amatara ane y'izuba hakurya y'impera yayo ya kure; mm 3,400 inyuma y'imirongo urukuta ruriho icyapa rwa mm 7,600, ruriho inyuguti DIGITAL FARM ku ruhande rureba umuhanda, n'iruhande rwarwo irembo rya mm 4,400, inzugi zaryo zifungukira imbere; uruzitiro rw'ibiti ku rubibi, aho imodoka zihindukirira h'amabuye kuva ku muhanda rusange unyuze mu irembo, ibiti bine bitanga igicucu, n'umuhanda w'amabuye ufite ubugari bwa mm 4,000, uva ku mpera ya kure ugana ku irembo ry'imbere.",
    labels: {
      stop: "IGIHAGARIKA IMODOKA", parking: "PARIKINGI", gravel: "AMABUYE MATO", road: "UMUHANDA W'AMABUYE", inner: "KU IREMBO RY'IMBERE", gate: "IREMBO",
      wall: "URUKUTA RW'ICYAPA", letters: "DIGITAL FARM MU NYUGUTI ZA LED", hedge: "URUZITIRO RW'IBITI", tree: "IGITI CY'IGICUCU", public: "UMUHANDA RUSANGE", bollard: "ITARA RY'IZUBA",
    },
  },
  model: {
    lineAlt: "Igishushanyo cy'imirongo cy'inzira yinjira kirebwa uturutse hakurya y'umuhanda rusange: uruzitiro rw'ibiti ku rubibi, urukuta ruriho icyapa DIGITAL FARM n'icyuma gifata izuba ku mutwe warwo, irembo rifunze hagati y'inkingi zaryo, aho imodoka zihindukirira h'amabuye, parikingi y'amabuye mato izengurutswe n'imbaho n'imyanya yayo itanu, imirongo n'ibihagarika imodoka, imodoka ebyiri mu myanya yazo, amatara y'izuba hakurya y'impera yayo ya kure, ibiti bine bitanga igicucu n'aho umuhanda w'amabuye utangirira.",
    realAlt: "Ishusho imwe yakozwe nk'ifoto ku manywa: umuhanda w'itaka utukura, uruzitiro rw'ibiti rutoshye rukaswe, urukuta rw'amabuye ruriho DIGITAL FARM yaka mu nyuguti za LED z'urumuri rushyushye ku cyuma cyijimye, irembo ry'igiti rikomejwe na X hagati y'inkingi z'amabuye, amabuye ya granite y'ivu, parikingi y'amabuye mato y'ivu yerurutse izengurutswe n'imbaho ifite imirongo y'imbaho n'ibihagarika imodoka by'inturusu, imodoka y'umweru ya 4×4 n'indi nto y'ifeza, amatara y'izuba yijimye hakurya y'impera yayo ya kure, n'ibiti bito bitanga igicucu ku byatsi.",
  },
  build: {
    title: "Parikingi",
    baseAlt: "Aho parikingi izaba harebwa uturutse hejuru neza: ubwatsi bwakuweho n'ahantu h'ubutaka butukura-bwijimye hacukuwe, m 22 kuri 6 hafite imfuruka zihetamye, hashyizweho ibimenyetso mu mfuruka hagakururwa imigozi.",
    builds: [
      "Geotextile isasa ahacukuwe, n'imbaho zizengurutse zifatishwa ibiti bishinze.",
      "Murram cyangwa amabuye amenaguye n'ivumbi ryayo, bisindagirwa mu byiciro bibiri.",
      "Amabuye mato y'impande asasa hejuru agasindagirwa.",
      "Imirongo y'imbaho hagati y'imyanya, n'igihagarika imodoka muri buri mwanya.",
    ],
    stages: (s) => [
      { title: "Ubutaka, bucukuwe", text: `Ubwatsi bukurwaho, hagacukurwa mm ${s.dig} kugeza ku butaka bukomeye, m ${s.w} × ${s.d} hafite imfuruka zihetamye, hashyizweho ibimenyetso n'imigozi, hasi hagatunganywa hakurikije ubuhaname bw'ikibanza.` },
      { title: "Intambwe 1 · Geotextile n'imbaho", text: `Geotextile hasi ahacukuwe, kugira ngo amabuye atarigita mu ibumba; ahazengurutse, imbaho z'inturusu zitunganyijwe za mm ${s.eh} × ${s.edging} zihagaze, zifatishwa ibiti bishinze buri metero, hejuru yazo harenga mm 10 ku mabuye mato yarangiye.` },
      { title: "Intambwe 2 · Ishingiro", text: `mm ${s.base} za murram cyangwa amabuye amenaguye n'ivumbi ryayo, hafi m³ ${s.m3} zisindagiye, zisindagirwa mu byiciro bibiri. Ni zo zitwara imodoka.` },
      { title: "Intambwe 3 · Amabuye mato", text: `mm ${s.gravel} z'amabuye mato y'impande ya mm 6 kugeza 14 asasa agasindagirwa mu ishingiro, ku buryo afatana ntazunguruke munsi y'amapine.` },
      { title: "Intambwe 4 · Imirongo n'ibihagarika imodoka", text: `Umurongo w'imbaho w'ubugari bwa mm 100 hagati y'imyanya yegeranye, uburebure bwa mm ${s.strips}, ufatishijwe ungana n'amabuye mato, n'igiti cy'inturusu gifatishijwe muri buri mwanya.` },
    ],
  },
  sections: { parts: "Ibice", lighting: "Amatara", drainage: "Amazi y'imvura" },
  lighting: {
    figureAlt: "Igishushanyo cy'imirongo cy'inzira yinjira kirebwa uturutse hakurya y'umuhanda, amatara yacyo afite ibimenyetso: amatara ane y'izuba hakurya y'impera ya kure ya parikingi, itara ry'izuba ku nkingi y'ibumoso y'irembo, no ku rukuta rw'icyapa icyuma cyacyo gifata izuba, agasanduku ku ruhande rwarwo rw'inyuma n'insinga y'icyuma mu bururu bwijimye, n'iy'inyuguti mu icunga inyura mu rukuta.",
    note: (link) => <>
      Amatara yose akoresha izuba (D-065): nta nsinga yambukiranya ubutaka kandi nta muferege ucukurwa. Buri tara ryo
      hasi na buri tara ryo ku nkingi rifite icyuma cyaryo gifata izuba, bateri yaryo na sensori icana nimugoroba; icyapa
      cyonyine gifite ibice byinshi, icyuma cyacyo ku mutwe w&rsquo;urukuta gisharija agasanduku kari inyuma
      y&rsquo;urukuta, na ko kakagaburira inyuguti binyuze mu rukuta. Buri kimenyetso gifungura umurongo wacyo mu{" "}
      {link("/docs/parking/lighting#points", "mbonerahamwe y'ahantu")}. Hanze y&rsquo;igishushanyo: itara
      ry&rsquo;irembo ry&rsquo;imbere (L2).
    </>,
    caption: "Byakozwe uhereye ku gishushanyo mbonera, nimugoroba: amatara yo hasi, inyuguti n'itara ry'irembo ry'inyuma byaka",
    realAlt: "Ishusho imwe izuba rimaze kurenga: ubwatsi n'ibiti byijimye, urumuri rushyushye ruzengurutse amatara ane yo hasi hakurya ya parikingi, DIGITAL FARM yaka urumuri rushyushye rwera ku rukuta rw'icyapa n'itara riri ku nkingi y'ibumoso y'irembo rimurikira inkingi, amabuye n'umuhanda imbere.",
    diagram: {
      label: (n, watts) => `Igishushanyo cy'amatara: nta nsinga kandi nta muferege. Amatara ${n} y'izuba hakurya y'impera ya kure ya parikingi n'amatara abiri yo ku nkingi, buri rimwe rifite icyuma cyaryo gifata izuba, bateri yaryo na sensori icana nimugoroba; ku cyapa, icyuma gifata izuba cya W ${watts} ku mutwe w'urukuta gisharija bateri iri mu gasanduku kadapfa n'imvura kari inyuma y'urukuta, aho charge controller na timer bigaburira driver ya V 24 y'inyuguti za LED.`,
      key: { solar: "Icyuma ku gasanduku", sign: "Inyuguti, V 24" },
      bollards: { title: (n) => `B1–B${n} · amatara yo hasi × ${n}`, sub: "icyuma, bateri, sensori, LED", sub2: "hakurya y'impera ya kure ya parikingi" },
      l1: { title: "L1 · itara", sub: "irembo ry'inyuma, inkingi y'ibumoso" },
      l2: { title: "L2 · itara", sub: "irembo ry'imbere, inkingi y'iburyo" },
      own: "buri rimwe rifite icyuma cyaryo, bateri na sensori: nta nsinga",
      sp: { title: (w) => `SP · icyuma gifata izuba, W ${w}`, sub: "ku mutwe w'urukuta rw'icyapa" },
      dc: "kimanuka ku rukuta",
      box: "EB · agasanduku ko ku rukuta rw'icyapa",
      parts: ["Charge controller + timer", "Bateri", "Driver ya LED V 24"],
      sg: { title: "SG · inyuguti z'icyapa", sub: "DIGITAL FARM, LED, V 24" },
      wall: "inyura mu rukuta",
      notes: [
        "Byaka nimugoroba, buri kimwe kicanwe na sensori yacyo; timer y'icyapa ishobora kuzimya inyuguti nijoro cyane amatara yo hasi n'ayo ku nkingi agakomeza kwaka.",
        "Ibyateganyijwe: nta tara, icyuma gifata izuba cyangwa bateri biragenerwa ingano cyangwa ngo biboneke aho kugurwa; ingufu z'inyuguti ni zo zigena icyuma n'iyo bateri",
      ],
    },
  },
  drainage: {
    figureAlt: "Igishushanyo cy'imirongo cy'inzira yinjira kirebwa uturutse hakurya y'umuhanda, kiriho imyambi y'ubuhaname: imyambi itatu miremire ku burebure bwa parikingi igana ku mpera yayo y'iburengerazuba, ibiri inyura mu irembo isubira ku muhanda n'ine yambukiranya umuhanda w'amabuye igana ku mpande zawo, umuferege w'amabuye mato mu bururu bwijimye wambukiranya impera y'iburengerazuba n'icyobo cya soakaway hafi y'uruzitiro rw'ibiti mu bururu bworoshye.",
    note: (link) => <>
      Amabuye mato yakira igice cy&rsquo;imvura aho iguye; ishingiro ryayo risindagiye rimanura igisigaye ku burebure
      bw&rsquo;ikibanza kigana ku mpera yacyo y&rsquo;iburengerazuba, rikajya mu muferege no muri soakaway. Aho imodoka
      zihindukirira hamanura amazi asubira ku muhanda, ku buryo amazi y&rsquo;umuhanda atinjira. Buri kimenyetso
      gifungura umurongo wacyo mu {link("/docs/parking/drainage#points", "mbonerahamwe y'ahantu")}. Uko ubutaka
      bunywa amazi ntibirapimwa: percolation test ikorewe ku kibanza ni yo izagena ingano y&rsquo;icyobo, cyangwa ikerekana ko
      umuferege ugomba gukomeza ukagera ku mugende.
    </>,
    caption: "Byakozwe uhereye ku gishushanyo mbonera: amabuye y'umuferege n'umupfundikizo w'icyobo ni byo byonyine bigaragara",
    realAlt: "Ishusho imwe yakozwe nk'ifoto ku manywa: parikingi y'amabuye mato izengurutswe n'imbaho, umurongo w'amabuye y'ivu wambukiranya ubwatsi ku mpera yayo y'iburengerazuba n'umupfundikizo wa beto wa mpande enye hafi y'uruzitiro rw'ibiti, urukuta rw'icyapa, irembo n'aho umuhanda w'amabuye utangirira.",
    diagram: {
      label: (gravel, base, fall, w, d, pipe, size, depth) => `Igishushanyo gikase ku burebure bwa parikingi: imvura igwa kuri mm ${gravel} z'amabuye mato ari hejuru ya mm ${base} z'ishingiro risindagiye riri kuri geotextile; ubuso bumanuka 1 kuri ${fall} bugana ku mpera y'iburengerazuba, aho umuferege w'amabuye mato w'ubugari bwa mm ${w} n'ubujyakuzimu bwa mm ${d}, uzengurutse itiyo ifite utwobo ya mm ${pipe}, ujyana amazi atemba mu cyobo cya soakaway cya m ${size} kuri ${size} n'ubujyakuzimu bwa m ${depth}.`,
      layers: ["Amabuye mato, mm 6 kugeza 14", "Ishingiro risindagiye", "Geotextile"],
      f1: (fall, mm, m) => `F1 · ikibanza kimanuka 1 kuri ${fall}, mm ${mm} kuri m ${m} zacyo, kigana ku mpera y'iburengerazuba`,
      p: "amabuye mato yakira igice cy'imvura; ishingiro risindagiye rimanura igisigaye rigana ku muferege",
      t1: (w, d, pipe) => `umuferege mm ${w} × ${d}, amabuye muri geotextile, itiyo ifite utwobo ya mm ${pipe}`,
      sk: (size, depth) => `soakaway m ${size} × ${size} × ${depth}`,
      notes: (turn, road) => [
        `Hanze y'igishushanyo gikase: F2 · aho imodoka zihindukirira h'amabuye hamanuka 1 kuri ${turn} hasubira ku muhanda rusange, ku buryo amazi y'umuhanda atinjira anyuze mu irembo · F3 · umuhanda w'amabuye uzamuye hagati, 1 kuri ${road} ugana ku mpande zawo no ku byatsi`,
        "Uburebure bushushanyije bwikubye hafi kane ugereranyije n'uburebure bw'ikibanza · soakaway izongera kugenerwa ingano nyuma ya percolation test ku kibanza · ibyateganyijwe, ntibyapimwe",
      ],
    },
  },
  docs: [
    { href: "/docs/parking", title: "Gahunda y'imirimo", text: "Buri ntambwe yo kubaka inzira yinjira: parikingi y'amabuye mato, imbaho zayo n'imirongo yayo, amatara y'izuba n'aho amazi ajya." },
    { href: "/docs/parking/materials", title: "Ibikoresho", text: "Irembo, icyapa, amabuye mato n'imbaho zayo, amabuye ya granite n'ibiti, amatara y'izuba n'iby'amazi y'imvura, buri kimwe n'ingano yacyo." },
    { href: "/docs/parking/lighting", title: "Amatara", text: "Amatara y'izuba yo hasi, ayo ku nkingi, n'icyuma n'iyo bateri by'icyapa, na buri hantu." },
    { href: "/docs/parking/drainage", title: "Amazi y'imvura", text: "Amabuye mato n'ishingiro ryayo, ubuhaname, umuferege na soakaway, na buri hantu." },
  ],
  rails: {
    gate: { title: "Irembo ry'inyuma", size: (w, h) => `mm ${w} hagati y'inkingi, inzugi z'uburebure bwa mm ${h}`,
      note: "Inzugi ebyiri z'imbaho zihagaze ku ikadiri ikomejwe na X, impeta z'icyuma cy'umukara n'agafunga, zifungukira imbere; inkingi z'amabuye za mm 600 kuri 600 munsi y'imitwe y'igiti." },
    sign: { title: "Urukuta rw'icyapa", size: (l, h, t) => `Uburebure mm ${l}, ubuhagarike mm ${h}, umubyimba mm ${t}`,
      note: "Amabuye munsi y'umutwe w'igiti; ku ruhande rureba umuhanda, icyuma cyijimye kiriho DIGITAL FARM mu nyuguti nkuru za LED z'urumuri rushyushye, icyuma cyacyo gifata izuba ku mutwe." },
    gravel: { title: "Amabuye mato n'ishingiro", size: (m2, base, top) => `m² ${m2} imbere y'imbaho: hafi m³ ${base} z'ishingiro risindagiye na m³ ${top} z'amabuye mato`,
      note: "Murram cyangwa amabuye amenaguye n'ivumbi ryayo, bisindagirwa mu byiciro bibiri, munsi y'amabuye mato y'impande ya mm 6 kugeza 14 asindagiwemo; kuri geotextile iri hasi ahacukuwe." },
    edging: { title: "Imbaho zizengurutse", size: (h, w, l, pegs) => `Imbaho za mm ${h} × ${w}, hafi m ${l} hamwe n'imirongo, ibiti bishinze ${pegs}`,
      note: "Inturusu itunganyijwe ihagaze ikikije amabuye mato, ifatishijwe buri metero, hejuru yayo harenga mm 10 ku mabuye mato; irambitse hagati y'imyanya nk'imirongo." },
    setts: { title: "Amabuye ya granite", size: "Hafi mm 100, aho imodoka zihindukirira no ku muhanda w'amabuye",
      note: "Granite y'ivu y'amabara avanze, ishyirwa n'intoki ku mucanga mu ishusho y'imiheto: kuva ku muhanda unyuze mu irembo, n'umuhanda w'amabuye ugana ku irembo ry'imbere." },
    stop: { title: (n) => `Ibihagarika imodoka × ${n}`, size: (l, d) => `Uburebure mm ${l}, umurambararo mm ${d}`,
      note: "Ibiti by'inturusu bikuweho ibishishwa bisizwe amavuta, bifatishijwe hasi mm 450 uvuye ku mpera ya kure." },
    tree: { title: (n) => `Ibiti bitanga igicucu × ${n}`, size: (h, c) => `Hafi m ${h} z'uburebure iyo biterwa, amashami atangira kuri m ${c}`,
      note: "Ibiti bito bifite amashami magari; ubwoko ntiburatoranywa (inyandiko y'ishusho ivuga neem n'umushishi)." },
    bollard: { title: (n) => `Amatara y'izuba yo hasi × ${n}`, size: (h, d) => `Uburebure mm ${h}, umurambararo mm ${d}, ku gashingiro gato`,
      note: "B1 kugeza B4 · icyuma gifata izuba hejuru, bateri, sensori icana nimugoroba na LED y'urumuri rushyushye imbere; hakurya y'impera ya kure ya parikingi, kure y'amashami y'ibiti, hagati y'imyanya no hakurya y'aho umuhanda w'amabuye utangirira." },
    lanterns: { title: "Amatara y'izuba × 2", size: "Hafi mm 140 kuri 140, uburebure bwa mm 260, icyuma gifata izuba hejuru",
      note: "L1 ku nkingi y'ibumoso y'irembo ry'inyuma, L2 ku y'iburyo y'irembo ry'imbere: buri rimwe rifite icyuma cyaryo, bateri na sensori." },
    solar: { title: "Ibikoresho by'izuba by'icyapa", size: (pw, pd, watts, bw, bh) => `Icyuma mm ${pw} × ${pd}, W ${watts}; agasanduku mm ${bw} × ${bh}, IP65`,
      note: "SP, EB · icyuma ku mutwe w'urukuta; mu gasanduku kari ku ruhande rwarwo rw'inyuma bateri, charge controller ifite timer na driver ya V 24 y'inyuguti." },
    letters: { title: "Inyuguti z'icyapa", size: (w, h) => `Icyuma cya mm ${w} × ${h}`,
      note: "SG · DIGITAL FARM mu nyuguti nkuru za LED z'urumuri rushyushye, V 24 ziva kuri driver iri mu gasanduku." },
    layers: { title: "Ibice by'ubutaka", size: (g, b, m2) => `Amabuye mato ${g}, ishingiro ${b} mm, geotextile m² ${m2}`,
      note: "P · parikingi ikase: amabuye mato asindagiwe mu ishingiro ryayo risindagiye, kuri geotextile iri hejuru y'ibumba, afashwe n'imbaho zizengurutse." },
    trench: { title: "Umuferege w'amabuye mato", size: (w, d, l, pipe) => `mm ${w} × ${d}, uburebure bwa m ${l}, itiyo ifite utwobo ya mm ${pipe}`,
      note: "T1 · wambukiranya impera y'iburengerazuba, mm 400 hanze y'impande: amabuye asukuye ya mm 20 kugeza 40 muri geotextile, amanuka 1 kuri 100 agana ku cyobo." },
    soakaway: { title: "Icyobo cya soakaway", size: (s, d) => `m ${s} × ${s}, ubujyakuzimu bwa m ${d}, umupfundikizo wa beto`,
      note: "SK · amabuye apfunyitse muri geotextile; ingano izongera kugenwa nyuma ya percolation test ku kibanza." },
  },
  points: {
    lightDrawing: "gishushanyo cy'amatara cy'inzira yinjira",
    drainDrawing: "gishushanyo cy'amazi y'imvura cy'inzira yinjira",
    B: { what: "Itara ry'izuba ryo hasi", between: (a, b) => `Hakurya y'impera ya kure, hagati y'imyanya ${a} na ${b}`, open: "Hakurya y'impera ya kure, ku ruhande rufunguye rw'umwanya 5",
      road: "Hakurya y'aho umuhanda w'amabuye utangirira", size: (h, d) => `Uburebure mm ${h}, umurambararo mm ${d}; icyuma cyaryo na bateri yaryo` },
    L1: { what: "Itara ry'izuba, irembo ry'inyuma", where: "Ku mutwe w'inkingi y'ibumoso", size: "Icyuma cyaryo gifata izuba hejuru" },
    L2: { what: "Itara ry'izuba, irembo ry'imbere", where: "Ku nkingi y'iburyo, hanze y'igishushanyo", size: "Nka L1" },
    SP: { what: "Icyuma gifata izuba cy'icyapa", where: "Ku mutwe w'urukuta rw'icyapa, hejuru y'agasanduku, gihengamiye ku ifamu", size: (w, d, watts) => `mm ${w} × ${d}, W ${watts}` },
    EB: { what: "Agasanduku ko ku rukuta rw'icyapa", where: "Ku ruhande rw'inyuma rw'urukuta ku mpera y'iburasirazuba, aho abashyitsi batanyura", size: (w, h) => `mm ${w} × ${h}, IP65; bateri, charge controller na timer, driver ya V 24` },
    SG: { what: "Inyuguti z'icyapa", where: "Uruhande rw'urukuta rureba umuhanda", size: "LED, V 24 ziva kuri driver" },
    P: { what: "Amabuye mato n'ishingiro", where: "Ikibanza cyose", size: (g, b) => `mm ${g} z'amabuye mato kuri mm ${b} z'ishingiro risindagiye: igice cy'imvura kiracengera, igisigaye kigatemba kijya ku muferege` },
    F1: { what: "Ubuhaname bw'ikibanza", where: "Ku burebure bwacyo, kuva iburasirazuba ujya iburengerazuba", size: (f, mm, m) => `1 kuri ${f}, mm ${mm} kuri m ${m}` },
    F2: { what: "Ubuhaname bw'aho imodoka zihindukirira", where: "Kuva ku irembo usubira ku muhanda rusange", size: (f) => `1 kuri ${f}` },
    F3: { what: "Hagati h'umuhanda w'amabuye hazamuye", where: "Hagana ku mpande z'amabuye ku mpande zombi", size: (f) => `1 kuri ${f}` },
    T1: { what: "Umuferege w'amabuye mato", where: "Wambukiranya impera y'iburengerazuba, hanze y'impande", size: (w, d, pipe) => `mm ${w} × ${d}, itiyo ifite utwobo ya mm ${pipe}` },
    SK: { what: "Icyobo cya soakaway", where: "Ku mpera y'amajyepfo y'umuferege, hafi y'uruzitiro rw'ibiti", size: (s, d) => `m ${s} kuri ${s}, ubujyakuzimu bwa m ${d}; ingano igenwa nyuma ya percolation test` },
  },
}

export const words: Words<typeof en> = { en, rw }
