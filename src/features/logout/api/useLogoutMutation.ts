import { useMutation } from '@tanstack/react-query'

import { apiClient } from '@/shared/api/openapi'
import { sessionStore } from '@/shared/auth'

export const logout = async () => {
  try {
    await apiClient.POST('/api/v1/auth/logout', { auth: false })
  } catch {
    // Local logout must finish even when the backend cannot revoke the refresh session.
  } finally {
    sessionStore.getState().setGuest()
  }
}

export const useLogoutMutation = () =>
  useMutation({
    mutationFn: logout,
  })
