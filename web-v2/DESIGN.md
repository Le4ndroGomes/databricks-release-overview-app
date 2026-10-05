# Release Overview · Setembro 2026 — especificação de design

Página executiva de lançamentos da Databricks, em português, com identidade Databricks em fundo branco.
O objetivo é que, em 5 a 10 segundos, o leitor saiba **quanto** foi lançado, **onde**, **o que importa**,
**o que mudou estrategicamente** e **por que isso importa**.

Fonte dos fatos: `src/data/releases.json`, gerado por `build/export_web.py` a partir do inventário verificado
(`build/inventory.py` → `inventario-setembro-2026.md`). A página não contém fatos que não estejam no inventário.

---

## 1. Análise de hierarquia (antes do layout)

Os 95 itens não têm o mesmo peso. Critérios: alcance (quantos clientes e workloads tocam), maturidade
(GA > Public Preview > Beta), efeito em governança e adoção de IA, e se o item muda uma decisão de arquitetura.

| Nível | Itens | Tratamento visual |
|---|---|---|
| **Primário** (5) | Genie One MCP server (GA) · Unity Gateway API e developer tools (GA) · ABAC para metastore, views, DENY e time travel (Beta) · OpenSharing para dados federados e metric views (GA) · Managed agent memory e sessions (Beta) | Seção 02. O nº 01 tem um bloco escuro de 7 colunas e título de 52 px; os demais ficam em cards brancos com título de 26 px. |
| **Secundário** (8) | Um destaque por domínio que não repete os primários: Auto CDF · ai_decide · Tags em ativos · Excel Add-in · CLI ug · Horizontal scaling para Apps · Query history · HITRUST e IRAP | Seção 01, uma linha editorial por domínio (chip + nome + uma frase). |
| **Apoio** (82) | Todo o restante | Seção 06, índice compacto de 13,5 px. Conectores (10), modelos (9) e retiradas (3) aparecem agrupados em uma linha cada. |
| **Ação** (4) | Prazos de 30/10, 31/10 e 01/11, mais as mudanças de comportamento | Seção 05, com a data como numeral grande. Fica fora da hierarquia de "importância" porque exige um dono. |

Rebaixados de propósito: as 9 disponibilizações de modelos (a fonte não informa estágio e o volume distorceria
o domínio de IA), manutenções e versões de driver.

---

## 2. Arquitetura da página e posicionamento

Grade de 12 colunas, largura máxima de 1280 px.

```
┌───────────────────────────────────────────────────────────────────────┐
│ TopBar   Databricks / Release Overview              Setembro · clouds │
├───────────────────────────────────────────────────────────────────────┤
│ HERO   eyebrow ─ título 76 px (3 linhas editoriais) ─ apoio (700 px)   │
│        ┌──────┬──────┬──────┬──────┐                                  │
│        │  95  │  21  │  30  │  8   │  ← KPIs: Total · GA · Beta ·     │
│        └──────┴──────┴──────┴──────┘     Domínios (grade de 4)        │
│        Domínios com mais atualizações │ 20 │ 18 │ 14  (mesma grade)   │
├─ primeira dobra (1440×900) termina aqui ─────────────────────────────────┤
│ 01 O MÊS EM UMA VISÃO      8 domínios × [nº · barra de maturidade ·   │
│                            destaque · impacto]   (2 colunas, ordem ↓) │
├───────────────────────────────────────────────────────────────────────┤
│ 02 LANÇAMENTOS PRINCIPAIS  ┌──────────── 7 ────────────┐┌──── 5 ────┐ │
│                            │ 01 Genie One MCP (escuro) ││ 02 Gateway│ │
│                            └───────────────────────────┘└───────────┘ │
│                            ┌─── 4 ───┐┌─── 4 ───┐┌─── 4 ───┐          │
│                            │ 03 ABAC ││ 04 Shar.││ 05 Mem. │          │
├───────────────────────────────────────────────────────────────────────┤
│ 03 PANORAMA   [Maturidade: 21 GA · 30 Beta · 5 PuPr + régua de 95]    │
│               [Cadência: 30 colunas, pico anotado, marcos com fios]   │
│               Cobertura por cloud: 80 · 3 · 3 · 3 · 1 · 1 · 4         │
├─ faixa oat de ponta a ponta ────────────────────────────────────────────┤
│ 04 O QUE MUDA NA PRÁTICA    01 · 02 · 03  /  04 · 05 (mais largos)    │
├───────────────────────────────────────────────────────────────────────┤
│ 05 REQUER AÇÃO              30/10 · 31/10 · 01/11 · Em vigor          │
├───────────────────────────────────────────────────────────────────────┤
│ 06 ÍNDICE COMPLETO          4 colunas × 2 linhas de domínios          │
│                             + anúncios corporativos (fora da contagem)│
├───────────────────────────────────────────────────────────────────────┤
│ Rodapé: fontes · data da pesquisa · link para o inventário            │
└───────────────────────────────────────────────────────────────────────┘
```

