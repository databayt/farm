# Soil and water testing plan

Status: Stage 1 — sampling design ready; laboratory choice pending (see "Laboratories") · Created: 2026-10-19

## Why test before deciding anything

Soil chemistry decides which fruit trees will thrive, how much lime and nutrient correction is needed, and what establishment really costs. Water chemistry and bacteriology decide whether a source is fit for drip irrigation and safe for animals to drink. Testing costs little next to planting the wrong tree in the wrong soil and losing three years.

## Soil sampling design

**1. Define management zones** during the site visit (see `site-inspection-checklist.md`, §3–4). Use slope position, soil colour and texture, drainage, and past use. A 2–10 ha farm usually splits into 3–6 zones [A]. Sample each zone separately; do not mix zones.

**2. Composite samples per zone:**

| Sample | Depth | Cores | Why |
|---|---|---|---|
| Topsoil composite | 0–20 cm | 15–20 cores, zig-zag across the zone | Fertility, pH, organic matter for all crops and pasture |
| Subsoil composite (orchard candidate zones only) | 20–50 cm | 8–10 cores at the same points | Tree roots go deeper; subsoil acidity or compaction limits trees |

Avoid manure heaps, ash or burn spots, paths, termite mounds, field edges and spots under existing trees. Mix the cores in a clean bucket, take about 1 kg, and bag it with the label `zone / depth / date / GPS point`. If samples cannot reach the lab within 2–3 days, air-dry them in shade [A]; confirm the handling with the chosen lab.

**3. Request these analyses** (confirm the method names the lab uses, so results can be compared later):

| Parameter | Why it matters |
|---|---|
| pH (in water; KCl if offered) | Crop suitability; Rwandan highland soils are often acidic (to be confirmed for the actual site) |
| Exchangeable acidity / aluminium | Sets the lime requirement on acid soils |
| Organic carbon (organic matter) | Soil health baseline; water holding |
| Total nitrogen | Fertility |
| Available phosphorus (state the method: Bray, Olsen or Mehlich) | Often the most limiting nutrient; the method changes the numbers |
| Exchangeable K, Ca, Mg, Na and CEC | Fertility and nutrient balance |
| Texture (sand / silt / clay) | Drainage, irrigation design, tree choice |
| Micronutrients, at least zinc and boron | Fruit set and quality in avocado and citrus |
| Electrical conductivity (only if salinity is suspected, e.g. lowland near a lake) | Salinity check |

Thresholds for interpreting the results, per crop, will be sourced in Stage 4 from RAB recommendations and other credible guides. None are assumed here.

## Water testing design

Test **every candidate source**. Take one round in the dry season (worst case for quantity and salinity) and one in the wet season (worst case for contamination) [A].

| Use | Parameters |
|---|---|
| Irrigation (drip) | pH, EC/TDS, sodium and SAR, bicarbonate, chloride, boron, nitrate, iron and manganese (these clog drippers), suspended solids/turbidity |
| Livestock drinking | E. coli and total coliforms, nitrate/nitrite, TDS, sulfate, pH; heavy metals if there is mining or industry upstream |
| Lake water specifically | All of the above. If algal blooms are ever visible, ask about cyanobacteria/toxin screening, because blooms can poison livestock. The legal right to use lake water is a separate question; see `../research/location.md`. |

Collect the bacteriology samples in the lab's sterile bottles, chill them, and deliver them within the lab's time limit.

## Laboratories

Candidates come from the Stage 1 research (see `../research/` and `../registers/suppliers.csv`); this section is updated after the research synthesis. To choose a lab, compare:
- the parameters it actually offers and the methods it uses;
- price per sample, turnaround time and sample-drop logistics;
- accreditation or recognized standing;
- whether it gives fertilizer or lime recommendations.

Get written quotes before sampling. Until quotes arrive, the financial model carries testing costs as `[A]`.

## Chain of custody (one row per sample)

| Field | Example format |
|---|---|
| Sample ID | S-Z2-TOP |
| Zone and depth | Zone 2 (mid-slope), 0–20 cm |
| GPS point | -1.xxxxx, 30.xxxxx |
| Date and time | 2026-11-xx 09:40 |
| Collected by | name |
| Handling | air-dried 2 days / chilled |
| Delivered to lab, date | lab name, date |
| Lab reference number | from the lab receipt |

## After the results

1. Enter the results in a results table, by zone, in `study/discovery/` (created when results arrive).
2. Mark each zone as suitable, needs correction, or unsuitable for each candidate crop, citing the threshold source.
3. Feed the lime and nutrient-correction needs into the capex and opex of the financial model.
4. Re-test topsoil every 2–3 years [A] to track organic matter and pH.
