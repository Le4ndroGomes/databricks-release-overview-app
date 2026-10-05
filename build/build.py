"""Gera o one-page HTML e o inventário Markdown a partir de inventory.py."""
import html
import pathlib

import inventory as inv

OUT = pathlib.Path(__file__).resolve().parent.parent
HTML_FILE = OUT / "databricks-monthly-brief-2026-09.html"
MD_FILE = OUT / "inventario-setembro-2026.md"
RESEARCH_DATE = "01/10/2026"

RN = inv.rn
HIGHLIGHTS = [
    dict(axis="Adoção de IA", name="Genie One MCP server", stage="GA",
         changed="O Genie vira MCP Service no Unity Gateway (system.ai.genie_one_mcp), acessível por clientes MCP como Claude, ChatGPT ou Cursor.",
         why="Agentes externos usam o contexto governado do Genie, com as permissões do Unity Catalog em cada requisição.",
         cloud="AWS · Azure · GCP · endpoint Beta sai em 31/10/2026",
         src=RN("The Genie One MCP server"), src_label="Fonte · 25/09"),
    dict(axis="Governança de IA", name="Unity Gateway API e ferramentas de desenvolvedor", stage="GA",
         changed="Model, provider e MCP services passam a ser geridos por API, Terraform, CLI e SDKs; a CLI ug chegou no mesmo mês.",
         why="Modelos e agentes de código viram infraestrutura versionada, com custo e rastreabilidade centralizados.",
         cloud="AWS · Azure · GCP · Bundles em Beta; ug sem estágio informado",
         src=RN("Unity Gateway API and developer tools"), src_label="Fonte · 16/09"),
    dict(axis="Adoção de IA", name="Managed agent memory e managed agent sessions", stage="Beta",
         changed="Stores sobre Lakebase guardam memória de longo prazo, com busca semântica, e o histórico de conversas de agentes de qualquer framework.",
         why="Agentes com estado vão à produção sem banco próprio; a Agent Bricks CLI (Beta) cobre do scaffold ao deploy.",
         cloud="AWS · Azure · GCP · na prévia, cobra-se a instância Lakebase",
         src=RN("Managed agent memory and sessions"), src_label="Fonte · 16/09"),
    dict(axis="Governança", name="ABAC: metastore, views, DENY e time travel", stage="Beta",
         changed="ABAC definido uma vez no metastore passa a cobrir views e time travel; políticas DENY prevalecem sobre qualquer grant.",
         why="Regras de proteção partem de um único ponto, com segregação de funções inclusive sobre donos de objetos.",
         cloud="AWS · Azure · GCP · DBR 19+; sem réplica no DR gerenciado",
         src=RN("Metastore-level ABAC policies"), src_label="Fonte · 08 a 29/09"),
    dict(axis="Arquitetura", name="OpenSharing de ativos federados e metric views", stage="GA", transition="Metric views: Beta 03/09 → GA 24/09",
         changed="Tabelas Delta e Iceberg federadas, esquemas e tabelas estrangeiros e metric views chegam a GA no OpenSharing.",
         why="Parceiros recebem dados e métricas sem pipelines de cópia, o que muda o desenho de integrações entre organizações.",
         cloud="AWS · Azure · GCP · esquemas estrangeiros materializam no provedor",
         src=RN("Sharing foreign Delta tables"), src_label="Fonte · 11 a 24/09"),
    dict(axis="Eficiência", name="Automatic change data feed", stage="GA",
         changed="Mudanças linha a linha são calculadas na consulta via row tracking, sem habilitar change data feed tabela a tabela (Delta e Iceberg v3).",
         why="Pipelines incrementais sem overhead de escrita; a Databricks informa MERGE e UPDATE cerca de 15% mais rápidos nessas tabelas.",
         cloud="AWS · Azure · GCP · DBR 19+ com row tracking",
         src=RN("Automatic change data feed"), src_label="Fonte · 01/09"),
    dict(axis="Eficiência", name="Query history system table e query tags", stage="GA",
         changed="system.query.history e query tags chegam a GA; a retenção de system tables (30 a 3.650 dias) entra em Beta.",
         why="Base oficial para atribuir custo de SQL por time ou projeto e auditar o uso no prazo exigido pelo compliance.",
         cloud="AWS · Azure · GCP · tags em SQL warehouses e Lakehouse//RT",
         src=RN("Query tags for SQL warehouses"), src_label="Fonte · 21 e 30/09"),
    dict(axis="Produtividade", name="Databricks Excel Add-in", stage="GA",
         changed="O Excel importa tabelas e views do Unity Catalog, executa SQL, monta pivot tables com Live query e grava dados de volta.",
         why="Áreas de negócio usam a ferramenta que já conhecem sobre dados governados, em vez de exportações sem controle.",
         cloud="AWS · Azure · GCP · writeback exige habilitação do admin",
         src=RN("The Databricks Excel Add-in"), src_label="Fonte · 10/09"),
]

