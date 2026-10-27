import { CompoundPlan } from "./compound-plan"
import { copy } from "./copy"

// 2D, in /en/studio's pattern: the plan fills the screen under the hero; 3D follows straight after.
// On phones the drawing keeps a readable width and scrolls sideways inside its own frame.
export function Plans() {
  const { title, label, note } = copy.plans
  return (
    <section id="plans" aria-labelledby="plans-title">
      <div className="flex flex-col px-4 pt-10 pb-6 md:px-10 lg:h-[calc(100svh-var(--header-height))] lg:min-h-[560px]">
        <h2 id="plans-title" className="text-3xl font-semibold tracking-tight">
          {title}
        </h2>
        <div className="mt-6 flex min-h-0 flex-1 items-center overflow-x-auto">
          <CompoundPlan title={label} className="block h-auto w-full min-w-[640px] lg:max-h-full lg:min-w-0" />
        </div>
        <p className="text-muted-foreground mt-3 text-sm">{note}</p>
      </div>
    </section>
  )
}