Responsivo: em telas abaixo de 1024 px, os primários ficam um por linha e o índice passa para 2 colunas.
Abaixo de 640 px, tudo vai para 1 coluna com rolagem natural; os KPIs ficam em 2 colunas.

---

## 3. Copy final por seção

Toda a redação está em `src/content.js`, no padrão **Feature → Meaning → Customer impact**:
- `title`: nome oficial do recurso
- `lede`: o que significa, em uma frase
- `body`: o que mudou
- `why`: o impacto para o cliente

| Seção | Título | Linha de apoio |
|---|---|---|
| Hero | Setembro expandiu a camada / de controle e governança / para agentes. (eyebrow: DATABRICKS RELEASE INTELLIGENCE · SETEMBRO 2026) | 95 atualizações em 8 domínios. Genie e Unity Gateway ampliaram contexto e governança para agentes, enquanto o Unity Catalog centralizou novos controles de acesso e proteção de dados. |
| 01 | Onde a inovação se concentrou | Domínios ordenados por volume; a barra mostra a maturidade. |
| 02 | Cinco mudanças que alteram decisões de arquitetura | Critérios de seleção explícitos. |
| 03 | A próxima onda está em Beta; 21 entregas já estão em GA | Quase um terço das atualizações está em Beta, sinalizando oportunidades de avaliação antecipada, enquanto 21 entregas já estão disponíveis em GA. |
| 04 | O que muda na operação de dados e IA (rótulo: O QUE MUDA NA PRÁTICA) | Cinco mudanças concretas, sustentadas pelos lançamentos deste mês. |
| 05 | Prazos e mudanças de comportamento | O que precisa de dono antes de 1º de novembro. |
| 06 | Todas as 95 atualizações | Por domínio, do mais maduro ao menos maduro. |

---

## 4. Escala tipográfica

Família: **DM Sans** (variável), a sans da marca Databricks, para títulos e texto, e **DM Mono** para rótulos,
datas e metadados. As fontes vão embutidas no build.

| Token | Desktop | Mobile | Peso | Tracking | Uso |
|---|---|---|---|---|---|
| Display | 76 / 1.03 | 38 / 1.04 | 600 | −0.035em | Título do hero |
| KPI lead | 88 / 1 | 72 / 1 | 600 | −0.04em | Total de atualizações |
| KPI | 64 / 1 | 56 / 1 | 600 | −0.04em | Estágios e domínios |
| Feature title | 52 / 1.05 | 36 | 600 | −0.03em | Lançamento nº 01 |
| H2 | 36 / 1.12 | 30 | 600 | −0.02em | Títulos de seção (`text-balance`) |
| Numeral de domínio | 56 / 1 | 44 | 600 | −0.04em | Contagem por domínio |
| H3 major | 26 / 1.15 | 24 | 600 | −0.02em | Lançamentos 02–05 |
| Lede | 24 (feature) · 17 | 21 · 17 | 400/500 | — | Frase de significado |
| H3 | 19 / 1.25 | 19 | 600 | −0.01em | Domínios, impactos |
| Body | 15–16 / 1.55 | 15–16 | 400 | — | Texto corrido |
| Small | 13–14 / 1.5 | 13 | 400 | — | Notas, metodologia |
| Label | 11–12 mono, uppercase | 11–12 | 500 | 0.12–0.16em | Eyebrows, "Por que importa" |
| Index | 13.5 / 1.4 · meta 10.5 mono | idem | 400 | — | Índice completo |

Numerais com `tabular-nums`. Títulos com `text-wrap: balance` e parágrafos com `text-wrap: pretty`.

---

## 5. Sistema de espaçamento

- Base de 4 px. Escala usada: 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 80.
- Container: `max-w-[1280px]`, padding lateral de 24 (mobile), 40 (tablet) e 48 (desktop).
- Seções: 64 px de padding vertical no mobile e 80 px no desktop. Cada seção abre com um fio de 1 px em ink.
- Cabeçalho de seção: índice em 3 colunas, título em 6, aside em 3; 40–48 px até o conteúdo.
- Grids: gap de 20 px nos lançamentos principais, 32 px nos impactos, 40 px no índice e 64 px entre as colunas de domínios.
- Ritmo interno dos cards: meta → 24–32 → título → 12 → lede → 8 → corpo → 24 → "Por que importa" → auto → rodapé.

---

## 6. Componentes

