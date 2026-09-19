import type { Context, Next } from 'hono'
import { verifyAccessToken, type AccessTokenPayload } from '../lib/jwt'

declare module 'hono' {
  interface ContextVariableMap {
    user: AccessTokenPayload
  }
}

export async function requireAuth(c: Context, next: Next) {
  const header = c.req.header('Authorization')

  if (!header || !header.startsWith('Bearer ')) {
    return c.json(
      {
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Missing or invalid authorization header',
        },
      },
      401
    )
  }

  const token = header.slice(7)

  try {
    const payload = verifyAccessToken(token)

    if (payload.type !== 'access') {
      return c.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Invalid token type',
          },
        },
        401
      )
    }

    c.set('user', payload)
    await next()
  } catch {
    return c.json(
      {
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid or expired access token',
        },
      },
      401
    )
  }
}

export function requireRole(...roles: string[]) {
  return async (c: Context, next: Next) => {
    const user = c.get('user')

    if (!roles.includes(user.role)) {
      return c.json(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Insufficient permissions',
          },
        },
        403
      )
    }

    await next()
  }
}