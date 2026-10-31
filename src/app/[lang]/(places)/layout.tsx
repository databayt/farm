import { Header } from "@/components/home/header"
import { getLocale } from "@/components/internationalization/locale"
import { LoadingWrapper } from "@/components/loading"
import { getNav } from "@/components/site/nav"

// The farm's pages (/[lang]/studio, /[lang]/galley …) share the homepage's header: one two-line hamburger opening
// the full-screen menu. Every page opens on a full-screen hero (components/page/sections.tsx) whose sentinel gives
// the button its disc once the hero has scrolled away. The pages' own words are English until their Kinyarwanda is
// written, so under /rw they are marked lang="en" (the header and the hero's notice speak Kinyarwanda).
export default async function PlacesLayout({ children }: LayoutProps<"/[lang]">) {
  const lang = await getLocale()
  const nav = await getNav(lang)
  return (
    <>
      <Header nav={nav} />
      <LoadingWrapper>
        <div lang={lang === "en" ? undefined : "en"} className="contents">
          {children}
        </div>
      </LoadingWrapper>
    </>
  )
}
