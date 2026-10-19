# First 90 days — 2026-10-19 to 2027-01-17

Status: Stage 1 plan · Created: 2026-10-19
Spending rule: inside the under-USD-25k envelope, the first 90 days buy **evidence**, not assets. Larger purchases wait behind decision gates. Costs are `[A]` until quotes arrive.

## The calendar it has to fit

- **Rains:** bimodal in the eastern zones, March–May and October–December; the long dry season is June–August [E LOC-34].
- **The planting target is the March 2027 rains (Season B).** The October 2026 rains are too soon for an unassessed farm. The planting target means three things:
  - grafted seedlings ordered by January;
  - land and water works done in the January–February dry spell;
  - pasture and fodder established with the trees.
- **Livestock comes later.** The model buys the first goats in July 2027, once fencing, water, the house, quarantine and forage are ready. The RVF quarantine in the Eastern Province must be lifted first [V LVS-03].

## Decision gates

| Gate | When | Passes if | If it fails |
|---|---|---|---|
| **G0 Location and title** | Week 2 | Pin or UPI received; title type, holder, term and land-use designation known | Stop all spending; resolve the title first |
| **G1 Site fit** | Week 6 | Site visit done; soil and water results back; buffer line mapped; at least one candidate fruit and goats suit the site | Re-scope (different crops, or no livestock) |
| **G2 Commercial evidence** | Week 8 | At least 15 buyer interviews and 4 weeks of price data; at least 2 buyers say in writing they would buy the lead products at stated specs | Change the product mix before committing |
| **G3 Commit to Season B** | Week 10 | G1 and G2 passed; real quotes put the chosen model inside the capital plan, or a financing path exists | Plant a smaller pilot block only |
| **G4 Start works** | Week 12 | Contractor quotes, a water plan (and permit if needed), and a cash plan for months 1–12 | Delay works; keep the seedling order |

## Week by week

| Wk | Dates | Focus | Tasks (IDs below) |
|---|---|---|---|
| 1 | Oct 19–25 | Close Stage 1 | T01 founder answers the P1 questions; T02 read the Stage 1 pack |
| 2 | Oct 26–Nov 1 | Location | T03 site-specific desk baseline from the pin; T04 title and land-use check; **G0** |
| 3 | Nov 2–8 | Site visit | T05 inspection; T06 soil and water sampling; T07 sector agronomist and vet introductions |
| 4 | Nov 9–15 | Markets | T08 Kigali market visits and weekly price collection begin; T09 buyer interviews round 1 |
| 5 | Nov 16–22 | Suppliers | T10 nursery visits; T11 livestock source scouting (RVF status); T12 quotes for fencing, tanks and the animal house |
| 6 | Nov 23–29 | Site fit | T13 lab results interpreted; T14 buffer line and usable area mapped; **G1** |
| 7 | Nov 30–Dec 6 | Buyers | T09 round 2; T15 exporter and outgrower conversations |
| 8 | Dec 7–13 | Evidence | T16 decision-matrix scoring; T17 model update with quotes and prices; **G2** |
| 9 | Dec 14–20 | Design | T18 farm layout v1; T19 water plan and permit check |
| 10 | Dec 21–27 | Commit | **G3**; T20 seedling and planting-material orders |
| 11 | Dec 28–Jan 3 | Prepare | T21 recordkeeping set-up; T22 contractor selection |
| 12 | Jan 4–10 | Works | **G4**; T23 perimeter fence and water storage start |
| 13 | Jan 11–17 | Works | T24 land preparation (contours, planting holes, compost); T25 90-day review |

## Task register

