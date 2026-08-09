import type { ProfileAvatar } from './profileTypes'

// TODO(profile-api): Revisit avatar variant selection and requested image sizes once the
// backend defines the available profile avatar variants in the OpenAPI schema.
export const selectLargestProfileAvatar = (avatars: ProfileAvatar[]) => {
  return avatars.reduce<ProfileAvatar | null>((largestAvatar, avatar) => {
    if (!largestAvatar || avatar.width > largestAvatar.width) {
      return avatar
    }

    return largestAvatar
  }, null)
}