ATTENTION = [
    dict(title="Prazos até 1º de novembro",
         body="<b>30/10</b>: retirada de Inkling, Kimi K2.7 e DeepSeek V4 Pro (0813, AWS). <b>31/10</b>: desligamento do endpoint Beta do Genie MCP. <b>01/11</b>: a configuração de partner-powered AI deixa de existir; até lá, ajuste só pela Settings API."),
    dict(title="Mudanças de comportamento",
         body="Secrets OAuth sem uso há 90 dias são excluídos. Excluir um pipeline UC preserva as tabelas (cascade=true para remover). Writeback de planilhas exige admin. Environment version 6 desativa o gateway Py4J do dbutils."),
    dict(title="Diferenças por cloud",
         body="<b>Azure</b>: HITRUST e IRAP em GA, com HIPAA, HITRUST e IRAP passando a exigir o compliance security profile; Inbound Private Link em GA; Private network gateway em Beta. <b>GCP</b>: SecureConnect em GA; Genie App Builder e External secrets não constam."),
]

SOURCES = [
    ("Release notes AWS", inv.BASE["aws"]),
    ("Azure", inv.BASE["azure"]),
    ("GCP", inv.BASE["gcp"]),
    ("Databricks SQL", inv.DBSQL),
    ("Blog", "https://www.databricks.com/blog"),
    ("Newsroom", "https://www.databricks.com/company/newsroom"),
]

STAGE_LABEL = {"GA": "GA", "Public Preview": "Public Preview", "Beta": "Beta",
               "Private Preview": "Private Preview", "Não informado": "Não informado", "N/A": "Sem estágio"}
STAGE_CLASS = {"GA": "ga", "Public Preview": "pupr", "Beta": "beta", "Private Preview": "prpr",
               "Não informado": "ni", "N/A": "na"}

e = html.escape


def badge(stage):
    return f'<span class="badge {STAGE_CLASS[stage]}">{e(STAGE_LABEL[stage])}</span>'


