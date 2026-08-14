import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { getRouter } from '@storybook/nextjs-vite/navigation.mock'
import { expect, screen, userEvent, waitFor } from 'storybook/test'

import { ProfileAvatar } from './ProfileAvatar'

const AVATAR_DATA_URL =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="192" height="192"%3E%3Crect width="192" height="192" fill="%236a7d92"/%3E%3Ccircle cx="96" cy="72" r="38" fill="%23f5d0b5"/%3E%3Cpath d="M35 192c5-48 29-72 61-72s56 24 61 72" fill="%232d3440"/%3E%3C/svg%3E'

const BASE_PROFILE = {
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

const PROFILE_AVATAR = {
  url: AVATAR_DATA_URL,
  width: 192,
  height: 192,
  fileSize: 300,
  createdAt: '2026-08-06T14:41:15.904Z',
}

let hasAvatar = false
let shouldFailDelete = false
let shouldHoldDelete = false
let resolveDeleteRequest: (() => void) | null = null

const stubProfileAvatarFetch = () => {
  const originalFetch = globalThis.fetch

  hasAvatar = false
  shouldFailDelete = false
  shouldHoldDelete = false
  resolveDeleteRequest = null
  globalThis.fetch = (async (_input: RequestInfo | URL, init?: RequestInit) => {
    if (init?.method === 'DELETE') {
      if (shouldHoldDelete) {
        await new Promise<void>((resolve) => {
          resolveDeleteRequest = resolve
        })
      }

      if (shouldFailDelete) {
        return Response.json({ message: 'Server unavailable.' }, { status: 500 })
      }

      hasAvatar = false
      return Response.json({ avatars: [] })
    }

    if (init?.method === 'POST') {
      hasAvatar = true
      return Response.json({ avatars: [PROFILE_AVATAR] })
    }

    return Response.json({
      ...BASE_PROFILE,
      avatars: hasAvatar ? [PROFILE_AVATAR] : [],
    })
  }) as typeof globalThis.fetch

  return () => {
    resolveDeleteRequest?.()
    globalThis.fetch = originalFetch
  }
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

const meta = {
  title: 'features/manage-profile-avatar/ProfileAvatar',
  component: ProfileAvatar,
  tags: ['autodocs'],
  beforeEach: stubProfileAvatarFetch,
  parameters: {
    layout: 'centered',
    nextjs: { navigation: { pathname: '/settings' } },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 240, padding: 24, background: 'var(--color-dark-700)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProfileAvatar>

export default meta

type Story = StoryObj<typeof meta>

export const Empty: Story = {
  play: async ({ canvas }) => {
    await expect(await canvas.findByRole('button', { name: 'Add Profile Photo' })).toBeVisible()
    await expect(canvas.queryByRole('button', { name: 'Delete profile photo' })).toBeNull()
  },
}

export const SelectFromComputer: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(await canvas.findByRole('button', { name: 'Add Profile Photo' }))

    await expect(screen.getByRole('dialog', { name: 'Add a Profile Photo' })).toBeVisible()
    await expect(screen.getByRole('button', { name: 'Select from Computer' })).toBeVisible()
  },
}

export const ValidationError: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(await canvas.findByRole('button', { name: 'Add Profile Photo' }))
    await userEvent.upload(
      screen.getByLabelText('Profile photo file'),
      new File(['photo'], 'avatar.webp', { type: 'image/webp' }),
      { applyAccept: false }
    )

    await expect(screen.getByRole('alert')).toHaveTextContent(
      'Error! The photo must be less than 10 Mb and have JPEG or PNG format'
    )
  },
}

export const Cropping: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(await canvas.findByRole('button', { name: 'Add Profile Photo' }))
    await userEvent.upload(screen.getByLabelText('Profile photo file'), createPngFile())

    await expect(await screen.findByLabelText('Profile photo crop area')).toBeVisible()
    await expect(screen.getByRole('button', { name: 'Save' })).toBeVisible()
  },
}

export const SuccessfulUpload: Story = {
  beforeEach: () => {
    getRouter().replace.mockClear()
  },
  play: async ({ canvas }) => {
    await userEvent.click(await canvas.findByRole('button', { name: 'Add Profile Photo' }))
    await userEvent.upload(screen.getByLabelText('Profile photo file'), createPngFile())
    await screen.findByLabelText('Profile photo crop area')
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Add a Profile Photo' })).toBeNull()
    })
    await expect(canvas.getByRole('button', { name: 'Delete profile photo' })).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Select Profile Photo' })).toBeVisible()
    await expect(getRouter().replace).not.toHaveBeenCalled()
  },
}

