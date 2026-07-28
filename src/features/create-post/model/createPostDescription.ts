export const CREATE_POST_DESCRIPTION_MAX_LENGTH = 500

export const normalizeCreatePostDescription = (description: string) =>
  description.slice(0, CREATE_POST_DESCRIPTION_MAX_LENGTH)
