import type { Metadata } from "next"
import { LocaleLink as Link } from "@/components/internationalization/locale-link"

import { DocsSection, DrawingSection, ModelSection, PageHero, RailSection, ServiceSection } from "@/components/page/sections"
import { BuildUp } from "@/components/docs/build-up"
import { kitRail, netRail } from "@/components/volleyball/rails"
import { TaggedFigure } from "@/components/docs/tagged-figure"
import { TennisPlan } from "@/components/tennis/tennis-plan"
import { CourtSwitch } from "@/components/volleyball/court-switch"
import { D, m, netPoints } from "@/components/volleyball/data"
import { CourtDrainageDiagram } from "@/components/volleyball/drainage-diagram"
import { NetDiagram } from "@/components/volleyball/net-diagram"
import { VolleyballPlan } from "@/components/volleyball/volleyball-plan"
import volleyball from "@/components/volleyball/volleyball.json"
import { words } from "@/components/volleyball/words"
import { dictionary } from "@/components/internationalization/dictionaries"
import { hasLocale, i18n } from "@/components/internationalization/config"
import { getLocale } from "@/components/internationalization/locale"
import netTags from "../../../../../public/designs/volleyball/render/net-tags.json"
import topPieces from "../../../../../public/designs/volleyball/render/top-pieces.json"

// The volleyball court, in /en/studio's pattern: the hero, the 2D and the 3D, the court's build-up, the kit, Net and
// posts and Drainage, then the docs cards; the net's points and the drainage are on its docs pages (/docs/volleyball). Both
// drawings read src/components/volleyball/volleyball.json: the master plan's court on the lawn, 18 x 9 m inside a 3 m free zone to
// the FIVB Official Volleyball Rules, on the lawn's own grass mown short, the net on padded posts, and beyond the far
// free zone two benches under thatched umbrellas and a ball store. Everything past the rules is an assumption.

export async function generateMetadata({ params }: PageProps<"/[lang]/volleyball">): Promise<Metadata> {
  const { lang } = await params
  return words[hasLocale(lang) ? lang : i18n.defaultLocale].meta
}

const { court: K, net: N, posts: P, surface: SF, build: BU } = volleyball
const FL = K.l + 2 * K.free, FW = K.w + 2 * K.free // the playing area, court and free zone

