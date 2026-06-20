import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, userEvent } from 'storybook/test'

import { SignInForm } from './SignInForm'

const meta = {
  title: 'features/SignInForm',
  component: SignInForm,
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
} satisfies Meta<typeof SignInForm>

export default meta

type Story = StoryObj<typeof meta>

/** Начальное состояние формы. Все поля пустые, кнопка неактивна. */
export const Default: Story = {}

/** Ошибки валидации — появляются при blur на каждом поле. */
export const WithValidationErrors: Story = {
  play: async ({ canvas }) => {
    await userEvent.type(canvas.getByLabelText('Email'), 'notanemail')
    await userEvent.tab()

    await userEvent.type(canvas.getByLabelText('Password'), 'ab')
    await userEvent.tab()

    await expect(
      canvas.getByText('The email must match the format example@example.com')
    ).toBeInTheDocument()
    await expect(canvas.getByText('Minimum number of characters 6')).toBeInTheDocument()
  },
}
