'use client'

import { useRouter } from 'next/navigation'
import { Suspense } from 'react'

import { EditProfileForm } from '@/features/edit-profile'
import { ProfileAvatar } from '@/features/manage-profile-avatar'
import { ROUTES } from '@/shared/config'
import { Tabs } from '@/shared/ui/tabs'
import { AccountManagement } from '@/widgets/account-management'
import { MyPayments } from '@/widgets/my-payments'

import { SETTINGS_PARTS, type SettingsPart } from '../model/settingsPart'
import { SettingsMobileHeader } from './SettingsMobileHeader'
import styles from './settingsPage.module.css'
import { useActiveSettingsTabScroll } from './useActiveSettingsTabScroll'

type Props = {
  activePart: SettingsPart
}

export const SettingsPage = ({ activePart }: Props) => {
  const router = useRouter()
  const tabsViewportRef = useActiveSettingsTabScroll(activePart)

  const partChangeHandler = (part: SettingsPart) => {
    router.push(`${ROUTES.settings}?part=${part}`)
  }

  return (
    <section aria-label="Profile settings" className={styles.page}>
      <SettingsMobileHeader />
      <Tabs.Root className={styles.tabs} value={activePart} onValueChange={partChangeHandler}>
        <div className={styles.tabsViewport} ref={tabsViewportRef}>
          <Tabs.List className={styles.tabsList}>
            <Tabs.Tab value={SETTINGS_PARTS.info}>General information</Tabs.Tab>
            <Tabs.Tab value={SETTINGS_PARTS.devices}>Devices</Tabs.Tab>
            <Tabs.Tab value={SETTINGS_PARTS.subscriptions}>Account Management</Tabs.Tab>
            <Tabs.Tab value={SETTINGS_PARTS.payments}>My payments</Tabs.Tab>
          </Tabs.List>
        </div>

        <Tabs.Panel className={styles.panel} value={SETTINGS_PARTS.info}>
          <EditProfileForm avatar={<ProfileAvatar />} />
        </Tabs.Panel>
        <Tabs.Panel className={styles.panel} value={SETTINGS_PARTS.devices} />

        <Tabs.Panel className={styles.panel} value={SETTINGS_PARTS.subscriptions}>
          {/* The widget reads the payment result from the query string, hence the boundary. */}
          <Suspense fallback={<p>Loading subscription…</p>}>
            <AccountManagement />
          </Suspense>
        </Tabs.Panel>

        <Tabs.Panel className={styles.panel} value={SETTINGS_PARTS.payments}>
          {/* The widget keeps the page number in the query string, hence the same boundary. */}
          <Suspense fallback={<p>Loading payments…</p>}>
            <MyPayments />
          </Suspense>
        </Tabs.Panel>
      </Tabs.Root>
    </section>
  )
}
