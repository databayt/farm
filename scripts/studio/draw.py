"""SVG primitives: sheet frames with a title block, orthographic and isometric box views,
dimensions, IEC 60617-style electrical symbols. All sheet coordinates are mm on paper."""
from __future__ import annotations

import math
from html import escape

import params as P
from model import Box

FILL = {
    "PLY18": "#ead9b5", "PLY12": "#f2e6c9", "MPLY18": "#cdb68c", "WTOP38": "#b98b5c", "STEEL": "#6e6e6e",
    "TIMBER": "#a9774a", "POLY": "#d9b45a", "MESH": "#bdbdbd", "CABLE": "#9aa0a6", "STAIRFRAME": "#5a5a5a",
    "white": "#fbfbfb", "glass": "#d6ecf7", "stainless": "#c9cdd1", "black": "#2a2a2a", "tile": "#e3e8ea",
    "floor": "#dccdb1", "eps": "#fff1a6", "timber": "#c9a06f", "fabric": "#ebe5f2", "electric": "#ffd23f",
    "door": "#e0d3ba", "steel": "#9c4436", "base": "#5d5d5d", "": "#eeeeee",
}


def f(v: float) -> str:
    s = f"{v:.2f}".rstrip("0").rstrip(".")
    return "0" if s in ("-0", "") else s


