import { LoadingWrapper } from "@/components/loading"
import { SiteHeader } from "@/components/site-header"

// /en/* (the farm's pages) share the site header. Every page opens on a full-screen hero, so the header sits on
// the picture until the reader scrolls (components/site-header.tsx, overlay).
export default function EnLayout({ children }: LayoutProps<"/en">) {
  return (
    <>
      <SiteHeader overlay />
      <LoadingWrapper>{children}</LoadingWrapper>
    </>
  )
}
