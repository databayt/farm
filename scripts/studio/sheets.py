"""Every drawing sheet in the set, as functions of the model dict from build.model()."""
from __future__ import annotations

import params as P
from draw import (FILL, SYS, Sheet, iso, iso_draw, ortho, project_box, sym_box, sym_breaker, sym_earth, sym_lamp, sym_socket,
                  sym_switch)
from model import Box

KIT_NAMES = {"K1": "Insulation and lining", "K2": "Bathroom", "K3": "Kitchen", "K4": "Bed", "K5": "Storage wall",
             "K6": "Sofa, table and chairs", "K7": "Trims", "K8": "Electrical", "K9": "Plumbing",
             "K10": "Steel and glazing", "K11": "Roof terrace"}


def items(m, kits=None, layers=None, exclude_layers=("roof",), boxes_only=True):
    out = []
    for k in m["kits"]:
        if kits and k.id not in kits:
            continue
        for p in k.parts:
            if (layers and p.layer not in layers) or p.layer in exclude_layers:
                continue
            out.append((p.box, FILL.get(p.material, "#eee"), p.name, p.id, k.id, p.layer))
        for b in k.bought:
            if b.box is None or (layers and b.layer not in layers) or b.layer in exclude_layers:
                continue
            out.append((b.box, FILL.get(b.color, "#eee"), b.name, b.id, k.id, b.layer))
    return out


def tri(it):
    return [(b, fl, nm) for (b, fl, nm, *_r) in it]


# ------------------------------------------------------------------------------- A sheets
def a001_cover(m, index: list[tuple[str, str]]) -> Sheet:
    lo, s = m["lo"], Sheet("A-001", "Cover and drawing index")
    s.text(20, 32, "Container studios: three identical farm-stay guest units", 7, weight="bold")
    s.text(20, 41, "IKEA-style flat-pack fit-out of standard 20 ft containers · materials and fabrication in Kigali", 3.4)
    y = s.note(20, 54, [
        f"Net interior {lo.L:.0f} x {lo.W:.0f} x {lo.H:.0f} mm ({lo.L * lo.W / 1e6:.1f} m2) · Layout B (D-020)",
        f"Bed up to 1,600 x 2,000 with a storage wall · seating room: sofa, table, two chairs",
        f"Galley {lo.sink[1]:.0f} mm on the bathroom wall: fridge, induction, sink; 80 L heater overhead",
        f"Bathroom {lo.L - lo.bath_x0:.0f} x {lo.W:.0f} mm · shower tray {lo.tray[1] - lo.tray[0]:.0f} x 900",
        f"Max demand about {m['md']['total_A']:.0f} A per unit (heater/hob priority relay) · feeder {m['feeder']['size_mm2']:.0f} mm2",
        f"Shared septic {m['site']['septic_m3']:.1f} m3, 2 chambers 2:1 · storage tank {m['site']['tank_m3']:.1f} m3",
        "Roof terrace on the corner castings, open guardrail · tinted polycarbonate canopy over the front deck",
        "",
        f"Status: {P.STATUS}. Opening positions are photo estimates (+/-150 mm, AS-14).",
        "Nothing is cut until study/studio/survey.csv is complete and the set is re-issued.",
        "Structural items (roof terrace, deck canopy, stair) need an engineer's sign-off before guest use.",
        "Electrical ratings are design intent until a RURA class A electrician designs and certifies.",
    ], 3.0)
    rows = [[n, t] for n, t in index]
    half = (len(rows) + 1) // 2
    s.table(230, 28, [("No.", 22), ("Title", 150)][:2], rows[:half], 1.9, 3.4)
    s.table(20, max(y + 6, 120), [("No.", 22), ("Title", 150)], rows[half:], 1.9, 3.4)
    return s


def a101_existing(m) -> Sheet:
    lo, s = m["lo"], Sheet("A-101", "Existing condition (photo-scaled)", "1:30")
    sc = 30
    sh = items(m, kits=["K0"], layers=["shell"], exclude_layers=())
    ortho(s, "plan", [(b, fl, n) for (b, fl, n, i, *_x) in sh if i not in ("K0-ROOF", "K0-FLOOR")], 40, 40, sc)
    s.text(40, 34, "PLAN (roof removed)", 3, weight="bold")
    oy = 175
    ortho(s, "front_out", [(b, fl, n) for (b, fl, n, i, *_x) in sh if i.startswith("K0-FRONT") or i == "K0-SLIDER"],
          40, oy, sc, origin=(-130, -2420))
    s.text(40, oy - 6, "FRONT ELEVATION (from the deck; end A on the left, as in the photo)", 3, weight="bold")
    X = lambda x: 40 + (x + 130) / sc  # noqa: E731
    s.dim(X(lo.o1[0]), oy + 92, X(lo.o1[1]), oy + 92, f"slider {lo.o1[1] - lo.o1[0]:.0f} (+/-150)", 4)
    s.dim(X(lo.o2[0]), oy + 92, X(lo.o2[1]), oy + 92, f"door {lo.o2[1] - lo.o2[0]:.0f}", 4)
    s.note(260, 40, [
        "Existing (photo 2026-10-25, not published):",
        "- standard 20 ft container on a raised steel deck,",
        "  deck about 700 above ground, steps at end B",
        "- sliding glass wall, white frames, about 3.0 x 2.25 m",
        "- narrow hinged steel door near end B (about 0.55 m)",
        "- yellow unit: original cargo doors at end B",
        "- one corner casting rests on a rock: level first",
        "- temporary wiring; timber lining in one unit",
        "",
        "Positions are scaled from the 6,058 mm length [E].",
        "Survey every unit before cutting (studio-site page).",
        "",
        "Structure: the glazed side is about 60 % open and",
        "no longer braces the box (STU-03). Do not cut the",
        "back or end walls; holes there max 152 mm each.",
    ], 2.6)
    return s


