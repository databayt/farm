"""System 32 frameless carcasses and the one hardware family (D-015, studio-flatpack).

Fixed joints: confirmat 7x50 + two 8 mm dowels. Demountable joints: M6 connector bolt with a
10 mm barrel nut. Doors: 35 mm cup hinges on the 37 mm row. Shelves and runners: 5 mm holes
on a 32 mm pitch. Every face hole is machine- or template-drilled; edge holes use the jig.
"""
from __future__ import annotations

from model import Box, Bought, Kit, Op, Part

T18 = 18.0
T12 = 12.0
LEG = 100.0

# Hardware bags: code -> (name, unit price key)
HARDWARE = {
    "A": ("Confirmat screw 7 x 50", "confirmat"),
    "B": ("Wood dowel 8 x 35", "dowel"),
    "C": ("Connector bolt M6 x 60 + barrel nut 10 mm", "conbolt"),
    "D": ("Cup hinge 35 mm soft-close + plate", "hinge"),
    "E": ("Shelf pin 5 mm", "shelfpin"),
    "F": ("Wood screw 4 x 30", "screw4"),
    "G": ("Ball-bearing runner 450 mm (pair)", "runner"),
    "H": ("Adjustable leg 100-150 mm", "leg"),
    "J": ("Handle 128 mm centres", "handle"),
    "K": ("Castor 50 mm", "castor"),
    "L": ("Winged self-drilling screw 5.5 x 50 (38 mm battens to the steel)", "sds"),
}


def side_ops(depth: float, height: float, joints_z: list[float], shelves: bool) -> list[Op]:
    """Face holes on a carcass side (u = depth from the back, v = height from the bottom)."""
    ops: list[Op] = []
    for z in joints_z:
        for u in (37.0, depth / 2, depth - 37.0):
            ops.append(Op("drill", "A", u, z, 7.0, T18, joint="confirmat"))
        for u in (depth / 4, 3 * depth / 4):
            ops.append(Op("drill", "A", u, z, 8.0, 12.0, joint="dowel"))
    if shelves:
        v = 160.0
        while v < height - 160:
            for u in (37.0, depth - 37.0):
                ops.append(Op("drill", "A", u, v, 5.0, 12.0, joint="shelf"))
            v += 32.0
    return ops


def edge_ops(length: float) -> list[Op]:
    """Matching edge holes on a bottom/top/rail: 5 mm confirmat pilot, 8 mm dowel, both ends."""
    ops = []
    for face in ("E1", "E3"):
        for u in (37.0, length / 2, length - 37.0):
            ops.append(Op("drill", face, u, 9.0, 5.0, 50.0, joint="confirmat"))
        for u in (length / 4, 3 * length / 4):
            ops.append(Op("drill", face, u, 9.0, 8.0, 25.0, joint="dowel"))
    return ops


def hinge_ops(h: float) -> list[Op]:
    return [Op("drill", "A", 22.5, v, 35.0, 13.0, joint="hinge") for v in (100.0, h - 100.0)]