class Sheet:
    """An A3 (or A4) drawing sheet in paper millimetres."""

    def __init__(self, number: str, title: str, scale: str = "", size: str = "A3", landscape: bool = True):
        self.number, self.title, self.scale = number, title, scale
        w, h = {"A3": (420, 297), "A4": (297, 210)}[size]
        self.W, self.H = (w, h) if landscape else (h, w)
        self.body: list[str] = []
        self.ids = 0

    # -------------------------------------------------------------- primitives
    def add(self, s: str) -> None:
        self.body.append(s)

    def rect(self, x, y, w, h, fill="none", stroke="#111", sw=0.25, op=1.0, dash="") -> None:
        d = f' stroke-dasharray="{dash}"' if dash else ""
        o = f' fill-opacity="{f(op)}"' if op < 1 else ""
        self.add(f'<rect x="{f(x)}" y="{f(y)}" width="{f(w)}" height="{f(h)}" fill="{fill}"{o} stroke="{stroke}" '
                 f'stroke-width="{f(sw)}"{d}/>')

    def line(self, x1, y1, x2, y2, stroke="#111", sw=0.25, dash="") -> None:
        d = f' stroke-dasharray="{dash}"' if dash else ""
        self.add(f'<line x1="{f(x1)}" y1="{f(y1)}" x2="{f(x2)}" y2="{f(y2)}" stroke="{stroke}" stroke-width="{f(sw)}"{d}/>')

    def poly(self, pts, fill="none", stroke="#111", sw=0.25, closed=True, op=1.0) -> None:
        tag = "polygon" if closed else "polyline"
        o = f' fill-opacity="{f(op)}"' if op < 1 else ""
        p = " ".join(f"{f(x)},{f(y)}" for x, y in pts)
        self.add(f'<{tag} points="{p}" fill="{fill}"{o} stroke="{stroke}" stroke-width="{f(sw)}" stroke-linejoin="round"/>')

    def circle(self, x, y, r, fill="none", stroke="#111", sw=0.25) -> None:
        self.add(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(r)}" fill="{fill}" stroke="{stroke}" stroke-width="{f(sw)}"/>')

    def text(self, x, y, s, size=2.5, anchor="start", weight="normal", fill="#111", rot=0.0) -> None:
        t = f' transform="rotate({f(rot)} {f(x)} {f(y)})"' if rot else ""
        self.add(f'<text x="{f(x)}" y="{f(y)}" font-size="{f(size)}" text-anchor="{anchor}" font-weight="{weight}" '
                 f'fill="{fill}"{t}>{escape(str(s))}</text>')

    def arc(self, cx, cy, r, a0, a1, stroke="#111", sw=0.2, dash="1,0.8") -> None:
        x0, y0 = cx + r * math.cos(math.radians(a0)), cy + r * math.sin(math.radians(a0))
        x1, y1 = cx + r * math.cos(math.radians(a1)), cy + r * math.sin(math.radians(a1))
        large = 1 if abs(a1 - a0) > 180 else 0
        sweep = 1 if a1 > a0 else 0
        self.add(f'<path d="M{f(x0)},{f(y0)} A{f(r)},{f(r)} 0 {large} {sweep} {f(x1)},{f(y1)}" fill="none" '
                 f'stroke="{stroke}" stroke-width="{f(sw)}" stroke-dasharray="{dash}"/>')

    def dim(self, x1, y1, x2, y2, label, off=6.0, size=2.2, inline: bool = False) -> None:
        """Aligned dimension with ticks, offset perpendicular to the measured line. inline: the number
        sits centred on the line, which stops either side of it and carries on."""
        dx, dy = x2 - x1, y2 - y1
        L = math.hypot(dx, dy) or 1
        nx, ny = -dy / L * off, dx / L * off
        a, b = (x1 + nx, y1 + ny), (x2 + nx, y2 + ny)
        self.line(x1, y1, a[0] + nx * 0.15, a[1] + ny * 0.15, "#555", 0.13)
        self.line(x2, y2, b[0] + nx * 0.15, b[1] + ny * 0.15, "#555", 0.13)
        ang = math.degrees(math.atan2(dy, dx))
        if ang > 90 or ang <= -90:
            ang += 180
        mx, my = (a[0] + b[0]) / 2, (a[1] + b[1]) / 2
        if inline:
            half = len(str(label)) * size * 0.3 + size * 0.5  # gap around the number
            ux, uy = (b[0] - a[0]) / (L / 1), (b[1] - a[1]) / (L / 1)
            n = math.hypot(ux, uy) or 1
            ux, uy = ux / n, uy / n
            self.line(*a, mx - ux * half, my - uy * half, "#333", 0.18)
            self.line(mx + ux * half, my + uy * half, *b, "#333", 0.18)
            for p in (a, b):
                self.line(p[0] - 1, p[1] + 1, p[0] + 1, p[1] - 1, "#111", 0.3)
            self.add(f'<text x="{f(mx)}" y="{f(my)}" font-size="{f(size)}" text-anchor="middle" '
                     f'dominant-baseline="central" fill="#111" transform="rotate({f(ang)} {f(mx)} {f(my)})">'
                     f'{escape(str(label))}</text>')
            return
        self.line(*a, *b, "#333", 0.18)
        for p in (a, b):
            self.line(p[0] - 1, p[1] + 1, p[0] + 1, p[1] - 1, "#111", 0.3)
        self.text(mx - math.sin(math.radians(ang)) * 0.8, my - 0.8 * math.cos(math.radians(ang)), label, size,
                  "middle", rot=ang)

    def bubble(self, x, y, label, tx, ty, r=2.6) -> None:
        self.line(x, y, tx, ty, "#111", 0.2)
        self.circle(tx, ty, r, "#fff", "#111", 0.3)
        self.text(tx, ty + 0.9, label, 2.0 if len(label) < 6 else 1.6, "middle", "bold")

    def note(self, x, y, lines: list[str], size=2.3, lh=1.45) -> float:
        for i, s in enumerate(lines):
            self.text(x, y + i * size * lh, s, size)
        return y + len(lines) * size * lh

    def table(self, x, y, cols: list[tuple[str, float]], rows: list[list[str]], size=1.9, rh=3.6) -> float:
        tw = sum(w for _, w in cols)
        self.rect(x, y, tw, rh, "#eee", "#111", 0.2)
        cx = x
        for h, w in cols:
            self.text(cx + 1, y + rh - 1.1, h, size, weight="bold")
            cx += w
        for r, row in enumerate(rows):
            yy = y + rh * (r + 1)
            self.rect(x, yy, tw, rh, "none", "#999", 0.12)
            cx = x
            for (h, w), v in zip(cols, row):
                s = str(v)
                maxc = int(w / (size * 0.5))
                self.text(cx + 1, yy + rh - 1.1, s if len(s) <= maxc else s[: maxc - 1] + "…", size)
                cx += w
        return y + rh * (len(rows) + 1)

    def bare(self, w: float, h: float) -> str:
        """The drawing alone on a transparent ground: no frame, title block or stamp (web figures)."""
        return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {f(w)} {f(h)}" '
                f'font-family="Helvetica, Arial, sans-serif">' + "".join(self.body) + "</svg>\n")

    # -------------------------------------------------------------- frame
    def svg(self) -> str:
        W, H = self.W, self.H
        tb_w, tb_h = 120, 26
        x0, y0 = W - 10 - tb_w, H - 10 - tb_h
        frame = [
            f'<rect x="0" y="0" width="{W}" height="{H}" fill="#fff"/>',
            f'<rect x="10" y="10" width="{W - 20}" height="{H - 20}" fill="none" stroke="#111" stroke-width="0.5"/>',
            f'<rect x="{x0}" y="{y0}" width="{tb_w}" height="{tb_h}" fill="#fff" stroke="#111" stroke-width="0.4"/>',
            f'<line x1="{x0}" y1="{y0 + 9}" x2="{x0 + tb_w}" y2="{y0 + 9}" stroke="#111" stroke-width="0.2"/>',
            f'<line x1="{x0}" y1="{y0 + 18}" x2="{x0 + tb_w}" y2="{y0 + 18}" stroke="#111" stroke-width="0.2"/>',
            f'<line x1="{x0 + 80}" y1="{y0 + 9}" x2="{x0 + 80}" y2="{y0 + tb_h}" stroke="#111" stroke-width="0.2"/>',
            f'<text x="{x0 + 2}" y="{y0 + 6}" font-size="3.4" font-weight="bold">{escape(P.PROJECT)}</text>',
            f'<text x="{x0 + tb_w - 2}" y="{y0 + 6}" font-size="2.2" text-anchor="end">farm.databayt.org/docs/studio</text>',
            f'<text x="{x0 + 2}" y="{y0 + 15}" font-size="3.2">{escape(self.title)}</text>',
            f'<text x="{x0 + 82}" y="{y0 + 15}" font-size="5" font-weight="bold">{escape(self.number)}</text>',
            f'<text x="{x0 + 2}" y="{y0 + 23.5}" font-size="2.3">Scale {escape(self.scale or "NTS")} · Rev {P.REV} · '
            f'{P.REV_DATE} · mm</text>',
            f'<text x="{x0 + 82}" y="{y0 + 23.5}" font-size="2.6" font-weight="bold" fill="#b3261e">'
            f'{escape(P.STATUS)}</text>',
        ]
        if P.STATUS == "PRELIMINARY":
            frame.append(f'<text x="{W / 2}" y="{H / 2}" font-size="34" fill="#b3261e" fill-opacity="0.05" '
                         f'text-anchor="middle" transform="rotate(-18 {W / 2} {H / 2})">PRELIMINARY</text>')
        head = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}mm" height="{H}mm" viewBox="0 0 {W} {H}" '
                f'font-family="Helvetica, Arial, sans-serif">')
        return head + "".join(frame[:2]) + "".join(self.body) + "".join(frame[2:]) + "</svg>\n"


