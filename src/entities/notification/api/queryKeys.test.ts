import { describe, expect, it } from 'vitest'

import { notificationQueryKeys } from './queryKeys'

describe('notificationQueryKeys', () => {
  it('nests the history list under the shared root', () => {
    expect(notificationQueryKeys.list(20)).toEqual(['notifications', 'list', 20])
  })

  it('is stable across calls so react-query treats keys as equal', () => {
    expect(notificationQueryKeys.list(20)).toEqual(notificationQueryKeys.list(20))
  })
})
