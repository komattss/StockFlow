import { useAuthStore } from '@/stores/auth-store'

const ROLE_HIERARCHY: Record<string, number> = {
  admin: 4,
  inventory_staff: 3,
  finance_staff: 2,
  viewer: 1,
}

export function hasRole(...roles: string[]): boolean {
  const user = useAuthStore.getState().user
  if (!user) return false
  return roles.includes(user.role)
}

export function hasMinRole(role: string): boolean {
  const user = useAuthStore.getState().user
  if (!user) return false
  return (ROLE_HIERARCHY[user.role] || 0) >= (ROLE_HIERARCHY[role] || 0)
}

export function useRole() {
  const user = useAuthStore((s) => s.user)
  return {
    user,
    role: user?.role,
    can: (...roles: string[]) => {
      if (!user) return false
      return roles.includes(user.role)
    },
    isAdmin: user?.role === 'admin',
    isInventoryStaff: user?.role === 'inventory_staff',
    isFinanceStaff: user?.role === 'finance_staff',
    isViewer: user?.role === 'viewer',
  }
}