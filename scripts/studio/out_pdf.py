"""Print the release PDFs with headless Chrome: the A3 drawing set, the A4 assembly manual and the
1:1 drilling templates. Run only for a revision (--pdf); PDFs carry dates, so they are not part
of the determinism check and the default build never deletes them."""
from __future__ import annotations

import shutil
import subprocess
import tempfile
from pathlib import Path

CHROME = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    shutil.which("google-chrome") or "",
    shutil.which("chromium") or "",
]


def _print(svgs: list[Path], size: str, dst: Path) -> None:
    w, h = {"A3": ("420mm", "297mm"), "A4P": ("210mm", "297mm")}[size]
    pages = "".join(f'<img src="{p.as_uri()}" style="width:{w};height:{h};display:block;page-break-after:always">'
                    for p in svgs)
    html = (f"<!doctype html><html><head><meta charset='utf-8'><style>@page{{size:{w} {h};margin:0}}"
            f"html,body{{margin:0;padding:0}}</style></head><body>{pages}</body></html>")
    chrome = next((c for c in CHROME if c and Path(c).exists()), None)
    if not chrome:
        print("  skip PDFs: Chrome not found")
        return
    with tempfile.TemporaryDirectory() as t:
        f = Path(t) / "set.html"
        f.write_text(html)
        subprocess.run([chrome, "--headless=new", "--disable-gpu", "--no-pdf-header-footer",
                        "--allow-file-access-from-files", f"--print-to-pdf={dst}", f.as_uri()],
                       check=True, capture_output=True, timeout=180)
    print(f"  wrote {dst.name}")


def write(m, out: Path) -> None:
    d = out / "drawings"
    pdf = out / "pdf"
    pdf.mkdir(exist_ok=True)
    allsvg = sorted(d.glob("*.svg"))
    a3 = [p for p in allsvg if not p.stem.startswith(("as-", "t-"))]
    a3.sort(key=lambda p: ("ASEPJC".index(p.stem[0].upper()) if p.stem[0].upper() in "ASEPJC" else 9, p.stem))
    _print(a3, "A3", pdf / "studio-drawing-set-A3.pdf")
    _print([p for p in allsvg if p.stem.startswith("as-")], "A4P", pdf / "studio-assembly-manual-A4.pdf")
    _print([p for p in allsvg if p.stem.startswith("t-")], "A4P", pdf / "studio-drilling-templates-1to1.pdf")
