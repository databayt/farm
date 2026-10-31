import type * as React from "react"

import type { Words } from "@/components/internationalization/words"

// Every word of the public bathroom's page, its drawings, its rails and its docs tables (D-058): the English, then its
// Kinyarwanda, a machine draft until a native speaker reviews it. public-bathroom.json keeps its English for the
// render scripts; `json` lays the Kinyarwanda over its rows by point, run or circuit (data.ts).
type L = (href: string, text: string) => React.ReactNode
type Fitting = { what: string; size: string }
type Run = { note: string }
type BathCircuit = { serves: string }
type Point = { what: string }

const en = {
  meta: {
    title: "The public bathroom · Farm",
    description: "Two toilet rooms, a urinal and two hand basins in a teal container by the courtyard, for the camp, the bar lounge and the fire pit, at the Digital Farm near Kigali.",
  },
  hero: {
    title: "Toilets and hand basins for the camp",
    alt: "A teal shipping container on a low fieldstone plinth on a mown lawn at golden hour, two small white-framed windows of frosted glass high on its left and a red door open at its right end under a glowing wall lamp; through the door a white basin on a honey oak counter under a mirror, white wall tiles and a soap dispenser; a stone landing with a concrete cap and one step, terracotta pots of herbs, beds of cannas and bougainvillea at both ends, and acacia trees and banana leaves behind.",
  },
  plan: {
    title: "Plan: a 20 ft container 6,058 by 2,438 mm on a stone plinth, with a 1,500 mm landing and a step in front of its door at the east end of the front wall; inside, one row against the back wall: two toilet rooms 1,350 by 1,200 mm, each with a WC against the back wall, then the urinal in its own room 900 mm wide, then the two basins on a counter straight across from the door, paper towels and a bin on the end wall beside them and a floor drain; a 900 mm corridor along the front wall, under the two windows, joins them and ends at the cleaner's cupboard.",
    labels: {
      wc: "WC", corridor: "CORRIDOR", cleaning: "CLEANING", basins: "BASINS", towels: "TOWELS", lobby: "LOBBY", urinal: "URINAL",
      window: "WINDOW", landing: "LANDING", step: "STEP", bathroom: "PUBLIC BATHROOM", courtyard: "TOWARD THE COURTYARD", door: "DOOR",
    },
  },
  model: {
    lineAlt: "Line drawing of the bathroom from the courtyard with its front wall and roof off: the container on its plinth, the landing and the step at the east end; along the back wall in one row, two toilet rooms each with a WC facing its door and a roll holder, the urinal in a room of its own with its flush valve and an extract fan, then two bowls on a counter under a long mirror with a soap dispenser, paper towels over a bin on the end wall and a floor drain; the row's front wall and the cleaner's cupboard cut low along the corridor.",
    realAlt: "The same view rendered: teal corrugated steel on a fieldstone plinth, white wall tiles under off-white paint, warm grey floor tiles, white WCs, a white urinal and two white bowls, chrome taps, a Medium Oak counter and cleaner's cupboard, a long mirror, and a concrete-capped landing and step on the lawn.",
  },
  build: {
    title: "Build",
    baseAlt: "The bathroom's container from straight above, roof off: its bare floor inside the teal walls, the linings tiled, on the fieldstone plinth, with the landing and the step in front.",
    labels: [
      "First fix: the supply along the walls and the drains up through the floor.",
      "The partitions stood up and lined.",
      "The floor tiled, falling to the drain.",
      "The fittings set: the cupboard, the WCs, the basins, the urinal.",
    ],
    stages: [
      { title: "The box", text: "A 20 ft container on its fieldstone plinth, its outer walls lined and tiled to 1.5 m, its own floor still bare." },
      { title: "Step 1 · First fix", text: "PP-R supply in the linings 300 mm up; uPVC drains under the floor and out through the plinth; every pipe held at 10 bar for an hour before anything closes over it." },
      { title: "Step 2 · Partitions", text: "Timber studs, cement board both sides, 100 mm: between the toilet rooms and the urinal room, and along the front of the row with its three doors." },
      { title: "Step 3 · Floor", text: "Non-slip tiles in warm grey, falling to the lobby's floor drain so the whole floor can be washed down." },
      { title: "Step 4 · Fittings", text: "The cleaner's cupboard, the two WCs and their roll holders, the basin counter with its mirror and soap, the towels and the urinal." },
    ],
  },
  fixtures: "Fixtures",
  electric: {
    figureAlt: "Line drawing of the bathroom from the courtyard, faint, with every device dark and every cable route: the unit board in the lobby on the urinal room's east wall, blue runs up into the ceiling and along the row to a round light in each toilet room, the urinal room, the corridor and the lobby, and down to the extract fan over the urinal; another blue run to the front wall over the door; an orange run along the ceiling and down to the cleaner's socket by the cupboard.",
    note: (link: L): React.ReactNode => <>
      Every run goes up into the ceiling void, along it and straight down to its device. Each tag opens its row in the{" "}
      {link("/docs/public-bathroom/electric#points", "points table")}. Outside the drawing: the light over
      the door (L6) on the front wall, which the drawing leaves off, and the earth rod (E1) in a pit behind the back
      wall below the board. The board&rsquo;s feeder comes from the farm&rsquo;s site board, sized when that is designed.
    </>,
    caption: "Rendered from the design model, at dusk with the lights on",
    realAlt: "The same view rendered at dusk: a round ceiling light glowing over each toilet room, the urinal room, the corridor and the lobby, the white unit board on the urinal room's east wall and the extract fan's grille over the urinal.",
  },
  plumbing: {
    figureAlt: "Line drawing of the bathroom from the courtyard, faint, with its fittings dark and every pipe run: cold in blue from the stop valve in the cleaner's cupboard along the west end wall and the back wall, up to the two WC cisterns, the urinal's flush valve and the two basin taps; the drains in brown under the floor, the WCs' soil run and the basins', the floor drain's and the urinal's waste run leaving through the back of the plinth for the inspection chamber; the vent in grey up the back wall.",
    note: (link: L): React.ReactNode => <>
      Supplies run in the linings, then straight up to each outlet; drains run under the floor in the plinth. A run is
      dashed where a wall, the floor or the plinth hides it. Each tag opens its row in the{" "}
      {link("/docs/public-bathroom/plumbing#points", "points table")}. Behind the back wall, off the
      floor: IC1 takes both runs, and S1 carries them to the farm&rsquo;s septic tank and soakaway, at least 50 m from
      the borehole. That tank was sized for the two studios; the campers, the bar and the fire pit must be added
      before it is built. Cold only: a shower, should the founder add one, would bring the solar water heater the
      power guide plans for this building.
    </>,
    caption: <>Rendered from the design model, the floor, the tiles and the plinth see-through, the pipes in the diagram&rsquo;s colours</> as React.ReactNode,
    realAlt: "The same view rendered with the floor, the wall tiles and the plinth see-through: the brown drains under the toilet rooms, the urinal room and the lobby, from each WC, the urinal, the basins and the floor drain, out through the back; the blue supply along the back wall and up to the cisterns, the urinal's valve and the taps; the grey vent rising behind the back wall.",
  },
  docs: [
    { href: "/docs/public-bathroom", title: "Execution plan", text: "Every step of building the bathroom, the septic sized for its users first, from the survey to the first guest." },
    { href: "/docs/public-bathroom/materials", title: "Materials", text: "The fixtures, each electric device and each plumbing part, with its size, where to buy it and its cost." },
    { href: "/docs/public-bathroom/electric", title: "Electric", text: "The board and its four circuits, the first and second fix, the tests and every light, fan and socket." },
    { href: "/docs/public-bathroom/plumbing", title: "Plumbing", text: "The supply, the drains and the vent to the septic tank, the 10 bar test, and every run and fitting." },
  ],
  rails: {
    fixtures: {
      wc: { title: "WCs × 2", size: (w: string, d: string, h: string, out: string, seat: string) => `Floor-standing, close-coupled cistern ${w} × ${d} mm, ${h} mm high; ${out} mm into the room, seat at ${seat} mm`,
        note: "One against each toilet room's back wall, facing the door, with a soft-close seat and a dual-flush button." },
      basin: { title: "Basin counter", size: (w: string, d: string, top: string) => `${w} × ${d} m, top at ${top} m; two bowls`,
        note: "Two white bowls on a Medium Oak counter on black steel brackets, open below so the floor washes clean; a push tap behind each bowl." },
      urinal: { title: "Urinal", size: (w: string, rim: string, out: string) => `${w} mm wide, rim at ${rim} mm, ${out} mm from the wall`,
        note: "In its own room in the row, between the toilet rooms and the basins, its flush valve above it, so nobody at the basins sees it." },
      mirror: { title: "Mirror", size: (w: string, h: string) => `${w} × ${h} m`, note: "Over the counter, in a thin black frame." },
      soap: { title: "Soap dispenser", size: "About 100 × 80 × 170 mm", note: "One between the two bowls." },
      towels: { title: "Paper towels and bin", size: (w: string, bin: string) => `Dispenser ${w} mm wide; lidded bin Ø ${bin} mm, 0.5 m high`, note: "On the east end wall beside the counter." },
      roll: { title: "Roll holders × 2", size: "One roll, on the wall beside each WC", note: (at: string) => `About ${at} mm above the floor.` },
      cupboard: { title: "Cleaner's cupboard", size: (w: string, d: string) => `${w} × ${d} m, floor to ceiling`, where: "Built in the workshop, like the studio's units",
        note: "At the corridor's end: a mop and bucket below, shelves of paper, soap and cleaning things above, the stop valve and meter low inside." },
    },
    plumbing: {
      metres: (m: string, dn: number) => `${m} m of DN${dn}`,
      meter: { title: "Stop valve, filter and meter", size: (s: string) => `${s}, on the main` },
      pushtap: { title: "Push taps × 2", size: "Cold, a push button that closes itself", note: "BT1, BT2 · so no tap is left running." },
      flushvalve: { title: "Urinal flush valve", size: "A timed push button on a 15 mm feed" },
      floordrain: { title: "Floor drain", note: (what: string) => `FD · ${what}, so the lobby can be washed down.` },
      chamber: { title: "Inspection chamber" },
      ppr: { title: "PP-R supply pipe", size: (m: string) => `${m}, PN20, welded joints`, note: "In the linings 300 mm above the floor, then straight up to each outlet." },
      upvc: { title: "uPVC drain pipe", note: "Under the floor and through the plinth, each run falling at least 1:40, a rodding eye at every bend." },
      vent: { title: "Vent and its cage", note: "V1 · up the back wall outside, to 900 mm above the roof." },
    },
    electric: {
      board: { title: "Unit board" },
      light: { title: (n: number) => `Ceiling lights × ${n}`, size: "Ø 300 mm, a motion sensor in the middle", note: "L1–L5 · each room lights when someone walks in and goes dark a few minutes after." },
      fan: { title: "Extract fan", size: (d: string) => `Ø ${d} mm grille`, note: "F1 · in the urinal room, which has no window; it runs with the light and 15 minutes after." },
      socket: { title: "Socket", size: "Double, 146 × 86 mm", note: "P1 · for the cleaner, by the cupboard." },
      walllight: { title: "Light over the door", size: "About 180 × 140 mm, IP65", note: "L6 · outside, on with the path lights from 18:00." },
    },
  },
  pipeDiagram: {
    label: "Water diagram: the farm's water through the bathroom's stop valve, filter and meter in the cleaner's cupboard; cold along the back wall to the two WC cisterns, the two basin push taps and the urinal's flush valve; the WCs drain through a 110 mm soil run, the basins, the floor drain and the urinal through a 50 mm waste run, both to an inspection chamber behind the back wall and on to the farm's septic tank and soakaway; a 75 mm vent rises up the back wall",
    farmWater: { title: "Farm water", sub: "tank + booster pump" },
    valve: { title: "Stop valve", sub: "SV · filter · meter" },
    key: { cold: "Cold", drain: "Drain", vent: "Vent" },
    coldOnly: "Cold only: nothing here needs hot water",
    units: {
      WC1: { title: "WC cistern", sub: "WC1 · dual flush" }, WC2: { title: "WC cistern", sub: "WC2 · dual flush" },
      BT1: { title: "Basin", sub: "BT1 · push tap" }, BT2: { title: "Basin", sub: "BT2 · push tap" },
      FD: { title: "Floor drain", sub: "FD · lobby, trapped" }, UV: { title: "Urinal", sub: "UV · flush valve" },
      IC: { title: "IC1", sub: "inspection chamber" }, septic: { title: "Septic tank", sub: "the farm's, + soakaway" },
    },
    ventTag: "900 above the roof",
    notes: [
      "Supply in PP-R PN20 in the linings, 300 mm up, then straight up to each outlet · drains in uPVC under the floor and through the plinth, falling at least 1:40 · lengths measured off the 3D’s runs",
      "Every pipe pressure-tested at 10 bar for an hour before the tiles · the septic tank sits at least 50 m from the borehole · design intent until a licensed plumber signs it off",
    ],
  },
  wiringDiagram: {
    label: (n: number) => `Single-line diagram: a feeder from the farm's site board into the bathroom's unit board, a main switch with surge protection, then one RCBO for each of ${n} circuits: the indoor lights and the extract fan, the light over the door on a time switch, the cleaner's socket and a spare`,
    siteBoard: "Site board", feeder: "the farm’s feeder", sized: "sized with the site board",
    main: "Main switch", mainSub: "DB · in the lobby", spd: "SPD type 2", earth: "E1 · the building’s rod",
    groups: { lights: "Lights", sockets: "Socket", spare: "Spare" } as Record<string, string>,
    note: "One RCBO 30 mA type A per circuit · TT earthing on the building’s rod · ratings are design intent until a RURA class A electrician certifies",
    // a point's words under its circuit; empty in English, where the drawing shortens the point's own words
    short: {} as Record<string, string>,
  },
  table: { sizeOrCircuit: "Size or circuit", pipes: "Pipes", earth: "Earth" },
  pointsDrawing: { electric: "bathroom's electrical drawing", plumbing: "bathroom's plumbing drawing" },
  // public-bathroom.json's words, by point, run or circuit
  json: {
    fittings: {} as Record<string, Partial<Fitting>>,
    runs: {} as Record<string, Partial<Run>>,
    circuits: {} as Record<string, Partial<BathCircuit>>,
    points: {} as Record<string, Partial<Point>>,
    board: null as Fitting | null,
  },
}

