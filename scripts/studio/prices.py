"""Unit prices for the bill of materials, RWF.

Label V = a published price (price id in study/registers/prices.csv); A = a placeholder under
AS-21, to be replaced by three quotes per line before any money is committed. No placeholder is
a market observation; they exist only so the BOM can show where the money is likely to go.
"""
from __future__ import annotations

# key: (RWF per unit, label, source or assumption id, note)
PRICES: dict[str, tuple[float, str, str, str]] = {
    # boards (per sheet / blank)
    "sheet_PLY18": (45_000, "A", "AS-21", "18 mm plywood or MR melamine board, 2440 x 1220"),
    "sheet_PLY12": (35_000, "A", "AS-21", "12 mm plywood"),
    "sheet_MPLY18": (60_000, "A", "AS-21", "18 mm marine / WBP plywood (STU-31 lists film-faced)"),
    "sheet_WTOP38": (90_000, "A", "AS-21", "38 mm worktop blank 3000 x 620"),
    "edgeband": (600, "A", "AS-21", "ABS edge band, per metre"),
    # hardware
    "confirmat": (60, "A", "AS-21", ""), "dowel": (20, "A", "AS-21", ""), "conbolt": (600, "A", "AS-21", ""),
    "hinge": (2_500, "A", "AS-21", ""), "shelfpin": (30, "A", "AS-21", ""), "screw4": (15, "A", "AS-21", ""),
    "runner": (9_000, "A", "AS-21", "per pair"), "leg": (1_500, "A", "AS-21", ""), "handle": (2_000, "A", "AS-21", ""),
    "castor": (1_500, "A", "AS-21", ""), "sds": (50, "A", "AS-21", ""), "strut": (12_000, "A", "AS-21", ""),
    "rail": (8_000, "A", "AS-21", ""),
    # envelope
    "batten": (2_500, "A", "AS-21", "38 x 50 treated, 2.4 m"), "stud": (3_000, "A", "AS-21", "40 x 40, 2.4 m"),
    "sprayfoam": (30_000, "A", "AS-21", "closed-cell spray foam about 40 mm, applied, per m2; no Kigali contractor found yet"),
    "dpm": (1_500, "A", "AS-21", "polythene membrane 250 um, per m2"),
    "pufoam": (7_000, "A", "AS-21", ""),
    "spc": (18_000, "A", "AS-21", "per m2"), "primer": (8_000, "A", "AS-21", "per L"),
    "varnish": (9_000, "A", "AS-21", "per L"), "cementboard": (14_000, "A", "AS-21", "per m2 incl. membrane"),
    "tile": (16_000, "A", "AS-21", "per m2 incl. adhesive and grout"), "vinyl": (15_000, "A", "AS-21", "per m2"),
    # fixtures and appliances
    "doorleaf": (90_000, "A", "AS-21", ""), "tray": (120_000, "A", "AS-21", ""), "screen": (180_000, "A", "AS-21", ""),
    "wc": (150_000, "A", "AS-21", ""), "slidetrack": (60_000, "A", "AS-21", "surface slider kit, soft-close"),
    "bathacc": (40_000, "A", "AS-21", ""), "hob": (250_000, "A", "AS-21", "2-zone induction, zones side by side, 590 x 350"),
    "sink": (70_000, "A", "AS-21", ""), "tap": (45_000, "A", "AS-21", ""),
    "fridge": (265_000, "V", "STU-P03", "90 L mini fridge, Kanis 2026-10-26"),
    "hood": (150_000, "A", "AS-21", "chimney hood 600 mm, black"),
    "chimney": (0, "A", "AS-21", "telescopic cover, comes with the hood"), "filter": (80_000, "A", "AS-21", ""),
    "mattress": (180_000, "A", "AS-21", "local foam, size to field-check (STU-51)"), "curtain": (60_000, "A", "AS-21", ""),
    "mesh": (90_000, "A", "AS-21", ""),
    "heater_instant": (90_000, "A", "AS-21", "5.5 kW instant shower heater not priced yet (D-053)"),
    "showerrail": (30_000, "A", "AS-21", ""), "anglevalve": (6_000, "A", "AS-21", ""),
    "aav": (30_000, "A", "AS-21", ""), "watermeter": (45_000, "A", "AS-21", ""), "fittings": (120_000, "A", "AS-21", ""),
    "pipe_ppr20": (2_000, "A", "AS-21", "per m"), "pipe_ppr25": (2_800, "A", "AS-21", "per m"),
    "pipe_upvc40": (2_500, "A", "AS-21", "per m"), "pipe_upvc50": (3_000, "A", "AS-21", "per m"),
    "pipe_upvc75": (4_500, "A", "AS-21", "per m"), "pipe_upvc110": (7_000, "A", "AS-21", "per m"),
    # electrical
    "luminaire": (15_000, "A", "AS-21", ""), "bulkhead": (18_000, "A", "AS-21", "IP65"),
    "switch": (3_500, "A", "AS-21", ""), "switch65": (8_000, "A", "AS-21", "IP65"), "socket": (5_000, "A", "AS-21", ""),
    "socket2": (9_000, "A", "AS-21", "double"), "socket66": (15_000, "A", "AS-21", "IP66, lidded"),
    "usbsocket": (15_000, "A", "AS-21", ""), "fcu": (9_000, "A", "AS-21", ""), "fan": (35_000, "A", "AS-21", ""),
    "dptimer": (25_000, "A", "AS-21", "DP switch + timer"), "isolator": (9_000, "A", "AS-21", ""),
    "db": (65_000, "A", "AS-21", "enclosure, 24 modules (2 x 12)"), "cable1.5": (500, "A", "AS-21", "per m"),
    "cable2.5": (750, "A", "AS-21", "per m"), "cable4.0": (1_200, "A", "AS-21", "per m"),
    "cable6.0": (1_800, "A", "AS-21", "per m"), "cable16.0": (4_800, "A", "AS-21", "per m, tails to the 63 A main"), "inlet": (35_000, "A", "AS-21", "surface, IP67"),
    "plug": (20_000, "A", "AS-21", "IP67"),
    "conduit": (600, "A", "AS-21", "per m"), "conduit_out": (900, "A", "AS-21", "per m, UV-stable"),
    "spd": (60_000, "A", "AS-21", ""), "rcbo": (22_000, "A", "AS-21", "1 module"),
    "relay": (60_000, "A", "AS-21", "load shedding, DIN"), "contactor": (25_000, "A", "AS-21", "DIN"),
    "mainsw": (45_000, "A", "AS-21", "DP breaker + DIN kWh meter"), "earthrod": (35_000, "A", "AS-21", ""),
    "alarm": (20_000, "A", "AS-21", ""), "extinguisher": (55_000, "A", "AS-21", ""), "bonding": (25_000, "A", "AS-21", ""),
    # steel and glazing
    "w1infill": (180_000, "A", "AS-21", "incl. welding"), "louvre": (120_000, "A", "AS-21", ""),
    "endbdoors": (60_000, "A", "AS-21", ""), "pad": (25_000, "A", "AS-21", ""), "hangrail": (40_000, "A", "AS-21", ""),
    "lock": (45_000, "A", "AS-21", ""), "vent": (30_000, "A", "AS-21", ""), "sleeve": (15_000, "A", "AS-21", ""),
    "gutter": (90_000, "A", "AS-21", ""),
    # roof kit, priced by material weight / area
    "steel_kg": (2_600, "A", "AS-21", "fabricated, painted steel per kg"),
    "timber_m3": (900_000, "A", "AS-21", "treated hardwood decking and slats per m3"),
    "poly_m2": (28_000, "A", "AS-21", "tinted multiwall polycarbonate per m2 (supplier not found)"),
    "mesh_m2": (15_000, "A", "AS-21", "welded mesh infill per m2"),
    "cable_m": (3_000, "A", "AS-21", "4 mm stainless wire rope + tensioners, per m"),
    "sofa": (450_000, "A", "AS-21", "compact two-seat sofa, washable covers"),
    "wcframe": (220_000, "A", "AS-21", "slim concealed cistern frame + dual-flush plate"),
    "lamp": (35_000, "A", "AS-21", "table lamp with linen shade, LED bulb"),
    "stain": (14_000, "A", "AS-21", "medium-oak stain + clear matte PU varnish for pine, per L"),
    "stairframe": (450_000, "A", "AS-21", "stringers, handrails, footings"),
}

