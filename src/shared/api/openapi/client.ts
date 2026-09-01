import createClient from 'openapi-fetch'

import { sessionStore } from '@/shared/auth/sessionStore'
import { API_BASE_URL } from '@/shared/config'

import type { paths } from './schema'

export const apiClient = createClient<paths>({
  baseUrl: API_BASE_URL,
  credentials: 'include',
})

apiClient.use({
  onRequest: ({ request }) => {
    const { accessToken } = sessionStore.getState()

    if (!accessToken) {
      return undefined
    }

    request.headers.set('Authorization', `Bearer ${accessToken}`)

    return request
  },
})
