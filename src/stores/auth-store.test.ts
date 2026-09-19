import { clearCookies } from '@/test-utils/cookies'
import { beforeEach, describe, expect, it, vi } from 'vitest'

async function importAuthStore() {
  const { useAuthStore } = await import('./auth-store')
  return useAuthStore
}

const sampleUser = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  role: 'inventory_staff',
  status: 'active',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
}

describe('useAuthStore', () => {
  beforeEach(() => {
    clearCookies()
    vi.resetModules()
  })

  it('starts with empty tokens and no user when nothing is persisted', async () => {
    const useAuthStore = await importAuthStore()

    expect(useAuthStore.getState().accessToken).toBe('')
    expect(useAuthStore.getState().refreshToken).toBe('')
    expect(useAuthStore.getState().user).toBeNull()
  })

  it('persists tokens so a new store instance reads them back', async () => {
    const useAuthStore = await importAuthStore()
    useAuthStore
      .getState()
      .setTokens('access-token', 'refresh-token')

    vi.resetModules()
    const useAuthStoreAfterReload = await importAuthStore()

    expect(useAuthStoreAfterReload.getState().accessToken).toBe('access-token')
    expect(useAuthStoreAfterReload.getState().refreshToken).toBe('refresh-token')
  })

  it('persists user so a new store instance reads it back', async () => {
    const useAuthStore = await importAuthStore()
    useAuthStore.getState().setUser(sampleUser)

    vi.resetModules()
    const useAuthStoreAfterReload = await importAuthStore()

    expect(useAuthStoreAfterReload.getState().user).toEqual(sampleUser)
  })

  it('clearAuth removes user, tokens and persistence', async () => {
    const useAuthStore = await importAuthStore()
    useAuthStore
      .getState()
      .setTokens('access-to-clear', 'refresh-to-clear')
    useAuthStore.getState().setUser(sampleUser)

    useAuthStore.getState().clearAuth()

    expect(useAuthStore.getState().user).toBeNull()
    expect(useAuthStore.getState().accessToken).toBe('')
    expect(useAuthStore.getState().refreshToken).toBe('')

    vi.resetModules()
    const useAuthStoreAfterReload = await importAuthStore()

    expect(useAuthStoreAfterReload.getState().user).toBeNull()
    expect(useAuthStoreAfterReload.getState().accessToken).toBe('')
    expect(useAuthStoreAfterReload.getState().refreshToken).toBe('')
  })

  it('setUser updates user state', async () => {
    const useAuthStore = await importAuthStore()

    useAuthStore.getState().setUser(sampleUser)

    expect(useAuthStore.getState().user).toEqual(sampleUser)
  })

  it('setUser with null clears user', async () => {
    const useAuthStore = await importAuthStore()
    useAuthStore.getState().setUser(sampleUser)
    useAuthStore.getState().setUser(null)

    expect(useAuthStore.getState().user).toBeNull()
  })
})