import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, screen, userEvent, within } from 'storybook/test'

import type { Post } from '@/entities/post'

import { HomePage } from './HomePage'

const createImageUrl = (label: string, hue: number) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080"><rect width="1080" height="1080" fill="hsl(${hue}, 42%, 32%)"/><text x="50%" y="52%" fill="hsl(${hue}, 60%, 88%)" font-family="sans-serif" font-size="220" text-anchor="middle" dominant-baseline="middle">${label}</text></svg>`
  )}`

const createMockPosts = (): Post[] =>
  Array.from({ length: 4 }, (_, index) => ({
    id: `mock-user-1-post-${String(index + 1).padStart(2, '0')}`,
    ownerId: 'mock-user-1',
    ownerUsername: 'UserName',
    ownerAvatarUrl: null,
    images:
      index === 0
        ? Array.from({ length: 3 }, (_, imageIndex) => ({
            url: createImageUrl(`${index + 1}.${imageIndex + 1}`, (imageIndex * 60) % 360),
            width: 1080,
            height: 1080,
          }))
        : [
            {
              url: createImageUrl(`${index + 1}`, (index * 37) % 360),
              width: 1080,
              height: 1080,
            },
          ],
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    createdAt: new Date(Date.now() - (22 + index * 60) * 60_000).toISOString(),
    updatedAt: new Date(Date.now() - (22 + index * 60) * 60_000).toISOString(),
  }))

const meta = {
  title: 'pages/home/HomePage',
  component: HomePage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    posts: createMockPosts(),
    registeredUsersCount: 9213,
  },
} satisfies Meta<typeof HomePage>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByRole('heading', { name: 'Registered users:' })).toBeInTheDocument()
    await expect(canvas.getByLabelText('9,213 registered users')).toBeInTheDocument()
    await expect(canvas.getAllByText('UserName')).toHaveLength(4)
    await expect(canvas.getAllByText('Show more')).toHaveLength(4)
    await expect(canvas.getAllByAltText(/Lorem ipsum dolor sit amet/)).toHaveLength(4)
    await expect(
      canvas.queryByRole('button', { name: 'Show previous photo' })
    ).not.toBeInTheDocument()
    await expect(canvas.queryByRole('button', { name: 'Show next photo' })).not.toBeInTheDocument()
    await expect(canvas.queryByRole('button', { name: 'Show photo 1' })).not.toBeInTheDocument()

    const firstPostLink = canvas.getAllByRole('link', { name: /Lorem ipsum dolor sit amet/ })[0]

    await expect(firstPostLink).toHaveAttribute(
      'href',
      '/profile/mock-user-1?postId=mock-user-1-post-01&returnTo=%2F'
    )

    await userEvent.click(firstPostLink)

    await expect(window.location.pathname).toBe('/profile/mock-user-1')
    await expect(window.location.search).toBe('?postId=mock-user-1-post-01&returnTo=%2F')
    const dialog = await screen.findByRole('dialog')

    await expect(dialog).toBeVisible()
    await expect(within(dialog).getByRole('button', { name: 'Show next photo' })).toBeVisible()
    await expect(within(dialog).getByRole('button', { name: 'Show photo 1' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )

    await userEvent.keyboard('{Escape}')

    await expect(window.location.pathname).toBe('/')
    await expect(window.location.search).toBe('')
    await expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  },
}

export const NoPosts: Story = {
  args: {
    posts: [],
    registeredUsersCount: 1000,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByLabelText('1,000 registered users')).toBeInTheDocument()
  },
}
