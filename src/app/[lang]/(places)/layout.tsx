import { Header } from "@/components/home/header"
import { getLocale } from "@/components/internationalization/locale"
import { LoadingWrapper } from "@/components/loading"
import { getNav } from "@/components/site/nav"

// The farm's pages (/[lang]/studio, /[lang]/galley …) share the homepage's header: one two-line hamburger opening
// the full-screen menu. Every page opens on a full-screen hero (components/page/sections.tsx) whose sentinel gives
// the button its disc once the hero has scrolled away.
export default async function PlacesLayout({ children }: LayoutProps<"/[lang]">) {
  const nav = await getNav(await getLocale())
  return (
    <>
      <Header nav={nav} />
      <LoadingWrapper>{children}</LoadingWrapper>
    </>
  )
}
