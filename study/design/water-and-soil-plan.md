# Water and soil plan

Status: Stage 4 design · Date: 2026-10-19
Location dependency: **High.** No source, flow, soil test or parcel exists yet. Conditional by candidate zone (A Rumira/Gashora, B Muhazi, C Mugesera, D Shyira). Labels: [V] verified (source ID), [E] estimate (method shown), [A] assumption, [U] unknown. International numbers are marked and are not Rwandan expectations. Reuses LOC-, CRP-, LVS- IDs; new `DSN-` IDs are in `../registers/incoming/dsn-sources.csv`.

## 1. Findings first

1. **The water budget sets the orchard size.** A fully grown block of 105 avocado, 60 mango and 62 citrus trees (zone A, 5 ha) needs about **3,500 m³ a year** of supplementary water [E, section 3]; roofs on the farm supply about 120 m³ a year and the people and animals need about 108 m³ of that [E, section 2].
2. **Water goes to trees, not to fodder.** Irrigating Napier through the four dry months would take about 3,900 m³ per hectare [E]; fodder is rain-fed and the dry season is bridged with hay.
3. **Mango earns about 6–13 times more per cubic metre of water than avocado** at farm-gate prices [E, section 3.4]. In a dry zone with no proven water, lead with mango.
4. **At farm-gate prices, irrigated avocado barely pays for its water** from a borehole (water RWF 380–890/m³ against about RWF 640 of avocado revenue per m³) [E]. The case rests on export-linked prices and cheap water.
5. **Gate for the full orchard:** a borehole pump test of at least **3 m³/h sustained**, or an approved pond sized in section 4. Without it, plant the mango-led dry variant and the first 0.5 ha only.

## 2. Water demand: method and numbers

### 2.1 Livestock, people and the hardening bed (zone A, 5 ha, 20 does)

Method [E]: litres per day = dry-matter intake × water-to-DM ratio. Maintenance drinking is 2–3 times DM intake, lactating does 4–5 times [V LVS-27].

| Group | Calculation | L/day |
|---|---|---:|
| Doe, 70% of the year not lactating | 0.7 × (2.5 × 1.0 kg DM) | 1.75 |
| Doe, 30% of the year lactating | 0.3 × (4.5 × 1.2 kg DM) | 1.62 |
| **Doe** | | **3.37** |
| Buck share | 1/20 × 3.0 | 0.15 |
| Young on hand | 0.936 per doe × 1.1 L | 1.03 |
| **Per doe unit** | | **4.55** |

- 20 does: 20 × 4.55 × 365 = 33 m³/yr; +15% for spills and heat = **38 m³/yr**; dry-season peak about 115 L/day [E].
- House washing: 10 L/day = 3.6 m³/yr [A].
- People: 3 persons × 50 L/day = 55 m³/yr [A].
- Hardening bed and nursery: 10 m³/yr [A].
- **Total non-orchard demand ≈ 108 m³/yr** (about 0.3 m³/day; June–September about 37 m³).

100 adult goats at maintenance would need 150–330 L/day [V LVS-27]; the lean herd's 115 L/day sits within that range scaled down.

### 2.2 Orchard

Method (the Western Australian approach [DSN-03]): monthly crop water use ETc = days × ETo × Kc; net irrigation = ETc − effective rain, summed over months where positive.

| Input | Value | Label |
|---|---|---|
| Reference evapotranspiration ETo | 4.0 mm/day flat (bracket 3–5 mm/day at five Rwandan stations, 2010–2018) | [A]; source is a withdrawn student poster, grade D [DSN-05]. No station in a candidate zone. Replace with CHIRPS/ERA5 ETo for the pin |
| Crop coefficient Kc (mature avocado) | 0.6 | [A]. Review range 0.4–0.6 [DSN-02]; measured water use 2.8 (intermediate) and 3.5 mm/day (mature) in South Africa [DSN-04] would imply Kc 0.7–0.9 at ETo 4. 0.6 is a middle value; sensitivity below |
| Effective rain | 60% of monthly rain | [A] |
| Rain | CHIRPS 1991–2020 monthly means | [E LOC-34] |

