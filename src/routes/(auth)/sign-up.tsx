import { createFileRoute, redirect } from '@tanstack/react-router'
import { SignUp } from '@/features/auth/sign-up'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/(auth)/sign-up')({
  component: SignUp,
  beforeLoad: () => {
    const { user } = useAuthStore.getState()
    if (user) {
      throw redirect({ to: '/' })
    }
  },
})