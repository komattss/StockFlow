import { eq } from 'drizzle-orm'
import { db } from '../db'
import { users } from '../db/schema'
import { hashPassword, verifyPassword } from '../lib/password'
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../lib/jwt'
import type { SafeUser, AuthTokens } from '../types/auth'

function toSafeUser(user: typeof users.$inferSelect): SafeUser {
  const { passwordHash: _, ...safe } = user
  return safe
}

export async function registerUser(dto: {
  name: string
  email: string
  password: string
}): Promise<{ user: SafeUser; tokens: AuthTokens }> {
  const normalizedEmail = dto.email.toLowerCase().trim()

  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, normalizedEmail))
    .limit(1)

  if (existing.length > 0) {
    throw new AuthError('DUPLICATE_EMAIL', 'An account with this email already exists')
  }

  const passwordHash = await hashPassword(dto.password)

  const [newUser] = await db
    .insert(users)
    .values({
      name: dto.name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: 'inventory_staff',
      status: 'active',
    })
    .returning()

  const tokens = generateTokens(newUser.id, newUser.role)

  return { user: toSafeUser(newUser), tokens }
}

export async function loginUser(dto: {
  email: string
  password: string
}): Promise<{ user: SafeUser; tokens: AuthTokens }> {
  const normalizedEmail = dto.email.toLowerCase().trim()

  const [found] = await db
    .select()
    .from(users)
    .where(eq(users.email, normalizedEmail))
    .limit(1)

  if (!found) {
    throw new AuthError('INVALID_CREDENTIALS', 'Invalid email or password')
  }

  const valid = await verifyPassword(dto.password, found.passwordHash)
  if (!valid) {
    throw new AuthError('INVALID_CREDENTIALS', 'Invalid email or password')
  }

  if (found.status === 'inactive') {
    throw new AuthError('ACCOUNT_INACTIVE', 'This account has been deactivated')
  }

  const tokens = generateTokens(found.id, found.role)

  return { user: toSafeUser(found), tokens }
}

export async function refreshAccessToken(
  refreshToken: string
): Promise<{ user: SafeUser; tokens: AuthTokens }> {
  let payload
  try {
    payload = verifyRefreshToken(refreshToken)
  } catch {
    throw new AuthError('INVALID_TOKEN', 'Invalid or expired refresh token')
  }

  if (payload.type !== 'refresh') {
    throw new AuthError('INVALID_TOKEN', 'Invalid token type')
  }

  const [found] = await db
    .select()
    .from(users)
    .where(eq(users.id, payload.sub))
    .limit(1)

  if (!found) {
    throw new AuthError('INVALID_TOKEN', 'User no longer exists')
  }

  if (found.status === 'inactive') {
    throw new AuthError('ACCOUNT_INACTIVE', 'This account has been deactivated')
  }

  const tokens = generateTokens(found.id, found.role)

  return { user: toSafeUser(found), tokens }
}

export async function getMe(userId: number): Promise<SafeUser> {
  const [found] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)

  if (!found) {
    throw new AuthError('USER_NOT_FOUND', 'User not found')
  }

  return toSafeUser(found)
}

function generateTokens(userId: number, role: string): AuthTokens {
  return {
    accessToken: signAccessToken({ sub: userId, role }),
    refreshToken: signRefreshToken({ sub: userId }),
  }
}

export class AuthError extends Error {
  constructor(
    public code: string,
    message: string
  ) {
    super(message)
    this.name = 'AuthError'
  }
}