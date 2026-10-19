# Crop plan — fruit trees, boundary trees and planting material

Status: Stage 4 design · Date: 2026-10-19
Location dependency: **High.** Conditional by candidate zone (A Rumira/Gashora, B Muhazi shore, C Mugesera, D Shyira). No claim here is about a parcel. Evidence labels: [V] verified (source ID), [E] estimate (method shown), [A] assumption, [U] unknown. International figures are named as international and are never presented as Rwandan.
Sources reuse the register IDs (CRP-, LOC-, LVS-, MKT-) and new `DSN-` IDs in `../registers/incoming/dsn-sources.csv`.

## 1. Recommended species by zone

| Species | A Rumira/Gashora (927 mm, 21–22 C) | B Muhazi (950–1,000 mm, 19.5–21 C) | C Mugesera (956–1,030 mm, 21.5 C) | D Shyira (1,190–1,230 mm, 17–20 C) |
|---|---|---|---|---|
| **Avocado**, grafted Hass + Fuerte | **Yes, irrigated for the first 3 dry seasons, then avocado block capped by water** [LOC-34; water plan] | **Yes, main line** (NAEB, PSAC cover Rwamagana) [CRP-13] | **Yes** [CRP-21] | Marginal; cooler, slower, Hass tolerance of Shyira altitude not documented [U, CRP-34]; small block only |
| **Mango**, grafted | **Yes, lead drought-hardy line** (NAEB: Eastern Province best, dry spell for flowering; PSAC mango in Bugesera) [CRP-34, CRP-13] | Warm slopes only [E] | **Yes** (NAEB mango zone) [CRP-34] | **No** (too cool) [E, CRP-34] |
| **Citrus**, lemon first | Trial block with irrigation (0.25 ha max) | Trial block | Trial block | No (slow colour in cool air) [LOC] |
| **Papaya** | No (water-hungry, marginal market: 134 t national output in 2024 [CRP-17]) | Garden scale | Garden scale | No |
| **Passion fruit** | **No** (woodiness virus in 100% of Rwamagana fields, Kayonza worst) [CRP-33] | **No** (same) | **No** | Only with certified or virus-indexed plants and an agreed buyer [CRP-33, CRP-34] |
| **Tree tomato** | No (needs 15–20 C) [CRP-34] | No | No | Candidate once a buyer and price are confirmed (e-Soko farm-gate median RWF 1,300/kg [MKT-03]) |
| **Hot chilli** | Option on contract only, irrigated, 0.1 ha at a time; not in the base model [CRP-26, CRP-12] | No | No | No |
| **Pineapple** | Filler at best | No | Filler with a processor [CRP-34, CRP-62] | No |
| **Macadamia, banana (cash), guava** | No | No | No | No |

Why: all fits are from the market and agronomy files [CRP-34 NAEB ranges, LOC-34 climate]. Passion fruit is excluded in A–C not for price but for virus pressure and short vine life. Chilli has the clearest export-chain evidence but conflicting farm-gate prices (RWF 600–2,500/kg) and imported seed [CRP-26, CRP-27]; it needs a written buyer first. Gaps flagged [U]: no Rwandan yield for citrus, passion fruit, tree tomato; no current Hass farm-gate series.

### 1.1 Orchard mix inputs for the model (of Z2)

| Model ID | A | B | C | D |
|---|---:|---:|---:|---:|
| OR_AVO | 0.45 (0.25 without proven water) | 0.60 | 0.45 | 0.30 |
| OR_MAN | 0.40 (0.65) | 0.15 | 0.35 | 0.00 |
| OR_CIT | 0.15 (0.10) | 0.20 | 0.10 | 0.00 |
| OR_PAP | 0.00 | 0.05 | 0.10 | 0.00 |
| OR_PAS | 0.00 | 0.00 | 0.00 | 0.30 |
| OR_TTO | 0.00 | 0.00 | 0.00 | 0.30 |
| OR_MAC | 0 | 0 | 0 | 0 |

Bracketed zone A values apply while no borehole, pond or scheme water is proven: mango returns about 6–13 times more revenue per cubic metre of water than avocado at farm-gate prices [E, water plan 3.4]. Tree counts in section 3 use the proven-water variant; the bracketed variant at 5 ha is 58 avocado, 97 mango and 42 citrus trees.

(Zone D leaves 0.10 of Z2 for a cool-climate trial, so OR_* sum to 0.90; add it to avocado or tree tomato once the pin is known.)

## 2. Cultivars, graft, spacing, pollination