def a102_options(m) -> Sheet:
    lo, s = m["lo"], Sheet("A-102", "Layout options considered", "1:50")
    sc, W = 50, lo.W

    def mini(ox, oy, title, zones, verdict, ok):
        s.text(ox, oy - 5, title, 3, weight="bold")
        s.rect(ox, oy, lo.L / sc, W / sc, "#fff", "#111", 0.4)
        s.rect(ox + lo.o1[0] / sc, oy + W / sc - 0.6, (lo.o1[1] - lo.o1[0]) / sc, 1.2, FILL["glass"], "#1f6fd1", 0.3)
        s.rect(ox + lo.o2[0] / sc, oy + W / sc - 0.6, (lo.o2[1] - lo.o2[0]) / sc, 1.2, "#999", "#111", 0.3)
        for (x0, y0, x1, y1, lab, col) in zones:
            s.rect(ox + x0 / sc, oy + y0 / sc, (x1 - x0) / sc, (y1 - y0) / sc, col, "#333", 0.2)
            s.text(ox + (x0 + x1) / 2 / sc, oy + (y0 + y1) / 2 / sc + 0.8, lab, 2, "middle")
        s.text(ox, oy + W / sc + 6, verdict, 2.4, fill="#1b6e2a" if ok else "#b3261e", weight="bold")

    bath, kit, bed, liv = "#cfe3f0", "#efe0bf", "#e7dcef", "#ffffff"
    mini(20, 35, "B (chosen, D-020): galley on the bathroom wall",
         [(0, 0, lo.bed_x1, 2170, "bed", bed), (lo.sofa[0], 0, lo.sofa[1], 850, "sofa", liv),
          (lo.galley_x0, 0, lo.part_x0, lo.sink[1], "galley", kit), (lo.bath_x0, 0, lo.L, W, "bath", bath)],
         "PASS: a real living room; one wet core; robust to +/-150 mm", True)
    mini(150, 35, "A (D-015, replaced): kitchen on the back wall",
         [(0, 0, 1640, 2170, "bed", bed), (1640, 0, 4410, 600, "wardrobe + kitchen", kit),
          (lo.bath_x0, 0, lo.L, W, "bath", bath)],
         "Passes the rules, but the living room is only a table by the glass", False)
    mini(280, 35, "C: keep the narrow door as an entrance",
         [(0, 0, 1640, 2170, "bed", bed), (1640, 0, 3900, 600, "kitchen", kit),
          (4220, 0, lo.L, 1180, "bath 1.18 deep", bath), (4220, 1180, lo.L, W, "entry hall", liv)],
         "FAIL: WC side 364 < 400, front 500 < 600; 550 mm door", False)
    s.note(20, 120, [
        "Options checked by the generator against the same rules (scripts/studio/validate.py):",
        "WC centreline at least 400 from walls and 600 clear in front; shower tray at least 1,000 x 900; galley aisle at",
        "least 800 to the sofa; door and drawer sweeps clear of solids; partition on the solid strip after the glazing.",
        "Layout B keeps A's bathroom (WC facing across the width) and passes at the estimate and at -150 / +150 mm.",
        "A first version with the WC facing along the container failed if the glazing ended more than about 70 mm later.",
        "Precedents: Cleveland 20 ft (STU-46), Falcon (STU-47), Pod-Tainer (STU-48), container hotels (STU-49, STU-50).",
    ], 2.6)
    return s


def a103_plan(m) -> Sheet:
    lo, s = m["lo"], Sheet("A-103", "Furniture and dimension plan", "1:25")
    sc, ox, oy = 25, 40, 50
    it = [t for t in items(m, layers=["furniture", "fixtures"]) if t[0].z0 < lo.H - 200]
    walls = items(m, kits=["K0"], layers=["shell"], exclude_layers=())
    ortho(s, "plan", [(b, "#444", n) for (b, fl, n, i, *_x) in walls if i not in ("K0-ROOF", "K0-FLOOR", "K0-SLIDER")],
          ox, oy, sc, sw=0.1)
    ortho(s, "plan", [(b, FILL["glass"], n) for (b, fl, n, i, *_x) in walls if i == "K0-SLIDER"], ox, oy, sc)
    ortho(s, "plan", tri(it), ox, oy, sc, labels=False)
    X = lambda x: ox + x / sc  # noqa: E731
    Y = lambda y: oy + y / sc  # noqa: E731
    for x0, x1, lab in ((0, lo.bed_x1, "bed"), (*lo.sofa, "sofa"), (lo.galley_x0, lo.part_x0, "galley"),
                        (lo.part_x0, lo.part_x0 + lo.part_t, ""), (lo.bath_x0, lo.L, "bathroom")):
        s.dim(X(x0), Y(0) - 4, X(x1), Y(0) - 4, f"{x1 - x0:.0f}", 4)
        if lab:
            s.text(X((x0 + x1) / 2), Y(0) - 13, lab, 1.9, "middle")
    s.dim(X(0), Y(lo.W) + 6, X(lo.L), Y(lo.W) + 6, f"{lo.L:.0f} net", -8)
    s.dim(X(lo.o1[0]), Y(lo.W) + 3, X(lo.o1[1]), Y(lo.W) + 3, f"slider {lo.o1[1] - lo.o1[0]:.0f}", -4)
    s.dim(X(lo.L) + 6, Y(0), X(lo.L) + 6, Y(lo.W), f"{lo.W:.0f}", -4)
    # door swings
    s.line(X(lo.bdoor[0]), Y(lo.bath_y1 + lo.part_t) + 1, X(lo.bdoor[1] + (lo.bdoor[1] - lo.bdoor[0])),
           Y(lo.bath_y1 + lo.part_t) + 1, "#111", 0.25, "1,0.8")  # sliding door and where it parks
    for y0, y1, lab in (lo.fridge + ("fridge",), lo.hob + ("hob",), lo.sink + ("sink",)):
        s.dim(X(lo.galley_x0) - 4, Y(y0), X(lo.galley_x0) - 4, Y(y1), f"{y1 - y0:.0f} {lab}", 3)
    for (lx, ly, t) in ((800, 1100, "BED 1,600 x 2,000"), ((lo.galley_x0 + lo.part_x0) / 2, 1650, "GALLEY 900"),
                        ((lo.bath_x0 + lo.L) / 2, 1200, "BATH"), (sum(lo.sofa) / 2, 450, "SOFA"),
                        (2700, 1250, "living / dining")):
        s.text(X(lx), Y(ly), t, 2.3, "middle", "bold")
    rows = [[r["id"], r["rule"][:58], r["result"], r["detail"][:34]] for r in m["checks"] if not r["id"].startswith(("E-", "P-"))]
    s.table(40, 160, [("Check", 22), ("Rule", 110), ("Result", 16), ("Value", 70)], rows, 1.8, 3.3)
    return s


