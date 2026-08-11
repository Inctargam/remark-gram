import { describe, expect, it } from 'vitest'

import { buildPageQuery, FIRST_PAGE, parsePageParam } from './pageParam'

describe('parsePageParam', () => {
  it('reads a page number from the url', () => {
    expect(parsePageParam('3')).toBe(3)
  })

  it('falls back to the first page when the param is missing', () => {
    expect(parsePageParam(null)).toBe(FIRST_PAGE)
    expect(parsePageParam(undefined)).toBe(FIRST_PAGE)
  })

  it.each(['', 'abc', '0', '-2', '1.5'])('falls back to the first page for %o', (raw) => {
    expect(parsePageParam(raw)).toBe(FIRST_PAGE)
  })
})

describe('buildPageQuery', () => {
  it('writes the page number into the query', () => {
    expect(buildPageQuery('', 4)).toBe('page=4')
  })

  it('drops the param on the first page instead of writing page=1', () => {
    expect(buildPageQuery('page=4', FIRST_PAGE)).toBe('')
  })

  it('keeps the other params of the tab', () => {
    expect(buildPageQuery('payment=success&page=2', 3)).toBe('payment=success&page=3')
    expect(buildPageQuery('payment=success&page=2', FIRST_PAGE)).toBe('payment=success')
  })

  it('treats a missing query as an empty one', () => {
    expect(buildPageQuery(undefined, 2)).toBe('page=2')
    expect(buildPageQuery(null, FIRST_PAGE)).toBe('')
  })
})
