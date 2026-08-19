/**
 * Payments are paginated by page number, so the page is part of the key: switching pages
 * is a separate cached query, and a successful payment invalidates `all` at once.
 */
export const paymentsQueryKeys = {
  all: ['payments'] as const,
  lists: () => [...paymentsQueryKeys.all, 'list'] as const,
  list: (page: number, pageSize: number) => [...paymentsQueryKeys.lists(), page, pageSize] as const,
}
