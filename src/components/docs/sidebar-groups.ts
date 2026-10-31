import type { Root } from "fumadocs-core/page-tree"

import type { Dictionary } from "@/components/internationalization/dictionaries"

export type SidebarItem = { url: string; name: string }
// `place`: a place's folder (D-059), named in the reader's language, its pages by kind (Execution plan, Materials,
// Electric …); otherwise a "---Label---" group from meta.json, or the ungrouped pages at the top.
export type SidebarGroup = { id: string; label?: string; place?: string; items: SidebarItem[] }

// The sidebar from the docs tree of the reader's language. Names come from the dictionaries rather than the pages'
// titles, so /rw is Kinyarwanda throughout, even where a page itself is still English.
export function sidebarGroups(tree: Root, t: Dictionary): SidebarGroup[] {
  const kinds = t.docs.kinds as Record<string, string>
  const places = t.places as Record<string, string>
  const groups: SidebarGroup[] = [{ id: "start", items: [] }]
  for (const node of tree.children) {
    if (node.type === "separator") {
      groups.push({ id: `s:${String(node.name ?? "")}`, label: String(node.name ?? ""), items: [] })
    } else if (node.type === "page") {
      if (groups.at(-1)?.place) groups.push({ id: `after:${node.url}`, items: [] })
      groups.at(-1)?.items.push({ url: node.url, name: node.url.split("/").length === 3 ? t.docs.start : String(node.name) })
    } else if (node.type === "folder" && node.index) {
      // /<lang>/docs/<place>[/<kind>]: the folder's index is the place's execution plan
      const place = node.index.url.split("/")[3]
      const pages = [node.index, ...node.children.filter((c) => c.type === "page")]
      groups.push({
        id: `p:${place}`, place, label: places[place] ?? String(node.name),
        items: pages.map((p) => ({ url: p.url, name: kinds[p.url.split("/")[4] ?? "plan"] ?? String(p.name) })),
      })
    }
  }
  return groups.filter((g) => g.items.length > 0)
}
