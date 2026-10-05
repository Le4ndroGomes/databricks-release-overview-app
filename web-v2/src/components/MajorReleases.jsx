import { majors, sectionIndex } from '../content.js'
import { Disclosure, Icon, Label, SectionHeader, SourceLink, StageChip } from './primitives.jsx'
import databricksMark from '../assets/databricks-mark.svg?url'

// Spotlight editorial do ai_decide(): visual (2 col) + anotação editorial com fonte oficial (1 col).
// Visual = "produto"; painel direito = "o que é + fonte". Empilha no mobile.
function AiDecideSpotlight() {
  const chip = 'inline-flex items-center rounded-[8px] border px-3.5 py-2 font-mono text-[14px] font-medium'
  return (
    <div className="mt-5 grid items-stretch gap-5 lg:grid-cols-3">
      {/* Visual — 2 colunas. Numerado 06 (6º destaque), como os cards acima. */}
      <div className="relative flex flex-col break-inside-avoid rounded-[16px] border border-line bg-oat lg:col-span-2">
        <div className="flex items-center gap-3 px-6 pt-6 md:px-8">
          <span className="num font-mono text-[13px] font-medium text-lava">06</span>
          <span aria-hidden className="h-3 w-px bg-line-strong" />
          <StageChip stage="Beta" size="sm" />
        </div>
        <div className="flex flex-1 flex-col items-center justify-center px-6 pb-12 pt-8 text-center md:pb-14">
        <img src={databricksMark} alt="" aria-hidden width={37} height={40} className="h-10 w-auto" />
        <p className="mt-6 text-[12px] font-medium uppercase tracking-[0.2em] text-muted">The AI judge that never writes a word</p>
        <p className="mt-4 font-mono text-[clamp(2rem,1.4rem+2.4vw,3.25rem)] font-semibold tracking-[-0.02em] text-ink">ai_decide()</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <span className={`${chip} border-line-strong bg-white text-ink`}>ai_query draft</span>
          <span aria-hidden className="text-[18px] text-muted">→</span>
          <span className={`${chip} border-[#CDE6D6] bg-[#EAF4EE] text-[#2E7D52]`}>SEND</span>
          <span className={`${chip} border-[#E8DCBE] bg-[#F6F0E2] text-[#9A7B2E]`}>REWRITE</span>
          <span className={`${chip} border-[#F3D4CC] bg-[#FBEBE8] text-[#C62F1E]`}>HOLD</span>
        </div>
        </div>
      </div>

      {/* Anotação editorial — 1 coluna */}
      <div className="flex break-inside-avoid flex-col rounded-[16px] border border-line bg-white p-7 md:p-8">
        <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-muted">AI Function · <span className="text-lava">Beta</span></p>
        <h3 className="mt-3 font-mono text-[22px] font-semibold tracking-[-0.01em] text-ink">ai_decide()</h3>
        <p className="mt-3 text-[15px] leading-[1.6] text-body">Avalia texto ou dados estruturados com base em critérios definidos e retorna uma decisão estruturada — probabilidade, escolha ou score — pronta para uso em SQL ou aplicações.</p>
        <p className="mt-5 text-[12px] font-medium uppercase tracking-[0.12em] text-muted">Bom para</p>
        <p className="mt-1.5 text-[15px] leading-[1.55] text-body">Roteamento, triagem, priorização e decisões baseadas em regras.</p>
        <code className="mt-5 block max-w-full overflow-x-auto whitespace-nowrap rounded-[6px] border border-line bg-oat px-2.5 py-1.5 font-mono text-[12.5px] text-ink">ai_decide(state, questions [, options])</code>
        <div className="mt-auto flex flex-wrap gap-x-5 gap-y-1 pt-6 text-[13px]">
          <SourceLink href="https://docs.databricks.com/gcp/en/sql/language-manual/functions/ai_decide">Documentação oficial</SourceLink>
          <SourceLink href="https://docs.databricks.com/api/ai-functions/v1/ai-decide">API REST</SourceLink>
        </div>
      </div>
    </div>
  )
}

// Ícones oficiais (DuBois) por lançamento; usados só onde há relação direta com o produto.
const ICON = {
  gateway: { name: 'PlugIcon', label: 'Unity Gateway · API e integração' },
  abac: { name: 'ShieldCheckIcon', label: 'Governança' },
  sharing: { name: 'CatalogSharedIcon', label: 'Sharing' },
  memory: { name: 'LakebaseIcon', label: 'Lakebase' },
}

function Meta({ m, i, dark }) {
  return (
    <div className="flex items-center gap-3">
      <span className="num w-5 font-mono text-[13px] font-medium text-lava">{String(i + 1).padStart(2, '0')}</span>
      <StageChip stage={m.stage} dark={dark} />
      <span aria-hidden className={`h-3 w-px ${dark ? 'bg-white/25' : 'bg-line-strong'}`} />
      <span className={`font-mono text-[12.5px] ${dark ? 'text-white/65' : 'text-muted'}`}>{m.date}</span>
    </div>
  )
}

function Why({ m, dark }) {
  return (
    <div className={`mt-7 border-t pt-5 ${dark ? 'border-white/15' : 'border-line'}`}>
      <Label className={dark ? '!text-white/60' : ''}>Por que importa</Label>
      <p className={`mt-2 text-pretty text-[17px] leading-[1.6] ${dark ? 'text-white/90' : 'text-ink'}`}>{m.why}</p>
    </div>
  )
}

