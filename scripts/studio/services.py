"""Electrical and plumbing services for one studio, plus the shared site systems.

Design intent only: ratings are [A] until a RURA class A electrician designs and certifies the
installation (RS 565-1:2011, STU-14). Cable data are typical IEC 60364-5-52 values for PVC
copper; confirm against the cable actually bought.

The studio plugs in (D-021): one 32 A inlet takes any 230 V source, and the studio's own board protects
everything behind it with one RCBO per circuit.
"""
from __future__ import annotations

import math
from dataclasses import dataclass, field

import params as P
from kits import roof_frame
from layout import Layout
from model import Box, Bought, Kit, Step

# mm2 -> (current capacity A, mV/A/m single phase) for 2-core PVC Cu in conduit on a wall (method B1), 30 C
CABLE = {1.5: (17.5, 29.0), 2.5: (24.0, 18.0), 4.0: (32.0, 11.0), 6.0: (41.0, 7.3), 10.0: (57.0, 4.4),
         16.0: (76.0, 2.8)}
# mm2 -> current capacity A in conduit inside a thermally insulating wall (method A1), 30 C: the final circuits
# run in the foam-filled batten cavity of the lining (AS-15). IEC 60364-5-52 table B.52.2.
CABLE_A1 = {1.5: 14.5, 2.5: 19.5, 4.0: 26.0, 6.0: 34.0, 10.0: 46.0, 16.0: 61.0}
AMBIENT_FACTOR = 0.94  # 35 C ambient inside a warm steel box [A]
STANDARD_INLET_A = 32.0  # the IEC 60309 size generators, inverters and site boards plug into
VOID = 30.0  # conduit zone in the ceiling lining, above the finished ceiling (60 mm lining, AS-15)
# circuit colour by what it feeds: the first three slots of the dataviz reference palette, which stay apart for
# every pair and under colour-blindness; the spare way is grey
GROUP_COLOUR = {"lights": "#2a78d6", "sockets": "#eb6834", "fixed": "#1baf7a", "spare": "#9a9893"}
# typical device sizes, w x h x d in mm, d out of the face it is fixed to [A]: the GLB box, the 3D render and
# the item card on /en/studio. A ceiling device's w x h is its footprint.
SIZE = {"board": (300, 400, 110), "inlet": (90, 120, 100), "ceiling": (220, 220, 50), "bulkhead": (200, 120, 80),
        "walllamp": (120, 160, 240), "strip": (1200, 20, 12), "switch": (86, 86, 12), "switch65": (90, 90, 55),
        "usb": (86, 86, 40), "socket": (86, 86, 40), "socket2": (146, 86, 40), "socket66": (95, 110, 80),
        "outlet": (86, 86, 20), "timer": (146, 86, 40), "isolator": (90, 110, 65), "wallfan": (360, 360, 230),
        "extract": (160, 160, 40), "alarm": (110, 110, 45), "earth": (16, 1500, 16)}
PRICE_KEY = {"board": "db", "inlet": "inlet", "ceiling": "luminaire", "bulkhead": "bulkhead",
             "walllamp": "luminaire", "strip": "luminaire", "switch": "switch", "switch65": "switch65",
             "usb": "usbsocket", "socket": "socket", "socket2": "socket2", "socket66": "socket66", "outlet": "fcu",
             "timer": "dptimer", "isolator": "isolator", "wallfan": "fan", "extract": "fan", "alarm": "alarm",
             "earth": "earthrod"}


@dataclass
class Point:
    id: str
    kind: str  # light | switch | socket | usb | outlet | fan | db | inlet | alarm | earth
    x: float
    y: float
    z: float
    label: str
    circuit: str = ""
    watts: float = 0.0
    face: str = "+y"  # the way the device faces: +y on the back wall, -y the front wall, -x the partition, -z down
    model: str = ""  # the device drawn and carded (SIZE); the kind when it is the plain one

    def __post_init__(self) -> None:
        self.model = self.model or self.kind


def device_box(p: Point) -> Box:
    """The device as a box on its face: out of the wall by its depth, or hanging below a ceiling or rail."""
    w, h, d = SIZE[p.model]
    axis, out = p.face[1], 1 if p.face[0] == "+" else -1
    if p.model == "earth":  # the rod goes down into the ground from its pit
        return Box(p.x - w / 2, p.y - d / 2, p.z - h, p.x + w / 2, p.y + d / 2, p.z)
    if axis == "z":
        a, b = (h, w) if p.model == "strip" else (w, h)  # the strip runs along y under the galley cabinet
        z0, z1 = (p.z - d, p.z) if out < 0 else (p.z, p.z + d)
        return Box(p.x - a / 2, p.y - b / 2, z0, p.x + a / 2, p.y + b / 2, z1)
    n0, n1 = (0, d) if out > 0 else (-d, 0)
    if axis == "y":
        return Box(p.x - w / 2, p.y + n0, p.z - h / 2, p.x + w / 2, p.y + n1, p.z + h / 2)
    return Box(p.x + n0, p.y - w / 2, p.z - h / 2, p.x + n1, p.y + w / 2, p.z + h / 2)


