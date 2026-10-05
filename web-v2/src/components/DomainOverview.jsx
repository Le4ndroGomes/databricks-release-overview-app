import { domainHighlights, domains, findItem, items, sectionIndex, stageLabel, stageOrder } from '../content.js'
import { SectionHeader, StageChip, SWATCH } from './primitives.jsx'

const counts = Object.fromEntries(domains.map((d) => [d.id, items.filter((i) => i.domain === d.id)]))
const ranked = [...domains].sort((a, b) => counts[b.id].length - counts[a.id].length)
const max = Math.max(...domains.map((d) => counts[d.id].length))

// Barra de maturidade: segmentos de 6 px sobre um trilho de 1 px que representa o maior domínio (20).
// O comprimento lê volume; a composição lê maturidade (GA → Public Preview → Beta → Não informado → Sem estágio).
function MaturityLine({ list }) {
  const parts = stageOrder.map((s) => [s, list.filter((i) => i.stage === s).length]).filter(([, n]) => n)
  const label = parts.map(([s, n]) => `${n} ${stageLabel[s]}`).join(' · ')
  return (
    <div className="relative h-[6px] flex-1" role="img" aria-label={label} title={label}>
      <span aria-hidden className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-line" />
      <div className="relative flex h-full gap-[2px]" style={{ width: `${(list.length / max) * 100}%` }}>
        {parts.map(([s, n]) => (
          <span key={s} className={`h-full ${SWATCH[s]}`} style={{ flexGrow: n }} />
        ))}
      </div>
    </div>
  )
}

function DomainBlock({ d, last }) {
  const list = counts[d.id]
  const h = domainHighlights[d.id]
  const top = findItem(h.item)
  const ga = list.filter((x) => x.stage === 'GA').length
  return (
    <article id={`dominio-${d.id}`} aria-labelledby={`dominio-${d.id}-nome`} className={`grid break-inside-avoid grid-cols-[76px_1fr] gap-x-6 border-t border-line pb-10 pt-8 md:grid-cols-[96px_1fr] md:gap-x-8 ${last ? 'border-b' : ''}`}>
      {/* 1 · número-âncora: topo das cifras alinhado ao topo das maiúsculas do nome */}
      <p className="num -mt-[3px] text-[48px] font-medium leading-[0.82] tracking-[-0.05em] text-ink md:text-[60px]">
        {list.length}
      </p>
      <div className="min-w-0">
        {/* 2 · nome · 3 · metadata */}
        <h3 id={`dominio-${d.id}-nome`} className="text-[20px] font-semibold leading-[1.2] tracking-[-0.015em]">{d.name}</h3>
        <p className="mt-1.5 text-[14px] leading-[1.45] text-muted">{d.short}</p>

        {/* 4 · maturidade */}
        <div className="mt-5 flex items-center gap-4">
          <MaturityLine list={list} />
          <span className="w-[40px] shrink-0 text-right font-mono text-[12px] uppercase text-muted">
            {ga} GA
          </span>
        </div>

        {/* 5 · destaque · 6 · descrição */}
        <div className="mt-7 flex items-center gap-3">
          <StageChip stage={top.stage} size="sm" />
          <p className="min-w-0 text-[16px] font-semibold leading-[1.3] tracking-[-0.005em]">{top.short}</p>
        </div>
        <p className="mt-2.5 max-w-[46ch] text-pretty text-[16px] leading-[1.6] text-body">{h.line}</p>

        {/* 7 · observação secundária */}
        <p className="mt-5 flex gap-3 text-[14px] leading-[1.55] text-muted">
          <span aria-hidden className="mt-[0.72em] h-px w-3 shrink-0 bg-line-strong" />
          {h.note}
        </p>
      </div>
    </article>
  )
}

export function DomainOverview() {
  return (
    <section id="dominios" aria-labelledby="dominios-titulo" className="py-16 md:py-24">
      <SectionHeader
        id="dominios"
        index={sectionIndex('dominios')}
        title="Onde a inovação se concentrou"
      />
      <div className="grid md:grid-cols-2 md:gap-x-16 lg:gap-x-20">
        {ranked.map((d, i) => (
          <DomainBlock key={d.id} d={d} last={i >= ranked.length - 2} />
        ))}
      </div>
    </section>
  )
}