const rw: typeof en = {
  meta: {
    title: "Ubwiherero rusange · Ifamu",
    description: "Ibyumba bibiri by'imisarani, inkari na lavabo ebyiri zo gukaraba intoki mu ikontineri y'ubururu bwerurutse hafi y'urugo, by'aho bakambika, akabari n'aho bacana umuriro, kuri Digital Farm hafi ya Kigali.",
  },
  hero: {
    title: "Imisarani na lavabo zo gukaraba intoki z'aho bakambika",
    alt: "Ikontineri y'ubururu bwerurutse iri ku musingi mugufi w'amabuye ku byatsi byakaswe izuba rirenga, amadirishya mato abiri afite amakadiri y'umweru n'ibirahure bitabonerana hejuru ku ruhande rw'ibumoso, n'urugi rutukura rufunguye ku mpera y'iburyo munsi y'itara ryo ku rukuta ryaka; unyuze mu rugi, lavabo y'umweru kuri kawunta y'igiti cy'ibara ry'ubuki munsi y'indorerwamo, amakaro y'umweru ku rukuta n'agacupa k'isabune; urubuga rw'amabuye rusakajwe beto n'intambwe imwe, inkono z'ibumba zirimo ibyatsi bihumura, imirima y'indabo za canna na bougainvillea ku mpera zombi, n'ibiti by'imishishi n'amababi y'insina inyuma.",
  },
  plan: {
    title: "Igishushanyo: ikontineri ya metero 6 (20 ft), mm 6,058 kuri 2,438, ku musingi w'amabuye, ifite urubuga rwa mm 1,500 n'intambwe imbere y'urugi rwayo ku mpera y'iburasirazuba y'urukuta rw'imbere; imbere, umurongo umwe ku rukuta rw'inyuma: ibyumba bibiri by'imisarani bya mm 1,350 kuri 1,200, buri kimwe gifite umusarani ku rukuta rw'inyuma, hanyuma inkari mu cyumba cyazo cy'ubugari bwa mm 900, hanyuma lavabo ebyiri kuri kawunta ahateganye n'urugi, impapuro zo kwihanagura n'agasanduku k'imyanda ku rukuta rw'impera iruhande rwazo n'umwobo w'amazi wo hasi; inzira ya mm 900 ku rukuta rw'imbere, munsi y'amadirishya abiri, irabihuza ikarangirira ku kabati k'usukura.",
    labels: {
      wc: "WC", corridor: "INZIRA", cleaning: "ISUKU", basins: "LAVABO", towels: "IMPAPURO", lobby: "IBARAZA", urinal: "INKARI",
      window: "IDIRISHYA", landing: "URUBUGA", step: "INTAMBWE", bathroom: "UBWIHERERO RUSANGE", courtyard: "HAREBA KU RUGO", door: "URUGI",
    },
  },
  model: {
    lineAlt: "Igishushanyo cy'imirongo cy'ubwiherero kirebwa uturutse ku rugo, urukuta rw'imbere n'igisenge byakuweho: ikontineri ku musingi wayo, urubuga n'intambwe ku mpera y'iburasirazuba; ku rukuta rw'inyuma mu murongo umwe, ibyumba bibiri by'imisarani buri kimwe gifite umusarani ureba urugi rwacyo n'icyo kumanikaho impapuro, inkari mu cyumba cyazo zifite valve yazo yo gusukura na vantilateri isohora umwuka, hanyuma ibase ebyiri kuri kawunta munsi y'indorerwamo ndende ifite agacupa k'isabune, impapuro zo kwihanagura hejuru y'agasanduku k'imyanda ku rukuta rw'impera n'umwobo w'amazi wo hasi; urukuta rw'imbere rw'umurongo n'akabati k'usukura byaciwe hasi ku nzira.",
    realAlt: "Ishusho imwe yakozwe nk'ifoto: amabati y'ubururu bwerurutse ku musingi w'amabuye, amakaro y'umweru ku nkuta munsi y'irangi ry'umweru wijimye gato, amakaro yo hasi y'ivu rishyushye, imisarani y'umweru, inkari z'umweru n'ibase ebyiri z'umweru, amarobine ya kirome, kawunta n'akabati k'usukura bya Medium Oak, indorerwamo ndende, n'urubuga rusakajwe beto n'intambwe ku byatsi.",
  },
  build: {
    title: "Kubaka",
    baseAlt: "Ikontineri y'ubwiherero irebwa uturutse hejuru neza, igisenge cyakuweho: hasi hayo hatarubakwa imbere y'inkuta z'ubururu bwerurutse, inkuta zishyizweho amakaro, ku musingi w'amabuye, urubuga n'intambwe imbere.",
    labels: [
      "Icyiciro cya mbere: amazi yinjira ku nkuta n'imiyoboro y'umwanda izamuka inyuze mu hasi.",
      "Inkuta zo hagati zihagarikwa zigatwikirwa.",
      "Hasi hashyirwa amakaro, hamanuka hagana ku mwobo w'amazi.",
      "Ibikoresho bishyirwaho: akabati, imisarani, lavabo, inkari.",
    ],
    stages: [
      { title: "Ikontineri", text: "Ikontineri ya metero 6 (20 ft) ku musingi wayo w'amabuye, inkuta zayo z'inyuma zitwikiriwe kandi zishyizweho amakaro kugeza kuri m 1.5, hasi hayo hakiri ubusa." },
      { title: "Intambwe ya 1 · Icyiciro cya mbere", text: "Imiyoboro y'amazi PP-R mu nkuta kuri mm 300 uvuye hasi; imiyoboro y'umwanda uPVC munsi y'hasi isohoka inyuze mu musingi; buri muyoboro ugeragezwa kuri bar 10 mu isaha imwe mbere y'uko hari ikiwupfuka." },
      { title: "Intambwe ya 2 · Inkuta zo hagati", text: "Inkingi z'imbaho, imbaho za sima ku mpande zombi, mm 100: hagati y'ibyumba by'imisarani n'icyumba cy'inkari, no ku ruhande rw'imbere rw'umurongo rufite inzugi zarwo eshatu." },
      { title: "Intambwe ya 3 · Hasi", text: "Amakaro atanyerera y'ivu rishyushye, amanuka agana ku mwobo w'amazi wo mu ibaraza kugira ngo hasi hose hashobore kozwa." },
      { title: "Intambwe ya 4 · Ibikoresho", text: "Akabati k'usukura, imisarani ibiri n'ibyo kumanikaho impapuro, kawunta ya lavabo ifite indorerwamo n'isabune, impapuro zo kwihanagura n'inkari." },
    ],
  },
  fixtures: "Ibikoresho",
  electric: {
    figureAlt: "Igishushanyo cy'imirongo cy'ubwiherero kirebwa uturutse ku rugo, cyoroheje, buri gikoresho cyijimye n'inzira ya buri mugozi: ikibaho mu ibaraza ku rukuta rw'iburasirazuba rw'icyumba cy'inkari, imirongo y'ubururu izamuka mu gisenge ikagenda ku murongo w'ibyumba igana ku itara ry'uruziga muri buri cyumba cy'umusarani, mu cyumba cy'inkari, mu nzira no mu ibaraza, ikamanuka kuri vantilateri isohora umwuka iri hejuru y'inkari; undi murongo w'ubururu ujya ku rukuta rw'imbere hejuru y'urugi; umurongo w'icunga ku gisenge umanuka kuri priza y'usukura hafi y'akabati.",
    note: (link) => <>
      Buri muyoboro uzamuka ujya mu mwanya uri hejuru y&rsquo;igisenge, ukawukurikira ukamanuka ku gikoresho cyawo. Buri kimenyetso gifungura umurongo wacyo mu{" "}
      {link("/docs/public-bathroom/electric#points", "mbonerahamwe y'ahantu")}. Hanze y&rsquo;igishushanyo: itara riri hejuru
      y&rsquo;urugi (L6) ku rukuta rw&rsquo;imbere, igishushanyo kitagaragaza, n&rsquo;inkingi y&rsquo;ubutaka (E1) mu cyobo inyuma
      y&rsquo;urukuta rw&rsquo;inyuma munsi y&rsquo;ikibaho. Umugozi ugaburira ikibaho uva ku kibaho cy&rsquo;ifamu, ingano yawo
      ikazagenwa icyo kibaho nigishushanywa.
    </>,
    caption: "Byakozwe uhereye ku gishushanyo mbonera, ku mugoroba amatara yaka",
    realAlt: "Ishusho imwe yakozwe nk'ifoto ku mugoroba: itara ry'uruziga ryaka ku gisenge cya buri cyumba cy'umusarani, icyumba cy'inkari, inzira n'ibaraza, ikibaho cy'umweru ku rukuta rw'iburasirazuba rw'icyumba cy'inkari n'akayunguruzo ka vantilateri hejuru y'inkari.",
  },
  plumbing: {
    figureAlt: "Igishushanyo cy'imirongo cy'ubwiherero kirebwa uturutse ku rugo, cyoroheje, ibikoresho byacyo byijimye na buri muyoboro: amazi akonje mu bururu ava kuri robine ifunga iri mu kabati k'usukura, akurikira urukuta rw'iburengerazuba n'urw'inyuma, azamuka ku bigega bibiri by'imisarani, kuri valve yo gusukura inkari no ku marobine abiri ya lavabo; imiyoboro y'umwanda mu kigina munsi y'hasi, umuyoboro w'imisarani n'uwa lavabo, uw'umwobo w'amazi wo hasi n'uw'inkari isohoka inyuze inyuma y'umusingi igana ku cyobo cyo kugenzuriramo; umuyoboro w'umwuka mu ibara ry'ivu uzamuka ku rukuta rw'inyuma.",
    note: (link) => <>
      Imiyoboro izana amazi inyura mu nkuta, hanyuma ikazamuka igana kuri buri robine; imiyoboro y&rsquo;umwanda inyura munsi y&rsquo;hasi mu
      musingi. Umuyoboro ugaragazwa n&rsquo;utudomo aho urukuta, hasi cyangwa umusingi biwuhisha. Buri kimenyetso gifungura umurongo wacyo mu{" "}
      {link("/docs/public-bathroom/plumbing#points", "mbonerahamwe y'ahantu")}. Inyuma y&rsquo;urukuta rw&rsquo;inyuma, hanze
      y&rsquo;igishushanyo: IC1 yakira imiyoboro yombi, naho S1 ikayijyana kuri septic tank y&rsquo;ifamu n&rsquo;icyobo gicengeza,
      nibura m 50 uvuye ku iriba. Iyo septic tank yateganyirijwe sitidiyo zombi; abakambika, akabari n&rsquo;aho bacana umuriro
      bigomba kongerwamo mbere y&rsquo;uko yubakwa. Amazi akonje gusa: douche, nyir&rsquo;ifamu aramutse ayongeyeho, yazana icyuma
      gishyushya amazi gikoresha izuba inyandiko y&rsquo;amashanyarazi iteganyiriza iyi nyubako.
    </>,
    caption: <>Byakozwe uhereye ku gishushanyo mbonera, hasi, amakaro n&rsquo;umusingi bibonerana, imiyoboro mu mabara y&rsquo;igishushanyo</>,
    realAlt: "Ishusho imwe yakozwe nk'ifoto hasi, amakaro yo ku nkuta n'umusingi bibonerana: imiyoboro y'umwanda y'ikigina munsi y'ibyumba by'imisarani, icyumba cy'inkari n'ibaraza, iva kuri buri musarani, inkari, lavabo n'umwobo w'amazi wo hasi, isohoka inyuma; umuyoboro w'amazi w'ubururu ku rukuta rw'inyuma uzamuka ku bigega, kuri valve y'inkari no ku marobine; umuyoboro w'umwuka w'ivu uzamuka inyuma y'urukuta rw'inyuma.",
  },
  docs: [
    { href: "/docs/public-bathroom", title: "Gahunda y'imirimo", text: "Buri ntambwe yo kubaka ubwiherero, septic tank ibanje kugenerwa ingano hakurikijwe abazabukoresha, kuva ku bipimo kugeza ku mushyitsi wa mbere." },
    { href: "/docs/public-bathroom/materials", title: "Ibikoresho", text: "Ibikoresho by'ubwiherero, buri gikoresho cy'amashanyarazi na buri gice cy'imiyoboro y'amazi, n'ingano yacyo, aho kukigura n'igiciro cyacyo." },
    { href: "/docs/public-bathroom/electric", title: "Amashanyarazi", text: "Ikibaho n'imizunguruko yacyo ine, icyiciro cya mbere n'icya kabiri cyo gushyiraho, ibizamini na buri tara, vantilateri na priza." },
    { href: "/docs/public-bathroom/plumbing", title: "Imiyoboro y'amazi", text: "Amazi yinjira, imiyoboro y'umwanda n'umuyoboro w'umwuka bigana kuri septic tank, igerageza rya bar 10, na buri muyoboro n'igikoresho." },
  ],
  rails: {
    fixtures: {
      wc: { title: "Imisarani × 2", size: (w, d, h, out, seat) => `Ihagaze hasi, ikigega gifatanye nayo mm ${w} × ${d}, uburebure mm ${h}; yinjira mm ${out} mu cyumba, intebe kuri mm ${seat}`,
        note: "Umwe ku rukuta rw'inyuma rwa buri cyumba cy'umusarani, ureba urugi, ufite intebe ifunga buhoro na buto yo gusukura y'ibice bibiri." },
      basin: { title: "Kawunta ya lavabo", size: (w, d, top) => `m ${w} × ${d}, hejuru kuri m ${top}; ibase ebyiri`,
        note: "Ibase ebyiri z'umweru kuri kawunta ya Medium Oak ku byuma by'umukara, ifunguye munsi kugira ngo hasi hozwe neza; robine ikandwa inyuma ya buri base." },
      urinal: { title: "Inkari", size: (w, rim, out) => `Ubugari mm ${w}, umunwa kuri mm ${rim}, mm ${out} uvuye ku rukuta`,
        note: "Mu cyumba cyazo mu murongo, hagati y'ibyumba by'imisarani na lavabo, valve yazo yo gusukura hejuru yazo, kugira ngo nta muntu uri kuri lavabo uzibona." },
      mirror: { title: "Indorerwamo", size: (w, h) => `m ${w} × ${h}`, note: "Hejuru ya kawunta, mu ikadiri y'umukara yoroshye." },
      soap: { title: "Agacupa k'isabune", size: "Hafi mm 100 × 80 × 170", note: "Kamwe hagati y'ibase zombi." },
      towels: { title: "Impapuro zo kwihanagura n'agasanduku k'imyanda", size: (w, bin) => `Igitanga impapuro cy'ubugari bwa mm ${w}; agasanduku gafite umupfundikizo Ø mm ${bin}, uburebure m 0.5`, note: "Ku rukuta rw'iburasirazuba iruhande rwa kawunta." },
      roll: { title: "Ibyo kumanikaho impapuro × 2", size: "Umuzingo umwe, ku rukuta iruhande rwa buri musarani", note: (at) => `Hafi mm ${at} hejuru y'hasi.` },
      cupboard: { title: "Akabati k'usukura", size: (w, d) => `m ${w} × ${d}, kuva hasi kugeza ku gisenge`, where: "Kakorewe mu iduka ry'ububaji, nk'utubati twa sitidiyo",
        note: "Ku mpera y'inzira: umweyo n'indobo hasi, udutanda tw'impapuro, isabune n'ibikoresho by'isuku hejuru, robine ifunga na konteri hasi imbere." },
    },
    plumbing: {
      metres: (m, dn) => `m ${m} za DN${dn}`,
      meter: { title: "Robine ifunga, muyunguruzi na konteri", size: (s) => `${s}, ku muyoboro mukuru` },
      pushtap: { title: "Robine zikandwa × 2", size: "Akonje, buto ikandwa yifunga ubwayo", note: "BT1, BT2 · kugira ngo nta robine isigara ifunguye." },
      flushvalve: { title: "Valve yo gusukura inkari", size: "Buto ikandwa ifite igihe, ku muyoboro wa mm 15" },
      floordrain: { title: "Umwobo w'amazi wo hasi", note: (what) => `FD · ${what}, kugira ngo ibaraza rishobore kozwa.` },
      chamber: { title: "Icyobo cyo kugenzuriramo" },
      ppr: { title: "Umuyoboro w'amazi PP-R", size: (m) => `${m}, PN20, ingingo zisudiye`, note: "Mu nkuta kuri mm 300 hejuru y'hasi, hanyuma uzamuka ugana kuri buri robine." },
      upvc: { title: "Umuyoboro w'umwanda uPVC", note: "Munsi y'hasi no mu musingi, buri muyoboro umanuka nibura ku gipimo cya 1:40, aho gusukurira kuri buri ihindukira." },
      vent: { title: "Umuyoboro w'umwuka n'akazu kawo", note: "V1 · uzamuka ku rukuta rw'inyuma hanze, kugeza kuri mm 900 hejuru y'igisenge." },
    },
    electric: {
      board: { title: "Ikibaho cy'amashanyarazi" },
      light: { title: (n) => `Amatara yo ku gisenge × ${n}`, size: "Ø mm 300, sensa y'urujya n'uruza hagati", note: "L1–L5 · buri cyumba kirabona iyo hari uwinjiye, kikazima nyuma y'iminota mike." },
      fan: { title: "Vantilateri isohora umwuka", size: (d) => `Akayunguruzo Ø mm ${d}`, note: "F1 · mu cyumba cy'inkari, kidafite idirishya; ikora hamwe n'itara n'iminota 15 nyuma yaho." },
      socket: { title: "Priza", size: "Ebyiri, mm 146 × 86", note: "P1 · y'usukura, hafi y'akabati." },
      walllight: { title: "Itara hejuru y'urugi", size: "Hafi mm 180 × 140, IP65", note: "L6 · hanze, ryaka hamwe n'amatara y'inzira guhera saa 18:00." },
    },
  },
  pipeDiagram: {
    label: "Igishushanyo cy'amazi: amazi y'ifamu anyura kuri robine ifunga y'ubwiherero, muyunguruzi na konteri biri mu kabati k'usukura; akonje akurikira urukuta rw'inyuma ajya ku bigega bibiri by'imisarani, ku marobine abiri ya lavabo akandwa no kuri valve yo gusukura inkari; imisarani isohokera mu muyoboro w'umwanda w'imisarani wa mm 110, lavabo, umwobo w'amazi wo hasi n'inkari bigasohokera mu muyoboro w'umwanda wa mm 50, yombi igana ku cyobo cyo kugenzuriramo inyuma y'urukuta rw'inyuma igakomeza kuri septic tank y'ifamu n'icyobo gicengeza; umuyoboro w'umwuka wa mm 75 uzamuka ku rukuta rw'inyuma",
    farmWater: { title: "Amazi y'ifamu", sub: "ikigega + pompe" },
    valve: { title: "Robine ifunga", sub: "SV · muyunguruzi · konteri" },
    key: { cold: "Akonje", drain: "Umwanda", vent: "Umwuka" },
    coldOnly: "Akonje gusa: nta na kimwe hano gikenera amazi ashyushye",
    units: {
      WC1: { title: "Ikigega cy'umusarani", sub: "WC1 · gusukura kabiri" }, WC2: { title: "Ikigega cy'umusarani", sub: "WC2 · gusukura kabiri" },
      BT1: { title: "Lavabo", sub: "BT1 · robine ikandwa" }, BT2: { title: "Lavabo", sub: "BT2 · robine ikandwa" },
      FD: { title: "Umwobo wo hasi", sub: "FD · ibaraza, ufite umutego" }, UV: { title: "Inkari", sub: "UV · valve yo gusukura" },
      IC: { title: "IC1", sub: "icyobo cyo kugenzuriramo" }, septic: { title: "Septic tank", sub: "y'ifamu, + icyobo gicengeza" },
    },
    ventTag: "900 hejuru y'igisenge",
    notes: [
      "Amazi mu miyoboro PP-R PN20 mu nkuta, kuri mm 300, hanyuma azamuka kuri buri robine · imiyoboro y'umwanda uPVC munsi y'hasi no mu musingi, imanuka nibura ku gipimo cya 1:40 · uburebure bwapimwe ku miyoboro ya 3D",
      "Buri muyoboro ugeragezwa kuri bar 10 mu isaha imwe mbere y'amakaro · septic tank iri nibura kuri m 50 uvuye ku iriba · ibyateganyijwe kugeza umufundi w'amazi ufite uruhushya abyemeje",
    ],
  },
  wiringDiagram: {
    label: (n) => `Igishushanyo cy'umurongo umwe: umugozi uva ku kibaho cy'ifamu ugana ku kibaho cy'ubwiherero, disijonkitere nkuru ifite uburinzi bw'umuriro mwinshi, hanyuma RCBO imwe kuri buri muzunguruko muri ${n}: amatara y'imbere na vantilateri isohora umwuka, itara riri hejuru y'urugi rigenzurwa n'isaha, priza y'usukura n'umuzunguruko w'inyongera`,
    siteBoard: "Ikibaho cy'ifamu", feeder: "umugozi w'ifamu", sized: "ingano igenwa hamwe n'ikibaho cy'ifamu",
    main: "Disijonkitere nkuru", mainSub: "DB · mu ibaraza", spd: "SPD ubwoko bwa 2", earth: "E1 · inkingi y'ubutaka y'inyubako",
    groups: { lights: "Amatara", sockets: "Priza", spare: "Uw'inyongera" },
    note: "RCBO imwe ya mA 30 ubwoko A kuri buri muzunguruko · ubutaka bwa TT ku nkingi y'inyubako · ibipimo ni ibyateganyijwe kugeza umutekinisiye w'amashanyarazi wo mu cyiciro A cya RURA abyemeje",
    short: {
      L1: "icyumba cya mbere", L2: "icyumba cya kabiri", L3: "inzira", L4: "ibaraza", L5: "icyumba cy'inkari", F1: "Vantilateri",
      L6: "Itara hejuru y'urugi", P1: "Priza y'usukura",
    },
  },
  table: { sizeOrCircuit: "Ingano cyangwa umuzunguruko", pipes: "Imiyoboro", earth: "Ubutaka" },
  pointsDrawing: { electric: "gishushanyo cy'amashanyarazi cy'ubwiherero", plumbing: "gishushanyo cy'imiyoboro y'amazi cy'ubwiherero" },
  json: {
    fittings: {
      SV: { what: "Robine ifunga, muyunguruzi na konteri ku muyoboro mukuru, hasi mu kabati k'usukura" },
      WC1: { what: "Icyumba cya mbere cy'umusarani: ikigega gifatanye n'umusarani, kuri valve yacyo", size: "Gusukura kabiri, isohoka rya mm 110" },
      WC2: { what: "Icyumba cya kabiri cy'umusarani: ikigega gifatanye n'umusarani, kuri valve yacyo", size: "Gusukura kabiri, isohoka rya mm 110" },
      BT1: { what: "Robine ya lavabo ikandwa yifunga ubwayo, n'umutego wayo", size: "Akonje, umuyoboro w'umwanda wa mm 40" },
      BT2: { what: "Robine ya lavabo ikandwa yifunga ubwayo, n'umutego wayo", size: "Akonje, umuyoboro w'umwanda wa mm 40" },
      FD: { what: "Umwobo w'amazi wo hasi ufite umutego mu ibaraza, hasi hamanuka hawugana", size: "Akayunguruzo ka mm 150, isohoka rya mm 50" },
      UV: { what: "Valve yo gusukura inkari, buto ikandwa ifite igihe, n'umutego wazo", size: "Akonje, umutego wa mm 40 ujya mu muyoboro wa mm 50" },
      IC1: { what: "Icyobo cyo kugenzuriramo inyuma y'urukuta rw'inyuma: D1 na D5 byinjira, S1 isohoka igana kuri septic tank", size: "Hafi mm 450 × 450, umupfundikizo ufunze neza" },
      VT: { what: "Umutwe w'umuyoboro w'umwuka ufite akazu, mm 900 hejuru y'igisenge" },
    },
    runs: {
      W1: { note: "Umuyoboro mukuru uva ku kigega cy'ifamu no kuri pompe yacyo, munsi y'inyuma y'umusingi no munsi y'hasi h'icyumba cya mbere cy'umusarani, uzamuka mu kabati k'usukura ugera kuri SV" },
      W2: { note: "Uva kuri SV ukurikira urukuta rw'iburengerazuba mu nkuta, kuri mm 300, hanyuma ukajya iburasirazuba mu rukuta rw'inyuma, inyuma ya buri gikoresho, ukagera kuri lavabo ya kabiri" },
      W3: { note: "Uva kuri W2, uzamuka ku rukuta rw'inyuma ugana ku kigega cy'umusarani wa mbere" },
      W4: { note: "Uva kuri W2, uzamuka ku rukuta rw'inyuma ugana ku kigega cy'umusarani wa kabiri" },
      W5: { note: "Uva kuri W2, uzamuka ku rukuta rw'inyuma ugana ku marobine abiri ya lavabo" },
      W6: { note: "Uva kuri W2, uzamuka ku rukuta rw'inyuma ugana kuri valve yo gusukura inkari" },
      D1: { note: "Umusarani wa mbere, wongeweho D2, munsi y'ibyumba by'imisarani usohoka unyuze inyuma y'umusingi ugana kuri IC1, 1:40" },
      D2: { note: "Umusarani wa kabiri umanuka unyuze mu hasi ujya muri D1" },
      D3: { note: "Umutego wa buri lavabo ujya mu rukuta rw'inyuma ukamanuka munsi y'hasi ujya muri D5" },
      D4: { note: "Umwobo w'amazi wo hasi ufite umutego wo mu ibaraza ujya muri D5" },
      D5: { note: "Lavabo n'umwobo w'amazi wo hasi, wongeweho inkari, munsi y'icyumba cy'inkari usohoka unyuze inyuma y'umusingi ugana kuri IC1, 1:40" },
      V1: { note: "Umuyoboro w'umwuka ufunguye uva kuri D1 aho usohokera mu musingi, uzamuka ku rukuta rw'inyuma hanze kugeza kuri mm 900 hejuru y'igisenge" },
      S1: { note: "Uva kuri IC1 ugana kuri septic tank y'ifamu n'icyobo gicengeza, hanze y'igishushanyo" },
    },
    circuits: {
      C1: { serves: "Amatara y'imbere na vantilateri" }, C2: { serves: "Itara hejuru y'urugi, ku isaha" },
      C3: { serves: "Priza y'usukura" }, C4: { serves: "Uw'inyongera" },
    },
    points: {
      L1: { what: "Itara rya LED ryo ku gisenge rifite sensa y'urujya n'uruza, icyumba cya mbere cy'umusarani" },
      L2: { what: "Itara rya LED ryo ku gisenge rifite sensa y'urujya n'uruza, icyumba cya kabiri cy'umusarani" },
      L3: { what: "Itara rya LED ryo ku gisenge rifite sensa y'urujya n'uruza, inzira" },
      L4: { what: "Itara rya LED ryo ku gisenge rifite sensa y'urujya n'uruza, ibaraza" },
      L5: { what: "Itara rya LED ryo ku gisenge rifite sensa y'urujya n'uruza, icyumba cy'inkari" },
      F1: { what: "Vantilateri isohora umwuka mu cyumba cy'inkari, ikora hamwe n'itara n'iminota 15 nyuma yaho" },
      L6: { what: "Itara ryo ku rukuta hejuru y'urugi, hanze, IP65" },
      P1: { what: "Priza y'usukura, mu nzira hafi y'akabati" },
      E1: { what: "Inkingi y'ubutaka mu cyobo cyo kugenzuriramo inyuma y'urukuta rw'inyuma, munsi y'ikibaho" },
    },
    board: { what: "Ikibaho cy'amashanyarazi gifungwa: disijonkitere nkuru, uburinzi bw'umuriro mwinshi, RCBO enye n'isaha ifite fotoselile", size: "Hafi mm 300 × 350 × 100" },
  },
}

export const words: Words<typeof en> = { en, rw }
