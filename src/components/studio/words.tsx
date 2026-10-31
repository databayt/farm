import type * as React from "react"

import type { Words } from "@/components/internationalization/words"

// Every word of the studio's page, its drawings, its rails and its docs tables (D-058): the English, then its
// Kinyarwanda, a machine draft until a native speaker reviews it. The generator's CSVs keep their English (the
// scripts and the price lookups read it); `json` lays the Kinyarwanda over their rows by key (data.ts), and the
// maps keyed by an English name (a BOM line, a group) fall back to the English where they are empty, as on /en.
type L = (href: string, text: string) => React.ReactNode
type Map = Record<string, string>

const en = {
  meta: {
    title: "The studio · Farm",
    description: "A farm-stay guest studio in a 20 ft container near Kigali, built IKEA-style from flat-pack parts made in Kigali.",
  },
  hero: {
    title: "Studio in nature, with forest vibes",
    alt: "A yellow container studio at golden hour under a dark roof canopy: the sliding glass wall half open on a bed, a sofa and two chairs, a red-railed timber deck with a bistro table and a potted plant, a steel ladder up the side to two lounge chairs on the roof, and eucalyptus behind.",
  },
  planAlt: "Plan: the bed at one end, a sofa with a table and two chairs, the galley on the bathroom wall, and at the other end the shower and WC behind a sliding door.",
  model: {
    lineAlt: "Line drawing of the studio seen from the front with the front wall off: the bed against the wall with two storage boxes, a bedside table with a reading lamp, the sofa with a low table and two chairs, the galley with a wide two-zone hob under a chimney hood between two wall cabinets, and a sink, and the bathroom with the shower and a wall-hung WC behind the sliding door, parked open.",
    realAlt: "The same view rendered with materials and daylight: pine furniture in a medium-oak finish on a natural oak floor, a white bed with storage boxes and a lit bedside lamp, a grey sofa with yellow and blue cushions, a table and two chairs, the galley with a black-glass hob under a black chimney hood between two wall cabinets, and a white marble bathroom with a glass shower screen and a wall-hung WC.",
  },
  floor: {
    title: "Floor",
    baseAlt: "The container's base from straight above: worn plywood panels with rows of screws, in a red steel frame with a corner casting at each corner.",
    builds: [
      "Flat wood sheets laid over the whole floor and screwed down.",
      "Oak planks laid over the living area.",
      "The bathroom end in grey safety vinyl, in one sheet.",
    ],
    stages: [
      { title: "The empty container", text: "28 mm treated hardwood ply in 1.16 × 2.4 m panels, screwed to steel cross-members every 300 mm, inside the base frame and its four corner castings." },
      { title: "Layer 1 · Flat wood", text: "2.44 × 1.22 m sheets laid wall to wall, joints staggered, and screwed down every 300 mm." },
      { title: "Layer 2 · Planks", text: "Oak planks laid row by row from the back wall over the living area, joints staggered." },
      { title: "The bathroom side", text: "Safety vinyl in one sheet with no joints, coved 100 mm up the walls." },
    ],
  },
  wall: {
    title: "Wall",
    baseAlt: "The container's back wall seen from inside: red corrugated steel, scuffed, with rust low down and lashing rings, framed by a channel rail below, a square tube above and pressed corner posts, their paint chipped to bare steel, and the corner castings.",
    builds: [
      "Battens up the wall, then foam sprayed onto the steel between them.",
      "Four numbered plywood lining panels screwed to the battens.",
      "The lining rolled in off-white satin paint.",
      "The bathroom end in cement board and white marble-look tiles.",
    ],
    stages: [
      { title: "The empty container", text: "1.6 mm corrugated steel, 36 mm deep at 278 mm pitch, between the rails, corner posts and castings. Rust treated and primed first." },
      { title: "Layer 1 · Battens + insulation", text: "38 × 50 treated battens at 600 mm centres, then foam sprayed onto the steel between them, filling the corrugations without a joint." },
      { title: "Layer 2 · Lining panels", text: "12 mm plywood panels, numbered and cut in the workshop, screwed to each batten every 300 mm." },
      { title: "Layer 3 · Paint", text: "Joints and screw heads filled, a vapour-retarding primer, then off-white paint in a satin sheen, rolled on." },
      { title: "The bathroom side", text: "12 mm cement board and a waterproof membrane, then 300 × 600 tiles laid from the floor up." },
    ],
  },
  sections: { bed: "Bed", seating: "Seating", galley: "Galley", bath: "Bath" },
  electric: {
    figureAlt: "Line drawing of the studio from the front with every electrical point and conduit run: the unit board on the back wall by the galley with seven circuits leaving its top, cables along the ceiling edge and straight down to each light, switch and socket, in blue for lights, orange for sockets and green for fixed appliances.",
    note: (link: L, outside: string): React.ReactNode => <>
      Every run goes up into the ceiling void, along it and straight down to its device. Each tag opens its row
      in the {link("/docs/studio/electric#points", "points table")}.
      Outside the drawing: C6 leaves through the front wall at the bed end for{" "}
      {outside}{" "}
      on the deck, the stair and the roof. The inlet (PI) is behind the board, and the earth rod (E1) is in a pit
      below it.
    </>,
    realAlt: "The same view rendered as finished: the white unit board with smoked windows on the back wall by the galley, sockets with USB-C over the headboard, the bedside table and the sofa arm, double sockets on the galley wall, a wall fan and the red AC isolator high on the back wall, and slim ceiling lights and alarms.",
  },
  plumbing: {
    figureAlt: "Line drawing of the studio from the front with the sink base cut open, the bathroom's wet walls stripped to the foam and every pipe run: the stop valve, filter and meter on the main in the sink base, cold in blue along the back wall and up end wall B to every outlet and to the instant heater in the shower, its hose in red to the hand shower, and the drains in brown dropping through the floor.",
    note: (link: L): React.ReactNode => <>
      Supplies run inside the units and the walls, then straight up to each outlet; drains drop through the floor and
      hang under it. The sink base and the bathroom&rsquo;s wet walls are drawn open; a run is dashed where a wall or
      the floor still hides it. Each tag opens its row in the{" "}
      {link("/docs/studio/plumbing#points", "points table")}. Outside
      the drawing: the main comes in under end B from the farm; D1 and D2 leave for the inspection chamber (IC1)
      and the septic tank, D4 for the grease trap (GT); the vent rises up end B to its terminal (VT), 900 mm above
      the roof guardrail.
    </>,
    caption: (): React.ReactNode => <>Rendered from the design model, the sink base and the bathroom&rsquo;s wet walls opened</>,
    realAlt: "The same view rendered as finished with the sink base cut open and the bathroom's wet walls stripped to the yellow foam: in the sink base the twin drinking-water filters, the blue meter with its brass valve and filter, the angle valves and the trap; in the bathroom the small white instant heater in the shower beside the hand shower on its rail, the pipes along the back wall and up end wall B, and the cistern frame behind the flush plate.",
  },
  docs: [
    { href: "/docs/studio", title: "Execution plan", text: "Every step of building out one studio, in order: the carpenter's drawings and where the electrician and the plumber come in." },
    { href: "/docs/studio/materials", title: "Materials", text: "The carpenter's sheets and battens, the bill of materials kit by kit, and the files the workshop cuts from." },
    { href: "/docs/studio/electric", title: "Electric", text: "The eight circuits checked against breaker, cable and voltage drop, the first and second fix, the tests, and every point." },
    { href: "/docs/studio/plumbing", title: "Plumbing", text: "The supply, the instant heater and the drains, the tests, every pipe run and fitting, and what the farm supplies." },
  ],
  rails: {
    est: (n: string) => `RWF ${n} estimate`,
    built: { board: "of board", both: "of board for both", worktop: "of board, worktop and legs" },
    hardware: "Not found online yet: the hardware district",
    bed: {
      bed: { title: "Bed frame", size: "1.64 × 2.02 m, headboard 1.0 m, top at 0.45 m", where: "Built: board from Gisozi (Agakiriro), cut in a Gisozi workshop",
        cost: (n: string) => `RWF ${n} of stock`, note: "Includes the two storage boxes that roll out from under it on castors (0.60 × 0.62 × 0.29 m each)." },
      mattress: { title: "Mattress", size: "160 × 200 × 20 cm", where: "Rwanda Foam Ltd, Kigali", note: "Sizes not confirmed yet; the frame takes 152 × 183 up to 160 × 200 cm." },
      sheets: { title: "Bed sheets", size: "Fitted sheet, flat sheet and 2 pillowcases for 160 × 200 cm" },
      duvet: { title: "Duvet", size: "200 × 220 cm" },
      pillow: { title: "Pillows × 2", size: "50 × 70 cm each" },
      bedside: { title: "Bedside table", size: "0.34 × 0.34 × 0.55 m", where: "Built with the bed from 18 mm board (kit K5)",
        cost: (n: string) => `RWF ${n} of board`, note: "A thick top on four legs, each two strips glued face to face, and a lower shelf." },
      lamp: { title: "Table lamp", size: "Ø 0.26 m, 0.42 m high", note: "A linen drum shade and an LED E27 bulb." },
      walllamp: { title: "Wall reading lamp", size: "Arm 0.24 m from the wall", where: "With the electrical kit (K8)", note: "Over the wall-side pillow." },
    },
    seating: {
      sofa: { title: "Sofa", size: "1.30 × 0.75 m, 0.70 m high", note: "A low two-seat sofa in soft dark grey, with washable covers." },
      table: { title: "Table", size: "0.86 × 0.50 m, 0.55 m high", note: "A low wide table: the top on two legs that slot together." },
      chairs: { title: "Chairs × 2", size: "0.40 × 0.40 m, seat at 0.40 m, back 0.80 m" },
      workshop: "Built in the workshop from 18 mm board (kit K6)",
    },
    galley: {
      units: { title: "Base units", size: "1.60 m run, 0.62 m deep, worktop at 0.90 m", where: "Built in the workshop from 18 mm board, 38 mm worktop (kit K3)",
        note: "A fridge bay, a hob base with two drawers and a sink base with a door, on adjustable legs behind a plinth." },
      fridge: { title: "Fridge", size: "About 90 L, under the counter", where: "Kanis Retail (online)", note: "A published price (Kanis, 2026-10-26), not a placeholder." },
      hob: { title: "Induction hob", size: "590 × 350 mm, two zones side by side, about 3.5 kW", note: "Black glass with front knobs. No gas indoors." },
      sink: { title: "Sink and tap", size: "Inset bowl about 380 × 420 mm", note: "Stainless single bowl with a cold tap. A drinking-water filter goes under it (RWF 80,000 estimate)." },
      hood: { title: "Chimney hood", size: "600 mm wide, its chimney up to the ceiling", note: "Black, recirculating with a charcoal filter, 650 mm over the hob between the two wall cabinets." },
      overhead: { title: "Wall cabinets × 2", size: "0.55 m and 0.45 m wide, 0.50 m deep and high", where: "Built in the workshop from 18 mm board (kit K3)", note: "One door each, hung on the steel rail either side of the hood." },
    },
    bath: {
      shower: { title: "Shower", size: "Tray 1,000 × 900 mm, glass screen 700 × 2,000 mm", note: "A low tray with a 90 mm waste, a fixed 8 mm toughened glass screen, and the instant heater on the wall beside the hand shower." },
      wc: { title: "WC", size: "Wall-hung, 520 mm projection", note: "A soft-close seat, on a slim concealed cistern frame with a dual-flush plate." },
      door: { title: "Sliding door", size: "Leaf 574 × 2,055 mm, 534 mm clear opening", where: "Built in the workshop (kit K2), track bought",
        note: "Runs on a soft-close track on the lobby side and parks towards end B, so nothing swings into the WC. Hands are washed at the galley sink: no basin." },
    },
    devices: {
      board: "Unit board", inlet: "Power inlet", ceiling: "Ceiling light", bulkhead: "IP65 light", walllamp: "Wall reading lamp",
      strip: "LED strip", switch: "Switch", switch65: "Outdoor switch IP65", usb: "Socket + USB-C", socket2: "Socket",
      socket66: "Deck socket IP66", outlet: "Hob outlet", isolator: "Isolator (heater and AC)", wallfan: "Wall fan",
      extract: "Bathroom extract fan", alarm: "Smoke and heat alarms", earth: "Earth rod",
    } as Map,
    deviceSize: {
      round: (w: number, d: number) => `Ø ${w} mm, ${d} mm deep`,
      strip: (l: number, h: number) => `${l} m long, ${h} mm wide`,
      earth: (l: number, w: number) => `${l} m rod, Ø ${w} mm, in an inspection pit`,
      sockets: "Double 146 × 86 mm, single 86 × 86 mm",
      box: (w: number, h: number, d: number) => `${w} × ${h} mm, ${d} mm deep`,
    },
    deviceCost: {
      board: (a: string, b: string) => `RWF ${a} the enclosure; RWF ${b} with its breakers, surge protection and relay (estimates)`,
      inlet: (a: string, b: string) => `RWF ${a}; RWF ${b} with its plug and tails (estimates)`,
      each: (a: string, n: number) => `RWF ${a} each × ${n} (estimate)`,
      all: (a: string, n: number) => `RWF ${a} for ${n} (estimate)`,
    },
    pipe: {
      shops: "Pro Water Rwanda (Gatsata) or Build Mart (Kicukiro)",
      cost: (a: string) => `RWF ${a} (estimate)`,
      metres: (m: number, dn: string) => `${m} m of ${dn}`,
      meter: { title: "Stop valve, filter and meter", size: (h: string) => `DN25, in line on the main, about ${h} mm` },
      heater: { title: "Instant shower heater", size: (w: string, h: string, d: string, r: string) => `${w} × ${h} × ${d} mm, ${r}, IPX4, no tank`,
        note: "Heats the water as it flows, set on its own display; hot goes only to the shower, through the hand shower's hose." },
      kitchentap: { title: "Kitchen tap", size: (r: string) => `Cold, ${r}, one angle valve under the sink` },
      filter: { title: "Drinking-water filter", size: (w: string, h: string) => `Twin canisters ${w} × ${h} mm, its own faucet by the tap` },
      showerset: { title: "Slide rail and hand shower", size: (m: number) => `${m} m rail; the hand shower and hose come with the heater` },
      cistern: { title: "Concealed cistern", size: (w: string, h: string, d: string) => `Frame ${w} × ${h} × ${d} mm, dual-flush plate` },
      anglevalve: { title: (n: string) => `Angle valves × ${n}`, size: "With a filter: one under the sink, one at the cistern, one at the heater",
        cost: (a: string, n: string) => `RWF ${a} each × ${n} (estimate)`, note: "Each tap and the cistern can be shut off on its own, without the main." },
      ppr: { title: "PP-R supply pipe", size: (m: string) => `${m}, PN20, welded joints`, note: "Cold water inside the units and walls, then straight up to each outlet." },
      upvc: { title: "uPVC drain pipe", note: "Under the floor, each run falling at least 1:40 to IC1 or the grease trap." },
      vent: { title: "Vent and air admittance valve", size: (m: string) => `${m}, a spare 110 mm AAV, rodding eyes`,
        note: "V1 rises up end B to 900 mm above the roof guardrail; the AAV stands in if it cannot." },
    },
  },
  // the single-line diagram (src/components/docs/wiring-diagram.tsx)
  wiring: {
    label: (inlet: string, main: string, n: number) => `Single-line diagram: any 230 V supply into a ${inlet} A inlet and a ${main} A main breaker with surge protection, then one RCBO for each of ${n} circuits`,
    any: "Any 230 V", supply: "supply", sources: "grid · site board", sourcesSub: "generator · inverter",
    inlet: (a: string) => `Inlet ${a} A`, inletSub: "IEC 60309 blue, back wall", tails: (mm2: string) => `${mm2} mm² tails`,
    main: (a: string) => `Main breaker ${a} A`, mainSub: "DP, C curve + kWh meter", spd: "SPD type 2",
    groups: { lights: "Lights", sockets: "Sockets", fixed: "Fixed appliances" } as Map,
    peak: (total: string, inlet: string, shed: string) => `Peak ${total} A of the ${inlet} A inlet: while the hob (C4) runs, the relay pauses ${shed} at K · one RCBO 30 mA type A per circuit`,
    and: " and ",
    earthing: "TT earthing on the studio’s own rod · ratings are design intent until a RURA class A electrician certifies",
  },
  // the water diagram (src/components/docs/pipe-diagram.tsx)
  pipes: {
    label: (kw: string, hot: string) => `Water diagram: the farm's water through the studio's stop valve, filter and meter; cold to every outlet and the ${kw} instant heater, whose hose takes hot water at ${hot} to the shower alone; the WC and shower drain to an inspection chamber and the farm's septic tank, the kitchen sink apart to its grease trap`,
    farm: "Farm water", tank: (m3: string) => `tank ${m3} m³`, booster: (lpm: string) => `booster ${lpm} L/min`,
    valve: "Stop valve", valveSub: "filter · meter",
    cold: "Cold", hot: (t: string) => `Hot ${t}`, drain: "Drain", vent: "Vent",
    heater: "Instant heater", hose: "hose",
    df: { title: "Drinking water", sub: "DF · filter tap" },
    kt: { title: "Kitchen sink", sub: (r: string) => `KT · cold · ${r}` },
    sh: { title: "Hand shower" },
    wc: { title: "WC cistern" },
    trap: { title: "Grease trap", sub: "the farm's, own soak pit" },
    ic: "inspection chamber",
    septic: { title: "Septic tank", sub: (m3: string) => `the farm's, ${m3} m³` },
    roof: "900 above the roof rail",
    notes: [
      "Supply in PP-R PN20 inside the units and walls, then straight up to each outlet · drains in uPVC under the floor, falling at least 1:40 · the kitchen sink drains apart, to the grease trap",
      "Every pipe pressure-tested at 10 bar for an hour before the walls close · design intent until a licensed plumber signs it off",
    ],
  },
  // the docs sections (docs-sections.tsx)
  ref: {
    bom: {
      lead: (total: string) => `About ${total} with a 15 % contingency, in the order of the studio page. Open a section for its lines. Prices are placeholders until three quotes come in for each line.`,
      one: "One studio",
      cable: (mm2: string, serves: string) => `Cable ${mm2} mm², ${serves}`,
    },
    shared: {
      lead: (tank: string, daily: string, persons: string, pump: string, septic: string, c1: string, c2: string) =>
        `WASAC water, the borehole and rain from the canopies fill the farm’s ${tank} m³ tank, about four days at ${daily} L a day for ${persons} guests, and a booster pump sends ${pump} L/min to the studios. WCs and showers drain to a new ${septic} m³ septic tank in two chambers (${c1} + ${c2} m³); kitchen sinks drain to their own grease trap.`,
      figure: "P-301 · Site water and sanitation schematic",
      total: "Water and sanitation, once for the site",
      full: "Full list:",
    },
    circuits: {
      lead: "Each circuit is checked by the model: its current fits the breaker, the breaker fits the cable, and the voltage drop stays under 3 % for lights and 5 % for the rest.",
      design: "Design current", drop: "Voltage drop", points: "Points", spare: "spare",
      figure: "E-202 · Circuit schedule, earthing and bonding",
    },
    points: {
      lead: (n: number) => `${n} points on the plan. The bathroom has an IP65 light, an IPX4 extract fan and no sockets, switched from outside the door.`,
      figure: "E-101 · Electrical layout plan",
      type: "Type", height: "Height", load: "Load",
    },
    pipes: {
      lead: "Each run is checked by the model: every leg runs along a wall or straight up or down, each drain falls at least 1:40.",
      fall: "Fall",
      figure: "P-201 · Pipework isometric (unit)",
    },
    fittings: {
      lead: (n: number) => `${n} points, from the stop valve on the main to the vent above the roof. The sink, the heater, the shower and the WC sit within about 1.5 m of each other, so the pipes stay short.`,
      figure: "P-101 · Plumbing layout plan (supply and drainage)",
      pipes: "Pipes", rating: "Rating",
    },
    features: [
      { title: "Sleep", text: "A queen bed up to 1.6 × 2.0 m against the wall, with two storage boxes underneath, a bedside table, a reading lamp and USB-C." },
      { title: "Cook", text: "A galley on the bathroom wall: under-counter fridge, two-zone induction hob, sink, drinking-water filter. No gas indoors." },
      { title: "Wash", text: "Shower and WC in one row behind a sliding door; hands are washed at the galley sink." },
      { title: "Sit", text: "A seating room: a two-seat sofa, a low wide table and two chairs, by the 3 m sliding glass wall onto the deck." },
      { title: "Roof", text: "An open roof terrace with lounge chairs behind a timber-topped rail, up a steel stair; a canopy shades the deck." },
      { title: "Stay cool", text: "The roof deck shades the steel, foam is sprayed onto it inside, a wall fan moves the air, and the AC is ready." },
    ],
    steps: [
      { n: "1", title: "Measure", text: "Survey the container; the model regenerates every drawing from the real numbers." },
      { n: "2", title: "Cut in Kigali", text: "A Gisozi workshop rips and crosscuts sheets on a panel saw, following the cutting diagrams." },
      { n: "3", title: "Drill and number", text: "Holes on the 32 mm grid from 1:1 templates; every part labelled, like K3-H-07." },
      { n: "4", title: "Pack flat", text: "Every kit packed flat, bundles under 25 kg, hardware in bags A to L." },
      { n: "5", title: "Assemble", text: "Two people, one tool set, 27 wordless steps, from insulation to the roof terrace." },
    ],
    downloads: ["A3 drawing set (PDF)", "A4 assembly manual (PDF)", "1:1 drilling templates (PDF)", "Bill of materials (XLSX)", "Cut list (CSV)", "3D model (GLB)"],
  },
  // the 3D viewer's controls (src/components/docs/studio-viewer-canvas.tsx)
  viewer: {
    layers: {
      shell: "Container", envelope: "Insulation and lining", furniture: "Flat-pack furniture",
      fixtures: "Fixtures and appliances", electrical: "Electrical points", roof: "Roof terrace and canopies",
    } as Map,
    noWebgl: "WebGL is not available in this browser. Download the GLB instead.",
    failed: "The model could not be loaded.",
    views: { "3d": "3D", plan: "Plan", inside: "Inside", roof: "Roof" } as Map,
    explode: "Explode",
    steps: (to: string | null) => `Steps ${to === null ? "all" : `to ${to}`}`,
    step: (n: string, title: string) => ` · step ${n}: ${title}`,
    hint: "Click a part to see its id, size and assembly step. Drag to orbit, scroll or pinch to zoom.",
  },
  // the CSVs' words, by row key; the empty maps keep the English
  json: {
    points: {} as Map, // points.csv description, by point
    circuits: {} as Map, // circuits.csv serves, by circuit
    fittings: {} as Record<string, { description?: string; rating?: string }>, // fittings.csv, by point
    pipes: {} as Map, // pipes.csv note, by run
    systems: {} as Map, // pipes.csv system
    kinds: { usb: "socket + USB-C", db: "board", inlet: "power inlet", earth: "earth rod" } as Map, // points.csv kind
    fitKinds: { wc: "WC", site: "on the site" } as Map, // fittings.csv kind
    bom: {} as Map, // bom.csv item, by its English
    units: {} as Map, // bom.csv unit
    groups: {} as Map, // a BOM group's name, by its English
    sections: {} as Map, // a BOM section's name, by its English
    shared: {} as Map, // shared-works.csv item
    contingency: (s: string) => s[0].toUpperCase() + s.slice(1),
  },
}

