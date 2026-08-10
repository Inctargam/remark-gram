import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'

import { HeaderMobile } from './HeaderMobile'

const meta = {
  title: 'widgets/HeaderMobile',
  component: HeaderMobile,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '360px' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    languageSelector: { control: false },
    menu: { control: false },
  },
  args: {
    variant: 'guest',
  },
} satisfies Meta<typeof HeaderMobile>

export default meta
type Story = StoryObj<typeof meta>

export const Guest: Story = {}

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
  args: {
    variant: 'auth',
    menu: <button type="button">Menu</button>,
  },
}

export const WithLanguageSelector: Story = {
  args: {
    languageSelector: <span style={{ color: 'var(--color-light-100)', fontSize: '14px' }}>EN</span>,
  },
}

export const LogoLink: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'Remarkgram' })).toHaveAttribute('href', '/')
  },
}