def plan_bw(m) -> str:
    """The plan for the web, simplified: walls, glazing, one outline per piece of furniture, the
    bathroom door swing, zone names and the overall size. No carcass detail, sheet or checks."""
    lo, s = m["lo"], Sheet("", "")
    sc, ox, oy, ink, sw = 25, 8.0, 16.0, "#111", 0.22
    X = lambda x: ox + x / sc  # noqa: E731
    Y = lambda y: oy + y / sc  # noqa: E731
    by_id = {i: b for (b, fl, n, i, *_x) in items(m, layers=None, exclude_layers=())}

    def box(x0, y0, x1, y1, fill="#fff", w=sw) -> None:
        s.rect(X(x0), Y(y0), (x1 - x0) / sc, (y1 - y0) / sc, fill, ink, w)

    walls = items(m, kits=["K0"], layers=["shell"], exclude_layers=())
    ortho(s, "plan", [(b, ink, n) for (b, fl, n, i, *_x) in walls if i not in ("K0-ROOF", "K0-FLOOR", "K0-SLIDER")],
          ox, oy, sc, sw=0.1)
    g = by_id["K0-SLIDER"]
    box(g.x0, g.y0, g.x1, g.y1, "#fff", 0.15)
    # bed: frame, headboard, two pillows
    box(0, 0, lo.bed_x1, 2170)
    s.line(X(0), Y(150), X(lo.bed_x1), Y(150), ink, sw)
    for px in (120, lo.bed_x1 / 2 + 40):
        box(px, 220, px + lo.bed_x1 / 2 - 160, 520)
    # seating: sofa (back and arms), table, two chairs with their backs to the glass
    sb = by_id["K6-SOFA"]
    box(sb.x0, sb.y0, sb.x1, sb.y1)
    box(sb.x0 + 130, sb.y0 + 220, sb.x1 - 130, sb.y1)
    t = by_id["K6-01"]
    box(t.x0, t.y0, t.x1, t.y1)
    for c in (1, 2):
        seat = by_id[f"K6-{4 * c:02d}"]
        box(seat.x0, seat.y0, seat.x1, seat.y1)
        box(seat.x0, seat.y1 - 60, seat.x1, seat.y1, ink, 0.1)
    # galley: worktop, sink, two hob rings
    X0 = lo.part_x0 - 620
    box(X0, 0, lo.part_x0, lo.sink[1])
    sk = by_id["K3-SINK"]
    box(sk.x0, sk.y0, sk.x1, sk.y1)
    hx = lo.part_x0 - 310
    for hy in (lo.hob[0] + 110, lo.hob[1] - 110):
        s.circle(X(hx), Y(hy), 90 / sc, "none", ink, sw)
    # partition to the cross wall; the cross wall with its sliding-door opening; the door leaf
    cy0, cy1 = lo.bath_y1, lo.bath_y1 + lo.cross_t
    box(lo.part_x0, 0, lo.bath_x0, cy1, ink, 0.1)
    box(lo.bath_x0, cy0, lo.bdoor[0], cy1, ink, 0.1)
    box(lo.bdoor[1], cy0, lo.L, cy1, ink, 0.1)
    box(lo.bdoor[0], cy1 + 10, lo.bdoor[1] + 20, cy1 + 45, "#fff", 0.18)
    # bathroom: shower tray with its drain, WC, basin
    tx0, tx1, ty0, ty1 = lo.tray
    box(tx0, ty0, tx1, ty1)
    s.circle(X((tx0 + tx1) / 2), Y((ty0 + ty1) / 2), 45 / sc, "none", ink, sw)
    wc = by_id["K2-WC"]
    box(wc.x1 - 180, wc.y0, wc.x1, wc.y1)
    s.circle(X(wc.x1 - 400), Y((wc.y0 + wc.y1) / 2), 190 / sc, "#fff", ink, sw)
    bs = by_id["K2-BASIN"]
    box(bs.x0, bs.y0, bs.x1, bs.y1)
    for x0, x1, lab in ((0, lo.bed_x1, "BED"), (*lo.sofa, "SEATING"),
                        (lo.part_x0 - 620, lo.part_x0, "GALLEY"), (lo.bath_x0, lo.L, "BATH")):
        s.text(X((x0 + x1) / 2), oy - 7, lab, 2.6, "middle", "bold", ink)
    s.dim(X(0), Y(lo.W) + 4, X(lo.L), Y(lo.W) + 4, f"{lo.L:,.0f}", 4, 2.4)
    s.dim(X(lo.L) + 6, Y(0), X(lo.L) + 6, Y(lo.W), f"{lo.W:,.0f}", -4, 2.4)
    return s.bare(ox + (lo.L + 300) / sc + 10, Y(lo.W) + 14)


def plan_facts(m) -> dict:
    """The few numbers the web page lists beside the plan."""
    lo = m["lo"]
    checks = [c for c in m["checks"] if not c["id"].startswith(("E-", "P-"))]
    tx0, tx1, ty0, ty1 = lo.tray
    return {
        "inside": f"{lo.L:,.0f} × {lo.W:,.0f} mm",
        "floor": f"{lo.L * lo.W / 1e6:.1f} m²",
        "height": f"{lo.H:,.0f} mm",
        "bed": "1,600 × 2,000 mm",
        "galley": f"{lo.sink[1]:,.0f} mm",
        "shower": f"{tx1 - tx0:,.0f} × {ty1 - ty0:,.0f} mm",
        "checks": len(checks),
        "passed": sum(1 for c in checks if c["result"] == "pass"),
    }


