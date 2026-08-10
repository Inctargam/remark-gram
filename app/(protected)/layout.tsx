import type { ReactNode } from 'react'

import { ProtectedRoute } from '@/app/providers'

type Props = {
  children: ReactNode
}

export default function ProtectedLayout({ children }: Props) {
  return <ProtectedRoute>{children}</ProtectedRoute>
}
