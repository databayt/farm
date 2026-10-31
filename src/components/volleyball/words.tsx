import type * as React from "react"

import type { RailCard } from "@/components/page/sections"
import type { Words } from "@/components/internationalization/words"

// Every word of the volleyball page, its drawings, its rails and its docs tables (D-058): the English, then its
// Kinyarwanda, a machine draft until a native speaker reviews it. volleyball.json keeps its English for the render
// scripts; `json` lays the Kinyarwanda over the few of its words the page shows. Numbers arrive formatted (data.ts m).
type L = (href: string, text: string) => React.ReactNode
type S = string | number
// the net's points, the kit and the net's parts take their sizes formatted, in millimetres unless named
export type PointValues = { out: S; fw: S; fd: S; h: S; pad: S; winch: S; nl: S; nd: S; men: S; women: S; al: S; above: S }
export type KitValues = { tape: S; tapeM: S; every: S; benches: S; bl: S; bd: S; bh: S; across: S; eave: S; top: S; sl: S; sd: S; sh: S }
export type NetValues = { men: S; women: S; fw: S; fd: S; h: S; d: S; out: S; pad: S; winch: S; nl: S; nd: S; mesh: S; top: S; foot: S; al: S; ad: S; above: S }
type Row = { what: string; where: string; size: string }

