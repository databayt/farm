"use client"

// The 3D studio model: a poster first (saves mobile data), then three.js on demand.
import dynamic from "next/dynamic"
import { useState } from "react"

const Canvas = dynamic(() => import("./studio-viewer-canvas"), {
  ssr: false,
  loading: () => <p className="text-muted-foreground p-6 text-sm">Loading the 3D model…</p>,
})

export function StudioViewer({ src, parts, poster, title }: { src: string; parts: string; poster: string; title?: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="my-6 overflow-hidden rounded-lg border">
      {open ? (
        <Canvas src={src} parts={parts} />
      ) : (
        <button type="button" onClick={() => setOpen(true)} className="group relative block w-full bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={poster} alt={title ?? "Studio model"} className="h-auto w-full" loading="lazy" />
          <span className="bg-primary text-primary-foreground absolute bottom-4 left-1/2 -translate-x-1/2 rounded-md px-4 py-2 text-sm font-medium shadow group-hover:opacity-90">
            Load the 3D model
          </span>
        </button>
      )}
      <div className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 border-t px-3 py-2 text-xs">
        <span>{title ?? "Studio model"}</span>
        <a href={src} download className="underline underline-offset-4">Download GLB</a>
        <a href={parts} download className="underline underline-offset-4">Parts list (JSON)</a>
      </div>
    </div>
  )
}
