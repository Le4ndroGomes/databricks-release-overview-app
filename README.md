# Release Overview · Setembro 2026

Publicação editorial (PT-BR) que consolida as atualizações da plataforma Databricks de **setembro de 2026** — 95 atualizações em 8 domínios — num formato executivo, pensado para líderes de dados, IA e arquitetura.

A página é um HTML único e portátil (fontes, estilos e logos embutidos), que abre direto do disco, é anexável por e-mail, imprime em PDF A4 paisagem e também roda como um Databricks App.

> Conteúdo derivado de fontes públicas: release notes oficiais da Databricks (AWS/Azure/GCP), Databricks SQL, blog e newsroom, e anúncios oficiais dos fornecedores de modelos. Veja o rodapé da publicação e `research/` para as fontes.

## Estrutura

```
.
├── web-v2/                 # App React + Vite (Tailwind v4) — fonte da publicação
│   ├── src/                #   componentes, dados (releases.json, models.json), assets, logos
│   ├── print_pdf.mjs       #   exporta a página para PDF A4 paisagem (Chrome DevTools Protocol)
│   └── package.json
├── app-deploy/             # Databricks App (FastAPI servindo o HTML estático)
│   ├── app.py              #   serve static/index.html em 0.0.0.0:$DATABRICKS_APP_PORT
│   ├── app.yaml            #   comando de start
│   ├── requirements.txt
│   └── static/index.html   #   build da publicação
├── build/                  # Scripts Python que montam o inventário e os dados do app
│   ├── inventory.py        #   inventário verificado das atualizações
│   ├── export_web.py       #   exporta para web-v2/src/data/releases.json
│   └── build.py
├── research/               # Notas e fontes da curadoria de modelos de IA
├── inventario-setembro-2026.md
├── release-overview-2026-09-v2.html   # entregável final (HTML único)
└── release-overview-2026-09-v2.pdf    # entregável final (PDF, A4 paisagem)
```

## Pré-requisitos

- Node.js 20+ e npm (ou bun)
- Python 3.10+ (para os scripts em `build/`)
- Google Chrome (para exportar o PDF)
- Databricks CLI v1.16+ (apenas para o deploy do app)

## Desenvolvimento

```bash
cd web-v2
npm install
npm run dev        # servidor de desenvolvimento Vite
```

## Build

O build gera um HTML único (JS, CSS e fontes embutidos via `vite-plugin-singlefile`):

```bash
cd web-v2
npm run build                      # saída em web-v2/dist/index.html
cp dist/index.html ../release-overview-2026-09-v2.html
```

Gerar o PDF (A4 paisagem):

```bash
cd web-v2
node print_pdf.mjs "file://$PWD/../release-overview-2026-09-v2.html" ../release-overview-2026-09-v2.pdf
```

## Deploy como Databricks App

O app serve o HTML estático. Autentique um profile do Databricks CLI e ajuste o caminho de workspace para o seu usuário:

```bash
cp web-v2/dist/index.html app-deploy/static/index.html

databricks apps create release-overview-2026-09 --profile <PROFILE>

WSPATH="/Workspace/Users/<seu-usuario>/release-overview-2026-09"
databricks sync app-deploy "$WSPATH" --profile <PROFILE>
databricks apps deploy release-overview-2026-09 --source-code-path "$WSPATH" --profile <PROFILE>
```

Databricks Apps exigem login SSO; conceda `CAN_USE` ao grupo/usuários que devem acessar.

## Configuração e segurança

- Não há segredos no repositório. O app usa a porta injetada (`DATABRICKS_APP_PORT`) e não requer credenciais em código.
- O estado local do Databricks CLI (`.databricks/`), `node_modules/`, `dist/` e os dados brutos de pesquisa (`raw/`) são ignorados pelo Git.
- A autenticação do CLI é feita por profile local (`databricks auth login`), fora do repositório.

## Stack

React 19 · Vite 8 · Tailwind CSS v4 · vite-plugin-singlefile · FastAPI (deploy) · Databricks Apps.
