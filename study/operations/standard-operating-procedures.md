# Standard operating procedures — daily, weekly, monthly, seasonal

Status: Stage 7 draft · Created: 2026-10-19 · Location: **unconfirmed**
Everything here is a template to be tuned on the real site. Times, intervals and counts are `[A]` unless a source ID is given. Veterinary and agronomic specifics are confirmed with a Rwandan veterinarian and the sector agronomist before use. Details by topic are in `livestock-management.md`, `crop-management.md`, `maintenance.md` and `recordkeeping.md`. The calendar and dates come from `../execution/five-year-roadmap.md`.

## 1. Purpose and how to use this file

- The **farm manager** (FM, hired in T28) runs the daily and weekly routines. The **founder** (F) reviews weekly and monthly. The **veterinarian** (VET) and the **agronomist** (AG) advise on their topics. Until the manager is hired, the founder or a caretaker does the FM column.
- A routine counts as done only when its record exists (`recordkeeping.md`). A task with no record is treated as not done.
- Print the daily checklist (section 3), keep a laminated copy at the store, and keep a paper sheet for days without signal.
- Rules that never change:
  1. No installation within 50 m of the lake bank and no animal house or kraal within 200 m [V LOC-02].
  2. A sick or dead animal is reported to the vet the same day. Suspected contagious disease must be reported without delay [V LVS-40, Law 54/2008 Art 7].
  3. No animal enters or leaves the farm without the movement rules checked first [V LVS-29, LVS-40].
  4. No raw manure on fruit trees close to harvest (zoning concept rule 4).
  5. Nobody works alone with injured or sick animals without gloves; abortions and carcasses are handled as a human health risk (RVF and brucellosis are zoonoses [V LVS-34, LVS-39]).

## 2. What is active when

The routines grow with the farm. This table says which sections apply in each period (dates from the roadmap).

| Period | Active routines |
|---|---|
| 2026-10 to 2027-02 (before planting) | Weekly price collection (T08); site routines (section 3.1 reduced: gate, fence, water, security); works supervision; records set-up |
| 2027-03 to 2027-06 (trees and fodder in, no animals) | Daily crop checks, weekly scouting, watering rota, fodder cuts; building works; no livestock sections |
| From arrival of animals (2027-07 at the earliest, else 2027-10) | Full daily checklist including livestock; quarantine routine for arrivals; health and weight routines |
| From first harvests (2028) | Harvest, grading, packing and delivery routines; sales and customer routines |
| From the sensor pilot (2027-06) | Monthly sensor checks added to the maintenance routine; paper fallback kept |

## 3. Daily routines (farm manager)

Target total: about 3–4 hours of fixed tasks before the full herd, rising as animals arrive [A]. Times shift with the season; the order does not.

### 3.1 Morning round (first light, about 06:00–08:30) [A]

| # | Task | What to look for | Record |
|---|---|---|---|
| 1 | Walk the perimeter and gate (shorter on wet days) | Gaps, cut wire, footprints, open gate, lights and locks; nothing near the lake side | `Daily` |
| 2 | Water check | Tank levels, leaks, trough water clean and full, pump state; litres used | `WaterEnergy` |
| 3 | **Animal head count and look-over** (once animals are on the farm) | Every animal present; standing, eating, ears up, normal droppings, cough, nasal discharge, limp, swelling, bloat, kids nursing; anything odd goes to the health workflow in `livestock-management.md` | `Daily` + `AnimalEvents` |
| 4 | Feed and water the animals | Feed per day matches the plan (dry matter about 2.5–3.5% of body weight [E LVS-26]); troughs clean | `Inventory` |
| 5 | Orchard and fodder look | Wilting, pests, damage, new gaps, weeds at tree bases, mulch moved | `CropOps` |
| 6 | Rain gauge reading (08:00 each day) | Millimetres since yesterday | `WaterEnergy` |

### 3.2 Midday (about 10:00–14:00)

| Task | Notes | Record |
|---|---|---|
| Field work of the day from the weekly plan (watering, weeding, mulching, pruning, cutting fodder, building tasks) | Heavy field work is done in the cool morning; animals are checked again before leaving for lunch | `CropOps`, `Daily` |
| Cut-and-carry fodder, if needed | Cut at about 90 days for grasses [V LVS-15] and every 6–8 weeks for Napier [V LVS-52]; weigh a sample load | `Inventory` |
| Receive visitors, deliveries, contractors | Entry through the single gate, visitor book signed, footbath point for visitors going near animals | `Biosecurity` |
| Harvest and pack, in season | Section 5 | `Harvest` |

