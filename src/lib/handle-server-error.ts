import { AxiosError } from 'axios'
import { toast } from 'sonner'

export function handleServerError(error: unknown) {
  if (import.meta.env.DEV) {
    if (error instanceof AxiosError) {
      const { status } = error.response ?? {}
      const body = error.response?.data
      const code = body?.error?.code
      const message = body?.error?.message
      // eslint-disable-next-line no-console
      console.log({ status, code, message })
    }
  }

  let errMsg = 'Something went wrong!'

  if (
    error &&
    typeof error === 'object' &&
    'status' in error &&
    Number(error.status) === 204
  ) {
    errMsg = 'No content.'
  }

  if (error instanceof AxiosError) {
    const body = error.response?.data
    if (body?.error?.message && typeof body.error.message === 'string') {
      errMsg = body.error.message
    }
  }

  toast.error(errMsg)
}
