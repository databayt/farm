"use client"

import * as React from "react"
import { Play, X } from "lucide-react"

import { VIDEOS } from "./assets.generated"
import { copy } from "./copy"

// The hero's button: the courtyard film (the orbit clip of 2026-10-25, its upright cut on portrait screens)
// full screen in a native <dialog>, so Escape and the top layer come with it. The video loads only when opened.
export function WatchFilm({ className }: { className?: string }) {
  const dialog = React.useRef<HTMLDialogElement>(null)
  const video = React.useRef<HTMLVideoElement>(null)
  const [open, setOpen] = React.useState(false)
  const film = VIDEOS.orbit
  const upright = VIDEOS["orbit-portrait"]
  if (!film) return null

  const show = () => {
    setOpen(true)
    dialog.current?.showModal()
  }
  const hide = () => dialog.current?.close()

  return (
    <>
      <button type="button" onClick={show} className={className}>
        {copy.hero.watch}
        <Play className="size-5" strokeWidth={1.5} aria-hidden />
      </button>
      <dialog
        ref={dialog}
        aria-label={copy.hero.watch}
        onClose={() => {
          video.current?.pause()
          setOpen(false)
        }}
        onClick={(e) => e.target === e.currentTarget && hide()}
        className="m-0 h-dvh max-h-none w-full max-w-none bg-black p-0 text-white backdrop:bg-black"
      >
        {open ? (
          <video
            ref={video}
            autoPlay
            loop
            muted
            playsInline
            controls
            className="size-full object-contain"
          >
            {upright ? <source src={upright.src} media="(orientation: portrait)" type="video/mp4" /> : null}
            <source src={film.src} type="video/mp4" />
          </video>
        ) : null}
        <p className="absolute top-5 left-4 text-xs tracking-[0.12em] uppercase opacity-80 md:left-10">{copy.captions.today}</p>
        <button
          type="button"
          onClick={hide}
          aria-label={copy.hero.closeFilm}
          className="absolute top-3 right-2 inline-grid size-11 place-items-center rounded-full md:right-8"
        >
          <X className="size-6" aria-hidden />
        </button>
      </dialog>
    </>
  )
}
