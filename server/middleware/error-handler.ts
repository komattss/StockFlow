import type { Context } from 'hono'
import { HTTPException } from 'hono/http-exception'

export function errorHandler(err: Error, c: Context) {
  if (err instanceof HTTPException) {
    return c.json(
      {
        success: false,
        error: {
          code: 'HTTP_ERROR',
          message: err.message,
        },
      },
      { status: err.status }
    )
  }

  // eslint-disable-next-line no-console
  console.error('Unhandled error:', err.message)

  return c.json(
    {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
      },
    },
    500
  )
}