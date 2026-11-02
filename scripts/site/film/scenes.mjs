// The group of scene images the film is edited from (D-070, founder 2026-11-02: "generate group scene images
// first, then edit them into video"). The founder makes each in Nano Banana from the references and prompt that
// scenes-pack.mjs writes to the Desktop; no API.
//
//   VIEWS   the whole farm from six angles: the full area and every place in it
//   SCENES  the walk at eye level, a cameraman's stops from the lake plot to the far end, in one light
//
// cam: [pos, look, fov] in compound.json's frame after the spread (x east, y south, h up, metres), rendered by
// walk.mjs --scenes from the homepage 3D (compound.html?walk=1) painted in the heroes' colours (PAINTS), as each
// image's layout reference. A scene with no cam has no place in the 3D yet; its photo is its reference.

import { readFileSync } from "node:fs"
import { join } from "node:path"

const HERO = (place, file = `${place}-hero.jpg`) => `public/designs/${place}/render/${file}`

// The farm's fruit trees, counted from compound.json (D-071: the founder's A1 picture), so every prompt names the same
// number and kinds the homepage 2D and 3D draw
const FRUIT = JSON.parse(readFileSync(join(import.meta.dirname, "../../../src/components/home/compound.json"), "utf8")).garden.fruit
const say = (n) => ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"][n] ?? String(n)
export const TREES =
  `${say(FRUIT.mango.length)} mango trees heavy with fruit, ${say(FRUIT.orange.length)} orange trees full of oranges ` +
  `and ${say(FRUIT.banana.length)} banana clumps`

// The remastered heroes' paints, where they differ from the homepage 3D's (compound.html PAINT)
export const PAINTS = "rooms:forest,office:navy,study:deepteal,galley:deepteal,bath:deepteal"

// The light every image shares: the lake plot's, where the film starts
export const LIGHT = "assets/hero/desktop.jpeg"
// The real lie of the land from the hill, 2026-10-25 (survey frame #56, no people): the compound below, a tree line,
// the lake beyond and far hills
export const SITE = "assets/survey-2026-10-25/IMG_3191_v00.jpg"

// Every place, as its remastered hero shows it; scenes-pack.mjs tiles them, named, into one look board
export const PLACES = [
  ["STUDIOS", HERO("studio")],
  ["GUEST ROOMS", HERO("guest-room")],
  ["OFFICE", HERO("office")],
  ["STUDY ROOM", HERO("study-room")],
  ["GALLEY", HERO("galley")],
  ["PUBLIC BATHROOM", HERO("public-bathroom")],
  ["BAR", HERO("bar")],
  ["CAMP", HERO("camp")],
  ["VOLLEYBALL", HERO("volleyball")],
  ["GATE + PARKING", HERO("parking")],
  ["DINING", HERO("dining")],
  ["FIELD", HERO("farming", "field-hero.jpg")],
  ["LIVESTOCK", HERO("livestock")],
]

const EVERY_PLACE =
  "Every place looks exactly as in its photo on image 2 (the names on image 2 are labels only; never write them in the picture): " +
  "the two yellow STUDIOS with dark steel roofs, roof terraces and timber decks; the long dark-green GUEST ROOMS block with its timber veranda; " +
  "the navy OFFICE with its glass front on a timber deck; the red BAR with its open hatch and deck; in the back row the teal STUDY ROOM with its glass front, " +
  "the long teal GALLEY and the teal PUBLIC BATHROOM; the white CAMP tents round a round stone fire pit with log stools and a long timber table; " +
  "the VOLLEYBALL court on the lawn; at the front the gravel PARKING, the gravel road, the timber gates and the stone sign wall; beside the farm, " +
  "behind its own fence, the vegetable FIELD. " +
  `Its fruit trees, exactly where image 1 shows them and no more: ${TREES}; every other tree is a big shade tree.`

const LAND =
  "Around it, the real land of image 3: red laterite earth, a lush mown lawn, big shade trees and flower beds along the decks, " +
  "a tree line, and the lake shining in the distance with far hills."

const LOOK =
  "Warm late-afternoon light like image 4, soft long shadows, natural colours. Photorealistic, like a photograph from a high-end travel magazine. " +
  "No people, no animals, no cars, no text or letters anywhere except the sign wall's own DIGITAL FARM letters. 16:9."

