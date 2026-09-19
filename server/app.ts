import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { getEnv } from './config/env'
import { healthRoute } from './routes/health'
import { authRoute } from './routes/auth'
import { errorHandler } from './middleware/error-handler'

getEnv()

const app = new Hono()

app.use(
  '*',
  cors({
    origin: getEnv().FRONTEND_URL,
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
)

app.onError(errorHandler)

app.route('/api', healthRoute)
app.route('/api/auth', authRoute)

export default app