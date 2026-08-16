'use client'

import 'react-toastify/dist/ReactToastify.css'

import type { ReactNode } from 'react'
import { ToastContainer } from 'react-toastify'

import { QueryProvider } from './QueryProvider'
import { SessionBootstrap } from './SessionBootstrap'

type Props = {
  children: ReactNode
}

export const AppProviders = ({ children }: Props) => (
  <QueryProvider>
    <SessionBootstrap>{children}</SessionBootstrap>
    <ToastContainer
      position="bottom-left"
      autoClose={5000}
      hideProgressBar
      closeButton={false}
      icon={false}
    />
  </QueryProvider>
)
