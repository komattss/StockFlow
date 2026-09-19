import { Hono } from 'hono'
import { z } from 'zod'
import { requireAuth } from '../middleware/auth'
import { AuthError, registerUser, loginUser, refreshAccessToken, getMe } from '../services/auth.service'

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  email: z.string().email('Invalid email format').max(255),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be at most 128 characters'),
})

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
})

const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
})

export const authRoute = new Hono()
  .post('/register', async (c) => {
    const body = await c.req.json()
    const parsed = registerSchema.safeParse(body)
    if (!parsed.success) {
      return c.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request data',
            details: parsed.error.issues.map((i) => ({
              field: i.path.join('.'),
              message: i.message,
            })),
          },
        },
        400
      )
    }

    try {
      const result = await registerUser(parsed.data)
      return c.json({ success: true, data: result }, 201)
    } catch (err) {
      if (err instanceof AuthError) {
        return c.json(
          {
            success: false,
            error: { code: err.code, message: err.message },
          },
          err.code === 'DUPLICATE_EMAIL' ? 409 : 400
        )
      }
      throw err
    }
  })
  .post('/login', async (c) => {
    const body = await c.req.json()
    const parsed = loginSchema.safeParse(body)
    if (!parsed.success) {
      return c.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request data',
            details: parsed.error.issues.map((i) => ({
              field: i.path.join('.'),
              message: i.message,
            })),
          },
        },
        400
      )
    }

    try {
      const result = await loginUser(parsed.data)
      return c.json({ success: true, data: result }, 200)
    } catch (err) {
      if (err instanceof AuthError) {
        const status = err.code === 'ACCOUNT_INACTIVE' ? 403 : 401
        return c.json(
          {
            success: false,
            error: { code: err.code, message: err.message },
          },
          status
        )
      }
      throw err
    }
  })
  .post('/refresh', async (c) => {
    const body = await c.req.json()
    const parsed = refreshSchema.safeParse(body)
    if (!parsed.success) {
      return c.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request data',
            details: parsed.error.issues.map((i) => ({
              field: i.path.join('.'),
              message: i.message,
            })),
          },
        },
        400
      )
    }

    try {
      const result = await refreshAccessToken(parsed.data.refreshToken)
      return c.json({ success: true, data: result }, 200)
    } catch (err) {
      if (err instanceof AuthError) {
        return c.json(
          {
            success: false,
            error: { code: err.code, message: err.message },
          },
          401
        )
      }
      throw err
    }
  })
  .post('/logout', async (c) => {
    return c.json({
      success: true,
      data: { message: 'Logged out. Discard tokens on the client.' },
    })
  })
  .get('/me', requireAuth, async (c) => {
    const user = c.get('user')
    try {
      const result = await getMe(user.sub)
      return c.json({ success: true, data: { user: result } }, 200)
    } catch (err) {
      if (err instanceof AuthError) {
        return c.json(
          {
            success: false,
            error: { code: err.code, message: err.message },
          },
          404
        )
      }
      throw err
    }
  })