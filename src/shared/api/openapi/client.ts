import createClient from 'openapi-fetch'

import { createAuthMiddleware, createRefreshAccessToken } from '../auth'
import { API_BASE_URL } from './config'
import type { paths } from './schema'

export const apiClient = createClient<paths>({
  baseUrl: API_BASE_URL,
  credentials: 'include',
})

export const refreshAccessToken = createRefreshAccessToken(apiClient)

apiClient.use(createAuthMiddleware({ refreshAccessToken }))
