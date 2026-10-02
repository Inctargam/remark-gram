import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { getRouter } from '@storybook/nextjs-vite/navigation.mock'
import { expect, screen, userEvent, waitFor } from 'storybook/test'

import { ProfileAvatar } from './ProfileAvatar'

const BASE_PROFILE = {
  userId: 1,
  username: 'user123',
  firstName: 'John',
  lastName: 'Doe',
  city: 'Austin',
  country: { code: 'US', name: { en: 'United States', ru: 'США' } },
  dateOfBirth: '1990-01-01',
  aboutMe: 'About me',
  avatarFileId: null,
}

let hasAvatar = false
let shouldFailDelete = false
let shouldHoldDelete = false
let resolveDeleteRequest: (() => void) | null = null
let failConfirmationOnce = false
let failInstallationOnce = false
let holdInstallation = false
let resolveInstallation: (() => void) | null = null
let uploadSessionCount = 0
let storageUploadCount = 0
let confirmationCount = 0
let installationKeys: string[] = []

const stubProfileAvatarFetch = () => {
  const originalFetch = globalThis.fetch

  hasAvatar = false
  shouldFailDelete = false
  shouldHoldDelete = false
  resolveDeleteRequest = null
  failConfirmationOnce = false
  failInstallationOnce = false
  holdInstallation = false
  resolveInstallation = null
  uploadSessionCount = 0
  storageUploadCount = 0
  confirmationCount = 0
  installationKeys = []
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const method = input instanceof Request ? input.method : (init?.method ?? 'GET')

    if (method === 'DELETE') {
      if (shouldHoldDelete) {
        await new Promise<void>((resolve) => {
          resolveDeleteRequest = resolve
        })
      }

      if (shouldFailDelete) {
        return Response.json({ message: 'Server unavailable.' }, { status: 500 })
      }

      hasAvatar = false
      return new Response(null, { status: 204 })
    }

    if (method === 'POST') {
      const url = input instanceof Request ? input.url : String(input)
      if (url.endsWith('/files/avatar-upload')) {
        uploadSessionCount += 1
        return Response.json(
          {
            id: 'story-avatar',
            clientFileId: 'local-file',
            url: 'https://storage.example.com/avatar',
            fields: { key: 'avatar' },
          },
          { status: 201 }
        )
      }
      if (url.endsWith('/image-uploads/complete')) {
        confirmationCount += 1
        if (failConfirmationOnce) {
          failConfirmationOnce = false
          return Response.json({ message: 'Confirmation unavailable.' }, { status: 503 })
        }
      } else {
        storageUploadCount += 1
      }
      return new Response(null, { status: 204 })
    }

    if (method === 'PUT') {
      installationKeys.push((input as Request).headers.get('Idempotency-Key') ?? '')
      if (holdInstallation) {
        await new Promise<void>((resolve) => {
          resolveInstallation = resolve
        })
      }
      if (failInstallationOnce) {
        failInstallationOnce = false
        return Response.json({ message: 'Installation unavailable.' }, { status: 503 })
      }
      hasAvatar = true
      return new Response(null, { status: 204 })
    }

    return Response.json({
      ...BASE_PROFILE,
      avatarFileId: hasAvatar ? 'story-avatar' : null,
    })
  }) as typeof globalThis.fetch

  return () => {
    resolveDeleteRequest?.()
    resolveInstallation?.()
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
    await waitFor(() => expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled())
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
    await expect(
      canvas.getByRole('button', { name: 'Delete profile photo', hidden: true })
    ).toBeDisabled()
    await expect(screen.getByRole('button', { name: 'Yes' })).toBeDisabled()
    await expect(screen.getByRole('button', { name: 'No' })).toBeDisabled()
    await expect(screen.getByRole('button', { name: 'Close' })).toBeDisabled()
    await userEvent.keyboard('{Escape}')
    await expect(screen.getByRole('dialog', { name: 'Delete Photo' })).toBeVisible()

    resolveDeleteRequest?.()
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Delete Photo' })).toBeNull())
    expect(canvas.queryByRole('button', { name: 'Delete profile photo' })).toBeNull()
  },
}

export const RetryConfirmation: Story = {
  beforeEach: () => {
    failConfirmationOnce = true
  },
  play: async ({ canvas }) => {
    await userEvent.click(await canvas.findByRole('button', { name: 'Add Profile Photo' }))
    await userEvent.upload(screen.getByLabelText('Profile photo file'), createPngFile())
    await screen.findByLabelText('Profile photo crop area')
    await waitFor(() => expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled())
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))
    await expect(await screen.findByRole('alert')).toHaveTextContent('Confirmation unavailable.')
    await waitFor(() => expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled())
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))
    await waitFor(() =>
      expect(screen.queryByRole('dialog', { name: 'Add a Profile Photo' })).toBeNull()
    )
    expect(uploadSessionCount).toBe(1)
    expect(storageUploadCount).toBe(1)
    expect(confirmationCount).toBe(2)
  },
}

