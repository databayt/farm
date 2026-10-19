# Commissioning plan — farm automation and monitoring

Status: Stage 5 draft · Date: 2026-10-19 · Location: **unconfirmed** — this is a template with the tests defined; every setpoint and tolerance is `[A]` until real equipment and the site exist.
Labels: `[V]` `[E]` `[A]` `[U]` (`CLAUDE.md`). No protection setting, cable size or rating is set here (`electrical-system.md` section 0).

## 1. Principles

1. **Commissioning is how we find out whether the design works.** Nothing is "done" until a test shows it, with evidence.
2. **Three maturity levels**, never mixed up:

| Level | What it is | Allowed to control the farm? | Exit to the next level |
|---|---|---|---|
| **Prototype (bench / laboratory)** | Parts on a bench or in a mock-up; simulated pump, water, sensors (buckets, jars, a test rig) | No | All bench tests in section 4 passed; firmware and wiring frozen; drawings drafted |
| **Field trial** | Installed on site, in parallel with manual operation, running for 4–8 weeks (one dry spell if possible) including fault injection; the manual method stays the master | Only under supervision, and hardwired protection always active; valves and pump follow the controller only in agreed windows | 4 weeks of data meeting the performance criteria (section 9); all critical faults detected; no unexplained outage; training done |
| **Production** | Accepted, documented, handed over, maintained | Yes, with manual override intact | Formal handover (section 11) signed |

3. **Independence:** the founder designs and builds. For every protection and safety test, a second person who did not wire it (a qualified electrician, an installer, or a colleague) witnesses and signs. Where Rwandan rules require certification of mains, PV, pump or lightning work, **a qualified authorised professional carries it out and signs** `[U]`: the founder prepares the test pack and attends.
4. **Safety first:** isolate, lock out, test dead, prove the tester, before any hands-on work. No live work on mains or PV strings by anyone without the qualification. Hazards: electric shock, DC arcs, battery thermal events, lightning during work, drowning at open tanks, chemicals, animals.
5. **Evidence rule:** each test records date, who, version of design/firmware/settings, instrument and its calibration date, readings, photos, result, and the corrective action. A failed test is a finding, not an embarrassment; it is fixed and the whole sequence it affects is re-run.

## 2. Roles

| Code | Role |
|---|---|
| F | Founder, electrical and software engineer: designer, tester, commissioning engineer |
| E | Licensed electrician / PV installer (witness and certifier of mains, PV, earthing) `[U]` |
| P | Plumber / irrigation installer |
| M | Farm manager or worker (operator) |
| A | Agronomist |
| V | Veterinarian (only for animal-record content, never for equipment) |
| W | Witness (independent person for protection tests) |

## 3. Process by subsystem (checklist spine)

For every subsystem below, work through the same steps in order. The section numbers show where the sheets are.

| Step | What is done | Sheets |
|---|---|---|
| 1 Design review | Review against requirements, hazards, failure modes (FMEA table) and drawings | 3.1 |
| 2 Requirements and acceptance criteria | Written, measurable, signed before installation | 3.1 |
| 3 Installation inspection | Mechanical, wiring, labels, access, ingress | per subsystem `-I` rows |
| 4 Wiring and connection checks | Continuity, polarity, insulation, earth, terminations | `-W` rows |
| 5 Sensor calibration | Per sensor, per soil, with references | `-C` rows |
| 6 Functional testing | Each function on its own | `-F` rows |
| 7 Control-logic testing | State machine, thresholds, interlocks | section 6 |
| 8 Fault injection | Fault-injection tests | Section 7 |
| 9 Communications testing | Link, failover, node loss | Section 8 |
| 10 Power-loss recovery and offline behaviour | Cut and restore power; run offline | Section 8 |
| 11 Alarm verification | End-to-end alarms | Section 8 |
| 12 Safety checks | Isolation, battery, water, lightning, animals | Section 5 |
| 13 Performance testing | Field-trial metrics | Section 9 |
| 14 Operator training | Drills and competence | Section 10 |
| 15 Documentation | As-built pack | Section 10 |
| 16 Maintenance planning | Schedules and spares | Section 10 |
| 17 Formal handover | Signed acceptance | Section 11 |

### 3.1 Design review and acceptance criteria (per subsystem; signed before purchase)

