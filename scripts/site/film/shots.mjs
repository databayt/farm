// The homepage film (D-070, guide/film.md): one walk that starts as the homepage hero (the lake plot), takes the road
// to the farm, rises over the gate to show the whole farm, comes down through the inner gate and walks the courtyard
// past every place, then flies over the farm from every side and back to the lake. It is a concept film (film.md
// rule 2), made from the founder's scene images (film/scenes.mjs, saved in assets/film/masters) and the place heroes.
//
// One list, read by:
//   packs.mjs  the founder's folder on the Desktop: the photos, numbered in this order, and one prompt for the film
//   film.mjs   the cut: the founder's video where it exists, a slow push on each photo where it does not
//   walk.mjs   the previz, for the shots that have a cam
//
// start: the photo. frame: the part of it used, [x0, y0, x1, y1] as fractions (16:9), where an edge holds AI
// lettering. brief: what the camera does there, one line of the film's prompt. push: the stand-in's slow move on the
// photo, [scale, focus x, focus y] from and to (focus as a fraction of the frame). px: where an upright cut centres on
// the photo (0.5 when unset). seconds: the shot's length in the cut. cam: [pos, look, fov] at the start and end in
// compound.json's frame after the spread, as compound.html's window.PLAN holds it (the previz).

const HERO = (place, file = `${place}-hero.jpg`) => `public/designs/${place}/render/${file}`
// the founder's scene images (gitignored), as scenes-pack.mjs collects them from ~/Desktop/farm-scenes-nano-banana
const SCENE = (id) => `assets/film/masters/${id}.jpg`

