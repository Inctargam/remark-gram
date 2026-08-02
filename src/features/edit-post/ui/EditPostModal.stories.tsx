import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, screen, userEvent, waitFor } from 'storybook/test'

import type { Post } from '@/entities/post'
import { POST_DESCRIPTION_MAX_LENGTH } from '@/entities/post'

import { DISCARD_CHANGES_MESSAGE } from './DiscardChangesDialog'
import { EditPostModal } from './EditPostModal'

const IMAGE_URL = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080"><rect width="1080" height="1080" fill="hsl(210, 42%, 32%)"/></svg>'
)}`

const post: Post = {
  id: 'post-1',
  ownerId: 'mock-user-1',
  ownerUsername: 'UserName',
  ownerAvatarUrl: null,
  images: [{ url: IMAGE_URL, width: 1080, height: 1080 }],
  description: 'Trip to the sea',
  createdAt: '2026-07-03T12:00:00.000Z',
  updatedAt: '2026-07-03T12:00:00.000Z',
}

type CapturedRequest = {
  method: string
  url: string
  body: unknown
}

const capturedRequests: CapturedRequest[] = []

/**
 * Storybook does not run Next.js route handlers, so the posts mock endpoint is stubbed here.
 * Requests are recorded to assert what the save actually sends.
 */
const stubPostsFetch = () => {
  const originalFetch = globalThis.fetch

  capturedRequests.length = 0

  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input.toString()
    const body = typeof init?.body === 'string' ? JSON.parse(init.body) : null

    capturedRequests.push({ method: init?.method ?? 'GET', url, body })

    return Response.json({ ...post, ...(body as object | null) })
  }) as typeof globalThis.fetch

  return () => {
    globalThis.fetch = originalFetch
  }
}

const patchRequests = () => capturedRequests.filter(({ method }) => method === 'PATCH')

const meta = {
  title: 'features/edit-post/EditPostModal',
  component: EditPostModal,
  tags: ['autodocs'],
  args: {
    post,
    open: true,
    onOpenChange: fn(),
  },
  beforeEach: stubPostsFetch,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof EditPostModal>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async () => {
    const dialog = await screen.findByRole('dialog')

    await expect(dialog).toHaveTextContent('Edit Post')
    await expect(screen.getByLabelText('Add publication descriptions')).toHaveValue(
      'Trip to the sea'
    )
    await expect(screen.getByText(`15/${POST_DESCRIPTION_MAX_LENGTH}`)).toBeVisible()
    // Nothing changed yet — there is nothing to save.
    await expect(screen.getByRole('button', { name: 'Save Changes' })).toBeDisabled()
  },
}

/** Main scenario: edit the description and save. */
export const SaveChanges: Story = {
  play: async ({ args }) => {
    const field = await screen.findByLabelText('Add publication descriptions')

    await userEvent.clear(field)
    await userEvent.type(field, 'Trip to the mountains')

    const saveButton = screen.getByRole('button', { name: 'Save Changes' })

    await expect(saveButton).toBeEnabled()

    await userEvent.click(saveButton)

    await waitFor(() => expect(patchRequests()).toHaveLength(1))
    await expect(patchRequests()[0].url).toContain(`/posts/${post.id}`)
    await expect(patchRequests()[0].body).toEqual({ description: 'Trip to the mountains' })
    // The form asks to be closed; the post view stays behind it.
    await expect(args.onOpenChange).toHaveBeenCalledWith(false)
  },
}

/** Alternative scenario: with no changes the close icon closes the form straight away. */
export const CloseWithoutChanges: Story = {
  play: async ({ args }) => {
    await userEvent.click(await screen.findByRole('button', { name: 'Close' }))

    await expect(args.onOpenChange).toHaveBeenCalledWith(false)
    await expect(screen.queryByText(DISCARD_CHANGES_MESSAGE)).not.toBeInTheDocument()
    await expect(patchRequests()).toHaveLength(0)
  },
}

/** Alternative scenario: unsaved changes must be confirmed before leaving. */
export const DiscardChanges: Story = {
  play: async ({ args }) => {
    const field = await screen.findByLabelText('Add publication descriptions')

    await userEvent.type(field, ' and back')
    await userEvent.click(screen.getByRole('button', { name: 'Close' }))

    await expect(await screen.findByText(DISCARD_CHANGES_MESSAGE)).toBeVisible()
    await expect(args.onOpenChange).not.toHaveBeenCalled()

    // `No` returns to the form with the typed text still there.
    await userEvent.click(screen.getByRole('button', { name: 'No' }))

    await waitFor(() => expect(screen.queryByText(DISCARD_CHANGES_MESSAGE)).not.toBeInTheDocument())
    await expect(screen.getByLabelText('Add publication descriptions')).toHaveValue(
      'Trip to the sea and back'
    )
    await expect(args.onOpenChange).not.toHaveBeenCalled()

    // `Yes` leaves the form without saving.
    await userEvent.click(screen.getByRole('button', { name: 'Close' }))
    await userEvent.click(await screen.findByRole('button', { name: 'Yes' }))

    await expect(args.onOpenChange).toHaveBeenCalledWith(false)
    await expect(patchRequests()).toHaveLength(0)
  },
}

/** A click outside the form behaves exactly like the close icon. */
export const ClickOutside: Story = {
  play: async ({ args }) => {
    const field = await screen.findByLabelText('Add publication descriptions')

    await userEvent.type(field, '!')
    await userEvent.click(document.body)

    await expect(await screen.findByText(DISCARD_CHANGES_MESSAGE)).toBeVisible()
    await expect(args.onOpenChange).not.toHaveBeenCalled()
  },
}

/** The field itself caps the input, so the counter can never pass the limit. */
export const AtDescriptionLimit: Story = {
  args: {
    post: { ...post, description: 'a'.repeat(POST_DESCRIPTION_MAX_LENGTH) },
  },
  play: async () => {
    const field = await screen.findByLabelText('Add publication descriptions')

    await expect(
      screen.getByText(`${POST_DESCRIPTION_MAX_LENGTH}/${POST_DESCRIPTION_MAX_LENGTH}`)
    ).toBeVisible()

    await userEvent.type(field, 'bbb')

    await expect(field).toHaveValue('a'.repeat(POST_DESCRIPTION_MAX_LENGTH))
    await expect(screen.getByRole('button', { name: 'Save Changes' })).toBeDisabled()
  },
}