| Componente | Arquivo | Notas |
|---|---|---|
| `TopBar` | Hero.jsx | Marca em texto (sem copiar logotipo), período e clouds |
| `Hero` | Hero.jsx | Eyebrow com fio lava, display, apoio, KPIs, "Mais atividade", nota de método |
| `SectionHeader` | primitives.jsx | Índice lava em mono, H2 balanceado, kicker e aside |
| `StageChip` | primitives.jsx | Estágio por **cor + forma + texto**: GA sólido ink, Public Preview sólido teal, Beta tracejado, Private Preview pontilhado, Não informado pontilhado neutro, Sem estágio oat |
| `Swatch` | primitives.jsx | Amostra para legendas e índice, com hachura para "Não informado" |
| `DomainRow` (`DomainOverview`) | DomainOverview.jsx | Numeral, nome, meta, mini barra de maturidade (largura ∝ volume), destaque e nota |
| `Feature` / `Major` | MajorReleases.jsx | Bloco escuro dominante e cards brancos com fio de 1 px, sem sombra |
| `MaturityBar` | Landscape.jsx | Barra empilhada com 2 px de gap, legenda com contagens e tooltip |
| `Cadence` | Landscape.jsx | 30 colunas neutras, marcos em lava (ênfase) e tooltip com os itens do dia |
| `CloudCoverage` | Landscape.jsx | Linha de números, calculada a partir dos dados |
| `CustomerImpact` | Impact.jsx | 5 colunas em faixa oat de ponta a ponta, com a base de cada implicação |
| `Actions` | Impact.jsx | Data como numeral e link para a fonte |
| `ReleaseIndex` | ReleaseIndex.jsx | 8 listas com marcador de estágio, data, tag de cloud só quando há restrição e linhas agrupadas |
| `Footer` | ReleaseIndex.jsx | Fontes, metodologia e link para o inventário |
| `useTooltip` | primitives.jsx | Abre no hover e no foco do teclado; o conteúdo também está no índice |

As interações se limitam aos tooltips da paisagem, ao `title` com a descrição no índice e aos links para as fontes.

---

## 7. Uso de cor

| Papel | Token | Hex | Regra |
|---|---|---|---|
| Superfície | white / `oat` | #FFFFFF / #F9F7F4 | Branco dominante; oat só na faixa de impacto |
| Texto principal | `ink` | #0B2026 | Títulos, numerais e bloco escuro do lançamento 01 |
| Texto secundário | `body` | #44606B | 6,7:1 sobre branco |
| Metadados | `muted` | #5B7680 | 4,8:1 sobre branco (AA) |
| Fios | `line` / `line-strong` | #E4E9EB / #C9D4D8 | 1 px, sem sombras |
| **Acento único** | `lava` | #FF3621 | Fio do eyebrow, índices de seção, ponto final do título, marcos da cadência, sublinhado do link do inventário. Nunca em texto pequeno corrido |
| Maturidade · GA | `ga` | #0B2026 | Rampa **ordinal** de um único matiz, validada com o script da skill dataviz (`--ordinal`, sobre branco e oat): monotônica, ΔL ≥ 0,06 e extremo claro a 2,46:1 |
| Maturidade · Public Preview | `pupr` | #3E7380 | |
| Maturidade · Beta | `beta` | #8CAAB4 | |
| Não informado | `ni` (hachura) | #C9D4D8 | Fora da rampa: textura em vez de matiz |
| Sem estágio | `na` | #EEEDE9 | Neutro oat com contorno |

Sem gradientes, sombras de card, glassmorphism ou neon. O estágio nunca depende só de cor: há sempre texto
(GA, PuPr, Beta…) e forma (sólido, tracejado, pontilhado, hachura).

---

## 8. Build e exportação

```bash
cd web
npm install
npm run dev       # desenvolvimento
npm run build     # dist/index.html — arquivo único com JS, CSS e fontes embutidos

# dados (depois de alterar o inventário)
python3 ../build/export_web.py

# PDF de página única no layout desktop (DevTools Protocol, papel de 15 in de largura)
PAPER_W=15 PAPER_H=95.4 node ../build/print_pdf.mjs "file://$PWD/dist/index.html" ../release-overview-2026-09.pdf
```

O PDF é exportado via `Page.printToPDF` com tamanho de papel explícito. Usar `@page size` faz o Chrome
avaliar as media queries em ~768 px e imprimir o layout de tablet.

---

## 9. Refinamento editorial (rodada 2)

**Sistema de linhas — estrutura silenciosa**
- Abertura de seção: régua de 1 px em `ink/20` na largura total, com um segmento de 40 px em `ink` sobre o início. O numeral fica em lava e o rótulo em mono 11 px com tracking de 0,22em, peso regular.
- Blocos de domínio: hairline `line` no topo de cada bloco e fechamento no último par. Nada de caixas.
- Cards dos lançamentos principais: contorno de 1 px em `line` (mais claro que antes) e raio de 4 px. O divisor de "Por que importa" segue o mesmo tom.
- Barras e réguas: segmentos de 6 px (domínios) ou 12 px (maturidade) sobre um trilho de 1 px. O comprimento lê volume e o trilho lê a escala total.

