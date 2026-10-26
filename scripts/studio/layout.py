"""Layout B (D-020): zone schedule from the envelope and the survey-driven rules.

Bed and storage wall at end A, a seating room in the middle (sofa on the back wall, a table
and two chairs), a galley along the bathroom partition, the bathroom at end B.

Frame: x from the lined face of end A (bed) to end B (bath); y from the lined back wall to
the front glass wall; z from the finished floor. All mm.
"""
from __future__ import annotations

from dataclasses import dataclass

import params as P


class LayoutError(ValueError):
    pass


@dataclass(frozen=True)
class Layout:
    L: float
    W: float
    H: float
    o1: tuple[float, float]
    o1_head: float
    o2: tuple[float, float]
    bed_x1: float
    sofa: tuple[float, float]  # x range on the back wall
    galley_x0: float  # galley carcass front; the galley runs along the partition, back wall to the door
    fridge: tuple[float, float]  # y ranges along the partition
    hob: tuple[float, float]
    sink: tuple[float, float]
    part_x0: float  # partition living face
    part_t: float
    bath_x0: float
    tray: tuple[float, float, float, float]  # x0, x1, y0, y1
    wc_cx: float
    basin: tuple[float, float, float, float]
    bdoor: tuple[float, float]  # y range of the bathroom door opening
    w1_sill: float
    w1_head: float


BED_X1 = 1640
SOFA_W = 1150  # compact two-seat sofa, bought
SEAT_PAD = 20  # least gap between the bed and the sofa
GALLEY = (550, 400, 500)  # fridge bay, hob base, sink base, from the back wall
GALLEY_D = 600
WORKTOP_D = 620
AISLE_MIN = 800  # worktop edge to the sofa
TRAYS = (1400, 1200, 1100, 1000)
PART_T = 70
LEDGE_MIN = 100
BDOOR = (1500.0, 2230.0)


def build(o1_shift: float = 0.0) -> Layout:
    """o1_shift moves the glazing end (tests run -150, 0, +150)."""
    L = P.m("int_length", P.INT_L) - 2 * P.LINING_WALL.value
    W = P.m("int_width", P.INT_W) - 2 * P.LINING_WALL.value
    H = P.m("int_height", P.INT_H) - P.LINING_CEIL.value - P.LINING_FLOOR.value
    def opening(name: str, default: P.Param) -> float:
        # the survey measures from the steel face of end A; the layout frame starts at the lining
        return P.MEASURED[name] - P.LINING_WALL.value if name in P.MEASURED else default.value

    o1 = (opening("o1_start", P.O1_X0), opening("o1_end", P.O1_X1) + o1_shift)
    o2 = (opening("o2_start", P.O2_X0), opening("o2_end", P.O2_X1))

    part_x0 = o1[1] + 30  # partition living face lands on the solid strip after the glazing
    if part_x0 + PART_T > o2[0] - 150:
        raise LayoutError(f"partition at {part_x0:.0f} runs into the old door at {o2[0]:.0f}")
    y = 0.0
    zones = []
    for w in GALLEY:
        zones.append((y, y + w))
        y += w
    if y > BDOOR[0] - 30:
        raise LayoutError(f"galley ends at {y:.0f}, into the bathroom door at {BDOOR[0]:.0f}")
    galley_x0 = part_x0 - GALLEY_D
    # the seating group is centred between the bed and the galley aisle
    mid = (BED_X1 + part_x0 - WORKTOP_D - AISLE_MIN) / 2
    sofa = (mid - SOFA_W / 2, mid + SOFA_W / 2)
    if sofa[0] < BED_X1 + SEAT_PAD:
        raise LayoutError(f"sofa at {sofa[0]:.0f} touches the bed at {BED_X1}")
    if part_x0 - WORKTOP_D - sofa[1] < AISLE_MIN:
        raise LayoutError(f"galley aisle {part_x0 - WORKTOP_D - sofa[1]:.0f} mm, under {AISLE_MIN}")
    bath_x0 = part_x0 + PART_T
    room = L - bath_x0
    tray_len = next((t for t in TRAYS if t + LEDGE_MIN <= room), None)
    if tray_len is None:
        raise LayoutError(f"bathroom {room:.0f} mm long: no tray fits")
    tray = (L - tray_len, L, 0.0, 900.0)
    basin = (L - 300, L, 1000.0, 1400.0)
    wc_cx = min((o2[0] + o2[1]) / 2, basin[0] - 400 - 8)
    wc_cx = max(wc_cx, bath_x0 + 400)
    return Layout(
        L=L, W=W, H=H, o1=o1, o1_head=P.O1_HEAD.value, o2=o2, bed_x1=BED_X1, sofa=sofa, galley_x0=galley_x0,
        fridge=zones[0], hob=zones[1], sink=zones[2], part_x0=part_x0, part_t=PART_T, bath_x0=bath_x0, tray=tray,
        wc_cx=wc_cx, basin=basin, bdoor=BDOOR, w1_sill=1150.0, w1_head=2040.0,
    )
