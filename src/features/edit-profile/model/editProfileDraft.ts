import type { EditProfileFormValues } from './editProfileFormValues'
import { formatProfileDate, parseProfileDate } from './editProfileMappers'

export const EDIT_PROFILE_DRAFT_KEY = 'edit-profile:privacy-policy-draft'

type StoredEditProfileDraft = Omit<EditProfileFormValues, 'dateOfBirth'> & {
  dateOfBirth: string | null
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const parseDraft = (value: unknown): EditProfileFormValues | null => {
  if (!isRecord(value)) {
    return null
  }

  const { username, firstName, lastName, dateOfBirth, country, region, city, aboutMe } = value
  const hasValidStrings =
    typeof username === 'string' &&
    typeof firstName === 'string' &&
    typeof lastName === 'string' &&
    typeof country === 'string' &&
    typeof region === 'string' &&
    typeof city === 'string' &&
    typeof aboutMe === 'string'
  const hasValidDate = dateOfBirth === null || typeof dateOfBirth === 'string'

  if (!hasValidStrings || !hasValidDate) {
    return null
  }

  const parsedDate = parseProfileDate(dateOfBirth)

  if (dateOfBirth !== null && !parsedDate) {
    return null
  }

  return {
    username,
    firstName,
    lastName,
    dateOfBirth: parsedDate,
    country,
    region,
    city,
    aboutMe,
  }
}

export const saveEditProfileDraft = (values: EditProfileFormValues) => {
  if (typeof window === 'undefined') {
    return
  }

  const draft: StoredEditProfileDraft = {
    ...values,
    dateOfBirth: formatProfileDate(values.dateOfBirth),
  }

  window.sessionStorage.setItem(EDIT_PROFILE_DRAFT_KEY, JSON.stringify(draft))
}

export const consumeEditProfileDraft = (): EditProfileFormValues | null => {
  if (typeof window === 'undefined') {
    return null
  }

  const storedDraft = window.sessionStorage.getItem(EDIT_PROFILE_DRAFT_KEY)
  window.sessionStorage.removeItem(EDIT_PROFILE_DRAFT_KEY)

  if (!storedDraft) {
    return null
  }

  try {
    return parseDraft(JSON.parse(storedDraft))
  } catch {
    return null
  }
}

export const clearEditProfileDraft = () => {
  if (typeof window !== 'undefined') {
    window.sessionStorage.removeItem(EDIT_PROFILE_DRAFT_KEY)
  }
}
