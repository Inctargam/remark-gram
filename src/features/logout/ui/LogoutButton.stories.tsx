import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent } from 'storybook/test'

import { LogoutButton } from './LogoutButton'

const meta = {
  title: 'features/LogoutButton',
  component: LogoutButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Кнопка выхода из аккаунта. Принимает `onLogout` — async-функцию (например RTK Query trigger). ' +
          'Сначала дожидается выхода, затем редиректит на /sign-in через router.push. ' +
          'Использует `<button>`, а не `<Link>` — Link начинает навигацию синхронно и обгоняет async-выход.',
      },
    },
  },
  argTypes: {
    onLogout: {
      description:
        'Вызывается перед редиректом. Может быть async — компонент ждёт завершения через await.',
    },
  },
  args: {
    onLogout: fn(),
  },
} satisfies Meta<typeof LogoutButton>

export default meta

type Story = StoryObj<typeof meta>

/** Кнопка в дефолтном состоянии. */
export const Default: Story = {}

/** Клик вызывает onLogout — router.push не срабатывает в Storybook (замокан). */
export const Click: Story = {
  play: async ({ args, canvas }) => {
    const button = canvas.getByRole('button', { name: 'Log Out' })

    await userEvent.click(button)
    await expect(args.onLogout).toHaveBeenCalledOnce()
  },
}

/** Без onLogout: клик не падает — вызов через optional chaining (`onLogout?.()`). */
export const WithoutHandler: Story = {
  args: { onLogout: undefined },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: 'Log Out' })

    // Не выбрасывает ошибку даже без пропа
    await userEvent.click(button)
    await expect(button).toBeInTheDocument()
  },
}