@dataclass
class Circuit:
    id: str
    name: str
    breaker: str  # e.g. B16
    cable: float  # mm2
    group: str = "spare"  # lights | sockets | fixed | spare
    relay: bool = False  # shed by the priority relay while the hob runs
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
        # in conduit inside the insulated lining, derated for the warm box
        return CABLE_A1[self.cable] * AMBIENT_FACTOR

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


@dataclass
class CableRun:
    """One circuit's conduit route, as plumbing's PipeRun: a polyline in the layout frame (mm)."""
    circuit: str
    path: list[tuple[float, float, float]]
    outdoor: bool = False

    @property
    def length(self) -> float:
        return sum(math.dist(a, b) for a, b in zip(self.path, self.path[1:]))


class _Walk:
    """A route drawn leg by leg, keeping the cable distance at each point it reaches."""

    def __init__(self, start: tuple[float, float, float], d0: float = 0.0) -> None:
        self.path, self.d = [start], d0

    def to(self, *qs: tuple[float, float, float]) -> float:
        for q in qs:
            if math.dist(q, self.path[-1]) > 0.5:
                self.d += math.dist(self.path[-1], q)
                self.path.append(q)
        return self.d


def _hop(w: _Walk, b: tuple[float, float, float], top: float) -> float:
    """Up into the ceiling void, along x then y (so back-wall and partition runs keep to the wall's top edge),
    then a vertical drop to the device: the safe zones of the E-101 note."""
    a = w.path[-1]
    return w.to((a[0], a[1], top), (b[0], a[1], top), (b[0], b[1], top), b)


def conduit_length(runs: list[CableRun]) -> float:
    """The union of the runs' straight legs (mm), so a leg shared by several circuits is one conduit."""
    lines: dict[tuple, list[tuple[float, float]]] = {}
    total = 0.0
    for r in runs:
        for a, b in zip(r.path, r.path[1:]):
            moving = [i for i in range(3) if abs(a[i] - b[i]) > 0.5]
            if len(moving) != 1:
                total += math.dist(a, b)
                continue
            i = moving[0]
            key = (i,) + tuple(round(a[j]) for j in range(3) if j != i)
            lines.setdefault(key, []).append((min(a[i], b[i]), max(a[i], b[i])))
    for spans in lines.values():
        spans.sort()
        s0, s1 = spans[0]
        for t0, t1 in spans[1:]:
            if t0 > s1:
                total, s0, s1 = total + s1 - s0, t0, t1
            else:
                s1 = max(s1, t1)
        total += s1 - s0
    return total


