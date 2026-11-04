# The film

Status: 2026-11-04. The homepage film is one continuous take (D-074). It starts as the homepage hero and plays in the hero itself when someone clicks "Watch film". It is made here, free and local, from the founder's photos, by `scripts/site/film/oner/` (its README has the steps).
- Each photo becomes a depth scene, and one camera moves through them all with real parallax. It never cuts, stops or flips.
- Each next place takes over while the camera moves: behind a near tree, through a rise or a dive matched on the sign wall, the gates or the field, by walking on, or as matched drone views.
- It carries no text, and the founder's chosen song is its sound.
- The founder's copy is `digital-farm-film.mp4` in `~/Desktop/farm-film/`.

The film runs 2 minutes 14 seconds, to the end of the song's singing. The journey is the founder's:
1. **The first land:** the hero is the cameraman's view from the road, zoomed in on the lakeside plot. He zooms back to show it, then turns left.
2. **The road:** he goes down it with the lake on the right, to the second land's gate on the left.
3. **The outer gate:** it opens slowly, and he goes in, past the volleyball lawn, and up the drive.
4. **The inner gate:** it opens too.
5. **The places:** every one in turn, further and further from the lake, close on the field's plants and on the goats and sheep.
6. **Home:** the drone rises over the map of the farm and flies back over the gate to the lake.

## What we have

| Material | Where | Use |
|---|---|---|
| The homepage hero, the lake plot remastered | `assets/hero/desktop.jpeg`, `mobile.jpeg` | The film's first and last frame |
| Every place's remastered hero | `public/designs/<place>/render/<place>-hero.jpg` | Each place in the film |
| The founder's scene images (Nano Banana): A1–A6, B02, B06–B08 | `assets/film/masters/<scene>.jpg` (local) | The road, the walk in and the aerials |
| The 3D compound with a walking camera | `scripts/site/render/compound.html?walk=1` | The previz: where each shot stands |
| 23 iPhone clips and 23 photos, 2026-10-25 (1920 × 1080, 10-bit HDR) | `assets/library/footage/2026-10-25/` (private) | References for the road, the gate and the light |
| The owner's and SIDA's WhatsApp photos and clips | `assets/library/whatsapp/` (private) | References only: WhatsApp shrinks video to about 368 × 656 |

The lake is ours: a second plot about 5 minutes by road from the compound (D-070). The footage agrees: the lake clips end at 16:31 and the gate clip starts at 16:37.

## The rules

1. No recognisable person without their consent, and no number plates (D-018, D-019).
2. Anything made or changed by AI is shown as a concept, never as "today". The hero picture's alt text says so.
   - The film itself carries no text, and no caption plays over it (D-074, the founder's call).
3. The voice is a stock AI voice or no voice, with music or the clips' own natural sound, never a cloned voice.
   - The film's sound is the song the founder chose (D-074).
4. Every shot of the farm to come follows the owner's brief (D-029) and looks as its place's remastered hero does.

## The take, place by place

The journey lives in `scripts/site/film/oner/legs.mjs`. The photo numbers are the ones in `~/Desktop/farm-film/`; P is the parking page's photo of the gate.

| Seconds | Place | Into the next |
|---|---|---|
| 0–8 | 01 the hero: the lakeside plot, zoomed in from the road | the camera zooms back out into the road |
| 1–26 | 02 the lakeside plot behind the fence, then the road, the lake on the right, the gate on the left | turning to the gate, matched on the sign wall |
| 22–33 | P the outer gate, face on: it opens, and the camera walks in | past a pine |
| 30–38 | 14 the volleyball lawn inside the gate | past mango leaves |
| 36–46 | P up the drive: the inner gate opens | a dive through it |
| 43–55 | 04 the inner gate, then 05 the camp | walking on (the fire pit) |
| 53–93 | 10, 09, 08, 06, 11, 12, 13, 15: guest rooms, bar, office, studios, study room, galley, public bathroom, dining | past a tree each time; the study room's teal box turns into the galley's |
| 90–102 | 16 the field, close among the beds, the plants and the baskets | past mango leaves |
| 99–111 | 17 the livestock, close on the goats and the sheep | a rise: the farm below |
| 108–121 | 19 straight down, the map, turning half round | matched drone views |
| 119–129 | 20 from behind the back row, toward the gate and the lake beyond it | over the trees to the lake |
| 125–134 | 01 the lake plot: it settles on the hero's frame as the singing ends | — |

Drone views 18 and 21 show the lake beyond the far side of the farm, the wrong side, so they are out; 07 is out for time.

Five photos were in another light and are relit to the farm's afternoon from their own depth: 08 the office, 14 volleyball, 15 dining, 16 the field and 17 the livestock.

Four photos are upscaled locally (Real-ESRGAN, `sr.py`) so the camera can go close: 17 at four times, and 16, P and 02 at twice. The founder's photos are never changed; the working copies are in `assets/film/oner/scenes/`.

## The scene images

The film is edited from one group of pictures, made in Nano Banana from the folders in `~/Desktop/farm-scenes-nano-banana/` (`node scripts/site/walk.mjs --scenes`, then `node scripts/site/film/scenes-pack.mjs`; the list is `scripts/site/film/scenes.mjs`):

- **Part A, the whole farm:** six angles: from above the gate, straight down, over the field, over the east lawn, from behind the back row, and low over the courtyard. Each has the full area and every place in it.
- **Part B, the walk:** eighteen stops at eye level, a cameraman's walk from the lake plot to the livestock, in the lake picture's light and matched to the A1 picture.

Each folder holds the homepage 3D at that angle, painted in the places' remastered colours (where everything stands), a board of every place's photo (how each looks), the real land from the hill and the light, plus the prompt.

## Steps

1. **Depth, detail and light:** run `depth.py`, `sr.py` and `light.py` in `scripts/site/film/oner/`. They write `assets/film/oner/scenes/`, which is local and gitignored.
2. **Look:** `render.mjs --stills <seconds>` renders single frames, and `--proxy` renders the whole film at half size.
3. **Render:** `render.mjs --form landscape`, then `--form portrait`, then `finish.mjs`. That adds the song and writes the founder's copy.
4. **Check:** `render.mjs --speed` confirms the camera never slows below a floor. `check.py` tests the film by the numbers: no cut, the hero's frame at both ends, the length and the loudness.
5. **Publish:** `node scripts/site/film/film.mjs --oner` encodes the film for the web and publishes `cdn.databayt.org/farm/home/film.mp4` and `film-portrait.mp4`. Then deploy.

The founder's folder still works the old way, as a fallback: a `film.mp4` or `NN.mp4` made in Gemini or Flow and cut by `pnpm site:film` without `--oner`.

## Film on the next site visit

1. A fixed phone filming the studio fit-out, one frame every 10 seconds, from Day 1: the build as a time-lapse.
2. Golden-hour pans of the lawn, the lake plot and the road between the two plots.
3. Close-ups: timber, the planted beds, the fire.
4. The volleyball court, the gate opening, a car arriving (plates out of frame).
5. Each clip sent as a "Document", not as a video.