| ID | Item | Check | Pass/fail | Evidence | Responsible | Corrective action |
|---|---|---|---|---|---|---|
| DR-1 | Requirements | Each function traces to a problem in `technology-strategy.md` | No orphan function; no problem without a function | Traceability table | F | Remove or justify |
| DR-2 | Hazard and failure review | FMEA table lists each failure (sensor stuck, pump dry, valve open, battery flat, comms lost, controller restart, flood, fire, theft) with detection and response | All high-severity failures have a detection and a fail-safe state | FMEA sheet | F, W | Add protection or detection |
| DR-3 | Loads and ratings | Real equipment datasheets replace placeholders; cable, protection and PV/battery sized by the electrician against standards | Signed design with calculations; **no placeholder value remains** | Calculation pack, datasheets | E, F | Redo |
| DR-4 | Environment | Enclosure ingress, temperature, UV, insects, lightning exposure assessed per location | Each location has a rating and reason | Table | F | Change enclosure |
| DR-5 | Fail-safe states | Valve, pump, alarm and controller defaults on power/comms loss | Match `irrigation-automation.md` section 5 | Review notes | F, W | Revise design |
| DR-6 | Manual operation | HOA switch, hand valves, posted procedure | Operator can run the farm with the controller removed | Walk-through | M, F | Add bypass |
| DR-7 | Documentation plan | Drawings, labelling, parameter sheet, as-built plan | Template exists | Folder | F | Create |

## 4. Test sheets by subsystem

Each row is a test. The signed copy adds **Result (P/F), date, initials** per row. "Pass/fail" gives the criterion. Tolerances are `[A]`, set in design review.

### S1 Power and protection

| ID | Expected behaviour | Method | Pass/fail | Evidence | Responsible | Corrective action |
|---|---|---|---|---|---|---|
| S1-I1 | Installation matches the approved design; labels, isolators accessible; no exposed live parts | Visual inspection against drawings and checklist | Zero open items | Checklist, photos | E, F | Rectify and re-inspect |
| S1-W1 | Continuity of protective conductors and bonding | Low-resistance ohmmeter between every exposed conductive part and the main earth bar | Within the design limit `[U]` | Readings log | E, W | Re-terminate; re-test |
| S1-W2 | Insulation of each circuit adequate | Insulation resistance tester with loads disconnected | Above the standard's minimum `[U]` | Readings | E | Find and replace damaged cable |
| S1-W3 | Polarity correct on AC and DC; PV string polarity and open-circuit voltage as designed | Polarity check; string Voc with a meter before connecting | Voc within the datasheet range for temperature | Photo of meter; sheet | E | Correct wiring |
| S1-W4 | Earth electrode resistance and loop impedance suit the protection chosen | Earth tester / loop tester, wet and dry season readings | Within design limit `[U]`; repeat at the opposite season | Test certificate | E, F | Add electrodes; treat soil; re-test |
| S1-F1 | RCD/overcurrent devices trip as designed | Test button and RCD tester at 1× rated residual current | Trip within the standard's time `[U]` | Tester printout | E, W | Replace device |
| S1-F2 | PV charges the battery; battery supports the always-on loads | Meter on PV current, battery current, loads over a sunny day and a night | Charge and discharge match calculation within 15% `[A]` | Data log | F | Check shading, MPPT, wiring |
| S1-F3 | Low-battery shedding order operates | Reduce battery voltage via supply or simulate at the BMS/controller | Loads shed in the documented order; alarm transmitter last | Log | F | Reprogram thresholds |
| S1-F4 | Surge protectors present, correct, status monitored | Inspect SPD type; open status contact | Status alarm appears on the dashboard | Screenshot | E, F | Fix wiring |
| S1-F5 | Earthing continuity of SPD paths | Lead length measured; bonded to main earth | Lead as short as practicable `[A]`; no sharp bends | Photo, measure | E | Re-route |
| S1-S1 | Lock-out/tag-out works; isolators operate | Dry run of isolation | All sources isolated; verified dead | Signed LOTO form | E, F | Add labels or isolator |
| S1-P1 | Thermal check under load | Thermal camera or IR thermometer at terminations after 1 h at load | No hot spot beyond design margin `[U]` | Image | E | Retighten; replace |
| S1-L1 | Lightning risk assessment documented | Review per applicable standard (IEC 62305 `[A]`) | Assessment signed; protection decision recorded | Report | E, F | Act on the finding |

### S2 Pump and storage

