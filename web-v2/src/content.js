// Copy editorial da página. Fatos vêm de src/data/releases.json (gerado do inventário verificado);
// aqui ficam apenas a curadoria e a redação executiva (Feature → Meaning → Customer impact).
import data from './data/releases.json'

export const { domains, items, stats, sources, announcements } = data

const byName = (prefix) => {
  const it = items.find((i) => i.name.startsWith(prefix))
  if (!it) throw new Error(`item não encontrado: ${prefix}`)
  return it
}

export const period = {
  label: 'Setembro 2026',
  range: '01–30 de setembro de 2026',
  short: '01–30 SET 2026',
  clouds: 'AWS · Azure · GCP',
  researched: '01/10/2026',
}

export const hero = {
  eyebrow: 'Databricks Release Intelligence',
  headline: ['Releases do mês.'],
  support: null,
  topDomainsLabel: 'Áreas com maior atividade no mês',
  provenance: 'Documentação oficial da Databricks · pesquisa de 01/10/2026',
}

// Estrutura editorial e navegação (ids estáveis para links diretos).
export const sections = [
  { id: 'destaques', n: '01', label: 'Destaques do mês', nav: 'Destaques' },
  { id: 'impacto', n: '02', label: 'O que muda na prática', nav: 'Impacto' },
  { id: 'acoes', n: '03', label: 'Requer ação', nav: 'Ações' },
  { id: 'panorama', n: '04', label: 'Panorama dos lançamentos', nav: 'Panorama' },
  { id: 'dominios', n: '05', label: 'Atualizações por domínio', nav: 'Domínios' },
  { id: 'modelos', n: '06', label: 'Modelos', nav: 'Modelos' },
  { id: 'indice', n: '07', label: 'Índice completo', nav: 'Índice' },
]
export const sectionIndex = (id) => {
  const s = sections.find((x) => x.id === id)
  return `${s.n} — ${s.label.toUpperCase()}`
}

