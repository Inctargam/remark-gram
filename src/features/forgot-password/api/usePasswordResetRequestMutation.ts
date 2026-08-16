import { useMutation } from '@tanstack/react-query'

import { apiClient } from '@/shared/api/openapi'
import type { SchemaPasswordResetDto } from '@/shared/api/openapi/schema'

export const usePasswordResetRequestMutation = () =>
  useMutation({
    meta: { globalErrorHandler: 'off' },
    mutationFn: async (payload: SchemaPasswordResetDto) => {
      const { error, response } = await apiClient.POST('/api/v1/auth/password-reset/request', {
        body: payload,
      })

      // TODO(api-error-middleware): Remove after the API client rejects errors centrally.
      if (!response.ok) {
        const message = Array.isArray(error?.message) ? error.message.join(', ') : error?.message

        throw new Error(message ?? `Password reset request failed with ${response.status}`)
      }
    },
  })
