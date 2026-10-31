// Every word on the homepage (D-017, D-018). The voice is study/brand/brand.md §6 and §12:
// plain and specific, future tense for anything planned, no superlatives. One file, so a
// Kinyarwanda version can follow (study/website/implementation-plan.md §9).
import type { AssetId } from "./assets"

// The index under the 3D: each place's design page and its docs, which open on its execution plan (D-059), and the
// docs pages printed in English and Kinyarwanda. Page paths take the reader's language when rendered
// (references.tsx); the Kinyarwanda link names its own (hrefLang).
type RefLink = { label: string; href: string; hrefLang?: string }
const page = (href: string): RefLink => ({ label: "Page", href })
const docs = (place: string): RefLink => ({ label: "Docs", href: `/docs/${place}` })
// A printed docs page, its Kinyarwanda and both PDFs, named as scripts/print-docs.mjs names them: studio is
// studio-plan.pdf, studio/electric is studio-electric.pdf.
const printed = (path: string): RefLink[] => {
  const pdf = path.includes("/") ? path.replace("/", "-") : `${path}-plan`
  return [
    { label: "English", href: `/docs/${path}` },
    { label: "Kinyarwanda", href: `/rw/docs/${path}`, hrefLang: "rw" },
    { label: "PDF", href: `/guides/${pdf}.pdf` },
    { label: "PDF (RW)", href: `/guides/${pdf}-rw.pdf` },
  ]
}

