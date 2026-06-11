import { Suspense } from 'react'

import { ConfirmEmailPage } from '@/pages/confirm-email'

export default function Page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ConfirmEmailPage />
    </Suspense>
  )
}
