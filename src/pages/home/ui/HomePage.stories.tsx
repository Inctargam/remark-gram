import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'

import type { Post } from '@/entities/post'
import { AppShellView } from '@/widgets/app-shell'

import { HomePage } from './HomePage'

const createMockPosts = (): Post[] =>
  Array.from({ length: 4 }, (_, index) => ({
    id: `mock-user-1-post-${String(index + 1).padStart(2, '0')}`,
    ownerId: 'mock-user-1',
    ownerUsername: 'UserName',
    ownerAvatarUrl: null,
    images: [],
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

    await expect(canvas.getByRole('heading', { name: 'Registered users:' })).toBeInTheDocument()
    await expect(canvas.getByText('2,150 registered users')).toBeInTheDocument()
    await expect(canvasElement.querySelectorAll('article')).toHaveLength(4)
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
    await expect(canvasElement.querySelectorAll('article')).toHaveLength(0)
  },
}

export const AuthenticatedDesktop: Story = {
  globals: {
    viewport: {
      value: 'desktop',
      isRotated: false,
    },
  },
  render: (args) => (
    <AppShellView status="authenticated" onLogout={() => Promise.resolve()}>
      <HomePage {...args} />
    </AppShellView>
  ),
  play: async ({ canvas, canvasElement }) => {
    const placeholders = canvasElement.querySelectorAll('article')

    await expect(canvas.getByRole('navigation', { name: 'Primary navigation' })).toBeVisible()
    await expect(placeholders).toHaveLength(4)
    await expect(Math.round(placeholders[0].getBoundingClientRect().width)).toBe(234)
    await expect(Math.round(placeholders[0].getBoundingClientRect().height)).toBe(391)
  },
}

export const AuthenticatedMobile: Story = {
  globals: {
    viewport: {
      value: 'mobile2',
      isRotated: false,
    },
  },
  render: (args) => (
    <AppShellView status="authenticated" onLogout={() => Promise.resolve()}>
      <HomePage {...args} />
    </AppShellView>
  ),
  play: async ({ canvas, canvasElement }) => {
    const placeholders = canvasElement.querySelectorAll('article')
    const firstPlaceholderBounds = placeholders[0].getBoundingClientRect()
    const secondPlaceholderBounds = placeholders[1].getBoundingClientRect()

    await expect(canvas.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible()
    await expect(placeholders).toHaveLength(4)
    await expect(Math.round(firstPlaceholderBounds.width)).toBe(382)
    await expect(Math.round(secondPlaceholderBounds.left)).toBe(
      Math.round(firstPlaceholderBounds.left)
    )
    await expect(secondPlaceholderBounds.top).toBeGreaterThan(firstPlaceholderBounds.bottom)
  },
}
