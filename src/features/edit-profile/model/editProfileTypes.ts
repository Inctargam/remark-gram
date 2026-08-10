import type { Profile } from '@/entities/profile'

export type UpdateProfilePayload = Pick<
  Profile,
  'userName' | 'firstName' | 'lastName' | 'city' | 'country' | 'region' | 'dateOfBirth' | 'aboutMe'
>
