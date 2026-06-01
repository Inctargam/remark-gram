import type { ReactNode } from 'react'

import { LogoutButton } from '@/features/logout'
import { BottomBar, Sidebar } from '@/widgets/navigation'

import styles from './layout.module.css'

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.shell}>
      <div className={styles.sidebarSlot}>
        <Sidebar footer={<LogoutButton />} />
      </div>
      <main className={styles.main}>{children}</main>
      <div className={styles.bottomBarSlot}>
        <BottomBar />
      </div>
    </div>
  )
}
