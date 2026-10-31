import type * as React from "react"

import { RailTable } from "@/components/docs/rail-table"
import { rails } from "@/components/camp/rails"

// The camp's reference section, on its Materials page (D-059: guide/camp/materials.md embeds it; scripts/sync-docs.mjs
// renders it as <CampMaterials />). The camp has no services, so it has no points.

// What to buy: the kit rail on the page, as one table
export function CampMaterials(): React.JSX.Element {
  return <RailTable rails={rails} />
}
