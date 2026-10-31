import type { Words } from "@/components/internationalization/words"

// Every word on the homepage (D-017, D-018, D-058): the English, then its Kinyarwanda, a machine draft until a native
// speaker reviews it. The voice is study/brand/brand.md §6 and §12: plain and specific, future tense for anything
// planned, no superlatives. compound.json and assets.ts keep their English for the render scripts; the Kinyarwanda of
// their labels and alt text is laid over them by id (`plan.units`, `assets`, `clips`).

// The index under the 3D: each place's design page and its docs, which open on its execution plan (D-059), and the
// docs pages printed in English and Kinyarwanda. The hrefs live in references.tsx; these are the names.
type LinkLabels = { page: string; docs: string; package: string; drawing: string; english: string; kinyarwanda: string; pdf: string; pdfRw: string }
type AltOverlay = Record<string, { alt?: string; today?: string }>

const en = {
  meta: {
    title: "Digital Farm · Gashora, Rwanda",
    description:
      "A working farm above a lake in Gashora, an hour from Kigali, where seven containers will become guest rooms, studios, a bar and a place to learn: the plan, and the site as it stands.",
  },
  skip: "Skip to the plan",
  captions: {
    today: "Today · 2026-10-25",
  },
  hero: {
    // Two lines, as the founder set them.
    headline: ["State of", "comfort"],
    alt: "As planned (a concept image, not a photograph): the lawn above the lake under tall pines and a palm, the far shore wooded in late light",
    watch: "Watch film",
    closeFilm: "Close the film",
    scroll: "Scroll to explore",
  },
  // The plan as /en/studio shows its own: 2D, then 3D (D-022). Both are drawn from compound.json.
  plans: {
    title: "2D",
    label:
      "Plan of the compound, with the study room at the top and the gates at the bottom. At the top, the 40 ft study room on its deck, and beside it two buildings of their own: a 40 ft galley with a long worktop and two sinks, and a 20 ft public bathroom with two toilet rooms, two hand basins and a urinal. Below it, the row of three 20 ft containers on raised decks facing the courtyard: the farm office next to the bar, then two studios. Down the left, the bar and then the guest-room block in one line, their doors onto the veranda and the courtyard lawn: the stone fire pit with stools round it, a long timber table in front of the middle studio, and six small tents on a camping lawn between the guest rooms and the fire pit, ending at the fire. The study room's end is in line with the guest rooms. At the bottom, the inner gate, a rock road down to the green parking, and the outer gate beside the Digital Farm sign wall. On the lawn between the guest rooms and the parking, the volleyball court, 18 by 9 metres inside its 3 metre free zone, its long side across the plan and the net across its middle. To the left, past a break line, the land drawn close in one band from the study room to the first guest room: half of the vegetable field's two nearest blocks of raised beds behind their fence, turned to run west and cut there. At the cut an arrow links to the whole farm: the field, the nursery and the livestock. Through it all, the garden: big shade trees behind the study room and the galley, between the back row and the studios, beside the bar and the guest rooms, along the rock road and in a grove on the east lawn, and flower beds in the backyard, along each deck, by the guest rooms' windows, at both gates and behind the sign wall. Every name on the plan links to its page.",
    note: "Illustrative plan: containers drawn to size, layout not surveyed. The field is drawn close and cut at half; the farming page has all of it, with the nursery and the livestock.",
  },
  // The names drawn on the plan (compound-plan.tsx); a building's name by its compound.json id.
  plan: {
    units: {
      bar: "BAR",
      rooms: "GUEST ROOMS",
      office: "OFFICE",
      "studio-one": "STUDIO",
      "studio-two": "STUDIO",
      study: "STUDY ROOM",
      galley: "GALLEY",
      bath: "PUBLIC BATHROOM",
    } as Record<string, string>,
    camping: "CAMPING",
    volleyball: "VOLLEYBALL",
    field: (beds: number) => `VEGETABLE FIELD · ${beds} BEDS`,
    continued: "TO BE CONTINUED",
    fullFarm: "SEE THE FULL FARM",
    drawnClose: (m: number) => `DRAWN CLOSE · ON THE LAND THE FIELD IS ${m} M AWAY`,
    firePit: "FIRE PIT",
    courtyard: "COURTYARD",
    parking: "PARKING",
    sign: "DIGITAL FARM",
  },
  // Under the 3D: every page the plan links to, with its docs, and the printed pages (English and Kinyarwanda).
  references: {
    title: "Pages and guides",
    lead: "Every building and piece of land on the plan has its own page of drawings and its own docs: the execution plan, the materials and the services. Six docs pages are printed in English and Kinyarwanda.",
    links: {
      page: "Page",
      docs: "Docs",
      package: "Design package",
      drawing: "Drawing",
      english: "English",
      kinyarwanda: "Kinyarwanda",
      pdf: "PDF",
      pdfRw: "PDF (RW)",
    } satisfies LinkLabels,
    groups: {
      buildings: "Buildings",
      outside: "Outside",
      land: "Land",
      printed: "Printed",
      farm: "The farm",
    },
    rows: {
      studio: "Studio",
      "guest-room": "Guest room",
      office: "Office",
      "study-room": "Study room",
      galley: "Galley",
      "public-bathroom": "Public bathroom",
      bar: "Bar",
      camp: "Camping",
      parking: "Parking",
      volleyball: "Volleyball",
      "master-plan": "Master plan",
      farming: "Vegetable field",
      livestock: "Livestock",
      "print-studio": "Studio plan",
      "print-studio-electric": "Studio electric",
      "print-studio-plumbing": "Studio plumbing",
      "print-farming": "Field plan",
      "print-livestock": "Livestock plan",
      "print-farm-electric": "Farm electric",
      start: "Start here",
      "farm-plan": "The farm's plan",
      today: "The farm today",
      operations: "How it runs",
      film: "The film",
      "business-model": "Business model",
    },
  },
  model: {
    title: "3D",
    line: "Line drawing of the compound seen from the front, from high beyond the gates: the gate and the sign wall lettered DIGITAL FARM, the parking and the rock road up to the inner gate; inside, six small tents and the fire pit ringed with stools on the lawn, with the bar and the guest rooms on the left; beyond the long timber table, the office and two studios on raised decks, each studio under a flat roof that reaches over its deck, with a ladder at its end up to two loungers; at the back the study room, the galley and the public bathroom. Between the guest rooms and the parking, the volleyball court marked out on the lawn, its net between two posts. On the left, on its own piece of ground beside the study room, the land drawn close: rows of raised vegetable beds behind a post-and-wire fence, cut at half. Round it all, the garden: big rounded shade trees behind the back row, beside the containers, along the rock road and in a grove on the right, and low flower beds along the decks and at the gates.",
    real: "The same view rendered with materials and sunlight: corrugated containers in saffron yellow, oxide red and teal, timber decks with red pipe railings, the two studios after their hero render (dark steel roofs over their decks on slim black posts, glass sliders half open, a steel ladder up to timber loungers, a bistro table and a potted plant), the sign wall's DIGITAL FARM in warm LED letters, hexagonal canvas tents (one with a green fly), the stone fire pit with its concrete cap and log stools, a long timber table, timber gates braced in an X, grass parking and a road of granite setts. Below the guest rooms, white tape lines and a black net on the grass of the volleyball court; on the left, raised beds of dark soil green with crop rows behind posts and wire. Big green shade trees stand behind the back row, beside the containers, along the road and in a grove on the right, and flower beds in pink, yellow, white and purple edge the decks and the gates.",
    caption: "Rendered from the design model",
  },
  // assets.ts's words, by id, for the pictures the page still names (the share card's still); none in English.
  assets: {} as AltOverlay,
  clips: {} as AltOverlay,
}

