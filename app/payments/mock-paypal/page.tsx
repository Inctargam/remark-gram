import { Suspense } from 'react'

import { MockPaypalPage } from '@/pages/mock-paypal'

/**
 * MOCK route: stands in for the hosted approval page of PayPal. It lives outside the
 * `(main)` group because the user is supposed to have left the app at this point, and is
 * removed together with the mock payments API.
 */
export default function Page() {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <MockPaypalPage />
    </Suspense>
  )
}
