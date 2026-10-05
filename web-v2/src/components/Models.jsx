import { useMemo } from 'react'
import { sectionIndex } from '../content.js'
import { SectionHeader, SourceLink, Disclosure } from './primitives.jsx'
import { getLogo } from '../logos/index.js'
import data from '../data/models.json'

// Datas a partir da string ISO (sem Date, para não deslocar por fuso).
const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
const fmtDate = (iso) => { const [y, m, d] = iso.split('-'); return `${d}/${m}/${y}` }
const fmtMarker = (iso) => { const [y, m, d] = iso.split('-'); return `${d} ${MESES[+m - 1]} ${y}`.toUpperCase() }

// Pontuação inline: "53 / 100" na escala 0–100; senão score + escala.
function scoreInline(b) {
  if (b.scale === '0–100') return `${b.score} / 100`
  if (b.scale === '% de acerto') return `${b.score}%`
  return `${b.score} ${b.scale}`
}

// Nome curto do índice para a linha compacta (o nome completo fica em "Ver detalhes").
const shortIndex = (b) => (b.index.startsWith('Artificial Analysis') ? 'Artificial Analysis' : b.index)

const ACCESS = { limited: 'Acesso limitado', announced: 'Anunciado · sem acesso' }

// Logo de identidade (não decorativo); proporção preservada. alt vazio: fornecedor em texto ao lado.
function LogoMark({ logo, size = 26 }) {
  if (!logo) return null
  const wide = logo.kind === 'wordmark'
  return (
    <span className="flex shrink-0 items-center" style={{ height: size, width: wide ? Math.round(size * 2.2) : size }}>
      <img src={logo.src} alt="" aria-hidden className="max-h-full max-w-full object-contain object-left" />
    </span>
  )
}

// Card compacto: identidade → nome → descrição curta → Databricks → benchmark → links → detalhes.
function ModelCard({ item }) {
  const logo = getLogo(item.familyKey, item.vendorKey)
  const bench = item.benchmarks?.[0]
  const dbDiffers = item.databricks && item.databricks.date !== item.date
  const hasDetails = item.differentiator || item.accessNote || item.benchmarks?.length > 0
  return (
    <article className="flex break-inside-avoid flex-col rounded-[13px] border border-line bg-white p-[18px] transition-[border-color,transform] duration-200 ease-out hover:-translate-y-px hover:border-line-strong motion-reduce:transition-none print:p-3.5">
      <div className="flex items-center gap-2.5">
        <LogoMark logo={logo} />
        <span className="text-[12px] font-medium uppercase tracking-[0.1em] text-muted">{item.vendor}</span>
        {ACCESS[item.access] && (
          <span className={`ml-auto inline-flex h-[20px] shrink-0 items-center rounded-[4px] border border-dashed px-1.5 text-[11px] font-medium ${item.access === 'announced' ? 'border-lava text-lava' : 'border-pupr text-pupr'}`}>
            {ACCESS[item.access]}
          </span>
        )}
      </div>

      <h4 className="mt-2 text-[18px] font-semibold leading-[1.2] tracking-[-0.015em] text-ink">{item.model}</h4>
      <p className="mt-1.5 line-clamp-2 text-[14px] leading-[1.5] text-body">{item.summary}</p>

      {/* Metadados compactos: disponibilidade (sempre visível) + avaliação, uma linha cada. */}
      <div className="mt-3 space-y-1 border-t border-line pt-3 text-[13px] leading-[1.45]">
        <p className="text-ink">
          {item.databricks.clouds ? (
            <>
              <span className="text-muted">Databricks · </span>
              {dbDiffers ? `${fmtDate(item.databricks.date)} · ` : ''}{item.databricks.clouds}
            </>
          ) : (
            'Disponível na Databricks'
          )}
        </p>
        <p className="text-body">
          {bench ? (
            <>
              <span className="text-muted">{shortIndex(bench)} · </span>
              <span className="num font-mono font-medium text-ink">{scoreInline(bench)}</span>
              {bench.evaluator === 'vendor'
                ? <span className="text-muted"> · fornecedor</span>
                : bench.config ? <span className="text-muted"> · {bench.config}</span> : null}
            </>
          ) : (
            <span className="text-muted">Sem avaliação pública verificada</span>
          )}
        </p>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[13px]">
        {item.links?.announcement && <SourceLink href={item.links.announcement}>Anúncio oficial</SourceLink>}
        {item.databricks?.url && <SourceLink href={item.databricks.url}>Release note</SourceLink>}
        {bench?.url && <SourceLink href={bench.url}>Avaliação</SourceLink>}
      </div>

      {hasDetails && (
        <Disclosure printExpand={false} className="mt-2.5 border-t border-line pt-1">
          <dl className="mt-3 space-y-3 text-[13px] leading-[1.5]">
            {item.differentiator && (
              <div>
                <dt className="text-[11px] font-medium uppercase tracking-[0.1em] text-muted">{item.differentiator.axis}</dt>
                <dd className="mt-0.5 text-body">{item.differentiator.text}</dd>
              </div>
            )}
            {item.accessNote && (
              <div>
                <dt className="text-[11px] font-medium uppercase tracking-[0.1em] text-muted">Acesso</dt>
                <dd className="mt-0.5 text-body">{item.accessNote}</dd>
              </div>
            )}
            {item.benchmarks?.length > 0 && (
              <div>
                <dt className="text-[11px] font-medium uppercase tracking-[0.1em] text-muted">Metodologia</dt>
                {item.benchmarks.map((b) => (
                  <dd key={b.index} className="mt-0.5 text-body">
                    {b.index}{b.version ? ` v${b.version.replace(/^v/, '')}` : ''} — {b.score} {b.scale}
                    {b.config ? `, ${b.config}` : ''}; {b.evaluator === 'independent' ? 'avaliação independente' : 'divulgado pelo fornecedor'},{' '}
                    {b.dateKind === 'evaluated' ? 'avaliado' : 'consultado'} em {fmtDate(b.date)}.
                  </dd>
                ))}
              </div>
            )}
          </dl>
        </Disclosure>
      )}
    </article>
  )
}

