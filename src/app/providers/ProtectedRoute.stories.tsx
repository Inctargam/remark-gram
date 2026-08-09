import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { getRouter } from '@storybook/nextjs-vite/navigation.mock'
import { expect, waitFor } from 'storybook/test'

import { sessionStore } from '@/shared/auth'

import { ProtectedRoute } from './ProtectedRoute'

const PROTECTED_CONTENT = 'Protected content'

const meta = {
  title: 'app/providers/ProtectedRoute',
  component: ProtectedRoute,
  args: {
    children: <p>{PROTECTED_CONTENT}</p>,
  },
  tags: ['autodocs'],
  beforeEach: () => {
    const previousState = sessionStore.getState()
    const router = getRouter()

    router.replace.mockClear()
    sessionStore.setState({ accessToken: null, status: 'loading' })

    return () => sessionStore.setState(previousState)
  },
} satisfies Meta<typeof ProtectedRoute>

export default meta

type Story = StoryObj<typeof meta>

export const Loading: Story = {
  parameters: {
    nextjs: { navigation: { pathname: '/settings' } },
  },
  play: async ({ canvas }) => {
    await expect(canvas.queryByText(PROTECTED_CONTENT)).not.toBeInTheDocument()
    await expect(getRouter().replace).not.toHaveBeenCalled()
  },
}

export const GuestSettings: Story = {
  beforeEach: () => sessionStore.getState().setGuest(),
  parameters: {
    nextjs: { navigation: { pathname: '/settings' } },
  },
  play: async ({ canvas }) => {
    await waitFor(() => expect(getRouter().replace).toHaveBeenCalledWith('/sign-in'))
    await expect(canvas.queryByText(PROTECTED_CONTENT)).not.toBeInTheDocument()
  },
}

export const GuestCreate: Story = {
  beforeEach: () => sessionStore.getState().setGuest(),
  parameters: {
    nextjs: { navigation: { pathname: '/create' } },
  },
  play: async ({ canvas }) => {
    await waitFor(() => expect(getRouter().replace).toHaveBeenCalledWith('/sign-in'))
    await expect(canvas.queryByText(PROTECTED_CONTENT)).not.toBeInTheDocument()
  },
}

export const GuestProfile: Story = {
  beforeEach: () => sessionStore.getState().setGuest(),
  parameters: {
    nextjs: { navigation: { pathname: '/profile' } },
  },
  play: async ({ canvas }) => {
    await waitFor(() => expect(getRouter().replace).toHaveBeenCalledWith('/'))
    await expect(canvas.queryByText(PROTECTED_CONTENT)).not.toBeInTheDocument()
  },
}

export const AuthenticatedProfile: Story = {
  beforeEach: () => sessionStore.getState().setAuthenticated('mock-token'),
  parameters: {
    nextjs: { navigation: { pathname: '/profile' } },
  },
  play: async ({ canvas }) => {
    await waitFor(() => expect(getRouter().replace).toHaveBeenCalledWith('/profile/mock-user-1'))
    await expect(canvas.queryByText(PROTECTED_CONTENT)).not.toBeInTheDocument()
  },
}

export const AuthenticatedSettings: Story = {
  beforeEach: () => sessionStore.getState().setAuthenticated('mock-token'),
  parameters: {
    nextjs: { navigation: { pathname: '/settings' } },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(PROTECTED_CONTENT)).toBeVisible()
    await expect(getRouter().replace).not.toHaveBeenCalled()
  },
}

export const AuthenticatedCreate: Story = {
  beforeEach: () => sessionStore.getState().setAuthenticated('mock-token'),
  parameters: {
    nextjs: { navigation: { pathname: '/create' } },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(PROTECTED_CONTENT)).toBeVisible()
    await expect(getRouter().replace).not.toHaveBeenCalled()
  },
}
