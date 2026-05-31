import type { Meta, StoryObj } from '@storybook/react'
// fn() creates a spy function — clicks are recorded and shown in the Actions panel.
import { fn } from 'storybook/test'

import { Header } from './Header'

const meta = {
  title: 'widgets/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: {
    // fullscreen — the header uses width: 100%, centered layout would clip it.
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
    // ReactNode cannot be represented as a form control — disable to avoid a broken input.
    languageSelector: {
      control: false,
      description: 'Слот для компонента выбора языка (ReactNode)',
    },
    onLoginClick: { description: 'Коллбэк кнопки Log in' },
    onSignupClick: { description: 'Коллбэк кнопки Sign up' },
  },
  // Callbacks defined at meta level are shared by all stories — no need to repeat them.
  // Each click appears as an event in the Actions panel.
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
    // Placeholder for the real Select component — demonstrates the languageSelector slot.
    languageSelector: (
      <span style={{ color: 'var(--color-light-100)', fontSize: '14px' }}>🌐 EN</span>
    ),
  },
}