def build_html():
    st = inv.stats()
    total = st["total"]
    tiles = []
    for s in inv.STAGES:
        n = st["stages"][s]
        pct = round(100 * n / total)
        note = {"N/A": "retiradas, mudanças, manutenção",
                "Não informado": "fonte não explicita",
                "Private Preview": "nenhum público"}.get(s, f"{pct}% do total")
        tiles.append(f"""
      <div class="kpi" title="{e(STAGE_LABEL[s])}: {n} de {total} ({pct}%)">
        <div class="kpi-row"><span class="kpi-num">{n}</span>{badge(s)}</div>
        <div class="meter" role="img" aria-label="{pct}% do total"><span style="width:{max(pct, 0)}%"></span></div>
        <div class="kpi-note">{e(note)}</div>
      </div>""")

    cards = []
    for i, h in enumerate(HIGHLIGHTS, 1):
        trans = f'<p class="trans">{e(h["transition"])}</p>' if h.get("transition") else ""
        cards.append(f"""
    <article class="card">
      <header class="card-head">
        <span class="idx">{i:02d}</span><span class="axis">{e(h["axis"])}</span>{badge(h["stage"])}
      </header>
      <h3>{e(h["name"])}</h3>{trans}
      <div class="body">
        <p><span class="lbl">O que mudou</span>{e(h["changed"])}</p>
        <p><span class="lbl">Por que importa</span>{e(h["why"])}</p>
      </div>
      <footer class="card-foot">
        <p class="cloud">{e(h["cloud"])}</p>
        <a class="src" href="{e(h["src"])}">{e(h["src_label"])} ↗</a>
      </footer>
    </article>""")

    attention = "".join(f"""
      <div class="att">
        <span class="att-idx">{chr(65 + i)}</span>
        <div><h4>{e(a["title"])}</h4><p>{a["body"]}</p></div>
      </div>""" for i, a in enumerate(ATTENTION))

    sources = " · ".join(f'<a href="{e(u)}">{e(n)}</a>' for n, u in SOURCES)

    return f"""<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Databricks — Monthly Brief · Setembro 2026</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&display=swap" rel="stylesheet">
<style>
  :root {{
    --ink: #0B2026;
    --surface: #0F2830;
    --line: rgba(158, 183, 191, .22);
    --line-strong: rgba(158, 183, 191, .45);
    --text: #FFFFFF;
    --text-2: #C9D6DA;
    --text-3: #9EB7BF;
    --accent: #FF3621;
    --sans: "DM Sans", "Helvetica Neue", Arial, sans-serif;
    --mono: "DM Mono", "SFMono-Regular", Menlo, monospace;
  }}
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  html {{ background: var(--ink); -webkit-print-color-adjust: exact; print-color-adjust: exact; }}
  body {{ font-family: var(--sans); color: var(--text); background: var(--ink); font-size: 15px; line-height: 1.45;
          max-width: 1480px; margin: 0 auto; padding: 40px 48px 32px; -webkit-font-smoothing: antialiased; }}
  a {{ color: inherit; text-decoration: none; border-bottom: 1px solid var(--line-strong); }}
  a:hover {{ border-bottom-color: var(--accent); }}
  a:focus-visible {{ outline: 2px solid var(--accent); outline-offset: 2px; }}

  /* Cabeçalho */
  .top {{ display: grid; grid-template-columns: auto 1fr auto; gap: 16px 48px; align-items: end;
          padding-bottom: 22px; border-bottom: 1px solid var(--line-strong); }}
  .kicker {{ font-family: var(--mono); font-weight: 500; font-size: 13px; letter-spacing: .22em; color: var(--text-2);
             display: flex; align-items: center; gap: 12px; }}
  .kicker::before {{ content: ""; width: 28px; height: 3px; background: var(--accent); }}
  h1 {{ font-size: 56px; line-height: 1; font-weight: 700; letter-spacing: -.02em; margin-top: 14px; white-space: nowrap; }}
  .lead {{ font-size: 18px; line-height: 1.42; color: var(--text-2); max-width: 820px; }}
  .lead b {{ color: var(--text); font-weight: 500; }}
  .meta {{ font-family: var(--mono); font-size: 12px; line-height: 1.9; color: var(--text-3); text-align: right; white-space: nowrap; }}
  .meta b {{ color: var(--text); font-weight: 500; }}

  /* Faixa de indicadores */
  .kpis {{ display: grid; grid-template-columns: 1.4fr repeat(6, 1fr) 1.6fr; border-bottom: 1px solid var(--line); }}
  .grid > *, .attention > *, .top > * {{ min-width: 0; }}
  .body p, .cloud, .att p, .foot, .lead {{ overflow-wrap: break-word; }}
  .kpi, .kpi-hero, .kpi-side {{ padding: 16px 16px 14px; border-right: 1px solid var(--line); }}
  .kpi-side {{ border-right: 0; }}
  .kpi-hero {{ padding-left: 0; display: flex; gap: 14px; align-items: center; }}
  .kpi-hero .kpi-num {{ font-size: 52px; }}
  .kpi-row {{ display: flex; flex-direction: column; align-items: flex-start; gap: 8px; }}
  .kpi-num {{ font-size: 32px; font-weight: 700; line-height: 1; letter-spacing: -.02em; font-variant-numeric: tabular-nums; }}
  .kpi-label {{ font-size: 13px; color: var(--text-2); line-height: 1.35; }}
  .kpi-note {{ font-family: var(--mono); font-size: 11px; color: var(--text-3); margin-top: 6px; line-height: 1.35; }}
  .meter {{ height: 4px; background: rgba(158, 183, 191, .16); border-radius: 2px; margin-top: 10px; overflow: hidden; }}
  .meter span {{ display: block; height: 100%; background: var(--text-2); border-radius: 2px; }}
  .kpi-side {{ display: flex; flex-direction: column; gap: 6px; justify-content: center; padding-right: 0; }}
  .kpi-side div {{ display: flex; gap: 10px; align-items: baseline; font-size: 13px; color: var(--text-2); line-height: 1.3; }}
  .kpi-side b {{ font-size: 20px; color: var(--text); font-weight: 700; min-width: 16px; font-variant-numeric: tabular-nums; }}

  /* Badges: distintos por forma e texto, não só por cor */
  .badge {{ display: inline-block; font-family: var(--mono); font-size: 11px; font-weight: 500; letter-spacing: .08em;
            text-transform: uppercase; padding: 3px 7px 2px; border-radius: 3px; line-height: 1.3; white-space: nowrap; }}
  .badge.ga {{ background: var(--text); color: var(--ink); border: 1px solid var(--text); }}
  .badge.pupr {{ border: 1px solid var(--text); color: var(--text); }}
  .badge.beta {{ border: 1px dashed var(--text-2); color: var(--text); }}
  .badge.prpr {{ border: 1px dotted var(--text-2); color: var(--text); }}
  .badge.ni {{ color: var(--text-2); padding-left: 0; padding-right: 0; }}
  .badge.ni::before {{ content: "[ "; }} .badge.ni::after {{ content: " ]"; }}
  .badge.na {{ color: var(--text-3); padding-left: 0; padding-right: 0; }}
  .badge.na::before {{ content: "— "; }}

  /* Destaques */
  .section-title {{ display: flex; justify-content: space-between; align-items: baseline; gap: 16px; margin: 22px 0 12px; }}
  h2 {{ font-family: var(--mono); font-size: 13px; font-weight: 500; letter-spacing: .2em; text-transform: uppercase; color: var(--text-2); }}
  .section-title span {{ font-family: var(--mono); font-size: 11px; color: var(--text-3); }}
  .grid {{ display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }}
  .card {{ background: var(--surface); border: 1px solid var(--line); border-radius: 4px; padding: 16px 16px 14px;
           display: flex; flex-direction: column; }}
  .card-head {{ display: flex; gap: 10px; align-items: center; font-family: var(--mono); font-size: 11px;
                letter-spacing: .14em; text-transform: uppercase; color: var(--text-3); }}
  .card-head .badge {{ margin-left: auto; }}
  .idx {{ color: var(--accent); font-weight: 500; }}
  .card h3 {{ font-size: 18px; line-height: 1.22; font-weight: 700; margin: 10px 0 10px; letter-spacing: -.005em; }}
  .trans {{ font-family: var(--mono); font-size: 11px; color: var(--text); border-left: 2px solid var(--text-2);
            padding-left: 8px; margin: -4px 0 10px; }}
  .body {{ flex: 1; }}
  .body p {{ font-size: 13.5px; line-height: 1.45; color: var(--text-2); margin-bottom: 10px; }}
  .lbl {{ display: block; font-family: var(--mono); font-size: 10.5px; letter-spacing: .12em; text-transform: uppercase;
          color: var(--text-3); margin-bottom: 2px; }}
  .card-foot {{ border-top: 1px solid var(--line); padding-top: 9px; margin-top: 2px; }}
  .cloud {{ font-family: var(--mono); font-size: 11px; line-height: 1.4; color: var(--text); margin-bottom: 5px; }}
  .src {{ font-family: var(--mono); font-size: 11px; color: var(--text-3); }}

  /* Atenção */
  .attention {{ display: grid; grid-template-columns: repeat(3, 1fr); border-top: 1px solid var(--line-strong); border-bottom: 1px solid var(--line-strong); }}
  .att {{ display: grid; grid-template-columns: 28px 1fr; gap: 6px; padding: 14px 18px 14px 0; }}
  .att + .att {{ padding-left: 18px; border-left: 1px solid var(--line); }}
  .att-idx {{ font-family: var(--mono); font-weight: 500; font-size: 13px; color: var(--accent); padding-top: 1px; }}
  .att h4 {{ font-size: 15px; font-weight: 700; margin-bottom: 4px; }}
  .att p {{ font-size: 13.5px; line-height: 1.45; color: var(--text-2); }}
  .att b {{ color: var(--text); font-weight: 500; }}

  /* Rodapé */
  .foot {{ display: flex; flex-wrap: wrap; gap: 4px 28px; justify-content: space-between; padding-top: 12px;
           font-family: var(--mono); font-size: 11px; line-height: 1.6; color: var(--text-3); }}
  .foot a {{ color: var(--text-2); }}
  .foot .inv a {{ color: var(--text); border-bottom-color: var(--accent); }}

  /* Responsivo (somente tela) */
  @media screen and (max-width: 1240px) {{
    .top {{ grid-template-columns: 1fr auto; }} .lead {{ grid-column: 1 / -1; grid-row: 2; }}
    .grid {{ grid-template-columns: repeat(2, 1fr); }}
    .kpis {{ grid-template-columns: repeat(3, 1fr); }}
    .kpi-hero, .kpi-side {{ grid-column: 1 / -1; border-right: 0; }}
    .kpi-side {{ flex-direction: row; flex-wrap: wrap; gap: 8px 32px; padding-left: 0; }}
    .kpi, .kpi-hero {{ border-bottom: 1px solid var(--line); }}
    .kpi:nth-of-type(3n+1) {{ border-right: 0; }}
    .kpi:nth-of-type(3n+2) {{ padding-left: 0; }}
  }}
  @media screen and (max-width: 760px) {{
    body {{ padding: 24px 18px; font-size: 16px; }}
    .top {{ grid-template-columns: 1fr; }} .lead {{ grid-row: auto; }} .meta {{ text-align: left; white-space: normal; }}
    h1 {{ font-size: 40px; }} .lead {{ font-size: 17px; }}
    .grid {{ grid-template-columns: 1fr; }}
    .kpis {{ grid-template-columns: repeat(2, 1fr); }}
    .kpi {{ padding-left: 0; }}
    .kpi:nth-of-type(n) {{ border-right: 0; padding-left: 0; }}
    .kpi:nth-of-type(2n+1) {{ padding-left: 16px; border-left: 1px solid var(--line); }}
    .kpi-side {{ flex-direction: column; }}
    .section-title {{ flex-direction: column; gap: 4px; }}
    .attention {{ grid-template-columns: 1fr; }}
    .att + .att {{ padding-left: 0; border-left: 0; border-top: 1px solid var(--line); }}
    .body p, .att p {{ font-size: 15px; }}
  }}

  /* Impressão: uma página A4 paisagem */
  @page {{ size: A4 landscape; margin: 0; }}
  @media print {{
    html, body {{ background: var(--ink); }}
    body {{ width: 297mm; height: 210mm; max-width: none; padding: 6mm 8.5mm 4mm; overflow: hidden; }}
    a {{ border-bottom: 0; }}
    .top {{ padding-bottom: 2.6mm; gap: 2mm 8mm; }}
    .kicker {{ font-size: 7.5pt; }} .kicker::before {{ width: 7mm; height: 2px; }}
    h1 {{ font-size: 23pt; margin-top: 1.6mm; }}
    .lead {{ font-size: 9.6pt; max-width: none; line-height: 1.36; }}
    .meta {{ font-size: 7pt; line-height: 1.7; }}
    .kpi, .kpi-hero, .kpi-side {{ padding: 2.4mm 3mm 2.2mm; }}
    .kpis {{ grid-template-columns: 1.55fr repeat(6, 1fr) 1.45fr; }}
    .kpi-hero {{ padding-left: 0; gap: 3mm; }}
    .kpi-row {{ flex-direction: row; align-items: center; justify-content: space-between; gap: 2mm; }}
    .kpi-side {{ gap: .6mm; }}
    .kpi-num {{ font-size: 15pt; }} .kpi-hero .kpi-num {{ font-size: 24pt; }}
    .kpi-label {{ font-size: 7.4pt; }} .kpi-note {{ font-size: 6.4pt; margin-top: 1mm; }}
    .meter {{ margin-top: 1.6mm; height: 3px; }}
    .kpi-side div {{ font-size: 7.2pt; gap: 2mm; white-space: nowrap; }} .kpi-side b {{ font-size: 10pt; }}
    .badge {{ font-size: 6.3pt; padding: .45mm 1.3mm .25mm; }}
    .section-title {{ margin: 2.1mm 0 1.4mm; }}
    h2 {{ font-size: 7.5pt; }} .section-title span {{ font-size: 6.5pt; }}
    .grid {{ gap: 2mm; }}
    .card {{ padding: 2.6mm 3mm 2.2mm; break-inside: avoid; }}
    .card-head {{ font-size: 6.3pt; gap: 2mm; }}
    .card h3 {{ font-size: 9.6pt; margin: 1.2mm 0 1.2mm; line-height: 1.2; }}
    .trans {{ font-size: 6.4pt; margin: -.4mm 0 1.4mm; padding-left: 1.6mm; }}
    .body p {{ font-size: 7.6pt; line-height: 1.32; margin-bottom: 1.3mm; }}
    .lbl {{ display: inline; font-size: 5.9pt; margin-right: 1.4mm; }}
    .card-foot {{ padding-top: 1.4mm; }}
    .card-foot {{ display: flex; justify-content: space-between; align-items: baseline; gap: 2mm; }}
    .cloud {{ font-family: var(--sans); font-size: 6.9pt; line-height: 1.3; margin-bottom: 0; }}
    .src {{ font-size: 6.2pt; white-space: nowrap; }}
    .att {{ padding: 1.8mm 4mm 1.8mm 0; grid-template-columns: 4.5mm 1fr; gap: 1mm; }}
    .att + .att {{ padding-left: 4mm; }}
    .att-idx {{ font-size: 8pt; }} .att h4 {{ font-size: 8.5pt; margin-bottom: .5mm; }}
    .att p {{ font-size: 7.5pt; line-height: 1.36; }}
    .foot {{ padding-top: 1.8mm; font-size: 6.3pt; line-height: 1.5; }}
  }}
</style>
</head>
<body>
  <header class="top">
    <div class="title">
      <p class="kicker">DATABRICKS — MONTHLY BRIEF</p>
      <h1>Setembro 2026</h1>
    </div>
    <p class="lead">Setembro estruturou a camada de controle para agentes: <b>Genie One MCP</b> e a <b>API do Unity Gateway</b> chegaram a GA, e o <b>ABAC do Unity Catalog</b> avançou em Beta para metastore, views e políticas DENY.</p>
    <div class="meta">
      Período <b>01–30/09/2026</b><br>
      Clouds <b>AWS · Azure · GCP</b><br>
      Pesquisa <b>{RESEARCH_DATE}</b>
    </div>
  </header>

  <section class="kpis" aria-label="Indicadores do mês">
    <div class="kpi-hero">
      <div class="kpi-num">{total}</div>
      <div class="kpi-label">atualizações verificadas, sem duplicidade</div>
    </div>{''.join(tiles)}
    <div class="kpi-side">
      <div><b>{st["transitions"]}</b>transição de estágio no mês</div>
      <div><b>{st["retirements"]}</b>retiradas de modelos agendadas</div>
      <div><b>{st["announcements"]}</b>anúncios corporativos, à parte</div>
    </div>
  </section>

  <div class="section-title"><h2>Destaques do mês</h2><span>priorizados por impacto para o cliente</span></div>
  <section class="grid">{''.join(cards)}
  </section>

  <div class="section-title"><h2>O que merece atenção</h2><span>ações e restrições sustentadas pelas release notes</span></div>
  <section class="attention">{attention}
  </section>

  <footer class="foot">
    <span>Fontes oficiais: {sources} · Pesquisa em {RESEARCH_DATE} · Datas das release notes; rollout escalonado</span>
    <span class="inv">Inventário completo: <a href="{MD_FILE.name}">{MD_FILE.name}</a></span>
  </footer>
</body>
</html>
"""


