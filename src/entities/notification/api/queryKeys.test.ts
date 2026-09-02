import { afterEach, describe, expect, it, vi } from 'vitest'

import { notificationQueryKeys } from './queryKeys'

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('notificationQueryKeys', () => {
  it('separates stable mock lists from timer-driven mock realtime lists', () => {
    vi.stubEnv('NEXT_PUBLIC_NOTIFICATIONS_MOCK_REALTIME', undefined)
    const stableMockKey = notificationQueryKeys.list(20)

    vi.stubEnv('NEXT_PUBLIC_NOTIFICATIONS_MOCK_REALTIME', 'true')
    const realtimeMockKey = notificationQueryKeys.list(20)

    expect(stableMockKey).toEqual(['notifications', 'list', 'mock-static', 20])
    expect(realtimeMockKey).toEqual(['notifications', 'list', 'mock-realtime', 20])
  })

  it('uses a separate list key for real backend mode', () => {
    vi.stubEnv('NEXT_PUBLIC_NOTIFICATIONS_API_MOCK', 'false')

    expect(notificationQueryKeys.list(20)).toEqual(['notifications', 'list', 'real', 20])
  })
})
