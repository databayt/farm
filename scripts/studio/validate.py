"""Checks that fail the build: geometry, clearances, services, nesting, BOM, steps."""
from __future__ import annotations

from layout import AISLE_MIN, PASS_MIN, WC_D
from model import Box, Kit

TOUCH_OK = {  # pairs of kits whose solids may legitimately touch or interlock
    ("K6", "K6"),  # cross-halving legs
}


def solids(kits: list[Kit]):
    for k in kits:
        for p in k.parts:
            yield p.id, k.id, p.box, p.layer
        for b in k.bought:
            if b.box is not None and b.layer not in ("shell",) and b.qty:
                yield b.id, k.id, b.box, b.layer


def check(kits: list[Kit], lo, circuits, md, runs) -> tuple[list[str], list[dict]]:
    errors: list[str] = []
    report: list[dict] = []
    room = Box(-60, -60, -20, lo.L + 60, lo.W + 60, lo.H + 70)
    interior = [(i, k, b, layer) for (i, k, b, layer) in solids(kits)
                if layer in ("furniture", "fixtures") and k not in ("K11", "K8")]
    for i, k, b, _ in interior:
        if not b.inside(room):
            errors.append(f"{i} lies outside the interior")
    # furniture vs furniture/fixtures (sweep and prune on x)
    items = sorted(interior, key=lambda t: t[2].x0)
    for a in range(len(items)):
        ia, ka, ba, _ = items[a]
        for b in range(a + 1, len(items)):
            ib, kb, bb, _ = items[b]
            if bb.x0 >= ba.x1 - 0.5:
                break
            if ka == kb and ka in ("K6", "K3", "K4", "K5", "K2"):
                continue  # parts inside one assembly are allowed to touch by construction
            if ba.overlap(bb, tol=1.0):
                errors.append(f"collision: {ia} and {ib}")
    # keep-outs vs solids of other kits
    for k in kits:
        for ko in k.keepouts:
            hits = [i for (i, kk, b, layer) in interior if b.overlap(ko.box, tol=1.0) and not i.startswith(ko.owner)
                    and kk != ko.owner]
            ok = not hits
            report.append({"id": ko.id, "rule": ko.why, "result": "pass" if ok else "FAIL",
                           "detail": "" if ok else ", ".join(hits[:4])})
            if not ok:
                errors.append(f"{ko.id} ({ko.why}) blocked by {', '.join(hits[:4])}")
    # dimensional rules
    def rule(rid: str, text: str, value: float, limit: float, ge: bool = True) -> None:
        ok = value >= limit if ge else value <= limit
        report.append({"id": rid, "rule": text, "result": "pass" if ok else "FAIL",
                       "detail": f"{value:.0f} {'>=' if ge else '<='} {limit:.0f}"})
        if not ok:
            errors.append(f"{rid}: {text} ({value:.0f} vs {limit:.0f})")

    tx0, tx1, ty0, ty1 = lo.tray
    rule("R-TRAY", "Shower tray length (mm)", tx1 - tx0, 1000)
    rule("R-WC-SIDE", "WC centreline to the shower (mm)", lo.wc_cy - lo.tray[3], 400)
    rule("R-WC-SIDE2", "WC centreline to the bathroom wall (mm)", lo.bath_y1 - lo.wc_cy, 400)
    rule("R-WC-FRONT", "Clear space in front of the WC (mm)", lo.L - WC_D - lo.bath_x0, 600)
    rule("R-BDOOR", "Bathroom door clear opening (mm)", lo.bdoor[1] - lo.bdoor[0], 600)
    rule("R-AISLE", "Walkway, worktop to the sofa end (mm)", lo.part_x0 - 620 - lo.sofa[1], AISLE_MIN)
    rule("R-BEDSIDE", "Sofa clear of the bedside table (mm)", lo.sofa[0] - lo.bedside[1], 20)
    rule("R-GALLEY", "Galley clear of the bathroom wall end (mm)", lo.bath_y1 - lo.sink[1], 30)
    rule("R-PASS", "Walk past the galley end to the wash lobby (mm)", lo.W - lo.sink[1], PASS_MIN)
    rule("R-BED", "Room beside the bed foot (mm)", lo.W - lo.bed_y1, 50)
    rule("R-HEIGHT", "Clear height (mm)", lo.H, 2250)
    rule("R-PART", "Partition clear of the old door (mm)", lo.o2[0] - (lo.part_x0 + lo.part_t), 150)
    # electrical
    for c in circuits:
        if not c.loads:
            continue
        ok1 = c.Ib <= c.In <= c.Iz
        vd = c.vdrop_pct()
        lim = 3.0 if c.id == "C1" else 5.0
        report.append({"id": f"E-{c.id}", "rule": f"{c.name}: Ib <= In <= Iz; drop <= {lim}%",
                       "result": "pass" if ok1 and vd <= lim else "FAIL",
                       "detail": f"Ib {c.Ib:.1f} A, In {c.In:.0f} A, Iz {c.Iz:.1f} A, drop {vd:.2f}%"})
        if not ok1 or vd > lim:
            errors.append(f"circuit {c.id} fails Ib/In/Iz or voltage drop")
    report.append({"id": "E-MD", "rule": "Diversified maximum demand within the 40 A main switch",
                   "result": "pass" if md["total_A"] <= 40 else "FAIL", "detail": f"{md['total_A']:.1f} A"})
    if md["total_A"] > 40:
        errors.append("maximum demand exceeds 40 A")
    # drainage falls
    need = {110: 40, 75: 40, 50: 40, 40: 40}
    for r in runs:
        if r.system in ("soil", "waste"):
            n = r.fall()
            ok = 0 < n <= need[r.dn]
            report.append({"id": f"P-{r.id}", "rule": f"DN{r.dn} {r.system} fall at least 1:{need[r.dn]}",
                           "result": "pass" if ok else "FAIL", "detail": f"steepest-needed 1:{n:.0f}"})
            if not ok:
                errors.append(f"drain {r.id} fall 1:{n:.0f} is flatter than 1:{need[r.dn]}")
    if not any(r.system == "vent" for r in runs):
        errors.append("no vent on the drainage system")
    # steps: every part in exactly one step
    for k in kits:
        stepped = [pid for s in k.steps for pid in s.adds]
        for p in k.parts:
            c = stepped.count(p.id)
            if c != 1 and k.id not in ("K0",):
                errors.append(f"{p.id} appears in {c} assembly steps")
    return errors, report
