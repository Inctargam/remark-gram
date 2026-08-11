import { getMockProfile, type MockProfileUpdate, updateMockProfile } from './profileStore'

const USERNAME_PATTERN = /^[0-9A-Za-z_-]+$/
const NAME_PATTERN = /^[A-Za-zА-Яа-яЁё]+$/
const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/

const MIN_USERNAME_LENGTH = 6
const MAX_USERNAME_LENGTH = 30
const MAX_NAME_LENGTH = 50
const MAX_ABOUT_ME_LENGTH = 200
const MINIMUM_AGE = 13

type UpdateProfileRequestBody = Partial<Record<keyof MockProfileUpdate, unknown>>

const isValidDateString = (value: string) => {
  const match = ISO_DATE_PATTERN.exec(value)

  if (!match) {
    return false
  }

  const [, yearValue, monthValue, dayValue] = match
  const year = Number(yearValue)
  const month = Number(monthValue)
  const day = Number(dayValue)
  const date = new Date(year, month - 1, day)

  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
}

const isAtLeastThirteen = (value: string, today = new Date()) => {
  const [year, month, day] = value.split('-').map(Number)
  const dateOfBirth = new Date(year, month - 1, day)
  const latestAllowedDate = new Date(
    today.getFullYear() - MINIMUM_AGE,
    today.getMonth(),
    today.getDate()
  )

  return dateOfBirth <= latestAllowedDate
}

const validateUpdate = (body: UpdateProfileRequestBody | null): body is MockProfileUpdate => {
  if (!body) {
    return false
  }

  const { userName, firstName, lastName, city, country, region, dateOfBirth, aboutMe } = body

  return (
    typeof userName === 'string' &&
    userName.length >= MIN_USERNAME_LENGTH &&
    userName.length <= MAX_USERNAME_LENGTH &&
    USERNAME_PATTERN.test(userName) &&
    typeof firstName === 'string' &&
    firstName.length >= 1 &&
    firstName.length <= MAX_NAME_LENGTH &&
    NAME_PATTERN.test(firstName) &&
    typeof lastName === 'string' &&
    lastName.length >= 1 &&
    lastName.length <= MAX_NAME_LENGTH &&
    NAME_PATTERN.test(lastName) &&
    typeof city === 'string' &&
    typeof country === 'string' &&
    typeof region === 'string' &&
    (dateOfBirth === null ||
      (typeof dateOfBirth === 'string' &&
        isValidDateString(dateOfBirth) &&
        isAtLeastThirteen(dateOfBirth))) &&
    typeof aboutMe === 'string' &&
    aboutMe.length <= MAX_ABOUT_ME_LENGTH
  )
}

export const getProfileHandler = async () => Response.json(getMockProfile())

export const updateProfileHandler = async (request: Request) => {
  const body: UpdateProfileRequestBody | null = await request.json().catch(() => null)

  if (!validateUpdate(body)) {
    return Response.json({ message: 'Profile data is invalid.' }, { status: 400 })
  }

  return Response.json(updateMockProfile(body))
}
