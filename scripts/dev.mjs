import { createServer } from 'vite'
import config from '../vite.config.mjs'

const server = await createServer(config)
await server.listen()
server.printUrls()

setInterval(() => {}, 1 << 30)