def md_cell(s):
    return str(s).replace("|", "\\|").replace("\n", " ")


MD_STAGE = {"GA": "GA", "Public Preview": "Public Preview", "Beta": "Beta", "Private Preview": "Private Preview",
            "Não informado": "Estágio não divulgado", "N/A": "Outro evento"}

AREA_ORDER = ["Engenharia e ingestão", "SQL e Data Warehousing", "AI/BI e Genie", "IA/ML e Unity Gateway",
              "Unity Catalog e governança", "Segurança e rede", "Lakebase", "Compute e serverless", "Apps e ferramentas"]


def fmt_date(d):
    def one(x):
        y, m, dd = x.split("-")
        return f"{dd}/{m}"
    return " → ".join(one(x.strip()) for x in d.split("→"))


def build_md():
    st = inv.stats()
    L = []
    L.append("# Inventário — Atualizações Databricks · setembro de 2026\n")
    L.append(f"Período coberto: **01 a 30/09/2026** · Data da pesquisa: **{RESEARCH_DATE}** · Clouds: **AWS, Azure e GCP**\n")
    L.append("Complemento do Databricks Release Intelligence de setembro de 2026. "
             "Cada linha é uma **funcionalidade ou mudança** (não um anúncio), deduplicada entre clouds e entre fontes "
             "(release notes, blog e newsroom).\n")
    L.append("## Resumo\n")
    L.append("| Indicador | Valor |\n|---|---|")
    L.append(f"| Atualizações de produto verificadas (deduplicadas) | **{st['total']}** |")
    for s in inv.STAGES:
        if s == "Private Preview":
            continue
        L.append(f"| {MD_STAGE[s]} | {st['stages'][s]} |")
    L.append(f"| Transições de estágio no mês | {st['transitions']} |")
    L.append(f"| Retiradas de modelos agendadas | {st['retirements']} |")
    L.append(f"| Anúncios corporativos/ecossistema (contados à parte) | {st['announcements']} |\n")
    L.append("## Legenda\n")
    L.append("- **Estágio**: registrado como anunciado em setembro, com a nomenclatura oficial (GA, Public Preview, Beta). "
             "**Estágio não divulgado** = a fonte não informa a maturidade. **Outro evento** = o conceito de estágio não se "
             "aplica (retirada, mudança de comportamento, manutenção).")
    L.append("- **Tipo**: Lançamento · Transição (mudança de estágio no mês) · Descontinuação · Mudança (de comportamento "
             "ou padrão, normalmente exige ação) · Manutenção (versões e patches).")
    L.append("- **Data**: data da entrada nas release notes (ou de publicação no blog, quando o item só aparece lá). "
             "Releases são escalonados; a conta pode receber a mudança uma semana ou mais depois.")
    L.append("- **Cloud**: presença da entrada nas release notes de cada cloud. A ausência na página de uma cloud não "
             "prova indisponibilidade; restrições regionais foram verificadas na documentação apenas para os destaques.")
    L.append("- **Fonte**: links para a entrada específica (âncora) da release note AWS; itens exclusivos de Azure/GCP "
             "apontam para a página da respectiva cloud.\n")

    for area in AREA_ORDER:
        rows = [it for it in inv.ITEMS if it["area"] == area]
        rows.sort(key=lambda it: it["date"])
        L.append(f"## {area} ({len(rows)})\n")
        L.append("| Data | Recurso (nome oficial) | Estágio | Tipo | Mudança | Impacto | Cloud e restrições | Fonte |")
        L.append("|---|---|---|---|---|---|---|---|")
        for it in rows:
            clouds = "Cloud não identificada" if it["clouds"] == "Não informado" else it["clouds"]
            restr = clouds + ("" if it["restr"] == "—" else f". {it['restr']}")
            src_label = "release notes" if "release-notes" in it["src"] else ("blog" if "/blog/" in it["src"] else "fonte")
            L.append("| " + " | ".join(md_cell(x) for x in [
                fmt_date(it["date"]), f"**{it['name']}**", MD_STAGE[it["stage"]], it["type"], it["change"],
                f"**{it['axis']}** — {it['impact']}", restr, f"[{src_label}]({it['src']})"]) + " |")
        L.append("")

    L.append("## Transições de estágio registradas no mês\n")
    L.append(f"- **Share metric views with OpenSharing**: Beta em 03/09 ([fonte]({inv.rn('Share metric views with OpenSharing')})) "
             f"→ GA em 24/09 ([fonte]({inv.rn('Sharing metric views with OpenSharing')})). Contado uma vez, como transição.\n")

    L.append("## Prazos e ações derivados das fontes\n")
    L.append("| Prazo | Ação | Fonte |\n|---|---|---|")
    L.append(f"| 30/10/2026 | Migrar de Thinking Machine Labs Inkling (para GLM 5.3 ou Kimi K3), Moonshot AI Kimi K2.7 (para Kimi K3) e DeepSeek V4 Pro 0813 (para DeepSeek V4.1 Flash; AWS) | [release notes]({inv.rn('Thinking Machine Labs Inkling')}) |")
    L.append(f"| 31/10/2026 | Migrar do endpoint Beta `/api/2.0/mcp/genie` para o MCP Service `system.ai.genie_one_mcp` | [release notes]({inv.rn('The Genie One MCP server')}) |")
    L.append(f"| 01/11/2026 | A configuração de partner-powered AI features será removida; até lá, alterar só pela Settings API | [release notes]({inv.rn('Partner-powered AI features')}) |")
    L.append(f"| Imediato | Habilitar *Allow spreadsheet writeback* se o Excel/Google Sheets grava dados no UC | [release notes]({inv.rn('Control spreadsheet writeback')}) |")
    L.append(f"| Imediato | Revisar integrações com secrets OAuth de service principals pouco usados (excluídos após 90 dias sem uso) | [release notes]({inv.rn('Unused OAuth client secrets')}) |")
    L.append(f"| Imediato | Revisar automações que excluem pipelines UC (agora preservam tabelas; usar `cascade=true`) | [release notes]({inv.rn('Deleting a Unity Catalog pipeline')}) |")
    L.append(f"| Antes de adotar | Testar código que usa `dbutils` via Py4J ou `/databricks/runtime/info.json` antes de migrar para environment version 6 | [notas da versão](https://docs.databricks.com/aws/en/release-notes/serverless/environment-version/six) |\n")

    L.append("## Anúncios corporativos e de ecossistema (fora da contagem de funcionalidades)\n")
    L.append("| Data | Anúncio | Observação | Fonte |\n|---|---|---|---|")
    for a in inv.ANNOUNCEMENTS:
        L.append(f"| {fmt_date(a['date'])} | **{md_cell(a['name'])}** | {md_cell(a['note'])} | [fonte]({a['src']}) |")
    L.append("")

    L.append("## Itens examinados e não contados como lançamento de setembro\n")
    L.append("| Item | Motivo | Fonte |\n|---|---|---|")
    L.append("| Unity Catalog **Pages** (Beta) | Disponibilidade registrada nas release notes em 12/08/2026; o post de 22/09 é divulgação. | [blog](https://www.databricks.com/blog/unity-catalog-pages-governed-home-your-business-knowledge-genie-ontology) · [release notes de agosto](https://docs.databricks.com/aws/en/release-notes/product/2026/august) |")
    L.append("| **MATCH_RECOGNIZE** | O post de 16/09 cita Public Preview; a documentação (atualizada em 11/09) indica **Beta**, e as release notes de Databricks SQL registram Beta em junho/2026. Divergência não resolvida; sem nova disponibilidade comprovada em setembro. | [blog](https://www.databricks.com/blog/regex-rows-simplifying-pattern-detection-sql-matchrecognize) · [docs](https://docs.databricks.com/aws/en/sql/language-manual/sql-ref-syntax-qry-select-match-recognize) |")
    L.append("| **IP functions** (GA) | Post publicado em 01/10/2026, fora do período. | [blog](https://www.databricks.com/blog/ip-functions-are-generally-available-bringing-high-performance-network-analytics-lakehouse) |")
    L.append("| Lakeflow pipelines, release de agosto | Cobre 13/08 a 08/09/2026 sem data por item: transações multi-statement em `foreachBatch`, `ALTER TABLE` metadata-only em streaming tables (Beta), row tracking por padrão em pipelines Classic UC, environment version com 100% de cobertura em Spark Connect (Public Preview), system table de eventos de pipeline (Beta), fontes upstream no DAG e full refresh seletivo. Só *managed tables* (10/09) entrou na contagem, por constar nas release notes de setembro. | [release notes de pipelines](https://docs.databricks.com/aws/en/release-notes/dlt/2026#august-2026) |")
    L.append("| Posts do blog sobre Genie One MCP (22/09) e CLI `ug` (24/09) | Duplicam entradas das release notes (contadas uma vez). | [blog MCP](https://www.databricks.com/blog/genie-one-mcp-now-generally-available) · [blog ug](https://www.databricks.com/blog/deploy-and-manage-coding-agents-scale-unity-gateway-cli) |")
    L.append("| Posts de conteúdo, guias e cases (ex.: Genie Ontology, RADAR, Lakebase cache, custos com system tables, Consort, decision models Jev) | Não anunciam disponibilidade nova de produto. | [blog](https://www.databricks.com/blog) |")
    L.append("| Comunicados de terceiros (Concurrence, Evalueserve) | Não são fontes oficiais da Databricks. | — |\n")

    L.append("## Notas de cobertura e incertezas\n")
    L.append("- **Fontes consultadas** (acesso direto em 01/10/2026): release notes da plataforma de setembro/2026 para "
             "[AWS](" + inv.BASE["aws"] + "), [Azure](" + inv.BASE["azure"] + ") e [GCP](" + inv.BASE["gcp"] + "); "
             "[Databricks SQL](" + inv.DBSQL + "); [Databricks Runtime](https://docs.databricks.com/aws/en/release-notes/runtime/); "
             "[serverless](https://docs.databricks.com/aws/en/release-notes/serverless/); "
             "[Lakeflow pipelines](https://docs.databricks.com/aws/en/release-notes/dlt/2026); todos os posts do "
             "[blog](https://www.databricks.com/blog) publicados no mês (via sitemap oficial) e todos os press releases do "
             "[newsroom](https://www.databricks.com/company/newsroom).")
    L.append("- **Databricks Runtime**: nenhuma versão nova em setembro (DBR 19 foi lançado em 15/06/2026); apenas "
             "atualizações de manutenção de 01/09. **Serverless**: a página de release notes não tem entradas de setembro "
             "(a última é de 06/08); environment version 6 foi registrado nas release notes da plataforma.")
    L.append("- **Estágio não divulgado** (29 itens): a fonte não informa a maturidade, inclusive em 9 disponibilizações de "
             "modelos no Unity Gateway. Não foi inferido estágio a partir de outras páginas, exceto nas notas dos destaques, "
             "sempre identificadas.")
    L.append("- **Itens só no blog** (contados): Lakebase Search (GA em AWS/Azure segundo o post de 28/09), `ai_decide` "
             "(Beta, 30/09), on-demand state repartitioning (Public Preview, 14/09) e as novidades de Genie Agents (02/09, "
             "estágio não informado no post). Para esses itens, a data é a de publicação do post.")
    L.append("- **Diferenças de data entre clouds**: Agent Bricks CLI e managed agent memory/sessions aparecem em 30/09 no "
             "GCP; maintenance windows aparece em 15/09 na Azure. O inventário usa a data AWS.")
    L.append("- **Benefícios quantitativos**: só foram mantidos quando declarados pela Databricks (ex.: ~15% em MERGE/UPDATE "
             "com Auto CDF) e aparecem atribuídos. Benchmarks de blog (ex.: Lakebase Search, IP functions) não foram "
             "replicados no one-page.")
    L.append("- **Fora do escopo verificado**: release notes específicas de SDKs, Terraform, CLI, extensões de IDE, "
             "Marketplace e conectores de parceiros; anúncios regionais não publicados no newsroom global.")
    L.append("- **Metadado das páginas**: o cabeçalho “Last updated” das release notes AWS/GCP mostra 11/09/2026, embora "
             "listem entradas até 30/09; a página da Azure indica atualização em 30/09/2026. As entradas e datas por item "
             "foram usadas como referência.")
    return "\n".join(L) + "\n"


if __name__ == "__main__":
    HTML_FILE.write_text(build_html())
    MD_FILE.write_text(build_md())
    print(HTML_FILE, MD_FILE, inv.stats(), sep="\n")
