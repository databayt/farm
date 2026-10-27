# Render brief — the Digital Farm homepage

Status: Stage 6 · Date: 2026-10-26 · For whoever renders the homepage's images and video (D-017, D-018)

The homepage shows the compound as it is planned, not as it stands. Its images and video are **concept renders**, made from the prompts below in your own tools. Each render is anchored on reference frames from the site footage of 2026-10-25, so the land, the lake, the light and the containers stay true to the place. On the site every render is captioned "Concept render · planned". Until a render exists, a people-free frame of the footage stands in for it, captioned "Today · 2026-10-25" (D-019). The real photographs also appear in the before/after sliders. No paid generation API is used (D-018).

## 1. How to render

1. **Pick a tool.** For stills: ChatGPT images, the Gemini app (Nano Banana), Midjourney or Higgsfield. For video: Veo 3.1 (the Gemini app or Flow), Kling, Runway or Sora. Use a plan that does not stamp a visible watermark.
2. **Attach the references.** Each render has a folder of frames at `assets/reference/<id>/`, made by `pnpm site:refs` from `public/footage` with all metadata (GPS) stripped. `assets/reference/contact-sheet.jpg` shows them all at once. On another machine, copy `assets/reference/` across; it isn't in git.
3. **Paste the prompt,** then the site bible (§3), then the reference line (§3).
4. **Keep the best of a few tries.** Check it against the QA list (§7).
5. **Save it as `assets/renders/<id>.png`** for a still or `assets/renders/<id>.mp4` for a video, using the exact id below.
6. **Run `pnpm site:assets`.** It makes the web sizes, the blur placeholders and the video encodes, and the homepage picks them up. Each render replaces the footage standing in for its slot.

**Format.** Stills are 16:9 unless noted, at the largest size the tool offers (2560 px wide or more), as PNG or the best JPEG. Videos are image-to-video from the approved still (frame 1), 8 s (5–6 s is fine; the site loops it), 1080p, one continuous shot, with no music and no text.

**Priority.** P0 renders are needed before the new homepage goes live. P1 renders improve it. P2 is optional. Placeholders show until each file lands.

## 2. The planned compound (every render must agree)

