# The film

Status: 2026-11-02. The homepage film is a walk (D-070). It starts as the homepage hero, at the lake plot, and plays in the hero itself when someone clicks "Watch film". The cut is live with slow pushes on the place heroes. Next, the founder makes the group of scene images in Nano Banana (no API); then they are edited into the film.

A walk of about 80 seconds. It leaves the lake plot, takes the road to the compound, goes through the gate, the parking and the inner gate, and passes every place as the homepage 2D lays them out. Each place looks as its remastered hero does. Short vertical reels can be cut from the same material.

## What we have

| Material | Where | Use |
|---|---|---|
| The homepage hero, the lake plot remastered | `assets/hero/desktop.jpeg`, `mobile.jpeg` | The film's first and last frame |
| Every place's remastered hero | `public/designs/<place>/render/<place>-hero.jpg` | Each place in the film |
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

The list lives in `scripts/site/film/shots.mjs`; the previz, the founder's folders and the cut all read it.

| # | Seconds | Shot | Starts from |
|---|---|---|---|
| 01 | 8 | The lake plot: the hero comes alive and turns toward the road | the homepage hero itself |
| 02 | 6 | The road along the palm row, the lake between the trunks | a Nano Banana still, made first |
| 03 | 5 | The gate beside the DIGITAL FARM sign wall | the parking's hero |
| 04 | 4 | The parking: gravel bays in timber, solar lamps | a Nano Banana still, made first |
| 05 | 5 | Through the inner gate into the courtyard | a Nano Banana still, made first |
| 06 | 5 | The camp and the fire pit | the camp's hero |
| 07 | 6 | The studios, up to a roof terrace | the studio's hero |
| 08 | 4 | The office | the office's hero |
| 09 | 5 | The guest rooms | the guest room's hero |
| 10 | 5 | The bar | the bar's hero |
| 11–13 | 3 each | The back row: the study room, the galley, the public bathroom | their heroes |
| 14 | 4 | Volleyball | its hero |
| 15 | 4 | Dining under the thatch | its hero |
| 16 | 4 | The field | its hero |
| 17 | 3 | Livestock | its hero |
| 18 | 8 | The farm from above, the lake in the distance; then back to the lake picture | a Nano Banana still, made first |

## The scene images

The film is edited from one group of pictures, made in Nano Banana from the folders in `~/Desktop/farm-scenes-nano-banana/` (`node scripts/site/walk.mjs --scenes`, then `node scripts/site/film/scenes-pack.mjs`; the list is `scripts/site/film/scenes.mjs`):

- **Part A, the whole farm:** six angles: from above the gate, straight down, over the field, over the east lawn, from behind the back row, and low over the courtyard. Each has the full area and every place in it.
- **Part B, the walk:** eighteen stops at eye level, a cameraman's walk from the lake plot to the livestock, in the lake picture's light and matched to the A1 picture.

Each folder holds the homepage 3D at that angle, painted in the places' remastered colours (where everything stands), a board of every place's photo (how each looks), the real land from the hill and the light, plus the prompt.

## Steps

1. **Previz:** `pnpm site:walk` renders each shot's start and end from the 3D model, plus a timing animatic, into `assets/film/`.
2. **Folders:** `node scripts/site/film/packs.mjs` writes one folder per shot to `~/Desktop/film-walk/`. Each holds the frame to animate, the references for a still and `prompt.txt`.
3. **Clips:** the founder makes each clip in the Gemini app or Flow (Veo) and saves it as `clip.mp4` in its folder. Shot 01 also gets an upright clip for phones.
4. **Cut:** `pnpm site:film` collects the clips and cuts the film. Each shot plays its clip, or a slow push on its picture until the clip exists. The film opens and closes on the hero's own picture, at its crop. It publishes `cdn.databayt.org/farm/home/film.mp4` and `film-portrait.mp4`, and writes `src/components/home/film.generated.ts`.
5. **Check:** no faces, no plates, no AI-made text; the start shows no jump when Watch film is clicked; then deploy.

## Film on the next site visit

1. A fixed phone filming the studio fit-out, one frame every 10 seconds, from Day 1: the build as a time-lapse.
2. Golden-hour pans of the lawn, the lake plot and the road between the two plots.
3. Close-ups: timber, the planted beds, the fire.
4. The volleyball court, the gate opening, a car arriving (plates out of frame).
5. Each clip sent as a "Document", not as a video.
