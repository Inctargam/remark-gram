import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, userEvent } from 'storybook/test'

import { ForgotPasswordForm } from './ForgotPasswordForm'

const meta = {
  title: 'features/ForgotPasswordForm',
  component: ForgotPasswordForm,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '24px', backgroundColor: 'var(--color-dark-900)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ForgotPasswordForm>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    const email = canvas.getByLabelText('Email')
    const submitButton = canvas.getByRole('button', { name: 'Send Link' })

    await expect(submitButton).toBeDisabled()

    await userEvent.type(email, 'epam@epam.com')

    await expect(submitButton).toBeEnabled()
  },
}
