import { normalizePostDescription } from '@/entities/post'

/**
 * Whether the description was actually changed.
 * Surrounding whitespace is ignored on purpose: adding a trailing space is not an edit,
 * and treating it as one would pop the discard dialog on an untouched form.
 */
export const isPostDescriptionDirty = (initialDescription: string, description: string) =>
  initialDescription.trim() !== description.trim()

/** What actually goes to the API: trimmed first, then cut to the limit. */
export const preparePostDescription = (description: string) =>
  normalizePostDescription(description.trim())
