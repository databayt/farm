"""The bed (kit K4) piece by piece, for the /en/studio Bed section and render/room.html?bed=.

Nests the bed's own parts on their own sheets (as if one bed were made alone) and writes
public/designs/studio/render/bed/parts.json: every piece with its box, holes, cut-outs, edge
banding, the sheet it is cut from and the strip and crosscut that free it, plus the hardware,
and one cutting diagram per sheet (sheet-<material>-<n>.svg, monochrome like the drawing set).

    uv run --with-requirements scripts/studio/requirements.txt python scripts/studio/render/bed_parts.py
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT / "scripts" / "studio"))

import params as P  # noqa: E402
from kits import all_kits  # noqa: E402
from layout import build as build_layout  # noqa: E402
from joinery import HARDWARE  # noqa: E402
from nest import nest  # noqa: E402
from prices import PRICES  # noqa: E402

OUT = ROOT / "public" / "designs" / "studio" / "render" / "bed"
EDGES = {"": "none", "L1": "one long edge", "L2": "both long edges", "L2S2": "all four edges"}
USE = {"C": "joins every rail to its neighbour", "K": "four under each storage box",
       "F": "two at each slat end and two over the spine; the ledgers to the rails"}


def main() -> None:
    lo = build_layout(0.0)
    bed = next(k for k in all_kits(lo) if k.id == "K4")
    sheets = nest(bed.parts)
    where = {pl.part.id: (sl, pl) for sl in sheets for pl in sl.placed}
    OUT.mkdir(parents=True, exist_ok=True)

    parts = []
    for p in bed.parts:
        sl, pl = where[p.id]
        holes, cutouts = [], []
        for op in p.ops:
            x, y, z = p.world(op)
            if op.kind == "drill":
                holes.append({"at": [x, y, z], "dia": op.dia, "joint": op.joint})
            elif op.kind == "cutout":
                cutouts.append({"at": [x, y, z], "w": op.w, "h": op.h, "joint": op.joint})
        b = p.box
        parts.append({
            "id": p.id,
            "name": p.name,
            # identical pieces share a type: "Storage box 2 side 1" is a "Storage box side"
            "type": re.sub(r" \d+", "", p.name),
            "material": p.material,
            "size": [round(p.length), round(p.width), round(p.t)],
            "box": [b.x0, b.y0, b.z0, b.x1, b.y1, b.z1],
            "taxis": p.taxis,
            "axes": list(p.axes),
            "explode": list(p.explode),
            "edges": EDGES.get(p.edges, p.edges),
            "edgeM": round(sum(int(n) * (p.length if c == "L" else p.width)
                               for c, n in re.findall(r"([LS])(\d)", p.edges)) / 1000, 2),
            "holes": holes,
            "cutouts": cutouts,
            "sheet": {"material": sl.material, "index": sl.index, "of": sum(s.material == sl.material for s in sheets),
                      "x": pl.x, "y": pl.y, "l": pl.l, "w": pl.w},
        })

    sheet_list = []
    for sl in sheets:
        name = f"sheet-{sl.material}-{sl.index}.svg"
        (OUT / name).write_text(svg(sl))
        sheet_list.append({"material": sl.material, "index": sl.index, "size": [sl.L, sl.W, P.SHEETS[sl.material][2]],
                           "file": name, "parts": [pl.part.id for pl in sl.placed],
                           "utilisation": round(sl.utilisation * 100, 1)})

    data = {"kit": "K4", "name": bed.name, "kerf": P.KERF, "trim": P.TRIM, "parts": parts, "sheets": sheet_list,
            "hardware": [{"bag": k, "item": HARDWARE[k][0], "qty": q, "use": USE.get(k, ""),
                          "price": PRICES[HARDWARE[k][1]][0]} for st in bed.steps for k, q in st.hardware.items()],
            "prices": {"PLY18": PRICES["sheet_PLY18"][0], "PLY12": PRICES["sheet_PLY12"][0], "edgeband": PRICES["edgeband"][0]}}
    (OUT / "parts.json").write_text(json.dumps(data, indent=1))
    print(f"{len(parts)} parts on {len(sheets)} sheets -> {OUT.relative_to(ROOT)}")


def svg(sl) -> str:
    """A cutting diagram: the sheet, each piece in its strip, its id and size; black on transparent."""
    s = 0.4  # px per mm
    W, H = sl.L * s, sl.W * s
    out = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 {W + 4:.0f} {H + 4:.0f}" '
           f'font-family="ui-sans-serif, system-ui, sans-serif" fill="none" stroke="#111">',
           f'<rect width="{W:.1f}" height="{H:.1f}" stroke-width="1.5"/>']
    for pl in sl.placed:
        x, y, l, w = pl.x * s, pl.y * s, pl.l * s, pl.w * s
        out.append(f'<rect x="{x:.1f}" y="{y:.1f}" width="{l:.1f}" height="{w:.1f}" fill="#111" fill-opacity="0.06"/>')
        fs = max(8, min(16, w * 0.32, l * 0.09))
        for o in pl.part.ops:  # holes and cut-outs, laid out as outputs.py lays them on the DXF
            if not o.cnc:
                continue
            along = pl.part.w >= pl.part.h
            u, v = (o.u, o.v) if along else (o.v, o.u)
            if o.kind == "cutout":
                cw, ch = (o.w, o.h) if along else (o.h, o.w)
                out.append(f'<rect x="{x + u * s:.1f}" y="{y + v * s:.1f}" width="{cw * s:.1f}" height="{ch * s:.1f}" '
                           f'stroke-width="0.8"/>')
            else:
                out.append(f'<circle cx="{x + u * s:.1f}" cy="{y + v * s:.1f}" r="{o.dia * s / 2:.1f}" stroke-width="0.8"/>')
        out.append(f'<text x="{x + l / 2:.1f}" y="{y + w / 2:.1f}" fill="#111" stroke="none" font-size="{fs:.1f}" '
                   f'text-anchor="middle" dominant-baseline="middle">{pl.part.id} · {pl.l:.0f} × {pl.w:.0f}</text>')
    out.append("</svg>")
    return "\n".join(out)


if __name__ == "__main__":
    main()
