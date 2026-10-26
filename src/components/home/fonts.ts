import { Instrument_Serif } from "next/font/google"

// The display face for the homepage only; called here, not in the root layout, so /docs never
// preloads it. Instrument Serif ships one weight (400), so headings use font-normal.
export const display = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
})
