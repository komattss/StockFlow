import { createFileRoute, redirect } from '@tanstack/react-router'
import { SignIn2 } from '@/features/auth/sign-in/sign-in-2'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/(auth)/sign-in-2')({
  component: SignIn2,
  beforeLoad: () => {
    const { user } = useAuthStore.getState()
    if (user) {
      throw redirect({ to: '/' })
    }
  },
})