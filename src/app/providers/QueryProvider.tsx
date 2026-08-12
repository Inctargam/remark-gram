'use client'

import { environmentManager, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

const makeQueryClient = () => new QueryClient()

let browserQueryClient: QueryClient | undefined

const getQueryClient = () => {
  if (environmentManager.isServer()) {
    return makeQueryClient()
  }

  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient()
  }

  return browserQueryClient
}

export const QueryProvider = ({ children }: Props) => {
  const queryClient = getQueryClient()

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
