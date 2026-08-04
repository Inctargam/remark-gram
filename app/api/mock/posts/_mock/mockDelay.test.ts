import { afterEach, describe, expect, it, vi } from 'vitest'

import { parseMockDelay, waitMockDelay, withMockDelay } from './mockDelay'

afterEach(() => {
  vi.unstubAllEnvs()
  vi.useRealTimers()
})

describe('parseMockDelay', () => {
  it('treats a missing value as no delay', () => {
    expect(parseMockDelay(undefined)).toBe(0)
    expect(parseMockDelay('')).toBe(0)
  })

  it('reads a positive number of milliseconds', () => {
    expect(parseMockDelay('500')).toBe(500)
  })

  // A broken env value must not take a mock handler down with it.
  it('falls back to no delay on unusable values', () => {
    expect(parseMockDelay('soon')).toBe(0)
    expect(parseMockDelay('-100')).toBe(0)
    expect(parseMockDelay('0')).toBe(0)
  })
})

describe('waitMockDelay', () => {
  it('returns immediately when the delay is not configured', async () => {
    vi.useFakeTimers()

    let settled = false

    void waitMockDelay().then(() => {
      settled = true
    })
    await Promise.resolve()

    expect(settled).toBe(true)
  })

  it('waits out the configured delay', async () => {
    vi.stubEnv('POSTS_API_MOCK_DELAY_MS', '500')
    vi.useFakeTimers()

    let settled = false

    void waitMockDelay().then(() => {
      settled = true
    })
    await vi.advanceTimersByTimeAsync(499)

    expect(settled).toBe(false)

    await vi.advanceTimersByTimeAsync(1)

    expect(settled).toBe(true)
  })
})

describe('withMockDelay', () => {
  it('passes every argument through to the wrapped handler', async () => {
    const handler = vi.fn(async (_request: Request, _postId: string) => Response.json({ ok: true }))
    const request = new Request('https://example.com/api/mock/posts')

    const response = await withMockDelay(handler)(request, 'post-1')

    expect(handler).toHaveBeenCalledWith(request, 'post-1')
    await expect(response.json()).resolves.toEqual({ ok: true })
  })

  it('delays the handler instead of running it right away', async () => {
    vi.stubEnv('POSTS_API_MOCK_DELAY_MS', '500')
    vi.useFakeTimers()

    const handler = vi.fn(async () => Response.json({ ok: true }))

    void withMockDelay(handler)()
    await Promise.resolve()

    expect(handler).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(500)

    expect(handler).toHaveBeenCalled()
  })
})
