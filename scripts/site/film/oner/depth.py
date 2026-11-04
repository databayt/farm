#!/usr/bin/env python3
"""The film's depth: every photo of the one-take film as a depth scene (scripts/site/film/oner/README.md).

    assets/film/oner/.venv/bin/python -I scripts/site/film/oner/depth.py [id ...]

For each photo in SCENES (the founder's 21 photos in ~/Desktop/farm-film, plus the hero's two served cuts), it writes
assets/film/oner/scenes/<id>/ (gitignored):
  photo.jpg    the picture the film shows (a copy; light.py may replace it with a relit one)
  depth.f16    disparity (1 = near, 0 = far), float16, at half the photo's size, edges snapped to the picture
  bgdepth.f16  the same with near things pushed back: the background behind them, for when the camera moves
  bg.jpg       the picture with the rim of near things filled from behind them, where the camera may see past them
  mask.png     R: the depth-edge band (where the camera reads bg/bgdepth) · G: leaves and grass · B: open water
  depth.png    a look at the depth, for checking by eye
  meta.json    sizes

Depth is Depth Anything V2 Base (ONNX, onnxruntime on the CPU), run at 518 px on the short side and upsampled with a
guided filter on the picture, so depth edges sit on the picture's own edges. Nothing here calls a paid API.
"""
import json
import os
import sys
from pathlib import Path

import numpy as np
import onnxruntime as ort
from PIL import Image
from scipy import ndimage as nd

ROOT = Path(__file__).resolve().parents[4]
OUT = ROOT / "assets" / "film" / "oner"
MODEL = OUT / "models" / "depth-anything-v2-base.onnx"
DESK = Path.home() / "Desktop" / "farm-film"

# id -> the picture the film shows. 01 is the hero itself, as the page serves it, so the film opens and closes on it.
SCENES = {"01": ROOT / "public/site/hero/desktop-1920.webp", "01p": ROOT / "public/site/hero/mobile-1920.webp"}
for f in sorted(DESK.glob("[0-2][0-9]-*.jpg")):
    if f.name[:2] != "01":
        SCENES[f.name[:2]] = f
# the outer gate from the road, face on (the parking page's hero): the film turns to it and it opens (D-074)
SCENES["P"] = ROOT / "public/designs/parking/render/parking-hero.jpg"
# the hero's served cuts are small; their depth comes from the masters they were made from, at the served shape
DEPTH_FROM = {"01": ROOT / "assets/hero/desktop.jpeg", "01p": ROOT / "assets/hero/mobile.jpeg"}

MEAN = np.array([0.485, 0.456, 0.406], np.float32)
STD = np.array([0.229, 0.224, 0.225], np.float32)


def infer(sess, img, short=518):
    w, h = img.size
    s = short / min(w, h)
    W, H = max(14, round(w * s / 14) * 14), max(14, round(h * s / 14) * 14)
    x = np.asarray(img.convert("RGB").resize((W, H), Image.BICUBIC), np.float32) / 255.0
    x = ((x - MEAN) / STD).transpose(2, 0, 1)[None]
    out = sess.run(None, {sess.get_inputs()[0].name: x})[0]
    return out.reshape(out.shape[-2], out.shape[-1])


def box(a, r):
    return nd.uniform_filter(a, size=2 * r + 1, mode="reflect")


def guided(I, p, r=8, eps=1e-4):
    """He et al.'s guided filter: p smoothed, its edges taken from the guide I (both float, same shape)."""
    mI, mp = box(I, r), box(p, r)
    cov = box(I * p, r) - mI * mp
    var = box(I * I, r) - mI * mI
    a = cov / (var + eps)
    b = mp - a * mI
    return box(a, r) * I + box(b, r)


def rgb_to_hsv(rgb):
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    mx, mn = rgb.max(-1), rgb.min(-1)
    d = mx - mn + 1e-6
    h = np.where(mx == r, ((g - b) / d) % 6, np.where(mx == g, (b - r) / d + 2, (r - g) / d + 4)) * 60
    return h, d / (mx + 1e-6), mx