def electrical(lo: Layout) -> tuple[list[Point], list[Circuit], list[CableRun], Kit]:
    f = roof_frame(lo)
    e = P.LINING_WALL.value
    W, H = lo.W, lo.H
    top = H + VOID
    out_y = W + e + 50  # the outside face of the front wall
    zr = f["vz"] - 120  # outdoor runs keep just under the veranda canopy
    ledger = f["yb"] + 50  # the veranda ledger along the front wall
    entry = lo.o1[1]  # the solid strip between the slider and W1 starts here, by the galley
    stringer = f["yb"] + f["fw"] - 920  # the stair's central stringer, between its two flights
    db = Point("DB", "db", lo.galley_x0 - 300, 0, 1625, "Unit board, 24 modules (2 x 12), by the galley",
               face="+y", model="board")
    hob_y, fridge_y = (lo.hob[0] + lo.hob[1]) / 2, (lo.fridge[0] + lo.fridge[1]) / 2
    pts = [
        db,
        Point("L1", "light", 800, W / 2, H, "Ceiling light, bed", "C1", 12, "-z", "ceiling"),
        Point("L2", "light", 2300, W / 2, H, "Ceiling light, living", "C1", 12, "-z", "ceiling"),
        Point("L3", "light", lo.galley_x0 - 200, W / 2, H, "Ceiling light, galley", "C1", 12, "-z", "ceiling"),
        Point("L4", "light", (lo.bath_x0 + lo.L) / 2, lo.bath_y1 / 2, H, "Bathroom light IP65", "C1", 12, "-z",
              "bulkhead"),
        Point("L5", "light", 300, 0, 1150, "Wall reading light over the bed (wall side)", "C1", 4, "+y", "walllamp"),
        Point("L7", "light", lo.part_x0 - 300, (lo.fridge[0] + lo.sink[1]) / 2, 1790, "Under-cabinet LED strip", "C1",
              10, "-z", "strip"),
        # entry switches on the solid strip just past the slider: on the glass they had nothing to hold them
        Point("S1", "switch", entry + 100, W, 1100, "Entry: bed (2-way), living and galley lights", "C1", face="-y"),
        Point("S2", "switch", lo.bedside[0] + 170, 0, 1000, "Bed: ceiling light (2-way), over the bedside table",
              "C1"),
        Point("S3", "switch", lo.bdoor[1] + 120, lo.bath_y1 + lo.cross_t, 1100, "Bathroom light + fan (outside)",
              "C1"),
        Point("F1", "fan", lo.L - 900, 0, 2100, "Bathroom extract 100 mm, IPX4 for zone 1, with run-on", "C1", 20,
              model="extract"),
        Point("F2", "fan", 1800, 0, 2050, "Wall fan 300 mm", "C1", 50, model="wallfan"),
        Point("P1", "usb", 300, lo.bed_y0, 750, "Socket + USB-C in the headboard (wall side)", "C2", 200),
        Point("P2", "usb", lo.bedside[0] + 170, 0, 650, "Bedside socket + USB-C (reading lamp)", "C2", 200),
        Point("P3", "usb", lo.sofa[1] - 150, 0, 850, "Socket + USB-C over the sofa arm, for the sofa and the table",
              "C2", 500),
        Point("P5", "socket", entry + 300, out_y, 400, "Deck socket IP66, outside by the slider", "C2", 300,
              model="socket66"),
        Point("P6", "socket", lo.part_x0, fridge_y, 1100, "Worktop double socket 1", "C3", 2000, "-x", "socket2"),
        Point("P7", "socket", lo.galley_x0 + 300, 0, 1100, "Worktop double socket 2 (back wall)", "C3", 1000,
              model="socket2"),
        Point("P8", "socket", lo.part_x0, fridge_y, 250, "Fridge socket", "C3", 100, "-x"),
        Point("P12", "socket", lo.part_x0, hob_y, 1720, "Double socket above the hood: hood + Wi-Fi router", "C3",
              120, "-x", "socket2"),
        Point("P9", "outlet", lo.part_x0, hob_y, 600, "Hob outlet plate, isolated at its RCBO on the board", "C4",
              P.HOB_KW.value * 1000, "-x"),
        Point("P10", "outlet", lo.part_x0, lo.sink[1] - 60, 1700, "Heater DP switch + timer", "C5",
              P.HEATER_KW.value * 1000, "-x", "timer"),
        Point("L8", "light", 2900, ledger, zr, "Deck light IP65, under the veranda canopy", "C6", 10, "-z",
              "bulkhead"),
        Point("S5", "switch", entry + 195, W, 1100, "Deck light, beside the entry switch", "C6", face="-y"),
        Point("S4", "switch", -200, stringer, 1100, "Stair and roof lights (2-way), IP65 at the stair foot", "C6",
              face="+x", model="switch65"),
        Point("L10", "light", -900, stringer, 1500, "Stair light IP65", "C6", 8, model="bulkhead"),
        Point("S6", "switch", f["xa"] + 25, f["yb"] - 150, f["deck_top"] + 1000,
              "Stair and roof lights (2-way), IP65 at the stair head", "C6", face="-x", model="switch65"),
        Point("L9", "light", 1500, f["yb"] - 60, f["deck_top"] + 1000,
              "Roof terrace lights IP65 (x2), under the front top rail", "C6", 20, "-z", "bulkhead"),
        Point("P11", "outlet", 900, 0, 2150, "AC provision: isolator", "C7", 1000, model="isolator"),
        Point("AL1", "alarm", 1550, W / 2, H, "Smoke alarm, 10-year battery", face="-z"),
        Point("AL2", "alarm", lo.galley_x0 - 550, W * 0.75, H, "Heat alarm, kitchen, 10-year battery", face="-z"),
        Point("E1", "earth", db.x, -(e + 400), -P.DECK_HEIGHT.value,
              "Earth rod 1.5 m copper-bonded in an inspection pit, behind the board", face="+z"),
    ]
    circuits = [
        Circuit("C1", "Indoor lights and fans", "B6", 1.5, "lights"),
        Circuit("C2", "Sockets: bed, sofa and deck", "B16", 2.5, "sockets"),
        Circuit("C3", "Kitchen sockets, fridge and hood", "B16", 2.5, "sockets"),
        Circuit("C4", "Induction hob", "B20", 4.0, "fixed"),
        Circuit("C5", f"{P.HEATER_L.value:.0f} L water heater", "B16", 2.5, "fixed", relay=True),
        Circuit("C6", "Outdoor lights: deck, stair and roof", "B6", 1.5, "lights"),
        Circuit("C7", "AC provision", "B16", 2.5, "fixed", relay=True),
    ]
    byid = {c.id: c for c in circuits}
    for p in pts:
        if p.circuit:
            byid[p.circuit].loads.append(p.id)
            byid[p.circuit].design_w += p.watts
    # routes: each circuit leaves the top of the board side by side, then loops box to box, nearest first
    runs: list[CableRun] = []
    for i, c in enumerate(circuits):
        reach: dict[str, float] = {}
        w = _Walk((db.x + (i - (len(circuits) - 1) / 2) * 30, db.y, db.z + SIZE["board"][1] / 2))
        if c.id == "C6":
            # out through one gland high in the solid front strip at end A, under the canopy line
            _hop(w, (300.0, W, zr), top)
            runs.append(CableRun(c.id, w.path))
            o = (300.0, out_y, zr)
            deck = _Walk(w.path[-1], w.d)
            reach["L8"] = deck.to(o, (300.0, ledger, zr), (2900.0, ledger, zr))
            stair = _Walk(o, w.d + math.dist(w.path[-1], o))
            reach["S4"] = stair.to((-200.0, out_y, zr), (-200.0, stringer, zr), (-200.0, stringer, 1100.0))
            reach["L10"] = stair.to((-200.0, stringer, 1500.0), (-900.0, stringer, 1500.0))
            head = f["deck_top"] + 1000
            reach["S6"] = stair.to((-900.0, stringer, head), (f["xa"] + 25, stringer, head),
                                   (f["xa"] + 25, f["yb"] - 150, head))
            reach["L9"] = stair.to((f["xa"] + 25, f["yb"] - 60, head), (1500.0, f["yb"] - 60, head))
            runs += [CableRun(c.id, deck.path, outdoor=True), CableRun(c.id, stair.path, outdoor=True)]
        else:
            left = [p for p in pts if p.circuit == c.id]
            while left:
                here = w.path[-1]
                nxt = min(left, key=lambda p: abs(p.x - here[0]) + abs(p.y - here[1]) + abs(top - p.z))
                left.remove(nxt)
                if nxt.y > W:  # outside the front wall: drop inside the lining, then through the wall at its height
                    _hop(w, (nxt.x, W, nxt.z), top)
                    reach[nxt.id] = w.to((nxt.x, nxt.y, nxt.z))
                else:
                    reach[nxt.id] = _hop(w, (nxt.x, nxt.y, nxt.z), top)
            runs.append(CableRun(c.id, w.path))
        c.length_m = round(max(reach.values()) / 1000 * 1.1, 1)
    for c in circuits:  # socket circuits are checked at their breaker rating
        if c.id in ("C2", "C3", "C7"):
            c.design_w = max(c.design_w, c.In * P.SUPPLY_V.value * (0.5 if c.id == "C2" else 0.75))
    circuits.append(Circuit("C8", "Spare", "B16", 2.5))
    # the studio plugs in: a weatherproof inlet outside the back wall, straight behind the board
    sup = inlet(max_demand(circuits, pts)["total_A"])
    pts.insert(1, Point("PI", "inlet", db.x, -(e + 10), db.z - 400,
                        f"Power inlet {sup['rating_A']:.0f} A IP67 (IEC 60309 blue, 2P+E), outside behind the board",
                        face="-y"))
    k = Kit("K8", "Electrical", "electrical", "site")
    for p in pts:
        k.buy(Bought(f"K8-{p.id}", p.label, "K8", "safety" if p.kind == "alarm" else "electrical", "electrical", 1,
                     "each", PRICE_KEY[p.model], device_box(p), step="S04" if p.kind == "earth" else "S19",
                     layer="electrical", color="electric"))
    for c in circuits:
        if c.loads:
            m = sum(r.length for r in runs if r.circuit == c.id) / 1000 * 1.1 + 1  # slack, and a metre in the board
            k.buy(Bought(f"K8-CBL-{c.id}", f"Cable {c.cable} mm2 T+E/singles in conduit, {c.name}", "K8",
                         "electrical", "electrical", math.ceil(m), "m", f"cable{c.cable}", step="S04"))
    k.buy(Bought("K8-TAILS", f"Cable {sup['tails_mm2']:g} mm2 tails, inlet to main breaker, through a gland in the "
                 "back wall", "K8", "electrical", "electrical", 2, "m", f"cable{sup['tails_mm2']}", step="S04"))
    k.buy(Bought("K8-PLUG", f"Matching {sup['rating_A']:.0f} A plug (IEC 60309 blue), for whatever supply cable",
                 "K8", "electrical", "electrical", 1, "each", "plug", step="S19"))
    k.buy(Bought("K8-CONDUIT", "PVC conduit 20 mm + boxes, in the lining", "K8", "electrical", "electrical",
                 math.ceil(conduit_length([r for r in runs if not r.outdoor]) / 1000 * 1.1), "m", "conduit",
                 step="S04"))
    k.buy(Bought("K8-CONDUIT-OUT", "UV-stable conduit 20 mm + IP66 glands, outdoor runs", "K8", "electrical",
                 "electrical", math.ceil(conduit_length([r for r in runs if r.outdoor]) / 1000 * 1.1), "m",
                 "conduit_out", step="S19"))
    k.buy(Bought("K8-MAIN", f"Main breaker {sup['main_A']:.0f} A DP (C curve) + DIN kWh check meter", "K8",
                 "electrical", "electrical", 1, "set", "mainsw", step="S19"))
    k.buy(Bought("K8-SPD", "Surge protection device type 2", "K8", "electrical", "electrical", 1, "each", "spd",
                 step="S19"))
    ways = {b: sum(1 for c in circuits if c.loads and c.breaker == b) for b in ("B6", "B16", "B20")}
    k.buy(Bought("K8-RCBO", "RCBOs 30 mA type A, 1 module (" + ", ".join(f"{b} x{q}" for b, q in ways.items() if q)
                 + ")", "K8", "electrical", "electrical", sum(ways.values()), "each", "rcbo", step="S19"))
    shed = " and ".join(c.id for c in circuits if c.relay)
    k.buy(Bought("K8-RELAY", f"Priority relay, DIN: senses the hob (C4) and sheds {shed}", "K8", "electrical",
                 "electrical", 1, "each", "relay", step="S19"))
    k.buy(Bought("K8-CONTACTOR", f"Contactor 2-pole 25 A, DIN: the {shed} lines", "K8", "electrical", "electrical",
                 1, "each", "contactor", step="S19"))
    k.buy(Bought("K8-FIRE", "Fire extinguisher 2 kg ABC + fire blanket", "K8", "safety", "furnishing", 1, "set",
                 "extinguisher", step="S19"))
    k.steps += [
        Step("S04", "K8", "Services first fix: earth rod, conduits and cables in the batten cavities, pipes in the floor "
             "void; pressure-test the pipes at 10 bar before the foam", [], {}, 2,
             "HOLD before S05: licensed electrician and plumber on site; the test is recorded."),
        Step("S19", "K8", "Second fix: unit board, devices, lights, alarms; test and certify", [], {}, 1,
             "Certificate from a RURA class A electrician before power-on."),
    ]
    return pts, circuits, runs, k