Result for a mature, full-canopy avocado tree, net irrigation need:

| Zone | Annual rain (mm) | **Net need (mm/yr)** | June–Sept share | Dry-year (80% rain) | Kc 0.5 / 0.7 (sensitivity) |
|---|---:|---:|---:|---:|---|
| A Gashora | 928 | **350** | 242 mm | 432 | 245 / 474 |
| B Muhazi (mid) | 952 | **334** | 236 | 424 | 233 / 463 |
| C Mugesera (centre) | 991 | **330** | 236 | 407 | 233 / 442 |
| D Shyira | 1,224 | **221** | 180 | 304 | 144 / 326 |

Cross-check: full irrigation planning demand in the Bugesera/Akagera master plan is 4,000–6,000 m³/ha/yr [V LOC-20]; supplementary need of 3,500 m³/ha at zone A (350 mm × 10) sits below it because rainfall carries part of the load [E].

Volume per tree = net mm × canopy ground area (m²) / 1000. Canopy area grows with age [A]:

| Tree age (year) | 1 | 2 | 3 | 4 | 5 | 6 | 7+ |
|---|---:|---:|---:|---:|---:|---:|---:|
| Canopy area (m²), capped at spacing area | 2 | 5 | 13 | 22 | 35 | 48 | 64 |

| Crop (zone A, m³ per tree per year) | Y1 | Y2 | Y3 | Y4 | Y5 | Y6 | Y7+ | Rule |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| Avocado (64 m²) | 0.70 | 1.75 | 4.6 | 7.7 | 12.3 | 16.8 | **22.4** | full ETc |
| Mango (100 m²) | 0.70 | 1.75 | 4.6 | 2.3 | 3.7 | 5.1 | **6.7** | full ETc to year 3; then 30% (deficit; **no water before and at flowering**: a dry spell of 3+ months is needed) [CRP-34; A] |
| Citrus (36 m²) | 0.70 | 1.75 | 4.6 | 7.7 | 12.3 | 12.6 | **12.6** | full ETc |

Orchard totals, zone A, 5 ha, all trees planted in one year (worst case) [E]:

| Variant | Trees (avocado / mango / citrus) | Y1 | Y2 | Y3 | Y4 | Y5 | Y6 | **Mature (Y7+)** |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| A with proven water (avocado 45%, mango 40%, citrus 15% of Z2 = 1.5 ha) | 105 / 60 / 62 | 159 | 398 | 1,034 | 1,426 | 2,269 | 2,851 | **3,540** |
| A without proven water (avocado 25%, mango 65%, citrus 10%) | 58 / 97 / 42 | 138 | 345 | 897 | 995 | 1,583 | 1,995 | **2,483** |
| B (avocado 60%, mango 15%, citrus 20% of 1.75 ha) | 164 / 26 / 97 | 201 | 503 | 1,307 | 2,072 | 3,297 | 4,113 | **5,076** |
| C (avocado 45%, mango 35%, citrus 10%, papaya garden excluded) | 123 / 61 / 49 | 163 | 408 | 1,061 | 1,467 | 2,334 | 2,995 | **3,787** |
| D (avocado 70 trees, net need 221 mm; passion fruit and tree tomato not modelled) | 70 / 0 / 0 | 49 | 123 | 319 | 540 | 858 | 1,177 | **1,570** |

All figures m³/yr. A mature hectare of avocado at 156 trees needs 3,500 m³, of mango (100 trees, deficit regime) 670 m³, of citrus (278 trees) 3,500 m³ [E].

**Sensitivity:** Kc 0.5 lowers these by about 30%; Kc 0.7 raises them by about 35%; a dry year raises them by about 23% [E from the table above]. Passion fruit, tree tomato and papaya need more water than this and are not sized here [U].

