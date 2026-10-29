// The services of a room, shared by the guest-room, office and study-room renders (scripts/site/render/*.html), in
// the pattern of the studio's (scripts/studio/render/room.html): every electrical or data point of the page's JSON
// (`electric`, `network`) built as a small device on its wall or ceiling, each circuit's conduit route drawn in its
// colour from the board, up into the ceiling, along it and straight down to the device, and window.TAGS (each
// point's spot in the frame). Pieces on their own (`?item=<id>`) are framed here too.
//
// Plan coordinates as the page's JSON: x right, y toward the front, z up from the finished floor; the three.js
// scene puts plan y on its z axis. A point is { id, model, circuit, at: [x, y, z] (its centre), face, size: [w, h, d]
// in mm }; face is the way it looks: "+x", "-x", "+y", "-y" off a wall, "down" from the ceiling, "up" off the floor.
import * as THREE from "three"
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js"
import { LineSegments2 } from "three/addons/lines/LineSegments2.js"
import { LineSegmentsGeometry } from "three/addons/lines/LineSegmentsGeometry.js"
import { LineMaterial } from "three/addons/lines/LineMaterial.js"

const NORMAL = { "+x": [1, 0, 0], "-x": [-1, 0, 0], "+y": [0, 0, 1], "-y": [0, 0, -1], down: [0, -1, 0], up: [0, 1, 0] }

