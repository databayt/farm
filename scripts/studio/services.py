"""Electrical and plumbing services for one studio, plus the shared site systems.

Design intent only: ratings are [A] until a RURA class A electrician designs and certifies the
installation (RS 565-1:2011, STU-14). Cable data are typical IEC 60364-5-52 values for PVC
copper in conduit (method B); confirm against the cable actually bought.
"""
from __future__ import annotations

import math
from dataclasses import dataclass, field

import params as P
from layout import Layout
from model import Box, Bought, Kit

# mm2 -> (current capacity A, mV/A/m single phase) for 2-core PVC Cu in conduit, 30 C
CABLE = {1.5: (17.5, 29.0), 2.5: (24.0, 18.0), 4.0: (32.0, 11.0), 6.0: (41.0, 7.3), 10.0: (57.0, 4.4),
         16.0: (76.0, 2.8)}
AMBIENT_FACTOR = 0.94  # 35 C ambient inside a warm steel box [A]


@dataclass
class Point:
    id: str
    kind: str  # light | switch | socket | usb | outlet | fan | db
    x: float
    y: float
    z: float
    label: str
    circuit: str = ""
    watts: float = 0.0


@dataclass
class Circuit:
    id: str
    name: str
    breaker: str  # e.g. B16
    cable: float  # mm2
    loads: list[str] = field(default_factory=list)
    design_w: float = 0.0
    length_m: float = 0.0

    @property
    def In(self) -> float:
        return float(self.breaker[1:])

    @property
    def Ib(self) -> float:
        return self.design_w / P.SUPPLY_V.value

    @property
    def Iz(self) -> float:
        return CABLE[self.cable][0] * AMBIENT_FACTOR

    def vdrop_pct(self) -> float:
        # design current at the far end (conservative)
        return CABLE[self.cable][1] * self.Ib * self.length_m / 1000 / P.SUPPLY_V.value * 100


@dataclass
class PipeRun:
    id: str
    system: str  # cold | hot | tempered | waste | soil | vent
    dn: int
    path: list[tuple[float, float, float]]
    note: str = ""

    @property
    def length(self) -> float:
        return sum(math.dist(a, b) for a, b in zip(self.path, self.path[1:]))

    def fall(self) -> float:
        """Smallest gradient (drop per run) along horizontal-ish segments, as 1:n -> returns n."""
        worst = 0.0
        for a, b in zip(self.path, self.path[1:]):
            run = math.hypot(b[0] - a[0], b[1] - a[1])
            drop = a[2] - b[2]
            if run > 50:
                worst = max(worst, run / drop if drop > 0 else math.inf)
        return worst