const rw: typeof en = {
  meta: {
    title: "Digital Farm · Gashora, Rwanda",
    description:
      "Ifamu ikora iri hejuru y'ikiyaga i Gashora, isaha imwe uvuye i Kigali, aho amakontineri arindwi azahinduka ibyumba by'abashyitsi, sitidiyo, akabari n'ahantu ho kwigira: gahunda, n'uko ahantu hameze ubu.",
  },
  skip: "Simbuka ujye ku gishushanyo",
  captions: {
    today: "Uyu munsi · 2026-10-25",
  },
  hero: {
    headline: ["Ahantu", "ho gutuza"],
    alt: "Uko biteganyijwe (ishusho y'igitekerezo, si ifoto): ibyatsi biri hejuru y'ikiyaga munsi ya pinusi ndende n'umukindo, inkombe y'hakurya iriho ibiti mu rumuri rwa nimugoroba",
    watch: "Reba filime",
    closeFilm: "Funga filime",
    scroll: "Manuka urebe",
  },
  plans: {
    title: "2D",
    label:
      "Igishushanyo cy'urugo, icyumba cyo kwigiramo kiri hejuru n'amarembo ari hasi. Hejuru, icyumba cyo kwigiramo cya ft 40 ku rubaho rwacyo, n'iruhande rwacyo inyubako ebyiri zihagaze ukwazo: igikoni cya ft 40 gifite kawunta ndende n'amalavabo abiri, n'ubwiherero rusange bwa ft 20 bufite ibyumba bibiri by'ubwiherero, amalavabo abiri yo gukaraba intoki n'aho abagabo banyarira (urinal). Munsi yacyo, umurongo w'amakontineri atatu ya ft 20 ku mbaho zizamuye zireba urugo rwo hagati: ibiro by'ifamu iruhande rw'akabari, hanyuma sitidiyo ebyiri. Ku ruhande rw'ibumoso, akabari hanyuma inyubako y'ibyumba by'abashyitsi ku murongo umwe, inzugi zabyo zireba ibaraza n'ibyatsi by'urugo rwo hagati: iziko ry'amabuye rikikijwe n'intebe, ameza maremare y'imbaho imbere ya sitidiyo yo hagati, n'amahema mato atandatu ku byatsi byo gukambikamo hagati y'ibyumba by'abashyitsi n'iziko, arangirira ku muriro. Impera y'icyumba cyo kwigiramo iri ku murongo umwe n'ibyumba by'abashyitsi. Hasi, irembo ry'imbere, umuhanda w'amabuye umanuka ugana kuri parikingi y'ibyatsi, n'irembo ryo hanze iruhande rw'urukuta rwanditseho Digital Farm. Ku byatsi biri hagati y'ibyumba by'abashyitsi na parikingi, ikibuga cya volleyball cya metero 18 kuri 9 imbere y'umwanya wacyo w'ubwisanzure wa metero 3, uruhande rwacyo rurerure rutambitse ku gishushanyo n'urushundura hagati yacyo. Ibumoso, nyuma y'umurongo ugabanya, ubutaka bushushanyije bwegerejwe mu mukandara umwe kuva ku cyumba cyo kwigiramo kugeza ku cyumba cya mbere cy'abashyitsi: kimwe cya kabiri cy'amatsinda abiri y'uturima tuzamuye tw'umurima w'imboga twegereye kurusha utundi, inyuma y'uruzitiro rwatwo, duhindukiye tugana iburengerazuba kandi dukatiwe aho. Aho bikatiwe, umwambi werekeza ku ifamu yose: umurima, ubuhumbikiro n'ubworozi. Hose, ubusitani: ibiti binini by'igicucu inyuma y'icyumba cyo kwigiramo n'igikoni, hagati y'umurongo w'inyuma na sitidiyo, iruhande rw'akabari n'ibyumba by'abashyitsi, ku nkengero z'umuhanda w'amabuye no mu ishyamba rito ku byatsi by'iburasirazuba, n'uturima tw'indabo mu gikari, ku nkengero za buri rubaho, iruhande rw'amadirishya y'ibyumba by'abashyitsi, ku marembo yombi n'inyuma y'urukuta rw'izina. Buri zina riri ku gishushanyo rifungura paji yaryo.",
    note: "Igishushanyo cyo gusobanura: amakontineri ashushanyije ku ngano yayo nyayo, ariko imiterere ntirapimwa ku butaka. Umurima ushushanyije wegerejwe kandi ukatiwe hagati; paji y'ubuhinzi iwugaragaza wose, hamwe n'ubuhumbikiro n'ubworozi.",
  },
  plan: {
    units: {
      bar: "AKABARI",
      rooms: "IBYUMBA BY'ABASHYITSI",
      office: "IBIRO",
      "studio-one": "SITIDIYO",
      "studio-two": "SITIDIYO",
      study: "ICYUMBA CYO KWIGIRAMO",
      galley: "IGIKONI",
      bath: "UBWIHERERO RUSANGE",
    },
    camping: "AHO BAKAMBIKA",
    volleyball: "VOLLEYBALL",
    field: (beds) => `UMURIMA W'IMBOGA · UTURIMA ${beds}`,
    continued: "BIRAKOMEZA",
    fullFarm: "REBA IFAMU YOSE",
    drawnClose: (m) => `BYEGEREJWE · KU BUTAKA UMURIMA URI KURI M ${m}`,
    firePit: "IZIKO",
    courtyard: "URUGO RWO HAGATI",
    parking: "PARIKINGI",
    sign: "DIGITAL FARM",
  },
  references: {
    title: "Paji n'inyandiko",
    lead: "Buri nyubako na buri gice cy'ubutaka kiri ku gishushanyo gifite paji yacyo y'ibishushanyo n'inyandiko zacyo: gahunda y'imirimo, ibikoresho, amashanyarazi n'amazi. Paji esheshatu z'inyandiko zacapwe mu Cyongereza no mu Kinyarwanda.",
    links: {
      page: "Paji",
      docs: "Inyandiko",
      package: "Ipaki y'ibishushanyo",
      drawing: "Igishushanyo",
      english: "Icyongereza",
      kinyarwanda: "Ikinyarwanda",
      pdf: "PDF",
      pdfRw: "PDF (RW)",
    },
    groups: {
      buildings: "Inyubako",
      outside: "Hanze",
      land: "Ubutaka",
      printed: "Ibyacapwe",
      farm: "Ifamu",
    },
    rows: {
      studio: "Sitidiyo",
      "guest-room": "Icyumba cy'abashyitsi",
      office: "Ibiro",
      "study-room": "Icyumba cyo kwigiramo",
      galley: "Igikoni",
      "public-bathroom": "Ubwiherero rusange",
      bar: "Akabari",
      camp: "Aho bakambika",
      parking: "Parikingi",
      volleyball: "Volleyball",
      "master-plan": "Igishushanyo mbonera",
      farming: "Umurima w'imboga",
      livestock: "Ubworozi",
      "print-studio": "Gahunda ya sitidiyo",
      "print-studio-electric": "Amashanyarazi ya sitidiyo",
      "print-studio-plumbing": "Imiyoboro y'amazi ya sitidiyo",
      "print-farming": "Gahunda y'umurima",
      "print-livestock": "Gahunda y'ubworozi",
      "print-farm-electric": "Amashanyarazi y'ifamu",
      start: "Tangira hano",
      "farm-plan": "Gahunda y'ifamu",
      today: "Ifamu uyu munsi",
      operations: "Uko ikora",
      film: "Filime",
      "business-model": "Uburyo bw'ubucuruzi",
    },
  },
  model: {
    title: "3D",
    line: "Igishushanyo cy'imirongo cy'urugo kirebwa uturutse imbere, hejuru kure hakurya y'amarembo: irembo n'urukuta rwanditseho DIGITAL FARM, parikingi n'umuhanda w'amabuye uzamuka ugana ku irembo ry'imbere; imbere, amahema mato atandatu n'iziko rikikijwe n'intebe ku byatsi, akabari n'ibyumba by'abashyitsi ibumoso; hakurya y'ameza maremare y'imbaho, ibiro na sitidiyo ebyiri ku mbaho zizamuye, buri sitidiyo munsi y'igisenge kiringaniye kigera hejuru y'urubaho rwayo, ifite urwego ku mpera yayo ruzamuka ku ntebe ebyiri zo kuryamaho; inyuma, icyumba cyo kwigiramo, igikoni n'ubwiherero rusange. Hagati y'ibyumba by'abashyitsi na parikingi, ikibuga cya volleyball gishushanyije ku byatsi, urushundura rwacyo hagati y'inkingi ebyiri. Ibumoso, ku butaka bwabwo iruhande rw'icyumba cyo kwigiramo, ubutaka bwegerejwe: imirongo y'uturima tw'imboga tuzamuye inyuma y'uruzitiro rw'inkingi n'insinga, dukatiwe hagati. Hose, ubusitani: ibiti binini by'igicucu bifite amababi aburungushuye inyuma y'umurongo w'inyuma, iruhande rw'amakontineri, ku nkengero z'umuhanda w'amabuye no mu ishyamba rito iburyo, n'uturima tw'indabo tugufi ku nkengero z'imbaho no ku marembo.",
    real: "Ishusho imwe yakozwe nk'ifoto, ifite ibikoresho n'izuba: amakontineri y'amabati y'umuhondo nk'ikirungo cya safurani, umutuku nk'ingese n'ubururu bujya mu cyatsi, imbaho zifite uruzitiro rw'amatiyo atukura, sitidiyo ebyiri nk'uko zigaragara ku ishusho yazo nkuru (ibisenge by'icyuma byijimye hejuru y'imbaho zazo ku nkingi z'umukara zoroshye, inzugi z'ibirahure zinyerera zifunguye igice, urwego rw'icyuma ruzamuka ku ntebe z'imbaho zo kuryamaho, ameza mato n'igihingwa mu nkono), inyuguti DIGITAL FARM ku rukuta rw'izina zaka amatara ya LED ashyushye, amahema y'igitambaro afite impande esheshatu (rimwe rifite igitwikirizo cy'icyatsi), iziko ry'amabuye rifite umupfundikizo wa beto n'intebe z'ibiti, ameza maremare y'imbaho, amarembo y'imbaho afashwe mu buryo bwa X, parikingi y'ibyatsi n'umuhanda w'amabuye ya granite. Munsi y'ibyumba by'abashyitsi, imirongo y'umweru n'urushundura rw'umukara ku byatsi by'ikibuga cya volleyball; ibumoso, uturima tuzamuye tw'ubutaka bwirabura, dutoshye n'imirongo y'ibihingwa, inyuma y'inkingi n'insinga. Ibiti binini by'icyatsi by'igicucu bihagaze inyuma y'umurongo w'inyuma, iruhande rw'amakontineri, ku nkengero z'umuhanda no mu ishyamba rito iburyo, n'uturima tw'indabo z'iroza, umuhondo, umweru n'isine bikikije imbaho n'amarembo.",
    caption: "Byakozwe uhereye ku gishushanyo mbonera",
  },
  assets: {
    gate: { alt: "Aho binjirira ku zuba rirenga: inkingi z'irembo z'amabuye, amarembo y'ifamu afunguye n'urukuta rugufi rw'amabuye ruriho icyapa Digital Farm" },
    "gate-portrait": { alt: "Aho binjirira ku zuba rirenga: inkingi z'irembo z'amabuye, amarembo y'ifamu afunguye n'urukuta rugufi rw'amabuye ruriho icyapa Digital Farm" },
  },
  clips: {
    hero: { today: "Uyu munsi: ifamu iri hejuru y'ikiyaga, amahema ku byatsi n'umurongo w'ibiti ku nkombe" },
    "hero-portrait": { today: "Uyu munsi: ifamu iri hejuru y'ikiyaga, amahema ku byatsi n'umurongo w'ibiti ku nkombe" },
  },
}

export const words: Words<typeof en> = { en, rw }
