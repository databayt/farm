#!/usr/bin/env python3
"""Build the container-studio design package from one parametric model.

    pnpm studio:build
    uv run --with-requirements scripts/studio/requirements.txt python scripts/studio/build.py [--check] [--pdf]

Writes public/designs/studio/ (drawings, model, cnc, data; pdf/ only with --pdf). Inputs:
scripts/studio/params.py and study/studio/survey.csv. Decisions: D-014..D-016.
"""
from __future__ import annotations

import argparse
import hashlib
import shutil
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import params as P  # noqa: E402
from kits import all_kits  # noqa: E402
from layout import build as build_layout  # noqa: E402
from services import electrical, inlet, max_demand, plumbing  # noqa: E402
from validate import check  # noqa: E402


def model(o1_shift: float = 0.0):
    lo = build_layout(o1_shift)
    kits = all_kits(lo)
    pts, circuits, k8 = electrical(lo)
    runs, k9, site = plumbing(lo)
    kits.insert(8, k8)
    kits.insert(9, k9)
    md = max_demand(circuits)
    sup = inlet(md["total_A"])
    return {"lo": lo, "kits": kits, "points": pts, "circuits": circuits, "runs": runs, "site": site, "md": md,
            "inlet": sup}


def write_all(m: dict, out: Path, pdf: bool) -> list[str]:
    import outputs
    errors, report = check(m["kits"], m["lo"], m["circuits"], m["md"], m["runs"])
    m["checks"] = report
    for d in ("drawings", "model", "cnc", "data"):
        if (out / d).exists():
            shutil.rmtree(out / d)
        (out / d).mkdir(parents=True, exist_ok=True)
    outputs.write(m, out)
    if pdf:
        import out_pdf
        out_pdf.write(m, out)
    return errors


def tree_hash(root: Path) -> str:
    h = hashlib.sha256()
    for f in sorted(p for p in root.rglob("*") if p.is_file() and "pdf" not in p.parts):
        h.update(str(f.relative_to(root)).encode())
        h.update(f.read_bytes())
    return h.hexdigest()


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true", help="build twice into temp dirs and compare")
    ap.add_argument("--pdf", action="store_true", help="also print the rev PDFs (needs Chrome)")
    a = ap.parse_args()
    m = model()
    if a.check:
        hashes = []
        for _ in range(2):
            with tempfile.TemporaryDirectory() as t:
                errs = write_all(model(), Path(t), False)
                hashes.append(tree_hash(Path(t)))
        if hashes[0] != hashes[1]:
            errs.append("non-deterministic output")
    else:
        errs = write_all(m, P.OUT, a.pdf)
        print(f"wrote {P.OUT.relative_to(P.ROOT)} ({P.STATUS}, rev {P.REV})")
    for r in m.get("checks", []):
        if r["result"] != "pass":
            print(f"  FAIL {r['id']}: {r['rule']} {r['detail']}")
    if errs:
        print(f"\n{len(errs)} error(s):")
        for e in errs:
            print(f"  - {e}")
        return 1
    print("all checks pass")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
