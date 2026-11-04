# The one-take film (D-074)

The homepage film is one continuous camera through the founder's photos (`~/Desktop/farm-film`, plus the parking page's
photo of the gate). It has no cut, no whip and no text, and the TikTok song «الليلة مسافر» is its soundtrack, to the
end of its singing (2:14.4). Nothing is generated. Each photo
becomes a depth scene, and a virtual camera moves through it with real parallax. Between photos, the next place takes
over in one of four ways:

- a near tree crosses the lens (**pass**);
- the frame dives into or rises out of a matched point (**zoom**), such as the sign wall, the inner gate or the studios;
- the camera walks on and the scene changes far things first (**depth**);
- drone views dissolve, matched on the farm's own buildings (**fade**).

It runs free and local: onnxruntime on the CPU for depth, WebGL in headless Chrome, and ffmpeg.

## Build it

1. Depth for every photo, plus the trunk and leaves the camera passes:

   ```sh
   assets/film/oner/.venv/bin/python -I scripts/site/film/oner/depth.py
   ```

   - The model is Depth Anything V2 Base, ONNX, kept at `assets/film/oner/models/`.
   - The env is `uv venv assets/film/oner/.venv` with onnxruntime, numpy, pillow and scipy.

2. More detail where the camera zooms toward the gates (the gate photo and the road):

   ```sh
   assets/film/oner/.venv/bin/python -I scripts/site/film/oner/sr.py P:2 02:2
   assets/film/oner/.venv/bin/python -I scripts/site/film/oner/depth.py gate   # the clean leaf, and P without its own leaves
   ```

   The model is Real-ESRGAN, ONNX (`SceneWorks/real-esrgan-onnx`), kept at `assets/film/oner/models/realesrgan/`.

3. One light for the off-light photos (08, 14, 15, 16, 17) and a light pull for the rest:

   ```sh
   assets/film/oner/.venv/bin/python -I scripts/site/film/oner/light.py
   ```

4. Look at stills, check the camera's speed (it must never crawl), then a quick proxy (960×536 at 15 fps), then the two cuts:

   ```sh
   node scripts/site/film/oner/render.mjs --stills 4,27,41
   node scripts/site/film/oner/render.mjs --speed --floor 0.025
   node scripts/site/film/oner/render.mjs --proxy
   node scripts/site/film/oner/render.mjs --form landscape
   node scripts/site/film/oner/render.mjs --form portrait
   ```

5. Add the song, and write the founder's copy to `~/Desktop/farm-film/digital-farm-film.mp4`:

   ```sh
   node scripts/site/film/oner/finish.mjs
   ```

6. Check it by the numbers: no cut, no frozen frame, the hero's frame at both ends, its length and its loudness.

   ```sh
   assets/film/oner/.venv/bin/python -I scripts/site/film/oner/check.py \
     assets/film/oner/out/film-landscape.mp4 assets/film/oner/scenes/01/photo.png
   ```

7. Encode for the homepage and publish it to the CDN (this needs the CDN's AWS identity):

   ```sh
   node scripts/site/film/film.mjs --oner
   ```

## Where things are

- `legs.mjs` holds the journey: each photo's camera keys, its joins and their matched points. Every number in it was set
  by eye on the photos.
- Before each render, `render.mjs` writes the hero stills, `scenes/01/photo.png` and `01p/photo.png`. These are
  lossless copies of the served hero, so the first and last frames match the page exactly. Rerun `depth.py` and it keeps
  them.
- `GATES` in `legs.mjs` measures the two gates in P (the parking page's photo). The renderer turns each leaf on its hinge
  in 3D as a rigid board, drawn last from `fg/gate-leaf.png`: the photo's open leaf, straightened. The left leaf is
  the mirror of the right. Each leaf opens until its free edge reaches the photo's own leaf, and the photo's own leaves
  are taken out of P (`depth.py gate`, kept in `photo-gates.jpg`).
- The film's 2:14 runs as the founder told it: the lakeside plot, the road with the lake on the right, the gate on the
  left, then the places further and further from the lake. Drone views 18 and 21 are out because they show the lake on
  the wrong side.
