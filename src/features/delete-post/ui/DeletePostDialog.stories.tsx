import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, screen, userEvent, waitFor } from 'storybook/test'

import type { Post } from '@/entities/post'

import { DELETE_POST_MESSAGE, DeletePostDialog } from './DeletePostDialog'

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
}

const capturedRequests: CapturedRequest[] = []

/**
 * Storybook does not run Next.js route handlers, so the posts mock endpoint is stubbed here.
 * `failDelete` makes the stub answer 500 to cover the error branch.
 */
const stubPostsFetch = (failDelete = false) => {
  const originalFetch = globalThis.fetch

  capturedRequests.length = 0

  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input.toString()
    const method = init?.method ?? 'GET'

    capturedRequests.push({ method, url })

    if (method === 'DELETE' && failDelete) {
      return new Response(null, { status: 500 })
    }

    return new Response(null, { status: 204 })
  }) as typeof globalThis.fetch

  return () => {
    globalThis.fetch = originalFetch
  }
}

const deleteRequests = () => capturedRequests.filter(({ method }) => method === 'DELETE')

const meta = {
  title: 'features/delete-post/DeletePostDialog',
  component: DeletePostDialog,
  tags: ['autodocs'],
  args: {
    post,
    open: true,
    onOpenChange: fn(),
    onDeleted: fn(),
  },
  beforeEach: () => stubPostsFetch(),
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof DeletePostDialog>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async () => {
    const dialog = await screen.findByRole('dialog')

    await expect(dialog).toHaveTextContent('Delete Post')
    await expect(screen.getByText(DELETE_POST_MESSAGE)).toBeVisible()
    await expect(screen.getByRole('button', { name: 'Yes' })).toBeEnabled()
    await expect(deleteRequests()).toHaveLength(0)
  },
}

/** Main scenario: `Yes` deletes the post and hands control back to the profile. */
export const ConfirmDelete: Story = {
  play: async ({ args }) => {
    await userEvent.click(await screen.findByRole('button', { name: 'Yes' }))

    await waitFor(() => expect(deleteRequests()).toHaveLength(1))
    await expect(deleteRequests()[0].url).toContain(`/posts/${post.id}`)
    await waitFor(() => expect(args.onDeleted).toHaveBeenCalled())
    await expect(args.onOpenChange).toHaveBeenCalledWith(false)
  },
}

/** Alternative scenario: `No` leaves the post untouched. */
export const CancelDelete: Story = {
  play: async ({ args }) => {
    await userEvent.click(await screen.findByRole('button', { name: 'No' }))

    await expect(args.onOpenChange).toHaveBeenCalledWith(false)
    await expect(args.onDeleted).not.toHaveBeenCalled()
    await expect(deleteRequests()).toHaveLength(0)
  },
}

/** The close icon is the same answer as `No`. */
export const CloseDelete: Story = {
  play: async ({ args }) => {
    await userEvent.click(await screen.findByRole('button', { name: 'Close' }))

    await expect(args.onOpenChange).toHaveBeenCalledWith(false)
    await expect(args.onDeleted).not.toHaveBeenCalled()
    await expect(deleteRequests()).toHaveLength(0)
  },
}

/** A failed deletion keeps the confirmation on screen with the reason next to the question. */
export const DeleteFailed: Story = {
  beforeEach: () => stubPostsFetch(true),
  play: async ({ args }) => {
    await userEvent.click(await screen.findByRole('button', { name: 'Yes' }))

    await expect(await screen.findByRole('alert')).toBeVisible()
    await expect(args.onDeleted).not.toHaveBeenCalled()
    await expect(args.onOpenChange).not.toHaveBeenCalled()
  },
}
