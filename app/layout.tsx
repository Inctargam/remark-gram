import '@/app/styles/globals.css'

import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { LogoutButton } from '@/features/logout'
import { BottomBar, Sidebar } from '@/widgets/navigation'

import styles from './layout.module.css'

export const metadata: Metadata = {
  title: 'Inctagram',
  description: 'Inctagram application',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className={styles.shell}>
          <div className={styles.sidebarSlot}>
            <Sidebar footer={<LogoutButton />} />
          </div>
          <main className={styles.main}>{children}</main>
          <div className={styles.bottomBarSlot}>
            <BottomBar />
          </div>
        </div>
      </body>
    </html>
  )
}
