export const ROUTES = {
  home: '/',
  create: '/create',
  /** Own profile entry point: `/profile` redirects to `/profile/{currentUserId}`. */
  profile: '/profile',
  profileById: (userId: string) => `/profile/${userId}`,
  /**
   * TEMPORARY: the settings page and its tab shell belong to another task. This entry and
   * `app/(main)/profile/settings/page.tsx` exist so the subscription widgets have somewhere
   * to be clicked, and are removed once the real page lands.
   */
  profileSettings: '/profile/settings',
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
