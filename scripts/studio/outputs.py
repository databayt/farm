"""Write every output of the studio package from the model: SVG drawings, GLB + parts.json, DXF
cutting sheets, CSV/XLSX tables. Deterministic: no timestamps, sorted ids, fixed formatting."""
from __future__ import annotations

import csv
import datetime as dt
import io
import json
import zipfile
from pathlib import Path

import params as P
import sheets as S
from draw import FILL, Sheet, iso_draw
from joinery import HARDWARE, bag
from nest import nest
from out_glb import write as write_glb
from prices import CONTINGENCY, LABOUR, PRICES, SHARED

SECTION_KG = {"RHS 150x100x5": 18.2, "RHS 80x40x3": 5.2, "SHS 40x40x3": 3.4, "SHS 80x80x4": 9.2, "SHS 60x60x3": 5.2,
              "ledger": 5.2}


def wcsv(path: Path, header: list[str], rows: list[list]) -> None:
    with path.open("w", newline="", encoding="utf-8") as fh:
        w = csv.writer(fh, lineterminator="\n")
        w.writerow(header)
        for r in rows:
            w.writerow([f"{v:.2f}".rstrip("0").rstrip(".") if isinstance(v, float) else v for v in r])


def edge_m(p) -> float:
    code = p.edges
    if not code:
        return 0.0
    n = 0.0
    if "L2" in code:
        n += 2 * p.length
    elif "L1" in code:
        n += p.length
    if "S2" in code:
        n += 2 * p.width
    elif "S1" in code:
        n += p.width
    return n / 1000


def steel_kg(p) -> float:
    L = max(p.box.size) / 1000
    for k, v in SECTION_KG.items():
        if k in p.name or (k == "ledger" and "ledger" in p.name):
            return v * L
    if "tread" in p.name:
        return 12.0
    if "landing" in p.name:
        return 60.0
    return 6.0 * L


def all_parts(m):
    return [p for k in m["kits"] for p in k.parts]


