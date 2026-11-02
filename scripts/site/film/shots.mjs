// The homepage film (D-070, guide/film.md): one walk that starts as the homepage hero (the lake plot), takes the road
// to the compound, goes through the gate, the parking and the inner gate, and passes every place as the homepage 2D
// lays them out, each looking as its remastered hero does. It is a concept film (film.md rule 2).
//
// One list, read by:
//   walk.mjs   the previz: start and end frames from the 3D model (compound.html?walk=1) + a timing animatic
//   packs.mjs  the founder's folders on the Desktop: the frame to animate, references and the Veo prompt
//   film.mjs   the cut: the founder's clip where it exists, a slow push on the start image where it does not
//
// cam: [pos, look, fov] at the shot's start and end, in compound.json's frame after the spread (x east, y south,
// h up, metres), as compound.html's window.PLAN holds it. start: the image the shot opens on; when it is null the
// founder makes it first in Nano Banana (still), from the refs, and the shot waits for it. push: the stand-in's slow move on the start image,
// [scale, focus x, focus y] from and to (focus as a fraction of the frame). seconds: its length in the cut.

const HERO = (place, file = `${place}-hero.jpg`) => `public/designs/${place}/render/${file}`
const SURVEY = (frame) => `assets/survey-2026-10-25/${frame}.jpg`

