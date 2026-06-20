import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { SignUpPage } from './SignUpPage'

const meta = {
  title: 'pages/SignUpPage',
  component: SignUpPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      navigation: {
        pathname: '/sign-up',
      },
    },
  },
} satisfies Meta<typeof SignUpPage>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
