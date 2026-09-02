import { describe, expect, it } from 'vitest'

import { shouldClearQueryClientOnSessionChange } from './sessionBootstrap'

describe('shouldClearQueryClientOnSessionChange', () => {
  it('clears cached data when the session becomes guest', () => {
    expect(shouldClearQueryClientOnSessionChange('guest', 'authenticated')).toBe(true)
    expect(shouldClearQueryClientOnSessionChange('guest', 'loading')).toBe(true)
  })

  it('keeps cached data when the session was already guest', () => {
    expect(shouldClearQueryClientOnSessionChange('guest', 'guest')).toBe(false)
  })

  it('keeps cached data for authenticated and loading states', () => {
    expect(shouldClearQueryClientOnSessionChange('authenticated', 'loading')).toBe(false)
    expect(shouldClearQueryClientOnSessionChange('loading', 'authenticated')).toBe(false)
  })
})
