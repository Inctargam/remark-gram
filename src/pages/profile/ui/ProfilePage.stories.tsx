import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'

import type { Post, PostsPage } from '@/entities/post'
import { MOCK_CURRENT_USER_ID } from '@/shared/auth'

import { ProfilePage } from './ProfilePage'

const OTHER_USER_ID = 'mock-user-2'

const createImageUrl = (label: string, hue: number) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080"><rect width="1080" height="1080" fill="hsl(${hue}, 42%, 32%)"/><text x="50%" y="52%" fill="hsl(${hue}, 60%, 88%)" font-family="sans-serif" font-size="220" text-anchor="middle" dominant-baseline="middle">${label}</text></svg>`
  )}`

const createPage = (ownerId: string): PostsPage => ({
  items: Array.from(
    { length: 8 },
    (_, index): Post => ({
      id: `${ownerId}-post-${index + 1}`,
      ownerId,
      ownerUsername: 'UserName',
      ownerAvatarUrl: null,
      images: [
        { url: createImageUrl(`${index + 1}`, (index * 37) % 360), width: 1080, height: 1080 },
      ],
      description: `Mock publication ${index + 1}`,
      createdAt: '2026-07-01T12:00:00.000Z',
      updatedAt: '2026-07-01T12:00:00.000Z',
    })
  ),
  nextCursor: null,
})

/**
 * Storybook does not run Next.js route handlers, so the posts mock endpoint is stubbed here.
 * The stub answers the profile feed request only and is restored after every story.
 */
const stubPostsFetch = () => {
  const originalFetch = globalThis.fetch

  globalThis.fetch = (async (input: RequestInfo | URL) => {
    const url = typeof input === 'string' ? input : input.toString()
    const ownerId = url.includes(OTHER_USER_ID) ? OTHER_USER_ID : MOCK_CURRENT_USER_ID

    return Response.json(createPage(ownerId))
  }) as typeof globalThis.fetch

  return () => {
    globalThis.fetch = originalFetch
  }
}

const meta = {
  title: 'pages/ProfilePage',
  component: ProfilePage,
  tags: ['autodocs'],
  args: {
    userId: MOCK_CURRENT_USER_ID,
  },
  beforeEach: stubPostsFetch,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      navigation: {
        pathname: `/profile/${MOCK_CURRENT_USER_ID}`,
      },
    },
  },
} satisfies Meta<typeof ProfilePage>

export default meta

type Story = StoryObj<typeof meta>

export const OwnProfile: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(await canvas.findByAltText('Mock publication 1')).toBeInTheDocument()
    await expect(canvas.getAllByRole('img')).toHaveLength(8)
    await expect(canvas.getByRole('button', { name: 'Profile Settings' })).toBeInTheDocument()
  },
}

/** Opening a post keeps the URL: the view is a modal over the profile, not a route. */
export const OpenPost: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(await canvas.findByAltText('Mock publication 2'))

    // The modal renders in a portal, so it is looked up in the whole document.
    const dialog = await screen.findByRole('dialog')

    await expect(within(dialog).getByText('Mock publication 2')).toBeVisible()
    await expect(within(dialog).getByText('July 1, 2026')).toBeInTheDocument()

    await userEvent.keyboard('{Escape}')

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  },
}

export const OtherUserProfile: Story = {
  args: {
    userId: OTHER_USER_ID,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(await canvas.findByAltText('Mock publication 1')).toBeInTheDocument()
    await expect(canvas.queryByRole('button', { name: 'Profile Settings' })).not.toBeInTheDocument()
  },
}
