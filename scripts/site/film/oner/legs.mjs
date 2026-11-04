// The one-take film (D-074): one camera's journey as the founder told it (2026-11-04). The hero is the cameraman's view
// from the road, zoomed in on the lake: he zooms straight out, standing on the road facing the lake; the camera moves
// left onto the track, goes forward a little, finds the second land on its left and turns to it gently. The gate opens
// and he walks in, on up the drive in the same shot; the inner gate opens; then every place, further and further from
// the lake, up to the map of the farm and back over the gate to the lake.
// No cut, no whip, no text: each photo is a depth scene (depth.py) the camera moves through, and each next photo grows
// out of the one before while the camera keeps moving. The song (assets/film/oner/music/track.mp3, 173.09 s) is the
// soundtrack, to the end of its singing (2:14.4); the moves land on its bars (about 80 BPM: a bar every 3.0 s, the voice
// in at 20 s). The camera moves calmly, a cameraman's gentle gimbal pace, a little slower at each place.
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

// The two gates in P, measured on the photo: each opens inward on two timber leaves (fg/gate-leaf.png, the photo's own
// leaf straightened; the photo's leaves are taken out of it, depth.py gate). `hinge` is the two pillars' inner edges
// (u), `top`/`bottom` the leaf at its hinge (v), `disp` the gate's depth (depth.py's disparity at its pillars), `leaf`
// the photo's open right leaf (hinge top, free top, free bottom, hinge bottom: its free edge sets how far they open),
// `at` when it swings. Both leaves are rigid and turn the same way, inward, on their hinges.
export const GATES = [
  { scene: "P", hinge: [0.601, 0.886], top: 0.4296, bottom: 0.6417, disp: 0.39, at: [23.8, 28.6],
    leaf: [[0.886, 0.4296], [0.8186, 0.4255], [0.8186, 0.6034], [0.886, 0.6417]] },
  { scene: "P", hinge: [0.7015, 0.7914], top: 0.4304, bottom: 0.4956, disp: 0.085, at: [36.6, 40.6],
    leaf: [[0.7914, 0.4304], [0.7811, 0.4265], [0.7811, 0.4921], [0.7914, 0.4956]] },
]