### 2.3 Fodder

Napier (Kc about 0.9 [A]) through the dry months: net need 389 mm for June–September in zone A, or 3,890 m³/ha [E]. Not irrigated. Fodder yields in `feed-and-pasture-plan.md` assume rain only.

### 2.4 Total picture, zone A, 5 ha

| Item | m³/yr |
|---|---:|
| People, animals, hardening bed | 108 |
| Orchard Y1 (all planted) | 159 |
| Orchard Y3 | 1,034 |
| Orchard mature (proven-water variant) | 3,540 |
| Rain falling on the 5 ha | 46,400 |
| Mature orchard need as a share of that rain | 7.6% |

## 3. Preliminary water balance per zone

### 3.1 Roofs

Volume = roof area × rainfall × runoff coefficient − first flush [E]. Coefficient 0.8 for corrugated sheet (quoted ranges 0.7–0.95; standards disagree) [DSN-06]; first flush 1.0 mm per event on 60 events a year (0.4–1.0 mm is the usual rule, and rules of thumb can underestimate the flush in rural settings) [DSN-07, international] [A].

| Zone | Rain (mm) | Gross runoff per 100 m² roof (m³/yr) | Roof area for the non-orchard demand (m²) | Annual supply from it (m³; dry year at 80%) | Tank for the dry season (m³) |
|---|---:|---:|---:|---|---:|
| A | 928 | 74 | **180** | 123 (98) | 30 (45 dry-year buffer) |
| B | 952 | 76 | 170 | 119 (95) | 30 (55) |
| C | 991 | 79 | 160 | 117 (94) | 30 (60) |
| D | 1,224 | 98 | 120 | 110 (88) | 20 (70) |

Tank size is the smallest volume that never empties in a normal year when it starts full at the end of May and refills from the rains, with demand flat at 108 m³/yr [E, simulation of monthly CHIRPS rain]. The roof area is the sum of the animal house (33 m²), feed and hay store (30–40 m²), the dwelling/store (about 100 m²), plus a rain-collecting shade roof [A]. In an 80%-rain year the 45 m³ tank still falls short by 4 m³ in zone A and 8–20 m³ in B–D, to be bought in or saved by cutting use [E]. **Model STORAGE: 30 m³ base, 45 m³ downside.**

### 3.2 Beyond roofs: what the orchard needs

Orchard demand is 150–400 m³ in years 1–2 and 1,000 m³ by year 3 (zone A), several times the surplus from roofs, which is zero by design. So the orchard needs its own source. Options in section 4. Rule:

**Orchard hectares planted ≤ (water supplied in the dry season) / (net mm × 10 × crop factor).** Planting is phased by measured supply (integrated design section 6).

### 3.3 Farm-scale harvesting

Rain on 5 ha is 46,400 m³ (zone A). Capturing and storing 5% of it (2,320 m³) would cover the mature orchard's dry-season need, but that is a pond-and-catchment project, not a roof project. Soil-moisture storage (mulch, basins, swales, section 6) is the first and cheapest "tank" [A].

### 3.4 Revenue per cubic metre

Mature zone A block, farm-gate prices, planning yields [E]:

| Crop | Trees | Water m³/yr | Revenue basis | Revenue RWF/yr | RWF per m³ |
|---|---:|---:|---|---:|---:|
| Avocado | 105 | 2,350 | 24 kg × RWF 600/kg (national e-Soko median, [MKT-03]; 573 FAO [CRP-16]) | 1.5M | **~640** |
| Mango | 60 | 404 | 50 kg × RWF 500–1,100/kg ([CRP-09] vs [MKT-03]; farmer-reported yield halved [CRP-09]) | 1.5–3.3M | **3,700–8,200** |
| Lemon | 62 | 780 | yield [U] | [U] | [U] |

