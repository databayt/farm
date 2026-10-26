// three.js scene for the studio model, kept out of React: renderer, cameras, controls, picking,
// layer visibility, explode and assembly-step filters. The React canvas only drives its setters.
import * as THREE from "three"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"

export type PartInfo = {
  id: string
  name: string
  kit: string
  kitName: string
  layer: string
  material: string
  size: number[]
  step: string
  stepTitle: string
}

type Extras = { kit?: string; layer?: string; step?: number; explode?: number[] }

export type View = "3d" | "plan" | "inside" | "roof"

export class StudioScene {
  private renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera: THREE.PerspectiveCamera
  private controls: OrbitControls
  private raycaster = new THREE.Raycaster()
  private nodes: THREE.Object3D[] = []
  private base = new Map<THREE.Object3D, THREE.Vector3>()
  private hidden = new Set<string>()
  private explode = 0
  private maxStep = 99
  private frame = 0
  private resize: ResizeObserver
  private highlight: THREE.Mesh | null = null
  onPick: (id: string | null) => void = () => {}

  constructor(private host: HTMLElement) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    host.appendChild(this.renderer.domElement)
    this.camera = new THREE.PerspectiveCamera(40, 1, 0.05, 200)
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true
    this.scene.add(new THREE.HemisphereLight(0xffffff, 0x9a8f80, 2.2))
    const sun = new THREE.DirectionalLight(0xffffff, 1.6)
    sun.position.set(4, 8, 6)
    this.scene.add(sun)
    this.resize = new ResizeObserver(() => this.fit())
    this.resize.observe(host)
    this.fit()
    this.renderer.domElement.addEventListener("click", this.pick)
    const loop = () => {
      this.controls.update()
      this.renderer.render(this.scene, this.camera)
      this.frame = requestAnimationFrame(loop)
    }
    loop()
  }

  async load(url: string) {
    const gltf = await new GLTFLoader().loadAsync(url)
    gltf.scene.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        this.nodes.push(o)
        this.base.set(o, o.position.clone())
      }
    })
    this.scene.add(gltf.scene)
    this.view("3d")
    this.apply()
  }

  layers() {
    return [...new Set(this.nodes.map((n) => (n.userData as Extras).layer ?? ""))].sort()
  }

  steps() {
    return Math.max(0, ...this.nodes.map((n) => (n.userData as Extras).step ?? 0))
  }

  setLayer(layer: string, on: boolean) {
    if (on) this.hidden.delete(layer)
    else this.hidden.add(layer)
    this.apply()
  }

  setExplode(t: number) {
    this.explode = t
    this.apply()
  }

  setStep(s: number) {
    this.maxStep = s
    this.apply()
  }

  view(v: View) {
    const c = new THREE.Vector3(2.9, 1.1, 1.1)
    const pos = {
      "3d": new THREE.Vector3(-3, 6.5, 9.5),
      plan: new THREE.Vector3(2.9, 12, 1.11),
      inside: new THREE.Vector3(0.6, 1.6, 1.9),
      roof: new THREE.Vector3(-4, 9, 10),
    }[v]
    const target = v === "inside" ? new THREE.Vector3(5.2, 1.2, 0.6) : v === "roof" ? new THREE.Vector3(2.9, 3.4, 1.4) : c
    this.camera.position.copy(pos)
    this.controls.target.copy(target)
    this.camera.fov = v === "inside" ? 70 : 40
    this.camera.updateProjectionMatrix()
  }

  dispose() {
    cancelAnimationFrame(this.frame)
    this.resize.disconnect()
    this.renderer.domElement.removeEventListener("click", this.pick)
    this.controls.dispose()
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh
      m.geometry?.dispose()
      const mat = m.material as THREE.Material | THREE.Material[] | undefined
      if (Array.isArray(mat)) mat.forEach((x) => x.dispose())
      else mat?.dispose()
    })
    this.renderer.dispose()
    this.renderer.domElement.remove()
  }

  private apply() {
    for (const n of this.nodes) {
      const e = n.userData as Extras
      n.visible = !this.hidden.has(e.layer ?? "") && (e.step ?? 0) <= this.maxStep
      const b = this.base.get(n)!
      const d = e.explode ?? [0, 0, 0]
      n.position.set(b.x + d[0] * this.explode, b.y + d[1] * this.explode, b.z + d[2] * this.explode)
    }
  }

  private fit() {
    const w = this.host.clientWidth || 600
    const h = Math.max(320, Math.round(w * 0.62))
    this.renderer.setSize(w, h)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
  }

  private pick = (ev: MouseEvent) => {
    const r = this.renderer.domElement.getBoundingClientRect()
    const p = new THREE.Vector2(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1)
    this.raycaster.setFromCamera(p, this.camera)
    const hit = this.raycaster.intersectObjects(this.nodes.filter((n) => n.visible), false)
      .find((h) => (h.object.userData as Extras).layer !== "shell")
    if (this.highlight) {
      this.scene.remove(this.highlight)
      this.highlight = null
    }
    if (!hit) return this.onPick(null)
    const box = new THREE.Box3().setFromObject(hit.object)
    const helper = new THREE.Box3Helper(box, 0xe11d48) as unknown as THREE.Mesh
    this.highlight = helper
    this.scene.add(helper)
    this.onPick(hit.object.name)
  }
}
