import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent } from 'storybook/test'

import { Checkbox } from '@/shared/ui/checkbox'

import { AccountManagementView } from './AccountManagementView'

const meta = {
  title: 'widgets/AccountManagementView',
  component: AccountManagementView,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: {
    accountType: 'personal',
    errorMessage: null,
    isLoading: false,
    isPersonalDisabled: false,
    selectedPlanId: 'day',
    subscriptionQueue: [],
    onAccountTypeChange: fn(),
    onPlanChange: fn(),
    onProviderSelect: fn(),
  },
} satisfies Meta<typeof AccountManagementView>

export default meta

type Story = StoryObj<typeof meta>

/** Живой чекбокс подключён фичей; в сторях вместо него — тот же UI-кит без мутации. */
const autoRenewalSlot = <Checkbox checked>Auto-Renewal</Checkbox>

/** Личный аккаунт: на макете виден только блок Account type. */
export const Personal: Story = {
  play: async ({ canvas }) => {
    expect(canvas.queryByText('Your subscription costs:')).not.toBeInTheDocument()
    expect(canvas.queryByRole('button', { name: 'Pay with Stripe' })).not.toBeInTheDocument()
  },
}

/** Выбран Business, подписки ещё нет: планы и кнопки оплаты. */
export const BusinessWithoutSubscription: Story = {
  args: {
    accountType: 'business',
  },
  play: async ({ canvas, args }) => {
    expect(canvas.getByText('Your subscription costs:')).toBeInTheDocument()

    await userEvent.click(canvas.getByRole('button', { name: 'Pay with Stripe' }))

    expect(args.onProviderSelect).toHaveBeenCalledWith('stripe')
  },
}

/** Кнопка PayPal запускает тот же сценарий покупки с провайдером paypal. */
export const PaypalProviderSelect: Story = {
  args: {
    accountType: 'business',
  },
  play: async ({ canvas, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Pay with PayPal' }))

    expect(args.onProviderSelect).toHaveBeenCalledWith('paypal')
  },
}

/** Активная подписка: сверху Current Subscription, Personal заблокирован, заголовок планов другой. */
export const BusinessWithSubscription: Story = {
  args: {
    accountType: 'business',
    autoRenewalSlot,
    isPersonalDisabled: true,
    subscriptionQueue: [
      {
        id: 'current',
        expiresAt: '2022-02-12T00:00:00.000Z',
        nextPaymentAt: '2022-02-13T00:00:00.000Z',
      },
    ],
  },
  play: async ({ canvas }) => {
    expect(canvas.getByText('12.02.2022')).toBeInTheDocument()
    expect(canvas.getByText('13.02.2022')).toBeInTheDocument()
    expect(canvas.getByText('Change your subscription:')).toBeInTheDocument()
    // base-ui renders a radio as a `span[role=radio]`, so the lock is `aria-disabled`,
    // not the native `disabled` attribute.
    expect(canvas.getByRole('radio', { name: 'Personal' })).toHaveAttribute('aria-disabled', 'true')
  },
}

/** UC-3: вторая подписка куплена поверх активной — очередь из двух строк. */
export const SubscriptionQueue: Story = {
  args: {
    accountType: 'business',
    autoRenewalSlot,
    isPersonalDisabled: true,
    subscriptionQueue: [
      { id: 'current', expiresAt: '2022-02-12T00:00:00.000Z', nextPaymentAt: null },
      {
        id: 'next',
        expiresAt: '2022-02-19T00:00:00.000Z',
        nextPaymentAt: '2022-02-19T00:00:00.000Z',
      },
    ],
  },
  play: async ({ canvas }) => {
    // Дата следующего платежа только у хвоста очереди: остальное уже оплачено.
    expect(canvas.getAllByRole('row')).toHaveLength(3)
    expect(canvas.getByText('—')).toBeInTheDocument()
    // Хвост очереди: та же дата в обеих колонках — доступ кончается и тогда же списание.
    expect(canvas.getAllByText('19.02.2022')).toHaveLength(2)
  },
}

/** Автопродление выключено — платить больше не будут, дату показывать нечем. */
export const SubscriptionWithoutAutoRenewal: Story = {
  args: {
    accountType: 'business',
    autoRenewalSlot: <Checkbox>Auto-Renewal</Checkbox>,
    isPersonalDisabled: true,
    subscriptionQueue: [
      { id: 'current', expiresAt: '2022-02-12T00:00:00.000Z', nextPaymentAt: null },
    ],
  },
}

export const Loading: Story = {
  args: {
    isLoading: true,
  },
}

export const LoadError: Story = {
  args: {
    errorMessage: 'Failed to load subscription data. Please try again.',
  },
}

/** Пока платёжного флоу нет, кнопки провайдеров отрисованы, но не кликаются. */
export const WithoutPaymentFlow: Story = {
  args: {
    accountType: 'business',
    onProviderSelect: undefined,
  },
  play: async ({ canvas }) => {
    expect(canvas.getByRole('button', { name: 'Pay with Stripe' })).toBeDisabled()
  },
}
