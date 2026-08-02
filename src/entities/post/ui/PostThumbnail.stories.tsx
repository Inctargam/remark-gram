import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'

import type { Post } from '@/entities/post'
import { PostThumbnail } from '@/entities/post'

const createImageUrl = (label: string, hue: number) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080"><rect width="1080" height="1080" fill="hsl(${hue}, 42%, 32%)"/><text x="50%" y="52%" fill="hsl(${hue}, 60%, 88%)" font-family="sans-serif" font-size="220" text-anchor="middle" dominant-baseline="middle">${label}</text></svg>`
  )}`

const post: Post = {
  id: 'post-1',
  ownerId: 'mock-user-1',
  ownerUsername: 'UserName',
  ownerAvatarUrl: null,
  images: [{ url: createImageUrl('1', 210), width: 1080, height: 1080 }],
  description: 'Mock publication 1. Seeded post used until the posts backend is ready.',
  createdAt: '2026-07-01T12:00:00.000Z',
  updatedAt: '2026-07-01T12:00:00.000Z',
}

const meta = {
  title: 'entities/post/PostThumbnail',
  component: PostThumbnail,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: { post },
  render: (args) => (
    <div style={{ width: '234px' }}>
      <PostThumbnail {...args} />
    </div>
  ),
} satisfies Meta<typeof PostThumbnail>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvas.getByAltText('Mock publication 1. Seeded post used until the posts backend is ready.')
    ).toBeInTheDocument()
  },
}

export const WithoutDescription: Story = {
  args: {
    post: { ...post, description: '' },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByAltText('Publication by UserName')).toBeInTheDocument()
  },
}

export const Grid: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gap: '12px',
        gridTemplateColumns: 'repeat(4, 234px)',
      }}>
      {Array.from({ length: 8 }, (_, index) => (
        <PostThumbnail
          key={index}
          post={{
            ...post,
            id: `post-${index + 1}`,
            description: `Mock publication ${index + 1}`,
            images: [
              { ...post.images[0]!, url: createImageUrl(`${index + 1}`, (index * 37) % 360) },
            ],
          }}
        />
      ))}
    </div>
  ),
}
