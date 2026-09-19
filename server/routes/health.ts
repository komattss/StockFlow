import { Hono } from 'hono'
import { sql } from 'drizzle-orm'
import { db } from '../db'

export const healthRoute = new Hono().get('/health', async (c) => {
  const uptime = process.uptime()

  let dbStatus = 'disconnected'
  let dbError: string | null = null

  try {
    await db.execute(sql`SELECT 1`)
    dbStatus = 'connected'
  } catch (error) {
    dbError = error instanceof Error ? error.message : 'Unknown database error'
  }

  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: Math.round(uptime),
    environment: process.env.NODE_ENV || 'development',
    database: dbStatus,
    ...(dbError && { dbError }),
  })
})