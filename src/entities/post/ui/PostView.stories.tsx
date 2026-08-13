import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'

import type { Post } from '@/entities/post'
import { PostView } from '@/entities/post'
import { DropdownMenu } from '@/shared/ui/dropdown-menu'

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
  createdAt: '2026-07-03T12:00:00.000Z',
  updatedAt: '2026-07-03T12:00:00.000Z',
}

/** Stands in for `features/post-actions` until UC-2/UC-3 land: the entity only owns the slot. */
const OwnerActions = () => (
  <DropdownMenu
    ariaLabel="Post actions"
    items={[
      { id: 'edit', label: 'Edit Post', iconId: 'icon-edit-2-outline', onSelect: fn() },
      { id: 'delete', label: 'Delete Post', iconId: 'icon-trash-outline', onSelect: fn() },
    ]}
  />
)

const meta = {
  title: 'entities/post/PostView',
  component: PostView,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: { post },
  // Popup size from the design: the post view fills a fixed 972x564 box.
  render: (args) => (
    <div style={{ width: '972px', height: '564px', background: 'var(--color-dark-300)' }}>
      <PostView {...args} />
    </div>
  ),
} satisfies Meta<typeof PostView>

export default meta

type Story = StoryObj<typeof meta>

export const OwnPost: Story = {
  args: {
    actions: <OwnerActions />,
    canInteract: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Username shows twice: in the post header and in front of the description.
    await expect(canvas.getAllByText('UserName')).toHaveLength(2)
    await expect(
      canvas.getByText(/Seeded post used until the posts backend is ready/)
    ).toBeVisible()
    await expect(canvas.getByText('July 3, 2026')).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Post actions' })).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Like' })).toBeDisabled()
    await expect(canvas.getByRole('button', { name: 'Share' })).toBeDisabled()
    await expect(canvas.getByRole('button', { name: 'Save' })).toBeDisabled()
    await expect(canvas.getByLabelText('Add a comment')).toBeEnabled()
    await expect(canvas.getByRole('button', { name: 'Publish' })).toBeDisabled()
  },
}

export const AuthenticatedPost: Story = {
  args: {
    canInteract: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.queryByRole('button', { name: 'Post actions' })).not.toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Like' })).toBeDisabled()
    await expect(canvas.getByRole('button', { name: 'Share' })).toBeDisabled()
    await expect(canvas.getByRole('button', { name: 'Save' })).toBeDisabled()
    await expect(canvas.getByLabelText('Add a comment')).toBeEnabled()
    await expect(canvas.getByRole('button', { name: 'Publish' })).toBeDisabled()
  },
}

export const GuestPost: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.queryByRole('button', { name: 'Post actions' })).not.toBeInTheDocument()
    await expect(canvas.queryByRole('button', { name: 'Like' })).not.toBeInTheDocument()
    await expect(canvas.queryByRole('button', { name: 'Share' })).not.toBeInTheDocument()
    await expect(canvas.queryByRole('button', { name: 'Save' })).not.toBeInTheDocument()
    await expect(canvas.queryByLabelText('Add a comment')).not.toBeInTheDocument()
    await expect(canvas.queryByRole('button', { name: 'Publish' })).not.toBeInTheDocument()
  },
}

export const ToggleAnswers: Story = {
  args: {
    canInteract: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const answersToggle = canvas.getByRole('button', { name: 'View Answers (1)' })

    await expect(answersToggle).toHaveAttribute('aria-expanded', 'false')
    await expect(
      canvas.getByText('Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
    ).toBeVisible()
    await expect(
      canvas.queryByText('Reply mock text for a threaded comment.')
    ).not.toBeInTheDocument()

    await userEvent.click(answersToggle)

    await expect(canvas.getByRole('button', { name: 'Hide Answers' })).toHaveAttribute(
      'aria-expanded',
      'true'
    )
    await expect(canvas.getByText('Reply mock text for a threaded comment.')).toBeVisible()

    await userEvent.click(canvas.getByRole('button', { name: 'Hide Answers' }))

    await expect(canvas.getByRole('button', { name: 'View Answers (1)' })).toHaveAttribute(
      'aria-expanded',
      'false'
    )
  },
}

export const PublishComment: Story = {
  args: {
    canInteract: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const commentInput = canvas.getByLabelText('Add a comment')
    const publishButton = canvas.getByRole('button', { name: 'Publish' })

    await expect(publishButton).toBeDisabled()

    await userEvent.type(commentInput, 'Nice mock comment')

    await expect(publishButton).toBeEnabled()

    await userEvent.click(publishButton)

    await expect(await canvas.findByText('Nice mock comment')).toBeVisible()
    await expect(await canvas.findByText('Just now')).toBeVisible()
    await expect(commentInput).toHaveValue('')
    await expect(publishButton).toBeDisabled()
    await expect(canvas.getByRole('button', { name: 'Publish' })).toBeVisible()
    await expect(canvas.getByLabelText('Add a comment')).toBeVisible()
  },
}

export const LongDescription: Story = {
  args: {
    post: {
      ...post,
      description: `A very long publication description. ${'Sed ut perspiciatis unde omnis iste natus error sit voluptatem. '.repeat(
        9
      )}`,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText(/A very long publication description/)).toBeVisible()
  },
}

export const WithoutDescription: Story = {
  args: {
    post: { ...post, description: '' },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // A post without a description still shows its publication date.
    await expect(canvas.getByText('July 3, 2026')).toBeInTheDocument()
    await expect(canvas.getByAltText('Publication by UserName')).toBeInTheDocument()
  },
}

export const SeveralPhotos: Story = {
  args: {
    post: {
      ...post,
      images: [
        { url: createImageUrl('1', 210), width: 1080, height: 1080 },
        { url: createImageUrl('2', 40), width: 1080, height: 1080 },
        { url: createImageUrl('3', 120), width: 1080, height: 1080 },
        { url: createImageUrl('4', 280), width: 1080, height: 1080 },
        { url: createImageUrl('5', 320), width: 1080, height: 1080 },
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // First photo: only the forward arrow is rendered, the gallery does not wrap around.
    await expect(
      canvas.queryByRole('button', { name: 'Show previous photo' })
    ).not.toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Show photo 1' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )

    await userEvent.click(canvas.getByRole('button', { name: 'Show next photo' }))

    await expect(canvas.getByRole('button', { name: 'Show photo 2' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
    await expect(canvas.getByRole('button', { name: 'Show previous photo' })).toBeInTheDocument()

    await userEvent.click(canvas.getByRole('button', { name: 'Show photo 5' }))

    await expect(canvas.queryByRole('button', { name: 'Show next photo' })).not.toBeInTheDocument()
  },
}
