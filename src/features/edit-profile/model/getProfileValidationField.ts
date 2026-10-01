import type { EditProfileFormValues } from './editProfileFormValues'

const BACKEND_FIELD_NAMES: Record<string, keyof EditProfileFormValues> = {
  username: 'username',
  firstName: 'firstName',
  lastName: 'lastName',
  dateOfBirth: 'dateOfBirth',
  aboutMe: 'aboutMe',
  countryCode: 'country',
  city: 'city',
}

export const getProfileValidationField = (
  message: string
): keyof EditProfileFormValues | null => {
  const fieldName = /^(username|firstName|lastName|dateOfBirth|aboutMe|countryCode|city)(?=\s|[.:])/i.exec(
    message.trim()
  )?.[1]

  if (!fieldName) {
    return null
  }

  const backendFieldName = Object.keys(BACKEND_FIELD_NAMES).find(
    (name) => name.toLowerCase() === fieldName.toLowerCase()
  )

  return backendFieldName ? BACKEND_FIELD_NAMES[backendFieldName] : null
}
