# Livestock management

Status: Stage 7 draft · Created: 2026-10-19 · Location: **unconfirmed**
Scope: goats first (the core line), sheep only if the roadmap's T79 is approved. Livestock arrive **no earlier than July 2027 (model month 9)** and only after gate G5 in `../execution/five-year-roadmap.md`.

**Veterinary specifics are confirmed with a Rwandan veterinarian before use. This file contains no drug names, doses or vaccination schedules.** Where a veterinary point is needed, the text says "ask the vet" and the vet's answer goes in the farm's health plan (`AnimalEvents` tab). Evidence labels: `[V]` with a source ID, `[E]` estimate, `[A]` assumption, `[U]` unknown.

## 1. Context that shapes every routine

- Rift Valley fever (RVF): outbreaks in 2022, 2024 and 2026; an Eastern Province quarantine from 2026-06-26; markets in the East were closed into September; status after 2026-09-28 is [U] [V LVS-03, LVS-04, LVS-05, LVS-13]. RVF is also a human disease [V LVS-34]. The farm assumes it will meet periodic movement bans and market closures: **2 to 4 months** of reserve feed and cash [A from LVS-13, LVS-05].
- PPR is endemic in Rwanda since the 2023 declaration; FAO advises routine coverage above 70% of small ruminants [V LVS-14, LVS-45]. The vaccination plan and its timing are the vet's.
- Gastrointestinal worms (Haemonchus) are the top health problem in Bugesera and Nyagatare surveys, with peaks in April and October [V LVS-10, LVS-46]. Sheep carry heavier worm burdens than goats [E LVS-46].
- Brucellosis is a zoonosis; mixing cattle and goats and a history of abortion were the main risk factors in Nyagatare [V LVS-39]. Orf (contagious ecthyma) and pneumonia are reported [V LVS-10].
- Exotic and crossbred animals suffer more disease and need better feed and care than local goats [V LVS-01].
- Only 4% of Bugesera farms keep records [V LVS-10]. This farm's records are an advantage for later breeding-stock sales.
- Theft of small stock is described as growing [V LVS-01].
- Law 54/2008: owners must immunise animals as campaigns require (Art 5), report suspected contagious disease without delay (Art 7), keep animals enclosed to avoid contact (Art 8), and obtain a movement permit for moves from infected, suspected or protected zones (Arts 18–19) [V LVS-40]. The new law before Parliament in July 2026 is not confirmed [U LVS-31].

## 2. Roles

| Role | Tasks |
|---|---|
| Farm manager (FM) | Daily checks, feeding, records, first response to sickness, isolation, calling the vet |
| Veterinarian (VET) | Health plan, vaccination and treatment decisions, pre-purchase inspection, post-mortem or sample submission, advice on reporting |
| Founder (F) | Purchase and sale decisions, weekly review, mortality thresholds with the vet, contact with the sector veterinary officer |
| Sector veterinary officer | Government reporting and movement approval (sector level) [V LVS-29] |

## 3. Daily checks

Done in the morning and the evening rounds (`standard-operating-procedures.md` 3.1 and 3.3). The record is the head count and any exception.

| Check | Normal | Act if |
|---|---|---|
| Head count | Every tagged animal is present | An animal is missing: search, check the fence, tell the founder (theft) |
| Behaviour and posture | Alert, standing, grazing or ruminating, kids lively | Dull, separate from the group, head down, off feed |
| Eyes, nose, mouth | Clear eyes, moist nose, no discharge, no sores | Discharge, crusts or scabs on lips (orf), cough, laboured breathing |
| Droppings and urine | Firm pellets | Persistent diarrhoea, blood, straining |
| Belly | Not swollen on the left side | Bloat |
| Mobility | Walks evenly | Limping, swollen feet, hooves |
| Udder and kids | Does nursing, kids fed | Hot or hard udder; kid weak or not nursing |
| Water and feed | Troughs full and clean; feed eaten | Refusal of feed; fouled troughs |
| Signs that need the same-day alarm | — | High fever, marked weakness, bleeding from body openings, abortion, several animals sick at once, sudden deaths [V LVS-03] |

