import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'

import { AppShellView } from './AppShellView'

const meta = {
  component: AppShellView,
  args: {
    children: <main>Page content</main>,
    onLogout: fn(),
  },
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AppShellView>

export default meta
type Story = StoryObj<typeof meta>

export const Loading: Story = {
  args: {
    status: 'loading',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Page content')).toBeVisible()
    await expect(canvas.queryByRole('banner')).not.toBeInTheDocument()
  },
}

export const Guest: Story = {
  args: {
    status: 'guest',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Log in' })).toBeVisible()
    await expect(canvas.queryByRole('button', { name: 'Log Out' })).not.toBeInTheDocument()
  },
}

export const Authenticated: Story = {
  args: {
    status: 'authenticated',
  },
  play: async ({ args, canvas, canvasElement }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Log Out' }))
    const documentCanvas = within(canvasElement.ownerDocument.body)
    await userEvent.click(documentCanvas.getByRole('button', { name: 'Yes' }))
    await expect(args.onLogout).toHaveBeenCalledOnce()
  },
}
