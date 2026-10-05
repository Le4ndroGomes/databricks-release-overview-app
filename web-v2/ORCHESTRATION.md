# Release Overview v2 — contrato de orquestração (5 agentes em paralelo)

Projeto: `~/Documents/Databricks-Monthly-Brief-2026-09/web-v2/` (React 19 + Vite 8 + Tailwind 4 + vite-plugin-singlefile).
Origem: cópia de `web/` (a v1 publicada é `../release-overview-2026-09.html`; NÃO tocar em `web/` nem na v1).
Entrega final (feita pelo orquestrador): `../release-overview-2026-09-v2.html` + `../release-overview-2026-09-v2.pdf`.

Uma passada anterior já começou a v2 em `src/` (nova ordem, headline, Nav, Disclosure, busca no índice).
Seu trabalho é **auditar contra a especificação, completar e refinar** — não recomeçar do zero.

## Estrutura editorial (ids estáveis — não renomear)
Abertura `#topo` · 01 `#destaques` · 02 `#impacto` · 03 `#acoes` · 04 `#panorama` · 05 `#dominios`
(cada domínio: `#dominio-<id>`) · 06 `#modelos` · 07 `#indice` · rodapé `#fontes`.
Fonte da numeração: `sections` em `src/content.js` + `sectionIndex(id)`.

## Propriedade dos arquivos (edite SOMENTE os seus)
| Agente | Arquivos próprios |
|---|---|
| A · Pesquisa de modelos | `src/data/models.json`, `../research/v2/**` |
| B · Logos + timeline | `src/logos/**`, `src/components/Models.jsx` (fixture temporária permitida: `src/data/models.fixture.json`, apagar ao final) |
| C · Shell + sistema visual + impressão | `src/App.jsx`, `src/main.jsx`, `index.html`, `src/index.css`, `src/components/Nav.jsx`, `src/components/Hero.jsx`, `src/components/primitives.jsx`; em `content.js`: `period`, `hero`, `sections`, `sectionIndex`, `stageOrder`, `stageLabel` |
| D · Seções 01–03 | `src/components/MajorReleases.jsx`, `src/components/Impact.jsx`; em `content.js`: `majors`, `impactsSection`, `impacts`, `actions` |
| E · Seções 04, 05, 07 + rodapé | `src/components/Landscape.jsx`, `src/components/DomainOverview.jsx`, `src/components/ReleaseIndex.jsx` (inclui `Footer`); em `content.js`: `domainHighlights` |

- `content.js` é compartilhado: use **apenas a ferramenta Edit** e só dentro dos seus blocos (nunca Write no arquivo inteiro). Se o Edit falhar por arquivo alterado, releia e repita.
- `src/data/releases.json` é **somente leitura** para todos (fonte verificada; 95 itens).
- Precisa de algo em arquivo alheio? Resolva localmente no seu componente e registre o pedido no relatório final.
- C deve manter compatíveis as assinaturas exportadas de `primitives.jsx` (`StageChip`, `Swatch`, `SWATCH`, `ABBR`, `Icon`, `Label`, `SectionHeader`, `SourceLink`, `Disclosure`, `useTooltip`). Novos exports são bem-vindos.

## Convenção de impressão (C implementa o CSS; D, E e B usam)
- Painel recolhível: `hidden={!open}` **+ atributo `data-print-expand`** → sempre visível na impressão.
- Controle sem utilidade no papel (botões de expandir, filtros, busca, nav): atributo **`data-print-hide`** (ou classe `print:hidden`).
- Atenção: o preflight do Tailwind 4 aplica `[hidden]{display:none !important}` na layer `base`; `print:!block` (layer utilities) pode perder. C precisa garantir a regra e validar em PDF.
- Cards: `break-inside-avoid`; títulos não podem ficar isolados no fim da página.