export const SHOTS = [
  {
    id: "01-lake",
    title: "The lake plot",
    seconds: 8,
    start: "assets/hero/desktop.jpeg",
    portrait: "assets/hero/mobile.jpeg",
    refs: [],
    push: [[1, 0.5, 0.5], [1.07, 0.6, 0.52]],
    move:
      "The camera starts exactly on this frame and holds it for one second. Then it glides slowly to the right and a little back along the grassy shore, the tree trunks passing in the foreground. The water ripples and glints, the reeds and the leaves sway, the clouds drift. By the end the camera has turned toward a red dirt road that leaves the shore between the trees.",
    portraitMove:
      "The camera starts exactly on this frame and holds it for one second. Then it rises a little and drifts slowly to the right along the shore. The water ripples and glints, the reeds and the leaves sway, the clouds drift.",
  },
  {
    id: "02-road",
    title: "The road to the compound",
    seconds: 6,
    start: null,
    refs: ["assets/hero/desktop.jpeg", SURVEY("IMG_3158_v01"), SURVEY("IMG_3195_v00")],
    still:
      "A wide photorealistic view at eye level on a red laterite country road in Bugesera, Rwanda, in exactly the warm late-afternoon light, colours and lens of image 1. On the left, tall palms and pines stand in a row behind a simple post-and-wire fence, the lake glinting between their trunks, as in image 2. The road, red earth as in image 3, runs ahead and curves gently right toward a long low stone wall with a timber gate in the distance. Green grass verges and a few flowering shrubs. Nobody on the road.",
    push: [[1.02, 0.5, 0.55], [1.12, 0.55, 0.55]],
    move:
      "A smooth forward tracking shot down the road at a slow driving pace. The palm trunks pass on the left with the lake flickering between them, and the stone wall and the timber gate grow nearer.",
  },
  {
    id: "03-gate",
    title: "The gate",
    seconds: 5,
    start: HERO("parking"),
    refs: [],
    cam: [[[19.5, -8.8, 2.4], [21.8, 0, 0.8], 70], [[22.2, -7.2, 1.8], [24.5, 4, 1.2], 65]],
    push: [[1, 0.5, 0.5], [1.1, 0.72, 0.55]],
    move:
      "A slow, steady push toward the open timber gate between the stone pillars, turning slightly right to line up with it, so that the stone sign wall slides out of frame on the left. The sign's letters stay exactly as they are; never redraw them. The flowers and the trees sway gently.",
  },
  {
    id: "04-parking",
    title: "The parking",
    seconds: 4,
    start: null,
    refs: [HERO("parking"), HERO("parking", "parking-real.webp")],
    cam: [[[21.8, -5.5, 1.8], [11, -1.5, 0.8], 55], [[24.2, 0.5, 1.7], [27, 9, 1.3], 55]],
    still:
      "A photorealistic view at eye level just inside the gate of image 1, in its light and style: an empty car park of five gravel bays edged in timber, as laid out in image 2, with slim black solar lamp posts, two big shade trees and flower beds. On the right a gravel road leaves the car park toward a second timber gate. The geometry follows the last image (a 3D layout sketch); the look follows image 1. No cars.",
    push: [[1.02, 0.4, 0.55], [1.1, 0.65, 0.55]],
    move: "A slow glide across the empty gravel bays, panning right to follow the gravel road toward the second gate.",
  },
  {
    id: "05-inner-gate",
    title: "The inner gate",
    seconds: 5,
    start: null,
    refs: [HERO("parking"), HERO("camp"), HERO("studio")],
    cam: [[[25.5, 2.5, 1.7], [27.5, 11.4, 1.6], 50], [[27.5, 13.8, 1.7], [27, 24, 1.1], 55]],
    still:
      "A photorealistic view at eye level from a gravel road, in the light and style of image 1: a timber double gate with X-braced leaves stands open between stone posts, with curved granite-sett aprons at its foot, like the gate in image 1. Through it, a green courtyard lawn with white hexagonal pop-up tents (image 2) and a round stone fire pit, and saffron container studios on timber decks beyond (image 3), among trees and flowers. The geometry follows the last image (a 3D layout sketch).",
    push: [[1, 0.5, 0.55], [1.12, 0.5, 0.55]],
    move: "A smooth push forward through the open gate into the courtyard. The tents and the fire pit come closer.",
  },
  {
    id: "06-camp",
    title: "The camp",
    seconds: 5,
    start: HERO("camp"),
    refs: [],
    cam: [[[13, 11, 1.4], [20.7, 17, 0.6], 50], [[22, 27, 1.4], [28.4, 24.2, 0.3], 50]],
    push: [[1.04, 0.35, 0.6], [1.1, 0.6, 0.6]],
    move:
      "A slow, low sideways glide to the right past the open tent, its lantern glowing. The other tents drift by; the camera ends looking toward a round stone fire pit with log stools.",
  },
  {
    id: "07-studios",
    title: "The studios",
    seconds: 6,
    start: HERO("studio"),
    refs: [],
    cam: [[[21, 25.5, 1.8], [26.3, 33.2, 1.6], 50], [[44, 25.5, 3.5], [39.4, 33.2, 2.6], 50]],
    push: [[1.02, 0.4, 0.55], [1.1, 0.6, 0.4]],
    move:
      "A slow lateral track to the right along the saffron studio's timber deck, then a gentle rise toward the roof terrace and its two loungers. The sliding door stays half open, with warm light inside.",
  },
  {
    id: "08-office",
    title: "The office",
    seconds: 4,
    start: HERO("office"),
    refs: [],
    cam: [[[13.2, 22.5, 1.7], [13.2, 33.2, 1.4], 50], [[13.2, 28.5, 1.7], [13.2, 33.2, 1.4], 50]],
    push: [[1, 0.5, 0.55], [1.08, 0.5, 0.55]],
    move: "A slow push toward the glazed front, warm light inside.",
  },
  {
    id: "09-guest-rooms",
    title: "The guest rooms",
    seconds: 5,
    start: HERO("guest-room"),
    refs: [],
    cam: [[[6.5, 13, 1.7], [-5, 18, 1.4], 50], [[6.5, 27, 1.7], [-5, 22, 1.4], 50]],
    push: [[1.04, 0.35, 0.55], [1.08, 0.65, 0.55]],
    move: "A slow lateral track along the deck, past the three doors and their chairs; the window lights glow.",
  },
  {
    id: "10-bar",
    title: "The bar",
    seconds: 5,
    start: HERO("bar"),
    refs: [],
    cam: [[[7, 31.4, 1.7], [-3.8, 31.4, 1.5], 50], [[2, 31.4, 1.6], [-3.8, 31.4, 1.5], 50]],
    push: [[1, 0.5, 0.5], [1.1, 0.5, 0.45]],
    move: "A slow push toward the open hatch; the coffee machine and the shelves glow warmly.",
  },
  {
    id: "11-study-room",
    title: "The study room",
    seconds: 3,
    start: HERO("study-room"),
    refs: [],
    cam: [[[-0.5, 34.8, 1.7], [-1.3, 42.7, 1.4], 70], [[-1.3, 36.5, 1.7], [-1.3, 42.7, 1.4], 65]],
    push: [[1, 0.5, 0.5], [1.06, 0.5, 0.5]],
    move: "A slow push toward the open glazing and the long table inside.",
  },
  {
    id: "12-galley",
    title: "The galley",
    seconds: 3,
    start: HERO("galley"),
    refs: [],
    cam: [[[27.7, 36.5, 1.7], [27.7, 42.7, 1.4], 55], [[27.7, 38, 1.7], [27.7, 42.7, 1.4], 55]],
    push: [[1, 0.5, 0.5], [1.06, 0.55, 0.5]],
    move: "A slow lateral drift to the right along the galley's front.",
  },
  {
    id: "13-public-bathroom",
    title: "The public bathroom",
    seconds: 3,
    start: HERO("public-bathroom"),
    refs: [],
    cam: [[[49.2, 36.5, 1.7], [49.2, 42.7, 1.4], 55], [[49.2, 38, 1.7], [49.2, 42.7, 1.4], 55]],
    push: [[1, 0.5, 0.5], [1.06, 0.5, 0.5]],
    move: "A slow push toward the open door, the flowers swaying.",
  },
  {
    id: "14-volleyball",
    title: "Volleyball",
    seconds: 4,
    start: HERO("volleyball"),
    refs: [],
    cam: [[[-7.5, -7, 4], [-7.5, 4.5, 0], 55], [[5, -3, 3], [-7.5, 4.5, 0], 55]],
    push: [[1.02, 0.4, 0.55], [1.08, 0.6, 0.55]],
    move: "A slow pan to the right across the court toward the thatched shelters, in sunset light. The ball lies still.",
  },
  {
    id: "15-dining",
    title: "Dining",
    seconds: 4,
    start: HERO("dining"),
    refs: [],
    push: [[1, 0.5, 0.55], [1.08, 0.5, 0.6]],
    move: "A slow push under the thatch toward the long tables, the string lights glowing.",
  },
  {
    id: "16-field",
    title: "The field",
    seconds: 4,
    start: HERO("farming", "field-hero.jpg"),
    refs: [],
    cam: [[[-14, 38, 2], [-30, 46, 0], 55], [[-14, 38, 9], [-30, 47, 0], 55]],
    push: [[1, 0.5, 0.6], [1.08, 0.5, 0.45]],
    move: "A slow rise over the vegetable beds, the leaves stirring in the breeze.",
  },
  {
    id: "17-livestock",
    title: "Livestock",
    seconds: 3,
    start: HERO("livestock"),
    refs: [],
    animals: true,
    push: [[1, 0.5, 0.55], [1.06, 0.5, 0.55]],
    move: "A slow push; the goats and sheep graze calmly.",
  },
  {
    id: "18-aerial",
    title: "The farm from above",
    seconds: 8,
    start: null, // until the founder's still: the 3D on its paper would break the photographs' look
    refs: ["public/designs/compound/render/compound-real.webp", HERO("studio"), HERO("guest-room"), HERO("bar"), HERO("camp")],
    cam: [[[28.4, 16, 8], [24, 30, 0], 60], [[22, -62, 72], [22, 22, 0], 30]],
    still:
      "A photorealistic aerial view from about 40 m up, looking down at 35 degrees, of the farm laid out exactly as in image 1 (a 3D plan; keep every building where it stands): the saffron studios, the guest rooms, the bar and the tents look as they do in the photos, set among big shade trees, flower beds and a green lawn, with a gravel car park and road at the front. Behind the farm, a bare red hill with young trees, and a lake shining in the distance. Warm late-afternoon light.",
    push: [[1, 0.5, 0.5], [1.1, 0.5, 0.45]],
    move: "A slow crane up and back that reveals the whole farm among its trees, the hill behind it and the lake shining in the distance.",
  },
]

// What every Veo prompt says, after the shot's move: the look stays as designed, nothing is invented.
export const VEO = (shot) =>
  [
    "Animate this image into an 8-second video. Keep everything exactly as designed in the image: the buildings, their colours, materials and layout must not change.",
    shot.move,
    "Real-time, natural motion only: a light breeze in the leaves, grass and flowers; the same soft, warm late-afternoon light as the image.",
    shot.animals
      ? "No people, no vehicles, no new objects, no text, letters or logos added."
      : "No people, no animals, no vehicles, no new objects, no text, letters or logos added.",
    "A smooth, steady, cinematic camera (as on a gimbal), with no cuts and no sudden zoom.",
    "Sound: gentle natural ambience only (birds, breeze); no music, no voices.",
  ].join(" ")

// The film's total length in the cut, with each dissolve overlapping two shots.
export const DISSOLVE = 0.5
export const total = () => SHOTS.reduce((s, x) => s + x.seconds, 0) - DISSOLVE * (SHOTS.length - 1)