// ------------------------------------------------------------ the whole farm, six angles
// fit: the renderer frames the whole model tightly from the camera's angle (all but the low courtyard view)
const view = (id, title, angle, cam, fit = true) => ({ id, title, cam, angle, fit })
export const VIEWS = [
  view("A1-front", "From above the gate", "a high aerial photograph from beyond the front gate", [[10, -75, 60], [8, 18, 0], 38]),
  view("A2-top", "Straight down", "a drone photograph looking straight down, like a map", [[8, 17, 160], [8, 18, 0], 38]),
  view("A3-left", "Over the field and the volleyball court", "a high aerial photograph from the field's side", [[-75, -35, 45], [-5, 20, 0], 45]),
  view("A4-right", "Over the east lawn", "a high aerial photograph from the east lawn's side", [[85, -30, 45], [20, 20, 0], 45]),
  view("A5-back", "From behind the back row", "a high aerial photograph from behind the back row, looking back toward the gate", [[12, 100, 55], [12, 12, 0], 42]),
  view("A6-courtyard", "Over the courtyard", "a low drone photograph over the courtyard, about 14 m up", [[30, 6, 14], [24, 30, 0], 62], false),
].map((v) => ({
  ...v,
  prompt: `Make ${v.angle} of the whole farm, from exactly the angle and with exactly the layout of image 1 (a 3D model: keep every building, path, tent, court and tree where it stands, at its size and colour). ${EVERY_PLACE} ${LAND} ${LOOK}`,
}))

