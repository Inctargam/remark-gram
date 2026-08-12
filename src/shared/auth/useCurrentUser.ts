'use client'

import { useStore } from 'zustand'

import { sessionStore } from './sessionStore'

export const useCurrentUser = () => useStore(sessionStore, ({ currentUser }) => currentUser)