export const RetryInstallationAfter503: Story = {
  beforeEach: () => {
    failInstallationOnce = true
  },
  play: async ({ canvas }) => {
    await userEvent.click(await canvas.findByRole('button', { name: 'Add Profile Photo' }))
    await userEvent.upload(screen.getByLabelText('Profile photo file'), createPngFile())
    await screen.findByLabelText('Profile photo crop area')
    await waitFor(() => expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled())
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))
    await expect(await screen.findByRole('alert')).toHaveTextContent('Installation unavailable.')
    expect(canvas.queryByRole('button', { name: 'Delete profile photo', hidden: true })).toBeNull()
    await waitFor(() => expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled())
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))
    await waitFor(() =>
      expect(screen.queryByRole('dialog', { name: 'Add a Profile Photo' })).toBeNull()
    )
    expect(uploadSessionCount).toBe(1)
    expect(storageUploadCount).toBe(1)
    expect(confirmationCount).toBe(1)
    expect(installationKeys).toHaveLength(2)
    expect(installationKeys[0]).not.toBe(installationKeys[1])
  },
}

export const InstallationPending: Story = {
  beforeEach: () => {
    holdInstallation = true
  },
  play: async ({ canvas }) => {
    await userEvent.click(await canvas.findByRole('button', { name: 'Add Profile Photo' }))
    await userEvent.upload(screen.getByLabelText('Profile photo file'), createPngFile())
    await screen.findByLabelText('Profile photo crop area')
    await waitFor(() => expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled())
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))
    await waitFor(() => expect(resolveInstallation).toBeTypeOf('function'))
    expect(canvas.queryByRole('button', { name: 'Delete profile photo', hidden: true })).toBeNull()
    await expect(
      canvas.getByRole('button', { name: 'Add Profile Photo', hidden: true })
    ).toBeDisabled()
    await expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
    await expect(screen.getByRole('button', { name: 'Close' })).toBeDisabled()
    await userEvent.keyboard('{Escape}')
    await expect(screen.getByRole('dialog', { name: 'Add a Profile Photo' })).toBeVisible()
    resolveInstallation?.()
    await waitFor(() =>
      expect(screen.queryByRole('dialog', { name: 'Add a Profile Photo' })).toBeNull()
    )
    await expect(canvas.getByRole('button', { name: 'Delete profile photo' })).toBeVisible()
  },
}

export const CloseFailedUpload: Story = {
  beforeEach: () => {
    failConfirmationOnce = true
  },
  play: async ({ canvas }) => {
    await userEvent.click(await canvas.findByRole('button', { name: 'Add Profile Photo' }))
    await userEvent.upload(screen.getByLabelText('Profile photo file'), createPngFile())
    await screen.findByLabelText('Profile photo crop area')
    await waitFor(() => expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled())
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))
    await screen.findByRole('alert')
    await userEvent.click(screen.getByRole('button', { name: 'Close' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Add Profile Photo' }))
    await expect(screen.getByRole('button', { name: 'Select from Computer' })).toBeVisible()
    expect(screen.queryByRole('alert')).toBeNull()
    await userEvent.upload(screen.getByLabelText('Profile photo file'), createPngFile())
    await screen.findByLabelText('Profile photo crop area')
    await waitFor(() => expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled())
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))
    await waitFor(() =>
      expect(screen.queryByRole('dialog', { name: 'Add a Profile Photo' })).toBeNull()
    )
    expect(uploadSessionCount).toBe(2)
  },
}

export const ChangedCropStartsNewUpload: Story = {
  beforeEach: () => {
    failConfirmationOnce = true
  },
  play: async ({ canvas }) => {
    await userEvent.click(await canvas.findByRole('button', { name: 'Add Profile Photo' }))
    await userEvent.upload(screen.getByLabelText('Profile photo file'), createPngFile())
    const cropArea = await screen.findByLabelText('Profile photo crop area')
    await waitFor(() => expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled())
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))
    await screen.findByRole('alert')
    const cropper = cropArea.firstElementChild as HTMLElement
    const image = cropper.querySelector('img')
    const previousTransform = image?.style.transform
    cropper.dispatchEvent(
      new WheelEvent('wheel', { bubbles: true, cancelable: true, deltaY: -200 })
    )
    await waitFor(() => expect(image?.style.transform).not.toBe(previousTransform))
    await waitFor(() => expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled())
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))
    await waitFor(() =>
      expect(screen.queryByRole('dialog', { name: 'Add a Profile Photo' })).toBeNull()
    )
    expect(uploadSessionCount).toBe(2)
    expect(storageUploadCount).toBe(2)
  },
}
