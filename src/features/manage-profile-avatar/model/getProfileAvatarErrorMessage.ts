// TODO(api-errors): Replace this feature-local normalizer with the shared API error handler
// and remove this file once global error handling is available.
export const getProfileAvatarErrorMessage = (error: unknown) => {
  return error instanceof Error
    ? error.message
    : 'Failed to update profile photo. Please try again.'
}
