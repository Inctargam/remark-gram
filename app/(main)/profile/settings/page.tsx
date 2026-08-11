import { Suspense } from 'react'

import { Tabs } from '@/shared/ui/tabs'
import { AccountManagement } from '@/widgets/account-management'
import { MyPayments } from '@/widgets/my-payments'

/**
 * TEMPORARY page. The real settings page — the tab shell plus the `General information`
 * and `Devices` tabs — is built in another task; this file only gives the subscription
 * widgets a place to be clicked until then, and is deleted when that page lands.
 */
export default function Page() {
  return (
    <Tabs.Root defaultValue="account-management">
      <Tabs.List>
        <Tabs.Tab value="general-information" disabled>
          General information
        </Tabs.Tab>
        <Tabs.Tab value="devices" disabled>
          Devices
        </Tabs.Tab>
        <Tabs.Tab value="account-management">Account Management</Tabs.Tab>
        <Tabs.Tab value="my-payments">My payments</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="account-management">
        {/* The widget reads the payment result from the query string, hence the boundary. */}
        <Suspense fallback={<p>Loading subscription…</p>}>
          <AccountManagement />
        </Suspense>
      </Tabs.Panel>

      <Tabs.Panel value="my-payments">
        {/* The widget keeps the page number in the query string, hence the same boundary. */}
        <Suspense fallback={<p>Loading payments…</p>}>
          <MyPayments />
        </Suspense>
      </Tabs.Panel>
    </Tabs.Root>
  )
}
