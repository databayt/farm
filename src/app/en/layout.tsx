import { ScrollHeader } from "@/components/scroll-header"
import { SiteHeader } from "@/components/site-header"

// /en/* (the container-studio showcase) keeps the study header, but the full-screen hero owns the
// first screen: the header only slides in when the reader scrolls up.
export default function EnLayout({ children }: LayoutProps<"/en">) {
  return (
    <>
      <ScrollHeader>
        <SiteHeader />
      </ScrollHeader>
      {children}
    </>
  )
}
