// The one-take film (D-074): one camera's journey as the founder told it (2026-11-04). The hero is the cameraman's view
// from the road, zoomed in on the lakeside plot (the first land); he zooms back and turns left, down the road with the
// lake on the right, to the second land's gate on the left. The gate opens and he goes in, past the volleyball lawn and
// up the drive; the inner gate opens; then every place, further and further from the lake, close on the field and the
// animals, up to the map of the farm and back over the gate to the lake.
// No cut, no whip, no text: each photo is a depth scene (depth.py) the camera moves through, and each next photo grows
// out of the one before while the camera keeps moving. The song (assets/film/oner/music/track.mp3, 173.09 s) is the
// soundtrack, to the end of its singing (2:14.4); the moves land on its bars (about 80 BPM: a bar every 3.0 s, the voice
// in at 20 s). The camera never stops: every shot moves at a steady pace from its first frame to its last.
//
// Read by oner.html (the renderer) and render.mjs (the driver). Every number here was set by eye on the photos.
//   scene:  hfov (the lens we assume the photo had, degrees across), zfar (how deep its far depth is, in near units),
//           water [x0, y0, x1, y1] (where the lake may glint), leaves (how much the breeze moves leaves and grass);
//           the upright cut keeps the wide cut's framing at the centre, so a pass's seam lines up in both
//   shot:   one photo on screen from `from` to `to`, its camera at keyframes (t, then any of: cx cy the point of the
//           photo at the centre of the frame · zoom · roll in degrees · x y z the camera's move, in units of the
//           nearest depth, z forward)
//   join:   how a shot hands over to the next, over [at, at + dur]:
//           pass    the camera turns (side -1 left, +1 right) past a near trunk or leaves (occ, at `scale` frame
//                   heights, centred at `y`); the next photo takes over behind it, turning at the same speed on screen
//           zoom    a matched rise or dive: `pairs` are the same points in both photos ([this x, y], [next x, y]);
//                   the frame keeps them together while it moves from this photo's framing to the next one's, and the
//                   photo dived into (or risen out of) shows only while it nearly fills the frame (`fade` [from, to]
//                   in the join's progress overrides when)
//           depth   the same matched move, walking on: the next photo takes over far things first, the near last
//           fade    the same matched move between the drone views, far things first; it never turns the picture (a
//                   turn of a slanted view is a roll), so the straight-down map turns on its own, by its roll key
export const FPS = 30
export const LENGTH = 134.4 // the end of the song's singing (the instrumental comes in loud at 134.6)

export const SCENES = {
  "01": { hfov: 52, zfar: 30, water: [0, 0.53, 1, 0.68], leaves: 0.7 },
  "01p": { hfov: 30, zfar: 30, water: [0.17, 0.565, 1, 0.65], leaves: 0.7 }, // the hero's upright picture (the upright cut's lake)
  "02": { hfov: 54, zfar: 40, water: [0.66, 0.42, 1, 0.58], leaves: 0.5 },
  P: { hfov: 52, zfar: 30, leaves: 0.4 }, // the outer gate from the road, face on (the parking page's hero)
  "04": { hfov: 56, zfar: 30, leaves: 0.4 },
  "05": { hfov: 56, zfar: 30, leaves: 0.4 },
  "06": { hfov: 56, zfar: 30, leaves: 0.5 },
  "08": { hfov: 50, zfar: 25, leaves: 0.4 },
  "09": { hfov: 50, zfar: 25, leaves: 0.4 },
  "10": { hfov: 50, zfar: 25, leaves: 0.4 },
  "11": { hfov: 50, zfar: 25, leaves: 0.4 },
  "12": { hfov: 50, zfar: 25, leaves: 0.4 },
  "13": { hfov: 50, zfar: 25, leaves: 0.5 },
  "14": { hfov: 54, zfar: 40, water: [0, 0.36, 1, 0.46], leaves: 0.3 },
  "15": { hfov: 52, zfar: 25, leaves: 0.3 },
  "16": { hfov: 54, zfar: 25, leaves: 0.5 },
  "17": { hfov: 54, zfar: 25, leaves: 0.4 },
  "19": { hfov: 44, zfar: 3, leaves: 0.25 },
  "20": { hfov: 48, zfar: 6, water: [0, 0.02, 0.45, 0.1], leaves: 0.3 },
}

