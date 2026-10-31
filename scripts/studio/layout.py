"""Layout B (D-020): zone schedule from the envelope and the survey-driven rules.

A MALM-style bed on the back wall at end A with two storage boxes and a bedside table, a seating
room (sofa on the back wall, a low table and two chairs), a galley along the bathroom partition. At end B the shower and
the WC stand in one row against the end wall behind a sliding door; hands are washed at the galley sink, so there is
no basin, and the door's leaf parks open on the cross wall's lobby face, where the basin stood. The bathroom is only as long as the
WC and its front zone need, which leaves more of the container to the room.

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
    bed_y0: float  # the bed stands on the back wall behind a thin MALM-style headboard
    bed_y1: float
    bedside: tuple[float, float, float]  # bedside table x0, x1, depth, beside the head
    drawers: tuple[tuple[float, float], ...]  # y ranges of the two storage boxes, room side
    sofa: tuple[float, float]  # x range on the back wall
    seat_cx: float  # centre of the table and the two chairs
    galley_x0: float  # galley carcass front; the galley runs along the partition, back wall to the door
    fridge: tuple[float, float]  # y ranges along the partition
    hob: tuple[float, float]
    sink: tuple[float, float]
    part_x0: float  # partition living face
    part_t: float
    bath_x0: float
    bath_y1: float  # cross wall between the bathroom (shower + WC) and the lobby
    cross_t: float
    wall_b: float  # finished bathroom end wall: end B built out over the concealed WC cistern
    tray: tuple[float, float, float, float]  # x0, x1, y0, y1
    wc_cy: float  # WC centreline along the end wall
    bdoor: tuple[float, float]  # x range of the door opening in the cross wall
    bleaf: tuple[float, float]  # x range of the sliding leaf parked open on the lobby face, towards end B
    w1_sill: float
    w1_head: float


BED_X1 = 1640
BED_Y0 = 18  # MALM-style headboard panel, straight on the back wall
BED_L = 2020
BEDSIDE = 340  # square bedside table with the reading lamp, beside the head
DRAWER_D = 600  # two storage boxes on castors under the room side of the bed
DRAWER_PULL = 620
SOFA_W = 1300  # low two-seat sofa, bought
SOFA_D = 750
SOFA_H = 700
SEAT_PAD = 20  # least gap between the bedside table and the sofa
TABLE_W, TABLE_D, TABLE_H = 860, 500, 550  # low, wide table between the sofa and the chairs
CHAIR_W, CHAIR_GAP = 400, 40
GALLEY = (550, 600, 450)  # fridge bay, hob base (a wide two-zone hob, the founder's photo), sink base
GALLEY_D = 600
WORKTOP_D = 620
AISLE_MIN = 650  # worktop edge to the sofa end: one cook (founder's choice, keeping the 1.3 m sofa)
PASS_MIN = 600  # walk past the galley end into the lobby (about 650 with the wide hob, founder's choice)
TRAYS = (1400, 1200, 1100, 1000)
PART_T = 70
LEDGE_MIN = 100
WC_SIDE = 400  # WC centreline to any side obstruction
WC_D = 550  # wall-hung WC: 30 mm wall build-out over the concealed cistern + a 520 mm pan
END_B_OUT = 30
WC_PAN = WC_D - END_B_OUT
BDOOR_W = 570  # bathroom door opening: a surface slider whose leaf must park on the 1.15 m cross wall
JAMB_T = 18
SLIDE_LAP = 20  # the leaf laps each jamb by this much when closed
SLIDE_STOP = 20  # least room left at end B for the track's end stop
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
    # bed on the back wall, its bedside table beside the head, then the sofa on the back wall
    bed_y1 = BED_Y0 + BED_L
    bedside = (BED_X1, BED_X1 + BEDSIDE, BEDSIDE)
    sofa = (bedside[1] + SEAT_PAD, bedside[1] + SEAT_PAD + SOFA_W)
    if part_x0 - WORKTOP_D - sofa[1] < AISLE_MIN:
        raise LayoutError(f"walkway at the sofa end {part_x0 - WORKTOP_D - sofa[1]:.0f} mm, under {AISLE_MIN}")
    # the storage boxes start past the sofa's depth; the table and chairs stand clear of their pull-out
    d0, d1 = SOFA_D + 40, bed_y1 - 18
    mid = (d0 + d1) / 2
    drawers = ((d0, mid - 9), (mid + 9, d1))
    seat_cx = BED_X1 + DRAWER_PULL + 20 + CHAIR_W + CHAIR_GAP / 2
    bath_x0 = part_x0 + PART_T
    wall_b = L - END_B_OUT
    room = wall_b - bath_x0
    tray_len = next((t for t in TRAYS if t + LEDGE_MIN <= room), None)
    if tray_len is None:
        raise LayoutError(f"bathroom {room:.0f} mm long: no tray fits")
    tray = (wall_b - tray_len, wall_b, 0.0, 900.0)
    # one row against end wall B: shower, then WC; hands are washed at the galley sink
    wc_cy = tray[3] + WC_SIDE
    bath_y1 = wc_cy + WC_SIDE
    if y > bath_y1 - 30:
        raise LayoutError(f"galley ends at {y:.0f}, past the bathroom wall at {bath_y1:.0f}")
    bdoor = (bath_x0, bath_x0 + BDOOR_W)
    leaf_w = BDOOR_W - 2 * JAMB_T + 2 * SLIDE_LAP
    bleaf = (bdoor[1] - JAMB_T, bdoor[1] - JAMB_T + leaf_w)  # open: its edge flush with the latch jamb
    if bleaf[1] > L - SLIDE_STOP:
        raise LayoutError(f"the open leaf ends at {bleaf[1]:.0f}, into end wall B at {L:.0f}")
    return Layout(
        L=L, W=W, H=H, o1=o1, o1_head=P.O1_HEAD.value, o2=o2, bed_x1=BED_X1, bed_y0=BED_Y0, bed_y1=bed_y1,
        bedside=bedside, drawers=drawers, sofa=sofa, seat_cx=seat_cx, galley_x0=galley_x0,
        fridge=zones[0], hob=zones[1], sink=zones[2], part_x0=part_x0, part_t=PART_T, bath_x0=bath_x0,
        bath_y1=bath_y1, cross_t=PART_T, wall_b=wall_b, tray=tray, wc_cy=wc_cy, bdoor=bdoor, bleaf=bleaf,
        w1_sill=1150.0,
        w1_head=2040.0,
    )
