# Technology strategy — Stage 5

Status: Stage 5 draft · Date: 2026-10-19 · Location: **unconfirmed** · Owner: electrical/automation engineer + software/AI architect
Evidence labels as in `CLAUDE.md`: `[V]` verified (source ID), `[E]` estimate (method shown), `[A]` assumption, `[U]` unknown. New sources are `ENG-nn` in `../registers/incoming/eng-sources.csv`.

## 1. The answer

1. **Buy visibility first, control later.** Start at Tier 0 (manual, with a few meters and a rain gauge). Add a **Tier 1-lite** monitoring kit (about RWF 1.4–3.1M [E]) when the water system exists and the orchard is planted. Buy Tier 2 (valves and a controller) only after one dry season of Tier 1 data shows manual irrigation failing a defined test. Tier 3 is not justified at 2–10 ha and under USD 25k [E].
2. **The financial model says technology deepens the funding gap unless it measurably lifts yield or price.** It is right. Its M3 placeholders (sensors 3.0M, connectivity 0.6M, software 1.5M, security 1.5M, cool store 5.0M, PV 2 kWp) are RWF 11.6M before the pump and drip; the Tier 3 bill of materials below (RWF 10.4–25.9M [E]) confirms that scale. Nothing in the evidence found yet supports a yield or price lift that pays for it.
3. **What technology can honestly claim on this farm** is risk reduction and founder time, not yield:
   - catch a dry pump, an empty tank or a leak before young trees or animals suffer;
   - replace some of the 116 km round trips from Kigali (about RWF 26,700 of fuel each [E]: petrol RWF 2,303/l [V BUY-59, CRP-10], 58 km one way [E LOC-17], 10 km/l [A]);
   - produce the records buyers and funders ask for.
4. **Sensor-driven yield gains are unproven for avocado.** The only quantified results are for other crops (yield +9–10%, water −10–16% [C ENG-11]). The one avocado trial found so far reports some sensors unreliable and no final figures [B ENG-10]. Treat any yield uplift as `[U]` until our own trial measures it.

## 2. Method

For every item: **problem → technology → tier → cost → measurable value → when to buy (decision gate)**. If the problem cannot be written as a measurable failure, the item is not bought.

Costs are landed RWF ranges. Method for every `[E]` cost: international catalogue price in USD (low–high, `[A]`) × quantity × BNR USD/RWF 1,475.24 on 2026-10-19 [V MKT-04] × 1.5 for freight, duty, levies and margin `[A]`. **None is a Rwandan quote.** The only catalogue price actually seen is an ESP32 module at USD 5.06 [B ENG-15]. Rwandan quotes (T12) replace every line. Excluded from tier costs because they exist at every tier: the pump, tanks, pipes, drip lines and the solar array (see `electrical-system.md`, `../feasibility/` model).

## 3. Problem → technology → tier → cost → value → gate