def electrical(lo: Layout) -> tuple[list[Point], list[Circuit], Kit]:
    db = Point("DB", "db", lo.part_x0, 875, 1625, "Unit board on the partition")
    W, H = lo.W, lo.H
    pts = [
        db,
        Point("L1", "light", 800, W / 2, H, "Ceiling light, bed", "C1", 12),
        Point("L2", "light", 2300, W / 2, H, "Ceiling light, living", "C1", 12),
        Point("L3", "light", 3500, W / 2, H, "Ceiling light, kitchen", "C1", 12),
        Point("L4", "light", (lo.bath_x0 + lo.L) / 2, W / 2, H, "Bathroom light IP65", "C1", 12),
        Point("L5", "light", 300, 140, 1050, "Reading light 1", "C1", 4),
        Point("L6", "light", lo.bed_x1 - 300, 140, 1050, "Reading light 2", "C1", 4),
        Point("L7", "light", (lo.fridge[0] + lo.sink[1]) / 2, 320, 1440, "Under-cabinet LED strip", "C1", 10),
        Point("L8", "light", 2900, W + 60, 2350, "Deck light IP65", "C1", 10),
        Point("L9", "light", 1500, W / 2, H + 400, "Roof terrace lights IP65 (x2)", "C1", 20),
        Point("L10", "light", -900, W + 900, 1500, "Stair light IP65", "C1", 8),
        Point("S1", "switch", lo.o1[1] - 150, W - 40, 1100, "Entry: living + kitchen + deck", "C1"),
        Point("S2", "switch", lo.bed_x1 - 60, 160, 900, "Bed: ceiling light (2-way)", "C1"),
        Point("S3", "switch", lo.part_x0, lo.bdoor[1] + 120, 1100, "Bathroom light + fan (outside)", "C1"),
        Point("S4", "switch", -400, W + 600, 1100, "Roof and stair lights (IP65, stair foot)", "C1"),
        Point("P1", "usb", 260, 132, 600, "Bedside socket + USB-C 1", "C2", 200),
        Point("P2", "usb", lo.bed_x1 - 260, 132, 600, "Bedside socket + USB-C 2", "C2", 200),
        Point("P3", "socket", lo.wardrobe[0] - 120, 0, 300, "Socket by the bed (desk ledge)", "C2", 500),
        Point("P4", "socket", lo.o1[0] - 200, W, 300, "Socket, living (front strip)", "C2", 500),
        Point("P5", "socket", 2600, W + 60, 400, "Deck socket IP66", "C2", 300),
        Point("P6", "socket", lo.hob[0] - 60, 0, 1100, "Worktop socket 1 (double)", "C3", 2000),
        Point("P7", "socket", lo.sink[0] + 300, 0, 1100, "Worktop socket 2 (double)", "C3", 1000),
        Point("P8", "socket", lo.fridge[0] + 300, 0, 250, "Fridge socket", "C3", 100),
        Point("P9", "outlet", lo.hob[0] + 225, 0, 600, "Hob connection unit", "C4", P.HOB_KW.value * 1000),
        Point("P10", "outlet", (lo.tall[0] + lo.tall[1]) / 2, 0, 2150, "Heater DP switch + timer", "C5",
              P.HEATER_KW.value * 1000),
        Point("F1", "fan", lo.o2[1] - 60, W, 1950, "Bathroom extract 100 mm (in W1 panel)", "C6", 20),
        Point("F2", "fan", 1800, 0, 2100, "Wall fan", "C6", 50),
        Point("P11", "outlet", 900, 0, 2150, "AC provision: isolator", "C7", 1000),
    ]
    circuits = [
        Circuit("C1", "Lighting (incl. bathroom IP65, deck, roof, stair)", "B6", 1.5),
        Circuit("C2", "Sockets: bedside USB, living, deck", "B16", 2.5),
        Circuit("C3", "Kitchen sockets and fridge", "B16", 2.5),
        Circuit("C4", "Induction hob", "B20", 4.0),
        Circuit("C5", "80 L water heater", "B16", 2.5),
        Circuit("C6", "Extract fan and wall fan", "B6", 1.5),
        Circuit("C7", "AC provision", "B16", 2.5),
    ]
    byid = {c.id: c for c in circuits}
    for p in pts:
        if p.circuit:
            c = byid[p.circuit]
            c.loads.append(p.id)
            c.design_w += p.watts
            run = (abs(p.x - db.x) + abs(p.y - db.y) + abs(H - db.z) + abs(H - p.z)) / 1000 * 1.1
            c.length_m = max(c.length_m, round(run, 1))
    for c in circuits:  # socket circuits are checked at their breaker rating
        if c.id in ("C2", "C3", "C7"):
            c.design_w = max(c.design_w, c.In * P.SUPPLY_V.value * (0.5 if c.id == "C2" else 0.75))
    circuits.append(Circuit("C8", "Spare", "B16", 2.5))
    k = Kit("K8", "Electrical", "electrical", "site")
    for p in pts:
        k.buy(Bought(f"K8-{p.id}", p.label, "K8", "electrical", "electrical", 1, "each",
                     {"light": "luminaire", "switch": "switch", "socket": "socket", "usb": "usbsocket",
                      "outlet": "fcu", "fan": "fan", "db": "db"}[p.kind],
                     Box(p.x - 40, p.y - 20, p.z - 40, p.x + 40, p.y + 20, p.z + 40), step="S19",
                     layer="electrical", color="electric"))
    for c in circuits[:-1]:
        k.buy(Bought(f"K8-CBL-{c.id}", f"Cable {c.cable} mm2 T+E/singles in conduit, {c.name}", "K8", "electrical",
                     "electrical", round(c.length_m * (len(c.loads) or 1) * 0.6 + 5, 0), "m", f"cable{c.cable}",
                     step="S05"))
    k.buy(Bought("K8-CONDUIT", "PVC conduit 20 mm + boxes", "K8", "electrical", "electrical", 60, "m", "conduit",
                 step="S05"))
    k.buy(Bought("K8-SPD", "Surge protection device type 2", "K8", "electrical", "electrical", 1, "each", "spd",
                 step="S19"))
    k.buy(Bought("K8-RCD", "RCD 40 A 30 mA type A (or RCBOs)", "K8", "electrical", "electrical", 1, "each", "rcd",
                 step="S19"))
    k.buy(Bought("K8-MCB", "MCBs (B6 x2, B16 x5, B20 x1)", "K8", "electrical", "electrical", 8, "each", "mcb",
                 step="S19"))
    k.buy(Bought("K8-ISO", "Main switch 40 A DP + check meter (DIN kWh)", "K8", "electrical", "electrical", 1, "set",
                 "mainsw", step="S19"))
    k.buy(Bought("K8-ROD", "Earth rod 1.5 m copper-bonded + clamp + inspection pit", "K8", "electrical", "electrical",
                 1, "each", "earthrod", step="S05"))
    k.buy(Bought("K8-ALARM", "Smoke alarm (10-year) + heat alarm (kitchen)", "K8", "safety", "electrical", 2, "each",
                 "alarm", step="S19"))
    k.buy(Bought("K8-FIRE", "Fire extinguisher 2 kg ABC + fire blanket", "K8", "safety", "furnishing", 1, "set",
                 "extinguisher", step="S19"))
    return pts, circuits, k


