import type { Client } from 'openapi-fetch'

import { apiClient } from '@/shared/api/openapi'
import type { paths, SchemaCurrentUserResponseDto } from '@/shared/api/openapi/schema'

import type { CurrentUser } from './sessionStore'
import { sessionStore } from './sessionStore'

type CurrentUserApiClient = Pick<Client<paths>, 'GET'>

const CURRENT_USER_LOAD_FAILURE_COOLDOWN_MS = 30_000

let lastCurrentUserLoadFailureAt: number | null = null

export class CurrentUserLoadError extends Error {
  constructor(public readonly status: number | null) {
    super(status ? `Current user loading failed with ${status}` : 'Current user loading failed')
    this.name = 'CurrentUserLoadError'
  }
}

const markCurrentUserLoadFailure = () => {
  lastCurrentUserLoadFailureAt = Date.now()
}

export const clearCurrentUserLoadFailure = () => {
  lastCurrentUserLoadFailureAt = null
}

export const hasRecentCurrentUserLoadFailure = () =>
  lastCurrentUserLoadFailureAt !== null &&
  Date.now() - lastCurrentUserLoadFailureAt < CURRENT_USER_LOAD_FAILURE_COOLDOWN_MS

const mapCurrentUser = ({
  avatarUrl,
  email,
  id,
  username,
}: SchemaCurrentUserResponseDto): CurrentUser => ({
  avatarUrl,
  email,
  id: String(id),
  username,
})

export const createLoadCurrentUser = (client: CurrentUserApiClient) => async () => {
  try {
    const { data, response } = await client.GET('/api/v1/auth/me')

    if (!response.ok || !data) {
      if (response.status === 401 || response.status === 403) {
        sessionStore.getState().setGuest()

        return null
      }

      markCurrentUserLoadFailure()

      throw new CurrentUserLoadError(response.status)
    }

    clearCurrentUserLoadFailure()

    const currentUser = mapCurrentUser(data)
    const { accessToken } = sessionStore.getState()

    if (!accessToken) {
      sessionStore.getState().setGuest()

      return null
    }

    sessionStore.getState().setAuthenticated(accessToken, currentUser)

    return currentUser
  } catch (error) {
    if (error instanceof CurrentUserLoadError) {
      throw error
    }

    markCurrentUserLoadFailure()

    throw new CurrentUserLoadError(null)
  }
}

export const loadCurrentUser = createLoadCurrentUser(apiClient)
