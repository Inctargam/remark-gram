import { apiClient } from '@/shared/api/openapi'

import type { EditProfileFormValues } from '../model/editProfileFormValues'
import { mapFormValuesToBackendPayload } from '../model/editProfileMappers'

export class ProfileUpdateError extends Error {
  constructor(
    public readonly messages: string[],
    public readonly status: number,
    public readonly code?: string
  ) {
    super(messages.join('; '))
    this.name = 'ProfileUpdateError'
  }
}

export const updateProfile = async (values: EditProfileFormValues): Promise<void> => {
  const { error, response } = await apiClient.PUT('/api/v1/users/me/profile', {
    body: mapFormValuesToBackendPayload(values),
  })

  if (!response.ok) {
    const message = error && 'message' in error ? error.message : null
    const messages = Array.isArray(message)
      ? message
      : typeof message === 'string'
        ? [message]
        : [`Failed to save profile (${response.status})`]
    const code = error && 'code' in error ? error.code : undefined

    throw new ProfileUpdateError(messages, response.status, code)
  }
}
