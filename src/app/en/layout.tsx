import { Header } from "@/components/home/header"
import { LoadingWrapper } from "@/components/loading"

// /en/* (the farm's pages) share the homepage's header: one two-line hamburger opening the full-screen menu. Every
// page opens on a full-screen hero (components/page/sections.tsx) whose sentinel gives the button its disc once
// the hero has scrolled away.
export default function EnLayout({ children }: LayoutProps<"/en">) {
  return (
    <>
      <Header title="Digital Farm" menu={{ open: "Open the menu", close: "Close the menu" }} />
      <LoadingWrapper>{children}</LoadingWrapper>
    </>
  )
}