def max_demand(circuits: list[Circuit], pts: list[Point]) -> dict[str, float]:
    """Diversified maximum demand (IET OSG-style allowances, [A])."""
    by = {c.id: c for c in circuits}
    v = P.SUPPLY_V.value
    light = sum(p.watts for p in pts if p.kind == "light") / v * 0.66
    fans = sum(p.watts for p in pts if p.kind == "fan") / v
    sockets = 10 + 0.4 * by["C2"].In  # kettle on C3 plus 40 % of the other socket circuit
    hob_a = by["C4"].design_w / v
    hob = min(hob_a, 10 + 0.3 * max(0.0, hob_a - 10))
    heater = by["C5"].design_w / v
    ac = 1000 / v
    # priority relay: the heater and the AC pause while the hob is on, so only the larger side counts
    total = light + fans + sockets + max(hob, heater + ac)
    return {"lighting": light, "fans": fans, "sockets": sockets, "hob": hob, "heater": heater, "ac": ac,
            "total_A": total}


def inlet(md_a: float) -> dict[str, float]:
    """The studio's one connection to any supply: the smallest IEC 60309 inlet above the maximum demand, a main
    breaker of the same rating that protects the inlet and its tails whatever feeds them, and tails sized to it
    (method B: short, through the gland). Whatever feeds the inlet protects its own cable at that rating or less."""
    rating = next(r for r in (16.0, 32.0, 63.0, 125.0) if r >= md_a)
    tails = next(s for s in (2.5, 4.0, 6.0, 10.0, 16.0) if CABLE[s][0] * AMBIENT_FACTOR >= rating)
    return {"rating_A": rating, "main_A": rating, "tails_mm2": tails}