export function services({ scene, meshes, LINE, floor, ceiling }) {
  const W = (x, y, z) => new THREE.Vector3(x, floor + z, y)
  // a point's frame: u along the wall, v up it, n out of it into the room
  const basis = (face) => {
    const n = new THREE.Vector3(...NORMAL[face])
    if (face === "down" || face === "up") return { u: new THREE.Vector3(1, 0, 0), v: new THREE.Vector3(0, 0, face === "down" ? 1 : -1), n }
    const v = new THREE.Vector3(0, 1, 0)
    return { u: new THREE.Vector3().crossVectors(v, n), v, n }
  }

  const MAT = {}
  const mat = (name) => {
    if (MAT[name]) return MAT[name]
    if (LINE) {
      const x = new THREE.MeshBasicMaterial({ color: "#ffffff", side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 })
      if (name === "fine") x.userData.outlineParameters = { visible: false }
      return (MAT[name] = x)
    }
    const std = (o) => new THREE.MeshStandardMaterial(o)
    return (MAT[name] = ({
      plastic: () => std({ color: "#f4f3ef", roughness: 0.42 }),
      grey: () => std({ color: "#a3a7ab", roughness: 0.5 }),
      dark: () => std({ color: "#2a2b2e", roughness: 0.5, metalness: 0.2 }),
      fine: () => std({ color: "#2a2b2e", roughness: 0.5, metalness: 0.2 }),
      port: () => std({ color: "#121212", roughness: 0.7 }),
      smoke: () => std({ color: "#3b4148", roughness: 0.15, metalness: 0.3 }),
      steel: () => std({ color: "#b9bdc1", roughness: 0.3, metalness: 0.85 }),
      red: () => std({ color: "#c2302b", roughness: 0.4 }),
      green: () => std({ color: "#39b36a", roughness: 0.3, emissive: "#39b36a", emissiveIntensity: 0.6 }),
      led: () => std({ color: "#fff6e2", roughness: 0.3, emissive: "#ffe6b8", emissiveIntensity: 1.1 }),
      shade: () => std({ color: "#2a2b2e", roughness: 0.5, metalness: 0.3, side: THREE.DoubleSide }),
    }[name] ?? (() => std({ color: "#cccccc", roughness: 0.6 })))())
  }

  // one device: a group at the point, its parts placed in the point's own frame (x along, y up, z out)
  function device(p, tag) {
    const { u, v, n } = basis(p.face)
    const g = new THREE.Group()
    g.matrixAutoUpdate = false
    const back = W(...p.at).addScaledVector(n, -(p.size[2] / 1000) / 2) // the wall's face behind it
    g.matrix.makeBasis(u, v, n).setPosition(back)
    scene.add(g)
    const part = (geo, name, pos, rot) => {
      const m = new THREE.Mesh(geo, mat(name))
      m.position.set(...pos)
      if (rot) m.rotation.set(...rot)
      m.castShadow = !LINE; m.receiveShadow = !LINE
      m.userData.elec = true; m.userData.tag = tag
      g.add(m); meshes.push(m)
      return m
    }
    const box = (w, h, d, x, y, z, name, r = 0) =>
      part(r > 0 ? new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2 - 1e-4, h / 2 - 1e-4, d / 2 - 1e-4)) : new THREE.BoxGeometry(w, h, d), name, [x, y, z + d / 2])
    const disc = (r, d, x, y, z, name, seg = 32) => part(new THREE.CylinderGeometry(r, r, d, seg), name, [x, y, z + d / 2], [Math.PI / 2, 0, 0])
    const [w, h, d] = p.size.map((s) => s / 1000)
    const plate = () => box(w, h, 0.01, 0, 0, 0, "plastic", 0.004)
    const outlet = (x) => {
      disc(0.019, 0.004, x, 0, 0.01, "grey")
      for (const s of [-1, 1]) box(0.004, 0.004, 0.002, x + s * 0.009, 0, 0.014, "port")
    }
    switch (p.model) {
      case "board": { // a surface unit board: white body, smoked window over the breakers, a door line
        box(w, h, d, 0, 0, 0, "plastic", 0.008)
        for (const y of [h * 0.18, -h * 0.18]) box(w - 0.06, 0.05, 0.004, 0, y, d, "smoke")
        box(0.008, 0.06, 0.006, w / 2 - 0.02, 0, d, "grey")
        break
      }
      case "socket": plate(); outlet(0); break
      case "socket2": plate(); outlet(-w / 4); outlet(w / 4); break
      case "usb": plate(); outlet(-w / 4); for (const y of [0.012, -0.012]) box(0.012, 0.005, 0.002, w / 5, y, 0.01, "port"); break
      case "switch": plate(); box(w * 0.42, h * 0.55, 0.008, 0, 0, 0.01, "plastic", 0.002); break
      case "switch2": plate(); for (const s of [-1, 1]) box(w * 0.22, h * 0.55, 0.008, s * w * 0.14, 0, 0.01, "plastic", 0.002); break
      case "isolator": plate(); box(w * 0.3, h * 0.45, 0.012, 0, 0, 0.01, "red", 0.002); box(0.01, 0.006, 0.002, 0, -h * 0.34, 0.01, "green"); break
      case "data": plate(); for (const s of [-1, 1]) box(0.016, 0.014, 0.003, s * 0.018, 0, 0.01, "port"); break
      case "av": plate(); box(0.018, 0.008, 0.003, -0.018, 0, 0.01, "port"); box(0.016, 0.014, 0.003, 0.018, 0, 0.01, "port"); break
      case "ceiling": disc(w / 2, d * 0.6, 0, 0, 0, "plastic", 48); disc(w / 2 - 0.02, d * 0.4, 0, 0, d * 0.6, "led", 48); break
      case "alarm": disc(w / 2, d * 0.7, 0, 0, 0, "plastic", 32); disc(w / 3, d * 0.3, 0, 0, d * 0.7, "plastic", 32); box(0.006, 0.006, 0.002, w / 5, 0, d, "red"); break
      case "ap": disc(w / 2, d, 0, 0, 0, "plastic", 48); disc(0.006, 0.002, 0, w / 3, d, "green", 12); break
      case "walllamp": { // a round back plate, an arm out and up, a black cone shade over an LED
        disc(0.04, 0.02, 0, 0, 0, "dark")
        part(new THREE.CylinderGeometry(0.008, 0.008, 0.2, 8), "fine", [0, 0.04, 0.11], [Math.PI / 2 - 0.35, 0, 0])
        part(new THREE.CylinderGeometry(0.04, 0.065, 0.11, 32, 1, true), "shade", [0, 0.09, 0.2])
        part(new THREE.SphereGeometry(0.025, 16, 10), "led", [0, 0.07, 0.2])
        break
      }
      case "wallfan": { // a 300 mm wall fan: bracket, motor out from the wall, a round guard with the blades behind it
        box(0.1, 0.16, 0.03, 0, 0, 0, "plastic", 0.006)
        part(new THREE.CylinderGeometry(0.06, 0.07, 0.14, 24), "plastic", [0, 0, 0.1], [Math.PI / 2, 0, 0])
        part(new THREE.TorusGeometry(w / 2, 0.006, 6, 40), "fine", [0, 0, d - 0.05])
        part(new THREE.TorusGeometry(w / 2, 0.006, 6, 40), "fine", [0, 0, d - 0.01])
        for (let k = 0; k < 3; k++) {
          const a = (k * 2 * Math.PI) / 3
          part(new THREE.BoxGeometry(0.07, w * 0.36, 0.006), "plastic", [Math.sin(a) * w * 0.2, Math.cos(a) * w * 0.2, d - 0.03], [0, 0.3, -a])
        }
        disc(0.035, 0.03, 0, 0, d - 0.045, "plastic", 24)
        break
      }
      case "floorbox": { // a floor box, its lid flush with the boards: a steel rim, the lid, the cable flap
        box(w, h, d, 0, 0, 0, "steel")
        box(w - 0.02, h - 0.02, 0.003, 0, 0, d, "grey")
        box(w * 0.4, 0.02, 0.004, 0, -h / 2 + 0.03, d, "dark")
        break
      }
      case "rack": { // an open-fronted 9U wall cabinet: back, top, bottom and sides in black steel
        box(w, h, 0.012, 0, 0, 0, "dark")
        for (const s of [-1, 1]) box(0.015, h, d, s * (w / 2 - 0.0075), 0, 0, "dark")
        for (const s of [-1, 1]) box(w, 0.015, d, 0, s * (h / 2 - 0.0075), 0, "dark")
        for (const s of [-1, 1]) box(0.012, h - 0.03, 0.01, s * (w / 2 - 0.035), 0, d - 0.03, "steel") // the 19 inch rails
        break
      }
      case "poe": { // a 1U PoE switch: dark body, a strip of ports, green lights
        box(w, h, d, 0, 0, 0, "dark", 0.003)
        for (let k = 0; k < 8; k++) box(0.013, 0.011, 0.002, -w / 2 + 0.06 + k * 0.018, 0.002, d, "port")
        for (let k = 0; k < 8; k++) box(0.003, 0.003, 0.002, -w / 2 + 0.06 + k * 0.018, -h / 2 + 0.008, d, "green")
        break
      }
      case "router": { // a 4G router: white box, two antennas, its lights
        box(w, h, d, 0, 0, 0, "plastic", 0.006)
        for (const s of [-1, 1]) part(new THREE.CylinderGeometry(0.006, 0.006, 0.16, 8), "fine", [s * (w / 2 - 0.02), h / 2 + 0.08, d * 0.3])
        for (let k = 0; k < 4; k++) box(0.004, 0.004, 0.002, -0.03 + k * 0.02, 0, d, "green")
        break
      }
      case "gateway": { // a small fanless computer: grey body with fins on top
        box(w, h, d, 0, 0, 0, "grey", 0.004)
        for (let k = 0; k < 6; k++) box(w - 0.02, 0.006, 0.004, 0, -h / 2 + 0.01 + (k * (h - 0.02)) / 5, d, "dark")
        box(0.004, 0.004, 0.002, w / 2 - 0.012, h / 2 - 0.012, d + 0.002, "green")
        break
      }
      case "ups": { // a tower UPS standing on the floor: dark body, a small screen, its button
        box(w, h, d, 0, 0, 0, "dark", 0.008)
        box(w * 0.5, 0.03, 0.003, 0, h / 2 - 0.06, d, "smoke")
        disc(0.01, 0.003, 0, h / 2 - 0.11, d, "green", 16)
        break
      }
      default: box(w, h, d, 0, 0, 0, "plastic", 0.004)
    }
    g.updateMatrixWorld(true)
    return g
  }

  // build every point; the first point of each model carries the model's tag, the others their own id
  const seen = new Set()
  function build(points, skip = new Set()) {
    for (const p of points) {
      if (skip.has(p.model)) continue
      const tag = seen.has(p.model) ? `${p.model}#${p.id}` : p.model
      seen.add(p.model)
      device(p, tag)
    }
  }

  // each circuit's route: up from the board's top, along the ceiling (first along the board's wall), straight down
  // to the device's top, in the circuit's colour. `systems` gives the colours; `from` the board's id.
  function runs(points, circuits, from, camera, FW, FH) {
    const board = points.find((p) => p.id === from)
    const { u } = basis(board.face)
    const alongX = Math.abs(u.x) > 0.5
    const order = circuits.map((c) => c.id)
    const lines = []
    for (const p of points) {
      if (!p.circuit || p.id === from) continue
      const k = order.indexOf(p.circuit), off = (k - (order.length - 1) / 2) * 0.035
      const top = ceiling - 0.03 - k * 0.025
      const b = [board.at[0] + (alongX ? off : 0), board.at[1] + (alongX ? 0 : off), board.at[2] + board.size[1] / 2000]
      const { n } = basis(p.face)
      const inWall = (q) => [q[0] + n.x * 0.012, q[1] + n.z * 0.012] // just proud of the wall, so the lining never hides it
      const [tx, ty] = p.face === "down" ? [p.at[0], p.at[1]] : inWall(p.at)
      const tz = p.face === "down" ? ceiling : p.at[2] + p.size[1] / 2000
      if (p.face === "up") { // a floor box: down the wall from the board's foot, under the floor, up into the box
        const foot = [board.at[0] + (alongX ? off : 0), board.at[1] + (alongX ? 0 : off), board.at[2] - board.size[1] / 2000]
        const under = -0.06
        lines.push([p.circuit, [foot, [foot[0], foot[1], 0]].map((q) => W(...q)), false])
        const u = [[foot[0], foot[1], 0], [foot[0], foot[1], under]]
        if (alongX) u.push([p.at[0], foot[1], under]); else u.push([foot[0], p.at[1], under])
        u.push([p.at[0], p.at[1], under], [p.at[0], p.at[1], 0])
        lines.push([p.circuit, u.map((q) => W(...q)), true])
        continue
      }
      const pts = [b, [b[0], b[1], top]]
      if (alongX) pts.push([tx, b[1], top]); else pts.push([b[0], ty, top])
      pts.push([tx, ty, top], [tx, ty, tz])
      lines.push([p.circuit, pts.map((q) => W(...q)), false])
    }
    const colour = Object.fromEntries(circuits.map((c) => [c.id, c.colour]))
    for (const [c, pts, hidden] of lines) {
      const pos = []
      for (let i = 1; i < pts.length; i++) if (pts[i].distanceToSquared(pts[i - 1]) > 1e-8) pos.push(...pts[i - 1].toArray(), ...pts[i].toArray())
      // under the floor the run is dashed and drawn through the boards, as the studio draws a hidden pipe
      const m = new LineMaterial({ color: colour[c], linewidth: hidden ? 2.6 : 3.2, dashed: hidden, dashSize: 0.06, gapSize: 0.04, depthTest: !hidden })
      m.resolution.set(FW, FH); m.userData.outlineParameters = { visible: false }
      const l = new LineSegments2(new LineSegmentsGeometry().setPositions(pos), m)
      if (hidden) { l.computeLineDistances(); l.renderOrder = 3 }
      scene.add(l)
    }
  }

  // where each point lands in the frame: just off its device's face
  function tags(points, camera) {
    return points.filter((p) => !p.untagged).map((p) => {
      const { n } = basis(p.face)
      const q = W(...p.at).addScaledVector(n, p.size[2] / 2000).project(camera)
      const x = (q.x + 1) / 2, y = (1 - q.y) / 2
      const edge = x < 0.015 ? "left" : x > 0.985 ? "right" : y < 0.02 ? "top" : y > 0.98 ? "bottom" : ""
      const clamp = (v, a, b) => +Math.min(b, Math.max(a, v)).toFixed(4)
      return { id: p.id, x: clamp(x, 0.015, 0.985), y: clamp(y, 0.02, 0.98), edge }
    })
  }

  // a device's view for its card: three-quarter from in front of its face, from the right and a little above
  function viewOf(points, model) {
    const p = points.find((q) => q.model === model)
    if (!p) return null
    const { u, n } = basis(p.face)
    if (p.face === "down") return new THREE.Vector3(0.5, -1, 0.9)
    return n.clone().multiplyScalar(1).addScaledVector(u, 0.55).add(new THREE.Vector3(0, 0.4, 0))
  }

  return { W, build, runs, tags, viewOf, mat }
}

