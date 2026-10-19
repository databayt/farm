# Feed and pasture plan

Status: Stage 4 design · Date: 2026-10-19
Location dependency: **High.** Conditional by candidate zone. Labels: [V] verified (source ID), [E] estimate (method shown), [A] assumption, [U] unknown. International values (Tropical Forages, Feedipedia) are named as international and are never offered as Rwandan expectations.
Reuses LVS-, LOC-, CRP-, MKT- IDs; new `DSN-` IDs are in `../registers/incoming/dsn-sources.csv`.

## 1. Summary

- Feed is the binding limit on herd size. With forage yields in the range supported by Rwandan trials (4–8 t DM/ha/yr for rain-fed pasture [A from LVS-15, LVS-16]) and cut-and-carry fodder at 8–18 t DM/ha, **5 ha supports about 20 breeding does at 75% of capacity** [E, sections 3–4].
- The existing model inputs (PAST_Y 9, FOD_Y 18, 40–60 does) are the *high* case. At the mid case the model herds would buy 25–55% of their feed [E, section 6].
- A third of the herd's annual feed falls in the four dry months in zone A [E LOC-34], so **a dry-season reserve of about 3 t DM (0.15 t per doe) is part of the design**, not an extra.
- **Establish feed first, test small, then stock.** A one-year trial of three or four species on 100 m² plots replaces the placeholder yields.

## 2. Species by zone

Yields in the table are Rwandan trial figures where they exist and are not safe for stocking-rate arithmetic (1 m² quadrats in 6 m² plots, first cuts at 90 days) [V LVS-15, LVS-16]. International values are marked.

| Species | Zones | Role | Evidence | Cautions |
|---|---|---|---|---|
| **Brachiaria hybrids** (Mulato II, Cayman) | A, B, C (lowland D margins only) | Paddock grass | Preferred by Bugesera farmers for drought tolerance, though first-cut yield was only 3.0 t DM/ha (Marandu 9.8, Basilisk 9.4, Piata 6.7, MG-4 6.5) [V LVS-15, LVS-16]; Cayman sown down to 800 mm (international) [V LVS-25]; slips or stolons work [V LVS-25] | Suspected saponin poisoning in Boer goats fed 'Mulato' hay [V LVS-25]; sheep more susceptible, deaths reported on *B. decumbens* (Brazil) [V LVS-43]. **Keep any one grass under 50% of the diet; no pure *B. decumbens* for sheep** [A, vet to confirm] |
| ***B. brizantha*** (Marandu, Piata) | A, B, C | Paddock and hay | Highest 90-day yields in Bugesera [V LVS-15] | As above |
| **Napier (*Pennisetum*)** | all zones; best B, C, D | Cut-and-carry fodder bank | Available all year, scored highest by Bugesera farmers; 9.2 t DM/ha at the first 90-day cut [V LVS-15, LVS-16]; 2–10 t DM/ha/yr unfertilised (international) and favoured above 1,500 mm [V LVS-52]; RAB produced 100,000 cuttings in 2019/20 [V LVS-50] | Below its optimum in A (927 mm); Napier stunt: Rwandan data not found [U] |
| ***Chloris gayana*** (Rhodes) | A, B, C | **Hay** | Survives a six-month dry season; up to six cuts of 25–50 days; cut at or before flowering (international) [V LVS-18]; RAB produces seed [V LVS-50] | Fluffy seed is hard to sow; not for silage [V LVS-18] |
| ***Setaria sphacelata*** (Nandi) | D | Paddock and silage | Sown above 1,000 mm; 10–15 t DM/ha common (international) [V LVS-24] | Oxalate caution; no Rwandan source found [U LVS suppliers] |
| ***Desmodium intortum*** | D | Legume with grass in cut-and-carry | Upland tropics above 800 mm; 12–19 t DM/ha recorded (international) [V LVS-19]; RAB produces seed [V LVS-50] | Tannins; low grazing tolerance |
| **Lablab** | all | Annual legume cover and fodder (also soil cover) | 650–3,000 mm; leaf CP 21–38% (international) [V LVS-20] | Stems poorly eaten |
| ***Calliandra calothyrsus*** | A (near water), B, C, D | Protein browse, hedgerows on contour | 700–4,000 mm; supplement at 20–40% of the diet; Bugesera nurseries gave out 20,734 plants in 2019 [V LVS-21, LVS-50] | Not for direct heavy grazing |
| ***Gliricidia sepium*** | A, B, C | Living posts and browse | Wilt 12–24 h before feeding; ruminants must learn it; 18,118 distributed in Bugesera in 2019 [V LVS-23, LVS-50] | Stakes 1.5 m |
| ***Leucaena*** | A, C only (stops growing at 15–16 C) | Protein browse | Good drought tolerance [V LVS-22] | Mimosine: not above 30% of the diet [V LVS-22] |
| ***Alnus acuminata*** | D | Shade/browse/pole tree | Nitrogen-fixing, used with pasture grasses [V CRP-55] | Weak against weeds as a seedling |
| Crop residues, banana leaves | all | Filler | Common practice [V LVS-62, LVS-64] | Quality low |

