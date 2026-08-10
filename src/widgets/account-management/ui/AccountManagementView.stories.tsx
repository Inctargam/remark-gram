import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent } from 'storybook/test'

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
    currentSubscription: null,
    errorMessage: null,
    isLoading: false,
    isPersonalDisabled: false,
    selectedPlanId: 'day',
    onAccountTypeChange: fn(),
    onPlanChange: fn(),
    onProviderSelect: fn(),
  },
} satisfies Meta<typeof AccountManagementView>

export default meta

type Story = StoryObj<typeof meta>

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

/** Активная подписка: сверху Current Subscription, Personal заблокирован, заголовок планов другой. */
export const BusinessWithSubscription: Story = {
  args: {
    accountType: 'business',
    currentSubscription: {
      expiresAt: '2022-02-12T00:00:00.000Z',
      nextPaymentAt: '2022-02-13T00:00:00.000Z',
    },
    isPersonalDisabled: true,
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

/** Автопродление выключено — платить больше не будут, дату показывать нечем. */
export const SubscriptionWithoutAutoRenewal: Story = {
  args: {
    accountType: 'business',
    currentSubscription: {
      expiresAt: '2022-02-12T00:00:00.000Z',
      nextPaymentAt: null,
    },
    isPersonalDisabled: true,
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
