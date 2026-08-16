import type { Mutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { Alert } from '@/shared/ui/alert'

export const mutationGlobalErrorHandler = (
  error: Error,
  _variables: unknown,
  _onMutateResult: unknown,
  mutation: Mutation<unknown, unknown, unknown>
) => {
  if (mutation.meta?.globalErrorHandler === 'off') {
    return
  }

  toast(<Alert variant="error">{error.message}</Alert>)
}
