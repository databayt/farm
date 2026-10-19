# Maintenance

Status: Stage 7 draft · Created: 2026-10-19 · Location: **unconfirmed**
Intervals are `[A]` starting points. Replace them with the manufacturer's or installer's instructions as each asset is bought (put the manual or a photo of the plate in the asset register). Design details are in `study/engineering/`; the dates and gates are in `../execution/five-year-roadmap.md` (T84 starts this system in April 2027).

## 1. Principles

1. **Preventive beats reactive.** A fence gap, a leak or a dry pump costs a day of work now or a lost animal or tree later.
2. **Every asset has an owner and an interval.** No owner, no maintenance.
3. **Every job is logged.** The logbook (section 9) is the farm's memory and feeds the cost records (`recordkeeping.md`).
4. **Spare parts for the single points of failure** are kept on site (section 8).
5. **Safety first:** isolate power, wear gloves, boots and eye protection, do not work on a pump or panel alone, and never enter a tank without a second person outside.
6. **Lake protection:** no oil, fuel, paint, cleaning water or chemicals within the 50 m buffer or running toward the lake [V LOC-02, LOC-01].
7. Maintenance budget: about 2–3% of installed capital a year, plus labour [A]; the model carries maintenance inside the roughly RWF 3M a year of overheads for a worker, admin, utilities and maintenance [E PROJECT_STATUS, financial-model-notes.md].

## 2. Asset register (starts as soon as the first asset is installed)

One row per asset in the `Maintenance` tab (`recordkeeping.md`):

| Field | Example |
|---|---|
| Asset ID | FEN-01, TNK-02, PMP-01, PV-01, BLD-02 |
| Type, make, model, serial number | Photo of the plate |
| Location | Block or building; GPS point |
| Installed date; supplier; warranty end | `YYYY-MM-DD` |
| Cost (RWF) and the CapEx line it belongs to | CX numbers from the financial model |
| Owner | FM or a named worker |
| Interval and the job list | From this file or the manual |
| Last done; next due | The tab computes it |
| Spare parts held | Count |
| Notes | |

## 3. Preventive schedule

### 3.1 Fences, gates and tree guards (CX06–CX08, T37)

| Interval | Job |
|---|---|
| Daily (morning round) | Eyeball the perimeter and gate; fix a gap before leaving it |
| Weekly | Walk every line; check posts, wire tension, gate latches and hinges; check the animal-house door |
| After a storm or flood | Walk all lines; remove debris; check washouts near the lake side |
| Monthly | Tension the wire; replace damaged posts; tighten guards; clear brush that leans on the fence |
| Yearly (dry season) | Treat or replace posts that rot; repaint or oil gates; renew warning signs |

### 3.2 Water system (tanks, gutters, pipes, taps, troughs; CX09–CX10, T35)

| Interval | Job |
|---|---|
| Daily | Read tank levels; look for leaks; trough water clean and full |
| Weekly | Check taps, floats, valves; clear trough sludge; check first-flush diverter |
| Monthly | Gutters and screens cleaned; pipe joints inspected; manual vs sensor reading compared |
| Before each rainy season (Feb and Sep) | Gutters, screens, first-flush device and overflow pipes cleared; overflow directed away from the lake and from the animal house |
| Twice a year | Tank emptied, scrubbed and rinsed with the water left to drain away from the buffer; lid and mosquito mesh checked (mosquitoes matter for RVF [V LVS-03]) [A] |
| Yearly | Water test repeated for the sources (wet and dry season rounds, per `../discovery/soil-water-testing-plan.md`); permit renewals and the annual water-use report if a permit exists [V LOC-04] |

### 3.3 Pumps, irrigation and drip (CX11–CX13, T36, T54)

| Interval | Job |
|---|---|
| Before each use season | Prime and run; check suction, seals, valves, hose connections; confirm the manual override works |
| Daily while irrigating | Pressure and flow look right; no leaks; emitters wet |
| Weekly while irrigating | Filter cleaned; flush the ends of the lines |
| Monthly | Check the pump base, bolts, electrical connections; look at the well or intake screen |
| Seasonal | Flush the full network; check emitters in a sample of rows; repair or replace blocked emitters |
| Yearly | Service per the manual; replace worn seals |
| Fault | A pump that does not start, loses prime or trips is isolated and logged; no repeated restarts |

### 3.4 Solar, power and electrical (CX24, T53)

| Interval | Job |
|---|---|
| Weekly | Look at the inverter or controller display for faults; note the battery state |
| Monthly | Panels cleaned in the morning with water and a soft cloth (dust in the dry season); shade check as trees grow; terminals checked for corrosion |
| Quarterly | Tighten electrical connections with the power off; test the protective devices; inspect cables for rodent or sun damage |
| Yearly | Battery check as the supplier specifies; earthing check; the installer's inspection if possible |
| Rule | Only a qualified electrician works inside the cabinet or on the wiring |

### 3.5 Sensors, controllers and the network (CX25–CX27, T52–T57)

