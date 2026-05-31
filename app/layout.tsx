import '@/app/styles/globals.css'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Inctagram',
  description: 'Inctagram application',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
