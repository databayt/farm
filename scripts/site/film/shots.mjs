// The homepage film (D-070, guide/film.md): one walk that starts as the homepage hero (the lake plot), takes the road
// to the farm, rises over the gate to show the whole farm, comes down through the inner gate and walks the courtyard
// past every place, then flies over the farm from every side and back to the lake. It is a concept film (film.md
// rule 2), cut from the founder's scene images (film/scenes.mjs, saved in assets/film/masters) and the place heroes.
//
// One list, read by:
//   packs.mjs  the founder's folders on the Desktop: the frames to animate and the Veo prompt
//   film.mjs   the cut: the founder's clip where it exists, a slow push on the start image where it does not
//   walk.mjs   the previz, for the shots that have a cam
//
// start: the image the shot opens on. frame: the part of it used, [x0, y0, x1, y1] as fractions (16:9), where an
// edge holds AI lettering. end: the shot whose start is this shot's last frame, so the founder's clip (Flow's
// "Frames to video") runs from one picture to the next and the clips join into one walk. push: the stand-in's slow
// move on the start image, [scale, focus x, focus y] from and to (focus as a fraction of the frame). px: where an
// upright cut centres on the picture (0.5 when unset). seconds: the stand-in's length in the cut; clipSeconds: a
// clip's (a joined clip plays in full, so it reaches the next picture). cam: [pos, look, fov] at the start and end in
// compound.json's frame after the spread, as compound.html's window.PLAN holds it (the previz).

const HERO = (place, file = `${place}-hero.jpg`) => `public/designs/${place}/render/${file}`
// the founder's scene images (gitignored), as scenes-pack.mjs collects them from ~/Desktop/farm-scenes-nano-banana
const SCENE = (id) => `assets/film/masters/${id}.jpg`
const LAKE = "assets/hero/desktop.jpeg"

