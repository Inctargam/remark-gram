import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, screen, userEvent } from 'storybook/test'

import { PaymentConsentModal } from './PaymentConsentModal'

const meta = {
  title: 'features/BuySubscription/PaymentConsentModal',
  component: PaymentConsentModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: {
        iframeHeight: 320,
        inline: false,
      },
    },
  },
  args: {
    open: true,
    provider: 'stripe',
    isPending: false,
    onConfirm: fn(),
    onOpenChange: fn(),
  },
} satisfies Meta<typeof PaymentConsentModal>

export default meta

type Story = StoryObj<typeof meta>

/** Шаг 10 ТЗ: без галочки `I agree` кнопка `OK` заблокирована. */
export const ConsentRequired: Story = {
  play: async () => {
    await screen.findByRole('dialog')

    await expect(screen.getByRole('button', { name: 'OK' })).toBeDisabled()
  },
}

/** С галочкой `OK` разблокируется и запускает оплату. */
export const Agreed: Story = {
  play: async ({ args }) => {
    await screen.findByRole('dialog')

    await userEvent.click(screen.getByRole('checkbox', { name: 'I agree' }))

    const confirmButton = screen.getByRole('button', { name: 'OK' })

    await expect(confirmButton).toBeEnabled()

    await userEvent.click(confirmButton)

    await expect(args.onConfirm).toHaveBeenCalled()
  },
}

/** Закрытие крестиком — отмена: платёж не создаётся. */
export const Cancelled: Story = {
  play: async ({ args }) => {
    await screen.findByRole('dialog')

    await userEvent.click(screen.getByRole('button', { name: 'Close' }))

    await expect(args.onOpenChange).toHaveBeenCalledWith(false)
    await expect(args.onConfirm).not.toHaveBeenCalled()
  },
}

/** Пока создаётся сессия, `OK` заблокирован даже с проставленной галочкой. */
export const Pending: Story = {
  args: {
    isPending: true,
  },
  play: async () => {
    await screen.findByRole('dialog')

    await expect(screen.getByRole('button', { name: 'OK' })).toBeDisabled()
  },
}

/** Оплата через PayPal: в модалке показывается логотип PayPal. */
export const PaypalProvider: Story = {
  args: {
    provider: 'paypal',
  },
  play: async () => {
    await screen.findByRole('dialog')

    const paypalIcon = document.querySelector('use[href$="#icon-paypal"]')

    await expect(paypalIcon).toBeInTheDocument()
  },
}
