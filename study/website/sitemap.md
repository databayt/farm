# Website sitemap and user journeys

Status: Stage 6 draft · Date: 2026-10-19 · **The public site goes live only when there is real progress to show** (see `implementation-plan.md` §13).
Today the repo serves the study at `/docs` (Next.js 16, Fumadocs). The public site is a separate set of routes in the same app; `/docs` stays internal until the founder decides what, if anything, is public.

## 1. Goals and audiences

| Audience | Need | What the site must do |
|---|---|---|
| Buyers (hotels, grocers, aggregators, exporters) | Know who the farm is, what it can supply and when, how to order, what quality to expect | Show only products that exist; show specs; a clear business enquiry form |
| Partners (nurseries, vets, agronomists, outgrower schemes, NGOs, neighbours) | Judge seriousness and fit | Show method, records and progress; a partnership enquiry form |
| Investors and lenders | Judge honesty and evidence | Show verified progress and the evidence labels; no funding pitch before gates |
| Neighbours, workers, authorities | Trust | Plain statements on land, water, hiring; a contact route |
| Founder | Maintain it cheaply | Small, file-based content; low running cost |

Site goals (from the brief): establish credibility, explain the commercial proposition, attract buyers, generate qualified enquiries, attract suitable partners, present verified progress, explain natural farming and technology approach, support online ordering **only if justified**.

## 2. Page inventory

Phase labels: **L0** = launch version (when there is real progress to show), **L1** = after first sales, **L2** = only if justified by demand.

| # | Route | Page | Phase | Purpose | Content source |
|---|---|---|---|---|---|
| 1 | `/` | Home | L0 | One-sentence proposition, current status, three entry points (buyers, partners, progress) | copy §Home |
| 2 | `/about` | About the Farm | L0 | Who, where (only what is confirmed), why, stage | founder, title facts when confirmed |
| 3 | `/model` | Our Farming Model | L0 | Integrated model: trees, goats, fodder; lake buffers; the three study models | study (public extract) |
| 4 | `/produce` | Crops and Produce | L0 (status board) | What is **planned**, **planted**, **harvested**, **available** - per crop, with dates | farm records |
| 5 | `/livestock` | Livestock | L0 (status board) | Goat plan, health and movement approach; RVF status; nothing "for sale" until true | records |
| 6 | `/sustainability` | Sustainability | L0 | Practices actually in use, measured indicators; no claims beyond records | input log |
| 7 | `/technology` | Technology and Innovation | L0 | Records system, lot codes; what is not yet justified | records |
| 8 | `/quality` | Quality and Traceability | L0/L1 | Specification sheets, lot-code explanation, complaint process; sample lot page after first lot | sales plan |
| 9 | `/business` | Wholesale and Business Customers | L0 | Who we want to serve, how to enquire, spec sheet downloads (when real), payment/delivery policy | sales plan |
| 10 | `/partners` | Partnerships and Investment | L0 | Who we look for; what we share; evidence list; no funding ask | financing strategy |
| 11 | `/journal` | Farm Journal | L0 | Dated posts with real photos and numbers; study milestones | records |
| 12 | `/journal/[slug]` | Journal entry | L0 | One post | MDX |
| 13 | `/progress` | Verified progress | L0 | Gate tracker: G0-G4 and C1-C4 with status and evidence | decision log |
| 14 | `/contact` | Contact | L0 | Enquiry forms (buyer, partner, general), phone/WhatsApp, hours | |
| 15 | `/privacy` | Privacy notice | L0 | What the forms collect, why, how long, how to remove | lawyer |
| 16 | `/terms` | Site terms | L0 | Disclaimer: information, not an offer | lawyer |
| 17 | `/sources` | Evidence labels and sources | L0 | The [V]/[E]/[A]/[U] system; links to public study extracts | study |
| 18 | `/lots/[code]` | Lot page (QR from label) | L1 | Lot details: block, date, weight, grading | records |
| 19 | `/order` | Online ordering | L2 | Only if repeat orders show it is wanted | |
| 20 | `/rw`, `/fr` | Translations | decided in `implementation-plan.md` §9 | | |
| 21 | `/docs` | Study (internal) | now | Existing; not public until approved; `noindex` | `scripts/sync-docs.mjs` |
| 22 | `/robots.txt`, `/sitemap.xml`, 404 | System | L0 | | |

Pages 4, 5 and 8 are **status boards**, not catalogues: each product line shows one of five states and the date it changed.

| State | Meaning | May a price or "order" button be shown? |
|---|---|---|
| Planned | Under study, not decided | No |
| Planted | Trees/vines in the ground (date) | No |
| In harvest | First harvest under way | No (buyers by enquiry) |
| Available | A delivery has been made and stock exists now | Spec and enquiry only; price on request |
| Paused | Out of season, disease, quarantine | Reason and date |

## 3. Navigation

Primary: Home · Our model · Produce · Livestock · For business · Partners · Journal · Contact.
Secondary (footer): About · Sustainability · Technology · Quality · Progress · Sources · Privacy · Terms · Language switch (if any).
Header has one call to action: "Business enquiry" (links to `/contact?type=buyer`).

## 4. User journeys

### 4.1 Buyer (hotel chef, grocer, aggregator)
1. Lands on Home from a message, a card or a search.
2. Sees the status line: "Now: [state]". If nothing is available, the page says so and offers "tell us what you need".
3. Opens `/business`: spec sheets (if any), delivery days, payment policy.
4. Checks `/quality` for lot codes and complaints process.
5. Submits the buyer enquiry (product, quantity per week, delivery place, timing, contact).
6. Gets an automatic acknowledgement and a personal reply within 2 working days.
7. The enquiry is logged in the buyer register (status ladder) by the founder.
Failure paths: product not available → polite "not yet", a date when we will know, an option to be told when it is; unclear spec → link to spec template.

### 4.2 Partner (nursery, vet, agronomist, outgrower scheme)
1. Home → `/partners`: what we look for; what we share; what we cannot offer yet.
2. Reads `/model` and `/progress` to judge seriousness.
3. Submits the partner enquiry (organisation, offer, how they work, references).
4. Reply within 5 working days; the founder moves them to the supplier register.

### 4.3 Investor or lender
1. Home → `/partners` → `/progress` and `/sources`.
2. Sees plainly: no funding is being requested; the evidence list for when it would be.
3. May request the executive summary or the deck from the founder (not downloadable).
4. Contact via the partner form with type "investor".

### 4.4 Neighbour, worker, authority
1. `/about` and `/contact`: who to speak to; hiring statement; water and lake-buffer statements.
2. Contact form type "community" or phone.

### 4.5 Returning follower
1. `/journal` and `/progress`; an optional email or RSS update (RSS first; email list only with consent and a privacy notice).

## 5. Wireframe notes (layout intent)

- **Home:** status strip (state of each line, with date) → proposition (2 lines) → three cards (Buyers, Partners, Progress) → latest journal post → footer. No hero photo until a real one exists; use a flat panel with "Photo to come".
- **Produce / Livestock:** one row per line: name, state chip, date, spec link, "ask about this" button (only if Available or In harvest).
- **Progress:** two tables (project gates G0-G4; commercial gates C1-C4) with status and evidence link.
- **Business:** left column policies (delivery, payment, complaints), right column enquiry form summary and button.
- **Journal entry:** title, date, author, text, photos with captions (date, subject, who took it), "Numbers" box with labels.
- **Mobile first:** single column, 16 px minimum body, 44 px touch targets, form fields stacked.
- **WhatsApp link** beside the forms for buyers who prefer it (the number is a placeholder).