// Condição decisiva sempre visível: prazo ou restrição que pode mudar a adoção.
function Decisive({ m, dark }) {
  return (
    <p className={`mt-5 flex items-start gap-2.5 text-[14px] leading-[1.5] ${dark ? 'text-white' : 'text-ink'}`}>
      <span aria-hidden className="mt-[0.55em] size-[6px] shrink-0 rounded-full bg-lava" />
      <span>
        <span className="sr-only">Condição decisiva: </span>
        {m.decisive}
      </span>
    </p>
  )
}

function DetailList({ title, list, dark }) {
  return (
    <div>
      <Label className={dark ? '!text-white/60' : ''}>{title}</Label>
      <ul className={`mt-2 space-y-1.5 text-[15px] leading-[1.55] ${dark ? 'text-white/85' : 'text-body'}`}>
        {list.map((x) => (
          <li key={x} className="flex gap-2.5">
            <span aria-hidden className={`mt-[0.75em] h-px w-2.5 shrink-0 ${dark ? 'bg-white/40' : 'bg-line-strong'}`} />
            {x}
          </li>
        ))}
      </ul>
    </div>
  )
}

function Details({ m, dark }) {
  const d = m.details
  return (
    <Disclosure dark={dark} className="mt-auto pt-6">
      <div className={`mt-3 space-y-5 border-t pt-5 ${dark ? 'border-white/15' : 'border-line'}`}>
        <div>
          <Label className={dark ? '!text-white/60' : ''}>Descrição técnica</Label>
          <p className={`mt-2 text-pretty text-[15px] leading-[1.6] ${dark ? 'text-white/85' : 'text-body'}`}>{d.tech}</p>
        </div>
        <DetailList title="Pré-requisitos" list={d.prereq} dark={dark} />
        <DetailList title="Restrições" list={d.restrictions} dark={dark} />
        <div>
          <Label className={dark ? '!text-white/60' : ''}>Clouds</Label>
          <p className={`mt-2 text-[15px] ${dark ? 'text-white/85' : 'text-body'}`}>{m.clouds}</p>
        </div>
        <div>
          <Label className={dark ? '!text-white/60' : ''}>Fontes oficiais</Label>
          <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
            {d.sources.map(([t, u]) => (
              <li key={u}><SourceLink href={u} dark={dark}>{t}</SourceLink></li>
            ))}
          </ul>
        </div>
      </div>
    </Disclosure>
  )
}

// Destaque principal: Genie (SparkleIcon, "Genie assistant") conectado ao MCP (McpIcon, "tool server").
function GenieMcpMark() {
  return (
    <div className="flex items-center gap-3 text-white" role="img" aria-label="Genie conectado via MCP">
      <Icon name="SparkleIcon" size={22} />
      <span aria-hidden className="h-px w-8 bg-white/30" />
      <Icon name="McpIcon" size={18} className="text-white/65" />
    </div>
  )
}

function Feature({ m }) {
  return (
    <article aria-labelledby={`major-${m.id}`} className="flex break-inside-avoid flex-col rounded-[16px] bg-ink p-7 text-white md:p-10 lg:col-span-7">
      <div className="flex items-center justify-between gap-6">
        <Meta m={m} i={0} dark />
        <GenieMcpMark />
      </div>
      <h3 id={`major-${m.id}`} className="mt-10 text-[clamp(2rem,1.4rem+2vw,3.25rem)] font-semibold leading-[1.04] tracking-[-0.032em]">{m.title}</h3>
      <p className="mt-5 max-w-[540px] text-pretty text-[clamp(1.25rem,1.1rem+0.5vw,1.5rem)] leading-[1.4] tracking-[-0.01em] text-white">{m.lede}</p>
      <Decisive m={m} dark />
      <Why m={m} dark />
      <Details m={m} dark />
    </article>
  )
}

function Major({ m, i, className = '' }) {
  const icon = ICON[m.id]
  return (
    <article aria-labelledby={`major-${m.id}`} className={`flex break-inside-avoid flex-col rounded-[16px] border border-line bg-white p-7 md:p-8 ${className}`}>
      <div className="flex items-center justify-between gap-4">
        <Meta m={m} i={i} />
        {icon && <Icon name={icon.name} size={16} label={icon.label} className="text-ink/60" />}
      </div>
      <h3 id={`major-${m.id}`} className="mt-8 text-balance text-[clamp(1.375rem,1.2rem+0.5vw,1.625rem)] font-semibold leading-[1.15] tracking-[-0.022em]">{m.title}</h3>
      <p className="mt-3.5 text-pretty text-[17px] font-medium leading-[1.45] tracking-[-0.005em] text-ink">{m.lede}</p>
      <Decisive m={m} />
      <Why m={m} />
      <Details m={m} />
    </article>
  )
}

export function MajorReleases() {
  const [first, ...rest] = majors
  return (
    <section id="destaques" aria-labelledby="destaques-titulo" className="py-16 md:py-24">
      <SectionHeader
        id="destaques"
        index={sectionIndex('destaques')}
        title="Releases que merecem atenção"
        kicker="Selecionados por impacto técnico, maturidade e relevância para arquitetura, dados e IA."
        aside="3 em GA · 2 em Beta"
      />
      <div data-print-stack className="grid items-start gap-5 lg:grid-cols-12">
        <Feature m={first} />
        <Major m={rest[0]} i={1} className="lg:col-span-5" />
        <Major m={rest[1]} i={2} className="lg:col-span-4" />
        <Major m={rest[2]} i={3} className="lg:col-span-4" />
        <Major m={rest[3]} i={4} className="lg:col-span-4" />
      </div>
      <AiDecideSpotlight />
    </section>
  )
}