Condition and worm-load checks (for example a body-condition score, and a colour-chart eyelid check such as FAMACHA, which authors of the Nyagatare study suggest for targeted treatment [V LVS-46]) are weekly or fortnightly **if the vet adopts them**; the vet sets the interval and the action.

## 4. Quarantine

| Case | Rule |
|---|---|
| New arrivals (purchases) | Housed in the quarantine pen, apart from the farm herd and downwind of it, for the period set by the vet (default plan 30 days [A]); fed and watered with separate buckets; the person who works with them does them last in the day or wears separate boots and gloves |
| Animals returning from a market, show or any other farm | Treated as new arrivals |
| Sick animals | Moved to the quarantine pen at the first sign (health-event workflow below) |
| Pre-entry checks | Source health records, a vet inspection before purchase, movement approval (IremboGov "Livestock Relocation", free, 3 days [V LVS-29]), no animal from a quarantined zone [V LVS-03] |
| On arrival | Ear tag or other ID, weight, body condition, a vet check, entry in the register |
| Release | The vet clears the animal in writing (a line in `AnimalEvents`) before it joins the herd |
| Pen siting | Dry, raised ground, at least 200 m from the lake bank [V LOC-02], away from the main house and neighbours' animals (zoning concept Z3) |

## 5. Health-event workflow

A "health event" is any sick animal, injury, abortion, unexplained death, or a group-level problem.

| Step | Who | What | Record |
|---|---|---|---|
| 1. Notice | FM | Found on a round or reported by a worker; note time and the animal's ID | `AnimalEvents` |
| 2. Isolate | FM | Move to the quarantine pen with its own water and feed; handle with gloves; handle last; wash and change before touching others | `AnimalEvents` |
| 3. Triage | FM | Is this an alarm sign (section 3 last row)? If yes, go straight to step 5 | |
| 4. Observe and describe | FM | Photo, temperature if a thermometer is available, signs, feed intake, how many animals show the same, last movements on or off the farm | `AnimalEvents` |
| 5. Call the vet | FM, then F | Phone call with the description; ask for advice or a visit; if the signs could be RVF, PPR or brucellosis (the vet decides the label), call the sector veterinary officer too: **notifiable suspicion is reported without delay** [V LVS-40, LVS-03] | `AnimalEvents`, `Biosecurity` |
| 6. Protect people | FM | Gloves and boots; no unprotected contact with blood, aborted material or carcass; keep children and pregnant women away; no consumption of the sick animal's meat or milk | `Biosecurity` |
| 7. Treat or test | VET | Only as the vet directs. The farm does not give medicines on its own judgement. Treatment, dose, withdrawal time and the vet's name are recorded exactly as given | `AnimalEvents` |
| 8. Contain | FM | No movement on or off the farm while a notifiable disease is suspected; limit visitors; spray or vector control as the vet or authority orders (2026 RVF orders included twice-weekly spraying [V LVS-03]) | `Biosecurity` |
| 9. Follow up | FM | Daily recheck; photos; weight; sign off when the vet says so | `AnimalEvents` |
| 10. Close and learn | F + VET | Outcome (recovered, culled, died), cause if known, cost; update the health plan if the event shows a pattern | `AnimalEvents`, `Mortality`, `Costs` |

Rules of thumb:
- If in doubt, isolate first and call second.
- Compensation for sanitary culling exists under the 2008 law and is set by the authority [V LVS-40]; only the vet and the sector officer decide that route.
- Keep the vet's phone number and the sector officer's number on the wall and in the manager's phone [U until the site is known].

## 6. Breeding records

Each breeding female has a **doe card** (a row in the register plus events). Each male has a buck card.

