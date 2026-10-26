// The bed (kit K4) piece by piece: the stock to buy, one cutting diagram per sheet, every piece with its
// size and its path from sheet to finished part, then the assembly. Everything comes from
// render/bed/parts.json (scripts/studio/render/bed_parts.py), which nests the bed's parts on their own sheets.
import bed from "../../../public/designs/studio/render/bed/parts.json"

const D = "/designs/studio/render/bed"
const mm = (n: number) => Math.round(n).toLocaleString("en-US")
const rwf = (n: number) => `RWF ${Math.round(n).toLocaleString("en-US")}`
const MAT: Record<string, string> = { PLY18: "18 mm board", PLY12: "12 mm plywood" }

type Part = (typeof bed.parts)[number]

// what each piece does, in the order the generator lists them
const ROLE: Record<string, string> = {
  "Headboard (full height, on the back wall)": "Stands on the floor, screwed to the back wall. The USB-C socket sits in its opening.",
  "Rail, end-A side": "The long side against end wall A.",
  "Rail, room side (top)": "The room-side top rail, over the storage boxes.",
  "Rail, room side (plinth)": "The kick rail at the floor, under the storage boxes.",
  "Rail, head": "The short end at the headboard.",
  "Rail, foot": "The short end at the foot. It shows, so its top edge is banded.",
  Spine: "Runs head to foot down the middle and carries the slats at mid-span.",
  "Slat ledger, end-A side": "Glued and screwed inside the long side; the slats rest on it.",
  "Slat ledger, room side": "The same on the room side, above the storage boxes.",
  "Deck slat": "Laid across the bed, side to side, with a fine even gap for air.",
  "Side panel, head end": "Closes the room side between the headboard and the first box.",
  "Drawer divider": "Stands between the two box bays.",
  "Storage box front": "The face you see, banded all round.",
  "Storage box side": "Glued and screwed to the front.",
  "Storage box back": "Closes the tray at the back.",
  "Storage box bottom": "Glued and screwed into the tray; four castors under it.",
}

function groups() {
  const out = new Map<string, Part[]>()
  for (const p of bed.parts) out.set(p.type, [...(out.get(p.type) ?? []), p])
  return [...out.values()]
}

// sheet -> piece, in the words of the workshop
function steps(ps: Part[]) {
  const p = ps[0]
  const sheets = [...new Set(ps.map((q) => q.sheet.index))].sort((a, b) => a - b)
  const of = p.sheet.of
  const out = [
    `Cut: from ${MAT[p.material]} sheet${sheets.length > 1 ? "s" : ""} ${sheets.join(", ")} of ${of}, rip a ${mm(p.sheet.w)} mm strip and crosscut it at ${mm(p.sheet.l)} mm${ps.length > 1 ? `, ${ps.length} times` : ""}.`,
    p.edgeM ? `Edge: band ${p.edges} with 1 mm ABS (${(p.edgeM * ps.length).toFixed(1)} m${ps.length > 1 ? " for all" : ""}).` : "Edge: none; the edges are hidden.",
  ]
  const bolts = p.holes.filter((h) => h.joint === "bolt").length
  if (bolts) out.push(`Drill: ${bolts === 1 ? "1 hole" : `${bolts} holes`} of Ø${p.holes[0].dia} mm right through, for the connector bolts.`)
  for (const c of p.cutouts) out.push(`Drill: cut a ${c.w} × ${c.h} mm opening for the ${c.joint === "usb" ? "USB-C socket" : "fitting"}.`)
  out.push(p.material === "PLY12" ? "Finish: sand, one coat of clear varnish." : "Finish: sand to 120, stain medium oak, two coats of satin varnish.")
  return out
}