# Labour and site works per unit, RWF [A]
LABOUR: list[tuple[str, float, str]] = [
    ("Carpentry workshop: cutting, edging, drilling, labelling (per unit kit)", 450_000, "A"),
    ("Site carpentry and assembly: 2 people x 8 days", 320_000, "A"),
    ("Electrician (RURA class A), install + certificate", 250_000, "A"),
    ("Plumber, install + tests", 200_000, "A"),
    ("Tiler: wet walls and floor", 150_000, "A"),
    ("Welder: W1, roof frame, deck canopy, stair (per unit)", 600_000, "A"),
    ("Transport Kigali to site (share of 2 truck trips)", 120_000, "A"),
]
SHARED: list[tuple[str, float, str]] = [  # site works shared by the two studios and the office
    ("Septic tank (2 chambers, about 4 m3) + inspection chambers", 1_400_000, "A"),
    ("Soak pit and drain field after a percolation test", 600_000, "A"),
    ("Grease trap + kitchen soak pit", 350_000, "A"),
    ("Storage tank 4-5 m3 on a stand + float valve + air gap", 700_000, "A"),
    ("Booster pump + pressure vessel + controls", 650_000, "A"),
    ("Site board, three feeders in duct, trenching", 1_100_000, "A"),
    ("REG connection (if new)", 56_000, "V"),
]
CONTINGENCY = 0.15
