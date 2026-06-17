import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { CreateNewPasswordPage } from './CreateNewPasswordPage'

const meta = {
  title: 'pages/CreateNewPasswordPage',
  component: CreateNewPasswordPage,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof CreateNewPasswordPage>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