Water cost [A, model placeholders]: borehole + pump RWF 12.5M over 15 years plus 4% a year repairs ≈ RWF 1.3M/yr; at 3,540 m³ ≈ **RWF 380/m³**; at 1,500 m³ ≈ **RWF 890/m³**. For scale, the state Gabiro scheme bills RWF 277/m³ [V CRP-57], not comparable with a farm borehole. Conclusion: avocado is marginal on this water at national farm-gate prices; mango clears it by 4–20 times [E]. Export-linked prices (about RWF 3,000/kg unit value [CRP-P26]) would change avocado's case; farm-gate is what a small farm earns unless it joins an out-grower scheme [CRP-20].

## 4. Sources compared

| Source | Capacity and fit | Law and permit | Cost basis (model placeholders [A]) | Risks | Verdict |
|---|---|---|---|---|---|
| **Roof rainwater + tank** | 100–125 m³/yr from 160–180 m²; enough for people, animals, hardening bed | Probably no abstraction permit (own roofs); confirm. Livestock and farm water supply generally needs a Water Resources Board permit regardless of volume [V LOC-04, LOC-08]; whether own-roof harvesting counts is [U] | Tank RWF 100,000/m³ (30 m³ = RWF 3.0M); gutters RWF 0.3M | Dry year 20% short; first-flush quality | **Yes, always** |
| **Storage pond with ground catchment** | e.g. 1,000 m² of compacted or lined catchment at runoff coefficient 0.5 [A] gives about 460 m³/yr in zone A; a 200–300 m³ lined pond holds one year's worth for the first 3 years' orchard | A farm pond may be a "water storage dam" for ESIA (no size limit stated) and needs a permit [V LOC-05, LOC-04]; threshold [U] | **[U] quote** (tank price would make 300 m³ = RWF 30M, so it must be a lined earth pond) | Evaporation, siting, silt, safety; within the EIA gate | **Probable orchard source for years 1–3; get two quotes and the permit answer before committing** |
| **Borehole + solar pump** | 3,540 m³/yr mature needs **≥ 3.1 m³/h for 6 h/day over 190 irrigation days** (3,540 / 190 = 18.6 m³/day) [E]; yield unknown | Drilling and use need a permit; RWF 35,000, up to 90 days, validity up to 15 years; meters if irrigation > 10 ha [V LOC-04] | BORE RWF 9M (7–12M) + PUMP RWF 3.5M; Rwandan benchmark: a 160 m solar borehole with a 1.3 km pipeline cost RWF 80M for an 18 ha dairy farm (RWF 49M subsidy), not a goat-farm quote [V LVS-62] | Hydrogeology unknown [U]; dry hole = write-off | **Gate for the full orchard.** Buy a pump test or neighbours' evidence first; Gashora lake cluster water is boreholes, rainwater or the planned Gashora scheme [V LOC-20] |
| **Lake (with permit)** | Small Bugesera lakes store little and are ringed by declared swamps; Muhazi flows low in June–August [V LOC-46, LOC-13] | Infrastructure in a lake or any pump needs a permit; intake inside the 50 m strip also needs the Minister's authorisation after an EIA; no animals at the lake [V LOC-04, LOC-01] | Pump + pipe through the strip [U] | Not dependable in zone A; flood-line setback; water quality for livestock and fruit food safety [A] | **Not a primary source**; reconsider for B or C after the flood-line survey |
| **Scheme or piped supply** | Planned Gashora scheme [LOC-20]; RWF 277/m³ at Gabiro [CRP-57] | Subscription | Per m³ | Availability [U] | Ask the district; may beat a borehole |
| **Trucked water** | Emergency only | – | Price [U] | Roads unpaved (zone A national road unpaved, rainy-season passability [U]) | Contingency for a dry year |

**Decision gate G-W:** before the second orchard block, one of: (a) a borehole pump test ≥ 3 m³/h sustained for 24 h with an acceptable water-quality result; (b) a permitted, quoted pond whose volume ≥ 70% of that year's dry-season orchard need; (c) a scheme connection.

