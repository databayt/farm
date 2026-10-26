"""Data model: every flat part is an axis-aligned box; bought items are boxes or quantities."""
from __future__ import annotations

from dataclasses import dataclass, field

AX = "xyz"


@dataclass(frozen=True)
class Box:
    x0: float
    y0: float
    z0: float
    x1: float
    y1: float
    z1: float

    @staticmethod
    def at(x: float, y: float, z: float, sx: float, sy: float, sz: float) -> "Box":
        return Box(x, y, z, x + sx, y + sy, z + sz)

    @property
    def size(self) -> tuple[float, float, float]:
        return (self.x1 - self.x0, self.y1 - self.y0, self.z1 - self.z0)

    @property
    def lo(self) -> tuple[float, float, float]:
        return (self.x0, self.y0, self.z0)

    @property
    def hi(self) -> tuple[float, float, float]:
        return (self.x1, self.y1, self.z1)

    def overlap(self, o: "Box", tol: float = 0.5) -> bool:
        return all(self.lo[i] < o.hi[i] - tol and o.lo[i] < self.hi[i] - tol for i in range(3))

    def inside(self, o: "Box", tol: float = 0.5) -> bool:
        return all(self.lo[i] >= o.lo[i] - tol and self.hi[i] <= o.hi[i] + tol for i in range(3))

    def shift(self, d: tuple[float, float, float]) -> "Box":
        return Box(self.x0 + d[0], self.y0 + d[1], self.z0 + d[2], self.x1 + d[0], self.y1 + d[1], self.z1 + d[2])


@dataclass(frozen=True)
class Op:
    """A machining operation in part-local mm. u runs along the part's first in-plane world
    axis, v along the second; face A is the low side of the thickness axis, B the high side,
    E1..E4 are edges (drilled by hand with a bushed jig, never on the CNC)."""

    kind: str  # drill | cutout | pocket
    face: str
    u: float
    v: float
    dia: float = 0.0
    depth: float = 0.0
    w: float = 0.0
    h: float = 0.0
    joint: str = ""

    @property
    def cnc(self) -> bool:
        return self.face in ("A", "B")

    @property
    def layer(self) -> str:
        if self.kind == "cutout":
            return "CUTOUT"
        if self.kind == "pocket":
            return f"POCKET_Z{self.depth:g}"
        return f"DRILL_D{self.dia:g}_Z{self.depth:g}"


@dataclass
class Part:
    id: str
    name: str
    kit: str
    material: str  # key into params.SHEETS, or a non-sheet material (STEEL, TILE, ...)
    box: Box
    step: str = ""
    layer: str = "furniture"
    edges: str = ""  # edge-band code, e.g. "L1" = one long edge, "L2S2" = all round
    grain: str = "L"
    ops: list[Op] = field(default_factory=list)
    explode: tuple[float, float, float] = (0.0, 0.0, 0.0)
    sheet: bool = True  # cut from a sheet (False: solid sections, steel, boards bought cut)

    @property
    def taxis(self) -> int:
        s = self.box.size
        return min(range(3), key=lambda i: s[i])

    @property
    def axes(self) -> tuple[int, int]:
        return tuple(i for i in range(3) if i != self.taxis)  # type: ignore[return-value]

    @property
    def t(self) -> float:
        return self.box.size[self.taxis]

    @property
    def w(self) -> float:
        return self.box.size[self.axes[0]]

    @property
    def h(self) -> float:
        return self.box.size[self.axes[1]]

    @property
    def length(self) -> float:
        return max(self.w, self.h)

    @property
    def width(self) -> float:
        return min(self.w, self.h)

    def world(self, op: Op) -> tuple[float, float, float]:
        p = list(self.box.lo)
        a, b = self.axes
        p[a] += op.u
        p[b] += op.v
        if op.face == "B":
            p[self.taxis] += self.t
        return (p[0], p[1], p[2])


@dataclass
class Bought:
    id: str
    name: str
    kit: str
    category: str
    trade: str
    qty: float
    unit: str = "each"
    price: str = ""  # key into prices.PRICES
    box: Box | None = None
    spec: str = ""
    step: str = ""
    layer: str = "fixtures"
    color: str = ""


@dataclass
class KeepOut:
    id: str
    box: Box
    why: str
    owner: str  # the part or item id it serves (ignored in its own collisions)


@dataclass
class Step:
    id: str
    kit: str
    title: str
    adds: list[str]
    hardware: dict[str, int] = field(default_factory=dict)
    persons: int = 1
    note: str = ""


@dataclass
class Kit:
    id: str
    name: str
    trade: str
    where: str
    parts: list[Part] = field(default_factory=list)
    bought: list[Bought] = field(default_factory=list)
    steps: list[Step] = field(default_factory=list)
    keepouts: list[KeepOut] = field(default_factory=list)

    def add(self, p: Part) -> Part:
        self.parts.append(p)
        return p

    def buy(self, b: Bought) -> Bought:
        self.bought.append(b)
        return b
