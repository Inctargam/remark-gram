'use client'

import { useStore } from 'zustand'

import { sessionStore } from './sessionStore'

export const useCurrentUserLoadError = () =>
  useStore(sessionStore, ({ currentUserLoadFailureAt }) => currentUserLoadFailureAt !== null)