| Item | Avocado | Mango | Citrus (lemon first) |
|---|---|---|---|
| Cultivars | Hass (export type; 73% of NAEB trees) and Fuerte (27%); Pinkerton is exported too [CRP-01, CRP-19]. Plant **70% Hass, 30% Fuerte** [A] | Tommy Atkins, Kent, Apple mango, Zillate: the four NAEB urges as replacements for traditional trees [CRP-34, CRP-60]. Two or more cultivars to spread the harvest and the glut [A] | Lemon (price signal strongest: producer RWF 1,583/kg, imports of lemons and limes 1,920 t in 2024) [CRP-16, CRP-18]; Valencia orange only as a minor trial [CRP-47] |
| Grafted vs seedling | **Grafted only** [A]. 86.5% of Eastern Province avocados are unimproved seedlings with low yield [CRP-32] | **Grafted** (PSAC distributes grafted) [CRP-13] | Grafted [A] |
| Spacing | **8 x 8 m = 156 trees/ha** [A]. (Model uses 204/ha; international range 69–280/ha for 6–12 m [CRP-44]; one exporter ~400/ha irrigated [CRP-20].) | **10 x 10 m = 100 trees/ha** [A]. (A Nyagatare farm has 141/ha [CRP-60]; model 156/ha.) | **6 x 6 m = 278/ha** [A]. (Model 400/ha.) |
| Pollination | Two flowering types: Hass is Type A, Fuerte Type B, and a Type B partner raises Hass fruit set; bees raise set [DSN-01, international]. Plant **every third row as Fuerte** (about 1:2.3 Fuerte:Hass). Ask the nursery to confirm each cultivar's type in writing (Pinkerton type [U]) | Self-fertile in practice [A]; confirm with a RAB agronomist | Mostly self-fertile [A] |
| Flowering/dry-spell rule | No spray at flowering to protect bees; no root-zone waterlogging [CRP-44] | **Needs a dry spell of at least 3 months at flowering** [CRP-34]: stop irrigating mature mango before flowering [A] | Keep moisture steady in fruit set [A] |
| Planting season | NAEB: March–June [CRP-34]. See 2.1 | Start of the rains [A] | Start of the rains [A] |

### 2.1 Planting season and zone A, "plant when the dry season is furthest away"

CHIRPS monthly rain at Gashora (mm): Jan 78, Feb 72, Mar 133, Apr 154, May 79, Jun 17, Jul 4, Aug 19, Sep 44, Oct 110, Nov 129, Dec 89 [E LOC-34]. Calculation of the dry season after planting [E]:
- A tree planted **mid-March** has Mar–May (366 mm) and then the dry season from June: only about 2.5 months of root growth before June–August (40 mm in three months).
- A tree planted **early October** has Oct–May (about 850 mm) : 8 months of rain before the first dry season.
- Recommendation: **Zone A–C: plant in October–November when water is short, in March–April only if the water store is full and drip is installed** [A]. Zone D (rain every month but June–July): March–April.
- Dig holes 4–6 weeks ahead in the dry weeks before the rains [A].

## 3. Plants per hectare and per farm

Counts below follow section 1.1 and the spacings above (avocado 156, mango 100, citrus 278, papaya ~1,667, passion fruit 1,111, tree tomato 1,667 per ha). Per hectare of Z2 (so they scale to 2 or 10 ha):

| Per ha of Z2 | A | B | C | D |
|---|---:|---:|---:|---:|
| Avocado | 70 | 94 | 70 | 47 |
| Mango | 40 | 15 | 35 | 0 |
| Citrus | 42 | 56 | 28 | 0 |
| Papaya | 0 | 83 | 167 | 0 |
| Passion fruit vines | 0 | 0 | 0 | 333 |
| Tree tomato | 0 | 0 | 0 | 500 |

At 5 ha (Z2 = 1.50 ha in A and D, 1.75 ha in B and C) [E]:

| Crop | A | B | C | D |
|---|---:|---:|---:|---:|
| Avocado (Hass / Fuerte) | 105 (74 / 31) | 164 (115 / 49) | 123 (86 / 37) | 70 (49 / 21) |
| Mango | 60 | 26 | 61 | 0 |
| Citrus | 62 | 97 | 49 | 0 |
| Papaya | 0 | 146 | 292 | 0 |
| Passion fruit vines | 0 | 0 | 0 | 500 |
| Tree tomato | 0 | 0 | 0 | 750 |
| Fruit trees to buy (+10% for losses/gap fill) | 250 | 316 | 256 | 77 + vines/plants |

## 4. Production, survival and replacement assumptions

