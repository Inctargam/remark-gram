import { describe, expect, it } from 'vitest'

import { subscriptionQueryKeys } from './queryKeys'

describe('subscriptionQueryKeys', () => {
  it('nests the current-status key under the shared root', () => {
    expect(subscriptionQueryKeys.current()).toEqual(['subscription', 'current'])
  })

  it('is stable across calls so react-query treats keys as equal', () => {
    expect(subscriptionQueryKeys.current()).toEqual(subscriptionQueryKeys.current())
  })
})