const rw: typeof en = {
  meta: {
    title: "Sitidiyo · Ifamu",
    description: "Sitidiyo y'abashyitsi bacumbika ku ifamu, iri muri kontineri ya ft 20 hafi ya Kigali, yubatswe nk'uko IKEA ibikora, mu bice bikorerwa i Kigali bigapakirwa biringaniye.",
  },
  hero: {
    title: "Sitidiyo hagati muri kamere, mu mwuka w'ishyamba",
    alt: "Sitidiyo ya kontineri y'umuhondo ku zuba rirenga, munsi y'igisenge cyijimye: urukuta runyerera rw'ikirahure rufunguye kimwe cya kabiri ku gitanda, sofa n'intebe ebyiri, deck y'imbaho ifite uruzitiro rutukura n'akameza gato n'igiti mu nkono, esikariye y'icyuma izamuka ku ruhande igana ku ntebe ebyiri zo kuruhukiraho ziri ku gisenge, n'inturusu inyuma.",
  },
  planAlt: "Igishushanyo: igitanda ku mpera imwe, sofa n'ameza n'intebe ebyiri, igikoni ku rukuta rw'ubwiherero, no ku yindi mpera douche na WC inyuma y'urugi runyerera.",
  model: {
    lineAlt: "Igishushanyo cy'imirongo cya sitidiyo kirebwa uturutse imbere, urukuta rw'imbere rwakuweho: igitanda cyegamye ku rukuta gifite udusanduku tubiri two kubikamo, akameza ko ku buriri gafite itara ryo gusomeraho, sofa n'ameza magufi n'intebe ebyiri, igikoni gifite hob nini y'imyanya ibiri munsi ya hotte ifite chimney hagati y'utubati tubiri two ku rukuta, na sink, n'ubwiherero bufite douche na WC ifashwe ku rukuta inyuma y'urugi runyerera rufunguye.",
    realAlt: "Ishusho imwe yakozwe nk'ifoto, ifite ibikoresho n'urumuri rw'umunsi: ibikoresho by'igiti cya pinusi gisize ibara rya medium oak ku butaka bw'imbaho z'igiti cya oak, igitanda cy'umweru gifite udusanduku two kubikamo n'itara ryaka ku meza yo ku buriri, sofa y'ivu ifite imisego y'umuhondo n'iy'ubururu, ameza n'intebe ebyiri, igikoni gifite hob y'ikirahure cy'umukara munsi ya hotte y'umukara ifite chimney hagati y'utubati tubiri two ku rukuta, n'ubwiherero bw'umweru busa na marbre bufite ikirahure cya douche na WC ifashwe ku rukuta.",
  },
  floor: {
    title: "Hasi",
    baseAlt: "Hasi ha kontineri harebwa uturutse hejuru neza: impapuro za pulayiwudi zishaje zifite imirongo ya vis, mu ikadiri y'icyuma gitukura ifite icyuma gikomeye (corner casting) kuri buri nguni.",
    builds: [
      "Impapuro z'imbaho ziringaniye zishyirwa hasi hose zigafatishwa vis.",
      "Imbaho za oak zishyirwa hasi mu gice cyo kubamo.",
      "Igice cy'ubwiherero gishyirwamo vinyl y'ivu itanyerera, urupapuro rumwe.",
    ],
    stages: [
      { title: "Kontineri irimo ubusa", text: "Pulayiwudi y'igiti gikomeye yatewe umuti ya mm 28, mu mpapuro za m 1.16 × 2.4, zifatishijwe vis ku byuma byambukiranya buri mm 300, imbere mu ikadiri yo hasi n'ibyuma byayo bine byo ku nguni." },
      { title: "Icyiciro cya 1 · Imbaho ziringaniye", text: "Impapuro za m 2.44 × 1.22 zishyirwa kuva ku rukuta kugeza ku rundi, ingingo zisimburana, zigafatishwa vis buri mm 300." },
      { title: "Icyiciro cya 2 · Imbaho za oak", text: "Imbaho za oak zishyirwa umurongo ku wundi uhereye ku rukuta rw'inyuma, mu gice cyo kubamo, ingingo zisimburana." },
      { title: "Uruhande rw'ubwiherero", text: "Vinyl itanyerera mu rupapuro rumwe rudafite ingingo, izamuka mm 100 ku nkuta." },
    ],
  },
  wall: {
    title: "Urukuta",
    baseAlt: "Urukuta rw'inyuma rwa kontineri rurebwa uturutse imbere: icyuma cy'amabati gitukura, gishishutse, gifite ingese hasi n'impeta zo kuziritsa, kizengurutswe n'umuhanda w'icyuma hasi, itiyo kare hejuru n'inkingi z'inguni, irangi ryazo ryavuyeho rigera ku cyuma, n'ibyuma byo ku nguni.",
    builds: [
      "Ibiti (battens) bizamuka ku rukuta, hanyuma foam igaterwa ku cyuma hagati yabyo.",
      "Impapuro enye za pulayiwudi za lining zifite nimero zifatishwa vis ku biti.",
      "Lining isigwa irangi ry'umweru utarera, rirabagirana gake.",
      "Igice cy'ubwiherero gishyirwamo cement board n'amakaro y'umweru asa na marbre.",
    ],
    stages: [
      { title: "Kontineri irimo ubusa", text: "Icyuma cy'amabati cya mm 1.6, gifite ubujyakuzimu bwa mm 36 n'intera ya mm 278, hagati y'imihanda, inkingi z'inguni n'ibyuma byazo. Ingese ibanza kuvurwa no gusigwa primer." },
      { title: "Icyiciro cya 1 · Ibiti + insulation", text: "Ibiti byatewe umuti 38 × 50 bitandukanyijwe na mm 600, hanyuma foam igaterwa ku cyuma hagati yabyo, ikuzuza amabati nta ngingo." },
      { title: "Icyiciro cya 2 · Impapuro za lining", text: "Impapuro za pulayiwudi za mm 12, zifite nimero kandi zakatiwe muri atelier, zifatishwa vis kuri buri giti buri mm 300." },
      { title: "Icyiciro cya 3 · Irangi", text: "Ingingo n'imitwe ya vis bizibwa, primer ibuza ubuhehere kwinjira, hanyuma irangi ry'umweru utarera rirabagirana gake, risigwa na rulo." },
      { title: "Uruhande rw'ubwiherero", text: "Cement board ya mm 12 na membrane itinjiza amazi, hanyuma amakaro 300 × 600 ashyirwa uhereye hasi uzamuka." },
    ],
  },
  sections: { bed: "Igitanda", seating: "Aho kwicara", galley: "Igikoni", bath: "Ubwiherero" },
  electric: {
    figureAlt: "Igishushanyo cy'imirongo cya sitidiyo kirebwa uturutse imbere, gifite buri point y'amashanyarazi na buri nzira ya conduit: board ku rukuta rw'inyuma hafi y'igikoni, imizunguruko irindwi iva hejuru yayo, insinga zikurikira impera y'igisenge zikamanuka zigororotse kuri buri tara, switch na priza, mu bururu ku matara, mu icunga kuri priza no mu cyatsi ku bikoresho bifashe.",
    note: (link, outside) => <>
      Buri nzira izamuka mu mwanya uri mu gisenge, ikawukurikira, ikamanuka igororotse ku gikoresho cyayo. Buri kimenyetso
      gifungura umurongo wacyo mu {link("/docs/studio/electric#points", "mbonerahamwe ya points")}.
      Hanze y&rsquo;igishushanyo: C6 isohoka inyuze mu rukuta rw&rsquo;imbere ku ruhande rw&rsquo;igitanda ijya kuri{" "}
      {outside}{" "}
      kuri deck, kuri esikariye no ku gisenge. Inlet (PI) iri inyuma ya board, naho earth rod (E1) iri mu cyobo
      munsi yayo.
    </>,
    realAlt: "Ishusho imwe yakozwe nk'ifoto, irangiye: board y'umweru ifite udukirahure twijimye ku rukuta rw'inyuma hafi y'igikoni, priza zifite USB-C hejuru y'umutwe w'igitanda, ku meza yo ku buriri no ku kuboko kwa sofa, priza ebyiri ku rukuta rw'igikoni, fan yo ku rukuta n'isolateri itukura ya AC hejuru ku rukuta rw'inyuma, n'amatara yo ku gisenge yoroheje n'alarms.",
  },
  plumbing: {
    figureAlt: "Igishushanyo cy'imirongo cya sitidiyo kirebwa uturutse imbere, sink base ifunguye, inkuta z'ubwiherero zitose zakuweho kugeza kuri foam, na buri muyoboro: stop valve, filter na mubazi ku muyoboro mukuru muri sink base, amazi akonje mu bururu akurikira urukuta rw'inyuma akazamuka ku rukuta rwa end B kuri buri aho asohokera no kuri heater ihita ishyushya muri douche, hose yayo mu mutuku igana kuri douche ifatwa mu ntoki, n'imiyoboro y'amazi yanduye mu ibara ry'ikawa imanuka inyuze hasi.",
    note: (link) => <>
      Amazi meza anyura imbere mu tubati no mu nkuta, hanyuma akazamuka agororotse kuri buri aho asohokera; imiyoboro
      y&rsquo;amazi yanduye imanuka inyuze hasi ikamanikwa munsi yaho. Sink base n&rsquo;inkuta z&rsquo;ubwiherero zitose
      zishushanyijwe zifunguye; umuyoboro ugaragazwa n&rsquo;utudomo aho urukuta cyangwa hasi bikiwuhisha. Buri kimenyetso
      gifungura umurongo wacyo mu {link("/docs/studio/plumbing#points", "mbonerahamwe ya points")}. Hanze
      y&rsquo;igishushanyo: umuyoboro mukuru winjira munsi ya end B uvuye ku ifamu; D1 na D2 bijya kuri inspection
      chamber (IC1) no kuri septic tank, D4 ikajya kuri grease trap (GT); vent izamuka kuri end B igera ku musozo wayo
      (VT), mm 900 hejuru y&rsquo;uruzitiro rwo ku gisenge.
    </>,
    caption: () => <>Byakozwe uhereye ku gishushanyo mbonera, sink base n&rsquo;inkuta z&rsquo;ubwiherero zitose bifunguye</>,
    realAlt: "Ishusho imwe yakozwe nk'ifoto, irangiye, sink base ifunguye n'inkuta z'ubwiherero zitose zakuweho kugeza kuri foam y'umuhondo: muri sink base, filters ebyiri z'amazi yo kunywa, mubazi y'ubururu ifite valve y'umuringa na filter yayo, angle valves na siphon; mu bwiherero, heater ntoya y'umweru ihita ishyushya muri douche iruhande rwa douche ifatwa mu ntoki kuri rail yayo, amatiyo akurikira urukuta rw'inyuma akazamuka ku rukuta rwa end B, n'ikadiri ya cistern inyuma ya plate yo gukurura amazi.",
  },
  docs: [
    { href: "/docs/studio", title: "Gahunda y'imirimo", text: "Buri ntambwe yo kubaka sitidiyo imwe, uko zikurikirana: ibishushanyo by'umubaji n'aho umuyagankuba n'umufundi w'amazi binjirira." },
    { href: "/docs/studio/materials", title: "Ibikoresho", text: "Impapuro n'ibiti by'umubaji, urutonde rw'ibikoresho kit ku yindi, na dosiye atelier ikatiraho." },
    { href: "/docs/studio/electric", title: "Amashanyarazi", text: "Imizunguruko umunani igenzuwe hakurikijwe breaker, insinga n'igabanuka rya voltage, first fix na second fix, igerageza, na buri point." },
    { href: "/docs/studio/plumbing", title: "Imiyoboro y'amazi", text: "Amazi yinjira, heater ihita ishyushya n'imiyoboro y'amazi yanduye, igerageza, buri muyoboro na buri fitting, n'ibyo ifamu itanga." },
  ],
  rails: {
    est: (n) => `RWF ${n} (ikigereranyo)`,
    built: { board: "yo kugura impapuro", both: "yo kugura impapuro z'intebe zombi", worktop: "yo kugura impapuro, worktop n'amaguru" },
    hardware: "Ntibiraboneka kuri interineti: mu gace k'amaduka y'ibikoresho by'ubwubatsi",
    bed: {
      bed: { title: "Ikadiri y'igitanda", size: "m 1.64 × 2.02, umutwe wacyo m 1.0, hejuru yacyo kuri m 0.45", where: "Gikorwa: impapuro zo ku Gisozi (Agakiriro), zikatirwa muri atelier yo ku Gisozi",
        cost: (n) => `RWF ${n} yo kugura ibikoresho`, note: "Harimo udusanduku tubiri two kubikamo dusohoka munsi yacyo ku tuziga (m 0.60 × 0.62 × 0.29 buri kamwe)." },
      mattress: { title: "Matela", size: "cm 160 × 200 × 20", where: "Rwanda Foam Ltd, Kigali", note: "Ingano ntiraremezwa; ikadiri yakira kuva kuri cm 152 × 183 kugeza kuri cm 160 × 200." },
      sheets: { title: "Amashuka", size: "Ishuka ifashe, ishuka iringaniye n'imyenda 2 y'imisego, bya cm 160 × 200" },
      duvet: { title: "Ikiringiti (duvet)", size: "cm 200 × 220" },
      pillow: { title: "Imisego × 2", size: "cm 50 × 70 buri umwe" },
      bedside: { title: "Akameza ko ku buriri", size: "m 0.34 × 0.34 × 0.55", where: "Gakorwa hamwe n'igitanda mu mpapuro za mm 18 (kit K5)",
        cost: (n) => `RWF ${n} yo kugura impapuro`, note: "Hejuru habyibushye ku maguru ane, buri kuguru ari ibice bibiri bifatanyijwe na kole, n'akabati ko hasi." },
      lamp: { title: "Itara ryo ku meza", size: "Ø m 0.26, uburebure m 0.42", note: "Igitwikirizo cy'umwenda wa linen kimeze nk'ingoma n'itara rya LED E27." },
      walllamp: { title: "Itara ryo gusomeraho ryo ku rukuta", size: "Ukuboko kwa m 0.24 uvuye ku rukuta", where: "Hamwe na kit y'amashanyarazi (K8)", note: "Hejuru y'umusego wo ku ruhande rw'urukuta." },
    },
    seating: {
      sofa: { title: "Sofa", size: "m 1.30 × 0.75, uburebure m 0.70", note: "Sofa ngufi y'abantu babiri, y'ivu ryijimye ryoroshye, ifite ibitwikirizo bimeswa." },
      table: { title: "Ameza", size: "m 0.86 × 0.50, uburebure m 0.55", note: "Ameza magufi kandi manini: hejuru ku maguru abiri yinjirana." },
      chairs: { title: "Intebe × 2", size: "m 0.40 × 0.40, intebe kuri m 0.40, umugongo m 0.80" },
      workshop: "Bikorerwa muri atelier mu mpapuro za mm 18 (kit K6)",
    },
    galley: {
      units: { title: "Utubati two hasi", size: "Uburebure m 1.60, ubujyakuzimu m 0.62, worktop kuri m 0.90", where: "Bikorerwa muri atelier mu mpapuro za mm 18, worktop ya mm 38 (kit K3)",
        note: "Umwanya wa firigo, akabati ka hob gafite utubati tubiri dukururwa n'akabati ka sink gafite urugi, ku maguru ahindurwa inyuma ya plinth." },
      fridge: { title: "Firigo", size: "Hafi L 90, munsi ya kawunta", where: "Kanis Retail (kuri interineti)", note: "Igiciro cyatangajwe (Kanis, 2026-10-26), si icy'agateganyo." },
      hob: { title: "Hob ya induction", size: "mm 590 × 350, imyanya ibiri iri iruhande rw'indi, hafi kW 3.5", note: "Ikirahure cy'umukara gifite ibikoresho byo guhindura imbere. Nta gaz imbere mu nzu." },
      sink: { title: "Sink na robine", size: "Ibase ryinjijwe, hafi mm 380 × 420", note: "Ibase rimwe ry'icyuma kitagwa ingese rifite robine y'amazi akonje. Akayunguruzo k'amazi yo kunywa kajya munsi yaryo (ikigereranyo cya RWF 80,000)." },
      hood: { title: "Hotte ifite chimney", size: "Ubugari mm 600, chimney yayo igera ku gisenge", note: "Y'umukara, isubiza umwuka mu cyumba inyujije muri filter y'amakara, mm 650 hejuru ya hob hagati y'utubati tubiri two ku rukuta." },
      overhead: { title: "Utubati two ku rukuta × 2", size: "Ubugari m 0.55 na m 0.45, ubujyakuzimu n'uburebure m 0.50", where: "Dukorerwa muri atelier mu mpapuro za mm 18 (kit K3)", note: "Buri kamwe gafite urugi rumwe, bimanitswe ku cyuma ku mpande zombi za hotte." },
    },
    bath: {
      shower: { title: "Douche", size: "Tray mm 1,000 × 900, ikirahure mm 700 × 2,000", note: "Tray ngufi ifite umwobo usohora amazi wa mm 90, ikirahure gihamye gikomeye cya mm 8, na heater ihita ishyushya ku rukuta iruhande rwa douche ifatwa mu ntoki." },
      wc: { title: "WC", size: "Ifashwe ku rukuta, isohoka mm 520", note: "Intebe ifunga buhoro, kuri cistern yoroheje ihishe mu rukuta ifite plate ya dual-flush." },
      door: { title: "Urugi runyerera", size: "Urugi mm 574 × 2,055, umwanya wo kunyuramo mm 534", where: "Rukorerwa muri atelier (kit K2), inzira yarwo iguzwe",
        note: "Runyerera ku nzira ifunga buhoro ku ruhande rw'inyuma y'ubwiherero, rukajya ku ruhande rwa end B, bityo ntirukingukira kuri WC. Intoki zikarabirwa kuri sink y'igikoni: nta lavabo." },
    },
    devices: {
      board: "Board (tableau)", inlet: "Inlet y'umuriro", ceiling: "Itara ryo ku gisenge", bulkhead: "Itara rya IP65", walllamp: "Itara ryo gusomeraho ryo ku rukuta",
      strip: "Umurongo w'amatara ya LED", switch: "Switch", switch65: "Switch yo hanze IP65", usb: "Priza + USB-C", socket2: "Priza",
      socket66: "Priza ya deck IP66", outlet: "Aho hob icomekwa", isolator: "Isolateri (heater na AC)", wallfan: "Fan yo ku rukuta",
      extract: "Fan isohora umwuka mu bwiherero", alarm: "Alarms z'umwotsi n'ubushyuhe", earth: "Earth rod",
    },
    deviceSize: {
      round: (w, d) => `Ø mm ${w}, ubujyakuzimu mm ${d}`,
      strip: (l, h) => `Uburebure m ${l}, ubugari mm ${h}`,
      earth: (l, w) => `Earth rod ya m ${l}, Ø mm ${w}, mu cyobo cyo kugenzuriramo`,
      sockets: "Ebyiri: mm 146 × 86; imwe: mm 86 × 86",
      box: (w, h, d) => `mm ${w} × ${h}, ubujyakuzimu mm ${d}`,
    },
    deviceCost: {
      board: (a, b) => `RWF ${a} agasanduku konyine; RWF ${b} hamwe na breakers zako, SPD na relay (ibigereranyo)`,
      inlet: (a, b) => `RWF ${a}; RWF ${b} hamwe na plug yayo na tails (ibigereranyo)`,
      each: (a, n) => `RWF ${a} buri kimwe × ${n} (ikigereranyo)`,
      all: (a, n) => `RWF ${a} kuri ${n} (ikigereranyo)`,
    },
    pipe: {
      shops: "Pro Water Rwanda (Gatsata) cyangwa Build Mart (Kicukiro)",
      cost: (a) => `RWF ${a} (ikigereranyo)`,
      metres: (m, dn) => `m ${m} za ${dn}`,
      meter: { title: "Stop valve, filter na mubazi", size: (h) => `DN25, ku muyoboro mukuru, hafi mm ${h}` },
      heater: { title: "Heater ya douche ihita ishyushya", size: (w, h, d, r) => `mm ${w} × ${h} × ${d}, ${r}, IPX4, nta kigega`,
        note: "Ishyushya amazi uko atemba, igenwa kuri ecran yayo; amazi ashyushye ajya kuri douche gusa, anyuze muri hose ya douche ifatwa mu ntoki." },
      kitchentap: { title: "Robine y'igikoni", size: (r) => `Amazi akonje, ${r}, angle valve imwe munsi ya sink` },
      filter: { title: "Akayunguruzo k'amazi yo kunywa", size: (w, h) => `Ibikombe bibiri mm ${w} × ${h}, gafite robine yako iruhande rwa robine y'igikoni` },
      showerset: { title: "Rail na douche ifatwa mu ntoki", size: (m) => `Rail ya m ${m}; douche ifatwa mu ntoki na hose biza hamwe na heater` },
      cistern: { title: "Cistern ihishe mu rukuta", size: (w, h, d) => `Ikadiri mm ${w} × ${h} × ${d}, plate ya dual-flush` },
      anglevalve: { title: (n) => `Angle valves × ${n}`, size: "Zifite filter: imwe munsi ya sink, imwe kuri cistern, imwe kuri heater",
        cost: (a, n) => `RWF ${a} buri imwe × ${n} (ikigereranyo)`, note: "Buri robine na cistern bishobora gufungwa ukwabyo, udafunze umuyoboro mukuru." },
      ppr: { title: "Itiyo y'amazi meza PP-R", size: (m) => `${m}, PN20, ingingo zisudiye`, note: "Amazi akonje imbere mu tubati no mu nkuta, hanyuma akazamuka agororotse kuri buri aho asohokera." },
      upvc: { title: "Itiyo y'amazi yanduye uPVC", note: "Munsi y'hasi, buri muyoboro ufite ubuhaname bwa 1:40 cyangwa burenzeho ugana kuri IC1 cyangwa kuri grease trap." },
      vent: { title: "Vent na valve yinjiza umwuka", size: (m) => `${m}, AAV y'inyongera ya mm 110, rodding eyes`,
        note: "V1 izamuka kuri end B kugeza mm 900 hejuru y'uruzitiro rwo ku gisenge; AAV ikoreshwa niba bidashoboka." },
    },
  },
  wiring: {
    label: (inlet, main, n) => `Igishushanyo cy'umurongo umwe: isoko iyo ari yo yose ya 230 V ijya kuri inlet ya ${inlet} A no kuri breaker nkuru ya ${main} A ifite SPD, hanyuma RCBO imwe kuri buri muzunguruko muri ${n}`,
    any: "230 V iyo ari yo yose", supply: "isoko y'umuriro", sources: "umuyoboro rusange · board y'ikibanza", sourcesSub: "generator · inverter",
    inlet: (a) => `Inlet ${a} A`, inletSub: "IEC 60309 y'ubururu, urukuta rw'inyuma", tails: (mm2) => `tails za ${mm2} mm²`,
    main: (a) => `Breaker nkuru ${a} A`, mainSub: "DP, C curve + mubazi ya kWh", spd: "SPD type 2",
    groups: { lights: "Amatara", sockets: "Priza", fixed: "Ibikoresho bifashe" },
    peak: (total, inlet, shed) => `Umuriro ntarengwa ${total} A kuri inlet ya ${inlet} A: iyo hob (C4) ikora, relay ihagarika ${shed} kuri K · RCBO imwe ya 30 mA type A kuri buri muzunguruko`,
    and: " na ",
    earthing: "Earthing ya TT kuri earth rod ya sitidiyo ubwayo · ibipimo ni ibyateganyijwe kugeza umuyagankuba wo mu cyiciro A cya RURA abyemeje",
  },
  pipes: {
    label: (kw, hot) => `Igishushanyo cy'amazi: amazi y'ifamu anyura kuri stop valve, filter na mubazi bya sitidiyo; amazi akonje ajya kuri buri aho asohokera no kuri heater ihita ishyushya ya ${kw}, hose yayo ijyana amazi ashyushye ya ${hot} kuri douche yonyine; WC na douche bisohokera kuri inspection chamber no kuri septic tank y'ifamu, sink y'igikoni ukwayo kuri grease trap yayo`,
    farm: "Amazi y'ifamu", tank: (m3) => `ikigega ${m3} m³`, booster: (lpm) => `pompe ${lpm} L/min`,
    valve: "Stop valve", valveSub: "filter · mubazi",
    cold: "Akonje", hot: (t) => `Ashyushye ${t}`, drain: "Yanduye", vent: "Vent",
    heater: "Heater ihita ishyushya", hose: "hose",
    df: { title: "Amazi yo kunywa", sub: "DF · robine ya filter" },
    kt: { title: "Sink y'igikoni", sub: (r) => `KT · akonje · ${r}` },
    sh: { title: "Douche y'intoki" },
    wc: { title: "Cistern ya WC" },
    trap: { title: "Grease trap", sub: "y'ifamu, soak pit yayo" },
    ic: "inspection chamber",
    septic: { title: "Septic tank", sub: (m3) => `y'ifamu, ${m3} m³` },
    roof: "mm 900 hejuru y'uruzitiro rwo ku gisenge",
    notes: [
      "Amazi meza muri PP-R PN20 imbere mu tubati no mu nkuta, hanyuma azamuka agororotse kuri buri aho asohokera · amazi yanduye muri uPVC munsi y'hasi, ubuhaname bwa 1:40 cyangwa burenzeho · sink y'igikoni isohokera ukwayo, kuri grease trap",
      "Buri tiyo igeragezwa ku muvuduko wa bar 10 mu gihe cy'isaha imwe mbere y'uko inkuta zifungwa · ni ibyateganyijwe kugeza umufundi w'amazi ufite uruhushya abyemeje",
    ],
  },
  ref: {
    bom: {
      lead: (total) => `Hafi ${total} hamwe n'inyongera y'ingoboka ya 15 %, mu buryo bukurikiranye bw'urupapuro rwa sitidiyo. Fungura igice urebe imirongo yacyo. Ibiciro ni iby'agateganyo kugeza habonetse ibiciro bitatu byanditse (quotes) kuri buri murongo.`,
      one: "Sitidiyo imwe",
      cable: (mm2, serves) => `Insinga ya ${mm2} mm², ${serves}`,
    },
    shared: {
      lead: (tank, daily, persons, pump, septic, c1, c2) =>
        `Amazi ya WASAC, iriba ricukuwe (borehole) n'imvura iva ku bisenge byuzuza ikigega cy'ifamu cya ${tank} m³, kingana n'iminsi ine ku gipimo cya L ${daily} ku munsi ku bashyitsi ${persons}, kandi pompe yongera umuvuduko yohereza L ${pump} ku munota kuri sitidiyo. WC na douche bisohokera muri septic tank nshya ya ${septic} m³ ifite ibyumba bibiri (${c1} + ${c2} m³); sink z'igikoni zisohokera kuri grease trap yazo bwite.`,
      figure: "P-301 · Igishushanyo cy'amazi n'isuku by'ikibanza",
      total: "Amazi n'isuku, rimwe ku kibanza cyose",
      full: "Urutonde rwuzuye:",
    },
    circuits: {
      lead: "Buri muzunguruko ugenzurwa n'igishushanyo: umuriro wawo ujyana na breaker, breaker ijyana n'insinga, kandi igabanuka rya voltage riguma munsi ya 3 % ku matara na 5 % ku bindi.",
      design: "Umuriro wateganyijwe", drop: "Igabanuka rya voltage", points: "Points", spare: "uw'inyongera",
      figure: "E-202 · Imbonerahamwe y'imizunguruko, earthing na bonding",
    },
    points: {
      lead: (n) => `Points ${n} ku gishushanyo. Ubwiherero bufite itara rya IP65, fan isohora umwuka ya IPX4 kandi nta priza, switch zabyo ziri hanze y'urugi.`,
      figure: "E-101 · Igishushanyo cy'aho amashanyarazi aherereye",
      type: "Ubwoko", height: "Uburebure kuva hasi", load: "Ingufu",
    },
    pipes: {
      lead: "Buri muyoboro ugenzurwa n'igishushanyo: buri gice gikurikira urukuta cyangwa kikazamuka cyangwa kikamanuka kigororotse, buri muyoboro w'amazi yanduye ufite ubuhaname bwa 1:40 cyangwa burenzeho.",
      fall: "Ubuhaname",
      figure: "P-201 · Igishushanyo cy'amatiyo mu buryo bwa isometric (sitidiyo)",
    },
    fittings: {
      lead: (n) => `Points ${n}, kuva kuri stop valve ku muyoboro mukuru kugeza kuri vent hejuru y'igisenge. Sink, heater, douche na WC biri muri metero 1.5 hagati yabyo, bityo amatiyo aguma magufi.`,
      figure: "P-101 · Igishushanyo cy'aho imiyoboro y'amazi iherereye (amazi meza n'ayanduye)",
      pipes: "Imiyoboro", rating: "Igipimo",
    },
    features: [
      { title: "Kuryama", text: "Igitanda kinini kigera kuri m 1.6 × 2.0 cyegamye ku rukuta, gifite udusanduku tubiri two kubikamo munsi yacyo, akameza ko ku buriri, itara ryo gusomeraho na USB-C." },
      { title: "Guteka", text: "Igikoni ku rukuta rw'ubwiherero: firigo yo munsi ya kawunta, hob ya induction y'imyanya ibiri, sink, akayunguruzo k'amazi yo kunywa. Nta gaz imbere mu nzu." },
      { title: "Gukaraba", text: "Douche na WC ku murongo umwe inyuma y'urugi runyerera; intoki zikarabirwa kuri sink y'igikoni." },
      { title: "Kwicara", text: "Icyumba cyo kwicaramo: sofa y'abantu babiri, ameza magufi kandi manini n'intebe ebyiri, iruhande rw'urukuta runyerera rw'ikirahure rwa m 3 rureba kuri deck." },
      { title: "Igisenge", text: "Terase ifunguye yo ku gisenge ifite intebe zo kuruhukiraho inyuma y'uruzitiro rufite hejuru h'igiti, uzamuka esikariye y'icyuma; igisenge gito gitwikira deck." },
      { title: "Guhorana ubukonje", text: "Deck yo ku gisenge itwikira icyuma, foam iterwa kuri cyo imbere, fan yo ku rukuta yimura umwuka, kandi AC yiteguye gushyirwaho." },
    ],
    steps: [
      { n: "1", title: "Gupima", text: "Pima kontineri; igishushanyo cyongera gukora buri gishushanyo gihereye ku bipimo nyabyo." },
      { n: "2", title: "Gukatira i Kigali", text: "Atelier yo ku Gisozi ikata impapuro mu burebure no mu bugari kuri panel saw, ikurikije ibishushanyo byo gukata." },
      { n: "3", title: "Gutobora no gushyiraho nimero", text: "Imyobo kuri grid ya mm 32 ikurikije templates za 1:1; buri gice gihabwa nimero, nka K3-H-07." },
      { n: "4", title: "Gupakira biringaniye", text: "Buri kit ipakirwa iringaniye, buri paki iri munsi ya kg 25, ibyuma bito mu mifuka kuva kuri A kugeza kuri L." },
      { n: "5", title: "Guteranya", text: "Abantu babiri, ibikoresho bimwe, intambwe 27 zishushanyije nta magambo, kuva kuri insulation kugeza kuri terase yo ku gisenge." },
    ],
    downloads: ["Ibishushanyo A3 (PDF)", "Igitabo cyo guteranya A4 (PDF)", "Templates zo gutobora 1:1 (PDF)", "Urutonde rw'ibikoresho (XLSX)", "Urutonde rw'ibice byo gukata (CSV)", "Igishushanyo cya 3D (GLB)"],
  },
  viewer: {
    layers: {
      shell: "Kontineri", envelope: "Insulation na lining", furniture: "Ibikoresho bipakirwa biringaniye",
      fixtures: "Ibikoresho bifashe n'imashini", electrical: "Points z'amashanyarazi", roof: "Terase yo ku gisenge n'ibisenge bito",
    },
    noWebgl: "WebGL ntiboneka muri iyi mushakisha. Ahubwo kuramo GLB.",
    failed: "Igishushanyo nticyashoboye gufunguka.",
    views: { "3d": "3D", plan: "Igishushanyo", inside: "Imbere", roof: "Igisenge" },
    explode: "Gutandukanya",
    steps: (to) => `Intambwe: ${to === null ? "zose" : `kugeza kuri ${to}`}`,
    step: (n, title) => ` · intambwe ya ${n}: ${title}`,
    hint: "Kanda ku gice urebe nimero yacyo, ingano yacyo n'intambwe yo kugiteranya. Kurura uzenguruke, sunika cyangwa ufatanye intoki ngo wegere.",
  },
  json: {
    points: {
      DB: "Board, imyanya 24 (2 × 12), hafi y'igikoni",
      PI: "Inlet y'umuriro 63 A IP67 (IEC 60309 y'ubururu, 2P+E), hanze inyuma ya board",
      L1: "Itara ryo ku gisenge, igitanda", L2: "Itara ryo ku gisenge, aho kubamo", L3: "Itara ryo ku gisenge, igikoni",
      L4: "Itara ry'ubwiherero IP65", L5: "Itara ryo gusomeraho ku rukuta hejuru y'igitanda (ku ruhande rw'urukuta)",
      L7: "Umurongo w'amatara ya LED munsi y'akabati",
      S1: "Ku muryango: amatara y'igitanda (2-way), aho kubamo n'igikoni",
      S2: "Igitanda: itara ryo ku gisenge (2-way), hejuru y'akameza ko ku buriri",
      S3: "Itara na fan by'ubwiherero (hanze, iruhande rw'urugi)",
      F1: "Fan isohora umwuka mu bwiherero mm 100, IPX4 ya zone 1, ikomeza gukora gato nyuma yo kuzimya",
      F2: "Fan yo ku rukuta mm 300",
      P1: "Priza + USB-C mu mutwe w'igitanda (ku ruhande rw'urukuta)",
      P2: "Priza + USB-C ku meza yo ku buriri (itara ryo gusomeraho)",
      P3: "Priza + USB-C hejuru y'ukuboko kwa sofa, ya sofa n'ameza",
      P5: "Priza ya deck IP66, hanze iruhande rw'urugi runyerera",
      P6: "Priza ebyiri ku worktop 1", P7: "Priza ebyiri ku worktop 2 (urukuta rw'inyuma)", P8: "Priza ya firigo",
      P12: "Priza ebyiri inyuma ya chimney ya hotte: hotte + router ya Wi-Fi",
      P9: "Plate aho hob icomekwa, umuriro wayo ucibwa kuri RCBO yayo muri board",
      P10: "Isolateri DP ya heater, hanze y'ubwiherero",
      L8: "Itara rya deck IP65, munsi y'igisenge cya veranda", S5: "Itara rya deck, iruhande rwa switch yo ku muryango",
      S4: "Amatara ya esikariye n'igisenge (2-way), IP65 hasi ya esikariye", L10: "Itara rya esikariye IP65",
      S6: "Amatara ya esikariye n'igisenge (2-way), IP65 hejuru ya esikariye",
      L9: "Amatara ya terase yo ku gisenge IP65 (× 2), munsi y'uruzitiro rw'imbere",
      P11: "AC iteganyijwe: isolateri",
      AL1: "Alarm y'umwotsi, bateri y'imyaka 10", AL2: "Alarm y'ubushyuhe, igikoni, bateri y'imyaka 10",
      E1: "Earth rod ya m 1.5 isizweho umuringa, mu cyobo cyo kugenzuriramo, inyuma ya board",
    },
    circuits: {
      C1: "Amatara y'imbere na fans", C2: "Priza: igitanda, sofa na deck", C3: "Priza z'igikoni, firigo na hotte",
      C4: "Hob ya induction", C5: "Heater ya douche ihita ishyushya 5.5 kW", C6: "Amatara yo hanze: deck, esikariye n'igisenge",
      C7: "AC iteganyijwe", C8: "Uw'inyongera",
    },
    fittings: {
      SV: { description: "Stop valve, Y-filter na mubazi yo kugenzura ku muyoboro mukuru, muri sink base" },
      WH: { description: "Heater ihita ishyushya ku rukuta rwa end B imbere muri douche, ecran yayo ku burebure bw'amaso; amazi ashyushye ajya kuri douche gusa", rating: "5.5 kW, hafi L 4 ku munota, 40 C" },
      KT: { description: "Robine y'igikoni (amazi akonje), angle valve yayo munsi ya sink", rating: "L 6 ku munota" },
      DF: { description: "Akayunguruzo k'amazi yo kunywa muri sink base, gafite robine yako iruhande rwa robine y'igikoni", rating: "amazi yo kunywa" },
      SH: { description: "Douche ifatwa mu ntoki kuri rail ku rukuta rwa end B, ihabwa amazi na hose ya heater", rating: "hafi L 4 ku munota" },
      WC: { description: "Cistern ihishe mu rukuta rwa end B, plate ya dual-flush", rating: "dual flush" },
      IC1: { description: "Inspection chamber hanze ya end B, ikomeza kuri septic tank y'ifamu", rating: "DN110 yinjira" },
      GT: { description: "Ijya kuri grease trap y'ifamu na soak pit yayo bwite", rating: "DN50 yinjira" },
      VT: { description: "Umusozo wa vent, mm 900 hejuru y'uruzitiro rwo ku gisenge" },
    },
    pipes: {
      D1: "WC ijya kuri IC1, 1:40", D2: "Douche (umwobo wa tray wa mm 90) yinjira mu muyoboro wa WC",
      D4: "Sink y'igikoni ijya kuri grease trap (soak pit yihariye)",
      V1: "Vent ifunguye izamuka kuri end B kugeza mm 900 hejuru y'uruzitiro",
      W1: "Umuyoboro mukuru w'amazi akonje uva ku ifamu, uzamuka muri sink base: stop valve, filter, mubazi yo kugenzura",
      W2: "Amazi akonje azamuka ku rukuta rwa end B agana ku kirenge cya heater", W3: "Amazi akonje ajya kuri angle valve ya sink",
      W4: "Amazi akonje anyura muri partition no mu nkuta agana kuri cistern ya WC",
      H1: "Amazi ashyushye ava hejuru kuri heater ajya kuri douche ifatwa mu ntoki: hose yayo bwite",
    },
    systems: { soil: "imyanda ya WC", waste: "amazi yanduye", vent: "umwuka", cold: "akonje", hot: "ashyushye" },
    kinds: {
      db: "board", inlet: "inlet y'umuriro", light: "itara", switch: "switch", usb: "priza + USB-C", socket: "priza",
      outlet: "aho bicomekwa", fan: "fan", alarm: "alarm", earth: "earth rod",
    },
    fitKinds: {
      valve: "valve", heater: "heater", tap: "robine", filter: "akayunguruzo", shower: "douche", wc: "WC", site: "ku kibanza", vent: "vent",
    },
    bom: {
      "MPLY18 sheet 2440x1220x18": "Urupapuro rwa MPLY18 2440x1220x18",
      "PLY12 sheet 2440x1220x12": "Urupapuro rwa PLY12 2440x1220x12",
      "PLY18 sheet 2440x1220x18": "Urupapuro rwa PLY18 2440x1220x18",
      "WTOP38 sheet 3050x650x38": "Urupapuro rwa WTOP38 3050x650x38",
      "ABS edge band (2 mm visible, 0.8 mm hidden)": "Umurongo w'impera ABS (mm 2 ahagaragara, mm 0.8 ahihishe)",
      "Bag A: Confirmat screw 7 x 50": "Umufuka A: vis ya Confirmat 7 x 50",
      "Bag B: Wood dowel 8 x 35": "Umufuka B: agati ko guhuza (dowel) 8 x 35",
      "Bag C: Connector bolt M6 x 60 + barrel nut 10 mm": "Umufuka C: boulon yo guhuza M6 x 60 + écrou ya mm 10",
      "Bag D: Cup hinge 35 mm soft-close + plate": "Umufuka D: pata ya mm 35 ifunga buhoro + plate",
      "Bag E: Shelf pin 5 mm": "Umufuka E: agashinge k'akabati mm 5",
      "Bag F: Wood screw 4 x 30": "Umufuka F: vis y'igiti 4 x 30",
      "Bag G: Ball-bearing runner 450 mm (pair)": "Umufuka G: inzira y'agakabati ifite roulements mm 450 (ebyiri)",
      "Bag J: Handle 128 mm centres": "Umufuka J: igifashe cya mm 128",
      "Bag K: Castor 50 mm": "Umufuka K: akaziga mm 50",
      "Bag L: Winged self-drilling screw 5.5 x 50 (38 mm battens to the steel)": "Umufuka L: vis yitobora ifite amababa 5.5 x 50 (ibiti bya mm 38 ku cyuma)",
      "Fabricated steel: beams, joists, posts, rails, treads (painted)": "Ibyuma bikozwe: ibiti by'icyuma, imitambiko, inkingi, inzitiro, intambwe (bisize irangi)",
      "Treated hardwood: deck boards, top rail, chairs, side table": "Igiti gikomeye cyatewe umuti: imbaho za deck, uruzitiro rwo hejuru, intebe, akameza",
      "Tinted multiwall polycarbonate 10 mm (front deck canopy)": "Polycarbonate y'amabara y'ibice byinshi mm 10 (igisenge cya deck y'imbere)",
      "Guardrail cable infill: 4 mm stainless, 10 runs, with tensioners": "Insinga z'uruzitiro: mm 4 z'icyuma kitagwa ingese, imirongo 10, n'ibizikurura",
      "Stair stringers, handrails and footings": "Impande za esikariye, ibyo gufata n'imisingi",
      "Ply 12 mm sheets 2440 x 1220 for the floor, laid wall to wall in two staggered runs": "Impapuro za pulayiwudi mm 12, 2440 x 1220, z'hasi, kuva ku rukuta kugeza ku rundi mu mirongo ibiri isimburana",
      "Closed-cell spray foam between the battens, back": "Spray foam ya closed-cell hagati y'ibiti, urukuta rw'inyuma",
      "Closed-cell spray foam between the battens, front-A": "Spray foam ya closed-cell hagati y'ibiti, imbere-A",
      "Closed-cell spray foam between the battens, ceiling": "Spray foam ya closed-cell hagati y'ibiti, igisenge",
      "Closed-cell spray foam between the battens, end-A": "Spray foam ya closed-cell hagati y'ibiti, end A",
      "PU foam adhesive and gap filler (750 ml)": "Kole ya PU foam n'iyuzuza imyanya (ml 750)",
      "Polythene membrane 250 um over the treated container floor, laps 150 mm": "Membrane ya polythene 250 µm hejuru y'hasi ha kontineri hatewe umuti, ibice birengerana mm 150",
      "Oak SPC plank 5 mm with attached underlay, natural oak decor without knots (living area)": "Imbaho za SPC zisa na oak mm 5 zifite underlay, isura ya oak isanzwe nta mapfundo (aho kubamo)",
      "Rust converter + zinc primer for steel": "Umuti uhindura ingese + primer ya zinc y'icyuma",
      "Vapour-retarding primer + off-white paint for the linings": "Primer ibuza ubuhehere + irangi ry'umweru utarera rya lining",
      "Sliding door leaf 574 x 2,055, moisture-resistant, flush pulls, privacy hook lock": "Urugi runyerera 574 x 2,055, rutangizwa n'ubuhehere, imikoba yinjiye mu rugi, ingufuri y'ubwiherero",
      "Surface sliding-door track 1140 mm with soft-close, end stop and floor guide, on the cross wall's lobby face": "Inzira y'urugi runyerera mm 1140 ifunga buhoro, ifite icyo guhagarika n'icyo kuyobora hasi, ku ruhande rw'inyuma rw'urukuta rwambukiranya",
      "Cement board 12 mm + liquid membrane, back wall": "Cement board mm 12 + membrane y'amazi, urukuta rw'inyuma",
      "Wall tiles + adhesive + grout, back wall": "Amakaro yo ku rukuta + kole + grout, urukuta rw'inyuma",
      "Cement board 12 mm + liquid membrane, end wall B, built out 30 mm over the concealed WC cistern (stud wall inside the cargo doors)": "Cement board mm 12 + membrane y'amazi, urukuta rwa end B, rwongerewe mm 30 hejuru ya cistern ya WC ihishe (urukuta rw'ibiti imbere y'inzugi za kontineri)",
      "Wall tiles + adhesive + grout, end wall B, built out 30 mm over the concealed WC cistern (stud wall inside the cargo doors)": "Amakaro yo ku rukuta + kole + grout, urukuta rwa end B, rwongerewe mm 30 hejuru ya cistern ya WC ihishe (urukuta rw'ibiti imbere y'inzugi za kontineri)",
      "Cement board 12 mm + liquid membrane, partition, bath face": "Cement board mm 12 + membrane y'amazi, partition, uruhande rw'ubwiherero",
      "Wall tiles + adhesive + grout, partition, bath face": "Amakaro yo ku rukuta + kole + grout, partition, uruhande rw'ubwiherero",
      "Cement board 12 mm + liquid membrane, cross wall, bath face": "Cement board mm 12 + membrane y'amazi, urukuta rwambukiranya, uruhande rw'ubwiherero",
      "Wall tiles + adhesive + grout, cross wall, bath face": "Amakaro yo ku rukuta + kole + grout, urukuta rwambukiranya, uruhande rw'ubwiherero",
      "Safety vinyl sheet, coved 100 mm up the walls (bathroom and lobby)": "Vinyl itanyerera, izamuka mm 100 ku nkuta (ubwiherero n'imbere yabwo)",
      "Shower tray 1000 x 900, low profile, 90 mm waste": "Tray ya douche 1000 x 900, ngufi, umwobo wa mm 90",
      "Fixed glass shower screen 700 x 2,000, 8 mm toughened": "Ikirahure gihamye cya douche 700 x 2,000, gikomeye mm 8",
      "Wall-hung WC, short projection (520), soft-close seat": "WC ifashwe ku rukuta, isohoka gato (520), intebe ifunga buhoro",
      "Slim concealed cistern frame (80 mm) with dual-flush plate, in the end-B stud wall and its 30 mm build-out": "Ikadiri ya cistern yoroheje ihishe (mm 80) ifite plate ya dual-flush, mu rukuta rw'ibiti rwa end B n'inyongera yarwo ya mm 30",
      "Towel rail, robe hook, toilet-roll holder, shower shelf": "Icyo kumanikaho isume, agashinge k'ikanzu, icyo gushyiraho impapuro z'isuku, akabati ka douche",
      "Hob base adjustable legs": "Amaguru ahindurwa y'akabati ka hob",
      "Sink base adjustable legs": "Amaguru ahindurwa y'akabati ka sink",
      "Two-zone induction hob, zones side by side, black glass 590 x 350, front knobs, about 3.5 kW": "Hob ya induction y'imyanya ibiri iri iruhande rw'indi, ikirahure cy'umukara 590 x 350, ibihindura imbere, hafi kW 3.5",
      "Inset stainless sink about 380 x 420, single bowl": "Sink y'icyuma kitagwa ingese yinjijwe, hafi 380 x 420, ibase rimwe",
      "Kitchen mixer tap": "Robine ivanga y'igikoni",
      "Under-counter fridge about 90 L (A-class)": "Firigo yo munsi ya kawunta hafi L 90 (icyiciro A)",
      "Chimney hood 600 mm, black, recirculating with a charcoal filter": "Hotte ifite chimney mm 600, y'umukara, isubiza umwuka inyujije muri filter y'amakara",
      "Telescopic chimney cover 260 x 220, hood to the ceiling (comes with the hood)": "Igipfundikizo cya chimney kirambuka 260 x 220, kuva kuri hotte kugeza ku gisenge (kizana na hotte)",
      "Under-sink drinking-water filter + faucet": "Akayunguruzo k'amazi yo kunywa ko munsi ya sink + robine yako",
      "Mattress up to 1,600 x 2,000 (local size, e.g. 5 x 6 ft), 200 mm": "Matela igera kuri 1,600 x 2,000 (ingano yo mu gihugu, urugero 5 x 6 ft), mm 200",
      "Table lamp, linen drum shade, LED E27 (reading lamp)": "Itara ryo ku meza, igitwikirizo cya linen kimeze nk'ingoma, LED E27 (itara ryo gusomeraho)",
      "Coat hooks, hanging rail by the door and a folding luggage rack": "Udushinge two kumanikaho amakote, icyuma cyo kumanikaho iruhande rw'urugi n'igiterekwaho imizigo kizingwa",
      "Low two-seat sofa about 1300 x 750, 700 high, soft dark grey washable covers": "Sofa ngufi y'abantu babiri hafi 1300 x 750, uburebure 700, ibitwikirizo by'ivu ryijimye bimeswa",
      "Blackout curtain + track for the 3 m slider": "Rido ribuza urumuri + inzira yaryo y'urugi runyerera rwa m 3",
      "Insect screens: slider (sliding), W1, vents": "Inzitiramibu: urugi runyerera (inyerera), W1, aho umwuka winjirira",
      "Joinery finish: medium-oak stain + clear matte PU varnish over pine (all furniture)": "Isura y'ibikoresho: irangi rya medium oak + vernis ya PU itarabagirana ku giti cya pinusi (ibikoresho byose)",
      "Cable 16 mm2 tails, inlet to main breaker, through a gland in the back wall": "Tails z'insinga za 16 mm², kuva kuri inlet kugeza kuri breaker nkuru, zinyuze muri gland mu rukuta rw'inyuma",
      "Matching 63 A plug (IEC 60309 blue), for whatever supply cable": "Plug ya 63 A ijyanye na yo (IEC 60309 y'ubururu), y'insinga y'umuriro iyo ari yo yose",
      "PVC conduit 20 mm + boxes, in the lining": "Conduit ya PVC mm 20 + udusanduku, muri lining",
      "UV-stable conduit 20 mm + IP66 glands, outdoor runs": "Conduit idangizwa n'izuba mm 20 + glands za IP66, inzira zo hanze",
      "Main breaker 63 A DP (C curve) + DIN kWh check meter": "Breaker nkuru 63 A DP (C curve) + mubazi ya kWh yo kugenzura DIN",
      "Surge protection device type 2": "SPD (irinda umuriro mwinshi utunguranye) type 2",
      "RCBOs 30 mA type A, 1 module (B6 x2, B16 x3, B20 x1, B25 x1)": "RCBO 30 mA type A, umwanya 1 (B6 x2, B16 x3, B20 x1, B25 x1)",
      "Priority relay, DIN: senses the hob (C4) and sheds C5 and C7": "Priority relay, DIN: imenya ko hob (C4) ikora igahagarika C5 na C7",
      "Contactor 2-pole 40 A, DIN: the C5 and C7 lines": "Contactor 2-pole 40 A, DIN: imirongo ya C5 na C7",
      "Fire extinguisher 2 kg ABC + fire blanket": "Kizimyamwoto kg 2 ABC + ikiringiti kizimya umuriro",
      "PPR PN20 pipe DN20": "Itiyo PPR PN20 DN20",
      "PPR PN20 pipe DN25": "Itiyo PPR PN20 DN25",
      "uPVC soil pipe DN110": "Itiyo y'imyanda ya WC uPVC DN110",
      "uPVC vent pipe DN75": "Itiyo ya vent uPVC DN75",
      "uPVC waste pipe DN40": "Itiyo y'amazi yanduye uPVC DN40",
      "uPVC waste pipe DN50": "Itiyo y'amazi yanduye uPVC DN50",
      "Pipe fittings and clips (allowance)": "Fittings z'amatiyo n'ibizifata (ingengo rusange)",
      "Shower slide rail with hand-shower holder": "Rail ya douche ifite icyo gufata douche y'intoki",
      "Instant electric shower heater 5.5 kW, IPX4, digital thermostat, hand shower and hose": "Heater y'amashanyarazi ya douche ihita ishyushya 5.5 kW, IPX4, thermostat ya digital, douche y'intoki na hose",
      "Angle valves with filters": "Angle valves zifite filters",
      "Air admittance valve 110 mm (spare) + rodding eyes": "Valve yinjiza umwuka mm 110 (y'inyongera) + rodding eyes",
      "Stop valve + Y-filter + check water meter": "Stop valve + Y-filter + mubazi y'amazi yo kugenzura",
      "W1 infill: 2 mm steel welded into the old door frame (0-1,150), foamed with the walls": "Kuziba W1: icyuma cya mm 2 gisudiwe mu ikadiri y'urugi rwa kera (0-1,150), giterwaho foam hamwe n'inkuta",
      "W1 obscure louvre window 520 x 890 + insect mesh (bathroom lobby)": "Idirishya rya W1 ry'ibirahure bitabonerana bifite imirongo 520 x 890 + inzitiramibu (imbere y'ubwiherero)",
      "Seal and lock the end-B cargo doors (weld tabs, sealant)": "Gufunga no kuziba inzugi za kontineri za end B (gusudira, sealant)",
      "Concrete block stands 40 x 60 cm under the four corner castings, levelled (D-029)": "Ibitereko bya beto cm 40 x 60 munsi y'ibyuma bine byo ku nguni, biringanijwe (D-029)",
      "Steel hanging rail for the wall units": "Icyuma cyo kumanikaho utubati two ku rukuta",
      "Keyed lock + secondary bolt for the slider": "Ingufuri ifite urufunguzo + verou y'inyongera y'urugi runyerera",
      "Louvred trickle-vent strip with mesh (10,000 mm2)": "Umurongo w'aho umwuka winjira buhoro ufite inzitiramibu (mm² 10,000)",
      "AC wall sleeve 75 mm (provision, back wall, one hole)": "Umwobo wa AC mu rukuta mm 75 (uteganyijwe, urukuta rw'inyuma, umwobo umwe)",
      "Gutter + downpipe to the rainwater tank (deck canopy)": "Umuyoboro w'amazi y'imvura + itiyo imanuka ijya ku kigega cy'amazi y'imvura (igisenge cya deck)",
      "Bonding: 16 mm2 green-yellow from the frame to the earth bar": "Bonding: insinga ya 16 mm² y'icyatsi n'umuhondo kuva ku ikadiri kugeza kuri earth bar",
      "Battens 38 x 50 treated, 2.4 m": "Ibiti (battens) 38 x 50 byatewe umuti, m 2.4",
      "Studs 40 x 40 treated, 2.4 m": "Ibiti by'urukuta (studs) 40 x 40 byatewe umuti, m 2.4",
      "Carpentry workshop: cutting, edging, drilling, labelling (per unit kit)": "Atelier y'ububaji: gukata, gushyiraho impera, gutobora, gushyiraho nimero (kit ya buri sitidiyo)",
      "Site carpentry and assembly: 2 people x 8 days": "Ububaji ku kibanza no guteranya: abantu 2 x iminsi 8",
      "Electrician (RURA class A), install + certificate": "Umuyagankuba (RURA class A), gushyiraho + icyemezo",
      "Plumber, install + tests": "Umufundi w'amazi, gushyiraho + igerageza",
      "Tiler: wet walls and floor": "Ushyiraho amakaro: inkuta zitose n'hasi",
      "Welder: W1, roof frame, deck canopy, stair (per unit)": "Usudira: W1, ikadiri y'igisenge, igisenge cya deck, esikariye (kuri buri sitidiyo)",
      "Transport Kigali to site (share of 2 truck trips)": "Ubwikorezi kuva i Kigali kugeza ku kibanza (umugabane w'ingendo 2 z'ikamyo)",
    },
    units: { sheet: "urupapuro", set: "iseti", lot: "byose" },
    groups: {
      "Board and protection": "Board n'uburinzi", "Earthing and bonding": "Earthing na bonding", "Cable and conduit": "Insinga na conduit",
      Lights: "Amatara", Switches: "Switch", "Sockets and outlets": "Priza n'aho bicomekwa", Fans: "Fans", Alarms: "Alarms",
      Appliances: "Imashini", Labour: "Umurimo", Sanitaryware: "Ibikoresho by'ubwiherero", "Hot water": "Amazi ashyushye",
      "Supply pipe": "Amatiyo y'amazi meza", "Drain and vent pipe": "Amatiyo y'amazi yanduye na vent", "Valves and fittings": "Valves na fittings",
      "Drinking water": "Amazi yo kunywa", Water: "Amazi", Accessories: "Utundi dukoresho", Bedding: "Ibyo kuryamaho", Boards: "Impapuro",
      Doors: "Inzugi", Finishes: "Ibisoza (finishes)", Furnishing: "Ibikoresho byo mu nzu", Glazing: "Ibirahure", Hardware: "Ibyuma bito",
      Insulation: "Insulation", "Roof kit": "Kit y'igisenge", Roofing: "Igisenge", Safety: "Umutekano", Steel: "Ibyuma",
      Timber: "Ibiti", "Wet walls": "Inkuta zitose", Electrical: "Amashanyarazi", Plumbing: "Imiyoboro y'amazi",
    },
    sections: {
      "Floor and wall lining": "Lining y'hasi n'iy'inkuta", Bed: "Igitanda", Seating: "Aho kwicara", Galley: "Igikoni", Bath: "Ubwiherero",
      "Boards, edging and hardware": "Impapuro, impera n'ibyuma bito", Electric: "Amashanyarazi", Plumbing: "Imiyoboro y'amazi",
      "Steel, window and doors": "Ibyuma, idirishya n'inzugi", "Roof terrace, canopy and stair": "Terase yo ku gisenge, igisenge gito na esikariye",
      "Labour and transport": "Umurimo n'ubwikorezi",
    },
    shared: {
      "Septic tank (2 chambers, about 4 m3) + inspection chambers": "Septic tank (ibyumba 2, hafi m³ 4) + inspection chambers",
      "Soak pit and drain field after a percolation test": "Soak pit n'ahantu amazi acengera nyuma ya percolation test",
      "Grease trap + kitchen soak pit": "Grease trap + soak pit y'igikoni",
      "Storage tank 4-5 m3 on a stand + float valve + air gap": "Ikigega cy'amazi m³ 4-5 ku gitereko + float valve + air gap",
      "Booster pump + pressure vessel + controls": "Pompe yongera umuvuduko + ikigega cy'umuvuduko + ibiyiyobora",
    },
    contingency: (s) => s.replace(/^contingency/, "Ingoboka"),
  },
}

export const words: Words<typeof en> = { en, rw }
