import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, userEvent, within } from 'storybook/test'

import { PasswordRecoveryExpiredLink } from './PasswordRecoveryExpiredLink'

const meta = {
  title: 'features/PasswordRecoveryExpiredLink',
  component: PasswordRecoveryExpiredLink,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div
        style={{
          minHeight: 'calc(100vh - 60px)',
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          padding: '35px 16px 48px',
          backgroundColor: 'var(--color-dark-700)',
        }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PasswordRecoveryExpiredLink>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    email: 'epam@epam.com',
  },
  play: async ({ canvas, canvasElement }) => {
    const documentBody = within(canvasElement.ownerDocument.body)

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

    await userEvent.click(canvas.getByRole('button', { name: 'Resend link' }))

    await expect(
      documentBody.getByText('We have sent a link to confirm your email to epam@epam.com')
    ).toBeInTheDocument()
  },
}
