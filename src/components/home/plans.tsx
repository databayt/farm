import { CompoundPlan } from "./compound-plan"
import { getLocale } from "@/components/internationalization/locale"

import { words } from "./words"

// 2D, in /en/studio's pattern: the plan across the full width under the hero; 3D follows straight after.
// On phones the drawing keeps a readable width and scrolls sideways inside its own frame.
export async function Plans() {
  const { title, label, note } = words[await getLocale()].plans
  return (
    <section id="plans" aria-labelledby="plans-title">
      <div className="px-4 pt-10 pb-6 md:px-10">
        <h2 id="plans-title" className="text-3xl font-semibold tracking-tight">
          {title}
        </h2>
        <div className="mt-6 overflow-x-auto">
          <CompoundPlan title={label} className="block h-auto w-full min-w-[900px]" />
        </div>
        <p className="text-muted-foreground mt-3 text-sm">{note}</p>
      </div>
    </section>
  )
}
