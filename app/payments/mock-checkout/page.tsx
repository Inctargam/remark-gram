import { Suspense } from 'react'

import { MockCheckoutPage } from '@/pages/mock-checkout'

/**
 * MOCK route: stands in for the hosted page of the payment service. It lives outside the
 * `(main)` group because the user is supposed to have left the app at this point, and is
 * removed together with the mock payments API.
 */
export default function Page() {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <MockCheckoutPage />
    </Suspense>
  )
}