| Interval | Job |
|---|---|
| Weekly | Dashboard glance: all nodes reporting; battery levels |
| Monthly | Manual reading beside each sensor; difference within the tolerance set at commissioning |
| Quarterly | Clean sensors and enclosures; reseal cable glands; replace batteries on schedule; firmware or settings changes logged |
| Yearly | Recalibrate where the maker says to; review which sensors earn their upkeep (G6b); keep a paper fallback |
| Rule | The farm must run if the app does not. Every automatic task has a manual step in the SOP |

### 3.6 Buildings (animal house, quarantine pen, feed store, base; CX19–CX21)

| Interval | Job |
|---|---|
| Daily | Door, floor and drains look right; bedding dry |
| Weekly | Clean pens, remove manure, replace bedding; sweep the feed store; check for rodents |
| Monthly | Roof, walls and gutters inspected; ventilation clear; floor slats or boards safe |
| Before the rainy season | Roof leaks repaired; drainage around the building cleared |
| Yearly | Disinfection of pens as the vet advises; repaint or treat timber; check lightning protection if fitted |
| Rule | Footbath or boot-cleaning point for the pen entrance is topped up (`livestock-management.md` 11) |

### 3.7 Tools and small equipment (CX23)

| Interval | Job |
|---|---|
| After each use | Clean, dry and return to its hook; sharpen blades weekly |
| Weekly | Check handles and cutting edges; oil moving parts |
| Monthly | Tool count against the list; replace worn items |
| Yearly | Overhaul or replace; stock-take |
| Rule | Pruning tools are cleaned between trees or vines in diseased blocks [A] |

### 3.8 Scale, thermometer, small instruments

| Interval | Job |
|---|---|
| Before each weighing day | Zero the scale; test with a known weight (a sealed water container of known mass) |
| Quarterly | Compare against a reference scale if one is reachable |
| Each month | Rain gauge emptied and checked for blockage |

## 4. Seasonal maintenance calendar

| Season | Priority jobs |
|---|---|
| Season A rains (Oct–Dec) | Gutters and drains; fence check after storms; mud and drainage around pens; green pasture parasite watch with the vet |
| Short dry (Jan–Feb) | **Works season:** repair fences, build tanks, re-roof, paint, service pumps and the solar array, replace posts |
| Season B rains (Mar–May) | Check roof catchments and the first-flush device; planting tools sharpened; paddock fences tested before animals graze |
| Long dry (Jun–Aug) | Pump and filter attention; water-level readings; dust on panels; fire break around buildings and hay store; fence check against theft |
| Transition (Sep) | Pre-rain walk of every system; spare-parts top-up |

## 5. Corrective maintenance

| Step | Rule |
|---|---|
| Report | Anyone who sees a fault tells the FM the same day; a photo and place are enough |
| Classify | **Urgent** (animals could escape or be harmed, no water, electrical hazard, lake risk): fix or secure within the day. **Soon** (within a week). **Planned** (in the next works season) |
| Fix | The FM fixes what he can safely; others go to a contractor with a quote |
| Verify | The founder or FM checks the fix and signs the entry |
| Learn | A repeated failure triggers a design change, noted in the decision log |

## 6. Predictive signals worth logging

- Trend in litres pumped per day (a rise means a leak; a fall means a block).
- Drop in battery runtime.
- Animals going to one corner of a fence.
- Tank refill rate after rain compared with the previous year.
- Vibration, noise or heat in a pump.

## 7. Contractors and warranties

- Keep each supplier's name, number, invoice and warranty in the asset register.
- Quotes: three per major repair, as for T12.
- No contractor works near the buffer line without the founder's check of the staked map.

## 8. Spares and consumables

An initial list to be confirmed in the engineering design [A]: fence wire, staples, spare posts and a few spare gate fittings; tank float valve; pipe fittings and a short length of each pipe size; pump seals and a spare impeller for a small pump if the maker sells one; fuses and breakers; spare drip emitters and a filter cartridge; panel connector; spare sensor batteries; tools' spare handles; first-aid kit; gloves and boots; chlorine or the water-cleaning product the vet and the water lab advise (no quantity given here). A minimum-stock line per spare lives in `Inventory`.

## 9. Logbook format (the `Maintenance` tab)

| Column | Content |
|---|---|
| Date | `YYYY-MM-DD` |
| Asset ID | From the register |
| Type | Preventive / corrective / inspection / calibration |
| Description | What was found and done |
| Time spent (hours) and by whom | |
| Parts and cost (RWF) | Linked to a `Costs` row |
| Result | OK / fixed / needs follow-up |
| Next due | |
| Photo link | |
| Signed off by | FM; founder for urgent items |

Weekly, the FM adds what was done; monthly, the founder reads the tab for overdue jobs and repeated faults. Overdue jobs are red in the sheet and are reviewed at the Monday call.

## 10. Maintenance metrics

| Metric | Why |
|---|---|
| Preventive jobs done on time (%) | Discipline |
| Hours lost to breakdowns | Reliability |
| Maintenance cost per month and per asset | Feeds the financial model's overheads |
| Number of fence breaches | Animal and tree safety |
| Pump and sensor uptime | Evidence for the technology gates G6 and G6b |

## 11. Handover rule

At the moment a contractor hands over a new system, the farm gets: the as-built drawings or sketches, the manual, the warranty, the spare list, and a walk-through with the FM, recorded in the asset register (T35, T37, T44, T53).

No sources were added by this file.
