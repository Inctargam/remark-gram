import { redirect } from 'next/navigation'

import { getCurrentUserId } from '@/shared/auth'
import { ROUTES } from '@/shared/config'

/** Legacy entry point kept for navigation links: sends the user to their own profile. */
export default function Page() {
  redirect(ROUTES.profileById(getCurrentUserId()))
}