| ID | Expected behaviour | Method | Pass/fail | Evidence | Responsible | Corrective action |
|---|---|---|---|---|---|---|
| S2-I1 | Pump, pipe, valves, filter, tank as built; anchored, labelled, accessible; hand bypass present | Visual vs P&ID | No open items | Photos | P, F | Rectify |
| S2-W1 | Pump motor direction, supply and thermal overload correct | Check rotation (single-phase: nameplate; three-phase: phase order) with water in the pump | Correct direction; overload set to nameplate current `[U]` | Record | E | Swap phases / reset |
| S2-F1 | Pump meets duty point | Measure head, flow, power at the working point | Within 10% of pump curve `[A]` | Flow/pressure log | F, P | Check air locks, impeller, supply |
| S2-F2 | Hardwired dry-run cut-out stops the pump | Lower the tank to the cut-out (or lift the float) with the pump running | Pump stops within 5 s `[A]`; no restart until reset | Video, log | F, W | Replace relay/float; re-test |
| S2-F3 | Overload/overpressure cut-outs act | Close the discharge valve slowly; inject overload with a test rig (bench only) | Pump trips before damage; reset works | Log | F, W | Adjust and retest (settings only by the qualified person `[U]`) |
| S2-F4 | Tank upper/lower outlets: irrigation stops at the upper outlet, animals keep the reserve | Draw down the tank | Irrigation stops with the specified reserve left | Level readings | F, M | Move outlet |
| S2-F5 | HOA switch works | Operate in each position | Hand runs through protections; Off blocks; Auto obeys controller | Observation | F, W | Rewire |
| S2-F6 | Leak test of pipework | Pressurise to working pressure, observe 30 min | No pressure drop beyond tolerance `[A]` | Pressure record | P | Repair |

### S3 Irrigation zones and valves

| ID | Expected behaviour | Method | Pass/fail | Evidence | Responsible | Corrective action |
|---|---|---|---|---|---|---|
| S3-I1 | Valves match zone map; flow direction and manual levers correct | Inspection with the map | Labels match | Photos | P, F | Re-label |
| S3-W1 | Valve coil/driver wiring and polarity correct; latching pulse width right | Bench test then in place | Valve moves and holds | Scope/meter trace | F | Adjust pulse |
| S3-F1 | Each valve opens and closes on command and feedback matches flow | Command open/close with the pump on at low pressure | Flow starts within 5 s; stops within 10 s `[A]` | Log | F, P | Clean/replace valve |
| S3-F2 | Zone baseline flow and pressure recorded | Run each zone alone for 10 min | Baselines recorded; spread < 10% `[A]` | Baseline table | F, P | Investigate emitters/leaks |
| S3-F3 | Emitter uniformity acceptable | Catch cans at 10 emitters per zone | CU ≥ 85% `[A]` | Measurements | P, A | Clean/replace emitters |
| S3-F4 | Flush valve purges the line | Run flush | Clear water; pressure restores | Observation | P | Adjust |
| S3-F5 | Manual bypass irrigates a zone with the controller off | Isolate the controller | Zone watered by hand | Observation | M, F | Fix bypass |

### S4 Sensors and metering

| ID | Expected behaviour | Method | Pass/fail | Evidence | Responsible | Corrective action |
|---|---|---|---|---|---|---|
| S4-I1 | Sensors at the planned depth/position, cable protected, labelled | Inspection | Position within 5 cm and recorded in a photo | Photo, GPS | F, A | Re-install |
| S4-C1 | Soil-moisture sensors calibrated for the site soil | Gravimetric sampling or known-moisture reference in the sensor's soil at 3+ moisture points | Per-sensor fit with RMSE within the agreed limit (published low-cost sensors reach 4.5–4.9% after calibration [B ENG-09]); target `[A]` | Calibration curve per sensor | F, A | Replace sensor; recalibrate |
| S4-C2 | Flow meter accuracy | Compare against a timed tank fill or bucket-and-stopwatch | Within ±5% `[A]` | Test record | F | Adjust K factor |
| S4-C3 | Tank-level sensor accuracy | Dip-stick at three levels | Within ±2 cm `[A]` | Record | F | Recalibrate |
| S4-C4 | Rain gauge | Pour a known volume | Tips match the volume within 5% | Record | F | Level/clean |
| S4-C5 | Pressure and current sensors | Reference gauge; clamp meter | Within ±2% / ±3% `[A]` | Record | F | Recalibrate |
| S4-F1 | Disagreement between redundant sensors raises a flag | Offset one sensor by 20% | Flag within 15 minutes | Log | F | Adjust rule |
| S4-F2 | Calibration date and sensor ID stored and visible | Check the dashboard | Present for each sensor | Screenshot | F | Fix data |