def max_demand(circuits: list[Circuit]) -> dict[str, float]:
    """Diversified maximum demand (IET OSG-style allowances, [A])."""
    by = {c.id: c for c in circuits}
    v = P.SUPPLY_V.value
    light = by["C1"].design_w / v * 0.66
    sockets = 10 + 0.4 * by["C2"].In  # kettle on C3 plus 40 % of the other socket circuit
    hob_a = by["C4"].design_w / v
    hob = min(hob_a, 10 + 0.3 * max(0.0, hob_a - 10))
    heater = by["C5"].design_w / v
    fans = by["C6"].design_w / v
    ac = 1000 / v
    # priority relay: the heater pauses while the hob is on, so only the larger of the two counts
    total = light + sockets + max(hob, heater) + fans + ac
    return {"lighting": light, "sockets": sockets, "hob": hob, "heater": heater, "fans": fans, "ac": ac,
            "total_A": total}


def feeder(md_a: float) -> dict[str, float]:
    """Smallest SWA feeder size from the site board that carries the unit and keeps drop under 2 %."""
    L = P.FEEDER_LENGTH.value
    for s in (6.0, 10.0, 16.0):
        iz, mv = CABLE[s]
        drop = mv * md_a * L / 1000 / P.SUPPLY_V.value * 100
        if iz * 0.9 >= 40 and drop <= 2.5:
            return {"size_mm2": s, "drop_pct": drop, "Iz": iz * 0.9, "length_m": L}
    return {"size_mm2": 16.0, "drop_pct": CABLE[16.0][1] * md_a * L / 1000 / P.SUPPLY_V.value * 100,
            "Iz": CABLE[16.0][0] * 0.9, "length_m": L}


