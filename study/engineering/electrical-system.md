# Electrical system — preliminary design basis

Status: Stage 5 draft · Date: 2026-10-19 · Location: **unconfirmed**
Labels: `[V]` verified, `[E]` estimate, `[A]` assumption, `[U]` unknown (`CLAUDE.md`). Sources `ENG-nn` are in `../registers/incoming/eng-sources.csv`.

## 0. What this document is not

This is a **load schedule and a comparison method**, not a design. Per the brief, **no cable size, protection setting, equipment rating or earth-electrode value is finalised here.** Every figure marked `[A]` is a placeholder until three things exist:

1. the actual equipment (pump curve, controller datasheets);
2. the site: distance to the REG line, water level, soil resistivity, shading, the pump-house position;
3. the applicable standards and Rwandan requirements (Rwanda Standards Board adoption of IEC, REG connection rules, and who may certify installations) `[U]`.

Mains and PV wiring must be designed, installed and certified by a qualified, authorised electrician or installer where Rwandan rules require it `[U]`. The founder's role is design review, testing and commissioning.

## 1. Preliminary load schedule

Basis: a 5 ha farm of model type M2/M3 with a 1.75 ha drip-irrigated orchard, a goat house, a store/workshop and a small house or caretaker room. The pump line is the only large load. The pump values (head 30 m, 20 m³/day, overall efficiency 0.4, 5 hours of daytime running) are **placeholders `[A]`**; hydraulic energy follows E = ρ·g·H·V / η. Watts are electrical; "hours" are full-power equivalent hours per day.

| Load | Watts | Hours/day | kWh/day | In tiers | Notes |
|---|---:|---:|---:|---|---|
| Irrigation pump (solar or grid, AC or DC `[U]`) | 820 | 5.0 | 4.09 | all | 1.1 L/s at 30 m head `[A]`; sensitivity below |
| Livestock water transfer pump | 250 | 1.0 | 0.25 | all | Trough filling |
| Workshop and store tools (intermittent) | 1,000 | 0.5 | 0.50 | all | Daytime only |
| LED lighting: house, store, workshop (8 × 10 W) | 80 | 4.0 | 0.32 | all | Evening |
| LED security lighting (4 × 20 W, dusk to dawn) | 80 | 11.0 | 0.88 | all | On photocell |
| Edge gateway (Raspberry Pi-class, SSD) | 7 | 24 | 0.17 | T1–T3 | |
| 4G router | 8 | 24 | 0.19 | T1–T3 | |
| Field nodes, 6 × about 0.15 W average | 0.9 | 24 | 0.02 | T1–T3 | Own small solar cell and Li-ion; not on the main bus |
| Pump monitor, level and flow sensor supply | 3 | 24 | 0.07 | T1–T3 | |
| 2 IP cameras and PoE switch | 20 | 24 | 0.48 | T1–T3 | |
| Valve driver and latching valves (pulse only) | 2 | 24 | 0.05 | T2–T3 | Latching valves draw only when switching |
| Control panel: relays, contactor coils, DIN supply | 8 | 24 | 0.19 | T2–T3 | |
| Extra cameras (4), PIR and siren | 30 | 24 | 0.72 | T2–T3 | In T1, 2 cameras only |
| Industrial PLC, HMI, switch, UPS losses | 45 | 24 | 1.08 | T3 | |
| LoRa gateway and nodes | 12 | 24 | 0.29 | T3 | |
| Fertigation pump (0.18 kW) | 180 | 1.0 | 0.18 | T3 | |
| EID reader, scale, auto troughs (average) | 25 | 24 | 0.60 | T3 | |
| NVR and extra T3 cameras | 40 | 24 | 0.96 | T3 | |
| **Optional** cold room (0.75 kW compressor, 40% duty) | 750 | 9.6 | 7.20 | not in tiers | Only if a buyer requires it (`technology-strategy.md` P10) |

### Estimated daily energy by tier `[E]`

| Tier | kWh/day | kWh/year | Always-on (24 h) loads | Share that is the pump |
|---|---:|---:|---:|---:|
| T0 Manual | 6.05 | 2,208 | 0 | 68% |
| T1 Low-cost monitoring | 6.98 | 2,548 | 0.93 kWh | 59% |
| T2 Semi-automated | 7.94 | 2,898 | 1.89 kWh | 52% |
| T3 Fully automated | 11.05 | 4,033 | 4.82 kWh | 37% |
| T3 plus cold room | 18.25 | 6,661 | | |

