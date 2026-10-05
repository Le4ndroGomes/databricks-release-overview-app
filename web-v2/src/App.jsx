import { DomainOverview } from './components/DomainOverview.jsx'
import { Hero } from './components/Hero.jsx'
import { Actions, CustomerImpact } from './components/Impact.jsx'
import { Landscape } from './components/Landscape.jsx'
import { MajorReleases } from './components/MajorReleases.jsx'
import { Models } from './components/Models.jsx'
import { Nav } from './components/Nav.jsx'
import { Footer, ReleaseIndex } from './components/ReleaseIndex.jsx'

// Ordem editorial: Abertura · 01 Destaques · 02 Impacto · 03 Ações · 04 Panorama ·
// 05 Domínios · 06 Modelos · 07 Índice · Rodapé. Ids das seções vêm de content.js (sections).
export default function App() {
  return (
    <>
      <a href="#destaques" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-[8px] focus:bg-ink focus:px-3 focus:py-2 focus:text-white focus:text-[13px] focus:w-[calc(100vw-2rem)] focus:overflow-hidden focus:text-ellipsis focus:whitespace-nowrap">
        Ir para conteúdo
      </a>
      <Nav />
      <main className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-12">
        <Hero />
        <MajorReleases />
        <CustomerImpact />
        <Actions />
        <Landscape />
        <DomainOverview />
        <Models />
        <ReleaseIndex />
        <Footer />
      </main>
    </>
  )
}
