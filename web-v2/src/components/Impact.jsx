import { actions, impacts, impactsSection, sectionIndex } from '../content.js'
import { Icon, Label, SectionHeader, SourceLink } from './primitives.jsx'

// ── 02 · O que muda na prática ────────────────────────────────────────────────
// Resultado primeiro, evidência depois: número e ícone como âncora → manchete → explicação → capacidades.
function Outcome({ t, i }) {
  return (
    <li className="flex break-inside-avoid flex-col">
      <div className="flex items-center gap-4">
        <span className="num font-mono text-[13px] font-medium text-lava">{String(i + 1).padStart(2, '0')}</span>
        <span aria-hidden className="h-px w-6 bg-ink/20" />
        <Icon name={t.icon} size={20} className="text-ink/80" />
      </div>
      <h3 className="mt-7 text-balance text-[clamp(1.375rem,1.2rem+0.5vw,1.625rem)] font-semibold leading-[1.2] tracking-[-0.022em]">
        {t.lines ? t.lines.map((l) => <span key={l} className="sm:block">{l} </span>) : t.title}
      </h3>
      <p className="mt-4 max-w-[40ch] text-pretty text-[16px] leading-[1.65] text-body">{t.body}</p>
      <ul className="mt-7 flex flex-wrap content-start gap-2" aria-label="Capacidades">
        {t.basis.map((b) => (
          <li key={b} className="inline-flex h-7 items-center rounded-[6px] border border-ink/[0.12] bg-white/60 px-2.5 text-[12px] font-medium uppercase leading-none tracking-[0.08em] text-ink/75">
            {b}
          </li>
        ))}
      </ul>
    </li>
  )
}

export function CustomerImpact() {
  return (
    <section
      id="impacto"
      aria-labelledby="impacto-titulo"
      className="bg-oat py-16 [box-shadow:0_0_0_100vmax_var(--color-oat)] [clip-path:inset(0_-100vmax)] md:py-24 print:[box-shadow:none] print:[clip-path:none]"
    >
      <SectionHeader id="impacto" index={sectionIndex('impacto')} title={impactsSection.title} kicker={impactsSection.kicker} />
      <ol className="grid gap-x-12 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {impacts.map((t, i) => (
          <Outcome key={t.title} t={t} i={i} />
        ))}
      </ol>
    </section>
  )
}

// ── 03 · Requer ação ──────────────────────────────────────────────────────────
// Data absoluta como referência principal; tipo de item explícito (prazo documentado,
// mudança publicada ou recomendação editorial). Responsáveis são sugestões por função.
const KIND = {
  'Prazo documentado': 'bg-ink text-white',
  'Mudança publicada': 'bg-white text-ink border border-ink/25',
  'Recomendação editorial': 'bg-white text-body border border-dashed border-ink/30',
}

function ActionRow({ a }) {
  return (
    <li className="grid break-inside-avoid gap-x-10 gap-y-4 border-t border-line py-8 md:grid-cols-12">
      <div className="md:col-span-3">
        <p className="num font-mono text-[clamp(1.375rem,1.2rem+0.6vw,1.75rem)] font-medium leading-none tracking-[-0.02em] text-ink">{a.when}</p>
        <span className={`mt-3 inline-flex h-6 items-center rounded-[6px] px-2 text-[12px] font-medium ${KIND[a.kind]}`}>{a.kind}</span>
      </div>
      <div className="md:col-span-6">
        <h3 className="text-[19px] font-semibold leading-[1.3] tracking-[-0.01em]">{a.title}</h3>
        <dl className="mt-3 space-y-2.5 text-[16px] leading-[1.6]">
          <div>
            <dt className="inline font-medium text-ink">Quem é afetado: </dt>
            <dd className="inline text-body">{a.affected}</dd>
          </div>
          <div>
            <dt className="inline font-medium text-ink">Ação: </dt>
            <dd className="inline text-body">{a.action}</dd>
          </div>
        </dl>
      </div>
      <div className="flex flex-col gap-3 md:col-span-3">
        <div>
          <Label>Responsável</Label>
          <p className="mt-1 text-[15px] text-ink">{a.owner}</p>
        </div>
        <ul className="flex flex-wrap gap-x-4 gap-y-1">
          {a.sources.map(([t, u]) => (
            <li key={u}><SourceLink href={u}>{a.sources.length > 1 ? t : 'Fonte oficial'}</SourceLink></li>
          ))}
        </ul>
      </div>
    </li>
  )
}

export function Actions() {
  return (
    <section id="acoes" aria-labelledby="acoes-titulo" className="py-16 md:py-24">
      <SectionHeader
        id="acoes"
        index={sectionIndex('acoes')}
        title="Prazos e mudanças de comportamento"
        kicker="Mudanças e prazos que exigem ação."
        aside="Responsáveis são sugestões por função, não atribuições."
      />
      <ol className="border-b border-line">
        {actions.map((a) => <ActionRow key={a.title} a={a} />)}
      </ol>
    </section>
  )
}
