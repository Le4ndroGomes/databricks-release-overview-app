// Exporta a página como PDF de página única via Chrome DevTools Protocol (respeita @page size).
import { spawn } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { setTimeout as sleep } from 'node:timers/promises'

const [, , url, out, mqTest] = process.argv
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ['--headless=new', '--disable-gpu', '--remote-debugging-port=9333', '--user-data-dir=/tmp/cdp-print', 'about:blank'],
  { stdio: 'ignore' })
let ws
for (let i = 0; i < 50; i++) {
  try {
    const list = await (await fetch('http://127.0.0.1:9333/json/list')).json()
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
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 7660, deviceScaleFactor: 1, mobile: false })
await send('Page.navigate', { url })
await sleep(3000)
const res = await send('Page.printToPDF', { preferCSSPageSize: !process.env.PAPER_W, ...(process.env.PAPER_W ? { paperWidth: +process.env.PAPER_W, paperHeight: +process.env.PAPER_H } : {}), printBackground: true, marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0 })
writeFileSync(out, Buffer.from(res.result.data, 'base64'))
ws.close(); chrome.kill()
console.log('ok', out)
