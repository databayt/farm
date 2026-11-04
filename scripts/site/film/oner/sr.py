#!/usr/bin/env python3
"""The film's close-ups: more detail in the photos the camera gets very close to (D-074).

    assets/film/oner/.venv/bin/python -I scripts/site/film/oner/sr.py 17:4 16:2 P:2 02:2

Real-ESRGAN (x4 or x2, ONNX, assets/film/oner/models/realesrgan/; onnxruntime on the CPU, in overlapping tiles) on a
scene's original picture: the goats and sheep, the field's plants, the gate the camera walks up to. It adds the fine
detail a 2400-pixel picture can't hold at three times its size. It changes nothing in the scene: it is the same
picture, sharper. Then run light.py for the same scenes, so their light is made again on the new picture.

For scenes/<id>/ it keeps the picture as it was in photo-lowres.jpg and writes the larger one to photo-src.jpg (which
light.py reads; photo.jpg too, for a scene light.py leaves alone), the background layer enlarged to match (bg-src.jpg),
and the new size in meta.json. Depth stays as it is: it is read by position, not by pixel.
"""
import json
import sys
from pathlib import Path

import numpy as np
import onnxruntime as ort
from PIL import Image

ROOT = Path(__file__).resolve().parents[4]
OUT = ROOT / "assets" / "film" / "oner"
MODELS = OUT / "models" / "realesrgan"
TILE, PAD = 192, 16


def upscale(sess, img, scale):
    a = np.asarray(img.convert("RGB"), np.float32) / 255.0
    H, W, _ = a.shape
    out = np.zeros((H * scale, W * scale, 3), np.float32)
    n = 0
    for y0 in range(0, H, TILE):
        for x0 in range(0, W, TILE):
            # each tile with a margin, so the seams between tiles fall where both sides saw the same pixels
            ya, xa = max(0, y0 - PAD), max(0, x0 - PAD)
            yb, xb = min(H, y0 + TILE + PAD), min(W, x0 + TILE + PAD)
            t = a[ya:yb, xa:xb]
            h, w = t.shape[:2]
            ph, pw = (-h) % 2, (-w) % 2  # the x2 model folds pixels in pairs
            t = np.pad(t, ((0, ph), (0, pw), (0, 0)), mode="reflect")
            r = sess.run(None, {sess.get_inputs()[0].name: t.transpose(2, 0, 1)[None]})[0][0].transpose(1, 2, 0)
            r = r[: h * scale, : w * scale]
            oy, ox = (y0 - ya) * scale, (x0 - xa) * scale
            ch, cw = min(TILE, H - y0) * scale, min(TILE, W - x0) * scale
            out[y0 * scale : y0 * scale + ch, x0 * scale : x0 * scale + cw] = r[oy : oy + ch, ox : ox + cw]
            n += 1
    return Image.fromarray((np.clip(out, 0, 1) * 255 + 0.5).astype(np.uint8)), n


def main():
    opts = ort.SessionOptions()
    opts.intra_op_num_threads = 8
    sessions = {}
    for arg in sys.argv[1:]:
        sid, scale = arg.split(":")
        scale = int(scale)
        if scale not in sessions:
            sessions[scale] = ort.InferenceSession(str(MODELS / f"real_esrgan_x{scale}.onnx"), opts, providers=["CPUExecutionProvider"])
        d = OUT / "scenes" / sid
        meta = json.loads((d / "meta.json").read_text())
        low = d / "photo-lowres.jpg"
        if not low.exists():  # the picture as it came, before any upscale or relight
            src = d / "photo-src.jpg" if (d / "photo-src.jpg").exists() else d / "photo.jpg"
            Image.open(src).save(low, quality=97, subsampling=0)
            bg = d / "bg-src.jpg" if (d / "bg-src.jpg").exists() else d / "bg.jpg"
            Image.open(bg).save(d / "bg-lowres.jpg", quality=95)
        img = Image.open(low)
        big, tiles = upscale(sessions[scale], img, scale)
        big.save(d / "photo-src.jpg", quality=95, subsampling=0)
        big.save(d / "photo.jpg", quality=95, subsampling=0)  # until light.py writes its own
        bg = Image.open(d / "bg-lowres.jpg").resize(big.size, Image.LANCZOS)
        bg.save(d / "bg-src.jpg", quality=92)
        bg.save(d / "bg.jpg", quality=92)
        meta.update(width=big.size[0], height=big.size[1], upscale=scale)
        (d / "meta.json").write_text(json.dumps(meta) + "\n")
        print(f"{sid}: {img.size[0]}x{img.size[1]} -> {big.size[0]}x{big.size[1]} (x{scale}, {tiles} tiles)")


if __name__ == "__main__":
    main()