def fill_behind(rgb, region, toward, steps):
    """Fills `region` by walking each of its pixels along `toward` (a unit field pointing away from the near thing)
    until it leaves the region, and taking the colour there: the background stretched in behind the near thing."""
    H, W = region.shape
    out = rgb.copy()
    ys, xs = np.nonzero(region)
    if not len(ys):
        return out
    dx, dy = toward[0][ys, xs], toward[1][ys, xs]
    todo = np.ones(len(ys), bool)
    for s in range(1, steps + 1):
        sx = np.clip(np.round(xs + dx * s).astype(int), 0, W - 1)
        sy = np.clip(np.round(ys + dy * s).astype(int), 0, H - 1)
        hit = todo & ~region[sy, sx]
        out[ys[hit], xs[hit]] = rgb[sy[hit], sx[hit]]
        todo &= ~hit
        if not todo.any():
            break
    if todo.any():  # what never left: the region's own blur
        blur = np.stack([nd.gaussian_filter(rgb[..., c], 6) for c in range(3)], -1)
        out[ys[todo], xs[todo]] = blur[ys[todo], xs[todo]]
    return out


def scene(sess, sid, src):
    dst = OUT / "scenes" / sid
    dst.mkdir(parents=True, exist_ok=True)
    img = Image.open(src).convert("RGB")
    W, H = img.size
    if not (dst / "photo.jpg").exists() or os.environ.get("FRESH_PHOTO"):
        img.save(dst / "photo.jpg", quality=95, subsampling=0)
    w2, h2 = W // 2, H // 2
    small = img.resize((w2, h2), Image.LANCZOS)
    rgb = np.asarray(small, np.float32) / 255.0

    raw = infer(sess, Image.open(DEPTH_FROM.get(sid, src)).convert("RGB").resize((W, H), Image.LANCZOS))
    lo, hi = np.percentile(raw, [1, 99.5])
    d = np.clip((raw - lo) / (hi - lo + 1e-6), 0, 1).astype(np.float32)
    d = np.asarray(Image.fromarray(d).resize((w2, h2), Image.BICUBIC), np.float32)
    lum = (rgb @ np.array([0.299, 0.587, 0.114], np.float32)).astype(np.float32)
    d = np.clip(guided(lum, d, r=6, eps=2e-4), 0, 1)
    d = np.clip(guided(lum, d, r=3, eps=1e-4), 0, 1).astype(np.float32)

    # the depth-edge band: where disparity jumps, on the near side, a few pixels wide
    k = max(3, w2 // 300)
    far_near = nd.grey_erosion(d, size=(2 * k + 1, 2 * k + 1))  # each pixel's farthest neighbour
    jump = (d - far_near) > 0.06  # pixels a little nearer than something close by: the rim of a near thing
    band = nd.binary_dilation(jump, iterations=1)
    bgd = nd.gaussian_filter(np.where(band, far_near, d), 1.5)
    bgd = np.where(band, bgd, d).astype(np.float32)

    gy, gx = np.gradient(nd.gaussian_filter(d, 2))
    n = np.hypot(gx, gy) + 1e-6
    toward = (-gx / n, -gy / n)  # down the disparity: away from the near thing
    bg = fill_behind(rgb, band, toward, steps=4 * k)

    hue, sat, val = rgb_to_hsv(rgb)
    tex = np.sqrt(np.maximum(box(lum * lum, 3) - box(lum, 3) ** 2, 0))
    leaves = (hue > 55) & (hue < 150) & (sat > 0.18) & (val > 0.1) & (tex > 0.025)
    leaves = nd.gaussian_filter(leaves.astype(np.float32), 2)
    water = (sat < 0.22) & (val > 0.45) & (tex < 0.05)  # flat, pale, unsaturated: lake (and sky); a region narrows it
    water = nd.gaussian_filter(water.astype(np.float32), 1.5)

    def f16(a, name):
        (dst / name).write_bytes(a.astype(np.float16).tobytes())

    f16(d, "depth.f16")
    f16(bgd, "bgdepth.f16")
    Image.fromarray((np.clip(bg, 0, 1) * 255).astype(np.uint8)).resize((W, H), Image.LANCZOS).save(dst / "bg.jpg", quality=92)
    mask = np.stack([band.astype(np.float32), leaves, water], -1)
    Image.fromarray((np.clip(mask, 0, 1) * 255).astype(np.uint8)).save(dst / "mask.png")
    Image.fromarray((d * 255).astype(np.uint8)).save(dst / "depth.png")
    meta = {"id": sid, "src": str(src), "width": W, "height": H, "dw": w2, "dh": h2}
    old = dst / "meta.json"
    if old.exists():  # render.mjs's hero still (photo.png at the film's size) survives a rerun
        prev = json.loads(old.read_text())
        for k in ("photo", "width", "height"):
            if k in prev and prev.get("photo"):
                meta[k] = prev[k]
    (dst / "meta.json").write_text(json.dumps(meta) + "\n")
    print(f"{sid}: {W}x{H}  depth {w2}x{h2}  band {band.mean() * 100:.1f}%  leaves {leaves.mean() * 100:.0f}%  water {water.mean() * 100:.0f}%")


def occluder(src_id, box, name, near=0.5, blur=2.5):
    """A near thing cut from one of the photos, for the camera to pass close by: RGBA, softened like a lens would."""
    dst = OUT / "fg"
    dst.mkdir(parents=True, exist_ok=True)
    sc = OUT / "scenes" / src_id
    meta = json.loads((sc / "meta.json").read_text())
    img = np.asarray(Image.open(sc / (meta.get("photo") or "photo.jpg")).convert("RGB"), np.float32) / 255.0
    H, W, _ = img.shape
    d = np.frombuffer((sc / "depth.f16").read_bytes(), np.float16).astype(np.float32).reshape(meta["dh"], meta["dw"])
    d = np.asarray(Image.fromarray(d).resize((W, H), Image.BICUBIC), np.float32)
    x0, y0, x1, y1 = [int(round(v)) for v in (box[0] * W, box[1] * H, box[2] * W, box[3] * H)]
    rgb, dd = img[y0:y1, x0:x1], d[y0:y1, x0:x1]
    a = np.clip((dd - near) / 0.12, 0, 1)
    a = nd.gaussian_filter(a, 1.2)
    # fade out where the cut box ends inside the picture (top and bottom stay, they run off the frame when scaled)
    h, w = a.shape
    edge = np.minimum(np.linspace(0, 1, w)[None, :] * 12, 1) * np.minimum(np.linspace(1, 0, w)[None, :] * 12, 1)
    a *= edge
    rgb = np.stack([nd.gaussian_filter(rgb[..., c], blur) for c in range(3)], -1)
    a = nd.gaussian_filter(a, blur)
    out = np.dstack([rgb, a])
    Image.fromarray((np.clip(out, 0, 1) * 255).astype(np.uint8), "RGBA").save(dst / f"{name}.png")
    print(f"fg/{name}.png  {w}x{h}  cover {a.mean() * 100:.0f}%")


def main():
    want = sys.argv[1:]
    opts = ort.SessionOptions()
    opts.intra_op_num_threads = 6
    sess = ort.InferenceSession(str(MODEL), opts, providers=["CPUExecutionProvider"])
    for sid, src in SCENES.items():
        if want and sid not in want:
            continue
        scene(sess, sid, src)
    if not want or "fg" in want:
        occluder("01", (0.1, 0.0, 0.3, 0.86), "trunk", near=0.55)
        occluder("06", (0.8, 0.0, 1.0, 0.46), "leaves", near=0.5)


if __name__ == "__main__":
    main()