export const SHOTS = [
  // ------------------------------------------------------------ the arrival: from the lake into the farm
  {
    id: "01-lake",
    title: "the lake",
    seconds: 6,
    start: "assets/hero/desktop.jpeg",
    portrait: "assets/hero/mobile.jpeg",
    push: [[1, 0.5, 0.5], [1.07, 0.6, 0.52]],
    brief: "the film starts on this exact frame, still for a moment, the water glinting; then the camera turns slowly away from the lake toward the road",
  },
  {
    id: "02-road",
    title: "the road",
    seconds: 5,
    start: SCENE("02-road"),
    push: [[1, 0.5, 0.55], [1.2, 0.44, 0.52]],
    px: 0.56, // upright: the road and the palms, the sign wall out of frame rather than cut through its letters
    brief: "walking down the red dirt road beside the lake, the palms passing on the right, toward the stone sign wall and the timber gate",
  },
  {
    id: "03-arrival",
    title: "the farm from above the gate",
    seconds: 7,
    start: SCENE("A1-front"),
    push: [[1.7, 0.6, 0.8], [1, 0.5, 0.5]], // from the gate up and back to the whole farm
    px: 0.48, // upright: the whole sign in the first frame, not half of it
    brief: "the camera rises like a drone over the gate, and the whole farm opens up below: the car park, the tents, the containers and the field among the trees",
  },
  {
    id: "04-inner-gate",
    title: "the inner gate",
    seconds: 5,
    start: SCENE("06-courtyard"),
    push: [[1, 0.5, 0.55], [1.38, 0.52, 0.47]], // the gate's leaves pass out of frame
    brief: "back down at eye level, walking through the open timber gate into the courtyard, the gate's leaves passing on either side",
  },
  {
    id: "05-camp",
    title: "the camp",
    seconds: 5,
    start: SCENE("07-camp"),
    push: [[1.12, 0.36, 0.55], [1.12, 0.64, 0.52]],
    px: 0.4,
    brief: "a slow walk past the white tents, a lantern glowing in the nearest, to the round stone fire pit and its log stools",
  },
  {
    id: "06-studios",
    title: "the studios",
    seconds: 5,
    start: SCENE("08-studios"),
    push: [[1, 0.5, 0.55], [1.15, 0.5, 0.5]],
    brief: "between the two yellow studios and past the long timber table, warm light glowing through their glass doors",
  },
  {
    id: "07-courtyard",
    title: "over the courtyard",
    seconds: 5,
    start: SCENE("A6-courtyard"),
    push: [[1, 0.5, 0.55], [1.22, 0.42, 0.45]], // toward the office
    brief: "a low drone glides over the tents and the fire pit toward the containers",
  },
  // ------------------------------------------------------------ the places, each as its remastered hero
  {
    id: "08-office",
    title: "the office",
    seconds: 4,
    start: HERO("office"),
    cam: [[[13.2, 22.5, 1.7], [13.2, 33.2, 1.4], 50], [[13.2, 28.5, 1.7], [13.2, 33.2, 1.4], 50]],
    push: [[1, 0.5, 0.55], [1.08, 0.5, 0.55]],
    brief: "slowly toward its glass front, warm light inside on the desk and the sofa",
  },
  {
    id: "09-bar",
    title: "the bar",
    seconds: 4,
    start: HERO("bar"),
    cam: [[[7, 31.4, 1.7], [-3.8, 31.4, 1.5], 50], [[2, 31.4, 1.6], [-3.8, 31.4, 1.5], 50]],
    push: [[1, 0.5, 0.5], [1.1, 0.5, 0.45]],
    brief: "slowly toward its open hatch, the coffee machine and the shelves glowing",
  },
  {
    id: "10-guest-rooms",
    title: "the guest rooms",
    seconds: 4,
    start: HERO("guest-room"),
    cam: [[[6.5, 13, 1.7], [-5, 18, 1.4], 50], [[6.5, 27, 1.7], [-5, 22, 1.4], 50]],
    push: [[1.04, 0.35, 0.55], [1.08, 0.65, 0.55]],
    brief: "along the timber veranda, past the doors, the chairs and the lamps",
  },
  {
    id: "11-study-room",
    title: "the study room",
    seconds: 3,
    start: HERO("study-room"),
    cam: [[[-0.5, 34.8, 1.7], [-1.3, 42.7, 1.4], 70], [[-1.3, 36.5, 1.7], [-1.3, 42.7, 1.4], 65]],
    push: [[1, 0.5, 0.5], [1.06, 0.5, 0.5]],
    brief: "toward its open glass front, the long table and the books inside",
  },
  {
    id: "12-galley",
    title: "the galley",
    seconds: 3,
    start: HERO("galley"),
    cam: [[[27.7, 36.5, 1.7], [27.7, 42.7, 1.4], 55], [[27.7, 38, 1.7], [27.7, 42.7, 1.4], 55]],
    push: [[1, 0.5, 0.5], [1.06, 0.55, 0.5]],
    brief: "along its front, the kitchen windows lit, potted herbs by the door",
  },
  {
    id: "13-public-bathroom",
    title: "the public bathroom",
    seconds: 3,
    start: HERO("public-bathroom"),
    cam: [[[49.2, 36.5, 1.7], [49.2, 42.7, 1.4], 55], [[49.2, 38, 1.7], [49.2, 42.7, 1.4], 55]],
    push: [[1, 0.5, 0.5], [1.06, 0.5, 0.5]],
    brief: "toward its open door, the flowers around it swaying",
  },
  {
    id: "14-volleyball",
    title: "volleyball",
    seconds: 3,
    start: HERO("volleyball"),
    cam: [[[-7.5, -7, 4], [-7.5, 4.5, 0], 55], [[5, -3, 3], [-7.5, 4.5, 0], 55]],
    push: [[1.02, 0.4, 0.55], [1.08, 0.6, 0.55]],
    brief: "a slow pan across the court in the sunset light, the ball still on the grass",
  },
  {
    id: "15-dining",
    title: "dining",
    seconds: 3,
    start: HERO("dining"),
    push: [[1, 0.5, 0.55], [1.08, 0.5, 0.6]],
    brief: "under the arched grass thatch toward the long tables, the string lights glowing",
  },
  {
    id: "16-field",
    title: "the field",
    seconds: 3,
    start: HERO("farming", "field-hero.jpg"),
    cam: [[[-14, 38, 2], [-30, 46, 0], 55], [[-14, 38, 9], [-30, 47, 0], 55]],
    push: [[1, 0.5, 0.6], [1.08, 0.5, 0.45]],
    brief: "a slow rise over the vegetable beds and their timber fences",
  },
  {
    id: "17-livestock",
    title: "the livestock",
    seconds: 3,
    start: HERO("livestock"),
    animals: true,
    push: [[1, 0.5, 0.55], [1.06, 0.5, 0.55]],
    brief: "the goats and sheep grazing calmly by their thatched shed",
  },
  // ------------------------------------------------------------ the whole farm from above, and back to the lake
  {
    id: "18-over-the-field",
    title: "over the field",
    seconds: 4,
    start: SCENE("A3-left"),
    push: [[1, 0.5, 0.5], [1.12, 0.42, 0.45]],
    brief: "the drone rises over the field and the volleyball court",
  },
  {
    id: "19-from-above",
    title: "straight down",
    seconds: 5,
    start: SCENE("A2-top"),
    frame: [0.083, 0, 0.917, 0.84], // seen from above, the sign's letters come out garbled: leave them out
    push: [[1, 0.5, 0.5], [1.12, 0.55, 0.45]],
    brief: "looking straight down on the whole farm, like a map",
  },
  {
    id: "20-from-the-back",
    title: "from behind",
    seconds: 4,
    start: SCENE("A5-back"),
    push: [[1.12, 0.45, 0.55], [1.12, 0.55, 0.5]],
    brief: "from behind the back row, looking back over the studios toward the gate",
  },
  {
    id: "21-to-the-lake",
    title: "toward the lake",
    seconds: 6,
    start: SCENE("A4-right"),
    frame: [0.25, 0, 1, 0.75], // toward the lake, away from the sign's slightly misdrawn letters
    push: [[1, 0.5, 0.5], [1.3, 0.62, 0.25]],
    px: 0.62,
    brief: "the drone flies over the trees toward the lake and comes down to its shore; the film ends on photo 01 again",
  },
]

// The film's total length in the cut, with each dissolve overlapping two shots.
export const DISSOLVE = 0.5
export const total = () => SHOTS.reduce((s, x) => s + x.seconds, 0) - DISSOLVE * (SHOTS.length - 1)