### S5 Controller and edge gateway

| ID | Expected behaviour | Method | Pass/fail | Evidence | Responsible | Corrective action |
|---|---|---|---|---|---|---|
| S5-I1 | Hardware as built; firmware and software versions recorded | Inspection; hash/version list | Matches the release | Version file | F | Rebuild |
| S5-F1 | Boot closes all valves first, then self-tests | Power-cycle controller 10 times | Valves closed within 30 s every time; self-test passes | Log | F | Fix boot order |
| S5-F2 | Watchdog resets a hung controller | Induce a hang in the firmware test build | Reset in under the timeout `[A]`; BOOT sequence runs | Log | F | Tune watchdog |
| S5-F3 | Settings survive power loss | Change a setting; cut power | Setting retained | Log | F | Fix storage |
| S5-F4 | Clock keeps time offline | Disconnect network for 24 h | Drift < 1 minute `[A]` | Log | F | Replace RTC |
| S5-F5 | Gateway storage and buffer | Fill buffer and disconnect for 7 days of data | No loss on reconnect | Row counts | F | Resize disk |
| S5-F6 | Secure access | Check credentials, closed ports, update path | No default passwords; TLS; unique per-device keys | Config review | F | Fix |

### S6 Communications (field)

Detailed fault tests are in section 8. Installation checks:

| ID | Expected behaviour | Method | Pass/fail | Evidence | Responsible | Corrective action |
|---|---|---|---|---|---|---|
| S6-F1 | Each node reaches the gateway | Signal strength per node, 24 h packet loss | Loss < 2% `[A]` | Report | F | Move node/AP; add AP |
| S6-F2 | Uplink works on both networks | Test each SIM and failover | Failover in under 2 minutes `[A]` | Log | F | Fix router config |
| S6-F3 | Radio compliance | Type approval and band checks (LoRa especially) | Documents on file; permitted band [C ENG-07] | Certificates | F | Replace device |

### S7 Alarms

| ID | Expected behaviour | Method | Pass/fail | Evidence | Responsible | Corrective action |
|---|---|---|---|---|---|---|
| S7-F1 | Every alarm in the alarm list (tank empty, pump fault, flow abnormal, leak, power loss, battery low, sensor fail, comms loss, intrusion, door) fires | Trigger each by simulation | Alert reaches the phone within 5 minutes `[A]`; local siren for critical | Screenshot, timestamp | F, W | Fix rule or path |
| S7-F2 | Alarm has the right severity, text and owner | Review text | Operator understands the action without the designer | Review sign-off | M | Rewrite |
| S7-F3 | Acknowledge and clear works; no auto-clear of latched faults | Operate | As designed | Log | F | Fix |
| S7-F4 | Heartbeat alarm (dead-man) | Switch the gateway off | Alert in 15 min `[A]` from the server side | Log | F | Fix |
| S7-F5 | False alarm rate | 7-day observation | < 2 a week `[A]` | Count | F | Tune thresholds |

### S8 Security

| ID | Expected behaviour | Method | Pass/fail | Evidence | Responsible | Corrective action |
|---|---|---|---|---|---|---|
| S8-I1 | Cameras aimed at farm assets only; notice posted | Walk-through at night and day | No neighbour or public area in view `[A]` | Screenshots | F | Re-aim or mask |
| S8-F1 | Motion events recorded and alerted at night | Walk through the zone | Alert in 1 minute `[A]`; clip saved | Clip | F | Tune sensitivity |
| S8-F2 | Footage retention and access | Check settings | Overwrite after 14–30 days `[A]`; access log on | Config | F | Fix |
| S8-F3 | Lights on photocell and on backup | Cover the sensor; cut mains | On at dusk; on from battery | Observation | F, E | Rewire |
| S8-F4 | Locks and tamper switch | Open door of pump house | Alert received | Log | F | Fix |

### S9 Platform and data

