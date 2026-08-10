import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'

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
    },
    languageSelector: {
      control: false,
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
  args: { variant: 'auth' },
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
    await expect(canvas.getByRole('link', { name: 'Remarkgram' })).toHaveAttribute('href', '/')
  },
}
