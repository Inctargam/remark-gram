import '@/app/styles/globals.css'

import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { AppProviders } from '@/app/providers'
import { AppShell } from '@/widgets/app-shell'

export const metadata: Metadata = {
  title: 'Remarkgram',
  description: 'Remarkgram application',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          <AppShell>{children}</AppShell>
        </AppProviders>
      </body>
    </html>
  )
}
