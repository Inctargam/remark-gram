'use client'

import { useStore } from 'zustand'

import { sessionStore } from './sessionStore'

export const useSessionStatus = () => useStore(sessionStore, ({ status }) => status)