# ------------------------------------------------------------------------------- tables
def bom(m, layouts) -> tuple[list[list], dict]:
    rows: list[list] = []

    def add(kit, cat, item, qty, unit, key, trade=""):
        if not qty:
            return
        price, label, src, note = PRICES.get(key, (0, "U", "", "no price"))
        rows.append([kit, cat, trade, item, round(qty, 2), unit, price, label, src, round(qty * price), note])

    counts: dict[str, int] = {}
    for sl in layouts:
        counts[sl.material] = counts.get(sl.material, 0) + 1
    for mat, n in sorted(counts.items()):
        add("K1-K7", "boards", f"{mat} sheet {P.SHEETS[mat][0]}x{P.SHEETS[mat][1]}x{P.SHEETS[mat][2]}", n, "sheet",
            f"sheet_{mat}", "carpentry")
    eb = sum(edge_m(p) for p in all_parts(m))
    add("K1-K7", "boards", "ABS edge band (2 mm visible, 0.8 mm hidden)", round(eb * 1.1, 1), "m", "edgeband", "carpentry")
    furn = [p for p in all_parts(m) if p.kit in ("K2", "K3", "K4", "K5", "K6", "K7")]
    hw = bag(furn)
    for k in m["kits"]:
        for st in k.steps:
            for code, n in st.hardware.items():
                if code in ("F", "L", "C", "K"):
                    hw[code] = hw.get(code, 0) + n
    for code in sorted(hw):
        name, key = HARDWARE[code]
        add("K2-K7", "hardware", f"Bag {code}: {name}", hw[code] * 1.05, "each", key, "carpentry")
    roof_steel = sum(steel_kg(p) for p in all_parts(m) if p.material == "STEEL")
    roof_timber = sum(p.box.size[0] * p.box.size[1] * p.box.size[2] / 1e9 * (0.35 if "chair" in p.name.lower() or "table" in p.name.lower() else 1)
                      for p in all_parts(m) if p.material == "TIMBER")
    roof_poly = sum(p.box.size[0] * p.box.size[1] / 1e6 for p in all_parts(m) if p.material == "POLY")
    roof_cable = sum(max(p.box.size[0], p.box.size[1]) / 1000 * 10 for p in all_parts(m) if p.material == "CABLE")
    add("K11", "roof kit", "Fabricated steel: beams, joists, posts, rails, treads (painted)", roof_steel, "kg", "steel_kg", "welding")
    add("K11", "roof kit", "Treated hardwood: deck boards, top rail, chairs, side table", roof_timber, "m3", "timber_m3",
        "carpentry")
    add("K11", "roof kit", "Tinted multiwall polycarbonate 10 mm (front deck canopy)", roof_poly * 1.1, "m2", "poly_m2",
        "welding")
    add("K11", "roof kit", "Guardrail cable infill: 4 mm stainless, 10 runs, with tensioners", roof_cable, "m", "cable_m",
        "welding")
    add("K11", "roof kit", "Stair stringers, handrails and footings", 1, "set", "stairframe", "welding")
    for k in m["kits"]:
        for b in k.bought:
            if b.category in ("existing",) or not b.qty or not b.price:
                continue
            if b.price in ("batten", "stud") and b.unit == "each":
                continue
            add(k.id, b.category, b.name, b.qty, b.unit, b.price, b.trade)
    nb = sum(1 for k in m["kits"] for b in k.bought if b.price == "batten")
    ns = sum(1 for k in m["kits"] for b in k.bought if b.price == "stud")
    add("K1", "timber", "Battens 38 x 50 treated, 2.4 m", nb * 1.1, "each", "batten", "carpentry")
    add("K2", "timber", "Studs 40 x 40 treated, 2.4 m", ns * 1.1, "each", "stud", "carpentry")
    for name, rwf, label in LABOUR:
        rows.append(["labour", "labour", "", name, 1, "lot", rwf, label, "AS-21", rwf, ""])
    unit = sum(r[9] for r in rows)
    shared = sum(r for _, r, _ in SHARED)
    verified = sum(r[9] for r in rows if r[7] == "V")
    tot = {"unit_materials_labour": unit, "unit_with_contingency": unit * (1 + CONTINGENCY), "shared_site": shared,
           "shared_with_contingency": shared * (1 + CONTINGENCY),
           "three_units_total": (3 * unit + shared) * (1 + CONTINGENCY), "verified_share": verified / unit if unit else 0,
           "usd_rate": 1475.91}
    return rows, tot


