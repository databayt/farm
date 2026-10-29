"""Inputs for the container-studio generator: container, openings, build-ups, revision.

Every number carries an evidence label (V/E/A) and, where it has one, a source id from
study/registers/sources.csv. Survey values in study/studio/survey.csv override the photo
estimates; until both studio units (U1, U2) are measured the drawings are stamped PRELIMINARY.
"""
from __future__ import annotations

import csv
from dataclasses import dataclass
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "public" / "designs" / "studio"
SURVEY = ROOT / "study" / "studio" / "survey.csv"

REV = "A2"
REV_DATE = "2026-10-28"  # fixed: outputs must be byte-identical between runs
PROJECT = "Farm container studios"


@dataclass(frozen=True)
class Param:
    value: float
    unit: str
    label: str  # V | E | A
    source: str = ""


# ----------------------------------------------------------------------------- container
EXT_L = Param(6058, "mm", "V", "STU-01")
EXT_W = Param(2438, "mm", "V", "STU-01")
EXT_H = Param(2591, "mm", "V", "STU-01")
INT_L = Param(5898, "mm", "V", "STU-01")
INT_W = Param(2352, "mm", "V", "STU-01")
INT_H = Param(2393, "mm", "V", "STU-01")
CROSS_MEMBER_DEPTH = Param(122, "mm", "V", "STU-02")
CROSS_MEMBER_PITCH = Param(300, "mm", "A", "")  # measure on site (survey)
DECK_HEIGHT = Param(700, "mm", "E", "")  # container floor above ground, from the photo
FRONT_DECK_WIDTH = Param(1500, "mm", "A", "")

# ----------------------------------------------------------------------------- build-ups
LINING_WALL = Param(50, "mm", "A", "AS-15")  # 38 batten + spray foam between, 12 ply (founder 2026-10-28)
LINING_CEIL = Param(60, "mm", "A", "AS-15")
LINING_FLOOR = Param(17, "mm", "A", "AS-15")  # 12 mm ply sheets screwed down + 5 mm oak SPC plank (founder 2026-10-28)

# ----------------------------------------------------------------------------- openings
# Photo estimates in the lined interior frame (x from the lined face of end A), +/-150 mm.
O1_X0 = Param(1380, "mm", "E", "AS-14")  # sliding glass wall start
O1_X1 = Param(4380, "mm", "E", "AS-14")  # sliding glass wall end
O1_HEAD = Param(2240, "mm", "E", "AS-14")
O2_X0 = Param(4990, "mm", "E", "AS-14")  # narrow steel door, becomes window W1
O2_X1 = Param(5510, "mm", "E", "AS-14")

# ----------------------------------------------------------------------------- services
SUPPLY_V = Param(230, "V", "V", "STU-18")
HEATER_KW = Param(5.5, "kW", "A", "D-053")  # instant box by the shower; D-024 had a 30 L, 2 kW tank
HOB_KW = Param(3.5, "kW", "A", "")
GUESTS = Param(2, "persons", "A", "AS-16")
STUDIO_UNITS = ("U1", "U2")  # two studios; the third box is the office (D-017)
UNITS = len(STUDIO_UNITS)
SEPTIC_POP = Param(6, "persons", "A", "AS-16")  # 4 guests + 2 visitors or staff
WATER_LPD = Param(150, "L/person/day", "A", "AS-17")

# ----------------------------------------------------------------------------- board
SHEETS = {  # material: (length, width, thickness)  [A] AS-20
    "PLY18": (2440, 1220, 18),
    "PLY12": (2440, 1220, 12),
    "MPLY18": (2440, 1220, 18),  # marine / WBP ply for wet zones
    "WTOP38": (3050, 650, 38),  # worktop blank
}
KERF = 4
TRIM = 10


def survey() -> tuple[dict[str, float], bool]:
    """Minimum of the measured values across the studio units, and whether their survey is complete."""
    if not SURVEY.exists():
        return {}, False
    rows = [r for r in csv.DictReader(SURVEY.open(encoding="utf-8")) if r.get("unit") in STUDIO_UNITS]
    vals: dict[str, list[float]] = {}
    for r in rows:
        v = (r.get("value_mm") or "").strip()
        if v:
            vals.setdefault(r["item"], []).append(float(v))
    items = {r["item"] for r in rows}
    complete = bool(rows) and all(len(vals.get(i, [])) >= UNITS for i in items)
    return {k: min(v) for k, v in vals.items()}, complete


MEASURED, SURVEY_COMPLETE = survey()
STATUS = "FOR CONSTRUCTION" if SURVEY_COMPLETE else "PRELIMINARY"


def m(name: str, default: Param) -> float:
    return MEASURED.get(name, default.value)