| ID | Expected behaviour | Method | Pass/fail | Evidence | Responsible | Corrective action |
|---|---|---|---|---|---|---|
| S9-F1 | Role permissions enforced | Log in as each role; try forbidden actions | Forbidden actions denied | Test log | F | Fix |
| S9-F2 | Audit log captures all changes and manual runs | Perform 10 changes | 10 entries with actor, time, reason | Log export | F | Fix |
| S9-F3 | Backup and restore | Restore last night's backup to a clean host | Data identical; time recorded | Restore log | F | Fix backup |
| S9-F4 | Assistant guardrails (when built) | Run the evaluation set including attempts to command a pump or request a drug dose | 100% refusals on A3; no ungrounded claims | Eval report | F | Fix prompt/permissions |

### S10 Livestock records and water

| ID | Expected behaviour | Method | Pass/fail | Evidence | Responsible | Corrective action |
|---|---|---|---|---|---|---|
| S10-F1 | Tag register matches the animals | Count and match 100% of animals to records | Zero mismatches | Count sheet | M, F | Correct records |
| S10-F2 | Scale/weigh-band reading | Known weight | Within ±2% | Record | M | Recalibrate |
| S10-F3 | Trough supply works without power | Cut power; check gravity feed | Water available for the stated days | Observation | M | Fix |
| S10-F4 | Health-event form captures vet instructions and withdrawal date; no system advice | Enter test events | Fields present; no dosing advice appears | Screens | V, F | Fix form |

## 5. Safety checks

| ID | Expected behaviour | Method | Pass/fail | Evidence | Responsible | Corrective action |
|---|---|---|---|---|---|---|
| SAF-1 | Electrical safety verified before energising | Inspection and test (S1-W1 to W4, F1) completed and signed | All passed; certificate | Certificate | E, W | Do not energise |
| SAF-2 | Emergency isolation known and accessible | Walk-through; labels | Operator isolates all power in under 1 minute `[A]` | Timed drill | M | Move/label isolator |
| SAF-3 | Battery safety | Ventilation, fire extinguisher type, temperature sensor, no use near animals | Meets design | Photo | E | Relocate |
| SAF-4 | Water hazard | Tank covers, ladder, warning signs | In place | Photo | F | Add |
| SAF-5 | Chemical hazard (fertiliser, pesticide) | Storage and labelling | Compliant | Photo | M | Fix |
| SAF-6 | Lightning procedure | Written: stop outside work, disconnect, stay clear | In the procedures file | Document | F | Add |
| SAF-7 | Animal safety | Cables and enclosures out of reach; no live exposed equipment | Verified | Photo | F | Guard |

## 6. Control-logic tests (against `irrigation-automation.md`)

Run on the bench with simulated inputs first, then on site.

| ID | Expected behaviour | Method | Pass/fail | Evidence | Responsible | Corrective action |
|---|---|---|---|---|---|---|
| CL-1 | Dry soil triggers a run to the target volume | Inject M below M_lower in the window | Zone starts; stops at the volume ±5% | Log | F | Fix logic |
| CL-2 | Wet soil or rain skips | Inject M above M_upper; inject rain ≥ R_skip | No run; reason logged | Log | F | Fix |
| CL-3 | Tank low blocks the start | Simulate low level | No start; alert | Log | F | Fix |
| CL-4 | Daily cap stops over-watering | Force repeated requests | Stops at Vcap | Log | F | Fix |
| CL-5 | Zones run in sequence and priority order | Request three zones | One at a time; youngest first | Log | F | Fix |
| CL-6 | Manual mode blocks automation and times out | Use remote manual command | Limit and logging apply | Log | F | Fix |
| CL-7 | State machine reaches every state, none stuck | Walk the state table | All transitions occur as listed | Test matrix | F, W | Fix |
| CL-8 | Parameter change requires approval | Change a limit as a worker | Denied; owner change logged | Log | F | Fix |

## 7. Fault-injection and failure tests

These are the brief's required failures. Run on the bench (prototype) and again on site (field trial). A pump or valve is never put at risk: use a rig, reduced pressure, and a supervised operator.

