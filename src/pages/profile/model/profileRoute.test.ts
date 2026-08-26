import { describe, expect, it } from 'vitest'

import {
  isBackendPostId,
  isBackendProfileUserId,
  shouldDeferProfilePostLookupToClient,
} from './profileRoute'

describe('profile route helpers', () => {
  it('recognizes backend numeric ids', () => {
    expect(isBackendProfileUserId('3')).toBe(true)
    expect(isBackendPostId('5')).toBe(true)
  })

  it('rejects mock and invalid ids as backend ids', () => {
    expect(isBackendProfileUserId('mock-user-1')).toBe(false)
    expect(isBackendPostId('mock-user-1-post-01')).toBe(false)
    expect(isBackendProfileUserId('0')).toBe(false)
    expect(isBackendPostId('abc')).toBe(false)
  })

  it('defers direct post lookup to the client for real backend profile routes', () => {
    expect(
      shouldDeferProfilePostLookupToClient({
        isMockPostsApi: false,
        postId: '5',
        userId: '3',
      })
    ).toBe(true)
  })

  it('does not defer direct post lookup for mock profile routes', () => {
    expect(
      shouldDeferProfilePostLookupToClient({
        isMockPostsApi: true,
        postId: '5',
        userId: '3',
      })
    ).toBe(false)
    expect(
      shouldDeferProfilePostLookupToClient({
        isMockPostsApi: false,
        postId: 'mock-user-1-post-01',
        userId: 'mock-user-1',
      })
    ).toBe(false)
  })
})
