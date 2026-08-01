/**
 * Single source of truth for the post description limit.
 * `features/create-post` keeps its own copy for now; it is switched to this constant in stage 7.
 */
export const POST_DESCRIPTION_MAX_LENGTH = 500

export const normalizePostDescription = (description: string) =>
  description.slice(0, POST_DESCRIPTION_MAX_LENGTH)

/** Description is optional, so an empty string is valid; only the upper bound is enforced. */
export const isValidPostDescription = (description: string) =>
  description.length <= POST_DESCRIPTION_MAX_LENGTH