// Primário: 5 lançamentos que mudam decisões de arquitetura e adoção.
// Visível no card: nome, estágio, mudança, por que importa e a condição decisiva.
// Em "Ver detalhes": descrição técnica, pré-requisitos, restrições, clouds e fontes — só fatos documentados.
export const majors = [
  {
    id: 'mcp',
    stage: 'GA',
    date: '25/09/2026',
    title: 'Genie One MCP server',
    lede: 'O Genie passa a atender qualquer agente compatível com MCP.',
    why: 'Agentes de terceiros respondem perguntas de negócio com o mesmo contexto governado do Genie, com as permissões do Unity Catalog aplicadas a cada requisição.',
    decisive: 'Endpoint Beta encerra em 31/10/2026',
    clouds: 'AWS · Azure · GCP',
    details: {
      tech: 'MCP Service gerenciado no Unity Gateway (system.ai.genie_one_mcp) que expõe o Genie como ferramenta conversacional via Model Context Protocol para clientes como Claude, ChatGPT e Cursor. Em clientes compatíveis com MCP Apps, retorna uma visualização interativa.',
      prereq: ['Usuários de conta têm EXECUTE em system.ai por padrão; em geral, não é preciso grant adicional.'],
      restrictions: [
        'Permissões do Unity Catalog são aplicadas a cada requisição: usuários e agentes só consultam dados a que têm acesso.',
        'O endpoint Beta /api/2.0/mcp/genie está depreciado e será desligado em 31/10/2026.',
      ],
      sources: [
        ['Release note · 25/09/2026', byName('Genie One MCP server').src],
        ['Documentação', 'https://docs.databricks.com/aws/en/agents/mcp-tools/genie-mcp'],
      ],
    },
  },
  {
    id: 'gateway',
    stage: 'GA',
    date: '16/09/2026',
    title: 'Unity Gateway API e developer tools',
    lede: 'Modelos, provedores e MCP services como infraestrutura versionada.',
    why: 'O acesso a IA, inclusive o de desenvolvedores, passa a ser governado com o mesmo rigor de pipelines e permissões.',
    decisive: 'Requer versões mínimas de Terraform, CLI e SDKs',
    clouds: 'AWS · Azure · GCP',
    details: {
      tech: 'API para criar, ler, atualizar, listar e excluir model services, model provider services e MCP services, com suporte nas ferramentas de desenvolvedor da Databricks. No mesmo mês: CLI ug para coding agents e configuração central de coding agents.',
      prereq: [
        'Terraform provider 1.132.0+ · Databricks CLI v1.17.0+',
        'databricks-sdk (Python) 0.136.0+ · Go v0.178.0+ · Java 0.153.0+ · @databricks/sdk-aigateway 0.19.0+',
      ],
      restrictions: [
        'Suporte em Declarative Automation Bundles está em Beta.',
        'CLI ug e configuração central de coding agents: estágio não divulgado na fonte.',
      ],
      sources: [
        ['Release note · 16/09/2026', byName('Unity Gateway API').src],
        ['CLI ug · 22/09/2026', byName('Connect coding agents').src],
      ],
    },
  },
  {
    id: 'abac',
    stage: 'Beta',
    date: '08–29/09/2026',
    title: 'ABAC para metastore, views, DENY e time travel',
    lede: 'Uma política, aplicada a todo o metastore.',
    why: 'A proteção de dados sensíveis deixa de depender de regras replicadas por catálogo, e DENY garante segregação de funções até sobre donos de objetos.',
    decisive: 'Beta · requer Databricks Runtime 19+',
    clouds: 'AWS · Azure · GCP',
    details: {
      tech: 'Row filters, column masks, GRANT e DENY no nível do metastore valem para todos os catálogos, inclusive os futuros. ABAC passa a cobrir views e consultas de time travel em tabelas gerenciadas qualificadas; DENY nega MANAGE ACCESS CONTROL, inclusive a owners, e prevalece sobre qualquer grant.',
      prereq: [
        'Databricks Runtime 19+ para políticas de metastore via SQL, ABAC em views e time travel com ABAC.',
        'Papel de metastore admin para criar, alterar ou excluir políticas no metastore.',
        'ABAC on Views habilitado por account admin na página Previews.',
      ],
      restrictions: [
        'As quatro capacidades estão em Beta.',
        'Políticas de metastore não são replicadas pelo disaster recovery gerenciado do Unity Catalog.',
      ],
      sources: [
        ['ABAC DENY · 08/09/2026', byName('ABAC DENY policies').src],
        ['Metastore · 17/09/2026', byName('Metastore-level ABAC').src],
        ['Time travel · 23/09/2026', byName('Time travel queries').src],
        ['Views · 29/09/2026', byName('ABAC on views').src],
      ],
    },
  },
  {
    id: 'sharing',
    stage: 'GA',
    date: '11–24/09/2026',
    title: 'OpenSharing para dados federados e metric views',
    lede: 'Compartilhar sem copiar.',
    why: 'Parceiros, subsidiárias e clientes recebem dados e métricas consistentes sem pipelines de cópia.',
    decisive: 'Esquemas estrangeiros geram custo de compute e storage no provedor',
    clouds: 'AWS · Azure · GCP',
    details: {
      tech: 'GA para compartilhar tabelas Delta federadas (OneLake, Hive metastore, AWS Glue), tabelas Iceberg federadas, inclusive para clientes Iceberg externos, e esquemas e tabelas estrangeiros via Lakehouse Federation. Metric views foram de Beta (03/09) a GA (24/09).',
      prereq: ['Metric views compartilhadas são lidas com MEASURE(...) em compute serverless.'],
      restrictions: ['Esquemas e tabelas estrangeiros materializam dados no lado do provedor, com custo de compute e storage.'],
      sources: [
        ['Foreign Iceberg · 11/09/2026', byName('Sharing foreign Iceberg').src],
        ['Foreign schemas · 11/09/2026', byName('Sharing foreign schemas').src],
        ['Foreign Delta · 15/09/2026', byName('Sharing foreign Delta').src],
        ['Metric views · 24/09/2026', byName('Share metric views').src],
      ],
    },
  },
  {
    id: 'memory',
    stage: 'Beta',
    date: '16/09/2026',
    title: 'Managed agent memory e sessions',
    lede: 'Estado gerenciado para agentes de qualquer framework.',
    why: 'Agentes com memória chegam à produção sem que o time construa e opere um banco próprio para isso.',
    decisive: 'Beta · na prévia, cobra-se a instância Lakebase',
    clouds: 'AWS · Azure · GCP (no GCP, publicado em 30/09)',
    details: {
      tech: 'Dois stores gerenciados sobre Lakebase: memória de longo prazo com busca semântica e histórico durável de sessões, utilizáveis por agentes de qualquer framework. A Agent Bricks CLI (Beta) faz o scaffold (LangGraph ou OpenAI Agents SDK), a execução local e o deploy no agent runtime.',
      prereq: ['Python 3.10+ para o AgentKit SDK.', 'A Agent Bricks CLI não exige configuração no workspace.'],
      restrictions: [
        'Beta. Na prévia, cobra-se a instância Lakebase subjacente; o preço pode mudar.',
        'Controle de acesso no nível do store; não há controle por entrada nem por ator.',
      ],
      sources: [
        ['Release note · 16/09/2026', byName('Managed agent memory').src],
        ['Agent Bricks CLI · 29/09/2026', byName('Agent Bricks CLI').src],
        ['Documentação', 'https://docs.databricks.com/aws/en/agents/agent-memory/managed-memory'],
      ],
    },
  },
]

