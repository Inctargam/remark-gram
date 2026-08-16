import { useMutation } from '@tanstack/react-query'

import { ApiError } from '@/shared/api/baseApi'
import { apiClient } from '@/shared/api/openapi'
import type { SchemaAccessTokenResponseDto, SchemaLoginDto } from '@/shared/api/openapi/schema'

export const useLoginMutation = () =>
  useMutation({
    meta: { globalErrorHandler: 'off' },
    mutationFn: async (payload: SchemaLoginDto): Promise<SchemaAccessTokenResponseDto> => {
      const { data, error, response } = await apiClient.POST('/api/v1/auth/login', {
        body: payload,
      })

      // TODO(api-error-middleware): Remove after the API client rejects errors centrally.
      if (!response.ok) {
        const message = Array.isArray(error?.message) ? error.message.join(', ') : error?.message

        throw new ApiError(response.status, {
          message: message ?? `Login failed with ${response.status}`,
        })
      }

      if (!data) {
        throw new Error('Login response does not contain an access token')
      }

      return data
    },
  })