export const copy = {
  meta: {
    title: "Digital Farm · Gashora, Rwanda",
    description:
      "A working farm above a lake in Gashora, an hour from Kigali, where seven containers will become guest rooms, studios, a bar and a place to learn: the plan, and the site as it stands.",
  },
  skip: "Skip to the plan",
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
    walk: "Explore the farm",
    watch: "Watch film",
    closeFilm: "Close the film",
    book: "Book a stay",
    scroll: "Scroll to explore",
  },
  wayIn: {
    eyebrow: "01 · The way in",
    title: "From the road to the courtyard",
    lead: "Two gates, green parking and a road of stone set the compound back from the public road.",
    steps: [
      { id: "gate", n: "01", title: "The gate", text: "A fieldstone wall carries the name, Digital Farm. The gate beside it is the first of two." },
      { id: "parking", n: "02", title: "Green parking", text: "Cars stay on grass, not concrete: a lawn of grass pavers under shade trees, just inside the gate." },
      { id: "road", n: "03", title: "The rock road", text: "A road of grey granite setts, laid by hand in arcs, runs from the parking to the compound." },
      { id: "inner-gate", n: "04", title: "The inner gate", text: "Timber boards braced in an X, hung between fieldstone pillars. Past it, a quiet courtyard." },
    ] satisfies { id: AssetId; n: string; title: string; text: string }[],
  },
  // The plan as /en/studio shows its own: 2D, then 3D (D-022). Both are drawn from compound.json.
  plans: {
    title: "2D",
    label:
      "Plan of the compound, with the study room at the top and the gates at the bottom. At the top, the 40 ft study room on its deck, and beside it two buildings of their own: a 40 ft galley with a long worktop and two sinks, and a 20 ft public bathroom with two toilet rooms, two hand basins and a urinal. Below it, the row of three 20 ft containers on raised decks facing the courtyard: the farm office next to the bar, then two studios. Down the left, the bar and then the guest-room block in one line, their doors onto the veranda and the courtyard lawn: the stone fire pit with stools round it, a long timber table in front of the middle studio, and six small tents on a camping lawn between the guest rooms and the fire pit, ending at the fire. The study room's end is in line with the guest rooms. At the bottom, the inner gate, a rock road down to the green parking, and the outer gate beside the Digital Farm sign wall. On the lawn between the guest rooms and the parking, the volleyball court, 18 by 9 metres inside its 3 metre free zone, its long side across the plan and the net across its middle. To the left, past a break line, the land drawn close in one band from the study room to the first guest room: half of the vegetable field's two nearest blocks of raised beds behind their fence, turned to run west and cut there. At the cut an arrow links to the whole farm: the field, the nursery and the livestock. Through it all, the garden: big shade trees behind the study room and the galley, between the back row and the studios, beside the bar and the guest rooms, along the rock road and in a grove on the east lawn, and flower beds in the backyard, along each deck, by the guest rooms' windows, at both gates and behind the sign wall. Every name on the plan links to its page.",
    note: "Illustrative plan: containers drawn to size, layout not surveyed. The field is drawn close and cut at half; the farming page has all of it, with the nursery and the livestock.",
  },
  // Under the 3D: every page the plan links to, with its docs, and the printed pages (English and Kinyarwanda).
  references: {
    title: "Pages and guides",
    lead: "Every building and piece of land on the plan has its own page of drawings and its own docs: the execution plan, the materials and the services. Six docs pages are printed in English and Kinyarwanda.",
    groups: [
      {
        title: "Buildings",
        rows: [
          { name: "Studio", links: [page("/en/studio"), docs("studio"), { label: "Design package", href: "/docs/studio-package" }] },
          { name: "Guest room", links: [page("/en/guest-room"), docs("guest-room")] },
          { name: "Office", links: [page("/en/office"), docs("office")] },
          { name: "Study room", links: [page("/en/study-room"), docs("study-room")] },
          { name: "Galley", links: [page("/en/galley"), docs("galley")] },
          { name: "Public bathroom", links: [page("/en/public-bathroom"), docs("public-bathroom")] },
          { name: "Bar", links: [page("/en/bar"), docs("bar")] },
        ],
      },
      {
        title: "Outside",
        rows: [
          { name: "Camping", links: [page("/en/camp"), docs("camp")] },
          { name: "Parking", links: [page("/en/parking"), docs("parking")] },
          { name: "Volleyball", links: [page("/en/volleyball"), docs("volleyball")] },
          { name: "Master plan", links: [{ label: "Docs", href: "/docs/farm/master-plan" }, { label: "Drawing", href: "/designs/site/master-plan.svg" }] },
        ],
      },
      {
        title: "Land",
        rows: [
          { name: "Vegetable field", links: [page("/en/farming"), docs("farming")] },
          { name: "Livestock", links: [page("/en/livestock"), docs("livestock")] },
        ],
      },
      {
        title: "Printed",
        rows: [
          { name: "Studio plan", links: printed("studio") },
          { name: "Studio electric", links: printed("studio/electric") },
          { name: "Studio plumbing", links: printed("studio/plumbing") },
          { name: "Field plan", links: printed("farming") },
          { name: "Livestock plan", links: printed("livestock") },
          { name: "Farm electric", links: printed("farm/electric") },
        ],
      },
      {
        title: "The farm",
        rows: [
          { name: "Start here", links: [{ label: "Docs", href: "/docs" }] },
          { name: "The farm's plan", links: [docs("farm")] },
          { name: "The farm today", links: [{ label: "Docs", href: "/docs/farm/today" }] },
          { name: "How it runs", links: [{ label: "Docs", href: "/docs/operations" }] },
          { name: "The film", links: [{ label: "Docs", href: "/docs/film" }] },
          { name: "Business model", links: [{ label: "Docs", href: "/docs/business-model" }] },
        ],
      },
    ],
  },
  model: {
    title: "3D",
    line: "Line drawing of the compound seen from the front, from high beyond the gates: the gate and the sign wall lettered DIGITAL FARM, the parking and the rock road up to the inner gate; inside, six small tents and the fire pit ringed with stools on the lawn, with the bar and the guest rooms on the left; beyond the long timber table, the office and two studios on raised decks, each studio under a flat roof that reaches over its deck, with a ladder at its end up to two loungers; at the back the study room, the galley and the public bathroom. Between the guest rooms and the parking, the volleyball court marked out on the lawn, its net between two posts. On the left, on its own piece of ground beside the study room, the land drawn close: rows of raised vegetable beds behind a post-and-wire fence, cut at half. Round it all, the garden: big rounded shade trees behind the back row, beside the containers, along the rock road and in a grove on the right, and low flower beds along the decks and at the gates.",
    real: "The same view rendered with materials and sunlight: corrugated containers in saffron yellow, oxide red and teal, timber decks with red pipe railings, the two studios after their hero render (dark steel roofs over their decks on slim black posts, glass sliders half open, a steel ladder up to timber loungers, a bistro table and a potted plant), the sign wall's DIGITAL FARM in warm LED letters, hexagonal canvas tents (one with a green fly), the stone fire pit with its concrete cap and log stools, a long timber table, timber gates braced in an X, grass parking and a road of granite setts. Below the guest rooms, white tape lines and a black net on the grass of the volleyball court; on the left, raised beds of dark soil green with crop rows behind posts and wire. Big green shade trees stand behind the back row, beside the containers, along the road and in a grove on the right, and flower beds in pink, yellow, white and purple edge the decks and the gates.",
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
