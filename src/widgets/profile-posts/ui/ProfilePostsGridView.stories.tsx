import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'

import type { Post } from '@/entities/post'

import { ProfilePostsGridView } from './ProfilePostsGridView'

const createImageUrl = (label: string, hue: number) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080"><rect width="1080" height="1080" fill="hsl(${hue}, 42%, 32%)"/><text x="50%" y="52%" fill="hsl(${hue}, 60%, 88%)" font-family="sans-serif" font-size="220" text-anchor="middle" dominant-baseline="middle">${label}</text></svg>`
  )}`

const createPosts = (count: number): Post[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `post-${index + 1}`,
    ownerId: 'mock-user-1',
    ownerUsername: 'UserName',
    ownerAvatarUrl: null,
    images: [
      { url: createImageUrl(`${index + 1}`, (index * 37) % 360), width: 1080, height: 1080 },
    ],
    description: `Mock publication ${index + 1}`,
    createdAt: '2026-07-01T12:00:00.000Z',
    updatedAt: '2026-07-01T12:00:00.000Z',
  }))

const meta = {
  title: 'widgets/ProfilePostsGridView',
  component: ProfilePostsGridView,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: {
    posts: createPosts(8),
    isLoading: false,
    isFetchingNextPage: false,
    hasNextPage: false,
    onLoadMore: fn(),
    onPostSelect: fn(),
  },
} satisfies Meta<typeof ProfilePostsGridView>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getAllByRole('img')).toHaveLength(8)
    await expect(canvas.getByAltText('Mock publication 1')).toBeInTheDocument()
  },
}

export const SelectPost: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByAltText('Mock publication 3'))

    await expect(args.onPostSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'post-3' }))
  },
}

export const Loading: Story = {
  args: {
    posts: [],
    isLoading: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByLabelText('Profile publications')).toHaveAttribute('aria-busy', 'true')
    await expect(canvas.queryAllByRole('img')).toHaveLength(0)
  },
}

export const LoadingNextPage: Story = {
  args: {
    hasNextPage: true,
    isFetchingNextPage: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getAllByRole('img')).toHaveLength(8)
  },
}

export const Empty: Story = {
  args: {
    posts: [],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('No publications yet.')).toBeInTheDocument()
  },
}

export const LoadFailed: Story = {
  args: {
    posts: [],
    errorMessage: 'Failed to load publications. Please try again.',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByRole('alert')).toHaveTextContent(
      'Failed to load publications. Please try again.'
    )
  },
}
