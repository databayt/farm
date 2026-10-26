"use client"

// Controls for the studio scene: views, layers, explode, assembly steps, part info.
import { useEffect, useRef, useState } from "react"

import { type PartInfo, StudioScene, type View } from "./studio-scene"

const LAYER_NAMES: Record<string, string> = {
  shell: "Container",
  envelope: "Insulation and lining",
  furniture: "Flat-pack furniture",
  fixtures: "Fixtures and appliances",
  electrical: "Electrical points",
  roof: "Roof terrace and canopies",
}

const NO_WEBGL = "WebGL is not available in this browser. Download the GLB instead."

function hasWebGL() {
  try {
    return !!document.createElement("canvas").getContext("webgl2")
  } catch {
    return false
  }
}

export default function StudioViewerCanvas({ src, parts }: { src: string; parts: string }) {
  const host = useRef<HTMLDivElement>(null)
  const scene = useRef<StudioScene | null>(null)
  const [layers, setLayers] = useState<string[]>([])
  const [off, setOff] = useState<Set<string>>(new Set(["roof", "envelope"]))
  const [steps, setSteps] = useState(0)
  const [step, setStep] = useState(99)
  const [explode, setExplode] = useState(0)
  const [info, setInfo] = useState<Record<string, PartInfo>>({})
  const [picked, setPicked] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(() => (hasWebGL() ? null : NO_WEBGL))

  useEffect(() => {
    if (!host.current || !hasWebGL()) return
    const s = new StudioScene(host.current)
    scene.current = s
    s.onPick = setPicked
    s.load(src).then(() => {
      setLayers(s.layers())
      setSteps(s.steps())
      setStep(s.steps())
      s.setLayer("roof", false)
      s.setLayer("envelope", false)
    }).catch(() => setError("The model could not be loaded."))
    fetch(parts).then((r) => r.json()).then((j: { parts: PartInfo[] }) => {
      setInfo(Object.fromEntries(j.parts.map((p) => [p.id, p])))
    }).catch(() => {})
    return () => s.dispose()
  }, [src, parts])

  const toggle = (l: string) => {
    const next = new Set(off)
    if (next.has(l)) next.delete(l)
    else next.add(l)
    setOff(next)
    scene.current?.setLayer(l, !next.has(l))
  }

  const p = picked ? info[picked] : undefined
  if (error) return <p className="p-6 text-sm">{error}</p>
  return (
    <div className="bg-white text-neutral-900">
      <div ref={host} className="w-full touch-none" />
      <div className="grid gap-3 border-t p-3 text-sm md:grid-cols-3">
        <div className="flex flex-wrap gap-1">
          {(["3d", "plan", "inside", "roof"] as View[]).map((v) => (
            <button key={v} type="button" onClick={() => scene.current?.view(v)}
              className="rounded border px-2 py-1 hover:bg-neutral-100">
              {v === "3d" ? "3D" : v[0].toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2">
          Explode
          <input type="range" min={0} max={1.5} step={0.05} value={explode} className="w-full"
            onChange={(e) => { const t = Number(e.target.value); setExplode(t); scene.current?.setExplode(t) }} />
        </label>
        <label className="flex items-center gap-2">
          Steps {step >= steps ? "all" : `to S${String(step).padStart(2, "0")}`}
          <input type="range" min={0} max={steps} step={1} value={Math.min(step, steps)} className="w-full"
            onChange={(e) => { const t = Number(e.target.value); setStep(t); scene.current?.setStep(t) }} />
        </label>
        <div className="flex flex-wrap gap-x-3 gap-y-1 md:col-span-3">
          {layers.map((l) => (
            <label key={l} className="flex items-center gap-1">
              <input type="checkbox" checked={!off.has(l)} onChange={() => toggle(l)} />
              {LAYER_NAMES[l] ?? l}
            </label>
          ))}
        </div>
        <div className="text-neutral-600 md:col-span-3">
          {p ? (
            <span>
              <strong className="text-neutral-900">{p.id}</strong> · {p.name} · {p.kitName} · {p.material} ·{" "}
              {p.size.join(" × ")} mm{p.step ? ` · step ${p.step}: ${p.stepTitle}` : ""}
            </span>
          ) : (
            "Click a part to see its id, size and assembly step. Drag to orbit, scroll or pinch to zoom."
          )}
        </div>
      </div>
    </div>
  )
}