| ID | Task | Pri | Depends | Est. cost RWF | Who | Deliverable → acceptance |
|---|---|---|---|---:|---|---|
| T01 | Answer questionnaire P1; send the pin or UPI, title scan and photos | P0 | — | 0 | Founder | `farm-questionnaire.md` P1 filled → all six P1 items answered or marked unknown |
| T02 | Review the Stage 1 report and model | P1 | — | 0 | Founder | Comments → open questions listed |
| T03 | Site desk baseline: elevation, CHIRPS rainfall, SoilGrids, land-use plan, distance | P0 | T01 | 0 | Claude | `research/site-baseline.md` → every figure labelled with its source |
| T04 | Verify title type, term, holder and land-use designation (land authority / Irembo; a lawyer if foreign-held) | P0 | T01 | 50,000–300,000 [A] | Founder + lawyer | Title note → tenure fits long-cycle trees, or the risk is documented |
| T05 | Site inspection per checklist | P0 | G0 | 30,000–60,000 transport [A] | Founder (+ helper) | Filled checklist, GPX, photo log → all 10 sections done |
| T06 | Soil (6–8) and water (2–3) samples to a lab | P0 | T05, lab quotes | 300,000–600,000 [A] | Founder | Chain-of-custody sheet → samples received by the lab |
| T07 | Meet the sector agronomist and veterinarian | P1 | G0 | 0 | Founder | Notes → RVF status and local vet services confirmed |
| T08 | Weekly price collection at 2–3 Kigali markets plus the nearest district market | P1 | — | 20,000 per week [A] | Founder or assistant | `prices.csv` rows → at least 4 weeks, same products and units |
| T09 | Buyer interviews (guide in `buyer-database.md`), 15–20 across categories | P0 | — | 50,000 transport [A] | Founder | Interview notes → at least 15 completed; specs, volumes, prices recorded |
| T10 | Visit 2–3 nurseries; check mother-tree source and grafting | P1 | — | 30,000 [A] | Founder | Nursery comparison → written quotes and lead times |
| T11 | Scout livestock sources; confirm movement rules after RVF | P2 | — | 30,000 [A] | Founder | Source list → health records available; movement legal |
| T12 | Quotes: fencing, water tanks, gutters, animal house, labour | P0 | T05 | 0 | Founder | 3 quotes per item → entered in the model |
| T13 | Interpret lab results per zone and crop | P0 | T06 | 0 | Claude + agronomist | Results table → suitable / correct / unsuitable per zone |
| T14 | Map the flood line, 50 m and 200 m lines; compute usable area | P0 | T05 | 0 | Founder + Claude | Base map → usable ha net of buffers |
| T15 | Talk to exporters and outgrower schemes (avocado, passion fruit) | P1 | — | 0 | Founder | Notes → entry terms known |
| T16 | Score the decision matrix with site and market evidence | P0 | G1, T09 | 0 | Claude | Scored matrix → every score labelled |
| T17 | Update the model with quotes, prices and site areas; run the scenarios | P0 | T12, T14 | 0 | Claude | Model and notes → funding gap per model with real costs |
| T18 | Farm layout v1 (2 options) | P1 | G1 | 0 | Claude + founder | Layout → respects the buffers; water by gravity where possible |
| T19 | Water plan; apply for a permit if required | P1 | T14 | 35,000 fee [V LOC-04] | Founder | Plan and permit application → filed if needed |
| T20 | Order seedlings and planting material for March | P0 | G3 | Deposit 20–50% of the plant cost [A] | Founder | Order confirmation → cultivars, quantities and delivery date fixed |
| T21 | Records: herd, plantings, costs, sales (phone-friendly sheet or simple app) | P2 | — | 0 | Claude | Working template → the founder can log a cost and a planting |
| T22 | Select contractors | P1 | T12 | 0 | Founder | Signed scope and price → schedule agreed |
| T23 | Perimeter fence and water storage | P1 | G4 | Per quotes (model base about 6–7M) [A] | Contractor | Works done → inspected against the scope |
| T24 | Contour lines, planting holes and compost before the rains | P1 | T23 | Labour per quotes [A] | Workers | Holes dug and composted → ready for March planting |
| T25 | 90-day review: actuals vs plan, decision log, next 90 days | P1 | — | 0 | Founder + Claude | Updated `PROJECT_STATUS.md` |

**Estimated spend before G4:** roughly RWF 0.6–1.3M [A]: tests, transport, legal checks and the permit fee. After G4, the works follow the model and the quotes.

## Risks in these 90 days

- **The title turns out to be short or contested (G0).** Mitigation: stop spending on long-cycle crops; consider annual and short-cycle lines only.
- **The buffer swallows much of the land.** Mitigation: the usable-area map before design (T14).
- **RVF restrictions persist.** Mitigation: livestock is already planned for month 9 or later; keep it optional.
- **Nursery stock of the chosen cultivar is unavailable for March.** Mitigation: order in December (T20); fall back to fast-cash crops in March and trees in October.
- **Founder time.** Mitigation: the tasks are sized for about 2 days a week; the market and price collection could be delegated.