- **Entrance.** An outer gate of galvanised five-bar tubular leaves stands between fieldstone posts. Beside it, a low fieldstone sign wall carries the words **DIGITAL FARM**. Behind the gate are a green parking lawn of grass pavers under shade trees, a **rock road** of hand-laid local stone setts (Rwandan pavé), and an **inner gate** of eucalyptus slats on an oxide-red steel frame.
- **Orientation (corrected by the founder on 2026-10-27, D-022).** North is the public road and the gates; the lake lies to the south, beyond a band of trees. Walking in from the gate you face the lake.
- **The tenant courtyard.** A level lawn with the existing round fieldstone fire pit, laid out as an L (confirmed by the founder on 2026-10-26):
  - **The bar:** one 20 ft container in oxide red with a serving hatch and counter onto the courtyard (today's red kiosk), standing in the same line as the guest-room block, at its south end, at the corner of the L next to the office.
  - **West side (on the right as you walk in):** the guest-room block. Two 40 ft containers are joined side by side into one long, low saffron-yellow building, about 12 × 4.9 m. It holds three en-suite rooms, each about 19 m² [E, D-017] with a bed, shower and WC but no kitchen. Each room has an oxide-red door and window onto a shared eucalyptus veranda.
  - **South side, at 90° (across the lawn as you walk in):** three 20 ft containers in a row on the existing raised oxide-red steel decks, their decks facing the courtyard. The **first, next to the guest rooms, is the farm office** in saffron yellow; the other two are **studios** in deep oxide red, built to the studio design (`/en/studio`, Layout B, D-020): a 3 m sliding glass wall onto a deck under a tinted clear canopy, a galley kitchen, a two-seat sofa, a shower and WC, and an open roof terrace behind a post-and-rail guardrail, with no canopy over it.
  - **Further out, toward the lake:** one 40 ft **study and training room** in muted teal, its west end in line with the guest-room block, with tall glazed doors along its north side onto a timber deck.
- **Outdoors (from the 2026-10-25 footage, D-022).** A small camping lawn between the guest rooms and the fire pit, ending at the fire pit's west edge and set a little toward the inner gate: six light-canvas pop-up dome tents (about 2.5 m across), doors toward the fire. Log stools in a ring round the fire pit. A long eucalyptus table with two benches on the lawn in front of the middle studio, where today's unfinished timber platform stands.
- **Seven containers in all** (the bar, the joined pair, the office, two studios, the study room). Nothing is stacked, and nothing else is built. The compound sits back from the lake behind a band of trees; nothing new stands at the water's edge (the 50 m lake buffer).

## 3. Site bible and reference line

Append the site bible to every still prompt:

```text
Setting: a small farm compound on a gentle slope above a lake in Gashora, Bugesera District, eastern Rwanda: low rolling hills, never mountains; red-brown laterite soil with small stones; short even green lawn; tall slender eucalyptus and grevillea in lines along the lake shore; young neem and acacia shade trees; euphorbia tirucalli hedges; a calm lake with a low wooded far shore beyond the trees. Buildings are converted steel shipping containers (2.6 m tall, corrugated) in the farm's own colours, freshly repainted satin: saffron yellow, deep oxide red, muted teal; oxide-red window frames, door frames and tubular railings; new honey-brown eucalyptus decks, steps and slatted screens; fieldstone plinths, kerbs and walls. A real architectural photograph: natural colour, true textures, crisp detail, straight verticals, no HDR glow, no lens flare, no CGI look. No text, logos or watermarks unless asked. People few, small, natural, faces not recognisable. Avoid: palm-beach resort, mountains, safari clichés, stacked or extra containers, warped corrugations, garbled letters, oversaturation.
```

When references are attached, add the reference line:

```text
Use the reference photos for the place — landscape, lake, light, ground and the containers' real shape and colours — but show the finished, planned state described here.
```

## 4. Stills

### `gate` and `gate-portrait` · P0 · 16:9 and 9:16

References: `assets/reference/gate/` (IMG_3159 at 0 s, IMG_3160 at 8.9 s). The homepage opens on this frame, and the hero video starts from it.

```text
The farm's entrance at golden hour, seen at eye level from the public dirt road. New galvanised five-bar tubular gates, both leaves open, between two square fieldstone gateposts. Beside the left post, a low fieldstone sign wall (about 1 m high and 3 m long) with raised brushed-steel capital letters reading exactly DIGITAL FARM in a clean geometric sans-serif, the only text in the image. Through the gate, a green parking lawn under young shade trees, then the tops of saffron-yellow and oxide-red containers in front of tall eucalyptus with a glimpse of lake. Euphorbia hedges run away from both posts; red laterite verge; warm low sun from the right; long soft shadows. 24 mm lens, camera 1.6 m high, centred one-point perspective.
```

For `gate-portrait`, add: `Composed vertically for a phone: the gate and the sign wall in the lower half, sky and trees above.`

### `parking` · P1 · 16:9

References: `assets/reference/parking/` (IMG_3160 at 3 s and 0 s).

```text
Just inside the gate, a green parking lawn of grass-paver blocks, grass growing through a concrete grid. Five bays separated by eucalyptus wheel stops. A white four-by-four and a small silver hatchback (number plates unreadable) sit in the dappled shade of young broad-canopied trees. Low fieldstone kerbs, a euphorbia boundary hedge, and the cobbled rock road starting at the far corner. The eucalyptus line and a hint of lake behind. Late-afternoon sun. 28 mm lens, camera 1.6 m high, three-quarter view.
```

### `road` · P0 · 16:9

References: `assets/reference/road/` (IMG_3195 at 2.3 s, IMG_3194 at 38.3 s).

```text
The rock road inside the farm: 4 m wide, hand-laid local stone setts in warm grey and ochre (the Rwandan pavé style), with fieldstone edging. It curves gently between low euphorbia hedges and young trees on red laterite soil. About 60 m ahead stands the open inner gate between fieldstone pillars, with container roofs beyond. Golden hour, the sun low behind the camera's left shoulder, hedge shadows striping the stones. 35 mm lens, camera 1.5 m high, vanishing point right of centre.
```

### `inner-gate` · P0 · 16:9

References: `assets/reference/inner-gate/` (IMG_3159 at 0 s, IMG_3163 at 0 s, IMG_3171).

```text
The inner gate standing open: two leaves of vertical eucalyptus slats on an oxide-red steel frame, between fieldstone pillars with small brass wall lanterns. Through it, the tenant courtyard: a level lawn with a round fieldstone fire pit. On the right, a long low saffron-yellow building with three oxide-red doors and a timber veranda, and beyond it, in the same line, an oxide-red bar container with its serving hatch open. Ahead across the lawn, at a right angle to it, three containers on raised oxide-red steel decks (from the right: saffron yellow, oxide red, oxide red), with the roof of a long teal container further out on the right and the lake glinting beyond the trees. Golden side light. 24 mm lens, camera 1.6 m high, symmetrical framing.
```

### `aerial` · P0 · 16:9

References: `assets/reference/aerial/` (IMG_3191 at 0 s and 5.6 s, IMG_3164, the studio exterior render).

```text
Drone photograph at golden hour, 35 degrees down from about 60 m, the layout clearly readable. Foreground: the outer gate and its fieldstone sign wall (letters too small to read), a green grass-paver parking area with shade trees, and a curving cobbled road to an inner gate. Middle: a rectangular lawn courtyard with a round fieldstone fire pit. On its right side, one long low saffron-yellow building made of two 40 ft containers joined side by side (12 by 4.9 m), with three oxide-red doors onto a timber veranda, then in the same line an oxide-red bar container with a serving hatch, at the corner of the L. Across the far side of the lawn, at a right angle, forming an L: three 20 ft containers in a row on raised oxide-red steel decks, a saffron-yellow office first next to the yellow building, then two oxide-red studios with open roof terraces behind guardrails. Further out toward the lake, on the right, one muted-teal 40 ft container with a glazed long side and a timber deck, its end in line with the yellow building. Stepping-stone paths, young trees and euphorbia hedges; red laterite at the edges; beyond the compound, a band of tall eucalyptus and the calm lake catching the light. Nothing else built.
```

### `rooms` · P0 · 16:9

References: `assets/reference/rooms/` (IMG_3195 at 0 s, IMG_3171).

```text
Three-quarter eye-level view of the guest-room block: two 40 ft shipping containers joined side by side into one long low building, freshly repainted saffron yellow with oxide-red trims, on a neat fieldstone plinth. Its courtyard face has three entrances, one per room, each a half-glazed oxide-red door beside a red-framed window with slim security bars and a small wall lantern. A raised veranda of eucalyptus boards, 1.5 m deep with two broad steps, runs the full 12 m length under a slatted timber shade, with a bench and a potted aloe by each door. Lawn and a stepping-stone path in front. Golden hour, the sun raking along the facade, warm highlights on the corrugations. 28 mm lens, camera 1.6 m high.
```

### `room` · P0 · 16:9

References: `assets/reference/room/` (IMG_3185, IMG_3188, IMG_3182: the joined interior today).

```text
Interior of one en-suite guest room inside the joined containers, about 4 m wide and 4.8 m deep. A double bed in crisp white linen with an imigongo-pattern throw (black, white and ochre geometric zigzags), and a headboard wall of vertical eucalyptus slats with two reading lights. Two slim oxide-red steel posts stand mid-room where the two containers were joined, kept as a feature. Smooth warm-white walls, a pale polished-concrete floor, a jute rug, and a red-framed window with slim bars looking onto the veranda and lawn. At the back, a frosted-glass door half open to a compact bathroom: walk-in shower in grey cement tiles, wall-hung WC, small basin. Late-afternoon sun through the window, one lamp on. 20 mm lens, camera 1.4 m high, from the doorway, verticals straight.
```

### `studios` · P0 · 16:9

References: `assets/reference/studios/` (IMG_3164, IMG_3163 at 0 s, IMG_3196 at 29.3 s, the studio exterior render).

```text
Eye level across the courtyard lawn to a row of three 20 ft containers, each on its own raised oxide-red steel deck about 0.8 m above the grass, with oxide-red tubular railings and new eucalyptus deck boards. Left and middle: the two studios, repainted deep oxide red, each with a 3 m sliding glass wall onto its deck, a tinted clear canopy over the deck, a small table and two chairs; on each roof an open terrace with two lounge chairs behind a post-and-rail guardrail (slim steel posts, a hardwood top rail, stainless cables), open to the sky with no canopy, reached by a slim black steel stair with a landing at the end. Right: the farm office, repainted saffron yellow, with a glazed door and a slatted timber sun screen. Behind the row, toward the lake on the right, the long teal study room; eucalyptus and the lake beyond. Golden hour; the stone fire pit at the edge of the frame. 24 mm lens, camera 1.6 m high.
```

### `studio` · P0 · 16:9

References: `assets/reference/studio/` (the studio cutaway render, IMG_3161 at 0 s for today's interior).

```text
Interior of a self-contained studio inside a 20 ft container (5.9 by 2.35 m inside), laid out exactly as the attached design render. A double bed across the far end with one drawer at the front, open birch-plywood shelf towers either side of the headboard and a picture niche between them. A compact two-seat sofa against the back wall with a coffee table in front of it. Along the bathroom partition, a 1.45 m galley: an under-counter fridge, a two-zone induction hob and a small sink, with an overhead cabinet and a hood. A table for two with stools by the 3 m sliding glass wall, which stands open to the deck. The shower room and WC sit behind the galley. Birch-plywood joinery, pale walls, a warm timber floor, recessed ceiling lights, a wall fan, one imigongo artwork. Golden-hour light streaming in from the deck; through the glass, the lawn and the eucalyptus line. 16 mm lens, from just inside the glass wall at 1.4 m, looking along the studio toward the bed.
```

### `office` · P1 · 16:9

References: `assets/reference/office/` (IMG_3188, the studio cutaway render for the joinery).

```text
Interior of the farm office inside the saffron-yellow 20 ft container. Two birch-plywood desks along the glazed long side with task chairs. A wall of plywood shelving with neat storage boxes and seed-sample jars (labels unreadable). A wall screen showing an abstract map of coloured farm plots (no readable text), a tablet on a desk, a pinboard with a hand-drawn site plan, a ceiling fan. Warm-white walls, a polished-concrete floor. Daylight from the courtyard side; through the glass, the lawn and the red studio decks. 20 mm lens, camera 1.4 m high.
```

### `study` · P0 · 16:9

References: `assets/reference/study/` (IMG_3195 at 0 s for the 40 ft form, IMG_3196 at 5.9 s for today's teal).

```text
The study and training room: one 40 ft container (12 m long) repainted muted teal with oxide-red trims, on a fieldstone plinth beyond the studio row, toward the lake, its end in line with the yellow guest-room block. Its long side opens in a band of tall glazed doors shaded by vertical eucalyptus louvres, onto a 2 m deep timber deck with broad steps and a few stacking chairs. A green rainwater tank at one end, young trees and lawn around it, and the corner of the yellow office deck in the foreground. Golden hour. 24 mm lens, camera 1.6 m high, three-quarter view.
```

### `classroom` · P1 · 16:9

References: `assets/reference/classroom/` (the studio cutaway render for the joinery).

```text
Inside the training room in the 40 ft container: about twelve people at long birch-plywood tables in two rows, seen from behind and the side (faces not visible), listening to a facilitator beside a large wall screen with an abstract rainfall-and-soil-moisture chart (no readable text). Tall glazed doors along one side flood the room with daylight; timber louvres cast striped shadows; warm-white walls, teal-painted steel at the ceiling edge, a cork pinboard, a shelf of soil-sample jars. 18 mm lens, camera 1.5 m high, from a back corner.
```

### `dusk` · P0 · 16:9

References: `assets/reference/dusk/` (IMG_3199 at 12.3 s, IMG_3197 at 0 s, IMG_3200 at 23.4 s).

```text
Blue hour in the tenant courtyard. A round fieldstone fire pit burns softly at the centre of the lawn, with log stools around it and three guests seen from behind as dark silhouettes. Warm light comes from the windows and veranda lanterns of the yellow guest block on the right and the red studio decks across the lawn. Festoon lights hang between timber poles; the last pink light touches the high clouds; beyond lie the dark eucalyptus line and a faint glow on the lake. Calm and real. 24 mm lens, tripod, camera 1.4 m high.
```

## 5. Before/after edits

Each edit starts from the exact frame in `assets/reference/<id>/01-base-*.jpg`, which `pnpm site:refs` also saves to `assets/today/` as the real half of the slider. Use the tool's edit mode, not a fresh generation. The framing must match, or the slider jumps.

### `rooms-planned` · P0 · 4:5 (the base's own shape)

```text
Edit the attached photo; keep the exact camera position, framing, horizon, sky and the building's position and size. The building becomes the guest-room block: freshly repainted saffron yellow with oxide-red doors and window frames, a timber veranda with steps along its front under a slatted timber shade, wall lanterns, benches and potted aloes. The bare soil in front becomes a level lawn with a stepping-stone path and two young trees; remove the sandbags, loose stones and debris. Same light and time of day as the original. Photorealistic.
```

### `studios-planned` · P0 · 4:3

```text
Edit the attached photo; keep the exact camera position and framing. The two red containers on the left become the studios: repainted deep oxide red, decks re-laid in honey-brown eucalyptus, tinted clear canopies over the decks, open roof terraces with lounge chairs behind post-and-rail guardrails, no canopy on the roofs. The yellow container on the right becomes the office, repainted saffron yellow with a slatted timber screen. Remove the unfinished timber platform, the props and the clutter; keep one round table with chairs on the lawn; trim the lawn. Same light. Photorealistic.
```

### `arrival-planned` · P1 · 16:9

```text
Edit the attached photo; keep the exact camera position and framing. The cracked concrete yard becomes a green grass-paver parking lawn with eucalyptus wheel stops. Keep the earth bank and the young trees. A cobbled stone road replaces the bare path toward the compound. Same light. Photorealistic.
```

## 6. Videos

Each video starts from the approved still as frame 1: one continuous shot, no cuts, no people added, no text.

| Id | Pri | Start from | Shape |
|---|---|---|---|
| `hero` | P0 | `gate` | 16:9 |
| `hero-portrait` | P0 | `gate-portrait` | 9:16 |
| `orbit` | P0 | `aerial` | 16:9 |
| `evening` | P0 | `dusk` | 16:9 |
| `drive-in` | P1 | `road` | 16:9 |
| `studio-dolly` | P2 | `studio` | 16:9 |

`hero` and `hero-portrait`:

```text
A slow, steady gimbal dolly forward toward the open gate over the whole shot. The gates themselves do not move. Grass, hedges and leaves sway in a light breeze, high clouds drift, and golden light flickers through the leaves. The letters DIGITAL FARM stay sharp and unchanged. No people, no vehicles, no new objects.
```

`orbit`:

```text
A slow drone orbit to the right, about 20 degrees with a gentle rise, keeping the courtyard centred. More of the lake comes into view; trees sway slightly; the long golden-hour shadows stay consistent. No new buildings, no people.
```

`evening`:

```text
Locked-off tripod shot. The fire in the stone pit flickers and sends up thin smoke; the festoon lights glow steadily; the guests barely move; the lake shimmers; clouds drift almost imperceptibly. End close to the first frame so the clip loops.
```

`drive-in`:

```text
Smooth forward tracking at walking pace along the cobbled road toward the open inner gate, camera 1.5 m high and gimbal-steady. Hedge shadows slide past; leaves sway; the containers beyond grow slowly. No people, no vehicles.
```

`studio-dolly`:

```text
A slow lateral dolly toward the open glass wall, revealing the deck and the lawn beyond. The curtains stir; dust floats in the sunbeam. Nothing else moves.
```

## 7. QA before dropping a file in

1. The sign reads exactly **DIGITAL FARM**: two words, with no extra or missing letters.
2. The containers match §2: seven in all (the red bar, the joined yellow pair, the yellow office, two red studios, the teal 40 ft), none stacked or extra, colours right, eucalyptus decks.
3. The land looks like Bugesera: low hills, red soil, eucalyptus and the lake. No mountains, palms on a beach or safari props.
4. There's no other legible text, no logo and no watermark.
5. People are few and small, faces aren't recognisable, and there are no children.
6. Verticals are straight, corrugations don't warp, and no furniture melts.
7. In video, buildings don't morph, the sign stays legible, nothing flickers, and the clip is 1080p.

## 8. Where each asset appears

| Id | Homepage section |
|---|---|
| `hero`, `hero-portrait`, `gate`, `gate-portrait` | Hero (the still is the poster and the first paint) |
| `gate`, `parking`, `road`, `inner-gate`, `drive-in` | The way in |
| `aerial`, `orbit` | The compound (with the site plan) |
| `rooms`, `room` | Stay: guest rooms |
| `studios`, `studio`, `studio-dolly` | Stay: studios (with the design renders from `/en/studio`) |
| `office`, `study`, `classroom` | Work and learn |
| `dusk`, `evening` | Evening band |
| `rooms-planned`, `studios-planned`, `arrival-planned` | From what stands today (before/after) |
