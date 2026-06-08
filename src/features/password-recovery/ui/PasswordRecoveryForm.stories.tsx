import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'

import { PasswordRecoveryForm } from './PasswordRecoveryForm'

const meta = {
  title: 'features/PasswordRecoveryForm',
  component: PasswordRecoveryForm,
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
} satisfies Meta<typeof PasswordRecoveryForm>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    await expect(
      canvas.getByRole('heading', { name: 'Email verification link expired' })
    ).toBeInTheDocument()
    await expect(
      canvas.getByText(
        'Looks like the verification link has expired. Not to worry, we can send the link again'
      )
    ).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Resend link' })).toBeEnabled()
    await expect(canvasElement.querySelector('img')).toBeInTheDocument()
  },
}
