import { useMutation } from '@tanstack/react-query'

import { apiClient } from '@/shared/api/openapi'
import type { SchemaResendRegistrationConfirmationDto } from '@/shared/api/openapi/schema'

export const useResendRegistrationConfirmationMutation = () =>
  useMutation({
    mutationFn: async (payload: SchemaResendRegistrationConfirmationDto) => {
      const { error, response } = await apiClient.POST(
        '/api/v1/auth/registration/resend-confirmation',
        { body: payload }
      )

      // TODO(api-error-middleware): Remove after the API client rejects errors centrally.
      if (!response.ok) {
        const message = Array.isArray(error?.message) ? error.message.join(', ') : error?.message

        throw new Error(
          message ?? `Resending registration confirmation failed with ${response.status}`
        )
      }
    },
  })
