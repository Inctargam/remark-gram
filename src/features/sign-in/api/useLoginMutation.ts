import { useMutation } from '@tanstack/react-query'

import { ApiError } from '@/shared/api/baseApi'
import { apiClient } from '@/shared/api/openapi'
import type { SchemaAccessTokenResponseDto, SchemaLoginDto } from '@/shared/api/openapi/schema'

const getErrorCode = (error: unknown): string | undefined =>
  typeof error === 'object' && error !== null && 'code' in error && typeof error.code === 'string'
    ? error.code
    : undefined

export const useLoginMutation = () =>
  useMutation({
    mutationFn: async (payload: SchemaLoginDto): Promise<SchemaAccessTokenResponseDto> => {
      const { data, error, response } = await apiClient.POST('/api/v1/auth/login', {
        body: payload,
      })

      // TODO(api-error-middleware): Remove after the API client rejects errors centrally.
      if (!response.ok) {
        const message = Array.isArray(error?.message) ? error.message.join(', ') : error?.message

        throw new ApiError(response.status, {
          code: getErrorCode(error),
          message: message ?? `Login failed with ${response.status}`,
        })
      }

      if (!data) {
        throw new Error('Login response does not contain an access token')
      }

      return data
    },
  })
