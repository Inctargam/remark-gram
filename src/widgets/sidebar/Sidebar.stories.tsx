import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent } from 'storybook/test'

import { Sidebar, type SidebarItem } from './Sidebar'

const disabledItems: SidebarItem[] = [
  { id: 'home', label: 'Home', href: '/', icon: 'icon-home-outline', activeIcon: 'icon-home' },
  {
    id: 'create',
    label: 'Create',
    href: '/create',
    icon: 'icon-plus-square-outline',
    activeIcon: 'icon-plus-square',
    disabled: true,
  },
  {
    id: 'profile',
    label: 'My Profile',
    href: '/profile',
    icon: 'icon-person-outline',
    activeIcon: 'icon-person',
  },
  {
    id: 'messenger',
    label: 'Messenger',
    href: '/messenger',
    icon: 'icon-message-circle-outline',
    activeIcon: 'icon-message-circle',
  },
  { id: 'search', label: 'Search', href: '/search', icon: 'icon-search-outline' },
  {
    id: 'statistics',
    label: 'Statistics',
    href: '/statistics',
    icon: 'icon-trending-up-outline',
  },
  { id: 'favorites', label: 'Favorites', href: '/favorites', icon: 'icon-bookmark-outline' },
]

const meta = {
  title: 'widgets/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: '720px', backgroundColor: 'var(--color-dark-900)' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    currentPathname: {
      control: 'text',
      description: 'Override текущего URL для Storybook и тестов',
    },
  },
  args: {
    onLogout: fn(),
    onNavigate: fn(),
  },
} satisfies Meta<typeof Sidebar>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    currentPathname: '/',
  },
}

export const ProfileActive: Story = {
  args: {
    currentPathname: '/profile',
  },
}

export const Focus: Story = {
  args: {
    currentPathname: '/focus-preview',
  },
  play: async ({ canvas }) => {
    const createLink = canvas.getByRole('link', { name: 'Create' })

    await userEvent.tab()
    await userEvent.tab()
    await expect(createLink).toHaveFocus()
  },
}

export const Disabled: Story = {
  args: {
    currentPathname: '/disabled-preview',
    items: disabledItems,
  },
  play: async ({ args, canvas }) => {
    const homeLink = canvas.getByRole('link', { name: 'Home' })
    const createItem = canvas.getByText('Create').closest('[aria-disabled="true"]')

    await expect(homeLink).not.toHaveAttribute('aria-current')
    await expect(createItem).toBeInTheDocument()

    await userEvent.click(canvas.getByText('Create'))
    await expect(args.onNavigate).not.toHaveBeenCalledWith('create')
  },
}

export const Interactive: Story = {
  args: {
    currentPathname: '/search',
  },
  play: async ({ args, canvas }) => {
    const homeLink = canvas.getByRole('link', { name: 'Home' })
    const searchLink = canvas.getByRole('link', { name: 'Search' })
    const logoutButton = canvas.getByRole('button', { name: 'Log Out' })

    await expect(homeLink).not.toHaveAttribute('aria-current')
    await expect(searchLink).toHaveAttribute('href', '/search')
    await expect(searchLink).toHaveAttribute('aria-current', 'page')

    await userEvent.click(logoutButton)
    await expect(args.onLogout).toHaveBeenCalled()
  },
}
