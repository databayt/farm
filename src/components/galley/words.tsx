import type * as React from "react"

import type { Words } from "@/components/internationalization/words"
import type { Circuit, ElectricPoint, WaterPoint, WaterRun } from "@/components/galley/service-diagrams"

// Every word of the galley's page, its drawings, its rails and its docs tables (D-058): the English, then its
// Kinyarwanda, a machine draft until a native speaker reviews it. galley.json keeps its English for the render scripts;
// `json` lays the Kinyarwanda over its rows by id (data.ts).
type L = (href: string, text: string) => React.ReactNode

const en = {
  meta: {
    title: "The galley · Farm",
    description: "The farm's staff kitchen: a teal container with a long worktop and two sinks, cooking breakfast and dinner from the field for the guests, at the Digital Farm near Kigali.",
  },
  hero: {
    title: "Breakfast and dinner, cooked from the field",
    alt: "A long teal shipping container on a low fieldstone plinth at sunset, seen three-quarter from the left: two cream doors with small windows up stone steps near each end and two white-framed windows between them, glowing warm onto stainless shelves, sinks and a fridge; crates of fresh vegetables and a basket of eggs on the left steps, herbs in terracotta pots along the plinth, on a mown lawn among avocado trees and banana plants.",
  },
  plan: {
    title: "Plan: a 40 ft container 12,192 by 2,438 mm on a stone plinth, a door near each end of its front up two stone steps and two windows between them; inside, a hand-wash basin and apron hooks by the staff door at the left end, then the 7,800 mm stainless worktop under the windows with the harvest bench, the prep sink, the prep bench, the wash-up sink and the dish drop by the service door; along the back wall an upright freezer and a two-door fridge, the dry store's shelving, the range, griddle and fryer under the extract hood with a 900 mm aisle in front of them, a cold bench, the pass with its gantry and a cleaning cupboard; two bins and a plate cupboard at the right end.",
    labels: {
      handWash: "HAND WASH", harvest: "HARVEST", prepSink: ["PREP", "SINK"], prepBench: "PREP BENCH", washSink: ["WASH-UP", "SINK"],
      dishDrop: "DISH DROP", dry: "DRY STORE", hood: "HOOD", bench: "COLD BENCH", pass: "PASS", cleaning: "CLEANING", bin: "BIN",
      plates: "PLATES", staffDoor: "STAFF DOOR", serviceDoor: "SERVICE DOOR", galley: "GALLEY", cold: "COLD", line: "COOKING LINE", window: "WINDOW", worktop: "worktop", lpg: "LPG",
      units: { freezer: "FREEZER", fridge: "FRIDGE", range: "RANGE", griddle: "GRIDDLE", fryer: "FRYER" } as Record<string, string>,
    },
  },
  model: {
    lineAlt: "Line drawing of the galley from the courtyard with the front wall and roof off: the stone plinth with the steps at its two doors, the long worktop on steel legs along the front with its two sinks and taps, crates of vegetables, chopping boards, pots on the undershelf and racks of plates, and along the back wall an upright freezer and a two-door fridge, shelves of sacks, tubs and jars, a range with pots, a griddle and a fryer under the hood and its duct, a cold bench, the pass with heat lamps over plates, a tall cleaning cupboard, two bins and a fire blanket at the far end.",
    realAlt: "The same view rendered: the teal container on a fieldstone plinth on the lawn, white walls and a grey resin floor, brushed steel worktops, fridges, shelving and hood, crates of greens, tomatoes and onions, a tray of eggs and a bowl of fruit on the cold bench, plated dinners under the glowing heat lamps, a white cleaning cupboard, green bins and a red fire blanket by the service door.",
  },
  electric: {
    notes: (kw: number): [string, string] => [
      `About ${kw} kW connected, on one phase; about 8 kWh a day with the line on LPG (D-065) · the emergency stop (ES) shuts the gas valve and the ignition through K`,
      "The line cooks on LPG from two cylinders outside (the farm's gas guide): its circuit feeds only the ignition and the gas valve · ratings are design intent until a RURA class A electrician certifies",
    ],
    label: (n: number) => `Single-line diagram: the farm's site board at 230 volts single-phase into a main switch with surge protection, then one RCBO for each of ${n} circuits: lights, two worktop socket circuits, the freezer and fridge, the cold bench and the pass, the range's ignition and the gas valve, dropped by the emergency stop, the extract fan, the water heater and a spare.`,
    figureAlt: "Line drawing of the galley from the courtyard with the fit-out in grey: the board on the front wall by the staff door with every circuit rising from it into the ceiling, along its own track and down to its points: LED battens in blue, worktop and appliance sockets in orange, the cooking line's isolators and connection boxes, the hood control, the roof fan and the water heater in green.",
    note: (link: L): React.ReactNode => <>
      Every circuit rises from the board into the ceiling, runs along its own track and drops straight to its device;
      in a kitchen the conduit stays on the surface, where it can be wiped. Each tag opens its row in the{" "}
      {link("/docs/galley/electric#points", "points table")}. Outside the drawing: the
      supply comes in buried from the farm&rsquo;s site board, and the earth rod (E1) is in a pit outside the staff
      door end.
    </>,
    caption: "Rendered from the design model",
    realAlt: "The same view rendered: white surface conduit along the ceiling and down the walls to the board by the staff door, the sockets over the worktop, the yellow isolators beside the range, the hood control, the heat alarms and the fan on the roof over the hood.",
  },
  water: {
    valve: { title: "Stop valve", sub: "filter · meter" },
    heater: (litres: number, kw: number) => ({ title: `Heater ${litres} L`, sub: `${kw} kW, east end` }),
    outlets: {
      HB: { title: "Hand basin", sub: "hands-free" },
      DF: { title: "Drinking filter", sub: "own faucet" },
      PS: { title: "Prep sink", sub: "mixer" },
      WS: { title: "Wash-up sink", sub: "mixer" },
      PR: { title: "Pre-rinse", sub: "spray" },
      FG: { title: "Floor gully", sub: "basket" },
      D6: { title: "Dishwasher", sub: "capped spare" },
    },
    trap: { title: "Grease trap", sub: "outside the east end" },
    notes: [
      "Pressure 2.5 to 3 bar from the farm's booster pump · every drain at 1:40 or steeper · the kitchen's water never reaches the septic tank",
      "Sizes are design intent until the plumber checks them · nothing sourced or priced yet",
    ] as [string, string],
    label: "Water diagram: the farm's water through the galley's stop valve, filter and meter; cold along the front wall to the hand basin, the drinking filter, both sinks, the pre-rinse spray and a capped tee for a dishwasher, and on to the 100 litre heater, whose hot comes back to the basin, the sinks and the spray; the basin, the sinks and the floor gully drain to one collector under the plinth, the grease trap and a soak pit.",
    figureAlt: "Line drawing of the galley from the courtyard with the fit-out in grey: the main coming in dashed under the staff door end to the stop valve by the basin, cold in blue and hot in red along the front wall under the worktop and up to the basin, both sinks and the pre-rinse spray, the 100 litre heater on the east end wall above the bins, and the drains in brown dashed under the plinth to the grease trap outside the east end.",
    note: (link: L): React.ReactNode => <>
      Supplies run along the front wall under the open worktop, then straight up to each outlet; drains drop through
      the floor to one collector under the plinth, dashed where the floor hides them. Each tag opens its row in the{" "}
      {link("/docs/galley/plumbing#points", "points table")}. Outside the drawing: the main
      comes in from the farm&rsquo;s tank and booster pump, and the grease trap (GT) empties to the kitchen&rsquo;s own
      soak pit (SP), never the septic tank. The front wall is drawn as a faint outline.
    </>,
    caption: "Rendered from the design model, the pipes drawn as they run",
    realAlt: "The same view rendered: green supply pipes along the front wall under the stainless worktop and up to the sinks and the basin, the blue meter by the basin, the white heater on the east end wall over the green bins, and the grease trap's lid on the lawn outside the east end.",
  },
  docs: [
    { href: "/docs/galley", title: "Execution plan", text: "Every step of fitting out the staff kitchen, the cooking fuel decided first, from the survey to the first meal." },
    { href: "/docs/galley/materials", title: "Materials", text: "The equipment, each electric device and each plumbing part, with its size, where to buy it and its cost." },
    { href: "/docs/galley/electric", title: "Electric", text: "The supply and the eleven circuits, the first and second fix, the tests and every socket, light and isolator." },
    { href: "/docs/galley/plumbing", title: "Plumbing", text: "The supply, the hot water, the drains to the grease trap, the tests, and every run, tap and drain." },
  ],
  rails: {
    equipment: {
      box: (w: string, d: string, h: string) => `${w} × ${d}, ${h} high`,
      range: { title: "Range and oven", note: () => "Six gas burners over a gas oven, on LPG (D-065); its circuit feeds only the ignition and the oven light." },
      griddle: { title: "Griddle", note: () => "A steel plate behind a grease channel, gas-fired on LPG (D-065)." },
      fryer: { title: "Fryer", note: () => "One tank, two baskets, gas-fired on LPG (D-065)." },
      hood: { title: "Extract hood", size: (w: string, d: string, y: string, duct: number) => `${w} × ${d}, lower edge ${y} up, ${duct} mm duct`, note: "A stainless canopy, its duct up through the roof to the fan; the line only runs while the fan runs." },
      freezer: { title: "Upright freezer", note: "Stainless, one door, across from the staff door." },
      fridge: { title: "Two-door fridge", note: "Stainless upright, where the harvest, the eggs and the deliveries go first." },
      bench: { title: "Cold bench", note: "An undercounter fridge with two doors under a stainless top: breakfast's eggs, milk and fruit." },
      pass: { title: "The pass", size: (w: string, d: string, h: string, g: string) => `${w} × ${d}, ${h} high, gantry at ${g}`, note: "A heated plate cupboard under a heated top, three heat lamps under the gantry's shelf." },
      worktop: { title: "Worktop and two sinks", note: (pw: number, pd: number, pdep: number, ww: number, wd: number, wdep: number) => `Stainless on legs with an undershelf. Prep sink ${pw} × ${pd} mm, ${pdep} deep; wash-up sink ${ww} × ${wd} mm, ${wdep} deep, with a pre-rinse spray.` },
      dry: { title: "Dry store shelving", size: (w: string, d: string, n: number, top: string) => `${w} × ${d}, ${n} shelves to ${top}`, note: "Stainless: sacks of rice, flour and beans below, tubs, oil, jars and tins above." },
      basin: { title: "Hand-wash basin", note: "Hands only, by the staff door: a hands-free tap, soap and paper towels beside it." },
      cleaning: { title: "Cleaning cupboard", note: "Mops, buckets and the cleaning products, apart from the food." },
      plates: { title: "Plate cupboard", note: "Clean plates, bowls and cutlery by the service door, a landing for trays on top." },
      bins: { title: "Pedal bins × 2", size: (w: string, d: string, h: string) => `${w} × ${d}, ${h} high each`, note: "One for scraps (to the hens and the compost), one for waste." },
      fire: { title: "Fire point", size: "An extinguisher on its bracket, a fire blanket above it", note: "For cooking-oil fires, on the east end wall by the service door." },
    },
    water: {
      parts: {
        meter: "Stop valve, filter and meter", heater: "Water heater", mixer: "Sink mixer", prerinse: "Pre-rinse spray",
        basintap: "Hands-free basin tap", filter: "Drinking-water filter", aav: "Air admittance valve", gully: "Floor gully", greasetrap: "Grease trap",
      } as Record<string, string>,
      ppr: { title: "PP-R supply pipe", note: "Cold and hot, PN20, welded joints, along the front wall under the worktop and up to each outlet." },
      upvc: { title: "uPVC drain pipe", note: "Each waste down through the floor to the collector under the plinth, at 1:40 or steeper." },
    },
    electric: {
      board: "Distribution board", isolator: "Isolators", outlet: "Connection boxes", estop: "Emergency stop", control: "Hood control",
      fan: "Roof extract fan", socket: "Double socket IP44", single: "Fridge socket", batten: "LED batten IP65", switch: "Light switch",
      alarm: "Heat alarm", earth: "Earth rod",
    } as Record<string, string>,
  },
  pointsDrawing: { electric: "galley's electrical drawing", plumbing: "galley's plumbing drawing" },
  theRuns: "The runs:",
  // galley.json's words, by row id
  json: {
    supply: { title: "Farm site board", sub: "230 V single-phase, buried cable", main: "Main switch 63 A 2P", mainSub: "with surge protection" },
    circuits: {} as Record<string, Partial<Circuit>>,
    electric: {} as Record<string, Partial<ElectricPoint>>,
    water: {} as Record<string, Partial<WaterPoint>>,
    runs: {} as Record<string, Partial<WaterRun>>,
  },
}