def a201_elev(m) -> Sheet:
    lo, s = m["lo"], Sheet("A-201", "Interior elevations: back wall and front wall", "1:30")
    sc = 30
    it = items(m, layers=["furniture", "fixtures", "envelope"])
    back = [(b, fl, n) for (b, fl, n, i, k, layer) in it if b.y0 < 700 and b.z0 < lo.H - 5 and not i.startswith("K1-BAT")
            and not i.startswith("K1-EPS") and k != "K0"]
    s.text(30, 30, "BACK WALL (looking at y = 0)", 3, weight="bold")
    s.rect(30, 36, lo.L / sc, lo.H / sc, "#fafafa", "#111", 0.4)
    ortho(s, "back", back, 30, 36 + lo.H / sc, sc, labels=True)
    front = [(b, fl, n) for (b, fl, n, i, k, layer) in it if b.y1 > lo.W - 700 and b.z0 < lo.H - 5
             and not i.startswith(("K1-BAT", "K1-EPS")) and k != "K0"]
    sl = items(m, kits=["K0"], layers=["shell"], exclude_layers=())
    oy = 160
    s.text(30, oy - 6, "FRONT WALL (looking at the glass from inside; end B on the left)", 3, weight="bold")
    s.rect(30, oy, lo.L / sc, lo.H / sc, "#fafafa", "#111", 0.4)
    ortho(s, "front", [(b, fl, n) for (b, fl, n, i, *_x) in sl if i == "K0-SLIDER"], 30 + lo.L / sc, oy + lo.H / sc, sc)
    ortho(s, "front", front, 30 + lo.L / sc, oy + lo.H / sc, sc, labels=True)
    for z, t in ((900, "worktop 900"), (450, "bed deck 450"), (1800, "overhead cabinet 1,800")):
        s.line(30 + lo.L / sc + 3, 36 + (lo.H - z) / sc, 30 + lo.L / sc + 8, 36 + (lo.H - z) / sc, "#555", 0.2)
        s.text(30 + lo.L / sc + 9, 36 + (lo.H - z) / sc + 0.8, t, 2)
    return s


def a202_ends(m) -> Sheet:
    lo, s = m["lo"], Sheet("A-202", "End elevations and cross-section", "1:25")
    sc = 25
    it = items(m, layers=["furniture", "fixtures", "envelope"])
    clean = [(b, fl, n, i) for (b, fl, n, i, k, layer) in it if not i.startswith(("K1-BAT", "K1-EPS")) and k != "K0"]
    views = [("endA", "END A (bed) looking at x = 0", [t for t in clean if t[0].x0 < 1700]),
             ("endB", "GALLEY looking at the bathroom wall", [t for t in clean if t[0].x0 >= lo.galley_x0 - 40
                                                          and t[0].x1 <= lo.part_x0 + 20]),
             ("endB", "END B (bathroom) looking at x = L", [t for t in clean if t[0].x1 > lo.bath_x0])]
    for j, (v, title, sel) in enumerate(views):
        ox = 30 + j * 125
        s.text(ox, 30, title, 2.8, weight="bold")
        s.rect(ox, 36, lo.W / sc, lo.H / sc, "#fafafa", "#111", 0.4)
        ortho(s, v, [(b, fl, n) for (b, fl, n, _i) in sel], ox + (lo.W / sc if v == "endB" else 0), 36 + lo.H / sc, sc,
              labels=True)
        s.dim(ox, 36 + lo.H / sc + 4, ox + lo.W / sc, 36 + lo.H / sc + 4, f"{lo.W:.0f}", 3)
        s.dim(ox - 4, 36 + lo.H / sc, ox - 4, 36, f"{lo.H:.0f} clear", 3)
    s.note(30, 150, [
        "Clear height about 2,323 mm after a 60 mm ceiling and a 10 mm floor build-up (AS-15).",
        "The 2012 rules asked 2.4 m over half a habitable room (STU-11, superseded); the founder reports approval.",
        "Wall fans, not ceiling fans (blades would be below 2.1 m). Split-AC provision: sleeve + 16 A circuit.",
    ], 2.6)
    return s


def a401_details(m) -> Sheet:
    s = Sheet("A-401", "Build-up details", "1:5")
    sc = 5

    def layers(ox, oy, title, lay, vertical=True):
        s.text(ox, oy - 6, title, 3, weight="bold")
        x = ox
        for t, fill, lab in lay:
            w = t / sc
            s.rect(x, oy, w, 60, fill, "#111", 0.25)
            s.text(x + w / 2, oy + 66 + (3 if len(lay) > 4 and lay.index((t, fill, lab)) % 2 else 0), lab, 1.9,
                   "middle")
            x += w
        s.dim(ox, oy - 2, x, oy - 2, f"{sum(t for t, _, _ in lay):.0f}", 2)

    layers(30, 40, "WALL (steel to room)", [(1.6 * 4, "#9c4436", "steel 1.6 (x4 drawn)"), (36, FILL["eps"], "EPS strips in valleys"),
                                           (38, FILL["timber"], "batten 38 + EPS 38"), (12, FILL["PLY12"], "ply 12, PU varnish")])
    layers(160, 40, "CEILING (roof to room)", [(2 * 4, "#9c4436", "roof 2.0 (x4)"), (20, FILL["eps"], "EPS in corrugation"),
                                              (38, FILL["timber"], "batten + EPS 38"), (12, FILL["PLY12"], "ply 12")])
    layers(290, 40, "BATHROOM WET WALL", [(38, FILL["timber"], "stud 38 / EPS"), (12, "#cfcfcf", "cement board 12"),
                                         (2, "#4a7bd1", "membrane"), (10, FILL["tile"], "tile + adhesive")])
    layers(30, 150, "PARTITION 70 (living | bath)", [(18, FILL["MPLY18"], "marine ply 18"), (40, FILL["timber"], "stud 40 + rock wool"),
                                                    (12, "#cfcfcf", "cement board 12")])
    layers(160, 150, "FLOOR (living)", [(28, "#8a6a3a", "container ply 28 (treated)"), (1, "#777", "epoxy seal"),
                                       (2, "#bbb", "underlay"), (5, FILL["floor"], "SPC 5")])
    s.note(290, 150, [
        "W1 (old door): 2 mm steel infill with 40 mm EPS welded",
        "into the existing frame up to 1,150; obscure louvre",
        "window above with insect mesh; the bathroom fan exits",
        "through the infill panel (no new hole in a bracing wall).",
        "",
        "Floor: never sand the treated plywood (STU-07).",
        "Drains pass between cross-members, never through them.",
        "Steel faces: rust converter + zinc primer before foam.",
        "All EPS joints foam-sealed: no air path to the steel.",
    ], 2.4)
    return s