Reading: **monitoring costs about 1 kWh a day; the pump costs about 4.** The technology tier hardly changes the power system until Tier 3. The head, the daily volume and the pump efficiency change it far more:

| Pump energy (kWh/day) | 14 m³/day | 20 m³/day | 35 m³/day |
|---|---:|---:|---:|
| Head 15 m | 1.43 | 2.04 | 3.58 |
| Head 30 m | 2.86 | 4.09 | 7.15 |
| Head 60 m | 5.72 | 8.17 | 14.31 |

(η = 0.4 `[A]`.) A borehole 60 m deep irrigating a mature orchard needs about three times the PV array of a lake or tank-fed 15 m lift. **The pump line must be sized from the site's water source, the permit and the crop water balance, not from this table.** A solar borehole of 160 m reportedly cost RWF 80M (RWF 49M subsidised) on one Kayonza farm [C LVS-62]: the water source can cost more than every other item in this study.

## 2. Supply options

| Option | Description | Strengths | Weaknesses | Decided by |
|---|---|---|---|---|
| A. Grid only | REG connection; all loads on mains | No battery; unlimited energy; pump runs at night | Connection cost and distance `[U]`; outages; tariff 355 RWF/kWh to 100 kWh a month and 376 above (non-residential) [V ENG-01]; residential tiers 89/310/369 [V ENG-01] | REG line distance (grid reaches 54.7% of Bugesera households, 60.2% in Rwamagana [V LOC-32]) |
| B. Solar PV + battery, no grid | PV for pump and loads; battery for night and monitoring | Independent of REG; cheapest per kWh once built; no connection fee | Battery replacement; cloudy-day shortfall; no energy at night for the pump unless stored | Site solar resource and the 15-year cost |
| C. Grid + solar pump | PV direct to the pump (no battery); grid for everything else, UPS or small battery for monitoring | Lowest total cost if the line is close; pump demand removed from the tariff | Two systems; needs a connection | REG distance |
| D. Solar pump only, separate small PV and battery for monitoring | Pump has its own PV; a small 12 V system runs gateway, router, cameras and lights | Simplest and most robust; failure of one does not stop the other; works for T0 to T2 | Larger loads (workshop) need a generator or grid | **Recommended starting point** |
| E. Diesel or petrol generator | Backup only | Cheap to buy | Fuel (petrol RWF 2,303/l [V CRP-10, BUY-59]); noise; maintenance; theft | Backup for workshop and outage only |

**Recommendation `[E]`:** design D (or C if a line is near), with the pump on a direct-coupled solar array and its own tank buffer. Water stored in a tank is cheaper energy storage than a battery. As an order of magnitude, 20 m³ raised 30 m stores about 1.6 kWh of hydraulic energy `[E]` and costs far less than a 5 kWh lithium battery `[A]`. Confirm with quotes.

### Solar resource and sizing method `[A]`

- Planning defaults for Rwanda: 4.8 peak sun hours a day, performance ratio 0.78 [D ENG-16]; Bugesera long-term global irradiation above 1,700 kWh/m² a year [D ENG-16]. Taking 0.75 for dust, heat and wiring gives about **3.6 kWh per kWp per day**. Replace with a Global Solar Atlas or PVGIS lookup once the pin exists `[U]`.
- Day loads run direct from PV. Night loads (monitoring, cameras, security lights, about 2.2 kWh in T1) come from a battery with 85% round-trip efficiency `[A]`. For T1: gross daily PV energy about 4.8 (day) + 2.2 / 0.85 = 7.4 kWh, which gives **about 2.0 kWp**. Add 20% for cloudy-week margin: **about 2.5 kWp for everything on one system**.
- Battery for monitoring and lights only: about 2.4 kWh usable for one night plus one cloudy day on essential loads, so about **3 kWh nominal** lithium iron phosphate at 80% depth of discharge `[A]`. This is not the pump battery.
- Pump array about 1.3 × pump input power `[A]` for lower irradiance, so roughly 1.1–1.2 kWp for an 820 W pump. The pump controller (MPPT or VFD) and motor type are chosen from the pump curve.
- The model's own placeholders (PV 0.3 / 0.6 / 2 kWp for M1 / M2 / M3) bracket this; M2 at 0.6 kWp cannot run a pump of this size `[E]`. This must be reconciled in T17.

## 3. Life-cycle cost comparison method