Feed quality at 90 days: crude protein 137 g/kg DM for Mulato II and 167 g/kg for Piata [V LVS-17]. Goats need roughly 7% CP at maintenance, 10–16% when growing, about 12% in pregnancy and up to 20% in early lactation [V LVS-27], so grass at 90 days meets maintenance and mid-pregnancy; lactating does need legume browse or hay-plus-leaf supplement [E].

### 2.1 Planting material and establishment

- **Planting material**: seed supply is thin; RAB sells forage seed on IremboGov (price by type and amount, 7 days, pick-up at a RAB station), but the application asks for an RCVD licence number [V LVS-60], so eligibility of a farm is [U]. Plan vegetative planting: Napier stem cuttings (3+ nodes), *Brachiaria* slips or stolons, Gliricidia stakes [V LVS-25, LVS-52, LVS-23].
- **Rates (international)**: Mulato II seed 4–6 (to 10) kg/ha [V LVS-25]; Chloris 0.5–1 kg/ha [V LVS-18]; lablab 12–20 kg/ha alone [V LVS-20]; Gliricidia 4,000–10,000 stakes/ha [V LVS-23].
- **Season**: plant in the March–May rains; first usable cut about 90 days later (the model's READY = 5 months is consistent) [V LVS-15].
- **Cost** [A, model PAST_EST RWF 450,000/ha, FOD_EST RWF 700,000/ha]: zone A at 5 ha = 1.44 ha × 450,000 + 0.96 ha × 700,000 = RWF 0.65M + 0.67M = **RWF 1.3M**.
- **Trial plots (year 1)**: three or four species × 100 m² each (≈ 0.04 ha total): Mulato II, Marandu or Piata, Napier, Chloris (zone D: Setaria, Napier, Desmodium). Cut at 90 days; clip 1 m² quadrats; weigh fresh; dry a sub-sample; **t DM/ha = kg DM per m² × 10**. Repeat at every cut for 12 months. Output: the farm's own PAST_Y and FOD_Y.

## 3. Stocking-rate method (dry-matter balance)

Parameters are the model's, set to the recommended local-goat values [A] (changes listed in section 8).

**Step 1. Demand per breeding-doe unit per year** (doe + her share of buck + young on hand)

D = 365 × [ (1 + 1/R) × DMI_A + k × (9/12) × DMI_Y ]

with R = 20 does per buck (RATIO 20), DMI_A = 1.0 kg DM/day, DMI_Y = 0.45 kg/day, and k = kids weaned per doe per year = PART × LIT × (1 − YMORT) = 1.2 × 1.3 × 0.80 = 1.248 (kids are sold at 9 months, so each is on hand 9/12 of a year).

D = 365 × [ 1.05 × 1.0 + 1.248 × 0.75 × 0.45 ] = 365 × [ 1.05 + 0.421 ] ≈ **535 kg DM per doe unit per year** (the earlier 534 used 1.04 for the buck share at 1:25). Goats eat 2.5–3.5% of body weight as DM [V LVS-26]: 28 kg × 3.5% = 0.98 kg, which supports DMI_A = 1.0 for lactating local does [E]. With the model's own DMI_A 1.1 and DMI_Y 0.6, D would be 622 kg [E].

**Step 2. Usable (eaten) DM per hectare of Z3**

S = (1 − f) × P × g + f × F × c

f = fodder share of Z3 (0.40), P = PAST_Y, g = GRAZE (0.60), F = FOD_Y, c = CUT (0.80).

| Case | P (t DM/ha/yr) | F (t DM/ha/yr) | Eaten from paddock (P × 0.6) | Eaten from fodder (F × 0.8) | **S (f = 0.4)** | Does per Z3 ha at 100% |
|---|---:|---:|---:|---:|---:|---:|
| Low [A] | 4 | 8 | 2.4 | 6.4 | **4.0** | 7.5 |
| Mid [A] | 6 | 12 | 3.6 | 9.6 | **6.0** | 11.2 |
| High (= model base) | 9 | 18 | 5.4 | 14.4 | **9.0** | 16.8 |

Basis for P and F: Rwandan plot trials 1.2–5.7 t DM/ha per two-month cut are not annualised [LVS-16]; the planning range 4–8 t DM/ha/yr for rain-fed semi-arid pasture [A] comes from the livestock research note and unfertilised Napier 2–10 t/ha/yr internationally [V LVS-52]. Mid is the planning case; High needs fertility, early cutting and some irrigation to be proved.

Zone D (1,190–1,230 mm, no year below 900 mm [E LOC-34]): P 8, F 15 → S = 0.6 × 4.8 + 0.4 × 12.0 = **7.7** t/ha [A].

**Step 3. Capacity and stocking**

Capacity (does) = Z3 area × S / D. **Stock at 75% of Mid capacity**: the other 25% covers dry years, hay making and the ramp-up.

| Farm | Z3 (ha) | Mid capacity | 75% (planned) | Model-ready value |
|---|---:|---:|---:|---:|
| A, 2 ha | 0.96 | 10.8 | 8.1 | **8** |
| A, 5 ha | 2.40 | 26.9 | 20.2 | **20** |
| A, 10 ha | 4.80 | 53.9 | 40.4 | **40** |
| B and C, 2 ha | 0.86 | 9.6 | 7.2 | **7** |
| B and C, 5 ha | 2.15 | 24.1 | 18.1 | **18** |
| B and C, 10 ha | 4.30 | 48.2 | 36.1 | **36** |
| D, 5 ha (units: goat does + ewes) | 2.40 | 34.5 | 25.9 | **26** (16 + 10) |

**Step 4. Check against the land bought-feed line** (section 6) and the monthly balance (section 5).

### 3.1 Land needed per herd size

Z3 hectares for N breeding does at 75% stocking = N × 535 / (0.75 × S × 1000):

| N does | Low (S = 4.0) | Mid (6.0) | High (9.0) |
|---:|---:|---:|---:|
| 8 | 1.4 | 0.95 | 0.63 |
| 10 | 1.8 | 1.2 | 0.79 |
| 15 | 2.7 | 1.8 | 1.2 |
| 20 | 3.6 | 2.4 | 1.6 |
| 25 | 4.5 | 3.0 | 2.0 |
| 30 | 5.3 | 3.6 | 2.4 |
| 40 | 7.1 | 4.8 | 3.2 |
| 60 (model M3) | 10.7 | 7.1 | 4.8 |

Reading: on a 5 ha farm with 2.4 ha of Z3, 20 does fit the mid case and a 40-doe herd needs the High case **plus** 2 ha more in Z3 than the lean design gives it [E].

## 4. Paddock layout logic (zone A, 5 ha as the worked case)

- **Hub-and-spoke**: house, tank, trough and handling crate at the centre (but ≥ 200 m from the lake bank, rule P3); the fodder bank and paddocks fan out from it so animals and cut fodder travel short distances.
- **Fodder bank (0.96 ha)**: contour strips of Napier with Calliandra or Gliricidia hedge rows between strips (also the erosion barrier, water plan section 6); cut in rotation, **never grazed**; fenced so goats cannot enter.
- **Paddocks (1.44 ha)**: 8 paddocks of 0.18 ha (for example 30 × 60 m). Number of paddocks N = rest period / grazing period + 1 = 35 / 4.5 + 1 ≈ 8 [A]. Wet-season rest 30–35 days; the dry-season rest is longer (60+ days) and the herd moves to fodder and hay at the house [A].
- **Grazing period** of 4–5 days per paddock is also the parasite-control reason (animals move before the larvae picked up on the pasture return), and the vet should confirm it [A].
- **Check**: usable standing DM at grazing entry about 1.5 t DM/ha × 0.5 utilisation = 0.75 t/ha → 0.18 ha gives 135 kg. In the wet season the herd takes about half its intake from grazing: 0.5 × 30.6 kg/day = 15 kg/day × 4.5 days = 69 kg per paddock visit, i.e. 51% of what the paddock offers [E]. The paddocks therefore grow more than the herd eats in the wet season: **the surplus is cut as hay and silage**, which is where the reserve in section 5 comes from.
- **No grazing**: wet low ground, the swamp and lake strips (rule P4), orchard blocks (rule P6).
- **Shade and water**: boundary trees and a shade shelter on the spokes; a trough in each of two paddock clusters, piped from the tank.
- **Fence**: IFENCE_M 250 m per ha of Z3 [A]. For 2.4 ha that is 600 m: 3 internal dividers of 60 m + 1 of 120 m, plus the outer paddock-block fence (360 m of which about half is shared with the boundary) [E].
- **Rotation record**: paddock, in and out dates, residual height; adjust the paddock number rather than the stock when growth changes.

## 5. Dry-season balance and reserves

Method [E]: monthly forage growth weight = 0.5 × rain(month) + 0.5 × rain(month − 1) from the CHIRPS means [E LOC-34], floored at 3% of the mean growth; the annual eaten supply (Z3 × S) is distributed by that weight; demand is flat (20 does × 535 kg / 12 = 0.89 t/month). In surplus months 50% of the surplus is cut and stored at 70% efficiency (CONSERVE 0.5, CONS_EFF 0.7).

Zone A, 5 ha, 20 does, Mid case (t DM eaten):

| Month | Supply | Demand | Balance | Into store | From store | Store at month end |
|---|---:|---:|---:|---:|---:|---:|
| Jan | 1.30 | 0.89 | +0.41 | 0.14 | 0 | 0.88 |
| Feb | 1.16 | 0.89 | +0.27 | 0.10 | 0 | 0.97 |
| Mar | 1.59 | 0.89 | +0.70 | 0.25 | 0 | 1.22 |
| Apr | 2.23 | 0.89 | +1.34 | 0.47 | 0 | 1.69 |
| May | 1.81 | 0.89 | +0.92 | 0.32 | 0 | 2.01 |
| Jun | 0.74 | 0.89 | −0.15 | 0 | 0.15 | 1.86 |
| Jul | 0.16 | 0.89 | −0.73 | 0 | 0.73 | 1.14 |
| Aug | 0.18 | 0.89 | −0.71 | 0 | 0.71 | 0.42 |
| Sep | 0.49 | 0.89 | −0.40 | 0 | 0.40 | 0.02 |
| Oct | 1.19 | 0.89 | +0.30 | 0.11 | 0 | 0.13 |
| Nov | 1.85 | 0.89 | +0.96 | 0.34 | 0 | 0.47 |
| Dec | 1.69 | 0.89 | +0.80 | 0.28 | 0 | 0.75 |

(Steady state, after two passes of the year.)

Results [E]:
- The dry-season gap in a mid-case year is **2.0 t DM** (June–September: 0.15 + 0.73 + 0.71 + 0.40 = 1.99). The 50% conserve share just covers it with the store at zero in September.
- **Dry year** (−30% growth): shortfall 1.9 t DM (July–October). **Low-yield year** (S = 4.0): shortfall 2.2 t.
- Bought feed to close those years: 1.9–2.2 t × RWF 220/kg DM = **RWF 0.4–0.5M** [A; price from the model's FEED_COST]. About 8 in 30 years had rain below 800 mm at Gashora [E LOC-34]; the June–August 2026 dry spell scorched Eastern Province pasture [V LVS-13].
- **Design reserve: 3 t DM at the end of May for 20 does in zone A** (0.15 t per doe), about 3.4 t of hay at 88% DM; zones B and C 0.12 t per doe, zone D 0.09 t per doe-unit (computed the same way, 1.5 times the mid-year gap) [E].
- The mid-year surplus is 5.7 t DM (the sum of the positive months). To store about 3 t at 70% efficiency, about 4.3 t (75% of that surplus) must be cut and dried, so use CONSERVE 0.7 in zone A (model base 0.5, upside 0.7).

**Hay and silage**: *Chloris gayana* and *Brachiaria* hay cut at or before flowering (up to six cuts of 25–50 days; international) [V LVS-18]; RAB baled 58 t of such hay in 2019/20 and sold some to private farms, price unknown [V LVS-50; U]. Silage and bag silage from sorghum, maize or bean straws, desmodium and Calliandra leaves are taught by RAB in Kayonza, for dairy cattle [V LVS-64]; Rwandan goat practice, costs and losses are [U]. Setaria suits hay and silage; Chloris is not for silage [V LVS-24, LVS-18]. Storage: a roofed, ventilated bay in the feed store, raised floor, off the lake side; 3.4 t of hay needs about 25 m³ at 140 kg/m³ [A]. Model CONS_COST RWF 20/kg DM is a placeholder [A].

## 6. Bought-feed implications

Bought feed is priced at RWF 220/kg DM (model FEED_COST base) [A]; availability and quality of concentrates, brans and hay in the zones are not documented [U].

**Lean herd** (20 does, Z3 2.4 ha, zone A):

| Case | Supply | Demand | Gap (t) | Bought feed (RWF M) |
|---|---:|---:|---:|---:|
| Low | 9.6 | 10.7 | 1.1 | 0.24 |
| Mid | 14.4 | 10.7 | 0 | 0 |
| High | 21.6 | 10.7 | 0 | 0 |

**Existing model herds on their own Z3 areas** (demand at the model's DM rates, 622 kg per unit, sheep counted as goat units; 30% fodder share as in the model) [E]:

| Model (5 ha) | Z3 (ha) | Units | Demand (t) | Supply Low / Mid / High (t) | Self-sufficiency Low / Mid / High | Bought feed at Mid (t; RWF M) |
|---|---:|---:|---:|---|---|---|
| M1 (40 goats) | 2.5 | 40 | 24.9 | 9.0 / 13.5 / 20.2 | 36% / 54% / 81% | 11.4 t; 2.5 |
| M2 (50 goats + 20 sheep) | 2.0 | 70 | 43.5 | 7.2 / 10.8 / 16.2 | 17% / 25% / 37% | 32.7 t; 7.2 |
| M3 (60 goats + 30 sheep) | 1.75 | 90 | 56.0 | 6.3 / 9.4 / 14.2 | 11% / 17% / 25% | 46.5 t; 10.2 |

The model's own reported figure (feed self-sufficiency 49% in year 5 for M2) is above even the High column for M2 (37%). The likely reason is that the herd is still growing in year 5, so demand is below the target-herd demand used here [U, not checked in the workbook]; the order of magnitude agrees. **Feed is the line that decides whether the larger herds pay.** At a gross of roughly RWF 50,000 per doe unit per year [E, livestock plan section 10.1], M2's 32.7 t of bought feed at the Mid case (RWF 7.2M) is about twice the herd's gross revenue of roughly RWF 3.5M [E].

## 7. Feeding practice

- Feed cut fodder in raised racks (off the floor, fewer worms) [A].
- Wilt Gliricidia 12–24 hours before feeding [V LVS-23]; keep Calliandra to 20–40% and Leucaena below 30% of the diet [V LVS-21, LVS-22].
- Give lactating does the legume browse and the best hay; give weaners their own area and the freshest fodder [A].
- Minerals: a goat-specific supply (never a goat mix to sheep: copper) [V LVS-26]; the vet names the product.
- Weigh a sample every month; body condition is the early warning for the dry season [A].
- Water always available (water plan section 2).

## 8. Inputs for the financial model

| Model ID | Current base | Recommended | Note |
|---|---|---|---|
| PAST_Y | 9 | **6** (A, B, C); **8** (D) | t DM/ha/yr; replace with trial result |
| FOD_Y | 18 | **12** (A, B, C); **15** (D) | |
| GRAZE | 0.60 | 0.60 | keep |
| CUT | 0.80 | 0.80 | keep |
| FODDER (share of Z3) | 0.30 / 0.30 / 0.35 | **0.40** | cut-and-carry yields 2.7 times more eaten DM per ha than grazing and lowers ground-borne worms [A] |
| CONSERVE | 0.30 / 0.50 / 0.70 | **0.50** base; **0.70** zone A | covers the 2.0 t dry-season gap |
| CONS_EFF | 0.70 | 0.70 | |
| FEED_COST | 220 | 220 | [A]; get a quote |
| PAST_EST, FOD_EST | 450,000 ; 700,000 | keep | [A]; quotes |
| PASTM | 100,000 | keep | |
| IFENCE_M | 300 | **250** | |
| DMI_A, DMI_Y | 1.1 ; 0.6 | **1.0 ; 0.45** | with SALEWT 18, ADULTWT 28 |
| READY | 5 | 5 | first cut about 90 days after planting plus the dry delay |

Feed also changes the herd inputs in `livestock-plan.md` section 11 (GT_TARGET 20 instead of 40–60).

## 9. Gaps

1. No Rwandan annual DM yield for Napier, Chloris, Setaria, Desmodium or fodder trees [U LVS]; the trial plots fix this.
2. No Rwandan hay or silage practice, price or loss figure for goats [U].
3. No forage seed or planting-material price in Rwanda; RAB eligibility for a private farm [U].
4. Zone D rainfall-based yields are inferred from the Livestock Master Plan zone description, not measured [U].
5. Whether the 2023 zero-grazing and 70% fodder guideline (written for cows in Nyagatare, Gatsibo, Kayonza and Kirehe) applies to this farm's district [U, LVS-61].
