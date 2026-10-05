import { useEffect, useState } from 'react'
import { sections } from '../content.js'
import logoUrl from '../assets/databricks-logo.svg?url'

// Navegação persistente: indica a seção ativa pela posição de leitura (linha a 30% da janela).
export function useActiveSection() {
  const [active, setActive] = useState('')
  useEffect(() => {
    let frame = 0
    const compute = () => {
      frame = 0
      const line = window.innerHeight * 0.3
      let current = ''
      for (const s of sections) {
        const el = document.getElementById(s.id)
        if (el && el.getBoundingClientRect().top - line <= 0) current = s.id
      }
      setActive(current)
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(compute) }
    compute()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])
  return active
}

export function Nav() {
  const active = useActiveSection()
  const go = (id) => {
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
    history.replaceState(null, '', `#${id}`)
    el.querySelector('h2')?.focus({ preventScroll: true })
  }
  return (
    <div className="sticky top-0 z-40 border-b border-line bg-white print:hidden">
      <div className="mx-auto flex h-[60px] max-w-[1280px] items-center justify-between gap-4 px-6 sm:gap-6 md:px-10 lg:px-12">
        {/* Marca de publicação: apenas o logo oficial (SVG, proporção preservada). O período fica no eyebrow do hero. */}
        <a href="#topo" aria-label="Databricks · início" className="flex shrink-0 items-center no-underline">
          <img src={logoUrl} alt="Databricks" className="h-[18px] w-auto sm:h-[21px]" />
        </a>

        <nav aria-label="Seções" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {sections.map((s) => {
              const on = active === s.id
              return (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    aria-current={on ? 'location' : undefined}
                    className={`group inline-flex h-[60px] items-center px-3 text-[14px] no-underline transition-[color,transform] duration-200 ease-out motion-reduce:transition-none ${on ? 'font-medium text-ink' : 'text-body hover:-translate-y-px hover:text-ink'}`}
                  >
                    {/* Sublinhado fino em lava, ~7px abaixo do texto: cresce da esquerda no hover/foco; fixo no item ativo. */}
                    <span className="relative">
                      {s.nav}
                      <span
                        aria-hidden
                        className={`absolute -bottom-[7px] left-0 h-[2px] w-full origin-left bg-lava transition-transform duration-200 ease-out motion-reduce:transition-none motion-reduce:duration-0 ${on ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100'}`}
                      />
                    </span>
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        <label className="flex items-center gap-2 lg:hidden">
          <span className="whitespace-nowrap text-[13px] text-muted">Nesta edição</span>
          <select
            name="secao"
            value={active}
            onChange={(e) => e.target.value && go(e.target.value)}
            className="h-11 max-w-[48vw] rounded-[10px] border border-line-strong bg-white px-3 text-[14px] text-ink"
          >
            <option value="">Abertura</option>
            {sections.map((s) => (
              <option key={s.id} value={s.id}>{`${s.n} · ${s.nav}`}</option>
            ))}
          </select>
        </label>
      </div>
    </div>
  )
}
