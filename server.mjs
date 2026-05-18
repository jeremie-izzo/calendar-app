import { createServer } from 'node:http'
import { Readable } from 'node:stream'
import { createReadStream, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join, normalize } from 'node:path'
import handler from './dist/server/server.js'

const port = Number(process.env.PORT) || 3000
const host = process.env.HOST || '0.0.0.0'
const clientDir = fileURLToPath(new URL('./dist/client/', import.meta.url))

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json',
}

function tryServeStatic(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') return false
  const rawPath = decodeURI(req.url.split('?')[0])
  if (rawPath === '/' || rawPath.includes('..')) return false
  const filePath = normalize(join(clientDir, rawPath))
  if (!filePath.startsWith(clientDir)) return false
  let stat
  try {
    stat = statSync(filePath)
  } catch {
    return false
  }
  if (!stat.isFile()) return false
  const ext = filePath.slice(filePath.lastIndexOf('.')).toLowerCase()
  res.statusCode = 200
  res.setHeader('content-type', MIME[ext] ?? 'application/octet-stream')
  res.setHeader('content-length', stat.size)
  if (rawPath.startsWith('/assets/')) {
    res.setHeader('cache-control', 'public, max-age=31536000, immutable')
  }
  if (req.method === 'HEAD') {
    res.end()
  } else {
    createReadStream(filePath).pipe(res)
  }
  return true
}

const server = createServer(async (req, res) => {
  try {
    if (tryServeStatic(req, res)) return
    const url = `http://${req.headers.host}${req.url}`
    const init = { method: req.method, headers: req.headers }
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      init.body = Readable.toWeb(req)
      init.duplex = 'half'
    }
    const webRes = await handler.fetch(new Request(url, init))
    res.statusCode = webRes.status
    webRes.headers.forEach((value, key) => res.setHeader(key, value))
    if (webRes.body) {
      Readable.fromWeb(webRes.body).pipe(res)
    } else {
      res.end()
    }
  } catch (err) {
    console.error(err)
    if (!res.headersSent) {
      res.statusCode = 500
      res.end('Internal Server Error')
    } else {
      res.end()
    }
  }
})

server.listen(port, host, () => {
  console.log(`Listening on http://${host}:${port}`)
})
