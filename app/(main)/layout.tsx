import type { ReactNode } from 'react'

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

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.shell}>
      <Header
        languageSelector={
          <Select className={styles.languageSelector} options={LANGUAGE_OPTIONS} value="en" />
        }
        variant="auth"
      />
      <div className={styles.content}>
        <div className={styles.sidebarSlot}>
          <Sidebar footer={<LogoutButton />} />
        </div>
        <main className={styles.main}>{children}</main>
        <div className={styles.bottomBarSlot}>
          <BottomBar />
        </div>
      </div>
    </div>
  )
}
