'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { useSessionStatus } from '@/shared/auth'
import { ROUTES } from '@/shared/config'
import { Button } from '@/shared/ui/button'
import { Icon } from '@/shared/ui/icon'
import { Input } from '@/shared/ui/input'
import type { SelectOption } from '@/shared/ui/select'
import { Select } from '@/shared/ui/select'
import { Tabs } from '@/shared/ui/tabs'
import { TextArea } from '@/shared/ui/textarea'

import styles from './settingsPage.module.css'

const COUNTRY_OPTIONS: SelectOption<string>[] = [
  { label: 'Country', value: 'Country' },
  { label: 'United States', value: 'United States' },
]

const CITY_OPTIONS: SelectOption<string>[] = [
  { label: 'City', value: 'City' },
  { label: 'Texas', value: 'Texas' },
]

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
    <section className={styles.page} aria-labelledby="settings-title">
      <div className={styles.mobileTitleRow}>
        <Link aria-label="Back to profile" className={styles.backLink} href={ROUTES.profile}>
          <Icon iconId="icon-arrow-ios-back-outline" width={24} height={24} />
        </Link>
        <h1 className={styles.mobileTitle} id="settings-title">
          Profile Settings
        </h1>
      </div>

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
          <div className={styles.profileContent}>
            <div className={styles.avatarColumn}>
              <div className={styles.avatarWrapper}>
                <Image
                  alt="User profile"
                  className={styles.avatar}
                  fill
                  loading="eager"
                  sizes="192px"
                  src="/images/settings-profile-avatar.png"
                />
                <button
                  aria-label="Delete profile photo"
                  className={styles.deletePhoto}
                  type="button">
                  <Icon iconId="icon-close-outline" width={20} height={20} />
                </button>
              </div>

              <Button className={styles.addPhotoButton} type="button" variant="outline">
                Add a Profile Photo
              </Button>
            </div>

            <form className={styles.form}>
              <Input
                defaultValue="Usertest"
                label={
                  <>
                    Username<span className={styles.requiredMark}>*</span>
                  </>
                }
              />
              <Input
                defaultValue="Sveta"
                label={
                  <>
                    First Name<span className={styles.requiredMark}>*</span>
                  </>
                }
              />
              <Input
                defaultValue="Ivanova"
                label={
                  <>
                    Last Name<span className={styles.requiredMark}>*</span>
                  </>
                }
              />

              <label className={styles.dateField}>
                <span className={styles.desktopDateLabel}>Date of birth</span>
                <span className={styles.mobileDateLabel}>Date of birthday</span>
                <span className={styles.dateInputWrapper}>
                  <input className={styles.dateInput} defaultValue="12.12.1989" type="text" />
                  <Icon
                    className={styles.calendarIcon}
                    iconId="icon-calendar-outline"
                    width={24}
                    height={24}
                  />
                </span>
              </label>

              <div className={styles.desktopLocationFields}>
                <Select
                  defaultValue="Country"
                  label="Select your country"
                  options={COUNTRY_OPTIONS}
                />
                <Select defaultValue="City" label="Select your city" options={CITY_OPTIONS} />
              </div>

              <Input className={styles.mobileCityField} defaultValue="USA, Texas" label="City" />

              <TextArea className={styles.aboutField} label="About Me" />
            </form>
          </div>

          <div className={styles.actions}>
            <Button className={styles.saveButton} type="button">
              Save Changes
            </Button>
          </div>
        </Tabs.Panel>
      </Tabs.Root>
    </section>
  )
}