## 5. Drip or manual

Manual watering capacity: one worker carries about 30 cans of 20 L per hour for 2 hours a day, 2,400 L/day × 122 dry days ≈ **290 m³ per dry season** [A].

| Orchard year (zone A, proven variant) | Need (m³) | Method | Reason |
|---|---:|---|---|
| Y1 | 159 | Hose from a header tank or cans to a basin per tree | Within manual capacity (about 0.55 worker-season); drip would cost far more per tree |
| Y2 | 398 | Cans plus hose; start drip on the avocado/citrus rows | Beyond manual capacity |
| Y3 onward | 1,034+ | **Gravity or solar-pump drip on avocado and citrus only** | 51,700 cans (~14 h/day) is not workable |
| Mango | mature 6.7 m³/tree | Basin watering, not drip, in the deficit regime | Low volume |

Drip capital [A]: DRIP RWF 3.5M per hectare. Applied to the avocado and citrus area only (0.90 ha of 1.5 ha) it is RWF 3.15M instead of 5.25M for all of Z2: set DRIPON to 0.6. The SSIT scheme pays 50–75% of list price on approved equipment, but transport and installation are not covered, and eligibility of this farm is [U] [V CRP-35]. Supplier route: Davis & Shirtliff (five branches) or Holland Greentech (Rivulis drip) [V CRP-49, CRP-50]. Scheduling converts mm/day to run hours from dripper flow and spacing [DSN-14, supplier method]. Check pressure and filter with the installer.

Mulching 10 cm around each tree and basin planting cut the net need; not counted in the figures above [A].

## 6. Metering and leak detection

1. **Meters** (totalising, with a bypass): at the tank outlet (people and animals), at the pump or borehole, and at the orchard head, plus a sub-meter on the livestock line. Cost about RWF 0.15M for four plus a pressure gauge [A, get quotes]. The permit requires meters only for irrigation above 10 ha and domestic supply, and an annual water-use report [V LOC-04 Art 12]; fit them anyway.
2. **Weekly reading**: write the four readings and the rain gauge value. Compare metered use with the section 2 plan; a variance above 15% for two weeks triggers inspection [A].
3. **Night test**: with every tap closed, read the meter at dusk and dawn; any change is a leak.
4. **Drip block check**: expected flow = emitters × L/h (for 105 trees × 4 emitters × 2 L/h = 840 L/h [A]); more than 5% above expectation means a leak; lower means a blocked filter or emitter.
5. **Tank**: float valve; level mark; overflow routed to a swale, not to the house or the lake.
6. **Walk the lines** weekly in the dry season; repair the same day.
7. **Rain gauge** on the farm from day 1: this farm's own rainfall is the best input for every number in this file.

## 7. Soil-health and regenerative strategy

### 7.1 What is known and unknown

- National: about 75% of soils have pH below 5.5, phosphorus is very low, and potassium is very low in Mayaga–Bugesera [V LOC-20]. RAB estimated 213,446 ha of acidic soil needing about 533,615 t of lime a year [DSN-12, 2021, older than 5 years].
- Satellite grid estimates (SoilGrids, 250 m): Ferralsols and Acrisols, pH 5.5–6.1, clay 33–38% in zone A; pH 5.9–6.0, clay 38–41% in B; pH 5.5–5.9 in C [E LOC-37]. **Not a site measurement.**
- D: not assessed [U].

### 7.2 Testing plan (model SOIL_N 8, WATER_N 3)