| ID | Fault | Expected behaviour | Method | Pass/fail | Evidence | Responsible | Corrective action |
|---|---|---|---|---|---|---|---|
| FI-1 | Sensor disconnection (soil, level, flow, current) | Reading marked invalid in < 30 min; fallback to other probe or the degraded schedule with a cap; alert | Unplug each sensor in turn during idle and during a run | Alert in 30 min; no uncapped irrigation; the run stops safely if the lost sensor is a safety one | Log, timestamps | F | Fix validity rules |
| FI-2 | Incorrect reading (stuck, out of range, spike, drift) | Flagged; the state machine does not act on it | Inject a stuck value, a 0 and a 100% value, a slow drift | Rejected within the defined time; alarm | Log | F | Add rate-of-change/limits |
| FI-3 | Water leak (downstream of the valve) | High-flow alarm; zone closed; pump stopped | Open a test tap in the zone during a run | Stop within 60 s `[A]`; alert; volume lost recorded | Log | F, P | Adjust tolerance |
| FI-4 | Leak with valves closed | Flow with all valves closed detected and the pump request dropped | Open a tap downstream with no cycle | Detect in 10 min `[A]` | Log | F | Fix |
| FI-5 | Blocked filter | Differential-pressure alarm; low-flow alarm; flush request | Partly block the filter or close an upstream valve | Alarm in 2 min `[A]`; no pressure increase | Log | F, P | Fix thresholds |
| FI-6 | Blocked emitters | Low flow in a zone; ineffective irrigation | Plug sample emitters | Flow drops below 60% → alarm | Log | F, A | Fix |
| FI-7 | Pump fault: dry run | Hardwired cut-out first; controller sees no flow, latches | Close the suction (rig) | Hardwired stop; fault latched | Log, video | F, W | Fix |
| FI-8 | Pump fault: overload / locked rotor | Trip; one retry; then latch | Rig simulation by the qualified person | Trips, no restart storm | Log | E, F | Fix |
| FI-9 | Communications failure (router, SIM, node) | Local operation continues; local alarm; buffered data uploaded later | Unplug router for 2 h, 24 h; block one node | No missed irrigation; no data loss on reconnect | Logs | F | Fix |
| FI-10 | Low battery | Warning, shedding, last-alarm transmission | Discharge to thresholds with a programmable supply | Order as designed; no uncontrolled reset | Log | F | Fix |
| FI-11 | Controller restart (watchdog, power) in the middle of a cycle | Valves close; cycle not resumed; owed volume tracked; alert | Reset at random moments in 10 cycles | 10/10 correct | Log | F | Fix |
| FI-12 | Valve stuck open / closed | Detected by flow; fault latched | Block a valve open (manual lever) and closed | Detection in under 1 min | Log | F, P | Fix |
| FI-13 | Clock error | Scheduled runs inhibited; alarm | Set wrong time | No start | Log | F | Fix |
| FI-14 | Corrupted setting or invalid command | Rejected | Send out-of-range values | Rejected; audit entry | Log | F | Validate |
| FI-15 | Cyber test (basic) | No unauthenticated control path | Port scan; try a command without a key | None possible | Report | F | Close |
| FI-16 | Mains/PV surge event record (observe, not inject) | SPD alarm raised after a real storm | Check logs after storms | Alert present | Log | F, E | Replace SPD |

## 8. Power-loss recovery, offline operation, communications and alarms

| ID | Expected behaviour | Method | Pass/fail | Evidence | Responsible | Corrective action |
|---|---|---|---|---|---|---|
| PL-1 | After a total power loss during a run the system returns to a safe state, closes valves, informs, and resumes the schedule without the interrupted cycle | Remove supply mid-cycle, restore after 1 min and after 6 h | Safe state in each case; no unexpected pump start | Log, video | F, W | Fix |
| PL-2 | Randomised restart delay prevents a start surge | Restore power | Start only after 30–120 s | Log | F | Fix |
| PL-3 | Power-loss alert is sent from battery | Cut mains/PV | Alert within 5 min `[A]` | Phone log | F | Fix |
| PL-4 | Battery low then flat then recharge | Run down to cut-off and recharge | No latch-up; controller restarts correctly | Log | F | Fix |
| OF-1 | Offline: the schedule runs 7 days with the router off | Router off for 7 days in the field trial | Irrigation per the schedule; 100% of data buffered | Logs | F | Fix |
| OF-2 | Offline: local alarm and SMS | Cut the internet but leave cellular up; then cut both | SMS received; siren sounds | Log | F | Fix |
| OF-3 | Reconnect: reconcile | Reconnect after 24 h | No duplicates; times correct | Row counts | F | Fix |
| OF-4 | Offline records entry on the phone | Airplane mode entries, then sync | All entries kept with original time/author | Screens | M, F | Fix |
| CM-1 | Node loss | Power a node off | 'Node offline' alert at 3× its report interval | Log | F | Fix |
| CM-2 | Interference / range | Move a node to the edge | Loss < 2% or flagged | Report | F | Re-site |
| AL-1 | End-to-end alarm drill | Operator receives a test alarm and follows the response card | Correct action within 10 minutes `[A]` | Drill form | M | Retrain |

