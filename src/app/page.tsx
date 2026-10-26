import Link from "next/link"

import { Button } from "@/components/ui/button"

// The public website is Stage 6; until then the root introduces the study.
export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-6 px-6 py-24">
      <p className="text-muted-foreground text-sm">databayt · open study</p>
      <h1 className="text-4xl font-semibold tracking-tight text-balance">
        Planning a technology-enabled integrated farm in Rwanda
      </h1>
      <p className="text-muted-foreground text-lg text-balance">
        Fruit trees, goats and pasture on 2–10 ha near a lake in the broader Kigali region. The full
        feasibility study, in the open: research, design, engineering, finance and the plan, with
        every claim labelled verified, estimated, assumed or unknown.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/docs">Read the study</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/docs/preliminary-report">Preliminary report</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/en/studio">Container studios</Link>
        </Button>
      </div>
    </main>
  )
}
