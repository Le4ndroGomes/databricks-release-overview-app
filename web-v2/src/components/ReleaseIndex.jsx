import { useId, useMemo, useState } from 'react'
import inventoryMd from '../../../inventario-setembro-2026.md?raw'
import { announcements, domains, items, period, sectionIndex, sources, stageLabel, stageOrder } from '../content.js'
import { Label, SectionHeader, SourceLink, StageChip } from './primitives.jsx'

// ── 07 · Índice completo pesquisável ─────────────────────────────────────────
const fold = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
const ddmm = (iso) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}`
const domainName = Object.fromEntries(domains.map((d) => [d.id, d.name]))
const STAGE_FILTER_LABEL = { ...stageLabel, 'Não informado': 'Estágio não divulgado' }
const CLOUDS = ['AWS', 'Azure', 'GCP']
const cloudTag = (c) => (c === 'AWS · Azure · GCP' ? '' : c === 'Não informado' ? 'Cloud não identificada' : c)
const byStageThenDate = (a, b) => stageOrder.indexOf(a.stage) - stageOrder.indexOf(b.stage) || a.date.localeCompare(b.date)

const INDEXED = items.map((i) => ({
  ...i,
  hay: fold([i.short, i.name, i.change, i.impact, i.axis, i.restr, i.clouds, domainName[i.domain], stageLabel[i.stage]].join(' ')),
}))

function Row({ it }) {
  const [open, setOpen] = useState(false)
  const panel = useId()
  const tag = cloudTag(it.clouds)
  return (
    <li className="break-inside-avoid border-t border-line first:border-t-0">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panel}
        onClick={() => setOpen((v) => !v)}
        className="grid min-h-[44px] w-full grid-cols-[auto_1fr_auto] items-center gap-x-4 py-3 text-left"
      >
        <StageChip stage={it.stage} size="sm" />
        <span className="min-w-0">
          <span className="text-[16px] leading-[1.4] text-ink">{it.short}</span>
          {tag && <span className="ml-2 whitespace-nowrap text-[13px] text-muted">{tag}</span>}
        </span>
        <span className="flex items-center gap-3">
          <span className="font-mono text-[12.5px] text-muted">{ddmm(it.date)}</span>
          <span aria-hidden className={`text-[12px] text-muted transition-transform duration-150 motion-reduce:transition-none print:hidden ${open ? 'rotate-180' : ''}`}>▾</span>
        </span>
      </button>
      <div id={panel} hidden={!open} data-print-expand className="pb-5 print:pb-3">
        <dl className="grid gap-x-8 gap-y-3 rounded-[12px] bg-oat p-5 text-[15px] leading-[1.55] md:grid-cols-2 print:bg-transparent print:p-0 print:text-[12px]">
          {it.short !== it.name && (
            <div className="md:col-span-2">
              <dt className="sr-only">Nome oficial</dt>
              <dd className="font-mono text-[12.5px] text-muted">{it.name}</dd>
            </div>
          )}
          <div>
            <dt><Label>Mudança</Label></dt>
            <dd className="mt-1 text-body">{it.change}</dd>
          </div>
          <div>
            <dt><Label>Impacto</Label></dt>
            <dd className="mt-1 text-body"><span className="font-medium text-ink">{it.axis}.</span> {it.impact}</dd>
          </div>
          <div>
            <dt><Label>Clouds e restrições</Label></dt>
            <dd className="mt-1 text-body">{it.clouds === 'Não informado' ? 'Cloud não identificada' : it.clouds}{it.restr !== '—' ? `. ${it.restr}` : ''}</dd>
          </div>
          <div className="flex items-end print:hidden">
            <SourceLink href={it.src} />
          </div>
        </dl>
      </div>
    </li>
  )
}

function FilterChip({ on, onClick, children }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`inline-flex h-11 items-center rounded-full border px-3.5 text-[14px] transition-colors duration-150 motion-reduce:transition-none ${
        on ? 'border-ink bg-ink text-white' : 'border-line-strong bg-white text-ink hover:border-ink/50'
      }`}
    >
      {children}
    </button>
  )
}

export function ReleaseIndex() {
  const [q, setQ] = useState('')
  const [domain, setDomain] = useState('')
  const [stages, setStages] = useState([])
  const [cloud, setCloud] = useState('')
  const searchId = useId()

  const results = useMemo(() => {
    const terms = fold(q).split(/\s+/).filter(Boolean)
    return INDEXED.filter(
      (i) =>
        terms.every((t) => i.hay.includes(t)) &&
        (!domain || i.domain === domain) &&
        (!stages.length || stages.includes(i.stage)) &&
        // Inclusão: AWS também retorna itens disponíveis nas três clouds.
        (!cloud || i.clouds.split(' · ').includes(cloud)),
    )
  }, [q, domain, stages, cloud])

  const active = q || domain || stages.length || cloud
  const clear = () => { setQ(''); setDomain(''); setStages([]); setCloud('') }
  const toggleStage = (s) => setStages((v) => (v.includes(s) ? v.filter((x) => x !== s) : [...v, s]))
  const groups = domains.map((d) => [d, results.filter((i) => i.domain === d.id).sort(byStageThenDate)]).filter(([, l]) => l.length)

  return (
    <section id="indice" aria-labelledby="indice-titulo" className="py-16 md:py-24">
      <SectionHeader
        id="indice"
        index={sectionIndex('indice')}
        title="Todas as 95 atualizações"
        kicker="Busque por produto, capacidade ou termo e filtre por domínio, estágio ou cloud. Cada item abre com mudança, impacto, restrições e fonte."
      />

      <div className="space-y-5 rounded-[16px] border border-line p-5 md:p-6 print:hidden" role="search" aria-label="Filtrar o índice">
        <div className="grid gap-4 md:grid-cols-[1fr_260px]">
          <div>
            <label htmlFor={searchId} className="text-[13px] font-medium text-ink">Buscar</label>
            <input
              id={searchId}
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Ex.: ABAC, Lakebase, conector, Azure"
              className="mt-1.5 h-12 w-full rounded-[10px] border border-line-strong bg-white px-4 text-[16px] text-ink placeholder:text-muted"
            />
          </div>
          <div>
            <label htmlFor={`${searchId}-dom`} className="text-[13px] font-medium text-ink">Domínio</label>
            <select
              id={`${searchId}-dom`}
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="mt-1.5 h-12 w-full rounded-[10px] border border-line-strong bg-white px-3 text-[16px] text-ink"
            >
              <option value="">Todos os domínios</option>
              {domains.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          <fieldset className="flex flex-wrap items-center gap-2">
            <legend className="mb-2 w-full text-[13px] font-medium text-ink">Estágio</legend>
            {stageOrder.map((s) => (
              <FilterChip key={s} on={stages.includes(s)} onClick={() => toggleStage(s)}>{STAGE_FILTER_LABEL[s]}</FilterChip>
            ))}
          </fieldset>
          <fieldset className="flex flex-wrap items-center gap-2">
            <legend className="mb-2 w-full text-[13px] font-medium text-ink">Disponível em</legend>
            <FilterChip on={!cloud} onClick={() => setCloud('')}>Todas</FilterChip>
            {CLOUDS.map((c) => (
              <FilterChip key={c} on={cloud === c} onClick={() => setCloud(cloud === c ? '' : c)}>{c}</FilterChip>
            ))}
          </fieldset>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
          <p aria-live="polite" className="text-[15px] text-ink">
            <span className="num font-semibold">{results.length}</span> de {items.length} atualizações
            {cloud && <span className="text-muted"> · itens sem cloud identificada não aparecem ao filtrar por cloud</span>}
          </p>
          <button type="button" onClick={clear} disabled={!active} className="h-11 rounded-full px-4 text-[14px] font-medium text-ink underline underline-offset-4 disabled:text-muted disabled:no-underline">
            Limpar filtros
          </button>
        </div>
      </div>

      {groups.length === 0 ? (
        <div className="mt-10 rounded-[16px] bg-oat p-8 text-center">
          <p className="text-[18px] font-semibold text-ink">Nenhuma atualização encontrada</p>
          <p className="mx-auto mt-2 max-w-[44ch] text-[15px] leading-[1.6] text-body">
            Tente um termo mais curto (por exemplo, “ABAC” em vez de “ABAC em views”) ou remova um filtro de estágio ou cloud.
          </p>
          <button type="button" onClick={clear} className="mt-5 inline-flex h-11 items-center rounded-full bg-ink px-5 text-[14px] font-medium text-white">
            Limpar filtros
          </button>
        </div>
      ) : (
        <div className="mt-10 grid gap-x-12 gap-y-12 lg:grid-cols-2 print:block">
          {groups.map(([d, list]) => (
            <div key={d.id} className="min-w-0 print:mb-8">
              <div className="flex items-baseline justify-between border-b border-ink pb-2 print:break-after-avoid">
                <h3 className="text-[17px] font-semibold">{d.name}</h3>
                <span className="num font-mono text-[13px] text-muted">{list.length}</span>
              </div>
              <ul data-print-columns>{list.map((it) => <Row key={it.id} it={it} />)}</ul>
            </div>
          ))}
        </div>
      )}

      <div className="mt-16 border-t border-line pt-6">
        <h3 className="text-[16px] font-semibold">Anúncios corporativos <span className="font-normal text-muted">— fora da contagem de atualizações</span></h3>
        <ul className="mt-3 grid gap-x-10 gap-y-2 text-[15px] sm:grid-cols-2 lg:grid-cols-3">
          {announcements.map((a) => (
            <li key={a.name} className="flex gap-3">
              <span className="font-mono text-[12.5px] leading-[1.9] text-muted">{ddmm(a.date)}</span>
              <a href={a.src} target="_blank" rel="noreferrer" className="text-ink underline decoration-line-strong underline-offset-4 hover:decoration-lava">{a.name}</a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

// ── Rodapé · fontes e metodologia ────────────────────────────────────────────
function downloadInventory() {
  const url = URL.createObjectURL(new Blob([inventoryMd], { type: 'text/markdown;charset=utf-8' }))
  const a = Object.assign(document.createElement('a'), { href: url, download: 'inventario-setembro-2026.md' })
  document.body.append(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function Footer() {
  const links = [
    ['Release notes AWS', sources.aws], ['Azure', sources.azure], ['GCP', sources.gcp],
    ['Databricks SQL', sources.dbsql], ['Blog', sources.blog], ['Newsroom', sources.newsroom],
  ]
  return (
    <footer id="fontes" aria-label="Fontes e metodologia" className="grid gap-8 border-t border-ink py-12 text-[14px] leading-[1.6] text-body md:grid-cols-12">
      <div className="md:col-span-4">
        <Label>Fontes oficiais</Label>
        <p className="mt-2">
          {links.map(([n, u], k) => (
            <span key={n}>
              <a href={u} target="_blank" rel="noreferrer" className="text-ink underline decoration-line-strong underline-offset-4 hover:decoration-lava">{n}</a>
              {k < links.length - 1 ? ' · ' : ''}
            </span>
          ))}
        </p>
      </div>
      <div className="md:col-span-5">
        <Label>Metodologia</Label>
        <p className="mt-2">
          Pesquisa em {period.researched}. As 95 atualizações são deduplicadas entre AWS, Azure, GCP, release notes, blog e newsroom.
          As datas são as de publicação nas release notes; o rollout é escalonado e pode levar uma semana ou mais.
          O estágio é o declarado na fonte. A seção de modelos é complementar e não entra na contagem.
        </p>
      </div>
      <div className="md:col-span-3 md:text-right">
        <Label>Inventário detalhado</Label>
        <button
          type="button"
          onClick={downloadInventory}
          className="mt-2 inline-flex h-11 items-center rounded-full border border-ink px-5 text-[14px] font-medium text-ink print:hidden"
        >
          Baixar inventário (.md)
        </button>
        <p className="mt-2 text-[13px] text-muted">Incorporado nesta página: mudança, impacto, restrições e notas de cobertura.</p>
      </div>
    </footer>
  )
}
