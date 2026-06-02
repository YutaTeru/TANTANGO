import fs from 'fs'
import http from 'http'
import path from 'path'
import { fileURLToPath } from 'url'

const rootDir = path.dirname(fileURLToPath(new URL('../vite.config.mjs', import.meta.url)))
const distDir = path.join(rootDir, 'dist-unified')
const port = 3000

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
}

const server = http.createServer((request, response) => {
  const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`)
  const pathname = decodeURIComponent(url.pathname)
  const requestedPath = pathname === '/' ? '/index.html' : pathname
  const filePath = path.normalize(path.join(distDir, requestedPath))

  if (!filePath.startsWith(distDir)) {
    response.writeHead(403)
    response.end('Forbidden')
    return
  }

  const finalPath = fs.existsSync(filePath) ? filePath : path.join(distDir, 'index.html')
  const extension = path.extname(finalPath)

  response.writeHead(200, {
    'Content-Type': contentTypes[extension] || 'application/octet-stream',
  })
  fs.createReadStream(finalPath).pipe(response)
})

server.listen(port, '127.0.0.1', () => {
  console.log(`Unified vocab app: http://127.0.0.1:${port}/`)
})

setInterval(() => {}, 1 << 30)
