import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, userEvent } from 'storybook/test'

import { SignUpForm } from './SignUpForm'

const meta = {
  title: 'features/SignUpForm',
  component: SignUpForm,
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
} satisfies Meta<typeof SignUpForm>

export default meta

type Story = StoryObj<typeof meta>

/** Начальное состояние формы. Все поля пустые, кнопка неактивна. */
export const Default: Story = {}

/** Ошибки валидации — появляются при blur на каждом поле. */
export const WithValidationErrors: Story = {
  play: async ({ canvas }) => {
    await userEvent.type(canvas.getByLabelText('Username'), 'ab')
    await userEvent.tab()

    await userEvent.type(canvas.getByLabelText('Email'), 'notanemail')
    await userEvent.tab()

    await userEvent.type(canvas.getByLabelText('Password'), 'simple')
    await userEvent.tab()

    await userEvent.type(canvas.getByLabelText('Password confirmation'), 'different')
    await userEvent.tab()

    await expect(canvas.getByText('Minimum number of characters 6')).toBeInTheDocument()
    await expect(
      canvas.getByText('The email must match the format example@example.com')
    ).toBeInTheDocument()
    await expect(canvas.getByText('Passwords must match')).toBeInTheDocument()
  },
}
