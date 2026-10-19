# Risk register

Status: Stage 3 — first version · Created: 2026-10-19 · Review at every decision gate
Scale: probability and impact from 1 (low) to 5 (high); score = P × I. Ratings are judgements [E] grounded in the cited evidence. Owner: F = founder, M = farm manager or worker, V = veterinarian, A = agronomist.

## Risks that could sink the whole investment (score ≥ 15)

| ID | Risk | P | I | Score | Early warning | Prevention | Contingency | Owner | Residual |
|---|---|---|---|---|---|---|---|---|---|
| R01 | **Scale vs overheads.** Fixed costs (about RWF 3M a year) exceed the margin from 5 ha of farm-gate sales [E, model] | 4 | 5 | 20 | Year-1 actuals above budget; buyer prices at farm-gate level | Lean staffing; sell above farm-gate (direct, exporters); high-value lines; test more land before building | Cut the scope to one line; lease out part of the land | F | Medium |
| R02 | **Title or tenure unfit for long-cycle trees.** A foreign holder gets a lease, not freehold, and the term or renewal is uncertain [V MKT-07, LOC-45] | 3 | 5 | 15 | Title check shows a short term or a land-use mismatch | Verify the title (T04) before any tree spending | Annual and short-cycle crops only; renegotiate | F | Low once checked |
| R03 | **Usable area lost to buffers.** 50 m of public domain at the lake, no kraal within 200 m [V LOC-01, LOC-02] | 3 | 4 | 12 | The flood-line map | Map before design (T14) | Redesign: livestock off-site or none | F | Low |
| R04 | **Funding gap.** Every base-case model exceeds RWF 35M at peak (M1 by RWF 6.8M) [E, model] | 4 | 4 | 16 | Quotes come in above placeholders | Phase spending behind gates; quotes first; programmes (SSIT 50–75% irrigation subsidy [V CRP-35]) | Pause at the validated stage; partner or loan only after evidence | F | Medium |
| R05 | **Avocado yields far below the plan.** No Rwandan yield-by-age data; the planning case is half an Australian benchmark [A CRP-45] | 3 | 4 | 12 | Year 3–4 flowering and fruit set | Grafted plants from a vetted nursery; water in dry seasons; soil correction | Shift area to passion fruit or other proven lines | A | Medium |

## Operational and market risks

| ID | Risk | P | I | Score | Early warning | Prevention | Contingency | Owner |
|---|---|---|---|---|---|---|---|---|
| R06 | Livestock disease: RVF quarantine since 2026-06-26 [V LVS-03]; endemic worms and brucellosis [V LVS-10, LVS-39] | 4 | 3 | 12 | Sector vet notices; quarantine orders | Buy only after the quarantine lifts; quarantine pen; a vet plan; no shared grazing | Destock; insurance is unavailable for goats [V MKT-21] | V |
| R07 | Animal mortality above plan | 3 | 3 | 9 | Monthly losses above 1% | Housing, deworming plan per vet, records | Smaller herd; better genetics | M |
| R08 | Feed shortage in the dry season (model: 84% self-sufficient in year 5) [E] | 4 | 3 | 12 | Store below 2 months of demand in May | Fodder bank, hay/silage, a stocking cap | Buy feed; sell animals early | M |
| R09 | Drought or erratic rain (Gashora: 8 of 30 years below 800 mm) [E LOC-34] | 3 | 4 | 12 | Late rains; soil moisture | Storage, mulch, drought-tolerant species | Supplementary irrigation (permit) | A |
| R10 | Water not legally or physically available (lake use needs a permit; small lakes store little) [V LOC-04, LOC-46] | 3 | 4 | 12 | Permit refusal; low borehole yield | Rainwater storage first; apply early | Smaller orchard; drip only on young trees | F |
| R11 | Flooding and erosion on slopes or near swamps | 2 | 3 | 6 | Gullies after rains | Contours, cover crops, keep out of flood lines | Repair; replant | M |
| R12 | Crop disease: passion fruit woodiness virus everywhere tested [V CRP-33]; fruit flies | 4 | 3 | 12 | Mottled leaves; fruit drop | Clean planting material; replant cycle; IPM | Rogue and replant; drop the line | A |
| R13 | Price falls and seasonal gluts | 3 | 3 | 9 | e-Soko prices below plan for 2 months | Spread varieties; contracts; storage | Sell to processors; switch channel | F |
| R14 | Buyer concentration or late payment | 3 | 3 | 9 | One buyer over 50% of sales; days to pay over 30 | Several channels; deposits; credit limits | Cash-on-delivery channels | F |
| R15 | Transport disruption and distance to Kigali (location unknown) | 2 | 3 | 6 | Rainy-season road closure | Check the road (T05); plan harvests | Local markets | M |
| R16 | Theft of animals, produce or equipment | 3 | 3 | 9 | Losses; strangers on site | Fencing, a night enclosure near the house, lights | Insurance where available | M |
| R17 | Labour availability or reliability | 3 | 3 | 9 | Absenteeism | Fair pay, SOPs, training | Casual pool | F |
| R18 | Equipment failure (pumps, solar) | 2 | 3 | 6 | Alarms; flow drop | Maintenance schedule; spares | Manual watering | M |
| R19 | Power interruptions | 2 | 2 | 4 | Outages | Solar plus battery for critical loads | Manual operation | M |
| R20 | Technology complexity or cost overruns | 3 | 3 | 9 | Unused systems; drift from plan | Tiered approach; buy only to solve a defined problem | Fall back to manual | F |
| R21 | Cybersecurity (remote control of pumps, data) | 2 | 3 | 6 | Unknown devices; failed logins | Local-first control, auth, updates, no exposed ports | Isolate the network | F |
| R22 | Regulatory change (buffer rules under review in 2025) [V LOC-09] | 2 | 3 | 6 | Gazette notices | Watch MINALOC and RWB updates | Adapt the design | F |
| R23 | Foreign-exchange exposure (imported inputs, USD-priced equipment) | 2 | 2 | 4 | RWF weakening | Buy locally; price in RWF | Delay purchases | F |
| R24 | Founder dependence (one person holds the plan, the tech and the sales) | 4 | 4 | 16 | Tasks slip when the founder is away | SOPs, records, a trained manager, documented systems | A partner or manager | F |
| R25 | Inflation (urban CPI +17.2% in Sept 2026; meat +33.6%) [V MKT-15] | 4 | 2 | 8 | Input costs above quotes | Lock quotes; stage purchases | Re-price; re-phase | F |

## How it is used

At each gate (`../execution/first-90-days.md`), re-score the top risks with new evidence. Any risk scoring 15 or more without a working prevention blocks the gate.
