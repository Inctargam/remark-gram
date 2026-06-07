import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, screen, userEvent } from 'storybook/test'

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
    email: {
      description: 'Email текущего пользователя — отображается в тексте модалки подтверждения.',
    },
  },
  args: {
    onLogout: fn(),
    email: 'Epam@epam.com',
  },
} satisfies Meta<typeof LogoutButton>

export default meta

type Story = StoryObj<typeof meta>

/** Кнопка в дефолтном состоянии. */
export const Default: Story = {}

/** Клик открывает модалку подтверждения с email пользователя. */
export const OpensModal: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Log Out' }))

    await expect(screen.getByRole('dialog')).toBeInTheDocument()
    await expect(screen.getByText(/Epam@epam.com/)).toBeInTheDocument()
  },
}

/** Нажатие Yes вызывает onLogout и закрывает модалку. */
export const ConfirmLogout: Story = {
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Log Out' }))
    await userEvent.click(screen.getByRole('button', { name: 'Yes' }))

    await expect(args.onLogout).toHaveBeenCalledOnce()
    await expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  },
}

/** Нажатие No закрывает модалку без вызова onLogout. */
export const CancelLogout: Story = {
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Log Out' }))
    await userEvent.click(screen.getByRole('button', { name: 'No' }))

    await expect(args.onLogout).not.toHaveBeenCalled()
    await expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  },
}

/** Крестик закрывает модалку без вызова onLogout. */
export const CloseByX: Story = {
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Log Out' }))
    await userEvent.click(screen.getByRole('button', { name: 'Close' }))

    await expect(args.onLogout).not.toHaveBeenCalled()
    await expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  },
}

/** Без onLogout клик не падает — вызов через optional chaining. */
export const WithoutHandler: Story = {
  args: { onLogout: undefined },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Log Out' }))

    await expect(screen.getByRole('dialog')).toBeInTheDocument()
  },
}
