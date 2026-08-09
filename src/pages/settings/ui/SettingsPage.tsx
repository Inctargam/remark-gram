'use client'

import { useRouter } from 'next/navigation'

import { EditProfileForm } from '@/features/edit-profile'
import { ROUTES } from '@/shared/config'
import { Button } from '@/shared/ui/button'
import { Icon } from '@/shared/ui/icon'
import { Tabs } from '@/shared/ui/tabs'

import { SETTINGS_PARTS, type SettingsPart } from '../model/settingsPart'
import styles from './settingsPage.module.css'

type Props = {
  activePart: SettingsPart
}

export const SettingsPage = ({ activePart }: Props) => {
  const router = useRouter()

  const partChangeHandler = (part: SettingsPart) => {
    router.push(`${ROUTES.settings}?part=${part}`)
  }

  return (
    <section aria-label="Profile settings" className={styles.page}>
      <Tabs.Root className={styles.tabs} value={activePart} onValueChange={partChangeHandler}>
        <div className={styles.tabsViewport}>
          <Tabs.List className={styles.tabsList}>
            <Tabs.Tab value={SETTINGS_PARTS.info}>General information</Tabs.Tab>
            <Tabs.Tab value={SETTINGS_PARTS.devices}>Devices</Tabs.Tab>
            <Tabs.Tab value={SETTINGS_PARTS.subscriptions}>Account Management</Tabs.Tab>
            <Tabs.Tab value={SETTINGS_PARTS.payments}>My payments</Tabs.Tab>
          </Tabs.List>
        </div>

        <Tabs.Panel className={styles.panel} value={SETTINGS_PARTS.info}>
          <EditProfileForm
            avatar={
              <div className={styles.avatarColumn}>
                <div aria-hidden="true" className={styles.avatarPlaceholder}>
                  <Icon iconId="icon-person-outline" width={48} height={48} />
                </div>

                <Button className={styles.addPhotoButton} type="button" variant="outline">
                  Add a Profile Photo
                </Button>
              </div>
            }
          />
        </Tabs.Panel>
        <Tabs.Panel className={styles.panel} value={SETTINGS_PARTS.devices} />
        <Tabs.Panel className={styles.panel} value={SETTINGS_PARTS.subscriptions} />
        <Tabs.Panel className={styles.panel} value={SETTINGS_PARTS.payments} />
      </Tabs.Root>
    </section>
  )
}
