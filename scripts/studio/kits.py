"""The eleven kits (K1-K11) of one studio, built from Layout B (D-020). One call = one unit;
both studios use the same kit (parts are sized to the smaller surveyed unit)."""
from __future__ import annotations

import math

from dataclasses import replace

import params as P
from joinery import LEG, T12, T18, carcass
from layout import (AISLE_MIN, CHAIR_GAP, CHAIR_W, GALLEY_D, SOFA_D, SOFA_H, TABLE_D, TABLE_H, TABLE_W, WC_D,
                    WC_PAN, WORKTOP_D, Layout)
from model import Box, Bought, KeepOut, Kit, Op, Part, Step

STEEL_T = 3.0


def split(a: float, b: float, maxw: float = 1220.0) -> list[tuple[float, float]]:
    n = max(1, int(-(-(b - a) // maxw)))
    w = (b - a) / n
    return [(a + i * w, a + (i + 1) * w) for i in range(n)]


def turn(k: Kit, X: float) -> None:
    """Turn a kit drawn along the back wall onto the partition: local (x, y) -> world (X - y, x).

    The galley is built with the same carcass code as a back-wall run (x along the run, y the
    depth from the wall), then turned so its backs sit on the partition face at x = X.
    Face holes move with the panel; a panel whose thickness ran along y swaps faces A and B.
    """
    def tbox(b: Box) -> Box:
        return Box(X - b.y1, b.x0, b.z0, X - b.y0, b.x1, b.z1)

    def tpt(p: list[float]) -> list[float]:
        return [X - p[1], p[0], p[2]]

    for part in k.parts:
        old, new = part.box, tbox(part.box)
        a, b = part.axes
        flip = part.taxis == 1
        part.box = new
        a2, b2 = part.axes
        ops = []
        for op in part.ops:
            if op.face not in ("A", "B"):
                ops.append(op)  # edge holes are symmetric along the edge
                continue
            p0 = list(old.lo)
            p0[a] += op.u
            p0[b] += op.v
            p1 = list(p0)
            p1[a] += op.w
            p1[b] += op.h
            t0, t1 = tpt(p0), tpt(p1)
            face = {"A": "B", "B": "A"}[op.face] if flip else op.face
            ops.append(replace(op, face=face, u=min(t0[a2], t1[a2]) - new.lo[a2], v=min(t0[b2], t1[b2]) - new.lo[b2],
                               w=abs(t1[a2] - t0[a2]), h=abs(t1[b2] - t0[b2])))
        part.ops = ops
        ex, ey, ez = part.explode
        part.explode = (-ey, ex, ez)
    for item in k.bought:
        if item.box is not None:
            item.box = tbox(item.box)


# ------------------------------------------------------------------------------- shell
def shell(lo: Layout) -> Kit:
    """The existing container (for drawings and 3D only; not in the BOM)."""
    k = Kit("K0", "Existing container", "existing", "site")
    e = P.LINING_WALL.value
    xa, xb = -e - 80, lo.L + e + 80
    ya, yb = -e - 43, lo.W + e + 43
    za, zb = -P.LINING_FLOOR.value - 170, -P.LINING_FLOOR.value - 170 + P.EXT_H.value

    def s(i: str, n: str, b: Box, color: str = "steel") -> None:
        k.buy(Bought(i, n, "K0", "existing", "existing", 0, box=b, layer="shell", color=color))

    s("K0-FLOOR", "Base frame and 28 mm floor", Box(xa, ya, za, xb, yb, -P.LINING_FLOOR.value), "base")
    s("K0-BACK", "Back wall (bracing)", Box(xa, ya, za, xb, -e, zb))
    s("K0-ENDA", "End wall A", Box(xa, ya, za, -e, yb, zb))
    s("K0-ENDB", "End wall B (cargo doors on the yellow unit)", Box(lo.L + e, ya, za, xb, yb, zb))
    s("K0-ROOF", "Roof", Box(xa, ya, lo.H + P.LINING_CEIL.value, xb, yb, zb))
    fy0, fy1 = lo.W + e, yb
    s("K0-FRONT-A", "Front wall, end-A strip", Box(xa, fy0, za, lo.o1[0], fy1, zb))
    s("K0-FRONT-HEAD", "Header over the slider (survey: check member)", Box(lo.o1[0], fy0, lo.o1_head, lo.o1[1], fy1, zb))
    s("K0-FRONT-MID", "Front wall between slider and old door", Box(lo.o1[1], fy0, za, lo.o2[0], fy1, zb))
    s("K0-FRONT-B", "Front wall, end-B strip", Box(lo.o2[1], fy0, za, xb, fy1, zb))
    s("K0-SLIDER", "Existing sliding glass wall", Box(lo.o1[0], fy0, 0, lo.o1[1], fy1, lo.o1_head), "glass")
    return k


# ------------------------------------------------------------------------------- K1 lining
def batten_lines(panels: list[tuple[float, float]], gap: float = 600.0) -> list[float]:
    """Batten centrelines under a run of lining panels: one at every joint and at both ends, plus infill
    so no span is over `gap`, so every panel edge lands on a batten."""
    joints = [panels[0][0]] + [b for _, b in panels]
    lines: list[float] = []
    for a, b in zip(joints, joints[1:]):
        n = max(1, math.ceil((b - a) / gap - 1e-9))
        lines += [a + i * (b - a) / n for i in range(n)]
    return lines + [joints[-1]]


def k1_lining(lo: Layout) -> Kit:
    k = Kit("K1", "Insulation and lining", "carpentry + spray foam", "site")
    e = P.LINING_WALL.value
    # floor (founder 2026-10-28): 12 mm sheets wall to wall over a membrane on the treated container floor,
    # long side along the box, the second run starting with a half sheet so no joint lines up (floor.html)
    fx0, fx1, fy0, fy1 = -e, lo.L + e, -e, lo.W + e
    z1 = -(P.LINING_FLOOR.value - 5)  # the 5 mm plank sits on top
    sl, sw, _ = P.SHEETS["PLY12"]
    floor_m2 = (fx1 - fx0) * (fy1 - fy0) / 1e6
    # laid whole on site; the last sheet of each run is cut to fit, and run 2 (ripped to the leftover width)
    # starts with the half sheet the run-1 offcut gives, so the sheets needed are the floor area rounded up
    n_sheets = math.ceil(floor_m2 / (sl * sw / 1e6))
    k.buy(Bought("K1-FLOOR", f"Ply 12 mm sheets {sl} x {sw} for the floor, laid wall to wall in two staggered runs",
                 "K1", "boards", "carpentry", n_sheets, "each", "sheet_PLY12", Box(fx0, fy0, z1 - 12, fx1, fy1, z1),
                 step="S02", layer="envelope", color="PLY12"))
    floor_screws = math.ceil((fx1 - fx0) / 300 + 1) * math.ceil((fy1 - fy0) / 300 + 1)
    k.steps.append(Step("S02", "K1", "Prime the steel; lay the membrane over the treated floor; screw down the floor sheets",
                        [], {"F": floor_screws}, 2,
                        "Never sand the treated container floor. Sheets 2440 x 1220, long side along the box, joints "
                        "staggered by half a sheet, 3 mm gaps, a screw every 300 mm both ways."))
    # battens: one under every panel joint and edge, infill at 600 or less (back wall, end A, front strip,
    # slider head, ceiling); the bathroom walls are K2's studs
    nb = 0

    def batten(where: str, box: Box) -> None:
        nonlocal nb
        nb += 1
        k.buy(Bought(f"K1-BAT-{nb:02d}", f"Batten 38 x 50 treated ({where})", "K1", "timber", "carpentry", 1, "each",
                     "batten", box, step="S03", layer="envelope", color="timber"))

    for x in batten_lines(split(0, lo.part_x0)):
        x0 = min(max(x - 25, 0), lo.part_x0 - 50)
        batten("back wall", Box(x0, -38, 0, x0 + 50, 0, lo.H))
    for y in batten_lines(split(0, lo.W)):
        y0 = min(max(y - 25, 0), lo.W - 50)
        batten("end A", Box(-38, y0, 0, 0, y0 + 50, lo.H))
    for x in batten_lines(split(0, lo.o1[0])):
        x0 = min(max(x - 25, 0), lo.o1[0] - 50)
        batten("front wall", Box(x0, lo.W, 0, x0 + 50, lo.W + 38, lo.H))
    for a, b in split(lo.o1[0], lo.o1[1], 2400):
        batten("slider head", Box(a, lo.W, lo.o1_head, b, lo.W + 38, min(lo.o1_head + 50, lo.H)))
    for x in batten_lines(split(0, lo.L)):
        x0 = min(max(x - 25, 0), lo.L - 50)
        batten("ceiling", Box(x0, 0, lo.H + 12, x0 + 50, lo.W, lo.H + 50))
    k.steps.append(Step("S03", "K1", "Fix the battens: one under every lining-panel joint and edge, infill at 600 mm or less",
                        [], {"L": 6 * nb}, 2, "Winged screws into the steel at both ends and every 600 mm along each batten."))
    # spray foam between the battens, after the first fix and its pressure test (S04)
    for wall, b in (("back", Box(0, -38, 0, lo.L, 0, lo.H)), ("front-A", Box(0, lo.W, 0, lo.o1[0], lo.W + 38, lo.H)),
                    ("ceiling", Box(0, 0, lo.H + 12, lo.L, lo.W, lo.H + 50)),
                    ("end-A", Box(-38, 0, 0, 0, lo.W, lo.H))):
        area = (b.size[0] * b.size[2] if wall in ("back", "front-A")
                else b.size[0] * b.size[1] if wall == "ceiling" else b.size[1] * b.size[2]) / 1e6
        k.buy(Bought(f"K1-INS-{wall}", f"Closed-cell spray foam between the battens, {wall}", "K1", "insulation",
                     "spray foam", round(area, 2), "m2", "sprayfoam", b, step="S05", layer="envelope", color="eps"))
    # lining panels (12 mm ply): back wall to the partition, end A, front strip, ceiling
    n = 0

    def panel(name: str, box: Box) -> None:
        nonlocal n
        n += 1
        k.add(Part(f"K1-{n:02d}", name, "K1", "PLY12", box, step="S05", layer="envelope", edges="",
                   explode=(0, 0, 0)))

    for a, b in split(0, lo.part_x0):
        panel("Back wall lining", Box(a, -12, 0, b, 0, lo.H))
    for a, b in split(0, lo.W):
        panel("End A lining", Box(-12, a, 0, 0, b, lo.H))
    for a, b in split(0, lo.o1[0]):
        panel("Front wall lining (end A)", Box(a, lo.W, 0, b, lo.W + 12, lo.H))
    for a, b in split(lo.o1[0], lo.o1[1], 2400):
        panel("Front head strip", Box(a, lo.W, lo.o1_head, b, lo.W + 12, lo.H))
    for a, b in split(0, lo.L):
        panel("Ceiling panel", Box(a, 0, lo.H, b, lo.W, lo.H + 12))
    lining = [p.id for p in k.parts if p.step == "S05"]
    k.steps.append(Step("S05", "K1", "Spray foam between the battens, let it cure and trim it flush; fix the numbered "
                        "lining panels (cut-outs already in place)", lining, {"F": 40 * len(lining)}, 2,
                        "HOLD: the S04 pressure test has passed. No welding or grinding on the shell once the foam is in."))
    k.buy(Bought("K1-FOAM", "PU foam adhesive and gap filler (750 ml)", "K1", "insulation", "carpentry", 12, "each",
                 "pufoam"))
    k.buy(Bought("K1-DPM", "Polythene membrane 250 um over the treated container floor, laps 150 mm", "K1", "finishes",
                 "carpentry", round(floor_m2 * 1.1, 1), "m2", "dpm", step="S02"))
    k.buy(Bought("K1-SPC", "Oak SPC plank 5 mm with attached underlay, natural oak decor without knots (living area)", "K1",
                 "finishes", "carpentry", round(lo.part_x0 * lo.W / 1e6 * 1.08, 1), "m2", "spc",
                 Box(0, 0, -5, lo.part_x0, lo.W, 0), step="S11", layer="envelope", color="floor"))
    k.buy(Bought("K1-RUST", "Rust converter + zinc primer for steel", "K1", "finishes", "painting", 4, "L", "primer",
                 step="S02"))
    k.buy(Bought("K1-VARN", "Vapour-retarding primer + off-white paint for the linings", "K1", "finishes", "painting",
                 10, "L", "varnish"))
    return k


# ------------------------------------------------------------------------------- K2 bathroom
def k2_bath(lo: Layout) -> Kit:
    """Shower, WC and basin in one row on end wall B. The partition (along y) closes the bathroom
    from the galley; a cross wall (along x) with a sliding door closes it from the wash lobby,
    where the basin stands outside the door under the W1 window."""
    k = Kit("K2", "Bathroom shell and fixtures", "carpentry + tiling + plumbing", "workshop + site")
    px0, px1 = lo.part_x0, lo.part_x0 + lo.part_t
    cy0, cy1 = lo.bath_y1, lo.bath_y1 + lo.cross_t
    d0, d1 = lo.bdoor
    door_h = 2050.0
    # frame studs (40 x 40 timber): the partition, then the cross wall and its door opening
    studs = [Box(px0 + 18, y, 0, px0 + 58, y + 40, lo.H) for y in (0.0, 800.0, cy0 - 40)]
    studs += [Box(x, cy0 + 18, 0, x + 40, cy0 + 58, lo.H) for x in (d1, lo.L - 40)]
    for i, b in enumerate(studs):
        k.buy(Bought(f"K2-STUD{i + 1}", "Stud 40 x 40 treated", "K2", "timber", "carpentry", 1, "each", "stud", b,
                     step="S06", layer="envelope", color="timber"))
    n = 0

    def part(name: str, box: Box, mat: str = "MPLY18", ops=None, step="S06", edges="", ex=(0, 0, 0)) -> Part:
        nonlocal n
        n += 1
        return k.add(Part(f"K2-{n:02d}", name, "K2", mat, box, step=step, edges=edges, ops=ops or [], explode=ex))

    for a, b in split(0, cy1):
        part("Partition skin (galley face)", Box(px0, a, 0, px0 + T18, b, lo.H), ex=(-300, 0, 0))
    part("Cross wall skin over the door", Box(d0, cy1 - T18, door_h, d1, cy1, lo.H), ex=(0, 300, 0))
    for a, b in split(d1, lo.L):
        part("Cross wall skin (lobby face)", Box(a, cy1 - T18, 0, b, cy1, lo.H), ex=(0, 300, 0))
    part("Door jamb (hinge side)", Box(d0, cy0, 0, d0 + T18, cy1 - T18, door_h), step="S07", ex=(-200, 0, 0))
    part("Door jamb (latch side)", Box(d1 - T18, cy0, 0, d1, cy1 - T18, door_h), step="S07", ex=(200, 0, 0))
    part("Door head", Box(d0 + T18, cy0, door_h - T18, d1 - T18, cy1 - T18, door_h), step="S07", ex=(0, 0, 200))
    k.buy(Bought("K2-DOOR", f"Door leaf {d1 - d0 - 2 * T18:.0f} x 2,030, moisture-resistant, opens into the "
                 "bathroom, privacy lock", "K2", "doors", "carpentry", 1, "each", "doorleaf",
                 Box(d0 + T18 + 2, cy0 + 10, 10, d1 - T18 - 2, cy0 + 50, door_h - T18 - 2), step="S07", color="door"))
    # wet walls: cement board + membrane + tiles inside the bathroom, and a splashback behind the basin
    for wid, nm, b in (
        ("BACK", "back wall", Box(px1, -12, 0, lo.L, 0, lo.H)),
        ("ENDB", "end wall B, built out 30 mm over the concealed WC cistern (stud wall inside the cargo doors)",
         Box(lo.wall_b, 0, 0, lo.wall_b + 12, cy0, lo.H)),
        ("PART", "partition, bath face", Box(px1 - 12, 0, 0, px1, cy0, lo.H)),
        ("CROSS", "cross wall, bath face", Box(px1, cy0 - 12, 0, lo.L, cy0, lo.H)),
        ("BASIN", "splashback behind the basin (end wall B, wash lobby)", Box(lo.L, cy1, 0, lo.L + 12, lo.W, lo.H)),
    ):
        area = round(max(b.size[0], b.size[1]) * lo.H / 1e6, 2)
        k.buy(Bought(f"K2-CB-{wid}", f"Cement board 12 mm + liquid membrane, {nm}", "K2", "wet walls", "tiling",
                     area, "m2", "cementboard", b, step="S08", layer="envelope", color="tile"))
        k.buy(Bought(f"K2-TILE-{wid}", f"Wall tiles + adhesive + grout, {nm}", "K2", "wet walls", "tiling",
                     round(area * 1.1, 2), "m2", "tile"))
    wet_area = (lo.L - px1) * lo.W / 1e6
    k.buy(Bought("K2-VINYL", "Safety vinyl sheet, coved 100 mm up the walls (bathroom and wash lobby)", "K2",
                 "finishes", "tiling", round(wet_area * 1.25, 1), "m2", "vinyl", Box(px1, 0, -5, lo.L, lo.W, 0),
                 step="S08", layer="envelope", color="floor"))
    tx0, tx1, ty0, ty1 = lo.tray
    k.buy(Bought("K2-TRAY", f"Shower tray {tx1 - tx0:.0f} x {ty1 - ty0:.0f}, low profile, 90 mm waste", "K2",
                 "sanitaryware", "plumbing", 1, "each", "tray", Box(tx0, ty0, 0, tx1, ty1, 45), step="S09",
                 color="white"))
    k.buy(Bought("K2-LEDGE", "Tiled ledge (block and tile)", "K2", "wet walls", "tiling", 1, "each", "",
                 Box(px1, 0, 0, tx0, ty1, 1100), step="S09", color="tile"))
    k.buy(Bought("K2-SCREEN", "Fixed glass shower screen 700 x 2,000, 8 mm toughened", "K2", "sanitaryware",
                 "plumbing", 1, "each", "screen", Box(tx1 - 700, ty1 - 8, 45, tx1, ty1, 2045), step="S09",
                 color="glass"))
    cy = lo.wc_cy
    # wall-hung WC: the pan hangs straight off the finished end wall; the cistern is hidden in the wall
    k.buy(Bought("K2-WC", f"Wall-hung WC, short projection ({WC_PAN:.0f}), soft-close seat", "K2", "sanitaryware",
                 "plumbing", 1, "each", "wc", Box(lo.wall_b - WC_PAN, cy - 190, 200, lo.wall_b, cy + 190, 420),
                 step="S10", color="white"))
    k.buy(Bought("K2-FRAME", "Slim concealed cistern frame (80 mm) with dual-flush plate, in the end-B stud wall and "
                 "its 30 mm build-out", "K2", "sanitaryware", "plumbing", 1, "set", "wcframe",
                 Box(lo.wall_b + 12, cy - 250, 0, lo.L + 50, cy + 250, 1120), step="S06", layer="envelope",
                 color="steel"))
    bx0, bx1, by0, by1 = lo.basin
    k.buy(Bought("K2-BASIN", "Wall basin 400 x 300 + mixer + bottle trap (wash lobby)", "K2", "sanitaryware",
                 "plumbing", 1, "each", "basin", Box(bx0, by0, 700, bx1, by1, 850), step="S10", color="white"))
    # mirror cabinet over the basin, no wider than it, so the sliding door can park beside it
    for nm, b in (("Mirror cabinet side 1", Box(lo.L - 120, by0, 1250, lo.L - 12, by0 + 18, 1900)),
                  ("Mirror cabinet side 2", Box(lo.L - 120, by1 - 18, 1250, lo.L - 12, by1, 1900)),
                  ("Mirror cabinet top", Box(lo.L - 120, by0 + 18, 1882, lo.L - 12, by1 - 18, 1900)),
                  ("Mirror cabinet bottom", Box(lo.L - 120, by0 + 18, 1250, lo.L - 12, by1 - 18, 1268)),
                  ("Mirror cabinet shelf", Box(lo.L - 110, by0 + 19, 1560, lo.L - 12, by1 - 19, 1578)),
                  ("Mirror cabinet door", Box(lo.L - 138, by0, 1250, lo.L - 120, by1, 1900))):
        part(nm, b, step="S10", edges="L2S2", ex=(-250, 0, 0))
    k.buy(Bought("K2-MIRROR", "Mirror 4 mm bonded to the cabinet door", "K2", "glazing", "carpentry", 1, "each",
                 "mirror", step="S10"))
    k.buy(Bought("K2-ACC", "Towel rail, robe hook, toilet-roll holder, shower shelf", "K2", "accessories",
                 "carpentry", 1, "set", "bathacc", step="S10"))
    k.keepouts += [
        KeepOut("KO-WC", Box(lo.L - WC_D - 600, cy - 400, 0, lo.L - WC_D, cy + 400, 1200), "WC front clearance 600",
                "K2-WC"),
        KeepOut("KO-SHOWER", Box(tx0 - 10, ty1, 0, tx1 - 700, ty1 + 600, 1800), "Shower entry 600", "K2-TRAY"),
        KeepOut("KO-BASIN", Box(bx0 - 600, by0, 0, bx0, by1, 1500), "Standing space at the basin", "K2-BASIN"),
        KeepOut("KO-BDOOR", Box(d0 + T18, cy0 - (d1 - d0), 0, d1, cy0, 2000),
                "Door swing into the bathroom (hinged by the partition)", "K2-DOOR"),
    ]
    k.steps += [
        Step("S06", "K2", "Stand the partition and cross-wall frames and fix the skins",
             [p.id for p in k.parts if p.step == "S06"], {"F": 40}, 2),
        Step("S07", "K2", "Fit the door frame and hang the bathroom door",
             [p.id for p in k.parts if p.step == "S07"], {"F": 16}, 2),
        Step("S08", "K2", "Cement board, membrane and tiles on the wet walls; coved vinyl floor", [], {}, 2),
        Step("S09", "K2", "Set the shower tray, ledge and fixed screen", [], {}, 2),
        Step("S10", "K2", "Hang the WC and the water heater above it, and the basin and mirror cabinet in the wash lobby",
             [p.id for p in k.parts if p.step == "S10"], {"F": 12}, 1),
    ]
    return k


# ------------------------------------------------------------------------------- K3 kitchen
def k3_kitchen(lo: Layout) -> Kit:
    """The galley on the bathroom partition: fridge bay, hob base and sink base from the back wall,
    an overhead cabinet for storage, and a hood under it. Drawn as a back-wall run
    (x along the galley, y from the partition), then turned into place."""
    k = Kit("K3", "Kitchen", "carpentry", "workshop")
    D = GALLEY_D
    hb = 900 - 38 - LEG  # carcass height under a 38 mm worktop
    f0, f1 = lo.fridge
    run = lo.sink[1]
    # fridge bay: one side + rails carrying the worktop, open front and bottom; the back wall closes it
    k.add(Part("K3-01", "Fridge bay side", "K3", "PLY18", Box(f1 - T18, 12, LEG, f1, D, LEG + hb), step="S11",
               edges="L1", explode=(150, 0, 0)))
    k.add(Part("K3-02", "Fridge bay top rail", "K3", "PLY18", Box(f0, D - 100, LEG + hb - T18, f1 - T18, D,
                                                                 LEG + hb), step="S11", edges="L1"))
    k.add(Part("K3-03", "Fridge bay back rail", "K3", "PLY18", Box(f0, 12, LEG + hb - T18, f1 - T18, 112,
                                                                  LEG + hb), step="S11"))
    carcass(k, "K3-H", "Hob base", *lo.hob, 0, D, LEG, hb, step="S11", drawers=2)
    sink = carcass(k, "K3-S", "Sink base", *lo.sink, 0, D, LEG, hb, step="S11", doors=1)
    back = next(p for p in sink if p.name.endswith("back"))
    back.ops.append(Op("cutout", "A", 100, 150, w=(lo.sink[1] - lo.sink[0]) - 200, h=250, joint="service"))
    oz = 1800.0
    carcass(k, "K3-T", "Overhead cabinet", 0, run, 0, 500, oz, 500, step="S12", doors=2, top="top", legs=False)
    # worktop over the whole run, with sink and hob cut-outs
    wt = Part("K3-WT", "Worktop 38 mm", "K3", "WTOP38", Box(0, 0, LEG + hb, run, WORKTOP_D, 900), step="S13",
              edges="L1", explode=(0, 0, 300))
    wt.ops += [
        Op("cutout", "B", lo.sink[0] + 50, 70, w=(lo.sink[1] - lo.sink[0]) - 100, h=380, joint="sink"),
        Op("cutout", "B", lo.hob[0] + 20, 185, w=560, h=320, joint="hob"),
    ]
    k.add(wt)
    k.add(Part("K3-HS", "Hood shelf", "K3", "PLY18", Box(lo.hob[0], 0, 1650, lo.hob[1], 480, 1668), step="S14",
               edges="L1"))
    k.add(Part("K3-PL", "Plinth", "K3", "PLY18", Box(lo.hob[0], 560, 0, run, 578, LEG - 2), step="S13", edges="L1"))
    # a wide black-glass hob after the founder's photo: two zones side by side, knobs at the front left
    k.buy(Bought("K3-HOB", "Two-zone induction hob, zones side by side, black glass 590 x 350, front knobs, about 3.5 kW",
                 "K3", "appliances", "electrical", 1, "each", "hob",
                 Box(lo.hob[0] + 5, 170, 900, lo.hob[1] - 5, 520, 960), step="S13", color="black"))
    k.buy(Bought("K3-SINK", "Inset stainless sink about 380 x 420, single bowl", "K3", "sanitaryware", "plumbing", 1,
                 "each", "sink", Box(lo.sink[0] + 35, 50, 720, lo.sink[1] - 35, 470, 905), step="S13",
                 color="stainless"))
    k.buy(Bought("K3-TAP", "Kitchen mixer tap", "K3", "sanitaryware", "plumbing", 1, "each", "tap", step="S13"))
    k.buy(Bought("K3-FRIDGE", "Under-counter fridge about 90 L (A-class)", "K3", "appliances", "electrical", 1,
                 "each", "fridge", Box(f0 + 10, 40, 0, f1 - 30, 590, 850), step="S13", color="white"))
    k.buy(Bought("K3-HOOD", "Slim recirculating hood 600 mm, black, charcoal filter", "K3", "appliances", "electrical",
                 1, "each", "hood", Box(lo.hob[0], 0, 1550, lo.hob[1], 480, 1650), step="S14", color="black"))
    k.buy(Bought("K3-FILTER", "Under-sink drinking-water filter + faucet", "K3", "plumbing", "plumbing", 1, "each",
                 "filter", step="S13"))
    turn(k, lo.part_x0)
    k.keepouts.append(KeepOut("KO-KITCHEN", Box(lo.part_x0 - WORKTOP_D - AISLE_MIN, 0, 0, lo.part_x0 - WORKTOP_D, run,
                                                1800), f"Galley aisle {AISLE_MIN:.0f} (worktop to the sofa)", "K3"))
    k.steps += [
        Step("S11", "K3", "Lay the oak planks over the living area (end A to the partition); then assemble the fridge bay, "
             "hob base and sink base on their legs along the partition",
             [p.id for p in k.parts if p.step == "S11"], {}, 2),
        Step("S12", "K3", "Assemble the overhead cabinet and hang it on the steel rail",
             [p.id for p in k.parts if p.step == "S12"], {}, 2, "Lift the cabinet up: two people."),
        Step("S13", "K3", "Scribe and fix the worktop; drop in the sink and hob; plinth",
             [p.id for p in k.parts if p.step == "S13"], {"F": 12}, 2),
        Step("S14", "K3", "Fix the hood shelf under the overhead cabinet and hang the hood",
             [p.id for p in k.parts if p.step == "S14"], {"F": 8}, 2),
    ]
    return k


# ------------------------------------------------------------------------------- K4 bed
SLAT_W, SLAT_GAP = 90.0, 10.0  # deck slat width and the target gap between slats
def k4_bed(lo: Layout) -> Kit:
    """MALM-style bed straight on the back wall and end A: a tall headboard panel, high sides, a
    fixed ventilated deck, and two storage boxes on castors that pull out on the room side."""
    k = Kit("K4", "Bed", "carpentry", "workshop")
    X1, Y0, Y1, ZT = lo.bed_x1, lo.bed_y0, lo.bed_y1, 450.0
    n = 0

    def part(name, box, ops=None, edges="", ex=(0, 0, 0), mat="PLY18") -> Part:
        nonlocal n
        n += 1
        return k.add(Part(f"K4-{n:02d}", name, "K4", mat, box, step="S15", edges=edges, ops=ops or [], explode=ex))

    def bolts(h: float) -> list[Op]:  # two bolts up a rail's end, or one on its centreline when it is low
        vs = [80.0, h - 120] if h >= 300 else [h / 2]
        return [Op("drill", "A", 40, v, 10, 18, joint="bolt") for v in vs]

    part("Headboard (full height, on the back wall)", Box(0, 0, 0, X1, Y0, 1000),
         [Op("cutout", "B", 200, 750, w=68, h=68, joint="usb")], "L1", ex=(0, -150, 0))
    part("Rail, end-A side", Box(0, Y0, 0, T18, Y1, ZT - T18), bolts(ZT - T18), ex=(-200, 0, 0))
    part("Rail, room side (top)", Box(X1 - T18, Y0, ZT - T18 - 80, X1, Y1, ZT - T18), bolts(80), "L1",
         ex=(250, 0, 0))
    part("Rail, room side (plinth)", Box(X1 - T18, Y0, 0, X1, Y1, 60), bolts(60), "L1", ex=(250, 0, 0))
    part("Rail, head", Box(T18, Y0, 0, X1 - T18, Y0 + T18, ZT - T18), bolts(ZT - T18), ex=(0, -200, 0))
    part("Rail, foot", Box(T18, Y1 - T18, 0, X1 - T18, Y1, ZT - T18), bolts(ZT - T18), "L1", ex=(0, 200, 0))
    part("Spine", Box(922, Y0 + T18, 0, 940, Y1 - T18, ZT - T18), ex=(0, 0, 150))
    # the deck: wooden slats laid across the bed, side rail to side rail over the spine, with a fine
    # even gap between them for air (the founder's call, replacing two drilled panels)
    # each slat rests on a ledger inside each side rail and on the spine, two screws at each
    part("Slat ledger, end-A side", Box(T18, Y0 + T18, ZT - T18 - 60, 2 * T18, Y1 - T18, ZT - T18), ex=(-120, 0, 0))
    part("Slat ledger, room side", Box(X1 - 2 * T18, Y0 + T18, ZT - T18 - 60, X1 - T18, Y1 - T18, ZT - T18),
         ex=(120, 0, 0))
    n_slats = int((Y1 - Y0 + SLAT_GAP) // (SLAT_W + SLAT_GAP))
    gap = (Y1 - Y0 - n_slats * SLAT_W) / (n_slats - 1)
    for i in range(n_slats):
        y = Y0 + i * (SLAT_W + gap)
        part(f"Deck slat {i + 1}", Box(T18, y, ZT - T18, X1 - T18, y + SLAT_W, ZT), edges="L2", ex=(0, 0, 300))
    (da0, _), (_, db1) = lo.drawers
    part("Side panel, head end", Box(X1 - T18, Y0 + T18, 60, X1, da0, ZT - T18 - 80), [], "L2S2", ex=(300, 0, 0))
    part("Drawer divider", Box(940, lo.drawers[0][1], 0, X1 - T18, lo.drawers[1][0], ZT - T18 - 80),
         ex=(0, 0, 150))
    x0 = X1 - T18 - 600
    for i, (ya, yb) in enumerate(lo.drawers):
        part(f"Storage box {i + 1} front", Box(X1 - T18, ya + 2, 62, X1, yb - 2, ZT - T18 - 82), [], "L2S2",
             ex=(500, 0, 0))
        for nm, b in (("side 1", Box(x0, ya + 10, 70, X1 - T18, ya + 22, 300)),
                      ("side 2", Box(x0, yb - 22, 70, X1 - T18, yb - 10, 300)),
                      ("back", Box(x0, ya + 22, 70, x0 + 12, yb - 22, 300)),
                      ("bottom", Box(x0 + 12, ya + 22, 70, X1 - T18, yb - 22, 82))):
            part(f"Storage box {i + 1} {nm}", b, ex=(500, 0, 0), mat="PLY12")
    k.buy(Bought("K4-MATT", "Mattress up to 1,600 x 2,000 (local size, e.g. 5 x 6 ft), 200 mm", "K4", "bedding",
                 "furnishing", 1, "each", "mattress", Box(20, Y0 + 28, ZT, X1 - 20, Y1 - 10, ZT + 200), step="S15",
                 color="fabric"))
    k.keepouts.append(KeepOut("KO-DRAWERS", Box(X1, da0, 0, X1 + 620, db1, 450), "Storage boxes pull out 600", "K4"))
    k.steps.append(Step("S15", "K4", "Fix the headboard to the back wall; bolt the frame; screw down the slats; slide in "
                        "the storage boxes", [p.id for p in k.parts], {"C": 20, "K": 8, "F": 6 * n_slats + 20}, 2))
    return k


# ------------------------------------------------------------------------------- K5 bedside table
def k5_bedside(lo: Layout) -> Kit:
    """A LACK-style bedside table beside the bed head (thick top, thick legs, a lower shelf) with a
    reading lamp; replaces the storage wall over the bed. Hooks and a luggage rack take the clothes
    the storage boxes do not."""
    k = Kit("K5", "Bedside table and lamp", "carpentry", "workshop")
    x0, x1, d = lo.bedside
    top, leg = 550.0, 36.0
    k.add(Part("K5-01", "Table top", "K5", "PLY18", Box(x0, 0, top - T18, x1, d, top), step="S16", edges="L2S2",
               explode=(0, 0, 200)))
    n = 1
    for lx in (x0, x1 - leg):
        for ly in (0.0, d - leg):
            for half in (0, 1):  # each leg is two 18 mm strips glued face to face
                n += 1
                k.add(Part(f"K5-{n:02d}", "Leg strip (two make a 36 x 36 leg)", "K5", "PLY18",
                           Box(lx + half * T18, ly, 0, lx + (half + 1) * T18, ly + leg, top - T18), step="S16",
                           edges="L1"))
    k.add(Part("K5-10", "Lower shelf", "K5", "PLY18", Box(x0 + leg, leg, 180, x1 - leg, d - leg, 198), step="S16",
               edges="L1"))
    k.buy(Bought("K5-LAMP", "Table lamp, linen drum shade, LED E27 (reading lamp)", "K5", "furnishing", "furnishing",
                 1, "each", "lamp", Box(x0 + 70, 70, top, x1 - 70, d - 70, top + 420), step="S16", color="fabric"))
    k.buy(Bought("K5-HOOKS", "Coat hooks, hanging rail by the door and a folding luggage rack", "K5", "hardware",
                 "carpentry", 1, "set", "rail", step="S16"))
    k.steps.append(Step("S16", "K5", "Glue the leg strips; screw the top and the shelf; set the table by the bed head",
                        [p.id for p in k.parts], {"F": 16}, 1))
    return k


# ------------------------------------------------------------------------------- K6 living
def k6_living(lo: Layout) -> Kit:
    k = Kit("K6", "Seating: sofa, table and chairs", "carpentry", "workshop")
    sx0, sx1 = lo.sofa
    k.buy(Bought("K6-SOFA", f"Low two-seat sofa about {sx1 - sx0:.0f} x {SOFA_D:.0f}, {SOFA_H:.0f} high, soft dark grey "
                 "washable covers", "K6", "furnishing", "furnishing", 1, "each", "sofa", Box(sx0, 0, 0, sx1, SOFA_D, SOFA_H),
                 step="S17", layer="furniture",
                 color="fabric"))
    # seating room: a table in front of the sofa and two chairs facing it from the glass side,
    # all flat-pack ply on cross-halving legs; the chairs have a back panel
    tw, td, th = float(TABLE_W), float(TABLE_D), float(TABLE_H)
    tx0, ty0 = lo.seat_cx - tw / 2, SOFA_D + 100
    k.add(Part("K6-01", f"Table top {tw:.0f} x {td:.0f}", "K6", "PLY18", Box(tx0, ty0, th - T18, tx0 + tw, ty0 + td, th),
               step="S17", edges="L2S2", explode=(0, 0, 200)))
    k.add(Part("K6-02", "Table leg A (cross-halving slot)", "K6", "PLY18",
               Box(tx0 + 60, ty0 + td / 2 - 9, 0, tx0 + tw - 60, ty0 + td / 2 + 9, th - T18), step="S17", edges="L2S2"))
    k.add(Part("K6-03", "Table leg B (cross-halving slot)", "K6", "PLY18",
               Box(tx0 + tw / 2 - 9, ty0 + 50, 0, tx0 + tw / 2 + 9, ty0 + td - 50, th - T18), step="S17", edges="L2S2"))
    cy0, cw, seat = ty0 + td + 70, float(CHAIR_W), 400.0
    for i, cx in enumerate((lo.seat_cx - CHAIR_GAP / 2 - cw, lo.seat_cx + CHAIR_GAP / 2)):
        n = 4 + 4 * i
        k.add(Part(f"K6-{n:02d}", f"Chair {i + 1} seat", "K6", "PLY18", Box(cx, cy0, seat - T18, cx + cw, cy0 + cw, seat),
                   step="S17", edges="L2S2"))
        k.add(Part(f"K6-{n + 1:02d}", f"Chair {i + 1} leg A", "K6", "PLY18",
                   Box(cx + 20, cy0 + cw / 2 - 9, 0, cx + cw - 20, cy0 + cw / 2 + 9, seat - T18), step="S17", edges="L2S2"))
        k.add(Part(f"K6-{n + 2:02d}", f"Chair {i + 1} leg B", "K6", "PLY18",
                   Box(cx + cw / 2 - 9, cy0 + 20, 0, cx + cw / 2 + 9, cy0 + cw - 38, seat - T18), step="S17", edges="L2S2"))
        k.add(Part(f"K6-{n + 3:02d}", f"Chair {i + 1} back", "K6", "PLY18",
                   Box(cx, cy0 + cw - 18, 0, cx + cw, cy0 + cw, 800), step="S17", edges="L2S2"))
    k.buy(Bought("K6-CURT", "Blackout curtain + track for the 3 m slider", "K6", "furnishing", "furnishing", 1,
                 "set", "curtain", step="S17"))
    k.buy(Bought("K6-MESH", "Insect screens: slider (sliding), W1, vents", "K6", "glazing", "glazier", 1, "set",
                 "mesh", step="S18"))
    k.steps.append(Step("S17", "K6", "Place the sofa; slot together the table and the two chairs",
                        [p.id for p in k.parts], {}, 1))
    return k


# ------------------------------------------------------------------------------- K7 trims
def k7_trims(lo: Layout) -> Kit:
    k = Kit("K7", "Trims and scribes", "carpentry", "workshop")
    k.add(Part("K7-03", "Skirting, front strip", "K7", "PLY12", Box(0, lo.W - 12, 0, lo.o1[0] - 12, lo.W, 70),
               step="S18", edges="L1"))
    for i, (a, b) in enumerate(split(lo.o1[0], lo.o1[1], 2400)):
        k.add(Part(f"K7-{4 if i == 0 else 19:02d}", "Slider head reveal", "K7", "PLY12",
                   Box(a, lo.W - 40, lo.o1_head - 12, b, lo.W, lo.o1_head), step="S18", edges="L1"))
    for i, x in enumerate((lo.o1[0] - 12, lo.o1[1])):
        k.add(Part(f"K7-{5 + i:02d}", "Slider jamb reveal", "K7", "PLY12",
                   Box(x, lo.W - 40, 0, x + 12, lo.W, lo.o1_head), step="S18", edges="L1"))
    X, run = lo.part_x0, lo.sink[1]
    k.add(Part("K7-07", "Ceiling scribe strip over the overhead cabinet", "K7", "PLY12",
               Box(X - 530, 0, 2300, X - 518, run, lo.H), step="S18"))
    k.add(Part("K7-20", "Galley end panel (scribed to the floor on site)", "K7", "PLY12",
               Box(X - GALLEY_D, run, 0, X, run + 12, 900 - 38), step="S18"))
    k.buy(Bought("K7-STAIN", "Joinery finish: medium-oak stain + clear matte PU varnish over pine (all furniture)", "K7",
                 "finishes", "painting", 6, "L", "stain", step="S18"))
    k.steps.append(Step("S18", "K7", "Scribe and pin the trims; caulk and paint", [p.id for p in k.parts],
                        {"F": 60}, 1))
    return k


# ------------------------------------------------------------------------------- K10 steel and glazing
def k10_steel(lo: Layout) -> Kit:
    k = Kit("K10", "Steel and glazing", "welding + glazier", "steel workshop + site")
    e = P.LINING_WALL.value
    k.buy(Bought("K10-W1INF", "W1 infill: 2 mm steel welded into the old door frame (0-1,150), foamed with the walls",
                 "K10", "steel", "welding", 1, "each", "w1infill",
                 Box(lo.o2[0], lo.W, 0, lo.o2[1], lo.W + e, lo.w1_sill), step="S01", layer="envelope", color="steel"))
    k.buy(Bought("K10-W1WIN", "W1 obscure louvre window 520 x 890 + insect mesh (wash lobby)", "K10", "glazing",
                 "glazier", 1, "each", "louvre", Box(lo.o2[0], lo.W, lo.w1_sill, lo.o2[1], lo.W + e, lo.w1_head),
                 step="S01", color="glass"))
    k.buy(Bought("K10-ENDB", "Seal and lock the end-B cargo doors (weld tabs, sealant)", "K10", "steel", "welding",
                 1, "each", "endbdoors", step="S01"))
    k.buy(Bought("K10-PADS", "Level the corner castings: concrete pads or steel shims (rock corner)", "K10", "steel",
                 "masonry", 4, "each", "pad", step="S01"))
    k.buy(Bought("K10-RAIL", "Steel hanging rail for the wall units", "K10", "steel", "welding", 1,
                 "set", "hangrail", step="S12"))
    k.buy(Bought("K10-LOCK", "Keyed lock + secondary bolt for the slider", "K10", "hardware", "glazier", 1, "set",
                 "lock", step="S01"))
    k.buy(Bought("K10-VENT", "Louvred trickle-vent strip with mesh (10,000 mm2)", "K10", "glazing", "glazier", 1,
                 "each", "vent", step="S01"))
    k.buy(Bought("K10-AC", "AC wall sleeve 75 mm (provision, back wall, one hole)", "K10", "steel", "welding", 1,
                 "each", "sleeve", step="S01"))
    k.steps.append(Step("S01", "K10", "Survey and level the supports; all hot work now: convert the old door to W1, "
                        "seal end B, cut the AC sleeve", [], {}, 2,
                        "Survey sheet first: nothing is cut before study/studio/survey.csv is complete. "
                        "No welding or grinding on the shell after the spray foam (S05)."))
    return k


# ------------------------------------------------------------------------------- K11 roof terrace
def roof_frame(lo: Layout) -> dict[str, float]:
    """K11's set-out, shared with the outdoor electrical points (services.py): the deck beam lines, the roof
    deck, the veranda canopy over the front deck and the dog-leg stair at end A."""
    e = P.LINING_WALL.value
    top = -P.LINING_FLOOR.value - 170 + P.EXT_H.value  # container top
    deck_top = top + 150 + 25  # beams, then the boards
    risers = round(deck_top / 175)
    return {"xa": -e - 80, "xb": lo.L + e + 80, "ya": -e - 43, "yb": lo.W + e + 43, "top": top,
            "deck_top": deck_top, "gz": deck_top + 1100, "vz": top - 300, "fw": P.FRONT_DECK_WIDTH.value,
            "sx0": -e - 80 - 1800, "risers": risers, "r": deck_top / risers}


def k11_roof(lo: Layout) -> Kit:
    """Roof terrace on the corner castings, open guardrail, canopy over the front deck, dog-leg stair, chairs."""
    k = Kit("K11", "Roof terrace, deck canopy and stair", "welding + carpentry", "steel workshop + site")
    fr = roof_frame(lo)
    xa, xb, ya, yb, top = fr["xa"], fr["xb"], fr["ya"], fr["yb"], fr["top"]
    n = 0

    def member(name: str, box: Box, mat: str = "STEEL", step: str = "S20", ex=(0, 0, 0)) -> Part:
        nonlocal n
        n += 1
        return k.add(Part(f"K11-{n:02d}", name, "K11", mat, box, step=step, layer="roof", sheet=False, explode=ex))

    # deck: two longitudinal RHS 150x100x5 on the castings, joists RHS 80x40x3 at 600, boards
    for i, (y0, y1) in enumerate(((ya, ya + 100), (yb - 100, yb))):
        member(f"Beam RHS 150x100x5, side {i + 1}", Box(xa, y0, top, xb, y1, top + 150), ex=(0, 0, 400))
    x = xa + 100
    while x < xb - 100:
        member("Joist RHS 80x40x3", Box(x, ya + 100, top + 70, x + 40, yb - 100, top + 150), ex=(0, 0, 500))
        x += 600
    dz = top + 150
    y = ya
    while y < yb - 1:
        member("Deck board 140 x 25 hardwood (treated)", Box(xa, y, dz, xb, min(y + 140, yb), dz + 25), "TIMBER",
               "S21", ex=(0, 0, 700))
        y += 146
    deck_top = dz + 25
    # open guardrail 1,100 high: steel posts at 1.5 m or less, hardwood top rail, stainless cables
    # at 90 mm (gaps under 100); no canopy over the roof (D-020)
    gz = fr["gz"]
    for side, (x0, y0, x1, y1) in enumerate(((xa, ya, xb, ya + 50), (xa, yb - 50, xb, yb), (xa, ya, xa + 50, yb),
                                             (xb - 50, ya, xb, yb))):
        along = 0 if side < 2 else 1
        length = (x1 - x0) if along == 0 else (y1 - y0)
        n_posts = int(-(-length // 1500)) + 1
        for j in range(n_posts):
            if side >= 2 and j in (0, n_posts - 1):
                continue  # corners already have a post from the long sides
            t = min(j * length / (n_posts - 1), length - 50)
            px, py = (x0 + t, y0) if along == 0 else (x0, y0 + t)
            member("Guardrail post SHS 50x50x3", Box(px, py, deck_top, px + 50, py + 50, gz - 40), step="S22",
                   ex=(0, 0, 900))
        member("Guardrail top rail, hardwood 140 x 40", Box(x0, y0, gz - 40, x1, y1, gz), "TIMBER", "S23",
               ex=(0, 0, 1000))
        member("Guardrail cable infill, 4 mm stainless at 90 mm (10 runs)", Box(x0, y0 + 22, deck_top + 100, x1, y0 + 28,
                                                                                gz - 60) if along == 0 else
               Box(x0 + 22, y0, deck_top + 100, x0 + 28, y1, gz - 60), "CABLE", "S23", ex=(0, 0, 900))
    # lower veranda canopy over the front deck, on its own posts (never on the slider head)
    dk = P.DECK_HEIGHT.value
    vz, fw = fr["vz"], fr["fw"]
    for px in (xa, (xa + xb) / 2 - 40, xb - 80):
        member("Veranda post SHS 60x60x3 on the deck frame", Box(px, yb + fw - 60, -dk - 0 + dk - 10, px + 60, yb + fw,
                                                               vz - 100), step="S24", ex=(0, 300, 0))
    member("Veranda ledger on its own posts", Box(xa, yb + 20, vz - 60, xb, yb + 80, vz), step="S24", ex=(0, 300, 0))
    member("Veranda polycarbonate 10 mm tinted (falls outward)", Box(xa, yb, vz - 100, xb, yb + fw + 200, vz), "POLY",
           "S24", ex=(0, 400, 0))
    # dog-leg stair at end A: front deck (container floor level) to the roof deck
    rise = deck_top - 0.0
    risers = round(rise / 175)
    r = rise / risers
    half = risers // 2
    sx0 = fr["sx0"]
    for f, (yy0, rng) in enumerate(((yb + fw - 900, range(half)), (yb + fw - 1800, range(half, risers)))):
        for i in rng:
            j = i if f == 0 else i - half
            xt = sx0 + 1750 - 250 * (j + 1) if f == 0 else sx0 + 250 * j
            member(f"Stair tread {i + 1} (chequer plate on angles)", Box(xt, yy0, r * (i + 1) - 40, xt + 250,
                                                                         yy0 + 850, r * (i + 1)), step="S25",
                   ex=(-600, 0, 0))
    member("Stair landing 1,750 x 850", Box(sx0 - 0, yb + fw - 1800, r * half - 40, sx0 + 250, yb + fw, r * half),
           step="S25", ex=(-600, 0, 0))
    member("Stair stringers and handrails (set)", Box(sx0, yb + fw - 1800, 0, sx0 + 1750, yb + fw, rise + 900),
           "STAIRFRAME", "S25", ex=(-600, 0, 0))
    # chairs (slatted, bolted) and side table
    for i, cx in enumerate((1200.0, 2400.0)):
        member(f"Lounge chair {i + 1} (slatted hardwood, bolted)", Box(cx, 400, deck_top, cx + 650, 1150, deck_top + 800),
               "TIMBER", "S26", ex=(0, 0, 1500))
    member("Side table 500 x 500", Box(1950, 500, deck_top, 2350, 900, deck_top + 450), "TIMBER", "S26",
           ex=(0, 0, 1500))
    k.buy(Bought("K11-GUTTER", "Gutter + downpipe to the rainwater tank (deck canopy)", "K11", "roofing",
                 "welding", 1, "set", "gutter", step="S24"))
    k.buy(Bought("K11-BOND", "Bonding: 16 mm2 green-yellow from the frame to the earth bar", "K11", "electrical",
                 "electrical", 1, "set", "bonding", step="S27"))
    for st, t in (("S20", "Lift and bolt the deck beams onto the corner castings; joists"),
                  ("S21", "Screw down the deck boards (5 mm gaps)"),
                  ("S22", "Bolt the guardrail posts to the deck beams"),
                  ("S23", "Fix the hardwood top rail; thread and tension the stainless cables"),
                  ("S24", "Veranda posts, ledger, polycarbonate and gutter over the front deck"),
                  ("S25", "Set the stair footings; bolt the two flights and the landing"),
                  ("S26", "Place the chairs and the side table"),
                  ("S27", "Bond the steelwork to earth; engineer's inspection before guest use")):
        k.steps.append(Step(st, "K11", t, [p.id for p in k.parts if p.step == st], {}, 3 if st in ("S20", "S24") else 2))
    return k


def all_kits(lo: Layout) -> list[Kit]:
    return [shell(lo), k1_lining(lo), k2_bath(lo), k3_kitchen(lo), k4_bed(lo), k5_bedside(lo), k6_living(lo),
            k7_trims(lo), k10_steel(lo), k11_roof(lo)]