// Agrupa por data exata, em ordem cronológica. A data pertence ao marcador do grupo.
function groupByDate(items) {
  const map = new Map()
  for (const it of items) {
    if (!map.has(it.date)) map.set(it.date, [])
    map.get(it.date).push(it)
  }
  return [...map.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([date, group]) => ({ date, items: group }))
}

// Timeline editorial: fio fino à esquerda, marcadores de data discretos, até 2 cards por linha.
function Timeline({ groups }) {
  return (
    // Tela: timeline vertical com fio e marcadores. Impressão: 2 colunas tipo jornal (sem fio),
    // para empacotar os grupos de data e reduzir páginas sem repetir datas nem quebrar grupos.
    <div className="relative md:pl-8 print:pl-0">
      <span aria-hidden className="absolute bottom-2 left-[3px] top-2 hidden w-px bg-line md:block print:!hidden" />
      <ol className="space-y-8 print:columns-2 print:space-y-0 print:[column-gap:28px]">
        {groups.map((g) => (
          <li key={g.date} className="relative print:mb-5 print:break-inside-avoid">
            <span aria-hidden className="absolute left-[-32px] top-[5px] hidden size-[7px] rounded-full bg-ink ring-4 ring-white md:block print:!hidden" />
            <p className="font-mono text-[12px] font-medium uppercase tracking-[0.08em] text-muted">
              <time dateTime={g.date}>{fmtMarker(g.date)}</time>
            </p>
            <div className="mt-3.5 grid items-start gap-4 sm:grid-cols-2 print:mt-2.5 print:grid-cols-1 print:gap-3">
              {g.items.map((it) => <ModelCard key={it.id} item={it} />)}
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

export function Models() {
  // Só modelos com disponibilidade confirmada na Databricks (hospedado ou via Unity Gateway).
  const launches = (data.launches || []).filter((m) => m.databricks)
  const arrivals = (data.arrivals || []).filter((m) => m.databricks)
  const groups = useMemo(() => groupByDate(launches), [launches])
  const arrivalGroups = useMemo(() => groupByDate(arrivals), [arrivals])

  return (
    <section id="modelos" aria-labelledby="modelos-titulo" className="py-16 md:py-24">
      <SectionHeader
        id="modelos"
        index={sectionIndex('modelos')}
        title="Modelos lançados no mês"
        kicker="Lançamentos de modelos e disponibilidade na Databricks ao longo de setembro."
        aside={<>Fora da contagem de 95 atualizações.</>}
      />

      {launches.length > 0 ? (
        <Timeline groups={groups} />
      ) : (
        <p className="rounded-[12px] bg-oat px-5 py-6 text-[15px] text-body">
          A pesquisa de modelos não pôde ser concluída; nenhum dado foi publicado nesta seção.
        </p>
      )}

      <div className="mt-14 border-t border-ink/20 pt-8">
        <h3 className="text-[18px] font-semibold tracking-[-0.015em] text-ink">Chegaram ao Databricks neste mês</h3>
        {arrivals.length > 0 ? (
          <div className="mt-5"><Timeline groups={arrivalGroups} /></div>
        ) : (
          data.meta?.arrivalsNote && <p className="mt-2 max-w-[62ch] text-[14px] leading-[1.6] text-body">{data.meta.arrivalsNote}</p>
        )}
      </div>

      <div className="mt-12 grid gap-4 border-t border-line pt-6 text-[13px] leading-[1.6] text-muted md:grid-cols-12 md:gap-x-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.12em] md:col-span-3">Nota metodológica</p>
        <div className="space-y-2 md:col-span-9">
          <p><span className="font-medium text-body">Seleção.</span> Modelos lançados pelos fornecedores em setembro de 2026 e com disponibilidade confirmada na Databricks (hospedados ou via Unity Gateway).</p>
          {data.meta?.notes?.length > 0 && (
            <ul className="space-y-1.5">
              {data.meta.notes.map((n) => (
                <li key={n} className="flex gap-2.5"><span aria-hidden className="mt-[0.7em] h-px w-2.5 shrink-0 bg-line-strong" />{n}</li>
              ))}
            </ul>
          )}
          {data.meta?.consulted && (
            <p>Fontes oficiais, consultadas em <time dateTime={data.meta.consulted} className="num font-mono">{fmtDate(data.meta.consulted)}</time>.</p>
          )}
        </div>
      </div>
    </section>
  )
}
