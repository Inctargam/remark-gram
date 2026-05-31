import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'

import { BottomBar } from './BottomBar'

const meta = {
  title: 'widgets/navigation/BottomBar',
  component: BottomBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      navigation: { pathname: '/' },
    },
    docs: {
      description: {
        component:
          'Мобильная горизонтальная навигация (5 пунктов). ' +
          'Лейблы скрыты визуально через sr-only, но присутствуют в DOM и доступны скринридерам. ' +
          'Активный пункт определяется через usePathname — props не нужны.',
      },
    },
  },
  decorators: [
    (Story) => (
      // Имитируем ширину мобильного устройства
      <div style={{ width: '360px' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    className: { control: false },
  },
} satisfies Meta<typeof BottomBar>

export default meta

type Story = StoryObj<typeof meta>

/** Home активен (pathname="/"). */
export const Default: Story = {}

/** Активна иконка Profile. */
export const ProfileActive: Story = {
  parameters: {
    nextjs: { navigation: { pathname: '/profile' } },
  },
  play: async ({ canvas }) => {
    const profileLink = canvas.getByRole('link', { name: 'My Profile' })

    await expect(profileLink).toHaveAttribute('aria-current', 'page')
  },
}

/** Активен Search. */
export const SearchActive: Story = {
  parameters: {
    nextjs: { navigation: { pathname: '/search' } },
  },
}

/** Активен Messenger. */
export const MessengerActive: Story = {
  parameters: {
    nextjs: { navigation: { pathname: '/messenger' } },
  },
}

/**
 * Лейблы присутствуют в DOM как sr-only, не display:none.
 * Скринридеры их читают — это видно в accessibility-tree.
 */
export const AccessibilityLabels: Story = {
  play: async ({ canvas }) => {
    // Все пять пунктов доступны по роли link с текстовым лейблом
    const links = canvas.getAllByRole('link')

    await expect(links).toHaveLength(5)
    await expect(canvas.getByRole('link', { name: 'Home' })).toBeInTheDocument()
    await expect(canvas.getByRole('link', { name: 'My Profile' })).toBeInTheDocument()
  },
}
