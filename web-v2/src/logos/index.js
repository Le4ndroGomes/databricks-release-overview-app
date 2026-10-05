// Logos oficiais dos fornecedores e famílias de modelos — origem de cada arquivo em SOURCE.md.
// Importados com ?url: o build singlefile embute os arquivos como data URI (sem hotlink).
// Sem arquivo oficial verificável, a chave fica de fora e o item mostra só o nome em texto.
import claudeSvg from './claude.svg?url'
import deepseekSvg from './deepseek.svg?url'
import geminiPng from './gemini.png?url'
import googlePng from './google.png?url'
import openaiPng from './openai.png?url'
import qwenPng from './qwen.png?url'
import xaiPng from './xai.png?url'

// ratio = largura / altura do desenho; wordmarks recebem largura reservada no layout.
export const logos = {
  claude: { src: claudeSvg, kind: 'symbol', ratio: 1, source: 'https://claude.ai/favicon.svg' },
  gemini: { src: geminiPng, kind: 'symbol', ratio: 1, source: 'https://www.gstatic.com/lamda/images/gemini_sparkle_4g_512_lt_f94943af3be039176192d.png' },
  google: { src: googlePng, kind: 'symbol', ratio: 1, source: 'https://avatars.githubusercontent.com/u/1342004?s=460' },
  openai: { src: openaiPng, kind: 'symbol', ratio: 1, source: 'https://avatars.githubusercontent.com/u/14957082?s=200' },
  deepseek: { src: deepseekSvg, kind: 'wordmark', ratio: 195 / 41.36, source: 'https://raw.githubusercontent.com/deepseek-ai/DeepSeek-V2/main/figures/logo.svg' },
  qwen: { src: qwenPng, kind: 'symbol', ratio: 1, source: 'https://chat.qwen.ai/static/favicon.png' },
  xai: { src: xaiPng, kind: 'symbol', ratio: 1, source: 'https://x.ai/icon.png' },
}

// Logo da família tem prioridade; senão, o do fornecedor; senão, nenhum.
export function getLogo(familyKey, vendorKey) {
  return logos[familyKey] ?? logos[vendorKey] ?? null
}
