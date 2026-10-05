# Especificação do usuário (verbatim) — Release Overview v2

Atue como Senior Product Designer, UX Engineer e Front-end Architect especializado em experiências premium para produtos de tecnologia.

Você receberá o arquivo `release-overview-2026-09.html`.

Sua tarefa é IMPLEMENTAR melhorias nesse HTML e entregar a versão final funcional. Não se limite a avaliar, sugerir ou apresentar um plano.

## 1. Objetivo e direção visual

Transforme a publicação em uma experiência editorial interativa, executiva e premium, inspirada na disciplina visual das páginas de produto da Apple, preservando a identidade Databricks.

A experiência deve permitir:
- Compreender os destaques rapidamente.
- Explorar novidades por interesse.
- Identificar mudanças que exigem ação.
- Consultar informações técnicas e fontes sem perder o contexto.

Preserve os elementos que já funcionam:
- Tipografia DM Sans.
- Paleta Databricks, com vermelho usado de forma seletiva.
- Espaço em branco.
- Destaque escuro para Genie One MCP.
- Ícones oficiais de produto já presentes.
- Conteúdo técnico, fontes e distinções de maturidade.

Evite efeitos decorativos excessivos, glassmorphism generalizado, gradientes gratuitos, carrosséis automáticos, animações contínuas e aparência de dashboard genérico.

## 2. Estrutura editorial

Reorganize a página nesta ordem e atualize a numeração:

Abertura — síntese executiva.
01 — Lançamentos principais.
02 — O que muda na prática.
03 — Requer ação.
04 — Panorama dos lançamentos.
05 — Atualizações por domínio.
06 — Modelos de IA: setembro em perspectiva.
07 — Índice completo.
Rodapé — fontes e metodologia.

Preserve os dados existentes. Não altere contagens apenas para acomodar o novo layout.

A seção de modelos é uma perspectiva complementar. Não some seus registros às 95 atualizações existentes nem duplique lançamentos na contagem.

## 3. Abertura

Use a seguinte direção para a headline, ajustando apenas se necessário para preservar a precisão:

“Mais contexto para agentes.
Mais controle sobre dados e IA.”

Mantenha “Setembro 2026” claramente visível.

Inclua:
- Síntese executiva curta.
- CTA principal: “Explorar os destaques”.
- CTA secundário: “Ver prazos e ações”.
- Indicadores atuais, com hierarquia equilibrada.

Reduza a dominância visual do número 95. O volume de atualizações deve apoiar a narrativa.

Use tipografia responsiva com `clamp()` e evite quebras de linha rígidas que prejudiquem telas menores.

## 4. Navegação

Implemente uma navegação compacta e persistente, com indicação da seção ativa.

Sugestão de destinos:
“Destaques”, “Impacto”, “Ações”, “Panorama”, “Modelos”, “Índice”.

Requisitos:
- Âncoras estáveis e links diretos para seções.
- Scroll sem ocultar títulos sob o cabeçalho.
- Indicação ativa por posição de leitura.
- Navegação por teclado e foco visível.
- No mobile, seletor compacto “Nesta edição”.
- Links dos domínios na abertura devem levar ao domínio específico, não ao mesmo destino genérico.

## 5. Cards de lançamentos

Preserve Genie One MCP como principal destaque visual.

Nos cards, mantenha inicialmente:
- Nome do produto.
- Estágio de disponibilidade.
- Uma frase sobre a mudança.
- Por que importa.
- Prazo ou restrição decisiva, quando existir.

Disponibilize sob “Ver detalhes”:
- Descrição técnica.
- Pré-requisitos.
- Restrições.
- Clouds.
- Fonte oficial.

Prefira expansão inline acessível. Preserve o contexto de leitura ao abrir e fechar.

Não esconda condições que possam mudar uma decisão de adoção. Diferencie claramente GA, Beta e Public Preview.

## 6. Seção “Requer ação”

Organize cada item com:
- Prazo completo, incluindo o ano.
- Quem é afetado.
- Ação necessária, com verbo direto.
- Responsável sugerido: plataforma, segurança, engenharia ou equipe de IA.
- Fonte oficial.

Responsáveis são sugestões por função, não atribuições reais.

Mantenha datas absolutas como referência principal. Não crie urgência artificial nem confunda recomendação editorial com obrigação documentada.

## 7. Nova seção 06 — Modelos de IA: setembro em perspectiva

Crie uma timeline dos principais modelos de IA lançados publicamente entre 1 e 30 de setembro de 2026, priorizando LLMs e modelos multimodais relevantes para uso empresarial.

Pesquise na web antes de preencher esta seção.