// one piece on its own: hide everything not tagged with it, then a three-quarter view that fits it in the frame
export function frameItem({ camera, meshes, item, view, FW, FH }) {
  for (const o of meshes) if (o.userData.tag !== item) o.visible = false
  const shown = meshes.filter((o) => o.visible)
  if (!shown.length) throw new Error(`no piece tagged ${item}`)
  const bb = new THREE.Box3()
  for (const o of shown) { o.updateMatrixWorld(true); bb.expandByObject(o) }
  const mid = bb.getCenter(new THREE.Vector3()), r = bb.getBoundingSphere(new THREE.Sphere()).radius
  camera.fov = 30; camera.near = Math.max(0.01, r * 0.2); camera.far = r * 40
  camera.position.copy(mid).addScaledVector(view.clone().normalize(), r * 4)
  camera.lookAt(mid)
  camera.updateMatrixWorld(); camera.updateProjectionMatrix()
  let px = [Infinity, Infinity, -Infinity, -Infinity]
  for (const xx of [bb.min.x, bb.max.x]) for (const yy of [bb.min.y, bb.max.y]) for (const zz of [bb.min.z, bb.max.z]) {
    const p = new THREE.Vector3(xx, yy, zz).project(camera)
    const X = ((p.x + 1) / 2) * FW, Y = ((1 - p.y) / 2) * FH
    px = [Math.min(px[0], X), Math.min(px[1], Y), Math.max(px[2], X), Math.max(px[3], Y)]
  }
  let w = (px[2] - px[0]) * 1.2, h = (px[3] - px[1]) * 1.2
  if (w / h > FW / FH) h = (w * FH) / FW; else w = (h * FW) / FH
  camera.setViewOffset(FW, FH, (px[0] + px[2]) / 2 - w / 2, (px[1] + px[3]) / 2 - h / 2, w, h)
  return { mid, bb }
}

// the piece stands on the white page: only its shadow shows
export function itemGround(scene, bb) {
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.ShadowMaterial({ opacity: 0.16 }))
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true
  ground.position.set((bb.min.x + bb.max.x) / 2, bb.min.y, (bb.min.z + bb.max.z) / 2)
  scene.add(ground)
}
