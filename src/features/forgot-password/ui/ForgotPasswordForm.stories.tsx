import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, userEvent, waitFor } from 'storybook/test'

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
  play: async ({ canvas, canvasElement }) => {
    const email = canvas.getByLabelText('Email')
    const recaptcha = canvas.getByRole('checkbox', { name: "I'm not a robot" })
    const submitButton = canvas.getByRole('button', { name: 'Send Link' })

    await expect(submitButton).toBeDisabled()

    await userEvent.type(email, 'epam@epam.com')
    await expect(submitButton).toBeDisabled()

    await userEvent.click(recaptcha)

    await waitFor(async () => {
      await expect(recaptcha).toHaveAttribute('aria-checked', 'true')
    })

    await expect(submitButton).toBeEnabled()

    await userEvent.click(submitButton)

    await expect(canvasElement.querySelector('[role="status"]')).toHaveTextContent(
      'The link has been sent by email.'
    )
    await expect(canvasElement.querySelector('button[type="submit"]')).toHaveTextContent(
      'Send Link Again'
    )
  },
}
