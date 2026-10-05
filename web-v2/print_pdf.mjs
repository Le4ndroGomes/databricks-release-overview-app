// Gera PDF com respectivas margens A4 e estilos de impressão
import { spawn } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { setTimeout as sleep } from 'node:timers/promises'

const [, , url, out] = process.argv

const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ['--headless=new', '--disable-gpu', '--remote-debugging-port=9343', '--user-data-dir=/tmp/cdp-c', 'about:blank'],
  { stdio: 'ignore' })

let ws
for (let i = 0; i < 50; i++) {
  try {
    const list = await (await fetch('http://127.0.0.1:9343/json/list')).json()
    const page = list.find((t) => t.type === 'page')
    if (page) { ws = new WebSocket(page.webSocketDebuggerUrl); break }
  } catch {}
  await sleep(200)
}
await new Promise((r) => ws.addEventListener('open', r, { once: true }))

let id = 0
const pending = new Map()
ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data)
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id) }
})
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })) })

await send('Page.enable')
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 10000, deviceScaleFactor: 1, mobile: false })
await send('Page.navigate', { url })
await sleep(2500)

// A4 paisagem (297 × 210 mm, margens 10/12 mm). Tamanho e margens vêm do @page em src/index.css.
// Escala 0,8: a largura útil do A4 passa de ~688 px para ~860 px e o layout de tablet (md) entra em vigor.
const res = await send('Page.printToPDF', {
  preferCSSPageSize: true,
  // Papel explícito em A4 paisagem: o Chrome avalia as media queries pelo papel informado aqui
  // (padrão Carta retrato, 816 px), não pelo @page — sem isso o layout desktop não entra.
  paperWidth: 11.69,
  paperHeight: 8.27,
  scale: Number(process.env.PDF_SCALE ?? 0.8),
  printBackground: true,
  marginTop: 0,
  marginBottom: 0,
  marginLeft: 0,
  marginRight: 0
})

writeFileSync(out, Buffer.from(res.result.data, 'base64'))
ws.close()
chrome.kill()
console.log('✓ PDF gerado:', out)
