import createClient from 'openapi-fetch'

import type { paths } from './schema'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? ''

export const openApiClient = createClient<paths>({
  baseUrl: API_BASE_URL,
})