| Field | Format |
|---|---|
| Animal ID | Farm ear-tag number, unique and never reused |
| Sex, breed type | Local, cross (name the cross), exotic |
| Date of birth or arrival; source | `YYYY-MM-DD`; supplier ID if bought |
| Dam and sire ID | From the register |
| Weights | Birth (if possible), at weaning, at 90 days, at sale, monthly sample |
| Service | Date, buck ID, method (natural) |
| Expected kidding date | Service date plus the vet's gestation figure; the planning model uses six months from a female joining to first birth [A, model] |
| Kidding | Date, number born alive and dead, sexes, birth weight, kid IDs |
| Abortion or stillbirth | Date, signs; treated as a health event (zoonosis risk, brucellosis [V LVS-39]) |
| Health events and treatments | Linked by animal ID |
| Culling or sale | Date, reason, weight, price, buyer |

Breeding rules to settle with the vet [U]: age and weight at first service; kidding interval; how many males to keep (in Bugesera most farms castrate males before 3 months; 59% of farms with breeding problems have no buck [V LVS-10], so proven bucks and buck services could be a future line [E]). The farm keeps males that go for breeding-stock sale separate from females in the later months [A]. No performance figures are quoted here: Rwandan kidding intervals, litter size and mortality are [U LVS-59] and the model uses [A] values to be replaced by this farm's own records.

## 7. Weighing

| Why | When | How |
|---|---|---|
| Growth and feed conversion | Birth if feasible; weaning; at 90 days; then a monthly sample of 10 animals; all animals before sale | The livestock scale (CX22), early morning before feeding; same scale each time; weights in kg |
| Sale value and decisions | Before every sale | Record weight and price in the same row |
| Health | A drop in weight between two weighings is an alert to the vet | Compare against the sample average |

Average daily gain, feed per kg of gain, and sale-weight distribution come from these rows (`recordkeeping.md`). Sample sizes stay small at first; trends over 6 months matter, single numbers do not.

## 8. Feeding and water (for health, not a ration)

- Dry-matter intake is about 2.5–3% of body weight a day; up to 6.5% for goats; late pregnancy needs about double and lactation about triple the maintenance of late summer [V LVS-26, LVS-27]. Detailed rations belong to the nutrition work in `study/design/`.
- Drinking water: about 1.5–3.3 L per goat per day at maintenance, 4–5 times dry matter when lactating [V LVS-27].
- Forage cautions from the sources: Brachiaria hay was suspected of saponin poisoning in Boer goats, and lambs are more susceptible than cattle [V LVS-25, LVS-43]; keep sheep off pure stands of B. decumbens and take veterinary advice. Calliandra stays at 20–40% of the diet and Leucaena above 30% is a mimosine concern [V LVS-21, LVS-22].
- Fresh feed is stored dry and off the floor; spoiled feed is thrown away.
- No grazing inside young orchard blocks; goats do not roam free near trees (zoning concept rules 1–2).

## 9. Sales

| Step | Rule |
|---|---|
| Choose the animal | From the register: age, weight, health clean, no treatment in the vet's withdrawal period |
| Choose the buyer | A licensed buyer or abattoir for meat; for breeding stock a buyer who accepts the health record; a prospect is not a customer until committed |
| Price | By live weight at the price agreed (the base model uses about RWF 2,300/kg live weight [A AS-06]; market checks continue via `Prices`) |
| Weigh | On the farm scale in front of the buyer |
| Movement | Approval for the move through IremboGov "Livestock Relocation" [V LVS-29]; no night transport [V LVS-01]; during a quarantine, no movement at all [V LVS-03] |
| Pay and record | Payment received before the animal leaves, or credit terms written down; sale row with animal ID, weight, price, buyer |
| Seasonal timing | Year-end demand peaks: goats at Saban abattoir rose from about 150 to 600 a day around Christmas and prices rose by about 25% at the peak [V LVS-07]; Eid al-Adha is about 2027-05-16/17 [E] |
| Closed-market plan | A buyer who collects at the farm gate and licensed abattoir sales are tested before a closure; whether farm-gate sales continue under quarantine is to be asked of RAB [U LVS] |

