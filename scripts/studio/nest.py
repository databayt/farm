"""Two-stage guillotine nesting: rip strips along the sheet, then crosscut parts in each strip.
Every layout can be cut on a panel saw (no CNC needed) and the same layout feeds the DXF."""
from __future__ import annotations

from dataclasses import dataclass, field

import params as P
from model import Part


@dataclass
class Placed:
    part: Part
    x: float
    y: float
    l: float  # along the sheet length
    w: float  # across the sheet
    swapped: bool  # True when the part's first in-plane axis runs across the sheet


@dataclass
class Strip:
    y: float
    width: float
    used: float = 0.0


@dataclass
class SheetLayout:
    material: str
    index: int
    L: float
    W: float
    placed: list[Placed] = field(default_factory=list)
    strips: list[Strip] = field(default_factory=list)

    @property
    def free_y(self) -> float:
        return P.TRIM + sum(s.width + P.KERF for s in self.strips)

    @property
    def utilisation(self) -> float:
        return sum(p.l * p.w for p in self.placed) / (self.L * self.W)


def nest(parts: list[Part]) -> list[SheetLayout]:
    sheets: list[SheetLayout] = []
    bymat: dict[str, list[Part]] = {}
    for p in parts:
        if p.sheet and p.material in P.SHEETS:
            bymat.setdefault(p.material, []).append(p)
    for mat in sorted(bymat):
        L, W, _ = P.SHEETS[mat]
        uL, uW = L - 2 * P.TRIM, W - 2 * P.TRIM
        mine: list[SheetLayout] = []
        todo = sorted(bymat[mat], key=lambda p: (-p.width, -p.length, p.id))
        for p in todo:
            l, w = p.length, p.width
            if l > uL + 0.01 or w > uW + 0.01:
                raise ValueError(f"{p.id} ({l:.0f} x {w:.0f}) does not fit a {mat} sheet")
            swapped = p.w < p.h  # first in-plane axis is the short one -> it runs across the sheet
            done = False
            for sl in mine:
                for st in sl.strips:
                    if w <= st.width + 0.01 and st.used + l + (P.KERF if st.used else 0) <= uL + 0.01:
                        x = P.TRIM + st.used + (P.KERF if st.used else 0)
                        sl.placed.append(Placed(p, x, st.y, l, w, swapped))
                        st.used = x - P.TRIM + l
                        done = True
                        break
                if done:
                    break
                if sl.free_y + w <= W - P.TRIM + 0.01:
                    st = Strip(sl.free_y, w, l)
                    sl.strips.append(st)
                    sl.placed.append(Placed(p, P.TRIM, st.y, l, w, swapped))
                    done = True
                    break
            if not done:
                sl = SheetLayout(mat, len(mine) + 1, L, W)
                st = Strip(P.TRIM, w, l)
                sl.strips.append(st)
                sl.placed.append(Placed(p, P.TRIM, P.TRIM, l, w, swapped))
                mine.append(sl)
        sheets += mine
    return sheets
