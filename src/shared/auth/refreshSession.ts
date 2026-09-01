import type { Client } from 'openapi-fetch'

import { apiClient } from '@/shared/api/openapi'
import type { paths } from '@/shared/api/openapi/schema'

import { createLoadCurrentUser } from './currentUserApi'
import { sessionStore } from './sessionStore'

type SessionApiClient = Pick<Client<paths>, 'GET' | 'POST'>

export const createRefreshSession = (client: SessionApiClient) => {
  let refreshPromise: Promise<string | null> | null = null
  const loadCurrentUser = createLoadCurrentUser(client)

  const requestAccessToken = async (): Promise<string | null> => {
    let accessToken: string

    try {
      const { data, response } = await client.POST('/api/v1/auth/refresh-token')

      if (!response.ok || !data?.accessToken) {
        // TODO(auth-error-state): Distinguish an invalid session from network and backend failures.
        sessionStore.getState().setGuest()

        return null
      }

      accessToken = data.accessToken
    } catch {
      // TODO(auth-error-state): Preserve an unknown session state and show a retry UI.
      sessionStore.getState().setGuest()

      return null
    }

    sessionStore.getState().setAuthenticated(accessToken)

    try {
      const currentUser = await loadCurrentUser()

      if (!currentUser) {
        return null
      }

      return accessToken
    } catch {
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

export const refreshSession = createRefreshSession(apiClient)