## 9. Performance testing (field trial)

| Metric | Criterion `[A]` | Evidence |
|---|---|---|
| Availability of monitoring | > 98% of time over 4 weeks | Heartbeat log |
| Sensor validity | > 95% valid readings | Quality flags |
| Missed scheduled irrigations | 0 in the trial | Log |
| Time from fault injection to alert | < 5 minutes | Timestamps |
| Water delivered vs plan | Within ±10% | Flow meters |
| False alarms | < 2 a week | Alert log |
| Manual interventions | Declining; each explained | Audit log |
| Energy used vs load schedule | Within ±20% | Meter |
| Parallel manual check | Controller decisions agree with the manual master in > 90% of cases | Comparison sheet |

If a criterion fails, the trial extends or the design changes. Production starts only on a signed pass.

## 10. Training, documentation, maintenance

### Operator training

| Topic | Who | Method | Competence check | Records |
|---|---|---|---|---|
| Daily checks, reading the dashboard | M | On site, 2 sessions | Operator finds the zone state, tank level and the last 3 alerts | Signed list |
| Alarm response cards | M | Drill (AL-1) | Right action within 10 minutes | Drill form |
| Manual operation and HOA | M | Hands-on | Runs the farm with the controller removed | Observation |
| Safety: isolation, lightning, battery | M, all | Demonstration | Isolates the supply in under 1 minute | Signed list |
| Records entry (phone and paper) | M | 1 session | 10 entries, 0 errors | Test entries |
| What the assistant can and cannot do | Owner, manager | Briefing | States the A3 prohibitions | Signed list |

### Documentation (the as-built pack)

Drawings (single-line, schematic, block, P&ID, layout, cable schedule); bill of materials with serial numbers; parameter sheet and thresholds; firmware and software versions; network diagram and credentials in a vault; sensor calibration curves; test sheets (signed); FMEA; alarm list and response cards; operating and manual-override procedure; safety procedures; maintenance plan; supplier and warranty list; photographs. Stored in two places, one offline.

### Maintenance plan `[A]`

| Interval | Task |
|---|---|
| Daily | Dashboard check; walk the pump house; log water use |
| Weekly | Flush the line; clean filter if the dP flag is on; check tank; confirm alarms (test button) |
| Monthly | Panel inspection; battery voltage and terminals; clean the rain gauge; battery-backup test; review false alarms; clean the PV |
| Quarterly | Calibration spot-checks (moisture, flow, level); cable and gland inspection; SPD status; firmware review |
| Seasonal | Earth resistance (dry and wet), insulation tests, battery capacity test, full fault-injection mini-set, re-baseline zone flows |
| Annual | Full review of settings, risk assessment, restore test of backups, replace sensors past life |
| Event-driven | After any storm: SPD status and cable check; after any repair: re-run the affected test sheet |

Spares kept: one of each node type, two probes, one valve, fuses, a spare SD/SSD image, a spare router `[A]`.

## 11. Formal handover

| Item | Evidence | Signed by |
|---|---|---|
| All test sheets complete, failures closed | Packs S1–S10, FI, PL, OF | F, E, W |
| Performance trial passed | Section 9 | F, owner |
| Protection and earthing certificates | Certificates `[U]` | E |
| Documentation pack delivered | Index | F |
| Training signed off | Training list | M, F |
| Maintenance plan and spares | List | F, M |
| Open issues list with dates | Issue log | F, owner |
| Warranty and support contacts | List | F |
| Acceptance statement | "Subsystem X accepted for production use on date D under conditions C" | Owner |

## 12. Sequencing

1. Prototype all T1 elements on the bench while waiting for the site (Stage 2–4); keep a test rig (bucket, pump, valves, signal sources).
2. Install pump protection and hand valves first (S1, S2, S3-F5): the farm works manually with protection.
3. Add T1 sensors and gateway; run field trial parts S4, S5, S6, S7 for 4–8 weeks.
4. Only after Gate E2 (`technology-strategy.md`) add valves and controller and repeat sections 6–9 for the new subsystem.
5. Never commission two new subsystems at once.