### 3.3 Evening round (about 16:30–18:00) [A]

| Task | Notes | Record |
|---|---|---|
| Second animal check | Animals back in the house or paddock; count again; water and feed topped up; nothing left in the rain | `Daily` |
| Close up | Gates latched, tools returned, tanks' taps shut, pump off, lights on | `Daily` |
| Daily log | Five lines: weather, work done, problems, visitors, anything for tomorrow; sent to the founder by message | `Daily` |

### 3.4 Daily exceptions that trigger action

| Finding | Do this |
|---|---|
| A sick or dead animal | Isolate it, call the vet, start the health-event workflow (`livestock-management.md`) |
| High fever, weakness, bleeding from body openings in animals | Treat as a possible RVF case: isolate, wear gloves, call the vet and the sector veterinary officer the same day [V LVS-03, LVS-34] |
| A broken fence or a gap | Secure the animals first, then repair; log in `Maintenance` |
| A water source low or dirty | Switch to stored water, tell the founder, log |
| Theft, break-in or a stranger with animals | Tell the founder and the village leader; do not confront; log |

## 4. Weekly routines

| Day (suggested) | Who | Task | Record |
|---|---|---|---|
| Monday | FM + F (call or visit) | Plan the week from the previous week's log: tasks, labour, purchases, repairs | `Daily` (plan) |
| Monday | FM | Feed and fodder stock count; order feed or seed if under the reorder level | `Inventory` |
| Tuesday | FM | **IPM scouting walk** (crop-management 5): a fixed route, 10 trees per block, counts of pests and signs of disease | `CropOps` |
| Wednesday | FM | Fence and gate walk; tool and tank check; small repairs | `Maintenance` |
| Thursday | FM | Animal health walk with the doe cards (condition, FAMACHA-type check if the vet adopts it [V LVS-46, to confirm], hooves, udders); weigh the animals due this week | `AnimalEvents` |
| Friday | FM | Clean pens and troughs; compost turning; bedding replaced | `Maintenance` |
| Saturday | FM | Photo round (each block, the animal house, the tanks) | `Daily` |
| Sunday | FM/F | Type up paper records, back up the workbook, send the weekly summary | all |
| Weekly, any day | F | **Founder review (30–60 min):** read the week's records, ask three questions (what did we spend, what did we lose, what did we learn), approve purchases above the manager's limit | `Gates`, `Costs` |
| Weekly (until T08 ends) | F or assistant | Price collection at 2–3 Kigali markets and the nearest district market, same products and units each time | `Prices` |

## 5. Harvest, post-harvest and delivery (from 2028)

| Step | Rule | Record |
|---|---|---|
| Pick | By crop (crop-management 6); in the cool part of the day; clean crates | `Harvest` |
| Shade and sort | Within an hour: out of the sun, graded by the buyer's spec | `Harvest` |
| Pack and label | Block, date, grade, weight, destination | `Harvest` |
| Deliver | At the agreed time and price; get a signed note; avocado and other perishables do not wait for a convenient day | `Sales` |
| Close | Payment received? If not, flag after the agreed term | `Sales` |

## 6. Monthly routines

| Task | Who | Record |
|---|---|---|
| Month-end cash and stock check: cash in hand, bank or mobile balance, the feed and input stock against the book | F + FM | `Costs`, `Inventory` |
| Cost and sales review against the monthly plan | F | `Costs`, `Sales` |
| Animal weights for the sampled animals; condition of each doe; kidding forecast for the next 3 months | FM + VET | `AnimalEvents` |
| Mortality and morbidity summary: deaths, causes, treatments, rates | FM | `Mortality` |
| Tank cleaning check and water-quality look (colour, smell); sensors checked against a manual reading | FM | `Maintenance`, `WaterEnergy` |
| Orchard walk with the founder: tree count, survival, growth, damage, mulch and weed state | F + FM | `Plantings` |
| RVF, PPR and movement status check in the district (until the monthly check is no longer needed) | F | `Permits` + decision log |
| Safety check: first-aid kit, gloves and boots, fire point, contact numbers | FM | `Maintenance` |
| Update the gate tracker | F | `Gates` |

