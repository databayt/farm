// Ported from hogwarts src/mdx-components.tsx: the shadcn docs typography only.
// The hogwarts showcase atoms are left out; add MDX components here as the study needs them.
import type * as React from "react"
import type { MDXComponents } from "mdx/types"

import { cn } from "@/lib/utils"
import { Callout } from "@/components/docs/callout"
import { Figure } from "@/components/docs/figure"
import { StudioViewer } from "@/components/docs/studio-viewer"
import {
  StudioBom, StudioCircuits, StudioDownloads, StudioElectricPoints, StudioFeatures, StudioFittings, StudioPipes,
  StudioShared, StudioStatus, StudioSteps,
} from "@/components/studio/docs-sections"
import { BarElectricPoints, BarPlumbingPoints, BarStatus } from "@/components/bar/docs-sections"
import { FarmingBom, FarmingCalendar, FarmingPlate, FarmingStatus, FarmingWaterPoints } from "@/components/farming/docs-sections"
import { GalleyElectricPoints, GalleyPlumbingPoints, GalleyStatus } from "@/components/galley/docs-sections"
import { GuestRoomElectricPoints, GuestRoomStatus } from "@/components/guest-room/docs-sections"
import { LivestockStatus, LivestockWaterNeed, LivestockWaterPoints } from "@/components/livestock/docs-sections"
import { OfficeElectricPoints, OfficeNetworkPoints, OfficeStatus } from "@/components/office/docs-sections"
import { ParkingDrainagePoints, ParkingLightingPoints, ParkingStatus } from "@/components/parking/docs-sections"
import { PublicBathroomElectricPoints, PublicBathroomPlumbingPoints, PublicBathroomStatus } from "@/components/public-bathroom/docs-sections"
import { StudyRoomElectricPoints, StudyRoomStatus } from "@/components/study-room/docs-sections"
import { VolleyballNetPoints, VolleyballStatus } from "@/components/volleyball/docs-sections"
import { localeHref } from "@/components/internationalization/href"
import { getLocale } from "@/components/internationalization/locale"

