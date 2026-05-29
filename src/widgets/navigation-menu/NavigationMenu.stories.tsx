import type { Meta, StoryObj } from 'storybook/react'
import { fn } from 'storybook/test'

import { NavigationMenu } from './NavigationMenu'

const meta = {
  title: 'widgets/NavigationMenu',
  component: NavigationMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    Story => (
      <div style={{ width: '360px' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    activeItem: {
      control: 'select',
      options: ['home', 'create', 'profile', 'search', 'messenger'],
      description: 'Активный пункт навигации',
    },
    onNavigate: { description: 'Коллбэк при выборе пункта' },
  },
  args: {
    onNavigate: fn(),
  },
} satisfies Meta<typeof NavigationMenu>

export default meta

type Story = StoryObj<typeof meta>

export const Home: Story = {
  args: { activeItem: 'home' },
}

export const Create: Story = {
  args: { activeItem: 'create' },
}

export const Profile: Story = {
  args: { activeItem: 'profile' },
}

export const Search: Story = {
  args: { activeItem: 'search' },
}

export const Messenger: Story = {
  args: { activeItem: 'messenger' },
}
