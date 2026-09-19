import jwt from 'jsonwebtoken'
import { getEnv } from '../config/env'

export interface AccessTokenPayload {
  sub: number
  role: string
  type: 'access'
}

export interface RefreshTokenPayload {
  sub: number
  type: 'refresh'
}

export function signAccessToken(
  payload: Omit<AccessTokenPayload, 'type'>
): string {
  const env = getEnv()
  const tokenPayload = { ...payload, type: 'access' as const }
  return jwt.sign(tokenPayload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.ACCESS_TOKEN_EXPIRES_IN as never,
  })
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const env = getEnv()
  const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET)
  return decoded as unknown as AccessTokenPayload
}

export function signRefreshToken(
  payload: Omit<RefreshTokenPayload, 'type'>
): string {
  const env = getEnv()
  const tokenPayload = { ...payload, type: 'refresh' as const }
  return jwt.sign(tokenPayload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRES_IN as never,
  })
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  const env = getEnv()
  const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET)
  return decoded as unknown as RefreshTokenPayload
}