export default async function VolleyballPage() {
  const lang = await getLocale()
  const w = words[lang], t = dictionary(lang).page
  const settle = w.json.settle ?? BU.settle
  const link = (href: string, text: string) => <Link href={href} className="underline underline-offset-4">{text}</Link>
  return (
    <main className="w-full flex-1">
      {/* First screen: the founder's Nano Banana render of the court (2026-10-30), made from the brief in
          ~/Desktop/volleyball-nano-banana; master kept at assets/volleyball/hero-gemini.png (1672 x 941), upscaled to
          2400 x 1340. The net sits right, so the words keep the open grass bottom-left. */}
      <PageHero src={`${D}/render/volleyball-hero.jpg`} width={2400} height={1340} className="bg-[#c9a46a]" imgClassName="object-[60%_55%]"
        title={w.hero.title}
        alt={w.hero.alt} />

      {/* 2D, full screen, with a switch between the two games the lawn can take: the volleyball court
          (src/components/volleyball/volleyball-plan.tsx) and a tennis court on the same net line
          (src/components/tennis/tennis-plan.tsx), each with a point at the serve drawn over it, in the text colour. */}
      <DrawingSection id="plans" title={t.plan}>
        <CourtSwitch courts={[
          { id: "volleyball", label: "Volleyball", plan: (
            <VolleyballPlan className="h-auto w-full lg:h-full lg:w-auto" />
          ) },
          { id: "tennis", label: "Tennis", plan: (
            <TennisPlan title="Plan: a tennis court 23.77 by 10.97 m on the same lawn and net line, with a run-back of 5.49 m behind each baseline and a run-off of 3.05 m beside each side line, 34.75 by 17.07 m in all, the volleyball's 24 by 15 m dashed inside it; singles and doubles side lines, the service lines 6.40 m from the net, four service boxes and a centre mark on each baseline; the net 914 mm at the centre and 1,070 mm at the posts, with singles sticks. Over it a singles point: the server right of the centre mark serving across to the deuce court, the receiver behind the far baseline."
              className="h-auto w-full lg:h-full lg:w-auto" />
          ) },
        ]} />
      </DrawingSection>

      {/* 3D, in the 2D section's pattern: a line drawing of the court seen from the open lawn, then the same view
          rendered. Both from scripts/site/render/volleyball.html. */}
      <ModelSection line={`${D}/render/volleyball-line.png`} real={`${D}/render/volleyball-real.webp`} width={2400} height={1100}
        lineAlt={w.model.lineAlt}
        realAlt={w.model.realAlt} />

      {/* Court, pinned while it builds up in fast motion, seen from above with the benches' side at the top: the lawn as
          it is, levelled with its footings, grassed and mown, lined, then the net. Renders: volleyball.html?top=<layer>. */}
      <section id="build">
        <BuildUp title={w.build.title} base={`${D}/render/top-ground.webp`} aspect={topPieces.aspect}
          baseAlt={w.build.baseAlt}
          builds={[
            { secs: 3, label: w.build.builds[0], groups: [
              { src: `${D}/render/top-level.webp`, rects: topPieces.level, kind: "wipe", from: 0, to: 0.55 },
              { src: `${D}/render/top-footings.webp`, rects: topPieces.footings, kind: "drop", from: 0.65, to: 0.8, rise: 30 },
            ] },
            { secs: 2, label: w.build.builds[1], groups: [
              { src: `${D}/render/top-grass.webp`, rects: topPieces.grass, kind: "wipe", from: 0, to: 0.85 },
            ] },
            { secs: 2, label: w.build.builds[2], groups: [
              { src: `${D}/render/top-lines.webp`, rects: topPieces.lines, kind: "wipe", from: 0, to: 0.85 },
            ] },
            { secs: 1.4, label: w.build.builds[3], groups: [
              { src: `${D}/render/top-net.webp`, rects: topPieces.net, kind: "drop", from: 0, to: 0, rise: 40 },
            ] },
          ]}
          stages={[
            { title: w.build.stages.lawn.title, text: w.build.stages.lawn.text(FL, FW, K.clear) },
            { title: w.build.stages.level.title, text: w.build.stages.level.text(m(BU.topdress), SF.fall * 1000, m(P.footing.w), m(P.footing.depth)) },
            { title: w.build.stages.grass.title, text: w.build.stages.grass.text(settle) },
            { title: w.build.stages.lines.title, text: w.build.stages.lines.text(m(SF.tape), K.l, K.w, BU.pegs.every, K.attack) },
            { title: w.build.stages.net.title, text: w.build.stages.net.text(m(N.men), m(N.women)) },
          ]} />
      </section>

      {/* Kit: what the court needs beside the net, each on its own; the card in focus shows its size, source and cost. */}
      <RailSection id="kit" title={w.kit} items={kitRail(lang)} />

      {/* Net and posts, in the studio's service pattern: the net system drawn full width along the net line with the
          ground cut open under the posts, then the net close up as the 3D sees it with the footings drawn through the
          grass in orange and every point tagged (render/net-line.png, net-tags.json), the same view rendered
          (render/net-real.webp), then each part on its own. All from volleyball.html?view=net and ?item=. */}
      <ServiceSection id="net" title={w.net.title}
        diagram={<NetDiagram net={N} posts={P} courtW={K.w} lang={lang} />}
        figure={<TaggedFigure table="/docs/volleyball/net" src={`${D}/render/net-line.png`} aspect={netTags.aspect} tags={netTags.tags}
          alt={w.net.figureAlt}
          info={Object.fromEntries(netPoints(lang).map((p) => [p.id, { label: p.what, colour: p.colour }]))} />}
        note={w.net.note(link)}
        real={{ src: `${D}/render/net-real.webp`, width: 2400, height: 1100, caption: t.rendered,
          alt: w.net.realAlt }}
        rail={netRail(lang)} />

      {/* Drainage: the court is a lawn and needs no drain of its own, so this service is its diagram alone: the
          levelled plane's fall along and across the playing area (volleyball.json drainage). No lights: play stops at
          sunset (volleyball.json lighting). */}
      <ServiceSection id="drainage" title={w.drainage}
        diagram={<CourtDrainageDiagram length={FL} width={FW} fall={SF.fall} lang={lang} />} />

      <DocsSection cards={w.docs} />
    </main>
  )
}