// Secundário: o destaque de cada domínio que não repete os lançamentos principais.
export const domainHighlights = {
  engenharia: {
    item: 'Automatic change data feed',
    line: 'Mudanças calculadas na consulta, sem configurar change data feed tabela a tabela.',
    note: 'Também: 10 conectores em Beta, 8 deles para logs de auditoria e segurança',
  },
  ia: {
    item: 'ai_decide',
    line: 'Decisões estruturadas em SQL ou REST, sem recorrer a um LLM generativo.',
    note: 'Também: 9 modelos novos no Unity Gateway e 3 retiradas em 30/10',
  },
  governanca: {
    item: 'Tags for dashboards',
    line: 'Tags governadas em dashboards, notebooks, apps e Genie Agents.',
    note: 'ABAC e OpenSharing estão entre os lançamentos principais',
  },
  genie: {
    item: 'Databricks Excel Add-in',
    line: 'Excel conectado ao Unity Catalog, com SQL, pivot tables ao vivo e writeback.',
    note: 'Também em GA: Genie Code scheduled tasks',
  },
  gateway: {
    item: 'Connect coding agents',
    line: 'Claude Code, Codex e outros sob a mesma governança, com tracing e gasto visíveis.',
    note: 'Unity Gateway API está entre os lançamentos principais',
  },
  plataforma: {
    item: 'Horizontal scaling for Databricks Apps',
    line: 'Apps em múltiplas instâncias atrás de uma URL, com deploy sem downtime.',
    note: 'Também em GA: Lakebase Search e Apps telemetry',
  },
  sql: {
    item: 'Query history system table',
    line: 'Histórico de queries em nível de conta, com query tags também em GA.',
    note: 'Base oficial para FinOps de SQL',
  },
  seguranca: {
    item: 'HITRUST and IRAP',
    line: 'Controles via compliance security profile, agora exigido para HIPAA, HITRUST e IRAP.',
    note: 'Restrito à Azure',
  },
}

// Seção 04 — resultados primeiro (produção → governança → proteção → economia → simplificação);
// as capacidades vêm depois, como evidência.
export const impactsSection = {
  index: '04 — O QUE MUDA NA PRÁTICA',
  title: 'O que muda para arquitetura e operação',
  kicker: 'Impactos concretos dos releases deste mês.',
}

export const impacts = [
  {
    icon: 'SparkleDoubleIcon',
    title: 'Agentes chegam à produção com contexto confiável',
    body: 'O contexto do Genie e a memória gerenciada reduzem a distância entre um piloto e um agente em produção.',
    basis: ['Genie One MCP', 'Agent Memory', 'Agent Bricks CLI'],
  },
  {
    icon: 'ShieldIcon',
    title: 'Dados e IA passam a compartilhar a mesma governança',
    body: 'O acesso a modelos, coding agents e MCP passa a ser configurado, rastreado e auditado de forma centralizada.',
    basis: ['Unity Gateway API', 'CLI', 'Tracing'],
  },
  {
    icon: 'LockIcon',
    title: 'Políticas de dados deixam de ser duplicadas',
    body: 'Políticas no metastore e DENY reduzem regras repetidas e brechas entre catálogos e views.',
    basis: ['ABAC no metastore', 'ABAC em views', 'DENY'],
  },
  {
    icon: 'DollarIcon',
    title: 'Custo de dados e IA se torna atribuível',
    body: 'Query history, query tags e usage tracking criam uma base comum para atribuir consumo por time, projeto ou aplicação.',
    basis: ['Query History', 'Query Tags', 'Usage Tracking'],
  },
  {
    icon: 'ShareNodesIcon',
    title: 'Menos cópias. Menos pipelines. Menos operação.',
    lines: ['Menos cópias. Menos pipelines.', 'Menos operação.'],
    body: 'Compartilhamento federado e Auto CDF reduzem pipelines de cópia e configuração tabela a tabela.',
    basis: ['OpenSharing federado', 'Auto CDF', 'Conectores'],
  },
  {
    icon: 'SparkleIcon',
    title: 'Decisões estruturadas direto no SQL',
    body: 'ai_decide() avalia dados ou texto por critérios definidos e devolve uma decisão — escolha, score ou probabilidade — usável em SQL e aplicações, sem recorrer a um LLM generativo.',
    basis: ['ai_decide', 'SQL', 'REST'],
  },
]

