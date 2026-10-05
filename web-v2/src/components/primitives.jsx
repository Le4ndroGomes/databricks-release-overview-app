import { useEffect, useId, useRef, useState } from 'react'
import { stageLabel } from '../content.js'

// ── Estágio ───────────────────────────────────────────────────────────────────
// Cor da rampa ordinal + forma + texto: GA sólido, Public Preview sólido teal, Beta tracejado,
// Não divulgado pontilhado, Outro evento neutro. Nunca depende só de cor.
const CHIP = {
  GA: 'bg-ga text-white shadow-[inset_0_0_0_1px_var(--color-ga)]',
  'Public Preview': 'bg-pupr text-white shadow-[inset_0_0_0_1px_var(--color-pupr)]',
  Beta: 'bg-[#F2F6F7] text-ink border border-dashed border-pupr',
  'Não informado': 'bg-white text-body border border-dotted border-muted',
  'N/A': 'bg-oat-2 text-body',
}
const CHIP_DARK = {
  GA: 'bg-white text-ink',
  Beta: 'bg-transparent text-white border border-dashed border-white/70',
}

export function StageChip({ stage, dark = false, size = 'md' }) {
  const cls = (dark && CHIP_DARK[stage]) || CHIP[stage]
  const dim = size === 'sm' ? 'h-[20px] px-[7px] text-[11px]' : 'h-[22px] px-2 text-[11.5px]'
  return (
    <span className={`inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-[4px] font-mono font-medium uppercase leading-none tracking-[0.06em] ${dim} ${cls}`}>
      {stageLabel[stage]}
    </span>
  )
}

export const SWATCH = {
  GA: 'bg-ga',
  'Public Preview': 'bg-pupr',
  Beta: 'bg-beta',
  'Não informado': 'hatch',
  'N/A': 'bg-na ring-1 ring-inset ring-line-strong',
}
export const ABBR = { GA: 'GA', 'Public Preview': 'PuPr', Beta: 'Beta', 'Não informado': 'N/D', 'N/A': '—' }

export function Swatch({ stage, className = 'size-2.5' }) {
  return <span aria-hidden className={`inline-block shrink-0 rounded-[2px] ${className} ${SWATCH[stage]}`} />
}

// ── Ícones oficiais do design system Databricks (DuBois) — ver src/icons/SOURCE.md ──
const ICONS = import.meta.glob('../icons/*.svg', { query: '?raw', import: 'default', eager: true })
export function Icon({ name, size = 16, className = '', label }) {
  const raw = ICONS[`../icons/${name}.svg`]
  const svg = raw
    .replace(/fill="#[0-9A-Fa-f]{6}"/g, 'fill="currentColor"')
    .replace(/width="16" height="16"/, `width="${size}" height="${size}"`)
  return (
    <span
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={`inline-flex shrink-0 [&>svg]:block ${className}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

// ── Tipografia editorial ─────────────────────────────────────────────────────
// Rótulos em sans (caixa alta leve); mono fica para datas, versões e identificadores.
export function Label({ children, className = '' }) {
  return <p className={`text-[12px] font-medium uppercase tracking-[0.12em] text-muted ${className}`}>{children}</p>
}

export function SectionHeader({ id, index, title, kicker, aside }) {
  const [num, label] = index.split(' — ')
  return (
    <header className="relative mb-12 grid gap-5 pt-7 md:mb-14 md:grid-cols-12 md:gap-x-8">
      <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-ink/20" />
      <span aria-hidden className="absolute left-0 top-0 h-px w-10 bg-ink" />
      <p className="flex items-baseline gap-3 text-[12px] uppercase tracking-[0.16em] md:col-span-3 md:pt-[12px]">
        <span className="font-mono font-medium tracking-[0.08em] text-lava">{num}</span>
        <span className="font-medium text-muted">{label}</span>
      </p>
      <div className="md:col-span-6">
        <h2 id={id ? `${id}-titulo` : undefined} tabIndex={id ? -1 : undefined} className="text-balance outline-none text-[clamp(1.75rem,1.2rem+1.6vw,2.5rem)] font-semibold leading-[1.1] tracking-[-0.025em]">
          {title}
        </h2>
        {kicker && <p className="mt-5 max-w-[34rem] text-pretty text-[17px] leading-[1.6] text-body">{kicker}</p>}
      </div>
      {aside && <div className="text-[13px] leading-[1.5] text-muted md:col-span-3 md:pt-[12px] md:text-right">{aside}</div>}
    </header>
  )
}

export function SourceLink({ href, children = 'Fonte oficial', dark = false, className = '' }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`text-[13px] font-medium underline underline-offset-4 ${dark ? 'text-white/80 decoration-white/30 hover:text-white' : 'text-body decoration-line-strong hover:text-ink'} ${className}`}
    >
      {children}
      <span aria-hidden> ↗</span>
      <span className="sr-only"> (abre em nova aba)</span>
    </a>
  )
}

// ── Detalhes inline ──────────────────────────────────────────────────────────
// Botão com aria-expanded + painel com hidden; na impressão, o painel sempre aparece.
export function Disclosure({ label = 'Ver detalhes', openLabel = 'Ocultar detalhes', dark = false, printExpand = true, children, className = '' }) {
  const [open, setOpen] = useState(false)
  const panel = useId()
  return (
    <div className={`${className} ${printExpand ? '' : 'print:hidden'}`}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panel}
        onClick={() => setOpen((v) => !v)}
        data-print-hide
        className={`group inline-flex min-h-[44px] items-center gap-2 text-[14px] font-medium print:hidden ${dark ? 'text-white' : 'text-ink'}`}
      >
        <span className="underline decoration-current/30 decoration-1 underline-offset-4 group-hover:decoration-lava">{open ? openLabel : label}</span>
        <span aria-hidden className={`inline-block text-[12px] transition-transform duration-150 motion-reduce:transition-none ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>
      <div id={panel} hidden={!open} {...(printExpand ? { 'data-print-expand': '' } : {})}>
        {children}
      </div>
    </div>
  )
}

// ── Tooltip ──────────────────────────────────────────────────────────────────
// Abre com hover, foco de teclado e toque (toque alterna); Esc fecha. O conteúdo também existe em texto.
export function useTooltip() {
  const [tip, setTip] = useState(null)
  const host = useRef(null)
  useEffect(() => {
    if (!tip) return
    const onKey = (e) => e.key === 'Escape' && setTip(null)
    const onDown = (e) => host.current && !host.current.contains(e.target) && setTip(null)
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onDown)
    }
  }, [tip])
  const place = (el, content) => setTip({ content, x: el.offsetLeft + el.offsetWidth / 2 })
  const bind = (content) => ({
    onMouseEnter: (e) => place(e.currentTarget, content),
    onMouseLeave: () => setTip(null),
    onFocus: (e) => place(e.currentTarget, content),
    onBlur: () => setTip(null),
    onClick: (e) => (tip?.content === content ? setTip(null) : place(e.currentTarget, content)),
    tabIndex: 0,
    role: 'img',
    'aria-label': content,
  })
  const width = host.current?.offsetWidth ?? 600
  const node = tip && (
    <div
      role="tooltip"
      className="pointer-events-none absolute bottom-full z-20 mb-3 w-max max-w-[min(300px,80vw)] -translate-x-1/2 rounded-[8px] bg-ink px-3 py-2 text-[13px] leading-[1.45] text-white shadow-[0_8px_24px_rgba(11,32,38,0.18)]"
      style={{ left: Math.min(Math.max(120, tip.x), width - 120) }}
    >
      {tip.content}
    </div>
  )
  return { bind, node, host }
}
