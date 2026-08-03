import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, screen, userEvent, within } from 'storybook/test'

import { PostActionsMenu } from './PostActionsMenu'

const meta = {
  title: 'features/post-actions/PostActionsMenu',
  component: PostActionsMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    onEdit: fn(),
    onDelete: fn(),
  },
} satisfies Meta<typeof PostActionsMenu>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: 'Post actions' }))

    // The menu renders in a portal, so its items are looked up in the whole document.
    await expect(await screen.findByRole('menuitem', { name: 'Edit Post' })).toBeVisible()
    await expect(screen.getByRole('menuitem', { name: 'Delete Post' })).toBeVisible()

    await userEvent.click(screen.getByRole('menuitem', { name: 'Edit Post' }))

    await expect(args.onEdit).toHaveBeenCalledOnce()
    await expect(args.onDelete).not.toHaveBeenCalled()
  },
}

export const DeleteSelected: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: 'Post actions' }))
    await userEvent.click(await screen.findByRole('menuitem', { name: 'Delete Post' }))

    await expect(args.onDelete).toHaveBeenCalledOnce()
    await expect(args.onEdit).not.toHaveBeenCalled()
  },
}
