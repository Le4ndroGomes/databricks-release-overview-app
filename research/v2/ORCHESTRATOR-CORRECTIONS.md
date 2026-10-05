# Correções do orquestrador em `web-v2/src/data/models.json` — 03/10/2026

Verificação feita depois da segunda passada do Agente A, direto nas fontes oficiais.

| Modelo | Campo | Antes | Depois | Fonte |
|---|---|---|---|---|
| 9 modelos no Databricks | `databricks.url` | âncoras sem `is-` (ex.: `#openai-gpt-6-astra-now-available…`) | âncora exata de `releases.json` | release notes Databricks set/2026 |
| Qwen3.8-Omni-Flash | nome, data, anúncio | "Qwen 3.8 Omni Flash", 18/09, post no Medium | "Qwen3.8-Omni-Flash", 17/09, documentação oficial | https://www.alibabacloud.com/help/en/model-studio/newly-released-models |
| Qwen3.8-Omni-Flash | resumo | contexto de ~1M tokens (só na imprensa) | entrada texto/imagem/áudio/vídeo, saída em texto, modos thinking/non-thinking | idem |
| Claude Mythos 5.1 | resumo | "variante do Claude 5.5", "1M tokens" | "mesmo modelo do Fable 5.1, com outros níveis de salvaguardas"; programas Cyber Verification e Life Sciences Verification | https://www.anthropic.com/claude-fable-and-mythos-5-1 |
| Claude Fable 5.1 | resumo/diferencial | "flagship", marca d'água, prompt injection | sucessor do Fable 5; ~25% mais barato (até ~45% em trabalho agêntico); Enterprise Frontier Safeguards | idem |
| Claude Opus 5.5 | resumo | "primeiro da família 5.5", "~40%" sem atribuição | nível do Fable 5.1 na maior parte do trabalho; 40% menos que o Opus 5 em cargas típicas; US$ 4/20 por milhão — "segundo a Anthropic" | https://www.anthropic.com/claude-opus-5-5 |
| Claude Sonnet 5.5 | resumo | "30% mais rápida" sem atribuição; "melhor custo-benefício" | 30%+ mais rápido, até 30% menos por tarefa, mesmo preço do Sonnet 5 — "segundo a Anthropic" | https://www.anthropic.com/claude-sonnet-5-5 |
| Gemini 3.8 Flash | resumo/diferencial | genérico | ganhos sobre o 3.7 Flash; mesmo custo (US$ 0,75/3,75); Flash Cyber restrito ao Fairwind | https://blog.google/innovation-and-ai/models-and-research/gemini-models/3-8-flash-and-3-8-flash-cyber/ |
| GPT-6 Astra | resumo/anúncio/acesso | "raciocínio estruturado, documentos" | uso de computador, raciocínio, programação; liberação em fases; ciber de alto risco restrito; anúncio `openai.com/index/gpt-6-astra/` | https://openai.com/index/gpt-6-astra/ (via busca; openai.com retorna 403 para leitura direta) |
| GPT-6 Luna | resumo/diferencial/anúncio | "~50% inferior ao GPT-5.6" (fórum da comunidade) | "most efficient model for focused, high-volume tasks"; 1.050.000 tokens de contexto; US$ 0,10/0,50 | https://developers.openai.com/api/docs/models/gpt-6-luna |
| GPT-6 Sol | resumo/diferencial/anúncio | "alinhamento do Astra" (comunidade) | "built for complex coding and agentic workflows"; 1.050.000 tokens; US$ 2/10 | https://developers.openai.com/api/docs/models/gpt-6-sol |
| GPT-6.1 Sol | resumo | "point-release, estabilidade" | capacidade semelhante à do Astra com custo menor (segundo a OpenAI); multi-agente (Beta) | https://developers.openai.com/api/docs/changelog |
| DeepSeek V4.1 Flash | resumo | ok, refraseado | 552B MoE, 8B/16B ativos, visão nativa, pesos abertos; KV cache 1/4 HBM e 1/8 SSD | https://www.deepseek.com/en/news/deepseek-v4-1-flash/ |
| Grok 4.7 | acesso | `limited` ("fases em parceiros") | `available` — "available today in Cursor and Grok Build… Grok API… cloud platforms" | https://x.ai/news/grok-4-7 |
| Gemini 4 Argon | resumo | "context window de 1M tokens" | limite de **saída** de 1M tokens (antes 64K); benchmarks do fornecedor reduzidos a DeepSWE v1.1 e LVBench | https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-argon/ |
| AA — GPT-6 Luna | score | 38 | 38 confirmado (v4.3.2, variante Max) | https://artificialanalysis.ai/models/gpt-6-luna |
