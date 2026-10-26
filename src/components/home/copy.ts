// Every word on the homepage (D-017, D-018). The voice is study/brand/brand.md §6 and §12:
// plain and specific, future tense for anything planned, no superlatives. One file, so a
// Kinyarwanda version can follow (study/website/implementation-plan.md §9).
import type { AssetId } from "./assets"

export const copy = {
  meta: {
    title: "Digital Farm · Gashora, Rwanda",
    description:
      "A working farm above a lake in Gashora, an hour from Kigali, with guest rooms, studios and a place to learn. Concept renders of the planned compound.",
    ogAlt: "The entrance to Digital Farm at golden hour, a concept render of the planned gate and sign",
  },
  skip: "Skip to the walk-through",
  nav: [
    { href: "#way-in", label: "The way in" },
    { href: "#compound", label: "Compound" },
    { href: "#stay", label: "Stay" },
    { href: "#learn", label: "Learn" },
    { href: "#today", label: "Today" },
    { href: "#location", label: "Location" },
  ],
  menu: { open: "Open the menu", close: "Close the menu" },
  cta: "Register interest",
  captions: {
    render: "Concept render · planned",
    film: "Concept film · planned",
    today: "Today · 2026-10-25",
    design: "Design render · studio package",
    pending: "Render pending",
  },
  hero: {
    eyebrow: "Gashora · Bugesera · Rwanda",
    title: "Digital Farm",
    lead: "A working farm above a lake in Gashora, an hour from Kigali, with rooms, studios and a place to learn. This is how it will look.",
    walk: "Walk through",
    film: "the arrival film",
  },
  wayIn: {
    eyebrow: "01 · The way in",
    title: "From the road to the courtyard",
    lead: "Two gates, green parking and a road of stone set the compound back from the public road.",
    steps: [
      { id: "gate", n: "01", title: "The gate", text: "A fieldstone wall carries the name, Digital Farm. The gate beside it is the first of two." },
      { id: "parking", n: "02", title: "Green parking", text: "Cars stay on grass, not concrete: a lawn of grass pavers under shade trees, just inside the gate." },
      { id: "road", n: "03", title: "The rock road", text: "A road of local stone setts, laid by hand, runs from the parking to the compound." },
      { id: "inner-gate", n: "04", title: "The inner gate", text: "Timber and red steel, in the colours of the decks. Past it, a quiet courtyard." },
    ] satisfies { id: AssetId; n: string; title: string; text: string }[],
  },
  compound: {
    eyebrow: "02 · The compound",
    title: "One courtyard, six containers",
    lead: "Everything sits around one lawn and a stone fire pit. Three guest rooms on the left, two studios and the farm office on the right, and behind them a room to learn.",
    note: "Illustrative plan, not to scale.",
    mapLabel:
      "Illustrative plan of the compound. From the public road: the outer gate and sign, green parking, a rock road and the inner gate. Around the courtyard lawn and its fire pit: the guest-room block on the left, the row of two studios and the office on the right, and the study room behind that row. The lake lies beyond a band of trees.",
    band: "From the air: the gates, the road, the courtyard and the lake beyond the trees.",
    film: "the aerial film",
    // x and y are the hotspot's place on the plan, in percent of its width and height.
    items: [
      { id: "gate", n: "1", title: "Gate and sign", tag: "Entrance", image: "gate", x: 38.2, y: 96, text: "Two fieldstone gateposts and a low wall with one sign: Digital Farm." },
      { id: "parking", n: "2", title: "Green parking", tag: "Arrival", image: "parking", x: 27, y: 89.5, text: "Grass pavers under shade trees, just inside the gate." },
      { id: "road", n: "3", title: "Rock road", tag: "Arrival", image: "road", x: 44, y: 78.5, text: "Hand-laid local stone, from the parking to the inner gate." },
      { id: "inner-gate", n: "4", title: "Inner gate", tag: "Arrival", image: "inner-gate", x: 50, y: 69.5, text: "Eucalyptus slats on a red steel frame. The compound starts here." },
      { id: "courtyard", n: "5", title: "Courtyard", tag: "Shared", image: "aerial", x: 61, y: 56.3, text: "A level lawn around the stone fire pit that is already on site. Every door opens onto it." },
      { id: "rooms", n: "6", title: "Guest rooms", tag: "2 × 40 ft, joined", image: "rooms", x: 14.5, y: 46.9, text: "Two 40 ft containers side by side, opened up inside: three en-suite rooms on a shared veranda." },
      { id: "studio-one", n: "7", title: "Studio one", tag: "20 ft", image: "studios", x: 41.1, y: 35.6, text: "Self-contained: a bed, a sitting corner, a kitchenette and a shower room, with a roof terrace." },
      { id: "studio-two", n: "8", title: "Studio two", tag: "20 ft", image: "studio", x: 54.6, y: 35.6, text: "The same plan as studio one, on its own raised deck beside it." },
      { id: "office", n: "9", title: "Farm office", tag: "20 ft", image: "office", x: 68.1, y: 35.6, text: "The yellow container: the farm's desk, its records and its first welcome." },
      { id: "study", n: "10", title: "Study room", tag: "40 ft", image: "study", x: 52.3, y: 22.6, text: "A room for training and quiet work, with glass doors to a timber deck." },
    ] satisfies { id: string; n: string; title: string; tag: string; image: AssetId; x: number; y: number; text: string }[],
  },
  stay: {
    eyebrow: "03 · Stay",
    title: "Three rooms and two studios",
    rooms: {
      title: "Three rooms in two joined containers",
      text: "Two 40 ft containers stand side by side as one building, opened up inside. That gives three rooms, each the full width of the pair and each with its own door onto a shared timber veranda. The red steel posts where the two containers meet are kept.",
      specs: [
        ["Rooms", "3"],
        ["Size", "about 19 m² each"],
        ["Inside", "bed, shower and WC"],
        ["Kitchen", "none"],
      ],
    },
    studios: {
      title: "Two studios with everything inside",
      text: "Two 20 ft containers on raised decks become self-contained studios: a bed, a sitting corner, a kitchenette and a shower room, behind a 3 m sliding glass wall that opens onto the deck. A roof terrace sits on top, under a clear canopy.",
      specs: [
        ["Studios", "2"],
        ["Floor", "13.1 m² net each"],
        ["Kitchenette", "induction hob, fridge, sink"],
        ["Roof", "terrace under a clear canopy"],
      ],
      design: "Every part of the studio is drawn, numbered and costed, ready to be cut in Kigali and assembled on site.",
      link: "See the studio design package",
    },
  },
  work: {
    eyebrow: "04 · Work and learn",
    title: "Where the farm is run, and where people learn",
    office: {
      tag: "20 ft · yellow",
      title: "The farm office",
      text: "The third 20 ft container is the farm office: where the records are kept, suppliers are met and visitors are welcomed.",
    },
    study: {
      tag: "40 ft · teal",
      title: "The study room",
      text: "Behind the studios, a 40 ft container becomes a room for training and quiet work: about twelve seats, a screen, and a wall of glass doors onto a timber deck.",
    },
    digital: {
      eyebrow: "Why digital",
      title: "Digital Farm runs on records.",
      text: "What is planted, spent and learned is written down and published in the open study, including the numbers that did not work out.",
      link: "Read the study",
    },
  },
  dusk: {
    label: "Evening at the farm",
    line: "The day ends around the fire pit, with the lake going dark beyond the trees.",
    film: "the evening film",
  },
  today: {
    eyebrow: "05 · Today",
    title: "From what stands today",
    lead: "The containers are already on the land. These photographs were taken on 2026-10-25. Drag the line to see the plan.",
    planned: "Planned",
    pairs: [
      { today: "rooms-today", planned: "rooms-planned", title: "The guest-room block", ratio: "aspect-[4/5]" },
      { today: "studios-today", planned: "studios-planned", title: "The studio row", ratio: "aspect-[4/3]" },
      { today: "arrival-today", planned: "arrival-planned", title: "The arrival yard", ratio: "aspect-[16/9]" },
    ] satisfies { today: AssetId; planned: AssetId; title: string; ratio: string }[],
  },
  location: {
    eyebrow: "06 · Location",
    title: "Gashora, an hour from Kigali",
    text: "The farm is in Gashora, in Bugesera District, about an hour's drive from Kigali. The compound sits back from the lake, behind a band of trees.",
    directions: "Directions are shared when a visit is arranged.",
    facts: [
      ["Sector", "Gashora"],
      ["District", "Bugesera"],
      ["Province", "Eastern"],
      ["From Kigali", "about 1 hour by road"],
    ],
    map: {
      label: "Stylised map: the road from Kigali south-east to Gashora in Bugesera District, about an hour's drive, with lakes around Gashora.",
      kigali: "Kigali",
      gashora: "Gashora",
      district: "Bugesera District",
      drive: "about 1 hour by road",
      lake: "lake",
    },
  },
  open: {
    eyebrow: "07 · In the open",
    title: "A farm you can follow",
    text: "Every decision behind Digital Farm, from the soil to the septic system, is in an open study: research, designs, costs and the plan, with each number marked verified, estimated, assumed or unknown.",
    links: [
      { href: "/docs", title: "Read the study", text: "Research, design, engineering, finance and the plan." },
      { href: "/en/studio", title: "The studio design package", text: "Drawings, a 3D model, cut lists and the bill of materials." },
    ],
    note: "The images on this page are concept renders of the plan, made from photographs of the site. The photographs themselves are in “From what stands today”.",
  },
  enquire: {
    eyebrow: "08 · Register interest",
    title: "Tell us what you are looking for",
    text: "Rooms and studios open once the work is finished and inspected. Send a message with what you are looking for and when, and we will keep you posted.",
    button: "Message us on WhatsApp",
    later: "The WhatsApp line opens soon.",
    missing: "Dev only: set WHATSAPP_NUMBER in src/components/home/config.ts",
  },
  footer: {
    place: "Gashora · Bugesera · Rwanda",
    note: "Concept renders show the plan. Details will change with the survey and the permits.",
    links: [
      { href: "/docs", label: "The open study" },
      { href: "/en/studio", label: "Container studios" },
      { href: "https://github.com/databayt/farm", label: "Source on GitHub" },
    ],
    credit: "An open study by databayt",
  },
}
