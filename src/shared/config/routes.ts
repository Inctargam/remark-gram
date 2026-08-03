export const ROUTES = {
  home: '/',
  create: '/create',
  /** Own profile entry point: `/profile` redirects to `/profile/{currentUserId}`. */
  profile: '/profile',
  profileById: (userId: string) => `/profile/${userId}`,
  messenger: '/messenger',
  search: '/search',
  statistics: '/statistics',
  favorites: '/favorites',
  signIn: '/sign-in',
  signUp: '/sign-up',
  forgotPassword: '/forgot-password',
  passwordRecovery: '/password-recovery',
  createNewPassword: '/create-new-password',
  termsOfService: '/terms-of-service',
  privacyPolicy: '/privacy-policy',
  confirmEmail: '/auth/registration/confirmation',
} as const