const en = {
  meta: {
    title: "Volleyball · Farm",
    description: "A full-size volleyball court on the lawn, with benches in the shade, at the Digital Farm near Kigali.",
  },
  hero: {
    title: "Volleyball on the lawn until sunset",
    alt: "A grass volleyball court on a lakeside lawn at sunset: white lines on short green grass, a net with a white top band and red-and-white antennae between two dark-green padded posts, a white ball on the grass by the net; beyond it two timber benches under thatched umbrellas and a timber chest, young trees, and the lake shining under low hills.",
  },
  plan: {
    title: "Plan: a court 18 by 9 m inside a 3 m free zone, 24 by 15 m in all, its lines 50 mm wide inside the court; the centre line under the net, an attack line 3 m each side of it marking the front zones and run on past the side lines in short dashes, and the service zones behind the end lines; the net's posts 1 m outside the side lines with an antenna over each side line; beyond the far free zone two benches under thatched umbrellas and a ball store. Over it a match at the serve: six players a side in rotation order, the server in the left service zone, the ball's flight across the net to the seam between two receivers, the 1st referee on a stand at the near post and the 2nd by the far post.",
    labels: {
      frontZone: "FRONT ZONE", backZone: "BACK ZONE", service: "SERVICE", zone: "ZONE", freeZone: "FREE ZONE",
      net: (men: string, women: string) => `NET ${men} MEN · ${women} WOMEN`,
      antenna: "ANTENNA", post: "POST", referee1: "1ST REFEREE, ON A STAND", referee2: "2ND REFEREE", server: "SERVER",
      serving: "SERVING", receiving: "RECEIVING", bench: "BENCH", shade: "SHADE", ballStore: "BALL STORE",
      foot1: "LINES 50 mm, INSIDE THE COURT · POSTS 1,000 OUTSIDE THE SIDE LINES · TOWARD THE OPEN LAWN",
      foot2: "ROTATION AT THE SERVE: 4 3 2 AT THE NET, 5 6 1 BEHIND · PLAYERS LARGER THAN LIFE",
    },
  },
  model: {
    lineAlt: "Line drawing of the court from the open lawn: the free zone's edge, the side and end lines, the centre line and the two attack lines, the net's cords between its two posts with an antenna over each side line, a ball by the net, and beyond the far free zone two benches under thatched umbrellas and the ball store.",
    realAlt: "The same view rendered: grass mown short in light and dark stripes inside the longer lawn, white tape lines, a black net with white bands on dark green padded posts, red and white antennae, a white ball on the grass, timber benches and a timber chest, and two thatched umbrellas casting their shadows.",
  },
  build: {
    title: "Court",
    baseAlt: "The lawn where the court goes, from straight above: longer grass, worn bare in patches where guests already play.",
    builds: [
      "The playing area levelled with sandy topsoil, then the two post footings cast.",
      "The grass grown back and mown short in passes.",
      "The lines of white tape pinned down.",
      "The posts dropped into their sleeves and the net hung.",
    ],
    stages: {
      lawn: { title: "The lawn as it is", text: (fl: S, fw: S, clear: S) => `Where guests already play round a net. The ${fl} × ${fw} m it takes is pegged out, the trees kept 4 m off it and nothing over it below ${clear} m.` },
      level: { title: "Step 1 · Level and footings", text: (topdress: S, fall: S, w: S, depth: S) => `The bumps cut and the hollows filled with about ${topdress} mm of sandy topsoil, rolled to one plane falling no more than ${fall} mm a metre; two footings ${w} mm square and ${depth} mm deep cast with their sleeves.` },
      grass: { title: "Step 2 · Grass", text: (settle: string) => `The bare patches seeded and the whole mown short in passes, the lawn round it left longer: ${settle}.` },
      lines: { title: "Step 3 · Lines", text: (tape: S, l: S, w: S, every: S, attack: S) => `${tape} mm white tape inside the ${l} × ${w} m, pinned every ${every} m and at each corner and crossing; the centre line and an attack line ${attack} m each side.` },
      net: { title: "Step 4 · Net", text: (men: S, women: S) => `The posts dropped into their sleeves, the net hung at ${men} mm for men or ${women} mm for women, an antenna over each side line.` },
    },
  },
  kit: "Kit",
  net: {
    title: "Net and posts",
    figureAlt: "Line drawing of the net close up from the open lawn: the two padded posts with the net between them, an antenna over each side line, the winch on the near post, the court lines on the grass, and under each post its footing and sleeve drawn through the grass in orange.",
    note: (link: L) => <>
      Each post drops into a steel sleeve cast in its footing, so it stands without guy wires and lifts out to mow or for
      the rains. The footings are drawn through the grass. Each tag opens its row in the{" "}
      {link("/docs/volleyball/net#points", "points table")}. The footings&rsquo; size waits
      for a builder to see the soil.
    </>,
    realAlt: "The same view rendered: the black net with its white top band between two dark green padded posts, red and white antennae, the white tape lines on grass mown in stripes, and the footings' concrete tops flush with the grass.",
  },
  drainage: "Drainage",
  netDiagram: {
    aria: (v: NetValues) => `Net system, seen along the net line: two steel posts ${v.h} mm high, ${v.out} mm outside the side lines, padded to ${v.pad} mm, each dropped into a steel sleeve cast in a concrete footing ${v.fw} mm square and ${v.fd} mm deep, its top flush with the grass; the net ${v.nl} mm long and ${v.nd} mm deep, its top ${v.men} mm above the court for men and ${v.women} mm for women, a side band and an antenna over each side line, the top cable to a winch on the near post at ${v.winch} mm.`,
    post: (h: S) => `${h} post`, men: (h: S) => `${h} men`, women: (h: S) => `${h} women`, pad: (h: S) => `${h} pad`, deep: (h: S) => `${h} deep`,
    between: (w: S, out: S) => `${w} between the side lines · posts ${out} outside them`,
    N: (l: S, d: S) => `net ${l} × ${d}, 100 mm mesh`,
    A: (l: S, above: S) => `antennae ${l}, ${above} above the net`,
    W: "winch, near post",
    P: "steel posts in sleeves",
    S: (w: S) => `footing ${w} square, sleeve cast in, top flush`,
    footer: "No guy wires: the posts stand in their sleeves and lift out to mow or for the rains, a cap closing each sleeve · design intent until a builder sees the soil",
  },
  drainageDiagram: {
    aria: (length: S, width: S, fall: S, along: S, across: S) => `Drainage of the court: the ${length} by ${width} m playing area is levelled to one plane falling no more than ${fall} mm a metre, the way the lawn already falls; rain soaks into the grass and a heavy shower runs off across it onto the lawn beyond the free zone. Along the ${length} m that is up to ${along} mm, across the ${width} m up to ${across} mm.`,
    along: "Along the court",
    across: "Or across it",
    section: (span: S, inN: S, drop: S) => ` ${span} m, falling at most 1 in ${inN}: up to ${drop} mm from end to end`,
    onto: "onto the lawn",
    notes: [
      "One plane, falling one way: which way is read on site.",
      "No drain under the court; the grass takes the rain.",
      "If water lies after the first rains: a gravel",
      "trench along the low side, not part of the build.",
    ],
    footer: "Heights drawn twenty times the length scale · design intent, the lawn’s fall not measured yet",
  },
  points: (v: PointValues): Record<string, Row> => ({
    S1: { what: "Footing and sleeve, near post", where: `${v.out} mm outside the near side line, on the centre line`, size: `${v.fw} mm square, ${v.fd} mm deep` },
    S2: { what: "Footing and sleeve, far post", where: "The same outside the far side line", size: `${v.fw} mm square, ${v.fd} mm deep` },
    P1: { what: "Near post", where: "In S1, toward the open lawn", size: `${v.h} mm, padded to ${v.pad} mm` },
    P2: { what: "Far post", where: "In S2, toward the benches", size: `${v.h} mm, padded to ${v.pad} mm` },
    W: { what: "Winch", where: "On P1's outer face", size: `At ${v.winch} mm; tensions the top cable` },
    N: { what: "Net", where: "Over the centre line", size: `${v.nl} × ${v.nd} mm, top at ${v.men} mm (men) or ${v.women} mm (women)` },
    A1: { what: "Antenna, near side line", where: "At the side band's outer edge", size: `${v.al} mm, ${v.above} mm above the net` },
    A2: { what: "Antenna, far side line", where: "On the net's other face", size: `${v.al} mm, ${v.above} mm above the net` },
  }),
  pointsDrawing: "court's net drawing",
  rails: {
    kit: (v: KitValues): RailCard[] => [
      { id: "ball", title: "Balls", size: "650 to 670 mm around, 260 to 280 g (rule 3.1)", note: "In a light colour or a mix of colours; kept in the ball store with a pump and a gauge." },
      { id: "tape", title: "Line tape", size: `${v.tape} mm white webbing, about ${v.tapeM} m, pinned every ${v.every} m`, note: "Lines of solid materials are not allowed outdoors (rule 1.2.3): webbing tape pinned flat into the grass with steel U-pins, lifted to mow." },
      { id: "bench", title: `Benches × ${v.benches}`, size: `${v.bl} × ${v.bd} mm, seat at ${v.bh} mm`, note: "Slatted timber on two trestles, 1 m back from the free zone, one each side of the centre line." },
      { id: "umbrella", title: `Thatched umbrellas × ${v.benches}`, size: `${v.across} across, eave at ${v.eave} mm, top ${v.top} mm`, note: "A timber pole behind each bench under a cone of thatch, like those on today's camping lawn." },
      { id: "store", title: "Ball store", size: `${v.sl} × ${v.sd} × ${v.sh} mm`, note: "A lockable timber chest at the bench row's end toward the compound: the balls, a pump, the net and the pads between games. It seats two." },
    ],
    net: (v: NetValues): RailCard[] => [
      { id: "footing", title: "Footings and sleeves × 2", size: `${v.fw} mm square, ${v.fd} mm deep, the sleeve cast in`, note: "S1, S2 · concrete, the top flush with the grass; a cap closes the sleeve when the post is out." },
      { id: "post", title: "Posts × 2", size: `${v.h} mm high, ${v.d} mm steel tube`, note: `P1, P2 · ${v.out} mm outside the side lines, no guy wires (rule 2.5); padded to ${v.pad} mm, the winch (W) on the near post at ${v.winch} mm.` },
      { id: "net", title: "Net", size: `${v.nl} × ${v.nd} mm, ${v.mesh} mm square mesh`, note: `N · black mesh with a ${v.top} mm white band along its top over the cable, a ${v.foot} mm band at its foot, and a white side band over each side line.` },
      { id: "antenna", title: "Antennae × 2", size: `${v.al} mm long, ${v.ad} mm thick, the top ${v.above} mm striped`, note: "A1, A2 · flexible rods at the side bands' outer edges, on opposite faces of the net, in 100 mm stripes of red and white (rule 2.4)." },
    ],
  },
  docs: [
    { href: "/docs/volleyball", title: "Execution plan", text: "Every step of making the court on the lawn, to the FIVB rules: level, footings, grass, lines, net." },
    { href: "/docs/volleyball/materials", title: "Materials", text: "The kit, the net and its posts, with each part's size, where to buy it and its cost." },
    { href: "/docs/volleyball/net", title: "Net and drainage", text: "The footings, the posts, the winch and the net with every point, and where the rain goes." },
  ],
  json: {
    settle: undefined as string | undefined, // volleyball.json build.settle, in its English on /en
  },
}