# ------------------------------------------------------------------------- projections
VIEWS = {
    # name: (h(x,y,z), v(x,y,z), depth key (bigger = nearer the viewer))
    "plan": (lambda x, y, z: x, lambda x, y, z: y, lambda b: b.z1),
    "back": (lambda x, y, z: x, lambda x, y, z: -z, lambda b: b.y1),
    "front": (lambda x, y, z: -x, lambda x, y, z: -z, lambda b: -b.y0),  # from inside, looking at the glass
    "front_out": (lambda x, y, z: x, lambda x, y, z: -z, lambda b: b.y1),  # from the deck
    "endA": (lambda x, y, z: y, lambda x, y, z: -z, lambda b: b.x1),
    "endB": (lambda x, y, z: -y, lambda x, y, z: -z, lambda b: -b.x0),
}


def project_box(view: str, b: Box) -> tuple[float, float, float, float]:
    h, v, _ = VIEWS[view]
    xs = [h(x, y, z) for x in (b.x0, b.x1) for y in (b.y0, b.y1) for z in (b.z0, b.z1)]
    ys = [v(x, y, z) for x in (b.x0, b.x1) for y in (b.y0, b.y1) for z in (b.z0, b.z1)]
    return min(xs), min(ys), max(xs), max(ys)


def ortho(sh: Sheet, view: str, items: list[tuple[Box, str, str]], ox: float, oy: float, scale: float,
          origin=(0.0, 0.0), sw=0.2, op=1.0, labels: bool = False) -> None:
    """Draw boxes (box, fill, label) in an orthographic view; ox, oy = paper position of the origin."""
    _, _, depth = VIEWS[view]
    for b, fill, lab in sorted(items, key=lambda t: depth(t[0])):
        a0, b0, a1, b1 = project_box(view, b)
        X, Y = ox + (a0 - origin[0]) / scale, oy + (b0 - origin[1]) / scale
        w, h = (a1 - a0) / scale, (b1 - b0) / scale
        sh.rect(X, Y, max(w, 0.15), max(h, 0.15), fill, "#222", sw, op)
        if labels and lab and w > 9 and h > 3:
            sh.text(X + w / 2, Y + h / 2 + 0.8, lab, 1.8 if w > 16 else 1.4, "middle")


