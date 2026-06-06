import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { ForgotPasswordPage } from './ForgotPasswordPage'

const meta = {
  title: 'pages/ForgotPasswordPage',
  component: ForgotPasswordPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      navigation: {
        pathname: '/forgot-password',
      },
    },
  },
} satisfies Meta<typeof ForgotPasswordPage>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
