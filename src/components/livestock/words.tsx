import type * as React from "react"

import type { Words } from "@/components/internationalization/words"

// Every word of the livestock yard's page, its drawings, its rails and its docs tables (D-058): the English, then its
// Kinyarwanda, a machine draft until a native speaker reviews it. livestock.json keeps its English for the render
// scripts; `json` lays the Kinyarwanda over its water points by id (data.ts).
type L = (href: string, text: string) => React.ReactNode
type Point = { what: string; where: string; size: string }

const en = {
  meta: {
    title: "The livestock · Farm",
    description: "Goats and sheep in one village yard by a thatched shelter, with three cats, free-flying doves and two guard dogs, part of the farm’s loop from field to compost, at the Digital Farm near Kigali.",
  },
  hero: {
    title: "Goats and sheep on open pasture",
    alt: "A livestock yard on a Rwandan hillside under a soft grey sky: a shed with a shaggy thatched roof and two sheep inside, goats and black-headed sheep on straw behind a rail fence lashed with rope, a dovecote with white doves and a cats’ house on posts at the left, a water tank and two dog kennels at the right, woven baskets by the gate, banana plants and eucalyptus round the yard, and terraced green hills behind.",
  },
  plan: {
    title: "Plan: one outline 17,200 by 9,600 mm, a post-and-rail fence all round with one gate to the paddock. Inside, the herd’s shed copied from the founder’s photo, 4,400 by 3,000 mm under a thatched gable on a low fieldstone plinth: a boarded back and east end, the west end open behind one rail, the front open between two braced corner posts; inside a straw bale, a plank table with a basket over a lidded crate, and the two mineral boxes. The village yard for the herd, the cats, the doves and the guests, with troughs, climbing stones, a shade tree, a log bench, a dovecote and a cats’ house on posts; by the shed the tank on its stone base with three buckets, fodder baskets and three compost bays, and the guard dogs’ run with two kennels in the back east corner; banana clumps and shrubs round the outside and two vegetable beds in front.",
    labels: { cats: "CATS", shed: "SHED", tank: "TANK", compost: "COMPOST", dogs: "DOGS", yard: "VILLAGE YARD", doves: "DOVES", bench: "BENCH", paddock: "TO THE PADDOCK · GUESTS", vegetables: "VEGETABLES" },
  },
  model: {
    lineAlt: "Line drawing of the livestock yard from the paddock: one crooked post-and-rail fence all round with a two-leaf gate, banana clumps behind; the shed as in the hero, its steep thatched gable over a boarded back and side and two braced corner posts, two sheep inside by a straw bale and a table; goats and sheep in the yard, one goat on a stone, troughs, a bench, the dovecote and the cats’ house on posts, three cats, the guarded tree; the tank on its stone base with three buckets, the baskets, the compost bays and the dogs’ run with two kennels; two vegetable beds in front.",
    realAlt: "The same view rendered: banana plants behind a fence of thick crooked rails lashed with rope; the shed of dark weathered boards and heavy barked posts under a shaggy thatch, two white sheep on golden straw; goats and black-headed sheep on red-brown earth and straw, a ginger cat on its house, doves on the dovecote, an earth-brown tank on a stone base with three black buckets, baskets of green fodder, the compost bays, a tan and a black dog in their run, and two beds of cabbages outside the front.",
  },
  shed: {
    title: "Shed",
    baseAlt: "The shed's plinth seen low from the front: rammed earth edged with fieldstones, on the white page.",
    builds: [
      "Four barked corner posts, then the eaves beam, the plate, the tie beams and the braces.",
      "Wide boards set upright along the back and the east end.",
      "The gable rafters, then the grass thatch laid from the eaves up.",
      "Deep straw on the floor, then the bale, the feed table and the mineral boxes.",
    ],
    stages: (s: { l: number; d: number; plinth: number; eaves: number; ridge: number; over: number; perHead: string; head: number }) => [
      { title: "The plinth", text: `${s.l} × ${s.d} m of rammed earth on a plinth ${s.plinth} cm high, edged with fieldstones, so rain runs off and the herd lies dry. At least 200 m from the lake’s flood line (LOC-02).` },
      { title: "Step 1 · Frame", text: "Four heavy barked eucalyptus posts, the eaves beam along the open front and the plate along the back, a tie beam at each end and a knee brace at each front post." },
      { title: "Step 2 · Boards", text: "Dark weathered boards set upright at the back and the east end, against the wind; the west end stays open behind one rail and the front is open." },
      { title: "Step 3 · Thatch", text: `A steep grass thatch on the gable, its eaves ${s.eaves} m up, the ridge at ${s.ridge} m, overhanging ${s.over} m so the troughs stand in its shade.` },
      { title: "Step 4 · Straw and fittings", text: `Deep straw over the earth, ${s.perHead} m² a head for ${s.head} head; a bale, the feed table over its locking crate, and the mineral boxes, the goats’ high and the sheep’s low.` },
    ],
  },
  sections: { animals: "Animals", yard: "Yard", water: "Water", manure: "Manure" },
  water: {
    figureAlt: "Line drawing of the shed, the tank and the troughs from the paddock: the farm's line in dark blue up the tank's side to the float valve under its lid, the outlet valve and the bucket tap in orange on the riser down the tank's stone base, the yard line in blue past the shed's east end and along the front of the eaves, and a light-blue riser up to each trough.",
    note: (link: L): React.ReactNode => <>
      The farm&rsquo;s line fills the tank through a float valve; from the tank&rsquo;s foot one buried line feeds a float
      valve in each trough, so the troughs stay full without anyone carrying water. Each tag opens its row in the{" "}
      {link("/docs/livestock/water#points", "points table")}. Off the drawing: the dogs&rsquo;
      bowl (B), filled by bucket from the tap. Where the farm&rsquo;s line comes from waits for the farm&rsquo;s water plan and
      the borehole test, and water for livestock on a farm needs a water use permit (LOC-04).
    </>,
    caption: "Rendered from the design model: the yard line drawn on the ground where it runs buried",
    realAlt: "The same view rendered: the thatched shed with sheep on the straw, the earth-brown tank on its stone base with a black pipe up its side, a brass valve with a red lever and a tap on the riser, the black yard line past the buckets and along the front of the eaves to the two plank troughs of water, goats and sheep in the yard.",
    // the water diagram (water-diagram.tsx)
    diagram: {
      label: (tank: string, m: number) => `Water diagram: the farm's water line fills the ${tank} litre tank by the shed through a float valve; from the outlet valve at the tank's foot a 20 mm line, about ${m} m, runs buried to a float valve in each of the two troughs, and a bucket tap fills the buckets for the dogs' bowl`,
      key: { farm: "The farm’s line", supply: "Yard line 20 mm", riser: "Riser to a trough", valve: "Valve or tap" },
      farm: { title: "Farm line", sub: "from the farm’s water" },
      underFence: "under the back fence",
      float: "float valve",
      tank: (tank: string) => `Tank ${tank} L`,
      tankSub: "T · on a stone base 1.2 m high",
      buckets: { title: "Buckets", sub: "B · the dogs’ bowl, the cats" },
      yard: (m: number) => `20 mm PE · about ${m} m, buried 30 cm`,
      west: "West trough", east: "East trough",
      trough: (id: string) => `${id} · float valve, 1.0 × 0.35 m`,
      notes: (lo: number, hi: number, peak: number, d0: number, d1: number): [string, string] => [
        `The yard drinks about ${lo} to ${hi} L a day, up to about ${peak} L with does and ewes in milk in the dry season [E] · a full tank lasts about ${d0} to ${d1} days if the farm line stops`,
        "The tank stands only about 1.2 m above the troughs, so their floats are low-pressure ones · sizes and routes are design intent",
      ],
    },
  },
  // the manure diagram (manure-diagram.tsx)
  manure: {
    label: (n: number) => `Manure diagram: litter and manure from the shed and the yard go to the first of ${n} compost bays, are turned into the second and the third, and the finished compost goes to the vegetable beds and the tree pits; the beds' residues and cut fodder come back to the herd in baskets`,
    shed: { title: "Shed and yard", sub: "litter and manure, cleared daily" },
    bay1: { title: "Bay 1 · fresh", sub: (b: number) => `${b} × ${b} m, pole sides` },
    bay2: { title: "Bay 2 · turning", sub: "hot: 55 °C for 3 days, turned" },
    bay3: { title: "Bay 3 · finished", sub: "dark, crumbly, cool" },
    beds: { title: "Beds and tree pits", sub: "the field and the fruit row" },
    back: "the beds’ residues and the cut fodder come back to the herd in baskets",
    notes: [
      "Nothing goes on a bed of anything eaten until it has been hot-composted · the bays close with a removable rail, so the goats stay out",
      "No manure is weighed yet, so no tonnage is shown · the compost pad, like the shed, sits at least 200 m from the lake",
    ] as [string, string],
  },
  docs: [
    { href: "/docs/livestock", title: "Execution plan", text: "The checks before any animal, the shed and the yard, the daily care and the rules, for 6 goats and 4 sheep." },
    { href: "/docs/livestock/materials", title: "Materials", text: "The animals, the yard's fittings, the water and the manure loop, each with its size and source." },
    { href: "/docs/livestock/water", title: "Water", text: "The tank, the buried line and the float troughs, what the yard drinks a day, and every point." },
  ],
  rails: {
    head: "Head", whereFrom: "Where from", cost: "Cost",
    notSourced: "Not sourced yet", notBudgeted: "Not in the budget yet",
    goat: { title: "Goats", head: (n: number) => `${n} local goats`, from: "Several small farms with health records, then the vet’s quarantine",
      cost: "About RWF 40,000 for a medium goat in Bugesera (2022, LVS-01)", alt: "A brown local goat, standing.",
      note: "Browsers: hay stays in the racks, off the ground, against worms. Their mineral box hangs high, out of the sheep’s reach." },
    sheep: { title: "Sheep", head: (n: number) => `${n} fat-tailed hair sheep`, from: "Not sourced yet: no breeder with stock found",
      cost: "About RWF 100,000 for a 30–35 kg sheep at Mukamira (2024, LVS-56)", alt: "A white fat-tailed sheep with a black face.",
      note: "Copper in the goats’ minerals is toxic to sheep (LVS-26), so theirs sits low and apart. Both carry the same worms (LVS-46)." },
    dog: { title: "Guard dogs", head: (n: number) => `${n}, in their own run`, alt: "A tan guard dog.",
      note: "Against theft at night (LVS-01). Vaccinated against rabies and walked on the lead past the small animals." },
    cat: { title: "Cats", head: (n: number) => `${n}, neutered`, alt: "A grey cat.",
      note: "Farm friends for the guests. The hay and the feed stay covered: cat droppings can carry toxoplasmosis, which makes ewes and does abort (to check with the vet)." },
    doves: { title: "Doves", head: "Free-flying; the number is open", alt: "A dovecote on a tall pole, doves on its ledge.",
      note: (s: number, h: number) => `A dovecote ${s} m square on a ${h} m pole in the yard.` },
    table: { title: "Feed table and crate", size: (a: string, b: string, h: number, c: string, d: string) => `Table ${a} × ${b} m, top at ${h} m; crate ${c} × ${d} m, lidded`,
      alt: "A plank table with a basket of hay on it over a lidded crate.", note: "The hay in a basket off the floor, the feed in a crate that locks." },
    minerals: { title: "Mineral boxes × 2", size: (a: string, b: string, g: number, s: number) => `${a} × ${b} m each; goats’ at ${g} m, sheep’s at ${s} m`,
      alt: "Two small mineral boxes on the shed’s back boards, one high and one low.", note: "Goat minerals high, sheep minerals low (LVS-26).",
      where: "Built on the farm; the minerals not sourced yet", cost: "Minerals RWF 2,500 a head a year (the model’s placeholder)" },
    bale: { title: "Straw bale", alt: "A straw bale.", note: "Bedding and a seat for the herd; the litter goes to the compost.", where: "Not sourced yet: RAB stations sell some hay (LVS-50)" },
    kennel: { title: (n: number) => `Kennels × ${n}`, size: (a: string, b: string) => `${a} × ${b} m, raised on bearers, pitched roof`,
      alt: "A raised plank kennel with a pitched roof and a round door.", note: (a: string, b: string) => `In the dogs’ run, ${a} × ${b} m, fenced, in the back east corner.` },
    cathouse: { title: "Cats’ house", size: (s: number, h: number) => `${s} × ${s} m on a ${h} m post`, alt: "A small plank house with a ledge on a post.",
      note: "Out of the dogs’ reach, by the fence." },
    boards: "Built on the farm from boards",
    tank: { title: "Tank", size: (l: string, d: number, h: number, stand: number) => `${l} L, Ø ${d} m, ${h} m high, on a stone base ${stand} m high`,
      alt: "A round earth-brown tank on a square stone base.", note: "T · filled from the farm’s line, never from the thatch: grass roofs do not give clean rain." },
    float: { title: "Float valves × 3", size: "½ inch, low-pressure", alt: "A brass float valve with its arm and a white float.",
      note: "FV on the tank, W1 and W2 in the troughs: the head from the tank is only about 1.2 m, so a mains float would barely open." },
    pipe: { title: "Yard line", size: (m: number) => `About ${m} m of 20 mm PE, buried 30 cm`, alt: "A coil of black 20 mm PE pipe.",
      note: "S1 · from the tank’s foot past the shed’s east end and along the front of the eaves, a riser up to each trough." },
    valve: { title: "Outlet valve", size: "20 mm ball valve", alt: "A brass ball valve with a red lever on black pipe.",
      note: "V1 · shuts the yard line for a repair without emptying the tank." },
    tap: { title: "Bucket tap", size: "½ inch bib tap", alt: "A brass bib tap on a board.", note: "TP · fills the buckets for the dogs’ bowl and the cats." },
    trough: { title: (n: number) => `Troughs × ${n}`, size: (a: string, d: number, h: number) => `${a} × ${d} m, ${h} m high`,
      alt: "A plank trough on two legs, full of water.", note: "W1 and W2 · in the shade of the eaves; scrubbed out every week." },
    buckets: { title: (n: number) => `Buckets × ${n}`, size: "Black, by the tank", alt: "Three black buckets.", note: "For water and feed, by the tank." },
    bowl: { title: "Dogs’ bowl", size: (d: number) => `Ø ${d} m`, alt: "A low round bowl.", note: "B · in the dogs’ run, filled twice a day from TP." },
    compost: { title: (n: number) => `Compost bays × ${n}`, size: (b: number) => `${b} × ${b} m each, pole sides, a removable front rail`,
      alt: "Three pole bays in a row: fresh litter, a turning heap and finished compost.",
      note: "By the tank, on the path past the shed’s east end. Fresh in the first, turning in the second, finished in the third.",
      where: "Built on the farm from poles" },
    basket: { title: "Fodder baskets", size: "Woven, about 0.5 m high", alt: "A woven basket of green fodder.",
      note: "The field’s residues and the cut fodder come back to the herd in these.", where: "Not sourced yet: woven locally" },
  },
  // the docs tables (docs-sections.tsx)
  need: {
    drawing: "yard's water drawing",
    lead: (lo: string, hi: string, herd: number, peak: string, tank: string, d0: number, d1: number) =>
      `About ${lo} to ${hi} litres a day for the ${herd} goats and sheep, the dogs, the cats and the doves, and up to about ${peak} when the does and the ewes are in milk in the dry season. A full ${tank} L tank holds ${d0} to ${d1} days of it if the farm’s line stops.`,
    animals: "Animals", head: "Head", perHead: "L a head a day", perDay: "L a day", basis: "Basis",
    to: (a: string | number, b: string | number) => `${a} to ${b}`,
    rows: { Goats: "Goats", Sheep: "Sheep", "Guard dogs": "Guard dogs" } as Record<string, string>,
    bases: {
      Goats: "[V LVS-27]: 2 to 3 times dry-matter intake at maintenance", Sheep: "[A AS-29]: as goats", "Guard dogs": "[A AS-29]",
    } as Record<string, string>,
    small: "Cats and doves",
    smallHead: (n: number) => `${n} + doves`,
    under: (n: number) => `under ${n}`,
    yard: "The yard",
    sum: (peak: string) => `[E] the sum; up to ${peak} in milk`,
    method: "Method [E]: head counts from the yard’s design (D-030) times litres a head a day. A goat drinks 2 to 3 times its dry-matter intake at maintenance, about 1.5 to 3.3 L a day, and 4 to 5 times when lactating (LVS-27), so a doe or a ewe in milk is taken at 5/3 of the top figure. The sheep, the dogs, the cats and the doves are assumptions (AS-29) until the vet checks them. Heat and the dry season push every figure to the top of its range; the feed, not the water, caps the herd at about 20 does on 5 ha.",
  },
  // livestock.json's water points, by id
  json: {
    points: {} as Record<string, Partial<Point>>,
  },
}