# ------------------------------------------------------------------------------- roof
def s101_roof(m) -> Sheet:
    lo, s = m["lo"], Sheet("S-101", "Roof terrace, deck canopy and stair: plan and elevation", "1:50")
    sc = 50
    rf = [(b, fl, n) for (b, fl, n, i, k, layer) in items(m, kits=["K11"], layers=["roof"], exclude_layers=())]
    shell = [(b, fl, n) for (b, fl, n, i, *_x) in items(m, kits=["K0"], layers=["shell"], exclude_layers=())]
    s.text(30, 30, "PLAN (deck canopy omitted)", 3, weight="bold")
    ortho(s, "plan", shell + [t for t in rf if "polycarbonate" not in t[2]], 30 + 2400 / sc, 40 + 600 / sc, sc, sw=0.12)
    s.text(30, 135, "FRONT ELEVATION", 3, weight="bold")
    ortho(s, "front", shell + rf, 30 + (lo.L + 2400) / sc, 140 + 5800 / sc, sc, sw=0.12)
    rows = [["Deck beams", "RHS 150x100x5, 2 no., bear on the 4 corner castings only"],
            ["Joists", "RHS 80x40x3 at 600"], ["Deck", "hardwood boards 140 x 25, 5 mm gaps"],
            ["Guardrail", "1,100 high, SHS posts at 1.5 m, hardwood top rail"],
            ["Infill", "4 mm stainless cables at 90 mm (gaps under 100)"],
            ["Roof", "open to the sky: no canopy over the terrace (D-020)"],
            ["Veranda canopy", "polycarbonate on own posts + ledger over the front deck"],
            ["Stair", "dog-leg, 16 risers about 175, goings 250, 850 wide, handrails"],
            ["Loads [A]", "3.0 kN/m2 live, 0.74 kN/m rail, wind uplift: engineer to sign"]]
    s.table(230, 30, [("Element", 34), ("Specification", 140)], rows, 1.9, 3.6)
    s.note(230, 70, [
        "The glazed side does not brace the box: nothing bears on the",
        "slider head or the open side's top rail (STU-03).",
        "All steelwork bonded to the earth electrode (lightning).",
        "Polycarbonate not found online in Kigali: fallback translucent",
        "GRP or opal corrugated sheet (Tolirwa / Safintra, field check).",
        "Engineer's inspection before any guest uses the roof (R26).",
    ], 2.4)
    return s


# ------------------------------------------------------------------------------- electrical
def e101_layout(m) -> Sheet:
    lo, s = m["lo"], Sheet("E-101", "Electrical layout plan", "1:25")
    sc, ox, oy = 25, 40, 45
    it = [t for t in items(m, layers=["furniture", "fixtures"]) if t[0].z0 < lo.H - 200]
    ortho(s, "plan", [(b, "#f3f3f3", n) for (b, fl, n, *_x) in it], ox, oy, sc, sw=0.1)
    s.rect(ox, oy, lo.L / sc, lo.W / sc, "none", "#111", 0.5)
    for p in m["points"]:
        x, y = ox + max(-1500, p.x) / sc, oy + min(p.y, lo.W + 800) / sc
        if p.kind == "light":
            sym_lamp(s, x, y)
        elif p.kind in ("socket", "usb", "outlet"):
            sym_socket(s, x, y)
        elif p.kind == "switch":
            sym_switch(s, x, y)
        elif p.kind == "fan":
            s.circle(x, y, 1.6, "#fff")
            s.text(x, y + 0.8, "F", 1.8, "middle")
        else:
            sym_box(s, x, y, "DB", 5, 3)
        s.text(x + 2, y - 1.8, f"{p.id}/{p.circuit}" if p.circuit else p.id, 1.6)
    rows = [[p.id, p.circuit, p.label[:46], f"{p.z:.0f}"] for p in m["points"]]
    s.table(250, 150, [("Pt", 10), ("Cct", 10), ("Description", 88), ("z", 12)], rows[:24], 1.6, 3.0)
    s.note(40, 150, [
        "Mounting heights z above the finished floor (mm). Sockets in the bathroom: none.",
        "Bathroom light IP65; extract fan through the back wall; switches outside the bathroom.",
        "Cables run in 20 mm conduit inside the batten cavity, in vertical drops and in",
        "horizontal zones at 300 and 1,100; grommets at every steel penetration.",
        "Outdoor points (deck, roof, stair) IP65/66 on the bonded steelwork.",
    ], 2.3)
    return s


def e201_sld(m) -> Sheet:
    s = Sheet("E-201", "Single-line diagram: site and unit board", "NTS")
    fd = m["feeder"]
    # site
    s.text(30, 30, "SITE", 3, weight="bold")
    sym_box(s, 60, 45, "REG meter", 18, 6)
    s.line(60, 48, 60, 56)
    sym_box(s, 60, 60, "Site board", 20, 6)
    s.text(72, 61, "main switch, SPD type 1+2, earth bar", 2.0)
    for i, ph in enumerate(("L1", "L2", "L3")):
        x = 40 + i * 30
        s.line(60, 63, x, 72)
        sym_breaker(s, x, 72, f"40 A ({ph})")
        s.line(x, 83, x, 95)
        s.text(x + 1.5, 92, f"{fd['size_mm2']:.0f} mm2 SWA", 1.8)
        sym_box(s, x, 99, f"Studio {i + 1}", 16, 6)
    s.line(110, 63, 130, 72)
    sym_breaker(s, 130, 72, "Pumps")
    s.note(30, 112, [
        "3-phase supply preferred, one studio per phase; otherwise single phase sized by REG.",
        f"Feeder {fd['size_mm2']:.0f} mm2 Cu SWA, {fd['length_m']:.0f} m [A], drop {fd['drop_pct']:.1f} % at max demand.",
        "TT earthing: one earth rod per container; no PME to a steel structure unless certified (STU-37).",
    ], 2.3)
    # unit board
    ox = 210
    s.text(ox, 30, "UNIT BOARD (identical in all three studios)", 3, weight="bold")
    s.line(ox + 10, 40, ox + 10, 46)
    s.text(ox + 12, 43, "from the site board", 2)
    sym_breaker(s, ox + 10, 46, "Main switch 40 A DP")
    s.line(ox + 10, 57, ox + 10, 60)
    sym_breaker(s, ox + 10, 60, "RCD 40 A 30 mA type A", rcd=True)
    s.line(ox + 10, 71, ox + 10, 75)
    s.line(ox + 10, 75, ox + 10 + 8 * 20, 75)
    s.rect(ox + 50, 42, 14, 8, "#fff")
    s.text(ox + 57, 47, "SPD T2", 2, "middle")
    s.line(ox + 50, 46, ox + 10, 46 + 4)
    for i, c in enumerate(m["circuits"]):
        x = ox + 10 + i * 20
        s.line(x, 75, x, 80)
        sym_breaker(s, x, 80, c.breaker)
        s.line(x, 91, x, 100)
        s.text(x, 105, c.id, 2.4, "middle", "bold")
        s.text(x, 109, f"{c.cable:g} mm2", 1.8, "middle")
        for j, word in enumerate(c.name.split(":")[0].split(" ")[:4]):
            s.text(x, 113 + j * 2.6, word, 1.6, "middle")
    s.note(ox, 140, [
        "C4 hob and C5 heater share a priority relay: the heater pauses while the hob runs.",
        f"Diversified maximum demand about {m['md']['total_A']:.0f} A per unit (AS-19).",
        "RCD type A on all circuits (or one RCBO per circuit). SPD type 2 at each unit.",
        "Ratings are design intent: a RURA class A electrician designs and certifies (STU-15).",
        "Wiring standard RS 565-1:2011 (STU-14); confirm every rating against it.",
    ], 2.3)
    return s


