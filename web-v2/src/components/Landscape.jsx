import { items, sectionIndex, stats } from '../content.js'
import { SectionHeader, useTooltip } from './primitives.jsx'
import awsLogo from '../assets/cloud-aws.png?url'
import azureLogo from '../assets/cloud-azure.png?url'
import gcpLogo from '../assets/cloud-gcp.png?url'

const total = stats.total
const pct = (n) => `${(100 * n) / total}%`

// ── Maturidade ────────────────────────────────────────────────────────────────
// A régua tem a largura do mês inteiro (95). Só estágios de release são preenchidos;
// o restante fica como trilho de 1 px, com a explicação em camada secundária.
const RELEASE = [
  { key: 'GA', label: 'GA', n: stats.stages.GA, fill: 'bg-ga', lead: true },
  { key: 'Public Preview', label: 'Public Preview', n: stats.stages['Public Preview'], fill: 'bg-pupr' },
  { key: 'Beta', label: 'Beta', n: stats.stages.Beta, fill: 'bg-beta', lead: true },
]
const staged = RELEASE.reduce((a, r) => a + r.n, 0)
const unstaged = total - staged

function Stat({ r }) {
  return (
    <div>
      <p className={`num font-semibold leading-[0.9] tracking-[-0.04em] ${r.lead ? 'text-[56px]' : 'text-[30px] text-body'}`}>{r.n}</p>
      <p className="mt-3 flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.14em] text-body">
        <span aria-hidden className={`size-2 ${r.fill}`} />
        {r.label}
      </p>
    </div>
  )
}

function Maturity() {
  const { bind, node, host } = useTooltip()
  return (
    <div>
      <h3 className="text-[18px] font-semibold tracking-[-0.01em]">Maturidade</h3>
      <p className="mt-1.5 text-[15px] leading-[1.5] text-muted">Estágio de release declarado na fonte.</p>

      <div className="mt-10 flex items-end gap-x-12">
        <Stat r={RELEASE[0]} />
        <Stat r={RELEASE[2]} />
        <Stat r={RELEASE[1]} />
      </div>

      <p className="sr-only">Resumo: {stats.stages.GA} em GA, {stats.stages['Public Preview']} em Public Preview e {stats.stages.Beta} em Beta, de {total} atualizações. Outras {unstaged} não têm estágio de release: {stats.stages['Não informado']} com estágio não divulgado e {stats.stages['N/A']} outros eventos.</p>
      <div ref={host} className="relative mt-8">
        {node}
        <div className="relative h-3" role="img" aria-label={`${RELEASE.map((r) => `${r.n} ${r.label}`).join(', ')}, de ${total} atualizações`}>
          <span aria-hidden className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-line-strong" />
          <div className="relative flex h-full gap-[2px]" style={{ width: pct(staged) }}>
            {RELEASE.map((r) => (
              <span key={r.key} {...bind(`${r.label}: ${r.n} de ${total}`)} className={`h-full outline-none ${r.fill}`} style={{ flexGrow: r.n }} />
            ))}
          </div>
        </div>
        {/* chave sob o trilho: o que não é estágio de release */}
        <div className="relative mt-3 h-8 font-mono text-[12px] text-muted">
          <span aria-hidden className="absolute top-[3px] h-[5px] border-x border-b border-line-strong" style={{ left: `calc(${pct(staged)} + 6px)`, right: 0 }} />
          <span className="absolute right-0 top-3.5 tracking-[0.04em]">{unstaged} sem estágio de release · total {total}</span>
        </div>
      </div>

    </div>
  )
}

// ── Cadência ──────────────────────────────────────────────────────────────────
const days = Array.from({ length: 30 }, (_, i) => i + 1)
const perDay = Object.fromEntries(days.map((d) => [d, items.filter((i) => Number(i.date.slice(8, 10)) === d)]))
const peak = Math.max(...days.map((d) => perDay[d].length))
const peakDay = days.find((d) => perDay[d].length === peak)
const peakConnectors = perDay[peakDay].filter((i) => i.group === 'conectores').length
const mean = total / days.length
const MILESTONES = [
  { d: 1, title: 'Auto CDF', stage: 'GA', row: 0, align: 'left' },
  { d: 16, title: 'Unity Gateway API', stage: 'GA', row: 0, align: 'center' },
  { d: 25, title: 'Genie One MCP', stage: 'GA', row: 0, align: 'center' },
  { d: 29, title: 'ABAC em views', stage: 'Beta', row: 1, align: 'right' },
]
const isMilestone = Object.fromEntries(MILESTONES.map((m) => [m.d, true]))
const dd = (d) => `${String(d).padStart(2, '0')}/09`
const x = (d) => `${((d - 0.5) / days.length) * 100}%` // centro da coluna do dia

// Hierarquia de cor: atividade normal → acima da média → marco → pico do mês.
function barTone(d, n) {
  if (d === peakDay) return 'bg-lava'
  if (isMilestone[d]) return 'bg-[#FF9E94]'
  if (n >= mean * 1.5) return 'bg-[#9DB0B7]'
  return 'bg-[#DCE3E5]'
}

