import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { connectMockNotificationsRealtime } from './mockNotificationsRealtime'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllEnvs()
})

describe('connectMockNotificationsRealtime', () => {
  it('does not emit timer notifications by default', () => {
    const onEvent = vi.fn()

    connectMockNotificationsRealtime({ intervalMs: 1000, onEvent })
    vi.advanceTimersByTime(3000)

    expect(onEvent).not.toHaveBeenCalled()
  })

  it('emits timer notifications when mock realtime is explicitly enabled', () => {
    const onEvent = vi.fn()

    vi.stubEnv('NEXT_PUBLIC_NOTIFICATIONS_MOCK_REALTIME', 'true')
    connectMockNotificationsRealtime({
      intervalMs: 1000,
      now: () => new Date('2026-09-02T12:00:00.000Z'),
      onEvent,
    })
    vi.advanceTimersByTime(1000)

    expect(onEvent).toHaveBeenCalledWith({
      id: 'mock-notification-live-1788350400000',
      kind: 'nextPayment',
      createdAt: '2026-09-02T12:00:00.000Z',
    })
  })

  it('stops enabled mock realtime events after cleanup', () => {
    const onEvent = vi.fn()

    vi.stubEnv('NEXT_PUBLIC_NOTIFICATIONS_MOCK_REALTIME', 'true')
    const cleanup = connectMockNotificationsRealtime({ intervalMs: 1000, onEvent })

    cleanup()
    vi.advanceTimersByTime(1000)

    expect(onEvent).not.toHaveBeenCalled()
  })
})
