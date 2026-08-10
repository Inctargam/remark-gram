import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, screen, userEvent } from 'storybook/test'

import { HeaderMobileMenu } from './HeaderMobileMenu'

const meta = {
  title: 'widgets/HeaderMobileMenu',
  component: HeaderMobileMenu,
  tags: ['autodocs'],
  args: {
    onLogout: fn(),
  },
} satisfies Meta<typeof HeaderMobileMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const OpensMenu: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Open menu' }))

    await expect(await screen.findByRole('menuitem', { name: 'Profile Settings' })).toBeVisible()
    await expect(screen.getByRole('menuitem', { name: 'Statistics' })).toBeVisible()
    await expect(screen.getByRole('menuitem', { name: 'Favorites' })).toBeVisible()
    await expect(screen.getByRole('menuitem', { name: 'Log Out' })).toBeVisible()
  },
}
