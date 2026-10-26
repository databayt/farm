"""A deterministic, dependency-free GLB writer for box models.

One unit cube mesh per material; every part is a node scaled and translated onto it. Node
names are part ids; extras carry kit, layer, step and the explode vector (metres). The model's
z-up millimetres become glTF y-up metres: (X, Y, Z) = (x, z, y) / 1000.
"""
from __future__ import annotations

import json
import struct

from draw import FILL

CUBE_POS = []
CUBE_NRM = []
CUBE_IDX = []
_faces = [  # normal, four corners (unit cube 0..1)
    ((1, 0, 0), [(1, 0, 0), (1, 1, 0), (1, 1, 1), (1, 0, 1)]),
    ((-1, 0, 0), [(0, 0, 1), (0, 1, 1), (0, 1, 0), (0, 0, 0)]),
    ((0, 1, 0), [(0, 1, 0), (0, 1, 1), (1, 1, 1), (1, 1, 0)]),
    ((0, -1, 0), [(0, 0, 0), (1, 0, 0), (1, 0, 1), (0, 0, 1)]),
    ((0, 0, 1), [(0, 0, 1), (1, 0, 1), (1, 1, 1), (0, 1, 1)]),
    ((0, 0, -1), [(1, 0, 0), (0, 0, 0), (0, 1, 0), (1, 1, 0)]),
]
for n, quad in _faces:
    b = len(CUBE_POS)
    CUBE_POS += quad
    CUBE_NRM += [n] * 4
    CUBE_IDX += [b, b + 1, b + 2, b, b + 2, b + 3]

TRANSLUCENT = {"glass": 0.3, "POLY": 0.45, "eps": 0.55, "steel": 0.22, "MESH": 0.5}


def rgba(key: str) -> list[float]:
    h = FILL.get(key, "#cccccc").lstrip("#")
    a = TRANSLUCENT.get(key, 1.0)
    return [round(int(h[i:i + 2], 16) / 255, 4) for i in (0, 2, 4)] + [a]


def write(path, nodes: list[dict]) -> None:
    """nodes: {id, name, mat, box: (x0,y0,z0,x1,y1,z1) mm, extras: {...}}"""
    mats = sorted({n["mat"] for n in nodes})
    pos = b"".join(struct.pack("<3f", *p) for p in CUBE_POS)
    nrm = b"".join(struct.pack("<3f", *p) for p in CUBE_NRM)
    idx = b"".join(struct.pack("<H", i) for i in CUBE_IDX)
    buf = pos + nrm + idx
    gltf: dict = {
        "asset": {"version": "2.0", "generator": "farm scripts/studio"},
        "scene": 0,
        "scenes": [{"nodes": []}],
        "buffers": [{"byteLength": len(buf)}],
        "bufferViews": [
            {"buffer": 0, "byteOffset": 0, "byteLength": len(pos), "target": 34962},
            {"buffer": 0, "byteOffset": len(pos), "byteLength": len(nrm), "target": 34962},
            {"buffer": 0, "byteOffset": len(pos) + len(nrm), "byteLength": len(idx), "target": 34963},
        ],
        "accessors": [
            {"bufferView": 0, "componentType": 5126, "count": 24, "type": "VEC3", "min": [0, 0, 0], "max": [1, 1, 1]},
            {"bufferView": 1, "componentType": 5126, "count": 24, "type": "VEC3"},
            {"bufferView": 2, "componentType": 5123, "count": 36, "type": "SCALAR"},
        ],
        "materials": [],
        "meshes": [],
        "nodes": [],
    }
    for i, m in enumerate(mats):
        c = rgba(m)
        mat = {"name": m, "pbrMetallicRoughness": {"baseColorFactor": c, "metallicFactor": 0.0,
                                                   "roughnessFactor": 0.85}, "doubleSided": True}
        if c[3] < 1:
            mat["alphaMode"] = "BLEND"
        gltf["materials"].append(mat)
        gltf["meshes"].append({"name": m, "primitives": [{"attributes": {"POSITION": 0, "NORMAL": 1}, "indices": 2,
                                                          "material": i}]})
    for n in nodes:
        x0, y0, z0, x1, y1, z1 = n["box"]
        sx, sy, sz = max(x1 - x0, 1), max(y1 - y0, 1), max(z1 - z0, 1)
        node = {
            "name": n["id"],
            "mesh": mats.index(n["mat"]),
            # unit cube 0..1; x->X, z->Y, y->Z (the model frame is left-handed, so +y must map to +Z)
            "translation": [round(x0 / 1000, 4), round(z0 / 1000, 4), round(y0 / 1000, 4)],
            "scale": [round(sx / 1000, 4), round(sz / 1000, 4), round(sy / 1000, 4)],
            "extras": n["extras"],
        }
        gltf["scenes"][0]["nodes"].append(len(gltf["nodes"]))
        gltf["nodes"].append(node)
    js = json.dumps(gltf, separators=(",", ":"), sort_keys=True).encode()
    js += b" " * ((4 - len(js) % 4) % 4)
    buf += b"\0" * ((4 - len(buf) % 4) % 4)
    total = 12 + 8 + len(js) + 8 + len(buf)
    with open(path, "wb") as fh:
        fh.write(struct.pack("<4sII", b"glTF", 2, total))
        fh.write(struct.pack("<I4s", len(js), b"JSON") + js)
        fh.write(struct.pack("<I4s", len(buf), b"BIN\0") + buf)