# ------------------------------------------------------------------------------- plumbing
# pipe colour by what it carries, from the dataviz reference palette: blue cold, red hot, amber tempered and brown
# drains pass its all-pairs check, colour-blind views included (worst pair 9.6, validate_palette.js); the vent is
# the neutral grey and is drawn dashed, drains are drawn heavier and every run is labelled, so colour never works alone
SYSTEM_GROUP = {"cold": "cold", "hot": "hot", "tempered": "tempered", "soil": "drain", "waste": "drain", "vent": "vent"}
SYSTEM_COLOUR = {"cold": "#2a78d6", "hot": "#e34948", "tempered": "#eda100", "drain": "#8b4a12", "vent": "#9a9893"}
# typical fitting sizes, w x h x d in mm as SIZE, d out of the face it is fixed to [A]
FIT_SIZE = {"meter": (90, 260, 80), "heater": (450, 450, 300), "tmv": (150, 150, 60), "kitchentap": (60, 60, 300),
            "filter": (240, 330, 110), "showerset": (180, 1000, 100), "cistern": (500, 1120, 80),
            "basintap": (40, 40, 270), "chamber": (450, 450, 600), "greasetrap": (0, 0, 0), "vent": (75, 150, 75)}
HEATER_ITEM = f"Electric storage water heater {P.HEATER_L.value:.0f} L, {P.HEATER_KW.value:g} kW, IPX4, with T&P valve"
TEMPERED_MAX = 2000.0  # mixed water from the TMV to its outlet, at most 2 m, so no long warm dead leg


