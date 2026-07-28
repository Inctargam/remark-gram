import { describe, expect, it } from 'vitest'

import {
  CREATE_POST_FILTERS,
  DEFAULT_CREATE_POST_FILTER_ID,
  getCreatePostFilterCss,
} from './createPostFilter'

describe('create post filters', () => {
  it('uses original as the default filter', () => {
    expect(DEFAULT_CREATE_POST_FILTER_ID).toBe('original')
    expect(getCreatePostFilterCss(DEFAULT_CREATE_POST_FILTER_ID)).toBe('none')
  })

  it('defines unique filter ids', () => {
    const filterIds = CREATE_POST_FILTERS.map(({ id }) => id)

    expect(new Set(filterIds).size).toBe(filterIds.length)
  })
})
