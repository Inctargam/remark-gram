import type { SessionStatus } from '@/shared/auth'

export const shouldClearQueryClientOnSessionChange = (
  status: SessionStatus,
  previousStatus: SessionStatus
): boolean => status === 'guest' && previousStatus !== 'guest'
