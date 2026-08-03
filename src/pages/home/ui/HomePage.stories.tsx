import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'

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
    images: [
      {
        url: createImageUrl(`${index + 1}`, (index * 37) % 360),
        width: 1080,
        height: 1080,
      },
    ],
    description: `Mock publication ${index + 1}. Seeded post used until the posts backend is ready.`,
    createdAt: new Date(Date.UTC(2026, 6, 1, 12) - index * 3600_000).toISOString(),
    updatedAt: new Date(Date.UTC(2026, 6, 1, 12) - index * 3600_000).toISOString(),
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
    registeredUsersCount: 2150,
  },
} satisfies Meta<typeof HomePage>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('Inctagram')).toBeInTheDocument()
    await expect(canvas.getByText('2,150 registered users')).toBeInTheDocument()
    await expect(canvas.getByText('Latest publications')).toBeInTheDocument()
    await expect(canvas.getAllByAltText(/Mock publication \d\. Seeded/)).toHaveLength(4)
  },
}

export const NoPosts: Story = {
  args: {
    posts: [],
    registeredUsersCount: 1000,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('1,000 registered users')).toBeInTheDocument()
  },
}
