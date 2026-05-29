import type { Meta, StoryObj } from 'storybook/react'
import { fn } from 'storybook/test'

import { Header } from './Header'

const meta = {
  title: 'widgets/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    variant: {
      control: 'radio',
      options: ['auth', 'guest'],
      description: 'Вариант хедера: для авторизованного или гостевого пользователя',
    },
    notificationCount: {
      control: { type: 'number', min: 0 },
      description: 'Количество уведомлений (только для variant="auth")',
    },
    languageSelector: {
      control: false,
      description: 'Слот для компонента выбора языка (ReactNode)',
    },
    onLoginClick: { description: 'Коллбэк кнопки Log in' },
    onSignupClick: { description: 'Коллбэк кнопки Sign up' },
  },
  args: {
    onLoginClick: fn(),
    onSignupClick: fn(),
  },
} satisfies Meta<typeof Header>

export default meta

type Story = StoryObj<typeof meta>

export const Guest: Story = {
  args: {
    variant: 'guest',
  },
}

export const Auth: Story = {
  args: {
    variant: 'auth',
    notificationCount: 0,
  },
}

export const AuthWithNotifications: Story = {
  args: {
    variant: 'auth',
    notificationCount: 5,
  },
}

export const AuthWithLanguageSelector: Story = {
  args: {
    variant: 'auth',
    languageSelector: (
      <span style={{ color: 'var(--color-light-100)', fontSize: '14px' }}>🌐 EN</span>
    ),
  },
}
