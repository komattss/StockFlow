import type { users } from '../db/schema'

export type User = typeof users.$inferSelect

export type SafeUser = Omit<User, 'passwordHash'>

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}