export const SHOTS = [
  // ------------------------------------------------------------ the arrival: one move from the lake into the farm
  {
    id: "01-lake",
    title: "The lake plot",
    seconds: 6,
    clipSeconds: 8,
    start: LAKE,
    portrait: "assets/hero/mobile.jpeg",
    end: "02-road",
    push: [[1, 0.5, 0.5], [1.07, 0.6, 0.52]],
    move:
      "The camera holds on the first frame for a moment, the lake shining between the tree trunks. Then it turns slowly to the right, away from the water, and glides along the grassy shore under the trees onto a red dirt road beside the lake: the road running ahead, a stone sign wall and a timber gate on the left, palms and the lake on the right.",
    portraitMove:
      "The camera starts exactly on this frame and holds it for one second. Then it rises a little and drifts slowly to the right along the shore. The water ripples and glints, the reeds and the leaves sway, the clouds drift.",
  },
  {
    id: "02-road",
    title: "The road to the farm",
    seconds: 5,
    clipSeconds: 8,
    start: SCENE("02-road"),
    end: "03-arrival",
    push: [[1, 0.5, 0.55], [1.2, 0.44, 0.52]],
    px: 0.56, // upright: the road and the palms, the sign wall out of frame rather than cut through its letters
    move:
      "A smooth forward tracking shot down the red dirt road at walking pace, the palm trunks and the lake passing on the right. Near the stone sign wall the camera rises like a drone, up over the wall and the timber gate, turning left toward the farm, and ends high above the gate looking over the whole farm: the gravel car park, the white tents, the container studios and the vegetable field among the trees.",
  },
  {
    id: "03-arrival",
    title: "Over the gate: the whole farm",
    seconds: 7,
    clipSeconds: 8,
    start: SCENE("A1-front"),
    end: "04-inner-gate",
    push: [[1.7, 0.6, 0.8], [1, 0.5, 0.5]], // from the gate up and back to the whole farm
    px: 0.48, // upright: the whole sign in the first frame, not half of it
    move:
      "From high above the gate, the drone glides slowly forward over the gravel car park and descends along the gravel path to the open timber inner gate, coming down to eye level in the gateway, looking into the courtyard: the white tents, the round stone fire pit and the container studios among the trees.",
  },
  {
    id: "04-inner-gate",
    title: "Through the inner gate",
    seconds: 5,
    clipSeconds: 8,
    start: SCENE("06-courtyard"),
    end: "05-camp",
    push: [[1, 0.5, 0.55], [1.38, 0.52, 0.47]], // the gate's leaves pass out of frame
    move:
      "Walking forward at an easy pace through the open timber gate onto the lawn, the gate's two leaves slide out of frame on either side. The camera walks on past the white tents toward the round stone fire pit and its log stools, a yellow studio coming into view on the right.",
  },
  {
    id: "05-camp",
    title: "The camp and the fire pit",
    seconds: 5,
    clipSeconds: 8,
    start: SCENE("07-camp"),
    end: "06-studios",
    push: [[1.12, 0.36, 0.55], [1.12, 0.64, 0.52]],
    px: 0.4,
    move:
      "A slow walk to the right past the open tent with its glowing lantern and around the stone fire pit, turning toward the two yellow container studios, ending between them with the long timber table and benches in the foreground. Warm light glows inside both studios.",
  },
  {
    id: "06-studios",
    title: "The studios",
    seconds: 5,
    start: SCENE("08-studios"),
    push: [[1, 0.5, 0.55], [1.15, 0.5, 0.5]],
    move:
      "A slow, steady push forward across the lawn between the two yellow studios and past the timber table, toward the teal containers of the back row. Warm lamplight glows through the studios' glass doors; the leaves stir in the breeze.",
  },
  {
    id: "07-courtyard",
    title: "Over the courtyard",
    seconds: 5,
    clipSeconds: 8,
    start: SCENE("A6-courtyard"),
    end: "08-office",
    push: [[1, 0.5, 0.55], [1.22, 0.42, 0.45]], // toward the office
    move:
      "A low drone glides slowly forward over the courtyard, above the white tents and the fire pit, and descends toward the navy office container on its timber deck, coming down to eye level in front of its glass front.",
  },
  // ------------------------------------------------------------ the places, each as its remastered hero
  {
    id: "08-office",
    title: "The office",
    seconds: 4,
    start: HERO("office"),
    cam: [[[13.2, 22.5, 1.7], [13.2, 33.2, 1.4], 50], [[13.2, 28.5, 1.7], [13.2, 33.2, 1.4], 50]],
    push: [[1, 0.5, 0.55], [1.08, 0.5, 0.55]],
    move: "A slow push toward the glass front of the navy office; warm light inside on the desk and the sofa; the tall trees behind sway gently.",
  },
  {
    id: "09-bar",
    title: "The bar",
    seconds: 4,
    start: HERO("bar"),
    cam: [[[7, 31.4, 1.7], [-3.8, 31.4, 1.5], 50], [[2, 31.4, 1.6], [-3.8, 31.4, 1.5], 50]],
    push: [[1, 0.5, 0.5], [1.1, 0.5, 0.45]],
    move: "A slow push toward the open hatch of the red bar; the coffee machine and the shelves glow warmly.",
  },
  {
    id: "10-guest-rooms",
    title: "The guest rooms",
    seconds: 4,
    start: HERO("guest-room"),
    cam: [[[6.5, 13, 1.7], [-5, 18, 1.4], 50], [[6.5, 27, 1.7], [-5, 22, 1.4], 50]],
    push: [[1.04, 0.35, 0.55], [1.08, 0.65, 0.55]],
    move: "A slow lateral track to the right along the dark-green guest rooms' timber veranda, past the doors, the chairs and the lamps; the window lights glow.",
  },
  {
    id: "11-study-room",
    title: "The study room",
    seconds: 3,
    start: HERO("study-room"),
    cam: [[[-0.5, 34.8, 1.7], [-1.3, 42.7, 1.4], 70], [[-1.3, 36.5, 1.7], [-1.3, 42.7, 1.4], 65]],
    push: [[1, 0.5, 0.5], [1.06, 0.5, 0.5]],
    move: "A slow push toward the open glass front of the teal study room, the long table and the shelves of books inside.",
  },
  {
    id: "12-galley",
    title: "The galley",
    seconds: 3,
    start: HERO("galley"),
    cam: [[[27.7, 36.5, 1.7], [27.7, 42.7, 1.4], 55], [[27.7, 38, 1.7], [27.7, 42.7, 1.4], 55]],
    push: [[1, 0.5, 0.5], [1.06, 0.55, 0.5]],
    move: "A slow lateral drift to the right along the teal galley's front, its kitchen windows lit, potted herbs by the door.",
  },
  {
    id: "13-public-bathroom",
    title: "The public bathroom",
    seconds: 3,
    start: HERO("public-bathroom"),
    cam: [[[49.2, 36.5, 1.7], [49.2, 42.7, 1.4], 55], [[49.2, 38, 1.7], [49.2, 42.7, 1.4], 55]],
    push: [[1, 0.5, 0.5], [1.06, 0.5, 0.5]],
    move: "A slow push toward the open door of the teal public bathroom, the flowers around it swaying.",
  },
  {
    id: "14-volleyball",
    title: "Volleyball",
    seconds: 3,
    start: HERO("volleyball"),
    cam: [[[-7.5, -7, 4], [-7.5, 4.5, 0], 55], [[5, -3, 3], [-7.5, 4.5, 0], 55]],
    push: [[1.02, 0.4, 0.55], [1.08, 0.6, 0.55]],
    move: "A slow pan to the right across the volleyball court in the sunset light, the trees and the lake beyond; the ball lies still on the grass.",
  },
  {
    id: "15-dining",
    title: "Dining",
    seconds: 3,
    start: HERO("dining"),
    push: [[1, 0.5, 0.55], [1.08, 0.5, 0.6]],
    move: "A slow push under the arched grass thatch toward the long tables and benches, the string lights glowing.",
  },
  {
    id: "16-field",
    title: "The field",
    seconds: 3,
    start: HERO("farming", "field-hero.jpg"),
    cam: [[[-14, 38, 2], [-30, 46, 0], 55], [[-14, 38, 9], [-30, 47, 0], 55]],
    push: [[1, 0.5, 0.6], [1.08, 0.5, 0.45]],
    move: "A slow rise over the vegetable beds and their timber fences, the leaves stirring in the breeze.",
  },
  {
    id: "17-livestock",
    title: "Livestock",
    seconds: 3,
    start: HERO("livestock"),
    animals: true,
    push: [[1, 0.5, 0.55], [1.06, 0.5, 0.55]],
    move: "A slow push toward the thatched shed and the paddock; the goats and sheep graze calmly.",
  },
  // ------------------------------------------------------------ the whole farm from above, and back to the lake
  {
    id: "18-over-the-field",
    title: "Over the field",
    seconds: 4,
    clipSeconds: 8,
    start: SCENE("A3-left"),
    end: "19-from-above",
    push: [[1, 0.5, 0.5], [1.12, 0.42, 0.45]],
    move:
      "The drone rises slowly over the vegetable field and the volleyball court, tilting down and turning, until it looks straight down on the whole farm like a map.",
  },
  {
    id: "19-from-above",
    title: "Straight down",
    seconds: 5,
    clipSeconds: 8,
    start: SCENE("A2-top"),
    frame: [0.083, 0, 0.917, 0.84], // seen from above, the sign's letters come out garbled: leave them out
    end: "20-from-the-back",
    push: [[1, 0.5, 0.5], [1.12, 0.55, 0.45]],
    move:
      "Looking straight down, the drone drifts slowly across the farm toward the back row, then descends and tilts up until it looks back over the teal back row and the yellow studios toward the gate and the road.",
  },
  {
    id: "20-from-the-back",
    title: "From behind the back row",
    seconds: 4,
    clipSeconds: 8,
    start: SCENE("A5-back"),
    end: "21-to-the-lake",
    push: [[1.12, 0.45, 0.55], [1.12, 0.55, 0.5]],
    move:
      "The drone circles slowly round the farm, high above the trees, until it looks across the courtyard from the corner by the gate, the lake shining in the distance beyond the trees.",
  },
  {
    id: "21-to-the-lake",
    title: "Back to the lake",
    seconds: 6,
    clipSeconds: 8,
    start: SCENE("A4-right"),
    frame: [0.25, 0, 1, 0.75], // toward the lake, away from the sign's slightly misdrawn letters
    end: "01-lake",
    push: [[1, 0.5, 0.5], [1.3, 0.62, 0.25]],
    px: 0.62,
    move:
      "The drone flies slowly forward over the trees toward the lake shining in the distance, descends to its grassy shore and comes to rest at eye level under the trees, looking out over the water.",
  },
]

