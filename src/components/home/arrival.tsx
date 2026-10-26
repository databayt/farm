import { cn } from "@/lib/utils"

import { copy } from "./copy"
import { Render } from "./render"
import { SectionHead } from "./section-head"
import { StepObserver } from "./step-observer"

// Literal class names, one per step, so Tailwind can see them.
const SHOWN = [
  "group-data-[active=0]/arrival:opacity-100",
  "group-data-[active=1]/arrival:opacity-100",
  "group-data-[active=2]/arrival:opacity-100",
  "group-data-[active=3]/arrival:opacity-100",
]

// The way in, step by step: text scrolls past a sticky picture that changes with each step.
// On phones each step carries its own picture instead.
export function Arrival() {
  const { eyebrow, title, lead, steps } = copy.wayIn
  return (
    <section id="way-in" aria-labelledby="way-in-title" className="bg-background py-24 md:py-32">
      <SectionHead id="way-in-title" eyebrow={eyebrow} title={title} lead={lead} />
      <StepObserver className="group/arrival mx-auto mt-12 grid max-w-7xl gap-x-16 px-4 md:mt-16 md:px-8 lg:grid-cols-[1fr_1.2fr]">
        <ol className="lg:py-[18vh]">
          {steps.map((step, i) => (
            <li
              key={step.id}
              data-step={i}
              className="flex flex-col gap-4 border-t py-10 first:border-t-0 lg:min-h-[72vh] lg:justify-center lg:border-t-0 lg:py-0"
            >
              <Render id={step.id} sizes="100vw" className="mb-2 aspect-[4/3] rounded-2xl lg:hidden" />
              <p className="text-leaf font-mono text-xs tracking-[0.22em]">{step.n}</p>
              <h3 className="font-display text-4xl leading-none font-normal md:text-6xl">{step.title}</h3>
              <p className="text-muted-foreground max-w-md text-lg text-pretty">{step.text}</p>
            </li>
          ))}
        </ol>
        <div className="relative hidden lg:block">
          <div className="sticky top-[calc(var(--header-height)+1.5rem)] h-[calc(100svh-var(--header-height)-3rem)] overflow-hidden rounded-2xl">
            {steps.map((step, i) => (
              <div
                key={step.id}
                className={cn("absolute inset-0 opacity-0 transition-opacity duration-700 ease-out", SHOWN[i])}
              >
                <Render id={step.id} sizes="(min-width: 1024px) 55vw, 100vw" className="size-full" />
              </div>
            ))}
          </div>
        </div>
      </StepObserver>
    </section>
  )
}