def e202_circuits(m) -> Sheet:
    s = Sheet("E-202", "Circuit schedule, earthing and bonding", "NTS")
    rows = []
    for c in m["circuits"]:
        if not c.loads:
            rows.append([c.id, c.name, c.breaker, f"{c.cable:g}", "-", "-", "-", "-"])
            continue
        rows.append([c.id, c.name[:40], c.breaker, f"{c.cable:g}", f"{c.Ib:.1f}", f"{c.Iz:.1f}", f"{c.length_m:.1f}",
                     f"{c.vdrop_pct():.2f}"])
    s.text(25, 28, "CIRCUIT SCHEDULE (Ib design current, Iz derated capacity, drop at the far point)", 3, weight="bold")
    s.table(25, 32, [("Cct", 12), ("Serves", 78), ("Device", 16), ("mm2", 12), ("Ib A", 14), ("Iz A", 14),
                     ("Run m", 14), ("Drop %", 16)], rows, 1.9, 3.6)
    md = m["md"]
    s.table(25, 80, [("Maximum demand item", 60), ("A", 20)],
            [[k, f"{v:.1f}"] for k, v in md.items()], 1.9, 3.6)
    # earthing diagram
    ox, oy = 230, 40
    s.text(ox, 30, "EARTHING AND BONDING (TT)", 3, weight="bold")
    sym_box(s, ox + 20, oy + 5, "Unit board MET", 26, 6)
    for i, (lab, x) in enumerate((("container body", 0), ("front deck + stair", 35), ("roof frame + deck canopy", 70),
                                  ("water pipe entry", 105))):
        s.line(ox + 20, oy + 8, ox + x + 10, oy + 25)
        sym_box(s, ox + x + 10, oy + 29, lab, 30, 6)
    s.line(ox + 20, oy + 2, ox + 20, oy - 4)
    s.line(ox + 20, oy + 8, ox + 20, oy + 50)
    sym_earth(s, ox + 20, oy + 50)
    s.text(ox + 24, oy + 52, "earth rod 1.5 m, inspection pit; test and record RA", 2)
    s.note(ox, oy + 65, [
        "Bonding: finely stranded green-yellow (16 mm2 [A]) from each steel item to the MET.",
        "RA x 30 mA must stay under 50 V; aim much lower for lightning (measure on site).",
        "Tests before handover: continuity, insulation resistance, polarity, earth electrode",
        "resistance, RCD trip time, SPD status; certificate from the licensed electrician.",
        "Bathroom: zone 1 above the tray to 2.25 m (IPX4); 30 mA on every circuit (STU-38).",
    ], 2.3)
    return s


# ------------------------------------------------------------------------------- plumbing
def p101_plan(m) -> Sheet:
    lo, s = m["lo"], Sheet("P-101", "Plumbing layout plan (supply and drainage)", "1:25")
    sc, ox, oy = 25, 40, 50
    it = [t for t in items(m, layers=["furniture", "fixtures"]) if t[0].z0 < lo.H - 200]
    ortho(s, "plan", [(b, "#f5f5f5", n) for (b, fl, n, *_x) in it], ox, oy, sc, sw=0.1)
    s.rect(ox, oy, lo.L / sc, lo.W / sc, "none", "#111", 0.5)
    for r in m["runs"]:
        pts = [(ox + x / sc, oy + y / sc) for (x, y, z) in r.path]
        s.poly(pts, "none", SYS[r.system], 0.6 if r.dn >= 50 else 0.4, closed=False)
        s.text(pts[-1][0] + 1, pts[-1][1] - 1, f"{r.id} DN{r.dn}", 1.6, fill=SYS[r.system])
    for i, (sysn, col) in enumerate(SYS.items()):
        s.line(300, 40 + i * 5, 310, 40 + i * 5, col, 0.8)
        s.text(312, 41 + i * 5, sysn, 2.2)
    rows = [[r.id, r.system, f"DN{r.dn}", f"{r.length / 1000:.1f}", f"1:{r.fall():.0f}" if r.system in ("soil", "waste") else "-",
             r.note[:44]] for r in m["runs"]]
    s.table(40, 160, [("Run", 12), ("System", 18), ("Size", 14), ("m", 12), ("Fall", 14), ("Note", 92)], rows, 1.8, 3.2)
    return s