### Escopo e datas

Diferencie explicitamente:
1. Lançamento original pelo fornecedor.
2. Disponibilização no Databricks.

A timeline principal deve representar o lançamento original do modelo em setembro.

Um modelo lançado anteriormente e disponibilizado no Databricks em setembro deve aparecer em um grupo complementar: “Chegaram ao Databricks neste mês”.

Não apresente uma integração no Databricks como lançamento mundial.

Não inclua rumores ou modelos sem data verificável. Anúncios sem acesso disponível devem receber identificação explícita.

### Conteúdo por modelo

Apresente:
- Data.
- Fornecedor.
- Nome e versão exatos.
- Descrição de até duas frases.
- Principal diferencial documentado.
- Índice ou benchmark disponível.
- Situação no Databricks, somente quando confirmada.
- Links para anúncio oficial e avaliação.

As descrições devem explicar o que distingue o modelo: raciocínio, programação, multimodalidade, eficiência, contexto ou execução de ferramentas.

Evite “o mais avançado”, “revolucionário” e outras qualificações sem evidência comparável.

### Índices e benchmarks

Priorize o **Artificial Analysis Intelligence Index**, quando houver resultado público verificável para aquela versão do modelo.

Para cada pontuação, registre:
- Nome do índice.
- Versão ou metodologia, quando informada.
- Pontuação e escala.
- Data da avaliação ou consulta.
- Fonte.
- Configuração relevante, como variante e nível de reasoning effort.

Se esse índice não estiver disponível, use outro benchmark pertinente e confiável, identificado pelo nome.

Regras obrigatórias:
- Não invente, estime ou derive pontuações ausentes.
- Não converta métricas diferentes para uma escala artificial.
- Não compare resultados de metodologias, versões ou configurações incompatíveis.
- Não use posição no ranking sem indicar universo e data.
- Não confunda percentual de acerto com índice agregado.
- Diferencie avaliação independente de resultado divulgado pelo fornecedor.
- Não apresente resultado consultado posteriormente como se fosse conhecido no lançamento.

Quando não houver pontuação verificável, mostre:
“Sem avaliação pública verificada”.

A ausência de benchmark não deve excluir um lançamento relevante e confirmado.

### Tratamento visual

No desktop:
- Timeline vertical editorial.
- Coluna de datas à esquerda.
- Conteúdo do lançamento no centro.
- Coluna compacta de avaliação à direita.
- Linha fina, marcadores discretos e espaçamento generoso.
- Agrupamento por semana quando houver muitos lançamentos.

No mobile:
- Coluna única.
- Data acima do modelo.
- Benchmark abaixo da descrição.
- Sem rolagem horizontal obrigatória.

Exemplo de estrutura, sem preencher com dados fictícios:

[Data]  [Fornecedor · Modelo]
        [Descrição breve e diferencial]
        [Índice · Pontuação · Data da avaliação]
        [Situação no Databricks, se confirmada]
        [Anúncio oficial] [Avaliação]

Não use barras comparativas quando os índices não forem diretamente comparáveis.

Inclua uma nota metodológica curta sobre seleção dos modelos, datas e limitações de comparação. Se a curadoria não for exaustiva, chame-a de “principais lançamentos verificados”.

Se a pesquisa estiver indisponível, conclua as demais melhorias e declare a limitação. Não publique exemplos inventados como resultados reais.

### Logos oficiais dos fornecedores e modelos

Inclua a identidade visual oficial em cada lançamento da timeline.

**Seleção do logo**
- Priorize o logo oficial do modelo ou da família de modelos, quando existir.
- Caso contrário, use o logo oficial do fornecedor.
- Exiba sempre o nome do fornecedor e o nome completo do modelo em texto.
- Use apenas um logo principal por item, evitando duplicidade visual.

**Origem e fidelidade**
- Obtenha os arquivos em sites oficiais, páginas de produto, brand kits ou repositórios oficiais.
- Prefira SVG; use PNG transparente em alta resolução quando necessário.
- Não desenhe, gere com IA ou improvise logotipos.
- Preserve proporções, cores e área de proteção.
- Use versões monocromáticas ou para fundos escuros somente quando disponibilizadas oficialmente.
- Não aplique filtros CSS para recolorir marcas.

**Tratamento visual premium**
- Posicione o logo à esquerda do nome do modelo, alinhado ao bloco de identificação.
- Utilize um espaço consistente de aproximadamente 40 × 40 px no desktop e 32 × 32 px no mobile.
- Ajuste o tamanho óptico de cada marca dentro desse espaço, sem distorcer ou cortar.
- Prefira símbolos compactos; quando só houver wordmark, reserve largura adequada.
- Mantenha os logos discretos: o nome, a descrição e a avaliação devem continuar sendo o foco.
- Evite sombras, molduras e fundos decorativos desnecessários.