const rw: typeof en = {
  meta: {
    title: "Igikoni · Ifamu",
    description: "Igikoni cy'abakozi b'ifamu: ikontineri y'ubururu bwerurutse ifite kawunta ndende na lavabo ebyiri, itekerwamo abashyitsi ifunguro rya mu gitondo n'iry'umugoroba bivuye mu murima, kuri Digital Farm hafi ya Kigali.",
  },
  hero: {
    title: "Ifunguro rya mu gitondo n'iry'umugoroba, ritetswe rivuye mu murima",
    alt: "Ikontineri ndende y'ubururu bwerurutse iri ku musingi mugufi w'amabuye izuba rirenga, irebwa ku ruhande uturutse ibumoso: inzugi ebyiri z'ibara rya kerere zifite amadirishya mato, zigerwaho n'intambwe z'amabuye hafi ya buri mpera, n'amadirishya abiri afite amakadiri y'umweru hagati yazo, amurikira imbere urumuri rushyushye ku tubati tw'icyuma kitagwa ingese, lavabo na firigo; udusanduku tw'imboga nshya n'agaseke k'amagi ku ntambwe z'ibumoso, ibyatsi bihumura mu nkono z'ibumba ku musingi, ku byatsi byakaswe hagati y'ibiti bya avoka n'insina.",
  },
  plan: {
    title: "Igishushanyo: ikontineri ya metero 12 (40 ft), mm 12,192 kuri 2,438, ku musingi w'amabuye, urugi hafi ya buri mpera y'imbere yayo rugerwaho n'intambwe ebyiri z'amabuye n'amadirishya abiri hagati yazo; imbere, lavabo yo gukaraba intoki n'udufashi two kumanikaho amatabuliye hafi y'urugi rw'abakozi ku mpera y'ibumoso, hanyuma kawunta y'icyuma kitagwa ingese ya mm 7,800 munsi y'amadirishya, ifite aho umusaruro ushyirwa, lavabo yo gutegura, aho gutegurira, lavabo yo koza ibyombo n'aho ibyombo byanduye bishyirwa hafi y'urugi rwo kugaburira; ku rukuta rw'inyuma, firizeri ihagaze na firigo y'inzugi ebyiri, utubati tw'ububiko bw'ibiribwa byumye, amashyiga, isahani yokeramo n'ikarangiro munsi y'igikurura umwotsi n'inzira ya mm 900 imbere yabyo, kawunta ikonje, aho ibiryo bitangirwa n'akabati k'isuku; udusanduku tw'imyanda tubiri n'akabati k'amasahani ku mpera y'iburyo.",
    labels: {
      handWash: "GUKARABA", harvest: "UMUSARURO", prepSink: ["LAVABO", "GUTEGURA"], prepBench: "AHO GUTEGURIRA", washSink: ["LAVABO", "KOZA"],
      dishDrop: "IBYOMBO BYANDUYE", dry: "UBUBIKO", hood: "IGIKURURA UMWOTSI", bench: "KAWUNTA IKONJE", pass: "AHO BATANGIRA", cleaning: "ISUKU", bin: "IMYANDA",
      plates: "AMASAHANI", staffDoor: "URUGI RW'ABAKOZI", serviceDoor: "URUGI RWO KUGABURIRA", galley: "IGIKONI", cold: "IBIKONJESHA", line: "AHO GUTEKERA", window: "IDIRISHYA", worktop: "kawunta", lpg: "GAZ LPG",
      units: { freezer: "FIRIZERI", fridge: "FIRIGO", range: "AMASHYIGA", griddle: "ISAHANI", fryer: "IKARANGIRO" },
    },
  },
  model: {
    lineAlt: "Igishushanyo cy'imirongo cy'igikoni kirebwa uturutse ku rugo, urukuta rw'imbere n'igisenge byakuweho: umusingi w'amabuye ufite intambwe ku nzugi zawo zombi, kawunta ndende ku maguru y'icyuma ku ruhande rw'imbere ifite lavabo zayo ebyiri n'amarobine, udusanduku tw'imboga, imbaho zo gukatiraho, inkono ku gatanda ko hasi n'utubati tw'amasahani, naho ku rukuta rw'inyuma firizeri ihagaze na firigo y'inzugi ebyiri, utubati turiho imifuka, udusanduku n'ibibindi, amashyiga ariho inkono, isahani yokeramo n'ikarangiro munsi y'igikurura umwotsi n'umuyoboro wacyo, kawunta ikonje, aho ibiryo bitangirwa hari amatara ashyushya hejuru y'amasahani, akabati karekare k'isuku, udusanduku tw'imyanda tubiri n'igitambaro kizimya umuriro ku mpera ya kure.",
    realAlt: "Ishusho imwe yakozwe nk'ifoto: ikontineri y'ubururu bwerurutse ku musingi w'amabuye ku byatsi, inkuta z'umweru n'hasi h'ivu ha resin, kawunta, firigo, utubati n'igikurura umwotsi by'icyuma gisizwe, udusanduku tw'imboga z'icyatsi, inyanya n'ibitunguru, isahani y'amagi n'igikombe cy'imbuto kuri kawunta ikonje, amafunguro ari ku masahani munsi y'amatara ashyushya yaka, akabati k'isuku k'umweru, udusanduku tw'imyanda tw'icyatsi n'igitambaro gitukura kizimya umuriro hafi y'urugi rwo kugaburira.",
  },
  electric: {
    notes: (kw) => [
      `Hafi kW ${kw} zihujweho, kuri fazi imwe; hafi kWh 8 ku munsi umurongo wo guteka ukoresha LPG (D-065) · buto yo guhagarika byihutirwa (ES) ifunga vane ya gaz n'icyatsa binyuze kuri K`,
      "Umurongo wo guteka ukoresha LPG iva mu macupa abiri ari hanze (inyandiko ya gaz y'ifamu): umuzunguruko wawo ugaburira gusa icyatsa na vane ya gaz · ibipimo ni ibyateganyijwe kugeza umutekinisiye w'amashanyarazi wo mu cyiciro A cya RURA abyemeje",
    ],
    label: (n) => `Igishushanyo cy'umurongo umwe: ikibaho cy'amashanyarazi cy'ifamu kuri volti 230 fazi imwe kijya kuri disijonkitere nkuru ifite uburinzi bw'umuriro mwinshi, hanyuma RCBO imwe kuri buri muzunguruko muri ${n}: amatara, imizunguruko ibiri ya priza za kawunta, firizeri na firigo, kawunta ikonje n'aho ibiryo bitangirwa, icyatsa amashyiga na vane ya gaz, bihagarikwa na buto yo guhagarika byihutirwa, vantilateri isohora umwotsi, icyuma gishyushya amazi n'umuzunguruko w'inyongera.`,
    figureAlt: "Igishushanyo cy'imirongo cy'igikoni kirebwa uturutse ku rugo, ibikoresho by'imbere mu ibara ry'ivu: ikibaho ku rukuta rw'imbere hafi y'urugi rw'abakozi, buri muzunguruko uzamuka uvaho ujya mu gisenge, ugakurikira inzira yawo ukamanuka ku hantu hawo: amatara marerare ya LED mu bururu, priza za kawunta n'iz'ibikoresho mu icunga, isolator n'udusanduku two guhuza by'umurongo wo guteka, igenzura ry'igikurura umwotsi, vantilateri yo ku gisenge n'icyuma gishyushya amazi mu cyatsi.",
    note: (link) => <>
      Buri muzunguruko uzamuka uva ku kibaho ukajya mu gisenge, ugakurikira inzira yawo ukamanuka ku gikoresho cyawo;
      mu gikoni imiyoboro y&rsquo;insinga iguma hejuru y&rsquo;urukuta, aho ishobora guhanagurwa. Buri kimenyetso gifungura umurongo wacyo mu{" "}
      {link("/docs/galley/electric#points", "mbonerahamwe y'ahantu")}. Hanze y&rsquo;igishushanyo: umuriro uza ushyinguwe mu
      butaka uvuye ku kibaho cy&rsquo;ifamu, naho inkingi y&rsquo;ubutaka (E1) iri mu cyobo hanze y&rsquo;uruhande rw&rsquo;urugi
      rw&rsquo;abakozi.
    </>,
    caption: "Byakozwe uhereye ku gishushanyo mbonera",
    realAlt: "Ishusho imwe yakozwe nk'ifoto: imiyoboro y'insinga y'umweru hejuru y'urukuta ku gisenge no ku nkuta igana ku kibaho hafi y'urugi rw'abakozi, priza hejuru ya kawunta, isolator z'umuhondo iruhande rw'amashyiga, igenzura ry'igikurura umwotsi, ibyuma bimenyesha ubushyuhe na vantilateri ku gisenge hejuru y'igikurura umwotsi.",
  },
  water: {
    valve: { title: "Robine ifunga", sub: "muyunguruzi · konteri" },
    heater: (litres, kw) => ({ title: `Icyuma gishyushya L ${litres}`, sub: `kW ${kw}, iburasirazuba` }),
    outlets: {
      HB: { title: "Lavabo y'intoki", sub: "idakorwaho" },
      DF: { title: "Muyunguruzi", sub: "robine yayo" },
      PS: { title: "Lavabo yo gutegura", sub: "robine ivanga" },
      WS: { title: "Lavabo yo koza", sub: "robine ivanga" },
      PR: { title: "Kubanza kwoza", sub: "igitera amazi" },
      FG: { title: "Umwobo wo hasi", sub: "agaseke" },
      D6: { title: "Imashini yoza", sub: "ifunze, inyongera" },
    },
    trap: { title: "Igikusanya amavuta", sub: "hanze y'iburasirazuba" },
    notes: [
      "Umuvuduko wa bar 2.5 kugeza kuri 3 uvuye kuri pompe y'ifamu · buri muyoboro w'umwanda ku gipimo cya 1:40 cyangwa birenzeho · amazi y'igikoni ntagera muri septic tank",
      "Ingano ni izateganyijwe kugeza umufundi w'amazi azisuzumye · nta na kimwe kiraboneka aho kugurwa cyangwa ngo gihabwe igiciro",
    ],
    label: "Igishushanyo cy'amazi: amazi y'ifamu anyura kuri robine ifunga y'igikoni, muyunguruzi na konteri; akonje akurikira urukuta rw'imbere ajya kuri lavabo y'intoki, muyunguruzi y'amazi yo kunywa, lavabo zombi, igitera amazi cyo kubanza kwoza n'aho imashini yoza ibyombo yazahuzwa hafunze, akagera ku cyuma gishyushya cya litiro 100, amazi ashyushye yacyo akagaruka kuri lavabo y'intoki, lavabo n'igitera amazi; lavabo y'intoki, lavabo n'umwobo w'amazi wo hasi bisohokera mu gikusanya kimwe munsi y'umusingi, igikusanya amavuta n'icyobo gicengeza.",
    figureAlt: "Igishushanyo cy'imirongo cy'igikoni kirebwa uturutse ku rugo, ibikoresho by'imbere mu ibara ry'ivu: umuyoboro mukuru winjira mu tudomo munsi y'uruhande rw'urugi rw'abakozi ugana kuri robine ifunga hafi ya lavabo y'intoki, akonje mu bururu n'ashyushye mu mutuku ku rukuta rw'imbere munsi ya kawunta azamuka kuri lavabo y'intoki, lavabo zombi n'igitera amazi, icyuma gishyushya cya litiro 100 ku rukuta rw'iburasirazuba hejuru y'udusanduku tw'imyanda, n'imiyoboro y'umwanda mu kigina mu tudomo munsi y'umusingi igana ku gikusanya amavuta hanze y'uruhande rw'iburasirazuba.",
    note: (link) => <>
      Imiyoboro izana amazi ikurikira urukuta rw&rsquo;imbere munsi ya kawunta ifunguye, hanyuma ikazamuka igana kuri buri robine;
      imiyoboro y&rsquo;umwanda imanuka inyuze mu hasi igana ku gikusanya kimwe munsi y&rsquo;umusingi, igaragazwa n&rsquo;utudomo aho hasi
      hayihisha. Buri kimenyetso gifungura umurongo wacyo mu{" "}
      {link("/docs/galley/plumbing#points", "mbonerahamwe y'ahantu")}. Hanze y&rsquo;igishushanyo: umuyoboro mukuru
      uva ku kigega cy&rsquo;ifamu no kuri pompe yacyo, naho igikusanya amavuta (GT) gisohokera mu cyobo gicengeza cy&rsquo;igikoni
      ubwacyo (SP), ntibijya muri septic tank. Urukuta rw&rsquo;imbere rushushanyijwe nk&rsquo;umurongo woroheje.
    </>,
    caption: "Byakozwe uhereye ku gishushanyo mbonera, imiyoboro ishushanyijwe uko inyura",
    realAlt: "Ishusho imwe yakozwe nk'ifoto: imiyoboro y'amazi y'icyatsi ku rukuta rw'imbere munsi ya kawunta y'icyuma kitagwa ingese, izamuka kuri lavabo no kuri lavabo y'intoki, konteri y'ubururu hafi ya lavabo y'intoki, icyuma gishyushya cy'umweru ku rukuta rw'iburasirazuba hejuru y'udusanduku tw'imyanda tw'icyatsi, n'umupfundikizo w'igikusanya amavuta ku byatsi hanze y'uruhande rw'iburasirazuba.",
  },
  docs: [
    { href: "/docs/galley", title: "Gahunda y'imirimo", text: "Buri ntambwe yo gutunganya igikoni cy'abakozi, ibicanwa byo guteka bibanje kwemezwa, kuva ku bipimo kugeza ku ifunguro rya mbere." },
    { href: "/docs/galley/materials", title: "Ibikoresho", text: "Ibikoresho, buri gikoresho cy'amashanyarazi na buri gice cy'imiyoboro y'amazi, n'ingano yacyo, aho kukigura n'igiciro cyacyo." },
    { href: "/docs/galley/electric", title: "Amashanyarazi", text: "Umuriro winjira n'imizunguruko cumi n'umwe, icyiciro cya mbere n'icya kabiri cyo gushyiraho, ibizamini na buri priza, itara na isolator." },
    { href: "/docs/galley/plumbing", title: "Imiyoboro y'amazi", text: "Amazi yinjira, amazi ashyushye, imiyoboro y'umwanda igana ku gikusanya amavuta, ibizamini, na buri muyoboro, robine n'aho amazi asohokera." },
  ],
  rails: {
    equipment: {
      box: (w, d, h) => `${w} × ${d}, uburebure ${h}`,
      range: { title: "Amashyiga n'ifuru", note: () => "Amashyiga atandatu ya gaz hejuru y'ifuru ya gaz, kuri LPG (D-065); umuzunguruko wayo ugaburira gusa icyatsa n'itara ry'ifuru." },
      griddle: { title: "Isahani yokeramo", note: () => "Isahani y'icyuma inyuma y'akayoboro k'amavuta, ikoresha gaz LPG (D-065)." },
      fryer: { title: "Ikarangiro", note: () => "Ikigega kimwe, uduseke tubiri, rikoresha gaz LPG (D-065)." },
      hood: { title: "Igikurura umwotsi", size: (w, d, y, duct) => `${w} × ${d}, impera yo hasi kuri ${y} uvuye hasi, umuyoboro wa mm ${duct}`, note: "Igisenge gito cy'icyuma kitagwa ingese, umuyoboro wacyo uzamuka unyuze mu gisenge ugana kuri vantilateri; umurongo wo guteka ukora gusa iyo vantilateri ikora." },
      freezer: { title: "Firizeri ihagaze", note: "Icyuma kitagwa ingese, urugi rumwe, ahateganye n'urugi rw'abakozi." },
      fridge: { title: "Firigo y'inzugi ebyiri", note: "Ihagaze, y'icyuma kitagwa ingese, aho umusaruro, amagi n'ibizanywe bibanza gushyirwa." },
      bench: { title: "Kawunta ikonje", note: "Firigo yo munsi ya kawunta ifite inzugi ebyiri munsi y'urubaho rw'icyuma kitagwa ingese: amagi, amata n'imbuto bya mu gitondo." },
      pass: { title: "Aho ibiryo bitangirwa", size: (w, d, h, g) => `${w} × ${d}, uburebure ${h}, akabaho ko hejuru kuri ${g}`, note: "Akabati gashyushya amasahani munsi y'urubaho rushyushye, amatara atatu ashyushya munsi y'akabaho ko hejuru." },
      worktop: { title: "Kawunta na lavabo ebyiri", note: (pw, pd, pdep, ww, wd, wdep) => `Icyuma kitagwa ingese ku maguru, gifite agatanda ko hasi. Lavabo yo gutegura mm ${pw} × ${pd}, ubujyakuzimu ${pdep}; lavabo yo koza ibyombo mm ${ww} × ${wd}, ubujyakuzimu ${wdep}, ifite igitera amazi cyo kubanza kwoza.` },
      dry: { title: "Utubati tw'ububiko bw'ibiribwa byumye", size: (w, d, n, top) => `${w} × ${d}, udutanda ${n} kugeza kuri ${top}`, note: "Icyuma kitagwa ingese: imifuka y'umuceri, ifu n'ibishyimbo hasi, udusanduku, amavuta, ibibindi n'amakopo hejuru." },
      basin: { title: "Lavabo yo gukaraba intoki", note: "Ni iy'intoki gusa, hafi y'urugi rw'abakozi: robine idakorwaho n'intoki, isabune n'impapuro zo kwihanagura iruhande rwayo." },
      cleaning: { title: "Akabati k'isuku", note: "Imyeyo, indobo n'ibikoresho by'isuku, kure y'ibiribwa." },
      plates: { title: "Akabati k'amasahani", note: "Amasahani, ibikombe n'ibiyiko bisukuye hafi y'urugi rwo kugaburira, hejuru hakaba aho gushyira inyiru." },
      bins: { title: "Udusanduku tw'imyanda dukandagirwa × 2", size: (w, d, h) => `${w} × ${d}, uburebure ${h} buri kamwe`, note: "Kamwe k'ibisigazwa (by'inkoko n'ifumbire), akandi k'imyanda." },
      fire: { title: "Aho kuzimya umuriro", size: "Kizimyamwoto ku cyuma cyacyo, igitambaro kizimya umuriro hejuru yacyo", note: "Ku muriro w'amavuta yo guteka, ku rukuta rw'iburasirazuba hafi y'urugi rwo kugaburira." },
    },
    water: {
      parts: {
        meter: "Robine ifunga, muyunguruzi na konteri", heater: "Icyuma gishyushya amazi", mixer: "Robine ivanga ya lavabo", prerinse: "Igitera amazi cyo kubanza kwoza",
        basintap: "Robine ya lavabo idakorwaho", filter: "Muyunguruzi y'amazi yo kunywa", aav: "Valve yinjiza umwuka", gully: "Umwobo w'amazi wo hasi", greasetrap: "Igikusanya amavuta",
      },
      ppr: { title: "Umuyoboro w'amazi PP-R", note: "Akonje n'ashyushye, PN20, ingingo zisudiye, ku rukuta rw'imbere munsi ya kawunta hanyuma uzamuka kuri buri robine." },
      upvc: { title: "Umuyoboro w'umwanda uPVC", note: "Buri muyoboro w'umwanda umanuka unyuze mu hasi ugana ku gikusanya munsi y'umusingi, ku gipimo cya 1:40 cyangwa birenzeho." },
    },
    electric: {
      board: "Ikibaho cy'amashanyarazi", isolator: "Isolator", outlet: "Udusanduku two guhuza", estop: "Buto yo guhagarika byihutirwa", control: "Igenzura ry'igikurura umwotsi",
      fan: "Vantilateri isohora umwotsi ku gisenge", socket: "Priza ebyiri IP44", single: "Priza ya firigo", batten: "Itara rirerire rya LED IP65", switch: "Agakoresho gacana itara",
      alarm: "Icyuma kimenyesha ubushyuhe", earth: "Inkingi y'ubutaka",
    },
  },
  pointsDrawing: { electric: "gishushanyo cy'amashanyarazi cy'igikoni", plumbing: "gishushanyo cy'imiyoboro y'amazi cy'igikoni" },
  theRuns: "Imiyoboro:",
  json: {
    supply: { title: "Ikibaho cy'ifamu", sub: "V 230 fazi imwe, umugozi ushyinguye", main: "Disijonkitere nkuru A 63 2P", mainSub: "ifite uburinzi bw'umuriro mwinshi" },
    circuits: {
      C1: { serves: "Amatara" }, C2: { serves: "Priza za kawunta, iburengerazuba" }, C3: { serves: "Priza za kawunta, iburasirazuba" },
      C4: { serves: "Firizeri na firigo" }, C5: { serves: "Kawunta ikonje n'aho ibiryo bitangirwa" }, C6: { serves: "Icyatsa amashyiga, itara ry'ifuru na vane ya gaz" },
      C7: { serves: "Vantilateri isohora umwotsi n'amatara y'igikurura umwotsi" }, C8: { serves: "Icyuma gishyushya amazi" },
      C9: { serves: "Uw'inyongera" },
    },
    electric: {
      DB: { what: "Ikibaho cy'amashanyarazi, pole 4, modile 24", size: "Hafi mm 450 × 600, ubujyakuzimu mm 110" },
      L1: { what: "Itara rirerire rya LED, IP65", size: "Uburebure m 1.5" }, L2: { what: "Itara rirerire rya LED, IP65", size: "Uburebure m 1.5" },
      L3: { what: "Itara rirerire rya LED, IP65", size: "Uburebure m 1.5" }, L4: { what: "Itara rirerire rya LED, IP65", size: "Uburebure m 1.5" },
      S1: { what: "Agakoresho gacana itara, two-way, hafi y'urugi rw'abakozi" },
      S2: { what: "Agakoresho gacana itara, two-way, hafi y'urugi rwo kugaburira" },
      P1: { what: "Priza ebyiri IP44, aho umusaruro ushyirwa", size: "mm 146 × 86, zifite ibipfundikizo" },
      P2: { what: "Priza ebyiri IP44, aho gutegurira", size: "mm 146 × 86, zifite ibipfundikizo" },
      P3: { what: "Priza ebyiri IP44, aho gutegurira", size: "mm 146 × 86, zifite ibipfundikizo" },
      P4: { what: "Priza ebyiri IP44, aho ibyombo byanduye bishyirwa", size: "mm 146 × 86, zifite ibipfundikizo" },
      P5: { what: "Priza ya firizeri, hejuru yayo" }, P6: { what: "Priza ya firigo, hejuru yayo" },
      P7: { what: "Priza ebyiri, kawunta ikonje" },
      P8: { what: "Priza ebyiri, aho ibiryo bitangirwa: akabati gashyushya n'amatara ashyushya" },
      Q1: { what: "Isolator y'amashyiga: icyatsa na vane ya gaz", size: "Hafi mm 90 × 140" },
      O1: { what: "Agasanduku ko guhuza amashyiga, inyuma yayo: icyatsa" },
      HC: { what: "Igenzura ry'igikurura umwotsi: umuvuduko wa vantilateri, amatara yacyo, n'interlock y'umurongo wo guteka", size: "Hafi mm 120 × 160" },
      FN: { what: "Vantilateri isohora umwotsi ku gisenge, isolator yayo ku musingi wayo", size: "Vantilateri isohorera hejuru Ø mm 600 ku musingi wa mm 200" },
      Q4: { what: "Isolator y'icyuma gishyushya amazi, impande zombi", size: "Hafi mm 90 × 140" },
      ES: { what: "Buto yo guhagarika byihutirwa umurongo wo guteka, ijya kuri contactor iri mu kibaho", size: "Buto itukura imeze nk'igihumyo, mm 40, mu gasanduku k'umuhondo" },
      HA1: { what: "Icyuma kimenyesha ubushyuhe, bateri y'imyaka 10" }, HA2: { what: "Icyuma kimenyesha ubushyuhe, bateri y'imyaka 10" },
      E1: { what: "Inkingi y'ubutaka mu cyobo cyo kugenzuriramo", size: "Inkingi ya m 1.5, hanze y'uruhande rw'urugi rw'abakozi, hanze y'igishushanyo" },
    },
    water: {
      SV: { what: "Robine ifunga, muyunguruzi Y na konteri ku muyoboro mukuru", where: "Ku rukuta rw'imbere hagati ya lavabo y'intoki n'urugi rw'abakozi, hasi" },
      HB: { what: "Robine ya lavabo yo gukaraba intoki, idakorwaho, ivanga", where: "Kuri lavabo hafi y'urugi rw'abakozi", size: "Ikoreshwa na sensa cyangwa ivi, imiyoboro ya mm 15" },
      PS: { what: "Robine ivanga ya lavabo yo gutegura", where: "Ku idirishya ry'iburengerazuba, aho umusaruro wozwa", size: "Robine ivanga yo kuri kawunta, umunwa uhindukira, imiyoboro ya mm 15" },
      DF: { what: "Muyunguruzi y'amazi yo kunywa na robine yayo", where: "Ku gatanda ko hasi hafi ya lavabo yo gutegura", size: "Ibice bibiri, robine yayo bwite iruhande rwa robine ivanga" },
      WS: { what: "Robine ivanga ya lavabo yo koza ibyombo", where: "Ku idirishya ry'iburasirazuba, ku nkono n'amasahani", size: "Robine ivanga yo kuri kawunta, umunwa uhindukira, imiyoboro ya mm 15" },
      PR: { what: "Igitera amazi cyo kubanza kwoza", where: "Hejuru ya lavabo yo koza ibyombo", size: "Umuyoboro uzamuka wa hafi m 1, umupira ufite isupure n'umutwe utera amazi, ashyushye n'akonje" },
      WH: { what: "Icyuma gishyushya amazi kikayabika, L 100, kW 3", where: "Ku rukuta rw'iburasirazuba hejuru y'udusanduku tw'imyanda, gifite amarobine yacyo bwite", size: "Gihagaze, hafi mm 450 z'ubugari na mm 900 z'uburebure" },
      AV: { what: "Valve yinjiza umwuka", where: "Ku muyoboro w'umwanda wa lavabo yo koza ibyombo, munsi ya kawunta" },
      FG: { what: "Umwobo w'amazi wo hasi ufite agaseke gakurwamo", where: "Mu nzira imbere ya lavabo yo koza ibyombo, hasi ha resin hamanuka hawugana", size: "Akayunguruzo ka mm 150, isohoka rya mm 75" },
      GT: { what: "Igikusanya amavuta", where: "Hanze y'uruhande rw'iburasirazuba, gishyinguye gifite umupfundikizo", size: "Ibyumba bibiri, ingano igenwa n'umufundi w'amazi hakurikijwe amazi y'igikoni" },
      SP: { what: "Icyobo gicengeza cy'igikoni", where: "Munsi y'igikusanya amavuta, hanze y'igishushanyo; ntibijya muri septic tank", size: "Nyuma y'igerageza ry'icengera" },
    },
    runs: {
      W1: { note: "Umuyoboro mukuru uva ku kigega cy'ifamu no kuri pompe yacyo, munsi y'umusingi ugana kuri robine ifunga" },
      W2: { note: "Amazi akonje ku rukuta rw'imbere munsi ya kawunta agana kuri buri robine, hanyuma azamuka ku rukuta rw'iburasirazuba agana ku cyuma gishyushya" },
      H1: { note: "Amazi ashyushye ava ku cyuma gishyushya agaruka ku rukuta rw'imbere agana ku gitera amazi, kuri lavabo zombi no kuri lavabo y'intoki" },
      D1: { note: "Igikusanya munsi y'umusingi ku ruhande rw'imbere, kimanuka kigana iburasirazuba ku gipimo cya 1:40 kigera ku gikusanya amavuta" },
      D2: { note: "Umutego wa lavabo y'intoki umanuka unyuze mu hasi ugana ku gikusanya" },
      D3: { note: "Umutego wa lavabo yo gutegura umanuka ugana ku gikusanya" },
      D4: { note: "Umutego wa lavabo yo koza ibyombo, ufite valve yinjiza umwuka, umanuka ugana ku gikusanya" },
      D5: { note: "Umwobo w'amazi wo hasi umanuka ugana ku gikusanya" },
      D6: { note: "Ufunze munsi y'aho ibyombo byanduye bishyirwa, ku mashini yoza ibyombo yo munsi ya kawunta niba umutetsi ayishaka" },
    },
  },
}

export const words: Words<typeof en> = { en, rw }