def p201_iso(m) -> Sheet:
    lo, s = m["lo"], Sheet("P-201", "Pipework isometric (unit)", "NTS")
    sc = 0.045
    cx, cy = 200, 150
    pts_all = [iso(*p) for r in m["runs"] for p in r.path]
    u0 = min(p[0] for p in pts_all)
    v0 = min(p[1] for p in pts_all)
    u1 = max(p[0] for p in pts_all)
    v1 = max(p[1] for p in pts_all)
    ox, oy = cx - (u0 + u1) / 2 * sc, cy - (v0 + v1) / 2 * sc
    for r in sorted(m["runs"], key=lambda r: r.system):
        q = [(ox + iso(*p)[0] * sc, oy + iso(*p)[1] * sc) for p in r.path]
        s.poly(q, "none", SYS[r.system], 0.7 if r.dn >= 50 else 0.45, closed=False)
        s.text(q[0][0] + 1, q[0][1] - 1, f"{r.id}", 1.8, fill=SYS[r.system])
    # floor outline at z = 0
    fl = [(0, 0, 0), (lo.L, 0, 0), (lo.L, lo.W, 0), (0, lo.W, 0)]
    s.poly([(ox + iso(*p)[0] * sc, oy + iso(*p)[1] * sc) for p in fl], "none", "#999", 0.2)
    s.note(25, 30, [
        "Supply: PPR PN20, 20/25 mm. Hot leaves the 80 L heater at 60 C; a thermostatic mixer",
        "(TMV) delivers 41-44 C to the shower and basin; the kitchen sink gets direct hot (labelled).",
        "Drainage hangs in the void under the raised floor (the container is about 700 mm up),",
        "between cross-members: WC 110, shower and sink 50, basin 40, falls at least 1:40.",
        "Vent: 75 mm open vent up end B to 900 above the guardrail line (or an AAV inside).",
        "Kitchen sink waste runs separately to a grease trap and its own soak pit (STU-11).",
    ], 2.4)
    return s


def p301_site(m) -> Sheet:
    st = m["site"]
    s = Sheet("P-301", "Site water and sanitation schematic", "NTS")

    def blk(x, y, w, h, t, sub=""):
        s.rect(x, y, w, h, "#fff", "#111", 0.35)
        s.text(x + w / 2, y + h / 2 + (0 if sub else 1), t, 2.4, "middle", "bold")
        if sub:
            s.text(x + w / 2, y + h / 2 + 3.4, sub, 1.9, "middle")

    def arrow(x1, y1, x2, y2, col="#1f6fd1"):
        s.line(x1, y1, x2, y2, col, 0.6)
        s.poly([(x2, y2), (x2 - 2, y2 - 1.2), (x2 - 2, y2 + 1.2)] if x2 > x1 else
               [(x2, y2), (x2 + 1.2, y2 - 2), (x2 - 1.2, y2 - 2)] if y2 > y1 else [(x2, y2), (x2 + 2, y2 - 1.2), (x2 + 2, y2 + 1.2)],
               col, col, 0.2)

    blk(25, 40, 40, 14, "WASAC main", "air gap at the tank (D-016)")
    blk(25, 65, 40, 14, "Borehole pump", "private source")
    blk(25, 90, 40, 14, "Rainwater", "deck canopy gutter, first flush")
    blk(95, 60, 44, 22, f"Storage tank {st['tank_m3']:.1f} m3", f"{st['daily_L']:.0f} L/day, 4 days")
    for y in (47, 72, 97):
        arrow(65, y, 95, 71)
    blk(165, 62, 40, 18, "Booster + pressure vessel", f"2.5-3 bar, about {st['pump_lpm']:.0f} L/min")
    arrow(139, 71, 165, 71)
    for i in range(3):
        blk(235, 40 + i * 26, 40, 16, f"Studio {i + 1}", "stop valve, filter, meter")
        arrow(205, 71, 235, 48 + i * 26)
    # drainage
    s.text(25, 150, "DRAINAGE", 3, weight="bold")
    for i in range(3):
        blk(25 + i * 50, 158, 40, 14, f"Studio {i + 1}", "WC, shower, basin")
        arrow(45 + i * 50, 172, 45 + i * 50, 185, "#3d2b14")
        blk(30 + i * 50, 185, 30, 10, f"IC{i + 1}", "")
    blk(190, 180, 52, 22, f"Septic tank {st['septic_m3']:.1f} m3", f"2 chambers: {st['chamber1_m3']:.2f} + {st['chamber2_m3']:.2f}")
    arrow(160, 190, 190, 190, "#3d2b14")
    blk(270, 180, 40, 22, "Soak pit / drain field", "size from percolation")
    arrow(242, 190, 270, 190, "#3d2b14")
    blk(190, 215, 52, 14, "Grease trap", "3 kitchen sinks")
    blk(270, 215, 40, 14, "Kitchen soak pit", "separate (STU-11)")
    arrow(242, 222, 270, 222, "#6b4f2a")
    rows = [["DRS 143 draft (STU-10)", f"{st['septic_rs143_m3']:.1f}"], ["2012 regulations (STU-11)", f"{st['septic_2012_m3']:.2f}"],
            ["180P + 2,000 L (STU-09 style)", f"{st['septic_uk_m3']:.2f}"], ["Design (largest, rounded)", f"{st['septic_m3']:.1f}"]]
    s.table(320, 40, [("Septic sizing, P = 8", 60), ("m3", 14)], rows, 1.9, 3.6)
    s.note(320, 70, [
        "Siting rules (check on the site plan):",
        "- at least 50 m from the borehole and any well",
        "  (2012 rules; DRS 143 draft: soak pit 18 m)",
        "- at least 50 m from the lake (LOC-01, LOC-02)",
        "- at least 3-7 m from buildings and the boundary",
        "- downhill of the borehole; tanker within 30 m",
        "- soak pit only where groundwater is more than",
        "  2.5 m down and percolation is 25-125 mm/h",
        "No guests until the system passes inspection.",
    ], 2.2)
    return s


# ------------------------------------------------------------------------------- kits
def j_kit(m, kid: str, number: str) -> Sheet:
    s = Sheet(number, f"Kit {kid}: {KIT_NAMES[kid]} (exploded)", "NTS")
    k = next(k for k in m["kits"] if k.id == kid)
    ex = 1.0
    its = [(p.box.shift(tuple(e * ex for e in p.explode)), FILL.get(p.material, "#eee"), "normal", p.id.split("-", 1)[1])
           for p in k.parts]
    its += [(b.box, FILL.get(b.color, "#eee"), "ghost", "") for b in k.bought if b.box is not None and b.qty]
    iso_draw(s, its, 130, 140, (220, 220), callouts=False, max_scale=0.09)
    rows = [[p.id, p.name[:34], p.material, f"{p.length:.0f} x {p.width:.0f} x {p.t:.0f}"] for p in k.parts]
    s.table(250, 25, [("Part", 18), ("Name", 66), ("Mat.", 16), ("L x W x T", 30)], rows[:60], 1.6, 3.0)
    return s


