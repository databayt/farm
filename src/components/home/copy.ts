// Every word on the homepage (D-017, D-018). The voice is study/brand/brand.md §6 and §12:
// plain and specific, future tense for anything planned, no superlatives. One file, so a
// Kinyarwanda version can follow (study/website/implementation-plan.md §9).
import type { AssetId } from "./assets"

export const copy = {
  meta: {
    title: "Digital Farm · Gashora, Rwanda",
    description:
      "A working farm above a lake in Gashora, an hour from Kigali, where seven containers will become guest rooms, studios, a bar and a place to learn: the plan, and the site as it stands.",
  },
  skip: "Skip to the plan",
  nav: [
    { href: "#plans", label: "Plan" },
    { href: "#way-in", label: "The way in" },
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
    // The site's name, in the header and footer; the hero itself says only the headline.
    title: "Digital Farm",
    // Two lines, as the founder set them.
    headline: ["State of", "comfort"],
    walk: "Walk through",
    film: "the opening film",
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
  // The plan as /en/studio shows its own: 2D, then 3D (D-021). Both are drawn from compound.json.
  plans: {
    title: "2D",
    label:
      "Plan of the compound, north up. Along the top, the public road with the gate and the Digital Farm sign, then green parking and a rock road down to the inner gate. Down the west side, the bar and then the guest-room block, their doors onto the courtyard lawn and its fire pit. Along the south of the courtyard, the farm office and then two studios on raised decks. Further out toward the lake, the study room, its west end in line with the guest rooms. Then a band of trees and the lake.",
    note: "Illustrative plan: containers drawn to size, layout not surveyed.",
  },
  model: {
    title: "3D",
    line: "Line drawing of the compound from the air, seen from the entrance and looking toward the lake: the gate, the parking and the rock road in front; on the right, the bar and the guest-room block with their doors onto the courtyard and its fire pit; across the lawn, the office and two studios on raised decks; the study room beyond them; then trees and the lake.",
    real: "The same view rendered with materials and sunlight: the saffron-yellow guest rooms and office, the oxide-red bar and studios on timber decks, the teal study room, a green lawn around the stone fire pit, grass parking and a stone road, eucalyptus along the shore and the lake.",
    caption: "Rendered from the design model",
  },
  courtyard: {
    band: {
      planned: "From the air: the gates, the road, the courtyard and the lake beyond the trees.",
      today: "The courtyard today: the stone fire pit, tents on the lawn and the lake beyond the trees.",
    },
    film: "the compound film",
  },
  stay: {
    eyebrow: "02 · Stay",
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
      text: "Two 20 ft containers on raised decks become self-contained studios: a bed between open shelves, a two-seat sofa, a galley kitchen and a shower room, behind a 3 m sliding glass wall that opens onto a shaded deck. A stair climbs to an open roof terrace behind a guardrail.",
      specs: [
        ["Studios", "2"],
        ["Floor", "13.1 m² net each"],
        ["Galley", "induction hob, fridge, sink"],
        ["Roof", "open terrace behind a guardrail"],
      ],
      design: "Every part of the studio is drawn, numbered and costed, ready to be cut in Kigali and assembled on site.",
      link: "See the studio design package",
    },
  },
  work: {
    eyebrow: "03 · Work and learn",
    title: "Where the farm is run, and where people learn",
    office: {
      tag: "20 ft · yellow",
      title: "The farm office",
      text: "The first 20 ft container in the row, next to the guest rooms, is the farm office: where the records are kept, suppliers are met and visitors are welcomed.",
    },
    study: {
      tag: "40 ft · teal",
      title: "The study room",
      text: "Beyond the row, toward the lake, a 40 ft container becomes a room for training and quiet work: about twelve seats, a screen, and a wall of glass doors onto a timber deck.",
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
    // Unnumbered: the section shows only once the "-planned" renders exist.
    eyebrow: "Today and as planned",
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
    eyebrow: "04 · Location",
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
    eyebrow: "05 · In the open",
    title: "A farm you can follow",
    text: "Every decision behind Digital Farm, from the soil to the septic system, is in an open study: research, designs, costs and the plan, with each number marked verified, estimated, assumed or unknown.",
    links: [
      { href: "/docs", title: "Read the study", text: "Research, design, engineering, finance and the plan." },
      { href: "/en/studio", title: "The studio design package", text: "Drawings, a 3D model, cut lists and the bill of materials." },
    ],
    note: "Every picture on this page is labelled. “Today” marks a photograph of the site taken on 2026-10-25; “Concept render” marks a picture of the plan, made from those photographs.",
  },
  enquire: {
    eyebrow: "06 · Register interest",
    title: "Tell us what you are looking for",
    text: "Rooms and studios open once the work is finished and inspected. Send a message with what you are looking for and when, and we will keep you posted.",
    button: "Message us on WhatsApp",
    later: "The WhatsApp line opens soon.",
    missing: "Dev only: set WHATSAPP_NUMBER in src/components/home/config.ts",
  },
  footer: {
    place: "Gashora · Bugesera · Rwanda",
    note: "The plan on this page will change in its details with the survey and the permits.",
    links: [
      { href: "/docs", label: "The open study" },
      { href: "/en/studio", label: "Container studios" },
      { href: "https://github.com/databayt/farm", label: "Source on GitHub" },
    ],
    credit: "An open study by databayt",
  },
}