## Regras editoriais (todos)
- PT-BR. Contagens intocáveis: 95 atualizações · 21 GA · 30 Beta · 5 Public Preview · 29 estágio não divulgado · 10 sem estágio aplicável · 8 domínios · 5 anúncios corporativos fora da contagem.
- Distinguir GA, Beta, Public Preview, "Não divulgado" e "Outro evento". **Nunca** reintroduzir "Private Preview" como estágio.
- GA ≠ adequado a qualquer workload: manter condições de cloud, região, configuração e pré-requisitos.
- Não altere afirmações técnicas silenciosamente. Divergência → valide na fonte oficial e relate no relatório final (antes/depois/fonte).
- Nada de dados inventados, estimados ou "exemplos" publicados como reais.
- Visual: DM Sans, paleta Databricks, lava `#FF3621` seletivo, muito branco, sem glassmorphism, gradientes gratuitos, carrosséis, animações contínuas, contadores animados ou scroll hijacking. Transições curtas e `prefers-reduced-motion`.
- Tokens: texto de leitura 16–18 px, metadados 12–13 px, mono para datas/versões/identificadores, raios 12–16 px em cards principais, sombras só para elevação.

## Build e testes sem conflito
- Build isolado (nunca em `dist/`): `cd web-v2 && npx vite build --outDir /tmp/rv2-<letra> --emptyOutDir`
- Screenshot headless (perfil próprio, nunca `--dump-dom`, que trava):
  `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars --user-data-dir=/tmp/cdp-<letra> --window-size=1440,3000 --screenshot=/tmp/rv2-<letra>/s.png file:///tmp/rv2-<letra>/index.html`
- Para console/DOM/print: script Node via CDP no estilo de `../build/print_pdf.mjs`, com porta exclusiva (A 9341 · B 9342 · C 9343 · D 9344 · E 9345) e `--user-data-dir=/tmp/cdp-<letra>`; sempre `chrome.kill()` ao final.
- **Não use o MCP chrome-devtools** (navegador compartilhado; reservado à validação final do orquestrador).
- Se o build quebrar por arquivo de outro agente, aguarde ~1 min e tente de novo; não corrija o arquivo alheio.

## Schema de `src/data/models.json` (A escreve; B renderiza)
```jsonc
{
  "meta": {
    "consulted": "2026-10-03",                 // data de consulta das fontes
    "window": ["2026-09-01", "2026-09-30"],
    "selection": "…critério de seleção (PT-BR, 1–2 frases)…",
    "notes": ["…limitações de comparação, datas, exaustividade…"],
    "arrivalsNote": "…frase factual exibida se arrivals estiver vazio…" | null
  },
  "launches": [                                // lançamento ORIGINAL pelo fornecedor em setembro
    {
      "id": "kebab-case",
      "date": "2026-09-22",                    // data do lançamento original (ISO)
      "vendor": "Anthropic", "vendorKey": "anthropic",
      "model": "Claude Opus 5.5",              // nome e versão exatos
      "familyKey": "claude",                   // chave do logo da família (ou null)
      "access": "available" | "limited" | "announced",   // announced = anunciado sem acesso
      "accessNote": "…" | null,
      "summary": "…até duas frases…",
      "differentiator": { "axis": "Raciocínio|Programação|Multimodalidade|Eficiência|Contexto|Ferramentas", "text": "…" },
      "benchmarks": [                          // [] → UI mostra "Sem avaliação pública verificada"
        {
          "index": "Artificial Analysis Intelligence Index",
          "version": "v4.x" | null,
          "score": "58", "scale": "0–100" | "Elo" | "% de acerto",
          "config": "variante / reasoning effort" | null,
          "evaluator": "independent" | "vendor",
          "date": "2026-10-03", "dateKind": "evaluated" | "consulted",
          "rank": null | { "position": 1, "universe": "…", "date": "2026-10-03" },
          "url": "https://…"
        }
      ],
      "databricks": null | { "status": "…", "date": "2026-09-22", "clouds": "AWS · Azure · GCP", "url": "https://…" },
      "links": { "announcement": "https://…", "evaluation": "https://…" | null }
    }
  ],
  "arrivals": [ /* mesmo formato; lançados ANTES de setembro e disponibilizados no Databricks em setembro.
                   "date" = lançamento original; "databricks" obrigatório */ ]
}
```
Vocabulário de chaves de logo (`vendorKey`/`familyKey`): anthropic, claude, openai, google, gemini, deepseek, alibaba, qwen,
xai, grok, moonshot, kimi, zai, glm, mistral, meta, llama, microsoft, amazon, nvidia, cohere, ibm. Novas chaves são permitidas.
