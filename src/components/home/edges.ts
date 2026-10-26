// Absolute overlays on full-bleed bands (captions, pause buttons) line up with the max-w-7xl
// content column instead of the window edge: 2rem in, or centred past 80rem.
export const EDGE_LEFT = "left-4 md:left-[max(2rem,calc((100%_-_80rem)/2_+_2rem))]"
export const EDGE_RIGHT = "right-4 md:right-[max(2rem,calc((100%_-_80rem)/2_+_2rem))]"
