# Buyer strategy — phases, channels, gates and pricing

Status: Stage 6 draft · Date: 2026-10-19 · Location: **unconfirmed** · Product: **none harvested, none confirmed**
Inputs: `../research/buyer-database.md`, `../registers/buyers.csv` (53 prospects, all status "prospect"), `../research/rwanda-agriculture-market.md`, `../research/crop-market-research.md`, `../research/livestock-market-research.md`, `../feasibility/financial-model-notes.md`, `../execution/first-90-days.md`.

## 0. Starting position (what is true today)

| Fact | Label |
|---|---|
| The farm has no customers, no orders, no letters of intent, no stock and no trial lots. Every buyer in the register is a prospect; none has been contacted. | [V] project record |
| The location, title and usable area are unconfirmed. No site-specific claim is made. | [U] (T01, T04) |
| First planting is targeted for the March 2027 rains; goats are modelled from July 2027 and only if the RVF quarantine allows it [A AS-07, AS-11]. Avocado sells from year 3-4 and meaningfully from year 5-6 [A, CRP-45]. | [A] |
| Every financial model shows a base-case funding gap (M1 about RWF 6.8M, M2 7.6M, M3 52.8M) on placeholder costs. | [E] financial-model-notes |
| Most fruit and goats move through traders; no farmer contracts exist in the goat chain [V BUY-10]. No buyer has published a price paid to farmers, an order size or a payment term [U]. | [V]/[U] |
| An RVF quarantine on goats and sheep covered the whole Eastern Province from 2026-06-26; status after 2026-09-28 is unknown [V LVS-03, LVS-05, BUY-29; U]. | [V]/[U] |

Consequence: this strategy is built to **buy evidence first and promise nothing**. Nothing here is a sales forecast. Every volume, price and date below is a decision rule or a target [A], not an expectation.

Sizing rule that follows from the model: the farm is small. A 40-doe herd at steady state yields about 6.5 births a month, 85% survival (about 5.5 young a month) [E, financial-model-notes], which is roughly one or two goats a week. A single brochette bar bought 2-10 goats a week in 2022 and M Hotel reported 300 kg of goat or mutton (period unstated) [V BUY-10]. The farm can serve **one or two small goat buyers, not a hotel**. For avocado, per 100 grafted trees the planning case (50% of the Australian irrigated benchmark [A CRP-45]) gives about 1.3 t in tree-year 4, 1.9 t in year 5 and 2.2-2.5 t from year 7 [E]. Compare Garden Fresh at 30 t a week [V BUY-55]. The farm is an outgrower-sized or niche supplier by default.

## 1. The five phases and their decision gates

Gates are named **C1-C5** and sit beside the project gates G0-G4 in `first-90-days.md` (C1 is the same evidence as G2). Thresholds marked [A] are working assumptions; change them in the decision log with a reason, not silently.

### Phase 1 — Buyer discovery (now; weeks 4-8 of the 90-day plan, then ongoing)

Goal: learn what buyers pay, need and accept before capital is committed to trees or animals.

Activities (founder-authorised only; templates in `outreach-templates.md`):
1. Run the price-collection sheet (`../research/buyer-database.md` §4.2) at 2-3 Kigali markets and the nearest district market, two market days a week for four weeks, at least three sellers per product.
2. Hold 15-20 interviews using the guide in §4.1 of the buyer database. Order from §2.1 there; revise after the first three.
3. Ask every exporter and aggregator for **written outgrower terms**: minimum volume, grade, varieties, price basis, payment days, input support.
4. Visit one abattoir (Saban, Nyabugogo) and one meat trader to learn slaughter fees, hours and rules, and ask the district veterinary officer for the current movement rules.
5. Log every contact in the buyer register with status on the ladder: prospect → interviewed → qualified → trial lot delivered → LOI signed → repeat order.

**Gate C1 — buyer evidence (same as project G2, week 8).** Pass only if all hold:

| # | Test | Threshold [A] | Evidence |
|---|---|---|---|
| C1.1 | Interviews completed | at least 15, in at least 5 categories (of 11) | interview notes in the register |
| C1.2 | Price data | 4 weeks, at least 3 products, same units | rows in `prices.csv` |
| C1.3 | Buyers stating a price basis | at least 5 | notes tagged "buyer-stated" |
| C1.4 | Buyers stating payment terms | at least 3, with at least 1 at 30 days or less | notes |
| C1.5 | Written outgrower or purchase terms | at least 2 documents or emails | filed copies |
| C1.6 | Buyers who say in writing they would trial the lead product at a stated spec | at least 2 | email or signed sheet |
| C1.7 | Price level | at least one channel offers at or above the e-Soko farm-gate median for the same grade | price sheet vs MKT-03 |

If C1 fails: do not plant beyond a pilot block; change the product mix, or go to `../investment/financing-strategy.md` Stage A with a smaller scope. If C1.7 fails everywhere, the model's farm-gate price assumption (AS-09) is the best case and the downside case governs.

### Phase 2 — Commercial validation (before and during establishment; months 2-12)

There is no farm product yet, so validation is by paper and proxy, never by claiming stock.

Tests, cheapest first:
1. **Specification test.** Show the draft specification sheets (`sales-plan.md` §1) to each interviewed buyer. Record changes: size, ripeness, count per crate, labelling, delivery days. Output: one agreed spec per buyer, version-dated.
2. **Price-range test.** Ask each buyer for the price they would pay for the specified grade, delivered and at farm gate. Compare with e-Soko (§4 below). Output: price range per channel.
3. **Letter of intent (non-binding).** For buyers who qualify (§4.3 of the buyer database), offer the LOI outline (§4.4 there), reviewed by a Rwandan lawyer first. A signed LOI counts as demand only at the volume written in it.
4. **Packaging and delivery test with a proxy lot (optional, small).** Buy a few kilograms of the same fruit at a market, grade and pack it to the draft spec, and deliver to a willing buyer **labelled as a packaging and handling trial, not as farm produce**. Purpose: learn crate size, grading time, delivery time and buyer reaction. Never present it as the farm's product, never accept payment as a sale of farm produce.
5. **Seedling/nursery link.** Where a buyer or exporter runs an outgrower scheme, ask whether it supplies or certifies planting material and whether it will buy from trees planted from its nursery. This ties the planting decision to a buyer before G3.

**Gate C2 — commit to planting (same moment as project G3, week 10).** Pass only if:

| # | Test | Threshold [A] |
|---|---|---|
| C2.1 | Each crop to be planted has at least one named channel with written terms or a signed LOI | all planted crops |
| C2.2 | Planned first-year volume per crop that is covered by LOI or written outgrower terms | at least 50% |
| C2.3 | Buyer payment terms inside the cash plan | 30 days or less, or secured |
| C2.4 | Passion fruit only: certified or virus-indexed planting material identified [V CRP-33] and a buyer agreed first | yes |
| C2.5 | Goats only: movement and slaughter rules confirmed in writing by the district veterinary office; one named buyer or abattoir route | yes |

If C2 fails for a crop, that crop is not planted at scale; plant a pilot block or substitute. A crop with no named channel is not a business line.

### Phase 3 — First sales (from the first real harvest or first saleable animals)

Indicative timing, all [A]: passion fruit about 12 months after planting; papaya similar; avocado year 3-4; goats 9+ months after the first purchase (kids to market weight) [CRP-45, financial-model-notes]. Do not sell before the farm can deliver the spec twice running.

Rules:
1. Start with **one to three buyers**, chosen from those who passed C2, and the channel with the shortest payment time.
2. First deliveries are **trial lots**: small, at the quoted price, with a written spec and delivery note (`sales-plan.md`). No credit on the first two deliveries to a new buyer [A].
3. Record every delivery, rejection and payment day in the tracking sheet. Run the feedback call within 48 hours.
4. Sell surplus to a market trader at the e-Soko price rather than hold fruit; never let fruit spoil waiting for a better buyer [E: post-harvest loss about 40% nationally, MKT-54].

**Gate C3 — first-sales proof (after the first 3 deliveries to each of 2 buyers).**