const rw: typeof en = {
  meta: {
    title: "Amatungo · Ifamu",
    description: "Ihene n'intama mu rugo rumwe rw'umudugudu iruhande rw'ikiraro gisakajwe ibyatsi, hamwe n'injangwe eshatu, inuma ziguruka n'imbwa ebyiri zirinda, igice cy'uruziga rw'ifamu kuva ku murima kugeza ku ifumbire, kuri Digital Farm hafi ya Kigali.",
  },
  hero: {
    title: "Ihene n'intama mu rwuri rugari",
    alt: "Urugo rw'amatungo ku musozi wo mu Rwanda munsi y'ikirere cy'ibicu byoroheje: ikiraro gisakajwe ibyatsi byinshi n'intama ebyiri imbere, ihene n'intama zifite imitwe y'umukara ku byatsi byumye inyuma y'uruzitiro rw'imbaho ziboshywe n'imigozi, akazu k'inuma karimo inuma z'umweru n'inzu y'injangwe ku nkingi ibumoso, ikigega cy'amazi n'utuzu tubiri tw'imbwa iburyo, ibiseke biboshye hafi y'irembo, insina n'inturusu bizengurutse urugo, n'imisozi y'amaterasi itoshye inyuma.",
  },
  plan: {
    title: "Igishushanyo: uruzitiro rumwe rwa mm 17,200 kuri 9,600, uruzitiro rw'inkingi n'imbaho ruzengurutse rufite irembo rimwe rijya mu rwuri. Imbere, ikiraro cy'amatungo cyakuwe ku ifoto ya nyir'ifamu, mm 4,400 kuri 3,000 munsi y'igisenge cy'ibyatsi gifite impande ebyiri ku musingi muto w'amabuye: inyuma n'impera y'iburasirazuba bikingishijwe imbaho, impera y'iburengerazuba ifunguye inyuma y'urubaho rumwe, imbere hafunguye hagati y'inkingi ebyiri z'inguni zifashwe n'ibiti; imbere harimo ikirundo cy'ibyatsi byumye, ameza y'imbaho ariho igiseke hejuru y'isanduku ifite umupfundikizo, n'udusanduku tubiri tw'imyunyu. Urugo rw'umudugudu rw'amatungo, injangwe, inuma n'abashyitsi, rufite imivure, amabuye yo kurira, igiti gitanga igicucu, intebe y'igiti, akazu k'inuma n'inzu y'injangwe ku nkingi; iruhande rw'ikiraro ikigega cy'amazi ku gitereko cy'amabuye n'indobo eshatu, ibiseke by'ubwatsi n'ibyumba bitatu by'ifumbire, n'urugo rw'imbwa zirinda n'utuzu twazo tubiri mu nguni y'inyuma y'iburasirazuba; insina n'ibihuru bizengurutse hanze n'uturima tubiri tw'imboga imbere.",
    labels: { cats: "INJANGWE", shed: "IKIRARO", tank: "IKIGEGA", compost: "IFUMBIRE", dogs: "IMBWA", yard: "URUGO RW'UMUDUGUDU", doves: "INUMA", bench: "INTEBE", paddock: "KU RWURI · ABASHYITSI", vegetables: "IMBOGA" },
  },
  model: {
    lineAlt: "Igishushanyo cy'imirongo cy'urugo rw'amatungo kirebwa uturutse mu rwuri: uruzitiro rumwe rw'inkingi n'imbaho zigoramye ruzengurutse rufite irembo ry'inzugi ebyiri, insina inyuma; ikiraro nk'uko kiri ku ifoto, igisenge cyacyo cy'ibyatsi gihanamye hejuru y'inyuma n'uruhande bikingishijwe imbaho n'inkingi ebyiri z'inguni zifashwe n'ibiti, intama ebyiri imbere iruhande rw'ikirundo cy'ibyatsi byumye n'ameza; ihene n'intama mu rugo, ihene imwe ku ibuye, imivure, intebe, akazu k'inuma n'inzu y'injangwe ku nkingi, injangwe eshatu, igiti kirinzwe; ikigega ku gitereko cy'amabuye n'indobo eshatu, ibiseke, ibyumba by'ifumbire n'urugo rw'imbwa rufite utuzu tubiri; uturima tubiri tw'imboga imbere.",
    realAlt: "Ishusho imwe yakozwe nk'ifoto: insina inyuma y'uruzitiro rw'imbaho nini zigoramye ziboshywe n'imigozi; ikiraro cy'imbaho zijimye zishaje n'inkingi nini zifite ibishishwa munsi y'ibyatsi byinshi, intama ebyiri z'umweru ku byatsi byumye by'umuhondo; ihene n'intama zifite imitwe y'umukara ku butaka butukura-bwijimye no ku byatsi byumye, injangwe y'umuhondo ku nzu yayo, inuma ku kazu kazo, ikigega cy'ibara ry'ubutaka ku gitereko cy'amabuye n'indobo eshatu z'umukara, ibiseke by'ubwatsi bubisi, ibyumba by'ifumbire, imbwa y'ikigina n'iy'umukara mu rugo rwazo, n'uturima tubiri tw'amashu hanze imbere.",
  },
  shed: {
    title: "Ikiraro",
    baseAlt: "Umusingi w'ikiraro urebwa hasi uturutse imbere: ubutaka bwasonzwe buzengurutswe n'amabuye, ku rupapuro rwera.",
    builds: [
      "Inkingi enye z'inguni zifite ibishishwa, hanyuma umukomba w'imbere, umukomba w'inyuma, imikomba ihuza n'ibiti bifata.",
      "Imbaho nini zishinzwe zihagaze inyuma no ku mpera y'iburasirazuba.",
      "Imirunga y'igisenge, hanyuma ibyatsi bisakarwa uhereye ku nkombe ujya hejuru.",
      "Ibyatsi byumye byinshi hasi, hanyuma ikirundo cy'ibyatsi, ameza y'ibiryo n'udusanduku tw'imyunyu.",
    ],
    stages: (s) => [
      { title: "Umusingi", text: `m ${s.l} × ${s.d} z'ubutaka bwasonzwe ku musingi wa cm ${s.plinth} z'uburebure, buzengurutswe n'amabuye, ku buryo imvura itemba amatungo akaryama ahumutse. Nibura m 200 uvuye ku murongo w'imyuzure y'ikiyaga (LOC-02).` },
      { title: "Intambwe 1 · Ikadiri", text: "Inkingi enye nini z'inturusu zifite ibishishwa, umukomba ku ruhande rw'imbere rufunguye n'undi inyuma, umukomba uhuza kuri buri mpera n'igiti gifata kuri buri nkingi y'imbere." },
      { title: "Intambwe 2 · Imbaho", text: "Imbaho zijimye zishaje zishinzwe zihagaze inyuma no ku mpera y'iburasirazuba, zikumira umuyaga; impera y'iburengerazuba iguma ifunguye inyuma y'urubaho rumwe, naho imbere hagafunguka." },
      { title: "Intambwe 3 · Ibyatsi by'igisenge", text: `Igisenge cy'ibyatsi gihanamye cyane, inkombe zacyo kuri m ${s.eaves}, umugongo kuri m ${s.ridge}, kirenga m ${s.over} ku buryo imivure iba mu gicucu cyacyo.` },
      { title: "Intambwe 4 · Ibyatsi byumye n'ibikoresho", text: `Ibyatsi byumye byinshi hejuru y'ubutaka, m² ${s.perHead} kuri buri tungo ku matungo ${s.head}; ikirundo cy'ibyatsi, ameza y'ibiryo hejuru y'isanduku ifungwa, n'udusanduku tw'imyunyu, utw'ihene hejuru n'utw'intama hasi.` },
    ],
  },
  sections: { animals: "Amatungo", yard: "Urugo", water: "Amazi", manure: "Ifumbire" },
  water: {
    figureAlt: "Igishushanyo cy'imirongo cy'ikiraro, ikigega n'imivure kirebwa uturutse mu rwuri: umuyoboro w'ifamu mu bururu bwijimye uzamuka ku ruhande rw'ikigega ugera kuri float valve munsi y'umupfundikizo wacyo, valve isohora n'irobine y'indobo mu icunga ku muyoboro umanuka ku gitereko cy'amabuye cy'ikigega, umuyoboro w'urugo mu bururu uca ku mpera y'iburasirazuba y'ikiraro no imbere y'inkombe z'igisenge, n'umuyoboro uzamuka w'ubururu bworoshye ugana kuri buri muvure.",
    note: (link) => <>
      Umuyoboro w&rsquo;ifamu wuzuza ikigega unyuze muri float valve; uhereye ku gice cyo hasi cy&rsquo;ikigega, umuyoboro umwe
      ushyinguye uha amazi float valve iri muri buri muvure, ku buryo imivure ihora yuzuye nta muntu wikoreye amazi. Buri
      kimenyetso gifungura umurongo wacyo mu {link("/docs/livestock/water#points", "mbonerahamwe y'ahantu")}. Hanze
      y&rsquo;igishushanyo: isahani y&rsquo;imbwa (B), yuzuzwa n&rsquo;indobo ivomwa kuri robine. Aho umuyoboro w&rsquo;ifamu uzaturuka
      bitegereje gahunda y&rsquo;amazi y&rsquo;ifamu n&rsquo;igerageza rya borehole, kandi amazi y&rsquo;amatungo ku ifamu asaba uruhushya
      rwo gukoresha amazi (LOC-04).
    </>,
    caption: "Byakozwe uhereye ku gishushanyo mbonera: umuyoboro w'urugo ushushanyije hejuru y'ubutaka aho unyura ushyinguye",
    realAlt: "Ishusho imwe yakozwe nk'ifoto: ikiraro gisakajwe ibyatsi n'intama ku byatsi byumye, ikigega cy'ibara ry'ubutaka ku gitereko cy'amabuye n'itiyo y'umukara izamuka ku ruhande rwacyo, valve y'umuringa ifite ikiganza gitukura na robine ku muyoboro uzamuka, umuyoboro w'urugo w'umukara uca iruhande rw'indobo no imbere y'inkombe z'igisenge ugana ku mivure ibiri y'imbaho yuzuye amazi, ihene n'intama mu rugo.",
    diagram: {
      label: (tank, m) => `Igishushanyo cy'amazi: umuyoboro w'amazi w'ifamu wuzuza ikigega cya litiro ${tank} kiri iruhande rw'ikiraro unyuze muri float valve; uhereye kuri valve isohora iri hasi ku kigega, umuyoboro wa mm 20, hafi m ${m}, unyura ushyinguye ugana kuri float valve iri muri buri muvure muri ibiri, kandi robine y'indobo yuzuza indobo z'isahani y'imbwa`,
      key: { farm: "Umuyoboro w'ifamu", supply: "Umuyoboro w'urugo mm 20", riser: "Uzamuka ujya ku muvure", valve: "Valve cyangwa robine" },
      farm: { title: "Umuyoboro w'ifamu", sub: "uva ku mazi y'ifamu" },
      underFence: "munsi y'uruzitiro rw'inyuma",
      float: "float valve",
      tank: (tank) => `Ikigega L ${tank}`,
      tankSub: "T · ku gitereko cy'amabuye cya m 1.2",
      buckets: { title: "Indobo", sub: "B · isahani y'imbwa, injangwe" },
      yard: (m) => `PE ya mm 20 · hafi m ${m}, ushyinguye cm 30`,
      west: "Umuvure w'iburengerazuba", east: "Umuvure w'iburasirazuba",
      trough: (id) => `${id} · float valve, m 1.0 × 0.35`,
      notes: (lo, hi, peak, d0, d1) => [
        `Urugo runywa hafi L ${lo} kugeza ${hi} ku munsi, kugeza hafi L ${peak} iyo ihene n'intama z'ingore zonsa mu gihe cy'izuba [E] · ikigega cyuzuye kimara hafi iminsi ${d0} kugeza ${d1} iyo umuyoboro w'ifamu uhagaze`,
        "Ikigega kiri hejuru y'imivure hafi m 1.2 gusa, bityo float zayo ni izikora ku muvuduko muke · ingano n'inzira ni ibyateganyijwe",
      ],
    },
  },
  manure: {
    label: (n) => `Igishushanyo cy'ifumbire: isaso n'amase bivuye mu kiraro no mu rugo bijya mu cyumba cya mbere mu byumba ${n} by'ifumbire, bigahindurirwa mu cya kabiri no mu cya gatatu, maze ifumbire yarangiye ikajya mu turima tw'imboga no mu byobo by'ibiti; ibisigazwa by'uturima n'ubwatsi bwahiriwe bigaruka ku matungo mu biseke`,
    shed: { title: "Ikiraro n'urugo", sub: "isaso n'amase, bivanwamo buri munsi" },
    bay1: { title: "Icyumba 1 · bishya", sub: (b) => `m ${b} × ${b}, impande z'inkingi` },
    bay2: { title: "Icyumba 2 · guhindura", sub: "birashyushye: 55 °C mu minsi 3, bihindurwa" },
    bay3: { title: "Icyumba 3 · byarangiye", sub: "byijimye, bimenagurika, bikonje" },
    beds: { title: "Uturima n'ibyobo by'ibiti", sub: "umurima n'umurongo w'ibiti by'imbuto" },
    back: "ibisigazwa by'uturima n'ubwatsi bwahiriwe bigaruka ku matungo mu biseke",
    notes: [
      "Nta kintu kijya ku karima k'ikiribwa cyose kitarabanza gukorwamo ifumbire ishyushye · ibyumba bifungwa n'urubaho rukurwaho, ku buryo ihene zitinjira",
      "Nta mase arapimwa, bityo nta toni zigaragazwa · aho ifumbire ikorerwa, nk'ikiraro, hari nibura m 200 uvuye ku kiyaga",
    ],
  },
  docs: [
    { href: "/docs/livestock", title: "Gahunda y'imirimo", text: "Ibigenzurwa mbere y'itungo iryo ari ryo ryose, ikiraro n'urugo, kwita ku matungo buri munsi n'amategeko, ku ihene 6 n'intama 4." },
    { href: "/docs/livestock/materials", title: "Ibikoresho", text: "Amatungo, ibikoresho by'urugo, amazi n'uruziga rw'ifumbire, buri kimwe n'ingano yacyo n'aho kiva." },
    { href: "/docs/livestock/water", title: "Amazi", text: "Ikigega, umuyoboro ushyinguye n'imivure ifite float, ibyo urugo runywa ku munsi, na buri hantu." },
  ],
  rails: {
    head: "Umubare", whereFrom: "Aho bituruka", cost: "Igiciro",
    notSourced: "Ntibiraboneka aho kugurwa", notBudgeted: "Ntibiri mu ngengo y'imari",
    goat: { title: "Ihene", head: (n) => `Ihene za gakondo ${n}`, from: "Amafamu mato menshi afite inyandiko z'ubuzima bw'amatungo, hanyuma akato k'umuganga w'amatungo",
      cost: "Hafi RWF 40,000 ku ihene iringaniye i Bugesera (2022, LVS-01)", alt: "Ihene ya gakondo y'ikigina, ihagaze.",
      note: "Zirisha amashami: ubwatsi bwumye buguma mu bitereko, hejuru y'ubutaka, kugira ngo zitandura inzoka. Agasanduku k'imyunyu yazo kamanikwa hejuru, aho intama zitakageraho." },
    sheep: { title: "Intama", head: (n) => `Intama ${n} z'umurizo munini`, from: "Ntiziraboneka aho kugurwa: nta mworozi ufite intama wabonetse",
      cost: "Hafi RWF 100,000 ku ntama ya kg 30–35 i Mukamira (2024, LVS-56)", alt: "Intama y'umweru y'umurizo munini ifite isura y'umukara.",
      note: "Copper iri mu myunyu y'ihene ni uburozi ku ntama (LVS-26), bityo iyazo ishyirwa hasi kandi ukwayo. Zombi zirwara inzoka zimwe (LVS-46)." },
    dog: { title: "Imbwa zirinda", head: (n) => `${n}, mu rugo rwazo`, alt: "Imbwa irinda y'ikigina.",
      note: "Zirinda ubujura nijoro (LVS-01). Zikingiwe ibisazi kandi zinyuzwa iruhande rw'amatungo mato ziziritse." },
    cat: { title: "Injangwe", head: (n) => `${n}, zakonwe`, alt: "Injangwe y'ivu.",
      note: "Inshuti z'ifamu ku bashyitsi. Ubwatsi bwumye n'ibiryo bihora bipfundikiye: amabyi y'injangwe ashobora gutera toxoplasmose, ituma intama n'ihene bihaka biramburura (bizasuzumwa n'umuganga w'amatungo)." },
    doves: { title: "Inuma", head: "Ziguruka uko zishaka; umubare ntiwemejwe", alt: "Akazu k'inuma ku nkingi ndende, inuma ku rubaraza rwako.",
      note: (s, h) => `Akazu k'inuma ka m ${s} kuri ${s} ku nkingi ya m ${h} mu rugo.` },
    table: { title: "Ameza y'ibiryo n'isanduku", size: (a, b, h, c, d) => `Ameza m ${a} × ${b}, hejuru kuri m ${h}; isanduku m ${c} × ${d}, ifite umupfundikizo`,
      alt: "Ameza y'imbaho ariho igiseke cy'ubwatsi bwumye hejuru y'isanduku ifite umupfundikizo.", note: "Ubwatsi bwumye mu giseke hejuru y'ubutaka, ibiryo mu isanduku ifungwa." },
    minerals: { title: "Udusanduku tw'imyunyu × 2", size: (a, b, g, s) => `m ${a} × ${b} buri kamwe; ak'ihene kuri m ${g}, ak'intama kuri m ${s}`,
      alt: "Udusanduku tubiri duto tw'imyunyu ku mbaho z'inyuma z'ikiraro, kamwe hejuru akandi hasi.", note: "Imyunyu y'ihene hejuru, iy'intama hasi (LVS-26).",
      where: "Bikorerwa ku ifamu; imyunyu ntiraboneka aho kugurwa", cost: "Imyunyu RWF 2,500 ku itungo ku mwaka (iby'agateganyo by'icyitegererezo)" },
    bale: { title: "Ikirundo cy'ibyatsi byumye", alt: "Ikirundo cy'ibyatsi byumye.", note: "Isaso n'aho amatungo yicara; isaso yakoreshejwe ijya mu ifumbire.", where: "Ntibiraboneka aho kugurwa: sitasiyo za RAB zigurisha ubwatsi bwumye buke (LVS-50)" },
    kennel: { title: (n) => `Utuzu tw'imbwa × ${n}`, size: (a, b) => `m ${a} × ${b}, tuzamuye ku biti, igisenge gihanamye`,
      alt: "Akazu k'imbwa k'imbaho kazamuye gafite igisenge gihanamye n'umuryango w'uruziga.", note: (a, b) => `Mu rugo rw'imbwa, m ${a} × ${b}, ruzitiye, mu nguni y'inyuma y'iburasirazuba.` },
    cathouse: { title: "Inzu y'injangwe", size: (s, h) => `m ${s} × ${s} ku nkingi ya m ${h}`, alt: "Inzu nto y'imbaho ifite urubaraza ku nkingi.",
      note: "Aho imbwa zitagera, hafi y'uruzitiro." },
    boards: "Bikorerwa ku ifamu mu mbaho",
    tank: { title: "Ikigega", size: (l, d, h, stand) => `L ${l}, Ø m ${d}, uburebure bwa m ${h}, ku gitereko cy'amabuye cya m ${stand}`,
      alt: "Ikigega cy'uruziga cy'ibara ry'ubutaka ku gitereko cy'amabuye cya mpande enye.", note: "T · cyuzuzwa n'umuyoboro w'ifamu, ntikigera cyuzuzwa n'ibyatsi by'igisenge: ibisenge by'ibyatsi ntibitanga amazi y'imvura asukuye." },
    float: { title: "Float valve × 3", size: "Santimetero ½, zikora ku muvuduko muke", alt: "Float valve y'umuringa ifite ukuboko kwayo na float y'umweru.",
      note: "FV ku kigega, W1 na W2 mu mivure: ikigega kiri hejuru hafi m 1.2 gusa, bityo float y'umuyoboro rusange yafunguka bigoranye." },
    pipe: { title: "Umuyoboro w'urugo", size: (m) => `Hafi m ${m} za PE ya mm 20, ushyinguye cm 30`, alt: "Umuzingo w'itiyo y'umukara ya PE ya mm 20.",
      note: "S1 · uva hasi ku kigega uca ku mpera y'iburasirazuba y'ikiraro no imbere y'inkombe z'igisenge, umuyoboro uzamuka ugana kuri buri muvure." },
    valve: { title: "Valve isohora", size: "Valve y'umupira ya mm 20", alt: "Valve y'umupira y'umuringa ifite ikiganza gitukura ku itiyo y'umukara.",
      note: "V1 · ifunga umuyoboro w'urugo mu gihe cyo gusana bitabaye ngombwa kuvoma ikigega." },
    tap: { title: "Robine y'indobo", size: "Robine ya santimetero ½", alt: "Robine y'umuringa ku rubaho.", note: "TP · yuzuza indobo z'isahani y'imbwa n'iz'injangwe." },
    trough: { title: (n) => `Imivure × ${n}`, size: (a, d, h) => `m ${a} × ${d}, uburebure bwa m ${h}`,
      alt: "Umuvure w'imbaho ku maguru abiri, wuzuye amazi.", note: "W1 na W2 · mu gicucu cy'inkombe z'igisenge; yogejwe buri cyumweru." },
    buckets: { title: (n) => `Indobo × ${n}`, size: "Iz'umukara, iruhande rw'ikigega", alt: "Indobo eshatu z'umukara.", note: "Iz'amazi n'ibiryo, iruhande rw'ikigega." },
    bowl: { title: "Isahani y'imbwa", size: (d) => `Ø m ${d}`, alt: "Isahani nto y'uruziga.", note: "B · mu rugo rw'imbwa, yuzuzwa kabiri ku munsi kuri TP." },
    compost: { title: (n) => `Ibyumba by'ifumbire × ${n}`, size: (b) => `m ${b} × ${b} buri cyumba, impande z'inkingi, urubaho rw'imbere rukurwaho`,
      alt: "Ibyumba bitatu by'inkingi ku murongo: isaso nshya, ikirundo gihindurwa n'ifumbire yarangiye.",
      note: "Iruhande rw'ikigega, ku nzira ica ku mpera y'iburasirazuba y'ikiraro. Ibishya mu cya mbere, ibihindurwa mu cya kabiri, ibyarangiye mu cya gatatu.",
      where: "Bikorerwa ku ifamu mu nkingi" },
    basket: { title: "Ibiseke by'ubwatsi", size: "Biboshye, uburebure bwa hafi m 0.5", alt: "Igiseke kiboshye cy'ubwatsi bubisi.",
      note: "Ibisigazwa by'umurima n'ubwatsi bwahiriwe bigaruka ku matungo muri ibi biseke.", where: "Ntibiraboneka aho kugurwa: biboherwa hano" },
  },
  need: {
    drawing: "gishushanyo cy'amazi cy'urugo",
    lead: (lo, hi, herd, peak, tank, d0, d1) =>
      `Hafi litiro ${lo} kugeza ${hi} ku munsi ku ihene n'intama ${herd}, imbwa, injangwe n'inuma, kandi kugeza hafi ${peak} iyo ihene n'intama z'ingore zonsa mu gihe cy'izuba. Ikigega cyuzuye cya L ${tank} kibika amazi y'iminsi ${d0} kugeza ${d1} iyo umuyoboro w'ifamu uhagaze.`,
    animals: "Amatungo", head: "Umubare", perHead: "L ku itungo ku munsi", perDay: "L ku munsi", basis: "Ishingiro",
    to: (a, b) => `${a} kugeza ${b}`,
    rows: { Goats: "Ihene", Sheep: "Intama", "Guard dogs": "Imbwa zirinda" },
    bases: {
      Goats: "[V LVS-27]: incuro 2 kugeza 3 z'ibiryo byumye irya iyo itonsa", Sheep: "[A AS-29]: nk'ihene", "Guard dogs": "[A AS-29]",
    },
    small: "Injangwe n'inuma",
    smallHead: (n) => `${n} + inuma`,
    under: (n) => `munsi ya ${n}`,
    yard: "Urugo",
    sum: (peak) => `[E] igiteranyo; kugeza ${peak} iyo zonsa`,
    method: "Uburyo [E]: umubare w'amatungo ukurikije igishushanyo cy'urugo (D-030) wikubye litiro buri tungo rinywa ku munsi. Ihene inywa incuro 2 kugeza 3 z'ibiryo byumye irya iyo itonsa, hafi L 1.5 kugeza 3.3 ku munsi, n'incuro 4 kugeza 5 iyo yonsa (LVS-27), bityo ihene cyangwa intama yonsa ibarirwa kuri 5/3 by'umubare wo hejuru. Intama, imbwa, injangwe n'inuma ni ibyakekwa (AS-29) kugeza umuganga w'amatungo abisuzumye. Ubushyuhe n'igihe cy'izuba bizamura buri mubare ukagera ku wo hejuru; ibiryo, si amazi, ni byo bigena ko amatungo atarenga ihene z'ingore hafi 20 kuri ha 5.",
  },
  json: {
    points: {
      F1: { what: "Umuyoboro w'amazi w'ifamu", where: "Munsi y'uruzitiro rw'inyuma ugana ku kigega, ukurikije gahunda y'amazi y'ifamu", size: "Ingano igenwa na gahunda y'amazi y'ifamu" },
      FV: { what: "Float valve", where: "Ku mupfundikizo w'ikigega, ifunga umuyoboro w'ifamu iyo ikigega cyuzuye", size: "Ihuye n'umuyoboro w'ifamu" },
      T: { what: "Ikigega", where: "Iruhande rw'impera y'iburasirazuba y'ikiraro, ku gitereko cy'amabuye cya m 1.2", size: "L 1,000" },
      V1: { what: "Valve isohora", where: "Hasi ku kigega, ifunga umuyoboro w'urugo mu gihe cyo gusana", size: "Valve y'umupira ya mm 20" },
      TP: { what: "Robine y'indobo", where: "Ku muyoboro umanuka ku gitereko cy'ikigega", size: "Robine ya santimetero ½" },
      S1: { what: "Umuyoboro w'urugo", where: "Ushyinguye cm 30, uca ku mpera y'iburasirazuba y'ikiraro no imbere y'inkombe z'igisenge", size: "PE ya mm 20" },
      W1: { what: "Umuvure w'iburengerazuba", where: "Munsi y'igice cy'iburengerazuba cy'inkombe z'igisenge", size: "m 1.0 × 0.35, float valve ikora ku muvuduko muke" },
      W2: { what: "Umuvure w'iburasirazuba", where: "Munsi y'igice cy'iburasirazuba cy'inkombe z'igisenge", size: "m 1.0 × 0.35, float valve ikora ku muvuduko muke" },
      B: { what: "Isahani y'imbwa", where: "Mu rugo rw'imbwa, yuzuzwa n'indobo ivomwa kuri TP", size: "Yuzuzwa kabiri ku munsi" },
    },
  },
}

export const words: Words<typeof en> = { en, rw }
