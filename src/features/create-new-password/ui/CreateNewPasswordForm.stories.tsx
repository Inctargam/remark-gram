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
    await userEvent.tab()

    await expect(
      canvas.getByText(
        'Password must contain 0-9, a-z, A-Z, ! " # $ % & \' ( ) * + , - . / : ; < = > ? @ [ \\ ] ^ _ { | } ~'
      )
    ).toBeInTheDocument()
    await expect(canvas.getByText('Passwords must match')).toBeInTheDocument()
    await expect(submitButton).toBeDisabled()
  },
}

export const WithoutPasswordConfirmation: Story = {
  play: async ({ canvas }) => {
    const submitButton = canvas.getByRole('button', { name: 'Create new password' })

    await userEvent.type(canvas.getByLabelText('New password'), 'Password1')
    await userEvent.click(canvas.getByLabelText('Password confirmation'))
    await userEvent.tab()

    await expect(canvas.queryByText('Passwords must match')).not.toBeInTheDocument()
    await expect(submitButton).toBeDisabled()
  },
}
