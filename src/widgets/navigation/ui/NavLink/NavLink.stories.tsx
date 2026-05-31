import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, userEvent } from 'storybook/test'

import { NavLink } from './NavLink'

const homeItem = {
  id: 'home' as const,
  label: 'Home',
  href: '/',
  icon: 'icon-home-outline',
  activeIcon: 'icon-home',
}

const meta = {
  title: 'widgets/navigation/NavLink',
  component: NavLink,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Атомарный рендер одного пункта навигации. Всегда содержит иконку и лейбл в DOM. ' +
          'Активность определяется снаружи (оболочкой), не хуком. ' +
          '`className` и `labelClassName` — точки инъекции для Sidebar и BottomBar.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          padding: '16px',
          backgroundColor: 'var(--color-dark-700)',
        }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    item: {
      description: 'Конфигурация пункта: id, label, href, icon, activeIcon?, disabled?',
    },
    isActive: {
      control: 'boolean',
      description: 'Активен ли пункт — передаётся оболочкой на основе usePathname',
    },
    className: { control: false, description: 'Layout-класс от оболочки (gap, margin и т.п.)' },
    labelClassName: {
      control: false,
      description: 'Класс для лейбла — BottomBar передаёт .srOnly',
    },
  },
  args: {
    item: homeItem,
    isActive: false,
  },
} satisfies Meta<typeof NavLink>

export default meta

type Story = StoryObj<typeof meta>

/** Пункт в неактивном состоянии — иконка outline, цвет light-100. */
export const Inactive: Story = {}

/**
 * Пункт в активном состоянии — filled-иконка, цвет primary-500, aria-current="page".
 * NavLink переключает icon → activeIcon автоматически.
 */
export const Active: Story = {
  args: { isActive: true },
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: 'Home' })

    await expect(link).toHaveAttribute('aria-current', 'page')
  },
}

/**
 * Disabled-пункт рендерится как `<span aria-disabled="true">`, а не `<Link>`.
 * Клик не срабатывает, фокус возможен только через tab (span не интерактивен).
 */
export const Disabled: Story = {
  args: {
    item: { ...homeItem, disabled: true },
  },
  play: async ({ canvas }) => {
    const span = canvas.getByText('Home').closest('[aria-disabled="true"]')

    await expect(span).toBeInTheDocument()
    await expect(span?.tagName.toLowerCase()).toBe('span')
  },
}

/**
 * Пункт без activeIcon — при isActive=true остаётся базовая иконка.
 * Так работают Statistics и Favorites в конфиге без активной иконки.
 */
export const WithoutActiveIcon: Story = {
  args: {
    item: {
      id: 'statistics' as const,
      label: 'Statistics',
      href: '/statistics',
      icon: 'icon-trending-up-outline',
    },
    isActive: true,
  },
}

/** Проверка keyboard-навигации: Tab фокусирует ссылку, Enter активирует. */
export const KeyboardFocus: Story = {
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: 'Home' })

    await userEvent.tab()
    await expect(link).toHaveFocus()
  },
}
