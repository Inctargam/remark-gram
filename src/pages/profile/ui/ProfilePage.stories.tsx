import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { ProfilePage } from './ProfilePage'

const meta = {
  title: 'pages/ProfilePage',
  component: ProfilePage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      navigation: {
        pathname: '/profile',
      },
    },
  },
} satisfies Meta<typeof ProfilePage>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
