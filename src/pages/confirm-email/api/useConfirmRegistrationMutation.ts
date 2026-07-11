import { useMutation } from '@tanstack/react-query'

import { apiClient } from '@/shared/api/openapi'
import type { SchemaConfirmRegistrationDto } from '@/shared/api/openapi/schema'

export const useConfirmRegistrationMutation = () =>
  useMutation({
    mutationFn: async (payload: SchemaConfirmRegistrationDto) => {
      const { error, response } = await apiClient.POST('/api/v1/auth/registration/confirmation', {
        body: payload,
      })

      // TODO(api-error-middleware): Remove after the API client rejects errors centrally.
      if (!response.ok) {
        const message = Array.isArray(error?.message) ? error.message.join(', ') : error?.message

        throw new Error(message ?? `Registration confirmation failed with ${response.status}`)
      }
    },
  })