export function BedPieces() {
  const g = groups()
  const slats = bed.parts.filter((p) => p.type === "Deck slat")
  const zs = slats.map((p) => p.box[1]).sort((a, b) => a - b)
  const pitch = zs[1] - zs[0], gap = pitch - slats[0].size[1]
  const sheets18 = bed.sheets.filter((s) => s.material === "PLY18").length
  const sheets12 = bed.sheets.filter((s) => s.material === "PLY12").length
  const edge = bed.parts.reduce((n, p) => n + p.edgeM, 0)
  const buy = [
    { item: "18 mm plywood or MR board, 2440 × 1220", qty: `${sheets18} sheets`, where: "Gisozi (Agakiriro) timber traders", cost: sheets18 * bed.prices.PLY18 },
    { item: "12 mm plywood, 2440 × 1220", qty: `${sheets12} sheet`, where: "Gisozi (Agakiriro) timber traders", cost: sheets12 * bed.prices.PLY12 },
    { item: "ABS edge band, 1 mm, oak", qty: `${Math.ceil(edge)} m`, where: "the cutting workshop", cost: Math.ceil(edge) * bed.prices.edgeband },
    ...bed.hardware.map((h) => ({ item: h.item, qty: `${h.qty}`, where: "Quincaillerie Bricotech, KN 84 St", cost: h.qty * h.price })),
    { item: "Wood glue, medium-oak stain, satin varnish", qty: "1 set", where: "Ameki Color, Gikondo", cost: 0 },
  ]
  const total = buy.reduce((n, b) => n + b.cost, 0)

  return (
    <div className="px-4 md:px-10">
      <h2 className="text-3xl font-semibold tracking-tight">The bed, piece by piece</h2>
      <p className="text-muted-foreground mt-3 max-w-3xl text-lg text-balance">
        {bed.parts.length} pieces from {sheets18} sheets of 18 mm board and {sheets12} of 12 mm plywood: cut, banded and drilled
        in a Gisozi workshop, then bolted together on site by two people. The top is {slats.length} wooden slats laid across
        the bed, {gap.toFixed(1)} mm apart.
      </p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${D}/exploded.webp`} loading="lazy" className="mx-auto mt-6 h-auto w-full max-w-5xl"
        alt="The bed pulled apart: the headboard at the back, the long and short rails, the spine and two ledgers, the slats lifted above, and the two storage boxes rolled out on their castors." />

      <h3 className="mt-12 text-xl font-semibold tracking-tight">1 · Buy the stock</h3>
      <div className="mt-4 overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="text-muted-foreground bg-muted/40">
            <tr>
              <th className="px-3 py-2 text-start font-medium">Item</th>
              <th className="px-3 py-2 text-end font-medium">Qty</th>
              <th className="hidden px-3 py-2 text-start font-medium sm:table-cell">Where</th>
              <th className="px-3 py-2 text-end font-medium whitespace-nowrap">Estimate</th>
            </tr>
          </thead>
          <tbody>
            {buy.map((b) => (
              <tr key={b.item} className="border-t">
                <td className="px-3 py-2">
                  {b.item}
                  <span className="text-muted-foreground block text-xs sm:hidden">{b.where}</span>
                </td>
                <td className="px-3 py-2 text-end whitespace-nowrap tabular-nums">{b.qty}</td>
                <td className="text-muted-foreground hidden px-3 py-2 sm:table-cell">{b.where}</td>
                <td className="px-3 py-2 text-end whitespace-nowrap tabular-nums">{b.cost ? rwf(b.cost) : "—"}</td>
              </tr>
            ))}
            <tr className="border-t-2">
              <th colSpan={2} className="px-3 py-3 text-start font-semibold">Stock for one bed</th>
              <td className="hidden sm:table-cell" />
              <td className="px-3 py-3 text-end font-semibold whitespace-nowrap tabular-nums">{rwf(total)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-muted-foreground mt-2 text-sm">
        Estimates are placeholders until three quotes per line come back. Built with the whole studio, the bed shares
        sheets with the other kits and uses less.
      </p>

      <h3 className="mt-12 text-xl font-semibold tracking-tight">2 · Cut the sheets</h3>
      <p className="text-muted-foreground mt-2 max-w-3xl">
        Every layout is rip-then-crosscut, so a panel saw does it: rip each strip along the sheet, then crosscut the pieces
        out of it. {bed.trim} mm trimmed off each edge, {bed.kerf} mm per saw cut. Circles are the drill holes.
      </p>
      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {bed.sheets.map((s) => (
          <figure key={s.file}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${D}/${s.file}`} loading="lazy" className="h-auto w-full dark:invert"
              alt={`Cutting diagram, ${MAT[s.material]} sheet ${s.index}: ${s.parts.join(", ")}`} />
            <figcaption className="text-muted-foreground mt-1 text-sm">
              {MAT[s.material]} · sheet {s.index} of {bed.sheets.filter((x) => x.material === s.material).length} · {s.utilisation}% used
            </figcaption>
          </figure>
        ))}
      </div>

      <h3 className="mt-12 text-xl font-semibold tracking-tight">3 · Make every piece</h3>
      <p className="text-muted-foreground mt-2 max-w-3xl">Sizes are length × width × thickness, in millimetres.</p>
      <div className="mt-4 grid gap-px overflow-hidden rounded-xl border bg-border md:grid-cols-2 xl:grid-cols-3">
        {g.map((ps) => {
          const p = ps[0]
          return (
            <article key={p.type} className="bg-background flex flex-col p-5">
              <div className="bg-muted/60 relative aspect-[4/3] rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${D}/${p.id}.webp`} alt={p.type} loading="lazy" className="absolute inset-0 size-full object-contain p-6" />
              </div>
              <div className="mt-4 flex items-baseline justify-between gap-4">
                <h4 className="font-medium">{p.type.replace(" (full height, on the back wall)", "")}{ps.length > 1 ? ` × ${ps.length}` : ""}</h4>
                <span className="text-muted-foreground shrink-0 text-xs">
                  {ps.length > 1 ? `${p.id}…${ps[ps.length - 1].id}` : p.id}
                </span>
              </div>
              <p className="mt-1 text-sm font-medium tabular-nums">
                {p.size.map(mm).join(" × ")} · {MAT[p.material]}
              </p>
              <p className="text-muted-foreground mt-1 text-sm">{ROLE[p.type]}</p>
              <ul className="text-muted-foreground mt-3 space-y-1 text-sm">
                {steps(ps).map((s) => {
                  const [k, ...rest] = s.split(": ")
                  return <li key={s}><span className="text-foreground font-medium">{k}</span> · {rest.join(": ")}</li>
                })}
              </ul>
            </article>
          )
        })}
        {/* fill the last row so no grey cell shows */}
        {Array.from({ length: (2 - (g.length % 2)) % 2 }, (_, i) => <div key={`m${i}`} className="bg-background hidden md:block xl:hidden" />)}
        {Array.from({ length: (3 - (g.length % 3)) % 3 }, (_, i) => <div key={`x${i}`} className="bg-background hidden xl:block" />)}
      </div>

      <h3 className="mt-12 text-xl font-semibold tracking-tight">4 · Assemble</h3>
      <ol className="mt-4 max-w-3xl list-decimal space-y-2 ps-5">
        <li>In the workshop, dry-fit the frame once, label every piece with its number, and flat-pack it.</li>
        <li>On site, stand the headboard against the back wall and screw it to the wall.</li>
        <li>Bolt the head rail, the end-A rail, the foot rail and the two room-side rails together with the
          connector bolts, two at each joint.</li>
        <li>Set the spine down the middle, head rail to foot rail; fit the drawer divider and the head-end side panel.</li>
        <li>Glue and screw the two ledgers inside the long sides, their tops 18 mm below the top of the frame.</li>
        <li>Mark the slat lines on the ledgers every {pitch.toFixed(1)} mm from the head. Lay the {slats.length} slats
          across and screw each one: two screws at each ledger, two into the spine.</li>
        <li>Glue and screw each storage box: sides, back and bottom into the front. Four castors under each; roll them in.</li>
        <li>Mattress on the slats, then the bedding.</li>
      </ol>
    </div>
  )
}
