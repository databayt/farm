# Recordkeeping

Status: Stage 7 draft · Created: 2026-10-19 · Location: **unconfirmed**
Task T21 delivers the template; T38 (March 2027) puts it in daily use. Records come first; software comes later, and only when a trigger in section 9 is met. The sister folder `study/engineering/` may describe a farm platform; this file says what that platform has to replace before anything is built.

## 1. Why records come before software

- Every number in the financial model is `[A]` today (52 input rows are still placeholders [E financial-model-notes.md]). Only this farm's own records replace them: costs, yields, weights, mortality, sale prices.
- The decision gates (G5–G9 in `../execution/five-year-roadmap.md`) are passed on records, not on opinion.
- Only 4% of Bugesera goat farms keep records [V LVS-10]. Clean records are a competitive asset: for breeding-stock sales, for an exporter's traceability, and for any loan or investor.
- A phone-friendly spreadsheet works from day one, costs nothing, and survives staff changes.

## 2. Principles

1. **Write it down the same day.** Paper at the point of work if there is no signal, typed in within a day.
2. **One fact, one place.** A weight is entered once, in `AnimalEvents`, and referenced elsewhere.
3. **Stable identifiers.** Animal ID, block ID, tree ID, asset ID, buyer ID, supplier ID. Never reuse an ID.
4. **Dates as `YYYY-MM-DD`; money in RWF; weights in kg; volumes in litres; areas in hectares (acres in brackets only in reports).** USD only with the BNR rate and its date (RWF 1,475.24/USD on 2026-10-19 [V MKT-04]).
5. **Dropdown lists for categories** (cost types, crop names, health signs) so that reports add up.
6. **Append only.** Never delete a row; correct with a new row marked "correction" and the reason.
7. **A record is evidence.** Link a photo, a receipt photo or a signed note wherever one exists.
8. **Backups:** the workbook is exported to a file every Sunday and kept in a second place (the founder's drive).
9. **Privacy:** supplier prices, bank details, land documents and personal data of workers and buyers are kept in a separate restricted sheet, never posted openly (the repo is private [D-001]).

## 3. The workbook

One shared workbook (a spreadsheet application that the manager can use on a phone, with offline entry if the signal is poor [U signal]) with these tabs. A mobile form (one per daily task) is added over the same tabs if typing is slow; the form writes rows into the tab.

| Tab | Purpose | Who enters | When | Key columns (all dated, with a `by` and `notes` column) | Format and checks |
|---|---|---|---|---|---|
| `Lists` | Dropdown values, ID counters | Founder | When needed | category lists, units, block names | Locked |
| `Daily` | One row per day: weather, work done, labour, problems, visitors | FM | Evening | date, rain mm (from `WaterEnergy`), tasks, hours, issues, photos | 1 row per date, required |
| `Animals` | Register of every animal | FM | At birth or arrival; update at exit | animal ID, tag, sex, breed type, date of birth, dam, sire, source ID, arrival date, status, exit date and reason | Unique ID; status list |
| `AnimalEvents` | Weights, health events, treatments, breeding, movements | FM; vet entries copied by FM | Same day | date, animal ID, event type (weigh / service / kidding / health / treatment / vaccination / move / cull), value, vet name, outcome | Event type list; weights in kg |
| `Mortality` | Deaths with cause and notification | FM | Same day | date, animal ID, age, signs, suspected cause (vet's words), notified to, disposal, estimated loss | One row per death |
| `Plantings` | Block register and tree counts | FM | At planting; at 30, 90 and 365 days | block ID, species, cultivar, count planted, date, supplier ID, plant source, survival counts, gap-fill dates | Block IDs on the map |
| `CropOps` | Irrigation, weeding, mulching, fertiliser, pruning, scouting, spraying | FM | Same day | date, block, operation, product (if any), rate, quantity, hours, scout counts, photo | Operation list |
| `Harvest` | Everything picked | FM | Same day | date, block, crop, kg, grade, destination | kg, grade list |
| `Sales` | Everything sold | F or FM | Same day | date, buyer ID, product, quantity, unit, price per unit, total RWF, payment status, payment date, animal IDs or block | Price type: farm-gate / wholesale / retail |
| `Costs` | Every expense | FM; founder checks | Same day | date, supplier ID, category, item, quantity, unit cost, total RWF, payment method, receipt link, linked task ID | Category = model categories (section 6) |
| `Inventory` | Feed, seed, inputs, spares, with reorder level | FM | Weekly count | item, location, quantity in, out, balance, reorder level | Balance by formula |
| `WaterEnergy` | Rain, tank levels, litres pumped, sensor vs manual checks, solar energy | FM; sensors later | Daily or on reading | date, rain mm, tank level, litres used by block or animals, pump hours, power note | Compared monthly to sensors |
| `Maintenance` | Asset register and logbook | FM | As done | see `maintenance.md` sections 2 and 9 | Overdue in red |
| `Biosecurity` | Visitors, incidents, status checks (RVF, PPR, movement), movement approvals | FM; founder | As happens; monthly | date, name, purpose, animal areas entered, incident, status note, approval link | Required for any animal move |
| `Prices` | Market price collection (continues the T08 series) | F or assistant | Weekly | date, market, product, unit, price, price type, source | Same products and units each week |
| `Buyers` | Buyer and prospect file (per `study/go-to-market/`) | F | After each contact | buyer ID, status (prospect / committed / customer), spec, volume, price, last contact | A prospect is never a customer |
| `Suppliers` | Supplier file | F | After each contact | supplier ID, what, price quoted, date, verified (yes / no) | A listed supplier is not confirmed stock |
| `Permits` | Permit and compliance register | F | As it changes | permit, issuer, fee, lead time, status, date filed, decision, expiry | From T26 |
| `Gates` | Gate tracker: each condition, evidence link, status | F | At each gate | gate, condition, evidence, who checked, date | From the roadmap tables |
| `Decisions` | Pointer to the decision log | F | At each decision | date, ID, one line, link | The log stays in `../execution/decision-log.md` |

## 4. Minimum records by area (what, who, when)

| Area | Minimum record | Who | When |
|---|---|---|---|
| Money | Every expense with receipt; every sale; opening and closing cash | FM + F | Same day; month end |
| Land and plants | Block map, count planted, survival at 30, 90, 365 days | FM | At planting and at the counts |
| Crop work | Operations and scouting | FM | Same day |
| Harvest and sales | Weights, grades, buyer, price, payment | FM | Same day |
| Animals | Register; birth, service, kidding, weights, health events, treatments, vaccinations, moves, deaths | FM + VET | Same day |
| Feed and water | Feed in and out; fodder cut weights; tank levels; litres per use | FM | Daily or weekly |
| Weather | Rain gauge daily; temperature note | FM | Daily |
| Biosecurity | Visitor book; incidents; status checks; movement approvals | FM + F | Same day; monthly |
| Maintenance | Preventive and corrective logs | FM | As done |
| Staff | Days worked, wages paid (restricted sheet) | F | Weekly |
| Permits | Register with dates and decisions | F | As changed |
| Evidence for gates | The gate tracker with links | F | At each gate |

## 5. Daily entry (target: 10 minutes)

Evening, on the phone:
1. Daily row: rain, work done, hours, issues.
2. Animal count: all present? (yes or exceptions).
3. Any health event or death (the other rows are filled as the events occur).
4. Any cost, harvest, sale or visitor.
5. Photos: one of each block and one of the pen.

A weekly sheet of 15 minutes on Sunday: inventory counts, backup, summary message to the founder.

## 6. How the records feed the financial model

The model's categories are on the `Assumptions`, `Models`, `CapEx` and `Annual` sheets of `../feasibility/financial-model.xlsx`. The `Costs` tab uses the same categories so the numbers can be pasted into the model.

| Record (tab) | Model input it replaces | Refresh | How |
|---|---|---|---|
| Capital items bought (`Costs`, category = CapEx line CX01–CX30) | CapEx unit costs and totals | After each purchase | Replace [A] with the actual; label the cell [V] with the invoice |
| Wages, utilities, admin, transport, maintenance (`Costs`) | Overheads (about RWF 3M a year [A]) | Quarterly | Monthly totals by category |
| Seedling and planting costs (`Costs`, `Plantings`) | Orchard establishment and gap-fill | At planting; annual | Cost per ha and per tree |
| Survival counts (`Plantings`) | Tree loss and replacement percentage | At 90 and 365 days | Planted vs alive |
| Harvest kg by block and age (`Harvest`) | Yield curves (avocado ramp 50% of the benchmark [A CRP-45]; other crops [A]) | Annual | kg per tree per year at stated tree age |
| Sales price and grade (`Sales`) | Price assumptions (e-Soko medians [E MKT-03]) | Quarterly | Realised price per kg by type |
| Herd register and events (`Animals`, `AnimalEvents`) | Births, deaths, culls, kidding interval, weights | Quarterly | Rates from the register |
| Mortality (`Mortality`) | Mortality inputs [A] | Quarterly | Deaths / animals at risk |
| Feed usage, fodder cut (`Inventory`, `CropOps`) | Pasture yield, feed self-sufficiency (49% in year 5 in the base case [E]), purchased feed | Quarterly | kg DM grown vs fed vs bought |
| Sales lag (`Sales`) | Collection lag assumption (credit sales collected one month later [A model]) | Annual | Days from sale to payment |
| Rain and water (`WaterEnergy`) | Pasture growth seasonality; irrigation need | Annual | Site rainfall vs the CHIRPS means [E LOC-34] |
| Prices continued (`Prices`) | Price series | Weekly | Median by month |

Each quarterly rebase (T67) is logged in `../execution/decision-log.md`: which inputs changed, from what to what, and why. Cell labels follow the evidence rules: a measured record is `[V]` (own record, with its tab and date range), an average from fewer than 12 records is `[E]`, anything else stays `[A]`.

## 7. How the records feed the decision gates

| Gate | Records read | What they show |
|---|---|---|
| G4 | `Permits`, `Costs`, `Buyers` | Permits filed, quotes, cash plan |
| G5 | `Biosecurity` (status notes), `Maintenance` (house and fence), `WaterEnergy` (dry-season readings), `Inventory` (feed), `Costs` (cash reserve) | The eight G5 checks |
| G6, G6b | `WaterEnergy`, `Maintenance`, `Daily` | Uptime, litres saved, hours saved |
| G7 | `Buyers`, `Costs`, `Sales`, `Harvest` | Written buyers, cost of production per kg vs agreed price |
| G8a | `Plantings`, `Costs`, `Mortality`, cash | Survival, capex vs quotes, reserve days |
| G8b | `AnimalEvents`, `Harvest`, `Sales` | Kidding rate, kid mortality, weights, yields, realised prices |
| G8c | `Plantings`, `Harvest`, `Sales` | Tree growth, herd size, EBITDA vs model |
| G9 | all of the above across two years | Clean records, first avocado vs ramp, repeat buyers |

## 8. KPIs the records must be able to produce

| KPI | Formula |
|---|---|
| Tree survival | Alive / planted at 90 and 365 days |
| Yield | kg per tree per year at stated tree age; t per ha |
| Herd mortality | Deaths / animals at risk, monthly and 12-month |
| Kidding rate and kidding interval | Kiddings per female per year; days between kiddings |
| Average daily gain | (Weight 2 − weight 1) / days |
| Feed per kg of gain | kg DM fed / kg gain |
| Feed self-sufficiency | Grown / fed |
| Water per tree and per animal | Litres used per tree or head per day |
| Cost per kg sold; margin per kg | Costs by line / kg; price − cost |
| Revenue per ha; cost per ha | By block |
| Days of cash | Cash / (monthly operating cost / 30) |
| On-time delivery rate; reject rate | By buyer |
| Preventive maintenance on time | Jobs done on time / jobs due |

## 9. When to move beyond the spreadsheet

A custom application (the sister `study/engineering/` farm platform) is built only after at least one of these happens, and after six months of clean spreadsheet records:

- more than about 100 animals, or more than one manager entering data;
- the spreadsheet is the bottleneck (slow, conflicting edits, entry errors that cost money);
- sensors produce data that has to sit with the records (G6b shows a measured benefit);
- a buyer or the authority requires traceability or reporting the sheet cannot give;
- a second farm or site is added.

What the application must carry from day one: the same IDs and categories, a CSV import of the workbook, offline entry (signal is [U]), Kinyarwanda, English and Arabic labels where the team needs them, and the same export back to the financial model. No migration starts without a backup and a mapping from each tab.

## 10. Roles and checks

| Role | Duty |
|---|---|
| FM | Enters records; keeps the paper fallback; flags missing data |
| Founder | Weekly review (30–60 minutes); monthly closing; backups; audit of five random rows each month |
| Vet | Dictates treatments; checks the health tab at visits |
| Analyst (Claude) | Quarterly rebase; consistency checks (duplicates, negative stocks, impossible weights, missing dates) |

Monthly data-quality check: no empty required fields; dates in order; animal count in `Animals` equals the daily count; cash matches the books; each sale has a harvest or an animal behind it.

## 11. First 30 days of use (T21, T38)

1. Build the workbook from the tab list; lock `Lists`.
2. Enter the baseline: assets, blocks, suppliers, buyers (as prospects), permits, the T01–T25 costs already incurred.
3. Train the manager for half a day; run two weeks in parallel with paper.
4. Review at day 14: what was missed, and what is not needed. Remove columns no one fills.
5. Freeze v1 and log the date in the decision log.

No sources were added by this file.
