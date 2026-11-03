# The film

Status: 2026-11-03. The homepage film is a walk (D-070). It starts as the homepage hero, at the lake plot, and plays in the hero itself when someone clicks "Watch film". The live cut is made from the founder's scene images (the whole farm from six angles, the road, the inner gate, the camp, the studios) and the place heroes, each with a slow camera move. Next, the founder makes the film himself in Gemini or Flow (Veo, no API) from one folder, `~/Desktop/farm-film/`: the 21 photos in order and one prompt. His film replaces the stills with no code change.

A walk of about 80 seconds. It leaves the lake plot, takes the road to the farm, rises over the gate to show the whole farm, comes down through the inner gate and passes every place as the homepage 2D lays them out, then flies over the farm from every side and back to the lake. Each place looks as its remastered hero does. Short vertical reels can be cut from the same material.

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
2. Anything made or changed by AI is shown as a concept, never as "today". While the film plays, the hero reads "Concept film".
3. The voice is a stock AI voice or no voice, with music or the clips' own natural sound; never a cloned voice.
4. Every shot of the farm to come follows the owner's brief (D-029) and looks as its place's remastered hero does.

## The walk, shot by shot

The list lives in `scripts/site/film/shots.mjs`; the founder's folder and the cut both read it. The photo numbers in `~/Desktop/farm-film/` are the shot numbers.

| # | Seconds | Shot | Photo |
|---|---|---|---|
| 01 | 6 | The lake plot: the hero comes alive and turns toward the road | the homepage hero itself |
| 02 | 5 | The road beside the lake, toward the sign wall and the gate | scene B02 |
| 03 | 7 | Up over the gate: the whole farm | scene A1 |
| 04 | 5 | Down through the inner gate into the courtyard | scene B06 |
| 05 | 5 | The camp and the fire pit | scene B07 |
| 06 | 5 | Between the studios | scene B08 |
| 07 | 5 | Low over the courtyard | scene A6 |
| 08–10 | 4 each | The office, the bar, the guest rooms | their heroes |
| 11–13 | 3 each | The back row: the study room, the galley, the public bathroom | their heroes |
| 14–17 | 3 each | Volleyball, dining under the thatch, the field, livestock | their heroes |
| 18 | 4 | Over the field | scene A3 |
| 19 | 5 | Straight down, like the plan | scene A2, cut above the sign |
| 20 | 4 | From behind the back row | scene A5 |
| 21 | 6 | Toward the lake, and back to the hero | scene A4, cut toward the lake |

The office shot uses its hero: its scene image (B10) came out with the 3D model's blocky flowers in its planters. The parking, the terrace and the other walk scenes are not made yet; the aerials and the heroes cover them.

## The scene images

The film is edited from one group of pictures, made in Nano Banana from the folders in `~/Desktop/farm-scenes-nano-banana/` (`node scripts/site/walk.mjs --scenes`, then `node scripts/site/film/scenes-pack.mjs`; the list is `scripts/site/film/scenes.mjs`):

- **Part A, the whole farm:** six angles: from above the gate, straight down, over the field, over the east lawn, from behind the back row, and low over the courtyard. Each has the full area and every place in it.
- **Part B, the walk:** eighteen stops at eye level, a cameraman's walk from the lake plot to the livestock, in the lake picture's light and matched to the A1 picture.

Each folder holds the homepage 3D at that angle, painted in the places' remastered colours (where everything stands), a board of every place's photo (how each looks), the real land from the hill and the light, plus the prompt.

## Steps

1. **Scene images:** the founder's pictures go into `~/Desktop/farm-scenes-nano-banana/<scene>/master.jpg`; `node scripts/site/film/scenes-pack.mjs` copies them into `assets/film/masters/` (local, gitignored).
2. **The folder:** `node scripts/site/film/packs.mjs` writes `~/Desktop/farm-film/`: the 21 photos, numbered in the film's order, and `prompt.txt`, one prompt for the whole film with a line per photo.
3. **The film:** the founder attaches the photos, pastes the prompt and saves the result there as `film.mp4`. If his app takes one photo at a time, he makes a clip per photo and saves it by its number (`03.mp4`).
4. **Cut:** `pnpm site:film` collects them and cuts the film: his whole film between the hero's opening and close, or each shot's clip, or a slow move on its photo until the clip exists. The film opens and closes on the hero's own picture, at its crop. It publishes `cdn.databayt.org/farm/home/film.mp4` and `film-portrait.mp4`, and writes `src/components/home/film.generated.ts`.
5. **Check:** no faces, no plates, no AI-made text; the start shows no jump when Watch film is clicked; then deploy.
6. **Previz** (optional): `pnpm site:walk` renders the place shots' start and end from the 3D model into `assets/film/previz/`.

## Film on the next site visit

1. A fixed phone filming the studio fit-out, one frame every 10 seconds, from Day 1: the build as a time-lapse.
2. Golden-hour pans of the lawn, the lake plot and the road between the two plots.
3. Close-ups: timber, the planted beds, the fire.
4. The volleyball court, the gate opening, a car arriving (plates out of frame).
5. Each clip sent as a "Document", not as a video.
