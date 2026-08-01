import { describe, expect, it } from 'vitest'

import { postsQueryKeys } from './queryKeys'

describe('postsQueryKeys', () => {
  it('nests list and detail keys under the shared root', () => {
    expect(postsQueryKeys.list('user-1')).toEqual(['posts', 'list', 'user-1'])
    expect(postsQueryKeys.detail('post-1')).toEqual(['posts', 'detail', 'post-1'])
  })

  it('keeps lists and details distinguishable', () => {
    expect(postsQueryKeys.list('1')).not.toEqual(postsQueryKeys.detail('1'))
  })

  it('produces different keys for different users and posts', () => {
    expect(postsQueryKeys.list('user-1')).not.toEqual(postsQueryKeys.list('user-2'))
    expect(postsQueryKeys.detail('post-1')).not.toEqual(postsQueryKeys.detail('post-2'))
  })

  it('is stable across calls so react-query treats keys as equal', () => {
    expect(postsQueryKeys.list('user-1')).toEqual(postsQueryKeys.list('user-1'))
  })
})
