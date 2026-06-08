import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, userEvent } from 'storybook/test'

import { CreateNewPasswordForm } from './CreateNewPasswordForm'

const meta = {
  title: 'features/CreateNewPasswordForm',
  component: CreateNewPasswordForm,
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
} satisfies Meta<typeof CreateNewPasswordForm>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    const submitButton = canvas.getByRole('button', { name: 'Create new password' })

    await expect(submitButton).toBeDisabled()

    await userEvent.type(canvas.getByLabelText('New password'), '123456')
    await userEvent.type(canvas.getByLabelText('Password confirmation'), '654321')
    await userEvent.click(submitButton)

    await expect(canvas.getByText('The passwords must match')).toBeInTheDocument()
  },
}
