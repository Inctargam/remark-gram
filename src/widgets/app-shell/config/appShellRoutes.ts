import { ROUTES } from '@/shared/config'

export const ROUTES_WITHOUT_BOTTOM_BAR = [
  ROUTES.settings,
  ROUTES.statistics,
  ROUTES.favorites,
] as const

export const AUTH_ROUTES = [
  ROUTES.signIn,
  ROUTES.signUp,
  ROUTES.forgotPassword,
  ROUTES.passwordRecovery,
  ROUTES.createNewPassword,
  ROUTES.termsOfService,
  ROUTES.privacyPolicy,
  ROUTES.confirmEmail,
] as const
