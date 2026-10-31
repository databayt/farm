import type * as React from "react"

import type { Words } from "@/components/internationalization/words"

// Every word of the way in's page, its drawings, its rails and its docs tables (D-058): the English, then its
// Kinyarwanda, a machine draft until a native speaker reviews it. parking.json carries no words the page shows; the
// points (data.ts) are built here.
type L = (href: string, text: string) => React.ReactNode

const en = {
  meta: {
    title: "Parking · Farm",
    description: "Five bays on grass pavers under shade trees, just inside the gate and the DIGITAL FARM sign wall, at the Digital Farm near Kigali.",
  },
  hero: {
    title: "Parking on grass, just inside the gate",
    alt: "A fieldstone wall under a timber cap lettered DIGITAL FARM at golden hour, a bed of orange cannas, blue agapanthus and yellow lantana at its foot, beside two fieldstone pillars with lanterns and a honey timber gate braced in an X standing open; a fan of grey granite setts from the red dirt road through the gate onto grass pavers, a white four-by-four parked under broad acacia trees, and a sett road leading on to a second gate among tall eucalyptus.",
  },
  plan: {
    title: "Plan: a parking lawn of grass pavers 22,000 by 6,000 mm in a fieldstone edging; along its west end five bays of 2,600 mm, sett strips 4,000 mm long between them and a log wheel stop in each, cars in bays 1 and 3; 3,400 mm behind the strips the 7,600 mm sign wall, lettered DIGITAL FARM on its road face, and beside it the 4,400 mm gate, its leaves opening inward; a hedge along the boundary, a turn of setts from the public road through the gate, four shade trees, and the rock road, 4,000 mm wide, leaving the far edge for the inner gate.",
    labels: {
      stop: "WHEEL STOP", parking: "PARKING", pavers: "GRASS PAVERS", road: "ROCK ROAD", inner: "TO THE INNER GATE", gate: "GATE",
      wall: "SIGN WALL", letters: "DIGITAL FARM IN LED LETTERS", hedge: "HEDGE", tree: "SHADE TREE", public: "PUBLIC ROAD",
    },
  },
  model: {
    lineAlt: "Line drawing of the way in from beyond the public road: the hedge along the boundary, the sign wall lettered DIGITAL FARM, the gate shut between its pillars, the turn of setts, the parking with its five bays, strips and wheel stops, two cars in their bays, four shade trees and the start of the rock road.",
    realAlt: "The same view rendered in daylight: a red dirt road, a clipped green hedge, a fieldstone sign wall with DIGITAL FARM glowing in warm-white LED letters on dark steel, a timber gate braced in an X between fieldstone pillars, grey granite setts, a lawn of grass pavers in a fieldstone edging with sett strips and eucalyptus wheel stops, a white four-by-four and a silver hatchback, and young shade trees casting shadows on the grass.",
  },
  build: {
    title: "Parking",
    baseAlt: "The parking's place from straight above: the turf lifted and a box of red-brown subsoil dug out, 22 by 6 m with rounded corners, pegged at its corners and strung.",
    builds: [
      "Crushed stone spread over the box and rolled.",
      "The fieldstone edging set round it.",
      "The paver blocks laid, their cells filled with topsoil, then the grass grows up through them.",
      "Sett strips between the bays, and a wheel stop in each.",
    ],
    stages: (s: { dig: string; w: number; d: number; subbase: string; m3: number; edging: string; bedding: string; blocks: string; l: string; pw: string; cure: string; strips: string }) => [
      { title: "The ground, dug out", text: `The turf lifted and the box dug ${s.dig} mm down to firm subsoil, ${s.w} × ${s.d} m with rounded corners, pegged and strung, its floor shaped to the lot's fall.` },
      { title: "Step 1 · Sub-base", text: `${s.subbase} mm of crushed stone, about ${s.m3} m³, spread and rolled in layers. It carries the cars and holds the rain.` },
      { title: "Step 2 · Edging", text: `Fieldstone ${s.edging} mm wide set in a concrete haunch round the box, flush with the finished pavers, so they cannot creep.` },
      { title: "Step 3 · Pavers and grass", text: `${s.bedding} mm of sharp sand and topsoil, then about ${s.blocks} blocks of ${s.l} × ${s.pw} mm laid butted, cells filled with topsoil and seeded: ${s.cure}.` },
      { title: "Step 4 · Strips and stops", text: `A row of setts 100 mm wide between neighbouring bays, ${s.strips} mm long, and a eucalyptus log pinned in each bay.` },
    ],
    // parking.json build.cure, the one json sentence the page shows
    cure: (en: string) => en,
  },
  sections: { parts: "Parts", lighting: "Lighting", drainage: "Drainage" },
  lighting: {
    figureAlt: "Line drawing of the way in from beyond the road with the lighting's ducts: the feed in dark blue coming down beside the rock road and across under the parking's open end to the box behind the sign wall, the lantern cable in blue along behind the hedge and up the gate's left pillar, and the letters' link in orange through the wall.",
    note: (link: L): React.ReactNode => <>
      Every run is underground in a duct, drawn here through the wall and the gate that hide it. The circuit is the
      farm&rsquo;s outdoor lights, protected at the compound&rsquo;s board; the box on the sign wall switches it at dusk.
      Each tag opens its row in the{" "}
      {link("/docs/parking/lighting#points", "points table")}. Outside the drawing: the inner
      gate&rsquo;s lantern (L2) and the board the feed leaves from.
    </>,
    caption: "Rendered from the design model, at dusk: the letters and the outer gate's lantern lit",
    realAlt: "The same view after sunset: the lawn and the trees dark, DIGITAL FARM glowing warm white on the sign wall and the lantern on the gate's left pillar lighting the pillar, the setts and the road in front.",
    diagram: {
      label: (feed: number, lamp: number) => `Lighting diagram: the outdoor-lights circuit leaves the compound's board through its RCD and breaker, runs about ${feed} m in a buried duct down the rock road and across under the parking to a weatherproof box on the back of the sign wall; the box holds an isolator, a dusk-to-dawn photocell with a timer and the 24 V driver for the sign's LED letters, and sends a cable about ${lamp} m behind the hedge to the lantern on the outer gate's left pillar. The inner gate's lantern is on the same circuit.`,
      key: { feed: "Feed, 230 V", lamp: "Lantern circuit, 230 V", sign: "Letters, 24 V" },
      board: { title: "Compound board", sub: "RCD 30 mA + breaker", sub2: "outdoor-lights circuit" },
      l2: { title: "Lantern L2", sub: "inner gate, right pillar" },
      lf: "the feed, in a 50 mm duct 450 mm down",
      ld: (feed: number) => `about ${feed} m from the inner gate, under bay 5's sett strip`,
      box: "EB · box on the sign wall",
      parts: ["Isolator", "Photocell + timer", "24 V LED driver"],
      sg: { title: "SG · sign letters", sub: "DIGITAL FARM, LED, 24 V" },
      wall: "through the wall",
      l1: { title: "L1 · lantern", sub: "outer gate, left pillar" },
      hedge: (lamp: number) => `about ${lamp} m behind the hedge`,
      notes: [
        "On at dusk by the photocell; the timer can switch the sign off late at night while the lanterns stay on. Ducts with a draw wire and a warning tape over them; cables rise inside the pillars and the wall.",
        "Design intent: no lamp, driver or cable is sized or sourced yet, and the compound’s board is designed with the farm’s power (guide/farm/electric.md)",
      ] as [string, string],
    },
  },
  drainage: {
    figureAlt: "Line drawing of the way in from beyond the road with arrows of fall: three long arrows along the parking to its west end, two through the gate back to the road and four across the rock road to its edges, the gravel trench in dark blue across the west end and the soakaway pit by the hedge in light blue.",
    note: (link: L): React.ReactNode => <>
      The pavers and the stone under them are the drain: the rain soaks in where it falls. A storm heavier than the
      stone holds runs along the lot to its west end, into the trench and on to the soakaway. The turn sheds back to the
      road, so the road&rsquo;s water stays out. Each tag opens its row in the{" "}
      {link("/docs/parking/drainage#points", "points table")}. The soil&rsquo;s soakage is not
      tested yet: a percolation test on site sizes the pit, or says the trench must run on to a ditch.
    </>,
    caption: "Rendered from the design model: the trench's stone and the pit's cover are all that show",
    realAlt: "The same view rendered in daylight: the grass-paver parking in its fieldstone edging, a strip of grey stone across the lawn at its west end and a square concrete cover by the hedge, the sign wall, the gate and the start of the rock road.",
    diagram: {
      label: (sub: number, fall: number, w: number, d: number, pipe: number, size: number, depth: number) => `Drainage section along the parking: rain soaks through the grass pavers into ${sub} mm of crushed stone; the surface falls 1 in ${fall} to the west end, where a gravel trench ${w} mm wide and ${d} mm deep, round a ${pipe} mm perforated pipe, takes the overflow to a soakaway pit ${size} m square and ${depth} m deep.`,
      layers: ["Pavers, cells grassed", "Bedding", "Crushed-stone sub-base"],
      f1: (fall: number, mm: number, m: number) => `F1 · the lot falls 1 in ${fall}, ${mm} mm over its ${m} m, to the west end`,
      p: "the pavers and the stone are the drain: rain soaks through and is held while it seeps away",
      t1: (w: number, d: number, pipe: number) => `trench ${w} × ${d} mm, stone in geotextile, ${pipe} mm perforated pipe`,
      sk: (size: number, depth: number) => `soakaway ${size} × ${size} × ${depth} m`,
      notes: (turn: number, road: number): [string, string] => [
        `Off the section: F2 · the turn of setts falls 1 in ${turn} back to the public road, so the road’s water never runs in through the gate · F3 · the rock road is crowned, 1 in ${road} to its edgings and the grass`,
        "Heights drawn about four times the length scale · the soakaway is sized again after a percolation test on site · design intent, not surveyed",
      ],
    },
  },
  docs: [
    { href: "/docs/parking", title: "Execution plan", text: "Every step of building the way in: the green parking, its edging and strips, the lights and the drain." },
    { href: "/docs/parking/materials", title: "Materials", text: "The gate, the sign, the pavers, the setts and the trees, the lights and the drainage, each with its size." },
    { href: "/docs/parking/lighting", title: "Lighting", text: "The feed down the rock road, the box on the sign wall, the lanterns and the letters, with every point." },
    { href: "/docs/parking/drainage", title: "Drainage", text: "The pavers and the sub-base as the drain, the falls, the trench and the soakaway, with every point." },
  ],
  rails: {
    gate: { title: "Outer gate", size: (w: string, h: string) => `${w} between the pillars, leaves ${h} high`,
      note: "Two timber leaves of vertical boards on a frame braced in an X, black iron strap hinges and a latch, opening inward; fieldstone pillars 600 mm square under timber caps." },
    sign: { title: "Sign wall", size: (l: string, h: string, t: string) => `${l} long, ${h} high, ${t} thick`,
      note: "Fieldstone under a timber cap; on its road face a dark steel panel with DIGITAL FARM in warm-white LED capitals." },
    lantern: { title: "Pillar lantern", size: "About 140 mm square, 260 mm high, on the pillar's cap",
      note: "L1 on the outer gate's left pillar, L2 on the inner gate's right one: outdoor-rated, on the dusk-to-dawn circuit below." },
    pavers: { title: "Grass pavers", size: (l: string, w: string, h: string, m2: number, n: string) => `${l} × ${w} × ${h} mm blocks, ${m2} m², about ${n} blocks`,
      note: "Concrete blocks with sixteen open cells, laid butted on the bedding, the cells filled with topsoil and seeded. Shown with the front row not yet grown." },
    setts: { title: "Granite setts", size: (n: number) => `About 100 mm; ${n} in the bay strips, and the turn and the rock road`,
      note: "Grey granite in mixed tones, laid by hand on sand: in segmental arcs on the turn and the rock road, in single rows between the bays." },
    stop: { title: (n: number) => `Wheel stops × ${n}`, size: (l: string, d: string) => `${l} long, ${d} across`,
      note: "Barked and oiled eucalyptus logs, pinned to the ground 450 mm from the far edge." },
    tree: { title: (n: number) => `Shade trees × ${n}`, size: (h: number, c: number) => `About ${h} m tall at planting, the crown from ${c} m`,
      note: "Young broad-canopied trees; the species is not chosen yet (the render brief names neem and acacia)." },
    enclosure: { title: "Box on the sign wall", size: (w: string, h: string, d: string) => `${w} × ${h} × ${d} mm, IP65`,
      note: "EB · an isolator, a dusk-to-dawn photocell with a timer, and the 24 V driver for the letters; the ducts come up into it from below." },
    letters: { title: "Sign letters", size: (w: string, h: string) => `Panel ${w} × ${h} mm`,
      note: "SG · DIGITAL FARM in warm-white LED capitals at 24 V from the driver in the box." },
    lanterns: { title: "Lanterns × 2", size: "About 140 mm square, 260 mm high",
      note: "L1 on the outer gate, fed from the box; L2 on the inner gate, teed off the feed on its way down." },
    duct: { title: "Duct and cable", size: (d: string, m: number, depth: string) => `${d} mm duct, about ${m} m, ${depth} mm down`,
      note: "LF, LD · outdoor armoured cable in a buried duct with a draw wire, a warning tape laid over it." },
    layers: { title: "The build-up", size: (p: string, b: string, s: string) => `Pavers ${p}, bedding ${b}, sub-base ${s} mm`,
      note: (m3: number) => `P · the parking cut open: about ${m3} m³ of crushed stone under the pavers holds the rain while it soaks away.` },
    open: { size: (m2: number) => `${m2} m² of open cells`, note: "P · the rain falls through the grass in the cells, so the lot needs no gully." },
    trench: { title: "Gravel trench", size: (w: string, d: string, l: string, pipe: string) => `${w} × ${d} mm, ${l} m long, a ${pipe} mm perforated pipe`,
      note: "T1 · across the west end, 400 mm outside the edging: clean 20 to 40 mm stone in geotextile, falling 1 in 100 to the pit." },
    soakaway: { title: "Soakaway pit", size: (s: number, d: number) => `${s} × ${s} m, ${d} m deep, a slab cover`,
      note: "SK · stone in a geotextile wrap; sized again after a percolation test on site." },
  },
  // the points (data.ts), for the tags and the docs tables
  points: {
    lightDrawing: "way in's lighting drawing",
    drainDrawing: "way in's drainage drawing",
    LF: { what: "Feed", where: "From the compound's board, down the lawn beside the rock road; it enters the drawing at the road's far end", size: (d: string, depth: string) => `In a ${d} mm duct, ${depth} mm down` },
    LD: { what: "Duct across the parking", where: "Under the sett strip on bay 5's open side, then behind the sign wall", size: (m: number) => `About ${m} m from the inner gate to the box` },
    EB: { what: "Box on the sign wall", where: "On the wall's back face at its east end, out of the guests' way", size: (w: string, h: string) => `${w} × ${h} mm, IP65; isolator, photocell and timer, 24 V driver` },
    SG: { what: "Sign letters", where: "The wall's road face", size: "LED, 24 V from the driver" },
    L1: { what: "Lantern, outer gate", where: "On the left pillar's cap; its cable behind the hedge and up inside the pillar", size: (m: number) => `About ${m} m from the box` },
    L2: { what: "Lantern, inner gate", where: "On the right pillar, off the drawing; teed off the feed", size: "As L1" },
    P: { what: "Pavers and sub-base", where: "The whole lot", size: (s: string) => `Rain soaks through the cells into ${s} mm of stone` },
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
    description: "Imyanya itanu ku mapave y'ibyatsi munsi y'ibiti bitanga igicucu, imbere gato y'irembo n'urukuta ruriho icyapa DIGITAL FARM, kuri Digital Farm hafi ya Kigali.",
  },
  hero: {
    title: "Parikingi ku byatsi, imbere gato y'irembo",
    alt: "Urukuta rw'amabuye rufite umutwe w'igiti, ruriho inyuguti DIGITAL FARM ku zuba rirenga, akarima k'indabo za canna z'icunga, agapanthe z'ubururu na lantana z'umuhondo munsi yarwo, iruhande rw'inkingi ebyiri z'amabuye ziriho amatara n'irembo ry'igiti cy'ibara ry'ubuki rikomejwe na X rifunguye; amabuye ya granite y'ivu atatanye nk'umufana kuva ku muhanda w'itaka utukura anyura mu irembo agera ku mapave y'ibyatsi, imodoka y'umweru ya 4×4 iparitse munsi y'imishishi migari, n'umuhanda w'amabuye ugana ku irembo rya kabiri hagati y'inturusu ndende.",
  },
  plan: {
    title: "Igishushanyo: parikingi y'ibyatsi ku mapave ya mm 22,000 kuri 6,000 izengurutswe n'impande z'amabuye; ku mpera yayo y'iburengerazuba imyanya itanu ya mm 2,600, imirongo y'amabuye ya mm 4,000 hagati yayo n'igiti gihagarika imodoka muri buri mwanya, imodoka mu myanya 1 na 3; mm 3,400 inyuma y'imirongo urukuta ruriho icyapa rwa mm 7,600, ruriho inyuguti DIGITAL FARM ku ruhande rureba umuhanda, n'iruhande rwarwo irembo rya mm 4,400, inzugi zaryo zifungukira imbere; uruzitiro rw'ibiti ku rubibi, aho imodoka zihindukirira h'amabuye kuva ku muhanda rusange unyuze mu irembo, ibiti bine bitanga igicucu, n'umuhanda w'amabuye ufite ubugari bwa mm 4,000, uva ku mpera ya kure ugana ku irembo ry'imbere.",
    labels: {
      stop: "IGIHAGARIKA IMODOKA", parking: "PARIKINGI", pavers: "AMAPAVE Y'IBYATSI", road: "UMUHANDA W'AMABUYE", inner: "KU IREMBO RY'IMBERE", gate: "IREMBO",
      wall: "URUKUTA RW'ICYAPA", letters: "DIGITAL FARM MU NYUGUTI ZA LED", hedge: "URUZITIRO RW'IBITI", tree: "IGITI CY'IGICUCU", public: "UMUHANDA RUSANGE",
    },
  },
  model: {
    lineAlt: "Igishushanyo cy'imirongo cy'inzira yinjira kirebwa uturutse hakurya y'umuhanda rusange: uruzitiro rw'ibiti ku rubibi, urukuta ruriho icyapa DIGITAL FARM, irembo rifunze hagati y'inkingi zaryo, aho imodoka zihindukirira h'amabuye, parikingi n'imyanya yayo itanu, imirongo n'ibihagarika imodoka, imodoka ebyiri mu myanya yazo, ibiti bine bitanga igicucu n'aho umuhanda w'amabuye utangirira.",
    realAlt: "Ishusho imwe yakozwe nk'ifoto ku manywa: umuhanda w'itaka utukura, uruzitiro rw'ibiti rutoshye rukaswe, urukuta rw'amabuye ruriho DIGITAL FARM yaka mu nyuguti za LED z'urumuri rushyushye ku cyuma cyijimye, irembo ry'igiti rikomejwe na X hagati y'inkingi z'amabuye, amabuye ya granite y'ivu, ubwatsi ku mapave buzengurutswe n'impande z'amabuye bufite imirongo y'amabuye n'ibihagarika imodoka by'inturusu, imodoka y'umweru ya 4×4 n'indi nto y'ifeza, n'ibiti bito bitanga igicucu ku byatsi.",
  },
  build: {
    title: "Parikingi",
    baseAlt: "Aho parikingi izaba harebwa uturutse hejuru neza: ubwatsi bwakuweho n'ahantu h'ubutaka butukura-bwijimye hacukuwe, m 22 kuri 6 hafite imfuruka zihetamye, hashyizweho ibimenyetso mu mfuruka hagakururwa imigozi.",
    builds: [
      "Amabuye amenaguye asasa ahacukuwe agasindagirwa.",
      "Impande z'amabuye zishyirwa hazengurutse.",
      "Amapave ashyirwaho, imyobo yayo yuzuzwa ubutaka bwo hejuru, hanyuma ubwatsi bukazamuka buyinyuramo.",
      "Imirongo y'amabuye hagati y'imyanya, n'igihagarika imodoka muri buri mwanya.",
    ],
    stages: (s) => [
      { title: "Ubutaka, bucukuwe", text: `Ubwatsi bukurwaho, hagacukurwa mm ${s.dig} kugeza ku butaka bukomeye, m ${s.w} × ${s.d} hafite imfuruka zihetamye, hashyizweho ibimenyetso n'imigozi, hasi hagatunganywa hakurikije ubuhaname bw'ikibanza.` },
      { title: "Intambwe 1 · Sub-base", text: `mm ${s.subbase} z'amabuye amenaguye, hafi m³ ${s.m3}, asaswa agasindagirwa mu byiciro. Atwara imodoka kandi akabika imvura.` },
      { title: "Intambwe 2 · Impande", text: `Amabuye y'ubugari bwa mm ${s.edging} ashyirwa muri beto ahazengurutse, angana n'amapave yarangiye, kugira ngo atanyerera.` },
      { title: "Intambwe 3 · Amapave n'ubwatsi", text: `mm ${s.bedding} z'umucanga ukomeye n'ubutaka bwo hejuru, hanyuma amapave hafi ${s.blocks} ya mm ${s.l} × ${s.pw} yegeranye, imyobo yuzuzwa ubutaka bwo hejuru igaterwamo imbuto: ${s.cure}.` },
      { title: "Intambwe 4 · Imirongo n'ibihagarika imodoka", text: `Umurongo w'amabuye y'ubugari bwa mm 100 hagati y'imyanya yegeranye, uburebure bwa mm ${s.strips}, n'igiti cy'inturusu gifatishijwe muri buri mwanya.` },
    ],
    cure: () => "ibyumweru 6 kugeza 8 by'imvura cyangwa byo kuvomera mbere y'uko imodoka ziparika ku bwatsi",
  },
  sections: { parts: "Ibice", lighting: "Amatara", drainage: "Amazi y'imvura" },
  lighting: {
    figureAlt: "Igishushanyo cy'imirongo cy'inzira yinjira kirebwa uturutse hakurya y'umuhanda, kiriho duct z'amatara: insinga iyigaburira mu bururu bwijimye imanuka iruhande rw'umuhanda w'amabuye ikambukiranya munsi y'impera ifunguye ya parikingi igana ku gasanduku kari inyuma y'urukuta rw'icyapa, insinga y'itara mu bururu inyura inyuma y'uruzitiro rw'ibiti ikazamuka mu nkingi y'ibumoso y'irembo, n'iy'inyuguti mu icunga inyura mu rukuta.",
    note: (link) => <>
      Buri nsinga inyura mu butaka muri duct, hano ishushanyije inyuze mu rukuta no mu irembo biyihisha. Umuzunguruko ni
      uw&rsquo;amatara yo hanze y&rsquo;ifamu, urindwa kuri board y&rsquo;urugo; agasanduku ko ku rukuta rw&rsquo;icyapa karawucana nimugoroba.
      Buri kimenyetso gifungura umurongo wacyo mu{" "}
      {link("/docs/parking/lighting#points", "mbonerahamwe y'ahantu")}. Hanze y&rsquo;igishushanyo: itara ry&rsquo;irembo
      ry&rsquo;imbere (L2) na board insinga iyigaburira ivaho.
    </>,
    caption: "Byakozwe uhereye ku gishushanyo mbonera, nimugoroba: inyuguti n'itara ry'irembo ry'inyuma byaka",
    realAlt: "Ishusho imwe izuba rimaze kurenga: ubwatsi n'ibiti byijimye, DIGITAL FARM yaka urumuri rushyushye rwera ku rukuta rw'icyapa n'itara riri ku nkingi y'ibumoso y'irembo rimurikira inkingi, amabuye n'umuhanda imbere.",
    diagram: {
      label: (feed, lamp) => `Igishushanyo cy'amatara: umuzunguruko w'amatara yo hanze uva kuri board y'urugo unyuze muri RCD na disijonkitere yawo, ukagenda hafi m ${feed} muri duct ishyinguye ku muhanda w'amabuye no munsi ya parikingi ukagera ku gasanduku kadapfa n'imvura kari inyuma y'urukuta rw'icyapa; agasanduku karimo isolator, photocell icana nimugoroba ikazimya mu gitondo ifite timer, na driver ya V 24 y'inyuguti za LED z'icyapa, kandi kohereza insinga ya hafi m ${lamp} inyuma y'uruzitiro rw'ibiti ku itara riri ku nkingi y'ibumoso y'irembo ry'inyuma. Itara ry'irembo ry'imbere riri ku muzunguruko umwe.`,
      key: { feed: "Iyigaburira, V 230", lamp: "Umuzunguruko w'amatara, V 230", sign: "Inyuguti, V 24" },
      board: { title: "Board y'urugo", sub: "RCD mA 30 + disijonkitere", sub2: "umuzunguruko w'amatara yo hanze" },
      l2: { title: "Itara L2", sub: "irembo ry'imbere, inkingi y'iburyo" },
      lf: "iyigaburira, muri duct ya mm 50 iri mm 450 mu butaka",
      ld: (feed) => `hafi m ${feed} uvuye ku irembo ry'imbere, munsi y'umurongo w'amabuye w'umwanya 5`,
      box: "EB · agasanduku ko ku rukuta rw'icyapa",
      parts: ["Isolator", "Photocell + timer", "Driver ya LED V 24"],
      sg: { title: "SG · inyuguti z'icyapa", sub: "DIGITAL FARM, LED, V 24" },
      wall: "inyura mu rukuta",
      l1: { title: "L1 · itara", sub: "irembo ry'inyuma, inkingi y'ibumoso" },
      hedge: (lamp) => `hafi m ${lamp} inyuma y'uruzitiro rw'ibiti`,
      notes: [
        "Byaka nimugoroba bicanwe na photocell; timer ishobora kuzimya icyapa nijoro cyane amatara agakomeza kwaka. Duct zifite insinga yo gukurura na tape y'umuburo hejuru yazo; insinga zizamuka imbere mu nkingi no mu rukuta.",
        "Ibyateganyijwe: nta tara, driver cyangwa insinga biragenerwa ingano cyangwa ngo biboneke aho kugurwa, kandi board y'urugo itegurwa hamwe n'amashanyarazi y'ifamu (guide/farm/electric.md)",
      ],
    },
  },
  drainage: {
    figureAlt: "Igishushanyo cy'imirongo cy'inzira yinjira kirebwa uturutse hakurya y'umuhanda, kiriho imyambi y'ubuhaname: imyambi itatu miremire ku burebure bwa parikingi igana ku mpera yayo y'iburengerazuba, ibiri inyura mu irembo isubira ku muhanda n'ine yambukiranya umuhanda w'amabuye igana ku mpande zawo, umuferege w'amabuye mato mu bururu bwijimye wambukiranya impera y'iburengerazuba n'icyobo cya soakaway hafi y'uruzitiro rw'ibiti mu bururu bworoshye.",
    note: (link) => <>
      Amapave n&rsquo;amabuye ari munsi yayo ni yo ayobora amazi: imvura icengera aho iguye. Imvura nyinshi irenze ibyo amabuye
      abika itemba ku burebure bw&rsquo;ikibanza igana ku mpera yacyo y&rsquo;iburengerazuba, ikajya mu muferege no muri soakaway.
      Aho imodoka zihindukirira hamanura amazi asubira ku muhanda, ku buryo amazi y&rsquo;umuhanda atinjira. Buri kimenyetso
      gifungura umurongo wacyo mu {link("/docs/parking/drainage#points", "mbonerahamwe y'ahantu")}. Uko ubutaka
      bunywa amazi ntibirapimwa: percolation test ikorewe ku kibanza ni yo izagena ingano y&rsquo;icyobo, cyangwa ikerekana ko
      umuferege ugomba gukomeza ukagera ku mugende.
    </>,
    caption: "Byakozwe uhereye ku gishushanyo mbonera: amabuye y'umuferege n'umupfundikizo w'icyobo ni byo byonyine bigaragara",
    realAlt: "Ishusho imwe yakozwe nk'ifoto ku manywa: parikingi y'amapave y'ibyatsi izengurutswe n'impande z'amabuye, umurongo w'amabuye y'ivu wambukiranya ubwatsi ku mpera yayo y'iburengerazuba n'umupfundikizo wa beto wa mpande enye hafi y'uruzitiro rw'ibiti, urukuta rw'icyapa, irembo n'aho umuhanda w'amabuye utangirira.",
    diagram: {
      label: (sub, fall, w, d, pipe, size, depth) => `Igishushanyo gikase ku burebure bwa parikingi: imvura icengera mu mapave y'ibyatsi ikajya muri mm ${sub} z'amabuye amenaguye; ubuso bumanuka 1 kuri ${fall} bugana ku mpera y'iburengerazuba, aho umuferege w'amabuye mato w'ubugari bwa mm ${w} n'ubujyakuzimu bwa mm ${d}, uzengurutse itiyo ifite utwobo ya mm ${pipe}, ujyana amazi arenze mu cyobo cya soakaway cya m ${size} kuri ${size} n'ubujyakuzimu bwa m ${depth}.`,
      layers: ["Amapave, imyobo irimo ubwatsi", "Uburiri", "Sub-base y'amabuye amenaguye"],
      f1: (fall, mm, m) => `F1 · ikibanza kimanuka 1 kuri ${fall}, mm ${mm} kuri m ${m} zacyo, kigana ku mpera y'iburengerazuba`,
      p: "amapave n'amabuye ni yo ayobora amazi: imvura icengeramo ikabikwa igihe igenda yinjira mu butaka",
      t1: (w, d, pipe) => `umuferege mm ${w} × ${d}, amabuye muri geotextile, itiyo ifite utwobo ya mm ${pipe}`,
      sk: (size, depth) => `soakaway m ${size} × ${size} × ${depth}`,
      notes: (turn, road) => [
        `Hanze y'igishushanyo gikase: F2 · aho imodoka zihindukirira h'amabuye hamanuka 1 kuri ${turn} hasubira ku muhanda rusange, ku buryo amazi y'umuhanda atinjira anyuze mu irembo · F3 · umuhanda w'amabuye uzamuye hagati, 1 kuri ${road} ugana ku mpande zawo no ku byatsi`,
        "Uburebure bushushanyije bwikubye hafi kane ugereranyije n'uburebure bw'ikibanza · soakaway izongera kugenerwa ingano nyuma ya percolation test ku kibanza · ibyateganyijwe, ntibyapimwe",
      ],
    },
  },
  docs: [
    { href: "/docs/parking", title: "Gahunda y'imirimo", text: "Buri ntambwe yo kubaka inzira yinjira: parikingi y'ibyatsi, impande zayo n'imirongo yayo, amatara n'aho amazi ajya." },
    { href: "/docs/parking/materials", title: "Ibikoresho", text: "Irembo, icyapa, amapave, amabuye ya granite n'ibiti, amatara n'iby'amazi y'imvura, buri kimwe n'ingano yacyo." },
    { href: "/docs/parking/lighting", title: "Amatara", text: "Insinga iyigaburira ku muhanda w'amabuye, agasanduku ko ku rukuta rw'icyapa, amatara n'inyuguti, na buri hantu." },
    { href: "/docs/parking/drainage", title: "Amazi y'imvura", text: "Amapave na sub-base biyobora amazi, ubuhaname, umuferege na soakaway, na buri hantu." },
  ],
  rails: {
    gate: { title: "Irembo ry'inyuma", size: (w, h) => `mm ${w} hagati y'inkingi, inzugi z'uburebure bwa mm ${h}`,
      note: "Inzugi ebyiri z'imbaho zihagaze ku ikadiri ikomejwe na X, impeta z'icyuma cy'umukara n'agafunga, zifungukira imbere; inkingi z'amabuye za mm 600 kuri 600 munsi y'imitwe y'igiti." },
    sign: { title: "Urukuta rw'icyapa", size: (l, h, t) => `Uburebure mm ${l}, ubuhagarike mm ${h}, umubyimba mm ${t}`,
      note: "Amabuye munsi y'umutwe w'igiti; ku ruhande rureba umuhanda, icyuma cyijimye kiriho DIGITAL FARM mu nyuguti nkuru za LED z'urumuri rushyushye." },
    lantern: { title: "Itara ryo ku nkingi", size: "Hafi mm 140 kuri 140, uburebure bwa mm 260, ku mutwe w'inkingi",
      note: "L1 ku nkingi y'ibumoso y'irembo ry'inyuma, L2 ku y'iburyo y'irembo ry'imbere: rikorera hanze, ku muzunguruko ucana nimugoroba ukazimya mu gitondo uri hepfo." },
    pavers: { title: "Amapave y'ibyatsi", size: (l, w, h, m2, n) => `Amapave ya mm ${l} × ${w} × ${h}, m² ${m2}, hafi amapave ${n}`,
      note: "Amapave ya beto afite imyobo cumi n'itandatu ifunguye, ashyirwa yegeranye ku buriri, imyobo yuzuzwa ubutaka bwo hejuru igaterwamo imbuto. Ashushanyije umurongo w'imbere ubwatsi butarakura." },
    setts: { title: "Amabuye ya granite", size: (n) => `Hafi mm 100; ${n} mu mirongo y'imyanya, n'aho imodoka zihindukirira n'umuhanda w'amabuye`,
      note: "Granite y'ivu y'amabara avanze, ishyirwa n'intoki ku mucanga: mu ishusho y'imiheto aho imodoka zihindukirira no ku muhanda w'amabuye, mu murongo umwe hagati y'imyanya." },
    stop: { title: (n) => `Ibihagarika imodoka × ${n}`, size: (l, d) => `Uburebure mm ${l}, umurambararo mm ${d}`,
      note: "Ibiti by'inturusu bikuweho ibishishwa bisizwe amavuta, bifatishijwe hasi mm 450 uvuye ku mpera ya kure." },
    tree: { title: (n) => `Ibiti bitanga igicucu × ${n}`, size: (h, c) => `Hafi m ${h} z'uburebure iyo biterwa, amashami atangira kuri m ${c}`,
      note: "Ibiti bito bifite amashami magari; ubwoko ntiburatoranywa (inyandiko y'ishusho ivuga neem n'umushishi)." },
    enclosure: { title: "Agasanduku ko ku rukuta rw'icyapa", size: (w, h, d) => `mm ${w} × ${h} × ${d}, IP65`,
      note: "EB · isolator, photocell icana nimugoroba ifite timer, na driver ya V 24 y'inyuguti; duct ziyinjiramo ziturutse hasi." },
    letters: { title: "Inyuguti z'icyapa", size: (w, h) => `Icyuma cya mm ${w} × ${h}`,
      note: "SG · DIGITAL FARM mu nyuguti nkuru za LED z'urumuri rushyushye, V 24 ziva kuri driver iri mu gasanduku." },
    lanterns: { title: "Amatara × 2", size: "Hafi mm 140 kuri 140, uburebure bwa mm 260",
      note: "L1 ku irembo ry'inyuma, rigaburirwa n'agasanduku; L2 ku irembo ry'imbere, rifashe ku nsinga iyigaburira mu nzira yayo." },
    duct: { title: "Duct n'insinga", size: (d, m, depth) => `Duct ya mm ${d}, hafi m ${m}, mm ${depth} mu butaka`,
      note: "LF, LD · insinga ikomejwe yo hanze muri duct ishyinguye ifite insinga yo gukurura, na tape y'umuburo hejuru yayo." },
    layers: { title: "Ibice by'ubutaka", size: (p, b, s) => `Amapave ${p}, uburiri ${b}, sub-base ${s} mm`,
      note: (m3) => `P · parikingi ikase: hafi m³ ${m3} z'amabuye amenaguye munsi y'amapave zibika imvura igihe icengera.` },
    open: { size: (m2) => `m² ${m2} z'imyobo ifunguye`, note: "P · imvura inyura mu byatsi biri mu myobo, bityo ikibanza ntigikenera umuyoboro w'amazi." },
    trench: { title: "Umuferege w'amabuye mato", size: (w, d, l, pipe) => `mm ${w} × ${d}, uburebure bwa m ${l}, itiyo ifite utwobo ya mm ${pipe}`,
      note: "T1 · wambukiranya impera y'iburengerazuba, mm 400 hanze y'impande: amabuye asukuye ya mm 20 kugeza 40 muri geotextile, amanuka 1 kuri 100 agana ku cyobo." },
    soakaway: { title: "Icyobo cya soakaway", size: (s, d) => `m ${s} × ${s}, ubujyakuzimu bwa m ${d}, umupfundikizo wa beto`,
      note: "SK · amabuye apfunyitse muri geotextile; ingano izongera kugenwa nyuma ya percolation test ku kibanza." },
  },
  points: {
    lightDrawing: "gishushanyo cy'amatara cy'inzira yinjira",
    drainDrawing: "gishushanyo cy'amazi y'imvura cy'inzira yinjira",
    LF: { what: "Insinga iyigaburira", where: "Iva kuri board y'urugo, imanuka mu byatsi iruhande rw'umuhanda w'amabuye; yinjira mu gishushanyo ku mpera ya kure y'umuhanda", size: (d, depth) => `Muri duct ya mm ${d}, mm ${depth} mu butaka` },
    LD: { what: "Duct yambukiranya parikingi", where: "Munsi y'umurongo w'amabuye ku ruhande rufunguye rw'umwanya 5, hanyuma inyuma y'urukuta rw'icyapa", size: (m) => `Hafi m ${m} uvuye ku irembo ry'imbere kugeza ku gasanduku` },
    EB: { what: "Agasanduku ko ku rukuta rw'icyapa", where: "Ku ruhande rw'inyuma rw'urukuta ku mpera y'iburasirazuba, aho abashyitsi batanyura", size: (w, h) => `mm ${w} × ${h}, IP65; isolator, photocell na timer, driver ya V 24` },
    SG: { what: "Inyuguti z'icyapa", where: "Uruhande rw'urukuta rureba umuhanda", size: "LED, V 24 ziva kuri driver" },
    L1: { what: "Itara, irembo ry'inyuma", where: "Ku mutwe w'inkingi y'ibumoso; insinga yaryo inyura inyuma y'uruzitiro rw'ibiti ikazamuka imbere mu nkingi", size: (m) => `Hafi m ${m} uvuye ku gasanduku` },
    L2: { what: "Itara, irembo ry'imbere", where: "Ku nkingi y'iburyo, hanze y'igishushanyo; rifashe ku nsinga iyigaburira", size: "Nka L1" },
    P: { what: "Amapave na sub-base", where: "Ikibanza cyose", size: (s) => `Imvura icengera mu myobo ikajya muri mm ${s} z'amabuye` },
    F1: { what: "Ubuhaname bw'ikibanza", where: "Ku burebure bwacyo, kuva iburasirazuba ujya iburengerazuba", size: (f, mm, m) => `1 kuri ${f}, mm ${mm} kuri m ${m}` },
    F2: { what: "Ubuhaname bw'aho imodoka zihindukirira", where: "Kuva ku irembo usubira ku muhanda rusange", size: (f) => `1 kuri ${f}` },
    F3: { what: "Hagati h'umuhanda w'amabuye hazamuye", where: "Hagana ku mpande z'amabuye ku mpande zombi", size: (f) => `1 kuri ${f}` },
    T1: { what: "Umuferege w'amabuye mato", where: "Wambukiranya impera y'iburengerazuba, hanze y'impande", size: (w, d, pipe) => `mm ${w} × ${d}, itiyo ifite utwobo ya mm ${pipe}` },
    SK: { what: "Icyobo cya soakaway", where: "Ku mpera y'amajyepfo y'umuferege, hafi y'uruzitiro rw'ibiti", size: (s, d) => `m ${s} kuri ${s}, ubujyakuzimu bwa m ${d}; ingano igenwa nyuma ya percolation test` },
  },
}

export const words: Words<typeof en> = { en, rw }
