"""pytest scripts/studio/tests"""
from __future__ import annotations

import json
import struct
import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from build import model  # noqa: E402
from nest import nest  # noqa: E402
from outputs import all_parts  # noqa: E402
from validate import check  # noqa: E402


@pytest.mark.parametrize("shift", [-150, 0, 150])
def test_layout_robust_to_survey_band(shift):
    m = model(shift)
    errors, _ = check(m["kits"], m["lo"], m["circuits"], m["md"], m["runs"])
    assert errors == []


def test_every_sheet_part_nested_once():
    m = model()
    parts = [p for p in all_parts(m) if p.sheet and p.material in ("PLY18", "PLY12", "MPLY18", "WTOP38")]
    placed = [pl.part.id for sl in nest(all_parts(m)) for pl in sl.placed]
    assert sorted(placed) == sorted(p.id for p in parts)


def test_voltage_drop_hand_case():
    from services import CABLE
    # 16 A at 20 m on 2.5 mm2: 18 mV/A/m * 16 * 20 / 1000 = 5.76 V = 2.5 % of 230 V
    assert abs(CABLE[2.5][1] * 16 * 20 / 1000 / 230 * 100 - 2.504) < 0.01


def test_septic_meets_every_rule():
    s = model()["site"]
    assert s["septic_m3"] >= max(s["septic_rs143_m3"], s["septic_2012_m3"], s["septic_uk_m3"])


def test_glb_parses(tmp_path):
    from out_glb import write
    write(tmp_path / "t.glb", [{"id": "a", "mat": "PLY18", "box": (0, 0, 0, 100, 18, 700), "extras": {}}])
    b = (tmp_path / "t.glb").read_bytes()
    magic, ver, total = struct.unpack("<4sII", b[:12])
    assert magic == b"glTF" and ver == 2 and total == len(b)
    n = struct.unpack("<I", b[12:16])[0]
    assert json.loads(b[20:20 + n])["nodes"][0]["name"] == "a"