def c_cutting(sheets_layout, start: int, number: str) -> Sheet:
    s = Sheet(number, "Cutting diagrams (panel saw: rip strips, then crosscut)", "1:20")
    sc = 20
    for j, sl in enumerate(sheets_layout[start:start + 4]):
        ox, oy = 25 + (j % 2) * 190, 30 + (j // 2) * 120
        s.text(ox, oy - 3, f"{sl.material} sheet {sl.index}: {sl.L:.0f} x {sl.W:.0f}, "
                           f"use {sl.utilisation * 100:.0f} %", 2.6, weight="bold")
        s.rect(ox, oy, sl.L / sc, sl.W / sc, "#f6f6f6", "#111", 0.4)
        for st in sl.strips:
            s.line(ox, oy + (st.y + st.width + 2) / sc, ox + sl.L / sc, oy + (st.y + st.width + 2) / sc, "#c00", 0.15, "1,1")
        for pl in sl.placed:
            s.rect(ox + pl.x / sc, oy + pl.y / sc, pl.l / sc, pl.w / sc, FILL.get(sl.material, "#eee"), "#111", 0.2)
            if pl.l / sc > 8 and pl.w / sc > 3:
                s.text(ox + (pl.x + pl.l / 2) / sc, oy + (pl.y + pl.w / 2) / sc + 0.7, pl.part.id, 1.7, "middle", "bold")
                if pl.w / sc > 6:
                    s.text(ox + (pl.x + pl.l / 2) / sc, oy + (pl.y + pl.w / 2) / sc + 3, f"{pl.l:.0f} x {pl.w:.0f}", 1.4,
                           "middle")
    return s


# ------------------------------------------------------------------------------- IKEA steps
HW_ICON = {"A": "confirmat", "B": "dowel", "C": "bolt", "D": "hinge", "E": "pin", "F": "screw", "G": "runner",
           "H": "leg", "J": "handle", "K": "castor", "L": "sds"}


def step_sheet(m, step, k, done_ids: set[str]) -> Sheet:
    s = Sheet(f"AS-{step.id[1:]}", step.title[:64], "", "A4", landscape=False)
    s.text(20, 26, step.id.replace("S", ""), 16, weight="bold")
    s.text(42, 22, KIT_NAMES.get(k.id, k.id), 3)
    s.text(42, 28, step.title[:70], 2.6)
    if step.persons >= 2:
        for i in range(2):
            x = 175 + i * 7
            s.circle(x, 20, 2)
            s.line(x, 22, x, 29, "#111", 0.6)
            s.line(x - 2.5, 25, x + 2.5, 25, "#111", 0.5)
    its = []
    for kk in m["kits"]:
        for p in kk.parts:
            if p.id in step.adds:
                its.append((p.box.shift(tuple(e * 0.6 for e in p.explode)), "#fff", "new", p.id.split("-", 1)[1]))
            elif p.id in done_ids and kk.id == k.id:
                its.append((p.box, "#e6e6e6", "old", ""))
    if not its:
        its = [(b.box, FILL.get(b.color, "#eee"), "normal", "") for b in k.bought if b.box is not None and b.qty and
               b.step == step.id] or [(Box(0, 0, 0, 1000, 600, 900), "#fff", "ghost", "")]
    iso_draw(s, its, 105, 150, (170, 170), callouts=True, max_scale=0.07)
    x = 20
    for code, n in step.hardware.items():
        if not n:
            continue
        s.rect(x, 252, 30, 14, "#fff", "#111", 0.3)
        s.text(x + 15, 259, HW_ICON.get(code, code), 2.2, "middle")
        s.text(x + 15, 264, f"{n}x  {code}", 2.6, "middle", "bold")
        x += 34
    if step.note:
        s.text(20, 248, "! " + step.note[:90], 2.4, weight="bold", fill="#b3261e")
    return s


def template_sheet() -> Sheet:
    s = Sheet("T-01", "1:1 drilling templates: carcass side, hinge, shelf row", "1:1", "A4", landscape=False)
    s.text(20, 25, "Print at 100 % (no scaling). Check the bar: it must measure exactly 100 mm.", 2.8, weight="bold")
    s.rect(20, 30, 100, 4, "#111", "#111", 0.1)
    s.text(122, 33.5, "100 mm", 2.6)
    # carcass side corner: confirmat + dowels at 37 / mid, shelf row at 37 / 32
    s.text(20, 46, "A  Carcass side, bottom corner (face A). Align the template's edges with the panel's back and bottom.", 2.2)
    s.line(20, 50, 190, 50, "#111", 0.4)
    s.line(20, 50, 20, 140, "#111", 0.4)
    for u in (37.0, 147.0):  # 37 from the back and front; mid hole off-sheet for deep sides
        s.circle(20 + u, 50 + 9, 3.5, "none", "#111", 0.3)
        s.text(20 + u + 4, 50 + 10, "7 thru (confirmat)", 1.8)
    for u in (92.0,):
        s.circle(20 + u, 50 + 9, 4, "none", "#1f6fd1", 0.3)
        s.text(20 + u + 5, 50 + 14, "8 x 12 (dowel)", 1.8, fill="#1f6fd1")
    v = 160.0
    while v < 220:
        for u in (37.0,):
            s.circle(20 + u, 50 + v - 120, 2.5, "none", "#555", 0.25)
        v += 32
    s.text(20 + 42, 50 + 60, "5 x 12 shelf row, 32 pitch, 37 from the edge", 1.8)
    # hinge cup
    s.text(20, 160, "B  Door, hinge side (face A): 35 x 13 cup, centre 22.5 from the edge, 100 from top and bottom.", 2.2)
    s.line(20, 165, 20, 260, "#111", 0.4)
    s.line(20, 165, 120, 165, "#111", 0.4)
    s.circle(20 + 22.5, 165 + 100 - 80, 17.5, "none", "#111", 0.35)
    s.circle(20 + 22.5, 165 + 100 - 80, 0.8, "#111")
    s.text(20 + 45, 165 + 22, "35 cup, 13 deep", 2)
    return s
