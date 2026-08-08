export type EditProfileFormValues = {
  username: string
  firstName: string
  lastName: string
  dateOfBirth: Date | null
  country: string
  region: string
  city: string
  aboutMe: string
}

export const EMPTY_EDIT_PROFILE_FORM_VALUES: EditProfileFormValues = {
  username: '',
  firstName: '',
  lastName: '',
  dateOfBirth: null,
  country: '',
  region: '',
  city: '',
  aboutMe: '',
}