// Requer ação. "kind" separa prazo documentado, mudança publicada e recomendação editorial.
// Responsáveis são sugestões por função, não atribuições.
export const actions = [
  {
    when: '30/10/2026',
    kind: 'Prazo documentado',
    title: 'Retirada de três modelos',
    affected: 'Workloads que chamam Thinking Machine Labs Inkling, Moonshot AI Kimi K2.7 ou DeepSeek V4 Pro (0813), este último listado apenas nas release notes AWS.',
    action: 'Migrar as chamadas para os substitutos recomendados: GLM 5.3 ou Kimi K3 (Inkling), Kimi K3 (Kimi K2.7) e DeepSeek V4.1 Flash (DeepSeek V4 Pro).',
    owner: 'Equipe de IA',
    sources: [
      ['Inkling', byName('Thinking Machine Labs Inkling').src],
      ['Kimi K2.7', byName('Moonshot AI Kimi K2.7').src],
      ['DeepSeek V4 Pro', byName('DeepSeek V4 Pro').src],
    ],
  },
  {
    when: '31/10/2026',
    kind: 'Prazo documentado',
    title: 'Fim do endpoint Beta do Genie MCP',
    affected: 'Agentes e integrações que usam https://<workspace>/api/2.0/mcp/genie.',
    action: 'Migrar os workloads para o MCP Service system.ai.genie_one_mcp.',
    owner: 'Equipe de IA',
    sources: [['Release note', byName('Genie One MCP server').src]],
  },
  {
    when: '01/11/2026',
    kind: 'Prazo documentado',
    title: 'Configuração de partner-powered AI será removida',
    affected: 'Contas e workspaces que precisam ativar ou desativar partner-powered AI features.',
    action: 'Revisar a configuração e ajustá-la pela Settings API até 01/11/2026; depois, mudanças só pelo account team.',
    owner: 'Plataforma',
    sources: [['Release note', byName('Partner-powered AI').src]],
  },
  {
    when: '16/09/2026',
    kind: 'Mudança publicada',
    title: 'OAuth secrets sem uso expiram em 90 dias',
    affected: 'Service principals com OAuth client secrets usados esporadicamente.',
    action: 'Inventariar integrações M2M de uso eventual e criar um novo secret quando necessário.',
    owner: 'Segurança',
    sources: [['Release note', byName('Unused OAuth client secrets').src]],
  },
  {
    when: '25/09/2026',
    kind: 'Mudança publicada',
    title: 'Excluir pipeline UC preserva as tabelas',
    affected: 'Automações que excluem pipelines do Unity Catalog (modo de publicação padrão) esperando remover tabelas.',
    action: 'Usar cascade=true na API de exclusão quando a remoção das tabelas for desejada.',
    owner: 'Engenharia de dados',
    sources: [['Release note', byName('Deleting a Unity Catalog pipeline').src]],
  },
  {
    when: '30/09/2026',
    kind: 'Mudança publicada',
    title: 'Writeback de planilhas exige habilitação',
    affected: 'Usuários do Excel Add-in e do Google Sheets que gravam dados no Unity Catalog.',
    action: 'Habilitar a configuração Allow spreadsheet writeback nos workspaces que usam writeback.',
    owner: 'Plataforma',
    sources: [['Release note', byName('Control spreadsheet writeback').src]],
  },
  {
    when: '03/09/2026',
    kind: 'Recomendação editorial',
    title: 'Testar antes de adotar environment version 6',
    affected: 'Código que usa dbutils via gateway Py4J ou lê /databricks/runtime/info.json.',
    action: 'Validar notebooks e jobs no environment version 6 antes de migrar, porque essas APIs foram desativadas ou removidas.',
    owner: 'Engenharia de dados',
    sources: [['Notas da versão', 'https://docs.databricks.com/aws/en/release-notes/serverless/environment-version/six']],
  },
]

export const stageOrder = ['GA', 'Public Preview', 'Beta', 'Não informado', 'N/A']
export const stageLabel = {
  GA: 'GA',
  'Public Preview': 'Public Preview',
  Beta: 'Beta',
  'Não informado': 'Não divulgado',
  'N/A': 'Outro evento',
}

export const findItem = (prefix) => byName(prefix)