@dataclass
class Fitting:
    """A plumbing point, as electrical's Point: a tap, a valve or the heater where pipe runs end."""
    id: str
    kind: str  # valve | heater | tap | filter | shower | wc | vent | site
    model: str  # the piece drawn and carded (FIT_SIZE)
    x: float
    y: float
    z: float
    label: str
    item: str = ""  # its line in the bill of materials
    runs: str = ""  # the runs that end on it
    rating: str = ""
    face: str = "-x"  # as Point.face: -x on the partition or end wall B, +z standing on a worktop


def plumbing(lo: Layout) -> tuple[list[PipeRun], list[Fitting], Kit, dict[str, float]]:
    """Every run drawn leg by leg in the layout frame. Supplies run inside the units and the walls, cold 300 mm and
    hot 360 mm above the floor, then straight up to their outlet; drains drop from each outlet through the floor
    and hang in the void under it."""
    L, W = lo.L, lo.W
    cav = P.LINING_WALL.value - 19  # the middle of the 38 mm batten cavity behind the 12 mm ply
    vz = -260.0  # pipe zone in the void under the floor (cross-members are 122 deep)
    zc, zh = 300.0, 360.0  # cold and hot runs in the walls
    wz = vz - 60  # the main comes in under the drains, clear of the basin waste
    xs = lo.part_x0 - 30  # in the sink base, along its back
    xp = lo.part_x0 + lo.part_t / 2  # in the partition
    yb = -cav  # in the back wall's lining
    xb = L + cav  # in end wall B's lining, behind the 30 mm build-out in the bathroom
    tx0, tx1, ty0, ty1 = lo.tray
    shower = ((tx0 + tx1) / 2, (ty0 + ty1) / 2)
    wc = (lo.wall_b + 20, lo.wc_cy)  # the wall-hung pan drains into the frame in the end wall
    basin = ((lo.basin[0] + lo.basin[1]) / 2, (lo.basin[2] + lo.basin[3]) / 2)
    sink = (lo.part_x0 - 260, (lo.sink[0] + lo.sink[1]) / 2)  # the bowl's waste
    ic = (L + 900, W / 2)  # inspection chamber outside end B
    # the heater is a box on end wall B above the WC (D-024), clear of the flush plate and a guest's head; its pipes
    # come from below, 100 mm out from the tiles, and rise in the wall past the cistern frame, before the cross wall
    hw, hh, hd = FIT_SIZE["heater"]
    hz0 = 1750.0
    hcx = lo.wall_b - 100
    h_in, h_out = (hcx, lo.wc_cy + 130, hz0), (hcx, lo.wc_cy + 190, hz0)
    yr_c, yr_h = lo.bath_y1 - 100, lo.bath_y1 - 50
    ym = lo.sink[1] - 60  # the main rises at the open end of the sink base, through the stop valve set
    yk_c, yk_h = sink[1] + 45, sink[1] - 45  # the sink's angle valves on the back of the sink base
    y_w2, y_h1 = lo.sink[0] + 50, yk_h  # where the bathroom's cold leaves the sink base, and the sink's hot arrives
    y_tmv = (ty1 + lo.wc_cy - 190) / 2  # the TMV in end wall B, between the shower screen and the WC pan
    z_tmv = 410.0
    yb_c, yb_t = basin[1] - 45, basin[1] + 45  # the basin's angle valves under its top
    vy = 200.0  # the vent rises outside end B, clear of the back corner post
    runs = [
        PipeRun("D1", "soil", 110, [(wc[0], wc[1], 230), (wc[0], wc[1], vz), (L - 100, wc[1], vz - 16),
                                     (L - 100, ic[1], vz - 40), (ic[0], ic[1], vz - 66)], "WC to IC1, 1:40"),
        PipeRun("D2", "waste", 50, [(shower[0], shower[1], -30), (shower[0], shower[1], vz + 40),
                                     (L - 160, shower[1], vz + 15), (L - 160, ic[1], vz - 5),
                                     (L - 100, ic[1], vz - 10)], "Shower (90 mm tray waste) joins the soil run"),
        PipeRun("D3", "waste", 40, [(basin[0], basin[1], 800), (basin[0], basin[1], vz + 45),
                                     (L - 220, basin[1], vz + 40), (L - 220, ic[1], vz + 8),
                                     (L - 100, ic[1], vz)], "Basin (wash lobby) joins the soil run"),
        PipeRun("D4", "waste", 50, [(sink[0], sink[1], 700), (sink[0], sink[1], vz + 60),
                                     (L + 900, sink[1], vz - 30)], "Kitchen sink to the grease trap (separate soak pit)"),
        PipeRun("V1", "vent", 75, [(L - 100, ic[1], vz - 35), (L + 120, ic[1], vz - 35), (L + 120, vy, vz - 35),
                                    (L + 120, vy, 3300 + 1100 + 900)], "Open vent up end B to 900 above the guardrail"),
        PipeRun("W1", "cold", 25, [(L + 900, ym, wz), (xs, ym, wz), (xs, ym, 450)],
                "Cold main in from the farm, up into the sink base: stop valve, filter, check meter"),
        PipeRun("W2", "cold", 20, [(xb, yr_c, zc), (xb, yr_c, 1710), (hcx, yr_c, 1710), (hcx, h_in[1], 1710), h_in],
                "Cold up end wall B to the heater"),
        PipeRun("W3", "cold", 20, [(xs, yk_c, 450), (xs, yk_c, 600)], "Cold to the sink's angle valve"),
        PipeRun("W4", "cold", 20, [(xs, ym, 450), (xs, y_w2, 450), (xp, y_w2, 450), (xp, y_w2, zc), (xp, yb, zc),
                                    (xb, yb, zc), (xb, wc[1], zc), (xb, wc[1], 1000)],
                "Cold through the partition and the walls to the WC cistern"),
        PipeRun("W5", "cold", 20, [(xb, wc[1], zc), (xb, yb_c, zc), (xb, yb_c, 600)], "Cold on to the basin"),
        PipeRun("W6", "cold", 20, [(xb, y_tmv + 40, zc), (xb, y_tmv + 40, zh)], "Cold to the mixing valve"),
        PipeRun("H1", "hot", 20, [h_out, (hcx, h_out[1], 1650), (hcx, yr_h, 1650), (xb, yr_h, 1650), (xb, yr_h, zh),
                                   (xb, y_tmv - 40, zh)], "Hot (60 C) from the heater down to the mixing valve"),
        PipeRun("H2", "hot", 20, [(xb, y_tmv - 40, zh), (xb, yb, zh), (xp, yb, zh), (xp, y_h1, zh), (xp, y_h1, 600),
                                   (xs, yk_h, 600)], "Hot back along the walls to the sink (direct 60 C, labelled)"),
        PipeRun("T1", "tempered", 20, [(xb, y_tmv, z_tmv + 50), (xb, y_tmv, 1110), (xb, shower[1], 1110)],
                "TMV 41-44 C up to the shower valve"),
        PipeRun("T2", "tempered", 20, [(xb, y_tmv, z_tmv + 50), (xb, yb_t, z_tmv + 50), (xb, yb_t, 600)],
                "Tempered to basin"),
    ]
    fittings = [
        Fitting("SV", "valve", "meter", lo.part_x0, ym, 320, "Stop valve, Y-filter and check meter on the main, "
                "in the sink base", "Stop valve + Y-filter + check water meter", "W1", "DN25"),
        Fitting("WH", "heater", "heater", lo.wall_b, lo.wc_cy, hz0 + hh / 2, f"{P.HEATER_L.value:.0f} L water heater, "
                "a box on end wall B above the WC, its T&P valve piped outside", HEATER_ITEM, "W2 H1 H2",
                f"{P.HEATER_L.value:.0f} L, {P.HEATER_KW.value:g} kW, 60 C"),
        Fitting("TMV", "valve", "tmv", lo.wall_b, y_tmv, z_tmv, "Mixing valve behind an access panel in end wall B, "
                "between the shower and the WC", "Thermostatic mixing valve (TMV) 41-44 C", "H1 W6 T1 T2", "41-44 C"),
        Fitting("KT", "tap", "kitchentap", lo.part_x0 - 50, sink[1], 900, "Kitchen mixer tap, angle valves under "
                "the sink", "Kitchen mixer tap", "W3 H2 D4", "6 L/min", "+z"),
        Fitting("DF", "filter", "filter", lo.part_x0 - 300, lo.sink[0] + 18, 350, "Drinking-water filter in the "
                "sink base, its own faucet by the tap", "Under-sink drinking-water filter + faucet", "W3",
                "drinking water", "+y"),
        Fitting("SH", "shower", "showerset", lo.wall_b, shower[1], 1110, "Thermostatic shower valve, head and rail "
                "on end wall B", "Thermostatic shower valve + 6-7 L/min head + rail", "T1 D2", "6-7 L/min"),
        Fitting("WC", "wc", "cistern", lo.wall_b, wc[1], 1010, "Concealed cistern in end wall B, dual-flush plate",
                "Slim concealed cistern frame (80 mm) with dual-flush plate, in the end-B stud wall and its 30 mm "
                "build-out", "W4 D1", "dual flush"),
        Fitting("BT", "tap", "basintap", L - 30, basin[1], 820, "Basin mixer, angle valves under the console",
                "Wall basin 400 x 300 + mixer + bottle trap (wash lobby)", "W5 T2 D3", "6 L/min", "+z"),
        Fitting("IC1", "site", "chamber", ic[0], ic[1], vz - 66, "Inspection chamber outside end B, on to the farm's "
                "septic tank", "Septic tank (2 chambers, about 4 m3) + inspection chambers", "D1 D2 D3", "DN110 in",
                "+z"),
        Fitting("GT", "site", "greasetrap", L + 900, sink[1], vz - 30, "To the farm's grease trap and its own soak pit",
                "Grease trap + kitchen soak pit", "D4", "DN50 in", "+z"),
        Fitting("VT", "vent", "vent", L + 120, vy, 3300 + 1100 + 900, "Vent terminal, 900 mm above the roof guardrail",
                "uPVC vent pipe DN75", "V1", "DN75", "+z"),
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
                     step="S04"))
    for i, (nm, unit, q, key) in enumerate((
            ("Pipe fittings and clips (allowance)", "set", 1, "fittings"),
            ("Thermostatic mixing valve (TMV) 41-44 C", "each", 1, "tmv"),
            ("Thermostatic shower valve + 6-7 L/min head + rail", "set", 1, "showerset"),
            (HEATER_ITEM, "each", 1, f"heater{P.HEATER_L.value:.0f}"),
            ("Angle valves with filters", "each", 5, "anglevalve"),
            ("Air admittance valve 110 mm (spare) + rodding eyes", "set", 1, "aav"),
            ("Stop valve + Y-filter + check water meter", "set", 1, "watermeter"),
    )):
        k.buy(Bought(f"K9-X{i + 1}", nm, "K9", "plumbing", "plumbing", q, unit, key, step="S04"))
    k.buy(Bought("K9-HEATER-BOX", f"{P.HEATER_L.value:.0f} L heater box on end wall B above the WC", "K9", "plumbing",
                 "plumbing", 0, "each", "", Box(lo.wall_b - hd, lo.wc_cy - hw / 2, hz0, lo.wall_b, lo.wc_cy + hw / 2, hz0 + hh),
                 step="S10", color="white"))
    site = site_water()
    return runs, fittings, k, site


def site_water() -> dict[str, float]:
    """Shared water and sanitation for the studios (P-301)."""
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
        "pump_lpm": P.UNITS * 7 + 2 * 6,  # a shower per studio at 7 L/min plus two taps at 6 L/min (design peak)
    }
