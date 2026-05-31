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
          'TS не допустит `notificationCount` при `variant="guest"` и наоборот.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'radio',
      options: ['auth', 'guest'],
      description: 'Переключает набор допустимых пропов',
    },
    languageSelector: {
      control: false,
      description: 'Слот для селектора языка (ReactNode) — заготовка под i18n',
    },
  },
  args: {
    variant: 'guest',
    onLoginClick: fn(),
    onSignupClick: fn(),
  },
} satisfies Meta<typeof Header>

export default meta

type Story = StoryObj<typeof meta>

export const Guest: Story = {
  args: { variant: 'guest' },
}

export const GuestWithLabels: Story = {
  args: {
    variant: 'guest',
    loginLabel: 'Войти',
    signupLabel: 'Зарегистрироваться',
  },
}

export const Auth: Story = {
  args: { variant: 'auth', notificationCount: 0 },
}

export const AuthWithNotifications: Story = {
  args: { variant: 'auth', notificationCount: 5 },
  play: async ({ canvas }) => {
    const badge = canvas.getByText('5')

    await expect(badge).toBeInTheDocument()
  },
}

/** Переполнение: 100+ уведомлений → показывает '99+'. */
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
      <span style={{ color: 'var(--color-light-100)', fontSize: '14px' }}>🌐 EN</span>
    ),
  },
}

/** Логотип — ссылка на главную. */
export const LogoLink: Story = {
  args: { variant: 'guest' },
  play: async ({ canvas }) => {
    const logo = canvas.getByRole('link', { name: 'remarkgram' })

    await expect(logo).toHaveAttribute('href', '/')
  },
}

/** Клик по колокольчику вызывает onBellClick. */
export const BellClick: Story = {
  args: { variant: 'auth', notificationCount: 3, onBellClick: fn() },
  play: async ({ args, canvas }) => {
    const bell = canvas.getByRole('button', { name: 'Notifications' })

    await userEvent.click(bell)
    // StoryObj инферит args как полный union — сужение по variant недоступно в play,
    // поэтому явный каст к нужному подтипу.
    await expect((args as { onBellClick?: () => void }).onBellClick).toHaveBeenCalledOnce()
  },
}
