"""Layout B (D-020): zone schedule from the envelope and the survey-driven rules.

A MALM-style bed on the back wall at end A with two storage boxes and a bedside table, a seating
room (sofa on the back wall, a low table and two chairs), a galley along the bathroom partition. At end B a bathroom
1 m deep across the full width (D-067): the shower at the back wall, the WC on end wall B beyond it, and the way in
through the partition past the galley's end, where a sliding door runs inside the bathroom along the partition and
parks towards the back wall. Hands are washed at the galley sink, so there is no basin; W1 lights the bathroom.

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
    wall_b: float  # finished bathroom end wall: end B built out over the concealed WC cistern
    tray: tuple[float, float, float, float]  # x0, x1, y0, y1
    wc_cy: float  # WC centreline along the end wall
    bdoor: tuple[float, float]  # y range of the door opening in the partition, past the galley's end
    bleaf: tuple[float, float]  # y range of the sliding leaf parked open on the partition's bath face
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
PASS_MIN = 600  # walk past the galley end to the bathroom door (about 650 with the wide hob, founder's choice)
TRAYS = (1400, 1200, 1100, 1000)
PART_T = 70
BATH_IN = 1000  # the bathroom's clear depth, partition to the finished end wall (founder, D-067)
WC_SIDE = 400  # WC centreline to any side obstruction
WC_D = 550  # wall-hung WC: 30 mm wall build-out over the concealed cistern + a 520 mm pan
END_B_OUT = 30
WC_PAN = WC_D - END_B_OUT
BDOOR_W = 600  # bathroom door opening in the partition, from the front wall back
JAMB_T = 18
SLIDE_LAP = 20  # the leaf laps the back jamb by this much when closed; at the front it stops on the jamb
SCREEN_ENTRY = 480  # open side of the shower by the partition, in line with the WC's front


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
    part_x0 = L - END_B_OUT - BATH_IN - PART_T
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
    tray_len = next((t for t in TRAYS if t <= room), None)
    if tray_len is None:
        raise LayoutError(f"bathroom {room:.0f} mm deep: no tray fits")
    tray = (wall_b - tray_len, wall_b, 0.0, 900.0)
    # the shower at the back wall, the WC on end wall B beyond it; the entry space in front, by the door
    wc_cy = tray[3] + WC_SIDE
    # the door in the partition, from the front wall back; it must clear the galley's end panel (12 mm)
    bdoor = (W - BDOOR_W, W)
    if bdoor[0] < y + 12:
        raise LayoutError(f"the bathroom door starts at {bdoor[0]:.0f}, behind the galley ending at {y + 12:.0f}")
    # the leaf: closed it laps the back jamb and stops on the front jamb; open it parks towards the back wall,
    # its front edge flush with the back jamb, on the partition's bath face
    leaf_w = W - bdoor[0] - JAMB_T + SLIDE_LAP
    bleaf = (bdoor[0] + JAMB_T - leaf_w, bdoor[0] + JAMB_T)
    if bleaf[0] < tray[3]:
        raise LayoutError(f"the open leaf reaches {bleaf[0]:.0f}, into the shower ending at {tray[3]:.0f}")
    return Layout(
        L=L, W=W, H=H, o1=o1, o1_head=P.O1_HEAD.value, o2=o2, bed_x1=BED_X1, bed_y0=BED_Y0, bed_y1=bed_y1,
        bedside=bedside, drawers=drawers, sofa=sofa, seat_cx=seat_cx, galley_x0=galley_x0,
        fridge=zones[0], hob=zones[1], sink=zones[2], part_x0=part_x0, part_t=PART_T, bath_x0=bath_x0,
        wall_b=wall_b, tray=tray, wc_cy=wc_cy, bdoor=bdoor, bleaf=bleaf,
        w1_sill=1150.0,
        w1_head=2040.0,
    )
