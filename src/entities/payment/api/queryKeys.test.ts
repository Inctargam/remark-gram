import { describe, expect, it } from 'vitest'

import { paymentsQueryKeys } from './queryKeys'

describe('paymentsQueryKeys', () => {
  it('nests the page key under the shared root', () => {
    expect(paymentsQueryKeys.list(2, 10)).toEqual(['payments', 'list', 2, 10])
  })

  it('gives every page and page size its own key', () => {
    expect(paymentsQueryKeys.list(1, 10)).not.toEqual(paymentsQueryKeys.list(2, 10))
    expect(paymentsQueryKeys.list(1, 10)).not.toEqual(paymentsQueryKeys.list(1, 5))
  })

  it('is stable across calls so react-query treats keys as equal', () => {
    expect(paymentsQueryKeys.list(1, 10)).toEqual(paymentsQueryKeys.list(1, 10))
  })
})