**Hero.** Período no topo (eyebrow + metadata discreta `01–30 SET 2026` na barra superior) → movimento estratégico
(título) → dimensão (95) → maturidade (21 GA · 30 Beta) → áreas. KPIs e "domínios com mais atualizações"
compartilham a mesma grade de 4 colunas, então os números alinham verticalmente. O texto metodológico saiu.

**Seção 01.** Hierarquia interna em 7 níveis: número-âncora (60 px, peso 500, topo das cifras alinhado às
maiúsculas do nome) → nome (20 px, 600) → escopo (13,5 px, muted) → régua + contagem de GA → chip + destaque
(15,5 px, 600) → descrição (15 px, máx. 46ch) → observação precedida de um fio de 12 px.

**Chips.** Altura fixa (18/20 px), mono 9,5–10 px, tracking de 0,12em e raio de 2 px.
GA e Public Preview são sólidos; Beta é tracejado; "Não divulgado" é pontilhado.

**Ícones oficiais (seção 02).** Do design system Databricks DuBois (`@databricks/design-system` 2.0.14, ISC),
SVG sem alteração, em `currentColor` (ver `src/icons/SOURCE.md`):
- **01 Genie One MCP:** `SparkleIcon` ("Genie assistant", 22 px, branco) ligado por um fio de 32 px ao `McpIcon` ("MCP, tool server", 18 px, branco a 65%).
- **02 Unity Gateway:** `PlugIcon` ("API, integration").
- **03 ABAC:** `ShieldCheckIcon` ("Governed").
- **04 OpenSharing:** `CatalogSharedIcon` ("Delta Sharing").
- **05 Agent memory:** `LakebaseIcon`.

Os ícones dos cards claros têm 16 px, em `ink/55` e alinhados à direita da linha de meta. Não há ícone fora da seção 02.

**Taxonomia (seção 03).**
- A régua de maturidade mostra apenas estágios de release (21 GA · 5 Public Preview · 30 Beta) sobre a escala do mês (95).
- Os 39 itens restantes aparecem como trilho, com uma chave discreta.
- Em camada secundária:
  - **Estágio não divulgado (29):** a fonte não informa a maturidade.
  - **Outros eventos (10):** retiradas, mudanças de comportamento e manutenções.
- Private Preview saiu da página. Os rótulos globais passaram a ser "Não divulgado" (N/D) e "Outro evento" (—).

**Cadência — hierarquia de cor**

| Papel | Cor |
|---|---|
| Dia comum | #DCE3E5 |
| Acima de 1,5× a média | #9DB0B7 |
| Marco | soft lava #FF9E94 |
| Pico do mês | lava #FF3621 |

- O pico tem anotação ("Pico do mês · 28/09 · 10 atualizações · 6 conectores Lakeflow Connect").
- Os marcos ligam o eixo ao rótulo com fios verticais em duas alturas, para não colidir.
- A linha de base fica em `ink/45`.
- "Cloud não identificada" substitui "Não informado" na cobertura por cloud.

## 10. Seção 04 — O que muda na prática (rodada 3)

Resultado primeiro, evidência depois. A sequência é produção → governança → proteção → economia → simplificação.
- **Composição:** 3 + 2 na grade de 12 colunas (4/4/4 e depois 6/6). Em telas largas, cada resultado usa `grid-rows-subgrid`, então número, manchete, texto e chips alinham entre colunas mesmo quando uma manchete tem 3 linhas.
- **Âncora:** numeral em mono lava, fio de 24 px em `ink/20` e ícone oficial de 20 px em `ink/80`. As réguas longas por coluna saíram.
- **Ícones** (DuBois, ver `src/icons/SOURCE.md`):

  | Resultado | Ícone |
  |---|---|
  | 01 | `SparkleDoubleIcon` |
  | 02 | `ShieldIcon` |
  | 03 | `LockIcon` |
  | 04 | `DollarIcon` |
  | 05 | `ShareNodesIcon` |

- **Tipografia:**
  - manchete: 26 px, peso 600, `text-balance`;
  - texto: 15,5 px, entrelinha 1,7, máx. 40ch;
  - capacidades: chips mono de 10 px em caixa alta, com altura de 24 px, borda `ink/12` e fundo branco a 60%. Os chips não têm hover, para não parecer botões.
- **Seção 03:** o rótulo passou a "03 — PANORAMA DOS LANÇAMENTOS". O conteúdo não mudou.