// The journey. Times in seconds; each shot overlaps the next by its join.
const L = (cx, cy, zoom, z, more = {}) => ({ cx, cy, zoom, z, ...more })
export const SHOTS = [
  {
    // the hero: the cameraman on the road, facing the lake, zoomed in; he zooms straight out
    scene: "01", from: 0, to: 9.0,
    keys: [[0, L(0.5, 0.5, 1, 0)], [1.5, L(0.5, 0.5, 1, 0)], [9.0, L(0.5, 0.5, 1, 0)]],
    join: { type: "zoom", at: 1.5, dur: 7.5, lock: 0.12, fade: [0.3, 0.8], pairs: [[[0.03, 0.556], [0.705, 0.447]], [[0.97, 0.556], [0.99, 0.447]]] }, // the far shore
  },
  {
    // the road: all the way out, the lakeside plot beyond the fence; the camera moves left onto the track, goes forward
    // a little, finds the second land on its left (the sign wall and the gate) and turns to it gently
    scene: "02", from: 1.5, to: 22.8,
    // the zoom-out eases in from the hero's stillness, then opens steadily
    keys: [[1.5, L(0.8475, 0.43, 3.3, 0)], [2.7, L(0.842, 0.432, 3.22, 0)], [5.6, L(0.77, 0.45, 2.3, 0)], [9.0, L(0.69, 0.47, 1.62, 0)], [12.6, L(0.5, 0.5, 1.07, 0.02)], [17.2, L(0.47, 0.5, 1.26, 0.1)],
      [20.4, L(0.41, 0.51, 1.5, 0.14)], [22.8, L(0.37, 0.52, 1.75, 0.16)]],
    join: { type: "zoom", at: 19.8, dur: 3.0, pairs: [[[0.315, 0.555], [0.185, 0.535]], [[0.375, 0.555], [0.4, 0.535]]] }, // the sign
  },
  {
    // the outer gate, face on: it opens slowly; he walks in and on up the drive, all in the one shot, to the inner gate,
    // which opens too
    scene: "P", from: 19.8, to: 46.0,
    keys: [[19.8, L(0.46, 0.53, 1.0, 0)], [22.8, L(0.49, 0.53, 1.02, 0.01)], [26, L(0.55, 0.53, 1.08, 0.03)], [30, L(0.66, 0.52, 1.3, 0.08)],
      [34, L(0.72, 0.5, 1.7, 0.13)], [38, L(0.745, 0.472, 2.25, 0.17)], [42, L(0.751, 0.463, 2.85, 0.2)], [46, L(0.752, 0.458, 3.45, 0.23)]],
    join: { type: "zoom", at: 43.0, dur: 3.0, pairs: [[[0.7015, 0.463], [0.02, 0.78]], [[0.7914, 0.463], [0.975, 0.78]]] }, // the inner gate's pillars
  },
  {
    // through the inner gate, its leaves passing either side
    scene: "04", from: 43.0, to: 51.0,
    keys: [[43, L(0.5, 0.5, 1.0, 0)], [46, L(0.51, 0.505, 1.03, 0.05)], [48.6, L(0.525, 0.515, 1.07, 0.1)], [51, L(0.54, 0.52, 1.1, 0.14)]],
    join: { type: "depth", at: 48.6, dur: 2.4, pairs: [[[0.555, 0.6], [0.83, 0.585]], [[0.28, 0.45], [0.645, 0.38]]] }, // the fire pit, the office
  },
  {
    // the camp: past the white tents, to the fire pit
    scene: "05", from: 48.6, to: 56.6,
    keys: [[48.6, L(0.55, 0.5, 1.0, 0)], [54.2, L(0.49, 0.5, 1.05, 0.05)], [56.6, L(0.43, 0.5, 1.07, 0.07)]],
    join: { type: "pass", side: -1, at: 54.2, dur: 2.4, occ: "trunk", scale: 1.6, y: 0.45, flip: true },
  },
  {
    // the volleyball lawn, the lake and the low sun beyond
    scene: "14", from: 54.2, to: 62.2,
    keys: [[54.2, L(0.55, 0.5, 1.0, 0)], [59.8, L(0.49, 0.5, 1.05, 0.05)], [62.2, L(0.43, 0.5, 1.07, 0.07)]],
    join: { type: "pass", side: -1, at: 59.8, dur: 2.4, occ: "leaves", scale: 1.25, y: 0.3 },
  },
  {
    // the guest rooms: along the veranda, the chairs and the lamps
    scene: "10", from: 59.8, to: 67.8,
    keys: [[59.8, L(0.55, 0.5, 1.0, 0)], [65.4, L(0.49, 0.5, 1.05, 0.05)], [67.8, L(0.43, 0.5, 1.07, 0.07)]],
    join: { type: "pass", side: -1, at: 65.4, dur: 2.4, occ: "trunk", scale: 1.6, y: 0.45 },
  },
  {
    // the bar: its open hatch, the coffee machine and the shelves
    scene: "09", from: 65.4, to: 73.4,
    keys: [[65.4, L(0.55, 0.5, 1.0, 0)], [71.0, L(0.49, 0.5, 1.05, 0.05)], [73.4, L(0.43, 0.5, 1.07, 0.07)]],
    join: { type: "pass", side: -1, at: 71.0, dur: 2.4, occ: "leaves", scale: 1.25, y: 0.3, flip: true },
  },
  {
    // the office: its glass front, the desk and the sofa
    scene: "08", from: 71.0, to: 79.0,
    keys: [[71.0, L(0.55, 0.5, 1.0, 0)], [76.6, L(0.49, 0.5, 1.05, 0.05)], [79.0, L(0.43, 0.5, 1.07, 0.07)]],
    join: { type: "pass", side: -1, at: 76.6, dur: 2.4, occ: "trunk", scale: 1.6, y: 0.45, flip: true },
  },
  {
    // between the studios, on toward the back row
    scene: "06", from: 76.6, to: 84.6,
    keys: [[76.6, L(0.55, 0.5, 1.0, 0)], [82.2, L(0.49, 0.5, 1.05, 0.05)], [84.6, L(0.43, 0.5, 1.07, 0.07)]],
    join: { type: "pass", side: -1, at: 82.2, dur: 2.4, occ: "leaves", scale: 1.25, y: 0.3 },
  },
  {
    // the study room: its glass front, the long table and the books; its teal box becomes the galley's
    scene: "11", from: 82.2, to: 90.2,
    keys: [[82.2, L(0.55, 0.5, 1.0, 0)], [87.8, L(0.49, 0.5, 1.05, 0.05)], [90.2, L(0.43, 0.5, 1.07, 0.07)]],
    join: { type: "depth", at: 87.8, dur: 2.4, align: "scale", pairs: [[[0.07, 0.5], [0.06, 0.45]], [[0.96, 0.5], [0.89, 0.45]]] },
  },
  {
    // the galley: its lit kitchen windows, herbs by the door
    scene: "12", from: 87.8, to: 95.8,
    keys: [[87.8, L(0.55, 0.5, 1.0, 0)], [93.4, L(0.49, 0.5, 1.05, 0.05)], [95.8, L(0.43, 0.5, 1.07, 0.07)]],
    join: { type: "pass", side: -1, at: 93.4, dur: 2.4, occ: "trunk", scale: 1.6, y: 0.45 },
  },
  {
    // the public bathroom: its open door, the flowers round it
    scene: "13", from: 93.4, to: 101.4,
    keys: [[93.4, L(0.55, 0.5, 1.0, 0)], [99.0, L(0.49, 0.5, 1.05, 0.05)], [101.4, L(0.43, 0.5, 1.07, 0.07)]],
    join: { type: "pass", side: -1, at: 99.0, dur: 2.4, occ: "leaves", scale: 1.25, y: 0.3, flip: true },
  },
  {
    // dining: under the arched grass thatch, the long tables and the string lights
    scene: "15", from: 99.0, to: 107.0,
    keys: [[99.0, L(0.55, 0.5, 1.0, 0)], [104.6, L(0.49, 0.5, 1.05, 0.05)], [107.0, L(0.43, 0.5, 1.07, 0.07)]],
    join: { type: "pass", side: -1, at: 104.6, dur: 2.4, occ: "trunk", scale: 1.6, y: 0.45, flip: true },
  },
  {
    // the field: the beds and their timber fences
    scene: "16", from: 104.6, to: 112.6,
    keys: [[104.6, L(0.55, 0.5, 1.0, 0)], [110.2, L(0.49, 0.5, 1.05, 0.05)], [112.6, L(0.43, 0.5, 1.07, 0.07)]],
    join: { type: "pass", side: -1, at: 110.2, dur: 2.4, occ: "leaves", scale: 1.25, y: 0.3 },
  },
  {
    // the livestock: the goats and the sheep by their thatched shed; then the drone lifts off, the farm below
    scene: "17", from: 110.2, to: 117.6,
    keys: [[110.2, L(0.55, 0.5, 1.02, 0)], [114.6, L(0.5, 0.5, 1.06, 0.04)], [117.6, L(0.5, 0.5, 1.08, 0.05)]],
    join: { type: "zoom", at: 114.6, dur: 3.0, pairs: [[[0.1, 0.5], [0.09, 0.55]], [[0.9, 0.5], [0.39, 0.55]]] },
  },
  {
    // straight down: the whole farm like a map, turning half round
    scene: "19", from: 114.6, to: 125.2,
    keys: [[114.6, L(0.42, 0.52, 1.25, 0, { roll: 0 })], [117.6, L(0.47, 0.52, 1.12, 0, { roll: -4 })], [119.6, L(0.5, 0.5, 1.6, 0, { roll: -50 })],
      [121.8, L(0.53, 0.5, 1.85, 0, { roll: -120 })], [123.6, L(0.55, 0.5, 1.3, 0, { roll: -172 })], [125.2, L(0.55, 0.5, 1.04, 0, { roll: -180 })]],
    join: { type: "fade", at: 122.6, dur: 2.6, pairs: [[[0.7, 0.115], [0.435, 0.835]], [[0.38, 0.12], [0.82, 0.835]], [[0.54, 0.31], [0.55, 0.635]], [[0.69, 0.31], [0.365, 0.635]], [[0.36, 0.33], [0.77, 0.65]], [[0.715, 0.49], [0.35, 0.535]], [[0.345, 0.55], [0.73, 0.5]]] },
  },
  {
    // from behind the back row: over the farm toward the gate, the lake beyond it; on over the trees to the lake
    scene: "20", from: 122.6, to: 130.0,
    keys: [[122.6, L(0.5, 0.5, 1.0, 0)], [125.2, L(0.47, 0.46, 1.08, 0.02)], [127.6, L(0.4, 0.38, 1.22, 0.04)], [130, L(0.32, 0.31, 1.38, 0.06)]],
    join: { type: "zoom", at: 126.4, dur: 3.6, pairs: [[[0.08, 0.2], [0.08, 0.6]], [[0.36, 0.2], [0.92, 0.6]]], // the trees toward the lake
      // the upright cut sees a narrow slice of the wide photo: its points must sit inside that slice
      pairsPortrait: [[[0.18, 0.2], [0.25, 0.6]], [[0.26, 0.2], [0.75, 0.6]]] },
  },
  {
    // the lake again: down to the shore, settling on the hero's frame as the singing ends
    scene: "01", from: 126.4, to: LENGTH,
    keys: [[126.4, L(0.5, 0.41, 1.36, 0.03, { y: -0.04 })], [130, L(0.5, 0.455, 1.14, 0.014, { y: -0.018 })], [132.4, L(0.5, 0.492, 1.03, 0.003, { y: -0.003 })],
      [133.6, L(0.5, 0.5, 1, 0, { y: 0 })], [LENGTH, L(0.5, 0.5, 1, 0, { y: 0 })]],
  },
]