| # | Test | Threshold [A] |
|---|---|---|
| C3.1 | Deliveries accepted without rejection above 10% of lot weight | 2 consecutive deliveries per buyer |
| C3.2 | Payment received within the agreed days | all deliveries |
| C3.3 | Realised price vs e-Soko farm-gate median for the same week | at or above, on at least half the sales |
| C3.4 | Buyer says in writing it would reorder | at least 2 buyers |
| C3.5 | Complaints closed within 7 days | all |

Fail on C3.2 (late payment) is a stop: no further delivery on credit to that buyer.

### Phase 4 — Recurring sales (months after C3)

Move from one-off lots to predictable demand, without committing volume the farm cannot grow:
1. **Standing weekly or fortnightly delivery** to the best 2-4 buyers, on fixed days, using the committable-volume rule (§2 of `sales-plan.md`: commit no more than 60% of the recent proven weekly supply, never above the seasonal forecast).
2. **Repeat-order agreement** per buyer: non-exclusive, 3-month term, price by formula (§4 below), volume range, rejection rule, disease and weather force majeure with notice.
3. **Wholesale relationship** with one trader or aggregator as the outlet for surplus and off-spec fruit.
4. **Direct sales** (farm gate, WhatsApp orders, a farmers' market) only for small lots and only if time allows. KIGALIFAAM status is unconfirmed [BUY-B52].
5. **Digital ordering**: start with a WhatsApp Business catalogue and an order form (a table in the sales sheet). Online ordering on the website only after repeat orders show it is wanted (`../website/implementation-plan.md`).

**Gate C4 — recurring base.** At least 3 buyers with 3 consecutive months of repeat orders; no buyer above 50% of sales; receivables under 30 days on average; weekly supply forecast within 20% of actual for 8 weeks [A].

### Phase 5 — Expansion

Expand only along evidence. Order of options, each with its own gate:

| Option | Trigger [A] | Check before starting |
|---|---|---|
| Add a second fruit line | C4 passed and a buyer asks for it in writing | Yield and price evidence for the zone; fits the cash plan |
| Raise herd size | Goat buyer takes the full output for 3 months at or above target price and RVF rules are stable | Fodder balance, movement permits, a 2-4 month closed-market buffer [E LVS] |
| Aggregation (buy from neighbours) | A buyer wants more volume than the farm grows | Quality control, working capital, payment risk |
| Processing (drying, pulp, cut fruit) | Waste or off-spec above 15% of volume with a buyer for the processed product | Licence needs [U], equipment quotes |
| More land or an outgrower circle | Unit economics positive at the farm's size (see financing strategy) | Title, cash, management time |
| Exporter-readiness (GlobalG.A.P.) | An exporter offers a contract conditional on it, and the cost is quoted | Export potential is not readiness [V BUY-05] |

## 2. Which channels to test first, and why

Scoring is qualitative [A], from the evidence in the buyer database. "Fit" = suits a small, new, single-site supplier with a long wait to first harvest.

| Rank | Channel | Evidence for | Evidence against | Role | Test |
|---|---|---|---|---|---|
| 1 | **Direct-collecting aggregators and online grocers** (Afri-Farmers Market BUY-B03, Pride Farms BUY-B43, KabFresh BUY-B39) | Afri-Farmers: one supplying farmer says it collects from farms, weighs and pays immediately [V BUY-03, single account]; Pride Farms says at least 50% of purchase value goes to growers [V BUY-41, footer 2022]; KabFresh trains outgrowers [V BUY-37, footer 2021] | Self-reported; prices and volumes unpublished; two sites may be stale [U] | **First-sales channel** for passion fruit, papaya, mango, later avocado | Interview first; ask collection radius from the farm (location needed), grades, price basis, payment day |
| 2 | **Exporter outgrower schemes** (Garden Fresh BUY-B29, BAHAGE BUY-B32, ABCD Great Life BUY-B36, S&I Fresh BUY-B30, SOUK Farms BUY-B35) | Published outgrower routes with 250-3,000+ growers [V BUY-55, BUY-35, BUY-34, BUY-06]; 38 NAEB-listed avocado and 17 passion fruit exporters [V BUY-31]; they absorb small lots | Crowded and price-taking; terms unpublished [U]; export quality and traceability demands; global avocado oversupply in 2025-26 [V CRP-19] | **Structural off-take for avocado** (long-cycle risk reduction) | Interview in the same weeks as channel 1; get written terms before G3 |
| 3 | **Hotels and chefs** (Heaven BUY-B11, Serena BUY-B12, M Hotel BUY-B19, Ubumwe Grande BUY-B20) | Named local sourcing at Heaven [V BUY-16]; 2022 goat and lamb volumes at three hotels [V BUY-10] | Needs year-round consistency, delivery, invoices; volumes beyond a small farm for the largest (M Hotel 300 kg) | **Premium test** after supply is steady | Chef interviews now for spec learning; sell only after C3 |
| 4 | **Goat brochette trade and meat traders** (Nyarugenge bars BUY-B23 to B28; Saban BUY-B08; German Butchery BUY-B05) | Real, trader-controlled demand: 2-10 goats a week per bar in 2022 [V BUY-10]; retail goat meat RWF 7,250-8,500/kg [E MKT-03] | RVF quarantine and market closures [V LVS-03]; slaughter only in designated facilities and RICA rules [V LVS-41, LVS-28]; bars' 2022 data are four years old and unconfirmed | **Hold until rules are clear**; one buyer or abattoir route per C2.5 | District vet and abattoir interviews now; no commitment until movement rules are in writing |
| 5 | **Supermarkets** (Simba BUY-B01, Sawa Citi BUY-B02, U Express BUY-B34) | Simba says it cannot source all fresh produce locally [V BUY-56, second-hand] | No published supplier terms or payment days [U]; U Express opening unconfirmed | **Later channel**; needs steady weekly volume | One category-buyer meeting to get the onboarding form; do not pitch until C3 |
| 6 | **Market traders and wholesalers** (Kimironko, Nyarugenge, Gisimenti BUY-B06, B07, B51) | Always open; the price reference; takes surplus | Price-taker; transport cost doubled for one reported sack from RWF 1,000 to 2,000 [V BUY-59] | **Fallback and benchmark** | Price sheet only |
| 7 | **Processors and institutions** (Inyange BUY-B40, Solid'Africa BUY-B46, tenders) | Inyange bought pineapple and passion fruit in 2012 [V BUY-39] | Current sourcing [U]; tenders use national bidding, tender fee and security [V BUY-19, BUY-20] | **Not in years 1-2** | Read-only watch |

Recommended first channel: **direct-collecting aggregators and online grocers (Afri-Farmers type)** for first sales, tested together with **exporter outgrower terms** for avocado. Reasons: they are the only buyers with farmer-reported collection and fast payment practice; they accept small lots by design; and neither needs the farm to build a packhouse or hold a certificate before the first sale. Their weakness is the evidence: one farmer's account for the lead buyer. The first interview must confirm it.

What would change this ranking: a buyer interview showing a higher, reliable price at a hotel; a written exporter offer with input support; a district-vet ruling that allows farm-gate goat sales.

## 3. What not to do

- Do not choose the crop mix from the model and then look for buyers. The brief and `first-90-days.md` require buyers first.
- Do not promise export, GlobalG.A.P., "organic", cold chain or traceability that does not exist.
- Do not accept exclusivity, payment beyond 60 days without security, or a volume above what the farm has already delivered [buyer database §4.3].
- Do not count prospects, LOIs or verbal interest as revenue in the model. Only "LOI signed" and "repeat order" at the written volume count, per the status ladder.
- Do not contact anyone without the founder's approval (CLAUDE.md "No outreach").

## 4. Pricing policy

### 4.1 Reference prices (e-Soko, MINAGRI, national medians of the last 30 days to 2026-10-14, RWF/kg, farm-gate / wholesale / retail) [E from V records, MKT-03]

| Product | Farm-gate | Wholesale | Retail | Kigali note |
|---|---:|---:|---:|---|
| Avocado | 600 | 700 | 800 | Kigali 700 / 740 / 800; Bugesera markets about 510 |
| Passion fruit | 1,800 | 2,000 | 2,400 | Kigali 2,000 / 2,100 / 2,200 |
| Papaya | 700 | 750 | 1,000 | |
| Mango | 1,100 | n/a | n/a | |
| Tree tomato | 1,300 | 1,500 | 1,533 | |
| Goat meat | 7,250 | 8,000 | 8,500 | Live goat price base in the model: RWF 2,300/kg live weight [A AS-06] |

Caveats: e-Soko "farm-gate" looks close to the market, so a remote farm likely receives less [A, MKT-03 note]; an exporter's unit value is about USD 2/kg for avocado [E CRP-02], which is not a farm-gate price. Prices are rising fast: urban CPI +17.2% and rural +22.0% year on year in September 2026 [V MKT-15], and e-Soko avocado farm-gate rose from 400 (Jan 2025) to 600 (Oct 2026) [E]. Use USD only with the BNR rate (RWF 1,475.24/USD on 2026-10-19 [V MKT-04]).

### 4.2 Policy [A, to be ratified by the founder]

1. **The market sets the base; the farm does not set it.** Quote against the e-Soko median of the **same product, grade and market type** for the previous 4 weeks. Record the reference in the sales sheet.
2. **Floor.** No sale below the farm's full unit cost, set once the model has quoted costs (T12, T17). Until then the floor is the e-Soko farm-gate median; a sale below it needs a one-line written reason.
3. **Premium only when earned.** A price above the e-Soko wholesale median for the same grade is asked for only with a documented difference (graded size, ripeness, delivery to the door, steady supply). Premium is tested with two buyers and recorded; never assumed in the model (AS-09).
4. **Quote two ways.** Farm-gate (buyer collects) and delivered (farm delivers). The delivered price adds the actual transport cost per kg, from the farm's own delivery log.
5. **Formula contracts.** For repeat agreements: price = e-Soko Kigali wholesale median of the last 4 weeks for the grade, minus or plus a fixed margin agreed in RWF, with a floor and a ceiling, reviewed monthly. This protects both sides from inflation of the kind in MKT-15.
6. **Goats.** Quote per kg live weight at a weighing, or per head by weight band; carcass quotes only if slaughter is done at a designated facility with the fee shown [V LVS-41]. Festive demand (year-end, Eid al-Adha, about 2027-05-16/17 [E]) may support a seasonal price; the abattoir rise at year-end was about 25% in 2019 [V LVS-07]. No festive premium is promised.
7. **No hidden discounts.** Volume discounts only inside a written agreement. Rejections are credited at the rejected weight and price.
8. **Review monthly** for the first year, using the price sheet and the realised-price field in the tracking sheet.

### 4.3 Information to collect to replace these defaults

Per channel: price basis (farm-gate, wholesale, delivered), grade premium, payment days, rejection rate, collection radius. Each answer is tagged "buyer-stated" and [A] until a written order or price list exists.

## 5. Measures the founder can read every month

| Measure | Source |
|---|---|
| Buyers by ladder status (counts) | buyer register |
| Interviews completed, price rows collected | register, `prices.csv` |
| Weekly volume sold, price realised vs e-Soko reference | tracking sheet |
| Payment days (average and worst) | tracking sheet |
| Rejection rate and complaint count and age | tracking sheet |
| Share of sales to the largest buyer | tracking sheet |

## Open questions

1. Is Afri-Farmers' farmer-collection practice confirmed by the buyer, and within what distance of the farm? [U]
2. Will any exporter or aggregator take small outgrower lots from a non-cooperative private farm, at what price basis? [U]
3. Can a farm that is itself free of disease sell goats at the farm gate to a licensed abattoir buyer during a quarantine? [U, ask district veterinary officer]
4. Do hotels buy local fruit directly or through distributors such as GET IT (status unconfirmed)? [U]
5. Does the farm sell as a company or as an individual? Tax treatment of the RWF 12M turnover exemption for companies is [U, MKT-28], and it changes invoice and contract wording.