def write_tables(m, out: Path, layouts) -> dict:
    d = out / "data"
    parts = sorted(all_parts(m), key=lambda p: p.id)
    wcsv(d / "cut-list.csv", ["id", "kit", "name", "material", "length_mm", "width_mm", "thickness_mm", "edges",
                              "edge_band_m", "face_ops", "edge_ops", "step"],
         [[p.id, p.kit, p.name, p.material, round(p.length), round(p.width), round(p.t), p.edges, round(edge_m(p), 2),
           sum(1 for o in p.ops if o.cnc), sum(1 for o in p.ops if not o.cnc), p.step]
          for p in parts if p.sheet and p.material in P.SHEETS])
    wcsv(d / "steel-list.csv", ["id", "name", "material", "length_mm", "kg_or_m3", "step"],
         [[p.id, p.name, p.material, round(max(p.box.size)),
           round(steel_kg(p), 1) if p.material == "STEEL" else round(p.box.size[0] * p.box.size[1] * p.box.size[2] / 1e9, 3),
           p.step] for p in parts if not p.sheet])
    rows, tot = bom(m, layouts)
    wcsv(d / "bom.csv", ["kit", "category", "trade", "item", "qty_per_unit", "unit", "unit_price_rwf", "label", "source",
                         "total_per_unit_rwf", "note"], rows)
    cats: dict[str, float] = {}
    for r in rows:
        cats[r[1]] = cats.get(r[1], 0) + r[9]
    summary = [[c, round(v), round(3 * v)] for c, v in sorted(cats.items(), key=lambda t: -t[1])]
    summary += [["shared site works (all three)", "", round(tot["shared_site"])],
                [f"contingency {CONTINGENCY * 100:.0f} %", round(tot["unit_materials_labour"] * CONTINGENCY),
                 round((3 * tot["unit_materials_labour"] + tot["shared_site"]) * CONTINGENCY)],
                ["TOTAL", round(tot["unit_with_contingency"]), round(tot["three_units_total"])]]
    wcsv(d / "bom-summary.csv", ["category", "per_unit_rwf", "three_units_rwf"], summary)
    wcsv(d / "shared-works.csv", ["item", "rwf", "label"], [[n, round(v), lab] for n, v, lab in SHARED])
    hw = [[code, HARDWARE[code][0]] for code in sorted(HARDWARE)]
    wcsv(d / "hardware.csv", ["bag", "item"], hw)
    wcsv(d / "checks.csv", ["id", "rule", "result", "detail"], [[r["id"], r["rule"], r["result"], r["detail"]] for r in m["checks"]])
    wcsv(d / "circuits.csv", ["circuit", "serves", "device", "cable_mm2", "design_A", "derated_Iz_A", "run_m", "drop_pct", "points"],
         [[c.id, c.name, c.breaker, c.cable, round(c.Ib, 1) if c.loads else "", round(c.Iz, 1),
           c.length_m if c.loads else "", round(c.vdrop_pct(), 2) if c.loads else "", " ".join(c.loads)] for c in m["circuits"]])
    wcsv(d / "points.csv", ["point", "kind", "circuit", "description", "x_mm", "y_mm", "z_mm", "watts"],
         [[p.id, p.kind, p.circuit, p.label, round(p.x), round(p.y), round(p.z), round(p.watts)] for p in m["points"]])
    wcsv(d / "demand.csv", ["item", "amps"], [[k, round(v, 1)] for k, v in m["md"].items()] +
         [["feeder_mm2", m["feeder"]["size_mm2"]], ["feeder_drop_pct", round(m["feeder"]["drop_pct"], 2)]])
    wcsv(d / "pipes.csv", ["run", "system", "dn", "length_m", "fall", "note"],
         [[r.id, r.system, r.dn, round(r.length / 1000, 1), f"1:{r.fall():.0f}" if r.system in ("soil", "waste") else "",
           r.note] for r in m["runs"]])
    wcsv(d / "site-water.csv", ["item", "value"], [[k, v] for k, v in m["site"].items()])
    wcsv(d / "steps.csv", ["step", "kit", "title", "parts", "hardware", "people", "note"],
         [[s.id, s.kit, s.title, len(s.adds), " ".join(f"{k}x{v}" for k, v in s.hardware.items() if v), s.persons, s.note]
          for s in sorted((s for k in m["kits"] for s in k.steps), key=lambda s: s.id)])
    wcsv(d / "nesting.csv", ["material", "sheet", "parts", "utilisation_pct"],
         [[sl.material, sl.index, len(sl.placed), round(sl.utilisation * 100, 1)] for sl in layouts])
    wcsv(d / "kits.csv", ["kit", "name", "trade", "made_where", "parts", "bought_lines"],
         [[k.id, k.name, k.trade, k.where, len(k.parts), sum(1 for b in k.bought if b.qty)] for k in m["kits"] if k.id != "K0"])
    write_xlsx(d / "bom.xlsx", rows, summary, tot)
    tot["sheets"] = {mat: sum(1 for sl in layouts if sl.material == mat) for mat in sorted({sl.material for sl in layouts})}
    (d / "totals.json").write_text(json.dumps(tot, indent=1, sort_keys=True) + "\n")
    return tot


