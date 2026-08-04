import type { Post } from '../model/types'

const MAX_ALT_LENGTH = 80

/**
 * Screen readers get the beginning of the description; when a post has none,
 * the author's username still tells whose publication it is.
 */
export const getPostImageAlt = (post: Post): string => {
  const firstLine = post.description.split('\n')[0]?.trim() ?? ''

  if (!firstLine) {
    return `Publication by ${post.ownerUsername}`
  }

  return firstLine.length > MAX_ALT_LENGTH
    ? `${firstLine.slice(0, MAX_ALT_LENGTH).trimEnd()}…`
    : firstLine
}