const rw: typeof en = {
  meta: {
    title: "Volleyball · Ifamu",
    description: "Ikibuga cya volleyball cy'ingano yuzuye ku byatsi, gifite intebe mu gicucu, kuri Digital Farm hafi ya Kigali.",
  },
  hero: {
    title: "Volleyball ku byatsi kugeza izuba rirenze",
    alt: "Ikibuga cya volleyball cy'ibyatsi ku byatsi biri ku nkombe y'ikiyaga izuba rirenga: imirongo y'umweru ku byatsi bigufi by'icyatsi, urushundura rufite agatambaro k'umweru hejuru n'antene z'umutuku n'umweru hagati y'inkingi ebyiri z'icyatsi kijimye zipfundikiye, umupira w'umweru ku byatsi iruhande rw'urushundura; inyuma yarwo intebe ebyiri z'imbaho munsi y'imitaka y'ibyatsi n'isanduku y'imbaho, ibiti bikiri bito, n'ikiyaga kirabagirana munsi y'imisozi migufi.",
  },
  plan: {
    title: "Igishushanyo: ikibuga cya m 18 kuri 9 kiri mu gace k'ubwisanzure ka m 3, m 24 kuri 15 byose hamwe, imirongo yacyo ifite ubugari bwa mm 50 iri imbere mu kibuga; umurongo wo hagati munsi y'urushundura, umurongo w'igitero kuri m 3 ku mpande zombi zawo ugaragaza uduce tw'imbere ukomeza hanze y'imirongo y'impande mu tudomo tugufi, n'uduce two gutera serivisi inyuma y'imirongo y'impera; inkingi z'urushundura kuri m 1 hanze y'imirongo y'impande, antene hejuru ya buri murongo w'uruhande; inyuma y'agace k'ubwisanzure ka kure intebe ebyiri munsi y'imitaka y'ibyatsi n'ububiko bw'imipira. Hejuru yabyo umukino ku gihe cya serivisi: abakinnyi batandatu kuri buri ruhande bakurikije uko bazenguruka, utera serivisi mu gace ka serivisi k'ibumoso, inzira y'umupira yambuka urushundura igana hagati y'abakira babiri, umusifuzi wa mbere ku ntebe ndende ku nkingi ya hafi n'uwa kabiri iruhande rw'inkingi ya kure.",
    labels: {
      frontZone: "AGACE K'IMBERE", backZone: "AGACE K'INYUMA", service: "AGACE KA", zone: "SERIVISI", freeZone: "AGACE K'UBWISANZURE",
      net: (men, women) => `URUSHUNDURA ${men} ABAGABO · ${women} ABAGORE`,
      antenna: "ANTENE", post: "INKINGI", referee1: "UMUSIFUZI WA 1, KU NTEBE NDENDE", referee2: "UMUSIFUZI WA 2", server: "UTERA SERIVISI",
      serving: "ABATERA SERIVISI", receiving: "ABAKIRA", bench: "INTEBE", shade: "IGICUCU", ballStore: "UBUBIKO BW'IMIPIRA",
      foot1: "IMIRONGO mm 50, IMBERE MU KIBUGA · INKINGI 1,000 HANZE Y'IMIRONGO Y'IMPANDE · HAREBA IBYATSI BIFUNGUYE",
      foot2: "UKO BAZENGURUKA KURI SERIVISI: 4 3 2 KU RUSHUNDURA, 5 6 1 INYUMA · ABAKINNYI BASHUSHANYIJWE BANINI KURUSHA UKO BARI",
    },
  },
  model: {
    lineAlt: "Igishushanyo cy'imirongo cy'ikibuga kirebwa uturutse ku byatsi bifunguye: inkombe y'agace k'ubwisanzure, imirongo y'impande n'iy'impera, umurongo wo hagati n'imirongo ibiri y'igitero, imigozi y'urushundura hagati y'inkingi zarwo zombi n'antene hejuru ya buri murongo w'uruhande, umupira iruhande rw'urushundura, n'inyuma y'agace k'ubwisanzure ka kure intebe ebyiri munsi y'imitaka y'ibyatsi n'ububiko bw'imipira.",
    realAlt: "Ishusho imwe yakozwe nk'ifoto: ibyatsi byakaswe bigufi mu mirongo y'icyatsi cyerurutse n'icyijimye hagati y'ibyatsi birebire, imirongo y'agatambaro k'umweru, urushundura rw'umukara rufite udutambaro tw'umweru ku nkingi z'icyatsi kijimye zipfundikiye, antene z'umutuku n'umweru, umupira w'umweru ku byatsi, intebe z'imbaho n'isanduku y'imbaho, n'imitaka ibiri y'ibyatsi itera igicucu.",
  },
  build: {
    title: "Ikibuga",
    baseAlt: "Ibyatsi aho ikibuga kizajya, birebwa uturutse hejuru neza: ibyatsi birebire, byashizeho ahantu hamwe aho abashyitsi basanzwe bakinira.",
    builds: [
      "Ahakinirwa haringanizwa n'ubutaka bw'umucanga bwo hejuru, hanyuma fondasiyo ebyiri z'inkingi zigasukwa.",
      "Ibyatsi bimera bundi bushya bigakatwa bigufi inshuro nyinshi.",
      "Imirongo y'agatambaro k'umweru ifatishwa hasi.",
      "Inkingi zinjizwa mu bituba byazo, urushundura rukamanikwa.",
    ],
    stages: {
      lawn: { title: "Ibyatsi uko biri ubu", text: (fl, fw, clear) => `Aho abashyitsi basanzwe bakinira bazengurutse urushundura. Ahantu ha m ${fl} × ${fw} ikibuga gifata harangwa n'imambo, ibiti bigumishwa kuri m 4 kure yaho kandi nta kintu kiri hejuru yaho munsi ya m ${clear}.` },
      level: { title: "Intambwe ya 1 · Kuringaniza na fondasiyo", text: (topdress, fall, w, depth) => `Ahabyimbye harakatwa n'ahacukutse hagasibwa n'ubutaka bw'umucanga bwo hejuru bwa hafi mm ${topdress}, hagasiribwa hakaba ubuso bumwe butamanuka kurenza mm ${fall} kuri metero; fondasiyo ebyiri za mm ${w} impande zose n'ubujyakuzimu bwa mm ${depth} zisukwa hamwe n'ibituba byazo.` },
      grass: { title: "Intambwe ya 2 · Ibyatsi", text: (settle) => `Ahashize hateramo imbuto maze hose hagakatwa hagufi inshuro nyinshi, ibyatsi bihakikije bigasigara ari birebire: ${settle}.` },
      lines: { title: "Intambwe ya 3 · Imirongo", text: (tape, l, w, every, attack) => `Agatambaro k'umweru ka mm ${tape} imbere muri m ${l} × ${w}, gafatishwa buri m ${every} no kuri buri nguni n'aho imirongo ihurira; umurongo wo hagati n'umurongo w'igitero kuri m ${attack} ku mpande zombi.` },
      net: { title: "Intambwe ya 4 · Urushundura", text: (men, women) => `Inkingi zinjizwa mu bituba byazo, urushundura rumanikwa kuri mm ${men} ku bagabo cyangwa mm ${women} ku bagore, antene hejuru ya buri murongo w'uruhande.` },
    },
  },
  kit: "Ibikoresho",
  net: {
    title: "Urushundura n'inkingi",
    figureAlt: "Igishushanyo cy'imirongo cy'urushundura kirebwa hafi uturutse ku byatsi bifunguye: inkingi ebyiri zipfundikiye n'urushundura hagati yazo, antene hejuru ya buri murongo w'uruhande, winch ku nkingi ya hafi, imirongo y'ikibuga ku byatsi, kandi munsi ya buri nkingi fondasiyo yayo n'igituba cyayo bishushanyije binyuze mu byatsi mu ibara rya oranje.",
    note: (link) => <>
      Buri nkingi yinjira mu gituba cy&rsquo;icyuma cyasutswe muri fondasiyo yayo, bityo igahagarara nta migozi iyifashe kandi
      ikavanwamo kugira ngo ibyatsi bikatwe cyangwa mu gihe cy&rsquo;imvura. Fondasiyo zishushanyije zinyuze mu byatsi. Buri
      kimenyetso gifungura umurongo wacyo mu {link("/docs/volleyball/net#points", "mbonerahamwe y'ahantu")}. Ingano ya
      fondasiyo itegereje ko umwubatsi abona ubutaka.
    </>,
    realAlt: "Ishusho imwe yakozwe nk'ifoto: urushundura rw'umukara rufite agatambaro k'umweru hejuru hagati y'inkingi ebyiri z'icyatsi kijimye zipfundikiye, antene z'umutuku n'umweru, imirongo y'agatambaro k'umweru ku byatsi byakaswe mu mirongo, n'impera za beto za fondasiyo zingana n'ibyatsi.",
  },
  drainage: "Itemba ry'amazi",
  netDiagram: {
    aria: (v) => `Uburyo bw'urushundura, burebwa ku murongo w'urushundura: inkingi ebyiri z'icyuma z'uburebure bwa mm ${v.h}, kuri mm ${v.out} hanze y'imirongo y'impande, zipfundikiye kugeza kuri mm ${v.pad}, buri imwe yinjijwe mu gituba cy'icyuma cyasutswe muri fondasiyo ya beto ya mm ${v.fw} impande zose n'ubujyakuzimu bwa mm ${v.fd}, impera yayo ingana n'ibyatsi; urushundura rwa mm ${v.nl} z'uburebure na mm ${v.nd} z'ubugari, hejuru yarwo kuri mm ${v.men} hejuru y'ikibuga ku bagabo na mm ${v.women} ku bagore, agatambaro k'uruhande n'antene hejuru ya buri murongo w'uruhande, umugozi wo hejuru ugana kuri winch iri ku nkingi ya hafi kuri mm ${v.winch}.`,
    post: (h) => `inkingi ${h}`, men: (h) => `abagabo ${h}`, women: (h) => `abagore ${h}`, pad: (h) => `ipfundikizo ${h}`, deep: (h) => `ubujyakuzimu ${h}`,
    between: (w, out) => `${w} hagati y'imirongo y'impande · inkingi ${out} hanze yayo`,
    N: (l, d) => `urushundura ${l} × ${d}, imyobo ya mm 100`,
    A: (l, above) => `antene ${l}, ${above} hejuru y'urushundura`,
    W: "winch, ku nkingi ya hafi",
    P: "inkingi z'icyuma mu bituba",
    S: (w) => `fondasiyo ${w} impande zose, igituba gisutswemo, impera ingana n'ubutaka`,
    footer: "Nta migozi ifashe inkingi: zihagarara mu bituba byazo kandi zikavanwamo kugira ngo ibyatsi bikatwe cyangwa mu gihe cy'imvura, umupfundikizo ugafunga buri gituba · igitekerezo cy'igishushanyo kugeza umwubatsi abonye ubutaka",
  },
  drainageDiagram: {
    aria: (length, width, fall, along, across) => `Itemba ry'amazi y'ikibuga: ahakinirwa ha m ${length} kuri ${width} haringanizwa hakaba ubuso bumwe butamanuka kurenza mm ${fall} kuri metero, nk'uko ibyatsi bisanzwe bimanuka; imvura icengera mu byatsi naho imvura nyinshi igatemba ibinyuramo ijya ku byatsi biri hanze y'agace k'ubwisanzure. Ku burebure bwa m ${length} ni kugeza kuri mm ${along}, ku bugari bwa m ${width} kugeza kuri mm ${across}.`,
    along: "Ku burebure bw'ikibuga",
    across: "Cyangwa ku bugari bwacyo",
    section: (span, inN, drop) => ` m ${span}, bimanuka bitarenze 1 kuri ${inN}: kugeza kuri mm ${drop} kuva ku mpera imwe kugera ku yindi`,
    onto: "ku byatsi",
    notes: [
      "Ubuso bumwe, bumanuka ku ruhande rumwe: uruhe, birebwa aho hantu.",
      "Nta muyoboro munsi y'ikibuga; ibyatsi byakira imvura.",
      "Amazi nareka nyuma y'imvura za mbere: umuferege",
      "w'amabuye ku ruhande rwo hasi, utari mu bwubatsi.",
    ],
    footer: "Ubuhagarike bwashushanyijwe incuro makumyabiri z'igipimo cy'uburebure · igitekerezo cy'igishushanyo, uko ibyatsi bimanuka ntikurapimwa",
  },
  points: (v) => ({
    S1: { what: "Fondasiyo n'igituba, inkingi ya hafi", where: `mm ${v.out} hanze y'umurongo w'uruhande rwa hafi, ku murongo wo hagati`, size: `mm ${v.fw} impande zose, ubujyakuzimu mm ${v.fd}` },
    S2: { what: "Fondasiyo n'igituba, inkingi ya kure", where: "Kimwe n'ahandi, hanze y'umurongo w'uruhande rwa kure", size: `mm ${v.fw} impande zose, ubujyakuzimu mm ${v.fd}` },
    P1: { what: "Inkingi ya hafi", where: "Muri S1, ku ruhande rw'ibyatsi bifunguye", size: `mm ${v.h}, ipfundikiye kugeza kuri mm ${v.pad}` },
    P2: { what: "Inkingi ya kure", where: "Muri S2, ku ruhande rw'intebe", size: `mm ${v.h}, ipfundikiye kugeza kuri mm ${v.pad}` },
    W: { what: "Winch", where: "Ku ruhande rw'inyuma rwa P1", size: `Kuri mm ${v.winch}; ikurura umugozi wo hejuru` },
    N: { what: "Urushundura", where: "Hejuru y'umurongo wo hagati", size: `mm ${v.nl} × ${v.nd}, hejuru kuri mm ${v.men} (abagabo) cyangwa mm ${v.women} (abagore)` },
    A1: { what: "Antene, umurongo w'uruhande rwa hafi", where: "Ku nkombe y'inyuma y'agatambaro k'uruhande", size: `mm ${v.al}, mm ${v.above} hejuru y'urushundura` },
    A2: { what: "Antene, umurongo w'uruhande rwa kure", where: "Ku rundi ruhande rw'urushundura", size: `mm ${v.al}, mm ${v.above} hejuru y'urushundura` },
  }),
  pointsDrawing: "gishushanyo cy'urushundura rw'ikibuga",
  rails: {
    kit: (v) => [
      { id: "ball", title: "Imipira", size: "Umuzenguruko wa mm 650 kugeza 670, g 260 kugeza 280 (itegeko 3.1)", note: "Y'ibara ryerurutse cyangwa amabara avanze; ibikwa mu bubiko bw'imipira hamwe na pompe n'igipimo." },
      { id: "tape", title: "Agatambaro k'imirongo", size: `Agatambaro k'umweru ka mm ${v.tape}, hafi m ${v.tapeM}, gafatishwa buri m ${v.every}`, note: "Imirongo y'ibikoresho bikomeye ntiyemewe hanze (itegeko 1.2.3): agatambaro gafatishwa kuryamye mu byatsi n'udusumari tw'icyuma tumeze nka U, kakavanwaho kugira ngo ibyatsi bikatwe." },
      { id: "bench", title: `Intebe × ${v.benches}`, size: `mm ${v.bl} × ${v.bd}, aho kwicara kuri mm ${v.bh}`, note: "Imbaho zitandukanye ku maguru abiri, kuri m 1 inyuma y'agace k'ubwisanzure, imwe kuri buri ruhande rw'umurongo wo hagati." },
      { id: "umbrella", title: `Imitaka y'ibyatsi × ${v.benches}`, size: `${v.across} z'umurambararo, inkombe kuri mm ${v.eave}, hejuru mm ${v.top}`, note: "Inkingi y'igiti inyuma ya buri ntebe munsi y'igisenge cy'ibyatsi kimeze nk'umutemeri, nk'iziri ku byatsi byo gukambika uyu munsi." },
      { id: "store", title: "Ububiko bw'imipira", size: `mm ${v.sl} × ${v.sd} × ${v.sh}`, note: "Isanduku y'imbaho ifungwa ku mpera y'umurongo w'intebe yerekeye ku nzu: imipira, pompe, urushundura n'ibipfundikizo hagati y'imikino. Yicarwaho n'abantu babiri." },
    ],
    net: (v) => [
      { id: "footing", title: "Fondasiyo n'ibituba × 2", size: `mm ${v.fw} impande zose, ubujyakuzimu mm ${v.fd}, igituba gisutswemo`, note: "S1, S2 · beto, impera ingana n'ibyatsi; umupfundikizo ufunga igituba iyo inkingi yavanwemo." },
      { id: "post", title: "Inkingi × 2", size: `Uburebure mm ${v.h}, igituba cy'icyuma cya mm ${v.d}`, note: `P1, P2 · mm ${v.out} hanze y'imirongo y'impande, nta migozi izifashe (itegeko 2.5); zipfundikiye kugeza kuri mm ${v.pad}, winch (W) ku nkingi ya hafi kuri mm ${v.winch}.` },
      { id: "net", title: "Urushundura", size: `mm ${v.nl} × ${v.nd}, imyobo ya mm ${v.mesh} impande zose`, note: `N · imyobo y'umukara ifite agatambaro k'umweru ka mm ${v.top} hejuru yayo gapfundikiye umugozi, agatambaro ka mm ${v.foot} hasi, n'agatambaro k'umweru k'uruhande hejuru ya buri murongo w'uruhande.` },
      { id: "antenna", title: "Antene × 2", size: `Uburebure mm ${v.al}, ubunini mm ${v.ad}, mm ${v.above} zo hejuru zifite imirongo`, note: "A1, A2 · inkoni zihetama ku nkombe z'inyuma z'udutambaro tw'impande, ku mpande zitandukanye z'urushundura, zifite imirongo ya mm 100 y'umutuku n'umweru (itegeko 2.4)." },
    ],
  },
  docs: [
    { href: "/docs/volleyball", title: "Gahunda y'imirimo", text: "Buri ntambwe yo gukora ikibuga ku byatsi, hakurikijwe amategeko ya FIVB: kuringaniza, fondasiyo, ibyatsi, imirongo, urushundura." },
    { href: "/docs/volleyball/materials", title: "Ibikoresho", text: "Ibikoresho, urushundura n'inkingi zarwo, n'ingano ya buri gice, aho kukigura n'igiciro cyacyo." },
    { href: "/docs/volleyball/net", title: "Urushundura n'itemba ry'amazi", text: "Fondasiyo, inkingi, winch n'urushundura n'ahantu hose, n'aho imvura ijya." },
  ],
  json: {
    settle: "ibyumweru bike by'imikurire mbere y'umukino wa mbere ku byatsi bishya",
  },
}

export const words: Words<typeof en> = { en, rw }
