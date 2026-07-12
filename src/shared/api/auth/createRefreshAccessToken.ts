import type { Client } from 'openapi-fetch'

import type { paths } from '@/shared/api/openapi/schema'
import { sessionStore } from '@/shared/auth'

type ApiClient = Pick<Client<paths>, 'POST'>

export const createRefreshAccessToken = (apiClient: ApiClient) => {
  let refreshPromise: Promise<string | null> | null = null

  const requestAccessToken = async (): Promise<string | null> => {
    try {
      const { data, response } = await apiClient.POST('/api/v1/auth/refresh-token', {
        auth: false,
      })

      if (!response.ok || !data?.accessToken) {
        // TODO(auth-error-state): Distinguish an invalid session from network and backend failures.
        sessionStore.getState().setGuest()

        return null
      }

      sessionStore.getState().setAuthenticated(data.accessToken)

      return data.accessToken
    } catch {
      // TODO(auth-error-state): Preserve an unknown session state and show a retry UI.
      sessionStore.getState().setGuest()

      return null
    }
  }

  return () => {
    if (refreshPromise) {
      return refreshPromise
    }

    refreshPromise = requestAccessToken().finally(() => {
      refreshPromise = null
    })

    return refreshPromise
  }
}
