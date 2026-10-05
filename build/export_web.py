"""Exporta o inventário para o app React (web/src/data/releases.json).

Acrescenta domínio estratégico, rótulo curto para o índice e agrupamentos
(conectores, modelos, retiradas) sobre a mesma fonte usada no inventário.
"""
import json
import pathlib

import inventory as inv

OUT = pathlib.Path(__file__).resolve().parent.parent / "web" / "src" / "data" / "releases.json"

DOMAINS = [
    dict(id="engenharia", name="Engenharia de Dados", short="Lakeflow, ingestão e streaming"),
    dict(id="ia", name="IA e Agentes", short="Agentes, AI Functions, busca e modelos"),
    dict(id="governanca", name="Governança e Compartilhamento", short="Unity Catalog, ABAC e OpenSharing"),
    dict(id="genie", name="Analytics e Genie", short="Genie One, Genie Code, Excel"),
    dict(id="gateway", name="Controle de IA", short="Unity Gateway e coding agents"),
    dict(id="plataforma", name="Plataforma e Apps", short="Apps, Lakebase e compute"),
    dict(id="sql", name="SQL e Warehousing", short="Databricks SQL e system tables"),
    dict(id="seguranca", name="Segurança e Rede", short="Compliance, secrets e conectividade"),
]

GATEWAY = {
    "Unity Gateway API and developer tools",
    "Unity Gateway support for compliance security profile standards",
    "Configure provider discounts (price multiplier) for external model spend",
    "Back model provider service credentials with a Unity Catalog secret",
    "Connect coding agents to Unity Gateway with the ug CLI",
    "Centrally configure coding agents",
    "Unified tracing includes coding agent activity",
    "Usage tracking: session metadata and token details",
    "Partner-powered AI features can no longer be disabled in the settings UI",
}
AREA_DOMAIN = {
    "Engenharia e ingestão": "engenharia", "SQL e Data Warehousing": "sql", "AI/BI e Genie": "genie",
    "IA/ML e Unity Gateway": "ia", "Unity Catalog e governança": "governanca", "Segurança e rede": "seguranca",
    "Lakebase": "plataforma", "Compute e serverless": "plataforma", "Apps e ferramentas": "plataforma",
}

