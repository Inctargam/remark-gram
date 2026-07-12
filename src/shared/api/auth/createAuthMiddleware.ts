import type { Middleware } from 'openapi-fetch'

import { sessionStore } from '@/shared/auth'

type AuthRequest = Request & {
  auth?: boolean
}

type Params = {
  refreshAccessToken: () => Promise<string | null>
}

export const createAuthMiddleware = ({ refreshAccessToken }: Params): Middleware => ({
  onRequest({ request }) {
    const authRequest = request as AuthRequest

    if (authRequest.auth === false) {
      return
    }

    const accessToken = sessionStore.getState().accessToken

    if (accessToken) {
      request.headers.set('Authorization', `Bearer ${accessToken}`)
    }
  },

  async onResponse({ options, request, response }) {
    const authRequest = request as AuthRequest
    const hasAccessToken = request.headers.has('Authorization')

    if (authRequest.auth === false || response.status !== 401 || !hasAccessToken) {
      return response
    }

    const nextAccessToken = await refreshAccessToken()

    if (!nextAccessToken) {
      return response
    }

    const retryRequest = request.clone()
    retryRequest.headers.set('Authorization', `Bearer ${nextAccessToken}`)
    const retryResponse = await options.fetch(retryRequest)

    if (retryResponse.status === 401) {
      sessionStore.getState().setGuest()
    }

    return retryResponse
  },
})
