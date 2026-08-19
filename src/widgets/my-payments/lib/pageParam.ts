/**
 * The current page lives in the url so a page of payments can be linked to and survives
 * a reload — the tab is deep-linkable the same way the payment result is.
 */
export const PAYMENTS_PAGE_PARAM = 'page'

export const FIRST_PAGE = 1

/** Anything that is not a positive integer — hand-typed junk included — falls back to page 1. */
export const parsePageParam = (raw: string | null | undefined): number => {
  const value = Number(raw)

  return Number.isInteger(value) && value >= FIRST_PAGE ? value : FIRST_PAGE
}

/**
 * Query string for a page, keeping every other param the tab was opened with — the payment
 * result of UC-1 among them. The first page is the default, so it is left out of the url
 * instead of adding `?page=1`.
 *
 * Returned without the leading `?`; an empty string means «no query at all».
 */
export const buildPageQuery = (currentQuery: string | null | undefined, page: number): string => {
  const params = new URLSearchParams(currentQuery ?? '')

  if (page === FIRST_PAGE) {
    params.delete(PAYMENTS_PAGE_PARAM)
  } else {
    params.set(PAYMENTS_PAGE_PARAM, String(page))
  }

  return params.toString()
}