SHORT = {
    "Automatic change data feed (Auto CDF)": "Automatic change data feed (Auto CDF)",
    "Apache Arrow support for Zerobus Ingest": "Apache Arrow no Zerobus Ingest",
    "Zerobus Ingest into default storage": "Zerobus Ingest em default storage",
    "Managed tables in Lakeflow pipelines": "Managed tables em Lakeflow pipelines",
    "Maintenance windows for continuous pipelines": "Janelas de manutenção para pipelines contínuos",
    "Standard performance mode for one-time runs (Jobs API)": "Standard performance mode em execuções avulsas",
    "Session restore for serverless jobs": "Session restore para jobs serverless",
    "On-demand state repartitioning (Structured Streaming)": "On-demand state repartitioning (streaming)",
    "Deleting a Unity Catalog pipeline retains tables by default": "Excluir pipeline UC preserva as tabelas",
    "Table update triggers on OpenSharing objects and system tables": "Triggers sobre OpenSharing e system tables",
    "time_bucket SQL function": "Função time_bucket",
    "Databricks SQL 2026.36 rolling out in Current": "Databricks SQL 2026.36 no canal Current",
    "counter_diff SQL window function": "Função de janela counter_diff",
    "Window measures on a numeric index column (metric views)": "Window measures com índice numérico",
    "Query history system table (system.query.history)": "Query history system table",
    "Scalar and Batch Unity Catalog Python UDFs": "UC Python UDFs (scalar e batch)",
    "Databricks JDBC Driver (Simba) 2.8.4": "JDBC Driver (Simba) 2.8.4",
    "Query tags for SQL warehouses": "Query tags para SQL warehouses",
    "Genie Code scheduled tasks": "Genie Code scheduled tasks",
    "Genie One web search": "Genie One web search",
    "Genie One and Genie Agents can use models served through OpenAI on Databricks": "Genie com modelos via OpenAI on Databricks",
    "Genie Agents: Agent mode APIs, file analysis in volumes, Genie Code curation": "Genie Agents: Agent mode API e arquivos",
    "Genie Code conversation controls": "Genie Code: controles de conversa",
    "Databricks Excel Add-in": "Databricks Excel Add-in",
    "Genie visualizations in Slack replies": "Gráficos do Genie no Slack",
    "Account-only user access to Genie One": "Genie One para usuários só de conta",
    "Genie Code intelligent document processing pipelines": "Genie Code para documentos (IDP)",
    "Genie One MCP server (system.ai.genie_one_mcp)": "Genie One MCP server",
    "Control spreadsheet writeback with a workspace admin setting": "Writeback de planilhas exige admin",
    "AI Search: struct/map columns and filter-only queries": "AI Search: struct, map e filtros",
    "ai_search generate_citations": "ai_search com citações",
    "Managed agent memory and managed agent sessions": "Managed agent memory e sessions",
    "ai_search over Lakebase synced tables": "ai_search sobre Lakebase",
    "Agent Bricks CLI (databricks-agentbricks)": "Agent Bricks CLI",
    "ai_decide AI Function": "ai_decide",
    "Unity Gateway API and developer tools": "Unity Gateway API e developer tools",
    "Unity Gateway support for compliance security profile standards": "Unity Gateway no compliance security profile",
    "Configure provider discounts (price multiplier) for external model spend": "Price multiplier para gasto externo",
    "Back model provider service credentials with a Unity Catalog secret": "Credencial de provedor via UC secret",
    "Connect coding agents to Unity Gateway with the ug CLI": "CLI ug para coding agents",
    "Centrally configure coding agents": "Configuração central de coding agents",
    "Unified tracing includes coding agent activity": "Tracing de coding agents",
    "Usage tracking: session metadata and token details": "Usage tracking com sessão e tokens",
    "Partner-powered AI features can no longer be disabled in the settings UI": "Partner-powered AI sai da UI",
    "Share metric views with OpenSharing": "Metric views via OpenSharing",
    "ABAC DENY policies": "ABAC DENY policies",
    "Configurable retention for system tables": "Retenção configurável de system tables",
    "Sharing foreign Iceberg tables with OpenSharing": "OpenSharing: foreign Iceberg tables",
    "Sharing foreign schemas and tables with OpenSharing": "OpenSharing: foreign schemas e tables",
    "Sharing foreign Delta tables with OpenSharing": "OpenSharing: foreign Delta tables",
    "Data Classification scans Unity Catalog views": "Data Classification em views",
    "VARIANT cast for ARRAY and MAP columns in ABAC column masks": "Máscaras VARIANT para ARRAY e MAP",
    "Metastore-level ABAC policies": "ABAC no nível do metastore",
    "Invite OpenSharing recipients by email": "OpenSharing: convite por e-mail",
    "Time travel queries enforce ABAC policies": "Time travel com ABAC",
    "Tags for dashboards, notebooks, Databricks apps and Genie Agents": "Tags em dashboards, notebooks, apps e agentes",
    "ABAC on views": "ABAC em views",
    "OpenSharing SecureConnect for providers on Google Cloud": "OpenSharing SecureConnect",
    "HITRUST and IRAP compliance controls": "HITRUST e IRAP",
    "Private network gateway": "Private network gateway",
    "External secrets in Unity Catalog": "External secrets no Unity Catalog",
    "Unused OAuth client secrets automatically deleted after 90 days": "OAuth secrets sem uso expiram em 90 dias",
    "Scala UDFs can access Unity Catalog secrets": "Scala UDFs com UC secrets",
    "Inbound Private Link for performance-intensive services": "Inbound Private Link para Lakebase e Zerobus",
    "Lakebase Search": "Lakebase Search",
    "Databricks Runtime maintenance updates (09/01)": "Manutenção do Databricks Runtime",
    "Git Folder Serverless": "Git Folder Serverless",
    "Environment version 6": "Environment version 6",
    "Base environments on classic compute": "Base environments em classic compute",
    "Databricks Apps telemetry": "Databricks Apps telemetry",
    "Databricks Apps on by default for compliance security profile workspaces": "Apps ativo por padrão em ambientes regulados",
    "Genie App Builder (governed data and AI apps without code)": "Genie App Builder",
    "Horizontal scaling for Databricks Apps": "Horizontal scaling para Apps",
}


def group_of(it):
    if it["name"].endswith("connector (Lakeflow Connect)"):
        return "conectores"
    if it["type"] == "Descontinuação":
        return "retiradas"
    if ("Unity Gateway" in it["name"] and it["name"].startswith(("OpenAI", "Anthropic", "xAI", "DeepSeek"))) \
            or "(Databricks-hosted)" in it["name"]:
        return "modelos"
    return None


def short_of(it, group):
    if group == "conectores":
        return it["name"].replace(" connector (Lakeflow Connect)", "")
    if group in ("modelos", "retiradas"):
        n = it["name"]
        for cut in (" on Unity Gateway", " (Databricks-hosted)", " retirement"):
            n = n.replace(cut, "")
        return n.replace("Anthropic ", "").replace("OpenAI ", "").replace("Google ", "").replace("xAI ", "") \
                .replace("Moonshot AI ", "").replace("Thinking Machine Labs ", "")
    return SHORT[it["name"]]


def main():
    items = []
    for i, it in enumerate(inv.ITEMS):
        dom = "gateway" if it["name"] in GATEWAY else AREA_DOMAIN[it["area"]]
        grp = group_of(it)
        last_date = it["date"].split("→")[-1].strip()
        items.append(dict(id=i, domain=dom, group=grp, short=short_of(it, grp), name=it["name"],
                          stage=it["stage"], type=it["type"], date=last_date, dateLabel=it["date"],
                          clouds=it["clouds"], change=it["change"], axis=it["axis"], impact=it["impact"],
                          restr=it["restr"], src=it["src"]))
    data = dict(domains=DOMAINS, items=items, announcements=inv.ANNOUNCEMENTS, stats=inv.stats(),
                sources=dict(aws=inv.BASE["aws"], azure=inv.BASE["azure"], gcp=inv.BASE["gcp"], dbsql=inv.DBSQL,
                             blog="https://www.databricks.com/blog",
                             newsroom="https://www.databricks.com/company/newsroom"))
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=1))
    from collections import Counter
    print(OUT, len(items), Counter(x["domain"] for x in items), Counter(x["group"] for x in items))


if __name__ == "__main__":
    main()
