"use client"

import * as React from "react"
import { Play } from "lucide-react"

// The hero's button: the film plays in the hero itself, with no player (D-070). Its first and last seconds are the
// hero's own picture (scripts/site/film/film.mjs), so the picture seems to start moving. The <video> is in the
// hero's markup (#hero-film, hero.tsx), cropped as the picture is; while it plays, the section and <html> carry
// data-film, which fades the words and the header (CSS only). It loads when the button is hovered or focused,
// shows once it is playing, and goes back to the picture when it ends, on Escape, on a click on the picture, when the
// hero scrolls away or the tab is hidden.
export function WatchFilm({ labels, className }: { labels: { watch: string; close: string }; className?: string }) {
  const [playing, setPlaying] = React.useState(false)
  const stopRef = React.useRef<() => void>(() => {})

  const film = () => document.getElementById("hero-film") as HTMLVideoElement | null
  const warm = () => {
    const v = film()
    if (v && v.preload !== "auto") v.preload = "auto"
  }

  const play = () => {
    const v = film()
    const section = v?.closest("section")
    if (!v || !section) return
    const root = document.documentElement
    const off = new AbortController()
    const { signal } = off

    const stop = () => {
      off.abort()
      v.removeAttribute("data-on") // fades back over the picture (the film ends on it)
      section.removeAttribute("data-film")
      root.removeAttribute("data-film")
      setPlaying(false)
      window.setTimeout(() => {
        if (v.hasAttribute("data-on")) return // played again meanwhile
        v.pause()
        v.currentTime = 0
      }, 700)
    }
    stopRef.current = stop

    v.addEventListener("playing", () => v.setAttribute("data-on", ""), { signal, once: true })
    v.addEventListener("ended", stop, { signal })
    v.addEventListener("error", stop, { signal })
    v.addEventListener("click", stop, { signal })
    document.addEventListener("keydown", (e) => e.key === "Escape" && stop(), { signal })
    document.addEventListener("visibilitychange", () => document.hidden && stop(), { signal })
    const seen = new IntersectionObserver(([entry]) => entry.intersectionRatio < 0.4 && stop(), { threshold: [0, 0.4] })
    seen.observe(section)
    signal.addEventListener("abort", () => seen.disconnect())

    section.setAttribute("data-film", "")
    root.setAttribute("data-film", "")
    setPlaying(true)
    v.preload = "auto"
    v.currentTime = 0
    v.muted = false
    v.play().catch(stop)
  }

  React.useEffect(() => () => stopRef.current(), [])

  return (
    <button
      type="button"
      onPointerEnter={warm}
      onFocus={warm}
      onClick={() => (playing ? stopRef.current() : play())}
      aria-label={playing ? labels.close : undefined}
      className={className}
    >
      {labels.watch}
      <Play className="size-5" strokeWidth={1.5} aria-hidden />
    </button>
  )
}