**Implementação e acessibilidade**
- Incorpore os arquivos ao HTML para preservar a portabilidade e evitar dependência de hotlinks.
- Defina dimensões explícitas para impedir mudanças de layout durante o carregamento.
- Se o nome da marca já estiver ao lado, use texto alternativo vazio no logo para evitar leitura duplicada por leitores de tela.
- Se não encontrar um arquivo oficial verificável, mantenha apenas o nome em texto, sem ícone substituto.
- Registre a URL de origem de cada logo na documentação da entrega.

Aplique esse padrão tanto à timeline de lançamentos originais quanto ao grupo “Chegaram ao Databricks neste mês”.

## 8. Índice completo pesquisável

Transforme o índice em uma ferramenta de consulta com:
- Busca por produto, capacidade ou termo.
- Filtros por domínio, estágio e cloud.
- Contagem dos resultados.
- “Limpar filtros”.
- Estado vazio útil.
- Detalhes inline com mudança, impacto, restrições e fonte.

Reutilize os dados estruturados já existentes.

Implemente filtro de cloud por inclusão: selecionar AWS também deve retornar itens disponíveis em AWS, Azure e GCP.

No mobile, priorize leitura e toque confortável. Evite quatro colunas comprimidas e textos excessivamente pequenos.

## 9. Sistema visual

Consolide os estilos em tokens consistentes:
- Escala tipográfica reduzida.
- Texto de leitura aproximadamente entre 16–18 px.
- Metadados aproximadamente entre 12–13 px.
- Monoespaçada principalmente para datas, versões e identificadores.
- Raios entre 12–16 px nos cards principais, se harmonizarem com o conjunto.
- Bordas discretas e sombras usadas apenas quando ajudarem a indicar elevação.
- Espaçamento baseado em múltiplos consistentes.
- Comprimento confortável das linhas.

Preserve contraste suficiente em textos secundários e badges.

Use ícones oficiais existentes quando fizerem sentido. Não invente logotipos ou substitua marcas por símbolos aproximados.

## 10. Gráficos e interações

Refine os gráficos existentes:
- Tooltips por mouse, teclado e toque.
- Rótulos legíveis.
- Seleção com significado explícito.
- Resumo textual acessível.
- Cores consistentes entre gráfico, legenda e filtros.

Use transições breves e funcionais. Respeite `prefers-reduced-motion`.

Não use scroll hijacking, contadores animados ou animações que atrasem a leitura.

## 11. Integridade editorial

Preserve a distinção entre:
- Disponibilidade geral.
- Beta.
- Public Preview.
- Estágio não divulgado.
- Eventos sem estágio aplicável.

Não reintroduza Private Preview na publicação ao cliente.

GA não significa automaticamente adequação a qualquer workload: mantenha condições de cloud, região, configuração e pré-requisitos relevantes.

Não altere afirmações técnicas silenciosamente. Se detectar divergência factual, valide a fonte e relate a correção ao final.

## 12. Qualidade técnica e distribuição

Inspecione o arquivo antes de implementar. Caso seja um bundle compilado, evite substituições globais frágeis; use uma abordagem controlada que preserve componentes e dados.

Entregue um HTML funcional e portátil:
- Sem dependência de servidor de desenvolvimento.
- Sem caminhos locais inacessíveis.
- Sem erros no console.
- Sem links internos quebrados.
- Sem overflow horizontal inesperado.

Verifique o link para `inventario-setembro-2026.md`. Se o arquivo não estiver disponível, remova a dependência ou incorpore o conteúdo correspondente; não mantenha um download quebrado.

Prepare impressão/PDF:
- Ocultar controles sem utilidade no papel.
- Expor informações essenciais escondidas em expansões.
- Evitar cortes de cards e títulos isolados.
- Preservar legibilidade e fontes.
- Definir quebras e margens adequadas.

## 13. Validação e entrega

Valide em navegador:
- Desktop: 1440 px.
- Tablet: 768 px.
- Mobile: 390 px.
- Busca e combinação de filtros.
- Navegação e seção ativa.
- Expansão de detalhes.
- Teclado, foco e toque.
- Impressão.
- Integridade das contagens.

Entregue:
1. HTML final atualizado.
2. Resumo curto das melhorias implementadas.
3. Fontes usadas para a timeline e seus benchmarks.
4. Limitações ou dados que não puderam ser confirmados.