// ------------------------------------------------------------ the walk, at eye level
// refs: the photos of the places in frame, after the layout. move: how the camera goes on to the next scene (the
// film's edit and, later, its video prompts).
const scene = (id, title, { cam = null, refs = [], see, move }) => ({ id, title, cam, refs, see, move })
export const SCENES = [
  scene("01-lake", "The lake plot", {
    refs: [LIGHT],
    see: "This is the homepage picture itself; nothing to make.",
    move: "The camera turns from the water toward the shore road.",
  }),
  scene("02-road", "The road to the farm", {
    refs: [LIGHT, "assets/survey-2026-10-25/IMG_3158_v01.jpg", "assets/survey-2026-10-25/IMG_3195_v00.jpg"],
    see: "a red laterite country road at eye level, tall palms and pines in a row behind a post-and-wire fence on the left, the lake glinting between their trunks, the road curving ahead toward a long low stone wall and a timber gate in the distance",
    move: "Walking down the road toward the gate.",
  }),
  scene("03-gate", "The gate", {
    refs: [HERO("parking")],
    see: "the front of the farm at eye level from the road: the stone sign wall with DIGITAL FARM on the left, the timber gate open between stone pillars on the right, flowers along the wall",
    move: "Walking through the open gate.",
  }),
  scene("04-parking", "The parking", {
    cam: [[22.5, -5, 1.7], [12, -1, 0.8], 60],
    refs: [HERO("parking"), HERO("parking", "parking-real.webp")],
    see: "just inside the gate, at eye level: the empty gravel parking, its bays edged in timber, slim black solar lamps, shade trees and flower beds, the gravel road leaving on the right",
    move: "Turning right onto the gravel road.",
  }),
  scene("05-inner-gate", "The inner gate", {
    cam: [[24.8, 1.5, 1.7], [27.5, 11.4, 1.5], 55],
    refs: [HERO("parking"), HERO("camp")],
    see: "on the gravel road at eye level: the second timber gate ahead, open, X-braced, between stone posts, and through it the courtyard lawn with white tents",
    move: "Walking through the inner gate into the courtyard.",
  }),
  scene("06-courtyard", "The courtyard", {
    cam: [[27.5, 12.6, 1.7], [26, 26, 1.2], 62],
    refs: [HERO("camp"), HERO("studio")],
    see: "just inside the inner gate at eye level: the courtyard lawn opens up, the white tents on the left, the round stone fire pit ahead, the yellow studios and the other containers beyond, among trees",
    move: "Walking across the lawn toward the fire pit.",
  }),
  scene("07-camp", "The camp and the fire pit", {
    cam: [[33, 17, 1.6], [24, 21, 0.6], 58],
    refs: [HERO("camp")],
    see: "at eye level beside the camp: the white tents, a lantern glowing inside the nearest, the round stone fire pit with log stools",
    move: "Turning toward the studios.",
  }),
  scene("08-studios", "The studios", {
    cam: [[32.5, 24.5, 1.7], [32.5, 33.2, 1.8], 62],
    refs: [HERO("studio")],
    see: "at eye level on the lawn: the two yellow studios side by side on their timber decks, the long timber table in front, their sliding doors open, warm light inside",
    move: "Climbing the stair to a roof terrace.",
  }),
  scene("09-terrace", "From a studio's roof terrace", {
    cam: [[26.3, 33.2, 4.6], [20, 15, 0], 62],
    refs: [HERO("studio"), HERO("camp")],
    see: "from a studio's roof terrace, two loungers in the foreground: the whole courtyard below, the tents, the fire pit, the guest rooms on the left, the gates beyond",
    move: "Coming down and walking left to the office.",
  }),
  scene("10-office", "The office", {
    cam: [[13.2, 26, 1.7], [13.2, 33.2, 1.5], 58],
    refs: [HERO("office")],
    see: "at eye level: the navy office with its glass front on a timber deck, a desk and a sofa inside",
    move: "Walking on to the bar on the corner.",
  }),
  scene("11-bar", "The bar", {
    cam: [[4.5, 31.4, 1.7], [-3.8, 31.4, 1.5], 58],
    refs: [HERO("bar")],
    see: "at eye level: the red bar on the corner, its hatch open, the coffee machine and shelves lit, its deck in front",
    move: "Turning along the guest rooms' veranda.",
  }),
  scene("12-guest-rooms", "The guest rooms", {
    cam: [[4.5, 12.5, 1.7], [-4.5, 21, 1.4], 60],
    refs: [HERO("guest-room")],
    see: "at eye level, looking along the long dark-green guest rooms block: its timber veranda, three doors, chairs and lamps",
    move: "Walking round to the back row.",
  }),
  scene("13-study-room", "The study room", {
    cam: [[-0.5, 35, 1.7], [-1.3, 42.7, 1.4], 68],
    refs: [HERO("study-room")],
    see: "at eye level: the teal study room with its glass front open, a long table and books inside",
    move: "Walking along the back row to the galley.",
  }),
  scene("14-galley", "The galley", {
    cam: [[27.7, 35.6, 1.7], [27.7, 42.7, 1.4], 70],
    refs: [HERO("galley")],
    see: "at eye level: the long teal galley, its kitchen windows lit, potted herbs by the door",
    move: "On to the public bathroom.",
  }),
  scene("15-public-bathroom", "The public bathroom", {
    cam: [[49.2, 36, 1.7], [49.2, 42.7, 1.4], 62],
    refs: [HERO("public-bathroom")],
    see: "at eye level: the teal public bathroom, its door open, flowers around it",
    move: "Out onto the lawn by the volleyball court.",
  }),
  scene("16-volleyball", "The volleyball court", {
    cam: [[-7.5, -5.5, 2], [-7.5, 4.5, 0.5], 62],
    refs: [HERO("volleyball")],
    see: "at eye level at the edge of the volleyball court: the net, the white lines on the lawn, a ball resting on the grass",
    move: "Walking on to the dining shelter.",
  }),
  scene("17-dining", "Dining", {
    refs: [HERO("dining")],
    see: "at eye level: the dining shelter under its grass thatch on arched poles, its low brick wall, the long tables and benches, string lights",
    move: "Out to the field.",
  }),
  scene("18-field", "The field", {
    cam: [[-16, 36, 1.8], [-30, 46, 0.3], 60],
    refs: [HERO("farming", "field-hero.jpg")],
    see: "at eye level at the field's fence: rows of vegetable beds with drip lines, a timber fence, young trees",
    move: "On to the livestock.",
  }),
  scene("19-livestock", "The livestock", {
    refs: [HERO("livestock")],
    see: "at eye level: the livestock paddock and its thatched shed, goats and sheep grazing",
    move: "The camera rises above the whole farm (view A1), then the film returns to the lake.",
  }),
]