| What | Where and how | When |
|---|---|---|
| Composite soil samples, 0–20 and 20–40 cm | One per management unit: 2 orchard blocks, 3 for Z3 (paddocks, fodder bank, nursery bed), 1 base, 2 spares = 8 | Dry season, before planting |
| Drainage pits | One 60 cm test hole per orchard block; fill with water and record the drop | Before planting avocado |
| Analyses | pH, organic carbon, texture, P, K, Ca, Mg, Al, CEC, EC (plus micronutrients if the lab offers) | Lab [U]; RwaSIS gives UPI-based recommendations [V LOC-49] |
| Water | Domestic/livestock source: pH, EC, nitrate, E. coli; irrigation source: EC, sodium | Before use; yearly |
| Compost | N, P, K, EC, maturity | Each batch in year 1 |
| Repeat | Same sites in year 3 | Compare organic carbon, pH, P, K |

Costs: SOIL RWF 30,000 × 8 = RWF 0.24M; WATER RWF 45,000 × 3 = RWF 0.135M [A, labs [U]].

### 7.3 Compost and manure

See `integrated-farm-design.md` section 3: 2.4 t DM/yr of collectable manure from 20 does; compost hot (55 C or more for 3 days, turned) with C:N 25–30:1 and moisture 40–65% [DSN-08, DSN-09, international]; test before dosing; priority to tree holes and mulch.

### 7.4 Mulch and cover crops

- **Mulch**: 10 cm of cut grass in basins around young trees, collar clear; refresh each dry season [A].
- **Alley cover**: lablab (650–3,000 mm; legume; stems poorly eaten) between young tree rows in the first rains, cut and left as mulch [V LVS-20; A]; keep it off the tree line.
- **Livestock-free**: no goats in cover crops inside orchards (rule P6).
- **Fodder bank**: Napier rows with legume hedges (Calliandra, Gliricidia); Desmodium in zone D [V LVS-21, LVS-23, LVS-19].

### 7.5 Contours, erosion and the lake

- Mark the contour with an A-frame or line level before planting; **tree rows, fodder strips and paddock fences follow it** [A].
- Hedgerows (Calliandra, Gliricidia, Napier strips) every 15–25 m of slope as erosion barriers [A]; grassed waterways for concentrated flow.
- Planting basins or half-moons on slopes; swales for harvesting rain (shallow, level, grass-planted, away from foundations).
- Keep the 50 m lake strip and the swamp buffer vegetated; planting inside is only to restore damaged land or control erosion, natural vegetation is kept [V LOC-01].
- Compost pad, animal house and fodder silage clamps drain away from the lake and any stream [A].
- Check slope and gullies on the site visit (zone B land rises to 1,550–1,800 m within 3 km) [E LOC-36].

### 7.6 Integrated pest management (IPM) [A, to confirm with a RAB agronomist]

| Pest or disease | Evidence | Non-chemical first step |
|---|---|---|
| Avocado root rot (Phytophthora) | Most severe fungal disease on poorly drained soil (international) [CRP-44] | Drainage test, mounds, mulch, never plant in waterlogged hollows |
| Fruit flies (mango, citrus) | Traps hard to access; reduced mango harvests in Rwanda [CRP-09, CRP-60] | Traps, orchard hygiene (remove fallen fruit), harvest on time |
| Mango "strange diseases" | Reported; NAEB says controls exist [CRP-60] | Scout monthly; ask RAB; record |
| Citrus greening and fruit-fly status | Not found for Rwanda [U] | Buy clean grafted stock; scout |
| Passion fruit woodiness virus (zone D) | [V CRP-33] | Certified plants only |
| Banana Xanthomonas wilt | [V CRP-53] | Not planted as a cash crop |
| Worms (livestock) | Livestock plan section 8 | Cut-and-carry feeding, paddock rest |

Rules: scout monthly; record; chemicals only on advice, with protective gear, never within 50 m of the lake or a stream or at flowering (bees; avocado needs pollinators [DSN-01]); no chemical farming in the wetland [V LOC-05]. Plant flowering margins and keep native vegetation in Z5 for pollinators and natural enemies [A].

### 7.7 Liming where needed

