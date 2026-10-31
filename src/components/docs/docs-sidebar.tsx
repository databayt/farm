"use client"

// Ported from hogwarts src/components/docs/docs-sidebar.tsx. The farm has no audiences, so the role grouping is
// gone: the groups are the places (D-059), built on the server in the reader's language (sidebar-groups.ts), and
// any "---Label---" group meta.json still lists, as in the shadcn docs sidebar.
import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown } from "lucide-react"

import type { SidebarGroup as Group, SidebarItem as Item } from "@/components/docs/sidebar-groups"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// v2: the place groups (D-059) replaced the groups by kind, whose remembered choices no longer apply
const STORAGE_KEY = "docs-sidebar-open-v2"

// Remembered open/closed choices live in localStorage, read through
// useSyncExternalStore so server and client agree (the server sees none).
const listeners = new Set<() => void>()
let cache: { raw: string | null; value: Record<string, boolean> } = { raw: null, value: {} }

function readStored(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw !== cache.raw) cache = { raw, value: raw ? JSON.parse(raw) : {} }
  } catch {}
  return cache.value
}

function writeStored(next: Record<string, boolean>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {}
  listeners.forEach((notify) => notify())
}

function subscribe(notify: () => void) {
  listeners.add(notify)
  return () => listeners.delete(notify)
}

const NONE: Record<string, boolean> = {}

export function DocsSidebar({
  groups,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  groups: Group[]
}) {
  const pathname = usePathname()
  const isActive = (url: string) => pathname === url

  const stored = React.useSyncExternalStore(subscribe, readStored, () => NONE)
  const setOpen = (id: string, open: boolean) => writeStored({ ...readStored(), [id]: open })
  // The group of the page being read is always open.
  const activeId = groups.find((g) => g.items.some((i) => isActive(i.url)))?.id
  // The places start closed, so the sidebar reads as their list, and open the one being read; any other group
  // starts open. The server renders the same defaults (stored is empty there), so there is no hydration mismatch.
  const isOpen = (group: Group) => group.id === activeId || (stored[group.id] ?? !group.place)

  const menu = (items: Item[]) => (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.url}>
          <SidebarMenuButton
            asChild
            isActive={isActive(item.url)}
            className="data-[active=true]:border-accent data-[active=true]:bg-accent relative h-auto min-h-[30px] border border-transparent py-1 text-[0.8rem] leading-snug font-medium"
          >
            <Link href={item.url}>{item.name}</Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )

  return (
    <Sidebar
      className="sticky top-[calc(var(--header-height)+2rem)] z-30 hidden h-[calc(100svh-var(--header-height)-4rem)] overscroll-none bg-transparent lg:flex"
      collapsible="none"
      {...props}
    >
      <SidebarContent className="overflow-x-hidden overflow-y-auto">
        <div className="ps-0 pt-2 pb-4">
          {groups.map((group) =>
            group.label ? (
              <Collapsible
                key={group.id}
                // The visitor's last choice wins; groups start open, the archive closed.
                open={isOpen(group)}
                onOpenChange={(open) => setOpen(group.id, open)}
                className="group/collapsible"
              >
                <SidebarGroup className="p-0">
                  <SidebarGroupLabel
                    asChild
                    className="text-muted-foreground hover:text-foreground font-medium"
                  >
                    <CollapsibleTrigger className="w-full justify-between">
                      {group.label}
                      <ChevronDown className="transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </CollapsibleTrigger>
                  </SidebarGroupLabel>
                  <CollapsibleContent>
                    <SidebarGroupContent>{menu(group.items)}</SidebarGroupContent>
                  </CollapsibleContent>
                </SidebarGroup>
              </Collapsible>
            ) : (
              <SidebarGroup key={group.id} className="p-0">
                <SidebarGroupContent>{menu(group.items)}</SidebarGroupContent>
              </SidebarGroup>
            )
          )}
        </div>
      </SidebarContent>
    </Sidebar>
  )
}