## 10. Mortality reporting

Every death is recorded the same day, even a stillbirth.

| Field | Content |
|---|---|
| Date and time found; animal ID; age; sex | |
| Signs seen in the last 24 hours | |
| Location (house, paddock, quarantine) | |
| Suspected cause (the vet's words, not the manager's) | |
| Samples or post-mortem done by | VET or sector officer |
| Notified to | VET (always); sector veterinary officer if notifiable suspicion [V LVS-40] |
| Disposal | As the vet or authority directs; never skinned or opened without gloves and instruction |
| Cost of loss | Estimated value at current weight and price |

Monthly: deaths, mortality rate (deaths / animals at risk), cause categories, and the trend. The farm and the vet set action thresholds together, for example a number of unexplained deaths in a week that triggers a same-day vet call [A, thresholds to be set with the vet]. The model's mortality inputs are [A] and are replaced by these records.

## 11. Biosecurity

| Layer | Practice |
|---|---|
| Fence and entry | One gate for people and vehicles; fence kept in repair (weekly walk); no neighbour animals sharing water or feed; no contact with cattle on the same pen (brucellosis risk factor [V LVS-39]) |
| Visitors | Visitor book; no visitors in animal areas unless needed; clean boots or a footbath; no visits by people who handled sick animals that day |
| Tools and vehicles | Tools and buckets kept per pen; vehicles do not enter animal areas; borrowed equipment is cleaned before and after |
| New stock | Quarantine (section 4); no mixing with neighbours' stock; no animals bought from a market without the vet's view |
| Vectors | Mosquito and insect control as the authority and the vet direct (RVF is spread by vectors; the 2026 order was spraying at least twice a week with pyrethroid products supplied through sector offices [V LVS-03]); standing water drained; pens kept dry |
| Feed and water | Feed stored off the ground, covered, away from rodents; water troughs cleaned; water from a source the test shows safe (T06, T48) |
| Manure and bedding | Collected, composted before use on fruit trees (zoning concept rule 4); not spread where water runs to the lake |
| Carcasses | Disposal as the vet or authority directs; away from water and the lake buffer |
| People | Gloves and boots for sick animals and births; handwashing; no eating or drinking in the animal house; pregnant women and children kept away from abortions and sick animals |
| Records | Biosecurity visitor log; incident log; reviewed monthly by the founder |

## 12. Health plan and vet visits

The health plan is written with the vet before G5 and stored in `AnimalEvents`:

- vaccines the vet recommends (for example against PPR, which the farm treats as a priority [V LVS-14]), their timing and who gives them; where the vet buys vaccines (RAB sells vaccines through IremboGov to farmers and vets [V LVS-44]);
- a worm-control approach per season, including the April and October peaks [V LVS-46];
- kid care (colostrum, navel care, weaning) as the vet describes;
- reporting duties and numbers;
- a records review at each visit.

## 13. Identification and traceability

No small-ruminant ID regulation was found; Ngoma required ear tags for cattle going to market in 2026 [V LVS-05, U for goats]. The farm tags every animal itself (unique numbers) and keeps the register so a regulation or a buyer's need can be met later.

## 14. Open items for the vet and RAB

1. The current RVF and PPR status for the farm's district, and what movement is allowed for a farm that is itself disease free.
2. Whether farm-gate sales to licensed abattoirs continue under quarantine.
3. Vaccines, timing and who gives them.
4. A worm-control plan for the site.
5. Quarantine period for arrivals.
6. Mortality alert thresholds.
7. Brucellosis testing for the source herd and the purchased animals.
8. Carcass disposal rules near the lake.

No sources were added by this file.
