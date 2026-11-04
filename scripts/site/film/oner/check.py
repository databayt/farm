#!/usr/bin/env python3
"""Checks the one-take film against its rules (D-074), by the numbers.

    assets/film/oner/.venv/bin/python -I scripts/site/film/oner/check.py <film.mp4> [hero.png]

  no cut      every frame's change from the one before stays near its neighbours' (a cut is a spike)
  no stop     the picture keeps moving: between the opening and the close, no run of still frames
  the hero    the first and the last frame match the hero's served picture (mean difference in 1/255)
  length      the film runs as long as legs.mjs says (the song, to the end of its singing)
  loudness    -16 LUFS, give or take 1
Prints each with PASS or FAIL, and the worst moments by time, so they can be looked at.
"""
import json
import subprocess
import sys

import numpy as np

film = sys.argv[1]
hero = sys.argv[2] if len(sys.argv) > 2 else None
info = json.loads(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "stream=codec_type,width,height,r_frame_rate:format=duration",
                                  "-of", "json", film], capture_output=True, text=True).stdout)
v = next(s for s in info["streams"] if s["codec_type"] == "video")
num, den = map(int, v["r_frame_rate"].split("/"))
fps = num / den
dur = float(info["format"]["duration"])
w, h = 192, max(2, round(192 * v["height"] / v["width"] / 2) * 2)
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", film, "-vf", f"scale={w}:{h}:flags=area,format=gray", "-f", "rawvideo", "-"],
                     capture_output=True).stdout
fr = np.frombuffer(raw, np.uint8).reshape(-1, h, w).astype(np.float32)
n = len(fr)
mad = np.abs(np.diff(fr, axis=0)).mean(axis=(1, 2))  # change from frame i to i+1
ok = True


def report(name, passed, detail):
    global ok
    ok &= passed
    print(f"{'PASS' if passed else 'FAIL'}  {name:9} {detail}")


# a cut: a change several times larger than the frames round it (a fast move rises smoothly, a cut jumps)
k = 7
pad = np.pad(mad, k, mode="edge")
local = np.array([np.median(np.r_[pad[i:i + k], pad[i + k + 1:i + 2 * k + 1]]) for i in range(len(mad))])
spike = mad / np.maximum(local, 0.35)
worst = np.argsort(spike)[::-1][:5]
report("no cut", spike.max() < 3.0, f"largest jump x{spike.max():.2f} the frames round it, at " + ", ".join(f"{(i + 1) / fps:.2f}s (x{spike[i]:.1f})" for i in worst))
# a stop: frames that do not change (grain alone moves a little), outside the hero's still opening and close
inner = slice(int(2.4 * fps), int((dur - 1.6) * fps))
still = mad[inner] < 0.12
runs, cur, start = [], 0, 0
for i, s in enumerate(still):
    if s:
        cur += 1
        if cur == 1:
            start = i
    else:
        if cur >= int(0.5 * fps):
            runs.append((start, cur))
        cur = 0
report("no stop", not runs, "no still run of half a second" if not runs else "still at " + ", ".join(f"{(s + inner.start) / fps:.1f}s for {c / fps:.1f}s" for s, c in runs[:5]))
if hero:
    from PIL import Image
    H = np.asarray(Image.open(hero).convert("RGB"), np.float32)
    for name, sel in (("first", "select=eq(n\\,0)"), ("last", f"select=eq(n\\,{n - 1})")):
        one = subprocess.run(["ffmpeg", "-v", "error", "-i", film, "-vf", sel + ",format=rgb24", "-frames:v", "1", "-f", "rawvideo", "-"],
                             capture_output=True).stdout
        F = np.frombuffer(one, np.uint8).reshape(v["height"], v["width"], 3).astype(np.float32)
        if F.shape != H.shape:
            H2 = np.asarray(Image.open(hero).convert("RGB").resize((v["width"], v["height"]), Image.LANCZOS), np.float32)
        else:
            H2 = H
        d = np.abs(F - H2).mean()
        report(f"{name} frm", d <= 3.0, f"{d:.2f}/255 from the hero")
import re
from pathlib import Path
LENGTH = float(re.search(r"export const LENGTH = ([0-9.]+)", (Path(__file__).parent / "legs.mjs").read_text()).group(1))
report("length", abs(dur - LENGTH) < 0.1, f"{dur:.2f} s of {LENGTH} ({n} frames at {fps:g} fps)")
lo = subprocess.run(["ffmpeg", "-v", "info", "-nostats", "-i", film, "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr
I = [l for l in lo.splitlines() if l.strip().startswith("I:")]
if I:
    lufs = float(I[-1].split()[1])
    report("loudness", abs(lufs + 16) <= 1.0, f"{lufs:.1f} LUFS")
else:
    print("----  loudness  no sound in this file")
sys.exit(0 if ok else 1)
