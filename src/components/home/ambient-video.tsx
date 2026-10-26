"use client"

import * as React from "react"
import { Pause, Play } from "lucide-react"

import { cx } from "@/lib/cx"

// Muted ambient loops (D-018). The server renders only the still behind this; the source is
// picked here (portrait or landscape) and attached after the page loads or as the clip nears
// the viewport, never under reduced motion or Save-Data. One pause choice covers every clip on
// the page and is remembered (WCAG 2.2.2).

const REDUCE = "(prefers-reduced-motion: reduce)"
const PORTRAIT = "(orientation: portrait)"
const PAUSED_KEY = "farm:videos-paused"
const PAUSED_EVENT = "farm:videos-paused"

// Storage can throw (private windows, blocked site data); the choice then lasts for this page.
let memoryPaused = false

function listen(query: string, onChange: () => void) {
  const media = window.matchMedia(query)
  media.addEventListener("change", onChange)
  return () => media.removeEventListener("change", onChange)
}
const subscribeReduce = (onChange: () => void) => listen(REDUCE, onChange)
const subscribePortrait = (onChange: () => void) => listen(PORTRAIT, onChange)
const subscribeNever = () => () => {}

function subscribePaused(onChange: () => void) {
  window.addEventListener("storage", onChange)
  window.addEventListener(PAUSED_EVENT, onChange)
  return () => {
    window.removeEventListener("storage", onChange)
    window.removeEventListener(PAUSED_EVENT, onChange)
  }
}

function readPaused() {
  try {
    const stored = window.localStorage.getItem(PAUSED_KEY)
    return stored === null ? memoryPaused : stored === "1"
  } catch {
    return memoryPaused
  }
}

function writePaused(paused: boolean) {
  memoryPaused = paused
  try {
    if (paused) window.localStorage.setItem(PAUSED_KEY, "1")
    else window.localStorage.removeItem(PAUSED_KEY)
  } catch {
    // Kept in memory above.
  }
  window.dispatchEvent(new Event(PAUSED_EVENT))
}

function readSaveData() {
  return Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData)
}

export function AmbientVideo({
  landscape,
  portrait,
  attach = "near",
  label,
  className,
  controlsClassName,
}: {
  landscape?: string
  portrait?: string
  /** "load": start once the page has loaded (the hero); "near": once the clip nears the viewport. */
  attach?: "load" | "near"
  /** Names the clip for the pause button, e.g. "the arrival film". */
  label: string
  className?: string
  controlsClassName?: string
}) {
  const ref = React.useRef<HTMLVideoElement>(null)
  // The server snapshots say "don't play", so nothing loads before hydration.
  const reduce = React.useSyncExternalStore(subscribeReduce, () => window.matchMedia(REDUCE).matches, () => true)
  const upright = React.useSyncExternalStore(subscribePortrait, () => window.matchMedia(PORTRAIT).matches, () => false)
  const saveData = React.useSyncExternalStore(subscribeNever, readSaveData, () => true)
  const paused = React.useSyncExternalStore(subscribePaused, readPaused, () => false)

  const src = (upright && portrait) || landscape || portrait
  const allowed = Boolean(src) && !reduce && !saveData

  React.useEffect(() => {
    const video = ref.current
    if (!video || !allowed || !src) return
    let near = false
    const start = () => {
      if (video.getAttribute("src") !== src) video.src = src
      if (!paused) video.play().catch(() => {})
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        near = entry.isIntersecting
        if (!near) video.pause()
        else if (attach === "near" || document.readyState === "complete") start()
      },
      { rootMargin: "25% 0px" },
    )
    observer.observe(video)
    const onLoad = () => {
      if (near) start()
    }
    window.addEventListener("load", onLoad)
    const onPlaying = () => video.setAttribute("data-playing", "")
    video.addEventListener("playing", onPlaying)
    if (paused) video.pause()
    return () => {
      observer.disconnect()
      window.removeEventListener("load", onLoad)
      video.removeEventListener("playing", onPlaying)
      // cacheComponents keeps hidden routes mounted, so a clip must stop when it leaves.
      video.pause()
    }
  }, [allowed, src, paused, attach])

  if (!src) return null
  return (
    <>
      <video
        ref={ref}
        aria-hidden="true"
        muted
        loop
        playsInline
        preload="none"
        className={cx(
          "pointer-events-none absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-1000 data-playing:opacity-100",
          className,
        )}
      />
      {allowed ? (
        <button
          type="button"
          onClick={() => writePaused(!paused)}
          className={cx(
            "bg-soil/60 text-chalk hover:bg-soil/80 focus-visible:ring-chalk inline-grid size-10 place-items-center rounded-full backdrop-blur-sm transition-colors focus-visible:ring-2 focus-visible:outline-none",
            controlsClassName,
          )}
        >
          {paused ? <Play className="size-4" aria-hidden /> : <Pause className="size-4" aria-hidden />}
          <span className="sr-only">{paused ? `Play ${label}` : `Pause ${label}`}</span>
        </button>
      ) : null}
    </>
  )
}
