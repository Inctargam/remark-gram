import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { getRouter } from '@storybook/nextjs-vite/navigation.mock'
import { expect, userEvent } from 'storybook/test'

import { SettingsPage } from './SettingsPage'

const PROFILE = {
  id: 1,
  userName: 'user123',
  firstName: 'John',
  lastName: 'Doe',
  city: 'Austin',
  country: 'United States',
  region: 'Texas',
  dateOfBirth: '1990-01-01',
  aboutMe: 'About me',
  avatars: [],
  createdAt: '2026-08-06T14:41:15.904Z',
}

const stubProfileFetch = () => {
  const originalFetch = globalThis.fetch

  globalThis.fetch = (async (input: RequestInfo | URL) => {
    const requestUrl = input instanceof Request ? input.url : String(input)

    if (requestUrl.endsWith('/locations/v1/countries.json')) {
      return Response.json([
        { code: 'BY', name: 'Belarus' },
        { code: 'US', name: 'United States' },
      ])
    }

    if (requestUrl.endsWith('/locations/v1/cities/US.json')) {
      return Response.json([{ id: '2', name: 'Austin', region: 'Texas' }])
    }

    return Response.json(PROFILE)
  }) as typeof globalThis.fetch

  return () => {
    globalThis.fetch = originalFetch
  }
}

const meta = {
  title: 'pages/SettingsPage',
  component: SettingsPage,
  args: {
    activePart: 'info',
  },
  tags: ['autodocs'],
  beforeEach: stubProfileFetch,
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
    const router = getRouter()

    router.push.mockClear()
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('tab', { name: 'General information' })).toHaveAttribute(
      'data-active'
    )
    await expect(canvas.getByRole('tab', { name: 'Devices' })).toBeEnabled()
    await expect(await canvas.findByLabelText('Username*')).toHaveValue('user123')
    await expect(canvas.getByRole('button', { name: 'Save Changes' })).toBeDisabled()

    await userEvent.click(canvas.getByRole('tab', { name: 'Devices' }))
    await expect(getRouter().push).toHaveBeenLastCalledWith('/settings?part=devices')

    await userEvent.click(canvas.getByRole('tab', { name: 'Account Management' }))
    await expect(getRouter().push).toHaveBeenLastCalledWith('/settings?part=subscriptions')

    await userEvent.click(canvas.getByRole('tab', { name: 'My payments' }))
    await expect(getRouter().push).toHaveBeenLastCalledWith('/settings?part=payments')
  },
}
