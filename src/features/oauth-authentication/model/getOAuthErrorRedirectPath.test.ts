import { describe, expect, it } from 'vitest'

import { getOAuthErrorRedirectPath } from './getOAuthErrorRedirectPath'

describe('getOAuthErrorRedirectPath', () => {
  it('forwards an OAuth error to the sign-in page', () => {
    expect(getOAuthErrorRedirectPath('ACCESS_DENIED')).toBe('/sign-in?error=ACCESS_DENIED')
  })

  it('returns null when there is no OAuth error', () => {
    expect(getOAuthErrorRedirectPath(undefined)).toBeNull()
  })
})
