import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent } from 'storybook/test'

import { Header } from './Header'

const meta = {
  title: 'widgets/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Десктопный хедер. Discriminated union по `variant` — ' +
          'TypeScript не допустит `notificationCount` при `variant="guest"`.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'radio',
      options: ['auth', 'guest'],
      description: 'Переключает набор допустимых пропсов',
    },
    languageSelector: {
      control: false,
      description: 'Слот для переключателя языка',
    },
  },
  args: {
    variant: 'guest',
  },
} satisfies Meta<typeof Header>

export default meta
type Story = StoryObj<typeof meta>

export const Guest: Story = {}

export const GuestWithLabels: Story = {
  args: {
    variant: 'guest',
    loginLabel: 'Войти',
    signupLabel: 'Зарегистрироваться',
  },
}

export const GuestWithoutAuthActions: Story = {
  args: {
    variant: 'guest',
    showAuthActions: false,
  },
  play: async ({ canvas }) => {
    await expect(canvas.queryByText('Log in')).not.toBeInTheDocument()
    await expect(canvas.queryByText('Sign up')).not.toBeInTheDocument()
  },
}

export const Auth: Story = {
  args: { variant: 'auth', notificationCount: 0 },
}

export const AuthWithNotifications: Story = {
  args: { variant: 'auth', notificationCount: 5 },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('5')).toBeInTheDocument()
  },
}

export const AuthWithManyNotifications: Story = {
  args: { variant: 'auth', notificationCount: 247 },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('99+')).toBeInTheDocument()
  },
}

export const AuthWithLanguageSelector: Story = {
  args: {
    variant: 'auth',
    languageSelector: (
      <span style={{ color: 'var(--color-light-100)', fontSize: '14px' }}>English</span>
    ),
  },
}

export const LogoLink: Story = {
  play: async ({ canvas }) => {
    const logo = canvas.getByRole('link', { name: 'Remarkgram' })

    await expect(logo).toHaveAttribute('href', '/')
  },
}

export const BellClick: Story = {
  args: { variant: 'auth', notificationCount: 3, onBellClick: fn() },
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Notifications' }))
    await expect((args as { onBellClick?: () => void }).onBellClick).toHaveBeenCalledOnce()
  },
}
