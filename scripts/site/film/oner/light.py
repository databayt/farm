#!/usr/bin/env python3
"""The film's light: one late afternoon over all the photos of the one-take film.

    assets/film/oner/.venv/bin/python -I scripts/site/film/oner/light.py [id ...]

Most of the founder's photos share a warm late-afternoon light. Five do not: 08 the office (flat), 14 volleyball (a
deep sunset), 15 dining, 16 the field and 17 the livestock (overcast). In one continuous take the light can't jump, so
those five are relit from their own depth (depth.py): a warm sun from one side, shading by the surface's normal, a
warmer sky, then the colours matched to the photos in the right light. Everything else gets a light pull toward the same
colours, so the 21 read as one place at one hour. The hero (01, 01p) is never touched: the film opens and closes on it.

It reads scenes/<id>/photo.jpg as first written (kept as photo-src.jpg) and writes photo.jpg and bg.jpg in its place,
with the same light on both (a smooth gain, so the background behind near things gets it too). Nothing is generated:
the light comes from the picture and its depth.
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage as nd

ROOT = Path(__file__).resolve().parents[4]
SC = ROOT / "assets" / "film" / "oner" / "scenes"

RELIGHT = {
    # id: sun side (-1 from the left, +1 from the right), sun strength, how far the light's colour moves to the film's
    "08": (-1, 0.8, 0.8),
    "14": (-1, 0.0, 0.7),
    "15": (+1, 0.7, 0.5),
    "16": (-1, 0.9, 0.85),
    "17": (-1, 0.9, 0.85),
}
REFERENCE = ["03", "05", "06", "07", "10", "13"]  # the photos in the film's light
UNIFY = 0.35  # how far every other photo's light moves toward the film's
HERO = {"01", "01p"}


def lin(c):
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)


def srgb(c):
    c = np.clip(c, 0, 1)
    return np.where(c <= 0.0031308, c * 12.92, 1.055 * np.power(c, 1 / 2.4) - 0.055)


def lum(x):
    return x @ np.array([0.2126, 0.7152, 0.0722], np.float32)


def white_point(L):
    """The light's colour: the mean of the bright, near-neutral pixels (clouds, white walls, pale sky), unit luminance."""
    y = lum(L)
    mx, mn = L.max(-1), L.min(-1)
    sat = (mx - mn) / (mx + 1e-6)
    pick = (y > np.percentile(y, 85)) & (sat < 0.3)
    if pick.sum() < 500:
        pick = y > np.percentile(y, 90)
    wp = L[pick].mean(0)
    return wp / lum(wp)


def tone(L, contrast, saturation):
    """Contrast in log luminance around its mean, then saturation, keeping each pixel's hue. The brightest tenth (sky,
    white walls) keeps its own contrast, so nothing clips."""
    y = np.clip(lum(L), 1e-5, None)
    ly = np.log(y)
    m = ly.mean()
    hi0, hi1 = np.percentile(y, [80, 99])
    keep = np.clip((y - hi0) / (hi1 - hi0 + 1e-6), 0, 1)
    c = 1 + (contrast - 1) * (1 - keep * keep * (3 - 2 * keep))
    y2 = np.exp((ly - m) * c + m)
    out = L * (y2 / y)[..., None]
    y3 = lum(out)[..., None]
    return y3 + (out - y3) * saturation


def load(sid, name="photo.jpg"):
    return np.asarray(Image.open(SC / sid / name).convert("RGB"), np.float32) / 255.0


def depth_full(sid, shape):
    meta = __import__("json").loads((SC / sid / "meta.json").read_text())
    d = np.frombuffer((SC / sid / "depth.f16").read_bytes(), np.float16).astype(np.float32).reshape(meta["dh"], meta["dw"])
    img = Image.fromarray(d)
    return np.asarray(img.resize((shape[1], shape[0]), Image.BICUBIC), np.float32)