## 7. Quarterly and annual routines

| Task | When | Who |
|---|---|---|
| Rebase the financial model from records and write a decision-log entry (T67) | quarterly | AN + F |
| Risk register review (T83) | quarterly | F + AN |
| Vet herd-health visit (frequency set with the vet) | agreed with the vet | VET |
| Asset register and maintenance review | quarterly | FM + F |
| Annual review (G8a/b/c) in November | each November | F + AN |
| Re-test the water; soil re-test per block in the dry season before the next planting | yearly [A] | F |
| Tax filing and compliance (T82) | yearly | F |

## 8. Seasonal calendar of routines

Seasons are working labels [E LOC-34]; replace the dates with the site's own rainfall record once it exists.

| Season | Orchard and fodder | Livestock | Water and works | Records and money |
|---|---|---|---|---|
| **Season A rains (Oct–Dec)** | Gap-fill, fodder re-sow, weed control, mulch renewal; hold back from spraying before heavy rain | Parasite pressure rises again in October [V LVS-46: peaks in April and October]; ask the vet for the plan; sell toward the year-end peak [V LVS-07] | Clear gutters and tank screens before the rains; check drainage around the house | Year-end stock count; annual review in November |
| **Short dry (Jan–Feb)** | Land preparation, holes, compost, soil correction, planting-material orders | Kidding in the early months of 2028 onward (if tranche 1 arrived July 2027) [A]; kids' health plan | **Works season:** fences, tanks, buildings | Tax and annual paperwork |
| **Season B rains (Mar–May)** | **Main planting**; mulch; staking; establishment watering as needed; hay-making at the end | Parasite peak in April [V LVS-46]; vet plan in action; careful with the first flush of lush forage | Check roof catchments and first-flush; watch for flooding near the lake | Planting maps; survival counts |
| **Long dry (Jun–Aug)** | Watering rota for young trees; mulch thicker; shade for seedlings; fruit-fly watch on bearing trees | Dry-season feed reserve in use [V LVS-15]; water use per head checked (1.5–3.3 L a day at maintenance [V LVS-27]); no grazing of scorched pasture | Dry-season water readings; solar-pump and filter checks; no new works that need water | Cash check: feed bought in the dry season |
| **Transition (Sep)** | Prepare Season A beds; prune after harvest where the crop allows | Plan kidding and sales around the year-end peak | Fix before the rains | Budget for the new year |

## 9. Emergencies

| Event | First 15 minutes | Then |
|---|---|---|
| Fire | Animals out, people out, call for help; do not fight a large fire | Photos; tell the founder; report; check the insurance position (T81) |
| Flood or heavy storm | Move animals to higher ground away from the lake side; shut off pumps | Damage log; repair order |
| Suspected notifiable disease | Isolate, stop all movement on and off, call the vet and the sector veterinary officer [V LVS-40] | Follow the vet; keep visitors out; keep records of every contact |
| Injury to a worker | First aid; transport to the nearest health centre | Report to the founder; log the incident |
| Theft or break-in | Do not confront; call the village leader and the local police; count the animals | Photo evidence; update locks and watch routine |
| No water | Switch to stored water; ration; call the founder | Source repair; delay non-essential tasks |
| Snake bite, heat, other health emergencies | Local emergency number and nearest clinic; numbers kept on the wall (the nearest clinic is [U] until the site is known) | Incident log |

## 10. Handover and training

- A new worker gets a half-day induction: the layout, the buffer line, biosecurity rules, the daily checklist, the log, who to call.
- A full day's handover from founder to manager, and from manager to deputy, is rehearsed once per quarter so the farm can run if the manager is ill.
- Contact sheet on the wall: founder, vet, sector veterinary officer, sector agronomist, village leader, nearest health centre, nearest police post, electrician or plumber, main buyer [all U until the site is known].

## 11. Reviewing this file

- Review after 90 days of animals and again after the first harvest. Change it by editing and logging a decision-log entry if a routine is dropped or added, with the reason.
- No sources were added by this file; all labels point to existing IDs in `study/registers/sources.csv`.