// The two gates in P, measured on the photo: each opens inward on two timber leaves. The photo shows the right leaf
// open; the left is its mirror. `hinge` is the two pillars' inner edges (u), `top`/`bottom` the leaf at its hinge (v),
// `disp` the gate's depth (depth.py's disparity at its pillars), `leaf` the open right leaf as the photo has it
// (hinge top, free top, free bottom, hinge bottom), `open` the leaf's angle there, `at` when it swings.
export const GATES = [
  { scene: "P", hinge: [0.601, 0.886], top: 0.4296, bottom: 0.6417, disp: 0.39, open: 80, at: [25.8, 29.8],
    leaf: [[0.886, 0.4296], [0.8186, 0.4255], [0.8186, 0.6034], [0.886, 0.6417]] },
  { scene: "P", hinge: [0.7015, 0.7914], top: 0.4304, bottom: 0.4956, disp: 0.085, open: 78, at: [39.0, 42.2],
    leaf: [[0.7914, 0.4304], [0.7811, 0.4265], [0.7811, 0.4921], [0.7914, 0.4956]] },
]

// The journey. Times in seconds; each shot overlaps the next by its join.
const L = (cx, cy, zoom, z, more = {}) => ({ cx, cy, zoom, z, ...more })
export const SHOTS = [
  {
    // the hero: the cameraman on the road, zoomed in on the lakeside plot; he zooms back out
    scene: "01", from: 0, to: 7.6,
    keys: [[0, L(0.5, 0.5, 1, 0)], [1.5, L(0.5, 0.5, 1, 0)], [7.6, L(0.5, 0.5, 1, 0)]],
    join: { type: "zoom", at: 1.5, dur: 6.1, fade: [0.4, 0.88], pairs: [[[0.08, 0.555], [0.705, 0.447]], [[0.92, 0.555], [0.99, 0.447]]] }, // the far shore
  },
  {
    // the road: the lakeside plot behind the fence and the palms, then he turns left down the road, the lake on the
    // right, and the gate and the sign wall come up on the left; he turns to them
    scene: "02", from: 1.5, to: 25.6,
    keys: [[1.5, L(0.765, 0.47, 2.0, 0)], [7.6, L(0.73, 0.47, 1.85, 0.02)], [10.5, L(0.58, 0.49, 1.3, 0.07)], [13, L(0.5, 0.5, 1.13, 0.12)],
      [17, L(0.46, 0.5, 1.33, 0.21)], [21.4, L(0.42, 0.51, 1.7, 0.31)], [25.6, L(0.355, 0.53, 2.25, 0.37)]],
    join: { type: "zoom", at: 22.4, dur: 3.2, pairs: [[[0.315, 0.555], [0.185, 0.535]], [[0.375, 0.555], [0.4, 0.535]]] }, // the sign
  },
  {
    // the outer gate, face on: it opens slowly, and he walks in
    scene: "P", from: 22.4, to: 32.6,
    keys: [[22.4, L(0.46, 0.53, 1.0, 0)], [25.6, L(0.53, 0.53, 1.07, 0.03)], [28.6, L(0.64, 0.52, 1.33, 0.09)], [30.2, L(0.7, 0.51, 1.66, 0.14)],
      [32.6, L(0.78, 0.5, 2.1, 0.21)]],
    join: { type: "pass", side: 1, at: 30.2, dur: 2.4, occ: "trunk", scale: 1.6, y: 0.45 },
  },
  {
    // inside: the volleyball lawn beside the drive, the lake and the low sun behind
    scene: "14", from: 30.2, to: 38.4,
    keys: [[30.2, L(0.3, 0.5, 1.06, 0)], [32.6, L(0.38, 0.5, 1.11, 0.04)], [36, L(0.5, 0.5, 1.18, 0.09)], [38.4, L(0.6, 0.5, 1.24, 0.12)]],
    join: { type: "pass", side: 1, at: 36, dur: 2.4, occ: "leaves", scale: 1.25, y: 0.3 },
  },
  {
    // back on the drive, up to the inner gate: it opens too
    scene: "P", from: 36, to: 45.8,
    keys: [[36, L(0.7, 0.475, 1.95, 0.1)], [38.4, L(0.74, 0.47, 2.25, 0.13)], [41.6, L(0.752, 0.463, 3.0, 0.19)], [45.8, L(0.752, 0.458, 3.85, 0.24)]],
    join: { type: "zoom", at: 42.6, dur: 3.2, pairs: [[[0.7015, 0.463], [0.02, 0.78]], [[0.7914, 0.463], [0.975, 0.78]]] }, // the inner gate's pillars
  },
  {
    // through the inner gate, its leaves passing either side
    scene: "04", from: 42.6, to: 50.6,
    keys: [[42.6, L(0.5, 0.5, 1.0, 0)], [45.8, L(0.52, 0.51, 1.11, 0.12)], [48.2, L(0.54, 0.52, 1.24, 0.23)], [50.6, L(0.56, 0.53, 1.36, 0.32)]],
    join: { type: "depth", at: 48.2, dur: 2.4, pairs: [[[0.555, 0.6], [0.83, 0.585]], [[0.28, 0.45], [0.645, 0.38]]] }, // the fire pit, the office
  },
  {
    // the camp: past the white tents, to the fire pit
    scene: "05", from: 48.2, to: 55.2,
    keys: [[48.2, L(0.56, 0.5, 1.0, 0)], [50.6, L(0.52, 0.5, 1.07, 0.08)], [52.8, L(0.47, 0.49, 1.12, 0.12)], [55.2, L(0.38, 0.49, 1.17, 0.15)]],
    join: { type: "pass", side: -1, at: 52.8, dur: 2.4, occ: "trunk", scale: 1.6, y: 0.45, flip: true },
  },
  {
    // the guest rooms: along the veranda, the chairs and the lamps
    scene: "10", from: 52.8, to: 60.2,
    keys: [[52.8, L(0.64, 0.5, 1.04, 0)], [55.2, L(0.56, 0.5, 1.09, 0.04)], [57.8, L(0.48, 0.5, 1.15, 0.09)], [60.2, L(0.38, 0.5, 1.2, 0.12)]],
    join: { type: "pass", side: -1, at: 57.8, dur: 2.4, occ: "leaves", scale: 1.25, y: 0.3 },
  },
  {
    // the bar: its open hatch, the coffee machine and the shelves
    scene: "09", from: 57.8, to: 64.8,
    keys: [[57.8, L(0.64, 0.5, 1.04, 0)], [60.2, L(0.56, 0.5, 1.09, 0.04)], [62.4, L(0.48, 0.5, 1.15, 0.09)], [64.8, L(0.38, 0.5, 1.2, 0.12)]],
    join: { type: "pass", side: -1, at: 62.4, dur: 2.4, occ: "trunk", scale: 1.6, y: 0.45 },
  },
  {
    // the office: its glass front, the desk and the sofa
    scene: "08", from: 62.4, to: 69.4,
    keys: [[62.4, L(0.64, 0.5, 1.04, 0)], [64.8, L(0.56, 0.5, 1.09, 0.04)], [67, L(0.48, 0.5, 1.15, 0.09)], [69.4, L(0.38, 0.5, 1.2, 0.12)]],
    join: { type: "pass", side: -1, at: 67, dur: 2.4, occ: "leaves", scale: 1.25, y: 0.3, flip: true },
  },
  {
    // between the studios, on toward the back row
    scene: "06", from: 67, to: 74,
    keys: [[67, L(0.64, 0.49, 1.04, 0)], [69.4, L(0.56, 0.48, 1.09, 0.05)], [71.6, L(0.48, 0.47, 1.15, 0.1)], [74, L(0.38, 0.47, 1.2, 0.13)]],
    join: { type: "pass", side: -1, at: 71.6, dur: 2.4, occ: "trunk", scale: 1.7, y: 0.45, flip: true },
  },
  {
    // the study room: its glass front, the long table and the books; its teal box becomes the galley's
    scene: "11", from: 71.6, to: 78.8,
    keys: [[71.6, L(0.64, 0.5, 1.06, 0)], [74, L(0.56, 0.5, 1.12, 0.05)], [76.4, L(0.48, 0.5, 1.2, 0.1)], [78.8, L(0.42, 0.5, 1.32, 0.16)]],
    join: { type: "depth", at: 76.4, dur: 2.4, align: "scale", pairs: [[[0.07, 0.5], [0.06, 0.45]], [[0.96, 0.5], [0.89, 0.45]]] },
  },
  {
    // the galley: its lit kitchen windows, herbs by the door
    scene: "12", from: 76.4, to: 83.4,
    keys: [[76.4, L(0.62, 0.5, 1.0, 0)], [78.8, L(0.54, 0.5, 1.1, 0.06)], [81, L(0.47, 0.5, 1.16, 0.1)], [83.4, L(0.38, 0.5, 1.21, 0.13)]],
    join: { type: "pass", side: -1, at: 81, dur: 2.4, occ: "trunk", scale: 1.6, y: 0.45 },
  },
  {
    // the public bathroom: its open door, the flowers round it
    scene: "13", from: 81, to: 88,
    keys: [[81, L(0.64, 0.5, 1.04, 0)], [83.4, L(0.56, 0.5, 1.09, 0.04)], [85.6, L(0.48, 0.5, 1.15, 0.09)], [88, L(0.38, 0.5, 1.2, 0.12)]],
    join: { type: "pass", side: -1, at: 85.6, dur: 2.4, occ: "leaves", scale: 1.25, y: 0.3 },
  },
  {
    // dining: under the arched grass thatch, the long tables and the string lights
    scene: "15", from: 85.6, to: 92.6,
    keys: [[85.6, L(0.64, 0.52, 1.04, 0)], [88, L(0.56, 0.53, 1.09, 0.04)], [90.2, L(0.48, 0.54, 1.15, 0.09)], [92.6, L(0.38, 0.54, 1.2, 0.12)]],
    join: { type: "pass", side: -1, at: 90.2, dur: 2.4, occ: "trunk", scale: 1.6, y: 0.45 },
  },
  {
    // the field, close: low over the beds, into the tomatoes and the baskets of the harvest
    scene: "16", from: 90.2, to: 101.8,
    keys: [[90.2, L(0.6, 0.5, 1.02, 0)], [92.6, L(0.53, 0.52, 1.12, 0.04)], [95.6, L(0.46, 0.62, 1.6, 0.12)], [98.6, L(0.36, 0.74, 2.2, 0.19)],
      [101.8, L(0.3, 0.8, 2.6, 0.24)]],
    join: { type: "pass", side: -1, at: 99.4, dur: 2.4, occ: "leaves", scale: 1.25, y: 0.3, flip: true },
  },
  {
    // the livestock, close: into the pen, along the goats and the sheep
    scene: "17", from: 99.4, to: 111.4,
    keys: [[99.4, L(0.56, 0.52, 1.1, 0)], [101.8, L(0.5, 0.55, 1.35, 0.04)], [104.6, L(0.36, 0.6, 2.2, 0.1)], [107.6, L(0.44, 0.61, 2.9, 0.16)],
      [111.4, L(0.6, 0.62, 3.1, 0.2)]],
    join: { type: "zoom", at: 108.4, dur: 3.0, pairs: [[[0.1, 0.5], [0.09, 0.55]], [[0.9, 0.5], [0.39, 0.55]]] }, // lift off: the farm below
  },
  {
    // straight down: the whole farm like a map, turning half round
    scene: "19", from: 108.4, to: 121.4,
    keys: [[108.4, L(0.42, 0.52, 1.25, 0, { roll: 0 })], [111.4, L(0.47, 0.52, 1.12, 0, { roll: -4 })], [113.8, L(0.5, 0.5, 1.6, 0, { roll: -45 })],
      [116.6, L(0.53, 0.5, 1.85, 0, { roll: -115 })], [118.8, L(0.55, 0.5, 1.3, 0, { roll: -172 })], [121.4, L(0.55, 0.5, 1.04, 0, { roll: -180 })]],
    join: { type: "fade", at: 118.8, dur: 2.6, pairs: [[[0.7, 0.115], [0.435, 0.835]], [[0.38, 0.12], [0.82, 0.835]], [[0.54, 0.31], [0.55, 0.635]], [[0.69, 0.31], [0.365, 0.635]], [[0.36, 0.33], [0.77, 0.65]], [[0.715, 0.49], [0.35, 0.535]], [[0.345, 0.55], [0.73, 0.5]]] },
  },
  {
    // from behind the back row: over the farm toward the gate, the lake beyond it; on over the trees to the lake
    scene: "20", from: 118.8, to: 128.6,
    keys: [[118.8, L(0.5, 0.5, 1.0, 0)], [121.4, L(0.47, 0.46, 1.08, 0.02)], [124.6, L(0.4, 0.38, 1.22, 0.04)], [128.6, L(0.3, 0.3, 1.4, 0.06)]],
    join: { type: "zoom", at: 124.6, dur: 4.0, pairs: [[[0.08, 0.2], [0.08, 0.6]], [[0.36, 0.2], [0.92, 0.6]]], // the trees toward the lake
      // the upright cut sees a narrow slice of the wide photo: its points must sit inside that slice
      pairsPortrait: [[[0.18, 0.2], [0.25, 0.6]], [[0.26, 0.2], [0.75, 0.6]]] },
  },
  {
    // the lake plot again: down to the shore, settling on the hero's frame as the singing ends
    scene: "01", from: 124.6, to: LENGTH,
    keys: [[124.6, L(0.5, 0.39, 1.5, 0.04, { y: -0.05 })], [128.6, L(0.5, 0.435, 1.26, 0.022, { y: -0.028 })], [131.4, L(0.5, 0.486, 1.07, 0.007, { y: -0.007 })],
      [132.9, L(0.5, 0.5, 1, 0, { y: 0 })], [LENGTH, L(0.5, 0.5, 1, 0, { y: 0 })]],
  },
]
