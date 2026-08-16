import { useMutation } from '@tanstack/react-query'

import { apiClient } from '@/shared/api/openapi'
import type { SchemaRegistrationDto } from '@/shared/api/openapi/schema'

export const useRegisterMutation = () =>
  useMutation({
    meta: { globalErrorHandler: 'off' },
    mutationFn: async (payload: SchemaRegistrationDto) => {
      const { error, response } = await apiClient.POST('/api/v1/auth/registration', {
        body: payload,
      })

      // TODO(api-error-middleware): Remove after the API client rejects errors centrally.
      if (!response.ok) {
        const message = Array.isArray(error?.message) ? error.message.join(', ') : error?.message

        throw new Error(message ?? `Registration failed with ${response.status}`)
      }
    },
  })