// The shot whose start is this shot's last frame, if any.
export const endOf = (shot) => (shot.end ? SHOTS.find((s) => s.id === shot.end) : null)

// What every Veo prompt says around the shot's move: the look stays as designed, nothing is invented.
export const VEO = (shot, { joined = !!shot.end } = {}) =>
  [
    joined
      ? "Make one continuous 8-second shot that starts exactly on the first image and ends exactly on the last image."
      : "Animate this image into one continuous 8-second shot that starts exactly on it.",
    shot.move,
    `Keep everything exactly as designed in the ${joined ? "images" : "image"}: every building's shape, colour, materials, windows and doors, the trees and the layout stay the same.`,
    "Real-time, natural motion only: a light breeze in the leaves, the grass and the flowers; the same soft, warm late-afternoon light with long shadows all through the shot.",
    "A smooth, steady, cinematic camera, as on a gimbal or a drone, with no cuts, no sudden zoom and no shake.",
    shot.animals
      ? "No people, no vehicles, no new objects, no text, letters or logos added."
      : "No people, no animals, no vehicles, no new objects, no text, letters or logos added.",
    "Sound: natural ambience only (birdsong, a light breeze); no music, no voices.",
  ].join(" ")

// The film's total length in the cut, with each dissolve overlapping two shots.
export const DISSOLVE = 0.5
export const total = () => SHOTS.reduce((s, x) => s + x.seconds, 0) - DISSOLVE * (SHOTS.length - 1)