Only on a test: if the 0–20 cm pH is below about 5.0–5.5 for the planned crop, liming is considered [A; the pH 5.5 trigger was not found in a RAB document, DSN search]. Avocado prefers pH 5.5–6.5 and NAEB gives 5–7 [CRP-34, CRP-44]. Evidence on rates is thin: a 2012 trial in Burera (highland north) found 2.8 t/ha of local unburnt lime raised pH by about 0.62 units [DSN-13]; the national subsidy figures divide to about 2.5 t/ha [DSN-11, a calculation, not a recommendation]. **The lab recommendation decides the rate.** Whether a private farm in the Eastern Province can buy subsidised lime is [U]. Zone A–C grid pH of 5.5–6.1 suggests no liming need [E LOC-37]; to be confirmed.

### 7.8 Responsible fertiliser

1. Compost first; mineral fertiliser only to close a soil-test gap.
2. Quantities for costing: 0.25 kg urea-equivalent per planting hole and 0.5 kg per tree per year in years 1–3 [A, CRP quantity], priced at the subsidised farmer price of at most RWF 1,090/kg (retail RWF 1,980/kg) [V CRP-46]. For 156 trees/ha this is about RWF 85,000/ha/yr in years 1–3, much less than the model's FERT of RWF 700,000/ha [E, A]. Raise it with tree age and soil tests; ask an agronomist for a programme.
3. Split doses; none on waterlogged soil or before heavy rain; none within 50 m of the lake; keep a record.
4. Eligibility of a private or company-held farm for the subsidy (Smart Nkunganire registration with ID and parcel number) is [U] [V CRP-46].
5. Phosphorus is very low nationally [V LOC-20]; plan for a P source (compost, rock phosphate, DAP at the subsidised price) on test evidence [A].

### 7.9 Soil-carbon and biodiversity

- Baseline organic carbon in year 0; remeasure in year 3.
- Keep Z5 and the boundary as habitat; no burning.
- Record earthworm counts or the visual soil-structure score at sampling time [A].

## 8. Inputs for the financial model

| Model ID | Current (M1 / M2 / M3) | Recommended | Note |
|---|---|---|---|
| STORAGE | 10 / 20 / 40 m³ | **30** (45 downside) | roofs 160–180 m²; orchard source separate |
| GUTTER | RWF 0.3M | keep | |
| TANK | RWF 100,000/m³ | keep, get quotes | |
| BOREHOLE | 0 / 0 / 1 | **0 until a pump test ≥ 3 m³/h** | then BORE ± PUMP; do not assume |
| SOLARPUMP | 0 / 1 / 1 | **1** | lift to header tank |
| DRIPON | 0 / 1 / 1 on the whole of Z2 | **0.6** (share of Z2: avocado + citrus only) | |
| New item: orchard water source (pond or other) | not in the model | add a placeholder line **[U] quote** | |
| New item: meters and gauge | not in the model | **RWF 0.15M** [A] | |
| SOIL_N, WATER_N | 6 / 8 / 10 ; 2 / 3 / 4 | **8 ; 3** | |
| NURSERY | 0 / 0.3M / 0.8M | **0.1M** (hardening bed) | |
| FERT | RWF 700,000/ha | **replace with a soil-test-based programme; ~0.1M/ha/yr in years 1–3 as a proxy** | [A] |

## 9. Gaps

1. No site, flow, yield or quality test of any water source; no pump test; hydrogeology [U].
2. ETo is a bracket from a withdrawn student poster; Kc 0.5–0.9 for Rwandan avocado is unmeasured. Replace with site data and a rain gauge.
3. Whether a farm pond triggers an ESIA, and whether livestock-water supply from own roofs needs a permit [U, LOC-04, LOC-05].
4. Lab availability and prices in Rwanda for soil and water tests [U].
5. The current RAB liming threshold and whether the subsidy reaches this farm [U].
6. Mango and lemon water coefficients are assumed, not sourced.