# ------------------------------------------------------------------------- isometric
C30, S30 = math.cos(math.radians(30)), 0.5


def iso(x: float, y: float, z: float) -> tuple[float, float]:
    """Viewer at +x +y +z: sees tops, fronts (+y) and +x sides."""
    return ((x - y) * C30, (x + y) * S30 - z)


def iso_order(boxes: list[Box]) -> list[int]:
    """Painter's order for axis-aligned boxes (far first), with a centroid fallback on cycles."""
    n = len(boxes)
    scr = []
    for b in boxes:
        pts = [iso(x, y, z) for x in (b.x0, b.x1) for y in (b.y0, b.y1) for z in (b.z0, b.z1)]
        scr.append((min(p[0] for p in pts), min(p[1] for p in pts), max(p[0] for p in pts), max(p[1] for p in pts)))
    after: list[set[int]] = [set() for _ in range(n)]
    indeg = [0] * n
    for i in range(n):
        for j in range(i + 1, n):
            a, c = scr[i], scr[j]
            if a[2] <= c[0] or c[2] <= a[0] or a[3] <= c[1] or c[3] <= a[1]:
                continue
            bi, bj = boxes[i], boxes[j]
            behind = None
            for k in range(3):
                if bi.hi[k] <= bj.lo[k] + 0.01:
                    behind = (i, j)
                    break
                if bj.hi[k] <= bi.lo[k] + 0.01:
                    behind = (j, i)
                    break
            if behind is None:
                ci, cj = sum(bi.lo) + sum(bi.hi), sum(bj.lo) + sum(bj.hi)
                behind = (i, j) if ci <= cj else (j, i)
            far, near = behind
            if near not in after[far]:
                after[far].add(near)
                indeg[near] += 1
    key = [sum(b.lo) + sum(b.hi) for b in boxes]
    ready = sorted((i for i in range(n) if indeg[i] == 0), key=lambda i: key[i])
    out: list[int] = []
    done = [False] * n
    while len(out) < n:
        if not ready:
            i = min((i for i in range(n) if not done[i]), key=lambda i: key[i])
        else:
            i = ready.pop(0)
        if done[i]:
            continue
        done[i] = True
        out.append(i)
        for j in sorted(after[i], key=lambda j: key[j]):
            indeg[j] -= 1
            if indeg[j] <= 0 and not done[j]:
                ready.append(j)
        ready.sort(key=lambda i: key[i])
    return out


def shade(hex_: str, k: float) -> str:
    h = hex_.lstrip("#")
    r, g, b = (int(h[i:i + 2], 16) for i in (0, 2, 4))
    return "#%02x%02x%02x" % (min(255, int(r * k)), min(255, int(g * k)), min(255, int(b * k)))


