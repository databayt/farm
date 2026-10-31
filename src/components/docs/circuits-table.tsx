import type * as React from "react"

// A place's circuits on its Electric page (D-059), from its JSON's `electric.circuits`: what each serves, its breaker,
// its cable and its design load. The JSONs name the fields two ways (the rooms: cable_mm2 and design_A; the galley
// and the bar: cable and kW; the public bathroom: circuit for id), so the table reads either.
export type Circuit = {
  id?: string; circuit?: string; serves: string; device: string
  cable_mm2?: number; cable?: number; design_A?: number; kw?: number; phases?: number
}

const load = (c: Circuit) => c.design_A ? `${c.design_A} A` : c.kw ? `${c.kw} kW${c.phases === 3 ? ", three phase" : ""}` : ""

export function CircuitsTable({ circuits }: { circuits: Circuit[] }): React.JSX.Element {
  return (
    <div className="mt-6 overflow-x-auto rounded-xl border">
      <table className="w-full text-sm">
        <thead className="text-muted-foreground bg-muted/40">
          <tr>
            {["Circuit", "Serves", "Breaker", "Cable", "Design load"].map((label) => (
              <th key={label} className="px-3 py-2 text-start font-medium whitespace-nowrap">{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {circuits.map((c) => (
            <tr key={c.id ?? c.circuit} className="border-t">
              <td className="px-3 py-2 font-medium whitespace-nowrap">{c.id ?? c.circuit}</td>
              <td className="px-3 py-2">{c.serves}</td>
              <td className="px-3 py-2 whitespace-nowrap">{c.device}</td>
              <td className="px-3 py-2 whitespace-nowrap tabular-nums">{c.cable_mm2 ?? c.cable} mm²</td>
              <td className="text-muted-foreground px-3 py-2 whitespace-nowrap tabular-nums">{load(c)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
