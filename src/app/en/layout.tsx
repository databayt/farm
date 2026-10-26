import { SiteHeader } from "@/components/site-header"

// /en/* (the container-studio showcase) keeps the study header that used to live in the root layout.
export default function EnLayout({ children }: LayoutProps<"/en">) {
  return (
    <>
      <SiteHeader />
      {children}
    </>
  )
}
