import type * as React from "react"

import type { Words } from "@/components/internationalization/words"
import type { Circuit, ElectricPoint, WaterPoint, WaterRun } from "@/components/galley/service-diagrams"

// Every word of the bar's page, its drawings, its rails and its docs tables (D-058): the English, then its
// Kinyarwanda, a machine draft until a native speaker reviews it. bar.json keeps its English for the render scripts;
// `json` lays the Kinyarwanda over its rows by id (data.ts).
type L = (href: string, text: string) => React.ReactNode

const en = {
  meta: {
    title: "The bar · Farm",
    description: "Coffee and drinks from a red container bar on the courtyard, with deep chairs on its deck, at the Digital Farm near Kigali.",
  },
  hero: {
    title: "Coffee at the hatch, a drink on the deck",
    alt: "An oxide-red shipping container on a fieldstone plinth at golden hour, its long hatch open under a timber canopy on black steel struts: inside, lit shelves of cups, glasses, jars and plain bottles, an espresso machine and grinder, a juicer and crates of oranges, pineapples and tree tomatoes; outside, a timber counter on black brackets with five high stools on a timber deck with one step down to the lawn, among avocado and banana trees.",
  },
  plan: {
    title: "Plan: a 20 ft container 6,058 by 2,438 mm on a stone plinth, a 2,600 mm hatch in the courtyard wall with the flap propped out over today's steel ledge; a 6,000 mm deck along it, clear in front of the hatch with a step down to the lawn, and at each end two deep chairs and a low table; inside, a work counter under the hatch with a cupboard, two fridges, a sink and drawers, a back bar with the coffee machine and grinder under three shelves, a tall store cupboard, and the cargo doors at the north end as the way in.",
    labels: { fridges: "FRIDGES", sink: "SINK", coffee: "COFFEE", store: "STORE", ledge: "LEDGE", step: "STEP", deck: "DECK", lounge: "LOUNGE", hatch: "HATCH", backBar: "BACK BAR", wayIn: "WAY IN", doors: "doors" },
  },
  model: {
    lineAlt: "Line drawing of the bar from the courtyard with the roof off: the container on its plinth, the flap propped open over the hatch and its steel ledge, the deck along the box with two deep chairs and a low table at each end, and inside the back bar with the coffee machine and three shelves of cups, jars and bottles.",
    realAlt: "The same view rendered: oxide-red corrugated steel, a warm light under the flap, Medium Oak counters and shelves lit from beneath, a steel espresso machine, and hardwood chairs with canvas cushions round two low tables on a timber deck on the lawn.",
  },
  electric: {
    notes: (kw: number): [string, string] => [
      `About ${kw} kW connected; the power guide gives the bar 5 kWh a day and a 5 kW peak, the coffee machine's 3 to 4 kW among it`,
      "TT earthing on the bar's own rod (E1) · ratings are design intent until a RURA class A electrician certifies",
    ],
    label: (n: number) => `Single-line diagram: the farm's site board at 230 volts into a 40 amp main switch with surge protection, then one RCBO for each of ${n} circuits: the lights inside, the back bar's sockets, the coffee machine, the fridges, the water heater, the light under the flap, and a spare.`,
    figureAlt: "Line drawing of the bar from the courtyard, lower, with the hatch wall and the deck left out: the board on the back wall by the way in, every circuit rising into the ceiling along its own track and down to the ceiling lights and shelf strips in blue, the sockets in orange, and the coffee machine's and the heater's spurs in green.",
    note: (link: L): React.ReactNode => <>
      Every circuit rises from the board into the ceiling, runs along its own track and drops straight to its device.
      Each tag opens its row in the {link("/docs/bar/electric#points", "points table")}.
      Outside the drawing: the supply comes in buried from the farm&rsquo;s site board, the light bar (L5) is under the
      flap, left out with the hatch wall, and the earth rod (E1) is in a pit outside the north end.
    </>,
    caption: "Rendered from the design model, the hatch wall left out and the units opened",
    realAlt: "The same view rendered with the hatch wall left out: white conduit along the ceiling and down the walls to the board by the way in, the ceiling lights, the sockets over the back bar, and the spurs beside the coffee machine and in the sink unit.",
  },
  water: {
    valve: { title: "Stop valve", sub: "filter · meter" },
    heater: (litres: number) => ({ title: `Heater ${litres} L`, sub: "under the sink" }),
    outlets: {
      SF: { title: "Scale filter", sub: "for the machine" },
      EM: { title: "Coffee machine", sub: "feed · drip tray" },
      ST: { title: "Sink", sub: "mixer" },
    },
    trap: { title: "Grease trap", sub: "outside the south end" },
    notes: [
      "Pressure 2.5 to 3 bar from the farm's booster pump · every drain at 1:40 or steeper · the bar's water never reaches the septic tank",
      "Sizes are design intent until the plumber checks them · nothing sourced or priced yet",
    ] as [string, string],
    label: "Water diagram: the farm's water through the bar's stop valve, filter and meter in the back bar's cupboard; cold through a scale filter to the coffee machine and under the floor to the sink unit, where a 15 litre heater gives the sink its hot; the sink and the machine's drip tray drain to a collector, a small grease trap and a soak pit.",
    figureAlt: "Line drawing of the bar from the courtyard, lower, with the hatch wall and the deck left out and the units opened, the fit-out in grey: the main dashed under the south end to the valve set under the coffee machine, the scale filter beside it, cold dashed under the floor across the aisle to the sink unit with its small heater, hot in red up to the mixer, and the drains dashed under the floor to the grease trap outside the south end.",
    note: (link: L): React.ReactNode => <>
      Supplies cross the aisle under the floor and rise straight into the units; drains drop through the floor and fall
      to the grease trap, dashed where the floor hides them. The hatch wall and the deck are left out and the units
      drawn open, so the pipes show. Each tag opens its row in the{" "}
      {link("/docs/bar/plumbing#points", "points table")}. Outside the drawing: the main
      comes in from the farm&rsquo;s tank and booster pump, and the grease trap (GT) empties to a soak pit (SP).
    </>,
    caption: "Rendered from the design model, the hatch wall left out and the units opened",
    realAlt: "The same view rendered with the hatch wall left out and the units opened: the blue meter and the white scale filter under the coffee machine, green pipes up into the sink unit, the white under-sink heater, and the grease trap's lid on the lawn by the south end.",
  },
  docs: [
    { href: "/docs/bar", title: "Execution plan", text: "Every step of fitting out the bar, from the survey to the first night it opens." },
    { href: "/docs/bar/materials", title: "Materials", text: "The equipment, each electric device and each plumbing part, with its size, where to buy it and its cost." },
    { href: "/docs/bar/electric", title: "Electric", text: "The seven circuits, the first and second fix, the tests, and every socket and light." },
    { href: "/docs/bar/plumbing", title: "Plumbing", text: "The supply, the small heater, the drains to the grease trap, the tests, and every run, tap and drain." },
  ],
  rails: {
    equipment: {
      coffee: { title: "Coffee machine", size: (w: string) => `${w} wide, two groups, on the back bar`, note: (kw?: number) => `Plumbed in, through a scale filter, its drip tray drained; about ${kw} kW on its own circuit (a design value).` },
      grinder: { title: "Grinder", size: (w: string) => `${w} wide, beside the machine`, note: "Beans in the hopper, ground to order." },
      fridge: { title: (n: number) => `Under-counter fridge × ${n}`, size: (w: string, d: string) => `${w} wide, ${d} deep, under the work counter`, note: "Glass doors: milk and cold drinks." },
      sink: { title: "Sink unit", size: (w: string, d: string) => `${w} wide, ${d} deep`, note: "A steel bowl in the oak worktop, a goose-neck mixer, the 15 L heater under it." },
      shelves: { title: "Open shelves", size: (l: string, d: string, at: string) => `${l} long, ${d} deep, at ${at}`, note: "Medium Oak on black brackets, each lit from beneath: cups, glasses, jars and bottles." },
      store: { title: "Store cupboard", size: (w: string, d: string, h: string) => `${w} wide, ${d} deep, ${h} high`, note: "Beans, cups, glasses and stock." },
      chair: { title: (n: number) => `Deep chair × ${n}`, size: (w: string, d: string, h: string) => `${w} wide, ${d} deep, the seat ${h} above the deck`, note: "A hardwood frame with outdoor cushions: two side by side at each end of the deck, their backs to the bar." },
      table: { title: (n: number) => `Low table × ${n}`, size: (r: string, h: string) => `Ø ${r}, ${h} high`, note: "A hardwood top on a black steel stem, in front of each pair of chairs." },
    },
    water: {
      meter: "Stop valve, filter and meter", scalefilter: "Scale filter", heater: "Under-sink heater",
      mixer: "Sink mixer", aav: "Air admittance valve", greasetrap: "Grease trap",
      ppr: { title: "PP-R supply pipe", note: "Under the floor across the aisle, then straight up into the units; PN20, welded joints." },
      upvc: { title: "uPVC drain pipe", note: "The sink and the machine's drip tray down through the floor to the collector, at 1:40 or steeper." },
    },
    electric: {
      board: "Distribution board", isolator: "Switched spurs", socket: "Double socket", single: "Fridge socket",
      ceiling: "Ceiling light", strip: "Shelf LED strips", bar: "Flap light bar",
      switch: "Light switch", alarm: "Smoke alarm", earth: "Earth rod",
    } as Record<string, string>,
  },
  // the bill of materials (bom.ts): its own lines; the shared ones are src/components/docs/bom-lines.ts
  bom: {
    sections: { equipment: "Equipment", joinery: "Joinery", outside: "Deck and lounge" },
    coffee: "Coffee machine, two groups, plumbed in",
    grinder: "Coffee grinder",
    fridge: "Under-counter fridge, glass door",
    sink: "Sink bowl, stainless steel, inset",
    counter: (l: number) => `Work counter under the hatch, ${l} m: a cupboard, two fridge bays, the sink unit and drawers`,
    back: (l: number, n: number) => `Back bar, ${l} m, its cupboards and ${n} open shelves over it`,
    store: "Tall store cupboard",
    ledge: "Today's steel ledge under the hatch, kept",
    struts: "Steel strut for the flap",
    deck: (m2: number) => `Treated hardwood for the deck and its step, ${m2} m²: 25 mm boards on 50 × 100 joists`,
    pads: "Concrete pad under the deck's bearers",
    chair: "Deep chair: hardwood frame, outdoor cushions",
    table: "Low table: hardwood top on a steel stem",
  },
  pointsDrawing: { electric: "bar's electrical drawing", plumbing: "bar's plumbing drawing" },
  theRuns: "The runs:",
  // bar.json's words, by row id
  json: {
    supply: { title: "Farm site board", sub: "230 V single-phase, buried cable", main: "Main switch 40 A DP", mainSub: "with surge protection" },
    circuits: {} as Record<string, Partial<Circuit>>,
    electric: {} as Record<string, Partial<ElectricPoint>>,
    water: {} as Record<string, Partial<WaterPoint>>,
    runs: {} as Record<string, Partial<WaterRun>>,
  },
}

