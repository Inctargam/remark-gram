'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { EditProfileForm } from '@/features/edit-profile'
import { useSessionStatus } from '@/shared/auth'
import { ROUTES } from '@/shared/config'
import { Button } from '@/shared/ui/button'
import { Icon } from '@/shared/ui/icon'
import { Tabs } from '@/shared/ui/tabs'

import styles from './settingsPage.module.css'

export const SettingsPage = () => {
  const router = useRouter()
  const sessionStatus = useSessionStatus()

  useEffect(() => {
    if (sessionStatus === 'guest') {
      router.replace(ROUTES.signIn)
    }
  }, [router, sessionStatus])

  if (sessionStatus !== 'authenticated') {
    return null
  }

  return (
    <section aria-label="Profile settings" className={styles.page}>
      <Tabs.Root className={styles.tabs} defaultValue="general-information">
        <div className={styles.tabsViewport}>
          <Tabs.List className={styles.tabsList}>
            <Tabs.Tab value="general-information">General information</Tabs.Tab>
            <Tabs.Tab value="devices" disabled>
              Devices
            </Tabs.Tab>
            <Tabs.Tab value="account-management" disabled>
              Account Management
            </Tabs.Tab>
            <Tabs.Tab value="payments" disabled>
              My payments
            </Tabs.Tab>
          </Tabs.List>
        </div>

        <Tabs.Panel className={styles.panel} value="general-information">
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
      </Tabs.Root>
    </section>
  )
}
