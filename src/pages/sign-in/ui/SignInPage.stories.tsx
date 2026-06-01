import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { SignInPage } from './SignInPage'

const meta = {
  title: 'pages/SignInPage',
  component: SignInPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      navigation: {
        pathname: '/sign-in',
      },
    },
  },
} satisfies Meta<typeof SignInPage>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