const rw: typeof en = {
  meta: {
    title: "Akabari · Ifamu",
    description: "Ikawa n'ibinyobwa bitangirwa mu kabari k'ikontineri itukura ku rugo rwo hagati, n'intebe nini zo kuruhukiraho ku rubaho rwako, kuri Digital Farm hafi ya Kigali.",
  },
  hero: {
    title: "Ikawa ku idirishya, icyo kunywa ku rubaho",
    alt: "Ikontineri itukura nk'ingese iri ku musingi w'amabuye ku zuba rirenga, idirishya ryayo rirerire rifunguye munsi y'igisenge cy'imbaho gifashwe n'inkingi z'icyuma z'umukara: imbere, amatara amurikira utubati turiho ibikombe, ibirahure, amacupa n'ibibindi, imashini y'ikawa n'iyo kuyisya, imashini y'imitobe n'udusanduku tw'amacunga, inanasi n'ibinyomoro; hanze, kawunta y'imbaho ku byuma by'umukara n'intebe ndende eshanu ku rubaho rw'imbaho rufite intambwe imwe imanuka ku byatsi, hagati y'ibiti bya avoka n'insina.",
  },
  plan: {
    title: "Igishushanyo: ikontineri ya metero 6 (20 ft), mm 6,058 kuri 2,438, ku musingi w'amabuye; idirishya rya mm 2,600 mu rukuta rureba urugo, umupfundikizo waryo uzamuwe hejuru y'akabaho k'icyuma kari aho uyu munsi; urubaho rwa mm 6,000 ruri iruhande rwayo, ahari imbere y'idirishya hasigaye ari ubusa n'intambwe imanuka ku byatsi, kandi ku mpera zombi intebe nini ebyiri n'ameza magufi; imbere, kawunta y'akazi munsi y'idirishya ifite akabati, firigo ebyiri, lavabo n'utubati dukururwa, kawunta y'inyuma ifite imashini y'ikawa n'iyo kuyisya munsi y'utubati dutatu, akabati kirekire ko kubikamo, n'inzugi z'ikontineri ku ruhande rw'amajyaruguru ari ho binjirira.",
    labels: { fridges: "FIRIGO", sink: "LAVABO", coffee: "IKAWA", store: "UBUBIKO", ledge: "AKABAHO", step: "INTAMBWE", deck: "URUBAHO", lounge: "AHO KURUHUKIRA", hatch: "IDIRISHYA", backBar: "KAWUNTA Y'INYUMA", wayIn: "AHO BINJIRIRA", doors: "inzugi" },
  },
  model: {
    lineAlt: "Igishushanyo cy'imirongo cy'akabari kirebwa uturutse ku rugo, igisenge cyakuweho: ikontineri ku musingi wayo, umupfundikizo uzamuwe hejuru y'idirishya n'akabaho karyo k'icyuma, urubaho ruri iruhande rwayo rufite intebe nini ebyiri n'ameza magufi kuri buri mpera, n'imbere kawunta y'inyuma ifite imashini y'ikawa n'utubati dutatu turiho ibikombe, ibibindi n'amacupa.",
    realAlt: "Ishusho imwe yakozwe nk'ifoto: icyuma cy'amabati gitukura nk'ingese, urumuri rushyushye munsi y'umupfundikizo, kawunta n'utubati by'igiti cya Medium Oak bimurikiwe uturutse munsi, imashini y'ikawa y'icyuma, n'intebe z'igiti gikomeye zifite imisego y'igitambaro zikikije ameza magufi abiri ku rubaho rw'imbaho ku byatsi.",
  },
  electric: {
    notes: (kw) => [
      `Hafi kW ${kw} zihujweho; inyandiko y'amashanyarazi iha akabari kWh 5 ku munsi n'ingufu nyinshi za kW 5, harimo kW 3 kugeza kuri 4 z'imashini y'ikawa`,
      "Ubutaka bwa TT ku nkingi y'akabari ubwako (E1) · ibipimo ni ibyateganyijwe kugeza umutekinisiye w'amashanyarazi wo mu cyiciro A cya RURA abyemeje",
    ],
    label: (n) => `Igishushanyo cy'umurongo umwe: ikibaho cy'amashanyarazi cy'ifamu kuri volti 230 kijya kuri disijonkitere nkuru ya amperes 40 ifite uburinzi bw'umuriro mwinshi, hanyuma RCBO imwe kuri buri muzunguruko muri ${n}: amatara y'imbere, priza za kawunta y'inyuma, imashini y'ikawa, firigo, icyuma gishyushya amazi, itara riri munsi y'umupfundikizo, n'umuzunguruko w'inyongera.`,
    figureAlt: "Igishushanyo cy'imirongo cy'akabari kirebwa uturutse ku rugo, hasi gato, urukuta rw'idirishya n'urubaho byakuweho: ikibaho ku rukuta rw'inyuma hafi y'aho binjirira, buri muzunguruko uzamuka mu gisenge ku nzira yawo ukamanuka ku matara yo ku gisenge no ku mirongo y'amatara y'utubati mu bururu, priza mu icunga, n'imiyoboro y'imashini y'ikawa n'iy'icyuma gishyushya amazi mu cyatsi.",
    note: (link) => <>
      Buri muzunguruko uzamuka uva ku kibaho ukajya mu gisenge, ugakurikira inzira yawo ukamanuka ku gikoresho cyawo.
      Buri kimenyetso gifungura umurongo wacyo mu {link("/docs/bar/electric#points", "mbonerahamwe y'ahantu")}.
      Hanze y&rsquo;igishushanyo: umuriro uza ushyinguwe mu butaka uvuye ku kibaho cy&rsquo;ifamu, itara rirerire (L5) riri munsi
      y&rsquo;umupfundikizo, ryakuweho hamwe n&rsquo;urukuta rw&rsquo;idirishya, naho inkingi y&rsquo;ubutaka (E1) iri mu cyobo hanze y&rsquo;uruhande
      rw&rsquo;amajyaruguru.
    </>,
    caption: "Byakozwe uhereye ku gishushanyo mbonera, urukuta rw'idirishya rwakuweho n'utubati dufunguye",
    realAlt: "Ishusho imwe yakozwe nk'ifoto, urukuta rw'idirishya rwakuweho: imiyoboro y'umweru ku gisenge no ku nkuta igana ku kibaho hafi y'aho binjirira, amatara yo ku gisenge, priza hejuru ya kawunta y'inyuma, n'imiyoboro iri iruhande rw'imashini y'ikawa no mu kabati ka lavabo.",
  },
  water: {
    valve: { title: "Robine ifunga", sub: "muyunguruzi · konteri" },
    heater: (litres) => ({ title: `Icyuma gishyushya L ${litres}`, sub: "munsi ya lavabo" }),
    outlets: {
      SF: { title: "Muyunguruzi y'ingese", sub: "y'imashini" },
      EM: { title: "Imashini y'ikawa", sub: "amazi yinjira · isahani y'ibitonyanga" },
      ST: { title: "Lavabo", sub: "robine ivanga" },
    },
    trap: { title: "Igikusanya amavuta", sub: "hanze y'uruhande rw'amajyepfo" },
    notes: [
      "Umuvuduko wa bar 2.5 kugeza kuri 3 uvuye kuri pompe y'ifamu · buri muyoboro w'umwanda ku gipimo cya 1:40 cyangwa birenzeho · amazi y'akabari ntagera muri septic tank",
      "Ingano ni izateganyijwe kugeza umufundi w'amazi azisuzumye · nta na kimwe kiraboneka aho kugurwa cyangwa ngo gihabwe igiciro",
    ],
    label: "Igishushanyo cy'amazi: amazi y'ifamu anyura kuri robine ifunga y'akabari, muyunguruzi na konteri biri mu kabati ka kawunta y'inyuma; akonje anyura muri muyunguruzi y'ingese ajya ku mashini y'ikawa no munsi y'hasi ajya ku kabati ka lavabo, aho icyuma gishyushya cya litiro 15 giha lavabo amazi ashyushye; lavabo n'isahani y'ibitonyanga by'imashini bisohokera mu gikusanya, igikusanya amavuta gito n'icyobo gicengeza.",
    figureAlt: "Igishushanyo cy'imirongo cy'akabari kirebwa uturutse ku rugo, hasi gato, urukuta rw'idirishya n'urubaho byakuweho n'utubati dufunguye, ibikoresho by'imbere mu ibara ry'ivu: umuyoboro mukuru w'utudomo munsi y'uruhande rw'amajyepfo ugana ku marobine ari munsi y'imashini y'ikawa, muyunguruzi y'ingese iruhande rwayo, amazi akonje mu tudomo munsi y'hasi yambukiranya inzira ajya ku kabati ka lavabo gafite icyuma gishyushya gito, amazi ashyushye mu mutuku azamuka ku robine ivanga, n'imiyoboro y'umwanda mu tudomo munsi y'hasi igana ku gikusanya amavuta hanze y'uruhande rw'amajyepfo.",
    note: (link) => <>
      Imiyoboro izana amazi yambukiranya inzira munsi y&rsquo;hasi ikazamuka igana mu tubati; imiyoboro y&rsquo;umwanda imanuka inyuze
      mu hasi ikamanuka igana ku gikusanya amavuta, igaragazwa n&rsquo;utudomo aho hasi hayihisha. Urukuta rw&rsquo;idirishya n&rsquo;urubaho
      byakuweho n&rsquo;utubati dushushanyijwe dufunguye, kugira ngo imiyoboro igaragare. Buri kimenyetso gifungura umurongo
      wacyo mu {link("/docs/bar/plumbing#points", "mbonerahamwe y'ahantu")}. Hanze y&rsquo;igishushanyo: umuyoboro mukuru
      uva ku kigega cy&rsquo;ifamu no kuri pompe yacyo, naho igikusanya amavuta (GT) gisohokera mu cyobo gicengeza (SP).
    </>,
    caption: "Byakozwe uhereye ku gishushanyo mbonera, urukuta rw'idirishya rwakuweho n'utubati dufunguye",
    realAlt: "Ishusho imwe yakozwe nk'ifoto, urukuta rw'idirishya rwakuweho n'utubati dufunguye: konteri y'ubururu na muyunguruzi y'umweru munsi y'imashini y'ikawa, imiyoboro y'icyatsi izamuka mu kabati ka lavabo, icyuma gishyushya cy'umweru munsi ya lavabo, n'umupfundikizo w'igikusanya amavuta ku byatsi hafi y'uruhande rw'amajyepfo.",
  },
  docs: [
    { href: "/docs/bar", title: "Gahunda y'imirimo", text: "Buri ntambwe yo gutunganya akabari, kuva ku bipimo kugeza ku ijoro rya mbere gafunguye." },
    { href: "/docs/bar/materials", title: "Ibikoresho", text: "Ibikoresho, buri gikoresho cy'amashanyarazi na buri gice cy'imiyoboro y'amazi, n'ingano yacyo, aho kukigura n'igiciro cyacyo." },
    { href: "/docs/bar/electric", title: "Amashanyarazi", text: "Imizunguruko irindwi, icyiciro cya mbere n'icya kabiri cyo gushyiraho, ibizamini, na buri priza n'itara." },
    { href: "/docs/bar/plumbing", title: "Imiyoboro y'amazi", text: "Amazi yinjira, icyuma gishyushya gito, imiyoboro y'umwanda igana ku gikusanya amavuta, ibizamini, na buri muyoboro, robine n'aho amazi asohokera." },
  ],
  rails: {
    equipment: {
      coffee: { title: "Imashini y'ikawa", size: (w) => `Ubugari ${w}, imitwe ibiri, kuri kawunta y'inyuma`, note: (kw) => `Ihujwe n'amazi binyuze muri muyunguruzi y'ingese, isahani y'ibitonyanga ifite aho isohokera; hafi kW ${kw} ku muzunguruko wayo bwite (agaciro kateganyijwe).` },
      grinder: { title: "Imashini isya ikawa", size: (w) => `Ubugari ${w}, iruhande rw'imashini`, note: "Ibishyimbo bya kawa mu gikombe cyayo, bisebwa uko bisabwe." },
      fridge: { title: (n) => `Firigo yo munsi ya kawunta × ${n}`, size: (w, d) => `Ubugari ${w}, ubujyakuzimu ${d}, munsi ya kawunta y'akazi`, note: "Inzugi z'ibirahure: amata n'ibinyobwa bikonje." },
      sink: { title: "Akabati ka lavabo", size: (w, d) => `Ubugari ${w}, ubujyakuzimu ${d}`, note: "Ibase ry'icyuma mu kawunta y'igiti, robine ivanga ndende, icyuma gishyushya cya L 15 munsi yayo." },
      shelves: { title: "Utubati dufunguye", size: (l, d, at) => `Uburebure ${l}, ubujyakuzimu ${d}, ku burebure bwa ${at}`, note: "Medium Oak ku byuma by'umukara, buri kamwe kamurikiwe uturutse munsi: ibikombe, ibirahure, ibibindi n'amacupa." },
      store: { title: "Akabati ko kubikamo", size: (w, d, h) => `Ubugari ${w}, ubujyakuzimu ${d}, uburebure ${h}`, note: "Ikawa, ibikombe, ibirahure n'ibicuruzwa." },
      chair: { title: (n) => `Intebe nini × ${n}`, size: (w, d, h) => `Ubugari ${w}, ubujyakuzimu ${d}, intebe ${h} hejuru y'urubaho`, note: "Ikadiri y'igiti gikomeye n'imisego yo hanze: ebyiri iruhande rumwe kuri buri mpera y'urubaho, imigongo yazo yerekeye akabari." },
      table: { title: (n) => `Ameza magufi × ${n}`, size: (r, h) => `Ø ${r}, uburebure ${h}`, note: "Hejuru h'igiti gikomeye ku nkingi y'icyuma cy'umukara, imbere ya buri ntebe ebyiri." },
    },
    water: {
      meter: "Robine ifunga, muyunguruzi na konteri", scalefilter: "Muyunguruzi y'ingese", heater: "Icyuma gishyushya cyo munsi ya lavabo",
      mixer: "Robine ivanga ya lavabo", aav: "Valve yinjiza umwuka", greasetrap: "Igikusanya amavuta",
      ppr: { title: "Umuyoboro w'amazi PP-R", note: "Munsi y'hasi yambukiranya inzira, hanyuma uzamuka ugana mu tubati; PN20, ingingo zisudiye." },
      upvc: { title: "Umuyoboro w'umwanda uPVC", note: "Lavabo n'isahani y'ibitonyanga by'imashini bimanuka binyuze mu hasi bigana ku gikusanya, ku gipimo cya 1:40 cyangwa birenzeho." },
    },
    electric: {
      board: "Ikibaho cy'amashanyarazi", isolator: "Udukoresho ducana", socket: "Priza ebyiri", single: "Priza ya firigo",
      ceiling: "Itara ryo ku gisenge", strip: "Imirongo y'amatara ya LED y'utubati", bar: "Itara rirerire ry'umupfundikizo",
      switch: "Agakoresho gacana itara", alarm: "Icyuma kimenyesha umwotsi", earth: "Inkingi y'ubutaka",
    },
  },
  bom: {
    sections: { equipment: "Ibikoresho", joinery: "Imbaho z'ibikoresho", outside: "Urubaho n'aho kuruhukira" },
    coffee: "Imashini y'ikawa ifite imitwe ibiri, ihujwe n'amazi",
    grinder: "Imashini isya ikawa",
    fridge: "Firigo yo munsi ya kawunta, urugi rw'ikirahure",
    sink: "Ibase ry'icyuma cya inox ryinjizwa muri kawunta",
    counter: (l) => `Kawunta y'akazi munsi y'idirishya, m ${l}: akabati, imyanya ibiri ya firigo, akabati ka lavabo n'utubati dukururwa`,
    back: (l, n) => `Kawunta y'inyuma, m ${l}, utubati twayo n'utubati ${n} dufunguye hejuru yayo`,
    store: "Akabati kirekire ko kubikamo",
    ledge: "Akabaho k'icyuma kari munsi y'idirishya uyu munsi, kagumaho",
    struts: "Inkingi y'icyuma ifata umupfundikizo",
    deck: (m2) => `Igiti gikomeye gitunganyijwe cy'urubaho n'intambwe yarwo, m² ${m2}: imbaho za mm 25 ku mbaho za 50 × 100`,
    pads: "Agashingiro ka beto munsi y'imbaho zifata urubaho",
    chair: "Intebe nini: ikadiri y'igiti gikomeye, imisego yo hanze",
    table: "Ameza magufi: hejuru h'igiti gikomeye ku nkingi y'icyuma",
  },
  pointsDrawing: { electric: "gishushanyo cy'amashanyarazi cy'akabari", plumbing: "gishushanyo cy'imiyoboro y'amazi cy'akabari" },
  theRuns: "Imiyoboro:",
  json: {
    supply: { title: "Ikibaho cy'ifamu", sub: "V 230 fazi imwe, umugozi ushyinguye", main: "Disijonkitere nkuru A 40 DP", mainSub: "ifite uburinzi bw'umuriro mwinshi" },
    circuits: {
      C1: { serves: "Amatara y'imbere" }, C2: { serves: "Priza za kawunta y'inyuma" }, C3: { serves: "Imashini y'ikawa" },
      C4: { serves: "Firigo" }, C5: { serves: "Icyuma gishyushya amazi" }, C6: { serves: "Hanze: itara riri munsi y'umupfundikizo" },
      C7: { serves: "Uw'inyongera" },
    },
    electric: {
      DB: { what: "Ikibaho cy'amashanyarazi, modile 12", size: "Hafi mm 300 × 400, ubujyakuzimu mm 100" },
      L1: { what: "Itara ryo ku gisenge, urumuri rushyushye" }, L2: { what: "Itara ryo ku gisenge, urumuri rushyushye" },
      L3: { what: "Itara ryo ku gisenge, urumuri rushyushye" },
      L4: { what: "Imirongo y'amatara ya LED munsi y'utubati dutatu, drayiveri imwe" },
      S1: { what: "Agakoresho gacana itara hafi y'aho binjirira" },
      P1: { what: "Priza ebyiri, imashini isya n'iy'inyongera" }, P2: { what: "Priza ebyiri, umuziki n'imashini y'amakarita" },
      Q1: { what: "Agakoresho gacana imashini y'ikawa, impande zombi" },
      P3: { what: "Priza ya firigo, inyuma y'akabati" }, P4: { what: "Priza ya firigo, inyuma y'akabati" },
      Q2: { what: "Agakoresho gacana icyuma gishyushya amazi, impande zombi" },
      L5: { what: "Itara rirerire munsi y'umupfundikizo, IP65", size: "Uburebure m 2.2" },
      AL: { what: "Icyuma kimenyesha umwotsi, bateri y'imyaka 10" },
      E1: { what: "Inkingi y'ubutaka mu cyobo cyo kugenzuriramo", size: "Inkingi ya m 1.5, hanze y'uruhande rw'amajyaruguru, hanze y'igishushanyo" },
    },
    water: {
      SV: { what: "Robine ifunga, muyunguruzi Y na konteri ku muyoboro mukuru", where: "Mu kabati ka kawunta y'inyuma munsi y'imashini y'ikawa" },
      SF: { what: "Muyunguruzi y'ingese y'imashini y'ikawa", where: "Iruhande rw'amarobine, ifite robine yayo yo kuyifunga", size: "Kartushi hafi Ø mm 120 × 450" },
      EM: { what: "Imashini y'ikawa: amazi yinjira n'isohoka ry'isahani y'ibitonyanga", where: "Bizamuka binyuze muri kawunta y'inyuma munsi y'imashini", size: "Umuyoboro uboshye wa santimetero 3/8, igituba cy'umwanda cya mm 20" },
      WH: { what: "Icyuma gishyushya amazi cyo munsi ya lavabo, L 15, hafi kW 1.5", where: "Mu kabati ka lavabo", size: "Hafi mm 360 × 400 × 360" },
      ST: { what: "Robine ivanga ya lavabo, ndende", where: "Kuri kawunta y'akazi, munsi y'idirishya", size: "Imiyoboro ya mm 15, ashyushye n'akonje" },
      AV: { what: "Valve yinjiza umwuka", where: "Ku muyoboro w'umwanda wa lavabo, mu kabati ka lavabo" },
      GT: { what: "Igikusanya amavuta gito", where: "Hanze y'uruhande rw'amajyepfo, gishyinguye gifite umupfundikizo", size: "Ingano yo munsi ya lavabo cyangwa icyumba gito gishyinguye, bigenwa n'umufundi w'amazi" },
      SP: { what: "Icyobo gicengeza", where: "Munsi y'igikusanya amavuta, hanze y'igishushanyo; ntibijya muri septic tank", size: "Nyuma y'igerageza ry'icengera" },
    },
    runs: {
      W1: { note: "Umuyoboro mukuru uva ku kigega cy'ifamu no kuri pompe yacyo, munsi y'umusingi ugana kuri robine ifunga" },
      W2: { note: "Amazi akonje munsi y'hasi yambukiranya inzira agana ku kabati ka lavabo: icyuma gishyushya na robine ivanga" },
      W3: { note: "Anyura muri muyunguruzi y'ingese agana ku mashini y'ikawa" },
      H1: { note: "Amazi ashyushye ava ku cyuma gishyushya cyo munsi ya lavabo agana kuri robine ivanga" },
      D1: { note: "Umutego wa lavabo umanuka unyuze mu hasi no munsi yaho ugana ku gikusanya" },
      D2: { note: "Isohoka ry'isahani y'ibitonyanga by'imashini y'ikawa rimanuka rigana ku gikusanya" },
      D3: { note: "Igikusanya munsi y'umusingi, kimanuka kigana amajyepfo ku gipimo cya 1:40 kigera ku gikusanya amavuta" },
    },
  },
}

export const words: Words<typeof en> = { en, rw }