def carcass(kit: Kit, pid: str, name: str, x0: float, x1: float, y0: float, depth: float,
            z0: float, height: float, *, step: str, doors: int = 0, drawers: int = 0,
            shelves: int = 0, top: str = "rails", legs: bool = True, mat: str = "PLY18",
            back: bool = True, explode_dir: tuple[float, float, float] = (0, 1, 0)) -> list[Part]:
    """A frameless carcass occupying x0..x1, y0..y0+depth (back at y0), z0..z0+height."""
    W = x1 - x0
    parts: list[Part] = []
    n = [0]

    def add(nm: str, box: Box, ops: list[Op], edges: str = "", m: str = mat, ex=(0, 0, 0)) -> Part:
        n[0] += 1
        p = Part(f"{pid}-{n[0]:02d}", f"{name} {nm}", kit.id, m, box, step=step, edges=edges, ops=ops,
                 explode=ex)
        kit.add(p)
        parts.append(p)
        return p

    yb = y0 + (T12 if back else 0)  # carcass body starts in front of the back panel
    d = depth - (T12 if back else 0)
    jz = [T18 / 2, height - T18 / 2]
    add("side L", Box(x0, yb, z0, x0 + T18, y0 + depth, z0 + height), side_ops(d, height, jz, shelves > 0), "L1",
        ex=(-150, 0, 0))
    add("side R", Box(x1 - T18, yb, z0, x1, y0 + depth, z0 + height), side_ops(d, height, jz, shelves > 0), "L1",
        ex=(150, 0, 0))
    inner = W - 2 * T18
    add("bottom", Box(x0 + T18, yb, z0, x1 - T18, y0 + depth, z0 + T18), edge_ops(inner), "L1", ex=(0, 0, -150))
    if top == "rails":
        add("front rail", Box(x0 + T18, y0 + depth - 100, z0 + height - T18, x1 - T18, y0 + depth, z0 + height),
            edge_ops(inner), "L1", ex=(0, 0, 150))
        add("back rail", Box(x0 + T18, yb, z0 + height - T18, x1 - T18, yb + 100, z0 + height), edge_ops(inner),
            ex=(0, 0, 150))
    else:
        add("top", Box(x0 + T18, yb, z0 + height - T18, x1 - T18, y0 + depth, z0 + height), edge_ops(inner),
            "L1", ex=(0, 0, 150))
    if back:
        add("back", Box(x0, y0, z0, x1, y0 + T12, z0 + height), [], m="PLY12", ex=(0, -150, 0))
    clear = height - 2 * T18
    for i in range(shelves):
        zs = z0 + T18 + clear * (i + 1) / (shelves + 1)
        add(f"shelf {i + 1}", Box(x0 + T18 + 1, yb + 2, zs, x1 - T18 - 1, y0 + depth - 20, zs + T18), [], "L1",
            ex=(0, 200, 0))
    front_y = y0 + depth
    if doors:
        dw = (W - 3 - (doors - 1) * 3) / doors
        for i in range(doors):
            dx = x0 + 1.5 + i * (dw + 3)
            add(f"door {i + 1}", Box(dx, front_y, z0 + 2, dx + dw, front_y + T18, z0 + height - 2),
                hinge_ops(height - 4), "L2S2", ex=(0, 300, 0))
    if drawers:
        dh = (height - 3 - (drawers - 1) * 3) / drawers
        for i in range(drawers):
            dz = z0 + 1.5 + i * (dh + 3)
            add(f"drawer front {i + 1}", Box(x0 + 1.5, front_y, dz, x1 - 1.5, front_y + T18, dz + dh), [], "L2S2",
                ex=(0, 450, 0))
            bx0, bx1 = x0 + T18 + 13, x1 - T18 - 13  # 12.5 mm runner gap each side
            by0, by1 = yb + 20, front_y - 2
            bz0, bz1 = dz + 20, dz + min(dh - 40, 180)
            add(f"drawer side L {i + 1}", Box(bx0, by0, bz0, bx0 + 12, by1, bz1), [], m="PLY12", ex=(0, 450, 0))
            add(f"drawer side R {i + 1}", Box(bx1 - 12, by0, bz0, bx1, by1, bz1), [], m="PLY12", ex=(0, 450, 0))
            add(f"drawer back {i + 1}", Box(bx0 + 12, by0, bz0, bx1 - 12, by0 + 12, bz1), [], m="PLY12",
                ex=(0, 450, 0))
            add(f"drawer bottom {i + 1}", Box(bx0 + 12, by0 + 12, bz0, bx1 - 12, by1, bz0 + 12), [], m="PLY12",
                ex=(0, 450, 0))
    if legs:
        kit.buy(Bought(f"{pid}-LEGS", f"{name} adjustable legs", kit.id, "hardware", "carpentry", 4, "each", "leg",
                       step=step))
    return parts


def bag(parts: list[Part]) -> dict[str, int]:
    """Count hardware from the joints machined on a set of parts."""
    c = {"confirmat": "A", "dowel": "B", "hinge": "D", "shelf": "E", "bolt": "C"}
    out: dict[str, int] = {}
    for p in parts:
        for o in p.ops:
            if o.face in ("A", "B") and o.joint in c:
                k = c[o.joint]
                out[k] = out.get(k, 0) + (1 if o.joint != "shelf" else 0)
    if "E" not in out and any(o.joint == "shelf" for p in parts for o in p.ops):
        pass
    shelves = sum(1 for p in parts if " shelf " in f" {p.name} ")
    if shelves:
        out["E"] = 4 * shelves
    doors = sum(1 for p in parts if " door " in f" {p.name} ")
    if doors:
        out["D"] = 2 * doors
        out["J"] = out.get("J", 0) + doors
    drawers = sum(1 for p in parts if "drawer front" in p.name)
    if drawers:
        out["G"] = drawers
        out["J"] = out.get("J", 0) + drawers
    return dict(sorted(out.items()))