function Cadence() {
  const { bind, node, host } = useTooltip()
  return (
    <div>
      <h3 className="text-[18px] font-semibold tracking-[-0.01em]">Cadência</h3>
      <p className="mt-1.5 text-[15px] leading-[1.5] text-muted">Atualizações por dia de publicação. Em vermelho, os marcos do mês.</p>

      <p className="sr-only">Resumo: pico em {dd(peakDay)}, com {peak} atualizações, {peakConnectors} delas conectores do Lakeflow Connect. Marcos: {MILESTONES.map((m) => `${dd(m.d)} ${m.title} (${m.stage})`).join('; ')}.</p>
      <div ref={host} className="relative mt-10">
        {node}
        {/* anotação do pico, à esquerda da barra */}
        <div className="pointer-events-none absolute top-0 text-right" style={{ right: `calc(100% - ${x(peakDay)} + 12px)` }}>
          <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-lava">Pico do mês · {dd(peakDay)}</p>
          <p className="mt-0.5 text-[13px] font-semibold text-ink">{peak} atualizações</p>
          <p className="text-[12px] text-muted">{peakConnectors} conectores Lakeflow Connect</p>
        </div>
        <div className="flex h-52 items-end gap-[4px] pt-16">
          {days.map((d) => {
            const n = perDay[d].length
            const names = perDay[d].slice(0, 4).map((i) => i.short).join(' · ')
            return (
              <div key={d} className="flex h-full flex-1 items-end">
                <span
                  {...bind(n ? `${dd(d)} — ${n} ${n === 1 ? 'atualização' : 'atualizações'}: ${names}${n > 4 ? ` · +${n - 4}` : ''}` : `${dd(d)} — sem publicações`)}
                  className={`w-full outline-none ${n ? `rounded-t-[2px] ${barTone(d, n)} hover:brightness-95` : 'h-px bg-transparent'}`}
                  style={n ? { height: `${(n / peak) * 100}%` } : undefined}
                />
              </div>
            )
          })}
        </div>

        {/* linha de base e semanas */}
        <div className="h-px bg-ink/45" />
        <div className="relative mt-2 h-4 font-mono text-[12px] text-muted">
          {[1, 8, 15, 22, 29].map((d) => (
            <span key={d} className={`absolute ${d === 1 ? '' : '-translate-x-1/2'}`} style={{ left: d === 1 ? 0 : x(d) }}>{dd(d)}</span>
          ))}
        </div>

        {/* marcos: fio vertical do eixo até o rótulo, em duas alturas para não colidir */}
        <div className="relative mt-3 h-[96px]">
          {MILESTONES.map((m) => {
            const shift = m.align === 'left' ? '-translate-x-[3px]' : m.align === 'right' ? '-translate-x-full' : '-translate-x-1/2'
            const text = m.align === 'right' ? 'text-right' : m.align === 'center' ? 'text-center' : 'text-left'
            return (
              <div key={m.d}>
                <span aria-hidden className="absolute top-0 w-px bg-[#FF9E94]" style={{ left: x(m.d), height: m.row ? 50 : 14 }} />
                <span aria-hidden className="absolute size-[5px] -translate-x-[2px] rounded-full bg-lava" style={{ left: x(m.d), top: m.row ? 48 : 12 }} />
                <div className={`absolute w-max max-w-[150px] ${shift} ${text}`} style={{ left: x(m.d), top: m.row ? 60 : 24 }}>
                  <p className="font-mono text-[12px] tracking-[0.04em] text-muted">{dd(m.d)} · {m.stage}</p>
                  <p className="text-[13px] font-medium leading-[1.3] text-ink">{m.title}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── Cobertura por cloud ───────────────────────────────────────────────────────
// Logos oficiais: AWS (awsstatic), Azure (azure.microsoft.com), Google Cloud (gstatic). Ver assets/SOURCE.
const CLOUDS = [
  { name: 'AWS', src: awsLogo, h: 'h-6' },
  { name: 'Microsoft Azure', src: azureLogo, h: 'h-7' },
  { name: 'Google Cloud', src: gcpLogo, h: 'h-7' },
]
function CloudCoverage() {
  const inAll = items.filter((i) => i.clouds === 'AWS · Azure · GCP').length
  return (
    <div className="relative mt-20 grid items-center gap-8 pt-7 md:grid-cols-12">
      <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-line" />
      <div className="md:col-span-5">
        <h3 className="text-[18px] font-semibold tracking-[-0.01em]">Cobertura por cloud</h3>
        <p className="mt-1.5 text-[13px] leading-[1.5] text-muted">Presença nas release notes de cada cloud.</p>
      </div>
      <div className="flex flex-wrap items-center gap-x-8 gap-y-6 md:col-span-4">
        <div>
          <p className="num text-[34px] font-semibold leading-none tracking-[-0.03em]">{inAll}</p>
          <p className="mt-2.5 text-[13px] leading-[1.35] text-body">Nas três clouds</p>
        </div>
      </div>
      <ul className="flex flex-wrap items-center gap-x-7 gap-y-4 md:col-span-3 md:justify-end" aria-label="Clouds cobertas">
        {CLOUDS.map((c) => (
          <li key={c.name}>
            <img src={c.src} alt={c.name} className={`${c.h} w-auto`} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Landscape() {
  return (
    <section id="panorama" aria-labelledby="panorama-titulo" className="py-16 md:py-24">
      <SectionHeader
        id="panorama"
        index={sectionIndex('panorama')}
        title="Maturidade dos releases do mês"
        kicker="21 releases em GA e 30 em Beta."
      />
      <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
        <Maturity />
        <Cadence />
      </div>
      <CloudCoverage />
    </section>
  )
}
