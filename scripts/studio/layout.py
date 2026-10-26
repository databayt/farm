"""Layout B (D-020): zone schedule from the envelope and the survey-driven rules.

Bed and storage wall at end A, a seating room in the middle (sofa on the back wall, a table
and two chairs), a galley along the bathroom partition. At end B the shower, the WC and the
basin stand in one row against the end wall: shower and WC behind a door, the basin
outside it in a small wash lobby under the W1 window. The bathroom is only as long as the WC
and its front zone need, which leaves more of the container to the room.

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
    bath_y1: float  # cross wall between the bathroom (shower + WC) and the wash lobby
    cross_t: float
    tray: tuple[float, float, float, float]  # x0, x1, y0, y1
    wc_cy: float  # WC centreline along the end wall
    basin: tuple[float, float, float, float]  # in the wash lobby, outside the bathroom door
    bdoor: tuple[float, float]  # x range of the door opening in the cross wall (hinged at bdoor[0])
    w1_sill: float
    w1_head: float


BED_X1 = 1640
SOFA_W = 1300  # low two-seat sofa, bought
SOFA_D = 750
SOFA_H = 700
SEAT_PAD = 20  # least gap between the bed and the sofa
GALLEY = (550, 400, 500)  # fridge bay, hob base, sink base, from the back wall
GALLEY_D = 600
WORKTOP_D = 620
AISLE_MIN = 800  # worktop edge to the sofa
TRAYS = (1400, 1200, 1100, 1000)
PART_T = 70
LEDGE_MIN = 100
WC_SIDE = 400  # WC centreline to any side obstruction
WC_D = 550  # short-projection close-coupled WC
BDOOR_W = 600  # bathroom door, opening into the bathroom
BATH_L = WC_D + 600  # the bathroom is as short as the WC and its 600 mm front zone allow


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

    # the bathroom is sized by the WC, not by the glazing: the partition only has to land on the
    # solid strip after the glazing, which it does across the whole survey band
    part_x0 = L - BATH_L - PART_T
    if part_x0 < o1[1] + 30:
        raise LayoutError(f"partition at {part_x0:.0f} would stand in front of the glazing ending at {o1[1]:.0f}")
    if part_x0 + PART_T > o2[0] - 150:
        raise LayoutError(f"partition at {part_x0:.0f} runs into the old door at {o2[0]:.0f}")
    y = 0.0
    zones = []
    for w in GALLEY:
        zones.append((y, y + w))
        y += w
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
    # one row against end wall B: shower, WC, then (past the cross wall) the basin
    wc_cy = tray[3] + WC_SIDE
    bath_y1 = wc_cy + WC_SIDE
    basin = (L - 300, L, bath_y1 + PART_T + 50, bath_y1 + PART_T + 450)
    if basin[3] > W - 20:
        raise LayoutError(f"basin ends at {basin[3]:.0f}, past the front wall at {W:.0f}")
    if y > bath_y1 - 30:
        raise LayoutError(f"galley ends at {y:.0f}, past the bathroom wall at {bath_y1:.0f}")
    bdoor = (bath_x0, bath_x0 + BDOOR_W)
    return Layout(
        L=L, W=W, H=H, o1=o1, o1_head=P.O1_HEAD.value, o2=o2, bed_x1=BED_X1, sofa=sofa, galley_x0=galley_x0,
        fridge=zones[0], hob=zones[1], sink=zones[2], part_x0=part_x0, part_t=PART_T, bath_x0=bath_x0,
        bath_y1=bath_y1, cross_t=PART_T, tray=tray, wc_cy=wc_cy, basin=basin, bdoor=bdoor, w1_sill=1150.0,
        w1_head=2040.0,
    )