export const ExistingPhoto: Story = {
  beforeEach: () => {
    hasAvatar = true
  },
  play: async ({ canvas }) => {
    const deleteButton = await canvas.findByRole('button', { name: 'Delete profile photo' })
    const avatar = deleteButton.parentElement
    const avatarImage = avatar?.querySelector('img')
    const avatarRect = avatar?.getBoundingClientRect()
    const deleteButtonRect = deleteButton.getBoundingClientRect()

    await expect(deleteButton).toBeVisible()
    await expect(deleteButtonRect.width).toBe(24)
    await expect(deleteButtonRect.top - (avatarRect?.top ?? 0)).toBe(12)
    await expect((avatarRect?.right ?? 0) - deleteButtonRect.right).toBe(12)
    await expect(getComputedStyle(deleteButton).borderTopWidth).toBe('0px')
    await expect(getComputedStyle(avatarImage as Element).maskImage).not.toBe('none')
    await expect(canvas.getByRole('button', { name: 'Select Profile Photo' })).toBeVisible()
  },
}

export const MobileExistingPhoto: Story = {
  globals: {
    viewport: {
      value: 'mobile1',
      isRotated: false,
    },
  },
  beforeEach: () => {
    hasAvatar = true
  },
  play: async ({ canvas }) => {
    const deleteButton = await canvas.findByRole('button', { name: 'Delete profile photo' })
    const avatar = deleteButton.parentElement
    const avatarRect = avatar?.getBoundingClientRect()
    const deleteButtonRect = deleteButton.getBoundingClientRect()

    await expect(deleteButtonRect.width).toBe(36)
    await expect(deleteButtonRect.height).toBe(36)
    await expect(deleteButtonRect.top - (avatarRect?.top ?? 0)).toBe(6)
    await expect((avatarRect?.right ?? 0) - deleteButtonRect.right).toBe(6)
  },
}

export const DeleteConfirmation: Story = {
  beforeEach: () => {
    hasAvatar = true
  },
  play: async ({ canvas }) => {
    await userEvent.click(await canvas.findByRole('button', { name: 'Delete profile photo' }))

    await expect(screen.getByRole('dialog', { name: 'Delete Photo' })).toBeVisible()
    await expect(screen.getByText('Are you sure you want to delete the photo?')).toBeVisible()
  },
}

export const DeleteFailure: Story = {
  beforeEach: () => {
    hasAvatar = true
    shouldFailDelete = true
  },
  play: async ({ canvas }) => {
    await userEvent.click(await canvas.findByRole('button', { name: 'Delete profile photo' }))
    await userEvent.click(screen.getByRole('button', { name: 'Yes' }))

    await expect(await screen.findByRole('alert')).toHaveTextContent('Error! Server unavailable.')
    await expect(screen.getByRole('dialog', { name: 'Delete Photo' })).toBeVisible()
  },
}

export const SuccessfulDelete: Story = {
  beforeEach: () => {
    hasAvatar = true
    getRouter().replace.mockClear()
  },
  play: async ({ canvas }) => {
    await userEvent.click(await canvas.findByRole('button', { name: 'Delete profile photo' }))
    await userEvent.click(screen.getByRole('button', { name: 'Yes' }))

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Delete Photo' })).toBeNull()
    })
    await expect(canvas.queryByRole('button', { name: 'Delete profile photo' })).toBeNull()
    await expect(canvas.getByRole('button', { name: 'Add Profile Photo' })).toBeVisible()
    await expect(getRouter().replace).not.toHaveBeenCalled()
  },
}

export const DeletePending: Story = {
  beforeEach: () => {
    hasAvatar = true
    shouldHoldDelete = true
  },
  play: async ({ canvas }) => {
    await userEvent.click(await canvas.findByRole('button', { name: 'Delete profile photo' }))
    await userEvent.click(screen.getByRole('button', { name: 'Yes' }))

    await waitFor(() => expect(resolveDeleteRequest).toBeTypeOf('function'))
    await expect(screen.getByRole('button', { name: 'Yes' })).toBeDisabled()
    await expect(screen.getByRole('button', { name: 'No' })).toBeDisabled()
    await expect(screen.getByRole('button', { name: 'Close' })).toBeDisabled()
    await userEvent.keyboard('{Escape}')
    await expect(screen.getByRole('dialog', { name: 'Delete Photo' })).toBeVisible()

    resolveDeleteRequest?.()
  },
}