| Item | Value | Label and basis |
|---|---|---|
| Avocado kg/tree by age (smallholder planning case) | y3 6, y4 13, y5 19, y6 22.5, y7+ 24 | [A] 50% of an Australian irrigated benchmark [CRP-45, international]; no Rwandan yield by age exists. Exporter reports 12–15 t/ha irrigated now, 17–20 mature at ~400/ha [CRP-20] |
| Avocado t/ha at 156 trees | 0.9, 2.0, 3.0, 3.5, 3.7 (y3–y7) | [E] |
| Avocado gross at maturity | 156 x 24 kg x RWF 573/kg = RWF 2.1M/ha | [E, FAO producer price CRP-16]; e-Soko national farm-gate median is 600, Bugesera markets 510 [MKT-03] |
| Mango (farmer-reported, Rilima) | 15–20 kg y1 of bearing, 50–60 kg by y5, up to 100 mature | [V CRP-09, one farmer]. Plan **half**: y5 25–30 kg, mature 50 kg [A] |
| Survival at 12 months | 85% base (80% downside, 90% upside) | [A]; needs a fenced block, planting hole prep, mulch and water in the first dry season |
| Gap filling | Replace losses once, in the **next planting window**, up to 10% of trees | [A] (model TR_GAP) |
| Replacement rule | If more than 15% die in year 1, **stop and find the cause** (drainage, goats, drought, graft failure, wrong cultivar) before replanting | [A] |
| Routine replacement after year 3 | None, except trees lost to disease; plan 1–2% a year | [A] |
| Passion fruit | Vines last 2–4 years; replant on new ground | [A] |
| Time to first sales | Avocado y3–4, mango y4–5, lemon y3–4 | [A, CRP-45 international; CRP-09] |

Unknowns [U] that must be resolved by a mature local orchard visit: Hass yield by age under Rwandan rain-fed conditions, mango alternate bearing, lemon yield.

## 5. Establishment steps (avocado, mango, citrus)

1. **Site screen** (before ordering): 60 cm test hole filled with water to check drainage (water should be gone within a day); avoid waterlogged spots and frost pockets; avocado roots must not sit in water, and Phytophthora root rot is the main disease on poor drainage [CRP-44, international].
2. **Soil**: test pH, P, K (water plan section 7.2). Avocado likes pH 5.5–6.5, NAEB range 5–7 [CRP-34, CRP-44]. Zone A topsoil pH is 5.5–6.1 by satellite grid [E LOC-37]; do not lime without a test.
3. **Layout**: mark rows on the contour; pegs; leave a grazing-free access lane; keep rows ≥ 5 m from the fence.
4. **Holes**: 60 x 60 x 60 cm [A], dug 4–6 weeks before planting; topsoil mixed with about 10 kg hot-composted compost per hole [A, DSN-08] and 0.25 kg urea-equivalent only where tests indicate [A, CRP-46 quantity].
5. **Planting**: plant on a low mound (20–30 cm) for avocado; graft union 10 cm above soil; remove the bag; stake; water in with 20 L [A].
6. **Mulch** 10 cm of cut grass, collar kept clear, to hold water through the dry season [A].
7. **Protection**: block fence closed before planting; guards only for outer-row trees and where a fence gap or neighbours' animals exist (budget 30% of trees) [A].
8. **Shade the first year** (dry grass screen or net on the west side) [A].
9. **Water**: bucket or drip per `water-and-soil-plan.md` sections 2.2 and 5 for the first 3 dry seasons.
10. **Training**: a single leader; prune after fruit; remove flowers in year 1–2 [A].
11. **Record**: tree map with cultivar, date, nursery batch, loss and cause.

## 6. Protection from livestock

- **Rule P6**: no goats or sheep inside orchard blocks; fence height ≥ 1.2–1.5 m, tight mesh to ground [A]; double gate; no tethering near trees.
- Manure goes to the trees as compost; animals never enter.
- Mature-orchard grazing by sheep (zone D) only after a trial with trunk guards and only after the trees pass a height rule set by the agronomist [A; no East African source, CRP open question 8].
- Browse species (Calliandra, Gliricidia) for goats grow in separate hedge strips, not between fruit rows.

## 7. Nursery option: buy or build

| Option | Numbers | Decision |
|---|---|---|
| **Buy grafted trees (default)** | Local avocado seedlings RWF 800–1,500 each [V CRP-02]; no price found for mango/citrus. At 250 trees (A, 5 ha) x RWF 1,500 [A] = **RWF 0.38M**. PSAC supplies free grafted avocado (150,000), mango (45,000) in Bugesera and Rwamagana for 2026A; eligibility of a private farm [U] [CRP-12, CRP-13]. One Acre Fund-Tubura is the largest avocado supplier [CRP-21, CRP-22] | **Buy.** Ask PSAC and Tubura first, then qualify nurseries with the checklist in the supplier file section 6 (mother-tree source, rootstock, union, written replacement policy, visit two customers) |
| On-farm grafting nursery | Needs a named budwood source, grafting skill and 6–12 months [supplier file section 5]; RAB trains in nursery construction in Juru and Rweru sectors [CRP-42]. Model NURSERY item: RWF 0.3M (M2) | **Not in years 1–2.** Savings at this scale are small compared with labour and water |
| **Hardening bed** | Shade net, bench, potting mix: RWF ~0.1M [A] | **Yes.** Hold the 10% replacement trees in pots so the cultivar and size match; also raises papaya seedlings |
| Seedling nursery for fodder trees | Gliricidia grows from 1.5 m stakes; Calliandra from scarified seed (RAB Bugesera satellite nurseries distributed 20,734 and 18,118 plants in 2019) [LVS-21, LVS-23, LVS-50] | Cheap and worth doing on the farm [A] |

