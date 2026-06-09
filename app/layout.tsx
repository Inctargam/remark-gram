import '@/app/styles/globals.css'

import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { QueryProvider } from '@/app/providers/QueryProvider'
import { LogoutButton } from '@/features/logout'
import type { SelectOption } from '@/shared/ui/select'
import { Select } from '@/shared/ui/select'
import { Header } from '@/widgets/header'
import { BottomBar, Sidebar } from '@/widgets/navigation'

import styles from './layout.module.css'

const LANGUAGE_OPTIONS: SelectOption<string>[] = [
  { label: 'English', value: 'en' },
  { label: 'Russian', value: 'ru' },
]

const IS_AUTHENTICATED_MOCK = true

export const metadata: Metadata = {
  title: 'Inctagram',
  description: 'Inctagram application',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <div className={styles.shell}>
            <Header
              languageSelector={
                <Select className={styles.languageSelector} options={LANGUAGE_OPTIONS} value="en" />
              }
              {...(IS_AUTHENTICATED_MOCK
                ? { variant: 'auth' as const }
                : { variant: 'guest' as const })}
            />
            <div className={styles.content}>
              {IS_AUTHENTICATED_MOCK && (
                <div className={styles.sidebarSlot}>
                  <Sidebar footer={<LogoutButton />} />
                </div>
              )}
              <div className={styles.main}>{children}</div>
              {IS_AUTHENTICATED_MOCK && (
                <div className={styles.bottomBarSlot}>
                  <BottomBar />
                </div>
              )}
            </div>
          </div>
        </QueryProvider>
      </body>
    </html>
  )
}
