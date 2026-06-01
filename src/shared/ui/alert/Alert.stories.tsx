import type { Meta, StoryObj } from '@storybook/react'

import { Alert } from './Alert'

const meta: Meta<typeof Alert> = {
  title: 'Shared/UI/Alert',
  component: Alert,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof Alert>

export const Error: Story = {
  args: {
    variant: 'error',
    children: (
      <>
        <b>Error!</b> Server is not available
      </>
    ),
  },
}

export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Your settings are saved',
  },
}

export const WithClose: Story = {
  args: {
    variant: 'error',
    children: (
      <>
        <b>Error!</b> Server is not available
      </>
    ),
    onClose: () => {},
  },
}