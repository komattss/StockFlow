import 'dotenv/config'
import { serve } from '@hono/node-server'
import app from './app'

const port = process.env.PORT ? Number(process.env.PORT) : 8787

// eslint-disable-next-line no-console
console.log(`StockFlow API starting on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port,
})