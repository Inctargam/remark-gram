import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import type { ReactElement } from 'react'
import { expect, userEvent } from 'storybook/test'

import { LogoutButton } from '@/features/logout'

import { Sidebar } from './Sidebar'

const meta = {
  title: 'widgets/navigation/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      navigation: { pathname: '/' },
    },
    docs: {
      description: {
        component:
          'Десктопная вертикальная навигация. Читает URL через usePathname — ' +
          'активный пункт не передаётся снаружи. ' +
          'Принимает `footer`-слот для LogoutButton и других действий.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: '720px', backgroundColor: 'var(--color-dark-900)' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    footer: {
      control: false,
      description: 'Слот подвала — обычно LogoutButton. Позиционируется Sidebar, не компонентом-потребителем.',
    },
    className: { control: false },
  },
} satisfies Meta<typeof Sidebar>

export default meta

type Story = StoryObj<typeof meta>

// render-функция вместо args: JSX выполняется внутри контекста Storybook,
// где Next.js router уже смонтирован — иначе useRouter() бросает invariant.
const withFooter = (): ReactElement => <Sidebar footer={<LogoutButton />} />

/** Sidebar с активным Home (pathname="/"). */
export const Default: Story = {
  render: withFooter,
}

/** Активен Profile — pathname точно совпадает с href. */
export const ProfileActive: Story = {
  render: withFooter,
  parameters: {
    nextjs: { navigation: { pathname: '/profile' } },
  },
  play: async ({ canvas }) => {
    const profileLink = canvas.getByRole('link', { name: 'My Profile' })

    await expect(profileLink).toHaveAttribute('aria-current', 'page')
  },
}

/**
 * Вложенный путь: /profile/123 → Profile остаётся активным.
 * isPathActive проверяет startsWith(`${href}/`), поэтому подмаршруты работают.
 */
export const NestedPathActive: Story = {
  render: withFooter,
  parameters: {
    nextjs: { navigation: { pathname: '/profile/123' } },
  },
  play: async ({ canvas }) => {
    const profileLink = canvas.getByRole('link', { name: 'My Profile' })

    await expect(profileLink).toHaveAttribute('aria-current', 'page')
  },
}

/** Sidebar без footer-слота — кнопка выхода не рендерится. */
export const WithoutFooter: Story = {
  render: () => <Sidebar />,
}

/** Keyboard-навигация: второй Tab попадает на Create. */
export const KeyboardFocus: Story = {
  render: withFooter,
  play: async ({ canvas }) => {
    const createLink = canvas.getByRole('link', { name: 'Create' })

    await userEvent.tab()
    await userEvent.tab()
    await expect(createLink).toHaveFocus()
  },
}
