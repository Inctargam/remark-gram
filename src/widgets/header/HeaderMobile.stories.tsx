import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent } from 'storybook/test'

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
    languageSelector: {
      control: false,
      description: 'Слот для селектора языка',
    },
    onMenuClick: { description: 'Открывает модалку с дополнительными пунктами навигации' },
  },
  args: {
    onMenuClick: fn(),
  },
} satisfies Meta<typeof HeaderMobile>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithLanguageSelector: Story = {
  args: {
    languageSelector: (
      <span style={{ color: 'var(--color-light-100)', fontSize: '14px' }}>🌐 EN</span>
    ),
  },
}

/** Логотип — ссылка на главную. */
export const LogoLink: Story = {
  play: async ({ canvas }) => {
    const logo = canvas.getByRole('link', { name: 'remarkgram' })

    await expect(logo).toHaveAttribute('href', '/')
  },
}

/** Клик по кнопке меню вызывает onMenuClick. */
export const MenuClick: Story = {
  play: async ({ args, canvas }) => {
    const button = canvas.getByRole('button', { name: 'Open menu' })

    await userEvent.click(button)
    await expect(args.onMenuClick).toHaveBeenCalledOnce()
  },
}