| # | Problem (what fails, and what it costs) | Technology | Tier | Cost [E] | Measurable value | Decision gate: buy when |
|---|---|---|---|---:|---|---|
| P1 | Founder is not on site daily; no way to know the state of water, pump or animals between visits | Gateway, 4G router, pump-current and tank-level readings on one dashboard, phone alerts | 1 | RWF 1.1–2.2M for gateway, router, cabinet, power, level, flow, current (components in section 6) | Site visits avoided per year × RWF 26.7k [E]; time to detect a stopped pump (target < 30 min vs next visit) | Site confirmed; water system installed; cellular signal measured at the pump house |
| P2 | Dry-season pump failure or empty tank kills young trees (grafted seedling RWF 800–1,500 [V CRP-P32] plus 1–2 years of delayed bearing; year-5 revenue about RWF 9,000 per tree [E from the model's 2.29M for 255 plants]) and strands animals without water | Hardwired dry-run and overload protection (always), plus tank-level and pump-current alerts | 0 (protection) + 1 (alerts) | Protection RWF 0.15–0.35M; alerts included in P1 | Trees and animals lost to water failure: target zero; each 70 trees lost is about RWF 0.7M once [E] | Protection: with the pump. Alerts: with P1 |
| P3 | Leaks or open valves waste water, pumping energy and permit headroom (irrigation over 1 ha needs a permit [V LOC-04]) | Two flow meters (pump outlet, tank outlet), nightly volume check | 0 (meters, manual read) → 1 (logged) | RWF 0.11–0.20M (mechanical) to 0.09–0.22M (pulse) | Litres per day vs expected; leak found within 1 day vs at the next visit | Meters with the pipework; logging with P1 |
| P4 | Over- or under-watering orchard blocks and the nursery | Soil-moisture probes (calibrated), tank-level, rain gauge; irrigate from a fixed schedule adjusted by the readings | 0 (hand probe) → 1 (logged probes) | RWF 0.13–0.33M (T0); probes and nodes RWF 0.31–1.3M (T1) | Water per tree and kWh per m³ vs the first season; any yield change is `[U]` and must be measured against an unsensored block | T1 probes after planting; keep one control block irrigated by schedule only |
| P5 | Manual valve operation costs labour and fails when the worker is absent | Latching valves, relay driver, controller with schedule and manual override | 2 | +RWF 1.2–3.3M [E] (T2 add-on) | Labour minutes per day on irrigation; missed irrigations per month (target < 1) | Gate E2 below, after one dry season |
| P6 | Intrusion, equipment and livestock theft | Lights, 2 cameras on a local recorder, gate contact, siren; phone alert | 1 | RWF 0.27–0.66M for 2 cameras and switch; lights counted in power | Incidents per year; time-to-response; insurance or loss figures `[U]` | Once a store, animal house or pump house holds value; before livestock arrives |
| P7 | Grid absent, far or unreliable; diesel is costly | Solar PV for the pump; small PV and battery for always-on loads | all | See `electrical-system.md` section 6: PV and battery RWF 4.5–8.0M for about 2 kWp and 3 kWh [E] | Hours of lost monitoring; kWh and RWF per m³ over 15 years | Design after REG distance and loads are known |
| P8 | Animal losses and poor performance go unseen (worms are the top health problem [V LVS-10]) | Numbered ear tags, a register (phone form), a platform scale or weigh-band, a monthly weighing | 0 | RWF 0.05–0.2M [A] | Mortality %, kid growth (g/day), treatments per animal | At animal purchase; EID only when records are proven (section 4) |
| P9 | Rain makes irrigation unnecessary; forecasts guide spray and harvest timing | Rain gauge (local rule: skip irrigation); online forecast as advice only | 0 → 1 | RWF 0.02–0.09M | Irrigation events skipped after rain; mm per season logged | With the first drip block |
| P10 | Fruit quality loss after harvest | Shade, ventilation and fast transport first; cold storage only when a buyer pays for it | 3 (cold) | RWF 5.0M placeholder in the model, not costed here | Price premium or loss avoided vs RWF cost; avocado travels hard-green and does not need farm cold storage `[A]` | A named buyer's written spec requires it |
| P11 | Records scattered across paper and chat; no cost per line; export or loan files ask for traceability | Farm records platform (adopt farmOS first) | 0 → 1 | Free licence; hosting RWF 0.1–0.3M a year `[A]`; setup time | Records complete on time (target > 90%); month-end close in < 1 day | After 8–12 weeks of working records on spreadsheets (see `software-architecture.md`) |
| P12 | Cannot judge whether the farm is on plan | Weekly summary and forecast-vs-actual report | 1 | Software time only | Variance of actual vs model per line | After 3 months of data |

## 4. Technology deliberately not bought (yet)

| Item | Why not now | Revisit when |
|---|---|---|
| Electronic animal ID (EID) readers and tags | A register and visible tags answer every question a herd of about 40 raises; EID pays when manual identification costs more than reader and tag | Herd above about 100 head or a buyer requiring individual traceability `[A]` |
| GPS collars, drones, robots | Fence, paddock rotation and a night check solve the defined problem at a fraction of the cost | A measured escape or theft problem fences cannot fix |
| Automated fertigation, EC/pH control | Fertiliser decisions follow soil tests (see soil plan); automation adds fouling and failure modes | Drip block proven for two seasons and a nutrient programme exists |
| Full weather station (wind, solar radiation) | Rain and temperature change decisions; wind and radiation do not at this scale | Frost, spray drift or an evapotranspiration model is shown to change a decision |
| SCADA and industrial PLC | Justified by safety or reliability needs the small farm lacks | Farm above about 10 ha, a 3-phase pump, or a VFD (section 6) |
| AI vision (crop disease, animal behaviour) | No labelled local data; false alarms cost labour | After 12+ months of structured photo records |
| Cold room | See P10 | A buyer contract requires it |

## 5. Tier comparison

Bill of materials in section 6. Capital excludes pump, tanks, pipes, drip and the main PV array. Operating cost = 10% of capital per year for spares and repairs `[A]` plus SIM data of RWF 15,000 per month for T1–T2 and twice that for T3 `[A]`.

| | **T0 Manual** | **T1 Low-cost monitoring** | **T2 Semi-automated** | **T3 Fully automated** |
|---|---|---|---|---|
| What it is | Meters, rain gauge, hand probe, notebook or phone form; hand valves | T0 plus logged soil moisture, tank level, flow, pump current, rain; gateway and phone alerts; 2 cameras | T1 plus latching valves per zone, a controller with schedules, hardwired pump protection, local override | T2 plus industrial PLC and VFD, fertigation, LoRaWAN, livestock EID and scale, SCADA, extra cameras |
| Capital [E] | RWF 0.30–0.76M | **T1-lite** RWF 1.35–3.10M; T1 full RWF 1.77–4.65M | RWF 2.97–7.73M | RWF 10.4–25.9M |
| 5-year cost incl. upkeep [E] | RWF 0.45–1.14M | T1-lite 2.9–5.6M; T1 full 3.6–7.9M | RWF 5.4–12.5M | RWF 17–41M |
| Extra electricity | 0 | about +1.0 kWh/day [E] | about +1.9 kWh/day | about +5.0 kWh/day (cold room extra, about 7 kWh/day `[A]`) |
| Daily labour on irrigation `[A]` | 1.0–1.5 h of valve work and checks | 0.5–1.0 h; checks guided by alerts | about 0.2 h; weekly checks | about 0.1 h; weekly checks |
| Visibility | What a person saw today | Near real time; history; alerts | Same, plus valve state | Same, plus full trends and remote setpoints |
| Reliability risk | A person forgets or is absent | Sensor drift and dead batteries; no control, so a fault cannot make things worse | Valve stuck, controller or logic fault can flood or starve | Highest complexity; many failure modes; needs specialist support |
| Skills needed | Farmer discipline | Founder (E&C and software) can build and fix | Founder, plus a local electrician for the pump panel | Integrator-level; founder is a single point of failure |
| Works without internet | Yes | Logs locally; alerts need cellular | Yes for scheduled irrigation (see `irrigation-automation.md`) | Yes if designed so; more to test |
| Fits 2–10 ha under USD 25k | Yes | **Yes** | Conditional (gate E2) | **No** [E] |
| Evidence of agronomic benefit here | Baseline | None yet for avocado `[U]`; indirect from other crops [C ENG-11] | Labour saving is direct; yield gain `[U]` | None |

## 6. Cost build-up (RWF, landed, `[E]` method in section 2; catalogue prices `[A]`)

### Tier 0

| Item | Qty | RWF low | RWF high |
|---|---:|---:|---:|
| Manual rain gauge | 1 | 22k | 89k |
| Mechanical water meters DN25 (pump outlet, tank outlet) | 2 | 111k | 199k |
| Tank dip-stick or float gauge | 2 | 22k | 111k |
| Hand soil probe and 2 tensiometer-type gauges | 1 | 133k | 332k |
| Logbook, phone forms | 1 | 11k | 33k |
| **Total** | | **0.30M** | **0.76M** |

### Tier 1 (full) — T1-lite is the first 10 lines with 3 nodes, 4 probes, a lighter rain gauge and no cameras

| Item | Qty | RWF low | RWF high |
|---|---:|---:|---:|
| ESP32 field nodes with enclosure, solar cell, Li-ion (per node) | 6 | 239k | 531k |
| Soil-moisture probes, calibrated | 8 | 71k | 797k |
| Tank-level sensor (ultrasonic or pressure) | 2 | 111k | 310k |
| Pulse flow meters DN25 | 2 | 89k | 221k |
| Pump current/power monitor | 1 | 44k | 111k |
| Rain gauge and basic temperature/humidity station | 1 | 133k | 443k |
| Edge gateway (Raspberry Pi-class, SSD, case, supply) | 1 | 221k | 354k |
| 4G router with antenna | 1 | 133k | 288k |
| Cabinet, IP65 enclosure, glands, surge protection | 1 | 133k | 266k |
| Gateway power: 100 W panel, 50 Ah LiFePO4, MPPT | 1 | 332k | 664k |
| 2 IP cameras and PoE switch | 1 | 266k | 664k |
| **Total T1 full** | | **1.77M** | **4.65M** |
| **T1-lite (3 nodes, 4 probes, 1 camera dropped)** | | **1.35M** | **3.10M** |

The probe range is wide on purpose: a capacitive probe (about USD 4 `[A]`) versus a Watermark-type tensiometer (about USD 45 `[A]`). Capacitive probes need per-sensor, per-soil calibration (RMSE 4.5–4.9% after calibration, sensor-to-sensor spread up to 16% [B ENG-09]). Choose after the soil test, not before.

### Tier 2 add-on

| Item | Qty | RWF low | RWF high |
|---|---:|---:|---:|
| Latching DC solenoid valves (4 zones and 1 flush) | 5 | 199k | 498k |
| Valve driver or relay module, IP65 | 1 | 89k | 266k |
| Pump contactor, overload, dry-run relay, HOA switches (small panel) | 1 | 332k | 775k |
| Pressure transducers (pump outlet, zone head) | 2 | 111k | 266k |
| Screen/disc filter with differential-pressure switch | 1 | 133k | 398k |
| More cameras, PIR, siren | 1 | 332k | 885k |
| **Add-on** | | **1.20M** | **3.09M** |

### Tier 3 add-on (above T2): industrial PLC panel RWF 1.1–2.7M; pump VFD 0.8–2.0M; fertigation with EC/pH 0.9–2.7M; LoRaWAN gateway and 10 nodes 1.1–2.4M; livestock EID, scale, 4 auto troughs 2.0–4.9M; SCADA screen, UPS, 4 more cameras, NVR 1.5–3.5M. **Add-on RWF 7.4–18.2M** (T3 total 10.4–25.9M).

## 7. Value case for the recommended tier (T0 now, T1-lite at Gate E1)

| Benefit | Inputs | Annual value [E] | Confidence |
|---|---|---:|---|
| Site visits avoided | 20–50 visits a year × RWF 26.7k fuel; excludes the founder's time and vehicle wear | RWF 0.53–1.34M | Depends on whether the founder lives on site `[U]`; a founder on site gets this at zero cost |
| Yield uplift on the avocado block | 1.25 ha: planning case 24 kg/tree [A CRP-45] × about 200 trees/ha [A, check the model's density] = 4.8 t/ha × RWF 600/kg farm-gate [E from MKT-03 medians] ≈ RWF 3.6M; exporter yield 12 t/ha ≈ RWF 9M [V CRP-20]; uplift 0–10% | RWF 0–0.9M | `[U]` Not shown for avocado. Test with a control block |
| Pumping energy | about 4.1 kWh/day × 10–16% saved × RWF 376 [V ENG-01] | RWF 0.06–0.09M | Small; the real saving is a smaller PV array |
| Loss avoided (one failure in the first 5 years) | 70 trees ≈ RWF 0.7M once; or a herd water failure | RWF 0.7M once | Probability `[U]`; the protection (P2) captures most of it at Tier 0 |

Reading: on a 5-year cost of RWF 2.9–5.6M for T1-lite [E], the case holds only if the kit replaces about 20 or more trips a year, or prevents a total block loss, or the control-block trial shows a real uplift. **If the founder is on site daily, buy only Tier 0 plus pump protection and a tank-level alarm.** The founder's days on site (question 7) decide this.

## 8. Decision gates

| Gate | Condition | Action | Spend |
|---|---|---|---:|
| E0 (now) | Site unknown | Write-up only; collect Rwandan quotes for pump, PV, meters, sensors (T12) | 0 |
| E1 | Site confirmed; water source and permit status known; pump house location fixed; cellular signal tested at the pump house; trees or animals due within 3 months | Install Tier 0, pump protection, then T1-lite; open a control block; start the log book | RWF 1.7–3.9M [E] |
| E2 | One dry season of T1 data, and either (a) irrigation by hand misses its schedule more than once a month, or (b) logged deviation from target moisture exceeds 20% in more than 30% of days `[A]`, or (c) no reliable operator on site; and funding gap closed or covered | Add valves and controller one zone at a time, with manual override intact | RWF 1.2–3.1M |
| E3 | Farm above about 10 ha, or a buyer contract pays for traceability or cold chain, or a regulated need arises | Re-open Tier 3 items one by one, each with the table in section 3 | Case by case |
| Review | Every gate | Record in `../execution/decision-log.md` | |

## 9. Gaps that block a firm design

1. Location, pin or UPI: terrain, signal, distance to the REG line, solar resource.
2. Water source, its yield and the permit: sets pump head, flow and the whole load schedule.
3. Rwandan quotes for every `[A]` catalogue price (T12).
4. Whether RURA permits LoRaWAN in 863–870 MHz, and its power and duty-cycle limits [C ENG-07].
5. The farm's electricity tariff category and connection fee [B ENG-01].
6. Founder's days on site; sets the value of remote visibility.