Reconsider an on-farm nursery if planting exceeds the equivalent of 10 ha of orchard or if no qualified nursery is within 100 km [A].

## 8. Boundary, shade and timber trees (Z4)

### 8.1 Layout and species

- **Outer row** (outside the fence, 4 m spacing): **Grevillea robusta and Markhamia lutea (umusave) alternating**. Grevillea is the most recorded farm tree in Rwanda (32.9% of agroforestry plots), grows in 600–1,700 mm and all zones, has an open canopy and deep roots that compete little with shallow-rooted crops [CRP-36, CRP-38, LOC-38]. Markhamia is second, gives poles and posts, and coppices, but cannot stand waterlogging [CRP-36, CRP-39].
- **Inner live fence / hedge** (inside the wire): **Gliricidia sepium stakes** as living posts and browse in zones A–C (650–3,500 mm, to about 1,200–1,600 m) [LVS-23]; **Calliandra** hedgerows on contour lines where there is moisture [LVS-21]; **Leucaena** in the warm lowlands only (A, C), at most 30% of the diet [LVS-22]. In zone D use **Alnus acuminata** (nitrogen-fixing, silvopastoral) and Calliandra instead of Gliricidia and Leucaena [CRP-55, LVS-21].
- **Avoid**: Eucalyptus beside crops, in wet ground or near the lake (policy against near-water planting; yield loss within 10.5 m [CRP-41]); Pinus patula (dry sites, "aggressive") [LOC-38]; Maesopsis near the lake (invasive-species disclaimer) [CRP-40]; Cedrela (shoot borer, needs perfect drainage) [CRP-56].
- **Inside the 50 m lake strip**: only planting that restores damaged land or controls erosion; keep natural vegetation [V LOC-01 Art 5].

### 8.2 Numbers [E]

| Item | 2 ha | 5 ha | 10 ha |
|---|---:|---:|---:|
| Boundary length with shape factor 1.15 | 650 m | 1,028 m | 1,455 m |
| Timber trees at 4 m | 163 | 257 | 364 |
| Survivors at 85% | 138 | 218 | 309 |
| Gliricidia live-post stakes at 2 m (reduces wire posts) | 325 | 514 | 728 |
| Seedling + planting at RWF 200 + 400 each (model T_SEED, T_PLANT) | RWF 0.10M | RWF 0.15M | RWF 0.22M |

Buy seedlings from RFA (via IremboGov, 5 days, price by quantity) or Tubura rather than raising seed (about 430 Grevillea seeds for 300 trees at 60–80% germination) [CRP-05, CRP-48, supplier file section 3]. Ask the National Tree Seed Centre for germination results first [CRP-54].

### 8.3 Value expectation

Grevillea's net benefit to Musanze farmers was a benefit-cost ratio of 1.06 (revenue RWF 57,950/ha/yr against 54,200 invested) [V CRP-37]. No current pole or timber price was found [CRP]. **Treat boundary trees as shade, browse, wind shelter and a long-term asset, not as income**: set pole revenue to zero in the base case (T_POLESHARE = 0, upside only).

### 8.4 Permits

| Step | Rule | Source |
|---|---|---|
| Planting material | Order through IremboGov, Rwanda Forestry Authority | [V CRP-05] |
| Harvest | The 2024 forest law needs a licence to harvest trees on **any** area, including below 2 ha; IremboGov harvest permit, 30 days, free, needs a notified tree purchase agreement and ID | [V CRP-03, CRP-06; secondary press for the law, gazette number [U]] |
| Transport | Forest products transport permit, 2 days, free, needs the district harvest permission | [V CRP-04] |
| Poles (< 20 cm diameter at 1.3 m) | Cutting, moving, trading or using them needs a permit "for special reasons"; fines are twice the pole value (five times for using) | [V CRP-06] |
| Fruit trees | Whether they are exempt from the harvest licence is not stated | [U] ask the district forestry officer before felling any tree |
| Lake strip | No plantation timber inside 50 m except restoration or erosion control | [V LOC-01] |

Because the pole rule blocks the model's "first pole thinning" (T_POLEYEAR 7–8, 30% of trees at RWF 8,000 each), the base case should not count it.
