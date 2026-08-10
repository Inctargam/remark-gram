import { Tabs } from '@/shared/ui/tabs'
import { AccountManagement } from '@/widgets/account-management'

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
        <Tabs.Tab value="my-payments" disabled>
          My payments
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="account-management">
        <AccountManagement />
      </Tabs.Panel>
    </Tabs.Root>
  )
}
