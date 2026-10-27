# Assumptions register

Updated: 2026-10-19 (Stage 1). Numeric model inputs are listed with their label and source on the `Assumptions` and `Models` sheets of `../feasibility/financial-model.xlsx`; after the Stage 1 synthesis, 52 input rows there are still placeholders. This register holds the assumptions that shape the study itself, and the model assumptions that matter most.

| ID | Assumption | Value | Basis | Impact if wrong | Validation | Status |
|---|---|---|---|---|---|---|
| AS-01 | Farm area | 5 ha (range 2–10) | Founder, 2026-10-19 | Every quantity scales; overheads per ha change sharply | Survey or title | Open |
| AS-02 | Capital for years 1–2 | RWF 35M (under USD 25k) | Founder, 2026-10-19 | Sets the funding gap | Founder confirms amount and timing | Open |
| AS-03 | The title allows long-cycle crops (lease ≥ 25 years remaining, or freehold) | Assumed | Founder: "mine or my company's" | Avocado, macadamia and timber become risky | Title check (T04) | Open — top risk |
| AS-04 | The lake buffer takes about 10% of the area | 10% | Placeholder | Usable area, and where the kraal can go (200 m rule) | Flood-line map (T14) | Open |
| AS-05 | Avocado yields 50% of an Australian irrigated benchmark (about 24 kg/tree at maturity) | Base curve | CRP-45 with a 50% haircut; no Rwandan data | The biggest swing in the model: irrigated Rwandan farms report 12–15 t/ha (CRP-20) | Visit mature Rwandan orchards; RAB or PSAC records | Open |
| AS-06 | Live-weight goat price RWF 2,300/kg (1,800–2,800) | Base | 2022 per-head prices (MKT-16) inflated by CPI meat rises (MKT-15) | Livestock revenue | Weekly market price collection (T08) | Open |
| AS-07 | Goats are bought from month 9 (July 2027) | Month 9 | Fencing, water and forage first; RVF quarantine | Cash timing | G4; RVF status (T07, T11) | Open |
| AS-08 | Costs (fencing, tanks, house, labour, overheads) | Placeholders | Judgement | The funding gap and break-even are dominated by these | Quotes (T12) | Open — highest value to resolve |
| AS-09 | Fruit sells at farm-gate prices | e-Soko medians | MKT-03 | Selling direct or to exporters could lift prices | Buyer interviews (T09, T15) | Open |
| AS-10 | No loans; real terms; no terminal value | Model convention | D-006 | NPV is conservative for orchards | Stage 3 financing scenarios | Accepted |
| AS-11 | Planting in the March 2027 rains | Model month 5 | Bimodal rains (LOC-34) | One season of delay if missed | Gates G3 and G4 | Open |
| AS-12 | The farm is in one of the eastern candidate zones | Zone framing | Ranking in location.md | Shyira (highland) would change crops and climate | Pin or UPI (T01) | Open |
| AS-13 | The containers are ISO 20 ft standard height | Interior 5,898 x 2,352 x 2,393 mm | STU-01, STU-02 | Every panel, the layout and the clear height change | Site survey sheet `study/studio/survey.csv`, all three units | Open |
| AS-14 | Opening positions on the front wall | Glazing x 1,380-4,380 and narrow door x 4,990-5,510 from the lined end-A face, plus or minus 150 mm | Scaled from the founder's 2026-10-25 photo using the 6,058 mm container length [E] | The partition and bathroom depth move; the wardrobe absorbs up to 150 mm | Survey | Open |
| AS-15 | Lining build-ups | Walls and ends 50 mm, ceiling 60 mm, floor 10 mm | Design: EPS between battens with 12 mm ply; epoxy seal plus 5 mm SPC | Net sizes change by up to about 40 mm | Mock-up in unit 1 | Open |
| AS-16 | Studio occupancy | 2 guests per studio, 3 studios; septic design population 8 | Design | Septic, tank and pump sizes | Operations plan | Open |
| AS-17 | Water use per guest | 150 L/day (range 120-240; DRS 143 uses 240 for hotel guests) | Design; STU-10 | Tank buffer and pump duty (septic size is set by the 2,000 L minimum) | Meter readings in the first 3 months | Open |
| AS-18 | Hot water per studio | 80 L stored at 60 C, 6-7 L/min shower head, mixer at 41-44 C | Calculation [E]: two 8-minute showers need about 48-64 L of hot water | A cold second shower | Commissioning test: two showers back to back | Open |
| AS-19 | Electrical demand | About 30 A diversified per studio, with the heater and AC shed while the hob runs (D-021) | Generator calculation [E] | The 32 A inlet, supply size, REG capacity | Licensed electrician's design; REG capacity check | Open |
| AS-20 | Board sheet sizes sold in Kigali | Plywood 2,440 x 1,220; melamine board possibly 2,750 x 1,830 | International standard sizes; Kigali sizes not found online | Nesting and sheet counts | Supplier visits | Open |
| AS-21 | Studio material and labour prices | Placeholders, except STU-P01 to STU-P03 | Judgement; no published board, pipe, tile or sanitaryware prices found | Budget and payback | Three quotes per BOM line | Open - highest value to resolve |
| AS-22 | Guest nightly rate and occupancy | Shown as a range, never a forecast | Placeholder | Payback | Comparable listings near the site; the founder's target rate | Open |
| AS-23 | Roof terrace design loads | Live load 3.0 kN/m2, guardrail line load 0.74 kN/m, canopy uplift per local practice | Common code values [A] | Steel member sizes | Structural engineer's sign-off before guests use the roof | Open |
| AS-24 | Polycarbonate, SPC flooring, tiles, sanitaryware and furniture hardware can be bought in Kigali | Available, with a fallback for each | Not found online (searched 2026-10-26) | Substitutions in the BOM | Field visits (Quartier Matheus, Gisozi, Masoro) | Open |
| AS-25 | A septic and soak-pit site exists on the plot | At least 50 m from the borehole and the lake, downhill, within 30 m of tanker access | STU-11, LOC-01, LOC-02 | No guests until resolved (D-016) | Site plan and a percolation test | Open |
