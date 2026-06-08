import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { PasswordRecoveryPage } from './PasswordRecoveryPage'

const meta = {
  title: 'pages/PasswordRecoveryPage',
  component: PasswordRecoveryPage,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof PasswordRecoveryPage>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