def normals(d, hfov=50.0):
    """Camera-space normals (x right, y down, z forward) from disparity, via depth with near 1 and far 40."""
    H, W = d.shape
    z = 1.0 / (np.clip(d, 0, 1) * (1.0 - 1 / 40.0) + 1 / 40.0)
    z = nd.gaussian_filter(z, 3)
    tx = np.tan(np.radians(hfov / 2))
    ty = tx * H / W
    u = (np.arange(W) + 0.5) / W * 2 - 1
    v = (np.arange(H) + 0.5) / H * 2 - 1
    P = np.stack([z * u[None, :] * tx, z * v[:, None] * ty, z], -1)
    n = np.cross(np.gradient(P, axis=1), np.gradient(P, axis=0))
    n /= np.linalg.norm(n, axis=-1, keepdims=True) + 1e-9
    return np.where(n[..., 2:3] > 0, -n, n)  # face the camera


def relight(sid, side, strength, transfer, target):
    src = SC / sid / "photo-src.jpg"
    if not src.exists():
        (SC / sid / "photo.jpg").rename(src)
        (SC / sid / "bg.jpg").rename(SC / sid / "bg-src.jpg")
    rgb = load(sid, "photo-src.jpg")
    bg = load(sid, "bg-src.jpg")
    H, W, _ = rgb.shape
    L = lin(rgb)
    # 1. the light's colour moved to the film's (von Kries: one gain per channel), part of the way
    wp = white_point(L)
    g_wb = (target / wp) ** transfer
    g_wb /= lum(g_wb)
    out = L * g_wb
    if strength > 0:
        # 2. a sun from one side: surfaces facing it brighter and warmer, the rest a touch cooler
        d = depth_full(sid, (H // 2, W // 2))
        dd = depth_full(sid, (H, W))
        top = np.linspace(1, 0, H)[:, None] ** 0.7
        sky = np.clip((0.07 - dd) / 0.07, 0, 1) * top  # the far and the sky: no surfaces for a sun to light
        n = normals(d)
        sun = np.array([0.62 * side, -0.48, -0.62], np.float32)
        sun /= np.linalg.norm(sun)
        k = nd.gaussian_filter(np.clip((n * sun).sum(-1), 0, 1), 2)
        k = np.asarray(Image.fromarray(k.astype(np.float32)).resize((W, H), Image.BICUBIC), np.float32)
        k = (k - k.mean())[..., None] * (1 - sky[..., None])
        warm = np.array([1.10, 1.0, 0.82], np.float32)
        out = out * (1 + 0.9 * strength * k * warm)
        # 3. the flat light made sunnier: more contrast and colour
        out = tone(out, 1 + 0.22 * strength, 1 + 0.12 * strength)
        # 4. an overcast sky warmed to the late afternoon, its clouds kept (a tint of unit luminance: no brighter)
        tint = np.array([1.13, 1.0, 0.82], np.float32)
        tint /= lum(tint)
        sk = sky[..., None] * 0.6
        out = out * (1 - sk) + out * tint * sk
    # the same exposure as before
    out *= np.exp(np.log(np.clip(lum(L), 1e-4, None)).mean() - np.log(np.clip(lum(out), 1e-4, None)).mean())
    total = out / np.clip(L, 1e-4, None)
    total = np.stack([nd.gaussian_filter(total[..., c], 1.0) for c in range(3)], -1)
    Image.fromarray((srgb(out) * 255 + 0.5).astype(np.uint8)).save(SC / sid / "photo.jpg", quality=95, subsampling=0)
    Image.fromarray((srgb(lin(bg) * total) * 255 + 0.5).astype(np.uint8)).save(SC / sid / "bg.jpg", quality=92)
    print(f"{sid}: light {np.round(wp, 3)} -> {np.round(target, 3)} x{transfer}" + (f", sun {'left' if side < 0 else 'right'} {strength}" if strength else ""))


def main():
    want = sys.argv[1:]
    ids = sorted(p.name for p in SC.iterdir() if (p / "meta.json").exists())
    refs = [lin(load(r, "photo-src.jpg" if (SC / r / "photo-src.jpg").exists() else "photo.jpg")) for r in REFERENCE]
    target = np.median([white_point(r) for r in refs], 0)
    target /= lum(target)
    print("the film's light:", np.round(target, 3))
    for sid in ids:
        if sid in HERO or (want and sid not in want):
            continue
        side, strength, transfer = RELIGHT.get(sid, (0, 0.0, UNIFY))
        relight(sid, side, strength, transfer, target)


if __name__ == "__main__":
    main()
