import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { getRouter } from '@storybook/nextjs-vite/navigation.mock'
import { expect, waitFor } from 'storybook/test'

import { sessionStore } from '@/shared/auth'

import { SettingsPage } from './SettingsPage'

const meta = {
  title: 'pages/SettingsPage',
  component: SettingsPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      navigation: {
        pathname: '/settings',
      },
    },
  },
} satisfies Meta<typeof SettingsPage>

export default meta

type Story = StoryObj<typeof meta>

export const GeneralInformation: Story = {
  beforeEach: () => {
    const previousState = sessionStore.getState()
    sessionStore.getState().setAuthenticated('mock-token')

    return () => sessionStore.setState(previousState)
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('tab', { name: 'General information' })).toHaveAttribute(
      'data-active'
    )
    await expect(canvas.getByRole('tab', { name: 'Devices' })).toHaveAttribute(
      'aria-disabled',
      'true'
    )
    await expect(canvas.getByLabelText('Username*')).toHaveValue('Usertest')
    await expect(canvas.getByRole('button', { name: 'Save Changes' })).toBeVisible()
  },
}

export const GuestRedirect: Story = {
  beforeEach: () => {
    const previousState = sessionStore.getState()
    const router = getRouter()

    router.replace.mockClear()
    sessionStore.getState().setGuest()

    return () => sessionStore.setState(previousState)
  },
  play: async ({ canvas }) => {
    await waitFor(() => expect(getRouter().replace).toHaveBeenCalledWith('/sign-in'))
    await expect(canvas.queryByRole('tab', { name: 'General information' })).not.toBeInTheDocument()
  },
}