# ------------------------------------------------------------------------------- plumbing
def plumbing(lo: Layout) -> tuple[list[PipeRun], Kit, dict[str, float]]:
    W = lo.W
    vz = -260.0  # pipe zone in the void under the floor (cross-members are 122 deep)
    tx0, tx1, ty0, ty1 = lo.tray
    shower = ((tx0 + tx1) / 2, 450.0)
    wc = (lo.wc_cx, W - 180)
    basin = ((lo.basin[0] + lo.basin[1]) / 2, (lo.basin[2] + lo.basin[3]) / 2)
    sink = ((lo.sink[0] + lo.sink[1]) / 2, 250.0)
    heater = ((lo.tall[0] + lo.tall[1]) / 2, 300.0)
    ic = (lo.L + 900, W / 2)  # inspection chamber outside end B
    mains = (lo.L + 900, 150)
    runs = [
        PipeRun("D1", "soil", 110, [(wc[0], wc[1], -30), (wc[0], wc[1], vz), (lo.L - 100, wc[1], vz - 16),
                                     (lo.L - 100, ic[1], vz - 40), (ic[0], ic[1], vz - 66)], "WC to IC1, 1:40"),
        PipeRun("D2", "waste", 50, [(shower[0], shower[1], -30), (shower[0], shower[1], vz + 40),
                                     (lo.L - 160, shower[1], vz + 15), (lo.L - 160, ic[1], vz - 5),
                                     (lo.L - 100, ic[1], vz - 10)], "Shower (90 mm tray waste) joins the soil run"),
        PipeRun("D3", "waste", 40, [(basin[0], basin[1], -30), (basin[0], basin[1], vz + 30),
                                     (lo.L - 220, basin[1], vz + 20), (lo.L - 220, ic[1], vz + 10),
                                     (lo.L - 100, ic[1], vz)], "Basin joins the soil run"),
        PipeRun("D4", "waste", 50, [(sink[0], sink[1], -30), (sink[0], sink[1], vz + 60),
                                     (lo.L + 900, sink[1], vz - 30)], "Kitchen sink to the grease trap (separate soak pit)"),
        PipeRun("V1", "vent", 75, [(lo.L - 100, ic[1], vz - 35), (lo.L + 120, ic[1], vz - 35), (lo.L + 120, 0, 2700),
                                    (lo.L + 120, 0, 3300 + 1100 + 900)], "Open vent up end B to 900 above the guardrail"),
        PipeRun("W1", "cold", 25, [(mains[0], mains[1], vz), (lo.L - 60, 150, vz), (heater[0], 150, vz),
                                    (heater[0], 150, 300)], "Cold main in: stop valve, filter, check meter"),
        PipeRun("W2", "cold", 20, [(heater[0], 150, 300), (heater[0], 150, 1750)], "Cold feed to the heater"),
        PipeRun("W3", "cold", 20, [(heater[0], 150, 300), (sink[0], 150, 300), (sink[0], 250, 650)], "Cold to sink"),
        PipeRun("W4", "cold", 20, [(lo.L - 60, 150, vz), (lo.L - 60, 150, 300), (lo.L - 60, wc[1] - 250, 300),
                                    (wc[0], W - 40, 200)], "Cold to WC cistern"),
        PipeRun("W5", "cold", 20, [(lo.L - 60, 150, 300), (lo.L - 60, basin[1], 650)], "Cold to basin"),
        PipeRun("H1", "hot", 20, [(heater[0], 250, 1750), (heater[0], 250, 400), (lo.bath_x0 + 40, 250, 400)],
                "Hot (60 C) from the heater to the mixing valve"),
        PipeRun("H2", "hot", 20, [(heater[0], 250, 400), (sink[0], 250, 650)], "Hot to sink (direct 60 C, labelled)"),
        PipeRun("T1", "tempered", 20, [(lo.bath_x0 + 40, 250, 400), (lo.bath_x0 + 40, 250, 1100), (tx1 - 300, 20, 1100)],
                "TMV 41-44 C to the shower valve"),
        PipeRun("T2", "tempered", 20, [(lo.bath_x0 + 40, 250, 400), (lo.L - 60, 250, 400), (lo.L - 60, basin[1], 650)],
                "Tempered to basin"),
    ]
    k = Kit("K9", "Plumbing", "plumbing", "site")
    by = {}
    for r in runs:
        key = (r.system, r.dn)
        by[key] = by.get(key, 0) + r.length / 1000
    names = {"soil": "uPVC soil pipe", "waste": "uPVC waste pipe", "vent": "uPVC vent pipe", "cold": "PPR PN20 pipe",
             "hot": "PPR PN20 pipe (hot)", "tempered": "PPR PN20 pipe (tempered)"}
    for (sys, dn), m in sorted(by.items()):
        k.buy(Bought(f"K9-{sys.upper()}-{dn}", f"{names[sys]} DN{dn}", "K9", "plumbing", "plumbing",
                     round(m * 1.15 + 1, 1), "m", f"pipe_{'ppr' if sys in ('cold', 'hot', 'tempered') else 'upvc'}{dn}",
                     step="S05"))
    for i, (nm, unit, q, key) in enumerate((
            ("Pipe fittings and clips (allowance)", "set", 1, "fittings"),
            ("Thermostatic mixing valve (TMV) 41-44 C", "each", 1, "tmv"),
            ("Thermostatic shower valve + 6-7 L/min head + rail", "set", 1, "showerset"),
            ("Electric storage water heater 80 L, 2 kW, with T&P valve", "each", 1, "heater80"),
            ("Angle valves with filters", "each", 5, "anglevalve"),
            ("Air admittance valve 110 mm (spare) + rodding eyes", "set", 1, "aav"),
            ("Stop valve + Y-filter + check water meter", "set", 1, "watermeter"),
    )):
        k.buy(Bought(f"K9-X{i + 1}", nm, "K9", "plumbing", "plumbing", q, unit, key, step="S05"))
    k.buy(Bought("K9-HEATER-BOX", "80 L heater on its steel bracket", "K9", "plumbing", "plumbing", 0, "each", "",
                 Box(lo.tall[0] + 40, 60, 1300, lo.tall[1] - 40, 560, 2150), step="S12", color="white"))
    site = site_water()
    return runs, k, site