Compare options over **15 years at a 12% real discount rate** (matching the model's rate). Same method for every option:

LCC = C₀ + Σ O&M_t/(1+r)^t + Σ E_t/(1+r)^t + Σ R_k/(1+r)^{t_k} − S/(1+r)^N + L

| Term | Meaning | Source or placeholder |
|---|---|---|
| C₀ | Installed capital (equipment, install, certification, taxes) | Quotes; placeholders below |
| O&M_t | Maintenance: 1.5% of capital a year for PV, 10% for electronics `[A]` | `[A]` |
| E_t | Energy bought (grid kWh × tariff; fuel × price) | Tariff [V ENG-01]; fuel [V CRP-10] |
| R_k | Replacements: battery (year 10 for LiFePO4 `[A]`; year 4–5 for lead-acid `[A]`), inverter (year 10), pump | `[A]` |
| S | Residual value (set to zero for conservatism) | `[A]` |
| L | Cost of lost service: outage hours × value of the load; here priced as the cost of a backup | `[U]` |
| N, r | 15 years, 12% real | `[A]` |

Also report: **RWF per kWh delivered** (LCC ÷ discounted kWh), **RWF per m³ of irrigation water**, and the **break-even connection cost** (the grid connection fee at which A equals B). Report ranges, not points, and run a sensitivity on tariff ±30%, battery price ±40%, and load ±25%.

### Worked illustration (T1 load, 6.98 kWh/day) `[E]` — placeholders, not a recommendation

Inputs `[A]`: PV USD 0.9 / 1.2 / 1.6 per Wp installed; lithium battery USD 300 / 400 / 550 per kWh; inverter USD 350 / 450 / 600; BNR RWF 1,475.24 per USD [V MKT-04]; tariff RWF 376 per kWh (non-residential) [V ENG-01]; UPS USD 300 for the grid option; the grid connection fee is unknown.

| Option | Capital (RWF M) | 15-year LCC (RWF M) |
|---|---:|---:|
| B. Solar PV 2.0 kWp + 3 kWh battery, no grid | 4.5 / 6.0 / 8.0 (low/base/high) | 5.6 / 7.4 / 9.9 |
| A. Grid only, connection fee 0.5M plus small UPS | 0.9 | 7.6 |
| A. Grid only, connection fee 2M | 2.4 | 9.1 |
| A. Grid only, connection fee 4M | 4.4 | 11.1 |
| A. Grid only, connection fee 10M | 10.4 | 17.1 |
| C. Grid (fee 0.5M) + 1.2 kWp pump PV + UPS | about 2.5–3.8 | about 5.5–6.9 |

Grid energy for T1 alone is about 2,548 kWh a year × 376 = RWF 0.96M a year, which is RWF 6.5M in present value over 15 years [E]. At these placeholders:

- **Grid wins only if the connection costs less than about RWF 0.3M** against the base solar case; a farm further from the line than a few poles is better off with solar `[E]`.
- **A nearby line plus a solar pump (C) is cheapest** because it removes the pump from the tariff.
- The grid options ignore outage cost and tariff rises; the solar options ignore generator backup. Both sides need a quote and a REG distance before this table means anything.
- The tariff category for a farm connection, fixed charges and the connection fee are not in the tariff document [U ENG-01].

## 4. Backup power

| Function | Backup | Autonomy target `[A]` | Notes |
|---|---|---|---|
| Gateway, router, sensors, alarm siren | Battery (LiFePO4 or sealed lead-acid) with low-voltage disconnect | 24 h in T1; 48 h for alarms and the gateway | Must keep reporting power failures, so the failure alarm is the last load shed |
| Irrigation pump | None electrical. Tank buffer of at least 2 days of demand | 2 days of water in tanks | Cheaper than battery; sizes with the water balance |
| Livestock water | Gravity trough from a tank, hand valve | 3 days | Never depend on power for animal water |
| Security lights and cameras | Same battery, shed after 8 h in a long outage | 8 h | |
| Workshop | Generator or grid only | none | Not essential |

Load-shedding order when battery state falls `[A]`: workshop and sockets, extra cameras, lights, cameras, router, gateway, and last the low-power alarm transmitter.

## 5. Protection philosophy (no values here)

1. **Protect people first, equipment second, data third.** Every circuit has overcurrent protection and an isolator. Circuits reachable by workers or animals have residual-current protection. Ratings, trip curves and discrimination are set in the detailed design from real fault levels `[U]`.
2. **Hardwired protection never depends on software.** Dry-run, motor overload, overpressure and high tank-level cut-outs act directly on the pump circuit; the controller can only add conditions, never override them.
3. **Surge protection** at four points: PV array input, battery/inverter, incoming mains (if any) and long data or sensor cables entering a building. Specify type, level and coordination in design; use the SPD's status contact as a monitored alarm. Keep conductor loops small and bond the SPD earth to the main earth bar with the shortest practicable lead.
4. **Earthing**: one equipotential system for the pump house, PV frame, panels and cabinets; a separate electrode per remote structure is bonded back to it or to a surge-protected link. Soil resistivity is measured on site (the founder's test equipment) and the electrode design follows. Dry-season resistance will be worse than wet; test at both `[A]`. The standard and target values are chosen in design `[U]`.
5. **Lightning**: do a risk assessment against the applicable lightning-protection standard (IEC 62305 series `[A]`, to confirm with RSB) before deciding whether a rod or mast is needed. A farm on an open plain near a lake is exposed; local lightning density is `[U]` and should be checked. Do not mount PV or masts as the highest point without a decision. Treat sensor and valve cables as lightning entry paths: keep them short, buried or screened, with arresters at each end where the assessment shows need.
6. **Extra-low-voltage field wiring** (12 V or 24 V) for sensors and latching valves: lower hazard, but still fused and surge-protected.
7. **No unqualified mains work.** Verification: insulation resistance, earth-fault loop, RCD trip time, polarity and PV string open-circuit checks, recorded on the test sheets in `commissioning-plan.md`.

## 6. Enclosures and environment

| Location | Environment | Minimum ingress protection to start the specification `[A]` | Practices |
|---|---|---|---|
| Pump house panel | Humid, dusty, insects, possible splashes | IP54 indoor, IP65 if it can be hosed or sees splash | Ant-proof glands, no open knockouts, gland plates at the bottom, desiccant breather |
| Field nodes and junction boxes (open ground, rain, sun) | Rain, UV, heat, insects | IP65–IP66, UV-stable | Shade and ventilation; avoid dark enclosures in direct sun; breather vent against condensation; drip loops |
| Submersible or buried probes and cables | Wet, chemical | IP68 sensor, potted joints | Joints only in the box; pre-fit the cable length |
| Cameras | Rain, dust | IP66 | Lens hood, sealed cable entry |
| Batteries and inverter | Heat, ventilation, safety | Indoor, ventilated, IP20–IP21 minimum; lead-acid needs gas ventilation | Out of animal reach; fire-safe location; temperature sensor |
| Cold-room electronics (if built) | Cold, condensation | IP54+ | Separate circuit |

Ingress codes per IEC 60529 `[A]`. A rating on a datasheet is a starting point; a cabinet is tested by the **spray and condensation checks** on the commissioning sheets. Lake-side humidity and insect nests are the commonest causes of loss in small field electronics `[A]`; each is cheap to design out.

## 7. Remote fault monitoring

Monitor the power system as it monitors the farm. Each signal is wired to the gateway (Modbus RS-485, a vendor serial port, or a digital input) and sent as MQTT with a heartbeat:

| Signal | Why | Alarm class |
|---|---|---|
| Mains present / PV charging / inverter fault | Know why power is out | Warning, then critical after the battery threshold |
| Battery voltage, state of charge, temperature | Prevent deep discharge and overheating | Warning at 40%, critical at 20% `[A]` |
| PV string current/voltage vs irradiance | Soiling, shading, string failure | Info (weekly) |
| SPD status contacts, RCD trip | Surge event or earth fault | Critical |
| Pump current, power, run hours | Dry run, blockage, bearing wear | Critical (dry run), Warning (drift) |
| Enclosure temperature and door/leak sensor | Heat, flooding, tamper | Warning |
| Gateway heartbeat, router status | Know when the monitor is blind | Critical, via a second path |

A **dead-man's heartbeat** raised on the server (no message for 15 minutes `[A]`) is the only alarm that survives a total site failure. The alarm path itself needs a second channel (SMS or an independent cellular alerter) so that one broken router does not silence everything.

## 8. Next actions

1. Get the REG line distance and connection quote once the pin exists; tariff category from REG.
2. Choose pump type from the water source, head and permit; then rerun section 1.
3. Quotes (T12) for PV, battery, inverter, SPDs, panels, enclosures; replace placeholders.
4. Measure soil resistivity and lightning exposure at the pump-house site before the earthing design.
5. Reconcile the model's PV placeholders (0.3 / 0.6 / 2 kWp) with section 2.
