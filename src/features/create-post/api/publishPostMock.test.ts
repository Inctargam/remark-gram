import { describe, expect, it, vi } from 'vitest'

import { publishPostMock } from './publishPostMock'

describe('publish post mock', () => {
  it('returns a mock publication id', async () => {
    vi.useFakeTimers()

    const publishPromise = publishPostMock({ description: 'caption', photos: [] })

    await vi.runAllTimersAsync()

    await expect(publishPromise).resolves.toEqual({
      publicationId: expect.any(String),
    })

    vi.useRealTimers()
  })
})
