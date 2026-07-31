import { API_BASE_URL } from '@/shared/config'

export const OAUTH_AUTHORIZE_URLS = {
  github: `${API_BASE_URL}/api/v1/auth/github`,
  google: `${API_BASE_URL}/api/v1/auth/google`,
} as const
