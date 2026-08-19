import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, screen, userEvent } from 'storybook/test'

import { PaymentResultModal } from './PaymentResultModal'

const meta = {
  title: 'features/BuySubscription/PaymentResultModal',
  component: PaymentResultModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: {
        iframeHeight: 300,
        inline: false,
      },
    },
  },
  args: {
    outcome: 'success',
    onClose: fn(),
  },
} satisfies Meta<typeof PaymentResultModal>

export default meta

type Story = StoryObj<typeof meta>

/** Успешная оплата: текст и кнопка `OK` с макета. */
export const Success: Story = {
  play: async ({ args }) => {
    const dialog = await screen.findByRole('dialog')

    await expect(dialog).toHaveTextContent('Payment was successful!')

    await userEvent.click(screen.getByRole('button', { name: 'OK' }))

    await expect(args.onClose).toHaveBeenCalled()
  },
}

/** Отказ: другой заголовок, текст и кнопка `Back to payment`. */
export const Error: Story = {
  args: {
    outcome: 'failed',
  },
  play: async ({ args }) => {
    const dialog = await screen.findByRole('dialog')

    await expect(dialog).toHaveTextContent('Transaction failed. Please, write to support')

    await userEvent.click(screen.getByRole('button', { name: 'Back to payment' }))

    await expect(args.onClose).toHaveBeenCalled()
  },
}

/** Результата нет — модалка не рендерится. */
export const NoResult: Story = {
  args: {
    outcome: null,
  },
  play: async () => {
    await expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  },
}
