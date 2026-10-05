import { domains, hero, items, period, stats } from '../content.js'
import { Label, Swatch } from './primitives.jsx'

// Abertura: período → movimento estratégico → síntese → ações → dimensão e maturidade → áreas.
// O volume (95) apoia a narrativa; os quatro indicadores têm o mesmo peso.
const KPIS = [
  { value: stats.total, label: 'Atualizações' },
  { value: stats.stages.GA, label: 'GA', stage: 'GA' },
  { value: stats.stages.Beta, label: 'Beta', stage: 'Beta' },
  { value: domains.length, label: 'Domínios' },
]

const TOP = domains
  .map((d) => ({ ...d, n: items.filter((i) => i.domain === d.id).length }))
  .sort((a, b) => b.n - a.n)
  .slice(0, 3)

const ROW = 'grid grid-cols-2 lg:grid-cols-4'
const CELL = 'lg:border-l lg:pl-10'

export function Hero() {
  return (
    <section id="topo" aria-labelledby="topo-titulo" className="pb-20 pt-14 md:pb-24 md:pt-20">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <span aria-hidden className="h-[2px] w-10 bg-lava" />
        <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-body">
          {hero.eyebrow} <span className="text-line-strong">·</span> <span className="text-ink">{period.label}</span>
        </p>
      </div>

      <h1 id="topo-titulo" className="mt-8 max-w-[1100px] text-balance text-[clamp(2.4rem,1.1rem+4.4vw,4.75rem)] font-semibold leading-[1.04] tracking-[-0.035em]">
        {hero.headline.map((line, i) => (
          <span key={line} className="block">
            {i === hero.headline.length - 1 ? (
              <>
                {line.slice(0, -1)}
                <span className="text-lava">.</span>
              </>
            ) : (
              line
            )}
          </span>
        ))}
      </h1>

      {hero.support && (
        <p className="mt-8 max-w-[680px] text-pretty text-[clamp(1.0625rem,1rem+0.3vw,1.25rem)] leading-[1.6] text-body">{hero.support}</p>
      )}

      {/* CTAs como par de botões do mesmo sistema: primário sólido dominante, secundário com borda. */}
      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 print:hidden">
        <a
          href="#destaques"
          className="inline-flex h-14 w-full items-center justify-center rounded-[10px] bg-ink px-[30px] text-[16px] font-medium text-white no-underline transition-[background-color,transform,box-shadow] duration-200 ease-out hover:-translate-y-px hover:bg-navy hover:shadow-[0_6px_20px_rgba(11,32,38,0.14)] active:translate-y-0 motion-reduce:transition-none sm:w-auto"
        >
          Ver principais releases
        </a>
        <a
          href="#indice"
          className="inline-flex h-14 w-full items-center justify-center rounded-[10px] border border-line-strong bg-transparent px-[28px] text-[16px] font-medium text-ink no-underline transition-[background-color,border-color,transform] duration-200 ease-out hover:-translate-y-px hover:border-ink hover:bg-oat active:translate-y-0 motion-reduce:transition-none sm:w-auto"
        >
          Ver índice completo
        </a>
      </div>

      <dl className={`mt-16 gap-y-10 border-t border-line pt-8 md:mt-20 ${ROW}`}>
        {KPIS.map((k, i) => (
          <div key={k.label} className={i ? `border-line ${CELL}` : ''}>
            <dd className="num text-[clamp(2.5rem,2rem+1.6vw,3.5rem)] font-semibold leading-[0.95] tracking-[-0.04em]">{k.value}</dd>
            <dt className="mt-3 flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.12em] text-body">
              {k.stage && <Swatch stage={k.stage} className="size-2" />}
              {k.label}
            </dt>
          </div>
        ))}
      </dl>

      <div className={`mt-10 gap-y-6 border-t border-line pt-6 ${ROW}`}>
        <Label className="col-span-2 max-w-[14rem] leading-[1.6] lg:col-span-1">{hero.topDomainsLabel}</Label>
        {TOP.map((d) => (
          <a key={d.id} href={`#dominio-${d.id}`} className={`group border-transparent no-underline ${CELL}`}>
            <span className="num block text-[28px] font-semibold leading-none tracking-[-0.03em] text-ink">{d.n}</span>
            <span className="mt-2 block text-[16px] leading-[1.4] text-ink underline decoration-transparent underline-offset-4 group-hover:decoration-lava">{d.name}</span>
          </a>
        ))}
      </div>

      {hero.provenance && (
        <p className="mt-10 text-[12px] leading-[1.5] text-muted">{hero.provenance}</p>
      )}
    </section>
  )
}