// Links in the docs take the reader's language (D-058): /docs/… and the site's pages become /en/… or /rw/…, so a
// Kinyarwanda reader stays in Kinyarwanda, even on a page shown in English. A link that names its language
// (hrefLang: a guide's link to its own translation, written by scripts/sync-docs.mjs) is left as written.
async function DocsLink({ className, href, hrefLang, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const lang = await getLocale()
  return (
    <a
      className={cn("font-medium underline underline-offset-4", className)}
      href={href && !hrefLang ? localeHref(lang, href) : href}
      hrefLang={hrefLang}
      // generated design files download instead of opening as text
      download={/^\/designs\/.+\.(dxf|zip|pdf|xlsx|csv|glb|json)$/.test(href ?? "") ? true : undefined}
      {...props}
    />
  )
}

const mdxComponents = {
  // Allows customizing built-in components, e.g. to add styling.
  h1: ({ className, ...props }) => (
    <h1
      className={cn(
        "font-heading mt-2 scroll-m-28 text-3xl font-bold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  h2: ({ className, ...props }) => {
    // fumadocs sets the id, so the table of contents and anchors stay in step.
    return (
      <h2
        className={cn(
          "font-heading [&+]*:[code]:text-xl mt-10 scroll-m-28 text-xl font-medium tracking-tight first:mt-0 lg:mt-12 [&+.steps]:!mt-0 [&+.steps>h3]:!mt-4 [&+h3]:!mt-6 [&+p]:!mt-4",
          className
        )}
        {...props}
      />
    )
  },
  h3: ({ className, ...props }) => (
    <h3
      className={cn(
        "font-heading mt-12 scroll-m-28 text-lg font-medium tracking-tight [&+p]:!mt-4 *:[code]:text-xl",
        className
      )}
      {...props}
    />
  ),
  h4: ({ className, ...props }) => (
    <h4
      className={cn(
        "font-heading mt-8 scroll-m-28 text-base font-medium tracking-tight",
        className
      )}
      {...props}
    />
  ),
  h5: ({ className, ...props }) => (
    <h5
      className={cn(
        "mt-8 scroll-m-28 text-base font-medium tracking-tight",
        className
      )}
      {...props}
    />
  ),
  h6: ({ className, ...props }) => (
    <h6
      className={cn(
        "mt-8 scroll-m-28 text-base font-medium tracking-tight",
        className
      )}
      {...props}
    />
  ),
  a: DocsLink,
  p: ({ className, ...props }) => (
    <p
      className={cn("leading-relaxed [&:not(:first-child)]:mt-6", className)}
      {...props}
    />
  ),
  strong: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <strong className={cn("font-medium", className)} {...props} />
  ),
  ul: ({ className, ...props }) => (
    <ul className={cn("my-6 ms-6 list-disc", className)} {...props} />
  ),
  ol: ({ className, ...props }) => (
    <ol className={cn("my-6 ms-6 list-decimal", className)} {...props} />
  ),
  li: ({ className, ...props }) => (
    <li className={cn("mt-2", className)} {...props} />
  ),
  blockquote: ({ className, ...props }) => (
    <blockquote
      className={cn("mt-6 border-s-2 ps-6 italic", className)}
      {...props}
    />
  ),
  img: ({ className, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img className={cn("rounded-md", className)} alt={alt ?? ""} loading="lazy" decoding="async" {...props} />
  ),
  hr: ({ ...props }) => <hr className="my-4 md:my-8" {...props} />,
  table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 w-full overflow-x-auto rounded-lg border">
      <table
        className={cn(
          "relative w-full overflow-hidden border-none text-sm [&_tbody_tr:last-child]:border-b-0",
          className
        )}
        {...props}
      />
    </div>
  ),
  tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr className={cn("m-0 border-b", className)} {...props} />
  ),
  th: ({ className, ...props }) => (
    <th
      className={cn(
        "px-4 py-2 text-start font-bold [&[align=center]]:text-center [&[align=right]]:text-right rtl:[&[align=right]]:text-left",
        className
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }) => (
    <td
      className={cn(
        "px-4 py-2 text-start align-top [&[align=center]]:text-center [&[align=right]]:text-right rtl:[&[align=right]]:text-left",
        className
      )}
      {...props}
    />
  ),
  pre: ({ className, children, ...props }: React.ComponentProps<"pre">) => {
    return (
      <pre
        className={cn(
          "no-scrollbar min-w-0 overflow-x-auto px-4 py-3.5 outline-none has-[[data-highlighted-line]]:px-0 has-[[data-line-numbers]]:px-0 has-[[data-slot=tabs]]:p-0",
          className
        )}
        {...props}
      >
        {children}
      </pre>
    )
  },
  code: ({ className, ...props }: React.ComponentProps<"code">) => {
    // Inline code; fenced blocks are highlighted by fumadocs at build time.
    if (typeof props.children === "string") {
      return (
        <code
          className={cn(
            "bg-muted relative rounded-md px-[0.3rem] py-[0.2rem] font-mono text-[0.8rem] break-words outline-none",
            className
          )}
          {...props}
        />
      )
    }
    return <code className={className} {...props} />
  },
  Callout,
  Figure,
  StudioViewer,
  // the studio's reference sections (scripts/sync-docs.mjs "sections" pages)
  StudioBom, StudioShared, StudioCircuits, StudioElectricPoints, StudioPipes, StudioFittings,
  StudioFeatures, StudioSteps, StudioDownloads, StudioStatus,
  // every other place's (the "---The places---" pages), in the site menu's order
  GuestRoomElectricPoints, GuestRoomStatus,
  OfficeElectricPoints, OfficeNetworkPoints, OfficeStatus,
  StudyRoomElectricPoints, StudyRoomStatus,
  GalleyElectricPoints, GalleyPlumbingPoints, GalleyStatus,
  PublicBathroomElectricPoints, PublicBathroomPlumbingPoints, PublicBathroomStatus,
  VolleyballNetPoints, VolleyballStatus,
  ParkingLightingPoints, ParkingDrainagePoints, ParkingStatus,
  BarElectricPoints, BarPlumbingPoints, BarStatus,
  FarmingWaterPoints, FarmingPlate, FarmingCalendar, FarmingBom, FarmingStatus,
  LivestockWaterPoints, LivestockWaterNeed, LivestockStatus,
} satisfies MDXComponents

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { ...mdxComponents, ...components }
}

export { mdxComponents }
