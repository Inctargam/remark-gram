'use client'

import {
  environmentManager,
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import type { ReactNode } from 'react'

import { mutationGlobalErrorHandler } from '@/shared/lib/mutationGlobalErrorHandler'

type Props = {
  children: ReactNode
}

const makeQueryClient = () =>
  new QueryClient({
    mutationCache: new MutationCache({
      onError: mutationGlobalErrorHandler,
    }),
  })

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
