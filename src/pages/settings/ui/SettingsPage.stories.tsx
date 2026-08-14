import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { getRouter } from '@storybook/nextjs-vite/navigation.mock'
import { expect, screen, userEvent, waitFor } from 'storybook/test'

import { AppShellView } from '@/widgets/app-shell'

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

const createPngFile = () => {
  const bytes = Uint8Array.from(
    atob(
      'iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFElEQVR42mNkYPj/n4GBgYGJAQoAHgQCAQO0yWQAAAAASUVORK5CYII='
    ),
    (character) => character.charCodeAt(0)
  )

  return new File([bytes], 'avatar.png', { type: 'image/png' })
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

export const MobilePayments: Story = {
  args: {
    activePart: 'payments',
  },
  globals: {
    viewport: {
      value: 'mobile1',
      isRotated: false,
    },
  },
  play: async ({ canvas }) => {
    const paymentsTab = canvas.getByRole('tab', { name: 'My payments' })
    const tabsViewport = canvas.getByRole('tablist').parentElement

    await expect(canvas.getByRole('link', { name: 'Back to profile' })).toHaveAttribute(
      'href',
      '/profile'
    )
    await expect(paymentsTab).toHaveAttribute('data-active')
    await waitFor(() => expect(tabsViewport?.scrollLeft).toBeGreaterThan(0))
  },
}

export const MobileGeneralInformation: Story = {
  globals: {
    viewport: {
      value: 'settingsMobile',
      isRotated: false,
    },
  },
  parameters: {
    viewport: {
      options: {
        settingsMobile: {
          name: 'Settings mobile',
          styles: { width: '360px', height: '1068px' },
          type: 'mobile',
        },
      },
    },
  },
  render: (args) => (
    <AppShellView status="authenticated" onLogout={() => Promise.resolve()}>
      <SettingsPage {...args} />
    </AppShellView>
  ),
  play: async ({ canvas }) => {
    const backLink = canvas.getByRole('link', { name: 'Back to profile' })
    const tabsList = canvas.getByRole('tablist')
    const photoButton = await canvas.findByRole('button', { name: 'Add Profile Photo' })

    await expect(backLink.getBoundingClientRect().top).toBe(77)
    await expect(tabsList.getBoundingClientRect().top).toBe(120)
    await expect(photoButton.getBoundingClientRect().top).toBe(396)
    await expect(photoButton.getBoundingClientRect().width).toBe(330)
  },
}

export const PreservesUnsavedFieldsAfterPhotoClose: Story = {
  beforeEach: () => {
    const router = getRouter()

    router.replace.mockClear()
  },
  play: async ({ canvas }) => {
    const username = await canvas.findByLabelText('Username*')

    await userEvent.clear(username)
    await userEvent.type(username, 'unsaved-user')
    await userEvent.click(canvas.getByRole('button', { name: 'Add Profile Photo' }))
    await userEvent.click(screen.getByRole('button', { name: 'Close' }))

    await expect(username).toHaveValue('unsaved-user')
    await expect(getRouter().replace).not.toHaveBeenCalled()
  },
}

export const PreservesUnsavedFieldsAfterPhotoSave: Story = {
  beforeEach: () => {
    const router = getRouter()

    router.replace.mockClear()
  },
  play: async ({ canvas }) => {
    const username = await canvas.findByLabelText('Username*')

    await userEvent.clear(username)
    await userEvent.type(username, 'unsaved-user')
    await userEvent.click(canvas.getByRole('button', { name: 'Add Profile Photo' }))
    await userEvent.upload(screen.getByLabelText('Profile photo file'), createPngFile())
    await screen.findByLabelText('Profile photo crop area')
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Add a Profile Photo' })).toBeNull()
    })
    await expect(username).toHaveValue('unsaved-user')
    await expect(getRouter().replace).not.toHaveBeenCalled()
  },
}