def site_water() -> dict[str, float]:
    """Shared water and sanitation for the three studios (P-301)."""
    persons = P.GUESTS.value * P.UNITS
    daily = persons * P.WATER_LPD.value
    pop = P.SEPTIC_POP.value
    rs143 = 3.0 + max(0.0, math.ceil((pop - 6) / 2)) * 1.0  # STU-10 draft
    reg2012 = max(pop * P.WATER_LPD.value / 1000 * 1.0, 2.0) + 0.04 * pop * 3  # STU-11: 24 h or 2 m3, + sludge
    uk = (180 * pop + 2000) / 1000  # STU-09 style allowance
    septic = max(rs143, reg2012, uk)
    return {
        "persons": persons, "daily_L": daily, "tank_m3": math.ceil(daily * 4 / 1000 / 0.5) * 0.5,
        "septic_rs143_m3": rs143, "septic_2012_m3": round(reg2012, 2), "septic_uk_m3": uk,
        "septic_m3": math.ceil(septic * 2) / 2, "chamber1_m3": round(math.ceil(septic * 2) / 2 * 2 / 3, 2),
        "chamber2_m3": round(math.ceil(septic * 2) / 2 / 3, 2),
        "pump_lpm": 3 * 7 + 2 * 6,  # three showers at 7 L/min plus two taps at 6 L/min (design peak)
    }
