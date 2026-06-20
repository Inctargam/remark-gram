import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, screen, userEvent } from 'storybook/test'
import { fn } from 'storybook/test'

import { SignUpSuccessModal } from './SignUpSuccessModal'

const meta = {
  title: 'features/SignUpSuccessModal',
  component: SignUpSuccessModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Модалка после успешной регистрации. Сообщает пользователю о отправленном письме. ' +
          'Кнопка OK и крестик закрывают модалку и сбрасывают форму. ' +
          'Клик по бэкдропу отключён (disablePointerDismissal).',
      },
    },
  },
  args: {
    open: true,
    email: 'user@example.com',
    onClose: fn(),
  },
} satisfies Meta<typeof SignUpSuccessModal>

export default meta

type Story = StoryObj<typeof meta>

/** Модалка с подтверждением отправки письма. */
export const Open: Story = {}

/** Закрытие по кнопке OK. */
export const CloseByOk: Story = {
  play: async ({ args }) => {
    await userEvent.click(screen.getByRole('button', { name: 'OK' }))
    await expect(args.onClose).toHaveBeenCalledOnce()
  },
}

/** Закрытие по крестику. */
export const CloseByX: Story = {
  play: async ({ args }) => {
    await userEvent.click(screen.getByRole('button', { name: 'Close' }))
    await expect(args.onClose).toHaveBeenCalledOnce()
  },
}