def write_xlsx(path: Path, rows, summary, tot) -> None:
    from openpyxl import Workbook
    wb = Workbook()
    fixed = dt.datetime(2026, 10, 26)
    wb.properties.created = fixed
    wb.properties.modified = fixed
    wb.properties.creator = "farm scripts/studio"
    ws = wb.active
    ws.title = "Summary"
    ws.append(["Container studios - bill of materials", f"rev {P.REV} {P.REV_DATE}", P.STATUS])
    ws.append(["Prices labelled A are placeholders (AS-21): three quotes per line before buying."])
    ws.append([])
    ws.append(["category", "per unit RWF", "three units RWF"])
    for r in summary:
        ws.append(r)
    ws.append([])
    ws.append(["USD at BNR 1,475.91 (2026-10-23, STU-36)", "", round(tot["three_units_total"] / 1475.91)])
    ws2 = wb.create_sheet("BOM per unit")
    ws2.append(["kit", "category", "trade", "item", "qty", "unit", "unit price", "label", "source", "total", "note"])
    for r in rows:
        ws2.append(r)
    buf = io.BytesIO()
    wb.save(buf)
    src = zipfile.ZipFile(io.BytesIO(buf.getvalue()))
    with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED) as z:
        for name in sorted(src.namelist()):
            info = zipfile.ZipInfo(name, date_time=(1980, 1, 1, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            z.writestr(info, src.read(name))


# ------------------------------------------------------------------------------- DXF
def write_dxf(out: Path, layouts) -> None:
    import ezdxf
    ezdxf.options.write_fixed_meta_data_for_testing = True
    for sl in layouts:
        doc = ezdxf.new("R2000")
        doc.units = 4  # mm
        msp = doc.modelspace()
        msp.add_lwpolyline([(0, 0), (sl.L, 0), (sl.L, sl.W), (0, sl.W)], close=True, dxfattribs={"layer": "SHEET"})
        for pl in sl.placed:
            p = pl.part
            x0, y0 = pl.x, pl.y
            msp.add_lwpolyline([(x0, y0), (x0 + pl.l, y0), (x0 + pl.l, y0 + pl.w), (x0, y0 + pl.w)], close=True,
                               dxfattribs={"layer": "CUT"})
            msp.add_text(p.id, height=min(25, pl.w / 4), dxfattribs={"layer": "LABEL"}).set_placement(
                (x0 + pl.l / 2, y0 + pl.w / 2), align=ezdxf.enums.TextEntityAlignment.MIDDLE_CENTER)
            for o in p.ops:
                if not o.cnc:
                    continue
                u, v = (o.v, o.u) if not pl.swapped else (o.u, o.v)
                if p.w >= p.h:  # first in-plane axis is the long one -> along the sheet
                    u, v = o.u, o.v
                else:
                    u, v = o.v, o.u
                layer = o.layer + ("_FACEB" if o.face == "B" else "")
                if o.kind == "cutout":
                    msp.add_lwpolyline([(x0 + u, y0 + v), (x0 + u + (o.w if p.w >= p.h else o.h), y0 + v),
                                        (x0 + u + (o.w if p.w >= p.h else o.h), y0 + v + (o.h if p.w >= p.h else o.w)),
                                        (x0 + u, y0 + v + (o.h if p.w >= p.h else o.w))], close=True,
                                       dxfattribs={"layer": layer})
                else:
                    msp.add_circle((x0 + u, y0 + v), o.dia / 2, dxfattribs={"layer": layer})
        doc.saveas(out / "cnc" / f"{sl.material}-sheet-{sl.index:02d}.dxf")


# ------------------------------------------------------------------------------- model
def write_model(m, out: Path) -> None:
    kitname = {k.id: k.name for k in m["kits"]}
    steps = {s.id: s.title for k in m["kits"] for s in k.steps}
    nodes, meta = [], []
    for k in m["kits"]:
        for p in k.parts:
            b = p.box
            nodes.append({"id": p.id, "mat": p.material, "box": (b.x0, b.y0, b.z0, b.x1, b.y1, b.z1),
                          "extras": {"kit": k.id, "layer": p.layer, "step": int(p.step[1:]) if p.step else 0,
                                     "explode": [round(p.explode[0] / 1000, 3), round(p.explode[2] / 1000, 3),
                                                 round(p.explode[1] / 1000, 3)]}})
            meta.append({"id": p.id, "name": p.name, "kit": k.id, "kitName": kitname[k.id], "layer": p.layer,
                         "material": p.material, "size": [round(p.length), round(p.width), round(p.t)],
                         "step": p.step, "stepTitle": steps.get(p.step, "")})
        for bt in k.bought:
            if bt.box is None:
                continue
            b = bt.box
            nodes.append({"id": bt.id, "mat": bt.color or "white", "box": (b.x0, b.y0, b.z0, b.x1, b.y1, b.z1),
                          "extras": {"kit": k.id, "layer": bt.layer, "step": int(bt.step[1:]) if bt.step else 0,
                                     "explode": [0, 0, 0]}})
            meta.append({"id": bt.id, "name": bt.name, "kit": k.id, "kitName": kitname[k.id], "layer": bt.layer,
                         "material": bt.color or "bought", "size": [round(v) for v in b.size], "step": bt.step,
                         "stepTitle": steps.get(bt.step, "")})
    nodes.sort(key=lambda n: n["id"])
    meta.sort(key=lambda n: n["id"])
    write_glb(out / "model" / "studio.glb", nodes)
    layers = sorted({n["layer"] for n in meta})
    (out / "model" / "parts.json").write_text(json.dumps({"rev": P.REV, "status": P.STATUS, "layers": layers,
                                                          "steps": dict(sorted(steps.items())), "parts": meta},
                                                         separators=(",", ":"), sort_keys=True) + "\n")
    # poster: the furnished unit without the front wall and roof
    sh = Sheet("", "")
    lo = m["lo"]
    its = []
    for (b, fl, nm, i, k, layer) in S.items(m, layers=["furniture", "fixtures", "envelope", "shell"], exclude_layers=()):
        if i.startswith(("K0-FRONT", "K0-ROOF", "K0-SLIDER", "K0-ENDB", "K1-BAT", "K1-EPS", "K2-CB-ENDB", "K2-CB-FRONT")) or b.z0 >= lo.H - 1:
            continue
        if (layer == "envelope" and b.y0 >= lo.W - 1) or (i.startswith("K7-") and b.y1 >= lo.W - 1):
            continue
        its.append((b, fl, "normal", ""))
    iso_draw(sh, its, 210, 150, (380, 250), max_scale=0.07)
    svg = sh.svg()
    svg = svg[:svg.index("<rect x=\"10\"")] + "".join(sh.body) + "</svg>\n"
    (out / "model" / "studio-poster.svg").write_text(svg)


# ------------------------------------------------------------------------------- drawings
def write_drawings(m, out: Path, layouts) -> list[tuple[str, str, str]]:
    lo = m["lo"]
    sheets: list[Sheet] = [S.a101_existing(m), S.a102_options(m), S.a103_plan(m), S.a201_elev(m), S.a202_ends(m),
                           S.a401_details(m), S.s101_roof(m), S.e101_layout(m), S.e201_sld(m), S.e202_circuits(m),
                           S.p101_plan(m), S.p201_iso(m), S.p301_site(m)]
    for i, kid in enumerate(("K1", "K2", "K3", "K4", "K5", "K6", "K7", "K11")):
        sheets.append(S.j_kit(m, kid, f"J-{101 + i}"))
    for i in range(0, len(layouts), 4):
        sheets.append(S.c_cutting(layouts, i, f"C-{101 + i // 4}"))
    index = [(s.number, s.title) for s in sheets]
    cover = S.a001_cover(m, [("A-001", "Cover and drawing index")] + index)
    sheets.insert(0, cover)
    steps = sorted(((s, k) for k in m["kits"] for s in k.steps), key=lambda t: t[0].id)
    done: set[str] = set()
    for st, k in steps:
        sheets.append(S.step_sheet(m, st, k, done))
        done |= set(st.adds)
    sheets.append(S.template_sheet())
    files = []
    for s in sheets:
        fn = f"{s.number.lower()}.svg"
        (out / "drawings" / fn).write_text(s.svg())
        files.append((s.number, s.title, fn))
    wcsv(out / "data" / "drawings.csv", ["number", "title", "file"], [list(f) for f in files])
    (out / "render" / "plan.svg").write_text(S.plan_bw(m))
    (out / "render" / "plan.json").write_text(json.dumps(S.plan_facts(m), indent=1, ensure_ascii=False) + "\n")
    _ = lo
    return files


def write(m, out: Path) -> None:
    layouts = nest(all_parts(m))
    m["layouts"] = layouts
    write_tables(m, out, layouts)
    write_dxf(out, layouts)
    write_model(m, out)
    write_drawings(m, out, layouts)