def iso_draw(sh: Sheet, items: list[tuple[Box, str, str, str]], cx: float, cy: float, fit: tuple[float, float],
             callouts: bool = False, max_scale: float = 0.08) -> float:
    """items: (box, fill, style, label). style: 'new' | 'old' | 'normal' | 'ghost'. Fits into fit (w, h)."""
    if not items:
        return 1.0
    pts = [iso(x, y, z) for b, *_ in items for x in (b.x0, b.x1) for y in (b.y0, b.y1) for z in (b.z0, b.z1)]
    u0, v0 = min(p[0] for p in pts), min(p[1] for p in pts)
    u1, v1 = max(p[0] for p in pts), max(p[1] for p in pts)
    s = min(fit[0] / max(u1 - u0, 1), fit[1] / max(v1 - v0, 1), max_scale)
    ox, oy = cx - (u0 + u1) / 2 * s, cy - (v0 + v1) / 2 * s

    def P_(x, y, z):
        u, v = iso(x, y, z)
        return (ox + u * s, oy + v * s)

    order = iso_order([it[0] for it in items])
    marks = []
    for i in order:
        b, fill, style, lab = items[i]
        base = {"new": "#ffffff", "old": "#e6e6e6", "ghost": "#f4f4f4"}.get(style, fill)
        stroke = {"new": "#000", "old": "#8a8a8a", "ghost": "#c8c8c8"}.get(style, "#222")
        sw = {"new": 0.42, "old": 0.18, "ghost": 0.12}.get(style, 0.2)
        op = 0.35 if fill in (FILL["glass"], FILL["POLY"]) else 0.3 if fill == FILL["CABLE"] else 1.0
        top = [P_(b.x0, b.y0, b.z1), P_(b.x1, b.y0, b.z1), P_(b.x1, b.y1, b.z1), P_(b.x0, b.y1, b.z1)]
        front = [P_(b.x0, b.y1, b.z0), P_(b.x1, b.y1, b.z0), P_(b.x1, b.y1, b.z1), P_(b.x0, b.y1, b.z1)]
        side = [P_(b.x1, b.y0, b.z0), P_(b.x1, b.y1, b.z0), P_(b.x1, b.y1, b.z1), P_(b.x1, b.y0, b.z1)]
        sh.poly(side, shade(base, 0.82) if style == "normal" else shade(base, 0.93), stroke, sw, op=op)
        sh.poly(front, shade(base, 0.92) if style == "normal" else base, stroke, sw, op=op)
        sh.poly(top, base, stroke, sw, op=op)
        if callouts and style == "new" and lab:
            c = P_((b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2, b.z1)
            marks.append((c, lab))
    for k, (c, lab) in enumerate(marks):
        ang = -60 + (k % 6) * 24
        tx = c[0] + 14 * math.cos(math.radians(ang)) + (k // 6) * 3
        ty = c[1] - 10 - (k % 3) * 4
        sh.bubble(c[0], c[1], lab, tx, ty)
    return s


# ------------------------------------------------------------------------- symbols
def sym_breaker(sh: Sheet, x: float, y: float, label: str, rcd: bool = False) -> None:
    sh.line(x, y, x, y + 3)
    sh.line(x, y + 3, x + 2.2, y + 7)
    sh.line(x, y + 8, x, y + 11)
    sh.line(x - 1, y + 3.4, x + 1, y + 2.6)
    if rcd:
        sh.add(f'<ellipse cx="{f(x + 1.1)}" cy="{f(y + 5.5)}" rx="2.6" ry="1.2" fill="none" stroke="#111" stroke-width="0.25"/>')
    sh.text(x + (5 if rcd else 3), y + 6.5, label, 2.0)  # clear of the RCD ring


def sym_earth(sh: Sheet, x: float, y: float) -> None:
    sh.line(x, y, x, y + 2)
    for i, w in enumerate((3, 2, 1)):
        sh.line(x - w / 2 * 1.4, y + 2 + i, x + w / 2 * 1.4, y + 2 + i, "#111", 0.3)


def sym_lamp(sh: Sheet, x: float, y: float, r: float = 1.6) -> None:
    sh.circle(x, y, r, "#fff")
    sh.line(x - r * 0.7, y - r * 0.7, x + r * 0.7, y + r * 0.7)
    sh.line(x - r * 0.7, y + r * 0.7, x + r * 0.7, y - r * 0.7)


def sym_socket(sh: Sheet, x: float, y: float, r: float = 1.6) -> None:
    sh.add(f'<path d="M{f(x - r)},{f(y)} A{f(r)},{f(r)} 0 0 1 {f(x + r)},{f(y)} Z" fill="#fff" stroke="#111" stroke-width="0.25"/>')
    sh.line(x - r, y - r * 1.1, x + r, y - r * 1.1)


def sym_switch(sh: Sheet, x: float, y: float) -> None:
    sh.circle(x, y, 0.8, "#111")
    sh.line(x, y, x + 2, y - 2)
    sh.line(x + 2, y - 2, x + 2.6, y - 1.4)


def sym_box(sh: Sheet, x: float, y: float, label: str, w: float = 8, h: float = 4) -> None:
    sh.rect(x - w / 2, y - h / 2, w, h, "#fff")
    sh.text(x, y + 0.8, label, 1.9, "middle")
