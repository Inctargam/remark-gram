import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'

import type { Post, PostsPage } from '../../../entities/post'
import { MOCK_CURRENT_USER_ID } from '../../../shared/auth'
import { ProfilePageView } from './ProfilePageView'

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

const createProfile = (userId: string) => ({
  id: userId,
  username: userId === OTHER_USER_ID ? 'OtherUser' : 'UserName',
  description:
    userId === OTHER_USER_ID
      ? 'Mock profile for a second author. Used to verify public profile SSR states.'
      : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  followingCount: userId === OTHER_USER_ID ? 128 : 2218,
  followersCount: userId === OTHER_USER_ID ? 642 : 2358,
  publicationsCount: userId === OTHER_USER_ID ? 4 : 20,
  avatarUrl: null,
})

/**
 * Storybook does not run Next.js route handlers, so the posts mock endpoint is stubbed here.
 * The stub keeps deleted ids so that a refetched feed really comes back without them, and is
 * restored after every story.
 */
const stubPostsFetch = () => {
  const originalFetch = globalThis.fetch
  const deletedIds = new Set<string>()

  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input.toString()
    const method = init?.method ?? 'GET'

    if (method === 'DELETE') {
      deletedIds.add(url.split('/').pop() ?? '')

      return new Response(null, { status: 204 })
    }

    const ownerId = url.includes(OTHER_USER_ID) ? OTHER_USER_ID : MOCK_CURRENT_USER_ID
    const page = createPage(ownerId)

    return Response.json({
      ...page,
      items: page.items.filter(({ id }) => !deletedIds.has(id)),
    })
  }) as typeof globalThis.fetch

  return () => {
    globalThis.fetch = originalFetch
  }
}

const meta = {
  title: 'pages/ProfilePage',
  component: ProfilePageView,
  tags: ['autodocs'],
  args: {
    initialPostsPage: createPage(MOCK_CURRENT_USER_ID),
    initialSelectedPost: null,
    profile: createProfile(MOCK_CURRENT_USER_ID),
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
} satisfies Meta<typeof ProfilePageView>

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

/** UC-2 entry point: the owner reaches the edit form through the three-dot menu on the post. */
export const EditOwnPost: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(await canvas.findByAltText('Mock publication 1'))
    await userEvent.click(await screen.findByRole('button', { name: 'Post actions' }))
    await userEvent.click(await screen.findByRole('menuitem', { name: 'Edit Post' }))

    const dialog = await screen.findByRole('dialog')

    await expect(dialog).toHaveTextContent('Edit Post')
    await expect(screen.getByLabelText('Add publication descriptions')).toHaveValue(
      'Mock publication 1'
    )
  },
}

/** UC-3 end to end: menu → confirmation → post gone from the feed, user stays on the profile. */
export const DeleteOwnPost: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(await canvas.findByAltText('Mock publication 3'))
    await userEvent.click(await screen.findByRole('button', { name: 'Post actions' }))
    await userEvent.click(await screen.findByRole('menuitem', { name: 'Delete Post' }))

    await expect(
      await screen.findByText('Are you sure you want to delete this post?')
    ).toBeVisible()

    await userEvent.click(screen.getByRole('button', { name: 'Yes' }))

    // Both the confirmation and the post view close; the profile grid is what stays.
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    await waitFor(() => expect(canvas.queryByAltText('Mock publication 3')).not.toBeInTheDocument())
    await expect(canvas.getByAltText('Mock publication 1')).toBeInTheDocument()
  },
}

export const OtherUserProfile: Story = {
  args: {
    initialPostsPage: createPage(OTHER_USER_ID),
    profile: createProfile(OTHER_USER_ID),
    userId: OTHER_USER_ID,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(await canvas.findByAltText('Mock publication 1')).toBeInTheDocument()
    await expect(canvas.queryByRole('button', { name: 'Profile Settings' })).not.toBeInTheDocument()
  },
}
